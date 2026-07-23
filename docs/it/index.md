---
layout: home

hero:
  name: "OpenSpec"
  text: "Sviluppo Guidato da Specifiche per Assistenti AI"
  tagline: Una specifica leggera per creare e gestire progetti di assistenti AI.
  actions:
    - theme: brand
      text: "Inizia"
      link: ./getting-started
    - theme: alt
      text: "Pagina iniziale"
      link: /
features:
  - title: "Flusso di lavoro Spec-First"
    details: "Definisci i requisiti prima di scrivere codice."
  - title: "Progettazione AI-Native"
    details: "Creato per Claude Code, Cursor, Windsurf e altri."
  - title: "Multi-lingua"
    details: "Documentazione disponibile in più lingue."
---

# Documentazione di OpenSpec

Benvenuto. Questa è la casa di tutto ciò che riguarda OpenSpec.

OpenSpec ti aiuta a concordare con il tuo assistente di codifica AI **cosa costruire prima che venga scritto qualsiasi codice.** Descrivi la modifica, l'AI redige una breve specifica e un elenco di attività, entrambi esaminate lo stesso piano, e poi il lavoro viene svolto. Niente più sorprese a metà strada quando scopri che l'AI ha costruito la cosa sbagliata.

Se non leggi nient'altro, leggi queste due pagine:

1. [Inizia](getting-started.md): installa, inizializza e pubblica la tua prima modifica.
2. [Come funzionano i comandi](how-commands-work.md): dove digiti effettivamente `/opsx:propose` (suggerimento: nella chat della tua AI, non nel terminale). Questo crea confusione a quasi tutti la prima volta.

La seconda pagina è più importante di quanto sembri. OpenSpec ha due parti: uno strumento da riga di comando che esegui nel terminale, e i comandi slash che invii al tuo assistente AI. Saper distinguere tra i due ti evita il momento di confusione più comune.

> **L'abitudine migliore da sviluppare per prima: quando non sei sicuro di cosa costruire, inizia con `/opsx:explore`.** È un partner di riflessione senza rischi che legge il tuo codice, valuta le opzioni e trasforma un'idea vaga in un piano concreto prima che venga creato qualsiasi artefatto o codice. La guida [Esplora prima](explore.md) spiega perché funziona.

## Scegli il tuo percorso

**Sei completamente nuovo.** Inizia con [Inizia](getting-started.md), poi sfoglia velocemente [Concetti chiave in sintesi](overview.md). Quando qualcosa ti sembra poco chiaro, il [FAQ](faq.md) e il [Glossario](glossary.md) sono a portata di mano.

**Hai un problema ma non un piano.** Questo è il caso più comune, e ha una risposta dedicata: [Esplora prima](explore.md). Usa `/opsx:explore` per pensarci insieme all'AI prima di impegnarti in qualsiasi cosa.

**Hai una codebase esistente di grandi dimensioni.** Non devi documentarla tutta. [Usare OpenSpec in un progetto esistente](existing-projects.md) mostra come iniziare con codice brownfield reale senza dover gestire l'intera codebase in una sola volta.

**Voglio solo farlo funzionare.** [Installa](installation.md), esegui `openspec init`, poi leggi [Come funzionano i comandi](how-commands-work.md) in modo che il tuo primo comando slash finisca nel posto giusto.

**Imparo con gli esempi.** La pagina [Esempi e Ricette](examples.md) accompagna attraverso modifiche reali dall'inizio alla fine: una piccola funzionalità, una correzione di bug, un refactor, un'esplorazione.

**L'AI ha appena redatto un piano — e adesso?** Leggilo. [Revisionare una modifica](reviewing-changes.md) mostra la verifica di due minuti che individua un errore di direzione mentre è ancora economico correggerlo, e [Scrivere specifiche valide](writing-specs.md) spiega di cosa è fatto un piano che vale la pena approvare.

**Lavoro in un team.** [OpenSpec in un team](team-workflow.md) mostra come una modifica si mappa su un branch e una pull request, e come i compagni di team revisionano un piano prima del codice.

**Vengo dal vecchio flusso di lavoro.** La [Guida alla migrazione](migration-guide.md) spiega cosa è cambiato e perché, e garantisce che il tuo lavoro esistente è al sicuro.

**Voglio adattarlo al processo del mio team.** [Personalizzazione](customization.md) tratta la configurazione del progetto, schemi personalizzati e contesto condiviso.

**Qualcosa non funziona.** [Risoluzione dei problemi](troubleshooting.md) raccoglie gli errori che le persone incontrano realmente, con le relative soluzioni.

## La mappa completa

### Inizia da qui

