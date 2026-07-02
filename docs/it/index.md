---
layout: home

hero:
  name: "OpenSpec"
  text: "Sviluppo guidato dalle specifiche per assistenti AI"
  tagline: Una specifica leggera per costruire e gestire progetti di assistenti AI.
  actions:
    - theme: brand
      text: Inizia ora
      link: ./getting-started
    - theme: alt
      text: Home
      link: /

features:
  - title: Workflow Spec-First
    details: Definisci i requisiti prima di scrivere codice.
  - title: Design AI-Native
    details: Costruito per Claude Code, Cursor, Windsurf e altri.
  - title: Multi-Language
    details: Documentazione disponibile in diverse lingue.
---

# Documentazione OpenSpec

Benvenuti. Questa è la pagina principale di tutto ciò che riguarda OpenSpec.

OpenSpec vi aiuta a voi e al vostro assistente di codifica AI ad **concordare cosa costruire prima che venga scritto qualsiasi codice.** Voi descrivete il cambiamento, l'AI abbozza una breve specifica e un elenco di attività, entrambi guardate lo stesso piano e poi il lavoro viene svolto. Basta con la scoperta a metà del progetto che l'AI ha costruito la cosa sbagliata.

Se non leggete nient'altro, leggete queste due pagine:

1. [Getting Started](getting-started.md): come installare, inizializzare e inviare la vostra prima modifica.
2. [How Commands Work](how-commands-work.md): dove digitate effettivamente `/opsx:propose` (indizio: nel vostro chat AI, non nel terminale). Questo confonde quasi tutti una volta.

La seconda è più importante di quanto sembri. OpenSpec ha due metà: uno strumento a riga di comando che eseguite nel terminale e i slash commands che date al vostro assistente AI. Sapere quale sia cosa vi fa risparmiare il momento di confusione più comune.

> **L'abitudine migliore da costruire per prima: quando non siete sicuri cosa costruire, iniziate con `/opsx:explore`.** È un partner di pensiero senza rischi che legge il vostro codice, valuta le opzioni e affina un'idea vaga in un piano concreto prima che esista qualsiasi artefatto o codice. La guida [Explore First](explore.md) lo dimostra.

## Scegliete il vostro percorso

**Sono completamente nuovo.** Iniziate con [Getting Started](getting-started.md), poi scorrete [Core Concepts at a Glance](overview.md). Quando qualcosa vi sembra misterioso, [FAQ](faq.md) e [Glossary](glossary.md) sono vicini.

**Ho un problema ma non ho un piano.** Questo è il caso comune e ha una risposta dedicata: [Explore First](explore.md). Usate `/opsx:explore` per pensarci con l'AI prima di impegnarvi in qualsiasi cosa.

**Ho una grande codebase esistente.** Non documentate tutto. [Using OpenSpec in an Existing Project](existing-projects.md) mostra come iniziare su codice reale (brownfield) senza cercare di fare troppo.

**Voglio solo farlo funzionare.** [Install](installation.md), eseguite `openspec init`, poi leggete [How Commands Work](how-commands-work.md) in modo che il vostro primo slash command atterri nel posto giusto.

**Imparo dall'esempio.** La pagina [Examples & Recipes](examples.md) illustra cambiamenti reali dall'inizio alla fine: una piccola funzionalità, una correzione di bug, un refactoring, un'esplorazione.

**Vengo dal vecchio workflow.** La guida [Migration Guide](migration-guide.md) spiega cosa è cambiato e perché, e garantisce che il vostro lavoro esistente sia al sicuro.

**Voglio adattarlo al processo del mio team.** [Customization](customization.md) copre la configurazione del progetto, gli schemi personalizzati e il contesto condiviso.

**Qualcosa non funziona.** [Troubleshooting](troubleshooting.md) raccoglie i fallimenti che le persone incontrano realmente, con soluzioni.

## La mappa completa

### Iniziate qui

