# Glossaire

Tous les termes d'OpenSpec au même endroit, définis dans un langage clair. Parcourez-le une fois et le reste de la documentation sera plus facile à lire.

Les termes sont regroupés par sujet, puis alphabétisés au sein de chaque groupe.

## Les noms fondamentaux

**Spec.** Un document décrivant le comportement d'une partie de votre système. Les specs résident dans `openspec/specs/`, sont organisées par domaine et sont composées de exigences et de scénarios. La spec est la réponse convenue à la question « que fait ce logiciel ? » Voir [Concepts](concepts.md#specs).

**Source of truth.** Le répertoire `openspec/specs/` dans son ensemble. Il contient le comportement actuel et convenu de votre système. Les changements proposent des modifications à cette source ; l'archivage les applique.

**Change.** Une unité de travail, empaquetée sous la forme d'un dossier dans `openspec/changes/<name>/`. Un change contient tout ce qui concerne ce travail : sa proposition, son design, ses tâches et les modifications de spec qu'il introduit. Un change équivaut à une fonctionnalité ou un correctif.

**Artifact.** Un document contenu dans un change. Les artefacts standards sont la proposition, les delta specs, le design et les tâches. Ils sont créés par ordre de dépendance et se nourrissent les uns des autres.

**Delta spec.** Une spec contenue dans un change qui décrit uniquement ce qui est modifié, en utilisant les sections `ADDED`, `MODIFIED` et `REMOVED`, plutôt que de reformuler la spec entière. C'est cela qui permet à OpenSpec de modifier proprement les systèmes existants. Voir [Concepts](concepts.md#delta-specs).

**Domain.** Un regroupement logique pour les specs, tel que `auth/`, `payments/` ou `ui/`. Vous choisissez des domaines qui correspondent à votre manière d'envisager votre système.

## À l'intérieur d'une spec

**Requirement.** Un comportement unique que le système doit posséder, généralement écrit avec un mot-clé RFC 2119 : « Le système SHALL expirer les sessions après 30 minutes. » Les exigences énoncent le *quoi*, pas le *comment*.

**Scenario.** Un exemple concret et testable d'une exigence en action, typiquement sous la forme Given/When/Then. Les scénarios rendent une exigence vérifiable : vous pourriez écrire un test automatisé à partir de l'un.

**RFC 2119 keywords.** Les mots MUST, SHALL, SHOULD et MAY, qui portent une signification standardisée quant au niveau d'exigence. MUST et SHALL sont absolus. SHOULD est recommandé avec possibilité d'exceptions. MAY est facultatif. Le nom provient du document de norme internet qui les a définis.

## Les artefacts

**Proposal (`proposal.md`).** Le *pourquoi* et le *quoi* d'un changement : son intention, sa portée et son approche de haut niveau. C'est le premier artefact que vous créez.

**Design (`design.md`).** Le *comment* : l'approche technique, les décisions architecturales et les fichiers sur lesquels vous prévoyez travailler. Facultatif pour les changements simples.

**Tasks (`tasks.md`).** La liste de contrôle d'implémentation, avec des cases à cocher. L'IA la parcourt pendant `/opsx:apply` et coche les éléments au fur et à mesure.

## Le cycle de vie

