# Concetti

Questa guida spiega le idee fondamentali dietro OpenSpec e come si integrano tra loro. Per un utilizzo pratico, consulta [Iniziare](getting-started.md) e [Flussi di lavoro](workflows.md).

## Filosofia

OpenSpec è costruito attorno a quattro principi:

```
fluidità non rigidità        — nessuna fase di approvazione, lavora su ciò che ha senso
iterativo non a cascata      — impara mentre costruisci, affina lungo il percorso
semplicità non complessità   — configurazione leggera, minimalismo cerimoniale
prima il brownfield          — funziona con codebase esistenti, non solo con progetti greenfield
```

### Perché Questi Principi Sono Importanti

**Fluidità non rigidità.** I sistemi di specifiche tradizionali ti bloccano in fasi: prima pianifichi, poi implementi, poi hai finito. OpenSpec è più flessibile — puoi creare artefatti in qualsiasi ordine abbia senso per il tuo lavoro.

**Iterativo non a cascata.** I requisiti cambiano. La comprensione approfondisce. Ciò che sembrava un buon approccio all'inizio potrebbe non reggere dopo aver visto la codebase. OpenSpec abbraccia questa realtà.

**Semplicità non complessità.** Alcuni framework di specifiche richiedono configurazioni estese, formati rigidi o processi pesanti. OpenSpec non ti ostacola. Inizializza in pochi secondi, inizia a lavorare immediatamente, personalizza solo se necessario.

**Prima il brownfield.** La maggior parte del lavoro software non consiste nel costruire da zero — è modificare sistemi esistenti. L'approccio basato su delta di OpenSpec rende facile specificare modifiche al comportamento esistente, non solo descrivere nuovi sistemi.

## Il Quadro Generale

OpenSpec organizza il tuo lavoro in due aree principali:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Fonte di verità    │◄─────│  Modifiche proposte           │   │
│   │  Come il tuo sistema│ merge│  Ogni modifica = una cartella │   │
│   │  funziona attualmente│     │  Contiene artefatti + delta   │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Le Specifiche** sono la fonte di verità — descrivono come si comporta attualmente il tuo sistema.

**Le Modifiche** sono modifiche proposte — risiedono in cartelle separate finché non sei pronto a unirle.

Questa separazione è fondamentale. Puoi lavorare su più modifiche in parallelo senza conflitti. Puoi esaminare una modifica prima che influenzi le specifiche principali. E quando archivi una modifica, i suoi delta si fondono pulitamente nella fonte di verità.

## Specifiche

Le specifiche descrivono il comportamento del tuo sistema utilizzando requisiti e scenari strutturati.

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

Organizza le specifiche per dominio — raggruppamenti logici che hanno senso per il tuo sistema. Modelli comuni:

- **Per area funzionale**: `auth/`, `payments/`, `search/`
- **Per componente**: `api/`, `frontend/`, `workers/`
- **Per contesto delimitato**: `ordering/`, `fulfillment/`, `inventory/`

### Formato della Specifica

Una specifica contiene requisiti, e ogni requisito ha scenari:

```markdown
# Specifica dell'Autenticazione

## Scopo
Autenticazione e gestione delle sessioni per l'applicazione.

## Requisiti

### Requisito: Autenticazione Utente
Il sistema DEVE emettere un token JWT al login riuscito.

#### Scenario: Credenziali valide
- DATO un utente con credenziali valide
- QUANDO l'utente invia il modulo di login
- ALLORA viene restituito un token JWT
- E l'utente viene reindirizzato alla dashboard

#### Scenario: Credenziali non valide
- DATO credenziali non valide
- QUANDO l'utente invia il modulo di login
- ALLORA viene visualizzato un messaggio di errore
- E non viene emesso alcun token

### Requisito: Scadenza della Sessione
Il sistema DEVE far scadere le sessioni dopo 30 minuti di inattività.

#### Scenario: Timeout per inattività
- DATO una sessione autenticata
- QUANDO passano 30 minuti senza attività
- ALLORA la sessione viene invalidata
- E l'utente deve autenticarsi nuovamente
```

**Elementi chiave:**

