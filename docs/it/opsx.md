# OPSX Workflow

> Feedback benvenuti su [Discord](https://discord.gg/YctCnvvshC).

## Cos'è?

OPSX è ora il workflow standard per OpenSpec.

È un **workflow fluido, iterativo** per le modifiche a OpenSpec. Niente più fasi rigide — solo azioni che puoi intraprendere in qualsiasi momento.

## Perché Esiste

Il flusso di lavoro legacy di OpenSpec funziona, ma è **bloccato**:

- **Le istruzioni sono hardcoded** — sepolte nel TypeScript, non puoi modificarle
- **Tutto o niente** — un unico grande comando crea tutto, non puoi testare i singoli pezzi
- **Struttura fissa** — stesso flusso di lavoro per tutti, nessuna personalizzazione
- **Scatola nera** — quando l'output dell'IA è scarso, non puoi modificare i prompt

**OPSX lo apre.** Ora chiunque può:

1. **Sperimentare con le istruzioni** — modifica un template, vedi se l'IA fa meglio
2. **Testare in modo granulare** — valida le istruzioni di ogni artefatto indipendentemente
3. **Personalizzare i flussi di lavoro** — definisci i tuoi artefatti e le loro dipendenze
4. **Iterare rapidamente** — modifica un template, testa immediatamente, nessuna ricostruzione

```
Flusso di lavoro legacy:                OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Hardcoded nel package │           │  schema.yaml           │◄── Modifichi questo
│  (non modificabile)    │           │  templates/*.md        │◄── O questo
│        ↓               │           │        ↓               │
│  Attendi nuova release │           │  Effetto immediato     │
│        ↓               │           │        ↓               │
│  Spera sia migliore    │           │  Testalo tu stesso     │
└────────────────────────┘           └────────────────────────┘
```

**Questo è per tutti:**
- **Team** — crea flussi di lavoro che corrispondono a come lavori realmente
- **Utenti avanzati** — modifica i prompt per ottenere output IA migliori per il tuo codebase
- **Contributori OpenSpec** — sperimenta nuovi approcci senza rilasci

Stiamo tutti ancora imparando cosa funziona meglio. OPSX ci permette di imparare insieme.

## L'Esperienza Utente

**Il problema dei flussi di lavoro lineari:**
Sei "nella fase di pianificazione", poi "nella fase di implementazione", poi "finito". Ma il lavoro reale non funziona così. Implementi qualcosa, realizzi che il design era sbagliato, devi aggiornare le specifiche, continui a implementare. Le fasi lineari si scontrano con come il lavoro avviene realmente.

**Approccio OPSX:**
- **Azioni, non fasi** — crea, implementa, aggiorna, archivia — puoi farne qualsiasi in qualsiasi momento
- **Le dipendenze sono abilitatori** — mostrano cosa è possibile, non cosa è richiesto dopo

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Configurazione

```bash
# Assicurati di avere openspec installato — le skill vengono generate automaticamente
openspec init
```

Questo crea le skill in `.claude/skills/` (o equivalente) che gli assistenti di programmazione IA rilevano automaticamente.

Per impostazione predefinita, OpenSpec usa il profilo di flusso di lavoro `core` (`propose`, `explore`, `apply`, `sync`, `archive`). Se vuoi i comandi di flusso di lavoro estesi (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`), configurali con `openspec config profile` e applica con `openspec update`.

Durante la configurazione, ti verrà chiesto di creare una **configurazione di progetto** (`openspec/config.yaml`). Questo è opzionale ma consigliato.

## Configurazione del Progetto

La configurazione del progetto ti permette di impostare i valori predefiniti e iniettare contesto specifico del progetto in tutti gli artefatti.

### Creazione della Configurazione

La configurazione viene creata durante `openspec init`, o manualmente:

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

### Campi della Configurazione

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `schema` | stringa | Schema predefinito per i nuovi cambiamenti (es. `spec-driven`) |
| `context` | stringa | Contesto del progetto iniettato in tutte le istruzioni degli artefatti |
| `rules` | oggetto | Regole per artefatto, indicizzate per ID artefatto |

### Come Funziona

**Precedenza dello schema** (dalla più alta alla più bassa):
1. Flag CLI (`--schema <name>`)
2. Metadati del cambiamento (`.openspec.yaml` nella directory del cambiamento)
3. Configurazione del progetto (`openspec/config.yaml`)
4. Predefinito (`spec-driven`)

**Iniezione del contesto:**
- Il contesto viene anteposto alle istruzioni di ogni artefatto
- Racchiuso in tag `<context>...</context>`
- Aiuta l'IA a comprendere le convenzioni del tuo progetto

**Iniezione delle regole:**
- Le regole vengono iniettate solo per gli artefatti corrispondenti
- Racchiuse in tag `<rules>...</rules>`
- Appaiono dopo il contesto, prima del template

### ID Artefatti per Schema

**spec-driven** (predefinito):
- `proposal` — Proposta di cambiamento
- `specs` — Specifiche
- `design` — Design tecnico
- `tasks` — Task di implementazione

### Validazione della Configurazione

- ID artefatti sconosciuti nelle `rules` generano avvisi
- I nomi degli schemi vengono validati rispetto agli schemi disponibili
- Il contesto ha un limite di dimensione di 50KB
- YAML non valido viene segnalato con i numeri di riga

### Risoluzione dei Problemi

**"ID artefatto sconosciuto nelle regole: X"**
- Controlla che gli ID artefatti corrispondano al tuo schema (vedi elenco sopra)
- Esegui `openspec schemas --json` per vedere gli ID artefatti per ogni schema

**Configurazione non applicata:**
- Assicurati che il file sia in `openspec/config.yaml` (non `.yml`)
- Controlla la sintassi YAML con un validatore
- Le modifiche alla configurazione hanno effetto immediato (nessun riavvio necessario)

**Contesto troppo grande:**
- Il contesto è limitato a 50KB
- Riepiloga o collega a documenti esterni invece

## Comandi

| Comando | Cosa fa |
|---------|---------|
| `/opsx:propose` | Crea un cambiamento e genera artefatti di pianificazione in un unico passaggio (percorso rapido predefinito) |
| `/opsx:explore` | Pensa alle idee, indaga i problemi, chiarisci i requisiti |
| `/opsx:new` | Inizia un nuovo scaffold di cambiamento (flusso di lavoro esteso) |
| `/opsx:continue` | Crea l'artefatto successivo (flusso di lavoro esteso) |
| `/opsx:ff` | Fast-forward degli artefatti di pianificazione (flusso di lavoro esteso) |
| `/opsx:apply` | Implementa i task, aggiornando gli artefatti se necessario |
| `/opsx:verify` | Valida l'implementazione rispetto agli artefatti (flusso di lavoro esteso) |
| `/opsx:sync` | Sincronizza le specifiche delta con il main (flusso di lavoro predefinito, opzionale) |
| `/opsx:archive` | Archivia quando hai finito |
| `/opsx:bulk-archive` | Archivia più cambiamenti completati (flusso di lavoro esteso) |
| `/opsx:onboard` | Guida passo-passo di un cambiamento end-to-end (flusso di lavoro esteso) |

## Utilizzo

### Esplora un'idea
```
/opsx:explore
```
Pensa alle idee, indaga i problemi, confronta le opzioni. Nessuna struttura richiesta — solo un partner di riflessione. Quando le intuizioni si cristallizzano, passa a `/opsx:propose` (predefinito) o `/opsx:new`/`/opsx:ff` (esteso).

### Inizia un nuovo cambiamento
```
/opsx:propose
```
Crea il cambiamento e genera gli artefatti di pianificazione necessari prima dell'implementazione.

Se hai abilitato i flussi di lavoro estesi, puoi invece usare:

```text
/opsx:new        # solo scaffold
/opsx:continue   # crea un artefatto alla volta
/opsx:ff         # crea tutti gli artefatti di pianificazione in una volta
```

### Crea artefatti
```
/opsx:continue
```
Mostra cosa è pronto per essere creato in base alle dipendenze, poi crea un artefatto. Usa ripetutamente per costruire il tuo cambiamento in modo incrementale.

```
/opsx:ff add-dark-mode
```
Crea tutti gli artefatti di pianificazione in una volta. Usalo quando hai un'idea chiara di cosa stai costruendo.

### Implementa (la parte fluida)
```
/opsx:apply
```
Lavora sui task, segnandoli come completati man mano che procedi. Se stai gestendo più cambiamenti, puoi eseguire `/opsx:apply <nome>`; altrimenti dovrebbe dedurre dalla conversazione e chiederti di scegliere se non riesce a capire.

### Concludi
```
/opsx:archive   # Sposta nell'archivio quando hai finito (ti chiederà di sincronizzare le specifiche se necessario)
```

## Quando Aggiornare vs. Ricominciare da Zero

Puoi sempre modificare la tua proposta o le specifiche prima dell'implementazione. Ma quando il perfezionamento diventa "questo è un lavoro diverso"?

### Cosa Cattura una Proposta

Una proposta definisce tre cose:
1. **Intento** — Quale problema stai risolvendo?
2. **Ambito** — Cosa è dentro/fuori dai limiti?
3. **Approccio** — Come lo risolverai?

La domanda è: cosa è cambiato, e di quanto?

### Aggiorna il Cambiamento Esistente Quando:

**Stesso intento, esecuzione perfezionata**
- Scopri casi limite che non avevi considerato
- L'approccio necessita di aggiustamenti ma l'obiettivo è invariato
- L'implementazione rivela che il design era leggermente impreciso

**L'ambito si restringe**
- Ti rendi conto che l'ambito completo è troppo grande, vuoi spedire prima la MVP
- "Aggiungi dark mode" → "Aggiungi toggle dark mode (preferenza di sistema nella v2)"

**Correzioni guidate dall'apprendimento**
- Il codebase non è strutturato come pensavi
- Una dipendenza non funziona come previsto
- "Usa variabili CSS" → "Usa il prefisso dark: di Tailwind invece"

### Inizia un Nuovo Cambiamento Quando:

**L'intentio è fondamentalmente cambiato**
- Il problema stesso è diverso ora
- "Aggiungi dark mode" → "Aggiungi un sistema di temi completo con colori, font, spaziature personalizzati"

**L'ambito è esploso**
- Il cambiamento è cresciuto così tanto che è essenzialmente un lavoro diverso
- La proposta originale sarebbe irriconoscibile dopo gli aggiornamenti
- "Correggi bug di login" → "Riscrivi sistema di autenticazione"

**L'originale è completabile**
- Il cambiamento originale può essere contrassegnato come "finito"
- Il nuovo lavoro è autonomo, non un perfezionamento
- Completa "Aggiungi dark mode MVP" → Archivia → Nuovo cambiamento "Migliora dark mode"

### Le Euristiche

```
                        ┌─────────────────────────────────────┐
                        │     È lo stesso lavoro?             │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Stesso intento?    Sovrapposizione >50%?  L'originale
             Stesso problema?   Stesso ambito?         può essere "finito"
                    │                  │          senza questi cambiamenti?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         SÌ               NO SÌ           NO  NO              SÌ
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       AGGIORNA         NUOVO AGGIORNA    NUOVO AGGIORNA       NUOVO
```

| Test | Aggiornamento | Nuovo Cambiamento |
|------|---------------|-------------------|
| **Identità** | "Stessa cosa, perfezionata" | "Lavoro diverso" |
| **Sovrapposizione ambito** | Sovrapposizioni >50% | Sovrapposizioni <50% |
| **Completamento** | Non può essere "finito" senza cambiamenti | Può completare l'originale, il nuovo lavoro è autonomo |
| **Storia** | La catena di aggiornamenti racconta una storia coerente | Le patch confonderebbero più che chiarire |

### Il Principio

> **L'aggiornamento preserva il contesto. Il nuovo cambiamento fornisce chiarezza.**
>
> Scegli aggiornamento quando la storia del tuo pensiero è preziosa.
>
> Scegli nuovo quando ricominciare da zero sarebbe più chiaro che aggiustare.

Pensalo come i branch di git:
- Continua a fare commit mentre lavori sulla stessa funzionalità
- Inizia un nuovo branch quando è genuinamente un nuovo lavoro
- A volte unisci una funzionalità parziale e ricomincia da zero per la fase 2

## Cosa Cambia?

| | Legacy (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Struttura** | Un unico grande documento di proposta | Artefatti discreti con dipendenze |
| **Flusso di lavoro** | Fasi lineari: pianifica → implementa → archivia | Azioni fluide — fai qualsiasi cosa in qualsiasi momento |
| **Iterazione** | Scomodo tornare indietro | Aggiorna gli artefatti man mano che impari |
| **Personalizzazione** | Struttura fissa | Guidata dallo schema (definisci i tuoi artefatti) |

**L'intuizione chiave:** il lavoro non è lineare. OPSX smette di fingere che lo sia.

## Approfondimento sull'Architettura

Questa sezione spiega come OPSX funziona sotto il cofano e come si confronta con il flusso di lavoro legacy.
Gli esempi in questa sezione utilizzano il set di comandi esteso (`new`, `continue`, ecc.); gli utenti `core` predefiniti possono mappare lo stesso flusso su `propose → apply → sync → archive`.

### Filosofia: Fasi vs Azioni

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUSSO DI LAVORO LEGACY                             │
│                    (A Fasi Bloccate, Tutto-o-Niente)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │    FASE DI   │ ───► │    FASE DI   │ ───► │    FASE DI   │             │
│   │  PIANIFICA-  │      │ IMPLEMENTA-  │      │  ARCHIVIA-   │             │
│   │    ZIONE     │      │    ZIONE     │      │    ZIONE     │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Crea TUTTI gli artefatti in una volta                                 │
│   • Non è possibile tornare indietro per aggiornare le specifiche          │
│     durante l'implementazione                                              │
│   • I gate delle fasi forzano una progressione lineare                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                            FLUSSO DI LAVORO OPSX                            │
│                      (Azioni Fluide, Iterativo)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           AZIONI (non fasi)               │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              in qualsiasi ordine           │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Crea artefatti uno alla volta OPPURE avanza rapidamente                │
│   • Aggiorna specifiche/design/task durante l'implementazione              │
│   • Le dipendenze abilitano il progresso, le fasi non esistono             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Architettura dei Componenti

Il **flusso di lavoro legacy** utilizza template hardcoded in TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPONENTI DEL FLUSSO LEGACY                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Template Hardcoded (stringhe TypeScript)                                  │
│                    │                                                        │
│                    ▼                                                        │
│   Configuratori/adattatori specifici per lo strumento                       │
│                    │                                                        │
│                    ▼                                                        │
│   File di Comando Generati (.claude/commands/openspec/*.md)                 │
│                                                                             │
│   • Struttura fissa, nessuna consapevolezza degli artefatti                 │
│   • Le modifiche richiedono modifica del codice + rebuild                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** utilizza schema esterni e un motore a grafo delle dipendenze:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPONENTI OPSX                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Definizioni di Schema (YAML)                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Dipendenze                       │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Pattern glob                     │   │
│   │      requires: [proposal]      ◄── Abilitato dopo proposal          │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Motore del Grafo degli Artefatti                                          │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Ordinamento topologico (ordinamento per dipendenze)              │   │
│   │  • Rilevamento dello stato (esistenza nel filesystem)               │   │
│   │  • Generazione di istruzioni ricche (template + contesto)           │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   File Skill (.claude/skills/openspec-*/SKILL.md)                           │
│                                                                             │
│   • Compatibile cross-editor (Claude Code, Cursor, Windsurf)               │
│   • Gli skill interrogano la CLI per dati strutturati                      │
│   • Completamente personalizzabile tramite file di schema                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Modello del Grafo delle Dipendenze

Gli artefatti formano un grafo aciclico diretto (DAG). Le dipendenze sono **abilitatori**, non gate:

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
                          │  FASE APPLY  │
                          │ (richiede:   │
                          │  tasks)      │
                          └──────────────┘
```

**Transizioni di stato:**

```
   BLOCCATO ────────────────► PRONTO ────────────────► COMPLETATO
      │                        │                          │
   Dipendenze               Tutte le                   Il file esiste
   mancanti                 dipendenze                 nel filesystem
                            sono COMPLETATE
```

### Flusso delle Informazioni

**Flusso di lavoro legacy** — l'agente riceve istruzioni statiche:

```
  Utente: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Istruzioni statiche:                   │
  │  • Crea proposal.md                     │
  │  • Crea tasks.md                        │
  │  • Crea design.md                       │
  │  • Crea specs/<capability>/spec.md      │
  │                                         │
  │  Nessuna consapevolezza di ciò che      │
  │  esiste o delle dipendenze tra artefatti│
  └─────────────────────────────────────────┘
           │
           ▼
  L'agente crea TUTTI gli artefatti in una volta
```

**OPSX** — l'agente interroga per un contesto ricco:

```
  Utente: "/opsx:continue"
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
  │  │      {"id": "specs", "status": "ready"},      ◄── Primo pronto     │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked", "missingDeps": ["specs"]}│  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
  │  Passo 2: Ottieni istruzioni ricche per l'arte pronto                   │
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
  │  Passo 3: Leggi le dipendenze → Crea UN artefatto → Mostra cosa si sblocca│
  └──────────────────────────────────────────────────────────────────────────┘
```

### Modello di Iterazione

**Flusso di lavoro legacy** — iterare è scomodo:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Aspetta, il design è sbagliato"
       │               │
       │               ├── Opzioni:
       │               │   • Modifica i file manualmente (rompe il contesto)
       │               │   • Abbandona e ricomincia da capo
       │               │   • Prosegui e correggi dopo
       │               │
       │               └── Nessun meccanismo ufficiale per "tornare indietro"
       │
       └── Crea TUTTI gli artefatti in una volta
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
      │                │         /opsx:apply riprende da
      │                │         dove avevi lasciato
      │                │
      │                └── Crea UN artefatto, mostra cosa si sblocca
      │
      └── Imposta il cambio, attende indicazioni
```

### Schema Personalizzati

Crea flussi di lavoro personalizzati utilizzando i comandi di gestione degli schema:

```bash
# Crea un nuovo schema da zero (interattivo)
openspec schema init my-workflow

# Oppure fai il fork di uno schema esistente come punto di partenza
openspec schema fork spec-driven my-workflow

# Valida la struttura del tuo schema
openspec schema validate my-workflow

# Vedi da dove viene risolto uno schema (utile per il debug)
openspec schema which my-workflow
```

Gli schema sono memorizzati in `openspec/schemas/` (locale al progetto, sotto controllo versione) oppure in `~/.local/share/openspec/schemas/` (globale per l'utente).

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
  - id: research        # Aggiunto prima di proposal
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Ora dipende da research

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**Grafo delle Dipendenze:**
```
   research ──► proposal ──► tasks
```

### Riepilogo

| Aspetto | Legacy | OPSX |
|---------|----------|------|
| **Template** | TypeScript hardcoded | YAML esterno + Markdown |
| **Dipendenze** | Nessuna (tutto in una volta) | DAG con ordinamento topologico |
| **Stato** | Modello mentale basato sulle fasi | Esistenza nel filesystem |
| **Personalizzazione** | Modifica sorgente, rebuild | Crea schema.yaml |
| **Iterazione** | Bloccata per fase | Fluida, modifica qualsiasi cosa |
| **Supporto Editor** | Configuratori/adattatori specifici per strumento | Singola directory skill |

## Schemi

Gli schemi definiscono quali artefatti esistono e le loro dipendenze. Attualmente disponibili:

- **spec-driven** (predefinito): proposta → specifiche → progettazione → compiti

```bash
# Elenco degli schemi disponibili
openspec schemas

# Visualizza tutti gli schemi con le relative fonti di risoluzione
openspec schema which --all

# Crea un nuovo schema in modo interattivo
openspec schema init my-workflow

# Duplica uno schema esistente per la personalizzazione
openspec schema fork spec-driven my-workflow

# Valida la struttura dello schema prima dell'uso
openspec schema validate my-workflow
```

## Suggerimenti

- Usa `/opsx:explore` per riflettere su un'idea prima di impegnarti in una modifica
- `/opsx:ff` quando sai cosa vuoi, `/opsx:continue` quando esplori
- Durante `/opsx:apply`, se qualcosa non va — correggi l'artefatto, poi continua
- I compiti tracciano i progressi tramite caselle di controllo in `tasks.md`
- Controlla lo stato in qualsiasi momento: `openspec status --change "nome"`

## Feedback

Questo è un lavoro grezzo. È intenzionale — stiamo imparando cosa funziona.

Hai trovato un bug? Hai idee? Unisciti a noi su [Discord](https://discord.gg/YctCnvvshC) o apri un problema su [GitHub](https://github.com/Fission-AI/openspec/issues).