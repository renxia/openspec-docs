# Comandi

Questo è il riferimento per i comandi slash di OpenSpec. Questi comandi vengono invocati nell'interfaccia chat del tuo assistente AI per la programmazione (ad esempio, Claude Code, Cursor, Windsurf).

Per i pattern di flusso di lavoro e quando usare ogni comando, consulta [Flussi di lavoro](workflows.md). Per i comandi della CLI, consulta [CLI](cli.md).

## Riferimento Rapido

### Percorso Rapido Predefinito (profilo `core`)

| Comando | Scopo |
|---------|-------|
| `/opsx:propose` | Crea una modifica e genera gli artefatti di pianificazione in un unico passaggio |
| `/opsx:explore` | Esplora le idee prima di impegnarsi in una modifica |
| `/opsx:apply` | Implementa le attività dalla modifica |
| `/opsx:archive` | Archivia una modifica completata |

### Comandi del Flusso di Lavoro Esteso (selezione personalizzata del flusso di lavoro)

| Comando | Scopo |
|---------|-------|
| `/opsx:new` | Avvia una nuova struttura per una modifica |
| `/opsx:continue` | Crea il prossimo artefatto in base alle dipendenze |
| `/opsx:ff` | Avanzamento rapido: crea tutti gli artefatti di pianificazione in una volta |
| `/opsx:verify` | Valida che l'implementazione corrisponda agli artefatti |
| `/opsx:sync` | Unisce le specifiche delta nelle specifiche principali |
| `/opsx:bulk-archive` | Archivia più modifiche in una volta |
| `/opsx:onboard` | Tutorial guidato attraverso l'intero flusso di lavoro |

Il profilo globale predefinito è `core`. Per abilitare i comandi del flusso di lavoro esteso, esegui `openspec config profile`, seleziona i flussi di lavoro, poi esegui `openspec update` nel tuo progetto.

---

## Riferimento Comandi

### `/opsx:propose`

Crea un nuovo cambiamento e genera gli artefatti di pianificazione in un unico passaggio. È il comando di avvio predefinito nel profilo `core`.

**Sintassi:**
```text
/opsx:propose [nome-o-descrizione-del-cambiamento]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `nome-o-descrizione-del-cambiamento` | No | Nome in kebab-case o descrizione del cambiamento in linguaggio naturale |

**Cosa fa:**
- Crea `openspec/changes/<nome-cambiamento>/`
- Genera gli artefatti necessari prima dell'implementazione (per `spec-driven`: proposta, specifiche, design, attività)
- Si interrompe quando il cambiamento è pronto per `/opsx:apply`

**Esempio:**
```text
Tu: /opsx:propose add-dark-mode

AI:  Creato openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Pronto per l'implementazione. Esegui /opsx:apply.
```

**Suggerimenti:**
- Usa questo per il percorso end-to-end più rapido
- Se vuoi un controllo passo-passo degli artefatti, abilita i flussi di lavoro espansi e usa `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

Esplora idee, indaga problemi e chiarisci i requisiti prima di impegnarti in un cambiamento.

**Sintassi:**
```
/opsx:explore [argomento]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `argomento` | No | Cosa vuoi esplorare o indagare |

**Cosa fa:**
- Apre una conversazione esplorativa senza struttura richiesta
- Indaga il codebase per rispondere alle domande
- Confronta opzioni e approcci
- Crea diagrammi visivi per chiarire il pensiero
- Può passare a `/opsx:propose` (predefinito) o `/opsx:new` (flusso di lavoro espanso) quando le intuizioni si cristallizzano

**Esempio:**
```text
Tu: /opsx:explore

AI:  Cosa vorresti esplorare?

Tu: Come dovremmo gestire l'autenticazione per l'app mobile?

AI:  Lasciami indagare la tua configurazione di autenticazione attuale...
     [Analizza il codebase]

     Vedo che usi l'autenticazione basata su sessioni per l'app web.
     Per il mobile, abbiamo tre opzioni principali:

     1. Token JWT (stateless, funziona offline)
     2. OAuth2 (se hai bisogno di login di terze parti)
     3. Estendere le sessioni attuali (più semplice, ma richiede connettività)

     La tua API ha già CORS configurato. Quale direzione ti interessa?

