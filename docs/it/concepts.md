# Concetti

Questa guida spiega le idee fondamentali di OpenSpec e come si integrano. Per l'utilizzo pratico, consultare [Getting Started](getting-started.md) e [Workflows](workflows.md).

## Filosofia

OpenSpec è costruito su quattro principi:

```
fluid not rigid         — nessun gate di fase, lavorare su ciò che ha senso
iterative not waterfall — imparare mentre si costruisce, affinare man mano
easy not complex        — configurazione leggera, cerimonia minima
brownfield-first        — funziona con codebase esistenti, non solo con nuovi progetti (greenfield)
```

### Perché Questi Principi Sono Importanti

**Fluido non rigido.** I sistemi di specifiche tradizionali ti bloccano in fasi: prima pianifichi, poi implementi e sei finito. OpenSpec è più flessibile: puoi creare artefatti in qualsiasi ordine che abbia senso per il tuo lavoro.

**Iterativo non a cascata.** I requisiti cambiano. La comprensione si approfondisce. Ciò che sembrava un buon approccio all'inizio potrebbe non reggere dopo aver visto la codebase. OpenSpec accoglie questa realtà.

**Facile non complesso.** Alcuni framework di specifiche richiedono una configurazione estesa, formati rigidi o processi pesanti (heavyweight). OpenSpec non si intromette. Inizializza in pochi secondi, inizia a lavorare immediatamente, personalizza solo se è necessario.

**Orientato al brownfield.** La maggior parte del lavoro software non consiste nel costruire da zero, ma nel modificare sistemi esistenti. L'approccio basato su delta di OpenSpec rende facile specificare modifiche al comportamento esistente, non solo descrivere nuovi sistemi.

## Il Quadro Generale

OpenSpec organizza il tuo lavoro in due aree principali:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source of truth    │◄─────│  Proposed modifications       │   │
│   │  How your system    │ merge│  Each change = one folder     │   │
│   │  currently works    │      │  Contains artifacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** sono la fonte di verità — descrivono come il tuo sistema funziona attualmente.

**Changes** sono modifiche proposte — risiedono in cartelle separate fino a quando non sarai pronto per unirle (merge).

Questa separazione è fondamentale. Puoi lavorare su più cambiamenti in parallelo senza conflitti. Puoi rivedere un cambiamento prima che influenzi le specs principali. E quando archivi un cambiamento, i suoi deltas si fondono pulitamente nella fonte di verità.

## Specs

Le Specs descrivono il comportamento del tuo sistema utilizzando requisiti e scenari strutturati.

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
    └── spec.md           # Comportamento e temi dell'interfaccia utente (UI)
```

Organizza le specs per dominio — raggruppamenti logici che hanno senso per il tuo sistema. Schemi comuni:

- **Per area funzionale**: `auth/`, `payments/`, `search/`
- **Per componente**: `api/`, `frontend/`, `workers/`
- **Per contesto delimitato (bounded context)**: `ordering/`, `fulfillment/`, `inventory/`

### Formato della Spec

Una spec contiene requisiti, e ogni requisito ha scenari:

```markdown
# Auth Specification

## Purpose
Gestione dell'autenticazione e delle sessioni per l'applicazione.

## Requirements

### Requirement: User Authentication
Il sistema DEVE emettere un token JWT dopo un login riuscito.

#### Scenario: Credenziali valide
- GIVEN un utente con credenziali valide
- WHEN l'utente invia il modulo di login
- THEN viene restituito un token JWT
- AND l'utente viene reindirizzato alla dashboard

#### Scenario: Credenziali non valide
- GIVEN credenziali non valide
- WHEN l'utente invia il modulo di login
- THEN viene visualizzato un messaggio di errore
- AND nessun token viene emesso

### Requirement: Session Expiration
Il sistema DEVE scadere le sessioni dopo 30 minuti di inattività.

#### Scenario: Timeout da inattività
- GIVEN una sessione autenticata
- WHEN passano 30 minuti senza attività
- THEN la sessione viene invalidata
- AND l'utente deve riautenticarsi
```

**Elementi chiave:**

| Element | Scopo |
|---------|---------|
| `## Purpose` | Descrizione di alto livello del dominio di questa spec |
| `### Requirement:` | Un comportamento specifico che il sistema deve avere |
| `#### Scenario:` | Un esempio concreto del requisito in azione |
| SHALL/MUST/SHOULD | Parole chiave RFC 2119 che indicano la forza del requisito |

