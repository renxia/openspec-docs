# OpenSpec Agentenvertrag

Maschinenlesbare Oberflächen der `openspec` CLI, überprüft gegen `src/` (Capstone-Audit, 2026-06-11). Jede Form unten ist aus dem emittierenden Code dokumentiert.

## 1. Allgemeine Konventionen

- **Ein JSON-Dokument pro Aufruf.** Im `--json`-Modus enthält stdout genau ein JSON-Dokument (zweispaltig formatiert). Menschliche Prosa, Spinner und das Store-Banner gehen an stderr.
- **Store-Banner.** Im menschlichen Modus gibt ein vom Benutzer ausgewähltes Root die Meldung `Using OpenSpec root: <id> (<path>)` an stderr aus. Es wird im JSON-Modus niemals ausgegeben.
- **Die Schlüsselbezeichnung (Key Casing) ist von der Oberfläche abhängig** (siehe Bekannte Inkonsistenzen): Store-/Doctor-/Context-Payloads verwenden `snake_case`; Workflow-Payloads (`status`, `instructions`, `new change`, `validate`, `list`) verwenden `camelCase`, außer das eingebettete `root`-Objekt, welches immer `store_id` verwendet.
- **Optionale Schlüssel werden weggelassen, nicht auf null gesetzt**, in den meisten Payloads (z. B. `root.store_id`, `member.path`). Ausnahmen, die explizit `null` verwenden, sind pro Form genannt (Store Doctor `git.*`, Fehler-Payloads).

## 2. Die Diagnosehülle (Diagnostic Envelope)

Eine Hüllenform wird von jeder maschinenlesbaren Diagnose (`StoreDiagnostic`) geteilt:

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Diagnosen erscheinen an zwei Stellen: **Status-Arrays** (`status: StoreDiagnostic[]` auf oberster Ebene oder pro Eintrag) für Gesundheitszustandsfeststellungen und **geworfene Fehler**, die in ein Einzelelement-`status`-Array bei einem Befehlsfehler umgewandelt werden.

## 3. Root-Auswahl und `RootOutput`

Alle Root-auflösenden Befehle (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) lösen ein OpenSpec Root mit einer Präzedenz auf:

1. `--store <id>` → das Root des registrierten Stores (`source: "store"`).
2. Andernfalls der nächstgelegene Vorfahre mit `openspec/`: Planungsform (`planning shape`) → `source: "nearest"` (ein `store:`-Pointer wird mit einer stderr-Warnung ignoriert); ein Konfigurationsverzeichnis mit einem gültigen `store:`-Pointer → dieser Store, `source: "declared"`.
3. Kein nächstgelegenes Root und keine registrierten Stores existieren → Fehler `no_root_with_registered_stores`.
4. Kein Root, keine Stores: Scaffolding-Befehle behandeln das cwd als `source: "implicit"`; diagnostische Befehle (`doctor`, `context`) schlagen mit `no_openspec_root` fehl – sie inspizieren, scaffolden niemals.

Erfolgreiche JSON-Payloads betten das Root ein:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Root-Fehlervertrag**: Im JSON-Modus gibt ein Auflösungsfehler `{ ...commandNullShape, "status": [diagnostic] }` an stdout aus und beendet den Prozess mit 1.

