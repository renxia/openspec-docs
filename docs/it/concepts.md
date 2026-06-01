# Concetti

Questa guida spiega le idee fondamentali dietro OpenSpec e come si integrano tra loro. Per l'utilizzo pratico, consulta [Iniziare](getting-started.md) e [Flussi di lavoro](workflows.md).

## Filosofia

OpenSpec si basa su quattro principi:

```
fluido non rigido          — nessuna fase obbligatoria, lavora su ciò che ha senso
iterativo non a cascata    — impara mentre costruisci, perfeziona man mano
semplice non complesso     — configurazione leggera, cerimoniale minimo
brownfield-first           — funziona con codebase esistenti, non solo da zero
```

### Perché Questi Principi Sono Importanti

**Fluido non rigido.** I sistemi di specifica tradizionali ti bloccano in fasi rigide: prima pianifichi, poi implementi, poi hai finito. OpenSpec è più flessibile — puoi creare artefatti in qualsiasi ordine che abbia senso per il tuo lavoro.

**Iterativo non a cascata.** I requisiti cambiano. La comprensione si approfondisce. Ciò che sembrava un buon approccio all'inizio potrebbe non reggere dopo aver esaminato il codebase. OpenSpec abbraccia questa realtà.

**Semplice non complesso.** Alcuni framework di specifica richiedono una configurazione estesa, formati rigidi o processi pesanti. OpenSpec non ti intralcia. Inizializza in secondi, inizia subito a lavorare, personalizza solo se necessario.

**Brownfield-first.** La maggior parte del lavoro software non consiste nel costruire da zero — ma nel modificare sistemi esistenti. L'approccio basato su delta di OpenSpec rende facile specificare modifiche al comportamento esistente, non solo descrivere nuovi sistemi.

## Panoramica Generale

OpenSpec organizza il tuo lavoro in due aree principali:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Fonte di verità    │◄─────│  Modifiche proposte           │   │
│   │  Come funziona      │merge │  Ogni modifica = una cartella │   │
│   │  attualmente il     │      │  Contiene artefatti + delta   │   │
│   │  tuo sistema        │      │                               │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

Le **specifiche** sono la fonte di verità — descrivono come si comporta attualmente il tuo sistema.

Le **modifiche** sono modifiche proposte — risiedono in cartelle separate finché non sei pronto a unirle.

Questa separazione è fondamentale. Puoi lavorare su più modifiche in parallelo senza conflitti. Puoi esaminare una modifica prima che influisca sulle specifiche principali. E quando archivi una modifica, i suoi delta vengono uniti in modo pulito alla fonte di verità.

## Spazi di Lavoro di Coordinamento

Il supporto per gli spazi di lavoro è in beta. Il modello di visualizzazione locale qui sotto è la direzione attuale, ma l'automazione esterna, le integrazioni e i flussi di lavoro di lunga durata dovrebbero ancora considerare il comportamento dei comandi, i file di stato e l'output JSON come in evoluzione.

I comandi qui sotto forniscono il primo flusso di configurazione per aprire viste locali su repository o cartelle collegate.

I progetti OpenSpec locali nel repository sono la scelta predefinita corretta quando un unico repository gestisce il flusso di pianificazione, implementazione e archivio. Alcuni lavori si estendono su più repository o cartelle. Per questo caso, uno spazio di lavoro di coordinamento OpenSpec è una vista locale della macchina che tiene insieme i percorsi collegati, lo stato dell'opener e la configurazione dell'agente.

Il modello mentale dello spazio di lavoro è:

```text
spazio di lavoro = vista locale privata su negozi di contesto, iniziative, repository e cartelle
negozio di contesto = contenitore di contesto condiviso durevole
iniziativa = contesto di coordinamento durevole all'interno di un negozio di contesto
collegamento = un nome stabile per un repository o una cartella che lo spazio di lavoro può risolvere localmente
modifica = un singolo pezzo di lavoro pianificato; l'implementazione appartiene al repository proprietario
```

Uno spazio di lavoro ha una forma diversa da un progetto locale del repository:

```text
getGlobalDataDir()/workspaces/<workspace-name>/
├── workspace.yaml                 # Record della vista locale privata
├── AGENTS.md                      # Guida runtime generata
└── <workspace-name>.code-workspace # File dello spazio di lavoro dell'editor generato
```

