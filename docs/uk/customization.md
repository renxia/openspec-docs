# Налаштування

OpenSpec надає три рівні налаштування:

| Рівень | Що робить | Для кого підходить |
|-------|------------|--------------------|
| **Конфігурація проєкту** | Встановлює значення за замовчуванням, інжектує контекст та правила | Більшість команд |
| **Власні схеми** | Дозволяє визначати власні артефакти робочого процесу | Команди з унікальними процесами |
| **Глобальні перевизначення** | Дозволяє використовувати схеми в усіх проєктах | Досвідчені користувачі |

---

## Конфігурація проєкту

Файл `openspec/config.yaml` — найпростіший спосіб налаштувати OpenSpec для вашої команди. Він дозволяє вам:

- **Встановити схему за замовчуванням** — не потрібно вказувати `--schema` для кожної команди
- **Інжектувати контекст проєкту** — ШІ бачить ваш стек технологій, конвенції тощо
- **Додати правила для окремих артефактів** — індивідуальні правила для конкретних артефактів

### Швидке налаштування

```bash
openspec init
```

Ця команда проведе вас через інтерактивне створення конфігурації. Або ви можете створити її вручну:

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

### Принцип роботи

**Схема за замовчуванням:**

```bash
# Без конфігурації
openspec new change my-feature --schema spec-driven

# З конфігурацією — схема вибирається автоматично
openspec new change my-feature
```

**Інжектування контексту та правил:**

Під час генерації будь-якого артефакту ваш контекст та правила інжектуються в промпт ШІ:

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

- **Контекст** відображається у ВСІХ артефактах
- **Правила** відображаються ТІЛЬКИ для відповідного артефакту

### Порядок визначення схеми

Коли OpenSpec потрібна схема, він перевіряє її в такому порядку:

1. Прапорець CLI: `--schema <name>`
2. Метадані зміни (`.openspec.yaml` у папці зміни)
3. Конфігурація проєкту (`openspec/config.yaml`)
4. За замовчуванням (`spec-driven`)

---

## Власні схеми

Якщо конфігурації проєкту недостатньо, створіть власну схему з повністю індивідуальним робочим процесом. Власні схеми зберігаються в директорії `openspec/schemas/` вашого проєкту та контролюються разом з кодом за допомогою системи версійного контролю.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Конфігурація проєкту
│   ├── schemas/           # Тут зберігаються власні схеми
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Ваші зміни
└── src/
```

### Форк існуючої схеми

Найшвидший спосіб налаштувати — форкнути вбудовану схему:

```bash
openspec schema fork spec-driven my-workflow
```

Ця команда копіює всю схему `spec-driven` до `openspec/schemas/my-workflow/`, де ви можете вільно редагувати її.

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

Тепер редагуйте `schema.yaml`, щоб змінити робочий процес, або редагуйте шаблони, щоб змінити результат генерації ШІ.

### Створення схеми з нуля

Для повністю нового робочого процесу:

```bash
# Інтерактивний режим
openspec schema init research-first

# Неінтерактивний режим
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Структура схеми

Схема визначає артефакти у вашому робочому процесі та їхні залежності один від одного:

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
      - proposal    # Неможливо створити дизайн, поки не існує пропозиція

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
|-------|-------------|
| `id` | Унікальний ідентифікатор, використовується в командах та правилах |
| `generates` | Ім'я вихідного файлу (підтримуються глоби, наприклад `specs/**/*.md`) |
| `template` | Файл шаблону в директорії `templates/` |
| `instruction` | Інструкції для ШІ щодо створення цього артефакту |
| `requires` | Залежності — які артефакти повинні існувати в першу чергу |

### Шаблони

Шаблони — це markdown-файли, які керують роботою ШІ. Вони інжектуються в промпт під час створення відповідного артефакту.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Поясніть мотивацію цієї зміни. Яку проблему вона вирішує? -->

## What Changes

<!-- Опишіть, що зміниться. Будьте конкретними щодо нових можливостей або модифікацій. -->

