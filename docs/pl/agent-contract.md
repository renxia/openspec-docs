# Kontrakt Agenta OpenSpec

Powierzchnie czytelnymi maszynowo interfejsu CLI `openspec`, zweryfikowane względem `src/` (audyt capstone, 2026-06-11). Każdy kształt poniżej jest udokumentowany na podstawie kodu emitującego.

## 1. Ogólne konwencje

- **Jeden dokument JSON na wywołanie.** W trybie `--json` stdout zawiera dokładnie jeden dokument JSON (formatowanie z dwoma spacjami). Tekst ludzki, animowane elementy i baner magazynu trafiają do stderr.
- **Baner magazynu.** W trybie ludzkim wybrany przez użytkownika magazyn wyświetla do stderr: `Using OpenSpec root: <id> (<path>)`. Nigdy nie jest wyświetlany w trybie JSON.
- **Piszczałka kluczy (Key casing) zależy od powierzchni** (patrz Znane niespójności): ładunki (payloads) store/doctor/context używają `snake_case`; ładunki workflow (`status`, `instructions`, `new change`, `validate`, `list`) używają `camelCase`, z wyjątkiem wbudowanego obiektu `root`, który zawsze używa `store_id`.
- **Opcjonalne klucze są pomijane, a nie ustawione na null**, w większości ładunków (np. `root.store_id`, `member.path`). Wyjątki, które używają jawnego `null`, są podane dla każdego kształtu (doctor magazynu `git.*`, ładunki błędów).

## 2. Otoczka diagnostyczna

Jeden kształt otoczki jest wspólny dla każdej czytelnej maszynowo diagnostyki (`StoreDiagnostic`):

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Diagnostyki pojawiają się w dwóch miejscach: **tablice statusu** (`status: StoreDiagnostic[]` na najwyższym poziomie lub dla każdego wpisu) dla wyników zdrowia, oraz **wyrzucone błędy**, które są konwertowane do tablicy `status` o jednym elemencie przy niepowodzeniu polecenia.

## 3. Wybór korzenia i `RootOutput`

Wszystkie komendy rozstrzygające korzeń (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) rozstrzygają jeden korzeń OpenSpec z jedną kolejnością ważności:

1. `--store <id>` → korzeń zarejestrowanego magazynu (`source: "store"`).
2. W przeciwnym razie, najbliższy przodek z `openspec/`: kształt planowania → `source: "nearest"` (wskaźnik `store:` jest ignorowany z ostrzeżeniem do stderr); katalog tylko konfiguracyjny z poprawnym wskaźnikiem `store:` → ten magazyn, `source: "declared"`.
3. Brak najbliższego korzenia + brak zarejestrowanych magazynów → błąd `no_root_with_registered_stores`.
4. Brak korzenia, brak magazynów: komendy scenariusza (scaffolding) traktują cwd jako `source: "implicit"`; komendy diagnostyczne (`doctor`, `context`) kończą się niepowodzeniem z `no_openspec_root` zamiast tego — one inspekcjonują, ale nigdy nie tworzą scenariusza.

Pomyślne ładunki JSON osadzają korzeń:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Kontrakt niepowodzenia korzenia**: w trybie JSON niepowodzenie rozstrzygnięcia wyświetla `{ ...commandNullShape, "status": [diagnostic] }` na stdout i kończy się zerem.

