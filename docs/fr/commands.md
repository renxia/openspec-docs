# Commandes

Ceci est la référence des commandes slash d'OpenSpec. Ces commandes sont appelées dans l'interface de chat de votre assistant de codage IA (par ex., Claude Code, Cursor, Windsurf).

Pour les modèles de workflow et quand utiliser chaque commande, voir [Workflows](workflows.md). Pour les commandes CLI, voir [CLI](cli.md).

## Référence rapide

### Chemin rapide par défaut (profil `core`)

| Commande | Objectif |
|----------|----------|
| `/opsx:propose` | Créer une modification et générer les artefacts de planification en une seule étape |
| `/opsx:explore` | Réfléchir à des idées avant de s'engager dans une modification |
| `/opsx:apply` | Implémenter les tâches de la modification |
| `/opsx:sync` | Fusionner les spécifications delta dans les spécifications principales |
| `/opsx:archive` | Archiver une modification terminée |

### Commandes de workflow étendues (sélection de workflow personnalisée)

| Commande | Objectif |
|----------|----------|
| `/opsx:new` | Démarrer une nouvelle structure de modification |
| `/opsx:continue` | Créer l'artefact suivant en fonction des dépendances |
| `/opsx:ff` | Avance rapide : créer tous les artefacts de planification à la fois |
| `/opsx:verify` | Valider que l'implémentation correspond aux artefacts |
| `/opsx:bulk-archive` | Archiver plusieurs modifications à la fois |
| `/opsx:onboard` | Tutoriel guidé à travers le workflow complet |

Le profil global par défaut est `core`. Pour activer les commandes de workflow étendues, exécutez `openspec config profile`, sélectionnez les workflows, puis exécutez `openspec update` dans votre projet.

---

## Référence des Commandes

### `/opsx:propose`

Créez une nouvelle modification et générez les artefacts de planification en une seule étape. C'est la commande de démarrage par défaut dans le profil `core`.

**Syntaxe :**
```text
/opsx:propose [nom-ou-description-de-la-modification]
```

**Arguments :**
| Argument | Requis | Description |
|----------|----------|-------------|
| `nom-ou-description-de-la-modification` | Non | Nom en kebab-case ou description en langage naturel de la modification |

**Ce qu'elle fait :**
- Crée `openspec/changes/<nom-de-la-modification>/`
- Génère les artefacts nécessaires avant l'implémentation (pour `spec-driven` : proposition, spécifications, conception, tâches)
- S'arrête lorsque la modification est prête pour `/opsx:apply`

**Exemple :**
```text
Vous : /opsx:propose add-dark-mode

IA :  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**Conseils :**
- Utilisez-la pour le chemin de bout en bout le plus rapide
- Si vous souhaitez un contrôle étape par étape des artefacts, activez les workflows étendus et utilisez `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

Réfléchissez à des idées, investiguez des problèmes et clarifiez les exigences avant de vous engager dans une modification.

**Syntaxe :**
```
/opsx:explore [sujet]
```

**Arguments :**
| Argument | Requis | Description |
|----------|----------|-------------|
| `sujet` | Non | Ce que vous souhaitez explorer ou investiguer |

**Ce qu'elle fait :**
- Ouvre une conversation exploratoire sans structure requise
- Investigue la base de code pour répondre aux questions
- Compare les options et les approches
- Crée des diagrammes visuels pour clarifier la réflexion
- Peut passer à `/opsx:propose` (par défaut) ou `/opsx:new` (workflow étendu) lorsque les idées se cristallisent

**Exemple :**
```text
Vous : /opsx:explore

IA :  What would you like to explore?

Vous : How should we handle authentication for the mobile app?

IA :  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

Vous : Let's go with JWT. Can we start a change for that?

IA :  Ready when you are. Run /opsx:propose add-jwt-auth to begin.
```

