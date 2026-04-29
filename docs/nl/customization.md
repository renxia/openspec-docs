# Aanpassing

OpenSpec biedt drie niveaus van aanpassing:

| Niveau | Wat het doet | Het beste voor |
|-------|--------------|----------|
| **Projectconfiguratie** | Standaarden instellen, context/regels injecteren | De meeste teams |
| **Aangepaste schema's** | Definieer je eigen workflowartefacten | Teams met unieke processen |
| **Globale overschrijvingen** | Schema's delen over alle projecten | Geavanceerde gebruikers |

---

## Projectconfiguratie

Het bestand `openspec/config.yaml` is de eenvoudigste manier om OpenSpec aan te passen voor je team. Hiermee kun je:

- **Een standaardschema instellen** - Sla `--schema` over bij elk commando
- **Projectcontext injecteren** - De AI ziet je technische stack, conventies, enz.
- **Regels per artefact toevoegen** - Aangepaste regels voor specifieke artefacten

### Snelle installatie

```bash
openspec init
```

Dit begeleidt je interactief door het aanmaken van een configuratie. Of maak er handmatig een aan:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API style: RESTful, documented in docs/api.md
  Testing: Jest + React Testing Library
  We value backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones
```

### Hoe het werkt

**Standaardschema:**

```bash
# Zonder configuratie
openspec new change my-feature --schema spec-driven

# Met configuratie - schema is automatisch
openspec new change my-feature
```

**Context- en regelinjectie:**

Bij het genereren van elk artefact worden je context en regels geïnjecteerd in het AI-prompt:

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Include rollback plan
- Identify affected teams
</rules>

<template>
[Schema's built-in template]
</template>
```

- **Context** verschijnt in ALLE artefacten
- **Regels** verschijnen ALLEEN voor het bijbehorende artefact

### Oplossingsvolgorde voor schema's

Wanneer OpenSpec een schema nodig heeft, controleert het in deze volgorde:

1. CLI-vlag: `--schema <naam>`
2. Wijzigingsmetadata (`.openspec.yaml` in de wijzigingsmap)
3. Projectconfiguratie (`openspec/config.yaml`)
4. Standaard (`spec-driven`)

---

## Aangepaste schema's

Wanneer projectconfiguratie niet volstaat, maak je je eigen schema met een volledig aangepaste workflow. Aangepaste schema's bevinden zich in de map `openspec/schemas/` van je project en worden samen met je code versiebeheerd.

```text
je-project/
├── openspec/
│   ├── config.yaml        # Projectconfiguratie
│   ├── schemas/           # Hier staan aangepaste schema's
│   │   └── mijn-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Je wijzigingen
└── src/
```

### Fork een bestaand schema

De snelste manier om aan te passen is het forken van een ingebouwd schema:

```bash
openspec schema fork spec-driven mijn-workflow
```

Dit kopieert het volledige `spec-driven` schema naar `openspec/schemas/mijn-workflow/` waar je het vrij kunt bewerken.

**Wat je krijgt:**

```text
openspec/schemas/mijn-workflow/
├── schema.yaml           # Workflowdefinitie
└── templates/
    ├── proposal.md       # Sjabloon voor proposal-artefact
    ├── spec.md           # Sjabloon voor specificaties
    ├── design.md         # Sjabloon voor ontwerp
    └── tasks.md          # Sjabloon voor taken
```

Bewerk nu `schema.yaml` om de workflow te wijzigen, of bewerk sjablonen om te veranderen wat de AI genereert.

### Maak een schema vanaf nul

Voor een volledig nieuwe workflow:

```bash
# Interactief
openspec schema init research-first

# Niet-interactief
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Schemastuctuur

Een schema definieert de artefacten in je workflow en hoe ze van elkaar afhankelijk zijn:

```yaml
# openspec/schemas/mijn-workflow/schema.yaml
name: mijn-workflow
version: 1
description: Mijn team's aangepaste workflow

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initieel voorsteldocument
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Technisch ontwerp
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal    # Kan geen ontwerp maken totdat het voorstel bestaat

  - id: tasks
    generates: tasks.md
    description: Implementatiechecklijst
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
| `id` | Unieke identificatie, gebruikt in commando's en regels |
| `generates` | Bestandsnaam van de uitvoer (ondersteunt globpatronen zoals `specs/**/*.md`) |
| `template` | Sjabloonbestand in de map `templates/` |
| `instruction` | AI-instructies voor het aanmaken van dit artefact |
| `requires` | Afhankelijkheden - welke artefacten moeten eerst bestaan |

### Sjablonen

Sjablonen zijn markdown-bestanden die de AI begeleiden. Ze worden geïnjecteerd in het prompt bij het aanmaken van dat artefact.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

Sjablonen kunnen bevatten:
- Sectiekoppen die de AI moet invullen
- HTML-opmerkingen met richtlijnen voor de AI
- Voorbeeldformaten die de verwachte structuur tonen

### Valideer je schema

Valideer je aangepaste schema voordat je het gebruikt:

```bash
openspec schema validate mijn-workflow
```

Dit controleert:
- Of de syntaxis van `schema.yaml` correct is
- Of alle verwezen sjablonen bestaan
- Of er geen circulaire afhankelijkheden zijn
- Of de artefact-ID's geldig zijn

### Gebruik je aangepaste schema

Gebruik na het aanmaken je schema met:

```bash
# Specificeer bij het commando
openspec new change feature --schema mijn-workflow

# Of stel in als standaard in config.yaml
schema: mijn-workflow
```

### Debug schema-oplossing

Niet zeker welk schema wordt gebruikt? Controleer met:

```bash
# Zie vanwaar een specifiek schema wordt opgelost
openspec schema which mijn-workflow

# Lijst alle beschikbare schema's
openspec schema which --all
```

De uitvoer toont of het afkomstig is van je project, de gebruikersmap of het pakket:

```text
Schema: mijn-workflow
Source: project
Path: /path/to/project/openspec/schemas/mijn-workflow
```

---

> **Opmerking:** OpenSpec ondersteunt ook schema's op gebruikersniveau in `~/.local/share/openspec/schemas/` om te delen tussen projecten, maar projectniveauschema's in `openspec/schemas/` worden aanbevolen omdat ze samen met je code worden versiebeheerd.

---

## Voorbeelden

### Workflow voor snelle iteratie

Een minimale workflow voor snelle iteraties:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Quick proposal
    template: proposal.md
    instruction: |
      Create a brief proposal for this change.
      Focus on what and why, skip detailed specs.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Een review-artefact toevoegen

Fork de standaard en voeg een reviewstap toe:

```bash
openspec schema fork spec-driven with-review
```

Bewerk vervolgens `schema.yaml` om toe te voegen:

```yaml
  - id: review
    generates: review.md
    description: Pre-implementation review checklist
    template: review.md
    instruction: |
      Create a review checklist based on the design.
      Include security, performance, and testing considerations.
    requires:
      - design

  - id: tasks
    # ... bestaande takenconfiguratie ...
    requires:
      - specs
      - design
      - review    # Nu vereisen taken ook review
```

---

## Zie ook

- [CLI-referentie: Schema-commando's](cli.md#schema-commands) - Volledige commandodocumentatie