# Personalizzazione

OpenSpec fornisce tre livelli di personalizzazione:

| Livello | Cosa fa | Ideale per |
|---------|---------|------------|
| **Configurazione Progetto** | Imposta valori predefiniti, inietta contesto/regole | La maggior parte dei team |
| **Schemi Personalizzati** | Definisci i tuoi artefatti di flusso di lavoro personalizzati | Team con processi unici |
| **Sovrascritture Globali** | Condividi schemi tra tutti i progetti | Utenti esperti |

---

## Configurazione del Progetto

Il file `openspec/config.yaml` è il modo più semplice per personalizzare OpenSpec per il tuo team. Ti permette di:

- **Impostare uno schema predefinito** - Salta `--schema` in ogni comando
- **Iniettare contesto e regole del progetto** - L'IA vede il tuo stack tecnologico, le convenzioni, ecc.
- **Aggiungere regole specifiche per ogni artefatto** - Regole personalizzate per artefatti specifici

### Setup Rapido

```bash
openspec init
```

Questo ti guida nella creazione di una configurazione in modo interattivo. Oppure creane una manualmente:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Stack tecnologico: TypeScript, React, Node.js, PostgreSQL
  Stile API: RESTful, documentato in docs/api.md
  Test: Jest + React Testing Library
  Diamo valore alla compatibilità con le versioni precedenti per tutte le API pubbliche

rules:
  proposal:
    - Includi un piano di rollback
    - Identifica i team interessati
  specs:
    - Usa il formato Given/When/Then
    - Fai riferimento ai pattern esistenti prima di inventarne di nuovi
```

### Funzionamento

**Schema predefinito:**

```bash
# Senza configurazione
openspec new change my-feature --schema spec-driven

# Con la configurazione - lo schema è automatico
openspec new change my-feature
```

**Iniezione di contesto e regole:**

Quando generi qualsiasi artefatto, il tuo contesto e le tue regole vengono iniettati nel prompt dell'IA:

```xml
<context>
Stack tecnologico: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Includi un piano di rollback
- Identifica i team interessati
</rules>

<template>
[Template predefinito dello schema]
</template>
```

- Il **contesto** appare in TUTTI gli artefatti
- Le **regole** appaiono SOLO per l'artefatto corrispondente

### Ordine di risoluzione dello schema

Quando OpenSpec ha bisogno di uno schema, controlla in questo ordine:

1. Flag CLI: `--schema <nome>`
2. Metadati della modifica (`.openspec.yaml` nella cartella della modifica)
3. Configurazione del progetto (`openspec/config.yaml`)
4. Predefinito (`spec-driven`)

---

## Schemi Personalizzati

Quando la configurazione del progetto non è sufficiente, crea il tuo schema con un flusso di lavoro completamente personalizzato. Gli schemi personalizzati si trovano nella directory `openspec/schemas/` del tuo progetto e sono sottoposti a controllo di versione insieme al tuo codice.

```text
tuo-progetto/
├── openspec/
│   ├── config.yaml        # Configurazione del progetto
│   ├── schemas/           # Gli schemi personalizzati si trovano qui
│   │   └── mio-flusso-di-lavoro/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Le tue modifiche
└── src/
```

### Forka uno schema esistente

Il modo più veloce per personalizzare è forka uno schema predefinito:

```bash
openspec schema fork spec-driven mio-flusso-di-lavoro
```

Questo copia l'intero schema `spec-driven` in `openspec/schemas/mio-flusso-di-lavoro/` dove puoi modificarlo liberamente.

**Cosa ottieni:**

```text
openspec/schemas/mio-flusso-di-lavoro/
├── schema.yaml           # Definizione del flusso di lavoro
└── templates/
    ├── proposal.md       # Template per l'artefatto proposal
    ├── spec.md           # Template per le specifiche
    ├── design.md         # Template per il design
    └── tasks.md          # Template per i task
```

Ora modifica `schema.yaml` per cambiare il flusso di lavoro, o modifica i template per cambiare ciò che genera l'IA.

### Crea uno schema da zero

Per un flusso di lavoro completamente nuovo:

```bash
# Interattivo
openspec schema init basato-sulla-ricerca

# Non interattivo
openspec schema init rapido \
  --description "Flusso di lavoro per iterazione rapida" \
  --artifacts "proposal,tasks" \
  --default
```

### Struttura dello schema

Uno schema definisce gli artefatti nel tuo flusso di lavoro e le loro dipendenze reciproche:

```yaml
# openspec/schemas/mio-flusso-di-lavoro/schema.yaml
name: mio-flusso-di-lavoro
version: 1
description: Flusso di lavoro personalizzato del mio team

artifacts:
  - id: proposal
    generates: proposal.md
    description: Documento di proposta iniziale
    template: proposal.md
    instruction: |
      Crea una proposta che spieghi PERCHÉ è necessaria questa modifica.
      Concentrati sul problema, non sulla soluzione.
    requires: []

  - id: design
    generates: design.md
    description: Design tecnico
    template: design.md
    instruction: |
      Crea un documento di design che spieghi COME implementare la modifica.
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

**Campi principali:**

| Campo | Scopo |
|-------|-------|
| `id` | Identificatore univoco, utilizzato nei comandi e nelle regole |
| `generates` | Nome del file di output (supporta i glob come `specs/**/*.md`) |
| `template` | File template nella directory `templates/` |
| `instruction` | Istruzioni per l'IA per la creazione di questo artefatto |
| `requires` | Dipendenze - quali artefatti devono esistere prima |

### Modelli

