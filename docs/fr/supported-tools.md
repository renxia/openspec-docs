# Outils pris en charge

OpenSpec fonctionne avec de nombreux assistants de codage IA. Lorsque vous exécutez `openspec init`, OpenSpec configure les outils sélectionnés en fonction de votre profil actif/votre sélection de workflow et du mode de livraison.

## Fonctionnement

Pour chaque outil sélectionné, OpenSpec peut installer :

1. **Compétences** (si la livraison inclut des compétences) : `.../skills/openspec-*/SKILL.md`
2. **Commandes** (si la livraison inclut des commandes) : fichiers de commandes spécifiques à l'outil `opsx-*`

Codex ne prend en charge que les compétences : OpenSpec installe `.codex/skills/openspec-*/SKILL.md` pour Codex même lorsque le mode de livraison est défini sur `commands`, et ne génère pas de fichiers d'invite personnalisés pour Codex.

Par défaut, OpenSpec utilise le profil `core`, qui inclut :
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

Vous pouvez activer les workflows étendus (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) via `openspec config profile`, puis exécuter `openspec update`.

## Référence des répertoires des outils

| Outil (ID) | Modèle de chemin des compétences | Modèle de chemin des commandes |
|-----------|---------------------------------|--------------------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | Non généré (pas d'adaptateur de commande ; utilisez des invocations basées sur les compétences `/openspec-*`) |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | Non généré (compétences uniquement ; utilisez `.codex/skills/openspec-*`) |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Non généré (pas d'adaptateur de commande ; utilisez des invocations basées sur les compétences `/openspec-*`) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | Non généré (pas d'adaptateur de commande ; utilisez des invocations basées sur les compétences `/openspec-*`) |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | Non généré (pas d'adaptateur de commande ; utilisez des invocations basées sur les compétences `/skill:openspec-*`) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | Non généré (pas d'adaptateur de commande ; utilisez des invocations basées sur les compétences `/openspec-*`) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |

\*\* Les fichiers d'invite GitHub Copilot sont reconnus comme des commandes slash personnalisées dans les extensions d'IDE (VS Code, JetBrains, Visual Studio). L'interface CLI de Copilot ne consomme pas actuellement directement les fichiers `.github/prompts/*.prompt.md`.

\*\*\* Hermes charge les compétences depuis `~/.hermes/skills/` par défaut. Pour utiliser les compétences OpenSpec locales au projet, ajoutez le répertoire `.hermes/skills/` du projet à `skills.external_dirs` dans le fichier `~/.hermes/config.yaml` ; Hermes expose ensuite les compétences avec des invocations slash accessibles aux utilisateurs, comme `/openspec-propose`.

## Configuration non interactive

Pour une configuration CI/CD ou scriptée, utilisez `--tools` (et éventuellement `--profile`) :

```bash
# Configurer des outils spécifiques
openspec init --tools claude,cursor

# Configurer tous les outils pris en charge
openspec init --tools all

# Ignorer la configuration des outils
openspec init --tools none

# Remplacer le profil pour cette exécution de init
openspec init --profile core
```

**IDs d'outils disponibles (`--tools`) :** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

## Installation dépendante du workflow

OpenSpec installe les artefacts de workflow en fonction des workflows sélectionnés :

- **Profil core (par défaut) :** `propose`, `explore`, `apply`, `sync`, `archive`
- **Sélection personnalisée :** n'importe quel sous-ensemble de tous les IDs de workflow : `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

En d'autres termes, le nombre de compétences/commandes dépend du profil et du mode de livraison, il n'est pas fixe.

## Noms des compétences générées

Lorsqu'elles sont sélectionnées par la configuration du profil/du workflow, OpenSpec génère ces compétences :

- `openspec-propose`
- `openspec-explore`
- `openspec-new-change`
- `openspec-continue-change`
- `openspec-apply-change`
- `openspec-update-change`
- `openspec-ff-change`
- `openspec-sync-specs`
- `openspec-archive-change`
- `openspec-bulk-archive-change`
- `openspec-verify-change`
- `openspec-onboard`

Consultez [Commands](commands.md) pour le comportement des commandes et [CLI](cli.md) pour les options `init`/`update`.

## Ressources associées

- [Référence CLI](cli.md) — Commandes terminal
- [Commands](commands.md) — Commandes slash et compétences
- [Prise en main](getting-started.md) — Configuration initiale