# Commandes

Ceci est la référence des commandes slash d'OpenSpec. Ces commandes sont invoquées dans l'interface de chat de votre assistant de codage IA (par exemple Claude Code, Cursor, Windsurf).

Pour les modèles de flux de travail et savoir quand utiliser chaque commande, consultez [Flux de travail](workflows.md). Pour les commandes CLI, consultez [CLI](cli.md).

## Référence rapide

### Chemin rapide par défaut (profil `core`)

| Commande | Objectif |
|---------|---------|
| `/opsx:propose` | Créer une modification et générer les artefacts de planification en une seule étape |
| `/opsx:explore` | Réfléchir à des idées avant de s'engager à réaliser une modification |
| `/opsx:apply` | Mettre en œuvre les tâches de la modification |
| `/opsx:update` | Réviser les artefacts de planification d'une modification et garantir leur cohérence |
| `/opsx:sync` | Fusionner les spécifications delta dans les spécifications principales |
| `/opsx:archive` | Archiver une modification terminée |

### Commandes de flux de travail étendues (sélection de flux de travail personnalisée)

| Commande | Objectif |
|---------|---------|
| `/opsx:new` | Démarrer l'échafaudage d'une nouvelle modification |
| `/opsx:continue` | Créer le prochain artefact en fonction des dépendances |
| `/opsx:ff` | Avance rapide : créer tous les artefacts de planification en une seule fois |
| `/opsx:verify` | Valider que l'implémentation correspond aux artefacts |
| `/opsx:bulk-archive` | Archiver plusieurs modifications en une seule fois |
| `/opsx:onboard` | Tutoriel guidé à travers le flux de travail complet |

Le profil global par défaut est `core`. Pour activer les commandes de flux de travail étendues, exécutez `openspec config profile`, sélectionnez les flux de travail, puis exécutez `openspec update` dans votre projet.

---

## Référence des commandes

### `/opsx:propose`

Crée une nouvelle modification et génère les artefacts de planification en une seule étape. Il s'agit de la commande de démarrage par défaut dans le profil `core`.

**Syntaxe :**
```text
/opsx:propose [nom-ou-description-modification]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|-------------|-------------|
| `change-name-or-description` | Non | Nom en kebab-case ou description de modification en langage clair |

**Ce qu'il fait :**
- Crée `openspec/changes/<change-name>/`
- Génère les artefacts nécessaires avant l'implémentation (pour `spec-driven` : proposition, spécifications, conception, tâches)
- S'arrête lorsque la modification est prête pour `/opsx:apply`

**Exemple :**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**Conseils :**
- Utilisez ceci pour le chemin de bout en bout le plus rapide
- Si vous souhaitez un contrôle pas à pas des artefacts, activez les workflows étendus et utilisez `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **Commencez ici si vous n'êtes pas sûr.** Explore est un partenaire de réflexion sans risque : il lit votre base de code, compare les options et affine une idée floue en un plan concret avant toute modification. Il est inclus dans le profil par défaut. Pour le cas complet et plus d'exemples, consultez le guide [Explore First](explore.md).

Réfléchissez aux idées, étudiez les problèmes et clarifiez les exigences avant de vous engager dans une modification.

**Syntaxe :**
```
/opsx:explore [sujet]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|-------------|-------------|
| `topic` | Non | Ce que vous souhaitez explorer ou étudier |

**Ce qu'il fait :**
- Ouvre une conversation exploratoire sans structure requise
- Étudie la base de code pour répondre aux questions
- Compare les options et les approches
- Crée des diagrammes visuels pour clarifier la réflexion
- Peut passer à `/opsx:propose` (par défaut) ou `/opsx:new` (workflow étendu) lorsque les idées se cristallisent

**Exemple :**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT. Can we start a change for that?

AI:  Ready when you are. Run /opsx:propose add-jwt-auth to begin.
```

