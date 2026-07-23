# Référence CLI

L'interface CLI OpenSpec (`openspec`) fournit des commandes en terminal pour la mise en place de projet, la validation, l'inspection de l'état et la gestion. Ces commandes complètent les commandes slash IA (comme `/opsx:propose`) documentées dans [Commandes](commands.md).

## Résumé

| Catégorie | Commandes | Objectif |
|----------|----------|---------|
| **Mise en place** | `init`, `update` | Initialiser et mettre à jour OpenSpec dans votre projet |
| **Stores (dépôts OpenSpec autonomes)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Gérer les stores — les dépôts OpenSpec autonomes que vous avez enregistrés |
| **Santé** | `doctor` | Rapporter l'état de santé des relations pour la racine résolue |
| **Contexte de travail** | `context` | Assembler l'ensemble de travail (racine + stores référencés) |
| **Worksets personnels** | `workset create`, `workset list`, `workset open`, `workset remove` | Conserver et ouvrir des vues de travail personnelles et locales dans votre outil |
| **Navigation** | `list`, `view`, `show` | Explorer les changements et les specs |
| **Validation** | `validate` | Vérifier les changements et les specs pour détecter des problèmes |
| **Cycle de vie** | `archive` | Finaliser les changements terminés |
| **Flux de travail** | `new change`, `status`, `instructions`, `templates`, `schemas` | Prise en charge des flux de travail pilotés par les artefacts |
| **Schémas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Créer et gérer des flux de travail personnalisés |
| **Configuration** | `config` | Afficher et modifier les paramètres |
| **Utilitaires** | `feedback`, `completion` | Retour d'information et intégration au shell |


## Commandes humaines vs agents

La plupart des commandes CLI sont conçues pour une **utilisation humaine** dans un terminal. Certaines commandes prennent également en charge l'**utilisation par agent/script** via une sortie JSON.

### Commandes réservées aux humains

Ces commandes sont interactives et conçues pour une utilisation en terminal :

| Commande | Objectif |
|---------|---------|
| `openspec init` | Initialiser le projet (invites interactives) |
| `openspec view` | Tableau de bord interactif |
| `openspec workset open <name>` | Ouvrir un workset enregistré (fenêtre de l'éditeur ou session d'agent en terminal) |
| `openspec config edit` | Ouvrir la configuration dans l'éditeur |
| `openspec feedback` | Soumettre des commentaires via GitHub |
| `openspec completion install` | Installer les complétions de shell |

### Commandes compatibles avec les agents

Ces commandes prennent en charge la sortie `--json` pour une utilisation programmatique par les agents IA et les scripts :

| Commande | Utilisation humaine | Utilisation par agent |
|---------|-----------|-----------|
| `openspec list` | Parcourir les changements/spécifications | `--json` pour des données structurées |
| `openspec show <item>` | Lire le contenu | `--json` pour l'analyse |
| `openspec validate` | Vérifier les problèmes | `--all --json` pour la validation en masse |
| `openspec status` | Voir la progression des artefacts | `--json` pour un statut structuré |
| `openspec instructions` | Obtenir les prochaines étapes | `--json` pour les instructions de l'agent |
| `openspec templates` | Trouver les chemins des modèles | `--json` pour la résolution des chemins |
| `openspec schemas` | Lister les schémas disponibles | `--json` pour la découverte de schémas |
| `openspec store setup <id>` | Créer et enregistrer un magasin local | `--json` avec des entrées explicites pour une sortie de configuration structurée |
| `openspec store register <path>` | Enregistrer un magasin existant | `--json` pour une sortie d'enregistrement structurée |
| `openspec store unregister <id>` | Oublier un enregistrement de magasin local | `--json` pour une sortie de nettoyage structurée |
| `openspec store remove <id>` | Supprimer un dossier de magasin local enregistré | `--yes --json` pour une suppression non interactive |
| `openspec store list` | Parcourir les magasins enregistrés | `--json` pour des enregistrements structurés |
| `openspec store doctor` | Vérifier la configuration du magasin local | `--json` pour des diagnostics structurés |
| `openspec new change <id>` | Créer un échafaudage de changement local au dépôt | `--json`, plus `--store <id>` pour utiliser un magasin enregistré comme racine OpenSpec |
| `openspec workset create [name]` | Composer une vue de travail personnelle | `--member <path> --json` pour une composition non interactive |
| `openspec workset list` | Parcourir les worksets enregistrés | `--json` pour des vues structurées |
| `openspec workset remove <name>` | Supprimer une vue enregistrée | `--yes --json` pour une suppression non interactive |


