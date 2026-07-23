# CLI-Referenz

Die OpenSpec-CLI (`openspec`) stellt Terminalbefehle für Projekteinrichtung, Validierung, Statusprüfung und Verwaltung bereit. Diese Befehle ergänzen die KI-Slash-Befehle (wie `/opsx:propose`), die in [Befehle](commands.md) dokumentiert sind.

## Zusammenfassung

| Kategorie | Befehle | Zweck |
|----------|----------|---------|
| **Einrichtung** | `init`, `update` | OpenSpec in Ihrem Projekt initialisieren und aktualisieren |
| **Stores (eigenständige OpenSpec-Repos)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Verwalten von Stores – eigenständige OpenSpec-Repos, die Sie registriert haben |
| **Gesundheit** | `doctor` | Gesundheitszustand der Beziehungen für das aufgelöste Stammverzeichnis melden |
| **Arbeitskontext** | `context` | Das Arbeits-Set (Stammverzeichnis + referenzierte Stores) zusammenstellen |
| **Persönliche Worksets** | `workset create`, `workset list`, `workset open`, `workset remove` | Persönliche, lokale Arbeitsansichten in Ihrem Tool speichern und öffnen |
| **Durchsuchen** | `list`, `view`, `show` | Änderungen und Spezifikationen erkunden |
| **Validierung** | `validate` | Änderungen und Spezifikationen auf Probleme prüfen |
| **Lebenszyklus** | `archive` | Abgeschlossene Änderungen abschließen |
| **Workflow** | `new change`, `status`, `instructions`, `templates`, `schemas` | Unterstützung für artefaktgesteuerte Workflows |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Benutzerdefinierte Workflows erstellen und verwalten |
| **Konfiguration** | `config` | Einstellungen anzeigen und ändern |
| **Dienstprogramme** | `feedback`, `completion` | Feedback und Shell-Integration |

## Menschliche vs. Agent-Befehle

Die meisten CLI-Befehle sind für die **Nutzung durch Menschen** in einem Terminal konzipiert. Einige Befehle unterstützen zusätzlich die **Nutzung durch Agenten/Skripte** über JSON-Ausgabe.

### Nur für Menschen bestimmte Befehle

Diese Befehle sind interaktiv und für die Nutzung im Terminal konzipiert:

| Befehl | Zweck |
|---------|-------|
| `openspec init` | Projekt initialisieren (interaktive Abfragen) |
| `openspec view` | Interaktives Dashboard |
| `openspec workset open <name>` | Gespeicherten Workset öffnen (Editor-Fenster oder Terminal-Agenten-Sitzung) |
| `openspec config edit` | Konfiguration im Editor öffnen |
| `openspec feedback` | Feedback über GitHub einreichen |
| `openspec completion install` | Shell-Vervollständigungen installieren |

### Mit Agenten kompatible Befehle

Diese Befehle unterstützen die Ausgabe mit `--json` zur programmatischen Nutzung durch KI-Agenten und Skripte:

| Befehl | Nutzung durch Menschen | Nutzung durch Agenten |
|---------|-----------|-----------|
| `openspec list` | Änderungen/Spezifikationen durchsuchen | `--json` für strukturierte Daten |
| `openspec show <item>` | Inhalt lesen | `--json` zum Parsen |
| `openspec validate` | Auf Probleme prüfen | `--all --json` für Massenvalidierung |
| `openspec status` | Artefaktfortschritt anzeigen | `--json` für strukturierten Status |
| `openspec instructions` | Nächste Schritte abrufen | `--json` für Agenten-Anweisungen |
| `openspec templates` | Pfade zu Vorlagen finden | `--json` zur Pfadauflösung |
| `openspec schemas` | Verfügbare Schemas auflisten | `--json` zur Schema-Erkennung |
| `openspec store setup <id>` | Lokalen Store erstellen und registrieren | `--json` mit expliziten Eingaben für strukturierte Setup-Ausgabe |
| `openspec store register <path>` | Vorhandenen Store registrieren | `--json` für strukturierte Registrierungsausgabe |
| `openspec store unregister <id>` | Lokale Store-Registrierung entfernen | `--json` für strukturierte Bereinigungsausgabe |
| `openspec store remove <id>` | Ordner eines registrierten lokalen Stores löschen | `--yes --json` für nicht-interaktives Löschen |
| `openspec store list` | Registrierte Stores durchsuchen | `--json` für strukturierte Registrierungen |
| `openspec store doctor` | Lokale Store-Einrichtung prüfen | `--json` für strukturierte Diagnose |
| `openspec new change <id>` | Repo-lokales Change-Gerüst erstellen | `--json`, plus `--store <id>` zur Nutzung eines registrierten Stores als OpenSpec-Root |
| `openspec workset create [name]` | Persönliche Arbeitsansicht zusammenstellen | `--member <path> --json` für nicht-interaktive Zusammenstellung |
| `openspec workset list` | Gespeicherte Worksets durchsuchen | `--json` für strukturierte Ansichten |
| `openspec workset remove <name>` | Gespeicherte Ansicht löschen | `--yes --json` für nicht-interaktives Entfernen |

