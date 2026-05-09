# Налаштування

OpenSpec надає три рівні налаштування:

| Рівень | Що він робить | Найкраще підходить для |
|--------|---------------|------------------------|
| **Конфігурація проєкту** | Встановлення стандартних значень, впровадження контексту/правил | Більшості команд |
| **Власні схеми** | Визначення власних артефактів робочого процесу | Команд з унікальними процесами |
| **Глобальні перевизначення** | Спільне використання схем у всіх проєктах | Досвідченим користувачам |

---

## Конфігурація проєкту

Файл `openspec/config.yaml` — найпростіший спосіб налаштувати OpenSpec для вашої команди. Він дозволяє:

- **Встановити стандартну схему** — не потрібно вказувати `--schema` у кожній команді
- **Впровадити контекст проєкту** — ШІ бачить ваш технологічний стек, конвенції тощо
- **Додати правила для кожного артефакту** — власні правила для конкретних артефактів

### Швидке налаштування

```bash
openspec init
```

Ця команда проведе вас через інтерактивне створення конфігурації. Або створіть її вручну:

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

**Стандартна схема:**

```bash
# Без конфігурації
openspec new change my-feature --schema spec-driven

# З конфігурацією — схема застосовується автоматично
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
[Schema's built-in template]
</template>
```

- **Контекст** з'являється у ВСІХ артефактах
- **Правила** з'являються ТІЛЬКИ для відповідного артефакту

### Порядок визначення схеми

Коли OpenSpec потрібна схема, він перевіряє в такому порядку:

1. Прапорець CLI: `--schema <name>`
2. Метадані зміни (`.openspec.yaml` у теці зміни)
3. Конфігурація проєкту (`openspec/config.yaml`)
4. Стандартне значення (`spec-driven`)

---

## Власні схеми

Коли конфігурації проєкту недостатньо, створіть власну схему з повністю індивідуальним робочим процесом. Власні схеми зберігаються в каталозі `openspec/schemas/` вашого проєкту та контролюються версіями разом з вашим кодом.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Конфігурація проєкту
│   ├── schemas/           # Власні схеми зберігаються тут
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Ваші зміни
└── src/
```

### Форк існуючої схеми

Найшвидший спосіб налаштування — форкнути вбудовану схему:

```bash
openspec schema fork spec-driven my-workflow
```

Це копіює всю схему `spec-driven` до `openspec/schemas/my-workflow/`, де ви можете вільно її редагувати.

**Що ви отримаєте:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Визначення робочого процесу
└── templates/
    ├── proposal.md       # Шаблон для артефакту пропозиції
    ├── spec.md           # Шаблон для специфікацій
    ├── design.md         # Шаблон для дизайну
    └── tasks.md          # Шаблон для завдань
```

Тепер редагуйте `schema.yaml` для зміни робочого процесу або редагуйте шаблони для зміни того, що генерує ШІ.

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

Схема визначає артефакти у вашому робочому процесі та їхню взаємозалежність:

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
| `id` | Унікальний ідентифікатор, використовується в командах і правилах |
| `generates` | Ім'я вихідного файлу (підтримуються глобальні шаблони, як `specs/**/*.md`) |
| `template` | Файл шаблону в каталозі `templates/` |
| `instruction` | Інструкції ШІ для створення цього артефакту |
| `requires` | Залежності — які артефакти повинні існувати спочатку |

### Шаблони

Шаблони — це markdown-файли, які направляють ШІ. Вони впроваджуються в запит під час створення відповідного артефакту.

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

### Валідація вашої схеми

Перед використанням власної схеми перевірте її:

```bash
openspec schema validate my-workflow
```

Ця команда перевіряє:
- Синтаксис `schema.yaml` є правильним
- Усі зазначені шаблони існують
- Відсутні циклічні залежності
- Ідентифікатори артефактів є дійсними

### Використання власної схеми

Після створення використовуйте свою схему так:

```bash
# Вказати в команді
openspec new change feature --schema my-workflow

# Або встановити як стандартну в config.yaml
schema: my-workflow
```

### Налагодження визначення схеми

Не впевнені, яка схема використовується? Перевірте за допомогою:

```bash
# Переглянути, звідки визначається конкретна схема
openspec schema which my-workflow

# Перелік усіх доступних схем
openspec schema which --all
```

Вивід покаже, чи схема з вашого проєкту, каталогу користувача чи пакета:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Примітка:** OpenSpec також підтримує схеми рівня користувача в `~/.local/share/openspec/schemas/` для спільного використання між проєктами, проте рекомендуються схеми рівня проєкту в `openspec/schemas/`, оскільки вони контролюються версіями разом з вашим кодом.

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

### Додавання артефакту рев'ю

Форкніть стандартну схему та додайте крок рев'ю:

```bash
openspec schema fork spec-driven with-review
```

Потім відредагуйте `schema.yaml`, додавши:

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
    # ... existing tasks config ...
    requires:
      - specs
      - design
      - review    # Now tasks require review too
```

---

## Спільнотні схеми

OpenSpec також підтримує схеми, що підтримуються спільнотою та поширюються через окремі репозиторії. Вони надають визначені робочі процеси, які інтегрують OpenSpec з іншими інструментами або системами, подібно до того, як працює [каталог розширень спільноти github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) для spec-kit.

Спільнотні схеми не вбудовуються в ядро OpenSpec — вони живуть у власних репозиторіях з власним графіком випуску. Щоб використати одну з них, скопіюйте пакет схеми до каталогу `openspec/schemas/<schema-name>/` вашого проєкту (кожен репозиторій містить інструкції зі встановлення у README).

| Схема | Супровідник | Репозиторій | Опис |
|-------|------------|-------------|------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Інтегрує управління артефактами OpenSpec з навичками виконання [obra/superpowers](https://github.com/obra/superpowers) (мозковий штурм, написання планів, TDD через підагентів, рев'ю коду, завершення). Додає артефакт `retrospective` з пріоритетом доказів, заповнюючи прогалину, яку Superpowers не покриває нативно.

> Хочете долучитися до спільнотної схеми? Відкрийте issue з посиланням на ваш репозиторій або надішліть PR з додаванням рядка до цієї таблиці.

---

## Дивіться також

- [Довідник CLI: Команди роботи зі схемами](cli.md#schema-commands) — Повна документація команд