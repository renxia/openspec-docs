# Stores: Planung in einem eigenen Repo
> **Beta.** Stores, Referenzen, Arbeitskontexte und Worksets sind neu. Befehlsnamen, Flags, Dateiformate und JSON-Ausgaben können sich zwischen Releases noch ändern. Alle nachfolgenden Schritt-für-Schritt-Anleitungen wurden mit dem aktuellen Build durchgeführt – lesen Sie diese Anleitung nach einem Upgrade aber erneut.

## Das damit gelöste Problem
OpenSpec liegt normalerweise in einem einzelnen Code-Repo: einem `openspec/`-Ordner neben Ihrem Code, der Spezifikationen und Änderungen für dieses Repo enthält.
Das funktioniert nicht mehr, sobald Ihre Planung über ein einzelnes Repo hinausgeht:
- Ihre Arbeit erstreckt sich über mehrere Repos: Ein einzelnes Feature betrifft den API-Server, die Webanwendung und eine gemeinsame Bibliothek. In wessen `openspec/`-Ordner soll der Plan dann abgelegt werden?
- Ihr Team erstellt Pläne, bevor Code existiert, oder plant Dinge, die nie zu Code in *diesem* Repo werden.
- Anforderungen werden von einem Team verwaltet und von anderen genutzt. Die Wiki-Version weicht im Laufe der Zeit ab, und Ihr Coding-Agent kann sie ohnehin nicht lesen.

Ein **Store** ist die Lösung: ein eigenständiges Repo, dessen einziger Zweck die Planung ist. Es weist die gleiche `openspec/`-Struktur auf, die Sie bereits kennen – Spezifikationen und Änderungen – sowie eine kleine Identitätsdatei. Sie registrieren es einmal unter einem Namen auf Ihrem Rechner, und anschließend können alle normalen OpenSpec-Befehle von überall darin arbeiten.

## Die Struktur

```
            team-plans  (ein Store: Planung in einem eigenen Repository)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      was gilt
                └── changes/    was sich in Bewegung befindet
                      ▲
                      │ pro Maschine per Name registriert;
                      │ wird per Push/Clone wie jedes andere Repository geteilt
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (Code-Repository)   (Code-Repository)    (Code-Repository)
```

Zwei Regeln halten dies einfach:

1. **Ein Store ist lediglich ein Git-Repository.** Sie committen, pushen, pullen und überprüfen es selbst. OpenSpec klont, synchronisiert oder pusht niemals eigenständig etwas.
2. **Deklarationen, keine Mechanik.** Repositories können *deklarieren*, wie sie sich zu Stores verhalten (unten gezeigt). Deklarationen ändern, was OpenSpec Ihnen mitteilen kann — niemals, wo Ihre Befehle wirken.

## Fünf Minuten bis zu Ihrem ersten Store

Zwei Befehle bringen Sie von nichts zu einer funktionierenden, store-scoped Änderung:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store bereit: team-plans
Speicherort: /Users/you/openspec/team-plans
OpenSpec-Root: bereit
Registrierung: registriert

Nächster Schritt: Führen Sie normale OpenSpec-Befehle für diesen Store aus, beispielsweise:
  openspec new change <change-id> --store team-plans
