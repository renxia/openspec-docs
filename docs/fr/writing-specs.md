# Rédiger de bonnes spécifications

Vous rédigez rarement une spécification à partir d'une page blanche. Vous décrivez une modification en langage simple, `/opsx:propose` rédige les exigences et les scénarios, puis vous les améliorez. Cette page traite de cette dernière étape : ce qu'est une « bonne » spécification, et comment orienter l'IA pour y parvenir.

Il s'agit du complément de [Révision d'une modification](reviewing-changes.md) : la révision consiste à détecter les points faibles d'un brouillon, tandis que la rédaction consiste à savoir ce qui fait la force d'une spécification.

## Une spécification décrit un comportement, pas du code

Une spécification indique ce que votre système *fait*, en des termes que n'importe qui peut vérifier — et non pas comment il est construit. Elle est composée d'**exigences** (énoncés de comportement) et de **scénarios** (exemples concrets qui les valident).

```markdown
### Exigence : Expiration de la session
Le système SHALL expirer une session après 30 minutes d'inactivité.

#### Scénario : Expiration par inactivité
- GIVEN une session authentifiée
- WHEN 30 minutes s'écoulent sans aucune activité
- THEN la session est invalidée et l'utilisateur doit se réauthentifier
```

Conservez le *comment* — la file d'attente, la bibliothèque, le schéma de table — dans `design.md` ou dans le code. Lorsque le comportement et l'implémentation sont mélangés dans une même exigence, cette exigence cesse d'être testable et devient obsolète dès que le code est modifié.

## Ce qui fait une bonne exigence

Une bonne exigence correspond à un seul comportement, énoncé si clairement que vous pourriez le confier à quelqu'un d'autre pour le tester.

- **Un seul énoncé, un seul `SHALL`/`MUST`.** Si une exigence comporte trois clauses « et aussi », il s'agit en réalité de trois exigences distinctes. Séparez-les.
- **Observable.** Une personne extérieure au code doit pouvoir vérifier si elle est respectée. « Le système SHALL afficher une bannière d'erreur lorsque le téléversement dépasse 10 Mo » est observable. « Le système SHALL gérer les gros téléversements de manière fluide » ne l'est pas.
- **La bonne force.** OpenSpec utilise les mots clés de la RFC 2119, qui ont des sens différents :

  | Mot clé | Signification |
  |---------|--------------|
  | `MUST` / `SHALL` | Une exigence impérative. Non négociable. |
  | `SHOULD` | Une forte recommandation, avec une marge pour une exception justifiée. |
  | `MAY` | Vraiment facultatif. |

  Privilégiez `MUST`/`SHALL` par défaut. N'utilisez `SHOULD` que lorsque vous voulez vraiment dire « à moins qu'il n'y ait une bonne raison de ne pas le faire ».

Le test pour une exigence : *un testeur qui n'a jamais vu le code pourrait-il dire si elle est respectée ?* Si ce n'est pas le cas, elle doit être affinée.

## Ce qui fait un bon scénario

Les scénarios sont ce qui donne sa valeur à une exigence. Chacun est un GIVEN / WHEN / THEN concret qui peut devenir un test automatisé.

- **Il valide son exigence.** Un scénario qui se contente de reformuler l'exigence avec d'autres mots ne teste rien. Faites-en une situation spécifique avec un résultat spécifique.
- **Couvrez les cas qui comptent, pas seulement le cas nominal.** La connexion valide est facile. La saisie vide, le jeton expiré, le deuxième clic, ce qui ne fonctionne pas — c'est là que se cachent les bugs, et là où un scénario a le plus de valeur.
- **Nommez le cas dans le titre.** « Scénario : Rejette un jeton expiré » permet à un relecteur de voir immédiatement ce qui est couvert ; « Scénario : Test 2 » ne l'indique pas.

Une habitude utile : avant d'approuver, demandez-vous *quel est le cas qui me mettrait le plus en colère s'il était cassé ?* — et assurez-vous qu'un scénario le nomme.

## Choisissez le bon type de delta

Une modification décrit ses apports aux spécifications avec trois types de sections. Utiliser le bon type permet de conserver la cohérence de vos spécifications archivées :

