# Commandes

Ceci est la référence pour les commandes slash d'OpenSpec. Ces commandes sont invoquées dans l'interface de chat de votre assistant de codage IA (par exemple, Claude Code, Cursor, Windsurf).

Pour les modèles de flux de travail et l'utilisation de chaque commande, voir [Workflows](workflows.md). Pour les commandes CLI, voir [CLI](cli.md).

## Référence Rapide

### Chemin Rapide par Défaut (`core` profile)

| Command | Purpose |
|---------|---------|
| `/opsx:propose` | Créer une modification et générer les artefacts de planification en une seule étape |
| `/opsx:explore` | Réfléchir sur des idées avant de s'engager dans une modification |
| `/opsx:apply` | Implémenter les tâches issues de la modification |
| `/opsx:sync` | Fusionner les spécifications Delta dans les spécifications principales |
| `/opsx:archive` | Archiver une modification terminée |

### Commandes de Flux de Travail Étendu (sélection de flux de travail personnalisé)

| Command | Purpose |
|---------|---------|
| `/opsx:new` | Démarrer un nouveau squelette de modification |
| `/opsx:continue` | Créer le prochain artefact en fonction des dépendances |
| `/opsx:ff` | Avance rapide (Fast-forward) : créer tous les artefacts de planification d'un coup |
| `/opsx:verify` | Valider que l'implémentation correspond aux artefacts |
| `/opsx:bulk-archive` | Archiver plusieurs modifications d'un coup |
| `/opsx:onboard` | Tutoriel guidé à travers le flux de travail complet |

Le profil global par défaut est `core`. Pour activer les commandes de flux de travail étendues, exécutez `openspec config profile`, sélectionnez les flux de travail, puis exécutez `openspec update` dans votre projet.

## Référence des commandes

### `/opsx:propose`

Crée une nouvelle modification et génère les artefacts de planification en une seule étape. C'est la commande de démarrage par défaut du profil `core`.

**Syntaxe :**
```text
/opsx:propose [change-name-or-description]
```

**Arguments :**
| Argument | Requis | Description |
|----------|--------|-------------|
| `change-name-or-description` | Non | Nom en kebab-case ou description de la modification en langage courant |

