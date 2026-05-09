# CLI-Referenz

Die OpenSpec CLI (`openspec`) bietet Terminalbefehle für die Projekteinrichtung, Validierung, Statusprüfung und Verwaltung. Diese Befehle ergänzen die AI-Slash-Befehle (wie `/opsx:propose`), die in [Befehle](commands.md) dokumentiert sind.

## Zusammenfassung

| Kategorie | Befehle | Zweck |
|-----------|---------|-------|
| **Einrichtung** | `init`, `update` | OpenSpec in Ihrem Projekt initialisieren und aktualisieren |
| **Arbeitsbereiche (Beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace open` | Planung über verknüpfte Repositories oder Ordner einrichten |
| **Durchsuchen** | `list`, `view`, `show` | Änderungen und Spezifikationen erkunden |
| **Validierung** | `validate` | Änderungen und Spezifikationen auf Probleme prüfen |
| **Lebenszyklus** | `archive` | Abgeschlossene Änderungen finalisieren |
| **Workflow** | `status`, `instructions`, `templates`, `schemas` | Artefaktgestützte Workflow-Unterstützung |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Benutzerdefinierte Workflows erstellen und verwalten |
| **Konfiguration** | `config` | Einstellungen anzeigen und ändern |
| **Dienstprogramme** | `feedback`, `completion` | Feedback und Shell-Integration |

---

## Menschliche vs. Agenten-Befehle

Die meisten CLI-Befehle sind für die **menschliche Verwendung** in einem Terminal konzipiert. Einige Befehle unterstützen auch die **Agenten-/Skriptverwendung** über JSON-Ausgabe.

### Nur für Menschen gedachte Befehle

Diese Befehle sind interaktiv und für die Terminalnutzung ausgelegt:

| Befehl | Zweck |
|---------|---------|
| `openspec init` | Projekt initialisieren (interaktive Eingabeaufforderungen) |
| `openspec view` | Interaktives Dashboard |
| `openspec config edit` | Konfiguration im Editor öffnen |
| `openspec feedback` | Feedback über GitHub einreichen |
| `openspec completion install` | Shell-Autovervollständigungen installieren |

### Agenten-kompatible Befehle

Diese Befehle unterstützen `--json`-Ausgabe für die programmgesteuerte Nutzung durch KI-Agenten und Skripte:

| Befehl | Menschliche Nutzung | Agentennutzung |
|---------|-----------|-----------|
| `openspec list` | Änderungen/Spezifikationen durchsuchen | `--json` für strukturierte Daten |
| `openspec show <item>` | Inhalt lesen | `--json` zum Parsen |
| `openspec validate` | Auf Probleme prüfen | `--all --json` für Massenvalidierung |
| `openspec status` | Artefaktfortschritt anzeigen | `--json` für strukturierten Status |
| `openspec instructions` | Nächste Schritte abrufen | `--json` für Agentenanweisungen |
| `openspec templates` | Vorlagenpfade finden | `--json` für Pfadauflösung |
| `openspec schemas` | Verfügbare Schemas auflisten | `--json` zur Schema-Erkennung |
| `openspec workspace setup --no-interactive` | Arbeitsbereich mit expliziten Eingaben erstellen | `--json` für strukturierte Setup-Ausgabe |
| `openspec workspace list` | Bekannte Arbeitsbereiche durchsuchen | `--json` für typisierte Arbeitsbereichsobjekte |
| `openspec workspace link` | Ein Repository oder einen Ordner verknüpfen | `--json` für strukturierte Verknüpfungsausgabe |
| `openspec workspace relink` | Einen verknüpften Pfad reparieren | `--json` für strukturierte Verknüpfungsausgabe |
| `openspec workspace doctor` | Einen Arbeitsbereich prüfen | `--json` für strukturierte Statusausgabe |

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

Initialisiert OpenSpec in Ihrem Projekt. Erstellt die Ordnerstruktur und konfiguriert KI-Tool-Integrationen.

Das Standardverhalten verwendet globale Konfigurationsstandards: Profil `core`, Lieferung `both`, Workflows `propose, explore, apply, sync, archive`.

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
| `--tools <list>` | KI-Tools nicht-interaktiv konfigurieren. Verwenden Sie `all`, `none` oder eine kommagetrennte Liste |
| `--force` | Veraltete Dateien automatisch bereinigen ohne Nachfrage |
| `--profile <profile>` | Globales Profil für diesen Initialisierungslauf überschreiben (`core` oder `custom`) |

`--profile custom` verwendet die aktuell im globalen Profil ausgewählten Workflows (`openspec config profile`).

**Unterstützte Tool-IDs (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**Beispiele:**

```bash
# Interaktive Initialisierung
openspec init

# In einem bestimmten Verzeichnis initialisieren
openspec init ./my-project

# Nicht-interaktiv: für Claude und Cursor konfigurieren
openspec init --tools claude,cursor

# Für alle unterstützten Tools konfigurieren
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

.claude/skills/         # Claude Code Skills (wenn claude ausgewählt)
.cursor/skills/         # Cursor Skills (wenn cursor ausgewählt)
.cursor/commands/       # Cursor OPSX-Befehle (wenn Lieferung Befehle enthält)
... (andere Tool-Konfigurationen)
```

---

### `openspec update`

Aktualisiert OpenSpec-Anweisungsdateien nach einem CLI-Upgrade. Generiert KI-Tool-Konfigurationsdateien unter Verwendung Ihres aktuellen globalen Profils, der ausgewählten Workflows und des Liefermodus neu.

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
| `--force` | Aktualisierung erzwingen, auch wenn Dateien auf dem neuesten Stand sind |

**Beispiel:**

```bash
# Anweisungsdateien nach npm-Upgrade aktualisieren
npm update @fission-ai/openspec
openspec update
```

---

## Arbeitsbereichsbefehle

Arbeitsbereichsbefehle befinden sich in aktiver Entwicklung und sind noch nicht einsatzbereit. Erstellen Sie keine externen Automatisierungen, Integrationen oder langlebigen Workflows auf dieser Befehlsoberfläche; das Befehlsverhalten, Statusdateien und die JSON-Ausgabe können sich jederzeit ändern.

Koordinierungsarbeitsbereiche sind Planungszentralen für Arbeit, die mehrere Repositories oder Ordner umfasst. Die Sichtbarkeit eines Arbeitsbereichs ist keine Änderungsverpflichtung: Verknüpfen Sie die Repositories oder Ordner, die OpenSpec kennen soll, und erstellen Sie dann Änderungen, wenn Sie bereit sind, spezifische Arbeit zu planen.

### `openspec workspace setup`

Erstellt einen Arbeitsbereich am standardmäßigen OpenSpec-Arbeitsbereichsort und verknüpft mindestens ein vorhandenes Repository oder einen Ordner.

```bash
openspec workspace setup [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--name <name>` | Arbeitsbereichsname. Namen müssen kebab-case sein |
| `--link <path>` | Ein vorhandenes Repository oder einen Ordner verknüpfen und den Verknüpfungsnamen aus dem Ordnernamen ableiten |
| `--link <name>=<path>` | Ein vorhandenes Repository oder einen Ordner mit einem expliziten Verknüpfungsnamen verknüpfen |
| `--opener <id>` | Bevorzugten Öffner während nicht-interaktiver Einrichtung speichern: `codex`, `claude`, `github-copilot` oder `editor` |
| `--no-interactive` | Eingabeaufforderungen deaktivieren; erfordert `--name` und mindestens einen `--link` |
| `--json` | JSON ausgeben; erfordert `--no-interactive` |

**Beispiele:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

Die interaktive Einrichtung fragt nach einem bevorzugten Öffner und speichert ihn im maschinenlokalen Arbeitsbereichszustand. Die nicht-interaktive Einrichtung speichert einen bevorzugten Öffner nur, wenn `--opener` angegeben ist; andernfalls fordert `workspace open` später in interaktiven Terminals auf, wenn ein unterstützter Öffner verfügbar ist, oder bittet Skripte, `--agent <tool>` oder `--editor` zu übergeben.

### `openspec workspace list`

Listet bekannte OpenSpec-Arbeitsbereiche aus dem lokalen Register auf.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

Die Liste zeigt den Standort jedes Arbeitsbereichs und verknüpfte Repositories oder Ordner an. Veraltete Registerdatensätze werden gemeldet, aber nicht geändert.

### `openspec workspace link`

Zeichnet ein vorhandenes Repository oder einen Ordner für einen Arbeitsbereich auf.

```bash
openspec workspace link [name] <path> [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--workspace <name>` | Einen bekannten Arbeitsbereich aus dem lokalen Register auswählen |
| `--json` | JSON ausgeben |
| `--no-interactive` | Arbeitsbereichsauswahl-Eingabeaufforderungen deaktivieren |

**Beispiele:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

Der Pfad muss bereits existieren. Relative Pfade werden relativ zum aktuellen Verzeichnis des Befehls aufgelöst, bevor OpenSpec den verifizierten absoluten Pfad im maschinenlokalen Arbeitsbereichszustand speichert. Verknüpfte Pfade können vollständige Repositories, Pakete, Dienste, Anwendungen oder Ordner ohne repo-lokale `openspec/`-Zustände sein.

### `openspec workspace relink`

Repariert oder ändert den lokalen Pfad für eine vorhandene Verknüpfung.

```bash
openspec workspace relink <name> <path> [options]
```

Der Pfad muss bereits existieren. Relink aktualisiert nur den maschinenlokalen Pfad für den stabilen Verknüpfungsnamen.

### `openspec workspace doctor`

Prüft, was ein Arbeitsbereich auf dem aktuellen Computer auflösen kann.

```bash
openspec workspace doctor [options]
```

Doctor zeigt den Arbeitsbereichsort, den Planungspfad, verknüpfte Repositories oder Ordner, fehlende Pfade, repo-lokale Spezifikationspfade (falls vorhanden) und vorgeschlagene Korrekturen an. Es meldet nur Probleme; es repariert sie nicht automatisch.

Befehle, die einen Arbeitsbereich benötigen, verwenden den aktuellen Arbeitsbereich, wenn sie aus einem Arbeitsbereichsordner oder Unterverzeichnis heraus ausgeführt werden. Von anderswo übergeben Sie `--workspace <name>`, wählen aus dem Picker in einem interaktiven Terminal aus oder verlassen sich auf den einzigen bekannten Arbeitsbereich, wenn genau einer existiert. Im `--json`- oder `--no-interactive`-Modus schlägt die mehrdeutige Auswahl mit einem strukturierten Statusfehler fehl und schlägt `--workspace <name>` vor.

JSON-Antworten verwenden typisierte Objekte plus `status`-Arrays. Primäre Daten befinden sich in `workspace`, `workspaces` oder `link`; Warnungen und Fehler befinden sich in `status`.

### `openspec workspace open`

Öffnet einen Arbeitsbereichsarbeitssatz über den gespeicherten bevorzugten Öffner, eine ein-Sitzung-Agentenüberschreibung oder den VS-Code-Editor-Modus.

```bash
openspec workspace open [name] [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--workspace <name>` | Alias für den positionellen Arbeitsbereichsnamen |
| `--agent <tool>` | Ein-Sitzung-Agentenüberschreibung: `codex`, `claude` oder `github-copilot` |
| `--editor` | Die gepflegte VS-Code-Arbeitsbereichsdatei als normalen Editor-Arbeitsbereich öffnen |
| `--no-interactive` | Arbeitsbereichs- und Öffner-Picker-Eingabeaufforderungen deaktivieren |

**Beispiele:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex
openspec workspace open --editor
```

`workspace open` verwendet den aktuellen Arbeitsbereich, wenn es innerhalb eines solchen ausgeführt wird, wählt automatisch den einzigen bekannten Arbeitsbereich aus, wenn es woanders ausgeführt wird, und bittet den Benutzer um Auswahl, wenn mehrere Arbeitsbereiche bekannt sind. `--agent` und `--editor` ändern nicht den gespeicherten bevorzugten Öffner. Beide Öffnerüberschreibungen zu übergeben ist ein Fehler; wählen Sie entweder `--agent <tool>` oder `--editor`.

OpenSpec pflegt `<workspace-name>.code-workspace` im Arbeitsbereichs-Stammverzeichnis für VS-Code-Editor- und GitHub-Copilot-in-VS-Code-Öffnungen. Diese Datei ist maschinenlokal und wird standardmäßig mit einem spezifischen `<workspace-name>.code-workspace`-`.gitignore`-Eintrag ignoriert, sodass benutzererstellte `*.code-workspace`-Dateien weiterhin für die Nachverfolgung in Frage kommen.

Der gepflegte VS-Code-Arbeitsbereich enthält den Koordinierungsstamm als `.` plus gültige verknüpfte Repositories oder Ordner als zusätzliche Stämme. VS-Code zeigt diese Einträge als Multi-Root-Arbeitsbereich an.

Das Öffnen des Stamm-Arbeitsbereichs unterstützt Exploration und Planung über verknüpfte Repositories oder Ordner hinweg. Implementierungs-Änderungen sollten erst nach einer expliziten Benutzeranfrage und einem normalen OpenSpec-Implementierungsworkflow beginnen.

## Befehle zum Durchsuchen

### `openspec list`

Änderungen oder Spezifikationen in Ihrem Projekt auflisten.

```
openspec list [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--specs` | Spezifikationen statt Änderungen auflisten |
| `--changes` | Änderungen auflisten (Standard) |
| `--sort <order>` | Sortierung nach `recent` (Standard) oder `name` |
| `--json` | Ausgabe als JSON |

**Beispiele:**

```bash
# Alle aktiven Änderungen auflisten
openspec list

# Alle Spezifikationen auflisten
openspec list --specs

# JSON-Ausgabe für Skripte
openspec list --json
```

**Ausgabe (Text):**

```
Aktive Änderungen:
  add-dark-mode     UI-Theme-Umschaltunterstützung
  fix-login-bug     Session-Timeout-Behandlung
```

---

### `openspec view`

Ein interaktives Dashboard zur Erkundung von Spezifikationen und Änderungen anzeigen.

```
openspec view
```

Öffnet eine terminalbasierte Oberfläche zur Navigation durch die Spezifikationen und Änderungen Ihres Projekts.

---

### `openspec show`

Details einer Änderung oder Spezifikation anzeigen.

```
openspec show [item-name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `item-name` | Nein | Name der Änderung oder Spezifikation (wird bei Auslassung abgefragt) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--type <type>` | Typ angeben: `change` oder `spec` (wird bei Eindeutigkeit automatisch erkannt) |
| `--json` | Ausgabe als JSON |
| `--no-interactive` | Eingabeaufforderungen deaktivieren |

**Änderungsspezifische Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--deltas-only` | Nur Delta-Spezifikationen anzeigen (JSON-Modus) |

**Spezifikationsspezifische Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--requirements` | Nur Anforderungen anzeigen, Szenarien ausschließen (JSON-Modus) |
| `--no-scenarios` | Szenarioinhalt ausschließen (JSON-Modus) |
| `-r, --requirement <id>` | Bestimmte Anforderung nach 1-basiertem Index anzeigen (JSON-Modus) |

**Beispiele:**

```bash
# Interaktive Auswahl
openspec show

# Eine bestimmte Änderung anzeigen
openspec show add-dark-mode

# Eine bestimmte Spezifikation anzeigen
openspec show auth --type spec

# JSON-Ausgabe zur Verarbeitung
openspec show add-dark-mode --json
```

---

## Validierungsbefehle

### `openspec validate`

Änderungen und Spezifikationen auf strukturelle Probleme prüfen.

```
openspec validate [item-name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `item-name` | Nein | Bestimmtes Element zum Validieren (wird bei Auslassung abgefragt) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--all` | Alle Änderungen und Spezifikationen validieren |
| `--changes` | Alle Änderungen validieren |
| `--specs` | Alle Spezifikationen validieren |
| `--type <type>` | Typ bei Mehrdeutigkeit des Namens angeben: `change` oder `spec` |
| `--strict` | Strikten Validierungsmodus aktivieren |
| `--json` | Ausgabe als JSON |
| `--concurrency <n>` | Maximale parallele Validierungen (Standard: 6, oder `OPENSPEC_CONCURRENCY`-Umgebungsvariable) |
| `--no-interactive` | Eingabeaufforderungen deaktivieren |

**Beispiele:**

```bash
# Interaktive Validierung
openspec validate

# Eine bestimmte Änderung validieren
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
  ⚠ design.md: Abschnitt "Technical Approach" fehlt

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
        "warnings": ["design.md: Abschnitt 'Technical Approach' fehlt"]
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

Archiviere eine abgeschlossene Änderung und führe Delta-Spezifikationen mit den Hauptspezifikationen zusammen.

```
openspec archive [change-name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|--------------|--------------|
| `change-name` | Nein | Zu archivierende Änderung (wird abgefragt, wenn weggelassen) |

**Optionen:**

| Option | Beschreibung |
|--------|--------------|
| `-y, --yes` | Bestätigungsabfragen überspringen |
| `--skip-specs` | Spezifikationsaktualisierungen überspringen (für Änderungen nur an Infrastruktur/Werkzeugen/Dokumentation) |
| `--no-validate` | Validierung überspringen (erfordert Bestätigung) |

**Beispiele:**

```bash
# Interaktive Archivierung
openspec archive

# Bestimmte Änderung archivieren
openspec archive add-dark-mode

# Ohne Abfragen archivieren (CI/Skripte)
openspec archive add-dark-mode --yes

# Eine Werkzeugänderung archivieren, die keine Spezifikationen betrifft
openspec archive update-ci-config --skip-specs
```

**Was es tut:**

1. Validiert die Änderung (außer bei `--no-validate`)
2. Fordert zur Bestätigung auf (außer bei `--yes`)
3. Führt Delta-Spezifikationen in `openspec/specs/` zusammen
4. Verschiebt den Änderungsordner nach `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Workflow-Befehle

Diese Befehle unterstützen den artefaktgetriebenen OPSX-Workflow. Sie sind sowohl für Menschen zur Fortschrittsprüfung als auch für Agenten zur Bestimmung der nächsten Schritte nützlich.

### `openspec status`

Zeigt den Abschlussstatus der Artefakte für eine Änderung an.

```
openspec status [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|--------------|
| `--change <id>` | Änderungsname (wird abgefragt, wenn weggelassen) |
| `--schema <name>` | Schema-Überschreibung (wird automatisch aus der Konfiguration der Änderung erkannt) |
| `--json` | Ausgabe als JSON |

**Beispiele:**

```bash
# Interaktive Statusprüfung
openspec status

# Status für eine bestimmte Änderung
openspec status --change add-dark-mode

# JSON für die Verwendung durch Agenten
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

Erhalte angereicherte Anweisungen zur Erstellung eines Artefakts oder zur Anwendung von Aufgaben. Wird von KI-Agenten verwendet, um zu verstehen, was als nächstes erstellt werden soll.

```
openspec instructions [artifact] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|--------------|--------------|
| `artifact` | Nein | Artefakt-ID: `proposal`, `specs`, `design`, `tasks` oder `apply` |

**Optionen:**

| Option | Beschreibung |
|--------|--------------|
| `--change <id>` | Änderungsname (erforderlich im nicht-interaktiven Modus) |
| `--schema <name>` | Schema-Überschreibung |
| `--json` | Ausgabe als JSON |

**Sonderfall:** Verwende `apply` als Artefakt, um Implementierungsanweisungen für Aufgaben zu erhalten.

**Beispiele:**

```bash
# Anweisungen für das nächste Artefakt abrufen
openspec instructions --change add-dark-mode

# Anweisungen für ein bestimmtes Artefakt abrufen
openspec instructions design --change add-dark-mode

# Anweisungen für die Anwendung/Implementierung abrufen
openspec instructions apply --change add-dark-mode

# JSON für die Verwendung durch Agenten
openspec instructions design --change add-dark-mode --json
```

**Ausgabe umfasst:**

- Vorlageninhalt für das Artefakt
- Projektkontext aus der Konfiguration
- Inhalt von Abhängigkeitsartefakten
- Artefaktspezifische Regeln aus der Konfiguration

---

### `openspec templates`

Zeigt die aufgelösten Vorlagenpfade für alle Artefakte in einem Schema an.

```
openspec templates [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|--------------|
| `--schema <name>` | Zu prüfendes Schema (Standard: `spec-driven`) |
| `--json` | Ausgabe als JSON |

**Beispiele:**

```bash
# Vorlagenpfade für das Standardschema anzeigen
openspec templates

# Vorlagen für ein benutzerdefiniertes Schema anzeigen
openspec templates --schema my-workflow

# JSON für programmatische Verwendung
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

Listet verfügbare Workflow-Schemata mit ihren Beschreibungen und Artefaktflüssen auf.

```
openspec schemas [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|--------------|
| `--json` | Ausgabe als JSON |

**Beispiel:**

```bash
openspec schemas
```

**Ausgabe:**

```
Verfügbare Schemata:

  spec-driven (package)
    Das standardmäßige spezifikationsgetriebene Entwicklungsworkflow
    Fluss: proposal → specs → design → tasks

  my-custom (project)
    Benutzerdefinierter Workflow für dieses Projekt
    Fluss: research → proposal → tasks
```

---

## Schema-Befehle

Befehle zum Erstellen und Verwalten benutzerdefinierter Workflow-Schemata.

### `openspec schema init`

Erstelle ein neues projektlokales Schema.

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
| `--description <text>` | Schemabeschreibung |
| `--artifacts <list>` | Komma-getrennte Artefakt-IDs (Standard: `proposal,specs,design,tasks`) |
| `--default` | Als Projekt-Standardschema festlegen |
| `--no-default` | Nicht nach Festlegung als Standard fragen |
| `--force` | Vorhandenes Schema überschreiben |
| `--json` | Ausgabe als JSON |

**Beispiele:**

```bash
# Interaktive Schemaerstellung
openspec schema init research-first

# Nicht-interaktiv mit bestimmten Artefakten
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**Was es erstellt:**

```
openspec/schemas/<name>/
├── schema.yaml           # Schemadefinition
└── templates/
    ├── proposal.md       # Vorlage für jedes Artefakt
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Kopiert ein vorhandenes Schema in dein Projekt zur Anpassung.

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
| `--json` | Ausgabe als JSON |

**Beispiel:**

```bash
# Das eingebaute spec-driven-Schema forken
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
| `--json` | Ausgabe als JSON |

**Beispiel:**

```bash
# Ein bestimmtes Schema validieren
openspec schema validate my-workflow

# Alle Schemata validieren
openspec schema validate
```

---

### `openspec schema which`

Zeigt an, woher ein Schema aufgelöst wird (nützlich zur Fehlersuche bei Vorrang).

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
| `--all` | Alle Schemata mit ihren Quellen auflisten |
| `--json` | Ausgabe als JSON |

**Beispiel:**

```bash
# Überprüfen, woher ein Schema stammt
openspec schema which spec-driven
```

**Ausgabe:**

```
spec-driven wird aufgelöst von: package
  Quelle: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Schema-Vorrang:**

1. Projekt: `openspec/schemas/<name>/`
2. Benutzer: `~/.local/share/openspec/schemas/<name>/`
3. Paket: Eingebaute Schemata

---

## Konfigurationsbefehle

### `openspec config`

Globale OpenSpec-Konfiguration anzeigen und ändern.

```
openspec config <subcommand> [options]
```

**Unterbefehle:**

| Unterbefehl | Beschreibung |
|------------|-------------|
| `path` | Speicherort der Konfigurationsdatei anzeigen |
| `list` | Alle aktuellen Einstellungen anzeigen |
| `get <key>` | Einen bestimmten Wert abrufen |
| `set <key> <value>` | Einen Wert festlegen |
| `unset <key>` | Einen Schlüssel entfernen |
| `reset` | Auf Standardwerte zurücksetzen |
| `edit` | In `$EDITOR` öffnen |
| `profile [preset]` | Workflow-Profil interaktiv oder über eine Voreinstellung konfigurieren |

**Beispiele:**

```bash
# Konfigurationsdateipfad anzeigen
openspec config path

# Alle Einstellungen auflisten
openspec config list

# Einen bestimmten Wert abrufen
openspec config get telemetry.enabled

# Einen Wert festlegen
openspec config set telemetry.enabled false

# Einen String-Wert explizit festlegen
openspec config set user.name "My Name" --string

# Eine benutzerdefinierte Einstellung entfernen
openspec config unset user.name

# Gesamte Konfiguration zurücksetzen
openspec config reset --all --yes

# Konfiguration im Editor bearbeiten
openspec config edit

# Profil mit aktionsbasiertem Assistenten konfigurieren
openspec config profile

# Schnelle Voreinstellung: Workflows auf Core umschalten (Beibehaltung des Delivery-Modus)
openspec config profile core
```

`openspec config profile` beginnt mit einer Zusammenfassung des aktuellen Zustands und lässt Sie dann wählen:
- Delivery + Workflows ändern
- Nur Delivery ändern
- Nur Workflows ändern
- Aktuelle Einstellungen beibehalten (Beenden)

Wenn Sie die aktuellen Einstellungen beibehalten, werden keine Änderungen geschrieben und kein Aktualisierungshinweis angezeigt.
Wenn keine Konfigurationsänderungen vorliegen, die aktuellen Projektdateien jedoch nicht mit Ihrem globalen Profil/Delivery synchron sind, zeigt OpenSpec eine Warnung an und schlägt vor, `openspec update` auszuführen.
Das Drücken von `Strg+C` bricht den Vorgang sauber ab (kein Stack-Trace) und beendet mit Code `130`.
In der Workflow-Checkliste bedeutet `[x]`, dass der Workflow in der globalen Konfiguration ausgewählt ist. Um diese Auswahlen auf Projektdateien anzuwenden, führen Sie `openspec update` aus (oder wählen Sie `Änderungen jetzt auf dieses Projekt anwenden?`, wenn Sie innerhalb eines Projekts dazu aufgefordert werden).

**Interaktive Beispiele:**

```bash
# Nur Delivery aktualisieren
openspec config profile
# wählen: Nur Delivery ändern
# Delivery wählen: Nur Skills

# Nur Workflows aktualisieren
openspec config profile
# wählen: Nur Workflows ändern
# Workflows in der Checkliste umschalten, dann bestätigen
```

---

## Hilfsbefehle

### `openspec feedback`

Feedback zu OpenSpec einreichen. Erstellt ein GitHub-Issue.

```
openspec feedback <message> [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `message` | Ja | Feedback-Nachricht |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--body <text>` | Detaillierte Beschreibung |

**Voraussetzungen:** GitHub CLI (`gh`) muss installiert und authentifiziert sein.

**Beispiel:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Shell-Vervollständigungen für die OpenSpec-CLI verwalten.

```
openspec completion <subcommand> [shell]
```

**Unterbefehle:**

| Unterbefehl | Beschreibung |
|------------|-------------|
| `generate [shell]` | Vervollständigungsskript auf stdout ausgeben |
| `install [shell]` | Vervollständigung für Ihre Shell installieren |
| `uninstall [shell]` | Installierte Vervollständigungen entfernen |

**Unterstützte Shells:** `bash`, `zsh`, `fish`, `powershell`

**Beispiele:**

```bash
# Vervollständigungen installieren (erkennt Shell automatisch)
openspec completion install

# Für eine bestimmte Shell installieren
openspec completion install zsh

# Skript für manuelle Installation generieren
openspec completion generate bash > ~/.bash_completion.d/openspec

# Deinstallieren
openspec completion uninstall
```

---

## Exit-Codes

| Code | Bedeutung |
|------|---------|
| `0` | Erfolg |
| `1` | Fehler (Validierungsfehler, fehlende Dateien usw.) |

---

## Umgebungsvariablen

| Variable | Beschreibung |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Auf `0` setzen, um Telemetrie zu deaktivieren |
| `DO_NOT_TRACK` | Auf `1` setzen, um Telemetrie zu deaktivieren (standardmäßiges DNT-Signal) |
| `OPENSPEC_CONCURRENCY` | Standard-Parallelität für Massenvalidierung (Standard: 6) |
| `EDITOR` oder `VISUAL` | Editor für `openspec config edit` |
| `NO_COLOR` | Deaktiviert die Farbausgabe, wenn gesetzt |

---

## Zugehörige Dokumentation

- [Befehle](commands.md) - AI-Slash-Befehle (`/opsx:propose`, `/opsx:apply` usw.)
- [Workflows](workflows.md) - Gängige Muster und wann welcher Befehl verwendet wird
- [Anpassung](customization.md) - Benutzerdefinierte Schemas und Vorlagen erstellen
- [Erste Schritte](getting-started.md) - Leitfaden zur Ersteinrichtung