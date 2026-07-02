# Référence de la CLI

La CLI OpenSpec (`openspec`) fournit des commandes en terminal pour la configuration de projet, la validation, l'inspection d'état et la gestion. Ces commandes complètent les commandes slash AI (comme `/opsx:propose`) documentées dans [Commands](commands.md).

## Résumé

| Catégorie | Commandes | Objectif |
|----------|----------|---------|
| **Configuration** | `init`, `update` | Initialiser et mettre à jour OpenSpec dans votre projet |
| **Dépôts (Stores) (dépôts OpenSpec autonomes)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Gérer les dépôts — des dépôts OpenSpec autonomes que vous avez enregistrés |
| **Santé** | `doctor` | Signaler l'état de santé des relations pour la racine résolue |
| **Contexte de travail** | `context` | Assembler l'ensemble de travail (racine + dépôts référencés) |
| **Ensembles de travail personnels** | `workset create`, `workset list`, `workset open`, `workset remove` | Conserver et ouvrir des vues de travail locales et personnelles dans votre outil |
| **Navigation** | `list`, `view`, `show` | Explorer les changements et les spécifications |
| **Validation** | `validate` | Vérifier les changements et les spécifications pour détecter des problèmes |
| **Cycle de vie** | `archive` | Finaliser les changements terminés |
| **Flux de travail** | `new change`, `status`, `instructions`, `templates`, `schemas` | Prise en charge du flux de travail axé sur les artefacts |
| **Schémas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Créer et gérer des flux de travail personnalisés |
| **Configuration** | `config` | Afficher et modifier les paramètres |
| **Utilitaires** | `feedback`, `completion` | Commentaires (Feedback) et intégration de shell |

---

## Commandes Utilisateur Humain vs Agent

La plupart des commandes CLI sont conçues pour l'utilisation **humaine** dans un terminal. Certaines commandes prennent également en charge l'utilisation par **agent/script** via une sortie JSON.

### Commandes Uniquement pour les Humains

Ces commandes sont interactives et destinées à l'utilisation en terminal :

