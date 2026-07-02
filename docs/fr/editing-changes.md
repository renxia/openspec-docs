# Modifier et itérer sur un changement

**Chaque artefact d'un changement est simplement un fichier Markdown que vous pouvez modifier à tout moment.** Il n'y a pas de « phase de planification » verrouillée, ni de porte d'approbation, ni de mode d'édition spécial à entrer. Vous voulez modifier la proposition après avoir commencé la construction ? Ouvrez `proposal.md` et modifiez-le. Avez-vous réalisé que le design est incorrect en cours d'implémentation ? Corrigez `design.md` et continuez. C'est toute l'histoire, et c'est voulu.

Cette page est pour le moment où vous pensez : « Attendez, puis-je revenir en arrière et changer cela ? » Oui. Voici comment procéder dans chaque cas courant.

## Deux façons de modifier n'importe quoi

Vous avez toujours les deux options :

1. **Modifier le fichier directement.** Les artefacts sont du Markdown simple dans `openspec/changes/<name>/`. Ouvrez `proposal.md`, `design.md`, `tasks.md` ou une delta spec sous `specs/` dans votre éditeur et modifiez-le. Rien d'autre n'est requis.

2. **Demander à votre IA de le réviser.** Dans le chat, dites simplement ce que vous voulez : « Mettez à jour la proposition pour supprimer l'idée de mise en cache et ajouter une section sur les limites de débit », ou « Le design devrait utiliser une file d'attente, pas du polling. » L'IA modifie l'artefact pour vous, en utilisant le reste du changement comme contexte.

Utilisez celle qui correspond au moment. Une petite modification de formulation ? Modifiez le fichier. Une réflexion substantielle ? Laissez l'IA réviser avec le contexte complet.

## « Comment puis-je mettre à jour la proposition (ou les spécifications) après avoir commencé ? »

Modifiez-le simplement. Le même changement, raffiné.

Si vous utilisez les commandes étendues, le flux naturel est : modifiez l'artefact, puis exécutez `/opsx:continue` pour reprendre à partir du nouvel état, ou `/opsx:apply` pour continuer à implémenter par rapport au plan mis à jour. Si vous êtes sur les commandes `core` par défaut, modifiez l'artefact et exécutez `/opsx:apply` ; il lit les fichiers actuels, il construit donc en fonction de ce que disent les artefacts.

Le modèle mental : les artefacts sont le plan vivant, pas un contrat signé. L'IA travaille toujours à partir de leur contenu actuel, donc les modifier oriente le travail.

```text
Vous: Je veux changer l'approche dans ce changement.

Vous: [modifier design.md, ou dire à l'IA :]
     Mettre à jour design.md pour utiliser une tâche en arrière-plan au lieu d'un appel synchrone.

IA:  design.md mis à jour. La liste des tâches correspond toujours ; voulez-vous que je continue à appliquer ?

Vous: /opsx:apply
```

