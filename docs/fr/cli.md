# Référence du CLI

Le CLI OpenSpec (`openspec`) fournit des commandes terminal pour la configuration de projet, la validation, l'inspection de statut et la gestion. Ces commandes complètent les commandes slash de l'IA (comme `/opsx:propose`) documentées dans [Commands](commands.md).

## Résumé

| Catégorie | Commandes | Objet |
|----------|----------|---------|
| **Setup** | `init`, `update` | Initialiser et mettre à jour OpenSpec dans votre projet |
| **Workspaces (bêta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace update`, `workspace open` | Configurer des vues locales sur des dépôts ou dossiers liés |
| **Shared context (bêta)** | `context-store setup`, `context-store register`, `context-store unregister`, `context-store remove`, `context-store list`, `context-store doctor`, `initiative create`, `initiative show`, `initiative list` | Gérer les enregistrements locaux du context-store et le contexte durable des initiatives |
| **Browsing** | `list`, `view`, `show` | Explorer les changements et les spécifications |
| **Validation** | `validate` | Vérifier les changements et spécifications pour les problèmes |
| **Lifecycle** | `archive` | Finaliser les changements terminés |
| **Workflow** | `new change`, `set change`, `status`, `instructions`, `templates`, `schemas` | Support de workflow basé sur les artefacts |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Créer et gérer des workflows personnalisés |
| **Config** | `config` | Afficher et modifier les paramètres |
| **Utility** | `feedback`, `completion` | Retour d'information et intégration shell |

---

## Commandes Humaines vs Agents

La plupart des commandes CLI sont conçues pour une **utilisation humaine** dans un terminal. Certaines commandes supportent également l'**utilisation agent/script** via une sortie JSON.

### Commandes exclusivement humaines

Ces commandes sont interactives et conçues pour une utilisation en terminal :

| Commande | Objectif |
|----------|----------|
| `openspec init` | Initialiser le projet (prompts interactifs) |
| `openspec view` | Tableau de bord interactif |
| `openspec config edit` | Ouvrir la configuration dans l'éditeur |
| `openspec feedback` | Soumettre des commentaires via GitHub |
| `openspec completion install` | Installer les complétions shell |

### Commandes compatibles avec les agents

Ces commandes supportent une sortie `--json` pour une utilisation programmatique par les agents IA et les scripts :

| Commande | Utilisation humaine | Utilisation agent |
|----------|---------------------|-------------------|
| `openspec list` | Parcourir les modifications/spécifications | `--json` pour des données structurées |
| `openspec show <item>` | Lire le contenu | `--json` pour l'analyse |
| `openspec validate` | Vérifier les problèmes | `--all --json` pour une validation par lot |
| `openspec status` | Voir la progression des artefacts | `--json` pour un statut structuré |
| `openspec instructions` | Obtenir les prochaines étapes | `--json` pour des instructions agent |
| `openspec templates` | Trouver les chemins des templates | `--json` pour la résolution de chemin |
| `openspec schemas` | Lister les schémas disponibles | `--json` pour la découverte de schémas |
| `openspec workspace setup --no-interactive` | Créer un espace de travail avec des entrées explicites | `--json` pour une sortie de configuration structurée |
| `openspec workspace list` | Parcourir les espaces de travail connus | `--json` pour des objets espace de travail typés |
| `openspec workspace link` | Lier un dépôt ou un dossier | `--json` pour une sortie de liaison structurée |
| `openspec workspace relink` | Réparer un chemin lié | `--json` pour une sortie de liaison structurée |
| `openspec workspace doctor` | Vérifier un espace de travail | `--json` pour une sortie de statut structurée |
| `openspec workspace update` | Actualiser les directives locales et les compétences des agents de l'espace de travail | `--tools` sélectionne les agents ; le profil sélectionne les workflows |
| `openspec context-store setup <id>` | Créer un magasin de contexte local | `--json` avec des entrées explicites pour une sortie de configuration structurée |
| `openspec context-store register <path>` | Enregistrer un magasin de contexte existant | `--json` pour une sortie d'enregistrement structurée |
| `openspec context-store unregister <id>` | Oublier un enregistrement de magasin de contexte local | `--json` pour une sortie de nettoyage structurée |
| `openspec context-store remove <id>` | Supprimer le dossier d'un magasin de contexte local enregistré | `--yes --json` pour une suppression non interactive |
| `openspec context-store list` | Parcourir les magasins de contexte enregistrés | `--json` pour des enregistrements structurés |
| `openspec context-store doctor` | Vérifier la configuration du magasin local | `--json` pour des diagnostics structurés |
| `openspec initiative list` | Parcourir les initiatives partagées | `--json` pour des enregistrements d'initiatives structurés |
| `openspec initiative show <id>` | Résoudre une initiative | `--json` pour des chemins canoniques et des métadonnées |
| `openspec new change <id>` | Créer une structure de modification locale au dépôt | `--json`, plus `--initiative` pour des liens de coordination partagés |
| `openspec set change <id>` | Mettre à jour les métadonnées d'une modification enregistrée | `--json`, plus `--initiative` pour des liens de coordination partagés |

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
| `--tools <list>` | Configurer les outils IA de manière non interactive. Utiliser `all`, `none`, ou une liste séparée par des virgules |
| `--force` | Nettoyer automatiquement les fichiers hérités sans confirmation |
| `--profile <profile>` | Remplacer le profil globale pour cette exécution de `init` (`core` ou `custom`) |

`--profile custom` utilise les workflows actuellement sélectionnés dans la configuration globale (`openspec config profile`).

**IDs d'outils supportés (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**Exemples :**

```bash
# Initialisation interactive
openspec init

# Initialiser dans un répertoire spécifique
openspec init ./mon-projet

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
├── changes/            # Modifications proposées
└── config.yaml         # Configuration du projet

.claude/skills/         # Compétences Claude Code (si claude sélectionné)
.cursor/skills/         # Compétences Cursor (si cursor sélectionné)
.cursor/commands/       # Commandes OPSX Cursor (si la livraison inclut des commandes)
... (autres configurations d'outils)
```

---

### `openspec update`

Met à jour les fichiers d'instruction d'OpenSpec après une mise à niveau de la CLI. Régénère les fichiers de configuration des outils IA en utilisant votre profil globale actuel, les workflows sélectionnés et le mode de livraison.

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
# Mettre à jour les fichiers d'instruction après une mise à jour npm
npm update @fission-ai/openspec
openspec update
```

---

## Commandes d'Espace de Travail

Les commandes d'espace de travail sont en version bêta. Le modèle de vue local ci-dessous est l'orientation actuelle, mais l'automatisation externe, les intégrations et les workflows de longue durée doivent toujours considérer que le comportement des commandes, les fichiers d'état et la sortie JSON sont susceptibles d'évoluer.

Les espaces de travail de coordination sont des vues locales à la machine sur des dépôts ou dossiers liés. La visibilité d'un espace de travail ne signifie pas l'engagement sur une modification : liez les dépôts ou dossiers qu'OpenSpec doit connaître, puis créez des modifications lorsque vous êtes prêt à planifier un travail spécifique.

### `openspec workspace setup`

Crée un espace de travail à l'emplacement standard d'OpenSpec et lie au moins un dépôt ou dossier existant.

```bash
openspec workspace setup [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--name <name>` | Nom de l'espace de travail. Les noms doivent être en kebab-case |
| `--link <path>` | Lier un dépôt ou dossier existant et déduire le nom de la liaison à partir du nom du dossier |
| `--link <name>=<path>` | Lier un dépôt ou dossier existant avec un nom de liaison explicite |
| `--opener <id>` | Stocker un ouvreur préféré lors d'une configuration non interactive : `codex-cli`, `claude`, `github-copilot`, ou `editor` |
| `--tools <tools>` | Installer des compétences OpenSpec locales à l'espace de travail pour les agents. Utiliser `all`, `none`, ou des IDs d'outils séparés par des virgules |
| `--no-interactive` | Désactiver les prompts ; nécessite `--name` et au moins un `--link` |
| `--json` | Sortie JSON ; nécessite `--no-interactive` |

**Exemples :**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli
openspec workspace setup --no-interactive --name platform --link /repos/api --tools codex,claude
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

La configuration interactive demande un ouvreur préféré et peut installer des compétences OpenSpec locales à l'espace de travail pour les agents sélectionnés. La configuration non interactive stocke un ouvreur préféré uniquement lorsque `--opener` est fourni ; sinon, `workspace open` demandera plus tard dans les terminaux interactifs lorsqu'un ouvreur supporté est disponible, ou demandera aux scripts de passer `--agent <tool>` ou `--editor`.

L'installation des compétences d'espace de travail se limite aux compétences dans cette tranche bêta : même si la livraison globale est `commands` ou `both`, la configuration de l'espace de travail écrit les dossiers de compétences des agents à la racine de l'espace de travail et ne crée pas de fichiers de commande slash. Le profil globale actif choisit les compétences de workflow à installer ; `--tools` choisit quels agents les reçoivent. Si `--tools` est omis dans la configuration non interactive, aucune compétence n'est installée et `workspace update --tools <ids>` peut les ajouter plus tard.

### `openspec workspace list`

Liste les espaces de travail OpenSpec connus à partir du registre local.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

La liste affiche l'emplacement de chaque espace de travail et les dépôts ou dossiers liés. Les enregistrements de registre périmés sont signalés mais non modifiés.

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

Le chemin doit déjà exister. Les chemins relatifs sont résolus par rapport au répertoire courant de la commande avant qu'OpenSpec ne stocke le chemin absolu vérifié dans l'état local à la machine de l'espace de travail. Les chemins liés peuvent être des dépôts complets, des paquets, des services, des applications ou des dossiers sans état `openspec/` local au dépôt.

### `openspec workspace relink`

Réparer ou modifier le chemin local pour un lien existant.

```bash
openspec workspace relink <name> <path> [options]
```

Le chemin doit déjà exister. Relink met à jour uniquement le chemin local à la machine pour le nom de lien stable.

### `openspec workspace doctor`

Vérifie ce qu'un espace de travail peut résoudre sur la machine actuelle.

```bash
openspec workspace doctor [options]
```

Doctor affiche l'emplacement de l'espace de travail, les dépôts ou dossiers liés, les chemins manquants, les chemins des spécifications locales au dépôt lorsqu'ils sont présents, et les correctifs suggérés. La sortie JSON inclut également le chemin de planification de l'espace de travail pour la compatibilité. Il signale uniquement les problèmes ; il ne les répare pas automatiquement.

Les commandes qui nécessitent un espace de travail utilisent l'espace de travail courant lorsqu'elles sont exécutées depuis l'intérieur d'un dossier ou sous-répertoire d'espace de travail. Depuis un autre endroit, passez `--workspace <name>`, sélectionnez-le à partir du sélecteur dans un terminal interactif, ou reposez-vous sur le seul espace de travail connu lorsqu'il en existe exactement un. En mode `--json` ou `--no-interactive`, une sélection ambiguë échoue avec une erreur de statut structurée et suggère `--workspace <name>`.

Les réponses JSON utilisent des objets typés plus des tableaux `status`. Les données principales se trouvent dans `workspace`, `workspaces`, ou `link` ; les avertissements et les erreurs se trouvent dans `status`.

### `openspec workspace update`

Actualise les directives et les compétences des agents locales à l'espace de travail OpenSpec.

```bash
openspec workspace update [name] [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--workspace <name>` | Sélectionner un espace de travail connu à partir du registre local |
| `--tools <tools>` | Sélectionner les agents pour les compétences de l'espace de travail. Utiliser `all`, `none`, ou des IDs d'outils séparés par des virgules |
| `--json` | Sortie JSON |
| `--no-interactive` | Désactiver les prompts de sélection d'espace de travail |

**Exemples :**

```bash
openspec workspace update
openspec workspace update platform
openspec workspace update --workspace platform --tools codex,claude
openspec workspace update --workspace platform --tools none
```

`workspace update` actualise le bloc de directives généré pour l'espace de travail et la surface d'ouverture locale. Pour les compétences d'agent, il réutilise la sélection d'agents de compétences d'espace de travail stockée lorsque `--tools` est omis. Passer `--tools` remplace cette sélection stockée. Il actualise uniquement les répertoires de compétences de workflow gérés par OpenSpec à la racine de l'espace de travail, supprime les compétences de workflow gérées désélectionnées et laisse les dépôts et dossiers liés intacts.

Exécuter `openspec update` depuis l'intérieur d'un espace de travail redirige vers `openspec workspace update` ; exécutez `openspec update` à l'intérieur de projets locaux à un dépôt lorsque vous souhaitez que les fichiers d'outils appartenant au dépôt soient mis à jour.

### `openspec workspace open`

Ouvre un ensemble de travail d'espace de travail via l'ouvreur préféré stocké, un remplacement d'agent pour une session, ou le mode éditeur VS Code.

```bash
openspec workspace open [name] [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--workspace <name>` | Alias pour le nom positionnel de l'espace de travail |
| `--initiative <id>` | Ouvre une initiative comme une vue d'espace de travail local. Accepte `<id>` ou `<store>/<id>` |
| `--store <id>` | ID du magasin de contexte enregistré pour `--initiative` |
| `--store-path <path>` | Racine du magasin de contexte local existant pour `--initiative` |
| `--agent <tool>` | Remplacement d'agent pour une session : `codex-cli`, `claude`, ou `github-copilot` |
| `--editor` | Ouvre le fichier d'espace de travail VS Code maintenu comme un espace de travail éditeur normal |
| `--no-interactive` | Désactiver les prompts de sélection d'espace de travail et d'ouvreur |

**Exemples :**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex-cli
openspec workspace open --editor
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative platform/billing-launch
```

`workspace open` utilise l'espace de travail courant lorsqu'il est exécuté à l'intérieur d'un, sélectionne automatiquement le seul espace de travail connu lorsqu'il est exécuté ailleurs, et demande à l'utilisateur de choisir lorsque plusieurs espaces de travail sont connus. `--agent` et `--editor` ne modifient pas l'ouvreur préféré stocké. Passer les deux remplacements d'ouvreur est une erreur ; choisissez soit `--agent <tool>`, soit `--editor`.

Lorsque `--initiative` est utilisé, OpenSpec prépare ou sélectionne une vue d'espace de travail local privé pour cette initiative. Les magasins sélectionnés par le registre sont stockés par id ; `--store-path` stocke un sélecteur de chemin local à l'exécution car les vues d'espace de travail sont un état local privé.

OpenSpec maintient `<workspace-name>.code-workspace` à la racine de l'espace de travail pour les ouvertures VS Code et GitHub Copilot-in-VS-Code. Ce fichier est l'état de la vue d'espace de travail local à la machine.

Le fichier d'espace de travail VS Code maintenu liste d'abord les dépôts ou dossiers liés valides, puis le contexte de l'initiative lorsqu'il est attaché, puis les fichiers d'espace de travail OpenSpec. VS Code affiche ces entrées comme un espace de travail multi-racine.

L'ouverture de l'espace de travail racine rend les dépôts ou dossiers liés visibles pour l'exploration et le contexte. Les modifications d'implémentation ne doivent commencer qu'après une demande explicite de l'utilisateur et un workflow d'implémentation OpenSpec normal.

---

## Commandes de Contexte Partagé

Les magasins de contexte et les initiatives sont des surfaces de coordination en version bêta. Un magasin de contexte est un enregistrement local pour un contexte partagé durable, généralement un dossier ou un clone géré par Git. Une initiative est un contexte de coordination partagé à l'intérieur d'un magasin de contexte ; les modifications locales au dépôt peuvent y être liées sans copier le plan partagé dans chaque dépôt.

### `openspec context-store setup`

Créer et enregistrer un magasin de contexte local. Sans arguments dans un terminal,
OpenSpec guide l'utilisateur à travers la configuration. Les agents et scripts doivent fournir des entrées explicites et utiliser `--json`.

```bash
openspec context-store setup [id] [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--path <path>` | Chemin du dossier du magasin de contexte ; par défaut, le répertoire de données local géré par OpenSpec |
| `--init-git` | Initialiser un dépôt Git dans le magasin de contexte |
| `--no-init-git` | Ne pas initialiser de dépôt Git |
| `--json` | Sortie au format JSON |

Lorsque `--path` est omis, la configuration crée le magasin sous `getGlobalDataDir()/context-stores/<id>` : `$XDG_DATA_HOME/openspec/context-stores/<id>` lorsque `XDG_DATA_HOME` est défini, ou `~/.local/share/openspec/context-stores/<id>` comme solution de repli de type Unix. Passez `--path` lorsque vous souhaitez placer le magasin dans un clone visible ou un dossier spécifique à l'équipe.

Exemples :

```bash
openspec context-store setup
openspec context-store setup team-context
openspec context-store setup team-context --path /repos/team-context --no-init-git
openspec context-store setup team-context --json --no-init-git
```

### `openspec context-store register`

Enregistrer un dossier de magasin de contexte local existant.

```bash
openspec context-store register [path] [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--id <id>` | Identifiant du magasin de contexte ; par défaut, les métadonnées du magasin ou le nom du dossier |
| `--json` | Sortie au format JSON |

### `openspec context-store unregister`

Oublier l'enregistrement local d'un magasin de contexte sans supprimer les fichiers.

```bash
openspec context-store unregister <id> [--json]
```

À utiliser lorsqu'un magasin a été déplacé, cloné ailleurs, ou ne doit plus être affiché par OpenSpec sur cette machine.

### `openspec context-store remove`

Oublier l'enregistrement local d'un magasin de contexte et supprimer son dossier local.

```bash
openspec context-store remove <id> [--yes] [--json]
```

`remove` affiche le dossier exact avant suppression dans un terminal interactif.
Les agents, scripts et appelants JSON doivent passer `--yes` pour confirmer la suppression.
OpenSpec refuse de supprimer un dossier qui ne contient pas les métadonnées correspondantes du magasin de contexte.

### `openspec context-store list`

Lister les magasins de contexte enregistrés localement.

```bash
openspec context-store list [--json]
openspec context-store ls [--json]
```

### `openspec context-store doctor`

Vérifier l'enregistrement local du magasin de contexte, ses métadonnées et la présence de Git.

```bash
openspec context-store doctor [id] [--json]
```

Doctor est uniquement diagnostique ; il signale les racines manquantes, les incohérences de métadonnées et les états invalides du registre local sans modifier le magasin.

### `openspec initiative create`

Créer une initiative dans un magasin de contexte.

```bash
openspec initiative create <id> --title <title> --summary <summary> [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--store <id>` | Identifiant du magasin de contexte issu du registre local |
| `--store-path <path>` | Racine du magasin de contexte local existant |
| `--title <title>` | Titre de l'initiative |
| `--summary <summary>` | Résumé de l'initiative |
| `--json` | Sortie au format JSON |

### `openspec initiative list`

Lister les initiatives. Sans sélecteur, cette commande recherche tous les magasins de contexte enregistrés et signale les avertissements de lecture partielle dans `status`.

```bash
openspec initiative list [options]
openspec initiative ls [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--store <id>` | Lister un magasin de contexte enregistré |
| `--store-path <path>` | Lister une racine de magasin de contexte local existant |
| `--json` | Sortie au format JSON |

### `openspec initiative show`

Résoudre une initiative et afficher son emplacement canonique.

```bash
openspec initiative show <id> [options]
openspec initiative show <store>/<id> [options]
```

Sans `--store`, OpenSpec recherche dans les magasins de contexte enregistrés. Si le même identifiant d'initiative existe dans plusieurs magasins, passez `--store <id>` ou utilisez la forme `<store>/<id>`.

---

## Commandes de navigation

### `openspec list`

Liste les changements ou les spécifications de votre projet.

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
Active changes:
  add-dark-mode     UI theme switching support
  fix-login-bug     Session timeout handling
```

---

### `openspec view`

Affiche un tableau de bord interactif pour explorer les spécifications et les changements.

```
openspec view
```

Ouvre une interface en mode terminal pour naviguer dans les spécifications et les changements de votre projet.

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
| `-r, --requirement <id>` | Afficher une exigence spécifique par index basé sur 1 (mode JSON) |

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

## Commandes de validation

### `openspec validate`

Valide les changements et les spécifications pour détecter les problèmes structurels.

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
| `--concurrency <n>` | Validations parallèles maximales (par défaut : 6, ou variable d'environnement `OPENSPEC_CONCURRENCY`) |
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
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
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
        "warnings": ["design.md: missing 'Technical Approach' section"]
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

## Commandes du cycle de vie

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

# Archiver un changement d'outillage sans impact sur les spécifications
openspec archive update-ci-config --skip-specs
```

**Ce que cette commande fait :**

1. Valide le changement (sauf si `--no-validate`)
2. Invite à la confirmation (sauf si `--yes`)
3. Fusionne les spécifications delta dans `openspec/specs/`
4. Déplace le dossier du changement vers `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Commandes de workflow

Ces commandes prennent en charge le workflow OPSX piloté par les artefacts. Elles sont utiles aussi bien pour les humains vérifiant la progression que pour les agents déterminant les prochaines étapes.

### `openspec new change`

Crée un répertoire de changement local au dépôt et un métadonnées optionnelles enregistrées.

```bash
openspec new change <name> [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--description <text>` | Description à ajouter au `README.md` |
| `--goal <text>` | Objectif produit de l'espace de travail à stocker avec le changement |
| `--areas <names>` | Noms des liens de l'espace de travail affectés, séparés par des virgules |
| `--initiative <id>` | Lier le changement local du dépôt à une initiative |
| `--store <id>` | Identifiant du magasin de contexte pour `--initiative` |
| `--store-path <path>` | Racine du magasin de contexte local existant pour `--initiative` |
| `--schema <name>` | Schéma de workflow à utiliser |
| `--json` | Sortie au format JSON |

Exemples :

```bash
openspec new change add-billing-api --initiative billing-launch --store platform
openspec new change add-billing-api --initiative platform/billing-launch --json
```

### `openspec set change`

Met à jour les métadonnées du changement local du dépôt enregistrées sans recréer le changement.

```bash
openspec set change <name> [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--initiative <id>` | Lier le changement local du dépôt à une initiative |
| `--store <id>` | Identifiant du magasin de contexte pour `--initiative` |
| `--store-path <path>` | Racine du magasin de contexte local existant pour `--initiative` |
| `--json` | Sortie au format JSON |

`set change --initiative` est idempotent lorsque le lien demandé existe déjà et refuse de remplacer un lien d'initiative existant différent.

### `openspec status`

Affiche l'état de complétion des artefacts pour un changement.

```
openspec status [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--change <id>` | Nom du changement (invite si omis) |
| `--schema <name>` | Remplacement du schéma (détection automatique depuis la configuration du changement) |
| `--json` | Sortie au format JSON |

**Exemples :**

```bash
# Vérification de l'état interactive
openspec status

# État d'un changement spécifique
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

Obtient des instructions enrichies pour la création d'un artefact ou l'application des tâches. Utilisé par les agents IA pour comprendre quoi créer ensuite.

```
openspec instructions [artifact] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|--------|-------------|
| `artifact` | Non | Identifiant de l'artefact : `proposal`, `specs`, `design`, `tasks`, ou `apply` |

**Options :**

| Option | Description |
|--------|-------------|
| `--change <id>` | Nom du changement (requis en mode non interactif) |
| `--schema <name>` | Remplacement du schéma |
| `--json` | Sortie au format JSON |

**Cas particulier :** Utilisez `apply` comme artefact pour obtenir les instructions d'implémentation des tâches.

**Exemples :**

```bash
# Obtenir les instructions pour le prochain artefact
openspec instructions --change add-dark-mode

# Obtenir les instructions d'un artefact spécifique
openspec instructions design --change add-dark-mode

# Obtenir les instructions d'application/implémentation
openspec instructions apply --change add-dark-mode

# JSON pour consommation par un agent
openspec instructions design --change add-dark-mode --json
```

**La sortie inclut :**

- Le contenu du modèle pour l'artefact
- Le contexte du projet issu de la configuration
- Le contenu des artefacts dépendants
- Les règles par artefact issues de la configuration

---

### `openspec templates`

Affiche les chemins résolus des modèles pour tous les artefacts d'un schéma.

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
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

---

## Commandes de Schéma

Commandes pour la création et la gestion de schémas de workflow personnalisés.

### `openspec schema init`

Créer un nouveau schéma local au projet.

```
openspec schema init <nom> [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|----------|-------------|
| `nom` | Oui | Nom du schéma (kebab-case) |

**Options :**

| Option | Description |
|--------|-------------|
| `--description <texte>` | Description du schéma |
| `--artifacts <liste>` | IDs d'artefacts séparés par des virgules (défaut : `proposal,specs,design,tasks`) |
| `--default` | Définir comme schéma par défaut du projet |
| `--no-default` | Ne pas proposer de le définir par défaut |
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

**Ce qu'il crée :**

```
openspec/schemas/<nom>/
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
openspec schema fork <source> [nom] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|----------|-------------|
| `source` | Oui | Schéma à copier |
| `nom` | Non | Nouveau nom du schéma (défaut : `<source>-custom`) |

**Options :**

| Option | Description |
|--------|-------------|
| `--force` | Écraser la destination existante |
| `--json` | Sortie au format JSON |

**Exemple :**

```bash
# Faire un fork du schéma intégré spec-driven
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Valider la structure et les modèles d'un schéma.

```
openspec schema validate [nom] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|----------|-------------|
| `nom` | Non | Schéma à valider (valide tous si omis) |

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

Afficher l'origine de résolution d'un schéma (utile pour le débogage des priorités).

```
openspec schema which [nom] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|----------|-------------|
| `nom` | Non | Nom du schéma |

**Options :**

| Option | Description |
|--------|-------------|
| `--all` | Lister tous les schémas avec leur source |
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

1. Projet : `openspec/schemas/<nom>/`
2. Utilisateur : `~/.local/share/openspec/schemas/<nom>/`
3. Paquet : Schémas intégrés

---

## Commandes de Configuration

### `openspec config`

Afficher et modifier la configuration globale d'OpenSpec.

```
openspec config <sous-commande> [options]
```

**Sous-commandes :**

| Sous-commande | Description |
|------------|-------------|
| `path` | Afficher l'emplacement du fichier de configuration |
| `list` | Afficher tous les paramètres actuels |
| `get <clé>` | Obtenir une valeur spécifique |
| `set <clé> <valeur>` | Définir une valeur |
| `unset <clé>` | Supprimer une clé |
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

# Éditer la configuration dans votre éditeur
openspec config edit

# Configurer le profil avec un assistant basé sur les actions
openspec config profile

# Préréglage rapide : passer les workflows à "core" (conserve le mode de livraison)
openspec config profile core
```

`openspec config profile` commence par un résumé de l'état actuel, puis vous permet de choisir :
- Changer la livraison + les workflows
- Changer uniquement la livraison
- Changer uniquement les workflows
- Conserver les paramètres actuels (quitter)

Si vous conservez les paramètres actuels, aucune modification n'est écrite et aucun message de mise à jour n'est affiché.
S'il n'y a aucun changement de configuration mais que les fichiers du projet ou de l'espace de travail actuels ne sont pas synchronisés avec votre profil/livraison globale, OpenSpec affichera un avertissement et suggérera `openspec update` pour les projets locaux au dépôt ou `openspec workspace update` pour les conseils et compétences locaux à l'espace de travail.
Appuyer sur `Ctrl+C` annule également proprement le flux (sans trace de pile) et quitte avec le code `130`.
Dans la liste de contrôle des workflows, `[x]` signifie que le workflow est sélectionné dans la configuration globale. Pour appliquer ces sélections aux fichiers du projet, exécutez `openspec update` (ou choisissez `Appliquer les modifications à ce projet maintenant ?` lorsque vous y êtes invité à l'intérieur d'un projet). Depuis un espace de travail, utilisez `openspec workspace update` pour actualiser les conseils et compétences locaux à l'espace de travail ; cela reste uniquement pour les compétences des fichiers de workflow d'agent générés et ne génère pas de commandes slash d'espace de travail.

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

Soumettre un commentaire sur OpenSpec. Crée une issue GitHub.

```
openspec feedback <message> [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|----------|-------------|
| `message` | Oui | Message de commentaire |

**Options :**

| Option | Description |
|--------|-------------|
| `--body <texte>` | Description détaillée |

**Prérequis :** GitHub CLI (`gh`) doit être installé et authentifié.

**Exemple :**

```bash
openspec feedback "Ajouter la prise en charge des types d'artefacts personnalisés" \
  --body "Je voudrais pouvoir définir mes propres types d'artefacts au-delà de ceux intégrés."
```

---

### `openspec completion`

Gérer les complétions de shell pour le CLI OpenSpec.

```
openspec completion <sous-commande> [shell]
```

**Sous-commandes :**

| Sous-commande | Description |
|------------|-------------|
| `generate [shell]` | Sortir le script de complétion sur stdout |
| `install [shell]` | Installer la complétion pour votre shell |
| `uninstall [shell]` | Supprimer les complétions installées |

**Shells supportés :** `bash`, `zsh`, `fish`, `powershell`

**Exemples :**

```bash
# Installer les complétions (détecte automatiquement le shell)
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
|------|---------|
| `0` | Succès |
| `1` | Erreur (échec de validation, fichiers manquants, etc.) |

---

## Variables d'Environnement

| Variable | Description |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Définir à `0` pour désactiver la télémétrie |
| `DO_NOT_TRACK` | Définir à `1` pour désactiver la télémétrie (signal DNT standard) |
| `OPENSPEC_CONCURRENCY` | Concurrence par défaut pour la validation en lot (défaut : 6) |
| `EDITOR` ou `VISUAL` | Éditeur pour `openspec config edit` |
| `NO_COLOR` | Désactiver la sortie en couleur lorsqu'il est défini |

---

## Documentation Connexe

- [Commandes](commands.md) - Commandes slash IA (`/opsx:propose`, `/opsx:apply`, etc.)
- [Workflows](workflows.md) - Modèles courants et quand utiliser chaque commande
- [Personnalisation](customization.md) - Créer des schémas et modèles personnalisés
- [Démarrage](getting-started.md) - Guide d'installation initiale