**Conseils :**
- À utiliser lorsque les exigences ne sont pas claires ou si vous avez besoin d'investiguer
- Aucun artefact n'est créé pendant l'exploration
- Utile pour comparer plusieurs approches avant de décider
- Peut lire des fichiers et rechercher dans la base de code

---

### `/opsx:new`

Démarrez un nouveau squelette de modification. Crée le dossier de la modification et attend que vous génériez les artefacts avec `/opsx:continue` ou `/opsx:ff`.

Cette commande fait partie de l'ensemble de workflows étendus (non inclus dans le profil `core` par défaut).

**Syntaxe :**
```
/opsx:new [nom-de-la-modification] [--schema <nom-du-schema>]
```

**Arguments :**
| Argument | Requis | Description |
|----------|----------|-------------|
| `nom-de-la-modification` | Non | Nom pour le dossier de la modification (demandé si non fourni) |
| `--schema` | Non | Schéma de workflow à utiliser (par défaut : depuis la config ou `spec-driven`) |

**Ce qu'elle fait :**
- Crée le répertoire `openspec/changes/<nom-de-la-modification>/`
- Crée le fichier de métadonnées `.openspec.yaml` dans le dossier de la modification
- Affiche le premier modèle d'artefact prêt à être créé
- Demande le nom de la modification et le schéma si non fournis

**Ce qu'elle crée :**
```
openspec/changes/<nom-de-la-modification>/
└── .openspec.yaml    # Métadonnées de la modification (schéma, date de création)
```

**Exemple :**
```
Vous : /opsx:new add-dark-mode

IA :  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**Conseils :**
- Utilisez des noms descriptifs : `add-feature`, `fix-bug`, `refactor-module`
- Évitez les noms génériques comme `update`, `changes`, `wip`
- Le schéma peut également être défini dans la configuration du projet (`openspec/config.yaml`)

---

### `/opsx:continue`

Créez l'artefact suivant dans la chaîne de dépendances. Crée un artefact à la fois pour une progression incrémentale.

**Syntaxe :**
```
/opsx:continue [nom-de-la-modification]
```

**Arguments :**
| Argument | Requis | Description |
|----------|----------|-------------|
| `nom-de-la-modification` | Non | Quelle modification continuer (déduit du contexte si non fourni) |

**Ce qu'elle fait :**
- Interroge le graphe de dépendances des artefacts
- Affiche quels artefacts sont prêts vs bloqués
- Crée le premier artefact prêt
- Lit les fichiers de dépendances pour le contexte
- Affiche ce qui devient disponible après la création

**Exemple :**
```
Vous : /opsx:continue

IA :  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: tasks
     Run /opsx:continue to create the next artifact.
```

**Conseils :**
- À utiliser lorsque vous souhaitez examiner chaque artefact avant de continuer
- Utile pour les modifications complexes où vous souhaitez garder le contrôle
- Plusieurs artefacts peuvent devenir prêts simultanément
- Vous pouvez modifier les artefacts créés avant de continuer

---

### `/opsx:ff`

Avance rapide à travers la création des artefacts. Crée tous les artefacts de planification en une seule fois.

**Syntaxe :**
```
/opsx:ff [nom-de-la-modification]
```

**Arguments :**
| Argument | Requis | Description |
|----------|----------|-------------|
| `nom-de-la-modification` | Non | Quelle modification accélérer (déduit du contexte si non fourni) |

**Ce qu'elle fait :**
- Crée tous les artefacts dans l'ordre des dépendances
- Suit la progression via une liste de tâches
- S'arrête lorsque tous les artefacts `apply-required` sont terminés
- Lit chaque dépendance avant de créer l'artefact suivant

**Exemple :**
```
Vous : /opsx:ff add-dark-mode

IA :  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**Conseils :**
- À utiliser lorsque vous avez une vision claire de ce que vous construisez
- Plus rapide que `/opsx:continue` pour les modifications simples
- Vous pouvez toujours modifier les artefacts par la suite
- Idéal pour les petites à moyennes fonctionnalités

