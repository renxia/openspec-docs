# Concepten

Deze gids legt de kernideeën achter OpenSpec uit en hoe ze samenhangen. Voor praktisch gebruik, raadpleeg [Aan de slag](getting-started.md) en [Workflows](workflows.md).

## Filosofie

OpenSpec is gebouwd rond vier principes:

```
fluid not rigid         — no phase gates, work on what makes sense
iterative not waterfall — learn as you build, refine as you go
easy not complex        — lightweight setup, minimal ceremony
brownfield-first        — works with existing codebases, not just greenfield
```

### Waarom Deze Principes Belangrijk Zijn

**Vloeibaar, niet rigide.** Traditionele specificatiesystemen beperken je tot fasen: eerst plan je, dan implementeer je, dan ben je klaar. OpenSpec is flexibeler — je kunt artefacten in elke logische volgorde aanmaken die bij je werk past.

**Iteratief, niet waterval.** Vereisten veranderen. Inzicht verdiept. Wat aanvankelijk een goede aanpak leek, houdt misschien geen stand nadat je de codebase hebt gezien. OpenSpec omarmt deze realiteit.

**Eenvoudig, niet complex.** Sommige specificatiekaders vereisen uitgebreide configuratie, rigide formats of zware processen. OpenSpec staat niet in de weg. Initialiseer in seconden, begin direct met werken, pas alleen aan als dat nodig is.

**Brownfield-eerst.** Het meeste softwarewerk is niet vanaf nul opbouwen — het is het aanpassen van bestaande systemen. OpenSpec's op *deltas* gebaseerde aanpak maakt het eenvoudig om wijzigingen in bestaand gedrag te specificeren, in plaats van alleen nieuwe systemen te beschrijven.

## Het Overzicht

OpenSpec organiseert je werk in twee hoofdgebieden:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Bron van waarheid   │◄─────│  Voorgestelde wijzigingen     │   │
│   │  Hoe jouw systeem   │ merge│  Elke wijziging = één map     │   │
│   │  nu werkt           │      │  Bevat artifacts + deltas     │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** zijn de bron van waarheid — ze beschrijven hoe jouw systeem zich momenteel gedraagt.

**Changes** zijn voorgestelde wijzigingen — ze bevinden zich in afzonderlijke mappen totdat je klaar bent om ze samen te voegen.

Deze scheiding is essentieel. Je kunt parallel aan meerdere wijzigingen werken zonder conflicten. Je kunt een wijziging beoordelen voordat deze de hoofdspecs beïnvloedt. En wanneer je een wijziging archiveert, worden de deltas netjes samengevoegd met de bron van waarheid.

## Coördinatiewerkruimten

Ondersteuning voor werkruimten is in bèta. Het onderstaande lokaal-weergavemodel is de huidige richting, maar externe automatisering, integraties en langlopende workflows moeten het gedrag van commando's, statusbestanden en JSON-uitvoer nog steeds als in ontwikkeling beschouwen.

De onderstaande commando's bieden de eerste installatieprocedure voor het openen van lokale weergaven over gekoppelde repositories of mappen.

OpenSpec-projecten die lokaal in een repository staan, zijn de juiste standaard wanneer één repository de planning, implementatie en archiveringsstroom beheert. Sommige werkzaamheden overspannen meerdere repositories of mappen. Voor dat geval is een OpenSpec-coördinatiewerkruimte een machine-lokale weergave die gekoppelde paden, opener-status en agentconfiguratie bij elkaar houdt.

Het mentale model van de werkruimte is:

```text
workspace     = private lokale weergave over context stores, initiatieven, repos en mappen
context store = duurzame gedeelde context container
initiatief    = duurzame coördinatie context binnen een context store
link          = een stabiele naam voor een repo of map die de werkruimte lokaal kan oplossen
wijziging     = één gepland stuk werk; implementatie behoort toe aan de eigenaar repository
```

Een werkruimte heeft een andere vorm dan een project dat lokaal in een repository staat:

