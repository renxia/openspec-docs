# CLI-Referenz

Die OpenSpec CLI (`openspec`) bietet Terminalbefehle für die Projekteinrichtung, Validierung, Statusüberprüfung und Verwaltung. Diese Befehle ergänzen die KI-Slash-Befehle (wie `/opsx:propose`), die in [Befehlen](commands.md) dokumentiert sind.

## Zusammenfassung

| Kategorie | Befehle | Zweck |
|----------|----------|---------|
| **Einrichtung** | `init`, `update` | OpenSpec in Ihrem Projekt initialisieren und aktualisieren |
| **Durchsuchen** | `list`, `view`, `show` | Änderungen und Spezifikationen erkunden |
| **Validierung** | `validate` | Änderungen und Spezifikationen auf Probleme prüfen |
| **Lebenszyklus** | `archive` | Abgeschlossene Änderungen abschließen |
| **Arbeitsablauf** | `status`, `instructions`, `templates`, `schemas` | Unterstützung für artefaktgetriebene Arbeitsabläufe |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Benutzerdefinierte Arbeitsabläufe erstellen und verwalten |
| **Konfiguration** | `config` | Einstellungen anzeigen und ändern |
| **Hilfsprogramme** | `feedback`, `completion` | Feedback und Shell-Integration |

---

## Mensch- vs. Agenten-Befehle

Die meisten CLI-Befehle sind für die **Nutzung durch Menschen** in einem Terminal konzipiert. Einige Befehle unterstützen auch die **Agenten-/Skriptnutzung** über JSON-Ausgabe.

### Nur-Mensch-Befehle

Diese Befehle sind interaktiv und für die Terminalnutzung gedacht:

| Befehl | Zweck |
|---------|---------|
| `openspec init` | Projekt initialisieren (interaktive Eingabeaufforderungen) |
| `openspec view` | Interaktives Dashboard |
| `openspec config edit` | Konfiguration im Editor öffnen |
| `openspec feedback` | Feedback über GitHub einreichen |
| `openspec completion install` | Shell-Vervollständigungen installieren |

### Agenten-kompatible Befehle

Diese Befehle unterstützen die `--json`-Ausgabe für die programmatische Nutzung durch KI-Agenten und Skripte:

| Befehl | Menschliche Nutzung | Agenten-Nutzung |
|---------|-----------|-----------|
| `openspec list` | Änderungen/Specs durchsuchen | `--json` für strukturierte Daten |
| `openspec show <item>` | Inhalt lesen | `--json` zum Parsen |
| `openspec validate` | Auf Probleme prüfen | `--all --json` für Stapelvalidierung |
| `openspec status` | Artefaktfortschritt anzeigen | `--json` für strukturierten Status |
| `openspec instructions` | Nächste Schritte abrufen | `--json` für Agenten-Instruktionen |
| `openspec templates` | Vorlagenpfade finden | `--json` zur Pfadauflösung |
| `openspec schemas` | Verfügbare Schemas auflisten | `--json` zur Schema-Erkennung |

---

## Globale Optionen

Diese Optionen funktionieren mit allen Befehlen:

| Option | Beschreibung |
|--------|-------------|
| `--version`, `-V` | Versionsnummer anzeigen |
| `--no-color` | Farbausgabe deaktivieren |
| `--help`, `-h` | Hilfe für den Befehl anzeigen |

---

## Setup-Befehle

### `openspec init`

Initialisiert OpenSpec in Ihrem Projekt. Erstellt die Ordnerstruktur und konfiguriert die Integration von KI-Werkzeugen.

Das Standardverhalten verwendet globale Konfigurationsstandards: Profil `core`, Ausgabe `both`, Workflows `propose, explore, apply, archive`.

```
openspec init [path] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `path` | Nein | Zielverzeichnis (Standard: aktuelles Verzeichnis) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--tools <list>` | KI-Werkzeuge nicht-interaktiv konfigurieren. Verwenden Sie `all`, `none` oder eine kommagetrennte Liste |
| `--force` | Veraltete Dateien automatisch bereinigen, ohne nachzufragen |
| `--profile <profile>` | Globales Profil für diesen Init-Lauf überschreiben (`core` oder `custom`) |