Tu: Andiamo con JWT. Possiamo iniziare un cambiamento per questo?

AI:  Pronto quando lo sei. Esegui /opsx:propose add-jwt-auth per iniziare.
```

**Suggerimenti:**
- Usa quando i requisiti non sono chiari o hai bisogno di indagare
- Non vengono creati artefatti durante l'esplorazione
- Utile per confrontare più approcci prima di decidere
- Può leggere file e cercare nel codebase

---

### `/opsx:new`

Avvia un nuovo scaffolding di cambiamento. Crea la cartella del cambiamento e attende che tu generi gli artefatti con `/opsx:continue` o `/opsx:ff`.

Questo comando fa parte del set di flussi di lavoro espansi (non incluso nel profilo `core` predefinito).

**Sintassi:**
```
/opsx:new [nome-cambiamento] [--schema <nome-schema>]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `nome-cambiamento` | No | Nome per la cartella del cambiamento (richiesto se non fornito) |
| `--schema` | No | Schema del flusso di lavoro da utilizzare (predefinito: dalla configurazione o `spec-driven`) |

**Cosa fa:**
- Crea la directory `openspec/changes/<nome-cambiamento>/`
- Crea il file di metadati `.openspec.yaml` nella cartella del cambiamento
- Mostra il primo modello di artefatto pronto per la creazione
- Richiede il nome del cambiamento e lo schema se non forniti

**Cosa crea:**
```
openspec/changes/<nome-cambiamento>/
└── .openspec.yaml    # Metadati del cambiamento (schema, data di creazione)
```

**Esempio:**
```
Tu: /opsx:new add-dark-mode

AI:  Creato openspec/changes/add-dark-mode/
     Schema: spec-driven

     Pronto per creare: proposta
     Usa /opsx:continue per crearla, o /opsx:ff per creare tutti gli artefatti.
```

**Suggerimenti:**
- Usa nomi descrittivi: `add-feature`, `fix-bug`, `refactor-module`
- Evita nomi generici come `update`, `changes`, `wip`
- Lo schema può essere impostato anche nella configurazione del progetto (`openspec/config.yaml`)

---

### `/opsx:continue`

Crea il prossimo artefatto nella catena di dipendenze. Crea un artefatto alla volta per un progresso incrementale.

**Sintassi:**
```
/opsx:continue [nome-cambiamento]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `nome-cambiamento` | No | Quale cambiamento continuare (dedotto dal contesto se non fornito) |

**Cosa fa:**
- Interroga il grafo delle dipendenze degli artefatti
- Mostra quali artefatti sono pronti rispetto a bloccati
- Crea il primo artefatto pronto
- Legge i file di dipendenza per il contesto
- Mostra cosa diventa disponibile dopo la creazione

**Esempio:**
```
Tu: /opsx:continue

AI:  Cambiamento: add-dark-mode

     Stato degli artefatti:
     ✓ proposta    (fatto)
     ◆ specifiche  (pronto)
     ◆ design      (pronto)
     ○ attività    (bloccato - necessita: specifiche)

     Creazione delle specifiche...

     [Legge proposal.md, crea le specifiche basate sui requisiti]

     ✓ Creato openspec/changes/add-dark-mode/specs/ui/spec.md

     Ora disponibile: attività
     Esegui /opsx:continue per creare il prossimo artefatto.
```

**Suggerimenti:**
- Usa quando vuoi rivedere ogni artefatto prima di procedere
- Utile per cambiamenti complessi dove vuoi il controllo
- Più artefatti possono diventare pronti contemporaneamente
- Puoi modificare gli artefatti creati prima di continuare

---

### `/opsx:ff`

Avanzamento rapido nella creazione degli artefatti. Crea tutti gli artefatti di pianificazione in una volta.

**Sintassi:**
```
/opsx:ff [nome-cambiamento]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `nome-cambiamento` | No | Quale cambiamento avanzare rapidamente (dedotto dal contesto se non fornito) |

