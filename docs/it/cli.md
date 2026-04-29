# Riferimento CLI

La CLI OpenSpec (`openspec`) fornisce comandi terminal per la configurazione del progetto, la validazione, l'ispezione dello stato e la gestione. Questi comandi integrano i comandi AI slash (come `/opsx:propose`) documentati in [Comandi](commands.md).

## Riepilogo

| Categoria | Comandi | Scopo |
|-----------|---------|-------|
| **Configurazione** | `init`, `update` | Inizializzare e aggiornare OpenSpec nel progetto |
| **Esplorazione** | `list`, `view`, `show` | Esplorare modifiche e specifiche |
| **Validazione** | `validate` | Verificare modifiche e specifiche per problemi |
| **Ciclo di vita** | `archive` | Finalizzare le modifiche completate |
| **Flusso di lavoro** | `status`, `instructions`, `templates`, `schemas` | Supporto al flusso di lavoro basato su artefatti |
| **Schemi** | `schema init`, `schema fork`, `schema validate`, `schema which` | Creare e gestire flussi di lavoro personalizzati |
| **Configurazione** | `config` | Visualizzare e modificare le impostazioni |
| **Utilità** | `feedback`, `completion` | Feedback e integrazione con la shell |

## Comandi per Umano vs Agente

La maggior parte dei comandi CLI è progettata per l'**uso umano** in un terminale. Alcuni comandi supportano anche l'**uso da parte di agenti/script** tramite output JSON.

### Comandi Solo per Umano

Questi comandi sono interattivi e progettati per l'uso nel terminale:

| Comando | Scopo |
|---------|-------|
| `openspec init` | Inizializza il progetto (prompt interattivi) |
| `openspec view` | Dashboard interattiva |
| `openspec config edit` | Apri la configurazione nell'editor |
| `openspec feedback` | Invia feedback tramite GitHub |
| `openspec completion install` | Installa i completamenti della shell |

### Comandi Compatibili con Agente

Questi comandi supportano l'output `--json` per l'uso programmatico da parte di agenti AI e script:

| Comando | Umano | Agente |
|---------|-------|--------|
| `openspec list` | Sfoglia modifiche/specifiche | `--json` per dati strutturati |
| `openspec show <item>` | Leggi contenuto | `--json` per l'analisi |
| `openspec validate` | Controlla problemi | `--all --json` per validazione in blocco |
| `openspec status` | Vedi progresso degli artifact | `--json` per stato strutturato |
| `openspec instructions` | Ottieni prossimi passi | `--json` per istruzioni all'agente |
| `openspec templates` | Trova percorsi dei template | `--json` per risoluzione percorsi |
| `openspec schemas` | Elenca gli schemi disponibili | `--json` per scoperta schemi |

---

## Opzioni Globali

Queste opzioni funzionano con tutti i comandi:

| Opzione | Descrizione |
|---------|-------------|
| `--version`, `-V` | Mostra il numero di versione |
| `--no-color` | Disabilita l'output a colori |
| `--help`, `-h` | Mostra l'aiuto per il comando |

---

## Comandi di Setup

### `openspec init`

Inizializza OpenSpec nel tuo progetto. Crea la struttura delle cartelle e configura le integrazioni con gli strumenti AI.

Il comportamento predefinito utilizza i valori predefiniti della configurazione globale: profilo `core`, consegna `both`, workflow `propose, explore, apply, archive`.

```
openspec init [path] [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `path` | No | Directory di destinazione (predefinita: directory corrente) |

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--tools <list>` | Configura gli strumenti AI in modo non interattivo. Usa `all`, `none` o una lista separata da virgole |
| `--force` | Pulizia automatica dei file legacy senza richiesta di conferma |
| `--profile <profile>` | Sovrascrivi il profilo globale per questa esecuzione di init (`core` o `custom`) |

`--profile custom` utilizza i workflow attualmente selezionati nella configurazione globale (`openspec config profile`).

