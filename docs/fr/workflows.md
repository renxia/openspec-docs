# Flux de travail

Ce guide présente les modèles de flux de travail courants pour OpenSpec ainsi que les cas dans lesquels utiliser chacun d'eux. Pour la configuration de base, consultez [Prise en main](getting-started.md). Pour la référence des commandes, consultez [Commandes](commands.md).

## Philosophie : des actions, pas des phases

Les flux de travail traditionnels vous obligent à suivre des phases : planification, puis implémentation, puis fin de projet. Mais le travail réel ne s'inscrit pas parfaitement dans des cases.

OPSX adopte une approche différente :

```text
Traditionnel (verrouillé par phases) :

  PLANIFICATION ────────► IMPLÉMENTATION ────────► TERMINÉ
      │                    │
      │   « Impossible de revenir en arrière »  │
      └──────────────────────────────────────────┘

OPSX (actions fluides) :

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Principes clés :**

- **Des actions, pas des phases** - Les commandes sont des actions que vous pouvez effectuer, pas des étapes dans lesquelles vous êtes bloqué
- **Les dépendances sont des facilitateurs** - Elles indiquent ce qui est possible, pas ce qui est requis par la suite

> **Personnalisation :** Les flux de travail OPSX sont pilotés par des schémas qui définissent les séquences d'artéfacts. Consultez [Personnalisation](customization.md) pour plus de détails sur la création de schémas personnalisés.

## Deux modes

### Chemin rapide par défaut (profil `core`)

Les nouvelles installations utilisent par défaut le profil `core`, qui fournit :
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Flux typique :

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (optionnel)
```

#### Commencez par explorer (l'habitude qui vaut la peine d'être prise)

`/opsx:explore` fait partie du profil par défaut, ce n'est pas un module complémentaire avancé. C'est l'action à effectuer dès que vous avez un problème mais pas encore de plan, ce qui est le cas la plupart du temps avec un assistant IA.

```text
Vous : /opsx:explore

IA :  Que souhaitez-vous explorer ?

Vous : Nos résultats de recherche semblent obsolètes. Je ne sais pas si c'est lié au cache,
     à l'indexation ou à la requête elle-même.

IA :  Laissez-moi vérifier... [lit le service de recherche et la couche de cache]
     C'est l'index : il ne se reconstruit que toutes les nuits, donc les modifications n'apparaissent
     que le lendemain. Deux options : reconstruire à l'écriture (simple, charge plus importante)
     ou une invalidation de cache avec TTL court (plus de composants en mouvement, charge moins importante).
     Compte tenu de votre faible volume d'écritures, la reconstruction à l'écriture est la solution la plus propre.
     Vous voulez en définir le périmètre ?

Vous : Oui.

Vous : /opsx:propose rebuild-search-index-on-write
```

