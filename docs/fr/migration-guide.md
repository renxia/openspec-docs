# Migrer vers OPSX

Ce guide vous aide à effectuer la transition depuis l'ancien flux de travail OpenSpec vers OPSX. La migration est conçue pour être fluide — votre travail existant est préservé, et le nouveau système offre plus de flexibilité.

## Qu'est-ce qui change ?

OPSX remplace l'ancien flux de travail verrouillé par phase par une approche fluide, basée sur les actions. Voici le changement clé :

| Aspect | Ancien système | OPSX |
|--------|----------------|------|
| **Commandes** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Par défaut : `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (commandes de flux de travail étendues en option) |
| **Flux de travail** | Créer tous les artefacts en une fois | Créer de manière incrémentale ou en une fois — à votre choix |
| **Retour en arrière** | Portes de phase rigides | Naturel — mettre à jour n'importe quel artefact à tout moment |
| **Personnalisation** | Structure fixe | Piloté par schéma, entièrement modifiable |
| **Configuration** | `CLAUDE.md` avec marqueurs + `project.md` | Configuration propre dans `openspec/config.yaml` |

**Le changement de philosophie :** Le travail n'est pas linéaire. OPSX cesse de prétendre le contraire.

---

## Avant de commencer

### Votre travail existant est préservé

Le processus de migration a été conçu avec la préservation à l'esprit :

- **Modifications actives dans `openspec/changes/`** — Complètement préservées. Vous pouvez continuer à les gérer avec les commandes OPSX.
- **Modifications archivées** — Intactes. Votre historique reste préservé.
- **Spécifications principales dans `openspec/specs/`** — Intactes. Ce sont vos sources de vérité.
- **Votre contenu dans CLAUDE.md, AGENTS.md, etc.** — Préservé. Seuls les blocs de marqueurs OpenSpec sont supprimés ; tout ce que vous avez écrit reste en place.

### Ce qui est supprimé

Seuls les fichiers gérés par OpenSpec qui sont remplacés :

| Quoi | Pourquoi |
|------|----------|
| Répertoires/fichiers de commandes slash hérités | Remplacés par le nouveau système de compétences |
| `openspec/AGENTS.md` | Déclencheur de workflow obsolète |
| Marqueurs OpenSpec dans `CLAUDE.md`, `AGENTS.md`, etc. | Plus nécessaires |

**Emplacements des commandes héritées par outil** (exemples — votre outil peut varier) :

- Claude Code : `.claude/commands/openspec/`
- Cursor : `.cursor/commands/openspec-*.md`
- Windsurf : `.windsurf/workflows/openspec-*.md`
- Cline : `.clinerules/workflows/openspec-*.md`
- Roo : `.roo/commands/openspec-*.md`
- GitHub Copilot : `.github/prompts/openspec-*.prompt.md` (extensions IDE uniquement ; non pris en charge dans Copilot CLI)
- Et d'autres (Augment, Continue, Amazon Q, etc.)

La migration détecte les outils que vous avez configurés et nettoie leurs fichiers hérités.

La liste de suppression peut sembler longue, mais ce sont tous des fichiers qu'OpenSpec a créés à l'origine. Votre propre contenu n'est jamais supprimé.

### Ce qui nécessite votre attention

Un fichier nécessite une migration manuelle :

**`openspec/project.md`** — Ce fichier n'est pas supprimé automatiquement car il peut contenir du contexte de projet que vous avez rédigé. Vous devrez :

1. Examiner son contenu
2. Déplacer le contexte utile vers `openspec/config.yaml` (voir les conseils ci-dessous)
3. Supprimer le fichier lorsque vous êtes prêt

**Pourquoi nous avons apporté ce changement :**

L'ancien `project.md` était passif — les agents pouvaient le lire ou non, et pouvaient oublier ce qu'ils avaient lu. Nous avons constaté que la fiabilité était inégale.

Le nouveau contexte de `config.yaml` est **activement injecté dans chaque requête de planification OpenSpec**. Cela signifie que vos conventions de projet, votre pile technologique et vos règles sont toujours présentes lorsque l'IA crée des artefacts. Fiabilité accrue.

**Le compromis :**

Étant donné que le contexte est injecté dans chaque requête, vous voudrez être concis. Concentrez-vous sur ce qui compte vraiment :
- Pile technologique et conventions clés
- Contraintes non évidentes que l'IA doit connaître
- Règles qui étaient souvent ignorées auparavant

Ne vous inquiétez pas de le rendre parfait. Nous apprenons encore ce qui fonctionne le mieux ici, et nous améliorerons le fonctionnement de l'injection de contexte au fur et à mesure de nos expérimentations.

---

## Exécution de la migration

Les commandes `openspec init` et `openspec update` détectent les fichiers hérités et vous guident à travers le même processus de nettoyage. Utilisez celle qui correspond à votre situation :

- Les nouvelles installations utilisent par défaut le profil `core` (`propose`, `explore`, `apply`, `sync`, `archive`).
- Les installations migrées préservent vos workflows précédemment installés en écrivant un profil `custom` si nécessaire.

### Utilisation de `openspec init`

Exécutez cette commande si vous souhaitez ajouter de nouveaux outils ou reconfigurer les outils mis en place :

```bash
openspec init
```

La commande init détecte les fichiers hérités et vous guide à travers le nettoyage :

```
Mise à niveau vers le nouveau OpenSpec

