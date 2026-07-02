# Esempi e Ricette

Cambiamenti reali, dall'inizio alla fine. Ogni ricetta mostra i comandi che dovresti digitare e cosa vedresti in risposta, così puoi abbinare la tua situazione a un modello e copiarlo. Questi utilizzano i comandi predefiniti **core** (`propose`, `explore`, `apply`, `sync`, `archive`); dove l'insieme ampliato è utile, viene segnalato.

Un promemoria prima di iniziare: i comandi slash come `/opsx:propose` vanno nella chat del tuo **AI assistant**, e i comandi `openspec` vanno nel tuo **terminale**. Se non sei abituato, leggi prima [Come funzionano i Comandi](how-commands-work.md). Nelle trascrizioni sottostanti, `You:` e `AI:` sono la chat, e le righe che iniziano con `$` sono il terminale.

> **Non sei sicuro di cosa stai costruendo?** La maggior parte di queste ricette è più chiara se inizi con `/opsx:explore` per rifletterci prima. [Recipe 3](#recipe-3-exploring-before-you-commit) lo mostra in azione, e la guida [Explore First](explore.md) ne spiega tutto.

## Recipe 1: Una piccola funzionalità, il percorso veloce

**Quando usarla:** sai cosa vuoi e si tratta di un pezzo di lavoro circoscritto. Questa è la ricetta più comune.

L'intero processo consiste in tre comandi. Proporre, costruire, archiviare.

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

Ora leggi il piano. Apri la proposta e lo spec delta. Questo è il momento per cui OpenSpec è stato creato: catturare un'assunzione sbagliata mentre è ancora un paragrafo, non 400 righe di codice. Modifica qualsiasi artefatto direttamente se qualcosa non va, quindi continua.

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

È tutto. Il comportamento di logout fa ora parte delle tue specifiche, e la modifica è archiviata con il suo contesto completo.

## Recipe 2: Una correzione di un bug

**Quando usarla:** qualcosa è rotto e vuoi che la correzione sia registrata come un cambiamento deliberato del comportamento, non come un commit misterioso.

Le correzioni di bug funzionano esattamente come le funzionalità. La differenza sta nel modo in cui formuli la proposta: descrivi il comportamento *corretto*, non solo "aggiusta il bug".

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

Poiché la correzione viene registrata come un requisito `MODIFIED` con uno scenario fresco, la persona successiva (o la prossima sessione AI) vede non solo che l'hai risolta, ma cosa significa "corretto". Poi `/opsx:apply` e `/opsx:archive` come al solito.

Suggerimento: per una correzione, uno scenario valido è il test di regressione in prosa. "GIVEN un utente disconnesso, WHEN invia credenziali valide, THEN atterra sulla dashboard e non viene reindirizzato di nuovo." Scrivilo, e l'implementazione avrà un obiettivo chiaro.

## Recipe 3: Esplorare prima di impegnarsi

**Quando usarla:** hai un problema ma non ancora un piano. Non sei sicuro cosa costruire o quale approccio sia il giusto.

Inizia con `/opsx:explore`. È un partner di riflessione senza struttura e senza artefatti creati. Legge la tua codebase e ti aiuta a decidere.

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

L'esplorazione chiarisce il tuo pensiero *prima* di dedicare un cambiamento ad esso. Quando l'intuizione si cristallizza, proponi e l'AI porta avanti il contesto.

## Recipe 4: Gestire due cambiamenti contemporaneamente

**Quando usarla:** sei nel mezzo di una funzionalità e una correzione urgente salta la coda.

I cambiamenti sono cartelle indipendenti, quindi il lavoro parallelo non crea conflitti. Avvia la correzione, rilasciala, poi torna alla funzionalità esattamente da dove avevi smesso.

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

Nominare il cambiamento in `/opsx:apply add-dark-mode` è come indirizzare l'AI a un cambiamento specifico quando ce ne sono più di uno attivi. Poiché i compiti tracciano il completamento in `tasks.md`, l'AI sa esattamente dove hai smesso.

Quando diversi cambiamenti vengono eseguiti contemporaneamente, il comando ampliato `/opsx:bulk-archive` li archivia insieme e risolve i conflitti di spec controllando cosa è effettivamente implementato. Vedi [Workflows](workflows.md#parallel-changes).

## Recipe 5: Un refactoring senza cambiamento di comportamento

**Quando usarla:** stai ristrutturando codice e il comportamento visibile esternamente deve rimanere identico.

Questo è il caso interessante, perché un refactor puro *non ha nulla da aggiungere alle tue specifiche*. Il contratto comportamentale non cambia; solo l'implementazione lo fa. Quindi il lavoro risiede nel design e nei compiti, e lo spec delta è vuoto o assente.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

Quando archivi un cambiamento che non tocca le specifiche, puoi dire al comando del terminale di saltare il passaggio delle specifiche:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

La stessa flag è utile per gli strumenti, CI e i cambiamenti solo documentali. Il principio è questo: le specifiche descrivono il comportamento, quindi se il comportamento non è cambiato, nemmeno la specifica dovrebbe esserlo. Vedi [Concepts](concepts.md#what-a-spec-is-and-is-not).

## Recipe 6: Controllo passo dopo passo (comandi ampliati)

**Quando usarla:** un cambiamento complesso o rischioso in cui vuoi rivedere ogni artefatto prima di passare al successivo.

Il `/opsx:propose` core prepara tutto in una volta sola. Quando preferisci procedere un passo alla volta, attiva i comandi ampliati:

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

Ora puoi creare e costruire incrementalmente:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

Rivedi ogni artefatto mentre viene creato, modifica liberamente e continua quando sei soddisfatto. Quando vuoi che il resto venga preparato in una volta sola, `/opsx:ff` fa un fast-forward attraverso gli artefatti di pianificazione rimanenti. Prima di archiviare, `/opsx:verify` controlla che l'implementazione corrisponda effettivamente alle specifiche. Vedi [Workflows](workflows.md#opsxff-vs-opsxcontinue).

## Recipe 7: Imparare l'intero ciclo in pratica

**Quando usarla:** hai installato OpenSpec e vuoi *sentire* il flusso di lavoro sul tuo codice, non su un esempio giocattolo.

Attiva i comandi ampliati (vedi Recipe 6), quindi:

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` trova un miglioramento reale (piccolo), crea un cambiamento per esso, lo implementa e lo archivia, narrando ogni passo. Richiede da 15 a 30 minuti e ti lascia con un cambiamento reale che puoi conservare o scartare. È il modo più delicato per imparare. Vedi [Commands](commands.md#opsxonboard).

## Controllare il proprio lavoro dal terminale

In qualsiasi momento, dal tuo terminale, puoi ispezionare lo stato delle cose:

```bash
$ openspec list                      # changes attivi
$ openspec show add-dark-mode        # un cambiamento in dettaglio
$ openspec validate add-dark-mode    # controllo della struttura
$ openspec view                      # dashboard interattiva
```

Questi sono strumenti di lettura e ispezione. La proposta e la costruzione avvengono ancora tramite comandi slash nella chat. Dettagli completi nel [CLI reference](cli.md).

## Dove andare dopo

- [Explore First](explore.md): il modo consigliato per iniziare quando non si è sicuri
- [Workflows](workflows.md): i modelli sopra descritti, con guida decisionale su quando usare ciascuno di essi
- [Commands](commands.md): ogni comando slash in dettaglio
- [Getting Started](getting-started.md): la guida canonica per il primo cambiamento
- [Concepts](concepts.md): perché i pezzi si adattano l'uno all'altro