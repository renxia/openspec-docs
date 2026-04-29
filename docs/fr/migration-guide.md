# Migration vers OPSX

Ce guide vous accompagne dans la transition de l'ancien workflow OpenSpec vers OPSX. La migration est conçue pour être fluide — votre travail existant est préservé, et le nouveau système offre plus de flexibilité.

## Qu'est-ce qui change ?

OPSX remplace l'ancien workflow à phases verrouillées par une approche fluide et basée sur des actions. Voici le changement clé :

| Aspect | Ancien système | OPSX |
|--------|----------------|------|
| **Commandes** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Par défaut : `/opsx:propose`, `/opsx:apply`, `/opsx:archive` (commandes de workflow étendues en option) |
| **Workflow** | Créer tous les artefacts en une fois | Créer de manière incrémentielle ou en une fois — à vous de choisir |
| **Retour en arrière** | Portes de phase rigides | Naturel — mettez à jour n'importe quel artefact à tout moment |
| **Personnalisation** | Structure fixe | Piloté par schéma, entièrement modifiable |
| **Configuration** | `CLAUDE.md` avec marqueurs + `project.md` | Configuration propre dans `openspec/config.yaml` |

**Le changement de philosophie :** Le travail n'est pas linéaire. OPSX cesse de prétendre qu'il l'est.

---

## Avant de commencer

### Votre travail existant est préservé

Le processus de migration est conçu en gardant la préservation à l'esprit :

- **Modifications actives dans `openspec/changes/`** — Entièrement préservées. Vous pouvez les poursuivre avec les commandes OPSX.
- **Modifications archivées** — Intactes. Votre historique reste complet.
- **Spécifications principales dans `openspec/specs/`** — Intactes. Ce sont vos sources de vérité.
- **Votre contenu dans CLAUDE.md, AGENTS.md, etc.** — Préservé. Seuls les blocs de marqueurs OpenSpec sont supprimés ; tout ce que vous avez écrit reste.

### Ce qui est supprimé

Uniquement les fichiers gérés par OpenSpec qui sont remplacés :

| Élément | Pourquoi |
|---------|----------|
| Répertoires/fichiers de commandes slash hérités | Remplacés par le nouveau système de compétences |
| `openspec/AGENTS.md` | Déclencheur de flux de travail obsolète |
| Marqueurs OpenSpec dans `CLAUDE.md`, `AGENTS.md`, etc. | Plus nécessaires |

**Emplacements des commandes héritées par outil** (exemples — votre outil peut varier) :

- Claude Code : `.claude/commands/openspec/`
- Cursor : `.cursor/commands/openspec-*.md`
- Windsurf : `.windsurf/workflows/openspec-*.md`
- Cline : `.clinerules/workflows/openspec-*.md`
- Roo : `.roo/commands/openspec-*.md`
- GitHub Copilot : `.github/prompts/openspec-*.prompt.md` (uniquement les extensions IDE ; non supporté dans Copilot CLI)
- Et d'autres (Augment, Continue, Amazon Q, etc.)

La migration détecte les outils que vous avez configurés et nettoie leurs fichiers hérités.

La liste des suppressions peut sembler longue, mais ce sont tous des fichiers qu'OpenSpec a créés à l'origine. Votre propre contenu n'est jamais supprimé.

### Ce qui nécessite votre attention

Un fichier nécessite une migration manuelle :

**`openspec/project.md`** — Ce fichier n'est pas supprimé automatiquement car il peut contenir du contexte de projet que vous avez écrit. Vous devrez :

1. Examiner son contenu
2. Déplacer le contexte utile vers `openspec/config.yaml` (voir les conseils ci-dessous)
3. Supprimer le fichier une fois prêt

**Pourquoi nous avons apporté cette modification :**

L'ancien `project.md` était passif — les agents pouvaient le lire, pouvaient ne pas le lire, pouvaient oublier ce qu'ils avaient lu. Nous avons constaté que la fiabilité était incohérente.

Le nouveau contexte dans `config.yaml` est **activement injecté dans chaque requête de planification OpenSpec**. Cela signifie que vos conventions de projet, votre pile technologique et vos règles sont toujours présents lorsque l'IA crée des artefacts. Fiabilité accrue.

**Le compromis :**

Étant donné que le contexte est injecté dans chaque requête, vous voudrez être concis. Concentrez-vous sur ce qui compte vraiment :
- La pile technologique et les conventions clés
- Les contraintes non évidentes dont l'IA doit avoir connaissance
- Les règles qui étaient souvent ignorées auparavant

Ne vous souciez pas de la perfection. Nous apprenons encore ce qui fonctionne le mieux ici, et nous améliorerons le fonctionnement de l'injection de contexte au fur et à mesure de nos expérimentations.

