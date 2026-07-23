# Concetti

Questa guida illustra le idee alla base di OpenSpec e come si integrano tra loro. Per l'uso pratico, consulta [Guida introduttiva](getting-started.md) e [Flussi di lavoro](workflows.md).

## Filosofia

OpenSpec è basato su quattro principi:

```
fluido non rigido        — niente gate di fase, lavora su ciò che ha senso
iterativo non a cascata  — impara mentre costruisci, affina man mano che procedi
semplice non complesso   — configurazione leggera, cerimonie minime
priorità al brownfield   — funziona con codebase esistenti, non solo con progetti nuovi da zero
```

### Perché questi principi sono importanti

**Fluido non rigido.** I sistemi di specifiche tradizionali ti bloccano in fasi: prima pianifichi, poi implementi, poi hai finito. OpenSpec è più flessibile: puoi creare artefatti in qualsiasi ordine che abbia senso per il tuo lavoro.

**Iterativo non a cascata.** I requisiti cambiano. La comprensione si approfondisce. Quello che sembrava un buon approccio all'inizio potrebbe non reggere dopo aver visto il codebase. OpenSpec accoglie questa realtà.

**Semplice non complesso.** Alcuni framework di specifiche richiedono una configurazione estesa, formati rigidi o processi pesanti. OpenSpec non si intromette. Inizializza in pochi secondi, inizia a lavorare immediatamente, personalizza solo se ne hai bisogno.

**Priorità al brownfield.** La maggior parte del lavoro software non consiste nel costruire da zero: si tratta di modificare sistemi esistenti. L'approccio basato su delta di OpenSpec rende facile specificare modifiche al comportamento esistente, non solo descrivere nuovi sistemi.

## Il quadro generale

OpenSpec organizza il tuo lavoro in due aree principali:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Fonte di verità    │◄─────│  Modifiche proposte           │   │
│   │  Come il tuo        │ merge│  Ogni modifica = una cartella │   │
│   │  sistema funziona   │      │  Contiene artefatti + delta   │   │
│   │  attualmente        │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specifiche** sono la fonte di verità: descrivono come il tuo sistema si comporta attualmente.

**Modifiche** sono le modifiche proposte: risiedono in cartelle separate finché non sei pronto ad unirle (merge).

Questa separazione è fondamentale. Puoi lavorare su più modifiche in parallelo senza conflitti. Puoi rivedere una modifica prima che influisca sulle specifiche principali. E quando archivi una modifica, i suoi delta vengono integrati in modo pulito nella fonte di verità.

## Specifiche

Le specifiche descrivono il comportamento del tuo sistema tramite requisiti strutturati e scenari.

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
    └── spec.md           # Comportamento dell'interfaccia utente e temi
```

Organizza le specifiche per dominio: raggruppamenti logici che hanno senso per il tuo sistema. Modelli comuni:

- **Per area funzionale**: `auth/`, `payments/`, `search/`
- **Per componente**: `api/`, `frontend/`, `workers/`
- **Per contesto delimitato**: `ordering/`, `fulfillment/`, `inventory/`

### Formato delle specifiche

Una specifica contiene requisiti, e ogni requisito ha scenari:

```markdown
# Specifica di Autenticazione

## Scopo
Gestione dell'autenticazione e delle sessioni per l'applicazione.

## Requisiti

### Requisito: Autenticazione dell'utente
Il sistema SHALL emettere un token JWT al login avvenuto con successo.

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

### Requisito: Scadenza della sessione
Il sistema MUST far scadere le sessioni dopo 30 minuti di inattività.

#### Scenario: Timeout per inattività
- GIVEN una sessione autenticata
- WHEN passano 30 minuti senza attività
- THEN la sessione viene invalidata
- AND l'utente deve riautenticarsi
```

**Elementi chiave:**

| Elemento | Scopo |
|----------|-------|
| `## Purpose` | Descrizione di alto livello del dominio di questa specifica |
| `### Requirement:` | Un comportamento specifico che il sistema deve avere |
| `#### Scenario:` | Un esempio concreto del requisito in azione |
| SHALL/MUST/SHOULD | Keyword RFC 2119 che indicano la forza del requisito |

