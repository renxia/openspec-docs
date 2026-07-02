# Команди

Це довідка щодо слеш-команд (slash commands) OpenSpec. Ці команди викликаються у чат-інтерфейсі вашого AI-асистента для кодування (наприклад, Claude Code, Cursor, Windsurf).

Для знайомства з шаблонами робочих процесів та тим, коли використовувати кожну команду, дивіться [Workflows](workflows.md). Для CLI-команд дивіться [CLI](cli.md).

## Швидка довідка

### Стандартний швидкий шлях (`core` profile)

| Command | Purpose |
|---------|---------|
| `/opsx:propose` | Створити зміни та згенерувати артефакти планування за один крок |
| `/opsx:explore` | Продумати ідеї перед тим, як затвердити зміни |
| `/opsx:apply` | Впровадити завдання зі змін |
| `/opsx:sync` | Злити delta specs у основні специфікації (main specs) |
| `/opsx:archive` | Архівувати завершені зміни |

### Розширені команди робочих процесів (вибір кастомного workflow)

| Command | Purpose |
|---------|---------|
| `/opsx:new` | Почати новий каркас змін (change scaffold) |
| `/opsx:continue` | Створити наступний артефакт на основі залежностей |
| `/opsx:ff` | Fast-forward: створити всі артефакти планування одразу |
| `/opsx:verify` | Перевірити, що реалізація відповідає артефактам |
| `/opsx:bulk-archive` | Архівувати кілька змін одночасно |
| `/opsx:onboard` | Покроковий навчальний тур через повний робочий процес |

Стандартний глобальний профіль — `core`. Щоб увімкнути розширені команди робочих процесів, виконайте `openspec config profile`, виберіть потрібні workflow, а потім запустіть `openspec update` у своєму проєкті.

---

## Довідка команд

### `/opsx:propose`

Створює нову зміну та генерує артефакти планування за один крок. Це команда за замовчуванням у профілі `core`.

**Синтаксис:**
```text
/opsx:propose [change-name-or-description]
```

**Аргументи:**
| Аргумент | Обов'язково | Опис |
|----------|----------|-------------|
| `change-name-or-description` | Ні | Ім'я у kebab-case або опис зміни простою мовою |

**Що це робить:**
- Створює `openspec/changes/<change-name>/`
- Генерує артефакти, необхідні перед реалізацією (для `spec-driven`: proposal, specs, design, tasks)
- Зупиняється, коли зміна готова для `/opsx:apply`

**Приклад:**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**Поради:**
- Використовуйте це для найшвидшого шляху від початку до кінця
- Якщо ви хочете контролювати артефакти крок за кроком, увімкніть розширені робочі процеси та використовуйте `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **Почніть тут, якщо ви не впевнені.** Explore — це партнер для мислення без ризиків: він читає ваш код, порівнює варіанти та перетворює розмиту ідею на конкретний план до того, як з'явиться будь-які зміни. Він є у стандартному профілі. Для повного опису та додаткових прикладів дивіться гайд [Explore First](explore.md).

Продумайте ідеї, досліджуйте проблеми та уточнюйте вимоги перед тим, як зобов'язатися на зміну.

**Синтаксис:**
```
/opsx:explore [topic]
```

**Аргументи:**
| Аргумент | Обов'язково | Опис |
|----------|----------|-------------|
| `topic` | Ні | Тема, яку ви хочете дослідити або з'ясувати |

**Що це робить:**
- Відкриває дослідницьку розмову без необхідності структури
- Досліджує код, щоб відповісти на запитання
- Порівнює варіанти та підходи
- Створює візуальні діаграми для уточнення мислення
- Може перейти до `/opsx:propose` (за замовчуванням) або `/opsx:new` (розширений робочий процес), коли інсайти кристалізуються

**Приклад:**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT. Can we start a change for that?

AI:  Ready when you are. Run /opsx:propose add-jwt-auth to begin.
```

**Поради:**
- Використовуйте, коли вимоги незрозумілі або вам потрібно дослідити
- Жоден артефакти під час дослідження не створюються
- Добре підходить для порівняння кількох підходів перед прийняттям рішення
- Може читати файли та шукати в кодовій базі

---

### `/opsx:new`

Початок нової структури зміни. Створює папку змін і чекає, поки ви згенеруєте артефакти за допомогою `/opsx:continue` або `/opsx:ff`.

Ця команда є частиною набору розширених робочих процесів (не включена у стандартний профіль `core`).

