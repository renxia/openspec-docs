# Migrare a OPSX

Questa guida ti aiuta a passare dal vecchio flusso di lavoro OpenSpec a OPSX. La migrazione è progettata per essere fluida—il tuo lavoro esistente viene preservato e il nuovo sistema offre maggiore flessibilità.

## Cosa sta cambiando?

OPSX sostituisce il vecchio flusso di lavoro a fasi bloccate con un approccio fluido basato su azioni. Ecco il cambiamento chiave:

| Aspetto | Legacy | OPSX |
|---------|--------|------|
| **Comandi** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Predefinito: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (comandi di flusso di lavoro estesi opzionali) |
| **Flusso di lavoro** | Crea tutti gli artefatti in una volta | Crea in modo incrementale o tutto in una volta—a tua scelta |
| **Tornare indietro** | Porte di fase scomode | Naturale—aggiorna qualsiasi artefatto in qualsiasi momento |
| **Personalizzazione** | Struttura fissa | Guidata da schema, completamente modificabile |
| **Configurazione** | `CLAUDE.md` con marcatori + `project.md` | Configurazione pulita in `openspec/config.yaml` |

**Il cambiamento di filosofia:** Il lavoro non è lineare. OPSX smette di fingere che lo sia.

---

## Prima di Iniziare

### Il Tuo Lavoro Esistente è al Sicuro

Il processo di migrazione è progettato pensando alla conservazione:

- **Modifiche attive in `openspec/changes/`** — Completamente preservate. Puoi continuare a lavorarci con i comandi OPSX.
- **Modifiche archiviate** — Inalterate. La tua storia rimane intatta.
- **Specifiche principali in `openspec/specs/`** — Inalterate. Queste sono la tua fonte di verità.
- **Il tuo contenuto in CLAUDE.md, AGENTS.md, ecc.** — Preservato. Vengono rimossi solo i blocchi marcatore di OpenSpec; tutto ciò che hai scritto rimane.

### Cosa Viene Rimosso

Solo i file gestiti da OpenSpec che stanno per essere sostituiti:

| Cosa | Perché |
|------|--------|
| Directory/file dei comandi slash legacy | Sostituiti dal nuovo sistema di skills |
| `openspec/AGENTS.md` | Trigger di workflow obsoleto |
| Marcatori OpenSpec in `CLAUDE.md`, `AGENTS.md`, ecc. | Non più necessari |

**Posizioni dei comandi legacy per strumento** (esempi—il tuo strumento potrebbe variare):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (Solo estensioni IDE; non supportato in Copilot CLI)
- E altri (Augment, Continue, Amazon Q, ecc.)

La migrazione rileva gli strumenti che hai configurato e ripulisce i loro file legacy.

L'elenco delle rimozioni può sembrare lungo, ma si tratta di tutti i file che OpenSpec ha originariamente creato. Il tuo contenuto personale non viene mai cancellato.

### Cosa Richiede la Tua Attenzione

Un file richiede migrazione manuale:

**`openspec/project.md`** — Questo file non viene cancellato automaticamente perché potrebbe contenere contesto di progetto che hai scritto. Dovrai:

1. Rivederne il contenuto
2. Spostare il contesto utile in `openspec/config.yaml` (vedi guida sotto)
3. Eliminare il file quando pronto

**Perché abbiamo fatto questa modifica:**

Il vecchio `project.md` era passivo—gli agenti potrebbero leggerlo, potrebbero non farlo, potrebbero dimenticare ciò che hanno letto. Abbiamo riscontrato che l'affidabilità era inconsistente.

Il contesto del nuovo `config.yaml` viene **iniettato attivamente in ogni richiesta di pianificazione di OpenSpec**. Questo significa che le tue convenzioni di progetto, lo stack tecnologico e le regole sono sempre presenti quando l'IA sta creando artefatti. Maggiore affidabilità.

**Il compromesso:**