**Ce que cela fait :**
- Crée `openspec/changes/<change-name>/`
- Génère les artefacts nécessaires avant l'implémentation (pour le mode `spec-driven`: proposition, spécifications, conception, tâches)
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
- À utiliser pour le chemin le plus rapide de bout en bout
- Si vous souhaitez un contrôle granulaire des artefacts étape par étape, activez les workflows étendus et utilisez `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **Commencez ici si vous n'êtes pas sûr.** Explore est un partenaire de réflexion sans enjeu : il lit votre base de code, compare des options et affine une idée vague en un plan concret avant que toute modification n'existe. Il est inclus dans le profil par défaut. Pour le cas complet et plus d'exemples, consultez le guide [Explore First](explore.md).

Réfléchissez sur les idées, enquêtez sur les problèmes et clarifiez les exigences avant de vous engager à une modification.

**Syntaxe :**
```
/opsx:explore [topic]
```

**Arguments :**
| Argument | Requis | Description |
|----------|--------|-------------|
| `topic` | Non | Ce que vous souhaitez explorer ou enquêter |

**Ce que cela fait :**
- Ouvre une conversation exploratoire sans structure requise
- Enquête sur la base de code pour répondre aux questions
- Compare les options et les approches
- Crée des diagrammes visuels pour clarifier la pensée
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
- À utiliser lorsque les exigences ne sont pas claires ou que vous devez enquêter
- Aucun artefact n'est créé pendant l'exploration
- Bon pour comparer plusieurs approches avant de décider
- Peut lire des fichiers et rechercher la base de code

---

### `/opsx:new`

Démarre un nouveau échafaudage de modification. Crée le dossier de la modification et attend que vous génériez les artefacts avec `/opsx:continue` ou `/opsx:ff`.

Cette commande fait partie de l'ensemble de workflows étendus (non inclus dans le profil `core` par défaut).

**Syntaxe :**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Arguments :**
| Argument | Requis | Description |
|----------|--------|-------------|
| `change-name` | Non | Nom du dossier de la modification (saisi si non fourni) |
| `--schema` | Non | Schéma de workflow à utiliser (par défaut: depuis le config ou `spec-driven`) |

**Ce que cela fait :**
- Crée le répertoire `openspec/changes/<change-name>/`
- Crée le fichier de métadonnées `.openspec.yaml` dans le dossier de la modification
- Affiche le premier modèle d'artefact prêt à être créé
- Demande le nom de la modification et le schéma s'ils ne sont pas fournis

**Ce que cela crée :**
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
- Le schéma peut également être défini dans le fichier de configuration du projet (`openspec/config.yaml`)

---

### `/opsx:continue`

Crée le prochain artefact dans la chaîne de dépendances. Crée un artefact à la fois pour une progression incrémentale.

**Syntaxe :**
```
/opsx:continue [change-name]
```

**Arguments :**
| Argument | Requis | Description |
|----------|--------|-------------|
| `change-name` | Non | Quelle modification continuer (déduit du contexte si non fourni) |

**Ce que cela fait :**
- Interroge le graphe de dépendances des artefacts
- Affiche quels artefacts sont prêts ou bloqués
- Crée le premier artefact prêt
- Lit les fichiers de dépendance pour le contexte
- Montre ce qui devient disponible après la création

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
- À utiliser lorsque vous souhaitez réviser chaque artefact avant de continuer
- Bon pour les modifications complexes où vous voulez du contrôle
- Plusieurs artefacts peuvent devenir prêts simultanément
- Vous pouvez modifier les artefacts créés avant de continuer

---

### `/opsx:ff`

Avance rapidement la création des artefacts. Crée tous les artefacts de planification en une seule fois.

**Syntaxe :**
```
/opsx:ff [change-name]
```

**Arguments :**
| Argument | Requis | Description |
|----------|--------|-------------|
| `change-name` | Non | Quelle modification avancer rapidement (déduit du contexte si non fourni) |

**Ce que cela fait :**
- Crée tous les artefacts dans l'ordre de dépendance
- Suit la progression via une liste de tâches
- S'arrête lorsque tous les artefacts `apply-required` sont complets
- Lit chaque dépendance avant de créer le prochain artefact

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
- À utiliser lorsque vous avez une idée claire de ce que vous construisez
- Plus rapide que `/opsx:continue` pour les modifications simples
- Vous pouvez toujours modifier les artefacts par la suite
- Bon pour les fonctionnalités petites à moyennes

---

### `/opsx:apply`

Implémente les tâches de la modification. Parcourt la liste des tâches, écrit le code et coche les éléments.

**Syntaxe :**
```
/opsx:apply [change-name]
```

**Arguments :**
| Argument | Requis | Description |
|----------|--------|-------------|
| `change-name` | Non | Quelle modification implémenter (déduit du contexte si non fourni) |

**Ce que cela fait :**
- Lit `tasks.md` et identifie les tâches incomplètes
- Travaille sur les tâches une par une
- Écrit le code, crée des fichiers, exécute des tests au besoin
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
- Peut reprendre là où vous l'avez laissé si interrompu
- À utiliser pour des modifications parallèles en spécifiant le nom de la modification
- L'état d'achèvement est suivi dans les cases à cocher de `tasks.md`

---

### `/opsx:verify`

Valide que l'implémentation correspond aux artefacts de la modification. Vérifie l'exhaustivité, la correction et la cohérence.

**Syntaxe :**
```
/opsx:verify [change-name]
```

**Arguments :**
| Argument | Requis | Description |
|----------|--------|-------------|
| `change-name` | Non | Quelle modification vérifier (déduit du contexte si non fourni) |

**Ce que cela fait :**
- Vérifie trois dimensions de qualité d'implémentation
- Recherche dans la base de code des preuves d'implémentation
- Signale les problèmes classés comme CRITICAL, WARNING ou SUGGESTION
- Ne bloque pas l'archivage, mais signale les problèmes

**Dimensions de vérification :**

| Dimension | Ce qui est validé |
|-----------|-------------------|
| **Completeness** | Toutes les tâches sont faites, toutes les exigences implémentées, scénarios couverts |
| **Correctness** | L'implémentation correspond à l'intention de la spécification, cas limites gérés |
| **Coherence** | Les décisions de conception sont reflétées dans le code, les modèles sont cohérents |

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
- À exécuter avant l'archivage pour détecter les incohérences tôt
- Les avertissements ne bloquent pas l'archivage mais indiquent des problèmes potentiels
- Bon pour réviser le travail de l'IA avant de s'engager
- Peut révéler une dérive entre les artefacts et l'implémentation

---

### `/opsx:sync`

**Commande facultative.** Fusionne les spécifications delta d'une modification dans les spécifications principales. L'archivage demandera la synchronisation si nécessaire, vous n'avez donc généralement pas besoin de l'exécuter manuellement.

**Syntaxe :**
```
/opsx:sync [change-name]
```

**Arguments :**
| Argument | Requis | Description |
|----------|--------|-------------|
| `change-name` | Non | Quelle modification synchroniser (déduit du contexte si non fourni) |

**Ce que cela fait :**
- Lit les spécifications delta du dossier de la modification
- Analyse les sections ADDED/MODIFIED/REMOVED/RENAMED
- Fusionne les changements dans le répertoire principal `openspec/specs/`
- Préserve le contenu existant non mentionné dans le delta
- Ne déarchive pas la modification (elle reste active)

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

| Scénario | Utiliser sync? |
|----------|---------------|
| Modification longue, veut les spécifications dans le principal avant d'archiver | Oui |
| Plusieurs modifications parallèles ont besoin des spécifications de base mises à jour | Oui |
| Veut prévisualiser/réviser la fusion séparément | Oui |
| Modification rapide, allant directement à l'archivage | Non (l'archivage le gère) |

**Conseils :**
- Sync est intelligent, pas du copier-coller
- Peut ajouter des scénarios aux exigences existantes sans les dupliquer
- La modification reste active après la synchronisation (n'est pas archivée)
- La plupart des utilisateurs n'auront jamais besoin d'appeler ceci directement — l'archivage le demande si nécessaire

---

### `/opsx:archive`

Archive une modification terminée. Finalise la modification et la déplace dans le dossier d'archives.

**Syntaxe :**
```
/opsx:archive [change-name]
```

**Arguments :**
| Argument | Requis | Description |
|----------|--------|-------------|
| `change-name` | Non | Quelle modification archiver (déduit du contexte si non fourni) |

**Ce que cela fait :**
- Vérifie l'état d'achèvement des artefacts
- Vérifie l'achèvement des tâches (met en garde si incomplètes)
- Propose de synchroniser les spécifications delta si ce n'est pas déjà fait
- Déplace le dossier de la modification vers `openspec/changes/archive/YYYY-MM-DD-<name>/`
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
- L'archivage ne bloquera pas sur des tâches incomplètes, mais mettra en garde
- Les spécifications delta peuvent être synchronisées pendant l'archivage ou au préalable
- Les modifications archivées sont préservées pour l'historique
- Utilisez `/opsx:verify` d'abord pour détecter les problèmes

---

### `/opsx:bulk-archive`

Archive plusieurs modifications terminées en une seule fois. Gère les conflits de spécifications entre les modifications.

**Syntaxe :**
```
/opsx:bulk-archive [change-names...]
```

**Arguments :**
| Argument | Requis | Description |
|----------|--------|-------------|
| `change-names` | Non | Modifications spécifiques à archiver (demande de sélection si non fournies) |

**Ce que cela fait :**
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
- Bon pour les flux de travail parallèles
- La résolution des conflits est agentique (vérifie la base de code)
- Les modifications sont archivées dans l'ordre de création
- Demande confirmation avant d'écraser le contenu des spécifications

---

### `/opsx:onboard`

Parcours guidé du workflow OpenSpec complet. Un tutoriel interactif utilisant votre base de code réelle.

**Syntaxe :**
```
/opsx:onboard
```

**Ce que cela fait :**
- Parcourt un cycle de workflow complet avec narration
- Scanne votre base de code pour des opportunités d'amélioration réelles
- Crée une modification réelle avec de vrais artefacts
- Implémente du travail réel (modifications petites et sûres)
- Archive la modification terminée
- Explique chaque étape au fur et à mesure qu'elle se produit

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
- Le meilleur pour les nouveaux utilisateurs apprenant le workflow
- Utilise du code réel, pas des exemples jouets
- Crée une modification réelle que vous pouvez garder ou jeter
- Prend 15 à 30 minutes à compléter

## Syntaxe des commandes par outil IA

Différents outils d'IA utilisent légèrement différentes syntaxes de commande. Utilisez le format qui correspond à votre outil :

| Outil | Exemple de syntaxe |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Invocations basées sur des compétences telles que `/skill:openspec-propose`, `/skill:openspec-apply-change` (sans fichiers de commandes `opsx-*` générés) |
| Trae | Invocations basées sur des compétences telles que `/openspec-propose`, `/openspec-apply-change` (sans fichiers de commandes `opsx-*` générés) |

L'intention est la même entre les outils, mais la manière dont les commandes sont présentées peut varier selon l'intégration.

> **Note :** Les commandes GitHub Copilot (`.github/prompts/*.prompt.md`) ne sont disponibles que dans les extensions IDE (VS Code, JetBrains, Visual Studio). Le CLI de GitHub Copilot ne prend pas actuellement en charge les fichiers de prompts personnalisés — consultez [Supported Tools](supported-tools.md) pour plus de détails et des solutions de contournement.

---

## Commandes Héritées (Legacy Commands)

Ces commandes utilisent l'ancien flux de travail « tout en une fois ». Elles fonctionnent toujours, mais les commandes OPSX sont recommandées.

| Commande | Ce que cela fait |
|---------|--------------|
| `/openspec:proposal` | Crée tous les artefacts d'un coup (proposition, spécifications, conception, tâches) |
| `/openspec:apply` | Met en œuvre le changement |
| `/openspec:archive` | Archive le changement |

**Quand utiliser les commandes héritées :**
- Les projets existants utilisant l'ancien flux de travail
- Des changements simples où vous n'avez pas besoin d'une création d'artefacts incrémentielle
- Une préférence pour l'approche tout ou rien

**Migration vers OPSX :**
Les changements hérités peuvent être poursuivis avec les commandes OPSX. La structure des artefacts est compatible.

---

## Dépannage (Troubleshooting)

### « Change not found » (Changement non trouvé)

La commande n'a pas pu identifier sur quel changement travailler.

**Solutions :**
- Spécifiez explicitement le nom du changement : `/opsx:apply add-dark-mode`
- Vérifiez que le dossier de changement existe : `openspec list`
- Assurez-vous d'être dans le bon répertoire de projet

### « No artifacts ready » (Aucun artefact prêt)

Tous les artefacts sont soit terminés, soit bloqués par des dépendances manquantes.

**Solutions :**
- Exécutez `openspec status --change <name>` pour voir ce qui bloque
- Vérifiez si les artefacts requis existent
- Créez d'abord les artefacts de dépendance manquants

### « Schema not found » (Schéma non trouvé)

Le schéma spécifié n'existe pas.

**Solutions :**
- Listez les schémas disponibles : `openspec schemas`
- Vérifiez l'orthographe du nom du schéma
- Créez le schéma s'il est personnalisé : `openspec schema init <name>`

### Commandes non reconnues (Commands not recognized)

L'outil IA ne reconnaît pas les commandes OpenSpec.

**Solutions :**
- Assurez-vous qu'OpenSpec est initialisé : `openspec init`
- Régénérez les compétences : `openspec update`
- Vérifiez que le répertoire `.claude/skills/` existe (pour Claude Code)
- Redémarrez votre outil IA pour qu'il prenne en compte les nouvelles compétences

### Artefacts non générés correctement (Artifacts not generating properly)

L'IA crée des artefacts incomplets ou incorrects.

**Solutions :**
- Ajoutez le contexte du projet dans `openspec/config.yaml`
- Ajoutez des règles par artefact pour un guidage spécifique
- Fournissez plus de détails dans votre description de changement
- Utilisez `/opsx:continue` au lieu de `/opsx:ff` pour plus de contrôle

---

## Prochaines Étapes (Next Steps)

- [Workflows](workflows.md) - Modèles courants et quand utiliser chaque commande
- [CLI](cli.md) - Commandes de terminal pour la gestion et la validation
- [Customization](customization.md) - Créer des schémas et des flux de travail personnalisés