**Conseils :**
- Utilisez lorsque les exigences ne sont pas claires ou que vous avez besoin d'étudier
- Aucun artefact n'est créé pendant l'exploration
- Idéal pour comparer plusieurs approches avant de décider
- Peut lire des fichiers et rechercher dans la base de code

---

### `/opsx:new`

Démarre un nouveau squelette de modification. Crée le dossier de modification et attend que vous génériez les artefacts avec `/opsx:continue` ou `/opsx:ff`.

Cette commande fait partie de l'ensemble des workflows étendus (non incluse dans le profil `core` par défaut).

**Syntaxe :**
```
/opsx:new [nom-modification] [--schema <nom-schema>]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|-------------|-------------|
| `change-name` | Non | Nom du dossier de modification (demandé si non fourni) |
| `--schema` | Non | Schéma de workflow à utiliser (par défaut : depuis la config ou `spec-driven`) |

**Ce qu'il fait :**
- Crée le répertoire `openspec/changes/<change-name>/`
- Crée le fichier de métadonnées `.openspec.yaml` dans le dossier de modification
- Affiche le premier modèle d'artefact prêt à être créé
- Demande le nom de la modification et le schéma si non fournis

**Ce qu'il crée :**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Métadonnées de la modification (schéma, date de création)
```

**Exemple :**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
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

Crée l'artefact suivant dans la chaîne de dépendances. Crée un artefact à la fois pour une progression incrémentale.

**Syntaxe :**
```
/opsx:continue [nom-modification]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|-------------|-------------|
| `change-name` | Non | Quelle modification continuer (déduit du contexte si non fourni) |

**Ce qu'il fait :**
- Interroge le graphe de dépendances des artefacts
- Affiche les artefacts prêts vs bloqués
- Crée le premier artefact prêt
- Lit les fichiers de dépendances pour le contexte
- Affiche ce qui devient disponible après la création

**Exemple :**
```
You: /opsx:continue

AI:  Change: add-dark-mode

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
- Utilisez lorsque vous souhaitez examiner chaque artefact avant de continuer
- Idéal pour les modifications complexes où vous souhaitez avoir le contrôle
- Plusieurs artefacts peuvent devenir prêts simultanément
- Vous pouvez modifier les artefacts créés avant de continuer

---

### `/opsx:ff`

Avance rapide dans la création des artefacts. Crée tous les artefacts de planification en une seule fois.

**Syntaxe :**
```
/opsx:ff [nom-modification]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|-------------|-------------|
| `change-name` | Non | Quelle modification accélérer (déduit du contexte si non fourni) |

**Ce qu'il fait :**
- Crée tous les artefacts dans l'ordre des dépendances
- Suit la progression via une liste de tâches
- S'arrête lorsque tous les artefacts `apply-required` sont terminés
- Lit chaque dépendance avant de créer l'artefact suivant

**Exemple :**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**Conseils :**
- Utilisez lorsque vous avez une idée claire de ce que vous construisez
- Plus rapide que `/opsx:continue` pour les modifications simples
- Vous pouvez toujours modifier les artefacts par la suite
- Idéal pour les fonctionnalités de petite à moyenne taille

---

### `/opsx:apply`

Implémente les tâches de la modification. Traite la liste des tâches, écrit le code et coche les éléments.

**Syntaxe :**
```
/opsx:apply [nom-modification]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|-------------|-------------|
| `change-name` | Non | Quelle modification implémenter (déduit du contexte si non fourni) |

**Ce qu'il fait :**
- Lit `tasks.md` et identifie les tâches incomplètes
- Traite les tâches une par une
- Écrit du code, crée des fichiers, exécute des tests si nécessaire
- Marque les tâches comme terminées avec des cases à cocher `[x]`

**Exemple :**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

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
- Peut reprendre là où vous vous êtes arrêté si interrompu
- Utilisez pour les modifications parallèles en spécifiant le nom de la modification
- L'état d'avancement est suivi dans les cases à cocher de `tasks.md`

---

### `/opsx:update`

