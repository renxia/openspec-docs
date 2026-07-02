# CLI Referenz

Die OpenSpec CLI (`openspec`) bietet Terminalbefehle für die Projektinitialisierung, Validierung, Statusprüfung und Verwaltung. Diese Befehle ergänzen die AI-Slash-Befehle (wie `/opsx:propose`), die in [Commands](commands.md) dokumentiert sind.

## Zusammenfassung

| Kategorie | Commands | Zweck |
|----------|----------|---------|
| **Einrichtung** | `init`, `update` | OpenSpec in Ihrem Projekt initialisieren und aktualisieren |
| **Speicher (autonome OpenSpec-Repos)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Speicher verwalten – autonome OpenSpec-Repos, die Sie registriert haben |
| **Gesundheit** | `doctor` | Bericht über die Beziehungsgesundheit des aufgelösten Wurzelverzeichnisses |
| **Arbeitskontext** | `context` | Zusammenstellen des Arbeitsdatensatzes (Wurzel + referenzierte Speicher) |
| **Persönliche Worksets** | `workset create`, `workset list`, `workset open`, `workset remove` | Persönliche, lokale Arbeitsansichten in Ihrem Tool speichern und öffnen |
| **Durchsuchen** | `list`, `view`, `show` | Änderungen und Spezifikationen erkunden |
| **Validierung** | `validate` | Prüfen von Änderungen und Spezifikationen auf Probleme |
| **Lebenszyklus** | `archive` | Abschließen abgeschlossener Änderungen |
| **Workflow** | `new change`, `status`, `instructions`, `templates`, `schemas` | Artefaktgestützte Workflow-Unterstützung |
| **Schemata** | `schema init`, `schema fork`, `schema validate`, `schema which` | Benutzerdefinierte Workflows erstellen und verwalten |
| **Konfiguration** | `config` | Einstellungen anzeigen und ändern |
| **Dienstprogramm** | `feedback`, `completion` | Feedback und Shell-Integration |

---

## Human vs Agent Commands

Die meisten CLI-Befehle sind für die **Nutzung durch Menschen** in einem Terminal konzipiert. Einige Befehle unterstützen jedoch auch die **Nutzung durch Agents/Skripte** über JSON-Ausgabe.

### Human-Only Commands

Diese Befehle sind interaktiv und für den Einsatz im Terminal gedacht:

| Command | Purpose |
|---------|---------|
| `openspec init` | Projekt initialisieren (interaktive Prompts) |
| `openspec view` | Interaktives Dashboard |
| `openspec workset open <name>` | Ein gespeichertes Workset öffnen (Editor-Fenster oder Terminal-Agentensitzung) |
| `openspec config edit` | Konfiguration im Editor öffnen |
| `openspec feedback` | Feedback über GitHub senden |
| `openspec completion install` | Shell Completions installieren |

### Agent-Compatible Commands

Diese Befehle unterstützen die `--json`-Ausgabe für den programmatischen Einsatz durch KI-Agents und Skripte:

| Command | Human Use | Agent Use |
|---------|-----------|-----------|
| `openspec list` | Änderungen/Spezifikationen durchsuchen | `--json` für strukturierte Daten |
| `openspec show <item>` | Inhalt lesen | `--json` zum Parsen |
| `openspec validate` | Auf Probleme prüfen | `--all --json` zur Massenvalidierung |
| `openspec status` | Fortschritt von Artefakten sehen | `--json` für strukturierten Status |
| `openspec instructions` | Nächste Schritte erhalten | `--json` für Agentenanweisungen |
| `openspec templates` | Template-Pfade finden | `--json` zur Pfadauflösung |
| `openspec schemas` | Verfügbare Schemata auflisten | `--json` zur Schemaerkennung |
| `openspec store setup <id>` | Einen lokalen Speicher erstellen und registrieren | `--json` mit expliziten Eingaben für strukturierte Setup-Ausgabe |
| `openspec store register <path>` | Einen vorhandenen Speicher registrieren | `--json` für strukturierte Registrierungs-Ausgabe |
| `openspec store unregister <id>` | Eine lokale Speicheregistrierung vergessen (entfernen) | `--json` für strukturiertes Bereinigungs-Output |
| `openspec store remove <id>` | Ein registriertes lokales Speicherverzeichnis löschen | `--yes --json` für nicht interaktive Löschung |
| `openspec store list` | Registrierte Speicher durchsuchen | `--json` für strukturierte Registrierungen |
| `openspec store doctor` | Lokale Speichereinrichtung prüfen | `--json` für strukturierte Diagnosen |
| `openspec new change <id>` | Scaffolding einer repo-lokalen Änderung erstellen | `--json`, plus `--store <id>`, um einen registrierten Speicher als OpenSpec-Root zu verwenden |
| `openspec workset create [name]` | Eine persönliche Arbeitsansicht zusammenstellen | `--member <path> --json` für nicht interaktive Komposition |
| `openspec workset list` | Gespeicherte Worksets durchsuchen | `--json` für strukturierte Ansichten |
| `openspec workset remove <name>` | Eine gespeicherte Ansicht löschen | `--yes --json` für nicht interaktive Entfernung |

