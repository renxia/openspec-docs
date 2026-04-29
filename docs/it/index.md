---
layout: home

hero:
  name: "OpenSpec"
  text: "Sviluppo Guidato da Specifiche per Assistenti AI"
  tagline: Una specifica leggera per costruire e gestire progetti di assistenti AI.
  actions:
    - theme: brand
      text: Inizia
      link: ./getting-started
    - theme: alt
      text: Home
      link: /

features:
  - title: Flusso di Lavoro Spec-First
    details: Definisci i requisiti prima di scrivere codice.
  - title: Design AI-Native
    details: Costruito per Claude Code, Cursor, Windsurf e altri.
  - title: Multi-Lingua
    details: Documentazione disponibile in più lingue.
---


<details>
<summary><strong>Il framework di specifiche più amato.</strong></summary>

[![Stars](https://img.shields.io/github/stars/Fission-AI/OpenSpec?style=flat-square&label=Stars)](https://github.com/Fission-AI/OpenSpec/stargazers)
[![Downloads](https://img.shields.io/npm/dm/@fission-ai/openspec?style=flat-square&label=Downloads/mo)](https://www.npmjs.com/package/@fission-ai/openspec)
[![Contributors](https://img.shields.io/github/contributors/Fission-AI/OpenSpec?style=flat-square&label=Contributors)](https://github.com/Fission-AI/OpenSpec/graphs/contributors)

</details>
<p></p>
La nostra filosofia:

```text
→ fluido, non rigido
→ iterativo, non waterfall
→ semplice, non complesso
→ costruito per il brownfield, non solo per il greenfield
→ scalabile da progetti personali alle aziende
```

> [!TIP]
> **Nuovo flusso di lavoro disponibile!** Abbiamo ricostruito OpenSpec con un nuovo flusso di lavoro guidato dagli artefatti.
>
> Esegui `/opsx:propose "la tua idea"` per iniziare. → [Scopri di più qui](opsx.md)

<p align="center">
  Segui <a href="https://x.com/0xTab">@0xTab su X</a> per aggiornamenti · Unisciti al <a href="https://discord.gg/YctCnvvshC">Discord di OpenSpec</a> per aiuto e domande.
</p>

<!-- TODO: Aggiungi demo GIF di /opsx:propose → /opsx:archive workflow -->

## Vedi in azione

```text
Tu: /opsx:propose add-dark-mode
AI:  Creato openspec/changes/add-dark-mode/
     ✓ proposal.md — perché lo facciamo, cosa cambia
     ✓ specs/       — requisiti e scenari
     ✓ design.md    — approccio tecnico
     ✓ tasks.md     — checklist di implementazione
     Pronto per l'implementazione!

Tu: /opsx:apply
AI:  Implementazione dei task in corso...
     ✓ 1.1 Aggiungi provider del contesto del tema
     ✓ 1.2 Crea componente toggle
     ✓ 2.1 Aggiungi variabili CSS
     ✓ 2.2 Collega localStorage
     Tutti i task completati!

Tu: /opsx:archive
AI:  Archiviato in openspec/changes/archive/2025-01-23-add-dark-mode/
     Specifiche aggiornate. Pronto per la prossima funzionalità.
```

<details>
<summary><strong>Dashboard OpenSpec</strong></summary>

</details>

## Inizio Rapido

**Richiede Node.js 20.19.0 o superiore.**

Installa OpenSpec globalmente:

```bash
npm install -g @fission-ai/openspec@latest
```

Poi naviga alla directory del tuo progetto e inizializza:

```bash
cd your-project
openspec init
```

Ora comunica al tuo AI: `/opsx:propose <cosa-vuoi-costruire>`

Se vuoi il flusso di lavoro esteso (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), selezionalo con `openspec config profile` e applica con `openspec update`.

> [!NOTE]
> Non sei sicuro che il tuo strumento sia supportato? [Visualizza l'elenco completo](supported-tools.md) – supportiamo oltre 25 strumenti e in crescita.
>
> Funziona anche con pnpm, yarn, bun e nix. [Vedi le opzioni di installazione](installation.md).

## Documentazione

→ **[Iniziare](getting-started.md)**: primi passi<br>
→ **[Flussi di Lavoro](workflows.md)**: combinazioni e pattern<br>
→ **[Comandi](commands.md)**: comandi slash e skill<br>
→ **[CLI](cli.md)**: riferimento terminale<br>
→ **[Strumenti Supportati](supported-tools.md)**: integrazioni strumenti e percorsi di installazione<br>
→ **[Concetti](concepts.md)**: come tutto si incastra<br>
→ **[Multi-Lingua](multi-language.md)**: supporto multi-lingua<br>
→ **[Personalizzazione](customization.md)**: adattalo a te


## Perché OpenSpec?

Gli assistenti AI per la programmazione sono potenti ma imprevedibili quando i requisiti vivono solo nella cronologia delle chat. OpenSpec aggiunge un livello leggero di specifiche in modo che tu e l'AI si accordiate su cosa costruire prima che venga scritto qualsiasi codice.

- **Accordati prima di costruire** — umano e AI si allineano sulle specifiche prima che il codice venga scritto
- **Resta organizzato** — ogni modifica ha la sua cartella con proposta, specifiche, design e task
- **Lavora fluidamente** — aggiorna qualsiasi artefatto in qualsiasi momento, senza fasi rigide
- **Usa i tuoi strumenti** — funziona con oltre 20 assistenti AI tramite comandi slash

### Come ci confrontiamo

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Completo ma pesante. Fasi rigide, molto Markdown, configurazione Python. OpenSpec è più leggero e ti permette di iterare liberamente.

**vs. [Kiro](https://kiro.dev)** (AWS) — Potente ma sei bloccato nel loro IDE e limitato ai modelli Claude. OpenSpec funziona con gli strumenti che già usi.

**vs. niente** — Programmare con AI senza specifiche significa prompt vaghi e risultati imprevedibili. OpenSpec porta prevedibilità senza la cerimonia.

## Aggiornare OpenSpec

**Aggiorna il pacchetto**

```bash
npm install -g @fission-ai/openspec@latest
```

**Aggiorna le istruzioni dell'agente**

Esegui questo all'interno di ogni progetto per rigenerare la guida AI e assicurarti che gli ultimi comandi slash siano attivi:

```bash
openspec update
```

## Note sull'Uso

**Selezione del modello**: OpenSpec funziona al meglio con modelli ad alto ragionamento. Raccomandiamo Opus 4.5 e GPT 5.2 sia per la pianificazione che per l'implementazione.

**Igiene del contesto**: OpenSpec beneficia di una finestra di contesto pulita. Cancella il tuo contesto prima di iniziare l'implementazione e mantieni una buona igiene del contesto durante l'intera sessione.

## Contribuire

**Piccole correzioni** — Le correzioni di bug, le correzioni di refusi e i miglioramenti minori possono essere sottomessi direttamente come PR.

**Cambiamenti più grandi** — Per nuove funzionalità, refactor significativi o modifiche architetturali, per favore sottometti prima una proposta di modifica OpenSpec in modo che possiamo allinearci su intento e obiettivi prima che inizi l'implementazione.

Quando scrivi le proposte, tieni a mente la filosofia di OpenSpec: serviamo un'ampia varietà di utenti attraverso diversi agenti di codifica, modelli e casi d'uso. Le modifiche dovrebbero funzionare bene per tutti.

**Il codice generato dall'AI è benvenuto** — purché sia stato testato e verificato. Le PR contenenti codice generato dall'AI dovrebbero menzionare l'agente di codifica e il modello utilizzato (es. "Generato con Claude Code usando claude-opus-4-5-20251101").

### Sviluppo

- Installa le dipendenze: `pnpm install`
- Compila: `pnpm run build`
- Testa: `pnpm test`
- Sviluppa la CLI localmente: `pnpm run dev` o `pnpm run dev:cli`
- Commit convenzionali (una riga): `type(scope): subject`

## Altro

<details>
<summary><strong>Telemetria</strong></summary>

OpenSpec raccoglie statistiche anonime di utilizzo.

Raccogliamo solo i nomi dei comandi e la versione per capire i pattern di utilizzo. Nessun argomento, percorso, contenuto o PII. Disabilitato automaticamente nei CI.

**Disattivazione:** `export OPENSPEC_TELEMETRY=0` o `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>Maintainer e Consulenti</strong></summary>

Vedi [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) per l'elenco dei maintainer principali e dei consulenti che aiutano a guidare il progetto.

</details>



## Licenza

MIT