Réviser les artefacts de planification existants d'une modification et les maintenir cohérents entre eux. Artefacts de planification uniquement - il ne modifie jamais le code.

**Syntaxe :**
```text
/opsx:update [nom-modification]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|-------------|-------------|
| `change-name` | Non | Quelle modification mettre à jour (déduit du contexte si non fourni) |

**Ce qu'il fait :**
- Lit les artefacts de la modification via `openspec status --change <name> --json`
- Applique la révision demandée, ou examine les artefacts pour détecter des contradictions si vous n'en avez pas nommé une
- Réconcilie les autres artefacts existants dans toutes les directions (une modification de conception peut se répercuter sur la proposition)
- Confirme chaque modification avec vous avant d'écrire, un artefact à la fois
- Se termine en recommandant l'étape suivante : `/opsx:continue` (artefacts manquants), `/opsx:apply` (appliquer un plan révisé dans le code), ou `/opsx:archive` (tout est terminé)

**Exemple :**
```text
You: /opsx:update add-dark-mode - we're storing the theme in a cookie now, not localStorage

AI:  Reading add-dark-mode artifacts...

     The design references localStorage in two places; tasks 1.3 covers
     localStorage persistence; the proposal doesn't mention storage.

     Proposed revisions:
     1. design.md - swap localStorage decision for cookie storage
     2. tasks.md - reword task 1.3 to cookie persistence

     Apply revision 1? (design.md)
```

**Conseils :**
- Il ne créera pas les artefacts manquants - c'est `/opsx:continue`
- Si la modification a déjà été implémentée, suivez avec `/opsx:apply` pour que le code corresponde au plan révisé
- Si votre révision modifie l'*intention* de la modification, commencez plutôt par une nouvelle modification (voir [Quand mettre à jour vs. Commencer à neuf](opsx.md#when-to-update-vs-start-fresh))

---

### `/opsx:verify`

Valide que l'implémentation correspond à vos artefacts de modification. Vérifie l'exhaustivité, la correction et la cohérence.

**Syntaxe :**
```
/opsx:verify [nom-modification]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|-------------|-------------|
| `change-name` | Non | Quelle modification vérifier (déduit du contexte si non fourni) |

**Ce qu'il fait :**
- Vérifie trois dimensions de la qualité de l'implémentation
- Recherche dans la base de code des preuves d'implémentation
- Signale les problèmes catégorisés comme CRITIQUE, AVERTISSEMENT ou SUGGESTION
- Ne bloque pas l'archivage, mais signale les problèmes

**Dimensions de vérification :**

| Dimension | Ce qu'il valide |
|-----------|-----------------|
| **Exhaustivité** | Toutes les tâches terminées, toutes les exigences implémentées, scénarios couverts |
| **Correction** | L'implémentation correspond à l'intention des spécifications, les cas limites sont gérés |
| **Cohérence** | Les décisions de conception sont reflétées dans le code, les modèles sont cohérents |

**Exemple :**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

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
- Exécutez avant l'archivage pour détecter les incompatibilités tôt
- Les avertissements ne bloquent pas l'archivage mais indiquent des problèmes potentiels
- Idéal pour examiner le travail de l'IA avant de valider
- Peut révéler un décalage entre les artefacts et l'implémentation

---

### `/opsx:sync`

**Commande optionnelle.** Fusionne les spécifications delta d'une modification dans les spécifications principales. L'archivage proposera de synchroniser si nécessaire, vous n'avez donc généralement pas besoin de l'exécuter manuellement.

