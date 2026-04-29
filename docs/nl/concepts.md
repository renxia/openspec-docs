# Concepten

Deze gids legt de kernideeën achter OpenSpec uit en hoe ze samenwerken. Voor praktisch gebruik zie [Aan de slag](getting-started.md) en [Workflows](workflows.md).

## Filosofie

OpenSpec is gebouwd rond vier principes:

```
vloeibaar niet rigide       — geen fasepoorten, werk aan wat zinvol is
iteratief niet waterval     — leer terwijl je bouwt, verfijn gaandeweg
eenvoudig niet complex      — lichtgewicht opzet, minimale ceremonie
brownfield-first            — werkt met bestaande codebases, niet alleen greenfield
```

### Waarom deze principes belangrijk zijn

**Vloeibaar niet rigide.** Traditionele specificatiesystemen dwingen je in fases: eerst plan je, dan implementeer je, dan ben je klaar. OpenSpec is flexibeler — je kunt artefacten in elke volgorde aanmaken die voor jouw werk zinvol is.

**Iteratief niet waterval.** Vereisten veranderen. Inzicht verdiept zich. Wat aanvankelijk een goede aanpak leek, blijkt misschien niet stand te houden nadat je de codebase hebt gezien. OpenSpec omarmt deze realiteit.

**Eenvoudig niet complex.** Sommige specificatiekaders vereisen uitgebreide opzet, rigide formaten of zware processen. OpenSpec staat niet in de weg. Initialiseer in seconden, begin direct met werken, pas alleen aan als dat nodig is.

**Brownfield-first.** Het meeste softwarewerk is niet vanaf nul bouwen — het is het aanpassen van bestaande systemen. De delta-gebaseerde aanpak van OpenSpec maakt het gemakkelijk om wijzigingen aan bestaand gedrag te specificeren, niet alleen om nieuwe systemen te beschrijven.

## Het Grote Geheel

OpenSpec organiseert je werk in twee hoofdgebieden:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Bron van de waarheid│◄─────│  Voorgestelde aanpassingen    │   │
│   │  Hoe je systeem     │ merge│  Elke wijziging = één map     │   │
│   │  momenteel werkt    │      │  Bevat artefacten + deltas    │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** zijn de bron van de waarheid — ze beschrijven hoe je systeem zich momenteel gedraagt.

**Wijzigingen** zijn voorgestelde aanpassingen — ze bevinden zich in aparte mappen totdat je klaar bent om ze samen te voegen.

Deze scheiding is essentieel. Je kunt parallel aan meerdere wijzigingen werken zonder conflicten. Je kunt een wijziging beoordelen voordat deze de hoofdspecs beïnvloedt. En wanneer je een wijziging archiveert, voegen de deltas zich schoon samen met de bron van de waarheid.

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
│   └── spec.md           # Meldingensysteem
└── ui/
    └── spec.md           # UI-gedrag en thema's
```

Organiseer specs op domein — logische groeperingen die zinvol zijn voor je systeem. Veelgebruikte patronen:

- **Op functiegebied**: `auth/`, `payments/`, `search/`
- **Op component**: `api/`, `frontend/`, `workers/`
- **Op begrensde context**: `ordering/`, `fulfillment/`, `inventory/`

### Specformaat

Een spec bevat vereisten, en elke vereiste heeft scenario's:

```markdown
# Auth Specificatie

## Doel
Authenticatie en sessiebeheer voor de applicatie.

## Vereisten

### Vereiste: Gebruikersauthenticatie
Het systeem ZAL een JWT-token uitgeven bij succesvolle aanmelding.

#### Scenario: Geldige referenties
- GEGEVEN een gebruiker met geldige referenties
- WANNEER de gebruiker het aanmeldingsformulier indient
- DAN wordt een JWT-token geretourneerd
- EN wordt de gebruiker doorgestuurd naar het dashboard

#### Scenario: Ongeldige referenties
- GEGEVEN ongeldige referenties
- WANNEER de gebruiker het aanmeldingsformulier indient
- DAN wordt een foutmelding weergegeven
- EN wordt er geen token uitgegeven

### Vereiste: Sessieverloop
Het systeem MOET sessies laten verlopen na 30 minuten inactiviteit.

#### Scenario: Inactieve time-out
- GEGEVEN een geauthenticeerde sessie
- WANNEER 30 minuten verstrijken zonder activiteit
- DAN wordt de sessie ongeldig verklaard
- EN moet de gebruiker opnieuw authenticeren
```

**Belangrijke elementen:**

| Element | Doel |
|---------|------|
| `## Doel` | Beschrijving op hoog niveau van het domein van deze spec |
| `### Vereiste:` | Een specifiek gedrag dat het systeem moet hebben |
| `#### Scenario:` | Een concreet voorbeeld van de vereiste in de praktijk |
| SHALL/MUST/SHOULD | RFC 2119-trefwoorden die de sterkte van de vereiste aangeven |