- **`## ADDED Requirements`** — comportement entièrement nouveau qui n'existait pas auparavant.
- **`## MODIFIED Requirements`** — comportement qui existait déjà et qui est modifié. Incluez la version complète de la nouvelle version ; une petite note sur ce qui a changé aide le relecteur.
- **`## REMOVED Requirements`** — comportement qui est supprimé, avec une ligne expliquant pourquoi.

Lors de l'archivage, ADDED est ajouté à la spécification principale, MODIFIED remplace l'ancienne version et REMOVED est supprimé. Si vous marquez une modification réelle comme ADDED, vous vous retrouvez avec deux exigences concurrentes ; si vous décrivez un nouveau comportement comme MODIFIED, il n'y a rien à remplacer. En cas de doute, ouvrez la spécification actuelle et vérifiez si l'exigence s'y trouve déjà.

## Adaptez la taille de la modification

L'erreur de rédaction la plus fréquente n'est pas une exigence mal formulée — c'est une modification qui essaie d'en être trois.

**Une bonne modification a une seule intention que vous pouvez exprimer en une phrase.** « Ajouter un bouton de mode sombre. » « Limiter le débit du point de terminaison de connexion. » « Migrer les sessions hors des cookies. » Si la description de la modification nécessite beaucoup de « et aussi », c'est le signe qu'il faut la scinder.

Signes qu'une modification est trop grande :

- Le périmètre de la proposition ressemble à une liste de fonctionnalités sans rapport.
- Sa révision prendrait tout un après-midi, donc personne ne le fera.
- Deux personnes ne pourraient pas travailler dessus sans se gêner.
- La moitié des tâches pourraient être déployées indépendamment.

Les modifications plus petites sont plus faciles à réviser, plus faciles à développer en une seule session concentrée, et plus faciles à comprendre six mois plus tard, quand l'archive est tout ce qui reste. Vous pouvez toujours exécuter plusieurs modifications en parallèle — consultez [Modification et itération](editing-changes.md) et [Flux de travail](workflows.md).

L'inverse arrive aussi : une correction de faute de frappe d'une ligne n'a pas besoin de trois exigences et d'un document de conception. Adaptez le formalisme à l'enjeu.

## Comment orienter l'IA vers un bon brouillon

Comme `/opsx:propose` rédige le premier brouillon, la qualité du résultat que vous obtenez dépend de la qualité de ce que vous lui fournissez. Vous n'avez pas besoin de rédiger les exigences à la main — vous devez juste bien orienter l'IA :

- **Indiquez l'intention et les limites.** *« Ajouter un bouton de mode sombre qui suit le paramètre du système d'exploitation au premier chargement — ne touchez pas à l'API de thème existante. »* La partie hors périmètre est aussi importante que la partie dans le périmètre.
- **Nommez les cas qui vous intéressent.** *« Assurez-vous qu'il y a un scénario pour un utilisateur qui a déjà choisi un thème manuellement. »* L'IA couvre ce que vous lui indiquez.
- **Puis modifiez.** C'est du Markdown simple. Précisez un `SHALL` vague, supprimez un scénario qui ne teste rien, ajoutez le cas qu'il a manqué — ou demandez à l'IA de le faire : *« l'exigence sur le délai d'expiration est vague, précisez qu'il est de 30 minutes. »*

Rédigez un brouillon, affinez-le, recommencez. Quelques itérations de ce processus permettent d'obtenir une spécification en laquelle vous avez confiance, ce qui est tout l'intérêt.

## Une checklist rapide

- [ ] Chaque exigence correspond à un seul comportement observable avec un `SHALL`/`MUST`.
- [ ] Aucun détail d'implémentation n'est intégré aux exigences.
- [ ] Chaque exigence a au moins un scénario qui la valide réellement.
- [ ] Les cas limites et les cas d'erreur importants ont des scénarios, pas seulement le cas nominal.
- [ ] Les deltas utilisent correctement ADDED / MODIFIED / REMOVED par rapport à la spécification actuelle.
- [ ] L'ensemble de la modification a une seule intention que vous pouvez exprimer en une phrase.

## Pour aller plus loin

- [Révision d'une modification](reviewing-changes.md) — la vérification rapide de deux minutes qui détecte ce qui a échappé à la vigilance.
- [Concepts](concepts.md) — le modèle plus détaillé derrière les spécifications, les modifications et les deltas.
- [Exemples et recettes](examples.md) — des modifications réelles du début à la fin.