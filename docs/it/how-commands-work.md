# Come funzionano i comandi

**La cosa principale da sapere: OpenSpec ha due tipi di comandi, e vengono eseguiti in due posti diversi.**

- I comandi `openspec ...` vengono eseguiti nel tuo **terminale**. (Esempio: `openspec init`.)
- I comandi `/opsx:...` vengono eseguiti nella **chat del tuo assistente AI**. (Esempio: `/opsx:propose`.)

Se digiti `/opsx:propose` nel tuo terminale e non succede niente, questa pagina spiega il perché. Stai parlando con la metà sbagliata di OpenSpec. I comandi slash non sono comandi da terminale. Sono istruzioni che dai al tuo assistente di programmazione AI, nella stessa casella di chat in cui normalmente digiteresti "aggiungi un modulo di login".

Questa singola distinzione è l'ostacolo più comune per i nuovi utenti, quindi rendiamola perfettamente chiara.

## Le due metà

OpenSpec è un solo progetto con due funzioni.

**La CLI (metà terminale).** Un programma chiamato `openspec` che installi e esegui dalla tua shell. Configura il tuo progetto, elenca e convalida le modifiche, mostra una dashboard e archivia il lavoro completato. Digiti questi comandi in iTerm, nel terminale di VS Code, PowerShell, ovunque esegui `git` o `npm`.

```bash
openspec init        # configura OpenSpec in questo progetto
openspec list        # visualizza le modifiche attive
openspec view        # apri la dashboard interattiva
```

**I comandi slash (metà chat).** Comandi brevi come `/opsx:propose` e `/opsx:apply` che digiti nel tuo assistente AI. Questi dicono all'AI di seguire il flusso di lavoro OpenSpec: redigi una proposta, scrivi le specifiche, costruisci partendo dalla lista di attività, archivia quando hai finito. Digiti questi comandi in Claude Code, Cursor, Windsurf, Copilot, o qualsiasi altro assistente tu usi.

```text
/opsx:propose add-dark-mode    (digitato nella chat della tua AI)
/opsx:apply                    (digitato nella chat della tua AI)
/opsx:archive                  (digitato nella chat della tua AI)
```

Ecco il modello mentale in un'unica immagine:

```text
        IL TUO TERMINALE                         LA CHAT DEL TUO ASSISTENTE AI
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   installa    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   comandi     │  /opsx:archive                │
   └──────────────────────┘    e skill    └──────────────────────────────┘
        esegui openspec qui                       esegui /opsx:* qui
```

Nota la freccia. Eseguire `openspec init` nel tuo terminale è ciò che *installa* i comandi slash nel tuo strumento AI. La metà terminale configura la metà chat. Dopo di che, l'uso quotidiano avviene per lo più in chat.

## "Come avvio la modalità interattiva?"

**Non esiste una modalità interattiva separata da avviare.** Questa domanda viene posta molto spesso, quindi merita una risposta chiara.

Non devi entrare in una modalità OpenSpec speciale. Ti basta aprire il tuo assistente di programmazione AI come fai sempre, e digitare un comando slash nella chat. Il comando slash *è* il modo per "entrare" in OpenSpec. Il tuo assistente lo riconosce, carica la skill OpenSpec corrispondente e inizia a seguire il flusso di lavoro.

Quindi le istruzioni reali sono:

1. Apri il tuo assistente di programmazione AI (Claude Code, Cursor, Windsurf e così via) nel tuo progetto.
2. Digita `/opsx:propose` nella sua chat, lo stesso posto in cui digiti qualsiasi altra richiesta.
3. Guarda l'autocompletamento: se OpenSpec è installato, vedrai apparire `/opsx:propose`, `/opsx:apply` e altri comandi simili mentre digiti la barra.

Tutto qui. Nessuna modalità da attivare, nessun demone da avviare, nessuna finestra separata.

Una cosa che è *veramente* interattiva si trova nel terminale: `openspec view`. Apre una dashboard per navigare tra le tue specifiche e modifiche. Ma è solo un visualizzatore, non lo strumento con cui proponi e costruisci. La costruzione avviene tramite comandi slash nella chat.

## Perché esiste questa divisione

Vale la pena capirlo, perché spiega perché OpenSpec funziona con oltre 25 strumenti AI diversi.

La CLI è il **motore**. Conosce le regole: come deve essere una cartella di modifiche, quali artefatti dipendono da quali, come unire una specifica delta nella tua fonte di verità. È la stessa ovunque.

I comandi slash sono il **volante**, e ogni strumento AI ha il suo leggermente diverso. Claude Code li chiama comandi. Cursor e Windsurf hanno i loro formati propri. Alcuni strumenti li chiamano skill. Quando esegui `openspec init`, OpenSpec genera il tipo di file corretto per ogni strumento che hai selezionato, quindi la stessa intenzione di `/opsx:propose` funziona indipendentemente dall'assistente che preferisci.

Il punto forte di questo design: impari il flusso di lavoro una sola volta e lo usi su tutti gli strumenti. Il compromesso: la sintassi esatta di un comando può differire leggermente tra gli strumenti, come vedremo nella prossima sezione.

## Sintassi dei comandi slash per strumento

L'intenzione è identica ovunque. La punteggiatura cambia. Usa la forma che corrisponde al tuo assistente.

| Strumento | Come lo digiti |
|------|-----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | stile skill, ad es. `/openspec-propose` |
| Codex | stile skill tramite `.codex/skills/openspec-*` |
| Oh My Pi | `/opsx-propose`, `/opsx:apply` |
| Kimi CLI | stile skill, ad es. `/skill:openspec-propose` |
| Trae | `/opsx-propose`, `/opsx-apply` |

