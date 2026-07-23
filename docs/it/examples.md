# Esempi e Ricette

Modifiche reali, dall'inizio alla fine. Ogni ricetta mostra i comandi che digiteresti e quello che vedresti come risposta, così puoi abbinare la tua situazione a un modello e copiarlo. Queste ricette usano i comandi **core** predefiniti (`propose`, `explore`, `apply`, `sync`, `archive`); dove il set esteso è utile, viene indicato.

Un promemoria prima di iniziare: i comandi slash come `/opsx:propose` vanno inseriti nella **chat del tuo assistente AI**, mentre i comandi `openspec` vanno inseriti nel **terminale**. Se questo è nuovo per te, leggi prima [Come funzionano i comandi](how-commands-work.md). Nelle trascrizioni qui sotto, `You:` e `AI:` corrispondono alla chat, e le righe che iniziano con `$` corrispondono al terminale.

> **Non sei ancora sicuro di cosa stai costruendo?** La maggior parte di queste ricette è più efficace se inizi con `/opsx:explore` per pensarci prima. La [Ricetta 3](#recipe-3-exploring-before-you-commit) lo mostra in azione, e la guida [Esplora prima](explore.md) espone il caso completo.

## Ricetta 1: Una funzionalità piccola, il percorso veloce

**Quando usarla:** sai cosa vuoi, e si tratta di un lavoro circoscritto. Questa è la ricetta più comune.

Tutto si riduce a tre comandi: Propose, Build, Archive.

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — motivo e descrizione
     ✓ specs/      — il nuovo requisito e i suoi scenari
     ✓ design.md   — approccio tecnico
     ✓ tasks.md    — elenco di controllo per l'implementazione
     Ready for implementation. Run /opsx:apply.
```

Ora leggi il piano. Apri la proposta e la delta delle specifiche. Questo è il momento per cui OpenSpec è stato progettato: catturare un'assunzione sbagliata mentre è ancora un solo paragrafo, non 400 righe di codice. Modifica direttamente qualsiasi artefatto se qualcosa non va, poi continua.

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Add logout button to header
     ✓ 1.2 Clear session on click
     ✓ 1.3 Add confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  Archiving add-logout-button...
     ✓ Merged specs into openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2026-06-22-add-logout-button/
     Done. Ready for the next change.
```

Tutto qui. Il comportamento di logout fa ora parte delle tue specifiche, e la modifica è archiviata con tutto il suo contesto.

## Ricetta 2: Una correzione di bug

**Quando usarla:** qualcosa non funziona e vuoi che la correzione venga registrata come una modifica deliberata al comportamento, non come un commit misterioso.

Le correzioni di bug funzionano esattamente come le funzionalità. La differenza è in come strutturi la proposta: descrivi il comportamento *corretto*, non solo «correggi il bug».

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

Poiché la correzione viene implementata come requisito `MODIFIED` con un nuovo scenario, la persona successiva (o la sessione AI successiva) vede non solo che l'hai corretta, ma anche cosa significa «corretto». Poi esegui `/opsx:apply` e `/opsx:archive` come di consueto.

Consiglio: per una correzione, uno scenario valido è il test di regressione in prosa. «DATO un utente disconnesso, QUANDO invia credenziali valide, ALLORA atterra sulla dashboard e non viene reindirizzato di nuovo.» Scrivi quello, e l'implementazione avrà un obiettivo chiaro.

## Ricetta 3: Esplorare prima di impegnarsi

**Quando usarla:** hai un problema ma non ancora un piano. Non sei sicuro di cosa costruire, o quale approccio sia corretto.

Inizia con `/opsx:explore`. È un partner di pensiero senza struttura e senza artefatti creati. Legge la tua base di codice e ti aiuta a decidere.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Page loads feel slow but I don't know where the time goes.

AI:  Let me look... I found three likely culprits:
     1. Large unoptimized images on the product list
     2. Synchronous data fetching that blocks render
     3. Re-renders triggered by context changes
     Which should we tackle first?

You: The data fetching one.

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation.
```

L'esplorazione chiarisce il tuo pensiero *prima* di spendere una modifica per questo. Quando l'intuizione si cristallizza, proponi, e l'AI porta avanti il contesto.

## Ricetta 4: Gestire due modifiche contemporaneamente

**Quando usarla:** sei nel mezzo di una funzionalità e una correzione urgente salta la coda.

Le modifiche sono cartelle indipendenti, quindi il lavoro parallelo non crea conflitti. Inizia la correzione, pubblicala, poi torna alla funzionalità esattamente da dove l'avevi lasciata.

```text
You: I'm partway through add-dark-mode, but I need to fix a login bug now.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Ready for implementation.

You: /opsx:apply

AI:  Implemented the fix. All tasks complete.

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect.

You: Back to dark mode.

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode. Picking up at task 2.3: Update Header...
```

Indicare il nome della modifica in `/opsx:apply add-dark-mode` è il modo per indicare all'AI una modifica specifica quando ce ne sono più di una attive. Poiché i task tracciano il completamento in `tasks.md`, l'AI sa esattamente dove ti sei fermato.

Quando diverse modifiche vengono completate contemporaneamente, il comando esteso `/opsx:bulk-archive` le archivia insieme e risolve i conflitti tra le specifiche controllando cosa è stato effettivamente implementato. Vedi [Flussi di lavoro](workflows.md#parallel-changes).

## Ricetta 5: Un rifattorizzazione senza modifiche al comportamento

**Quando usarlo:** stai ristrutturando il codice, e il comportamento visibile dall'esterno deve rimanere identico.

Questo è il caso interessante, perché un rifattorizzazione puro non ha *nulla da aggiungere alle tue specifiche*. Il contratto di comportamento non cambia; cambia solo l'implementazione. Quindi il lavoro risiede nel design e nei task, e la delta delle specifiche è vuota o assente.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

Dichiara esplicitamente la delta vuota impostando `skip_specs: true` nel file `.openspec.yaml` della modifica:

```yaml
schema: spec-driven
skip_specs: true
```

Senza l'indicatore, `openspec validate` rifiuta una modifica con zero delta (in modo che una fase di specifiche dimenticata venga comunque rilevata); con l'indicatore, la validazione passa e `openspec status` mostra la fase delle specifiche come esplicitamente saltata invece che in sospeso. Se il rifattorizzazione si rivela modificare il comportamento dopo tutto, rimuovi `skip_specs` da `.openspec.yaml` e scrivi le delta delle specifiche — la validazione considera l'indicatore più i file delle specifiche come un conflitto, quindi l'indicatore obsoleto non può rimanere silenziosamente.

Archiviare una modifica contrassegnata non richiede flag aggiuntivi (non ci sono delta da unire). Indipendentemente da ciò, il flag `--skip-specs` indica al comando del terminale di saltare esplicitamente la fase delle specifiche:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

Lo stesso flag è utile per strumenti, CI e modifiche solo alla documentazione. Il principio: le specifiche descrivono il comportamento, quindi se il comportamento non è cambiato, neanche la specifica dovrebbe cambiare. Vedi [Concetti](concepts.md#what-a-spec-is-and-is-not).

## Ricetta 6: Controllo passo passo (comandi estesi)

**Quando usarla:** una modifica complessa o rischiosa per la quale vuoi rivedere ogni artefatto prima di procedere.

Il comando core `/opsx:propose` crea una bozza di tutto in una sola volta. Quando preferisci andare un passo alla volta, attiva i comandi estesi:

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

Ora puoi creare la struttura e costruire incrementalmente:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

Rivedi ogni artefatto man mano che viene creato, modificalo liberamente e procedi quando sei soddisfatto. Quando vuoi che il resto venga abbozzato in una sola volta, `/opsx:ff` salta velocemente tutti gli artefatti di pianificazione rimanenti. Prima di archiviare, `/opsx:verify` controlla che l'implementazione corrisponda effettivamente alle specifiche. Vedi [Flussi di lavoro](workflows.md#opsxff-vs-opsxcontinue).

## Ricetta 7: Imparare l'intero ciclo in modo pratico

**Quando usarla:** hai installato OpenSpec e vuoi *sperimentare* il flusso di lavoro sul tuo codice, non su un esempio dimostrativo.

Attiva i comandi estesi (vedi Ricetta 6), poi:

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` trova un miglioramento reale (piccolo), crea una modifica per questo, la implementa e la archivia, narrando ogni passo. Richiede da 15 a 30 minuti e ti lascia con una modifica reale che puoi mantenere o scartare. È il modo più semplice per imparare. Vedi [Comandi](commands.md#opsxonboard).

## Controllare il tuo lavoro dal terminale

In qualsiasi momento, dal tuo terminale, puoi controllare lo stato delle cose:

```bash
$ openspec list                      # active changes
$ openspec show add-dark-mode        # one change in detail
$ openspec validate add-dark-mode    # check structure
$ openspec view                      # interactive dashboard
```

Questi sono strumenti di sola lettura e ispezione. La proposta e la costruzione avvengono comunque tramite comandi slash nella chat. Dettagli completi nel [Riferimento CLI](cli.md).

## Dove andare dopo

- [Esplora prima](explore.md): il modo consigliato per iniziare quando non sei sicuro
- [Flussi di lavoro](workflows.md): i modelli sopra, con indicazioni decisionali su quando usare ciascuno
- [Comandi](commands.md): tutti i comandi slash nel dettaglio
- [Per iniziare](getting-started.md): la guida canonica per la prima modifica
- [Concetti](concepts.md): il motivo per cui i componenti si adattano tra loro in questo modo