**Syntaxe :**
```
/opsx:sync [nom-modification]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|-------------|-------------|
| `change-name` | Non | Quelle modification synchroniser (déduit du contexte si non fourni) |

**Ce qu'il fait :**
- Lit les spécifications delta du dossier de modification
- Analyse les sections AJOUTÉ/MODIFIÉ/SUPPRIMÉ/RENOMMÉ
- Fusionne les modifications dans le répertoire principal `openspec/specs/`
- Préserve le contenu existant non mentionné dans le delta
- N'archive pas la modification (reste active)

**Exemple :**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

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
| Modification de longue durée, souhaite les spécifications dans le principal avant l'archivage | Oui |
| Plusieurs modifications parallèles nécessitent les spécifications de base mises à jour | Oui |
| Souhaite prévisualiser/examiner la fusion séparément | Oui |
| Modification rapide, passage direct à l'archivage | Non (l'archivage s'en charge) |

**Conseils :**
- La synchronisation est intelligente, pas un copier-coller
- Peut ajouter des scénarios aux exigences existantes sans dupliquer
- La modification reste active après synchronisation (non archivée)
- La plupart des utilisateurs n'auront jamais besoin de l'appeler directement—l'archivage propose si nécessaire

---

### `/opsx:archive`

Archive une modification terminée. Finalise la modification et la déplace dans le dossier d'archive.

**Syntaxe :**
```
/opsx:archive [nom-modification]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|-------------|-------------|
| `change-name` | Non | Quelle modification archiver (déduit du contexte si non fourni) |

**Ce qu'il fait :**
- Vérifie l'état d'avancement des artefacts
- Vérifie l'avancement des tâches (avertit si incomplet)
- Propose de synchroniser les spécifications delta si pas déjà synchronisées
- Déplace le dossier de modification vers `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Préserve tous les artefacts pour la piste d'audit

**Exemple :**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**Conseils :**
- L'archivage ne bloquera pas sur des tâches incomplètes, mais avertira
- Les spécifications delta peuvent être synchronisées pendant l'archivage ou avant
- Les modifications archivées sont préservées pour l'historique
- Utilisez d'abord `/opsx:verify` pour détecter les problèmes

---

### `/opsx:bulk-archive`

Archive plusieurs modifications terminées en une seule fois. Gère les conflits de spécifications entre les modifications.

**Syntaxe :**
```
/opsx:bulk-archive [noms-modifications...]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|-------------|-------------|
| `change-names` | Non | Modifications spécifiques à archiver (propose de sélectionner si non fourni) |

**Ce qu'il fait :**
- Liste toutes les modifications terminées
- Valide chaque modification avant l'archivage
- Détecte les conflits de spécifications entre les modifications
- Résout les conflits en vérifiant ce qui est réellement implémenté
- Archive dans l'ordre chronologique

**Exemple :**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
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

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**Conseils :**
- Idéal pour les flux de travail parallèles
- La résolution des conflits est autonome (vérifie la base de code)
- Les modifications sont archivées dans l'ordre de création
- Propose avant d'écraser le contenu des spécifications

---

### `/opsx:onboard`

Intégration guidée à travers le workflow OpenSpec complet. Un tutoriel interactif utilisant votre base de code réelle.

**Syntaxe :**
```
/opsx:onboard
```

**Ce qu'il fait :**
- Parcourt un cycle de workflow complet avec narration
- Analyse votre base de code pour de vraies opportunités d'amélioration
- Crée une modification réelle avec de vrais artefacts
- Implémente un travail réel (petites modifications sûres)
- Archive la modification terminée
- Explique chaque étape au fur et à mesure

**Phases :**
1. Accueil et analyse de la base de code
2. Trouver une opportunité d'amélioration
3. Créer une modification (`/opsx:new`)
4. Écrire la proposition
5. Créer les spécifications
6. Écrire la conception
7. Créer les tâches
8. Implémenter les tâches (`/opsx:apply`)
9. Vérifier l'implémentation
10. Archiver la modification
11. Résumé et prochaines étapes

**Exemple :**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

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
- Idéal pour les nouveaux utilisateurs qui apprennent le workflow
- Utilise du code réel, pas des exemples simplifiés
- Crée une modification réelle que vous pouvez conserver ou supprimer
- Prend 15 à 30 minutes à compléter

## Syntaxe des commandes par outil d'IA

Différents outils d'IA utilisent une syntaxe de commande légèrement différente. Utilisez le format correspondant à votre outil :

