# Modifica e iterazione di una modifica

**Ogni artefatto di una modifica è semplicemente un file Markdown che puoi modificare in qualsiasi momento.** Non esiste una "fase di pianificazione" bloccata, nessun gate di approvazione, nessuna modalità di modifica speciale da attivare. Vuoi modificare la proposta dopo aver iniziato la costruzione? Apri `proposal.md` e modificala. Ti accorgi che il design è sbagliato a metà dell'implementazione? Correggi `design.md` e continua. Questa è tutta la risposta, ed è una scelta di progettazione.

Questa pagina è per il momento in cui pensi "aspetta, posso tornare indietro e modificare quello?". Sì. Ecco come fare, per ogni caso comune.

## Due modi per modificare qualsiasi cosa

Hai sempre entrambe le opzioni:

1. **Modifica il file direttamente.** Gli artefatti sono semplici file Markdown in `openspec/changes/<name>/`. Apri `proposal.md`, `design.md`, `tasks.md` o una specifica delta nella cartella `specs/` con il tuo editor e modificala. Non è richiesto nient'altro.

2. **Chiedi alla tua AI di revisionarlo.** In chat, basta dire cosa vuoi: "Aggiorna la proposta per rimuovere l'idea della cache e aggiungi una sezione sul rate-limit", oppure "il design deve usare una coda, non il polling". L'AI modifica l'artefatto per te, usando il resto della modifica come contesto.

Usa quella che si adatta al momento. Piccola modifica alla formulazione? Modifica il file. Ripensamento sostanziale? Lascia che l'AI revisioni con tutto il contesto.

## "Come posso aggiornare la proposta (o le specifiche) dopo aver iniziato?"

Basta aggiornarla. Stessa modifica, perfezionata.

Se stai usando i comandi estesi, il flusso naturale è: modifica l'artefatto, poi esegui `/opsx:continue` per riprendere dal nuovo stato, o `/opsx:apply` per continuare l'implementazione in base al piano aggiornato. Se stai usando i comandi `core` predefiniti, modifica l'artefatto ed esegui `/opsx:apply`; legge i file correnti, quindi costruisce in base a quello che dicono ora gli artefatti.

Il modello mentale: gli artefatti sono il piano in tempo reale, non un contratto firmato. L'AI lavora sempre in base al loro contenuto corrente, quindi modificarli indirizza il lavoro.

```text
Tu: Voglio modificare l'approccio in questa modifica.

Tu: [modifica design.md, o dì all'AI:]
     Aggiorna design.md per usare un job in background invece di una chiamata sincrona.

AI:  design.md aggiornato. La lista delle attività si adatta ancora; vuoi che continui l'applicazione?

Tu: /opsx:apply
```