**Синтаксис:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Аргументи:**
| Аргумент | Обов'язково | Опис |
|----------|----------|-------------|
| `change-name` | Ні | Ім'я для папки зміни (запитується, якщо не надано) |
| `--schema` | Ні | Схема робочого процесу для використання (за замовчуванням: з конфігурації або `spec-driven`) |

**Що це робить:**
- Створює директорію `openspec/changes/<change-name>/`
- Створює файл метаданих `.openspec.yaml` у папці зміни
- Показує перший шаблон артефакту, готовий до створення
- Запитує ім'я та схему змін, якщо вони не надані

**Що це створює:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Метадані зміни (схема, дата створення)
```

**Приклад:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**Поради:**
- Використовуйте описові назви: `add-feature`, `fix-bug`, `refactor-module`
- Уникайте загальних назв на кшталт `update`, `changes`, `wip`
- Схему також можна встановити в конфігурації проекту (`openspec/config.yaml`)

---

### `/opsx:continue`

Створює наступний артефакт у ланцюжку залежностей. Створює по одному артефакту для інкрементального прогресу.

**Синтаксис:**
```
/opsx:continue [change-name]
```

**Аргументи:**
| Аргумент | Обов'язково | Опис |
|----------|----------|-------------|
| `change-name` | Ні | Яку зміну продовжувати (визначається з контексту, якщо не надано) |

**Що це робить:**
- Запитує граф залежностей артефактів
- Показує, які артефакти готові, а які заблоковані
- Створює перший готовий артефакт
- Читає файли залежностей для контексту
- Показує, що стає доступним після створення

**Приклад:**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: tasks
     Run /opsx:continue to create the next artifact.
```

**Поради:**
- Використовуйте, коли хочете переглянути кожен артефакт перед продовженням
- Добре підходить для складних змін, де ви хочете мати контроль
- Кілька артефактів можуть стати готовими одночасно
- Ви можете редагувати створені артефакти перед продовженням

---

### `/opsx:ff`

Прискорене створення артефактів. Створює всі планируючі артефакти одразу.

**Синтаксис:**
```
/opsx:ff [change-name]
```

**Аргументи:**
| Аргумент | Обов'язково | Опис |
|----------|----------|-------------|
| `change-name` | Ні | Яку зміну потрібно прискорити (визначається з контексту, якщо не надано) |

**Що це робить:**
- Створює всі артефакти у порядку залежностей
- Відстежує прогрес через список завдань
- Зупиняється, коли всі артефакти `apply-required` завершені
- Читає кожну залежність перед створенням наступного артефакту

**Приклад:**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**Поради:**
- Використовуйте, коли у вас є чітке уявлення про те, що ви створюєте
- Швидше, ніж `/opsx:continue`, для простих змін
- Ви все ще можете редагувати артефакти пізніше
- Добре підходить для невеликих та середніх функцій

---

### `/opsx:apply`

Реалізує завдання зі зміни. Проходить через список завдань, пишучи код і відмічаючи пункти.

**Синтаксис:**
```
/opsx:apply [change-name]
```

**Аргументи:**
| Аргумент | Обов'язково | Опис |
|----------|----------|-------------|
| `change-name` | Ні | Яку зміну реалізувати (визначається з контексту, якщо не надано) |

**Що це робить:**
- Читає `tasks.md` та визначає незавершені завдання
- Проходить через завдання по одному
- Пише код, створює файли, виконує тести за потреби
- Позначає завдання як виконані чекбоксами `[x]`

**Приклад:**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**Поради:**
- Може відновити, якщо було перервано
- Використовуйте для паралельних змін, вказавши ім'я зміни
- Статус завершення відстежується у чекбоксах `tasks.md`

---

### `/opsx:verify`

Перевіряє, чи реалізація відповідає артефактам вашої зміни. Перевіряє повнотужність, коректність та узгодженість.

**Синтаксис:**
```
/opsx:verify [change-name]
```

**Аргументи:**
| Аргумент | Обов'язково | Опис |
|----------|----------|-------------|
| `change-name` | Ні | Яку зміну потрібно перевірити (визначається з контексту, якщо не надано) |

**Що це робить:**
- Перевіряє три виміри якості реалізації
- Шукає докази реалізації у кодовій базі
- Звітує про проблеми, класифіковані як CRITICAL, WARNING або SUGGESTION
- Не блокує архівування, але виявляє проблеми

**Виміри перевірки:**

