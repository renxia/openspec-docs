# Concepten

Deze gids legt de kernideeën achter OpenSpec uit en hoe deze samenhangen. Voor praktisch gebruik zie [Getting Started](getting-started.md) en [Workflows](workflows.md).

## Filosofie

OpenSpec is gebouwd rond vier principes:

```
fluid not rigid         — geen faseringsdrempels (phase gates), werk aan wat zinvol is
iterative not waterfall — leer terwijl je bouwt, verfijn naarmate het vordert
easy not complex        — lichte opzet (lightweight setup), minimale ceremonie
brownfield-first        — werkt met bestaande codebase's, niet alleen met nieuwe systemen (greenfield)
```

### Waarom deze principes belangrijk zijn

**Vloeiend in plaats van rigide.** Traditionele specificatiesystemen dwingen je tot fasering: eerst plan je, dan implementeer je, en dan ben je klaar. OpenSpec is flexibeler — je kunt artefacten creëren in welke volgorde dan ook zinvol is voor je werk.

**Iteratief in plaats van waterfall.** Eisen veranderen. Het begrip wordt dieper. Wat aan het begin een goed idee leek, kan na het zien van de codebase niet meer kloppen. OpenSpec omarmt deze realiteit.

**Eenvoudig in plaats van complex.** Sommige specificatieframeworks vereisen uitgebreide opzet, rigide formaten of zware processen (heavyweight processes). OpenSpec staat niet in de weg. Initialiseer in seconden, begin direct met werken, pas aan alleen als je dat nodig hebt.

**Brownfield-eerst.** Het meeste softwarewerk is niet het bouwen vanaf nul — het is het aanpassen van bestaande systemen. De delta-gebaseerde aanpak van OpenSpec maakt het eenvoudig om wijzigingen in bestaand gedrag te specificeren, en niet alleen nieuwe systemen te beschrijven.

## Het Grote Plaatje

OpenSpec organiseert uw werk in twee hoofdgebieden:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Bron van waarheid  │◄─────│  Voorgestelde wijzigingen     │   │
│   │  Hoe uw systeem     │ merge│  Elke wijziging = één map    │   │
│   │  momenteel werkt   │      │  Bevat artefacten + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** zijn de bron van waarheid — ze beschrijven hoe uw systeem momenteel functioneert.

**Changes** zijn voorgestelde wijzigingen — deze bestaan in aparte mappen totdat u klaar bent om ze te mergen (integreren).

Deze scheiding is cruciaal. U kunt aan meerdere wijzigingen parallel werken zonder conflicten. U kunt een wijziging beoordelen voordat deze de hoofd-specs beïnvloedt. En wanneer u een wijziging archiveert, worden de deltas hiervan schoon geïntegreerd in de bron van waarheid.

## Specs

Specs beschrijven het gedrag van uw systeem met behulp van gestructureerde vereisten en scenario's.

### Structuur

```
openspec/specs/
├── auth/
│   └── spec.md           # Authenticatiegedrag
├── payments/
│   └── spec.md           # Betalingsverwerking
├── notifications/
│   └── spec.md           # Meldingen systeem
└── ui/
    └── spec.md           # UI gedrag en thema's
```

Organiseer specs per domein — logische groeperingen die zinvol zijn voor uw systeem. Veelgebruikte patronen:

- **Per functionaliteit**: `auth/`, `payments/`, `search/`
- **Per component**: `api/`, `frontend/`, `workers/`
- **Per afgebakend context**: `ordering/`, `fulfillment/`, `inventory/`

### Spec Formaat

Een spec bevat vereisten, en elke vereiste heeft scenario's:

```markdown
# Auth Specificatie

## Doel
Authenticatie en sessiebeheer voor de applicatie.

## Vereisten

### Vereiste: Gebruikersauthenticatie
Het systeem MOET een JWT-token uitgeven na succesvolle login.

#### Scenario: Geldige referenties
- GEGEVEN een gebruiker met geldige referenties
- WANNEER de gebruiker het loginformulier indient
- DAN wordt er een JWT-token teruggestuurd
- EN de gebruiker wordt doorgestuurd naar het dashboard

#### Scenario: Ongeldige referenties
- GEGEVEN ongeldige referenties
- WANNEER de gebruiker het loginformulier indient
- DAN wordt er een foutmelding weergegeven
- EN er wordt geen token uitgegeven

### Vereiste: Sessie-expiratie
Het systeem MOET sessies laten verlopen na 30 minuten inactiviteit.

#### Scenario: Inactiviteitslimiet
- GEGEVEN een geauthenticeerde sessie
- WANNEER 30 minuten verstrijken zonder activiteit
- DAN wordt de sessie ongeldig gemaakt
- EN de gebruiker moet opnieuw authenticeren
```