Questo risponde a una domanda molto comune: non esiste un comando separato "aggiorna proposta" perché non ne hai bisogno. Il file è la fonte di verità, e modificarlo (a mano o tramite l'AI) è l'aggiornamento.

## "Come posso tornare indietro a fare la review dopo l'implementazione?"

Non devi "tornare indietro", perché non te ne sei mai andato. Il flusso di lavoro è fluido: review, modifica e implementazione non sono fasi sequenziali da cui sei intrappolato.

Concretamente, dopo un po' di lavoro con `/opsx:apply`:

- Vuoi riesaminare il piano? Apri gli artefatti e leggili, oppure esegui `openspec show <modifica>` nel tuo terminale per una vista consolidata.
- Hai trovato qualcosa da modificare? Modifica l'artefatto (o chiedi all'AI di farlo), poi continua.
- Vuoi un controllo strutturato per verificare che il codice corrisponda al piano? Esegui `/opsx:verify` (comando esteso). Riporta completezza, correttezza e coerenza senza bloccare nulla. Vedi [Workflows: Verify](workflows.md#verify-check-your-work).

Non esiste una "fase di review" a cui tornare, perché la review è qualcosa che puoi fare in qualsiasi momento, anche dopo l'implementazione.

## "Ho modificato il codice a mano. Come posso riconciliarlo con OpenSpec?"

Succede costantemente e non è un problema. Hai modificato qualcosa nel tuo editor, e ora codice e artefatti non corrispondono. Riconciliali nella direzione corretta:

- **Il codice è ora corretto, la specifica è obsoleta.** Aggiorna la specifica delta (e le attività, se pertinente) per descrivere il comportamento che hai effettivamente rilasciato. La specifica deve corrispondere alla realtà prima di archiviare, perché l'archiviazione unisce la specifica alla tua fonte di verità.
- **La specifica è corretta, il codice si è discostato.** Continua a costruire o correggere finché il codice non corrisponde alla specifica.

Un modo veloce per individuare le discrepanze è `/opsx:verify`: legge i tuoi artefatti e il tuo codice e ti dice dove divergono. Considera il suo output come una lista di cose da fare per la riconciliazione, poi archivia una volta che corrispondono.

Il principio: al momento dell'archiviazione, le tue specifiche diventano la verità ufficiale. Quindi prima di archiviare, rendi le specifiche oneste rispetto a quello che fa il codice. Le modifiche manuali sono benvenute; non lasciare che desincronizzino la specifica in silenzio.

## Perfezionare una proposta che non ti soddisfa

Se una proposta generata non centra l'obiettivo, hai tre mosse valide:

- **Itera sul posto.** Dì all'AI cosa non va ("l'ambito è troppo ampio, rimuovi le funzionalità di amministrazione") e lascia che la revisioni. È la soluzione più economica e di solito è quella giusta.
- **Esplora prima, poi riproponi.** Se il problema è che l'idea stessa non è chiara, fai un passo indietro con `/opsx:explore`, ragionaci sopra, e lascia che ne esca una proposta più precisa. Vedi [Esplora prima](explore.md).
- **Ricomincia da zero.** Se l'intento è cambiato fondamentalmente, una nuova modifica può essere più chiara che modificare la vecchia.

L'ultima mossa ha la sua guida decisionale, qui sotto.

## Quando aggiornare vs. iniziare una nuova modifica

Versione breve: **aggiorna quando si tratta dello stesso lavoro perfezionato; inizia una nuova modifica quando l'intento è cambiato fondamentalmente o l'ambito si è espanso in un lavoro diverso.**

- Stesso obiettivo, approccio migliore? Aggiorna.
- Restringimento dell'ambito (rilascia l'MVP ora, il resto dopo)? Aggiorna, poi archivia, poi una nuova modifica per la seconda fase.
- Il problema stesso è cambiato ("aggiungi la modalità scura" è diventato "costruisci un sistema di temi completo")? Nuova modifica.

Puoi trovare un diagramma di flusso completo e esempi svolti in [Workflows: Quando aggiornare vs. ricominciare da zero](workflows.md#when-to-update-vs-start-fresh) e un trattamento più approfondito in [OPSX: Quando aggiornare vs. ricominciare da zero](opsx.md#when-to-update-vs-start-fresh).

## Una nota sulle attività

`tasks.md` è una lista di controllo dinamica, non un piano congelato. Durante l'implementazione, puoi aggiungere attività che scopri, rimuovere quelle che si sono rivelate non necessarie, o riordinarle. L'AI spunta le voci man mano che le completa durante `/opsx:apply`, e riprende dalla prima attività non spuntata se torni in un secondo momento. Modificare la lista durante il lavoro è previsto.

## Dove andare dopo

- [Workflows](workflows.md) - pattern, oltre alla guida decisionale aggiorna-vs-nuovo
- [Reviewing a Change](reviewing-changes.md) - la revisione di due minuti di un piano prima di costruirlo
- [Explore First](explore.md) - il punto a cui tornare quando un'idea ha bisogno di essere ripensata
- [Commands](commands.md) - `/opsx:continue`, `/opsx:apply` e `/opsx:verify` nel dettaglio
- [Concepts: Artifacts](concepts.md#artifacts) - a cosa serve ogni artefatto