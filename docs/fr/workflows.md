# Flux de travail

Ce guide présente les principaux modèles de flux de travail pour OpenSpec et indique quand utiliser chacun d'eux. Pour la configuration de base, consultez la section [Démarrage](getting-started.md). Pour la référence des commandes, voir [Commandes](commands.md).

## Philosophie : Des actions, pas des phases

Les flux de travail traditionnels vous imposent des étapes : planification, puis implémentation, puis terminé. Mais le travail réel ne se laisse pas facilement enfermer dans des cases.

OPSX adopte une approche différente :

```text
Traditionnel (phases verrouillées) :

  PLANIFICATION ────────► IMPLÉMENTATION ────────► TERMINÉ
      │                          │
      │   "Pas de retour en arrière" │
      └──────────────────────────┘

OPSX (actions fluides) :

  proposition ──► spécifications ──► conception ──► tâches ──► implémentation
```

**Principes clés :**

- **Des actions, pas des phases** - Les commandes sont des choses que vous pouvez faire, pas des étapes dans lesquelles vous êtes bloqué
- **Les dépendances sont des facilitateurs** - Elles montrent ce qui est possible, pas ce qui est requis ensuite

> **Personnalisation :** Les flux de travail OPSX sont pilotés par des schémas qui définissent les séquences d'artefacts. Consultez la section [Personnalisation](customization.md) pour plus de détails sur la création de schémas personnalisés.

## Deux modes

### Chemin rapide par défaut (profil `core`)

Les nouvelles installations utilisent par défaut `core`, qui fournit :
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:archive`

Flux typique :

```text
/opsx:propose ──► /opsx:apply ──► /opsx:archive
```

### Flux de travail étendu/complet (sélection personnalisée)

Si vous souhaitez des commandes explicites de scaffolding et de construction (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), activez-les avec :

```bash
openspec config profile
openspec update
```

## Modèles de flux de travail (mode étendu)

### Fonctionnalité rapide

Lorsque vous savez ce que vous voulez construire et que vous avez juste besoin d'exécuter :

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Exemple de conversation :**

```text
Vous : /opsx:new add-logout-button

IA :  Créé openspec/changes/add-logout-button/
     Prêt à créer : proposition

Vous : /opsx:ff

IA :  Création de tous les artefacts de planification...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Prêt pour l'implémentation !

Vous : /opsx:apply

IA :  Traitement des tâches...
     ✓ Ajout du bouton de déconnexion à l'en-tête
     ✓ Implémentation de la déconnexion de session
     ✓ Ajout de la boîte de dialogue de confirmation
     Toutes les tâches sont terminées !

Vous : /opsx:archive

IA :  ✓ Spécifications fusionnées
     ✓ Changement archivé
```

**Idéal pour :** Fonctionnalités de petite à moyenne taille, corrections de bugs, modifications simples.

### Exploratoire

Lorsque les exigences ne sont pas claires ou que vous devez d'abord enquêter :

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Exemple de conversation :**

```text
Vous : /opsx:explore

IA :  Que souhaitez-vous explorer ?

Vous : Je veux améliorer les performances de chargement de la page mais je ne suis pas sûr
     de savoir où se trouvent les goulots d'étranglement.

IA :  Laissez-moi vous aider à enquêter...
     [Analyse les tailles des bundles, identifie les requêtes lentes, examine
     les modèles de rendu des composants]

     J'ai trouvé trois principaux goulots d'étranglement :
     1. Images grandes et non optimisées
     2. Récupération de données synchrone dans ProductList
     3. Rendus répétés dus aux changements de contexte

     Lequel souhaitez-vous traiter en premier ?

Vous : Attaquons le problème de récupération des données.

Vous : /opsx:new optimize-product-list-fetching

IA :  Changement créé. Prêt à créer : proposition

Vous : /opsx:continue

