# Concepts fondamentaux en un coup d'œil

**OpenSpec est une couche d'accord légère entre vous et votre IA.** Vous décrivez ce que devrait faire un changement, l'IA rédige les détails, vous examinez tous les deux le même plan, et c'est seulement ensuite que le code est écrit. Cette page représente le modèle mental complet en un seul écran. Si vous souhaitez la version longue, [Concepts](concepts.md) la contient.

Voici l'idée entière résumée en cinq mots : **accorder d'abord, puis construire avec confiance.**

## Les cinq idées

Tout ce qui est contenu dans OpenSpec est construit à partir de cinq concepts. Apprenez-les et le reste n'est que des détails.

**1. Les spécifications sont la vérité.** Une spécification décrit comment votre système se comporte *actuellement*. Elle réside dans `openspec/specs/`, organisée par domaine (`auth/`, `payments/`, `ui/`). Les spécifications sont composées d'exigences (« le système DOIT expirer les sessions après 30 minutes ») et de scénarios (exemples concrets given/when/then). Considérez les spécifications comme la réponse unique et convenue à la question « que fait ce logiciel ? ».

**2. Un changement est une unité de travail.** Lorsque vous souhaitez ajouter, modifier ou supprimer un comportement, vous créez un changement : un dossier dans `openspec/changes/` contenant tout sur ce travail en un seul endroit. Une proposition, une conception, une liste de tâches et les modifications des spécifications. Un changement, un dossier, une fonctionnalité.

**3. Les spécifications delta décrivent ce qui change, pas le monde entier.** À l'intérieur d'un changement, vous ne réécrivez pas la spécification entière. Vous écrivez un petit delta : `ADDED` cette exigence, `MODIFIED` celle-ci, `REMOVED` celle-là. C'est l'astuce qui rend OpenSpec performant pour modifier des systèmes existants, et non seulement des projets neufs (green-field). Vous décrivez le diff, pas la destination.

**4. Les artefacts se construisent les uns sur les autres.** Un changement contient plusieurs documents, créés dans un ordre naturel, chacun alimentant le suivant :

```text
proposal ──► specs ──► design ──► tasks ──► implement
   pourquoi    quoi       comment     étapes      le faire
```

Vous pouvez revoir n'importe lequel d'eux à tout moment. Ce sont des facilitateurs, pas des portes de passage. (Plus de détails ci-dessous.)

**5. L'archivage intègre le changement dans la vérité.** Lorsque le travail est terminé, vous archivez le changement. Ses spécifications delta fusionnent avec vos spécifications principales, et le dossier du changement est déplacé vers `changes/archive/` avec un tampon de date. Vos spécifications décrivent maintenant la nouvelle réalité, et vous êtes prêt pour le prochain changement. Le cycle se ferme.

## La vue d'ensemble

```text
┌─────────────────────────────────────────────────────────────────┐
│                          openspec/                              │
│                                                                 │
│   ┌──────────────────┐         ┌──────────────────────────┐    │
│   │     specs/       │         │        changes/          │    │
│   │                  │ ◄─────  │                          │    │
│   │ source de vérité │  fusion  │ un dossier par changement  │    │
│   │ comment les choses fonctionnent │ archive │ proposition · conception ·      │    │
│   │ aujourd'hui       │          │ tâches · spécifications delta      │    │
│   └──────────────────┘         └──────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Deux dossiers. `specs/` est ce qui est vrai. `changes/` est ce que vous proposez. L'archivage transforme une proposition en vérité.

## Le cycle que vous allez réellement exécuter

Dans la configuration par défaut, votre journée se déroule ainsi. Réfléchissez-y d'abord si vous le souhaitez ; puis une commande rédige le plan, vous le lisez et ajustez le plan, le suivant le construit, et le dernier les fichiers.

```text
/opsx:explore                   →  (optionnel) réfléchir avec l'IA au préalable
/opsx:propose add-dark-mode     →  L'IA rédige la proposition, les spécifications, la conception et les tâches
        (vous lisez et ajustez le plan)
