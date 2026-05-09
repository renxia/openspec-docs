# Concetti

Questa guida spiega le idee fondamentali dietro OpenSpec e come si integrano tra loro. Per l'utilizzo pratico, consulta [Guida introduttiva](getting-started.md) e [Flussi di lavoro](workflows.md).

## Filosofia

OpenSpec è costruito attorno a quattro principi:

```
fluido non rigido         — nessuna fase di blocco, lavora su ciò che ha senso
iterativo non a cascata   — impara mentre costruisci, perfeziona man mano
semplice non complesso    — configurazione leggera, cerimonie minime
brownfield-first          — funziona con codebase esistenti, non solo da zero
```

### Perché Questi Principi Contano

**Fluido non rigido.** I sistemi di specifica tradizionali ti bloccano in fasi: prima pianifichi, poi implementi, poi hai finito. OpenSpec è più flessibile — puoi creare artefatti in qualsiasi ordine che abbia senso per il tuo lavoro.

**Iterativo non a cascata.** I requisiti cambiano. La comprensione si approfondisce. Ciò che sembrava un buon approccio all'inizio potrebbe non reggere dopo aver visto il codebase. OpenSpec accoglie questa realtà.

**Semplice non complesso.** Alcuni framework di specifica richiedono configurazioni estese, formati rigidi o processi pesanti. OpenSpec non ti intralcia. Inizializza in secondi, inizia subito a lavorare, personalizza solo se necessario.

**Brownfield-first.** La maggior parte del lavoro software non consiste nel costruire da zero — ma nel modificare sistemi esistenti. L'approccio basato su delta di OpenSpec rende facile specificare modifiche al comportamento esistente, non solo descrivere nuovi sistemi.

## Panoramica

OpenSpec organizza il tuo lavoro in due aree principali:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Fonte autorevole   │◄─────│  Modifiche proposte           │   │
│   │  Come funziona      │ unisci│  Ogni modifica = una cartella │   │
│   │  attualmente il     │      │  Contiene artefatti + delta   │   │
│   │  tuo sistema        │      │                               │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

Le **specifiche** sono la fonte autorevole — descrivono come si comporta attualmente il tuo sistema.

Le **modifiche** sono modifiche proposte — risiedono in cartelle separate finché non sei pronto a unirle.

Questa separazione è fondamentale. Puoi lavorare su più modifiche in parallelo senza conflitti. Puoi esaminare una modifica prima che influisca sulle specifiche principali. E quando archivi una modifica, i suoi delta vengono uniti in modo pulito alla fonte autorevole.

## Aree di Lavoro di Coordinamento

Il supporto per le aree di lavoro è in fase di sviluppo attivo e non è ancora pronto per l'uso. Non costruire automazioni esterne, integrazioni o flussi di lavoro di lunga durata basati sul comportamento delle aree di lavoro; i comandi, i file di stato e l'output JSON possono cambiare in qualsiasi momento.

I comandi seguenti forniscono il primo flusso di configurazione per la pianificazione tra repository o cartelle collegate.

I progetti OpenSpec locali al repository sono la scelta predefinita corretta quando un singolo repository possiede il flusso di pianificazione, implementazione e archivio. Alcuni lavori si estendono su più repository o cartelle. Per questo caso, un'area di lavoro di coordinamento OpenSpec è la sede di pianificazione duratura.

Il modello mentale dell'area di lavoro è:

```text
workspace = dove risiedono le modifiche cross-repo correlate
link      = un nome stabile per un repository o una cartella su cui l'area di lavoro può pianificare
change    = una funzionalità, correzione, progetto o altro pezzo di lavoro pianificato
```

Un'area di lavoro ha una struttura diversa da un progetto locale al repository:

```text
workspace-folder/
├── changes/                       # Pianificazione a livello di area di lavoro
└── .openspec-workspace/
    ├── workspace.yaml             # Identità condivisa dell'area di lavoro e nomi dei link
    └── local.yaml                 # Percorsi locali di questa macchina
```

Lo stato locale al repository di OpenSpec mantiene la struttura esistente:

```text
repo-root/
└── openspec/
    ├── specs/
    └── changes/
```