---

## Exécuter la migration

`openspec init` et `openspec update` détectent tous deux les fichiers hérités et vous guident à travers le même processus de nettoyage. Utilisez celui qui correspond à votre situation :

- Les nouvelles installations utilisent par défaut le profil `core` (`propose`, `explore`, `apply`, `archive`).
- Les installations migrées préservent vos flux de travail précédemment installés en écrivant un profil `custom` si nécessaire.

### Utiliser `openspec init`

Exécutez cette commande si vous souhaitez ajouter de nouveaux outils ou reconfigurer les outils configurés :

```bash
openspec init
```

La commande init détecte les fichiers hérités et vous guide à travers le nettoyage :

```
Mise à niveau vers le nouveau OpenSpec

OpenSpec utilise désormais les compétences d'agent, la norme émergente dans les agents de codage.
Cela simplifie votre configuration tout en maintenant le même fonctionnement qu'avant.

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

    Le nouveau openspec/config.yaml possède une section "context:" pour le contexte de planification.
    Cela est inclus dans chaque requête OpenSpec et fonctionne de manière plus fiable que l'ancienne approche project.md.

    Examinez project.md, déplacez tout contenu utile vers la section context de config.yaml,
    puis supprimez le fichier une fois prêt.

? Mettre à niveau et nettoyer les fichiers hérités ? (O/n)
```

**Ce qui se passe lorsque vous répondez oui :**

1. Les répertoires de commandes slash hérités sont supprimés
2. Les marqueurs OpenSpec sont retirés de `CLAUDE.md`, `AGENTS.md`, etc. (votre contenu reste)
3. `openspec/AGENTS.md` est supprimé
4. De nouvelles compétences sont installées dans `.claude/skills/`
5. `openspec/config.yaml` est créé avec un schéma par défaut

### Utiliser `openspec update`

Exécutez cette commande si vous souhaitez simplement migrer et mettre à jour vos outils existants vers la dernière version :

```bash
openspec update
```

La commande update détecte et nettoie également les artefacts hérités, puis rafraîchit les compétences/commandes générées pour correspondre à votre profil et paramètres de livraison actuels.

### Environnements non interactifs / CI

Pour les migrations scriptées :

```bash
openspec init --force --tools claude
```

L'indicateur `--force` saute les invites et accepte automatiquement le nettoyage.

---

## Migrer project.md vers config.yaml

L'ancien `openspec/project.md` était un fichier markdown libre pour le contexte de projet. Le nouveau `openspec/config.yaml` est structuré et — cruciallement — **injecté dans chaque requête de planification** afin que vos conventions soient toujours présentes lorsque l'IA travaille.

### Avant (project.md)

```markdown
# Contexte du projet

Il s'agit d'un monorepo TypeScript utilisant React et Node.js.
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
    - Inclure un plan de retour en arrière pour les changements risqués
  specs:
    - Utiliser le format Given/When/Then pour les scénarios
    - Référencer les schémas existants avant d'en inventer de nouveaux
  design:
    - Inclure des diagrammes de séquence pour les flux complexes
```

### Différences clés

| project.md | config.yaml |
|------------|-------------|
| Markdown libre | YAML structuré |
| Un bloc de texte | Contexte séparé et règles par artefact |
| Utilisation peu claire | Le contexte apparaît dans TOUS les artefacts ; les règles n'apparaissent que dans les artefacts correspondants |
| Pas de sélection de schéma | Le champ `schema:` explicite définit le flux de travail par défaut |

### Que conserver, que supprimer

Lors de la migration, soyez sélectif. Demandez-vous : « L'IA a-t-elle besoin de ceci pour *chaque* requête de planification ? »

**Bons candidats pour `context:`**
- Pile technologique (langages, frameworks, bases de données)
- Schémas architecturaux clés (monorepo, microservices, etc.)
- Contraintes non évidentes (« nous ne pouvons pas utiliser la bibliothèque X parce que... »)
- Conventions critiques souvent ignorées

**Déplacer vers `rules:` à la place**
- Formatage spécifique aux artefacts (« utiliser Given/When/Then dans les specs »)
- Critères de révision (« les propositions doivent inclure des plans de retour en arrière »)
- Cela n'apparaît que pour l'artefact correspondant, allégeant les autres requêtes

**Omettre entièrement**
- Les meilleures pratiques générales que l'IA connaît déjà
- Les explications verbeuses qui pourraient être résumées
- Le contexte historique qui n'affecte pas le travail actuel

### Étapes de migration

1. **Créer config.yaml** (si pas déjà créé par init) :
   ```yaml
   schema: spec-driven
   ```

