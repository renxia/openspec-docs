---
layout: home

hero:
  name: "OpenSpec"
  text: "Sviluppo Guidato dalle Specifiche per Assistenti AI"
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
  - title: Design Nativo per l'AI
    details: Progettato per Claude Code, Cursor, Windsurf e altri.
  - title: Multi-Lingua
    details: Documentazione disponibile in più lingue.
---


La nostra filosofia:

```text
→ fluido non rigido
→ iterativo non a cascata
→ semplice non complesso
→ progettato per brownfield non solo greenfield
→ scalabile da progetti personali a livello aziendale
```

> [!TIP]
> **Nuovo flusso di lavoro ora disponibile!** Abbiamo ricostruito OpenSpec con un nuovo flusso guidato dagli artefatti.
>
> Esegui `/opsx:propose "la tua idea"` per iniziare. → [Scopri di più qui](opsx.md)

<p align="center">
  Segui <a href="https://x.com/0xTab">@0xTab su X</a> per aggiornamenti · Unisciti al <a href="https://discord.gg/YctCnvvshC">Discord di OpenSpec</a> per aiuto e domande.
</p>

## Vederlo in azione

```text
Tu: /opsx:propose add-dark-mode
AI:  Creata openspec/changes/add-dark-mode/
     ✓ proposal.md — perché lo stiamo facendo, cosa sta cambiando
     ✓ specs/       — requisiti e scenari
     ✓ design.md    — approccio tecnico
     ✓ tasks.md     — checklist di implementazione
     Pronto per l'implementazione!

Tu: /opsx:apply
AI:  Implementazione dei task in corso...
     ✓ 1.1 Aggiungi provider del contesto del tema
     ✓ 1.2 Crea componente di toggle
     ✓ 2.1 Aggiungi variabili CSS
     ✓ 2.2 Collega localStorage
     Tutti i task completati!

Tu: /opsx:archive
AI:  Archiviato in openspec/changes/archive/2025-01-23-add-dark-mode/
     Specifiche aggiornate. Pronto per la prossima funzionalità.
```

<details>
<summary><strong>Pannello di Controllo OpenSpec</strong></summary>
</details>

## Avvio Rapido

**Richiede Node.js 20.19.0 o superiore.**

Installa OpenSpec globalmente:

```bash
npm install -g @fission-ai/openspec@latest
```

Quindi naviga nella directory del tuo progetto e inizializza:

```bash
cd your-project
openspec init
```

Ora di' alla tua AI: `/opsx:propose <quello-che-vuoi-costruire>`

Se desideri il flusso di lavoro esteso (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), selezionalo con `openspec config profile` e applicalo con `openspec update`.

> [!NOTE]
> Non sei sicuro se il tuo strumento è supportato? [Visualizza l'elenco completo](supported-tools.md) – supportiamo oltre 25 strumenti e il numero cresce.
>
> Funziona anche con pnpm, yarn, bun e nix. [Vedi le opzioni di installazione](installation.md).

## Documentazione

→ **[Guida Introduttiva](getting-started.md)**: primi passi<br>
→ **[Flussi di Lavoro](workflows.md)**: combinazioni e pattern<br>
→ **[Comandi](commands.md)**: comandi slash e skill<br>
→ **[CLI](cli.md)**: riferimento per il terminale<br>
→ **[Strumenti Supportati](supported-tools.md)**: integrazioni e percorsi di installazione<br>
→ **[Concetti](concepts.md)**: come tutto si incastra<br>
→ **[Multi-Lingua](multi-language.md)**: supporto multilingue<br>
→ **[Personalizzazione](customization.md)**: adattalo a te


## Perché OpenSpec?

Gli assistenti di programmazione AI sono potenti ma imprevedibili quando i requisiti vivono solo nella cronologia della chat. OpenSpec aggiunge un livello di specifica leggero in modo che ci si accordi su cosa costruire prima che venga scritto qualsiasi codice.

- **Accordati prima di costruire** — umano e AI si allineano sulle specifiche prima che il codice venga scritto
- **Rimani organizzato** — ogni modifica ha la sua cartella con proposta, specifiche, design e task
- **Lavora in modo fluido** — aggiorna qualsiasi artefatto in qualsiasi momento, senza fasi rigide
- **Usa i tuoi strumenti** — funziona con oltre 20 assistenti AI tramite comandi slash

### Come ci confrontiamo

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Approfondito ma pesante. Fasi rigide, molto Markdown, setup in Python. OpenSpec è più leggero e ti permette di iterare liberamente.

**vs. [Kiro](https://kiro.dev)** (AWS) — Potente ma sei vincolato al loro IDE e limitato ai modelli Claude. OpenSpec funziona con gli strumenti che già usi.

**vs. niente** — La programmazione AI senza specifiche significa prompt vaghi e risultati imprevedibili. OpenSpec porta prevedibilità senza la cerimonia.

## Aggiornare OpenSpec

**Aggiorna il pacchetto**

```bash
npm install -g @fission-ai/openspec@latest
```

**Aggiorna le istruzioni per l'agente**

Esegui questo all'interno di ogni progetto per rigenerare la guida AI e assicurarti che gli ultimi comandi slash siano attivi:

```bash
openspec update
```

## Note sull'Uso

**Selezione del modello**: OpenSpec funziona meglio con modelli ad alto ragionamento. Raccomandiamo Opus 4.5 e GPT 5.2 sia per la pianificazione che per l'implementazione.

**Igiene del contesto**: OpenSpec beneficia di una finestra di contesto pulita. Cancella il contesto prima di iniziare l'implementazione e mantieni una buona igiene del contesto durante l'intera sessione.

## Contribuire

**Piccole correzioni** — Fix di bug, correzioni di refusi e miglioramenti minori possono essere inviati direttamente come PR.

**Modifiche più grandi** — Per nuove funzionalità, refactoring significativi o modifiche architettoniche, invia prima una proposta di modifica OpenSpec in modo da poterci allineare su intenti e obiettivi prima che inizi l'implementazione.

Quando scrivi le proposte, tieni a mente la filosofia di OpenSpec: serviamo un'ampia varietà di utenti con diversi agenti di programmazione, modelli e casi d'uso. Le modifiche dovrebbero funzionare bene per tutti.

**Il codice generato dall'AI è benvenuto** — purché sia stato testato e verificato. Le PR che contengono codice generato dall'AI dovrebbero menzionare l'agente di programmazione e il modello utilizzati (es., "Generato con Claude Code usando claude-opus-4-5-20251101").

### Sviluppo

- Installa le dipendenze: `pnpm install`
- Build: `pnpm run build`
- Test: `pnpm test`
- Sviluppa la CLI localmente: `pnpm run dev` o `pnpm run dev:cli`
- Commit convenzionali (una riga): `type(scope): subject`

## Altro

<details>
<summary><strong>Telemetria</strong></summary>

OpenSpec raccoglie statistiche di utilizzo anonime.

Raccogliamo solo nomi di comandi e versione per capire i pattern di utilizzo. Nessun argomento, percorso, contenuto o PII. Disabilitato automaticamente in CI.

**Opt-out:** `export OPENSPEC_TELEMETRY=0` o `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>Mantainer & Consiglieri</strong></summary>

Vedi [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) per l'elenco dei mantainer principali e dei consiglieri che aiutano a guidare il progetto.

</details>



## Licenza

MIT