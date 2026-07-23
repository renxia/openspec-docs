# Per iniziare

Questa guida spiega come funziona OpenSpec dopo averlo installato e inizializzato. Per le istruzioni di installazione, consulta il [README principale](../index.md#quick-start) o la [Guida all'installazione](installation.md). Sei nuovo a tutta la documentazione? La [home della documentazione](index.md) mappa tutti i contenuti.

> **Dove devi digitare questi comandi?** Ci sono due posti, e confonderli è l'errore più comune all'inizio.
>
> - I comandi `openspec ...` (come `openspec init`) vengono eseguiti nel tuo **terminale**.
> - I comandi `/opsx:...` (come `/opsx:propose`) vengono eseguiti nella **chat del tuo assistente AI**, lo stesso spazio in cui gli chiederesti di scrivere codice.
>
> Non c'è una "modalità interattiva" separata da avviare. Devi solo digitare il comando con slash nella chat e il tuo assistente si occuperà del resto. Spiegazione completa: [Come funzionano i comandi](how-commands-work.md).

## I tuoi primi cinque minuti

L'intero ciclo, con ogni passo etichettato in base al luogo in cui avviene:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (opzionale: pensaci prima)
AI CHAT      /opsx:propose add-dark-mode      (L'AI redige il piano; tu lo revisioni)
AI CHAT      /opsx:apply                      (L'AI lo costruisce)
AI CHAT      /opsx:archive                    (specifiche aggiornate, modifica archiviata)
```

Due passaggi da terminale per la configurazione iniziale, poi lavorerai direttamente nella chat. Il resto di questa guida spiega nel dettaglio cosa fa ogni passaggio e cosa vedrai.

> **Non sei ancora sicuro di cosa costruire? Inizia con `/opsx:explore`.** È un partner di riflessione senza rischi che legge il tuo codebase, valuta le opzioni e trasforma un'idea vaga in un piano concreto, tutto prima che venga creato qualsiasi artefatto o codice. Quando il quadro è chiaro, passa il testimone a `/opsx:propose`. Questa è l'abitudine migliore per lavorare con un'AI che altrimenti costruirebbe con sicurezza la cosa sbagliata. Consulta la [Guida a Explore](explore.md).

## Come funziona

OpenSpec ti aiuta a concordare con il tuo assistente di codifica AI cosa costruire prima che venga scritto qualsiasi codice.

**Percorso rapido predefinito (profilo core):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (opzionale)
```

Inizia con `/opsx:explore` quando stai cercando di capire cosa fare, o passa direttamente a `/opsx:propose` quando già lo sai. Explore è incluso nel profilo predefinito, quindi è sempre disponibile quando lo desideri.

**Percorso esteso (selezione di flusso di lavoro personalizzato):**

```text
/opsx:new ──► /opsx:ff o /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Il profilo globale predefinito è `core`, che include `propose`, `explore`, `apply`, `sync` e `archive`. Puoi abilitare i comandi del flusso di lavoro esteso con `openspec config profile` e poi `openspec update`.

## Cosa crea OpenSpec

Dopo aver eseguito `openspec init`, il tuo progetto ha questa struttura:

```
openspec/
├── specs/              # Fonte di verità (comportamento del tuo sistema)
│   └── <domain>/
│       └── spec.md
├── changes/            # Aggiornamenti proposti (una cartella per modifica)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Specifiche delta (cosa sta cambiando)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Configurazione del progetto (opzionale)
```

**Due cartelle chiave:**

- **`specs/`** - La fonte di verità. Queste specifiche descrivono come si comporta attualmente il tuo sistema. Organizzate per dominio (es. `specs/auth/`, `specs/payments/`).
- **`changes/`** - Modifiche proposte. Ogni modifica ha la sua cartella con tutti gli artefatti correlati. Quando una modifica è completata, le sue specifiche vengono unite alla cartella principale `specs/`.

## Comprendere gli artefatti

Ogni cartella di modifica contiene artefatti che guidano il lavoro:

| Artifact | Scopo |
|----------|--------|
| `proposal.md` | Il "perché" e il "cosa" - cattura l'intento, l'ambito e l'approccio |
| `specs/` | Specifiche delta che mostrano i requisiti AGGIUNTI/MODIFICATI/RIMOSSI |
| `design.md` | Il "come" - approccio tecnico e decisioni architetturali |
| `tasks.md` | Checklist di implementazione con caselle di controllo |

**Gli artefatti si basano l'uno sull'altro:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            aggiorna man mano che impari
```

Puoi sempre tornare indietro e perfezionare gli artefatti precedenti man mano che acquisisci più informazioni durante l'implementazione.

## Come funzionano le specifiche delta

Le specifiche delta sono il concetto chiave di OpenSpec. Mostrano cosa sta cambiando rispetto alle tue specifiche attuali.

### Il formato

Le specifiche delta usano sezioni per indicare il tipo di modifica:

```markdown
# Delta per l'autenticazione

## REQUISITI AGGIUNTI

### Requisito: Autenticazione a due fattori
Il sistema DEVE richiedere un secondo fattore durante l'accesso.

#### Scenario: OTP richiesto
- DATO un utente con l'autenticazione a due fattori abilitata
- QUANDO l'utente invia credenziali valide
- ALLORA viene presentato un challenge OTP

## REQUISITI MODIFICATI

### Requisito: Timeout di sessione
Il sistema DOVRÀ far scadere le sessioni dopo 30 minuti di inattività.
(Precedentemente: 60 minuti)

#### Scenario: Timeout per inattività
- DATO una sessione autenticata
- QUANDO passano 30 minuti senza attività
- ALLORA la sessione viene invalidata

## REQUISITI RIMOSSI

### Requisito: Ricordami
(Deprecato a favore dell'autenticazione a due fattori)
```

### Cosa succede all'archiviazione

Quando archivi una modifica:

1. I requisiti **AGGIUNTI** vengono aggiunti alla specifica principale
2. I requisiti **MODIFICATI** sostituiscono la versione esistente
3. I requisiti **RIMOSSI** vengono eliminati dalla specifica principale

La cartella della modifica viene spostata in `openspec/changes/archive/` per la cronologia di audit.

## Esempio: La tua prima modifica

Vediamo passo passo come aggiungere la modalità scura a un'applicazione.

### 1. Avvia la modifica (predefinito)

```text
Tu: /opsx:propose add-dark-mode

AI:  Creata openspec/changes/add-dark-mode/
     ✓ proposal.md — perché lo stiamo facendo, cosa sta cambiando
     ✓ specs/       — requisiti e scenari
     ✓ design.md    — approccio tecnico
     ✓ tasks.md     — checklist di implementazione
     Pronta per l'implementazione!
```

Se hai abilitato il profilo di flusso di lavoro esteso, puoi anche fare questo in due passaggi: prima `/opsx:new` poi `/opsx:ff` (o `/opsx:continue` in modo incrementale).

### 2. Cosa viene creato

**proposal.md** - Cattura l'intento:

```markdown
# Proposta: Aggiungi la modalità scura

## Intento
Gli utenti hanno richiesto un'opzione per la modalità scura per ridurre l'affaticamento degli occhi durante l'utilizzo notturno.

## Ambito
- Aggiungi l'interruttore del tema nelle impostazioni
- Supporta il rilevamento delle preferenze di sistema
- Persisti la preferenza in localStorage

## Approccio
Usa le proprietà personalizzate CSS per la tematizzazione con un contesto React per la gestione dello stato.
```

**specs/ui/spec.md** - Delta che mostra i nuovi requisiti:

```markdown
# Delta per l'UI

## REQUISITI AGGIUNTI

### Requisito: Selezione del tema
Il sistema DOVRÀ consentire agli utenti di scegliere tra temi chiari e scuri.

#### Scenario: Interruttore manuale
- DATO un utente su qualsiasi pagina
- QUANDO l'utente clicca l'interruttore del tema
- ALLORA il tema cambia immediatamente
- E la preferenza persiste tra le sessioni

#### Scenario: Preferenza di sistema
- DATO un utente senza preferenze salvate
- QUANDO l'applicazione viene caricata
- ALLORA viene utilizzato lo schema di colori preferito dal sistema
```

**tasks.md** - Checklist di implementazione:

```markdown
# Attività

## 1. Infrastruttura del tema
- [ ] 1.1 Crea ThemeContext con stato chiaro/scuro
- [ ] 1.2 Aggiungi le proprietà personalizzate CSS per i colori
- [ ] 1.3 Implementa la persistenza in localStorage

## 2. Componenti UI
- [ ] 2.1 Crea il componente ThemeToggle
- [ ] 2.2 Aggiungi l'interruttore alla pagina delle impostazioni
- [ ] 2.3 Aggiorna Header per includere l'interruttore rapido

## 3. Stile
- [ ] 3.1 Definisci la palette di colori per il tema scuro
- [ ] 3.2 Aggiorna i componenti per usare le variabili CSS
```

### 3. Implementa

```text
Tu: /opsx:apply

AI:  Sto lavorando attraverso le attività...
     ✓ 1.1 Creato ThemeContext con stato chiaro/scuro
     ✓ 1.2 Aggiunte le proprietà personalizzate CSS a globals.css
     ✓ 1.3 Implementata la persistenza in localStorage
     ✓ 2.1 Creato il componente ThemeToggle
     ...
     Tutte le attività completate!
```

Durante l'implementazione, se scopri che il design necessita di modifiche, basta aggiornare l'artefatto e continuare.

### 4. Archivia

```text
Tu: /opsx:archive

AI:  Archiviazione di add-dark-mode in corso...
     ✓ Specifiche unite in openspec/specs/ui/spec.md
     ✓ Spostata in openspec/changes/archive/2025-01-24-add-dark-mode/
     Fatto! Pronto per la prossima funzionalità.
```

Le tue specifiche delta fanno ora parte delle specifiche principali, documentando come funziona il tuo sistema.

## Verifica e revisione

Usa la CLI per controllare lo stato delle tue modifiche:

```bash
# Elenca le modifiche attive
openspec list

# Visualizza i dettagli della modifica
openspec show add-dark-mode

# Valida la formattazione delle specifiche
openspec validate add-dark-mode

# Dashboard interattiva
openspec view
```

## Prossimi passaggi

- [Esplora prima](explore.md) - Usa `/opsx:explore` per riflettere su un'idea prima di impegnarti
- [Revisionare una modifica](reviewing-changes.md) - Cosa controllare nel piano redatto dall'AI, prima di scrivere qualsiasi codice
- [Scrivere buone specifiche](writing-specs.md) - Come sono un requisito e uno scenario solidi
- [Usare OpenSpec in un progetto esistente](existing-projects.md) - Inizia su una codebase brownfield di grandi dimensioni
- [Modifica e iterazione su una modifica](editing-changes.md) - Aggiorna gli artefatti, torna indietro, riconcilia le modifiche manuali
- [Concetti chiave in sintesi](overview.md) - Tutto il modello mentale in una sola pagina
- [Esempi e ricette](examples.md) - Modifiche reali, dall'inizio alla fine
- [Flussi di lavoro](workflows.md) - Modelli comuni e quando usare ogni comando
- [Comandi](commands.md) - Riferimento completo per tutti i comandi con slash
- [Concetti](concepts.md) - Comprensione più approfondita di specifiche, modifiche e schemi
- [Personalizzazione](customization.md) - Fai funzionare OpenSpec come preferisci
- [Store](stores-beta/user-guide.md) - La pianificazione coinvolge più repository o team? Tienila in un repository dedicato (beta)
- [FAQ](faq.md) e [Risoluzione dei problemi](troubleshooting.md) - Quando ti blocchi