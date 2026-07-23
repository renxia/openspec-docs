# Migrazione a OPSX

Questa guida ti aiuta a passare dal flusso di lavoro legacy di OpenSpec a OPSX. La migrazione è progettata per essere fluida: il tuo lavoro esistente viene preservato e il nuovo sistema offre maggiore flessibilità.

## Cosa cambia?

OPSX sostituisce il vecchio flusso di lavoro basato su fasi bloccate con un approccio fluido basato su azioni. Ecco il cambiamento principale:

| Aspetto | Legacy | OPSX |
|--------|--------|------|
| **Comandi** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Predefinito: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (comandi di flusso di lavoro estesi opzionali) |
| **Flusso di lavoro** | Crea tutti gli artefatti in una sola volta | Crea in modo incrementale o tutto in una sola volta: a tua scelta |
| **Ritorno alle versioni precedenti** | Passaggi di fase scomodi | Naturale: aggiorna qualsiasi artefatto in qualsiasi momento |
| **Personalizzazione** | Struttura fissa | Basata su schemi, completamente estensibile |
| **Configurazione** | `CLAUDE.md` con marcatori + `project.md` | Configurazione pulita in `openspec/config.yaml` |

**Il cambiamento di filosofia:** il lavoro non è lineare. OPSX smette di fingere che lo sia.

---

## Prima di Iniziare

### Il Tuo Lavoro Esistente È Al Sicuro

Il processo di migrazione è progettato con la preservazione in mente:

- **Modifiche attive in `openspec/changes/`** — Completamente preservate. Puoi continuarle con i comandi OPSX.
- **Modifiche archiviate** — Intatte. La tua cronologia rimane integra.
- **Specifiche principali in `openspec/specs/`** — Intatte. Queste sono la tua fonte di verità.
- **Il tuo contenuto in CLAUDE.md, AGENTS.md, ecc.** — Preservato. Vengono rimossi solo i blocchi di marker OpenSpec; tutto quello che hai scritto rimane.

### Cosa Viene Rimosso

Solo i file gestiti da OpenSpec che vengono sostituiti:

| Cosa | Perché |
|------|--------|
| Directory/file di comandi slash legacy | Sostituiti dal nuovo sistema di skill |
| `openspec/AGENTS.md` | Trigger di workflow obsoleto |
| Marker OpenSpec in `CLAUDE.md`, `AGENTS.md`, ecc. | Non più necessari |

**Percorsi legacy dei comandi per strumento** (esempi—il tuo strumento potrebbe variare):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.cinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (solo per estensioni IDE; non supportato in Copilot CLI)
- Codex: OpenSpec ora utilizza `.codex/skills/openspec-*`; la pulizia legacy riguarda solo i nomi di file di prompt consentiti da OpenSpec nella directory dei prompt globale di Codex `$CODEX_HOME/prompts` o `~/.codex/prompts`, e li rimuove solo dopo che esistono le skill di sostituzione.
- E altri (Augment, Continue, Amazon Q, ecc.)

La migrazione rileva quali strumenti hai configurato e pulisce i loro file legacy.

L'elenco di rimozione potrebbe sembrare lungo, ma si tratta di tutti i file creati originariamente da OpenSpec. Il tuo contenuto personale non viene mai eliminato.

### Cosa Richiede La Tua Attenzione

Un file richiede la migrazione manuale:

**`openspec/project.md`** — Questo file non viene eliminato automaticamente perché potrebbe contenere contesto di progetto che hai scritto. Dovrai:

1. Rivedere il suo contenuto
2. Spostare il contesto utile in `openspec/config.yaml` (vedi le indicazioni sotto)
3. Eliminare il file quando sei pronto

**Perché abbiamo apportato questa modifica:**

Il vecchio `project.md` era passivo: gli agenti potevano leggerlo, potevano non leggerlo, potevano dimenticare cosa avevano letto. Abbiamo riscontrato che l'affidabilità era inconsistente.