```text
getGlobalDataDir()/workspaces/<workspace-name>/
├── workspace.yaml                 # Private lokale weergave registratie
├── AGENTS.md                      # Gegenereerde runtime instructies
└── <workspace-name>.code-workspace # Gegenereerd editor werkruimtebestand
```

OpenSpec-status die lokaal in een repository staat, behoudt de bestaande structuur:

```text
repo-root/
└── openspec/
    ├── specs/
    └── changes/
```

Dat onderscheid is belangrijk. De werkruimtemap is een lokaal coördinatieoppervlak voor het openen en inspecteren van gekoppelde repositories of mappen. De `openspec/`-map van elke repository blijft de thuisbasis voor repository-specifieke specs, lokaal in de repository bewaarde wijzigingen en implementatieplanning. Gebruikers hoeven geen lokaal `openspec init` in een werkruimtemap uit te voeren.

Stabiele link-namen zijn de manier waarop een werkruimte verwijst naar repositories en mappen. De privé werkruimteregistratie bewaart namen zoals `api`, `web` of `checkout` en koppelt deze aan de lokale paden van deze runtime.

```yaml
# workspace.yaml
version: 1
name: platform
context: null
links:
  api: /repos/api
  web: /repos/web
```

Wanneer een werkruimte een initiatief opent, registreert `context` de geselecteerde context-store binding en initiatief-id. Door het register geselecteerde stores blijven draagbaar via id; via pad geselecteerde stores bewaren bewust het runtime-lokale pad, omdat `workspace.yaml` privé lokale status is.

```yaml
context:
  kind: initiative
  store:
    id: platform
    selector:
      kind: registry
      id: platform
  initiative:
    id: billing-launch
```

Gekoppelde paden kunnen volledige repositories, mappen in een grote monorepo of andere bestaande mappen zijn. Ze hebben geen lokaal in de repository bewaarde `openspec/`-status nodig voordat ze kunnen deelnemen aan werkruimteplanning. Latere implementatie-, verificatie- of archiveringsworkflows kunnen meer gereedheid van de repository vereisen, maar de zichtbaarheid voor planning begint met de link.

```text
multi-repo:
  api      -> /repos/api
  web      -> /repos/web

grote monorepo:
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

Beheerde werkruimten bevinden zich onder de standaard OpenSpec datamap:

```text
getGlobalDataDir()/workspaces
```

Dat betekent `$XDG_DATA_HOME/openspec/workspaces` wanneer `XDG_DATA_HOME` is ingesteld, `~/.local/share/openspec/workspaces` bij Unix-achtige terugval en `%LOCALAPPDATA%\openspec\workspaces` bij native Windows-terugval. Native Windows-shells, PowerShell en WSL2 bewaren elk de padtekenreeksen voor de runtime die OpenSpec uitvoert. Dit fundament vertaalt niet tussen `D:\repo`, `/mnt/d/repo` en UNC WSL-paden.

OpenSpec kan nog steeds oudere bèta werkruimte-rootbestanden als compatibiliteitsinvoer lezen, maar beheerde werkruimten gebruiken nu het bovenstaande `workspace.yaml`-rootrecord. De werkruimtemap blijft gezaghebbend voor zijn eigen privé lokale weergave.

Werkruimtezichtbaarheid is geen wijzigingstoewijzing. Stel een werkruimte in wanneer OpenSpec moet weten welke repositories of mappen relevant zijn; maak later een wijziging aan wanneer je klaar bent om een functie, correctie, project of ander stuk werk te plannen.

Nuttige commando's:

```bash
# Begeleide installatie
openspec workspace setup

# Automatiseringsvriendelijke installatie
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli

# Bekijk bekende werkruimten uit het lokale register
openspec workspace list
openspec workspace ls

# Koppelingen toevoegen of herstellen voor de geselecteerde werkruimte
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Controleer wat deze machine kan oplossen
openspec workspace doctor
openspec workspace doctor --workspace platform

# Werkruimte-lokale instructies en agentvaardigheden vernieuwen
openspec workspace update
openspec workspace update --workspace platform --tools codex,claude

# Open de gekoppelde werkset
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor

