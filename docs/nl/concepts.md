# Concepten

Deze gids legt de kernideeën van OpenSpec uit en hoe deze met elkaar verbonden zijn. Voor praktisch gebruik, zie [Aan de slag](getting-started.md) en [Workflows](workflows.md).

## Filosofie

OpenSpec is gebouwd rond vier principes:

```
vloeibaar niet rigide   — geen fasepoorten, werk aan wat zin heeft
iteratief niet waterval — leer terwijl je bouwt, verfijn naarmate je voortgaat
eenvoudig niet complex  — lichtgewicht opzet, minimale ceremoniën
brownfield-first        — werkt met bestaande codebases, niet alleen met greenfield
```

### Waarom deze principes er toe doen

**Vloeibaar niet rigide.** Traditionele specificatiesystemen sluiten je op in fases: eerst plan je, dan implementeer je, daarna ben je klaar. OpenSpec is flexibeler — je kunt artefacten in elke volgorde aanmaken die voor jouw werk zin heeft.

**Iteratief niet waterval.** Eisen veranderen. Inzicht neemt toe. Wat op het eerste gezicht een goede aanpak leek, houdt mogelijk geen stand nadat je de codebase hebt gezien. OpenSpec omarmt deze realiteit.

**Eenvoudig niet complex.** Sommige specificatieframeworks vereisen een uitgebreide opzet, rigide formaten of zware processen. OpenSpec komt je niet in de weg. Initialiseer in enkele seconden, begin direct met werken en pas alleen aan als je dat nodig hebt.

**Brownfield-first.** Het meeste softwarewerk is niet opbouwen vanaf nul — het is het aanpassen van bestaande systemen. De op delta gebaseerde aanpak van OpenSpec maakt het eenvoudig om wijzigingen aan bestaand gedrag te specificeren, in plaats van alleen nieuwe systemen te beschrijven.

## Het Overzicht

OpenSpec organiseert uw werk in twee hoofdgebieden:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Bron van waarheid  │◄─────│  Voorgestelde wijzigingen      │   │
│   │  Hoe uw systeem     │ merge│  Elke wijziging = één map      │   │
│   │  momenteel werkt    │      │  Bevat artefacten + delta's    │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** zijn de bron van waarheid — ze beschrijven hoe uw systeem momenteel gedraagt.

**Changes** zijn voorgestelde wijzigingen — ze staan in aparte mappen tot u klaar bent om ze samen te voegen.

Deze scheiding is essentieel. U kunt parallel aan meerdere wijzigingen werken zonder conflicten. U kunt een wijziging beoordelen voordat deze de hoofdspecs beïnvloedt. En wanneer u een wijziging archiveert, worden de delta's netjes samengevoegd met de bron van waarheid.

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
│   └── spec.md           # Notificatiesysteem
└── ui/
    └── spec.md           # UI-gedrag en thema's
```

Organiseer specs per domein — logische groepingen die betekenisvol zijn voor uw systeem. Veelvoorkomende patronen:

- **Op functiegebied**: `auth/`, `payments/`, `search/`
- **Op component**: `api/`, `frontend/`, `workers/`
- **Op bounded context**: `ordering/`, `fulfillment/`, `inventory/`

### Spec-indeling

Een spec bevat vereisten, en elke vereiste heeft scenario's:

```markdown
# Auth Specification

## Purpose
Authentication and session management for the application.

## Requirements

### Requirement: User Authentication
The system SHALL issue a JWT token upon successful login.

#### Scenario: Valid credentials
- GIVEN a user with valid credentials
- WHEN the user submits login form
- THEN a JWT token is returned
- AND the user is redirected to dashboard

#### Scenario: Invalid credentials
- GIVEN invalid credentials
- WHEN the user submits login form
- THEN an error message is displayed
- AND no token is issued

### Requirement: Session Expiration
The system MUST expire sessions after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated
- AND the user must re-authenticate
```

**Belangrijkste elementen:**

| Element | Doel |
|---------|---------|
| `## Purpose` | Beschrijving op hoog niveau van het domein van deze spec |
| `### Requirement:` | Een specifiek gedrag dat het systeem moet hebben |
| `#### Scenario:` | Een concreet voorbeeld van de vereiste in de praktijk |
| SHALL/MUST/SHOULD | RFC 2119-sleutelwoorden die de sterkte van de vereiste aangeven |

### Waarom Specs Op Deze Manier Structureren

**Vereisten zijn het "wat"** — ze beschrijven wat het systeem moet doen zonder de implementatie te specificeren.

**Scenario's zijn het "wanneer"** — ze bieden concrete voorbeelden die kunnen worden geverifieerd. Goede scenario's:
- Zijn testbaar (u zou er een geautomatiseerde test voor kunnen schrijven)
- Dekken zowel het happy path als edge cases
- Gebruiken Given/When/Then of een vergelijkbare gestructureerde indeling

