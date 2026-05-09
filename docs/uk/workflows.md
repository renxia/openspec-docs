# Робочі процеси

Цей посібник охоплює типові шаблони робочих процесів для OpenSpec та пояснює, коли кожен з них використовувати. Для базового налаштування перегляньте [Початок роботи](getting-started.md). Для довідки з команд перегляньте [Команди](commands.md).

## Філософія: Дії, а не етапи

Традиційні робочі процеси змушують вас проходити через етапи: планування, потім реалізація, потім завершення. Але реальна робота не вкладається в такі чіткі рамки.

OPSX пропонує інший підхід:

```text
Традиційний (закріплений за етапами):

  ПЛАНУВАННЯ ────────► РЕАЛІЗАЦІЯ ────────► ЗАВЕРШЕНО
      │                    │
      │   "Не можна повернутися"  │
      └────────────────────┘

OPSX (гнучкі дії):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Ключові принципи:**

- **Дії, а не етапи** - Команди — це те, що ви можете робити, а не стадії, в яких ви застрягли
- **Залежності є каталізаторами** - Вони показують, що можливо, а не що потрібно робити далі

> **Налаштування:** Робочі процеси OPSX керуються схемами, які визначають послідовності артефактів. Детальніше про створення власних схем дивіться у розділі [Налаштування](customization.md).

## Два режими

### Шлях за замовчуванням (профіль `core`)

Нові встановлення типово використовують `core`, який надає:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Типовий робочий процес:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

### Розширений/повний робочий процес (вибіркова конфігурація)

Якщо вам потрібні явні команди для створення та збірки (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), увімкніть їх за допомогою:

```bash
openspec config profile
openspec update
```

## Шаблони робочих процесів (розширений режим)

### Швидка функціональність

Коли ви знаєте, що хочете побудувати, і вам просто потрібно виконати:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Приклад діалогу:**

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

**Найкраще підходить для:** Малих та середніх функціональностей, виправлення помилок, простих змін.

### Дослідницький режим

Коли вимоги нечіткі або потрібно спочатку дослідити:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Приклад діалогу:**

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

**Найкраще підходить для:** Оптимізації продуктивності, налагодження, архітектурних рішень, нечітких вимог.

### Паралельні зміни

Робота над кількома змінами одночасно:

```text
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in progress)
                                         │
                                    context switch
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Приклад діалогу:**

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

**Найкраще підходить для:** Паралельних робочих потоків, термових перерв, командної роботи.

Коли у вас є кілька завершених змін, використовуйте `/opsx:bulk-archive`:

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

Масове архівування виявляє, коли кілька змін стосуються одних і тих самих специфікацій, і вирішує конфлікти, перевіряючи, що фактично реалізовано.

### Завершення зміни

Рекомендований процес завершення:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              перевіряє          пропонує синхронізувати
              реалізацію         за потреби
