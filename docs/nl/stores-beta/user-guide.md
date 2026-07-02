# Stores: Plan in Eigen Repo

> **Beta.** Stores, referenties (references), werkcontext (working context) en worksets zijn nieuw. Commando-namen, vlaggen, bestandformaten en JSON-output kunnen nog veranderen tussen releases. Elke walkthrough hieronder is uitgevoerd tegen de huidige build, maar lees deze handleiding opnieuw na een upgrade.

## Het probleem dat dit oplost

OpenSpec leeft normaal gesproken binnen één code repo: een `openspec/` map naast uw code, die de specificaties en wijzigingen voor die repo bevat.

Dit past niet meer wanneer uw planning groter is dan één repo:

- Uw werk beslaat meerdere repos — één feature raakt het API server, de webapp en een gedeelde bibliotheek. In welke `openspec/` map leeft het plan?
- Uw team plant voordat er code bestaat, of plant dingen die nooit in *deze* repo worden omgezet naar code.
- Eisen worden bezeten door één team en gebruikt door andere teams. De wiki-versie raakt verouderd, en uw coding agent kan deze toch niet lezen.

Een **store** is het antwoord: een standalone repo waarvan de volledige taak planning is. Het heeft dezelfde `openspec/` vorm die u al kent — specificaties en wijzigingen — plus één klein identificatiebestand. U registreert het op uw machine één keer, naar naam, en vervolgens kan elk normaal OpenSpec commando hiermee van elke locatie worden uitgevoerd.

## De structuur

```
            team-plans  (een store: planning in zijn eigen repo)
            ├── .openspec-store/store.yaml     identity: "Ik ben team-plans"
            └── openspec/
                ├── specs/      wat waar is
                └── changes/    wat in beweging is
                      ▲
                      │ geregistreerd op elke machine door naam;
                      │ gedeeld door pushen/clonen zoals een gewone repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

Twee regels houden dit eenvoudig:

1. **Een store is slechts een git repo.** Je committet, pusht, pullt en beoordeelt deze zelf. OpenSpec klont, synchroniseert of pusht niets van zichzelf.
2. **Declaraties, geen machinerie.** Repos kunnen *declareren* hoe ze zich verhouden tot stores (zie hieronder). Declaraties wijzigen wat OpenSpec je kan vertellen — nooit waar jouw commando's op werken.

## Vijf minuten naar je eerste store

Twee commando's brengen je van niets naar een werkende, door de store omvattende wijziging:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store klaar: team-plans
Locatie: /Users/you/openspec/team-plans
OpenSpec root: klaar
Registry: geregistreerd

Volgende stap: voer normale OpenSpec commando's uit tegen deze store, bijvoorbeeld:
  openspec new change <change-id> --store team-plans
Deel deze store door hem te committen en te pushen alsof het een Git repo is.
```

```bash
openspec new change add-login --store team-plans
```

```
Gebruik OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Gecreëerde change 'add-login' op /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Volgende stap: openspec status --change add-login --store team-plans
```

Dat is het hele model. Vanaf hier is de levenscyclus precies wat je weet — `status`, `instructions`, `validate`, `archive` — met `--store team-plans` bij elk commando, en elke getoonde hint draagt de vlag voor jou. De `Using OpenSpec root:` regel vertelt altijd waar een commando opwerkt.

## Verhaal: één team, één planning repo

Een team houdt zijn specs en changes in `team-plans` in plaats van ze te verspreiden over code repos.

**Dag één (wie het ook instelt):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Het doorgeven van `--remote` registreert de clone URL in het identiteitsbestand van de store zelf (`.openspec-store/store.yaml`), bij de initiële commit. Elke toekomstige clone wordt geboren met kennis van waar hij vandaan komt, zodat gezondheidscontroles en foutmeldingen een compleet, plakbaar bestanddeel kunnen tonen voor teamgenoten die het nog niet hebben.

**Elke teamgenoot (één keer per machine):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

Vanaf dat moment werkt iedereen in dezelfde planning repo op basis van naam:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**Het delen van werk is git, en dat is de bedoeling.** Een change die je creëert bestaat alleen in jouw checkout totdat je deze committet en pusht — hetzelfde als code. Plannen krijgen branches, pull requests en beoordelingen gratis, omdat een store een gewone repo is.

**Het verbinden van de code repos van het team.** Een code repo waarvan de planning volledig extern is gezet, heeft precies één regel in `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Nu werkt elk OpenSpec commando uitgevoerd binnen `web-app` op `team-plans` zonder enige vlag:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

De pointer is een fallback, nooit een override: een expliciet `--store` wint altijd, en als de repo echt planningmappen van zijn eigen krijgt, dan winnen die (met een waarschuwing om de verouderde pointer te verwijderen).

## Verhaal: vereisten die teamgrenzen overstijgen

Een platformteam bezit de vereisten. Productteams bouwen hierop, in hun eigen repos, met hun eigen ontwerpen. Een referentie beschrijft deze relatie zonder iemands werk te verplaatsen.

```
   platform-reqs (store)                 api-server (code repo)
   bezeten door het platformteam            bezeten door een productteam
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ leest    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (hun eigen ontwerpen)    │
   │   platform werk          │          │ openspec/changes/        │
   │                          │          │   (hun eigen werk)       │
   │                          │          │ └──────────────────────────┘
   └──────────────────────────┘
```

**Het productteam declareert waarop het zich baseert** in de `openspec/config.yaml` van zijn repo:

```yaml
references:
  - platform-reqs
