# Commandes

Voici la référence pour les commandes slash d'OpenSpec. Ces commandes sont invoquées dans l'interface de chat de votre assistant de codage IA (par exemple, Claude Code, Cursor, Windsurf).

Pour les modèles de flux de travail et l'utilisation de chaque commande, consultez [Flux de travail](workflows.md). Pour les commandes en ligne de commande, consultez [CLI](cli.md).

## Référence rapide

### Chemin rapide par défaut (profil `core`)

| Commande | Objectif |
|----------|----------|
| `/opsx:propose` | Créer un changement et générer les artefacts de planification en une seule étape |
| `/opsx:explore` | Réfléchir aux idées avant de s'engager dans un changement |
| `/opsx:apply` | Implémenter les tâches issues du changement |
| `/opsx:archive` | Archiver un changement terminé |

### Commandes de flux de travail étendu (sélection personnalisée du flux de travail)

| Commande | Objectif |
|----------|----------|
| `/opsx:new` | Démarrer un nouveau squelette de changement |
| `/opsx:continue` | Créer l'artefact suivant en fonction des dépendances |
| `/opsx:ff` | Avance rapide : créer tous les artefacts de planification en une fois |
| `/opsx:verify` | Valider que l'implémentation correspond aux artefacts |
| `/opsx:sync` | Fusionner les spécifications delta dans les spécifications principales |
| `/opsx:bulk-archive` | Archiver plusieurs changements en une seule fois |
| `/opsx:onboard` | Tutoriel guidé à travers le flux de travail complet |

Le profil global par défaut est `core`. Pour activer les commandes de flux de travail étendu, exécutez `openspec config profile`, sélectionnez les flux de travail, puis exécutez `openspec update` dans votre projet.

---

## Référence des commandes

### `/opsx:propose`

Crée un nouveau changement et génère les artefacts de planification en une seule étape. C'est la commande de démarrage par défaut dans le profil `core`.

**Syntaxe :**
```text
/opsx:propose [nom-ou-description-du-changement]
```

**Arguments :**
| Argument | Requis | Description |
|----------|--------|-------------|
| `nom-ou-description-du-changement` | Non | Nom en kebab-case ou description en langage naturel du changement |

**Ce qu'elle fait :**
- Crée `openspec/changes/<nom-du-changement>/`
- Génère les artefacts nécessaires avant l'implémentation (pour `spec-driven` : proposition, spécifications, conception, tâches)
- S'arrête lorsque le changement est prêt pour `/opsx:apply`

**Exemple :**
```text
Vous : /opsx:propose add-dark-mode

IA :  Créé openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Prêt pour l'implémentation. Exécutez /opsx:apply.
```

**Conseils :**
- Utilisez cette commande pour le chemin de bout en bout le plus rapide
- Si vous souhaitez un contrôle étape par étape des artefacts, activez les flux de travail étendus et utilisez `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

Réfléchir à des idées, enquêter sur des problèmes et clarifier les exigences avant de s'engager sur un changement.

**Syntaxe :**
```
/opsx:explore [sujet]
```

**Arguments :**
| Argument | Requis | Description |
|----------|--------|-------------|
| `sujet` | Non | Ce que vous souhaitez explorer ou enquêter |

**Ce qu'elle fait :**
- Ouvre une conversation exploratoire sans structure requise
- Enquête sur la base de code pour répondre aux questions
- Compare les options et les approches
- Crée des diagrammes visuels pour clarifier la réflexion
- Peut passer à `/opsx:propose` (par défaut) ou `/opsx:new` (flux de travail étendu) lorsque les idées se cristallisent

**Exemple :**
```text
Vous : /opsx:explore

IA :  Que souhaitez-vous explorer ?

Vous : Comment devrions-nous gérer l'authentification pour l'application mobile ?

