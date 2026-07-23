# Modification et itération d'une modification

**Chaque artefact d'une modification est un simple fichier Markdown que vous pouvez modifier à tout moment.** Il n'y a pas de « phase de planification » verrouillée, pas de point d'approbation obligatoire, pas de mode d'édition spécial à activer. Vous voulez modifier la proposition après avoir commencé le développement ? Ouvrez `proposal.md` et modifiez-la. Vous vous rendez compte que la conception est erronée en cours d'implémentation ? Corrigez `design.md` et continuez. C'est tout, et c'est volontaire.

Cette page est là pour le moment où vous vous demandez « attendez, puis-je revenir en arrière et modifier ça ? » La réponse est oui. Voici comment procéder pour chaque cas courant.

## Deux façons de modifier quoi que ce soit

Vous avez toujours les deux options :

1. **Modifiez le fichier directement.** Les artefacts sont des fichiers Markdown bruts situés dans `openspec/changes/<name>/`. Ouvrez `proposal.md`, `design.md`, `tasks.md` ou une spécification delta dans le dossier `specs/` avec votre éditeur et modifiez-les. Aucune autre action n'est nécessaire.

2. **Demandez à votre IA de le réviser.** Dans la conversation, dites simplement ce que vous voulez : « Mettez à jour la proposition pour supprimer l'idée de mise en cache et ajouter une section sur la limitation de débit », ou « la conception doit utiliser une file d'attente, pas un système de scrutation ». L'IA modifie l'artefact pour vous, en utilisant le reste de la modification comme contexte.

Utilisez celle qui correspond le mieux à la situation. Petite modification de formulation ? Éditez le fichier. Réflexion plus approfondie ? Laissez l'IA réviser avec l'ensemble du contexte.

## « Comment mettre à jour la proposition (ou les spécifications) après avoir commencé ? »

Mettez-la simplement à jour. C'est la même modification, affinée.

Si vous utilisez les commandes étendues, le flux naturel est le suivant : modifiez l'artefact, puis exécutez `/opsx:continue` pour reprendre à partir du nouvel état, ou `/opsx:apply` pour continuer l'implémentation sur la base du plan mis à jour. Si vous utilisez les commandes `core` par défaut, modifiez l'artefact et exécutez `/opsx:apply` ; la commande lit les fichiers actuels, donc elle construit sur la base de ce que les artefacts indiquent désormais.

Le modèle mental : les artefacts sont le plan en direct, pas un contrat signé. L'IA travaille toujours à partir de leur contenu actuel, donc les modifier permet de guider le travail.

```text
Vous : Je veux modifier l'approche de cette modification.

Vous : [modifiez design.md, ou dites à l'IA :]
     Mettez à jour design.md pour utiliser une tâche en arrière-plan au lieu d'un appel synchrone.

IA :  design.md a été mis à jour. La liste des tâches est toujours adaptée, voulez-vous que je continue l'application ?

Vous : /opsx:apply
```