---

### `/opsx:apply`

Implémentez les tâches de la modification. Travaille à travers la liste des tâches, écrit le code et coche les éléments.

**Syntaxe :**
```
/opsx:apply [nom-de-la-modification]
```

**Arguments :**
| Argument | Requis | Description |
|----------|----------|-------------|
| `nom-de-la-modification` | Non | Quelle modification implémenter (déduit du contexte si non fourni) |

**Ce qu'elle fait :**
- Lit `tasks.md` et identifie les tâches incomplètes
- Traite les tâches une par une
- Écrit le code, crée des fichiers, exécute des tests si nécessaire
- Marque les tâches comme terminées avec des cases à cocher `[x]`

**Exemple :**
```
Vous : /opsx:apply

IA :  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**Conseils :**
- Peut reprendre là où vous vous êtes arrêté en cas d'interruption
- À utiliser pour des modifications parallèles en spécifiant le nom de la modification
- L'état d'achèvement est suivi dans les cases à cocher de `tasks.md`

---

### `/opsx:verify`

Validez que l'implémentation correspond à vos artefacts de modification. Vérifie la complétude, la correction et la cohérence.

**Syntaxe :**
```
/opsx:verify [nom-de-la-modification]
```

**Arguments :**
| Argument | Requis | Description |
|----------|----------|-------------|
| `nom-de-la-modification` | Non | Quelle modification vérifier (déduit du contexte si non fourni) |

**Ce qu'elle fait :**
- Vérifie trois dimensions de la qualité de l'implémentation
- Recherche dans la base de code des preuves d'implémentation
- Signale les problèmes catégorisés comme CRITIQUE, AVERTISSEMENT ou SUGGESTION
- Ne bloque pas l'archivage, mais met en évidence les problèmes

**Dimensions de vérification :**

| Dimension | Ce qu'elle valide |
|-----------|-------------------|
| **Complétude** | Toutes les tâches effectuées, toutes les exigences implémentées, scénarios couverts |
| **Correction** | L'implémentation correspond à l'intention de la spécification, cas limites gérés |
| **Cohérence** | Les décisions de conception reflétées dans le code, modèles cohérents |

**Exemple :**
```
Vous : /opsx:verify

IA :  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**Conseils :**
- Exécutez-la avant l'archivage pour détecter les écarts tôt
- Les avertissements ne bloquent pas l'archivage mais indiquent des problèmes potentiels
- Utile pour examiner le travail de l'IA avant de s'engager
- Peut révéler des dérifs entre les artefacts et l'implémentation

---

### `/opsx:sync`

**Commande optionnelle.** Fusionnez les spécifications delta d'une modification dans les spécifications principales. L'archivage vous proposera de synchroniser si nécessaire, donc vous n'avez généralement pas besoin de l'exécuter manuellement.

**Syntaxe :**
```
/opsx:sync [nom-de-la-modification]
```

**Arguments :**
| Argument | Requis | Description |
|----------|----------|-------------|
| `nom-de-la-modification` | Non | Quelle modification synchroniser (déduit du contexte si non fourni) |

**Ce qu'elle fait :**
- Lit les spécifications delta du dossier de modification
- Analyse les sections AJOUTÉ/MODIFIÉ/SUPPRIMÉ/RENOMMÉ
- Fusionne les changements dans le répertoire principal `openspec/specs/`
- Préserve le contenu existant non mentionné dans le delta
- N'archive pas la modification (reste active)

