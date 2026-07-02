# Stores: Plan in Its Own Repo

> **Beta.** Stores, references, working context und worksets sind neu. Befehlsnamen, Flags, Dateiformate und JSON-Ausgaben können zwischen den Releases noch Änderungen erfahren. Jeder Durchlauf unten wurde gegen den aktuellen Build getestet, aber lesen Sie diese Anleitung nach dem Upgrade erneut durch.

## Das Problem, das dies löst

OpenSpec befindet sich normalerweise in einem Code-Repo: einem `openspec/`-Ordner neben Ihrem Code, der die Spezifikationen und Änderungen für dieses Repo enthält.

Das reicht nicht aus, sobald Ihre Planung größer ist als ein Repo:

*   Ihre Arbeit erstreckt sich über mehrere Repos – eine Funktion betrifft den API server, die Web App und eine Shared Library. In welchem `openspec/`-Ordner befindet sich der Plan?
*   Ihr Team plant, bevor der Code existiert, oder plant Dinge, die in *diesem* Repo nie zum Code werden.
*   Anforderungen werden von einem Team besessen und von anderen konsumiert. Die Wiki-Version driftet, und Ihr Coding Agent kann sie ohnehin nicht lesen.

Ein **Store** ist die Antwort: ein unabhängiges Repo, dessen gesamte Aufgabe die Planung ist. Es hat dieselbe `openspec/`-Struktur wie Sie es bereits kennen – Spezifikationen und Änderungen – plus eine kleine Identitätsdatei. Sie registrieren es einmal auf Ihrem Rechner anhand des Namens, und dann kann jeder normale OpenSpec Befehl darin von überall ausgeführt werden.

## Die Struktur

```
            team-plans  (ein Speicher: Planung in einem eigenen Repo)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      what is true
                └── changes/    what is in motion
                      ▲
                      │ registered on each machine by name;
                      │ shared by pushing/cloning like any repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

Zwei Regeln halten dies einfach:

1. **Ein Speicher ist einfach ein Git-Repo.** Sie committen, pushen, pullen und überprüfen es selbst. OpenSpec klont, synchronisiert oder pusht von selbst nichts.
2. **Deklarationen, keine Maschinerie.** Repos können *deklarieren*, wie sie sich zu Speichern verhalten (siehe unten). Deklarationen ändern, was OpenSpec Ihnen sagen kann – niemals wo Ihre Befehle wirken.

## Fünf Minuten bis zum ersten Speicher

Zwei Befehle bringen Sie von nichts zu einer funktionierenden, speicherbezogenen Änderung:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Next: run normal OpenSpec commands against this store, for example:
  openspec new change <change-id> --store team-plans
Share this store by committing and pushing it like any Git repo.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Next: openspec status --change add-login --store team-plans
```

Das ist das ganze Modell. Von hier an ist der Lebenszyklus genau das, was Sie kennen – `status`, `instructions`, `validate`, `archive` – mit `--store team-plans` bei jedem Befehl, und jeder angezeigte Hinweis trägt die Kennzeichnung für Sie. Die Zeile `Using OpenSpec root:` sagt Ihnen immer, wo ein Befehl wirkt.

## Geschichte: Ein Team, ein Planungsrepo

Ein Team speichert seine Spezifikationen und Änderungen in `team-plans` anstatt sie über Code-Repos zu verteilen.

**Tag eins (wer es eingerichtet hat):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Das Übergeben von `--remote` speichert die Klon-URL in der Identitätsdatei des Speichers selbst (`.openspec-store/store.yaml`) im ersten Commit. Jeder zukünftige Klon wird also wissen, woher er stammt, sodass Gesundheitsprüfungen und Fehlermeldungen eine vollständige, kopierbare Korrektur für Teammitglieder ausgeben können, die sie noch nicht haben.

**Jedes Teammitglied (einmal pro Maschine):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

Von da an arbeitet jeder im selben Planungsrepo unter dem Namen:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**Arbeit teilen ist Git, und das ist beabsichtigt.** Eine von Ihnen erstellte Änderung existiert nur in Ihrem Checkout, bis Sie sie committen und pushen – genau wie Code. Pläne erhalten Branches, Pull Requests und Überprüfungen kostenlos, weil ein Speicher ein gewöhnliches Repo ist.