**Belangrijke elementen:**

| Element | Doel |
|---------|---------|
| `## Doel` | Hoog niveau beschrijving van het domein van deze spec |
| `### Vereiste:` | Een specifiek gedrag dat het systeem moet hebben |
| `#### Scenario:` | Een concreet voorbeeld van de vereiste in actie |
| SHALL/MUST/SHOULD | RFC 2119 trefwoorden die de sterkte van de vereiste aangeven |

### Waarom Specs Zo Gestructureerd Zijn

**Vereisten zijn het "wat"** — ze stellen wat het systeem moet doen zonder implementatie te specificeren.

**Scenario's zijn het "wanneer"** — ze bieden concrete voorbeelden die geverifieerd kunnen worden. Goede scenario's:
- Zijn testbaar (u kunt een geautomatiseerde test hiervoor schrijven)
- Dekken zowel de gelukkige paden als randgevallen
- Gebruiken Given/When/Then of een soortgelijk gestructureerd formaat

**RFC 2119 trefwoorden** (SHALL, MUST, SHOULD, MAY) communiceren intentie:
- **MUST/SHALL** — absolute vereiste
- **SHOULD** — aanbevolen, maar uitzonderingen bestaan
- **MAY** — optioneel

### Wat een Spec Is (en Niet Is)

Een spec is een **gedragscontract**, geen implementatieplan.

Goede specinhoud:
- Waarneembaar gedrag waarop gebruikers of downstream systemen vertrouwen
- Inputs, outputs en foutvoorwaarden
- Externe beperkingen (beveiliging, privacy, betrouwbaarheid, compatibiliteit)
- Scenario's die getest of expliciet gevalideerd kunnen worden

Vermijd in specs:
- Interne klas-/functienamen
- Keuzes van bibliotheken of frameworks
- Stap-voor-stap implementatiedetails
- Gedetailleerde uitvoeringsplannen (die behoren in `design.md` of `tasks.md`)

Snelle test:
- Als de implementatie kan veranderen zonder het extern zichtbare gedrag te wijzigen, behoort het waarschijnlijk niet tot de spec.

### Houd Het Lichtgewichtig: Progressieve Rigor

OpenSpec streeft ernaar bureaucratie te vermijden. Gebruik het lichtste niveau dat de wijziging nog steeds traceerbaar maakt.

**Lichte spec (standaard):**
- Korte, gedragsgerichte vereisten
- Duidelijk scope en niet-doelen
- Een paar concrete acceptatiecontroles

**Volledige spec (voor hoger risico):**
- Wijzigingen die meerdere teams of repositories betreffen
- API/contractwijzigingen, migraties, beveiligings-/privacyzorgen
- Wijzigingen waarbij ambiguïteit waarschijnlijk dure rework zal veroorzaken

De meeste wijzigingen moeten in de Lite modus blijven.

### Mensen + Agent Samenwerking

In veel teams verkennen mensen en schrijven agenten artefacten. De beoogde cyclus is:

1. Mens levert intentie, context en beperkingen.
2. Agent zet dit om naar gedragsgerichte vereisten en scenario's.
3. Agent houdt implementatiedetails in `design.md` en `tasks.md`, niet in `spec.md`.
4. Validatie bevestigt structuur en duidelijkheid voordat de implementatie plaatsvindt.

Dit zorgt ervoor dat specs leesbaar zijn voor mensen en consistent voor agenten.

## Changes

Een change is een voorgestelde wijziging aan uw systeem, verpakt als een map met alles wat nodig is om deze te begrijpen en te implementeren.

### Change Structuur

```
openspec/changes/add-dark-mode/
├── proposal.md           # Waarom en wat
├── design.md             # Hoe (technische aanpak)
├── tasks.md              # Implementatie checklist
├── .openspec.yaml        # Wijzigingsmetadata (optioneel)
└── specs/                # Delta specs
    └── ui/
        └── spec.md       # Wat er verandert in ui/spec.md
```

Elke wijziging is zelfstandig. Het bevat:
- **Artefacten** — documenten die intentie, ontwerp en taken vastleggen
- **Delta specs** — specificaties van wat er wordt toegevoegd, gewijzigd of verwijderd
- **Metadata** — optionele configuratie voor deze specifieke wijziging

### Waarom Changes Mappen Zijn

Het verpakken van een wijziging als een map heeft verschillende voordelen:

1. **Alles bij elkaar.** Het voorstel, het ontwerp, de taken en de specs staan op één plek. Geen hoeven zoeken naar verschillende locaties.

2. **Parallelle werking.** Meerdere wijzigingen kunnen tegelijkertijd bestaan zonder conflicten. Werk aan `add-dark-mode` terwijl `fix-auth-bug` ook bezig is.

3. **Schone geschiedenis.** Wanneer ze gearchiveerd worden, verhuizen de wijzigingen naar `changes/archive/` met hun volledige context behouden. U kunt terugkijken en begrijpen niet alleen wat er veranderd is, maar ook waarom.

4. **Beoordelbaar.** Een change map is eenvoudig te beoordelen — open deze, lees het voorstel, controleer het ontwerp, bekijk de spec deltas.

## Artefacten

Artefacten zijn de documenten binnen een wijziging die het werk begeleiden.

### De Artefact Flow

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   waarom            wat           hoe          stappen
 + scope        wijzigingen       aanpak      om uit te voeren
```

Artefacten bouwen op elkaar voort. Elk artefact biedt context voor het volgende.

### Artefacttypen

#### Proposal (`proposal.md`)

Het proposal legt **intentie**, **scope** en **benadering** op een hoog niveau vast.

```markdown
# Voorstel: Voeg Donkere Modus toe

## Intentie
Gebruikers hebben gevraagd om een donkere modus optie om oogbelasting te verminderen tijdens nachtgebruik en om overeen te komen met systeemvoorkeuren.

## Scope
In scope:
- Thema schakelaar in de instellingen
- Detectie van systeemvoorkeur
- Behoud van voorkeur in localStorage

Out of scope:
- Gepersonaliseerde kleurenschema's (toekomstig werk)
- Thema overrides per pagina

## Aanpak
Gebruik CSS custom properties voor theming met een React context voor staatbeheer. Detecteer systeemvoorkeur bij de eerste laadbeurt, sta handmatige override toe.
```

**Wanneer het proposal updaten:**
- Scope wijzigt (verkleinen of uitbreiden)
- Intentie wordt verduidelijkt (betere begrip van het probleem)
- Aanpak verschuift fundamenteel

#### Specs (delta specs in `specs/`)

Delta specs beschrijven **wat er verandert** ten opzichte van de huidige specs. Zie [Delta Specs](#delta-specs) hieronder.

#### Design (`design.md`)

Het design legt het **technische ontwerp** en **architectuurbeslissingen** vast.

````markdown
# Ontwerp: Voeg Donkere Modus toe

## Technisch Ontwerp
Thema status wordt beheerd via React Context om prop drilling te voorkomen. CSS custom properties maken runtime schakelen mogelijk zonder klasse-omschakeling.

## Architectuurbeslissingen

### Beslissing: Context boven Redux
Het gebruik van React Context voor themastatus omdat:
- Simpele binaire staat (licht/donker)
- Geen complexe staatsovergangen
- Voorkomt dat er een Redux afhankelijkheid wordt toegevoegd

### Beslissing: CSS Custom Properties
Het gebruik van CSS variabelen in plaats van CSS-in-JS omdat:
- Werkt met de bestaande stylesheet
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
CSS Variables (toegepast op :root)
```

## File Wijzigingen
- `src/contexts/ThemeContext.tsx` (nieuw)
- `src/components/ThemeToggle.tsx` (nieuw)
- `src/styles/globals.css` (gewijzigd)
````

**Wanneer het design updaten:**
- De implementatie onthult dat de aanpak niet werkt
- Een betere oplossing wordt ontdekt
- Afhankelijkheden of beperkingen veranderen

#### Tasks (`tasks.md`)

Tasks zijn de **implementatie checklist** — concrete stappen met selectievakjes.

```markdown
# Taken

## 1. Thema Infrastructuur
- [ ] 1.1 Creëer ThemeContext met licht/donker status
- [ ] 1.2 Voeg CSS custom properties toe voor kleuren
- [ ] 1.3 Implementeer localStorage persistentie
- [ ] 1.4 Voeg detectie van systeemvoorkeur toe

## 2. UI Componenten
- [ ] 2.1 Creëer ThemeToggle component
- [ ] 2.2 Voeg toggle toe aan de instellingenpagina
- [ ] 2.3 Update Header om snelle schakelaar te bevatten

## 3. Styling
- [ ] 3.1 Definieer kleurenpalet voor donker thema
- [ ] 3.2 Update componenten om CSS variabelen te gebruiken
- [ ] 3.3 Test contrastverhoudingen voor toegankelijkheid
```

