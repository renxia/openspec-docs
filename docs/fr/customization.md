# Personnalisation

OpenSpec propose trois niveaux de personnalisation :

| Niveau | Ce qu'il fait | Idéal pour |
|--------|---------------|------------|
| **Configuration du projet** | Définir des valeurs par défaut, injecter du contexte/règles | La plupart des équipes |
| **Schémas personnalisés** | Définir vos propres artefacts de workflow | Équipes avec des processus uniques |
| **Remplacements globaux** | Partager des schémas sur tous les projets | Utilisateurs avancés |

---

## Configuration du projet

Le fichier `openspec/config.yaml` est le moyen le plus simple de personnaliser OpenSpec pour votre équipe. Il vous permet de :

- **Définir un schéma par défaut** - Ignorer `--schema` sur chaque commande
- **Injecter le contexte du projet** - L'IA voit votre stack technique, conventions, etc.
- **Ajouter des règles par artefact** - Règles personnalisées pour des artefacts spécifiques

### Configuration rapide

```bash
openspec init
```

Cela vous guide dans la création d'une configuration de manière interactive. Ou créez-en une manuellement :

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API style: RESTful, documented in docs/api.md
  Testing: Jest + React Testing Library
  We value backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones
```

### Fonctionnement

**Schéma par défaut :**

```bash
# Without config
openspec new change my-feature --schema spec-driven

# With config - schema is automatic
openspec new change my-feature
```

**Injection de contexte et de règles :**

Lors de la génération de tout artefact, votre contexte et vos règles sont injectés dans le prompt de l'IA :

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Include rollback plan
- Identify affected teams
</rules>

<template>
[Schema's built-in template]
</template>
```

- Le **contexte** apparaît dans TOUS les artefacts
- Les **règles** n'apparaissent que pour l'artefact correspondant

### Ordre de résolution des schémas

Lorsque OpenSpec a besoin d'un schéma, il vérifie dans cet ordre :

1. Flag CLI : `--schema <name>`
2. Métadonnées de changement (`.openspec.yaml` dans le dossier du changement)
3. Configuration du projet (`openspec/config.yaml`)
4. Par défaut (`spec-driven`)

---

## Schémas personnalisés

Lorsque la configuration du projet n'est pas suffisante, créez votre propre schéma avec un workflow entièrement personnalisé. Les schémas personnalisés résident dans le répertoire `openspec/schemas/` de votre projet et sont versionnés avec votre code.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Project config
│   ├── schemas/           # Custom schemas live here
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Your changes
└── src/
```

### Forker un schéma existant

Le moyen le plus rapide de personnaliser est de forker un schéma intégré :

```bash
openspec schema fork spec-driven my-workflow
```

Cela copie l'ensemble du schéma `spec-driven` vers `openspec/schemas/my-workflow/` où vous pouvez l'éditer librement.

**Ce que vous obtenez :**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Workflow definition
└── templates/
    ├── proposal.md       # Template for proposal artifact
    ├── spec.md           # Template for specs
    ├── design.md         # Template for design
    └── tasks.md          # Template for tasks
```

Modifiez maintenant `schema.yaml` pour changer le workflow, ou modifiez les templates pour changer ce que l'IA génère.

### Créer un schéma à partir de zéro

Pour un workflow entièrement nouveau :

```bash
# Interactive
openspec schema init research-first

# Non-interactive
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Structure du schéma

Un schéma définit les artefacts dans votre workflow et leurs dépendances mutuelles :

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: My team's custom workflow

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initial proposal document
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Technical design
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal    # Can't create design until proposal exists

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Champs clés :**

| Champ | Objectif |
|-------|-----------|
| `id` | Identifiant unique, utilisé dans les commandes et les règles |
| `generates` | Nom du fichier de sortie (prend en charge les globs comme `specs/**/*.md`) |
| `template` | Fichier template dans le répertoire `templates/` |
| `instruction` | Instructions de l'IA pour créer cet artefact |
| `requires` | Dépendances - quels artefacts doivent exister en premier |

### Modèles

Les modèles sont des fichiers markdown qui guident l'IA. Ils sont injectés dans le prompt lors de la création de cet artefact.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

Les modèles peuvent inclure :
- Des en-têtes de section que l'IA doit remplir
- Des commentaires HTML avec des instructions pour l'IA
- Des formats d'exemple montrant la structure attendue

### Valider votre schéma

Avant d'utiliser un schéma personnalisé, validez-le :

```bash
openspec schema validate my-workflow
```

Cela vérifie :
- La syntaxe de `schema.yaml` est correcte
- Tous les templates référencés existent
- Pas de dépendances circulaires
- Les IDs des artefacts sont valides

### Utiliser votre schéma personnalisé

Une fois créé, utilisez votre schéma avec :

```bash
# Specify on command
openspec new change feature --schema my-workflow