IA :  Laissez-moi enquêter sur votre configuration d'authentification actuelle...
     [Analyse la base de code]

     Je vois que vous utilisez une authentification basée sur des sessions pour l'application web.
     Pour le mobile, nous avons trois options principales :

     1. Jetons JWT (sans état, fonctionne hors ligne)
     2. OAuth2 (si vous avez besoin d'une connexion tierce)
     3. Étendre les sessions actuelles (plus simple, mais nécessite une connectivité)

     Votre API a déjà CORS configuré. Quelle direction vous intéresse ?

Vous : Allons avec JWT. Pouvez-nous commencer un changement pour cela ?

IA :  Prêt quand vous le souhaitez. Exécutez /opsx:propose add-jwt-auth pour commencer.
```

**Conseils :**
- À utiliser lorsque les exigences ne sont pas claires ou que vous devez enquêter
- Aucun artefact n'est créé pendant l'exploration
- Utile pour comparer plusieurs approches avant de décider
- Peut lire des fichiers et rechercher dans la base de code

---

### `/opsx:new`

Démarre un nouveau squelette de changement. Crée le dossier du changement et attend que vous génériez les artefacts avec `/opsx:continue` ou `/opsx:ff`.

Cette commande fait partie de l'ensemble des flux de travail étendus (non inclus dans le profil `core` par défaut).

**Syntaxe :**
```
/opsx:new [nom-du-changement] [--schema <nom-du-schema>]
```

**Arguments :**
| Argument | Requis | Description |
|----------|--------|-------------|
| `nom-du-changement` | Non | Nom du dossier du changement (demandé si non fourni) |
| `--schema` | Non | Schéma de flux de travail à utiliser (par défaut : depuis la config ou `spec-driven`) |

**Ce qu'elle fait :**
- Crée le répertoire `openspec/changes/<nom-du-changement>/`
- Crée le fichier de métadonnées `.openspec.yaml` dans le dossier du changement
- Affiche le premier modèle d'artefact prêt à être créé
- Demande le nom du changement et le schéma s'ils ne sont pas fournis

**Ce qu'elle crée :**
```
openspec/changes/<nom-du-changement>/
└── .openspec.yaml    # Métadonnées du changement (schéma, date de création)
```

**Exemple :**
```
Vous : /opsx:new add-dark-mode

IA :  Créé openspec/changes/add-dark-mode/
     Schéma : spec-driven

     Prêt à créer : proposition
     Utilisez /opsx:continue pour la créer, ou /opsx:ff pour créer tous les artefacts.
```

**Conseils :**
- Utilisez des noms descriptifs : `add-feature`, `fix-bug`, `refactor-module`
- Évitez les noms génériques comme `update`, `changes`, `wip`
- Le schéma peut également être défini dans la configuration du projet (`openspec/config.yaml`)

---

### `/opsx:continue`

Crée l'artefact suivant dans la chaîne de dépendances. Crée un artefact à la fois pour une progression incrémentielle.

**Syntaxe :**
```
/opsx:continue [nom-du-changement]
```

**Arguments :**
| Argument | Requis | Description |
|----------|--------|-------------|
| `nom-du-changement` | Non | Quel changement continuer (déduit du contexte si non fourni) |

**Ce qu'elle fait :**
- Interroge le graphe de dépendances des artefacts
- Affiche quels artefacts sont prêts vs bloqués
- Crée le premier artefact prêt
- Lit les fichiers de dépendance pour le contexte
- Affiche ce qui devient disponible après la création

**Exemple :**
```
Vous : /opsx:continue

IA :  Changement : add-dark-mode

     État des artefacts :
     ✓ proposition    (terminé)
     ◆ spécifications (prêt)
     ◆ conception     (prêt)
     ○ tâches         (bloqué - nécessite : spécifications)

     Création des spécifications...

     [Lit proposal.md, crée les spécifications basées sur les exigences]

     ✓ Créé openspec/changes/add-dark-mode/specs/ui/spec.md

     Maintenant disponible : tâches
     Exécutez /opsx:continue pour créer l'artefact suivant.
```

**Conseils :**
- À utiliser lorsque vous souhaitez examiner chaque artefact avant de continuer
- Utile pour les changements complexes où vous voulez du contrôle
- Plusieurs artefacts peuvent devenir prêts simultanément
- Vous pouvez modifier les artefacts créés avant de continuer

---

### `/opsx:ff`

Avance rapide dans la création des artefacts. Crée tous les artefacts de planification en une fois.

**Syntaxe :**
```
/opsx:ff [nom-du-changement]
```

**Arguments :**
| Argument | Requis | Description |
|----------|--------|-------------|
| `nom-du-changement` | Non | Quel changement avancer rapidement (déduit du contexte si non fourni) |

**Ce qu'elle fait :**
- Crée tous les artefacts dans l'ordre des dépendances
- Suit la progression via la liste de tâches
- S'arrête lorsque tous les artefacts `apply-required` sont terminés
- Lit chaque dépendance avant de créer l'artefact suivant

**Exemple :**
```
Vous : /opsx:ff add-dark-mode

IA :  Avance rapide de add-dark-mode...

     ✓ Création de proposal.md
     ✓ Création de specs/ui/spec.md
     ✓ Création de design.md
     ✓ Création de tasks.md

     Tous les artefacts de planification sont terminés !
     Prêt pour l'implémentation. Exécutez /opsx:apply pour commencer.
```

**Conseils :**
- À utiliser lorsque vous avez une image claire de ce que vous construisez
- Plus rapide que `/opsx:continue` pour les changements simples
- Vous pouvez toujours modifier les artefacts après coup
- Utile pour les fonctionnalités de petite à moyenne taille

---

### `/opsx:apply`

Implémente les tâches du changement. Travaille à travers la liste de tâches, écrit le code et coche les éléments.

**Syntaxe :**
```
/opsx:apply [nom-du-changement]
```

**Arguments :**
| Argument | Requis | Description |
|----------|--------|-------------|
| `nom-du-changement` | Non | Quel changement implémenter (déduit du contexte si non fourni) |

**Ce qu'elle fait :**
- Lit `tasks.md` et identifie les tâches incomplètes
- Travaille sur les tâches une par une
- Écrit le code, crée des fichiers, lance des tests si nécessaire
- Marque les tâches comme terminées avec les cases à cocher `[x]`

**Exemple :**
```
Vous : /opsx:apply

IA :  Implémentation de add-dark-mode...

     Lecture de tasks.md :
     - [ ] 1.1 Créer ThemeContext
     - [ ] 1.2 Ajouter les propriétés CSS personnalisées
     - [ ] 1.3 Implémenter la persistance localStorage

     Travail sur 1.1 : Créer ThemeContext...
     [Crée src/context/ThemeContext.tsx]

     ✓ 1.1 Terminé

     Travail sur 1.2 : Ajouter les propriétés CSS personnalisées...
     [Met à jour src/styles/globals.css]

     ✓ 1.2 Terminé
     ...
```

**Conseils :**
- Peut reprendre là où vous en étiez si interrompu
- Utilisez pour des changements parallèles en spécifiant le nom du changement
- L'état de progression est suivi dans les cases à cocher de `tasks.md`

---

### `/opsx:verify`

Valide que l'implémentation correspond à vos artefacts de changement. Vérifie la complétude, la correction et la cohérence.

**Syntaxe :**
```
/opsx:verify [nom-du-changement]
```

**Arguments :**
| Argument | Requis | Description |
|----------|--------|-------------|
| `nom-du-changement` | Non | Quel changement vérifier (déduit du contexte si non fourni) |

**Ce qu'elle fait :**
- Vérifie trois dimensions de la qualité de l'implémentation
- Recherche dans la base de code les preuves d'implémentation
- Signale les problèmes catégorisés comme CRITIQUE, AVERTISSEMENT ou SUGGESTION
- Ne bloque pas l'archivage, mais met en évidence les problèmes

**Dimensions de vérification :**

| Dimension | Ce qu'elle valide |
|-----------|-------------------|
| **Complétude** | Toutes les tâches terminées, toutes les exigences implémentées, scénarios couverts |
| **Correction** | L'implémentation correspond à l'intention des spécifications, cas limites gérés |
| **Cohérence** | Les décisions de conception reflétées dans le code, patterns cohérents |

**Exemple :**
```
Vous : /opsx:verify

IA :  Vérification de add-dark-mode...

     COMPLÉTUDE
     ✓ Les 8 tâches dans tasks.md sont cochées
     ✓ Toutes les exigences dans les spécifications ont un code correspondant
     ⚠ Le scénario "Détection des préférences système" n'a pas de couverture de test

     CORRECTION
     ✓ L'implémentation correspond à l'intention des spécifications
     ✓ Les cas limites des scénarios sont gérés
     ✓ Les états d'erreur correspondent aux définitions des spécifications

     COHÉRENCE
     ✓ Les décisions de conception sont reflétées dans la structure du code
     ✓ Les conventions de nommage sont cohérentes avec design.md
     ⚠ La conception mentionne "variables CSS" mais l'implémentation utilise des classes Tailwind

     RÉSUMÉ
     ─────────────────────────────
     Problèmes critiques : 0
     Avertissements : 2
     Prêt à archiver : Oui (avec avertissements)

     Recommandations :
     1. Ajouter un test pour la détection des préférences système
     2. Mettre à jour design.md pour refléter l'utilisation de Tailwind, ou refactoriser pour utiliser les variables CSS
```

**Conseils :**
- Exécutez avant l'archivage pour détecter les incohérences tôt
- Les avertissements ne bloquent pas l'archivage mais indiquent des problèmes potentiels
- Utile pour réviser le travail de l'IA avant de valider
- Peut révéler une dérive entre les artefacts et l'implémentation

---

### `/opsx:sync`

**Commande optionnelle.** Fusionne les spécifications delta d'un changement dans les spécifications principales. L'archivage proposera de synchroniser si nécessaire, vous n'avez donc généralement pas besoin de l'exécuter manuellement.

**Syntaxe :**
```
/opsx:sync [nom-du-changement]
```

**Arguments :**
| Argument | Requis | Description |
|----------|--------|-------------|
| `nom-du-changement` | Non | Quel changement synchroniser (déduit du contexte si non fourni) |

**Ce qu'elle fait :**
- Lit les spécifications delta du dossier du changement
- Analyse les sections AJOUTÉ/MODIFIÉ/SUPPRIMÉ/RENOMMÉ
- Fusionne les changements dans le répertoire principal `openspec/specs/`
- Préserve le contenu existant non mentionné dans le delta
- N'archive pas le changement (reste actif)

**Exemple :**
```text
Vous : /opsx:sync

IA :  Synchronisation des spécifications delta de add-dark-mode...

     Lecture : openspec/changes/add-dark-mode/specs/ui/spec.md
     Cible :  openspec/specs/ui/spec.md

     Changements à appliquer :
     ✓ AJOUTÉ : Exigence de sélection de thème (2 scénarios)
     ✓ AJOUTÉ : Exigence d'accessibilité (1 scénario)

     Fusion en cours...
     ✓ openspec/specs/ui/spec.md mis à jour

     Le changement reste actif. Exécutez /opsx:archive lorsque vous êtes prêt à terminer.
```

**Quand l'utiliser manuellement :**

| Scénario | Utiliser sync ? |
|----------|-----------------|
| Changement de longue durée, souhaitez les spécifications dans le principal avant l'archivage | Oui |
| Plusieurs changements parallèles ont besoin des spécifications de base mises à jour | Oui |
| Souhaitez prévisualiser/réviser la fusion séparément | Oui |
| Changement rapide, passage direct à l'archivage | Non (l'archivage le gère) |

**Conseils :**
- La synchronisation est intelligente, pas un simple copier-coller
- Peut ajouter des scénarios à des exigences existantes sans duplication
- Le changement reste actif après la synchronisation (pas archivé)
- La plupart des utilisateurs n'auront jamais besoin d'appeler cette commande directement—l'archivage la propose si nécessaire

---

### `/opsx:archive`

Archive un changement terminé. Finalise le changement et le déplace dans le dossier d'archivage.

**Syntaxe :**
```
/opsx:archive [nom-du-changement]
```

**Arguments :**
| Argument | Requis | Description |
|----------|--------|-------------|
| `nom-du-changement` | Non | Quel changer archiver (déduit du contexte si non fourni) |

**Ce qu'elle fait :**
- Vérifie l'état de complétion des artefacts
- Vérifie la complétion des tâches (avertit si incomplet)
- Propose de synchroniser les spécifications delta si ce n'est pas déjà fait
- Déplace le dossier du changement dans `openspec/changes/archive/AAAA-MM-JJ-<nom>/`
- Préserve tous les artefacts pour la piste d'audit

**Exemple :**
```text
Vous : /opsx:archive

IA :  Archivage de add-dark-mode...

     État des artefacts :
     ✓ proposal.md existe
     ✓ specs/ existe
     ✓ design.md existe
     ✓ tasks.md existe (8/8 tâches terminées)

     Spécifications delta : Pas encore synchronisées
     → Synchroniser maintenant ? (recommandé)

Vous : Oui

IA :  ✓ Spécifications synchronisées vers openspec/specs/ui/spec.md
     ✓ Déplacé vers openspec/changes/archive/2025-01-24-add-dark-mode/

     Changement archivé avec succès.
```

**Conseils :**
- L'archivage ne bloquera pas sur des tâches incomplètes, mais avertira
- Les spécifications delta peuvent être synchronisées pendant l'archivage ou avant
- Les changements archivés sont préservés pour l'historique
- Utilisez `/opsx:verify` d'abord pour détecter les problèmes

---

### `/opsx:bulk-archive`

Archive plusieurs changements terminés en une fois. Gère les conflits de spécifications entre les changements.

**Syntaxe :**
```
/opsx:bulk-archive [noms-des-changements...]
```

**Arguments :**
| Argument | Requis | Description |
|----------|--------|-------------|
| `noms-des-changements` | Non | Changements spécifiques à archiver (demande de sélection si non fourni) |

**Ce qu'elle fait :**
- Liste tous les changements terminés
- Valide chaque changement avant l'archivage
- Détecte les conflits de spécifications entre les changements
- Résout les conflits en vérifiant ce qui est réellement implémenté
- Archive dans l'ordre chronologique

**Exemple :**
```
Vous : /opsx:bulk-archive

IA :  3 changements terminés trouvés :
     - add-dark-mode (8/8 tâches terminées)
     - fix-login-bug (3/3 tâches terminées)
     - update-footer (2/2 tâches terminées)

     Vérification des conflits de spécifications...
     ⚠ add-dark-mode et update-footer touchent tous deux specs/ui/

     Inspection de la base de code pour résoudre...
     Les deux changements sont implémentés. Fusion dans l'ordre chronologique :
     1. add-dark-mode (créé le 20 janvier)
     2. update-footer (créé le 22 janvier)

     Archiver les 3 changements ?

Vous : Oui

IA :  ✓ add-dark-mode archivé
     ✓ fix-login-bug archivé
     ✓ update-footer archivé
     Spécifications fusionnées : add-dark-mode → update-footer
```

**Conseils :**
- Utile pour les flux de travail parallèles
- La résolution de conflits est agentic (vérifie la base de code)
- Les changements sont archivés dans l'ordre de création
- Demande avant d'écraser le contenu des spécifications

---

### `/opsx:onboard`

Intégration guidée à travers le flux de travail complet d'OpenSpec. Un tutoriel interactif utilisant votre propre base de code.

**Syntaxe :**
```
/opsx:onboard
```

**Ce qu'elle fait :**
- Guide à travers un cycle de flux de travail complet avec narration
- Scanne votre base de code pour des opportunités d'amélioration réelles
- Crée un changement réel avec de vrais artefacts
- Implémente un travail réel (petits changements sûrs)
- Archive le changement terminé
- Explique chaque étape au fur et à mesure

**Phases :**
1. Accueil et analyse de la base de code
2. Trouver une opportunité d'amélioration
3. Créer un changement (`/opsx:new`)
4. Rédiger la proposition
5. Créer les spécifications
6. Rédiger la conception
7. Créer les tâches
8. Implémenter les tâches (`/opsx:apply`)
9. Vérifier l'implémentation
10. Archiver le changement
11. Résumé et prochaines étapes

**Exemple :**
```
Vous : /opsx:onboard

IA :  Bienvenue dans OpenSpec !

     Je vais vous guider à travers le flux de travail complet en utilisant votre propre base de code.
     Nous allons trouver quelque chose de petit à améliorer, créer un changement approprié pour cela,
     l'implémenter et l'archiver.

     Laissez-moi scanner votre base de code pour des opportunités...

     [Analyse la base de code]

     J'ai trouvé quelques choses sur lesquelles nous pourrions travailler :
     1. Ajouter la validation des entrées au formulaire de contact
     2. Améliorer les messages d'erreur dans le flux d'authentification
     3. Ajouter des états de chargement aux boutons asynchrones

     Qu'est-ce qui vous intéresse ? (ou suggérez autre chose)
```

**Conseils :**
- Idéal pour les nouveaux utilisateurs apprenant le flux de travail
- Utilise du vrai code, pas des exemples fictifs
- Crée un vrai changement que vous pouvez conserver ou abandonner
- Prend 15 à 30 minutes à compléter

---

## Syntaxe des commandes par outil IA

Différents outils IA utilisent des syntaxes de commandes légèrement différentes. Utilisez le format correspondant à votre outil :

| Outil | Exemple de syntaxe |
|-------|--------------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Trae | Invocations basées sur les compétences telles que `/openspec-propose`, `/openspec-apply-change` (pas de fichiers de commandes `opsx-*` générés) |

L'intention est la même pour tous les outils, mais la manière dont les commandes sont présentées peut varier selon l'intégration.

> **Note :** Les commandes GitHub Copilot (`.github/prompts/*.prompt.md`) ne sont disponibles que dans les extensions IDE (VS Code, JetBrains, Visual Studio). GitHub Copilot CLI ne prend actuellement pas en charge les fichiers de prompts personnalisés — voir [Outils pris en charge](supported-tools.md) pour les détails et les solutions de contournement.

---

## Commandes héritées

Ces commandes utilisent l'ancien flux de travail « tout-en-un ». Elles fonctionnent toujours, mais les commandes OPSX sont recommandées.

| Commande | Ce qu'elle fait |
|----------|-----------------|
| `/openspec:proposal` | Créer tous les artefacts en une seule fois (proposition, spécifications, conception, tâches) |
| `/openspec:apply` | Implémenter le changement |
| `/openspec:archive` | Archiver le changement |

**Quand utiliser les commandes héritées :**
- Projets existants utilisant l'ancien flux de travail
- Changements simples où vous n'avez pas besoin de création incrémentale d'artefacts
- Préférence pour l'approche tout ou rien

**Migration vers OPSX :**
Les changements hérités peuvent être poursuivis avec les commandes OPSX. La structure des artefacts est compatible.

---

## Dépannage

### « Changement non trouvé »

La commande n'a pas pu identifier le changement sur lequel travailler.

**Solutions :**
- Spécifiez explicitement le nom du changement : `/opsx:apply add-dark-mode`
- Vérifiez que le dossier du changement existe : `openspec list`
- Vérifiez que vous êtes dans le bon répertoire du projet

### « Aucun artefact prêt »

Tous les artefacts sont soit terminés, soit bloqués par des dépendances manquantes.

**Solutions :**
- Exécutez `openspec status --change <nom>` pour voir ce qui bloque
- Vérifiez si les artefacts requis existent
- Créez d'abord les artefacts de dépendance manquants

### « Schéma non trouvé »

Le schéma spécifié n'existe pas.

**Solutions :**
- Listez les schémas disponibles : `openspec schemas`
- Vérifiez l'orthographe du nom du schéma
- Créez le schéma s'il est personnalisé : `openspec schema init <nom>`

### Commandes non reconnues

L'outil IA ne reconnaît pas les commandes OpenSpec.

**Solutions :**
- Assurez-vous qu'OpenSpec est initialisé : `openspec init`
- Régénérez les compétences : `openspec update`
- Vérifiez que le répertoire `.claude/skills/` existe (pour Claude Code)
- Redémarrez votre outil IA pour prendre en compte les nouvelles compétences

### Artefacts mal générés

L'IA crée des artefacts incomplets ou incorrects.

**Solutions :**
- Ajoutez le contexte du projet dans `openspec/config.yaml`
- Ajoutez des règles spécifiques à chaque artefact pour des instructions précises
- Fournissez plus de détails dans la description de votre changement
- Utilisez `/opsx:continue` au lieu de `/opsx:ff` pour plus de contrôle

---

## Étapes suivantes

- [Flux de travail](workflows.md) - Modèles courants et quand utiliser chaque commande
- [CLI](cli.md) - Commandes terminal pour la gestion et la validation
- [Personnalisation](customization.md) - Créer des schémas et flux de travail personnalisés