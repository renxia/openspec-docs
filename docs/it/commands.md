# Comandi

Questa è la guida per i comandi slash di OpenSpec. Questi comandi vengono invocati nell'interfaccia chat del tuo assistente di codifica IA (ad esempio, Claude Code, Cursor, Windsurf).

Per i modelli di flusso di lavoro e quando usare ciascun comando, vedi [Workflows](workflows.md). Per i comandi CLI, vedi [CLI](cli.md).

## Riferimento Rapido

### Percorso Rapido Predefinito (`core` profile)

| Command | Purpose |
|---------|---------|
| `/opsx:propose` | Crea una modifica e genera gli artefatti di pianificazione in un unico passaggio |
| `/opsx:explore` | Valuta le idee prima di impegnarti in una modifica |
| `/opsx:apply` | Implementa i compiti della modifica |
| `/opsx:sync` | Unisci le specifiche delta con le specifiche principali |
| `/opsx:archive` | Archivia una modifica completata |

### Comandi di Flusso di Lavoro Avanzati (selezione personalizzata del flusso di lavoro)

| Command | Purpose |
|---------|---------|
| `/opsx:new` | Avvia uno scaffold di modifica nuovo |
| `/opsx:continue` | Crea l'artefatto successivo in base alle dipendenze |
| `/opsx:ff` | Avanzamento rapido (Fast-forward): crea tutti gli artefatti di pianificazione contemporaneamente |
| `/opsx:verify` | Verifica che l'implementazione corrisponda agli artefatti |
| `/opsx:bulk-archive` | Archivia più modifiche contemporaneamente |
| `/opsx:onboard` | Tutorial guidato attraverso l'intero flusso di lavoro |

Il profilo globale predefinito è `core`. Per abilitare i comandi di flusso di lavoro avanzati, esegui `openspec config profile`, seleziona i flussi di lavoro e poi esegui `openspec update` nel tuo progetto.

## Riferimento dei Comandi

### `/opsx:propose`

Crea una nuova modifica e genera gli artefatti di pianificazione in un unico passaggio. Questo è il comando di avvio predefinito nel profilo `core`.

**Sintassi:**
```text
/opsx:propose [change-name-or-description]
```

**Argomenti:**
| Argomento | Richiesto | Descrizione |
|----------|----------|-------------|
| `change-name-or-description` | No | Nome in kebab-case o descrizione della modifica in linguaggio comune |

**Cosa fa:**
- Crea `openspec/changes/<change-name>/`
- Genera gli artefatti necessari prima dell'implementazione (per `spec-driven`: proposta, specifiche, design, compiti)
- Si ferma quando la modifica è pronta per `/opsx:apply`

**Esempio:**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**Consigli:**
- Utilizza questo per il percorso end-to-end più veloce
- Se desideri un controllo degli artefatti passo dopo passo, abilita i flussi di lavoro estesi e usa `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **Inizia qui quando non sei sicuro.** Explore è un partner di pensiero senza rischi: legge la tua codebase, confronta le opzioni e trasforma un'idea vaga in un piano concreto prima che esista qualsiasi modifica. È incluso nel profilo predefinito. Per il caso completo e altri esempi, vedi la guida [Explore First](explore.md).

Pensa alle idee, indaga i problemi e chiarisci i requisiti prima di impegnarti in una modifica.

**Sintassi:**
```
/opsx:explore [topic]
```

**Argomenti:**
| Argomento | Richiesto | Descrizione |
|----------|----------|-------------|
| `topic` | No | Cosa vuoi esplorare o investigare |

**Cosa fa:**
- Apre una conversazione esplorativa senza richiedere una struttura
- Indaga la codebase per rispondere alle domande
- Confronta opzioni e approcci
- Crea diagrammi visivi per chiarire il pensiero
- Può passare a `/opsx:propose` (predefinito) o `/opsx:new` (flusso di lavoro esteso) quando le intuizioni si cristallizzano

**Esempio:**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT. Can we start a change for that?

AI:  Ready when you are. Run /opsx:propose add-jwt-auth to begin.
```

**Consigli:**
- Usa quando i requisiti non sono chiari o hai bisogno di investigare
- Nessun artefatto viene creato durante l'esplorazione
- Ottimo per confrontare più approcci prima di decidere
- Può leggere file e cercare nella codebase

---

### `/opsx:new`

Avvia uno scaffold (impalcatura) di modifica. Crea la cartella della modifica e attende che tu generi gli artefatti con `/opsx:continue` o `/opsx:ff`.

Questo comando fa parte del set di flussi di lavoro estesi (non incluso nel profilo `core` predefinito).

