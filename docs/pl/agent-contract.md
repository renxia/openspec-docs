# Kontrakt agenta OpenSpec

Powierzchnie interfejsu CLI `openspec` możliwe do odczytu maszynowego, zweryfikowane względem katalogu `src/` (audyt capstone, 2026-06-11). Każdy kształt poniżej jest dokumentowany na podstawie kodu, który go emituje.

## 1. Konwencje ogólne

- **Jeden dokument JSON na wywołanie.** W trybie `--json` strumień stdout przekazuje dokładnie jeden dokument JSON (sformatowany z wcięciami o szerokości 2 spacji). Proza przeznaczona dla użytkownika, wskaźniki postępu oraz baner sklepu są przekazywane na stderr.
- **Baner sklepu.** W trybie dla użytkownika root wybrany przez sklep wyświetla `Using OpenSpec root: <id> (<path>)` na stderr. Nigdy nie jest wyświetlany w trybie JSON.
- **Wielkość liter kluczy zależy od powierzchni** (patrz Znane niekonsekwencje): ładunki sklepu/doctor/context używają `snake_case`; ładunki workflow (`status`, `instructions`, `new change`, `validate`, `list`) używają `camelCase`, za wyjątkiem osadzonego obiektu `root`, który zawsze wykorzystuje `store_id`.
- **Opcjonalne klucze są pomijane, a nie ustawiane na `null`**, w większości ładunków (np. `root.store_id`, `member.path`). Wyjątki, które używają jawnej wartości `null`, są wymienione dla każdego kształtu (doctor sklepu `git.*`, ładunki błędów).

## 2. Koperta diagnostyczna

Każda diagnostyka czytelna dla maszyny (`StoreDiagnostic`) korzysta z tego samego kształtu koperty:

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Diagnostyki pojawiają się w dwóch miejscach: **tablice statusów** (`status: StoreDiagnostic[]` na najwyższym poziomie lub dla każdego wpisu) dla wyników sprawdzania stanu, oraz **rzucone błędy** konwertowane na jednoelementową tablicę `status` w przypadku niepowodzenia polecenia.

## 3. Wybór głównego katalogu i `RootOutput`

Wszystkie polecenia rozwiązyujące główny katalog OpenSpec (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) wybierają jeden główny katalog OpenSpec według następującej kolejności priorytetów:

1. `--store <id>` → główny katalog zarejestrowanego magazynu (`source: "store"`).
2. W przeciwnym razie najbliższy katalog nadrzędny zawierający folder `openspec/`: struktura planowania → `source: "nearest"` (wskaźnik `store:` jest ignorowany z ostrzeżeniem na stderr); katalog tylko z konfiguracją z prawidłowym wskaźnikiem `store:` → ten magazyn, `source: "declared"`.
3. Brak najbliższego głównego katalogu + ustawiony globalny `defaultStore` (`openspec config set defaultStore <id>`) → ten magazyn, `source: "global_default"`; nieaktualny identyfikator kończy się niepowodzeniem z błędem magazynu oraz z poleceniem naprawy w polu `fix` o nazwie `openspec config unset defaultStore`.
4. Brak najbliższego głównego katalogu, brak domyślnego + istnieją zarejestrowane magazyny → błąd `no_root_with_registered_stores`.
5. Brak głównego katalogu, brak domyślnego, brak magazynów: polecenia tworzenia szkieletu traktują bieżący katalog roboczy jako `source: "implicit"`; polecenia diagnostyczne (`doctor`, `context`) kończą się niepowodzeniem z błędem `no_openspec_root` — służą do sprawdzania, nigdy do tworzenia szkieletów.

Pomyślne ładunki JSON zawierają główny katalog:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Kontrakt niepowodzenia wyboru głównego katalogu**: w trybie JSON niepowodzenie rozwiązywania powoduje wyświetlenie `{ ...commandNullShape, "status": [diagnostic] }` na stdout i zakończenie kodem 1.