Questa distinzione è importante. La cartella dell'area di lavoro è una superficie di coordinamento per la pianificazione tra repository o cartelle collegate. La directory `openspec/` di ogni repository rimane la sede per le specifiche di proprietà del repository, le modifiche locali al repository e la pianificazione dell'implementazione. Gli utenti non devono eseguire `openspec init` locale al repository all'interno di una cartella dell'area di lavoro.

I nomi di link stabili sono il modo in cui la pianificazione dell'area di lavoro fa riferimento a repository e cartelle. Lo stato condiviso dell'area di lavoro conserva nomi come `api`, `web` o `checkout`; ogni macchina mappa questi nomi ai propri percorsi locali in `.openspec-workspace/local.yaml`.

```yaml
# .openspec-workspace/workspace.yaml
version: 1
name: platform
links:
  api: {}
  web: {}
```

```yaml
# .openspec-workspace/local.yaml
version: 1
paths:
  api: /repos/api
  web: /repos/web
```

Le aree di lavoro create da OpenSpec escludono `.openspec-workspace/local.yaml` dallo stato di collaborazione portatile per impostazione predefinita. `.openspec-workspace/workspace.yaml` rimane portatile perché memorizza il nome dell'area di lavoro e i nomi dei link stabili, non i percorsi di checkout assoluti di un singolo utente.

I percorsi collegati possono essere repository completi, cartelle all'interno di un grande monorepo o altre cartelle esistenti. Non è necessario che abbiano lo stato `openspec/` locale al repository prima di poter partecipare alla pianificazione dell'area di lavoro. I flussi di lavoro successivi di implementazione, verifica o archivio potrebbero richiedere una maggiore preparazione del repository, ma la visibilità della pianificazione inizia con il link.

```text
multi-repo:
  api      -> /repos/api
  web      -> /repos/web

large monorepo:
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

Le aree di lavoro gestite risiedono nella directory dati standard di OpenSpec:

```text
getGlobalDataDir()/workspaces
```

Ciò significa `$XDG_DATA_HOME/openspec/workspaces` quando `XDG_DATA_HOME` è impostato, `~/.local/share/openspec/workspaces` come fallback su stile Unix e `%LOCALAPPDATA%\openspec\workspaces` come fallback nativo su Windows. Le shell native di Windows, PowerShell e WSL2 mantengono ciascuna le stringhe di percorso per il runtime che esegue OpenSpec. Questa base non traduce tra `D:\repo`, `/mnt/d/repo` e i percorsi UNC WSL.

OpenSpec mantiene anche un registro locale della macchina in:

```text
getGlobalDataDir()/workspaces/registry.yaml
```

Il registro mappa i nomi delle aree di lavoro alle posizioni delle aree di lavoro, in modo che i comandi globali successivi possano elencare o selezionare aree di lavoro note da qualsiasi punto. È solo un indice. Ogni cartella dell'area di lavoro rimane autorevole per il proprio `.openspec-workspace/workspace.yaml` e `.openspec-workspace/local.yaml`, quindi i record del registro obsoleti possono essere segnalati e riparati senza ridefinire l'area di lavoro stessa.

La visibilità dell'area di lavoro non è un impegno alla modifica. Configura un'area di lavoro quando OpenSpec deve sapere quali repository o cartelle sono rilevanti; crea una modifica successivamente quando sei pronto a pianificare una funzionalità, correzione, progetto o altro pezzo di lavoro.

Comandi utili:

```bash
# Configurazione guidata
openspec workspace setup

# Configurazione adatta all'automazione
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex

# Visualizza le aree di lavoro note dal registro locale
openspec workspace list
openspec workspace ls

# Aggiungi o ripara i link per l'area di lavoro selezionata
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Controlla cosa può risolvere questa macchina
openspec workspace doctor
openspec workspace doctor --workspace platform