**Sintassi:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argomenti:**
| Argomento | Richiesto | Descrizione |
|----------|----------|-------------|
| `change-name` | No | Nome per la cartella della modifica (richiesto se non fornito) |
| `--schema` | No | Schema di flusso di lavoro da utilizzare (predefinito: da config o `spec-driven`) |

**Cosa fa:**
- Crea la directory `openspec/changes/<change-name>/`
- Crea il file metadati `.openspec.yaml` nella cartella della modifica
- Mostra il primo template di artefatto pronto per la creazione
- Richiede nome e schema della modifica se non forniti

**Cosa crea:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Metadati della modifica (schema, data di creazione)
```

**Esempio:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**Consigli:**
- Usa nomi descrittivi: `add-feature`, `fix-bug`, `refactor-module`
- Evita nomi generici come `update`, `changes`, `wip`
- Lo schema può essere impostato anche nella configurazione del progetto (`openspec/config.yaml`)

---

### `/opsx:continue`

Crea il prossimo artefatto nella catena di dipendenza. Ne crea uno alla volta per un progresso incrementale.

**Sintassi:**
```
/opsx:continue [change-name]
```

**Argomenti:**
| Argomento | Richiesto | Descrizione |
|----------|----------|-------------|
| `change-name` | No | Quale modifica continuare (inferito dal contesto se non fornito) |

**Cosa fa:**
- Interroga il grafo di dipendenza degli artefatti
- Mostra quali artefatti sono pronti contro bloccati
- Crea il primo artefatto pronto
- Legge i file di dipendenza per il contesto
- Mostra cosa diventa disponibile dopo la creazione

**Esempio:**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: tasks
     Run /opsx:continue to create the next artifact.
```

**Consigli:**
- Usa quando vuoi rivedere ogni artefatto prima di procedere
- Ottimo per modifiche complesse in cui desideri avere il controllo
- Più artefatti possono diventare pronti contemporaneamente
- Puoi modificare gli artefatti creati prima di continuare

---

### `/opsx:ff`

Avanza rapidamente la creazione degli artefatti. Crea tutti gli artefatti di pianificazione in una volta sola.

**Sintassi:**
```
/opsx:ff [change-name]
```

**Argomenti:**
| Argomento | Richiesto | Descrizione |
|----------|----------|-------------|
| `change-name` | No | Quale modifica avanzare rapidamente (inferito dal contesto se non fornito) |

**Cosa fa:**
- Crea tutti gli artefatti in ordine di dipendenza
- Traccia il progresso tramite una lista di cose da fare (todo list)
- Si ferma quando tutti gli artefatti `apply-required` sono completati
- Legge ogni dipendenza prima di creare il prossimo artefatto

**Esempio:**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**Consigli:**
- Usa quando hai un quadro chiaro di ciò che stai costruendo
- Più veloce di `/opsx:continue` per modifiche semplici
- Puoi comunque modificare gli artefatti in seguito
- Ottimo per funzionalità piccole o medie

---

### `/opsx:apply`

Implementa i compiti della modifica. Lavora attraverso la lista dei compiti, scrivendo codice e spuntando gli elementi.

**Sintassi:**
```
/opsx:apply [change-name]
```

**Argomenti:**
| Argomento | Richiesto | Descrizione |
|----------|----------|-------------|
| `change-name` | No | Quale modifica implementare (inferito dal contesto se non fornito) |

**Cosa fa:**
- Legge `tasks.md` e identifica i compiti incompletati
- Lavora sui compiti uno per uno
- Scrive codice, crea file, esegue test se necessario
- Segna i compiti come completati con le caselle di controllo `[x]`

**Esempio:**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**Consigli:**
- Può riprendere da dove si è interrotto se l'operazione viene interrotta
- Usalo per modifiche parallele specificando il nome della modifica
- Lo stato di completamento è tracciato nelle caselle di controllo di `tasks.md`

---

### `/opsx:verify`

Valida che l'implementazione corrisponda ai tuoi artefatti di modifica. Controlla completezza, correttezza e coerenza.

**Sintassi:**
```
/opsx:verify [change-name]
```

**Argomenti:**
| Argomento | Richiesto | Descrizione |
|----------|----------|-------------|
| `change-name` | No | Quale modifica verificare (inferito dal contesto se non fornito) |

**Cosa fa:**
- Controlla tre dimensioni della qualità dell'implementazione
- Cerca prove di implementazione nella codebase
- Riporta problemi categorizzati come CRITICAL, WARNING o SUGGESTION
- Non blocca l'archiviazione, ma evidenzia i problemi

**Dimensioni di verifica:**

