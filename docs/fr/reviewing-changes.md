# Révision d'une modification

Toute la promesse d'OpenSpec est que vous et votre IA **vous mettez d'accord sur ce qu'il faut construire avant d'écrire la moindre ligne de code.** Cet accord n'a de sens que si vous lisez réellement ce que l'IA a rédigé. Cette page porte sur ces deux minutes que vous y consacrez — ce qu'il faut ouvrir, dans quel ordre, et ce qu'il faut vérifier.

Le pari est simple : repérer une erreur d'orientation dans un plan d'un paragraphe coûte presque rien. Repérer la même erreur dans 300 lignes de code, c'est une autre histoire. La révision, c'est là que vous remportez ce pari.

## Les deux moments où vous effectuez la révision

Il y en a exactement deux :

```
/opsx:propose ──► RÉVISER LE PLAN ──► /opsx:apply ──► RÉVISER LE CODE ──► /opsx:archive
                  (avant toute écriture de code)                    (/opsx:verify)
```

1. **Après `/opsx:propose`** (ou `/opsx:ff`), avant `/opsx:apply` — lisez le plan tant qu'il n'est encore que des mots.
2. **Après la construction**, avec `/opsx:verify` — vérifiez que le code a bien fait ce que le plan prévoyait.

La première révision est celle qui vous fait gagner le plus de temps, et c'est aussi celle que les gens sautent. Cette page y consacre la majeure partie de son contenu.

## Lisez les fichiers dans cet ordre

Une modification est un dossier de Markdown brut dans `openspec/changes/<name>/`. Lisez les fichiers dans l'ordre qui vous permet de vous arrêter au plus tôt si quelque chose ne va pas :

```
openspec/changes/add-dark-mode/
├── proposal.md      1. l'intention et le périmètre   ← si c'est faux, arrêtez-vous ici
├── specs/…/spec.md  2. les exigences       ← le cœur de la révision
├── design.md        (uniquement pour les modifications importantes) — l'approche technique
└── tasks.md         3. le plan de travail
```

Vous n'avez pas besoin de lire chaque ligne. Vous devez répondre à trois questions, une par fichier.

## La proposition : est-ce le bon problème ?

Ouvrez `proposal.md` en premier. Il capture le « pourquoi » et le « quoi » — l'intention, le périmètre, l'approche en un ou deux paragraphes.

**Ce qui est bon :** une intention claire, un périmètre que vous reconnaissez, et une raison justifiant que cela vaut la peine d'être fait maintenant.

**Signaux d'alerte :**

- Il résout un problème légèrement *différent* de celui que vous avez demandé.
- Le périmètre a grandi : vous avez demandé un bouton de changement de thème et la proposition touche également à l'authentification « tant qu'on y est ».
- Il est vague. « Améliorer la page des paramètres » n'est pas un périmètre ; « ajouter un bouton de mode sombre qui respecte les préférences du système d'exploitation » en est un.

**La question à répondre :** *Est-ce que cela correspond à ce que j'ai réellement demandé, et est-ce que quelque chose s'est glissé sans que je m'en rende compte ?* Si la réponse est non, arrêtez-vous — ne lisez pas plus loin, corrigez la proposition (voir [Réagir est peu coûteux](#pushing-back-is-cheap)).

## Les deltas de spécifications : la définition de « terminé » est-elle correcte ?

C'est le cœur de la révision. Les spécifications delta dans `specs/` indiquent ce qui sera *vrai* lorsque la modification sera déployée — sous forme d'exigences et de scénarios qui les prouvent :

```markdown
## Exigences AJOUTÉES

### Exigence : Bouton de mode sombre
Le système DOIT permettre à un utilisateur de basculer entre les thèmes clair et sombre.

#### Scénario : Respecte les préférences du système d'exploitation au premier lancement
- GIVEN un utilisateur qui n'a jamais défini de thème
- WHEN il ouvre l'application sur un appareil configuré en mode sombre
- THEN l'application s'affiche en mode sombre
```

**Ce qu'est une bonne exigence :** une déclaration claire utilisant `SHALL`/`MUST` que vous pourriez confier à un testeur, et au moins un scénario dont les GIVEN/WHEN/THEN exercent réellement cette déclaration.

**Signaux d'alerte :**

- **Une exigence vague.** « Le système DOIT être rapide » ne peut pas être construit ni testé. Qu'est-ce que « rapide » ?
- **Une exigence sans scénario**, ou un scénario qui ne teste pas l'exigence à laquelle il est associé.
- **La vérification la plus précieuse de toutes : ce qui manque.** L'IA retranscrit fidèlement ce que vous avez *dit*. Votre travail est de remarquer ce que vous avez *oublié* de dire. Si le cas de la préférence du système d'exploitation est le plus important pour vous et qu'aucun scénario ne le mentionne, c'est la révision qui rentre dans ses frais.