---

## Globale Optionen

Diese Optionen funktionieren mit allen Befehlen:

| Option | Beschreibung |
|--------|-------------|
| `--version`, `-V` | Versionsnummer anzeigen |
| `--no-color` | Farbausgabe deaktivieren |
| `--help`, `-h` | Hilfe zum Befehl anzeigen |

---

## Einrichtungsbefehle

### `openspec init`

Initialisiert OpenSpec in deinem Projekt. Erstellt die Ordnerstruktur und konfiguriert KI-Tool-Integrationen.

Das Standardverhalten verwendet globale Konfigurationsstandards: Profil `core`, Bereitstellung `both`, Workflows `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `path` | Nein | Zielverzeichnis (Standard: aktuelles Verzeichnis) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--tools <list>` | KI-Tools nicht-interaktiv konfigurieren. Verwende `all`, `none` oder eine durch Kommas getrennte Liste |
| `--force` | Alte Dateien automatisch bereinigen, ohne Nachfrage |
| `--profile <profile>` | Globales Profil für diesen Init-Lauf überschreiben (`core` oder `custom`) |

`--profile custom` verwendet die Workflows, die aktuell in der globalen Konfiguration ausgewählt sind (`openspec config profile`).

**Unterstützte Tool-IDs (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

> Diese Liste entspricht `AI_TOOLS` in `src/core/config.ts`. Siehe [Unterstützte Tools](supported-tools.md) für die Fähigkeiten und Befehlspfade jedes Tools.

**Beispiele:**

```bash
# Interactive initialization
openspec init

# Initialize in a specific directory
openspec init ./my-project

# Non-interactive: configure for Claude and Cursor
openspec init --tools claude,cursor

# Configure for all supported tools
openspec init --tools all

# Override profile for this run
openspec init --profile core

# Skip prompts and auto-cleanup legacy files
openspec init --force
```

**Was erstellt wird:**

```
openspec/
├── specs/              # Deine Spezifikationen (Single Source of Truth)
├── changes/            # Vorgeschlagene Änderungen
└── config.yaml         # Projektkonfiguration

.claude/skills/         # Claude Code-Fähigkeiten (falls claude ausgewählt)
.cursor/skills/         # Cursor-Fähigkeiten (falls cursor ausgewählt)
.cursor/commands/       # Cursor-OPSX-Befehle (falls die Bereitstellung Befehle umfasst)
... (weitere Tool-Konfigurationen)
```

---

### `openspec update`

Aktualisiert OpenSpec-Anweisungsdateien nach einem Upgrade der CLI. Generiert KI-Tool-Konfigurationsdateien neu anhand deines aktuellen globalen Profils, der ausgewählten Workflows und des Bereitstellungsmodus.

```
openspec update [path] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `path` | Nein | Zielverzeichnis (Standard: aktuelles Verzeichnis) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--force` | Aktualisierung erzwingen, auch wenn Dateien bereits auf dem neuesten Stand sind |

**Beispiel:**

```bash
# Update instruction files after npm upgrade
npm update @fission-ai/openspec
openspec update
```

---

## Stores (eigenständige OpenSpec-Repos)

> **Beta.** Stores und die darauf aufbauenden Funktionen (Referenzen, Arbeitskontext, Worksets) sind neu; Befehlsnamen, Flags, Dateiformate und JSON-Ausgabe können sich zwischen Releases ändern. Für eine problemorientierte Einführung siehe den [Stores-Leitfaden](stores-beta/user-guide.md).

Ein Store ist ein eigenständiges OpenSpec-Repo, das du auf diesem Gerät registriert hast – beispielsweise ein Planungs-Repo oder ein Vertrags-Repo. Durch die Registrierung eines Stores können normale Befehle (`list`, `show`, `status`, `validate`, `new change`, `archive`, ...) von überall darauf zugreifen, indem du `--store <id>` übergibst.

### `openspec store setup`

Erstellt und registriert einen lokalen Store. Ohne Argumente in einem Terminal führt OpenSpec den Benutzer durch die Einrichtung. Agenten und Skripte sollten explizite Eingaben übergeben und `--json` verwenden.

```bash
openspec store setup [id] [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--path <path>` | Ordner, in dem der Store gespeichert werden soll (beispielsweise `~/openspec/<id>`) |
| `--remote <url>` | Die kanonische Remote-URL in der `store.yaml` des neuen Stores speichern |
| `--init-git` | Ein Git-Repository mit einem initialen Commit initialisieren (Standard) |
| `--no-init-git` | Alle Git-Aktionen überspringen: keine Initialisierung, kein initialer Commit |
| `--json` | JSON-Ausgabe |

Nicht-interaktive Ausführungen (`--json`, Skripte, Agenten) müssen sowohl die Store-ID als auch `--path` übergeben. In einem interaktiven Terminal fragt die Einrichtung nach dem Speicherort mit einem bearbeitbaren Vorschlag an einem sichtbaren, benutzereigenen Ort (beispielsweise `~/openspec/<id>`); es wird niemals standardmäßig das von OpenSpec verwaltete Datenverzeichnis verwendet.

Beispiele:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Registriert einen vorhandenen lokalen Store-Ordner. Während der Stores-Beta-Phase kann ein Root registriert werden, bevor Änderungen existieren, Spezifikationen angewendet oder Änderungen archiviert wurden; in diesem Fall können die Ordner `openspec/changes/`, `openspec/specs/` und `openspec/changes/archive/` fehlen, bis normale Befehle sie erstellen. Ein reines Konfigurations-Repo, das `store: <id>` deklariert, bleibt ein Verweis auf einen anderen Store und wird nicht als Store-Root registriert, es sei denn, dieser Verweis wird entfernt.

```bash
openspec store register [path] [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--id <id>` | Store-ID; standardmäßig wird die Store-Metadaten oder der Ordnername verwendet |
| `--yes` | Bestätigt das Erstellen von Store-Identitätsmetadaten für einen funktionsfähigen OpenSpec-Root |
| `--json` | JSON-Ausgabe |

### `openspec store unregister`

Entfernt die Registrierung eines lokalen Stores, ohne Dateien zu löschen.

```bash
openspec store unregister <id> [--json]
```

Verwende dies, wenn ein Store verschoben, an einen anderen Ort geklont wurde oder nicht mehr von OpenSpec auf diesem Gerät angezeigt werden soll.

### `openspec store remove`

Entfernt die Registrierung eines lokalen Stores und löscht seinen lokalen Ordner.

```bash
openspec store remove <id> [--yes] [--json]
```

`remove` zeigt den genauen Ordner vor dem Löschen in einem interaktiven Terminal an. Agenten, Skripte und JSON-Aufrufer müssen `--yes` übergeben, um das Löschen zu bestätigen. OpenSpec weigert sich, einen Ordner zu löschen, der keine passenden Store-Metadaten enthält.

### `openspec store list`

Listet lokal registrierte Stores auf.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Prüft die lokale Store-Registrierung, Metadaten und die Git-Präsenz.

```bash
openspec store doctor [id] [--json]
```

Doctor ist nur diagnostisch; es meldet fehlende Roots, Metadatenabweichungen und ungültige lokale Registrierungszustände, ohne den Store zu verändern.

### Referenzieren von Stores aus einem Projekt

Ein Projekt-Repo kann deklarieren, auf welche Stores seine Arbeit zugreift, in `openspec/config.yaml`:

```yaml
schema: spec-driven
references:
  - team-context
```

Ab dann enthält die Ausgabe von `openspec instructions` in diesem Repo (sowohl die pro-Artefakt- als auch die `apply`-Oberflächen, JSON- und menschlicher Modus) einen Index der Spezifikationen jedes referenzierten Stores – Spezifikations-IDs, eine einzeilige Zusammenfassung aus dem Abschnitt *Zweck* jeder Spezifikation und den Abrufbefehl (`openspec show <spec-id> --type spec --store <id>`). Der Index wird bei jedem Lauf live aus dem registrierten Checkout erstellt; Spezifikationsinhalte werden nie in die Ausgabe kopiert.

Referenzen sind schreibgeschützter Kontext. Sie ändern nie, wo Befehle ausgeführt werden: Die Arbeit verbleibt im eigenen Root des Repos, und das Schreiben in einen referenzierten Store bleibt eine explizite `--store`-Aktion. Eine Referenz, die nicht aufgelöst werden kann (beispielsweise ein Store, der auf diesem Gerät nicht registriert ist), wird zu einer Warnung im Index herabgestuft, die die genaue Lösung enthält, und Anweisungen werden trotzdem generiert. `openspec doctor` meldet den Zustand von Referenzen an einer zentralen Stelle.

### Aufzeichnen, von wo ein Store geklont wurde

Ein Store kann seine kanonische Klonquelle in seiner committeten Identitätsdatei speichern, damit die Einarbeitung nie bei der Aufforderung "registriere den Store" stecken bleibt:

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

Die Remote-URL wird in `.openspec-store/store.yaml` innerhalb des initialen Commits gespeichert, sodass jeder Klon sie von Anfang an kennt. Für einen vorhandenen Store bearbeite `store.yaml` von Hand und committe die Änderung. `store doctor` zeigt die gespeicherte Remote-URL (sowie die beobachtete Git-Ursprung des Checkouts) an; die Anleitung zur gemeinsamen Nutzung von Setup/Register nennt sie; und register zeichnet den Ursprung des Checkouts in der gerätelokalen Registrierung auf.

Eine Referenzdeklaration kann ebenfalls die Klonquelle enthalten, sodass ein Teammitglied, das den Store noch nicht hat, eine vollständige, kopierbare Lösung erhält (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

Das Speichern einer Remote-URL ist keine Synchronisation: OpenSpec klont, pullt oder pushed niemals von selbst.

### Deklarieren eines Standard-Stores

Ein Repo, dessen Planung vollständig ausgelagert ist – also keine lokalen `openspec/specs/` oder `openspec/changes/`-Ordner hat – kann seinen Store einmal deklarieren, statt bei jedem Befehl `--store` zu übergeben:

```yaml
# openspec/config.yaml (die einzige Datei unter openspec/)
store: team-context
```

Normale Befehle lösen dann automatisch zum deklarierten Store auf; das Root-Banner und der JSON-`root`-Block melden `source: "declared"` mit der Store-ID, und gedruckte Hinweise enthalten weiterhin `--store <id>`. Die Deklaration ist ein Fallback, keine Überschreibung: Ein explizites `--store` hat immer Vorrang, und ein Verzeichnis mit echten Planungsordnern ignoriert den Verweis (mit einer Warnung). Um ein Verweis-Repo in einen lokalen OpenSpec-Root umzuwandeln, entferne die Zeile `store:` und führe `openspec init` aus – init weigert sich, die Struktur zu erstellen, solange die Deklaration vorhanden ist.

Eine geräteweite Variante gilt für alle Repos auf einmal: `openspec config set defaultStore <id>` (siehe Konfiguration). Sie wird nur herangezogen, nachdem `--store`, ein lokaler Root und ein Projekt-Verweis alle nicht aufgelöst werden konnten; das Root-Banner und der JSON-`root`-Block melden dann `source: "global_default"`.

## Doctor (Beziehungszustand)

Eine schreibgeschützte Abfrage, ein Ort: Ist das OpenSpec-Root fehlerfrei und sind die von ihm referenzierten Stores auf diesem System verfügbar?

```bash
openspec doctor [--store <id>] [--json]
```

Der Bericht gliedert sich in Root-Zustand, Metadaten-Zustand der Stores (einschließlich eines Hinweises, wenn das aufgezeichnete Remote und die Origin des Checkouts voneinander abweichen, sowie eines Hinweises, wenn der Store-Checkout gegenüber der zuletzt abgerufenen Upstream-Tracking-Referenz zurückgefallen ist) und Referenz-Zustand (es werden die gleichen Diagnoseanweisungen wie die Ausgabe von `doctor` angezeigt, inklusive Clone-Korrekturen für nicht aufgelöste Referenzen). Gesundheitsbefunde jeglicher Schweregrad führen zum Exit-Code 0 – Agents lesen die `status`-Arrays aus; nur Befehlsfehler (kein Root-Verzeichnis, unbekannter Store) führen zum Exit-Code 1. `doctor` klont, synchronisiert oder repariert niemals etwas. Um das zusammengestellte Set selbst und nicht nur dessen Zustand abzurufen, verwenden Sie `openspec context`.

## Arbeitskontext (das zusammengestellte Set)

Alles, was diese Arbeit über OpenSpec-Deklarationen verknüpft, befindet sich in einem einzigen Arbeits-Set: das OpenSpec-Root und die von ihm referenzierten Stores.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

Die JSON-Zusammenfassung ist von Agents verarbeitbar (jeder verfügbare referenzierte Store enthält sein Abrufrezept; nicht aufgelöste Mitglieder enthalten die gleichen Korrektur-Anweisungen wie die Ausgabe von `doctor`). Die Option `--code-workspace` schreibt zusätzlich eine VS-Code-Arbeitsbereichsdatei, die das OpenSpec-Root sowie die verfügbaren referenzierten Stores (`ref:<id>`-Ordner) enthält – dies ist der einzige Schreibvorgang, den dieser Befehl durchführt, und er wird verweigert, wenn die Datei bereits existiert und die Option `--force` nicht angegeben ist. Nicht verfügbare Mitglieder werden gemeldet, es werden keine Vermutungen über sie angestellt.

"Arbeitskontext" ist das zusammengestellte Set; das `context:`-Feld in `openspec/config.yaml` ist der Projekt-Hintergrund, der in Anweisungen eingebettet wird – das sind zwei verschiedene Dinge. `openspec doctor` beantwortet die Frage, ob das Set fehlerfrei ist; `openspec context` beantwortet die Frage, was das Set ist.

## Persönliche Worksets

> **Beta.** Worksets sind Teil der neuen Beta-Oberfläche; Befehle, Flags und Dateiformate können sich zwischen Releases ändern. Eine Schritt-für-Schritt-Anleitung finden Sie im [Stores-Leitfaden](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together).

Ein Workset ist eine persönliche, benannte Ansicht der Ordner, an denen Sie gemeinsam arbeiten – eine Planungs-Wurzel plus alle weiteren Ordner, die Sie auswählen –, die auf Ihrem Rechner gespeichert und per Name in Ihrem Tool wieder geöffnet wird. Er ist rein lokal: er wird nie committet, nie geteilt, nie aus Deklarationen abgeleitet und das Entfernen eines Worksets berührt nie einen zugehörigen Ordner.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` führt einen kurzen geführten Ablauf aus (oder akzeptiert `--member`-Flags nicht-interaktiv; das erste Mitglied ist das primäre – Sitzungen starten dort). `open` startet das ausgewählte Tool: Editoren (VS Code, Cursor) öffnen ein Fenster mit allen Mitgliedern und kehren zurück; CLI-Agenten (Claude Code, codex) übernehmen dieses Terminal als Sitzung mit allen angehängten Mitgliedern und ohne vorausgefüllte Eingabeaufforderung, die endet, wenn Sie das Terminal verlassen. Ein beim Öffnen fehlendes Mitgliedsordner wird mit einem Hinweis übersprungen; der Rest wird geöffnet. Die gespeicherte Tool-Präferenz kann pro Öffnen mit `--tool` überschrieben werden.

Die Unterstützung eines neuen Tools ist Konfiguration, kein Code. Jedes Tool gehört zu einem von zwei Startstilen – `workspace-file` (gestartet mit der generierten `.code-workspace`-Datei) oder `attach-dirs` (ein Anhänge-Flag pro Mitglied) – und der `openers`-Schlüssel in der globalen `config.json` (öffnen Sie sie mit `openspec config edit`) fügt Tools hinzu oder passt integrierte Tools pro Feld an:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Der gesamte Workset-Zustand befindet sich im `worksets/`-Ordner des globalen Datenverzeichnisses (die gespeicherten Ansichten plus die generierten `<name>.code-workspace`-Dateien, die bei jedem Öffnen neu generiert werden); das Löschen dieses Ordners entfernt jede Spur.

---

## Befehle zum Durchsuchen

### `openspec list`

Listet Änderungen oder Spezifikationen in Ihrem Projekt auf.

```
openspec list [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--specs` | Listet Spezifikationen statt Änderungen auf |
| `--changes` | Listet Änderungen auf (Standard) |
| `--sort <Reihenfolge>` | Sortiert nach `recent` (Standard) oder `name` |
| `--json` | Gibt die Ausgabe als JSON aus |

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
Änderungen:
  add-dark-mode     Keine Aufgaben      Gerade eben
```

---

### `openspec view`

Zeigt ein interaktives Dashboard zum Durchsuchen von Spezifikationen und Änderungen an.

```
openspec view
```

Öffnet ein terminalbasiertes Interface zum Navigieren durch die Spezifikationen und Änderungen Ihres Projekts.

---

### `openspec show`

Zeigt Details einer Änderung oder Spezifikation an.

```
openspec show [item-name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|-------------|-------------|
| `item-name` | Nein | Name der Änderung oder Spezifikation (fragt nach, falls weggelassen) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--type <Typ>` | Gibt den Typ an: `change` oder `spec` (wird automatisch erkannt, falls eindeutig) |
| `--json` | Gibt die Ausgabe als JSON aus |
| `--no-interactive` | Deaktiviert Eingabeaufforderungen |

**Änderungsspezifische Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--deltas-only` | Zeigt nur Delta-Spezifikationen an (JSON-Modus) |

**Spezifikationsspezifische Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--requirements` | Zeigt nur Anforderungen an, schließt Szenarien aus (JSON-Modus) |
| `--no-scenarios` | Schließt Szenarioinhalte aus (JSON-Modus) |
| `-r, --requirement <ID>` | Zeigt eine bestimmte Anforderung nach 1-basiertem Index an (JSON-Modus) |

**Beispiele:**

```bash
# Interaktive Auswahl
openspec show

# Zeigt eine bestimmte Änderung an
openspec show add-dark-mode

# Zeigt eine bestimmte Spezifikation an
openspec show auth --type spec

# JSON-Ausgabe zum Parsen
openspec show add-dark-mode --json
```

---

## Validierungsbefehle

### `openspec validate`

Validiert Änderungen und Spezifikationen auf strukturelle Probleme.

```
openspec validate [item-name] [options]
```

Eine Änderung ohne Spezifikations-Deltas schlägt die Validierung fehl, es sei denn, ihre `.openspec.yaml` deklariert `skip_specs: true` (für reine Refactorings, Tooling- oder Dokumentationsarbeiten – siehe [Rezept 5](examples.md#recipe-5-a-refactor-with-no-behavior-change)).

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|-------------|-------------|
| `item-name` | Nein | Zu validierendes Element (fragt nach, falls weggelassen) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--all` | Validiert alle Änderungen und Spezifikationen |
| `--changes` | Validiert alle Änderungen |
| `--specs` | Validiert alle Spezifikationen |
| `--type <Typ>` | Gibt den Typ an, falls der Name mehrdeutig ist: `change` oder `spec` |
| `--strict` | Aktiviert den strengen Validierungsmodus |
| `--json` | Gibt die Ausgabe als JSON aus |
| `--concurrency <n>` | Maximale parallele Validierungen (Standard: 6, oder Umgebungsvariable `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Deaktiviert Eingabeaufforderungen |

**Beispiele:**

```bash
# Interaktive Validierung
openspec validate

# Validiert eine bestimmte Änderung
openspec validate add-dark-mode

# Validiert alle Änderungen
openspec validate --changes

# Validiert alles mit JSON-Ausgabe (für CI/Skripte)
openspec validate --all --json

# Strenge Validierung mit erhöhter Parallelität
openspec validate --all --strict --concurrency 12
```

**Ausgabe (Text):**

```
Validiere add-dark-mode...
  ✓ proposal.md gültig
  ✓ specs/ui/spec.md gültig
  ⚠ design.md: Abschnitt "Technischer Ansatz" fehlt

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

## Lebenszyklusbefehle

### `openspec archive`

Archiviert eine abgeschlossene Änderung und führt Delta-Spezifikationen in die Hauptspezifikationen zusammen.

```
openspec archive [change-name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|-------------|-------------|
| `change-name` | Nein | Zu archivierende Änderung (fragt nach, falls weggelassen) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `-y, --yes` | Überspringt Bestätigungsaufforderungen |
| `--skip-specs` | Überspringt Spezifikationsaktualisierungen für einen einzelnen Archivierungsdurchlauf. Eine Änderung, die dauerhaft keine Spezifikations-Deltas hat, sollte stattdessen `skip_specs: true` in ihrer `.openspec.yaml` deklarieren – sie wird ohne Flag archiviert |
| `--no-validate` | Überspringt die Validierung (erfordert eine Bestätigung) |

**Beispiele:**

```bash
# Interaktive Archivierung
openspec archive

# Archiviert eine bestimmte Änderung
openspec archive add-dark-mode

# Archivierung ohne Aufforderungen (CI/Skripte)
openspec archive add-dark-mode --yes

# Archiviert eine Tooling-Änderung, die keine Spezifikationen betrifft
openspec archive update-ci-config --skip-specs
```

**Funktionsweise:**

1. Validiert die Änderung (es sei denn, `--no-validate` ist gesetzt)
2. Fragt nach einer Bestätigung (es sei denn, `--yes` ist gesetzt)
3. Führt Delta-Spezifikationen in `openspec/specs/` zusammen
4. Verschiebt den Änderungsordner nach `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Workflow-Befehle

Diese Befehle unterstützen den artefaktgesteuerten OPSX-Workflow. Sie sind sowohl für Menschen nützlich, die den Fortschritt prüfen, als auch für Agenten, die die nächsten Schritte bestimmen.

### `openspec new change`

Erstellt einen Änderungsordner und optionale eingecheckte Metadaten im aufgelösten OpenSpec-Root.

```bash
openspec new change <name> [options]
```

Änderungsnamen müssen Kleinbuchstaben-Kebab-Case verwenden. Sie beginnen mit einem Kleinbuchstaben, enthalten dann Kleinbuchstaben, Ziffern und einzelne Bindestriche. Sie dürfen nicht mit einer Ziffer beginnen, keine Leerzeichen, Unterstriche, Großbuchstaben, aufeinanderfolgende Bindestriche oder führende/abschließende Bindestriche enthalten. Wenn Sie eine externe Ticket-ID angeben, stellen Sie ihr ein Wort voran, zum Beispiel `ticket-123-add-notifications` statt `123-add-notifications`.

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--description <Text>` | Beschreibung, die zu `index.md` hinzugefügt werden soll |
| `--goal <Text>` | Optionale Ziel-Metadaten, die mit der Änderung gespeichert werden |
| `--schema <Name>` | Zu verwendendes Workflow-Schema |
| `--store <ID>` | Store-ID, die als OpenSpec-Root verwendet werden soll (ein Store ist ein eigenständiges OpenSpec-Repo, das Sie registriert haben) |
| `--json` | Gibt JSON aus |

Beispiele:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Zeigt den Abschlussstatus von Artefakten für eine Änderung an.

```
openspec status [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--change <ID>` | Name der Änderung (fragt nach, falls weggelassen) |
| `--schema <Name>` | Schema-Überschreibung (wird automatisch aus der Konfiguration der Änderung erkannt) |
| `--json` | Gibt die Ausgabe als JSON aus |

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

[x] Vorschlag
[ ] Entwurf
[x] Spezifikationen
[-] Aufgaben (blockiert von: Entwurf)
```

Eine Änderung, die `skip_specs: true` deklariert, zeigt ihre Spezifikationsphase als `[~] specs (skipped: change declares skip_specs)` an und schließt sie aus der Fortschrittszählung aus.

**Ausgabe (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done", "requires": []},
    {"id": "design", "outputPath": "design.md", "status": "ready", "requires": ["proposal"]},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done", "requires": ["proposal"]},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "requires": ["specs", "design"], "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

Ruft angereicherte Anweisungen zum Erstellen eines Artefakts oder zum Anwenden von Aufgaben ab. Wird von KI-Agenten verwendet, um zu verstehen, was als Nächstes erstellt werden soll.

```
openspec instructions [artifact] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|-------------|-------------|
| `artifact` | Nein | Artefakt-ID: `proposal`, `specs`, `design`, `tasks` oder `apply` |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--change <ID>` | Name der Änderung (erforderlich im nicht-interaktiven Modus) |
| `--schema <Name>` | Schema-Überschreibung |
| `--json` | Gibt die Ausgabe als JSON aus |

**Sonderfall:** Verwenden Sie `apply` als Artefakt, um Anweisungen zur Aufgabenimplementierung zu erhalten.

**Beispiele:**

```bash
# Holt Anweisungen für das nächste Artefakt
openspec instructions --change add-dark-mode

# Holt Anweisungen für ein bestimmtes Artefakt
openspec instructions design --change add-dark-mode

# Holt Anweisungen für apply/Implementierung
openspec instructions apply --change add-dark-mode

# JSON für die Verwendung durch Agenten
openspec instructions design --change add-dark-mode --json
```

**Die Ausgabe umfasst:**

- Vorlageninhalt für das Artefakt
- Projektkontext aus der Konfiguration
- Inhalte von abhängigen Artefakten
- Artefaktspezifische Regeln aus der Konfiguration

Für ein über `skip_specs: true` übersprungenes Artefakt besteht die Ausgabe nur aus einer Warnung (JSON fügt die Felder `skipped`/`warning` hinzu) – das Artefakt darf nicht erstellt werden.

---

### `openspec templates`

Zeigt aufgelöste Vorlagenpfade für alle Artefakte in einem Schema an.

```
openspec templates [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--schema <Name>` | Zu inspizierendes Schema (Standard: `spec-driven`) |
| `--json` | Gibt die Ausgabe als JSON aus |

**Beispiele:**

```bash
# Zeigt Vorlagenpfade für das Standardschema an
openspec templates

# Zeigt Vorlagen für ein benutzerdefiniertes Schema an
openspec templates --schema my-workflow

# JSON für die programmatische Verwendung
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

Listet verfügbare Workflow-Schemata mit ihren Beschreibungen und Artefakt-Abläufen auf.

```
openspec schemas [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--json` | Gibt die Ausgabe als JSON aus |

**Beispiel:**

```bash
openspec schemas
```

**Ausgabe:**

```
Verfügbare Schemas:

  spec-driven (Paket)
    Der standardmäßige spezifikationsgesteuerte Entwicklungs-Workflow
    Ablauf: proposal → specs → design → tasks

  my-custom (Projekt)
    Benutzerdefinierter Workflow für dieses Projekt
    Ablauf: research → proposal → tasks
```

## Schema-Befehle

Befehle zum Erstellen und Verwalten benutzerdefinierter Workflow-Schemata.

### `openspec schema init`

Erstellt ein neues projektlokales Schema.

```
openspec schema init <name> [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `name` | Ja | Schema-Name (Kebab-Case) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--description <text>` | Schema-Beschreibung |
| `--artifacts <list>` | Kommagetrennte Artefakt-IDs (Standard: `proposal,specs,design,tasks`) |
| `--default` | Als projektweites Standardschema festlegen |
| `--no-default` | Nicht zur Festlegung als Standardschema auffordern |
| `--force` | Vorhandenes Schema überschreiben |
| `--json` | Als JSON ausgeben |

**Beispiele:**

```bash
# Interaktive Schema-Erstellung
openspec schema init research-first

# Nicht-interaktiv mit bestimmten Artefakten
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**Was erstellt wird:**

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

Kopiert ein vorhandenes Schema zur Anpassung in Ihr Projekt.

```
openspec schema fork <source> [name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `source` | Ja | Zu kopierendes Schema |
| `name` | Nein | Neuer Schema-Name (Standard: `<source>-custom`) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--force` | Vorhandenes Ziel überschreiben |
| `--json` | Als JSON ausgeben |

**Beispiel:**

```bash
# Das integrierte, spezifikationsgetriebene Schema forken
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
|----------|--------------|-------------|
| `name` | Nein | Zu validierendes Schema (validiert alle, falls nicht angegeben) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--verbose` | Detaillierte Validierungsschritte anzeigen |
| `--json` | Als JSON ausgeben |

**Beispiele:**

```bash
# Ein bestimmtes Schema validieren
openspec schema validate my-workflow

# Alle Schemata validieren
openspec schema validate
```

---

### `openspec schema which`

Zeigt an, woher ein Schema aufgelöst wird (nützlich zum Debuggen von Prioritäten).

```
openspec schema which [name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `name` | Nein | Schema-Name |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--all` | Alle Schemata mit ihren Quellen auflisten |
| `--json` | Als JSON ausgeben |

**Beispiel:**

```bash
# Überprüfen, woher ein Schema stammt
openspec schema which spec-driven
```

**Ausgabe:**

```
spec-driven wird aufgelöst aus: package
  Quelle: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Schema-Priorität:**

1. Projekt: `openspec/schemas/<name>/`
2. Benutzer: `~/.local/share/openspec/schemas/<name>/`
3. Paket: Integrierte Schemata

---

## Konfigurationsbefehle

### `openspec config`

Zeigt die globale OpenSpec-Konfiguration an und ändert sie.

```
openspec config <subcommand> [options]
```

**Unterbefehle:**

| Unterbefehl | Beschreibung |
|-------------|-------------|
| `path` | Pfad der Konfigurationsdatei anzeigen |
| `list` | Alle aktuellen Einstellungen anzeigen |
| `get <key>` | Einen bestimmten Wert abrufen |
| `set <key> <value>` | Einen Wert festlegen |
| `unset <key>` | Einen Schlüssel entfernen |
| `reset` | Auf Standardwerte zurücksetzen |
| `edit` | In `$EDITOR` öffnen |
| `profile [preset]` | Workflow-Profil interaktiv oder über eine Voreinstellung konfigurieren |

**Beispiele:**

```bash
# Pfad der Konfigurationsdatei anzeigen
openspec config path

# Alle Einstellungen auflisten
openspec config list

# Einen bestimmten Wert abrufen
openspec config get telemetry.enabled

# Einen Wert festlegen
openspec config set telemetry.enabled false

# Einen Zeichenfolgenwert explizit festlegen
openspec config set user.name "My Name" --string

# Eine benutzerdefinierte Einstellung entfernen
openspec config unset user.name

# Ein maschinenweites Standard-Speicherziel festlegen (Fallback-Stamm, falls weder `--store`, lokaler Stamm noch Projektspeicher angegeben sind: der Zeiger wird aufgelöst)
openspec config set defaultStore team-plans

# Gesamte Konfiguration zurücksetzen
openspec config reset --all --yes

# Konfiguration in Ihrem Editor bearbeiten
openspec config edit

# Profil mit dem aktionsbasierten Assistenten konfigurieren
openspec config profile

# Schnelle Voreinstellung: Workflows auf Core umstellen (behält den Liefermodus bei)
openspec config profile core
```

`openspec config profile` beginnt mit einer Zusammenfassung des aktuellen Zustands und bietet dann folgende Auswahlmöglichkeiten:
- Lieferung + Workflows ändern
- Nur Lieferung ändern
- Nur Workflows ändern
- Aktuelle Einstellungen beibehalten (Beenden)

Wenn Sie die aktuellen Einstellungen beibehalten, werden keine Änderungen geschrieben und keine Aktualisierungsaufforderung angezeigt.
Wenn es keine Konfigurationsänderungen gibt, aber die aktuellen Projektdateien nicht mit Ihrem globalen Profil/Liefermodus synchronisiert sind, zeigt OpenSpec eine Warnung an und schlägt `openspec update` vor.
Drücken von `Ctrl+C` bricht den Ablauf ebenfalls sauber ab (kein Stacktrace) und beendet das Programm mit dem Code `130`.
In der Workflow-Checkliste bedeutet `[x]`, dass der Workflow in der globalen Konfiguration ausgewählt ist. Um diese Auswahl auf Projektdateien anzuwenden, führen Sie `openspec update` aus (oder wählen Sie die Option `Änderungen jetzt auf dieses Projekt anwenden?`, wenn Sie in einem Projekt dazu aufgefordert werden).

**Interaktive Beispiele:**

```bash
# Nur-Lieferung-Aktualisierung
openspec config profile
# Auswahl: Nur Lieferung ändern
# Lieferung auswählen: Nur Skills

# Nur-Workflows-Aktualisierung
openspec config profile
# Auswahl: Nur Workflows ändern
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
|----------|--------------|-------------|
| `message` | Ja | Feedback-Nachricht |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--body <text>` | Detaillierte Beschreibung |

**Voraussetzungen:** Die GitHub-CLI (`gh`) muss installiert und authentifiziert sein.

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
|-------------|-------------|
| `generate [shell]` | Vervollständigungsskript auf stdout ausgeben |
| `install [shell]` | Vervollständigung für Ihre Shell installieren |
| `uninstall [shell]` | Installierte Vervollständigungen entfernen |

**Unterstützte Shells:** `bash`, `zsh`, `fish`, `powershell`

**Beispiele:**

```bash
# Vervollständigungen installieren (Shell wird automatisch erkannt)
openspec completion install

# Für eine bestimmte Shell installieren
openspec completion install zsh

# Skript zur manuellen Installation generieren
openspec completion generate bash > ~/.bash_completion.d/openspec

# Deinstallieren
openspec completion uninstall
```

---

## Beendigungscodes

| Code | Bedeutung |
|------|---------|
| `0` | Erfolg |
| `1` | Fehler (Validierungsfehler, fehlende Dateien usw.) |

---

## Umgebungsvariablen

| Variable | Beschreibung |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Auf `0` setzen, um Telemetrie zu deaktivieren |
| `DO_NOT_TRACK` | Auf `1` setzen, um Telemetrie zu deaktivieren (Standard-DNT-Signal) |
| `OPENSPEC_CONCURRENCY` | Standard-Nebenläufigkeit für Massenvalidierung (Standard: 6) |
| `EDITOR` oder `VISUAL` | Editor für `openspec config edit` |
| `NO_COLOR` | Deaktiviert farbige Ausgabe, wenn gesetzt |

---

## Zugehörige Dokumentation

- [Befehle](commands.md) - KI-Slash-Befehle (`/opsx:propose`, `/opsx:apply` usw.)
- [Workflows](workflows.md) - Häufige Muster und Anwendungsfälle für jeden Befehl
- [Anpassung](customization.md) - Erstellen benutzerdefinierter Schemata und Vorlagen
- [Erste Schritte](getting-started.md) - Ersteinrichtungsanleitung