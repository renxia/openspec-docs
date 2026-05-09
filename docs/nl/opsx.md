# OPSX-workflow

> Feedback welkom op [Discord](https://discord.gg/YctCnvvshC).

## Wat is het?

OPSX is nu de standaardworkflow voor OpenSpec.

Het is een **vloeiende, iteratieve workflow** voor OpenSpec-wijzigingen. Geen rigide fasen meer — alleen acties die je op elk moment kunt uitvoeren.

## Waarom dit bestaat

De verouderde OpenSpec-werking werkt, maar is **vergrendeld**:

- **Instructies zijn hardgecodeerd** — verborgen in TypeScript, je kunt ze niet aanpassen
- **Alles-of-niets** — één grote opdracht maakt alles aan, je kunt individuele onderdelen niet testen
- **Vaste structuur** — dezelfde werkwijze voor iedereen, geen maatwerk
- **Zwarte doos** — wanneer de AI-output slecht is, kun je de prompts niet aanpassen

**OPSX opent het.** Nu kan iedereen:

1. **Experimenteren met instructies** — bewerk een sjabloon, kijk of de AI het beter doet
2. **Granulair testen** — valideer de instructies van elk artefact afzonderlijk
3. **Werkwijzen aanpassen** — definieer je eigen artefacten en afhankelijkheden
4. **Snel itereren** — pas een sjabloon aan, test direct, geen herbouw

```
Verouderde werkwijze:                 OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Hardgecodeerd in      │           │  schema.yaml           │◄── Dit bewerk je
│  pakket (kan niet      │           │  templates/*.md        │◄── Of dit
│  veranderen)           │           │        ↓               │
│        ↓               │           │  Direct effect         │
│  Wacht op nieuwe       │           │        ↓               │
│  release               │           │  Test het zelf         │
│        ↓               │           │                        │
│  Hopen dat het beter   │           │                        │
│  is                    │           │                        │
└────────────────────────┘           └────────────────────────┘
```

**Dit is voor iedereen:**
- **Teams** — creëer werkwijzen die aansluiten bij hoe je daadwerkelijk werkt
- **Geavanceerde gebruikers** — pas prompts aan voor betere AI-output voor jouw codebase
- **OpenSpec-bijdragers** — experimenteer met nieuwe benaderingen zonder releases

We zijn allemaal nog aan het leren wat het beste werkt. OPSX laat ons samen leren.

## De gebruikerservaring

**Het probleem met lineaire werkwijzen:**
Je bent "in de planningsfase", dan "in de implementatiefase", dan "klaar". Maar echt werk werkt niet zo. Je implementeert iets, realiseert dat je ontwerp verkeerd was, moet specificaties bijwerken, en gaat door met implementeren. Lineaire fases staan haaks op hoe werk daadwerkelijk verloopt.

**OPSX-benadering:**
- **Acties, geen fases** — creëer, implementeer, werk bij, archiveer — doe ze op elk moment
- **Afhankelijkheden zijn ontsluiters** — ze tonen wat mogelijk is, niet wat als volgende vereist is

```
  voorstel ──→ specificaties ──→ ontwerp ──→ taken ──→ implementatie
```

## Installatie

```bash
# Zorg dat openspec is geïnstalleerd — vaardigheden worden automatisch gegenereerd
openspec init
```

Dit maakt vaardigheden aan in `.claude/skills/` (of equivalent) die AI-codingassistenten automatisch detecteren.

Standaard gebruikt OpenSpec het `core` werkwijzeprofiel (`propose`, `explore`, `apply`, `sync`, `archive`). Als je de uitgebreide werkwijzeopdrachten wilt (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`), configureer ze met `openspec config profile` en pas toe met `openspec update`.

Tijdens de installatie wordt je gevraagd een **projectconfiguratie** aan te maken (`openspec/config.yaml`). Dit is optioneel maar aanbevolen.

## Projectconfiguratie

Met de projectconfiguratie kun je standaardwaarden instellen en projectspecifieke context injecteren in alle artefacten.

### Configuratie aanmaken

Configuratie wordt aangemaakt tijdens `openspec init`, of handmatig:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  API-conventies: RESTful, JSON-responsen
  Testen: Vitest voor unit tests, Playwright voor e2e
  Stijl: ESLint met Prettier, strikte TypeScript

rules:
  proposal:
    - Inclusief terugvalplan
    - Identificeer betrokken teams
  specs:
    - Gebruik Given/When/Then-formaat voor scenario's
  design:
    - Inclusief sequentiediagrammen voor complexe stromen
```

### Configuratievelden

| Veld | Type | Beschrijving |
|------|------|--------------|
| `schema` | string | Standaardschema voor nieuwe wijzigingen (bijv. `spec-driven`) |
| `context` | string | Projectcontext die in alle artefactinstructies wordt geïnjecteerd |
| `rules` | object | Regels per artefact, sleutel op artefact-ID |

### Hoe het werkt

**Schemavoorrang** (hoogste naar laagste):
1. CLI-vlag (`--schema <naam>`)
2. Wijzigingsmetadata (`.openspec.yaml` in wijzigingsmap)
3. Projectconfiguratie (`openspec/config.yaml`)
4. Standaard (`spec-driven`)

**Contextinjectie:**
- Context wordt voorafgeplakt aan elke artefactinstructie
- Omhuld door `<context>...</context>` tags
- Helpt AI de conventies van je project te begrijpen

**Regelinjectie:**
- Regels worden alleen geïnjecteerd voor overeenkomende artefacten
- Omhuld door `<rules>...</rules>` tags
- Verschijnen na de context, vóór het sjabloon

### Artefact-ID's per schema

**spec-driven** (standaard):
- `proposal` — Wijzigingsvoorstel
- `specs` — Specificaties
- `design` — Technisch ontwerp
- `taken` — Implementatietaken

### Configuratievalidatie

- Onbekende artefact-ID's in `rules` genereren waarschuwingen
- Schemanamen worden gevalideerd tegen beschikbare schema's
- Context heeft een limiet van 50KB
- Ongeldige YAML wordt gerapporteerd met regelnummers

### Probleemoplossing

**"Onbekend artefact-ID in regels: X"**
- Controleer of artefact-ID's overeenkomen met je schema (zie lijst hierboven)
- Voer `openspec schemas --json` uit om artefact-ID's per schema te bekijken

**Configuratie wordt niet toegepast:**
- Zorg dat het bestand op `openspec/config.yaml` staat (niet `.yml`)
- Controleer YAML-syntax met een validator
- Configuratieveranderingen worden direct van kracht (geen herstart nodig)

**Context te groot:**
- Context is beperkt tot 50KB
- Vat samen of verwijs naar externe documenten

## Opdrachten

| Opdracht | Wat het doet |
|----------|--------------|
| `/opsx:propose` | Maak een wijziging en genereer planningsartefacten in één stap (standaard snelle route) |
| `/opsx:explore` | Denk ideeën door, onderzoek problemen, verhelder vereisten |
| `/opsx:new` | Start een nieuw wijzigingsskelet (uitgebreide werkwijze) |
| `/opsx:continue` | Maak het volgende artefact aan (uitgebreide werkwijze) |
| `/opsx:ff` | Snel vooruit met planningsartefacten (uitgebreide werkwijze) |
| `/opsx:apply` | Implementeer taken, werk artefacten bij waar nodig |
| `/opsx:verify` | Valideer implementatie tegen artefacten (uitgebreide werkwijze) |
| `/opsx:sync` | Synchroniseer delta-specificaties naar hoofd (standaard werkwijze, optioneel) |
| `/opsx:archive` | Archiveer wanneer klaar |
| `/opsx:bulk-archive` | Archiveer meerdere voltooide wijzigingen (uitgebreide werkwijze) |
| `/opsx:onboard` | Begeleide doorloop van een eind-tot-eind-wijziging (uitgebreide werkwijze) |

## Gebruik

### Verken een idee
```
/opsx:explore
```
Denk ideeën door, onderzoek problemen, vergelijk opties. Geen structuur vereist - gewoon een denkpartner. Wanneer inzichten kristalliseren, ga dan over naar `/opsx:propose` (standaard) of `/opsx:new`/`/opsx:ff` (uitgebreid).

### Start een nieuwe wijziging
```
/opsx:propose
```
Maakt de wijziging aan en genereert de planningsartefacten die nodig zijn vóór implementatie.

Als je uitgebreide werkwijzen hebt ingeschakeld, kun je in plaats daarvan gebruiken:

```text
/opsx:new        # alleen skelet
/opsx:continue   # maak één artefact tegelijk aan
/opsx:ff         # maak alle planningsartefacten in één keer aan
```

### Artefacten aanmaken
```
/opsx:continue
```
Toont wat klaar is om aan te maken op basis van afhankelijkheden, en maakt dan één artefact aan. Gebruik herhaaldelijk om je wijziging stapsgewijs op te bouwen.

```
/opsx:ff add-dark-mode
```
Maakt alle planningsartefacten in één keer aan. Gebruik wanneer je een duidelijk beeld hebt van wat je bouwt.

### Implementeren (het flexibele deel)
```
/opsx:apply
```
Werkt taken af, vinkt ze af terwijl je bezig bent. Als je met meerdere wijzigingen tegelijk werkt, kun je `/opsx:apply <naam>` uitvoeren; anders moet het uit de conversatie afleiden en je vragen te kiezen als het het niet kan bepalen.

### Afronden
```
/opsx:archive   # Verplaats naar archief wanneer klaar (vraagt om specificaties te synchroniseren indien nodig)
```

## Wanneer bijwerken versus opnieuw beginnen

Je kunt altijd je voorstel of specificaties bewerken vóór implementatie. Maar wanneer wordt verfijnen "dit is ander werk"?

### Wat een voorstel vastlegt

Een voorstel definieert drie dingen:
1. **Intentie** — Welk probleem los je op?
2. **Bereik** — Wat valt binnen/buiten de scope?
3. **Aanpak** — Hoe ga je het oplossen?

De vraag is: wat is veranderd, en hoeveel?

### Werk de bestaande wijziging bij wanneer:

**Zelfde intentie, verfijnde uitvoering**
- Je ontdekt randgevallen die je niet had overwogen
- De aanpak heeft aanpassing nodig maar het doel is ongewijzigd
- Implementatie onthult dat het ontwerp licht afweek

**Bereik versmalt**
- Je realiseert dat het volledige bereik te groot is, wilt eerst een MVP opleveren
- "Voeg donkere modus toe" → "Voeg donkere modus-schakelaar toe (systeemvoorkeur in v2)"

**Leergestuurde correcties**
- Codebase is niet gestructureerd zoals je dacht
- Een afhankelijkheid werkt niet als verwacht
- "Gebruik CSS-variabelen" → "Gebruik in plaats daarvan Tailwind's dark: prefix"

### Start een nieuwe wijziging wanneer:

**Intentie fundamenteel veranderd**
- Het probleem zelf is nu anders
- "Voeg donkere modus toe" → "Voeg uitgebreid themasysteem toe met aangepaste kleuren, lettertypen, afstanden"

**Bereik explodeerde**
- Wijziging is zo gegroeid dat het in wezen ander werk is
- Origineel voorstel zou na updates onherkenbaar zijn
- "Herstel loginbug" → "Herschrijf authenticatiesysteem"

**Origineel is voltooiibaar**
- De originele wijziging kan als "klaar" worden gemarkeerd
- Nieuw werk staat op zichzelf, geen verfijning
- Voltooi "Voeg donkere modus MVP toe" → Archiveer → Nieuwe wijziging "Verbeter donkere modus"

### De vuistregels

```
                        ┌─────────────────────────────────────┐
                        │     Is dit hetzelfde werk?          │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Zelfde intentie?   >50% overlap?     Kan origineel
             Zelfde probleem?   Zelfde bereik?    "klaar" zijn zonder
                    │                  │          deze veranderingen?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         JA                NEE JA           NEE NEE             JA
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       BIJWERKEN        NIEUW BIJWERKEN   NIEUW BIJWERKEN     NIEUW
```

| Test | Bijwerken | Nieuwe wijziging |
|------|-----------|------------------|
| **Identiteit** | "Hetzelfde, verfijnd" | "Ander werk" |
| **Bereikoverlap** | >50% overlapt | <50% overlapt |
| **Voltooiing** | Kan niet "klaar" zijn zonder veranderingen | Kan origineel afmaken, nieuw werk staat op zichzelf |
| **Verhaal** | Bijwerkingsketen vertelt coherent verhaal | Patches zouden meer verwarren dan verhelderen |

### Het principe

> **Bijwerken behoudt context. Nieuwe wijziging biedt helderheid.**
>
> Kies bijwerken wanneer de geschiedenis van je denkproces waardevol is.
>
> Kies nieuw wanneer opnieuw beginnen duidelijker zou zijn dan bijwerken.

Denk aan het als git-branches:
- Blijf committen terwijl je aan dezelfde functionaliteit werkt
- Start een nieuwe branch wanneer het echt nieuw werk is
- Soms merge je een gedeeltelijke functionaliteit en begin je fris voor fase 2

## Wat is er anders?

| | Verouderd (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Structuur** | Eén groot voorsteldocument | Discrete artefacten met afhankelijkheden |
| **Workflow** | Lineaire fasen: plan → implementeren → archiveren | Vloeiende acties — doe op elk moment alles |
| **Iteratie** | Ongemakkelijk om terug te gaan | Werk artefacten bij naarmate je leert |
| **Aanpassing** | Vaste structuur | Schema-gestuurd (definieer je eigen artefacten) |

**Het belangrijkste inzicht:** werk is niet lineair. OPSX doet alsof dat niet zo is.

## Diepgaande Architectuuranalyse

Dit gedeelte legt uit hoe OPSX onder de motorkap werkt en hoe het zich verhoudt tot de verouderde werkstroom.
Voorbeelden in dit gedeelte maken gebruik van de uitgebreide commandoset (`new`, `continue`, etc.); standaard `core`-gebruikers kunnen dezelfde stroom toewijzen aan `propose → apply → sync → archive`.

### Filosofie: Fasen versus Acties

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

### Componentarchitectuur

**Verouderde werkstroom** maakt gebruik van vastgelegde sjablonen in TypeScript:

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

**OPSX** maakt gebruik van externe schema's en een afhankelijkheidsgrafeen-engine:

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

### Afhankelijkheidsgrafeenmodel

Artefacten vormen een gericht acyclisch graaf (DAG). Afhankelijkheden zijn **enablers**, geen poorten:

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

**Toestandsovergangen:**

```
   BLOCKED ────────────────► READY ────────────────► DONE
      │                        │                       │
   Missing                  All deps               File exists
   dependencies             are DONE               on filesystem
```

### Informatiestroom

**Verouderde werkstroom** — agent ontvangt statische instructies:

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

**Verouderde werkstroom** — onhandig om te itereren:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Wait, the design is wrong"
       │               │
       │               ├── Options:
       │               │   • Edit files manually (breaks context)
       │               │   • Abandon and start over
       │               │   • Push through and fix later
       │               │
       │               └── No official "go back" mechanism
       │
       └── Creates ALL artifacts at once
```

**OPSX** — natuurlijke iteratie:

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── "The design is wrong"
      │                │                  │
      │                │                  ▼
      │                │            Just edit design.md
      │                │            and continue!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply picks up
      │                │         where you left off
      │                │
      │                └── Creates ONE artifact, shows what's unlocked
      │
      └── Scaffolds change, waits for direction
```

### Aangepaste Schema's

Maak aangepaste werkstromen met behulp van de schema-beheercommando's:

```bash
# Create a new schema from scratch (interactive)
openspec schema init my-workflow

# Or fork an existing schema as a starting point
openspec schema fork spec-driven my-workflow

# Validate your schema structure
openspec schema validate my-workflow

# See where a schema resolves from (useful for debugging)
openspec schema which my-workflow
```

Schema's worden opgeslagen in `openspec/schemas/` (projectlokaal, versiebeheerd) of `~/.local/share/openspec/schemas/` (gebruikersglobaal).

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
  - id: research        # Added before proposal
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Now depends on research

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**Afhankelijkheidsgrafeen:**
```
   research ──► proposal ──► tasks
```

### Samenvatting

| Aspect | Legacy | OPSX |
|--------|----------|------|
| **Sjablonen** | Vastgelegde TypeScript | Externe YAML + Markdown |
| **Afhankelijkheden** | Geen (alles tegelijk) | DAG met topologische sortering |
| **Toestand** | Fase-gebaseerd mentaal model | Bestandssysteem aanwezigheid |
| **Aanpasbaarheid** | Bron bewerken, herbouwen | schema.yaml aanmaken |
| **Iteratie** | Fase-vergrendeld | Vloeiend, alles bewerkbaar |
| **Editorondersteuning** | Toolspecifieke configurator/adapters | Enkele vaardighedenmap |

## Schema's

Schema's definiëren welke artefacten bestaan en hun afhankelijkheden. Momenteel beschikbaar:

- **spec-gestuurd** (standaard): voorstel → specificaties → ontwerp → taken

```bash
# List available schemas
openspec schemas

# See all schemas with their resolution sources
openspec schema which --all

# Create a new schema interactively
openspec schema init my-workflow

# Fork an existing schema for customization
openspec schema fork spec-driven my-workflow

# Validate schema structure before use
openspec schema validate my-workflow
```

## Tips

- Gebruik `/opsx:explore` om een idee door te denken voordat je een wijziging doorvoert
- `/opsx:ff` wanneer je weet wat je wilt, `/opsx:continue` wanneer je aan het verkennen bent
- Tijdens `/opsx:apply`, als er iets mis is — repareer het artefact en ga dan verder
- Taken volgen de voortgang via selectievakjes in `tasks.md`
- Controleer de status op elk moment: `openspec status --change "name"`

## Feedback

Dit is ruw. Dat is met opzet — we leren wat werkt.

Heb je een bug gevonden? Heb je ideeën? Doe mee op [Discord](https://discord.gg/YctCnvvshC) of open een issue op [GitHub](https://github.com/Fission-AI/openspec/issues).