### Perché Strutturare le Specs in Questo Modo

**I Requisiti sono il "cosa"** — dichiarano cosa dovrebbe fare il sistema senza specificare l'implementazione.

**Gli Scenari sono il "quando"** — forniscono esempi concreti che possono essere verificati. Buoni scenari:
- Sono testabili (si potrebbe scrivere un test automatizzato per essi)
- Coprono sia il percorso felice (happy path) che i casi limite (edge cases)
- Usano Given/When/Then o un formato strutturato simile

**Le parole chiave RFC 2119** (SHALL, MUST, SHOULD, MAY) comunicano l'intento:
- **MUST/SHALL** — requisito assoluto
- **SHOULD** — raccomandato, ma esistono eccezioni
- **MAY** — opzionale

### Cosa È una Spec (e Cosa Non È)

Una spec è un **contratto di comportamento**, non un piano di implementazione.

Contenuti buoni per la spec:
- Comportamento osservabile su cui si basano gli utenti o i sistemi a valle
- Input, output e condizioni di errore
- Vincoli esterni (sicurezza, privacy, affidabilità, compatibilità)
- Scenari che possono essere testati o esplicitamente validati

Cosa evitare nelle specs:
- Nomi interni di classi/funzioni
- Scelte di librerie o framework
- Dettagli di implementazione passo dopo passo
- Piani di esecuzione dettagliati (quelli appartengono a `design.md` o `tasks.md`)

Test rapido:
- Se l'implementazione può cambiare senza modificare il comportamento visibile esternamente, probabilmente non appartiene alla spec.

### Mantenerla Leggera: Rigore Progressivo

OpenSpec mira ad evitare la burocrazia. Usa il livello più leggero che renda comunque verificabile il cambiamento.

**Lite spec (predefinito):**
- Requisiti brevi e focalizzati sul comportamento
- Scopo chiaro e obiettivi non raggiunti (non-goals)
- Alcuni controlli di accettazione concreti

**Full spec (per rischi maggiori):**
- Cambiamenti inter-team o cross-repo
- Cambiamenti API/contratto, migrazioni, preoccupazioni di sicurezza/privacy
- Cambiamenti in cui l'ambiguità è probabile che causi un lavoro costoso da rifare

La maggior parte dei cambiamenti dovrebbe rimanere in modalità Lite.

### Collaborazione Umano + Agente

In molti team, gli umani esplorano e gli agenti redigono gli artefatti. Il ciclo previsto è:

1. L'Umano fornisce l'intento, il contesto e i vincoli.
2. L'Agente converte questo in requisiti e scenari focalizzati sul comportamento.
3. L'Agente mantiene i dettagli di implementazione in `design.md` e `tasks.md`, non in `spec.md`.
4. La Validazione conferma struttura e chiarezza prima dell'implementazione.

Questo mantiene le specs leggibili per gli umani e coerenti per gli agenti.

## Changes (Cambiamenti)

Un Change è una modifica proposta al tuo sistema, impacchettata come una cartella contenente tutto ciò che è necessario per comprenderla e implementarla.

### Struttura del Change

```
openspec/changes/add-dark-mode/
├── proposal.md           # Perché e cosa
├── design.md             # Come (approccio tecnico)
├── tasks.md              # Checklist di implementazione
├── .openspec.yaml        # Metadati del cambiamento (opzionale)
└── specs/                # Delta specs
    └── ui/
        └── spec.md       # Cosa sta cambiando in ui/spec.md
```

Ogni cambiamento è autonomo. Contiene:
- **Artifacts** — documenti che catturano l'intento, il design e i compiti
- **Delta specs** — specifiche per ciò che viene aggiunto, modificato o rimosso
- **Metadata** — configurazione opzionale per questo specifico cambiamento

### Perché i Cambiamenti sono Cartelle

Impacchettare un cambiamento come una cartella offre diversi vantaggi:

1. **Tutto insieme.** La proposta, il design, i compiti e le specs risiedono in un unico luogo. Niente da cercare in diverse posizioni.