# Apri l'insieme di lavoro collegato
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor
```

`workspace setup` crea sempre l'area di lavoro nella posizione standard delle aree di lavoro, la registra nel registro locale, mostra la posizione dell'area di lavoro e richiede almeno un repository o una cartella collegati. La configurazione interattiva chiede un opener preferito. La configurazione non interattiva ne memorizza uno solo quando viene fornito `--opener codex`, `--opener claude`, `--opener github-copilot` o `--opener editor`.

OpenSpec mantiene anche i file di apertura dell'area di lavoro radice: un blocco di guida gestito da OpenSpec in `AGENTS.md`, un file `<workspace-name>.code-workspace` locale alla macchina per le aperture di VS Code e GitHub Copilot-in-VS-Code, e una voce di ignor specifica per quel file `.code-workspace` mantenuto. I file `*.code-workspace` creati dall'utente rimangono tracciabili perché la regola di ignor si rivolge solo al file mantenuto.

L'area di lavoro VS Code mantenuta include la radice di coordinamento come `.` più i repository o le cartelle collegati validi come radici aggiuntive. VS Code visualizza queste voci come un'area di lavoro multi-radice.

`workspace open` apre l'insieme di lavoro collegato con l'opener preferito memorizzato, a meno che non venga passato `--agent <tool>` o `--editor` per quella singola sessione. Passare entrambe le sostituzioni dell'opener è un errore. L'apertura dell'area di lavoro radice rende i repository e le cartelle collegati visibili per l'esplorazione e la pianificazione; l'implementazione inizia dopo che l'utente chiede esplicitamente un lavoro di implementazione.

`workspace link` e `workspace relink` registrano solo cartelle esistenti; non creano, copiano, spostano, inizializzano o modificano il repository o la cartella collegati. Dopo un collegamento o un ricollegamento riusciti, OpenSpec aggiorna la guida gestita, il file dell'area di lavoro VS Code e la regola di ignor.

I comandi delle aree di lavoro che necessitano di un'area di lavoro possono essere eseguiti da qualsiasi punto con `--workspace <name>`. Se li esegui all'interno di una cartella o sottodirectory dell'area di lavoro, OpenSpec utilizza l'area di lavoro corrente. Se sono disponibili diverse aree di lavoro note e non passi `--workspace <name>`, i comandi interattivi mostrano un selettore; `--json` e `--no-interactive` falliscono con un errore di stato strutturato invece di richiedere un input.

I comandi diretti delle aree di lavoro supportano l'output JSON per gli script. Le risposte JSON mantengono i dati principali negli oggetti `workspace`, `workspaces` o `link` e riportano avvisi o errori negli array `status`. Gli oggetti sani usano `status: []`.

## Specifiche

Le specifiche descrivono il comportamento del tuo sistema usando requisiti e scenari strutturati.

### Struttura

```
openspec/specs/
├── auth/
│   └── spec.md           # Comportamento dell'autenticazione
├── payments/
│   └── spec.md           # Elaborazione dei pagamenti
├── notifications/
│   └── spec.md           # Sistema di notifiche
└── ui/
    └── spec.md           # Comportamento e temi dell'interfaccia utente
```

Organizza le specifiche per dominio — raggruppamenti logici che hanno senso per il tuo sistema. Pattern comuni:

- **Per area funzionale**: `auth/`, `payments/`, `search/`
- **Per componente**: `api/`, `frontend/`, `workers/`
- **Per contesto delimitato**: `ordering/`, `fulfillment/`, `inventory/`

### Formato della Specifica

Una specifica contiene requisiti, e ogni requisito ha scenari:

```markdown
# Specifica di Autenticazione
```

## Scopo
Autenticazione e gestione delle sessioni per l'applicazione.

## Requisiti

### Requisito: Autenticazione Utente
Il sistema DEVE emettere un token JWT dopo un login riuscito.

#### Scenario: Credenziali valide
- DATO un utente con credenziali valide
- QUANDO l'utente invia il modulo di login
- ALLORA viene restituito un token JWT
- E l'utente viene reindirizzato alla dashboard

#### Scenario: Credenziali non valide
- DATE credenziali non valide
- QUANDO l'utente invia il modulo di login
- ALLORA viene visualizzato un messaggio di errore
- E non viene emesso alcun token

### Requisito: Scadenza della Sessione
Il sistema DEVE far scadere le sessioni dopo 30 minuti di inattività.

#### Scenario: Timeout di inattività
- DATA una sessione autenticata
- QUANDO trascorrono 30 minuti senza attività
- ALLORA la sessione viene invalidata
- E l'utente deve autenticarsi nuovamente
```

**Elementi chiave:**

| Elemento | Scopo |
|----------|-------|
| `## Purpose` | Descrizione di alto livello del dominio di questa specifica |
| `### Requirement:` | Un comportamento specifico che il sistema deve avere |
| `#### Scenario:` | Un esempio concreto del requisito in azione |
| SHALL/MUST/SHOULD | Parole chiave RFC 2119 che indicano la forza del requisito |

