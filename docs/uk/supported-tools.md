# Підтримувані інструменти

OpenSpec працює з багатьма асистентами програмування на базі ШІ. При запуску `openspec init` OpenSpec налаштовує обрані інструменти з використанням вашого активного профілю/робочого процесу та режиму доставки.

## Як це працює

Для кожного обраного інструменту OpenSpec може встановити:

1. **Навички** (якщо доставка включає навички): `.../skills/openspec-*/SKILL.md`
2. **Команди** (якщо доставка включає команди): специфічні для інструменту файли команд `opsx-*`

За замовчуванням OpenSpec використовує профіль `core`, який включає:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

Ви можете увімкнути розширені робочі процеси (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) через `openspec config profile`, а потім запустити `openspec update`.

## Довідник каталогів інструментів

| Інструмент (ID) | Шаблон шляху до навичок | Шаблон шляху до команд |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Не генеруються (немає адаптера команд; використовуйте виклики на основі навичок `/openspec-*`) |
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
| Kimi CLI (`kimi`) | `.kimi/skills/openspec-*/SKILL.md` | Не генеруються (немає адаптера команд; використовуйте виклики на основі навичок `/skill:openspec-*`) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | Не генеруються (немає адаптера команд; використовуйте виклики на основі навичок `/openspec-*`) |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | Не генеруються (немає адаптера команд; використовуйте виклики на основі навичок `/openspec-*`) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Команди Codex встановлюються у глобальний домашній каталог Codex (`$CODEX_HOME/prompts/` якщо задано, інакше `~/.codex/prompts/`), а не у каталог вашого проєкту.

\*\* Файли підказок GitHub Copilot розпізнаються як користувацькі слеш-команди в розширеннях IDE (VS Code, JetBrains, Visual Studio). Copilot CLI наразі не обробляє `.github/prompts/*.prompt.md` безпосередньо.

## Неінтерактивне налаштування

Для CI/CD або автоматизованого налаштування використовуйте `--tools` (та опційно `--profile`):

```bash
# Налаштувати конкретні інструменти
openspec init --tools claude,cursor

# Налаштувати всі підтримувані інструменти
openspec init --tools all

# Пропустити налаштування інструментів
openspec init --tools none

# Перевизначити профіль для цього запуску init
openspec init --profile core
```

**Доступні ID інструментів (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `vibe`, `windsurf`

## Встановлення, залежне від робочого процесу

OpenSpec встановлює артефакти робочого процесу на основі обраних робочих процесів:

- **Профіль Core (за замовчуванням):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Користувацький вибір:** будь-яка підмножина всіх ID робочих процесів:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Іншими словами, кількість навичок/команд залежить від профілю та доставки, а не є фіксованою.

## Згенеровані назви навичок

Коли обрано конфігурацією профілю/робочого процесу, OpenSpec генерує такі навички:

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

Дивіться [Команди](commands.md) для опису поведінки команд та [CLI](cli.md) для опцій `init`/`update`.

## Пов'язане

- [Довідник CLI](cli.md) — Команди терміналу
- [Команди](commands.md) — Слеш-команди та навички
- [Початок роботи](getting-started.md) — Початкове налаштування