**Exemple :**
```text
Vous : /opsx:sync

IA :  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**Quand l'utiliser manuellement :**

| Scénario | Utiliser sync ? |
|----------|-----------------|
| Modification de longue durée, vouloir les spécifications principales avant l'archivage | Oui |
| Plusieurs modifications parallèles ont besoin des spécifications de base mises à jour | Oui |
| Vouloir prévisualiser/examiner la fusion séparément | Oui |
| Modification rapide, passage direct à l'archivage | Non (l'archivage le gère) |

**Conseils :**
- La synchronisation est intelligente, pas un simple copier-coller
- Peut ajouter des scénarios aux exigences existantes sans duplication
- La modification reste active après la synchronisation (non archivée)
- La plupart des utilisateurs n'auront jamais besoin de l'appeler directement—l'archivage le propose si nécessaire

---

### `/opsx:archive`

Archivez une modification terminée. Finalise la modification et la déplace vers le dossier d'archive.

**Syntaxe :**
```
/opsx:archive [nom-de-la-modification]
```

**Arguments :**
| Argument | Requis | Description |
|----------|----------|-------------|
| `nom-de-la-modification` | Non | Quelle modification archiver (déduit du contexte si non fourni) |

**Ce qu'elle fait :**
- Vérifie l'état d'achèvement des artefacts
- Vérifie l'achèvement des tâches (avertit si incomplet)
- Propose de synchroniser les spécifications delta si ce n'est pas déjà fait
- Déplace le dossier de modification vers `openspec/changes/archive/YYYY-MM-DD-<nom>/`
- Préserve tous les artefacts pour la traçabilité

**Exemple :**
```text
Vous : /opsx:archive

IA :  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

Vous : Yes

IA :  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**Conseils :**
- L'archivage ne bloquera pas sur les tâches incomplètes, mais avertira
- Les spécifications delta peuvent être synchronisées pendant l'archivage ou au préalable
- Les modifications archivées sont conservées pour l'historique
- Utilisez `/opsx:verify` d'abord pour détecter les problèmes

---

### `/opsx:bulk-archive`

Archivez plusieurs modifications terminées à la fois. Gère les conflits de spécifications entre les modifications.

**Syntaxe :**
```
/opsx:bulk-archive [noms-des-modifications...]
```

**Arguments :**
| Argument | Requis | Description |
|----------|----------|-------------|
| `noms-des-modifications` | Non | Modifications spécifiques à archiver (propose une sélection si non fourni) |

**Ce qu'elle fait :**
- Liste toutes les modifications terminées
- Valide chaque modification avant l'archivage
- Détecte les conflits de spécifications entre les modifications
- Résout les conflits en vérifiant ce qui est réellement implémenté
- Archive dans l'ordre chronologique

**Exemple :**
```
Vous : /opsx:bulk-archive

IA :  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

Vous : Yes

IA :  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**Conseils :**
- Utile pour les flux de travail parallèles
- La résolution de conflits est agente (vérifie la base de code)
- Les modifications sont archivées dans l'ordre de création
- Demande confirmation avant d'écraser le contenu des spécifications

---

### `/opsx:onboard`

Intégration guidée à travers le workflow complet d'OpenSpec. Un tutoriel interactif utilisant votre base de code réelle.

**Syntaxe :**
```
/opsx:onboard
```

**Ce qu'elle fait :**
- Parcourt un cycle de workflow complet avec narration
- Analyse votre base de code pour de réelles opportunités d'amélioration
- Crée une modification réelle avec de vrais artefacts
- Implémente un travail réel (petites modifications sûres)
- Archive la modification terminée
- Explique chaque étape au fur et à mesure

**Phases :**
1. Bienvenue et analyse de la base de code
2. Recherche d'une opportunité d'amélioration
3. Création d'une modification (`/opsx:new`)
4. Rédaction de la proposition
5. Création des spécifications
6. Rédaction de la conception
7. Création des tâches
8. Implémentation des tâches (`/opsx:apply`)
9. Vérification de l'implémentation
10. Archivage de la modification
11. Résumé et prochaines étapes

**Exemple :**
```
Vous : /opsx:onboard

IA :  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**Conseils :**
- Idéal pour les nouveaux utilisateurs apprenant le workflow
- Utilise du vrai code, pas des exemples simplistes
- Crée une vraie modification que vous pouvez conserver ou abandonner
- Prend 15 à 30 minutes pour être complétée