### Waarom Specs Op Deze Manier Gestructureerd Zijn

**Vereisten zijn het "wat"** — ze stellen vast wat het systeem moet doen zonder de implementatie te specificeren.

**Scenario's zijn het "wanneer"** — ze bieden concrete voorbeelden die geverifieerd kunnen worden. Goede scenario's:
- Zijn testbaar (je zou er een geautomatiseerde test voor kunnen schrijven)
- Bestrijken zowel het happy path als randgevallen
- Gebruiken Given/When/Then of een vergelijkbaar gestructureerd formaat

**RFC 2119-trefwoorden** (SHALL, MUST, SHOULD, MAY) communiceren de intentie:
- **MUST/SHALL** — absolute vereiste
- **SHOULD** — aanbevolen, maar uitzonderingen bestaan
- **MAY** — optioneel

### Wat een Spec Is (en Niet Is)

Een spec is een **gedragscontract**, geen implementatieplan.

Goede specinhoud:
- Observeerbaar gedrag waar gebruikers of downstream-systemen op vertrouwen
- Invoer, uitvoer en foutcondities
- Externe beperkingen (beveiliging, privacy, betrouwbaarheid, compatibiliteit)
- Scenario's die getest of expliciet gevalideerd kunnen worden

Vermijd in specs:
- Interne class-/functienamen
- Bibliotheek- of frameworkkeuzes
- Stap-voor-stap implementatiedetails
- Gedetailleerde uitvoeringsplannen (die horen thuis in `design.md` of `tasks.md`)

Snelle test:
- Als de implementatie kan veranderen zonder het extern zichtbare gedrag te wijzigen, hoort het waarschijnlijk niet in de spec.

### Houd Het Licht: Progressieve Nauwkeurigheid

OpenSpec streeft naar het vermijden van bureaucratie. Gebruik het lichtste niveau dat de wijziging nog steeds verifieerbaar maakt.

**Lite spec (standaard):**
- Korte, gedragsgerichte vereisten
- Duidelijke scope en niet-doelen
- Een paar concrete acceptatiechecks

**Volledige spec (voor hoger risico):**
- Wijzigingen over meerdere teams of repositories
- API-/contractwijzigingen, migraties, beveiligings-/privacykwesties
- Wijzigingen waarbij ambiguïteit waarschijnlijk leidt tot kostbare herwerking

De meeste wijzigingen moeten in de Lite-modus blijven.

### Samenwerking Mens + Agent

In veel teams verkennen mensen en maken artefacten aan agents. De bedoelde cyclus is:

1. De mens verschaft intentie, context en beperkingen.
2. De agent vertaalt dit naar gedragsgerichte vereisten en scenario's.
3. De agent houdt implementatiedetails in `design.md` en `tasks.md`, niet in `spec.md`.
4. Validatie bevestigt structuur en duidelijkheid vóór implementatie.

Dit houdt specs leesbaar voor mensen en consistent voor agents.

## Wijzigingen

Een wijziging is een voorgestelde aanpassing van je systeem, verpakt als een map met alles wat nodig is om deze te begrijpen en te implementeren.

### Wijzigingsstructuur

```
openspec/changes/add-dark-mode/
├── proposal.md           # Waarom en wat
├── design.md             # Hoe (technische aanpak)
├── tasks.md              # Implementatiechecklist
├── .openspec.yaml        # Wijzigingsmetadata (optioneel)
└── specs/                # Delta-specs
    └── ui/
        └── spec.md       # Wat er verandert in ui/spec.md
```

Elke wijziging is zelfvoorzienend. Het bevat:
- **Artefacten** — documenten die intentie, ontwerp en taken vastleggen
- **Delta-specs** — specificaties voor wat wordt toegevoegd, gewijzigd of verwijderd
- **Metadata** — optionele configuratie voor deze specifieke wijziging

### Waarom Wijzigingen Mappen Zijn

Het verpakken van een wijziging als een map heeft verschillende voordelen:

1. **Alles bij elkaar.** Voorstel, ontwerp, taken en specs bevinden zich op één plek. Geen zoeken op verschillende locaties.

2. **Parallel werk.** Meerdere wijzigingen kunnen tegelijk bestaan zonder conflicten. Werk aan `add-dark-mode` terwijl `fix-auth-bug` ook in uitvoering is.

