# Contratto Agente OpenSpec

Superficie leggibili dalla macchina della CLI `openspec`, verificate rispetto a `src/` (controllo finale, 2026-06-11). Ogni struttura riportata di seguito è documentata a partire dal codice che la genera.

## 1. Convenzioni generali

- **Un documento JSON per invocazione.** In modalità `--json`, stdout trasmette esattamente un documento JSON (formattato con rientro di 2 spazi). Il testo in linguaggio naturale, gli indicatori di attività e il banner dello store vengono inviati a stderr.
- **Banner dello store.** In modalità testuale, una root selezionata dallo store stampa `Using OpenSpec root: <id> (<path>)` su stderr. Non viene mai stampato in modalità JSON.
- **Il maiuscolo/minuscolo delle chiavi dipende dalla superficie** (vedi Inconsistenze note): i carichi utili di store/doctor/context usano il `snake_case`; i carichi utili dei flussi di lavoro (`status`, `instructions`, `new change`, `validate`, `list`) usano il `camelCase`, ad eccezione dell'oggetto `root` incorporato, che utilizza sempre `store_id`.
- **Le chiavi opzionali vengono omesse, non impostate a null**, nella maggior parte dei carichi utili (es. `root.store_id`, `member.path`). Le eccezioni che utilizzano `null` esplicito sono indicate per ogni struttura (carichi utili di `git.*` del comando `doctor` dello store, carichi utili di errore).

## 2. La busta di diagnostica

Una forma di involucro è condivisa da ogni diagnostica leggibile dalla macchina (`StoreDiagnostic`):

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Le diagnostiche appaiono in due posizioni: **array di stato** (`status: StoreDiagnostic[]` a livello superiore o per voce) per i risultati relativi alla salute, e **errori generati** convertiti in un array `status` a singolo elemento in caso di fallimento del comando.

## 3. Selezione della root e `RootOutput`

Tutti i comandi di risoluzione della root (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) risolvono una sola root OpenSpec con la seguente precedenza:

1. `--store <id>` → la root del store registrato (`source: "store"`).
2. Altrimenti, l'antenato più vicino con `openspec/`: struttura di pianificazione → `source: "nearest"` (un puntatore `store:` viene ignorato con un avviso su stderr); directory di sola configurazione con un puntatore `store:` valido → quel store, `source: "declared"`.
3. Nessuna root vicina + `defaultStore` globale impostato (`openspec config set defaultStore <id>`) → quel store, `source: "global_default"`; un id non aggiornato fallisce con l'errore del store sottostante e un `fix` che indica `openspec config unset defaultStore`.
4. Nessuna root vicina, nessun default + esistono store registrati → errore `no_root_with_registered_stores`.
5. Nessuna root, nessun default, nessun store: i comandi di scaffolding trattano il cwd come `source: "implicit"`; i comandi di diagnostica (`doctor`, `context`) falliscono invece con `no_openspec_root` — essi ispezionano, non creano scaffolding.

I payload JSON di successo incorporano la root:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Contratto di fallimento della root**: in modalità JSON un fallimento di risoluzione stampa `{ ...commandNullShape, "status": [diagnostic] }` su stdout e restituisce il codice di uscita 1.

## 4. Forme JSON dei comandi

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — notare che il `status` per ogni cambiamento è un enum di stringhe qui. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Change: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spec: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Restituisce codice di uscita 1 se qualsiasi elemento fallisce.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`. Il campo `requires` di ogni artefatto contiene gli id delle sue dipendenze dirette (presente per ogni stato, quindi l'insieme di dipendenze transitive è calcolabile anche quando l'artefatto è `done`); `missingDeps` appare solo quando lo stato è `blocked`. Lo stato `"skipped"` contrassegna un artefatto il cui percorso `generates` si trova sotto `specs/` in un cambiamento il cui file `.openspec.yaml` dichiara `skip_specs: true`; esso soddisfa le dipendenze ma non deve essere creato. Nessun cambiamento attivo: `{ "changes": [], "message", "root" }`, codice di uscita 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`. `"skipped": true` (insieme a `"warning"`) appare quando il cambiamento dichiara `skip_specs: true` e questo artefatto viene saltato — non creare i suoi file. Una voce di dipendenza con `skipped: true` è soddisfatta senza file — non provare a leggere i suoi percorsi.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — le voci risolte riportano root/specs/fetch; le voci non risolte riportano store_id + stato di avviso. L'indice è limitato a 50KB (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Successo: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Fallimento: `{ "change": null, "status": [d] }`, codice di uscita 1.

