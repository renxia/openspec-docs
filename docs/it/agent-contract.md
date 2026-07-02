# OpenSpec Agent Contract

Superfici leggibili da macchina della CLI `openspec`, verificate contro `src/` (audit capstone, 2026-06-11). Ogni forma qui sotto è documentata dal codice emittente.

## 1. Convenzioni generali

- **Un documento JSON per invocazione.** In modalità `--json`, stdout contiene esattamente un documento JSON (formattato con 2 spazi). La prosa umana, i spinner e la barra dello store vanno a stderr.
- **Barra dello store.** In modalità umana, una root selezionata dallo store stampa `Using OpenSpec root: <id> (<path>)` su stderr. Non viene mai stampata in modalità JSON.
- **Il casing delle chiavi dipende dalla superficie** (vedi Incoerenze note): i payload di store/doctor/context utilizzano `snake_case`; i payload di workflow (`status`, `instructions`, `new change`, `validate`, `list`) utilizzano `camelCase`, ad eccezione dell'oggetto `root` incorporato, che utilizza sempre `store_id`.
- **Le chiavi opzionali sono omesse, non nulle**, nella maggior parte dei payload (es. `root.store_id`, `member.path`). Le eccezioni che utilizzano esplicitamente `null` sono specificate per forma (doctor dello store `git.*`, payload di fallimento).

## 2. L'inviluppo diagnostico

Una forma inviluppo è condivisa da ogni diagnostica leggibile dalla macchina (`StoreDiagnostic`):

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

I diagnostici appaiono in due posizioni: **array di status** (`status: StoreDiagnostic[]` al livello superiore o per voce) per i reperti di salute, e **errori lanciati** convertiti in un array `status` a elemento singolo in caso di fallimento del comando.

## 3. Selezione della Root e `RootOutput`

Tutti i comandi che risolvono la root (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) risolvono una root OpenSpec con una precedenza:

1. `--store <id>` → la root dello store registrato (`source: "store"`).
2. Altrimenti, l'antenato più vicino con `openspec/`: forma di pianificazione → `source: "nearest"` (un puntatore `store:` viene ignorato con un avviso su stderr); directory contenente solo configurazione con un valido puntatore `store:` → quel store, `source: "declared"`.
3. Nessuna root vicina + nessun store registrato esistono → errore `no_root_with_registered_stores`.
4. Nessuna root, nessun store: i comandi di scaffolding trattano la cwd come `source: "implicit"`; i comandi diagnostici (`doctor`, `context`) falliscono con `no_openspec_root` al posto di essi — ispezionano, non scaffoldano.

I payload JSON riusciti incorporano la root:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "nearest" | "implicit", "store_id": "id (solo quando selezionato dallo store)" }
```

**Contratto di fallimento della Root**: in modalità JSON un fallimento di risoluzione stampa `{ ...commandNullShape, "status": [diagnostic] }` su stdout ed esce con 1.

## 4. Forme JSON dei comandi

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — nota che lo `status` per ogni cambiamento è un enum stringa qui. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Change: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spec: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Esce con 1 se un qualsiasi elemento fallisce.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"ready"|"blocked", missingDeps?} ], "root" }`. Nessun cambiamento attivo: `{ "changes": [], "message", "root" }`, esce con 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "template", "dependencies": [{id,done,path,description}], "unlocks", "root" }`.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — le voci risolte contengono root/specs/fetch; quelle non risolte contengono store_id + status di avviso. L'indice è limitato a 50KB (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Successo: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Fallimento: `{ "change": null, "status": [d] }`, esce con 1.

### 4.8 `archive <name> --json`
Successo: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Fallimento: `{ "archive": null, "root"?, "status": [d] }`, esce con 1. La modalità JSON è strettamente non interattiva: ogni punto di prompt diventa un codice `archive_*`.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "status": [] } | null, "references": [...], "status": [] }`. I reperti di salute di qualsiasi severità fanno uscire con 0. Payload di fallimento: `{ "root": null, "store": null, "references": [], "status": [d] }`, esce con 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. DISPONIBILE = path presente E status vuoto. `--code-workspace <path>` scrive `{folders:[{name,path}]}` (solo store referenziati disponibili, prefissi `ref:`); in modalità JSON la scrittura viene eseguita prima della stampa in modo che stdout contenga esattamente un documento anche in caso di fallimento della scrittura. Fallimento: `{ "root": null, "members": [], "status": [d] }`, esce con 1.