Teilen Sie diesen Store, indem Sie ihn wie jedes andere Git-Repository committen und pushen.
```

```bash
openspec new change add-login --store team-plans
```

```
Verwende OpenSpec-Root: team-plans (/Users/you/openspec/team-plans)
Change 'add-login' erstellt unter /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Nächster Schritt: openspec status --change add-login --store team-plans
```

Das ist das gesamte Modell. Ab hier entspricht der Lebenszyklus genau dem, was Sie kennen — `status`, `instructions`, `validate`, `archive` — mit `--store team-plans` bei jedem Befehl, und jeder ausgegebene Hinweis enthält das Flag für Sie. Die Zeile `Using OpenSpec root:` zeigt Ihnen immer, wo ein Befehl wirkt.

## Geschichte: Ein Team, ein Planungs-Repository

Ein Team verwaltet seine Spezifikationen und Änderungen in `team-plans`, statt sie über Code-Repositories zu verteilen.

**Tag eins (wer auch immer die Einrichtung vornimmt):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Durch Angabe von `--remote` wird die Clone-URL in der eigenen Identitätsdatei des Stores (`.openspec-store/store.yaml`) im initialen Commit gespeichert. Jeder zukünftige Clone weiß von Anfang an, woher er stammt, sodass Integritätsprüfungen und Fehlermeldungen eine vollständige, kopierbare Lösung für Teammitglieder anzeigen können, die den Store noch nicht haben.

**Jedes Teammitglied (einmal pro Maschine):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

Ab dann arbeitet jeder im selben Planungs-Repository per Name:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**Das Teilen von Arbeit erfolgt bewusst über Git.** Eine von Ihnen erstellte Änderung existiert nur in Ihrem Checkout, bis Sie sie committen und pushen — genau wie bei Code. Pläne erhalten kostenlos Branches, Pull Requests und Überprüfungen, da ein Store ein gewöhnliches Repository ist.

**Verbinden der Code-Repositories des Teams.** Ein Code-Repository, dessen Planung vollständig ausgelagert ist, benötigt genau eine Zeile in `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Ab jetzt wirkt jeder OpenSpec-Befehl, der innerhalb von `web-app` ausgeführt wird, ohne weitere Flags auf `team-plans`:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Verwende OpenSpec-Root: team-plans (/Users/you/openspec/team-plans)
...
```

Der Zeiger ist ein Fallback, niemals eine Überschreibung: Ein explizites `--store` hat immer Vorrang, und falls das Repository eigene echte Planungsordner erhält, haben diese Vorrang (mit einer Warnung, den veralteten Zeiger zu entfernen).

**Ein Standard für jedes Repository auf Ihrem Rechner.** Wenn Sie über viele Code-Repositories hinweg arbeiten, die alle in denselben Store planen, setzen Sie ihn einmal global, statt die Zeile `store:` zu jedem Repository hinzuzufügen:

```bash
openspec config set defaultStore team-plans
```

Ab jetzt wird jeder Befehl, der außerhalb einer Planungs-Root ausgeführt wird — und ohne `--store` und ohne Projektzeiger — auf `team-plans` aufgelöst. Er steht am unteren Ende der Prioritätsliste, sodass `--store`, eine lokale Root und ein projektweiter `store:`-Zeiger immer noch Vorrang haben. Das Root-Banner und der JSON-`root`-Block geben `source: "global_default"` zusammen mit der Store-ID aus, sodass Sie immer einen rechnerweiten Standard von dem Zeiger eines eigenen Repositorys unterscheiden können. Löschen Sie ihn mit `openspec config unset defaultStore`. Wenn die ID nicht registriert ist, geben Befehle einen Fehler aus und fordern Sie auf, ihn zu registrieren oder den veralteten Standard zu löschen.

## Geschichte: Anforderungen, die Teamgrenzen überschreiten

Ein Plattform-Team verwaltet die Anforderungen. Produktteams bauen darauf auf, in ihren eigenen Repositories, mit ihren eigenen Entwürfen. Eine Referenz beschreibt diese Beziehung, ohne die Arbeit von jemandem zu verschieben.

```
   platform-reqs (Store)                 api-server (Code-Repository)
   im Besitz des Plattform-Teams            im Besitz eines Produktteams
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ liest    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (ihre eigenen Entwürfe)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (ihre eigene Arbeit)       │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**Das Produktteam deklariert, worauf es zurückgreift,** in der `openspec/config.yaml` seines Repositorys:

```yaml
references:
  - platform-reqs
```

Referenzen sind schreibgeschützter Kontext. Das Repository behält seine eigene `openspec/`-Root; die Arbeit verbleibt dort. Was sich ändert: `openspec instructions` in diesem Repository enthält nun einen Index der Spezifikationen des referenzierten Stores — jede mit einer einzeiligen Zusammenfassung und dem exakten Abrufbefehl (`openspec show <spec-id> --type spec --store platform-reqs`). Ein Agent, der in `api-server` arbeitet, kann die vorgelagerten Zahlungsanforderungen finden, sie zitieren und sein detailliertes Design in der eigenen Root des Repositorys schreiben — ohne dass jemand Kontext hin- und herkopieren muss.

