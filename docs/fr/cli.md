# Référence CLI

L'interface en ligne de commande OpenSpec (`openspec`) fournit des commandes terminal pour la configuration de projet, la validation, l'inspection de l'état et la gestion. Ces commandes complètent les commandes slash d'IA (comme `/opsx:propose`) documentées dans [Commands](commands.md).

## Résumé

| Catégorie | Commandes | Objectif |
|-----------|-----------|----------|
| **Configuration** | `init`, `update` | Initialiser et mettre à jour OpenSpec dans votre projet |
| **Espaces de travail (bêta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace open` | Configurer la planification entre des dépôts ou dossiers liés |
| **Navigation** | `list`, `view`, `show` | Explorer les modifications et les spécifications |
| **Validation** | `validate` | Vérifier les modifications et spécifications pour détecter les problèmes |
| **Cycle de vie** | `archive` | Finaliser les modifications terminées |
| **Flux de travail** | `status`, `instructions`, `templates`, `schemas` | Support du flux de travail basé sur les artefacts |
| **Schémas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Créer et gérer des flux de travail personnalisés |
| **Configuration** | `config` | Afficher et modifier les paramètres |
| **Utilitaires** | `feedback`, `completion` | Retour d'information et intégration shell |

---

## Commandes Humaines vs Agents

La plupart des commandes CLI sont conçues pour une **utilisation humaine** dans un terminal. Certaines commandes prennent également en charge une **utilisation agent/script** via une sortie JSON.

### Commandes pour Humains Uniquement

Ces commandes sont interactives et conçues pour une utilisation en terminal :

| Commande | But |
|----------|-----|
| `openspec init` | Initialiser le projet (prompts interactifs) |
| `openspec view` | Tableau de bord interactif |
| `openspec config edit` | Ouvrir la configuration dans l'éditeur |
| `openspec feedback` | Soumettre des commentaires via GitHub |
| `openspec completion install` | Installer les complétions de shell |

### Commandes Compatibles Agents

Ces commandes prennent en charge la sortie `--json` pour une utilisation programmatique par les agents IA et les scripts :

| Commande | Utilisation Humaine | Utilisation Agent |
|----------|---------------------|-------------------|
| `openspec list` | Parcourir les changements/spécifications | `--json` pour des données structurées |
| `openspec show <item>` | Lire le contenu | `--json` pour l'analyse |
| `openspec validate` | Vérifier les problèmes | `--all --json` pour la validation en masse |
| `openspec status` | Voir la progression des artefacts | `--json` pour un statut structuré |
| `openspec instructions` | Obtenir les prochaines étapes | `--json` pour les instructions de l'agent |
| `openspec templates` | Trouver les chemins des modèles | `--json` pour la résolution des chemins |
| `openspec schemas` | Lister les schémas disponibles | `--json` pour la découverte des schémas |
| `openspec workspace setup --no-interactive` | Créer un espace de travail avec des entrées explicites | `--json` pour une sortie de configuration structurée |
| `openspec workspace list` | Parcourir les espaces de travail connus | `--json` pour des objets d'espace de travail typés |
| `openspec workspace link` | Lier un dépôt ou un dossier | `--json` pour une sortie de lien structurée |
| `openspec workspace relink` | Réparer un chemin lié | `--json` pour une sortie de lien structurée |
| `openspec workspace doctor` | Vérifier un espace de travail | `--json` pour une sortie de statut structurée |

---

## Options Globales

Ces options fonctionnent avec toutes les commandes :

| Option | Description |
|--------|-------------|
| `--version`, `-V` | Afficher le numéro de version |
| `--no-color` | Désactiver la sortie en couleur |
| `--help`, `-h` | Afficher l'aide pour la commande |

---

## Commandes de Configuration

### `openspec init`

Initialise OpenSpec dans votre projet. Crée la structure de dossiers et configure les intégrations des outils IA.

Le comportement par défaut utilise les valeurs par défaut de la configuration globale : profil `core`, livraison `both`, workflows `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|--------|-------------|
| `path` | Non | Répertoire cible (par défaut : répertoire courant) |

**Options :**

| Option | Description |
|--------|-------------|
| `--tools <list>` | Configurer les outils IA de manière non interactive. Utilisez `all`, `none`, ou une liste séparée par des virgules |
| `--force` | Nettoyer automatiquement les fichiers hérités sans confirmation |
| `--profile <profile>` | Remplacer le profil global pour cette exécution de `init` (`core` ou `custom`) |

`--profile custom` utilise les workflows actuellement sélectionnés dans la configuration globale (`openspec config profile`).

**IDs d'outils supportés (`--tools`) :** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**Exemples :**

```bash
# Initialisation interactive
openspec init

# Initialiser dans un répertoire spécifique
openspec init ./my-project

# Non interactif : configurer pour Claude et Cursor
openspec init --tools claude,cursor

# Configurer pour tous les outils supportés
openspec init --tools all

# Remplacer le profil pour cette exécution
openspec init --profile core

# Ignorer les prompts et nettoyer automatiquement les fichiers hérités
openspec init --force
```

**Ce qu'il crée :**

```
openspec/
├── specs/              # Vos spécifications (source de vérité)
├── changes/            # Changements proposés
└── config.yaml         # Configuration du projet

.claude/skills/         # Compétences Claude Code (si claude sélectionné)
.cursor/skills/         # Compétences Cursor (si cursor sélectionné)
.cursor/commands/       # Commandes OPSX Cursor (si la livraison inclut des commandes)
... (autres configurations d'outils)
```

---

### `openspec update`

Met à jour les fichiers d'instructions d'OpenSpec après la mise à niveau de la CLI. Régénère les fichiers de configuration des outils IA en utilisant votre profil global actuel, les workflows sélectionnés et le mode de livraison.

```
openspec update [path] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|--------|-------------|
| `path` | Non | Répertoire cible (par défaut : répertoire courant) |

**Options :**

| Option | Description |
|--------|-------------|
| `--force` | Forcer la mise à jour même lorsque les fichiers sont à jour |

**Exemple :**

```bash
# Mettre à jour les fichiers d'instructions après une mise à jour npm
npm update @fission-ai/openspec
openspec update
```

---

## Commandes d'Espace de Travail

Les commandes d'espace de travail sont en développement actif et ne sont pas encore prêtes à l'emploi. Ne construisez pas d'automatisation, d'intégrations ou de workflows de longue durée sur cette surface de commande ; le comportement des commandes, les fichiers d'état et la sortie JSON peuvent changer à tout moment.

Les espaces de travail de coordination sont des foyers de planification pour le travail qui s'étend sur plusieurs dépôts ou dossiers. La visibilité de l'espace de travail n'est pas un engagement de changement : liez les dépôts ou dossiers qu'OpenSpec doit connaître, puis créez des changements lorsque vous êtes prêt à planifier un travail spécifique.

### `openspec workspace setup`

Crée un espace de travail dans l'emplacement standard d'espace de travail OpenSpec et lie au moins un dépôt ou dossier existant.

```bash
openspec workspace setup [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--name <name>` | Nom de l'espace de travail. Les noms doivent être en kebab-case |
| `--link <path>` | Lier un dépôt ou dossier existant et déduire le nom du lien à partir du nom du dossier |
| `--link <name>=<path>` | Lier un dépôt ou dossier existant avec un nom de lien explicite |
| `--opener <id>` | Stocker un ouvreur préféré lors de la configuration non interactive : `codex`, `claude`, `github-copilot`, ou `editor` |
| `--no-interactive` | Désactiver les prompts ; nécessite `--name` et au moins un `--link` |
| `--json` | Sortie JSON ; nécessite `--no-interactive` |

**Exemples :**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

La configuration interactive demande un ouvreur préféré et le stocke dans l'état local de l'espace de travail sur la machine. La configuration non interactive stocke un ouvreur préféré uniquement lorsque `--opener` est fourni ; sinon, `workspace open` invite plus tard dans les terminaux interactifs lorsqu'un ouvreur supporté est disponible, ou demande aux scripts de passer `--agent <tool>` ou `--editor`.

### `openspec workspace list`

Liste les espaces de travail OpenSpec connus à partir du registre local.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

La liste affiche l'emplacement de chaque espace de travail et les dépôts ou dossiers liés. Les enregistrements périmés du registre sont signalés mais non modifiés.

### `openspec workspace link`

Enregistre un dépôt ou dossier existant pour un espace de travail.

```bash
openspec workspace link [name] <path> [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--workspace <name>` | Sélectionner un espace de travail connu à partir du registre local |
| `--json` | Sortie JSON |
| `--no-interactive` | Désactiver les prompts de sélection d'espace de travail |

**Exemples :**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

Le chemin doit déjà exister. Les chemins relatifs sont résolus par rapport au répertoire courant de la commande avant qu'OpenSpec ne stocke le chemin absolu vérifié dans l'état local de l'espace de travail sur la machine. Les chemins liés peuvent être des dépôts complets, des paquets, des services, des applications ou des dossiers sans état `openspec/` local au dépôt.

### `openspec workspace relink`

Réparer ou modifier le chemin local pour un lien existant.

```bash
openspec workspace relink <name> <path> [options]
```

Le chemin doit déjà exister. Relink met à jour uniquement le chemin local sur la machine pour le nom de lien stable.

### `openspec workspace doctor`

Vérifie ce qu'un espace de travail peut résoudre sur la machine actuelle.

```bash
openspec workspace doctor [options]
```

Doctor affiche l'emplacement de l'espace de travail, le chemin de planification, les dépôts ou dossiers liés, les chemins manquants, les chemins des spécifications locales au dépôt lorsqu'ils sont présents, et les corrections suggérées. Il signale uniquement les problèmes ; il ne les répare pas automatiquement.

Les commandes qui nécessitent un espace de travail utilisent l'espace de travail courant lorsqu'elles sont exécutées depuis un dossier ou sous-répertoire d'espace de travail. Depuis un autre emplacement, passez `--workspace <name>`, sélectionnez-le à partir du sélecteur dans un terminal interactif, ou reposez-vous sur le seul espace de travail connu lorsqu'il en existe exactement un. En mode `--json` ou `--no-interactive`, une sélection ambiguë échoue avec une erreur de statut structurée et suggère `--workspace <name>`.

Les réponses JSON utilisent des objets typés plus des tableaux `status`. Les données principales se trouvent dans `workspace`, `workspaces` ou `link` ; les avertissements et erreurs se trouvent dans `status`.

### `openspec workspace open`

Ouvre un ensemble de travail d'espace de travail via l'ouvreur préféré stocké, une substitution d'agent pour une session, ou le mode éditeur VS Code.

```bash
openspec workspace open [name] [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--workspace <name>` | Alias pour le nom positionnel de l'espace de travail |
| `--agent <tool>` | Substitution d'agent pour une session : `codex`, `claude`, ou `github-copilot` |
| `--editor` | Ouvrir le fichier d'espace de travail VS Code maintenu comme un espace de travail d'éditeur normal |
| `--no-interactive` | Désactiver les prompts de sélection d'espace de travail et d'ouvreur |

**Exemples :**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex
openspec workspace open --editor
```

`workspace open` utilise l'espace de travail courant lorsqu'il est exécuté à l'intérieur d'un, sélectionne automatiquement le seul espace de travail connu lorsqu'il est exécuté ailleurs, et demande à l'utilisateur de choisir lorsque plusieurs espaces de travail sont connus. `--agent` et `--editor` ne modifient pas l'ouvreur préféré stocké. Passer les deux substitutions d'ouvreur est une erreur ; choisissez soit `--agent <tool>` soit `--editor`.

OpenSpec maintient `<workspace-name>.code-workspace` à la racine de l'espace de travail pour les ouvertures VS Code et GitHub Copilot-in-VS-Code. Ce fichier est local à la machine et ignoré par défaut avec une entrée `.gitignore` spécifique `<workspace-name>.code-workspace`, afin que les fichiers `*.code-workspace` créés par l'utilisateur restent éligibles au suivi.

L'espace de travail VS Code maintenu inclut la racine de coordination comme `.` plus les dépôts ou dossiers liés valides comme racines supplémentaires. VS Code affiche ces entrées comme un espace de travail multi-racine.

L'ouverture de l'espace de travail racine prend en charge l'exploration et la planification à travers les dépôts ou dossiers liés. Les modifications d'implémentation ne doivent commencer qu'après une demande explicite de l'utilisateur et un workflow d'implémentation OpenSpec normal.

---

## Commandes de Navigation

### `openspec list`

Lister les changements ou les spécifications de votre projet.

```
openspec list [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--specs` | Lister les spécifications au lieu des changements |
| `--changes` | Lister les changements (par défaut) |
| `--sort <order>` | Trier par `recent` (par défaut) ou `name` |
| `--json` | Sortie au format JSON |

**Exemples :**

```bash
# Lister tous les changements actifs
openspec list

# Lister toutes les spécifications
openspec list --specs

# Sortie JSON pour les scripts
openspec list --json
```

**Sortie (texte) :**

```
Changements actifs :
  add-dark-mode     Support du changement de thème d'interface
  fix-login-bug     Gestion du délai d'expiration de session
```

---

### `openspec view`

Afficher un tableau de bord interactif pour explorer les spécifications et les changements.

```
openspec view
```

Ouvre une interface basée sur le terminal pour naviguer dans les spécifications et les changements de votre projet.

---

### `openspec show`

Afficher les détails d'un changement ou d'une spécification.

```
openspec show [nom-élément] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|--------|-------------|
| `nom-élément` | Non | Nom du changement ou de la spécification (invite si omis) |

**Options :**

| Option | Description |
|--------|-------------|
| `--type <type>` | Spécifier le type : `change` ou `spec` (détection automatique si non ambigu) |
| `--json` | Sortie au format JSON |
| `--no-interactive` | Désactiver les invites |

**Options spécifiques aux changements :**

| Option | Description |
|--------|-------------|
| `--deltas-only` | Afficher uniquement les spécifications delta (mode JSON) |

**Options spécifiques aux spécifications :**

| Option | Description |
|--------|-------------|
| `--requirements` | Afficher uniquement les exigences, exclure les scénarios (mode JSON) |
| `--no-scenarios` | Exclure le contenu des scénarios (mode JSON) |
| `-r, --requirement <id>` | Afficher une exigence spécifique par son index basé sur 1 (mode JSON) |

**Exemples :**

```bash
# Sélection interactive
openspec show

# Afficher un changement spécifique
openspec show add-dark-mode

# Afficher une spécification spécifique
openspec show auth --type spec

# Sortie JSON pour l'analyse
openspec show add-dark-mode --json
```

---

## Commandes de Validation

### `openspec validate`

Valider les changements et les spécifications pour les problèmes de structure.

```
openspec validate [nom-élément] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|--------|-------------|
| `nom-élément` | Non | Élément spécifique à valider (invite si omis) |

**Options :**

| Option | Description |
|--------|-------------|
| `--all` | Valider tous les changements et spécifications |
| `--changes` | Valider tous les changements |
| `--specs` | Valider toutes les spécifications |
| `--type <type>` | Spécifier le type lorsque le nom est ambigu : `change` ou `spec` |
| `--strict` | Activer le mode de validation strict |
| `--json` | Sortie au format JSON |
| `--concurrency <n>` | Nombre maximum de validations en parallèle (par défaut : 6, ou variable d'environnement `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Désactiver les invites |

**Exemples :**

```bash
# Validation interactive
openspec validate

# Valider un changement spécifique
openspec validate add-dark-mode

# Valider tous les changements
openspec validate --changes

# Valider tout avec une sortie JSON (pour CI/scripts)
openspec validate --all --json

# Validation stricte avec parallélisme accru
openspec validate --all --strict --concurrency 12
```

**Sortie (texte) :**

```
Validation de add-dark-mode...
  ✓ proposal.md valide
  ✓ specs/ui/spec.md valide
  ⚠ design.md : section "Technical Approach" manquante

1 avertissement trouvé
```

**Sortie (JSON) :**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md : section 'Technical Approach' manquante"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## Commandes de cycle de vie

### `openspec archive`

Archiver une modification terminée et fusionner les spécifications delta dans les spécifications principales.

```
openspec archive [change-name] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|----------|-------------|
| `change-name` | Non | Modification à archiver (invite si omis) |

**Options :**

| Option | Description |
|--------|-------------|
| `-y, --yes` | Ignorer les invites de confirmation |
| `--skip-specs` | Ignorer les mises à jour des spécifications (pour les modifications d'infrastructure/outillage/documentation uniquement) |
| `--no-validate` | Ignorer la validation (nécessite une confirmation) |

**Exemples :**

```bash
# Archive interactive
openspec archive

# Archiver une modification spécifique
openspec archive add-dark-mode

# Archiver sans invites (CI/scripts)
openspec archive add-dark-mode --yes

# Archiver une modification d'outillage sans impact sur les spécifications
openspec archive update-ci-config --skip-specs
```

**Ce qu'elle fait :**

1. Valide la modification (sauf `--no-validate`)
2. Invite à confirmer (sauf `--yes`)
3. Fusionne les spécifications delta dans `openspec/specs/`
4. Déplace le dossier de modification vers `openspec/changes/archive/YYYY-MM-DD-<nom>/`

---

## Commandes de workflow

Ces commandes prennent en charge le workflow OPSX axé sur les artefacts. Elles sont utiles aussi bien pour les humains vérifiant la progression que pour les agents déterminant les prochaines étapes.

### `openspec status`

Afficher l'état de complétion des artefacts pour une modification.

```
openspec status [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--change <id>` | Nom de la modification (invite si omis) |
| `--schema <name>` | Remplacement du schéma (détecté automatiquement à partir de la configuration de la modification) |
| `--json` | Sortie au format JSON |

**Exemples :**

```bash
# Vérification interactive de l'état
openspec status

# État pour une modification spécifique
openspec status --change add-dark-mode

# JSON pour utilisation par un agent
openspec status --change add-dark-mode --json
```

**Sortie (texte) :**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

**Sortie (JSON) :**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done"},
    {"id": "design", "outputPath": "design.md", "status": "ready"},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done"},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

Obtenir des instructions enrichies pour créer un artefact ou appliquer des tâches. Utilisé par les agents IA pour comprendre quoi créer ensuite.

```
openspec instructions [artifact] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|----------|-------------|
| `artifact` | Non | ID de l'artefact : `proposal`, `specs`, `design`, `tasks`, ou `apply` |

**Options :**

| Option | Description |
|--------|-------------|
| `--change <id>` | Nom de la modification (requis en mode non interactif) |
| `--schema <name>` | Remplacement du schéma |
| `--json` | Sortie au format JSON |

**Cas particulier :** Utilisez `apply` comme artefact pour obtenir les instructions d'implémentation des tâches.

**Exemples :**

```bash
# Obtenir les instructions pour le prochain artefact
openspec instructions --change add-dark-mode

# Obtenir les instructions pour un artefact spécifique
openspec instructions design --change add-dark-mode

# Obtenir les instructions d'application/implémentation
openspec instructions apply --change add-dark-mode

# JSON pour consommation par un agent
openspec instructions design --change add-dark-mode --json
```

**La sortie comprend :**

- Le contenu du modèle pour l'artefact
- Le contexte du projet depuis la configuration
- Le contenu des artefacts dépendants
- Les règles par artefact depuis la configuration

---

### `openspec templates`

Afficher les chemins résolus des modèles pour tous les artefacts d'un schéma.

```
openspec templates [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--schema <name>` | Schéma à inspecter (défaut : `spec-driven`) |
| `--json` | Sortie au format JSON |

**Exemples :**

```bash
# Afficher les chemins des modèles pour le schéma par défaut
openspec templates

# Afficher les modèles pour un schéma personnalisé
openspec templates --schema my-workflow

# JSON pour utilisation programmatique
openspec templates --json
```

**Sortie (texte) :**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Lister les schémas de workflow disponibles avec leurs descriptions et flux d'artefacts.

```
openspec schemas [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--json` | Sortie au format JSON |

**Exemple :**

```bash
openspec schemas
```

**Sortie :**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

---

## Commandes de schéma

Commandes pour créer et gérer des schémas de workflow personnalisés.

### `openspec schema init`

Créer un nouveau schéma local au projet.

```
openspec schema init <name> [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|----------|-------------|
| `name` | Oui | Nom du schéma (kebab-case) |

**Options :**

| Option | Description |
|--------|-------------|
| `--description <text>` | Description du schéma |
| `--artifacts <list>` | IDs d'artefacts séparés par des virgules (défaut : `proposal,specs,design,tasks`) |
| `--default` | Définir comme schéma par défaut du projet |
| `--no-default` | Ne pas proposer de définir comme schéma par défaut |
| `--force` | Écraser un schéma existant |
| `--json` | Sortie au format JSON |

**Exemples :**

```bash
# Création interactive d'un schéma
openspec schema init research-first

# Non interactif avec des artefacts spécifiques
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**Ce qu'il crée :**

```
openspec/schemas/<name>/
├── schema.yaml           # Définition du schéma
└── templates/
    ├── proposal.md       # Modèle pour chaque artefact
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Copier un schéma existant dans votre projet pour le personnaliser.

```
openspec schema fork <source> [name] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|----------|-------------|
| `source` | Oui | Schéma à copier |
| `name` | Non | Nouveau nom du schéma (défaut : `<source>-custom`) |

**Options :**

| Option | Description |
|--------|-------------|
| `--force` | Écraser la destination existante |
| `--json` | Sortie au format JSON |

**Exemple :**

```bash
# Forker le schéma intégré spec-driven
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Valider la structure et les modèles d'un schéma.

```
openspec schema validate [name] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|----------|-------------|
| `name` | Non | Schéma à valider (valide tous si omis) |

**Options :**

| Option | Description |
|--------|-------------|
| `--verbose` | Afficher les étapes de validation détaillées |
| `--json` | Sortie au format JSON |

**Exemple :**

```bash
# Valider un schéma spécifique
openspec schema validate my-workflow

# Valider tous les schémas
openspec schema validate
```

---

### `openspec schema which`

Afficher la source de résolution d'un schéma (utile pour le débogage de la priorité).

```
openspec schema which [name] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|----------|-------------|
| `name` | Non | Nom du schéma |

**Options :**

| Option | Description |
|--------|-------------|
| `--all` | Lister tous les schémas avec leurs sources |
| `--json` | Sortie au format JSON |

**Exemple :**

```bash
# Vérifier la source d'un schéma
openspec schema which spec-driven
```

**Sortie :**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Priorité des schémas :**

1. Projet : `openspec/schemas/<name>/`
2. Utilisateur : `~/.local/share/openspec/schemas/<name>/`
3. Package : Schémas intégrés

## Commandes de configuration

### `openspec config`

Afficher et modifier la configuration globale d'OpenSpec.

```
openspec config <subcommand> [options]
```

**Sous-commandes :**

| Sous-commande | Description |
|---------------|-------------|
| `path` | Afficher l'emplacement du fichier de configuration |
| `list` | Afficher tous les paramètres actuels |
| `get <key>` | Obtenir une valeur spécifique |
| `set <key> <value>` | Définir une valeur |
| `unset <key>` | Supprimer une clé |
| `reset` | Réinitialiser aux valeurs par défaut |
| `edit` | Ouvrir dans `$EDITOR` |
| `profile [preset]` | Configurer le profil de workflow de manière interactive ou via un préréglage |

**Exemples :**

```bash
# Afficher le chemin du fichier de configuration
openspec config path

# Lister tous les paramètres
openspec config list

# Obtenir une valeur spécifique
openspec config get telemetry.enabled

# Définir une valeur
openspec config set telemetry.enabled false

# Définir explicitement une valeur de type chaîne
openspec config set user.name "Mon Nom" --string

# Supprimer un paramètre personnalisé
openspec config unset user.name

# Réinitialiser toute la configuration
openspec config reset --all --yes

# Modifier la configuration dans votre éditeur
openspec config edit

# Configurer le profil avec un assistant basé sur les actions
openspec config profile

# Préréglage rapide : basculer les workflows sur core (conserve le mode de livraison)
openspec config profile core
```

`openspec config profile` commence par un résumé de l'état actuel, puis vous permet de choisir :
- Modifier la livraison + les workflows
- Modifier uniquement la livraison
- Modifier uniquement les workflows
- Conserver les paramètres actuels (quitter)

Si vous conservez les paramètres actuels, aucune modification n'est écrite et aucune invite de mise à jour n'est affichée.
S'il n'y a aucun changement de configuration mais que les fichiers du projet actuel sont désynchronisés de votre profil/livraison global, OpenSpec affichera un avertissement et suggérera d'exécuter `openspec update`.
Appuyer sur `Ctrl+C` annule également le flux proprement (sans trace de pile) et quitte avec le code `130`.
Dans la liste de contrôle des workflows, `[x]` signifie que le workflow est sélectionné dans la configuration globale. Pour appliquer ces sélections aux fichiers du projet, exécutez `openspec update` (ou choisissez `Appliquer les modifications à ce projet maintenant ?` lorsque vous y êtes invité à l'intérieur d'un projet).

**Exemples interactifs :**

```bash
# Mise à jour de la livraison uniquement
openspec config profile
# choisir : Modifier uniquement la livraison
# choisir la livraison : Skills only

# Mise à jour des workflows uniquement
openspec config profile
# choisir : Modifier uniquement les workflows
# basculer les workflows dans la liste de contrôle, puis confirmer
```

---

## Commandes utilitaires

### `openspec feedback`

Soumettre des commentaires sur OpenSpec. Crée une issue GitHub.

```
openspec feedback <message> [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|--------|-------------|
| `message` | Oui | Message de commentaire |

**Options :**

| Option | Description |
|--------|-------------|
| `--body <text>` | Description détaillée |

**Prérequis :** GitHub CLI (`gh`) doit être installé et authentifié.

**Exemple :**

```bash
openspec feedback "Ajouter la prise en charge des types d'artefacts personnalisés" \
  --body "Je souhaiterais définir mes propres types d'artefacts au-delà de ceux intégrés."
```

---

### `openspec completion`

Gérer les complétions de shell pour le CLI OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Sous-commandes :**

| Sous-commande | Description |
|---------------|-------------|
| `generate [shell]` | Sortir le script de complétion sur stdout |
| `install [shell]` | Installer la complétion pour votre shell |
| `uninstall [shell]` | Supprimer les complétions installées |

**Shells supportés :** `bash`, `zsh`, `fish`, `powershell`

**Exemples :**

```bash
# Installer les complétions (détection automatique du shell)
openspec completion install

# Installer pour un shell spécifique
openspec completion install zsh

# Générer le script pour une installation manuelle
openspec completion generate bash > ~/.bash_completion.d/openspec

# Désinstaller
openspec completion uninstall
```

---

## Codes de sortie

| Code | Signification |
|------|---------------|
| `0` | Succès |
| `1` | Erreur (échec de validation, fichiers manquants, etc.) |

---

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Définir à `0` pour désactiver la télémétrie |
| `DO_NOT_TRACK` | Définir à `1` pour désactiver la télémétrie (signal DNT standard) |
| `OPENSPEC_CONCURRENCY` | Concurrence par défaut pour la validation par lot (défaut : 6) |
| `EDITOR` ou `VISUAL` | Éditeur pour `openspec config edit` |
| `NO_COLOR` | Désactiver la sortie en couleur lorsqu'il est défini |

---

## Documentation associée

- [Commandes](commands.md) - Commandes slash IA (`/opsx:propose`, `/opsx:apply`, etc.)
- [Workflows](workflows.md) - Modèles courants et quand utiliser chaque commande
- [Personnalisation](customization.md) - Créer des schémas et modèles personnalisés
- [Démarrage](getting-started.md) - Guide de configuration initiale