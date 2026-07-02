# Modificare e Iterare su una Modifica

Ogni artefatto in una modifica è semplicemente un file Markdown che puoi modificare in qualsiasi momento. Non esiste una "fase di pianificazione" bloccata, nessun gate di approvazione, né una modalità di modifica speciale da attivare. Vuoi cambiare la proposta dopo aver iniziato a costruire? Apri `proposal.md` e modificalo. Hai realizzato che il design è sbagliato a metà dell'implementazione? Correggi `design.md` e continua. Questa è l'intera risposta, ed è intenzionale.

Questa pagina serve per il momento in cui pensi: "Aspetta, posso tornare indietro e cambiare quella cosa?". Sì. Ecco come fare, per ogni caso comune.

## Due modi per modificare qualsiasi cosa

Hai sempre entrambi a disposizione:

1. **Modificare direttamente il file.** Gli artefatti sono Markdown semplice nella cartella `openspec/changes/<name>/`. Apri `proposal.md`, `design.md`, `tasks.md` o una delta spec sotto `specs/` nel tuo editor e modificalo. Niente di più è richiesto.

2. **Chiedere alla tua AI di rivederlo.** Nella chat, basta dire cosa vuoi: "Aggiorna la proposta per eliminare l'idea della cache e aggiungere una sezione sulla limitazione del tasso (rate-limit)," o "il design dovrebbe usare una coda, non il polling." L'AI modifica l'artefatto per te, utilizzando il resto della modifica come contesto.

Usa quello che si adatta al momento. Una piccola rifinitura di testo? Modifica il file. Un ripensamento sostanziale? Lascia che l'AI riveda con il contesto completo.

## "Come posso aggiornare la proposta (o le specifiche) dopo aver iniziato?"

Aggiornala semplicemente. Stessa modifica, raffinata.

Se stai utilizzando i comandi estesi, il flusso naturale è: modifica l'artefatto, quindi esegui `/opsx:continue` per riprendere dallo stato nuovo, o `/opsx:apply` per continuare a implementare rispetto al piano aggiornato. Se usi i comandi predefiniti `core`, modifica l'artefatto ed esegui `/opsx:apply`; legge i file attuali, quindi costruisce in base a ciò che gli artefatti dicono ora.

Il modello mentale è questo: gli artefatti sono il piano attivo, non un contratto firmato. L'AI lavora sempre sui loro contenuti attuali, quindi modificarli indirizza il lavoro.

```text
Tu: Voglio cambiare l'approccio in questa modifica.

Tu: [modifica design.md, o dì all'AI:]
     Aggiorna design.md per usare un background job invece di una chiamata sincrona.

AI:  design.md aggiornato. La lista dei compiti è ancora valida; vuoi che continui ad applicare?

Tu: /opsx:apply
```