**Verbinden der Code-Repos des Teams.** Ein Code-Repo, dessen Planung vollständig externisiert wurde, benötigt genau eine Zeile in `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Nun wirkt jeder OpenSpec-Befehl innerhalb von `web-app` auf `team-plans` ohne jegliche Flags:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

Der Zeiger ist ein Fallback, niemals eine Überschreibung: Ein explizites `--store` gewinnt immer, und wenn das Repo eigene Planungsordner wächst, gewinnen diese (mit einer Warnung, den veralteten Zeiger zu entfernen).

## Geschichte: Anforderungen, die Teamgrenzen überschreiten

Ein Plattformteam besitzt die Anforderungen. Produktteams bauen darauf auf, in ihren eigenen Repos mit ihren eigenen Designs. Eine Referenz beschreibt dieses Verhältnis, ohne dass jemand Arbeit verschieben muss.

```
   platform-reqs (store)                 api-server (code repo)
   owned by the platform team            owned by a product team
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ reads    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (their own designs)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (their own work)       │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**Das Produktteam deklariert, worauf es sich stützt**, in der `openspec/config.yaml` seines Repos:

```yaml
references:
  - platform-reqs
```

Referenzen sind nur lesbarer Kontext. Das Repo behält seinen eigenen `openspec/`-Root; die Arbeit bleibt dort. Was sich ändert: `openspec instructions` in diesem Repo umfasst nun ein Verzeichnis der Spezifikationen des referenzierten Speichers – jede mit einer einzeiligen Zusammenfassung und dem genauen Abrufbefehl (`openspec show <spec-id> --type spec --store platform-reqs`). Ein Agent, der in `api-server` arbeitet, kann die upstream Payment-Anforderungen finden, sie zitieren und sein Low-Level-Design im eigenen Root des Repos schreiben – ohne dass jemand Kontext einfügen muss.

Eine Referenz kann ihre Klonquelle tragen, sodass Teammitglieder, die den Speicher noch nicht haben, eine vollständige Korrektur anstelle einer Sackgasse erhalten:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Wenn Sie Plan und Code zusammen haben möchten, erstellen Sie ein Workset.** Dies ist persönlich und explizit: Jede Person wählt die Ordner aus, mit denen sie tatsächlich auf ihrer Maschine arbeitet. Nichts über diese lokalen Checkout-Pfade wird in das gemeinsame Planungsrepo committet.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Zwei Fragen, die Sie immer stellen können

**„Ist mein Setup gesund?“** — `openspec doctor` prüft den aktuellen Root und seine referenzierten Speicher, nur lesbar, mit einer kopierbaren Korrektur pro Fund:

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Der referenzierte Speicher 'design-system' ist auf dieser Maschine nicht registriert.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**„Womit arbeite ich?“** — `openspec context` setzt das Arbeitsset aus den OpenSpec-Deklarationen zusammen: dem Root und den von ihm referenzierten Speichern.

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenzierte Speicher
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

Beides unterstützt `--json` für Agents. `openspec context --code-workspace <path>` schreibt zusätzlich eine VS Code Workspace Datei, die das gesamte Set enthält – dies ist der einzige Schreibvorgang dieses Befehls.

## Worksets: Öffnen Sie die Ordner, an denen Sie zusammenarbeiten

