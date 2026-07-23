# Aanpassing

OpenSpec biedt drie niveaus van aanpassing:

| Niveau | Wat het doet | Geschikt voor |
|-------|--------------|----------|
| **Projectconfiguratie** | Standaardwaarden instellen, context/regels injecteren | De meeste teams |
| **Aangepaste schema's** | Definieer uw eigen workflow-artefacten | Teams met unieke processen |
| **Globale overschrijvingen** | Schema's delen over alle projecten | Gevorderde gebruikers |

---

## Projectconfiguratie

Het `openspec/config.yaml` bestand is de eenvoudigste manier om OpenSpec aan te passen voor uw team. Het stelt u in staat tot:

- **Stel een standaardschema in** - Sla het `--schema` argument over bij elke opdracht
- **Injecteer projectcontext** - De AI ziet uw techstack, conventies, enz.
- **Voeg per-artefact regels toe** - Aangepaste regels voor specifieke artefacten

### Snel opzetten

```bash
openspec init
```

Dit begeleidt u bij het interactief maken van een configuratie. Of maak er een handmatig:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Techstack: TypeScript, React, Node.js, PostgreSQL
  API-stijl: RESTful, gedocumenteerd in docs/api.md
  Testen: Jest + React Testing Library
  Wij hechten waarde aan achterwaartse compatibiliteit voor alle openbare API's

rules:
  proposal:
    - Neem een terugdraaiplan op
    - Identificeer getroffen teams
  specs:
    - Gebruik het Given/When/Then-formaat
    - Verwijs naar bestaande patronen voordat u nieuwe uitvindt
```

### Hoe het werkt

**Standaardschema:**

```bash
# Zonder configuratie
openspec new change my-feature --schema spec-driven

# Met configuratie - schema is automatisch
openspec new change my-feature
```

**Injectie van context en regels:**

Bij het genereren van een artefact worden uw context en regels geïnjecteerd in de AI-prompt:

```xml
<context>
Techstack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Neem een terugdraaiplan op
- Identificeer getroffen teams
</rules>

<template>
[Ingebouwd sjabloon van het schema]
</template>
```

- **Context** verschijnt in ALLE artefacten
- **Regels** verschijnen ALLEEN voor het overeenkomende artefact

### Volgorde van schema-resolutie

Wanneer OpenSpec een schema nodig heeft, controleert het in deze volgorde:

1. CLI-vlag: `--schema <naam>`
2. Wijzigingsmetadata (`.openspec.yaml` in de wijzigingsmap)
3. Projectconfiguratie (`openspec/config.yaml`)
4. Standaard (`spec-driven`)

---

## Aangepaste schema's

Wanneer projectconfiguratie niet volstaat, maakt u uw eigen schema aan met een volledig aangepaste workflow. Aangepaste schema's bevinden zich in de `openspec/schemas/` map van uw project en worden versiebeheerd met uw code.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Projectconfiguratie
│   ├── schemas/           # Aangepaste schema's bevinden zich hier
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Uw wijzigingen
└── src/
```

### Een bestaand schema forken

De snelste manier om aan te passen is om een ingebouwd schema te forken:

```bash
openspec schema fork spec-driven my-workflow
```

Dit kopieert het hele `spec-driven` schema naar `openspec/schemas/my-workflow/` waar u het vrij kunt bewerken.

**Wat u krijgt:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Workflow-definitie
└── templates/
    ├── proposal.md       # Sjabloon voor voorstelartefact
    ├── spec.md           # Sjabloon voor specificaties
    ├── design.md         # Sjabloon voor ontwerp
    └── tasks.md          # Sjabloon voor taken
```

Bewerk nu `schema.yaml` om de workflow te wijzigen, of bewerk sjablonen om te veranderen wat de AI genereert.

### Een schema vanaf nul maken

Voor een volledig nieuwe workflow:

```bash
# Interactief
openspec schema init research-first

# Niet-interactief
openspec schema init rapid \
  --description "Snelle iteratieworkflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Schema-structuur

Een schema definieert de artefacten in uw workflow en hoe ze van elkaar afhankelijk zijn:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: Aangepaste workflow van mijn team

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initiële voorstel document
    template: proposal.md
    instruction: |
      Maak een voorstel dat UITLEGT WAAROM deze wijziging nodig is.
      Focus op het probleem, niet op de oplossing.
    requires: []

  - id: design
    generates: design.md
    description: Technisch ontwerp
    template: design.md
    instruction: |
      Maak een ontwerpdocument dat UITLEGT HOE het te implementeren.
    requires:
      - proposal    # Kan geen ontwerp maken totdat het voorstel bestaat

  - id: tasks
    generates: tasks.md
    description: Implementatielijst
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Belangrijke velden:**

| Veld | Doel |
|-------|---------|
| `id` | Unieke identificatie, gebruikt in opdrachten en regels |
| `generates` | Output-bestandsnaam (ondersteunt globs zoals `specs/**/*.md`) |
| `template` | Sjabloonbestand in de `templates/` map |
| `instruction` | AI-instructies voor het maken van dit artefact |
| `requires` | Afhankelijkheden - welke artefacten eerst moeten bestaan |

### Sjablonen

