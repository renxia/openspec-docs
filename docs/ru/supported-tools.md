# Поддерживаемые инструменты

OpenSpec работает с множеством ИИ-ассистентов для программирования. При запуске команды `openspec init` OpenSpec настраивает выбранные инструменты на основе активного выбора профиля/рабочего процесса и режима доставки.

## Как это работает

Для каждого выбранного инструмента OpenSpec может установить:

1. **Навыки** (если режим доставки включает навыки): `.../skills/openspec-*/SKILL.md`
2. **Команды** (если режим доставки включает команды): специализированные для инструмента файлы команд `opsx-*`

Codex работает только с навыками: OpenSpec устанавливает для Codex файлы `.codex/skills/openspec-*/SKILL.md` даже если режим доставки установлен на `commands`, и не генерирует для Codex пользовательские файлы промптов.

По умолчанию OpenSpec использует профиль `core`, который включает в себя:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

Вы можете включить расширенные рабочие процессы (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) с помощью команды `openspec config profile`, после чего запустите `openspec update`.

## Справочник по директориям инструментов

| Инструмент (ID) | Шаблон пути к навыкам | Шаблон пути к командам |
|-----------------|-----------------------|------------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | Не генерируется (нет адаптера команд; используйте вызовы на основе навыков `/openspec-*`) |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | Не генерируется (только навыки; используйте `.codex/skills/openspec-*`) |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Не генерируется (нет адаптера команд; используйте вызовы на основе навыков `/openspec-*`) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | Не генерируется (нет адаптера команд; используйте вызовы на основе навыков `/openspec-*`) |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | Не генерируется (нет адаптера команд; используйте вызовы на основе навыков `/skill:openspec-*`) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | Не генерируется (нет адаптера команд; используйте вызовы на основе навыков `/openspec-*`) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |

\*\* Файлы промптов GitHub Copilot распознаются как пользовательские слэш-команды в расширениях IDE (VS Code, JetBrains, Visual Studio). Copilot CLI в настоящее время не использует файлы `.github/prompts/*.prompt.md` напрямую.

\*\*\* По умолчанию Hermes загружает навыки из директории `~/.hermes/skills/`. Для использования локальных для проекта навыков OpenSpec добавьте директорию проекта `.hermes/skills/` в параметр `skills.external_dirs` в файле `~/.hermes/config.yaml`; после этого Hermes делает навыки доступными через пользовательские слэш-вызовы, например `/openspec-propose`.

## Неинтерактивная настройка

Для настройки в CI/CD или в скриптах используйте параметр `--tools` (а при необходимости и `--profile`):

```bash
# Configure specific tools
openspec init --tools claude,cursor

# Configure all supported tools
openspec init --tools all

# Skip tool configuration
openspec init --tools none

# Override profile for this init run
openspec init --profile core
```

**Доступные идентификаторы инструментов (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

## Установка в зависимости от рабочего процесса

OpenSpec устанавливает артефакты рабочего процесса на основе выбранных рабочих процессов:

- **Профиль core (по умолчанию):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Пользовательский выбор:** любое подмножество из всех идентификаторов рабочих процессов:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Другими словами, количество навыков/команд зависит от выбранного профиля и режима доставки, а не является фиксированным.

## Названия генерируемых навыков

При выборе в конфигурации профиля/рабочего процесса OpenSpec генерирует следующие навыки:

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

Описание поведения команд см. в разделе [Commands](commands.md), а параметры команд `init`/`update` — в разделе [CLI](cli.md).

## Связанные материалы

- [Справочник по CLI](cli.md) — Команды терминала
- [Команды](commands.md) — Слэш-команды и навыки
- [Начало работы](getting-started.md) — Первоначальная настройка