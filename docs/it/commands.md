# Comandi

Questo è il riferimento per i comandi slash di OpenSpec. Questi comandi vengono invocati nell'interfaccia chat del tuo assistente di programmazione AI (ad esempio, Claude Code, Cursor, Windsurf).

Per i pattern di flusso di lavoro e quando utilizzare ogni comando, consulta [Flussi di lavoro](workflows.md). Per i comandi CLI, consulta [CLI](cli.md).

## Riferimento Rapido

### Percorso Rapido Predefinito (profilo `core`)

| Comando | Scopo |
|---------|-------|
| `/opsx:propose` | Crea una modifica e genera artefatti di pianificazione in un unico passaggio |
| `/opsx:explore` | Riflette sulle idee prima di impegnarsi in una modifica |
| `/opsx:apply` | Implementa i compiti derivanti dalla modifica |
| `/opsx:sync` | Unisce le specifiche delta nelle specifiche principali |
| `/opsx:archive` | Archivia una modifica completata |

### Comandi di Flusso di Lavoro Espanso (selezione personalizzata del flusso di lavoro)

| Comando | Scopo |
|---------|-------|
| `/opsx:new` | Avvia un nuovo scaffold di modifica |
| `/opsx:continue` | Crea l'artefatto successivo in base alle dipendenze |
| `/opsx:ff` | Avanzamento rapido: crea tutti gli artefatti di pianificazione in una volta |
| `/opsx:verify` | Valida che l'implementazione corrisponda agli artefatti |
| `/opsx:bulk-archive` | Archivia più modifiche contemporaneamente |
| `/opsx:onboard` | Tutorial guidato attraverso l'intero flusso di lavoro |

Il profilo globale predefinito è `core`. Per abilitare i comandi di flusso di lavoro espanso, esegui `openspec config profile`, seleziona i flussi di lavoro, quindi esegui `openspec update` nel tuo progetto.

---

## Riferimento Comandi

### `/opsx:propose`

Crea una nuova modifica e genera gli artefatti di pianificazione in un unico passaggio. Questo è il comando di avvio predefinito nel profilo `core`.

**Sintassi:**
```text
/opsx:propose [nome-o-descrizione-modifica]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `nome-o-descrizione-modifica` | No | Nome in kebab-case o descrizione della modifica in linguaggio naturale |

**Cosa fa:**
- Crea `openspec/changes/<nome-modifica>/`
- Genera gli artefatti necessari prima dell'implementazione (per `spec-driven`: proposta, specifiche, design, attività)
- Si ferma quando la modifica è pronta per `/opsx:apply`

**Esempio:**
```text
Tu: /opsx:propose add-dark-mode

AI:  Creata openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Pronta per l'implementazione. Esegui /opsx:apply.
```

**Suggerimenti:**
- Usa questo per il percorso end-to-end più rapido
- Se desideri un controllo passo-passo degli artefatti, abilita i flussi di lavoro espansi e usa `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

Rifletti sulle idee, indaga i problemi e chiarisci i requisiti prima di impegnarti in una modifica.

**Sintassi:**
```
/opsx:explore [argomento]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `argomento` | No | Ciò che desideri esplorare o indagare |

**Cosa fa:**
- Apre una conversazione esplorativa senza struttura obbligatoria
- Indaga il codice sorgente per rispondere alle domande
- Confronta opzioni e approcci
- Crea diagrammi visivi per chiarire il pensiero
- Può passare a `/opsx:propose` (predefinito) o `/opsx:new` (flusso di lavoro espanso) quando le intuizioni si consolidano

**Esempio:**
```text
Tu: /opsx:explore

AI:  Cosa vorresti esplorare?

Tu: Come dovremmo gestire l'autenticazione per l'app mobile?

