# Flussi di Lavoro (Workflows)

Questa guida copre i modelli comuni di flusso di lavoro per OpenSpec e quando utilizzare ciascuno di essi. Per l'installazione base, vedi [Getting Started](getting-started.md). Per il riferimento dei comandi, vedi [Commands](commands.md).

## Filosofia: Azioni, non Fasi (Actions, Not Phases)

I flussi di lavoro tradizionali ti costringono attraverso fasi: pianificazione, poi implementazione, poi completamento. Ma il lavoro reale non si adatta perfettamente in scatole predefinite.

OPSX adotta un approccio diverso:

```text
Tradizionale (bloccato per fasi):

  PIANIFICAZIONE ────────► IMPLEMENTAZIONE ────────► COMPLETAMENTO
      │                    │
      │   "Non si può tornare indietro"  │
      └────────────────────┘

OPSX (azioni fluide):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Principi chiave:**

- **Azioni, non fasi** - I comandi sono cose che puoi fare, non stadi in cui sei bloccato.
- **Le dipendenze sono abilitanti (enablers)** - Mostrano cosa è possibile, non cosa è richiesto dopo.

> **Personalizzazione:** I flussi di lavoro di OPSX sono guidati da schemi (schemas) che definiscono le sequenze degli artefatti. Vedi [Customization](customization.md) per i dettagli sulla creazione di schemi personalizzati.

## Due Modalità

### Percorso Rapido Predefinito (`core` profile)

Le nuove installazioni sono impostate su `core`, che fornisce:
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Flusso tipico:

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (opzionale)
```

#### Iniziare esplorando (l'abitudine da sviluppare)

`/opsx:explore` fa parte del profilo predefinito, non è un add-on avanzato. È la mossa da fare ogni volta che hai un problema ma non ancora un piano, cosa che accade nella maggior parte dei casi con un assistente AI.

```text
Tu: /opsx:explore

AI:  Cosa vorresti esplorare?

Tu: Le mie ricerche sembrano stantidi. Non sono sicuro se sia la cache, l'indicizzazione o la query stessa.

AI:  Lascia che guardi... [legge il servizio di ricerca e lo strato della cache]
     È l'indice: viene ricostruito solo ogni notte, quindi le modifiche non compaiono fino al giorno successivo. Ci sono due opzioni: rebuild on write (semplice, maggiore carico) o una cancellazione della cache a breve TTL (più parti in movimento, meno carico). Dato che il tuo volume di scrittura è basso, la soluzione più pulita è rebuild-on-write. Vuoi definirne l'ambito?

Tu: Sì.

Tu: /opsx:propose rebuild-search-index-on-write
```

Esplorare non crea artefatti e non scrive codice. È una conversazione gratuita e senza rischi che trasforma una preoccupazione vaga in un cambiamento preciso, così la proposta successiva è mirata. Sai già esattamente cosa vuoi? Saltalo e vai direttamente a `/opsx:propose`. Guida completa: [Explore First](explore.md).

### Flusso di Lavoro Esteso/Completo (selezione personalizzata)

Se desideri comandi espliciti per lo scaffold e la costruzione (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), abilitali con:

```bash
openspec config profile
openspec update
```

## Modelli di Flusso di Lavoro (Modalità Estesa)

### Funzionalità Rapida

Quando sai cosa vuoi costruire e devi solo eseguire:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Esempio di conversazione:**

```text
Tu: /opsx:new add-logout-button

AI:  Creato openspec/changes/add-logout-button/
     Pronto per creare: proposta

Tu: /opsx:ff

AI:  Creando tutti gli artefatti di pianificazione...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Pronto per l'implementazione!

Tu: /opsx:apply

AI:  Lavorando sui compiti...
     ✓ Aggiunto pulsante di logout nell'intestazione
     ✓ Implementata la cancellazione della sessione
     ✓ Aggiunto dialogo di conferma
     Tutti i compiti completati!

Tu: /opsx:archive

AI:  ✓ Schemi unificati (Merged specs)
     ✓ Cambiamento archiviato
```

