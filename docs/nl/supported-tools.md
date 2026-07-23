# Ondersteunde Hulpmiddelen

OpenSpec werkt met veel AI-code-assistenten. Wanneer je `openspec init` uitvoert, configureert OpenSpec de geselecteerde hulpmiddelen op basis van je actieve profiel/werkstroomselectie en leveringsmodus.

## Hoe het werkt

Voor elk geselecteerd hulpmiddel kan OpenSpec installeren:
1. **Skills** (als levering skills omvat): `.../skills/openspec-*/SKILL.md`
2. **Opdrachten** (als levering opdrachten omvat): toolspecifieke `opsx-*` opdrachtbestanden

Codex is alleen voor skills: OpenSpec installeert `.codex/skills/openspec-*/SKILL.md` voor Codex, zelfs wanneer de levering is ingesteld op `commands`, en het genereert geen aangepaste promptbestanden voor Codex.

Standaard gebruikt OpenSpec het `core`-profiel, dat de volgende bevat:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

Je kunt uitgebreide werkstromen (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) inschakelen via `openspec config profile`, waarna je `openspec update` uitvoert.

## Hulpmiddelmapverwijzinging

| Hulpmiddel (ID) | Skills padpatroon | Opdracht padpatroon |
|-----------------|-------------------|---------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | Niet gegenereerd (geen opdrachtadapter; gebruik skill-based `/openspec-*` aanroepen) |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | Niet gegenereerd (alleen voor skills; gebruik `.codex/skills/openspec-*`) |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Niet gegenereerd (geen opdrachtadapter; gebruik skill-based `/openspec-*` aanroepen) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | Niet gegenereerd (geen opdrachtadapter; gebruik skill-based `/openspec-*` aanroepen) |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | Niet gegenereerd (geen opdrachtadapter; gebruik skill-based `/skill:openspec-*` aanroepen) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | Niet gegenereerd (geen opdrachtadapter; gebruik skill-based `/openspec-*` aanroepen) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |

\*\* GitHub Copilot-promptbestanden worden herkend als aangepaste slash-opdrachten in IDE-extensies (VS Code, JetBrains, Visual Studio). Copilot CLI verwerkt `.github/prompts/*.prompt.md` momenteel niet direct.

\*\*\* Hermes laadt standaard skills uit `~/.hermes/skills/`. Om projectlokale OpenSpec-skills te gebruiken, voeg je de projectmap `.hermes/skills/` toe aan `skills.external_dirs` in `~/.hermes/config.yaml`; Hermes maakt daarna skills beschikbaar met voor de gebruiker zichtbare slash-oproepen zoals `/openspec-propose`.

## Niet-interactieve opstelling

Voor CI/CD of een geautomatiseerde opstelling, gebruik je `--tools` (en optioneel `--profile`):

```bash
# Configureer specifieke hulpmiddelen
openspec init --tools claude,cursor

# Configureer alle ondersteunde hulpmiddelen
openspec init --tools all

# Sla hulpmiddelconfiguratie over
openspec init --tools none

# Overschrijf het profiel voor deze init-uitvoering
openspec init --profile core
```

**Beschikbare hulpmiddel-ID's (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

## Werkstroomafhankelijke installatie

OpenSpec installeert werkstroom-artefacten op basis van geselecteerde werkstromen:

- **Core-profiel (standaard):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Aangepaste selectie:** elke subset van alle werkstroom-ID's: `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Met andere woorden, het aantal skills/opdrachten is profielafhankelijk en leveringsafhankelijk, niet vast.

## Gegenereerde skillnamen

Wanneer geselecteerd door profiel/werkstroomconfiguratie, genereert OpenSpec deze skills:

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

Zie [Opdrachten](commands.md) voor opdrachtgedrag en [CLI](cli.md) voor `init`/`update`-opties.

## Gerelateerd

- [CLI Referentie](cli.md) — Terminalopdrachten
- [Opdrachten](commands.md) — Slash-opdrachten en skills
- [Aan de slag](getting-started.md) — Eerste keer opzetten