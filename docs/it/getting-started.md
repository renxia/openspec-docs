# Introduzione

Questa guida spiega come funziona OpenSpec dopo averlo installato e inizializzato. Per le istruzioni di installazione, consulta il [README principale](index.md#quick-start).

## Come Funziona

OpenSpec ti aiuta, te e il tuo assistente di programmazione AI, a mettervi d'accordo su cosa costruire prima che venga scritto qualsiasi codice.

**Percorso rapido predefinito (profilo core):**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

**Percorso esteso (selezione del workflow personalizzato):**

```text
/opsx:new ──► /opsx:ff o /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Il profilo globale predefinito è `core`, che include `propose`, `explore`, `apply`, `sync` e `archive`. Puoi abilitare i comandi del workflow esteso con `openspec config profile` e poi `openspec update`.

## Cosa Crea OpenSpec

Dopo aver eseguito `openspec init`, il tuo progetto avrà questa struttura:

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
│       └── specs/      # Specifiche delta (cosa sta cambiando)
│           └── <dominio>/
│               └── spec.md
└── config.yaml         # Configurazione del progetto (opzionale)
```

**Due directory chiave:**

- **`specs/`** - La fonte di verità. Queste specifiche descrivono come si comporta attualmente il tuo sistema. Organizzate per dominio (es. `specs/auth/`, `specs/payments/`).

- **`changes/`** - Modifiche proposte. Ogni modifica ha la sua cartella con tutti gli artefatti correlati. Quando una modifica è completa, le sue specifiche vengono unite nella directory principale `specs/`.

## Comprendere gli Artefatti

Ogni cartella di modifica contiene artefatti che guidano il lavoro:

| Artefatto | Scopo |
|-----------|-------|
| `proposal.md` | Il "perché" e il "cosa" - cattura intento, ambito e approccio |
| `specs/` | Specifiche delta che mostrano i requisiti AGGIUNTI/MODIFICATI/RIMOSSI |
| `design.md` | Il "come" - approccio tecnico e decisioni architetturali |
| `tasks.md` | Checklist di implementazione con caselle di controllo |

**Gli artefatti si costruiscono l'uno sull'altro:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            aggiorna man mano che impari
```

Puoi sempre tornare indietro e perfezionare gli artefatti precedenti man mano che impari di più durante l'implementazione.

## Come Funzionano le Specifiche Delta

Le specifiche delta sono il concetto chiave in OpenSpec. Mostrano cosa sta cambiando rispetto alle tue specifiche attuali.

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
Il sistema DEVE far scadere le sessioni dopo 30 minuti di inattività.
(Precedentemente: 60 minuti)

#### Scenario: Timeout di inattività
- DATA una sessione autenticata
- QUANDO passano 30 minuti senza attività
- ALLORA la sessione viene invalidata

## Requisiti RIMOSSI

### Requisito: Ricordami
(Deprecato a favore di 2FA)
```

### Cosa Succede durante l'Archiviazione

Quando archivi una modifica:

1. I requisiti **AGGIUNTI** vengono aggiunti alla specifica principale
2. I requisiti **MODIFICATI** sostituiscono la versione esistente
3. I requisiti **RIMOSSI** vengono eliminati dalla specifica principale

La cartella della modifica viene spostata in `openspec/changes/archive/` per la cronologia di audit.

## Esempio: La Tua Prima Modifica

Procediamo con l'aggiunta della modalità scura a un'applicazione.

### 1. Avviare la Modifica (Predefinito)

```text
Tu: /opsx:propose add-dark-mode

AI:  Creata openspec/changes/add-dark-mode/
     ✓ proposal.md — perché lo stiamo facendo, cosa sta cambiando
     ✓ specs/       — requisiti e scenari
     ✓ design.md    — approccio tecnico
     ✓ tasks.md     — checklist di implementazione
     Pronto per l'implementazione!
```

Se hai abilitato il profilo del workflow esteso, puoi anche farlo in due passaggi: `/opsx:new` poi `/opsx:ff` (o `/opsx:continue` in modo incrementale).

### 2. Cosa Viene Creato

**proposal.md** - Cattura l'intento:

```markdown
# Proposta: Aggiungere Modalità Scura

## Intento
Gli utenti hanno richiesto un'opzione di modalità scura per ridurre l'affaticamento degli occhi durante l'uso notturno.

## Ambito
- Aggiungere un interruttore del tema nelle impostazioni
- Supportare il rilevamento delle preferenze di sistema
- Salvare la preferenza in localStorage

## Approccio
Usare le proprietà CSS personalizzate per il theming con un contesto React per la gestione dello stato.
```

**specs/ui/spec.md** - Delta che mostra i nuovi requisiti:

```markdown
# Delta per UI

## Requisiti AGGIUNTI

### Requisito: Selezione Tema
Il sistema DEVE consentire agli utenti di scegliere tra temi chiari e scuri.

#### Scenario: Interruttore manuale
- DATO un utente su qualsiasi pagina
- QUANDO l'utente clicca sull'interruttore del tema
- ALLORA il tema cambia immediatamente
- E la preferenza persiste tra le sessioni

#### Scenario: Preferenza di sistema
- DATO un utente senza preferenze salvate
- QUANDO l'applicazione si carica
- ALLORA viene usato lo schema di colore preferito dal sistema
```

**tasks.md** - Checklist di implementazione:

```markdown
# Attività

## 1. Infrastruttura Tema
- [ ] 1.1 Creare ThemeContext con stato chiaro/scuro
- [ ] 1.2 Aggiungere proprietà CSS personalizzate per i colori
- [ ] 1.3 Implementare la persistenza in localStorage

## 2. Componenti UI
- [ ] 2.1 Creare il componente ThemeToggle
- [ ] 2.2 Aggiungere l'interruttore alla pagina delle impostazioni
- [ ] 2.3 Aggiornare l'Header per includere un interruttore rapido

## 3. Stile
- [ ] 3.1 Definire la tavolozza colori del tema scuro
- [ ] 3.2 Aggiornare i componenti per usare le variabili CSS
```

### 3. Implementare

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

### 4. Archiviare

```
Tu: /opsx:archive

AI:  Archiviazione di add-dark-mode in corso...
     ✓ Specifiche unite in openspec/specs/ui/spec.md
     ✓ Spostato in openspec/changes/archive/2025-01-24-add-dark-mode/
     Fatto! Pronto per la prossima funzionalità.
```

Le tue specifiche delta ora fanno parte delle specifiche principali, documentando come funziona il tuo sistema.

## Verifica e Revisione

Usa la CLI per controllare le tue modifiche:

```bash
# Elenca le modifiche attive
openspec list

# Visualizza i dettagli della modifica
openspec show add-dark-mode

# Valida la formattazione della specifica
openspec validate add-dark-mode

# Dashboard interattiva
openspec view
```

## Prossimi Passi

- [Workflow](workflows.md) - Pattern comuni e quando usare ogni comando
- [Comandi](commands.md) - Riferimento completo per tutti i comandi slash
- [Concetti](concepts.md) - Comprensione più profonda di specifiche, modifiche e schemi
- [Personalizzazione](customization.md) - Fai funzionare OpenSpec a modo tuo