Ceci répond à une question très courante : il n'y a pas de commande séparée « mettre à jour la proposition » car vous n'en avez pas besoin. Le fichier est la source de vérité, et le modifier (manuellement ou via l'IA) constitue la mise à jour.

## « Comment puis-je revenir pour revoir après avoir implémenté ? »

Vous n'avez pas besoin de « revenir en arrière », car vous ne l'avez jamais quitté. Le flux de travail est fluide : réviser, modifier et implémentation ne sont pas des phases séquentielles dans lesquelles vous êtes coincé.

Concrètement, après un travail `/opsx:apply` :

- Vous voulez réexaminer le plan ? Ouvrez les artefacts et lisez-les, ou exécutez `openspec show <change>` dans votre terminal pour une vue consolidée.
- Vous avez trouvé quelque chose à changer ? Modifiez l'artefact (ou demandez à l'IA de le faire), puis continuez.
- Voulez-vous une vérification structurée que le code correspond au plan ? Exécutez `/opsx:verify` (commande étendue). Il signale la complétude, la correction et la cohérence sans bloquer quoi que ce soit. Voir [Workflows: Verify](workflows.md#verify-check-your-work).

Il n'y a pas de « phase de révision » à laquelle revenir, car la révision est quelque chose que vous pouvez faire à tout moment, y compris après l'implémentation.

## « J'ai modifié le code manuellement. Comment concilier cela avec OpenSpec ? »

Cela arrive constamment et c'est normal. Vous avez ajusté quelque chose dans votre éditeur, et maintenant le code et les artefacts ne correspondent pas. Remettez-les en synchro dans la direction qui est vraie :

- **Le code est correct, la spécification est obsolète.** Mettez à jour la delta spec (et les tâches, si pertinent) pour décrire le comportement que vous avez réellement livré. La spécification doit correspondre à la réalité avant d'archiver, car l'archivage fusionne la spécification dans votre source de vérité.
- **La spécification est correcte, le code a dévié.** Continuez à construire ou à corriger jusqu'à ce que le code corresponde à la spécification.

Une façon rapide de faire apparaître les incohérences est `/opsx:verify` : il lit vos artefacts et votre code et vous dit où ils divergent. Traitez son résultat comme une liste de tâches pour la réconciliation, puis archivez une fois qu'ils sont d'accord.

Le principe : au moment de l'archivage, vos spécifications deviennent la vérité enregistrée. Donc avant d'archiver, faites en sorte que les spécifications soient honnêtes quant à ce que fait le code. Les modifications manuelles sont bienvenues ; ne laissez simplement pas qu'elles désynchronisent silencieusement la spécification.

## Affiner une proposition que vous n'aimez pas

Si une proposition générée est décevante, vous avez trois bonnes options :

- **Itérer sur place.** Dites à l'IA ce qui cloche (« le périmètre est trop vaste, supprimez les fonctionnalités d'administration ») et laissez-la réviser. C'est l'option la moins coûteuse et généralement la bonne.
- **Explorer d'abord, puis proposer à nouveau.** Si le problème est que l'idée elle-même n'est pas claire, revenez à `/opsx:explore`, réfléchissez-y et laissez une proposition plus nette en découler. Voir [Explore First](explore.md).
- **Commencer de zéro.** Si l'intention a fondamentalement changé, un nouveau changement peut être plus clair que de patcher l'ancien.

Ce dernier mouvement a son propre guide de décision, ensuite.

## Quand mettre à jour par rapport à commencer un nouveau changement

Version courte : **mettez à jour lorsque c'est le même travail raffiné ; commencez un nouveau changement lorsque l'intention a fondamentalement changé ou que le périmètre est explosé en un autre travail.**

- Même objectif, meilleure approche ? Mettez à jour.
- Réduction du périmètre (livrer le MVP maintenant, plus tard) ? Mettez à jour, puis archivez, puis un nouveau changement pour la phase deux.
- Le problème lui-même a changé (« ajouter le mode sombre » est devenu « construire un système de thèmes complet ») ? Nouveau changement.

Il existe un organigramme complet et des exemples travaillés dans [Workflows: When to Update vs Start Fresh](workflows.md#when-to-update-vs-start-fresh) et un traitement plus approfondi dans [OPSX: When to Update vs. Start Fresh](opsx.md#when-to-update-vs-start-fresh).

## Une note sur les tâches

`tasks.md` est une liste de contrôle vivante, pas un plan figé. Au fur et à mesure que vous implémentez, vous pouvez ajouter des tâches que vous découvrez, supprimer celles qui se sont avérées inutiles ou les réordonner. L'IA coche les éléments au fur et à mesure qu'elle les complète pendant `/opsx:apply`, et elle reprend à partir de la première tâche non cochée si vous revenez plus tard. Modifier la liste en cours de route est attendu.

## Où aller ensuite

- [Workflows](workflows.md) - modèles, ainsi que le guide de décision mise à jour vs nouveau
- [Explore First](explore.md) - l'endroit où revenir lorsque une idée nécessite d'être repensée
- [Commands](commands.md) - `/opsx:continue`, `/opsx:apply` et `/opsx:verify` en détail
- [Concepts: Artifacts](concepts.md#artifacts) - à quoi sert chaque artefact