AI:  Lasciami indagare la tua attuale configurazione di autenticazione...
     [Analizza il codice sorgente]

     Vedo che usi l'autenticazione basata su sessione per l'app web.
     Per il mobile, abbiamo tre opzioni principali:

     1. Token JWT (senza stato, funziona offline)
     2. OAuth2 (se hai bisogno di accesso con terze parti)
     3. Estendere le sessioni attuali (più semplice, ma richiede connettività)

     La tua API ha già CORS configurato. Quale direzione ti interessa?

Tu: Andiamo con JWT. Possiamo avviare una modifica per questo?

AI:  Pronto quando lo sei tu. Esegui /opsx:propose add-jwt-auth per iniziare.
```

**Suggerimenti:**
- Usa quando i requisiti non sono chiari o devi indagare
- Non vengono creati artefatti durante l'esplorazione
- Utile per confrontare più approcci prima di decidere
- Può leggere file e cercare nel codice sorgente

---

### `/opsx:new`

Avvia un nuovo scaffold di modifica. Crea la cartella della modifica e attende che tu generi gli artefatti con `/opsx:continue` o `/opsx:ff`.

Questo comando fa parte del set di flusso di lavoro espanso (non incluso nel profilo predefinito `core`).

**Sintassi:**
```
/opsx:new [nome-modifica] [--schema <nome-schema>]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `nome-modifica` | No | Nome per la cartella della modifica (richiesto se non fornito) |
| `--schema` | No | Schema del flusso di lavoro da usare (predefinito: dalla configurazione o `spec-driven`) |

**Cosa fa:**
- Crea la directory `openspec/changes/<nome-modifica>/`
- Crea il file di metadati `.openspec.yaml` nella cartella della modifica
- Mostra il primo template di artefatto pronto per la creazione
- Richiede il nome della modifica e lo schema se non forniti

**Cosa crea:**
```
openspec/changes/<nome-modifica>/
└── .openspec.yaml    # Metadati della modifica (schema, data di creazione)
```

**Esempio:**
```
Tu: /opsx:new add-dark-mode

AI:  Creata openspec/changes/add-dark-mode/
     Schema: spec-driven

     Pronto per creare: proposal
     Usa /opsx:continue per crearlo, o /opsx:ff per creare tutti gli artefatti.
```

**Suggerimenti:**
- Usa nomi descrittivi: `add-feature`, `fix-bug`, `refactor-module`
- Evita nomi generici come `update`, `changes`, `wip`
- Lo schema può essere impostato anche nella configurazione del progetto (`openspec/config.yaml`)

---

### `/opsx:continue`

Crea l'artefatto successivo nella catena di dipendenze. Crea un artefatto alla volta per un progresso incrementale.

**Sintassi:**
```
/opsx:continue [nome-modifica]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `nome-modifica` | No | Quale modifica continuare (dedotto dal contesto se non fornito) |

**Cosa fa:**
- Interroga il grafo delle dipendenze degli artefatti
- Mostra quali artefatti sono pronti vs bloccati
- Crea il primo artefatto pronto
- Legge i file di dipendenza per il contesto
- Mostra cosa diventa disponibile dopo la creazione

**Esempio:**
```
Tu: /opsx:continue

AI:  Modifica: add-dark-mode

     Stato degli artefatti:
     ✓ proposal    (completato)
     ◆ specs       (pronto)
     ◆ design      (pronto)
     ○ tasks       (bloccato - necessita: specs)

     Creazione di specs...

     [Legge proposal.md, crea le specifiche basate sui requisiti]

     ✓ Creata openspec/changes/add-dark-mode/specs/ui/spec.md

     Ora disponibile: tasks
     Esegui /opsx:continue per creare l'artefatto successivo.
```

**Suggerimenti:**
- Usa quando vuoi rivedere ogni artefatto prima di procedere
- Utile per modifiche complesse dove desideri controllo
- Più artefatti possono diventare pronti contemporaneamente
- Puoi modificare gli artefatti creati prima di continuare

---

### `/opsx:ff`

Avanzamento rapido nella creazione degli artefatti. Crea tutti gli artefatti di pianificazione in una volta.

**Sintassi:**
```
/opsx:ff [nome-modifica]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `nome-modifica` | No | Quale modifica accelerare (dedotto dal contesto se non fornito) |