Unabhängig von allem oben Genannten: Die meisten Leute öffnen bei jeder Sitzung dieselben wenigen Ordner – das Planungsrepo plus zwei oder drei Code-Repos. Ein **Workset** ist eine persönliche, benannte Ansicht genau davon, die mit einem Befehl in Ihrem Tool der Wahl neu geöffnet wird.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       all three open in your tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --member ~/src/web-app
openspec workset list
```

```
platform  (opens in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` startet dann das gespeicherte Tool: Editoren (VS Code, Cursor) öffnen ein Fenster mit jedem Mitglied und kehren zurück. Das erste Mitglied ist das primäre. Überschreiben Sie das Tool jederzeit mit `--tool <id>`.

Worksets sind absichtlich *kein* geteilter Zustand. Sie leben auf Ihrer Maschine, werden niemals committet und geben keine Versprechen über die Arbeit – sie protokollieren nur, was Ihnen zusammen offen gefällt. Das Entfernen eines Mitglieds berührt die Mitgliederordner nie. Neue Tools sind Konfiguration, kein Code: Alles, was über eine Workspace-Datei oder per-Ordner-Attach-Flags gestartet wird, kann unter dem Schlüssel `openers` in der globalen Konfig (`openspec config edit`) hinzugefügt werden.

## Wie Befehle entscheiden, wo sie wirken

Jeder normale Befehl löst seinen Root auf dieselbe Weise auf, und zwar in dieser Reihenfolge:

```
1. --store <id>          Sie haben es explizit gesagt        → dieser Speicher
2. nearest openspec/     Ein echter Planungs-Root hier      → dieses Repo
   (aufsteigend vom cwd)
3. store: pointer        config.yaml deklariert einen Speicher  → dieser Speicher
4. keines davon         Speicher registriert auf dieser     → Fehler mit einem
                         Maschine?                        Auswahlhinweis
                         keine Speicher registriert?         → das aktuelle
                                                          Verzeichnis
                                                          (klasssisches Verhalten)
```

Die Zeile `Using OpenSpec root:` (und der `root`-Block in der `--json`-Ausgabe) sagt Ihnen, in welchem Fall Sie sich befinden.

## Bekannte Einschränkungen

- **Beta-Form.** Alles auf dieser Seite kann zwischen Releases geändert werden – Namen, Flags, Dateiformate, JSON-Schlüssel.
- **Ein Checkout pro Speicher-ID pro Maschine.** Die Registrierung eines zweiten Checkouts unter derselben ID schlägt fehl mit einem Hinweis, zuerst `store unregister` auszuführen.
- **Nie synchronisieren — das ist die Designabsicht.** OpenSpec klont, pullt oder pusht nie. Ein veralteter Checkout zeigt veraltete Spezifikationen an, bis *Sie* gepullt haben; Referenzen werden live von dem indexiert, was auf der Festplatte ist.
- **Einige Befehle bleiben dort, wo sie sind.** `view`, `templates`, `schemas` und die veralteten Nomenformen (`openspec change show`, ...) wirken nur auf das aktuelle Verzeichnis – kein `--store`.
- **Der Zustand pro Maschine ist pro Maschine.** Das Speicherregister und Worksets sind lokale Einstellungen. Nichts über Ihr Layout wird jemals in die gemeinsame Planung committet.
- **Zwei Startstile für Worksets.** Ein Tool, das nicht mit einer Workspace-Datei oder per-Ordner-Attach-Flags gestartet werden kann, kann als Opener hinzugefügt werden.
- **Agent JSON hat einen bekannten Casing Split** (store-family Schlüssel sind snake_case, workflow-family camelCase). Dokumentiert in [agent contract](../agent-contract.md); die Vereinheitlichung ist auf ein versioniertes Release verschoben.

## Wo Dinge existieren

| Was | Wo | Geteilt? |
|---|---|---|
| Die Planung eines Speichers | `<store>/openspec/` (specs, changes) | Ja — committen und pushen Sie es |
| Die Identität eines Speichers | `<store>/.openspec-store/store.yaml` | Ja — zusammen mit dem Speicher committet |
| Das Speicherregister | `<data dir>/openspec/stores/registry.yaml` | Nein — nur diese Maschine |
| Worksets | `<data dir>/openspec/worksets/` | Nein — nur diese Maschine |

`<data dir>` ist `~/.local/share/openspec` auf macOS und Linux (oder `$XDG_DATA_HOME/openspec`, wenn es gesetzt ist) und `%LOCALAPPDATA%\openspec` unter Windows.
## Referenz

Genaue Flags und JSON-Formen für jeden Befehl auf dieser Seite:
[CLI reference](../cli.md) (Stores, Doctor, Working context, Personal worksets) und der [agent contract](../agent-contract.md).