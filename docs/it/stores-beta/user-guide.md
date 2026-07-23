# Stores: Pianificazione nel proprio repository

> **Beta.** Stores, riferimenti, contesto di lavoro e worksets sono nuovi. I nomi dei comandi, le flag, i formati di file e l'output JSON potrebbero ancora cambiare forma tra le versioni. Tutte le guide passo passo riportate di seguito sono state eseguite sulla build corrente, ma rileggi questa guida dopo l'aggiornamento.

## Il problema che risolve

OpenSpec risiede normalmente all'interno di un singolo repository di codice: una cartella `openspec/` accanto al tuo codice, che contiene le specs e le modifiche per quel repository.

Questo non funziona più nel momento in cui la tua pianificazione supera i confini di un singolo repository:

- Il tuo lavoro coinvolge più repository: una singola funzionalità interessa il server API, l'app web e una libreria condivisa. In quale cartella `openspec/` deve risiedere la pianificazione?
- Il tuo team pianifica prima che il codice venga creato, o pianifica elementi che non diventeranno mai codice in *questo* repository.
- I requisiti sono gestiti da un singolo team e utilizzati da altri. La versione sul wiki si discosta nel tempo, e il tuo coding agent non può comunque leggerla.

Uno **store** è la soluzione: un repository autonomo il cui unico scopo è la pianificazione. Ha la stessa struttura `openspec/` che già conosci — specs e modifiche — oltre a un piccolo file di identità. Lo registri sulla tua macchina una sola volta, per nome, e da quel momento tutti i comandi OpenSpec standard possono operare al suo interno da qualsiasi posizione.

## La struttura

```
            team-plans  (uno store: pianificazione nel proprio repository)
            ├── .openspec-store/store.yaml     identità: "I am team-plans"
            └── openspec/
                ├── specs/      cosa è vera
                └── changes/    cosa è in corso
                      ▲
                      │ registrato su ogni macchina per nome;
                      │ condiviso tramite push/clone come per qualsiasi repository
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (repository di codice)   (repository di codice)    (repository di codice)
```

Due regole mantengono tutto semplice:

1. **Uno store è solo un repository git.** Tu effettui commit, push, pull e revisioni autonomamente. OpenSpec non clona, sincronizza o effettua push di alcun contenuto per conto proprio.
2. **Dichiarazioni, non meccanismi.** I repository possono *dichiarare* come si relazionano agli store (mostrato di seguito). Le dichiarazioni modificano ciò che OpenSpec può comunicarti — mai dove agiscono i tuoi comandi.

## Cinque minuti per il tuo primo store

Due comandi ti portano da zero a una modifica funzionante, associata a uno store:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store pronto: team-plans
Posizione: /Users/you/openspec/team-plans
Root OpenSpec: pronto
Registro: registrato

Prossimo passo: esegui comandi OpenSpec normali su questo store, ad esempio:
  openspec new change <change-id> --store team-plans
