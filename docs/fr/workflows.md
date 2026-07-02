# Flux de travail

Ce guide couvre les modèles de flux de travail courants pour OpenSpec et quand utiliser chacun d'eux. Pour la configuration de base, voir [Getting Started](getting-started.md). Pour la référence des commandes, voir [Commands](commands.md).

## Philosophie : Actions, pas des phases

Les flux de travail traditionnels vous obligent à passer par des phases : la planification, puis l'implémentation, puis la fin. Mais le vrai travail ne rentre pas proprement dans des cases.

OPSX adopte une approche différente :

```text
Traditional (phase-locked):

  PLANNING ────────► IMPLEMENTING ────────► DONE
      │                    │
      │   "Can't go back"  │
      └────────────────────┘

OPSX (fluid actions):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Principes clés :**

- **Actions, pas des phases** - Les commandes sont des choses que vous pouvez faire, pas des étapes dans lesquelles vous êtes bloqué.
- **Les dépendances sont des facilitateurs** - Elles montrent ce qui est possible, pas ce qui est requis ensuite.

> **Personnalisation :** Les flux de travail d'OPSX sont pilotés par des schémas qui définissent les séquences d'artefacts. Voir [Customization](customization.md) pour plus de détails sur la création de schémas personnalisés.

## Deux Modes

### Chemin Rapide par Défaut (`core` profile)

Les nouvelles installations sont configurées par défaut sur `core`, ce qui fournit :
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

#### Commencer par explorer (l'habitude à prendre)

`/opsx:explore` fait partie du profil par défaut, ce n'est pas un ajout avancé. C'est l'action à entreprendre lorsque vous avez un problème mais pas encore de plan, ce qui est le cas la plupart du temps avec un assistant IA.

```text
Vous: /opsx:explore

AI:  Que souhaitez-vous explorer ?

Vous: Nos résultats de recherche semblent obsolètes. Je ne suis pas sûr que cela soit dû au cache, à l'indexation ou à la requête elle-même.

AI:  Laissez-moi regarder... [lit le service de recherche et la couche de cache]
     C'est l'index : il n'est reconstruit que quotidiennement, donc les modifications n'apparaissent pas avant le lendemain. Deux options : reconstruction à l'écriture (simple, plus de charge) ou une invalidation de cache à courte durée de vie (plus de pièces mobiles, moins de charge). Étant donné que votre volume d'écriture est faible, la reconstruction à l'écriture est la solution la plus propre. Voulez-vous le définir ?

Vous: Oui.

Vous: /opsx:propose rebuild-search-index-on-write
```

Explorer ne crée aucun artefact et n'écrit aucun code. C'est une conversation gratuite sans enjeu qui transforme une inquiétude vague en un changement précis, de sorte que la proposition qui suit est pertinente. Avez-vous déjà exactement ce que vous voulez ? Sautez cette étape et allez directement à `/opsx:propose`. Guide complet : [Explore First](explore.md).

### Flux de Travail Étendu/Complet (sélection personnalisée)

Si vous souhaitez des commandes explicites d'échafaudage et de construction (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, etc.), activez-les avec :

```bash
openspec config profile
openspec update
```

## Modèles de Flux de Travail (Mode Étendu)

### Fonctionnalité Rapide

Lorsque vous savez ce que vous voulez construire et avez juste besoin d'exécuter :

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Exemple de conversation :**

```text
Vous: /opsx:new add-logout-button

AI:  Créé openspec/changes/add-logout-button/
     Prêt à créer : proposition

Vous: /opsx:ff

AI:  Création de tous les artefacts de planification...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Prêt pour l'implémentation !

Vous: /opsx:apply

AI:  Traitement des tâches...
     ✓ Bouton de déconnexion ajouté à l'en-tête
     ✓ Nettoyage de la session implémenté
     ✓ Boîte de dialogue de confirmation ajoutée
     Toutes les tâches sont terminées !

Vous: /opsx:archive

AI:  ✓ Spécifications fusionnées
     ✓ Changement archivé
