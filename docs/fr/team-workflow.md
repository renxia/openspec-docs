# OpenSpec en équipe

Tout ce qui est expliqué dans les autres guides fonctionne de la même manière, que vous travailliez seul ou en équipe de vingt personnes. Ce qui change en équipe, ce sont les questions périphériques : où stocker les spécifications, comment les coéquipiers révisent un plan, et comment tout cela s'intègre au flux de pull requests que vous utilisez déjà ?

La réponse courte : une modification n'est qu'un ensemble de fichiers, et OpenSpec ne touche jamais à git. Il s'intègre donc à votre flux de travail existant au lieu de le remplacer. Cette page détaille les conventions qui fonctionnent bien.

## Une seule règle : OpenSpec ne touche pas à git

OpenSpec lit et écrit du Markdown brut dans le dossier `openspec/`. Il ne réalise jamais de commit, de création de branche, de push ou de pull sur votre projet, et ne clone ni ne synchronise jamais un [store](stores-beta/user-guide.md) de lui-même. Cela signifie que :

- **Vous commitez le dossier `openspec/` comme n'importe quelle source.** Les spécifications, les modifications actives et l'archive font partie de l'historique de votre projet. (Oui, commitez l'ensemble du dossier — consultez la [FAQ](faq.md#should-i-commit-the-openspec-folder-to-git).)
- **Une modification est un dossier que vous versionnez comme du code.** `openspec/changes/add-dark-mode/` n'est qu'un ensemble de fichiers sur une branche.
- **Tout ce qui suit est une convention, pas une obligation.** OpenSpec ne vous obligera pas à procéder de cette manière ; il s'intègre simplement parfaitement.

## Le flux de travail quotidien

Le flux de travail qui fonctionne bien associe une modification à une branche et une pull request :

```
git switch -c add-dark-mode        démarrer une branche, comme d'habitude
   │
/opsx:propose add-dark-mode        rédiger le plan (proposition + spécifications + tâches)
   │
RÉVISION DU PLAN                   vous le lisez avant tout code — voir Réviser une modification
   │
/opsx:apply                        le construire ; artefacts et modification de code vont de pair
   │
git commit && open a PR            la pull request contient le delta de spécification ET le code
   │
les coéquipiers révisent, fusionnent
   │
/opsx:archive                      intégrer le delta dans specs/, déplacer la modification vers archive/
```

Le plan et le code cohabitent dans la même branche, vos coéquipiers peuvent donc réviser les deux en même temps, et six mois plus tard, la spécification archivée explique toujours pourquoi le code est tel qu'il est.

## Réviser les spécifications dans une pull request

C'est là que l'équipe perçoit les bénéfices. Lorsqu'une pull request inclut le delta de spécification de la modification, le relecteur obtient quelque chose qu'un diff brut ne lui donnera jamais : **un énoncé en langage clair de ce que cette modification est censée faire**, avant même de lire une seule ligne de code.

Un ordre de révision optimal pour le relecteur :
1. **Lisez `proposal.md`** — s'agit-il du bon problème et du bon périmètre ?
2. **Lisez le delta dans le dossier `specs/`** — la définition de « terminé » est-elle correcte ? (Il s'agit du passage de révision de deux minutes [Réviser une modification](reviewing-changes.md), qui se déroule désormais dans la pull request.)
3. **Lisez ensuite le diff du code** — répond-il exactement à ces exigences ?

Un relecteur qui n'est pas d'accord avec *l'approche* peut le signaler directement sur la proposition, à moindre coût, au lieu de redébattre de ce point sur 300 lignes de code. Placez le delta de spécification en haut de la description de la pull request, ou indiquez aux relecteurs le chemin vers le dossier de modification, pour qu'ils commencent par là.

## Quand archiver

L'archivage intègre les deltas d'une modification dans votre dossier principal `openspec/specs/` et déplace le dossier de modification vers `openspec/changes/archive/AAAA-MM-JJ-<nom>/`. Comme `specs/` est la **source de vérité partagée**, le moment de l'archivage est important en équipe. Deux conventions fonctionnelles :
- **Archiver après la fusion de la pull request (recommandé).** La branche contient la modification active ; une fois fusionnée dans votre branche principale, archivez-la à cet endroit (généralement via un petit commit de suivi ou un nettoyage planifié). Cela permet de ne faire avancer la `specs/` partagée qu'avec les fonctionnalités qui ont réellement été déployées.
- **Archiver dans la pull request.** Plus simple pour les petites équipes : la même pull request qui ajoute le code synchronise et archive également. L'inconvénient est que le diff de `specs/` et le diff du code sont fusionnés en même temps, ce qui peut rendre la pull request plus chargée.

Choisissez une convention et tenez-vous-y. Dans les deux cas, la commande `/opsx:archive` vérifie que les tâches sont terminées et propose de synchroniser d'abord, pour éviter qu'une modification à moitié finie ne soit fusionnée par erreur.

## Deux personnes, modifications parallèles

Comme les modifications sont stockées dans des dossiers distincts, elles n'entrent pas en conflit :
- **Modifications différentes, personnes différentes — pas de problème.** `add-dark-mode` et `rate-limit-login` sont des dossiers distincts sur des branches différentes ; ils n'ont aucun contact jusqu'à ce qu'ils soient tous deux archivés.
- **Une modification, un responsable.** Deux personnes qui modifient le même dossier de modification entrent en conflit exactement comme deux personnes qui modifient le même fichier. Confiez une modification à un seul auteur, ou divisez-la en deux modifications (une raison supplémentaire de [bien dimensionner la modification](writing-specs.md#right-size-the-change)).
- **Le seul endroit où des conflits peuvent apparaître est `specs/`.** Si deux modifications modifient la *même* exigence, l'archivage de la deuxième générera un conflit dans `openspec/specs/…/spec.md` — résolvez-le comme n'importe quel conflit de fusion, en conservant l'exigence qui correspond à la réalité. Ce cas est rare, et c'est une fonctionnalité : c'est git qui vous indique que deux modifications n'étaient pas d'accord sur le fonctionnement du système.

## Quand la planification dépasse le cadre d'un seul dépôt

Tout ce qui précède suppose que le plan est stocké dans le dossier `openspec/` du dépôt de code lui-même, ce qui est la valeur par défaut adaptée. Lorsque votre planification concerne réellement plusieurs dépôts ou équipes — une fonctionnalité touchant trois services, ou des exigences détenues par une équipe et utilisées par d'autres — c'est à cela que sert la fonctionnalité bêta des **stores** : la planification dispose de son propre dépôt, auquel n'importe quel dépôt de code peut faire référence. Commencez par le [Guide utilisateur des Stores](stores-beta/user-guide.md).

## Pour aller plus loin

- [Réviser une modification](reviewing-changes.md) — le passage de révision, désormais intégré à votre pull request.
- [Rédiger de bonnes spécifications](writing-specs.md) — notamment comment bien dimensionner une modification pour qu'elle tienne dans une seule branche.
- [Guide utilisateur des Stores](stores-beta/user-guide.md) — la planification qui couvre plusieurs dépôts et équipes.