### Perché strutturare le specifiche in questo modo

**I requisiti sono il "cosa"**: indicano cosa il sistema deve fare senza specificare l'implementazione.

**Gli scenari sono il "quando"**: forniscono esempi concreti che possono essere verificati. Gli scenari corretti:
- Sono verificabili (puoi scrivere un test automatizzato per essi)
- Coprono sia il percorso felice che i casi limite
- Utilizzano il formato strutturato Dato/Quando/Allora o formati simili

**Le keyword RFC 2119** (SHALL, MUST, SHOULD, MAY) comunicano l'intento:
- **MUST/SHALL** — requisito assoluto
- **SHOULD** — consigliato, ma esistono eccezioni
- **MAY** — opzionale

### Cos'è (e cosa non è) una specifica

Una specifica è un **contratto di comportamento**, non un piano di implementazione.

Contenuto corretto per una specifica:
- Comportamento osservabile su cui fanno affidamento gli utenti o i sistemi a valle
- Input, output e condizioni di errore
- Vincoli esterni (sicurezza, privacy, affidabilità, compatibilità)
- Scenari che possono essere testati o convalidati esplicitamente

Da evitare nelle specifiche:
- Nomi di classi/funzioni interne
- Scelte di librerie o framework
- Dettagli di implementazione passo passo
- Piani di esecuzione dettagliati (questi appartengono a `design.md` o `tasks.md`)

Test rapido:
- Se l'implementazione può cambiare senza modificare il comportamento visibile esternamente, probabilmente non appartiene alla specifica.

### Mantienila leggera: Rigore progressivo

OpenSpec mira a evitare la burocrazia. Utilizza il livello più leggero che renda comunque la modifica verificabile.

**Specifica leggera (predefinita):**
- Requisiti brevi, incentrati prima di tutto sul comportamento
- Ambito chiaro e obiettivi non inclusi
- Alcuni controlli di accettazione concreti

**Specifica completa (per rischi più elevati):**
- Modifiche tra team o tra repository
- Modifiche a API/contratti, migrazioni, problematiche di sicurezza/privacy
- Modifiche in cui l'ambiguità potrebbe causare costose revisioni del lavoro

La maggior parte delle modifiche dovrebbe rimanere in modalità leggera.

### Collaborazione tra esseri umani e agenti

In molti team, gli esseri umani esplorano e gli agenti redigono gli artefatti. Il ciclo previsto è:

1. L'essere umano fornisce intento, contesto e vincoli.
2. L'agente converte questi in requisiti incentrati sul comportamento e scenari.
3. L'agente mantiene i dettagli di implementazione in `design.md` e `tasks.md`, non in `spec.md`.
4. La convalida conferma la struttura e la chiarezza prima dell'implementazione.

Questo mantiene le specifiche leggibili per gli esseri umani e coerenti per gli agenti.

## Modifiche

Una modifica è una modifica proposta al tuo sistema, confezionata come una cartella con tutto il necessario per comprenderla e implementarla.

### Struttura di una modifica

```
openspec/changes/add-dark-mode/
├── proposal.md           # Perché e cosa
├── design.md             # Come (approccio tecnico)
├── tasks.md              # Elenco di controllo per l'implementazione
├── .openspec.yaml        # Metadati della modifica (opzionale): schema, data di creazione, skip_specs
└── specs/                # Specifiche delta
    └── ui/
        └── spec.md       # Cosa cambia in ui/spec.md
```

Ogni modifica è auto-contenuta. Ha:
- **Artefatti** — documenti che catturano intento, progettazione e compiti
- **Specifiche delta** — specifiche per ciò che viene aggiunto, modificato o rimosso
- **Metadati** — configurazione opzionale per questa modifica specifica

### Perché le modifiche sono cartelle

Confezionare una modifica come una cartella ha diversi vantaggi:

1. **Tutto insieme.** Proposta, progettazione, compiti e specifiche risiedono in un unico posto. Nessuna necessità di cercare in posizioni diverse.
2. **Lavoro parallelo.** Più modifiche possono esistere contemporaneamente senza conflitti. Lavora su `add-dark-mode` mentre `fix-auth-bug` è anch'esso in corso.
3. **Cronologia pulita.** Quando archiviate, le modifiche vengono spostate in `changes/archive/` con tutto il loro contesto preservato. Puoi guardare indietro e comprendere non solo cosa è cambiato, ma anche perché.
4. **Facile da revisionare.** Una cartella di modifica è facile da revisionare: aprilala, leggi la proposta, controlla la progettazione, vedi i delta delle specifiche.

## Artefatti

Gli artefatti sono i documenti all'interno di una modifica che guidano il lavoro.

### Il flusso degli artefatti

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   perché          cosa          come          passaggi
 + ambito      cambiamenti     approccio      da seguire
```

Gli artefatti si basano l'uno sull'altro. Ogni artefatto fornisce il contesto per il successivo.

### Tipi di artefatti

#### Proposta (`proposal.md`)

La proposta cattura **intento**, **ambito** e **approccio** a livello generale.

```markdown
# Proposta: Aggiungi la modalità scura

## Intento
Gli utenti hanno richiesto un'opzione di modalità scura per ridurre l'affaticamento degli occhi durante l'uso notturno e adattarsi alle preferenze di sistema.

## Ambito
Incluso nell'ambito:
- Interruttore del tema nelle impostazioni
- Rilevamento delle preferenze di sistema
- Persistenza della preferenza in localStorage

Escluso dall'ambito:
- Temi di colore personalizzati (lavoro futuro)
- Sovrascritture del tema per pagina

## Approccio
Utilizza le proprietà personalizzate CSS per la gestione dei temi con un contesto React per la gestione dello stato. Rileva la preferenza di sistema al primo caricamento, consenti la sovrascrittura manuale.
```

**Quando aggiornare la proposta:**
- Cambiamenti di ambito (restrizione o espansione)
- L'intento si chiarisce (migliore comprensione del problema)
- L'approccio cambia radicalmente

#### Specifiche (specifiche delta in `specs/`)

Le specifiche delta descrivono **cosa sta cambiando** rispetto alle specifiche correnti. Vedi [Delta Specs](#delta-specs) di seguito.

#### Progettazione (`design.md`)

La progettazione cattura **approccio tecnico** e **decisioni architetturali**.

````markdown
# Progettazione: Aggiungi la modalità scura

## Approccio Tecnico
Lo stato del tema è gestito tramite React Context per evitare il prop drilling.
Le proprietà personalizzate CSS consentono il cambio a runtime senza toggle di classi.

## Decisioni Architetturali

### Decisione: Context invece di Redux
Utilizzo di React Context per lo stato del tema perché:
- Stato binario semplice (chiaro/scuro)
- Nessuna transizione di stato complessa
- Evita di aggiungere la dipendenza da Redux

### Decisione: Proprietà Personalizzate CSS
Utilizzo di variabili CSS invece di CSS-in-JS perché:
- Funziona con il foglio di stile esistente
- Nessun overhead a runtime
- Soluzione nativa del browser

## Flusso di Dati
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
- Cambiano le dipendenze o i vincoli

#### Compiti (`tasks.md`)

I compiti sono la **lista di controllo per l'implementazione**: passaggi concreti con checkbox.

```markdown
# Compiti

## 1. Infrastruttura del Tema
- [ ] 1.1 Creare ThemeContext con stato chiaro/scuro
- [ ] 1.2 Aggiungere proprietà personalizzate CSS per i colori
- [ ] 1.3 Implementare la persistenza in localStorage
- [ ] 1.4 Aggiungere il rilevamento delle preferenze di sistema

## 2. Componenti dell'Interfaccia Utente
- [ ] 2.1 Creare il componente ThemeToggle
- [ ] 2.2 Aggiungere l'interruttore alla pagina delle impostazioni
- [ ] 2.3 Aggiornare l'Header per includere l'interruttore rapido

