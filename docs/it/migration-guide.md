# Migrazione a OPSX

Questa guida ti aiuta a passare dal vecchio flusso di lavoro OpenSpec a OPSX. La migrazione è progettata per essere fluida: il tuo lavoro esistente viene preservato e il nuovo sistema offre maggiore flessibilità.

## Cosa cambia?

OPSX sostituisce il vecchio flusso di lavoro bloccato sulle fasi con un approccio fluido basato sulle azioni. Ecco il cambiamento chiave:

| Aspetto | Legacy | OPSX |
|--------|--------|------|
| **Comandi** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Predefiniti: `/opsx:propose`, `/opsx:apply`, `/opsx:archive` (comandi di flusso di lavoro estesi opzionali) |
| **Flusso di lavoro** | Creare tutti gli artefatti in una volta | Creare in modo incrementale o tutto in una volta—a tua scelta |
| **Tornare indietro** | Fasi rigide e scomode | Naturale—aggiorna qualsiasi artefatto in qualsiasi momento |
| **Personalizzazione** | Struttura fissa | Guidato da schema, completamente personalizzabile |
| **Configurazione** | `CLAUDE.md` con marcatori + `project.md` | Configurazione pulita in `openspec/config.yaml` |

**Il cambiamento di filosofia:** Il lavoro non è lineare. OPSX smette di fingere che lo sia.

---

## Prima di Iniziare

### Il Tuo Lavoro Esistente È Al Sicuro

Il processo di migrazione è progettato con la preservazione in mente:

- **Modifiche attive in `openspec/changes/`** — Completamente preservate. Puoi continuare a lavorarci con i comandi OPSX.
- **Modifiche archiviate** — Intatte. La tua storia rimane intatta.
- **Specifiche principali in `openspec/specs/`** — Intatte. Queste sono la tua fonte di verità.
- **Il tuo contenuto in CLAUDE.md, AGENTS.md, ecc.** — Preservato. Solo i blocchi marker di OpenSpec vengono rimossi; tutto ciò che hai scritto rimane.

### Cosa Viene Rimosso

Solo i file gestiti da OpenSpec che stanno per essere sostituiti:

| Cosa | Perché |
|------|--------|
| Directory/file di comandi slash legacy | Sostituiti dal nuovo sistema di skill |
| `openspec/AGENTS.md` | Trigger di workflow obsoleto |
| Marker OpenSpec in `CLAUDE.md`, `AGENTS.md`, ecc. | Non più necessari |

**Posizioni dei comandi legacy per strumento** (esempi — il tuo strumento potrebbe variare):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (solo estensioni IDE; non supportato in Copilot CLI)
- E altri (Augment, Continue, Amazon Q, ecc.)

La migrazione rileva quali strumenti hai configurato e pulisce i loro file legacy.

L'elenco delle rimozioni potrebbe sembrare lungo, ma si tratta di tutti file che OpenSpec ha creato originariamente. I tuoi contenuti non vengono mai cancellati.

### Cosa Richiede la Tua Attenzione

Un file richiede una migrazione manuale:

**`openspec/project.md`** — Questo file non viene cancellato automaticamente perché potrebbe contenere contesto del progetto che hai scritto. Dovrai:

1. Rivederne il contenuto
2. Spostare il contesto utile in `openspec/config.yaml` (vedi le linee guida qui sotto)
3. Cancellare il file quando sei pronto

**Perché abbiamo apportato questa modifica:**

Il vecchio `project.md` era passivo — gli agenti potevano leggerlo, potevano non farlo, potevano dimenticare ciò che avevano letto. Abbiamo trovato che l'affidabilità era inconsistente.

Il nuovo contesto in `config.yaml` viene **iniettato attivamente in ogni richiesta di pianificazione di OpenSpec**. Questo significa che le tue convenzioni di progetto, lo stack tecnologico e le regole sono sempre presenti quando l'AI crea gli artefatti. Maggiore affidabilità.

**Il compromesso:**

Poiché il contesto viene iniettato in ogni richiesta, vorrai essere conciso. Concentrati su ciò che conta davvero:
- Stack tecnologico e convenzioni principali
- Vincoli non ovvi che l'AI deve conoscere
- Regole che in precedenza venivano spesso ignorate

Non preoccuparti di renderlo perfetto. Stiamo ancora imparando cosa funziona meglio qui, e miglioreremo il modo in cui funziona l'iniezione del contesto man mano che facciamo esperimenti.

---

## Esecuzione della Migrazione

Sia `openspec init` che `openspec update` rilevano i file legacy e ti guidano attraverso lo stesso processo di pulizia. Usa quello più adatto alla tua situazione:

- Le installazioni nuove usano il profilo predefinito `core` (`propose`, `explore`, `apply`, `archive`).
- Le installazioni migrate preservano i tuoi workflow precedentemente installati scrivendo un profilo `custom` quando necessario.

