---
layout: home

hero:
  name: "OpenSpec"
  text: "Développement piloté par les spécifications pour assistants IA"
  tagline: Une spécification légère pour construire et gérer des projets d'assistants IA.
  actions:
    - theme: brand
      text: "Commencer"
      link: ./getting-started
    - theme: alt
      text: "Accueil"
      link: /
features:
  - title: Flux de travail axé sur les spécifications
    details: Définissez les exigences avant d'écrire du code.
  - title: Conception native pour l'IA
    details: Conçu pour Claude Code, Cursor, Windsurf et d'autres outils.
  - title: Multilingue
    details: Documentation disponible en plusieurs langues.
---

# Documentation OpenSpec

Bienvenue. Ceci est la page d'accueil de tout ce qui concerne OpenSpec.

OpenSpec vous aide, vous et votre assistant de codage IA, **à vous mettre d'accord sur ce qu'il faut construire avant même d'écrire la moindre ligne de code.** Vous décrivez la modification, l'IA rédige une courte spécification et une liste de tâches, vous examinez tous les deux le même plan, puis le travail commence. Fini les découvertes à mi-parcours que l'IA a construit la mauvaise chose.

Si vous ne lisez rien d'autre, lisez ces deux pages :

1. [Commencer](getting-started.md) : installez, initialisez et publiez votre première modification.
2. [Fonctionnement des commandes](how-commands-work.md) : l'endroit où vous saisissez réellement `/opsx:propose` (indice : dans le chat de votre IA, pas dans le terminal). Cela piège presque tout le monde au moins une fois.

Cette deuxième page est plus importante qu'il n'y paraît. OpenSpec comporte deux parties : un outil en ligne de commande que vous exécutez dans votre terminal, et des commandes slash que vous donnez à votre assistant IA. Savoir distinguer les deux vous évite le moment de confusion le plus fréquent.

> **La meilleure habitude à adopter en premier : lorsque vous ne savez pas quoi construire, commencez par `/opsx:explore`.** C'est un partenaire de réflexion sans risque qui lit votre code, évalue les options et affine une idée floue en un plan concret avant que tout artefact ou code n'existe. Le guide [Explorer en premier](explore.md) explique pourquoi.

## Choisissez votre parcours

