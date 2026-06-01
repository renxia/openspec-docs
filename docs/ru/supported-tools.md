# Поддерживаемые инструменты

OpenSpec работает со многими ассистентами для написания кода на базе ИИ. При запуске `openspec init` OpenSpec настраивает выбранные инструменты на основе вашего активного профиля/рабочего процесса и режима доставки.

## Как это работает

Для каждого выбранного инструмента OpenSpec может установить:

1. **Skills** (если доставка включает навыки): `.../skills/openspec-*/SKILL.md`
2. **Commands** (если доставка включает команды): специфичные для инструмента файлы команд `opsx-*`

По умолчанию OpenSpec использует профиль `core`, который включает:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

Вы можете включить расширенные рабочие процессы (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) через `openspec config profile`, затем выполнив `openspec update`.

## Справочник каталогов инструментов

| Инструмент (ID) | Шаблон пути навыков | Шаблон пути команд |
|-----------|---------------------|----------------------|
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
| Kimi CLI (`kimi`) | `.kimi/skills/openspec-*/SKILL.md` | Не генерируется (нет адаптера команд; используйте вызовы на основе навыков `/skill:openspec-*`) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | Не генерируется (нет адаптера команд; используйте вызовы на основе навыков `/openspec-*`) |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | Не генерируется (нет адаптера команд; используйте вызовы на основе навыков `/openspec-*`) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Команды Codex устанавливаются в глобальный домашний каталог Codex (`$CODEX_HOME/prompts/`, если задан, иначе `~/.codex/prompts/`), а не в каталог вашего проекта.

\*\* Файлы промптов GitHub Copilot распознаются как пользовательские команды с косой чертой в расширениях IDE (VS Code, JetBrains, Visual Studio). Copilot CLI в настоящее время не использует `.github/prompts/*.prompt.md` напрямую.

## Неинтерактивная настройка

Для CI/CD или автоматизированной настройки используйте `--tools` (и опционально `--profile`):

```bash
# Настроить конкретные инструменты
openspec init --tools claude,cursor

# Настроить все поддерживаемые инструменты
openspec init --tools all

# Пропустить настройку инструментов
openspec init --tools none

# Переопределить профиль для данного запуска init
openspec init --profile core
```

**Доступные ID инструментов (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `vibe`, `windsurf`

## Установка в зависимости от рабочего процесса

OpenSpec устанавливает артефакты рабочего процесса на основе выбранных рабочих процессов:

- **Профиль core (по умолчанию):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Пользовательский выбор:** любое подмножество всех ID рабочих процессов:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Другими словами, количество навыков/команд зависит от профиля и режима доставки, а не фиксировано.

## Генерируемые имена навыков

При выборе конфигурации профиля/рабочего процесса OpenSpec генерирует следующие навыки:

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

См. [Commands](commands.md) для описания поведения команд и [CLI](cli.md) для опций `init`/`update`.

## См. также

- [Справочник CLI](cli.md) — Команды терминала
- [Commands](commands.md) — Команды с косой чертой и навыки
- [Начало работы](getting-started.md) — Первоначальная настройка