Sjablonen zijn markdown-bestanden die de AI begeleiden. Ze worden geïnjecteerd in de prompt bij het maken van dat artefact.

```markdown
<!-- templates/proposal.md -->
## Waarom

<!-- Leg de motivatie voor deze wijziging uit. Welk probleem lost dit op? -->

## Wat verandert er

<!-- Beschrijf wat er zal veranderen. Wees specifiek over nieuwe mogelijkheden of aanpassingen. -->

## Impact

<!-- Getroffen code, API's, afhankelijkheden, systemen -->
```

Sjablonen kunnen bevatten:
- Sectiekoppen die de AI moet invullen
- HTML-opmerkingen met richtlijnen voor de AI
- Voorbeeldformaten die de verwachte structuur tonen

### Valideer uw schema

Voordat u een aangepast schema gebruikt, valideert u het:

```bash
openspec schema validate my-workflow
```

Dit controleert:
- De syntax van `schema.yaml` is correct
- Alle gerefereerde sjablonen bestaan
- Geen circulaire afhankelijkheden
- Artefact-ID's zijn geldig

### Gebruik uw aangepaste schema

Eenmaal gemaakt, gebruikt u uw schema met:

```bash
# Opgeven in opdracht
openspec new change feature --schema my-workflow

# Of instellen als standaard in config.yaml
schema: my-workflow
```

### Schema-resolutie debuggen

Niet zeker welk schema wordt gebruikt? Controleer het met:

```bash
# Zie waar een specifiek schema vandaan wordt opgelost
openspec schema which my-workflow

# Toon alle beschikbare schema's
openspec schema which --all
```

De output toont of het uit uw project, gebruikersmap of het pakket komt:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Opmerking:** OpenSpec ondersteunt ook gebruikersniveau-schema's in `~/.local/share/openspec/schemas/` voor delen over projecten heen, maar projectniveau-schema's in `openspec/schemas/` worden aanbevolen omdat ze versiebeheerd zijn met uw code.

---

## Voorbeelden

### Snelle iteratieworkflow

Een minimale workflow voor snelle iteraties:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Snelle iteratie met minimale overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Snel voorstel
    template: proposal.md
    instruction: |
      Maak een kort voorstel voor deze wijziging.
      Focus op wat en waarom, sla gedetailleerde specificaties over.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementatielijst
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Een review-artefact toevoegen

Fork de standaard en voeg een review-stap toe:

```bash
openspec schema fork spec-driven with-review
```

Bewerk vervolgens `schema.yaml` om toe te voegen:

```yaml
  - id: review
    generates: review.md
    description: Pre-implementatiereview checklist
    template: review.md
    instruction: |
      Maak een review-checklist op basis van het ontwerp.
      Neem veiligheid, prestaties en testoverwegingen op.
    requires:
      - design

  - id: tasks
    # ... bestaande takenconfiguratie ...
    requires:
      - specs
      - design
      - review    # Nu vereisen taken ook een review
```

---

## Community-schema's

OpenSpec ondersteunt ook door de community onderhouden schema's die via zelfstandige repositories worden verspreid. Deze bieden opinionated workflows die OpenSpec integreren met andere tools of systemen, vergelijkbaar met hoe [github/spec-kit's community extension catalog](https://github.com/github/spec-kit/tree/main/extensions) werkt voor spec-kit.

Community-schema's worden niet geleverd in de OpenSpec-core — ze bevinden zich in hun eigen repositories met hun eigen releasecyclus. Om er een te gebruiken, kopieert u de schema-bundle naar de `openspec/schemas/<schema-name>/` map van uw project (elke repo's README bevat installatie-instructies).

| Schema | Onderhouder | Repository | Beschrijving |
|--------|-----------|-----------|-------------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Integreert OpenSpec's artefactgovernance met de uitvoeringsvaardigheden van [obra/superpowers](https://github.com/obra/superpowers) (brainstormen, plannen schrijven, TDD via subagents, code review, afronden). Voegt een `retrospective`-artefact toe dat eerst bewijs vereist, waardoor een hiaat wordt opgevuld die Superpowers niet native dekt. |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | PM-first workflow. Voert de planningspijplijn van [nanopm](https://github.com/nmrtn/nanopm) uit (audit → strategie → roadmap → PRD) stroomopwaarts van de implementatie. Verbindt productplanning met de spec-gedreven engineering workflow van OpenSpec. Artefacten lezen uit `.nanopm/` indien aanwezig — het voorstel haalt de audit, het ontwerp haalt de strategie en de taken halen de PRD-uitwerking. |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | Capability-level end-to-end test-runboeken. Elke capability krijgt een onveranderlijke specificatie, een onveranderlijk taken-sjabloon en een met tijdstempel voorzien uitvoeringsrecord per uitvoering. Assertions zijn alleen observeerbaar gedrag (HTTP-status, antwoordbody, persistentie-status — nooit log-substrings); elke uitvoering registreert start/eind UTC, duur en de beste schatting van LLM-tokenverbruik. |

> Wilt u een community-schema bijdragen? Open een issue met een link naar uw repository, of dien een PR in met een toegevoegde rij in deze tabel.

---

## Zie ook

- [CLI Reference: Schema-opdrachten](cli.md#schema-commands) - Volledige opdrachtdocumentatie