**Beste praktijken voor taken:**
- Groepeer gerelateerde taken onder kopjes
- Gebruik hiërarchische nummering (1.1, 1.2, enz.)
- Houd de taken klein genoeg om in één sessie te voltooien
- Vink taken af wanneer ze zijn voltooid

## Delta Specs

Delta specs zijn het sleutelconcept dat OpenSpec geschikt maakt voor brownfield ontwikkeling. Ze beschrijven **wat er verandert** in plaats van de volledige spec opnieuw te stellen.

### Het Formaat

```markdown
# Delta voor Auth

## TOEGEVOEGDTE Vereisten

### Vereiste: Twee-Factor Authenticatie
Het systeem MOET TOTP-gebaseerde twee-factor authenticatie ondersteunen.

#### Scenario: 2FA aanmelding
- GEGEVEN een gebruiker zonder 2FA ingeschakeld
- WANNEER de gebruiker 2FA inschakelt in de instellingen
- DAN wordt er een QR-code weergegeven voor authenticator app setup
- EN de gebruiker moet verifiëren met een code voordat deze geactiveerd wordt

#### Scenario: 2FA login
- GEGEVEN een gebruiker met 2FA ingeschakeld
- WANNEER de gebruiker geldige referenties indient
- DAN wordt er een OTP challenge gepresenteerd
- EN de login is pas voltooid na een geldige OTP

## GEWIGZENDE Vereisten

### Vereiste: Sessie-expiratie
Het systeem MOET sessies laten verlopen na 15 minuten inactiviteit.
(Vóorig: 30 minuten)

#### Scenario: Inactiviteitslimiet
- GEGEVEN een geauthenticeerde sessie
- WANNEER 15 minuten verstrijken zonder activiteit
- DAN wordt de sessie ongeldig gemaakt

## VERWIJDERDE Vereisten

### Vereiste: Onthouden (Remember Me)
(Verouderd ten gunste van 2FA. Gebruikers moeten elke sessie opnieuw authenticeren.)
```

### Delta Secties

| Sectie | Betekenis | Wat gebeurt bij Archivering |
|---------|---------|----------------------------|
| `## TOEGEVOEGDTE Vereisten` | Nieuw gedrag | Wordt toegevoegd aan de hoofdspec |
| `## GEWIGZENDE Vereisten` | Veranderd gedrag | Vervangt de bestaande vereiste |
| `## VERWIJDERDE Vereisten` | Verouderd gedrag | Wordt verwijderd uit de hoofdspec |

### Waarom Deltas in Plaats van Volledige Specs

**Duidelijkheid.** Een delta toont precies wat er verandert. Bij het lezen van een volledige spec zou u deze mentaal moeten vergelijken met de huidige versie.

**Conflictvermijding.** Twee wijzigingen kunnen hetzelfde specbestand aanraken zonder te conflicteren, zolang ze verschillende vereisten wijzigen.

**Efficiëntie bij beoordeling.** Beoordelaars zien de wijziging, niet de ongewijzigde context. Focus op wat belangrijk is.

**Geschikt voor Brownfield.** De meeste werkzaamheden wijzigen bestaand gedrag. Deltas maken modificaties een eersteklas-onderdeel, geen nabeschouwing.

## Schemas

Schema's definiëren de artefacttypen en hun afhankelijkheden voor een workflow.

### Hoe Schemas Werken

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Geen afhankelijkheden, kan als eerste worden aangemaakt

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Vereist proposal voordat het wordt gemaakt

  - id: design
    generates: design.md
    requires: [proposal]      # Kan parallel met specs worden gemaakt

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Vereist zowel specs als design eerst
```

**Artefacten vormen een afhankelijkheidsgraaf:**

```
                    proposal
                   (root knooppunt)
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

**Afhankelijkheden zijn mogelijkmakers, geen poorten.** Ze tonen wat er mogelijk is om te creëren, niet wat je vervolgens moet creëren. Je kunt het ontwerp overslaan als je het niet nodig hebt. Je kunt specs maken vóór of ná het ontwerp — beide zijn alleen afhankelijk van proposal.

### Ingebouwde Schemas

**spec-driven** (standaard)

De standaardworkflow voor spec-driven ontwikkeling:

```
proposal → specs → design → tasks → implement
```

Beste voor: De meeste feature-ontwikkeling waarbij je wilt instemmen over de specificaties voordat je begint met de implementatie.

### Custom Schemas

Maak aangepaste schemas voor het workflow van jouw team:

```bash
# Maak vanaf nul
openspec schema init research-first

# Of fork een bestaand schema
openspec schema fork spec-driven research-first
```