OpenSpec utilise désormais les compétences d'agent, le standard émergent pour
les agents de codage. Cela simplifie votre configuration tout en maintenant
le fonctionnement comme avant.

Fichiers à supprimer
Aucun contenu utilisateur à préserver :
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Fichiers à mettre à jour
Les marqueurs OpenSpec seront supprimés, votre contenu préservé :
  • CLAUDE.md
  • AGENTS.md

Nécessite votre attention
  • openspec/project.md
    Nous ne supprimerons pas ce fichier. Il peut contenir un contexte de projet utile.

    Le nouveau openspec/config.yaml possède une section "context:" pour le
    contexte de planification. Celle-ci est incluse dans chaque requête OpenSpec
    et fonctionne de manière plus fiable que l'ancienne approche project.md.

    Examinez project.md, déplacez tout contenu utile vers la section context
    de config.yaml, puis supprimez le fichier lorsque vous êtes prêt.

? Mettre à niveau et nettoyer les fichiers hérités ? (Y/n)
```

**Ce qui se passe lorsque vous dites oui :**

1. Les répertoires de commandes slash hérités sont supprimés
2. Les marqueurs OpenSpec sont retirés de `CLAUDE.md`, `AGENTS.md`, etc. (votre contenu reste)
3. `openspec/AGENTS.md` est supprimé
4. De nouvelles compétences sont installées dans `.claude/skills/`
5. `openspec/config.yaml` est créé avec un schéma par défaut

### Utilisation de `openspec update`

Exécutez cette commande si vous souhaitez simplement migrer et actualiser vos outils existants vers la dernière version :

```bash
openspec update
```

La commande update détecte et nettoie également les artefacts hérités, puis actualise les compétences/commandes générées pour correspondre à votre profil et vos paramètres de livraison actuels.

### Environnements non interactifs / CI

Pour les migrations scriptées :

```bash
openspec init --force --tools claude
```

Le drapeau `--force` ignore les invites et accepte automatiquement le nettoyage.

---

## Migration de project.md vers config.yaml

L'ancien `openspec/project.md` était un fichier markdown libre pour le contexte du projet. Le nouveau `openspec/config.yaml` est structuré et — surtout — **injecté dans chaque requête de planification** afin que vos conventions soient toujours présentes lorsque l'IA travaille.

### Avant (project.md)

```markdown
# Contexte du projet

Ceci est un monorepo TypeScript utilisant React et Node.js.
Nous utilisons Jest pour les tests et suivons des règles ESLint strictes.
Notre API est RESTful et documentée dans docs/api.md.