I modelli sono file markdown che guidano l'IA. Vengono iniettati nel prompt durante la creazione del corrispondente artefatto.

```markdown
<!-- templates/proposal.md -->
## Perché

<!-- Spiega la motivazione di questa modifica. Che problema risolve? -->

## Cosa Cambia

<!-- Descrivi cosa cambierà. Sii specifico sulle nuove funzionalità o modifiche. -->

## Impatto

<!-- Codice, API, dipendenze, sistemi interessati -->
```

I modelli possono includere:
- Intestazioni di sezione che l'IA deve compilare
- Commenti HTML con indicazioni per l'IA
- Formati di esempio che mostrano la struttura prevista

### Valida il tuo schema

Prima di utilizzare uno schema personalizzato, validalo:

```bash
openspec schema validate mio-flusso-di-lavoro
```

Questo controlla:
- La sintassi di `schema.yaml` è corretta
- Tutti i template referenziati esistono
- Non ci sono dipendenze circolari
- Gli ID degli artefatti sono validi

### Usa il tuo schema personalizzato

Una volta creato, usa il tuo schema con:

```bash
# Specifica nel comando
openspec new change feature --schema mio-flusso-di-lavoro

# Oppure imposta come predefinito in config.yaml
schema: mio-flusso-di-lavoro
```

### Debug della risoluzione dello schema

Non sei sicuro di quale schema viene utilizzato? Controlla con:

```bash
# Vedi da dove viene risolto uno schema specifico
openspec schema which mio-flusso-di-lavoro

# Elenca tutti gli schemi disponibili
openspec schema which --all
```

L'output mostra se lo schema proviene dal tuo progetto, dalla directory utente o dal pacchetto:

```text
Schema: mio-flusso-di-lavoro
Fonte: progetto
Percorso: /percorso/del/progetto/openspec/schemas/mio-flusso-di-lavoro
```

---

> **Nota:** OpenSpec supporta anche schemi a livello di utente in `~/.local/share/openspec/schemas/` per la condivisione tra progetti, ma si consigliano gli schemi a livello di progetto in `openspec/schemas/` poiché sono sottoposti a controllo di versione insieme al tuo codice.

---

## Esempi

### Flusso di lavoro per iterazione rapida

Un flusso di lavoro minimale per iterazioni rapide:

```yaml
# openspec/schemas/rapido/schema.yaml
name: rapido
version: 1
description: Flusso di lavoro per iterazione veloce

artifacts:
  - id: proposal
    generates: proposal.md
    description: Proposta rapida
    template: proposal.md
    instruction: |
      Crea una proposta sintetica per questa modifica.
      Concentrati sul cosa e sul perché, salta le specifiche dettagliate.
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

### Aggiunta di un artefatto di revisione

Forka lo schema predefinito e aggiungi una fase di revisione:

```bash
openspec schema fork spec-driven con-revisione
```

Poi modifica `schema.yaml` per aggiungere:

```yaml
  - id: review
    generates: review.md
    description: Checklist di revisione pre-implementazione
    template: review.md
    instruction: |
      Crea una checklist di revisione basata sul design.
      Includi considerazioni sulla sicurezza, sulle prestazioni e sui test.
    requires:
      - design

  - id: tasks
    # ... configurazione esistente dei task ...
    requires:
      - specs
      - design
      - review    # Ora anche i task richiedono la revisione
```

---

## Schemi della Community

OpenSpec supporta anche schemi mantenuti dalla community, distribuiti tramite repository autonomi. Questi forniscono flussi di lavoro orientati che integrano OpenSpec con altri strumenti o sistemi, in modo simile a come il [catalogo di estensioni della community di github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) funziona per spec-kit.

Gli schemi della community non sono inclusi nel core di OpenSpec: si trovano nei propri repository con una propria cadenza di rilascio. Per usarne uno, copia il bundle dello schema nella directory `openspec/schemas/<nome-schema>/` del tuo progetto (il README di ogni repo contiene le istruzioni di installazione).

| Schema | Maintainer | Repository | Descrizione |
|--------|------------|------------|-------------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Integra la governance degli artefatti di OpenSpec con le skill di esecuzione di [obra/superpowers](https://github.com/obra/superpowers) (brainstorming, scrittura di piani, TDD tramite subagenti, code review, completamento). Aggiunge un artefatto `retrospective` basato su evidenze che colma una lacuna che Superpowers non copre nativamente. |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | Flusso di lavoro orientato al PM. Esegue la pipeline di pianificazione di [nanopm](https://github.com/nmrtn/nanopm) (audit → strategia → roadmap → PRD) a monte dell'implementazione. Collega la pianificazione di prodotto al flusso di lavoro di ingegneria basato su specifiche di OpenSpec. Gli artefatti vengono letti da `.nanopm/` se presente: la proposta attinge all'audit, il design attinge alla strategia e i task attingono alla suddivisione del PRD. |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | Runbook di test end-to-end a livello di capacità. Ogni capacità ottiene una specifica immutabile, un modello di task immutabile e un record di esecuzione con timestamp per ogni esecuzione. Le asserzioni sono solo comportamenti osservabili (stato HTTP, corpo della risposta, stato persistito — mai sottostringhe di log); ogni esecuzione registra inizio/fine UTC, durata e consumo stimato di token LLM. |

> Vuoi contribuire con uno schema della community? Apri un issue con un link al tuo repository, o invia una PR aggiungendo una riga a questa tabella.

---

## Vedi anche

- [Riferimento CLI: Comandi per gli schemi](cli.md#schema-commands) - Documentazione completa dei comandi