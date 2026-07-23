# OpenSpec Agent Contract

Machine-leesbare oppervlakken van de `openspec` CLI, geverifieerd tegen `src/` (capstone audit, 2026-06-11). Ieder onderstaand formaat is gedocumenteerd op basis van de uitsturende code.

## 1. Algemene conventies

- **Eén JSON-document per aanroep.** In `--json` modus bevat stdout exact één JSON-document (2-spaties ingesprongen). Menselijke tekst, spinners en de store-banner worden naar stderr gestuurd.
- **Store-banner.** In menselijke modus drukt een door de store geselecteerde root `Using OpenSpec root: <id> (<path>)` af naar stderr. Wordt nooit afgedrukt in JSON-modus.
- **Hoofdlettergebruik van sleutels is afhankelijk van het oppervlak** (zie Bekende inconsistenties): payloads voor store/doctor/context gebruiken `snake_case`; workflow-payloads (`status`, `instructions`, `new change`, `validate`, `list`) gebruiken `camelCase`, met uitzondering van het ingebouwde `root`-object, dat altijd `store_id` gebruikt.
- **Optionele sleutels worden weggelaten, niet ingesteld op `null`**, in de meeste payloads (bijv. `root.store_id`, `member.path`). Uitzonderingen die expliciet `null` gebruiken, worden per gegevenstructuur vermeld (store doctor `git.*`, failure payloads).

## 2. De diagnostische envelop

Eén envelopvorm wordt gedeeld door elke machineleesbare diagnose (`StoreDiagnostic`):

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "menselijke zin",
  "target": "dotted.surface (optioneel)",
  "fix": "één uitvoerbare zin/opdracht (optioneel)"
}
```

Diagnosen verschijnen op twee posities: **statusarrays** (`status: StoreDiagnostic[]` op het hoogste niveau of per vermelding) voor bevindingen over de gezondheid, en **geworpen fouten** geconverteerd naar een enkelvoudige `status`-array bij opdrachtfouten.

## 3. Root-selectie en `RootOutput`

Alle root-oplossende opdrachten (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) lossen één OpenSpec-root op met één voorrangsregel:

1. `--store <id>` → de geregistreerde store-root (`source: "store"`).
2. Anders, dichtstbijzijnde voorouder met `openspec/`: planningsvorm → `source: "nearest"` (een `store:`-pointer wordt genegeerd met een stderr-waarschuwing); alleen-configuratie-dir met een geldige `store:`-pointer → die store, `source: "declared"`.
3. Geen dichtstbijzijnde root + globale `defaultStore` ingesteld (`openspec config set defaultStore <id>`) → die store, `source: "global_default"`; een verlopen id mislukt met de onderliggende store-fout en een `fix` die `openspec config unset defaultStore` noemt.
4. Geen dichtstbijzijnde root, geen standaard + geregistreerde stores bestaan → fout `no_root_with_registered_stores`.
5. Geen root, geen standaard, geen stores: scaffolding-opdrachten behandelen de cwd als `source: "implicit"`; diagnose-opdrachten (`doctor`, `context`) mislukken met `no_openspec_root` — zij inspecteren, nooit scaffolden.

Succesvolle JSON-payloads sluiten de root in:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (alleen bij store-selectie)" }
```

**Root-foutcontract**: in JSON-modus drukt een oplossingsfout `{ ...commandNullShape, "status": [diagnostic] }` af op stdout en stopt met 1.

