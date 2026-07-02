# OpenSpec Agent Contract

Machine-leesbare oppervlakken van de `openspec` CLI, geverifieerd tegen `src/` (capstone audit, 2026-06-11). Elke vorm hieronder is gedocumenteerd vanuit de uitzendende code.

## 1. Algemene conventies

- **Eén JSON-document per aanroep.** In `--json` modus bevat stdout precies één JSON-document (pretty-printed met 2 spaties). Menselijke proza, spinners en de store banner gaan naar stderr.
- **Store banner.** In mensmodus print een door de gebruiker geselecteerde root de tekst `Using OpenSpec root: <id> (<path>)` naar stderr. Wordt nooit geprint in JSON modus.
- **Sleutelcasing is afhankelijk van het oppervlak** (zie Bekende inconsistenties): store/doctor/context payloads gebruiken `snake_case`; workflow payloads (`status`, `instructions`, `new change`, `validate`, `list`) gebruiken `camelCase`, behalve het ingebedde `root` object, dat altijd `store_id` gebruikt.
- **Optionele sleutels worden weggelaten, niet op null gezet**, in de meeste payloads (bijv. `root.store_id`, `member.path`). Uitzonderingen die expliciet `null` gebruiken, worden per vorm vermeld (store doctor `git.*`, faal-payloads).

## 2. De diagnostische envelop

Eén envelopvorm wordt gedeeld door elke machineleesbare diagnose (`StoreDiagnostic`):

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Diagnoses verschijnen op twee plaatsen: **status arrays** (`status: StoreDiagnostic[]` op het hoogste niveau of per entry) voor gezondheidsbevindingen, en **uitgeworpen fouten** die worden omgezet in een enkelvoudig `status` array bij commandaalfalen.

## 3. Root selectie en `RootOutput`

Alle root-resolvende commando's (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) resolven één OpenSpec root met een bepaalde precedentie:

1. `--store <id>` → de root van de geregistreerde store (`source: "store"`).
2. Anders, de dichtstbijzijnde voorouder met `openspec/`: planningsvorm → `source: "nearest"` (een `store:` pointer wordt genegeerd met een stderr waarschuwing); een config-only directory met een geldige `store:` pointer → die store, `source: "declared"`.
3. Geen nabije root + geregistreerde stores bestaan → fout `no_root_with_registered_stores`.
4. Geen root, geen stores: scaffolding commando's behandelen de cwd als `source: "implicit"`; diagnostische commando's (`doctor`, `context`) falen met `no_openspec_root` in plaats daarvan — ze inspecteren, scaffolden nooit.

Succesvolle JSON payloads embedden de root:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Root-falen contract**: in JSON modus print een resoluufalen `{ ...commandNullShape, "status": [diagnostic] }` naar stdout en beëindigt met 1.