Il contesto del nuovo `config.yaml` viene **iniettato attivamente in ogni richiesta di pianificazione OpenSpec**. Questo significa che le convenzioni del tuo progetto, lo stack tecnologico e le regole sono sempre presenti quando l'AI crea gli artefatti. Maggiore affidabilità.

**Il compromesso:**

Poiché il contesto viene iniettato in ogni richiesta, vorrai essere conciso. Concentrati su ciò che conta davvero:
- Stack tecnologico e convenzioni chiave
- Vincoli non ovvi che l'AI deve conoscere
- Regole che venivano spesso ignorate in precedenza

Non preoccuparti di fare tutto perfetto. Stiamo ancora imparando cosa funziona meglio qui, e miglioreremo il funzionamento dell'iniezione di contesto mentre facciamo esperimenti.

---

## Eseguire La Migrazione

Sia `openspec init` che `openspec update` rilevano i file legacy e ti guidano attraverso lo stesso processo di pulizia. Usa quello più adatto alla tua situazione:

- Le nuove installazioni utilizzano il profilo `core` come predefinito (`propose`, `explore`, `apply`, `sync`, `archive`).
- Le installazioni migrate preservano i tuoi workflow precedentemente installati scrivendo un profilo `custom` quando necessario.

### Utilizzare `openspec init`

Esegui questo se vuoi aggiungere nuovi strumenti o riconfigurare quali strumenti sono impostati:

```bash
openspec init
```

Il comando init rileva i file legacy e ti guida attraverso la pulizia:

```
Aggiornamento alla nuova versione di OpenSpec

OpenSpec ora utilizza le skill degli agenti, lo standard emergente tra gli agenti di coding.
Questo semplifica la tua configurazione mantenendo tutto funzionante come prima.

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
    Non elimineremo questo file. Potrebbe contenere contesto di progetto utile.

    Il nuovo openspec/config.yaml ha una sezione "context:" per il contesto di pianificazione.
    Questo viene incluso in ogni richiesta OpenSpec e funziona in modo più affidabile rispetto al vecchio approccio con project.md.

    Rivedi project.md, sposta qualsiasi contenuto utile nella sezione context di config.yaml,
    poi elimina il file quando sei pronto.

? Aggiornare e pulire i file legacy? (Y/n)
```

**Cosa succede quando rispondi sì:**

1. Le directory dei comandi slash legacy vengono rimosse
2. I marker OpenSpec vengono rimossi da `CLAUDE.md`, `AGENTS.md`, ecc. (il tuo contenuto rimane)
3. `openspec/AGENTS.md` viene eliminato
4. Le nuove skill vengono installate in `.claude/skills/`
5. `openspec/config.yaml` viene creato con uno schema predefinito

### Utilizzare `openspec update`

Esegui questo se vuoi solo migrare e aggiornare i tuoi strumenti esistenti all'ultima versione:

```bash
openspec update
```

Il comando update rileva e pulisce anche gli artefatti legacy, poi aggiorna le skill/comandi generati per corrispondere al tuo profilo e alle impostazioni di consegna correnti.

### Ambienti Non Interattivi / CI

Per migrazioni scriptate:

```bash
openspec init --force --tools claude
```

Il flag `--force` salta le richieste e accetta automaticamente la pulizia.

Questo include la pulizia dei file di prompt Codex gestiti da OpenSpec nella directory dei prompt globale di Codex. La pulizia riguarda solo i nomi di file di prompt Codex legacy consentiti da OpenSpec, li rimuove solo dopo che esistono le skill di sostituzione `.codex/skills/openspec-*`, e preserva tutti gli altri file.

---

## Migrare project.md in config.yaml

