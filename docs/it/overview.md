# Concetti Fondamentali in Breve

**OpenSpec è uno strato di accordo leggero tra te e la tua IA.** Tu scrivi cosa dovrebbe fare una modifica, l'IA redige i dettagli, entrambi guardate lo stesso piano e solo allora viene scritto il codice. Questa pagina rappresenta l'intero modello mentale su un unico schermo. Se desideri la versione estesa, [Concepts](concepts.md) la contiene.

Ecco l'intera idea in cinque parole: **decidi prima, costruisci con fiducia.**

## Le cinque idee

Tutto ciò che riguarda OpenSpec è costruito su cinque concetti. Impara questi e il resto è dettaglio.

**1. Le Spec sono la verità.** Una spec descrive come funziona il tuo sistema *in questo momento*. Vive in `openspec/specs/`, organizzata per dominio (`auth/`, `payments/`, `ui/`). Le Spec sono composte da requisiti ("il sistema DEVE scadere le sessioni dopo 30 minuti") e scenari (esempi concreti di dato/quando/allora). Pensa alle spec come alla singola risposta concordata a "cosa fa questo software?".

**2. Una modifica è un'unità di lavoro.** Quando vuoi aggiungere, modificare o rimuovere un comportamento, crei una modifica: una cartella in `openspec/changes/` che contiene tutto su quel lavoro in un unico posto. Una proposta, un design, una lista di compiti e le modifiche alle spec. Una modifica, una cartella, una funzionalità.

**3. Le spec delta descrivono cosa sta cambiando, non il mondo intero.** All'interno di una modifica, tu non riscrivi l'intera spec. Scrivi invece un piccolo delta: `ADDED` questo requisito, `MODIFIED` quello, `REMOVED` quest'altro. Questo è l'ingegnoso dettaglio che rende OpenSpec bravo a modificare sistemi esistenti, non solo quelli nuovi. Tu descrivi la differenza (diff), non la destinazione.

**4. Gli artefatti si basano l'uno sull'altro.** Una modifica contiene alcuni documenti, creati in un ordine naturale, ognuno alimentando il successivo:

```text
proposal ──► specs ──► design ──► tasks ──► implement
   perché    cosa       come      passaggi  fai
```

Puoi rivedere qualsiasi elemento in qualsiasi momento. Sono facilitatori, non ostacoli. (Di più sotto.)

**5. L'archiviazione riporta la modifica alla verità.** Quando il lavoro è finito, archivi la modifica. Le sue spec delta si fondono nelle tue spec principali e la cartella della modifica viene spostata in `changes/archive/` con un timbro temporale. Ora le tue spec descrivono la nuova realtà e sei pronto per la prossima modifica. Il ciclo si chiude.

## Il quadro generale

```text
┌─────────────────────────────────────────────────────────────────┐
│                          openspec/                              │
│                                                                 │
│   ┌──────────────────┐         ┌──────────────────────────┐    │
│   │     specs/       │         │        changes/          │    │
│   │                  │ ◄─────  │                          │    │
│   │ fonte di verità │  merge  │ una cartella per modifica │    │
│   │ come funzionano │  su      │ proposta · design ·      │    │
│   │ oggi            │ archive │ task · spec delta        │    │
│   └──────────────────┘         └──────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Due cartelle. `specs/` è ciò che è vero. `changes/` è ciò che stai proponendo. L'archiviazione sposta una proposta nella verità.

## Il ciclo che userai effettivamente

Nella configurazione predefinita, la tua giornata lavorativa è così. Pensa prima in modo opzionale; poi un comando redige il piano con l'IA, tu lo leggi e aggiusti, il successivo lo costruisce e il ultimo li archivia.

```text
/opsx:explore                   →  (opzionale) pensaci prima con l'IA
/opsx:propose add-dark-mode     →  L'IA redige proposta, spec, design, task
        (tu leggi e aggiusti il piano)
