# Stores: Планування у власному репозиторії

> **Бета-версія.** Сховища (Stores), посилання, робочий контекст та набори робіт (worksets) є новими. Назви команд, прапорці (flags), формати файлів та JSON-вихід можуть продовжувати змінювати свою структуру між релізами. Кожен огляд нижче був виконаний проти поточної збірки, але прочитайте цей гайд після оновлення.

## Проблема, яку це вирішує

OpenSpec зазвичай існує всередині одного кодорепозиторію: папки `openspec/` поруч із вашим кодом, що містить специфікації та зміни для цього репозиторію.

Це перестає бути прийнятним у той момент, коли ваше планування виходить за межі одного репозиторію:

- Ваша робота охоплює кілька репозиторіїв — одна функція торкається API-сервера, вебзастосунку та спільної бібліотеки. У якому `openspec/` знаходяться плани?
- Ваша команда планує ще до існування коду або планує речі, які ніколи не стануть кодом у *цьому* репозиторії.
- Вимоги належать одній команді, але споживаються іншими. Версія в вікі відхиляється, а ваш агент кодування це все одночасно прочитати не може.

**Сховище (store)** — це відповідь: незалежний репозиторій, завдання якого полягає лише у плануванні. Він має таку саму структуру `openspec/`, яку ви вже знаєте — специфікації та зміни — плюс невеликий ідентифікаційний файл. Ви реєструєте його на своїй машині один раз, за назвою, а потім будь-яка звичайна команда OpenSpec може працювати в ньому з будь-якого місця.

## Форма

```
            team-plans  (store: планування у власному репозиторії)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      що є правдою
                └── changes/    те, що в процесі змін
                      ▲
                      │ зареєстровані на кожній машині за назвою;
                      │ обмінюються шляхом push/clone, як будь-який репозиторій
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

Дві правила роблять це простим:

1. **Store — це просто git репозиторій.** Ви самі комітите, пушите, пуллю та рецензуєте його. OpenSpec ніколи не клонує, не синхронізує і нічого не пушить самостійно.
2. **Декларації, а не механізми.** Репозиторії можуть *декларувати*, як вони пов'язані зі stores (показано нижче). Ці декларації змінюють те, що може вам сказати OpenSpec — ніколи те, де діють ваші команди.

## П'ять хвилин до першого store

Дві команди переходять від нічого до робочої зміни з обсягом store:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Next: run normal OpenSpec commands against this store, for example:
  openspec new change <change-id> --store team-plans
Share this store by committing and pushing it like any Git repo.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Next: openspec status --change add-login --store team-plans
```

Ось вся модель. З цього моменту життєвий цикл — це саме те, що ви знаєте — `status`, `instructions`, `validate`, `archive` — з `--store team-plans` у кожній команді, і кожен надрукований підказка несе цей прапор. Рядок `Using OpenSpec root:` завжди повідомляє вам, де діє команда.

## Історія: одна команда, один репозиторій планування

Команда зберігає свої специфікації та зміни в `team-plans`, замість того, щоб розкидати їх по код-репозиторіях.

**День перший (хто це налаштовує):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Передача `--remote` записує URL клону всередині файлу ідентичності самого store (`.openspec-store/store.yaml`) у початковому коміті. Кожен майбутній клон народжується знаючи, звідки він прийшов, тому що перевірки стану та повідомлення про помилки можуть надрукувати повне, копійоване виправлення для колег, які ще цього не мають.

**Кожна член команди (один раз на машині):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

Відтоді всі працюють в одному репозиторії планування за назвою:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**Обмін роботою — це git, і навмисно.** Зміна, яку ви створюєте, існує лише у вашому чекауті, доки ви не комітите та не пушите її — так само як код. Плани отримують гілки, pull request та рецензування безкоштовно, тому що store є звичайним репозиторієм.

**Підключення код-репозиторіїв команди.** Код-репозиторій, чиє планування повністю екстерналізовано, потребує лише одного рядка у `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Тепер кожна команда OpenSpec, запущена всередині `web-app`, діє на `team-plans` без жодних прапорців:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

Вказівник є запасним варіантом, а не заміною: явний `--store` завжди перемагає, і якщо репозиторій росте, створюючи власні папки планування, то вони мають пріоритет (з попередженням про видалення застарілого вказівника).

## Історія: вимоги, що виходять за межі команд

Платформа-команда володіє вимогами. Продукт-команди будують на них, у своїх власних репозиторіях, зі своїми власними дизайнами. Референс описує цей зв'язок без переміщення роботи нікого.

```
   platform-reqs (store)                 api-server (code repo)
   володіє платформа-команда            володіє продукт-команда
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ читає    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (власні дизайни)        │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (власна робота)       │
   │                          │          │ └──────────────────────────┘
   └──────────────────────────┘
```

**Продукт-команда декларує, на що вона спирається** у `openspec/config.yaml` свого репозиторію:

```yaml
references:
  - platform-reqs
