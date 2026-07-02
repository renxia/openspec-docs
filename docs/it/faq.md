# FAQ

Risposte rapide alle domande più frequenti. Se la tua domanda è un problema di "qualcosa è rotto", [Troubleshooting](troubleshooting.md) è la pagina migliore. Se desideri definire un termine, consulta il [Glossary](glossary.md).

## Le basi

### Cos'è OpenSpec, in una frase?

Uno strato leggero che fa sì che tu e il tuo assistente di codifica AI concordiate su cosa costruire, per iscritto, prima che venga scritto qualsiasi codice.

### Perché potrei volerlo usare?

Perché gli assistenti AI sono fiduciosi anche quando sbagliano. Quando i requisiti esistono solo in una chat, l'AI riempie gli spazi vuoti con supposizioni, e scopri il problema solo dopo che il codice esiste. OpenSpec sposta la fase di accordo a un momento precedente, dove gli errori sono economici da correggere. Vedi [Core Concepts at a Glance](overview.md) per il caso completo.

### Devo usarlo per tutto?

No. Usalo dove l'accordo è importante, ovvero nella maggior parte del lavoro non banale. Per una correzione di un refuso di un carattere, la cerimonia probabilmente non vale la pena, e va bene così.

### Posso usarlo su una codebase esistente o solo su nuovi progetti?

Le codebase esistenti sono il caso principale. OpenSpec è pensato per i sistemi già in uso (brownfield-first): non devi documentare l'intera applicazione subito. Scrivi le specifiche solo per ciò che ogni cambiamento tocca, e le tue specifiche si completano nel tempo attorno al lavoro che effettivamente svolgi. C'è una guida dedicata: [Using OpenSpec in an Existing Project](existing-projects.md).

### È legato a un singolo strumento AI?

No. OpenSpec funziona con oltre 25 assistenti, tra cui Claude Code, Cursor, Windsurf, GitHub Copilot, Gemini CLI, Codex e altri. L'elenco completo e i dettagli per strumento si trovano in [Supported Tools](supported-tools.md).

## Esecuzione dei comandi

### Dove digito `/opsx:propose`?

Nella chat del tuo assistente AI, non nel terminale. Questo è il punto di confusione più comune, quindi ha la sua pagina dedicata: [How Commands Work](how-commands-work.md). Versione breve: `openspec ...` viene eseguito nel terminale, `/opsx:...` viene eseguito nella chat.

### Come faccio ad "avviare la modalità interattiva"?

Non esiste una modalità separata da avviare. Apri il tuo assistente AI come di solito e digita un comando con slash nella sua chat. Il comando con slash è il modo in cui si "entra" in OpenSpec. (La singola funzionalità veramente interattiva del terminale è `openspec view`, una dashboard per navigare le specifiche e i cambiamenti.) Spiegazione completa in [How Commands Work](how-commands-work.md).

### Ho digitato un comando con slash e non è successo nulla. Perché?