**Cosa fa:**
- Crea tutti gli artefatti nell'ordine delle dipendenze
- Traccia il progresso tramite una lista di cose da fare
- Si ferma quando tutti gli artefatti `apply-required` sono completati
- Legge ogni dipendenza prima di creare l'artefatto successivo

**Esempio:**
```
Tu: /opsx:ff add-dark-mode

AI:  Avanzamento rapido di add-dark-mode...

     ✓ Creazione di proposal.md
     ✓ Creazione di specs/ui/spec.md
     ✓ Creazione di design.md
     ✓ Creazione di tasks.md

     Tutti gli artefatti di pianificazione completati!
     Pronta per l'implementazione. Esegui /opsx:apply per iniziare.
```

**Suggerimenti:**
- Usa quando hai un'immagine chiara di ciò che stai costruendo
- Più veloce di `/opsx:continue` per modifiche semplici
- Puoi comunque modificare gli artefatti in seguito
- Ideale per funzionalità da piccole a medie

---

### `/opsx:apply`

Implementa le attività della modifica. Lavora attraverso la lista delle attività, scrivendo codice e spuntando le voci.

**Sintassi:**
```
/opsx:apply [nome-modifica]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `nome-modifica` | No | Quale modifica implementare (dedotto dal contesto se non fornito) |

**Cosa fa:**
- Legge `tasks.md` e identifica le attività incomplete
- Lavora sulle attività una per una
- Scrive codice, crea file, esegue test se necessario
- Segna le attività come completate con le caselle di controllo `[x]`

**Esempio:**
```
Tu: /opsx:apply

AI:  Implementazione di add-dark-mode...

     Lettura di tasks.md:
     - [ ] 1.1 Creare ThemeContext
     - [ ] 1.2 Aggiungere proprietà CSS personalizzate
     - [ ] 1.3 Implementare la persistenza localStorage

     Lavoro su 1.1: Creare ThemeContext...
     [Crea src/context/ThemeContext.tsx]

     ✓ 1.1 Completato

     Lavoro su 1.2: Aggiungere proprietà CSS personalizzate...
     [Aggiorna src/styles/globals.css]

     ✓ 1.2 Completato
     ...
```

**Suggerimenti:**
- Può riprendere da dove hai lasciato se interrotto
- Usa per modifiche parallele specificando il nome della modifica
- Lo stato di completamento è tracciato nelle caselle di controllo di `tasks.md`

---

### `/opsx:verify`

Valida che l'implementazione corrisponda ai tuoi artefatti di modifica. Controlla completezza, correttezza e coerenza.

**Sintassi:**
```
/opsx:verify [nome-modifica]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `nome-modifica` | No | Quale modifica verificare (dedotto dal contesto se non fornito) |

**Cosa fa:**
- Controlla tre dimensioni della qualità dell'implementazione
- Cerca nel codice sorgente prove dell'implementazione
- Segnala problemi categorizzati come CRITICO, AVVISO o SUGGERIMENTO
- Non blocca l'archiviazione, ma evidenzia i problemi

**Dimensioni di verifica:**

| Dimensione | Cosa valida |
|------------|-------------|
| **Completezza** | Tutte le attività completate, tutti i requisiti implementati, scenari coperti |
| **Correttezza** | L'implementazione corrisponde all'intento delle specifiche, casi limite gestiti |
| **Coerenza** | Decisioni di design riflesse nel codice, pattern coerenti |

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
     ✓ Decisioni di design riflesse nella struttura del codice
     ✓ Convenzioni di denominazione coerenti con design.md
     ⚠ Il design menziona "variabili CSS" ma l'implementazione usa classi Tailwind

     RIEPILOGO
     ─────────────────────────────
     Problemi critici: 0
     Avvisi: 2
     Pronta per l'archiviazione: Sì (con avvisi)

     Raccomandazioni:
     1. Aggiungere test per il rilevamento delle preferenze di sistema
     2. Aggiornare design.md per riflettere l'uso di Tailwind, o ristrutturare per usare variabili CSS
