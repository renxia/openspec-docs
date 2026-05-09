# Concepten

Deze gids legt de kernideeën achter OpenSpec uit en hoe ze samenwerken. Voor praktisch gebruik, zie [Aan de slag](getting-started.md) en [Workflows](workflows.md).

## Filosofie

OpenSpec is gebouwd rond vier principes:

```
vloeiend niet rigide         — geen fasepoorten, werk aan wat logisch is
iteratief niet waterval — leer terwijl je bouwt, verfijn onderweg
eenvoudig niet complex        — lichtgewicht setup, minimale ceremonie
brownfield-first        — werkt met bestaande codebases, niet alleen greenfield
```

### Waarom Deze Principes Belangrijk Zijn

**Vloeiend niet rigide.** Traditionele specificatiesystemen beperken je tot fasen: eerst plan je, dan implementeer je, dan ben je klaar. OpenSpec is flexibeler — je kunt artefacten in elke logische volgorde voor je werk aanmaken.

**Iteratief niet waterval.** Vereisten veranderen. Inzicht verdiept. Wat aanvankelijk een goede aanpak leek, houdt misschien geen stand nadat je de codebase hebt gezien. OpenSpec omarmt deze realiteit.

**Eenvoudig niet complex.** Sommige specificatiekaders vereisen uitgebreide setup, rigide formaten of zware processen. OpenSpec staat niet in de weg. Initialiseer in seconden, begin direct met werken, pas alleen aan als dat nodig is.

**Brownfield-first.** Het meeste softwarewerk is niet vanaf nul bouwen — het is bestaande systemen aanpassen. De op delta's gebaseerde aanpak van OpenSpec maakt het eenvoudig om wijzigingen in bestaand gedrag te specificeren, in plaats van alleen nieuwe systemen te beschrijven.

## Het Overzicht

OpenSpec organiseert je werk in twee hoofdgebieden:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Bron van waarheid  │◄─────│  Voorgestelde wijzigingen     │   │
│   │  Hoe je systeem     │ merge│  Elke wijziging = één map     │   │
│   │  nu werkt           │      │  Bevat artefacten + deltas    │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** zijn de bron van waarheid — ze beschrijven hoe je systeem zich momenteel gedraagt.

**Changes** zijn voorgestelde wijzigingen — ze bevinden zich in afzonderlijke mappen totdat je klaar bent om ze samen te voegen.

Deze scheiding is essentieel. Je kunt parallel aan meerdere wijzigingen werken zonder conflicten. Je kunt een wijziging beoordelen voordat deze de hoofdspecs beïnvloedt. En wanneer je een wijziging archiveert, worden de deltas netjes samengevoegd met de bron van waarheid.

## Coördinatiewerkruimtes

Werkruimte-ondersteuning is momenteel in actieve ontwikkeling en nog niet klaar voor gebruik. Bouw geen externe automatisering, integraties of langlopende workflows op basis van het gedrag van werkruimtes; de commando's, statusbestanden en JSON-uitvoer kunnen op elk moment veranderen.

De onderstaande commando's bieden de eerste opzetstroom voor planning over gekoppelde repositories of mappen.

Repo-lokale OpenSpec-projecten zijn de juiste standaard wanneer één repository de planning, implementatie en archiveringsstroom beheert. Sommig werk overschrijdt meerdere repositories of mappen. Voor dat geval is een OpenSpec-coördinatiewerkruimte de duurzame planningsbasis.

Het mentale model van de werkruimte is:

```text
workspace = waar gerelateerde cross-repo wijzigingen leven
link      = een stabiele naam voor een repo of map waar de werkruimte tegen kan plannen
change    = één functie, fix, project of ander gepland stuk werk
```

Een werkruimte heeft een andere structuur dan een repo-lokaal project:

```text
workspace-folder/
├── changes/                       # Planning op werkruimteniveau
└── .openspec-workspace/
    ├── workspace.yaml             # Gedeelde werkruimte-identiteit en linknamen
    └── local.yaml                 # Lokale paden van deze machine
```

Repo-lokale OpenSpec-status behoudt de bestaande structuur:

```text
repo-root/
└── openspec/
    ├── specs/
    └── changes/
```

Dat onderscheid is belangrijk. De werkruimapmap is een coördinatieoppervlak voor planning over gekoppelde repositories of mappen. De `openspec/`-map van elke repository blijft de thuisbasis voor repo-eigen specs, repo-lokale wijzigingen en implementatieplanning. Gebruikers hoeven geen repo-lokaal `openspec init` uit te voeren in een werkruimapmap.

