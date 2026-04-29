# Personalizzazione

OpenSpec offre tre livelli di personalizzazione:

| Livello | Cosa fa | Ideale per |
|---------|---------|------------|
| **Configurazione del Progetto** | Imposta valori predefiniti, inietta contesto/regole | La maggior parte dei team |
| **Schemi Personalizzati** | Definisce i tuoi artifact di workflow | Team con processi unici |
| **Sovrascritture Globali** | Condivide gli schemi tra tutti i progetti | Utenti avanzati |

---

## Configurazione del Progetto

Il file `openspec/config.yaml` è il modo più semplice per personalizzare OpenSpec per il tuo team. Ti permette di:

- **Impostare uno schema predefinito** - Salta `--schema` ad ogni comando
- **Iniettare il contesto del progetto** - L'AI vede il tuo stack tecnico, le convenzioni, ecc.
- **Aggiungere regole per artifact** - Regole personalizzate per artifact specifici

### Configurazione Rapida

```bash
openspec init
```

Questo ti guida nella creazione interattiva di una configurazione. Oppure creane una manualmente:

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

### Come Funziona

**Schema predefinito:**

```bash
# Senza configurazione
openspec new change my-feature --schema spec-driven

# Con configurazione - lo schema è automatico
openspec new change my-feature
```

**Iniezione di contesto e regole:**

Quando viene generato qualsiasi artifact, il tuo contesto e le regole vengono iniettati nel prompt dell'AI:

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

- Il **Contesto** appare in TUTTI gli artifact
- Le **Regole** appaiono SOLO per l'artifact corrispondente

### Ordine di Risoluzione degli Schemi

Quando OpenSpec ha bisogno di uno schema, controlla in questo ordine:

1. Flag CLI: `--schema <nome>`
2. Metadati della modifica (`.openspec.yaml` nella cartella della modifica)
3. Configurazione del progetto (`openspec/config.yaml`)
4. Predefinito (`spec-driven`)

---

## Schemi Personalizzati

Quando la configurazione del progetto non è sufficiente, crea il tuo schema con un workflow completamente personalizzato. Gli schemi personalizzati risiedono nella directory `openspec/schemas/` del tuo progetto e sono versionati insieme al tuo codice.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Configurazione del progetto
│   ├── schemas/           # Gli schemi personalizzati vivono qui
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Le tue modifiche
└── src/
```

### Biforca uno Schema Esistente

Il modo più rapido per personalizzare è biforcare uno schema integrato:

```bash
openspec schema fork spec-driven my-workflow
```

Questo copia l'intero schema `spec-driven` in `openspec/schemas/my-workflow/` dove puoi modificarlo liberamente.

**Cosa ottieni:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Definizione del workflow
└── templates/
    ├── proposal.md       # Template per l'artifact proposal
    ├── spec.md           # Template per le specifiche
    ├── design.md         # Template per il design
    └── tasks.md          # Template per le attività
```

Ora modifica `schema.yaml` per cambiare il workflow, o modifica i template per cambiare ciò che l'AI genera.

### Crea uno Schema da Zero

Per un workflow completamente nuovo:

```bash
# Interattivo
openspec schema init research-first

# Non interattivo
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Struttura dello Schema

Uno schema definisce gli artifact nel tuo workflow e come dipendono l'uno dall'altro:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: My team's custom workflow

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initial proposal document
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Technical design
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal    # Can't create design until proposal exists

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Campi principali:**

| Campo | Scopo |
|-------|-------|
| `id` | Identificatore univoco, usato nei comandi e nelle regole |
| `generates` | Nome del file di output (supporta glob come `specs/**/*.md`) |
| `template` | File template nella directory `templates/` |
| `instruction` | Istruzioni AI per creare questo artifact |
| `requires` | Dipendenze - quali artifact devono esistere prima |

### Template

I template sono file markdown che guidano l'AI. Vengono iniettati nel prompt quando si crea quell'artifact.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

I template possono includere:
- Intestazioni di sezione che l'AI deve compilare
- Commenti HTML con indicazioni per l'AI
- Formati di esempio che mostrano la struttura prevista

### Valida il Tuo Schema

Prima di usare uno schema personalizzato, validalo:

```bash
openspec schema validate my-workflow
```

Questo verifica che:
- La sintassi di `schema.yaml` sia corretta
- Tutti i template referenziati esistano
- Non ci siano dipendenze circolari
- Gli ID degli artifact siano validi

### Usa il Tuo Schema Personalizzato

Una volta creato, usa il tuo schema con:

```bash
# Specifica sul comando
openspec new change feature --schema my-workflow

# Oppure imposta come predefinito in config.yaml
schema: my-workflow
```

### Debug della Risoluzione degli Schemi

Non sai quale schema viene usato? Controlla con:

```bash
# Vedi da dove risolve uno schema specifico
openspec schema which my-workflow

# Elenca tutti gli schemi disponibili
openspec schema which --all
```

L'output mostra se proviene dal tuo progetto, dalla directory utente o dal pacchetto:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Nota:** OpenSpec supporta anche schemi a livello utente in `~/.local/share/openspec/schemas/` per la condivisione tra progetti, ma si raccomandano gli schemi a livello di progetto in `openspec/schemas/` poiché sono versionati insieme al tuo codice.

---

## Esempi

### Workflow di Iterazione Rapida

Un workflow minimale per iterazioni rapide:

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

### Aggiungere un Artifact di Revisione

Biforca quello predefinito e aggiungi un passaggio di revisione:

```bash
openspec schema fork spec-driven with-review
```

Poi modifica `schema.yaml` per aggiungere:

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
    # ... existing tasks config ...
    requires:
      - specs
      - design
      - review    # Now tasks require review too
```

---

## Vedi Anche

- [Riferimento CLI: Comandi Schema](cli.md#schema-commands) - Documentazione completa dei comandi