IA :  Création de la proposition basée sur notre exploration...
     [Rédige la proposition en intégrant les résultats de l'enquête]

     Prêt à créer : spécifications, conception
     Que souhaitez-vous ensuite ?

Vous : /opsx:continue

IA :  Création des spécifications...
```

**Idéal pour :** Optimisation des performances, débogage, décisions d'architecture, exigences non claires.

### Changements parallèles

Travaillez sur plusieurs changements à la fois :

```text
Changement A : /opsx:new ──► /opsx:ff ──► /opsx:apply (en cours)
                                         │
                                    changement de contexte
                                         │
Changement B : /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Exemple de conversation :**

```text
Vous : Je travaille sur add-dark-mode mais j'ai été appelé pour une correction de bug

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

Vous : Revenons au mode sombre

Vous : /opsx:apply add-dark-mode

IA :  Reprise de add-dark-mode...
     Reprise à la tâche 2.3 : Mise à jour de l'en-tête...
```

**Idéal pour :** Flux de travail parallèles, interruptions urgentes, collaboration en équipe.

Lorsque vous avez plusieurs changements terminés, utilisez `/opsx:bulk-archive` :

```text
Vous : /opsx:bulk-archive

IA :  3 changements terminés trouvés :
     - add-dark-mode (toutes les tâches terminées)
     - fix-login-redirect (toutes les tâches terminées)
     - update-footer (toutes les tâches terminées)

     Vérification des conflits de spécifications...
     ⚠ add-dark-mode et update-footer touchent tous deux specs/ui/

     Inspection du code source pour résoudre...
     Les deux changements sont implémentés. Application dans l'ordre chronologique.

     Archiver les 3 changements ?

Vous : Oui

IA :  ✓ add-dark-mode archivé
     ✓ fix-login-redirect archivé
     ✓ update-footer archivé
     Spécifications fusionnées dans l'ordre : add-dark-mode → update-footer
```

L'archivage en masse détecte lorsque plusieurs changements touchent les mêmes spécifications et résout les conflits en vérifiant ce qui est réellement implémenté.

### Finaliser un changement

Le flux de finalisation recommandé :

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              valide             demande de synchronisation
              l'implémentation    si nécessaire
```

#### Vérification : Contrôlez votre travail

`/opsx:verify` valide l'implémentation par rapport à vos artefacts selon trois dimensions :

```text
Vous : /opsx:verify

IA :  Vérification de add-auth...

     COMPLÉTUDE
     ✓ Les 12 tâches de tasks.md sont cochées
     ✓ Toutes les exigences de specs ont un code correspondant
     ⚠ Le scénario "Expiration de session après inactivité" n'est pas testé

     EXACTITUDE
     ✓ L'implémentation correspond à l'intention de la spécification
     ✓ Les cas limites des scénarios sont gérés
     ✓ Les états d'erreur correspondent aux définitions de la spécification

     COHÉRENCE
     ✓ Les décisions de conception sont reflétées dans la structure du code
     ✓ Les conventions de nommage sont cohérentes avec design.md
     ⚠ La conception mentionne "événementiel" mais l'implémentation utilise le polling

     RÉSUMÉ
     ─────────────────────────────
     Problèmes critiques : 0
     Avertissements : 2
     Prêt à archiver : Oui (avec avertissements)

     Recommandations :
     1. Ajouter un test pour le scénario d'expiration de session
     2. Envisager de refactoriser en événementiel comme prévu, ou mettre à jour design.md
```

**Ce que vérifie la validation :**

| Dimension | Ce qu'elle valide |
|-----------|------------------|
| Complétude | Toutes les tâches terminées, toutes les exigences implémentées, scénarios couverts |
| Exactitude | L'implémentation correspond à l'intention de la spécification, cas limites gérés |
| Cohérence | Décisions de conception reflétées dans le code, modèles cohérents |

La validation ne bloquera pas l'archivage, mais elle met en lumière des problèmes que vous pourriez vouloir traiter en premier.

#### Archivage : Finaliser le changement

`/opsx:archive` termine le changement et le déplace dans les archives :

```text
Vous : /opsx:archive

IA :  Archivage de add-auth...

     État des artefacts :
     ✓ proposal.md existe
     ✓ specs/ existe
     ✓ design.md existe
     ✓ tasks.md existe (12/12 tâches terminées)

     Spécifications delta : Pas encore synchronisées avec la branche principale
     → Souhaitez-vous synchroniser maintenant ?

Vous : Oui

IA :  ✓ Spécifications synchronisées vers openspec/specs/auth/spec.md
     ✓ Déplacé vers openspec/changes/archive/2025-01-24-add-auth/

     Changement archivé avec succès.
```

L'archivage demandera une action si les spécifications ne sont pas synchronisées. Il ne bloquera pas sur des tâches incomplètes, mais il vous avertira.

## Quand utiliser quoi

### `/opsx:ff` vs `/opsx:continue`

| Situation | Utiliser |
|-----------|----------|
| Exigences claires, prêt à construire | `/opsx:ff` |
| Exploration, souhaitez revoir chaque étape | `/opsx:continue` |
| Souhaitez itérer sur la proposition avant les spécifications | `/opsx:continue` |
| Pression temporelle, besoin d'aller vite | `/opsx:ff` |
| Changement complexe, souhaitez garder le contrôle | `/opsx:continue` |

**Règle pratique :** Si vous pouvez décrire la portée complète à l'avance, utilisez `/opsx:ff`. Si vous la définissez au fur et à mesure, utilisez `/opsx:continue`.

### Quand mettre à jour vs recommencer

Une question fréquente : quand est-il acceptable de mettre à jour un changement existant, et quand devriez-vous en créer un nouveau ?

**Mettez à jour le changement existant lorsque :**

- Même intention, exécution affinée
- La portée se réduit (MVP d'abord, le reste ensuite)
- Corrections basées sur l'apprentissage (le code source n'est pas ce que vous attendiez)
- Ajustements de conception basés sur les découvertes d'implémentation

**Créez un nouveau changement lorsque :**

- L'intention a fondamentalement changé
- La portée a explosé vers un travail totalement différent
- Le changement original peut être marqué "terminé" de manière autonome
- Les correctifs seraient plus confus que clairifiants

```text
                     ┌─────────────────────────────────────┐
                     │     Est-ce le même travail ?        │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Même intention ?   >50% de chevauchement ?  Le changement original
          Même problème ?    Même portée ?            peut-il être "terminé" sans
                 │                  │                 ces changements ?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      OUI               NON OUI           NON NON              OUI
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    METTRE À JOUR    NOUVEAU METTRE À JOUR NOUVEAU METTRE À JOUR NOUVEAU
```

**Exemple : « Ajouter le mode sombre »**

- « Besoin de supporter également les thèmes personnalisés » → Nouveau changement (portée explosée)
- « La détection des préférences système est plus difficile que prévu » → Mise à jour (même intention)
- « Livrons d'abord le bouton, ajoutons les préférences plus tard » → Mise à jour puis archivage, puis nouveau changement

## Bonnes pratiques

### Gardez les changements ciblés

Une unité logique de travail par changement. Si vous faites « ajouter la fonctionnalité X et aussi refactoriser Y », envisagez deux changements séparés.

**Pourquoi c'est important :**
- Plus facile à examiner et à comprendre
- Historique d'archivage plus propre
- Peut être livré indépendamment
- Rollback plus simple si nécessaire

### Utilisez `/opsx:explore` pour les exigences non claires

Avant de vous engager dans un changement, explorez l'espace du problème :

```text
Vous : /opsx:explore

IA :  Que souhaitez-vous explorer ?

Vous : Comment devrions-nous gérer la limitation de débit pour notre API ?

IA :  Laissez-moi enquêter sur votre configuration actuelle et les options...
     [Recherche le code source, considère les modèles]

     Je vois trois approches possibles :
     1. Basée sur le middleware (simple, par point de terminaison)
     2. Basée sur Redis (évolutive, état partagé)
     3. Seau de jetons par utilisateur (équitable, complexe)

     Votre pile actuelle suggère #1 ou #2. Quelle est votre échelle ?
```

L'exploration clarifie la réflexion avant que vous ne créiez des artefacts.

### Vérifiez avant d'archiver

Utilisez `/opsx:verify` pour vérifier que l'implémentation correspond aux artefacts :

```text
Vous : /opsx:verify

IA :  Vérification de add-dark-mode...

     ✓ Toutes les tâches de tasks.md sont cochées
     ✓ Les exigences de specs ont un code correspondant
     ✓ Les décisions de conception sont reflétées dans l'implémentation

     Prêt à archiver !
```

Détecte les incohérences avant que vous ne fermiez le changement.

### Nommez les changements clairement

De bons noms rendent `openspec list` utile :

```text
Bon :                          À éviter :
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Référence rapide des commandes

Pour les détails complets des commandes et options, consultez [Commandes](commands.md).

| Commande | Objectif | Quand l'utiliser |
|----------|----------|------------------|
| `/opsx:propose` | Créer un changement + artefacts de planification | Chemin par défaut rapide (profil `core`) |
| `/opsx:explore` | Réfléchir aux idées | Exigences floues, investigation |
| `/opsx:new` | Démarrer un squelette de changement | Mode étendu, contrôle explicite des artefacts |
| `/opsx:continue` | Créer l'artefact suivant | Mode étendu, création d'artefacts étape par étape |
| `/opsx:ff` | Créer tous les artefacts de planification | Mode étendu, portée claire |
| `/opsx:apply` | Implémenter les tâches | Prêt à écrire du code |
| `/opsx:verify` | Valider l'implémentation | Mode étendu, avant l'archivage |
| `/opsx:sync` | Fusionner les spécifications delta | Mode étendu, optionnel |
| `/opsx:archive` | Finaliser le changement | Tout le travail est terminé |
| `/opsx:bulk-archive` | Archiver plusieurs changements | Mode étendu, travail en parallèle |

## Étapes suivantes

- [Commandes](commands.md) - Référence complète des commandes avec options
- [Concepts](concepts.md) - Plongée approfondie dans les spécifications, artefacts et schémas
- [Personnalisation](customization.md) - Créer des flux de travail personnalisés