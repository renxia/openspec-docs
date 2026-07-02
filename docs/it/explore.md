# Esplora Prima

**`/opsx:explore` è il tuo partner di pensiero. Afferralo ogni volta che hai un problema ma non ancora un piano.** Investiga la tua codebase, valuta le opzioni con te e chiarisce ciò che vuoi veramente, tutto prima che venga creato un singolo artefatto o riga di codice. Quando il quadro è chiaro, passa a `/opsx:propose`.

Se prendi una cosa da questa documentazione, prendi questa: **quando non sei sicuro, esplora prima di proporre.**

Ecco perché questo è importante. Gli assistenti AI per la codifica sono impazienti. Fai domande vaghe e costruiranno con sicurezza *qualcosa*, anche se forse non è ciò che ti serviva. Explore è la cura. È una conversazione senza rischi in cui tu e l'AI scoprite insieme la mossa giusta, così quando proponi stai proponendo la cosa giusta.

## Quando esplorare

Explore è il primo passo giusto più spesso di quanto le persone credano. Usalo quando è vero uno dei seguenti:

- Conosci il *problema* ma non la *soluzione*. ("Le pagine sono lente." "L'autenticazione è un disastro." "Continuiamo a ricevere ordini duplicati.")
- Stai scegliendo tra approcci e vuoi che i compromessi siano esposti rispetto al tuo codice attuale.
- Sei nuovo di una codebase e devi capire come funziona qualcosa prima di modificarlo.
- I requisiti sono vaghi e vuoi affinarli prima di impegnarti.
- Sospetti che il lavoro sia più grande o più piccolo del previsto e vuoi definirne l'ambito in modo onesto.