```

**Suggerimenti:**
- Esegui prima dell'archiviazione per individuare discrepanze in anticipo
- Gli avvisi non bloccano l'archiviazione ma indicano potenziali problemi
- Utile per rivedere il lavoro dell'IA prima di confermare
- Può rivelare derive tra artefatti e implementazione

---

### `/opsx:sync`

**Comando opzionale.** Unisce le specifiche delta di una modifica nelle specifiche principali. L'archiviazione ti chiederà di sincronizzare se necessario, quindi di solito non è necessario eseguirlo manualmente.

**Sintassi:**
```
/opsx:sync [nome-modifica]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `nome-modifica` | No | Quale modifica sincronizzare (dedotto dal contesto se non fornito) |

**Cosa fa:**
- Legge le specifiche delta dalla cartella della modifica
- Analizza le sezioni AGGIUNTO/MODIFICATO/RIMOSSO/RINOMINATO
- Unisce le modifiche nella directory principale `openspec/specs/`
- Preserva il contenuto esistente non menzionato nel delta
- Non archivia la modifica (rimane attiva)

**Esempio:**
```text
Tu: /opsx:sync

AI:  Sincronizzazione delle specifiche delta di add-dark-mode...

     Lettura: openspec/changes/add-dark-mode/specs/ui/spec.md
     Destinazione: openspec/specs/ui/spec.md

     Modifiche da applicare:
     ✓ AGGIUNTO: Requisito Selezione Tema (2 scenari)
     ✓ AGGIUNTO: Requisito Accessibilità (1 scenario)

     Unione in corso...
     ✓ openspec/specs/ui/spec.md aggiornato

     La modifica rimane attiva. Esegui /opsx:archive quando sei pronto per completare.
```

**Quando usarlo manualmente:**

| Scenario | Usare sync? |
|----------|-------------|
| Modifica di lunga durata, si desiderano le specifiche principali prima dell'archiviazione | Sì |
| Più modifiche parallele necessitano delle specifiche di base aggiornate | Sì |
| Si desidera visualizzare/revisionare l'unione separatamente | Sì |
| Modifica rapida, si va direttamente all'archiviazione | No (l'archiviazione lo gestisce) |

**Suggerimenti:**
- La sincronizzazione è intelligente, non un copia-incolla
- Può aggiungere scenari a requisiti esistenti senza duplicare
- La modifica rimane attiva dopo la sincronizzazione (non archiviata)
- La maggior parte degli utenti non avrà mai bisogno di chiamarlo direttamente—l'archiviazione lo richiede se necessario

---

### `/opsx:archive`

Archivia una modifica completata. Finalizza la modifica e la sposta nella cartella degli archivi.

**Sintassi:**
```
/opsx:archive [nome-modifica]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `nome-modifica` | No | Quale modifica archiviare (dedotto dal contesto se non fornito) |

**Cosa fa:**
- Controlla lo stato di completamento degli artefatti
- Controlla il completamento delle attività (avverte se incomplete)
- Offre di sincronizzare le specifiche delta se non già sincronizzate
- Sposta la cartella della modifica in `openspec/changes/archive/YYYY-MM-DD-<nome>/`
- Preserva tutti gli artefatti per la traccia di revisione

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
     → Sincronizzare ora? (raccomandato)

Tu: Sì

AI:  ✓ Specifiche sincronizzate in openspec/specs/ui/spec.md
     ✓ Spostata in openspec/changes/archive/2025-01-24-add-dark-mode/

     Modifica archiviata con successo.
```

**Suggerimenti:**
- L'archiviazione non bloccherà per attività incomplete, ma avvertirà
- Le specifiche delta possono essere sincronizzate durante l'archiviazione o prima
- Le modifiche archiviate sono preservate per la cronologia
- Usa `/opsx:verify` prima per individuare problemi