Lo stato locale di OpenSpec nel repository mantiene la forma esistente:

```text
repo-root/
└── openspec/
    ├── specs/
    └── changes/
```

Questa distinzione è importante. La cartella dello spazio di lavoro è una superficie di coordinamento locale per aprire e ispezionare repository o cartelle collegate. La directory `openspec/` di ogni repository rimane la sede per le specifiche di proprietà del repository, le modifiche locali e la pianificazione dell'implementazione. Gli utenti non hanno bisogno di eseguire `openspec init` locale al repository all'interno di una cartella dello spazio di lavoro.

I nomi di collegamento stabili sono il modo in cui uno spazio di lavoro fa riferimento a repository e cartelle. Il record privato dello spazio di lavoro mantiene nomi come `api`, `web` o `checkout` e li mappa ai percorsi locali di questo runtime.

```yaml
# workspace.yaml
version: 1
name: platform
context: null
links:
  api: /repos/api
  web: /repos/web
```

Quando uno spazio di lavoro apre un'iniziativa, `context` registra il binding del negozio di contesto selezionato e l'id dell'iniziativa. I negozi selezionati dal registro rimangono portatili per id; i negozi selezionati per percorso preservano intenzionalmente il percorso locale del runtime perché `workspace.yaml` è uno stato locale privato.

I percorsi collegati possono essere repository completi, cartelle all'interno di un grande monorepo o altre cartelle esistenti. Non hanno bisogno dello stato `openspec/` locale del repository prima di poter partecipare alla pianificazione dello spazio di lavoro. I flussi di lavoro successivi di implementazione, verifica o archivio potrebbero richiedere una maggiore prontezza del repository, ma la visibilità della pianificazione inizia con il collegamento.

```text
multi-repo:
  api      -> /repos/api
  web      -> /repos/web

large monorepo:
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

Gli spazi di lavoro gestiti risiedono sotto la directory dati standard di OpenSpec:

```text
getGlobalDataDir()/workspaces
```

Ciò significa `$XDG_DATA_HOME/openspec/workspaces` quando `XDG_DATA_HOME` è impostato, `~/.local/share/openspec/workspaces` sul fallback in stile Unix, e `%LOCALAPPDATA%\openspec\workspaces` sul fallback nativo di Windows. Le shell native di Windows, PowerShell e WSL2 mantengono ciascuna le stringhe di percorso per il runtime che esegue OpenSpec. Questa base non fa traduzioni tra `D:\repo`, `/mnt/d/repo` e i percorsi UNC di WSL.

OpenSpec può ancora leggere le radici degli spazi di lavoro beta più vecchie come input di compatibilità, ma gli spazi di lavoro gestiti ora usano il record radice `workspace.yaml` sopra indicato. La cartella dello spazio di lavoro rimane autorevole per la propria vista locale privata.

La visibilità dello spazio di lavoro non è un impegno alla modifica. Configura uno spazio di lavoro quando OpenSpec dovrebbe sapere quali repository o cartelle sono rilevanti; crea una modifica più tardi quando sei pronto per pianificare una funzionalità, una correzione, un progetto o un altro pezzo di lavoro.

Comandi utili:

```bash
# Guida interattiva all configurazione
openspec workspace setup

# Configurazione automatizzata
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli

# Vedi gli spazi di lavoro noti dal registro locale
openspec workspace list
openspec workspace ls

# Aggiungi o ripara i collegamenti per lo spazio di lavoro selezionato
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Verifica cosa questa macchina può risolvere
openspec workspace doctor
openspec workspace doctor --workspace platform

# Aggiorna la guida locale e le competenze dell'agente dello spazio di lavoro
openspec workspace update
openspec workspace update --workspace platform --tools codex,claude

# Apri il set di lavoro collegato
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor

# Apri un'iniziativa come vista locale dello spazio di lavoro
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative billing-launch --store-path /repos/platform-context
```

`workspace setup` crea sempre lo spazio di lavoro nella posizione standard, lo registra nel registro locale, mostra la posizione dello spazio di lavoro e richiede almeno un repository o una cartella collegati. La configurazione interattiva chiede un opener preferito e può installare competenze di OpenSpec per gli agenti selezionati. La configurazione non interattiva ne memorizza uno solo quando viene fornito `--opener codex-cli`, `--opener claude`, `--opener github-copilot` o `--opener editor`.

Le competenze dello spazio di lavoro vengono installate solo nella radice dello spazio di lavoro. Il profilo globale attivo seleziona quali competenze del flusso di lavoro vengono generate; `--tools` seleziona quali agenti le ricevono. La configurazione e l'aggiornamento dello spazio di lavoro non creano file di comando slash anche quando la consegna globale include comandi. Esegui `openspec workspace update` per aggiornare la guida locale dello spazio di lavoro e aggiungere, aggiornare o rimuovere directory di competenze locali gestite dello spazio di lavoro senza modificare repository o cartelle collegate.

OpenSpec mantiene anche i file aperti alla radice dello spazio di lavoro: un blocco di guida gestito da OpenSpec in `AGENTS.md` e un file `<workspace-name>.code-workspace` locale della macchina per le aperture di VS Code e GitHub Copilot-in-VS-Code. Uno spazio di lavoro gestito non è un repository, quindi OpenSpec non crea un `.gitignore` predefinito dello spazio di lavoro o una directory `changes/` predefinita a livello dello spazio di lavoro.

Lo spazio di lavoro VS Code mantenuto elenca prima i repository o le cartelle collegate valide, poi il contesto dell'iniziativa quando allegato, poi i file dello spazio di lavoro OpenSpec. VS Code visualizza quelle voci come uno spazio di lavoro multi-radice.

`workspace open` apre il set di lavoro collegato con l'opener preferito memorizzato a meno che non venga passato `--agent <tool>` o `--editor` per quella sessione. Passare entrambi gli override dell'opener è un errore. L'apertura alla radice dello spazio di lavoro rende visibili i repository e le cartelle collegate per l'esplorazione e il contesto; l'implementazione inizia dopo che l'utente ha esplicitamente chiesto un lavoro di implementazione.

`workspace link` e `workspace relink` registrano solo cartelle esistenti; non creano, copiano, spostano, inizializzano o modificano il repository o la cartella collegati. Dopo un collegamento o un ri-collegamento riuscito, OpenSpec aggiorna la guida gestita e il file dello spazio di lavoro VS Code.

I comandi dello spazio di lavoro che necessitano di uno spazio di lavoro possono essere eseguiti da qualsiasi posizione con `--workspace <name>`. Se li esegui all'interno di una cartella o sottodirectory dello spazio di lavoro, OpenSpec usa quello spazio di lavoro corrente. Se sono disponibili diversi spazi di lavoro noti e non passi `--workspace <name>`, i comandi umani mostrano un selettore; `--json` e `--no-interactive` falliscono con un errore di stato strutturato invece di richiedere un input.

I comandi diretti dello spazio di lavoro supportano l'output JSON per gli script. Le risposte JSON mantengono i dati primari negli oggetti `workspace`, `workspaces` o `link` e riportano avvertimenti o errori negli array `status`. Gli oggetti sani usano `status: []`.

## Specifiche

Le specifiche descrivono il comportamento del tuo sistema usando requisiti e scenari strutturati.

### Struttura

```
openspec/specs/
├── auth/
│   └── spec.md           # Comportamento di autenticazione
├── payments/
│   └── spec.md           # Elaborazione pagamenti
├── notifications/
│   └── spec.md           # Sistema di notifica
└── ui/
    └── spec.md           # Comportamento dell'interfaccia utente e temi
```

Organizza le specifiche per dominio — raggruppamenti logici che hanno senso per il tuo sistema. Modelli comuni:

- **Per area funzionale**: `auth/`, `payments/`, `search/`
- **Per componente**: `api/`, `frontend/`, `workers/`
- **Per contesto delimitato**: `ordering/`, `fulfillment`, `inventory/`

### Formato della Specifica

Una specifica contiene requisiti, e ogni requisito ha scenari:

```markdown
# Specifica di Autenticazione

## Scopo
Gestione dell'autenticazione e della sessione per l'applicazione.

## Requisiti

### Requisito: Autenticazione Utente
Il sistema DEVE emettere un token JWT al login riuscito.