2. **Lavoro parallelo.** Più cambiamenti possono esistere contemporaneamente senza conflitti. Lavora su `add-dark-mode` mentre è in corso anche `fix-auth-bug`.

3. **Storia pulita.** Quando archiviati, i cambiamenti vengono spostati in `changes/archive/` con il loro contesto completo preservato. Puoi guardare indietro e capire non solo cosa è cambiato, ma perché.

4. **Facili da rivedere (Review-friendly).** Una cartella di cambiamento è facile da revisionare: aprila, leggi la proposta, controlla il design, guarda i deltas delle spec.

## Artifacts (Artefatti)

Gli Artefatti sono i documenti all'interno di un Change che guidano il lavoro.

### Il Flusso degli Artefatti

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   perché            cosa           come          passaggi da seguire
 + scope        cambiamenti       approccio      da intraprendere
```

Gli Artefatti si basano l'uno sull'altro. Ogni artefatto fornisce contesto per il successivo.

### Tipi di Artefatti

#### Proposal (`proposal.md`)

La proposta cattura **l'intento**, lo **scopo** e l'**approccio** a un livello elevato.

```markdown
# Proposal: Add Dark Mode

## Intent
Gli utenti hanno richiesto un'opzione modalità scura per ridurre l'affaticamento degli occhi
durante l'uso notturno e per allinearsi alle preferenze del sistema.

## Scope
In scope:
- Interruttore del tema nelle impostazioni
- Rilevazione delle preferenze di sistema
- Persistere la preferenza in localStorage

Out of scope:
- Temi colorati personalizzati (lavoro futuro)
- Override del tema per pagina

## Approach
Utilizzare proprietà CSS custom per il theming con un React context
per la gestione dello stato. Rilevare la preferenza di sistema al primo caricamento,
consentire l'override manuale.
```

**Quando aggiornare la proposta:**
- Cambiamenti nello scope (restringimento o espansione)
- L'intento si chiarisce (migliore comprensione del problema)
- L'approccio cambia fondamentalmente

#### Specs (delta specs in `specs/`)

Le Delta Specs descrivono **cosa sta cambiando** rispetto alle specs attuali. Vedi [Delta Specs](#delta-specs) qui sotto.

#### Design (`design.md`)

Il design cattura l'**approccio tecnico** e le **decisioni architetturali**.

````markdown
# Design: Add Dark Mode

## Technical Approach
Lo stato del tema gestito tramite React Context per evitare il prop drilling.
Le proprietà CSS custom abilitano lo switching in tempo reale senza toggling di classi.

## Architecture Decisions

### Decision: Context over Redux
Utilizzare React Context per lo stato del tema perché:
- Stato binario semplice (chiaro/scuro)
- Nessuna transizioni di stato complesse
- Evita l'aggiunta della dipendenza da Redux

### Decision: CSS Custom Properties
Usare variabili CSS invece di CSS-in-JS perché:
- Funziona con il stylesheet esistente
- Nessun overhead in tempo reale
- Soluzione nativa del browser

## Data Flow
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applicate a :root)
```

## File Changes
- `src/contexts/ThemeContext.tsx` (nuovo)
- `src/components/ThemeToggle.tsx` (nuovo)
- `src/styles/globals.css` (modificato)
````

**Quando aggiornare il design:**
- L'implementazione rivela che l'approccio non funzionerà
- Una soluzione migliore viene scoperta
- Cambiano dipendenze o vincoli

#### Tasks (`tasks.md`)

I Task sono la **checklist di implementazione** — passi concreti con caselle di controllo.

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Creare ThemeContext con stato chiaro/scuro
- [ ] 1.2 Aggiungere proprietà CSS custom per i colori
- [ ] 1.3 Implementare la persistenza in localStorage
- [ ] 1.4 Aggiungere rilevamento delle preferenze di sistema

## 2. UI Components
- [ ] 2.1 Creare il componente ThemeToggle
- [ ] 2.2 Aggiungere il toggle alla pagina delle impostazioni
- [ ] 2.3 Aggiornare l'Header per includere un toggle rapido

