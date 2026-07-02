# Riferimento CLI

La CLI OpenSpec (`openspec`) fornisce comandi da terminale per l'impostazione del progetto, la validazione, l'ispezione dello stato e la gestione. Questi comandi completano i comandi slash AI (come `/opsx:propose`) documentati in [Commands](commands.md).

## Riepilogo

| Categoria | Comandi | Scopo |
|----------|----------|---------|
| **Setup** | `init`, `update` | Inizializzare e aggiornare OpenSpec nel tuo progetto |
| **Stores (repository OpenSpec autonomi)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Gestire i repository — repository OpenSpec autonomi che hai registrato |
| **Health** | `doctor` | Rapportare la salute delle relazioni per la radice risolta |
| **Working context** | `context` | Assemblare l'insieme di lavoro (root + store referenziati) |
| **Personal worksets** | `workset create`, `workset list`, `workset open`, `workset remove` | Conservare e aprire visualizzazioni di lavoro personali e locali nel tuo strumento |
| **Browsing** | `list`, `view`, `show` | Esplorare modifiche e specifiche |
| **Validation** | `validate` | Controllare le modifiche e le specifiche per problemi |
| **Lifecycle** | `archive` | Finalizzare le modifiche completate |
| **Workflow** | `new change`, `status`, `instructions`, `templates`, `schemas` | Supporto del flusso di lavoro basato su artefatti |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Creare e gestire flussi di lavoro personalizzati |
| **Config** | `config` | Visualizzare e modificare le impostazioni |
| **Utility** | `feedback`, `completion` | Feedback e integrazione con la shell |

## Comandi per Umani e Agenti

La maggior parte dei comandi CLI è progettata per l'uso **umano** in un terminale. Alcuni comandi supportano anche l'**uso da parte di agenti/script** tramite output JSON.

### Comandi Solo per Umani

Questi comandi sono interattivi e progettati per l'uso nel terminale:

| Comando | Scopo |
|---------|---------|
| `openspec init` | Inizializza il progetto (prompt interattivi) |
| `openspec view` | Dashboard interattiva |
| `openspec workset open <name>` | Apri un set di lavoro salvato (finestra dell'editor o sessione agente terminale) |
| `openspec config edit` | Apre la configurazione nell'editor |
| `openspec feedback` | Invia feedback tramite GitHub |
| `openspec completion install` | Installa i completamenti della shell |

### Comandi Compatibili con Agenti

Questi comandi supportano l'output `--json` per l'uso programmatico da parte di agenti AI e script:

| Comando | Uso Umano | Uso Agente |
|---------|-----------|------------|
| `openspec list` | Sfoglia i cambiamenti/specifiche | `--json` per dati strutturati |
| `openspec show <item>` | Legge il contenuto | `--json` per l'analisi |
| `openspec validate` | Controlla eventuali problemi | `--all --json` per la convalida in blocco |
| `openspec status` | Visualizza lo stato dell'artefatto | `--json` per lo stato strutturato |
| `openspec instructions` | Ottiene i passaggi successivi | `--json` per le istruzioni dell'agente |
| `openspec templates` | Trova i percorsi dei template | `--json` per la risoluzione del percorso |
| `openspec schemas` | Elenca gli schemi disponibili | `--json` per la scoperta dello schema |
| `openspec store setup <id>` | Crea e registra un repository locale | `--json` con input espliciti per output di configurazione strutturata |
| `openspec store register <path>` | Registra un repository esistente | `--json` per l'output di registrazione strutturato |
| `openspec store unregister <id>` | Dimentica una registrazione del repository locale | `--json` per l'output di pulizia strutturata |
| `openspec store remove <id>` | Elimina una cartella di repository registrata | `--yes --json` per eliminazione non interattiva |
| `openspec store list` | Sfoglia i repository registrati | `--json` per le registrazioni strutturate |
| `openspec store doctor` | Controlla la configurazione del repository locale | `--json` per i diagnostici strutturati |
| `openspec new change <id>` | Crea lo scaffolding di un cambiamento a livello di repo | `--json`, più `--store <id>` per utilizzare un repository registrato come radice OpenSpec |
| `openspec workset create [name]` | Compone una visualizzazione di lavoro personale | `--member <path> --json` per la composizione non interattiva |
| `openspec workset list` | Sfoglia i set di lavoro salvati | `--json` per le viste strutturate |
| `openspec workset remove <name>` | Elimina una visualizzazione salvata | `--yes --json` per l'eliminazione non interattiva |

---

## Opzioni Globali

Queste opzioni funzionano con tutti i comandi:

| Opzione | Descrizione |
|--------|-------------|
| `--version`, `-V` | Mostra il numero di versione |
| `--no-color` | Disabilita l'output a colori |
| `--help`, `-h` | Visualizza l'aiuto per il comando |

---

## Comandi di Configurazione

### `openspec init`

Inizializza OpenSpec nel tuo progetto. Crea la struttura delle cartelle e configura le integrazioni degli strumenti AI.

Il comportamento predefinito utilizza i valori predefiniti della configurazione globale: profilo `core`, consegna `both`, flussi di lavoro `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|----------|---------------|-------------|
| `path` | No | Directory di destinazione (predefinito: directory corrente) |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--tools <list>` | Configura gli strumenti AI in modo non interattivo. Usa `all`, `none` o una lista separata da virgole |
| `--force` | Pulizia automatica dei file legacy senza richiedere conferma |
| `--profile <profile>` | Sovrascrive il profilo globale per questa esecuzione di init (`core` o `custom`) |

`--profile custom` utilizza i flussi di lavoro attualmente selezionati nella configurazione globale (`openspec config profile`).

**ID degli strumenti supportati (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

> Questa lista rispecchia `AI_TOOLS` in `src/core/config.ts`. Vedi [Supported Tools](supported-tools.md) per le abilità e i percorsi dei comandi di ciascuno strumento.

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

# Salta i prompt e pulisce automaticamente i file legacy
openspec init --force
```

**Cosa crea:**

```
openspec/
├── specs/              # Le tue specifiche (fonte di verità)
├── changes/            # Cambiamenti proposti
└── config.yaml         # Configurazione del progetto

.claude/skills/         # Abilità Claude Code (se selezionato claude)
.cursor/skills/         # Abilità Cursor (se selezionato cursor)
.cursor/commands/       # Comandi OPSX di Cursor (se la consegna include comandi)
... (altre configurazioni degli strumenti)
```

---

### `openspec update`

Aggiorna i file di istruzione OpenSpec dopo aver aggiornato la CLI. Rigenera i file di configurazione degli strumenti AI utilizzando il tuo profilo globale corrente, i flussi di lavoro selezionati e la modalità di consegna.

```
openspec update [path] [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|----------|---------------|-------------|
| `path` | No | Directory di destinazione (predefinito: directory corrente) |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--force` | Forza l'aggiornamento anche quando i file sono aggiornati |

**Esempio:**

```bash
# Aggiorna i file di istruzione dopo npm upgrade
npm update @fission-ai/openspec
openspec update
```

---

## Repository OpenSpec Autonomi (Stores)

> **Beta.** I repository e le funzionalità basate su di essi (riferimenti, contesto di lavoro, set di lavoro) sono nuovi; i nomi dei comandi, i flag, i formati file e l'output JSON possono cambiare tra le release. Per la guida passo-passo focalizzata sul problema, vedi [stores guide](stores-beta/user-guide.md).

Un repository (store) è un repository OpenSpec autonomo che hai registrato su questa macchina — ad esempio, un repository di pianificazione o un repository di contratti. Registrare un store consente ai comandi normali (`list`, `show`, `status`, `validate`, `new change`, `archive`, ...) di agire al suo interno da qualsiasi luogo passando `--store <id>`.

### `openspec store setup`

Crea e registra un repository locale. Senza argomenti in un terminale,
OpenSpec guida l'utente attraverso la configurazione. Agenti e script dovrebbero fornire input espliciti
e usare `--json`.

```bash
openspec store setup [id] [options]
```

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--path <path>` | Cartella in cui deve risiedere il repository (ad esempio `~/openspec/<id>`) |
| `--remote <url>` | Registra il remoto canonico nel `store.yaml` del nuovo repository |
| `--init-git` | Inizializza un repository Git con un commit iniziale (predefinito) |
| `--no-init-git` | Salta ogni azione Git: nessun init, nessun commit iniziale |
| `--json` | Output JSON |

Le esecuzioni non interattive (`--json`, script, agenti) devono fornire sia l'ID del repository che `--path`. In un terminale interattivo, la configurazione chiede la posizione con una suggerimento modificabile in un luogo visibile e di proprietà dell'utente (ad esempio `~/openspec/<id>`); non utilizza mai il percorso predefinito della directory dati gestita da OpenSpec.

Esempi:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Registra una cartella di repository locale esistente.

```bash
openspec store register [path] [options]
```

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--id <id>` | ID del repository; predefinito dal metadato o dal nome della cartella |
| `--yes` | Conferma la creazione dei metadati di identità del repository per una radice OpenSpec sana |
| `--json` | Output JSON |

### `openspec store unregister`

Dimentica una registrazione del repository locale senza eliminare i file.

```bash
openspec store unregister <id> [--json]
```

Usalo quando un repository è stato spostato, clonato altrove o non dovrebbe più essere visualizzato da OpenSpec su questa macchina.

### `openspec store remove`

Dimentica una registrazione del repository locale ed elimina la sua cartella locale.

```bash
openspec store remove <id> [--yes] [--json]
```

`remove` mostra l'esatta cartella prima di eliminarla in un terminale interattivo. Agenti, script e chiamanti JSON devono fornire `--yes` per confermare l'eliminazione. OpenSpec rifiuta di eliminare una cartella che non contiene metadati del repository corrispondenti.

### `openspec store list`

Elenca i repository registrati localmente.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Controlla la registrazione del repository locale, i metadati e la presenza di Git.

```bash
openspec store doctor [id] [--json]
```

Doctor è solo diagnostico; segnala radici mancanti, discrepanze nei metadati e stato del registro locale non valido senza modificare il repository.

### Riferimento ai repository da un progetto

Un repository di progetto può dichiarare quali repository utilizza nel file `openspec/config.yaml`:

```yaml
schema: spec-driven
references:
  - team-context
```

Da quel momento in poi, l'output di `openspec instructions` in quel repository (sia per artefatto che per la superficie `apply`, modalità JSON e umana) contiene un indice delle specifiche di ciascun repository referenziato — ID delle specifiche, un riassunto di una riga dalla sezione Scopo di ciascuna specifica e il comando di recupero (`openspec show <spec-id> --type spec --store <id>`). L'indice viene costruito in tempo reale dal checkout registrato ad ogni esecuzione; il contenuto della specifica non viene mai copiato nell'output.

I riferimenti sono un contesto solo di lettura. Non cambiano mai dove agiscono i comandi: il lavoro rimane nella radice del repository, e la scrittura su un repository referenziato rimane un'azione esplicita `--store`. Un riferimento che non può essere risolto (ad esempio, un repository non registrato su questa macchina) degenera in un avviso nell'indice con la correzione esatta, e le istruzioni continuano a generarsi. `openspec doctor` segnala lo stato di salute del riferimento in un unico posto.

### Registrare da dove è stato clonato un repository

Un repository può registrare la sua sorgente canonica di clonazione nel file di identità committato, in modo che l'onboarding non finisca mai con "registra il repository":

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

Il remoto viene salvato in `.openspec-store/store.yaml` all'interno del commit iniziale, quindi ogni clone nasce sapendo questo. Per un repository esistente, modifica `store.yaml` manualmente e committa. `store doctor` mostra il remoto registrato (e l'origine Git osservata dal checkout); setup/register lo nomina; e register registra l'origine del checkout nel registro locale della macchina.

Una dichiarazione di riferimento può anche riportare la sorgente di clonazione, in modo che un collega che non ha ancora il repository riceva una correzione completa e copiabile (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

Registrare un remoto non è sincronizzazione: OpenSpec non clona, non pulla e non pusha da solo.

### Dichiarare un repository predefinito

Un repository la cui pianificazione è completamente esterna — senza `openspec/specs/` o `openspec/changes/` locali — può dichiarare il suo repository una sola volta invece di passare `--store` ad ogni comando:

```yaml
# openspec/config.yaml (l'unico file sotto openspec/)
store: team-context
```

I comandi normali risolvono quindi automaticamente al repository dichiarato; la barra in alto e il blocco `root` JSON riportano `source: "declared"` con l'ID del repository, e i suggerimenti stampati continuano a includere `--store <id>`. La dichiarazione è un fallback, mai un override: l'uso esplicito di `--store` vince sempre, e una directory con cartelle di pianificazione reali ignora il puntatore (con un avviso). Per convertire un repository che fa riferimento in una radice OpenSpec locale, rimuovi la riga `store:` ed esegui `openspec init` — init rifiuta di creare lo scaffolding finché la dichiarazione è presente.

## Doctor (salute delle relazioni)

Una singola domanda in sola lettura, un unico punto: la radice OpenSpec è sana e i store che riferisce sono disponibili su questa macchina?

```bash
openspec doctor [--store <id>] [--json]
```

Il report separa la salute della radice, la salute dei metadati dello store (inclusa una nota quando il remoto registrato e l'origine del checkout divergono) e la salute delle referenze (le stesse istruzioni diagnostiche mostrano, con correzioni di clone per le referenze non risolte). I risultati di salute di qualsiasi gravità escono 0 — gli agenti leggono i `status` array; solo i fallimenti del comando (nessuna radice, store sconosciuto) escono 1. Doctor non clona, sincronizza né ripara. Per ottenere l'insieme assemblato stesso anziché la sua salute, usa `openspec context`.

## Contesto di lavoro (l'insieme assemblato)

Tutto ciò a cui questo lavoro si riferisce tramite le dichiarazioni OpenSpec, in un unico insieme di lavoro: la radice OpenSpec e i store che riferisce.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

Il breve JSON è consumabile dagli agenti (ogni store referenziato disponibile porta la sua ricetta di fetch; i membri non risolti portano le stesse istruzioni di correzione e il risultato di doctor). `--code-workspace` scrive inoltre un file workspace di VS Code contenente la radice più gli store referenziati disponibili (`ref:<id>` cartelle) — l'unico scritto che questo comando esegue, rifiutato senza `--force` se il file esiste. I membri non disponibili vengono segnalati, mai indovinati.

"Contesto di lavoro" è l'insieme assemblato; il campo `context:` in `openspec/config.yaml` è lo sfondo del progetto iniettato nelle istruzioni — due cose diverse. `openspec doctor` risponde se l'insieme è sano; `openspec context` risponde cosa è l'insieme.

## Personal worksets

> **Beta.** I Workset sono parte della nuova superficie beta; comandi, flag e formati file possono cambiare forma tra le release. Per la guida passo-passo, vedi [stores guide](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together).

Un workset è una visualizzazione personale e nominata delle cartelle su cui si lavora insieme — un root di pianificazione più qualsiasi altra cosa si scelga — mantenuta sulla propria macchina e riaperta per nome nello strumento. È puramente locale: mai committato, mai condiviso, mai derivato da dichiarazioni, e la rimozione non tocca mai una cartella membro.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` esegue un breve flusso guidato (o accetta i flag `--member` in modo non interattivo; il primo membro è il primario — le sessioni iniziano lì). `open` avvia lo strumento scelto: gli editor (VS Code, Cursor) aprono una finestra con ogni membro e ritornano; gli agenti CLI (Claude Code, codex) prendono il controllo di questo terminale come una sessione con tutti i membri allegati e nessun prompt precompilato, terminando quando si esce. Una cartella membro mancante al momento dell'apertura viene saltata con una nota; il resto si apre. La preferenza dello strumento salvata è sovrascrivibile per apertura con `--tool`.

Il supporto a un nuovo strumento è configurazione, non codice. Ogni strumento è uno dei due stili di avvio — `workspace-file` (avviato con il `.code-workspace` generato) o `attach-dirs` (un flag di allegazione per membro) — e la chiave `openers` in `config.json` globale (aprirlo con `openspec config edit`) aggiunge strumenti o regola i built-in per campo:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Tutto lo stato del workset vive sotto la cartella `worksets/` della directory dati globale (le viste salvate più i file `<name>.code-workspace` generati, rigenerati ad ogni apertura); eliminare quella cartella rimuove ogni traccia.

---

## Comandi di Navigazione

### `openspec list`

Elenca le modifiche o gli spec del progetto.

```
openspec list [options]
```

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--specs` | Elenca gli spec invece delle modifiche |
| `--changes` | Elenca le modifiche (default) |
| `--sort <order>` | Ordina per `recent` (default) o `name` |
| `--json` | Output in formato JSON |

**Esempi:**

```bash
# Elenca tutte le modifiche attive
openspec list

# Elenca tutti gli spec
openspec list --specs

# Output JSON per script
openspec list --json
```

**Output (testo):**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

Visualizza un dashboard interattivo per esplorare gli spec e le modifiche.

```
openspec view
```

Apri un'interfaccia basata su terminale per navigare nelle specifiche e nelle modifiche del progetto.

---

### `openspec show`

Visualizza i dettagli di una modifica o uno spec.

```
openspec show [item-name] [options]
```

**Argomenti:**

| Argomento | Richiesto | Descrizione |
|----------|----------|-------------|
| `item-name` | No | Nome della modifica o dello spec (chiede se omesso) |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--type <type>` | Specifica il tipo: `change` o `spec` (rilevato automaticamente se non ambiguo) |
| `--json` | Output in formato JSON |
| `--no-interactive` | Disabilita i prompt |

**Opzioni specifiche per le modifiche:**

| Opzione | Descrizione |
|--------|-------------|
| `--deltas-only` | Mostra solo gli spec delta (modalità JSON) |

**Opzioni specifiche per gli spec:**

| Opzione | Descrizione |
|--------|-------------|
| `--requirements` | Mostra solo i requisiti, esclude gli scenari (modalità JSON) |
| `--no-scenarios` | Esclude il contenuto dello scenario (modalità JSON) |
| `-r, --requirement <id>` | Mostra un requisito specifico tramite indice basato su 1 (modalità JSON) |

**Esempi:**

```bash
# Selezione interattiva
openspec show

# Mostra una modifica specifica
openspec show add-dark-mode

# Mostra uno spec specifico
openspec show auth --type spec

# Output JSON per l'analisi
openspec show add-dark-mode --json
```

---

## Comandi di Validazione

### `openspec validate`

Valida le modifiche e gli spec per problemi strutturali.

```
openspec validate [item-name] [options]
```

**Argomenti:**

| Argomento | Richiesto | Descrizione |
|----------|----------|-------------|
| `item-name` | No | Elemento specifico da validare (chiede se omesso) |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--all` | Valida tutte le modifiche e gli spec |
| `--changes` | Valida tutte le modifiche |
| `--specs` | Valida tutti gli spec |
| `--type <type>` | Specifica il tipo quando il nome è ambiguo: `change` o `spec` |
| `--strict` | Abilita la modalità di validazione rigorosa |
| `--json` | Output in formato JSON |
| `--concurrency <n>` | Massime validazioni parallele (default: 6, o ambiente `OPENSPEC_CONCURRENCY`) |
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

## Comandi di Ciclo di Vita

### `openspec archive`

Archivia una modifica completata e unisce gli spec delta negli spec principali.

```
openspec archive [change-name] [options]
```

**Argomenti:**

| Argomento | Richiesto | Descrizione |
|----------|----------|-------------|
| `change-name` | No | Modifica da archiviare (chiede se omesso) |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `-y, --yes` | Salta i prompt di conferma |
| `--skip-specs` | Salta gli aggiornamenti degli spec (per modifiche solo infrastrutturali/tooling/documentazione) |
| `--no-validate` | Salta la validazione (richiede conferma) |

**Esempi:**

```bash
# Archivio interattivo
openspec archive

# Archiviazione di una modifica specifica
openspec archive add-dark-mode

# Archiviazione senza prompt (CI/script)
openspec archive add-dark-mode --yes

# Archiviazione di una modifica di tooling che non influisce sugli spec
openspec archive update-ci-config --skip-specs
```

**Cosa fa:**

1. Valida la modifica (a meno che `--no-validate`)
2. Chiede conferma (a meno che `--yes`)
3. Unisce gli spec delta in `openspec/specs/`
4. Sposta la cartella della modifica in `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Comandi di Flusso di Lavoro

Questi comandi supportano il flusso di lavoro OPSX basato sugli artefatti. Sono utili sia per gli esseri umani che controllano i progressi, sia per gli agenti che determinano i passaggi successivi.

### `openspec new change`

Crea una directory della modifica e metadati opzionali sottoposti a controllo nella root OpenSpec risolta.

```bash
openspec new change <name> [options]
```

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--description <text>` | Descrizione da aggiungere in `index.md` |
| `--goal <text>` | Metadati obiettivo opzionali da memorizzare con la modifica |
| `--schema <name>` | Schema di flusso di lavoro da utilizzare |
| `--store <id>` | ID del store da usare come root OpenSpec (un store è un repo OpenSpec autonomo che hai registrato) |
| `--json` | Output JSON |

Esempi:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Visualizza lo stato di completamento dell'artefatto per una modifica.

```
openspec status [options]
```

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--change <id>` | Nome della modifica (chiede se omesso) |
| `--schema <name>` | Override dello schema (rilevato automaticamente dalla config della modifica) |
| `--json` | Output in formato JSON |

**Esempi:**

```bash
# Controllo di stato interattivo
openspec status

# Stato per una specifica modifica
openspec status --change add-dark-mode

# JSON per l'uso da parte dell'agente
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

Ottieni istruzioni arricchite per la creazione di un artefatto o l'applicazione di compiti. Utilizzato da agenti AI per capire cosa creare dopo.

```
openspec instructions [artifact] [options]
```

**Argomenti:**

| Argomento | Richiesto | Descrizione |
|----------|----------|-------------|
| `artifact` | No | ID dell'artefatto: `proposal`, `specs`, `design`, `tasks`, o `apply` |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--change <id>` | Nome della modifica (richiesto in modalità non interattiva) |
| `--schema <name>` | Override dello schema |
| `--json` | Output in formato JSON |

**Caso speciale:** Usa `apply` come artefatto per ottenere istruzioni di implementazione del compito.

**Esempi:**

```bash
# Ottieni le istruzioni per il prossimo artefatto
openspec instructions --change add-dark-mode

# Ottieni le istruzioni per un artefatto specifico
openspec instructions design --change add-dark-mode

# Ottieni le istruzioni di applicazione/implementazione
openspec instructions apply --change add-dark-mode

# JSON per il consumo da parte dell'agente
openspec instructions design --change add-dark-mode --json
```

**L'output include:**

- Contenuto del template per l'artefatto
- Contesto del progetto dalla config
- Contenuto dagli artefatti di dipendenza
- Regole specifiche dell'artefatto dalla config

---

### `openspec templates`

Mostra i percorsi dei template risolti per tutti gli artefatti in uno schema.

```
openspec templates [options]
```

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--schema <name>` | Schema da ispezionare (default: `spec-driven`) |
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

Elenca gli schemi di flusso di lavoro disponibili con le loro descrizioni e i flussi di artefatti.

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
    Il flusso di sviluppo spec-driven predefinito
    Flusso: proposal → specs → design → tasks

  my-custom (project)
    Flusso di lavoro personalizzato per questo progetto
    Flusso: research → proposal → tasks
```

## Comandi dello Schema

Comandi per creare e gestire schemi di workflow personalizzati.

### `openspec schema init`

Crea uno schema locale del progetto.

```
openspec schema init <name> [options]
```

**Argomenti:**

| Argomento | Richiesto | Descrizione |
|----------|----------|-------------|
| `name` | Sì | Nome dello schema (kebab-case) |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--description <text>` | Descrizione dello schema |
| `--artifacts <list>` | ID degli artefatti separati da virgole (default: `proposal,specs,design,tasks`) |
| `--default` | Imposta come schema predefinito del progetto |
| `--no-default` | Non chiedere di impostarlo come predefinito |
| `--force` | Sovrascrive lo schema esistente |
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

**Cosa crea:**

```
openspec/schemas/<name>/
├── schema.yaml           # Definizione dello schema
└── templates/
    ├── proposal.md       # Template per ciascun artefatto
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

| Argomento | Richiesto | Descrizione |
|----------|----------|-------------|
| `source` | Sì | Schema da copiare |
| `name` | No | Nuovo nome dello schema (default: `<source>-custom`) |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--force` | Sovrascrive la destinazione esistente |
| `--json` | Output in formato JSON |

**Esempio:**

```bash
# Fork dello schema spec-driven integrato
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Convalida la struttura e i template di uno schema.

```
openspec schema validate [name] [options]
```

**Argomenti:**

| Argomento | Richiesto | Descrizione |
|----------|----------|-------------|
| `name` | No | Schema da convalidare (convalida tutti se omesso) |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--verbose` | Mostra i passaggi di convalida dettagliati |
| `--json` | Output in formato JSON |

**Esempio:**

```bash
# Convalida uno schema specifico
openspec schema validate my-workflow

# Convalida tutti gli schemi
openspec schema validate
```

---

### `openspec schema which`

Mostra da dove risolve uno schema (utile per il debug della precedenza).

```
openspec schema which [name] [options]
```

**Argomenti:**

| Argomento | Richiesto | Descrizione |
|----------|----------|-------------|
| `name` | No | Nome dello schema |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--all` | Elenca tutti gli schemi con le loro fonti |
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

**Precedenza dello Schema:**

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

**Sotto-comandi:**

| Sotto-comando | Descrizione |
|------------|-------------|
| `path` | Mostra la posizione del file di configurazione |
| `list` | Mostra tutte le impostazioni attuali |
| `get <key>` | Ottiene un valore specifico |
| `set <key> <value>` | Imposta un valore |
| `unset <key>` | Rimuove una chiave |
| `reset` | Resetta ai valori predefiniti |
| `edit` | Apre in `$EDITOR` |
| `profile [preset]` | Configura il profilo di workflow in modo interattivo o tramite preset |

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
openspec config set user.name "My Name" --string

# Rimuove una impostazione personalizzata
openspec config unset user.name

# Resetta tutta la configurazione
openspec config reset --all --yes

# Modifica la configurazione nel tuo editor
openspec config edit

# Configura il profilo con wizard basato sull'azione
openspec config profile

# Preset veloce: cambia i workflow in core (mantiene il delivery mode)
openspec config profile core
```

`openspec config profile` inizia con un riepilto dello stato attuale, quindi ti permette di scegliere:
- Cambiare la consegna + i workflow
- Cambiare solo la consegna
- Cambiare solo i workflow
- Mantenere le impostazioni attuali (uscire)

Se mantieni le impostazioni attuali, non vengono scritti cambiamenti e non viene mostrato alcun prompt di aggiornamento.
Se non ci sono modifiche alla configurazione ma i file del progetto corrente non sono sincronizzati con il tuo profilo/delivery globale, OpenSpec mostrerà un avviso e suggerirà `openspec update`.
Premere `Ctrl+C` annulla anche il flusso in modo pulito (senza stack trace) ed esce con codice `130`.
Nella checklist del workflow, `[x]` significa che il workflow è selezionato nella configurazione globale. Per applicare queste selezioni ai file di progetto, esegui `openspec update` (o scegli `Apply changes to this project now?` quando richiesto all'interno di un progetto).

**Esempi interattivi:**

```bash
# Aggiornamento solo del delivery
openspec config profile
# scegliere: Cambiare solo la consegna
# scegliere delivery: Skills only

# Aggiornamento solo dei workflow
openspec config profile
# scegliere: Cambiare solo i workflow
# toggla i workflow nella checklist, quindi conferma
```

---

## Comandi di Utilità

### `openspec feedback`

Invia un feedback su OpenSpec. Crea un issue su GitHub.

```
openspec feedback <message> [options]
```

**Argomenti:**

| Argomento | Richiesto | Descrizione |
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

Gestisce le completamenti del shell per la CLI OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Sotto-comandi:**

| Sotto-comando | Descrizione |
|------------|-------------|
| `generate [shell]` | Output dello script di completamento su stdout |
| `install [shell]` | Installa il completamento per il tuo shell |
| `uninstall [shell]` | Rimuove i completamenti installati |

**Shell supportati:** `bash`, `zsh`, `fish`, `powershell`

**Esempi:**

```bash
# Instala i completamenti (rilevamento automatico del shell)
openspec completion install

# Installa per un shell specifico
openspec completion install zsh

# Genera script per l'installazione manuale
openspec completion generate bash > ~/.bash_completion.d/openspec

# Disinstala
openspec completion uninstall
```

---

## Codici di Uscita

| Codice | Significato |
|------|---------|
| `0` | Successo |
| `1` | Errore (fallimento della convalida, file mancanti, ecc.) |

---

## Variabili d'Ambiente

| Variabile | Descrizione |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Imposta su `0` per disabilitare la telemetria |
| `DO_NOT_TRACK` | Imposta su `1` per disabilitare la telemetria (segnale DNT standard) |
| `OPENSPEC_CONCURRENCY` | Concorrenza predefinita per la convalida in blocco (default: 6) |
| `EDITOR` o `VISUAL` | Editor per `openspec config edit` |
| `NO_COLOR` | Disabilita l'output a colori quando impostato |

---

## Documentazione Correlata

- [Commands](commands.md) - Comandi slash AI (`/opsx:propose`, `/opsx:apply`, ecc.)
- [Workflows](workflows.md) - Pattern comuni e quando usare ciascun comando
- [Customization](customization.md) - Creare schemi e template personalizzati
- [Getting Started](getting-started.md) - Guida per la prima configurazione