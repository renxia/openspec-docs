# Unterstützte Tools

OpenSpec funktioniert mit vielen KI-Coding-Assistenten. Wenn Sie `openspec init` ausführen, konfiguriert OpenSpec die ausgewählten Tools anhand Ihrer aktiven Profil-/Workflow-Auswahl und des Liefermodus.

## Funktionsweise

Für jedes ausgewählte Tool kann OpenSpec Folgendes installieren:

1. **Skills** (falls die Lieferung Skills umfasst): `.../skills/openspec-*/SKILL.md`
2. **Befehle** (falls die Lieferung Befehle umfasst): toolspezifische `opsx-*`-Befehlsdateien

Codex ist ausschließlich Skill-basiert: OpenSpec installiert `.codex/skills/openspec-*/SKILL.md` für Codex, auch wenn die Lieferung auf `commands` eingestellt ist, und generiert keine benutzerdefinierten Prompt-Dateien für Codex.

Standardmäßig verwendet OpenSpec das Profil `core`, das Folgendes umfasst:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

Sie können erweiterte Workflows (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) über `openspec config profile` aktivieren und anschließend `openspec update` ausführen.

## Tool-Verzeichnisreferenz

| Tool (ID) | Muster für Skill-Pfade | Muster für Befehlspfade |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | Nicht generiert (kein Befehlsadapter; verwenden Sie Skill-basierte `/openspec-*`-Aufrufe) |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | Nicht generiert (nur Skills; verwenden Sie `.codex/skills/openspec-*`) |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Nicht generiert (kein Befehlsadapter; verwenden Sie Skill-basierte `/openspec-*`-Aufrufe) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | Nicht generiert (kein Befehlsadapter; verwenden Sie Skill-basierte `/openspec-*`-Aufrufe) |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | Nicht generiert (kein Befehlsadapter; verwenden Sie Skill-basierte `/skill:openspec-*`-Aufrufe) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | Nicht generiert (kein Befehlsadapter; verwenden Sie Skill-basierte `/openspec-*`-Aufrufe) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |

\*\* GitHub Copilot-Promptdateien werden in IDE-Erweiterungen (VS Code, JetBrains, Visual Studio) als benutzerdefinierte Slash-Befehle erkannt. Die Copilot-CLI verarbeitet `.github/prompts/*.prompt.md` derzeit nicht direkt.

\*\*\* Hermes lädt Skills standardmäßig aus `~/.hermes/skills/`. Um projektspezifische OpenSpec-Skills zu verwenden, fügen Sie das Verzeichnis `.hermes/skills/` des Projekts zu `skills.external_dirs` in `~/.hermes/config.yaml` hinzu; Hermes stellt die Skills dann mit benutzerorientierten Slash-Aufrufen wie `/openspec-propose` bereit.

## Nicht-interaktive Einrichtung

Für CI/CD oder skriptgesteuerte Einrichtung verwenden Sie `--tools` (und optional `--profile`):

```bash
# Ausgewählte Tools konfigurieren
openspec init --tools claude,cursor

# Alle unterstützten Tools konfigurieren
openspec init --tools all

# Tool-Konfiguration überspringen
openspec init --tools none

# Profil für diesen init-Lauf überschreiben
openspec init --profile core
```

**Verfügbare Tool-IDs (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

## Workflow-abhängige Installation

OpenSpec installiert Workflow-Artefakte anhand der ausgewählten Workflows:

- **Core-Profil (Standard):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Benutzerdefinierte Auswahl:** Beliebige Teilmenge aller Workflow-IDs:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Mit anderen Worten: Die Anzahl der Skills und Befehle hängt vom verwendeten Profil und der Lieferart ab und ist nicht festgelegt.

## Generierte Skill-Namen

Wenn sie durch die Profil-/Workflow-Konfiguration ausgewählt sind, generiert OpenSpec folgende Skills:

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

Weitere Informationen zum Verhalten von Befehlen finden Sie unter [Befehle](commands.md), Optionen für `init`/`update` unter [CLI](cli.md).

## Verwandte Themen

- [CLI-Referenz](cli.md) — Terminalbefehle
- [Befehle](commands.md) — Slash-Befehle und Skills
- [Erste Schritte](getting-started.md) — Ersteinrichtung