## Conventions

- Toutes les API publiques doivent maintenir la rétrocompatibilité
- Les nouvelles fonctionnalités doivent inclure des tests
- Utiliser le format Given/When/Then pour les spécifications
```

### Après (config.yaml)

```yaml
schema: spec-driven

context: |
  Pile technologique : TypeScript, React, Node.js
  Tests : Jest avec React Testing Library
  API : RESTful, documentée dans docs/api.md
  Nous maintenons la rétrocompatibilité pour toutes les API publiques

rules:
  proposal:
    - Inclure un plan de rollback pour les modifications risquées
  specs:
    - Utiliser le format Given/When/Then pour les scénarios
    - Référencer les modèles existants avant d'en inventer de nouveaux
  design:
    - Inclure des diagrammes de séquence pour les flux complexes
```

### Différences clés

| project.md | config.yaml |
|------------|-------------|
| Markdown libre | YAML structuré |
| Un bloc de texte | Contexte et règles par artefact séparés |
| Moment d'utilisation peu clair | Le contexte apparaît dans TOUS les artefacts ; les règles n'apparaissent que dans les artefacts correspondants |
| Aucune sélection de schéma | Le champ explicite `schema:` définit le workflow par défaut |

### Quoi conserver, quoi abandonner

Lors de la migration, soyez sélectif. Demandez-vous : « L'IA a-t-elle besoin de ceci pour *chaque* requête de planification ? »

**Bons candidats pour `context:`**
- Pile technologique (langages, frameworks, bases de données)
- Modèles architecturaux clés (monorepo, microservices, etc.)
- Contraintes non évidentes (« nous ne pouvons pas utiliser la bibliothèque X parce que... »)
- Conventions critiques souvent ignorées

**À déplacer vers `rules:` à la place**
- Formatage spécifique aux artefacts (« utiliser Given/When/Then dans les specs »)
- Critères de revue (« les propositions doivent inclure des plans de rollback »)
- Ceux-ci n'apparaissent que pour l'artefact correspondant, allégeant les autres requêtes

**À omettre entièrement**
- Bonnes pratiques générales que l'IA connaît déjà
- Explications verbeuses qui pourraient être résumées
- Contexte historique qui n'affecte pas le travail actuel

### Étapes de migration

1. **Créer config.yaml** (si pas déjà créé par init) :
   ```yaml
   schema: spec-driven
   ```

2. **Ajouter votre contexte** (soyez concis — ceci est inclus dans chaque requête) :
   ```yaml
   context: |
     Le contexte de votre projet va ici.
     Concentrez-vous sur ce que l'IA a réellement besoin de savoir.
   ```

3. **Ajouter des règles par artefact** (optionnel) :
   ```yaml
   rules:
     proposal:
       - Vos conseils spécifiques aux propositions
     specs:
       - Vos règles de rédaction de spécifications
   ```

4. **Supprimer project.md** une fois que vous avez déplacé tout le contenu utile.

**Ne réfléchissez pas trop.** Commencez par l'essentiel et itérez. Si vous remarquez que l'IA manque quelque chose d'important, ajoutez-le. Si le contexte semble trop volumineux, réduisez-le. C'est un document évolutif.

### Besoin d'aide ? Utilisez cette invite

Si vous ne savez pas comment condenser votre project.md, demandez à votre assistant IA :

```
Je migre de l'ancien project.md d'OpenSpec vers le nouveau format config.yaml.

Voici mon project.md actuel :
[collez le contenu de votre project.md]

Veuillez m'aider à créer un config.yaml avec :
1. Une section `context:` concise (celle-ci est injectée dans chaque requête de planification, donc restez concis — concentrez-vous sur la pile technologique, les contraintes clés et les conventions souvent ignorées)
2. Des `rules:` pour des artefacts spécifiques si le contenu est spécifique à un artefact (par ex., « utiliser Given/When/Then » appartient aux règles de specs, pas au contexte global)

