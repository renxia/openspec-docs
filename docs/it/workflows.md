# Flussi di lavoro

Questa guida illustra i modelli di flusso di lavoro comuni per OpenSpec e quando utilizzare ciascuno di essi. Per la configurazione di base, vedi [Getting Started](getting-started.md). Per il riferimento dei comandi, vedi [Commands](commands.md).

## Filosofia: Azioni, non fasi

I flussi di lavoro tradizionali ti costringono ad attraversare fasi: pianificazione, poi implementazione, poi fine. Ma il lavoro reale non si adatta perfettamente a queste scatole.

OPSX adotta un approccio diverso:

```text
Tradizionale (fasi bloccate):

  PIANIFICAZIONE ────────► IMPLEMENTAZIONE ────────► FATTO
      │                    │
      │   "Non si può tornare indietro"  │
      └────────────────────┘

OPSX (azioni fluide):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Principi chiave:**

- **Azioni, non fasi** - I comandi sono cose che puoi fare, non fasi in cui rimani bloccato
- **Le dipendenze sono abilitatori** - Mostrano cosa è possibile, non cosa è richiesto successivamente

> **Personalizzazione:** I flussi di lavoro OPSX sono guidati da schemi che definiscono le sequenze di artefatti. Vedi [Customization](customization.md) per i dettagli sulla creazione di schemi personalizzati.

## Due Modalità

### Percorso Rapido Predefinito (profilo `core`)

Le nuove installazioni usano `core` come predefinito, che fornisce:
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

#### Inizia con l'esplorazione (l'abitudine che vale la pena acquisire)

`/opsx:explore` fa parte del profilo predefinito, non è un componente aggiuntivo avanzato. È la mossa da fare ogni volta che hai un problema ma non ancora un piano, cosa che, con un assistente AI, accade nella maggior parte dei casi.

```text
Tu: /opsx:explore

AI:  Cosa vorresti esplorare?

Tu: I nostri risultati di ricerca sono obsoleti. Non sono sicuro se si tratti di caching,
     indicizzazione o della query stessa.

AI:  Lasciami controllare... [legge il servizio di ricerca e il livello di cache]
     È l'indice: viene ricostruito solo ogni notte, quindi le modifiche non vengono
     mostrate fino al giorno dopo. Due opzioni: ricostruisci in scrittura (semplice,
     più carico) o un'invalidazione della cache con TTL breve (più componenti in movimento,
     meno carico). Dato che il tuo volume di scrittura è basso, la ricostruzione in scrittura è
     la soluzione più pulita. Vuoi definirne l'ambito?

Tu: Sì.

Tu: /opsx:propose rebuild-search-index-on-write
```

L'esplorazione non crea artefatti e non scrive codice. È una conversazione gratuita e senza rischi che trasforma un dubbio vago in una modifica precisa, quindi la proposta che segue è mirata. Se già sai esattamente cosa vuoi, salta questo passaggio e vai direttamente a `/opsx:propose`. Guida completa: [Esplora prima](explore.md).

### Flusso di Lavoro Espanso/Completo (selezione personalizzata)

Se desideri i comandi espliciti di scaffolding e creazione (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), abilitali con:

```bash
openspec config profile
openspec update
```

## Modelli di Flusso di Lavoro (Modalità Espansa)

### Funzionalità Rapida

Quando sai cosa vuoi costruire e hai solo bisogno di eseguire:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Esempio di conversazione:**

```text
Tu: /opsx:new add-logout-button

AI:  Creata openspec/changes/add-logout-button/
     Pronto per creare: proposta

Tu: /opsx:ff

AI:  Creazione di tutti gli artefatti di pianificazione...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Pronto per l'implementazione!

Tu: /opsx:apply

AI:  Esecuzione dei task...
     ✓ Aggiunto il pulsante di logout all'header
     ✓ Implementata la cancellazione della sessione
     ✓ Aggiunta la finestra di dialogo di conferma
     Tutti i task completati!

Tu: /opsx:archive

AI:  ✓ Specifiche unite
     ✓ Modifica archiviata
```

**Ideale per:** funzionalità di piccole e medie dimensioni, correzioni di bug, modifiche semplici.

### Esplorativo

Quando i requisiti non sono chiari o hai bisogno di fare un'indagine preliminare:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Esempio di conversazione:**

```text
Tu: /opsx:explore

