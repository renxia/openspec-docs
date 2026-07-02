---
layout: home

hero:
  name: "OpenSpec"
  text: "Développement piloté par la spécification pour les assistants IA"
  tagline: Une spécification légère pour construire et gérer des projets d'assistants IA.
  actions:
    - theme: brand
      text: Commencer
      link: ./getting-started
    - theme: alt
      text: Accueil
      link: /

features:
  - title: Flux de travail basé sur la spécification (Spec-First)
    details: Définissez les exigences avant d'écrire le code.
  - title: Conception native IA
    details: Conçu pour Claude Code, Cursor, Windsurf et plus encore.
  - title: Multi-langues
    details: La documentation est disponible en plusieurs langues.
---

# Documentation OpenSpec

Bienvenue. Ceci est la page d'accueil de tout ce qui concerne OpenSpec.

OpenSpec vous aide et votre assistant de codage IA à **se mettre d'accord sur ce qu'il faut construire avant que du code ne soit écrit.** Vous décrivez le changement, l'IA rédige une courte spécification et une liste de tâches, vous examinez tous les deux le même plan, puis le travail est effectué. Fini la découverte en cours de route que l'IA a construit la mauvaise chose.

Si vous ne devez lire qu'une seule chose, lisez ces deux pages :

1. [Getting Started](getting-started.md) : installez, initialisez et livrez votre premier changement.
2. [How Commands Work](how-commands-work.md) : là où vous tapez réellement `/opsx:propose` (indice : dans votre chat IA, pas dans le terminal). C'est ce qui embrouille presque tout le monde au début.

Ce deuxième point est plus important qu'il n'y paraît. OpenSpec a deux moitiés : un outil en ligne de commande que vous exécutez dans votre terminal, et des commandes slash que vous donnez à votre assistant IA. Savoir laquelle est laquelle vous épargne le moment de confusion le plus courant.

> **La meilleure habitude à prendre au début : lorsque vous n'êtes pas sûr de ce que vous voulez construire, commencez par `/opsx:explore`.** C'est un partenaire de réflexion sans enjeu qui lit votre code, évalue les options et affine une idée vague en un plan concret avant qu'un artefact ou du code n'existe. Le guide [Explore First](explore.md) le démontre.

## Choisissez votre chemin

**Je suis nouveau.** Commencez par [Getting Started](getting-started.md), puis survolez les [Core Concepts at a Glance](overview.md). Si quelque chose vous semble mystérieux, la [FAQ](faq.md) et le [Glossary](glossary.md) sont à proximité.

**J'ai un problème mais pas de plan.** C'est le cas le plus fréquent, et il y a une réponse dédiée : [Explore First](explore.md). Utilisez `/opsx:explore` pour réfléchir avec l'IA avant de vous engager sur quoi que ce soit.

**J'ai une grande base de code existante.** Vous ne documentez pas tout. [Using OpenSpec in an Existing Project](existing-projects.md) montre comment commencer sur du code réel et "brownfield" sans vouloir faire le tour du monde.

**Je veux juste que ça fonctionne.** [Install](installation.md), exécutez `openspec init`, puis lisez [How Commands Work](how-commands-work.md) afin que votre première commande slash arrive au bon endroit.

**J'apprends par l'exemple.** La page [Examples & Recipes](examples.md) vous guide à travers des changements réels, du début à la fin : une petite fonctionnalité, un correctif de bug, un refactoring, une exploration.

**Je viens d'un ancien flux de travail.** Le [Migration Guide](migration-guide.md) explique ce qui a changé et pourquoi, et promet que votre travail existant est en sécurité.

**Je veux l'adapter au processus de mon équipe.** [Customization](customization.md) couvre la configuration du projet, les schémas personnalisés et le contexte partagé.

**Quelque chose ne fonctionne pas.** [Troubleshooting](troubleshooting.md) rassemble les échecs réels rencontrés par les gens, avec des solutions.

## La carte complète

### Commencez ici