| Outil | Exemple de syntaxe |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | Invocations basées sur des compétences telles que `/openspec-propose`, `/openspec-apply-change` (pas de fichiers de commande `opsx-*` générés) |
| Codex | Invocations basées sur des compétences depuis `.codex/skills/openspec-*` (pas de fichiers de prompt `opsx-*` générés) |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi Code | Invocations basées sur des compétences telles que `/skill:openspec-propose`, `/skill:openspec-apply-change` (pas de fichiers de commande `opsx-*` générés) |
| Trae | `/opsx-propose`, `/opsx-apply` |

L'intention est la même pour tous les outils, mais la façon dont les commandes sont exposées peut varier selon l'intégration.

> **Remarque :** Les commandes GitHub Copilot (`.github/prompts/*.prompt.md`) sont uniquement disponibles dans les extensions IDE (VS Code, JetBrains, Visual Studio). L'interface en ligne de commande GitHub Copilot ne prend pas en charge les fichiers de prompt personnalisés pour le moment — consultez [Outils pris en charge](supported-tools.md) pour plus de détails et des solutions de contournement.

---

## Commandes héritées

Ces commandes utilisent l'ancien workflow « tout en une fois ». Elles fonctionnent toujours mais les commandes OPSX sont recommandées.

| Commande | Fonction |
|---------|--------------|
| `/openspec:proposal` | Créer tous les artefacts d'un coup (proposition, spécifications, conception, tâches) |
| `/openspec:apply` | Mettre en œuvre la modification |
| `/openspec:archive` | Archiver la modification |

**Quand utiliser les commandes héritées :**
- Projets existants utilisant l'ancien workflow
- Modifications simples pour lesquelles vous n'avez pas besoin de création incrémentielle d'artefacts
- Préférence pour l'approche « tout ou rien »

**Migration vers OPSX :**
Les modifications héritées peuvent être poursuivies avec les commandes OPSX. La structure des artefacts est compatible.

---

## Dépannage

### « Modification introuvable »

La commande n'a pas pu identifier quelle modification traiter.

**Solutions :**
- Indiquez explicitement le nom de la modification : `/opsx:apply add-dark-mode`
- Vérifiez que le dossier de la modification existe : `openspec list`
- Vérifiez que vous vous trouvez dans le bon répertoire de projet

### « Aucun artefact prêt »

Tous les artefacts sont soit terminés, soit bloqués par des dépendances manquantes.

**Solutions :**
- Exécutez `openspec status --change <name>` pour voir ce qui bloque
- Vérifiez si les artefacts requis existent
- Créez d'abord les artefacts de dépendance manquants

### « Schéma introuvable »

Le schéma spécifié n'existe pas.

**Solutions :**
- Listez les schémas disponibles : `openspec schemas`
- Vérifiez l'orthographe du nom du schéma
- Créez le schéma s'il est personnalisé : `openspec schema init <name>`

### Commandes non reconnues

L'outil d'IA ne reconnaît pas les commandes OpenSpec.

**Solutions :**
- Assurez-vous qu'OpenSpec est initialisé : `openspec init`
- Régénérez les compétences : `openspec update`
- Vérifiez que le répertoire `.claude/skills/` existe (pour Claude Code)
- Redémarrez votre outil d'IA pour prendre en compte les nouvelles compétences

### Les artefacts ne se génèrent pas correctement

L'IA crée des artefacts incomplets ou incorrects.

**Solutions :**
- Ajoutez le contexte du projet dans `openspec/config.yaml`
- Ajoutez des règles par artefact pour des consignes spécifiques
- Fournissez plus de détails dans la description de votre modification
- Utilisez `/opsx:continue` au lieu de `/opsx:ff` pour plus de contrôle

---

## Prochaines étapes

- [Workflows](workflows.md) - Modèles courants et cas d'utilisation de chaque commande
- [CLI](cli.md) - Commandes terminal pour la gestion et la validation
- [Personnalisation](customization.md) - Créer des schémas et des workflows personnalisés