## Options globales

Ces options fonctionnent avec toutes les commandes :

| Option | Description |
|--------|-------------|
| `--version`, `-V` | Afficher le numéro de version |
| `--no-color` | Désactiver la sortie colorée |
| `--help`, `-h` | Afficher l'aide de la commande |


## Commandes de configuration

### `openspec init`

Initialise OpenSpec dans votre projet. Crée la structure de dossiers et configure les intégrations des outils d'IA.

Le comportement par défaut utilise les paramètres globaux de configuration : profil `core`, livraison `both`, workflows `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `path` | Non | Répertoire cible (par défaut : répertoire courant) |

**Options :**

| Option | Description |
|--------|-------------|
| `--tools <list>` | Configurer les outils d'IA de manière non interactive. Utilisez `all`, `none` ou une liste séparée par des virgules |
| `--force` | Nettoyage automatique des fichiers anciens sans demande de confirmation |
| `--profile <profile>` | Remplacer le profil global pour cette exécution d'initialisation (`core` ou `custom`) |

`--profile custom` utilise les workflows actuellement sélectionnés dans la configuration globale (`openspec config profile`).

**IDs d'outils pris en charge (`--tools`) :** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

> Cette liste correspond à `AI_TOOLS` dans `src/core/config.ts`. Consultez [Outils pris en charge](supported-tools.md) pour les compétences et les chemins de commande de chaque outil.

**Exemples :**

```bash
# Initialisation interactive
openspec init

# Initialiser dans un répertoire spécifique
openspec init ./my-project

# Non interactif : configurer pour Claude et Cursor
openspec init --tools claude,cursor

# Configurer pour tous les outils pris en charge
openspec init --tools all

# Remplacer le profil pour cette exécution
openspec init --profile core

# Ignorer les invites et nettoyer automatiquement les fichiers anciens
openspec init --force
```

**Ce qu'il crée :**

```
openspec/
├── specs/              # Vos spécifications (source de vérité)
├── changes/            # Changements proposés
└── config.yaml         # Configuration du projet