**Cosa fa:**
- Crea tutti gli artefatti in ordine di dipendenza
- Traccia il progresso tramite la lista delle attività
- Si interrompe quando tutti gli artefatti `apply-required` sono completi
- Legge ogni dipendenza prima di creare il prossimo artefatto

**Esempio:**
```
Tu: /opsx:ff add-dark-mode

AI:  Avanzamento rapido di add-dark-mode...

     ✓ Creazione proposal.md
     ✓ Creazione specs/ui/spec.md
     ✓ Creazione design.md
     ✓ Creazione tasks.md

     Tutti gli artefatti di pianificazione completi!
     Pronto per l'implementazione. Esegui /opsx:apply per iniziare.
```

**Suggerimenti:**
- Usa quando hai una chiara visione di ciò che stai costruendo
- Più veloce di `/opsx:continue` per cambiamenti semplici
- Puoi comunque modificare gli artefatti dopo
- Utile per funzionalità di piccole e medie dimensioni

---

### `/opsx:apply`

Implementa le attività dal cambiamento. Lavora attraverso l'elenco delle attività, scrivendo il codice e spuntando le voci.

**Sintassi:**
```
/opsx:apply [nome-cambiamento]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `nome-cambiamento` | No | Quale cambiamento implementare (dedotto dal contesto se non fornito) |

**Cosa fa:**
- Legge `tasks.md` e identifica le attività incomplete
- Lavora sulle attività una per una
- Scrive codice, crea file, esegue test se necessario
- Contrassegna le attività come completate con le caselle di controllo `[x]`

**Esempio:**
```
Tu: /opsx:apply

AI:  Implementazione di add-dark-mode...

     Lettura di tasks.md:
     - [ ] 1.1 Crea ThemeContext
     - [ ] 1.2 Aggiungi proprietà personalizzate CSS
     - [ ] 1.3 Implementa persistenza localStorage

     Lavoro su 1.1: Crea ThemeContext...
     [Crea src/context/ThemeContext.tsx]

     ✓ 1.1 Completato

     Lavoro su 1.2: Aggiungi proprietà personalizzate CSS...
     [Aggiorna src/styles/globals.css]

     ✓ 1.2 Completato
     ...
```

**Suggerimenti:**
- Puoi riprendere dove eri rimasto se interrotto
- Usa per cambiamenti paralleli specificando il nome del cambiamento
- Lo stato di completamento è tracciato nelle caselle di controllo di `tasks.md`

---

### `/opsx:verify`

Valida che l'implementazione corrisponda agli artefatti del tuo cambiamento. Verifica completezza, correttezza e coerenza.

**Sintassi:**
```
/opsx:verify [nome-cambiamento]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `nome-cambiamento` | No | Quale cambiamento verificare (dedotto dal contesto se non fornito) |

**Cosa fa:**
- Controlla tre dimensioni della qualità dell'implementazione
- Cerca nel codebase prove dell'implementazione
- Segnala problemi categorizzati come CRITICO, AVVISO o SUGGERIMENTO
- Non blocca l'archiviazione, ma evidenzia i problemi

**Dimensioni di verifica:**

| Dimensione | Cosa valida |
|-----------|-------------------|
| **Completezza** | Tutte le attività completate, tutti i requisiti implementati, scenari coperti |
| **Correttezza** | L'implementazione corrisponde all'intento delle specifiche, casi limite gestiti |
| **Coerenza** | Le decisioni di design riflesse nel codice, pattern coerenti |

**Esempio:**
```
Tu: /opsx:verify

AI:  Verifica di add-dark-mode...

     COMPLETEZZA
     ✓ Tutte le 8 attività in tasks.md sono spuntate
     ✓ Tutti i requisiti nelle specifiche hanno codice corrispondente
     ⚠ Lo scenario "Rilevamento preferenze di sistema" non ha copertura di test

     CORRETTEZZA
     ✓ L'implementazione corrisponde all'intento delle specifiche
     ✓ I casi limite dagli scenari sono gestiti
     ✓ Gli stati di errore corrispondono alle definizioni delle specifiche

     COERENZA
     ✓ Le decisioni di design sono riflesse nella struttura del codice
     ✓ Le convenzioni di denominazione sono coerenti con design.md
     ⚠ Il design menziona "variabili CSS" ma l'implementazione usa classi Tailwind

     RIEPILOGO
     ─────────────────────────────
     Problemi critici: 0
     Avvisi: 2
     Pronto per l'archiviazione: Sì (con avvisi)

     Raccomandazioni:
     1. Aggiungi test per il rilevamento delle preferenze di sistema
     2. Aggiorna design.md per riflettere l'uso di Tailwind, o refactoring per usare variabili CSS
```

