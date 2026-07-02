# Explorer en premier

**`/opsx:explore` est votre partenaire de réflexion.** Faites appel à lui chaque fois que vous avez un problème mais pas encore un plan. Il examine votre base de code, évalue les options avec vous et clarifie ce que vous voulez réellement, et ce, avant qu'un seul artefact ou ligne de code ne soit créé. Lorsque le tableau est clair, il passe la main à `/opsx:propose`.

Si vous tirez une habitude de cette documentation, prenez celle-ci : **si vous n'êtes pas sûr, explorez avant de proposer.**

Voici pourquoi cela est important. Les assistants de codage IA sont impatients. Posez des questions vagues et ils construiront avec confiance *quelque chose*, mais peut-être pas ce dont vous aviez besoin. Explore est le remède. C'est une conversation sans enjeu où vous et l'IA trouvez ensemble la bonne direction, afin que lorsque vous proposerez, vous proposiez la bonne chose.

## Quand explorer

Explorer est la première étape appropriée plus souvent que les gens ne le pensent. Utilisez-le si l'une de ces conditions est vraie :

- Vous connaissez le *problème* mais pas la *solution*. ("Les pages sont lentes." "L'authentification est un désastre." "Nous recevons des commandes en double.")
- Vous hésitez entre différentes approches et voulez que les compromis soient présentés par rapport à votre code actuel.
- Vous êtes nouveau dans une base de code et devez comprendre comment quelque chose fonctionne avant de le modifier.
- Les exigences sont floues et vous voulez les affiner avant de vous engager.
- Vous soupçonnez que le travail est plus grand ou plus petit qu'il n'y paraît et voulez l'évaluer honnêtement.

Sautez explorer uniquement si vous savez déjà exactement ce que vous voulez et comment le faire. Dans ce cas, allez directement à [`/opsx:propose`](commands.md#opsxpropose).

## Ce qu'il fait (et ne fait pas)

Explorer est une **conversation**, pas un générateur.

**Il fait :**
- Lit et recherche dans votre base de code pour répondre à des questions réelles.
- Compare les options et nomme les compromis de chacune d'elles.
- Dessine des diagrammes pour rendre la conception lisible.
- Vous aide à affiner une idée vague en un périmètre concret et réalisable.
- Passe le relais à `/opsx:propose` lorsque vous êtes prêt.

**Il ne fait pas :**
- Créer un dossier de changement.
- Écrire des artefacts (aucune proposition, spécifications, conception ou tâches).
- Écrire ou modifier du code.

C'est l'idée. Explorer ne vous coûte rien et ne vous engage à rien. Vous pouvez explorer trois impasses, apprendre quelque chose de chacune d'elles, et seulement ensuite proposer le chemin qui a survécu.

## Il est déjà installé

Bonne nouvelle : `/opsx:explore` est inclus dans le profil **core** par défaut, juste à côté de `propose`, `apply`, `sync` et `archive`. Vous n'avez rien besoin d'activer. Si OpenSpec est configuré dans votre projet, explore est prêt dans votre chat IA. (Comme pour toutes les commandes `/opsx:*`, vous le tapez dans le chat de votre assistant, pas dans le terminal. Voir [Comment fonctionnent les commandes](how-commands-work.md).)

## Un exemple complet

Regardez comment une inquiétude vague devient un changement précis et réalisable.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Our checkout sometimes creates duplicate orders. I don't know why
     and I don't know how to fix it safely.

AI:  Let me dig into the checkout path...
     [reads the order service, the payment webhook handler, and the
      client submit logic]

     Here's what I found. There are two ways a duplicate can happen:

     1. The client can submit twice (double-click, retry on slow network).
        Nothing debounces it.
     2. The payment webhook can fire more than once, and the handler
        creates an order each time. There's no idempotency key.

     Cause #2 is the dangerous one: it can charge and fulfill twice.

     Three ways to fix it, roughly in order of robustness:
     - Idempotency key on the order-creation endpoint (handles both causes)
     - Dedup on the webhook by payment-intent id (handles #2 only)
     - Client-side debounce (handles #1 only, papers over the real bug)

     Given your code already stores the payment-intent id, the
     idempotency-key approach is a small change with the biggest payoff.
     Want me to scope that?

You: Yes, let's do the idempotency key.

You: /opsx:propose add-order-idempotency-key

AI:  Created openspec/changes/add-order-idempotency-key/, with a proposal
     and delta spec grounded in what we just found. Ready for implementation.
```

Remarquez ce qui s'est passé. Le point de départ était "quelque chose ne va pas et j'ai peur d'y toucher". Vingt secondes d'exploration ont transformé cela en une cause première nommée, trois options classées, une recommandation liée au code existant et un changement précis. La proposition qui suit est précise parce que la réflexion a eu lieu en premier.

## Passer le relais à propose

Explore ne archive rien dans quoi que ce soit. Lorsque vous êtes prêt, vous commencez simplement un changement, et l'IA porte le contexte de votre conversation dans les artefacts.

```text
explore  ──►  propose  ──►  apply  ──►  archive
 (think)     (agree)       (build)     (record)
```

Vous pouvez le dire en langage courant ("mettons ceci en un changement") ou exécuter `/opsx:propose <name>` directement. Dans les deux cas, l'exploration que vous venez de faire devient la base de la proposition, et non une conversation jetable.

Si vous utilisez l'ensemble de commandes étendu, explore peut passer le relais à `/opsx:new` à la place, pour une création d'artefacts étape par étape. Voir [Workflows](workflows.md).

## Conseils pour une bonne exploration

- **Apportez le problème, pas la solution.** "Les connexions sont lentes" donne à l'IA de l'espace pour enquêter. "Ajouter un cache Redis" vous engage à l'avance sur une réponse que vous n'avez pas encore testée.
- **Demandez les compromis à voix haute.** "Quels sont les inconvénients de chaque option ?" vous donne une comparaison plus honnête.
- **Laissez-la lire d'abord.** Les meilleures explorations commencent par l'IA qui regarde réellement votre code, et non en devinant. Indiquez la zone pertinente si cela aide.
- **Il est permis d'abandonner.** Si l'exploration révèle que l'idée n'en vaut pas la peine, c'est une victoire. Vous avez appris à moindre coût.
- **Explorez à nouveau au milieu du changement.** Bloqué pendant `/opsx:apply`? Vous pouvez revenir en arrière et explorer un sous-problème, puis revenir.

## Les compromis honnêtes

**Ce que vous gagnez :** explore détecte les mauvaises tournures au moment le moins coûteux possible, avant qu'un quelconque artefact n'existe. C'est particulièrement puissant dans un code inconnu, où la capacité de l'IA à lire et à résumer le système vous fait gagner une après-midi d'exploration.

**Ce que cela coûte :** Un peu de patience. Explore est une conversation, donc c'est plus lent que de lancer `/opsx:propose` en espérant. Pour un travail que vous comprenez déjà vraiment, cette étape supplémentaire est une pure surcharge et vous devriez la sauter.

La règle générale : plus la tâche est floue, plus explore est payant. Plus la tâche est claire, plus vous pouvez passer directement à la proposition.

## Où aller ensuite

- [Commandes : `/opsx:explore`](commands.md#opsxexplore) : la référence précise
- [Workflows](workflows.md) : explorer dans le cadre de la boucle quotidienne
- [Exemples et recettes](examples.md#recipe-3-exploring-before-you-commit) : explorer dans un parcours complet
- [Démarrer](getting-started.md) : le guide du premier changement, incluant l'exploration