| Commande | Objectif |
|---------|---------|
| `openspec init` | Initialiser le projet (invites interactives) |
| `openspec view` | Tableau de bord interactif |
| `openspec workset open <name>` | Ouvrir un jeu de travail enregistré (fenêtre d'éditeur ou session agent en terminal) |
| `openspec config edit` | Ouvrir la configuration dans l'éditeur |
| `openspec feedback` | Soumettre des commentaires via GitHub |
| `openspec completion install` | Installer les complétions shell |

### Commandes Compatibles avec les Agents

Ces commandes prennent en charge la sortie `--json` pour une utilisation programmatique par les agents IA et les scripts :

| Commande | Utilisation Humaine | Utilisation Agent |
|---------|-----------|-----------|
| `openspec list` | Parcourir les changements/spécifications | `--json` pour des données structurées |
| `openspec show <item>` | Lire le contenu | `--json` pour l'analyse (parsing) |
| `openspec validate` | Vérifier les problèmes | `--all --json` pour la validation en masse |
| `openspec status` | Voir la progression des artefacts | `--json` pour un statut structuré |
| `openspec instructions` | Obtenir les prochaines étapes | `--json` pour les instructions de l'agent |
| `openspec templates` | Trouver les chemins de modèles | `--json` pour la résolution de chemin |
| `openspec schemas` | Lister les schémas disponibles | `--json` pour la découverte de schémas |
| `openspec store setup <id>` | Créer et enregistrer un magasin local | `--json` avec des entrées explicites pour une sortie structurée de configuration |
| `openspec store register <path>` | Enregistrer un magasin existant | `--json` pour une sortie d'enregistrement structurée |
| `openspec store unregister <id>` | Oublier un enregistrement de magasin local | `--json` pour une sortie de nettoyage structurée |
| `openspec store remove <id>` | Supprimer un dossier de magasin enregistré | `--yes --json` pour la suppression non interactive |
| `openspec store list` | Parcourir les magasins enregistrés | `--json` pour des enregistrements structurés |
| `openspec store doctor` | Vérifier la configuration du magasin local | `--json` pour des diagnostics structurés |
| `openspec new change <id>` | Créer l'échafaudage d'un changement local au dépôt | `--json`, plus `--store <id>` pour utiliser un magasin enregistré comme racine OpenSpec |
| `openspec workset create [name]` | Composer une vue de travail personnelle | `--member <path> --json` pour la composition non interactive |
| `openspec workset list` | Parcourir les jeux de travail enregistrés | `--json` pour des vues structurées |
| `openspec workset remove <name>` | Supprimer une vue enregistrée | `--yes --json` pour le retrait non interactif |

---

## Options Globales

Ces options fonctionnent avec toutes les commandes :

| Option | Description |
|--------|-------------|
| `--version`, `-V` | Afficher le numéro de version |
| `--no-color` | Désactiver la sortie en couleur |
| `--help`, `-h` | Afficher l'aide pour la commande |

---

## Commandes de Configuration (Setup)

### `openspec init`

Initialise OpenSpec dans votre projet. Crée la structure de dossiers et configure les intégrations d'outils IA.

Le comportement par défaut utilise les valeurs par défaut de la configuration globale : profil `core`, livraison `both`, flux de travail `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|----------|-------------|
| `path` | Non | Répertoire cible (par défaut : répertoire courant) |

**Options :**

| Option | Description |
|--------|-------------|
| `--tools <list>` | Configurer les outils IA de manière non interactive. Utiliser `all`, `none`, ou une liste séparée par des virgules |
| `--force` | Nettoyage automatique des fichiers hérités sans demander de confirmation |
| `--profile <profile>` | Surcharger le profil global pour cette exécution d'initialisation (`core` ou `custom`) |

`--profile custom` utilise les flux de travail actuellement sélectionnés dans la configuration globale (`openspec config profile`).

**IDs d'outils pris en charge (`--tools`) :** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

> Cette liste est un miroir de `AI_TOOLS` dans `src/core/config.ts`. Voir [Supported Tools](supported-tools.md) pour la compétence et les chemins de commande de chaque outil.

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

# Surcharger le profil pour cette exécution
openspec init --profile core

# Ignorer les invites et nettoyer automatiquement les fichiers hérités
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
.cursor/commands/       # Commandes OPSX de Cursor (si la livraison inclut des commandes)
... (autres configurations d'outils)
```

---

### `openspec update`

Met à jour les fichiers d'instructions OpenSpec après une mise à niveau du CLI. Régénère les fichiers de configuration des outils IA en utilisant votre profil global actuel, les flux de travail sélectionnés et le mode de livraison.

```
openspec update [path] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|----------|-------------|
| `path` | Non | Répertoire cible (par défaut : répertoire courant) |

**Options :**

| Option | Description |
|--------|-------------|
| `--force` | Forcer la mise à jour même si les fichiers sont à jour |

**Exemple :**

```bash
# Mise à jour des fichiers d'instructions après npm upgrade
npm update @fission-ai/openspec
openspec update
```

---

## Magasins (Stores) (dépôts OpenSpec autonomes)

> **Bêta.** Les magasins et les fonctionnalités basées sur eux (références, contexte de travail, jeux de travail) sont nouveaux ; les noms de commandes, les drapeaux, les formats de fichiers et la sortie JSON peuvent changer entre les versions. Pour le guide par approche axée sur le problème, voir [stores guide](stores-beta/user-guide.md).

Un magasin est un dépôt OpenSpec autonome que vous avez enregistré sur cette machine — par exemple, un dépôt de planification ou un dépôt de contrats. Enregistrer un magasin permet aux commandes normales (`list`, `show`, `status`, `validate`, `new change`, `archive`, ...) d'agir dans ce magasin depuis n'importe où en passant `--store <id>`.

### `openspec store setup`

Crée et enregistre un magasin local. Sans arguments dans un terminal, OpenSpec guide l'utilisateur à travers la configuration. Les agents et les scripts doivent fournir des entrées explicites et utiliser `--json`.

```bash
openspec store setup [id] [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--path <path>` | Dossier où le magasin doit résider (par exemple `~/openspec/<id>`) |
| `--remote <url>` | Enregistrer la source distante canonique dans le `store.yaml` du nouveau magasin |
| `--init-git` | Initialiser un dépôt Git avec un commit initial (par défaut) |
| `--no-init-git` | Ignorer toute action Git : pas d'initialisation, pas de commit initial |
| `--json` | Sortie JSON |

Les exécutions non interactives (`--json`, scripts, agents) doivent fournir à la fois l'ID du magasin et `--path`. Dans un terminal interactif, la configuration demande l'emplacement avec une suggestion modifiable dans un endroit visible appartenant à l'utilisateur (par exemple `~/openspec/<id>`) ; elle ne prend jamais par défaut le répertoire de données géré par OpenSpec.

Exemples :

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Enregistre un dossier de magasin local existant.

```bash
openspec store register [path] [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--id <id>` | ID du magasin ; par défaut, il utilise les métadonnées du magasin ou le nom du dossier |
| `--yes` | Confirmer la création des métadonnées d'identité du magasin pour une racine OpenSpec saine |
| `--json` | Sortie JSON |

### `openspec store unregister`

Oublie l'enregistrement d'un magasin local sans supprimer les fichiers.

```bash
openspec store unregister <id> [--json]
```

Utilisez ceci lorsqu'un magasin a été déplacé, cloné ailleurs ou ne devrait plus être affiché par OpenSpec sur cette machine.

### `openspec store remove`

Oublie l'enregistrement d'un magasin local et supprime son dossier local.

```bash
openspec store remove <id> [--yes] [--json]
```

`remove` affiche le dossier exact avant de le supprimer dans un terminal interactif. Les agents, les scripts et les appelants JSON doivent fournir `--yes` pour confirmer la suppression. OpenSpec refuse de supprimer un dossier qui ne contient pas les métadonnées de magasin correspondantes.

### `openspec store list`

Liste les magasins enregistrés localement.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Vérifie l'enregistrement du magasin local, les métadonnées et la présence Git.

```bash
openspec store doctor [id] [--json]
```

Doctor est uniquement diagnostique ; il signale les racines manquantes, les incohérences de métadonnées et l'état d'enregistrement local invalide sans modifier le magasin.

### Référencer des magasins depuis un projet

Un dépôt de projet peut déclarer quels magasins sont utilisés par son travail dans `openspec/config.yaml` :

```yaml
schema: spec-driven
references:
  - team-context
```

À partir de là, la sortie d'`openspec instructions` dans ce dépôt (à la fois les surfaces par artefact et `apply`, modes JSON et humain) contient un index des spécifications de chaque magasin référencé — les IDs de spécification, un résumé en une ligne provenant de la section *Purpose* de chaque spécification, et la commande d'extraction (`openspec show <spec-id> --type spec --store <id>`). L'index est construit en direct à chaque exécution ; le contenu des spécifications n'est jamais copié dans la sortie.

Les références sont un contexte en lecture seule. Elles ne changent jamais l'endroit où les commandes agissent : le travail reste dans la racine du dépôt, et l'écriture vers un magasin référencé reste une action explicite `--store`. Une référence qui ne peut pas être résolue (par exemple, un magasin non enregistré sur cette machine) dégénère en avertissement dans l'index avec la correction exacte, et les instructions continuent d'être générées. `openspec doctor` signale la santé des références à un endroit.

### Enregistrer la source de clonage d'un magasin

Un magasin peut enregistrer sa source de clonage canonique dans son fichier d'identité committé, afin que l'intégration ne s'arrête jamais à "enregistrez le magasin" :

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

La source distante est enregistrée dans `.openspec-store/store.yaml` à l'intérieur du commit initial, de sorte que chaque clone soit né en le sachant. Pour un magasin existant, modifiez `store.yaml` manuellement et commitez. `store doctor` affiche la source distante enregistrée (et l'origine Git observée par le checkout) ; `setup`/`register` nomme en partageant des directives ; et `register` enregistre l'origine du checkout dans le registre local de la machine.

Une déclaration de référence peut également porter la source de clonage, afin qu'un collègue qui n'a pas encore le magasin reçoive une correction complète et copiable (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

L'enregistrement d'une source n'est pas une synchronisation : OpenSpec ne clone, ne tire (pull) et ne pousse (push) jamais par lui-même.

### Déclarer un magasin par défaut

Un dépôt dont la planification est entièrement externalisée — sans `openspec/specs/` ou `openspec/changes/` locaux — peut déclarer son magasin une seule fois au lieu de passer `--store` à chaque commande :

```yaml
# openspec/config.yaml (le seul fichier sous openspec/)
store: team-context
```

Les commandes normales résolvent alors le magasin déclaré automatiquement ; la bannière racine et le bloc `root` JSON signalent `source: "declared"` avec l'ID du magasin, et les indices imprimés portent toujours `--store <id>`. La déclaration est une valeur de repli, jamais une surcharge : `--store` explicite gagne toujours, et un répertoire avec des dossiers de planification réels ignore le pointeur (avec un avertissement). Pour convertir un dépôt pointeur en racine OpenSpec locale, supprimez la ligne `store:` et exécutez `openspec init` — l'initialisation refuse d'échafauder tant que la déclaration est présente.

## Doctor (santé des relations)

Une seule question en lecture seule, un seul endroit : la racine OpenSpec est-elle saine, et les dépôts qu'elle référence sont-ils disponibles sur cette machine ?

```bash
openspec doctor [--store <id>] [--json]
```

Le rapport sépare la santé de la racine, la santé des métadonnées du dépôt (y compris une note lorsque le distant enregistré et l'origine du checkout divergent), et la santé des références (les mêmes instructions de diagnostic sont affichées, avec les corrections de clonage pour les références non résolues). Les résultats de santé de toute gravité sortent en 0 — les agents lisent les tableaux `status`; seules les erreurs de commande (pas de racine, dépôt inconnu) sortent en 1. Doctor ne clone jamais, ne synchronise ni ne répare. Pour obtenir l'ensemble assemblé lui-même plutôt que sa santé, utilisez `openspec context`.

## Contexte de travail (l'ensemble assemblé)

Tout ce qui est lié par les déclarations OpenSpec, dans un ensemble de travail unique : la racine OpenSpec et les dépôts qu'elle référence.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

Le bref JSON est utilisable par l'agent (chaque dépôt référencé disponible porte sa recette de récupération ; les membres non résolus portent les mêmes instructions de correction et le diagnostic). `--code-workspace` écrit en outre un fichier d'espace de travail VS Code contenant la racine plus les dépôts référencés disponibles (`ref:<id>` dossiers) — l'unique écriture que cette commande effectue, refusée sans `--force` si le fichier existe. Les membres indisponibles sont signalés, jamais devinés.

Le "contexte de travail" est l'ensemble assemblé ; le champ `context:` dans `openspec/config.yaml` est le contexte du projet injecté dans les instructions — deux choses différentes. `openspec doctor` répond si l'ensemble est sain ; `openspec context` répond ce qu'est l'ensemble.

## Worksets personnels

> **Bêta.** Les worksets font partie de la nouvelle surface bêta ; les commandes, les drapeaux et les formats de fichiers peuvent changer d'apparence entre les versions. Pour le guide de navigation, voir [stores guide](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together).

Un workset est une vue nommée et personnelle des dossiers sur lesquels vous travaillez ensemble — une racine de planification plus tout ce que vous choisissez — conservée sur votre machine et rouverte par son nom dans votre outil. Il est purement local : il n'est jamais commité, jamais partagé, jamais dérivé de déclarations, et sa suppression ne touche jamais un dossier membre.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` exécute un flux guidé court (ou prend les drapeaux `--member` de manière non interactive ; le premier membre est le principal — les sessions commencent là). `open` lance l'outil choisi : les éditeurs (VS Code, Cursor) ouvrent une fenêtre avec chaque membre et reviennent ; les agents CLI (Claude Code, codex) prennent ce terminal en session avec chaque membre attaché et sans invite préremplie, se terminant lorsque vous quittez. Un dossier membre manquant au moment de l'ouverture est ignoré avec une note ; le reste s'ouvre. La préférence d'outil enregistrée peut être écrasée à l'ouverture avec `--tool`.

Soutenir un nouvel outil est une question de configuration, pas de code. Chaque outil est l'un des deux styles de lancement — `workspace-file` (lancé avec le `.code-workspace` généré) ou `attach-dirs` (un drapeau d'attache par membre) — et la clé `openers` dans le fichier global `config.json` (ouvrez-le avec `openspec config edit`) ajoute des outils ou ajuste les fonctionnalités intégrées par champ :

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Tout l'état du workset est stocké dans le dossier `worksets/` de la répertoires de données global (les vues enregistrées plus les fichiers `<name>.code-workspace` générés, régénérés à chaque ouverture) ; supprimer ce dossier efface toute trace.

---

## Commandes d'exploration

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
| `--sort <order>` | Trier par `recent` (récent, par défaut) ou `name` (nom) |
| `--json` | Sortie en JSON |

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
|----------|----------|-------------|
| `item-name` | Non | Nom du changement ou de la spécification (invite si omis) |

**Options :**

| Option | Description |
|--------|-------------|
| `--type <type>` | Spécifier le type : `change` ou `spec` (détecté automatiquement s'il n'y a pas d'ambiguïté) |
| `--json` | Sortie en JSON |
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

Valide les changements et les spécifications pour des problèmes structurels.

```
openspec validate [item-name] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|----------|-------------|
| `item-name` | Non | Élément spécifique à valider (invite si omis) |

**Options :**

| Option | Description |
|--------|-------------|
| `--all` | Valider tous les changements et spécifications |
| `--changes` | Valider tous les changements |
| `--specs` | Valider toutes les spécifications |
| `--type <type>` | Spécifier le type lorsque le nom est ambigu : `change` ou `spec` |
| `--strict` | Activer le mode de validation stricte |
| `--json` | Sortie en JSON |
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
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: section "Technical Approach" manquante

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

## Commandes de cycle de vie

### `openspec archive`

Archive un changement terminé et fusionne les spécifications delta dans les spécifications principales.

```
openspec archive [change-name] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|----------|-------------|
| `change-name` | Non | Changement à archiver (invite si omis) |

**Options :**

| Option | Description |
|--------|-------------|
| `-y, --yes` | Ignorer les invites de confirmation |
| `--skip-specs` | Sauter la mise à jour des spécifications (pour les changements uniquement d'infrastructure/d'outillage/de documentation) |
| `--no-validate` | Sauter la validation (nécessite une confirmation) |

**Exemples :**

```bash
# Archive interactive
openspec archive

# Archiver un changement spécifique
openspec archive add-dark-mode

# Archiver sans invites (CI/scripts)
openspec archive add-dark-mode --yes

# Archiver un changement d'outillage qui n'affecte pas les spécifications
openspec archive update-ci-config --skip-specs
```

**Ce qu'elle fait :**

1. Valide le changement (sauf si `--no-validate`)
2. Demande une confirmation (sauf si `--yes`)
3. Fusionne les spécifications delta dans `openspec/specs/`
4. Déplace le dossier de changement vers `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Commandes de flux de travail

Ces commandes supportent le flux de travail OPSX piloté par les artefacts. Elles sont utiles à la fois pour les humains qui vérifient les progrès et pour les agents qui déterminent les prochaines étapes.

### `openspec new change`

Crée un répertoire de changement et des métadonnées optionnelles enregistrées dans la racine OpenSpec résolue.

```bash
openspec new change <name> [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--description <text>` | Description à ajouter à `index.md` |
| `--goal <text>` | Métadonnées d'objectif optionnelles à stocker avec le changement |
| `--schema <name>` | Schéma de flux de travail à utiliser |
| `--store <id>` | ID du magasin à utiliser comme racine OpenSpec (un magasin est un dépôt OpenSpec autonome que vous avez enregistré) |
| `--json` | Sortie JSON |

Exemples :

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Affiche l'état d'achèvement des artefacts pour un changement.

```
openspec status [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--change <id>` | Nom du changement (invite si omis) |
| `--schema <name>` | Surcharge de schéma (détectée automatiquement à partir de la configuration du changement) |
| `--json` | Sortie en JSON |

**Exemples :**

```bash
# Vérification d'état interactive
openspec status

# État pour un changement spécifique
openspec status --change add-dark-mode

# JSON pour l'utilisation par les agents
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

Obtient des instructions enrichies pour créer un artefact ou appliquer des tâches. Utilisé par les agents IA pour comprendre ce qu'il faut créer ensuite.

```
openspec instructions [artifact] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|----------|-------------|
| `artifact` | Non | ID de l'artefact : `proposal`, `specs`, `design`, `tasks` ou `apply` |

**Options :**

| Option | Description |
|--------|-------------|
| `--change <id>` | Nom du changement (requis en mode non interactif) |
| `--schema <name>` | Surcharge de schéma |
| `--json` | Sortie en JSON |

**Cas spécial :** Utiliser `apply` comme artefact pour obtenir les instructions d'implémentation des tâches.

**Exemples :**

```bash
# Obtenir les instructions pour le prochain artefact
openspec instructions --change add-dark-mode

# Obtenir les instructions pour un artefact spécifique
openspec instructions design --change add-dark-mode

# Obtenir les instructions d'application/d'implémentation
openspec instructions apply --change add-dark-mode

# JSON pour la consommation par l'agent
openspec instructions design --change add-dark-mode --json
```

**La sortie comprend :**

- Le contenu du modèle pour l'artefact
- Le contexte du projet à partir de la configuration
- Le contenu des artefacts dépendants
- Les règles spécifiques à chaque artefact à partir de la configuration

---

### `openspec templates`

Affiche les chemins de modèles résolus pour tous les artefacts dans un schéma.

```
openspec templates [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--schema <name>` | Schéma à inspecter (par défaut : `spec-driven`) |
| `--json` | Sortie en JSON |

**Exemples :**

```bash
# Afficher les chemins de modèles pour le schéma par défaut
openspec templates

# Afficher les modèles pour un schéma personnalisé
openspec templates --schema my-workflow

# JSON pour une utilisation programmatique
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

Liste les schémas de flux de travail disponibles avec leurs descriptions et leurs parcours d'artefacts.

```
openspec schemas [options]
```

**Options :**

| Option | Description |
|--------|-------------|
| `--json` | Sortie en JSON |

**Exemple :**

```bash
openspec schemas
```

**Sortie :**

```
Available schemas:

  spec-driven (package)
    Le flux de travail de développement spec-driven par défaut
    Parcours : proposal → specs → design → tasks

  my-custom (project)
    Flux de travail personnalisé pour ce projet
    Parcours : research → proposal → tasks
```

## Commandes de Schéma

Commandes pour créer et gérer des schémas de flux de travail personnalisés.

### `openspec schema init`

Crée un schéma local au projet.

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
| `--artifacts <list>` | IDs d'artefacts séparés par des virgules (par défaut: `proposal,specs,design,tasks`) |
| `--default` | Définir comme schéma par défaut du projet |
| `--no-default` | Ne pas demander de le définir comme défaut |
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

Copie un schéma existant dans votre projet pour le personnaliser.

```
openspec schema fork <source> [name] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|--------|-------------|
| `source` | Oui | Schéma à copier |
| `name` | Non | Nouveau nom de schéma (par défaut: `<source>-custom`) |

**Options :**

| Option | Description |
|--------|-------------|
| `--force` | Écraser la destination existante |
| `--json` | Sortie au format JSON |

**Exemple :**

```bash
# Fork du schéma spec-driven intégré
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Valide la structure et les modèles d'un schéma.

```
openspec schema validate [name] [options]
```

**Arguments :**

| Argument | Requis | Description |
|----------|--------|-------------|
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

Affiche d'où provient un schéma (utile pour le débogage de la précédence).

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
# Vérifier l'origine d'un schéma
openspec schema which spec-driven
```

**Sortie :**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Précédence des schémas :**

1. Projet : `openspec/schemas/<name>/`
2. Utilisateur : `~/.local/share/openspec/schemas/<name>/`
3. Package : Schémas intégrés

---

## Commandes de Configuration

### `openspec config`

Visualiser et modifier la configuration globale d'OpenSpec.

```
openspec config <subcommand> [options]
```

**Sous-commandes :**

| Sous-commande | Description |
|------------|-------------|
| `path` | Afficher l'emplacement du fichier de configuration |
| `list` | Afficher tous les paramètres actuels |
| `get <key>` | Récupérer une valeur spécifique |
| `set <key> <value>` | Définir une valeur |
| `unset <key>` | Supprimer une clé |
| `reset` | Réinitialiser aux valeurs par défaut |
| `edit` | Ouvrir dans `$EDITOR` |
| `profile [preset]` | Configurer le profil de flux de travail de manière interactive ou via un préréglage |

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

# Définir explicitement une valeur chaîne
openspec config set user.name "My Name" --string

# Supprimer un paramètre personnalisé
openspec config unset user.name

# Réinitialiser toute la configuration
openspec config reset --all --yes

# Modifier le fichier de configuration dans votre éditeur
openspec config edit

# Configurer un profil avec l'assistant basé sur des actions
openspec config profile

# Préréglage rapide : basculer les flux de travail vers core (garde le mode delivery)
openspec config profile core
```

`openspec config profile` commence par un résumé de l'état actuel, puis vous permet de choisir :
- Modifier la livraison + les flux de travail
- Modifier uniquement la livraison
- Modifier uniquement les flux de travail
- Conserver les paramètres actuels (quitter)

Si vous conservez les paramètres actuels, aucune modification n'est écrite et aucun message de mise à jour n'est affiché.
S'il n'y a pas de changements de configuration mais que les fichiers du projet actuel ne sont pas synchronisés avec votre profil/livraison global, OpenSpec affichera un avertissement et suggérera `openspec update`.
Appuyer sur `Ctrl+C` annule également le flux proprement (sans trace d'erreur) et quitte avec le code `130`.
Dans la liste de contrôle du flux de travail, `[x]` signifie que le flux de travail est sélectionné dans la configuration globale. Pour appliquer ces sélections aux fichiers du projet, exécutez `openspec update` (ou choisissez `Apply changes to this project now?` lorsqu'il y a une invite à l'intérieur d'un projet).

**Exemples interactifs :**

```bash
# Mise à jour uniquement de la livraison
openspec config profile
# choisir: Change delivery only
# choisir delivery: Skills only

# Mise à jour uniquement des flux de travail
openspec config profile
# choisir: Change workflows only
# basculer les flux de travail dans la liste de contrôle, puis confirmer
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
|----------|--------|-------------|
| `message` | Oui | Message de commentaire |

**Options :**

| Option | Description |
|--------|-------------|
| `--body <text>` | Description détaillée |

**Prérequis :** Le CLI GitHub (`gh`) doit être installé et authentifié.

**Exemple :**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Gérer les complétions de shell pour le CLI OpenSpec.

```
openspec completion <subcommand> [shell]
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
|------|---------------|
| `0` | Succès |
| `1` | Erreur (échec de validation, fichiers manquants, etc.) |

---

## Variables d'Environnement

| Variable | Description |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Définir à `0` pour désactiver la télémétrie |
| `DO_NOT_TRACK` | Définir à `1` pour désactiver la télémétrie (signal DNT standard) |
| `OPENSPEC_CONCURRENCY` | Concurrence par défaut pour la validation en masse (par défaut: 6) |
| `EDITOR` ou `VISUAL` | Éditeur utilisé par `openspec config edit` |
| `NO_COLOR` | Désactiver la sortie couleur lorsqu'elle est définie |

---

## Documentation Connexe

- [Commands](commands.md) - Commandes slash AI (`/opsx:propose`, `/opsx:apply`, etc.)
- [Workflows](workflows.md) - Modèles courants et quand utiliser chaque commande
- [Customization](customization.md) - Créer des schémas et des modèles personnalisés
- [Getting Started](getting-started.md) - Guide de configuration initiale