Poiché il contesto viene iniettato in ogni richiesta, vorrai essere conciso. Concentrati su ciò che conta davvero:
- Stack tecnologico e convenzioni chiave
- Vincoli non ovvi che l'IA deve conoscere
- Regole che prima venivano spesso ignorate

Non preoccuparti di renderlo perfetto. Stiamo ancora imparando cosa funziona meglio qui, e miglioreremo come funziona l'iniezione del contesto mentre sperimentiamo.

---

## Esecuzione della Migrazione

Sia `openspec init` che `openspec update` rilevano i file legacy e ti guidano attraverso lo stesso processo di pulizia. Usa quello che si adatta alla tua situazione:

- Le nuove installazioni usano come predefinito il profilo `core` (`propose`, `explore`, `apply`, `sync`, `archive`).
- Le installazioni migrate preservano i workflow precedentemente installati scrivendo un profilo `custom` quando necessario.

### Usare `openspec init`

Esegui questo comando se vuoi aggiungere nuovi strumenti o riconfigurare quali strumenti sono impostati:

```bash
openspec init
```

Il comando init rileva i file legacy e ti guida attraverso la pulizia:

```
Aggiornamento al nuovo OpenSpec

OpenSpec ora usa le agent skills, lo standard emergente tra gli agenti
di codifica. Questo semplifica la tua configurazione mantenendo tutto
funzionante come prima.

File da rimuovere
Nessun contenuto utente da preservare:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

File da aggiornare
I marcatori OpenSpec verranno rimossi, il tuo contenuto preservato:
  • CLAUDE.md
  • AGENTS.md

Richiede la tua attenzione
  • openspec/project.md
    Non cancelleremo questo file. Potrebbe contenere contesto di progetto utile.

    Il nuovo openspec/config.yaml ha una sezione "context:" per il contesto
    di pianificazione. Questo viene incluso in ogni richiesta OpenSpec e
    funziona in modo più affidabile rispetto al vecchio approccio con project.md.

    Rivedi project.md, sposta qualsiasi contenuto utile nella sezione context
    di config.yaml, quindi cancella il file quando pronto.

? Aggiornare e ripulire i file legacy? (S/n)
```

**Cosa succede quando dici sì:**

1. Le directory dei comandi slash legacy vengono rimosse
2. I marcatori OpenSpec vengono rimossi da `CLAUDE.md`, `AGENTS.md`, ecc. (il tuo contenuto rimane)
3. `openspec/AGENTS.md` viene cancellato
4. Le nuove skills vengono installate in `.claude/skills/`
5. `openspec/config.yaml` viene creato con uno schema predefinito

### Usare `openspec update`

Esegui questo comando se vuoi solo migrare e aggiornare i tuoi strumenti esistenti all'ultima versione:

```bash
openspec update
```

Il comando update rileva e ripulisce anche gli artefatti legacy, quindi aggiorna le skills/comandi generati per corrispondere al tuo profilo e alle impostazioni di delivery attuali.

### Ambienti Non Interattivi / CI

Per migrazioni scriptate:

```bash
openspec init --force --tools claude
```

Il flag `--force` salta i prompt e accetta automaticamente la pulizia.

---

## Migrazione di project.md in config.yaml

Il vecchio `openspec/project.md` era un file markdown libero per il contesto di progetto. Il nuovo `openspec/config.yaml` è strutturato e—cosa fondamentale—**viene iniettato in ogni richiesta di pianificazione** così le tue convenzioni sono sempre presenti quando l'IA lavora.

### Prima (project.md)

```markdown
# Contesto del Progetto

Questo è un monorepo TypeScript che usa React e Node.js.
Usiamo Jest per i test e seguiamo regole ESLint rigorose.
La nostra API è RESTful e documentata in docs/api.md.

## Convenzioni

- Tutte le API pubbliche devono mantenere la compatibilità all'indietro
- Le nuove funzionalità dovrebbero includere test
- Usa il formato Given/When/Then per le specifiche
```

### Dopo (config.yaml)

