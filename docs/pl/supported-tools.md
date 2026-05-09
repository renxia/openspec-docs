# Obsługiwane Narzędzia

OpenSpec współpracuje z wieloma asystentami AI do kodowania. Gdy uruchomiasz `openspec init`, OpenSpec konfiguruje wybrane narzędzia na podstawie aktywnego profilu/wyboru przepływu pracy i trybu dostarczania.

## Jak to działa

Dla każdego wybranego narzędzia OpenSpec może zainstalować:

1. **Umiejętności** (jeśli dostarczanie obejmuje umiejętności): `.../skills/openspec-*/SKILL.md`
2. **Polecenia** (jeśli dostarczanie obejmuje polecenia): specyficzne dla narzędzia pliki poleceń `opsx-*`

Domyślnie OpenSpec używa profilu `core`, który zawiera:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

Możesz włączyć rozszerzone przepływy pracy (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) za pomocą `openspec config profile`, a następnie uruchomić `openspec update`.

## Odwołanie do katalogów narzędzi

| Narzędzie (ID) | Wzorzec ścieżki umiejętności | Wzorzec ścieżki poleceń |
|----------------|------------------------------|--------------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Nie generowane (brak adaptera poleceń; użyj wywołań opartych na umiejętnościach `/openspec-*`) |
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
| Kimi CLI (`kimi`) | `.kimi/skills/openspec-*/SKILL.md` | Nie generowane (brak adaptera poleceń; użyj wywołań opartych na umiejętnościach `/skill:openspec-*`) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | Nie generowane (brak adaptera poleceń; użyj wywołań opartych na umiejętnościach `/openspec-*`) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Polecenia Codex są instalowane w globalnym katalogu domowym Codex (`$CODEX_HOME/prompts/` jeśli ustawione, w przeciwnym razie `~/.codex/prompts/`), a nie w katalogu projektu.

\*\* Pliki podpowiedzi GitHub Copilot są rozpoznawane jako niestandardowe polecenia ukośnikowe w rozszerzeniach IDE (VS Code, JetBrains, Visual Studio). CLI Copilot obecnie nie przetwarza bezpośrednio plików `.github/prompts/*.prompt.md`.

## Konfiguracja nieinteraktywna

Dla CI/CD lub konfiguracji skryptowej użyj `--tools` (i opcjonalnie `--profile`):

```bash
# Konfiguracja konkretnych narzędzi
openspec init --tools claude,cursor

# Konfiguracja wszystkich obsługiwanych narzędzi
openspec init --tools all

# Pominięcie konfiguracji narzędzi
openspec init --tools none

# Nadpisanie profilu dla tego uruchomienia init
openspec init --profile core
```

**Dostępne identyfikatory narzędzi (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

## Instalacja zależna od przepływu pracy

OpenSpec instaluje artefakty przepływu pracy na podstawie wybranych przepływów pracy:

- **Profil core (domyślny):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Niestandardowy wybór:** dowolny podzbiór wszystkich identyfikatorów przepływów pracy:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Innymi słowy, liczby umiejętności/poleceń są zależne od profilu i sposobu dostarczania, a nie stałe.

## Wygenerowane nazwy umiejętności

Gdy są wybrane przez konfigurację profilu/przepływu pracy, OpenSpec generuje następujące umiejętności:

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

Zobacz [Polecenia](commands.md) dotyczące zachowania poleceń i [CLI](cli.md) dotyczące opcji `init`/`update`.

## Powiązane

- [Referencja CLI](cli.md) — Polecenia terminala
- [Polecenia](commands.md) — Polecenia ukośnikowe i umiejętności
- [Pierwsze kroki](getting-started.md) — Konfiguracja początkowa