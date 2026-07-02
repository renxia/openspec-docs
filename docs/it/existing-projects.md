# Utilizzare OpenSpec in un Progetto Esistente

**Non si documenta l'intero codebase all'inizio. Si scrivono le spec solo per ciò che si sta per cambiare.** Questa è la cosa più importante da sapere sull'adozione di OpenSpec su un progetto esistente, ed è il motivo per cui OpenSpec è costruito pensando al sistema preesistente (brownfield-first).

Una preoccupazione comune suona così: "La mia app ha 80.000 righe di codice. Devo scrivere le spec per tutto prima che OpenSpec sia utile?" No. Lo odiereste voi, e lo faremmo noi. OpenSpec espande le tue spec un cambiamento alla volta. Il tuo primo cambiamento documenta la porzione a cui tocca, il prossimo cambiamento ne documenta una, e nel corso di mesi le tue spec si riempiono naturalmente attorno al lavoro che effettivamente svolgi.

Questa guida mostra come iniziare dal giorno uno senza cercare di risolvere tutto subito.

## La versione trenta secondi

```bash
$ cd your-existing-project
$ openspec init          # aggiunge openspec/ e i comandi del tuo strumento AI
```

Poi, nella tua chat AI:

```text
/opsx:explore            # opzionale: fai leggere all'AI l'area che affronterai
/opsx:propose <un cambiamento reale e piccolo di cui hai effettivamente bisogno>
/opsx:apply
/opsx:archive
```

Le tue spec descrivono ora esattamente la parte del sistema a cui il cambiamento ha toccato, e nient'altro. Questo è corretto. Hai finito di preoccuparti delle altre 80.000 righe.

## Perché l'approccio delta-first è l'intero trucco

I cambiamenti di OpenSpec sono scritti come **deltas**: `ADDED`, `MODIFIED`, `REMOVED`. Un delta descrive cosa sta cambiando rispetto al comportamento attuale, non l'intero sistema.

Questo è esattamente ciò di cui ha bisogno il lavoro su sistemi preesistenti. Raramente si parte da zero. Si aggiunge un campo, si corregge un reindirizzamento, si stringe un timeout. Un delta ti permette di specificare quel singolo cambiamento con precisione senza dover prima scrivere una spec di 40 pagine di tutto ciò che lo circonda.

Quindi la tua directory `openspec/specs/` non inizia piena e completa. Inizia quasi vuota e si accumula. Ogni cambiamento archiviato incorpora il suo delta. La spec per `auth/` diventa approfondita solo dopo che hai apportato diversi cambiamenti relativi all'autenticazione, ed è proprio quando vuoi che sia approfondita.

