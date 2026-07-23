# Comandi

Questa è la guida di riferimento per i comandi slash di OpenSpec. Questi comandi vengono invocati nell'interfaccia chat del tuo assistente di codifica AI (ad es. Claude Code, Cursor, Windsurf).

Per i pattern di flusso di lavoro e per capire quando usare ogni comando, consulta [Workflows](workflows.md). Per i comandi CLI, consulta [CLI](cli.md).

## Riferimento Rapido

### Percorso Rapido Predefinito (profilo `core`)

| Comando | Scopo |
|---------|-------|
| `/opsx:propose` | Crea una modifica e genera gli artefatti di pianificazione in un solo passaggio |
| `/opsx:explore` | Valuta le idee prima di impegnarti in una modifica |
| `/opsx:apply` | Implementa le attività della modifica |
| `/opsx:update` | Modifica gli artefatti di pianificazione di una modifica e mantienili coerenti |
| `/opsx:sync` | Unisci le specifiche delta nelle specifiche principali |
| `/opsx:archive` | Archivia una modifica completata |

### Comandi del Flusso di Lavoro Esteso (selezione personalizzata del flusso di lavoro)

| Comando | Scopo |
|---------|-------|
| `/opsx:new` | Avvia una nuova struttura di modifica |
| `/opsx:continue` | Crea il prossimo artefatto in base alle dipendenze |
| `/opsx:ff` | Fast-forward: crea tutti gli artefatti di pianificazione in una sola volta |
| `/opsx:verify` | Verifica che l'implementazione corrisponda agli artefatti |
| `/opsx:bulk-archive` | Archivia più modifiche in una sola volta |
| `/opsx:onboard` | Tutorial guidato attraverso l'intero flusso di lavoro |

Il profilo globale predefinito è `core`. Per abilitare i comandi del flusso di lavoro esteso, esegui `openspec config profile`, seleziona i flussi di lavoro, quindi esegui `openspec update` nel tuo progetto.

## Riferimento comandi

### `/opsx:propose`

Crea una nuova modifica e genera gli artefatti di pianificazione in un solo passaggio. Questo è il comando di avvio predefinito nel profilo `core`.

**Sintassi:**
```text
/opsx:propose [change-name-or-description]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `change-name-or-description` | No | Nome in kebab-case o descrizione della modifica in linguaggio naturale |

**Cosa fa:**
- Crea `openspec/changes/<change-name>/`
- Genera gli artefatti necessari prima dell'implementazione (per `spec-driven`: proposta, specifiche, progettazione, attività)
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
- Usalo per il percorso end-to-end più veloce
- Se desideri il controllo passo passo degli artefatti, abilita i flussi di lavoro estesi e usa `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **Inizia qui se non sei sicuro.** Explore è un partner di riflessione senza rischi: legge il tuo codebase, confronta le opzioni e trasforma un'idea vaga in un piano concreto prima che esista qualsiasi modifica. È incluso nel profilo predefinito. Per il caso completo e altri esempi, consulta la guida [Esplora prima](explore.md).

Rifletti sulle idee, indaga i problemi e chiarisci i requisiti prima di impegnarti in una modifica.

**Sintassi:**
```
/opsx:explore [topic]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `topic` | No | Cosa vuoi esplorare o investigare |

**Cosa fa:**
- Apre una conversazione esplorativa senza struttura obbligatoria
- Indaga il codebase per rispondere alle domande
- Confronta opzioni e approcci
- Crea diagrammi visuali per chiarire il pensiero
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
- Usalo quando i requisiti non sono chiari o hai bisogno di investigare
- Non vengono creati artefatti durante l'esplorazione
- Ottimo per confrontare più approcci prima di decidere
- Può leggere file e cercare nel codebase

---

### `/opsx:new`

Avvia una nuova struttura di modifica. Crea la cartella della modifica e attende che tu generi gli artefatti con `/opsx:continue` o `/opsx:ff`.

Questo comando fa parte del set di flussi di lavoro estesi (non incluso nel profilo `core` predefinito).

**Sintassi:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `change-name` | No | Nome per la cartella della modifica (richiesto se non fornito) |
| `--schema` | No | Schema del flusso di lavoro da usare (predefinito: dal config o `spec-driven`) |

**Cosa fa:**
- Crea la directory `openspec/changes/<change-name>/`
- Crea il file di metadati `.openspec.yaml` nella cartella della modifica
- Mostra il primo modello di artefatto pronto per la creazione
- Richiede il nome della modifica e lo schema se non forniti

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

Crea il prossimo artefatto nella catena di dipendenze. Crea un artefatto alla volta per un progresso incrementale.

**Sintassi:**
```
/opsx:continue [change-name]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `change-name` | No | Quale modifica continuare (ricavata dal contesto se non fornita) |