#### Scenario: Credenziali valide
- DATO un utente con credenziali valide
- QUANDO l'utente invia il modulo di accesso
- ALLORA viene restituito un token JWT
- E l'utente viene reindirizzato alla dashboard

#### Scenario: Credenziali non valide
- DATE credenziali non valide
- QUANDO l'utente invia il modulo di accesso
- ALLORA viene visualizzato un messaggio di errore
- E non viene emesso alcun token

### Requisito: Scadenza della Sessione
Il sistema DEVE far scadere le sessioni dopo 30 minuti di inattività.

#### Scenario: Timeout di inattività
- DATA una sessione autenticata
- QUANDO passano 30 minuti senza attività
- ALLORA la sessione viene invalidata
- E l'utente deve autenticarsi nuovamente
```

**Elementi chiave:**

| Elemento | Scopo |
|---------|---------|
| `## Scopo` | Descrizione di alto livello del dominio di questa specifica |
| `### Requisito:` | Un comportamento specifico che il sistema deve avere |
| `#### Scenario:` | Un esempio concreto del requisito in azione |
| DEVE/DOVREBBE/POTREBBE | Parole chiave RFC 2119 che indicano la forza del requisito |

### Perché Strutturare le Specifiche in Questo Modo

**I requisiti sono il "cosa"** — affermano cosa dovrebbe fare il sistema senza specificare l'implementazione.

**Gli scenari sono il "quando"** — forniscono esempi concreti che possono essere verificati. Buoni scenari:
- Sono testabili (potresti scriverci un test automatizzato)
- Coprono sia il percorso felice che i casi limite
- Usano Dato/Quando/Allora o un formato strutturato simile

**Parole chiave RFC 2119** (DEVE, DOVREBBE, POTREBBE) comunicano l'intento:
- **DEVE** — requisito assoluto
- **DOVREBBE** — raccomandato, ma esistono eccezioni
- **POTREBBE** — opzionale

### Cosa È (e Non È) una Specifica

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
- Piani di esecuzione dettagliati (quelli appartengono a `design.md` o `tasks.md`)

Test rapido:
- Se l'implementazione può cambiare senza modificare il comportamento visibile dall'esterno, probabilmente non appartiene alla specifica.

### Mantienilo Leggero: Rigorosità Progressiva

OpenSpec mira a evitare la burocrazia. Usa il livello più leggero che rende comunque la modificaverificabile.

**Specifiche Lite (predefinito):**
- Requisiti brevi incentrati sul comportamento
- Ambito chiaro e obiettivi non perseguiti
- Alcuni controlli di accettazione concreti

**Specifiche Complete (per rischi più elevati):**
- Modifiche tra team o repository
- Modifiche a API/contratti, migrazioni, preoccupazioni sulla sicurezza/privacy
- Modifiche in cui l'ambiguità potrebbe causare costose rielaborazioni

La maggior parte delle modifiche dovrebbe rimanere in modalità Lite.

### Collaborazione Umano + Agente

In molti team, gli umani esplorano e gli agenti redigono gli artefatti. Il ciclo previsto è:

1. L'umano fornisce intento, contesto e vincoli.
2. L'agente li converte in requisiti e scenari incentrati sul comportamento.
3. L'agente mantiene i dettagli di implementazione in `design.md` e `tasks.md`, non in `spec.md`.
4. La validazione conferma struttura e chiarezza prima dell'implementazione.

Questo mantiene le specifiche leggibili per gli umani e coerenti per gli agenti.

## Modifiche

Una modifica è una modifica proposta al tuo sistema, organizzata come una cartella contenente tutto ciò che è necessario per comprenderla e implementarla.

### Struttura della Modifica

```
openspec/changes/add-dark-mode/
├── proposal.md           # Perché e cosa
├── design.md             # Come (approccio tecnico)
├── tasks.md              # Elenco di implementazione
├── .openspec.yaml        # Metadati della modifica (opzionale)
└── specs/                # Specifiche delta
    └── ui/
        └── spec.md       # Cosa cambia in ui/spec.md
```

Ogni modifica è autocontenuta. Contiene:
- **Artifacts** — documenti che catturano intento, progettazione e attività
- **Delta specs** — specifiche per ciò che viene aggiunto, modificato o rimosso
- **Metadati** — configurazione opzionale per questa specifica modifica