**Ideale per:** Funzionalità piccole o medie, correzioni di bug, cambiamenti semplici.

### Esplorativo

Quando i requisiti non sono chiari o devi prima indagare:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Esempio di conversazione:**

```text
Tu: /opsx:explore

AI:  Cosa vorresti esplorare?

Tu: Voglio migliorare le prestazioni del caricamento della pagina, ma non sono sicuro dove si trovino i colli di bottiglia.

AI:  Lascia che aiuto a indagare...
     [Analizza le dimensioni dei bundle, identifica query lente, rivede i modelli di rendering dei componenti]

     Ho trovato tre principali colli di bottiglia:
     1. Immagini grandi e non ottimizzate
     2. Recupero dati sincrono in ProductList
     3. Re-rendering dovuti ai cambiamenti di contesto

     Quale vorresti affrontare per primo?

Tu: Affrontiamo il problema del recupero dei dati.

Tu: /opsx:new optimize-product-list-fetching

AI:  Cambiamento creato. Pronto per creare: proposta

Tu: /opsx:continue

AI:  Creando la proposta basata sulla nostra esplorazione...
     [Scrive la proposta incorporando gli approfondimenti dell'indagine]

     Pronto per creare: schemi, design
     Quale vorresti fare dopo?

Tu: /opsx:continue

AI:  Creando i requisiti (specs)...
```

**Ideale per:** Ottimizzazione delle prestazioni, debugging, decisioni architetturali, requisiti non chiari.

### Cambiamenti Paralleli

Lavora su più cambiamenti contemporaneamente:

```text
Cambiamento A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in corso)
                                         │
                                    cambio di contesto
                                         │
Cambiamento B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Esempio di conversazione:**

```text
Tu: Sto lavorando su add-dark-mode ma sono stato richiamato per una correzione di bug

Tu: /opsx:new fix-login-redirect

AI:  Creato openspec/changes/fix-login-redirect/

Tu: /opsx:ff

AI:  ✓ Artefatti di pianificazione creati

Tu: /opsx:apply

AI:  Lavorando su fix-login-redirect...
     [Implementa la correzione]
     Tutti i compiti completati!

Tu: /opsx:archive

AI:  ✓ fix-login-redirect archiviato

Tu: Torniamo a dark mode

Tu: /opsx:apply add-dark-mode

AI:  Riprendendo add-dark-mode...
     Ricomincio dal compito 2.3: Aggiorna Intestazione...
```

**Ideale per:** Flussi di lavoro paralleli, interruzioni urgenti, collaborazione di squadra.

Quando hai più cambiamenti completati, usa `/opsx:bulk-archive`:

```text
Tu: /opsx:bulk-archive

AI:  Trovate 3 cambiamenti completati:
     - add-dark-mode (tutti i compiti completi)
     - fix-login-redirect (tutti i compiti completi)
     - update-footer (tutti i compiti completi)

     Verifica dei conflitti di schema...
     ⚠ add-dark-mode e update-footer toccano entrambi specs/ui/

     Ispezionando la codebase per risolvere...
     Entrambi i cambiamenti sono implementati. Verranno applicati in ordine cronologico.

     Archiviare tutti e tre i cambiamenti?

Tu: Sì

AI:  ✓ add-dark-mode archiviato
     ✓ fix-login-redirect archiviato
     ✓ update-footer archiviato
     Schemi unificati nell'ordine: add-dark-mode → update-footer
```

Bulk archive rileva quando più cambiamenti toccano gli stessi schemi e risolve i conflitti controllando cosa è effettivamente implementato.

### Completare un Cambiamento

Il flusso di completamento raccomandato:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              valida l'implementazione     chiede la sincronizzazione
              (validates)                   se necessario
```

#### Verifica: Controlla il Lavoro

`/opsx:verify` valida l'implementazione rispetto ai tuoi artefatti su tre dimensioni:

```text
Tu: /opsx:verify

AI:  Verificando add-auth...

     COMPLETTEZZA (COMPLETENESS)
     ✓ Tutti i 12 compiti in tasks.md sono stati controllati
     ✓ Tutti i requisiti negli schemi hanno codice corrispondente
     ⚠ Scenario "Timeout della sessione dopo l'inattività" non testato

     CORRETTEZZA (CORRECTNESS)
     ✓ L'implementazione corrisponde all'intento dello schema
     ✓ I casi limite dai vari scenari sono gestiti
     ✓ Gli stati di errore corrispondono alle definizioni dello schema

     COERENZA (COHERENCE)
     ✓ Le decisioni di design sono riflesse nella struttura del codice
     ✓ Convenzioni di denominazione coerenti con design.md
     ⚠ Il design menziona "event-driven" ma l'implementazione usa il polling

     RIEPILOGO (SUMMARY)
     ─────────────────────────────
     Problemi critici: 0
     Avvisi: 2
     Pronto per archiviare: Sì (con avvisi)

     Raccomandazioni:
     1. Aggiungere un test per lo scenario di timeout della sessione
     2. Considerare il refactoring verso un approccio event-driven come progettato, o aggiornare design.md
```

**Cosa controlla la verifica:**

| Dimensione | Cosa valida |
|-----------|------------------|
| Completezza | Tutti i compiti completati, tutti i requisiti implementati, scenari coperti |
| Correttezza | L'implementazione corrisponde all'intento dello schema, i casi limite sono gestiti |
| Coerenza | Le decisioni di design sono riflesse nel codice, i modelli sono coerenti |

La verifica non blocca l'archiviazione, ma evidenzia problemi che potresti voler affrontare per primi.

#### Archiviazione: Finalizzare il Cambiamento

`/opsx:archive` completa il cambiamento e lo sposta nell'archivio:

```text
Tu: /opsx:archive

AI:  Archiviando add-auth...

     Stato degli artefatti:
     ✓ proposal.md esiste
     ✓ specs/ esiste
     ✓ design.md esiste
     ✓ tasks.md esiste (12/12 compiti completi)

     Schemi Delta: Non ancora sincronizzati su main
     → Vuoi sincronizzare ora?

Tu: Sì

AI:  ✓ Schemi sincronizzati in openspec/specs/auth/spec.md
     ✓ Spostato in openspec/changes/archive/2025-01-24-add-auth/

     Cambiamento archiviato con successo.
```

L'archiviazione chiederà conferma se gli schemi non sono sincronizzati. Non bloccherà per compiti incompletati, ma ti avviserà.

## Quando Usare Cosa

### `/opsx:ff` vs `/opsx:continue`

| Situazione | Usa |
|-----------|-----|
| Requisiti chiari, pronto a costruire | `/opsx:ff` |
| Esplorando, vuoi rivedere ogni passaggio | `/opsx:continue` |
| Vuoi iterare sulla proposta prima degli schemi | `/opsx:continue` |
| Pressione di tempo, devi muoverti velocemente | `/opsx:ff` |
| Cambiamento complesso, vuoi il controllo | `/opsx:continue` |

**Regola generale:** Se puoi descrivere l'intero ambito in anticipo, usa `/opsx:ff`. Se stai scoprendo mentre procedi, usa `/opsx:continue`.

### Quando Aggiornare vs Iniziare da Zero

Una domanda comune: quando è accettabile aggiornare un cambiamento esistente e quando dovresti crearne uno nuovo?

**Aggiorna il cambiamento esistente quando:**

- Stesso intento, esecuzione raffinata
- L'ambito si restringe (MVP per primo, il resto dopo)
- Correzioni guidate dall'apprendimento (la codebase non era quella che ti aspettavi)
- Piccoli aggiustamenti del design basati sulle scoperte dell'implementazione

**Inizia un cambiamento nuovo quando:**

- L'intento è cambiato fondamentalmente
- L'ambito è esploso in un lavoro completamente diverso
- Il cambiamento originale può essere contrassegnato come "fatto" in autonomia
- Le patch confonderebbero più che chiarire

```text
                     ┌─────────────────────────────────────┐
                     │     È questo lo stesso lavoro?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Stesso intento?      >50% di sovrapposizione?      Il originale può essere "fatto" senza questi cambiamenti?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      SÌ               NO SÌ           NO  NO              SÌ
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    AGGIORNA            NUOVO  AGGIORNA        NUOVO  AGGIORNA          NUOVO
```

