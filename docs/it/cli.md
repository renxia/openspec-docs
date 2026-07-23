# Riferimento CLI

La CLI di OpenSpec (`openspec`) fornisce comandi da terminale per la configurazione del progetto, la convalida, l'ispezione dello stato e la gestione. Questi comandi integrano i comandi slash AI (come `/opsx:propose`) documentati in [Comandi](commands.md).

## Riepilogo

| Categoria | Comandi | Scopo |
|----------|----------|---------|
| **Setup** | `init`, `update` | Inizializza e aggiorna OpenSpec nel tuo progetto |
| **Stores (standalone OpenSpec repos)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Gestisci gli store — repository OpenSpec autonomi che hai registrato |
| **Health** | `doctor` | Segnala lo stato di salute delle relazioni per la root risolta |
| **Working context** | `context` | Assembla il set di lavoro (root + store referenziati) |
| **Personal worksets** | `workset create`, `workset list`, `workset open`, `workset remove` | Mantieni e apri viste di lavoro personali e locali nel tuo strumento |
| **Browsing** | `list`, `view`, `show` | Esplora modifiche e specifiche |
| **Validation** | `validate` | Controlla modifiche e specifiche per individuare problemi |
| **Lifecycle** | `archive` | Finalizza le modifiche completate |
| **Workflow** | `new change`, `status`, `instructions`, `templates`, `schemas` | Supporto per flusso di lavoro basato su artefatti |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Crea e gestisci flussi di lavoro personalizzati |
| **Config** | `config` | Visualizza e modifica le impostazioni |
| **Utility** | `feedback`, `completion` | Feedback e integrazione con la shell |

## Comandi per esseri umani vs agenti

La maggior parte dei comandi CLI è progettata per l'uso da parte di esseri umani in un terminale. Alcuni comandi supportano anche l'uso da parte di agenti/script tramite output JSON.

### Comandi solo per esseri umani

Questi comandi sono interattivi e progettati per l'uso in terminale:

| Comando | Scopo |
|---------|-------|
| `openspec init` | Inizializza il progetto (prompt interattivi) |
| `openspec view` | Dashboard interattiva |
| `openspec workset open <name>` | Apre un workset salvato (finestra dell'editor o sessione di agente in terminale) |
| `openspec config edit` | Apre la configurazione nell'editor |
| `openspec feedback` | Invia feedback tramite GitHub |
| `openspec completion install` | Installa i completamenti della shell |

### Comandi compatibili con gli agenti

Questi comandi supportano l'output `--json` per l'uso programmatico da parte di agenti IA e script:

| Comando | Uso per esseri umani | Uso per agenti |
|---------|----------------------|---------------|
| `openspec list` | Esplora modifiche/specifiche | `--json` per dati strutturati |
| `openspec show <item>` | Legge il contenuto | `--json` per l'analisi |
| `openspec validate` | Controlla la presenza di problemi | `--all --json` per la validazione in blocco |
| `openspec status` | Visualizza lo stato di avanzamento degli artefatti | `--json` per lo stato strutturato |
| `openspec instructions` | Ottiene i passaggi successivi | `--json` per le istruzioni per gli agenti |
| `openspec templates` | Trova i percorsi dei modelli | `--json` per la risoluzione dei percorsi |
| `openspec schemas` | Elenca gli schemi disponibili | `--json` per la scoperta degli schemi |
| `openspec store setup <id>` | Crea e registra un archivio locale | `--json` con input espliciti per l'output di configurazione strutturato |
| `openspec store register <path>` | Registra un archivio esistente | `--json` per l'output di registrazione strutturato |
| `openspec store unregister <id>` | Dimentica la registrazione di un archivio locale | `--json` per l'output di pulizia strutturato |
| `openspec store remove <id>` | Elimina la cartella di un archivio locale registrato | `--yes --json` per l'eliminazione non interattiva |
| `openspec store list` | Esplora gli archivi registrati | `--json` per le registrazioni strutturate |
| `openspec store doctor` | Controlla la configurazione dell'archivio locale | `--json` per le diagnostiche strutturate |
| `openspec new change <id>` | Crea la struttura di base per una modifica locale al repository | `--json`, più `--store <id>` per utilizzare un archivio registrato come root di OpenSpec |
| `openspec workset create [name]` | Crea una vista di lavoro personale | `--member <path> --json` per la composizione non interattiva |
| `openspec workset list` | Esplora i workset salvati | `--json` per le viste strutturate |
| `openspec workset remove <name>` | Elimina una vista salvata | `--yes --json` per la rimozione non interattiva |

---

## Opzioni globali

Queste opzioni funzionano con tutti i comandi:

| Opzione | Descrizione |
|---------|-------------|
| `--version`, `-V` | Mostra il numero di versione |
| `--no-color` | Disabilita l'output a colori |
| `--help`, `-h` | Mostra la guida per il comando |

---

## Comandi di configurazione

### `openspec init`

Inizializza OpenSpec nel tuo progetto. Crea la struttura delle cartelle e configura le integrazioni con gli strumenti di IA.

Il comportamento predefinito utilizza le impostazioni predefinite della configurazione globale: profilo `core`, consegna `both`, flussi di lavoro `propose, explore, apply, sync, archive`.

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
| `--tools <list>` | Configura gli strumenti di IA in modo non interattivo. Usa `all`, `none` o un elenco separato da virgole |
| `--force` | Elimina automaticamente i file legacy senza richiedere conferma |
| `--profile <profile>` | Sovrascrive il profilo globale per questa esecuzione di init (`core` o `custom`) |

`--profile custom` utilizza i flussi di lavoro attualmente selezionati nella configurazione globale (`openspec config profile`).

**ID strumenti supportati (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

> Questo elenco rispecchia `AI_TOOLS` in `src/core/config.ts`. Vedi [Strumenti supportati](supported-tools.md) per le competenze e i percorsi dei comandi di ogni strumento.

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

# Salta i prompt ed elimina automaticamente i file legacy
openspec init --force
```

**Cosa crea:**

```
openspec/
├── specs/              # Le tue specifiche (fonte di verità)
├── changes/            # Modifiche proposte
└── config.yaml         # Configurazione del progetto

.claude/skills/         # Competenze di Claude Code (se claude è selezionato)
.cursor/skills/         # Competenze di Cursor (se cursor è selezionato)
.cursor/commands/       # Comandi OPSX di Cursor (se la consegna include i comandi)
... (altre configurazioni di strumenti)
```

---

### `openspec update`

Aggiorna i file di istruzioni di OpenSpec dopo l'upgrade della CLI. Rigenera i file di configurazione degli strumenti di IA utilizzando il tuo profilo globale corrente, i flussi di lavoro selezionati e la modalità di consegna.

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
| `--force` | Forza l'aggiornamento anche se i file sono già aggiornati |

**Esempio:**

```bash
# Aggiorna i file di istruzioni dopo l'upgrade di npm
npm update @fission-ai/openspec
openspec update
```

---

## Archivi (repo OpenSpec autonomi)

> **Beta.** Gli archivi e le funzionalità costruite su di essi (riferimenti, contesto di lavoro, workset) sono nuovi; i nomi dei comandi, le flag, i formati di file e l'output JSON potrebbero cambiare forma tra le release. Per una guida passo passo incentrata sul problema, consulta la [guida agli archivi](stores-beta/user-guide.md).

Un archivio è un repo OpenSpec autonomo che hai registrato su questa macchina, ad esempio un repo di pianificazione o un repo di contratti. La registrazione di un archivio consente ai comandi normali (`list`, `show`, `status`, `validate`, `new change`, `archive`, ...) di operare al suo interno da qualsiasi posizione passando `--store <id>`.

### `openspec store setup`

Crea e registra un archivio locale. Senza argomenti in un terminale, OpenSpec guida l'utente attraverso la configurazione. Agenti e script devono passare input espliciti e utilizzare `--json`.

```bash
openspec store setup [id] [options]
```

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--path <path>` | Cartella in cui deve risiedere l'archivio (ad esempio `~/openspec/<id>`) |
| `--remote <url>` | Registra il remote canonico nel `store.yaml` del nuovo archivio |
| `--init-git` | Inizializza un repository Git con un commit iniziale (predefinito) |
| `--no-init-git` | Salta tutte le azioni Git: nessuna inizializzazione, nessun commit iniziale |
| `--json` | Output JSON |

Le esecuzioni non interattive (`--json`, script, agenti) devono passare sia l'ID dell'archivio che `--path`. In un terminale interattivo, la configurazione richiede la posizione con un suggerimento modificabile in un percorso visibile di proprietà dell'utente (ad esempio `~/openspec/<id>`); non imposta mai come predefinita la directory dei dati gestita da OpenSpec.

Esempi:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Registra una cartella di archivio locale esistente. Durante la beta degli archivi, una root può essere registrata prima che esistano modifiche, che le specifiche siano state applicate o che le modifiche siano state archiviate; in tal caso `openspec/changes/`, `openspec/specs/` e `openspec/changes/archive/` potrebbero essere assenti fino a quando i comandi normali non le creano. Un repo con solo configurazione che dichiara `store: <id>` rimane un puntatore a un altro archivio e non viene registrato come root di un archivio a meno che quel puntatore non venga rimosso.

```bash
openspec store register [path] [options]
```

**Opzioni:**

| Opzione | Descrizione |
|---------|-------------|
| `--id <id>` | ID dell'archivio; predefinito come metadati dell'archivio o nome della cartella |
| `--yes` | Conferma la creazione dei metadati di identità dell'archivio per una root OpenSpec valida |
| `--json` | Output JSON |

### `openspec store unregister`

Dimentica la registrazione di un archivio locale senza eliminare i file.

```bash
openspec store unregister <id> [--json]
```

Utilizza questo comando quando un archivio è stato spostato, clonato in un'altra posizione o non deve più essere mostrato da OpenSpec su questa macchina.

### `openspec store remove`

Dimentica la registrazione di un archivio locale ed elimina la sua cartella locale.

```bash
openspec store remove <id> [--yes] [--json]
```

`remove` mostra la cartella esatta prima di eliminarla in un terminale interattivo. Agenti, script e chiamanti JSON devono passare `--yes` per confermare l'eliminazione. OpenSpec rifiuta di eliminare una cartella che non contiene metadati di archivio corrispondenti.

### `openspec store list`

Elenca gli archivi registrati localmente.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Controlla la registrazione dell'archivio locale, i metadati e la presenza di Git.

```bash
openspec store doctor [id] [--json]
```

Doctor è solo diagnostico; riporta root mancanti, discrepanze nei metadati e stato non valido del registro locale senza modificare l'archivio.

### Referenziare archivi da un progetto

Un repository di progetto può dichiarare da quali archivi attinge il proprio lavoro in `openspec/config.yaml`:

```yaml
schema: spec-driven
references:
  - team-context
```

Da quel momento in poi, l'output di `openspec instructions` in quel repo (sia le superfici per singolo artefatto che `apply`, sia in modalità JSON che per esseri umani) riporta un indice delle specifiche di ogni archivio referenziato: ID delle specifiche, un riepilogo di una riga dalla sezione Purpose di ogni specifica e il comando di recupero (`openspec show <spec-id> --type spec --store <id>`). L'indice viene generato in tempo reale dal checkout registrato a ogni esecuzione; il contenuto delle specifiche non viene mai copiato nell'output.

I riferimenti sono contesto di sola lettura. Non modificano mai il punto in cui agiscono i comandi: il lavoro rimane nella root del repository stesso, e la scrittura su un archivio referenziato rimane un'azione esplicita con `--store`. Un riferimento che non può essere risolto (ad esempio un archivio non registrato su questa macchina) viene degradato a un avviso nell'indice con la correzione esatta, e le istruzioni vengono comunque generate. `openspec doctor` riporta lo stato di salute dei riferimenti in un unico punto.

### Registrare da dove viene clonato un archivio

Un archivio può registrare la sua sorgente di clonazione canonica nel suo file di identità commitato, in modo che l'onboarding non si blocchi mai su "registra l'archivio":

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

Il remote viene inserito in `.openspec-store/store.yaml` all'interno del commit iniziale, in modo che ogni clone sappia già da dove viene. Per un archivio esistente, modifica `store.yaml` manualmente e fai il commit. `store doctor` mostra il remote registrato (e l'origine Git osservata dal checkout); le linee guida per la condivisione di setup/register lo nominano; e register registra l'origine del checkout nel registro locale della macchina.

Una dichiarazione di riferimento può riportare anche la sorgente di clonazione, in modo che un membro del team che non ha ancora l'archivio ottenga una correzione completa e copiabile (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

La registrazione di un remote non è una sincronizzazione: OpenSpec non clona, esegue pull o push di propria iniziativa.

### Dichiarare un archivio predefinito

Un repository la cui pianificazione è completamente esternalizzata, senza `openspec/specs/` o `openspec/changes/` locali, può dichiarare il proprio archivio una sola volta invece di passare `--store` a ogni comando:

```yaml
# openspec/config.yaml (l'unico file sotto openspec/)
store: team-context
```

I comandi normali risolvono automaticamente l'archivio dichiarato; il banner della root e il blocco JSON `root` riportano `source: "declared"` con l'ID dell'archivio, e i suggerimenti stampati riportano comunque `--store <id>`. La dichiarazione è un fallback, mai una sovrascrittura: il `--store` esplicito ha sempre la precedenza, e una directory con cartelle di pianificazione reali ignora il puntatore (con un avviso). Per convertire un repository puntatore in una root OpenSpec locale, rimuovi la riga `store:` ed esegui `openspec init` — init si rifiuta di creare la struttura mentre la dichiarazione è presente.

Una variante a livello di macchina si applica a tutti i repository contemporaneamente: `openspec config set defaultStore <id>` (vedi Configurazione). Viene consultata solo dopo che `--store`, una root locale e un puntatore di progetto hanno tutti fallito la risoluzione; in tal caso il banner della root e il blocco JSON `root` riportano `source: "global_default"`.

## Doctor (salute delle relazioni)

Una sola domanda in sola lettura, un solo punto: la root di OpenSpec è sana e gli store a cui fa riferimento sono disponibili su questa macchina?

```bash
openspec doctor [--store <id>] [--json]
```

Il report separa la salute della root, la salute dei metadati degli store (inclusa una nota quando il remote registrato e l'origine del checkout divergono, e una nota quando il checkout dello store è arretrato rispetto all'ultimo riferimento di tracciamento upstream scaricato), e la salute dei riferimenti (vengono mostrate le stesse istruzioni di diagnostica, con correzioni tramite clone per i riferimenti non risolti). Le risultanze di problemi di salute di qualsiasi gravità restituiscono il codice di uscita 0 — gli agenti leggono gli array `status`; solo i fallimenti del comando (nessuna root, store sconosciuto) restituiscono il codice di uscita 1. Doctor non esegue mai cloni, sincronizzazioni o riparazioni. Per ottenere l'insieme assemblato stesso invece che la sua salute, usa `openspec context`.

## Contesto di lavoro (l'insieme assemblato)

Tutto a cui questo lavoro si riferisce tramite le dichiarazioni OpenSpec, in un unico insieme di lavoro: la root di OpenSpec e gli store a cui fa riferimento.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

Il riepilogo JSON è consumabile dagli agenti (ogni store di riferimento disponibile riporta la sua ricetta di fetch; i membri non risolti riportano le stesse istruzioni di correzione mostrate da doctor). `--code-workspace` scrive inoltre un file di workspace di VS Code contenente la root più gli store di riferimento disponibili (cartelle `ref:<id>`) — l'unica operazione di scrittura che questo comando esegue, rifiutata senza `--force` se il file esiste già. I membri non disponibili vengono riportati, non vengono mai ipotizzati.

"Contesto di lavoro" è l'insieme assemblato; il campo `context:` in `openspec/config.yaml` è il background del progetto iniettato nelle istruzioni — due cose distinte. `openspec doctor` risponde se l'insieme è sano; `openspec context` risponde quale è l'insieme.

## Personal worksets

> **Beta.** I workset fanno parte della nuova superficie beta; comandi, flag e formati di file potrebbero cambiare forma tra le release. Per la guida passo passo, vedere la [guida dei negozi](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together).

Un workset è una vista personale e denominata delle cartelle su cui lavori insieme — una radice di pianificazione più qualsiasi altra cosa tu scelga — conservata sulla tua macchina e riaperta per nome nel tuo strumento. È puramente locale: non viene mai committata, mai condivisa, mai derivata da dichiarazioni e la rimozione di uno non tocca mai una cartella membro.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` esegue un breve flusso guidato (o accetta flag `--member` non in modo interattivo; il primo membro è quello primario — le sessioni iniziano da lì). `open` avvia lo strumento scelto: gli editor (VS Code, Cursor) aprono una finestra con ogni membro e terminano; gli agenti CLI (Claude Code, codex) prendono il controllo di questo terminale come sessione con ogni membro allegato e nessun prompt precompilato, terminando quando esci. Una cartella membro mancante al momento dell'apertura viene saltata con una nota; il resto si apre. La preferenza dello strumento salvata è sovrascrivibile per ogni apertura con `--tool`.

Supportare un nuovo strumento è una questione di configurazione, non di codice. Ogni strumento è uno di due stili di avvio — `workspace-file` (avviato con il `.code-workspace` generato) o `attach-dirs` (un flag di attach per ogni membro) — e la chiave `openers` nel `config.json` globale (Aprilo con `openspec config edit`) aggiunge strumenti o regola quelli integrati per campo:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Tutto lo stato dei workset si trova nella cartella `worksets/` della directory dati globale (le viste salvate più i file `<name>.code-workspace` generati, rigenerati a ogni apertura); eliminare quella cartella rimuove ogni traccia.

---

## Comandi di navigazione

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
Modifiche:
  add-dark-mode     Nessun task     proprio adesso
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

Mostra i dettagli di una modifica o di una specifica.

```
openspec show [item-name] [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|----------|-------------|-------------|
| `item-name` | No | Nome della modifica o della specifica (richiesto se omesso) |

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
| `-r, --requirement <id>` | Mostra un requisito specifico per indice in base 1 (modalità JSON) |

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

## Comandi di validazione

### `openspec validate`

Valida modifiche e specifiche per problemi strutturali.

```
openspec validate [item-name] [options]
```

Una modifica con zero delta di specifiche fallisce la validazione a meno che il suo `.openspec.yaml` dichiari `skip_specs: true` (per refactoring puri, strumentazioni o lavoro su documentazione — vedi [Ricetta 5](examples.md#recipe-5-a-refactor-with-no-behavior-change)).

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|----------|-------------|-------------|
| `item-name` | No | Elemento specifico da validare (richiesto se omesso) |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--all` | Valida tutte le modifiche e le specifiche |
| `--changes` | Valida tutte le modifiche |
| `--specs` | Valida tutte le specifiche |
| `--type <type>` | Specifica il tipo quando il nome è ambiguo: `change` o `spec` |
| `--strict` | Abilita la modalità di validazione rigorosa |
| `--json` | Output in formato JSON |
| `--concurrency <n>` | Numero massimo di validazioni parallele (predefinito: 6, o variabile d'ambiente `OPENSPEC_CONCURRENCY`) |
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

## Comandi del ciclo di vita

### `openspec archive`

Archivia una modifica completata e unisci le specifiche delta nelle specifiche principali.

```
openspec archive [change-name] [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|----------|-------------|-------------|
| `change-name` | No | Modifica da archiviare (richiesto se omesso) |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `-y, --yes` | Salta i prompt di conferma |
| `--skip-specs` | Salta gli aggiornamenti delle specifiche per una sola esecuzione di archiviazione. Una modifica che non ha permanentemente delta di specifiche dovrebbe dichiarare `skip_specs: true` nel suo `.openspec.yaml` invece — viene archiviata senza flag |
| `--no-validate` | Salta la validazione (richiede conferma) |

**Esempi:**

```bash
# Archiviazione interattiva
openspec archive

# Archivia una modifica specifica
openspec archive add-dark-mode

# Archivia senza prompt (CI/script)
openspec archive add-dark-mode --yes

# Archivia una modifica di strumentazione che non influisce sulle specifiche
openspec archive update-ci-config --skip-specs
```

**Cosa fa:**

1. Valida la modifica (a meno che non sia usato `--no-validate`)
2. Richiede conferma (a meno che non sia usato `--yes`)
3. Unisce le specifiche delta in `openspec/specs/`
4. Sposta la cartella della modifica in `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Comandi del flusso di lavoro

Questi comandi supportano il flusso di lavoro OPSX guidato dagli artefatti. Sono utili sia per gli esseri umani che controllano l'avanzamento sia per gli agenti che determinano i passaggi successivi.

### `openspec new change`

Crea una cartella di modifica e metadati opzionali versionati nella radice OpenSpec risolta.

```bash
openspec new change <name> [options]
```

I nomi delle modifiche devono usare il kebab-case in minuscolo. Iniziano con una lettera minuscola, poi contengono lettere minuscole, numeri e trattini singoli. Non possono iniziare con un numero, contenere spazi, underscore, lettere maiuscole, trattini consecutivi o trattini iniziali/finali. Quando si include un ID di ticket esterno, prefissalo con una parola, per esempio `ticket-123-add-notifications` invece di `123-add-notifications`.

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--description <text>` | Descrizione da aggiungere a `index.md` |
| `--goal <text>` | Metadati di obiettivo opzionali da memorizzare con la modifica |
| `--schema <name>` | Schema del flusso di lavoro da usare |
| `--store <id>` | ID dello store da usare come radice OpenSpec (uno store è una repo OpenSpec autonoma che hai registrato) |
| `--json` | Output in formato JSON |

Esempi:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Mostra lo stato di completamento degli artefatti per una modifica.

```
openspec status [options]
```

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--change <id>` | Nome della modifica (richiesto se omesso) |
| `--schema <name>` | Sovrascrittura dello schema (rilevato automaticamente dalla configurazione della modifica) |
| `--json` | Output in formato JSON |

**Esempi:**

```bash
# Controllo dello stato interattivo
openspec status

# Stato per una modifica specifica
openspec status --change add-dark-mode

# JSON per l'uso da parte di agenti
openspec status --change add-dark-mode --json
```

**Output (testo):**

```
Modifica: add-dark-mode
Schema: spec-driven
Avanzamento: 2/4 artefatti completati

[x] proposal
[ ] design
[x] specs
[-] tasks (bloccato da: design)
```

Una modifica che dichiara `skip_specs: true` mostra la sua fase di specifiche come `[~] specs (skipped: change declares skip_specs)` e la esclude dal conteggio dell'avanzamento.

**Output (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done", "requires": []},
    {"id": "design", "outputPath": "design.md", "status": "ready", "requires": ["proposal"]},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done", "requires": ["proposal"]},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "requires": ["specs", "design"], "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

Ottieni istruzioni arricchite per creare un artefatto o applicare i task. Utilizzato dagli agenti AI per capire cosa creare successivamente.

```
openspec instructions [artifact] [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|----------|-------------|-------------|
| `artifact` | No | ID dell'artefatto: `proposal`, `specs`, `design`, `tasks` o `apply` |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--change <id>` | Nome della modifica (obbligatorio in modalità non interattiva) |
| `--schema <name>` | Sovrascrittura dello schema |
| `--json` | Output in formato JSON |

**Caso speciale:** usa `apply` come artefatto per ottenere le istruzioni di implementazione dei task.

**Esempi:**

```bash
# Ottieni le istruzioni per il prossimo artefatto
openspec instructions --change add-dark-mode

# Ottieni le istruzioni per un artefatto specifico
openspec instructions design --change add-dark-mode

# Ottieni le istruzioni di applicazione/implementazione
openspec instructions apply --change add-dark-mode

# JSON per il consumo da parte di agenti
openspec instructions design --change add-dark-mode --json
```

**L'output include:**

- Contenuto del modello per l'artefatto
- Contesto del progetto dalla configurazione
- Contenuto dagli artefatti dipendenti
- Regole per artefatto dalla configurazione

Per un artefatto saltato tramite `skip_specs: true`, l'output è solo un avviso (il JSON aggiunge i campi `skipped`/`warning`) — l'artefatto non deve essere creato.

---

### `openspec templates`

Mostra i percorsi dei modelli risolti per tutti gli artefatti in uno schema.

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
Schemi disponibili:

  spec-driven (package)
    Il flusso di lavoro di sviluppo guidato da specifiche predefinito
    Flusso: proposal → specs → design → tasks

  my-custom (project)
    Flusso di lavoro personalizzato per questo progetto
    Flusso: research → proposal → tasks
```

## Comandi per gli Schemi

Comandi per creare e gestire schemi di flusso di lavoro personalizzati.

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
| `--force` | Sovrascrivi schema esistente |
| `--json` | Output in formato JSON |

**Esempi:**

```bash
# Creazione interattiva di schemi
openspec schema init research-first

# Non interattivo con artefatti specifici
openspec schema init rapid \
  --description "Flusso di lavoro per iterazione rapida" \
  --artifacts "proposal,tasks" \
  --default
```

**Cosa crea:**

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

Copia uno schema esistente nel tuo progetto per personalizzarlo.

```
openspec schema fork <source> [name] [options]
```

**Argomenti:**

| Argomento | Obbligatorio | Descrizione |
|----------|----------|-------------|
| `source` | Sì | Schema da copiare |
| `name` | No | Nuovo nome dello schema (predefinito: `<source>-custom`) |

**Opzioni:**

| Opzione | Descrizione |
|--------|-------------|
| `--force` | Sovrascrivi destinazione esistente |
| `--json` | Output in formato JSON |

**Esempio:**

```bash
# Forka lo schema spec-driven integrato
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
| `name` | No | Schema da validare (se omesso, valida tutti gli schemi) |

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
| `--all` | Elenca tutti gli schemi con le loro fonti |
| `--json` | Output in formato JSON |

**Esempio:**

```bash
# Controlla da dove proviene uno schema
openspec schema which spec-driven
```

**Output:**

```
spec-driven viene risolto da: package
  Fonte: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
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
| `edit` | Apri nell'`$EDITOR` |
| `profile [preset]` | Configura il profilo del flusso di lavoro in modo interattivo o tramite preset |

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

# Imposta esplicitamente un valore di tipo stringa
openspec config set user.name "My Name" --string

# Rimuovi un'impostazione personalizzata
openspec config unset user.name

# Imposta un archivio predefinito a livello di macchina (root di fallback quando non è presente --store, root locale o archivio di progetto: il puntatore viene risolto)
openspec config set defaultStore team-plans

# Ripristina tutta la configurazione
openspec config reset --all --yes

# Modifica la configurazione nel tuo editor
openspec config edit

# Configura il profilo con la procedura guidata basata su azioni
openspec config profile

# Preset veloce: passa i flussi di lavoro a core (mantiene la modalità di consegna)
openspec config profile core
```

`openspec config profile` inizia con un riepilogo dello stato corrente, quindi ti permette di scegliere:
- Modifica consegna + flussi di lavoro
- Modifica solo la consegna
- Modifica solo i flussi di lavoro
- Mantieni le impostazioni correnti (esci)

Se mantieni le impostazioni correnti, nessuna modifica viene salvata e non viene mostrato nessun prompt di aggiornamento.
Se non ci sono modifiche alla configurazione ma i file del progetto corrente non sono sincronizzati con il tuo profilo/modalità di consegna globale, OpenSpec mostrerà un avviso e suggerirà `openspec update`.
Premendo `Ctrl+C` viene annullato anche il flusso in modo pulito (nessun trace dello stack) e si esce con il codice `130`.
Nella lista di controllo dei flussi di lavoro, `[x]` indica che il flusso di lavoro è selezionato nella configurazione globale. Per applicare queste selezioni ai file del progetto, esegui `openspec update` (oppure scegli `Applica le modifiche a questo progetto ora?` quando richiesto all'interno di un progetto).

**Esempi interattivi:**

```bash
# Aggiornamento solo della consegna
openspec config profile
# scegli: Modifica solo la consegna
# scegli la consegna: Solo competenze

# Aggiornamento solo dei flussi di lavoro
openspec config profile
# scegli: Modifica solo i flussi di lavoro
# attiva/disattiva i flussi di lavoro nella lista di controllo, quindi conferma
```

---

## Comandi Utilità

### `openspec feedback`

Invia feedback su OpenSpec. Crea un issue su GitHub.

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

**Requisiti:** La CLI di GitHub (`gh`) deve essere installata e autenticata.

**Esempio:**

```bash
openspec feedback "Aggiungi il supporto per tipi di artefatti personalizzati" \
  --body "Vorrei definire i miei tipi di artefatti personalizzati oltre a quelli integrati."
```

---

### `openspec completion`

Gestisci il completamento automatico della shell per la CLI di OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Sottocomandi:**

| Sottocomando | Descrizione |
|------------|-------------|
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
|------|---------|
| `0` | Successo |
| `1` | Errore (fallimento di validazione, file mancanti, ecc.) |

---

## Variabili d'Ambiente

| Variabile | Descrizione |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Imposta a `0` per disabilitare la telemetria |
| `DO_NOT_TRACK` | Imposta a `1` per disabilitare la telemetria (segnale DNT standard) |
| `OPENSPEC_CONCURRENCY` | Concorrenza predefinita per la validazione in blocco (predefinito: 6) |
| `EDITOR` o `VISUAL` | Editor per `openspec config edit` |
| `NO_COLOR` | Disabilita l'output a colori quando impostata |

---

## Documentazione Correlata

- [Comandi](commands.md) - Comandi slash AI (`/opsx:propose`, `/opsx:apply`, ecc.)
- [Flussi di lavoro](workflows.md) - Modelli comuni e quando usare ogni comando
- [Personalizzazione](customization.md) - Crea schemi e modelli personalizzati
- [Primi passi](getting-started.md) - Guida alla configurazione iniziale