# Stores: Plan in Its Own Repo

> **Beta.** Gli store, i riferimenti (references), il contesto di lavoro (working context) e i workset sono nuove funzionalità. I nomi dei comandi, le flaghe, i formati file e l'output JSON potrebbero ancora cambiare forma tra le release. Ogni walkthrough qui sotto è stato eseguito contro la build attuale, ma rileggere questa guida dopo l'aggiornamento.

## Il problema che questo risolve

OpenSpec vive normalmente all'interno di un singolo repo di codice: una cartella `openspec/` accanto al tuo codice, contenente le specifiche e le modifiche per quel repo.

Questo non è sufficiente quando la tua pianificazione supera il confine di un solo repo:

- Il tuo lavoro spazia su diversi repos — una singola feature tocca l'API server, l'applicazione web (web app) e una libreria condivisa. In quale cartella `openspec/` risiede il piano?
- La tua squadra pianifica prima che il codice esista, o pianifica cose che non diventeranno mai codice in *questo* repo.
- I requisiti sono posseduti da un team e consumati da altri. La versione wiki viene modificata (drifts), e il tuo agente di coding non può leggerla comunque.

Uno **store** è la soluzione: un repo autonomo la cui unica funzione è la pianificazione. Ha la stessa struttura `openspec/` che conosci — specifiche e modifiche — più un piccolo file di identità. Lo registri sulla tua macchina una volta, per nome, e poi ogni comando standard di OpenSpec può funzionare al suo interno da qualsiasi punto.

## La forma

```
            team-plans  (uno store: pianificazione nel suo repo)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      what is true
                └── changes/    what is in motion
                      ▲
                      │ registered on each machine by name;
                      │ shared by pushing/cloning like any repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

Due regole mantengono questo semplice:

1. **Uno store è semplicemente un repo Git.** Tu lo committi, lo pushi, lo pulli e lo rivedi da solo. OpenSpec non clona, sincronizza o spinge nulla da solo.
2. **Dichiarazioni, non macchinari.** I repo possono *dichiarare* come sono correlati agli store (mostrato di seguito). Le dichiarazioni cambiano ciò che OpenSpec può dirti, mai dove agiscono i tuoi comandi.

## Cinque minuti per il tuo primo store

Due comandi ti portano da zero a una modifica funzionante e scoped allo store:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Next: esegui comandi OpenSpec normali contro questo store, ad esempio:
  openspec new change <change-id> --store team-plans
Condividi questo store committandolo e spingendolo come qualsiasi repo Git.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Next: openspec status --change add-login --store team-plans
```

Questo è l'intero modello. Da qui in poi il ciclo di vita è esattamente quello che conosci: `status`, `instructions`, `validate`, `archive` — con `--store team-plans` su ogni comando, e ogni suggerimento stampato ti indica la direzione da prendere. La rigaia `Using OpenSpec root:` ti dice sempre dove un comando sta agendo.

## Storia: un team, un repo di pianificazione

Un team mantiene le sue specifiche e le sue modifiche in `team-plans` invece di spargerle tra diversi repo di codice.

**Giorno uno (chiunque lo imposti):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Passare `--remote` registra l'URL di clonazione all'interno del file di identità dello store (`.openspec-store/store.yaml`), nel commit iniziale. Ogni futuro clone nasce sapendo da dove proviene, così i controlli di salute e i messaggi di errore possono stampare una correzione completa e copiabile per i compagni di squadra che non lo hanno ancora.

**Ogni membro del team (una volta per macchina):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

Da quel momento, tutti lavorano nello stesso repo di pianificazione tramite nome:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**Condividere il lavoro è Git, e lo fa apposta.** Una modifica che crei esiste solo nel tuo checkout fino a quando non la committi e la spingi — come per il codice. I piani ottengono branch, pull request e revisione gratuitamente, perché uno store è un repo ordinario.

**Connessione dei repo di codice del team.** Un repo di codice la cui pianificazione è completamente esternalizzata ha bisogno esattamente di una rigaia, in `openspec/config.yaml`:

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
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

Il puntatore è un fallback, mai una sovrascrittura: un esplicito `--store` vince sempre, e se il repo sviluppa vere e proprie cartelle di pianificazione, queste vincono (con un avviso per rimuovere il puntatore obsoleto).

## Storia: requisiti che attraversano i confini dei team

Un team di piattaforma possiede i requisiti. I team di prodotto costruiscono su di essi, nei loro propri repo, con i propri design. Un riferimento descrive quella relazione senza spostare il lavoro di nessuno.

```
   platform-reqs (store)                 api-server (code repo)
   owned by the platform team            owned by a product team
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ reads    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (their own designs)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (their own work)       │
   │                          │          │          └──────────────────────────┘
   └──────────────────────────┘
```

**Il team di prodotto dichiara su cosa si basa** nel suo `openspec/config.yaml`:

```yaml
references:
  - platform-reqs
```

I riferimenti sono un contesto di sola lettura. Il repo mantiene la propria radice `openspec/`; il lavoro rimane lì. Cosa cambia: `openspec instructions` in quel repo include ora un indice delle specifiche dello store referenziato — ciascuna con un riassunto di una rigaia e il comando esatto per il recupero (`openspec show <spec-id> --type spec --store platform-reqs`). Un agente che lavora in `api-server` può trovare i requisiti di pagamento a monte, citarli e scrivere il proprio design a basso livello nella radice del repo — senza che nessuno debba copiare contesto intorno.