Omettez tout ce qui est générique que les modèles d'IA connaissent déjà. Soyez impitoyable sur la concision.
```

L'IA vous aidera à identifier ce qui est essentiel par rapport à ce qui peut être supprimé.

---

## Les nouvelles commandes

La disponibilité des commandes dépend du profil :

**Par défaut (profil `core`) : | Commande | But |
|---------|------|
| `/opsx:propose` | Créer une modification et générer des artefacts de planification en une seule étape |
| `/opsx:explore` | Réfléchir à des idées sans structure |
| `/opsx:apply` | Implémenter les tâches de tasks.md |
| `/opsx:archive` | Finaliser et archiver la modification |

**Workflow étendu (sélection personnalisée) :**

| Commande | But |
|---------|------|
| `/opsx:new` | Démarrer une nouvelle structure de modification |
| `/opsx:continue` | Créer l'artefact suivant (un à la fois) |
| `/opsx:ff` | Avance rapide — créer les artefacts de planification en une fois |
| `/opsx:verify` | Valider que l'implémentation correspond aux spécifications |
| `/opsx:sync` | Fusionner les spécifications delta dans les spécifications principales |
| `/opsx:bulk-archive` | Archiver plusieurs modifications en une fois |
| `/opsx:onboard` | Workflow d'intégration guidé de bout en bout |

Activez les commandes étendues avec `openspec config profile`, puis exécutez `openspec update`.

### Correspondance des commandes depuis l'héritage

| Héritage | Équivalent OPSX |
|----------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (par défaut) ou `/opsx:new` puis `/opsx:ff` (étendu) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Nouvelles fonctionnalités

Ces fonctionnalités font partie de l'ensemble de commandes du workflow étendu.

**Création granulaire d'artefacts :**
```
/opsx:continue
```
Crée un artefact à la fois en fonction des dépendances. Utilisez ceci lorsque vous souhaitez examiner chaque étape.

**Mode exploration :**
```
/opsx:explore
```
Réfléchissez à des idées avec un partenaire avant de vous engager dans une modification.

---

## Comprendre la nouvelle architecture

### Du verrouillé par phase au fluide

Le workflow legacy imposait une progression linéaire :

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

Si vous êtes en implémentation et réalisez que la conception est fausse ?
Tant pis. Les portes de phase ne permettent pas de revenir facilement en arrière.
```

OPSX utilise des actions, pas des phases :

```
         ┌───────────────────────────────────────────────┐
         │           ACTIONS (not phases)                │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    any order                  │
         └───────────────────────────────────────────────┘
```

### Graphe de dépendances

Les artefacts forment un graphe dirigé. Les dépendances sont des facilitateurs, pas des portes :

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
```

Lorsque vous exécutez `/opsx:continue`, il vérifie ce qui est prêt et propose l'artefact suivant. Vous pouvez également créer plusieurs artefacts prêts dans n'importe quel ordre.

### Compétences vs Commandes

Le système legacy utilisait des fichiers de commande spécifiques à l'outil :

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX utilise le standard émergent des **compétences** :

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Les compétences sont reconnues par plusieurs outils de codage IA et fournissent des métadonnées plus riches.

---

## Continuer les modifications existantes

Vos modifications en cours fonctionnent de manière transparente avec les commandes OPSX.

**Vous avez une modification active du workflow legacy ?**

```
/opsx:apply add-my-feature
```

OPSX lit les artefacts existants et reprend là où vous vous êtes arrêté.

**Vous souhaitez ajouter plus d'artefacts à une modification existante ?**

```
/opsx:continue add-my-feature
```

Affiche ce qui est prêt à être créé en fonction de ce qui existe déjà.

**Besoin de voir le statut ?**

```bash
openspec status --change add-my-feature
```

---

## Le nouveau système de configuration

### Structure de config.yaml

```yaml
# Required: Default schema for new changes
schema: spec-driven