---

## Global Options

Diese Optionen funktionieren mit allen Befehlen:

| Option | Description |
|--------|-------------|
| `--version`, `-V` | Versionsnummer anzeigen |
| `--no-color` | Farbausgabe deaktivieren |
| `--help`, `-h` | Hilfe für den Befehl anzeigen |

---

## Setup Commands

### `openspec init`

Initialisiert OpenSpec in Ihrem Projekt. Es erstellt die Ordnerstruktur und konfiguriert KI-Tool-Integrationen.

Das Standardverhalten verwendet globale Konfigurationsstandardwerte: Profil `core`, Lieferung `both`, Workflows `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `path` | Nein | Zielverzeichnis (Standard: aktuelles Verzeichnis) |

**Options:**

| Option | Description |
|--------|-------------|
| `--tools <list>` | KI-Tools nicht interaktiv konfigurieren. Verwenden Sie `all`, `none` oder eine komma-separierte Liste |
| `--force` | Legacy-Dateien automatisch bereinigen, ohne nachzufragen |
| `--profile <profile>` | Das globale Profil für diesen Init-Lauf überschreiben (`core` oder `custom`) |

`--profile custom` verwendet die in der globalen Konfiguration ausgewählten Workflows (`openspec config profile`).

**Unterstützte Tool IDs (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

> Diese Liste spiegelt `AI_TOOLS` in `src/core/config.ts` wider. Sehen Sie unter [Supported Tools](supported-tools.md) nach, welche Fähigkeiten und Befadweg jedes Tools hat.

**Examples:**

```bash
# Interaktive Initialisierung
openspec init

# In einem bestimmten Verzeichnis initialisieren
openspec init ./my-project

# Nicht interaktiv: für Claude und Cursor konfigurieren
openspec init --tools claude,cursor

# Für alle unterstützten Tools konfigurieren
openspec init --tools all

# Profil für diesen Lauf überschreiben
openspec init --profile core

# Prompts überspringen und Legacy-Dateien automatisch bereinigen
openspec init --force
```

**Was es erstellt:**

```
openspec/
├── specs/              # Ihre Spezifikationen (Quelle der Wahrheit)
├── changes/            # Vorgeschlagene Änderungen
└── config.yaml         # Projektkonfiguration

.claude/skills/         # Claude Code Skills (wenn claude ausgewählt wurde)
.cursor/skills/         # Cursor Skills (wenn cursor ausgewählt wurde)
.cursor/commands/       # Cursor OPSX Befehle (wenn delivery Befehle einschließt)
... (andere Tool-Konfigurationen)
```

---

### `openspec update`

Aktualisiert die OpenSpec-Anweisungsdateien nach dem Upgrade des CLI. Erzeugt neu KI-Tool-Konfigurationsdateien basierend auf Ihrem aktuellen globalen Profil, den ausgewählten Workflows und dem Liefermodus.

```
openspec update [path] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `path` | Nein | Zielverzeichnis (Standard: aktuelles Verzeichnis) |

**Options:**

| Option | Description |
|--------|-------------|
| `--force` | Erzwingt das Update, auch wenn die Dateien aktuell sind |

**Example:**

```bash
# Anweisungsdateien nach npm upgrade aktualisieren
npm update @fission-ai/openspec
openspec update
```

---

## Stores (unabhängige OpenSpec Repos)

> **Beta.** Stores und die darauf basierenden Funktionen (Referenzen, Arbeitskontext, Worksets) sind neu; Befehlsnamen, Flags, Dateiformate und JSON-Ausgabe können zwischen den Releases geformt werden. Für das problemorientierte Walkthrough sehen Sie sich den [stores guide](stores-beta/user-guide.md) an.