Stabiele linknamen zijn de manier waarop werkruimteplanning verwijst naar repositories en mappen. De gedeelde werkruimtestatus bewaart namen zoals `api`, `web` of `checkout`; elke machine koppelt die namen aan zijn eigen lokale paden in `.openspec-workspace/local.yaml`.

```yaml
# .openspec-workspace/workspace.yaml
version: 1
name: platform
links:
  api: {}
  web: {}
```

```yaml
# .openspec-workspace/local.yaml
version: 1
paths:
  api: /repos/api
  web: /repos/web
```

Door OpenSpec aangemaakte werkruimtes sluiten `.openspec-workspace/local.yaml` standaard uit van de draagbare samenwerkingsstatus. `.openspec-workspace/workspace.yaml` blijft draagbaar omdat het de werkruimtenaam en stabiele linknamen opslaat, niet de absolute checkoutpaden van een gebruiker.

Gekoppelde paden kunnen volledige repositories, mappen in een grote monorepo of andere bestaande mappen zijn. Ze hebben geen repo-lokale `openspec/`-status nodig voordat ze kunnen deelnemen aan werkruimteplanning. Latere implementatie-, verificatie- of archiveringsworkflows kunnen meer repo-gereedheid vereisen, maar de zichtbaarheid van de planning begint met de link.

```text
multi-repo:
  api      -> /repos/api
  web      -> /repos/web

large monorepo:
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

Beheerde werkruimtes bevinden zich onder de standaard OpenSpec-gegevensmap:

```text
getGlobalDataDir()/workspaces
```

Dat betekent `$XDG_DATA_HOME/openspec/workspaces` wanneer `XDG_DATA_HOME` is ingesteld, `~/.local/share/openspec/workspaces` als Unix-stijl terugvaloptie, en `%LOCALAPPDATA%\openspec\workspaces` als native Windows-terugvaloptie. Native Windows-shells, PowerShell en WSL2 bewaren elk de padtekenreeksen voor de runtime die OpenSpec uitvoert. Deze basis vertaalt niet tussen `D:\repo`, `/mnt/d/repo` en UNC WSL-paden.

OpenSpec houdt ook een machine-lokaal register bij op:

```text
getGlobalDataDir()/workspaces/registry.yaml
```

Het register koppelt werkruimtenamen aan werkruimtelocaties zodat latere globale commando's bekende werkruimtes van overal kunnen weergeven of selecteren. Het is alleen een index. Elke werkruimapmap blijft gezaghebbend voor zijn eigen `.openspec-workspace/workspace.yaml` en `.openspec-workspace/local.yaml`, dus verouderde registerrecords kunnen worden gerapporteerd en hersteld zonder de werkruimte zelf te herdefiniëren.

Werkruimtezichtbaarheid is geen wijzigingstoewijzing. Stel een werkruimte in wanneer OpenSpec moet weten welke repositories of mappen relevant zijn; maak later een wijziging aan wanneer je klaar bent om een functie, fix, project of ander stuk werk te plannen.

Handige commando's:

```bash
# Begeleide setup
openspec workspace setup

# Automatiseringsvriendelijke setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex

# Bekijk bekende werkruimtes vanuit het lokale register
openspec workspace list
openspec workspace ls

# Voeg links toe of herstel ze voor de geselecteerde werkruimte
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Controleer wat deze machine kan oplossen
openspec workspace doctor
openspec workspace doctor --workspace platform