`--profile custom` verwendet die Workflows, die aktuell in der globalen Konfiguration ausgewählt sind (`openspec config profile`).

**Unterstützte Werkzeug-IDs (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

**Beispiele:**

```bash
# Interaktive Initialisierung
openspec init

# In einem bestimmten Verzeichnis initialisieren
openspec init ./my-project

# Nicht-interaktiv: Für Claude und Cursor konfigurieren
openspec init --tools claude,cursor

# Für alle unterstützten Werkzeuge konfigurieren
openspec init --tools all

# Profil für diesen Lauf überschreiben
openspec init --profile core

# Eingabeaufforderungen überspringen und veraltete Dateien automatisch bereinigen
openspec init --force
```

**Was es erstellt:**

```
openspec/
├── specs/              # Ihre Spezifikationen (Quelle der Wahrheit)
├── changes/            # Vorgeschlagene Änderungen
└── config.yaml         # Projektkonfiguration

.claude/skills/         # Claude Code Skills (falls Claude ausgewählt)
.cursor/skills/         # Cursor Skills (falls Cursor ausgewählt)
.cursor/commands/       # Cursor OPSX-Befehle (falls Ausgabe Befehle enthält)
... (andere Werkzeugkonfigurationen)
```

---

### `openspec update`

Aktualisiert OpenSpec-Instruktionsdateien nach einem Upgrade der CLI. Generiert die Konfigurationsdateien für KI-Werkzeuge mit Ihrem aktuellen globalen Profil, den ausgewählten Workflows und dem Ausgabemodus neu.

```
openspec update [path] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `path` | Nein | Zielverzeichnis (Standard: aktuelles Verzeichnis) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--force` | Aktualisierung erzwingen, auch wenn Dateien aktuell sind |

**Beispiel:**

```bash
# Instruktionsdateien nach npm-Upgrade aktualisieren
npm update @fission-ai/openspec
openspec update
```

---

## Durchsuchungsbefehle

### `openspec list`

Listet Änderungen oder Specs in Ihrem Projekt auf.

```
openspec list [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--specs` | Specs anstelle von Änderungen auflisten |
| `--changes` | Änderungen auflisten (Standard) |
| `--sort <order>` | Nach `recent` (Standard) oder `name` sortieren |
| `--json` | Als JSON ausgeben |

**Beispiele:**

```bash
# Alle aktiven Änderungen auflisten
openspec list

# Alle Specs auflisten
openspec list --specs

# JSON-Ausgabe für Skripte
openspec list --json
```

**Ausgabe (Text):**

```
Aktive Änderungen:
  add-dark-mode     UI-Theme-Umschaltung unterstützen
  fix-login-bug     Sitzungszeitüberschreitung behandeln
```

---

### `openspec view`

Zeigt ein interaktives Dashboard zur Erkundung von Specs und Änderungen an.

```
openspec view
```

Öffnet eine terminalbasierte Oberfläche zur Navigation durch die Spezifikationen und Änderungen Ihres Projekts.

---

### `openspec show`

Zeigt Details einer Änderung oder eines Specs an.

```
openspec show [item-name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `item-name` | Nein | Name der Änderung oder des Specs (wird bei Auslassung abgefragt) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--type <type>` | Typ angeben: `change` oder `spec` (wird bei Eindeutigkeit automatisch erkannt) |
| `--json` | Als JSON ausgeben |
| `--no-interactive` | Eingabeaufforderungen deaktivieren |

**Änderungsspezifische Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--deltas-only` | Nur Delta-Specs anzeigen (JSON-Modus) |

**Spec-spezifische Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--requirements` | Nur Anforderungen anzeigen, Szenarien ausschließen (JSON-Modus) |
| `--no-scenarios` | Szenarieninhalt ausschließen (JSON-Modus) |
| `-r, --requirement <id>` | Bestimmte Anforderung anhand des 1-basierten Index anzeigen (JSON-Modus) |

**Beispiele:**

```bash
# Interaktive Auswahl
openspec show

# Bestimmte Änderung anzeigen
openspec show add-dark-mode

# Bestimmten Spec anzeigen
openspec show auth --type spec

# JSON-Ausgabe zum Parsen
openspec show add-dark-mode --json
```

---

## Validierungsbefehle

### `openspec validate`

Validiert Änderungen und Specs auf strukturelle Probleme.

```
openspec validate [item-name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `item-name` | Nein | Bestimmtes Element zur Validierung (wird bei Auslassung abgefragt) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--all` | Alle Änderungen und Specs validieren |
| `--changes` | Alle Änderungen validieren |
| `--specs` | Alle Specs validieren |
| `--type <type>` | Typ angeben, wenn der Name mehrdeutig ist: `change` oder `spec` |
| `--strict` | Strengen Validierungsmodus aktivieren |
| `--json` | Als JSON ausgeben |
| `--concurrency <n>` | Maximale parallele Validierungen (Standard: 6 oder Umgebungsvariable `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Eingabeaufforderungen deaktivieren |

**Beispiele:**

```bash
# Interaktive Validierung
openspec validate

# Bestimmte Änderung validieren
openspec validate add-dark-mode

# Alle Änderungen validieren
openspec validate --changes

# Alles mit JSON-Ausgabe validieren (für CI/Skripte)
openspec validate --all --json

# Strikte Validierung mit erhöhter Parallelität
openspec validate --all --strict --concurrency 12
```

**Ausgabe (Text):**

```
Validiere add-dark-mode...
  ✓ proposal.md gültig
  ✓ specs/ui/spec.md gültig
  ⚠ design.md: Fehlender Abschnitt "Technischer Ansatz"

1 Warnung gefunden
```

**Ausgabe (JSON):**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: Fehlender Abschnitt 'Technischer Ansatz'"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## Lebenszyklus-Befehle

### `openspec archive`

Archiviert eine abgeschlossene Änderung und fusioniert Delta-Specs in die Hauptspecs.

```
openspec archive [change-name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `change-name` | Nein | Zu archivierende Änderung (wird bei Auslassung abgefragt) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `-y, --yes` | Bestätigungsabfragen überspringen |
| `--skip-specs` | Spec-Aktualisierungen überspringen (für reine Infrastruktur/Werkzeug/Dokumentationsänderungen) |
| `--no-validate` | Validierung überspringen (erfordert Bestätigung) |

**Beispiele:**

```bash
# Interaktive Archivierung
openspec archive

# Bestimmte Änderung archivieren
openspec archive add-dark-mode

# Archivierung ohne Abfragen (CI/Skripte)
openspec archive add-dark-mode --yes

# Eine Werkzeugänderung archivieren, die Specs nicht betrifft
openspec archive update-ci-config --skip-specs
```

**Was es tut:**

1. Validiert die Änderung (sofern nicht `--no-validate`)
2. Fragt nach Bestätigung (sofern nicht `--yes`)
3. Fusioniert Delta-Specs in `openspec/specs/`
4. Verschiebt den Änderungsordner nach `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Workflow-Befehle

Diese Befehle unterstützen den artefaktgetriebenen OPSX-Workflow. Sie sind nützlich sowohl für Menschen, die den Fortschritt überprüfen, als auch für Agenten, die die nächsten Schritte bestimmen.

### `openspec status`

Zeigt den Abschlussstatus der Artefakte für eine Änderung an.

```
openspec status [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--change <id>` | Änderungsname (wird bei Auslassung abgefragt) |
| `--schema <name>` | Schema-Überschreibung (wird aus der Konfiguration der Änderung automatisch erkannt) |
| `--json` | Als JSON ausgeben |

**Beispiele:**

```bash
# Interaktive Statusprüfung
openspec status

# Status für bestimmte Änderung
openspec status --change add-dark-mode

# JSON für Agenten-Nutzung
openspec status --change add-dark-mode --json
```

**Ausgabe (Text):**

```
Änderung: add-dark-mode
Schema: spec-driven
Fortschritt: 2/4 Artefakte abgeschlossen

[x] proposal
[ ] design
[x] specs
[-] tasks (blockiert durch: design)
```

**Ausgabe (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done"},
    {"id": "design", "outputPath": "design.md", "status": "ready"},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done"},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

Erhält angereicherte Instruktionen zur Erstellung eines Artefakts oder zur Anwendung von Aufgaben. Wird von KI-Agenten verwendet, um zu verstehen, was als Nächstes zu erstellen ist.

```
openspec instructions [artifact] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `artifact` | Nein | Artefakt-ID: `proposal`, `specs`, `design`, `tasks` oder `apply` |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--change <id>` | Änderungsname (im nicht-interaktiven Modus erforderlich) |
| `--schema <name>` | Schema-Überschreibung |
| `--json` | Als JSON ausgeben |

**Sonderfall:** Verwenden Sie `apply` als Artefakt, um Implementierungsinstruktionen für Aufgaben zu erhalten.

**Beispiele:**

```bash
# Instruktionen für das nächste Artefakt abrufen
openspec instructions --change add-dark-mode

# Instruktionen für bestimmtes Artefakt abrufen
openspec instructions design --change add-dark-mode

# Anwendungs-/Implementierungsinstruktionen abrufen
openspec instructions apply --change add-dark-mode

# JSON für Agenten-Verarbeitung
openspec instructions design --change add-dark-mode --json
```

**Ausgabe enthält:**

- Vorlageninhalt für das Artefakt
- Projektkontext aus der Konfiguration
- Inhalt von abhängigen Artefakten
- Artefaktspezifische Regeln aus der Konfiguration

---

### `openspec templates`

Zeigt die aufgelösten Vorlagenpfade für alle Artefakte in einem Schema an.

```
openspec templates [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--schema <name>` | Zu inspizierendes Schema (Standard: `spec-driven`) |
| `--json` | Als JSON ausgeben |

**Beispiele:**

```bash
# Vorlagenpfade für das Standardschema anzeigen
openspec templates

# Vorlagen für benutzerdefiniertes Schema anzeigen
openspec templates --schema my-workflow

# JSON für programmatische Nutzung
openspec templates --json
```

**Ausgabe (Text):**

```
Schema: spec-driven

Vorlagen:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Listet verfügbare Workflow-Schemas mit ihren Beschreibungen und Artefaktflüssen auf.

```
openspec schemas [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--json` | Als JSON ausgeben |

**Beispiel:**

```bash
openspec schemas
```

**Ausgabe:**

```
Verfügbare Schemas:

  spec-driven (Paket)
    Der standardmäßige spezifikationsgetriebene Entwicklung-Workflow
    Fluss: proposal → specs → design → tasks

  my-custom (Projekt)
    Benutzerdefinierter Workflow für dieses Projekt
    Fluss: research → proposal → tasks
```

---

## Schema-Befehle

Befehle zum Erstellen und Verwalten benutzerdefinierter Workflow-Schemas.

### `openspec schema init`

Erstellt ein neues projektspezifisches Schema.

```
openspec schema init <name> [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|--------------|--------------|
| `name` | Ja | Schema-Name (kebab-case) |

**Optionen:**

| Option | Beschreibung |
|--------|--------------|
| `--description <text>` | Schema-Beschreibung |
| `--artifacts <list>` | Kommagetrennte Artefakt-IDs (Standard: `proposal,specs,design,tasks`) |
| `--default` | Als Standard-Schema des Projekts festlegen |
| `--no-default` | Nicht nach Festlegung als Standard fragen |
| `--force` | Vorhandenes Schema überschreiben |
| `--json` | Als JSON ausgeben |

**Beispiele:**

```bash
# Interaktive Schema-Erstellung
openspec schema init research-first

# Nicht-interaktiv mit spezifischen Artefakten
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**Was wird erstellt:**

```
openspec/schemas/<name>/
├── schema.yaml           # Schema-Definition
└── templates/
    ├── proposal.md       # Vorlage für jedes Artefakt
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Kopiert ein vorhandenes Schema in Ihr Projekt zur Anpassung.

```
openspec schema fork <source> [name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|--------------|--------------|
| `source` | Ja | Zu kopierendes Schema |
| `name` | Nein | Neuer Schema-Name (Standard: `<source>-custom`) |

**Optionen:**

| Option | Beschreibung |
|--------|--------------|
| `--force` | Vorhandenes Ziel überschreiben |
| `--json` | Als JSON ausgeben |

**Beispiel:**

```bash
# Das eingebaute spec-driven Schema forken
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Validiert die Struktur und Vorlagen eines Schemas.

```
openspec schema validate [name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|--------------|--------------|
| `name` | Nein | Zu validierendes Schema (validiert alle, wenn weggelassen) |

**Optionen:**

| Option | Beschreibung |
|--------|--------------|
| `--verbose` | Detaillierte Validierungsschritte anzeigen |
| `--json` | Als JSON ausgeben |

**Beispiel:**

```bash
# Ein spezifisches Schema validieren
openspec schema validate my-workflow

# Alle Schemas validieren
openspec schema validate
```

---

### `openspec schema which`

Zeigt an, woher ein Schema aufgelöst wird (nützlich zum Debuggen der Priorität).

```
openspec schema which [name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|--------------|--------------|
| `name` | Nein | Schema-Name |

**Optionen:**

| Option | Beschreibung |
|--------|--------------|
| `--all` | Alle Schemas mit ihren Quellen auflisten |
| `--json` | Als JSON ausgeben |

**Beispiel:**

```bash
# Überprüfen, woher ein Schema kommt
openspec schema which spec-driven
```

**Ausgabe:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Schema-Priorität:**

1. Projekt: `openspec/schemas/<name>/`
2. Benutzer: `~/.local/share/openspec/schemas/<name>/`
3. Paket: Eingebaute Schemas

---

## Konfigurationsbefehle

### `openspec config`

Zeigt und ändert die globale OpenSpec-Konfiguration.

```
openspec config <subcommand> [options]
```

**Unterbefehle:**

| Unterbefehl | Beschreibung |
|-------------|--------------|
| `path` | Speicherort der Konfigurationsdatei anzeigen |
| `list` | Alle aktuellen Einstellungen anzeigen |
| `get <key>` | Einen spezifischen Wert abrufen |
| `set <key> <value>` | Einen Wert setzen |
| `unset <key>` | Einen Schlüssel entfernen |
| `reset` | Auf Standardwerte zurücksetzen |
| `edit` | In `$EDITOR` öffnen |
| `profile [preset]` | Workflow-Profil interaktiv oder über Preset konfigurieren |

**Beispiele:**

```bash
# Pfad der Konfigurationsdatei anzeigen
openspec config path

# Alle Einstellungen auflisten
openspec config list

# Einen spezifischen Wert abrufen
openspec config get telemetry.enabled

# Einen Wert setzen
openspec config set telemetry.enabled false

# Einen Zeichenketten-Wert explizit setzen
openspec config set user.name "My Name" --string

# Eine benutzerdefinierte Einstellung entfernen
openspec config unset user.name

# Alle Konfiguration zurücksetzen
openspec config reset --all --yes

# Konfiguration im Editor bearbeiten
openspec config edit

# Profil mit aktionsbasiertem Assistenten konfigurieren
openspec config profile

# Schnelles Preset: Workflows auf Kern umschalten (Behält Zustellmodus bei)
openspec config profile core
```

`openspec config profile` beginnt mit einer Zusammenfassung des aktuellen Zustands und lässt Sie dann wählen:
- Zustellmodus + Workflows ändern
- Nur Zustellmodus ändern
- Nur Workflows ändern
- Aktuelle Einstellungen beibehalten (Beenden)

Wenn Sie die aktuellen Einstellungen beibehalten, werden keine Änderungen geschrieben und kein Aktualisierungshinweis angezeigt.
Wenn es keine Konfigurationsänderungen gibt, aber die aktuellen Projektdateien nicht mit Ihrem globalen Profil/Zustellmodus synchron sind, zeigt OpenSpec eine Warnung an und schlägt vor, `openspec update` auszuführen.
Drücken von `Ctrl+C` bricht den Ablauf ebenfalls sauber ab (kein Stack Trace) und beendet mit Code `130`.
In der Workflow-Checkliste bedeutet `[x]`, dass der Workflow in der globalen Konfiguration ausgewählt ist. Um diese Auswahl auf Projektdateien anzuwenden, führen Sie `openspec update` aus (oder wählen Sie `Apply changes to this project now?`, wenn Sie innerhalb eines Projekts dazu aufgefordert werden).

**Interaktive Beispiele:**

```bash
# Nur-Zustellmodus-Aktualisierung
openspec config profile
# wählen: Change delivery only
# Zustellmodus wählen: Skills only

# Nur-Workflows-Aktualisierung
openspec config profile
# wählen: Change workflows only
# Workflows in der Checkliste umschalten, dann bestätigen
```

---

## Hilfsbefehle

### `openspec feedback`

Sendet Feedback zu OpenSpec. Erstellt ein GitHub-Issue.

```
openspec feedback <message> [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|--------------|--------------|
| `message` | Ja | Feedback-Nachricht |

**Optionen:**

| Option | Beschreibung |
|--------|--------------|
| `--body <text>` | Detaillierte Beschreibung |

**Voraussetzungen:** GitHub CLI (`gh`) muss installiert und authentifiziert sein.

**Beispiel:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Verwaltet Shell-Vervollständigungen für die OpenSpec CLI.

```
openspec completion <subcommand> [shell]
```

**Unterbefehle:**

| Unterbefehl | Beschreibung |
|-------------|--------------|
| `generate [shell]` | Vervollständigungsskript auf stdout ausgeben |
| `install [shell]` | Vervollständigung für Ihre Shell installieren |
| `uninstall [shell]` | Installierte Vervollständigungen entfernen`

**Unterstützte Shells:** `bash`, `zsh`, `fish`, `powershell`

**Beispiele:**

```bash
# Vervollständigungen installieren (erkennt Shell automatisch)
openspec completion install

# Für spezifische Shell installieren
openspec completion install zsh

# Skript für manuelle Installation generieren
openspec completion generate bash > ~/.bash_completion.d/openspec

# Deinstallieren
openspec completion uninstall
```

---

## Beendigungscodes

| Code | Bedeutung |
|------|-----------|
| `0` | Erfolg |
| `1` | Fehler (Validierungsfehler, fehlende Dateien usw.) |

---

## Umgebungsvariablen

| Variable | Beschreibung |
|----------|--------------|
| `OPENSPEC_TELEMETRY` | Auf `0` setzen, um Telemetrie zu deaktivieren |
| `DO_NOT_TRACK` | Auf `1` setzen, um Telemetrie zu deaktivieren (Standard-DNT-Signal) |
| `OPENSPEC_CONCURRENCY` | Standard-Gleichzeitigkeit für Stapelvalidierung (Standard: 6) |
| `EDITOR` oder `VISUAL` | Editor für `openspec config edit` |
| `NO_COLOR` | Deaktiviert Farbausgabe, wenn gesetzt |

---

## Verwandte Dokumentation

- [Befehle](commands.md) - KI-Slash-Befehle (`/opsx:propose`, `/opsx:apply` usw.)
- [Workflows](workflows.md) - Häufige Muster und wann jeder Befehl verwendet wird
- [Anpassung](customization.md) - Erstellen Sie benutzerdefinierte Schemas und Vorlagen
- [Erste Schritte](getting-started.md) - Ersteinrichtungsanleitung