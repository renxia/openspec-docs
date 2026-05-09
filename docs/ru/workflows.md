# Рабочие процессы

Это руководство описывает типовые шаблоны рабочих процессов для OpenSpec и случаи их применения. Для базовой настройки см. раздел [Начало работы](getting-started.md). Для справки по командам см. раздел [Команды](commands.md).

## Философия: Действия, а не этапы

Традиционные рабочие процессы заставляют вас проходить этапы: планирование, затем реализация, затем завершение. Но реальная работа не укладывается в такие жесткие рамки.

OPSX использует другой подход:

```text
Традиционный (с привязкой к этапам):

  ПЛАНИРОВАНИЕ ────────► РЕАЛИЗАЦИЯ ────────► ЗАВЕРШЕНИЕ
      │                    │
      │   "Нельзя вернуться"  │
      └────────────────────┘

OPSX (гибкие действия):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Ключевые принципы:**

- **Действия, а не этапы** — Команды представляют собой операции, которые вы можете выполнять, а не стадии, на которых вы застреваете.
- **Зависимости как возможности** — Они показывают, что возможно сделать, а не что требуется выполнить следующим.

> **Настройка:** Рабочие процессы OPSX управляются схемами, которые определяют последовательности артефактов. Подробнее о создании пользовательских схем см. в разделе [Настройка](customization.md).

## Два режима

### Быстрый путь по умолчанию (профиль `core`)

При новой установке по умолчанию используется `core`, который предоставляет:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Типичный рабочий процесс:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

### Расширенный/полный рабочий процесс (пользовательский выбор)

Если вам нужны явные команды для создания и сборки (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), включите их с помощью:

```bash
openspec config profile
openspec update
```

## Шаблоны рабочего процесса (расширенный режим)

### Быстрая функция

Когда вы точно знаете, что хотите реализовать, и нужно только выполнить:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Пример диалога:**

```text
You: /opsx:new add-logout-button

AI:  Created openspec/changes/add-logout-button/
     Ready to create: proposal

You: /opsx:ff

AI:  Creating all planning artifacts...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Ready for implementation!

You: /opsx:apply

AI:  Working through tasks...
     ✓ Added logout button to header
     ✓ Implemented session clearing
     ✓ Added confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  ✓ Merged specs
     ✓ Archived change
```

**Лучше всего подходит для:** небольших и средних функций, исправлений ошибок, простых изменений.

### Исследовательский режим

Когда требования неясны или нужно сначала провести исследование:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Пример диалога:**

```text
You: /opsx:explore

AI:  What would you like to explore?

You: I want to improve page load performance but I'm not sure
     where the bottlenecks are.

AI:  Let me help investigate...
     [Analyzes bundle sizes, identifies slow queries, reviews
     component render patterns]

     I found three main bottlenecks:
     1. Large unoptimized images
     2. Synchronous data fetching in ProductList
     3. Re-renders from context changes

     Which would you like to address first?

You: Let's tackle the data fetching issue.

You: /opsx:new optimize-product-list-fetching

AI:  Created change. Ready to create: proposal

You: /opsx:continue

AI:  Creating proposal based on our exploration...
     [Writes proposal incorporating investigation insights]

     Ready to create: specs, design
     Which would you like next?

You: /opsx:continue

AI:  Creating specs...
```

**Лучше всего подходит для:** оптимизации производительности, отладки, архитектурных решений, неясных требований.

### Параллельные изменения

Работа с несколькими изменениями одновременно:

```text
Изменение A: /opsx:new ──► /opsx:ff ──► /opsx:apply (в процессе)
                                         │
                                    переключение контекста
                                         │
Изменение B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Пример диалога:**

```text
You: I'm working on add-dark-mode but got pulled into a bug fix

You: /opsx:new fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/

You: /opsx:ff

AI:  ✓ Created planning artifacts

You: /opsx:apply

AI:  Working on fix-login-redirect...
     [Implements the fix]
     All tasks complete!

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect

You: Let's get back to dark mode

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode...
     Picking up at task 2.3: Update Header...
```

**Лучше всего подходит для:** параллельных рабочих потоков, срочных прерываний, командной работы.

Когда у вас есть несколько завершённых изменений, используйте `/opsx:bulk-archive`:

```text
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (all tasks done)
     - fix-login-redirect (all tasks done)
     - update-footer (all tasks done)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will apply in chronological order.

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-redirect
     ✓ Archived update-footer
     Specs merged in order: add-dark-mode → update-footer
```

Массовое архивирование определяет, когда несколько изменений затрагивают одни и те же спецификации, и разрешает конфликты, проверяя, что фактически реализовано.

### Завершение изменения

Рекомендуемый процесс завершения:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              проверяет          предлагает синхронизацию
              реализацию         при необходимости
```

#### Проверка: проверьте свою работу

`/opsx:verify` проверяет реализацию по вашим артефактам по трём направлениям:

```text
You: /opsx:verify

AI:  Verifying add-auth...

     COMPLETENESS
     ✓ All 12 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Session timeout after inactivity" not tested

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "event-driven" but implementation uses polling

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for session timeout scenario
     2. Consider refactoring to event-driven as designed, or update design.md
```

**Что проверяет verify:**

| Направление | Что проверяется |
|-------------|-----------------|
| Полнота | Все задачи выполнены, все требования реализованы, сценарии покрыты |
| Корректность | Реализация соответствует замыслу спецификации, граничные случаи обработаны |
| Согласованность | Решения по дизайну отражены в коде, паттерны непротиворечивы |

Проверка не блокирует архивирование, но выявляет проблемы, которые вы, возможно, захотите устранить сначала.

#### Архивирование: завершение изменения

`/opsx:archive` завершает изменение и перемещает его в архив:

```text
You: /opsx:archive

