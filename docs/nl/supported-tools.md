# Ondersteunde Tools

OpenSpec werkt met veel AI-codeerassistenten. Wanneer u `openspec init` uitvoert, configureert OpenSpec geselecteerde tools met behulp van uw actieve profiel/workflowselectie en leveringsmodus.

## Hoe het Werkt

Voor elke geselecteerde tool kan OpenSpec het volgende installeren:

1. **Vaardigheden** (als de levering vaardigheden bevat): `.../skills/openspec-*/SKILL.md`
2. **Commando's** (als de levering commando's bevat): toolspecifieke `opsx-*` commandobestanden

Standaard gebruikt OpenSpec het `core`-profiel, dat het volgende bevat:
- `propose`
- `explore`
- `apply`
- `archive`

U kunt uitgebreide workflows (`new`, `continue`, `ff`, `verify`, `sync`, `bulk-archive`, `onboard`) inschakelen via `openspec config profile`, en vervolgens `openspec update` uitvoeren.

## Verwijzing naar Toolmappen

| Tool (ID) | Vaardigheden padpatroon | Commando padpatroon |
|-----------|-------------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Niet gegenereerd (geen commando-adapter; gebruik op vaardigheden gebaseerde `/openspec-*`-aanroepen) |
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
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | Niet gegenereerd (geen commando-adapter; gebruik op vaardigheden gebaseerde `/openspec-*`-aanroepen) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Codex-commando's worden geïnstalleerd in de globale Codex-home (`$CODEX_HOME/prompts/` indien ingesteld, anders `~/.codex/prompts/`), niet in uw projectmap.

\*\* GitHub Copilot-promptbestanden worden herkend als aangepaste slash-commando's in IDE-extensies (VS Code, JetBrains, Visual Studio). Copilot CLI consumeert momenteel niet direct `.github/prompts/*.prompt.md`.

## Niet-Interactieve Installatie

Voor CI/CD of gescripte installatie, gebruik `--tools` (en optioneel `--profile`):

```bash
# Specifieke tools configureren
openspec init --tools claude,cursor

# Alle ondersteunde tools configureren
openspec init --tools all

# Toolconfiguratie overslaan
openspec init --tools none

# Profiel voor deze init-run overschrijven
openspec init --profile core
```

**Beschikbare tool-ID's (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `forgecode`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

## Workflow-Afhankelijke Installatie

OpenSpec installeert workflow-artefacten op basis van geselecteerde workflows:

- **Core-profiel (standaard):** `propose`, `explore`, `apply`, `archive`
- **Aangepaste selectie:** een willekeurige subset van alle workflow-ID's:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Met andere woorden, het aantal vaardigheden/commando's is profiel- en leveringsafhankelijk, niet vast.

## Gegenereerde Vaardigheidsnamen

Wanneer geselecteerd door profiel/workflowconfiguratie, genereert OpenSpec deze vaardigheden:

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

- [CLI-Referentie](cli.md) — Terminalcommando's
- [Commando's](commands.md) — Slash-commando's en vaardigheden
- [Aan de Slag](getting-started.md) — Eerste installatie