### Perché Strutturare le Specifiche in Questo Modo

**I requisiti sono il "cosa"** — indicano cosa dovrebbe fare il sistema senza specificarne l'implementazione.

**Gli scenari sono il "quando"** — forniscono esempi concreti che possono essere verificati. Buoni scenari:
- Sono testabili (si potrebbe scrivere un test automatizzato per essi)
- Coprono sia il percorso principale che i casi limite
- Usano il formato Dato/Quando/Allora o un formato strutturato simile

**Le parole chiave RFC 2119** (SHALL, MUST, SHOULD, MAY) comunicano l'intento:
- **MUST/SHALL** — requisito assoluto
- **SHOULD** — raccomandato, ma esistono eccezioni
- **MAY** — opzionale

### Cosa È (e Cosa Non È) una Specifica

Una specifica è un **contratto di comportamento**, non un piano di implementazione.

Contenuto di una buona specifica:
- Comportamento osservabile su cui si affidano gli utenti o i sistemi a valle
- Input, output e condizioni di errore
- Vincoli esterni (sicurezza, privacy, affidabilità, compatibilità)
- Scenari che possono essere testati o validati esplicitamente

Cosa evitare nelle specifiche:
- Nomi interni di classi/funzioni
- Scelte di librerie o framework
- Dettagli di implementazione passo-passo
- Piani di esecuzione dettagliati (questi appartengono a `design.md` o `tasks.md`)

Test rapido:
- Se l'implementazione può cambiare senza modificare il comportamento visibile dall'esterno, probabilmente non appartiene alla specifica.

### Mantenerlo Leggero: Rigorosità Progressiva

OpenSpec mira a evitare la burocrazia. Usa il livello più leggero che rende comunque la modifica verificabile.

**Spec leggera (predefinita):**
- Requisiti brevi incentrati sul comportamento
- Ambito chiaro e obiettivi non inclusi
- Alcuni controlli di accettazione concreti

**Spec completa (per rischi più elevati):**
- Modifiche tra team o repository
- Modifiche a API/contratti, migrazioni, preoccupazioni sulla sicurezza/privacy
- Modifiche in cui l'ambiguità è probabile che causi costose rielaborazioni

La maggior parte delle modifiche dovrebbe rimanere in modalità leggera.

### Collaborazione Uomo + Agente

In molti team, gli umani esplorano e gli agenti redigono gli artefatti. Il ciclo previsto è:

1. L'umano fornisce intento, contesto e vincoli.
2. L'agente li converte in requisiti e scenari incentrati sul comportamento.
3. L'agente mantiene i dettagli di implementazione in `design.md` e `tasks.md`, non in `spec.md`.
4. La validazione conferma la struttura e la chiarezza prima dell'implementazione.

Questo mantiene le specifiche leggibili per gli umani e coerenti per gli agenti.

## Modifiche

Una modifica è una proposta di modifica al tuo sistema, confezionata come una cartella contenente tutto il necessario per comprenderla e implementarla.

### Struttura della Modifica

```
openspec/changes/add-dark-mode/
├── proposal.md           # Perché e cosa
├── design.md             # Come (approccio tecnico)
├── tasks.md              # Checklist di implementazione
├── .openspec.yaml        # Metadati della modifica (opzionale)
└── specs/                # Specifiche delta
    └── ui/
        └── spec.md       # Cosa cambia in ui/spec.md
```

Ogni modifica è autocontenuta. Contiene:
- **Artefatti** — documenti che catturano intento, progettazione e attività
- **Specifiche delta** — specifiche per ciò che viene aggiunto, modificato o rimosso
- **Metadati** — configurazione opzionale per questa modifica specifica

### Perché le Modifiche sono Cartelle

Confezionare una modifica come cartella presenta diversi vantaggi:

1. **Tutto insieme.** Proposta, progettazione, attività e specifiche vivono in un unico posto. Non c'è bisogno di cercare in posizioni diverse.

2. **Lavoro parallelo.** Più modifiche possono esistere simultaneamente senza conflitti. Lavora su `add-dark-mode` mentre `fix-auth-bug` è anch'esso in corso.

3. **Cronologia pulita.** Quando archiviate, le modifiche si spostano in `changes/archive/` con il loro contesto completo preservato. Puoi ripercorrere e capire non solo cosa è cambiato, ma perché.

