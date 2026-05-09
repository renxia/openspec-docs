# Personnalisation

OpenSpec propose trois niveaux de personnalisation :

| Niveau | Ce qu'il fait | Idéal pour |
|--------|---------------|------------|
| **Configuration du projet** | Définir les valeurs par défaut, injecter du contexte/règles | La plupart des équipes |
| **Schémas personnalisés** | Définir vos propres artefacts de workflow | Équipes avec des processus uniques |
| **Remplacements globaux** | Partager des schémas entre tous les projets | Utilisateurs avancés |

---

## Configuration du projet

Le fichier `openspec/config.yaml` est le moyen le plus simple de personnaliser OpenSpec pour votre équipe. Il vous permet de :

- **Définir un schéma par défaut** - Éviter `--schema` à chaque commande
- **Injecter le contexte du projet** - L'IA voit votre pile technologique, vos conventions, etc.
- **Ajouter des règles par artefact** - Règles personnalisées pour des artefacts spécifiques

### Configuration rapide

```bash
openspec init
```

Cela vous guide dans la création interactive d'une configuration. Ou créez-en une manuellement :

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Pile technologique : TypeScript, React, Node.js, PostgreSQL
  Style d'API : RESTful, documenté dans docs/api.md
  Tests : Jest + React Testing Library
  Nous valorisons la rétrocompatibilité pour toutes les API publiques

rules:
  proposal:
    - Inclure un plan de rollback
    - Identifier les équipes affectées
  specs:
    - Utiliser le format Given/When/Then
    - Référencer les patterns existants avant d'en inventer de nouveaux
```

### Comment ça fonctionne

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
Pile technologique : TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Inclure un plan de rollback
- Identifier les équipes affectées
</rules>

<template>
[Template intégré au schéma]
</template>
```

- Le **contexte** apparaît dans TOUS les artefacts
- Les **règles** apparaissent UNIQUEMENT pour l'artefact correspondant

### Ordre de résolution des schémas

Lorsqu'OpenSpec a besoin d'un schéma, il vérifie dans cet ordre :

1. Drapeau CLI : `--schema <nom>`
2. Métadonnées du changement (`.openspec.yaml` dans le dossier du changement)
3. Configuration du projet (`openspec/config.yaml`)
4. Par défaut (`spec-driven`)

---

## Schémas personnalisés

Lorsque la configuration du projet ne suffit pas, créez votre propre schéma avec un workflow entièrement personnalisé. Les schémas personnalisés se trouvent dans le répertoire `openspec/schemas/` de votre projet et sont versionnés avec votre code.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Configuration du projet
│   ├── schemas/           # Les schémas personnalisés se trouvent ici
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Vos changements
└── src/
```

### Cloner un schéma existant

Le moyen le plus rapide de personnaliser est de cloner un schéma intégré :

```bash
openspec schema fork spec-driven my-workflow
```

Cela copie l'intégralité du schéma `spec-driven` dans `openspec/schemas/my-workflow/` où vous pouvez le modifier librement.

**Ce que vous obtenez :**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Définition du workflow
└── templates/
    ├── proposal.md       # Template pour l'artefact de proposition
    ├── spec.md           # Template pour les spécifications
    ├── design.md         # Template pour la conception
    └── tasks.md          # Template pour les tâches
```

Maintenant, modifiez `schema.yaml` pour changer le workflow, ou modifiez les templates pour changer ce que l'IA génère.

### Créer un schéma à partir de zéro

Pour un workflow entièrement nouveau :

```bash
# Interactif
openspec schema init research-first

# Non-interactif
openspec schema init rapid \
  --description "Workflow d'itération rapide" \
  --artifacts "proposal,tasks" \
  --default
```

### Structure du schéma

Un schéma définit les artefacts de votre workflow et comment ils dépendent les uns des autres :

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: Le workflow personnalisé de mon équipe

artifacts:
  - id: proposal
    generates: proposal.md
    description: Document de proposition initiale
    template: proposal.md
    instruction: |
      Créer une proposition qui explique POURQUOI ce changement est nécessaire.
      Se concentrer sur le problème, pas sur la solution.
    requires: []

  - id: design
    generates: design.md
    description: Conception technique
    template: design.md
    instruction: |
      Créer un document de conception expliquant COMMENT implémenter.
    requires:
      - proposal    # Impossible de créer la conception tant que la proposition n'existe pas

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
| `generates` | Nom du fichier de sortie (supporte les globs comme `specs/**/*.md`) |
| `template` | Fichier template dans le répertoire `templates/` |
| `instruction` | Instructions pour l'IA pour créer cet artefact |
| `requires` | Dépendances - quels artefacts doivent exister au préalable |