Il vecchio `openspec/project.md` era un file markdown libero per il contesto di progetto. Il nuovo `openspec/config.yaml` è strutturato e, cosa fondamentale, **viene iniettato in ogni richiesta di pianificazione** in modo che le tue convenzioni siano sempre presenti quando l'AI lavora.

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
  Stack tecnologico: TypeScript, React, Node.js
  Test: Jest con React Testing Library
  API: RESTful, documentata in docs/api.md
  Manteniamo la compatibilità con le versioni precedenti per tutte le API pubbliche

rules:
  proposal:
    - Includi un piano di rollback per le modifiche rischiose
  specs:
    - Usa il formato Given/When/Then per gli scenari
    - Fai riferimento a pattern esistenti prima di inventarne di nuovi
  design:
    - Includi diagrammi di sequenza per i flussi complessi
```

### Differenze Chiave

| project.md | config.yaml |
|------------|-------------|
| Markdown libero | YAML strutturato |
| Unico blocco di testo | Contesto separato e regole per artefatto |
| Non chiaro quando viene utilizzato | Il contesto appare in TUTTI gli artefatti; le regole appaiono solo negli artefatti corrispondenti |
| Nessuna selezione di schema | Il campo esplicito `schema:` imposta il workflow predefinito |

### Cosa Mantenere, Cosa Eliminare

Durante la migrazione, sii selettivo. Chiediti: "L'AI ha bisogno di questo per *ogni* richiesta di pianificazione?"

**Candidati adatti per `context:`**
- Stack tecnologico (linguaggi, framework, database)
- Pattern architetturali chiave (monorepo, microservizi, ecc.)
- Vincoli non ovvi ("non possiamo usare la libreria X perché...")
- Convenzioni critiche che vengono spesso ignorate

**Sposta invece in `rules:`**
- Formattazione specifica per artefatto ("usa Given/When/Then nelle specifiche")
- Criteri di revisione ("le proposte devono includere piani di rollback")
- Questi appaiono solo per l'artefatto corrispondente, mantenendo più leggere le altre richieste

**Escludi completamente**
- Buone pratiche generali che l'AI già conosce
- Spiegazioni verbose che potrebbero essere riassunte
- Contesto storico che non influisce sul lavoro corrente

### Passaggi Di Migrazione

1. **Crea config.yaml** (se non è già stato creato da init):
   ```yaml
   schema: spec-driven
   ```

2. **Aggiungi il tuo contesto** (sii conciso—va in ogni richiesta):
   ```yaml
   context: |
     Inserisci qui il background del tuo progetto.
     Concentrati su ciò che l'AI ha veramente bisogno di sapere.
   ```

3. **Aggiungi le regole per artefatto** (opzionale):
   ```yaml
   rules:
     proposal:
       - Le tue indicazioni specifiche per le proposte
     specs:
       - Le tue regole per la scrittura di specifiche
   ```

4. **Elimina project.md** una volta che hai spostato tutto il contenuto utile.

**Non pensarci troppo.** Inizia con l'essenziale e itera. Se noti che l'AI sta perdendo qualcosa di importante, aggiungilo. Se il contesto sembra troppo gonfio, riducilo. Questo è un documento vivo.

### Hai Bisogno Di Aiuto? Usa Questo Prompt

Se non sei sicuro di come distillare il tuo project.md, chiedi al tuo assistente AI:

```
Sto migrando dal vecchio project.md di OpenSpec al nuovo formato config.yaml.

Ecco il mio project.md corrente:
[incolla il contenuto del tuo project.md]

Per favore aiutami a creare un config.yaml con:
1. Una sezione `context:` concisa (questa viene iniettata in ogni richiesta di pianificazione, quindi tienila stretta—concentrati sullo stack tecnologico, sui vincoli chiave e sulle convenzioni che vengono spesso ignorate)
2. `rules:` per artefatti specifici se c'è contenuto specifico per artefatto (es. "usa Given/When/Then" appartiene alle regole delle specifiche, non al contesto globale)

