# Поддерживаемые инструменты

OpenSpec работает со многими ИИ-ассистентами для кодирования. При запуске `openspec init` OpenSpec настраивает выбранные инструменты, используя ваш активный профиль/выбор рабочего процесса и режим доставки.

## Как это работает

Для каждого выбранного инструмента OpenSpec может установить:

1. **Навыки** (если доставка включает навыки): `.../skills/openspec-*/SKILL.md`
2. **Команды** (если доставка включает команды): специфические для инструмента файлы команд `opsx-*`

По умолчанию OpenSpec использует профиль `core`, который включает:
- `propose`
- `explore`
- `apply`
- `archive`

Вы можете включить расширенные рабочие процессы (`new`, `continue`, `ff`, `verify`, `sync`, `bulk-archive`, `onboard`) через `openspec config profile`, а затем выполнить `openspec update`.

## Справочник по директориям инструментов

| Инструмент (ID) | Шаблон пути к навыкам | Шаблон пути к командам |
|-----------------|-----------------------|-------------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Не генерируется (нет адаптера команд; используйте вызовы на основе навыков `/openspec-*`) |
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
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | Не генерируется (нет адаптера команд; используйте вызовы на основе навыков `/openspec-*`) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Команды Codex устанавливаются в глобальную домашнюю директорию Codex (`$CODEX_HOME/prompts/`, если установлена, в противном случае `~/.codex/prompts/`), а не в директорию вашего проекта.

\*\* Файлы подсказок GitHub Copilot распознаются как пользовательские слэш-команды в расширениях IDE (VS Code, JetBrains, Visual Studio). Copilot CLI в настоящее время не использует файлы `.github/prompts/*.prompt.md` напрямую.

## Невзаимодействующая настройка

Для настройки CI/CD или скриптов используйте `--tools` (и опционально `--profile`):

```bash
# Настройка конкретных инструментов
openspec init --tools claude,cursor

# Настройка всех поддерживаемых инструментов
openspec init --tools all

# Пропуск настройки инструментов
openspec init --tools none

# Переопределение профиля для этого запуска init
openspec init --profile core
```

**Доступные ID инструментов (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `forgecode`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

## Установка, зависящая от рабочего процесса

OpenSpec устанавливает артефакты рабочего процесса на основе выбранных рабочих процессов:

- **Профиль core (по умолчанию):** `propose`, `explore`, `apply`, `archive`
- **Пользовательский выбор:** любое подмножество всех ID рабочих процессов:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Другими словами, количество навыков/команд зависит от профиля и способа доставки, а не является фиксированным.

## Генерируемые имена навыков

При выборе через конфигурацию профиля/рабочего процесса OpenSpec генерирует следующие навыки:

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

Смотрите [Команды](commands.md) для поведения команд и [CLI](cli.md) для параметров `init`/`update`.

## Связанные разделы

- [Справочник по CLI](cli.md) — Команды терминала
- [Команды](commands.md) — Слэш-команды и навыки
- [Начало работы](getting-started.md) — Первоначальная настройка