```

**Idéal pour :** Les fonctionnalités de petite à moyenne taille, les corrections de bugs, les changements simples.

### Exploratoire

Lorsque les exigences sont floues ou que vous devez d'abord enquêter :

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Exemple de conversation :**

```text
Vous: /opsx:explore

AI:  Que souhaitez-vous explorer ?

Vous: Je veux améliorer les performances de chargement de la page, mais je ne suis pas sûr des goulots d'étranglement.

AI:  Laissez-moi aider à enquêter...
     [Analyse les tailles de bundle, identifie les requêtes lentes, examine les modèles de rendu des composants]

     J'ai trouvé trois principaux goulots d'étranglement :
     1. Images volumineuses non optimisées
     2. Récupération de données synchrone dans ProductList
     3. Re-rendus dus aux changements de contexte

     Lequel souhaitez-vous aborder en premier ?

Vous: Abordons le problème de récupération des données.

Vous: /opsx:new optimize-product-list-fetching

AI:  Changement créé. Prêt à créer : proposition

Vous: /opsx:continue

AI:  Création de la proposition basée sur notre exploration...
     [Écrit la proposition intégrant les aperçus de l'enquête]

     Prêt à créer : spécifications, conception
     Lequel souhaitez-vous ensuite ?

Vous: /opsx:continue

AI:  Création des spécifications...
```

**Idéal pour :** L'optimisation des performances, le débogage, les décisions architecturales, les exigences floues.

### Changements Parallèles

Travaillez sur plusieurs changements simultanément :

```text
Changement A: /opsx:new ──► /opsx:ff ──► /opsx:apply (en cours)
                                         │
                                    changement de contexte
                                         │
Changement B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Exemple de conversation :**

```text
Vous: Je travaille sur add-dark-mode mais j'ai été pris par une correction de bug

Vous: /opsx:new fix-login-redirect

AI:  Créé openspec/changes/fix-login-redirect/

Vous: /opsx:ff

AI:  ✓ Artefacts de planification créés

Vous: /opsx:apply

AI:  Travail sur fix-login-redirect...
     [Implémente la correction]
     Toutes les tâches sont terminées !

Vous: /opsx:archive

AI:  ✓ fix-login-redirect archivé

Vous: Revenons au mode sombre

Vous: /opsx:apply add-dark-mode

AI:  Reprise d'add-dark-mode...
     Reprend à la tâche 2.3 : Mise à jour de l'en-tête...
```

**Idéal pour :** Les flux de travail parallèles, les interruptions urgentes, la collaboration d'équipe.

Lorsque vous avez plusieurs changements terminés, utilisez `/opsx:bulk-archive` :

```text
Vous: /opsx:bulk-archive

AI:  J'ai trouvé 3 changements terminés :
     - add-dark-mode (toutes les tâches sont faites)
     - fix-login-redirect (toutes les tâches sont faites)
     - update-footer (toutes les tâches sont faites)

     Vérification des conflits de spécifications...
     ⚠ add-dark-mode et update-footer touchent tous deux specs/ui/

     Inspection du code source pour résoudre...
     Les deux changements sont implémentés. Seront appliqués dans l'ordre chronologique.

     Archiver les 3 changements ?

Vous: Oui

AI:  ✓ add-dark-mode archivé
     ✓ fix-login-redirect archivé
     ✓ update-footer archivé
     Spécifications fusionnées dans l'ordre : add-dark-mode → update-footer
```

L'archivage en masse détecte quand plusieurs changements touchent aux mêmes spécifications et résout les conflits en vérifiant ce qui est réellement implémenté.

### Finaliser un Changement

Le flux de complétion recommandé :

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              valide l'implémentation          demande la synchronisation
              implementation     si nécessaire
```

#### Vérifier : Vérifiez votre travail

`/opsx:verify` valide l'implémentation par rapport à vos artefacts selon trois dimensions :

```text
Vous: /opsx:verify

AI:  Vérification de add-auth...

     EXHAUSTIVITÉ (COMPLETENESS)
     ✓ Les 12 tâches de tasks.md sont vérifiées
     ✓ Toutes les exigences des spécifications correspondent à du code
     ⚠ Le scénario "Expiration de session après inactivité" n'a pas été testé

     CORRECTITUDE (CORRECTNESS)
     ✓ L'implémentation correspond à l'intention de la spécification
     ✓ Les cas limites provenant des scénarios sont gérés
     ✓ Les états d'erreur correspondent aux définitions de la spécification

     COHÉRENCE (COHERENCE)
     ✓ Les décisions de conception sont reflétées dans la structure du code
     ✓ Conventions de nommage cohérentes avec design.md
     ⚠ La conception mentionne "orienté événement" mais l'implémentation utilise le polling

     RÉSUMÉ (SUMMARY)
     ─────────────────────────────
     Problèmes critiques : 0
     Avertissements : 2
     Prêt à archiver : Oui (avec avertissements)

     Recommandations :
     1. Ajouter un test pour le scénario d'expiration de session
     2. Envisager une refactorisation vers l'orienté événement comme conçu, ou mettre à jour design.md
```

**Ce que vérifie la vérification :**

| Dimension | Ce qu'elle valide |
|-----------|------------------|
| Exhaustivité | Toutes les tâches sont faites, toutes les exigences implémentées, scénarios couverts |
| Correctitude | L'implémentation correspond à l'intention de la spécification, les cas limites gérés |
| Cohérence | Les décisions de conception sont reflétées dans le code, les modèles sont cohérents |

La vérification ne bloquera pas l'archivage, mais elle met en évidence des problèmes que vous voudrez peut-être aborder en premier.

#### Archiver : Finaliser le Changement

`/opsx:archive` complète le changement et le déplace dans l'archive :

```text
Vous: /opsx:archive

AI:  Archivage de add-auth...

     Statut des artefacts :
     ✓ proposal.md existe
     ✓ specs/ existe
     ✓ design.md existe
     ✓ tasks.md existe (12/12 tâches complétées)

     Spécifications Delta : Pas encore synchronisées avec la principale
     → Souhaitez-vous synchroniser maintenant ?

Vous: Oui

AI:  ✓ Spécifications synchronisées vers openspec/specs/auth/spec.md
     ✓ Déplacé vers openspec/changes/archive/2025-01-24-add-auth/

     Changement archivé avec succès.
```

L'archivage demandera si les spécifications ne sont pas synchronisées. Il ne bloquera pas sur des tâches incomplètes, mais il vous avertira.

## Quand Utiliser Quoi

### `/opsx:ff` vs `/opsx:continue`

| Situation | À utiliser |
|-----------|-----|
| Exigences claires, prêt à construire | `/opsx:ff` |
| En phase d'exploration, vouloir revoir chaque étape | `/opsx:continue` |
| Vouloir itérer sur la proposition avant les spécifications | `/opsx:continue` |
| Pression de temps, besoin d'avancer rapidement | `/opsx:ff` |
| Changement complexe, vouloir le contrôle | `/opsx:continue` |

**Règle générale :** Si vous pouvez décrire l'intégralité du périmètre à l'avance, utilisez `/opsx:ff`. Si vous découvrez les choses au fur et à mesure, utilisez `/opsx:continue`.

### Quand Mettre à Jour vs Commencer Neuf

Une question courante : quand est-il acceptable de mettre à jour un changement existant et quand doit-on en commencer un nouveau ?

**Mettez à jour le changement existant lorsque :**

- Même intention, exécution affinée
- Le périmètre se rétrécit (MVP d'abord, le reste plus tard)
- Corrections basées sur l'apprentissage (le code source n'est pas ce que vous attendiez)
- Ajustements de conception basés sur les découvertes de l'implémentation

**Commencez un nouveau changement lorsque :**

- L'intention a fondamentalement changé
- Le périmètre est explosé vers un travail entièrement différent
- Le changement original peut être marqué comme "terminé" par lui-même
- Les correctifs créeraient plus de confusion qu'ils ne clarifieraient

```text
                     ┌─────────────────────────────────────┐
                     │     Est-ce le même travail ?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Même intention?      >50% de chevauchement?      Le changement original
          Même problème?     Même périmètre?        Peut être "terminé" sans
                 │                  │          ces changements?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      OUI               NON OUI           NON  NON              OUI
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    MIS A JOUR        NOUVEAU  MIS A JOUR   NOUVEAU          MIS A JOUR
```

**Exemple : « Ajouter le mode sombre »**

- "Il faut aussi prendre en charge les thèmes personnalisés" → Nouveau changement (périmètre explosé)
- "La détection de la préférence du système est plus difficile que prévu" → Mise à jour (même intention)
- "Faisons d'abord le basculement, ajouter les préférences plus tard" → Mise à jour puis archivage, puis nouveau changement

## Bonnes Pratiques

### Maintenir les Changements Concentrés

Une unité logique de travail par changement. Si vous faites « ajouter la fonctionnalité X et refactoriser Y », envisagez deux changements séparés.

**Pourquoi c'est important :**
- Plus facile à revoir et à comprendre
- Historique d'archivage plus propre
- Peut être livré indépendamment
- Simplification du rollback si nécessaire

### Utiliser `/opsx:explore` pour les Exigences Floues

Avant de vous engager sur un changement, explorez l'espace problématique :

```text
Vous: /opsx:explore

AI:  Que souhaitez-vous explorer ?

Vous: Comment devons-nous gérer la limitation de débit (rate limiting) pour notre API ?

AI:  Laissez-moi enquêter sur votre configuration actuelle et vos options...
     [Enquête dans le code source, considère les modèles]

     Je vois trois approches que nous pourrions adopter :
     1. Basé sur middleware (simple, par endpoint)
     2. Basé sur Redis (scalable, état partagé)
     3. Seau de jetons par utilisateur (équitable, complexe)

     Votre pile actuelle suggère #1 ou #2. Quel est votre niveau d'échelle ?
```

L'exploration clarifie la pensée avant que vous ne créiez des artefacts.

### Vérifier Avant d'Archiver

Utilisez `/opsx:verify` pour vérifier que l'implémentation correspond aux artefacts :

```text
Vous: /opsx:verify

AI:  Vérification de add-dark-mode...

     ✓ Toutes les tâches de tasks.md sont vérifiées
     ✓ Les exigences des spécifications correspondent au code
     ✓ Les décisions de conception sont reflétées dans l'implémentation

     Prêt à archiver !
```

Cela détecte les incohérences avant que vous ne clôturiez le changement.

### Nommer les Changements Clairement

De bons noms rendent `openspec list` utile :

```text
Bon :                          À éviter :
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Référence Rapide des Commandes

Pour les détails complets et les options des commandes, voir [Commands](commands.md).

| Command | Objectif | Quand l'utiliser |
|---------|---------|-------------|
| `/opsx:propose` | Créer les artefacts de changement et de planification | Chemin par défaut rapide (`core` profile) |
| `/opsx:explore` | Réfléchir sur des idées avec l'IA | À commencer lorsque vous n'êtes pas sûr : exigences floues, investigation, comparaison d'options |
| `/opsx:new` | Démarrer un échafaudage de changement | Mode étendu, contrôle explicite des artefacts |
| `/opsx:continue` | Créer le prochain artefact | Mode étendu, création d'artefacts étape par étape |
| `/opsx:ff` | Créer tous les artefacts de planification | Mode étendu, portée claire |
| `/opsx:apply` | Implémenter les tâches | Prêt à écrire du code |
| `/opsx:verify` | Valider l'implémentation | Mode étendu, avant d'archiver |
| `/opsx:sync` | Fusionner les spécifications Delta | Mode étendu, optionnel |
| `/opsx:archive` | Finaliser le changement | Tout le travail est terminé |
| `/opsx:bulk-archive` | Archiver plusieurs changements | Mode étendu, travail parallèle |

## Prochaines Étapes

- [Commands](commands.md) - Référence complète des commandes et options
- [Concepts](concepts.md) - Plongée approfondie dans les spécifications, les artefacts et les schémas
- [Customization](customization.md) - Créer des flux de travail personnalisés