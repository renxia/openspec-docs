# Documentazione OpenSpec

Benvenuti. Questo è il punto di riferimento per tutto ciò che riguarda OpenSpec.

OpenSpec vi aiuta a voi e al vostro assistente di codifica AI a **concordare su cosa costruire prima che venga scritto qualsiasi codice**. Voi descrivete la modifica, l'AI prepara una breve specifica e un elenco di compiti; entrambi guardate lo stesso piano e poi il lavoro viene svolto. Basta con scoprire a metà strada che l'AI ha costruito la cosa sbagliata.

Se non leggete altro, leggete queste due pagine:

1. [Getting Started](getting-started.md): installazione, inizializzazione e rilascio della vostra prima modifica.
2. [How Commands Work](how-commands-work.md): dove digitare effettivamente `/opsx:propose` (un consiglio: nel vostro chat AI, non nel terminale). Questo è un punto che confonde quasi tutti all'inizio.

La seconda cosa è più importante di quanto sembri. OpenSpec ha due facce: uno strumento a riga di comando che eseguite nel terminale e dei slash command che date al vostro assistente AI. Sapere quale sia quale vi fa risparmiare il momento di confusione più comune.

> **L'abitudine migliore da sviluppare per prima: quando non siete sicuri di cosa costruire, iniziate con `/opsx:explore`.** È un partner di pensiero senza rischi che legge il vostro codice, valuta le opzioni e trasforma un'idea vaga in un piano concreto prima che esista qualsiasi artefatto o codice. La guida [Explore First](explore.md) lo dimostra.

## Scegliete il vostro percorso

**Sono completamente nuovo.** Iniziate con [Getting Started](getting-started.md), poi sfogliate [Core Concepts at a Glance](overview.md). Quando qualcosa vi sembra misterioso, la [FAQ](faq.md) e il [Glossary](glossary.md) sono vicini.

**Ho un problema ma non ho un piano.** Questo è il caso più comune e ha una risposta dedicata: [Explore First](explore.md). Usate `/opsx:explore` per pensarci con l'AI prima di impegnarvi in qualsiasi cosa.

**Ho una grande codebase esistente.** Non dovete documentare tutto. [Using OpenSpec in an Existing Project](existing-projects.md) mostra come iniziare su codice reale, "brownfield", senza cercare di risolvere ogni problema del mondo.

**Voglio solo farlo funzionare.** [Install](installation.md), eseguite `openspec init`, poi leggete [How Commands Work](how-commands-work.md) in modo che il vostro primo slash command arrivi nel posto giusto.

**Imparo dall'esempio.** La pagina [Examples & Recipes](examples.md) guida attraverso modifiche reali dalla fine all'inizio: una piccola funzionalità, una correzione di bug, un refactoring, un'esplorazione.

**Vengo dal vecchio workflow.** Il [Migration Guide](migration-guide.md) spiega cosa è cambiato e perché, garantendo che il vostro lavoro esistente sia al sicuro.

**Voglio adattarlo al processo del mio team.** [Customization](customization.md) copre la configurazione del progetto, gli schemi personalizzati e il contesto condiviso.

**Qualcosa è rotto.** [Troubleshooting](troubleshooting.md) raccoglie i fallimenti che le persone incontrano realmente, con le relative soluzioni.

## La mappa completa

### Iniziate qui

| Doc | Cosa vi fornisce |
|-----|-------------------|
| [Getting Started](getting-started.md) | Installazione, inizializzazione ed esecuzione della vostra prima modifica dalla A alla Z |
| [Explore First](explore.md) | Usare `/opsx:explore` per pensare a un'idea prima di impegnarvi |
| [How Commands Work](how-commands-work.md) | Dove vengono eseguiti i slash command, cosa significa "modalità interattiva", terminale vs chat |
| [Core Concepts at a Glance](overview.md) | L'intero modello mentale su una pagina: specifiche, modifiche, delta, archivio |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix e come verificare che tutto funzioni |

### Usatelo quotidianamente

| Doc | Cosa vi fornisce |
|-----|-------------------|
| [Workflows](workflows.md) | Schemi comuni e quando ricorrere a ciascun comando |
| [Examples & Recipes](examples.md) | Guide complete di modifiche reali, pronti per essere copiati e incollati |
| [Using OpenSpec in an Existing Project](existing-projects.md) | Adottare OpenSpec su una codebase "brownfield" di grandi dimensioni |
| [Editing & Iterating on a Change](editing-changes.md) | Aggiornare gli artefatti, tornare indietro, riconciliare le modifiche manuali |
| [Commands](commands.md) | Riferimento per ogni slash command `/opsx:*` |
| [CLI](cli.md) | Riferimento per ogni comando `openspec` del terminale |

### Comprendetelo a fondo

| Doc | Cosa vi fornisce |
|-----|-------------------|
| [Concepts](concepts.md) | La spiegazione estesa di specifiche, modifiche, artefatti, schemi e archivio |
| [OPSX Workflow](opsx.md) | Perché il workflow è fluido anziché bloccato in fasi, più un'analisi approfondita dell'architettura |
| [Glossary](glossary.md) | Ogni termine definito in un unico luogo |

### Rendetelo vostro

| Doc | Cosa vi fornisce |
|-----|-------------------|
| [Customization](customization.md) | Configurazione del progetto, schemi personalizzati, contesto condiviso |
| [Multi-Language](multi-language.md) | Generare artefatti in lingue diverse dall'inglese |
| [Supported Tools](supported-tools.md) | Le 25+ AI tools con cui OpenSpec si integra e dove finiscono i file |

### Quando avete bisogno di aiuto

| Doc | Cosa vi fornisce |
|-----|-------------------|
| [FAQ](faq.md) | Risposte rapide alle domande più frequenti |
| [Troubleshooting](troubleshooting.md) | Soluzioni concrete per fallimenti concreti |
| [Migration Guide](migration-guide.md) | Spostarsi dal workflow legacy a OPSX |

### Coordinare tra repository (beta)

| Doc | Cosa vi fornisce |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | Pianificare in un repo dedicato quando il vostro lavoro spazia su più repository o team |
| [Agent Contract](agent-contract.md) | Le superfici gestite dall'agente che sono leggibili dalla macchina tramite CLI |

## La versione di trenta secondi

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in vostro chat AI)  /opsx:explore           ← opzionale, ma un'ottima abitudine
4. Propose        (in vostro chat AI)  /opsx:propose add-dark-mode
5. Build          (in vostro chat AI)  /opsx:apply
6. Archive        (in vostro chat AI)  /opsx:archive
```

I passaggi 1 e 2 avvengono nel vostro terminale. Il resto avviene nel chat del vostro assistente AI. Questa divisione è l'unica cosa che vale la pena memorizzare, e [How Commands Work](how-commands-work.md) spiega esattamente perché. Il passo 3 è opzionale, ma iniziare con `/opsx:explore` quando non siete sicuri è l'abitudine più degna di essere sviluppata.

## Dove altro trovare aiuto

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) per domande, idee e aiuto.
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) per bug e richieste di funzionalità.
- **`openspec feedback "il vostro messaggio"`** invia il feedback direttamente dal vostro terminale (apre un issue su GitHub).

Avete trovato qualcosa in questa documentazione che è sbagliato, obsoleto o confuso? È un bug. Aprite un issue o una PR. Migliorare la documentazione è uno dei contributi più preziosi che possiate fare.