4. **Facile revisione.** Una cartella di modifica è facile da revisionare — aprila, leggi la proposta, controlla la progettazione, vedi le modifiche alle specifiche.

## Artefatti

Gli artefatti sono i documenti all'interno di una modifica che guidano il lavoro.

### Il Flusso degli Artefatti

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   perché          cosa          come          passaggi
 + ambito        cambia       approccio      da compiere
```

Gli artefatti si costruiscono l'uno sull'altro. Ogni artefatto fornisce contesto per il successivo.

### Tipi di Artefatti

#### Proposta (`proposal.md`)

La proposta cattura **intento**, **ambito** e **approccio** ad alto livello.

```markdown
# Proposta: Aggiungere la Modalità Scura

## Intento
Gli utenti hanno richiesto un'opzione per la modalità scura per ridurre l'affaticamento degli occhi
durante l'uso notturno e per adattarsi alle preferenze di sistema.

## Ambito
In ambito:
- Interruttore del tema nelle impostazioni
- Rilevamento delle preferenze di sistema
- Persistenza della preferenza in localStorage

Fuori ambito:
- Temi di colore personalizzati (lavoro futuro)
- Sovrascritture del tema per pagina

## Approccio
Utilizzare le proprietà CSS personalizzate per il theming con un contesto React
per la gestione dello stato. Rilevare la preferenza di sistema al primo caricamento,
consentire la sovrascrittura manuale.
```

**Quando aggiornare la proposta:**
- L'ambito cambia (si restringe o si espande)
- L'intento si chiarisce (migliore comprensione del problema)
- L'approccio cambia fondamentalmente

#### Specifiche (specifiche delta in `specs/`)

Le specifiche delta descrivono **cosa sta cambiando** rispetto alle specifiche attuali. Vedi [Specifiche Delta](#specifiche-delta) sotto.

#### Progettazione (`design.md`)

La progettazione cattura l'**approccio tecnico** e le **decisioni architetturali**.

````markdown
# Progettazione: Aggiungere la Modalità Scura

## Approccio Tecnico
Lo stato del tema gestito tramite React Context per evitare il prop drilling.
Le proprietà CSS personalizzate consentono lo switching a runtime senza il toggle delle classi.

## Decisioni Architetturali

### Decisione: Contesto vs Redux
Utilizzare React Context per lo stato del tema perché:
- Stato binario semplice (chiaro/scuro)
- Nessuna transizione di stato complessa
- Evita di aggiungere la dipendenza da Redux

### Decisione: Proprietà CSS Personalizzate
Utilizzare variabili CSS invece di CSS-in-JS perché:
- Funziona con il foglio di stile esistente
- Nessun overhead a runtime
- Soluzione nativa del browser

## Flusso dei Dati
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## Modifiche ai File
- `src/contexts/ThemeContext.tsx` (nuovo)
- `src/components/ThemeToggle.tsx` (nuovo)
- `src/styles/globals.css` (modificato)
````

**Quando aggiornare la progettazione:**
- L'implementazione rivela che l'approccio non funzionerà
- Viene scoperta una soluzione migliore
- Le dipendenze o i vincoli cambiano

#### Attività (`tasks.md`)

Le attività sono la **checklist di implementazione** — passaggi concreti con caselle di controllo.

```markdown
# Attività

## 1. Infrastruttura del Tema
- [ ] 1.1 Creare ThemeContext con stato chiaro/scuro
- [ ] 1.2 Aggiungere proprietà CSS personalizzate per i colori
- [ ] 1.3 Implementare la persistenza in localStorage
- [ ] 1.4 Aggiungere il rilevamento delle preferenze di sistema

## 2. Componenti UI
- [ ] 2.1 Creare il componente ThemeToggle
- [ ] 2.2 Aggiungere l'interruttore alla pagina delle impostazioni
- [ ] 2.3 Aggiornare l'Header per includere un interruttore rapido

## 3. Stile
- [ ] 3.1 Definire la tavolozza dei colori per il tema scuro
- [ ] 3.2 Aggiornare i componenti per utilizzare le variabili CSS
- [ ] 3.3 Testare i rapporti di contrasto per l'accessibilità
```

**Best practice per le attività:**
- Raggruppa le attività correlate sotto intestazioni
- Usa una numerazione gerarchica (1.1, 1.2, ecc.)
- Mantieni le attività sufficientemente piccole per essere completate in una sessione
- Spunta le attività man mano che le completi

## Specifiche Delta

Le specifiche delta sono il concetto chiave che fa funzionare OpenSpec per lo sviluppo brownfield. Descrivono **cosa sta cambiando** invece di riaffermare l'intera specifica.

### Il Formato

```markdown
# Delta per Auth