| Вимір | Що це перевіряє |
|-----------|-------------------|
| **Completeness** | Усі завдання виконано, усі вимоги реалізовані, сценарії покриті |
| **Correctness** | Реалізація відповідає задуму специфікації, оброблені крайні випадки |
| **Coherence** | Рішення дизайну відображені в коді, шаблони узгоджені |

**Приклад:**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**Поради:**
- Запускайте перед архівуванням, щоб рано виявити розбіжності
- Попередження не блокують архівування, але вказують на потенційні проблеми
- Добре підходить для перегляду роботи AI перед комітом
- Може виявити відхилення між артефактами та реалізацією

---

### `/opsx:sync`

**Необов'язкова команда.** Зливає специфікації змін (delta specs) у основні специфікації. Архівування запропонує синхронізацію, якщо це необхідно, тому зазвичай цю команду запускати вручну не потрібно.

**Синтаксис:**
```
/opsx:sync [change-name]
```

**Аргументи:**
| Аргумент | Обов'язково | Опис |
|----------|----------|-------------|
| `change-name` | Ні | Яку зміну потрібно синхронізувати (визначається з контексту, якщо не надано) |

**Що це робить:**
- Читає delta specs із папки зміни
- Парсить секції ADDED/MODIFIED/REMOVED/RENAMED
- Зливає зміни в основну директорію `openspec/specs/`
- Зберігає існуючий контент, не згаданий у delta
- Не архівує зміну (вона залишається активною)

**Приклад:**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**Коли використовувати вручну:**

| Сценарій | Використовувати sync? |
|----------|-----------|
| Тривала зміна, хочете мати специфікації в основі до архівування | Так |
| Кілька паралельних змін потребують оновлені базові специфікації | Так |
| Хочете окремо переглянути/прочитати злиття | Так |
| Швидка зміна, йдете прямо до архівування | Ні (архівування це обробляє) |

**Поради:**
- Sync розумний, а не копіювання-вставлення
- Може додавати сценарії до існуючих вимог без дублювання
- Зміна залишається активною після sync (не архівується)
- Більшості користувачів ніколи не потрібно буде викликати це напряму — архівування запропонує, якщо необхідно

---

### `/opsx:archive`

Архівує завершену зміну. Фіналізує зміну та переміщує її до папки архіву.

**Синтаксис:**
```
/opsx:archive [change-name]
```

**Аргументи:**
| Аргумент | Обов'язково | Опис |
|----------|----------|-------------|
| `change-name` | Ні | Яку зміну потрібно заархівувати (визначається з контексту, якщо не надано) |