# Open de gekoppelde werkset
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor
```

`workspace setup` maakt altijd de werkruimte aan op de standaard werkruimtelocatie, registreert deze in het lokale register, toont de werkruimtelocatie en vereist ten minste één gekoppelde repository of map. Interactieve setup vraagt om een voorkeursopener. Niet-interactieve setup slaat er slechts één op wanneer `--opener codex`, `--opener claude`, `--opener github-copilot` of `--opener editor` is opgegeven.

OpenSpec onderhoudt ook rootwerkruimte-openbestanden: een door OpenSpec beheerd guidance-blok in `AGENTS.md`, een machine-lokaal `<workspace-name>.code-workspace`-bestand voor VS Code en GitHub Copilot-in-VS-Code-opens, en een specifiek negeerregel voor dat onderhouden `.code-workspace`-bestand. Door gebruikers gemaakte `*.code-workspace`-bestanden blijven traceerbaar omdat de negeerregel alleen het onderhouden bestand target.

Het onderhouden VS Code-werkruimtebestand bevat de coördinatieroot als `.` plus geldige gekoppelde repositories of mappen als extra roots. VS Code geeft die items weer als een multi-root werkruimte.

`workspace open` opent de gekoppelde werkset met de opgeslagen voorkeursopener tenzij `--agent <tool>` of `--editor` is doorgegeven voor die ene sessie. Beide opener-overrides doorgeven is een fout. Rootwerkruimte-open maakt gekoppelde repositories en mappen zichtbaar voor verkenning en planning; implementatie begint nadat de gebruiker expliciet om implementatiewerk vraagt.

`workspace link` en `workspace relink` registreren alleen bestaande mappen; ze maken, kopiëren, verplaatsen, initialiseren of bewerken de gekoppelde repository of map niet. Na een succesvolle link of relink ververst OpenSpec het beheerde guidance, het VS Code-werkruimtebestand en de negeerregel.

Werkruimtecommando's die één werkruimte nodig hebben, kunnen van overal worden uitgevoerd met `--workspace <name>`. Als je ze uitvoert in een werkruimapmap of submap, gebruikt OpenSpec de huidige werkruimte. Als er meerdere bekende werkruimtes beschikbaar zijn en je geen `--workspace <name>` doorgeeft, tonen menselijke commando's een kiezer; `--json` en `--no-interactive` mislukken met een gestructureerde statusfout in plaats van een prompt.

Directe werkruimtecommando's ondersteunen JSON-uitvoer voor scripts. JSON-reacties bewaren primaire gegevens in `workspace`, `workspaces` of `link`-objecten en rapporteren waarschuwingen of fouten in `status`-arrays. Gezonde objecten gebruiken `status: []`.

## Specs

Specs beschrijven het gedrag van je systeem met behulp van gestructureerde vereisten en scenario's.

### Structuur

```
openspec/specs/
├── auth/
│   └── spec.md           # Authenticatiegedrag
├── payments/
│   └── spec.md           # Betalingsverwerking
├── notifications/
│   └── spec.md           # Meldingssysteem
└── ui/
    └── spec.md           # UI-gedrag en thema's
```

Organiseer specs per domein — logische groeperingen die zinvol zijn voor je systeem. Veelgebruikte patronen:

- **Per functiegebied**: `auth/`, `payments/`, `search/`
- **Per component**: `api/`, `frontend/`, `workers/`
- **Per begrensde context**: `ordering/`, `fulfillment/`, `inventory/`

### Spec-formaat

Een spec bevat vereisten, en elke vereiste heeft scenario's:

```markdown
# Auth Specification
```

## Doel
Authenticatie en sessiebeheer voor de applicatie.

## Eisen

### Eisen: Gebruikersauthenticatie
Het systeem MOET een JWT-token uitgeven bij een succesvolle aanmelding.

#### Scenario: Geldige inloggegevens
- GEGEVEN een gebruiker met geldige inloggegevens
- WANNEER de gebruiker het aanmeldformulier indient
- DAN wordt een JWT-token geretourneerd
- EN wordt de gebruiker doorgestuurd naar het dashboard

#### Scenario: Ongeldige inloggegevens
- GEGEVEN ongeldige inloggegevens
- WANNEER de gebruiker het aanmeldformulier indient
- DAN wordt een foutmelding weergegeven
- EN wordt er geen token uitgegeven

### Eisen: Sessieverval
Het systeem MOET sessies laten verlopen na 30 minuten inactiviteit.

#### Scenario: Inactiviteits-timeout
- GEGEVEN een geauthenticeerde sessie
- WANNEER er 30 minuten verstrijken zonder activiteit
- DAN wordt de sessie ongeldig gemaakt
- EN moet de gebruiker zich opnieuw authenticeren
```

**Kernelementen:**

| Element | Doel |
|---------|------|
| `## Purpose` | Overkoepelende beschrijving van het domein van deze specificatie |
| `### Requirement:` | Een specifiek gedrag dat het systeem moet vertonen |
| `#### Scenario:` | Een concreet voorbeeld van de eis in actie |
| SHALL/MUST/SHOULD | RFC 2119-sleutelwoorden die de sterkte van de eis aangeven |

