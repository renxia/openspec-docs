# Начало работы

В этом руководстве описано, как работает OpenSpec после установки и инициализации. Инструкции по установке см. в [основном README](../index.md#quick-start) или в [руководстве по установке](installation.md). Впервые в этой документации? [Домашняя страница документации](index.md) содержит полное оглавление.

> **Где вводить эти команды?** Есть два места, и их путаница — самая частая ошибка новичков.
>
> - Команды вида `openspec ...` (например, `openspec init`) выполняются в вашем **терминале**.
> - Команды вида `/opsx:...` (например, `/opsx:propose`) выполняются в **чате с ИИ-ассистентом**, в том же окне, где вы можете попросить его написать код.
>
> Отдельного «интерактивного режима» для запуска не требуется. Достаточно ввести команду с косой чертой в чате, и ассистент сам выполнит все остальные действия. Подробное объяснение: [Как работают команды](how-commands-work.md).

## Первые пять минут работы

Полный цикл работы, у каждого шага указано, где он выполняется:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (optional: think it through first)
AI CHAT      /opsx:propose add-dark-mode      (AI drafts the plan; you review it)
AI CHAT      /opsx:apply                      (AI builds it)
AI CHAT      /opsx:archive                    (specs updated, change filed away)
```

Два шага в терминале для настройки, после чего вся работа ведётся в чате. В остальной части руководства разбирается, что делает каждый шаг и что вы увидите.

> **Ещё не decided, что строить? Начните с `/opsx:explore`.** Это безрисковый помощник для обдумывания идей: он анализирует ваш код, взвешивает варианты и превращает размытое представление в конкретный план, ещё до создания любых артефактов или кода. Когда картина станет ясной, он передаёт управление `/opsx:propose`. Это лучшая привычка при работе с ИИ, который в противном случае может уверенно построить не то, что нужно. См. [руководство по работе с Explore](explore.md).

## Принцип работы

OpenSpec помогает вам и вашему ИИ-ассистенту по разработке договориться о том, что нужно построить, до написания любого кода.

**Стандартный быстрый путь (профиль core):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (optional)
```

Используйте `/opsx:explore`, если вы только определяетесь с задачей, или переходите сразу к `/opsx:propose`, если уже знаете, что нужно сделать. Команда Explore входит в стандартный профиль, поэтому она всегда доступна, когда вам понадобится.

**Расширенный путь (выбор пользовательского рабочего процесса):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Стандартный глобальный профиль — `core`, он включает команды `propose`, `explore`, `apply`, `sync` и `archive`. Включить команды расширенного рабочего процесса можно с помощью `openspec config profile`, а затем `openspec update`.

## Что создаёт OpenSpec

После выполнения команды `openspec init` в вашем проекте появится следующая структура:

```
openspec/
├── specs/              # Source of truth (your system's behavior)
│   └── <domain>/
│       └── spec.md
├── changes/            # Proposed updates (one folder per change)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta specs (what's changing)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Project configuration (optional)
```

**Два ключевых каталога:**

- **`specs/`** — источник истины. В этих спецификациях описано текущее поведение вашей системы. Организованы по доменам (например, `specs/auth/`, `specs/payments/`).
- **`changes/`** — предлагаемые изменения. Для каждого изменения создаётся отдельный каталог со всеми связанными артефактами. После завершения работы над изменением его спецификации объединяются с основным каталогом `specs/`.

## Структура артефактов

В каждом каталоге изменения содержатся артефакты, которые направляют работу:

| Артефакт | Назначение |
|----------|------------|
| `proposal.md` | «Зачем» и «что» — фиксирует цель, область действия и подход |
| `specs/` | Дельта-спецификации, показывающие ДОБАВЛЕННЫЕ/ИЗМЕНЁННЫЕ/УДАЛЁННЫЕ требования |
| `design.md` | «Как» — технический подход и решения по архитектуре |
| `tasks.md` | Чек-лист реализации с флажками |

**Артефакты строятся друг на друге:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            update as you learn
```

Вы всегда можете вернуться назад и доработать ранние артефакты по мере получения новой информации в процессе реализации.

## Как работают дельта-спецификации

Дельта-спецификации являются ключевой концепцией OpenSpec. Они показывают, что изменяется относительно ваших текущих спецификаций.

### Формат

В дельта-спецификациях используются разделы для указания типа изменения:

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST require a second factor during login.

#### Scenario: OTP required
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented

## MODIFIED Requirements

### Requirement: Session Timeout
The system SHALL expire sessions after 30 minutes of inactivity.
(Previously: 60 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA)
```

### Что происходит при архивации

При архивации изменения:
1. **ДОБАВЛЕННЫЕ** требования добавляются в конец основной спецификации
2. **ИЗМЕНЁННЫЕ** требования заменяют существующую версию
3. **УДАЛЁННЫЕ** требования удаляются из основной спецификации

Каталог изменения перемещается в `openspec/changes/archive/` для ведения истории аудита.

## Пример: ваше первое изменение

Рассмотрим процесс добавления тёмной темы в приложение.

### 1. Запуск изменения (стандартный способ)

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

Если вы включили профиль расширенного рабочего процесса, это можно сделать в два шага: сначала `/opsx:new`, затем `/opsx:ff` (или постепенно `/opsx:continue`).

### 2. Что создаётся

**proposal.md** — фиксирует цель:

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage.

## Scope
- Add theme toggle in settings
- Support system preference detection
- Persist preference in localStorage

## Approach
Use CSS custom properties for theming with a React context
for state management.
```

**specs/ui/spec.md** — дельта-спецификация с новыми требованиями:

```markdown
# Delta for UI

## ADDED Requirements

### Requirement: Theme Selection
The system SHALL allow users to choose between light and dark themes.

#### Scenario: Manual toggle
- GIVEN a user on any page
- WHEN the user clicks the theme toggle
- THEN the theme switches immediately
- AND the preference persists across sessions

#### Scenario: System preference
- GIVEN a user with no saved preference
- WHEN the application loads
- THEN the system's preferred color scheme is used
```

**tasks.md** — чек-лист реализации:

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
```

### 3. Реализация

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Created ThemeContext with light/dark state
     ✓ 1.2 Added CSS custom properties to globals.css
     ✓ 1.3 Implemented localStorage persistence
     ✓ 2.1 Created ThemeToggle component
     ...
     All tasks complete!
```

Если в процессе реализации вы обнаружите, что дизайн требует корректировки, просто обновите соответствующий артефакт и продолжайте работу.

### 4. Архивирование

```text
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

Теперь ваши дельта-спецификации являются частью основных спецификаций и документируют работу вашей системы.

## Проверка и ревью

Используйте CLI для проверки состояния ваших изменений:

```bash
# Показать активные изменения
openspec list

# Показать детали изменения
openspec show add-dark-mode

# Проверить форматирование спецификаций
openspec validate add-dark-mode

# Интерактивная панель управления
openspec view
```

## Дальнейшие шаги

- [Сначала обдумайте в Explore](explore.md) — используйте `/opsx:explore` для проработки идеи перед тем, как приступить к её реализации
- [Ревью изменения](reviewing-changes.md) — что проверять в плане, который составляет ИИ, до написания любого кода
- [Написание качественных спецификаций](writing-specs.md) — как выглядят корректное требование и сценарий
- [Использование OpenSpec в существующем проекте](existing-projects.md) — начало работы с большим легаси-кодом
- [Редактирование и итерация изменения](editing-changes.md) — обновление артефактов, возврат к предыдущим шагам, согласование ручных правок
- [Ключевые концепции на одной странице](overview.md) — полная ментальная модель работы
- [Примеры и рецепты](examples.md) — реальные изменения от начала до конца
- [Рабочие процессы](workflows.md) — распространённые паттерны и случаи использования каждой команды
- [Команды](commands.md) — полная справочная информация по всем командам с косой чертой
- [Концепции](concepts.md) — углублённое понимание спецификаций, изменений и схем
- [Настройка](customization.md) — адаптация OpenSpec под ваши нужды
- [Хранилища](stores-beta/user-guide.md) — планирование, охватывающее несколько репозиториев или команд? Храните его в отдельном репозитории (бета)
- [Часто задаваемые вопросы](faq.md) и [Устранение неполадок](troubleshooting.md) — если вы столкнулись с проблемами