**Що це робить:**
- Перевіряє статус завершення артефактів
- Перевіряє виконання завдань (попереджає, якщо незавершені)
- Пропонує синхронізувати delta specs, якщо це ще не зроблено
- Переміщує папку зміни до `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Зберігає всі артефакти для аудиту

**Приклад:**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**Поради:**
- Архівування не зупиниться через незавершені завдання, але попередить
- Delta specs можуть бути синхронізовані під час архівування або заздалегідь
- Заархівовані зміни зберігаються для історії
- Спочатку використовуйте `/opsx:verify`, щоб виявити проблеми

---

### `/opsx:bulk-archive`

Архівує кілька завершених змін одразу. Обробляє конфлікти специфікацій між змінами.

**Синтаксис:**
```
/opsx:bulk-archive [change-names...]
```

**Аргументи:**
| Аргумент | Обов'язково | Опис |
|----------|----------|-------------|
| `change-names` | Ні | Конкретні зміни для архівування (запитує вибір, якщо не надано) |

**Що це робить:**
- Перераховує всі завершені зміни
- Валідує кожну зміну перед архівуванням
- Виявляє конфлікти специфікацій між змінами
- Вирішує конфлікти, перевіряючи, що насправдійно реалізовано
- Архівує в хронологічному порядку

**Приклад:**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**Поради:**
- Добре підходить для паралельних робочих потоків
- Вирішення конфліктів є агентним (перевіряє кодову базу)
- Зміни архівуються у порядку створення
- Запитує перед перезаписом контенту специфікації

---

### `/opsx:onboard`

Кероване знайомство з повним робочим процесом OpenSpec. Інтерактивний туторіал, що використовує вашу реальну кодову базу.

**Синтаксис:**
```
/opsx:onboard
```

**Що це робить:**
- Проводить через повний цикл роботи з нарацією
- Сканує вашу кодову базу на предмет реальних можливостей для покращення
- Створює справжню зміну з реальними артефактами
- Виконує реальну роботу (малі, безпечні зміни)
- Архівує завершену зміну
- Пояснює кожен крок у міру його виконання

**Фази:**
1. Привітання та аналіз кодової бази
2. Знаходження можливості для покращення
3. Створення зміни (`/opsx:new`)
4. Написання proposal
5. Створення specs
6. Написання дизайну
7. Створення завдань
8. Реалізація завдань (`/opsx:apply`)
9. Перевірка реалізації
10. Архівування зміни
11. Підсумок та наступні кроки

**Приклад:**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**Поради:**
- Найкраще підходить для нових користувачів, які вивчають робочий процес
- Використовує реальний код, а не ігрові приклади
- Створює справжню зміну, яку можна зберегти або відкинути
- Триває 15–30 хвилин

## Синтаксис команд за допомогою AI-інструментів

Різні AI-інструменти використовують дещо відмінний синтаксис команд. Використовуйте формат, який відповідає вашому інструменту:

| Tool | Syntax Example |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Skill-based invocations such as `/skill:openspec-propose`, `/skill:openspec-apply-change` (no generated `opsx-*` command files) |
| Trae | Skill-based invocations such as `/openspec-propose`, `/openspec-apply-change` (no generated `opsx-*` command files) |

Намір однаковий для всіх інструментів, але спосіб відображення команд може відрізнятися залежно від інтеграції.

> **Примітка:** Команди GitHub Copilot (`.github/prompts/*.prompt.md`) доступні лише у розширеннях IDE (VS Code, JetBrains, Visual Studio). CLI GitHub Copilot наразі не підтримує користувацькі файли промптів — дивіться [Supported Tools](supported-tools.md) для деталей та обхідних шляхів.

---

## Старі (Legacy) команди

Ці команди використовують старий робочий процес «все одразу». Вони все ще працюють, але рекомендуються команди OPSX.

| Command | What it does |
|---------|--------------|
| `/openspec:proposal` | Create all artifacts at once (proposal, specs, design, tasks) |
| `/openspec:apply` | Implement the change |
| `/openspec:archive` | Archive the change |

**Коли використовувати старі команди:**
- Існуючі проєкти, які використовують старий робочий процес
- Прості зміни, де вам не потрібне інкрементальне створення артефактів
- Бажання підходу «все або нічого»

**Міграція на OPSX:**
Старі зміни можна продовжити за допомогою команд OPSX. Структура артефактів сумісна.

---

## Усунення несправностей (Troubleshooting)

### "Change not found"

Команда не змогла визначити, над якою зміною працювати.

**Рішення:**
- Вкажіть назву зміни явно: `/opsx:apply add-dark-mode`
- Перевірте, чи існує директорія зміни: `openspec list`
- Перевірте, чи ви знаходитесь у правильній директорії проєкту.

### "No artifacts ready"

Усі артефакти або завершені, або заблоковані відсутніми залежностями.

**Рішення:**
- Запустіть `openspec status --change <name>`, щоб побачити, що блокує процес
- Перевірте, чи існують необхідні артефакти
- Створіть відсутні артефакти залежностей спочатку

### "Schema not found"

Вказана схема не існує.

**Рішення:**
- Перелічіть доступні схеми: `openspec schemas`
- Перевірте написання назви схеми
- Створіть схему, якщо вона користувацька: `openspec schema init <name>`

### Commands not recognized

AI-інструмент не розпізнає команди OpenSpec.

**Рішення:**
- Переконайтеся, що OpenSpec ініціалізовано: `openspec init`
- Перегенеруйте навички: `openspec update`
- Перевірте, чи існує директорія `.claude/skills/` (для Claude Code)
- Перезапустіть свій AI-інструмент, щоб він завантажив нові навички

### Artifacts not generating properly

AI створює незавершені або некоректні артефакти.

**Рішення:**
- Додайте контекст проєкту у `openspec/config.yaml`
- Додайте правила для кожного артефакту для отримання специфічної допомоги
- Надайте більше деталей у описі зміни
- Використовуйте `/opsx:continue` замість `/opsx:ff` для більшого контролю

---

## Наступні кроки

- [Workflows](workflows.md) — Поширені шаблони та коли використовувати кожну команду
- [CLI](cli.md) — Команди терміналу для керування та валідації
- [Customization](customization.md) — Створення користувацьких схем та робочих процесів