AI:  Cosa vorresti esplorare?

Tu: Voglio migliorare le prestazioni di caricamento delle pagine ma non sono sicuro
     dove siano i colli di bottiglia.

AI:  Lasciami aiutare a indagare...
     [Analizza le dimensioni dei bundle, identifica query lente, esamina
     i pattern di rendering dei componenti]

     Ho trovato tre colli di bottiglia principali:
     1. Immagini grandi non ottimizzate
     2. Recupero dati sincrono in ProductList
     3. Re-render causati da modifiche al contesto

     Quale vorresti affrontare per primo?

Tu: Occupiamoci del problema del recupero dati.

Tu: /opsx:new optimize-product-list-fetching

AI:  Modifica creata. Pronto per creare: proposta

Tu: /opsx:continue

AI:  Creazione della proposta basata sulla nostra esplorazione...
     [Scrive la proposta incorporando le informazioni dell'indagine]

     Pronto per creare: specifiche, progettazione
     Cosa vorresti fare dopo?

Tu: /opsx:continue

AI:  Creazione delle specifiche...
```

**Ideale per:** ottimizzazione delle prestazioni, debug, decisioni architetturali, requisiti non chiari.

### Modifiche Parallele

Lavora su più modifiche alla volta:

```text
Modifica A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in corso)
                                         │
                                    cambio di contesto
                                         │
Modifica B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Esempio di conversazione:**

```text
Tu: Sto lavorando a add-dark-mode ma sono stato interrotto da una correzione di bug

Tu: /opsx:new fix-login-redirect

AI:  Creata openspec/changes/fix-login-redirect/

Tu: /opsx:ff

AI:  ✓ Artefatti di pianificazione creati

Tu: /opsx:apply

AI:  Lavoro su fix-login-redirect...
     [Implementa la correzione]
     Tutti i task completati!

Tu: /opsx:archive

AI:  ✓ fix-login-redirect archiviata

Tu: Torniamo alla modalità scura

Tu: /opsx:apply add-dark-mode

AI:  Ripresa di add-dark-mode...
     Riprendo dal task 2.3: Aggiorna Header...
```

**Ideale per:** flussi di lavoro paralleli, interruzioni urgenti, collaborazione di team.

Quando hai più modifiche completate, usa `/opsx:bulk-archive`:

```text
Tu: /opsx:bulk-archive

AI:  Trovate 3 modifiche completate:
     - add-dark-mode (tutti i task completati)
     - fix-login-redirect (tutti i task completati)
     - update-footer (tutti i task completati)

     Controllo dei conflitti tra specifiche...
     ⚠ add-dark-mode e update-footer modificano entrambe specs/ui/

     Analisi della codebase per risolvere...
     Entrambe le modifiche sono implementate. Verranno applicate in ordine cronologico.

     Archiviare tutte e 3 le modifiche?

Tu: Sì

AI:  ✓ add-dark-mode archiviata
     ✓ fix-login-redirect archiviata
     ✓ update-footer archiviata
     Specifiche unite in ordine: add-dark-mode → update-footer
```

L'archiviazione di gruppo rileva quando più modifiche interessano le stesse specifiche e risolve i conflitti verificando cosa è effettivamente implementato.

### Completare una Modifica

Il flusso di completamento consigliato:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              convalida          chiede conferma per sincronizzare
              l'implementazione     se necessario
```

#### Verifica: Controlla il tuo Lavoro

`/opsx:verify` convalida l'implementazione rispetto ai tuoi artefatti su tre dimensioni:

```text
Tu: /opsx:verify