| Dimensione | Cosa viene verificato |
|-----------|-------------------|
| **Completeness** | Tutti i compiti sono stati eseguiti, tutti i requisiti implementati, gli scenari coperti |
| **Correctness** | L'implementazione corrisponde all'intento della specifica, i casi limite sono gestiti |
| **Coherence** | Le decisioni di design sono riflesse nel codice, i pattern sono coerenti |

**Esempio:**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**Consigli:**
- Esegui prima dell'archiviazione per rilevare precocemente le discrepanze
- I Warning non bloccano l'archivio ma indicano potenziali problemi
- Ottimo per rivedere il lavoro dell'AI prima di impegnarsi
- Può rivelare deviazioni tra gli artefatti e l'implementazione

---

### `/opsx:sync`

**Comando opzionale.** Unisce le specifiche Delta da una modifica alle specifiche principali. L'archiviazione chiederà di sincronizzare se necessario, quindi di solito non devi eseguirlo manualmente.

**Sintassi:**
```
/opsx:sync [change-name]
```

**Argomenti:**
| Argomento | Richiesto | Descrizione |
|----------|----------|-------------|
| `change-name` | No | Quale modifica sincronizzare (inferito dal contesto se non fornito) |

**Cosa fa:**
- Legge le specifiche delta dalla cartella della modifica
- Analizza le sezioni ADDED/MODIFIED/REMOVED/RENAMED
- Unisce le modifiche nella directory principale `openspec/specs/`
- Preserva il contenuto esistente non menzionato nel delta
- Non archivia la modifica (rimane attiva)

**Esempio:**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**Quando usarlo manualmente:**

| Scenario | Usare sync? |
|----------|-----------|
| Modifica a lungo termine, vuoi le specifiche nel principale prima dell'archiviazione | Sì |
| Più modifiche parallele necessitano delle specifiche base aggiornate | Sì |
| Vuoi visualizzare/rivedere la fusione separatamente | Sì |
| Modifica veloce, andando direttamente all'archivio | No (l'archivio lo gestisce) |

**Consigli:**
- Sync è intelligente, non un copia-incolla
- Può aggiungere scenari ai requisiti esistenti senza duplicare
- La modifica rimane attiva dopo la sincronizzazione (non archiviata)
- La maggior parte degli utenti non avrà mai bisogno di chiamarlo direttamente — l'archivio lo richiede se necessario

---

### `/opsx:archive`

Archivia una modifica completata. Finalizza la modifica e la sposta nella cartella dell'archivio.

**Sintassi:**
```
/opsx:archive [change-name]
```

**Argomenti:**
| Argomento | Richiesto | Descrizione |
|----------|----------|-------------|
| `change-name` | No | Quale modifica archiviare (inferito dal contesto se non fornito) |