Salta explore solo quando sai esattamente cosa vuoi e come farlo. In quel caso, vai direttamente a [`/opsx:propose`](commands.md#opsxpropose).

## Cosa fa (e non fa)

Explore è una **conversazione**, non un generatore.

**Fa:**
- Legge e cerca nella tua codebase per rispondere a domande reali.
- Confronta le opzioni e nomina i compromessi di ciascuna.
- Disegna diagrammi per rendere leggibile un design.
- Ti aiuta a restringere un'idea vaga in un ambito concreto e realizzabile.
- Passa a `/opsx:propose` quando sei pronto.

**Non fa:**
- Crea una cartella di modifiche.
- Scrive alcun artefatto (nessuna proposta, specifiche, design o task).
- Scrive o modifica codice.

Questo è il punto. Esplorare non ti costa nulla e non ti impegna a nulla. Puoi esplorare tre vicoli ciechi, imparare qualcosa da ciascuno e solo allora proporre il percorso che è sopravvissuto.

## È già installato

Buone notizie: `/opsx:explore` è incluso nel profilo **core** predefinito, proprio accanto a `propose`, `apply`, `sync` e `archive`. Non devi abilitare nulla. Se OpenSpec è configurato nel tuo progetto, explore è pronto nella chat AI. (Come per tutti i comandi `/opsx:*`, lo digiti nella chat del tuo assistente, non nel terminale. Vedi [How Commands Work](how-commands-work.md).)

## Un esempio completo

Guarda come una preoccupazione vaga diventa un cambiamento nitido e realizzabile.

```text
Tu: /opsx:explore

AI: Cosa vorresti esplorare?

Tu: A volte il nostro checkout crea ordini duplicati. Non so perché
     e non so come risolverlo in sicurezza.

AI: Lascia che mi addendo nel percorso di checkout...
     [legge il servizio ordini, l'handler del webhook di pagamento e la
      logica di invio lato client]

     Ecco cosa ho trovato. Ci sono due modi in cui può accadere un duplicato:

     1. Il client può inviare due volte (doppio click, riprova su rete lenta).
        Nulla lo debounces.
     2. Il webhook di pagamento può scattare più di una volta e l'handler
        crea un ordine ogni volta. Non esiste una chiave di idempotenza.

     La Causa #2 è quella pericolosa: può addebitare e soddisfare due volte.

     Tre modi per risolverlo, approssimativamente in ordine di robustezza:
     - Chiave di idempotenza sull'endpoint di creazione dell'ordine (gestisce entrambe le cause)
     - Dedup sul webhook tramite l'id di intento di pagamento (gestisce solo #2)
     - Debounce lato client (gestisce solo #1, copre il vero bug)

     Dato che il tuo codice memorizza già l'id di intento di pagamento,
     l'approccio con la chiave di idempotenza è un piccolo cambiamento con il massimo payoff.
     Vuoi che definisca l'ambito?

Tu: Sì, facciamo la chiave di idempotenza.

Tu: /opsx:propose add-order-idempotency-key

AI: Creata openspec/changes/add-order-idempotency-key/, con una proposta
     e una specifica delta basate su ciò che abbiamo appena scoperto. Pronto per l'implementazione.
```

Nota cosa è successo. Il punto di partenza era "qualcosa non va e ho paura di toccarlo". Venti secondi di esplorazione hanno trasformato questo in una causa radice nominata, tre opzioni classificate, un consiglio legato al codice esistente e un cambiamento preciso. La proposta che segue è nitida perché il pensiero è avvenuto per primo.

## Passare a propose

Explore non archivia nulla. Quando sei pronto, inizi semplicemente un cambiamento e l'AI porta il contesto dalla tua conversazione negli artefatti.

```text
explore  ──►  propose  ──►  apply  ──►  archive
 (pensare)     (accettare)       (costruire)     (registrare)
```

Puoi dirlo in linguaggio semplice ("trasformiamolo in un cambiamento") o eseguire `/opsx:propose <nome>` direttamente. In entrambi i casi, l'esplorazione che hai appena fatto diventa la base della proposta, non una chiacchierata da buttare via.

Se usi il set di comandi esteso, explore può passare a `/opsx:new` per la creazione sequenziale degli artefatti. Vedi [Workflows](workflows.md).

## Consigli per un'ottima esplorazione

- **Porta il problema, non la soluzione.** "I login sono lenti" dà all'AI lo spazio per investigare. "Aggiungi una cache Redis" ti impegna in anticipo a una risposta che non hai ancora testato.
- **Chiedi i compromessi ad alta voce.** "Quali sono gli svantaggi di ogni opzione?" ottiene un confronto più onesto.
- **Lascialo leggere prima.** Le migliori esplorazioni iniziano con l'AI che guarda effettivamente il tuo codice, non che indovina. Indicalo sull'area pertinente se questo aiuta.
- **Va bene mollare.** Se l'esplorazione rivela che l'idea non vale la pena, è una vittoria. L'hai imparata a basso costo.
- **Esplora di nuovo durante il cambiamento.** Sei bloccato durante `/opsx:apply`? Puoi tornare indietro ed esplorare un sottoproblema, e poi riprendere.

## I compromessi onesti

**Cosa guadagni:** explore coglie i sbagliati all'inizio al costo più basso possibile, prima che esista qualsiasi artefatto. È particolarmente potente in codice sconosciuto, dove la capacità dell'AI di leggere e riassumere il sistema ti fa risparmiare un pomeriggio di esplorazione.

**Cosa costa:** un po' di pazienza. Explore è una conversazione, quindi è più lento che eseguire `/opsx:propose` e sperare. Per un lavoro che comprendi già veramente, quel passaggio in più è puro overhead e dovresti saltarlo.

La regola generale: più vaga è il compito, maggiore è il payoff di explore. Più chiaro è il compito, tanto più puoi passare direttamente alla proposta.

## Dove andare dopo

- [Comandi: `/opsx:explore`](commands.md#opsxexplore): la referenza precisa
- [Workflows](workflows.md): explore come parte del ciclo quotidiano
- [Esempi e Ricette](examples.md#recipe-3-exploring-before-you-commit): esplorare in un walkthrough completo
- [Getting Started](getting-started.md): la guida per il primo cambiamento, inclusa l'esplorazione