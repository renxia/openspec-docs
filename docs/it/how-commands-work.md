# Come funzionano i comandi

**L'unica cosa da sapere: OpenSpec ha due tipi di comandi e questi vengono eseguiti in due luoghi diversi.**

- I comandi `openspec ...` vengono eseguiti nel tuo **terminale**. (Esempio: `openspec init`.)
- I comandi `/opsx:...` vengono eseguiti nella chat del tuo **assistente AI**. (Esempio: `/opsx:propose`.)

Se provi a digitare `/opsx:propose` nel terminale e non succede nulla, questa pagina è la risposta. Stai parlando della metà sbagliata di OpenSpec. I comandi slash non sono comandi da terminale. Sono istruzioni che fornisci al tuo assistente AI per la codifica, nella stessa casella di chat dove scriveresti normalmente "aggiungi un modulo di login".

Questa singola distinzione è l'ostacolo più comune per i nuovi utenti, quindi rendiamola assolutamente chiara.

## Le due metà

OpenSpec è un progetto che indossa due cappelli.

**La CLI (la parte del terminale).** Un programma chiamato `openspec` che installi ed esegui dalla tua shell. Configura il tuo progetto, elenca e convalida le modifiche, mostra una dashboard e archivia il lavoro completato. Tu digiti questi comandi in iTerm, nel terminale di VS Code, PowerShell, ovunque tu esegua `git` o `npm`.

```bash
openspec init        # configura OpenSpec in questo progetto
openspec list        # visualizza le modifiche attive
openspec view        # apre la dashboard interattiva
```

**I comandi slash (la parte della chat).** Comandi brevi come `/opsx:propose` e `/opsx:apply` che digiti nel tuo assistente AI. Questi dicono all'AI di seguire il workflow di OpenSpec: redigere una proposta, scrivere le specifiche, costruire dalla lista delle attività, archiviare quando finito. Tu li digiti in Claude Code, Cursor, Windsurf, Copilot o qualunque assistente tu utilizzi.

```text
/opsx:propose add-dark-mode    (digitato nella tua chat AI)
/opsx:apply                    (digitato nella tua chat AI)
/opsx:archive                  (digitato nella tua chat AI)
```

Ecco il modello mentale in un'immagine:

```text
        IL TUO TERMINALE                         LA CHAT DEL TUO ASSISTENTE AI
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   installa    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   comandi      │  /opsx:archive                │
   └──────────────────────┘    & skill  └──────────────────────────────┘
        esegue openspec qui                       esegue /opsx:* qui
```

Nota la freccia. Eseguire `openspec init` nel tuo terminale è ciò che *installa* i comandi slash nel tuo strumento AI. La metà del terminale configura la metà della chat. Dopodiché, il lavoro quotidiano avviene principalmente nella chat.

## "Come inizio la modalità interattiva?"

**Non esiste una modalità interattiva separata da avviare.** Questa domanda si presenta spesso, quindi merita una risposta semplice.

Tu non entri in una speciale modalità OpenSpec. Apri semplicemente il tuo assistente AI per la codifica come fai di solito e digita un comando slash nella chat. Il comando slash *è* il modo in cui "entri" in OpenSpec. Il tuo assistente lo riconosce, carica la skill corrispondente di OpenSpec e inizia a seguire il workflow.

Quindi le istruzioni reali sono:

1. Apri il tuo assistente AI per la codifica (Claude Code, Cursor, Windsurf e così via) nel tuo progetto.
2. Digita `/opsx:propose` nella sua chat, nello stesso posto in cui digiti qualsiasi altra richiesta.
3. Osserva l'autocomplete: se OpenSpec è installato, vedrai apparire `/opsx:propose`, `/opsx:apply` e gli altri man mano che digiti il slash.

È tutto. Nessuna modalità da attivare, nessun daemon da avviare, nessuna finestra separata.

Una cosa che è genuinamente interattiva risiede nel terminale: `openspec view`. Apre una dashboard per navigare le tue specifiche e le modifiche. Ma questo è un visualizzatore, non la cosa con cui proponi e costruisci. La costruzione avviene tramite comandi slash nella chat.

## Perché esiste questa divisione

Vale la pena capirlo, perché spiega perché OpenSpec funziona con oltre 25 strumenti AI diversi.

La CLI è il **motore**. Conosce le regole: come appare una cartella di modifiche, quali artefatti dipendono da quali, come unire una specifica delta nella tua fonte di verità. È la stessa ovunque.

I comandi slash sono lo **sterzo**, e ogni strumento AI ha uno leggermente diverso. Claude Code li chiama comandi. Cursor e Windsurf hanno i loro formati. Alcuni strumenti li chiamano skill. Quando esegui `openspec init`, OpenSpec genera il tipo di file giusto per ogni strumento che hai selezionato, in modo che la stessa intenzione `/opsx:propose` funzioni indipendentemente dall'assistente che preferisci.

La forza di questo design è: impari il workflow una volta e lo porti con te tra gli strumenti. Il compromesso: la sintassi esatta di un comando può differire leggermente tra gli strumenti, che sarà l'argomento della prossima sezione.

## Sintassi dei comandi slash per strumento

L'intenzione è identica ovunque. La punteggiatura differisce. Usa il formato che corrisponde al tuo assistente.

