# Référence CLI

La CLI OpenSpec (`openspec`) fournit des commandes terminal pour la configuration, la validation, l'inspection de l'état et la gestion des projets. Ces commandes complètent les commandes slash de l'IA (comme `/opsx:propose`) documentées dans [Commandes](commands.md).

## Résumé

| Catégorie | Commandes | Objectif |
|----------|----------|---------|
| **Configuration** | `init`, `update` | Initialiser et mettre à jour OpenSpec dans votre projet |
| **Navigation** | `list`, `view`, `show` | Explorer les changements et les spécifications |
| **Validation** | `validate` | Vérifier les changements et les spécifications pour des problèmes |
| **Cycle de vie** | `archive` | Finaliser les changements terminés |
| **Flux de travail** | `status`, `instructions`, `templates`, `schemas` | Support du flux de travail piloté par les artefacts |
| **Schémas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Créer et gérer des flux de travail personnalisés |
| **Configuration** | `config` | Afficher et modifier les paramètres |
| **Utilitaires** | `feedback`, `completion` | Retour d'information et intégration shell |

## Commandes pour Humains vs Agents

La plupart des commandes CLI sont conçues pour une **utilisation par des humains** dans un terminal. Certaines commandes supportent également une **utilisation par des agents/scripts** via une sortie JSON.

### Commandes Exclusivement pour Humains

Ces commandes sont interactives et conçues pour une utilisation en terminal :

| Commande | Objectif |
|----------|----------|
| `openspec init` | Initialiser le projet (invites interactives) |
| `openspec view` | Tableau de bord interactif |
| `openspec config edit` | Ouvrir la configuration dans un éditeur |
| `openspec feedback` | Soumettre des commentaires via GitHub |
| `openspec completion install` | Installer les complétions de shell |

### Commandes Compatibles avec les Agents

Ces commandes supportent la sortie `--json` pour une utilisation programmatique par des agents IA et des scripts :

| Commande | Utilisation Humaine | Utilisation Agent |
|----------|---------------------|-------------------|
| `openspec list` | Parcourir les changements/spécifications | `--json` pour des données structurées |
| `openspec show <item>` | Lire le contenu | `--json` pour l'analyse |
| `openspec validate` | Vérifier les problèmes | `--all --json` pour une validation en masse |
| `openspec status` | Voir la progression des artefacts | `--json` pour un état structuré |
| `openspec instructions` | Obtenir les prochaines étapes | `--json` pour les instructions de l'agent |
| `openspec templates` | Trouver les chemins des modèles | `--json` pour la résolution des chemins |
| `openspec schemas` | Lister les schémas disponibles | `--json` pour la découverte des schémas |

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

Le comportement par défaut utilise les paramètres globaux par défaut : profil `core`, livraison `both`, workflows `propose, explore, apply, archive`.

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
| `--force` | Nettoyage automatique des fichiers obsolètes sans invite |
| `--profile <profile>` | Remplacer le profil global pour cette exécution d'init (`core` ou `custom`) |

`--profile custom` utilise les workflows actuellement sélectionnés dans la configuration globale (`openspec config profile`).

**IDs d'outils supportés (`--tools`) :** `amazon-q`, `antigravity`, `auggie`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

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

# Ignorer les invites et nettoyer automatiquement les fichiers obsolètes
openspec init --force
```

**Ce qui est créé :**

```
openspec/
├── specs/              # Vos spécifications (source de vérité)
├── changes/            # Changements proposés
└── config.yaml         # Configuration du projet