---

### `/opsx:bulk-archive`

Archivia più modifiche completate in una volta. Gestisce i conflitti tra le specifiche delle modifiche.

**Sintassi:**
```
/opsx:bulk-archive [nomi-modifiche...]
```

**Argomenti:**
| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `nomi-modifiche` | No | Modifiche specifiche da archiviare (richiede selezione se non fornito) |

**Cosa fa:**
- Elenca tutte le modifiche completate
- Valida ogni modifica prima dell'archiviazione
- Rileva conflitti nelle specifiche tra le modifiche
- Risolve i conflitti controllando ciò che è effettivamente implementato
- Archivia in ordine cronologico

**Esempio:**
```
Tu: /opsx:bulk-archive

AI:  Trovate 3 modifiche completate:
     - add-dark-mode (8/8 attività completate)
     - fix-login-bug (3/3 attività completate)
     - update-footer (2/2 attività completate)

     Controllo conflitti nelle specifiche...
     ⚠ add-dark-mode e update-footer toccano entrambe specs/ui/

     Ispezione del codice sorgente per risolvere...
     Entrambe le modifiche sono implementate. Unione in ordine cronologico:
     1. add-dark-mode (creata il 20 gen)
     2. update-footer (creata il 22 gen)

     Archiviare tutte e 3 le modifiche?

Tu: Sì

AI:  ✓ Archiviata add-dark-mode
     ✓ Archiviata fix-login-bug
     ✓ Archiviata update-footer
     Specifiche unite: add-dark-mode → update-footer
```

**Suggerimenti:**
- Utile per flussi di lavoro paralleli
- La risoluzione dei conflitti è agentica (controlla il codice sorgente)
- Le modifiche sono archiviate in ordine di creazione
- Richiede conferma prima di sovrascrivere il contenuto delle specifiche

---

### `/opsx:onboard`

Onboarding guidato attraverso il flusso di lavoro completo di OpenSpec. Un tutorial interattivo che utilizza il tuo codice sorgente reale.

**Sintassi:**
```
/opsx:onboard
```

**Cosa fa:**
- Guida attraverso un ciclo completo del flusso di lavoro con narrazione
- Scansiona il tuo codice sorgente per reali opportunità di miglioramento
- Crea una modifica effettiva con artefatti reali
- Implementa un lavoro reale (modifiche piccole e sicure)
- Archivia la modifica completata
- Spiega ogni passaggio man mano che avviene

**Fasi:**
1. Benvenuto e analisi del codice sorgente
2. Individuazione di un'opportunità di miglioramento
3. Creazione di una modifica (`/opsx:new`)
4. Scrittura della proposta
5. Creazione delle specifiche
6. Scrittura del design
7. Creazione delle attività
8. Implementazione delle attività (`/opsx:apply`)
9. Verifica dell'implementazione
10. Archiviazione della modifica
11. Riepilogo e prossimi passi

**Esempio:**
```
Tu: /opsx:onboard

AI:  Benvenuto in OpenSpec!

     Ti guiderò attraverso il flusso di lavoro completo utilizzando il tuo codice sorgente reale.
     Troveremo qualcosa di piccolo da migliorare, creeremo una modifica appropriata,
     la implementeremo e la archivieremo.

     Lasciami scansionare il tuo codice sorgente per opportunità...

     [Analizza il codice sorgente]

     Ho trovato alcune cose su cui potremmo lavorare:
     1. Aggiungere validazione dell'input al modulo di contatto
     2. Migliorare i messaggi di errore nel flusso di autenticazione
     3. Aggiungere stati di caricamento ai pulsanti asincroni

     Quale ti interessa? (o suggerisci qualcos'altro)
```

**Suggerimenti:**
- Ideale per i nuovi utenti che apprendono il flusso di lavoro
- Utilizza codice reale, non esempi fittizi
- Crea una modifica reale che puoi mantenere o scartare
- Richiede 15-30 minuti per essere completato

