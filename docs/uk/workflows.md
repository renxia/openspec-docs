# Робочі процеси

Цей посібник охоплює поширені шаблони робочих процесів для OpenSpec та випадки використання кожного з них. Для базового налаштування див. [Початок роботи](getting-started.md). Для довідки щодо команд див. [Команди](commands.md).

## Філософія: Дії, а не фази

Традиційні робочі процеси змушують вас проходити через фази: планування, потім реалізація, потім завершення. Але реальна робота не вміщується акуратно у рамки.

OPSX використовує інший підхід:

```text
Традиційний (закріплений за фазами):

  ПЛАНУВАННЯ ────────► РЕАЛІЗАЦІЯ ────────► ЗАВЕРШЕНО
      │                    │
      │   "Не можна повернутись назад"  │
      └────────────────────┘

OPSX (гнучкі дії):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Ключові принципи:**

- **Дії, а не фази** — Команди — це те, що ви можете робити, а не етапи, на яких ви застрягли
- **Залежності — це можливості** — Вони показують, що можливо, а не те, що потрібно робити наступним

> **Налаштування:** Робочі процеси OPSX керуються схемами, які визначають послідовності артефактів. Див. [Налаштування](customization.md) для отримання детальної інформації про створення користувацьких схем.

## Два режими

### Швидкий шлях за замовчуванням (профіль `core`)

Нові встановлення за замовчуванням використовують `core`, який надає:
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Типовий потік:

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (необов'язково)
```

#### Почніть з дослідження (звичка, яка варта того)

`/opsx:explore` є частиною профілю за замовчуванням, а не розширеним доповненням. Це крок, який варто робити щоразу, коли у вас є проблема, але ще немає плану, що з помічником на штучному інтелекті — більшість часу.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Our search results feel stale. I'm not sure if it's caching,
     indexing, or the query itself.

AI:  Let me look... [reads the search service and cache layer]
     It's the index: it only rebuilds nightly, so edits don't show
     up until the next day. Two options: rebuild on write (simple,
     more load) or a short-TTL cache invalidation (more moving parts,
     less load). Given your write volume is low, rebuild-on-write is
     the cleaner fix. Want to scope it?

You: Yes.

You: /opsx:propose rebuild-search-index-on-write
```

Дослідження не створює артефактів і не пише код. Це вільна розмова без ризиків, яка перетворює розмите занепокоєння на точну зміну, тому пропозиція, що слідує за цим, буде чіткою. Вже точно знаєте, чого хочете? Пропустіть цей крок і перейдіть одразу до `/opsx:propose`. Повний посібник: [Спочатку дослідіть](explore.md).

### Розширений/Повний робочий процес (власний вибір)

Якщо вам потрібні явні команди створення каркаса та збирання (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), увімкніть їх за допомогою:

```bash
openspec config profile
openspec update
```

## Шаблони робочого процесу (Розширений режим)

### Швидка функція

Коли ви знаєте, що хочете побудувати, і потрібно лише виконати:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Приклад розмови:**

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

**Найкраще для:** Невеликих та середніх функцій, виправлення помилок, прямолінійних змін.

### Дослідницький

Коли вимоги незрозумілі або потрібно спочатку дослідити:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Приклад розмови:**

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

**Найкраще для:** Оптимізації продуктивності, налагодження, архітектурних рішень, незрозумілих вимог.

### Паралельні зміни

Працюйте над кількома змінами одночасно:

```text
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in progress)
                                         │
                                    context switch
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Приклад розмови:**

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

**Найкраще для:** Паралельних робочих потоків, термінових переривань, командної співпраці.

Коли у вас є кілько завершених змін, використовуйте `/opsx:bulk-archive`:

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

Масова архівація виявляє, коли кілька змін торкаються одних і тих же spec-ів, і вирішує конфлікти, перевіряючи, що фактично реалізовано.

### Завершення зміни

Рекомендований потік завершення:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              validates          prompts to sync
              implementation     if needed
