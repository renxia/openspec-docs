# Utiliser OpenSpec dans un projet existant

**Vous ne documentez pas l'intégralité de votre base de code pour commencer. Vous écrivez des spécifications uniquement pour ce que vous êtes sur le point de modifier.** C'est la chose la plus importante à savoir concernant l'adoption d'OpenSpec sur un projet existant, et c'est pourquoi OpenSpec est conçu en priorité pour les projets "brownfield" (existants).

Une préoccupation courante se présente ainsi : « Mon application a 80 000 lignes. Dois-je écrire des spécifications pour tout avant que OpenSpec ne soit utile ? » Non. Vous détesteriez ça, et nous aussi. OpenSpec développe vos spécifications une modification à la fois. Votre première modification documente la partie qu'elle touche, la prochaine modifie sa propre partie, et au fil du mois, vos spécifications se complètent naturellement autour du travail que vous réalisez réellement.

Ce guide montre comment commencer dès le premier jour sans vouloir tout maîtriser d'un coup.

## La version trente secondes

```bash
$ cd your-existing-project
$ openspec init          # adds openspec/ and your AI tool's commands
```

Ensuite, dans votre chat IA :

```text
/opsx:explore            # optionnel : demandez à l'IA de lire la zone que vous allez toucher
/opsx:propose <a real, small change you actually need>
/opsx:apply
/opsx:archive
```

Vos spécifications décrivent maintenant exactement la partie du système que la modification a touchée, et rien de plus. C'est correct. Vous avez fini de vous inquiéter des 80 000 lignes restantes.

## Pourquoi l'approche par delta est la clé

Les changements d'OpenSpec sont écrits comme des **deltas** : `ADDED`, `MODIFIED`, `REMOVED`. Un delta décrit ce qui change par rapport au comportement actuel, et non le système dans son intégralité.

C'est exactement ce dont nécessite un travail "brownfield". Vous ne partez jamais de zéro. Vous ajoutez un champ, vous corrigez une redirection, vous resserrez un délai d'attente. Un delta vous permet de spécifier cette seule modification avec précision sans devoir d'abord écrire une spécification de 40 pages sur tout ce qui l'entoure.

Ainsi, votre répertoire `openspec/specs/` ne commence pas plein et complet. Il commence presque vide et s'accumule. Chaque changement archivé intègre son delta. La spécification pour `auth/` ne devient complète qu'après que vous avez effectué plusieurs changements liés à l'authentification, ce qui est exactement le moment où vous voulez qu'elle soit complète.