# Open een initiatief als een lokale werkruimteweergave
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative billing-launch --store-path /repos/platform-context
```

`workspace setup` maakt altijd de werkruimte aan op de standaard werkruimtelocatie, registreert deze in het lokale register, toont de werkruimtelocatie en vereist ten minste één gekoppelde repository of map. Interactieve installatie vraagt naar een voorkeursopener en kan OpenSpec-vaardigheden voor geselecteerde agents installeren. Niet-interactieve installatie slaat er slechts één op wanneer `--opener codex-cli`, `--opener claude`, `--opener github-copilot` of `--opener editor` is opgegeven.

Werkruimtevaardigheden worden alleen in de werkruimte-root geïnstalleerd. Het actieve globale profiel selecteert welke workflowvaardigheden worden gegenereerd; `--tools` selecteert welke agents ze ontvangen. Werkruimte-installatie en -update maken geen slashcommandobestanden aan, zelfs niet wanneer globale levering commando's bevat. Voer `openspec workspace update` uit om werkruimte-lokale instructies te vernieuwen en beheerde werkruimte-lokale vaardigheidsmappen toe te voegen, te vernieuwen of te verwijderen zonder gekoppelde repositories of mappen te bewerken.

OpenSpec onderhoudt ook werkruimte-root open-bestanden: een door OpenSpec beheerd instructieblok in `AGENTS.md` en een machine-lokaal `<workspace-name>.code-workspace`-bestand voor VS Code en GitHub Copilot-in-VS-Code opens. Een beheerde werkruimte is geen repository, dus OpenSpec maakt geen standaard werkruimte `.gitignore` of een standaard werkruimte-niveau `changes/`-map aan.

Het onderhouden VS Code-werkruimtebestand vermeldt eerst geldige gekoppelde repositories of mappen, daarna het initiatiefcontext wanneer dit is gekoppeld, en daarna de OpenSpec-werkruimtebestanden. VS Code geeft die items weer als een multi-root werkruimte.

`workspace open` opent de gekoppelde werkset met de opgeslagen voorkeursopener tenzij `--agent <tool>` of `--editor` is doorgegeven voor die ene sessie. Het doorgeven van beide opener-overrides is een fout. Het openen van de werkruimte-root maakt gekoppelde repositories en mappen zichtbaar voor verkenning en context; implementatie begint nadat de gebruiker er expliciet om vraagt.

`workspace link` en `workspace relink` registreren alleen bestaande mappen; ze maken, kopiëren, verplaatsen, initialiseren of bewerken de gekoppelde repository of map niet. Na een succesvolle koppeling of herkoppeling vernieuwt OpenSpec de beheerde instructies en het VS Code-werkruimtebestand.

Werkruimtecommando's die één werkruimte nodig hebben, kunnen vanuit elke locatie worden uitgevoerd met `--workspace <name>`. Als je ze uitvoert in een werkruimtemap of submap, gebruikt OpenSpec die huidige werkruimte. Als er meerdere bekende werkruimten beschikbaar zijn en je geen `--workspace <name>` doorgeeft, tonen menselijke commando's een kiezer; `--json` en `--no-interactive` mislukken met een gestructureerde statusfout in plaats van te vragen.

Directe werkruimtecommando's ondersteunen JSON-uitvoer voor scripts. JSON-antwoorden bewaren primaire gegevens in `workspace`, `workspaces` of `link` objecten en rapporteren waarschuwingen of fouten in `status` arrays. Gezonde objecten gebruiken `status: []`.

## Specs

Specs beschrijven het gedrag van jouw systeem met behulp van gestructureerde vereisten en scenario's.

### Structuur

```
openspec/specs/
├── auth/
│   └── spec.md           # Authenticatiegedrag
├── payments/
│   └── spec.md           # Betalingsverwerking
├── notifications/
│   └── spec.md           # Notificatiesysteem
└── ui/
    └── spec.md           # UI-gedrag en thema's
```

Organiseer specs per domein — logische groeperingen die zinvol zijn voor jouw systeem. Veelgebruikte patronen:

- **Per functiegebied**: `auth/`, `payments/`, `search/`
- **Per component**: `api/`, `frontend/`, `workers/`
- **Per begrensde context**: `ordering/`, `fulfillment/`, `inventory/`

### Spec-indeling

Een spec bevat vereisten, en elke vereiste heeft scenario's:

```markdown
# Authenticatie Specificatie