```

#### Verify: Перевірте свою роботу

`/opsx:verify` валідує реалізацію відносно ваших артефактів за трьома вимірами:

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

**Що перевіряє verify:**

| Вимір | Що валідується |
|-------|----------------|
| Повнота | Усі завдання виконані, всі вимоги реалізовані, сценарії покриті |
| Коректність | Реалізація відповідає наміру специфікації, граничні випадки оброблені |
| Узгодженість | Архітектурні рішення відображені в коді, шаблони узгоджені |

Verify не блокує архівування, але виявляє проблеми, які ви можете захотіти вирішити спочатку.

#### Archive: Завершення зміни

`/opsx:archive` завершує зміну та переміщує її до архіву:

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

Archive запропонує синхронізацію, якщо специфікації не синхронізовані. Він не блокуватиме через незавершені завдання, але попередить вас.

## Коли що використовувати

### `/opsx:ff` проти `/opsx:continue`

| Ситуація | Використовуйте |
|----------|----------------|
| Чіткі вимоги, готові до збірки | `/opsx:ff` |
| Дослідження, бажання переглянути кожен крок | `/opsx:continue` |
| Бажання опрацювати пропозицію перед специфікаціями | `/opsx:continue` |
| Брак часу, потрібно рухатися швидко | `/opsx:ff` |
| Складна зміна, потрібен контроль | `/opsx:continue` |

**Загальне правило:** Якщо ви можете описати повний обсяг заздалегідь, використовуйте `/opsx:ff`. Якщо ви з'ясовуєте все в процесі, використовуйте `/opsx:continue`.

### Коли оновлювати, а коли починати заново

Поширене питання: коли можна оновити існуючу зміну, а коли слід почати нову?

**Оновлюйте існуючу зміну, коли:**

- Той самий намір, уточнене виконання
- Обсяг звужується (спочатку MVP, решта пізніше)
- Виправлення на основі отриманих знань (кодова база виявилася не такою, як очікувалося)
- Коригування дизайну на основі відкриттів під час реалізації

**Починайте нову зміну, коли:**

- Намір кардинально змінився
- Обсяг розрісся до зовсім іншої роботи
- Оригінальну зміну можна позначити як «завершену» окремо
- Латки заплутають більше, ніж прояснять

```text
                     ┌─────────────────────────────────────┐
                     │     Це та сама робота?              │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Той самий намір?  >50% перекриття?   Чи може оригінал
          Та сама проблема? Той самий обсяг?    бути "done" без
                 │                  │          цих змін?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      ТАК              НІ ТАК           НІ  НІ             ТАК
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    ОНОВИТИ           НОВА ОНОВИТИ      НОВА ОНОВИТИ         НОВА
```

**Приклад: «Додати темний режим»**

- «Потрібно також підтримувати користувацькі теми» → Нова зміна (обсяг розширився)
- «Визначення системних налаштувань складніше, ніж очікувалося» → Оновлення (той самий намір)
- «Давайте спочатку випустимо перемикач, налаштування додамо пізніше» → Оновлення, потім архівування, потім нова зміна

## Найкращі практики

### Тримайте зміни сфокусованими

Один логічний блок роботи на зміну. Якщо ви робите «додати функцію X і також рефакторити Y», розгляньте дві окремі зміни.

**Чому це важливо:**
- Легше переглядати та розуміти
- Чистіша історія архіву
- Можна випустити незалежно
- Простіше відкотити за потреби

### Використовуйте `/opsx:explore` для нечітких вимог

Перед тим як створювати зміну, дослідіть проблемну область:

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

Дослідження прояснює мислення до створення артефактів.

### Перевіряйте перед архівуванням

Використовуйте `/opsx:verify` для перевірки відповідності реалізації артефактам:

```text
You: /opsx:verify

AI:  Verifying add-dark-mode...

     ✓ All tasks in tasks.md are checked
     ✓ Requirements in specs have corresponding code
     ✓ Design decisions are reflected in implementation

     Ready to archive!
```

Виявляє невідповідності до закриття зміни.

### Називайте зміни зрозуміло

Гарні назви роблять `openspec list` корисним:

```text
Гарно:                         Уникайте:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Швидкий довідник команд

Для повної інформації про команди та їхні параметри перегляньте [Команди](commands.md).

| Команда | Призначення | Коли використовувати |
|---------|-------------|----------------------|
| `/opsx:propose` | Створити зміну та артефакти планування | Шлях за замовчуванням (профіль `core`) |
| `/opsx:explore` | Обміркувати ідеї | Нечіткі вимоги, дослідження |
| `/opsx:new` | Розпочати каркас зміни | Розширений режим, явний контроль артефактів |
| `/opsx:continue` | Створити наступний артефакт | Розширений режим, поетапне створення артефактів |
| `/opsx:ff` | Створити всі артефакти планування | Розширений режим, чіткий обсяг |
| `/opsx:apply` | Реалізувати завдання | Готовність писати код |
| `/opsx:verify` | Перевірити реалізацію | Розширений режим, перед архівацією |
| `/opsx:sync` | Об'єднати дельта-специфікації | Розширений режим, необов'язково |
| `/opsx:archive` | Завершити зміну | Всю роботу виконано |
| `/opsx:bulk-archive` | Архівувати кілька змін | Розширений режим, паралельна робота |

## Наступні кроки

- [Команди](commands.md) - Повний довідник команд з параметрами
- [Концепції](concepts.md) - Глибоке занурення в специфікації, артефакти та схеми
- [Кастомізація](customization.md) - Створення власних робочих процесів