Ein Store ist ein unabhängiges OpenSpec Repo, das Sie auf dieser Maschine registriert haben – zum Beispiel ein Planungsrepo oder ein Vertragsrepo. Die Registrierung eines Stores ermöglicht es normalen Befehlen (`list`, `show`, `status`, `validate`, `new change`, `archive`, ...) diese von überall zu verwenden, indem `--store <id>` übergeben wird.

### `openspec store setup`

Erstellt und registriert einen lokalen Store. Ohne Argumente im Terminal leitet OpenSpec den Benutzer durch die Einrichtung. Agents und Skripte sollten explizite Eingaben übergeben und `--json` verwenden.

```bash
openspec store setup [id] [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `--path <path>` | Ordner, in dem der Store leben soll (zum Beispiel `~/openspec/<id>`) |
| `--remote <url>` | Die kanonische Remote im `store.yaml` des neuen Stores eintragen |
| `--init-git` | Ein Git-Repository mit einem Initialcommit initialisieren (Standard) |
| `--no-init-git` | Jede Git-Aktion überspringen: kein Init, kein Initialcommit |
| `--json` | JSON ausgeben |

Nicht interaktive Läufe (`--json`, Skripte, Agents) müssen sowohl die Store-ID als auch den `--path` übergeben. In einem interaktiven Terminal fragt das Setup nach dem Speicherort mit einem bearbeitbaren Vorschlag an einer sichtbaren, vom Benutzer besetzten Stelle (zum Beispiel `~/openspec/<id>`); es verwendet niemals das verwaltete Datenverzeichnis von OpenSpec als Standardwert.

Examples:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Registriert einen vorhandenen lokalen Store-Ordner.

```bash
openspec store register [path] [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `--id <id>` | Store ID; standardmäßig die Metadaten des Stores oder der Ordnername |
| `--yes` | Bestätigt die Erstellung von Speicheridentitätsmetadaten für eine gesunde OpenSpec-Root |
| `--json` | JSON ausgeben |

### `openspec store unregister`

Vergisst (entfernt) eine lokale Speicheregistrierung, ohne Dateien zu löschen.

```bash
openspec store unregister <id> [--json]
```

Dies verwenden Sie, wenn ein Store verschoben, woanders geklont oder nicht mehr von OpenSpec auf dieser Maschine angezeigt werden soll.

### `openspec store remove`

Vergisst (entfernt) eine lokale Speicheregistrierung und löscht ihren lokalen Ordner.

```bash
openspec store remove <id> [--yes] [--json]
```

`remove` zeigt den genauen Ordner vor der Löschung in einem interaktiven Terminal an. Agents, Skripte und JSON-Aufrufer müssen `--yes` übergeben, um die Löschung zu bestätigen. OpenSpec weigert sich, einen Ordner zu löschen, der nicht die passenden Store-Metadaten enthält.

### `openspec store list`

Listet lokal registrierte Stores auf.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Prüft die lokale Speicheregistrierung, Metadaten und Git-Anwesenheit.

```bash
openspec store doctor [id] [--json]
```

Doctor ist nur diagnostisch; es meldet fehlende Roots, Metadatenabweichungen und ungültigen lokalen Registrienzustand, ohne den Store zu modifizieren.

### Referencing stores from a project

Ein Projekt-Repo kann in `openspec/config.yaml` angeben, auf welche Stores seine Arbeit Bezug nimmt:

```yaml
schema: spec-driven
references:
  - team-context
```

Von da an enthält die Ausgabe von `openspec instructions` in diesem Repo (sowohl die pro Artefakt- als auch die `apply`-Oberflächen, JSON und menschliche Modi) einen Index der Spezifikationen jedes referenzierten Stores – Spec IDs, eine einzeilige Zusammenfassung aus dem Purpose-Abschnitt jeder Spec und den Fetch-Befehl (`openspec show <spec-id> --type spec --store <id>`). Der Index wird bei jedem Lauf live aus dem registrierten Checkout erstellt; der Spechinhalt wird niemals in die Ausgabe kopiert.

Referenzen sind nur lesbarer Kontext. Sie ändern niemals, wo Befehle wirken: die Arbeit bleibt im eigenen Root des Repos, und das Schreiben in einen referenzierten Store bleibt eine explizite `--store`-Aktion. Eine nicht auflösbare Referenz (zum Beispiel ein nicht auf dieser Maschine registrierter Store) wird zu einer Warnung im Index mit dem genauen Fix, und die Anweisungen werden trotzdem generiert. `openspec doctor` meldet den Gesundheitszustand der Referenzen an einer Stelle.

### Recording where a store is cloned from

Ein Store kann seine kanonische Klonquelle in seiner committed Identitätsdatei speichern, sodass das Onboarding niemals bei „registriere den Store“ stecken bleibt:

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

Die Remote wird in `.openspec-store/store.yaml` im Initialcommit gespeichert, sodass jeder Klon davon weiß. Bei einem bestehenden Store bearbeiten Sie `store.yaml` manuell und committen es. `store doctor` zeigt die gespeicherte Remote (und die beobachtete Git-Origin des Checkouts); setup/register benennt sie mit Richtlinien; und register speichert die Origin des Checkouts im maschinellen lokalen Register.

Eine Referenzdeklaration kann auch die Klonquelle enthalten, sodass ein Teamkollege, der den Store noch nicht hat, einen vollständigen, kopierbaren Fix erhält (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

Das Speichern einer Remote ist keine Synchronisation: OpenSpec klont, pullt oder pusht niemals selbstständig.

### Declaring a default store

Ein Repo, dessen Planung vollständig externisiert ist – ohne lokales `openspec/specs/` oder `openspec/changes/` – kann seinen Store einmal deklarieren, anstatt bei jedem Befehl `--store` zu übergeben:

```yaml
# openspec/config.yaml (die einzige Datei unter openspec/)
store: team-context
```

Normale Befehle lösen dann automatisch auf den deklarierten Store auf; die Root-Leiste und der JSON `root`-Block melden `source: "declared"` zusammen mit der Store-ID, und gedruckte Hinweise enthalten weiterhin `--store <id>`. Die Deklaration ist ein Fallback, niemals eine Überschreibung: explizites `--store` gewinnt immer, und ein Verzeichnis mit echten Planungsordnern ignoriert den Zeiger (mit einer Warnung). Um ein Pointer-Repo in eine lokale OpenSpec-Root umzuwandeln, entfernen Sie die `store:` Zeile und führen Sie `openspec init` aus – Init weigert sich zu Scaffolding, solange die Deklaration vorhanden ist.

## Doctor (Zustandsprüfung der Beziehungen)

Eine einzige Leseabfrage, an einem Ort: Ist die OpenSpec Root gesund und sind die von ihr referenzierten Stores auf dieser Maschine verfügbar?

```bash
openspec doctor [--store <id>] [--json]
```

Der Bericht unterscheidet die Gesundheit der Root, die Gesundheit der Store-Metadaten (einschließlich eines Hinweises, wenn sich das erfasste Remote und der Ursprung des Checkouts unterscheiden) und die Referenzgesundheit (die gleichen Diagnoseanweisungen werden angezeigt, mit Clone-Fixes für ungelöste Referenzen). Gesundheitsbefunde jeglicher Schweregrad führen zu einem Exit 0 — Agenten lesen die `status`-Arrays; nur Befehlsfehler (keine Root, unbekannter Store) führen zu einem Exit 1. Doctor klont, synchronisiert oder repariert niemals. Um das zusammengesetzte Set selbst und nicht dessen Zustand zu erhalten, verwenden Sie `openspec context`.

## Arbeitskontext (das zusammengesetzte Set)

Alles, was diese Arbeit durch OpenSpec-Deklarationen betrifft, befindet sich in einem Arbeitsset: die OpenSpec Root und die von ihr referenzierten Stores.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

Die JSON-Zusammenfassung ist für Agenten nutzbar (jeder verfügbare referenzierte Store trägt sein Fetch-Rezept; ungelöste Mitglieder tragen die gleichen Fix-Anweisungen und zeigen Doctor). `--code-workspace` schreibt zusätzlich eine VS Code Workspace Datei, die die Root plus die verfügbaren referenzierten Stores (`ref:<id>` Ordner) enthält — das ist der einzige Schreibvorgang, den dieser Befehl durchführt, welcher ohne `--force` abgelehnt wird, falls die Datei existiert. Nicht verfügbare Mitglieder werden gemeldet, nie geraten.

"Arbeitskontext" ist das zusammengesetzte Set; das Feld `context:` in `openspec/config.yaml` ist der Projekt-Hintergrund, der in Anweisungen injiziert wird — zwei verschiedene Dinge. `openspec doctor` beantwortet, ob das Set gesund ist; `openspec context` beantwortet, was das Set ist.

## Persönliche Worksets

> **Beta.** Worksets sind Teil der neuen Beta-Oberfläche; Befehle, Flags und Dateiformate können zwischen den Releases Änderungen erfahren. Für die Anleitung siehe [stores guide](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together).

Ein Workset ist eine persönliche, benannte Ansicht der Ordner, an denen Sie zusammenarbeiten – ein Planungs-Root plus alles, was Sie wählen – die auf Ihrem Rechner gespeichert und in Ihrem Tool unter dem Namen wieder geöffnet wird. Es ist rein lokal: niemals committed, niemals geteilt, niemals aus Deklarationen abgeleitet, und das Entfernen eines Worksets berührt nie einen Mitgliedsordner.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` führt einen kurzen, geführten Ablauf durch (oder nimmt die `--member`-Flags nicht-interaktiv entgegen; das erste Mitglied ist der primäre – Sitzungen beginnen dort). `open` startet das gewählte Tool: Editoren (VS Code, Cursor) öffnen ein Fenster mit jedem Mitglied und kehren zurück; CLI-Agenten (Claude Code, codex) übernehmen dieses Terminal als eine Sitzung mit allen Mitgliedern angehängt und ohne vorausgefüllten Prompt, endend, wenn Sie beenden. Ein beim Öffnen fehlender Mitgliederordner wird mit einer Notiz übersprungen; der Rest wird geöffnet. Die gespeicherte Tool-Präferenz kann pro Öffnung mit `--tool` überschrieben werden.

Die Unterstützung eines neuen Tools erfolgt durch Konfiguration, nicht durch Code. Jedes Tool ist eine der beiden Startstile – `workspace-file` (gestartet mit dem generierten `.code-workspace`) oder `attach-dirs` (ein Anhangsflag pro Mitglied) – und der Schlüssel `openers` in der globalen `config.json` (öffnen Sie diese mit `openspec config edit`) fügt Tools hinzu oder passt integrierte Funktionen pro Feld an:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Der gesamte Workset-Zustand befindet sich im Ordner `worksets/` des globalen Datenverzeichnisses (die gespeicherten Ansichten plus die generierten `<name>.code-workspace`-Dateien, die bei jeder Öffnung neu erstellt werden); das Löschen dieses Ordners entfernt jede Spur.

---

## Abfragebefehle (Browsing Commands)

### `openspec list`

Listen Sie Änderungen oder Spezifikationen in Ihrem Projekt auf.

```
openspec list [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--specs` | Listen Sie Spezifikationen anstelle von Änderungen |
| `--changes` | Listen Sie Änderungen (Standard) |
| `--sort <order>` | Sortieren nach `recent` (Standard) oder `name` |
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
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

Zeigt ein interaktives Dashboard zur Erkundung von Spezifikationen und Änderungen an.

```
openspec view
```

Öffnet eine terminalbasierte Oberfläche zur Navigation durch die Spezifikationen und Änderungen Ihres Projekts.

---

### `openspec show`

Zeigt Details einer Änderung oder Spezifikation an.

```
openspec show [item-name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `item-name` | Nein | Name der Änderung oder Spezifikation (fragt nach, wenn weggelassen) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--type <type>` | Typ angeben: `change` oder `spec` (automatisch erkannt, wenn eindeutig) |
| `--json` | Ausgabe als JSON |
| `--no-interactive` | Prompts deaktivieren |

**Änderungsspezifische Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--deltas-only` | Zeigt nur Delta-Spezifikationen (JSON-Modus) |

**Spezifikationsspezifische Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--requirements` | Zeigt nur Anforderungen, schließt Szenarien aus (JSON-Modus) |
| `--no-scenarios` | Schließt Szenarioinhalte aus (JSON-Modus) |
| `-r, --requirement <id>` | Spezifische Anforderung anhand des 1-basierten Index anzeigen (JSON-Modus) |

**Beispiele:**

```bash
# Interaktive Auswahl
openspec show

# Eine spezifische Änderung anzeigen
openspec show add-dark-mode

# Eine spezifische Spezifikation anzeigen
openspec show auth --type spec

# JSON-Ausgabe zum Parsen
openspec show add-dark-mode --json
```

---

## Validierungsbefehle (Validation Commands)

### `openspec validate`

Validiert Änderungen und Spezifikationen auf strukturelle Probleme.

```
openspec validate [item-name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `item-name` | Nein | Spezifisches Element zur Validierung (fragt nach, wenn weggelassen) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--all` | Alle Änderungen und Spezifikationen validieren |
| `--changes` | Alle Änderungen validieren |
| `--specs` | Alle Spezifikationen validieren |
| `--type <type>` | Typ angeben, wenn der Name mehrdeutig ist: `change` oder `spec` |
| `--strict` | Strenger Validierungsmodus aktivieren |
| `--json` | Ausgabe als JSON |
| `--concurrency <n>` | Maximale parallele Validierungen (Standard: 6, oder `OPENSPEC_CONCURRENCY` Umgebungsvariable) |
| `--no-interactive` | Prompts deaktivieren |

**Beispiele:**

```bash
# Interaktive Validierung
openspec validate

# Eine spezifische Änderung validieren
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
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: fehlt der Abschnitt „Technical Approach“

1 warning found
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
        "warnings": ["design.md: fehlt der Abschnitt 'Technical Approach'"]
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

## Lebenszyklusbefehle (Lifecycle Commands)

### `openspec archive`

Archiviert eine abgeschlossene Änderung und verschmilzt Delta-Spezifikationen in die Hauptspezifikationen.

```
openspec archive [change-name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `change-name` | Nein | Änderung zum Archivieren (fragt nach, wenn weggelassen) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `-y, --yes` | Bestätigungsabfragen überspringen |
| `--skip-specs` | Spezifikationsaktualisierungen überspringen (für Infrastruktur-/Tooling-/Doc-only Änderungen) |
| `--no-validate` | Validierung überspringen (erfordert Bestätigung) |

**Beispiele:**

```bash
# Interaktives Archivieren
openspec archive

# Eine spezifische Änderung archivieren
openspec archive add-dark-mode

# Archivieren ohne Prompts (CI/Skripte)
openspec archive add-dark-mode --yes

# Ein Tooling-Änderung archivieren, die die Spezifikationen nicht betrifft
openspec archive update-ci-config --skip-specs
```

**Was es tut:**

1. Validiert die Änderung (es sei denn, `--no-validate` wird verwendet)
2. Fragt zur Bestätigung nach (es sei denn, `--yes` wird verwendet)
3. Verschmilzt Delta-Spezifikationen in `openspec/specs/`
4. Verschiebt den Änderungsordner nach `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Workflow-Befehle (Workflow Commands)

Diese Befehle unterstützen den artefaktgesteuerten OPSX-Workflow. Sie sind sowohl für Menschen, die den Fortschritt überprüfen, als auch für Agenten nützlich, die die nächsten Schritte bestimmen.

### `openspec new change`

Erstellt einen Änderungsordner und optionale eingecheckte Metadaten im aufgelösten OpenSpec-Root.

```bash
openspec new change <name> [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--description <text>` | Beschreibung, die zu `index.md` hinzugefügt werden soll |
| `--goal <text>` | Optionale Zielmetadaten zur Speicherung mit der Änderung |
| `--schema <name>` | Workflow-Schema verwenden |
| `--store <id>` | Store-ID verwenden als OpenSpec-Root (ein Store ist ein eigenständiges OpenSpec-Repository, das Sie registriert haben) |
| `--json` | JSON ausgeben |

**Beispiele:**

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Zeigt den Abschlussstatus eines Artefakts für eine Änderung an.

```
openspec status [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--change <id>` | Name der Änderung (fragt nach, wenn weggelassen) |
| `--schema <name>` | Schema-Überschreibung (automatisch aus der Konfiguration der Änderung erkannt) |
| `--json` | Ausgabe als JSON |

**Beispiele:**

```bash
# Interaktive Statusprüfung
openspec status

# Status für eine spezifische Änderung
openspec status --change add-dark-mode

# JSON für die Agentennutzung
openspec status --change add-dark-mode --json
```

**Ausgabe (Text):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 Artefakte abgeschlossen

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

Holt angereicherte Anweisungen zum Erstellen eines Artefakts oder zum Anwenden von Aufgaben. Wird von KI-Agenten verwendet, um zu verstehen, was als Nächstes erstellt werden muss.

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
| `--change <id>` | Name der Änderung (erforderlich im nicht-interaktiven Modus) |
| `--schema <name>` | Schema-Überschreibung |
| `--json` | Ausgabe als JSON |

**Sonderfall:** Verwenden Sie `apply` als Artefakt, um Anweisungen zur Implementierung der Aufgaben zu erhalten.

**Beispiele:**

```bash
# Anweisungen für das nächste Artefakt abrufen
openspec instructions --change add-dark-mode

# Spezifische Artefaktanweisungen abrufen
openspec instructions design --change add-dark-mode

# Apply-/Implementierungsanweisungen abrufen
openspec instructions apply --change add-dark-mode

# JSON für den Agentenkonsum
openspec instructions design --change add-dark-mode --json
```

**Die Ausgabe enthält:**

- Vorlageninhalt für das Artefakt
- Projektkontext aus der Konfiguration
- Inhalt von Abhängigkeitsartefakten
- Regeln pro Artefakt aus der Konfiguration

---

### `openspec templates`

Zeigt die aufgelösten Pfade der Vorlagen für alle Artefakte in einem Schema an.

```
openspec templates [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--schema <name>` | Das zu inspizierende Schema (Standard: `spec-driven`) |
| `--json` | Ausgabe als JSON |

**Beispiele:**

```bash
# Vorlagenpfade für das Standard-Schema anzeigen
openspec templates

# Vorlagen für ein benutzerdefiniertes Schema anzeigen
openspec templates --schema my-workflow

# JSON für die programmatische Nutzung
openspec templates --json
```

**Ausgabe (Text):**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Listet verfügbare Workflow-Schemata mit deren Beschreibungen und Artefaktflüssen auf.

```
openspec schemas [options]
```

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--json` | Ausgabe als JSON |

**Beispiel:**

```bash
openspec schemas
```

**Ausgabe:**

```
Verfügbare Schemata:

  spec-driven (package)
    Der Standard-Entwicklungsworkflow, der auf Spezifikationen basiert
    Fluss: proposal → specs → design → tasks

  my-custom (project)
    Benutzerdefinierter Workflow für dieses Projekt
    Fluss: research → proposal → tasks
```

## Schema Commands

Befehle zum Erstellen und Verwalten benutzerdefinierter Workflow-Schemata.

### `openspec schema init`

Erstellt ein projektspezifisches Schema.

```
openspec schema init <name> [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `name` | Ja | Name des Schemas (kebab-case) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--description <text>` | Beschreibung des Schemas |
| `--artifacts <list>` | Kommagetrennte Artifact-IDs (Standard: `proposal,specs,design,tasks`) |
| `--default` | Als Standardschema für das Projekt festlegen |
| `--no-default` | Nicht als Standard festlegen lassen |
| `--force` | Bestehendes Schema überschreiben |
| `--json` | Ausgabe als JSON |

**Beispiele:**

```bash
# Interaktives Schemenerstellung
openspec schema init research-first

# Nicht interaktiv mit spezifischen Artifacts
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
    ├── proposal.md       # Vorlage für jedes Artifact
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
|----------|--------------|-------------|
| `source` | Ja | Das zu kopierende Schema |
| `name` | Nein | Neuer Schemaname (Standard: `<source>-custom`) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--force` | Bestehendes Ziel überschreiben |
| `--json` | Ausgabe als JSON |

**Beispiel:**

```bash
# Fork des eingebauten spec-driven Schemas
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
| `name` | Nein | Das zu validierende Schema (validiert alle, wenn nicht angegeben) |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--verbose` | Zeigt detaillierte Validierungsschritte an |
| `--json` | Ausgabe als JSON |

**Beispiele:**

```bash
# Ein spezifisches Schema validieren
openspec schema validate my-workflow

# Alle Schemata validieren
openspec schema validate
```

---

### `openspec schema which`

Zeigt an, wo ein Schema aufgelöst wird (nützlich zur Debugging der Präzedenz).

```
openspec schema which [name] [options]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `name` | Nein | Name des Schemas |

**Optionen:**

| Option | Beschreibung |
|--------|-------------|
| `--all` | Listet alle Schemata mit ihren Quellen auf |
| `--json` | Ausgabe als JSON |

**Beispiel:**

```bash
# Prüfen, woher ein Schema stammt
openspec schema which spec-driven
```

**Ausgabe:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Schemapräzedenz:**

1. Projekt: `openspec/schemas/<name>/`
2. Benutzer: `~/.local/share/openspec/schemas/<name>/`
3. Paket: Eingebaute Schemata

---

## Configuration Commands

### `openspec config`

Ansicht und Modifikation der globalen OpenSpec-Konfiguration.

```
openspec config <subcommand> [options]
```

**Unterbefehle:**

| Unterbefehl | Beschreibung |
|------------|-------------|
| `path` | Zeigt den Konfigurationsdateipfad an |
| `list` | Zeigt alle aktuellen Einstellungen an |
| `get <key>` | Ruft einen bestimmten Wert ab |
| `set <key> <value>` | Setzt einen Wert |
| `unset <key>` | Entfernt einen Schlüssel |
| `reset` | Setzt auf Standardwerte zurück |
| `edit` | Öffnet in `$EDITOR` |
| `profile [preset]` | Konfiguriert das Workflow-Profil interaktiv oder über ein Preset |

**Beispiele:**

```bash
# Konfigurationsdateipfad anzeigen
openspec config path

# Alle Einstellungen auflisten
openspec config list

# Einen bestimmten Wert abrufen
openspec config get telemetry.enabled

# Einen Wert setzen
openspec config set telemetry.enabled false

# Einen String-Wert explizit setzen
openspec config set user.name "My Name" --string

# Eine benutzerdefinierte Einstellung entfernen
openspec config unset user.name

# Die gesamte Konfiguration zurücksetzen
openspec config reset --all --yes

# Konfigurationsdatei in Ihrem Editor bearbeiten
openspec config edit

# Profil mit Wizard basierend auf Aktionen konfigurieren
openspec config profile

# Schnelles Preset: Umschalten der Workflows auf Core (behält den Delivery-Modus bei)
openspec config profile core
```

`openspec config profile` beginnt mit einer Zusammenfassung des aktuellen Zustands und lässt Sie dann wählen:
- Lieferung ändern + Workflows ändern
- Nur die Lieferung ändern
- Nur die Workflows ändern
- Aktuelle Einstellungen beibehalten (beenden)

Wenn Sie die aktuellen Einstellungen beibehalten, werden keine Änderungen geschrieben und es wird kein Update-Prompt angezeigt.
Wenn es keine Konfigurationsänderungen gibt, aber die Dateien des aktuellen Projekts nicht mit Ihrem globalen Profil/Delivery synchronisiert sind, zeigt OpenSpec eine Warnung an und schlägt `openspec update` vor.
Das Drücken von `Ctrl+C` bricht den Vorgang sauber ab (kein Stack Trace) und beendet mit Code `130`.
In der Workflow-Checkliste bedeutet `[x]`, dass der Workflow in der globalen Konfiguration ausgewählt ist. Um diese Auswahlen auf die Projektdateien anzuwenden, führen Sie `openspec update` aus (oder wählen Sie beim Prompt innerhalb eines Projekts „Änderungen für dieses Projekt anwenden?“).

**Interaktive Beispiele:**

```bash
# Nur Delivery-Update
openspec config profile
# wählen: Nur Lieferung ändern
# wählen Delivery: Skills nur

# Nur Workflows-Update
openspec config profile
# wählen: Nur Workflows ändern
# die Workflows in der Checkliste umschalten und dann bestätigen
```

---

## Utility Commands

### `openspec feedback`

Senden Sie Feedback zu OpenSpec. Erstellt ein GitHub Issue.

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

**Voraussetzungen:** Die GitHub CLI (`gh`) muss installiert und authentifiziert sein.

**Beispiel:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Verwaltet Shell-Completions für die OpenSpec CLI.

```
openspec completion <subcommand> [shell]
```

**Unterbefehle:**

| Unterbefehl | Beschreibung |
|------------|-------------|
| `generate [shell]` | Gibt das Completion-Skript an stdout aus |
| `install [shell]` | Installiert die Completion für Ihre Shell |
| `uninstall [shell]` | Entfernt installierte Completions |

**Unterstützte Shells:** `bash`, `zsh`, `fish`, `powershell`

**Beispiele:**

```bash
# Completions installieren (Shell wird automatisch erkannt)
openspec completion install

# Für eine bestimmte Shell installieren
openspec completion install zsh

# Skript für die manuelle Installation generieren
openspec completion generate bash > ~/.bash_completion.d/openspec

# Deinstallieren
openspec completion uninstall
```

---

## Exit Codes

| Code | Bedeutung |
|------|---------|
| `0` | Erfolg |
| `1` | Fehler (Validierungsfehler, fehlende Dateien usw.) |

---

## Environment Variables

| Variable | Beschreibung |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Auf `0` setzen, um Telemetrie zu deaktivieren |
| `DO_NOT_TRACK` | Auf `1` setzen, um Telemetrie zu deaktivieren (Standard-DNT-Signal) |
| `OPENSPEC_CONCURRENCY` | Standard-Parallelität für die Massenvalidierung (Standard: 6) |
| `EDITOR` oder `VISUAL` | Editor für `openspec config edit` |
| `NO_COLOR` | Farbausgabe deaktivieren, wenn gesetzt |

---

## Related Documentation

- [Commands](commands.md) - AI Slash Commands (`/opsx:propose`, `/opsx:apply`, etc.)
- [Workflows](workflows.md) - Häufige Muster und wann welcher Befehl zu verwenden ist
- [Customization](customization.md) - Benutzerdefinierte Schemata und Vorlagen erstellen
- [Getting Started](getting-started.md) - Erste-Einrichtung-Anleitung