## 4. Kształty JSON dla komend

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — zauważ, że status dla każdej zmiany jest ciągiem znaków enum. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Zmiana: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Specyfikacja: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Kończy się zerem (Exit 1), gdy którykolwiek element nie powiedzie.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"ready"|"blocked", missingDeps?} ], "root" }`. Brak aktywnych zmian: `{ "changes": [], "message", "root" }`, kończy się zerem (Exit 0).

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "template", "dependencies": [{id,done,path,description}], "unlocks", "root" }`.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — rozstrzygnięte wpisy zawierają root/specs/fetch; nierozstrzygnięte zawierają store_id + status ostrzeżenia. Indeks jest ograniczony do 50KB (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Sukces: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Niepowodzenie: `{ "change": null, "status": [d] }`, kończy się zerem (Exit 1).

### 4.8 `archive <name> --json`
Sukces: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Niepowodzenie: `{ "archive": null, "root"?, "status": [d] }`, kończy się zerem (Exit 1). Tryb JSON jest ściśle nieinteraktywny: każdy punkt zapytania staje się kodem `archive_*`.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "status": [] } | null, "references": [...], "status": [] }`. Wyniki zdrowia o dowolnej wadze kończą się zerem (Exit 0). Ładunek niepowodzenia: `{ "root": null, "store": null, "references": [], "status": [d] }`, kończy się zerem (Exit 1).

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. DOSTĘPNY = obecność ścieżki ORAZ pusta tablica statusu. `--code-workspace <path>` zapisuje `{folders:[{name,path}]}` (tylko dostępne referencyjne magazyny, prefiksy `ref:`); w trybie JSON zapis odbywa się przed drukiem, więc stdout zawiera dokładnie jeden dokument nawet w przypadku niepowodzenia zapisu. Niepowodzenie: `{ "root": null, "members": [], "status": [d] }`, kończy się zerem (Exit 1).

### 4.11 `store ... --json`
Konfiguracja/rejestracja: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. Odrejestrowanie/usunięcie: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. Lista: `{ "stores": [{id, root}], "status": [] }`. Doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = nieznane/niezbadane). Wyniki zdrowia kończą się zerem (Exit 0); niepowodzenia kończą się zerem (Exit 1) z odpowiadającym kształtem null. Anulowanie zapytania kończy się 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: surowa tablica `[ {name, description, artifacts, source} ]`. `templates`: obiekt kluczowy `{ "<artifactId>": {path, source} }`. Oba są oparte na cwd, bez kluczy root/status.

## 5. Kontrakt kodu wyjścia

| Sytuacja | Wyjście | Stdout |
|---|---|---|
| Sukces, włączając wyniki zdrowia (doctor/context/store doctor) | 0 | ładunek |
| Niepowodzenie komendy w trybie `--json` | 1 | jeden dokument JSON z `status: [d]` i kształtem null komendy |
| `validate` z niepoprawnymi elementami | 1 | pełny raport |
| Anulowanie zapytania (grupa `store`, tryb ludzki) | 130 | tylko do stderr |

## 6. Katalog kodów diagnostycznych

### Rozstrzygnięcie
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; przejścia: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Stan OpenSpec-root (błąd, bez naprawy)
`openspec_store_root_missing`, `openspec_root_missing`, `openspec_config_missing`, `openspec_specs_missing`, `openspec_changes_missing`, `openspec_archive_missing`, oraz warianty `_not_directory` dla każdego z nich.

### Rejestr/tożsamość/stan magazynu
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Konfiguracja/rejestracja/usunięcie magazynu
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (ostrzeżenie w usuwaniu, błąd w doctor), `store_root_not_directory`.

### Git magazynu
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (ostrzeżenie), `store_clone_fragile_directories` (ostrzeżenie), `store_remote_divergence` (info, doctor).

### Referencje (ostrzeżenia)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Relacje (ostrzeżenie; doctor; context przechowuje tylko tę dotyczące rejestru)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Archiwum (tryb JSON)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Zapisy context
`context_file_exists`, `context_output_dir_missing`.

### Fallbacki
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Znane niespójności

Zarejestrowane przez audyt capstone; zmiany nazw kluczy są decyzjami produktowymi odroczonymi do czasu po tym wydaniu:

1. ~~W trybie `--json` wiele ścieżek niepowodzenia wyświetlało tylko do stderr bez dokumentu JSON.~~ Naprawione w rundzie gauntlet capstone: `show`/`validate` nieznane i dwuznaczne elementy emitują `{status:[{code: unknown_item | ambiguous_item, ...}]}`; wyrzucone błędy w `status`/`instructions`/`list`/`show`/`validate` przechodzą przez pomocnika awarii świadomego JSON (kształt null komendy + `status`); `store <unknown subcommand> --json` emituje `{status:[{code: unknown_store_subcommand}]}`; `list` zawiera swój kształt null `{changes|specs: [], root: null}` w przypadku niepowodzeń rozstrzygnięcia.
2. `store_root_missing` jest emitowany z dwoma wadami (ostrzeżenie w usuwaniu, błąd w doctor) — zależne od kontekstu, opisane powyżej.
3. Piszczałka kluczy snake_case (rodzina store) vs camelCase (rodzina workflow); `root.store_id` jest zawsze w snake_case.
4. W src istnieją cztery równoległe deklaracje typu otoczki; diagnostyki archiwum nigdy nie zawierają `target`.
5. `list --json` ponownie używa klucza `status` jako ciąg znaków enum dla każdej zmiany.
6. Tylko `validate` wyświetla pole `version`.
7. `schemas`/`templates` ignorują wybór korzenia (oparte na cwd, bez `--store`).
8. Przestarzałe formy rzeczownikowe (`change`/`spec` podkomendy) emitują ładunki nieotoczkowe bez `root`/`status`.