# Stores: Plan in een eigen repo

> **Beta.** Stores, referenties, werkcontext en werksets zijn nieuw. Commandonamen, vlaggen, bestandsformaten en JSON-uitvoer kunnen tussen releases nog van vorm veranderen. Elke onderstaande walkthrough is uitgevoerd met de huidige build, maar lees deze gids opnieuw na een upgrade.

## Het probleem dat dit oplost

OpenSpec leeft normaal gesproken binnen één code-repo: een map `openspec/` naast uw code, die specs en wijzigingen voor die repo bevat.

Dat past niet meer zodra uw planning groter is dan één repo:

- Uw werk beslaat meerdere repo's — één functie raakt de API-server, de webapp en een gedeelde bibliotheek. In wiens `openspec/`-map moet het plan komen?
- Uw team plant voordat code bestaat, of plant dingen die nooit code worden in *deze* repo.
- Vereisten zijn eigendom van één team en worden door anderen gebruikt. De wiki-versie wijkt af, en uw coding-agent kan het toch niet lezen.

Een **store** is het antwoord: een zelfstandige repo waarvan het enige doel plannen is. Het heeft dezelfde `openspec/`-vorm die u al kent — specs en wijzigingen — plus een klein identiteitsbestand. U registreert het eenmalig op uw machine, op naam, en dan kan elk normaal OpenSpec-commando er vanaf elke locatie in werken.

## De structuur

```
            team-plans  (a store: planning in its own repo)
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

Twee regels houden dit eenvoudig:

1. **Een store is gewoon een git-repo.** Je commit, pusht, pulled en beoordeelt het zelf. OpenSpec cloneert, synchroniseert of pusht nooit iets op eigen initiatief.
2. **Declaraties, geen machines.** Repos kunnen *declareren* hoe ze zich verhouden tot stores (hieronder getoond). Declaraties veranderen wat OpenSpec je kan vertellen — nooit waar je commando's op werken.

## Vijf minuten naar je eerste store

Twee commando's brengen je van niets naar een werkende, store-georiënteerde change:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store gereed: team-plans
Locatie: /Users/you/openspec/team-plans
OpenSpec root: gereed
Register: geregistreerd

Volgende: voer normale OpenSpec-commando's uit op deze store, bijvoorbeeld:
  openspec new change <change-id> --store team-plans
Deel deze store door deze te committen en te pushen zoals elke Git-repo.
```

```bash
openspec new change add-login --store team-plans
```

```
Gebruikmakend van OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Change 'add-login' aangemaakt op /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Volgende: openspec status --change add-login --store team-plans
```

Dat is het hele model. Vanaf hier is de levenscyclus precies wat je weet — `status`, `instructions`, `validate`, `archive` — met `--store team-plans` bij elk commando, en elke afgedrukte hint draagt de vlag voor je. De `Using OpenSpec root:` regel vertelt je altijd waar een commando op werkt.

## Verhaal: één team, één planningrepo

Een team bewaart zijn specs en changes in `team-plans` in plaats van ze over code-repos te verspreiden.

**Dag een (wie het ook opzet):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Door `--remote` mee te geven wordt de clone-URL opgeslagen in het eigen identiteitsbestand van de store (`.openspec-store/store.yaml`), in de eerste commit. Elke toekomstige clone weet waar hij vandaan kwam, dus gezondheidschecks en foutmeldingen kunnen een complete, plakbare oplossing afdrukken voor teamleden die het nog niet hebben.

**Elk teamlid (eenmalig per machine):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

Vanaf dan werkt iedereen in dezelfde planningrepo op naam:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**Werk delen is git, opzettelijk.** Een change die je maakt bestaat alleen in je checkout totdat je het commit en pushed — net als code. Plannen krijgen branches, pull requests en review gratis, omdat een store een gewone repo is.