Escludi qualsiasi cosa generica che i modelli AI già conoscono. Sii spietato con la brevità.
```

L'AI ti aiuterà a identificare cosa è essenziale e cosa può essere ridotto.

---

## I Nuovi Comandi

La disponibilità dei comandi dipende dal profilo:

**Profilo predefinito (`core`):**

| Comando | Scopo |
|---------|-------|
| `/opsx:propose` | Crea una modifica e genera artefatti di pianificazione in un solo passaggio |
| `/opsx:explore` | Ragiona sulle idee senza struttura |
| `/opsx:apply` | Implementa i task da tasks.md |
| `/opsx:archive` | Finalizza e archivia la modifica |

**Workflow esteso (selezione personalizzata):**

| Comando | Scopo |
|---------|-------|
| `/opsx:new` | Avvia un nuovo scheletro di modifica |
| `/opsx:continue` | Crea il prossimo artefatto (uno alla volta) |
| `/opsx:ff` | Fast-forward—crea tutti gli artefatti di pianificazione in una volta |
| `/opsx:verify` | Valida che l'implementazione corrisponda alle specifiche |
| `/opsx:sync` | Unisci le specifiche delta nelle specifiche principali |
| `/opsx:bulk-archive` | Archivia più modifiche in una sola volta |
| `/opsx:onboard` | Workflow di onboarding guidato end-to-end |

Abilita i comandi estesi con `openspec config profile`, poi esegui `openspec update`.

### Mappatura Dei Comandi Dal Legacy

| Legacy | Equivalente OPSX |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (predefinito) o `/opsx:new` poi `/opsx:ff` (esteso) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Nuove Funzionalità

Queste funzionalità fanno parte del set di comandi del workflow esteso.

**Creazione di artefatti granulare:**
```
/opsx:continue
```
Crea un artefatto alla volta in base alle dipendenze. Usalo quando vuoi rivedere ogni passaggio.

**Modalità esplorativa:**
```
/opsx:explore
```
Ragiona sulle idee con un partner prima di impegnarti in una modifica.

---

## Comprendere La Nuova Architettura

### Da Bloccato Per Fasi A Fluido

Il workflow legacy obbligava a una progressione lineare:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

If you're in implementation and realize the design is wrong?
Too bad. Phase gates don't let you go back easily.
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

### Grafo Di Dipendenze

Gli artefatti formano un grafo diretto. Le dipendenze sono abilitatori, non cancelli:

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

### Skill vs Comandi

Il sistema legacy utilizzava file di comando specifici per strumento:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX utilizza lo standard emergente delle **skill**:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Le skill sono riconosciute da più strumenti di coding AI e forniscono metadati più ricchi.

Codex supporta solo le skill in OPSX. OpenSpec non genera più file di prompt personalizzati per Codex; utilizza invece le directory `.codex/skills/openspec-*` generate.

## Proseguire modifiche esistenti

Le tue modifiche in corso funzionano perfettamente con i comandi OPSX.

**Hai una modifica attiva dal flusso di lavoro legacy?**

```
/opsx:apply add-my-feature
```

OPSX legge gli artefatti esistenti e prosegue da dove ti sei interrotto.

**Vuoi aggiungere altri artefatti a una modifica esistente?**

```
/opsx:continue add-my-feature
```

Mostra cosa è pronto per essere creato in base a ciò che esiste già.

**Devi vedere lo stato?**

```bash
openspec status --change add-my-feature
```

---

## Il nuovo sistema di configurazione

### Struttura di config.yaml

```yaml
# Obbligatorio: Schema predefinito per le nuove modifiche
schema: spec-driven

# Opzionale: Contesto del progetto (massimo 50KB)
# Iniettato in TUTTE le istruzioni degli artefatti
context: |
  Background del tuo progetto, stack tecnologico,
  convenzioni e vincoli.

# Opzionale: Regole per artefatto
# Iniettato solo negli artefatti corrispondenti
rules:
  proposal:
    - Includi piano di rollback
  specs:
    - Usa il formato Given/When/Then
  design:
    - Documenta le strategie di fallback
  tasks:
    - Suddividi in blocchi di massimo 2 ore
