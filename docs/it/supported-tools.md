# Strumenti Supportati

OpenSpec funziona con molti assistenti AI per la codifica. Quando esegui `openspec init`, OpenSpec configura gli strumenti selezionati utilizzando il tuo profilo/flusso di lavoro attivo e la modalità di consegna.

## Come Funziona

Per ogni strumento selezionato, OpenSpec può installare:

1. **Skill** (se la consegna include skill): `.../skills/openspec-*/SKILL.md`
2. **Comandi** (se la consegna include comandi): file di comando `opsx-*` specifici per lo strumento

Per impostazione predefinita, OpenSpec utilizza il profilo `core`, che include:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

Puoi abilitare flussi di lavoro espansi (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) tramite `openspec config profile`, quindi eseguire `openspec update`.

## Riferimento della Directory degli Strumenti

| Strumento (ID) | Pattern percorso skill | Pattern percorso comando |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Non generato (nessun adattatore di comandi; usa invocazioni basate su skill `/openspec-*`) |
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
| Kimi CLI (`kimi`) | `.kimi/skills/openspec-*/SKILL.md` | Non generato (nessun adattatore di comandi; usa invocazioni basate su skill `/skill:openspec-*`) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | Non generato (nessun adattatore di comandi; usa invocazioni basate su skill `/openspec-*`) |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | Non generato (nessun adattatore di comandi; usa invocazioni basate su skill `/openspec-*`) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* I comandi Codex vengono installati nella home globale di Codex (`$CODEX_HOME/prompts/` se impostata, altrimenti `~/.codex/prompts/`), non nella directory del tuo progetto.

\*\* I file prompt di GitHub Copilot sono riconosciuti come comandi slash personalizzati nelle estensioni IDE (VS Code, JetBrains, Visual Studio). Copilot CLI attualmente non consuma direttamente `.github/prompts/*.prompt.md`.

## Configurazione Non Interattiva

Per configurazioni CI/CD o automatizzate, usa `--tools` (e opzionalmente `--profile`):

```bash
# Configura strumenti specifici
openspec init --tools claude,cursor

# Configura tutti gli strumenti supportati
openspec init --tools all

# Salta la configurazione degli strumenti
openspec init --tools none

# Sovrascrivi il profilo per questa esecuzione di init
openspec init --profile core
```

**ID strumenti disponibili (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `vibe`, `windsurf`

## Installazione Dipendente dal Flusso di Lavoro

OpenSpec installa gli artefatti del flusso di lavoro in base ai flussi di lavoro selezionati:

- **Profilo core (predefinito):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Selezione personalizzata:** qualsiasi sottoinsieme di tutti gli ID di flusso di lavoro:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

In altre parole, il numero di skill/comandi dipende dal profilo e dalla consegna, non è fisso.

## Nomi delle Skill Generate

Quando selezionate dalla configurazione di profilo/flusso di lavoro, OpenSpec genera le seguenti skill:

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

Vedi [Comandi](commands.md) per il comportamento dei comandi e [CLI](cli.md) per le opzioni di `init`/`update`.

## Correlati

- [Riferimento CLI](cli.md) — Comandi del terminale
- [Comandi](commands.md) — Comandi slash e skill
- [Per Iniziare](getting-started.md) — Configurazione iniziale