**RFC 2119-sleutelwoorden** (SHALL, MUST, SHOULD, MAY) communiceren intentie:
- **MUST/SHALL** — absolute vereiste
- **SHOULD** — aanbevolen, maar er bestaan uitzonderingen
- **MAY** — optioneel

### Wat een Spec Is (en Niet Is)

Een spec is een **gedragscontract**, geen implementatieplan.

Goede spec-inhoud:
- Waarneembaar gedrag waar gebruikers of downstream-systemen op vertrouwen
- Invoer, uitvoer en foutcondities
- Externe beperkingen (beveiliging, privacy, betrouwbaarheid, compatibiliteit)
- Scenario's die kunnen worden getest of expliciet gevalideerd

Vermijd in specs:
- Interne klassen/functienamen
- Bibliotheek- of frameworkkeuzes
- Stapsgewijze implementatiedetails
- Gedetailleerde uitvoeringsplannen (die horen thuis in `design.md` of `tasks.md`)

Snelle test:
- Als de implementatie kan veranderen zonder dat extern zichtbaar gedrag verandert, hoort het waarschijnlijk niet in de spec.

### Houd Het Licht: Progressieve Striktheid

OpenSpec streeft naar het vermijden van bureaucratie. Gebruik het lichtste niveau dat de wijziging nog steeds verifieerbaar maakt.

**Lite spec (standaard):**
- Korte gedragsgerichte vereisten
- Duidelijke scope en non-goals
- Een paar concrete acceptatiecontroles

**Full spec (voor hoger risico):**
- Cross-team of cross-repo wijzigingen
- API/contract-wijzigingen, migraties, beveiligings-/privacykwesties
- Wijzigingen waar ambiguïteit waarschijnlijk dure herwerkeling veroorzaakt

De meeste wijzigingen moeten in Lite-modus blijven.

## Mens + Agent Samenwerking

In veel teams verkennen mensen en concepteerden agents artefacten. De beoogde lus is:

1. Mens levert intentie, context en beperkingen.
2. Agent zet dit om in gedragsgerichte vereisten en scenario's.
3. Agent houdt implementatiedetails in `design.md` en `tasks.md`, niet in `spec.md`.
4. Validatie bevestigt structuur en duidelijkheid vóór implementatie.

Dit houdt specs leesbaar voor mensen en consistent voor agents.

## Changes

Een change is een voorgestelde wijziging aan uw systeem, verpakt als een map met alles wat nodig is om het te begrijpen en te implementeren.

### Change-structuur

```
openspec/changes/add-dark-mode/
├── proposal.md           # Waarom en wat
├── design.md             # Hoe (technische aanpak)
├── tasks.md              # Implementatie-checklist
├── .openspec.yaml        # Change-metadata (optioneel): schema, created, skip_specs
└── specs/                # Delta-specs
    └── ui/
        └── spec.md       # Wat verandert er in ui/spec.md
```

Elke change is op zichzelf staand. Het heeft:
- **Artefacten** — documenten die intentie, ontwerp en taken vastleggen
- **Delta-specs** — specificaties voor wat wordt toegevoegd, gewijzigd of verwijderd
- **Metadata** — optionele configuratie voor deze specifieke change

### Waarom Changes Mappen Zijn

Het verpakken van een change als map heeft verschillende voordelen:

1. **Alles samen.** Voorstel, ontwerp, taken en specs staan op één plek. Geen zoektocht door verschillende locaties.

2. **Parallel werk.** Meerdere wijzigingen kunnen gelijktijdig bestaan zonder conflicten. Werk aan `add-dark-mode` terwijl `fix-auth-bug` ook wordt uitgevoerd.

3. **Schone geschiedenis.** Bij archivering verhuizen wijzigingen naar `changes/archive/` met hun volledige context bewaard. U kunt terugkijken en niet alleen begrijpen wat er veranderde, maar ook waarom.

4. **Reviewvriendelijk.** Een change-map is eenvoudig te bekijken — open hem, lees het voorstel, controleer het ontwerp, bekijk de spec-delta's.

## Artefacten

Artefacten zijn de documenten binnen een change die het werk begeleiden.

### De Artefactenstroom

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Artefacten bouwen op elkaar voort. Elke artefact biedt context voor de volgende.

### Artefacttypen

#### Voorstel (`proposal.md`)

Het voorstel legt **intentie**, **scope** en **aanpak** op hoog niveau vast.

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage and match system preferences.

## Scope
In scope:
- Theme toggle in settings
- System preference detection
- Persist preference in localStorage

