# Настройка

OpenSpec предоставляет три уровня настройки:

| Уровень | Что он делает | Для кого подходит |
|---------|--------------|-------------------|
| **Конфигурация проекта** | Устанавливает значения по умолчанию, внедряет контекст и правила | Для большинства команд |
| **Пользовательские схемы** | Позволяет определять собственные артефакты рабочего процесса | Для команд с уникальными процессами |
| **Глобальные переопределения** | Позволяет использовать одни и те же схемы во всех проектах | Для опытных пользователей |

---

## Конфигурация проекта

Файл `openspec/config.yaml` — самый простой способ настроить OpenSpec под вашу команду. Он позволяет:

- **Установить схему по умолчанию** — не нужно указывать флаг `--schema` при каждом вызове команды
- **Внедрять контекст проекта** — ИИ будет видеть ваш стек технологий, соглашения по коду и т.д.
- **Добавлять правила для отдельных артефактов** — собственные правила для конкретных артефактов

### Быстрая настройка

```bash
openspec init
```

Эта команда запускает интерактивный мастер создания конфигурации. Также вы можете создать конфиг вручную:

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
# Without config
openspec new change my-feature --schema spec-driven

# With config - schema is automatic
openspec new change my-feature
```

**Внедрение контекста и правил:**

При генерации любого артефакта ваш контекст и правила добавляются в промпт для ИИ:

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

- **Контекст** добавляется ко ВСЕМ артефактам
- **Правила** добавляются ТОЛЬКО для соответствующего артефакта

### Порядок выбора схемы

Когда OpenSpec требуется схема, он проверяет источники в следующем порядке:

1. Флаг CLI: `--schema <name>`
2. Метаданные изменения (`.openspec.yaml` в папке с изменением)
3. Конфигурация проекта (`openspec/config.yaml`)
4. Значение по умолчанию (`spec-driven`)

---

## Пользовательские схемы

Если конфигурации проекта недостаточно, вы можете создать собственную схему с полностью кастомизированным рабочим процессом. Пользовательские схемы хранятся в папке `openspec/schemas/` вашего проекта и версионируются вместе с кодом.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Project config
│   ├── schemas/           # Custom schemas live here
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Your changes
└── src/
```

### Форк существующей схемы

Самый быстрый способ кастомизации — создать форк встроенной схемы:

```bash
openspec schema fork spec-driven my-workflow
```

Эта команда копирует всю схему `spec-driven` в папку `openspec/schemas/my-workflow/`, где вы можете свободно её редактировать.

**Что вы получите:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Workflow definition
└── templates/
    ├── proposal.md       # Template for proposal artifact
    ├── spec.md           # Template for specs
    ├── design.md         # Template for design
    └── tasks.md          # Template for tasks
```

Теперь отредактируйте файл `schema.yaml`, чтобы изменить рабочий процесс, или измените шаблоны, чтобы настроить то, что генерирует ИИ.

### Создание схемы с нуля

Для полностью нового рабочего процесса:

```bash
# Interactive
openspec schema init research-first

# Non-interactive
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Структура схемы

Схема определяет артефакты в вашем рабочем процессе и зависимости между ними:

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

**Основные поля:**

| Поле | Назначение |
|------|------------|
| `id` | Уникальный идентификатор, используется в командах и правилах |
| `generates` | Имя выходного файла (поддерживаются глобы, например `specs/**/*.md`) |
| `template` | Файл шаблона в папке `templates/` |
| `instruction` | Инструкции для ИИ при создании этого артефакта |
| `requires` | Зависимости — список артефактов, которые должны существовать заранее |

### Шаблоны

Шаблоны — это markdown-файлы, которые задают направление для ИИ. Они добавляются в промпт при создании соответствующего артефакта.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

Шаблоны могут содержать:
- Заголовки разделов, которые должен заполнить ИИ
- HTML-комментарии с подсказками для ИИ
- Примеры формата, показывающие ожидаемую структуру

### Проверка схемы

Перед использованием пользовательской схемы проверьте её корректность:

```bash
openspec schema validate my-workflow
```

Проверка включает в себя:
- Корректность синтаксиса файла `schema.yaml`
- Существование всех указанных в схеме шаблонов
- Отсутствие циклических зависимостей
- Корректность идентификаторов артефактов

### Использование пользовательской схемы

После создания вы можете использовать схему следующим образом:

```bash
# Specify on command
openspec new change feature --schema my-workflow

# Or set as default in config.yaml
schema: my-workflow
```

### Отладка выбора схемы

Не уверены, какая схема используется в текущий момент? Проверьте это с помощью команды:

```bash
# See where a specific schema resolves from
openspec schema which my-workflow

# List all available schemas
openspec schema which --all
```

В выводе будет указано, откуда взята схема: из вашего проекта, из пользовательской директории или из пакета:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Примечание:** OpenSpec также поддерживает пользовательские схемы, хранящиеся в `~/.local/share/openspec/schemas/` для совместного использования в разных проектах, но рекомендуется использовать схемы уровня проекта в папке `openspec/schemas/`, так как они версионируются вместе с вашим кодом.

---

## Примеры

### Рабочий процесс для быстрой итерации

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

Создайте форк стандартной схемы и добавьте шаг ревью:

```bash
openspec schema fork spec-driven with-review
```

Затем отредактируйте файл `schema.yaml`, чтобы добавить:

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

## Сообщественные схемы

OpenSpec также поддерживает схемы, поддерживаемые сообществом и распространяемые через отдельные репозитории. Они содержат готовые рабочие процессы, интегрирующие OpenSpec с другими инструментами и системами, аналогично тому, как [каталог сообщественных расширений github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) работает для spec-kit.

Сообщественные схемы не входят в состав ядра OpenSpec — они хранятся в отдельных репозиториях и обновляются независимо. Для использования скопируйте пакет схемы в папку `openspec/schemas/<schema-name>/` вашего проекта (инструкции по установке есть в README каждого репозитория).

| Схема | Поддержка | Репозиторий | Описание |
|-------|-----------|-------------|----------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Интегрирует управление артефактами OpenSpec с [навыками выполнения obra/superpowers](https://github.com/obra/superpowers) (мозговой штурм, написание планов, разработка через тестирование (TDD) с помощью сабагентов, ревью кода, завершение работы). Добавляет артефакт `retrospective` с упором на доказательства, который закрывает пробел, не покрываемый Superpowers нативно. |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | Рабочий процесс с упором на менеджера продукта. Запускает [конвейер планирования nanopm](https://github.com/nmrtn/nanopm) (аудит → стратегия → дорожная карта → PRD) перед этапом реализации. Связывает планирование продукта с рабочим процессом spec-driven-инженерии OpenSpec. Артефакты считываются из папки `.nanopm/`, если она присутствует: предложение использует результаты аудита, проектирование использует стратегию, а задачи используют разбивку из PRD. |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | Руководства по сквозному (E2E) тестированию на уровне возможностей. Для каждой возможности создаётся неизменяемая спецификация, неизменяемый шаблон задач и одна запись запуска с отметкой времени для каждого выполнения. Утверждения основаны только на наблюдаемом поведении (HTTP-статус, тело ответа, сохранённое состояние — никогда подстроки логов); каждый запуск фиксирует время начала и окончания по UTC, длительность и примерное потребление токенов LLM. |

> Хотите добавить свою сообщественную схему? Откройте issue с ссылкой на ваш репозиторий или отправьте PR с добавлением строки в эту таблицу.

---

## Смотрите также

- [Справочник CLI: Команды для работы со схемами](cli.md#schema-commands) — полная документация по командам