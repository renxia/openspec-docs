# OpenSpec Agentenvertrag

Maschinenlesbare Oberflächen der `openspec`-CLI, verifiziert gegen `src/` (Capstone-Audit, 2026-06-11). Jedes nachfolgende Format ist aus dem emittierenden Code dokumentiert.

## 1. Allgemeine Konventionen

- **Ein JSON-Dokument pro Aufruf.** Im `--json`-Modus gibt stdout genau ein JSON-Dokument aus (mit 2-Leerzeichen-Einrückung formatiert). Menschlicher Fließtext, Spinner und die Store-Banner werden auf stderr ausgegeben.
- **Store-Banner.** Im menschlichen Modus gibt ein vom Store ausgewählter Root die Meldung `Using OpenSpec root: <id> (<path>)` auf stderr aus. Wird im JSON-Modus nie ausgegeben.
- **Die Groß-/Kleinschreibung von Schlüsseln hängt von der Oberfläche ab** (siehe Bekannte Inkonsistenzen): Payloads von Store/Doctor/Context verwenden `snake_case`; Workflow-Payloads (`status`, `instructions`, `new change`, `validate`, `list`) verwenden `camelCase`, mit Ausnahme des eingebetteten `root`-Objekts, das immer `store_id` verwendet.
- **Optionale Schlüssel werden weggelassen, nicht auf `null` gesetzt**, in den meisten Payloads (z. B. `root.store_id`, `member.path`). Ausnahmen, die explizit `null` verwenden, werden pro Format aufgeführt (Store-Doctor `git.*`, Fehler-Payloads).

## 2. Der diagnostische Umschlag

Jede maschinenlesbare Diagnostik (`StoreDiagnostic`) verwendet die gleiche Umschlagstruktur:

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Diagnostiken erscheinen an zwei Stellen: **Status-Arrays** (`status: StoreDiagnostic[]` auf oberster Ebene oder pro Eintrag) für Gesundheitsbefunde und **geworfene Fehler**, die bei einem Befehlsfehler in ein ein-elementiges `status`-Array umgewandelt werden.

## 3. Root-Auswahl und `RootOutput`

Alle Root-auflösenden Befehle (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) lösen einen OpenSpec-Root mit folgender Priorität auf:

1. `--store <id>` → Root des registrierten Stores (`source: "store"`).
2. Andernfalls nächstgelegenes übergeordnetes Verzeichnis mit `openspec/`: Planungsstruktur → `source: "nearest"` (ein `store:`-Zeiger wird mit einer stderr-Warnung ignoriert); Verzeichnis nur mit Konfiguration und gültigem `store:`-Zeiger → dieser Store, `source: "declared"`.
3. Kein nächstgelegener Root + globaler `defaultStore` gesetzt (`openspec config set defaultStore <id>`) → dieser Store, `source: "global_default"`; eine veraltete ID schlägt mit dem zugrundeliegenden Store-Fehler fehl und einem `fix`, der `openspec config unset defaultStore` nennt.
4. Kein nächstgelegener Root, kein Standard + registrierte Stores existieren → Fehler `no_root_with_registered_stores`.
5. Kein Root, kein Standard, keine Stores: Gerüstbefehle behandeln das cwd als `source: "implicit"`; Diagnosebefehle (`doctor`, `context`) schlagen stattdessen mit `no_openspec_root` fehl – sie inspizieren, niemals gerüsten.

Erfolgreiche JSON-Nutzlasten enthalten den Root:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Root-Fehlervertrag**: Im JSON-Modus gibt ein Auflösungsfehler `{ ...commandNullShape, "status": [diagnostic] }` auf stdout aus und beendet das Programm mit Code 1.

