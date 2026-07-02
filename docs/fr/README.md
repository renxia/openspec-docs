# Documentation OpenSpec

Bienvenue. Ceci est la plateforme centrale pour tout ce qui concerne OpenSpec.

OpenSpec vous aide, ainsi que votre assistant de codage IA, à **définir ce qu'il faut construire avant d'écrire la moindre ligne de code.** Vous décrivez le changement, l'IA rédige une courte spécification et une liste de tâches ; vous examinez tous les deux le même plan, puis le travail est effectué. Fini le scénariole où l'on découvre à mi-chemin que l'IA a construit la mauvaise chose.

Si vous ne deviez lire qu'une seule chose, lisez ces deux pages :

1. [Getting Started](getting-started.md) : installation, initialisation et livraison de votre première modification.
2. [How Commands Work](how-commands-work.md) : là où vous tapez réellement `/opsx:propose` (indice : dans votre chat IA, pas dans le terminal). C'est ce qui déroute presque tout le monde au début.

Cette deuxième page est plus importante qu'il n'y paraît. OpenSpec a deux facettes : un outil en ligne de commande que vous exécutez dans votre terminal, et des commandes slash que vous donnez à votre assistant IA. Savoir quelle est laquelle vous fait gagner la confusion la plus courante.

> **La meilleure habitude à prendre au début : quand vous n'êtes pas sûr de ce qu'il faut construire, commencez par `/opsx:explore`.** C'est un partenaire de réflexion sans enjeu qui lit votre code, pèse les options et affine une idée vague en un plan concret avant que tout artefact ou code n'existe. Le guide [Explore First](explore.md) le démontre.

## Choisissez votre parcours

**Je suis complètement nouveau.** Commencez par [Getting Started](getting-started.md), puis survolez [Core Concepts at a Glance](overview.md). Quand quelque chose vous semble mystérieux, la [FAQ](faq.md) et le [Glossary](glossary.md) sont à portée de main.

**J'ai un problème mais pas de plan.** C'est le cas le plus fréquent, et il y a une réponse dédiée : [Explore First](explore.md). Utilisez `/opsx:explore` pour réfléchir avec l'IA avant de vous engager sur quoi que ce soit.

**J'ai une base de code existante et volumineuse.** Vous ne documentez pas tout. [Using OpenSpec in an Existing Project](existing-projects.md) montre comment commencer à travailler sur du code réel, "brownfield", sans vouloir tout maîtriser d'un coup.

**Je veux juste que ça fonctionne.** [Install](installation.md), exécutez `openspec init`, puis lisez [How Commands Work](how-commands-work.md) pour que votre première commande slash arrive au bon endroit.

**J'apprends par l'exemple.** La page [Examples & Recipes](examples.md) retrace des changements réels du début à la fin : une petite fonctionnalité, une correction de bug, un refactoring, une exploration.

**Je viens de l'ancien workflow.** Le [Migration Guide](migration-guide.md) explique ce qui a changé et pourquoi, et garantit que votre travail existant est en sécurité.

**Je veux adapter cela au processus de mon équipe.** [Customization](customization.md) couvre la configuration du projet, les schémas personnalisés et le contexte partagé.

**Quelque chose est cassé.** [Troubleshooting](troubleshooting.md) regroupe les échecs que les gens rencontrent réellement, avec des solutions.

## La carte complète

### Commencez ici

| Doc | Ce qu'il vous donne |
|-----|-------------------|
| [Getting Started](getting-started.md) | Installation, initialisation et exécution de votre premier changement du début à la fin |
| [Explore First](explore.md) | Utiliser `/opsx:explore` pour réfléchir à une idée avant de vous engager |
| [How Commands Work](how-commands-work.md) | Où s'exécutent les commandes slash, ce que signifie le "mode interactif", terminal vs chat |
| [Core Concepts at a Glance](overview.md) | Le modèle mental complet sur une seule page : spécifications, changements, deltas, archives |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix et comment vérifier que cela a fonctionné |

### Utilisez-le au quotidien

| Doc | Ce qu'il vous donne |
|-----|-------------------|
| [Workflows](workflows.md) | Les schémas courants et quand utiliser chaque commande |
| [Examples & Recipes](examples.md) | Des parcours complets de changements réels, prêts à copier-coller |
| [Using OpenSpec in an Existing Project](existing-projects.md) | Adopter OpenSpec sur une base de code "brownfield" volumineuse |
| [Editing & Iterating on a Change](editing-changes.md) | Mettre à jour les artefacts, revenir en arrière, réconcilier les modifications manuelles |
| [Commands](commands.md) | Référence pour chaque commande slash `/opsx:*` |
| [CLI](cli.md) | Référence pour chaque commande terminal `openspec` |

### Comprenez-le en profondeur

| Doc | Ce qu'il vous donne |
|-----|-------------------|
| [Concepts](concepts.md) | L'explication détaillée des spécifications, changements, artefacts, schémas et archives |
| [OPSX Workflow](opsx.md) | Pourquoi le workflow est fluide au lieu d'être verrouillé par phases, plus une plongée en profondeur de l'architecture |
| [Glossary](glossary.md) | Tous les termes définis à un seul endroit |

### Rendez-le vôtre

| Doc | Ce qu'il vous donne |
|-----|-------------------|
| [Customization](customization.md) | Configuration du projet, schémas personnalisés, contexte partagé |
| [Multi-Language](multi-language.md) | Générer des artefacts dans des langues autres que l'anglais |
| [Supported Tools](supported-tools.md) | Les 25+ outils IA avec lesquels OpenSpec s'intègre, et où atterrissent les fichiers |

### Quand vous avez besoin d'aide

| Doc | Ce qu'il vous donne |
|-----|-------------------|
| [FAQ](faq.md) | Des réponses rapides aux questions que les gens posent le plus souvent |
| [Troubleshooting](troubleshooting.md) | Des solutions concrètes pour des échecs concrets |
| [Migration Guide](migration-guide.md) | Passer du workflow hérité à OPSX |

### Coordonner entre dépôts (bêta)

| Doc | Ce qu'il vous donne |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | Planifier dans son propre dépôt lorsque votre travail couvre plusieurs dépôts ou équipes |
| [Agent Contract](agent-contract.md) | Les surfaces lisibles par machine que les agents pilotent |

## La version trente secondes

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (dans votre chat IA)  /opsx:explore           ← facultatif, mais une excellente habitude
4. Propose        (dans votre chat IA)  /opsx:propose add-dark-mode
5. Build          (dans votre chat IA)  /opsx:apply
6. Archive        (dans votre chat IA)  /opsx:archive
```

Les étapes 1 et 2 se déroulent dans votre terminal. Le reste se passe dans le chat de votre assistant IA. Ce clivage est la seule chose qui vaut la peine d'être mémorisée, et [How Commands Work](how-commands-work.md) explique exactement pourquoi. L'étape 3 est facultative, mais commencer par `/opsx:explore` quand vous n'êtes pas sûr est l'habitude la plus utile à prendre.

## Où obtenir de l'aide

- **Discord :** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) pour les questions, les idées et l'aide.
- **GitHub Issues :** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) pour les bugs et les demandes de fonctionnalités.
- **`openspec feedback "votre message"`** envoie des commentaires directement depuis votre terminal (cela ouvre un problème GitHub).

Avez-vous trouvé quelque chose dans cette documentation qui est faux, obsolète ou confus ? C'est un bug. Ouvrez un issue ou une PR. Les améliorations de la documentation sont parmi les contributions les plus précieuses que vous puissiez faire.