### Perché le Modifiche sono Cartelle

Organizzare una modifica come cartella presenta diversi vantaggi:

1. **Tutto insieme.** Proposta, progettazione, attività e specifiche risiedono in un unico posto. Non serve cercare in posizioni diverse.

2. **Lavoro parallelo.** Più modifiche possono esistere contemporaneamente senza entrare in conflitto. Si può lavorare su `add-dark-mode` mentre `fix-auth-bug` è anch'esso in corso.

3. **Storico pulito.** Quando vengono archiviate, le modifiche si spostano in `changes/archive/` mantenendo il loro contesto completo. Si può guardare indietro e capire non solo cosa è cambiato, ma perché.

4. **Facile da revisionare.** Una cartella di modifica è facile da revisionare: aprirla, leggere la proposta, controllare la progettazione, vedere le modifiche alle specifiche.

## Artifacts

Gli artifact sono i documenti all'interno di una modifica che guidano il lavoro.

### Il Flusso degli Artifact

```
proposta ──────► specifiche ──────► progettazione ──────► attività ──────► implementazione
    │               │             │              │
   perché          cosa          come          passi
 + ambito        cambia       approccio      da compiere
```

Gli artifact si costruiscono uno sull'altro. Ogni artifact fornisce contesto per il successivo.

### Tipi di Artifact

#### Proposta (`proposal.md`)

La proposta cattura **intento**, **ambito** e **approccio** ad alto livello.

```markdown
# Proposta: Aggiungere Modalità Scura
```

## Intento
Gli utenti hanno richiesto un'opzione di modalità scura per ridurre l'affaticamento degli occhi durante l'utilizzo notturno e per allinearsi alle preferenze del sistema.

## Ambito
Incluso nell'ambito:
- Interruttore del tema nelle impostazioni
- Rilevamento delle preferenze di sistema
- Persistenza delle preferenze in localStorage

Escluso dall'ambito:
- Temi personalizzati con colori custom (lavori futuri)
- Sovrascritture del tema per singola pagina

## Approccio
Utilizzare le variabili CSS personalizzate per la gestione dei temi con un contesto React per la gestione dello stato. Rilevare la preferenza di sistema al primo caricamento e consentire la sovrascrittura manuale.
```

**Quando aggiornare la proposta:**
- L'ambito cambia (si restringe o si espande)
- L'intento si chiarisce (migliore comprensione del problema)
- L'approccio cambia radicalmente

#### Specifiche (specifiche delta in `specs/`)

Le specifiche delta descrivono **cosa sta cambiando** rispetto alle specifiche correnti. Vedi [Specifiche Delta](#specifiche-delta) qui sotto.

#### Design (`design.md`)

Il design cattura **l'approccio tecnico** e le **decisioni architetturali**.

````markdown
# Design: Aggiunta della Modalità Scura

## Approccio Tecnico
Stato del tema gestito tramite React Context per evitare il prop drilling.
Le variabili CSS personalizzate consentono lo switch in runtime senza il toggle delle classi.

## Decisioni Architetturali

### Decisione: Contesto vs Redux
Utilizzo di React Context per lo stato del tema perché:
- Stato binario semplice (chiaro/scuro)
- Nessuna transizione di stato complessa
- Evita l'aggiunta della dipendenza da Redux

### Decisione: Variabili CSS Personalizzate
Utilizzo di variabili CSS invece di CSS-in-JS perché:
- Funziona con il foglio di stile esistente
- Nessun overhead in runtime
- Soluzione nativa del browser

## Flusso dei Dati
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applicato a :root)
```

## Modifiche ai File
- `src/contexts/ThemeContext.tsx` (nuovo)
- `src/components/ThemeToggle.tsx` (nuovo)
- `src/styles/globals.css` (modificato)
````

**Quando aggiornare il design:**
- L'implementazione rivela che l'approccio non funzionerà
- Viene scoperta una soluzione migliore
- Le dipendenze o i vincoli cambiano

#### Attività (`tasks.md`)

Le attività sono la **checklist di implementazione** — passi concreti con checkbox.