Condividi questo store effettuando commit e push come per qualsiasi repository Git.
```

```bash
openspec new change add-login --store team-plans
```

```
Utilizzo della root OpenSpec: team-plans (/Users/you/openspec/team-plans)
Modifica 'add-login' creata in /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: basato su specifiche
Prossimo passo: openspec status --change add-login --store team-plans
```

Questo è l'intero modello. Da qui il ciclo di vita è esattamente quello che conosci — `status`, `instructions`, `validate`, `archive` — con `--store team-plans` in ogni comando, e ogni suggerimento stampato riporta il flag per te. La riga `Utilizzo della root OpenSpec:` indica sempre dove agisce un comando.

## Caso d'uso: un solo team, un solo repository di pianificazione

Un team conserva le sue specifiche e le sue modifiche in `team-plans` invece di distribuirle tra i repository di codice.

**Giorno uno (chiunque si occupi della configurazione):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Passando `--remote` si registra l'URL di clone nel file di identità dello store (`.openspec-store/store.yaml`), nel commit iniziale. Ogni clone futuro nasce già conoscendo la sua origine, quindi i controlli di integrità e i messaggi di errore possono mostrare una soluzione completa e copiabile per i membri del team che non lo hanno ancora.

**Ogni membro del team (una sola volta per macchina):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

Da quel momento in poi, tutti lavorano sullo stesso repository di pianificazione per nome:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**La condivisione del lavoro avviene tramite git, di proposito.** Una modifica che crei esiste solo nel tuo checkout finché non effettui commit e push — esattamente come per il codice. I piani ottengono branch, pull request e revisioni gratuitamente, perché uno store è un repository ordinario.

**Connessione dei repository di codice del team.** Un repository di codice la cui pianificazione è completamente esternalizzata necessita di una sola riga, in `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Ora ogni comando OpenSpec eseguito all'interno di `web-app` agisce su `team-plans` senza alcun flag:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Utilizzo della root OpenSpec: team-plans (/Users/you/openspec/team-plans)
...
```

Il puntatore è un fallback, mai una sovrascrittura: un `--store` esplicito ha sempre la precedenza, e se il repository sviluppa cartelle di pianificazione proprie, queste hanno la precedenza (con un avviso per rimuovere il puntatore obsoleto).

**Un solo default per ogni repository sulla tua macchina.** Se lavori su molti repository di codice che pianificano tutti sullo stesso store, impostalo una sola volta, a livello globale, invece di aggiungere la riga `store:` a ogni repository:

```bash
openspec config set defaultStore team-plans
```

Ora qualsiasi comando eseguito al di fuori di una root di pianificazione — e senza `--store` e senza puntatore di progetto — viene risolto come `team-plans`. Si trova in fondo alla lista di precedenza, quindi `--store`, una root locale e un puntatore `store:` di progetto hanno comunque tutti la precedenza. Il banner della root e il blocco `root` JSON riportano `source: "global_default"` con l'id dello store, quindi puoi sempre distinguere un default a livello di macchina dal puntatore di un repository. Eliminalo con `openspec config unset defaultStore`. Se l'id non è registrato, i comandi generano un errore e ti indicano di registrarlo o di eliminare il default obsoleto.

## Caso d'uso: requisiti che attraversano i confini tra team

Un team di piattaforma possiede i requisiti. I team di prodotto sviluppano basandosi su di essi, nei propri repository, con i propri design. Un riferimento descrive questa relazione senza spostare il lavoro di nessuno.

```
   platform-reqs (store)                 api-server (repository di codice)
   di proprietà del team di piattaforma            di proprietà di un team di prodotto
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ legge    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (i loro design)        │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (il loro lavoro)       │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**Il team di prodotto dichiara da cosa attinge nel file `openspec/config.yaml` del proprio repository:**

```yaml
references:
  - platform-reqs
```

I riferimenti sono contesto di sola lettura. Il repository mantiene la propria root `openspec/`; il lavoro rimane lì. Ciò che cambia: `openspec instructions` in quel repository ora include un indice delle specifiche dello store referenziato — ognuna con un riassunto di una riga e il comando di fetch esatto (`openspec show <spec-id> --type spec --store platform-reqs`). Un agente che lavora in `api-server` può trovare i requisiti di pagamento upstream, citarli e scrivere il proprio design di basso livello nella root del repository — senza che nessuno debba incollare contesto in giro.

Un riferimento può riportare la sua sorgente di clone, quindi i membri del team che non hanno ancora lo store ottengono una soluzione completa invece di un vicolo cieco:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Quando vuoi avere piano e codice aperti insieme, crea un workset.** Questo è personale e esplicito: ogni persona sceglie le cartelle con cui lavora effettivamente sulla propria macchina. Nulla di questi percorsi di checkout locali viene committato nel repository di pianificazione condiviso.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Due domande che puoi sempre fare

**"La mia configurazione è integra?"** — `openspec doctor` controlla la root corrente e i suoi store referenziati, in sola lettura, con una soluzione copiabile per ogni riscontro:

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

Riferimenti
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Lo store referenziato 'design-system' non è registrato su questa macchina.
    Correzione: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"Con cosa sto lavorando?"** — `openspec context` assembla il set di lavoro dalle dichiarazioni OpenSpec: la root e gli store che referenzia.

```
Contesto di lavoro per api-server (/Users/you/src/api-server)

Root OpenSpec
  api-server  /Users/you/src/api-server

Store referenziati
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

Entrambi supportano `--json` per gli agenti. `openspec context --code-workspace <path>` scrive inoltre un file di workspace di VS Code contenente l'intero set — l'unica operazione di scrittura eseguita da questo comando.

## Workset: riapri le cartelle su cui lavori insieme

Separato da tutto quanto sopra: la maggior parte delle persone apre le stesse poche cartelle insieme ogni sessione — il repository di pianificazione più due o tre repository di codice. Un **workset** è una vista personale e nominata di esattamente questo, che viene riaperta con un solo comando nel tool di tua scelta.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       tutti e tre aperti nel tuo tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (si apre in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` avvia quindi il tool salvato: gli editor (VS Code, Cursor) aprono una sola finestra con tutti i membri e terminano. Il primo membro è quello primario. Puoi sovrascrivere il tool in qualsiasi momento con `--tool <id>`.