2. **Ajouter votre contexte** (soyez concis — cela entre dans chaque requête) :
   ```yaml
   context: |
     Votre contexte de projet va ici.
     Concentrez-vous sur ce que l'IA a réellement besoin de savoir.
   ```

3. **Ajouter les règles par artefact** (optionnel) :
   ```yaml
   rules:
     proposal:
       - Vos directives spécifiques aux propositions
     specs:
       - Vos règles de rédaction de spécifications
   ```

4. **Supprimer project.md** une fois que vous avez déplacé tout le contenu utile.

**Ne vous en faites pas trop.** Commencez par l'essentiel et itérez. Si vous remarquez que l'IA manque quelque chose d'important, ajoutez-le. Si le contexte semble gonflé, réduisez-le. C'est un document vivant.

### Besoin d'aide ? Utilisez ce prompt

Si vous n'êtes pas sûr de la façon de distiller votre project.md, demandez à votre assistant IA :

```
Je migre de l'ancien project.md d'OpenSpec vers le nouveau format config.yaml.

Voici mon project.md actuel :
[collez le contenu de votre project.md]

Aidez-moi à créer un config.yaml avec :
1. Une section `context:` concise (cela est injecté dans chaque requête de planification, donc restez concis — concentrez-vous sur la pile technologique, les contraintes clés et les conventions souvent ignorées)
2. Des `rules:` pour des artefacts spécifiques si du contenu est spécifique à un artefact (par exemple, « utiliser Given/When/Then » appartient aux règles des specs, pas au contexte global)

Omettez tout ce qui est générique et que les modèles d'IA connaissent déjà. Soyez impitoyable sur la brièveté.
```

L'IA vous aidera à identifier ce qui est essentiel vs. ce qui peut être réduit.

---

## Les nouvelles commandes

La disponibilité des commandes dépend du profil :

**Par défaut (profil `core`) :**

| Commande | Objectif |
|----------|----------|
| `/opsx:propose` | Créer une modification et générer les artefacts de planification en une étape |
| `/opsx:explore` | Réfléchir à des idées sans structure |
| `/opsx:apply` | Implémenter les tâches de tasks.md |
| `/opsx:archive` | Finaliser et archiver la modification |

**Flux de travail étendu (sélection personnalisée) :**

| Commande | Objectif |
|----------|----------|
| `/opsx:new` | Démarrer un nouveau squelette de modification |
| `/opsx:continue` | Créer l'artefact suivant (un à la fois) |
| `/opsx:ff` | Avance rapide — créer les artefacts de planification d'un coup |
| `/opsx:verify` | Valider que l'implémentation correspond aux spécifications |
| `/opsx:sync` | Aperçu/fusion de spécifications sans archiver |
| `/opsx:bulk-archive` | Archiver plusieurs modifications à la fois |
| `/opsx:onboard` | Flux de travail d'intégration guidé de bout en bout |

Activez les commandes étendues avec `openspec config profile`, puis exécutez `openspec update`.

### Correspondance des commandes depuis l'hérité

| Hérité | Équivalent OPSX |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (par défaut) ou `/opsx:new` puis `/opsx:ff` (étendu) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Nouvelles fonctionnalités

Ces fonctionnalités font partie de l'ensemble de commandes du flux de travail étendu.

**Création granulaire d'artefacts :**
```
/opsx:continue
```
Crée un artefact à la fois en fonction des dépendances. Utilisez cette commande lorsque vous souhaitez examiner chaque étape.

**Mode exploration :**
```
/opsx:explore
```
Réfléchissez à des idées avec un partenaire avant de vous engager dans une modification.

---

## Comprendre la nouvelle architecture

### Des phases verrouillées à un flux fluide

L'ancien processus imposait une progression linéaire :

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ PLANIFICATION│ ───► │IMPLÉMENTATION│ ───► │ ARCHIVAGE    │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

Si vous êtes en phase d'implémentation et réalisez que la conception est erronée ?
Tant pis. Les portes de phase ne vous permettent pas de revenir facilement.
```

OPSX utilise des actions, pas des phases :

```
         ┌───────────────────────────────────────────────┐
         │           ACTIONS (pas des phases)            │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    dans n'importe quel ordre  │
         └───────────────────────────────────────────────┘
