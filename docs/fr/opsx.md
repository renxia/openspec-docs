# Flux de travail OPSX

> Vos retours sont les bienvenus sur [Discord](https://discord.gg/YctCnvvshC).

## Qu'est-ce que c'est ?

OPSX est désormais le flux de travail standard pour OpenSpec.

Il s'agit d'un **flux de travail fluide et itératif** pour les modifications OpenSpec. Fini les phases rigides — il ne reste que des actions que vous pouvez entreprendre à tout moment.

## Pourquoi cela existe

Le flux de travail OpenSpec hérité fonctionne, mais il est **verrouillé** :

- **Les instructions sont codées en dur** — enfouies dans TypeScript, vous ne pouvez pas les modifier
- **Tout ou rien** — une seule grande commande crée tout, impossible de tester les pièces individuellement
- **Structure fixe** — même flux de travail pour tous, pas de personnalisation
- **Boîte noire** — quand la sortie de l'IA est mauvaise, vous ne pouvez pas ajuster les prompts

**OPSX l'ouvre.** Maintenant, n'importe qui peut :

1. **Expérimenter avec les instructions** — modifier un modèle, voir si l'IA fait mieux
2. **Tester de manière granulaire** — valider les instructions de chaque artefact indépendamment
3. **Personnaliser les flux de travail** — définir vos propres artefacts et dépendances
4. **Itérer rapidement** — changer un modèle, tester immédiatement, sans reconstruction

```
Flux de travail hérité :              OPSX :
┌────────────────────────┐           ┌────────────────────────┐
│  Codé en dur dans le   │           │  schema.yaml           │◄── Vous modifiez ceci
│  package               │           │  templates/*.md        │◄── Ou ceci
│  (impossible à changer)│           │        ↓               │
│        ↓               │           │  Effet instantané      │
│  Attendre la nouvelle  │           │        ↓               │
│  version               │           │  Testez-le vous-même   │
│        ↓               │           │                        │
│  Espérer que c'est     │           │                        │
│  meilleur              │           │                        │
└────────────────────────┘           └────────────────────────┘
```

**C'est pour tout le monde :**
- **Équipes** — créez des flux de travail qui correspondent à la façon dont vous travaillez réellement
- **Utilisateurs avancés** — ajustez les prompts pour obtenir de meilleures sorties d'IA pour votre base de code
- **Contributeurs OpenSpec** — expérimentez de nouvelles approches sans attendre les versions

Nous apprenons tous encore ce qui fonctionne le mieux. OPSX nous permet d'apprendre ensemble.

## L'Expérience Utilisateur

**Le problème avec les flux de travail linéaires :**
Vous êtes « en phase de planification », puis « en phase d'implémentation », puis « terminé ». Mais le vrai travail ne fonctionne pas ainsi. Vous implémentez quelque chose, réalisez que votre conception était erronée, devez mettre à jour les spécifications, continuer l'implémentation. Les phases linéaires s'opposent à la façon dont le travail se déroule réellement.

**L'approche OPSX :**
- **Actions, pas des phases** — créer, implémenter, mettre à jour, archiver — faites l'une ou l'autre à tout moment
- **Les dépendances sont des facilitateurs** — elles montrent ce qui est possible, pas ce qui est requis ensuite

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Configuration

```bash
# Assurez-vous d'avoir openspec installé — les skills sont générés automatiquement
openspec init
```

Cela crée des skills dans `.claude/skills/` (ou équivalent) que les assistants de codage IA détectent automatiquement.

Par défaut, OpenSpec utilise le profil de flux de travail `core` (`propose`, `explore`, `apply`, `archive`). Si vous souhaitez les commandes de flux de travail étendu (`new`, `continue`, `ff`, `verify`, `sync`, `bulk-archive`, `onboard`), configurez-les avec `openspec config profile` et appliquez-les avec `openspec update`.

Pendant la configuration, il vous sera demandé de créer une **configuration de projet** (`openspec/config.yaml`). C'est optionnel mais recommandé.

## Configuration du Projet

La configuration de projet vous permet de définir des valeurs par défaut et d'injecter un contexte spécifique au projet dans tous les artefacts.

### Création de la Configuration

La configuration est créée lors de `openspec init`, ou manuellement :

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Pile technique : TypeScript, React, Node.js
  Conventions API : RESTful, réponses JSON
  Tests : Vitest pour les tests unitaires, Playwright pour les tests e2e
  Style : ESLint avec Prettier, TypeScript strict

rules:
  proposal:
    - Inclure le plan de retour arrière
    - Identifier les équipes concernées
  specs:
    - Utiliser le format Given/When/Then pour les scénarios
  design:
    - Inclure des diagrammes de séquence pour les flux complexes
```

### Champs de Configuration

| Champ | Type | Description |
|-------|------|-------------|
| `schema` | string | Schéma par défaut pour les nouveaux changements (par ex., `spec-driven`) |
| `context` | string | Contexte du projet injecté dans les instructions de tous les artefacts |
| `rules` | object | Règles par artefact, identifiées par l'ID de l'artefact |

### Comment cela fonctionne

**Précédence du schéma** (de la plus haute à la plus basse) :
1. Drapeau CLI (`--schema <nom>`)
2. Métadonnées du changement (`.openspec.yaml` dans le répertoire du changement)
3. Configuration du projet (`openspec/config.yaml`)
4. Par défaut (`spec-driven`)

**Injection du contexte :**
- Le contexte est ajouté au début des instructions de chaque artefact
- Encapsulé dans des balises `<context>...</context>`
- Aide l'IA à comprendre les conventions de votre projet

**Injection des règles :**
- Les règles ne sont injectées que pour les artefacts correspondants
- Encapsulées dans des balises `<rules>...</rules>`
- Apparaissent après le contexte, avant le modèle

### IDs des Artefacts par Schéma

**spec-driven** (par défaut) :
- `proposal` — Proposition de changement
- `specs` — Spécifications
- `design` — Conception technique
- `tasks` — Tâches d'implémentation

### Validation de la Configuration

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
- Les changements de configuration prennent effet immédiatement (pas besoin de redémarrage)

**Contexte trop volumineux :**
- Le contexte est limité à 50 Ko
- Résumez ou liez à des documents externes à la place

## Commandes

| Commande | Ce qu'elle fait |
|----------|-----------------|
| `/opsx:propose` | Crée un changement et génère les artefacts de planification en une seule étape (chemin rapide par défaut) |
| `/opsx:explore` | Réfléchir aux idées, enquêter sur les problèmes, clarifier les exigences |
| `/opsx:new` | Démarrer un nouveau squelette de changement (flux de travail étendu) |
| `/opsx:continue` | Créer l'artefact suivant (flux de travail étendu) |
| `/opsx:ff` | Avancer rapidement les artefacts de planification (flux de travail étendu) |
| `/opsx:apply` | Implémenter les tâches, mettant à jour les artefacts au besoin |
| `/opsx:verify` | Valider l'implémentation par rapport aux artefacts (flux de travail étendu) |
| `/opsx:sync` | Synchroniser les spécifications delta vers la branche principale (flux de travail étendu, optionnel) |
| `/opsx:archive` | Archiver une fois terminé |
| `/opsx:bulk-archive` | Archiver plusieurs changements terminés (flux de travail étendu) |
| `/opsx:onboard` | Parcours guidé d'un changement de bout en bout (flux de travail étendu) |

## Utilisation

### Explorer une idée
```
/opsx:explore
```
Réfléchir aux idées, enquêter sur les problèmes, comparer les options. Aucune structure requise - juste un partenaire de réflexion. Lorsque les idées se cristallisent, passez à `/opsx:propose` (par défaut) ou `/opsx:new`/`/opsx:ff` (étendu).

### Démarrer un nouveau changement
```
/opsx:propose
```
Crée le changement et génère les artefacts de planification nécessaires avant l'implémentation.

Si vous avez activé les flux de travail étendus, vous pouvez plutôt utiliser :

```text
/opsx:new        # squelette uniquement
/opsx:continue   # créer un artefact à la fois
/opsx:ff         # créer tous les artefacts de planification d'un coup
```

### Créer des artefacts
```
/opsx:continue
```
Affiche ce qui est prêt à créer en fonction des dépendances, puis crée un artefact. Utilisez-le de manière répétée pour construire votre changement de manière incrémentielle.

```
/opsx:ff add-dark-mode
```
Crée tous les artefacts de planification d'un coup. À utiliser lorsque vous avez une image claire de ce que vous construisez.

### Implémenter (la partie fluide)
```
/opsx:apply
```
Travaille à travers les tâches, les cochant au fur et à mesure. Si vous gérez plusieurs changements, vous pouvez exécuter `/opsx:apply <nom>` ; sinon, il devrait inférer de la conversation et vous demander de choisir s'il ne peut pas déterminer.

### Terminer
```
/opsx:archive   # Déplacer vers l'archive une fois terminé (demande de synchroniser les specs si nécessaire)
```

## Quand Mettre à Jour vs. Recommencer

Vous pouvez toujours modifier votre proposition ou vos spécifications avant l'implémentation. Mais quand l'affinement devient-il « c'est un travail différent » ?

### Ce qu'une Proposition Capture

Une proposition définit trois choses :
1. **Intention** — Quel problème résolvez-vous ?
2. **Portée** — Qu'est-ce qui est dans/hors de la portée ?
3. **Approche** — Comment allez-vous le résoudre ?

La question est : qu'est-ce qui a changé, et de combien ?

### Mettre à Jour le Changement Existant Quand :

**Même intention, exécution affinée**
- Vous découvrez des cas limites que vous n'aviez pas considérés
- L'approche nécessite des ajustements mais le but est inchangé
- L'implémentation révèle que la conception était légèrement erronée

**La portée se réduit**
- Vous réalisez que la portée complète est trop grande, vous voulez livrer le MVP d'abord
- « Ajouter le mode sombre » → « Ajouter le bouton de basculement du mode sombre (préférence système dans la v2) »

**Corrections guidées par l'apprentissage**
- La base de code n'est pas structurée comme vous le pensiez
- Une dépendance ne fonctionne pas comme prévu
- « Utiliser les variables CSS » → « Utiliser plutôt le préfixe dark: de Tailwind »

### Recommencer un Nouveau Changement Quand :

**L'intention a fondamentalement changé**
- Le problème lui-même est différent maintenant
- « Ajouter le mode sombre » → « Ajouter un système de thème complet avec couleurs, polices et espacement personnalisés »

**La portée a explosé**
- Le changement a tellement grandi que c'est essentiellement un travail différent
- La proposition originale serait méconnaissable après les mises à jour
- « Corriger le bug de connexion » → « Réécrire le système d'authentification »

**L'original est terminable**
- Le changement original peut être marqué « terminé »
- Le nouveau travail est autonome, pas un affinement
- Terminer « Ajouter le mode sombre MVP » → Archiver → Nouveau changement « Améliorer le mode sombre »

### Les Heuristiques

```
                        ┌─────────────────────────────────────┐
                        │     Est-ce le même travail ?        │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Même intention ?   >50% de chevauchement ? L'original peut-il
             Même problème ?    Même portée ?           être « terminé » sans
                    │                  │                 ces changements ?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         OUI               NON OUI           NON NON             OUI
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       METTRE À JOUR    NOUVEAU METTRE À JOUR NOUVEAU METTRE À JOUR NOUVEAU
```

| Test | Mettre à Jour | Nouveau Changement |
|------|---------------|--------------------|
| **Identité** | « La même chose, affinée » | « Travail différent » |
| **Chevauchement de portée** | >50% de chevauchement | <50% de chevauchement |
| **Achèvement** | Ne peut pas être « terminé » sans changements | Peut terminer l'original, le nouveau travail est autonome |
| **Récit** | La chaîne de mises à jour raconte une histoire cohérente | Les correctifs confondraient plus qu'ils n'éclairciraient |

### Le Principe

> **La mise à jour préserve le contexte. Le nouveau changement apporte la clarté.**
>
> Choisissez la mise à jour lorsque l'historique de votre réflexion est précieux.
> Choisissez le nouveau lorsque recommencer serait plus clair que de corriger.

Pensez-y comme des branches git :
- Continuez à valider pendant que vous travaillez sur la même fonctionnalité
- Créez une nouvelle branche quand c'est vraiment un travail nouveau
- Parfois, fusionnez une fonctionnalité partielle et recommencez pour la phase 2

## Qu'est-ce qui change ?

| | Ancien (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Structure** | Un seul grand document de proposition | Artifacts discrets avec dépendances |
| **Flux de travail** | Phases linéaires : planifier → implémenter → archiver | Actions fluides — faites tout, à tout moment |
| **Itération** | Difficile de revenir en arrière | Mettez à jour les artifacts au fur et à mesure de vos apprentissages |
| **Personnalisation** | Structure fixe | Pilotée par un schéma (définissez vos propres artifacts) |

**L'idée clé :** le travail n'est pas linéaire. OPSX cesse de faire semblant qu'il l'est.

## Plongée dans l'architecture

Cette section explique comment OPSX fonctionne en coulisses et comment il se compare au flux de travail hérité.
Les exemples de cette section utilisent le jeu de commandes étendu (`new`, `continue`, etc.) ; les utilisateurs par défaut (`core`) peuvent mapper le même flux à `propose → apply → archive`.

### Philosophie : Phases vs Actions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUX DE TRAVAIL HÉRITÉ                              │
│                    (Verrouillé par phase, Tout ou rien)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   PLANIFICATION│ ───► │  MISE EN ŒUVRE│ ───► │   ARCHIVAGE  │             │
│   │    PHASE     │      │    PHASE     │      │    PHASE     │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Crée TOUS les artefacts en une seule fois                              │
│   • Impossible de revenir en arrière pour mettre à jour les specs pendant  │
│     la mise en œuvre                                                        │
│   • Les portes de phase imposent une progression linéaire                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUX DE TRAVAIL OPSX                                │
│                      (Actions fluides, Itératif)                            │
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
│   • Crée les artefacts un par un OU avance rapidement                      │
│   • Met à jour les specs/design/tasks pendant la mise en œuvre             │
│   • Les dépendances permettent la progression, les phases n'existent pas   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Architecture des composants

Le **flux de travail hérité** utilise des modèles codés en dur en TypeScript :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  COMPOSANTS DU FLUX DE TRAVAIL HÉRITÉ                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Modèles codés en dur (chaînes TypeScript)                                │
│                    │                                                        │
│                    ▼                                                        │
│   Configurateurs/adaptateurs spécifiques à l'outil                         │
│                    │                                                        │
│                    ▼                                                        │
│   Fichiers de commandes générés (.claude/commands/openspec/*.md)            │
│                                                                             │
│   • Structure fixe, pas de conscience des artefacts                         │
│   • Les changements nécessitent une modification du code + reconstruction  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** utilise des schémas externes et un moteur de graphe de dépendances :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPOSANTS OPSX                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Définitions de schéma (YAML)                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Dépendances                      │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Motifs glob                      │   │
│   │      requires: [proposal]      ◄── Active après proposal            │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Moteur de graphe d'artefacts                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Tri topologique (ordonnancement des dépendances)                 │   │
│   │  • Détection d'état (existence sur le système de fichiers)          │   │
│   │  • Génération d'instructions riches (modèles + contexte)            │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Fichiers de compétences (.claude/skills/openspec-*/SKILL.md)              │
│                                                                             │
│   • Compatible multi-éditeur (Claude Code, Cursor, Windsurf)               │
│   • Les compétences interrogent le CLI pour des données structurées        │
│   • Entièrement personnalisable via des fichiers schéma                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Modèle de graphe de dépendances

Les artefacts forment un graphe acyclique dirigé (DAG). Les dépendances sont des **activateurs**, pas des portes :

```
                              proposal
                             (nœud racine)
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
                 specs                       design
              (requiert:                  (requiert:
               proposal)                   proposal)
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                               tasks
                           (requiert:
                           specs, design)
                                  │
                                  ▼
                          ┌──────────────┐
                          │ PHASE APPLY  │
                          │ (requiert:   │
                          │  tasks)      │
                          └──────────────┘
```

**Transitions d'état :**

```
   BLOQUÉ ────────────────► PRÊT ────────────────► TERMINÉ
      │                        │                       │
   Dépendances               Toutes les deps         Le fichier existe
   manquantes                sont TERMINÉES          sur le système de fichiers
```

### Flux d'information

**Flux de travail hérité** — l'agent reçoit des instructions statiques :

```
  Utilisateur : "/openspec:proposal"
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
  │  des dépendances entre artefacts        │
  └─────────────────────────────────────────┘
           │
           ▼
  L'agent crée TOUS les artefacts en une seule fois
```

**OPSX** — l'agent interroge pour un contexte riche :

```
  Utilisateur : "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Étape 1 : Interroger l'état actuel                                     │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec status --change "add-auth" --json                      │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "artifacts": [                                                  │  │
  │  │      {"id": "proposal", "status": "done"},                         │  │
  │  │      {"id": "specs", "status": "ready"},      ◄── Premier prêt     │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked", "missingDeps": ["specs"]}│  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Étape 2 : Obtenir des instructions riches pour l'artefact prêt         │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec instructions specs --change "add-auth" --json          │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "template": "# Spécification\n\n## Exigences AJOUTÉES...",      │  │
  │  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
  │  │    "unlocks": ["tasks"]                                            │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Étape 3 : Lire les dépendances → Créer UN artefact → Montrer ce qui    │
  │  est débloqué                                                            │
  └──────────────────────────────────────────────────────────────────────────┘
```

### Modèle d'itération

**Flux de travail hérité** — difficile à itérer :

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Attendez, le design est incorrect"
       │               │
       │               ├── Options :
       │               │   • Modifier les fichiers manuellement (casse le contexte)
       │               │   • Abandonner et recommencer
       │               │   • Forcer et corriger plus tard
       │               │
       │               └── Pas de mécanisme officiel "revenir en arrière"
       │
       └── Crée TOUS les artefacts en une seule fois
```

**OPSX** — itération naturelle :

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── "Le design est incorrect"
      │                │                  │
      │                │                  ▼
      │                │            Modifier simplement design.md
      │                │            et continuer !
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply reprend
      │                │         là où vous en étiez
      │                │
      │                └── Crée UN artefact, montre ce qui est débloqué
      │
      └── Prépare le changement, attend les instructions
```

### Schémas personnalisés

Créez des flux de travail personnalisés en utilisant les commandes de gestion des schémas :

```bash
# Créer un nouveau schéma from scratch (interactif)
openspec schema init my-workflow

# Ou forker un schéma existant comme point de départ
openspec schema fork spec-driven my-workflow

# Valider la structure de votre schéma
openspec schema validate my-workflow

# Voir d'où provient un schéma (utile pour le débogage)
openspec schema which my-workflow
```

Les schémas sont stockés dans `openspec/schemas/` (local au projet, contrôlé par version) ou `~/.local/share/openspec/schemas/` (global à l'utilisateur).

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
  - id: research        # Ajouté avant proposal
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Dépend maintenant de research

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**Graphe de dépendances :**
```
   research ──► proposal ──► tasks
```

### Résumé

| Aspect | Hérité | OPSX |
|--------|----------|------|
| **Modèles** | TypeScript codé en dur | YAML externe + Markdown |
| **Dépendances** | Aucune (tout en une fois) | DAG avec tri topologique |
| **État** | Modèle mental basé sur les phases | Existence sur le système de fichiers |
| **Personnalisation** | Modifier la source, reconstruire | Créer un schema.yaml |
| **Itération** | Verrouillé par phase | Fluide, modifier n'importe quoi |
| **Support éditeur** | Configurateurs/adaptateurs spécifiques à l'outil | Répertoire de compétences unique |

## Schémas

Les schémas définissent les artefacts existants et leurs dépendances. Actuellement disponibles :

- **spec-driven** (par défaut) : proposition → spécifications → conception → tâches

```bash
# Lister les schémas disponibles
openspec schemas

# Voir tous les schémas avec leurs sources de résolution
openspec schema which --all

# Créer un nouveau schéma de manière interactive
openspec schema init my-workflow

# Dupliquer un schéma existant pour le personnaliser
openspec schema fork spec-driven my-workflow

# Valider la structure du schéma avant utilisation
openspec schema validate my-workflow
```

## Conseils

- Utilisez `/opsx:explore` pour réfléchir à une idée avant de vous engager sur un changement
- `/opsx:ff` lorsque vous savez ce que vous voulez, `/opsx:continue` lors de l'exploration
- Pendant `/opsx:apply`, si quelque chose ne va pas — corrigez l'artefact, puis continuez
- Les tâches suivent la progression via des cases à cocher dans `tasks.md`
- Vérifiez l'état à tout moment : `openspec status --change "name"`

## Retours

C'est encore brut. C'est intentionnel — nous apprenons ce qui fonctionne.

Vous avez trouvé un bug ? Des idées ? Rejoignez-nous sur [Discord](https://discord.gg/YctCnvvshC) ou ouvrez un ticket sur [GitHub](https://github.com/Fission-AI/openspec/issues).