## 3. Styling
- [ ] 3.1 Definire la palette di colori del tema scuro
- [ ] 3.2 Aggiornare i componenti per usare le variabili CSS
- [ ] 3.3 Testare i rapporti di contrasto per l'accessibilità
```

**Migliori pratici per i Task:**
- Raggruppa i task correlati sotto intestazioni
- Usa una numerazione gerarchica (1.1, 1.2, ecc.)
- Mantieni i task abbastanza piccoli da completare in una sessione
- Spunta i task man mano che vengono completati

## Delta Specs (Specifiche di Variazione)

Le Delta Specs sono il concetto chiave che rende OpenSpec efficace per lo sviluppo brownfield. Descrivono **cosa sta cambiando** piuttosto che riassumere l'intera spec.

### Il Formato

```markdown
# Delta for Auth

## ADDED Requirements (Requisiti AGGIUNTI)

### Requirement: Two-Factor Authentication
Il sistema DEVE supportare l'autenticazione a due fattori basata su TOTP.

#### Scenario: 2FA enrollment
- GIVEN un utente senza 2FA abilitato
- WHEN l'utente abilita il 2FA nelle impostazioni
- THEN viene visualizzato un codice QR per la configurazione dell'app autenticatore
- AND l'utente deve verificare con un codice prima dell'attivazione

#### Scenario: 2FA login
- GIVEN un utente con 2FA abilitato
- WHEN l'utente invia credenziali valide
- THEN viene presentato un challenge OTP
- AND il login è completato solo dopo un OTP valido

## MODIFIED Requirements (Requisiti MODIFICATI)

### Requirement: Session Expiration
Il sistema DEVE scadere le sessioni dopo 15 minuti di inattività.
(Precedentemente: 30 minuti)

#### Scenario: Idle timeout
- GIVEN una sessione autenticata
- WHEN passano 15 minuti senza attività
- THEN la sessione viene invalidata

## REMOVED Requirements (Requisiti RIMOSSI)

### Requirement: Remember Me
(Deprecato in favore del 2FA. Gli utenti dovrebbero riautenticarsi ad ogni sessione.)
```

### Sezioni Delta

| Sezione | Significato | Cosa succede all'Archiviazione |
|---------|---------|------------------------|
| `## ADDED Requirements` | Nuovo comportamento | Aggiunto alla spec principale |
| `## MODIFIED Requirements` | Comportamento cambiato | Sostituisce il requisito esistente |
| `## REMOVED Requirements` | Comportamento deprecato | Eliminato dalla spec principale |

### Perché Deltas e Non Specs Complete

**Chiarezza.** Un delta mostra esattamente cosa sta cambiando. Leggendo una spec completa, dovresti fare un confronto mentale con la versione attuale.

**Evitare conflitti.** Due cambiamenti possono toccare lo stesso file di spec senza entrare in conflitto, purché modifichino requisiti diversi.

**Efficienza della revisione.** I revisori vedono il cambiamento, non il contesto invariato. Si concentrano su ciò che è importante.

**Adattamento Brownfield.** La maggior parte del lavoro modifica comportamenti esistenti. I Deltas rendono le modifiche una classe di prima livello, non un ripensamento.

## Schemi

Gli schemi definiscono i tipi di artefatti e le loro dipendenze per un workflow.

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
    requires: [proposal]      # Richiede proposal prima di essere creato

  - id: design
    generates: design.md
    requires: [proposal]      # Può essere creato in parallelo con specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Richiede sia specs che design prima
```

**Gli Artefatti formano un grafo di dipendenze:**

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

**Le Dipendenze sono abilitatori, non cancelli.** Mostrano cosa è possibile creare, non cosa devi creare dopo. Puoi saltare il design se non ne hai bisogno. Puoi creare specs prima o dopo il design — entrambi dipendono solo da proposal.

### Schemi Integrati

**spec-driven** (predefinito)

Il flusso di lavoro standard per lo sviluppo basato su specifiche:

```
proposal → specs → design → tasks → implement
```

Ideale per: La maggior parte del lavoro sulle funzionalità in cui si desidera concordare le specifiche prima dell'implementazione.

### Schemi Personalizzati

Crea schemi personalizzati per il workflow del tuo team:

```bash
# Crea da zero
openspec schema init research-first

# Oppure forca uno esistente
openspec schema fork spec-driven research-first
```

**Esempio di schema personalizzato:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Fai prima la ricerca

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal informata dalla ricerca

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Salta specs/design, vai direttamente a tasks
```