**Cosa fa:**
- Interroga il grafico delle dipendenze degli artefatti
- Mostra quali artefatti sono pronti vs bloccati
- Crea il primo artefatto pronto
- Legge i file delle dipendenze per il contesto
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
- Usalo quando vuoi rivedere ogni artefatto prima di procedere
- Ottimo per modifiche complesse dove vuoi avere il controllo
- Più artefatti possono diventare pronti contemporaneamente
- Puoi modificare gli artefatti creati prima di continuare

---

### `/opsx:ff`

Avanza velocemente nella creazione degli artefatti. Crea tutti gli artefatti di pianificazione in una sola volta.

**Sintassi:**
```
/opsx:ff [change-name]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `change-name` | No | Quale modifica avviare velocemente (ricavata dal contesto se non fornita) |

**Cosa fa:**
- Crea tutti gli artefatti in ordine di dipendenza
- Tiene traccia del progresso tramite lista di attività
- Si ferma quando tutti gli artefatti `apply-required` sono completi
- Legge ogni dipendenza prima di creare l'artefatto successivo

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
- Usalo quando hai un quadro chiaro di cosa stai costruendo
- Più veloce di `/opsx:continue` per modifiche semplici
- Puoi comunque modificare gli artefatti successivamente
- Ottimo per funzionalità piccole o medie

---

### `/opsx:apply`

Implementa le attività dalla modifica. Lavora attraverso la lista di attività, scrivendo codice e spuntando le voci.

**Sintassi:**
```
/opsx:apply [change-name]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `change-name` | No | Quale modifica implementare (ricavata dal contesto se non fornita) |

**Cosa fa:**
- Legge `tasks.md` e identifica le attività incomplete
- Lavora attraverso le attività una alla volta
- Scrive codice, crea file, esegue test se necessario
- Segna le attività come complete con le checkbox `[x]`

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
- Può riprendere da dove si era interrotto se interrotto
- Usalo per modifiche parallele specificando il nome della modifica
- Lo stato di completamento è tracciato nelle checkbox di `tasks.md`

---

### `/opsx:update`

Rivedi gli artefatti di pianificazione esistenti di una modifica e mantienili coerenti tra loro. Solo artefatti di pianificazione: non modifica mai il codice.

**Sintassi:**

```text
/opsx:update [change-name]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `change-name` | No | Quale modifica aggiornare (ricavata dal contesto se non fornita) |

**Cosa fa:**

- Legge gli artefatti della modifica tramite `openspec status --change <name> --json`
- Applica la revisione richiesta, o rivede gli artefatti per contraddizioni se non ne hai specificata una
- Riconcilia gli altri artefatti esistenti in qualsiasi direzione (una modifica alla progettazione può ripercuotersi sulla proposta)
- Conferma ogni modifica con te prima di scrivere, un artefatto alla volta
- Termina consigliando il prossimo passo: `/opsx:continue` (artefatti mancanti), `/opsx:apply` (applica un piano rivisto al codice), o `/opsx:archive` (tutto completato)

**Esempio:**

```text
You: /opsx:update add-dark-mode - we're storing the theme in a cookie now, not localStorage

AI:  Reading add-dark-mode artifacts...

     The design references localStorage in two places; tasks 1.3 covers
     localStorage persistence; the proposal doesn't mention storage.

     Proposed revisions:
     1. design.md - swap localStorage decision for cookie storage
     2. tasks.md - reword task 1.3 to cookie persistence

     Apply revision 1? (design.md)
```

**Consigli:**

- Non crea artefatti mancanti: per quello usa `/opsx:continue`
- Se la modifica è già stata implementata, prosegui con `/opsx:apply` in modo che il codice corrisponda al piano rivisto
- Se la tua revisione modifica l'*intento* della modifica, inizia da zero con una nuova modifica (vedi [Quando aggiornare vs iniziare da zero](opsx.md#when-to-update-vs-start-fresh))

---

### `/opsx:verify`

Convalida che l'implementazione corrisponda agli artefatti della modifica. Controlla completezza, correttezza e coerenza.

**Sintassi:**
```
/opsx:verify [change-name]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `change-name` | No | Quale modifica verificare (ricavata dal contesto se non fornita) |

