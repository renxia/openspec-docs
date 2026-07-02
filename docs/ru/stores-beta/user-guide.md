# Хранилища: Планирование в отдельном репозитории

> **Бета.** Хранилища (Stores), ссылки (references), рабочий контекст (working context) и рабочие наборы (worksets) — новые сущности. Названия команд, флаги, форматы файлов и JSON-вывод могут быть изменены между релизами. Каждый пример ниже был запущен против текущей сборки, но перечитайте это руководство после обновления.

## Проблема, которую это решает

OpenSpec обычно находится внутри одного репозитория кода: папки `openspec/`, расположенной рядом с вашим кодом и содержащей спецификации и изменения для этого репо.

Это перестает работать, когда ваше планирование выходит за рамки одного репозитория:

- Ваша работа охватывает несколько репо — одна функция затрагивает API-сервер, веб-приложение и общую библиотеку. В чьей папке `openspec/` находится план?
- Ваша команда планирует до того, как код существует, или планирует вещи, которые никогда не станут кодом в *этом* репозитории.
- Требования принадлежат одной команде и потребляются другими. Версия в вики-странице устаревает, а ваш агент кодирования все равно не может ее прочитать.

**Хранилище (store)** — это ответ: автономный репозиторий, чья единственная задача — планирование. Он имеет ту же структуру `openspec/`, которую вы уже знаете — спецификации и изменения — плюс небольшой файл идентификации. Вы регистрируете его на своей машине один раз, по имени, а затем любая обычная команда OpenSpec может работать в нем из любой точки.

## Форма

```
            team-plans  (хранилище: планирование в собственном репозитории)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      what is true
                └── changes/    what is in motion
                      ▲
                      │ registered on each machine by name;
                      │ shared by pushing/cloning like any repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

Два правила делают это простым:

1. **Хранилище — это просто git-репозиторий.** Вы сами коммитите, пушите, пуллите и рецензируете его. OpenSpec сам ничего не клонирует, синхронизирует или не пушит.
2. **Декларации, а не механизмы.** Репозитории могут *декларировать*, как они связаны с хранилищами (показано ниже). Декларации меняют то, что OpenSpec может вам сказать — никогда то, как действуют ваши команды.

## Пять минут до вашего первого хранилища

Две команды приведут вас от ничего к работающему изменению, ограниченному хранилищем:

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

Это вся модель. Отсюда жизненный цикл — это именно то, что вы знаете — `status`, `instructions`, `validate`, `archive` — с `--store team-plans` в каждой команде, и каждый напечатанный намек несет флаг для вас. Строка `Using OpenSpec root:` всегда говорит вам, где действует команда.

## История: одна команда, одно хранилище планирования

Команда хранит свои спецификации и изменения в `team-plans`, вместо того чтобы разбрасывать их по различным код-репозиториям.

**День первый (кто бы его ни настроил):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Передача `--remote` записывает URL клонирования внутрь файла идентичности самого хранилища (`.openspec-store/store.yaml`) при первоначальном коммите. Каждый последующий клон рождается зная, откуда он взялся, поэтому проверки работоспособности и сообщения об ошибках могут вывести полное, копируемое исправление для коллег, у которых его еще нет.

**Каждый член команды (один раз на машине):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

С этого момента все работают в одном и том же хранилище планирования по имени:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**Совместное использование работы — это git, и это намеренно.** Изменение, которое вы создаете, существует только в вашем чекауте, пока вы его не коммитете и не пушите — то же самое, что и код. Планы получают ветки, pull request и рецензирование бесплатно, потому что хранилище — обычный репозиторий.

**Подключение код-репозиториев команды.** Код-репозиторий, чье планирование полностью вынесено наружу, нуждается ровно в одной строке в `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Теперь каждая команда OpenSpec, запущенная внутри `web-app`, действует на `team-plans` без каких-либо флагов:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

Указатель — это запасной вариант, а не замена: явный `--store` всегда побеждает, и если репозиторий появляются свои собственные папки планирования, они побеждают (с предупреждением об удалении устаревшего указателя).

## История: требования, пересекающие границы команд

Платформальная команда владеет требованиями. Продуктовые команды строят на них, в своих собственных репозиториях, со своими собственными дизайнами. Ссылка описывает эту взаимосвязь, не перемещая работу никого.

```
   platform-reqs (хранилище)                 api-server (код-репозиторий)
   owned by the platform team            owned by a product team
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ reads    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (their own designs)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (their own work)       │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**Продуктовая команда декларирует, на что она опирается** в `openspec/config.yaml` своего репозитория:

```yaml
references:
  - platform-reqs
