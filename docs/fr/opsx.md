# Workflow OPSX

> Retours bienvenus sur [Discord](https://discord.gg/YctCnvvshC).

## Qu'est-ce que c'est ?

OPSX est désormais le workflow standard pour OpenSpec.

C'est un **workflow fluide et itératif** pour les modifications d'OpenSpec. Fini les phases rigides — juste des actions que vous pouvez entreprendre à tout moment.

## Pourquoi cela existe

Le workflow OpenSpec historique fonctionne, mais il est **verrouillé** :

- **Les instructions sont codées en dur** — enfouies dans TypeScript, vous ne pouvez pas les modifier
- **Tout ou rien** — une seule grande commande crée tout, impossible de tester des pièces individuelles
- **Structure fixe** — même workflow pour tout le monde, aucune personnalisation
- **Boîte noire** — lorsque la sortie de l'IA est mauvaise, vous ne pouvez pas ajuster les prompts

**OPSX l'ouvre.** Maintenant, n'importe qui peut :

1. **Expérimenter avec les instructions** — modifier un modèle, voir si l'IA fait mieux
2. **Tester de manière granulaire** — valider les instructions de chaque artefact indépendamment
3. **Personnaliser les workflows** — définir vos propres artefacts et dépendances
4. **Itérer rapidement** — changer un modèle, tester immédiatement, sans reconstruction

```
Workflow historique :                   OPSX :
┌────────────────────────┐           ┌────────────────────────┐
│  Codé en dur dans le   │           │  schema.yaml           │◄── Vous modifiez ceci
│  paquet (modif.        │           │  templates/*.md        │◄── Ou ceci
│  impossible)           │           │        ↓               │
│        ↓               │           │  Effet instantané      │
│  Attendre une nouvelle │           │        ↓               │
│  version               │           │  Testez-le vous-même   │
│        ↓               │           │                        │
│  Espérer que c'est     │           │                        │
│  mieux                 │           │                        │
└────────────────────────┘           └────────────────────────┘
```

**C'est pour tout le monde :**
- **Équipes** — créez des workflows qui correspondent à votre façon de travailler réellement
- **Utilisateurs avancés** — ajustez les prompts pour obtenir de meilleures sorties IA pour votre codebase
- **Contributeurs OpenSpec** — expérimentez de nouvelles approches sans versions

Nous apprenons tous encore ce qui fonctionne le mieux. OPSX nous permet d'apprendre ensemble.

## L'expérience utilisateur

**Le problème des workflows linéaires :**
Vous êtes "en phase de planification", puis "en phase d'implémentation", puis "terminé". Mais le travail réel ne fonctionne pas ainsi. Vous implémentez quelque chose, réalisez que votre conception était fausse, devez mettre à jour les spécifications, continuer l'implémentation. Les phases linéaires s'opposent à la façon dont le travail se déroule réellement.

**L'approche OPSX :**
- **Actions, pas phases** — créer, implémenter, mettre à jour, archiver — faites n'importe laquelle à tout moment
- **Les dépendances sont des facilitateurs** — elles montrent ce qui est possible, pas ce qui est requis ensuite

```
  proposition ──→ spécifications ──→ conception ──→ tâches ──→ implémentation
```

## Configuration

```bash
# Assurez-vous qu'openspec est installé — les compétences sont générées automatiquement
openspec init
```

Cela crée des compétences dans `.claude/skills/` (ou équivalent) que les assistants de codage IA détectent automatiquement.

Par défaut, OpenSpec utilise le profil de workflow `core` (`propose`, `explore`, `apply`, `sync`, `archive`). Si vous souhaitez les commandes de workflow étendues (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`), configurez-les avec `openspec config profile` et appliquez avec `openspec update`.

Pendant la configuration, vous serez invité à créer une **configuration de projet** (`openspec/config.yaml`). C'est optionnel mais recommandé.

## Configuration du projet

La configuration du projet vous permet de définir des valeurs par défaut et d'injecter un contexte spécifique au projet dans tous les artefacts.

### Création de la configuration

La configuration est créée lors de `openspec init`, ou manuellement :

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Stack technique : TypeScript, React, Node.js
  Conventions API : RESTful, réponses JSON
  Tests : Vitest pour les tests unitaires, Playwright pour les e2e
  Style : ESLint avec Prettier, TypeScript strict

rules:
  proposal:
    - Inclure un plan de rollback
    - Identifier les équipes affectées
  specs:
    - Utiliser le format Given/When/Then pour les scénarios
  design:
    - Inclure des diagrammes de séquence pour les flux complexes
```

### Champs de configuration

| Champ | Type | Description |
|-------|------|-------------|
| `schema` | string | Schéma par défaut pour les nouvelles modifications (ex. `spec-driven`) |
| `context` | string | Contexte du projet injecté dans les instructions de tous les artefacts |
| `rules` | object | Règles par artefact, indexées par ID d'artefact |

### Comment ça fonctionne

**Précédence du schéma** (du plus élevé au plus bas) :
1. Indicateur CLI (`--schema <nom>`)
2. Métadonnées de modification (`.openspec.yaml` dans le répertoire de modification)
3. Configuration du projet (`openspec/config.yaml`)
4. Par défaut (`spec-driven`)

**Injection de contexte :**
- Le contexte est préfixé aux instructions de chaque artefact
- Enveloppé dans des balises `<context>...</context>`
- Aide l'IA à comprendre les conventions de votre projet

**Injection de règles :**
- Les règles ne sont injectées que pour les artefacts correspondants
- Enveloppées dans des balises `<rules>...</rules>`
- Apparaissent après le contexte, avant le modèle

### IDs d'artefacts par schéma

**spec-driven** (par défaut) :
- `proposal` — Proposition de modification
- `specs` — Spécifications
- `design` — Conception technique
- `tasks` — Tâches d'implémentation

### Validation de la configuration

- Les IDs d'artefacts inconnus dans `rules` génèrent des avertissements
- Les noms de schémas sont validés par rapport aux schémas disponibles
- Le contexte a une limite de taille de 50 Ko
- Le YAML invalide est signalé avec les numéros de ligne

### Dépannage

**"ID d'artefact inconnu dans les règles : X"**
- Vérifiez que les IDs d'artefacts correspondent à votre schéma (voir la liste ci-dessus)
- Exécutez `openspec schemas --json` pour voir les IDs d'artefacts pour chaque schéma

**La configuration n'est pas appliquée :**
- Assurez-vous que le fichier est à `openspec/config.yaml` (pas `.yml`)
- Vérifiez la syntaxe YAML avec un validateur
- Les modifications de configuration prennent effet immédiatement (pas de redémarrage nécessaire)

**Contexte trop volumineux :**
- Le contexte est limité à 50 Ko
- Résumez ou liez à des documents externes à la place

## Commandes

| Commande | Ce qu'elle fait |
|----------|-----------------|
| `/opsx:propose` | Crée une modification et génère les artefacts de planification en une seule étape (chemin rapide par défaut) |
| `/opsx:explore` | Réfléchir à des idées, investiguer des problèmes, clarifier les exigences |
| `/opsx:new` | Démarrer un nouvel échafaudage de modification (workflow étendu) |
| `/opsx:continue` | Créer l'artefact suivant (workflow étendu) |
| `/opsx:ff` | Avancer rapidement les artefacts de planification (workflow étendu) |
| `/opsx:apply` | Implémenter les tâches, en mettant à jour les artefacts si nécessaire |
| `/opsx:verify` | Valider l'implémentation par rapport aux artefacts (workflow étendu) |
| `/opsx:sync` | Synchroniser les spécifications delta vers le principal (workflow par défaut, optionnel) |
| `/opsx:archive` | Archiver lorsque c'est terminé |
| `/opsx:bulk-archive` | Archiver plusieurs modifications terminées (workflow étendu) |
| `/opsx:onboard` | Visite guidée d'une modification de bout en bout (workflow étendu) |

## Utilisation

### Explorer une idée
```
/opsx:explore
```
Réfléchir à des idées, investiguer des problèmes, comparer des options. Aucune structure requise — juste un partenaire de réflexion. Lorsque les idées se cristallisent, passez à `/opsx:propose` (par défaut) ou `/opsx:new`/`/opsx:ff` (étendu).

### Démarrer une nouvelle modification
```
/opsx:propose
```
Crée la modification et génère les artefacts de planification nécessaires avant l'implémentation.

Si vous avez activé les workflows étendus, vous pouvez plutôt utiliser :

```text
/opsx:new        # échafaudage uniquement
/opsx:continue   # créer un artefact à la fois
/opsx:ff         # créer tous les artefacts de planification à la fois
```

### Créer des artefacts
```
/opsx:continue
```
Montre ce qui est prêt à être créé en fonction des dépendances, puis crée un artefact. Utilisez-le de manière répétée pour construire votre modification de manière incrémentale.

```
/opsx:ff add-dark-mode
```
Crée tous les artefacts de planification à la fois. À utiliser lorsque vous avez une image claire de ce que vous construisez.

### Implémenter (la partie fluide)
```
/opsx:apply
```
Travaille à travers les tâches, les cochant au fur et à mesure. Si vous jonglez avec plusieurs modifications, vous pouvez exécuter `/opsx:apply <nom>` ; sinon, il devrait déduire de la conversation et vous demander de choisir s'il ne peut pas déterminer.

### Terminer
```
/opsx:archive   # Déplacer vers l'archive lorsque c'est terminé (demande de synchroniser les spécifications si nécessaire)
```

## Quand mettre à jour vs. recommencer

Vous pouvez toujours modifier votre proposition ou vos spécifications avant l'implémentation. Mais quand est-ce que le raffinement devient "c'est un travail différent" ?

### Ce qu'une proposition capture

Une proposition définit trois choses :
1. **Intention** — Quel problème résolvez-vous ?
2. **Périmètre** — Qu'est-ce qui est dedans/dehors ?
3. **Approche** — Comment allez-vous le résoudre ?

La question est : lequel a changé, et de combien ?

### Mettre à jour la modification existante lorsque :

**Même intention, exécution raffinée**
- Vous découvrez des cas limites que vous n'aviez pas considérés
- L'approche a besoin d'ajustements mais l'objectif est inchangé
- L'implémentation révèle que la conception était légèrement décalée

**Le périmètre se réduit**
- Vous réalisez que le périmètre complet est trop grand, vous voulez livrer le MVP d'abord
- "Ajouter le mode sombre" → "Ajouter un interrupteur mode sombre (préférence système en v2)"

**Corrections guidées par l'apprentissage**
- La codebase n'est pas structurée comme vous le pensiez
- Une dépendance ne fonctionne pas comme prévu
- "Utiliser des variables CSS" → "Utiliser le préfixe dark: de Tailwind à la place"

### Démarrer une nouvelle modification lorsque :

**L'intention a fondamentalement changé**
- Le problème lui-même est différent maintenant
- "Ajouter le mode sombre" → "Ajouter un système de thème complet avec couleurs, polices, espacement personnalisés"

**Le périmètre a explosé**
- La modification a tellement grandi que c'est essentiellement un travail différent
- La proposition originale serait méconnaissable après les mises à jour
- "Corriger le bug de connexion" → "Réécrire le système d'authentification"

**L'original est completable**
- La modification originale peut être marquée "terminée"
- Le nouveau travail se suffit à lui-même, ce n'est pas un raffinement
- Terminer "Ajouter le MVP du mode sombre" → Archiver → Nouvelle modification "Améliorer le mode sombre"

### Les heuristiques

```
                        ┌─────────────────────────────────────┐
                        │     Est-ce le même travail ?        │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Même intention ?   >50% de chevauchement ? L'original peut-il
             Même problème ?    Même périmètre ?       être "terminé" sans
                    │                  │                ces modifications ?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         OUI               NON OUI          NON NON             OUI
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       MISE À JOUR       NOUVEAU MISE À JOUR NOUVEAU MISE À JOUR NOUVEAU
```

| Test | Mise à jour | Nouvelle modification |
|------|-------------|----------------------|
| **Identité** | "La même chose, raffinée" | "Un travail différent" |
| **Chevauchement de périmètre** | >50% de chevauchement | <50% de chevauchement |
| **Achèvement** | Ne peut pas être "terminé" sans modifications | Peut terminer l'original, le nouveau travail se suffit à lui-même |
| **Histoire** | La chaîne de mises à jour raconte une histoire cohérente | Les correctifs confondraient plus qu'ils ne clarifieraient |

### Le principe

> **La mise à jour préserve le contexte. La nouvelle modification apporte de la clarté.**
>
> Choisissez la mise à jour lorsque l'historique de votre réflexion est précieux.
> Choisissez le nouveau lorsque recommencer serait plus clair que de corriger.

Pensez-y comme des branches git :
- Continuez à commiter tant que vous travaillez sur la même fonctionnalité
- Démarrez une nouvelle branche lorsque c'est un travail véritablement nouveau
- Parfois, fusionnez une fonctionnalité partielle et recommencez pour la phase 2

## Quelles sont les différences ?

| | Legacy (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Structure** | Un unique document de proposition volumineux | Artefacts discrets avec dépendances |
| **Flux de travail** | Phases linéaires : plan → implémentation → archivage | Actions fluides — tout faire à tout moment |
| **Itération** | Difficile de revenir en arrière | Mettre à jour les artefacts au fil de l'apprentissage |
| **Personnalisation** | Structure fixe | Pilotée par schéma (définir vos propres artefacts) |

**L'idée clé :** le travail n'est pas linéaire. OPSX cesse de prétendre qu'il l'est.

## Approfondissement de l'architecture

Cette section explique le fonctionnement interne d'OPSX et le compare au flux de travail existant.
Les exemples de cette section utilisent l'ensemble de commandes étendu (`new`, `continue`, etc.) ; les utilisateurs par défaut de `core` peuvent appliquer le même flux à `propose → apply → sync → archive`.

### Philosophie : Phases contre Actions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LEGACY WORKFLOW                                      │
│                    (Phase-Locked, All-or-Nothing)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │             │
│   │    PHASE     │      │    PHASE     │      │    PHASE     │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Creates ALL artifacts at once                                          │
│   • Can't go back to update specs during implementation                    │
│   • Phase gates enforce linear progression                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                            OPSX WORKFLOW                                     │
│                      (Fluid Actions, Iterative)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           ACTIONS (not phases)             │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              any order                     │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Create artifacts one at a time OR fast-forward                         │
│   • Update specs/design/tasks during implementation                        │
│   • Dependencies enable progress, phases don't exist                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Architecture des composants

Le **flux de travail existant** utilise des modèles codés en dur dans TypeScript :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      LEGACY WORKFLOW COMPONENTS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Hardcoded Templates (TypeScript strings)                                  │
│                    │                                                        │
│                    ▼                                                        │
│   Tool-specific configurators/adapters                                      │
│                    │                                                        │
│                    ▼                                                        │
│   Generated Command Files (.claude/commands/openspec/*.md)                  │
│                                                                             │
│   • Fixed structure, no artifact awareness                                  │
│   • Change requires code modification + rebuild                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** utilise des schémas externes et un moteur de graphe de dépendances :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OPSX COMPONENTS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Schema Definitions (YAML)                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Dependencies                     │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Glob patterns                    │   │
│   │      requires: [proposal]      ◄── Enables after proposal           │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Artifact Graph Engine                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Topological sort (dependency ordering)                           │   │
│   │  • State detection (filesystem existence)                           │   │
│   │  • Rich instruction generation (templates + context)                │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Skill Files (.claude/skills/openspec-*/SKILL.md)                          │
│                                                                             │
│   • Cross-editor compatible (Claude Code, Cursor, Windsurf)                 │
│   • Skills query CLI for structured data                                    │
│   • Fully customizable via schema files                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Modèle de graphe de dépendances

Les artefacts forment un graphe acyclique dirigé (DAG). Les dépendances sont des **activateurs**, pas des portes :

```
                              proposal
                             (root node)
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
                                  │
                                  ▼
                          ┌──────────────┐
                          │ APPLY PHASE  │
                          │ (requires:   │
                          │  tasks)      │
                          └──────────────┘
```

**Transitions d'état :**

```
   BLOCKED ────────────────► READY ────────────────► DONE
      │                        │                       │
   Missing                  All deps               File exists
   dependencies             are DONE               on filesystem
```

### Flux d'information

**Flux de travail existant** — l'agent reçoit des instructions statiques :

```
  User: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Static instructions:                   │
  │  • Create proposal.md                   │
  │  • Create tasks.md                      │
  │  • Create design.md                     │
  │  • Create specs/<capability>/spec.md    │
  │                                         │
  │  No awareness of what exists or         │
  │  dependencies between artifacts         │
  └─────────────────────────────────────────┘
           │
           ▼
  Agent creates ALL artifacts in one go
```

**OPSX** — l'agent interroge pour un contexte riche :

```
  User: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Step 1: Query current state                                             │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec status --change "add-auth" --json                      │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "artifacts": [                                                  │  │
  │  │      {"id": "proposal", "status": "done"},                         │  │
  │  │      {"id": "specs", "status": "ready"},      ◄── First ready      │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked", "missingDeps": ["specs"]}│  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Step 2: Get rich instructions for ready artifact                        │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec instructions specs --change "add-auth" --json          │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "template": "# Specification\n\n## ADDED Requirements...",      │  │
  │  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
  │  │    "unlocks": ["tasks"]                                            │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Step 3: Read dependencies → Create ONE artifact → Show what's unlocked  │
  └──────────────────────────────────────────────────────────────────────────┘
```

### Modèle d'itération

**Flux de travail existant** — itération maladroite :

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Wait, the design is wrong"
       │               │
       │               ├── Options:
       │               │   • Edit files manually (breaks context)
       │               │   • Abandon and start over
       │               │   • Push through and fix later
       │               │
       │               └── No official "go back" mechanism
       │
       └── Creates ALL artifacts at once
```

**OPSX** — itération naturelle :

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── "The design is wrong"
      │                │                  │
      │                │                  ▼
      │                │            Just edit design.md
      │                │            and continue!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply picks up
      │                │         where you left off
      │                │
      │                └── Creates ONE artifact, shows what's unlocked
      │
      └── Scaffolds change, waits for direction
```

### Schémas personnalisés

Créez des flux de travail personnalisés à l'aide des commandes de gestion de schémas :

```bash
# Créer un nouveau schéma à partir de zéro (interactif)
openspec schema init my-workflow

# Ou dupliquer un schéma existant comme point de départ
openspec schema fork spec-driven my-workflow

# Valider la structure de votre schéma
openspec schema validate my-workflow

# Voir d'où un schéma est résolu (utile pour le débogage)
openspec schema which my-workflow
```

Les schémas sont stockés dans `openspec/schemas/` (local au projet, contrôlé en version) ou `~/.local/share/openspec/schemas/` (global à l'utilisateur).

**Structure du schéma :**
```
openspec/schemas/research-first/
├── schema.yaml
└── templates/
    ├── research.md
    ├── proposal.md
    └── tasks.md
```

**Exemple de schema.yaml :**
```yaml
name: research-first
artifacts:
  - id: research        # Added before proposal
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Now depends on research

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**Graphe de dépendances :**
```
   research ──► proposal ──► tasks
```

### Résumé

| Aspect | Legacy | OPSX |
|--------|----------|------|
| **Templates** | TypeScript codé en dur | YAML + Markdown externes |
| **Dependencies** | Aucune (tout en une fois) | DAG avec tri topologique |
| **State** | Modèle mental basé sur les phases | Existence sur le système de fichiers |
| **Customization** | Modifier le code source, recompiler | Créer un fichier schema.yaml |
| **Iteration** | Verrouillé par phase | Fluide, modifier n'importe quoi |
| **Editor Support** | Configurateurs/adaptateurs spécifiques à l'outil | Répertoire de compétences unique |

## Schémas

Les schémas définissent quels artefacts existent et leurs dépendances. Actuellement disponibles :

- **spec-driven** (par défaut) : proposition → spécifications → conception → tâches

```bash
# List available schemas
openspec schemas

# See all schemas with their resolution sources
openspec schema which --all

# Create a new schema interactively
openspec schema init my-workflow

# Fork an existing schema for customization
openspec schema fork spec-driven my-workflow

# Validate schema structure before use
openspec schema validate my-workflow
```

## Conseils

- Utilisez `/opsx:explore` pour réfléchir à une idée avant de vous engager dans un changement
- `/opsx:ff` quand vous savez ce que vous voulez, `/opsx:continue` quand vous explorez
- Pendant `/opsx:apply`, si quelque chose ne va pas — corrigez l'artefact, puis continuez
- Les tâches suivent la progression via des cases à cocher dans `tasks.md`
- Vérifiez le statut à tout moment : `openspec status --change "nom"`

## Retour d'information

C'est une ébauche. C'est intentionnel — nous apprenons ce qui fonctionne.

Vous avez trouvé un bug ? Vous avez des idées ? Rejoignez-nous sur [Discord](https://discord.gg/YctCnvvshC) ou ouvrez une issue sur [GitHub](https://github.com/Fission-AI/openspec/issues).