```yaml
schema: spec-driven

context: |
  Stack tecnologico: TypeScript, React, Node.js
  Testing: Jest con React Testing Library
  API: RESTful, documentata in docs/api.md
  Manteniamo la compatibilità all'indietro per tutte le API pubbliche

rules:
  proposal:
    - Includere piano di rollback per modifiche rischiose
  specs:
    - Usare il formato Given/When/Then per gli scenari
    - Riferirsi a pattern esistenti prima di inventarne di nuovi
  design:
    - Includere diagrammi di sequenza per flussi complessi
```

### Differenze Chiave

| project.md | config.yaml |
|------------|-------------|
| Markdown libero | YAML strutturato |
| Un blocco di testo | Contesto e regole per artefatto separate |
| Non è chiaro quando viene usato | Il contesto appare in TUTTI gli artefatti; le regole appaiono solo negli artefatti corrispondenti |
| Nessuna selezione di schema | Campo `schema:` esplicito imposta il workflow predefinito |

### Cosa Mantenere, Cosa Eliminare

Durante la migrazione, selettivo. Chiediti: "L'IA ha bisogno di questo per *ogni* richiesta di pianificazione?"

**Buoni candidati per `context:`**
- Stack tecnologico (linguaggi, framework, database)
- Pattern architetturali chiave (monorepo, microservizi, ecc.)
- Vincoli non ovvi ("non possiamo usare la libreria X perché...")
- Convenzioni critiche che vengono spesso ignorate

**Sposta in `rules:` invece**
- Formattazione specifica per artefatto ("usa Given/When/Then nelle specs")
- Criteri di revisione ("le proposte devono includere piani di rollback")
- Queste appaiono solo per l'artefatto corrispondente, mantenendo le altre richieste più leggere

**Lascia fuori completamente**
- Best practice generali che l'IA già conosce
- Spiegazioni verbose che potrebbero essere riassunte
- Contesto storico che non influenza il lavoro attuale

### Passaggi della Migrazione

1. **Crea config.yaml** (se non già creato da init):
   ```yaml
   schema: spec-driven
   ```

2. **Aggiungi il tuo contesto** (sii conciso—questo va in ogni richiesta):
   ```yaml
   context: |
     Il background del tuo progetto va qui.
     Concentrati su ciò che l'IA ha genuinamente bisogno di sapere.
   ```

3. **Aggiungi regole per artefatto** (opzionale):
   ```yaml
   rules:
     proposal:
       - La tua guida specifica per le proposte
     specs:
       - Le tue regole per la scrittura delle specs
   ```

4. **Cancella project.md** una volta che hai spostato tutto ciò che è utile.

**Non pensarci troppo.** Inizia con l'essenziale e itera. Se noti che l'IA manca qualcosa di importante, aggiungilo. Se il contesto sembra gonfio, taglialo. Questo è un documento vivente.

### Hai Bisogno di Aiuto? Usa Questo Prompt

Se non sei sicuro di come distillare il tuo project.md, chiedi al tuo assistente IA:

```
Sto migrando dal vecchio project.md di OpenSpec al nuovo formato config.yaml.

Ecco il mio project.md attuale:
[incolla il contenuto del tuo project.md]

Per favore aiutami a creare un config.yaml con:
1. Una sezione `context:` concisa (questa viene iniettata in ogni richiesta di pianificazione, quindi tienila stretta—concentrati sullo stack tecnologico, vincoli chiave e convenzioni che vengono spesso ignorate)
2. `rules:` per artefatti specifici se qualsiasi contenuto è specifico per l'artefatto (es., "usa Given/When/Then" appartiene alle regole delle specs, non al contesto globale)

Lascia fuori qualsiasi cosa generica che i modelli IA già conoscono. Sii spietato sulla brevità.
```

L'IA ti aiuterà a identificare cosa è essenziale rispetto a cosa può essere tagliato.

---

## I Nuovi Comandi

La disponibilità dei comandi dipende dal profilo:

**Predefinito (profilo `core`):**

