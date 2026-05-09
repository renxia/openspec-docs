# Unterstützte Werkzeuge

OpenSpec funktioniert mit vielen KI-Coding-Assistenten. Wenn Sie `openspec init` ausführen, konfiguriert OpenSpec die ausgewählten Werkzeuge basierend auf Ihrem aktiven Profil/Workflow und dem Auslieferungsmodus.

## Funktionsweise

Für jedes ausgewählte Werkzeug kann OpenSpec installieren:

1. **Fähigkeiten** (wenn die Auslieferung Skills enthält): `.../skills/openspec-*/SKILL.md`
2. **Befehle** (wenn die Auslieferung Commands enthält): werkzeugspezifische `opsx-*` Befehlsdateien

Standardmäßig verwendet OpenSpec das `core`-Profil, das Folgendes enthält:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

Sie können erweiterte Arbeitsabläufe (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) über `openspec config profile` aktivieren und anschließend `openspec update` ausführen.

## Werkzeug-Verzeichnisreferenz

| Werkzeug (ID) | Fähigkeiten-Pfadmuster | Befehlspfadmuster |
|---------------|------------------------|-------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Nicht generiert (kein Befehlsadapter; verwende skill-basierte `/openspec-*` Aufrufe) |
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
| Kimi CLI (`kimi`) | `.kimi/skills/openspec-*/SKILL.md` | Nicht generiert (kein Befehlsadapter; verwende skill-basierte `/skill:openspec-*` Aufrufe) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | Nicht generiert (kein Befehlsadapter; verwende skill-basierte `/openspec-*` Aufrufe) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Codex-Befehle werden im globalen Codex-Heimatverzeichnis installiert (`$CODEX_HOME/prompts/`, falls gesetzt, sonst `~/.codex/prompts/`), nicht in Ihrem Projektverzeichnis.

\*\* GitHub Copilot-Prompt-Dateien werden in IDE-Erweiterungen (VS Code, JetBrains, Visual Studio) als benutzerdefinierte Slash-Befehle erkannt. Die Copilot-CLI verarbeitet derzeit `.github/prompts/*.prompt.md` nicht direkt.

## Nicht-interaktive Einrichtung

Für CI/CD oder skriptgestützte Einrichtung verwenden Sie `--tools` (und optional `--profile`):

```bash
# Bestimmte Werkzeuge konfigurieren
openspec init --tools claude,cursor

# Alle unterstützten Werkzeuge konfigurieren
openspec init --tools all

# Werkzeugkonfiguration überspringen
openspec init --tools none

# Profil für diesen init-Durchlauf überschreiben
openspec init --profile core
```

**Verfügbare Werkzeug-IDs (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

## Workflow-abhängige Installation

OpenSpec installiert Workflow-Artefakte basierend auf den ausgewählten Workflows:

- **Core-Profil (Standard):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Benutzerdefinierte Auswahl:** eine Teilmenge aller Workflow-IDs:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Mit anderen Worten, die Anzahl der Skills/Befehle ist profil- und auslieferungsabhängig, nicht festgelegt.

## Generierte Skill-Namen

Wenn sie durch die Profil-/Workflow-Konfiguration ausgewählt werden, generiert OpenSpec diese Skills:

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

Siehe [Befehle](commands.md) für das Befehlsverhalten und [CLI](cli.md) für `init`/`update`-Optionen.

## Verwandt

- [CLI-Referenz](cli.md) — Terminalbefehle
- [Befehle](commands.md) — Slash-Befehle und Skills
- [Erste Schritte](getting-started.md) — Ersteinrichtung