**Suggerimenti:**
- Esegui prima dell'archiviazione per catturare le discrepanze in anticipo
- Gli avvisi non bloccano l'archiviazione ma indicano potenziali problemi
- Utile per rivedere il lavoro dell'AI prima di impegnarsi
- Può rivelare divergenze tra artefatti e implementazione

---

### `/opsx:sync`

**Comando opzionale.** Unisce le specifiche delta da un cambiamento nelle specifiche principali. L'archiviazione chiederà di sincronizzare se necessario, quindi di solito non è necessario eseguirlo manualmente.

**Sintassi:**
```
/opsx:sync [nome-cambiamento]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `nome-cambiamento` | No | Quale cambiamento sincronizzare (dedotto dal contesto se non fornito) |

**Cosa fa:**
- Legge le specifiche delta dalla cartella del cambiamento
- Analizza le sezioni AGGIUNTO/MODIFICATO/ELIMINATO/RINOMINATO
- Unisce le modifiche nella directory principale `openspec/specs/`
- Preserva il contenuto esistente non menzionato nella delta
- Non archivia il cambiamento (rimane attivo)

**Esempio:**
```text
Tu: /opsx:sync

AI:  Sincronizzazione delle specifiche delta di add-dark-mode...

     Lettura: openspec/changes/add-dark-mode/specs/ui/spec.md
     Destinazione: openspec/specs/ui/spec.md

     Modifiche da applicare:
     ✓ AGGIUNTO: Requisito Selezione Tema (2 scenari)
     ✓ AGGIUNTO: Requisito Accessibilità (1 scenario)

     Unione...
     ✓ openspec/specs/ui/spec.md aggiornato

     Il cambiamento rimane attivo. Esegui /opsx:archive quando sei pronto per completare.
```

**Quando usare manualmente:**

| Scenario | Usa sync? |
|----------|-----------|
| Cambiamento a lungo termine, vuoi le specifiche principali prima dell'archiviazione | Sì |
| Più cambiamenti paralleli hanno bisogno delle specifiche base aggiornate | Sì |
| Vuoi visualizzare/rivedere l'unione separatamente | Sì |
| Cambiamento rapido, vai direttamente all'archiviazione | No (l'archiviazione lo gestisce) |

**Suggerimenti:**
- La sincronizzazione è intelligente, non copia-incolla
- Può aggiungere scenari a requisiti esistenti senza duplicare
- Il cambiamento rimane attivo dopo la sincronizzazione (non archiviato)
- La maggior parte degli utenti non dovrà mai chiamare questo direttamente—l'archiviazione lo richiede se necessario

---

### `/opsx:archive`

Archivia un cambiamento completato. Finalizza il cambiamento e lo sposta nella cartella degli archivi.

**Sintassi:**
```
/opsx:archive [nome-cambiamento]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `nome-cambiamento` | No | Quale cambiamento archiviare (dedotto dal contesto se non fornito) |

**Cosa fa:**
- Controlla lo stato di completamento degli artefatti
- Controlla il completamento delle attività (avvisa se incomplete)
- Offre di sincronizzare le specifiche delta se non già sincronizzate
- Sposta la cartella del cambiamento in `openspec/changes/archive/AAAA-MM-GG-<nome>/`
- Preserva tutti gli artefatti per la traccia di audit