## Doel
Authenticatie- en sessiebeheer voor de applicatie.

## Vereisten

### Vereiste: Gebruikersauthenticatie
Het systeem MOET een JWT-token uitgeven bij een succesvolle login.

#### Scenario: Geldige inloggegevens
- GEGEVEN een gebruiker met geldige inloggegevens
- WANNEER de gebruiker het loginformulier indient
- DAN wordt een JWT-token geretourneerd
- EN wordt de gebruiker doorgestuurd naar het dashboard

#### Scenario: Ongeldige inloggegevens
- GEGEVEN ongeldige inloggegevens
- WANNEER de gebruiker het loginformulier indient
- DAN wordt een foutmelding weergegeven
- EN wordt er geen token uitgegeven

### Vereiste: Sessieverloop
Het systeem MOET sessies verlopen na 30 minuten inactiviteit.

#### Scenario: Inactiviteitstimeout
- GEGEVEN een geauthenticeerde sessie
- WANNEER er 30 minuten verstrijken zonder activiteit
- DAN wordt de sessie ongeldig verklaard
- EN moet de gebruiker zich opnieuw authenticeren
```

**Sleutelelementen:**

| Element | Doel |
|---------|------|
| `## Doel` | Hoog niveau beschrijving van het domein van deze spec |
| `### Vereiste:` | Een specifiek gedrag dat het systeem moet hebben |
| `#### Scenario:` | Een concreet voorbeeld van de vereiste in actie |
| SHALL/MUST/SHOULD | RFC 2119 sleutelwoorden die de sterkte van de vereiste aangeven |

### Waarom Specs op deze manier structureren

**Vereisten zijn het "wat"** — ze geven aan wat het systeem moet doen zonder de implementatie te specificeren.

**Scenario's zijn het "wanneer"** — ze bieden concrete voorbeelden die geverifieerd kunnen worden. Goede scenario's:
- Zijn testbaar (je zou er een geautomatiseerde test voor kunnen schrijven)
- Dekken zowel het happy path als randgevallen
- Gebruiken Gegeven/Wanneer/Dan of een vergelijkbaar gestructureerd formaat

**RFC 2119 sleutelwoorden** (SHALL, MUST, SHOULD, MAY) communiceren intentie:
- **MUST/SHALL** — absolute vereiste
- **SHOULD** — aanbevolen, maar er zijn uitzonderingen
- **MAY** — optioneel

### Wat een Spec is (en niet is)

Een spec is een **gedragscontract**, geen implementatieplan.

Goede spec-inhoud:
- Waarneembaar gedrag waar gebruikers of downstream-systemen op vertrouwen
- Invoer, uitvoer en foutcondities
- Externe beperkingen (beveiliging, privacy, betrouwbaarheid, compatibiliteit)
- Scenario's die getest of expliciet gevalideerd kunnen worden

Vermijd in specs:
- Interne klasse/functienamen
- Bibliotheken- of frameworkkeuzes
- Stapsgewijze implementatiedetails
- Gedetailleerde uitvoeringsplannen (die behoren thuis in `design.md` of `tasks.md`)

Snelle test:
- Als de implementatie kan veranderen zonder het extern zichtbare gedrag te veranderen, hoort het waarschijnlijk niet thuis in de spec.

### Houd het lichtgewicht: Progressieve strengheid

OpenSpec streeft ernaar bureaucratie te vermijden. Gebruik het lichtste niveau dat de wijziging nog steeds verifieerbaar maakt.

**Lite spec (standaard):**
- Korte gedragsgerichte vereisten
- Duidelijke scope en non-goals
- Enkele concrete acceptatiecontroles

**Volledige spec (voor hoger risico):**
- Cross-team of cross-repo wijzigingen
- API/contractwijzigingen, migraties, beveiligings-/privacykwesties
- Wijzigingen waar ambiguïteit waarschijnlijk kostbare herwerking veroorzaakt