| Doc | Cosa offre |
|-----|-------------------|
| [Getting Started](getting-started.md) | Installazione, inizializzazione ed esecuzione del vostro primo cambiamento dall'inizio alla fine |
| [Explore First](explore.md) | Usare `/opsx:explore` per pensare a un'idea prima di impegnarsi |
| [How Commands Work](how-commands-work.md) | Dove vengono eseguiti i slash commands, cosa significa "modalità interattiva", terminale vs chat |
| [Core Concepts at a Glance](overview.md) | L'intero modello mentale su una pagina: specifiche, cambiamenti, delta, archivio |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix e come verificare che abbia funzionato |

### Usatelo giorno per giorno

| Doc | Cosa offre |
|-----|-------------------|
| [Workflows](workflows.md) | Schemi comuni e quando usare ciascun comando |
| [Examples & Recipes](examples.md) | Esempi completi di cambiamenti reali, pronti da copiare e incollare |
| [Using OpenSpec in an Existing Project](existing-projects.md) | Adottare OpenSpec su una codebase brownfield di grandi dimensioni |
| [Editing & Iterating on a Change](editing-changes.md) | Aggiornare gli artefatti, tornare indietro, riconciliare le modifiche manuali |
| [Commands](commands.md) | Riferimento per ogni slash command `/opsx:*` |
| [CLI](cli.md) | Riferimento per ogni comando terminale `openspec` |

### Comprendetelo a fondo

| Doc | Cosa offre |
|-----|-------------------|
| [Concepts](concepts.md) | La spiegazione estesa di specifiche, cambiamenti, artefatti, schemi e archivio |
| [OPSX Workflow](opsx.md) | Perché il workflow è fluido anziché bloccato in fase, più un approfondimento sull'architettura |
| [Glossary](glossary.md) | Ogni termine definito in un unico posto |

### Rendetelo vostro

| Doc | Cosa offre |
|-----|-------------------|
| [Customization](customization.md) | Configurazione del progetto, schemi personalizzati, contesto condiviso |
| [Multi-Language](multi-language.md) | Generare artefatti in lingue diverse dall'inglese |
| [Supported Tools](supported-tools.md) | I 25+ strumenti AI con cui OpenSpec si integra e dove atterrano i file |

### Quando avete bisogno di aiuto

| Doc | Cosa offre |
|-----|-------------------|
| [FAQ](faq.md) | Risposte rapide alle domande che le persone fanno più spesso |
| [Troubleshooting](troubleshooting.md) | Soluzioni concrete per fallimenti concreti |
| [Migration Guide](migration-guide.md) | Passare dal vecchio workflow a OPSX |

### Coordinamento tra repository (beta)

| Doc | Cosa offre |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | Pianificare nel proprio repo quando il vostro lavoro copre più repository o team |
| [Agent Contract](agent-contract.md) | Le interfacce CLI leggibili dalle macchine che gli agenti gestiscono |

## La versione di trenta secondi

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in AI chat)  /opsx:explore           ← opzionale, ma un'ottima abitudine
4. Propose        (in AI chat)  /opsx:propose add-dark-mode
5. Build          (in AI chat)  /opsx:apply
6. Archive        (in AI chat)  /opsx:archive
```

I passaggi 1 e 2 avvengono nel vostro terminale. Il resto avviene nella chat del vostro assistente AI. Questa divisione è l'unica cosa da memorizzare, e [How Commands Work](how-commands-work.md) spiega esattamente perché. Il passaggio 3 è facoltativo, ma iniziare con `/opsx:explore` quando non siete sicuri è l'abitudine più degna di essere coltivata.

## Dove cercare altro aiuto

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) per domande, idee e aiuto.
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) per bug e richieste di funzionalità.
- **`openspec feedback "il tuo messaggio"`** invia un feedback direttamente dal vostro terminale (apre un problema su GitHub).

Avete trovato qualcosa in questa documentazione che è sbagliato, obsoleto o confuso? È un bug. Aprite un issue o una PR. I miglioramenti della documentazione sono alcune delle contribuzioni più preziose che potete fare.