## 4. Command JSON shapes

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — let op de per-change `status` die hier een string enum is. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Change: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spec: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Beëindigt met 1 als een item faalt.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"ready"|"blocked", missingDeps?} ], "root" }`. Geen actieve wijzigingen: `{ "changes": [], "message", "root" }`, beëindigt met 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "template", "dependencies": [{id,done,path,description}], "unlocks", "root" }`.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — opgeloste entries bevatten root/specs/fetch; onopgeloste bevatten store_id + waarschuwingsstatus. Index is beperkt tot 50KB (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Succes: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Falen: `{ "change": null, "status": [d] }`, beëindigt met 1.

### 4.8 `archive <name> --json`
Succes: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Falen: `{ "archive": null, "root"?, "status": [d] }`, beëindigt met 1. JSON modus is strikt niet-interactief: elk promptpunt wordt een `archive_*` code.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "status": [] } | null, "references": [...], "status": [] }`. Gezondheidsbevindingen van elke ernstigheid beëindigen met 0. Falen payload: `{ "root": null, "store": null, "references": [], "status": [d] }`, beëindigt met 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. AVAILABLE = path aanwezig EN status leeg. `--code-workspace <path>` schrijft `{folders:[{name,path}]}` (alleen beschikbare referenties; `ref:` prefixes); in JSON modus draait de schrijfoperatie vóór het printen, zodat stdout precies één document bevat, zelfs bij een schrijfval. Falen: `{ "root": null, "members": [], "status": [d] }`, beëindigt met 1.

### 4.11 `store ... --json`
setup/register: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. unregister/remove: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. list: `{ "stores": [{id, root}], "status": [] }`. doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = onbekend/niet geprobeerd). Gezondheidsbevindingen beëindigen met 0; fouten beëindigen met 1 met de overeenkomstige null-vorm. Prompt annulering beëindigt met 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: simpele array `[ {name, description, artifacts, source} ]`. `templates`: keyed object `{ "<artifactId>": {path, source} }`. Beide zijn cwd-gebaseerd en hebben geen root/status sleutels.

## 5. Exit-code contract

| Situatie | Exit | Stdout |
|---|---|---|
| Succes, inclusief gezondheidsbevindingen (doctor/context/store doctor) | 0 | de payload |
| Commandaalfalen in `--json` modus | 1 | één JSON-document met `status: [d]` en de null-vorm van het commando |
| `validate` met falende items | 1 | volledig rapport |
| Prompt annulering (`store` groep, mensmodus) | 130 | alleen naar stderr |

## 6. Diagnostische code catalog

### Resolutie
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; doorgegeven: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### OpenSpec-root gezondheid (fout, geen fix)
`openspec_store_root_missing`, `openspec_root_missing`, `openspec_config_missing`, `openspec_specs_missing`, `openspec_changes_missing`, `openspec_archive_missing`, plus de `_not_directory` varianten van elk.

### Store registry/identiteit/status
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Store setup/register/remove
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (waarschuwing bij verwijderen, fout bij doctor), `store_root_not_directory`.

### Store git
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (waarschuwing), `store_clone_fragile_directories` (waarschuwing), `store_remote_divergence` (info, doctor).

### Referenties (waarschuwing)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Relaties (waarschuwing; doctor; context houdt alleen de registry vast)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Archive (JSON modus)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Context schrijfbewerkingen
`context_file_exists`, `context_output_dir_missing`.

### Fallbacks
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Bekende inconsistenties

Geregistreerd door de capstone audit; gepubliceerde sleutelnaamwijzigingen zijn productbeslissingen die na deze release worden genomen:

1. ~~In `--json` modus printten verschillende faalpaden alleen naar stderr zonder JSON-document.~~ Opgelost in de capstone gauntlet ronde: `show`/`validate` onbekende en dubbelzinnige items zenden `{status:[{code: unknown_item | ambiguous_item, ...}]}`; uitgeworpen fouten in `status`/`instructions`/`list`/`show`/`validate` gaan via de JSON-bewuste faalhelper (de null-vorm van het commando + `status`); `store <unknown subcommand> --json` zendt `{status:[{code: unknown_store_subcommand}]}`; `list` bevat zijn `{changes|specs: [], root: null}` null-vorm bij resoluufalen.
2. `store_root_missing` wordt met twee ernstigheden uitgezonden (waarschuwing bij verwijderen, fout bij store doctor) — contextafhankelijk, gedocumenteerd hierboven.
3. Sleutelcasing snake_case (store familie) versus camelCase (workflow familie); `root.store_id` is overal snake_case.
4. Vier parallelle enveloptype verklaringen bestaan in src; archive diagnoses bevatten nooit `target`.
5. `list --json` hergebruikt de `status` sleutel als een string enum per wijziging.
6. Alleen `validate` output bevat een `version` veld.
7. `schemas`/`templates` negeren rootselectie (cwd-gebaseerd, geen `--store`).
8. Verouderde zelfstandige naamvormen (`change`/`spec` subcommando's) zenden ongevouwen payloads zonder `root`/`status`.