### 4.11 `store ... --json`
setup/register: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. unregister/remove: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. list: `{ "stores": [{id, root}], "status": [] }`. doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = sconosciuto/non sondato). I reperti di salute fanno uscire con 0; i fallimenti escono con 1 con la forma null corrispondente. La cancellazione del prompt esce con 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: array nudo `[ {name, description, artifacts, source} ]`. `templates`: oggetto chiave `{ "<artifactId>": {path, source} }`. Entrambi basati sulla cwd, senza chiavi root/status.

## 5. Contratto di codice di uscita

| Situazione | Uscita | Stdout |
|---|---|---|
| Successo, inclusi i reperti di salute (doctor/context/store doctor) | 0 | il payload |
| Fallimento del comando in modalità `--json` | 1 | un documento JSON con `status: [d]` e la forma null del comando |
| `validate` con elementi falliti | 1 | report completo |
| Cancellazione del prompt (gruppo `store`, modalità umana) | 130 | solo su stderr |

## 6. Catalogo dei codici diagnostici

### Risoluzione
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; pass-through: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Salute di OpenSpec-root (errore, senza fix)
`openspec_store_root_missing`, `openspec_root_missing`, `openspec_config_missing`, `openspec_specs_missing`, `openspec_changes_missing`, `openspec_archive_missing`, più le varianti `_not_directory` di ciascuno.

### Registro/identità/stato dello store
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Setup/registrazione/rimozione dello store
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (avviso nella rimozione, errore in doctor), `store_root_not_directory`.

### Git dello store
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (avviso), `store_clone_fragile_directories` (avviso), `store_remote_divergence` (info, doctor).

### Referenze (avviso)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Relazioni (avviso; doctor; context ne conserva solo quella del registro)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Archive (modalità JSON)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Scritture di Context
`context_file_exists`, `context_output_dir_missing`.

### Fallback
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Incoerenze note

Registrate dall'audit capstone; i rinomi delle chiavi pubblicate sono decisioni di prodotto differite a questa release:

1. ~~In modalità `--json`, diversi percorsi di fallimento stampavano solo su stderr senza alcun documento JSON.~~ Corretto nel round gauntlet capstone: `show`/`validate` elementi sconosciuti e ambigui emettono `{status:[{code: unknown_item | ambiguous_item, ...}]}`; gli errori lanciati in `status`/`instructions`/`list`/`show`/`validate` passano attraverso l'aiutante di fallimento consapevole JSON (la forma null del comando + `status`); `store <sottocomando sconosciuto> --json` emette `{status:[{code: unknown_store_subcommand}]}`; `list` porta la sua forma null `{changes|specs: [], root: null}` nei fallimenti di risoluzione.
2. `store_root_missing` è emesso con due severità (avviso nella rimozione, errore in store doctor) — dipendente dal contesto, documentato sopra.
3. Casing delle chiavi snake_case (famiglia store) vs camelCase (famiglia workflow); `root.store_id` è snake_case ovunque.
4. Esistono quattro dichiarazioni di tipo inviluppo in src; i diagnostici di archive non contengono mai `target`.
5. `list --json` riutilizza la chiave `status` come enum stringa per ogni cambiamento.
6. Solo l'output di `validate` contiene un campo `version`.
7. `schemas`/`templates` ignorano la selezione della root (basati sulla cwd, senza `--store`).
8. Le forme nominali deprecate (`change`/`spec` sottocomando) emettono payload non inviluppati senza `root`/`status`.