# Optional: Project context (max 50KB)
# Injected into ALL artifact instructions
context: |
  Your project background, tech stack,
  conventions, and constraints.

# Optional: Per-artifact rules
# Only injected into matching artifacts
rules:
  proposal:
    - Include rollback plan
  specs:
    - Use Given/When/Then format
  design:
    - Document fallback strategies
  tasks:
    - Break into 2-hour maximum chunks
```

### Résolution du schéma

Pour déterminer quel schéma utiliser, OPSX vérifie dans l'ordre :

1. **Drapeau CLI** : `--schema <name>` (priorité la plus élevée)
2. **Métadonnées de modification** : `.openspec.yaml` dans le répertoire de la modification
3. **Configuration du projet** : `openspec/config.yaml`
4. **Par défaut** : `spec-driven`

### Schémas disponibles

| Schéma | Artefacts | Idéal pour |
|--------|-----------|------------|
| `spec-driven` | proposal → specs → design → tasks | La plupart des projets |

Lister tous les schémas disponibles :

```bash
openspec schemas
```

### Schémas personnalisés

Créez votre propre workflow :

```bash
openspec schema init my-workflow
```

Ou bifurquez-en un existant :

```bash
openspec schema fork spec-driven my-workflow
```

Voir [Personnalisation](customization.md) pour les détails.

---

## Dépannage

### "Legacy files detected in non-interactive mode"

Vous exécutez dans un environnement CI ou non interactif. Utilisez :

```bash
openspec init --force
```

### Les commandes n'apparaissent pas après la migration

Redémarrez votre IDE. Les compétences sont détectées au démarrage.

### "Unknown artifact ID in rules"

Vérifiez que vos clés `rules:` correspondent aux identifiants d'artefact de votre schéma :

- **spec-driven** : `proposal`, `specs`, `design`, `tasks`

Exécutez ceci pour voir les identifiants d'artefact valides :

```bash
openspec schemas --json
```

### La configuration n'est pas appliquée

1. Assurez-vous que le fichier est à `openspec/config.yaml` (pas `.yml`)
2. Validez la syntaxe YAML
3. Les modifications de configuration prennent effet immédiatement — aucun redémarrage nécessaire

### project.md non migré

Le système conserve intentionnellement `project.md` car il peut contenir votre contenu personnalisé. Révisez-le manuellement, déplacez les parties utiles vers `config.yaml`, puis supprimez-le.

### Vous voulez voir ce qui serait nettoyé ?

Exécutez init et refusez l'invite de nettoyage — vous verrez le résumé complet de détection sans qu'aucune modification ne soit apportée.

---

## Référence rapide

### Fichiers après la migration

```
project/
├── openspec/
│   ├── specs/                    # Unchanged
│   ├── changes/                  # Unchanged
│   │   └── archive/              # Unchanged
│   └── config.yaml               # NEW: Project configuration
├── .claude/
│   └── skills/                   # NEW: OPSX skills
│       ├── openspec-propose/     # default core profile
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # expanded profile adds new/continue/ff/etc.
├── CLAUDE.md                     # OpenSpec markers removed, your content preserved
└── AGENTS.md                     # OpenSpec markers removed, your content preserved
```

### Ce qui a disparu

- `.claude/commands/openspec/` — remplacé par `.claude/skills/`
- `openspec/AGENTS.md` — obsolète
- `openspec/project.md` — migrer vers `config.yaml`, puis supprimer
- Blocs de marqueurs OpenSpec dans `CLAUDE.md`, `AGENTS.md`, etc.

### Tableau de commandes

```text
/opsx:propose      Start quickly (default core profile)
/opsx:apply        Implement tasks
/opsx:archive      Finish and archive

# Expanded workflow (if enabled):
/opsx:new          Scaffold a change
/opsx:continue     Create next artifact
/opsx:ff           Create planning artifacts
```

---

## Obtenir de l'aide

- **Discord** : [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues** : [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Documentation** : [docs/opsx.md](opsx.md) pour la référence OPSX complète