| Documento | Cosa ti offre |
|-----------|---------------|
| [Inizia](getting-started.md) | Installa, inizializza ed esegui la tua prima modifica da cima a fondo |
| [Esplora prima](explore.md) | Usa `/opsx:explore` per valutare un'idea prima di impegnarti |
| [Come funzionano i comandi](how-commands-work.md) | Dove vengono eseguiti i comandi slash, cosa significa "modalità interattiva", terminale vs chat |
| [Concetti chiave in sintesi](overview.md) | Tutto il modello mentale in una pagina: specifiche, modifiche, delta, archivio |
| [Installazione](installation.md) | npm, pnpm, yarn, bun, Nix e come verificare che l'installazione sia andata a buon fine |

### Usalo tutti i giorni

| Documento | Cosa ti offre |
|-----------|---------------|
| [Flussi di lavoro](workflows.md) | Modelli comuni e quando usare ogni comando |
| [Esempi e Ricette](examples.md) | Guide complete di modifiche reali, copiabili e incollabili |
| [Scrivere specifiche valide](writing-specs.md) | Come sono fatti un requisito e uno scenario solidi, e come dimensionare correttamente una modifica |
| [Revisionare una modifica](reviewing-changes.md) | La verifica di due minuti su un piano redatto prima che venga scritto qualsiasi codice |
| [OpenSpec in un team](team-workflow.md) | Come le modifiche si inseriscono in branch, pull request e revisioni |
| [Usare OpenSpec in un progetto esistente](existing-projects.md) | Adottare OpenSpec su una codebase brownfield di grandi dimensioni |
| [Modifica e iterazione su una modifica](editing-changes.md) | Aggiornare gli artefatti, tornare indietro, riconciliare modifiche manuali |
| [Comandi](commands.md) | Riferimento per ogni comando slash `/opsx:*` |
| [CLI](cli.md) | Riferimento per ogni comando da terminale `openspec` |

### Comprendilo a fondo

| Documento | Cosa ti offre |
|-----------|---------------|
| [Concetti](concepts.md) | La spiegazione dettagliata di specifiche, modifiche, artefatti, schemi e archivio |
| [Flusso di lavoro OPSX](opsx.md) | Perché il flusso di lavoro è fluido invece che suddiviso in fasi bloccate, più un'approfondimento sull'architettura |
| [Glossario](glossary.md) | Tutti i termini definiti in un unico posto |

### Adattalo alle tue esigenze

| Documento | Cosa ti offre |
|-----------|---------------|
| [Personalizzazione](customization.md) | Configurazione del progetto, schemi personalizzati, contesto condiviso |
| [Multi-lingua](multi-language.md) | Genera artefatti in lingue diverse dall'inglese |
| [Strumenti supportati](supported-tools.md) | I più di 25 strumenti AI con cui OpenSpec si integra, e dove vengono salvati i file |

### Quando hai bisogno di aiuto

| Documento | Cosa ti offre |
|-----------|---------------|
| [FAQ](faq.md) | Risposte rapide alle domande che le persone fanno più spesso |
| [Risoluzione dei problemi](troubleshooting.md) | Soluzioni concrete per errori concreti |
| [Guida alla migrazione](migration-guide.md) | Passare dal vecchio flusso di lavoro a OPSX |

### Coordinamento tra repository (beta)

| Documento | Cosa ti offre |
|-----------|---------------|
| [Store: Guida per l'utente](stores-beta/user-guide.md) | Pianifica in un repository dedicato quando il tuo lavoro coinvolge più repository o team |
| [Contratto Agente](agent-contract.md) | Le interfacce CLI leggibili dalle macchine su cui si basano gli agenti |

## La versione in trenta secondi

```text
1. Installa        npm install -g @fission-ai/openspec@latest
2. Inizializza     cd your-project && openspec init
3. Esplora        (nella chat della tua AI)  /opsx:explore           ← opzionale, ma un'abitudine eccellente
4. Proponi        (nella chat della tua AI)  /opsx:propose add-dark-mode
5. Costruisci          (nella chat della tua AI)  /opsx:apply
6. Archivia        (nella chat della tua AI)  /opsx:archive
```

I passaggi 1 e 2 avvengono nel tuo terminale. Il resto avviene nella chat del tuo assistente AI. Questa distinzione è l'unica cosa che vale la pena memorizzare, e [Come funzionano i comandi](how-commands-work.md) spiega esattamente perché. Il passaggio 3 è opzionale, ma iniziare con `/opsx:explore` quando non sei sicuro è l'abitudine più utile da sviluppare.

## Dove altro puoi trovare aiuto

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) per domande, idee e aiuto.
- **Problemi su GitHub:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) per bug e richieste di funzionalità.
- **`openspec feedback "tuo messaggio"`** invia feedback direttamente dal tuo terminale (apre un problema su GitHub).

Hai trovato qualcosa in questa documentazione che è sbagliato, obsoleto o poco chiaro? È un bug. Apri un problema o una pull request. I miglioramenti alla documentazione sono alcuni dei contributi più preziosi che puoi fare.