**Cosa fa:**
- Controlla tre dimensioni della qualità dell'implementazione
- Cerca nel codebase le prove dell'implementazione
- Riporta problemi classificati come CRITICO, AVVISO o SUGGERIMENTO
- Non blocca l'archiviazione, ma evidenzia i problemi

**Dimensioni di verifica:**

| Dimensione | Cosa valida |
|-----------|-------------------|
| **Completezza** | Tutte le attività completate, tutti i requisiti implementati, scenari coperti |
| **Correttezza** | L'implementazione corrisponde all'intento delle specifiche, casi limite gestiti |
| **Coerenza** | Decisioni di progettazione riflesse nel codice, modelli coerenti |

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
- Esegui prima di archiviare per cogliere le discrepanze in anticipo
- Gli avvisi non bloccano l'archiviazione ma indicano potenziali problemi
- Ottimo per rivedere il lavoro dell'IA prima di confermare
- Può rivelare scostamenti tra artefatti e implementazione

---

### `/opsx:sync`

**Comando opzionale.** Unisci le specifiche delta di una modifica nelle specifiche principali. L'archiviazione chiederà di sincronizzare se necessario, quindi di solito non devi eseguire questo comando manualmente.

**Sintassi:**
```
/opsx:sync [change-name]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `change-name` | No | Quale modifica sincronizzare (ricavata dal contesto se non fornita) |

**Cosa fa:**
- Legge le specifiche delta dalla cartella della modifica
- Analizza le sezioni AGGIUNTO/MODIFICATO/RIMOSSO/RINOMINATO
- Unisce le modifiche nella directory principale `openspec/specs/`
- Preserva i contenuti esistenti non menzionati nel delta
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

| Scenario | Usa sync? |
|----------|-----------|
| Modifica a lungo termine, vuoi le specifiche nella main prima di archiviare | Sì |
| Modifiche parallele multiple necessitano delle specifiche base aggiornate | Sì |
| Vuoi visualizzare/controllare l'unione separatamente | Sì |
| Modifica veloce, passi direttamente all'archiviazione | No (l'archiviazione lo gestisce) |

**Consigli:**
- La sincronizzazione è intelligente, non un copia-incolla
- Può aggiungere scenari a requisiti esistenti senza duplicare
- La modifica rimane attiva dopo la sincronizzazione (non archiviata)
- La maggior parte degli utenti non dovrà chiamare questo comando direttamente: l'archiviazione lo richiede se necessario

---

### `/opsx:archive`

Archivia una modifica completata. Finalizza la modifica e la sposta nella cartella di archiviazione.

**Sintassi:**
```
/opsx:archive [change-name]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `change-name` | No | Quale modifica archiviare (ricavata dal contesto se non fornita) |

**Cosa fa:**
- Controlla lo stato di completamento degli artefatti
- Controlla il completamento delle attività (avverte se incomplete)
- Offre di sincronizzare le specifiche delta se non già sincronizzate
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
- L'archiviazione non blocca per attività incomplete, ma avverte
- Le specifiche delta possono essere sincronizzate durante l'archiviazione o prima
- Le modifiche archiviate sono preservate per la cronologia
- Usa `/opsx:verify` prima per cogliere i problemi

---

### `/opsx:bulk-archive`

Archivia più modifiche completate contemporaneamente. Gestisce i conflitti tra le specifiche delle modifiche.