## 3. Stile
- [ ] 3.1 Definire la palette di colori per il tema scuro
- [ ] 3.2 Aggiornare i componenti per utilizzare le variabili CSS
- [ ] 3.3 Verificare i rapporti di contrasto per l'accessibilità
```

**Buone pratiche per i compiti:**
- Raggruppa i compiti correlati sotto le intestazioni
- Utilizza una numerazione gerarchica (1.1, 1.2, ecc.)
- Mantieni i compiti abbastanza piccoli da completare in una sola sessione
- Segna i compiti come completati man mano che li finisci

## Delta Specs

Le specifiche delta sono il concetto chiave che rende OpenSpec adatto allo sviluppo brownfield. Descrivono **cosa sta cambiando** invece di riscrivere l'intera specifica.

### Il Formato

```markdown
# Delta per l'Autenticazione

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup
- AND the user must verify with a code before activation

#### Scenario: 2FA login
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented
- AND login completes only after valid OTP

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users should re-authenticate each session.)
```

### Sezioni Delta

| Sezione | Significato | Cosa succede all'archiviazione |
|---------|-------------|--------------------------------|
| `## ADDED Requirements` | Nuovo comportamento | Aggiunto alla specifica principale |
| `## MODIFIED Requirements` | Comportamento modificato | Sostituisce il requisito esistente |
| `## REMOVED Requirements` | Comportamento deprecato | Eliminato dalla specifica principale |

### Perché i delta invece di specifiche complete

**Chiarezza.** Un delta mostra esattamente cosa sta cambiando. Leggendo una specifica completa, dovresti confrontarla mentalmente con la versione corrente per notare le differenze.

**Evitare conflitti.** Due modifiche possono interessare lo stesso file di specifica senza entrare in conflitto, purché modifichino requisiti diversi.

**Efficienza nella revisione.** I revisori vedono la modifica, non il contesto invariato. Si concentrano su ciò che conta.

**Adattamento allo sviluppo brownfield.** La maggior parte del lavoro modifica comportamenti esistenti. I delta rendono le modifiche di prima classe, non un ripensamento.

## Schemi

Gli schemi definiscono i tipi di artefatti e le loro dipendenze per un flusso di lavoro.

### Come funzionano gli schemi

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Nessuna dipendenza, può essere creato per primo

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Necessita della proposta prima di essere creato

  - id: design
    generates: design.md
    requires: [proposal]      # Può essere creato in parallelo con le specifiche

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Necessita sia delle specifiche che del design prima di essere creato
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

**Le dipendenze sono abilitatori, non ostacoli.** Indicano cosa è possibile creare, non cosa devi creare subito dopo. Puoi saltare il design se non ti serve. Puoi creare le specifiche prima o dopo il design — entrambi dipendono solo dalla proposta.

### Schemi predefiniti

**spec-driven** (predefinito)

Il flusso di lavoro standard per lo sviluppo guidato da specifiche:

```
proposal → specs → design → tasks → implement
```

Ideale per: La maggior parte dei lavori sulle funzionalità in cui vuoi concordare le specifiche prima dell'implementazione.

### Schemi personalizzati

Crea schemi personalizzati per il flusso di lavoro del tuo team:

```bash
# Crea da zero
openspec schema init research-first

# Oppure biforca uno schema esistente
openspec schema fork spec-driven research-first
```