### Usando `openspec init`

Esegui questo comando se vuoi aggiungere nuovi strumenti o riconfigurare quali strumenti sono configurati:

```bash
openspec init
```

Il comando init rileva i file legacy e ti guida nella pulita:

```
Aggiornamento al nuovo OpenSpec

OpenSpec ora usa le skill per agenti, lo standard emergente tra gli
agenti di codifica. Questo semplifica la tua configurazione mantenendo
tutto funzionante come prima.

File da rimuovere
Nessun contenuto utente da preservare:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

File da aggiornare
I marker OpenSpec verranno rimossi, il tuo contenuto preservato:
  • CLAUDE.md
  • AGENTS.md

Richiede la tua attenzione
  • openspec/project.md
    Non cancelleremo questo file. Potrebbe contenere contesto utile del progetto.

    Il nuovo openspec/config.yaml ha una sezione "context:" per il contesto
    di pianificazione. Questo viene incluso in ogni richiesta OpenSpec e funziona
    in modo più affidabile rispetto al vecchio approccio con project.md.

    Rivedi project.md, sposta qualsiasi contenuto utile nella sezione context
    di config.yaml, poi cancella il file quando sei pronto.

? Aggiornare e pulire i file legacy? (S/n)
```

**Cosa succedi quando rispondi sì:**

1. Le directory di comandi slash legacy vengono rimosse
2. I marker OpenSpec vengono rimossi da `CLAUDE.md`, `AGENTS.md`, ecc. (il tuo contenuto rimane)
3. `openspec/AGENTS.md` viene cancellato
4. Nuove skill vengono installate in `.claude/skills/`
5. `openspec/config.yaml` viene creato con uno schema predefinito

### Usando `openspec update`

Esegui questo comando se vuoi solo migrare e aggiornare i tuoi strumenti esistenti all'ultima versione:

```bash
openspec update
```

Il comando update rileva e pulisce anche gli artefatti legacy, poi aggiorna le skill/comandi generati per corrispondere al tuo profilo e alle impostazioni di delivery attuali.

### Ambienti Non Interattivi / CI

Per migrazioni scriptate:

```bash
openspec init --force --tools claude
```

Il flag `--force` salta le richieste e accetta automaticamente la pulita.

---

## Migrazione da project.md a config.yaml

Il vecchio `openspec/project.md` era un file markdown libero per il contesto del progetto. Il nuovo `openspec/config.yaml` è strutturato e — cosa cruciale — **iniettato in ogni richiesta di pianificazione** in modo che le tue convenzioni siano sempre presenti quando l'AI lavora.

### Prima (project.md)

```markdown
# Project Context

This is a TypeScript monorepo using React and Node.js.
We use Jest for testing and follow strict ESLint rules.
Our API is RESTful and documented in docs/api.md.

## Conventions

- All public APIs must maintain backwards compatibility
- New features should include tests
- Use Given/When/Then format for specifications
```

### Dopo (config.yaml)

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  Testing: Jest with React Testing Library
  API: RESTful, documented in docs/api.md
  We maintain backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan for risky changes
  specs:
    - Use Given/When/Then format for scenarios
    - Reference existing patterns before inventing new ones
  design:
    - Include sequence diagrams for complex flows
```

### Differenze Chiave

| project.md | config.yaml |
|------------|-------------|
| Markdown libero | YAML strutturato |
| Un unico blocco di testo | Contesto separato e regole per artefatto |
| Non è chiaro quando viene usato | Il contesto appare in TUTTI gli artefatti; le regole appaiono solo negli artefatti corrispondenti |
| Nessuna selezione di schema | Il campo esplicito `schema:` imposta il workflow predefinito |

### Cosa Mantenere, Cosa Scartare

Durante la migrazione, sii selettivo. Chiediti: "L'AI ha bisogno di questo per *ogni* richiesta di pianificazione?"

**Candidati buoni per `context:`**
- Stack tecnologico (linguaggi, framework, database)
- Pattern architettonici chiave (monorepo, microservizi, ecc.)
- Vincoli non ovvi ("non possiamo usare la libreria X perché...")
- Convenzioni critiche che spesso vengono ignorate

**Sposta invece in `rules:`**
- Formattazione specifica per artefatto ("usa Given/When/Then nelle specifiche")
- Criteri di revisione ("le proposte devono includere piani di rollback")
- Queste appaiono solo per l'artefatto corrispondente, mantenendo le altre richieste più leggere

**Lascia fuori del tutto**
- Best practice generali che l'AI già conosce
- Spiegazioni verbose che potrebbero essere riassunte
- Contesto storico che non influenza il lavoro attuale

### Passaggi della Migrazione

1. **Crea config.yaml** (se non è già stato creato da init):
   ```yaml
   schema: spec-driven
   ```

2. **Aggiungi il tuo contesto** (sii conciso — questo va in ogni richiesta):
   ```yaml
   context: |
     Il contesto del tuo progetto va qui.
     Concentrati su ciò che l'AI deve davvero sapere.
   ```

3. **Aggiungi regole per artefatto** (opzionale):
   ```yaml
   rules:
     proposal:
       - Le tue linee guida specifiche per le proposte
     specs:
       - Le tue regole per la scrittura delle specifiche
   ```

4. **Cancella project.md** una volta che hai spostato tutto il contenuto utile.

**Non pensarci troppo.** Inizia con l'essenziale e itera. Se noti che l'AI manca qualcosa di importante, aggiungilo. Se il contesto sembra gonfio, taglia. Questo è un documento vivente.

### Hai Bisogno di Aiuto? Usa Questo Prompt

Se non sei sicuro di come distillare il tuo project.md, chiedi al tuo assistente AI:

```
Sto migrando dal vecchio project.md di OpenSpec al nuovo formato config.yaml.

