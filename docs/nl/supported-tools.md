# Ondersteunde Tools

OpenSpec werkt met veel AI-codingassistenten. Wanneer je `openspec init` uitvoert, configureert OpenSpec geselecteerde tools op basis van je actieve profiel/workflowselectie en leveringsmodus.

## Hoe het werkt

Voor elke geselecteerde tool kan OpenSpec installeren:

1. **Skills** (als levering skills bevat): `.../skills/openspec-*/SKILL.md`
2. **Commands** (als levering commands bevat): tool-specifieke `opsx-*` commandobestanden

Standaard gebruikt OpenSpec het `core`-profiel, dat het volgende bevat:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

Je kunt uitgebreide workflows inschakelen (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) via `openspec config profile`, en vervolgens `openspec update` uitvoeren.

## Tool Directory Referentie

| Tool (ID) | Skills padpatroon | Command padpatroon |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Niet gegenereerd (geen commando-adapter; gebruik skill-gebaseerde `/openspec-*` aanroepen) |
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
| Kimi CLI (`kimi`) | `.kimi/skills/openspec-*/SKILL.md` | Niet gegenereerd (geen commando-adapter; gebruik skill-gebaseerde `/skill:openspec-*` aanroepen) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | Niet gegenereerd (geen commando-adapter; gebruik skill-gebaseerde `/openspec-*` aanroepen) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Codex-commando's worden geïnstalleerd in de globale Codex-home (`$CODEX_HOME/prompts/` indien ingesteld, anders `~/.codex/prompts/`), niet in je projectmap.

\*\* GitHub Copilot-promptbestanden worden herkend als aangepaste slashcommando's in IDE-extensies (VS Code, JetBrains, Visual Studio). Copilot CLI verwerkt momenteel geen `.github/prompts/*.prompt.md` direct.

## Niet-interactieve installatie

Voor CI/CD of gescripte installatie, gebruik `--tools` (en optioneel `--profile`):

```bash
# Configureer specifieke tools
openspec init --tools claude,cursor

# Configureer alle ondersteunde tools
openspec init --tools all

# Sla toolconfiguratie over
openspec init --tools none

# Overschrijf profiel voor deze init-run
openspec init --profile core
```

**Beschikbare tool-ID's (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

## Workflow-afhankelijke installatie

OpenSpec installeert workflow-artefacten op basis van geselecteerde workflows:

- **Core-profiel (standaard):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Aangepaste selectie:** een subset van alle workflow-ID's:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Met andere woorden, het aantal skills/commando's is profiel- en leveringsafhankelijk, niet vast.

## Gegenereerde skillnamen

Wanneer geselecteerd door profiel/workflowconfiguratie, genereert OpenSpec de volgende skills:

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

Zie [Commando's](commands.md) voor commandogedrag en [CLI](cli.md) voor `init`/`update`-opties.

## Gerelateerd

- [CLI-referentie](cli.md) — Terminalcommando's
- [Commando's](commands.md) — Slashcommando's en skills
- [Aan de slag](getting-started.md) — Eerste installatie