**Sintassi:**
```
/opsx:bulk-archive [change-names...]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `change-names` | No | Modifiche specifiche da archiviare (chiede di selezionare se non fornite) |

**Cosa fa:**
- Elenca tutte le modifiche completate
- Convalida ogni modifica prima di archiviare
- Rileva conflitti tra le specifiche tra modifiche
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
- La risoluzione dei conflitti è agentica (controlla il codebase)
- Le modifiche sono archiviate in ordine di creazione
- Chiede conferma prima di sovrascrivere i contenuti delle specifiche

---

### `/opsx:onboard`

Onboarding guidato attraverso il completo flusso di lavoro OpenSpec. Un tutorial interattivo che usa il tuo codebase reale.

**Sintassi:**
```
/opsx:onboard
```

**Cosa fa:**
- Percorre un completo ciclo di lavoro con narrazione
- Analizza il tuo codebase per trovare reali opportunità di miglioramento
- Crea una modifica effettiva con artefatti reali
- Implementa lavoro effettivo (modifiche piccole e sicure)
- Archivia la modifica completata
- Spiega ogni passaggio mentre avviene

**Fasi:**
1. Benvenuto e analisi del codebase
2. Trovare un'opportunità di miglioramento
3. Creare una modifica (`/opsx:new`)
4. Scrivere la proposta
5. Creare le specifiche
6. Scrivere la progettazione
7. Creare le attività
8. Implementare le attività (`/opsx:apply`)
9. Verificare l'implementazione
10. Archiviare la modifica
11. Riepilogo e passaggi successivi

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
- Ottimo per i nuovi utenti che imparano il flusso di lavoro
- Usa codice reale, non esempi giocattolo
- Crea una modifica reale che puoi mantenere o scartare
- Richiede 15-30 minuti per essere completato

## Sintassi dei comandi per strumento AI

Diversi strumenti AI utilizzano una sintassi dei comandi leggermente diversa. Usa il formato corrispondente al tuo strumento:

| Strumento | Esempio di sintassi |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | Invocazioni basate su skill come `/openspec-propose`, `/openspec-apply-change` (nessun file di comando `opsx-*` generato) |
| Codex | Invocazioni basate su skill da `.codex/skills/openspec-*` (nessun file di prompt `opsx-*` generato) |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi Code | Invocazioni basate su skill come `/skill:openspec-propose`, `/skill:openspec-apply-change` (nessun file di comando `opsx-*` generato) |
| Trae | `/opsx-propose`, `/opsx-apply` |

L'intento è lo stesso per tutti gli strumenti, ma il modo in cui i comandi vengono resi disponibili può variare in base all'integrazione.

> **Nota:** I comandi di GitHub Copilot (`.github/prompts/*.prompt.md`) sono disponibili solo nelle estensioni IDE (VS Code, JetBrains, Visual Studio). La CLI di GitHub Copilot attualmente non supporta i file di prompt personalizzati — consulta [Strumenti supportati](supported-tools.md) per dettagli e soluzioni alternative.

---

## Comandi legacy

Questi comandi utilizzano il flusso di lavoro più vecchio "tutto in una volta". Funzionano ancora, ma si consigliano i comandi OPSX.

| Comando | Cosa fa |
|---------|--------------|
| `/openspec:proposal` | Crea tutti gli artefatti in una sola volta (proposta, specifiche, progettazione, task) |
| `/openspec:apply` | Implementa la modifica |
| `/openspec:archive` | Archivia la modifica |

**Quando utilizzare i comandi legacy:**
- Progetti esistenti che utilizzano il vecchio flusso di lavoro
- Modifiche semplici per cui non è necessaria la creazione incrementale di artefatti
- Preferenza per l'approccio tutto o niente

**Migrazione a OPSX:**
Le modifiche legacy possono essere proseguite con i comandi OPSX. La struttura degli artefatti è compatibile.

---

## Risoluzione dei problemi

### "Modifica non trovata"

Il comando non è riuscito a identificare quale modifica su cui lavorare.

**Soluzioni:**
- Specifica esplicitamente il nome della modifica: `/opsx:apply add-dark-mode`
- Verifica che la cartella della modifica esista: `openspec list`
- Verifica di essere nella cartella di progetto corretta

### "Nessun artefatto pronto"

Tutti gli artefatti sono o completi o bloccati da dipendenze mancanti.

**Soluzioni:**
- Esegui `openspec status --change <name>` per vedere cosa sta bloccando
- Verifica se esistono gli artefatti richiesti
- Crea prima gli artefatti delle dipendenze mancanti

### "Schema non trovato"

Lo schema specificato non esiste.

**Soluzioni:**
- Elenca gli schemi disponibili: `openspec schemas`
- Verifica l'ortografia del nome dello schema
- Crea lo schema se è personalizzato: `openspec schema init <name>`

### Comandi non riconosciuti

Lo strumento AI non riconosce i comandi OpenSpec.

**Soluzioni:**
- Assicurati che OpenSpec sia inizializzato: `openspec init`
- Rigenera le skill: `openspec update`
- Verifica che la directory `.claude/skills/` esista (per Claude Code)
- Riavvia il tuo strumento AI per caricare le nuove skill

### Gli artefatti non vengono generati correttamente

L'IA crea artefatti incompleti o non corretti.

**Soluzioni:**
- Aggiungi il contesto del progetto in `openspec/config.yaml`
- Aggiungi regole per artefatto per indicazioni specifiche
- Fornisci più dettagli nella descrizione della modifica
- Utilizza `/opsx:continue` invece di `/opsx:ff` per avere più controllo

---

## Passaggi successivi

- [Flussi di lavoro](workflows.md) - Modelli comuni e quando utilizzare ogni comando
- [CLI](cli.md) - Comandi terminale per la gestione e la validazione
- [Personalizzazione](customization.md) - Crea schemi e flussi di lavoro personalizzati