---

## Syntaxe des commandes par outil d'IA

Différents outils d'IA utilisent une syntaxe de commande légèrement différente. Utilisez le format qui correspond à votre outil :

| Outil | Exemple de syntaxe |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Invocations basées sur les compétences comme `/skill:openspec-propose`, `/skill:openspec-apply-change` (pas de fichiers de commande `opsx-*` générés) |
| Trae | Invocations basées sur les compétences comme `/openspec-propose`, `/openspec-apply-change` (pas de fichiers de commande `opsx-*` générés) |

L'intention est la même pour tous les outils, mais la manière dont les commandes sont exposées peut varier selon l'intégration.

> **Remarque :** Les commandes GitHub Copilot (`.github/prompts/*.prompt.md`) ne sont disponibles que dans les extensions IDE (VS Code, JetBrains, Visual Studio). GitHub Copilot CLI ne prend actuellement pas en charge les fichiers de prompt personnalisés — voir [Outils pris en charge](supported-tools.md) pour les détails et les solutions de contournement.

---

## Commandes héritées

Ces commandes utilisent l'ancien flux de travail « tout en une fois ». Elles fonctionnent toujours, mais les commandes OPSX sont recommandées.

| Commande | Ce qu'elle fait |
|---------|--------------|
| `/openspec:proposal` | Créer tous les artefacts en une fois (proposition, spécifications, conception, tâches) |
| `/openspec:apply` | Implémenter la modification |
| `/openspec:archive` | Archiver la modification |

**Quand utiliser les commandes héritées :**
- Projets existants utilisant l'ancien flux de travail
- Modifications simples où la création incrémentale d'artefacts n'est pas nécessaire
- Préférence pour l'approche tout ou rien

**Migration vers OPSX :**
Les modifications héritées peuvent être poursuivies avec les commandes OPSX. La structure des artefacts est compatible.

---

## Dépannage

### "Modification non trouvée"

La commande n'a pas pu identifier la modification sur laquelle travailler.

**Solutions :**
- Spécifiez explicitement le nom de la modification : `/opsx:apply add-dark-mode`
- Vérifiez que le dossier de la modification existe : `openspec list`
- Assurez-vous d'être dans le bon répertoire de projet

### "Aucun artefact prêt"

Tous les artefacts sont soit terminés, soit bloqués par des dépendances manquantes.

**Solutions :**
- Exécutez `openspec status --change <nom>` pour voir ce qui bloque
- Vérifiez si les artefacts requis existent
- Créez d'abord les artefacts de dépendance manquants

### "Schéma non trouvé"

Le schéma spécifié n'existe pas.

**Solutions :**
- Listez les schémas disponibles : `openspec schemas`
- Vérifiez l'orthographe du nom du schéma
- Créez le schéma s'il est personnalisé : `openspec schema init <nom>`

### Commandes non reconnues

L'outil d'IA ne reconnaît pas les commandes OpenSpec.

**Solutions :**
- Assurez-vous qu'OpenSpec est initialisé : `openspec init`
- Régénérez les compétences : `openspec update`
- Vérifiez que le répertoire `.claude/skills/` existe (pour Claude Code)
- Redémarrez votre outil d'IA pour prendre en charge les nouvelles compétences

### Les artefacts ne se génèrent pas correctement

L'IA crée des artefacts incomplets ou incorrects.

**Solutions :**
- Ajoutez le contexte du projet dans `openspec/config.yaml`
- Ajoutez des règles par artefact pour des conseils spécifiques
- Fournissez plus de détails dans votre description de modification
- Utilisez `/opsx:continue` au lieu de `/opsx:ff` pour plus de contrôle

---

## Prochaines étapes

- [Flux de travail](workflows.md) - Modèles courants et quand utiliser chaque commande
- [CLI](cli.md) - Commandes terminal pour la gestion et la validation
- [Personnalisation](customization.md) - Créer des schémas et flux de travail personnalisés