## 4. Command JSON Shapes

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — beachte, dass der Status pro Änderung hier ein String-Enum ist. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Change: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spec: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Beendet mit 1, wenn ein Element fehlschlägt.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"ready"|"blocked", missingDeps?} ], "root" }`. Keine aktive Änderungen: `{ "changes": [], "message", "root" }`, beendet mit 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "template", "dependencies": [{id,done,path,description}], "unlocks", "root" }`.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — aufgelöste Einträge enthalten root/specs/fetch; ungelöste tragen store_id + Warnungsstatus. Index begrenzt auf 50KB (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Erfolg: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Fehler: `{ "change": null, "status": [d] }`, beendet mit 1.

### 4.8 `archive <name> --json`
Erfolg: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Fehler: `{ "archive": null, "root"?, "status": [d] }`, beendet mit 1. Der JSON-Modus ist strikt nicht interaktiv: jeder Aufforderungspunkt wird zu einem `archive_*` Code.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "status": [] } | null, "references": [...], "status": [] }`. Gesundheitszustände jeglicher Schwere führen zu Exit 0. Fehler-Payload: `{ "root": null, "store": null, "references": [], "status": [d] }`, beendet mit 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. VERFÜGBAR = path ist vorhanden UND status ist leer. `--code-workspace <path>` schreibt `{folders:[{name,path}]}` (nur verfügbare referenzierte Stores, `ref:` Präfixe); im JSON-Modus wird das Schreiben vor dem Druck ausgeführt, sodass stdout genau ein Dokument enthält, selbst bei einem Schreibfehler. Fehler: `{ "root": null, "members": [], "status": [d] }`, beendet mit 1.

### 4.11 `store ... --json`
Setup/Registrierung: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. Abmelden/Entfernen: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. Auflisten: `{ "stores": [{id, root}], "status": [] }`. Doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = unbekannt/nicht geprüft). Gesundheitszustände führen zu Exit 0; Fehler führen mit der entsprechenden null-Form zu Exit 1. Abbrechen einer Aufforderung führt zu 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: reines Array `[ {name, description, artifacts, source} ]`. `templates`: Schlüsselobjekt `{ "<artifactId>": {path, source} }`. Beide sind cwd-basiert und haben keine root/status-Schlüssel.

## 5. Exit-Code Vertrag

| Situation | Exit | Stdout |
|---|---|---|
| Erfolg, einschließlich Gesundheitszustände (doctor/context/store doctor) | 0 | der Payload |
| Befehlsfehler im `--json`-Modus | 1 | ein JSON-Dokument mit `status: [d]` und der null-Form des Befehls |
| `validate` mit fehlerhaften Elementen | 1 | vollständiger Bericht |
| Abbrechen einer Aufforderung (Store-Gruppe, menschlicher Modus) | 130 | nur an stderr |

## 6. Diagnosecodekatalog

### Auflösung (Resolution)
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; Durchlauf: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### OpenSpec-Root Gesundheit (Fehler, keine Korrekturmöglichkeit)
`openspec_store_root_missing`, `openspec_root_missing`, `openspec_config_missing`, `openspec_specs_missing`, `openspec_changes_missing`, `openspec_archive_missing`, plus die Varianten `_not_directory`.

### Store Registry/Identität/Zustand
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Store Setup/Registrierung/Entfernung
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (warnung beim Entfernen, fehler bei Doctor), `store_root_not_directory`.

### Store Git
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (warnung), `store_clone_fragile_directories` (warnung), `store_remote_divergence` (info, doctor).

### Referenzen (Warnung)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Beziehungen (Warnung; Doctor; Context behält nur die Registry-Beziehung)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Archivieren (JSON-Modus)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Context-Schreibvorgänge
`context_file_exists`, `context_output_dir_missing`.

### Fallbacks
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Bekannte Inkonsistenzen

Aufzeichnet durch das Capstone-Audit; veröffentlichte Schlüsselnamen sind Produktentscheidungen, die über diese Version hinaus verschoben wurden:

1. ~~Im `--json`-Modus gab es mehrere Fehlerpfade, die nur an stderr ausgegeben wurden und kein JSON-Dokument enthielten.~~ Behoben in der Capstone Gauntlet Runde: `show`/`validate` unbekannte und ambivalente Elemente emittieren `{status:[{code: unknown_item | ambiguous_item, ...}]}`; geworfene Fehler in `status`/`instructions`/`list`/`show`/`validate` durchlaufen den JSON-fähigen Fehlerhelfer (die null-Form des Befehls + `status`); `store <unbekannter subcommand> --json` emittiert `{status:[{code: unknown_store_subcommand}]}`; `list` trägt seine `{changes|specs: [], root: null}` null-Form bei Auflösungsfehlern.
2. `store_root_missing` wird mit zwei Schweregraden ausgegeben (Warnung beim Entfernen, Fehler bei Store Doctor) — kontextabhängig, oben dokumentiert.
3. Schlüsselbezeichnung snake_case (Store-Familie) vs camelCase (Workflow-Familie); `root.store_id` ist überall snake_case.
4. Vier parallele Hüllen-Typdeklarationen existieren in src; Archivierungsdiagnosen tragen niemals `target`.
5. `list --json` verwendet den Schlüssel `status` als String-Enum pro Änderung.
6. Nur die Ausgabe von `validate` enthält ein `version`-Feld.
7. `schemas`/`templates` ignorieren die Root-Auswahl (cwd-basiert, kein `--store`).
8. Veraltete Nomenformen (`change`/`spec` Subbefehle) emittieren nicht gehüllte Payloads ohne `root`/`status`.