# Obsługiwane narzędzia

OpenSpec współpracuje z wieloma asystentami kodowania AI. Po uruchomieniu polecenia `openspec init` OpenSpec konfiguruje wybrane narzędzia na podstawie aktywnego wyboru profilu/przepływu pracy oraz trybu dostarczania.

## Jak to działa

Dla każdego wybranego narzędzia OpenSpec może zainstalować:

1. **Umiejętności** (jeśli tryb dostarczania obejmuje umiejętności): `.../skills/openspec-*/SKILL.md`
2. **Polecenia** (jeśli tryb dostarczania obejmuje polecenia): specyficzne dla narzędzia pliki poleceń `opsx-*`

Codex obsługuje wyłącznie umiejętności: OpenSpec instaluje `.codex/skills/openspec-*/SKILL.md` dla Codex nawet wtedy, gdy tryb dostarczania jest ustawiony na `commands`, a nie generuje niestandardowych plików promptów dla Codex.

Domyślnie OpenSpec używa profilu `core`, który obejmuje:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

Możesz włączyć rozszerzone przepływy pracy (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) za pomocą polecenia `openspec config profile`, a następnie uruchomić `openspec update`.

## Odniesienie do katalogów narzędzi

| Narzędzie (ID) | Wzorzec ścieżki umiejętności | Wzorzec ścieżki poleceń |
|----------------|-------------------------------|--------------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | Nie generowane (brak adaptera poleceń; używaj wywołań opartych na umiejętnościach `/openspec-*`) |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | Nie generowane (wyłącznie umiejętności; użyj `.codex/skills/openspec-*`) |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Nie generowane (brak adaptera poleceń; używaj wywołań opartych na umiejętnościach `/openspec-*`) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | Nie generowane (brak adaptera poleceń; używaj wywołań opartych na umiejętnościach `/openspec-*`) |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | Nie generowane (brak adaptera poleceń; używaj wywołań opartych na umiejętnościach `/skill:openspec-*`) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | Nie generowane (brak adaptera poleceń; używaj wywołań opartych na umiejętnościach `/openspec-*`) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |

\*\* Pliki promptów GitHub Copilot są rozpoznawane jako niestandardowe polecenia ukośnikowe w rozszerzeniach IDE (VS Code, JetBrains, Visual Studio). CLI Copilot obecnie nie korzysta bezpośrednio z plików `.github/prompts/*.prompt.md`.

\*\*\* Hermes domyślnie ładuje umiejętności z katalogu `~/.hermes/skills/`. Aby używać umiejętności OpenSpec lokalnych dla projektu, dodaj katalog projektu `.hermes/skills/` do klucza `skills.external_dirs` w pliku `~/.hermes/config.yaml`; wtedy Hermes udostępnia umiejętności za pomocą poleceń ukośnikowych dostępnych dla użytkownika, np. `/openspec-propose`.

## Konfiguracja nieinteraktywna

Do konfiguracji w środowiskach CI/CD lub skryptowej użyj parametru `--tools` (opcjonalnie również `--profile`):

```bash
# Skonfiguruj wybrane narzędzia
openspec init --tools claude,cursor

# Skonfiguruj wszystkie obsługiwane narzędzia
openspec init --tools all

# Pomiń konfigurację narzędzi
openspec init --tools none

# Zastąp profil dla tego uruchomienia init
openspec init --profile core
```

**Dostępne identyfikatory narzędzi (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

## Instalacja zależna od przepływu pracy

OpenSpec instaluje artefakty przepływów pracy na podstawie wybranych przepływów pracy:

- **Profil podstawowy (domyślny):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Wybór niestandardowy:** dowolny podzbiór wszystkich identyfikatorów przepływów pracy: `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Innymi słowy, liczba umiejętności/poleceń zależy od profilu i trybu dostarczania, nie jest stała.

## Nazwy generowanych umiejętności

Gdy są wybrane w konfiguracji profilu/przepływu pracy, OpenSpec generuje te umiejętności:

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

Zobacz [Polecenia](commands.md), aby poznać zachowanie poleceń, oraz [CLI](cli.md), aby poznać opcje `init`/`update`.

## Powiązane zasoby

- [Dokumentacja CLI](cli.md) — Polecenia terminalowe
- [Polecenia](commands.md) — Polecenia ukośnikowe i umiejętności
- [Pierwsze kroki](getting-started.md) — Konfiguracja początkowa