# Начало работы

В этом руководстве объясняется, как работает OpenSpec после установки и инициализации. Инструкции по установке см. в [основном README](index.md#quick-start).

## Как это работает

OpenSpec помогает вам и вашему ИИ-ассистенту по программированию договориться о том, что нужно создать, ещё до написания кода.

**Путь по умолчанию (основной профиль):**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

**Расширенный путь (выбор пользовательского рабочего процесса):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Глобальный профиль по умолчанию — `core`, который включает команды `propose`, `explore`, `apply`, `sync` и `archive`. Вы можете включить расширенные команды рабочего процесса с помощью `openspec config profile`, а затем `openspec update`.

## Что создаёт OpenSpec

После выполнения `openspec init` в вашем проекте появляется следующая структура:

```
openspec/
├── specs/              # Источник истины (поведение вашей системы)
│   └── <domain>/
│       └── spec.md
├── changes/            # Предлагаемые изменения (отдельная папка для каждого изменения)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Дельта-спецификации (что изменяется)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Конфигурация проекта (необязательно)
```

**Два ключевых каталога:**

- **`specs/`** — Источник истины. Эти спецификации описывают текущее поведение вашей системы. Организованы по доменам (например, `specs/auth/`, `specs/payments/`).

- **`changes/`** — Предлагаемые модификации. Каждое изменение получает собственную папку со всеми связанными артефактами. После завершения изменения его спецификации объединяются с основным каталогом `specs/`.

## Понимание артефактов

Каждая папка изменения содержит артефакты, которые направляют работу:

| Артефакт | Назначение |
|----------|------------|
| `proposal.md` | «Почему» и «что» — фиксирует намерение, объём и подход |
| `specs/` | Дельта-спецификации, показывающие ДОБАВЛЕННЫЕ/ИЗМЕНЁННЫЕ/УДАЛЁННЫЕ требования |
| `design.md` | «Как» — технический подход и архитектурные решения |
| `tasks.md` | Контрольный список реализации с чекбоксами |

**Артефакты выстраиваются последовательно:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
         обновляйте по мере накопления опыта
```

Вы всегда можете вернуться и уточнить предыдущие артефакты по мере того, как узнаёте больше в процессе реализации.

## Как работают дельта-спецификации

Дельта-спецификации — ключевая концепция OpenSpec. Они показывают, что именно изменяется относительно текущих спецификаций.

### Формат

Дельта-спецификации используют секции для указания типа изменения:

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

Когда вы архивируете изменение:

1. **ДОБАВЛЕННЫЕ** требования дописываются в основную спецификацию
2. **ИЗМЕНЁННЫЕ** требования заменяют существующую версию
3. **УДАЛЁННЫЕ** требования удаляются из основной спецификации

Папка изменения перемещается в `openspec/changes/archive/` для истории аудита.

## Пример: ваше первое изменение

Пройдём весь процесс добавления тёмной темы в приложение.

### 1. Начало изменения (по умолчанию)

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

Если вы включили расширенный профиль рабочего процесса, вы также можете выполнить это в два шага: `/opsx:new`, затем `/opsx:ff` (или `/opsx:continue` поэтапно).

### 2. Что создаётся

**proposal.md** — Фиксирует намерение:

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

**specs/ui/spec.md** — Дельта с новыми требованиями:

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

**tasks.md** — Контрольный список реализации:

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

```
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Created ThemeContext with light/dark state
     ✓ 1.2 Added CSS custom properties to globals.css
     ✓ 1.3 Implemented localStorage persistence
     ✓ 2.1 Created ThemeToggle component
     ...
     All tasks complete!
```

В процессе реализации, если вы обнаружите, что дизайн нуждается в корректировке, просто обновите артефакт и продолжайте.

### 4. Архивация

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

Ваши дельта-спецификации теперь стали частью основных спецификаций, документируя работу вашей системы.

## Проверка и обзор

Используйте CLI для отслеживания изменений:

```bash
# List active changes
openspec list

# View change details
openspec show add-dark-mode

# Validate spec formatting
openspec validate add-dark-mode

# Interactive dashboard
openspec view
```

## Дальнейшие шаги

- [Рабочие процессы](workflows.md) — Типичные паттерны и когда использовать каждую команду
- [Команды](commands.md) — Полный справочник по всем слеш-командам
- [Концепции](concepts.md) — Более глубокое понимание спецификаций, изменений и схем
- [Настройка](customization.md) — Настройте OpenSpec под свои нужды