Cela répond à une question très courante : il n'y a pas de commande séparée « mettre à jour la proposition » parce que vous n'en avez pas besoin. Le fichier est la source de vérité, et le modifier (à la main ou via l'IA) constitue la mise à jour.

## « Comment revenir à l'étape de revue après l'implémentation ? »

Vous n'avez pas à « revenir en arrière », car vous n'êtes jamais parti. Le flux de travail est fluide : la revue, la modification et l'implémentation ne sont pas des phases séquentielles dans lesquelles vous êtes coincé.

Concrètement, après un travail avec `/opsx:apply` :

- Vous voulez réexaminer le plan ? Ouvrez les artefacts et lisez-les, ou exécutez `openspec show <change>` dans votre terminal pour obtenir une vue consolidée.
- Vous avez trouvé quelque chose à modifier ? Modifiez l'artefact (ou demandez à l'IA de le faire), puis continuez.
- Vous voulez une vérification structurée pour vérifier que le code correspond au plan ? Exécutez `/opsx:verify` (commande étendue). Elle signale la complétude, la correction et la cohérence sans bloquer quoi que ce soit. Voir [Workflows : Vérifiez votre travail](workflows.md#verify-check-your-work).

Il n'y a pas de « phase de revue » à laquelle revenir, car la revue est quelque chose que vous pouvez faire à tout moment, y compris après l'implémentation.

## « J'ai modifié le code à la main. Comment le réconcilier avec OpenSpec ? »

Cela arrive tout le temps et ce n'est pas un problème. Vous avez ajusté quelque chose dans votre éditeur, et maintenant le code et les artefacts ne sont pas d'accord. Remettez-les en synchronisation dans la direction qui est correcte :

- **Le code est désormais correct, la spécification est obsolète.** Mettez à jour la spécification delta (et les tâches, si pertinent) pour décrire le comportement que vous avez réellement mis en production. La spécification doit correspondre à la réalité avant l'archivage, car l'archivage fusionne la spécification dans votre source de vérité.
- **La spécification est correcte, le code a dérivé.** Continuez le développement ou la correction jusqu'à ce que le code corresponde à la spécification.

Un moyen rapide de détecter les écarts est `/opsx:verify` : elle lit vos artefacts et votre code et vous indique où ils divergent. Traitez sa sortie comme une liste de tâches pour la réconciliation, puis archivez une fois qu'ils sont d'accord.

Le principe : au moment de l'archivage, vos spécifications deviennent la référence officielle. Donc avant d'archiver, rendez les spécifications honnêtes par rapport à ce que fait le code. Les modifications manuelles sont les bienvenues ; évitez simplement qu'elles ne désynchronisent la spécification sans que vous vous en rendiez compte.

## Affiner une proposition qui ne vous satisfait pas

Si une proposition générée ne correspond pas à ce que vous attendez, vous avez trois bonnes options :

- **Itérez sur place.** Dites à l'IA ce qui ne va pas (« la portée est trop large, supprimez les fonctionnalités d'administration ») et laissez-la réviser. C'est l'option la moins coûteuse et c'est généralement la bonne.
- **Explorez d'abord, puis reproposez.** Si le problème est que l'idée elle-même n'est pas claire, revenez à `/opsx:explore`, réfléchissez-y, et laissez une proposition plus précise en ressortir. Voir [Explorer d'abord](explore.md).
- **Repartir de zéro.** Si l'intention a fondamentalement changé, une nouvelle modification peut être plus claire que de corriger l'ancienne.

Cette dernière option a son propre guide de décision, juste après.

## Quand mettre à jour ou commencer une nouvelle modification

Version courte : **mettez à jour quand c'est le même travail affiné ; commencez une nouvelle modification quand l'intention a fondamentalement changé ou que la portée a explosé pour devenir un travail totalement différent.**

- Même objectif, meilleure approche ? Mettez à jour.
- Réduction de la portée (livrer la MVP maintenant, le reste plus tard) ? Mettez à jour, puis archivez, puis créez une nouvelle modification pour la phase deux.
- Le problème lui-même a changé (« ajouter le mode sombre » est devenu « construire un système de thème complet ») ? Nouvelle modification.

Il y a un diagramme complet et des exemples concrets dans [Workflows : Quand mettre à jour ou repartir de zéro](workflows.md#when-to-update-vs-start-fresh) et un traitement plus approfondi dans [OPSX : Quand mettre à jour ou repartir de zéro](opsx.md#when-to-update-vs-start-fresh).

## Une note sur les tâches

`tasks.md` est une liste de contrôle vivante, pas un plan figé. Au fur et à mesure de l'implémentation, vous pouvez ajouter des tâches que vous découvrez, supprimer celles qui se sont avérées inutiles, ou les réordonner. L'IA coche les éléments au fur et à mesure qu'elle les termine pendant `/opsx:apply`, et elle reprend à la première tâche non cochée si vous revenez plus tard. Modifier la liste en cours de route est tout à fait normal.

## Où aller ensuite

- [Workflows](workflows.md) - schémas, plus le guide de décision mise à jour vs nouvelle modification
- [Examiner une modification](reviewing-changes.md) - le passage de deux minutes sur un plan avant de commencer à le construire
- [Explorer d'abord](explore.md) - l'endroit où revenir quand une idée a besoin d'être repensée
- [Commandes](commands.md) - `/opsx:continue`, `/opsx:apply` et `/opsx:verify` en détail
- [Concepts : Artefacts](concepts.md#artifacts) - à quoi sert chaque artefact