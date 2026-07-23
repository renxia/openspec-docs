# Exemples et recettes

Des modifications réelles, du début à la fin. Chaque recette présente les commandes que vous taperiez et ce que vous obtiendriez en retour, afin que vous puissiez faire correspondre votre situation à un modèle et le copier. Ces recettes utilisent les commandes **principales** par défaut (`propose`, `explore`, `apply`, `sync`, `archive`) ; lorsque l'ensemble de commandes étendu est utile, c'est indiqué.

Un rappel avant de commencer : les commandes slash comme `/opsx:propose` se saisissent dans le **chat de votre assistant IA**, et les commandes `openspec` se saisissent dans votre **terminal**. Si c'est nouveau pour vous, lisez d'abord [Comment fonctionnent les commandes](how-commands-work.md). Dans les transcriptions ci-dessous, `You:` et `AI:` correspondent au chat, et les lignes commençant par `$` correspondent au terminal.

> **Vous ne savez pas encore ce que vous allez développer ?** La plupart de ces recettes sont plus pertinentes si vous commencez par `/opsx:explore` pour y réfléchir au préalable. La [Recette 3](#recipe-3-exploring-before-you-commit) le montre en action, et le guide [Explorer d'abord](explore.md) expose l'argumentaire complet.

## Recette 1 : Une petite fonctionnalité, le chemin rapide

**Quand l'utiliser :** vous savez ce que vous voulez, et il s'agit d'un travail contenu. C'est la recette la plus courante.

Tout se résume à trois commandes : Proposer, construire, archiver.

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

Lisez maintenant le plan. Ouvrez la proposition et la spécification delta. C'est le moment pour lequel OpenSpec est conçu : repérer une hypothèse erronée tant qu'il s'agit encore d'un seul paragraphe, et non de 400 lignes de code. Modifiez directement tout artefact si quelque chose ne va pas, puis continuez.

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

C'est tout. Le comportement de déconnexion fait désormais partie de vos spécifications, et la modification est archivée avec l'ensemble de son contexte.

## Recette 2 : Une correction de bogue

**Quand l'utiliser :** quelque chose est cassé et vous voulez que la correction soit enregistrée comme une modification délibérée du comportement, et non comme un commit mystère.

Les corrections de bogues fonctionnent exactement comme les fonctionnalités. La différence réside dans la façon dont vous rédigez la proposition : décrivez le comportement *correct*, pas seulement « corriger le bogue ».

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

Comme la correction atterrit sous la forme d'une exigence `MODIFIED` avec un nouveau scénario, la personne suivante (ou la prochaine session IA) voit non seulement que vous avez corrigé le problème, mais aussi ce que signifie « correct ». Ensuite, utilisez `/opsx:apply` et `/opsx:archive` comme d'habitude.

Conseil : pour une correction, un bon scénario est le test de régression rédigé en prose. « GIVEN (ÉTANT DONNÉ) un utilisateur déconnecté, WHEN (QUAND) il soumet des identifiants valides, THEN (ALORS) il arrive sur le tableau de bord et n'est pas redirigé à nouveau. » Rédigez cela, et la mise en œuvre aura une cible claire.

## Recette 3 : Explorer avant de vous engager {#recipe-3-exploring-before-you-commit}

**Quand l'utiliser :** vous avez un problème mais pas encore de plan. Vous ne savez pas ce qu'il faut construire, ou quelle approche est la bonne.

Commencez par `/opsx:explore`. C'est un partenaire de réflexion sans structure et sans artefact créé. Il lit votre base de code et vous aide à décider.

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

L'exploration clarifie votre réflexion *avant* que vous ne consacriez une modification à ce sujet. Lorsque l'idée se cristallise, faites une proposition, et l'IA transmet le contexte.

## Recette 4 : Gérer deux modifications en même temps

**Quand l'utiliser :** vous êtes en plein développement d'une fonctionnalité et une correction urgente passe en priorité.

Les modifications sont des dossiers indépendants, donc le travail parallèle n'engendre pas de conflits. Commencez la correction, déployez-la, puis revenez à la fonctionnalité exactement là où vous vous étiez arrêté.

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

Indiquer le nom de la modification dans `/opsx:apply add-dark-mode` permet de désigner une modification spécifique à l'IA lorsque plusieurs sont actives. Comme les tâches suivent leur état d'avancement dans `tasks.md`, l'IA sait exactement où vous vous êtes arrêté.

Lorsque plusieurs modifications sont terminées en même temps, la commande étendue `/opsx:bulk-archive` les archive ensemble et résout les conflits de spécifications en vérifiant ce qui est réellement implémenté. Voir [Workflows](workflows.md#parallel-changes).

## Recette 5 : Une refactorisation sans changement de comportement

**Quand l'utiliser :** vous restructurez du code, et le comportement visible de l'extérieur doit rester identique.

C'est le cas intéressant, car une refactorisation pure n'a *rien à ajouter à vos spécifications*. Le contrat de comportement ne change pas ; seule l'implémentation change. Donc le travail réside dans la conception et les tâches, et le delta de spécification est vide ou absent.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

Déclarez explicitement le delta vide en définissant `skip_specs: true` dans le fichier `.openspec.yaml` de la modification :

```yaml
schema: spec-driven
skip_specs: true
```

Sans ce marqueur, `openspec validate` rejette une modification avec zéro delta (ainsi, une phase de spécifications oubliée est toujours détectée) ; avec lui, la validation passe et `openspec status` affiche l'étape des spécifications comme explicitement ignorée plutôt qu'en attente. Si la refactorisation s'avère finalement modifier le comportement, supprimez `skip_specs` de `.openspec.yaml` et rédigez les spécifications delta — la validation considère la combinaison du marqueur et des fichiers de spécifications comme un conflit, donc le marqueur obsolète ne peut pas rester silencieusement.

L'archivage d'une modification marquée ne nécessite aucun indicateur supplémentaire (il n'y a pas de delta à fusionner). Indépendamment, l'indicateur `--skip-specs` indique à la commande terminal d'ignorer explicitement l'étape de spécification :

```bash
$ openspec archive refactor-payment-module --skip-specs
```

Ce même indicateur est pratique pour les outils, l'intégration continue et les modifications portant uniquement sur la documentation. Le principe : les spécifications décrivent le comportement, donc si le comportement n'a pas changé, la spécification ne doit pas changer non plus. Voir [Concepts](concepts.md#what-a-spec-is-and-is-not).

## Recette 6 : Contrôle étape par étape (commandes étendues)

**Quand l'utiliser :** une modification complexe ou risquée pour laquelle vous voulez examiner chaque artefact avant de passer à l'étape suivante.

La commande principale `/opsx:propose` rédige tout en une seule fois. Si vous préférez avancer étape par étape, activez les commandes étendues :

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

Vous pouvez désormais créer le squelette et construire incrémentalement :

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

Examinez chaque artefact au fur et à mesure qu'il est créé, modifiez-le librement, et continuez lorsque vous êtes satisfait. Si vous voulez que le reste soit rédigé en une seule fois, `/opsx:ff` passe rapidement l'ensemble des artefacts de planification restants. Avant l'archivage, `/opsx:verify` vérifie que l'implémentation correspond bien aux spécifications. Voir [Workflows](workflows.md#opsxff-vs-opsxcontinue).

## Recette 7 : Apprendre le cycle complet par la pratique

**Quand l'utiliser :** vous avez installé OpenSpec et voulez *ressentir* le workflow sur votre propre code, pas sur un exemple factice.

Activez les commandes étendues (voir Recette 6), puis :

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` trouve une amélioration réelle (petite), crée une modification pour celle-ci, l'implémente et l'archive, en narrant chaque étape. Cela prend entre 15 et 30 minutes et vous laisse avec une modification réelle que vous pouvez conserver ou abandonner. C'est la façon la plus douce d'apprendre. Voir [Commands](commands.md#opsxonboard).

## Vérifier votre travail depuis le terminal

À tout moment, depuis votre terminal, vous pouvez inspecter l'état des éléments :

```bash
$ openspec list                      # modifications actives
$ openspec show add-dark-mode        # une modification en détail
$ openspec validate add-dark-mode    # vérifier la structure
$ openspec view                      # tableau de bord interactif
```

Ce sont des outils de lecture et d'inspection. La proposition et la construction se font toujours via des commandes slash dans le chat. Tous les détails dans la [référence CLI](cli.md).

## Où aller ensuite

- [Explorer d'abord](explore.md) : la façon recommandée de commencer lorsque vous n'êtes pas sûr
- [Workflows](workflows.md) : les modèles ci-dessus, avec des conseils de décision sur le moment d'utiliser chacun
- [Commands](commands.md) : chaque commande slash en détail
- [Getting Started](getting-started.md) : le guide canonique pour la première modification
- [Concepts](concepts.md) : pourquoi les éléments s'assemblent de cette façon