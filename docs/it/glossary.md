# Glossario

Ogni termine di OpenSpec in un unico luogo, definito in linguaggio chiaro. Sbircia una volta e il resto della documentazione sarà più veloce da leggere.

I termini sono raggruppati per argomento e poi alfabetizzati all'interno di ciascun gruppo.

## I sostantivi fondamentali

**Spec.** Un documento che descrive come funziona una parte del tuo sistema. Le Specs risiedono in `openspec/specs/`, sono organizzate per dominio e sono composte da requisiti e scenari. La spec è la risposta concordata a "cosa fa questo software?". Vedi [Concetti](concepts.md#specs).

**Source of truth.** L'intero indice `openspec/specs/`. Contiene il comportamento attuale e concordato del tuo sistema. Le modifiche propongono delle edizioni; l'archiviazione le applica.

**Change.** Un'unità di lavoro, impacchettata come una cartella sotto `openspec/changes/<name>/`. Una change contiene tutto su quel lavoro: la sua proposta, il design, i compiti e le modifiche alla spec che introduce. Una change, una feature o un fix.

**Artifact.** Un documento all'interno di una change. Gli artifact standard sono la proposta, le delta specs, il design e i compiti. Sono creati in ordine di dipendenza e si alimentano a vicenda.

**Delta spec.** Una spec all'interno di una change che descrive solo cosa sta cambiando, utilizzando le sezioni `ADDED`, `MODIFIED` e `REMOVED`, anziché riassumere l'intera spec. Questo è ciò che permette a OpenSpec di modificare i sistemi esistenti in modo pulito. Vedi [Concetti](concepts.md#delta-specs).

**Domain.** Un raggruppamento logico per le specs, come `auth/`, `payments/` o `ui/`. Tu scegli i domini che corrispondono al tuo modo di pensare il sistema.

## All'interno di una spec

**Requirement.** Un singolo comportamento che il sistema deve avere, solitamente scritto con una parola chiave RFC 2119: "Il sistema SHALL scadere le sessioni dopo 30 minuti." I Requisiti stabiliscono il *cosa*, non il *come*.

**Scenario.** Un esempio concreto e testabile di un requisito in azione, tipicamente nel formato Given/When/Then. Gli scenari rendono verificabile un requisito: si potrebbe scrivere un test automatizzato da uno di essi.

**RFC 2119 keywords.** Le parole MUST, SHALL, SHOULD e MAY, che hanno un significato standardizzato riguardo a quanto sia rigoroso un requisito. MUST e SHALL sono assoluti. SHOULD è raccomandato con margine per eccezioni. MAY è facoltativo. Il nome deriva dal documento di standard internet che li ha definiti.

## Gli artifact

**Proposal (`proposal.md`).** Il *perché* e il *cosa* di una change: la sua intenzione, l'ambito e l'approccio ad alto livello. È il primo artifact da creare.

**Design (`design.md`).** Il *come*: approccio tecnico, decisioni architetturali e i file che ti aspetti di toccare. Opzionale per le modifiche semplici.

**Tasks (`tasks.md`).** La checklist di implementazione, con caselle di controllo. L'AI la percorre durante `/opsx:apply` e spunta gli elementi man mano che procede.

## Il ciclo di vita

**Archive.** L'atto di completare una change. Le sue delta specs vengono fuse nelle specs principali e la cartella della change viene spostata in `openspec/changes/archive/YYYY-MM-DD-<name>/`. Dopo l'archiviazione, le tue specs descrivono la nuova realtà. Vedi [Concetti](concepts.md#archive).

**Sync.** La fusione delle delta specs di una change nelle specs principali *senza* archiviare la change. Solitamente automatico (l'archivio offre di farlo), ma disponibile anche come `/opsx:sync` per le changes a lunga durata. Vedi [Comandi](commands.md#opsxsync).

## Workflow e comandi

**OPSX.** Il workflow standard attuale di OpenSpec, costruito attorno ad azioni fluide anziché fasi rigide. I suoi slash commands iniziano tutti con `/opsx:`. Vedi [Workflow OPSX](opsx.md).

**Slash command.** Un comando che digiti nel chat del tuo assistente AI, come `/opsx:propose`. I slash commands guidano il workflow. Non sono comandi da terminale. Vedi [Come funzionano i Comandi](how-commands-work.md).

**Explore (`/opsx:explore`).** Il comando "partner di pensiero". Legge la tua codebase, confronta le opzioni e chiarisce un'idea vaga in un piano concreto, senza creare artifact e senza scrivere codice. È il punto di partenza consigliato ogni volta che hai un problema ma non ancora un piano. Vedi [Esplora Prima](explore.md).

**CLI.** Il programma `openspec` che esegui nel tuo terminale. Configura i progetti, elenca e convalida le changes, apre la dashboard e archivia. È la metà da terminale di OpenSpec. Vedi [CLI](cli.md).

**Skill.** Una cartella di istruzioni (`.../skills/openspec-*/SKILL.md`) che il tuo assistente AI rileva automaticamente e segue. Le Skills sono lo standard emergente cross-tool per fornire il workflow di OpenSpec al tuo assistente.

**Command file.** Un file di slash command specifico per strumento (`.../commands/opsx-*`). Il meccanismo di consegna più vecchio, ancora supportato insieme alle skills. Raramente devi toccarli direttamente.

**Profile.** L'insieme dei slash commands installati nel tuo progetto. **Core** (il predefinito) include `propose`, `explore`, `apply`, `sync`, `archive`. L'insieme **expanded** aggiunge `new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`. Modificalo con `openspec config profile`.

**Delivery.** Se OpenSpec installa skills, file di comando o entrambi per i tuoi strumenti. Configurato globalmente e applicato con `openspec update`.

## Personalizzazione

**Schema.** La definizione degli artifact che un workflow ha e come dipendono l'uno dall'altro. Il predefinito integrato è `spec-driven` (proposal → specs → design → tasks). Puoi forcarlo o crearne uno tuo. Vedi [Personalizzazione](customization.md#custom-schemas).

**Template.** Un file Markdown all'interno di uno schema che modella ciò che l'AI genera per un dato artifact. Modificare un template cambia immediatamente l'output dell'AI, senza ricostruzione.

**Project config (`openspec/config.yaml`).** Impostazioni specifiche del progetto: lo schema predefinito, il `context:` iniettato in ogni richiesta di pianificazione e le `rules:` per ciascun artifact. Il modo più semplice per insegnare a OpenSpec la tua stack e le tue convenzioni. Vedi [Personalizzazione](customization.md#project-configuration).

**Context injection.** Mettere lo sfondo del progetto nel campo `context:` di `config.yaml` in modo che venga aggiunto automaticamente a ogni artifact generato dall'AI. È più affidabile che sperare che l'AI legga un file separato.

**Dependency graph.** Il grafo diretto formato dalle relazioni `requires:` degli artifact. È un DAG (grafo aciclico diretto: le frecce puntano solo in avanti, mai in un loop), e OpenSpec lo usa per sapere cosa puoi creare dopo.

**Enablers, not gates.** Il principio secondo cui le dipendenze degli artifact mostrano ciò che diventa *possibile* dopo, non ciò che è *richiesto* dopo. Puoi rivedere ed editare qualsiasi artifact in qualsiasi momento. Vedi [Concetti Fondamentali a Colpo d'Occhio](overview.md#enablers-not-gates).

## Coordinamento tra repository (beta)

Questi termini si applicano solo se la tua pianificazione copre più di un repo. Sono in beta. La maggior parte degli utenti può ignorarli. Vedi la [Guida per gli Store](stores-beta/user-guide.md).

**Store.** Un repo autonomo il cui unico compito è la pianificazione. Ha la stessa forma `openspec/` che già conosci (specs e changes) più un piccolo file di identità. Lo registri sulla tua macchina una volta, per nome, e quindi qualsiasi comando OpenSpec può funzionare al suo interno da qualsiasi luogo.

**Reference.** Una dichiarazione, nel `openspec/config.yaml` di un repo codice, di uno store su cui quel repo si basa. Le Reference sono in sola lettura: il repo mantiene la propria radice, e `openspec instructions` ottiene un indice delle specs dello store referenziato, ognuna con il comando esatto per recuperarla.

**Working context.** Ciò che `openspec context` assembla per il repository corrente: la sua root OpenSpec più ogni store che esso riferisce, ciascuno con le istruzioni su come recuperarlo. La risposta a "con cosa sto lavorando?".

**Workset.** Un insieme personale di cartelle locali che apri insieme (uno store accanto ai repo codice su cui lavori). Creato esplicitamente con `openspec workset create`; nulla di quei percorsi locali viene committato nel repository di pianificazione condiviso.

## Vedi anche

- [Concetti Fondamentali a Colpo d'Occhio](overview.md): le cinque idee, su una pagina
- [Concetti](concepts.md): la spiegazione estesa
- [Come funzionano i Comandi](how-commands-work.md): slash commands contro CLI