AI:  Archiving add-auth...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (12/12 tasks complete)

     Delta specs: Not yet synced to main
     → Would you like to sync now?

You: Yes

AI:  ✓ Synced specs to openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-auth/

     Change archived successfully.
```

Архивирование предложит синхронизацию, если спецификации не синхронизированы. Оно не блокирует при незавершённых задачах, но предупредит вас.

## Когда что использовать

### `/opsx:ff` vs `/opsx:continue`

| Ситуация | Использовать |
|----------|--------------|
| Чёткие требования, готов к реализации | `/opsx:ff` |
| Исследование, нужно проверять каждый шаг | `/opsx:continue` |
| Нужно доработать предложение перед спецификациями | `/opsx:continue` |
| Ограничение по времени, нужно двигаться быстро | `/opsx:ff` |
| Сложное изменение, нужен контроль | `/opsx:continue` |

**Правило:** если вы можете описать полный объём заранее, используйте `/opsx:ff`. Если разбираетесь по ходу, используйте `/opsx:continue`.

### Когда обновлять, а когда начинать заново

Частый вопрос: когда допустимо обновлять существующее изменение, а когда нужно начинать новое?

**Обновляйте существующее изменение, когда:**

- Тот же замысел, уточнённое исполнение
- Объём сужается (сначала MVP, остальное позже)
- Корректировки на основе изучения (кодовая база оказалась не такой, как ожидалось)
- Доработки дизайна на основе открытий при реализации

**Начинайте новое изменение, когда:**

- Замысел кардинально изменился
- Объём разросся до совершенно другой работы
- Оригинальное изменение может быть отмечено как «завершённое» самостоятельно
- Патчи запутают больше, чем прояснят

```text
                     ┌─────────────────────────────────────┐
                     │     Это та же самая работа?         │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Тот же замысел?   >50% перекрытия?   Оригинал может
          Та же проблема?   Тот же объём?      быть «завершён» без
                 │                  │          этих изменений?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      ДА                НЕТ ДА           НЕТ НЕТ             ДА
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
   ОБНОВИТЬ          НОВОЕ ОБНОВИТЬ    НОВОЕ ОБНОВИТЬ       НОВОЕ
```

**Пример: «Добавить тёмную тему»**

- «Нужно также поддержать пользовательские темы» → Новое изменение (объём разросся)
- «Определение системных предпочтений оказалось сложнее, чем ожидалось» → Обновление (тот же замысел)
- «Давайте сначала выпустим переключатель, настройки добавим позже» → Обновление, затем архивирование, затем новое изменение

## Рекомендуемые практики

### Сохраняйте фокус изменений

Одна логическая единица работы на изменение. Если вы делаете «добавить функцию X и также рефакторить Y», рассмотрите два отдельных изменения.

**Почему это важно:**
- Легче проверять и понимать
- Чистая история архива
- Можно выпустить независимо
- Проще откатить при необходимости

### Используйте `/opsx:explore` для неясных требований

Перед тем как приступить к изменению, исследуйте проблемную область:

```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle rate limiting for our API?

AI:  Let me investigate your current setup and options...
     [Researches codebase, considers patterns]

     I see three approaches we could take:
     1. Middleware-based (simple, per-endpoint)
     2. Redis-backed (scalable, shared state)
     3. Token bucket per user (fair, complex)

     Your current stack suggests #1 or #2. What's your scale?
```

Исследование проясняет мышление до создания артефактов.

### Проверяйте перед архивированием

Используйте `/opsx:verify` для проверки соответствия реализации артефактам:

```text
You: /opsx:verify

AI:  Verifying add-dark-mode...

     ✓ All tasks in tasks.md are checked
     ✓ Requirements in specs have corresponding code
     ✓ Design decisions are reflected in implementation

     Ready to archive!
```

Обнаруживает несоответствия до закрытия изменения.

### Давайте изменениям понятные имена

Хорошие имена делают `openspec list` полезным:

```text
Хорошо:                        Избегайте:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Краткая справка по командам

Полную информацию о командах и их параметрах см. в разделе [Команды](commands.md).

| Команда | Назначение | Когда использовать |
|---------|------------|---------------------|
| `/opsx:propose` | Создание изменений и артефактов планирования | Быстрый путь по умолчанию (профиль `core`) |
| `/opsx:explore` | Проработка идей | Неясные требования, исследование |
| `/opsx:new` | Начать создание каркаса изменений | Расширенный режим, явное управление артефактами |
| `/opsx:continue` | Создать следующий артефакт | Расширенный режим, пошаговое создание артефактов |
| `/opsx:ff` | Создать все артефакты планирования | Расширенный режим, четкая область видимости |
| `/opsx:apply` | Реализовать задачи | Готовность к написанию кода |
| `/opsx:verify` | Проверить реализацию | Расширенный режим, перед архивацией |
| `/opsx:sync` | Объединить дельта-спецификации | Расширенный режим, опционально |
| `/opsx:archive` | Завершить изменение | Вся работа завершена |
| `/opsx:bulk-archive` | Архивировать несколько изменений | Расширенный режим, параллельная работа |

## Следующие шаги

- [Команды](commands.md) - Полный справочник по командам с параметрами
- [Концепции](concepts.md) - Подробное описание спецификаций, артефактов и схем
- [Настройка](customization.md) - Создание пользовательских рабочих процессов