La maggior parte degli strumenti usa o la forma con i due punti (`/opsx:propose`) o la forma con il trattino (`/opsx-propose`). Alcuni strumenti mostrano OpenSpec come skill nominate invece di comandi slash; per quelli invochi la skill per nome. L'elenco completo per strumento, che include esattamente quali file vengono scritti dove, si trova in [Strumenti supportati](supported-tools.md).

In caso di dubbio, digita una barra nella chat della tua AI e guarda l'autocompletamento. Il tuo strumento ti mostrerà la forma che si aspetta.

## Come arrivano i comandi: skill e comandi

Quando esegui `openspec init` (o `openspec update`), OpenSpec scrive piccoli file nel tuo progetto in modo che il tuo strumento AI possa trovare il flusso di lavoro. A seconda dello strumento e delle impostazioni, questi sono **skill**, **comandi** o entrambi.

- Le **skill** si trovano in percorsi come `.claude/skills/openspec-*/SKILL.md`. Sono lo standard cross-strumento emergente: una cartella di istruzioni che il tuo assistente rileva automaticamente.
- I **comandi** si trovano in percorsi come `.claude/commands/opsx/<id>.md`. Sono i file di comandi slash più vecchi, specifici per ogni strumento. Codex non riceve file di comandi generati; usa `.codex/skills/openspec-*`.

Non devi preoccuparti di quale usa il tuo strumento. Ti basta digitare il comando slash e funziona. Ma sapere che questi file esistono aiuta quando qualcosa non va: se i tuoi comandi scompaiono, di solito significa che questi file sono mancanti o obsoleti, e `openspec update` li rigenera.

Vedi [Strumenti supportati](supported-tools.md) per i percorsi esatti per ogni strumento, e [Guida alla migrazione](migration-guide.md) per capire come le skill hanno sostituito il vecchio approccio basato solo su comandi.

## Verifica che sia installato

Controlli veloci, dal più rapido al più lento:

1. **Digita una barra nella chat della tua AI.** Inizia a digitare `/opsx` e guarda i suggerimenti di autocompletamento. Se appaiono, sei a posto.
2. **Cerca i file.** Per Claude Code, controlla che `.claude/skills/` contenga le cartelle `openspec-*`. Gli altri strumenti usano le loro directory (l'elenco è in [Strumenti supportati](supported-tools.md)).
3. **Riesegui la configurazione.** Dalla root del tuo progetto, esegui `openspec update`. Questo rigenera i file di skill e comandi per tutti gli strumenti che hai configurato.
4. **Riavvia il tuo assistente.** Molti strumenti scansionano le skill e i comandi all'avvio, quindi una finestra nuova può essere il passaggio che mancava.

## Quali comandi ho a disposizione?

Per impostazione predefinita, OpenSpec installa il set di comandi slash **core**:

- `/opsx:explore`: elabora un'idea con l'AI prima di impegnarti in una modifica (ottimo primo passo quando non sei sicuro)
- `/opsx:propose`: crea una modifica e redigi tutti i suoi artefatti di pianificazione in un solo passaggio
- `/opsx:apply`: costruisci la modifica lavorando attraverso la sua lista di attività
- `/opsx:sync`: unisci gli aggiornamenti delle specifiche di una modifica nelle tue specifiche principali (di solito automatico)
- `/opsx:archive`: completa una modifica e la archivia

Un buon ritmo predefinito: `explore` quando stai capendo cosa fare, poi `propose`, `apply`, `archive`. La guida [Esplora prima](explore.md) spiega perché questo primo passaggio vale la pena.

C'è anche un set **esteso** per chi vuole un controllo più preciso (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Lo attivi con `openspec config profile`, poi lo applichi con `openspec update`.

Sei nuovo a tutto questo? `/opsx:onboard` (nel set esteso) ti accompagna attraverso una modifica completa sul tuo codice, narrando ogni passaggio. È l'introduzione più amichevole possibile.

Per vedere cosa fa ogni comando nel dettaglio, consulta [Comandi](commands.md). Per capire quando usarne uno o l'altro, consulta [Flussi di lavoro](workflows.md).

## Una prima esecuzione pulita

Mettendo tutto insieme, ecco l'intera sequenza con ogni passaggio etichettato in base a dove avviene.

```text
TERMINALE   $ npm install -g @fission-ai/openspec@latest
TERMINALE   $ cd il-tuo-progetto
TERMINALE   $ openspec init
              (installa i comandi slash nel tuo strumento AI)

CHAT AI      /opsx:explore
              (opzionale: elabora l'idea con l'AI prima di iniziare)

CHAT AI      /opsx:propose add-dark-mode
              (l'AI redige proposta, specifiche, design, attività)

CHAT AI      /opsx:apply
              (l'AI lo costruisce, spuntando le attività)

CHAT AI      /opsx:archive
              (la modifica viene unita nelle tue specifiche e archiviata)
```

Due passaggi da terminale per la configurazione. Poi vivi nella chat. Questo è il ritmo.

## Correlati

- [Primi passi](getting-started.md): la guida completa alla prima modifica
- [Comandi](commands.md): ogni comando slash nel dettaglio
- [CLI](cli.md): ogni comando da terminale nel dettaglio
- [Strumenti supportati](supported-tools.md): sintassi per strumento e percorsi dei file
- [FAQ](faq.md): altre risposte rapide
- [Risoluzione dei problemi](troubleshooting.md): soluzioni quando i comandi non appaiono