### 4.8 `archive <name> --json`
Successo: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Fallimento: `{ "archive": null, "root"?, "status": [d] }`, codice di uscita 1. La modalità JSON è strettamente non interattiva: ogni punto di prompt diventa un codice `archive_*`.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`. `drift` (presente solo per un checkout di store supportato da git che ha un riferimento di tracciamento upstream) sono i conteggi di avanzamento/ritardo rispetto all'ultimo upstream scaricato, non al remoto live. I risultati relativi alla salute di qualsiasi gravità restituiscono codice di uscita 0. Payload di fallimento: `{ "root": null, "store": null, "references": [], "status": [d] }`, codice di uscita 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. DISPONIBILE = percorso presente E stato vuoto. `--code-workspace <path>` scrive `{folders:[{name,path}]}` (solo i store referenziati disponibili, prefissi `ref:`); in modalità JSON la scrittura viene eseguita prima della stampa, quindi stdout contiene esattamente un documento anche in caso di fallimento della scrittura. Fallimento: `{ "root": null, "members": [], "status": [d] }`, codice di uscita 1.

### 4.11 `store ... --json`
setup/registrazione: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. annullamento registrazione/rimozione: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. elenco: `{ "stores": [{id, root}], "status": [] }`. doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = sconosciuto/non verificato). I risultati relativi alla salute restituiscono codice di uscita 0; i fallimenti restituiscono codice di uscita 1 con la forma null corrispondente. L'annullamento del prompt restituisce codice di uscita 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: array semplice `[ {name, description, artifacts, source} ]`. `templates`: oggetto con chiavi `{ "<artifactId>": {path, source} }`. Entrambi basati sul cwd, senza chiavi root/status.

## 5. Contratto dei codici di uscita

| Situazione | Uscita | Stdout |
|---|---|---|
| Successo, inclusi i risultati relativi alla salute (doctor/context/store doctor) | 0 | il payload |
| Fallimento del comando in modalità `--json` | 1 | un documento JSON con `status: [d]` e la forma null del comando |
| `validate` con elementi falliti | 1 | rapporto completo |
| Annullamento del prompt (gruppo `store`, modalità umana) | 130 | solo stderr |

## 6. Catalogo dei codici di diagnostica

### Risoluzione
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; pass-through: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Salute della root OpenSpec (errore, nessuna correzione)
`openspec_store_root_missing`, `openspec_store_root_not_directory`, `openspec_root_missing`, `openspec_root_not_directory`, `openspec_config_missing`, `openspec_config_not_file`, `openspec_specs_not_directory`, `openspec_changes_not_directory`, `openspec_archive_not_directory`. Durante la beta dei store, `openspec/specs/`, `openspec/changes/` e `openspec/changes/archive/` possono essere assenti in una root sana; sono considerati errori di salute solo se presenti ma non come directory.

### Registro/identità/stato del store
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Configurazione/registrazione/rimozione del store
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_root_pointer_declared`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (warning in remove, error in doctor), `store_root_not_directory`.

### Git del store
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (warning), `store_clone_fragile_directories` (warning), `store_remote_divergence` (info, doctor), `store_checkout_drift` (info, doctor).

### Riferimenti (avviso)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Relazioni (avviso; doctor mantiene solo quella del registro)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Archivio (modalità JSON)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Scritture di context
`context_file_exists`, `context_output_dir_missing`.

### Fallback
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Inconsistenze note

Registrate dall'audit capstone; le rinominazioni delle chiavi pubblicate sono decisioni di prodotto rimandate oltre questa release:

1. ~~In modalità `--json`, diversi percorsi di fallimento stampavano solo su stderr senza documento JSON.~~ Corretto nella fase di capstone gauntlet: `show`/`validate` con elementi sconosciuti o ambigui emettono `{status:[{code: unknown_item | ambiguous_item, ...}]}`; gli errori generati in `status`/`instructions`/`list`/`show`/`validate` passano per l'helper di fallimento compatibile con JSON (la forma null del comando + `status`); `store <sottocomando sconosciuto> --json` emette `{status:[{code: unknown_store_subcommand}]}`; `list` riporta la sua forma null `{changes|specs: [], root: null}` in caso di fallimenti di risoluzione.
2. `store_root_missing` viene emesso con due gravità (avviso nella rimozione, errore nel doctor del store) — dipendente dal contesto, documentato sopra.
3. case snake_case (famiglia store) vs camelCase (famiglia workflow); `root.store_id` è in snake_case ovunque.
4. Esistono quattro dichiarazioni di tipo di involucro parallele in src; le diagnostiche di archivio non riportano mai `target`.
5. `list --json` riutilizza la chiave `status` come enum di stringhe per ogni cambiamento.
6. Solo l'output di `validate` riporta un campo `version`.
7. `schemas`/`templates` ignorano la selezione della root (basati sul cwd, nessun `--store`).
8. Le forme nominali deprecate (sottocomandi `change`/`spec`) emettono payload non involucrati senza `root`/`status`.