---

## Sintassi dei Comandi per Strumento AI

Diversi strumenti AI utilizzano una sintassi dei comandi leggermente diversa. Usa il formato corrispondente al tuo strumento:

| Strumento | Esempio di Sintassi |
|-----------|---------------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Invocazioni basate su skill come `/skill:openspec-propose`, `/skill:openspec-apply-change` (nessun file di comando `opsx-*` generato) |
| Trae | Invocazioni basate su skill come `/openspec-propose`, `/openspec-apply-change` (nessun file di comando `opsx-*` generato) |

L'intento è lo stesso in tutti gli strumenti, ma il modo in cui i comandi vengono presentati può differire a seconda dell'integrazione.

> **Nota:** I comandi di GitHub Copilot (`.github/prompts/*.prompt.md`) sono disponibili solo nelle estensioni IDE (VS Code, JetBrains, Visual Studio). GitHub Copilot CLI attualmente non supporta file di prompt personalizzati — consulta [Strumenti Supportati](supported-tools.md) per dettagli e soluzioni alternative.

---

## Comandi Legacy

Questi comandi utilizzano il vecchio flusso di lavoro "tutto-in-una-volta". Funzionano ancora, ma i comandi OPSX sono raccomandati.

| Comando | Cosa fa |
|---------|---------|
| `/openspec:proposal` | Crea tutti gli artefatti in una volta (proposal, specs, design, tasks) |
| `/openspec:apply` | Implementa la modifica |
| `/openspec:archive` | Archivia la modifica |

**Quando usare i comandi legacy:**
- Progetti esistenti che utilizzano il vecchio flusso di lavoro
- Modifiche semplici in cui non è necessaria la creazione incrementale di artefatti
- Preferenza per l'approccio tutto-o-niente

**Migrazione a OPSX:**
Le modifiche legacy possono essere continuate con i comandi OPSX. La struttura degli artefatti è compatibile.

---

## Risoluzione dei Problemi

### "Modifica non trovata"

Il comando non è riuscito a identificare su quale modifica lavorare.

**Soluzioni:**
- Specifica esplicitamente il nome della modifica: `/opsx:apply add-dark-mode`
- Verifica che la cartella della modifica esista: `openspec list`
- Assicurati di essere nella directory di progetto corretta

### "Nessun artefatto pronto"

Tutti gli artefatti sono completi o bloccati da dipendenze mancanti.

**Soluzioni:**
- Esegui `openspec status --change <nome>` per vedere cosa blocca
- Controlla se gli artefatti richiesti esistono
- Crea prima gli artefatti di dipendenza mancanti

### "Schema non trovato"

Lo schema specificato non esiste.

**Soluzioni:**
- Elenca gli schemi disponibili: `openspec schemas`
- Controlla l'ortografia del nome dello schema
- Crea lo schema se è personalizzato: `openspec schema init <nome>`

### Comandi non riconosciuti

Lo strumento AI non riconosce i comandi OpenSpec.

**Soluzioni:**
- Assicurati che OpenSpec sia inizializzato: `openspec init`
- Rigenera le skill: `openspec update`
- Verifica che la directory `.claude/skills/` esista (per Claude Code)
- Riavvia il tuo strumento AI per acquisire le nuove skill

### Artefatti non generati correttamente

L'AI crea artefatti incompleti o errati.

**Soluzioni:**
- Aggiungi il contesto del progetto in `openspec/config.yaml`
- Aggiungi regole specifiche per artefatto per una guida mirata
- Fornisci più dettagli nella descrizione della modifica
- Usa `/opsx:continue` invece di `/opsx:ff` per avere più controllo

---

## Prossimi Passi

- [Flussi di Lavoro](workflows.md) - Pattern comuni e quando usare ogni comando
- [CLI](cli.md) - Comandi di terminale per gestione e validazione
- [Personalizzazione](customization.md) - Crea schemi e flussi di lavoro personalizzati