Questo risponde a una domanda molto comune: non esiste un comando separato "aggiorna proposta" perché non ne hai bisogno. Il file è la fonte di verità, e modificarlo (a mano o tramite l'AI) è l'aggiornamento.

## "Come posso tornare a rivedere dopo aver implementato?"

Non devi "tornare indietro", perché non sei mai andato via. Il flusso di lavoro è fluido: revisione, modifica e implementazione non sono fasi sequenziali in cui sei bloccato.

In modo concreto, dopo un lavoro con `/opsx:apply`:

- Vuoi riesaminare il piano? Apri gli artefatti e leggili, oppure esegui `openspec show <change>` nel tuo terminale per una visione consolidata.
- Hai trovato qualcosa da cambiare? Modifica l'artefatto (o chiedi all'AI di farlo), quindi continua.
- Vuoi un controllo strutturato che il codice corrisponda al piano? Esegui `/opsx:verify` (comando esteso). Esso riporta completezza, correttezza e coerenza senza bloccare nulla. Vedi [Workflows: Verify](workflows.md#verify-check-your-work).

Non c'è una "fase di revisione" a cui tornare, perché la revisione è qualcosa che puoi fare in qualsiasi momento, anche dopo l'implementazione.

## "Ho modificato il codice manualmente. Come posso conciliare questo con OpenSpec?"

Questo succede costantemente ed è normale. Hai modificato qualcosa nel tuo editor e ora il codice e gli artefatti non sono d'accordo. Riportali in sincronia nella direzione che sia vera:

- **Il codice è corretto, la specifica è obsoleta.** Aggiorna la delta spec (e i compiti, se rilevanti) per descrivere il comportamento che hai effettivamente rilasciato. La specifica dovrebbe corrispondere alla realtà prima di archiviare, perché l'archiviazione unisce la specifica alla tua fonte di verità.
- **La specifica è corretta, il codice si è discostato.** Continua a costruire o a correggere finché il codice non corrisponde alla specifica.

Un modo rapido per rilevare le discrepanze è `/opsx:verify`: legge i tuoi artefatti e il tuo codice e ti dice dove divergono. Tratta il suo output come una lista di cose da fare per la riconciliazione, quindi archivia quando sono d'accordo.

Il principio è questo: al momento dell'archiviazione, le tue specifiche diventano la verità del registro. Quindi, prima di archiviare, rendi le specifiche oneste riguardo a ciò che fa il codice. Le modifiche manuali sono benvenute; basta non permettere loro di disallineare silenziosamente la specifica.

## Affinare una proposta che non ti soddisfa

Se una proposta generata non è all'altezza, hai tre mosse valide:

- **Iterare sul posto.** Di' all'AI cosa non va ("lo scopo è troppo ampio, elimina le funzionalità di amministrazione") e lascia che riveda. È la soluzione più economica e solitamente corretta.
- **Esplorare prima, poi riproporre.** Se il problema è che l'idea stessa non è chiara, torna indietro a `/opsx:explore`, rifletti e lascia che ne emerga una proposta più nitida. Vedi [Explore First](explore.md).
- **Iniziare da zero.** Se l'intento è cambiato in modo fondamentale, una nuova modifica può essere più chiara che patchare quella vecchia.

Questa ultima mossa ha la sua guida decisionale, prossimamente.

## Quando aggiornare rispetto a iniziare una nuova modifica

Versione breve: **aggiorna quando si tratta dello stesso lavoro raffinato; inizia una nuova modifica quando l'intento è cambiato in modo fondamentale o lo scopo è esploso in un lavoro diverso.**

- Stesso obiettivo, approccio migliore? Aggiorna.
- Riduzione dello scopo (rilasciare il MVP ora, altro dopo)? Aggiorna, poi archivia, e una nuova modifica per la fase due.
- Il problema stesso è cambiato ("aggiungere dark mode" è diventato "costruire un sistema di tematizzazione completo")? Nuova modifica.

C'è un flowchart completo ed esempi pratici in [Workflows: When to Update vs Start Fresh](workflows.md#when-to-update-vs-start-fresh) e una trattazione più approfondita in [OPSX: When to Update vs. Start Fresh](opsx.md#when-to-update-vs-start-fresh).

## Una nota sui compiti

`tasks.md` è un checklist vivente, non un piano congelato. Mentre implementi, puoi aggiungere i compiti che scopri, rimuovere quelli che si sono rivelati superflui o riordinarli. L'AI spunta gli elementi man mano che li completa durante `/opsx:apply`, e riprende dal primo compito non spuntato se torni in seguito. Modificare la lista a metà del processo è previsto.

## Dove andare dopo

- [Workflows](workflows.md) - schemi, più la guida decisionale aggiornare vs nuovo
- [Explore First](explore.md) - il posto dove tornare quando un'idea necessita di essere ripensata
- [Commands](commands.md) - `/opsx:continue`, `/opsx:apply` e `/opsx:verify` in dettaglio
- [Concepts: Artifacts](concepts.md#artifacts) - a cosa serve ogni artefatto