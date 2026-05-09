# Personalizzazione

OpenSpec fornisce tre livelli di personalizzazione:

| Livello | Cosa fa | Ideale per |
|---------|---------|------------|
| **Configurazione Progetto** | Imposta valori predefiniti, inietta contesto/regole | La maggior parte dei team |
| **Schema Personalizzati** | Definisci i tuoi artefatti di workflow | Team con processi unici |
| **Sovrascritture Globali** | Condividi gli schema tra tutti i progetti | Utenti avanzati |

---

## Configurazione del Progetto

Il file `openspec/config.yaml` è il modo più semplice per personalizzare OpenSpec per il tuo team. Ti permette di:

- **Impostare uno schema predefinito** - Salta `--schema` ad ogni comando
- **Iniettare contesto del progetto** - L'IA vede il tuo stack tecnologico, le convenzioni, ecc.
- **Aggiungere regole per artefatto** - Regole personalizzate per artefatti specifici

### Configurazione Rapida

```bash
openspec init
```

Questo ti guida nella creazione interattiva di una configurazione. Oppure creane una manualmente:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Stack tecnologico: TypeScript, React, Node.js, PostgreSQL
  Stile API: RESTful, documentato in docs/api.md
  Testing: Jest + React Testing Library
  Diamo importanza alla retrocompatibilità per tutte le API pubbliche

rules:
  proposal:
    - Includi piano di rollback
    - Identifica i team coinvolti
  specs:
    - Usa il formato Given/When/Then
    - Fai riferimento a pattern esistenti prima di inventarne di nuovi
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

Quando si genera un artefatto, il tuo contesto e le tue regole vengono iniettati nel prompt dell'IA:

```xml
<context>
Stack tecnologico: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Includi piano di rollback
- Identifica i team coinvolti
</rules>

<template>
[Template integrato dello schema]
</template>
```

- Il **Contesto** appare in TUTTI gli artefatti
- Le **Regole** appaiono SOLO per l'artefatto corrispondente

### Ordine di Risoluzione dello Schema

Quando OpenSpec ha bisogno di uno schema, controlla in questo ordine:

1. Flag CLI: `--schema <nome>`
2. Metadati della modifica (`.openspec.yaml` nella cartella della modifica)
3. Configurazione del progetto (`openspec/config.yaml`)
4. Predefinito (`spec-driven`)

---

## Schema Personalizzati

Quando la configurazione del progetto non è sufficiente, crea il tuo schema con un workflow completamente personalizzato. Gli schema personalizzati risiedono nella directory `openspec/schemas/` del tuo progetto e sono versionati insieme al tuo codice.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Configurazione del progetto
│   ├── schemas/           # Gli schema personalizzati risiedono qui
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Le tue modifiche
└── src/
```

### Fork di uno Schema Esistente

Il modo più rapido per personalizzare è fare il fork di uno schema integrato:

```bash
openspec schema fork spec-driven my-workflow
```

Questo copia l'intero schema `spec-driven` in `openspec/schemas/my-workflow/` dove puoi modificarlo liberamente.

**Cosa ottieni:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Definizione del workflow
└── templates/
    ├── proposal.md       # Template per l'artefatto proposal
    ├── spec.md           # Template per le specifiche
    ├── design.md         # Template per il design
    └── tasks.md          # Template per i task
```

Ora modifica `schema.yaml` per cambiare il workflow, o modifica i template per cambiare ciò che l'IA genera.

### Creare uno Schema da Zero

Per un workflow completamente nuovo:

```bash
# Interattivo
openspec schema init research-first

# Non interattivo
openspec schema init rapid \
  --description "Workflow di iterazione rapida" \
  --artifacts "proposal,tasks" \
  --default
```

### Struttura dello Schema

Uno schema definisce gli artefatti nel tuo workflow e come dipendono l'uno dall'altro:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: Il workflow personalizzato del mio team

artifacts:
  - id: proposal
    generates: proposal.md
    description: Documento di proposta iniziale
    template: proposal.md
    instruction: |
      Crea una proposta che spiega PERCHÉ questa modifica è necessaria.
      Concentrati sul problema, non sulla soluzione.
    requires: []

  - id: design
    generates: design.md
    description: Design tecnico
    template: design.md
    instruction: |
      Crea un documento di design che spiega COME implementare.
    requires:
      - proposal    # Non puoi creare il design finché non esiste la proposta

  - id: tasks
    generates: tasks.md
    description: Checklist di implementazione
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Campi chiave:**