### Waarom Specificaties op Deze Manier Structureren

**Eisen zijn het "wat"** — ze geven aan wat het systeem moet doen zonder de implementatie te specificeren.

**Scenario's zijn het "wanneer"** — ze bieden concrete voorbeelden die geverifieerd kunnen worden. Goede scenario's:
- Zijn testbaar (je zou er een geautomatiseerde test voor kunnen schrijven)
- Dekken zowel het happy path als randgevallen
- Gebruiken Gegeven/Wanneer/Dan of een vergelijkbaar gestructureerd formaat

**RFC 2119-sleutelwoorden** (SHALL, MUST, SHOULD, MAY) communiceren intentie:
- **MUST/SHALL** — absolute eis
- **SHOULD** — aanbevolen, maar er zijn uitzonderingen mogelijk
- **MAY** — optioneel

### Wat een Specificatie Is (en Niet Is)

Een specificatie is een **gedragscontract**, geen implementatieplan.

Goede specificatie-inhoud:
- Waarneembaar gedrag waar gebruikers of downstream-systemen op vertrouwen
- Invoer, uitvoer en foutcondities
- Externe beperkingen (beveiliging, privacy, betrouwbaarheid, compatibiliteit)
- Scenario's die getest of expliciet gevalideerd kunnen worden

Vermijd in specificaties:
- Interne klasse-/functienamen
- Bibliotheek- of frameworkkeuzes
- Stapsgewijze implementatiedetails
- Gedetailleerde uitvoeringsplannen (die horen thuis in `design.md` of `tasks.md`)

Snelle test:
- Als de implementatie kan veranderen zonder het extern zichtbare gedrag te veranderen, hoort het waarschijnlijk niet in de specificatie thuis.

### Houd het Lichtgewicht: Progressieve Nauwgezetheid

OpenSpec streeft ernaar bureaucratie te vermijden. Gebruik het lichtste niveau dat de verandering nog steeds verifieerbaar maakt.

**Lite-specificatie (standaard):**
- Korte, gedrag-gerichte eisen
- Duidelijke scope en non-goals
- Enkele concrete acceptatiecontroles

**Volledige specificatie (voor hoger risico):**
- Wijzigingen over teams of repositories heen
- API-/contractwijzigingen, migraties, beveiligings-/privacykwesties
- Wijzigingen waarbij ambiguïteit waarschijnlijk kostbare herwerking veroorzaakt

De meeste wijzigingen moeten in de Lite-modus blijven.

### Samenwerking Mens + Agent

In veel teams onderzoeken mensen en stellen agenten artefacten op. De beoogde cyclus is:

1. Mens levert intentie, context en beperkingen.
2. Agent zet dit om in gedrag-gerichte eisen en scenario's.
3. Agent houdt implementatiedetails in `design.md` en `tasks.md`, niet in `spec.md`.
4. Validatie bevestigt structuur en duidelijkheid vóór implementatie.

Dit houdt specificaties leesbaar voor mensen en consistent voor agenten.

## Wijzigingen

Een wijziging is een voorgestelde aanpassing aan uw systeem, verpakt als een map met alles wat nodig is om het te begrijpen en te implementeren.

### Structuur van een Wijziging

```
openspec/changes/add-dark-mode/
├── proposal.md           # Waarom en wat
├── design.md             # Hoe (technische aanpak)
├── tasks.md              # Implementatiechecklist
├── .openspec.yaml        # Wijzigingsmetadata (optioneel)
└── specs/                # Delta-specificaties
    └── ui/
        └── spec.md       # Wat er verandert in ui/spec.md
```

Elke wijziging is zelfstandig. Het bevat:
- **Artefacten** — documenten die de intentie, het ontwerp en de taken vastleggen
- **Delta-specificaties** — specificaties voor wat wordt toegevoegd, gewijzigd of verwijderd
- **Metadata** — optionele configuratie voor deze specifieke wijziging

### Waarom Wijzigingen Mappen Zijn

Het verpakken van een wijziging als map heeft verschillende voordelen:

1. **Alles bij elkaar.** Voorstel, ontwerp, taken en specificaties staan op één plek. Niet zoeken naar verschillende locaties.

2. **Parallel werk.** Meerdere wijzigingen kunnen tegelijkertijd bestaan zonder conflicten. Werk aan `add-dark-mode` terwijl `fix-auth-bug` ook in uitvoering is.

