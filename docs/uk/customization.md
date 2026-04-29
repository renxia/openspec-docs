# Налаштування

OpenSpec пропонує три рівні налаштування:

| Рівень | Що робить | Найкраще підходить для |
|-------|-----------|------------------------|
| **Конфігурація проєкту** | Встановлює значення за замовчуванням, впроваджує контекст/правила | Більшість команд |
| **Користувацькі схеми** | Визначає власні артефакти робочого процесу | Команди з унікальними процесами |
| **Глобальні перевизначення** | Поширює схеми на всі проєкти | Досвідчені користувачі |

---

## Конфігурація проєкту

Файл `openspec/config.yaml` — це найпростіший спосіб налаштувати OpenSpec для вашої команди. Він дозволяє:

- **Встановити схему за замовчуванням** — Пропустити `--schema` у кожній команді
- **Впровадити контекст проєкту** — ШІ бачить ваш технологічний стек, конвенції тощо
- **Додати правила для окремих артефактів** — Користувацькі правила для конкретних артефактів

### Швидке налаштування

```bash
openspec init
```

Ця команда інтерактивно проведе вас через створення конфігурації. Або створіть її вручну:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API style: RESTful, documented in docs/api.md
  Testing: Jest + React Testing Library
  We value backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones
```

### Як це працює

**Схема за замовчуванням:**

```bash
# Без конфігурації
openspec new change my-feature --schema spec-driven

# З конфігурацією - схема застосовується автоматично
openspec new change my-feature
```

**Впровадження контексту та правил:**

Під час генерації будь-якого артефакту ваш контекст і правила впроваджуються в запит до ШІ:

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Include rollback plan
- Identify affected teams
</rules>

<template>
[Вбудований шаблон схеми]
</template>
```

- **Контекст** з'являється у ВСІХ артефактах
- **Правила** з'являються ТІЛЬКИ для відповідного артефакту

### Порядок розв'язання схеми

Коли OpenSpec потрібна схема, вона перевіряється в такому порядку:

1. Прапорець CLI: `--schema <назва>`
2. Метадані зміни (`.openspec.yaml` у папці зміни)
3. Конфігурація проєкту (`openspec/config.yaml`)
4. За замовчуванням (`spec-driven`)

---

## Користувацькі схеми

Коли конфігурації проєкту недостатньо, створіть власну схему з повністю користувацьким робочим процесом. Користувацькі схеми знаходяться в директорії `openspec/schemas/` вашого проєкту та версіонуються разом з кодом.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Конфігурація проєкту
│   ├── schemas/           # Тут знаходяться користувацькі схеми
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Ваші зміни
└── src/
```

### Розгалуження існуючої схеми

Найшвидший спосіб налаштування — розгалуження вбудованої схеми:

```bash
openspec schema fork spec-driven my-workflow
```

Це копіює всю схему `spec-driven` до `openspec/schemas/my-workflow/`, де ви можете її вільно редагувати.

**Що ви отримуєте:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Визначення робочого процесу
└── templates/
    ├── proposal.md       # Шаблон для артефакту пропозиції
    ├── spec.md           # Шаблон для специфікацій
    ├── design.md         # Шаблон для дизайну
    └── tasks.md          # Шаблон для завдань
```

Тепер відредагуйте `schema.yaml`, щоб змінити робочий процес, або відредагуйте шаблони, щоб змінити те, що генерує ШІ.

### Створення схеми з нуля

Для повністю нового робочого процесу:

```bash
# Інтерактивно
openspec schema init research-first

# Неінтерактивно
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Структура схеми

Схема визначає артефакти у вашому робочому процесі та їх взаємозалежності:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: My team's custom workflow

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initial proposal document
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Technical design
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal    # Can't create design until proposal exists

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Ключові поля:**

| Поле | Призначення |
|------|-------------|
| `id` | Унікальний ідентифікатор, що використовується в командах та правилах |
| `generates` | Ім'я вихідного файлу (підтримує шаблони на кшталт `specs/**/*.md`) |
| `template` | Файл шаблону в директорії `templates/` |
| `instruction` | Інструкції ШІ для створення цього артефакту |
| `requires` | Залежності — які артефакти повинні існувати спочатку |

### Шаблони

Шаблони — це файли markdown, які керують ШІ. Вони впроваджуються в запит під час створення відповідного артефакту.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

Шаблони можуть містити:
- Заголовки розділів, які ШІ повинен заповнити
- HTML-коментарі з інструкціями для ШІ
- Приклади форматів, що демонструють очікувану структуру

### Перевірка вашої схеми

Перед використанням користувацької схеми перевірте її:

```bash
openspec schema validate my-workflow
```

Це перевірить:
- Синтаксис `schema.yaml` правильний
- Усі згадані шаблони існують
- Відсутні циклічні залежності
- Ідентифікатори артефактів дійсні

### Використання вашої користувацької схеми

Після створення використовуйте вашу схему так:

```bash
# Вказати в команді
openspec new change feature --schema my-workflow

# Або встановити як за замовчуванням у config.yaml
schema: my-workflow
```

### Налагодження розв'язання схем

Не впевнені, яка схема використовується? Перевірте за допомогою:

```bash
# Подивитися, звідки розв'язується конкретна схема
openspec schema which my-workflow

# Показати всі доступні схеми
openspec schema which --all
```

Вивід покаже, чи вона з вашого проєкту, директорії користувача чи пакету:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Примітка:** OpenSpec також підтримує схеми рівня користувача в `~/.local/share/openspec/schemas/` для поширення між проєктами, але рекомендуються схеми рівня проєкту в `openspec/schemas/`, оскільки вони версіонуються разом з вашим кодом.

---

## Приклади

### Робочий процес швидкої ітерації

Мінімальний робочий процес для швидких ітерацій:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Quick proposal
    template: proposal.md
    instruction: |
      Create a brief proposal for this change.
      Focus on what and why, skip detailed specs.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Додавання артефакту перевірки

Розгалужте стандартну схему та додайте крок перевірки:

```bash
openspec schema fork spec-driven with-review
```

Потім відредагуйте `schema.yaml`, щоб додати:

```yaml
  - id: review
    generates: review.md
    description: Pre-implementation review checklist
    template: review.md
    instruction: |
      Create a review checklist based on the design.
      Include security, performance, and testing considerations.
    requires:
      - design

  - id: tasks
    # ... існуюча конфігурація завдань ...
    requires:
      - specs
      - design
      - review    # Тепер завдання також вимагають перевірки
```

---

## Дивіться також

- [Довідник CLI: Команди схем](cli.md#schema-commands) - Повна документація команд