De meeste wijzigingen moeten in de Lite-modus blijven.

### Mens + Agent Samenwerking

In veel teams verkennen mensen en ontwerpen agents artifacts. De beoogde cyclus is:

1. Mens levert intentie, context en beperkingen.
2. Agent zet dit om in gedragsgerichte vereisten en scenario's.
3. Agent houdt implementatiedetails in `design.md` en `tasks.md`, niet in `spec.md`.
4. Validatie bevestigt structuur en duidelijkheid vóór implementatie.

Dit houdt specs leesbaar voor mensen en consistent voor agents.

## Wijzigingen

Een wijziging is een voorgestelde aanpassing aan uw systeem, verpakt als een map met alles wat nodig is om het te begrijpen en te implementeren.

### Structuur van een wijziging

```
openspec/changes/add-dark-mode/
├── proposal.md           # Waarom en wat
├── design.md             # Hoe (technische benadering)
├── tasks.md              # Implementatielijst
├── .openspec.yaml        # Wijzigingsmetadata (optioneel)
└── specs/                # Delta-specificaties
    └── ui/
        └── spec.md       # Wat er wijzigt in ui/spec.md
```

Elke wijziging is zelfstandig. Het bevat:
- **Artefacten** — documenten die de intentie, het ontwerp en de taken vastleggen
- **Delta-specificaties** — specificaties voor wat wordt toegevoegd, gewijzigd of verwijderd
- **Metadata** — optionele configuratie voor deze specifieke wijziging

### Waarom wijzigingen mappen zijn

Het verpakken van een wijziging als een map heeft verschillende voordelen:

1. **Alles bij elkaar.** Voorstel, ontwerp, taken en specificaties bevinden zich op één plek. Niet zoeken naar verschillende locaties.

2. **Parallel werken.** Meerdere wijzigingen kunnen tegelijkertijd bestaan zonder conflicten. Werk aan `add-dark-mode` terwijl `fix-auth-bug` ook in uitvoering is.

3. **Schone geschiedenis.** Wanneer gearchiveerd, verplaatsen wijzigingen naar `changes/archive/` met hun volledige context bewaard. U kunt terugkijken en begrijpen niet alleen wat er veranderde, maar ook waarom.

4. **Review-vriendelijk.** Een wijzigingsmap is eenvoudig te reviewen — open het, lees het voorstel, controleer het ontwerp, bekijk de specificatiedelta's.

## Artefacten

Artefacten zijn de documenten binnen een wijziging die het werk begeleiden.

### De artefactstroom

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
  waarom          wat            hoe          stappen
 + reikwijdte   wijzigingen    benadering   te ondernemen
```

Artefacten bouwen op elkaar voort. Elk artefact biedt context voor het volgende.

### Soorten artefacten

#### Voorstel (`proposal.md`)

Het voorstel legt op hoog niveau de **intentie**, **reikwijdte** en **benadering** vast.

```markdown
# Voorstel: Donkere modus toevoegen
```

## Intent
Gebruikers hebben een donkere modus-optie gevraagd om oogvermoeidheid te verminderen
tijdens gebruik 's nachts en om systeeminstellingen te volgen.

## Scope
Binnen scope:
- Thema-wisselaar in instellingen
- Detectie van systeemvoorkeur
- Voorkeur bewaren in localStorage

Buiten scope:
- Aangepaste kleurenthema's (toekomstig werk)
- Pagina-specifieke thema-overrides

## Aanpak
Gebruik CSS aangepaste eigenschappen voor theming met een React context
voor statusbeheer. Detecteer systeemvoorkeur bij eerste laden,
sta handmatige overschrijving toe.
```

**Wanneer het voorstel bijwerken:**
- Scope verandert (verkleint of vergroot)
- Intentie wordt verduidelijkt (beter begrip van het probleem)
- Aanpak verschuift fundamenteel

#### Specificaties (delta specificaties in `specs/`)

