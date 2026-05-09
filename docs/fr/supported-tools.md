# Outils supportés

OpenSpec fonctionne avec de nombreux assistants de codage IA. Lorsque vous exécutez `openspec init`, OpenSpec configure les outils sélectionnés en utilisant votre profil/workflow actif et le mode de livraison.

## Fonctionnement

Pour chaque outil sélectionné, OpenSpec peut installer :

1. **Compétences** (si la livraison inclut des compétences) : `.../skills/openspec-*/SKILL.md`
2. **Commandes** (si la livraison inclut des commandes) : fichiers de commande spécifiques à l'outil `opsx-*`

Par défaut, OpenSpec utilise le profil `core`, qui inclut :
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

Vous pouvez activer des workflows étendus (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) via `openspec config profile`, puis exécuter `openspec update`.

## Répertoire des outils

| Outil (ID) | Chemin des compétences | Chemin des commandes |
|------------|------------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Non généré (pas d'adaptateur de commande ; utiliser les invocations basées sur les compétences `/openspec-*`) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi CLI (`kimi`) | `.kimi/skills/openspec-*/SKILL.md` | Non généré (pas d'adaptateur de commande ; utiliser les invocations basées sur les compétences `/skill:openspec-*`) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | Non généré (pas d'adaptateur de commande ; utiliser les invocations basées sur les compétences `/openspec-*`) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Les commandes Codex sont installées dans le répertoire racine global de Codex (`$CODEX_HOME/prompts/` si défini, sinon `~/.codex/prompts/`), pas dans votre répertoire de projet.

\*\* Les fichiers de prompt GitHub Copilot sont reconnus comme des commandes slash personnalisées dans les extensions IDE (VS Code, JetBrains, Visual Studio). Le CLI Copilot ne consomme actuellement pas directement les fichiers `.github/prompts/*.prompt.md`.

## Configuration non interactive

Pour les CI/CD ou les configurations scriptées, utilisez `--tools` (et optionnellement `--profile`) :

```bash
# Configurer des outils spécifiques
openspec init --tools claude,cursor

# Configurer tous les outils supportés
openspec init --tools all

# Ignorer la configuration des outils
openspec init --tools none

# Remplacer le profil pour cette exécution init
openspec init --profile core
```

**ID d'outils disponibles (`--tools`) :** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

## Installation dépendante du workflow

OpenSpec installe les artefacts de workflow en fonction des workflows sélectionnés :

- **Profil core (par défaut) :** `propose`, `explore`, `apply`, `sync`, `archive`
- **Sélection personnalisée :** tout sous-ensemble de tous les ID de workflow :
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

En d'autres termes, le nombre de compétences/commandes dépend du profil et de la livraison, il n'est pas fixe.

## Noms des compétences générées

Lorsqu'elles sont sélectionnées par la configuration du profil/workflow, OpenSpec génère ces compétences :

- `openspec-propose`
- `openspec-explore`
- `openspec-new-change`
- `openspec-continue-change`
- `openspec-apply-change`
- `openspec-ff-change`
- `openspec-sync-specs`
- `openspec-archive-change`
- `openspec-bulk-archive-change`
- `openspec-verify-change`
- `openspec-onboard`

Voir [Commandes](commands.md) pour le comportement des commandes et [CLI](cli.md) pour les options `init`/`update`.

## Liens connexes

- [Référence CLI](cli.md) — Commandes du terminal
- [Commandes](commands.md) — Commandes slash et compétences
- [Démarrage](getting-started.md) — Configuration initiale