I workset non sono deliberatamente stato condiviso. Risiedono sulla tua macchina, non vengono mai committati e non formulano alcuna affermazione sul lavoro — registrano solo cosa ti piace tenere aperto insieme. Rimuoverne uno non tocca mai le cartelle dei membri. I nuovi tool sono configurazione, non codice: qualsiasi cosa avviata tramite un file di workspace o flag di attach per cartella può essere aggiunta sotto la chiave `openers` nella configurazione globale (`openspec config edit`).

## Come i comandi decidono dove agire

Ogni comando normale risolve la propria root allo stesso modo, in questo ordine:

```
1. --store <id>          l'hai specificato esplicitamente        → quello store
2. nearest openspec/     una root di pianificazione reale qui     → questo repository
   (risalendo dalla directory di lavoro corrente)
3. store: pointer        config.yaml dichiara uno store  → quello store
4. defaultStore          la configurazione globale imposta un default per la macchina  → quello store
5. nessuno dei casi precedenti  store registrati su questa macchina? → errore con un suggerimento di selezione
                         nessuno store registrato?         → la directory corrente
                                                          (comportamento classico)
```

La riga `Utilizzo della root OpenSpec:` (e il blocco `root` nell'output `--json`) indica in quale caso ti trovi.

## Limitazioni note

- **Versione beta.** Tutto il contenuto di questa pagina potrebbe cambiare tra le release — nomi, flag, formati di file, chiavi JSON.
- **Un solo checkout per id di store per macchina.** La registrazione di un secondo checkout con lo stesso id fallisce con un suggerimento di eseguire prima `store unregister`.
- **Nessuna sincronizzazione, mai — per progetto.** OpenSpec non clona, esegue pull o push. Un checkout obsoleto mostra specifiche obsolete finché non esegui pull; i riferimenti sono indicizzati in tempo reale da qualsiasi contenuto presente su disco.
- **Le cartelle di pianificazione vuote possono essere assenti.** Un nuovo store potrebbe non avere ancora `openspec/changes/`, `openspec/specs/` o `openspec/changes/archive/` in Git. Questo è accettato durante la versione beta; queste cartelle vengono create una volta che i comandi normali generano file al loro interno.
- **I repository puntatore rimangono puntatori.** Un repository solo di configurazione il cui file `openspec/config.yaml` dichiara `store: <id>` viene trattato come pianificazione esternalizzata, non come checkout di store da registrare. Rimuovi prima la riga `store:` se vuoi convertire intenzionalmente quel repository in una root di store locale.
- **Alcuni comandi rimangono dove sono.** `view`, `templates`, `schemas` e le forme nominali deprecate (`openspec change show`, ...) agiscono solo sulla directory corrente — nessun `--store`.
- **Lo stato per macchina è specifico per macchina.** Il registro degli store e i workset sono impostazioni locali. Nulla della configurazione della tua macchina viene mai committato nella pianificazione condivisa.
- **Due stili di avvio per i workset.** Un tool che non può essere avviato con un file di workspace o flag di attach per cartella non può essere aggiunto come opener.
- **Il JSON per agenti presenta una divisione di casing nota** (le chiavi della famiglia store sono `snake_case`, quelle della famiglia workflow sono `camelCase`). Documentato nel [contratto agente](../agent-contract.md); l'unificazione è rimandata a una release con versione.

## Dove si trovano i file

| Elemento | Posizione | Condiviso? |
|---|---|---|
| La pianificazione di un negozio | `<store>/openspec/` (specifiche, modifiche) | Sì — eseguire commit e push |
| L'identità di un negozio | `<store>/.openspec-store/store.yaml` | Sì — incluso nel commit del negozio |
| Il registro dei negozi | `<data dir>/openspec/stores/registry.yaml` | No — solo su questa macchina |
| Workset | `<data dir>/openspec/worksets/` | No — solo su questa macchina |

`<data dir>` corrisponde a `~/.local/share/openspec` su macOS e Linux (oppure a `$XDG_DATA_HOME/openspec` se impostato), e a `%LOCALAPPDATA%\openspec` su Windows.

## Riferimento

Flag esatti e struttura JSON per ogni comando presente in questa pagina:
[Riferimento CLI](../cli.md) (Negozi, Doctor, Contesto di lavoro, Workset personali) e il [contratto agente](../agent-contract.md).