## Requisiti AGGIUNTI

### Requisito: Autenticazione a Due Fattori
Il sistema DEVE supportare l'autenticazione a due fattori basata su TOTP.

#### Scenario: Registrazione 2FA
- DATO un utente senza 2FA abilitato
- QUANDO l'utente abilita 2FA nelle impostazioni
- ALLORA viene visualizzato un codice QR per la configurazione dell'app di autenticazione
- E l'utente deve verificare con un codice prima dell'attivazione

#### Scenario: Login 2FA
- DATO un utente con 2FA abilitato
- QUANDO l'utente invia credenziali valide
- ALLORA viene presentata una richiesta OTP
- E il login si completa solo dopo un OTP valido

## Requisiti MODIFICATI

### Requisito: Scadenza della Sessione
Il sistema DEVE far scadere le sessioni dopo 15 minuti di inattività.
(Precedentemente: 30 minuti)

#### Scenario: Timeout di inattività
- DATA una sessione autenticata
- QUANDO passano 15 minuti senza attività
- ALLORA la sessione viene invalidata

## Requisiti RIMOSSI

### Requisito: Ricordami
(Deprecato a favore di 2FA. Gli utenti dovrebbero ri-autenticarsi ad ogni sessione.)
```

### Sezioni Delta

| Sezione | Significato | Cosa Succede all'Archiviazione |
|---------|-------------|--------------------------------|
| `## Requisiti AGGIUNTI` | Nuovo comportamento | Aggiunto alla specifica principale |
| `## Requisiti MODIFICATI` | Comportamento cambiato | Sostituisce il requisito esistente |
| `## Requisiti RIMOSSI` | Comportamento deprecato | Eliminato dalla specifica principale |

### Perché Delta Invece di Specifiche Complete

**Chiarezza.** Un delta mostra esattamente cosa sta cambiando. Leggendo una specifica completa, dovresti confrontarla mentalmente con la versione corrente.

**Evitare conflitti.** Due modifiche possono toccare lo stesso file di specifica senza confliggere, purché modifichino requisiti diversi.

**Efficienza della revisione.** I revisori vedono la modifica, non il contesto invariato. Concentrati su ciò che conta.

**Adattamento al brownfield.** La maggior parte del lavoro modifica il comportamento esistente. Le modifiche delta rendono le modifiche di primo piano, non un ripensamento.

## Schemi

Gli schemi definiscono i tipi di artefatti e le loro dipendenze per un flusso di lavoro.