Delta specificaties beschrijven **wat er verandert** ten opzichte van de huidige specificaties. Zie [Delta Specificaties](#delta-specs) hieronder.

#### Ontwerp (`design.md`)

Het ontwerp legt de **technische aanpak** en **architectuurbeslissingen** vast.

````markdown
# Ontwerp: Donkere Modus Toevoegen

## Technische Aanpak
Thema-status beheerd via React Context om prop drilling te vermijden.
CSS aangepaste eigenschappen maken runtime wisseling mogelijk zonder class-toggling.

## Architectuurbeslissingen

### Beslissing: Context boven Redux
Gebruik React Context voor thema-status omdat:
- Eenvoudige binaire status (licht/donker)
- Geen complexe statusovergangen
- Voorkomt het toevoegen van een Redux-afhankelijkheid

### Beslissing: CSS Aangepaste Eigenschappen
Gebruik CSS variabelen in plaats van CSS-in-JS omdat:
- Werkt met bestaande stylesheet
- Geen runtime overhead
- Browser-native oplossing

## Datastroom
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variabelen (toegepast op :root)
```

## Bestandswijzigingen
- `src/contexts/ThemeContext.tsx` (nieuw)
- `src/components/ThemeToggle.tsx` (nieuw)
- `src/styles/globals.css` (gewijzigd)
````

**Wanneer het ontwerp bijwerken:**
- Implementatie onthult dat de aanpak niet werkt
- Beter oplossing ontdekt
- Afhankelijkheden of beperkingen veranderen

#### Taken (`tasks.md`)

Taken zijn de **implementatielijst** — concrete stappen met selectievakjes.

```markdown
# Taken

## 1. Thema-infrastructuur
- [ ] 1.1 Maak ThemeContext met lichte/donkere status
- [ ] 1.2 Voeg CSS aangepaste eigenschappen toe voor kleuren
- [ ] 1.3 Implementeer localStorage-persistentie
- [ ] 1.4 Voeg systeemvoorkeur-detectie toe

## 2. UI-componenten
- [ ] 2.1 Maak ThemeToggle-component
- [ ] 2.2 Voeg wisselaar toe aan instellingenpagina
- [ ] 2.3 Werk Header bij om snelle wisselaar op te nemen

## 3. Styling
- [ ] 3.1 Definieer kleurenpalet donker thema
- [ ] 3.2 Werk componenten bij om CSS-variabelen te gebruiken
- [ ] 3.3 Test contrastverhoudingen voor toegankelijkheid
```

**Best practices voor taken:**
- Groep gerelateerde taken onder koppen
- Gebruik hiërarchische nummering (1.1, 1.2, etc.)
- Houd taken klein genoeg om in één sessie te voltooien
- Vink taken af na voltooiing

## Delta Specificaties

Delta specificaties zijn het sleutelconcept dat OpenSpec bruikbaar maakt voor brownfield-ontwikkeling. Ze beschrijven **wat er verandert** in plaats van de volledige specificatie te herhalen.

### Het Formaat

```markdown
# Delta voor Authenticatie

## TOEGEVOEGDE Vereisten

### Vereiste: Tweefactor-authenticatie
Het systeem MOET TOTP-gebaseerde tweefactor-authenticatie ondersteunen.

#### Scenario: 2FA-inschrijving
- GEGEVEN een gebruiker zonder 2FA ingeschakeld
- WANNEER de gebruiker 2FA inschakelt in instellingen
- DAN wordt een QR-code weergegeven voor de instelling van de authenticator-app
- EN de gebruiker moet verifiëren met een code vóór activering

#### Scenario: 2FA-login
- GEGEVEN een gebruiker met 2FA ingeschakeld
- WANNEER de gebruiker geldige inloggegevens indient
- DAN wordt een OTP-uitdaging gepresenteerd
- EN login wordt pas voltooid na een geldige OTP

## GEWIJZIGDE Vereisten

### Vereiste: Sessie-verloop
Het systeem MOET sessies laten verlopen na 15 minuten inactiviteit.
(Eerder: 30 minuten)

#### Scenario: Inactieve time-out
- GEGEVEN een geauthenticeerde sessie
- WANNEER 15 minuten verstrijken zonder activiteit
- DAN wordt de sessie ongeldig gemaakt

## VERWIJDERDE Vereisten

### Vereiste: Onthoud Mij
(Verouderd ten gunste van 2FA. Gebruikers moeten opnieuw authenticeren per sessie.)
```

### Delta-secties

| Sectie | Betekenis | Wat er gebeurt bij archiveren |
|---------|---------|------------------------|
| `## TOEGEVOEGDE Vereisten` | Nieuw gedrag | Toegevoegd aan hoofdspecificatie |
| `## GEWIJZIGDE Vereisten` | Gewijzigd gedrag | Vervangt bestaande vereiste |
| `## VERWIJDERDE Vereisten` | Verouderd gedrag | Verwijderd uit hoofdspecificatie |

### Waarom Deltas in plaats van Volledige Specificaties

**Duidelijkheid.** Een delta laat precies zien wat er verandert. Bij het lezen van een volledige specificatie zou je het mentaal moeten vergelijken met de huidige versie.

**Conflicten vermijden.** Twee wijzigingen kunnen hetzelfde specificatiebestand aanraken zonder conflicten, zolang ze verschillende vereisten wijzigen.

**Review-efficiëntie.** Beoordelaars zien de wijziging, niet de ongewijzigde context. Focus op wat belangrijk is.

**Brownfield-passend.** De meeste werkzaamheden wijzigen bestaand gedrag. Deltas maken modificaties first-class, geen bijzaak.

## Schema's

Schema's definiëren de artefacttypes en hun afhankelijkheden voor een workflow.

### Hoe Schema's Werken

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Geen afhankelijkheden, kan eerst gemaakt worden

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Heeft proposal nodig vóór het maken

  - id: design
    generates: design.md
    requires: [proposal]      # Kan parallel met specs gemaakt worden

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Heeft zowel specs als design nodig
```

**Artefacten vormen een afhankelijkheidsgrafiek:**

```
                    proposal
                   (root node)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (requires:                  (requires:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (requires:
                specs, design)
```

**Afhankelijkheden zijn mogelijkmakers, geen poorten.** Ze tonen wat mogelijk is om te maken, niet wat je vervolgens moet maken. Je kunt design overslaan als je het niet nodig hebt. Je kunt specs voor of na design maken — beide zijn alleen afhankelijk van proposal.

### Ingebouwde Schema's

**spec-driven** (standaard)

De standaardworkflow voor spec-driven ontwikkeling:

```
proposal → specs → design → tasks → implementeren
```

Het beste voor: De meeste feature-werkzaamheden waarbij je het eens wilt worden over specificaties vóór implementatie.

### Aangepaste Schema's

Maak aangepaste schema's voor de workflow van je team:

```bash
# Maak vanuit niets
openspec schema init research-first

# Of splits een bestaand schema
openspec schema fork spec-driven research-first
```

**Voorbeeld aangepast schema:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Doe eerst onderzoek

  - id: proposal
    generates: proposal.md
    requires: [research]   # Voorstel gebaseerd op onderzoek

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Sla specs/design over, ga direct naar taken
```

Zie [Aanpassing](customization.md) voor volledige details over het maken en gebruiken van aangepaste schema's.

## Archief

Archiveren voltooit een wijziging door de delta specificaties samen te voegen met de hoofdspecificaties en de wijziging te bewaren voor de geschiedenis.

### Wat er gebeurt bij Archiveren

```
Vóór archiveren:

openspec/
├── specs/
│   └── authenticatie/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── voeg-2fa-toe/               │
        ├── proposal.md              │
        ├── design.md                │ samenvoegen
        ├── tasks.md                 │
        └── specs/                   │
            └── authenticatie/       │
                └── spec.md ─────────┘


Na archiveren:

openspec/
├── specs/
│   └── authenticatie/
│       └── spec.md        # Bevat nu 2FA-vereisten
└── changes/
    └── archive/
        └── 2025-01-24-voeg-2fa-toe/    # Bewaard voor geschiedenis
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── authenticatie/
                    └── spec.md
```

### Het Archiveringsproces

1. **Deltas samenvoegen.** Elke delta specificatiesectie (TOEGEVOEGD/GEWIJZIGD/VERWIJDERD) wordt toegepast op de overeenkomstige hoofdspecificatie.

2. **Verplaatsen naar archief.** De wijzigingsmap verplaatst naar `changes/archive/` met een datumprefix voor chronologische ordening.

3. **Context bewaren.** Alle artefacten blijven intact in het archief. Je kunt altijd teruggrijpen om te begrijpen waarom een wijziging is doorgevoerd.

### Waarom Archiveren Belangrijk Is

**Schone status.** Actieve wijzigingen (`changes/`) tonen alleen werk in uitvoering. Voltooid werk verdwijnt uit beeld.

**Audittrail.** Het archief bewaart de volledige context van elke wijziging — niet alleen wat er veranderde, maar het voorstel dat uitlegt waarom, het ontwerp dat uitlegt hoe, en de taken die het uitgevoerde werk tonen.

**Specificatie-evolutie.** Specificaties groeien organisch naarmate wijzigingen worden gearchiveerd. Elk archief voegt zijn deltas samen, wat na verloop van tijd een uitgebreide specificatie opbouwt.

## Hoe Het Allemaal Samenwerkt

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC STROOM                                 │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (kern) of /opsx:new (uitgebreid)        │
│   │     WIJZIGING  │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. MAAK       │  /opsx:ff of /opsx:continue (uitgebreide workflow)      │
│   │     ARTEFACTEN │  Maakt proposal → specs → design → tasks                │
│   │                │  (gebaseerd op schema-afhankelijkheden)                  │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENTEER│ /opsx:apply                                            │
│   │     TAKEN      │  Werk taken af, vink ze af                              │
│   │                │◄──── Werk artefacten bij naarmate je leert               │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFIEER  │  /opsx:verify (optioneel)                               │
│   │     WERK       │  Controleer of implementatie specificaties overeenkomen │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVEER  │────►│  Delta specificaties samenvoegen in          │    │
│   │     WIJZIGING  │     │  hoofdspecificaties                          │    │
│   └────────────────┘     │  Wijzigingsmap verplaatst naar archive/      │    │
│                          │  Specificaties zijn nu de bijgewerkte        │    │
│                          │  bron van waarheid                           │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**De deugdzame cyclus:**

1. Specificaties beschrijven huidig gedrag
2. Wijzigingen stellen modificaties voor (als deltas)
3. Implementatie maakt de wijzigingen werkelijk
4. Archiveren voegt deltas samen in specificaties
5. Specificaties beschrijven nu het nieuwe gedrag
6. Volgende wijziging bouwt voort op bijgewerkte specificaties

## Woordenlijst

| Term | Definitie |
|------|------------|
| **Artefact** | Een document binnen een wijziging (voorstel, ontwerp, taken of delta-specificaties) |
| **Archiveren** | Het proces van het voltooien van een wijziging en het samenvoegen van de delta's in hoofdspecificaties |
| **Wijziging** | Een voorgestelde aanpassing aan het systeem, verpakt als een map met artefacten |
| **Delta-specificatie** | Een specificatie die wijzigingen (TOEGEVOEGD/GEWIJZIGD/VERWIJDERD) ten opzichte van huidige specificaties beschrijft |
| **Domein** | Een logische groepering voor specificaties (bijv. `auth/`, `payments/`) |
| **Vereiste** | Een specifiek gedrag dat het systeem moet hebben |
| **Scenario** | Een concreet voorbeeld van een vereiste, meestal in Gegeven/Wanneer/Dan-formaat |
| **Schema** | Een definitie van artefacttypen en hun afhankelijkheden |
| **Specificatie** | Een specificatie die het systeemgedrag beschrijft, met vereisten en scenario's |
| **Bron van waarheid** | De directory `openspec/specs/`, met het huidige overeengekomen gedrag |

## Volgende stappen

- [Aan de slag](getting-started.md) - Praktische eerste stappen
- [Workflows](workflows.md) - Veelvoorkomende patronen en wanneer ze te gebruiken
- [Commando's](commands.md) - Volledige commando-referentie
- [Aanpassing](customization.md) - Aangepaste schema's aanmaken en je project configureren