# Revisionare una modifica

La promessa fondamentale di OpenSpec è che tu e la tua AI **concordiate cosa costruire prima che venga scritto qualsiasi codice.** Questo accordo ha senso solo se leggi effettivamente ciò che l'AI ha abbozzato. Questa pagina riguarda quei due minuti in cui lo fai — cosa aprire, in che ordine e cosa cercare.

La scommessa è semplice: individuare un errore di rotta in un piano di un solo paragrafo è quasi senza costo. Individuare lo stesso errore in 300 righe di codice non lo è. La revisione è dove incassi questa scommessa.

## I due momenti in cui revisioni

Ce ne sono esattamente due:

```
/opsx:propose ──► REVISIONA IL PIANO ──► /opsx:apply ──► REVISIONA IL CODICE ──► /opsx:archive
                  (prima di qualsiasi codice)                    (/opsx:verify)
```

1. **Dopo `/opsx:propose`** (o `/opsx:ff`), prima di `/opsx:apply` — leggi il piano mentre è ancora solo testo.
2. **Dopo la costruzione**, con `/opsx:verify` — verifica che il codice abbia effettivamente fatto quanto indicato dal piano.

La prima revisione è quella che ti fa risparmiare di più, e anche quella che tutti saltano. Questa pagina dedica la maggior parte del tempo a questa.

## Leggilo in questo ordine

Una modifica è una cartella di Markdown semplice in `openspec/changes/<name>/`. Leggi i file nell'ordine che ti permette di interrompere prima se qualcosa non va:

```
openspec/changes/add-dark-mode/
├── proposal.md      1. l'intento e l'ambito   ← se questo è sbagliato, interrompi qui
├── specs/…/spec.md  2. i requisiti       ← il cuore della revisione
├── design.md        (solo per modifiche più grandi) — l'approccio tecnico
└── tasks.md         3. il piano di lavoro
```

Non devi leggere ogni riga. Devi rispondere a tre domande, una per ogni file.

## La proposta: è questo il problema giusto?

Apri `proposal.md` per primo. Cattura il "perché" e il "cosa" — l'intento, l'ambito, l'approccio in uno o due paragrafi.

**Come si presenta un risultato valido:** un intento chiaro, un ambito che riconosci e un motivo per cui vale la pena farlo adesso.

**Segnali di allarme:**

- Risolve un problema leggermente *diverso* da quello che hai richiesto.
- L'ambito si è ampliato: hai chiesto un interruttore per il tema e la proposta tocca anche l'autenticazione "mentre siamo lì".
- È vago. "Migliora la pagina delle impostazioni" non è un ambito; "aggiungi un interruttore per la modalità scura che rispetti le preferenze del sistema operativo" lo è.

**La domanda a cui rispondere:** *Corrisponde a quello che ho effettivamente richiesto, e non si sta introducendo nient'altro di nascosto?* Se la risposta è no, interrompi — non leggere oltre, correggi la proposta (vedi [Respingere è economico](#respingere-e-economico)).

## Le delta delle specifiche: la definizione di "finito" è corretta?

Questo è il cuore della revisione. Le delta delle specifiche in `specs/` indicano cosa sarà *vero* quando la modifica viene rilasciata — sotto forma di requisiti e di scenari che li dimostrano:

```markdown
## ADDED Requirements

### Requirement: Dark Mode Toggle
The system SHALL let a user switch between light and dark themes.

#### Scenario: Respects the OS preference on first load
- GIVEN a user who has never set a theme
- WHEN they open the app on a device set to dark mode
- THEN the app renders in dark mode
```

**Come si presenta un requisito valido:** un'affermazione chiara con `SHALL`/`MUST` che potresti consegnare a un tester, e almeno uno scenario il cui GIVEN/WHEN/THEN eserciti effettivamente tale affermazione.

**Segnali di allarme:**

- **Un requisito vago.** "Il sistema SHALL essere veloce" non può essere costruito o testato. Cosa si intende per veloce?
- **Un requisito senza scenario**, o uno scenario che non testa il requisito a cui è associato.
- **La cosa più preziosa da individuare: ciò che manca.** L'AI scrive fedelmente quello che *hai detto*. Il tuo lavoro è notare quello che ti sei *dimenticato* di dire. Se ti importava soprattutto del caso delle preferenze del sistema operativo e nessuno scenario lo menziona, è la revisione che si ripaga da sola.

Leggi le delta chiedendoti *sarei felice se il sistema facesse esattamente — e solo — questo?* Qui non si parla ancora di codice, quindi modificare è ancora economico.