AI:  Verifica di add-auth in corso...

     COMPLETEZZA
     ✓ Tutti i 12 task in tasks.md sono spuntati
     ✓ Tutti i requisiti nelle specifiche hanno il codice corrispondente
     ⚠ Scenario "Timeout sessione dopo inattività" non testato

     CORRETTEZZA
     ✓ L'implementazione corrisponde all'intento delle specifiche
     ✓ I casi limite degli scenari sono gestiti
     ✓ Gli stati di errore corrispondono alle definizioni delle specifiche

     COERENZA
     ✓ Le decisioni di progettazione sono riflesse nella struttura del codice
     ✓ Le convenzioni di naming sono coerenti con design.md
     ⚠ design.md menziona "basato su eventi" ma l'implementazione usa il polling

     RIEPILOGO
     ─────────────────────────────
     Problemi critici: 0
     Avvertimenti: 2
     Pronto per l'archiviazione: Sì (con avvertimenti)

     Raccomandazioni:
     1. Aggiungi un test per lo scenario di timeout sessione
     2. Valuta di refactorizzare per usare un approccio basato su eventi come progettato, o aggiorna design.md
```

**Cosa controlla la verifica:**

| Dimensione | Cosa convalida |
|------------|----------------|
| Completezza | Tutti i task completati, tutti i requisiti implementati, scenari coperti |
| Correttezza | L'implementazione corrisponde all'intento delle specifiche, casi limite gestiti |
| Coerenza | Le decisioni di progettazione sono riflesse nel codice, i pattern sono coerenti |

La verifica non bloccherà l'archiviazione, ma evidenzia i problemi che potresti voler risolvere prima.

#### Archivia: Finalizza la Modifica

`/opsx:archive` completa la modifica e la sposta nell'archivio:

```text
Tu: /opsx:archive

AI:  Archiviazione di add-auth in corso...

     Stato degli artefatti:
     ✓ proposal.md esiste
     ✓ specs/ esiste
     ✓ design.md esiste
     ✓ tasks.md esiste (12/12 task completati)

     Specifiche delta: Non ancora sincronizzate con main
     → Vuoi sincronizzare ora?

Tu: Sì

AI:  ✓ Specifiche sincronizzate in openspec/specs/auth/spec.md
     ✓ Spostata in openspec/changes/archive/2025-01-24-add-auth/

     Modifica archiviata correttamente.
```

L'archiviazione ti chiederà conferma se le specifiche non sono sincronizzate. Non si bloccherà per task incompleti, ma ti avviserà.

## Quando Usare Cosa

### `/opsx:ff` vs `/opsx:continue`

| Situazione | Usa |
|------------|-----|
| Requisiti chiari, pronto a costruire | `/opsx:ff` |
| In fase di esplorazione, vuoi rivedere ogni passaggio | `/opsx:continue` |
| Vuoi iterare sulla proposta prima delle specifiche | `/opsx:continue` |
| Pressione temporale, bisogno di procedere velocemente | `/opsx:ff` |
| Modifica complessa, vuoi avere il controllo | `/opsx:continue` |

**Regola pratica:** se puoi descrivere l'intero ambito in anticipo, usa `/opsx:ff`. Se lo stai definendo man mano che procedi, usa `/opsx:continue`.

### Quando Aggiornare o Iniziare da Zero

Una domanda comune: quando è accettabile aggiornare una modifica esistente e quando invece bisogna iniziarne una nuova?

**Aggiorna la modifica esistente quando:**

- Stesso intento, esecuzione perfezionata
- L'ambito si restringe (MVP prima, il resto dopo)
- Correzioni basate su nuove conoscenze (la codebase non è come te l'aspettavi)
- Modifiche di progettazione basate su scoperte durante l'implementazione

**Inizia una nuova modifica quando:**

- L'intento è cambiato fondamentalmente
- L'ambito è esploso in un lavoro completamente diverso
- La modifica originale può essere contrassegnata come "completata" autonomamente
- Le patch creerebbero più confusione che chiarezza

```text
                     ┌─────────────────────────────────────┐
                     │     Si tratta dello stesso lavoro?   │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Stesso intento?     Sovrapposizione >50%? La modifica originale
          Stesso problema?    Stesso ambito?       può essere "completata"
                 │                  │          senza queste modifiche?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      SÌ                NO SÌ            NO  NO              SÌ
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    AGGIORNA          NUOVA AGGIORNA    NUOVA AGGIORNA        NUOVA
```

**Esempio: "Aggiungi la modalità scura"**

- "Bisogna anche supportare temi personalizzati" → Nuova modifica (ambito esploso)
- "Il rilevamento delle preferenze di sistema è più difficile del previsto" → Aggiorna (stesso intento)
- "Spediamo prima l'interruttore, aggiungiamo le preferenze dopo" → Aggiorna, poi archivia, poi nuova modifica

## Buone Pratiche

### Mantieni le Modifiche Focalizzate

Un'unità di lavoro logica per modifica. Se stai facendo "aggiungi la funzionalità X e anche refactoring di Y", valuta di fare due modifiche separate.

**Perché è importante:**
- Più facile da revisionare e comprendere
- Cronologia di archiviazione più pulita
- Può essere rilasciata in modo indipendente
- Rollback più semplice se necessario

### Usa `/opsx:explore` per Requisiti Non Chiari

Prima di impegnarti in una modifica, esplora il dominio del problema:

```text
Tu: /opsx:explore

