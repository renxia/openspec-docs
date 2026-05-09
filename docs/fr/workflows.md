# Flux de travail

Ce guide couvre les modèles de flux de travail courants pour OpenSpec et indique quand les utiliser. Pour la configuration de base, consultez [Pour commencer](getting-started.md). Pour la référence des commandes, consultez [Commandes](commands.md).

## Philosophie : Actions, pas phases

Les flux de travail traditionnels vous imposent des phases : planification, puis implémentation, puis terminé. Mais le travail réel ne s'insère pas dans des cases aussi nettes.

OPSX adopte une approche différente :

```text
Traditionnel (verrouillé par phase) :

  PLANIFICATION ────────► IMPLÉMENTATION ────────► TERMINÉ
      │                    │
      │   "Impossible de   │
      │    revenir en arrière"
      └────────────────────┘

OPSX (actions fluides) :

  proposition ──► spécifications ──► conception ──► tâches ──► implémenter
```

**Principes clés :**

- **Actions, pas phases** - Les commandes sont des choses que vous pouvez faire, pas des étapes dans lesquelles vous êtes coincé
- **Les dépendances sont des facilitateurs** - Elles montrent ce qui est possible, pas ce qui est requis ensuite

> **Personnalisation :** Les flux de travail OPSX sont pilotés par des schémas qui définissent des séquences d'artefacts. Consultez [Personnalisation](customization.md) pour plus de détails sur la création de schémas personnalisés.

## Deux Modes

### Chemin Rapide par Défaut (profil `core`)

Les nouvelles installations utilisent par défaut `core`, qui fournit :
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Flux typique :

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

### Workflow Étendu/Complet (sélection personnalisée)

Si vous souhaitez des commandes explicites de scaffolding et de construction (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), activez-les avec :

```bash
openspec config profile
openspec update
```

## Modèles de Workflow (Mode Étendu)

### Fonctionnalité Rapide

Lorsque vous savez ce que vous voulez construire et avez juste besoin d'exécuter :

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
     ✓ Bouton de déconnexion ajouté à l'en-tête
     ✓ Effacement de session implémenté
     ✓ Dialogue de confirmation ajouté
     Toutes les tâches terminées !

Vous : /opsx:archive

IA :  ✓ Spécifications fusionnées
     ✓ Changement archivé
```

**Idéal pour :** Petites à moyennes fonctionnalités, corrections de bugs, changements simples.

### Exploratoire

Lorsque les exigences ne sont pas claires ou que vous devez d'abord investiguer :

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Exemple de conversation :**

```text
Vous : /opsx:explore

IA :  Que souhaitez-vous explorer ?

Vous : Je veux améliorer les performances de chargement des pages mais je ne sais pas
     où sont les goulots d'étranglement.

IA :  Laissez-moi vous aider à investiguer...
     [Analyse les tailles des bundles, identifie les requêtes lentes, examine les
     modèles de rendu des composants]

     J'ai trouvé trois principaux goulots d'étranglement :
     1. Images volumineuses non optimisées
     2. Récupération de données synchrone dans ProductList
     3. Re-rendus dus aux changements de contexte

     Lequel souhaitez-vous aborder en premier ?

Vous : Attaquons-nous au problème de récupération de données.

Vous : /opsx:new optimize-product-list-fetching

IA :  Changement créé. Prêt à créer : proposition

Vous : /opsx:continue