3. **Schone geschiedenis.** Wanneer gearchiveerd, verhuizen wijzigingen naar `changes/archive/` met hun volledige context behouden. Je kunt terugkijken en begrijpen niet alleen wat er veranderde, maar ook waarom.

4. **Beoordelingsvriendelijk.** Een wijzigingsmap is eenvoudig te beoordelen — open het, lees het voorstel, bekijk het ontwerp, bekijk de delta-specs.

## Artefacten

Artefacten zijn de documenten binnen een wijziging die het werk sturen.

### De Artefactenstroom

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   waarom          wat           hoe          stappen
 + scope        wijzigingen   aanpak        om te nemen
```

Artefacten bouwen op elkaar voort. Elk artefact biedt context voor het volgende.

### Artefacttypen

#### Voorstel (`proposal.md`)

Het voorstel legt **intentie**, **scope** en **aanpak** vast op een hoog niveau.

```markdown
# Voorstel: Donkere Modus Toevoegen

## Intentie
Gebruikers hebben gevraagd om een donkere modus-optie om oogvermoeidheid te verminderen
tijdens nachtelijk gebruik en om systeemvoorkeuren te matchen.

## Scope
In scope:
- Thema-schakelaar in instellingen
- Detectie van systeemvoorkeur
- Voorkeur opslaan in localStorage

Buiten scope:
- Aangepaste kleurthema's (toekomstig werk)
- Per-pagina thema-overschrijvingen

## Aanpak
Gebruik CSS-aangepaste eigenschappen voor thematisering met een React-context
voor staatsbeheer. Detecteer systeemvoorkeur bij eerste belasting,
staat handmatige overschrijving toe.
```

**Wanneer het voorstel bijwerken:**
- Scope verandert (verkleinen of uitbreiden)
- Intentie wordt verduidelijkt (beter begrip van het probleem)
- Aanpak verschuift fundamenteel

#### Specs (delta-specs in `specs/`)

Delta-specs beschrijven **wat er verandert** ten opzichte van de huidige specs. Zie [Delta-specs](#delta-specs) hieronder.

#### Ontwerp (`design.md`)

Het ontwerp legt de **technische aanpak** en **architectuurbeslissingen** vast.

````markdown
# Ontwerp: Donkere Modus Toevoegen

## Technische Aanpak
Thema-stand beheerd via React Context om prop drilling te vermijden.
CSS-aangepaste eigenschappen maken runtime-schakeling mogelijk zonder class-toggling.

## Architectuurbeslissingen

### Beslissing: Context boven Redux
Gebruik van React Context voor themastatus, omdat:
- Eenvoudige binaire status (licht/donker)
- Geen complexe statustransities
- Voorkomt het toevoegen van een Redux-afhankelijkheid

### Beslissing: CSS-aangepaste eigenschappen
Gebruik van CSS-variabelen in plaats van CSS-in-JS, omdat:
- Werkt met het bestaande stylesheet
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
CSS-variabelen (toegepast op :root)
```

## Bestandswijzigingen
- `src/contexts/ThemeContext.tsx` (nieuw)
- `src/components/ThemeToggle.tsx` (nieuw)
- `src/styles/globals.css` (gewijzigd)
````

**Wanneer het ontwerp moet worden bijgewerkt:**
- De implementatie onthult dat de aanpak niet werkt
- Een betere oplossing wordt ontdekt
- Afhankelijkheden of beperkingen veranderen

#### Taken (`tasks.md`)

Taken zijn de **implementatiechecklijst** — concrete stappen met selectievakjes.

```markdown
# Taken

## 1. Thema-infrastructuur
- [ ] 1.1 Maak ThemeContext met light/dark status
- [ ] 1.2 Voeg CSS-aangepaste eigenschappen voor kleuren toe
- [ ] 1.3 Implementeer localStorage-persistentie
- [ ] 1.4 Voeg systeemvoorkeurdetectie toe

## 2. UI-componenten
- [ ] 2.1 Maak ThemeToggle-component
- [ ] 2.2 Voeg schakelaar toe aan instellingenpagina
- [ ] 2.3 Werk Header bij om snelle schakelaar op te nemen

## 3. Styling
- [ ] 3.1 Definieer donker thema-kleurenpalet
- [ ] 3.2 Werk componenten bij om CSS-variabelen te gebruiken
- [ ] 3.3 Test contrastverhoudingen voor toegankelijkheid
```

**Best practices voor taken:**
- Groepeer gerelateerde taken onder kopjes
- Gebruik hiërarchische nummering (1.1, 1.2, enz.)
- Houd taken klein genoeg om in één sessie af te ronden
- Markeer taken als voltooid naarmate je ze afwerkt