**Voorbeeld custom schema:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Voer eerst onderzoek uit

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal geïnformeerd door onderzoek

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Sla specs/design over, ga direct naar taken
```

Zie [Customization](customization.md) voor volledige details over het maken en gebruiken van aangepaste schemas.

## Archiveren

Archiveren voltooit een wijziging door de delta-specificaties ervan samen te voegen met de hoofdspecificaties en de wijziging voor het archief te bewaren.

### Wat Gebeurt Bij Archiveren

```
Vóór archiviseren:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ merge
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Na archiviseren:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Bevat nu de 2FA-vereisten
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

1. **Samenvoegen van deltas.** Elk delta-spec sectie (TOEVOEGEND/GEWIJZERD/VERWIJDERD) wordt toegepast op de corresponderende hoofdspecificatie.

2. **Verplaatsen naar archief.** De wijzigingsmap wordt verplaatst naar `changes/archive/` met een datumvoorkeur voor chronologische ordening.

3. **Context behouden.** Alle artefacten blijven intact in het archief. Je kunt altijd terugkijken om te begrijpen waarom een wijziging is aangebracht.

### Waarom Archiveren Belangrijk Is

**Schone staat.** Actieve wijzigingen (`changes/`) tonen alleen werk in uitvoering. Voltooid werk wordt opgeruimd.

**Audit trail.** Het archief bewaart de volledige context van elke wijziging — niet alleen wat er veranderd is, maar het proposal dat uitlegt waarom, het ontwerp dat uitlegt hoe, en de taken die het uitgevoerde werk tonen.

**Spec evolutie.** Specificaties groeien organisch naarmate wijzigingen worden gearchiveerd. Elk archief voegt zijn deltas samen, waardoor een uitgebreide specificatie in de loop van de tijd wordt opgebouwd.

## Hoe Het Alles Samenkomt

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (core) of /opsx:new (expanded)           │
│   │     CHANGE     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREATE     │  /opsx:ff of /opsx:continue (expanded workflow)         │
│   │     ARTIFACTS  │  Creëert proposal → specs → design → tasks              │
│   │                │  (gebaseerd op schema-afhankelijkheden)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENT  │  /opsx:apply                                            │
│   │     TASKS      │  Werk door de taken heen, vink ze af                  │
│   │                │◄──── Update artefacten terwijl je leert                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFIER     │  /opsx:verify (optioneel)                                │
│   │     WERK       │  Controleer of de implementatie overeenkomt met de specificaties │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVEREN  │────►│  Delta-specificaties worden samengevoegd met hoofdspecificaties │    │
│   │     CHANGE     │     │  Wijzigingsmap wordt verplaatst naar archive/             │    │
│   └────────────────┘     │  Specificaties zijn nu de bijgewerkte waarheidbron   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**De positieve cyclus:**

1. Specs beschrijven het huidige gedrag
2. Wijzigingen stellen modificaties voor (als deltas)
3. De implementatie maakt de wijzigingen echt
4. Archiveren voegt deltas samen in de specs
5. Specs beschrijven nu het nieuwe gedrag
6. De volgende wijziging bouwt voort op de bijgewerkte specs

## Glossarium

| Term | Definitie |
|------|------------|
| **Artifact** | Een document binnen een wijziging (proposal, design, tasks of delta-specificaties) |
| **Archive** | Het proces van het voltooien van een wijziging en het samenvoegen van de deltas in de hoofdspecificaties |
| **Change** | Een voorgestelde modificatie aan het systeem, verpakt als een map met artefacten |
| **Delta spec** | Een specificatie die wijzigingen beschrijft (TOEVOEGEND/GEWIJZERD/VERWIJDERD) ten opzichte van de huidige specificaties |
| **Domain** | Een logische groepering voor specificaties (bijv. `auth/`, `payments/`) |
| **Requirement** | Een specifiek gedrag dat het systeem moet hebben |
| **Scenario** | Een concreet voorbeeld van een vereiste, meestal in Given/When/Then-formaat |
| **Schema** | Een definitie van artefacttypen en hun afhankelijkheden |
| **Spec** | Een specificatie die het systeemgedrag beschrijft, inclusief vereisten en scenario's |
| **Source of truth** | De `openspec/specs/` map, die het momenteel overeengekomen gedrag bevat |

## Volgende Stappen

- [Getting Started](getting-started.md) - Praktische eerste stappen
- [Workflows](workflows.md) - Veelvoorkomende patronen en wanneer je welke moet gebruiken
- [Commands](commands.md) - Volledige commando referentie
- [Customization](customization.md) - Maak aangepaste schemas en configureer je project