Un riferimento può portare la sua sorgente di clonazione, così i compagni di squadra che non hanno ancora lo store ricevono una correzione completa invece di un vicolo cieco:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Quando vuoi che il piano e il codice siano aperti insieme, crea un workset.** Questo è personale ed esplicito: ogni persona sceglie le cartelle con cui lavora effettivamente sulla propria macchina. Nulla di quei percorsi di checkout locali viene committato nel repo di pianificazione condiviso.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Due domande che puoi sempre fare

**"Il mio setup è sano?"** — `openspec doctor` controlla la radice corrente e i suoi store referenziati, in sola lettura, con una correzione copiabile per ogni riscontro:

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Lo store referenziato 'design-system' non è registrato su questa macchina.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"Con cosa sto lavorando?"** — `openspec context` assembla l'insieme di lavoro dalle dichiarazioni OpenSpec: la radice e gli store che esso riferisce.

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

Entrambi supportano `--json` per gli agenti. `openspec context --code-workspace <path>` scrive inoltre un file di workspace di VS Code contenente l'intero insieme — è l'unica scrittura che questo comando esegue.

## Worksets: riaprire le cartelle su cui lavori insieme

A parte tutto quanto sopra: la maggior parte delle persone apre le stesse poche cartelle insieme ad ogni sessione — il repo di pianificazione più due o tre repo di codice. Un **workset** è una vista personale e nominata esattamente di ciò, riaperta con un singolo comando nel tuo strumento preferito.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       tutti e tre aperti nel tuo strumento
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (aperto in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` lancia quindi lo strumento salvato: gli editori (VS Code, Cursor) aprono una finestra con ogni membro e tornano. Il primo membro è il primario. Sovrascrivi lo strumento in qualsiasi momento con `--tool <id>`.

I Workset non sono uno stato condiviso deliberatamente. Vivono sulla tua macchina, non vengono mai committati e non fanno affermazioni sul lavoro — registrano solo ciò che ti piace avere aperto insieme. Rimuoverne uno non tocca le cartelle dei membri. I nuovi strumenti sono configurazione, non codice: qualsiasi cosa lanciata tramite un file di workspace o flag di allegato per cartella può essere aggiunta sotto la chiave `openers` nella configurazione globale (`openspec config edit`).

## Come i comandi decidono dove agire

Ogni comando normale risolve la sua radice nello stesso modo, nell'ordine seguente:

```
1. --store <id>          hai detto tu esplicitamente        → quello store
2. nearest openspec/     una vera radice di pianificazione qui   → questo repo
   (salendo dalla cwd)
3. store: pointer        config.yaml dichiara uno store  → quello store
4. nessuno dei precedenti    store registrati su questa     → errore con un
                         macchina?                        suggerimento di selezione
                         nessun store registrato?         → la directory corrente
                                                          (comportamento classico)
```

La rigaia `Using OpenSpec root:` (e il blocco `root` nell'output `--json`) ti dice in quale caso ti trovi.

## Limitazioni note

- **Forma beta.** Tutto su questa pagina può cambiare tra le release — nomi, flag, formati di file, chiavi JSON.
- **Un checkout per ID dello store per macchina.** Registrare un secondo checkout sotto lo stesso ID fallisce con un suggerimento di eseguire prima `store unregister`.
- **Nessun sync, mai — per progettazione.** OpenSpec non clona, non pulla e non spinge. Un checkout obsoleto mostra specifiche obsolete fino a quando *tu* non fai il pull; i riferimenti sono indicizzati in tempo reale da ciò che è sul disco.
- **Alcuni comandi rimangono come sono.** `view`, `templates`, `schemas`, e le forme nominali deprecate (`openspec change show`, ...) agiscono solo sulla directory corrente — nessun `--store`.
- **Lo stato per macchina è specifico di quella macchina.** Il registro degli store e i workset sono impostazioni locali. Nulla del layout della tua macchina viene mai committato nella pianificazione condivisa.
- **Due stili di lancio per i workset.** Uno strumento che non può essere lanciato con un file di workspace o flag di allegato per cartella non può essere aggiunto come opener.
- **JSON dell'agente ha una divisione nota del casing** (le chiavi della famiglia store sono `snake_case`, la famiglia di flusso di lavoro è `camelCase`). Documentato nel [contratto agente](../agent-contract.md); l'unificazione è posticipata a una release versionata.

## Dove risiedono le cose cose

| Cosa | Dove | Condiviso? |
|---|---|---|
| La pianificazione di uno store | `<store>/openspec/` (specs, changes) | Sì — committalo e spingilo |
| L'identità di uno store | `<store>/.openspec-store/store.yaml` | Sì — committato con lo store |
| Il registro degli store | `<data dir>/openspec/stores/registry.yaml` | No — solo su questa macchina |
| Worksets | `<data dir>/openspec/worksets/` | No — solo su questa macchina |

`<data dir>` è `~/.local/share/openspec` su macOS e Linux (o `$XDG_DATA_HOME/openspec` quando impostato) e `%LOCALAPPDATA%\openspec` su Windows.
## Riferimento

Flag esatti e forme JSON per ogni comando di questa pagina:
[CLI reference](../cli.md) (Stores, Doctor, Working context, Personal worksets) e il [contratto agente](../agent-contract.md).