```

Referenties zijn leesbare context. De repo behoudt zijn eigen `openspec/` root; het werk blijft daar. Wat verandert is dat `openspec instructions` in die repo nu een index bevat van de specs van de referentieerde store — elk met een één-regelige samenvatting en het exacte fetch commando (`openspec show <spec-id> --type spec --store platform-reqs`). Een agent werkend in `api-server` kan de upstream betaalvereisten vinden, ze citeren en zijn laag-niveau ontwerp opstellen in de eigen root van de repo — zonder dat iemand context eromheen plakt.

Een referentie kan zijn clonebron dragen, zodat teamgenoten die de store nog niet hebben een compleet bestanddeel krijgen in plaats van een doodlopende weg:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Wanneer je het plan en de code samen wilt hebben, maak dan een workset.** Dit is persoonlijk en expliciet: elk persoon kiest de mappen waarmee hij daadwerkelijk werkt op zijn machine. Niets over die lokale checkout paden wordt gecommitteerd naar de gedeelde planning repo.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Twee vragen die je altijd kunt stellen

**"Is mijn setup gezond?"** — `openspec doctor` controleert de huidige root en de door deze gerelateerde stores, leesbaar, met een plakbaar bestanddeel per bevinding:

```
Doctor

Root
  Locatie: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: De referentieerde store 'design-system' is niet geregistreerd op deze machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"Waar werk ik mee?"** — `openspec context` verzamelt de werkset uit de OpenSpec declaraties: de root en de stores die deze referentieert.

```
Werkende context voor api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referentieerde stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

Beide ondersteunen `--json` voor agents. `openspec context --code-workspace <pad>` schrijft bovendien een VS Code workspace bestand dat de volledige set bevat — dit is het enige wat dit commando doet.

## Worksets: heropen de mappen waar je samen aan werkt

Los van alles hierboven: de meeste mensen openen dezelfde paar mappen elke sessie — de planning repo plus twee of drie code repos. Een **workset** is een persoonlijke, benoemde weergave hiervan, opnieuw geopend met één commando in jouw tool van keuze.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       alle drie geopend in je tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (geopend in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` start vervolgens de opgeslagen tool: editors (VS Code, Cursor) openen één venster met elk lid en keren terug. Het eerste lid is het primaire. Override de tool altijd met `--tool <id>`.

Worksets zijn opzettelijk *geen* gedeelde staat. Ze bestaan op jouw machine, worden nooit gecommitteerd en maken geen claims over het werk — ze registreren alleen wat je graag samen open hebt staan. Het verwijderen van één lid raakt de ledenmappen niet aan. Nieuwe tools zijn configuratie, geen code: alles gelanceerd via een workspace bestand of per-map attach vlaggen kan worden toegevoegd onder de `openers` sleutel in de globale config (`openspec config edit`).

## Hoe commando's beslissen waar ze opwerken

Elk normaal commando lost zijn root op dezelfde manier, in deze volgorde:

```
1. --store <id>          jij zei het expliciet        → die store
2. nabijste openspec/     een echte planning root hier   → deze repo
   (omhoog lopen vanaf cwd)
3. store: pointer        config.yaml declareert een store  → die store
4. geen van bovenstaande    stores geregistreerd op deze machine?         → fout met een selectiehint
                         geen stores geregistreerd?         → de huidige
                                                          directory
                                                          (klassiek gedrag)
```

De `Using OpenSpec root:` regel (en het `root` blok in de `--json` output) vertelt je in welke situatie je zit.

## Bekende beperkingen

- **Beta structuur.** Alles op deze pagina kan veranderen tussen releases — namen, vlaggen, bestandsvormaten, JSON sleutels.
- **Eén checkout per store id per machine.** Het registreren van een tweede checkout onder dezelfde ID mislukt met een hint om eerst `store unregister` uit te voeren.
- **Nooit synchroniseren — dat is het ontwerp.** OpenSpec klont, pullt of pusht nooit. Een verouderde checkout toont verouderde specs totdat *jij* pullt; referenties worden live geïndexeerd van wat er op de schijf staat.
- **Sommige commando's blijven waar ze zijn.** `view`, `templates`, `schemas` en de verouderde zelfstandig naamwoorden (`openspec change show`, ...) werken alleen op de huidige directory — geen `--store`.
- **Per-machine staat is per machine.** De store registry en worksets zijn lokale instellingen. Niets over het layout van jouw machine wordt ooit gecommitteerd naar gedeelde planning.
- **Twee launchstijlen voor worksets.** Een tool die niet met een workspace bestand of per-map attach vlaggen gelanceerd kan worden, kan niet worden toegevoegd als opener.
- **Agent JSON heeft een bekende casing split** (store-family sleutels zijn snake_case, workflow-family camelCase). Gedocumenteerd in de [agent contract](../agent-contract.md); het uniform maken is uitgesteld tot een versie-gecontroleerde release.

## Waar dingen staan

| Wat | Waar | Gedeeld? |
|---|---|---|
| De planning van een store | `<store>/openspec/` (specs, changes) | Ja — committeer en push het |
| Het identiteit van een store | `<store>/.openspec-store/store.yaml` | Ja — gecommitteerd met de store |
| De store registry | `<data dir>/openspec/stores/registry.yaml` | Nee — dit is alleen voor deze machine |
| Worksets | `<data dir>/openspec/worksets/` | Nee — dit is alleen voor deze machine |

`<data dir>` is `~/.local/share/openspec` op macOS en Linux (of `$XDG_DATA_HOME/openspec` wanneer ingesteld), en `%LOCALAPPDATA%\openspec` op Windows.
## Referentie

Exacte vlaggen en JSON vormen voor elk commando op deze pagina:
[CLI reference](../cli.md) (Stores, Doctor, Werkende context, Persoonlijke worksets) en het [agent contract](../agent-contract.md).