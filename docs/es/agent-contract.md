# Contrato de Agente OpenSpec

Superficies legibles por máquina de la CLI `openspec`, verificadas contra `src/` (auditoría capstone, 2026-06-11). Cada forma a continuación está documentada desde el código emisor.

## 1. Convenciones generales

- **Un documento JSON por invocación.** En el modo `--json`, stdout contiene exactamente un documento JSON (pretty-printed con 2 espacios). La prosa humana, los spinners y la pancarta del almacén van a stderr.
- **Pancarta del almacén.** En el modo humano, una raíz seleccionada por el almacén imprime `Using OpenSpec root: <id> (<path>)` en stderr. Nunca se imprime en el modo JSON.
- **La capitalización de las claves depende de la superficie** (ver Inconsistencias conocidas): los payloads de store/doctor/context usan `snake_case`; los payloads de flujo de trabajo (`status`, `instructions`, `new change`, `validate`, `list`) usan `camelCase`, excepto el objeto incrustado `root`, que siempre usa `store_id`.
- **Las claves opcionales se omiten, no son nulas**, en la mayoría de los payloads (ej. `root.store_id`, `member.path`). Las excepciones que usan explícitamente `null` se mencionan por cada forma (doctor del almacén `git.*`, payloads de fallo).

## 2. La envolvente de diagnóstico

Una forma de envolvente es compartida por cada diagnóstico legible por máquina (`StoreDiagnostic`):

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Los diagnósticos aparecen en dos posiciones: **arrays de estado** (`status: StoreDiagnostic[]` al nivel superior o por entrada) para hallazgos de salud, y **errores lanzados** convertidos a un array `status` de un solo elemento al fallar el comando.

## 3. Selección de la raíz y `RootOutput`

Todos los comandos que resuelven la raíz (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) resuelven una raíz OpenSpec con una precedencia:

1. `--store <id>` → la raíz del almacén registrado (`source: "store"`).
2. De lo contrario, el ancestro más cercano con `openspec/`: forma de planificación → `source: "nearest"` (un puntero `store:` es ignorado con una advertencia en stderr); directorio solo de configuración con un puntero `store:` válido → ese almacén, `source: "declared"`.
3. No hay raíz más cercana + no existen almacenes registrados → error `no_root_with_registered_stores`.
4. Sin raíz, sin almacenes: los comandos de andamiaje tratan el cwd como `source: "implicit"`; los comandos de diagnóstico (`doctor`, `context`) fallan con `no_openspec_root` en su lugar — ellos inspeccionan, nunca crean andamios.

Los payloads JSON exitosos incrustan la raíz:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Contrato de fallo de la raíz**: en modo JSON, un fallo de resolución imprime `{ ...commandNullShape, "status": [diagnostic] }` en stdout y sale con código 1.

## 4. Formas JSON de los comandos

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — nota que el `status` por cambio es un enum de cadena aquí. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Cambio: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spec: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Sale con código 1 si algún elemento falla.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"ready"|"blocked", missingDeps?} ], "root" }`. Sin cambios activos: `{ "changes": [], "message", "root" }`, sale con código 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "template", "dependencies": [{id,done,path,description}], "unlocks", "root" }`.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — las entradas resueltas llevan root/specs/fetch; las no resueltas llevan store\_id + estado de advertencia. El índice está limitado a 50KB (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Éxito: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Fallo: `{ "change": null, "status": [d] }`, sale con código 1.

### 4.8 `archive <name> --json`
Éxito: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Fallo: `{ "archive": null, "root"?, "status": [d] }`, sale con código 1. El modo JSON es estrictamente no interactivo: cada punto de solicitud se convierte en un código `archive_*`.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "status": [] } | null, "references": [...], "status": [] }`. Los hallazgos de salud de cualquier severidad salen con código 0. Payload de fallo: `{ "root": null, "store": null, "references": [], "status": [d] }`, sale con código 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. DISPONIBLE = path presente Y status vacío. `--code-workspace <path>` escribe `{folders:[{name,path}]}` (solo almacenes referenciados disponibles, prefijos `ref:`); en el modo JSON la escritura se ejecuta antes de imprimir, por lo que stdout contiene exactamente un documento incluso si falla la escritura. Fallo: `{ "root": null, "members": [], "status": [d] }`, sale con código 1.

### 4.11 `store ... --json`
setup/register: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. unregister/remove: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. list: `{ "stores": [{id, root}], "status": [] }`. doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = desconocido/no sondeado). Los hallazgos de salud salen con código 0; los fallos salen con código 1 con la forma nula correspondiente. La cancelación por solicitud sale con código 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: array desnudo `[ {name, description, artifacts, source} ]`. `templates`: objeto clave-valor `{ "<artifactId>": {path, source} }`. Ambos basados en cwd, sin claves de raíz/estado.

## 5. Contrato de código de salida

| Situación | Salida | Stdout |
|---|---|---|
| Éxito, incluidos hallazgos de salud (doctor/context/store doctor) | 0 | el payload |
| Fallo del comando en modo `--json` | 1 | un documento JSON con `status: [d]` y la forma nula del comando |
| `validate` con elementos fallidos | 1 | informe completo |
| Cancelación por solicitud (grupo `store`, modo humano) | 130 | solo a stderr |

## 6. Catálogo de códigos de diagnóstico

### Resolución
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; paso directo: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Salud de OpenSpec-root (error, sin solución)
`openspec_store_root_missing`, `openspec_root_missing`, `openspec_config_missing`, `openspec_specs_missing`, `openspec_changes_missing`, `openspec_archive_missing`, más variantes `_not_directory` de cada uno.

### Registro/identidad/estado del almacén
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Configuración/registro/eliminación del almacén
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (advertencia en eliminación, error en doctor), `store_root_not_directory`.

### Git del almacén
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (advertencia), `store_clone_fragile_directories` (advertencia), `store_remote_divergence` (info, doctor).

### Referencias (advertencia)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Relaciones (advertencia; doctor; context solo mantiene la del registro)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Archivo (modo JSON)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Escrituras de Contexto
`context_file_exists`, `context_output_dir_missing`.

### Fallbacks
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Inconsistencias conocidas

Registradas por la auditoría capstone; los renombres de claves publicados son decisiones del producto diferidas más allá de este lanzamiento:

1. ~~En el modo `--json`, varias rutas de fallo imprimían solo en stderr sin ningún documento JSON.~~ Corregido en la ronda gauntlet capstone: `show`/`validate` emiten `{status:[{code: unknown_item | ambiguous_item, ...}]}`; los errores lanzados en `status`/`instructions`/`list`/`show`/`validate` pasan por el helper de fallo consciente del JSON (la forma nula del comando + `status`); `store <subcomando desconocido> --json` emite `{status:[{code: unknown_store_subcommand}]}`; `list` lleva su forma nula `{changes|specs: [], root: null}` en los fallos de resolución.
2. `store_root_missing` se emite con dos severidades (advertencia en eliminación, error en doctor) — dependiente del contexto, documentado arriba.
3. Capitalización de claves snake\_case (familia store) vs camelCase (familia flujo de trabajo); `root.store_id` es snake\_case en todas partes.
4. Existen cuatro declaraciones paralelas de tipo de envolvente en src; los diagnósticos de archivo nunca llevan `target`.
5. `list --json` reutiliza la clave `status` como un enum de cadena por cambio.
6. Solo la salida de `validate` lleva un campo `version`.
7. `schemas`/`templates` ignoran la selección de la raíz (basado en cwd, sin `--store`).
8. Las formas nominales obsoletas (`change`/`spec`) emiten payloads no envueltos sin `root`/`status`.