# Aanpassing

OpenSpec biedt drie niveaus van aanpassing:

| Niveau | Wat het doet | Het beste voor |
|--------|--------------|----------------|
| **Projectconfiguratie** | Standaarden instellen, context/regels injecteren | De meeste teams |
| **Aangepaste Schema's** | Definieer je eigen workflowartefacten | Teams met unieke processen |
| **Globale Overschrijvingen** | Schema's delen over alle projecten | Gevorderde gebruikers |

---

## Projectconfiguratie

Het bestand `openspec/config.yaml` is de eenvoudigste manier om OpenSpec voor je team aan te passen. Het stelt je in staat om:

- **Een standaardschema in te stellen** - Sla `--schema` over bij elk commando
- **Projectcontext te injecteren** - AI ziet je techstack, conventies, etc.
- **Regels per artefact toe te voegen** - Aangepaste regels voor specifieke artefacten

### Snelle Setup

```bash
openspec init
```

Dit leidt je door het interactief aanmaken van een configuratie. Of maak er handmatig een:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API-stijl: RESTful, gedocumenteerd in docs/api.md
  Testen: Jest + React Testing Library
  We hechten waarde aan backwards compatibility voor alle openbare API's

rules:
  proposal:
    - Neem een terugvalplan op
    - Identificeer beïnvloede teams
  specs:
    - Gebruik het Given/When/Then-formaat
    - Verwijs naar bestaande patronen voordat je nieuwe bedenkt
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

Bij het genereren van elk artefact worden je context en regels geïnjecteerd in de AI-prompt:

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Neem een terugvalplan op
- Identificeer beïnvloede teams
</rules>

<template>
[Ingebouwd sjabloon van het schema]
</template>
```

- **Context** verschijnt in ALLE artefacten
- **Regels** verschijnen ALLEEN voor het overeenkomende artefact

### Schema-resolutievolgorde

Wanneer OpenSpec een schema nodig heeft, controleert het in deze volgorde:

1. CLI-vlag: `--schema <naam>`
2. Wijzigingsmetadata (`.openspec.yaml` in de wijzigingsmap)
3. Projectconfiguratie (`openspec/config.yaml`)
4. Standaard (`spec-driven`)

---

## Aangepaste Schema's

Wanneer projectconfiguratie niet voldoende is, maak je je eigen schema met een volledig aangepaste workflow. Aangepaste schema's bevinden zich in de map `openspec/schemas/` van je project en worden versiebeheerd met je code.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Projectconfiguratie
│   ├── schemas/           # Aangepaste schema's staan hier
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Je wijzigingen
└── src/
```

### Fork een Bestaand Schema

De snelste manier om aan te passen is door een ingebouwd schema te forken:

```bash
openspec schema fork spec-driven my-workflow
```

Dit kopieert het volledige `spec-driven`-schema naar `openspec/schemas/my-workflow/` waar je het vrij kunt bewerken.

**Wat je krijgt:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Workflowdefinitie
└── templates/
    ├── proposal.md       # Sjabloon voor het proposal-artefact
    ├── spec.md           # Sjabloon voor specificaties
    ├── design.md         # Sjabloon voor ontwerp
    └── tasks.md          # Sjabloon voor taken
```

Bewerk nu `schema.yaml` om de workflow te wijzigen, of bewerk sjablonen om te veranderen wat de AI genereert.

### Maak een Schema vanaf Nul

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

### Schemastructuur

Een schema definieert de artefacten in je workflow en hoe ze van elkaar afhankelijk zijn:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: De aangepaste workflow van mijn team

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initiële voorsteldocument
    template: proposal.md
    instruction: |
      Maak een voorstel dat uitlegt WAAROM deze wijziging nodig is.
      Focus op het probleem, niet de oplossing.
    requires: []

  - id: design
    generates: design.md
    description: Technisch ontwerp
    template: design.md
    instruction: |
      Maak een ontwerpdocument dat uitlegt HOE te implementeren.
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
|------|------|
| `id` | Unieke identifier, gebruikt in commando's en regels |
| `generates` | Uitvoerbestandsnaam (ondersteunt globs zoals `specs/**/*.md`) |
| `template` | Sjabloongebestand in de map `templates/` |
| `instruction` | AI-instructies voor het aanmaken van dit artefact |
| `requires` | Afhankelijkheden - welke artefacten eerst moeten bestaan |

### Sjablonen

Sjablonen zijn markdownbestanden die de AI begeleiden. Ze worden geïnjecteerd in de prompt bij het aanmaken van dat artefact.

```markdown
<!-- templates/proposal.md -->
## Waarom