| Elemento | Scopo |
|----------|-------|
| `## Scopo` | Descrizione di alto livello del dominio di questa specifica |
| `### Requisito:` | Un comportamento specifico che il sistema deve avere |
| `#### Scenario:` | Un esempio concreto del requisito in azione |
| DEVE/PUÒ/DOVREBBE | Parole chiave RFC 2119 che indicano la forza del requisito |

### Perché Strutturare le Specifiche in Questo Modo

**I requisiti sono il "cosa"** — affermano cosa il sistema dovrebbe fare senza specificare l'implementazione.

**Gli scenari sono il "quando"** — forniscono esempi concreti che possono essere verificati. Buoni scenari:
- Sono testabili (potresti scrivere un test automatico per loro)
- Coprono sia il percorso felice che i casi limite
- Usano un formato strutturato tipo Dato/Quando/Allora o simile

**Le parole chiave RFC 2119** (DEVE, PUÒ, DOVREBBE) comunicano l'intento:
- **DEVE** — requisito assoluto
- **DOVREBBE** — raccomandato, ma esistono eccezioni
- **PUÒ** — opzionale

### Cosa È (e Cosa Non È) una Specifica

Una specifica è un **contratto comportamentale**, non un piano di implementazione.

Buon contenuto della specifica:
- Comportamento osservabile su cui si basano gli utenti o i sistemi a valle
- Input, output e condizioni di errore
- Vincoli esterni (sicurezza, privacy, affidabilità, compatibilità)
- Scenari che possono essere testati o validati esplicitamente

Evitare nelle specifiche:
- Nomi interni di classi/funzioni
- Scelte di librerie o framework
- Dettagli di implementazione passo-passo
- Piani di esecuzione dettagliati (quelli appartengono a `design.md` o `tasks.md`)

Test rapido:
- Se l'implementazione può cambiare senza modificare il comportamento visibile esternamente, probabilmente non appartiene alla specifica.

### Mantienila Leggera: Rigore Progressivo

OpenSpec mira a evitare la burocrazia. Usa il livello più leggero che renda comunque verificabile la modifica.

**Spec leggera (predefinita):**
- Requisiti brevi orientati al comportamento
- Ambizione e non-obiettivi chiari
- Alcuni controlli di accettazione concreti

**Spec completa (per rischi più elevati):**
- Modifiche tra team o tra repository
- Modifiche a API/contratti, migrazioni, problemi di sicurezza/privacy
- Modifiche dove l'ambiguità potrebbe causare costose revisioni

La maggior parte delle modifiche dovrebbe rimanere in modalità leggera.

### Collaborazione Umano + Agente

In molti team, gli umani esplorano e gli agenti redigono artefatti. Il ciclo previsto è:

1. L'umano fornisce intento, contesto e vincoli.
2. L'agente converte questo in requisiti orientati al comportamento e scenari.
3. L'agente mantiene i dettagli di implementazione in `design.md` e `tasks.md`, non in `spec.md`.
4. La validazione conferma struttura e chiarezza prima dell'implementazione.

Questo mantiene le specifiche leggibili per gli umani e coerenti per gli agenti.

## Modifiche

Una modifica è una modifica proposta al tuo sistema, confezionata come una cartella con tutto il necessario per comprenderla e implementarla.

### Struttura della Modifica

```
openspec/changes/add-dark-mode/
├── proposal.md           # Perché e cosa
├── design.md             # Come (approccio tecnico)
├── tasks.md              # Elenco di controllo dell'implementazione
├── .openspec.yaml        # Metadati della modifica (opzionale)
└── specs/                # Specifiche delta
    └── ui/
        └── spec.md       # Cosa cambia in ui/spec.md
```

Ogni modifica è autocontenuta. Ha:
- **Artefatti** — documenti che catturano intento, design e attività
- **Specifiche delta** — specifiche per ciò che viene aggiunto, modificato o rimosso
- **Metadati** — configurazione opzionale per questa specifica modifica

### Perché le Modifiche Sono Cartelle

Confezionare una modifica come cartella ha diversi vantaggi:

1. **Tutto insieme.** Proposta, design, attività e specifiche vivono in un unico posto. Nessuna ricerca in luoghi diversi.

2. **Lavoro parallelo.** Più modifiche possono esistere contemporaneamente senza conflitti. Lavora su `add-dark-mode` mentre anche `fix-auth-bug` è in corso.