## Delta-specificaties

Delta-specificaties zijn het sleutelconcept dat OpenSpec geschikt maakt voor brownfield-ontwikkeling. Ze beschrijven **wat er verandert** in plaats van de volledige specificatie opnieuw te vermelden.

### Het Formaat

```markdown
# Delta voor Auth

## TOEGEVOEGDE Vereisten

### Vereiste: Tweefactorauthenticatie
Het systeem MOET TOTP-gebaseerde tweefactorauthenticatie ondersteunen.

#### Scenario: 2FA-inschrijving
- GEGEVEN een gebruiker zonder 2FA ingeschakeld
- WANNEER de gebruiker 2FA inschakelt in de instellingen
- DAN wordt een QR-code weergegeven voor de authenticator-app-installatie
- EN de gebruiker moet verifiëren met een code vóór activering

#### Scenario: 2FA-aanmelding
- GEGEVEN een gebruiker met 2FA ingeschakeld
- WANNEER de gebruiker geldige referenties indient
- DAN wordt een OTP-uitdaging gepresenteerd
- EN aanmelding is pas voltooid na een geldige OTP

## GEWIJZIGDE Vereisten

### Vereiste: Sessie-verloop
Het systeem MOET sessies verlaten na 15 minuten inactiviteit.
(Eerder: 30 minuten)

#### Scenario: Inactieve time-out
- GEGEVEN een geauthenticeerde sessie
- WANNEER 15 minuten verstrijken zonder activiteit
- DAN wordt de sessie ongeldig gemaakt

## VERWIJDERDE Vereisten

### Vereiste: Onthoud mij
(Gedeprecieerd ten gunste van 2FA. Gebruikers moeten zich bij elke sessie opnieuw authenticeren.)
```

### Delta-secties

| Sectie | Betekenis | Wat er bij archivering gebeurt |
|---------|---------|------------------------|
| `## TOEGEVOEGDE Vereisten` | Nieuw gedrag | Toegevoegd aan hoofdspecificatie |
| `## GEWIJZIGDE Vereisten` | Gewijzigd gedrag | Vervangt bestaande vereiste |
| `## VERWIJDERDE Vereisten` | Gedeprecieerd gedrag | Verwijderd uit hoofdspecificatie |

### Waarom deltas in plaats van volledige specificaties

**Duidelijkheid.** Een delta toont precies wat er verandert. Bij het lezen van een volledige specificatie moet je deze mentaal vergelijken met de huidige versie.

**Conflicten vermijden.** Twee wijzigingen kunnen hetzelfde specificatiebestand aanraken zonder conflicten, zolang ze verschillende vereisten wijzigen.

**Efficiënte beoordeling.** Beoordelaars zien de wijziging, niet de ongewijzigde context. Focus op wat belangrijk is.

**Brownfield-geschiktheid.** Het meeste werk wijzigt bestaand gedrag. Deltas maken modificaties tot een primaire functie, niet tot een bijzaak.

## Schemas

Schemas definiëren de artifacttypen en hun afhankelijkheden voor een workflow.