Vedi [Personalizzazione](customization.md) per tutti i dettagli sulla creazione e sull'uso degli schemi personalizzati.

## Archivio

L'Archiviazione completa una modifica unendo le suoi delta spec alle specifiche principali e preservando la modifica per la cronologia.

### Cosa Succede Quando si Archivia

```
Prima dell'archiviazione:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ merge
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Dopo l'archiviazione:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Ora include i requisiti di 2FA
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Preservato per la cronologia
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Il Processo di Archiviazione

1. **Unisci i delta.** Ogni sezione delta spec (ADDED/MODIFIED/REMOVED) viene applicata alla specifica principale corrispondente.

2. **Sposta nell'archivio.** La cartella della modifica si sposta in `changes/archive/` con un prefisso di data per l'ordinamento cronologico.

3. **Preserva il contesto.** Tutti gli artefatti rimangono intatti nell'archivio. Puoi sempre guardare indietro per capire perché è stata fatta una modifica.

### Perché l'Archiviazione è Importante

**Stato pulito.** Le modifiche attive (`changes/`) mostrano solo il lavoro in corso. Il lavoro completato viene spostato via.

**Traccia di audit.** L'archivio preserva il contesto completo di ogni cambiamento — non solo cosa è cambiato, ma la proposta che spiega il perché, il design che spiega il come e i task che mostrano il lavoro svolto.

**Evoluzione delle specifiche.** Le specifiche crescono organicamente man mano che le modifiche vengono archiviate. Ogni archivio unisce i suoi delta, costruendo una specifica completa nel tempo.

## Come Funziona Tutto Insieme

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FLUSSO OPENSPEC                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. INIZIO     │  /opsx:propose (core) o /opsx:new (espanso)           │
│   │     MODIFICA   │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREA       │  /opsx:ff o /opsx:continue (workflow espanso)         │
│   │     ARTIFACTI  │  Crea proposal → specs → design → tasks              │
│   │                │  (basato sulle dipendenze dello schema)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENTA │  /opsx:apply                                            │
│   │     I TASCHI  │  Lavora sui task, spuntandoli                  │
│   │                │◄──── Aggiorna gli artefatti man mano che impari                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFICA   │  /opsx:verify (opzionale)                                │
│   │     LAVORO     │  Controlla che l'implementazione corrisponda alle specifiche │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVIARE │────►│  I delta spec vengono uniti alle specifiche principali │    │
│   │     MODIFICA   │     │  La cartella di modifica si sposta in archive/             │    │
│   └────────────────┘     │  Le specifiche sono ora la fonte di verità aggiornata   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Il ciclo virtuoso:**

1. Le specifiche descrivono il comportamento attuale
2. Le modifiche propongono le alterazioni (come delta)
3. L'implementazione rende reali i cambiamenti
4. L'Archiviazione unisce i delta nelle specifiche
5. Le specifiche descrivono ora il nuovo comportamento
6. La prossima modifica si basa sulle specifiche aggiornate

## Glossario

| Termine | Definizione |
|------|------------|
| **Artifact** | Un documento all'interno di una modifica (proposal, design, tasks o delta spec) |
| **Archive** | Il processo di completare una modifica e unire i suoi delta alle specifiche principali |
| **Change** | Una modifica proposta al sistema, impacchettata come una cartella con gli artefatti |
| **Delta spec** | Una specifica che descrive le modifiche (ADDED/MODIFIED/REMOVED) rispetto alle specifiche attuali |
| **Domain** | Un raggruppamento logico per le specifiche (es. `auth/`, `payments/`) |
| **Requirement** | Un comportamento specifico che il sistema deve avere |
| **Scenario** | Un esempio concreto di un requisito, tipicamente nel formato Given/When/Then |
| **Schema** | Una definizione dei tipi di artefatti e delle loro dipendenze |
| **Spec** | Una specifica che descrive il comportamento del sistema, contenente requisiti e scenari |
| **Source of truth** | La directory `openspec/specs/`, contenente il comportamento attualmente concordato |

## Prossimi Passi

- [Getting Started](getting-started.md) - Primi passi pratici
- [Workflows](workflows.md) - Schemi comuni e quando usarli
- [Commands](commands.md) - Riferimento completo dei comandi
- [Customization](customization.md) - Crea schemi personalizzati e configura il tuo progetto