**Koppelen van de code-repos van het team.** Een code-repo waarvan de planning volledig is geëxternaliseerd heeft precies één regel nodig, in `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Nu voert elk OpenSpec-commando dat binnen `web-app` wordt uitgevoerd, zonder vlaggen uit op `team-plans`:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Gebruikmakend van OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

De pointer is een terugval, nooit een overschrijving: een expliciete `--store` wint altijd, en als de repo zelf echte planningmappen krijgt, winnen die (met een waarschuwing om de verouderde pointer te verwijderen).

**Eén standaard voor elke repo op je machine.** Als je over veel code-repos werkt die allemaal in dezelfde store plannen, stel het eenmalig globaal in, in plaats van de `store:` regel aan elke repo toe te voegen:

```bash
openspec config set defaultStore team-plans
```

Nu lost elk commando dat buiten een planningroot wordt uitgevoerd — en zonder `--store` en zonder projectpointer — op naar `team-plans`. Het staat onderaan de prioriteitslijst, dus `--store`, een lokale root en een project `store:` pointer winnen allemaal nog steeds. De rootbanner en JSON `root` blok rapporteren `source: "global_default"` met de store-id, zodat je altijd een machinebrede standaard kunt onderscheiden van de eigen pointer van een repo. Wis het met `openspec config unset defaultStore`. Als de id niet is geregistreerd, geven commando's een foutmelding en vertellen ze je om het te registreren of de verouderde standaard te wissen.

## Verhaal: vereisten die teambarrières overschrijden

Een platformteam bezit de vereisten. Productteams bouwen erop, in hun eigen repos, met hun eigen ontwerpen. Een referentie beschrijft die relatie zonder het werk van iemand te verplaatsen.

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

**Het productteam declareert waar het op bouwt** in de `openspec/config.yaml` van zijn repo:

```yaml
references:
  - platform-reqs
```

Referenties zijn alleen-lezen context. De repo behoudt zijn eigen `openspec/` root; werk blijft daar. Wat verandert: `openspec instructions` in die repo bevat nu een index van de specs van de gerefereerde store — elk met een eenregelige samenvatting en het exacte fetch-commando (`openspec show <spec-id> --type spec --store platform-reqs`). Een agent die in `api-server` werkt kan de upstream-betalingsvereisten vinden, citeren en zijn low-level ontwerp in de eigen root van de repo schrijven — zonder dat iemand context hoeft te plakken.

Een referentie kan zijn clone-bron dragen, dus teamleden die de store nog niet hebben krijgen een complete oplossing in plaats van een doodlopend pad:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Wanneer je het plan en de code samen open wilt hebben, maak een werkset.** Dit is persoonlijk en expliciet: elke persoon kiest de mappen die hij/zij daadwerkelijk op zijn/haar machine gebruikt. Niets van die lokale checkoutpaden wordt gecommit naar de gedeelde planningrepo.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Twee vragen die je altijd kunt stellen

**"Is mijn installatie gezond?"** — `openspec doctor` controleert de huidige root en zijn gerefereerde stores, alleen-lezen, met een plakbare oplossing per bevinding:

```
Doctor

Root
  Locatie: /Users/you/src/api-server
  OpenSpec root: ok

Referenties
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Gerefereerde store 'design-system' is niet geregistreerd op deze machine.
    Oplossing: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"Waar werk ik mee?"** — `openspec context` stelt de werkset samen uit OpenSpec-declaraties: de root en de stores die het refereert.

```
Werkcontext voor api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Gerefereerde stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Ophalen: openspec show <spec-id> --type spec --store platform-reqs
```

Beide ondersteunen `--json` voor agents. `openspec context --code-workspace <pad>` schrijft daarnaast een VS Code-werkruimtebestand dat de hele set bevat — de enige schrijfoperatie die dit commando uitvoert.

## Werksets: heropen de mappen die je samen gebruikt

Los van het bovenstaande: de meeste mensen openen elke sessie dezelfde paar mappen samen — de planningrepo plus twee of drie code-repos. Een **werkset** is een persoonlijke, benoemde weergave van precies dat, heropend met één commando in je tool van keuze.

```
  werkset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       alle drie open in je tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (opent in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` start dan de opgeslagen tool: editors (VS Code, Cursor) openen één venster met alle leden en keren terug. Het eerste lid is het primaire. Overschrijf de tool op elk moment met `--tool <id>`.

