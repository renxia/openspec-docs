# Strumenti supportati

OpenSpec funziona con molti assistenti di codifica AI. Quando esegui `openspec init`, OpenSpec configura gli strumenti selezionati utilizzando la selezione attiva di profilo/flusso di lavoro e la modalità di consegna.

## Come funziona

Per ogni strumento selezionato, OpenSpec può installare:

1. **Competenze** (se la consegna include le competenze): `.../skills/openspec-*/SKILL.md`
2. **Comandi** (se la consegna include i comandi): file di comando specifici dello strumento `opsx-*`

Codex supporta solo le competenze: OpenSpec installa `.codex/skills/openspec-*/SKILL.md` per Codex anche quando la consegna è impostata su `commands`, e non genera file di prompt personalizzati per Codex.

Per impostazione predefinita, OpenSpec utilizza il profilo `core`, che include:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

Puoi abilitare i flussi di lavoro estesi (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) tramite `openspec config profile`, quindi eseguire `openspec update`.

## Riferimento directory degli strumenti

| Strumento (ID) | Percorso pattern delle competenze | Percorso pattern dei comandi |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | Non generato (nessun adattatore per comandi; usa le invocazioni basate su competenze `/openspec-*`) |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | Non generato (solo competenze; usa `.codex/skills/openspec-*`) |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Non generato (nessun adattatore per comandi; usa le invocazioni basate su competenze `/openspec-*`) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | Non generato (nessun adattatore per comandi; usa le invocazioni basate su competenze `/openspec-*`) |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | Non generato (nessun adattatore per comandi; usa le invocazioni basate su competenze `/skill:openspec-*`) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | Non generato (nessun adattatore per comandi; usa le invocazioni basate su competenze `/openspec-*`) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |

\*\* I file di prompt di GitHub Copilot sono riconosciuti come comandi slash personalizzati nelle estensioni IDE (VS Code, JetBrains, Visual Studio). La CLI di Copilot attualmente non utilizza direttamente `.github/prompts/*.prompt.md`.

\*\*\* Hermes carica le competenze da `~/.hermes/skills/` per impostazione predefinita. Per utilizzare le competenze OpenSpec locali del progetto, aggiungi la directory `.hermes/skills/` del progetto a `skills.external_dirs` in `~/.hermes/config.yaml`; Hermes quindi rende disponibili le competenze con invocazioni slash rivolte all'utente come `/openspec-propose`.

## Configurazione non interattiva

Per configurazioni CI/CD o automatizzate tramite script, utilizza `--tools` (e facoltativamente `--profile`):

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

**ID strumenti disponibili (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

## Installazione dipendente dal flusso di lavoro

OpenSpec installa gli artefatti del flusso di lavoro in base ai flussi di lavoro selezionati:

- **Profilo core (predefinito):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Selezione personalizzata:** qualsiasi sottoinsieme di tutti gli ID dei flussi di lavoro:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

In altre parole, il numero di competenze/comandi dipende dal profilo e dalla modalità di consegna, non è fisso.

## Nomi delle competenze generate

Quando selezionate dalla configurazione di profilo/flusso di lavoro, OpenSpec genera queste competenze:

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

Vedi [Comandi](commands.md) per il comportamento dei comandi e [CLI](cli.md) per le opzioni di `init`/`update`.

## Correlati

- [Riferimento CLI](cli.md) — Comandi da terminale
- [Comandi](commands.md) — Comandi slash e competenze
- [Guida introduttiva](getting-started.md) — Configurazione iniziale