| Comando | Scopo |
|---------|-------|
| `/opsx:propose` | Crea una modifica e genera artefatti di pianificazione in un solo passaggio |
| `/opsx:explore` | Pensa alle idee senza struttura |
| `/opsx:apply` | Implementa i task da tasks.md |
| `/opsx:archive` | Finalizza e archivia la modifica |

**Workflow espanso (selezione personalizzata):**

| Comando | Scopo |
|---------|-------|
| `/opsx:new` | Inizia un nuovo scaffold di modifica |
| `/opsx:continue` | Crea l'artefatto successivo (uno alla volta) |
| `/opsx:ff` | Fast-forward—crea artefatti di pianificazione tutti insieme |
| `/opsx:verify` | Valida che l'implementazione corrisponda alle specifiche |
| `/opsx:sync` | Unisci le specifiche delta nelle specifiche principali |
| `/opsx:bulk-archive` | Archivia più modifiche contemporaneamente |
| `/opsx:onboard` | Workflow di onboarding guidato end-to-end |

Abilita i comandi espansi con `openspec config profile`, quindi esegui `openspec update`.

### Mappatura dei Comandi dal Legacy

| Legacy | Equivalente OPSX |
|--------|------------------|
| `/openspec:proposal` | `/opsx:propose` (predefinito) oppure `/opsx:new` poi `/opsx:ff` (espanso) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Nuove Capacità

Queste capacità fanno parte del set di comandi del workflow espanso.

**Creazione granulare di artefatti:**
```
/opsx:continue
```
Crea un artefatto alla volta in base alle dipendenze. Usa questo quando vuoi revisionare ogni passaggio.

**Modalità esplorazione:**
```
/opsx:explore
```
Pensa alle idee con un partner prima di impegnarti in una modifica.

---

## Comprensione della Nuova Architettura

### Da Fasi Rigide a Flusso Fluido

Il workflow legacy forzava una progressione lineare:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

Se sei nella fase di implementazione e ti accorgi che il design è sbagliato?
Purtroppo. I gate di fase non permettono di tornare indietro facilmente.
```

OPSX utilizza azioni, non fasi:

```
         ┌───────────────────────────────────────────────┐
         │           ACTIONS (not phases)                │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    any order                  │
         └───────────────────────────────────────────────┘
