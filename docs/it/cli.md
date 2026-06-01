# Riferimento CLI

La CLI OpenSpec (`openspec`) fornisce comandi da terminale per la configurazione del progetto, la convalida, l'ispezione dello stato e la gestione. Questi comandi integrano i comandi slash AI (come `/opsx:propose`) documentati in [Comandi](commands.md).

## Sommario

| Categoria | Comandi | Scopo |
|-----------|---------|-------|
| **Configurazione** | `init`, `update` | Inizializzare e aggiornare OpenSpec nel tuo progetto |
| **Aree di lavoro (beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace update`, `workspace open` | Configurare viste locali su repository o cartelle collegati |
| **Contesto condiviso (beta)** | `context-store setup`, `context-store register`, `context-store unregister`, `context-store remove`, `context-store list`, `context-store doctor`, `initiative create`, `initiative show`, `initiative list` | Gestire le registrazioni locali del context-store e il contesto iniziativa persistente |
| **Esplorazione** | `list`, `view`, `show` | Esplorare modifiche e specifiche |
| **Convalida** | `validate` | Verificare modifiche e specifiche per problemi |
| **Ciclo di vita** | `archive` | Finalizzare le modifiche completate |
| **Flusso di lavoro** | `new change`, `set change`, `status`, `instructions`, `templates`, `schemas` | Supporto al flusso di lavoro guidato da artefatti |
| **Schemi** | `schema init`, `schema fork`, `schema validate`, `schema which` | Creare e gestire flussi di lavoro personalizzati |
| **Configurazione** | `config` | Visualizzare e modificare le impostazioni |
| **Utilità** | `feedback`, `completion` | Feedback e integrazione con la shell |

---

## Comandi Human vs Agent

La maggior parte dei comandi CLI è progettata per l'**uso umano** in un terminale. Alcuni comandi supportano anche l'**uso da parte di agenti/script** tramite output JSON.

### Comandi solo per uso umano

Questi comandi sono interattivi e progettati per l'uso in terminale:

| Comando | Scopo |
|---------|-------|
| `openspec init` | Inizializzare il progetto (prompt interattivi) |
| `openspec view` | Dashboard interattiva |
| `openspec config edit` | Aprire la configurazione nell'editor |
| `openspec feedback` | Inviare feedback tramite GitHub |
| `openspec completion install` | Installare il completamento shell |

### Comandi compatibili con gli Agent

Questi comandi supportano l'output `--json` per l'uso programmatico da parte di agenti AI e script:

| Comando | Uso umano | Uso Agent |
|---------|-----------|-----------|
| `openspec list` | Sfogliare modifiche/spec | `--json` per dati strutturati |
| `openspec show <item>` | Leggere il contenuto | `--json` per il parsing |
| `openspec validate` | Verificare la presenza di problemi | `--all --json` per la validazione in blocco |
| `openspec status` | Visualizzare lo stato degli artefatti | `--json` per lo stato strutturato |
| `openspec instructions` | Ottenere i prossimi passi | `--json` per le istruzioni dell'agente |
| `openspec templates` | Trovare i percorsi dei template | `--json` per la risoluzione dei percorsi |
| `openspec schemas` | Elencare gli schema disponibili | `--json` per la scoperta degli schema |
| `openspec workspace setup --no-interactive` | Creare un workspace con input espliciti | `--json` per l'output strutturato di setup |
| `openspec workspace list` | Sfogliare i workspace noti | `--json` per oggetti workspace tipizzati |
| `openspec workspace link` | Collegare un repo o una cartella | `--json` per l'output strutturato del collegamento |
| `openspec workspace relink` | Riparare un percorso collegato | `--json` per l'output strutturato del collegamento |
| `openspec workspace doctor` | Verificare un workspace | `--json` per l'output strutturato dello stato |
| `openspec workspace update` | Aggiornare la guida locale del workspace e le competenze degli agent | `--tools` seleziona gli agent; il profilo seleziona i flussi di lavoro |
| `openspec context-store setup <id>` | Creare un contesto locale | `--json` con input espliciti per l'output strutturato di setup |
| `openspec context-store register <path>` | Registrare un contesto locale esistente | `--json` per l'output strutturato di registrazione |
| `openspec context-store unregister <id>` | Rimuovere la registrazione di un contesto locale | `--json` per l'output strutturato di pulizia |
| `openspec context-store remove <id>` | Eliminare la cartella di un contesto locale registrato | `--yes --json` per l'eliminazione non interattiva |
| `openspec context-store list` | Sfogliare i contesti locali registrati | `--json` per le registrazioni strutturate |
| `openspec context-store doctor` | Verificare la configurazione del contesto locale | `--json` per la diagnostica strutturata |
| `openspec initiative list` | Sfogliare le iniziative condivise | `--json` per i record strutturati delle iniziative |
| `openspec initiative show <id>` | Risolvere un'iniziativa | `--json` per percorsi canonici e metadati |
| `openspec new change <id>` | Creare uno scaffolding di modifica locale al repo | `--json`, più `--initiative` per i link di coordinamento condivisi |
| `openspec set change <id>` | Aggiornare i metadati della modifica registrata | `--json`, più `--initiative` per i link di coordinamento condivisi |

---

## Opzioni Globali

Queste opzioni funzionano con tutti i i comandi:

| Opzione | Descrizione |
|---------|-------------|
| `--version`, `-V` | Mostrare il numero di versione |
| `--no-color` | Disattivare l'output a colori |
| `--help`, `-h` | Visualizzare la guida per il comando |

---

## Comandi di Configurazione

### `openspec init`

Inizializzare OpenSpec nel proprio progetto. Crea la struttura delle cartelle e configura le integrazioni con gli strumenti AI.

Il comportamento predefinito utilizza i valori predefiniti della configurazione globale: profilo `core`, delivery `both`, flussi di lavoro `propose, explore, apply, sync, archive`.

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
| `--tools <list>` | Configurare gli strumenti AI in modalità non interattiva. Usare `all`, `none` o un elenco separato da virgole |
| `--force` | Pulire automaticamente i file legacy senza chiedere conferma |
| `--profile <profile>` | Sovrascrivere il profilo globale per questa esecuzione di init (`core` o `custom`) |

`--profile custom` utilizza i flussi di lavoro attualmente selezionati nella configurazione globale (`openspec config profile`).

**ID degli strumenti supportati (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**Esempi:**

```bash
# Inizializzazione interattiva
openspec init

# Inizializzare in una directory specifica
openspec init ./my-project

# Non interattivo: configurare per Claude e Cursor
openspec init --tools claude,cursor

# Configurare per tutti gli strumenti supportati
openspec init --tools all

# Sovrascrivere il profilo per questa esecuzione
openspec init --profile core

# Saltare i prompt e pulire automaticamente i file legacy
openspec init --force
```

**Cosa viene creato:**

```
openspec/
├── specs/              # Le vostre specifiche (fonte primaria)
├── changes/            # Modifiche proposte
└── config.yaml         # Configurazione del progetto

.claude/skills/         # Competenze Claude Code (se claude selezionato)
.cursor/skills/         # Competenze Cursor (se cursor selezionato)
.cursor/commands/       # Comandi OPSX di Cursor (se il delivery include i comandi)
... (altre configurazioni degli strumenti)
```

---

### `openspec update`

Aggiornare i file di istruzioni di OpenSpec dopo l'aggiornamento della CLI. Rigenera i file di configurazione degli strumenti AI utilizzando il profilo globale corrente, i flussi di lavoro selezionati e la modalità di delivery.

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
| `--force` | Forzare l'aggiornamento anche quando i file sono aggiornati |

**Esempio:**

```bash
# Aggiornare i file di istruzioni dopo l'aggiornamento npm
npm update @fission-ai/openspec
openspec update
```

---

## Comandi Workspace

I comandi workspace sono in beta. Il modello di vista locale descritto di seguito è la direzione attuale, ma l'automazione esterna, le integrazioni e i flussi di lavoro di lunga durata dovrebbero ancora considerare il comportamento dei comandi, i file di stato e l'output JSON come in evoluzione.

I workspace di coordinamento sono viste locali sulla macchina su repo o cartelle collegate. La visibilità del workspace non equivale all'impegno sulla modifica: collegate i repo o le cartelle che OpenSpec deve conoscere, quindi create le modifiche quando siete pronti a pianificare un lavoro specifico.

### `openspec workspace setup`

Creare un workspace nella posizione standard di workspace di OpenSpec e collegare almeno un repo o una cartella esistente.

```bash
openspec workspace setup [options]
```

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--name <name>` | Nome del workspace. I nomi devono essere in kebab-case |
| `--link <path>` | Collegare un repo o una cartella esistente e dedurre il nome del collegamento dal nome della cartella |
| `--link <name>=<path>` | Collegare un repo o una cartella esistente con un nome di collegamento esplicito |
| `--opener <id>` | Memorizzare un opener preferito durante il setup non interattivo: `codex-cli`, `claude`, `github-copilot` o `editor` |
| `--tools <tools>` | Installare le competenze OpenSpec locali del workspace per gli agent. Usare `all`, `none` o gli ID degli strumenti separati da virgole |
| `--no-interactive` | Disattivare i prompt; richiede `--name` e almeno un `--link` |
| `--json` | Output JSON; richiede `--no-interactive` |

**Esempi:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli
openspec workspace setup --no-interactive --name platform --link /repos/api --tools codex,claude
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

Il setup interattivo chiede un opener preferito e può installare le competenze OpenSpec locali del workspace per gli agent selezionati. Il setup non interattivo memorizza un opener preferito solo quando viene fornito `--opener`; altrimenti `workspace open` chiederà successivamente nei terminali interattivi quando è disponibile un opener supportato, oppure chiederà agli script di passare `--agent <tool>` o `--editor`.

L'installazione delle competenze del workspace è limitata alle sole competenze in questa fase beta: anche se il delivery globale è `commands` o `both`, il setup del workspace scrive le cartelle delle competenze dell'agente nella radice del workspace e non crea file di comando slash. Il profilo globale attivo determina quali competenze dei flussi di lavoro vengono installate; `--tools` determina quali agent le ricevono. Se `--tools` viene omesso nel setup non interattivo, non vengono installate competenze e `workspace update --tools <ids>` può aggiungerle in un secondo momento.

### `openspec workspace list`

Elencare i workspace OpenSpec noti dal registro locale.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

L'elenco mostra la posizione di ciascun workspace e i repo o cartelle collegati. I record del registro obsoleti vengono segnalati ma non modificati.

### `openspec workspace link`

Registrare un repo o una cartella esistente per un workspace.

```bash
openspec workspace link [name] <path> [options]
```

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--workspace <name>` | Selezionare un workspace noto dal registro locale |
| `--json` | Output JSON |
| `--no-interactive` | Disattivare i prompt di selezione del workspace |

**Esempi:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

Il percorso deve già esistere. I percorsi relativi vengono risolti rispetto alla directory corrente del comando prima che OpenSpec memorizzi il percorso assoluto verificato nello stato locale della macchina del workspace. I percorsi collegati possono essere repo completi, pacchetti, servizi, app o cartelle senza stato `openspec/` locale al repo.

### `openspec workspace relink`

Riparare o modificare il percorso locale per un collegamento esistente.

```bash
openspec workspace relink <name> <path> [options]
```

Il percorso deve già esistere. Relink aggiorna solo il percorso locale della macchina per il nome di collegamento stabile.

### `openspec workspace doctor`

Verificare cosa un workspace può risolvere sulla macchina corrente.

```bash
openspec workspace doctor [options]
```

Doctor mostra la posizione del workspace, i repo o cartelle collegati, i percorsi mancanti, i percorsi delle specifiche locali al repo quando presenti e le correzioni suggerite. L'output JSON include anche il percorso di pianificazione del workspace per compatibilità. Segnala solo i problemi; non li ripara automaticamente.

I comandi che necessitano di un workspace utilizzano il workspace corrente quando eseguiti all'interno di una cartella o sottodirectory del workspace. Da altre posizioni, passate `--workspace <name>`, selezionate dal selettore in un terminale interattivo, oppure affidatevi all'unico workspace noto quando ne esiste esattamente uno. In modalità `--json` o `--no-interactive`, la selezione ambigua restituisce un errore di stato strutturato e suggerisce `--workspace <name>`.

Le risposte JSON utilizzano oggetti tipizzati più array `status`. I dati primari si trovano in `workspace`, `workspaces` o `link`; avvertimenti ed errori si trovano in `status`.

### `openspec workspace update`

Aggiornare la guida locale del workspace OpenSpec e le competenze degli agent.

```bash
openspec workspace update [name] [options]
```

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--workspace <name>` | Selezionare un workspace noto dal registro locale |
| `--tools <tools>` | Selezionare gli agent per le competenze del workspace. Usare `all`, `none` o gli ID degli strumenti separati da virgole |
| `--json` | Output JSON |
| `--no-interactive` | Disattivare i prompt di selezione del workspace |

**Esempi:**

```bash
openspec workspace update
openspec workspace update platform
openspec workspace update --workspace platform --tools codex,claude
openspec workspace update --workspace platform --tools none
```

`workspace update` aggiorna il blocco di guida generato del workspace e la superficie di apertura locale. Per le competenze degli agent, riutilizza la selezione dell'agente delle competenze del workspace memorizzata quando `--tools` viene omesso. Passare `--tools` sostituisce tale selezione memorizzata. Aggiorna solo le directory delle competenze dei flussi di lavoro gestite da OpenSpec nella radice del workspace, rimuove le competenze dei flussi di lavoro gestiti deselezionate e lascia i repo e le cartelle collegati intatti.

Eseguire `openspec update` dall'interno di un workspace reindirizza a `openspec workspace update`; eseguite `openspec update` all'interno dei progetti con stato locale al repo quando volete che i file degli strumenti di proprietà del repo vengano aggiornati.

### `openspec workspace open`

Aprire un set di lavoro del workspace tramite l'opener preferito memorizzato, un override dell'agente per una sessione o la modalità editor di VS Code.

```bash
openspec workspace open [name] [options]
```

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--workspace <name>` | Alias per il nome posizionale del workspace |
| `--initiative <id>` | Aprire un'iniziativa come vista locale del workspace. Accetta `<id>` o `<store>/<id>` |
| `--store <id>` | ID del contesto locale registrato per `--initiative` |
| `--store-path <path>` | Radice del contesto locale esistente per `--initiative` |
| `--agent <tool>` | Override dell'agente per una sessione: `codex-cli`, `claude` o `github-copilot` |
| `--editor` | Aprire il file workspace VS Code mantenuto come workspace editor normale |
| `--no-interactive` | Disattivare i prompt di selezione del workspace e dell'opener |

**Esempi:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex-cli
openspec workspace open --editor
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative platform/billing-launch
```

`workspace open` utilizza il workspace corrente quando eseguito all'interno di uno, seleziona automaticamente l'unico workspace noto quando eseguito altrove e chiede all'utente di scegliere quando sono noti più workspace. `--agent` e `--editor` non modificano l'opener preferito memorizzato. Passare entrambi gli override dell'opener è un errore; scegliete `--agent <tool>` oppure `--editor`.

Quando viene utilizzato `--initiative`, OpenSpec prepara o seleziona una vista privata locale del workspace per quell'iniziativa. I contesti selezionati dal registro vengono memorizzati per ID; `--store-path` memorizza un selettore di percorso locale a runtime perché le viste del workspace sono stato privato locale.

OpenSpec mantiene `<workspace-name>.code-workspace` nella radice del workspace per le aperture di VS Code editor e GitHub Copilot-in-VS-Code. Questo file è lo stato della vista locale della macchina del workspace.

Il workspace VS Code mantenuto elenca prima i repo o cartelle collegati validi, quindi il contesto dell'iniziativa quando collegato, quindi i file del workspace OpenSpec. VS Code visualizza tali voci come un workspace multi-root.

L'apertura del workspace radice rende i repo o cartelle collegati visibili per l'esplorazione e il contesto. Le modifiche all'implementazione dovrebbero iniziare solo dopo una richiesta esplicita dell'utente e un normale flusso di lavoro di implementazione OpenSpec.

---

## Comandi di Contesto Condiviso

I negozi di contesto e le iniziative sono superfici di coordinamento in fase beta. Un negozio di contesto è una registrazione locale per un contesto condiviso duraturo, solitamente una cartella o un clone supportato da Git. Un'iniziativa è un contesto di coordinamento condiviso all'interno di un negozio di contesto; le modifiche locali al repository possono ad essa collegarsi senza dover copiare il piano condiviso in ogni repository.

### `openspec context-store setup`

Crea e registra un negozio di contesto locale. Senza argomenti in un terminale, OpenSpec guida l'utente nella configurazione. Gli agenti e gli script dovrebbero passare input espliciti e usare `--json`.

```bash
openspec context-store setup [id] [options]
```

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--path <path>` | Percorso della cartella del negozio di contesto; per impostazione predefinita usa la directory dati locale gestita da OpenSpec |
| `--init-git` | Inizializza un repository Git nel negozio di contesto |
| `--no-init-git` | Non inizializzare un repository Git |
| `--json` | Output in formato JSON |

Quando `--path` è omesso, il setup crea il negozio sotto `getGlobalDataDir()/context-stores/<id>`: `$XDG_DATA_HOME/openspec/context-stores/<id>` quando `XDG_DATA_HOME` è impostato, o `~/.local/share/openspec/context-stores/<id>` come fallback su stile Unix. Passa `--path` quando desideri che il negozio sia in un clone visibile o in una cartella specifica del team.

Esempi:

```bash
openspec context-store setup
openspec context-store setup team-context
openspec context-store setup team-context --path /repos/team-context --no-init-git
openspec context-store setup team-context --json --no-init-git
```

### `openspec context-store register`

Registra una cartella esistente di un negozio di contesto locale.

```bash
openspec context-store register [path] [options]
```

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--id <id>` | ID del negozio di contesto; per impostazione predefinita usa i metadati del negozio o il nome della cartella |
| `--json` | Output in formato JSON |

### `openspec context-store unregister`

Dimentica la registrazione di un negozio di contesto locale senza eliminare i file.

```bash
openspec context-store unregister <id> [--json]
```

Usalo quando un negozio è stato spostato, clonato altrove, o non deve più essere mostrato da OpenSpec su questa macchina.

### `openspec context-store remove`

Dimentica la registrazione di un negozio di contesto locale ed elimina la sua cartella locale.

```bash
openspec context-store remove <id> [--yes] [--json]
```

`remove` mostra la cartella esatta prima dell'eliminazione in un terminale interattivo. Agenti, script e chiamanti JSON devono passare `--yes` per confermare l'eliminazione. OpenSpec rifiuta di eliminare una cartella che non contiene metadati corrispondenti del negozio di contesto.

### `openspec context-store list`

Elenca i negozi di contesto registrati localmente.

```bash
openspec context-store list [--json]
openspec context-store ls [--json]
```

### `openspec context-store doctor`

Controlla la registrazione locale del negozio di contesto, i metadati e la presenza di Git.

```bash
openspec context-store doctor [id] [--json]
```

Il comando doctor è solo diagnostico; riporta radici mancanti, discrepanze nei metadati e stato non valido del registro locale senza modificare il negozio.

### `openspec initiative create`

Crea un'iniziativa in un negozio di contesto.

```bash
openspec initiative create <id> --title <title> --summary <summary> [options]
```

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--store <id>` | ID del negozio di contesto dal registro locale |
| `--store-path <path>` | Radice esistente di un negozio di contesto locale |
| `--title <title>` | Titolo dell'iniziativa |
| `--summary <summary>` | Riepilogo dell'iniziativa |
| `--json` | Output in formato JSON |

### `openspec initiative list`

Elenca le iniziative. Senza un selettore, cerca in tutti i negozi di contesto registrati e riporta avvisi di lettura parziale in `status`.

```bash
openspec initiative list [options]
openspec initiative ls [options]
```

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--store <id>` | Elenca un singolo negozio di contesto registrato |
| `--store-path <path>` | Elenca una singola radice esistente di un negozio di contesto locale |
| `--json` | Output in formato JSON |

### `openspec initiative show`

Risolve un'iniziativa e stampa la sua posizione canonica.

```bash
openspec initiative show <id> [options]
openspec initiative show <store>/<id> [options]
```

Senza `--store`, OpenSpec cerca nei negozi di contesto registrati. Se la stessa ID di iniziativa esiste in più negozi, passa `--store <id>` o usa la forma `<store>/<id>`.

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

# Output JSON per script
openspec list --json
```

**Output (testo):**

```
Active changes:
  add-dark-mode     UI theme switching support
  fix-login-bug     Session timeout handling
```

---

### `openspec view`

Visualizza una dashboard interattiva per esplorare le specifiche e le modifiche.

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
| `item-name` | No | Nome della modifica o specifica (richiede input se omesso) |

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
| `--no-scenarios` | Escludi il contenuto degli scenari (modalità JSON) |
| `-r, --requirement <id>` | Mostra un requisito specifico per indice basato su 1 (modalità JSON) |

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

Valida le modifiche e le specifiche per problemi strutturali.

```
openspec validate [item-name] [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `item-name` | No | Elemento specifico da validare (richiede input se omesso) |

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
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
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
        "warnings": ["design.md: missing 'Technical Approach' section"]
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
|----------|----------|-------------|
| `change-name` | No | Modifica da archiviare (richiede input se omesso) |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `-y, --yes` | Salta i prompt di conferma |
| `--skip-specs` | Salta gli aggiornamenti delle specifiche (per modifiche a infrastruttura, strumenti o solo documentazione) |
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

1. Valida la modifica (a meno che `--no-validate`)
2. Richiede conferma (a meno che `--yes`)
3. Unisce le specifiche delta in `openspec/specs/`
4. Sposta la cartella della modifica in `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Comandi del Flusso di Lavoro

Questi comandi supportano il flusso di lavoro OPSX guidato dagli artifact. Sono utili sia per gli sviluppatori che verificano i progressi, sia per gli agenti che determinano i passaggi successivi.

### `openspec new change`

Crea una directory locale nel repository per la modifica e metadati opzionali registrati.

```bash
openspec new change <name> [options]
```

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--description <text>` | Descrizione da aggiungere a `README.md` |
| `--goal <text>` | Obiettivo prodotto del workspace da memorizzare con la modifica |
| `--areas <names>` | Nomi dei link del workspace interessati, separati da virgola |
| `--initiative <id>` | Collega la modifica locale del repository a un'iniziativa |
| `--store <id>` | ID del context store per `--initiative` |
| `--store-path <path>` | Root del context store locale esistente per `--initiative` |
| `--schema <name>` | Schema del flusso di lavoro da utilizzare |
| `--json` | Output in formato JSON |

Esempi:

```bash
openspec new change add-billing-api --initiative billing-launch --store platform
openspec new change add-billing-api --initiative platform/billing-launch --json
```

### `openspec set change`

Aggiorna i metadati registrati della modifica locale del repository senza ricreare la modifica.

```bash
openspec set change <name> [options]
```

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--initiative <id>` | Collega la modifica locale del repository a un'iniziativa |
| `--store <id>` | ID del context store per `--initiative` |
| `--store-path <path>` | Root del context store locale esistente per `--initiative` |
| `--json` | Output in formato JSON |

`set change --initiative` è idempotente quando il collegamento richiesto esiste già e rifiuta di sostituire un collegamento a un'iniziativa esistente diversa.

### `openspec status`

Visualizza lo stato di completamento degli artifact per una modifica.

```
openspec status [options]
```

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--change <id>` | Nome della modifica (richiede input se omesso) |
| `--schema <name>` | Override dello schema (rilevato automaticamente dalla configurazione della modifica) |
| `--json` | Output in formato JSON |

**Esempi:**

```bash
# Controllo dello stato interattivo
openspec status

# Stato per una modifica specifica
openspec status --change add-dark-mode

# JSON per uso dell'agente
openspec status --change add-dark-mode --json
```

**Output (testo):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
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

Ottieni istruzioni arricchite per la creazione di un artifact o l'applicazione dei task. Utilizzato dagli agenti AI per capire cosa creare successivamente.

```
openspec instructions [artifact] [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `artifact` | No | ID dell'artifact: `proposal`, `specs`, `design`, `tasks` o `apply` |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--change <id>` | Nome della modifica (obbligatorio in modalità non interattiva) |
| `--schema <name>` | Override dello schema |
| `--json` | Output in formato JSON |

**Caso speciale:** Usa `apply` come artifact per ottenere le istruzioni di implementazione dei task.

**Esempi:**

```bash
# Ottieni istruzioni per il prossimo artifact
openspec instructions --change add-dark-mode

# Ottieni istruzioni per un artifact specifico
openspec instructions design --change add-dark-mode

# Ottieni istruzioni di applicazione/implementazione
openspec instructions apply --change add-dark-mode

# JSON per consumo dell'agente
openspec instructions design --change add-dark-mode --json
```

**L'output include:**

- Contenuto del template per l'artifact
- Contesto del progetto dalla configurazione
- Contenuto dagli artifact di dipendenza
- Regole per artifact dalla configurazione

---

### `openspec templates`

Mostra i percorsi dei template risolti per tutti gli artifact in uno schema.

```
openspec templates [options]
```

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--schema <name>` | Schema da ispezionare (predefinito: `spec-driven`) |
| `--json` | Output in formato JSON |

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

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Elenca gli schema di flusso di lavoro disponibili con le loro descrizioni e i flussi degli artifact.

```
openspec schemas [options]
```

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--json` | Output in formato JSON |

**Esempio:**

```bash
openspec schemas
```

**Output:**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

---

## Comandi Schema

Comandi per la creazione e gestione di schemi di workflow personalizzati.

### `openspec schema init`

Crea un nuovo schema locale al progetto.

```
openspec schema init <name> [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `name` | Sì | Nome dello schema (kebab-case) |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--description <text>` | Descrizione dello schema |
| `--artifacts <list>` | ID degli artefatti separati da virgola (predefinito: `proposal,specs,design,tasks`) |
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
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**Cosa viene creato:**

```
openspec/schemas/<name>/
├── schema.yaml           # Definizione dello schema
└── templates/
    ├── proposal.md       # Modello per ciascun artefatto
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Copia uno schema esistente nel progetto per la personalizzazione.

```
openspec schema fork <source> [name] [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `source` | Sì | Schema da copiare |
| `name` | No | Nome del nuovo schema (predefinito: `<source>-custom`) |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
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
|----------|----------|-------------|
| `name` | No | Schema da validare (valida tutti se omesso) |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
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
openspec schema which [name] [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `name` | No | Nome dello schema |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--all` | Elenca tutti gli schemi con le relative fonti |
| `--json` | Output in formato JSON |

**Esempio:**

```bash
# Controlla da dove proviene uno schema
openspec schema which spec-driven
```

**Output:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Precedenza degli schemi:**

1. Progetto: `openspec/schemas/<name>/`
2. Utente: `~/.local/share/openspec/schemas/<name>/`
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
|------------|-------------|
| `path` | Mostra il percorso del file di configurazione |
| `list` | Mostra tutte le impostazioni correnti |
| `get <key>` | Ottieni un valore specifico |
| `set <key> <value>` | Imposta un valore |
| `unset <key>` | Rimuovi una chiave |
| `reset` | Ripristina i valori predefiniti |
| `edit` | Apri in `$EDITOR` |
| `profile [preset]` | Configura il profilo del workflow in modo interattivo o tramite preset |

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

# Configura il profilo con la procedura guidata basata su azioni
openspec config profile

# Preset rapido: passa i workflow a core (mantiene la modalità di consegna)
openspec config profile core
```

`openspec config profile` inizia con un riepilogo dello stato corrente, quindi consente di scegliere:
- Modifica consegna + workflow
- Modifica solo la consegna
- Modifica solo i workflow
- Mantieni le impostazioni correnti (esci)

Se mantieni le impostazioni correnti, non vengono scritte modifiche e non viene mostrato alcun prompt di aggiornamento.
Se non ci sono modifiche alla configurazione ma i file del progetto o del workspace corrente non sono sincronizzati con il tuo profilo/consegna globale, OpenSpec mostrerà un avviso e suggerirà `openspec update` per i progetti locali al repository o `openspec workspace update` per la guida e le competenze locali al workspace.
Premendo `Ctrl+C` si annulla anche il flusso in modo pulito (nessuno stack trace) e si esce con codice `130`.
Nella checklist dei workflow, `[x]` indica che il workflow è selezionato nella configurazione globale. Per applicare queste selezioni ai file del progetto, esegui `openspec update` (oppure scegli `Apply changes to this project now?` quando richiesto all'interno di un progetto). Da all'interno di un workspace, usa `openspec workspace update` per aggiornare la guida e le competenze locali al workspace; questo rimane limitato alle competenze per i file di workflow generati dall'agente e non genera comandi slash del workspace.

**Esempi interattivi:**

```bash
# Aggiornamento solo della consegna
openspec config profile
# scegli: Change delivery only
# scegli la consegna: Skills only

# Aggiornamento solo dei workflow
openspec config profile
# scegli: Change workflows only
# attiva/disattiva i workflow nella checklist, quindi conferma
```

---

## Comandi di Utilità

### `openspec feedback`

Invia un feedback su OpenSpec. Crea una issue su GitHub.

```
openspec feedback <message> [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `message` | Sì | Messaggio di feedback |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--body <text>` | Descrizione dettagliata |

**Requisiti:** GitHub CLI (`gh`) deve essere installato e autenticato.

**Esempio:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Gestisce il completamento della shell per la CLI di OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Sottocomandi:**

| Sottocomando | Descrizione |
|------------|-------------|
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
|------|---------|
| `0` | Successo |
| `1` | Errore (errore di validazione, file mancanti, ecc.) |

---

## Variabili d'Ambiente

| Variabile | Descrizione |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Imposta a `0` per disabilitare la telemetria |
| `DO_NOT_TRACK` | Imposta a `1` per disabilitare la telemetria (segnale DNT standard) |
| `OPENSPEC_CONCURRENCY` | Concorrenza predefinita per la validazione in blocco (predefinito: 6) |
| `EDITOR` o `VISUAL` | Editor per `openspec config edit` |
| `NO_COLOR` | Disabilita l'output a colori se impostato |

---

## Documentazione Correlata

- [Comandi](commands.md) - Comandi slash AI (`/opsx:propose`, `/opsx:apply`, ecc.)
- [Workflow](workflows.md) - Pattern comuni e quando usare ciascun comando
- [Personalizzazione](customization.md) - Crea schemi e modelli personalizzati
- [Guida introduttiva](getting-started.md) - Guida alla configurazione iniziale