/opsx:apply                     →  L'IA le construit, cochant les tâches
/opsx:archive                   →  Spécifications mises à jour, changement archivé
```

**En cas de doute, commencez par explorer.** `/opsx:explore` est un partenaire de réflexion sans enjeu : il lit votre code, présente des options et transforme une idée vague en un plan concret avant qu'un quelconque artefact n'existe. C'est l'antidote le meilleur à une IA qui construirait autrement *quelque chose* à partir d'une requête vague. Vous savez déjà exactement ce que vous voulez ? Passez directement à `/opsx:propose`. Dans tous les cas, explorer est inclus dans le profil par défaut, il est donc toujours disponible. Consultez le [Guide Explore](explore.md).

Ce sont des commandes slash, tapées dans le chat de votre assistant IA. La configuration (`openspec init`) se fait dans votre terminal. Si cette séparation vous est nouvelle, lisez d'abord [Comment fonctionnent les Commandes](how-commands-work.md) ; c'est le point de confusion le plus fréquent.

## « Des facilitateurs, pas des portes de passage »

Cette phrase apparaît partout dans OpenSpec, voici donc ce que cela signifie en termes simples.

Les processus de spécification à l'ancienne sont des cascades : finissez la planification, *ensuite* vous êtes autorisé à implémenter, et revenir en arrière est douloureux. OpenSpec refuse cela. L'ordre `proposal → specs → design → tasks` montre ce qui devient *possible* ensuite, pas ce que vous êtes *forcé* de faire ensuite.

Vous découvrez pendant l'implémentation que la conception était erronée ? Modifiez `design.md` et continuez. Vous réalisez que le périmètre devrait être réduit ? Mettez à jour la proposition. Rien n'est verrouillé. Les dépendances existent uniquement pour que l'IA ait le contexte nécessaire (vous ne pouvez pas écrire de bonnes tâches sans spécifications sur lesquelles les baser), non pour vous enfermer.

La force réside dans l'honnêteté : le travail réel est désordonné et itératif, et OpenSpec le permet. Le compromis est la discipline : parce que rien ne vous pousse en avant, il vous incombe de maintenir un changement ciblé plutôt que de le laisser s'étendre. Le guide [Workflows](workflows.md) contient de bonnes habitudes pour cela.

## Pourquoi cela vaut l'effort mineur

Vérité simple : OpenSpec ajoute une étape. Vous écrivez un court plan avant de construire. Alors, qu'en obtenez-vous ?

- **Vous détectez les mauvaises directions avant qu'elles ne vous coûtent cher.** Corriger un malentendu dans une proposition d'un paragraphe est gratuit. Le corriger après que l'IA ait écrit 400 lignes ne l'est pas.
- **Le plan et le code restent dans le même dépôt.** Six mois plus tard, la spécification vous dit (et à la prochaine session IA) pourquoi le système fonctionne de cette manière.
- **Les changements sont révisables.** Un dossier de changement est un paquet soigné : lisez la proposition, parcourez les deltas, vérifiez les tâches. Pas d'archéologie dans l'historique du chat.
- **Il s'adapte aux bases de code existantes.** Les deltas signifient que vous pouvez spécifier un changement pour une application de 50 000 lignes sans avoir d'abord à tout documenter.

Et le compromis honnête : pour une correction vraiment triviale d'une seule ligne, la cérémonie peut ne pas être rentable, et c'est normal. OpenSpec est conçu pour être léger, mais il n'est pas gratuit. Utilisez-le là où l'accord compte, ce qui s'avère être la plupart du temps lorsque vous travaillez avec une IA qui construira avec confiance tout ce que vous avez vaguement demandé.

## Où aller ensuite

- Nouveau ici ? [Getting Started](getting-started.md) détaille le premier changement.
- Vous n'êtes pas sûr de ce que vous voulez construire ? [Explore First](explore.md) est l'endroit où commencer.
- Confus sur l'endroit où les commandes s'exécutent ? [How Commands Work](how-commands-work.md).
- Voulez-vous la version approfondie de tout ce qui précède ? [Concepts](concepts.md).
- Apprenez par l'exemple ? [Examples & Recipes](examples.md).
- Un terme doit être défini ? [Glossary](glossary.md).