| Campo | Scopo |
|-------|-------|
| `id` | Identificatore univoco, usato nei comandi e nelle regole |
| `generates` | Nome del file di output (supporta glob come `specs/**/*.md`) |
| `template` | File template nella directory `templates/` |
| `instruction` | Istruzioni per l'IA per creare questo artefatto |
| `requires` | Dipendenze - quali artefatti devono esistere prima |

### Template

I template sono file markdown che guidano l'IA. Vengono iniettati nel prompt quando si crea quell'artefatto.

```markdown
<!-- templates/proposal.md -->
## Perché

<!-- Spiega la motivazione per questa modifica. Quale problema risolve? -->

## Cosa Cambia

<!-- Descrivi cosa cambierà. Sii specifico sulle nuove capacità o modifiche. -->

## Impatto

<!-- Codice, API, dipendenze, sistemi coinvolti -->
```

I template possono includere:
- Intestazioni di sezione che l'IA dovrebbe compilare
- Commenti HTML con indicazioni per l'IA
- Formati di esempio che mostrano la struttura attesa

### Validare il Tuo Schema

Prima di usare uno schema personalizzalo, validalo:

```bash
openspec schema validate my-workflow
```

Questo controlla:
- La sintassi di `schema.yaml` è corretta
- Tutti i template referenziati esistono
- Non ci sono dipendenze circolari
- Gli ID degli artefatti sono validi

### Usare il Tuo Schema Personalizzato

Una volta creato, usa il tuo schema con:

```bash
# Specifica nel comando
openspec new change feature --schema my-workflow

# Oppure impostalo come predefinito in config.yaml
schema: my-workflow
```

### Debug della Risoluzione dello Schema

Non sei sicuro di quale schema viene usato? Controlla con:

```bash
# Vedi da dove si risolve uno schema specifico
openspec schema which my-workflow

# Elenca tutti gli schema disponibili
openspec schema which --all
```

L'output mostra se proviene dal tuo progetto, dalla directory utente o dal pacchetto:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Nota:** OpenSpec supporta anche gli schema a livello utente in `~/.local/share/openspec/schemas/` per la condivisione tra progetti, ma gli schema a livello di progetto in `openspec/schemas/` sono raccomandati poiché sono versionati insieme al tuo codice.

---

## Esempi

### Workflow di Iterazione Rapida

Un workflow minimale per iterazioni rapide:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Iterazione rapida con overhead minimo

artifacts:
  - id: proposal
    generates: proposal.md
    description: Proposta rapida
    template: proposal.md
    instruction: |
      Crea una proposta breve per questa modifica.
      Concentrati sul cosa e perché, salta le specifiche dettagliate.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Checklist di implementazione
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Aggiungere un Artefatto di Revisione

Fai il fork di quello predefinito e aggiungi un passaggio di revisione:

```bash
openspec schema fork spec-driven with-review
```

Poi modifica `schema.yaml` per aggiungere:

```yaml
  - id: review
    generates: review.md
    description: Checklist di revisione pre-implementazione
    template: review.md
    instruction: |
      Crea una checklist di revisione basata sul design.
      Includi considerazioni su sicurezza, prestazioni e testing.
    requires:
      - design

  - id: tasks
    # ... configurazione esistente dei task ...
    requires:
      - specs
      - design
      - review    # Ora i task richiedono anche la revisione
```

---

## Schema della Community

OpenSpec supporta anche gli schema mantenuti dalla community e distribuiti tramite repository indipendenti. Questi forniscono workflow strutturati che integrano OpenSpec con altri strumenti o sistemi, in modo simile a come funziona il [catalogo delle estensioni della community di github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) per spec-kit.

Gli schema della community non sono inclusi nel core di OpenSpec — risiedono nei loro repository con il loro ciclo di rilascio. Per usarne uno, copia il bundle dello schema nella directory `openspec/schemas/<nome-schema>/` del tuo progetto (il README di ogni repo contiene le istruzioni di installazione).

| Schema | Manutentore | Repository | Descrizione |
|--------|-------------|------------|-------------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Integra la governance degli artefatti di OpenSpec con le capacità di esecuzione di [obra/superpowers](https://github.com/obra/superpowers) (brainstorming, writing-plans, TDD tramite subagenti, code review, finishing). Aggiunge un artefatto `retrospective` basato sull'evidenza che colma una lacuna che Superpowers non copre nativamente. |

> Vuoi contribuire con uno schema della community? Apri un issue con un link al tuo repository, o invia una PR aggiungendo una riga a questa tabella.

---

## Vedi Anche

- [Riferimento CLI: Comandi Schema](cli.md#schema-commands) - Documentazione completa dei comandi