```

#### Перевірка: Перевірте свою роботу

`/opsx:verify` перевіряє реалізацію відносно ваших артефактів за трьома вимірами:

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

| Вимір | Що він перевіряє |
|--------|------------------|
| Повнота | Усі завдання виконані, усі вимоги реалізовані, сценарії охоплені |
| Коректність | Реалізація відповідає задуму spec-у, граничні випадки оброблені |
| Узгодженість | Архітектурні рішення відображені в структурі коду, патерни узгоджені |

Перевірка не блокує архівацію, але виявляє проблеми, які, можливо, варто вирішити спочатку.

#### Архівація: Фіналізація зміни

`/opsx:archive` завершує зміну і переміщує її до архіву:

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

Архівація запить, якщо spec-и не синхронізовані. Вона не блокується на незавершених завданнях, але попередить вас.

## Коли що використовувати

### `/opsx:ff` vs `/opsx:continue`

| Ситуація | Використання |
|-----------|-----|
| Чіткі вимоги, готовність будувати | `/opsx:ff` |
| Дослідження, хочете переглянути кожен крок | `/opsx:continue` |
| Хочете ітерувати пропозицію перед spec-ами | `/opsx:continue` |
| Тиск часу, потрібно рухатися швидко | `/opsx:ff` |
| Складна зміна, потрібен контроль | `/opsx:continue` |

**Правило:** Якщо ви можете описати повний обсяг спочатку, використовуйте `/opsx:ff`. Якщо розбираєтесь по ходу, використовуйте `/opsx:continue`.

### Коли оновлювати, а Коли починати з нового

Поширене запитання: коли можна оновити існуючу зміну, а коли варто почати нову?

**Оновіть існуючу зміну, коли:**

- Той самий задум, уточнене виконання
- Обсяг звужується (MVP спочатку, решта пізніше)
- Корективи на основі навчання (кодова база не такою, якою ви її очікували)
- Налаштування дизайну на основі відкриттів під час реалізації

**Почніть нову зміну, коли:**

- Задум фундаментально змінився
- Обсяг виріс до зовсім іншої роботи
- Оригінальну зміну можна позначити як "завершену" самостійно
- Патчі створять більше плутанини, ніж ясності

```text
                     ┌─────────────────────────────────────┐
                     │     Is this the same work?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Same intent?      >50% overlap?      Can original
          Same problem?     Same scope?        be "done" without
                 │                  │          these changes?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      YES               NO YES           NO  NO              YES
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    UPDATE            NEW  UPDATE       NEW  UPDATE          NEW
```

**Приклад: "Додати темну тему"**

- "Потрібно також підтримувати користувацькі теми" → Нова зміна (обсяг виріс)
- "Визначення системних налаштувань складніше, ніж очікувалося" → Оновлення (той самий задум)
- "Давайте випустимо перемикач спочатку, додати налаштування пізніше" → Оновити та архівувати, потім нова зміна

## Найкращі практики

### Тримайте зміни сфокусованими

Одна логічна одиниця роботи на одну зміну. Якщо ви робите "додати функцію X і також рефакторинг Y", розгляньте дві окремі зміни.

**Чому це важливо:**
- Легше переглядати і розуміти
- Чистіша історія архіву
- Можна випускати незалежно
- Простіший відкат за потреби

### Використовуйте `/opsx:explore` для незрозумілих вимог

Перед тим як взяти на себе зобов'язання щодо зміни, дослідіть простір проблеми:

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

Дослідження уточнює мислення перед тим, як створювати артефакти.

### Перевіряйте перед архівацією

Використовуйте `/opsx:verify`, щоб перевірити, чи реалізація відповідає артефактам:

```text
You: /opsx:verify

AI:  Verifying add-dark-mode...

     ✓ All tasks in tasks.md are checked
     ✓ Requirements in specs have corresponding code
     ✓ Design decisions are reflected in implementation

     Ready to archive!
```

Виявляє невідповідності перед тим, як закрити зміну.

### Називайте зміни зрозуміло

Гарні назви роблять `openspec list` корисним:

```text
Good:                          Avoid:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Швидкий довідник з команд

Повний опис команд та їх параметрів дивіться в розділі [Команди](commands.md).

| Команда | Призначення | Коли використовувати |
|---------|-------------|----------------------|
| `/opsx:propose` | Створити зміну + артефакти планування | Швидкий шлях за замовчуванням (профіль `core`) |
| `/opsx:explore` | Обдумати ідеї разом з ШІ | Почніть тут, якщо не впевнені: нечіткі вимоги, дослідження, порівняння варіантів |
| `/opsx:new` | Розпочати каркас зміни | Розширений режим, явне керування артефактами |
| `/opsx:continue` | Створити наступний артефакт | Розширений режим, крок за кроком створення артефактів |
| `/opsx:ff` | Створити всі артефакти планування | Розширений режим, чітко визначений обсяг |
| `/opsx:apply` | Реалізувати завдання | Готові до написання коду |
| `/opsx:verify` | Перевірити коректність реалізації | Розширений режим, перед архівацією |
| `/opsx:sync` | Об'єднати дельта-специфікації | Розширений режим, необов'язково |
| `/opsx:archive` | Завершити зміну | Вся робота виконана |
| `/opsx:bulk-archive` | Архівувати кілька змін | Розширений режим, паралельна робота |

## Наступні кроки

- [Написання якісних специфікацій](writing-specs.md) - Як виглядають якісні вимоги та сценарії, і як правильно визначити обсяг зміни
- [Огляд змін](reviewing-changes.md) - Двохвилинний огляд проекту плану перед початком роботи з кодом
- [OpenSpec при роботі в команді](team-workflow.md) - Як зміни інтегруються з гілками та запитами на злиття
- [Команди](commands.md) - Повний довідник з команд та їх параметрів
- [Концепції](concepts.md) - Глибоке занурення у специфікації, артефакти та схеми
- [Налаштування](customization.md) - Створення власних робочих процесів