Si vous souhaitez les mécanismes plus profonds, consultez [Concepts : Spécifications Delta](concepts.md#delta-specs).

## Votre première modification sur une base de code réelle

Choisissez quelque chose de petit et de réel. Pas un jouet, pas une réécriture. Un changement que vous alliez faire cette semaine de toute façon. Les premières petites modifications vous apprennent le flux de travail avec peu d'enjeux.

**Étape 1 : Laissez l'IA lire la zone pertinente.** C'est là que `/opsx:explore` justifie son existence sur une base de code inconnue ou volumineuse. Orientez-la vers la partie que vous êtes sur le point de toucher et laissez-la cartographier le fonctionnement des choses avant de proposer quoi que ce soit.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: I need to add rate limiting to our public API, but I'm not sure
     how requests currently flow through the middleware.

AI:  Let me trace it... [reads the router, middleware stack, and config]
     Requests hit Express, pass through auth middleware, then your
     controllers. There's no rate-limiting layer today. The cleanest
     insertion point is a middleware right after auth. Want me to scope it?
```

Remarquez que l'IA comprend maintenant votre structure réelle, de sorte que la proposition qu'elle écrit correspondra à votre code, et non un modèle générique. Sur une grande base de code, cette seule habitude vous fait gagner le plus d'efforts. Consultez [Explore First](explore.md).

**Étape 2 : Proposer la modification.** La proposition et sa spécification delta capturent juste ce changement.

```text
You: /opsx:propose add-api-rate-limiting
```

**Étape 3 : Construire et archiver** avec `/opsx:apply` et `/opsx:archive`, comme pour tout changement. Après l'archivage, vous avez une spécification réelle de votre comportement de limitation de débit, née d'un changement que vous deviez faire de toute façon.

## Préférez un parcours guidé ? Utilisez onboard

Si vous préférez regarder le cycle complet se dérouler sur votre propre code avec narration, la commande étendue `/opsx:onboard` fait exactement cela : elle scanne votre base de code à la recherche d'une amélioration petite et sûre, puis vous guide à travers la proposition, la construction et l'archivage, expliquant chaque étape.

Activez d'abord les commandes étendues :

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

Ensuite dans le chat :

```text
/opsx:onboard
```

C'est l'introduction la plus douce possible sur un projet réel, et elle vous laisse avec un changement authentique (petit) que vous pouvez conserver ou rejeter. Consultez [Commands : `/opsx:onboard`](commands.md#opsxonboard).

## « Mais j'ai déjà des documents de spécifications »

Peut-être avez-vous un PRD, un SRS, une spécification formelle, voire des modèles TLA+. C'est bien. Vous ne les importez pas en bloc, et vous ne les jetez pas non plus.

Considérez les documents existants comme du **matériel source pour l'exploration**, et non comme des spécifications à convertir. Lorsque vous commencez un changement, collez ou pointez l'IA vers la section pertinente, et laissez-la façonner un delta OpenSpec ciblé à partir de celle-ci. Le delta capture le comportement que vous êtes en train de changer maintenant, sous forme d'exigence et de scénario testables dans OpenSpec. Vos documents originaux restent tels quels comme arrière-plan.

La raison honnête : les spécifications OpenSpec sont délibérément axées sur le comportement et limitées aux changements. Un PRD de 40 pages est un artefact différent avec une tâche différente. Forcer une conversion massive ponctuelle a tendance à produire une spécification volumineuse et obsolète en laquelle personne ne croit. Laisser les spécifications croître à partir de changements réels les maintient exactes.

```text
You: /opsx:explore
You: Here's the section of our PRD about checkout. I'm implementing the
     "guest checkout" requirement next.
     [paste the relevant requirement]
AI:  [reads it, asks clarifying questions, then helps scope a change]
You: /opsx:propose add-guest-checkout
```

## Organisation des spécifications dans une base de code volumineuse

Les spécifications vivent sous `openspec/specs/`, regroupées par **domaine** : une zone logique qui correspond à la manière dont votre équipe pense le système. Vous n'avez pas besoin de concevoir toute la taxonomie au départ. Créez un dossier de domaine lorsque votre première changement dans cette zone en a besoin.

Façons courantes pour découper les domaines :

- **Par domaine fonctionnel (feature area) :** `auth/`, `payments/`, `search/`
- **Par composant :** `api/`, `frontend/`, `workers/`
- **Par contexte délimité (bounded context) :** `ordering/`, `fulfillment/`, `inventory/`

Choisissez ce qui convient le mieux à un nouveau venu. Vous pourrez affiner plus tard. Consultez [Concepts : Spécifications](concepts.md#specs).

## Monorepos et travail qui chevauche plusieurs dépôts

Pour un monorepo, le modèle le plus simple est un seul répertoire `openspec/` à la racine du dépôt, avec des domaines qui correspondent à vos packages ou services. Cela couvre la plupart des équipes.

Si votre travail chevauche réellement **plusieurs dépôts** (ou plusieurs packages que vous traitez comme étant séparés), OpenSpec dispose d'une fonctionnalité bêta : les **stores**. La planification vit dans son propre dépôt autonome que n'importe lequel de vos dépôts de code peut référencer, de sorte que le plan n'a pas besoin de vivre à l'intérieur du dossier `openspec/` d'un seul dépôt. C'est une version bêta, traitez donc ses commandes et son état comme évolutifs. Commencez par [Stores User Guide](stores-beta/user-guide.md) pour le modèle mental et la voie la plus utile.

## Quelques mises en garde honnêtes

- **Résistez à l'envie de combler tout ce qui manque (back-fill).** Écrire des spécifications pour du code que vous ne modifiez pas semble productif et ne l'est généralement pas. Ces spécifications deviennent obsolètes, car rien ne les force à suivre la réalité. Laissez les changements réels piloter vos spécifications.
- **Gardez les premières modifications petites.** Vos premiers changements concernent autant l'apprentissage du rythme que le déploiement. Un périmètre serré rend le cycle rapide et les leçons peu coûteuses.
- **Committez `openspec/` à git.** Vos spécifications et votre archive appartiennent au contrôle de version aux côtés du code qu'elles décrivent.
- **Donnez du contexte à l'IA.** Sur une base de code volumineuse avec des conventions fortes, remplissez le champ `context:` de `openspec/config.yaml` afin que chaque proposition respecte votre stack et vos modèles. Consultez [Customization](customization.md#project-configuration).

## Où aller ensuite

- [Explore First](explore.md) - l'habitude clé pour comprendre le code avant de le changer
- [Getting Started](getting-started.md) - le guide complet pour la première modification
- [Editing & Iterating on a Change](editing-changes.md) - ajuster une modification au fur et à mesure que vous apprenez
- [Concepts : Spécifications Delta](concepts.md#delta-specs) - pourquoi les deltas rendent le travail "brownfield" propre
- [Customization](customization.md) - enseignez à OpenSpec les conventions de votre projet