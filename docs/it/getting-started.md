# Iniziare

Questa guida spiega come funziona OpenSpec dopo che l'hai installato e inizializzato. Per le istruzioni di installazione, consulta il [README principale](../index.md#quick-start) o la [guida all'installazione](installation.md). Sei nuovo a tutto il set di documentazione? La [home della documentazione](index.md) mappa ogni cosa.

> **Dove digito questi comandi?** In due posti, e confonderli è lo scoglio iniziale più comune.
>
> - I comandi `openspec ...` (come `openspec init`) vengono eseguiti nel tuo **terminale**.
> - I comandi `/opsx:...` (come `/opsx:propose`) vengono eseguiti nella **chat del tuo assistente AI**, la stessa casella in cui gli chiedi di scrivere codice.
>
> Non c'è una "modalità interattiva" separata da avviare. Devi semplicemente digitare il comando con la barra nella chat e il tuo assistente prende il resto. Spiegazione completa: [Come funzionano i comandi](how-commands-work.md).

## I Tuoi Primi Cinque Minuti

L'intero ciclo, con ogni passaggio etichettato in base al luogo in cui avviene:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (opzionale: rifletterci prima)
AI CHAT      /opsx:propose add-dark-mode      (l'AI prepara il piano; tu lo rivedi)
AI CHAT      /opsx:apply                      (l'AI lo costruisce)
AI CHAT      /opsx:archive                    (le specifiche sono aggiornate, la modifica è archiviata)
```

Due passaggi nel terminale per l'impostazione, poi vivi nella chat. Il resto di questa guida scompone cosa fa ogni passaggio e cosa vedrai.

> **Non sei sicuro di cosa costruire? Inizia con `/opsx:explore`.** È un partner di pensiero senza rischi che legge la tua codebase, valuta le opzioni e affina un'idea vaga in un piano concreto, tutto prima che esista qualsiasi artefatto o codice. Quando il quadro è chiaro, passa a `/opsx:propose`. Questa è l'abitudine migliore per lavorare con un AI che altrimenti costruirebbe con sicurezza la cosa sbagliata. Vedi la [guida all'esplorazione](explore.md).

## Come Funziona

OpenSpec ti aiuta e il tuo assistente di codifica AI a concordare cosa costruire prima che venga scritto qualsiasi codice.

**Percorso rapido predefinito (profilo core):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (opzionale)
```

Inizia con `/opsx:explore` quando stai cercando di capire cosa fare, o passa direttamente a `/opsx:propose` quando lo sai già. L'Esplorazione è nel profilo predefinito, quindi è sempre disponibile quando ne hai bisogno.

**Percorso esteso (selezione del flusso di lavoro personalizzato):**

```text
/opsx:new ──► /opsx:ff o /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Il profilo globale predefinito è `core`, che include `propose`, `explore`, `apply`, `sync` e `archive`. Puoi abilitare i comandi del flusso di lavoro esteso con `openspec config profile` e poi `openspec update`.

## Cosa Crea OpenSpec

Dopo aver eseguito `openspec init`, il tuo progetto ha questa struttura:

```
openspec/
├── specs/              # Fonte della verità (il comportamento del tuo sistema)
│   └── <dominio>/
│       └── spec.md
├── changes/            # Aggiornamenti proposti (una cartella per ogni cambiamento)
│   └── <nome-cambiamento>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Spec delta (cosa sta cambiando)
│           └── <dominio>/
│               └── spec.md
└── config.yaml         # Configurazione del progetto (opzionale)
```

**Due cartelle chiave:**

- **`specs/`** - La fonte della verità. Queste specifiche descrivono come si comporta attualmente il tuo sistema. Organizzate per dominio (es. `specs/auth/`, `specs/payments/`).

- **`changes/`** - Modifiche proposte. Ogni cambiamento ha la sua cartella con tutti gli artefatti correlati. Quando un cambiamento è completato, le sue specifiche vengono fuse nella directory principale `specs/`.

## Comprendere gli Artefatti

Ogni cartella di cambiamento contiene artefatti che guidano il lavoro:

| Artefatto | Scopo |
|----------|---------|
| `proposal.md` | Il "perché" e il "cosa" - cattura l'intento, lo scopo e l'approccio |
| `specs/` | Spec delta che mostrano i requisiti Aggiunti/Modificati/Rimossi |
| `design.md` | Il "come" - approccio tecnico e decisioni architetturali |
| `tasks.md` | Lista di controllo dell'implementazione con caselle di spunta |

**Gli artefatti si basano l'uno sull'altro:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            aggiorna man mano che impari
```

Puoi sempre tornare indietro e affinare gli artefatti precedenti mentre impari di più durante l'implementazione.

## Come Funzionano le Spec Delta

Le spec delta sono il concetto chiave in OpenSpec. Mostrano cosa sta cambiando rispetto alle tue specifiche attuali.

### Il Formato

Le spec delta utilizzano sezioni per indicare il tipo di cambiamento:

```markdown
# Delta per Auth

## Requisiti AGGIUNTI

### Requisito: Autenticazione a due fattori
Il sistema DEVE richiedere un secondo fattore durante l'accesso.

#### Scenario: OTP richiesto
- DATO un utente con 2FA abilitata
- QUANDO l'utente invia credenziali valide
- ALLORA viene presentato un challenge OTP

## Requisiti MODIFICATI

### Requisito: Timeout di sessione
Il sistema DEVE scadere le sessioni dopo 30 minuti di inattività.
(Precedentemente: 60 minuti)

#### Scenario: timeout di inattività
- DATO una sessione autenticata
- QUANDO passano 30 minuti senza attività
- ALLORA la sessione viene invalidata

## Requisiti RIMOSSI

### Requisito: Ricordami
(Deprecato a favore del 2FA)
```

### Cosa Succede all'Archiviazione

Quando archivi un cambiamento:

1. I requisiti **AGGIUNTI** vengono aggiunti alla specifica principale
2. I requisiti **MODIFICATI** sostituiscono la versione esistente
3. I requisiti **RIMOSSI** vengono eliminati dalla specifica principale

La cartella di cambiamento si sposta in `openspec/changes/archive/` per la cronologia di audit.

## Esempio: Il Tuo Primo Cambiamento

Vediamo come aggiungere il dark mode a un'applicazione.

### 1. Avviare il Cambiamento (Predefinito)

```text
Tu: /opsx:propose add-dark-mode

AI:  Creata openspec/changes/add-dark-mode/
     ✓ proposal.md — perché stiamo facendo questo, cosa sta cambiando
     ✓ specs/       — requisiti e scenari
     ✓ design.md    — approccio tecnico
     ✓ tasks.md     — lista di controllo dell'implementazione
     Pronto per l'implementazione!
```

Se hai abilitato il profilo di flusso di lavoro esteso, puoi farlo anche in due passaggi: `/opsx:new` e poi `/opsx:ff` (o `/opsx:continue` incrementale).

### 2. Cosa Viene Creato

**proposal.md** - Cattura l'intento:

```markdown
# Proposta: Aggiungere il Dark Mode

## Intento
Gli utenti hanno richiesto un'opzione dark mode per ridurre l'affaticamento visivo
durante l'uso notturno.

## Scopo
- Aggiungere la commutazione del tema nelle impostazioni
- Supportare la rilevazione delle preferenze di sistema
- Persistere le preferenze in localStorage

## Approccio
Utilizzare proprietà CSS personalizzate per il tematizzazione con un contesto React
per la gestione dello stato.
```

**specs/ui/spec.md** - Delta che mostra i nuovi requisiti:

```markdown
# Delta per UI

## Requisiti AGGIUNTI

### Requisito: Selezione del tema
Il sistema DEVE consentire agli utenti di scegliere tra temi chiaro e scuro.

#### Scenario: Commutazione manuale
- DATO un utente su qualsiasi pagina
- QUANDO l'utente fa clic sulla commutazione del tema
- ALLORA il tema cambia immediatamente
- E la preferenza persiste attraverso le sessioni

#### Scenario: Preferenza di sistema
- DATO un utente senza preferenze salvate
- QUANDO l'applicazione si carica
- ALLORA viene utilizzato lo schema di colori preferito dal sistema
```

**tasks.md** - Lista di controllo dell'implementazione:

```markdown
# Compiti

## 1. Infrastruttura del Tema
- [ ] 1.1 Creare ThemeContext con stato chiaro/scuro
- [ ] 1.2 Aggiungere proprietà CSS personalizzate per i colori
- [ ] 1.3 Implementare la persistenza di localStorage

## 2. Componenti UI
- [ ] 2.1 Creare il componente ThemeToggle
- [ ] 2.2 Aggiungere la commutazione alla pagina delle impostazioni
- [ ] 2.3 Aggiornare l'Header per includere la commutazione rapida

## 3. Stile
- [ ] 3.1 Definire la palette di colori del tema scuro
- [ ] 3.2 Aggiornare i componenti per utilizzare le variabili CSS
```

### 3. Implementare

```
Tu: /opsx:apply

AI:  Lavorando sui compiti...
     ✓ 1.1 Creato ThemeContext con stato chiaro/scuro
     ✓ 1.2 Aggiunte proprietà CSS personalizzate a globals.css
     ✓ 1.3 Implementata la persistenza di localStorage
     ✓ 2.1 Creato il componente ThemeToggle
     ...
     Tutti i compiti completati!
```

Durante l'implementazione, se scopri che il design ha bisogno di aggiustamenti, aggiorna semplicemente l'artefatto e continua.

### 4. Archiviare

```
Tu: /opsx:archive

AI:  Archiviando add-dark-mode...
     ✓ Fuse le specifiche in openspec/specs/ui/spec.md
     ✓ Spostato a openspec/changes/archive/2025-01-24-add-dark-mode/
     Fatto! Pronto per la prossima funzionalità.
```

Le tue spec delta fanno ora parte delle specifiche principali, documentando come funziona il tuo sistema.

## Verifica e Revisione

Usa la CLI per controllare i tuoi cambiamenti:

```bash
# Elenca i cambiamenti attivi
openspec list

# Visualizza i dettagli del cambiamento
openspec show add-dark-mode

# Valida il formato della specifica
openspec validate add-dark-mode

# Dashboard interattiva
openspec view
```

## Prossimi Passi

- [Esplora Prima](explore.md) - Usa `/opsx:explore` per riflettere su un'idea prima di impegnarti
- [Usare OpenSpec in un Progetto Esistente](existing-projects.md) - Inizia con una codebase brownfield ampia
- [Modificare e Iterare su un Cambiamento](editing-changes.md) - Aggiorna gli artefatti, torna indietro, riconcilia le modifiche manuali
- [Concetti Fondamentali in Breve](overview.md) - L'intero modello mentale su una pagina
- [Esempi e Ricette](examples.md) - Cambiamenti reali, dall'inizio alla fine
- [Flussi di Lavoro](workflows.md) - Schemi comuni e quando usare ciascun comando
- [Comandi](commands.md) - Riferimento completo per tutti i comandi slash
- [Concetti](concepts.md) - Comprensione più approfondita delle specifiche, dei cambiamenti e degli schemi
- [Personalizzazione](customization.md) - Fai in modo che OpenSpec funzioni a tuo piacimento
- [Stores](stores-beta/user-guide.md) - Un pianificazione che copre repository o team? Tienila nel suo repository (beta)
- [FAQ](faq.md) e [Risoluzione dei Problemi](troubleshooting.md) - Quando ti blocchi