Explore ne génère aucun artefact et n'écrit pas de code. C'est une conversation gratuite, sans risque, qui transforme une préoccupation vague en une modification précise, de sorte que la proposition qui suit est claire. Vous savez déjà exactement ce que vous voulez ? Passez cette étape et allez directement à `/opsx:propose`. Guide complet : [Explorer d'abord](explore.md).

### Flux de travail étendu/complet (sélection personnalisée)

Si vous souhaitez activer les commandes explicites de génération de structure et de construction (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), utilisez :

```bash
openspec config profile
openspec update
```

## Schémas de flux de travail (mode étendu)

### Fonctionnalité rapide

Lorsque vous savez ce que vous voulez construire et que vous avez juste besoin de l'exécuter :

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Exemple de conversation :**

```text
Vous : /opsx:new add-logout-button

IA :  Créé openspec/changes/add-logout-button/
     Prêt à créer : proposal

Vous : /opsx:ff

IA :  Création de tous les artefacts de planification...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Prêt pour la mise en œuvre !

Vous : /opsx:apply

IA :  Traitement des tâches...
     ✓ Ajout du bouton de déconnexion à l'en-tête
     ✓ Implémentation de la suppression de session
     ✓ Ajout de la boîte de dialogue de confirmation
     Toutes les tâches sont terminées !

Vous : /opsx:archive

IA :  ✓ Spécifications fusionnées
     ✓ Modification archivée
```

**Idéal pour :** Fonctionnalités de petite à moyenne taille, corrections de bugs, modifications simples.

### Exploratoire

Lorsque les exigences sont floues ou que vous devez d'abord effectuer une investigation :

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Exemple de conversation :**

```text
Vous : /opsx:explore

IA :  Que souhaitez-vous explorer ?

Vous : Je veux améliorer les performances de chargement des pages mais je ne sais pas
     où se trouvent les goulots d'étranglement.

IA :  Laissez-moi vous aider à investiguer...
     [Analyse les tailles de bundles, identifie les requêtes lentes, examine
     les modèles de rendu des composants]

     J'ai identifié trois principaux goulots d'étranglement :
     1. Images volumineuses non optimisées
     2. Récupération de données synchrone dans ProductList
     3. Re-rendus liés aux modifications de contexte

     Lequel souhaitez-vous traiter en premier ?

Vous : Occupons-nous du problème de récupération des données.

Vous : /opsx:new optimize-product-list-fetching

IA :  Modification créée. Prêt à créer : proposal

Vous : /opsx:continue

IA :  Création de la proposition sur la base de notre exploration...
     [Rédige la proposition en intégrant les conclusions de l'investigation]

     Prêt à créer : specs, design
     Que souhaitez-vous faire ensuite ?

Vous : /opsx:continue

IA :  Création des spécifications...
```

**Idéal pour :** Optimisation des performances, débogage, décisions architecturales, exigences floues.

### Modifications parallèles

Travaillez sur plusieurs modifications en même temps :

```text
Modification A : /opsx:new ──► /opsx:ff ──► /opsx:apply (en cours)
                                         │
                                    changement de contexte
                                         │
Modification B : /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Exemple de conversation :**

```text
Vous : Je travaille sur add-dark-mode mais j'ai été interrompu par une correction de bug

Vous : /opsx:new fix-login-redirect

IA :  Créé openspec/changes/fix-login-redirect/

Vous : /opsx:ff

IA :  ✓ Artefacts de planification créés

Vous : /opsx:apply

IA :  Travail sur fix-login-redirect...
     [Implémente la correction]
     Toutes les tâches sont terminées !

Vous : /opsx:archive

IA :  ✓ fix-login-redirect archivé

Vous : Reprenons le mode sombre

Vous : /opsx:apply add-dark-mode

IA :  Reprise de add-dark-mode...
     Reprise à la tâche 2.3 : Mettre à jour l'en-tête...
```

**Idéal pour :** Flux de travail parallèles, interruptions urgentes, collaboration en équipe.

Lorsque vous avez plusieurs modifications terminées, utilisez `/opsx:bulk-archive` :

```text
Vous : /opsx:bulk-archive

IA :  3 modifications terminées trouvées :
     - add-dark-mode (toutes les tâches terminées)
     - fix-login-redirect (toutes les tâches terminées)
     - update-footer (toutes les tâches terminées)

     Vérification des conflits de spécifications...
     ⚠ add-dark-mode et update-footer modifient tous deux specs/ui/

     Examen de la base de code pour résoudre...
     Les deux modifications sont implémentées. Elles seront appliquées dans l'ordre chronologique.

     Archiver les 3 modifications ?

Vous : Oui

IA :  ✓ add-dark-mode archivé
     ✓ fix-login-redirect archivé
     ✓ update-footer archivé
     Spécifications fusionnées dans l'ordre : add-dark-mode → update-footer
```

L'archivage en masse détecte lorsque plusieurs modifications concernent les mêmes spécifications et résout les conflits en vérifiant ce qui est réellement implémenté.

### Finaliser une modification

Le flux de finalisation recommandé :

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              valide l'implémentation   propose de synchroniser
              selon trois dimensions    si nécessaire
```

#### Vérifier : Contrôler votre travail

`/opsx:verify` valide l'implémentation par rapport à vos artefacts selon trois dimensions :

```text
Vous : /opsx:verify

IA :  Vérification de add-auth...

     COMPLÉTUDE
     ✓ Les 12 tâches de tasks.md sont cochées
     ✓ Toutes les exigences des specs ont du code correspondant
     ⚠ Scénario « Expiration de session après inactivité » non testé

     CORRECTITUDE
     ✓ L'implémentation correspond à l'intention des spécifications
     ✓ Les cas limites des scénarios sont pris en charge
     ✓ Les états d'erreur correspondent aux définitions des spécifications

     COHÉRENCE
     ✓ Les décisions de conception sont reflétées dans la structure du code
     ✓ Les conventions de nommage sont cohérentes avec design.md
     ⚠ La conception mentionne « piloté par les événements » mais l'implémentation utilise du sondage

     RÉSUMÉ
     ─────────────────────────────
     Problèmes critiques : 0
     Avertissements : 2
     Prêt à archiver : Oui (avec avertissements)

     Recommandations :
     1. Ajouter un test pour le scénario d'expiration de session
     2. Envisager de refactoriser pour utiliser une approche pilotée par les événements comme prévu dans la conception, ou mettre à jour design.md
```

**Ce que vérifie la commande verify :**

| Dimension | Ce qu'elle valide |
|-----------|-------------------|
| Complétude | Toutes les tâches terminées, toutes les exigences implémentées, scénarios couverts |
| Correctitude | L'implémentation correspond à l'intention des spécifications, cas limites pris en charge |
| Cohérence | Décisions de conception reflétées dans le code, modèles cohérents |

La vérification ne bloque pas l'archivage, mais elle met en évidence les problèmes que vous souhaiterez peut-être résoudre en premier.

#### Archiver : Finaliser la modification

`/opsx:archive` finalise la modification et la déplace vers l'archive :

```text
Vous : /opsx:archive

IA :  Archivage de add-auth...

     Statut des artefacts :
     ✓ proposal.md existe
     ✓ specs/ existe
     ✓ design.md existe
     ✓ tasks.md existe (12/12 tâches terminées)

     Spécifications delta : Pas encore synchronisées sur la branche principale
     → Souhaitez-vous synchroniser maintenant ?

Vous : Oui

IA :  ✓ Spécifications synchronisées vers openspec/specs/auth/spec.md
     ✓ Déplacé vers openspec/changes/archive/2025-01-24-add-auth/

     Modification archivée avec succès.
```

L'archivage vous demandera si les spécifications ne sont pas synchronisées. Il ne bloquera pas sur des tâches incomplètes, mais il vous avertira.

## Quand utiliser quoi

### `/opsx:ff` vs `/opsx:continue`

| Situation | Utiliser |
|-----------|----------|
| Exigences claires, prêt à construire | `/opsx:ff` |
| Phase d'exploration, vous souhaitez passer en revue chaque étape | `/opsx:continue` |
| Vous souhaitez itérer sur la proposition avant les spécifications | `/opsx:continue` |
| Pression temporelle, besoin d'avancer vite | `/opsx:ff` |
| Modification complexe, vous souhaitez garder le contrôle | `/opsx:continue` |

**Règle générale :** Si vous pouvez décrire l'ensemble du périmètre à l'avance, utilisez `/opsx:ff`. Si vous le définissez au fur et à mesure, utilisez `/opsx:continue`.

### Quand mettre à jour ou commencer de zéro

Une question fréquente : quand est-il acceptable de mettre à jour une modification existante, et quand devez-vous en commencer une nouvelle ?

**Mettez à jour la modification existante lorsque :**
- Même intention, exécution affinée
- Le périmètre se réduit (MVP d'abord, le reste plus tard)
- Corrections liées à des apprentissages (la base de code n'est pas ce que vous attendiez)
- Ajustements de conception basés sur des découvertes lors de l'implémentation

**Commencez une nouvelle modification lorsque :**
- L'intention a fondamentalement changé
- Le périmètre a explosé pour devenir un travail totalement différent
- La modification initiale peut être marquée comme « terminée » indépendamment
- Les correctifs créeraient plus de confusion que de clarté

```text
                     ┌─────────────────────────────────────┐
                     │     Est-ce le même travail ?         │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Même intention ?   >50 % de chevauchement ?  La modification
          Même problème ?    Même périmètre ?          initiale peut-elle
                 │                  │          être « terminée »
                 │                  │          sans ces modifications ?
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      OUI               NON OUI          NON  NON             OUI
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    METTRE À JOUR      NOUVEAU METTRE À JOUR NOUVEAU METTRE À JOUR NOUVEAU
```

**Exemple : « Ajouter le mode sombre »**

- « Il faut aussi prendre en charge les thèmes personnalisés » → Nouvelle modification (périmètre explosé)
- « La détection des préférences système est plus difficile que prévu » → Mettre à jour (même intention)
- « Livrons d'abord le bouton bascule, ajoutons les préférences plus tard » → Mettre à jour puis archiver, puis nouvelle modification

## Bonnes pratiques

### Gardez les modifications ciblées

Une unité de travail logique par modification. Si vous faites « ajouter la fonctionnalité X et aussi refactoriser Y », envisagez deux modifications séparées.

**Pourquoi c'est important :**
- Plus facile à examiner et à comprendre
- Historique d'archive plus propre
- Peut être livré indépendamment
- Restauration plus simple si nécessaire

### Utilisez `/opsx:explore` pour des exigences floues

Avant de vous engager sur une modification, explorez le problème :

```text
Vous : /opsx:explore

IA :  Que souhaitez-vous explorer ?

Vous : Comment devrions-nous gérer la limitation de débit pour notre API ?

IA :  Laissez-moi investiguer votre configuration actuelle et les options...
     [Recherche dans la base de code, examine les modèles]

     Je vois trois approches possibles :
     1. Basée sur un middleware (simple, par point de terminaison)
     2. Avec Redis (évolutive, état partagé)
     3. Seau de jetons par utilisateur (équitable, complexe)

     Votre pile technique actuelle suggère les options 1 ou 2. Quelle est votre échelle ?
```

L'exploration clarifie la réflexion avant que vous ne créiez des artefacts.

### Vérifiez avant d'archiver

Utilisez `/opsx:verify` pour vérifier que l'implémentation correspond aux artefacts :

```text
Vous : /opsx:verify

IA :  Vérification de add-dark-mode...

     ✓ Toutes les tâches de tasks.md sont cochées
     ✓ Les exigences des specs ont du code correspondant
     ✓ Les décisions de conception sont reflétées dans l'implémentation

     Prêt à archiver !
```

Détecte les incohérences avant que vous ne finalisiez la modification.

### Nommez clairement les modifications

De bons noms rendent `openspec list` utile :

| Bon : | À éviter : |
|-------|------------|
| add-dark-mode | feature-1 |
| fix-login-redirect | update |
| optimize-product-query | changes |
| implement-2fa | wip |

## Référence rapide des commandes

Pour plus de détails et d'options concernant les commandes, consultez [Commandes](commands.md).

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/opsx:propose` | Créer un changement + des artefacts de planification | Chemin par défaut rapide (profil `core`) |
| `/opsx:explore` | Réfléchir aux idées avec l'IA | Commencez ici en cas d'incertitude : exigences floues, investigation, comparaison d'options |
| `/opsx:new` | Démarrer un échafaudage de changement | Mode étendu, contrôle explicite des artefacts |
| `/opsx:continue` | Créer l'artefact suivant | Mode étendu, création d'artefacts étape par étape |
| `/opsx:ff` | Créer tous les artefacts de planification | Mode étendu, périmètre clair |
| `/opsx:apply` | Implémenter les tâches | Prêt à écrire du code |
| `/opsx:verify` | Valider l'implémentation | Mode étendu, avant archivage |
| `/opsx:sync` | Fusionner les spécifications delta | Mode étendu, optionnel |
| `/opsx:archive` | Terminer le changement | Tout le travail est terminé |
| `/opsx:bulk-archive` | Archiver plusieurs changements | Mode étendu, travail parallèle |

## Prochaines étapes

- [Rédiger de bonnes spécifications](writing-specs.md) - À quoi ressemblent des exigences et des scénarios solides, et comment dimensionner correctement un changement
- [Réviser un changement](reviewing-changes.md) - La revue de deux minutes sur un plan préliminaire avant tout code
- [OpenSpec en équipe](team-workflow.md) - Comment les changements s'intègrent aux branches et aux pull requests
- [Commandes](commands.md) - Référence complète des commandes avec options
- [Concepts](concepts.md) - Approfondissement sur les spécifications, les artefacts et les schémas
- [Personnalisation](customization.md) - Créer des workflows personnalisés