3. **Cronologia pulita.** Quando archiviate, le modifiche si spostano in `changes/archive/` con il loro contesto completo preservato. Puoi guardare indietro e capire non solo cosa è cambiato, ma perché.

4. **Facile da revisionare.** Una cartella di modifica è facile da revisionare — aprila, leggi la proposta, controlla il design, guarda i delta delle specifiche.

## Artefatti

Gli artefatti sono i documenti all'interno di una modifica che guidano il lavoro.

### Il Flusso degli Artefatti

```
proposta ──────► specifiche ──────► design ──────► attività ──────► implementa
    │               │             │              │
   perché         cosa          come          passi
 + ambito       cambia       approccio     da seguire
```

Gli artefatti si basano l'uno sull'altro. Ogni artefatto fornisce contesto per il successivo.

### Tipi di Artefatti

#### Proposta (`proposal.md`)

La proposta cattura **l'intento**, **l'ambito** e **l'approccio** ad alto livello.

```markdown
# Proposta: Aggiungere la Modalità Scura

## Intento
Gli utenti hanno richiesto un'opzione di modalità scura per ridurre l'affaticamento visivo
durante l'uso notturno e per abbinare le preferenze di sistema.

## Ambito
In ambito:
- Attivazione/disattivazione del tema nelle impostazioni
- Rilevamento delle preferenze di sistema
- Persistenza della preferenza in localStorage

Fuori ambito:
- Temi di colori personalizzati (lavoro futuro)
- Sovrascritture del tema per pagina

## Approccio
Usare le proprietà CSS personalizzate per il tema con un contesto React
per la gestione dello stato. Rilevare la preferenza di sistema al primo caricamento,
consentire la sovrascrittura manuale.
```

**Quando aggiornare la proposta:**
- L'ambito cambia (si restringe o si espande)
- L'intento si chiarisce (migliore comprensione del problema)
- L'approccio cambia fondamentalmente

#### Specifiche (specifiche delta in `specs/`)