## 4. Kształty JSON poleceń

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — zwróć uwagę, że `status` dla każdej zmiany jest tutaj enumem w postaci ciągu znaków. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Zmiana: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Specyfikacja: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Zakończenie kodem 1, jeśli jakikolwiek element nie przejdzie walidacji.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`. Pole `requires` każdego artefaktu to identyfikatory jego bezpośrednich zależności (obecne dla każdego statusu, więc przejściowy zestaw wymaganych elementów jest obliczalny nawet gdy artefakt ma status `done`); pole `missingDeps` pojawia się tylko gdy status to `blocked`. Wartość `"skipped"` oznacza artefakt, którego ścieżka `generates` znajduje się w folderze `specs/` w zmianie, której plik `.openspec.yaml` deklaruje `skip_specs: true`; spełnia on zależności, ale nie może zostać utworzony. Brak aktywnych zmian: `{ "changes": [], "message", "root" }`, zakończenie kodem 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`. Wartość `"skipped": true` (wraz z `"warning"`) pojawia się gdy zmiana deklaruje `skip_specs: true` i ten artefakt jest pomijany — nie twórz jego plików. Wpis zależności z wartością `skipped: true` jest spełniony bez plików — nie próbuj odczytywać jego ścieżek.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — rozwiązane wpisy zawierają pola root/specs/fetch; nierozwiązane zawierają store_id oraz status ostrzeżenia. Indeks jest ograniczony do 50 KB (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Sukces: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Niepowodzenie: `{ "change": null, "status": [d] }`, zakończenie kodem 1.

### 4.8 `archive <name> --json`
Sukces: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Niepowodzenie: `{ "archive": null, "root"?, "status": [d] }`, zakończenie kodem 1. Tryb JSON jest całkowicie nieinteraktywny: każdy punkt z zapytaniem przekształca się w kod `archive_*`.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`. Pole `drift` (obecne tylko dla kopii magazynu opartej na git z aktywnym odnośnikiem śledzenia gałęzi nadrzędnej) to liczba zmian do przodu/do tyłu względem ostatnio pobranej gałęzi nadrzędnej, a nie względem bieżącego zdalnego repozytorium. Wyniki sprawdzania stanu o dowolnym poziomie powagi kończą się kodem 0. Ładunek niepowodzenia: `{ "root": null, "store": null, "references": [], "status": [d] }`, zakończenie kodem 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. DOSTĘPNY = ścieżka istnieje ORAZ status jest pusty. `--code-workspace <path>` zapisuje `{folders:[{name,path}]}` (tylko dostępne magazyny referencyjne, z prefiksami `ref:`); w trybie JSON zapis jest wykonywany przed wyświetleniem, więc stdout zawiera dokładnie jeden dokument nawet w przypadku niepowodzenia zapisu. Niepowodzenie: `{ "root": null, "members": [], "status": [d] }`, zakończenie kodem 1.

### 4.11 `store ... --json`
konfiguracja/rejestracja: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. wyrejestrowanie/usunięcie: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. lista: `{ "stores": [{id, root}], "status": [] }`. sprawdzanie stanu: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = nieznane/nie sprawdzone). Wyniki sprawdzania stanu o dowolnym poziomie powagi kończą się kodem 0; niepowodzenia kończą się kodem 1 z odpowiadającym pustym kształtem. Anulowanie zapytania kończy się kodem 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: prosta tablica `[ {name, description, artifacts, source} ]`. `templates`: obiekt z kluczami `{ "<artifactId>": {path, source} }`. Oba opierają się na bieżącym katalogu roboczym, nie zawierają kluczy root/status.

## 5. Kontrakt kodów zakończenia

| Sytuacja | Kod zakończenia | Stdout |
|---|---|---|
| Sukces, w tym wyniki sprawdzania stanu (polecenia `doctor`/`context`/`store doctor`) | 0 | ładunek odpowiedzi |
| Niepowodzenie polecenia w trybie `--json` | 1 | jeden dokument JSON z `status: [d]` i pustym kształtem polecenia |
| `validate` z elementami nieprzechodzącymi walidacji | 1 | pełny raport |
| Anulowanie zapytania (grupa poleceń `store`, tryb interaktywny) | 130 | wyłącznie stderr |

## 6. Katalog kodów diagnostycznych

### Rozwiązywanie problemów
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; przekazywane dalej: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Stan zdrowia głównego katalogu OpenSpec (błąd, brak naprawy)
`openspec_store_root_missing`, `openspec_store_root_not_directory`, `openspec_root_missing`, `openspec_root_not_directory`, `openspec_config_missing`, `openspec_config_not_file`, `openspec_specs_not_directory`, `openspec_changes_not_directory`, `openspec_archive_not_directory`. W trakcie beta wersji magazynów foldery `openspec/specs/`, `openspec/changes/` oraz `openspec/changes/archive/` mogą nie występować w zdrowym głównym katalogu; są one błędami stanu zdrowia tylko wtedy, gdy istnieją, ale nie są katalogami.

### Rejestr magazynów / tożsamość / stan
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (informacja).

### Konfiguracja / rejestracja / usuwanie magazynów
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_root_pointer_declared`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (ostrzeżenie przy usuwaniu, błąd w `doctor`), `store_root_not_directory`.

### Git magazynu
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (ostrzeżenie), `store_clone_fragile_directories` (ostrzeżenie), `store_remote_divergence` (informacja, `doctor`), `store_checkout_drift` (informacja, `doctor`).

### Referencje (ostrzeżenie)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Zależności (ostrzeżenie; `doctor`; `context` przechowuje tylko te z rejestru)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Archiwum (tryb JSON)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Zapisy kontekstu
`context_file_exists`, `context_output_dir_missing`.

### Mechanizmy zapasowe
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Znane niezgodności

Zarejestrowane podczas audytu końcowego; zmiany nazw kluczy w wersji publicznej są decyzjami produktowymi odroczonymi poza tę wersję:

1. ~~W trybie `--json` kilka ścieżek niepowodzeń wyświetlało wyłącznie stderr bez dokumentu JSON.~~ Naprawione podczas rundy gauntlet audytu końcowego: nieznane i niejednoznaczne elementy w `show`/`validate` emitują `{status:[{code: unknown_item | ambiguous_item, ...}]}`; rzucone błędy w `status`/`instructions`/`list`/`show`/`validate` są przekazywane przez pomocnika obsługi niepowodzeń świadomego formatu JSON (pusty kształt polecenia + `status`); `store <nieznane podpolecenie> --json` emituje `{status:[{code: unknown_store_subcommand}]}`; `list` przenosi swój pusty kształt `{changes|specs: [], root: null}` w przypadku niepowodzeń rozwiązywania.
2. Kod `store_root_missing` jest emitowany z dwoma poziomami powagi (ostrzeżenie przy usuwaniu, błąd w `store doctor`) — zależny od kontekstu, udokumentowany powyżej.
3. Wielkość liter kluczy: snake_case (rodzina magazynów) vs camelCase (rodzina przepływów pracy); `root.store_id` jest zawsze w formie snake_case.
4. W kodzie źródłowym (`src`) istnieją cztery równoległe deklaracje typów koperty; diagnostyki archiwum nigdy nie zawierają pola `target`.
5. Polecenie `list --json` używa ponownie klucza `status` jako enumu w postaci ciągu znaków dla każdej zmiany.
6. Tylko wynik polecenia `validate` zawiera pole `version`.
7. Polecenia `schemas`/`templates` ignorują wybór głównego katalogu (opierają się na bieżącym katalogu roboczym, nie obsługują `--store`).
8. Przestarzałe formy rzeczownikowe (podpolecenia `change`/`spec`) emitują ładunki bez koperty, bez pól `root`/`status`.