```markdown
# Attività

## 1. Infrastruttura del Tema
- [ ] 1.1 Creare ThemeContext con stato chiaro/scuro
- [ ] 1.2 Aggiungere variabili CSS personalizzate per i colori
- [ ] 1.3 Implementare la persistenza in localStorage
- [ ] 1.4 Aggiungere il rilevamento delle preferenze di sistema

## 2. Componenti UI
- [ ] 2.1 Creare il componente ThemeToggle
- [ ] 2.2 Aggiungere l'interruttore alla pagina delle impostazioni
- [ ] 2.3 Aggiornare l'Header per includere un interruttore rapido

## 3. Stile
- [ ] 3.1 Definire la tavolozza colori per il tema scuro
- [ ] 3.2 Aggiornare i componenti per utilizzare le variabili CSS
- [ ] 3.3 Testare i rapporti di contrasto per l'accessibilità
```

**Migliori pratiche per le attività:**
- Raggruppa attività correlate sotto titoli
- Usa numerazione gerarchica (1.1, 1.2, ecc.)
- Mantieni le attività sufficientemente piccole per essere completate in una sessione
- Segna le attività come completate man mano che le finisci

## Specifiche Delta

Le specifiche delta sono il concetto chiave che fa funzionare OpenSpec per lo sviluppo su sistemi esistenti (brownfield). Descrivono **cosa sta cambiando** invece di ripetere l'intera specifica.

### Il Formato

```markdown
# Delta per Auth

## Requisiti AGGIUNTI

### Requisito: Autenticazione a Due Fattori
Il sistema DEVE supportare l'autenticazione a due fattori basata su TOTP.

#### Scenario: Attivazione 2FA
- DATO un utente senza 2FA abilitato
- QUANDO l'utente abilita 2FA nelle impostazioni
- ALLORA viene visualizzato un codice QR per la configurazione dell'app di autenticazione
- E l'utente deve verificare con un codice prima dell'attivazione

#### Scenario: Accesso con 2FA
- DATO un utente con 2FA abilitato
- QUANDO l'utente invia credenziali valide
- ALLORA viene presentata una sfida OTP
- E l'accesso si completa solo dopo un OTP valido

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
(Deprecato in favore di 2FA. Gli utenti devono ri-autenticarsi ad ogni sessione.)
```

### Sezioni Delta

| Sezione | Significato | Cosa Succede in Archivio |
|---------|-------------|--------------------------|
| `## Requisiti AGGIUNTI` | Nuovo comportamento | Aggiunto alla specifica principale |
| `## Requisiti MODIFICATI` | Comportamento cambiato | Sostituisce il requisito esistente |
| `## Requisiti RIMOSSI` | Comportamento deprecato | Eliminato dalla specifica principale |

### Perché Delta Invece di Specifiche Complete

**Chiarezza.** Un delta mostra esattamente cosa sta cambiando. Leggendo una specifica completa, dovresti confrontarla mentalmente con la versione corrente.

**Evitare conflitti.** Due modifiche possono toccare lo stesso file di specifica senza entrare in conflitto, a patto che modifichino requisiti diversi.

**Efficienza nella revisione.** I revisori vedono la modifica, non il contesto invariato. Concentrarsi su ciò che conta.

**Adattamento al brownfield.** La maggior parte del lavoro modifica comportamenti esistenti. Le delta rendono le modifiche un elemento primario, non un ripensamento.

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
    requires: [specs, design] # Necessita sia di specifiche che di design