## 4. JSON-vormen van opdrachten

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — let op: de per-wijziging `status` is hier een string-enum. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Change: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spec: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Stopt met 1 wanneer een item mislukt.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`. De `requires` van elk artifact zijn de directe afhankelijkheids-id's (aanwezig voor elke status, zodat de transitieve vereiste set berekenbaar is, zelfs wanneer het artifact `done` is); `missingDeps` verschijnt alleen bij `blocked`. `"skipped"` markeert een artifact waarvan het `generates`-pad onder `specs/` valt in een wijziging waarvan `.openspec.yaml` `skip_specs: true` declareert; het voldoet aan afhankelijkheden maar mag niet worden aangemaakt. Geen actieve wijzigingen: `{ "changes": [], "message", "root" }`, stopt met 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`. `"skipped": true` (met `"warning"`) verschijnt wanneer de wijziging `skip_specs: true` declareert en dit artifact wordt overgeslagen — maak de bestanden niet aan. Een afhankelijkheidsvermelding met `skipped: true` is voldaan zonder bestanden — probeer de paden niet te lezen.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — opgeloste vermeldingen dragen root/specs/fetch; onopgeloste dragen store_id + waarschuwingsstatus. Index beperkt tot 50KB (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Succes: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Fout: `{ "change": null, "status": [d] }`, stopt met 1.

### 4.8 `archive <name> --json`
Succes: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Fout: `{ "archive": null, "root"?, "status": [d] }`, stopt met 1. JSON-modus is strikt niet-interactief: elk promptpunt wordt een `archive_*`-code.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`. `drift` (alleen aanwezig voor een git-backed store-checkout die een upstream tracking-ref heeft) zijn voor/achter-aantallen tegen de laatst opgehaalde upstream, niet de live remote. Gezondheidsbevindingen van elke ernst stoppen met 0. Fout-payload: `{ "root": null, "store": null, "references": [], "status": [d] }`, stopt met 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. BESCHIKBAAR = pad aanwezig EN status leeg. `--code-workspace <path>` schrijft `{folders:[{name,path}]}` (alleen beschikbare gerefereerde stores, `ref:`-voorvoegsels); in JSON-modus wordt het schrijven uitgevoerd vóór het afdrukken, zodat stdout precies één document bevat, zelfs bij schrijffout. Fout: `{ "root": null, "members": [], "status": [d] }`, stopt met 1.

### 4.11 `store ... --json`
setup/register: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. unregister/remove: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. list: `{ "stores": [{id, root}], "status": [] }`. doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = onbekend/niet onderzocht). Gezondheidsbevindingen stoppen met 0; fouten stoppen met 1 met de bijbehorende null-vorm. Prompt-annulering stopt met 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: kale array `[ {name, description, artifacts, source} ]`. `templates`: object met sleutels `{ "<artifactId>": {path, source} }`. Beide cwd-gebaseerd, geen root/status-sleutels.

## 5. Exit-codecontract

| Situatie | Exit | Stdout |
|---|---|---|
| Succes, incl. gezondheidsbevindingen (doctor/context/store doctor) | 0 | de payload |
| Opdrachtfout in `--json`-modus | 1 | één JSON-document met `status: [d]` en de null-vorm van de opdracht |
| `validate` met mislukte items | 1 | volledig rapport |
| Prompt-annulering (`store`-groep, menselijke modus) | 130 | alleen stderr |

## 6. Diagnosecodecatalogus

### Oplossing
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; doorgeven: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### OpenSpec-rootgezondheid (fout, geen fix)
`openspec_store_root_missing`, `openspec_store_root_not_directory`, `openspec_root_missing`, `openspec_root_not_directory`, `openspec_config_missing`, `openspec_config_not_file`, `openspec_specs_not_directory`, `openspec_changes_not_directory`, `openspec_archive_not_directory`. Tijdens de stores-beta mogen `openspec/specs/`, `openspec/changes/` en `openspec/changes/archive/` afwezig zijn in een gezonde root; ze zijn alleen gezondheidsfouten wanneer ze aanwezig maar geen directory zijn.

### Store-register/identiteit/status
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Store setup/register/remove
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_root_pointer_declared`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (waarschuwing bij remove, fout bij doctor), `store_root_not_directory`.

### Store-git
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (waarschuwing), `store_clone_fragile_directories` (waarschuwing), `store_remote_divergence` (info, doctor), `store_checkout_drift` (info, doctor).

### Referenties (waarschuwing)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Relaties (waarschuwing; doctor; context behoudt alleen de register)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Archief (JSON-modus)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Context-schrijfbewerkingen
`context_file_exists`, `context_output_dir_missing`.

### Terugvalopties
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Bekende inconsistenties

Vastgelegd door de capstone-audit; hernoemingen van gepubliceerde sleutels zijn productbeslissingen die zijn uitgesteld tot na deze release:

1. ~~In `--json`-modus drukten verschillende foutpaden alleen stderr af zonder JSON-document.~~ Opgelost in de capstone-gauntlet-ronde: `show`/`validate` onbekende en dubbelzinnige items geven `{status:[{code: unknown_item | ambiguous_item, ...}]}`; geworpen fouten in `status`/`instructions`/`list`/`show`/`validate` lopen via de JSON-bewuste fouthelper (de null-vorm van de opdracht + `status`); `store <unknown subcommand> --json` geeft `{status:[{code: unknown_store_subcommand}]}`; `list` draagt zijn `{changes|specs: [], root: null}` null-vorm bij oplossingsfouten.
2. `store_root_missing` wordt uitgegeven met twee ernstniveaus (waarschuwing bij remove, fout bij store doctor) — contextafhankelijk, hierboven gedocumenteerd.
3. snake_case (store-familie) vs camelCase (workflow-familie) sleutelcasing; `root.store_id` is overal snake_case.
4. Vier parallelle enveloptypedeclaraties bestaan in src; archiefdiagnosen dragen nooit `target`.
5. `list --json` hergebruikt de `status`-sleutel als een string-enum per wijziging.
6. Alleen `validate`-uitvoer draagt een `version`-veld.
7. `schemas`/`templates` negeren root-selectie (cwd-gebaseerd, geen `--store`).
8. Verouwerpde naamvormopdrachten (`change`/`spec`-subopdrachten) geven niet-verpakte payloads uit zonder `root`/`status`.