<!-- Leg de motivatie voor deze wijziging uit. Welk probleem lost dit op? -->

## Wat Verandert

<!-- Beschrijf wat er zal veranderen. Wees specifiek over nieuwe mogelijkheden of modificaties. -->

## Impact

<!-- Beïnvloede code, API's, afhankelijkheden, systemen -->
```

Sjablonen kunnen bevatten:
- Sectiekoppen die de AI moet invullen
- HTML-opmerkingen met begeleiding voor de AI
- Voorbeeldformaten die de verwachte structuur tonen

### Valideer je Schema

Voordat je een aangepast schema gebruikt, valideer het:

```bash
openspec schema validate my-workflow
```

Dit controleert:
- De syntaxis van `schema.yaml` is correct
- Alle gerefereerde sjablonen bestaan
- Geen circulaire afhankelijkheden
- Artefact-ID's zijn geldig

### Gebruik je Aangepaste Schema

Eenmaal aangemaakt, gebruik je schema met:

```bash
# Specificeer bij commando
openspec new change feature --schema my-workflow

# Of stel in als standaard in config.yaml
schema: my-workflow
```

### Debug Schema-resolutie

Niet zeker welk schema wordt gebruikt? Controleer met:

```bash
# Zie waar een specifiek schema vandaan komt
openspec schema which my-workflow

# Lijst alle beschikbare schema's
openspec schema which --all
```

Uitvoer toont of het uit je project, gebruikersmap of het pakket komt:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Opmerking:** OpenSpec ondersteunt ook schema's op gebruikersniveau in `~/.local/share/openspec/schemas/` om te delen over projecten, maar schema's op projectniveau in `openspec/schemas/` worden aanbevolen omdat ze versiebeheerd worden met je code.

---

## Voorbeelden

### Snelle Iteratieworkflow

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

### Een Review-Artefact Toevoegen

Fork de standaard en voeg een review-stap toe:

```bash
openspec schema fork spec-driven with-review
```

Bewerk vervolgens `schema.yaml` om toe te voegen:

```yaml
  - id: review
    generates: review.md
    description: Pre-implementatie review-checklist
    template: review.md
    instruction: |
      Maak een review-checklist op basis van het ontwerp.
      Neem beveiligings-, prestatie- en testoverwegingen op.
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

## Communityschema's

OpenSpec ondersteunt ook door de community onderhouden schema's die worden gedistribueerd via afzonderlijke repositories. Deze bieden opiniërende workflows die OpenSpec integreren met andere tools of systemen, vergelijkbaar met hoe [github/spec-kit's community-uitbreidingscatalogus](https://github.com/github/spec-kit/tree/main/extensions) werkt voor spec-kit.

Communityschema's zijn niet opgenomen in de OpenSpec-kern — ze bevinden zich in hun eigen repositories met hun eigen releasecyclus. Om er een te gebruiken, kopieer je de schemabundel naar de map `openspec/schemas/<schema-naam>/` van je project (elke repo heeft installatie-instructies in de README).

| Schema | Onderhouder | Repository | Beschrijving |
|--------|------------|-----------|--------------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Integreert het artefactbeheer van OpenSpec met de uitvoeringsvaardigheden van [obra/superpowers](https://github.com/obra/superpowers) (brainstormen, plannen schrijven, TDD via subagents, code review, afronden). Voegt een bewijsgebaseerd `retrospective`-artefact toe dat een kloof vult die Superpowers niet van nature dekt. |

> Wil je een communityschema bijdragen? Open een issue met een link naar je repository, of dien een PR in met een rij aan deze tabel.

---

## Zie ook

- [CLI-referentie: Schemacommando's](cli.md#schema-commands) - Volledige commandodocumentatie