```

### Grafo delle Dipendenze

Gli artefatti formano un grafo diretto. Le dipendenze sono abilitatori, non gate:

```
                        proposal
                       (root node)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (requires:                  (requires:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (requires:
                     specs, design)
```

Quando esegui `/opsx:continue`, controlla cosa è pronto e offre il prossimo artefatto. Puoi anche creare più artefatti pronti in qualsiasi ordine.

### Skills vs Comandi

Il sistema legacy utilizzava file di comando specifici per gli strumenti:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX utilizza lo standard emergente **skills**:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Le skills sono riconosciute in più strumenti di programmazione AI e forniscono metadati più ricchi.

---

## Continuare le Modifiche Esistenti

Le modifiche in corso funzionano senza problemi con i comandi OPSX.

**Hai una modifica attiva dal workflow legacy?**

```
/opsx:apply add-my-feature
```

OPSX legge gli artefatti esistenti e continua da dove avevi lasciato.

**Vuoi aggiungere più artefatti a una modifica esistente?**

```
/opsx:continue add-my-feature
```

Mostra cosa è pronto da creare in base a ciò che esiste già.

**Hai bisogno di vedere lo stato?**

```bash
openspec status --change add-my-feature
```

---

## Il Nuovo Sistema di Configurazione

### Struttura di config.yaml

```yaml
# Obbligatorio: Schema predefinito per le nuove modifiche
schema: spec-driven

# Opzionale: Contesto del progetto (max 50KB)
# Iniettato in TUTTE le istruzioni degli artefatti
context: |
  Il background del tuo progetto, lo stack tecnologico,
  le convenzioni e i vincoli.

# Opzionale: Regole per artefatto
# Iniettate solo negli artefatti corrispondenti
rules:
  proposal:
    - Includere piano di rollback
  specs:
    - Usare il formato Given/When/Then
  design:
    - Documentare le strategie di fallback
  tasks:
    - Suddividere in blocchi massimi di 2 ore
```

### Risoluzione dello Schema

Quando determina quale schema utilizzare, OPSX controlla in ordine:

1. **Flag CLI**: `--schema <nome>` (priorità massima)
2. **Metadati della modifica**: `.openspec.yaml` nella directory della modifica
3. **Configurazione del progetto**: `openspec/config.yaml`
4. **Predefinito**: `spec-driven`

### Schemi Disponibili

| Schema | Artefatti | Ideale Per |
|--------|-----------|------------|
| `spec-driven` | proposal → specs → design → tasks | La maggior parte dei progetti |

Elenca tutti gli schemi disponibili:

```bash
openspec schemas
```

### Schemi Personalizzati

Crea il tuo workflow:

```bash
openspec schema init my-workflow
```

Oppure fai il fork di uno esistente:

```bash
openspec schema fork spec-driven my-workflow
```

Vedi [Personalizzazione](customization.md) per i dettagli.

---

## Risoluzione dei Problemi

### "Legacy files detected in non-interactive mode"

Stai eseguendo in un ambiente CI o non interattivo. Usa:

```bash
openspec init --force
```

### I comandi non appaiono dopo la migrazione

Riavvia il tuo IDE. Le skills vengono rilevate all'avvio.

### "Unknown artifact ID in rules"

Controlla che le chiavi `rules:` corrispondano agli ID degli artefatti del tuo schema:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Esegui questo per vedere gli ID degli artefatti validi:

```bash
openspec schemas --json
```

### La configurazione non viene applicata

1. Assicurati che il file sia in `openspec/config.yaml` (non `.yml`)
2. Valida la sintassi YAML
3. Le modifiche alla configurazione hanno effetto immediato—nessun riavvio necessario

### project.md non migrato

Il sistema preserva intenzionalmente `project.md` perché potrebbe contenere contenuti personalizzati. Rivedilo manualmente, sposta le parti utili in `config.yaml`, quindi eliminalo.

### Vuoi vedere cosa verrebbe ripulito?

Esegui init e rifiuta il prompt di pulizia—vedrai il riepilogo completo del rilevamento senza che venga apportata alcuna modifica.

---

## Riferimento Rapido

### File Dopo la Migrazione

```
project/
├── openspec/
│   ├── specs/                    # Invariato
│   ├── changes/                  # Invariato
│   │   └── archive/              # Invariato
│   └── config.yaml               # NUOVO: Configurazione del progetto
├── .claude/
│   └── skills/                   # NUOVO: Skills OPSX
│       ├── openspec-propose/     # profilo core predefinito
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # il profilo espanso aggiunge new/continue/ff/ecc.
├── CLAUDE.md                     # Marcatori OpenSpec rimossi, i tuoi contenuti preservati
└── AGENTS.md                     # Marcatori OpenSpec rimossi, i tuoi contenuti preservati
```

### Cosa è Stato Rimosso

- `.claude/commands/openspec/` — sostituito da `.claude/skills/`
- `openspec/AGENTS.md` — obsoleto
- `openspec/project.md` — migrare in `config.yaml`, quindi eliminare
- Blocchi di marcatori OpenSpec in `CLAUDE.md`, `AGENTS.md`, ecc.

### Tavola dei Comandi

```text
/opsx:propose      Inizia rapidamente (profilo core predefinito)
/opsx:apply        Implementa i task
/opsx:archive      Completa e archivia

# Workflow espanso (se abilitato):
/opsx:new          Crea lo scaffold di una modifica
/opsx:continue     Crea il prossimo artefatto
/opsx:ff           Crea gli artefatti di pianificazione
```

---

## Ottenere Aiuto

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Documentazione**: [docs/opsx.md](opsx.md) per il riferimento completo di OPSX