AI:  Cosa vorresti esplorare?

Tu: Come dovremmo gestire il rate limiting per la nostra API?

AI:  Lasciami investigare sulla tua configurazione attuale e sulle opzioni...
     [Ricerca nella codebase, valuta i pattern]

     Vedo tre approcci che potremmo adottare:
     1. Basato su middleware (semplice, per endpoint)
     2. Basato su Redis (scalabile, stato condiviso)
     3. Token bucket per utente (equo, complesso)

     La tua stack attuale suggerisce l'opzione 1 o 2. Qual è la tua scala?
```

L'esplorazione chiarisce le idee prima che tu crei gli artefatti.

### Verifica Prima di Archiviare

Usa `/opsx:verify` per verificare che l'implementazione corrisponda agli artefatti:

```text
Tu: /opsx:verify

AI:  Verifica di add-dark-mode in corso...

     ✓ Tutti i task in tasks.md sono spuntati
     ✓ I requisiti nelle specifiche hanno il codice corrispondente
     ✓ Le decisioni di progettazione sono riflesse nell'implementazione

     Pronto per l'archiviazione!
```

Rileva le discrepanze prima che tu chiuda la modifica.

### Dai Nomi Chiari alle Modifiche

Nomi chiari rendono utile `openspec list`:

| Corretto:                          | Da evitare:                  |
|------------------------------------|------------------------------|
| add-dark-mode                      | feature-1                    |
| fix-login-redirect                 | update                       |
| optimize-product-query             | changes                      |
| implement-2fa                      | wip                          |

## Riferimento rapido dei comandi

Per i dettagli completi dei comandi e le relative opzioni, consulta [Comandi](commands.md).

| Comando | Scopo | Quando usarlo |
|---------|-------|---------------|
| `/opsx:propose` | Crea modifiche + artefatti di pianificazione | Percorso predefinito veloce (profilo `core`) |
| `/opsx:explore` | Analizza le idee con l'IA | Inizia qui se non sei sicuro: requisiti poco chiari, indagini, confronto di opzioni |
| `/opsx:new` | Avvia una struttura di modifica | Modalità estesa, controllo esplicito degli artefatti |
| `/opsx:continue` | Crea il prossimo artefatto | Modalità estesa, creazione di artefatti passo passo |
| `/opsx:ff` | Crea tutti gli artefatti di pianificazione | Modalità estesa, ambito chiaro |
| `/opsx:apply` | Implementa le attività | Pronto per scrivere codice |
| `/opsx:verify` | Valida l'implementazione | Modalità estesa, prima dell'archiviazione |
| `/opsx:sync` | Unisci le specifiche delta | Modalità estesa, opzionale |
| `/opsx:archive` | Completa la modifica | Tutto il lavoro è terminato |
| `/opsx:bulk-archive` | Archivia modifiche multiple | Modalità estesa, lavoro parallelo |

## Prossimi passaggi

- [Scrittura di specifiche efficaci](writing-specs.md) - Cosa contraddistingue un requisito e uno scenario solidi, e come dimensionare correttamente una modifica
- [Revisione di una modifica](reviewing-changes.md) - Il controllo veloce di due minuti su un piano bozza prima di scrivere qualsiasi codice
- [OpenSpec in un team](team-workflow.md) - Come le modifiche si adattano a branch e pull request
- [Comandi](commands.md) - Riferimento completo dei comandi con opzioni
- [Concetti](concepts.md) - Approfondimento su specifiche, artefatti e schemi
- [Personalizzazione](customization.md) - Crea flussi di lavoro personalizzati