Lisez les deltas en vous posant la question : *serais-je satisfait si le système faisait exactement — et seulement — cela ?* Rien ici ne concerne encore le code, donc il reste peu coûteux de modifier.

## Les tâches : le plan de travail est-il réaliste ?

Ouvrez `tasks.md` en dernier. C'est la liste de vérification de l'implémentation que l'IA va parcourir.

**Ce qui est bon :** des étapes ordonnées, chacune traçable jusqu'à une exigence, rien de mystérieux.

**Signaux d'alerte :**

- Une tâche sans exigence correspondante (d'où vient-elle ?).
- Une seule tâche géante « implémenter la fonctionnalité » qui cache toutes les décisions réelles.
- Une tâche qui touche à quelque chose en dehors du périmètre que vous venez d'approuver.

Vous n'estimez pas ou ne micro-managez pas ici — vous vérifiez que le plan correspond aux exigences que vous avez déjà acceptées.

## Réagir est peu coûteux

Si l'une des trois questions a reçu une réponse négative, dites-le. Il n'y a pas de phases et rien n'est verrouillé — vous corrigez et passez à la suite. Deux méthodes, exactement comme dans [Modifier une modification](editing-changes.md) :

- **Modifiez le fichier vous-même.** C'est du Markdown brut ; modifiez la ligne de périmètre, renforcez une exigence, supprimez une tâche.
- **Dites à l'IA ce qui ne va pas** et laissez-la réviser : *« supprime les modifications d'authentification — hors périmètre », « ajoute un scénario pour le cas où l'utilisateur a déjà choisi un thème », « divise la tâche 3 en schéma et interface utilisateur. »*

Puis relisez la partie que vous avez modifiée. Retravaillez le brouillon jusqu'à obtenir un plan que vous seriez prêt à signer. Ces allers-retours *sont* le produit en action.

## Après le code : vérifiez

Une fois le travail construit, `/opsx:verify` est votre seconde révision. Il relit les artefacts et le code et signale les écarts selon trois dimensions :

| Dimension | Ce qu'il vérifie |
|-----------|----------------|
| **Complétude** | Toutes les tâches sont terminées, toutes les exigences sont implémentées, les scénarios sont couverts |
| **Correction** | L'implémentation correspond à l'intention de la spécification, les cas limites sont gérés |
| **Cohérence** | Les décisions de conception apparaissent réellement dans le code |

```
Vous : /opsx:verify

IA :  Vérification de add-dark-mode...

     COMPLÉTUDE
     ✓ Les 8 tâches de tasks.md sont cochées
     ✓ Toutes les exigences dans specs ont du code correspondant
     ⚠ Le scénario « Respecte les préférences du système d'exploitation au premier lancement » n'a pas de couverture de test
```

Il signale les problèmes comme CRITIQUE, AVERTISSEMENT ou SUGGESTION, et il ne **bloque pas** l'archivage — il fait remonter les lacunes et vous laisse prendre la décision. C'est la différence entre « l'IA a-t-elle écrit du code » et « a-t-elle construit ce sur quoi nous nous sommes mis d'accord ».

`/opsx:verify` fait partie du profil étendu. Si vous ne l'avez pas, activez-le avec `openspec config profile` (puis `openspec update`), ou relisez simplement la modification et le diff vous-même.

## Adaptez la révision à la taille de la modification

Toutes les modifications ne méritent pas un examen complet. Une correction de faute de frappe sur un seul fichier mérite un coup d'œil de vingt secondes. Une modification qui touche à l'authentification, aux paiements ou à des données que vous ne pouvez pas récupérer mérite que vous répondiez à toutes les questions ci-dessus. Il n'a jamais été question de formalisme — il s'agit de concentrer votre attention là où une erreur serait coûteuse, et de parcourir rapidement les parties où elle ne le serait pas.

## La liste de vérification de deux minutes

- [ ] L'intention de la proposition correspond à ce que j'ai demandé.
- [ ] Rien de supplémentaire ne s'est glissé dans le périmètre.
- [ ] Chaque exigence est suffisamment précise pour être testée.
- [ ] Chaque exigence a un scénario qui l'exerce réellement.
- [ ] Le cas qui m'importe le plus est couvert.
- [ ] Les tâches correspondent aux exigences ; rien n'est mystérieux ou hors périmètre.
- [ ] Je serais à l'aise si l'IA construisait exactement cela et rien de plus.

Si les sept points sont validés, exécutez `/opsx:apply` en toute confiance. Si l'un d'eux échoue, ce n'est pas un revers — c'est les deux minutes qui font leur travail.

## Pour aller plus loin

- [Rédiger de bonnes spécifications](writing-specs.md) — l'autre côté de la médaille : comment rédiger des exigences et des scénarios qui méritent d'être approuvés.
- [Modifier et itérer sur une modification](editing-changes.md) — les mécaniques de modification d'un plan après avoir commencé.
- [Flux de travail](workflows.md) — où la révision s'inscrit dans la boucle globale.