.claude/skills/         # Compétences Claude Code (si claude sélectionné)
.cursor/skills/         # Compétences Cursor (si cursor sélectionné)
.cursor/commands/       # Commandes OPSX Cursor (si la livraison inclut les commandes)
... (autres configurations d'outils)
```

---

### `openspec update`

Met à jour les fichiers d'instructions d'OpenSpec après la mise à jour du CLI. Régénère les fichiers de configuration des outils IA en utilisant votre profil global actuel, les workflows sélectionnés et le mode de livraison.

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
| `--force` | Forcer la mise à jour même si les fichiers sont à jour |

**Exemple :**

```bash
# Mettre à jour les fichiers d'instructions après une mise à jour npm
npm update @fission-ai/openspec
openspec update
```

---

## Commandes de Navigation

### `openspec list`

Liste les changements ou les spécifications dans votre projet.

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
  add-dark-mode     Support du thème UI dark mode
  fix-login-bug     Gestion de l'expiration de session
```

---

### `openspec view`

Affiche un tableau de bord interactif pour explorer les spécifications et les changements.

```
openspec view
```

Ouvre une interface basée sur le terminal pour naviguer dans les spécifications et les changements de votre projet.

---

### `openspec show`

Affiche les détails d'un changement ou d'une spécification.

```
openspec show [item-name] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|--------|-------------|
| `item-name` | Non | Nom du changement ou de la spécification (invite si omis) |

**Options :**

| Option | Description |
|--------|-------------|
| `--type <type>` | Spécifier le type : `change` ou `spec` (détecté automatiquement si non ambigu) |
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

Valide les changements et les spécifications pour les problèmes structurels.

```
openspec validate [item-name] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|--------|-------------|
| `item-name` | Non | Élément spécifique à valider (invite si omis) |

**Options :**

| Option | Description |
|--------|-------------|
| `--all` | Valider tous les changements et spécifications |
| `--changes` | Valider tous les changements |
| `--specs` | Valider toutes les spécifications |
| `--type <type>` | Spécifier le type lorsque le nom est ambigu : `change` ou `spec` |
| `--strict` | Activer le mode de validation stricte |
| `--json` | Sortie au format JSON |
| `--concurrency <n>` | Nombre maximal de validations parallèles (par défaut : 6, ou variable d'environnement `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Désactiver les invites |

**Exemples :**

```bash
# Validation interactive
openspec validate

# Valider un changement spécifique
openspec validate add-dark-mode

# Valider tous les changements
openspec validate --changes

# Valider tout avec sortie JSON (pour CI/scripts)
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
        "warnings": ["design.md: section 'Technical Approach' manquante"]
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

## Commandes de Cycle de Vie

### `openspec archive`

Archive un changement terminé et fusionne les spécifications delta dans les spécifications principales.

```
openspec archive [change-name] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|--------|-------------|
| `change-name` | Non | Changement à archiver (invite si omis) |

**Options :**

| Option | Description |
|--------|-------------|
| `-y, --yes` | Ignorer les invites de confirmation |
| `--skip-specs` | Ignorer les mises à jour des spécifications (pour les changements d'infrastructure/outillage/documentation uniquement) |
| `--no-validate` | Ignorer la validation (nécessite une confirmation) |

**Exemples :**

```bash
# Archivage interactif
openspec archive

# Archiver un changement spécifique
openspec archive add-dark-mode

# Archiver sans invites (CI/scripts)
openspec archive add-dark-mode --yes

# Archiver un changement d'outillage qui n'affecte pas les spécifications
openspec archive update-ci-config --skip-specs
```

**Ce qu'il fait :**

1. Valide le changement (sauf si `--no-validate`)
2. Demande une confirmation (sauf si `--yes`)
3. Fusionne les spécifications delta dans `openspec/specs/`
4. Déplace le dossier du changement dans `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Commandes de Workflow

Ces commandes supportent le workflow OPSX piloté par les artefacts. Elles sont utiles tant pour les humains vérifiant la progression que pour les agents déterminant les prochaines étapes.

### `openspec status`

Affiche l'état d'achèvement des artefacts pour un changement.

```
openspec status [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--change <id>` | Nom du changement (invite si omis) |
| `--schema <name>` | Remplacement du schéma (détecté automatiquement depuis la config du changement) |
| `--json` | Sortie au format JSON |

**Exemples :**

```bash
# Vérification interactive de l'état
openspec status

# État pour un changement spécifique
openspec status --change add-dark-mode

# JSON pour l'utilisation par un agent
openspec status --change add-dark-mode --json
```

**Sortie (texte) :**

```
Changement : add-dark-mode
Schéma : spec-driven
Progression : 2/4 artefacts terminés

[x] proposal
[ ] design
[x] specs
[-] tasks (bloqué par : design)
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

Obtient des instructions enrichies pour créer un artefact ou appliquer des tâches. Utilisé par les agents IA pour comprendre quoi créer ensuite.

```
openspec instructions [artifact] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|--------|-------------|
| `artifact` | Non | ID de l'artefact : `proposal`, `specs`, `design`, `tasks`, ou `apply` |

**Options :**

| Option | Description |
|--------|-------------|
| `--change <id>` | Nom du changement (requis en mode non interactif) |
| `--schema <name>` | Remplacement du schéma |
| `--json` | Sortie au format JSON |

**Cas particulier :** Utilisez `apply` comme artefact pour obtenir les instructions de mise en œuvre des tâches.

**Exemples :**

```bash
# Obtenir les instructions pour l'artefact suivant
openspec instructions --change add-dark-mode

# Obtenir les instructions pour un artefact spécifique
openspec instructions design --change add-dark-mode

# Obtenir les instructions d'application/mise en œuvre
openspec instructions apply --change add-dark-mode

# JSON pour la consommation par un agent
openspec instructions design --change add-dark-mode --json
```

**La sortie inclut :**

- Le contenu du modèle pour l'artefact
- Le contexte du projet depuis la configuration
- Le contenu des artefacts dépendants
- Les règles par artefact depuis la configuration

---

### `openspec templates`

Affiche les chemins résolus des modèles pour tous les artefacts dans un schéma.

```
openspec templates [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--schema <name>` | Schéma à inspecter (par défaut : `spec-driven`) |
| `--json` | Sortie au format JSON |

**Exemples :**

```bash
# Afficher les chemins des modèles pour le schéma par défaut
openspec templates

# Afficher les modèles pour un schéma personnalisé
openspec templates --schema my-workflow

# JSON pour une utilisation programmatique
openspec templates --json
```

**Sortie (texte) :**

```
Schéma : spec-driven

Modèles :
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Liste les schémas de workflow disponibles avec leurs descriptions et flux d'artefacts.

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
Schémas disponibles :

  spec-driven (package)
    Le workflow de développement spec-driven par défaut
    Flux : proposal → specs → design → tasks

  my-custom (project)
    Workflow personnalisé pour ce projet
    Flux : research → proposal → tasks
```

---

## Commandes de Schéma

Commandes pour créer et gérer des schémas de workflow personnalisés.

### `openspec schema init`

Créer un nouveau schéma local au projet.

```
openspec schema init <name> [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|--------|-------------|
| `name` | Oui | Nom du schéma (kebab-case) |

**Options :**

| Option | Description |
|--------|-------------|
| `--description <text>` | Description du schéma |
| `--artifacts <list>` | Liste d'identifiants d'artefacts séparés par des virgules (par défaut : `proposal,specs,design,tasks`) |
| `--default` | Définir comme schéma par défaut du projet |
| `--no-default` | Ne pas demander de le définir par défaut |
| `--force` | Écraser un schéma existant |
| `--json` | Sortie au format JSON |

**Exemples :**

```bash
# Création interactive d'un schéma
openspec schema init research-first

# Création non interactive avec des artefacts spécifiques
openspec schema init rapid \
  --description "Workflow d'itération rapide" \
  --artifacts "proposal,tasks" \
  --default
```

**Ce qui est créé :**

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
|----------|--------|-------------|
| `source` | Oui | Schéma à copier |
| `name` | Non | Nouveau nom du schéma (par défaut : `<source>-custom`) |

**Options :**

| Option | Description |
|--------|-------------|
| `--force` | Écraser la destination existante |
| `--json` | Sortie au format JSON |

**Exemple :**

```bash
# Dupliquer le schéma intégré spec-driven
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
|----------|--------|-------------|
| `name` | Non | Schéma à valider (valide tous les schémas si omis) |

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

Afficher la source de résolution d'un schéma (utile pour déboguer la priorité).

```
openspec schema which [name] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|--------|-------------|
| `name` | Non | Nom du schéma |

**Options :**

| Option | Description |
|--------|-------------|
| `--all` | Lister tous les schémas avec leurs sources |
| `--json` | Sortie au format JSON |

**Exemple :**

```bash
# Vérifier d'où provient un schéma
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
3. Paquet : Schémas intégrés

---

## Commandes de Configuration

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

# Définir explicitement une valeur de chaîne
openspec config set user.name "Mon Nom" --string

# Supprimer un paramètre personnalisé
openspec config unset user.name

# Réinitialiser toute la configuration
openspec config reset --all --yes

# Éditer la configuration dans votre éditeur
openspec config edit

# Configurer le profil avec un assistant basé sur les actions
openspec config profile

# Préréglage rapide : basculer les workflows vers core (conserve le mode de livraison)
openspec config profile core
```

`openspec config profile` commence par un résumé de l'état actuel, puis vous permet de choisir :
- Changer la livraison + les workflows
- Changer uniquement la livraison
- Changer uniquement les workflows
- Conserver les paramètres actuels (quitter)

Si vous conservez les paramètres actuels, aucune modification n'est écrite et aucune invitation de mise à jour n'est affichée.
S'il n'y a pas de modification de configuration mais que les fichiers du projet actuel ne sont pas synchronisés avec votre profil/livraison globale, OpenSpec affichera un avertissement et suggérera d'exécuter `openspec update`.
Appuyer sur `Ctrl+C` annule également proprement le flux (sans trace de pile) et quitte avec le code `130`.
Dans la liste de contrôle des workflows, `[x]` signifie que le workflow est sélectionné dans la configuration globale. Pour appliquer ces sélections aux fichiers du projet, exécutez `openspec update` (ou choisissez `Appliquer les modifications à ce projet maintenant ?` lorsque vous êtes invité à l'intérieur d'un projet).

**Exemples interactifs :**

```bash
# Mise à jour de la livraison uniquement
openspec config profile
# choisir : Changer uniquement la livraison
# choisir la livraison : Compétences uniquement

# Mise à jour des workflows uniquement
openspec config profile
# choisir : Changer uniquement les workflows
# basculer les workflows dans la liste de contrôle, puis confirmer
```

---

## Commandes Utilitaires

### `openspec feedback`

Soumettre des commentaires sur OpenSpec. Crée un ticket GitHub.

```
openspec feedback <message> [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|--------|-------------|
| `message` | Oui | Message de feedback |

**Options :**

| Option | Description |
|--------|-------------|
| `--body <text>` | Description détaillée |

**Prérequis :** L'interface en ligne de commande GitHub (`gh`) doit être installée et authentifiée.

**Exemple :**

```bash
openspec feedback "Ajouter la prise en charge des types d'artefacts personnalisés" \
  --body "J'aimerais définir mes propres types d'artefacts au-delà de ceux intégrés."
```

---

### `openspec completion`

Gérer les complétions de shell pour l'interface en ligne de commande OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Sous-commandes :**

| Sous-commande | Description |
|---------------|-------------|
| `generate [shell]` | Générer le script de complétion vers la sortie standard |
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

## Codes de Sortie

| Code | Signification |
|------|---------------|
| `0` | Succès |
| `1` | Erreur (échec de validation, fichiers manquants, etc.) |

---

## Variables d'Environnement

| Variable | Description |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Définir sur `0` pour désactiver la télémétrie |
| `DO_NOT_TRACK` | Définir sur `1` pour désactiver la télémétrie (signal DNT standard) |
| `OPENSPEC_CONCURRENCY` | Concurrence par défaut pour la validation en masse (par défaut : 6) |
| `EDITOR` ou `VISUAL` | Éditeur pour `openspec config edit` |
| `NO_COLOR` | Désactiver la sortie colorée lorsque défini |

---

## Documentation Associée

- [Commandes](commands.md) - Commandes slash IA (`/opsx:propose`, `/opsx:apply`, etc.)
- [Workflows](workflows.md) - Modèles courants et quand utiliser chaque commande
- [Personnalisation](customization.md) - Créer des schémas et modèles personnalisés
- [Démarrage rapide](getting-started.md) - Guide de configuration initiale