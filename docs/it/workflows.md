# Workflow

Questa guida descrive i comuni pattern di workflow per OpenSpec e quando utilizzarne ciascuno. Per la configurazione di base, consulta [Introduzione](getting-started.md). Per il riferimento ai comandi, consulta [Comandi](commands.md).

## Filosofia: Azioni, Non Fasi

I workflow tradizionali ti costringono a seguire delle fasi: pianificazione, poi implementazione, poi completamento. Ma il lavoro reale non si adatta perfettamente a queste caselle.

OPSX adotta un approccio diverso:

```text
Tradizionale (fasi bloccate):

  PIANIFICAZIONE ────────► IMPLEMENTAZIONE ────────► COMPLETAMENTO
      │                         │
      │   "Non si può tornare"  │
      └─────────────────────────┘

OPSX (azioni fluide):

  proposta ──► specifiche ──► progetto ──► attività ──► implementazione
```

**Principi fondamentali:**

- **Azioni, non fasi** - I comandi sono cose che puoi fare, non stadi in cui resti bloccato
- **Le dipendenze sono abilitanti** - Mostrano cosa è possibile, non cosa è richiesto dopo

> **Personalizzazione:** I workflow di OPSX sono guidati da schemi che definiscono la sequenza degli artefatti. Consulta [Personalizzazione](customization.md) per i dettagli sulla creazione di schemi personalizzati.

## Due Modalità

### Percorso Rapido Predefinito (profilo `core`)

Le installazioni nuove utilizzano per impostazione predefinita `core`, che fornisce:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:archive`

Flusso tipico:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:archive
```

### Flusso di Lavoro Espanso/Completo (selezione personalizzata)

Se desideri comandi espliciti di scaffolding e build (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), abilitali con:

```bash
openspec config profile
openspec update
```

## Modelli di Flusso di Lavoro (Modalità Espansa)

### Funzionalità Rapida

Quando sai cosa vuoi costruire e devi solo eseguire:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Esempio di conversazione:**

```text
You: /opsx:new add-logout-button

AI:  Created openspec/changes/add-logout-button/
     Ready to create: proposal

You: /opsx:ff

AI:  Creating all planning artifacts...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Ready for implementation!

You: /opsx:apply

AI:  Working through tasks...
     ✓ Added logout button to header
     ✓ Implemented session clearing
     ✓ Added confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  ✓ Merged specs
     ✓ Archived change
```

**Ideale per:** Funzionalità da piccole a medie, correzione di bug, modifiche semplici e dirette.

### Esplorativa

Quando i requisiti non sono chiari o devi prima indagare:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Esempio di conversazione:**

```text
You: /opsx:explore

AI:  What would you like to explore?

You: I want to improve page load performance but I'm not sure
     where the bottlenecks are.

AI:  Let me help investigate...
     [Analyzes bundle sizes, identifies slow queries, reviews
     component render patterns]

     I found three main bottlenecks:
     1. Large unoptimized images
     2. Synchronous data fetching in ProductList
     3. Re-renders from context changes

     Which would you like to address first?

You: Let's tackle the data fetching issue.

You: /opsx:new optimize-product-list-fetching

AI:  Created change. Ready to create: proposal

You: /opsx:continue

AI:  Creating proposal based on our exploration...
     [Writes proposal incorporating investigation insights]

     Ready to create: specs, design
     Which would you like next?

You: /opsx:continue

AI:  Creating specs...
```

**Ideale per:** Ottimizzazione delle prestazioni, debugging, decisioni architetturali, requisiti non chiari.

### Modifiche Parallele

Lavora su più modifiche contemporaneamente:

```text
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in progress)
                                         │
                                    context switch
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Esempio di conversazione:**

```text
You: I'm working on add-dark-mode but got pulled into a bug fix

You: /opsx:new fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/

You: /opsx:ff

AI:  ✓ Created planning artifacts

You: /opsx:apply

AI:  Working on fix-login-redirect...
     [Implements the fix]
     All tasks complete!

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect

You: Let's get back to dark mode

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode...
     Picking up at task 2.3: Update Header...
```

**Ideale per:** Flussi di lavoro paralleli, interruzioni urgenti, collaborazione di team.

Quando hai più modifiche completate, usa `/opsx:bulk-archive`:

```text
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (all tasks done)
     - fix-login-redirect (all tasks done)
     - update-footer (all tasks done)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will apply in chronological order.

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-redirect
     ✓ Archived update-footer
     Specs merged in order: add-dark-mode → update-footer
```

L'archiviazione in blocco rileva quando più modifiche toccano le stesse specifiche e risolve i conflitti controllando cosa è effettivamente implementato.

### Completamento di una Modifica

Il flusso di completamento consigliato:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              validates          prompts to sync
              implementation     if needed
```

#### Verify: Controlla il Tuo Lavoro

`/opsx:verify` valida l'implementazione rispetto ai tuoi artefatti su tre dimensioni:

```text
You: /opsx:verify

AI:  Verifying add-auth...

     COMPLETENESS
     ✓ All 12 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Session timeout after inactivity" not tested

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "event-driven" but implementation uses polling

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for session timeout scenario
     2. Consider refactoring to event-driven as designed, or update design.md
```

**Cosa controlla verify:**

| Dimensione | Cosa valida |
|-----------|------------------|
| Completezza | Tutte le attività completate, tutti i requisiti implementati, scenari coperti |
| Correttezza | L'implementazione corrisponde all'intento delle specifiche, casi limite gestiti |
| Coerenza | Le decisioni di design riflette nella struttura del codice, pattern coerenti |