**Esempio di schema personalizzato:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Fai la ricerca per prima

  - id: proposal
    generates: proposal.md
    requires: [research]   # La proposta è basata sulla ricerca

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Salta specifiche/design, passa direttamente ai task
```

Vedi [Personalizzazione](customization.md) per tutti i dettagli sulla creazione e l'uso di schemi personalizzati.

## Archiviazione

L'archiviazione completa una modifica unendo le sue specifiche delta nelle specifiche principali e conservando la modifica per la cronologia.

### Cosa succede quando archivi

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
│       └── spec.md        # Ora include i requisiti per l'autenticazione a due fattori
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Conservato per la cronologia
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Il processo di archiviazione

1. **Unisci le delta.** Ogni sezione della specifica delta (ADDED/MODIFIED/REMOVED) viene applicata alla specifica principale corrispondente.
2. **Sposta nell'archivio.** La cartella della modifica viene spostata in `changes/archive/` con un prefisso di data per l'ordinamento cronologico.
3. **Conserva il contesto.** Tutti gli artefatti rimangono intatti nell'archivio. Puoi sempre consultarlo per capire perché è stata fatta una modifica.

### Perché l'archiviazione è importante

**Stato ordinato.** Le modifiche attive (`changes/`) mostrano solo il lavoro in corso. Il lavoro completato viene spostato fuori dal percorso di lavoro.

**Traccia di audit.** L'archivio conserva il contesto completo di ogni modifica: non solo cosa è cambiato, ma anche la proposta che spiega il perché, il design che spiega come e i task che mostrano il lavoro svolto.

**Evoluzione delle specifiche.** Le specifiche crescono organicamente man mano che le modifiche vengono archiviate. Ogni archiviazione unisce le sue delta, costruendo nel tempo una specifica completa.

## Come si integra il tutto

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FLUSSO DI OPENSPEC                              │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. AVVIA      │  /opsx:propose (core) or /opsx:new (expanded)           │
│   │     MODIFICA   │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREA       │  /opsx:ff or /opsx:continue (expanded workflow)         │
│   │     ARTEFATTI  │  Crea proposal → specs → design → tasks              │
│   │                │  (basato sulle dipendenze dello schema)                 │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENTA │  /opsx:apply                                            │
│   │     I TASK     │  Svolgi i task, spuntandoli man mano che sono completati │
│   │                │◄──── Aggiorna gli artefatti man mano che apprendi        │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFICA   │  /opsx:verify (optional)                                │
│   │     IL LAVORO  │  Verifica che l'implementazione corrisponda alle specifiche │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVIA   │────►│  Le specifiche delta si uniscono alle        │    │
│   │     LA MODIFICA│     │  specifiche principali                       │    │
│   │                │     │  La cartella delle modifiche viene spostata  │    │
│   │                │     │  in archive/                                 │    │
│   │                │     │  Le specifiche sono ora la fonte di verità    │    │
│   │                │     │  aggiornata                                  │    │
│   └────────────────┘     └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Il ciclo virtuoso:**

1. Le specifiche descrivono il comportamento corrente
2. Le modifiche propongono variazioni (sotto forma di delta)
3. L'implementazione rende le modifiche reali
4. L'archiviazione unisce le delta nelle specifiche
5. Le specifiche ora descrivono il nuovo comportamento
6. La modifica successiva si basa sulle specifiche aggiornate

## Glossario

| Termine | Definizione |
|------|------------|
| **Artefatto** | Un documento all'interno di una modifica (proposta, design, task o specifiche delta) |
| **Archiviazione** | Il processo di completamento di una modifica e unione delle sue delta nelle specifiche principali |
| **Modifica** | Una variazione proposta al sistema, impacchettata come una cartella con gli artefatti |
| **Specifica delta** | Una specifica che descrive le modifiche (ADDED/MODIFIED/REMOVED) rispetto alle specifiche correnti |
| **Dominio** | Un raggruppamento logico per le specifiche (es. `auth/`, `payments/`) |
| **Requisito** | Un comportamento specifico che il sistema deve avere |
| **Scenario** | Un esempio concreto di un requisito, tipicamente nel formato Given/When/Then |
| **Schema** | Una definizione dei tipi di artefatti e delle loro dipendenze |
| **Specifica** | Una specifica che descrive il comportamento del sistema, contenente requisiti e scenari |
| **Fonte di verità** | La directory `openspec/specs/`, che contiene il comportamento attualmente concordato |

## Passaggi successivi

- [Introduzione](getting-started.md) - Primi passaggi pratici
- [Flussi di lavoro](workflows.md) - Modelli comuni e quando usarne uno
- [Comandi](commands.md) - Riferimento completo dei comandi
- [Personalizzazione](customization.md) - Crea schemi personalizzati e configura il tuo progetto