Out of scope:
- Custom color themes (future work)
- Per-page theme overrides

## Approach
Use CSS custom properties for theming with a React context
for state management. Detect system preference on first load,
allow manual override.
```

**Wanneer het voorstel bij te werken:**
- Scope verandert (verschuiving of uitbreiding)
- Intentie verduidelijkt (beter begrip van het probleem)
- Aanpak verschuift fundamenteel

#### Specs (delta-specs in `specs/`)

Delta-specs beschrijven **wat er verandert** ten opzichte van de huidige specs. Zie [Delta Specs](#delta-specs) hieronder.

#### Ontwerp (`design.md`)

Het ontwerp legt **technische aanpak** en **architectuurbeslissingen** vast.

````markdown
# Design: Add Dark Mode

## Technical Approach
Theme state managed via React Context to avoid prop drilling.
CSS custom properties enable runtime switching without class toggling.

## Architecture Decisions

### Decision: Context over Redux
Using React Context for theme state because:
- Simple binary state (light/dark)
- No complex state transitions
- Avoids adding Redux dependency

### Decision: CSS Custom Properties
Using CSS variables instead of CSS-in-JS because:
- Works with existing stylesheet
- No runtime overhead
- Browser-native solution

## Data Flow
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes
- `src/contexts/ThemeContext.tsx` (new)
- `src/components/ThemeToggle.tsx` (new)
- `src/styles/globals.css` (modified)
````

**Wanneer het ontwerp bij te werken:**
- Implementatie onthult dat de aanpak niet werkt
- Betere oplossing ontdekt
- Afhankelijkheden of beperkingen veranderen

#### Taken (`tasks.md`)

Taken zijn de **implementatie-checklist** — concrete stappen met selectievakjes.

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence
- [ ] 1.4 Add system preference detection

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
- [ ] 3.3 Test contrast ratios for accessibility
```

**Best practices voor taken:**
- Groeperen van gerelateerde taken onder kopjes
- Hiërarchische nummering gebruiken (1.1, 1.2, etc.)
- Taken klein houden genoeg om in één sessie te voltooien
- Taken afvinken naarmate u ze voltooit

## Delta Specs

Delta-specs zijn het sleutelconcept dat OpenSpec laat werken voor brownfield-ontwikkeling. Ze beschrijven **wat er verandert** in plaats van de hele spec opnieuw te formuleren.

### De Indeling

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup
- AND the user must verify with a code before activation

#### Scenario: 2FA login
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented
- AND login completes only after valid OTP

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users should re-authenticate each session.)
```

### Delta-secties

| Sectie | Betekenis | Wat Gebeurt Bij Archivering |
|---------|---------|---------------------------|
| `## ADDED Requirements` | Nieuw gedrag | Toegevoegd aan hoofdspec |
| `## MODIFIED Requirements` | Gewijzigd gedrag | Vervangt bestaande vereiste |
| `## REMOVED Requirements` | Afgeschreven gedrag | Verwijderd uit hoofdspec |

### Waarom Delta's In Plats Van Volledige Specs

**Duidelijkheid.** Een delta toont precies wat er verandert. Bij het lezen van een volledige spec zou u mentaal moeten diffen met de huidige versie.

**Conflictover twee.** Twee wijzigingen kunnen hetzelfde spec-bestand aanraken zonder conflicten, zolang ze verschillende vereisten wijzigen.

**Review-efficiție.** Beoordelaars zien de wijziging, niet de ongewijzigde context. Focus op wat ertoe doet.

**Brownfield-fit.** Het meeste werk wijzigt bestaand gedrag. Delta's maken wijzigingen first-class, geen nagedachte.

## Schema's

Schema's definiëren de artefacttypes en hun afhankelijkheden voor een workflow.

### Hoe schema's werken

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Geen afhankelijkheden, kan als eerste gemaakt worden

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Heeft proposal nodig voordat het gemaakt kan worden

  - id: design
    generates: design.md
    requires: [proposal]      # Kan parallel met specs gemaakt worden

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Heeft zowel specs als design nodig voordat het gemaakt kan worden
```

**Artefacten vormen een afhankelijkheidsgraaf:**

```
                    proposal
                   (hoofdnode)
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

**Afhankelijkheden zijn mogelijkmakers, geen poorten.** Ze tonen wat mogelijk is om te maken, niet wat je als volgende moet maken. Je kunt design overslaan als je het niet nodig hebt. Je kunt specs voor of na design maken — beide hangen alleen van proposal af.

### Ingebouwde schema's

**spec-driven** (standaard)

De standaard workflow voor spec-driven ontwikkeling:

```
proposal → specs → design → tasks → implement
```

Geschikt voor: De meeste feature-werk waarbij je wilt overeenkomen over specs voordat je implementeert.