IA :  Création de la proposition basée sur notre exploration...
     [Rédige la proposition intégrant les insights de l'investigation]

     Prêt à créer : spécifications, design
     Que souhaitez-vous ensuite ?

Vous : /opsx:continue

IA :  Création des spécifications...
```

**Idéal pour :** Optimisation des performances, débogage, décisions architecturales, exigences floues.

### Changements en Parallèle

Travailler sur plusieurs changements simultanément :

```text
Changement A : /opsx:new ──► /opsx:ff ──► /opsx:apply (en cours)
                                         │
                                    changement de contexte
                                         │
Changement B : /opsx:new ──► /opsx:ff ──────► /opsx:apply
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
     Toutes les tâches terminées !

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
     ⚠ add-dark-mode et update-footer touchent tous les deux specs/ui/

     Inspection de la base de code pour résoudre...
     Les deux changements sont implémentés. Application dans l'ordre chronologique.

     Archiver les 3 changements ?

Vous : Oui

IA :  ✓ add-dark-mode archivé
     ✓ fix-login-redirect archivé
     ✓ update-footer archivé
     Spécifications fusionnées dans l'ordre : add-dark-mode → update-footer
```

L'archivage en masse détecte lorsque plusieurs changements touchent les mêmes spécifications et résout les conflits en vérifiant ce qui est réellement implémenté.

### Terminer un Changement

Le flux de completion recommandé :

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              valide              propose de synchroniser
              l'implémentation    si nécessaire
```

#### Vérifier : Votre Travail

`/opsx:verify` valide l'implémentation par rapport à vos artefacts selon trois dimensions :

```text
Vous : /opsx:verify

IA :  Vérification de add-auth...

     COMPLÉTUDE
     ✓ Les 12 tâches dans tasks.md sont cochées
     ✓ Toutes les exigences dans les spécifications ont un code correspondant
     ⚠ Scénario "Expiration de session après inactivité" non testé

     CORRECTITUDE
     ✓ L'implémentation correspond à l'intention des spécifications
     ✓ Les cas limites des scénarios sont gérés
     ✓ Les états d'erreur correspondent aux définitions des spécifications

     COHÉRENCE
     ✓ Les décisions de design se reflètent dans la structure du code
     ✓ Les conventions de nommage sont cohérentes avec design.md
     ⚠ Le design mentionne "event-driven" mais l'implémentation utilise le polling

     RÉSUMÉ
     ─────────────────────────────
     Problèmes critiques : 0
     Avertissements : 2
     Prêt à archiver : Oui (avec avertissements)

     Recommandations :
     1. Ajouter un test pour le scénario d'expiration de session
     2. Envisager de refactoriser vers event-driven comme conçu, ou mettre à jour design.md
```

**Ce que la vérification contrôle :**

| Dimension | Ce qu'elle valide |
|-----------|------------------|
| Complétude | Toutes les tâches terminées, toutes les exigences implémentées, scénarios couverts |
| Correctitude | L'implémentation correspond à l'intention des spécifications, cas limites gérés |
| Cohérence | Les décisions de design se reflètent dans le code, modèles cohérents |

La vérification ne bloquera pas l'archivage, mais elle met en lumière les problèmes que vous pourriez vouloir résoudre d'abord.

#### Archiver : Finaliser le Changement

`/opsx:archive` termine le changement et le déplace vers l'archive :

```text
Vous : /opsx:archive

IA :  Archivage de add-auth...

     Statut des artefacts :
     ✓ proposal.md existe
     ✓ specs/ existe
     ✓ design.md existe
     ✓ tasks.md existe (12/12 tâches terminées)

     Spécifications delta : Pas encore synchronisées vers main
     → Souhaitez-vous synchroniser maintenant ?

Vous : Oui

IA :  ✓ Spécifications synchronisées vers openspec/specs/auth/spec.md
     ✓ Déplacé vers openspec/changes/archive/2025-01-24-add-auth/

     Changement archivé avec succès.
```

L'archivage proposera si les spécifications ne sont pas synchronisées. Il ne bloquera pas sur les tâches incomplètes, mais vous avertira.

## Quand Utiliser Quoi

### `/opsx:ff` vs `/opsx:continue`

| Situation | Utiliser |
|-----------|----------|
| Exigences claires, prêt à construire | `/opsx:ff` |
| Exploration, vouloir examiner chaque étape | `/opsx:continue` |
| Vouloir itérer sur la proposition avant les spécifications | `/opsx:continue` |
| Pression du temps, besoin d'aller vite | `/opsx:ff` |
| Changement complexe, vouloir du contrôle | `/opsx:continue` |

**Règle empirique :** Si vous pouvez décrire la portée complète à l'avance, utilisez `/opsx:ff`. Si vous le déterminez au fur et à mesure, utilisez `/opsx:continue`.

### Quand Mettre à Jour vs Recommencer à Zéro

Question courante : quand est-il acceptable de mettre à jour un changement existant, et quand devez-vous en commencer un nouveau ?

**Mettre à jour le changement existant lorsque :**

- Même intention, exécution affinée
- La portée se réduit (MVP d'abord, le reste plus tard)
- Corrections basées sur l'apprentissage (la base de code n'est pas ce que vous attendiez)
- Ajustements de design basés sur les découvertes d'implémentation

**Commencer un nouveau changement lorsque :**

- L'intention a fondamentalement changé
- La portée a explosé vers un travail entièrement différent
- Le changement original peut être marqué "terminé" de manière autonome
- Les correctifs prêteraient plus à confusion qu'à clarification

```text
                     ┌─────────────────────────────────────┐
                     │     Est-ce le même travail ?        │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Même intention ?   >50% de chevauchement ?  Le changement
          Même problème ?    Même portée ?            original peut-il
                 │                  │                  être "terminé" sans
                 │                  │                  ces modifications ?
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      OUI               NON OUI          NON NON              OUI
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    MISE À JOUR       NOUVEAU MISE À JOUR  NOUVEAU MISE À JOUR  NOUVEAU
```

**Exemple : "Ajouter le mode sombre"**

- "Besoin de supporter aussi les thèmes personnalisés" → Nouveau changement (portée explosée)
- "La détection des préférences système est plus difficile que prévu" → Mise à jour (même intention)
- "Expédions d'abord le basculement, ajoutons les préférences plus tard" → Mise à jour puis archivage, puis nouveau changement

## Bonnes Pratiques

### Garder les Changements Ciblés

Une unité logique de travail par changement. Si vous faites "ajouter la fonctionnalité X et aussi refactoriser Y", envisagez deux changements séparés.

**Pourquoi c'est important :**
- Plus facile à examiner et comprendre
- Historique d'archive plus propre
- Peut être livré indépendamment
- Retour en arrière plus simple si nécessaire

### Utiliser `/opsx:explore` pour les Exigences Floues

Avant de vous engager dans un changement, explorez l'espace du problème :

```text
Vous : /opsx:explore

IA :  Que souhaitez-vous explorer ?

Vous : Comment devrions-nous gérer la limitation de débit pour notre API ?

IA :  Laissez-moi investiguer votre configuration actuelle et les options...
     [Recherche la base de code, considère les modèles]

     Je vois trois approches que nous pourrions adopter :
     1. Basée sur le middleware (simple, par endpoint)
     2. Soutenue par Redis (évolutive, état partagé)
     3. Seau à jetons par utilisateur (équitable, complexe)

     Votre pile actuelle suggère #1 ou #2. Quelle est votre échelle ?
```

L'exploration clarifie la réflexion avant de créer des artefacts.

### Vérifier Avant d'Archiver

Utilisez `/opsx:verify` pour vérifier que l'implémentation correspond aux artefacts :

```text
Vous : /opsx:verify

IA :  Vérification de add-dark-mode...

     ✓ Toutes les tâches dans tasks.md sont cochées
     ✓ Les exigences dans les spécifications ont un code correspondant
     ✓ Les décisions de design se reflètent dans l'implémentation

     Prêt à archiver !
```

Détecte les incohérences avant de clôturer le changement.

### Nommer les Changements Clairement

De bons noms rendent `openspec list` utile :

```text
Bon :                          À éviter :
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Référence rapide des commandes

Pour les détails complets des commandes et leurs options, consultez [Commandes](commands.md).

| Commande | Objectif | Quand l'utiliser |
|----------|----------|------------------|
| `/opsx:propose` | Créer une modification + artefacts de planification | Chemin par défaut rapide (profil `core`) |
| `/opsx:explore` | Réfléchir à des idées | Exigences floues, investigation |
| `/opsx:new` | Démarrer une structure de modification | Mode étendu, contrôle explicite des artefacts |
| `/opsx:continue` | Créer l'artefact suivant | Mode étendu, création d'artefacts étape par étape |
| `/opsx:ff` | Créer tous les artefacts de planification | Mode étendu, périmètre clair |
| `/opsx:apply` | Implémenter les tâches | Prêt à écrire du code |
| `/opsx:verify` | Valider l'implémentation | Mode étendu, avant l'archivage |
| `/opsx:sync` | Fusionner les spécifications delta | Mode étendu, optionnel |
| `/opsx:archive` | Terminer la modification | Tous les travaux terminés |
| `/opsx:bulk-archive` | Archiver plusieurs modifications | Mode étendu, travaux parallèles |

## Prochaines étapes

- [Commandes](commands.md) - Référence complète des commandes avec options
- [Concepts](concepts.md) - Plongée dans les spécifications, artefacts et schémas
- [Personnalisation](customization.md) - Créer des workflows personnalisés