**Esempio: "Aggiungere la dark mode"**

- "È necessario supportare anche temi personalizzati" → Nuovo cambiamento (l'ambito è esploso)
- "La rilevazione delle preferenze di sistema è più difficile del previsto" → Aggiornamento (stesso intento)
- "Rilasciamo prima il toggle, aggiungiamo le preferenze dopo" → Aggiorna e archivia, poi nuovo cambiamento

## Migliori Pratiche

### Mantieni i Cambiamenti Focalizzati

Una singola unità logica di lavoro per ogni cambiamento. Se stai facendo "aggiungere la feature X e anche refactorare Y", considera due cambiamenti separati.

**Perché è importante:**
- Più facile da rivedere e comprendere
- Storia dell'archivio più pulita
- Può essere rilasciato in modo indipendente
- Rollback più semplice se necessario

### Usa `/opsx:explore` per Requisiti Non Chiari

Prima di impegnarti su un cambiamento, esplora lo spazio del problema:

```text
Tu: /opsx:explore

AI:  Cosa vorresti esplorare?

Tu: Come dovremmo gestire il rate limiting per la nostra API?

AI:  Lascia che indaghi sulla tua configurazione attuale e sulle opzioni...
     [Ricerca la codebase, considera i modelli]

     Vedo tre approcci che potremmo adottare:
     1. Basato su middleware (semplice, per endpoint)
     2. Supportato da Redis (scalabile, stato condiviso)
     3. Bucket di token per utente (equo, complesso)

     La tua stack attuale suggerisce #1 o #2. Qual è la tua scala?
```

L'esplorazione chiarisce il pensiero prima che tu crei gli artefatti.

### Verifica Prima di Archiviare

Usa `/opsx:verify` per controllare che l'implementazione corrisponda agli artefatti:

```text
Tu: /opsx:verify

AI:  Verificando add-dark-mode...

     ✓ Tutti i compiti in tasks.md sono stati controllati
     ✓ I requisiti negli schemi hanno codice corrispondente
     ✓ Le decisioni di design sono riflesse nell'implementazione

     Pronto per archiviare!
```

Cattura le discrepanze prima di chiudere il cambiamento.

### Nomina i Cambiamenti in Modo Chiaro

I nomi buoni rendono utile `openspec list`:

```text
Buoni:                          Evitare:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Riferimento Rapido dei Comandi

Per i dettagli completi e le opzioni dei comandi, vedi [Commands](commands.md).

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/opsx:propose` | Creare artefatti di pianificazione e modifiche | Percorso predefinito rapido (profilo `core`) |
| `/opsx:explore` | Riflettere su idee con l'AI | Iniziare qui quando si è incerti: requisiti non chiari, indagine, confronto delle opzioni |
| `/opsx:new` | Avviare uno scheletro di modifica (scaffold) | Modalità estesa, controllo esplicito degli artefatti |
| `/opsx:continue` | Creare il prossimo artefatto | Modalità estesa, creazione di artefatti passo dopo passo |
| `/opsx:ff` | Creare tutti gli artefatti di pianificazione | Modalità estesa, ambito chiaro |
| `/opsx:apply` | Implementare i compiti (task) | Pronto a scrivere codice |
| `/opsx:verify` | Validare l'implementazione | Modalità estesa, prima dell'archiviazione |
| `/opsx:sync` | Unire le specifiche del delta (delta specs) | Modalità estesa, opzionale |
| `/opsx:archive` | Completare la modifica | Tutto il lavoro è finito |
| `/opsx:bulk-archive` | Archiviare modifiche multiple | Modalità estesa, lavoro parallelo |

## Prossimi Passi

- [Commands](commands.md) - Riferimento completo dei comandi e delle opzioni
- [Concepts](concepts.md) - Approfondimento delle specifiche (specs), degli artefatti e degli schemi
- [Customization](customization.md) - Creare flussi di lavoro personalizzati