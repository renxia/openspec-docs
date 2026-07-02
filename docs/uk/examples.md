# Приклади та рецепти

Реальні зміни від початку до кінця. Кожен рецепт демонструє команди, які ви вводите, і те, що ви бачите у відповідь, щоб ви могли зіставити свою ситуацію з шаблоном і скопіювати його. Ці приклади використовують стандартні команди **core** (`propose`, `explore`, `apply`, `sync`, `archive`); якщо потрібен розширений набір команд, це зазначено.

Нагадування перед початком: слеш-команди (slash commands) типу `/opsx:propose` вводяться у **чаті AI assistant**, а команди `openspec` — у вашому **терміналі**. Якщо ви з цим не знайомі, спочатку прочитайте [Як працюють команди](how-commands-work.md). У транскриптах нижче `You:` та `AI:` — це чат, а рядки, що починаються з `$`, — термінал.

> **Не впевнені, що саме ви створюєте?** Більшість цих рецептів є більш чіткими, якщо спочатку використати `/opsx:explore`, щоб продумати це. [Recipe 3](#recipe-3-exploring-before-you-commit) демонструє це на практиці, а гайд [Explore First](explore.md) надає повне обґрунтування.

## Recipe 1: Невежа функція, швидкий шлях

**Коли використовувати:** ви знаєте, чого хочете, і це обмежена робота. Це найпоширеніший рецепт.

Уся справа складається з трьох команд. Propose (пропозиція), build (створення), archive (архівування).

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — чому та що
     ✓ specs/      — нова вимога та її сценарії
     ✓ design.md   — технічний підхід
     ✓ tasks.md    — контрольний список реалізації
     Ready for implementation. Run /opsx:apply.
```

Тепер прочитайте план. Відкрийте пропозицію та delta spec. Це момент, для якого створено OpenSpec: виявити хибне припущення, поки воно ще один абзац, а не 400 рядків коду. Редагуйте будь-який артефакт напряму, якщо щось не так, а потім продовжуйте.

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Add logout button to header
     ✓ 1.2 Clear session on click
     ✓ 1.3 Add confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  Archiving add-logout-button...
     ✓ Merged specs into openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2026-06-22-add-logout-button/
     Done. Ready for the next change.
```

Ось і все. Поведінка виходу з системи тепер є частиною ваших специфікацій, а зміна зафіксована з повним контекстом.

## Recipe 2: Виправлення помилки (bug fix)

**Коли використовувати:** щось зламано, і ви хочете, щоб це виправлення було записане як навмисна зміна поведінки, а не таємний коміт.

Виправлення помилок працюють точно так само, як і функції. Різниця полягає в тому, як ви формулюєте пропозицію: опишіть *правильну* поведінку, а не просто "виправте помилку".

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

Оскільки виправлення фіксується як `MODIFIED` (змінена) вимога з новим сценарієм, наступна людина (або наступна сесія AI) бачить не просто те, що ви це виправили, а й те, що означає "правильно". Потім `/opsx:apply` та `/opsx:archive`, як зазвичай.

Порада: для виправлення гарний сценарій — це регресійний тест у прозі. "GIVEN користувач вийшов з системи, WHEN він надсилає дійсні облікові дані, THEN він потрапляє на панель керування і більше не перенаправляється." Напишіть це, і реалізація матиме чітку ціль.

## Recipe 3: Дослідження перед комітом (Exploring before you commit)

**Коли використовувати:** у вас є проблема, але ще немає плану. Ви не впевнені, що створювати, або який підхід правильний.

Почніть з `/opsx:explore`. Це партнер для мислення без структури та без створення артефактів. Він читає ваш код і допомагає вам прийняти рішення.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Page loads feel slow but I don't know where the time goes.

AI:  Let me look... I found three likely culprits:
     1. Large unoptimized images on the product list
     2. Synchronous data fetching that blocks render
     3. Re-renders triggered by context changes
     Which should we tackle first?

You: The data fetching one.

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation.
```

Дослідження прояснює ваше мислення *до того*, як ви витратите на це зміну. Коли інсайт кристалізується, робіть Propose, і AI продовжує контекст.

## Recipe 4: Балансування двох змін одночасно (Juggling two changes at once)

**Коли використовувати:** ви перебуваєте посередині функції, а термінове виправлення вириває вас із черги.

Зміни є незалежними папками, тому паралельна робота не конфліктує. Почніть з виправлення, випустіть його, а потім поверніться до функціональності там, де зупинилися.

```text
You: I'm partway through add-dark-mode, but I need to fix a login bug now.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Ready for implementation.

You: /opsx:apply

AI:  Implemented the fix. All tasks complete.

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect.

You: Back to dark mode.

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode. Picking up at task 2.3: Update Header...
```

Назви зміну в `/opsx:apply add-dark-mode` — це спосіб вказати AI на конкретну зміну, коли активних є більше однієї. Оскільки завдання відстежують завершення у `tasks.md`, AI знає, де саме ви зупинилися.

Коли кілька змін виконуються одночасно, розширений `/opsx:bulk-archive` об'єднує їх та вирішує конфлікти специфікацій, перевіряючи, що насправді було реалізовано. Дивіться [Workflows](workflows.md#parallel-changes).

## Recipe 5: Рефакторинг без зміни поведінки (A refactor with no behavior change)

**Коли використовувати:** ви реструктуруєте код, і зовнішня видима поведінка має залишитися ідентичною.

Це цікавий випадок, тому що чистий рефакторинг *не має нічого додати у ваші специфікації*. Контракт поведінки не змінюється; змінюється лише реалізація. Тому робота знаходиться в дизайні та завданнях, а delta spec порожня або відсутня.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

Коли ви архівуєте зміну, яка не торкається специфікацій, ви можете повідомити термінальну команду пропустити етап специфікації:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

Цей самий прапорцець корисний для інструментів, CI та змін, які стосуються лише документації. Принцип: специфікації описують поведінку, тому якщо поведінка не змінилася, специфікація також не повинна змінюватися. Дивіться [Concepts](concepts.md#what-a-spec-is-and-is-not).

## Recipe 6: Покроковий контроль (розширені команди)

**Коли використовувати:** складна або ризикована зміна, де ви хочете переглянути кожен артефакт перед тим, як рухатися далі.

Основний `/opsx:propose` генерує все одразу. Коли ви віддаєте перевагу виконувати покроково, увімкніть розширені команди:

```bash
$ openspec config profile      # обираємо розширені робочі процеси
$ openspec update              # застосовуємо їх до цього проєкту
```

Тепер ви можете послідовно створювати та будувати:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

Переглядайте кожен артефакт, як він з'являється, редагуйте вільно та продовжуйте, коли будете задоволені. Коли ви хочете, щоб решта була створена одразу, `/opsx:ff` виконує швидке просування через решту планових артефактів. Перед архівуванням `/opsx:verify` перевіряє, чи реалізація справді відповідає специфікаціям. Дивіться [Workflows](workflows.md#opsxff-vs-opsxcontinue).

## Recipe 7: Навчання всього циклу на практиці

**Коли використовувати:** ви встановили OpenSpec і хочете *відчути* робочий процес на власному коді, а не на ігровому прикладі.

Увімкніть розширені команди (див. Recipe 6), а потім:

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` знаходить реальне (невелике) покращення, створює для нього зміну, реалізує її та архівує, розповідаючи кожен крок. Це займає 15–30 хвилин і залишає вам справжню зміну, яку ви можете зберегти або відкинути. Це найм'якший спосіб навчання. Дивіться [Commands](commands.md#opsxonboard).

## Перевірка вашої роботи з терміналу

Будь-коли ви можете переглянути стан речей у своєму терміналі:

```bash
$ openspec list                      # активні зміни
$ openspec show add-dark-mode        # одна зміна детально
$ openspec validate add-dark-mode    # перевірка структури
$ openspec view                      # інтерактивна панель керування
```

Це інструменти для читання та перегляду. Пропозиція та створення все ще відбуваються за допомогою слеш-команд у чаті. Повні деталі в [CLI reference](cli.md).

## Куди рухатися далі

- [Explore First](explore.md): рекомендований спосіб початку, якщо ви не впевнені
- [Workflows](workflows.md): шаблони наведені вище, з порадами щодо прийняття рішень про те, коли який використовувати
- [Commands](commands.md): кожна слеш-команда детально
- [Getting Started](getting-started.md): канонічний покроковий огляд першої зміни
- [Concepts](concepts.md): чому всі частини з'єднані саме так