Werksets zijn opzettelijk *geen* gedeelde staat. Ze leven op je machine, worden nooit gecommit en maken geen aanspraken op het werk — ze registreren alleen wat je graag samen open hebt. Eén verwijderen raakt nooit de ledenmappen. Nieuwe tools zijn configuratie, geen code: alles wat wordt gestart via een werkruimtebestand of per-map-koppelvlaggen kan worden toegevoegd onder de `openers` sleutel in de globale config (`openspec config edit`).

## Hoe commando's beslissen waar ze op werken

Elk normaal commando lost zijn root op dezelfde manier op, in deze volgorde:

```
1. --store <id>          je zei het expliciet           → die store
2. dichtstbijzijnde       een echte planningroot hier    → deze repo
   openspec/             (lopend omhoog vanaf cwd)
3. store: pointer        config.yaml declareert een      → die store
                         store
4. defaultStore          globale config stelt een         → die store
                         machinestandaard in
5. geen van het           stores geregistreerd op deze    → fout met een
   bovenstaande           machine?                         selectiehint
                         geen stores                      → de huidige
                         geregistreerd?                   map
                                                   (standaardgedrag)
```

De `Using OpenSpec root:` regel (en het `root` blok in `--json` output) vertelt je in welke geval je zit.

## Bekende beperkingen

- **Beta-vorm.** Alles op deze pagina kan veranderen tussen releases — namen, vlaggen, bestandsformaten, JSON-sleutels.
- **Eén checkout per store-id per machine.** Het registreren van een tweede checkout onder dezelfde id mislukt met een hint om eerst `store unregister` uit te voeren.
- **Nooit synchroniseren — opzettelijk.** OpenSpec cloneert, pulled of pushed nooit. Een verouderde checkout toont verouderde specs totdat *jij* pulled; referenties worden live geïndexeerd van wat er op schijf staat.
- **Lege planningmappen kunnen ontbreken.** Een nieuwe store heeft mogelijk nog geen `openspec/changes/`, `openspec/specs/` of `openspec/changes/archive/` in Git. Dat wordt geaccepteerd tijdens de beta; die mappen verschijnen zodra normale commando's er bestanden voor aanmaken.
- **Pointer-repos blijven pointers.** Een config-only repo waarvan de `openspec/config.yaml` `store: <id>` declareert, wordt behandeld als geëxternaliseerde planning, niet als een store-checkout om te registreren. Verwijder eerst de `store:` regel als je die repo opzettelijk wilt omzetten naar een lokale storeroot.
- **Sommige commando's blijven waar ze zijn.** `view`, `templates`, `schemas` en de verouderde zelfstandig naamwoorden (`openspec change show`, ...) werken alleen op de huidige map — geen `--store`.
- **Per-machine staat is per-machine.** De storeregister en werksets zijn lokale instellingen. Niets over de indeling van je machine wordt ooit gecommit naar gedeelde planning.
- **Twee lanceerstijlen voor werksets.** Een tool die niet kan worden gestart met een werkruimtebestand of per-map-koppelvlaggen kan niet worden toegevoegd als opener.
- **Agent JSON heeft een bekende casing-splitsing** (store-familie sleutels zijn snake_case, workflow-familie camelCase). Gedocumenteerd in het [agent contract](../agent-contract.md); de unificatie ervan is uitgesteld tot een uitgave met versiebeheer.

## Waar dingen zich bevinden

| Wat | Waar | Gedeeld? |
|---|---|---|
| De planning van een store | `<store>/openspec/` (specs, changes) | Ja — commit en push het |
| De identiteit van een store | `<store>/.openspec-store/store.yaml` | Ja — gecommit met de store |
| Het store-register | `<data dir>/openspec/stores/registry.yaml` | Nee — alleen deze machine |
| Werksets | `<data dir>/openspec/worksets/` | Nee — alleen deze machine |

`<data dir>` is `~/.local/share/openspec` op macOS en Linux (of
`$XDG_DATA_HOME/openspec` indien ingesteld), en `%LOCALAPPDATA%\openspec` op
Windows.

## Referentie

Exacte flags en JSON-structuren voor elke opdracht op deze pagina:
[CLI-referentie](../cli.md) (Stores, Doctor, Werkcontext, Persoonlijke
werksets) en het [agentcontract](../agent-contract.md).