## Impact

<!-- Зачеплений код, API, залежності, системи -->
```

Шаблони можуть містити:
- Заголовки розділів, які повинен заповнити ШІ
- HTML-коментарі з підказками для ШІ
- Приклади форматів, що демонструють очікувану структуру

### Перевірка коректності вашої схеми

Перш ніж використовувати власну схему, перевірте її коректність:

```bash
openspec schema validate my-workflow
```

Ця команда перевіряє:
- Синтаксис `schema.yaml` є коректним
- Всі зазначені шаблони існують
- Відсутні циклічні залежності
- Ідентифікатори артефактів є коректними

### Використання вашої власної схеми

Після створення використовуйте схему так:

```bash
# Вкажіть у команді
openspec new change feature --schema my-workflow

# Або встановіть як схему за замовчуванням у config.yaml
schema: my-workflow
```

### Налагодження процесу визначення схеми

Не впевнені, яка схема використовується? Перевірте за допомогою:

```bash
# Перевірте, звідки береться конкретна схема
openspec schema which my-workflow

# Показати всі доступні схеми
openspec schema which --all
```

Вивід показує, чи схема з вашого проєкту, користувацької директорії чи пакету:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Примітка:** OpenSpec також підтримує користувацькі схеми в `~/.local/share/openspec/schemas/` для використання в різних проєктах, але рекомендується використовувати схеми рівня проєкту в `openspec/schemas/`, оскільки вони зберігаються в системі версійного контролю разом з вашим кодом.

---

## Приклади

### Швидкий робочий процес для ітерацій

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

Форкніть стандартну схему та додайте крок перевірки:

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

## Схеми від спільноти

OpenSpec також підтримує схеми, що підтримуються спільнотою та розповсюджуються через окремі репозиторії. Вони надають робочі процеси з чітко визначеною думкою, які інтегрують OpenSpec з іншими інструментами та системами, подібно до того, як [каталог спільнотних розширень github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) працює для spec-kit.

Схеми від спільноти не вбудовуються в ядро OpenSpec — вони зберігаються в власних репозиторіях з власним графіком випусків. Щоб використовувати таку схему, скопіюйте її пакет в директорію `openspec/schemas/<schema-name>/` вашого проєкту (в README кожного репозиторію є інструкції з встановлення).

| Схема | Супровідник | Репозиторій | Опис |
|--------|-------------|-------------|------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Інтегрує управління артефактами OpenSpec з навичками виконання [obra/superpowers](https://github.com/obra/superpowers) (мозковий штурм, написання планів, TDD через сабагенти, перевірка коду, завершення робіт). Додає артефакт `retrospective` з акцентом на докази, який заповнює прогалин, який Superpowers не покриває нативно. |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | Робочий процес з акцентом на менеджера проєкту. Запускає конвеєр планування [nanopm](https://github.com/nmrtn/nanopm) (аудит → стратегія → дорожня карта → PRD) на етапі перед реалізацією. Зв'язує планування продукту з інженерним робочим процесом OpenSpec, орієнтованим на специфікації. Артефакти читаються з `.nanopm/`, якщо така директорія існує: пропозиція використовує аудит, дизайн — стратегію, а завдання — розбивку PRD. |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | Робочі керівництва для end-to-end тестування на рівні можливостей. Кожна можливість отримує незмінну специфікацію, незмінний шаблон завдань та один запис запуску з часовою міткою для кожного виконання. Перевірки базуються виключно на спостерюваній поведінці (HTTP-статус, тіло відповіді, збережений стан — ніколи не перевіряються підрядки логів); кожен запуск фіксує час початку/закінчення за UTC, тривалість та приблизну кількість спожитих токенів ШІ. |

> Хочете додати власну схему від спільноти? Відкрийте issue з посиланням на ваш репозиторій або надішліть PR з додаванням рядка до цієї таблиці.

---

## Дивіться також

- [Довідка з CLI: Команди для роботи зі схемами](cli.md#schema-commands) — Повна документація з команд