### Aangepaste schema's

Maak aangepaste schema's voor de workflow van je team:

```bash
# Maak vanaf nul
openspec schema init research-first

# Of forken een bestaande
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
    requires: [research]   # Proposal wordt geïnformeerd door onderzoek

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Sla specs/design over, ga direct naar tasks
```

Zie [Aanpassing](customization.md) voor volledige details over het maken en gebruiken van aangepaste schema's.

## Archief

Archiveren rondt een wijziging af door de delta-specs samen te voegen met de hoofd-specs en de wijziging te bewaren voor de geschiedenis.

### Wat er gebeurt als je archiveert

```
Voor archivering:

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


Na archivering:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Nu inclusief 2FA-vereisten
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

1. **Samenvoegen van delta's.** Elke delta-spec sectie (ADDED/MODIFIED/REMOVED) wordt toegepast op de bijbehorende hoofdspecificatie.

2. **Verplaatsen naar archief.** De wijzigingsmap verplaatst naar `changes/archive/` met een datumvoorvoegsel voor chronologische ordening.

3. **Context bewaren.** Alle artefacten blijven intact in het archief. Je kunt altijd terugkijken om te begrijpen waarom een wijziging is gemaakt.

### Waarom archiveren belangrijk is

**Schone staat.** Actieve wijzigingen (`changes/`) tonen alleen lopend werk. Afgerond werk wordt uit de weg geruimd.

**Audit trail.** Het archief bewaart de volledige context van elke wijziging — niet alleen wat er veranderde, maar ook het voorstel dat uitlegt waarom, het design dat uitlegt hoe, en de taken die het gedane werk tonen.

**Specificatie-evolutie.** Specificaties groeien organisch naarmate wijzigingen worden gearchiveerd. Elke archivering voegt zijn delta's samen, waardoor er na verloop van tijd een uitgebreide specificatie ontstaat.

## Hoe het allemaal past

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (core) or /opsx:new (expanded)           │
│   │     WIJZIGING  │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. MAAK       │  /opsx:ff or /opsx:continue (expanded workflow)         │
│   │     ARTEFACTEN │  Maakt proposal → specs → design → tasks                │
│   │                │  (gebaseerd op schema-afhankelijkheden)                 │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3.            │  /opsx:apply                                            │
│   │   IMPLEMENTEER │  Werk je weg door de taken, en vink ze af              │
│   │     TAKEN      │◄──── Werk artefacten bij naarmate je leert              │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFICEER │  /opsx:verify (optional)                                │
│   │     WERK       │  Controleer of implementatie overeenkomt met specs     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVEER  │────►│  Delta-specs worden samengevoegd met hoofd-specs│    │
│   │     WIJZIGING  │     │  Wijzigingsmap verplaatst naar archive/         │    │
│   └────────────────┘     │  Specificaties zijn nu de bijgewerkte bron der  │    │
│                          │  waarheid                                       │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**De positieve cyclus:**

1. Specificaties beschrijven het huidige gedrag
2. Wijzigingen stellen aanpassingen voor (als delta's)
3. Implementatie maakt de wijzigingen echt
4. Archivering voegt delta's samen in specificaties
5. Specificaties beschrijven nu het nieuwe gedrag
6. Volgende wijziging bouwt op bijgewerkte specificaties

## Woordenlijst

| Term | Definitie |
|------|------------|
| **Artifact** | Een document binnen een wijziging (proposal, design, tasks of delta specs) |
| **Archive** | Het proces van het afronden van een wijziging en het samenvoegen van zijn delta's in de hoofd-specs |
| **Change** | Een voorgestelde aanpassing aan het systeem, verpakt als een map met artefacten |
| **Delta spec** | Een specificatie die wijzigingen beschrijft (ADDED/MODIFIED/REMOVED) ten opzichte van de huidige specificaties |
| **Domain** | Een logische groepering voor specificaties (bijv. `auth/`, `payments/`) |
| **Requirement** | Een specifiek gedrag dat het systeem moet hebben |
| **Scenario** | Een concreet voorbeeld van een vereiste, meestal in Given/When/Then-formaat |
| **Schema** | Een definitie van artefacttypes en hun afhankelijkheden |
| **Spec** | Een specificatie die systeemgedrag beschrijft, met vereisten en scenario's |
| **Source of truth** | De `openspec/specs/` directory, die het huidige overeengekomen gedrag bevat |

## Volgende stappen

- [Aan de slag](getting-started.md) - Praktische eerste stappen
- [Workflows](workflows.md) - Veelvoorkomende patronen en wanneer je welke gebruikt
- [Commando's](commands.md) - Volledige commandoreferentie
- [Aanpassing](customization.md) - Maak aangepaste schema's en configureer je project