### Come Funzionano gli Schemi

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Nessuna dipendenza, può essere creato per primo

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Necessita della proposta prima della creazione

  - id: design
    generates: design.md
    requires: [proposal]      # Può essere creato in parallelo con le specifiche

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Necessita sia delle specifiche che del design
```

**Gli artefatti formano un grafo delle dipendenze:**

```
                    proposal
                   (nodo radice)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (richiede:                  (richiede:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (richiede:
                specs, design)
```

**Le dipendenze sono abilitatori, non porte.** Mostrano cosa è possibile creare, non cosa si deve creare successivamente. Puoi saltare il design se non ti serve. Puoi creare le specifiche prima o dopo il design — entrambi dipendono solo dalla proposta.

### Schemi Integrati

**spec-driven** (predefinito)

Il flusso di lavoro standard per lo sviluppo guidato dalle specifiche:

```
proposal → specs → design → tasks → implement
```

Ideale per: La maggior parte del lavoro sulle funzionalità dove si vuole concordare sulle specifiche prima dell'implementazione.

### Schemi Personalizzati

Crea schemi personalizzati per il flusso di lavoro del tuo team:

```bash
# Crea da zero
openspec schema init research-first

# Oppure biforca uno esistente
openspec schema fork spec-driven research-first
```

**Esempio di schema personalizzato:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Prima la ricerca

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposta basata sulla ricerca

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Salta specifiche/design, vai direttamente ai compiti
```

Vedi [Personalizzazione](customization.md) per i dettagli completi sulla creazione e l'uso di schemi personalizzati.

## Archivio

L'archiviazione completa una modifica unendo le sue specifiche delta nelle specifiche principali e preservando la modifica per la storia.

### Cosa Succede Quando Archivi

```
Prima dell'archiviazione:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ unione
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Dopo l'archiviazione:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Ora include i requisiti per il 2FA
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Preservato per la storia
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Il Processo di Archiviazione

1.  **Unisci le delta.** Ogni sezione della specifica delta (AGGIUNTO/MODIFICATO/RIMOSSO) viene applicata alla specifica principale corrispondente.

2.  **Sposta nell'archivio.** La cartella della modifica viene spostata in `changes/archive/` con un prefisso di data per l'ordinamento cronologico.

3.  **Preserva il contesto.** Tutti gli artefatti rimangono intatti nell'archivio. Puoi sempre consultare il passato per capire perché è stata apportata una modifica.

### Perché l'Archiviazione è Importante

**Stato pulito.** Le modifiche attive (`changes/`) mostrano solo il lavoro in corso. Il lavoro completato viene spostato fuori dalla vista.

**Traccia di revisione.** L'archivio preserva il contesto completo di ogni modifica — non solo cosa è cambiato, ma la proposta che spiega perché, il design che spiega come e i compiti che mostrano il lavoro svolto.

**Evoluzione delle specifiche.** Le specifiche crescono organicamente man mano che le modifiche vengono archiviate. Ogni archivio unisce le sue delta, costruendo nel tempo una specifica completa.

## Come Tutto si Insieme

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FLUSSO OPENSPEC                                 │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. AVVIA      │  /opsx:propose (core) o /opsx:new (espanso)            │
│   │     MODIFICA   │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREA       │  /opsx:ff o /opsx:continue (flusso di lavoro espanso)  │
│   │     ARTEFATTI  │  Crea proposta → specifiche → design → compiti          │
│   │                │  (basato sulle dipendenze dello schema)                 │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENTA │  /opsx:apply                                            │
│   │     COMPITI    │  Lavora sui compiti, segnandoli come completati         │
│   │                │◄──── Aggiorna gli artefatti man mano che impari         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFICA   │  /opsx:verify (opzionale)                               │
│   │     LAVORO     │  Controlla che l'implementazione corrisponda alle specifiche │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVIA   │────►│  Le specifiche delta vengono unite nelle specifiche principali │    │
│   │     MODIFICA   │     │  La cartella della modifica viene spostata nell'archivio/ │    │
│   └────────────────┘     │  Le specifiche sono ora la fonte di verità aggiornata │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Il ciclo virtuoso:**

1.  Le specifiche descrivono il comportamento attuale
2.  Le modifiche propongono modifiche (come delta)
3.  L'implementazione rende reali le modifiche
4.  L'archivio unisce le delta nelle specifiche
5.  Le specifiche ora descrivono il nuovo comportamento
6.  La prossima modifica si basa sulle specifiche aggiornate

## Glossario

| Termine | Definizione |
|---------|-------------|
| **Artefatto** | Un documento all'interno di una modifica (proposta, design, compiti o specifiche delta) |
| **Archivio** | Il processo di completamento di una modifica e unione delle sue delta nelle specifiche principali |
| **Modifica** | Una modifica proposta al sistema, confezionata come una cartella con artefatti |
| **Specifica delta** | Una specifica che descrive le modifiche (AGGIUNTO/MODIFICATO/RIMOSSO) rispetto alle specifiche attuali |
| **Dominio** | Un raggruppamento logico per le specifiche (es. `auth/`, `payments/`) |
| **Requisito** | Uno specifico comportamento che il sistema deve avere |
| **Scenario** | Un esempio concreto di un requisito, tipicamente nel formato Dato/Quando/Allora |
| **Schema** | Una definizione dei tipi di artefatti e delle loro dipendenze |
| **Specifica** | Una descrizione del comportamento del sistema, contenente requisiti e scenari |
| **Fonte di verità** | La directory `openspec/specs/`, contenente il comportamento attuale concordato |

## Prossimi Passi

- [Introduzione](getting-started.md) - Primi passi pratici
- [Flussi di lavoro](workflows.md) - Modelli comuni e quando usarli
- [Comandi](commands.md) - Riferimento completo ai comandi
- [Personalizzazione](customization.md) - Crea schemi personalizzati e configura il tuo progetto