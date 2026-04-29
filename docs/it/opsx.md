# Workflow OPSX

> Accogliamo feedback su [Discord](https://discord.gg/YctCnvvshC).

## Cos'è?

OPSX è ora il workflow standard per OpenSpec.

È un **workflow fluido e iterativo** per le modifiche a OpenSpec. Niente più fasi rigide — solo azioni che puoi intraprendere in qualsiasi momento.

## Perché esiste

Il vecchio flusso di lavoro OpenSpec funziona, ma è **bloccato**:

- **Le istruzioni sono codificate in modo rigido** — nascoste in TypeScript, non puoi modificarle
- **Tutto o niente** — un unico grande comando crea tutto, impossibile testare singole parti
- **Struttura fissa** — stesso flusso per tutti, nessuna personalizzazione
- **Scatola nera** — quando l'output dell'AI è scadente, non puoi modificare i prompt

**OPSX lo apre.** Ora chiunque può:

1. **Sperimentare con le istruzioni** — modificare un modello, vedere se l'AI fa meglio
2. **Testare in modo granulare** — validare le istruzioni di ogni artefatto indipendentemente
3. **Personalizzare i flussi di lavoro** — definire i propri artefatti e dipendenze
4. **Iterare rapidamente** — modificare un modello, testare immediatamente, senza ricostruire

```
Flusso di lavoro legacy:                OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Codificato nel pacchetto│           │  schema.yaml           │◄── Tu modifichi questo
│  (non modificabile)    │           │  templates/*.md        │◄── Oppure questo
│        ↓               │           │        ↓               │
│  Attendi nuova release │           │  Effetto istantaneo    │
│        ↓               │           │        ↓               │
│  Spera che sia migliore│           │  Testalo da solo       │
└────────────────────────┘           └────────────────────────┘
```

**Questo è per tutti:**
- **Team** — creare flussi di lavoro che corrispondano a come lavorate realmente
- **Utenti avanzati** — modificare i prompt per ottenere output AI migliori per il vostro codebase
- **Contributori di OpenSpec** — sperimentare con nuovi approcci senza release

Stiamo ancora tutti imparando cosa funziona meglio. OPSX ci permette di imparare insieme.

## L'esperienza utente

**Il problema dei flussi di lavoro lineari:**
Sei "in fase di pianificazione", poi "in fase di implementazione", poi "fatto". Ma il lavoro reale non funziona così. Implementi qualcosa, realizzi che il tuo design era sbagliato, devi aggiornare le specifiche, continuare l'implementazione. Le fasi lineari vanno contro il modo in cui il lavoro accade realmente.

**Approccio OPSX:**
- **Azioni, non fasi** — crea, implementa, aggiorna, archivia — fai qualsiasi di queste in qualsiasi momento
- **Le dipendenze sono abilitanti** — mostrano cosa è possibile, non cosa è richiesto dopo

```
  proposta ──→ specifiche ──→ design ──→ attività ──→ implementa
```

## Configurazione

```bash
# Assicurati di avere openspec installato — le skill vengono generate automaticamente
openspec init
```

Questo crea le skill in `.claude/skills/` (o equivalente) che gli assistenti AI di coding rilevano automaticamente.

Per impostazione predefinita, OpenSpec usa il profilo di flusso di lavoro `core` (`propose`, `explore`, `apply`, `archive`). Se vuoi i comandi del flusso di lavoro esteso (`new`, `continue`, `ff`, `verify`, `sync`, `bulk-archive`, `onboard`), configurali con `openspec config profile` e applicali con `openspec update`.

Durante la configurazione, ti verrà chiesto di creare una **configurazione del progetto** (`openspec/config.yaml`). Questa è opzionale ma consigliata.

## Configurazione del progetto

La configurazione del progetto ti permette di impostare valori predefiniti e iniettare contesto specifico del progetto in tutti gli artefatti.

### Creare la configurazione

La configurazione viene creata durante `openspec init`, o manualmente:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Stack tecnologico: TypeScript, React, Node.js
  Convenzioni API: RESTful, risposte JSON
  Testing: Vitest per test unitari, Playwright per e2e
  Stile: ESLint con Prettier, TypeScript rigoroso

rules:
  proposal:
    - Includere piano di rollback
    - Identificare team coinvolti
  specs:
    - Usare formato Given/When/Then per gli scenari
  design:
    - Includere diagrammi di sequenza per flussi complessi
```

### Campi della configurazione

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `schema` | stringa | Schema predefinito per nuove modifiche (es. `spec-driven`) |
| `context` | stringa | Contesto del progetto iniettato nelle istruzioni di ogni artefatto |
| `rules` | oggetto | Regole per artefatto, con chiave identificativa dell'artefatto |

### Come funziona

**Precedenza dello schema** (dalla più alta alla più bassa):
1. Flag CLI (`--schema <nome>`)
2. Metadati della modifica (`.openspec.yaml` nella directory della modifica)
3. Configurazione del progetto (`openspec/config.yaml`)
4. Predefinito (`spec-driven`)

**Iniezione del contesto:**
- Il contesto viene anteposto a ogni istruzione dell'artefatto
- Racchiuso nei tag `<context>...</context>`
- Aiuta l'AI a capire le convenzioni del tuo progetto

**Iniezione delle regole:**
- Le regole vengono iniettate solo per gli artefatti corrispondenti
- Racchiusi nei tag `<rules>...</rules>`
- Appaiono dopo il contesto, prima del modello

### ID degli artefatti per schema

**spec-driven** (predefinito):
- `proposal` — Proposta di modifica
- `specs` — Specifiche
- `design` — Design tecnico
- `tasks` — Attività di implementazione

### Validazione della configurazione

- ID artefatti sconosciuti in `rules` generano avvisi
- I nomi degli schemi vengono validati rispetto agli schemi disponibili
- Il contesto ha un limite di dimensione di 50KB
- Lo YAML non valido viene riportato con numeri di riga

### Risoluzione dei problemi

**"ID artefatto sconosciuto in rules: X"**
- Verifica che gli ID artefatti corrispondano al tuo schema (vedi lista sopra)
- Esegui `openspec schemas --json` per vedere gli ID artefatti per ogni schema

**Configurazione non applicata:**
- Assicurati che il file sia in `openspec/config.yaml` (non `.yml`)
- Verifica la sintassi YAML con un validatore
- Le modifiche alla configurazione hanno effetto immediato (nessun riavvio necessario)

**Contest troppo grande:**
- Il contesto è limitato a 50KB
- Riassumi o collega a documentazione esterna invece

## Comandi

| Comando | Cosa fa |
|---------|---------|
| `/opsx:propose` | Crea una modifica e genera gli artefatti di pianificazione in un solo passo (percorso rapido predefinito) |
| `/opsx:explore` | Pensa alle idee, indaga i problemi, chiarisci i requisiti |
| `/opsx:new` | Inizia una nuova modifica scaffold (flusso di lavoro esteso) |
| `/opsx:continue` | Crea il prossimo artefatto (flusso di lavoro esteso) |
| `/opsx:ff` | Avanza rapidamente gli artefatti di pianificazione (flusso di lavoro esteso) |
| `/opsx:apply` | Implementa le attività, aggiornando gli artefatti se necessario |
| `/opsx:verify` | Valida l'implementazione rispetto agli artefatti (flusso di lavoro esteso) |
| `/opsx:sync` | Sincronizza le specifiche delta al principale (flusso di lavoro esteso, opzionale) |
| `/opsx:archive` | Archivia quando finito |
| `/opsx:bulk-archive` | Archivia più modifiche completate (flusso di lavoro esteso) |
| `/opsx:onboard` | Guida passo-passo per una modifica end-to-end (flusso di lavoro esteso) |

## Utilizzo

### Esplora un'idea
```
/opsx:explore
```
Pensa alle idee, indaga i problemi, confronta le opzioni. Nessuna struttura richiesta - solo un partner di riflessione. Quando gli spunti si cristallizzano, passa a `/opsx:propose` (predefinito) o `/opsx:new`/`/opsx:ff` (esteso).

### Inizia una nuova modifica
```
/opsx:propose
```
Crea la modifica e genera gli artefatti di pianificazione necessari prima dell'implementazione.

Se hai abilitato i flussi di lavoro estesi, puoi invece usare:

```text
/opsx:new        # solo scaffold
/opsx:continue   # crea un artefatto alla volta
/opsx:ff         # crea tutti gli artefatti di pianificazione in una volta
```

### Crea artefatti
```
/opsx:continue`
```
Mostra cosa è pronto da creare in base alle dipendenze, poi crea un artefatto. Usa ripetutamente per costruire la tua modifica in modo incrementale.

```
/opsx:ff add-dark-mode
```
Crea tutti gli artefatti di pianificazione in una volta. Usa quando hai una chiara visione di cosa stai costruendo.

### Implementa (la parte fluida)
```
/opsx:apply
```
Lavora attraverso le attività, spuntandole man mano che procedi. Se stai gestendo più modifiche, puoi eseguire `/opsx:apply <nome>`; altrimenti dovrebbe dedurlo dalla conversazione e chiederti di scegliere se non riesce a capire.

### Concludi
```
/opsx:archive   # Sposta in archivio quando finito (chiede di sincronizzare le specifiche se necessario)
```

## Quando aggiornare vs. iniziare da zero

Puoi sempre modificare la tua proposta o specifiche prima dell'implementazione. Ma quando il raffinamento diventa "questo è un lavoro diverso"?

### Cosa cattura una Proposta

Una proposta definisce tre cose:
1. **Intenzione** — Quale problema stai risolvendo?
2. **Ambito** — Cosa è dentro/fuori dai confini?
3. **Approccio** — Come lo risolverai?

La domanda è: cosa è cambiato, e di quanto?

### Aggiorna la modifica esistente quando:

**Stessa intenzione, esecuzione raffinata**
- Scopri casi limite che non avevi considerato
- L'approccio necessita di aggiustamenti ma l'obiettivo è invariato
- L'implementazione rivela che il design era leggermente errato

**L'ambito si riduce**
- Realizzi che l'ambito completo è troppo grande, vuoi rilasciare prima l'MVP
- "Aggiungi dark mode" → "Aggiungi toggle dark mode (preferenza di sistema nella v2)"

**Correzioni guidate dall'apprendimento**
- Il codebase non è strutturato come pensavi
- Una dipendenza non funziona come previsto
- "Usa variabili CSS" → "Usa invece il prefisso dark: di Tailwind"

### Inizia una nuova modifica quando:

**L'intenzione è cambiata fondamentalmente**
- Il problema stesso è diverso ora
- "Aggiungi dark mode" → "Aggiungi un sistema di temi completo con colori, font, spaziatura personalizzati"

**L'ambito è esploso**
- La modifica è cresciuta così tanto che è essenzialmente lavoro diverso
- La proposta originale sarebbe irriconoscibile dopo gli aggiornamenti
- "Correggi bug di login" → "Riscrivi il sistema di autenticazione"

**L'originale è completabile**
- La modifica originale può essere contrassegnata come "fatta"
- Il nuovo lavoro è autonomo, non un raffinamento
- Completa "Aggiungi dark mode MVP" → Archivia → Nuova modifica "Migliora dark mode"

### Le euristiche

```
                        ┌─────────────────────────────────────┐
                        │     È lo stesso lavoro?             │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Stessa intenzione?  >50% sovrapposizione?  L'originale può
             Stesso problema?    Stesso ambito?         essere "fatto" senza
                    │                  │                 queste modifiche?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         SÌ               NO SÌ           NO  NO              SÌ
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       AGGIORNA          NUOVO AGGIORNA    NUOVO AGGIORNA       NUOVO
```

| Testo | Aggiorna | Nuova modifica |
|------|--------|------------|
| **Identità** | "Stessa cosa, raffinata" | "Lavoro diverso" |
| **Sovrapposizione ambito** | >50% sovrapposta | <50% sovrapposta |
| **Completamento** | Non può essere "fatto" senza modifiche | Può finire l'originale, il nuovo lavoro è autonomo |
| **Storia** | La catena di aggiornamenti racconta una storia coerente | Le patch confonderebbero più che chiarire |

### Il principio

> **Aggiornare preserva il contesto. Nuova modifica fornisce chiarezza.**
>
> Scegli aggiorna quando la storia del tuo pensiero è preziosa.
> Scegli nuovo quando iniziare da zero sarebbe più chiaro che applicare patch.

Pensalo come i branch git:
- Continua a fare commit mentre lavori sulla stessa funzionalità
- Inizia un nuovo branch quando è genuinamente lavoro nuovo
- A volte fai merge di una funzionalità parziale e inizia da zero per la fase 2

## Cosa cambia?

| | Legacy (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Struttura** | Un unico grande documento di proposta | Artefatti discreti con dipendenze |
| **Workflow** | Fasi lineari: pianifica → implementa → archivia | Azioni fluide — fai qualsiasi cosa in qualsiasi momento |
| **Iterazione** | Scomodo tornare indietro | Aggiorna gli artefatti man mano che impari |
| **Personalizzazione** | Struttura fissa | Guidato da schema (definisci i tuoi artefatti) |

**L'idea chiave:** il lavoro non è lineare. OPSX smette di fingere che lo sia.

## Analisi approfondita dell'architettura

Questa sezione spiega come funziona OPSX sotto il confronto e come si confronta con il flusso di lavoro legacy.
Gli esempi in questa sezione utilizzano il set di comandi esteso (`new`, `continue`, ecc.); gli utenti predefiniti `core` possono mappare lo stesso flusso su `propose → apply → archive`.

### Filosofia: Fasi vs Azioni

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUSSO DI LAVORO LEGACY                            │
│                    (Bloccato per fase, Tutto o Niente)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   PIANIFICA- │ ───► │  IMPLEMENTA- │ ───► │   ARCHIVIA-  │             │
│   │    ZIONE     │      │    ZIONE     │      │    ZIONE     │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Crea TUTTI gli artifact in una volta                                   │
│   • Non è possibile tornare indietro per aggiornare le specifiche durante  │
│     l'implementazione                                                      │
│   • I gate delle fasi impongono una progressione lineare                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUSSO DI LAVORO OPSX                                │
│                      (Azioni Fluide, Iterativo)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           AZIONI (non fasi)                │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              in qualsiasi ordine           │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Crea gli artifact uno alla volta OPPURE vai avanti rapidamente         │
│   • Aggiorna specifiche/design/task durante l'implementazione              │
│   • Le dipendenze abilitano il progresso, le fasi non esistono             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Architettura dei Componenti

**Il flusso di lavoro legacy** utilizza template codificati in TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   COMPONENTI DEL FLUSSO DI LAVORO LEGACY                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Template Codificati (stringhe TypeScript)                                 │
│                    │                                                        │
│                    ▼                                                        │
│   Configuratori/Adattatori specifici per lo strumento                      │
│                    │                                                        │
│                    ▼                                                        │
│   File di Comando Generati (.claude/commands/openspec/*.md)                 │
│                                                                             │
│   • Struttura fissa, nessuna consapevolezza degli artifact                  │
│   • Le modifiche richiedono modifica del codice + ricostruzione             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** utilizza schemi esterni e un motore a grafo delle dipendenze:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        COMPONENTI OPSX                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Definizioni degli Schemi (YAML)                                           │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Dipendenze                       │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Pattern glob                     │   │
│   │      requires: [proposal]      ◄── Abilita dopo proposal           │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Motore del Grafo degli Artifact                                           │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Ordinamento topologico (ordinamento per dipendenze)              │   │
│   │  • Rilevamento dello stato (esistenza nel file system)              │   │
│   │  • Generazione di istruzioni ricche (template + contesto)           │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   File delle Skill (.claude/skills/openspec-*/SKILL.md)                     │
│                                                                             │
│   • Compatibile con più editor (Claude Code, Cursor, Windsurf)              │
│   • Le skill interrogano la CLI per dati strutturati                       │
│   • Completamente personalizzabile tramite file di schema                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Modello del Grafo delle Dipendenze

Gli artifact formano un grafo aciclico diretto (DAG). Le dipendenze sono **abilitatori**, non gate:

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
                          │ FASE APPLY   │
                          │ (richiede:   │
                          │  tasks)      │
                          └──────────────┘
```

**Transizioni di stato:**

```
   BLOCCATO ────────────────► PRONTO ────────────────► FATTO
      │                        │                       │
   Mancano                  Tutte le dip.            Il file esiste
   le dipendenze            sono FATTE               nel file system
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
  │  esiste o delle dipendenze tra gli      │
  │  artifact                               │
  └─────────────────────────────────────────┘
           │
           ▼
  L'agente crea TUTTI gli artifact in una volta
```

**OPSX** — l'agente interroga per ottenere un contesto ricco:

```
  Utente: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Passo 1: Interroga lo stato corrente                                   │
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
  │  Passo 2: Ottieni istruzioni ricche per l'artifact pronto               │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec instructions specs --change "add-auth" --json          │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "template": "# Specifica\n\n## Requisiti AGGIUNTI...",          │  │
  │  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
  │  │    "unlocks": ["tasks"]                                            │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Passo 3: Leggi le dipendenze → Crea UN artifact → Mostra cosa è        │
  │           sbloccato                                                      │
  └──────────────────────────────────────────────────────────────────────────┘
```

### Modello di Iterazione

**Flusso di lavoro legacy** — scomodo da iterare:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Aspetta, il design è sbagliato"
       │               │
       │               ├── Opzioni:
       │               │   • Modifica i file manualmente (rompe il contesto)
       │               │   • Abbandona e ricomincia da zero
       │               │   • Prosegui e correggi dopo
       │               │
       │               └── Nessun meccanismo ufficiale per "tornare indietro"
       │
       └── Crea TUTTI gli artifact in una volta
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
      │                │         da dove eri rimasto
      │                │
      │                └── Crea UN artifact, mostra cosa è sbloccato
      │
      └── Prepara il cambiamento, attende le direttive
```

### Schemi Personalizzati

Crea flussi di lavoro personalizzati utilizzando i comandi di gestione degli schemi:

```bash
# Crea un nuovo schema da zero (interattivo)
openspec schema init my-workflow

# Oppure biforca uno schema esistente come punto di partenza
openspec schema fork spec-driven my-workflow

# Valida la struttura del tuo schema
openspec schema validate my-workflow

# Vedi da dove risolve uno schema (utile per il debug)
openspec schema which my-workflow
```

Gli schemi sono memorizzati in `openspec/schemas/` (locale al progetto, controllato con versioning) o `~/.local/share/openspec/schemas/` (globale per l'utente).

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
|--------|----------|------|
| **Template** | TypeScript codificato | YAML esterno + Markdown |
| **Dipendenze** | Nessuna (tutto in una volta) | DAG con ordinamento topologico |
| **Stato** | Modello mentale basato su fasi | Esistenza nel file system |
| **Personalizzazione** | Modifica del sorgente, ricostruzione | Crea schema.yaml |
| **Iterazione** | Bloccato per fasi | Fluido, modifica qualsiasi cosa |
| **Supporto Editor** | Configuratori/adattatori specifici per lo strumento | Singola directory delle skill |

## Schemi

Gli schemi definiscono quali artefatti esistono e le loro dipendenze. Attualmente disponibili:

- **spec-driven** (predefinito): proposta → specifiche → design → attività

```bash
# Elenco degli schemi disponibili
openspec schemas

# Visualizza tutti gli schemi con le loro fonti di risoluzione
openspec schema which --all

# Crea un nuovo schema interattivamente
openspec schema init my-workflow

# Biforca uno schema esistente per la personalizzazione
openspec schema fork spec-driven my-workflow

# Valida la struttura dello schema prima dell'uso
openspec schema validate my-workflow
```

## Suggerimenti

- Usa `/opsx:explore` per elaborare un'idea prima di impegnarsi in una modifica
- `/opsx:ff` quando sai cosa vuoi, `/opsx:continue` quando stai esplorando
- Durante `/opsx:apply`, se qualcosa non va — correggi l'artefatto, poi continua
- Le attività tracciano il progresso tramite caselle di controllo in `tasks.md`
- Controlla lo stato in qualsiasi momento: `openspec status --change "name"`

## Feedback

Questo è grezzo. È intenzionale — stiamo imparando cosa funziona.

Hai trovato un bug? Hai idee? Unisciti a noi su [Discord](https://discord.gg/YctCnvvshC) o apri un issue su [GitHub](https://github.com/Fission-AI/openspec/issues).