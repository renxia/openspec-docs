# CLI-Referenz

Die OpenSpec CLI (`openspec`) bietet Befehle für die Projekteinrichtung, Validierung, Statusüberprüfung und Verwaltung. Diese Befehle ergänzen die KI-Schrägstrichbefehle (wie `/opsx:propose`), die in [Befehle](commands.md) dokumentiert sind.

## Zusammenfassung

| Kategorie | Befehle | Zweck |
|----------|----------|---------|
| **Einrichtung** | `init`, `update` | OpenSpec in Ihrem Projekt initialisieren und aktualisieren |
| **Arbeitsbereiche (Beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace update`, `workspace open` | Lokale Ansichten über verknüpfte Repositories oder Ordner einrichten |
| **Geteilter Kontext (Beta)** | `context-store setup`, `context-store register`, `context-store unregister`, `context-store remove`, `context-store list`, `context-store doctor`, `initiative create`, `initiative show`, `initiative list` | Lokale context-store-Registrierungen und dauerhaften Initiative-Kontext verwalten |
| **Durchsuchung** | `list`, `view`, `show` | Änderungen und Spezifikationen erkunden |
| **Validierung** | `validate` | Änderungen und Spezifikationen auf Probleme prüfen |
| **Lebenszyklus** | `archive` | Abgeschlossene Änderungen finalisieren |
| **Arbeitsablauf** | `new change`, `set change`, `status`, `instructions`, `templates`, `schemas` | Artefaktgestützte Arbeitsablaufunterstützung |
| **Schemata** | `schema init`, `schema fork`, `schema validate`, `schema which` | Benutzerdefinierte Arbeitsabläufe erstellen und verwalten |
| **Konfiguration** | `config` | Einstellungen anzeigen und ändern |
| **Dienstprogramm** | `feedback`, `completion` | Feedback und Shell-Integration |

---

## Menschliche vs. Agenten-Befehle

Die meisten CLI-Befehle sind für die **menschliche Verwendung** in einem Terminal konzipiert. Einige Befehle unterstützen auch die **Agenten/Skript-Verwendung** über JSON-Ausgabe.

### Nur für Menschen gedachte Befehle

Diese Befehle sind interaktiv und für die Terminalverwendung konzipiert:

| Befehl | Zweck |
|---------|---------|
| `openspec init` | Projekt initialisieren (interaktive Eingabeaufforderungen) |
| `openspec view` | Interaktives Dashboard |
| `openspec config edit` | Konfiguration im Editor öffnen |
| `openspec feedback` | Feedback über GitHub einreichen |
| `openspec completion install` | Shell-Vervollständigungen installieren |

### Agenten-kompatible Befehle

Diese Befehle unterstützen `--json`-Ausgabe für die programmatische Nutzung durch KI-Agenten und Skripte:

| Befehl | Menschliche Nutzung | Agenten-Nutzung |
|---------|-----------|-----------|
| `openspec list` | Änderungen/Spezifikationen durchsuchen | `--json` für strukturierte Daten |
| `openspec show <item>` | Inhalt lesen | `--json` zum Parsen |
| `openspec validate` | Auf Probleme prüfen | `--all --json` für Massenvalidierung |
| `openspec status` | Fortschritt der Artefakte sehen | `--json` für strukturierten Status |
| `openspec instructions` | Nächste Schritte erhalten | `--json` für Agenten-Anweisungen |
| `openspec templates` | Vorlagenpfade finden | `--json` zur Pfadauflösung |
| `openspec schemas` | Verfügbare Schemas auflisten | `--json` zur Schema-Erkennung |
| `openspec workspace setup --no-interactive` | Einen Workspace mit expliziten Eingaben erstellen | `--json` für strukturierte Setup-Ausgabe |
| `openspec workspace list` | Bekannte Workspaces durchsuchen | `--json` für typisierte Workspace-Objekte |
| `openspec workspace link` | Ein Repo oder einen Ordner verlinken | `--json` für strukturierte Link-Ausgabe |
| `openspec workspace relink` | Einen verlinkten Pfad reparieren | `--json` für strukturierte Link-Ausgabe |
| `openspec workspace doctor` | Einen Workspace prüfen | `--json` für strukturierte Statusausgabe |
| `openspec workspace update` | Workspace-lokale Anleitung und Agenten-Skills aktualisieren | `--tools` wählt Agenten aus; Profil wählt Workflows |
| `openspec context-store setup <id>` | Einen lokalen Context-Store erstellen | `--json` mit expliziten Eingaben für strukturierte Setup-Ausgabe |
| `openspec context-store register <path>` | Einen vorhandenen Context-Store registrieren | `--json` für strukturierte Registrierungsausgabe |
| `openspec context-store unregister <id>` | Eine lokale Context-Store-Registrierung vergessen | `--json` für strukturierte Bereinigungsausgabe |
| `openspec context-store remove <id>` | Einen registrierten lokalen Context-Store-Ordner löschen | `--yes --json` für nicht-interaktive Löschung |
| `openspec context-store list` | Registrierte Context-Stores durchsuchen | `--json` für strukturierte Registrierungen |
| `openspec context-store doctor` | Lokale Store-Einrichtung prüfen | `--json` für strukturierte Diagnosen |
| `openspec initiative list` | Geteilte Initiativen durchsuchen | `--json` für strukturierte Initiativendatensätze |
| `openspec initiative show <id>` | Eine Initiative auflösen | `--json` für kanonische Pfade und Metadaten |
| `openspec new change <id>` | Repo-lokale Änderungsstruktur erstellen | `--json`, plus `--initiative` für geteilte Koordinationslinks |
| `openspec set change <id>` | Eingecheckte Änderungsmetadaten aktualisieren | `--json`, plus `--initiative` für geteilte Koordinationslinks |

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

Initialisiert OpenSpec in Ihrem Projekt. Erstelt die Ordnerstruktur und konfiguriert KI-Tool-Integrationen.

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
| `--force` | Automatische Bereinigung alter Dateien ohne Nachfrage |
| `--profile <profile>` | Globales Profil für diesen Init-Vorgang überschreiben (`core` oder `custom`) |

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

# Profil für diesen Vorgang überschreiben
openspec init --profile core

# Eingabeaufforderungen überspringen und alte Dateien automatisch bereinigen
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
.cursor/commands/       # Cursor OPSX-Befehle (wenn Lieferung Befehle einschließt)
... (andere Tool-Konfigurationen)
```

---

### `openspec update`

Aktualisiert die OpenSpec-Anweisungsdateien nach einem CLI-Upgrade. Generiert die KI-Tool-Konfigurationsdateien unter Verwendung Ihres aktuellen globalen Profils, der ausgewählten Workflows und des Lieferungsmodus neu.

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

## Workspace-Befehle

Workspace-Befehle befinden sich in der Betaphase. Das lokale Ansichtsmodell unten ist die aktuelle Ausrichtung, aber externe Automatisierung, Integrationen und langlebige Workflows sollten das Befehlsverhalten, die Zustandsdateien und die JSON-Ausgabe weiterhin als sich entwickelnd betrachten.

Koordinierungs-Workspaces sind maschinenlokale Ansichten über verknüpfte Repos oder Ordner. Die Workspace-Sichtbarkeit ist keine Änderungsverpflichtung: Verknüpfen Sie die Repos oder Ordner, die OpenSpec kennen soll, und erstellen Sie dann Änderungen, wenn Sie bereit sind, bestimmte Arbeiten zu planen.

### `openspec workspace setup`

Erstellt einen Workspace am Standard-OpenSpec-Workspace-Speicherort und verknüpft mindestens ein vorhandenes Repo oder einen Ordner.

```bash
openspec workspace setup [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--name <name>` | Workspace-Name. Namen müssen kebab-case sein |
| `--link <path>` | Ein vorhandenes Repo oder einen Ordner verlinken und den Linknamen aus dem Ordnernamen ableiten |
| `--link <name>=<path>` | Ein vorhandenes Repo oder einen Ordner mit einem expliziten Linknamen verlinken |
| `--opener <id>` | Bevorzugten Öffner bei nicht-interaktiver Einrichtung speichern: `codex-cli`, `claude`, `github-copilot` oder `editor` |
| `--tools <tools>` | Workspace-lokale OpenSpec-Skills für Agenten installieren. Verwenden Sie `all`, `none` oder kommagetrennte Tool-IDs |
| `--no-interactive` | Eingabeaufforderungen deaktivieren; erfordert `--name` und mindestens einen `--link` |
| `--json` | JSON ausgeben; erfordert `--no-interactive` |

**Beispiele:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli
openspec workspace setup --no-interactive --name platform --link /repos/api --tools codex,claude
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

Die interaktive Einrichtung fragt nach einem bevorzugten Öffner und kann workspace-lokale OpenSpec-Skills für ausgewählte Agenten installieren. Die nicht-interaktive Einrichtung speichert einen bevorzugten Öffner nur, wenn `--opener` angegeben wird; andernfalls fragt `workspace open` später in interaktiven Terminals, wenn ein unterstützter Öffner verfügbar ist, nach, oder fordert Skripte auf, `--agent <tool>` oder `--editor` zu übergeben.

Die Workspace-Skill-Installation ist in dieser Betaphase nur Skills: Selbst wenn die globale Lieferung `commands` oder `both` ist, schreibt die Workspace-Einrichtung Agenten-Skill-Ordner im Workspace-Stamm und erstellt keine Slash-Befehlsdateien. Das aktive globale Profil bestimmt, welche Workflow-Skills installiert werden; `--tools` bestimmt, welche Agenten sie erhalten. Wenn `--tools` bei nicht-interaktiver Einrichtung weggelassen wird, werden keine Skills installiert, und `workspace update --tools <ids>` kann sie später hinzufügen.

### `openspec workspace list`

Listet bekannte OpenSpec-Workspaces aus dem lokalen Register auf.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

Die Liste zeigt jeden Workspace-Speicherort und verknüpften Repos oder Ordner an. Veraltete Registerdatensätze werden gemeldet, aber nicht geändert.

### `openspec workspace link`

Zeichnet ein vorhandenes Repo oder einen Ordner für einen Workspace auf.

```bash
openspec workspace link [name] <path> [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--workspace <name>` | Einen bekannten Workspace aus dem lokalen Register auswählen |
| `--json` | JSON ausgeben |
| `--no-interactive` | Workspace-Auswahlaufforderungen deaktivieren |

**Beispiele:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

Der Pfad muss bereits vorhanden sein. Relative Pfade werden vor dem Speichern des verifizierten absoluten Pfads im maschinenlokalen Workspace-Zustand gegen das aktuelle Verzeichnis des Befehls aufgelöst. Verknüpfte Pfade können vollständige Repos, Pakete, Dienste, Apps oder Ordner ohne repo-lokalen `openspec/`-Zustand sein.

### `openspec workspace relink`

Repariert oder ändert den lokalen Pfad für eine vorhandene Verknüpfung.

```bash
openspec workspace relink <name> <path> [options]
```

Der Pfad muss bereits vorhanden sein. Relink aktualisiert nur den maschinenlokalen Pfad für den stabilen Linknamen.

### `openspec workspace doctor`

Prüft, was ein Workspace auf dem aktuellen Gerät auflösen kann.

```bash
openspec workspace doctor [options]
```

Doctor zeigt den Workspace-Speicherort, verknüpfte Repos oder Ordner, fehlende Pfade, repo-lokale Spezifikationspfade, falls vorhanden, und vorgeschlagene Korrekturen an. Die JSON-Ausgabe enthält auch den Workspace-Planungspfad zur Kompatibilität. Es meldet nur Probleme; es repariert sie nicht automatisch.

Befehle, die einen Workspace benötigen, verwenden den aktuellen Workspace, wenn sie aus einem Workspace-Ordner oder Unterverzeichnis heraus ausgeführt werden. Von anderswo wird `--workspace <name>` übergeben, aus dem Auswahlprogramm in einem interaktiven Terminal ausgewählt oder auf den einzigen bekannten Workspace zurückgegriffen, wenn genau einer existiert. Im `--json`- oder `--no-interactive`-Modus schlägt die mehrdeutige Auswahl mit einem strukturierten Statusfehler fehl und schlägt `--workspace <name>` vor.

JSON-Antworten verwenden typisierte Objekte plus `status`-Arrays. Primäre Daten befinden sich in `workspace`, `workspaces` oder `link`; Warnungen und Fehler in `status`.

### `openspec workspace update`

Aktualisiert workspace-lokale OpenSpec-Anleitung und Agenten-Skills.

```bash
openspec workspace update [name] [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--workspace <name>` | Einen bekannten Workspace aus dem lokalen Register auswählen |
| `--tools <tools>` | Agenten für Workspace-Skills auswählen. Verwenden Sie `all`, `none` oder kommagetrennte Tool-IDs |
| `--json` | JSON ausgeben |
| `--no-interactive` | Workspace-Auswahlaufforderungen deaktivieren |

**Beispiele:**

```bash
openspec workspace update
openspec workspace update platform
openspec workspace update --workspace platform --tools codex,claude
openspec workspace update --workspace platform --tools none
```

`workspace update` aktualisiert den generierten Workspace-Anleitungsbereich und die lokale offene Oberfläche. Für Agenten-Skills wird die gespeicherte Workspace-Skill-Agentenauswahl wiederverwendet, wenn `--tools` weggelassen wird. Die Übergabe von `--tools` ersetzt diese gespeicherte Auswahl. Es aktualisiert nur OpenSpec-verwaltete Workflow-Skill-Verzeichnisse im Workspace-Stamm, entfernt nicht mehr ausgewählte verwaltete Workflow-Skills und lässt verknüpfte Repos und Ordner unberührt.

Die Ausführung von `openspec update` innerhalb eines Workspace wird zu `openspec workspace update` umgeleitet; führen Sie `openspec update` in repo-lokalen Projekten aus, wenn Sie möchten, dass repo-eigene Tool-Dateien aktualisiert werden.

### `openspec workspace open`

Öffnet einen Workspace-Arbeitssatz über den gespeicherten bevorzugten Öffner, eine ein-Sitzung-Agentenüberschreibung oder den VS-Code-Editor-Modus.

```bash
openspec workspace open [name] [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--workspace <name>` | Alias für den positional Workspace-Namen |
| `--initiative <id>` | Eine Initiative als lokale Workspace-Ansicht öffnen. Akzeptiert `<id>` oder `<store>/<id>` |
| `--store <id>` | Registrierte Context-Store-ID für `--initiative` |
| `--store-path <path>` | Vorhandener lokaler Context-Store-Stamm für `--initiative` |
| `--agent <tool>` | Ein-Sitzung-Agentenüberschreibung: `codex-cli`, `claude` oder `github-copilot` |
| `--editor` | Die gepflegte VS-Code-Workspace-Datei als normale Editor-Workspace öffnen |
| `--no-interactive` | Workspace- und Öffner-Auswahlaufforderungen deaktivieren |

**Beispiele:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex-cli
openspec workspace open --editor
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative platform/billing-launch
```

`workspace open` verwendet den aktuellen Workspace, wenn es innerhalb eines solchen ausgeführt wird, wählt automatisch den einzigen bekannten Workspace aus, wenn es anderswo ausgeführt wird, und bittet den Benutzer um Auswahl, wenn mehrere Workspaces bekannt sind. `--agent` und `--editor` ändern nicht den gespeicherten bevorzugten Öffner. Die Übergabe beider Öffnerüberschreibungen ist ein Fehler; wählen Sie entweder `--agent <tool>` oder `--editor`.

Wenn `--initiative` verwendet wird, bereitet OpenSpec eine private lokale Workspace-Ansicht für diese Initiative vor oder wählt sie aus. Register-ausgewählte Stores werden nach ID gespeichert; `--store-path` speichert einen laufzeitlokalen Pfadselektor, da Workspace-Ansichten private lokale Zustände sind.

OpenSpec pflegt `<workspace-name>.code-workspace` im Workspace-Stamm für VS-Code-Editor- und GitHub-Copilot-in-VS-Code-Öffnungen. Diese Datei ist der maschinenlokale Workspace-Ansichtszustand.

Die gepflegte VS-Code-Workspace listet zuerst gültige verknüpfte Repos oder Ordner auf, dann die Initiaven-Verknüpfung, wenn vorhanden, dann die OpenSpec-Workspace-Dateien. VS-Code zeigt diese Einträge als Multi-Root-Workspace an.

Das Öffnen der Root-Workspace macht verknüpfte Repos oder Ordner für Erkundung und Kontext sichtbar. Implementierungs-Änderungen sollten erst nach einer expliziten Benutzeranfrage und einem normalen OpenSpec-Implementierungsworkflow beginnen.

## Befehle für geteilten Kontext

Kontextspeicher und Initiativen sind Beta-Koordinierungsoberflächen. Ein Kontextspeicher ist eine lokale Registrierung für dauerhaft geteilten Kontext, typischerweise ein Git-unterstützter Ordner oder ein Klon. Eine Initiative ist geteilter Koordinierungskontext innerhalb eines Kontextspeichers; repo-lokale Änderungen können darauf verlinken, ohne den geteilten Plan in jedes Repository zu kopieren.

### `openspec context-store setup`

Erstellt und registriert einen lokalen Kontextspeicher. Ohne Argumente in einem Terminal führt OpenSpec den Benutzer durch die Einrichtung. Agenten und Skripte sollten explizite Eingaben übergeben und `--json` verwenden.

```bash
openspec context-store setup [id] [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--path <path>` | Pfad zum Kontextspeicherordner; Standard ist das von OpenSpec verwaltete lokale Datenverzeichnis |
| `--init-git` | Initialisiert ein Git-Repository im Kontextspeicher |
| `--no-init-git` | Initialisiert kein Git-Repository |
| `--json` | Gibt JSON aus |

Wenn `--path` weggelassen wird, erstellt setup den Speicher unter `getGlobalDataDir()/context-stores/<id>`: `$XDG_DATA_HOME/openspec/context-stores/<id>` wenn `XDG_DATA_HOME` gesetzt ist, oder `~/.local/share/openspec/context-stores/<id>` als Unix-Standardrückfall. Übergeben Sie `--path`, wenn der Speicher in einem sichtbaren Klon oder einem teamspezifischen Ordner liegen soll.

Beispiele:

```bash
openspec context-store setup
openspec context-store setup team-context
openspec context-store setup team-context --path /repos/team-context --no-init-git
openspec context-store setup team-context --json --no-init-git
```

### `openspec context-store register`

Registriert einen bestehenden lokalen Kontextspeicherordner.

```bash
openspec context-store register [path] [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--id <id>` | ID des Kontextspeichers; Standard sind Speicher-Metadaten oder der Ordnername |
| `--json` | Gibt JSON aus |

### `openspec context-store unregister`

Entfernt die Registrierung eines lokalen Kontextspeichers, ohne Dateien zu löschen.

```bash
openspec context-store unregister <id> [--json]
```

Verwenden Sie dies, wenn ein Speicher verschoben, an anderer Stelle geklont wurde oder nicht mehr von OpenSpec auf diesem Rechner angezeigt werden soll.

### `openspec context-store remove`

Entfernt die Registrierung eines lokalen Kontextspeichers und löscht seinen lokalen Ordner.

```bash
openspec context-store remove <id> [--yes] [--json]
```

`remove` zeigt den genauen Ordner vor dem Löschen in einem interaktiven Terminal an. Agenten, Skripte und JSON-Aufrufer müssen `--yes` übergeben, um die Löschung zu bestätigen. OpenSpec weigert sich, einen Ordner zu löschen, der keine passenden Kontextspeicher-Metadaten enthält.

### `openspec context-store list`

Listet lokal registrierte Kontextspeicher auf.

```bash
openspec context-store list [--json]
openspec context-store ls [--json]
```

### `openspec context-store doctor`

Überprüft die lokale Kontextspeicher-Registrierung, Metadaten und das Vorhandensein von Git.

```bash
openspec context-store doctor [id] [--json]
```

Doctor ist nur diagnostisch; es meldet fehlende Stammverzeichnisse, Metadaten-Diskrepanzen und ungültige lokale Registrierungszustände, ohne den Speicher zu verändern.

### `openspec initiative create`

Erstellt eine Initiative in einem Kontextspeicher.

```bash
openspec initiative create <id> --title <title> --summary <summary> [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--store <id>` | ID des Kontextspeichers aus dem lokalen Register |
| `--store-path <path>` | Vorhandenes lokales Kontextspeicher-Stammverzeichnis |
| `--title <title>` | Titel der Initiative |
| `--summary <summary>` | Zusammenfassung der Initiative |
| `--json` | Gibt JSON aus |

### `openspec initiative list`

Listet Initiativen auf. Ohne Selektor durchsucht dieser Befehl alle registrierten Kontextspeicher und meldet Teil-Lese-Warnungen im `status`.

```bash
openspec initiative list [options]
openspec initiative ls [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--store <id>` | Listet einen registrierten Kontextspeicher auf |
| `--store-path <path>` | Listet ein vorhandenes lokales Kontextspeicher-Stammverzeichnis auf |
| `--json` | Gibt JSON aus |

### `openspec initiative show`

Löst eine Initiative auf und gibt ihren kanonischen Speicherort aus.

```bash
openspec initiative show <id> [options]
openspec initiative show <store>/<id> [options]
```

Ohne `--store` durchsucht OpenSpec registrierte Kontextspeicher. Wenn dieselbe Initiations-ID in mehreren Speichern existiert, übergeben Sie `--store <id>` oder verwenden Sie die Form `<store>/<id>`.

---

## Befehle zum Durchsuchen

### `openspec list`

Änderungen oder Spezifikationen in Ihrem Projekt auflisten.

```
openspec list [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|--------------|
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
  add-dark-mode     UI-Theme-Umschaltungsunterstützung
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
|----------|--------------|--------------|
| `item-name` | Nein | Name der Änderung oder Spezifikation (wird bei Auslassung abgefragt) |

**Optionen:**

| Option | Beschreibung |
|--------|--------------|
| `--type <type>` | Typ angeben: `change` oder `spec` (wird bei Eindeutigkeit automatisch erkannt) |
| `--json` | Ausgabe als JSON |
| `--no-interactive` | Abfragen deaktivieren |

**Optionen spezifisch für Änderungen:**

| Option | Beschreibung |
|--------|--------------|
| `--deltas-only` | Nur Delta-Spezifikationen anzeigen (JSON-Modus) |

**Optionen spezifisch für Spezifikationen:**

| Option | Beschreibung |
|--------|--------------|
| `--requirements` | Nur Anforderungen anzeigen, Szenarien ausschließen (JSON-Modus) |
| `--no-scenarios` | Szenarieninhalt ausschließen (JSON-Modus) |
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

Änderungen und Spezifikationen auf strukturelle Probleme validieren.

```
openspec validate [item-name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|--------------|--------------|
| `item-name` | Nein | Bestimmtes Element zur Validierung (wird bei Auslassung abgefragt) |

**Optionen:**

| Option | Beschreibung |
|--------|--------------|
| `--all` | Alle Änderungen und Spezifikationen validieren |
| `--changes` | Alle Änderungen validieren |
| `--specs` | Alle Spezifikationen validieren |
| `--type <type>` | Typ angeben, wenn Name mehrdeutig ist: `change` oder `spec` |
| `--strict` | Strenge Validierung aktivieren |
| `--json` | Ausgabe als JSON |
| `--concurrency <n>` | Maximale parallele Validierungen (Standard: 6, oder `OPENSPEC_CONCURRENCY`-Umgebungsvariable) |
| `--no-interactive` | Abfragen deaktivieren |

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

# Strenge Validierung mit erhöhter Parallelität
openspec validate --all --strict --concurrency 12
```

**Ausgabe (Text):**

```
Validierung von add-dark-mode...
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
        "warnings": ["design.md: missing 'Technical Approach' section"]
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

Eine abgeschlossene Änderung archivieren und Delta-Spezifikationen in die Hauptspezifikationen zusammenführen.

```
openspec archive [change-name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|--------------|--------------|
| `change-name` | Nein | Zu archivierende Änderung (wird bei Auslassung abgefragt) |

**Optionen:**

| Option | Beschreibung |
|--------|--------------|
| `-y, --yes` | Bestätigungsabfragen überspringen |
| `--skip-specs` | Spezifikationsaktualisierungen überspringen (für rein infrastruktur-/werkzeug-/dokumentationsbezogene Änderungen) |
| `--no-validate` | Validierung überspringen (erfordert Bestätigung) |

**Beispiele:**

```bash
# Interaktive Archivierung
openspec archive

# Bestimmte Änderung archivieren
openspec archive add-dark-mode

# Ohne Abfragen archivieren (CI/Skripte)
openspec archive add-dark-mode --yes

# Eine werkzeugbezogene Änderung archivieren, die keine Spezifikationen betrifft
openspec archive update-ci-config --skip-specs
```

**Funktionsweise:**

1. Validiert die Änderung (außer bei `--no-validate`)
2. Fordert zur Bestätigung auf (außer bei `--yes`)
3. Führt Delta-Spezifikationen in `openspec/specs/` zusammen
4. Verschiebt den Änderungsordner nach `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Workflow-Befehle

Diese Befehle unterstützen den artefaktgetriebenen OPSX-Workflow. Sie sind sowohl für Menschen nützlich, die den Fortschritt prüfen, als auch für Agenten, die die nächsten Schritte bestimmen.

### `openspec new change`

Ein repositories-lokales Änderungsverzeichnis und optionales eingechecktes Metadaten erstellen.

```bash
openspec new change <name> [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|--------------|
| `--description <text>` | Beschreibung, die zu `README.md` hinzugefügt werden soll |
| `--goal <text>` | Arbeitsbereich-Produktziel, das mit der Änderung gespeichert wird |
| `--areas <names>` | Komma-getrennte Namen betroffener Arbeitsbereichslinks |
| `--initiative <id>` | Die repositories-lokale Änderung mit einer Initiative verknüpfen |
| `--store <id>` | Kontextspeicher-ID für `--initiative` |
| `--store-path <path>` | Vorhandener lokaler Kontextspeicher-Stammordner für `--initiative` |
| `--schema <name>` | Zu verwendendes Workflow-Schema |
| `--json` | JSON ausgeben |

**Beispiele:**

```bash
openspec new change add-billing-api --initiative billing-launch --store platform
openspec new change add-billing-api --initiative platform/billing-launch --json
```

### `openspec set change`

Eingecheckte repositories-lokale Änderungsmetadaten aktualisieren, ohne die Änderung neu zu erstellen.

```bash
openspec set change <name> [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|--------------|
| `--initiative <id>` | Die repositories-lokale Änderung mit einer Initiative verknüpfen |
| `--store <id>` | Kontextspeicher-ID für `--initiative` |
| `--store-path <path>` | Vorhandener lokaler Kontextspeicher-Stammordner für `--initiative` |
| `--json` | JSON ausgeben |

`set change --initiative` ist idempotent, wenn die gewünschte Verknüpfung bereits existiert, und weigert sich, eine andere bestehende Initiaverknüpfung zu ersetzen.

### `openspec status`

Artefakt-Fertigstellungsstatus für eine Änderung anzeigen.

```
openspec status [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|--------------|
| `--change <id>` | Änderungsname (wird bei Auslassung abgefragt) |
| `--schema <name>` | Schema-Überschreibung (wird automatisch aus der Konfiguration der Änderung erkannt) |
| `--json` | Ausgabe als JSON |

**Beispiele:**

```bash
# Interaktive Statusprüfung
openspec status

# Status für eine bestimmte Änderung
openspec status --change add-dark-mode

# JSON zur Verwendung durch Agenten
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

Angereicherte Anweisungen für die Erstellung eines Artefakts oder die Umsetzung von Aufgaben abrufen. Wird von KI-Agenten verwendet, um zu verstehen, was als nächstes erstellt werden soll.

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
| `--change <id>` | Änderungsname (im nicht-interaktiven Modus erforderlich) |
| `--schema <name>` | Schema-Überschreibung |
| `--json` | Ausgabe als JSON |

**Sonderfall:** Verwenden Sie `apply` als Artefakt, um Anweisungen zur Aufgabenimplementierung zu erhalten.

**Beispiele:**

```bash
# Anweisungen für das nächste Artefakt abrufen
openspec instructions --change add-dark-mode

# Anweisungen für ein bestimmtes Artefakt abrufen
openspec instructions design --change add-dark-mode

# Anweisungen für die Umsetzung/Implementierung abrufen
openspec instructions apply --change add-dark-mode

# JSON zur Verwendung durch Agenten
openspec instructions design --change add-dark-mode --json
```

**Ausgabe enthält:**

- Vorlageninhalt für das Artefakt
- Projektkontext aus der Konfiguration
- Inhalt von Abhängigkeitsartefakten
- Regeln pro Artefakt aus der Konfiguration

---

### `openspec templates`

Aufgelöste Vorlagenpfade für alle Artefakte in einem Schema anzeigen.

```
openspec templates [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|--------------|
| `--schema <name>` | Zu untersuchendes Schema (Standard: `spec-driven`) |
| `--json` | Ausgabe als JSON |

**Beispiele:**

```bash
# Vorlagenpfade für das Standard-Schema anzeigen
openspec templates

# Vorlagen für ein benutzerdefiniertes Schema anzeigen
openspec templates --schema my-workflow

# JSON zur programmatischen Verwendung
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

Verfügbare Workflow-Schemas mit Beschreibungen und Artefaktflüssen auflisten.

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
Verfügbare Schemas:

  spec-driven (paket)
    Der standardmäßige spezifikationsgetriebene Entwicklungsworkflow
    Fluss: proposal → specs → design → tasks

  my-custom (projekt)
    Benutzerdefinierter Workflow für dieses Projekt
    Fluss: research → proposal → tasks
```

## Schema-Befehle

Befehle zum Erstellen und Verwalten von benutzerdefinierten Workflow-Schemas.

### `openspec schema init`

Erstellt ein neues projektlokales Schema.

```
openspec schema init <name> [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|--------------|--------------|
| `name` | Ja | Schemaname (kebab-case) |

**Optionen:**

| Option | Beschreibung |
|--------|--------------|
| `--description <text>` | Schemabeschreibung |
| `--artifacts <list>` | Komma-separierte Artefakt-IDs (Standard: `proposal,specs,design,tasks`) |
| `--default` | Als projektwertes Standardschema festlegen |
| `--no-default` | Nicht nachsetzen als Standard fragen |
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

Kopiert ein vorhandenes Schema in Ihr Projekt zur Anpassung.

```
openspec schema fork <source> [name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|--------------|--------------|
| `source` | Ja | Zu kopierendes Schema |
| `name` | Nein | Neuer Schemaname (Standard: `<source>-custom`) |

**Optionen:**

| Option | Beschreibung |
|--------|--------------|
| `--force` | Vorhandenes Ziel überschreiben |
| `--json` | Als JSON ausgeben |

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

Zeigt an, woher ein Schema aufgelöst wird (nützlich zur Debugging von Vorrang).

```
openspec schema which [name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|--------------|--------------|
| `name` | Nein | Schemaname |

**Optionen:**

| Option | Beschreibung |
|--------|--------------|
| `--all` | Alle Schemas mit ihren Quellen auflisten |
| `--json` | Als JSON ausgeben |

**Beispiel:**

```bash
# Überprüfen, woher ein Schema stammt
openspec schema which spec-driven
```

**Ausgabe:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Schema-Vorrang:**

1. Projekt: `openspec/schemas/<name>/`
2. Benutzer: `~/.local/share/openspec/schemas/<name>/`
3. Paket: Eingebaute Schemas

---

## Konfigurationsbefehle

### `openspec config`

Zeigt an und ändert die globale OpenSpec-Konfiguration.

```
openspec config <subcommand> [options]
```

**Unterbefehle:**

| Unterbefehl | Beschreibung |
|-------------|--------------|
| `path` | Speicherort der Konfigurationsdatei anzeigen |
| `list` | Alle aktuellen Einstellungen anzeigen |
| `get <key>` | Einen bestimmten Wert abrufen |
| `set <key> <value>` | Einen Wert festlegen |
| `unset <key>` | Einen Schlüssel entfernen |
| `reset` | Auf Standardwerte zurücksetzen |
| `edit` | In `$EDITOR` öffnen |
| `profile [preset]` | Workflow-Profil interaktiv oder über Voreinstellung konfigurieren |

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

# Alle Konfiguration zurücksetzen
openspec config reset --all --yes

# Konfiguration in Ihrem Editor bearbeiten
openspec config edit

# Profil mit aktionsbasiertem Assistenten konfigurieren
openspec config profile

# Schnelle Voreinstellung: Workflows zu Core wechseln (Behält Liefermodus bei)
openspec config profile core
```

`openspec config profile` beginnt mit einer Zusammenfassung des aktuellen Zustands und lässt Sie dann wählen:
- Lieferung + Workflows ändern
- Nur Lieferung ändern
- Nur Workflows ändern
- Aktuelle Einstellungen beibehalten (Beenden)

Wenn Sie die aktuellen Einstellungen beibehalten, werden keine Änderungen geschrieben und kein Aktualisierungsprompt angezeigt.
Es werden keine Konfigurationsänderungen vorgenommen, aber wenn die aktuellen Projekt- oder Arbeitsbereichsdateien nicht mit Ihrem globalen Profil/Lieferung synchron sind, zeigt OpenSpec eine Warnung an und schlägt `openspec update` für repo-lokale Projekte oder `openspec workspace update` für Arbeitsbereich-lokale Anleitung und Skills vor.
Ein Druck auf `Strg+C` bricht den Ablaub ebenfalls sauber ab (kein Stack-Trace) und beendet mit Code `130`.
In der Workflow-Checkliste bedeutet `[x]`, dass der Workflow in der globalen Konfiguration ausgewählt ist. Um diese Auswahl auf Projektdateien anzuwenden, führen Sie `openspec update` aus (oder wählen Sie `Änderungen jetzt auf dieses Projekt anwenden?`, wenn Sie in einem Projekt dazu aufgefordert werden). Von innerhalb eines Arbeitsbereichs verwenden Sie `openspec workspace update`, um Arbeitsbereich-lokale Anleitung und Skills zu aktualisieren; dies bleibt nur Skills für generierte Workflow-Dateien und erzeugt keine Arbeitsbereich-Slash-Befehle.

**Interaktive Beispiele:**

```bash
# Nur Lieferung aktualisieren
openspec config profile
# wählen: Nur Lieferung ändern
# Lieferung wählen: Nur Skills

# Nur Workflows aktualisieren
openspec config profile
# wählen: Nur Workflows ändern
# Workflows in der Checkliste umschalten, dann bestätigen
```

---

## Hilfsprogrammbefehle

### `openspec feedback`

Sendet Feedback zu OpenSpec ein. Erstellt ein GitHub-Issue.

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

**Anforderungen:** GitHub CLI (`gh`) muss installiert und authentifiziert sein.

**Beispiel:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Verwaltet Shell-Vervollständigungen für die OpenSpec-CLI.

```
openspec completion <subcommand> [shell]
```

**Unterbefehle:**

| Unterbefehl | Beschreibung |
|-------------|--------------|
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
|------|-----------|
| `0` | Erfolg |
| `1` | Fehler (Validierungsfehler, fehlende Dateien, usw.) |

---

## Umgebungsvariablen

| Variable | Beschreibung |
|----------|--------------|
| `OPENSPEC_TELEMETRY` | Auf `0` setzen, um Telemetrie zu deaktivieren |
| `DO_NOT_TRACK` | Auf `1` setzen, um Telemetrie zu deaktivieren (standardisiertes DNT-Signal) |
| `OPENSPEC_CONCURRENCY` | Standard-Konkurrenz für Massenvalidierung (Standard: 6) |
| `EDITOR` oder `VISUAL` | Editor für `openspec config edit` |
| `NO_COLOR` | Deaktiviert Farbausgabe, wenn gesetzt |

---

## Verwandte Dokumentation

- [Befehle](commands.md) - AI-Slash-Befehle (`/opsx:propose`, `/opsx:apply`, usw.)
- [Workflows](workflows.md) - Gängige Muster und wann welcher Befehl verwendet wird
- [Anpassung](customization.md) - Benutzerdefinierte Schemas und Vorlagen erstellen
- [Erste Schritte](getting-started.md) - Leitfaden zur Ersteinrichtung