**Cosa fa:**
- Controlla lo stato di completamento degli artefatti
- Controlla il completamento dei compiti (avvisa se incompleti)
- Offre di sincronizzare le specifiche Delta se non già sincronizzate
- Sposta la cartella della modifica in `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Preserva tutti gli artefatti per la traccia di audit

**Esempio:**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**Consigli:**
- L'archivio non bloccherà per i compiti incompleti, ma avviserà
- Le specifiche Delta possono essere sincronizzate durante l'archiviazione o prima
- Le modifiche archiviate sono preservate per la cronologia
- Usa `/opsx:verify` prima per rilevare problemi

---

### `/opsx:bulk-archive`

Archivia più modifiche completate contemporaneamente. Gestisce i conflitti di specifiche tra le modifiche.

**Sintassi:**
```
/opsx:bulk-archive [change-names...]
```

**Argomenti:**
| Argomento | Richiesto | Descrizione |
|----------|----------|-------------|
| `change-names` | No | Modifiche specifiche da archiviare (richiesta la selezione se non fornite) |

**Cosa fa:**
- Elenca tutte le modifiche completate
- Valida ogni modifica prima dell'archiviazione
- Rileva i conflitti di specifiche tra le modifiche
- Risolve i conflitti controllando cosa è effettivamente implementato
- Archivia in ordine cronologico

**Esempio:**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**Consigli:**
- Ottimo per flussi di lavoro paralleli
- La risoluzione dei conflitti è agentica (controlla la codebase)
- Le modifiche vengono archiviate in ordine di creazione
- Richiede conferma prima di sovrascrivere il contenuto delle specifiche

---

### `/opsx:onboard`

Onboarding guidato attraverso l'intero flusso di lavoro OpenSpec. Un tutorial interattivo che utilizza la tua codebase reale.

**Sintassi:**
```
/opsx:onboard
```

**Cosa fa:**
- Attraversa un ciclo di lavoro completo con narrazione
- Scansiona la tua codebase per reali opportunità di miglioramento
- Crea una modifica reale con artefatti reali
- Implementa un lavoro reale (modifiche piccole e sicure)
- Archivia la modifica completata
- Spiega ogni passaggio mentre avviene

**Fasi:**
1. Benvenuto e analisi della codebase
2. Trovare un'opportunità di miglioramento
3. Creare una modifica (`/opsx:new`)
4. Scrivere la proposta
5. Creare le specifiche
6. Scrivere il design
7. Creare i compiti
8. Implementare i compiti (`/opsx:apply`)
9. Verificare l'implementazione
10. Archiviare la modifica
11. Riepilogo e prossimi passi

**Esempio:**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**Consigli:**
- Migliore per i nuovi utenti che imparano il flusso di lavoro
- Utilizza codice reale, non esempi giocattolo
- Crea una modifica reale che puoi conservare o scartare
- Richiede 15-30 minuti per essere completato

## Sintassi dei Comandi per Strumento AI

I diversi strumenti AI utilizzano sintassi di comando leggermente diverse. Utilizza il formato che corrisponde al tuo strumento:

| Strumento | Esempio di Sintassi |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Skill-based invocations such as `/skill:openspec-propose`, `/skill:openspec-apply-change` (no generated `opsx-*` command files) |
| Trae | Skill-based invocations such as `/openspec-propose`, `/openspec-apply-change` (no generated `opsx-*` command files) |

L'intento è lo stesso in tutti gli strumenti, ma il modo in cui i comandi vengono esposti può variare a seconda dell'integrazione.

> **Nota:** I comandi di GitHub Copilot (`.github/prompts/*.prompt.md`) sono disponibili solo nelle estensioni IDE (VS Code, JetBrains, Visual Studio). Il CLI di GitHub Copilot non supporta attualmente file di prompt personalizzati — vedi [Supported Tools](supported-tools.md) per i dettagli e le soluzioni alternative.

---

## Comandi Legacy

Questi comandi utilizzano il workflow più vecchio "tutto in una volta". Funzionano ancora, ma vengono raccomandati i comandi OPSX.

| Comando | Cosa fa |
|---------|--------------|
| `/openspec:proposal` | Crea tutti gli artefatti contemporaneamente (proposta, specifiche, design, compiti) |
| `/openspec:apply` | Implementa la modifica |
| `/openspec:archive` | Archivia la modifica |

**Quando usare i comandi legacy:**
- Progetti esistenti che utilizzano il vecchio workflow
- Modifiche semplici in cui non è necessaria la creazione incrementale di artefatti
- Preferenza per l'approccio tutto o niente

**Migrazione a OPSX:**
Le modifiche legacy possono essere continuate con i comandi OPSX. La struttura degli artefatti è compatibile.

---

## Risoluzione dei Problemi

### "Change not found"

Il comando non è riuscito a identificare su quale modifica lavorare.

**Soluzioni:**
- Specifica esplicitamente il nome della modifica: `/opsx:apply add-dark-mode`
- Controlla che la cartella della modifica esista: `openspec list`
- Verifica di essere nella directory del progetto corretta

### "No artifacts ready"

Tutti gli artefatti sono completi o bloccati da dipendenze mancanti.

**Soluzioni:**
- Esegui `openspec status --change <name>` per vedere cosa sta bloccando
- Controlla se esistono i requisiti di artefatti
- Crea prima gli artefatti delle dipendenze mancanti

### "Schema not found"

Lo schema specificato non esiste.

**Soluzioni:**
- Elenca gli schemi disponibili: `openspec schemas`
- Controlla l'ortografia del nome dello schema
- Crea lo schema se è personalizzato: `openspec schema init <name>`

### "Commands not recognized"

Il strumento AI non riconosce i comandi di OpenSpec.

**Soluzioni:**
- Assicurati che OpenSpec sia inizializzato: `openspec init`
- Rigenera le skill: `openspec update`
- Controlla che la directory `.claude/skills/` esista (per Claude Code)
- Riavvia il tuo strumento AI per caricare le nuove skill

### "Artifacts not generating properly"

L'AI crea artefatti incompleti o errati.

**Soluzioni:**
- Aggiungi contesto del progetto in `openspec/config.yaml`
- Aggiungi regole per gli artefatti specifici per una guida più precisa
- Fornisci maggiori dettagli nella descrizione della modifica
- Usa `/opsx:continue` invece di `/opsx:ff` per maggiore controllo

---

## Prossimi Passi

- [Workflows](workflows.md) - Schemi comuni e quando usare ciascun comando
- [CLI](cli.md) - Comandi da terminale per la gestione e la validazione
- [Customization](customization.md) - Creare schemi e workflow personalizzati