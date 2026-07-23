# Contrato de Agente de OpenSpec

Superficies legibles por máquina de la CLI `openspec`, verificadas contra `src/` (auditoría de culminación, 2026-06-11). Cada forma que se muestra a continuación está documentada a partir del código emisor.

## 1. Convenciones generales

- **Un documento JSON por invocación.** En modo `--json`, stdout transporta exactamente un documento JSON (formateado con sangría de 2 espacios). La prosa humana, los spinners y el banner de la store se envían a stderr.
- **Banner de la store.** En modo humano, una raíz seleccionada por la store imprime `Using OpenSpec root: <id> (<path>)` en stderr. Nunca se imprime en modo JSON.
- **La capitalización de las claves depende de la superficie** (consulte Inconsistencias conocidas): los payloads de store/doctor/context usan `snake_case`; los payloads de workflow (`status`, `instructions`, `new change`, `validate`, `list`) usan `camelCase`, excepto el objeto `root` incrustado, que siempre usa `store_id`.
- **Las claves opcionales se omiten, no se asignan como `null`**, en la mayoría de los payloads (por ejemplo, `root.store_id`, `member.path`). Las excepciones que usan `null` explícito se indican por forma (payloads de `store doctor` `git.*`, payloads de fallo).

## 2. El sobre de diagnóstico

Todas las máquinas de diagnóstico legibles por máquina (`StoreDiagnostic`) comparten una misma forma de sobre:

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Los diagnósticos aparecen en dos posiciones: **matrices de estado** (`status: StoreDiagnostic[]` en el nivel superior o por entrada) para los hallazgos de estado, y **errores lanzados** convertidos en una matriz `status` de un solo elemento cuando falla un comando.

## 3. Selección de raíz y `RootOutput`

Todos los comandos de resolución de raíz (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) resuelven una única raíz de OpenSpec siguiendo un orden de prioridad:

1. `--store <id>` → la raíz del almacén registrado (`source: "store"`).
2. En caso contrario, el ancestro más cercano que contenga `openspec/`: forma de planificación → `source: "nearest"` (se ignora un puntero `store:` con una advertencia en stderr); directorio solo de configuración con un puntero `store:` válido → ese almacén, `source: "declared"`.
3. Sin raíz más cercana + `defaultStore` global establecido (`openspec config set defaultStore <id>`) → ese almacén, `source: "global_default"`; un id obsoleto falla con el error subyacente del almacén y una `fix` que indica `openspec config unset defaultStore`.
4. Sin raíz más cercana, sin valor predeterminado + existen almacenes registrados → error `no_root_with_registered_stores`.
5. Sin raíz, sin valor predeterminado, sin almacenes: los comandos de estructura inicial tratan el directorio de trabajo actual como `source: "implicit"`; los comandos de diagnóstico (`doctor`, `context`) fallan con `no_openspec_root` en su lugar — solo inspeccionan, nunca crean estructura inicial.

Las cargas JSON exitosas incluyen la raíz incrustada:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Contrato de fallo de raíz**: en modo JSON, un fallo de resolución imprime `{ ...commandNullShape, "status": [diagnostic] }` en stdout y sale con el código 1.