Eine Referenz kann ihre Clone-Quelle enthalten, sodass Teammitglieder, die den Store noch nicht haben, eine vollständige Lösung statt einer Sackgasse erhalten:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Wenn Sie Planung und Code gemeinsam geöffnet haben möchten, erstellen Sie einen Workset.** Dies ist persönlich und explizit: Jede Person wählt die Ordner aus, mit denen sie tatsächlich auf ihrem Rechner arbeitet. Nichts von diesen lokalen Checkout-Pfaden wird an das gemeinsame Planungs-Repository committet.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Zwei Fragen, die Sie immer stellen können

**"Ist meine Einrichtung intakt?"** — `openspec doctor` überprüft die aktuelle Root und ihre referenzierten Stores, schreibgeschützt, mit einer kopierbaren Lösung pro Befund:

```
Doctor

Root
  Speicherort: /Users/you/src/api-server
  OpenSpec-Root: ok

Referenzen
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Der referenzierte Store 'design-system' ist auf diesem Rechner nicht registriert.
    Lösung: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system
```

**"Womit arbeite ich?"** — `openspec context` stellt den Arbeitsbereich aus OpenSpec-Deklarationen zusammen: die Root und die von ihr referenzierten Stores.

```
Arbeitskontext für api-server (/Users/you/src/api-server)

OpenSpec-Root
  api-server  /Users/you/src/api-server

Referenzierte Stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Abrufen: openspec show <spec-id> --type spec --store platform-reqs
```

Beide unterstützen `--json` für Agents. `openspec context --code-workspace <pfad>` schreibt zusätzlich eine VS-Code-Arbeitsbereichsdatei, die den gesamten Satz enthält — dies ist der einzige Schreibvorgang, den dieser Befehl durchführt.

## Worksets: Öffnen Sie die Ordner wieder, an denen Sie gemeinsam arbeiten

Abgesehen von allem oben: Die meisten Personen öffnen bei jeder Sitzung die gleichen wenigen Ordner gemeinsam — das Planungs-Repository plus zwei oder drei Code-Repositories. Ein **Workset** ist eine persönliche, benannte Ansicht genau davon, die mit einem einzigen Befehl in Ihrem bevorzugten Tool wieder geöffnet wird.

```
  Workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       alle drei werden in Ihrem Tool geöffnet
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (wird in VS Code geöffnet)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` startet dann das gespeicherte Tool: Editoren (VS Code, Cursor) öffnen ein Fenster mit allen Mitgliedern und kehren zurück. Das erste Mitglied ist das primäre. Überschreiben Sie das Tool jederzeit mit `--tool <id>`.

Worksets sind bewusst *kein* geteilter Zustand. Sie liegen auf Ihrem Rechner, werden niemals committet und machen keine Aussagen über die Arbeit — sie zeichnen nur auf, was Sie gemeinsam geöffnet haben möchten. Das Entfernen eines Worksets berührt nie die Mitgliedsordner. Neue Tools sind Konfiguration, kein Code: Alles, was über eine Arbeitsbereichsdatei oder pro Ordner angehängte Flags gestartet wird, kann unter dem Schlüssel `openers` in der globalen Konfiguration (`openspec config edit`) hinzugefügt werden.

## Wie Befehle entscheiden, wo sie wirken

Jeder normale Befehl löst seine Root auf die gleiche Weise in dieser Reihenfolge auf:

```
1. --store <id>          Sie haben es explizit angegeben        → dieser Store
2. nächstes openspec/     eine echte Planungs-Root hier     → dieses Repository
   (vom aktuellen Arbeitsverzeichnis aus aufwärts suchen)
3. store:-Zeiger        config.yaml deklariert einen Store  → dieser Store
4. defaultStore          globale Konfiguration setzt einen Rechnerstandard  → dieser Store
                         Standard
5. keines der oben Genannten  Stores auf diesem Rechner registriert?     → Fehler mit einem
                         Auswahlhinweis
                         keine Stores registriert?         → das aktuelle
                                                          Verzeichnis
                                                          (klassisches Verhalten)
```

Die Zeile `Using OpenSpec root:` (und der `root`-Block in der `--json`-Ausgabe) zeigt Ihnen, um welchen Fall es sich handelt.

## Bekannte Einschränkungen

- **Beta-Status.** Alle Inhalte auf dieser Seite können zwischen Releases geändert werden — Namen, Flags, Dateiformate, JSON-Schlüssel.
- **Ein Checkout pro Store-ID pro Rechner.** Die Registrierung eines zweiten Checkouts unter derselben ID schlägt fehl mit dem Hinweis, zuerst `store unregister` auszuführen.
- **Keine Synchronisation, jemals — per Design.** OpenSpec klont, pullt oder pusht niemals. Ein veralteter Checkout zeigt veraltete Spezifikationen an, bis *Sie* pullen; Referenzen werden live aus dem Inhalt auf dem Datenträger indexiert.
- **Leere Planungsordner können fehlen.** Ein neuer Store hat diese Ordner unter Umständen noch nicht in Git: `openspec/changes/`, `openspec/specs/` oder `openspec/changes/archive/`. Dies wird während der Beta akzeptiert; die Ordner erscheinen, sobald normale Befehle Dateien darin erstellen.
- **Zeiger-Repositories bleiben Zeiger-Repositories.** Ein reines Konfigurations-Repository, dessen `openspec/config.yaml` `store: <id>` deklariert, wird als ausgelagerte Planung behandelt, nicht als Store-Checkout zum Registrieren. Entfernen Sie zuerst die Zeile `store:`, wenn Sie dieses Repository absichtlich in eine lokale Store-Root umwandeln möchten.
- **Einige Befehle verbleiben an ihrem Ort.** `view`, `templates`, `schemas` und die veralteten Substantiv-Formen (`openspec change show`, ...) wirken nur auf das aktuelle Verzeichnis — kein `--store`.
- **Rechnerbezogener Zustand ist rechnerbezogen.** Die Store-Registrierung und Worksets sind lokale Einstellungen. Nichts über die Anordnung Ihres Rechners wird jemals an die gemeinsame Planung committet.
- **Zwei Startarten für Worksets.** Ein Tool, das nicht mit einer Arbeitsbereichsdatei oder pro Ordner angehängten Flags gestartet werden kann, kann nicht als Öffner hinzugefügt werden.
- **Agent-JSON weist eine bekannte Trennungsregel für Groß-/Kleinschreibung auf** (Schlüssel der Store-Familie sind snake_case, der Workflow-Familie camelCase). Dies ist im [Agentenvertrag](../agent-contract.md) dokumentiert; die Vereinheitlichung wird auf ein versioniertes Release verschoben.

## Speicherorte von Komponenten

| Was | Wo | Geteilt? |
|---|---|---|
| Planung eines Stores | `<store>/openspec/` (Spezifikationen, Änderungen) | Ja — committen und pushen |
| Identität eines Stores | `<store>/.openspec-store/store.yaml` | Ja — zusammen mit dem Store committet |
| Store-Registry | `<data dir>/openspec/stores/registry.yaml` | Nein — nur auf diesem Rechner |
| Worksets | `<data dir>/openspec/worksets/` | Nein — nur auf diesem Rechner |

`<data dir>` ist `~/.local/share/openspec` unter macOS und Linux (oder `$XDG_DATA_HOME/openspec`, falls gesetzt) sowie `%LOCALAPPDATA%\openspec` unter Windows.

## Referenz

Genaue Flags und JSON-Strukturen für alle auf dieser Seite aufgeführten Befehle: [CLI-Referenz](../cli.md) (Stores, Doctor, Working context, Personal worksets) und der [agent contract](../agent-contract.md).