| Doc | Ce qu'il vous apporte |
|-----|-------------------|
| [Getting Started](getting-started.md) | Installez, initialisez et exécutez votre premier changement de bout en bout |
| [Explore First](explore.md) | Utilisez `/opsx:explore` pour réfléchir à une idée avant de vous engager |
| [How Commands Work](how-commands-work.md) | Où s'exécutent les commandes slash, ce que signifie le "mode interactif", terminal vs chat |
| [Core Concepts at a Glance](overview.md) | Le modèle mental complet sur une page : spécifications, changements, deltas, archive |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix et comment vérifier que cela fonctionne |

### Utilisez-le au quotidien

| Doc | Ce qu'il vous apporte |
|-----|-------------------|
| [Workflows](workflows.md) | Les schémas courants et quand utiliser chaque commande |
| [Examples & Recipes](examples.md) | Des parcours complets de changements réels, prêtes à copier-coller |
| [Using OpenSpec in an Existing Project](existing-projects.md) | Adopter OpenSpec sur une base de code "brownfield" importante |
| [Editing & Iterating on a Change](editing-changes.md) | Mettre à jour les artefacts, revenir en arrière, réconcilier les modifications manuelles |
| [Commands](commands.md) | Référence pour chaque commande slash `/opsx:*` |
| [CLI](cli.md) | Référence pour chaque commande de terminal `openspec` |

### Comprenez-le en profondeur

| Doc | Ce qu'il vous apporte |
|-----|-------------------|
| [Concepts](concepts.md) | L'explication détaillée des spécifications, changements, artefacts, schémas et archive |
| [OPSX Workflow](opsx.md) | Pourquoi le flux de travail est fluide au lieu d'être verrouillé par phase, plus une plongée dans l'architecture |
| [Glossary](glossary.md) | Chaque terme défini à un seul endroit |

### Faites-le vôtre

| Doc | Ce qu'il vous apporte |
|-----|-------------------|
| [Customization](customization.md) | Configuration du projet, schémas personnalisés, contexte partagé |
| [Multi-Language](multi-language.md) | Générer des artefacts dans des langues autres que l'anglais |
| [Supported Tools](supported-tools.md) | Les 25+ outils IA avec lesquels OpenSpec s'intègre, et où les fichiers sont stockés |

### Lorsque vous avez besoin d'aide

| Doc | Ce qu'il vous apporte |
|-----|-------------------|
| [FAQ](faq.md) | Réponses rapides aux questions les plus posées |
| [Troubleshooting](troubleshooting.md) | Des corrections concrètes pour des échecs concrets |
| [Migration Guide](migration-guide.md) | Passer du flux de travail hérité à OPSX |

### Coordination entre dépôts (bêta)

| Doc | Ce qu'il vous apporte |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | Planifier dans son propre dépôt lorsque votre travail s'étend sur plusieurs dépôts ou équipes |
| [Agent Contract](agent-contract.md) | Les interfaces CLI lisibles par machine que les agents gèrent |

## La version trente secondes

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (dans votre chat IA)  /opsx:explore           ← optionnel, mais une excellente habitude
4. Propose        (dans votre chat IA)  /opsx:propose add-dark-mode
5. Build          (dans votre chat IA)  /opsx:apply
6. Archive        (dans votre chat IA)  /opsx:archive
```

Les étapes 1 et 2 se déroulent dans votre terminal. Le reste se passe dans le chat de votre assistant IA. Cette séparation est la seule chose qui mérite d'être mémorisée, et [How Commands Work](how-commands-work.md) explique exactement pourquoi. L'étape 3 est optionnelle, mais commencer par `/opsx:explore` lorsque vous n'êtes pas sûr est l'habitude la plus utile à prendre.

## Où obtenir de l'aide ailleurs

- **Discord :** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) pour les questions, les idées et l'aide.
- **GitHub Issues :** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) pour les bugs et les demandes de fonctionnalités.
- **`openspec feedback "votre message"`** envoie un retour directement depuis votre terminal (cela ouvre une issue GitHub).

Avez-vous trouvé quelque chose dans cette documentation qui est faux, obsolète ou confus ? C'est un bug. Ouvrez une issue ou une PR. Les améliorations de la documentation sont certaines des contributions les plus précieuses que vous puissiez faire.