.claude/skills/         # Compétences Claude Code (si claude est sélectionné)
.cursor/skills/         # Compétences Cursor (si cursor est sélectionné)
.cursor/commands/       # Commandes Cursor OPSX (si la livraison inclut des commandes)
... (autres configurations d'outils)
```


### `openspec update`

Met à jour les fichiers d'instructions OpenSpec après la mise à niveau du CLI. Régénère les fichiers de configuration des outils d'IA en utilisant votre profil global actuel, les workflows sélectionnés et le mode de livraison.

```
openspec update [path] [options]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|----------|-------------|
| `path` | Non | Répertoire cible (par défaut : répertoire courant) |

**Options :**

| Option | Description |
|--------|-------------|
| `--force` | Forcer la mise à jour même lorsque les fichiers sont à jour |

**Exemple :**

```bash
# Mettre à jour les fichiers d'instructions après la mise à niveau npm
npm update @fission-ai/openspec
openspec update
```


## Magasins (dépôts OpenSpec autonomes)

> **Bêta.** Les magasins et les fonctionnalités qui en découlent (références, contexte de travail, worksets) sont nouveaux ; les noms de commandes, les indicateurs, les formats de fichiers et la sortie JSON peuvent évoluer entre les versions. Pour une présentation centrée sur les problèmes, consultez le [guide des magasins](stores-beta/user-guide.md).

Un magasin est un dépôt OpenSpec autonome que vous avez enregistré sur cette machine — par exemple un dépôt de planification ou un dépôt de contrats. L'enregistrement d'un magasin permet aux commandes normales (`list`, `show`, `status`, `validate`, `new change`, `archive`, ...) d'agir sur celui-ci depuis n'importe où en passant `--store <id>`.

### `openspec store setup`

Crée et enregistre un magasin local. Sans arguments dans un terminal, OpenSpec guide l'utilisateur à travers la configuration. Les agents et les scripts doivent passer des entrées explicites et utiliser `--json`.

```bash
openspec store setup [id] [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--path <path>` | Dossier où le magasin doit se trouver (par exemple `~/openspec/<id>`) |
| `--remote <url>` | Enregistrer le dépôt distant canonique dans le `store.yaml` du nouveau magasin |
| `--init-git` | Initialiser un dépôt Git avec un commit initial (par défaut) |
| `--no-init-git` | Ignorer toutes les actions Git : pas d'initialisation, pas de commit initial |
| `--json` | Sortie JSON |

Les exécutions non interactives (`--json`, scripts, agents) doivent passer à la fois l'identifiant du magasin et `--path`. Dans un terminal interactif, la configuration demande l'emplacement avec une suggestion modifiable dans un endroit visible appartenant à l'utilisateur (par exemple `~/openspec/<id>`) ; elle ne se rabat jamais sur le répertoire de données géré par OpenSpec.

Exemples :

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Enregistre un dossier de magasin local existant. Pendant la phase bêta des magasins, une racine peut être enregistrée avant l'existence de tout changement, l'application de spécifications ou l'archivage de changements ; dans ce cas, `openspec/changes/`, `openspec/specs/`, et `openspec/changes/archive/` peuvent être absents jusqu'à ce que les commandes normales les créent. Un dépôt de configuration uniquement qui déclare `store: <id>` reste un pointeur vers un autre magasin et n'est pas enregistré comme racine de magasin à moins que ce pointeur ne soit supprimé.

```bash
openspec store register [path] [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--id <id>` | Identifiant du magasin ; par défaut, utilise les métadonnées du magasin ou le nom du dossier |
| `--yes` | Confirmer la création des métadonnées d'identité du magasin pour une racine OpenSpec saine |
| `--json` | Sortie JSON |

### `openspec store unregister`

Oublie un enregistrement de magasin local sans supprimer les fichiers.

```bash
openspec store unregister <id> [--json]
```

Utilisez cette commande lorsqu'un magasin a été déplacé, cloné ailleurs ou ne doit plus être affiché par OpenSpec sur cette machine.

### `openspec store remove`

Oublie un enregistrement de magasin local et supprime son dossier local.

```bash
openspec store remove <id> [--yes] [--json]
```

`remove` affiche le dossier exact avant de le supprimer dans un terminal interactif. Les agents, les scripts et les appelants JSON doivent passer `--yes` pour confirmer la suppression. OpenSpec refuse de supprimer un dossier qui ne contient pas de métadonnées de magasin correspondantes.

### `openspec store list`

Lister les magasins enregistrés localement.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Vérifie l'enregistrement du magasin local, les métadonnées et la présence de Git.

```bash
openspec store doctor [id] [--json]
```

Doctor est uniquement diagnostique ; il signale les racines manquantes, les incohérences de métadonnées et l'état invalide du registre local sans modifier le magasin.

### Référencer des magasins depuis un projet

Un dépôt de projet peut déclarer les magasins sur lesquels son travail s'appuie dans `openspec/config.yaml` :

```yaml
schema: spec-driven
references:
  - team-context
```

Par la suite, la sortie de `openspec instructions` dans ce dépôt (à la fois les surfaces par artefact et `apply`, modes JSON et humain) comporte un index des spécifications de chaque magasin référencé — identifiants de spécifications, un résumé d'une ligne de la section Objectif de chaque spécification, et la commande de récupération (`openspec show <spec-id> --type spec --store <id>`). L'index est construit en temps réel à partir de l'extraction enregistrée à chaque exécution ; le contenu des spécifications n'est jamais copié dans la sortie.

Les références sont un contexte en lecture seule. Elles ne modifient jamais l'emplacement d'exécution des commandes : le travail reste dans la racine propre du dépôt, et l'écriture dans un magasin référencé reste une action `--store` explicite. Une référence qui ne peut pas être résolue (par exemple, un magasin non enregistré sur cette machine) se dégrade en avertissement dans l'index avec la correction exacte, et les instructions sont toujours générées. `openspec doctor` signale l'état des références à un seul endroit.

### Enregistrer l'origine du clonage d'un magasin

Un magasin peut enregistrer sa source de clonage canonique dans son fichier d'identité validé, afin que l'intégration ne se termine jamais par un cul-de-sac du type « enregistrez le magasin » :

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

Le dépôt distant est enregistré dans `.openspec-store/store.yaml` dans le commit initial, donc chaque clone le connaît dès sa création. Pour un magasin existant, modifiez `store.yaml` manuellement et validez. `store doctor` affiche le dépôt distant enregistré (et l'origine Git observée de l'extraction) ; les conseils de partage de configuration/enregistrement le nomment ; et l'enregistrement consigne l'origine de l'extraction dans le registre local de la machine.

Une déclaration de référence peut également porter la source de clonage, afin qu'un membre de l'équipe qui n'a pas encore le magasin obtienne une correction complète et copiable (`git clone <remote> <path> && openspec store register <path> --id <id>`) :

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

Enregistrer un dépôt distant n'est pas une synchronisation : OpenSpec ne clone, ne tire ni ne pousse jamais de lui-même.

### Déclarer un magasin par défaut

Un dépôt dont la planification est entièrement externalisée — pas de `openspec/specs/` ou `openspec/changes/` local — peut déclarer son magasin une seule fois au lieu de passer `--store` à chaque commande :

```yaml
# openspec/config.yaml (le seul fichier dans openspec/)
store: team-context
```

Les commandes normales se résolvent alors automatiquement vers le magasin déclaré ; la bannière racine et le bloc JSON `root` rapportent `source: "declared"` avec l'identifiant du magasin, et les indices imprimés comportent toujours `--store <id>`. La déclaration est un filet de sécurité, jamais une substitution : le `--store` explicite l'emporte toujours, et un répertoire contenant de vrais dossiers de planification ignore le pointeur (avec un avertissement). Pour convertir un dépôt pointeur en racine OpenSpec locale, supprimez la ligne `store:` et exécutez `openspec init` — init refuse de générer l'échafaudage tant que la déclaration est présente.

Une variante au niveau de la machine couvre tous les dépôts à la fois : `openspec config set defaultStore <id>` (voir Configuration). Elle n'est consultée qu'après l'échec de résolution de `--store`, d'une racine locale et d'un pointeur de projet ; la bannière racine et le bloc JSON `root` rapportent alors `source: "global_default"`.

## Doctor (santé des relations)

Une seule question en lecture seule, un seul endroit : la racine OpenSpec est-elle saine, et les stores qu'elle référence sont-ils disponibles sur cette machine ?

```bash
openspec doctor [--store <id>] [--json]
```

Le rapport distingue la santé de la racine, la santé des métadonnées des stores (notamment une note lorsque le dépôt distant enregistré et l'origine de l'extraction divergent, et une note lorsque l'extraction du store est en retard par rapport à sa référence de suivi amont la plus récente récupérée), et la santé des références (les mêmes instructions de diagnostic que celles affichées par la commande Doctor, avec des corrections par clonage pour les références non résolues). Les résultats de santé, quelle que soit leur gravité, renvoient le code de sortie 0 : les agents lisent les tableaux `status` ; seules les erreurs d'exécution de la commande (absence de racine, store inconnu) renvoient le code de sortie 1. Doctor ne clone, ne synchronise ni ne répare jamais. Pour obtenir l'ensemble assemblé lui-même plutôt que son état de santé, utilisez `openspec context`.

## Contexte de travail (l'ensemble assemblé)

Tout ce à quoi ce travail se rapporte via les déclarations OpenSpec, dans un seul ensemble de travail : la racine OpenSpec et les stores qu'elle référence.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

Le résumé JSON est exploitable par les agents (chaque store référencé disponible inclut sa recette de récupération ; les membres non résolus incluent les mêmes instructions de correction que celles affichées par la commande Doctor). L'option `--code-workspace` écrit en outre un fichier d'espace de travail VS Code contenant la racine ainsi que les stores référencés disponibles (dossiers `ref:<id>`) : c'est la seule opération d'écriture effectuée par cette commande, elle est refusée sans l'option `--force` si le fichier existe déjà. Les membres indisponibles sont signalés, ils ne font jamais l'objet de suppositions.

Le « Contexte de travail » correspond à l'ensemble assemblé ; le champ `context:` dans le fichier `openspec/config.yaml` est le contexte projet injecté dans les instructions : ce sont deux éléments distincts. `openspec doctor` indique si l'ensemble est sain ; `openspec context` indique quel est l'ensemble.

## Worksets personnels

> **Bêta.** Les worksets font partie de la nouvelle surface bêta ; les commandes, les indicateurs et les formats de fichiers peuvent évoluer entre les versions. Pour le guide pas à pas, consultez le [guide des magasins](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together).

Un workset est une vue personnelle et nommée des dossiers sur lesquels vous travaillez ensemble — une racine de planification plus tout ce que vous choisissez d'y ajouter — conservée sur votre machine et rouverte par nom dans votre outil. Il est entièrement local : jamais commité, jamais partagé, jamais dérivé de déclarations, et sa suppression ne touche jamais un dossier membre.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` exécute un flux guidé court (ou accepte les indicateurs `--member` de manière non interactive ; le premier membre est le principal — les sessions y démarrent). `open` lance l'outil choisi : les éditeurs (VS Code, Cursor) ouvrent une fenêtre avec tous les membres et reviennent ; les agents CLI (Claude Code, codex) prennent le contrôle de ce terminal en tant que session avec tous les membres attachés et aucune invite pré-remplie, se terminant lorsque vous quittez. Un dossier membre manquant au moment de l'ouverture est ignoré avec une note ; le reste s'ouvre. La préférence d'outil enregistrée peut être remplacée à chaque ouverture avec `--tool`.

La prise en charge d'un nouvel outil est une question de configuration, pas de code. Chaque outil correspond à l'un des deux styles de lancement — `workspace-file` (lancé avec le fichier `.code-workspace` généré) ou `attach-dirs` (un indicateur attach par membre) — et la clé `openers` dans le `config.json` global (ouvrez-le avec `openspec config edit`) permet d'ajouter des outils ou d'ajuster les outils intégrés par champ :

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Tout l'état des worksets se trouve dans le dossier `worksets/` du répertoire de données global (les vues enregistrées ainsi que les fichiers `<name>.code-workspace` générés, régénérés à chaque ouverture) ; la suppression de ce dossier efface toute trace.


## Commandes de navigation

### `openspec list`

Liste les changements ou les spécifications dans votre projet.

```
openspec list [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--specs` | Liste les spécifications au lieu des changements |
| `--changes` | Liste les changements (par défaut) |
| `--sort <order>` | Trie par `recent` (par défaut) ou `name` |
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
Changes:
  add-dark-mode     No tasks      just now
```


### `openspec view`

Affiche un tableau de bord interactif pour explorer les spécifications et les changements.

```
openspec view
```

Ouvre une interface basée sur le terminal pour naviguer dans les spécifications et les changements de votre projet.


### `openspec show`

Affiche les détails d'un changement ou d'une spécification.

```
openspec show [item-name] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|--------|-------------|
| `item-name` | Non | Nom du changement ou de la spécification (demande si omis) |

**Options :**

| Option | Description |
|--------|-------------|
| `--type <type>` | Spécifie le type : `change` ou `spec` (détecté automatiquement si non ambigu) |
| `--json` | Sortie au format JSON |
| `--no-interactive` | Désactive les invites |

**Options spécifiques aux changements :**

| Option | Description |
|--------|-------------|
| `--deltas-only` | Affiche uniquement les spécifications delta (mode JSON) |

**Options spécifiques aux spécifications :**

| Option | Description |
|--------|-------------|
| `--requirements` | Affiche uniquement les exigences, exclut les scénarios (mode JSON) |
| `--no-scenarios` | Exclut le contenu des scénarios (mode JSON) |
| `-r, --requirement <id>` | Affiche une exigence spécifique par index basé sur 1 (mode JSON) |

**Exemples :**

```bash
# Sélection interactive
openspec show

# Afficher un changement spécifique
openspec show add-dark-mode

# Afficher une spécification spécifique
openspec show auth --type spec

# Sortie JSON pour le parsing
openspec show add-dark-mode --json
```


## Commandes de validation

### `openspec validate`

Valide les changements et les spécifications pour détecter les problèmes structurels.

```
openspec validate [item-name] [options]
```

Un changement avec zéro delta de spécification échoue à la validation à moins que son `.openspec.yaml` ne déclare `skip_specs: true` (pour des refactorisations pures, des outils ou des travaux de documentation — voir la [Recette 5](examples.md#recipe-5-a-refactor-with-no-behavior-change)).

**Arguments :**

| Argument | Requis | Description |
|----------|--------|-------------|
| `item-name` | Non | Élément spécifique à valider (demande si omis) |

**Options :**

| Option | Description |
|--------|-------------|
| `--all` | Valide tous les changements et toutes les spécifications |
| `--changes` | Valide tous les changements |
| `--specs` | Valide toutes les spécifications |
| `--type <type>` | Spécifie le type lorsque le nom est ambigu : `change` ou `spec` |
| `--strict` | Active le mode de validation strict |
| `--json` | Sortie au format JSON |
| `--concurrency <n>` | Nombre maximal de validations parallèles (par défaut : 6, ou variable d'environnement `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Désactive les invites |

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


## Commandes du cycle de vie

### `openspec archive`

Archive un changement terminé et fusionne les spécifications delta dans les spécifications principales.

```
openspec archive [change-name] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|--------|-------------|
| `change-name` | Non | Changement à archiver (demande si omis) |

**Options :**

| Option | Description |
|--------|-------------|
| `-y, --yes` | Passe les invites de confirmation |
| `--skip-specs` | Passe les mises à jour des spécifications pour une exécution d'archivage. Un changement qui n'a définitivement pas de deltas de spécification doit plutôt déclarer `skip_specs: true` dans son `.openspec.yaml` — il s'archive sans indicateur |
| `--no-validate` | Passe la validation (nécessite une confirmation) |

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
4. Déplace le dossier du changement vers `openspec/changes/archive/YYYY-MM-DD-<name>/`


## Commandes de workflow

Ces commandes prennent en charge le workflow OPSX piloté par les artefacts. Elles sont utiles à la fois aux humains qui vérifient la progression et aux agents qui déterminent les prochaines étapes.

### `openspec new change`

Crée un répertoire de changement et des métadonnées optionnelles versionnées dans la racine OpenSpec résolue.

```bash
openspec new change <name> [options]
```

Les noms de changement doivent utiliser le kebab-case en minuscules. Ils commencent par une lettre minuscule, puis contiennent des lettres minuscules, des chiffres et des traits d'union simples. Ils ne peuvent pas commencer par un chiffre, contenir des espaces, des underscores, des lettres majuscules, des traits d'union consécutifs ou des traits d'union de début ou de fin. Lorsque vous incluez un identifiant de ticket externe, préfixez-le avec un mot, par exemple `ticket-123-add-notifications` au lieu de `123-add-notifications`.

**Options :**

| Option | Description |
|--------|-------------|
| `--description <text>` | Description à ajouter à `index.md` |
| `--goal <text>` | Métadonnées d'objectif optionnelles à stocker avec le changement |
| `--schema <name>` | Schéma de workflow à utiliser |
| `--store <id>` | Identifiant du magasin à utiliser comme racine OpenSpec (un magasin est un dépôt OpenSpec autonome que vous avez enregistré) |
| `--json` | Sortie JSON |

Exemples :

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Affiche l'état d'avancement des artefacts pour un changement.

```
openspec status [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--change <id>` | Nom du changement (demande si omis) |
| `--schema <name>` | Remplacement de schéma (détecté automatiquement depuis la configuration du changement) |
| `--json` | Sortie au format JSON |

**Exemples :**

```bash
# Vérification d'état interactive
openspec status

# État pour un changement spécifique
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

Un changement qui déclare `skip_specs: true` affiche son étape de spécifications comme `[~] specs (skipped: change declares skip_specs)` et l'exclut du compte de progression.

**Sortie (JSON) :**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done", "requires": []},
    {"id": "design", "outputPath": "design.md", "status": "ready", "requires": ["proposal"]},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done", "requires": ["proposal"]},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "requires": ["specs", "design"], "missingDeps": ["design"]}
  ]
}
```


### `openspec instructions`

Obtient des instructions enrichies pour créer un artefact ou appliquer des tâches. Utilisé par les agents IA pour comprendre ce qu'il faut créer ensuite.

```
openspec instructions [artifact] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|--------|-------------|
| `artifact` | Non | ID de l'artefact : `proposal`, `specs`, `design`, `tasks` ou `apply` |

**Options :**

| Option | Description |
|--------|-------------|
| `--change <id>` | Nom du changement (obligatoire en mode non interactif) |
| `--schema <name>` | Remplacement de schéma |
| `--json` | Sortie au format JSON |

**Cas particulier :** utilisez `apply` comme artefact pour obtenir les instructions d'implémentation des tâches.

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

**La sortie inclut :**

- Le contenu du modèle pour l'artefact
- Le contexte du projet depuis la configuration
- Le contenu des artefacts dépendants
- Les règles par artefact depuis la configuration

Pour un artefact ignoré via `skip_specs: true`, la sortie est uniquement un avertissement (le JSON ajoute les champs `skipped`/`warning`) — l'artefact ne doit pas être créé.


### `openspec templates`

Affiche les chemins de modèles résolus pour tous les artefacts d'un schéma.

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


### `openspec schemas`

Liste les schémas de workflow disponibles avec leurs descriptions et leurs flux d'artefacts.

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

## Commandes de schéma

Commandes pour créer et gérer des schémas de workflow personnalisés.

### `openspec schema init`

Créer un nouveau schéma local au projet.

```
openspec schema init <name> [options]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|-------------|-------------|
| `name` | Oui | Nom du schéma (kebab-case) |

**Options :**

| Option | Description |
|--------|-------------|
| `--description <text>` | Description du schéma |
| `--artifacts <list>` | IDs d'artefacts séparés par des virgules (par défaut : `proposal,specs,design,tasks`) |
| `--default` | Définir comme schéma par défaut du projet |
| `--no-default` | Ne pas demander de définir comme par défaut |
| `--force` | Écraser le schéma existant |
| `--json` | Sortie au format JSON |

**Exemples :**

```bash
# Création de schéma interactive
openspec schema init research-first

# Non-interactif avec des artefacts spécifiques
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


### `openspec schema fork`

Copier un schéma existant dans votre projet pour le personnaliser.

```
openspec schema fork <source> [name] [options]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|-------------|-------------|
| `source` | Oui | Schéma à copier |
| `name` | Non | Nouveau nom de schéma (par défaut : `<source>-custom`) |

**Options :**

| Option | Description |
|--------|-------------|
| `--force` | Écraser la destination existante |
| `--json` | Sortie au format JSON |

**Exemple :**

```bash
# Forker le schéma spec-driven intégré
openspec schema fork spec-driven my-workflow
```


### `openspec schema validate`

Valider la structure et les modèles d'un schéma.

```
openspec schema validate [name] [options]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|-------------|-------------|
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


### `openspec schema which`

Afficher d'où un schéma est résolu (utile pour déboguer la priorité).

```
openspec schema which [name] [options]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|-------------|-------------|
| `name` | Non | Nom du schéma |

**Options :**

| Option | Description |
|--------|-------------|
| `--all` | Lister tous les schémas avec leurs sources |
| `--json` | Sortie au format JSON |

**Exemple :**

```bash
# Vérifier d'où vient un schéma
openspec schema which spec-driven
```

**Sortie :**

```
spec-driven résout depuis : package
  Source : /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
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
| `get <key>` | Récupérer une valeur spécifique |
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

# Récupérer une valeur spécifique
openspec config get telemetry.enabled

# Définir une valeur
openspec config set telemetry.enabled false

# Définir explicitement une valeur de chaîne
openspec config set user.name "My Name" --string

# Supprimer un paramètre personnalisé
openspec config unset user.name

# Définir un magasin par défaut au niveau machine (racine de secours quand il n'y a pas de --store, racine locale ou magasin de projet : la résolution du pointeur)
openspec config set defaultStore team-plans

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
- Changer seulement la livraison
- Changer seulement les workflows
- Conserver les paramètres actuels (quitter)

Si vous conservez les paramètres actuels, aucune modification n'est écrite et aucune invite de mise à jour n'est affichée.
S'il n'y a pas de modifications de configuration mais que les fichiers du projet actuel ne sont pas synchronisés avec votre profil/mode de livraison global, OpenSpec affichera un avertissement et suggérera `openspec update`.
Appuyer sur `Ctrl+C` annule également le flux proprement (pas de trace de pile) et quitte avec le code `130`.
Dans la liste de contrôle des workflows, `[x]` signifie que le workflow est sélectionné dans la configuration globale. Pour appliquer ces sélections aux fichiers du projet, exécutez `openspec update` (ou choisissez `Appliquer les modifications à ce projet maintenant ?` lorsque vous y êtes invité dans un projet).

**Exemples interactifs :**

```bash
# Mise à jour de la livraison uniquement
openspec config profile
# choisir : Changer seulement la livraison
# choisir la livraison : Skills only

# Mise à jour des workflows uniquement
openspec config profile
# choisir : Changer seulement les workflows
# basculer les workflows dans la liste de contrôle, puis confirmer
```

## Commandes utilitaires

### `openspec feedback`

Soumettre des commentaires sur OpenSpec. Crée une issue GitHub.

```
openspec feedback <message> [options]
```

**Arguments :**

| Argument | Obligatoire | Description |
|----------|-------------|-------------|
| `message` | Oui | Message de commentaire |

**Options :**

| Option | Description |
|--------|-------------|
| `--body <text>` | Description détaillée |

**Prérequis :** L'interface en ligne de commande GitHub (`gh`) doit être installée et authentifiée.

**Exemple :**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```


### `openspec completion`

Gérer les complétions de shell pour l'interface en ligne de commande OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Sous-commandes :**

| Sous-commande | Description |
|---------------|-------------|
| `generate [shell]` | Afficher le script de complétion sur stdout |
| `install [shell]` | Installer la complétion pour votre shell |
| `uninstall [shell]` | Supprimer les complétions installées |

**Shells pris en charge :** `bash`, `zsh`, `fish`, `powershell`

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


## Codes de sortie

| Code | Signification |
|------|---------------|
| `0` | Succès |
| `1` | Erreur (échec de validation, fichiers manquants, etc.) |


## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Définir à `0` pour désactiver la télémétrie |
| `DO_NOT_TRACK` | Définir à `1` pour désactiver la télémétrie (signal DNT standard) |
| `OPENSPEC_CONCURRENCY` | Concurrence par défaut pour la validation en masse (par défaut : 6) |
| `EDITOR` ou `VISUAL` | Éditeur pour `openspec config edit` |
| `NO_COLOR` | Désactiver la sortie colorée lorsqu'elle est définie |


## Documentation associée

- [Commandes](commands.md) - Commandes slash AI (`/opsx:propose`, `/opsx:apply`, etc.)
- [Workflows](workflows.md) - Modèles courants et quand utiliser chaque commande
- [Personnalisation](customization.md) - Créer des schémas et modèles personnalisés
- [Prise en main](getting-started.md) - Guide de configuration initiale