Ecco il mio project.md attuale:
[inserisci il contenuto del tuo project.md]

Per favore aiutami a creare un config.yaml con:
1. Una sezione `context:` concisa (questa viene iniettata in ogni richiesta di pianificazione, quindi mantienila stretta — concentrati su stack tecnologico, vincoli chiave e convenzioni che spesso vengono ignorate)
2. `rules:` per artefatti specifici se c'è contenuto specifico per un artefatto (ad esempio, "usa Given/When/Then" appartiene nelle regole delle specifiche, non nel contesto globale)

Lascia fuori qualsiasi cosa generica che i modelli AI già conoscono. Sii spietato nella brevità.
```

L'AI ti aiuterà a identificare cosa è essenziale rispetto a cosa può essere tagliato.

---

## I Nuovi Comandi

La disponibilità dei comandi dipende dal profilo:

**Predefinito (profilo `core`):**

| Comando | Scopo |
|---------|-------|
| `/opsx:propose` | Crea una modifica e genera gli artefatti di pianificazione in un solo passaggio |
| `/opsx:explore` | Pensa alle idee senza struttura |
| `/opsx:apply` | Implementa i task da tasks.md |
| `/opsx:archive` | Finalizza e archivia la modifica |

**Workflow esteso (selezione personalizzata):**

| Comando | Scopo |
|---------|-------|
| `/opsx:new` | Avvia una nuova modifica scaffold |
| `/opsx:continue` | Crea il prossimo artefatto (uno alla volta) |
| `/opsx:ff` | Avanzamento rapido — crea gli artefatti di pianificazione tutti insieme |
| `/opsx:verify` | Valida che l'implementazione corrisponda alle specifiche |
| `/opsx:sync` | Anteprima/fusione delle specifiche senza archiviare |
| `/opsx:bulk-archive` | Archivia più modifiche contemporaneamente |
| `/opsx:onboard` | Workflow di onboarding guidato end-to-end |

Abilita i comandi estesi con `openspec config profile`, poi esegui `openspec update`.

### Mappatura dei Comandi dai Legacy

| Legacy | Equivalente OPSX |
|--------|------------------|
| `/openspec:proposal` | `/opsx:propose` (predefinito) o `/opsx:new` poi `/opsx:ff` (esteso) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Nuove Funzionalità

Queste funzionalità fanno parte del set di comandi del workflow esteso.

**Creazione granulare degli artefatti:**
```
/opsx:continue
```
Crea un artefatto alla volta in base alle dipendenze. Usa questo quando vuoi rivedere ogni passaggio.

**Modalità esplorativa:**
```
/opsx:explore
```
Pensa alle idee con un partner prima di impegnarti in una modifica.

---

## Comprendere la Nuova Architettura

### Da Fase-Bloccata a Fluido

Il flusso di lavoro legacy imponeva una progressione lineare:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  PIANIFICA   │ ───► │ ATTUAZIONE   │ ───► │  ARCHIVIAZIONE│
│    FASE      │      │    FASE      │      │    FASE      │
└──────────────┘      └──────────────┘      └──────────────┘

Se sei nella fase di attuazione e ti rendi conto che la progettazione è sbagliata?
Peccato. Le fasi di controllo non ti permettono di tornare indietro facilmente.
```

OPSX utilizza azioni, non fasi:

```
         ┌───────────────────────────────────────────────┐
         │           AZIONI (non fasi)                   │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    in qualsiasi ordine        │
         └───────────────────────────────────────────────┘
```

### Grafo delle Dipendenze

Gli artefatti formano un grafo diretto. Le dipendenze sono abilitatori, non cancelli:

```
                        proposta
                      (nodo radice)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specifiche                  progettazione
        (richiede:                  (richiede:
         proposta)                   proposta)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         compiti
                     (richiede:
                     specifiche, progettazione)
```

