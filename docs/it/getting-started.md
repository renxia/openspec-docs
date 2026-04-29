# Introduzione

Questa guida spiega come funziona OpenSpec dopo averlo installato e inizializzato. Per le istruzioni di installazione, consulta il [README principale](index.md#quick-start).

## Come Funziona

OpenSpec ti aiuta, te e il tuo assistente AI per la programmazione, a concordare su cosa costruire prima che venga scritto alcun codice.

**Percorso rapido predefinito (profilo core):**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:archive
```

**Percorso esteso (selezione personalizzata del flusso di lavoro):**

```text
/opsx:new ──► /opsx:ff o /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Il profilo globale predefinito è `core`, che include `propose`, `explore`, `apply` e `archive`. Puoi abilitare i comandi del flusso di lavoro esteso con `openspec config profile` e poi `openspec update`.

## Cosa Crea OpenSpec

Dopo aver eseguito `openspec init`, il tuo progetto ha questa struttura:

```
openspec/
├── specs/              # Fonte di verità (il comportamento del tuo sistema)
│   └── <dominio>/
│       └── spec.md
├── changes/            # Aggiornamenti proposti (una cartella per modifica)
│   └── <nome-modifica>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Specifiche delta (ciò che cambia)
│           └── <dominio>/
│               └── spec.md
└── config.yaml         # Configurazione del progetto (opzionale)
```

**Due directory chiave:**

- **`specs/`** - La fonte di verità. Queste specifiche descrivono come si comporta attualmente il tuo sistema. Organizzate per dominio (es. `specs/auth/`, `specs/payments/`).

- **`changes/`** - Modifiche proposte. Ogni modifica ha la sua cartella con tutti gli artefatti correlati. Quando una modifica è completa, le sue specifiche vengono fuse nella directory principale `specs/`.

## Comprensione degli Artefatti

Ogni cartella di modifica contiene artefatti che guidano il lavoro:

| Artefatto | Scopo |
|----------|-------|
| `proposal.md` | Il "perché" e il "cosa" - cattura intento, portata e approccio |
| `specs/` | Specifiche delta che mostrano i requisiti AGGIUNTI/MODIFICATI/ELIMINATI |
| `design.md` | Il "come" - approccio tecnico e decisioni architetturali |
| `tasks.md` | Checklist di implementazione con caselle di controllo |

**Gli artefatti si basano gli uni sugli altri:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            aggiorna man mano che impari
```

Puoi sempre tornare indietro e raffinare gli artefatti precedenti man mano che impari di più durante l'implementazione.

## Come Funzionano le Specifiche Delta

Le specifiche delta sono il concetto chiave in OpenSpec. Mostrano cosa cambia rispetto alle tue specifiche attuali.

### Il Formato

Le specifiche delta usano sezioni per indicare il tipo di modifica:

```markdown
# Delta per Auth

## Requisiti AGGIUNTI

### Requisito: Autenticazione a Due Fattori
Il sistema DEVE richiedere un secondo fattore durante il login.

#### Scenario: OTP richiesto
- DATO un utente con 2FA abilitato
- QUANDO l'utente invia credenziali valide
- ALLORA viene presentata una sfida OTP

## Requisiti MODIFICATI

### Requisito: Timeout di Sessione
Il sistema FARÀ scadere le sessioni dopo 30 minuti di inattività.
(Precedentemente: 60 minuti)

#### Scenario: Timeout per inattività
- DATO una sessione autenticata
- QUANDO passano 30 minuti senza attività
- ALLORA la sessione viene invalidata

## Requisiti ELIMINATI

### Requisito: Ricordami
(Deprecato a favore del 2FA)
```

### Cosa Succede all'Archiviazione

Quando archivi una modifica:

1. I requisiti **AGGIUNTI** vengono aggiunti alla specifica principale
2. I requisiti **MODIFICATI** sostituiscono la versione esistente
3. I requisiti **ELIMINATI** vengono cancellati dalla specifica principale

La cartella della modifica viene spostata in `openspec/changes/archive/` per la cronologia di audit.

## Esempio: La Tua Prima Modifica

Esaminiamo l'aggiunta della modalità scura a un'applicazione.

### 1. Avvia la Modifica (Predefinito)

```text
Tu: /opsx:propose add-dark-mode

AI:  Creato openspec/changes/add-dark-mode/
     ✓ proposal.md — perché lo facciamo, cosa cambia
     ✓ specs/       — requisiti e scenari
     ✓ design.md    — approccio tecnico
     ✓ tasks.md     — checklist di implementazione
     Pronto per l'implementazione!
```

Se hai abilitato il profilo del flusso di lavoro esteso, puoi anche farlo in due passaggi: `/opsx:new` poi `/opsx:ff` (o `/opsx:continue` in modo incrementale).

### 2. Cosa Viene Creato

**proposal.md** - Cattura l'intento:

```markdown
# Proposta: Aggiungi Modalità Scura

## Intento
Gli utenti hanno richiesto un'opzione di modalità scura per ridurre l'affaticamento visivo
durante l'uso notturno.

## Portata
- Aggiungere il toggle del tema nelle impostazioni
- Supportare il rilevamento delle preferenze di sistema
- Persistere la preferenza in localStorage

## Approccio
Usare proprietà CSS personalizzate per il theming con un contesto React
per la gestione dello stato.
```

**specs/ui/spec.md** - Delta che mostra i nuovi requisiti:

```markdown
# Delta per UI

## Requisiti AGGIUNTI

### Requisito: Selezione del Tema
Il sistema PERMETTERÀ agli utenti di scegliere tra temi chiari e scuri.

#### Scenario: Toggle manuale
- DATO un utente su qualsiasi pagina
- QUANDO l'utente clicca sul toggle del tema
- ALLORA il tema cambia immediatamente
- E la preferenza persiste tra le sessioni

#### Scenario: Preferenza di sistema
- DATO un utente senza preferenza salvata
- QUANDO l'applicazione si carica
- ALLORA viene usato lo schema di colori preferito del sistema
```

**tasks.md** - Checklist di implementazione:

```markdown
# Attività

## 1. Infrastruttura del Tema
- [ ] 1.1 Creare ThemeContext con stato chiaro/scuro
- [ ] 1.2 Aggiungere proprietà CSS personalizzate per i colori
- [ ] 1.3 Implementare la persistenza in localStorage

## 2. Componenti UI
- [ ] 2.1 Creare il componente ThemeToggle
- [ ] 2.2 Aggiungere il toggle alla pagina delle impostazioni
- [ ] 2.3 Aggiornare l'Header per includere il toggle rapido

## 3. Styling
- [ ] 3.1 Definire la tavolozza di colori per il tema scuro
- [ ] 3.2 Aggiornare i componenti per usare le variabili CSS
```

### 3. Implementa

```
Tu: /opsx:apply

AI:  Lavorando sulle attività...
     ✓ 1.1 Creato ThemeContext con stato chiaro/scuro
     ✓ 1.2 Aggiunte proprietà CSS personalizzate a globals.css
     ✓ 1.3 Implementata la persistenza in localStorage
     ✓ 2.1 Creato il componente ThemeToggle
     ...
     Tutte le attività completate!
```

Durante l'implementazione, se scopri che il design necessita di aggiustamenti, aggiorna semplicemente l'artefatto e continua.

### 4. Archivia

```
Tu: /opsx:archive

AI:  Archiviazione di add-dark-mode...
     ✓ Specifiche fuse in openspec/specs/ui/spec.md
     ✓ Spostato in openspec/changes/archive/2025-01-24-add-dark-mode/
     Fatto! Pronto per la prossima funzionalità.
```

Le tue specifiche delta fanno ora parte delle specifiche principali, documentando come funziona il tuo sistema.

## Verifica e Revisione

Usa la CLI per controllare le tue modifiche:

```bash
# Elenca le modifiche attive
openspec list

# Visualizza i dettagli della modifica
openspec show add-dark-mode

# Valida la formattazione delle specifiche
openspec validate add-dark-mode

# Dashboard interattiva
openspec view
``

## Prossimi Passi

- [Flussi di Lavoro](workflows.md) - Pattern comuni e quando usare ogni comando
- [Comandi](commands.md) - Riferimento completo per tutti i comandi slash
- [Concetti](concepts.md) - Comprensione più profonda di specifiche, modifiche e schemi
- [Personalizzazione](customization.md) - Fai funzionare OpenSpec a modo tuo