/opsx:apply                     →  L'IA lo costruisce, spuntando i compiti
/opsx:archive                   →  spec aggiornate, modifica archiviata
```

**Quando hai dubbi, inizia esplorando.** `/opsx:explore` è un partner di pensiero senza rischi: legge il tuo codice, delinea le opzioni e trasforma un'idea vaga in un piano concreto prima che esista qualsiasi artefatto. È l'antidoto migliore per una IA che altrimenti costruirebbe *qualcosa* da un prompt poco chiaro. Sai già esattamente cosa vuoi? Vai direttamente a `/opsx:propose`. In ogni caso, esplorare è incluso nel profilo predefinito, quindi è sempre disponibile. Vedi la [Guida all'Esplorazione](explore.md).

Questi sono comandi slash, digitati nella chat del tuo assistente IA. L'impostazione (`openspec init`) avviene nel tuo terminale. Se questo passaggio ti è nuovo, leggi prima [Come Funzionano i Comandi](how-commands-work.md); è il punto di confusione più comune.

## "Facilitatori, non ostacoli"

Questa frase appare ovunque in OpenSpec, quindi ecco cosa significa in termini semplici.

I processi di spec tradizionali sono a cascata: finisci la pianificazione, *poi* sei autorizzato a implementare e tornare indietro è doloroso. OpenSpec rifiuta questo. L'ordine `proposal → specs → design → tasks` mostra ciò che diventa *possibile* dopo, non ciò che sei *costretto* a fare subito.

Scopri durante l'implementazione che il design era sbagliato? Modifica `design.md` e continua. Ti rendi conto che l'ambito dovrebbe ridursi? Aggiorna la proposta. Nulla è bloccato. Le dipendenze esistono solo affinché l'IA abbia il contesto di cui ha bisogno (non puoi scrivere buoni task senza spec su cui basarli), non per metterti in gabbia.

La forza qui risiede nell'onestà: il lavoro reale è disordinato e iterativo, e OpenSpec lo permette. Il compromesso è la disciplina: poiché nulla ti costringe ad andare avanti, spetta a te mantenere una modifica focalizzata anziché lasciarla espandere. La guida [Workflows](workflows.md) offre buone abitudini per questo.

## Perché questo vale il piccolo sforzo

Verità semplice: OpenSpec aggiunge un passaggio. Scrivi un breve piano prima di costruire. E cosa ottieni in cambio?

- **Prevedi gli errori prima che ti costino qualcosa.** Correggere un malinteso in una proposta di un paragrafo è gratuito. Correggere dopo che l'IA ha scritto 400 righe è molto più costoso.
- **Il piano e il codice rimangono nello stesso repo.** Sei sei mesi dopo, la spec ti dice (e alla prossima sessione IA) perché il sistema funziona nel modo in cui lo fa.
- **Le modifiche sono rivedibili.** Una cartella di modifica è un pacchetto ordinato: leggi la proposta, scorri i delta, controlla i task. Niente archeologia attraverso la cronologia della chat.
- **Si adatta alle codebase esistenti.** I Delta significano che puoi specificare una modifica a un'app da 50.000 righe senza prima documentarla interamente.

E il compromesso onesto: per una correzione veramente banale di una riga, la cerimonia potrebbe non valere la pena, e va bene così. OpenSpec è progettato per essere leggero, ma non è gratuito. Usalo dove l'accordo è importante, che si scopre essere quasi sempre vero quando lavori con un'IA che costruirà con fiducia qualunque cosa tu abbia vagamente chiesto.

## Dove andare dopo

- Sei nuovo? [Getting Started](getting-started.md) ti guida attraverso la prima modifica in dettaglio.
- Non sei sicuro di cosa costruire ancora? [Explore First](explore.md) è il posto giusto per iniziare.
- Sei confuso su dove vengono eseguiti i comandi? [How Commands Work](how-commands-work.md).
- Vuoi la versione approfondita di tutto ciò che è stato detto sopra? [Concepts](concepts.md).
- Imparare facendo? [Examples & Recipes](examples.md).
- Hai bisogno di definire un termine? [Glossary](glossary.md).