| Strumento | Come lo digiti |
|------|-----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | stile skill, ad esempio `/skill:openspec-propose` |
| Trae | stile skill, ad esempio `/openspec-propose` |

La maggior parte degli strumenti utilizza il formato con i due punti (`/opsx:propose`) o il formato con trattini (`/opsx-propose`). Alcuni strumenti espongono OpenSpec come skill nominate anziché come comandi slash; per questi invochi la skill per nome. L'elenco completo per strumento, inclusi esattamente quali file vengono scritti dove, si trova in [Supported Tools](supported-tools.md).

In caso di dubbio, digita un slash nella tua chat AI e guarda l'autocomplete. Il tuo strumento ti mostrerà il formato che si aspetta.

## Come sono arrivati i comandi: skill e comandi

Quando esegui `openspec init` (o `openspec update`), OpenSpec scrive piccoli file nel tuo progetto in modo che il tuo strumento AI possa trovare il workflow. A seconda del tuo strumento e delle impostazioni, questi sono **skill**, **comandi** o entrambi.

- Le **Skills** risiedono in luoghi come `.claude/skills/openspec-*/SKILL.md`. Sono lo standard emergente cross-tool: una cartella di istruzioni che il tuo assistente rileva automaticamente.
- I **Comandi** risiedono in luoghi come `.claude/commands/opsx/<id>.md`. Sono i vecchi file di comando slash specifici per strumento.

Non devi preoccuparti di quale li usi il tuo strumento. Tu digiti semplicemente il comando slash e funziona. Ma sapere che questi file esistono aiuta quando qualcosa va storto: se i tuoi comandi scompaiono, significa che questi file sono mancanti o obsoleti, e `openspec update` li rigenera.

Vedi [Supported Tools](supported-tools.md) per i percorsi esatti per strumento e [Migration Guide](migration-guide.md) su come le skill hanno sostituito l'approccio precedente basato solo sui comandi.

## Confermare che è installato

Controlli rapidi, dal più veloce al meno:

1. **Digita un slash nella tua chat AI.** Inizia a digitare `/opsx` e cerca suggerimenti di autocomplete. Se appaiono, sei pronto.
2. **Cerca i file.** Per Claude Code, controlla che `.claude/skills/` contenga le cartelle `openspec-*`. Gli altri strumenti utilizzano le proprie directory ([Supported Tools](supported-tools.md) le elenca).
3. **Riesegui la configurazione.** Dalla radice del tuo progetto, esegui `openspec update`. Questo rigenera i file skill e comando per tutti gli strumenti che hai configurato.
4. **Riavvia il tuo assistente.** Molti strumenti cercano le skill e i comandi all'avvio, quindi una finestra fresca può essere il passo mancante.

## Quali comandi ho in realtà?

Per impostazione predefinita, OpenSpec installa l'insieme **core** di comandi slash:

- `/opsx:explore`: rifletti un'idea con l'AI prima di impegnarti in una modifica (ottimo primo passo quando non sei sicuro)
- `/opsx:propose`: crea una modifica e redige tutti i suoi artefatti di pianificazione in un unico passaggio
- `/opsx:apply`: costruisce la modifica lavorando attraverso la sua lista di attività
- `/opsx:sync`: unifica gli aggiornamenti della specifica di una modifica nelle tue specifiche principali (solitamente automatico)
- `/opsx:archive`: finisce una modifica e la archivia

Un buon ritmo predefinito è: `explore` quando stai capendo cosa fare, poi `propose`, `apply`, `archive`. La guida [Explore First](explore.md) spiega perché questo passo iniziale conviene.

C'è anche un insieme **espanso** per coloro che desiderano un controllo più fine (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Lo attivi con `openspec config profile` e poi lo applichi con `openspec update`.

Nuovo di tutto questo? `/opsx:onboard` (nell'insieme espanso) ti guida attraverso una modifica completa sulla tua codebase, narrando ogni passo. È l'introduzione più amichevole possibile.

Per cosa fa ciascun comando in dettaglio, vedi [Commands](commands.md). Per quando usare quale, vedi [Workflows](workflows.md).

## Una prima esecuzione pulita

Riassumendo, ecco la sequenza completa con ogni passo etichettato per il luogo in cui avviene.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (installa i comandi slash nel tuo strumento AI)

AI CHAT      /opsx:explore
              (opzionale: rifletti l'idea con l'AI prima)

AI CHAT      /opsx:propose add-dark-mode
              (l'AI redige la proposta, le specifiche, il design, i compiti)

AI CHAT      /opsx:apply
              (l'AI lo costruisce, spuntando i compiti)

AI CHAT      /opsx:archive
              (la modifica viene unificata nelle tue specifiche e archiviata)
```

Due passaggi nel terminale per la configurazione. Poi vivi nella chat. Questo è il ritmo.

## Correlati

- [Getting Started](getting-started.md): la guida completa per la prima modifica
- [Commands](commands.md): ogni comando slash in dettaglio
- [CLI](cli.md): ogni comando da terminale in dettaglio
- [Supported Tools](supported-tools.md): sintassi e ubicazione dei file per strumento
- [FAQ](faq.md): altre risposte veloci
- [Troubleshooting](troubleshooting.md): soluzioni quando i comandi non appaiono