# Or set as default in config.yaml
schema: my-workflow
```

### Déboguer la résolution de schéma

Vous ne savez pas quel schéma est utilisé ? Vérifiez avec :

```bash
# See where a specific schema resolves from
openspec schema which my-workflow

# List all available schemas
openspec schema which --all
```

La sortie indique s'il provient de votre projet, du répertoire utilisateur ou du package :

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Note :** OpenSpec prend également en charge les schémas au niveau utilisateur dans `~/.local/share/openspec/schemas/` pour le partage entre projets, mais les schémas au niveau projet dans `openspec/schemas/` sont recommandés car ils sont versionnés avec votre code.

---

## Exemples

### Workflow d'itération rapide

Un workflow minimal pour des itérations rapides :

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Quick proposal
    template: proposal.md
    instruction: |
      Create a brief proposal for this change.
      Focus on what and why, skip detailed specs.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Ajouter un artefact de revue

Forkez le schéma par défaut et ajoutez une étape de revue :

```bash
openspec schema fork spec-driven with-review
```

Modifiez ensuite `schema.yaml` pour ajouter :

```yaml
  - id: review
    generates: review.md
    description: Pre-implementation review checklist
    template: review.md
    instruction: |
      Create a review checklist based on the design.
      Include security, performance, and testing considerations.
    requires:
      - design

  - id: tasks
    # ... existing tasks config ...
    requires:
      - specs
      - design
      - review    # Now tasks require review too
```

---

## Schémas communautaires

OpenSpec prend également en charge les schémas maintenus par la communauté et distribués via des dépôts autonomes. Ceux-ci fournissent des workflows orientés qui intègrent OpenSpec avec d'autres outils ou systèmes, de la même manière que le [catalogue d'extensions communautaires de github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) fonctionne pour spec-kit.

Les schémas communautaires ne sont pas intégrés au cœur d'OpenSpec — ils résident dans leurs propres dépôts avec leur propre cycle de publication. Pour en utiliser un, copiez le bundle de schéma dans le répertoire `openspec/schemas/<schema-name>/` de votre projet (le README de chaque dépôt contient les instructions d'installation).

| Schéma | Mainteneur | Dépôt | Description |
|--------|-----------|-------|-------------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Intègre la gouvernance des artefacts d'OpenSpec avec les compétences d'exécution de [obra/superpowers](https://github.com/obra/superpowers) (brainstorming, writing-plans, TDD via subagents, revue de code, finalisation). Ajoute un artefact `retrospective` basé sur les preuves qui comble un manque que Superpowers ne couvre pas nativement. |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | Workflow centré sur le chef de projet. Exécute le pipeline de planification de [nanopm](https://github.com/nmrtn/nanopm) (audit → stratégie → feuille de route → PRD) en amont de l'implémentation. Fait le lien entre la planification produit et le workflow d'ingénierie piloté par les spécifications d'OpenSpec. Les artefacts sont lus depuis `.nanopm/` si présent — la proposition utilise l'audit, la conception utilise la stratégie, et les tâches utilisent le découpage du PRD. |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | Livrets de tests end-to-end au niveau des capacités. Chaque capacité obtient une spécification immuable, un modèle de tâches immuable et un enregistrement d'exécution horodaté par exécution. Les assertions ne portent que sur des comportements observables (statut HTTP, corps de la réponse, état persistant — jamais de sous-chaînes de log) ; chaque exécution enregistre l'heure de début/fin UTC, la durée et une estimation de la consommation de tokens LLM. |

> Vous voulez contribuer un schéma communautaire ? Ouvrez une issue avec un lien vers votre dépôt, ou soumettez une PR ajoutant une ligne à ce tableau.

---

## Voir aussi

- [Référence CLI : Commandes de schéma](cli.md#schema-commands) - Documentation complète des commandes