Molto probabilmente l'hai digitato nel terminale invece nella chat del tuo AI, oppure i comandi non sono ancora installati. Esegui `openspec update` nel tuo progetto, riavvia il tuo assistente e poi prova a digitare `/opsx` nella chat e cerca l'autocomplete. [Troubleshooting](troubleshooting.md#commands-dont-show-up) ha la checklist completa.

### Perché la sintassi è `/opsx:propose` in uno strumento e `/opsx-propose` in un altro?

Ogni strumento AI espone i comandi personalizzati in modo leggermente diverso. L'intento è identico; cambia solo la punteggiatura. Digita un slash nella chat e l'autocomplete ti mostrerà il formato che lo strumento si aspetta. La tabella per strumento si trova in [How Commands Work](how-commands-work.md#slash-command-syntax-by-tool).

### Qual è la differenza tra una skill e un comando?

Entrambi sono file scritti da OpenSpec affinché il tuo assistente possa eseguire il workflow. Le Skills (`.../skills/openspec-*/SKILL.md`) sono lo standard più recente per tutti gli strumenti; i comandi (`.../commands/opsx-*`) sono i vecchi file con slash specifici dello strumento. Non devi sceglierne uno. Devi solo digitare il comando con slash, e OpenSpec installerà quello che il tuo strumento utilizza.

## Il workflow

### Da dove dovrei iniziare se non sono sicuro di cosa costruire?

Con `/opsx:explore`. È un partner di pensiero senza rischi che legge la tua codebase, delinea le opzioni e trasforma un problema vago in un piano concreto, tutto prima che esista qualsiasi cambiamento o codice. Si trova nel profilo predefinito, quindi è sempre disponibile. Quando il piano è chiaro, passa a `/opsx:propose`. Questa è l'abitudine migliore da sviluppare, perché impedisce a un AI impaziente di costruire con fiducia la cosa sbagliata. Vedi [Explore First](explore.md).

### Qual è il flusso più semplice possibile?

```text
/opsx:explore (opzionale)   poi   /opsx:propose <ciò che vuoi>   poi   /opsx:apply   poi   /opsx:archive
```

Esplora per pensarci, proponi per redigere il piano, applica per costruirlo, archivia per archiviarlo. Salta l'esplorazione se sai già esattamente cosa vuoi.

### Qual è la differenza tra `/opsx:propose` e `/opsx:new`?

`/opsx:propose` è il comando predefinito in un unico passaggio: crea il cambiamento e redige tutti gli artefatti di pianificazione contemporaneamente. `/opsx:new` fa parte del set di comandi estesi e scaﬀolda solo un cambiamento vuoto, lasciandoti a creare gli artefatti uno alla volta con `/opsx:continue` (o tutto in una volta sola con `/opsx:ff`). Usa propose a meno che tu non voglia il controllo passo dopo passo. Vedi [Commands](commands.md).

### Cosa sono i profili core e estesi?

Un profilo decide quali comandi con slash vengono installati. **Core** (il predefinito) ti fornisce `propose`, `explore`, `apply`, `sync`, `archive`. Il set **esteso** aggiunge `new`, `continue`, `ff`, `verify`, `bulk-archive` e `onboard` per un controllo più fine. Cambia profilo con `openspec config profile`, quindi applica con `openspec update`.

### Devo eseguire `/opsx:sync`?

Di solito no. Sync fonde i delta spec di un cambiamento nelle tue specifiche principali, e `/opsx:archive` ti chiederà se farlo. Esegui sync manualmente solo quando desideri che le specifiche siano fuse prima dell'archiviazione, ad esempio in un cambiamento a lungo termine. Vedi [Commands](commands.md#opsxsync).

### Come modifico una proposta, una specifica o un task dopo aver iniziato?

Modifica semplicemente il file. Ogni artefatto è Markdown semplice in `openspec/changes/<name>/`, e non c'è nessuna fase bloccata o modalità di modifica speciale. Cambialo a mano o chiedi al tuo AI di rivederlo ("aggiorna il design per usare una coda"), e continua. L'AI lavora sempre sui contenuti del file corrente. Guida completa: [Editing & Iterating on a Change](editing-changes.md).

### Posso tornare indietro e cambiare il piano dopo aver implementato parte di esso?

Sì, in qualsiasi momento. Il workflow è fluido, quindi la revisione e la modifica non sono fasi dalle quali si può essere esclusi. Modifica l'artefatto e prosegui. Se vuoi un controllo strutturato che il codice corrisponda ancora al piano, esegui `/opsx:verify`. Vedi [Editing & Iterating on a Change](editing-changes.md#how-do-i-go-back-to-review-after-implementing).

### Ho modificato il codice a mano. Come lo riconcilio con la specifica?

Riportali in sincronia prima di archiviare, poiché l'archiviazione rende le tue specifiche la verità assoluta. Se il codice è ora corretto, aggiorna lo delta spec per farlo corrispondere a ciò che hai spedito; se la specifica è corretta, continua a costruire finché il codice non concorda. `/opsx:verify` espone le discrepanze. Vedi [Editing & Iterating on a Change](editing-changes.md#i-edited-the-code-by-hand-how-do-i-reconcile-that-with-openspec).

### Quando dovrei aggiornare un cambiamento esistente rispetto all'inizio di uno nuovo?

Aggiorna quando è lo stesso lavoro, raffinato. Inizia da zero quando l'intento è cambiato fondamentalmente o lo scopo si è espanso in lavori diversi. C'è un flowchart decisionale e degli esempi in [Workflows](workflows.md#when-to-update-vs-start-fresh).

### Cosa succede se la mia sessione esaurisce il contesto, o i requisiti cambiano a metà dell'implementazione?

È qui che le specifiche dimostrano il loro valore. Poiché il piano vive nei file (non solo nella cronologia della chat), puoi chiarire il tuo contesto, avviare una nuova sessione AI e riprendere con `/opsx:apply`; legge gli artefatti e riprende dal primo task non controllato. Se i requisiti cambiano, modifica gli artefatti per farli corrispondere alla nuova realtà e continua. Mantenere una finestra di contesto pulita produce anche risultati migliori; chiarala prima dell'implementazione.

### Devo committare la cartella `openspec/` a git?

Sì. Le tue specifiche, i cambiamenti attivi e l'archivio fanno parte della storia del tuo progetto. Committali come qualsiasi altro sorgente. L'archivio in particolare diventa una registrazione duratura del motivo per cui il tuo sistema funziona nel modo in cui lo fa.

## Specifiche e Cambiamenti

### Cosa va in una specifica rispetto a un design?

Una specifica descrive il comportamento osservabile: cosa fa il sistema, i suoi input, gli output e le condizioni di errore. Un design descrive come lo costruirai: l'approccio tecnico, le decisioni architetturali, le modifiche ai file. Se l'implementazione può cambiare senza cambiare il comportamento visibile esternamente, appartiene al design, non alla specifica. [Concepts](concepts.md#what-a-spec-is-and-is-not) approfondisce.

### Cos'è una delta spec?

Una specifica che descrive solo ciò che sta cambiando, utilizzando le sezioni `ADDED`, `MODIFIED` e `REMOVED`, piuttosto che riassumere l'intera specifica. È il modo in cui OpenSpec gestisce i cambiamenti ai sistemi esistenti in modo pulito. Vedi [Concepts](concepts.md#delta-specs).

### Dove vanno gli archivi dei cambiamenti?

In `openspec/changes/archive/YYYY-MM-DD-<name>/`, con tutti gli artefatti preservati. Nulla viene eliminato; il cambiamento esce semplicemente dalla tua lista attiva.

## Configurazione e personalizzazione

### Come dico all'AI del mio tech stack?

Mettilo in `openspec/config.yaml` sotto `context:`. Quel testo viene iniettato in ogni richiesta di pianificazione, così l'AI conosce sempre il tuo stack e le tue convenzioni. Vedi [Customization](customization.md#project-configuration).

### Posso generare specifiche in una lingua diversa dall'inglese?

Sì. Aggiungi un'istruzione linguistica nel `context:` della tua configurazione. [Multi-Language](multi-language.md) contiene snippet da copiare e incollare per diverse lingue.

### Posso cambiare il workflow stesso?

Sì, con schemi personalizzati. Uno schema definisce quali artefatti esistono e come dipendono l'uno dall'altro. Forka quello predefinito con `openspec schema fork spec-driven my-workflow`, quindi modificalo. Vedi [Customization](customization.md#custom-schemas).

## Modelli, privacy e aggiornamenti

### Quale modello AI dovrei usare?

OpenSpec funziona meglio con modelli ad alta capacità di ragionamento. Il README raccomanda modelli come Codex 5.5 e Opus 4.7 sia per la pianificazione che per l'implementazione. Mantieni anche pulita la tua finestra di contesto: chiarala prima dell'implementazione per i migliori risultati.

### OpenSpec raccoglie dati?

Raccoglie statistiche anonime sull'utilizzo: nome del comando e versione solo. Nessun argomento, percorso, contenuto o dato personale, ed è disattivato automaticamente in CI. Opta per non tracciare con `export OPENSPEC_TELEMETRY=0` o `export DO_NOT_TRACK=1`.

### Come faccio ad aggiornare?

Due passaggi. Aggiorna il pacchetto (`npm install -g @fission-ai/openspec@latest`), quindi esegui `openspec update` all'interno di ogni progetto per aggiornare le skill e i comandi generati.

### Come disinstallo OpenSpec?

Non esiste un comando di disinstallazione, perché è solo un pacchetto globale più dei file nel tuo progetto. Rimuovi il pacchetto (`npm uninstall -g @fission-ai/openspec`), e opzionalmente elimina la directory `openspec/` e i file degli strumenti generati. Il processo passo dopo passo, inclusi ciò che è sicuro mantenere, si trova in [Installation: Uninstalling](installation.md#uninstalling).

## Ottenere aiuto

### Dove posso fare domande o segnalare bug?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Dal tuo terminale:** `openspec feedback "il tuo messaggio"` apre un'issue su GitHub per te.

### Questa documentazione è sbagliata o confusa. Cosa devo fare?

Dilloci, oppure correggila. Le PR di documentazione sono benvenute e apprezzate. Apri un'issue o invia una pull request.