### Templates

Les templates sont des fichiers markdown qui guident l'Ils sont injectés dans le prompt lors de la création de cet artefact.

```markdown
<!-- templates/proposal.md -->
## Pourquoi

<!-- Expliquer la motivation de ce changement. Quel problème cela résout-il ? -->

## Quels changements

<!-- Décrire ce qui va changer. Être spécifique sur les nouvelles capacités ou modifications. -->

## Impact

<!-- Code affecté, API, dépendances, systèmes -->
```

Les templates peuvent inclure :
- Des en-têtes de section que l'IA doit remplir
- Des commentaires HTML avec des indications pour l'IA
- Des exemples de format montrant la structure attendue

### Valider votre schéma

Avant d'utiliser un schéma personnalisé, validez-le :

```bash
openspec schema validate my-workflow
```

Cela vérifie :
- La syntaxe de `schema.yaml` est correcte
- Tous les templates référencés existent
- Aucune dépendance circulaire
- Les identifiants d'artefact sont valides

### Utiliser votre schéma personnalisé

Une fois créé, utilisez votre schéma avec :

```bash
# Spécifier sur la commande
openspec new change feature --schema my-workflow

# Ou définir comme défaut dans config.yaml
schema: my-workflow
```

### Déboguer la résolution des schémas

Vous ne savez pas quel schéma est utilisé ? Vérifiez avec :

```bash
# Voir d'où un schéma spécifique est résolu
openspec schema which my-workflow

# Lister tous les schémas disponibles
openspec schema which --all
```

La sortie indique s'il provient de votre projet, du répertoire utilisateur ou du paquet :

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Remarque :** OpenSpec supporte également les schémas au niveau utilisateur dans `~/.local/share/openspec/schemas/` pour le partage entre projets, mais les schémas au niveau du projet dans `openspec/schemas/` sont recommandés car ils sont versionnés avec votre code.

---

## Exemples

### Workflow d'itération rapide

Un workflow minimal pour des itérations rapides :

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Itération rapide avec une surcharge minimale

artifacts:
  - id: proposal
    generates: proposal.md
    description: Proposition rapide
    template: proposal.md
    instruction: |
      Créer une brève proposition pour ce changement.
      Se concentrer sur le quoi et le pourquoi, ignorer les spécifications détaillées.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Liste de contrôle d'implémentation
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Ajouter un artefact de revue

Cloner le schéma par défaut et ajouter une étape de revue :

```bash
openspec schema fork spec-driven with-review
```

Puis modifier `schema.yaml` pour ajouter :

```yaml
  - id: review
    generates: review.md
    description: Liste de contrôle de revue avant implémentation
    template: review.md
    instruction: |
      Créer une liste de contrôle de revue basée sur la conception.
      Inclure les considérations de sécurité, de performance et de test.
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

## Schémas communautaires

OpenSpec supporte également les schémas maintenus par la communauté et distribués via des dépôts indépendants. Ceux-ci fournissent des workflows structurés qui intègrent OpenSpec avec d'autres outils ou systèmes, de manière similaire au [catalogue d'extensions communautaires de github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) pour spec-kit.

Les schémas communautaires ne sont pas intégrés au noyau d'OpenSpec — ils vivent dans leurs propres dépôts avec leur propre calendrier de publication. Pour en utiliser un, copiez le bundle du schéma dans le répertoire `openspec/schemas/<nom-du-schema>/` de votre projet (le README de chaque dépôt contient les instructions d'installation).

| Schéma | Mainteneur | Dépôt | Description |
|--------|-----------|-------|-------------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Intègre la gouvernance des artefacts d'OpenSpec avec les compétences d'exécution d'[obra/superpowers](https://github.com/obra/superpowers) (brainstorming, plans d'écriture, TDD via sous-agents, revue de code, finalisation). Ajoute un artefact `retrospective` axé sur les preuves, comblant une lacune que Superpowers ne couvre pas nativement. |

> Vous souhaitez contribuer un schéma communautaire ? Ouvrez un issue avec un lien vers votre dépôt, ou soumettez une PR ajoutant une ligne à ce tableau.

---

## Voir aussi

- [Référence CLI : Commandes de schéma](cli.md#schema-commands) - Documentation complète des commandes