```

### Risoluzione dello schema

Per determinare quale schema utilizzare, OPSX controlla in ordine:

1. **Flag CLI**: `--schema <nome>` (priorità più alta)
2. **Metadati della modifica**: `.openspec.yaml` nella directory della modifica
3. **Configurazione del progetto**: `openspec/config.yaml`
4. **Predefinito**: `spec-driven`

### Schemi disponibili

| Schema | Artefatti | Ideale per |
|--------|-----------|------------|
| `spec-driven` | proposal → specs → design → tasks | La maggior parte dei progetti |

Elenca tutti gli schemi disponibili:

```bash
openspec schemas
```

### Schemi personalizzati

Crea il tuo flusso di lavoro personalizzato:

```bash
openspec schema init my-workflow
```

Oppure crea un fork di uno esistente:

```bash
openspec schema fork spec-driven my-workflow
```

Vedi [Personalizzazione](customization.md) per i dettagli.

---

## Risoluzione dei problemi

### "File legacy rilevati in modalità non interattiva"

Stai eseguendo in un ambiente CI o non interattivo. Utilizza:

```bash
openspec init --force
```

### I comandi non appaiono dopo la migrazione

Riavvia il tuo IDE. Le skill vengono rilevate all'avvio.

### "ID artefatto sconosciuto nelle regole"

Verifica che le chiavi `rules:` corrispondano agli ID degli artefatti del tuo schema:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Esegui questo comando per vedere gli ID degli artefatti validi:

```bash
openspec schemas --json
```

### La configurazione non viene applicata

1. Assicurati che il file si trovi in `openspec/config.yaml` (non `.yml`)
2. Verifica la sintassi YAML
3. Le modifiche alla configurazione hanno effetto immediato—non è necessario riavviare

### project.md non migrato

Il sistema conserva intenzionalmente `project.md` perché potrebbe contenere i tuoi contenuti personalizzati. Revisionalo manualmente, sposta le parti utili in `config.yaml`, quindi eliminalo.

### Vuoi vedere cosa verrebbe eliminato?

Esegui init e rifiuta la richiesta di pulizia—vedrai il riepilogo completo del rilevamento senza che vengano apportate modifiche.

---

## Riferimento rapido

### File dopo la migrazione

```
project/
├── openspec/
│   ├── specs/                    # Invariato
│   ├── changes/                  # Invariato
│   │   └── archive/              # Invariato
│   └── config.yaml               # NUOVO: Configurazione del progetto
├── .claude/
│   └── skills/                   # NUOVO: Skill OPSX
│       ├── openspec-propose/     # profilo core predefinito
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # il profilo esteso aggiunge new/continue/ff/ecc.
├── CLAUDE.md                     # Marker OpenSpec rimossi, i tuoi contenuti conservati
└── AGENTS.md                     # Marker OpenSpec rimossi, i tuoi contenuti conservati
```

### Cosa è stato rimosso

- `.claude/commands/openspec/` — sostituito da `.claude/skills/`
- `openspec/AGENTS.md` — obsoleto
- `openspec/project.md` — migra in `config.yaml`, quindi eliminalo
- Blocchi di marker OpenSpec in `CLAUDE.md`, `AGENTS.md`, ecc.

### Cheatsheet dei comandi

```text
/opsx:propose      Avvia velocemente (profilo core predefinito)
/opsx:apply        Implementa le attività
/opsx:archive      Termina e archivia

# Flusso di lavoro esteso (se abilitato):
/opsx:new          Crea la struttura di una modifica
/opsx:continue     Crea il prossimo artefatto
/opsx:ff           Crea gli artefatti di pianificazione
```

---

## Ottenere aiuto

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Documentazione**: [docs/opsx.md](opsx.md) per il riferimento completo a OPSX