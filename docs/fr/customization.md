# Personnalisation

OpenSpec propose trois niveaux de personnalisation :

| Niveau | Fonction | Idéal pour |
|--------|----------|------------|
| **Configuration de projet** | Définir des valeurs par défaut, injecter du contexte/des règles | La plupart des équipes |
| **Schémas personnalisés** | Définir vos propres artefacts de workflow | Les équipes avec des processus uniques |
| **Remplacements globaux** | Partager des schémas entre tous les projets | Les utilisateurs avancés |

---

## Configuration du projet

Le fichier `openspec/config.yaml` est le moyen le plus simple de personnaliser OpenSpec pour votre équipe. Il vous permet de :

- **Définir un schéma par défaut** - Éviter de spécifier `--schema` à chaque commande
- **Injecter le contexte du projet** - L'IA voit votre pile technique, conventions, etc.
- **Ajouter des règles par artefact** - Des règles personnalisées pour des artefacts spécifiques

### Mise en route rapide

```bash
openspec init
```

Cela vous guide dans la création d'une configuration de manière interactive. Ou créez-la manuellement :

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
# Sans configuration
openspec new change my-feature --schema spec-driven

# Avec configuration - le schéma est automatique
openspec new change my-feature
```

**Injection du contexte et des règles :**

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
[Schéma intégré]
</template>
```

- **Le contexte** apparaît dans TOUS les artefacts
- **Les règles** n'apparaissent QUE pour l'artefact correspondant

### Ordre de résolution des schémas

Lorsqu'OpenSpec a besoin d'un schéma, il vérifie dans cet ordre :

1. Option en ligne de commande : `--schema <nom>`
2. Métadonnées de la modification (`.openspec.yaml` dans le dossier de la modification)
3. Configuration du projet (`openspec/config.yaml`)
4. Par défaut (`spec-driven`)

---

## Schémas personnalisés

Lorsque la configuration du projet ne suffit pas, créez votre propre schéma avec un workflow entièrement personnalisé. Les schémas personnalisés se trouvent dans le répertoire `openspec/schemas/` de votre projet et sont versionnés avec votre code.

```text
votre-projet/
├── openspec/
│   ├── config.yaml        # Configuration du projet
│   ├── schemas/           # Les schémas personnalisés se trouvent ici
│   │   └── mon-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Vos modifications
└── src/
```

### Fork d'un schéma existant

La façon la plus rapide de personnaliser est de forker un schéma intégré :

```bash
openspec schema fork spec-driven mon-workflow
```

Cela copie l'intégralité du schéma `spec-driven` dans `openspec/schemas/mon-workflow/` où vous pouvez le modifier librement.

**Ce que vous obtenez :**

```text
openspec/schemas/mon-workflow/
├── schema.yaml           # Définition du workflow
└── templates/
    ├── proposal.md       # Modèle pour l'artefact proposition
    ├── spec.md           # Modèle pour les spécifications
    ├── design.md         # Modèle pour la conception
    └── tasks.md          # Modèle pour les tâches
```

Maintenant, modifiez `schema.yaml` pour changer le workflow, ou modifiez les modèles pour changer ce que l'IA génère.

### Créer un schéma from scratch

Pour un workflow entièrement nouveau :

```bash
# Interactif
openspec schema init research-first

# Non interactif
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Structure d'un schéma

Un schéma définit les artefacts de votre workflow et leurs dépendances :

```yaml
# openspec/schemas/mon-workflow/schema.yaml
name: mon-workflow
version: 1
description: Workflow personnalisé de mon équipe

artifacts:
  - id: proposal
    generates: proposal.md
    description: Document de proposition initial
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Conception technique
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal    # Cannot create design until proposal exists

  - id: tasks
    generates: tasks.md
    description: Liste de contrôle d'implémentation
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Champs clés :**

| Champ | Objectif |
|-------|----------|
| `id` | Identifiant unique, utilisé dans les commandes et les règles |
| `generates` | Nom du fichier de sortie (supporte les glob comme `specs/**/*.md`) |
| `template` | Fichier modèle dans le répertoire `templates/` |
| `instruction` | Instructions pour l'IA pour créer cet artefact |
| `requires` | Dépendances - quels artefacts doivent exister en premier |

### Modèles

Les modèles sont des fichiers markdown qui guident l'IA. Ils sont injectés dans le prompt lors de la création de l'artefact correspondant.

```markdown
<!-- templates/proposal.md -->
## Pourquoi

<!-- Expliquez la motivation de ce changement. Quel problème résout-il ? -->

## Qu'est-ce qui change

<!-- Décrivez ce qui va changer. Soyez précis sur les nouvelles fonctionnalités ou modifications. -->

## Impact

<!-- Code, API, dépendances, systèmes affectés -->
```

Les modèles peuvent inclure :
- Des en-têtes de section que l'IA doit remplir
- Des commentaires HTML avec des instructions pour l'IA
- Des exemples de format montrant la structure attendue

### Valider votre schéma

Avant d'utiliser un schéma personnalisé, validez-le :

```bash
openspec schema validate mon-workflow
```

Cela vérifie :
- La syntaxe de `schema.yaml` est correcte
- Tous les modèles référencés existent
- Il n'y a pas de dépendances circulaires
- Les identifiants des artefacts sont valides

### Utiliser votre schéma personnalisé

Une fois créé, utilisez votre schéma avec :

```bash
# Spécifier lors de la commande
openspec new change feature --schema mon-workflow

# Ou définir comme défaut dans config.yaml
schema: mon-workflow
```

### Déboguer la résolution des schémas

Vous ne savez pas quel schéma est utilisé ? Vérifiez avec :

```bash
# Voir d'où provient un schéma spécifique
openspec schema which mon-workflow

# Lister tous les schémas disponibles
openspec schema which --all
```

La sortie indique s'il provient de votre projet, du répertoire utilisateur ou du package :

```text
Schema: mon-workflow
Source: project
Path: /path/to/project/openspec/schemas/mon-workflow
```

---

> **Note :** OpenSpec supporte également des schémas au niveau utilisateur dans `~/.local/share/openspec/schemas/` pour les partager entre projets, mais les schémas au niveau projet dans `openspec/schemas/` sont recommandés car ils sont versionnés avec votre code.

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

Fork le schéma par défaut et ajoutez une étape de revue :

```bash
openspec schema fork spec-driven with-review
```

Puis modifiez `schema.yaml` pour ajouter :

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
    # ... configuration existante des tâches ...
    requires:
      - specs
      - design
      - review    # Maintenant les tâches nécessitent aussi la revue
```

---

## Voir aussi

- [Référence CLI : Commandes de schéma](cli.md#schema-commands) - Documentation complète des commandes