3. **Schone geschiedenis.** Bij archivering verplaatsen wijzigingen naar `changes/archive/` met hun volledige context bewaard. U kunt terugkijken en begrijpen niet alleen wat er veranderde, maar ook waarom.

4. **Review-vriendelijk.** Een wijzigingsmap is eenvoudig te beoordelen — open het, lees het voorstel, controleer het ontwerp, bekijk de specificatiedelta's.

## Artefacten

Artefacten zijn de documenten binnen een wijziging die het werk begeleiden.

### De Artefactstroom

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   waarom          wat           hoe          stappen
 + scope        veranderingen   aanpak      om te nemen
```

Artefacten bouwen op elkaar voort. Elk artefact biedt context voor het volgende.

### Artefacttypen

#### Voorstel (`proposal.md`)

Het voorstel legt op hoog niveau de **intentie**, **scope** en **aanpak** vast.

```markdown
# Voorstel: Donkere Modus Toevoegen

## Intentie
Gebruikers hebben een optie voor donkere modus gevraagd om oogvermoeidheid
te verminderen tijdens gebruik 's nachts en om systeemvoorkeuren te volgen.

## Scope
Binnen scope:
- Thema-schakelaar in instellingen
- Detectie van systeemvoorkeur
- Voorkeur opslaan in localStorage

Buiten scope:
- Aangepaste kleurthema's (toekomstig werk)
- Pagina-specifieke thema-overrides

## Aanpak
Gebruik CSS custom properties voor theming met een React context
voor statusbeheer. Detecteer systeemvoorkeur bij eerste laden,
sta handmatige overschrijving toe.
```

**Wanneer het voorstel bijwerken:**
- Scope verandert (verkleint of vergroot)
- Intentie wordt verduidelijkt (beter begrip van het probleem)
- Aanpak verandert fundamenteel

#### Specificaties (delta-specificaties in `specs/`)

Delta-specificaties beschrijven **wat er verandert** ten opzichte van de huidige specificaties. Zie [Delta-specificaties](#delta-specificaties) hieronder.

#### Ontwerp (`design.md`)

Het ontwerp legt de **technische aanpak** en **architectuurbeslissingen** vast.

````markdown
# Ontwerp: Donkere Modus Toevoegen

## Technische Aanpak
Thema-status beheerd via React Context om prop drilling te voorkomen.
CSS custom properties maken runtime-schakeling mogelijk zonder class-toggling.

## Architectuurbeslissingen

### Beslissing: Context boven Redux
Gebruik van React Context voor thema-status omdat:
- Eenvoudige binaire status (licht/donker)
- Geen complexe statusovergangen
- Voorkomt toevoegen van Redux-afhankelijkheid

### Beslissing: CSS Custom Properties
Gebruik van CSS-variabelen in plaats van CSS-in-JS omdat:
- Werkt met bestaand stylesheet
- Geen runtime-overhead
- Browser-native oplossing

## Gegevensstroom
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

Taken zijn de **implementatiechecklist** — concrete stappen met selectievakjes.

```markdown
# Taken

## 1. Themainfrastructuur
- [ ] 1.1 Maak ThemeContext met licht/donker-status
- [ ] 1.2 Voeg CSS custom properties toe voor kleuren
- [ ] 1.3 Implementeer localStorage-persistentie
- [ ] 1.4 Voeg systeemvoorkeurdetectie toe

## 2. UI-componenten
- [ ] 2.1 Maak ThemeToggle-component
- [ ] 2.2 Voeg schakelaar toe aan instellingenpagina
- [ ] 2.3 Werk Header bij om snelle schakelaar op te nemen

## 3. Opmaak
- [ ] 3.1 Definieer donker thema kleurenpalet
- [ ] 3.2 Werk componenten bij om CSS-variabelen te gebruiken
- [ ] 3.3 Test contrastverhoudingen voor toegankelijkheid
```

**Best practices voor taken:**
- Groep gerelateerde taken onder kopjes
- Gebruik hiërarchische nummering (1.1, 1.2, etc.)
- Houd taken klein genoeg om in één sessie te voltooien
- Vink taken af naarmate u ze voltooit

## Delta-specificaties

Delta-specificaties zijn het sleutelconcept dat OpenSpec bruikbaar maakt voor brownfield-ontwikkeling. Ze beschrijven **wat er verandert** in plaats van de volledige specificatie te herhalen.

### Het Formaat

```markdown
# Delta voor Auth

