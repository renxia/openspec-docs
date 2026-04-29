# OPSX Werkwijze

> Feedback is welkom op [Discord](https://discord.gg/YctCnvvshC).

## Wat is het?

OPSX is nu de standaardwerkwijze voor OpenSpec.

Het is een **vloeiende, iteratieve werkwijze** voor OpenSpec-wijzigingen. Geen rigide fases meer — alleen acties die je op elk moment kunt uitvoeren.

## Waarom dit bestaat

De legacy OpenSpec-workflow werkt, maar is **afgesloten**:

- **Instructies zijn hardcoded** — verborgen in TypeScript, je kunt ze niet aanpassen
- **Alles-of-niets** — één groot commando maakt alles aan, je kunt geen individuele onderdelen testen
- **Vaste structuur** — dezelfde workflow voor iedereen, geen aanpassing mogelijk
- **Black box** — wanneer de AI-uitvoer slecht is, kun je de prompts niet bijstellen

**OPSX opent het.** Nu kan iedereen:

1. **Experimenteren met instructies** — bewerk een template, kijk of de AI het beter doet
2. **Gefaseerd testen** — valideer de instructies van elk artefact onafhankelijk
3. **Workflows aanpassen** — definieer je eigen artefacten en afhankelijkheden
4. **Snel itereren** — wijzig een template, test direct, geen herbouw nodig

```
Legacy workflow:                      OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Hardcoded in package  │           │  schema.yaml           │◄── Dit bewerk je
│  (niet aanpasbaar)     │           │  templates/*.md        │◄── Of dit
│        ↓               │           │        ↓               │
│  Wacht op nieuwe       │           │  Direct effect         │
│  release               │           │        ↓               │
│        ↓               │           │  Test het zelf         │
│  Hopelijk is het beter │           │                        │
└────────────────────────┘           └────────────────────────┘
```

**Dit is voor iedereen:**
- **Teams** — maak workflows die passen bij hoe je daadwerkelijk werkt
- **Geavanceerde gebruikers** — stel prompts bij om betere AI-uitvoer voor je codebase te krijgen
- **OpenSpec-bijdragers** — experimenteer met nieuwe aanpakken zonder releases

We leren nog steeds allemaal wat het beste werkt. OPSX laat ons samen leren.

## De Gebruikerservaring

**Het probleem met lineaire workflows:**
Je bent "in de planningsfase", dan "in de implementatiefase", en dan "klaar". Maar echt werk gaat niet zo. Je implementeert iets, beseft dat je ontwerp fout was, moet specificaties bijwerken, ga door met implementeren. Lineaire fases vechten tegen hoe werk daadwerkelijk gebeurt.

**OPSX-aanpak:**
- **Acties, geen fases** — aanmaken, implementeren, bijwerken, archiveren — doe dit op elk moment
- **Afhankelijkheden zijn mogelijkheden** — ze laten zien wat mogelijk is, niet wat er als volgt moet gebeuren

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Installatie

```bash
# Zorg ervoor dat openspec geïnstalleerd is — skills worden automatisch gegenereerd
openspec init
```

Dit maakt skills aan in `.claude/skills/` (of equivalent) die door AI-coding-assistenten automatisch worden gedetecteerd.

Standaard gebruikt OpenSpec het `core` workflowprofiel (`propose`, `explore`, `apply`, `archive`). Als je de uitgebreide workflowcommando's wilt (`new`, `continue`, `ff`, `verify`, `sync`, `bulk-archive`, `onboard`), configureer deze met `openspec config profile` en pas ze toe met `openspec update`.

Tijdens de installatie wordt je gevraagd een **projectconfiguratie** (`openspec/config.yaml`) aan te maken. Dit is optioneel maar aanbevolen.

## Projectconfiguratie

Projectconfiguratie laat je standaardwaarden instellen en project-specifieke context injecteren in alle artefacten.

### Configuratie aanmaken

Configuratie wordt aangemaakt tijdens `openspec init`, of handmatig:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  API conventions: RESTful, JSON responses
  Testing: Vitest for unit tests, Playwright for e2e
  Style: ESLint with Prettier, strict TypeScript

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format for scenarios
  design:
    - Include sequence diagrams for complex flows
```

### Configuratievelden

| Veld | Type | Beschrijving |
|-------|------|-------------|
| `schema` | string | Standaardschema voor nieuwe wijzigingen (bijv. `spec-driven`) |
| `context` | string | Projectcontext die in de instructies van elk artefact wordt geïnjecteerd |
| `rules` | object | Regels per artefact, geïdentificeerd door artefact-ID |

### Hoe het werkt

**Schema-voorrang** (hoogste naar laagste):
1. CLI-vlag (`--schema <naam>`)
2. Wijzigingsmetadata (`.openspec.yaml` in wijzigingsmap)
3. Projectconfiguratie (`openspec/config.yaml`)
4. Standaard (`spec-driven`)

**Contextinjectie:**
- Context wordt voorafgegaan aan de instructies van elk artefact
- Gewikkeld in `<context>...</context>` tags
- Helpt AI de conventies van je project te begrijpen

**Regelinjectie:**
- Regels worden alleen geïnjecteerd voor overeenkomende artefacten
- Gewikkeld in `<rules>...</rules>` tags
- Verschijnen na context, voor het template

### Artefact-ID's per Schema

**spec-driven** (standaard):
- `proposal` — Wijzigingsvoorstel
- `specs` — Specificaties
- `design` — Technisch ontwerp
- `tasks` — Implementatietaken

### Configuratievalidatie

- Onbekende artefact-ID's in `rules` genereren waarschuwingen
- Schemanamen worden gevalideerd tegen beschikbare schema's
- Context heeft een limiet van 50KB
- Ongeldige YAML wordt gerapporteerd met regelnummers

### Probleemoplossing

**"Unknown artifact ID in rules: X"**
- Controleer of artefact-ID's overeenkomen met je schema (zie bovenstaande lijst)
- Voer `openspec schemas --json` uit om artefact-ID's voor elk schema te zien

**Configuratie wordt niet toegepast:**
- Zorg ervoor dat het bestand op `openspec/config.yaml` staat (niet `.yml`)
- Controleer de YAML-syntaxis met een validator
- Configuratieaanpassingen worden direct van kracht (geen herstart nodig)

**Context te groot:**
- Context is beperkt tot 50KB
- Vat samen of link naar externe documentatie in plaats daarvan

## Commando's

| Commando | Wat het doet |
|---------|--------------|
| `/opsx:propose` | Maak een wijziging en genereer planningsartefacten in één stap (standaard snelle route) |
| `/opsx:explore` | Denk na over ideeën, onderzoek problemen, verduidelijk vereisten |
| `/opsx:new` | Start een nieuwe wijzigingsscaffold (uitgebreide workflow) |
| `/opsx:continue` | Maak het volgende artefact aan (uitgebreide workflow) |
| `/opsx:ff` | Snel door naar planningsartefacten (uitgebreide workflow) |
| `/opsx:apply` | Implementeer taken, werk artefacten bij indien nodig |
| `/opsx:verify` | Valideer implementatie tegen artefacten (uitgebreide workflow) |
| `/opsx:sync` | Synchroniseer delta-specificaties naar hoofd (uitgebreide workflow, optioneel) |
| `/opsx:archive` | Archiveer wanneer klaar |
| `/opsx:bulk-archive` | Archiveer meerdere voltooide wijzigingen (uitgebreide workflow) |
| `/opsx:onboard` | Begeleide rondleiding door een end-to-end wijziging (uitgebreide workflow) |

## Gebruik

### Verken een idee
```
/opsx:explore
```
Denk na over ideeën, onderzoek problemen, vergelijk opties. Geen structuur vereist - gewoon een denkpartner. Wanneer inzichten kristalliseren, ga over naar `/opsx:propose` (standaard) of `/opsx:new`/`/opsx:ff` (uitgebreid).

### Start een nieuwe wijziging
```
/opsx:propose
```
Maakt de wijziging aan en genereert de planningsartefacten die nodig zijn vóór implementatie.

Als je uitgebreide workflows hebt ingeschakeld, kun je in plaats daarvan gebruiken:

```text
/opsx:new        # alleen scaffold
/opsx:continue   # maak één artefact per keer
/opsx:ff         # maak alle planningsartefacten tegelijk
```

### Maak artefacten aan
```
/opsx:continue
```
Toont wat er gereed is om aan te maken op basis van afhankelijkheden, en maakt dan één artefact aan. Gebruik herhaaldelijk om je wijziging geleidelijk op te bouwen.

```
/opsx:ff add-dark-mode
```
Maakt alle planningsartefacten tegelijk aan. Gebruik wanneer je een duidelijk beeld hebt van wat je bouwt.

### Implementeer (het vloeiende deel)
```
/opsx:apply
```
Werkt door taken, en vinkt ze af naarmate je vordert. Als je met meerdere wijzigingen bezig bent, kun je `/opsx:apply <naam>` uitvoeren; anders moet het uit de conversatie afleiden en je vragen te kiezen als het niet zeker is.

### Afronden
```
/opsx:archive   # Verplaats naar archief wanneer klaar (vraagt om specificaties te synchroniseren indien nodig)
```

## Wanneer bijwerken vs. opnieuw beginnen

Je kunt altijd je voorstel of specificaties bewerken vóór implementatie. Maar wanneer wordt verfijnen "dit is ander werk"?

### Wat een Voorstel Vastlegt

Een voorstel definieert drie dingen:
1. **Intentie** — Welk probleem los je op?
2. **Omvang** — Wat valt binnen/buiten de scope?
3. **Aanpak** — Hoe ga je het oplossen?

De vraag is: wat is er veranderd, en hoeveel?

### Bestaande Wijziging Bijwerken Wanneer:

**Zelfde intentie, verfijnde uitvoering**
- Je ontdekt randgevallen die je niet had overwogen
- De aanpak moet worden bijgesteld maar het doel is onveranderd
- Implementatie onthult dat het ontwerp licht afweek

**Omvang verkleint**
- Je beseft dat de volledige omvang te groot is, wil eerst de MVP uitbrengen
- "Voeg donkere modus toe" → "Voeg schakelaar voor donkere modus toe (systeemvoorkeur in v2)"

**Op leer gebaseerde correcties**
- Codebase is niet gestructureerd zoals je dacht
- Een afhankelijkheid werkt niet zoals verwacht
- "Gebruik CSS-variabelen" → "Gebruik in plaats daarvan Tailwinds dark: prefix"

### Nieuwe Wijziging Starten Wanneer:

**Intentie fundamenteel veranderd**
- Het probleem zelf is nu anders
- "Voeg donkere modus toe" → "Voeg uitgebreid themasysteem toe met aangepaste kleuren, lettertypen, afstanden"

**Omvang geëxplodeerd**
- Wijziging is zo gegroeid dat het in wezen ander werk is
- Origineel voorstel zou na updates onherkenbaar zijn
- "Herstel loginbug" → "Herschrijf authenticatiesysteem"

**Origineel is af te ronden**
- De originele wijziging kan als "klaar" worden gemarkeerd
- Nieuw werk staat op zichzelf, geen verfijning
- Voltooi "Voeg donkere modus MVP toe" → Archiveer → Nieuwe wijziging "Verbeter donkere modus"

### De Heuristieken

```
                        ┌─────────────────────────────────────┐
                        │     Is dit hetzelfde werk?          │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Zelfde intentie?   >50% overlap?      Kan origineel
             Zelfde probleem?   Zelfde scope?      "klaar" zijn zonder
                    │                  │          deze wijzigingen?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         JA                NEE JA            NEE NEE             JA
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       BIJWERKEN         NIEUW BIJWERKEN   NIEUW BIJWERKEN     NIEUW
```

| Test | Bijwerken | Nieuwe Wijziging |
|------|--------|------------|
| **Identiteit** | "Zelfde ding, verfijnd" | "Ander werk" |
| **Scope-overlap** | >50% overlap | <50% overlap |
| **Voltooiing** | Kan niet "klaar" zijn zonder wijzigingen | Kan origineel afmaken, nieuw werk staat op zichzelf |
| **Verhaal** | Bijwerkingsketen vertelt coherent verhaal | Patches zouden meer verwarren dan verduidelijken |

### Het Principe

> **Bijwerken bewaart context. Nieuwe wijziging biedt duidelijkheid.**
>
> Kies bijwerken wanneer de geschiedenis van je denken waardevol is.
> Kies nieuw wanneer opnieuw beginnen duidelijker zou zijn dan patchen.

Denk eraan als git-branches:
- Blijf committen terwijl je aan dezelfde feature werkt
- Start een nieuwe branch wanneer het echt nieuw werk is
- Soms merge je een gedeeltelijke feature en begin je opnieuw voor fase 2

## Wat is er anders?

| | Legacy (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Structuur** | Eén groot voorsteldocument | Afzonderlijke artefacten met afhankelijkheden |
| **Werkwijze** | Lineaire fasen: plannen → implementeren → archiveren | Vloeibare acties — doe op elk moment wat je wilt |
| **Iteratie** | Ongemakkelijk om terug te gaan | Werk artefacten bij naarmate je leert |
| **Aanpassing** | Vaste structuur | Schema-gestuurd (definieer je eigen artefacten)

**De kernboodschap:** werk is niet lineair. OPSX houdt op te doen alsof dat wel zo is.

## Architectuurverdieping

Dit legt uit hoe OPSX onder de motorkap werkt en hoe het zich verhoudt tot de legacy workflow.
Voorbeelden in dit onderdeel maken gebruik van de uitgebreide commandoset (`new`, `continue`, etc.); standaard `core` gebruikers kunnen dezelfde flow koppelen aan `propose → apply → archive`.

### Filosofie: Fasen vs Acties

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LEGACY WORKFLOW                                      │
│                    (Fase-geblokkeerd, Alles-of-niets)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │             │
│   │    FASE      │      │    FASE      │      │    FASE      │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Maakt ALLE artefacten tegelijk aan                                     │
│   • Kan niet terug naar specificaties tijdens implementatie                 │
│   │ Fasepoorten afdwingen lineaire voortgang                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                            OPSX WORKFLOW                                     │
│                      (Vloeibare Acties, Iteratief)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           ACTIES (geen fasen)              │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              willekeurige volgorde         │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Maak artefacten één voor één aan OF ga snel vooruit                    │
│   • Update specificaties/ontwerp/taken tijdens implementatie                │
│   • Afhankelijkheden maken voortgang mogelijk, fasen bestaan niet          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Componentarchitectuur

**Legacy workflow** maakt gebruik van hardcoded templates in TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      LEGACY WORKFLOW COMPONENTEN                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Hardcoded Templates (TypeScript strings)                                  │
│                    │                                                        │
│                    ▼                                                        │
│   Tool-specifieke configurators/adapters                                    │
│                    │                                                        │
│                    ▼                                                        │
│   Gegenereerde Commandobestanden (.claude/commands/openspec/*.md)           │
│                                                                             │
│   • Vaste structuur, geen artefact-bewustzijn                               │
│   • Wijziging vereist code-aanpassing + herbouw                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** maakt gebruik van externe schema's en een afhankelijkheidsgrafen-engine:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OPSX COMPONENTEN                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Schema-definities (YAML)                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Afhankelijkheden                 │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Glob patronen                    │   │
│   │      requires: [proposal]      ◄── Maakt mogelijk na proposal       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Artefact-grafen-engine                                                    │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Topologische sortering (afhankelijkheidsvolgorde)                │   │
│   │  • Statusdetectie (bestandssysteem-bestaan)                         │   │
│   │  • Rijke instructiegeneratie (templates + context)                  │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Skill-bestanden (.claude/skills/openspec-*/SKILL.md)                      │
│                                                                             │
│   • Compatibel met meerdere editors (Claude Code, Cursor, Windsurf)         │
│   • Skills vragen CLI om gestructureerde gegevens                           │
│   • Volledig aanpasbaar via schemabestanden                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Afhankelijkheidsgraafmodel

Artefacten vormen een gerichte acyclische graaf (DAG). Afhankelijkheden zijn **mogelijkmakers**, geen poorten:

```
                              proposal
                             (wortelknooppunt)
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
                 specs                       design
              (vereist:                    (vereist:
               proposal)                   proposal)
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                               tasks
                           (vereist:
                           specs, design)
                                  │
                                  ▼
                          ┌──────────────┐
                          │ APPLY FASE   │
                          │ (vereist:    │
                          │  tasks)      │
                          └──────────────┘
```

**Statustransities:**

```
   GEBLOKKEERD ────────────────► GEREED ────────────────► KLAAR
      │                            │                       │
   Ontbrekende                  Alle deps               Bestand bestaat
   afhankelijkheden             zijn KLAAR               op bestandssysteem
```

### Informatiestroom

**Legacy workflow** — agent ontvangt statische instructies:

```
  Gebruiker: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Statische instructies:                 │
  │  • Maak proposal.md                     │
  │  • Maak tasks.md                        │
  │  • Maak design.md                       │
  │  • Maak specs/<capability>/spec.md      │
  │                                         │
  │  Geen bewustzijn van wat er bestaat of  │
  │  afhankelijkheden tussen artefacten     │
  └─────────────────────────────────────────┘
           │
           ▼
  Agent maakt ALLE artefacten in één keer aan
```

**OPSX** — agent vraagt om rijke context:

```
  Gebruiker: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Stap 1: Vraag huidige status op                                        │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec status --change "add-auth" --json                      │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "artifacts": [                                                  │  │
  │  │      {"id": "proposal", "status": "done"},                         │  │
  │  │      {"id": "specs", "status": "ready"},      ◄── Eerste gereed    │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked", "missingDeps": ["specs"]}│  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Stap 2: Verkrijg rijke instructies voor gereed artefact                 │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec instructions specs --change "add-auth" --json          │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "template": "# Specificatie\n\n## TOEGEVOEGDE Vereisten...",    │  │
  │  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
  │  │    "unlocks": ["tasks"]                                            │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Stap 3: Lees afhankelijkheden → Maak ÉÉN artefact aan → Toon wat       │
  │          ontgrendeld is                                                  │
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
       │               │   • Bestanden handmatig bewerken (breekt context)
       │               │   • Stoppen en opnieuw beginnen
       │               │   • Doorgaan en later fixen
       │               │
       │               └── Geen officiële "terug"-mechanisme
       │
       └── Maakt ALLE artefacten tegelijk aan
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
      │                │         /opsx:apply pakt op
      │                │         waar je was gebleven
      │                │
      │                └── Maakt ÉÉN artefact aan, toont wat ontgrendeld is
      │
      └── Scaffold de wijziging, wacht op richting
```

### Aangepaste Schema's

Maak aangepaste workflows met behulp van de schemabeheercommando's:

```bash
# Maak een nieuw schema vanaf nul (interactief)
openspec schema init my-workflow

# Of forkeer een bestaand schema als startpunt
openspec schema fork spec-driven my-workflow

# Valideer je schemastuctuur
openspec schema validate my-workflow

# Bekijk waar een schema vandaan komt (nuttig voor foutopsporing)
openspec schema which my-workflow
```

Schema's worden opgeslagen in `openspec/schemas/` (projectlokaal, versiebeheerd) of `~/.local/share/openspec/schemas/` (gebruikerglobaal).

**Schemastuctuur:**
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

**Afhankelijkheidsgraaf:**
```
   research ──► proposal ──► tasks
```

### Samenvatting

| Aspect | Legacy | OPSX |
|--------|----------|------|
| **Templates** | Hardcoded TypeScript | Extern YAML + Markdown |
| **Afhankelijkheden** | Geen (alles tegelijk) | DAG met topologische sortering |
| **Status** | Fase-gebaseerd mentaal model | Bestandssysteem-bestaan |
| **Aanpassing** | Bron bewerken, herbouwen | Maak schema.yaml |
| **Iteratie** | Fase-geblokkeerd | Vloeibaar, bewerk alles |
| **Editorondersteuning** | Tool-specifieke configurator/adapters | Enkele skills-map |

## Schema's

Schema's definiëren welke artefacten bestaan en hun afhankelijkheden. Momenteel beschikbaar:

- **spec-driven** (standaard): voorstel → specificaties → ontwerp → taken

```bash
# Lijst met beschikbare schema's
openspec schemas

# Bekijk alle schema's met hun resolutiebronnen
openspec schema which --all

# Maak interactief een nieuw schema aan
openspec schema init my-workflow

# Fork een bestaand schema voor aanpassing
openspec schema fork spec-driven my-workflow

# Valideer de structuur van het schema voor gebruik
openspec schema validate my-workflow
```

## Tips

- Gebruik `/opsx:explore` om een idee te overdenken voordat je een wijziging doorvoert
- `/opsx:ff` wanneer je weet wat je wilt, `/opsx:continue` wanneer je verkent
- Tijdens `/opsx:apply`, als er iets misgaat — herstel het artefact, ga dan verder
- Taken volgen de voortgang via selectievakjes in `tasks.md`
- Controleer op elk moment de status: `openspec status --change "name"`

## Feedback

Dit is ruw. Dat is opzet — we leren wat werkt.

Een bug gevonden? Ideeën? Sluit je aan bij ons op [Discord](https://discord.gg/YctCnvvshC) of open een issue op [GitHub](https://github.com/Fission-AI/openspec/issues).