Se desideri i meccanismi più approfonditi, consulta [Concepts: Delta Specs](concepts.md#delta-specs).

## Il tuo primo cambiamento su un codebase reale

Scegli qualcosa di piccolo e reale. Non un giocattolo, non una riscrittura. Un cambiamento che avresti comunque voluto fare questa settimana. I primi cambiamenti piccoli ti insegnano il workflow con rischi bassi.

**Passo 1: Lascia che l'AI legga l'area pertinente.** È qui che `/opsx:explore` dimostra il suo valore su un codebase sconosciuto o grande. Indica la parte che stai per toccare e lascialo mappare come funzionano le coseci prima di proporre qualsiasi cosa.

```text
Tu: /opsx:explore

AI:  Cosa vorresti esplorare?

Tu: Devo aggiungere il rate limiting alla nostra API pubblica, ma non sono sicuro
     di come i request fluiscano attualmente attraverso la middleware.

AI:  Lascia che tracci... [legge il router, lo stack di middleware e la configurazione]
     I Request arrivano a Express, passano attraverso la middleware di autenticazione, poi ai tuoi
     controller. Non esiste uno strato di rate-limiting oggi. Il punto di inserimento più pulito è una middleware subito dopo l'autenticazione. Vuoi che lo definisca?
```

Nota che ora l'AI comprende la tua struttura reale, quindi la proposta che scrive si adatterà al tuo codice, non a un template generico. Su un codebase grande, questa singola abitudine fa risparmiare la maggior parte del dolore. Vedi [Explore First](explore.md).

**Passo 2: Proporre il cambiamento.** La proposta e la sua delta spec catturano solo questo cambiamento.

```text
Tu: /opsx:propose add-api-rate-limiting
```

**Passo 3: Costruire e archiviare** con `/opsx:apply` e `/opsx:archive`, come qualsiasi altro cambiamento. Dopo l'archiviazione, hai una spec reale per il tuo comportamento di rate-limiting, nata da un cambiamento che dovevi fare comunque.

## Preferisci un tour guidato? Usa onboard

Se preferisci guardare l'intero ciclo svolgersi sul tuo codice con narrazione, il comando esteso `/opsx:onboard` fa esattamente questo: scansiona il tuo codebase alla ricerca di un piccolo e sicuro miglioramento, poi ti guida attraverso la proposta, la costruzione e l'archiviazione, spiegando ogni passo.

Attiva prima i comandi estesi:

```bash
$ openspec config profile      # seleziona i workflow estesi
$ openspec update              # applicali a questo progetto
```

Poi in chat:

```text
/opsx:onboard
```

È la introduzione più delicata possibile su un progetto reale, e ti lascia con un cambiamento genuino (piccolo) che puoi mantenere o scartare. Vedi [Commands: `/opsx:onboard`](commands.md#opsxonboard).

## "Ma ho già dei documenti di requisiti"

Forse hai un PRD, un SRS, una spec formale, anche modelli TLA+. Bene. Non devi importarli tutti insieme, e non devi buttarli via.

Tratta i documenti esistenti come **materiale sorgente per l'esplorazione**, non come spec da convertire. Quando inizi un cambiamento, incolla o indica all'AI la sezione pertinente e lascialo definire una delta OpenSpec focalizzata a partire da essa. La delta cattura il comportamento che stai cambiando ora, nella forma di requisito e scenario testabile di OpenSpec. I tuoi documenti originali rimangono dove sono come sfondo.

La ragione onesta: le spec di OpenSpec sono deliberatamente orientate al comportamento e circoscritte ai cambiamenti. Un PRD di 40 pagine è un artefatto diverso con uno scopo diverso. Forzare una conversione massiva una tantum tende a produrre una spec grande e obsoleta che nessuno si fida. Lasciare che le spec crescano da cambiamenti reali le mantiene accurate.

```text
Tu: /opsx:explore
Tu: Ecco la sezione del nostro PRD relativa al checkout. Sto implementando il requisito
     "guest checkout".
     [incolla il requisito pertinente]
AI:  [legge, pone domande di chiarimento, poi aiuta a definire un cambiamento]
Tu: /opsx:propose add-guest-checkout
```

## Organizzare le spec in un codebase grande

Le spec risiedono sotto `openspec/specs/`, raggruppate per **dominio**: un'area logica che corrisponde al modo in cui il tuo team pensa al sistema. Non devi progettare l'intera tassonomia subito. Crea una cartella di dominio quando il tuo primo cambiamento in quell'area ne ha bisogno.

Modi comuni per suddividere i domini:

- **Per area funzionale:** `auth/`, `payments/`, `search/`
- **Per componente:** `api/`, `frontend/`, `workers/`
- **Per contesto delimitato (bounded context):** `ordering/`, `fulfillment/`, `inventory/`

Scegli ciò che fa annuire un neofita. Puoi affinare in seguito. Vedi [Concepts: Specs](concepts.md#specs).

## Monorepos e lavoro che attraversa i repository

Per un monorepo, il modello più semplice è una singola directory `openspec/` alla radice del repo, con domini che mappano ai tuoi pacchetti o servizi. Questo copre la maggior parte dei team.

Se il tuo lavoro abbraccia genuinamente **più repository** (o diversi pacchetti che tratti come separati), OpenSpec ha una funzione beta di **stores**: la pianificazione vive in un proprio repo autonomo a cui qualsiasi uno dei tuoi repos di codice può fare riferimento, così il piano non deve vivere all'interno della cartella `openspec/` di un singolo repo. È una versione beta, quindi tratta i suoi comandi e lo stato come evolutivi. Inizia con la [Stores User Guide](stores-beta/user-guide.md) per il modello mentale e il percorso utile più piccolo.

## Alcune cautele oneste

- **Resisti alla tentazione di riempire tutto retroattivamente.** Scrivere spec per codice che non stai cambiando sembra produttivo e solitamente non lo è. Quelle spec diventano obsolete, perché nulla le costringe a seguire la realtà. Lascia che i cambiamenti reali guidino le tue spec.
- **Mantieni piccoli i primi cambiamenti.** I tuoi primi pochi cambiamenti sono tanto sull'imparare il ritmo quanto sul rilasciare. Un ambito ristretto rende il ciclo veloce e le lezioni economiche.
- **Committa `openspec/` a git.** Le tue spec e l'archivio appartengono al controllo di versione insieme al codice che descrivono.
- **Fornisci contesto all'AI.** Su un codebase grande con forti convenzioni, riempi il campo `context:` in `openspec/config.yaml` affinché ogni proposta rispetti la tua stack e i tuoi pattern. Vedi [Customization](customization.md#project-configuration).

## Dove andare dopo

- [Explore First](explore.md) - l'abitudine chiave per comprendere il codice prima di modificarlo
- [Getting Started](getting-started.md) - la guida completa del primo cambiamento
- [Editing & Iterating on a Change](editing-changes.md) - come modificare e iterare su un cambiamento mentre impari
- [Concepts: Delta Specs](concepts.md#delta-specs) - perché i delta rendono pulito il lavoro su sistemi preesistenti
- [Customization](customization.md) - insegna a OpenSpec le convenzioni del tuo progetto