```

### Graphe de dépendances

Les artefacts forment un graphe orienté. Les dépendances sont des facilitateurs, pas des portes :

```
                        proposal
                       (nœud racine)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (nécessite:                  (nécessite:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (nécessite:
                     specs, design)
```

Lorsque vous exécutez `/opsx:continue`, il vérifie ce qui est prêt et propose l'artefact suivant. Vous pouvez également créer plusieurs artefacts prêts dans n'importe quel ordre.

### Compétences vs Commandes

L'ancien système utilisait des fichiers de commande spécifiques à un outil :

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX utilise le standard émergent des **compétences** (skills) :

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

## Continuer des changements existants

Vos changements en cours fonctionnent de manière transparente avec les commandes OPSX.

**Avez-vous un changement actif de l'ancien processus ?**

```
/opsx:apply add-my-feature
```

OPSX lit les artefacts existants et reprend là où vous vous étiez arrêté.

**Voulez-vous ajouter plus d'artefacts à un changement existant ?**

```
/opsx:continue add-my-feature
```

Affiche ce qui est prêt à créer en fonction de ce qui existe déjà.

**Besoin de voir l'état ?**

```bash
openspec status --change add-my-feature
```

---

## Le nouveau système de configuration

### Structure de config.yaml

```yaml
# Requis : Schéma par défaut pour les nouveaux changements
schema: spec-driven

# Optionnel : Contexte du projet (max 50 Ko)
# Injecté dans TOUTES les instructions d'artefacts
context: |
  Votre contexte de projet, pile technique,
  conventions et contraintes.

# Optionnel : Règles par artefact
# Injectées uniquement dans les artefacts correspondants
rules:
  proposal:
    - Inclure un plan de retour arrière
  specs:
    - Utiliser le format Given/When/Then
  design:
    - Documenter les stratégies de repli
  tasks:
    - Découper en blocs de 2 heures maximum
```

### Résolution du schéma

Lors de la détermination du schéma à utiliser, OPSX vérifie dans l'ordre :

1. **Flag CLI** : `--schema <nom>` (priorité la plus élevée)
2. **Métadonnées du changement** : `.openspec.yaml` dans le répertoire du changement
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

Créez votre propre processus :

```bash
openspec schema init my-workflow
```

Ou dérivez-en un existant :

```bash
openspec schema fork spec-driven my-workflow
```

Voir [Personnalisation](customization.md) pour les détails.

---

## Dépannage

### « Legacy files detected in non-interactive mode »

Vous exécutez dans un environnement CI ou non interactif. Utilisez :

```bash
openspec init --force
```

### Commandes non affichées après la migration

Redémarrez votre IDE. Les compétences sont détectées au démarrage.

### « Unknown artifact ID in rules »

Vérifiez que vos clés `rules:` correspondent aux identifiants d'artefacts de votre schéma :

- **spec-driven** : `proposal`, `specs`, `design`, `tasks`

Exécutez ceci pour voir les identifiants d'artefacts valides :

```bash
openspec schemas --json
```

### Configuration non appliquée

1. Assurez-vous que le fichier est à `openspec/config.yaml` (pas `.yml`)
2. Validez la syntaxe YAML
3. Les modifications de configuration prennent effet immédiatement — aucun redémarrage nécessaire

### project.md non migré

Le système préserve intentionnellement `project.md` car il peut contenir votre contenu personnalisé. Examinez-le manuellement, déplacez les parties utiles vers `config.yaml`, puis supprimez-le.

### Vous voulez voir ce qui serait nettoyé ?

Exécutez init et refusez l'invite de nettoyage — vous verrez le résumé complet de la détection sans qu'aucune modification ne soit effectuée.

---

## Référence rapide

### Fichiers après migration

```
project/
├── openspec/
│   ├── specs/                    # Inchangé
│   ├── changes/                  # Inchangé
│   │   └── archive/              # Inchangé
│   └── config.yaml               # NOUVEAU : Configuration du projet
├── .claude/
│   └── skills/                   # NOUVEAU : Compétences OPSX
│       ├── openspec-propose/     # profil de base par défaut
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       └── ...                   # le profil étendu ajoute new/continue/ff/etc.
├── CLAUDE.md                     # Marqueurs OpenSpec supprimés, votre contenu préservé
└── AGENTS.md                     # Marqueurs OpenSpec supprimés, votre contenu préservé
```

### Ce qui a disparu

- `.claude/commands/openspec/` — remplacé par `.claude/skills/`
- `openspec/AGENTS.md` — obsolète
- `openspec/project.md` — migrer vers `config.yaml`, puis supprimer
- Blocs de marqueurs OpenSpec dans `CLAUDE.md`, `AGENTS.md`, etc.

### Aide-mémoire des commandes

```text
/opsx:propose      Démarrer rapidement (profil de base par défaut)
/opsx:apply        Implémenter les tâches
/opsx:archive      Terminer et archiver

# Processus étendu (si activé) :
/opsx:new          Créer une ébauche de changement
/opsx:continue     Créer l'artefact suivant
/opsx:ff           Créer les artefacts de planification
```

---

## Obtenir de l'aide

- **Discord** : [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues** : [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Documentation** : [docs/opsx.md](opsx.md) pour la référence complète d'OPSX