## 4. Befehl-JSON-Strukturen

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` – Hinweis: Der `status` pro Änderung ist hier ein String-Enum. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Änderung: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spezifikation: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Beendet das Programm mit Code 1, wenn ein Eintrag fehlschlägt.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`. Das `requires`-Feld jedes Artefakts enthält die IDs seiner direkten Abhängigkeiten (für jeden Status vorhanden, sodass der transitive Satz an erforderlichen Einträgen auch berechnet werden kann, wenn das Artefakt `done` ist); `missingDeps` erscheint nur bei `blocked`. `"skipped"` markiert ein Artefakt, dessen `generates`-Pfad unter `specs/` liegt und dessen zugehörige Änderung in `.openspec.yaml` `skip_specs: true` deklariert; es erfüllt Abhängigkeiten, darf aber nicht erstellt werden. Keine aktiven Änderungen: `{ "changes": [], "message", "root" }`, Exit-Code 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`. `"skipped": true` (zusammen mit `"warning"`) erscheint, wenn die Änderung `skip_specs: true` deklariert und dieses Artefakt übersprungen wird – erstellen Sie keine Dateien dafür. Ein Abhängigkeitseintrag mit `skipped: true` ist ohne Dateien erfüllt – versuchen Sie nicht, seine Pfade zu lesen.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` – Aufgelöste Einträge enthalten root/specs/fetch; nicht aufgelöste enthalten store_id + Warnungsstatus. Index auf 50KB begrenzt (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Erfolg: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Fehlschlag: `{ "change": null, "status": [d] }`, Exit-Code 1.

### 4.8 `archive <name> --json`
Erfolg: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Fehlschlag: `{ "archive": null, "root"?, "status": [d] }`, Exit-Code 1. Der JSON-Modus ist strikt nicht-interaktiv: jeder Prompt-Punkt wird zu einem `archive_*`-Code.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`. `drift` (nur vorhanden bei einem git-basierten Store-Checkout mit einer upstream-Tracking-Referenz) gibt die Anzahl an Commits vor/hinter dem zuletzt abgerufenen upstream an, nicht dem Live-Remote. Gesundheitsbefunde jeglichen Schweregrads führen zu Exit-Code 0. Fehlerhafte Nutzlast: `{ "root": null, "store": null, "references": [], "status": [d] }`, Exit-Code 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. VERFÜGBAR = Pfad vorhanden UND Status leer. `--code-workspace <path>` schreibt `{folders:[{name,path}]}` (nur verfügbare referenzierte Stores, `ref:`-Präfixe); im JSON-Modus wird der Schreibvorgang vor der Ausgabe ausgeführt, sodass stdout auch bei einem Schreibfehler genau ein Dokument enthält. Fehler: `{ "root": null, "members": [], "status": [d] }`, Exit-Code 1.

### 4.11 `store ... --json`
Einrichtung/Registrierung: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. De-Registrierung/Entfernung: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. Auflistung: `{ "stores": [{id, root}], "status": [] }`. Doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = unbekannt/nicht geprüft). Gesundheitsbefunde führen zu Exit-Code 0; Fehlschläge führen zu Exit-Code 1 mit der passenden Null-Form. Prompt-Abbruch führt zu Exit-Code 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: einfaches Array `[ {name, description, artifacts, source} ]`. `templates`: schlüsselbasiertes Objekt `{ "<artifactId>": {path, source} }`. Beide sind cwd-basiert, keine root/status-Schlüssel.

## 5. Exit-Code-Vertrag

| Situation | Exit-Code | Stdout |
|---|---|---|
| Erfolg, einschließlich Gesundheitsbefunden (doctor/context/store doctor) | 0 | die Nutzlast |
| Befehl fehlgeschlagen im `--json`-Modus | 1 | ein JSON-Dokument mit `status: [d]` und der Null-Form des Befehls |
| `validate` mit fehlerhaften Einträgen | 1 | vollständiger Bericht |
| Prompt-Abbruch (`store`-Gruppe, menschlicher Modus) | 130 | nur stderr |

## 6. Diagnosecode-Katalog

### Auflösung
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; Durchreichung: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### OpenSpec-Root-Zustand (Fehler, keine Behebung)
`openspec_store_root_missing`, `openspec_store_root_not_directory`, `openspec_root_missing`, `openspec_root_not_directory`, `openspec_config_missing`, `openspec_config_not_file`, `openspec_specs_not_directory`, `openspec_changes_not_directory`, `openspec_archive_not_directory`. Während der Stores-Beta-Phase können `openspec/specs/`, `openspec/changes/` und `openspec/changes/archive/` in einem gesunden Root fehlen; sie sind nur Gesundheitsfehler, wenn sie vorhanden sind, aber keine Verzeichnisse sind.

### Store-Registrierung/Identität/Zustand
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (Info).

### Store-Einrichtung/Registrierung/Entfernung
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_root_pointer_declared`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (Warnung bei Entfernung, Fehler im Doctor), `store_root_not_directory`.

### Store-Git
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (Warnung), `store_clone_fragile_directories` (Warnung), `store_remote_divergence` (Info, Doctor), `store_checkout_drift` (Info, Doctor).

### Referenzen (Warnung)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`. Index auf 50KB begrenzt (`reference_index_truncated`).

### Beziehungen (Warnung; Doctor; context behält nur die registry-bezogene)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Archiv (JSON-Modus)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`. Der JSON-Modus ist strikt nicht-interaktiv: jeder Prompt-Punkt wird zu einem `archive_*`-Code.

### Context-Schreibvorgänge
`context_file_exists`, `context_output_dir_missing`.

### Fallbacks
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Bekannte Inkonsistenzen

Erfasst durch das Capstone-Audit; Veröffentlichungsschlüssel-Umbenennungen sind Produktentscheidungen, die über diese Version hinaus verschoben wurden:

1. ~~Im `--json`-Modus gaben mehrere Fehlerpfade nur stderr aus, ohne JSON-Dokument.~~ Behoben in der Capstone-Gauntlet-Runde: `show`/`validate` geben bei unbekannten und mehrdeutigen Einträgen `{status:[{code: unknown_item | ambiguous_item, ...}]}` aus; geworfene Fehler in `status`/`instructions`/`list`/`show`/`validate` werden über den JSON-fähigen Fehlerhelfer verarbeitet (Null-Form des Befehls + `status`); `store <unbekannter Unterbefehl> --json` gibt `{status:[{code: unknown_store_subcommand}]}` aus; `list` führt seine Null-Form `{changes|specs: [], root: null}` bei Auflösungsfehlern mit.
2. `store_root_missing` wird mit zwei Schweregraden ausgegeben (Warnung bei Entfernung, Fehler im Store-Doctor) – kontextabhängig, oben dokumentiert.
3. snake_case (Store-Familie) vs camelCase (Workflow-Familie) bei Schlüsseln; `root.store_id` ist überall in snake_case.
4. Vier parallele Umschlagstypdeklarationen existieren in src; Archiv-Diagnostiken führen nie `target` mit.
5. `list --json` verwendet den `status`-Schlüssel als String-Enum pro Änderung.
6. Nur die `validate`-Ausgabe enthält ein `version`-Feld.
7. `schemas`/`templates` ignorieren die Root-Auswahl (cwd-basiert, kein `--store`).
8. Veraltete Substantivformen (`change`/`spec` Unterbefehle) geben unverpackte Nutzlasten ohne `root`/`status` aus.