```

Ссылки — это контекст только для чтения. Репозиторий сохраняет свой собственный корень `openspec`; работа остается там. Что меняется: `openspec instructions` в этом репозитории теперь включает индекс спецификаций ссылаемого хранилища — каждая с однострочным резюме и точной командой получения (`openspec show <spec-id> --type spec --store platform-reqs`). Агент, работающий в `api-server`, может найти исходные требования к платежам, сослаться на них и написать свой низкоуровневый дизайн в собственном корне репозитория — без того чтобы кто-либо копировал контекст.

Ссылка может нести источник клонирования, поэтому члены команды, у которых еще нет хранилища, получают полное исправление вместо тупика:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Когда вы хотите план и код вместе, создайте workset.** Это личное и явное: каждый человек выбирает папки, над которыми он на самом деле работает на своей машине. Ничто об этих локальных путях чекаута не коммитится в общее хранилище планирования.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Два вопроса, которые вы всегда можете задать

**"Моя настройка работоспособна?"** — `openspec doctor` проверяет текущий корень и его ссылаемые хранилища в режиме только для чтения, с копируемым исправлением для каждой находки:

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Referenced store 'design-system' is not registered on this machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"С чем я работаю?"** — `openspec context` собирает набор рабочих задач из деклараций OpenSpec: корень и ссылаемые хранилища.

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

Оба поддерживают `--json` для агентов. `openspec context --code-workspace <path>` дополнительно записывает файл рабочего пространства VS Code, содержащий весь набор — это единственное, что делает эта команда.

## Worksets: снова открыть папки, над которыми вы работаете вместе

Отдельно от всего вышеперечисленного: большинство людей открывают одни и те же несколько папок за одну сессию — хранилище планирования плюс две или три код-репозитория. **Workset** — это личный, именованный взгляд на это, который снова открывается одной командой в вашем инструменте выбора.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       all three open in your tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --member ~/src/web-app
openspec workset list
```

```
platform  (opens in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` затем запускает сохраненный инструмент: редакторы (VS Code, Cursor) открывают одно окно со всеми членами и возвращаются. Первый член является основным. Вы можете в любое время переопределить инструмент с помощью `--tool <id>`.

Worksets намеренно *не* являются общим состоянием. Они существуют на вашей машине, никогда не коммитятся и ничем не заявляют о работе — они просто записывают, что вам нравится открывать вместе. Удаление одного члена никогда не затрагивает папки членов. Новые инструменты — это конфигурация, а не код: все, что запускается через файл рабочего пространства или флаги прикрепления к папке, может быть добавлено под ключом `openers` в глобальную конфигурацию (`openspec config edit`).

## Как команды решают, где действовать

Каждая обычная команда разрешает свой корень в следующем порядке:

```
1. --store <id>          вы указали это явно        → то хранилище
2. nearest openspec/     реальный корень планирования здесь     → этот репозиторий
   (проходя вверх от cwd)
3. store: pointer        config.yaml декларирует хранилище  → то хранилище
4. ни одно из вышеперечисленного     хранилища зарегистрированы на этой     → ошибка с подсказкой
                         машине?                        выбора
                         нет зарегистрированных хранилищ?         → текущая
                                                          директория
                                                          (классическое поведение)
```

Строка `Using OpenSpec root:` (и блок `root` в выводе `--json`) говорит вам, в каком случае вы находитесь.

## Известные ограничения

- **Beta shape.** Все на этой странице может измениться между релизами — имена, флаги, форматы файлов, ключи JSON.
- **Один чекаут на ID хранилища на машине.** Регистрация второго чекаута под тем же ID завершается неудачей с подсказкой сначала выполнить `store unregister`.
- **Никакой синхронизации, никогда — по замыслу.** OpenSpec никогда не клонирует, не пуллит и не пушит. Устаревший чекаут показывает устаревшие спецификации, пока *вы* не сделаете pull; ссылки индексируются в реальном времени из того, что есть на диске.
- **Некоторые команды остаются как были.** `view`, `templates`, `schemas` и устаревшие именные формы (`openspec change show`, ...) действуют только над текущей директорией — без `--store`.
- **Состояние на машине личное.** Реестр хранилищ и worksets являются локальными настройками. Ничто о макете вашей машины никогда не коммитится в общее планирование.
- **Два стиля запуска для worksets.** Инструмент, который нельзя запустить с помощью файла рабочего пространства или флагов прикрепления к папке, не может быть добавлен как opener.
- **JSON агента имеет известное разделение регистра** (ключи семейства store — snake_case, ключи семейства workflow — camelCase). Описано в [agent contract](../agent-contract.md); унификация отложена до версионированного релиза.

## Где что находится

| Что | Где | Общее? |
|---|---|---|
| Планирование хранилища | `<store>/openspec/` (specs, changes) | Да — коммитите и пушите его |
| Идентичность хранилища | `<store>/.openspec-store/store.yaml` | Да — коммитится вместе с хранилищем |
| Реестр хранилищ | `<data dir>/openspec/stores/registry.yaml` | Нет — это только на этой машине |
| Worksets | `<data dir>/openspec/worksets/` | Нет — это только на этой машине |

`<data dir>` — это `~/.local/share/openspec` на macOS и Linux (или `$XDG_DATA_HOME/openspec`, если он установлен) и `%LOCALAPPDATA%\openspec` на Windows.
## Ссылки

Точные флаги и JSON-формы для каждой команды на этой странице:
[CLI reference](../cli.md) (Stores, Doctor, Working context, Personal worksets) и [agent contract](../agent-contract.md).