```

**Gli artefatti formano un grafo di dipendenze:**

```
                    proposal
                   (nodo radice)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (requires:                  (requires:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (requires:
                specs, design)
```

**Le dipendenze sono abilitatori, non porte.** Mostrano cosa è possibile creare, non cosa devi creare dopo. Puoi saltare il design se non ne hai bisogno. Puoi creare le specifiche prima o dopo il design — entrambe dipendono solo dalla proposta.

### Schemi Integrati

**spec-driven** (predefinito)

Il flusso di lavoro standard per lo sviluppo guidato da specifiche:

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
    requires: [research]   # Proposta informata dalla ricerca

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Salta specifiche/design, vai direttamente alle attività
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
        ├── design.md                │ unisci
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Dopo l'archiviazione:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Ora include i requisiti 2FA
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

1. **Unisci i delta.** Ogni sezione di specifica delta (AGGIUNTA/MODIFICATA/RIMOSSA) viene applicata alla specifica principale corrispondente.

2. **Sposta nell'archivio.** La cartella delle modifiche viene spostata in `changes/archive/` con un prefisso data per l'ordinamento cronologico.

3. **Preserva il contesto.** Tutti gli artefatti rimangono intatti nell'archivio. Puoi sempre consultarlo per capire perché è stata fatta una modifica.

### Perché l'Archiviazione è Importante

**Stato pulito.** Le modifiche attive (`changes/`) mostrano solo il lavoro in corso. Il lavoro completato viene spostato fuori dalla vista.

**Traccia di revisione.** L'archivio preserva il contesto completo di ogni modifica — non solo cosa è cambiato, ma la proposta che spiega perché, il design che spiega come, e le attività che mostrano il lavoro svolto.

**Evoluzione delle specifiche.** Le specifiche crescono organicamente man mano che le modifiche vengono archiviate. Ogni archivio unisce i suoi delta, costruendo nel tempo una specifica completa.

## Come Tutto si Insieme

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            FLUSSO OPENSPEC                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │ 1. AVVIA LA    │  /opsx:propose (core) o /opsx:new (flusso espanso)      │
│   │    MODIFICA     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │ 2. CREA        │  /opsx:ff o /opsx:continue (flusso di lavoro espanso)   │
│   │    GLI ARTEFATTI│  Crea proposta → specifiche → design → attività         │
│   │                │  (basato sulle dipendenze dello schema)                  │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │ 3. IMPLEMENTA  │  /opsx:apply                                            │
│   │    LE ATTIVITÀ │  Lavora sulle attività, segnandole come completate      │
│   │                │◄──── Aggiorna gli artefatti man mano che impari          │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │ 4. VERIFICA    │  /opsx:verify (opzionale)                                │
│   │    IL LAVORO   │  Controlla che l'implementazione corrisponda alle spec   │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │ 5. ARCHIVIA LA │────►│  Le specifiche delta vengono unite nelle spec│    │
│   │    MODIFICA    │     │  principali.                                 │    │
│   └────────────────┘     │  La cartella delle modifiche viene spostata  │    │
│                          │  nell'archivio/.                             │    │
│                          │  Le specifiche sono ora la fonte aggiornata  │    │
│                          │  della verità.                               │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Il ciclo virtuoso:**

1. Le specifiche descrivono il comportamento attuale
2. Le modifiche propongono modifiche (come delta)
3. L'implementazione rende reali le modifiche
4. L'archivio unisce i delta nelle specifiche
5. Le specifiche ora descrivono il nuovo comportamento
6. La prossima modifica si basa sulle specifiche aggiornate

## Glossario

| Termine | Definizione |
|---------|-------------|
| **Artefatto** | Un documento all'interno di una modifica (proposta, design, task o specifiche delta) |
| **Archiviazione** | Il processo di completamento di una modifica e l'unione delle sue delta nelle specifiche principali |
| **Modifica** | Una modifica proposta al sistema, raggruppata come una cartella con artefatti |
| **Specifica delta** | Una specifica che descrive le modifiche (AGGIUNTO/MODIFICATO/RIMOSSO) rispetto alle specifiche attuali |
| **Dominio** | Un raggruppamento logico per le specifiche (es. `auth/`, `payments/`) |
| **Requisito** | Un comportamento specifico che il sistema deve avere |
| **Scenario** | Un esempio concreto di un requisito, tipicamente nel formato Dato/Quando/Allora |
| **Schema** | Una definizione dei tipi di artefatti e delle loro dipendenze |
| **Specifica** | Una descrizione del comportamento del sistema, contenente requisiti e scenari |
| **Fonte di verità** | La directory `openspec/specs/`, contenente il comportamento attuale concordato |

## Prossimi Passi

- [Introduzione](getting-started.md) - Primi passi pratici
- [Flussi di lavoro](workflows.md) - Pattern comuni e quando utilizzare ciascuno
- [Comandi](commands.md) - Riferimento completo dei comandi
- [Personalizzazione](customization.md) - Crea schema personalizzati e configura il tuo progetto