### Hoe schemas werken

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Geen afhankelijkheden, kan als eerste worden aangemaakt

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Heeft proposal nodig voordat het wordt aangemaakt

  - id: design
    generates: design.md
    requires: [proposal]      # Kan parallel met specs worden aangemaakt

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Heeft zowel specs als design nodig
```

**Artifacts vormen een afhankelijkheidsgraaf:**

```
                    proposal
                   (hoofdknooppunt)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (vereist:                  (vereist:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (vereist:
                specs, design)
```

**Afhankelijkheden zijn mogelijkheden, geen poorten.** Ze tonen wat er mogelijk is om aan te maken, niet wat je als volgende moet aanmaken. Je kunt design overslaan als je het niet nodig hebt. Je kunt specs voor of na design aanmaken — beide zijn alleen afhankelijk van proposal.

### Ingebouwde schemas

**spec-driven** (standaard)

De standaardworkflow voor specificatiegestuurde ontwikkeling:

```
proposal → specs → design → tasks → implement
```

Het beste voor: De meeste functiewerkzaamheden waarbij je het eens wilt worden over specificaties voordat je implementeert.

### Aangepaste schemas

Maak aangepaste schemas voor de workflow van je team:

```bash
# Vanaf nul aanmaken
openspec schema init research-first

# Of een bestaande forken
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
    requires: [research]   # Proposal gebaseerd op onderzoek

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Sla specs/design over, ga direct naar taken
```

Zie [Aanpassing](customization.md) voor volledige details over het aanmaken en gebruiken van aangepaste schemas.

## Archief

Archivering voltooit een wijziging door de delta-specificaties samen te voegen met de hoofdspecificaties en de wijziging te bewaren voor de geschiedenis.

### Wat er gebeurt bij archivering

```
Voor archivering:

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


Na archivering:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Bevat nu 2FA-vereisten
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Bewaard voor de geschiedenis
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Het archiveringsproces

1. **Deltas samenvoegen.** Elke delta-specsectie (TOEGEVOEGD/GEWIJZIGD/VERWIJDERD) wordt toegepast op de bijbehorende hoofdspecificatie.

2. **Verplaatsen naar archief.** De wijzigingsmap wordt verplaatst naar `changes/archive/` met een datumprefix voor chronologische volgorde.

3. **Context bewaren.** Alle artifacts blijven intact in het archief. Je kunt altijd terugkijken om te begrijpen waarom een wijziging is gemaakt.

### Waarom archivering belangrijk is

**Schone staat.** Actieve wijzigingen (`changes/`) tonen alleen lopend werk. Voltooid werk wordt uit de weg geruimd.

**Auditspoor.** Het archief bewaart de volledige context van elke wijziging — niet alleen wat er veranderde, maar ook de proposal die uitlegt waarom, de design die uitlegt hoe, en de taken die het uitgevoerde werk tonen.

**Specificatie-evolutie.** Specificaties groeien organisch naarmate wijzigingen worden gearchiveerd. Elke archivering voegt de deltas samen, waardoor in de loop van de tijd een uitgebreide specificatie wordt opgebouwd.

## Hoe het allemaal samenkomt

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC WORKFLOW                               │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (core) of /opsx:new (uitgebreid)         │
│   │     WIJZIGING  │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. ARTIFACTS  │  /opsx:ff of /opsx:continue (uitgebreide workflow)      │
│   │     AANMAKEN   │  Maakt proposal → specs → design → tasks aan            │
│   │                │  (gebaseerd op schema-afhankelijkheden)                 │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. TAKEN      │  /opsx:apply                                            │
│   │     UITVOEREN  │  Werk taken af, markeer ze als voltooid                 │
│   │                │◄──── Werk artifacts bij naarmate je leert                │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. WERK       │  /opsx:verify (optioneel)                               │
│   │     VERIFIËREN │  Controleer of implementatie overeenkomt met specs      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. WIJZIGING  │────►│  Delta-specificaties samenvoegen met         │    │
│   │     ARCHIVEREN │     │  hoofdspecificaties                          │    │
│   └────────────────┘     │  Wijzigingsmap verplaatsen naar archive/     │    │
│                          │  Specificaties zijn nu de bijgewerkte bron   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**De positieve cirkel:**

1. Specificaties beschrijven huidig gedrag
2. Wijzigingen stellen modificaties voor (als deltas)
3. Implementatie maakt de wijzigingen werkelijk
4. Archivering voegt deltas samen met specificaties
5. Specificaties beschrijven nu het nieuwe gedrag
6. De volgende wijziging bouwt voort op bijgewerkte specificaties

## Woordenlijst

| Term | Definitie |
|------|------------|
| **Artifact** | Een document binnen een wijziging (voorstel, ontwerp, taken of delta-specificaties) |
| **Archive** | Het proces van het voltooien van een wijziging en het samenvoegen van de deltas in de hoofdspecificaties |
| **Change** | Een voorgestelde aanpassing van het systeem, verpakt als een map met artifacts |
| **Delta spec** | Een specificatie die wijzigingen (TOEGEVOEGD/GEWIJZIGD/VERWIJDERD) beschrijft ten opzichte van de huidige specificaties |
| **Domain** | Een logische groepering voor specificaties (bijv. `auth/`, `payments/`) |
| **Requirement** | Een specifiek gedrag dat het systeem moet hebben |
| **Scenario** | Een concreet voorbeeld van een vereiste, doorgaans in Given/When/Then-formaat |
| **Schema** | Een definitie van artifacttypen en hun afhankelijkheden |
| **Spec** | Een specificatie die het systeemgedrag beschrijft, met vereisten en scenario's |
| **Source of truth** | De `openspec/specs/` map, met het huidige overeengekomen gedrag |

## Volgende stappen

- [Aan de slag](getting-started.md) - Praktische eerste stappen
- [Workflows](workflows.md) - Veelgebruikte patronen en wanneer elk te gebruiken
- [Commando's](commands.md) - Volledige commandoreferentie
- [Aanpassing](customization.md) - Maak aangepaste schema's en configureer uw project