# OPSX Workflow

> Vos retours sont les bienvenus sur [Discord](https://discord.gg/YctCnvvshC).

## Qu'est-ce que c'est ?

OPSX est désormais le flux de travail standard pour OpenSpec.

Il s'agit d'un **flux de travail fluide et itératif** pour les modifications OpenSpec. Fini les phases rigides — vous pouvez effectuer des actions à tout moment.

## Pourquoi cela existe

Le flux de travail OpenSpec hérité fonctionne, mais il est **verrouillé** :

- **Les instructions sont codées en dur** — enfouies dans TypeScript, vous ne pouvez pas les modifier
- **Tout ou rien** — une seule commande importante crée tout, impossible de tester des éléments individuels
- **Structure fixe** — même flux de travail pour tout le monde, aucune personnalisation
- **Boîte noire** — lorsque la sortie de l'IA est mauvaise, vous ne pouvez pas ajuster les prompts

**OPSX l'ouvre.** Maintenant, tout le monde peut :

1. **Expérimenter avec les instructions** — modifier un modèle, voir si l'IA fait mieux
2. **Tester de manière granulaire** — valider les instructions de chaque artefact indépendamment
3. **Personnaliser les flux de travail** — définir vos propres artefacts et dépendances
4. **Itérer rapidement** — modifier un modèle, tester immédiatement, pas de reconstruction

```
Flux de travail hérité :                      OPSX :
┌────────────────────────┐           ┌────────────────────────┐
│  Codé en dur dans le   │           │  schema.yaml           │◄── Vous modifiez ceci
│  package               │           │  templates/*.md        │◄── Ou ceci
│  (impossible à modifier)│           │        ↓               │
│        ↓               │           │  Effet instantané      │
│  Attendre une nouvelle │           │        ↓               │
│  version               │           │  Testez-le vous-même   │
│        ↓               │           └────────────────────────┘
│  Espérer que c'est mieux│
└────────────────────────┘
```

**Ceci est pour tout le monde :**
- **Équipes** — créez des flux de travail qui correspondent à votre façon de travailler
- **Utilisateurs avancés** — ajustez les prompts pour obtenir de meilleures sorties d'IA pour votre base de code
- **Contributeurs OpenSpec** — expérimentez de nouvelles approches sans versions

Nous apprenons tous encore ce qui fonctionne le mieux. OPSX nous permet d'apprendre ensemble.

## L'expérience utilisateur

**Le problème des flux de travail linéaires :**
Vous êtes « en phase de planification », puis « en phase d'implémentation », puis « terminé ». Mais le travail réel ne fonctionne pas comme ça. Vous implémentez quelque chose, réalisez que votre conception était erronée, devez mettre à jour les spécifications, continuer d'implémenter. Les phases linéaires luttent contre la façon dont le travail se déroule réellement.

**Approche OPSX :**
- **Actions, pas des phases** — créer, implémenter, mettre à jour, archiver — faites-en n'importe laquelle à tout moment
- **Les dépendances sont des activateurs** — elles montrent ce qui est possible, pas ce qui est requis ensuite

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Configuration

```bash
# Assurez-vous d'avoir openspec installé — les compétences sont générées automatiquement
openspec init
```

Ceci crée des compétences dans `.claude/skills/` (ou équivalent) que les assistants de codage IA détectent automatiquement.

Par défaut, OpenSpec utilise le profil de flux de travail `core` (`propose`, `explore`, `apply`, `sync`, `archive`). Si vous souhaitez les commandes de flux de travail étendu (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`), configurez-les avec `openspec config profile` et appliquez avec `openspec update`.

Lors de la configuration, il vous sera demandé de créer une **configuration de projet** (`openspec/config.yaml`). Ceci est facultatif mais recommandé.

## Configuration du projet

La configuration de projet vous permet de définir des valeurs par défaut et d'injecter un contexte spécifique au projet dans tous les artefacts.

### Création de la configuration

La configuration est créée lors de `openspec init`, ou manuellement :

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Stack technique : TypeScript, React, Node.js
  Conventions d'API : RESTful, réponses JSON
  Tests : Vitest pour les tests unitaires, Playwright pour les tests e2e
  Style : ESLint avec Prettier, TypeScript strict

rules:
  proposal:
    - Inclure un plan de retour en arrière
    - Identifier les équipes concernées
  specs:
    - Utiliser le format Given/When/Then pour les scénarios
  design:
    - Inclure des diagrammes de séquence pour les flux complexes
```

### Champs de configuration

| Champ | Type | Description |
|-------|------|-------------|
| `schema` | chaîne | Schéma par défaut pour les nouvelles modifications (par exemple, `spec-driven`) |
| `context` | chaîne | Contexte du projet injecté dans les instructions de tous les artefacts |
| `rules` | objet | Règles par artefact, clé par ID d'artefact |

### Fonctionnement

**Priorité des schémas** (du plus élevé au plus bas) :
1. Indicateur CLI (`--schema <nom>`)
2. Métadonnées de modification (`.openspec.yaml` dans le répertoire de modification)
3. Configuration du projet (`openspec/config.yaml`)
4. Par défaut (`spec-driven`)

**Injection de contexte :**
- Le contexte est préfixé à chaque instruction d'artefact
- Enveloppé dans des balises `<context>...</context>`
- Aide l'IA à comprendre les conventions de votre projet

**Injection de règles :**
- Les règles ne sont injectées que pour les artefacts correspondants
- Enveloppé dans des balises `<rules>...</rules>`
- Apparaissent après le contexte, avant le modèle

### ID d'artefacts par schéma

**spec-driven** (par défaut) :
- `proposal` — Proposition de modification
- `specs` — Spécifications
- `design` — Conception technique
- `tasks` — Tâches d'implémentation

### Validation de la configuration

- Les ID d'artefacts inconnus dans `rules` génèrent des avertissements
- Les noms de schémas sont validés par rapport aux schémas disponibles
- Le contexte a une limite de taille de 50 Ko
- Le YAML invalide est signalé avec les numéros de ligne

### Dépannage

**"ID d'artefact inconnu dans les règles : X"**
- Vérifiez que les ID d'artefacts correspondent à votre schéma (voir la liste ci-dessus)
- Exécutez `openspec schemas --json` pour voir les ID d'artefacts pour chaque schéma

**La configuration n'est pas appliquée :**
- Assurez-vous que le fichier est à `openspec/config.yaml` (pas `.yml`)
- Vérifiez la syntaxe YAML avec un validateur
- Les modifications de configuration prennent effet immédiatement (pas de redémarrage nécessaire)

**Contexte trop volumineux :**
- Le contexte est limité à 50 Ko
- Résumez ou faites un lien vers la documentation externe à la place

## Commandes

| Commande | Ce qu'elle fait |
|----------|-----------------|
| `/opsx:propose` | Créer une modification et générer des artefacts de planification en une étape (chemin rapide par défaut) |
| `/opsx:explore` | Réfléchir à des idées, investiguer des problèmes, clarifier les exigences |
| `/opsx:new` | Démarrer un échafaudage de nouvelle modification (flux de travail étendu) |
| `/opsx:continue` | Créer l'artefact suivant (flux de travail étendu) |
| `/opsx:ff` | Avance rapide des artefacts de planification (flux de travail étendu) |
| `/opsx:apply` | Implémenter des tâches, mettre à jour les artefacts si nécessaire |
| `/opsx:update` | Réviser les artefacts de planification d'une modification et maintenir leur cohérence |
| `/opsx:verify` | Valider l'implémentation par rapport aux artefacts (flux de travail étendu) |
| `/opsx:sync` | Synchroniser les spécifications delta vers la principale (flux de travail par défaut, facultatif) |
| `/opsx:archive` | Archiver une fois terminé |
| `/opsx:bulk-archive` | Archiver plusieurs modifications terminées (flux de travail étendu) |
| `/opsx:onboard` | Visite guidée d'une modification de bout en bout (flux de travail étendu) |

## Utilisation

### Explorer une idée
```
/opsx:explore
```
Réfléchissez à des idées, investiguez des problèmes, comparez des options. Aucune structure requise - juste un partenaire de réflexion. Lorsque les insights se cristallisent, passez à `/opsx:propose` (par défaut) ou `/opsx:new`/`/opsx:ff` (étendu).

### Démarrer une nouvelle modification
```
/opsx:propose
```
Crée la modification et génère les artefacts de planification nécessaires avant l'implémentation.

Si vous avez activé les flux de travail étendus, vous pouvez à la place utiliser :

```text
/opsx:new        # échafaudage uniquement
/opsx:continue   # créer un artefact à la fois
/opsx:ff         # créer tous les artefacts de planification d'un coup
```

### Créer des artefacts
```
/opsx:continue
```
Montre ce qui est prêt à être créé en fonction des dépendances, puis crée un artefact. Utilisez-le à plusieurs reprises pour construire votre modification progressivement.

```
/opsx:ff add-dark-mode
```
Crée tous les artefacts de planification d'un coup. Utilisez-le lorsque vous avez une image claire de ce que vous construisez.

### Implémenter (la partie fluide)
```
/opsx:apply
```
Traite les tâches, les cochants au fur et à mesure. Si vous jonglez avec plusieurs modifications, vous pouvez exécuter `/opsx:apply <nom>` ; sinon, il doit déduire du contexte de la conversation et vous inviter à choisir s'il ne peut pas le déterminer.

### Mettre à jour une modification
```
/opsx:update add-dark-mode - we're storing the theme in a cookie now
```
Réviser les artefacts de planification existants d'une modification et maintenir leur cohérence - dans n'importe quelle direction (une modification de conception peut se répercuter sur la proposition). Artefacts de planification uniquement : il ne modifie jamais le code, et ne crée jamais d'artefacts manquants (c'est `/opsx:continue`). Chaque modification est d'abord confirmée avec vous. Si la modification a déjà été implémentée, il recommande `/opsx:apply` pour que le code rattrape le plan révisé. Si votre révision change l'*intention* de la modification, commencez plutôt à neuf - voir [Quand mettre à jour vs. commencer à neuf](#when-to-update-vs-start-fresh).

### Terminer
```
/opsx:archive   # Déplacer vers l'archive une fois terminé (invite à synchroniser les spécifications si nécessaire)
```

## Quand mettre à jour vs. commencer à neuf

Vous pouvez toujours modifier votre proposition ou vos spécifications avant l'implémentation. Mais quand l'affinage devient-il « c'est un travail différent » ?

### Ce que capture une proposition

Une proposition définit trois choses :
1. **Intention** — Quel problème résolvez-vous ?
2. **Périmètre** — Ce qui est inclus/exclu ?
3. **Approche** — Comment allez-vous le résoudre ?

La question est : lequel a changé, et dans quelle mesure ?

### Mettre à jour la modification existante quand :

**Même intention, exécution affinée**
- Vous découvrez des cas limites que vous n'aviez pas envisagés
- L'approche nécessite des ajustements mais l'objectif est inchangé
- L'implémentation révèle que la conception était légèrement erronée

**Le périmètre se réduit**
- Vous réalisez que le périmètre complet est trop important, vous voulez d'abord livrer le MVP
- « Ajouter le mode sombre » → « Ajouter un bouton de mode sombre (préférence système dans la v2) »

**Corrections basées sur l'apprentissage**
- La base de code n'est pas structurée comme vous le pensiez
- Une dépendance ne fonctionne pas comme prévu
- « Utiliser des variables CSS » → « Utiliser plutôt le préfixe `dark:` de Tailwind »

### Commencer une nouvelle modification quand :

**Intention fondamentalement modifiée**
- Le problème lui-même est différent maintenant
- « Ajouter le mode sombre » → « Ajouter un système de thème complet avec couleurs, polices et espacement personnalisés »

**Périmètre explosé**
- La modification a tellement grandi que c'est essentiellement un travail différent
- La proposition initiale serait méconnaissable après les mises à jour
- « Corriger le bug de connexion » → « Réécrire le système d'authentification »

**L'original est terminable**
- La modification originale peut être marquée comme « terminée »
- Le nouveau travail est autonome, pas un affinage
- Terminer « Ajouter le MVP du mode sombre » → Archiver → Nouvelle modification « Améliorer le mode sombre »

### Les heuristiques

```
                        ┌─────────────────────────────────────┐
                        │     Est-ce le même travail ?         │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Même intention ?    >50% de            L'original peut-il
             Même problème ?     chevauchement ?     être « terminé » sans
                    │                  │          ces modifications ?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         OUI               NON OUI          NON  NON             OUI
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       METTRE À          NOUVEAU METTRE À   NOUVEAU METTRE À     NOUVEAU
       JOUR                          JOUR           JOUR
```

| Test | Mettre à jour | Nouvelle modification |
|------|---------------|----------------------|
| **Identité** | « Même chose, affinée » | « Travail différent » |
| **Chevauchement de périmètre** | >50% de chevauchement | <50% de chevauchement |
| **Achèvement** | Impossible d'être « terminé » sans modifications | Peut terminer l'original, le nouveau travail est autonome |
| **Histoire** | La chaîne de mise à jour raconte une histoire cohérente | Les correctifs causeraient plus de confusion que de clarification |

### Le principe

> **La mise à jour préserve le contexte. La nouvelle modification apporte de la clarté.**
>
> Choisissez la mise à jour lorsque l'historique de votre réflexion est précieux.
> Choisissez nouveau lorsque commencer à neuf serait plus clair que de corriger.

Pensez-y comme des branches git :
- Continuez de committer tout en travaillant sur la même fonctionnalité
- Commencez une nouvelle branche lorsque c'est un travail réellement nouveau
- Parfois fusionnez une fonctionnalité partielle et commencez à neuf pour la phase 2

## Qu'est-ce qui est différent ?

| | Hérité (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Structure** | Un seul grand document de proposition | Artefacts discrets avec dépendances |
| **Flux de travail** | Phases linéaires : planifier → implémenter → archiver | Actions fluides — faites n'importe quoi à tout moment |
| **Itération** | Maladroit de revenir en arrière | Mettez à jour les artefacts au fur et à mesure de votre apprentissage |
| **Personnalisation** | Structure fixe | Piloté par schéma (définissez vos propres artefacts) |

**L'idée clé :** le travail n'est pas linéaire. OPSX arrête de prétendre le contraire.

## Plongée approfondie dans l'architecture

Cette section explique le fonctionnement interne d'OPSX et le compare au workflow hérité. Les exemples de cette section utilisent le jeu de commandes étendu (`new`, `continue`, etc.) ; les utilisateurs par défaut de `core` peuvent mapper le même flux vers `propose → apply → sync → archive`.

### Philosophie : Phases vs Actions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         WORKFLOW HÉRITÉ                                     │
│                    (Verrouillé par phases, tout ou rien)                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │  PHASE DE    │ ───► │ PHASE DE     │ ───► │  PHASE D'    │             │
│   │ PLANIFICATION│      │ MISE EN ŒUVRE│      │  ARCHIVAGE   │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Crée TOUS les artefacts d'un coup                                      │
│   • Impossible de revenir en arrière pour mettre à jour les spécifications  │
│     pendant la mise en œuvre                                                │
│   • Les jalons de phases imposent une progression linéaire                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            WORKFLOW OPSX                                     │
│                      (Actions fluides, itératif)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           ACTIONS (pas des phases)         │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              dans n'importe quel ordre     │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Créez les artefacts un par un OU utilisez l'avance rapide              │
│   • Mettez à jour les spécifications, la conception et les tâches pendant   │
│     la mise en œuvre                                                        │
│   • Les dépendances permettent la progression, les phases n'existent pas    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Architecture des composants

**Le workflow hérité** utilise des modèles codés en dur en TypeScript :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      COMPOSANTS DU WORKFLOW HÉRITÉ                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Modèles codés en dur (chaînes TypeScript)                                 │
│                    │                                                        │
│                    ▼                                                        │
│   Configurateurs/adaptateurs spécifiques à l'outil                          │
│                    │                                                        │
│                    ▼                                                        │
│   Fichiers de commandes générés (.claude/commands/openspec/*.md)            │
│                                                                             │
│   • Structure fixe, pas de prise en compte des artefacts                    │
│   • Toute modification nécessite une modification du code + une             │
│     reconstruction                                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** utilise des schémas externes et un moteur de graphe de dépendances :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPOSANTS OPSX                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Définitions de schémas (YAML)                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: piloté par les spécifications                                │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Dépendances                      │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Motifs de glob                   │   │
│   │      requires: [proposal]      ◄── Disponible après la proposition   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Moteur de graphe d'artefacts                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Tri topologique (ordonnancement par dépendances)                  │   │
│   │  • Détection d'état (existence dans le système de fichiers)          │   │
│   │  • Génération d'instructions détaillées (modèles + contexte)         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Fichiers de compétences (.claude/skills/openspec-*/SKILL.md)              │
│                                                                             │
│   • Compatible avec plusieurs éditeurs (Claude Code, Cursor, Windsurf)      │
│   • Le CLI de requête de compétences pour les données structurées           │
│   • Entièrement personnalisable via des fichiers de schéma                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Modèle de graphe de dépendances

Les artefacts forment un graphe acyclique orienté (DAG). Les dépendances sont des **activateurs**, pas des jalons :

```
                              proposal
                             (nœud racine)
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
                          │ PHASE D'     │
                          │ APPLICATION  │
                          │ (requires:   │
                          │  tasks)      │
                          └──────────────┘
```

**Transitions d'état :**

```
   BLOCKED ────────────────► READY ────────────────► DONE
      │                        │                       │
   Dépendances             Toutes les dépendances    Le fichier existe
   manquantes              sont à l'état DONE         dans le système de
                                                      fichiers
```

### Flux d'information

**Workflow hérité** — l'agent reçoit des instructions statiques :

```
  User: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Instructions statiques :               │
  │  • Créer proposal.md                    │
  │  • Créer tasks.md                       │
  │  • Créer design.md                      │
  │  • Créer specs/<capability>/spec.md     │
  │                                         │
  │  Pas de conscience de ce qui existe ou  │
  │  des dépendances entre les artefacts    │
  └─────────────────────────────────────────┘
           │
           ▼
  L'agent crée TOUS les artefacts d'un coup
```

**OPSX** — l'agent interroge le système pour obtenir un contexte détaillé :

```
  User: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Étape 1 : Interroger l'état actuel                                      │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec status --change "add-auth" --json                      │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "artifacts": [                                                  │  │
  │  │      {"id": "proposal", "status": "done"},                         │  │
  │  │      {"id": "specs", "status": "ready"},      ◄── Premier prêt      │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked", "missingDeps": ["specs"]}│  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Étape 2 : Obtenir des instructions détaillées pour l'artefact prêt      │
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
  │  Étape 3 : Lire les dépendances → Créer UN seul artefact → Afficher ce   │
  │  qui est débloqué                                                        │
  └──────────────────────────────────────────────────────────────────────────┘
```

### Modèle d'itération

**Workflow hérité** — difficile à itérer :

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── « Attendez, la conception est erronée »
       │               │
       │               ├── Options :
       │               │   • Modifier les fichiers manuellement (casse le contexte)
       │               │   • Abandonner et recommencer depuis le début
       │               │   • Poursuivre et corriger plus tard
       │               │
       │               └── Aucun mécanisme officiel de « retour en arrière »
       │
       └── Génère TOUS les artefacts d'un coup
```

**OPSX** — itération naturelle :

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── « La conception est erronée »
      │                │                  │
      │                │                  ▼
      │                │            Modifiez simplement design.md
      │                │            et poursuivez !
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply reprend
      │                │         là où vous vous étiez arrêté
      │                │
      │                └── Génère UN SEUL artefact, affiche ce qui est débloqué
      │
      └── Génère la structure de la modification, attend vos instructions
```

### Schémas personnalisés

Créez des workflows personnalisés à l'aide des commandes de gestion des schémas :

```bash
# Créer un nouveau schéma depuis zéro (interactif)
openspec schema init my-workflow

# Ou forker un schéma existant comme point de départ
openspec schema fork spec-driven my-workflow

# Valider la structure de votre schéma
openspec schema validate my-workflow

# Voir d'où est résolu un schéma (utile pour le débogage)
openspec schema which my-workflow
```

Les schémas sont stockés dans `openspec/schemas/` (local au projet, versionné) ou dans `~/.local/share/openspec/schemas/` (global pour l'utilisateur).

**Structure d'un schéma :**
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

### Récapitulatif

| Aspect | Version héritée | OPSX |
|--------|----------|------|
| **Modèles** | TypeScript codé en dur | YAML et Markdown externes |
| **Dépendances** | Aucune (toutes générées d'un coup) | DAG avec tri topologique |
| **État** | Modèle mental basé sur les phases | Existence dans le système de fichiers |
| **Personnalisation** | Modifier la source, recompiler | Créer un schema.yaml |
| **Itération** | Verrouillé par phase | Fluide, modification de n'importe quel élément |
| **Prise en charge par les éditeurs** | Configurateurs/adaptateurs spécifiques à chaque outil | Répertoire de compétences unique |

## Schémas

Les schémas définissent les artefacts existants et leurs dépendances. Schémas actuellement disponibles :

- **spec-driven** (par défaut) : proposal → specs → design → tasks

```bash
# Lister les schémas disponibles
openspec schemas

# Voir tous les schémas avec leurs sources de résolution
openspec schema which --all

# Créer un nouveau schéma de manière interactive
openspec schema init my-workflow

# Forker un schéma existant pour le personnaliser
openspec schema fork spec-driven my-workflow

# Valider la structure du schéma avant utilisation
openspec schema validate my-workflow
```

## Conseils

- Utilisez `/opsx:explore` pour explorer une idée avant de vous engager dans une modification
- `/opsx:ff` lorsque vous savez ce que vous voulez, `/opsx:continue` lors de l'exploration
- Lors de `/opsx:apply`, si quelque chose ne va pas — corrigez l'artefact, puis poursuivez
- Les tâches suivent la progression via des cases à cocher dans `tasks.md`
- Vérifiez le statut à tout moment : `openspec status --change "name"`

## Retours

Ce projet est encore à l'état brut. C'est volontaire — nous apprenons ce qui fonctionne.

Vous avez trouvé un bug ? Vous avez des idées ? Rejoignez-nous sur [Discord](https://discord.gg/YctCnvvshC) ou ouvrez une issue sur [GitHub](https://github.com/Fission-AI/openspec/issues).