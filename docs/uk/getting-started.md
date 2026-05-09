# Початок роботи

Цей посібник пояснює, як працює OpenSpec після встановлення та ініціалізації. Інструкції з встановлення див. у [основному README](index.md#quick-start).

## Як це працює

OpenSpec допомагає вам та вашому ШІ-асистенту з кодування домовитися про те, що потрібно побудувати, ще до написання жодного рядка коду.

**Шлях за замовчуванням (основний профіль):**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

**Розширений шлях (вибір користувацького робочого процесу):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Глобальний профіль за замовчуванням — `core`, який включає `propose`, `explore`, `apply`, `sync` та `archive`. Ви можете увімкнути команди розширеного робочого процесу за допомогою `openspec config profile`, а потім `openspec update`.

## Що створює OpenSpec

Після запуску `openspec init` ваш проект матиме таку структуру:

```
openspec/
├── specs/              # Єдине джерело правди (поведінка вашої системи)
│   └── <domain>/
│       └── spec.md
├── changes/            # Запропоновані оновлення (по одній папці на зміну)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Дельта-специфікації (що змінюється)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Конфігурація проекту (необов'язково)
```

**Два ключові каталоги:**

- **`specs/`** — Єдине джерело правди. Ці специфікації описують поточну поведінку вашої системи. Організовані за доменами (напр., `specs/auth/`, `specs/payments/`).

- **`changes/`** — Запропоновані модифікації. Кожна зміна має власну папку з усіма пов'язаними артефактами. Після завершення зміни її специфікації об'єднуються з основним каталогом `specs/`.

## Розуміння артефактів

Кожна папка зміни містить артефакти, які керують роботою:

| Артефакт | Призначення |
|----------|-------------|
| `proposal.md` | «Чому» та «що» — фіксує намір, обсяг та підхід |
| `specs/` | Дельта-специфікації, що показують ДОДАНІ/ЗМІНЕНІ/ВИДАЛЕНІ вимоги |
| `design.md` | «Як» — технічний підхід та архітектурні рішення |
| `tasks.md` | Контрольний список реалізації з прапорцями |

**Артефакти будуються один на одному:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            оновлюйте по мірі отримання нових знань
```

Ви завжди можете повернутися та вдосконалити попередні артефакти по мірі отримання нових знань під час реалізації.

## Як працюють дельта-специфікації

Дельта-специфікації — це ключова концепція OpenSpec. Вони показують, що змінюється відносно ваших поточних специфікацій.

### Формат

Дельта-специфікації використовують секції для позначення типу зміни:

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

### Що відбувається під час архівації

Коли ви архівуєте зміну:

1. **ДОДАНІ** вимоги додаються до основної специфікації
2. **ЗМІНЕНІ** вимоги замінюють існуючу версію
3. **ВИДАЛЕНІ** вимоги видаляються з основної специфікації

Папка зміни переміщується до `openspec/changes/archive/` для збереження історії аудиту.

## Приклад: ваша перша зміна

Розглянемо додавання темної теми до програми.

### 1. Початок зміни (за замовчуванням)

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

Якщо ви увімкнули розширений профіль робочого процесу, ви також можете зробити це у два кроки: `/opsx:new`, а потім `/opsx:ff` (або `/opsx:continue` поетапно).

### 2. Що створюється

**proposal.md** — Фіксує намір:

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

**specs/ui/spec.md** — Дельта з новими вимогами:

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

**tasks.md** — Контрольний список реалізації:

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

### 3. Реалізація

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

Під час реалізації, якщо ви виявите, що дизайн потребує коригування, просто оновіть артефакт і продовжуйте.

### 4. Архівація

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

Ваші дельта-специфікації тепер є частиною основних специфікацій, документуючи роботу вашої системи.

## Перевірка та перегляд

Використовуйте CLI для перегляду ваших змін:

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

## Наступні кроки

- [Робочі процеси](workflows.md) — Типові шаблони та коли використовувати кожну команду
- [Команди](commands.md) — Повний довідник усіх слеш-команд
- [Концепції](concepts.md) — Глибше розуміння специфікацій, змін та схем
- [Налаштування](customization.md) — Налаштуйте OpenSpec під свої потреби