**Vous débutez.** Commencez par la page [Commencer](getting-started.md), puis parcourez rapidement les [Concepts clés en un coup d'œil](overview.md). Lorsque quelque chose vous semble obscur, la [FAQ](faq.md) et le [Glossaire](glossary.md) sont à portée de main.

**Vous avez un problème mais pas de plan.** C'est le cas le plus fréquent, et il a une réponse dédiée : [Explorer en premier](explore.md). Utilisez `/opsx:explore` pour y réfléchir avec l'IA avant de vous engager sur quoi que ce soit.

**Vous disposez d'une base de code existante importante.** Vous n'avez pas à documenter l'ensemble de celle-ci. La page [Utiliser OpenSpec dans un projet existant](existing-projects.md) montre comment démarrer sur du code réel existant sans essayer de tout documenter d'un seul coup.

**Vous voulez juste que cela fonctionne.** [Installez](installation.md) OpenSpec, exécutez `openspec init`, puis lisez la page [Fonctionnement des commandes](how-commands-work.md) pour que votre première commande slash arrive au bon endroit.

**Vous apprenez par l'exemple.** La page [Exemples et recettes](examples.md) vous guide pas à pas à travers des modifications réelles : une petite fonctionnalité, une correction de bogue, une refactorisation, une exploration.

**L'IA vient de rédiger un plan — et maintenant ?** Lisez-le. La page [Examiner une modification](reviewing-changes.md) présente la vérification de deux minutes qui permet de détecter une erreur de direction tant que le coût est encore faible, et la page [Rédiger de bonnes spécifications](writing-specs.md) explique ce qui compose un plan digne d'être approuvé.

**Vous travaillez en équipe.** La page [OpenSpec en équipe](team-workflow.md) montre comment une modification est associée à une branche et une pull request, et comment les membres de l'équipe examinent un plan avant le code.

**Vous venez de l'ancien flux de travail.** Le [Guide de migration](migration-guide.md) explique ce qui a changé et pourquoi, et garantit que votre travail existant est en sécurité.

**Vous voulez l'adapter au processus de votre équipe.** La page [Personnalisation](customization.md) couvre la configuration du projet, les schémas personnalisés et le contexte partagé.

**Quelque chose ne fonctionne pas.** La page [Dépannage](troubleshooting.md) regroupe les erreurs que les utilisateurs rencontrent réellement, avec les solutions correspondantes.

## Carte complète

### Pour commencer

| Document | Ce qu'il vous apporte |
|-----|-------------------|
| [Commencer](getting-started.md) | Installez, initialisez et exécutez votre première modification de bout en bout |
| [Explorer en premier](explore.md) | Utilisez `/opsx:explore` pour réfléchir à une idée avant de vous engager |
| [Fonctionnement des commandes](how-commands-work.md) | Où s'exécutent les commandes slash, ce que signifie le « mode interactif », terminal contre chat |
| [Concepts clés en un coup d'œil](overview.md) | L'ensemble du modèle mental sur une seule page : spécifications, modifications, deltas, archive |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix, et comment vérifier que l'installation a fonctionné |

### Utilisation au quotidien

| Document | Ce qu'il vous apporte |
|-----|-------------------|
| [Flux de travail](workflows.md) | Schémas courants et moments où utiliser chaque commande |
| [Exemples et recettes](examples.md) | Procédures complètes de modifications réelles, prêtes à être copiées-collées |
| [Rédiger de bonnes spécifications](writing-specs.md) | À quoi ressemblent une exigence et un scénario solides, et comment ajuster la taille d'une modification |
| [Examiner une modification](reviewing-changes.md) | La vérification de deux minutes sur un plan rédigé avant d'écrire la moindre ligne de code |
| [OpenSpec en équipe](team-workflow.md) | Comment les modifications s'intègrent aux branches, aux pull requests et aux revues |
| [Utiliser OpenSpec dans un projet existant](existing-projects.md) | Adopter OpenSpec sur une base de code existante importante |
| [Modifier et itérer sur une modification](editing-changes.md) | Mettre à jour les artefacts, revenir en arrière, réconcilier les modifications manuelles |
| [Commandes](commands.md) | Référence pour toutes les commandes slash `/opsx:*` |
| [CLI](cli.md) | Référence pour toutes les commandes terminal `openspec` |

### Approfondir

| Document | Ce qu'il vous apporte |
|-----|-------------------|
| [Concepts](concepts.md) | L'explication détaillée des spécifications, modifications, artefacts, schémas et archive |
| [Flux de travail OPSX](opsx.md) | Pourquoi le flux de travail est fluide plutôt que verrouillé par phases, plus une plongée approfondie dans l'architecture |
| [Glossaire](glossary.md) | Tous les termes définis en un seul endroit |

### Adaptez-le à vos besoins

| Document | Ce qu'il vous apporte |
|-----|-------------------|
| [Personnalisation](customization.md) | Configuration du projet, schémas personnalisés, contexte partagé |
| [Multilingue](multi-language.md) | Générer des artefacts dans des langues autres que l'anglais |
| [Outils pris en charge](supported-tools.md) | Les plus de 25 outils d'IA avec lesquels OpenSpec s'intègre, et l'emplacement des fichiers |

### En cas de besoin d'aide

| Document | Ce qu'il vous apporte |
|-----|-------------------|
| [FAQ](faq.md) | Réponses rapides aux questions les plus fréquentes |
| [Dépannage](troubleshooting.md) | Solutions concrètes pour des erreurs concrètes |
| [Guide de migration](migration-guide.md) | Passage de l'ancien flux de travail à OPSX |

### Coordonner entre plusieurs dépôts (bêta)

| Document | Ce qu'il vous apporte |
|-----|-------------------|
| [Stores : Guide utilisateur](stores-beta/user-guide.md) | Planifier dans son propre dépôt lorsque votre travail concerne plusieurs dépôts ou équipes |
| [Contrat d'agent](agent-contract.md) | Les surfaces CLI lisibles par machine que les agents pilotent |

## La version en trente secondes

```text
1. Installer        npm install -g @fission-ai/openspec@latest
2. Initialiser     cd your-project && openspec init
3. Explorer        (dans le chat de votre IA)  /opsx:explore           ← facultatif, mais une excellente habitude
4. Proposer        (dans le chat de votre IA)  /opsx:propose add-dark-mode
5. Construire          (dans le chat de votre IA)  /opsx:apply
6. Archiver        (dans le chat de votre IA)  /opsx:archive
```

Les étapes 1 et 2 se déroulent dans votre terminal. Le reste se déroule dans le chat de votre assistant IA. Cette distinction est la seule chose qui vaut la peine d'être mémorisée, et la page [Fonctionnement des commandes](how-commands-work.md) explique exactement pourquoi. L'étape 3 est facultative, mais commencer par `/opsx:explore` lorsque vous n'êtes pas sûr est l'habitude la plus utile à adopter.

## Où trouver de l'aide ailleurs

- **Discord :** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) pour poser des questions, partager des idées et obtenir de l'aide.
- **Problèmes GitHub :** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) pour signaler des bogues et des demandes de fonctionnalités.
- **`openspec feedback "votre message"`** envoie des retours directement depuis votre terminal (cela ouvre un problème GitHub).

Vous avez trouvé quelque chose d'erroné, obsolète ou confus dans cette documentation ? C'est un bogue. Ouvrez un problème ou une pull request. Les améliorations de la documentation sont certaines des contributions les plus précieuses que vous puissiez faire.