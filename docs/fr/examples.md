# Exemples et Recettes

Des changements réels, du début à la fin. Chaque recette montre les commandes que vous taperiez et ce que vous verriez en retour, afin que vous puissiez faire correspondre votre situation à un modèle et le copier. Ceux-ci utilisent les commandes **core** par défaut (`propose`, `explore`, `apply`, `sync`, `archive`); si l'ensemble étendu est utile, cela est noté.

Un rappel avant de commencer : les commandes slash comme `/opsx:propose` vont dans le **chat de votre assistant IA**, et les commandes `openspec` vont dans votre **terminal**. Si c'est nouveau pour vous, lisez d'abord [Comment fonctionnent les commandes](how-commands-work.md). Dans les transcriptions ci-dessous, `You:` et `AI:` représentent le chat, et les lignes commençant par `$` sont le terminal.

> **Vous n'êtes pas sûr de ce que vous construisez ?** La plupart de ces recettes sont plus claires si vous commencez par `/opsx:explore` pour réfléchir d'abord. [Recipe 3](#recipe-3-exploring-before-you-commit) le montre en action, et le guide [Explore First](explore.md) expose l'argumentation complète.

## Recipe 1 : Une petite fonctionnalité, la voie rapide

**Quand l'utiliser :** vous savez ce que vous voulez, et c'est une tâche contenue. C'est la recette la plus courante.

L'ensemble est de trois commandes. Proposer, construire, archiver.

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

Lisez maintenant le plan. Ouvrez la proposition et la spécification delta. C'est le moment pour lequel OpenSpec est conçu : attraper une hypothèse erronée alors qu'elle n'est encore qu'un paragraphe, pas 400 lignes de code. Modifiez tout artefact directement si quelque chose cloche, puis continuez.

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Add logout button to header
     ✓ 1.2 Clear session on click
     ✓ 1.3 Add confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  Archiving add-logout-button...
     ✓ Merged specs into openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2026-06-22-add-logout-button/
     Done. Ready for the next change.
```

C'est tout. Le comportement de déconnexion fait maintenant partie de vos spécifications, et le changement est classé avec son contexte complet.

## Recipe 2 : Une correction de bug

**Quand l'utiliser :** quelque chose est cassé et vous voulez que la correction soit enregistrée comme un changement délibéré du comportement, pas un commit mystérieux.

Les corrections de bugs fonctionnent exactement comme les fonctionnalités. La différence réside dans la manière dont vous formulez la proposition : décrivez le comportement *correct*, pas seulement « corriger le bug ».

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

Puisque la correction est enregistrée comme une exigence `MODIFIED` avec un scénario frais, la prochaine personne (ou la prochaine session IA) voit non seulement que vous l'avez corrigé, mais ce que signifie « correct ». Ensuite `/opsx:apply` et `/opsx:archive` comme d'habitude.

Conseil : pour une correction, un bon scénario est le test de régression en prose. « ÉTANT QU'un utilisateur déconnecté, QUAND il soumet des identifiants valides, ALORS il atterrit sur le tableau de bord et n'est pas redirigé à nouveau. » Écrivez cela, et l'implémentation aura une cible claire.

## Recipe 3 : Explorer avant de commettre

**Quand l'utiliser :** vous avez un problème mais pas encore un plan. Vous n'êtes pas sûr de ce que construire, ou quelle approche est la bonne.

Commencez par `/opsx:explore`. C'est un partenaire de réflexion sans structure ni artefacts créés. Il lit votre base de code et vous aide à décider.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Page loads feel slow but I don't know where the time goes.

AI:  Let me look... I found three likely culprits:
     1. Large unoptimized images on the product list
     2. Synchronous data fetching that blocks render
     3. Re-renders triggered by context changes
     Which should we tackle first?

You: The data fetching one.

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation.
```

L'exploration clarifie votre pensée *avant* que vous ne dépensiez un changement pour cela. Lorsque l'intuition se cristallise, proposez, et l'IA porte le contexte en avant.

## Recipe 4 : Gérer deux changements à la fois

**Quand l'utiliser :** vous êtes au milieu d'une fonctionnalité et une correction urgente saute la file d'attente.

Les changements sont des dossiers indépendants, donc le travail parallèle ne crée pas de conflit. Commencez par la correction, livrez-la, puis revenez à la fonctionnalité là où vous l'aviez laissée.

```text
You: I'm partway through add-dark-mode, but I need to fix a login bug now.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Ready for implementation.

You: /opsx:apply

AI:  Implemented the fix. All tasks complete.

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect.

You: Back to dark mode.

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode. Picking up at task 2.3: Update Header...
```

Nommer le changement dans `/opsx:apply add-dark-mode` est la façon de pointer l'IA vers un changement spécifique lorsqu'il y en a plusieurs actifs. Puisque les tâches suivent l'achèvement dans `tasks.md`, l'IA sait exactement où vous avez arrêté.

Lorsque plusieurs changements sont terminés à la fois, le fichier étendu `/opsx:bulk-archive` les archive ensemble et résout les conflits de spécification en vérifiant ce qui est réellement implémenté. Voir [Workflows](workflows.md#parallel-changes).

## Recipe 5 : Un refactor sans changement de comportement

**Quand l'utiliser :** vous êtes en train de restructurer du code, et le comportement visible extérieurement doit rester identique.

C'est le cas intéressant, car un refactor pur n'a *rien à ajouter à vos spécifications*. Le contrat de comportement ne change pas ; seule l'implémentation le fait. Donc le travail réside dans la conception et les tâches, et le delta de spécification est vide ou absent.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

Lorsque vous archivez un changement qui ne touche pas les spécifications, vous pouvez dire à la commande terminale de sauter l'étape de spécification :

```bash
$ openspec archive refactor-payment-module --skip-specs
```

Le même drapeau est utile pour les outils, le CI et les changements uniquement documentaires. Le principe : les spécifications décrivent le comportement, donc si le comportement n'a pas changé, la spécification ne devrait pas non plus. Voir [Concepts](concepts.md#what-a-spec-is-and-is-not).

## Recipe 6 : Contrôle étape par étape (commandes étendues)

**Quand l'utiliser :** un changement complexe ou risqué où vous voulez revoir chaque artefact avant de passer à autre chose.

Le `/opsx:propose` core rédige tout d'un coup. Lorsque vous préférez procéder étape par étape, activez les commandes étendues :

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

Vous pouvez maintenant créer et construire de manière incrémentielle :

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

Revoyez chaque artefact au fur et à mesure qu'il apparaît, modifiez librement, et continuez lorsque vous êtes satisfait. Lorsque vous voulez le reste rédigé en une seule fois, `/opsx:ff` avance rapidement à travers les artefacts de planification restants. Avant d'archiver, `/opsx:verify` vérifie que l'implémentation correspond réellement aux spécifications. Voir [Workflows](workflows.md#opsxff-vs-opsxcontinue).

## Recipe 7 : Apprendre le cycle complet en pratique

**Quand l'utiliser :** vous avez installé OpenSpec et voulez *ressentir* le flux de travail sur votre propre code, pas un exemple jouet.

Activez les commandes étendues (voir Recipe 6), puis :

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` trouve une amélioration réelle (petite), crée un changement pour elle, l'implémente et l'archive, narrant chaque étape. Cela prend de 15 à 30 minutes et vous laisse avec un changement réel que vous pouvez conserver ou jeter. C'est la manière la plus douce d'apprendre. Voir [Commands](commands.md#opsxonboard).

## Vérifier votre travail depuis le terminal

À tout moment, depuis votre terminal, vous pouvez inspecter l'état des choses :

```bash
$ openspec list                      # active changes
$ openspec show add-dark-mode        # one change in detail
$ openspec validate add-dark-mode    # check structure
$ openspec view                      # interactive dashboard
```

Ce sont des outils de lecture et d'inspection. La proposition et la construction se font toujours via les commandes slash dans le chat. Détails complets dans [CLI reference](cli.md).

## Où aller ensuite

- [Explore First](explore.md) : la manière recommandée pour commencer lorsque vous n'êtes pas sûr
- [Workflows](workflows.md) : les modèles ci-dessus, avec des conseils de décision sur quand utiliser chacun d'eux
- [Commands](commands.md) : chaque commande slash en détail
- [Getting Started](getting-started.md) : le parcours canonique du premier changement
- [Concepts](concepts.md) : pourquoi les pièces s'assemblent comme elles le font