## Le attività: il piano di lavoro è sensato?

Apri `tasks.md` per ultimo. È la lista di controllo dell'implementazione che l'AI seguirà.

**Come si presenta un risultato valido:** passaggi ordinati, ognuno ricollegabile a un requisito, niente di misterioso.

**Segnali di allarme:**

- Un'attività senza un requisito corrispondente (da dove viene?).
- Un'unica enorme attività "implementa la funzionalità" che nasconde tutte le decisioni reali.
- Un'attività che tocca qualcosa al di fuori dell'ambito che hai appena approvato.

Qui non stai facendo stime o micromanagement — stai verificando che il piano corrisponda ai requisiti che hai già accettato.

## Respingere è economico

Se una delle tre domande ha avuto risposta negativa, dillo. Non ci sono fasi e niente è bloccato — lo correggi e procedi. Due modi, esattamente come in [Modificare una modifica](editing-changes.md):

- **Modifica il file tu stesso.** È Markdown semplice; cambia la riga dell'ambito, rendi più preciso un requisito, elimina un'attività.
- **Indica all'AI cosa non va** e lascia che lo corregga: *"rimuovi le modifiche all'autenticazione — fuori dall'ambito,"* *"aggiungi uno scenario per quando l'utente ha già scelto un tema,"* *"dividi l'attività 3 in schema e UI."*

Poi rileggi la parte che hai modificato. Riscrivi l'abbozzo finché non è un piano che puoi firmare. Quello scambio *è* il prodotto che funziona.

## Dopo il codice: verifica

Una volta che il lavoro è stato costruito, `/opsx:verify` è la tua seconda revisione. Rilegge gli artefatti e il codice e riporta le discrepanze su tre dimensioni:

| Dimensione | Cosa controlla |
|-----------|----------------|
| **Completezza** | Ogni attività completata, ogni requisito implementato, scenari coperti |
| **Correttezza** | L'implementazione corrisponde all'intento della specifica, casi limite gestiti |
| **Coerenza** | Le decisioni di progettazione sono effettivamente presenti nel codice |

```
Tu: /opsx:verify

IA:  Verifica di add-dark-mode...

     COMPLETEZZA
     ✓ Tutte le 8 attività in tasks.md sono state controllate
     ✓ Tutti i requisiti in specs hanno codice corrispondente
     ⚠ Lo scenario "Rispetta le preferenze del sistema operativo al primo avvio" non ha copertura di test
```

Segnala i problemi come CRITICO, AVVISO o SUGGERIMENTO, e **non** blocca l'archiviazione: riporta le lacune e lascia la decisione a te. Questa è la differenza tra "l'AI ha scritto codice" e "ha costruito quello che abbiamo concordato."

`/opsx:verify` è nel profilo esteso. Se non lo hai, attivalo con `openspec config profile` (poi `openspec update`), o rileggi semplicemente tu stesso la modifica e il diff.

## Dimensiona la revisione correttamente

Non ogni modifica merita il controllo completo. La correzione di un errore di battitura in un solo file merita una rapida occhiata di venti secondi. Una modifica che tocca l'autenticazione, i pagamenti o dati che non puoi recuperare merita tutte le domande sopra. Il punto non è mai la formalità: si tratta di dedicare la tua attenzione dove un errore sarebbe costoso, e sfogliare velocemente dove non lo sarebbe.

## La lista di controllo di due minuti

- [ ] L'intento della proposta corrisponde a quello che ho richiesto.
- [ ] Non è stato introdotto niente di extra nell'ambito.
- [ ] Ogni requisito è sufficientemente specifico per essere testato.
- [ ] Ogni requisito ha uno scenario che lo esercita effettivamente.
- [ ] Il caso che mi interessa di più è coperto.
- [ ] Le attività sono mappate ai requisiti; niente è misterioso o fuori dall'ambito.
- [ ] Sarei a mio agio se l'AI costruisse esattamente questo e nient'altro.

Se tutti e sette i punti sono superati, esegui `/opsx:apply` con sicurezza. Se anche solo uno fallisce, non è un passo indietro: sono i due minuti che fanno il loro lavoro.

## Dove andare dopo

- [Scrivere buone specifiche](writing-specs.md) — l'altro lato della medaglia: come abbozzare requisiti e scenari che vale la pena approvare.
- [Modificare e iterare su una modifica](editing-changes.md) — la meccanica per cambiare un piano dopo aver iniziato.
- [Flussi di lavoro](workflows.md) — dove la revisione si inserisce nel ciclo più ampio.