Quando esegui `/opsx:continue`, controlla cosa è pronto e offre l'artefatto successivo. Puoi anche creare più artefatti pronti in qualsiasi ordine.

### Skills vs Comandi

Il sistema legacy utilizzava file di comando specifici per gli strumenti:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX utilizza lo standard emergente delle **skills**:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Le skills sono riconosciute da molteplici strumenti di programmazione AI e forniscono metadati più ricchi.

---

## Continuare Modifiche Esistenti

Le tue modifiche in corso funzionano senza problemi con i comandi OPSX.

**Hai una modifica attiva dal flusso di lavoro legacy?**

```
/opsx:apply add-my-feature
```

OPSX legge gli artefatti esistenti e continua da dove eri rimasto.

**Vuoi aggiungere altri artefatti a una modifica esistente?**

```
/opsx:continue add-my-feature
```

Mostra cosa è pronto per essere creato in base a ciò che esiste già.

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
  Il contesto del tuo progetto, stack tecnologico,
  convenzioni e vincoli.

# Opzionale: Regole per singolo artefatto
# Iniettate solo negli artefatti corrispondenti
rules:
  proposal:
    - Includere il piano di rollback
  specs:
    - Usare il formato Given/When/Then
  design:
    - Documentare le strategie di fallback
  tasks:
    - Suddividere in blocchi massimi di 2 ore
```

### Risoluzione dello Schema

Quando determina quale schema utilizzare, OPSX controlla in ordine:

1. **Flag CLI**: `--schema <nome>` (priorità più alta)
2. **Metadati della modifica**: `.openspec.yaml` nella directory della modifica
3. **Configurazione del progetto**: `openspec/config.yaml`
4. **Predefinito**: `spec-driven`

### Schemi Disponibili

| Schema | Artefatti | Ideale per |
|--------|-----------|------------|
| `spec-driven` | proposta → specifiche → progettazione → compiti | La maggior parte dei progetti |

Elenca tutti gli schemi disponibili:

```bash
openspec schemas
```

### Schemi Personalizzati

Crea il tuo flusso di lavoro:

```bash
openspec schema init my-workflow
```

Oppure crea un fork di uno esistente:

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

### Comandi non appaiono dopo la migrazione

Riavvia la tua IDE. Le skills vengono rilevate all'avvio.

### "Unknown artifact ID in rules"

Verifica che le chiavi `rules:` corrispondano agli ID degli artefatti del tuo schema:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Esegui questo comando per vedere gli ID degli artefatti validi:

```bash
openspec schemas --json
```

### Configurazione non applicata

1. Assicurati che il file sia in `openspec/config.yaml` (non `.yml`)
2. Valida la sintassi YAML
3. Le modifiche alla configurazione hanno effetto immediato—nessun riavvio necessario

### project.md non migrato

Il sistema preserva intenzionalmente `project.md` perché potrebbe contenere contenuti personalizzati. Revisionalo manualmente, sposta le parti utili in `config.yaml`, poi eliminalo.

### Vuoi vedere cosa verrebbe pulito?

Esegui init e rifiuta la richiesta di pulizia—vedrai il riepilogo completo del rilevamento senza che venga apportata alcuna modifica.

---

## Riferimento Rapido

### Dopo la Migrazione

```
project/
├── openspec/
│   ├── specs/                    # Invariato
│   ├── changes/                  # Invariato
│   │   └── archive/              # Invariato
│   └── config.yaml               # NUOVO: Configurazione del progetto
├── .claude/
│   └── skills/                   # NUOVE: Skills OPSX
│       ├── openspec-propose/     # profilo core predefinito
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       └── ...                   # il profilo esteso aggiunge new/continue/ff/ecc.
├── CLAUDE.md                     # Marcatori OpenSpec rimossi, tuo contenuto preservato
└── AGENTS.md                     # Marcatori OpenSpec rimossi, tuo contenuto preservato
```

### Cosa è Scomparso

- `.claude/commands/openspec/` — sostituito da `.claude/skills/`
- `openspec/AGENTS.md` — obsoleto
- `openspec/project.md` — migrare in `config.yaml`, poi eliminare
- Blocchi di marcatori OpenSpec in `CLAUDE.md`, `AGENTS.md`, ecc.

### Scheda Comandi

```text
/opsx:propose      Inizia rapidamente (profilo core predefinito)
/opsx:apply        Attua i compiti
/opsx:archive      Termina e archivia

# Flusso di lavoro esteso (se abilitato):
/opsx:new          Crea la struttura di una modifica
/opsx:continue     Crea l'artefatto successivo
/opsx:ff           Crea gli artefatti di pianificazione
```

---

## Ottenere Aiuto

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Documentazione**: [docs/opsx.md](opsx.md) per il riferimento completo di OPSX