Le specifiche delta descrivono **cosa cambia** rispetto alle specifiche attuali. Vedi [Specifiche Delta](#delta-specs) qui sotto.

#### Design (`design.md`)

Il design cattura **l'approccio tecnico** e le **decisioni architetturali**.

````markdown
# Design: Aggiungere la Modalità Scura

## Approccio Tecnico
Stato del tema gestito tramite React Context per evitare il prop drilling.
Le proprietà CSS personalizzate abilitano il commutazione a runtime senza toggle di classi.

## Decisioni Architetturali

### Decisione: Contesto rispetto a Redux
Utilizzo di React Context per lo stato del tema perché:
- Stato binario semplice (chiaro/scuro)
- Nessuna transizione di stato complessa
- Evita l'aggiunta della dipendenza da Redux

### Decisione: Proprietà CSS personalizzate
Utilizzo di variabili CSS invece di CSS-in-JS perché:
- Funziona con il foglio di stile esistente
- Nessun sovraccarico a runtime
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

## Modifiche ai file
- `src/contexts/ThemeContext.tsx` (nuovo)
- `src/components/ThemeToggle.tsx` (nuovo)
- `src/styles/globals.css` (modificato)
````

**Quando aggiornare il design:**
- L'implementazione rivela che l'approccio non funziona
- Viene scoperta una soluzione migliore
- Le dipendenze o i vincoli cambiano

#### Attività (`tasks.md`)

Le attività sono la **checklist di implementazione** — passi concreti con caselle di controllo.

```markdown
# Attività

## 1. Infrastruttura del Tema
- [ ] 1.1 Creare ThemeContext con stato chiaro/scuro
- [ ] 1.2 Aggiungere proprietà CSS personalizzate per i colori
- [ ] 1.3 Implementare la persistenza in localStorage
- [ ] 1.4 Aggiungere il rilevamento delle preferenze di sistema

## 2. Componenti UI
- [ ] 2.1 Creare il componente ThemeToggle
- [ ] 2.2 Aggiungere il toggle alla pagina delle impostazioni
- [ ] 2.3 Aggiornare l'Header per includere il toggle rapido

## 3. Styling
- [ ] 3.1 Definire la tavolozza colori del tema scuro
- [ ] 3.2 Aggiornare i componenti per usare le variabili CSS
- [ ] 3.3 Testare i rapporti di contrasto per l'accessibilità
```

**Migliori pratiche per le attività:**
- Raggruppare le attività correlate sotto intestazioni
- Usare una numerazione gerarchica (1.1, 1.2, ecc.)
- Mantenere le attività sufficientemente piccole da completare in una sessione
- Spuntare le attività man mano che vengono completate

## Delta Spec

Le delta spec sono il concetto chiave che rende OpenSpec adatto allo sviluppo su sistemi esistenti. Descrivono **cosa sta cambiando** invece di ripetere l'intera specifica.

### Il Formato

```markdown
# Delta per Auth

## REQUISITI AGGIUNTI

### Requisito: Autenticazione a Due Fattori
Il sistema DEVE supportare l'autenticazione a due fattori basata su TOTP.

#### Scenario: Registrazione 2FA
- DATO un utente senza 2FA abilitato
- QUANDO l'utente abilita le 2FA nelle impostazioni
- ALLORA viene visualizzato un codice QR per la configurazione dell'app di autenticazione
- E l'utente deve verificare con un codice prima dell'attivazione

#### Scenario: Login 2FA
- DATO un utente con 2FA abilitato
- QUANDO l'utente inserisce credenziali valide
- ALLORA viene presentata una sfida OTP
- E il login si completa solo dopo un OTP valido

## REQUISITI MODIFICATI

### Requisito: Scadenza della Sessione
Il sistema DEVE far scadere le sessioni dopo 15 minuti di inattività.
(Precedentemente: 30 minuti)

#### Scenario: Timeout per inattività
- DATO una sessione autenticata
- QUANDO passano 15 minuti senza attività
- ALLORA la sessione viene invalidata

## REQUISITI RIMOSSI

### Requisito: Ricordami
(Deprecato a favore delle 2FA. Gli utenti dovrebbero autenticarsi nuovamente per ogni sessione.)
```

### Sezioni delle Delta

| Sezione | Significato | Cosa succede all'archiviazione |
|---------|-------------|--------------------------------|
| `## REQUISITI AGGIUNTI` | Nuovo comportamento | Aggiunto alla specifica principale |
| `## REQUISITI MODIFICATI` | Comportamento cambiato | Sostituisce il requisito esistente |
| `## REQUISITI RIMOSSI` | Comportamento deprecato | Eliminato dalla specifica principale |

### Perché le Delta invece delle Specifiche Complete

**Chiarezza.** Una delta mostra esattamente cosa sta cambiando. Leggendo una specifica completa, dovresti fare mentalmente un confronto con la versione attuale.

**Evitare conflitti.** Due modifiche possono toccare lo stesso file di specifica senza entrare in conflitto, purché modifichino requisiti diversi.

**Efficienza della revisione.** I revisori vedono la modifica, non il contesto invariato. Si concentra su ciò che conta.

**Adattabilità ai sistemi esistenti.** La maggior parte del lavoro modifica il comportamento esistente. Le delta rendono le modifiche un concetto di prima classe, non un ripensamento.

## Schemi

Gli schemi definiscono i tipi di artefatto e le loro dipendenze per un flusso di lavoro.

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
    requires: [specs, design] # Necessita prima sia delle specifiche che del design
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

**Le dipendenze sono abilitatori, non cancelli.** Mostrano cosa è possibile creare, non cosa devi creare successivamente. Puoi saltare il design se non ne hai bisogno. Puoi creare le specifiche prima o dopo il design — entrambi dipendono solo dalla proposta.

### Schemi Integrati

**spec-driven** (predefinito)

Il flusso di lavoro standard per lo sviluppo guidato dalle specifiche:

```
proposal → specs → design → tasks → implement
```

Ideale per: La maggior parte del lavoro sulle funzionalità dove si vuole concordare le specifiche prima dell'implementazione.

### Schemi Personalizzati

Crea schemi personalizzati per il flusso di lavoro del tuo team:

```bash
# Creare da zero
openspec schema init research-first

# O creare un fork di uno esistente
openspec schema fork spec-driven research-first
```

**Esempio di schema personalizzato:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Fare prima la ricerca

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposta informata dalla ricerca

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Saltare specifiche/design, andare direttamente alle attività
```

Vedi [Personalizzazione](customization.md) per i dettagli completi sulla creazione e l'uso di schemi personalizzati.

## Archiviazione

L'archiviazione completa una modifica fondendo le sue delta spec nelle specifiche principali e preservando la modifica per la cronologia.

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
│       └── spec.md        # Ora include i requisiti 2FA
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

1. **Unire le delta.** Ogni sezione della delta spec (AGGIUNTI/MODIFICATI/RIMOSSI) viene applicata alla corrispondente specifica principale.

2. **Spostare nell'archivio.** La cartella della modifica viene spostata in `changes/archive/` con un prefisso di data per l'ordinamento cronologico.

3. **Preservare il contesto.** Tutti gli artefatti rimangono intatti nell'archivio. Puoi sempre tornare indietro per capire perché è stata fatta una modifica.

### Perché l'Archiviazione è Importante

**Stato pulito.** Le modifiche attive (`changes/`) mostrano solo il lavoro in corso. Il lavoro completato si sposta fuori dalla strada.

**Traccia di audit.** L'archivio preserva il contesto completo di ogni modifica — non solo cosa è cambiato, ma la proposta che spiega perché, il design che spiega come e le attività che mostrano il lavoro svolto.

**Evoluzione delle specifiche.** Le specifiche crescono organicamente man mano che le modifiche vengono archiviate. Ogni archiviazione unisce le sue delta, costruendo nel tempo una specifica completa.

## Come Tutto Si Insieme

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FLUSSO OPENSPEC                                 │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. AVVIA      │  /opsx:propose (core) o /opsx:new (expanded)           │
│   │     MODIFICA   │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREA       │  /opsx:ff o /opsx:continue (flusso di lavoro expanded) │
│   │     ARTEFATTI  │  Crea proposal → specs → design → tasks                │
│   │                │  (basato sulle dipendenze dello schema)                 │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENTA │  /opsx:apply                                            │
│   │     ATTIVITÀ   │  Lavora sulle attività, spuntandole                    │
│   │                │◄──── Aggiorna gli artefatti man mano che impari         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFICA   │  /opsx:verify (opzionale)                              │
│   │     IL LAVORO  │  Controlla che l'implementazione corrisponda alle spec │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVIA   │────►│  Le delta spec si fondono nelle spec principali│    │
│   │     LA MODIFICA│     │  La cartella della modifica si sposta in archive/│    │
│   └────────────────┘     │  Le spec sono ora la fonte di verità aggiornata│    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Il ciclo virtuoso:**

1. Le specifiche descrivono il comportamento attuale
2. Le modifiche propongono alterazioni (come delta)
3. L'implementazione rende le modifiche reali
4. L'archiviazione fonde le delta nelle specifiche
5. Le specifiche ora descrivono il nuovo comportamento
6. La prossima modifica si basa sulle specifiche aggiornate

## Glossario

| Termine | Definizione |
|---------|-------------|
| **Artifact** | Un documento all'interno di una modifica (proposta, design, task o specifiche delta) |
| **Archiviazione** | Il processo di completamento di una modifica e unione delle sue delta nelle specifiche principali |
| **Modifica** | Una proposta di modifica al sistema, confezionata come cartella con artifact |
| **Specifica delta** | Una specifica che descrive modifiche (AGGIUNTA/MODIFICATA/RIMOSSA) rispetto alle specifiche attuali |
| **Dominio** | Un raggruppamento logico per le specifiche (es. `auth/`, `payments/`) |
| **Requisito** | Un comportamento specifico che il sistema deve avere |
| **Scenario** | Un esempio concreto di un requisito, tipicamente nel formato Dato/Quando/Allora |
| **Schema** | Una definizione dei tipi di artifact e delle loro dipendenze |
| **Specifica** | Una descrizione del comportamento del sistema, contenente requisiti e scenari |
| **Fonte della verità** | La directory `openspec/specs/`, contenente il comportamento attualmente concordato |

## Prossimi passi

- [Per iniziare](getting-started.md) - Primi passi pratici
- [Flussi di lavoro](workflows.md) - Pattern comuni e quando usarli
- [Comandi](commands.md) - Riferimento completo dei comandi
- [Personalizzazione](customization.md) - Crea schemi personalizzati e configura il tuo progetto