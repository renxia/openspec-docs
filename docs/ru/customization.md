# Настройка

OpenSpec предоставляет три уровня настройки:

| Уровень | Что делает | Для кого подходит |
|---------|------------|-------------------|
| **Конфигурация проекта** | Установка значений по умолчанию, добавление контекста/правил | Большинству команд |
| **Пользовательские схемы** | Определение собственных артефактов рабочего процесса | Командам с уникальными процессами |
| **Глобальные переопределения** | Общие схемы для всех проектов | Продвинутым пользователям |

---

## Конфигурация проекта

Файл `openspec/config.yaml` — самый простой способ настроить OpenSpec для вашей команды. Он позволяет:

- **Установить схему по умолчанию** — не указывать `--schema` в каждой команде
- **Добавить контекст проекта** — ИИ видит ваш технологический стек, соглашения и т.д.
- **Добавить правила для артефактов** — специальные правила для конкретных артефактов

### Быстрая настройка

```bash
openspec init
```

Эта команда проведет вас через интерактивное создание конфигурации. Или создайте её вручную:

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

### Как это работает

**Схема по умолчанию:**

```bash
# Без конфигурации
openspec new change my-feature --schema spec-driven

# С конфигурацией - схема подставляется автоматически
openspec new change my-feature
```

**Внедрение контекста и правил:**

При генерации любого артефакта ваш контекст и правила вставляются в запрос к ИИ:

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

- **Контекст** отображается во ВСЕХ артефактах
- **Правила** отображаются ТОЛЬКО для соответствующего артефакта

### Порядок разрешения схемы

Когда OpenSpec требуется схема, он проверяет в следующем порядке:

1. Флаг CLI: `--schema <name>`
2. Метаданные изменения (`.openspec.yaml` в папке изменения)
3. Конфигурация проекта (`openspec/config.yaml`)
4. Значение по умолчанию (`spec-driven`)

---

## Пользовательские схемы

Когда конфигурации проекта недостаточно, создайте собственную схему с полностью настраиваемым рабочим процессом. Пользовательские схемы хранятся в директории `openspec/schemas/` вашего проекта и контролируются версиями вместе с кодом.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Конфигурация проекта
│   ├── schemas/           # Пользовательские схемы хранятся здесь
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Ваши изменения
└── src/
```

### Форк существующей схемы

Самый быстрый способ настройки — форкнуть встроенную схему:

```bash
openspec schema fork spec-driven my-workflow
```

Эта команда копирует всю схему `spec-driven` в `openspec/schemas/my-workflow/`, где вы можете свободно её редактировать.

**Что вы получите:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Определение рабочего процесса
└── templates/
    ├── proposal.md       # Шаблон для артефакта предложения
    ├── spec.md           # Шаблон для спецификаций
    ├── design.md         # Шаблон для дизайна
    └── tasks.md          # Шаблон для задач
```

Теперь отредактируйте `schema.yaml`, чтобы изменить рабочий процесс, или отредактируйте шаблоны, чтобы изменить то, что генерирует ИИ.

### Создание схемы с нуля

Для полностью нового рабочего процесса:

```bash
# Интерактивно
openspec schema init research-first

# Неинтерактивно
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Структура схемы

Схема определяет артефакты в вашем рабочем процессе и их взаимозависимости:

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

**Ключевые поля:**

| Поле | Назначение |
|------|------------|
| `id` | Уникальный идентификатор, используется в командах и правилах |
| `generates` | Имя выходного файла (поддерживает glob-паттерны, например `specs/**/*.md`) |
| `template` | Файл шаблона в директории `templates/` |
| `instruction` | Инструкции для ИИ по созданию этого артефакта |
| `requires` | Зависимости — какие артефакты должны существовать заранее |

### Шаблоны

Шаблоны — это файлы markdown, которые направляют ИИ. Они вставляются в запрос при создании соответствующего артефакта.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

Шаблоны могут включать:
- Заголовки разделов, которые ИИ должен заполнить
- HTML-комментарии с инструкциями для ИИ
- Примеры форматов, показывающие ожидаемую структуру

### Валидация вашей схемы

Перед использованием пользовательской схемы проверьте её:

```bash
openspec schema validate my-workflow
```

Эта команда проверяет:
- Синтаксис `schema.yaml` корректен
- Все указанные шаблоны существуют
- Нет циклических зависимостей
- Идентификаторы артефактов валидны

### Использование вашей пользовательской схемы

После создания используйте вашу схему:

```bash
# Указать в команде
openspec new change feature --schema my-workflow

# Или установить по умолчанию в config.yaml
schema: my-workflow
```

### Отладка разрешения схемы

Не уверены, какая схема используется? Проверьте:

```bash
# Посмотреть, откуда разрешается конкретная схема
openspec schema which my-workflow

# Список всех доступных схем
openspec schema which --all
```

Вывод покажет, из проекта, пользовательской директории или пакета она берется:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Примечание:** OpenSpec также поддерживает схемы уровня пользователя в `~/.local/share/openspec/schemas/` для использования в разных проектах, но рекомендуется использовать схемы уровня проекта в `openspec/schemas/`, так как они контролируются версиями вместе с вашим кодом.

---

## Примеры

### Рабочий процесс быстрой итерации

Минимальный рабочий процесс для быстрых итераций:

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

### Добавление артефакта ревью

Форкните схему по умолчанию и добавьте шаг ревью:

```bash
openspec schema fork spec-driven with-review
```

Затем отредактируйте `schema.yaml`, чтобы добавить:

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

## Схемы сообщества

OpenSpec также поддерживает схемы, поддерживаемые сообществом, распространяемые через отдельные репозитории. Они предоставляют устоявшиеся рабочие процессы, интегрирующие OpenSpec с другими инструментами или системами, аналогично тому, как работает [каталог расширений сообщества github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) для spec-kit.

Схемы сообщества не включаются в ядро OpenSpec — они живут в собственных репозиториях со своим ритмом выпуска. Чтобы использовать одну из них, скопируйте пакет схемы в директорию `openspec/schemas/<schema-name>/` вашего проекта (в README каждого репозитория есть инструкции по установке).

| Схема | Сопровождающий | Репозиторий | Описание |
|-------|----------------|-------------|----------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Интегрирует управление артефактами OpenSpec с навыками исполнения [obra/superpowers](https://github.com/obra/superpowers) (мозговой штурм, написание планов, TDD через подагентов, ревью кода, завершение). Добавляет артефакт `retrospective` с приоритетом доказательств, заполняя пробел, который Superpowers не покрывает нативно. |

> Хотите внести схему сообщества? Откройте issue со ссылкой на ваш репозиторий или отправьте PR с добавлением строки в эту таблицу.

---

## Смотрите также

- [Справочник CLI: Команды схем](cli.md#schema-commands) - Полная документация по командам