**Archive.** L'acte de finaliser un change. Ses delta specs sont fusionnées dans les specs principales, et le dossier du change est déplacé vers `openspec/changes/archive/YYYY-MM-DD-<name>/`. Après l'archivage, vos specs décrivent la nouvelle réalité. Voir [Concepts](concepts.md#archive).

**Sync.** La fusion des delta specs d'un change dans les specs principales *sans* archiver le change. Généralement automatique (l'archivage propose de le faire), mais disponible seul via `/opsx:sync` pour les changements longs. Voir [Commands](commands.md#opsxsync).

## Flux de travail et commandes

**OPSX.** Le flux de travail OpenSpec actuel, construit autour d'actions fluides plutôt que de phases rigides. Ses commandes slash commencent toutes par `/opsx:`. Voir [OPSX Workflow](opsx.md).

**Slash command.** Une commande que vous tapez dans le chat de votre assistant IA, comme `/opsx:propose`. Les commandes slash pilotent le flux de travail. Elles ne sont pas des commandes terminales. Voir [How Commands Work](how-commands-work.md).

**Explore (`/opsx:explore`).** La commande partenaire de réflexion. Elle lit votre base de code, compare les options et clarifie une idée vague en un plan concret, sans créer d'artefacts ni écrire de code. C'est le point de départ recommandé chaque fois que vous avez un problème mais pas encore un plan. Voir [Explore First](explore.md).

**CLI.** Le programme `openspec` que vous exécutez dans votre terminal. Il configure les projets, liste et valide les changements, ouvre le tableau de bord et archive. C'est la partie terminale d'OpenSpec. Voir [CLI](cli.md).

**Skill.** Un dossier d'instructions (`.../skills/openspec-*/SKILL.md`) que votre assistant IA détecte automatiquement et suit. Les Skills sont la norme émergente inter-outils pour fournir le flux de travail OpenSpec à votre assistant.

**Command file.** Un fichier de commande slash par outil (`.../commands/opsx-*`). Le mécanisme de livraison plus ancien, toujours pris en charge aux côtés des skills. Vous les touchez rarement directement.

**Profile.** L'ensemble des commandes slash installées dans votre projet. **Core** (le défaut) comprend `propose`, `explore`, `apply`, `sync`, `archive`. L'ensemble **expanded** ajoute `new`, `continue`, `ff`, `verify`, `bulk-archive` et `onboard`. Changez-le avec `openspec config profile`.

**Delivery.** Si OpenSpec installe des skills, des fichiers de commande ou les deux pour vos outils. Configuré globalement et appliqué avec `openspec update`.

## Personnalisation

**Schema.** La définition des artefacts qu'un workflow possède et comment ils dépendent les uns des autres. Le défaut intégré est `spec-driven` (proposition → specs → design → tâches). Vous pouvez le forker ou en écrire un propre. Voir [Customization](customization.md#custom-schemas).

**Template.** Un fichier Markdown à l'intérieur d'un schema qui façonne ce que l'IA génère pour un artefact donné. Modifier un template change immédiatement la sortie de l'IA, sans reconstruction.

**Project config (`openspec/config.yaml`).** Les paramètres par projet : le schéma par défaut, le `context:` injecté dans chaque demande de planification et les `rules:` par artefact. La manière la plus simple d'enseigner à OpenSpec votre stack et vos conventions. Voir [Customization](customization.md#project-configuration).

**Context injection.** Placer l'arrière-plan du projet dans le champ `context:` de `config.yaml` afin qu'il soit automatiquement ajouté à chaque artefact généré par l'IA. C'est plus fiable que d'espérer que l'IA lise un fichier séparé.

**Dependency graph.** Le graphe dirigé formé par les relations `requires:` des artefacts. C'est un DAG (Directed Acyclic Graph : les flèches pointent toujours vers l'avant, jamais en boucle), et OpenSpec l'utilise pour savoir ce que vous pouvez créer ensuite.

**Enablers, not gates.** Le principe selon lequel les dépendances d'artefacts montrent ce qui devient *possible* ensuite, pas ce qui est *requis* ensuite. Vous pouvez revoir et modifier n'importe quel artefact à tout moment. Voir [Core Concepts at a Glance](overview.md#enablers-not-gates).

## Coordination entre dépôts (bêta)

Ces termes ne s'appliquent que si votre planification couvre plus d'un dépôt. Ils sont en bêta. La plupart des utilisateurs peuvent les ignorer. Voir le [Stores User Guide](stores-beta/user-guide.md).

**Store.** Un dépôt autonome dont le seul travail est la planification. Il a la même forme `openspec/` que vous connaissez (specs et changes) plus un petit fichier d'identité. Vous l'enregistrez sur votre machine une fois, par nom, et ensuite n'importe quelle commande OpenSpec peut fonctionner dedans depuis n'importe où.

**Reference.** Une déclaration, dans le `openspec/config.yaml` d'un dépôt de code, d'un store sur lequel ce dépôt se base. Les références sont en lecture seule : le dépôt conserve sa propre racine, et `openspec instructions` gagne un index des specs du store référencé, chacune avec la commande exacte pour les récupérer.

**Working context.** Ce que `openspec context` assemble pour le dépôt actuel : sa racine OpenSpec plus chaque store qu'il référence, chacun avec la manière de le récupérer. La réponse à « avec quoi est-ce que je travaille ? »

**Workset.** Un ensemble personnel de dossiers locaux que vous ouvrez ensemble (un store aux côtés des dépôts de code sur lesquels vous travaillez). Créé explicitement avec `openspec workset create`; rien de ces chemins locaux n'est commité dans le dépôt de planification partagé.

## Voir aussi

- [Core Concepts at a Glance](overview.md) : les cinq idées, en une page
- [Concepts](concepts.md) : l'explication détaillée
- [How Commands Work](how-commands-work.md) : commandes slash contre CLI