**Esempio:**
```text
Tu: /opsx:archive

AI:  Archiviazione di add-dark-mode...

     Stato degli artefatti:
     ✓ proposal.md esiste
     ✓ specs/ esiste
     ✓ design.md esiste
     ✓ tasks.md esiste (8/8 attività completate)

     Specifiche delta: Non ancora sincronizzate
     → Sincronizzare ora? (consigliato)

Tu: Sì

AI:  ✓ Specifiche sincronizzate in openspec/specs/ui/spec.md
     ✓ Spostato in openspec/changes/archive/2025-01-24-add-dark-mode/

     Cambiamento archiviato con successo.
```

**Suggerimenti:**
- L'archiviazione non si bloccherà sulle attività incomplete, ma avviserà
- Le specifiche delta possono essere sincronizzate durante l'archiviazione o prima
- I cambiamenti archiviati sono preservati per la storia
- Usa `/opsx:verify` prima per catturare i problemi

---

### `/opsx:bulk-archive`

Archivia più cambiamenti completati alla volta. Gestisce i conflitti tra le specifiche dei cambiamenti.

**Sintassi:**
```
/opsx:bulk-archive [nomi-cambiamento...]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `nomi-cambiamento` | No | Specifici cambiamenti da archiviare (richiede di selezionare se non forniti) |

**Cosa fa:**
- Elenca tutti i cambiamenti completati
- Valida ogni cambiamento prima dell'archiviazione
- Rileva conflitti tra le specifiche dei cambiamenti
- Risolve i conflitti controllando cosa è effettivamente implementato
- Archivia in ordine cronologico

**Esempio:**
```
Tu: /opsx:bulk-archive

AI:  Trovati 3 cambiamenti completati:
     - add-dark-mode (8/8 attività completate)
     - fix-login-bug (3/3 attività completate)
     - update-footer (2/2 attività completate)

     Controllo dei conflitti tra le specifiche...
     ⚠ add-dark-mode e update-footer entrambi toccano specs/ui/

     Ispezione del codebase per risolvere...
     Entrambi i cambiamenti sono implementati. Si uniranno in ordine cronologico:
     1. add-dark-mode (creato 20 gennaio)
     2. update-footer (creato 22 gennaio)

     Archiviare tutti e 3 i cambiamenti?

Tu: Sì

AI:  ✓ Archiviato add-dark-mode
     ✓ Archiviato fix-login-bug
     ✓ Archiviato update-footer
     Specifiche unite: add-dark-mode → update-footer
```

**Suggerimenti:**
- Utile per flussi di lavoro paralleli
- La risoluzione dei conflitti è agente (controlla il codebase)
- I cambiamenti sono archiviati in ordine di creazione
- Chiede prima di sovrascrivere il contenuto delle specifiche

---

### `/opsx:onboard`

Onboarding guidato attraverso il flusso di lavoro completo di OpenSpec. Un tutorial interattivo che utilizza il tuo codebase reale.

**Sintassi:**
```
/opsx:onboard
```

**Cosa fa:**
- Guida attraverso un ciclo di lavoro completo con narrazione
- Scansiona il tuo codebase per opportunità reali di miglioramento
- Crea un cambiamento reale con artefatti reali
- Implementa lavoro reale (piccole, modifiche sicure)
- Archivia il cambiamento completato
- Spiega ogni passaggio mentre avviene

**Fasi:**
1. Benvenuto e analisi del codebase
2. Trovare un'opportunità di miglioramento
3. Creare un cambiamento (`/opsx:new`)
4. Scrivere la proposta
5. Creare le specifiche
6. Scrivere il design
7. Creare le attività
8. Implementare le attività (`/opsx:apply`)
9. Verificare l'implementazione
10. Archiviare il cambiamento
11. Riepilogo e prossimi passi

**Esempio:**
```
Tu: /opsx:onboard

