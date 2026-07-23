# OPSX-werkstroom

> Feedback welkom op [Discord](https://discord.gg/YctCnvvshC).

## Wat is het?

OPSX is nu de standaardwerkstroom voor OpenSpec.

Het is een **vloeiende, iteratieve werkstroom** voor OpenSpec-wijzigingen. Geen starre fasen meer — gewoon acties die je op elk moment kunt ondernemen.

## Waarom dit bestaat

De legacy OpenSpec-werkstroom werkt, maar is **beperkt**:

- **Instructies zijn hardgecodeerd** — verborgen in TypeScript, je kunt ze niet aanpassen
- **Alles-of-niets** — één grote opdracht maakt alles, je kunt geen individuele onderdelen testen
- **Vaste structuur** — dezelfde werkstroom voor iedereen, geen aanpassingsmogelijkheden
- **Black box** — wanneer de AI-output slecht is, kun je de prompts niet aanpassen

**OPSX opent het op.** Nu kan iedereen:

1. **Experimenteren met instructies** — bewerk een sjabloon, kijk of de AI het beter doet
2. **Gedetailleerd testen** — valideer de instructies van elk artefact onafhankelijk
3. **Werkstromen aanpassen** — definieer je eigen artefacten en afhankelijkheden
4. **Snel itereren** — verander een sjabloon, test direct, geen herbouw nodig

```
Legacy-werkstroom:                      OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Hardgecodeerd in package  │           │  schema.yaml           │◄── Jij bewerkt dit
│  (kan niet aanpassen)        │           │  templates/*.md        │◄── Of dit
│        ↓               │           │        ↓               │
│  Wachten op nieuwe release  │           │  Direct effect        │
│        ↓               │           │        ↓               │
│  Hopelijk is het beter      │           │  Test het zelf      │
└────────────────────────┘           └────────────────────────┘
```

**Dit is voor iedereen:**
- **Teams** — maak werkstromen die aansluiten bij hoe je daadwerkelijk werkt
- **Power users** — pas prompts aan om betere AI-output voor je codebase te krijgen
- **OpenSpec bijdragers** — experimenteer met nieuwe benaderingen zonder releases

We zijn allemaal nog aan het leren wat het beste werkt. OPSX laat ons samen leren.

## De gebruikerservaring

**Het probleem met lineaire werkstromen:**
Je bent "in de planningsfase", dan "in de implementatiefase", dan "klaar". Maar echt werk werkt niet zo. Je implementeert iets, realiseert je dat je ontwerp fout was, moet je specificaties bijwerken, ga je door met implementeren. Lineaire fasen vechten tegen hoe werk daadwerkelijk verloopt.

**OPSX-aanpak:**
- **Acties, geen fasen** — maak, implementeer, update, archiveer — doe er een van op elk moment
- **Afhankelijkheden zijn mogelijkmakers** — ze tonen wat mogelijk is, niet wat de volgende vereiste is

```
  voorstel ──→ specificaties ──→ ontwerp ──→ taken ──→ implementeer
```

## Installatie

```bash
# Zorg ervoor dat je openspec geïnstalleerd hebt — skills worden automatisch gegenereerd
openspec init
```

Dit maakt skills aan in `.claude/skills/` (of equivalent) die AI-code-assistenten automatisch detecteren.

Standaard gebruikt OpenSpec het `core` werkstroomprofiel (`propose`, `explore`, `apply`, `sync`, `archive`). Als je de uitgebreide werkstroomopdrachten wilt (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`), configureer ze met `openspec config profile` en pas toe met `openspec update`.

Tijdens de installatie wordt je gevraagd een **projectconfig** (`openspec/config.yaml`) te maken. Dit is optioneel maar aanbevolen.

## Projectconfiguratie

Projectconfig laat je standaardwaarden instellen en projectspecifieke context injecteren in alle artefacten.

### Config aanmaken

Config wordt aangemaakt tijdens `openspec init`, of handmatig:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  API-conventies: RESTful, JSON-responses
  Testen: Vitest voor unit tests, Playwright voor e2e
  Stijl: ESLint met Prettier, strikt TypeScript

rules:
  proposal:
    - Neem een terugdraaiplan op
    - Identificeer betrokken teams
  specs:
    - Gebruik Given/When/Then-formaat voor scenario's
  design:
    - Neem sequentiediagrammen op voor complexe stromen
```

### Config-velden

| Veld | Type | Beschrijving |
|------|------|-------------|
| `schema` | string | Standaardschema voor nieuwe wijzigingen (bijv. `spec-driven`) |
| `context` | string | Projectcontext die in alle artefactinstructies wordt geïnjecteerd |
| `rules` | object | Regels per artefact, gebaseerd op artefact-ID |

### Hoe het werkt

**Schemaprioriteit** (hoogste naar laagste):
1. CLI-vlag (`--schema <naam>`)
2. Wijzigingsmetadata (`.openspec.yaml` in wijzigingsmap)
3. Projectconfig (`openspec/config.yaml`)
4. Standaard (`spec-driven`)

**Contextinjectie:**
- Context wordt vooraan elk artefact's instructies geplakt
- Ingesloten in `<context>...</context>`-tags
- Helpt de AI om de conventies van je project te begrijpen

**Regelinjectie:**
- Regels worden alleen geïnjecteerd voor overeenkomende artefacten
- Ingesloten in `<rules>...</rules>`-tags
- Worden na de context, voor het sjabloon weergegeven

### Artefact-ID's per schema

**spec-driven** (standaard):
- `proposal` — Wijzigingsvoorstel
- `specs` — Specificaties
- `design` — Technisch ontwerp
- `tasks` — Implementatietaken

### Config-validatie

- Onbekende artefact-ID's in `rules` genereren waarschuwingen
- Schemanamen worden gevalideerd tegen beschikbare schema's
- Context heeft een limiet van 50KB
- Ongeldige YAML wordt gerapporteerd met regelnummers

### Problemen oplossen

**"Onbekende artefact-ID in regels: X"**
- Controleer of artefact-ID's overeenkomen met je schema (zie lijst hierboven)
- Voer `openspec schemas --json` uit om artefact-ID's voor elk schema te zien

**Config wordt niet toegepast:**
- Zorg dat het bestand zich op `openspec/config.yaml` bevindt (niet `.yml`)
- Controleer de YAML-syntaxis met een validator
- Config-wijzigingen zijn direct van kracht (geen herstart nodig)

**Context te groot:**
- Context is beperkt tot 50KB
- Vat in plaats daarvan samen of link naar externe documentatie

## Opdrachten

| Opdracht | Wat het doet |
|----------|--------------|
| `/opsx:propose` | Maak een wijziging en genereer planartefacten in één stap (standaard snelle route) |
| `/opsx:explore` | Denk ideeën uit, onderzoek problemen, verduidelijk vereisten |
| `/opsx:new` | Start een nieuw wijzigingskader (uitgebreide werkstroom) |
| `/opsx:continue` | Maak het volgende artefact (uitgebreide werkstroom) |
| `/opsx:ff` | Snel-doorlopen van planartefacten (uitgebreide werkstroom) |
| `/opsx:apply` | Implementeer taken, werk artefacten bij indien nodig |
| `/opsx:update` | Herschrijf de planartefacten van een wijziging en houd ze coherent |
| `/opsx:verify` | Valideer implementatie tegen artefacten (uitgebreide werkstroom) |
| `/opsx:sync` | Sync delta-specificaties naar main (standaard werkstroom, optioneel) |
| `/opsx:archive` | Archiveer als je klaar bent |
| `/opsx:bulk-archive` | Archiveer meerdere voltooide wijzigingen (uitgebreide werkstroom) |
| `/opsx:onboard` | Begeleide doorloop van een end-to-end wijziging (uitgebreide werkstroom) |

## Gebruik

### Verken een idee
```
/opsx:explore
```
Denk ideeën uit, onderzoek problemen, vergelijk opties. Geen structuur vereist - gewoon een denkpartner. Wanneer inzichten kristalliseren, ga je over naar `/opsx:propose` (standaard) of `/opsx:new`/`/opsx:ff` (uitgebreid).

### Start een nieuwe wijziging
```
/opsx:propose
```
Maakt de wijziging en genereert planartefacten die nodig zijn vóór implementatie.

Als je uitgebreide werkstromen hebt ingeschakeld, kun je in plaats daarvan gebruiken:

```text
/opsx:new        # alleen kader
/opsx:continue   # maak één artefact tegelijk
/opsx:ff         # maak alle planartefacten in één keer
```

### Artefacten aanmaken
```
/opsx:continue
```
Toont wat klaar is om te maken op basis van afhankelijkheden, en maakt daarna één artefact. Gebruik herhaaldelijk om je wijziging stap voor stap op te bouwen.

```
/opsx:ff add-dark-mode
```
Maakt alle planartefacten in één keer. Gebruik dit als je een duidelijk beeld hebt van wat je bouwt.

### Implementeer (het vloeibare deel)
```
/opsx:apply
```
Werkt taken af, vinkt ze af terwijl je gaat. Als je met meerdere wijzigingen bezig bent, kun je `/opsx:apply <naam>` uitvoeren; anders zou het uit het gesprek moeten afleiden en je vragen om te kiezen als het niet kan zien wat je bedoelt.

### Een wijziging bijwerken
```
/opsx:update add-dark-mode - we're storing the theme in a cookie now
```
Herschrijft de bestaande planartefacten van de wijziging en houdt ze coherent - in elke richting (een ontwerpwijziging kan terugwerken naar het voorstel). Alleen planartefacten: het bewerkt nooit code, en het maakt nooit ontbrekende artefacten (dat is `/opsx:continue`). Elke bewerking wordt eerst met je bevestigd. Als de wijziging al was geïmplementeerd, beveelt het `/opsx:apply` aan zodat de code opdraait met het herziene plan. Als je herziening de *intentie* van de wijziging verandert, begin dan opnieuw - zie [Wanneer updaten vs. opnieuw beginnen](#when-to-update-vs-start-fresh).

### Afronden
```
/opsx:archive   # Verplaats naar archief als je klaar bent (vraagt om specificaties te synchroniseren indien nodig)
```

## Wanneer updaten vs. opnieuw beginnen

Je kunt je voorstel of specificaties altijd bewerken vóór implementatie. Maar wanneer wordt verfijnen "dit is ander werk"?

### Wat een voorstel vastlegt

Een voorstel definieert drie dingen:
1. **Intentie** — Welk probleem los je op?
2. **Scope** — Wat valt binnen/buiten de grenzen?
3. **Aanpak** — Hoe ga je het oplossen?

De vraag is: wat is er veranderd, en hoeveel?

### Update de bestaande wijziging wanneer:

**Zelfde intentie, verfijnde uitvoering**
- Je ontdekt randgevallen die je niet had overwogen
- De aanpak hoeft aanpassing maar het doel is ongewijzigd
- Implementatie onthult dat het ontwerp iets scheef was

**Scope versmalt**
- Je realiseert je dat de volledige scope te groot is, wil je eerst de MVP uitbrengen
- "Donkere modus toevoegen" → "Donkere modus toggel toevoegen (systeemvoorkeur in v2)"

**Leer gedreven correcties**
- Codebase is niet gestructureerd zoals je dacht
- Een afhankelijkheid werkt niet zoals verwacht
- "Gebruik CSS-variabelen" → "Gebruik in plaats daarvan Tailwind's dark:-voorvoegsel"

### Start een nieuwe wijziging wanneer:

**Intentie fundamenteel veranderd**
- Het probleem zelf is nu anders
- "Donkere modus toevoegen" → "Uitgebreid themasysteem toevoegen met aangepaste kleuren, lettertypes, tussenruimte"

**Scope explodeerde**
- Wijziging groeide zo veel dat het in wezen ander werk is
- Origineel voorstel zou na updates niet meer herkenbaar zijn
- "Loginbug fixen" → "Auth-systeem herschrijven"

**Origineel is af te ronden**
- De originele wijziging kan als "klaar" worden gemarkeerd
- Nieuw werk staat op zich, het is geen verfijning
- Rond "Donkere modus MVP" af → Archiveer → Nieuwe wijziging "Donkere modus uitbreiden"

### De vuistregels

```
                        ┌─────────────────────────────────────┐
                        │     Is dit hetzelfde werk?          │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Zelfde intentie?      >50% overlap?      Kan origineel
             Zelfde probleem?     Zelfde scope?        "klaar" zijn zonder
                    │                  │          deze wijzigingen?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         JA               NEE JA           NEE  NEE              JA
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       UPDATE            NIEUW  UPDATE       NIEUW  UPDATE          NIEUW
```

| Test | Update | Nieuwe wijziging |
|------|--------|------------------|
| **Identiteit** | "Hetzelfde, verfijnd" | "Ander werk" |
| **Scope-overlap** | >50% overlap | <50% overlap |
| **Afronding** | Kan niet "klaar" zijn zonder wijzigingen | Kan origineel afronden, nieuw werk staat op zich |
| **Verhaal** | Updateketen vertelt coherent verhaal | Patches zouden meer verwarren dan verduidelijken |

### Het principe

> **Update behoudt context. Nieuwe wijziging biedt duidelijkheid.**
>
> Kies voor update wanneer de geschiedenis van je denken waardevol is.
> Kies voor nieuw wanneer opnieuw beginnen duidelijker is dan patchen.

Zie het als git-branches:
- Blijf committen terwijl je aan dezelfde functie werkt
- Start een nieuwe branch wanneer het echt nieuw werk is
- Soms merge je een gedeeltelijke functie en begin je opnieuw voor fase 2

## Wat is er anders?

|  | Legacy (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Structuur** | Eén groot voorstel document | Discrete artefacten met afhankelijkheden |
| **Werkstroom** | Lineaire fasen: plan → implementeer → archiveer | Vloeibare acties — doe alles op elk moment |
| **Iteratie** | Onhandig om terug te gaan | Update artefacten terwijl je leert |
| **Aanpassing** | Vaste structuur | Schema-gedreven (definieer je eigen artefacten) |

**Het belangrijkste inzicht:** werk is niet lineair. OPSX stopt met doen alsof het wel zo is.

## Architecture Deep Dive

Deze sectie legt uit hoe OPSX onder de motorkap werkt en hoe het zich verhoudt tot de legacy workflow.
Voorbeelden in deze sectie gebruiken de uitgebreide commandoset (`new`, `continue`, etc.); standaard `core`-gebruikers kunnen dezelfde flow toewijzen aan `propose → apply → sync → archive`.

### Filosofie: Fases vs Acties

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LEGACY WORKFLOW                                      │
│                    (Phase-Locked, All-or-Nothing)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │             │
│   │    PHASE     │      │    PHASE     │      │    PHASE     │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Creates ALL artifacts at once                                          │
│   • Can't go back to update specs during implementation                    │
│   • Phase gates enforce linear progression                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            OPSX WORKFLOW                                     │
│                      (Fluid Actions, Iterative)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           ACTIONS (not phases)             │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              any order                     │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Create artifacts one at a time OR fast-forward                         │
│   • Update specs/design/tasks during implementation                        │
│   • Dependencies enable progress, phases don't exist                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Architectuur

**Legacy workflow** gebruikt hardcoded templates in TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      LEGACY WORKFLOW COMPONENTS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Hardcoded Templates (TypeScript strings)                                  │
│                    │                                                        │
│                    ▼                                                        │
│   Tool-specific configurators/adapters                                      │
│                    │                                                        │
│                    ▼                                                        │
│   Generated Command Files (.claude/commands/openspec/*.md)                  │
│                                                                             │
│   • Fixed structure, no artifact awareness                                  │
│   • Change requires code modification + rebuild                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** gebruikt externe schema's en een dependency graph engine:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OPSX COMPONENTS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Schema Definitions (YAML)                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Dependencies                     │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Glob patterns                    │   │
│   │      requires: [proposal]      ◄── Enables after proposal           │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Artifact Graph Engine                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Topological sort (dependency ordering)                           │   │
│   │  • State detection (filesystem existence)                           │   │
│   │  • Rich instruction generation (templates + context)                │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Skill Files (.claude/skills/openspec-*/SKILL.md)                          │
│                                                                             │
│   • Cross-editor compatible (Claude Code, Cursor, Windsurf)                 │
│   • Skills query CLI for structured data                                    │
│   • Fully customizable via schema files                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Dependency Graph Model

Artifacts vormen een directed acyclic graph (DAG). Dependencies zijn **inschakelaars**, geen poorten:

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
                                  │
                                  ▼
                          ┌──────────────┐
                          │ APPLY PHASE  │
                          │ (requires:   │
                          │  tasks)      │
                          └──────────────┘
```

**Statusovergangen:**

```
   BLOCKED ────────────────► READY ────────────────► DONE
      │                        │                       │
   Missing                  All deps               File exists
   dependencies             are DONE               on filesystem
```

### Informatiestroom

**Legacy workflow** — agent ontvangt statische instructies:

```
  User: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Static instructions:                   │
  │  • Create proposal.md                   │
  │  • Create tasks.md                      │
  │  • Create design.md                     │
  │  • Create specs/<capability>/spec.md    │
  │                                         │
  │  No awareness of what exists or         │
  │  dependencies between artifacts         │
  └─────────────────────────────────────────┘
           │
           ▼
  Agent creates ALL artifacts in one go
```

**OPSX** — agent vraagt om rijke context:

```
  User: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Step 1: Query current state                                             │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec status --change "add-auth" --json                      │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "artifacts": [                                                  │  │
  │  │      {"id": "proposal", "status": "done"},                         │  │
  │  │      {"id": "specs", "status": "ready"},      ◄── First ready      │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked", "missingDeps": ["specs"]}│  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Step 2: Get rich instructions for ready artifact                        │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec instructions specs --change "add-auth" --json          │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "template": "# Specification\n\n## ADDED Requirements...",      │  │
  │  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
  │  │    "unlocks": ["tasks"]                                            │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Step 3: Read dependencies → Create ONE artifact → Show what's unlocked  │
  └──────────────────────────────────────────────────────────────────────────┘
```

### Iteratiemodel

**Legacy workflow** — onhandig om te itereren:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Wacht, het ontwerp is fout"
       │               │
       │               ├── Opties:
       │               │   • Bewerk bestanden handmatig (breekt context)
       │               │   • Verwerp en begin opnieuw
       │               │   • Druk door en repareer later
       │               │
       │               └── Geen officiële "ga terug"-mechanisme
       │
       └── Creëert ALLE artefacten in één keer
```

**OPSX** — natuurlijke iteratie:

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── "Het ontwerp is fout"
      │                │                  │
      │                │                  ▼
      │                │            Bewerk gewoon design.md
      │                │            en ga door!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply hervat
      │                │         waar je gebleven was
      │                │
      │                └── Creëert ÉÉN artefact, laat zien wat vrijgegeven is
      │
      └── Creëert basisstructuur voor wijziging, wacht op richting
```

### Aangepaste Schema's

Maak aangepaste workflows met behulp van de schema-beheeropdrachten:

```bash
# Maak een nieuw schema vanaf nul (interactief)
openspec schema init my-workflow

# Of fork een bestaand schema als uitgangspunt
openspec schema fork spec-driven my-workflow

# Valideer uw schemastructuur
openspec schema validate my-workflow

# Zie waar een schema vandaan wordt opgelost (nuttig voor foutopsporing)
openspec schema which my-workflow
```

Schema's worden opgeslagen in `openspec/schemas/` (project-lokaal, versiebeheer) of `~/.local/share/openspec/schemas/` (gebruikers-globaal).

**Schemastructuur:**
```
openspec/schemas/research-first/
├── schema.yaml
└── templates/
    ├── research.md
    ├── proposal.md
    └── tasks.md
```

**Voorbeeld schema.yaml:**
```yaml
name: research-first
artifacts:
  - id: research        # Toegevoegd voor proposal
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Hangt nu af van research

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**Afhankelijkheidsgrafiek:**
```
   research ──► proposal ──► tasks
```

### Samenvatting

| Aspect | Verouderd | OPSX |
|--------|----------|------|
| **Sjablonen** | Hardcoded TypeScript | Externe YAML + Markdown |
| **Afhankelijkheden** | Geen (allemaal tegelijk) | DAG met topologische sortering |
| **Status** | Op fasen gebaseerd mentaal model | Aanwezigheid in bestandssysteem |
| **Aanpassing** | Bewerk bron, herbouw | Maak schema.yaml |
| **Iteratie** | Fasevergrendeld | Vloeiend, bewerk alles |
| **Editorondersteuning** | Tool-specifieke configurator/adapters | Enkele skills-map |
## Schema's

Schema's definiëren welke artefacten bestaan en hun afhankelijkheden. Momenteel beschikbaar:

- **spec-driven** (standaard): proposal → specs → design → tasks

```bash
# Lijst beschikbare schema's
openspec schemas

# Bekijk alle schema's met hun resolutiebronnen
openspec schema which --all

# Maak een nieuw schema interactief
openspec schema init my-workflow

# Fork een bestaand schema voor aanpassing
openspec schema fork spec-driven my-workflow

# Valideer schemastructuur voor gebruik
openspec schema validate my-workflow
```

## Tips

- Gebruik `/opsx:explore` om een idee te doordenken voordat je je vastlegt op een wijziging
- `/opsx:ff` als je weet wat je wilt, `/opsx:continue` tijdens het verkennen
- Tijdens `/opsx:apply`, als er iets mis is — herstel het artefact, ga dan verder
- Taken bijhouden van de voortgang via selectievakjes in `tasks.md`
- Controleer de status op elk moment: `openspec status --change "name"`

## Feedback

Dit is ruw. Dat is opzettelijk — we leren wat werkt.

Een bug gevonden? Ideeën? Doe mee met ons op [Discord](https://discord.gg/YctCnvvshC) of open een issue op [GitHub](https://github.com/Fission-AI/openspec/issues).