## 4. Formas JSON de los comandos

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — tenga en cuenta que el `status` por cambio es un enum de cadena aquí. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Cambio: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Especificación: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Sale con el código 1 cuando cualquier elemento falla.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`. El campo `requires` de cada artefacto son los ids de sus dependencias directas (presente para todos los estados, por lo que el conjunto de requeridos transitivos se puede calcular incluso cuando el artefacto está en estado `done`); `missingDeps` solo aparece cuando el estado es `blocked`. El estado `"skipped"` marca un artefacto cuya ruta `generates` está dentro de `specs/` en un cambio cuyo archivo `.openspec.yaml` declara `skip_specs: true`; satisface las dependencias pero no se debe crear. Sin cambios activos: `{ "changes": [], "message", "root" }`, sale con código 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`. El valor `"skipped": true` (junto con `"warning"`) aparece cuando el cambio declara `skip_specs: true` y este artefacto se omite — no cree sus archivos. Una entrada de dependencia con `skipped: true` se satisface sin archivos — no intente leer sus rutas.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — las entradas resueltas incluyen root/specs/fetch; las no resueltas incluyen store_id + estado de advertencia. El índice tiene un límite de 50 KB (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Éxito: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Fallo: `{ "change": null, "status": [d] }`, sale con código 1.

### 4.8 `archive <name> --json`
Éxito: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Fallo: `{ "archive": null, "root"?, "status": [d] }`, sale con código 1. El modo JSON es estrictamente no interactivo: cada punto de solicitud se convierte en un código `archive_*`.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`. `drift` (solo presente en una comprobación de almacén respaldada por git que tiene una referencia de seguimiento ascendente) son recuentos de adelanto/retraso respecto a la última ascendente obtenida, no respecto al remoto en vivo. Los hallazgos de estado de cualquier gravedad salen con código 0. Carga de fallo: `{ "root": null, "store": null, "references": [], "status": [d] }`, sale con código 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. DISPONIBLE = ruta presente Y estado vacío. `--code-workspace <path>` escribe `{folders:[{name,path}]}` (solo almacenes referenciados disponibles, prefijos `ref:`); en modo JSON la escritura se ejecuta antes de la impresión, por lo que stdout contiene exactamente un documento incluso si falla la escritura. Fallo: `{ "root": null, "members": [], "status": [d] }`, sale con código 1.

### 4.11 `store ... --json`
configuración/registro: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. eliminación de registro/eliminación: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. lista: `{ "stores": [{id, root}], "status": [] }`. doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = desconocido/no comprobado). Los hallazgos de estado salen con código 0; los fallos salen con código 1 con la forma nula correspondiente. La cancelación de solicitud sale con código 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: matriz simple `[ {name, description, artifacts, source} ]`. `templates`: objeto con claves `{ "<artifactId>": {path, source} }`. Ambas se basan en el directorio de trabajo actual, no tienen claves root/status.

## 5. Contrato de códigos de salida

| Situación | Código de salida | Stdout |
|---|---|---|
| Éxito, incluyendo hallazgos de estado (doctor/context/store doctor) | 0 | la carga útil |
| Fallo de comando en modo `--json` | 1 | un documento JSON con `status: [d]` y la forma nula del comando |
| `validate` con elementos fallidos | 1 | informe completo |
| Cancelación de solicitud (grupo `store`, modo humano) | 130 | solo stderr |

## 6. Catálogo de códigos de diagnóstico

### Resolución
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; paso directo: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Estado de salud de la raíz de OpenSpec (error, sin corrección)
`openspec_store_root_missing`, `openspec_store_root_not_directory`, `openspec_root_missing`, `openspec_root_not_directory`, `openspec_config_missing`, `openspec_config_not_file`, `openspec_specs_not_directory`, `openspec_changes_not_directory`, `openspec_archive_not_directory`. Durante la versión beta de los almacenes, `openspec/specs/`, `openspec/changes/` y `openspec/changes/archive/` pueden estar ausentes en una raíz sana; solo son errores de estado cuando están presentes pero no son directorios.

### Registro/identidad/estado del almacén
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Configuración/registro/eliminación de almacén
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_root_pointer_declared`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (advertencia en eliminación, error en doctor), `store_root_not_directory`.

### Git del almacén
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (advertencia), `store_clone_fragile_directories` (advertencia), `store_remote_divergence` (info, doctor), `store_checkout_drift` (info, doctor).

### Referencias (advertencia)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Relaciones (advertencia; doctor; context mantiene solo el del registro)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Archivo (modo JSON)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Escrituras de contexto
`context_file_exists`, `context_output_dir_missing`.

### Alternativas
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Inconsistencias conocidas

Registradas por la auditoría final; los cambios de nombre de claves publicadas son decisiones de producto pospuestas para después de esta versión:

1. ~~En modo `--json`, varias rutas de fallo imprimían solo stderr sin documento JSON.~~ Corregido en la ronda de pruebas final: `show`/`validate` con elementos desconocidos y ambiguos emiten `{status:[{code: unknown_item | ambiguous_item, ...}]}`; los errores lanzados en `status`/`instructions`/`list`/`show`/`validate` pasan por el asistente de fallo compatible con JSON (la forma nula del comando + `status`); `store <subcomando desconocido> --json` emite `{status:[{code: unknown_store_subcommand}]}`; `list` porta su forma nula `{changes|specs: [], root: null}` en fallos de resolución.
2. `store_root_missing` se emite con dos gravedades (advertencia en eliminación, error en el doctor del almacén) — depende del contexto, documentado anteriormente.
3. Convención de mayúsculas y minúsculas snake_case (familia de almacenes) frente a camelCase (familia de flujos de trabajo); `root.store_id` usa snake_case en todas partes.
4. Existen cuatro declaraciones de tipo de sobre paralelas en el código fuente; los diagnósticos de archivo nunca incluyen `target`.
5. `list --json` reutiliza la clave `status` como un enum de cadena por cambio.
6. Solo la salida de `validate` incluye un campo `version`.
7. `schemas`/`templates` ignoran la selección de raíz (se basan en el directorio de trabajo actual, no admiten `--store`).
8. Las formas de sustantivo obsoletas (subcomandos `change`/`spec`) emiten cargas sin sobre que no incluyen `root`/`status`.