AI:  Benvenuto in OpenSpec!

     Ti guiderò attraverso il flusso di lavoro completo usando il tuo codebase reale.
     Troveremo qualcosa di piccolo da migliorare, creeremo un cambiamento adeguato per esso,
     lo implementeremo e lo archivieremo.

     Lasciami scansionare il tuo codebase per le opportunità...

     [Analizza il codebase]

     Ho trovato alcune cose su cui potremmo lavorare:
     1. Aggiungere la validazione degli input al modulo di contatto
     2. Migliorare i messaggi di errore nel flusso di autenticazione
     3. Aggiungere stati di caricamento ai pulsanti asincroni

     Quale ti interessa? (o suggerisci qualcos'altro)
```

**Suggerimenti:**
- Ideale per i nuovi utenti che imparano il flusso di lavoro
- Usa codice reale, non esempi fittizi
- Crea un cambiamento reale che puoi mantenere o scartare
- Richiede 15-30 minuti per essere completato

---

## Sintassi dei Comandi per Strumento AI

Diversi strumenti AI utilizzano una sintassi dei comandi leggermente diversa. Utilizza il formato che corrisponde al tuo strumento:

| Strumento | Esempio di Sintassi |
|-----------|---------------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Trae | Invocazioni basate su skill come `/openspec-propose`, `/openspec-apply-change` (nessun file di comando generato `opsx-*`) |

L'intento è lo stesso per tutti gli strumenti, ma il modo in cui i comandi vengono presentati può differire a seconda dell'integrazione.

> **Nota:** I comandi di GitHub Copilot (`.github/prompts/*.prompt.md`) sono disponibili solo nelle estensioni IDE (VS Code, JetBrains, Visual Studio). GitHub Copilot CLI attualmente non supporta file di prompt personalizzati — consulta [Strumenti Supportati](supported-tools.md) per dettagli e soluzioni alternative.

---

## Comandi Legacy

Questi comandi utilizzano il vecchio flusso di lavoro "tutto in una volta". Funzionano ancora, ma i comandi OPSX sono consigliati.

| Comando | Cosa fa |
|---------|---------|
| `/openspec:proposal` | Crea tutti gli artifact in una volta (proposta, specifiche, design, attività) |
| `/openspec:apply` | Implementa la modifica |
| `/openspec:archive` | Archivia la modifica |

**Quando usare i comandi legacy:**
- Progetti esistenti che utilizzano il vecchio flusso di lavoro
- Modifiche semplici per cui non è necessaria la creazione incrementale degli artifact
- Preferenza per l'approccio "tutto o niente"

**Migrazione a OPSX:**
Le modifiche legacy possono essere proseguite con i comandi OPSX. La struttura degli artifact è compatibile.

---

## Risoluzione dei Problemi

### "Modifica non trovata"

Il comando non è riuscito a identificare su quale modificare lavorare.

**Soluzioni:**
- Specifica esplicitamente il nome della modifica: `/opsx:apply add-dark-mode`
- Verifica che la cartella della modifica esista: `openspec list`
- Assicurati di essere nella directory corretta del progetto

### "Nessun artifact pronto"

Tutti gli artifact sono o completi o bloccati da dipendenze mancanti.

**Soluzioni:**
- Esegui `openspec status --change <nome>` per vedere cosa sta bloccando
- Verifica se gli artifact richiesti esistono
- Crea prima gli artifact delle dipendenze mancanti

### "Schema non trovato"

Lo schema specificato non esiste.

**Soluzioni:**
- Elenca gli schemi disponibili: `openspec schemas`
- Verifica l'ortografia del nome dello schema
- Crea lo schema se è personalizzato: `openspec schema init <nome>`

### Comandi non riconosciuti

Lo strumento AI non riconosce i comandi OpenSpec.

**Soluzioni:**
- Assicurati che OpenSpec sia inizializzato: `openspec init`
- Rigenera le skill: `openspec update`
- Verifica che la directory `.claude/skills/` esista (per Claude Code)
- Riavvia il tuo strumento AI per caricare le nuove skill

### Artifact non generati correttamente

L'AI crea artifact incompleti o errati.

**Soluzioni:**
- Aggiungi il contesto del progetto in `openspec/config.yaml`
- Aggiungi regole per singolo artifact per una guida specifica
- Fornisci maggiori dettagli nella descrizione della modifica
- Usa `/opsx:continue` invece di `/opsx:ff` per un maggiore controllo

---

## Prossimi Passi

- [Flussi di Lavoro](workflows.md) - Pattern comuni e quando usare ogni comando
- [CLI](cli.md) - Comandi terminali per gestione e validazione
- [Personalizzazione](customization.md) - Crea schemi e flussi di lavoro personalizzati