**ID strumenti supportati (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

**Esempi:**

```bash
# Inizializzazione interattiva
openspec init

# Inizializza in una directory specifica
openspec init ./my-project

# Non interattivo: configura per Claude e Cursor
openspec init --tools claude,cursor

# Configura per tutti gli strumenti supportati
openspec init --tools all

# Sovrascrivi il profilo per questa esecuzione
openspec init --profile core

# Salta i prompt e pulisci automaticamente i file legacy
openspec init --force
```

**Cosa crea:**

```
openspec/
├── specs/              # Le tue specifiche (fonte di verità)
├── changes/            # Modifiche proposte
└── config.yaml         # Configurazione del progetto

.claude/skills/         # Skill di Claude Code (se claude selezionato)
.cursor/skills/         # Skill di Cursor (se cursor selezionato)
.cursor/commands/       # Comandi OPSX di Cursor (se la consegna include i comandi)
... (altre configurazioni degli strumenti)
```

---

### `openspec update`

Aggiorna i file di istruzioni di OpenSpec dopo l'aggiornamento della CLI. Rigenera i file di configurazione degli strumenti AI utilizzando il tuo profilo globale attuale, i workflow selezionati e la modalità di consegna.

```
openspec update [path] [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `path` | No | Directory di destinazione (predefinita: directory corrente) |

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--force` | Forza l'aggiornamento anche quando i file sono aggiornati |

**Esempio:**

```bash
# Aggiorna i file di istruzioni dopo l'aggiornamento npm
npm update @fission-ai/openspec
openspec update
```

---

## Comandi di Sfogliatura

### `openspec list`

Elenca le modifiche o le specifiche nel tuo progetto.

```
openspec list [options]
```

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--specs` | Elenca le specifiche invece delle modifiche |
| `--changes` | Elenca le modifiche (predefinito) |
| `--sort <order>` | Ordina per `recent` (predefinito) o `name` |
| `--json` | Output come JSON |

**Esempi:**

```bash
# Elenca tutte le modifiche attive
openspec list

# Elenca tutte le specifiche
openspec list --specs

# Output JSON per gli script
openspec list --json
```

**Output (testo):**

```
Modifiche attive:
  add-dark-mode     Supporto al cambio tema UI
  fix-login-bug     Gestione timeout sessione
```

---

### `openspec view`

Visualizza una dashboard interattiva per esplorare specifiche e modifiche.

```
openspec view
```

Apre un'interfaccia basata su terminale per navigare le specifiche e le modifiche del tuo progetto.

---

### `openspec show`

Mostra i dettagli di una modifica o specifica.

```
openspec show [item-name] [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `item-name` | No | Nome della modifica o specifica (viene richiesto se omesso) |

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--type <type>` | Specifica il tipo: `change` o `spec` (rilevato automaticamente se non ambiguo) |
| `--json` | Output come JSON |
| `--no-interactive` | Disabilita i prompt |

**Opzioni specifiche per le modifiche:**

| Opzione | Descrizione |
|---------|-------------|
| `--deltas-only` | Mostra solo le specifiche delta (modalità JSON) |

**Opzioni specifiche per le specifiche:**

| Opzione | Descrizione |
|---------|-------------|
| `--requirements` | Mostra solo i requisiti, escludendo gli scenari (modalità JSON) |
| `--no-scenarios` | Esclude il contenuto degli scenari (modalità JSON) |
| `-r, --requirement <id>` | Mostra un requisito specifico tramite indice basato su 1 (modalità JSON) |

**Esempi:**

```bash
# Selezione interattiva
openspec show

# Mostra una modifica specifica
openspec show add-dark-mode

# Mostra una specifica specifica
openspec show auth --type spec

# Output JSON per l'analisi
openspec show add-dark-mode --json
```

---

## Comandi di Validazione

### `openspec validate`

Valida modifiche e specifiche per problemi strutturali.

```
openspec validate [item-name] [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `item-name` | No | Elemento specifico da validare (viene richiesto se omesso) |

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--all` | Valida tutte le modifiche e le specifiche |
| `--changes` | Valida tutte le modifiche |
| `--specs` | Valida tutte le specifiche |
| `--type <type>` | Specifica il tipo quando il nome è ambiguo: `change` o `spec` |
| `--strict` | Abilita la modalità di validazione rigorosa |
| `--json` | Output come JSON |
| `--concurrency <n>` | Massimo numero di validazioni parallele (predefinito: 6, o variabile d'ambiente `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Disabilita i prompt |

**Esempi:**

```bash
# Validazione interattiva
openspec validate

# Valida una modifica specifica
openspec validate add-dark-mode

# Valida tutte le modifiche
openspec validate --changes

# Valida tutto con output JSON (per CI/script)
openspec validate --all --json

# Validazione rigorosa con parallelismo aumentato
openspec validate --all --strict --concurrency 12
```

**Output (testo):**

```
Validazione di add-dark-mode...
  ✓ proposal.md valido
  ✓ specs/ui/spec.md valido
  ⚠ design.md: sezione "Technical Approach" mancante

1 avviso trovato
```

**Output (JSON):**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: sezione 'Technical Approach' mancante"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## Comandi del Ciclo di Vita

### `openspec archive`

Archivia una modifica completata e unisce le specifiche delta nelle specifiche principali.

```
openspec archive [change-name] [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `change-name` | No | Modifica da archiviare (viene richiesto se omesso) |

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `-y, --yes` | Salta i prompt di conferma |
| `--skip-specs` | Salta gli aggiornamenti delle specifiche (per modifiche solo di infrastruttura/strumenti/documentazione) |
| `--no-validate` | Salta la validazione (richiede conferma) |

**Esempi:**

```bash
# Archiviazione interattiva
openspec archive

# Archivia una modifica specifica
openspec archive add-dark-mode

# Archivia senza prompt (CI/script)
openspec archive add-dark-mode --yes

# Archivia una modifica agli strumenti che non influisce sulle specifiche
openspec archive update-ci-config --skip-specs
```

**Cosa fa:**

1. Valida la modifica (a meno che non sia `--no-validate`)
2. Chiede conferma (a meno che non sia `--yes`)
3. Unisce le specifiche delta in `openspec/specs/`
4. Sposta la cartella della modifica in `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Comandi del Workflow

Questi comandi supportano il workflow OPSX guidato dagli artifact. Sono utili sia per gli umani che controllano il progresso sia per gli agenti che determinano i prossimi passi.

### `openspec status`

Visualizza lo stato di completamento degli artifact per una modifica.

```
openspec status [options]
```

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--change <id>` | Nome della modifica (viene richiesto se omesso) |
| `--schema <name>` | Sovrascrivi lo schema (rilevato automaticamente dalla configurazione della modifica) |
| `--json` | Output come JSON |

**Esempi:**

```bash
# Controllo stato interattivo
openspec status

# Stato per una modifica specifica
openspec status --change add-dark-mode

# JSON per l'uso da parte di un agente
openspec status --change add-dark-mode --json
```

**Output (testo):**

```
Modifica: add-dark-mode
Schema: spec-driven
Progresso: 2/4 artifact completati

[x] proposal
[ ] design
[x] specs
[-] tasks (bloccato da: design)
```

**Output (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done"},
    {"id": "design", "outputPath": "design.md", "status": "ready"},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done"},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

Ottieni istruzioni arricchite per creare un artifact o applicare i task. Utilizzato dagli agenti AI per capire cosa creare dopo.

```
openspec instructions [artifact] [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `artifact` | No | ID dell'artifact: `proposal`, `specs`, `design`, `tasks` o `apply` |

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--change <id>` | Nome della modifica (obbligatorio in modalità non interattiva) |
| `--schema <name>` | Sovrascrivi lo schema |
| `--json` | Output come JSON |

**Caso speciale:** Usa `apply` come artifact per ottenere le istruzioni di implementazione dei task.

**Esempi:**

```bash
# Ottieni istruzioni per il prossimo artifact
openspec instructions --change add-dark-mode

# Ottieni istruzioni per un artifact specifico
openspec instructions design --change add-dark-mode

# Ottieni istruzioni di applicazione/implementazione
openspec instructions apply --change add-dark-mode

# JSON per il consumo da parte di un agente
openspec instructions design --change add-dark-mode --json
```

**L'output include:**

- Contenuto del template per l'artifact
- Contesto del progetto dalla configurazione
- Contenuto dagli artifact dipendenti
- Regole per artifact dalla configurazione

---

### `openspec templates`

Mostra i percorsi dei template risolti per tutti gli artifact in uno schema.

```
openspec templates [options]
```

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--schema <name>` | Schema da ispezionare (predefinito: `spec-driven`) |
| `--json` | Output come JSON |

**Esempi:**

```bash
# Mostra i percorsi dei template per lo schema predefinito
openspec templates

# Mostra i template per uno schema personalizzato
openspec templates --schema my-workflow

# JSON per uso programmatico
openspec templates --json
```

**Output (testo):**

```
Schema: spec-driven

Template:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Elenca gli schemi di workflow disponibili con le loro descrizioni e i flussi degli artifact.

```
openspec schemas [options]
```

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--json` | Output come JSON |

**Esempio:**

```bash
openspec schemas
```

**Output:**

```
Schemi disponibili:

  spec-driven (pacchetto)
    Il workflow di sviluppo guidato da specifiche predefinito
    Flusso: proposal → specs → design → tasks

  my-custom (progetto)
    Workflow personalizzato per questo progetto
    Flusso: research → proposal → tasks
```

---

## Comandi Schema

Comandi per creare e gestire gli schema personalizzati dei workflow.

### `openspec schema init`

Crea un nuovo schema locale al progetto.

```
openspec schema init <name> [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `name` | Sì | Nome dello schema (kebab-case) |

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--description <text>` | Descrizione dello schema |
| `--artifacts <list>` | ID degli artefatti separati da virgola (predefinito: `proposal,specs,design,tasks`) |
| `--default` | Imposta come schema predefinito del progetto |
| `--no-default` | Non chiedere di impostare come predefinito |
| `--force` | Sovrascrivi uno schema esistente |
| `--json` | Output in formato JSON |

**Esempi:**

```bash
# Creazione interattiva dello schema
openspec schema init research-first

# Non interattivo con artefatti specifici
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**Cosa viene creato:**

```
openspec/schemas/<name>/
├── schema.yaml           # Definizione dello schema
└── templates/
    ├── proposal.md       # Modello per ogni artefatto
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Copia uno schema esistente nel tuo progetto per la personalizzazione.

```
openspec schema fork <source> [name] [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `source` | Sì | Schema da copiare |
| `name` | No | Nuovo nome dello schema (predefinito: `<source>-custom`) |

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--force` | Sovrascrivi la destinazione esistente |
| `--json` | Output in formato JSON |

**Esempio:**

```bash
# Fork dello schema integrato spec-driven
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Valida la struttura e i modelli di uno schema.

```
openspec schema validate [name] [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `name` | No | Schema da validare (valida tutti se omesso) |

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--verbose` | Mostra i passaggi dettagliati della validazione |
| `--json` | Output in formato JSON |

**Esempio:**

```bash
# Validare uno schema specifico
openspec schema validate my-workflow

# Validare tutti gli schema
openspec schema validate
```

---

### `openspec schema which`

Mostra da dove risolve uno schema (utile per il debug della precedenza).

```
openspec schema which [name] [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `name` | No | Nome dello schema |

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--all` | Elenca tutti gli schema con le loro sorgenti |
| `--json` | Output in formato JSON |

**Esempio:**

```bash
# Controllare da dove proviene uno schema
openspec schema which spec-driven
```

**Output:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Precedenza degli schema:**

1. Progetto: `openspec/schemas/<name>/`
2. Utente: `~/.local/share/openspec/schemas/<name>/`
3. Pacchetto: Schema integrati

---

## Comandi di Configurazione

### `openspec config`

Visualizza e modifica la configurazione globale di OpenSpec.

```
openspec config <subcommand> [options]
```

**Sotto-comandi:**

| Sotto-comando | Descrizione |
|---------------|-------------|
| `path` | Mostra la posizione del file di configurazione |
| `list` | Mostra tutte le impostazioni correnti |
| `get <key>` | Ottiene un valore specifico |
| `set <key> <value>` | Imposta un valore |
| `unset <key>` | Rimuove una chiave |
| `reset` | Ripristina i valori predefiniti |
| `edit` | Apre in `$EDITOR` |
| `profile [preset]` | Configura il profilo del workflow in modo interattivo o tramite un preset |

**Esempi:**

```bash
# Mostra il percorso del file di configurazione
openspec config path

# Elenca tutte le impostazioni
openspec config list

# Ottieni un valore specifico
openspec config get telemetry.enabled

# Imposta un valore
openspec config set telemetry.enabled false

# Imposta esplicitamente un valore stringa
openspec config set user.name "My Name" --string

# Rimuovi un'impostazione personalizzata
openspec config unset user.name

# Ripristina tutta la configurazione
openspec config reset --all --yes

# Modifica la configurazione nel tuo editor
openspec config edit

# Configura il profilo con una procedura guidata basata sulle azioni
openspec config profile

# Preset rapido: cambia i workflow in core (mantiene la modalità di consegna)
openspec config profile core
```

`openspec config profile` inizia con un riepilogo dello stato attuale, poi ti permette di scegliere:
- Cambia consegna + workflow
- Cambia solo la consegna
- Cambia solo i workflow
- Mantieni le impostazioni attuali (esci)

Se mantieni le impostazioni attuali, non vengono scritte modifiche e non viene mostrato un prompt di aggiornamento.
Se non ci sono modifiche alla configurazione ma i file del progetto attuale non sono sincronizzati con il tuo profilo/consegna globale, OpenSpec mostrerà un avviso e suggerirà di eseguire `openspec update`.
Premendo `Ctrl+C` si annulla pulitamente il flusso (senza stack trace) e si esce con il codice `130`.
Nella checklist dei workflow, `[x]` significa che il workflow è selezionato nella configurazione globale. Per applicare quelle selezioni ai file del progetto, esegui `openspec update` (o scegli `Applicare le modifiche a questo progetto ora?` quando richiesto all'interno di un progetto).

**Esempi interattivi:**

```bash
# Aggiornamento solo della consegna
openspec config profile
# scegli: Cambia solo la consegna
# scegli consegna: Solo competenze

# Aggiornamento solo dei workflow
openspec config profile
# scegli: Cambia solo i workflow
# attiva/disattiva i workflow nella checklist, poi conferma
```

---

## Comandi di Utilità

### `openspec feedback`

Invia feedback su OpenSpec. Crea un issue su GitHub.

```
openspec feedback <message> [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `message` | Sì | Messaggio di feedback |

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--body <text>` | Descrizione dettagliata |

**Requisiti:** La CLI di GitHub (`gh`) deve essere installata e autenticata.

**Esempio:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Gestisci le completamenti della shell per la CLI di OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Sotto-comandi:**

| Sotto-comando | Descrizione |
|---------------|-------------|
| `generate [shell]` | Output dello script di completamento su stdout |
| `install [shell]` | Installa il completamento per la tua shell |
| `uninstall [shell]` | Rimuovi i completamenti installati |

**Shell supportate:** `bash`, `zsh`, `fish`, `powershell`

**Esempi:**

```bash
# Installa i completamenti (rileva automaticamente la shell)
openspec completion install

# Installa per una shell specifica
openspec completion install zsh

# Genera lo script per l'installazione manuale
openspec completion generate bash > ~/.bash_completion.d/openspec

# Disinstalla
openspec completion uninstall
```

---

## Codici di Uscita

| Codice | Significato |
|--------|-------------|
| `0` | Successo |
| `1` | Errore (fallimento della validazione, file mancanti, ecc.) |

---

## Variabili d'Ambiente

| Variabile | Descrizione |
|-----------|-------------|
| `OPENSPEC_TELEMETRY` | Imposta a `0` per disabilitare la telemetria |
| `DO_NOT_TRACK` | Imposta a `1` per disabilitare la telemetria (segnale DNT standard) |
| `OPENSPEC_CONCURRENCY` | Concorrenza predefinita per la validazione in blocco (predefinito: 6) |
| `EDITOR` o `VISUAL` | Editor per `openspec config edit` |
| `NO_COLOR` | Disabilita l'output a colori quando impostata |

---

## Documentazione Correlata

- [Comandi](commands.md) - Comandi slash AI (`/opsx:propose`, `/opsx:apply`, ecc.)
- [Workflow](workflows.md) - Pattern comuni e quando usare ogni comando
- [Personalizzazione](customization.md) - Crea schema e modelli personalizzati
- [Per Iniziare](getting-started.md) - Guida alla configurazione iniziale