Verify non bloccherà l'archiviazione, ma evidenzia problemi che potresti voler affrontare prima.

#### Archive: Finalizza la Modifica

`/opsx:archive` completa la modifica e la sposta nell'archivio:

```text
You: /opsx:archive

AI:  Archiving add-auth...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (12/12 tasks complete)

     Delta specs: Not yet synced to main
     → Would you like to sync now?

You: Yes

AI:  ✓ Synced specs to openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-auth/

     Change archived successfully.
```

Archive chiederà conferma se le specifiche non sono sincronizzate. Non bloccherà per attività incomplete, ma ti avviserà.

## Quando Usare Cosa

### `/opsx:ff` vs `/opsx:continue`

| Situazione | Usa |
|-----------|-----|
| Requisiti chiari, pronti per costruire | `/opsx:ff` |
| Esplorazione, vuoi rivedere ogni passaggio | `/opsx:continue` |
| Vuoi iterare sulla proposta prima delle specifiche | `/opsx:continue` |
| Pressione temporale, bisogno di muoversi velocemente | `/opsx:ff` |
| Modifica complessa, vuoi controllo | `/opsx:continue` |

**Regola pratica:** Se puoi descrivere l'intero ambito in anticipo, usa `/opsx:ff`. Se lo stai definendo man mano che vai, usa `/opsx:continue`.

### Quando Aggiornare vs Ricominciare da Zero

Una domanda comune: quando è accettabile aggiornare una modifica esistente e quando dovresti crearne una nuova?

**Aggiorna la modifica esistente quando:**

- Stessa intenzione, esecuzione raffinata
- L'ambito si riduce (MVP prima, il resto dopo)
- Correzioni guidate dall'apprendimento (il codebase non è come previsto)
- Agustamenti al design basati su scoperte implementative

**Crea una nuova modifica quando:**

- L'intenzione è cambiata fondamentalmente
- L'ambito è esploso verso un lavoro completamente diverso
- La modifica originale può essere contrassegnata come "completata" autonomamente
- Le patch confonderebbero più che chiarire

```text
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

**Esempio: "Aggiungi la modalità scura"**

- "Devo supportare anche temi personalizzati" → Nuova modifica (ambito esploso)
- "Il rilevamento delle preferenze di sistema è più difficile del previsto" → Aggiorna (stessa intenzione)
- "Prima implementiamo il toggle, le preferenze dopo" → Aggiorna e archivia, poi nuova modifica

## Migliori Pratiche

### Mantieni le Modifiche Focalizzate

Un'unità logica di lavoro per modifica. Se stai facendo "aggiungi funzionalità X e anche refactor di Y", considera due modifiche separate.

**Perché è importante:**
- Più facile da revisionare e capire
- Cronologia di archivio più pulita
- Possibilità di rilascio indipendente
- Rollback più semplice se necessario

### Usa `/opsx:explore` per Requisiti Non Chiari

Prima di impegnarti in una modifica, esplora lo spazio del problema:

```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle rate limiting for our API?

AI:  Let me investigate your current setup and options...
     [Researches codebase, considers patterns]

     I see three approaches we could take:
     1. Middleware-based (simple, per-endpoint)
     2. Redis-backed (scalable, shared state)
     3. Token bucket per user (fair, complex)

     Your current stack suggests #1 or #2. What's your scale?
```

L'esplorazione chiarisce il pensiero prima di creare gli artefatti.

### Verifica Prima dell'Archiviazione

Usa `/opsx:verify` per controllare che l'implementazione corrisponda agli artefatti:

```text
You: /opsx:verify

AI:  Verifying add-dark-mode...

     ✓ All tasks in tasks.md are checked
     ✓ Requirements in specs have corresponding code
     ✓ Design decisions are reflected in implementation

     Ready to archive!
```

Cattura le discrepanze prima di chiudere la modifica.

### Dai Nomi Chiari alle Modifiche

Buoni nomi rendono `openspec list` utile:

```text
Good:                          Avoid:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Riferimento Rapido ai Comandi

Per i dettagli completi dei comandi e le opzioni, consulta [Comandi](commands.md).

| Comando | Scopo | Quando Utilizzarlo |
|---------|-------|-------------------|
| `/opsx:propose` | Crea cambiamento + artefatti di pianificazione | Percorso predefinito veloce (profilo `core`) |
| `/opsx:explore` | Elaborare idee | Requisiti non chiari, indagine |
| `/opsx:new` | Avvia uno scaffold del cambiamento | Modalità esplicita, controllo esplicito degli artefatti |
| `/opsx:continue` | Crea il prossimo artefatto | Modalità esplicita, creazione degli artefatti passo-passo |
| `/opsx:ff` | Crea tutti gli artefatti di pianificazione | Modalità esplicita, ambito chiaro |
| `/opsx:apply` | Implementa i task | Pronto per scrivere codice |
| `/opsx:verify` | Valida l'implementazione | Modalità esplicita, prima dell'archiviazione |
| `/opsx:sync` | Unisce le specifiche delta | Modalità esplicita, opzionale |
| `/opsx:archive` | Completa il cambiamento | Tutti i lavori terminati |
| `/opsx:bulk-archive` | Archivia più cambiamenti | Modalità esplicita, lavoro parallelo |

## Prossimi Passi

- [Comandi](commands.md) - Riferimento completo dei comandi con opzioni
- [Concetti](concepts.md) - Approfondimento su specifiche, artefatti e schemi
- [Personalizzazione](customization.md) - Crea flussi di lavoro personalizzati