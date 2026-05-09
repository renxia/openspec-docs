# Riferimento CLI

La CLI OpenSpec (`openspec`) fornisce comandi da terminale per la configurazione del progetto, la validazione, l'ispezione dello stato e la gestione. Questi comandi integrano i comandi slash AI (come `/opsx:propose`) documentati in [Comandi](commands.md).

## Riepilogo

| Categoria | Comandi | Scopo |
|-----------|---------|-------|
| **Configurazione** | `init`, `update` | Inizializzare e aggiornare OpenSpec nel tuo progetto |
| **Workspace (beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace open` | Configurare la pianificazione su repository o cartelle collegate |
| **Navigazione** | `list`, `view`, `show` | Esplorare modifiche e specifiche |
| **Validazione** | `validate` | Controllare modifiche e specifiche per problemi |
| **Ciclo di vita** | `archive` | Finalizzare le modifiche completate |
| **Flusso di lavoro** | `status`, `instructions`, `templates`, `schemas` | Supporto al flusso di lavoro basato su artefatti |
| **Schemi** | `schema init`, `schema fork`, `schema validate`, `schema which` | Creare e gestire flussi di lavoro personalizzati |
| **Configurazione** | `config` | Visualizzare e modificare le impostazioni |
| **Utilità** | `feedback`, `completion` | Feedback e integrazione con la shell |

---

## Comandi Umano vs Agente

La maggior parte dei comandi CLI sono progettati per l'**uso umano** in un terminale. Alcuni comandi supportano anche l'**uso da parte di agenti/script** tramite output JSON.

### Comandi Solo per Uso Umano

Questi comandi sono interattivi e progettati per l'uso in un terminale:

| Comando | Scopo |
|---------|---------|
| `openspec init` | Inizializza il progetto (prompt interattivi) |
| `openspec view` | Dashboard interattiva |
| `openspec config edit` | Apre la configurazione nell'editor |
| `openspec feedback` | Invia feedback tramite GitHub |
| `openspec completion install` | Installa il completamento della shell |

### Comandi Compatibili con gli Agenti

Questi comandi supportano l'output `--json` per l'uso programmatico da parte di agenti AI e script:

| Comando | Uso Umano | Uso Agente |
|---------|-----------|-----------|
| `openspec list` | Sfoglia modifiche/spec | `--json` per dati strutturati |
| `openspec show <item>` | Leggi contenuto | `--json` per l'analisi |
| `openspec validate` | Controlla problemi | `--all --json` per validazione in blocco |
| `openspec status` | Vedi progresso degli artefatti | `--json` per stato strutturato |
| `openspec instructions` | Ottieni i prossimi passi | `--json` per istruzioni agente |
| `openspec templates` | Trova percorsi dei template | `--json` per risoluzione dei percorsi |
| `openspec schemas` | Elenca gli schema disponibili | `--json` per scoperta degli schema |
| `openspec workspace setup --no-interactive` | Crea un'area di lavoro con input espliciti | `--json` per output di setup strutturato |
| `openspec workspace list` | Sfoglia aree di lavoro note | `--json` per oggetti area di lavoro tipizzati |
| `openspec workspace link` | Collega un repository o una cartella | `--json` per output di collegamento strutturato |
| `openspec workspace relink` | Ripara un percorso collegato | `--json` per output di collegamento strutturato |
| `openspec workspace doctor` | Controlla un'area di lavoro | `--json` per output di stato strutturato |

---

## Opzioni Globali

Queste opzioni funzionano con tutti i comandi:

| Opzione | Descrizione |
|--------|-------------|
| `--version`, `-V` | Mostra il numero di versione |
| `--no-color` | Disabilita l'output a colori |
| `--help`, `-h` | Mostra la guida per il comando |

---

## Comandi di Setup

### `openspec init`

Inizializza OpenSpec nel tuo progetto. Crea la struttura delle cartelle e configura le integrazioni con gli strumenti AI.

Il comportamento predefinito utilizza i valori predefiniti della configurazione globale: profilo `core`, delivery `both`, workflow `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `path` | No | Directory di destinazione (predefinita: directory corrente) |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--tools <list>` | Configura gli strumenti AI in modo non interattivo. Usa `all`, `none`, o un elenco separato da virgole |
| `--force` | Pulizia automatica dei file legacy senza richiesta |
| `--profile <profile>` | Sovrascrive il profilo globale per questa esecuzione di init (`core` o `custom`) |

`--profile custom` utilizza qualsiasi workflow sia attualmente selezionato nella configurazione globale (`openspec config profile`).

**ID strumenti supportati (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

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

# Sovrascrive il profilo per questa esecuzione
openspec init --profile core

# Salta i prompt e pulisci automaticamente i file legacy
openspec init --force
```

**Cosa viene creato:**

```
openspec/
├── specs/              # Le tue specifiche (fonte di verità)
├── changes/            # Modifiche proposte
└── config.yaml         # Configurazione del progetto

.claude/skills/         # Competenze Claude Code (se claude selezionato)
.cursor/skills/         # Competenze Cursor (se cursor selezionato)
.cursor/commands/       # Comandi OPSX per Cursor (se il delivery include comandi)
... (altre configurazioni degli strumenti)
```

---

### `openspec update`

Aggiorna i file di istruzione di OpenSpec dopo l'aggiornamento della CLI. Rigenera i file di configurazione degli strumenti AI utilizzando il tuo profilo globale corrente, i workflow selezionati e la modalità di delivery.

```
openspec update [path] [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `path` | No | Directory di destinazione (predefinita: directory corrente) |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--force` | Forza l'aggiornamento anche quando i file sono aggiornati |

**Esempio:**

```bash
# Aggiorna i file di istruzione dopo l'aggiornamento di npm
npm update @fission-ai/openspec
openspec update
```

---

## Comandi Area di Lavoro

I comandi dell'area di lavoro sono in fase di sviluppo attivo e non sono ancora pronti per l'uso. Non costruire automazioni, integrazioni o workflow di lunga durata su questa superficie di comandi; il comportamento dei comandi, i file di stato e l'output JSON possono cambiare in qualsiasi momento.

Le aree di lavoro di coordinamento sono case di pianificazione per il lavoro che si estende su più repository o cartelle. La visibilità dell'area di lavoro non è un impegno di modifica: collega i repository o le cartelle che OpenSpec dovrebbe conoscere, quindi crea le modifiche quando sei pronto a pianificare un lavoro specifico.

### `openspec workspace setup`

Crea un'area di lavoro nella posizione standard dell'area di lavoro OpenSpec e collega almeno un repository o cartella esistente.

```bash
openspec workspace setup [options]
```

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--name <name>` | Nome dell'area di lavoro. I nomi devono essere in kebab-case |
| `--link <path>` | Collega un repository o cartella esistente e deduci il nome del collegamento dal nome della cartella |
| `--link <name>=<path>` | Collega un repository o cartella esistente con un nome di collegamento esplicito |
| `--opener <id>` | Memorizza un opener preferito durante il setup non interattivo: `codex`, `claude`, `github-copilot`, o `editor` |
| `--no-interactive` | Disabilita i prompt; richiede `--name` e almeno un `--link` |
| `--json` | Output JSON; richiede `--no-interactive` |

**Esempi:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

Il setup interattivo chiede un opener preferito e lo memorizza nello stato locale della macchina dell'area di lavoro. Il setup non interattivo memorizza un opener preferito solo quando viene fornito `--opener`; altrimenti `workspace open` chiederà più tardi nei terminali interattivi quando è disponibile un opener supportato, o chiederà agli script di passare `--agent <tool>` o `--editor`.

### `openspec workspace list`

Elenca le aree di lavoro OpenSpec note dal registro locale.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

L'elenco mostra la posizione di ogni area di lavoro e i repository o cartelle collegati. I record del registro obsoleti vengono segnalati ma non modificati.

### `openspec workspace link`

Registra un repository o cartella esistente per un'area di lavoro.

```bash
openspec workspace link [name] <path> [options]
```

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--workspace <name>` | Seleziona un'area di lavoro nota dal registro locale |
| `--json` | Output JSON |
| `--no-interactive` | Disabilita i prompt di selezione dell'area di lavoro |

**Esempi:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

Il percorso deve già esistere. I percorsi relativi vengono risolti rispetto alla directory corrente del comando prima che OpenSpec memorizzi il percorso assoluto verificato nello stato locale della macchina dell'area di lavoro. I percorsi collegati possono essere repository completi, pacchetti, servizi, app o cartelle senza stato `openspec/` locale al repository.

### `openspec workspace relink`

Ripara o modifica il percorso locale per un collegamento esistente.

```bash
openspec workspace relink <name> <path> [options]
```

Il percorso deve già esistere. Relink aggiorna solo il percorso locale della macchina per il nome del collegamento stabile.

### `openspec workspace doctor`

Controlla cosa un'area di lavoro può risolvere sulla macchina corrente.

```bash
openspec workspace doctor [options]
```

Doctor mostra la posizione dell'area di lavoro, il percorso di pianificazione, i repository o cartelle collegati, i percorsi mancanti, i percorsi delle specifiche locali al repository quando presenti e le correzioni suggerite. Segnala solo i problemi; non li ripara automaticamente.

I comandi che necessitano di un'area di lavoro utilizzano l'area di lavoro corrente quando eseguiti all'interno di una cartella o sottodirectory dell'area di lavoro. Da altrove, passa `--workspace <name>`, seleziona dal selettore in un terminale interattivo, o affidati all'unica area di lavoro nota quando ne esiste esattamente una. In modalità `--json` o `--no-interactive`, una selezione ambigua fallisce con un errore di stato strutturato e suggerisce `--workspace <name>`.

Le risposte JSON utilizzano oggetti tipizzati più array `status`. I dati principali si trovano in `workspace`, `workspaces` o `link`; avvisi ed errori si trovano in `status`.

### `openspec workspace open`

Apre un set di lavoro dell'area di lavoro tramite l'opener preferito memorizzato, un'override agente per una sessione, o la modalità editor VS Code.

```bash
openspec workspace open [name] [options]
```

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--workspace <name>` | Alias per il nome posizionale dell'area di lavoro |
| `--agent <tool>` | Override agente per una sessione: `codex`, `claude`, o `github-copilot` |
| `--editor` | Apre il file dell'area di lavoro VS Code mantenuto come area di lavoro editor normale |
| `--no-interactive` | Disabilita i prompt di selezione dell'area di lavoro e dell'opener |

**Esempi:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex
openspec workspace open --editor
```

`workspace open` utilizza l'area di lavoro corrente quando eseguito all'interno di una, seleziona automaticamente l'unica area di lavoro nota quando eseguito altrove, e chiede all'utente di scegliere quando sono note più aree di lavoro. `--agent` e `--editor` non modificano l'opener preferito memorizzato. Passare entrambi gli override dell'opener è un errore; scegli `--agent <tool>` o `--editor`.

OpenSpec mantiene `<workspace-name>.code-workspace` nella radice dell'area di lavoro per le aperture di VS Code editor e GitHub Copilot-in-VS-Code. Quel file è locale alla macchina e ignorato per impostazione predefinita con una voce `.gitignore` specifica per `<workspace-name>.code-workspace`, così i file `*.code-workspace` creati dall'utente rimangono idonei per il tracciamento.

L'area di lavoro VS Code mantenuta include la radice di coordinamento come `.` più i repository o cartelle collegati validi come radici aggiuntive. VS Code visualizza quelle voci come un'area di lavoro multi-radice.

L'apertura dell'area di lavoro radice supporta l'esplorazione e la pianificazione attraverso i repository o cartelle collegati. Le modifiche all'implementazione dovrebbero iniziare solo dopo una richiesta esplicita dell'utente e un normale workflow di implementazione OpenSpec.

---

## Comandi di Navigazione

### `openspec list`

Elenca le modifiche o le specifiche nel tuo progetto.

```
openspec list [options]
```

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--specs` | Elenca le specifiche invece delle modifiche |
| `--changes` | Elenca le modifiche (predefinito) |
| `--sort <order>` | Ordina per `recent` (predefinito) o `name` |
| `--json` | Output in formato JSON |

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
  add-dark-mode     Supporto per il cambio di tema dell'interfaccia utente
  fix-login-bug     Gestione del timeout della sessione
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

Visualizza i dettagli di una modifica o di una specifica.

```
openspec show [item-name] [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `item-name` | No | Nome della modifica o della specifica (viene richiesto se omesso) |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--type <type>` | Specifica il tipo: `change` o `spec` (rilevato automaticamente se non ambiguo) |
| `--json` | Output in formato JSON |
| `--no-interactive` | Disabilita i prompt |

**Opzioni specifiche per le modifiche:**

| Opzione | Descrizione |
|--------|-------------|
| `--deltas-only` | Mostra solo le specifiche delta (modalità JSON) |

**Opzioni specifiche per le specifiche:**

| Opzione | Descrizione |
|--------|-------------|
| `--requirements` | Mostra solo i requisiti, escludi gli scenari (modalità JSON) |
| `--no-scenarios` | Escludi il contenuto dello scenario (modalità JSON) |
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
|----------|----------|-------------|
| `item-name` | No | Elemento specifico da validare (viene richiesto se omesso) |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--all` | Valida tutte le modifiche e le specifiche |
| `--changes` | Valida tutte le modifiche |
| `--specs` | Valida tutte le specifiche |
| `--type <type>` | Specifica il tipo quando il nome è ambiguo: `change` o `spec` |
| `--strict` | Abilita la modalità di validazione rigorosa |
| `--json` | Output in formato JSON |
| `--concurrency <n>` | Validazioni parallele massime (predefinito: 6, o variabile d'ambiente `OPENSPEC_CONCURRENCY`) |
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
Validazione di add-dark-mode in corso...
  ✓ proposal.md valido
  ✓ specs/ui/spec.md valido
  ⚠ design.md: sezione "Approccio Tecnico" mancante

Trovato 1 avviso
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
        "warnings": ["design.md: sezione 'Approccio Tecnico' mancante"]
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
openspec archive [nome-modifica] [opzioni]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `nome-modifica` | No | Modifica da archiviare (viene richiesto se omesso) |

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `-y, --yes` | Salta le richieste di conferma |
| `--skip-specs` | Salta gli aggiornamenti delle specifiche (per modifiche solo infrastruttura/tooling/documentazione) |
| `--no-validate` | Salta la validazione (richiede conferma) |

**Esempi:**

```bash
# Archiviazione interattiva
openspec archive

# Archivia una modifica specifica
openspec archive add-dark-mode

# Archivia senza richieste (CI/scripts)
openspec archive add-dark-mode --yes

# Archivia una modifica al tooling che non influisce sulle specifiche
openspec archive update-ci-config --skip-specs
```

**Cosa fa:**

1. Valida la modifica (a meno che non sia specificato `--no-validate`)
2. Richiede una conferma (a meno che non sia specificato `--yes`)
3. Unisce le specifiche delta in `openspec/specs/`
4. Sposta la cartella della modifica in `openspec/changes/archive/YYYY-MM-DD-<nome>/`

---

## Comandi del Flusso di Lavoro

Questi comandi supportano il flusso di lavoro OPSX guidato dagli artefatti. Sono utili sia per gli utenti che controllano i progressi sia per gli agenti che determinano i passaggi successivi.

### `openspec status`

Mostra lo stato di completamento degli artefatti per una modifica.

```
openspec status [opzioni]
```

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--change <id>` | Nome della modifica (viene richiesto se omesso) |
| `--schema <nome>` | Sovrascrittura dello schema (rilevato automaticamente dalla configurazione della modifica) |
| `--json` | Output in formato JSON |

**Esempi:**

```bash
# Controllo dello stato interattivo
openspec status

# Stato per una modifica specifica
openspec status --change add-dark-mode

# JSON per uso da parte di agenti
openspec status --change add-dark-mode --json
```

**Output (testo):**

```
Modifica: add-dark-mode
Schema: spec-driven
Progresso: 2/4 artefatti completati

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

Ottieni istruzioni arricchite per creare un artefatto o applicare le attività. Utilizzato dagli agenti AI per capire cosa creare successivamente.

```
openspec instructions [artefatto] [opzioni]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `artefatto` | No | ID dell'artefatto: `proposal`, `specs`, `design`, `tasks` o `apply` |

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--change <id>` | Nome della modifica (obbligatorio in modalità non interattiva) |
| `--schema <nome>` | Sovrascrittura dello schema |
| `--json` | Output in formato JSON |

**Caso speciale:** Usa `apply` come artefatto per ottenere le istruzioni di implementazione delle attività.

**Esempi:**

```bash
# Ottieni istruzioni per l'artefatto successivo
openspec instructions --change add-dark-mode

# Ottieni istruzioni per un artefatto specifico
openspec instructions design --change add-dark-mode

# Ottieni istruzioni per l'applicazione/implementazione
openspec instructions apply --change add-dark-mode

# JSON per consumo da parte di agenti
openspec instructions design --change add-dark-mode --json
```

**L'output include:**

- Contenuto del modello per l'artefatto
- Contesto del progetto dalla configurazione
- Contenuto dagli artefatti dipendenti
- Regole per artefatto dalla configurazione

---

### `openspec templates`

Mostra i percorsi dei modelli risolti per tutti gli artefatti in uno schema.

```
openspec templates [opzioni]
```

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--schema <nome>` | Schema da ispezionare (predefinito: `spec-driven`) |
| `--json` | Output in formato JSON |

**Esempi:**

```bash
# Mostra i percorsi dei modelli per lo schema predefinito
openspec templates

# Mostra i modelli per uno schema personalizzato
openspec templates --schema my-workflow

# JSON per uso programmatico
openspec templates --json
```

**Output (testo):**

```
Schema: spec-driven

Modelli:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Elenca gli schemi di flusso di lavoro disponibili con le loro descrizioni e i flussi degli artefatti.

```
openspec schemas [opzioni]
```

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--json` | Output in formato JSON |

**Esempio:**

```bash
openspec schemas
```

**Output:**

```
Schemi disponibili:

  spec-driven (pacchetto)
    Il flusso di lavoro di sviluppo guidato dalle specifiche predefinito
    Flusso: proposal → specs → design → tasks

  my-custom (progetto)
    Flusso di lavoro personalizzato per questo progetto
    Flusso: research → proposal → tasks
```

---

## Comandi per gli Schemi

Comandi per la creazione e la gestione di schemi di flusso di lavoro personalizzati.

### `openspec schema init`

Crea un nuovo schema locale del progetto.

```
openspec schema init <nome> [opzioni]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `nome` | Sì | Nome dello schema (kebab-case) |

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--description <testo>` | Descrizione dello schema |
| `--artifacts <elenco>` | ID degli artefatti separati da virgola (predefinito: `proposal,specs,design,tasks`) |
| `--default` | Imposta come schema predefinito del progetto |
| `--no-default` | Non chiedere di impostare come predefinito |
| `--force` | Sovrascrivi lo schema esistente |
| `--json` | Output in formato JSON |

**Esempi:**

```bash
# Creazione interattiva dello schema
openspec schema init research-first

# Non interattivo con artefatti specifici
openspec schema init rapid \
  --description "Flusso di lavoro per iterazione rapida" \
  --artifacts "proposal,tasks" \
  --default
```

**Cosa crea:**

```
openspec/schemas/<nome>/
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
openspec schema fork <sorgente> [nome] [opzioni]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `sorgente` | Sì | Schema da copiare |
| `nome` | No | Nuovo nome dello schema (predefinito: `<sorgente>-custom`) |

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--force` | Sovrascrivi la destinazione esistente |
| `--json` | Output in formato JSON |

**Esempio:**

```bash
# Esegui il fork dello schema spec-driven integrato
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Valida la struttura e i modelli di uno schema.

```
openspec schema validate [nome] [opzioni]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `nome` | No | Schema da validare (valida tutti se omesso) |

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--verbose` | Mostra i passaggi di validazione dettagliati |
| `--json` | Output in formato JSON |

**Esempio:**

```bash
# Valida uno schema specifico
openspec schema validate my-workflow

# Valida tutti gli schemi
openspec schema validate
```

---

### `openspec schema which`

Mostra da dove viene risolto uno schema (utile per il debug della precedenza).

```
openspec schema which [nome] [opzioni]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|-----------|--------------|-------------|
| `nome` | No | Nome dello schema |

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--all` | Elenca tutti gli schemi con le loro fonti |
| `--json` | Output in formato JSON |

**Esempio:**

```bash
# Controlla da dove proviene uno schema
openspec schema which spec-driven
```

**Output:**

```
spec-driven viene risolto da: pacchetto
  Fonte: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Precedenza degli schemi:**

1. Progetto: `openspec/schemas/<nome>/`
2. Utente: `~/.local/share/openspec/schemas/<nome>/`
3. Pacchetto: Schemi integrati

---

## Comandi di Configurazione

### `openspec config`

Visualizza e modifica la configurazione globale di OpenSpec.

```
openspec config <subcommand> [options]
```

**Sottocomandi:**

| Sottocomando | Descrizione |
|--------------|-------------|
| `path` | Mostra il percorso del file di configurazione |
| `list` | Mostra tutte le impostazioni correnti |
| `get <key>` | Ottiene un valore specifico |
| `set <key> <value>` | Imposta un valore |
| `unset <key>` | Rimuove una chiave |
| `reset` | Ripristina i valori predefiniti |
| `edit` | Apre nell'`$EDITOR` |
| `profile [preset]` | Configura il profilo del flusso di lavoro in modo interattivo o tramite preset |

**Esempi:**

```bash
# Mostra il percorso del file di configurazione
openspec config path

# Elenca tutte le impostazioni
openspec config list

# Ottiene un valore specifico
openspec config get telemetry.enabled

# Imposta un valore
openspec config set telemetry.enabled false

# Imposta esplicitamente un valore stringa
openspec config set user.name "Il Mio Nome" --string

# Rimuove un'impostazione personalizzata
openspec config unset user.name

# Ripristina tutta la configurazione
openspec config reset --all --yes

# Modifica la configurazione nel tuo editor
openspec config edit

# Configura il profilo con una procedura guidata basata su azioni
openspec config profile

# Preset rapido: passa i flussi di lavoro a core (mantiene la modalità di consegna)
openspec config profile core
```

`openspec config profile` inizia con un riepilogo dello stato corrente, quindi ti consente di scegliere:
- Modifica consegna + flussi di lavoro
- Modifica solo la consegna
- Modifica solo i flussi di lavoro
- Mantieni impostazioni correnti (esci)

Se mantieni le impostazioni correnti, non vengono scritte modifiche e non viene mostrato alcun prompt di aggiornamento.
Se non ci sono modifiche alla configurazione ma i file del progetto corrente non sono sincronizzati con il tuo profilo/consegna globale, OpenSpec mostrerà un avviso e suggerirà di eseguire `openspec update`.
Premendo `Ctrl+C` si annulla anche il flusso in modo pulito (nessun trace dello stack) e si esce con codice `130`.
Nella checklist dei flussi di lavoro, `[x]` indica che il flusso di lavoro è selezionato nella configurazione globale. Per applicare queste selezioni ai file del progetto, esegui `openspec update` (o scegli `Applica le modifiche a questo progetto ora?` quando richiesto all'interno di un progetto).

**Esempi interattivi:**

```bash
# Aggiornamento solo della consegna
openspec config profile
# scegli: Modifica solo la consegna
# scegli consegna: Solo competenze

# Aggiornamento solo dei flussi di lavoro
openspec config profile
# scegli: Modifica solo i flussi di lavoro
# attiva/disattiva i flussi di lavoro nella checklist, quindi conferma
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

**Requisiti:** GitHub CLI (`gh`) deve essere installato e autenticato.

**Esempio:**

```bash
openspec feedback "Aggiungi supporto per tipi di artefatti personalizzati" \
  --body "Vorrei definire i miei tipi di artefatti oltre a quelli integrati."
```

---

### `openspec completion`

Gestisce il completamento della shell per la CLI di OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Sottocomandi:**

| Sottocomando | Descrizione |
|--------------|-------------|
| `generate [shell]` | Genera lo script di completamento su stdout |
| `install [shell]` | Installa il completamento per la tua shell |
| `uninstall [shell]` | Rimuove i completamenti installati |

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
| `1` | Errore (errore di validazione, file mancanti, ecc.) |

---

## Variabili d'Ambiente

| Variabile | Descrizione |
|-----------|-------------|
| `OPENSPEC_TELEMETRY` | Impostare a `0` per disabilitare la telemetria |
| `DO_NOT_TRACK` | Impostare a `1` per disabilitare la telemetria (segnale DNT standard) |
| `OPENSPEC_CONCURRENCY` | Concorrenza predefinita per la validazione in blocco (predefinito: 6) |
| `EDITOR` o `VISUAL` | Editor per `openspec config edit` |
| `NO_COLOR` | Disabilita l'output a colori quando impostato |

---

## Documentazione Correlata

- [Comandi](commands.md) - Comandi slash AI (`/opsx:propose`, `/opsx:apply`, ecc.)
- [Flussi di lavoro](workflows.md) - Pattern comuni e quando usare ciascun comando
- [Personalizzazione](customization.md) - Crea schemi e modelli personalizzati
- [Guida introduttiva](getting-started.md) - Guida alla prima configurazione