## TOEGEVOEGDE Vereisten

### Vereist: Twee-factor Authenticatie
Het systeem MOET TOTP-gebaseerde twee-factor authenticatie ondersteunen.

#### Scenario: 2FA-inschrijving
- GEGEVEN een gebruiker zonder ingeschakelde 2FA
- WANNEER de gebruiker 2FA inschakelt in instellingen
- DAN wordt een QR-code weergegeven voor authenticator-app-setup
- EN de gebruiker moet verifiëren met een code vóór activering

#### Scenario: 2FA-login
- GEGEVEN een gebruiker met ingeschakelde 2FA
- WANNEER de gebruiker geldige inloggegevens indient
- DAN wordt een OTP-uitdaging gepresenteerd
- EN login wordt pas voltooid na geldige OTP

## GEWIJZIGDE Vereisten

### Vereist: Sessieverval
Het systeem MOET sessies laten verlopen na 15 minuten inactiviteit.
(Eerder: 30 minuten)

#### Scenario: Inactieve timeout
- GEGEVEN een geauthenticeerde sessie
- WANNEER 15 minuten verstrijken zonder activiteit
- DAN wordt de sessie ongeldig gemaakt

## VERWIJDERDE Vereisten

### Vereist: Onthoud Mij
(Vervallen ten gunste van 2FA. Gebruikers moeten elke sessie opnieuw authenticeren.)
```

### Delta-secties

| Sectie | Betekenis | Wat gebeurt er bij archivering |
|--------|-----------|-------------------------------|
| `## TOEGEVOEGDE Vereisten` | Nieuw gedrag | Toegevoegd aan hoofdspecificatie |
| `## GEWIJZIGDE Vereisten` | Gewijzigd gedrag | Vervangt bestaande vereiste |
| `## VERWIJDERDE Vereisten` | Verouderd gedrag | Verwijderd uit hoofdspecificatie |

### Waarom Delta's in Plaats van Volledige Specificaties

**Duidelijkheid.** Een delta laat precies zien wat er verandert. Bij het lezen van een volledige specificatie zou u het mentaal moeten vergelijken met de huidige versie.

**Conflicten voorkomen.** Twee wijzigingen kunnen hetzelfde specificatiebestand aanraken zonder conflicten, zolang ze verschillende vereisten wijzigen.

**Review-efficiëntie.** Reviewers zien de wijziging, niet de ongewijzigde context. Focus op wat belangrijk is.

**Brownfield-compatibiliteit.** Het meeste werk wijzigt bestaand gedrag. Delta's maken modificaties eersteklas, geen bijzaak.

## Schema's

Schema's definiëren de artefacttypen en hun afhankelijkheden voor een werkstroom.

### Hoe Schema's Werken

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Geen afhankelijkheden, kan als eerste worden aangemaakt

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Heeft proposal nodig voordat het kan worden aangemaakt

  - id: design
    generates: design.md
    requires: [proposal]      # Kan parallel aan specs worden aangemaakt

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

**Afhankelijkheden zijn mogelijkmakers, geen poorten.** Ze tonen wat mogelijk is om aan te maken, niet wat je vervolgens moet aanmaken. Je kunt design overslaan als je het niet nodig hebt. Je kunt specs voor of na design aanmaken — beide zijn alleen afhankelijk van proposal.

### Ingebouwde Schema's

**spec-driven** (standaard)

De standaard werkstroom voor spec-driven ontwikkeling:

```
proposal → specs → design → tasks → implement
```

Het meest geschikt voor: De meeste functiewerkzaamheden waarbij je het eerst over specificaties eens wilt zijn vóór de implementatie.

### Aangepaste Schema's

Maak aangepaste schema's voor de werkstroom van je team:

```bash
# Maak vanuit het niets aan
openspec schema init research-first

# Of splits een bestaand schema
openspec schema fork spec-driven research-first
```

**Voorbeeld van een aangepast schema:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Doe eerst onderzoek

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal gebaseerd op onderzoek

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Sla specs/design over, ga direct naar taken
```

Zie [Aanpassing](customization.md) voor volledige details over het aanmaken en gebruiken van aangepaste schema's.

## Archiveren

Archiveren voltooit een wijziging door de delta-specificaties samen te voegen met de hoofdspecificaties en de wijziging voor de geschiedenis te bewaren.

### Wat Er Gebeurt Bij Het Archiveren

```
Voor archiveren:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ samenvoegen
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Na archiveren:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Bevat nu 2FA-vereisten
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Bewaard voor geschiedenis
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Het Archiveringsproces

