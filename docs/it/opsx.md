# OPSX Workflow
> Il feedback è benvenuto su [Discord](https://discord.gg/YctCnvvshC).

## Cos'è?
OPSX è ora il flusso di lavoro standard per OpenSpec.

È un **flusso di lavoro fluido e iterativo** per le modifiche a OpenSpec. Niente più fasi rigide: solo azioni che puoi intraprendere in qualsiasi momento.

## Perché esiste

Il flusso di lavoro legacy di OpenSpec funziona, ma è **bloccato**:

- **Le istruzioni sono hardcodate** — sepolte in TypeScript, non puoi modificarle
- **Tutto o niente** — un singolo comando crea tutto, non puoi testare i singoli pezzi
- **Struttura fissa** — stesso flusso di lavoro per tutti, nessuna personalizzazione
- **Scatola nera** — quando l'output dell'IA è scarso, non puoi modificare i prompt

**OPSX lo apre a tutti.** Ora chiunque può:

1. **Sperimentare con le istruzioni** — modifica un modello, verifica se l'IA funziona meglio
2. **Testare in modo granulare** — convalida le istruzioni di ogni artefatto in modo indipendente
3. **Personalizzare i flussi di lavoro** — definisci i tuoi artefatti e le loro dipendenze
4. **Iterare velocemente** — modifica un modello, testalo immediatamente, senza rebuild

```
Legacy workflow:                      OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Hardcoded in package  │           │  schema.yaml           │◄── You edit this
│  (can't change)        │           │  templates/*.md        │◄── Or this
│        ↓               │           │        ↓               │
│  Wait for new release  │           │  Instant effect        │
│        ↓               │           │        ↓               │
│  Hope it's better      │           │  Test it yourself      │
└────────────────────────┘           └────────────────────────┘
```

**Questo è per tutti:**
- **Team** — crea flussi di lavoro che corrispondono a come lavori effettivamente
- **Utenti esperti** — modifica i prompt per ottenere output di AI migliori per il tuo codebase
- **Contributori di OpenSpec** — sperimenta nuovi approcci senza rilasci

Stiamo tutti ancora imparando cosa funziona meglio. OPSX ci permette di imparare insieme.

## L'esperienza utente

**Il problema dei flussi di lavoro lineari:**
Sei "nella fase di pianificazione", poi "nella fase di implementazione", poi "finito". Ma il lavoro reale non funziona così. Implementi qualcosa, ti accorgi che il tuo design era sbagliato, devi aggiornare le specs, continuare a implementare. Le fasi lineari si scontrano con come il lavoro avviene realmente.

**Approccio di OPSX:**
- **Azioni, non fasi** — crea, implementa, aggiorna, archivia — puoi fare ognuna di queste azioni in qualsiasi momento
- **Le dipendenze sono abilitanti** — mostrano cosa è possibile, non cosa è richiesto subito dopo

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Configurazione

```bash
# Assicurati di avere openspec installato — le skill vengono generate automaticamente
openspec init
```

Questo crea le skill in `.claude/skills/` (o equivalente) che gli assistenti di coding AI rilevano automaticamente.

Per impostazione predefinita, OpenSpec utilizza il profilo di flusso di lavoro `core` (`propose`, `explore`, `apply`, `sync`, `archive`). Se vuoi i comandi del flusso di lavoro esteso (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`), configurali con `openspec config profile` e applicali con `openspec update`.

Durante la configurazione, ti verrà richiesto di creare una **configurazione di progetto** (`openspec/config.yaml`). Questa è opzionale ma consigliata.

## Configurazione del progetto

La configurazione di progetto ti permette di impostare valori predefiniti e iniettare contesto specifico del progetto in tutti gli artefatti.

### Creazione della configurazione

La configurazione viene creata durante `openspec init`, o manualmente:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Stack tecnologico: TypeScript, React, Node.js
  Convenzioni API: RESTful, risposte JSON
  Test: Vitest per i test unitari, Playwright per i test e2e
  Stile: ESLint con Prettier, TypeScript stretto

rules:
  proposal:
    - Includere un piano di rollback
    - Identificare i team interessati
  specs:
    - Usare il formato Given/When/Then per gli scenari
  design:
    - Includere diagrammi di sequenza per i flussi complessi
```

### Campi di configurazione

| Campo | Tipo | Descrizione |
|-------|-----|-------------|
| `schema` | string | Schema predefinito per le nuove modifiche (es. `spec-driven`) |
| `context` | string | Contesto del progetto iniettato nelle istruzioni di tutti gli artefatti |
| `rules` | object | Regole per artefatto, indicizzate per ID di artefatto |

### Funzionamento

**Precedenza degli schema** (dal più alto al più basso):
1. Flag CLI (`--schema <name>`)
2. Metadati della modifica (`.openspec.yaml` nella directory della modifica)
3. Configurazione di progetto (`openspec/config.yaml`)
4. Predefinito (`spec-driven`)

**Iniezione del contesto:**
- Il contesto viene aggiunto all'inizio delle istruzioni di ogni artefatto
- Racchiuso tra tag `<context>...</context>`
- Aiuta l'IA a comprendere le convenzioni del tuo progetto

**Iniezione delle regole:**
- Le regole vengono iniettate solo per gli artefatti corrispondenti
- Racchiuso tra tag `<rules>...</rules>`
- Vengono inserite dopo il contesto, prima del modello

### ID degli artefatti per schema

**spec-driven** (predefinito):
- `proposal` — Proposta di modifica
- `specs` — Specifiche
- `design` — Progettazione tecnica
- `tasks` — Attività di implementazione

### Validazione della configurazione

- ID di artefatti sconosciuti in `rules` generano avvisi
- I nomi degli schema vengono convalidati rispetto agli schema disponibili
- Il contesto ha un limite di dimensione di 50KB
- YAML non valido viene segnalato con i numeri di riga

### Risoluzione dei problemi

**"ID di artefatto sconosciuto in rules: X"**
- Verifica che gli ID degli artefatti corrispondano al tuo schema (vedi l'elenco sopra)
- Esegui `openspec schemas --json` per vedere gli ID degli artefatti per ogni schema

**La configurazione non viene applicata:**
- Assicurati che il file si trovi in `openspec/config.yaml` (non `.yml`)
- Verifica la sintassi YAML con un validatore
- Le modifiche alla configurazione hanno effetto immediato (nessun riavvio necessario)

**Contesto troppo grande:**
- Il contesto è limitato a 50KB
- Riassumi o inserisci un link a documentazione esterna al posto suo

## Comandi

| Comando | Cosa fa |
|---------|---------|
| `/opsx:propose` | Crea una modifica e genera artefatti di pianificazione in un solo passaggio (percorso rapido predefinito) |
| `/opsx:explore` | Ragiona sulle idee, indaga sui problemi, chiarisci i requisiti |
| `/opsx:new` | Avvia una nuova struttura di modifica (flusso di lavoro esteso) |
| `/opsx:continue` | Crea il prossimo artefatto (flusso di lavoro esteso) |
| `/opsx:ff` | Esegui il fast-forward degli artefatti di pianificazione (flusso di lavoro esteso) |
| `/opsx:apply` | Implementa le attività, aggiornando gli artefatti secondo necessità |
| `/opsx:update` | Rivedi gli artefatti di pianificazione di una modifica e mantienili coerenti |
| `/opsx:verify` | Convalida l'implementazione rispetto agli artefatti (flusso di lavoro esteso) |
| `/opsx:sync` | Sincronizza le delta delle specs con main (flusso di lavoro predefinito, opzionale) |
| `/opsx:archive` | Archivia quando hai finito |
| `/opsx:bulk-archive` | Archivia più modifiche completate (flusso di lavoro esteso) |
| `/opsx:onboard` | Walkthrough guidato di una modifica end-to-end (flusso di lavoro esteso) |

## Utilizzo

### Esplora un'idea
```
/opsx:explore
```
Rifletti sulle idee, indaga sui problemi, confronta le opzioni. Nessuna struttura richiesta — solo un partner di riflessione. Quando le intuizioni si cristallizzano, passa a `/opsx:propose` (predefinito) o `/opsx:new`/`/opsx:ff` (esteso).

### Avvia una nuova modifica
```
/opsx:propose
```
Crea la modifica e genera gli artefatti di pianificazione necessari prima dell'implementazione.

Se hai abilitato i flussi di lavoro estesi, puoi invece usare:

```text
/opsx:new        # solo struttura
/opsx:continue   # crea un artefatto alla volta
/opsx:ff         # crea tutti gli artefatti di pianificazione in una sola volta
```

### Crea artefatti
```
/opsx:continue
```
Mostra cosa è pronto per essere creato in base alle dipendenze, poi crea un artefatto. Usalo ripetutamente per costruire la tua modifica in modo incrementale.

```
/opsx:ff add-dark-mode
```
Crea tutti gli artefatti di pianificazione in una sola volta. Usalo quando hai un'idea chiara di cosa stai costruendo.

### Implementa (la parte fluida)
```
/opsx:apply
```
Gestisce le attività, spuntandole man mano che procedi. Se stai gestendo più modifiche contemporaneamente, puoi eseguire `/opsx:apply <name>`; altrimenti dovrebbe dedurre dalla conversazione e chiederti di scegliere se non riesce a capire.

### Aggiornamento di una modifica
```
/opsx:update add-dark-mode - we're storing the theme in a cookie now
```
Rivede gli artefatti di pianificazione esistenti della modifica e li mantiene coerenti — in qualsiasi direzione (una modifica alla progettazione può ripercuotersi sulla proposta). Solo artefatti di pianificazione: non modifica mai il codice e non crea mai artefatti mancanti (per quello c'è `/opsx:continue`). Ogni modifica viene prima confermata con te. Se la modifica è già stata implementata, consiglia `/opsx:apply` in modo che il codice si adegui al piano rivisto. Se la tua revisione modifica l'*intento* della modifica, inizia da capo invece — vedi [Quando aggiornare vs. iniziare da capo](#when-to-update-vs-start-fresh).

### Concludi
```
/opsx:archive   # Sposta negli archivi quando hai finito (chiede di sincronizzare le specs se necessario)
```

## Quando aggiornare vs. iniziare da capo

Puoi sempre modificare la tua proposta o le tue specs prima dell'implementazione. Ma quando il perfezionamento diventa "questo è un lavoro diverso"?

### Cosa cattura una proposta

Una proposta definisce tre cose:
1. **Intento** — Che problema stai risolvendo?
2. **Ambito** — Cosa è dentro/fuori dai limiti?
3. **Approccio** — Come lo risolverai?

La domanda è: cosa è cambiato, e di quanto?

### Aggiorna la modifica esistente quando:

**Stesso intento, esecuzione perfezionata**
- Scopri casi limite che non avevi considerato
- L'approccio ha bisogno di piccoli aggiustamenti ma l'obiettivo è invariato
- L'implementazione rivela che la progettazione era leggermente sbagliata

**L'ambito si restringe**
- Ti accorgi che l'ambito completo è troppo grande, vuoi rilasciare prima l'MVP
- "Aggiungi la modalità scura" → "Aggiungi l'interruttore della modalità scura (preferenza di sistema nella v2)"

**Correzioni basate sull'apprendimento**
- Il codebase non è strutturato come pensavi
- Una dipendenza non funziona come previsto
- "Usa le variabili CSS" → "Usa invece il prefisso `dark:` di Tailwind"

### Inizia una nuova modifica quando:

**Intento fondamentalmente cambiato**
- Il problema stesso è diverso ora
- "Aggiungi la modalità scura" → "Aggiungi un sistema di temi completo con colori, font e spaziatura personalizzati"

**L'ambito è esploso**
- La modifica è cresciuta così tanto che è essenzialmente un lavoro diverso
- La proposta originale sarebbe irriconoscibile dopo gli aggiornamenti
- "Correggi il bug di login" → "Riscrivi il sistema di autenticazione"

**L'originale è completabile**
- La modifica originale può essere contrassegnata come "fatto"
- Il nuovo lavoro è autonomo, non un perfezionamento
- Completa "Aggiungi MVP modalità scura" → Archivia → Nuova modifica "Migliora la modalità scura"

### Le euristiche

```
                        ┌─────────────────────────────────────┐
                        │     Is this the same work?          │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Same intent?      >50% overlap?      Can original
             Same problem?     Same scope?        be "done" without
                    │                  │          these changes?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         YES               NO YES           NO  NO              YES
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       UPDATE            NEW  UPDATE       NEW  UPDATE          NEW
```

| Test | Aggiorna | Nuova modifica |
|------|---------|-------------|
| **Identità** | "Stessa cosa, perfezionata" | "Lavoro diverso" |
| **Sovrapposizione di ambito** | >50% di sovrapposizione | <50% di sovrapposizione |
| **Completamento** | Non può essere "fatto" senza modifiche | Puoi completare l'originale, il nuovo lavoro è autonomo |
| **Storia** | La catena di aggiornamenti racconta una storia coerente | Le patch creerebbero più confusione che chiarezza |

### Il principio

> **L'aggiornamento preserva il contesto. La nuova modifica fornisce chiarezza.**
>
> Scegli l'aggiornamento quando la storia del tuo processo di pensiero è preziosa.
> Scegli una nuova modifica quando iniziare da capo sarebbe più chiaro che applicare patch.

Pensalo come i branch di git:
- Continua a fare commit mentre lavori sulla stessa feature
- Avvia un nuovo branch quando si tratta di un lavoro veramente nuovo
- A volte mergia una funzionalità parziale e inizia da capo per la fase 2

## Cosa c'è di diverso?

| | Legacy (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Struttura** | Un unico grande documento di proposta | Artefatti discreti con dipendenze |
| **Flusso di lavoro** | Fasi lineari: pianifica → implementa → archivia | Azioni fluide — fai qualsiasi cosa in qualsiasi momento |
| **Iterazione** | Scomodo tornare indietro | Aggiorna gli artefatti man mano che impari |
| **Personalizzazione** | Struttura fissa | Guidato da schema (definisci i tuoi artefatti) |

**L'intuizione chiave:** il lavoro non è lineare. OPSX smette di fingere che lo sia.

## Approfondimento dell'architettura

Questa sezione spiega come funziona OPSX internamente e come si confronta con il flusso di lavoro legacy.
Gli esempi in questa sezione utilizzano il set di comandi esteso (`new`, `continue`, ecc.); gli utenti predefiniti di `core` possono mappare lo stesso flusso a `propose → apply → sync → archive`.

### Filosofia: Fasi vs Azioni

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUSSO DI LAVORO LEGACY                              │
│                    (Bloccato per fasi, Tutto o niente)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   FASE DI    │ ───► │   FASE DI    │ ───► │   FASE DI    │             │
│   │  PIANIFICAZ. │      │ IMPLEMENTAZ. │      │  ARCHIVIAZ.  │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Crea TUTTI gli artefatti in una sola volta                              │
│   • Non è possibile tornare indietro per aggiornare le specifiche durante    │
│     l'implementazione                                                       │
│   • I cancelli di fase impongono una progressione lineare                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            FLUSSO DI LAVORO OPSX                             │
│                      (Azioni fluide, Iterativo)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           AZIONI (non fasi)                │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              ordine qualsiasi              │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Crea gli artefatti uno alla volta OPPURE salta direttamente alle fasi    │
│     successive                                                               │
│   • Aggiorna le specifiche, il design e i task durante l'implementazione    │
│   • Le dipendenze abilitano il progresso, le fasi non esistono               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Architettura dei componenti

Il **flusso di lavoro legacy** utilizza template hardcodati in TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      COMPONENTI DEL FLUSSO DI LAVORO LEGACY                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Template hardcodati (stringhe TypeScript)                                 │
│                    │                                                        │
│                    ▼                                                        │
│   Configuratori/adattatori specifici per strumento                          │
│                    │                                                        │
│                    ▼                                                        │
│   File di comando generati (.claude/commands/openspec/*.md)                 │
│                                                                             │
│   • Struttura fissa, nessuna consapevolezza degli artefatti                 │
│   • Le modifiche richiedono la modifica del codice e la ricompilazione      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** utilizza schemi esterni e un motore di grafo delle dipendenze:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPONENTI OPSX                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Definizioni di schemi (YAML)                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Dipendenze                       │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Pattern glob                     │   │
│   │      requires: [proposal]      ◄── Abilita dopo la proposta          │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Motore di grafo degli artefatti                                           │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Ordinamento topologico (ordinamento per dipendenze)              │   │
│   │  • Rilevamento dello stato (esistenza nel filesystem)               │   │
│   │  • Generazione di istruzioni avanzate (template + contesto)         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   File di skill (.claude/skills/openspec-*/SKILL.md)                        │
│                                                                             │
│   • Compatibile con editor multipli (Claude Code, Cursor, Windsurf)         │
│   • CLI di interrogazione delle skill per dati strutturati                  │
│   • Completamente personalizzabile tramite file di schema                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Modello di grafo delle dipendenze

Gli artefatti formano un grafo aciclico diretto (DAG). Le dipendenze sono **abilitatori**, non cancelli:

```
                              proposal
                             (nodo radice)
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
                 specs                       design
              (richiede:                  (richiede:
               proposal)                   proposal)
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                               tasks
                           (richiede:
                           specs, design)
                                  │
                                  ▼
                          ┌──────────────┐
                          │ FASE DI      │
                          │ APPLICAZIONE │
                          │ (richiede:   │
                          │  tasks)      │
                          └──────────────┘
```

**Transizioni di stato:**

```
   BLOCCATO ────────────────► PRONTO ────────────────► COMPLETATO
      │                        │                       │
   Dipendenze               Tutte le                 Il file esiste
   mancanti                 dipendenze               nel filesystem
                           sono COMPLETATE
```

### Flusso di informazioni

**Flusso di lavoro legacy** — l'agente riceve istruzioni statiche:

```
  User: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Istruzioni statiche:                   │
  │  • Crea proposal.md                     │
  │  • Crea tasks.md                        │
  │  • Crea design.md                       │
  │  • Crea specs/<capability>/spec.md      │
  │                                         │
  │  Nessuna consapevolezza di cosa esiste  │
  │  o delle dipendenze tra gli artefatti   │
  └─────────────────────────────────────────┘
           │
           ▼
  L'agente crea TUTTI gli artefatti in una sola volta
```

**OPSX** — l'agente interroga per ottenere un contesto avanzato:

```
  User: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Passo 1: Interroga lo stato corrente                                    │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec status --change "add-auth" --json                      │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "artifacts": [                                                  │  │
  │  │      {"id": "proposal", "status": "done"},                         │  │
  │  │      {"id": "specs", "status": "ready"},      ◄── Pronto per primo  │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked", "missingDeps": ["specs"]}│  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Passo 2: Ottieni istruzioni avanzate per l'artefatto pronto             │
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
  │  Passo 3: Leggi le dipendenze → Crea UN solo artefatto → Mostra cosa     │
  │  viene sbloccato                                                         │
  └──────────────────────────────────────────────────────────────────────────┘
```

### Modello di iterazione

**Flusso di lavoro legacy** — scomodo da iterare:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Attendi, il design è sbagliato"
       │               │
       │               ├── Opzioni:
       │               │   • Modifica i file manualmente (rompe il contesto)
       │               │   • Abbandona e ricomincia da capo
       │               │   • Procedi e correggi successivamente
       │               │
       │               └── Nessun meccanismo ufficiale per "tornare indietro"
       │
       └── Crea TUTTI gli artifact in una sola volta
```

**OPSX** — iterazione naturale:

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── "Il design è sbagliato"
      │                │                  │
      │                │                  ▼
      │                │            Basta modificare design.md
      │                │            e continuare!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply riprende
      │                │         da dove ti sei interrotto
      │                │
      │                └── Crea UN SOLO artifact, mostra cosa viene sbloccato
      │
      └── Prepara la modifica, attende indicazioni
```

### Schemi personalizzati

Crea flussi di lavoro personalizzati utilizzando i comandi di gestione degli schemi:

```bash
# Crea un nuovo schema da zero (interattivo)
openspec schema init my-workflow

# Oppure crea una fork di uno schema esistente come punto di partenza
openspec schema fork spec-driven my-workflow

# Valida la struttura del tuo schema
openspec schema validate my-workflow

# Vedi da dove viene risolto uno schema (utile per il debug)
openspec schema which my-workflow
```

Gli schemi sono memorizzati in `openspec/schemas/` (a livello di progetto, sotto controllo di versione) o in `~/.local/share/openspec/schemas/` (globale per l'utente).

**Struttura dello schema:**
```
openspec/schemas/research-first/
├── schema.yaml
└── templates/
    ├── research.md
    ├── proposal.md
    └── tasks.md
```

**Esempio di schema.yaml:**
```yaml
name: research-first
artifacts:
  - id: research        # Aggiunto prima della proposta
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Ora dipende da research

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**Grafico delle dipendenze:**
```
   research ──► proposal ──► tasks
```

### Riepilogo

| Aspetto | Legacy | OPSX |
|--------|----------|------|
| **Modelli** | TypeScript hardcodato | YAML esterno + Markdown |
| **Dipendenze** | Nessuna (tutti in una sola volta) | DAG con ordinamento topologico |
| **Stato** | Modello mentale basato su fasi | Esistenza nel filesystem |
| **Personalizzazione** | Modifica il sorgente, ricompila | Crea schema.yaml |
| **Iterazione** | Bloccata per fasi | Fluida, modifica qualsiasi elemento |
| **Supporto editor** | Configuratore/adattatori specifici per strumento | Directory di competenze singola |
## Schemi

Gli schemi definiscono quali artifact esistono e le loro dipendenze. Attualmente disponibili:

- **spec-driven** (predefinito): proposal → specs → design → tasks

```bash
# Elenca gli schemi disponibili
openspec schemas

# Vedi tutti gli schemi con le loro fonti di risoluzione
openspec schema which --all

# Crea un nuovo schema in modo interattivo
openspec schema init my-workflow

# Crea una fork di uno schema esistente per la personalizzazione
openspec schema fork spec-driven my-workflow

# Valida la struttura dello schema prima dell'uso
openspec schema validate my-workflow
```

## Consigli

- Usa `/opsx:explore` per elaborare un'idea prima di impegnarti in una modifica
- Usa `/opsx:ff` quando sai cosa vuoi, `/opsx:continue` quando stai esplorando
- Durante `/opsx:apply`, se qualcosa non va — correggi l'artifact, poi continua
- Le attività tracciano i progressi tramite checkbox in `tasks.md`
- Controlla lo stato in qualsiasi momento: `openspec status --change "name"`

## Feedback

Questa è una versione grezza. È intenzionale — stiamo imparando cosa funziona.

Hai trovato un bug? Hai delle idee? Unisciti a noi su [Discord](https://discord.gg/YctCnvvshC) o apri una issue su [GitHub](https://github.com/Fission-AI/openspec/issues).