```

Референси — це контекст для читання. Репозиторій зберігає свій власний корінь `openspec`; робота залишається там. Що змінюється: `openspec instructions` у цьому репозиторії тепер включає індекс специфікацій з посиланняного store — кожна з одним-рядковим резюме та точною командою для отримання (`openspec show <spec-id> --type spec --store platform-reqs`). Агент, що працює в `api-server`, може знайти верхні вимоги до платежів, посилатися на них і писати свій низькорівневий дизайн у власному корені репозиторію — без того, щоб хтось копіював контекст навколо.

Референс може нести джерело клонування, тому колеги, які ще не мають store, отримують повне виправлення замість глухого кута:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Коли ви хочете мати план і код разом, створіть workset.** Це особисте та явне: кожна людина обирає папки, над якими вона насправді працює на своїй машині. Ніщо про ці локальні шляхи чекауту не комітиться у спільний репозиторій планування.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Два питання, які ви завжди можете поставити

**"Чи мій налаштування здорове?"** — `openspec doctor` перевіряє поточний корінь та його посиланняні stores, лише для читання, з можливістю скопіювати виправлення для кожного знайденого недоліку:

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Посиланняний store 'design-system' не зареєстрований на цій машині.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"З чим я працюю?"** — `openspec context` збирає робочий set із декларацій OpenSpec: корінь та stores, на які він посилається.

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

Обидва підтримують `--json` для агентів. `openspec context --code-workspace <path>` додатково створює файл робочого простору VS Code, що містить весь set — це єдине, що робить ця команда.

## Worksets: знову відкрийте папки, над якими ви працюєте разом

Окремо від усього вищезгаданого: більшість людей відкривають ті самі кілька папок за сесію — планувальний репозиторій плюс два або три код-репозиторії. **Workset** — це особистий, названий погляд на саме це, який знову відкривається однією командою у вашому інструменті вибору.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       усі три відкриті у вашому інструменті
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --member ~/src/web-app
openspec workset list
```

```
platform  (відкрито у VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` потім запускає збережений інструмент: редактори (VS Code, Cursor) відкривають одне вікно з кожним членом і повертаються. Перший член є основним. Ви можете будь-коли перевизначити інструмент за допомогою `--tool <id>`.

Worksets навмисно *не* є спільною станом. Вони існують на вашій машині, ніколи не комітяться та нічого не стверджують про роботу — вони лише записують те, що вам подобається відкривати разом. Видалення одного ніколи не торкається папок членів. Нові інструменти — це конфігурація, а не код: будь-що, запущене через файл робочого простору або прапорці прикріплення до папки, може бути додано під ключем `openers` у глобальну конфігурацію (`openspec config edit`).

## Як команди вирішують, де діяти

Кожна звичайна команда розв'язує свій корінь так само, у такому порядку:

```
1. --store <id>          ви це явно сказали        → той store
2. nearest openspec/     справжній корінь планування тут → цей репозиторій
   (проходячи вгору від cwd)
3. store: pointer        config.yaml декларує store  → той store
4. жодне з вищезгаданого    stores зареєстровані на цій машині?     → помилка зі збігом вибрання
                         немає stores?         → поточна директорія
                                                          (класикова поведінка)
```

Рядок `Using OpenSpec root:` (та блок `root` у виводі `--json`) повідомляє вам, в якому випадку ви перебуваєте.

## Відомі обмеження

- **Beta shape.** Усе на цій сторінці може змінитися між релізами — назви, прапорці, формати файлів, ключі JSON.
- **Один чекаут на ID store на машині.** Реєстрація другого чекауту під тим самим ID завершується невдачею з підказкою спочатку виконати `store unregister`.
- **Ніколи не синхронізація — за задумом.** OpenSpec ніколи не клонує, не пулляє і не пушить. Застарілий чекаут показує застарілі специфікації, доки *ви* не зробите pull; посилання індексуються в реальному часі з того, що є на диску.
- **Деякі команди залишаються там, де вони є.** `view`, `templates`, `schemas` та вичеркані іменникові форми (`openspec change show`, ...) діють лише над поточною директорією — без `--store`.
- **Стан на машині належить цій машині.** Реєстр stores та worksets є локальними налаштуваннями. Ніщо про макет планування вашої машини ніколи не комітиться у спільний репозиторій.
- **Два стилі запуску для worksets.** Інструмент, який не може бути запущений з файлом робочого простору або прапорцями прикріплення до папки, не може бути додано як opener.
- **Agent JSON має відомий поділ кейсів** (ключі store-family — snake_case, workflow-family camelCase). Описано в [agent contract](../agent-contract.md); уніфікація відкладена на версійно-контрольований реліз.

## Де все зберігається

| Що | Де | Спільне? |
|---|---|---|
| Планування store | `<store>/openspec/` (specs, changes) | Так — комітіть і пуште його |
| Ідентичність store | `<store>/.openspec-store/store.yaml` | Так — комітиться разом зі store |
| Реєстр stores | `<data dir>/openspec/stores/registry.yaml` | Ні — це лише на цій машині |
| Worksets | `<data dir>/openspec/worksets/` | Ні — це лише на цій машині |

`<data dir>` це `~/.local/share/openspec` на macOS та Linux (або `$XDG_DATA_HOME/openspec`, коли встановлено), і `%LOCALAPPDATA%\openspec` на Windows.
## Посилання

Точні прапорці та JSON-форми для кожної команди на цій сторінці:
[CLI reference](../cli.md) (Stores, Doctor, Working context, Personal worksets) та [agent contract](../agent-contract.md).