1. **Delt's samenvoegen.** Elke delta-specificatiesectie (ADDED/MODIFIED/REMOVED) wordt toegepast op de overeenkomstige hoofdspecificatie.

2. **Naar archief verplaatsen.** De wijzigingsmap wordt verplaatst naar `changes/archive/` met een datumprefix voor chronologische ordening.

3. **Context bewaren.** Alle artefacten blijven intact in het archief. Je kunt altijd teruggaan om te begrijpen waarom een wijziging is doorgevoerd.

### Waarom Archiveren Belangrijk Is

**Schone status.** Actieve wijzigingen (`changes/`) tonen alleen werk in uitvoering. Voltooid werk wordt uit de weg geruimd.

**Audittrail.** Het archief bewaart de volledige context van elke wijziging — niet alleen wat er is veranderd, maar ook het proposal dat uitlegt waarom, het design dat uitlegt hoe, en de taken die het uitgevoerde werk tonen.

**Specificatie-evolutie.** Specificaties groeien organisch naarmate wijzigingen worden gearchiveerd. Elk archief voegt zijn delta's samen, waardoor in de loop van de tijd een uitgebreide specificatie wordt opgebouwd.

## Hoe Het Allemaal Samenkomt

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (kern) of /opsx:new (uitgebreid)         │
│   │     WIJZIGING  │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. MAAK       │  /opsx:ff of /opsx:continue (uitgebreide werkstroom)    │
│   │     ARTEFACTEN │  Maakt proposal → specs → design → tasks                │
│   │                │  (gebaseerd op schema-afhankelijkheden)                  │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENTEER│  /opsx:apply                                           │
│   │     TAKEN      │  Werk de taken af, vink ze af                           │
│   │                │◄──── Werk artefacten bij naarmate je leert               │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFIEER  │  /opsx:verify (optioneel)                               │
│   │     WERK       │  Controleer of implementatie overeenkomt met specs      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVEER  │────►│  Delta-specificaties worden samengevoegd     │    │
│   │     WIJZIGING  │     │  met hoofdspecificaties                      │    │
│   └────────────────┘     │  Wijzigingsmap verplaatst naar archief/      │    │
│                          │  Specificaties zijn nu de bijgewerkte        │    │
│                          │  bron van waarheid                           │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**De deugdzame cyclus:**

1. Specificaties beschrijven het huidige gedrag
2. Wijzigingen stellen modificaties voor (als delta's)
3. Implementatie maakt de wijzigingen werkelijk
4. Archiveren voegt delta's samen in specificaties
5. Specificaties beschrijven nu het nieuwe gedrag
6. De volgende wijziging bouwt voort op de bijgewerkte specificaties

## Woordenlijst

| Term | Definitie |
|------|-----------|
| **Artefact** | Een document binnen een wijziging (proposal, design, taken of delta-specificaties) |
| **Archiveren** | Het proces van het voltooien van een wijziging en het samenvoegen van de delta's met de hoofdspecificaties |
| **Wijziging** | Een voorgestelde modificatie aan het systeem, verpakt als een map met artefacten |
| **Delta-specificatie** | Een specificatie die wijzigingen (ADDED/MODIFIED/REMOVED) ten opzichte van de huidige specificaties beschrijft |
| **Domein** | Een logische groepering voor specificaties (bijv. `auth/`, `payments/`) |
| **Vereiste** | Een specifiek gedrag dat het systeem moet hebben |
| **Scenario** | Een concreet voorbeeld van een vereiste, typisch in Gegeven/Wanneer/Dan-formaat |
| **Schema** | Een definitie van artefacttypen en hun afhankelijkheden |
| **Specificatie** | Een specificatie die het systeemgedrag beschrijft, met vereisten en scenario's |
| **Bron van waarheid** | De map `openspec/specs/`, die het huidige overeengekomen gedrag bevat |

## Volgende Stappen

- [Aan de slag](getting-started.md) - Praktische eerste stappen
- [Werkstromen](workflows.md) - Veelvoorkomende patronen en wanneer elk te gebruiken
- [Commando's](commands.md) - Volledige commandoreferentie
- [Aanpassing](customization.md) - Maak aangepaste schema's en configureer je project