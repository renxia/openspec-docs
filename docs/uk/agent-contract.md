# Контракт агента OpenSpec

Машиночитані інтерфейси CLI `openspec`, звірені з `src/` (підсумковий аудит, 2026-06-11). Кожна структура нижче задокументована на основі коду, що генерує її.

## 1. Загальні угоди

- **Один JSON-документ на виклик.** У режимі `--json` stdout містить рівно один JSON-документ (форматований з відступами в 2 пробіли). Звичайний текст, спінери та банер сховища виводяться у stderr.
- **Банер сховища.** У звичайному режимі вибраний корінь сховища виводить `Using OpenSpec root: <id> (<path>)` у stderr. Ніколи не виводиться у режимі JSON.
- **Регістр ключів залежить від інтерфейсу** (див. Відомі невідповідності): дані store/doctor/context використовують `snake_case`; дані робочих процесів (`status`, `instructions`, `new change`, `validate`, `list`) використовують `camelCase`, за винятком вбудованого об'єкта `root`, який завжди використовує `store_id`.
- **Необов'язкові ключі пропускаються, а не є null**, у більшості даних (наприклад, `root.store_id`, `member.path`). Винятки, які використовують явний `null`, вказуються для кожної структури (store doctor `git.*`, дані про помилки).

## 2. Діагностичний конверт

Одна форма конверта є спільною для кожної машиночитаної діагностики (`StoreDiagnostic`):

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Діагностики з'являються в двох позиціях: **масиви статусу** (`status: StoreDiagnostic[]` на верхньому рівні або для кожного запису) для результатів перевірки здоров'я, та **викинуті помилки**, перетворені на одноелементний масив `status` при збої команди.

## 3. Вибір кореня та `RootOutput`

Усі команди визначення кореня (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) визначають один корінь OpenSpec з одним пріоритетом:

1. `--store <id>` → корінь зареєстрованого сховища (`source: "store"`).
2. Інакше — найближчий предок з `openspec/`: форма планування → `source: "nearest"` (вказівник `store:` ігнорується зі стерндовим попередженням); каталог лише з конфігурацією з дійсним вказівником `store:` → це сховище, `source: "declared"`.
3. Немає найближчого кореня + встановлено глобальний `defaultStore` (`openspec config set defaultStore <id>`) → це сховище, `source: "global_default"`; застарілий id завершується помилкою базового сховища та `fix` з назвою `openspec config unset defaultStore`.
4. Немає найближчого кореня, немає стандартного + є зареєстровані сховища → помилка `no_root_with_registered_stores`.
5. Немає кореня, немає стандартного, немає сховищ: команди створення каркаса обробляють cwd як `source: "implicit"`; діагностичні команди (`doctor`, `context`) завершуються помилкою `no_openspec_root` — вони іспектують, ніколи не створюють каркас.

Успішні JSON-корисні навантаження містять корінь:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Контракт збою кореня**: у JSON-режимі збій визначення друкує `{ ...commandNullShape, "status": [diagnostic] }` на stdout і завершує роботу з кодом 1.

## 4. Форми JSON команд

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — зверніть увагу, що `status` для кожної зміни тут є рядковим переліком. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Change: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spec: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Завершує з кодом 1, коли будь-який елемент не проходить перевірку.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`. `requires` кожного артефакту — це його прямі ідентифікатори залежностей (присутні для кожного статусу, тому транзитивна множина необхідних обчислювана навіть коли артефакт у статусі `done`); `missingDeps` з'являється лише при `blocked`. `"skipped"` позначає артефакт, чий шлях `generates` знаходиться під `specs/` у зміні, чий `.openspec.yaml` оголошує `skip_specs: true`; він задовольняє залежності, але не повинен створюватися. Немає активних змін: `{ "changes": [], "message", "root" }`, завершує з кодом 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`. `"skipped": true` (разом із `"warning"`) з'являється, коли зміна оголошує `skip_specs: true` і цей артефакт пропущено — не створюйте його файли. Запис залежності з `skipped: true` вважається задоволеним без файлів — не намагайтеся читати його шляхи.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — визначені записи несуть root/specs/fetch; невизначені несуть store_id + статус попередження. Індекс обмежений 50КБ (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Успіх: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Збій: `{ "change": null, "status": [d] }`, завершує з кодом 1.

### 4.8 `archive <name> --json`
Успіх: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Збій: `{ "archive": null, "root"?, "status": [d] }`, завершує з кодом 1. JSON-режим суворо неінтерактивний: кожна точка запиту стає кодом `archive_*`.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`. `drift` (присутній лише для клонованого сховища git, що має відстежувальне посилання upstream) — це лічильники ahead/behind відносно останнього отриманого upstream, а не живого віддаленого сховища. Результати перевірки здоров'я будь-якого рівня серйозності завершують роботу з кодом 0. Корисне навантаження збою: `{ "root": null, "store": null, "references": [], "status": [d] }`, завершує з кодом 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. ДОСТУПНИЙ = шлях присутній І статус порожній. `--code-workspace <path>` записує `{folders:[{name,path}]}` (лише доступні призначені сховища, префікси `ref:`); у JSON-режимі запис виконується перед друком, тому stdout містить рівно один документ навіть при збої запису. Збій: `{ "root": null, "members": [], "status": [d] }`, завершує з кодом 1.

### 4.11 `store ... --json`
setup/register: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. unregister/remove: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. list: `{ "stores": [{id, root}], "status": [] }`. doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = невідомий/не досліджувався). Результати перевірки здоров'я завершують з кодом 0; збої завершують з кодом 1 із відповідною нульовою формою. Скасування запиту завершує з кодом 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: голий масив `[ {name, description, artifacts, source} ]`. `templates`: об'єкт з ключами `{ "<artifactId>": {path, source} }`. Обидва на основі cwd, без ключів root/status.

## 5. Контракт кодів завершення

| Ситуація | Код завершення | Stdout |
|---|---|---|
| Успіх, включно з результатами перевірки здоров'я (doctor/context/store doctor) | 0 | корисне навантаження |
| Збій команди у режимі `--json` | 1 | один JSON-документ із `status: [d]` та нульовою формою команди |
| `validate` із елементами, що не пройшли перевірку | 1 | повний звіт |
| Скасування запиту (група `store`, людський режим) | 130 | лише stderr |

## 6. Каталог діагностичних кодів

### Визначення
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; пропуск: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Здоров'я кореня OpenSpec (помилка, без виправлення)
`openspec_store_root_missing`, `openspec_store_root_not_directory`, `openspec_root_missing`, `openspec_root_not_directory`, `openspec_config_missing`, `openspec_config_not_file`, `openspec_specs_not_directory`, `openspec_changes_not_directory`, `openspec_archive_not_directory`. Під час бета-тестування сховищ, `openspec/specs/`, `openspec/changes/`, та `openspec/changes/archive/` можуть бути відсутніми у здоровому корені; вони є помилками здоров'я лише коли присутні, але не є каталогами.

### Реєстр/ідентичність/стан сховища
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Налаштування/реєстрація/видалення сховища
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_root_pointer_declared`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (попередження при видаленні, помилка при doctor), `store_root_not_directory`.

### Git сховища
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (попередження), `store_clone_fragile_directories` (попередження), `store_remote_divergence` (info, doctor), `store_checkout_drift` (info, doctor).

### Посилання (попередження)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Зв'язки (попередження; doctor; context зберігає лише реєстровий)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Архів (JSON-режим)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Записи контексту
`context_file_exists`, `context_output_dir_missing`.

### Значення за замовчуванням
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Відомі невідповідності

Зафіксовано аудитом підсумкового етапу; перейменування опублікованих ключів — рішення продукту, відкладені за межі цього випуску:

1. ~~У режимі `--json` кілька шляхів збою друкували лише stderr без JSON-документа.~~ Виправлено в раунді підсумкового випробування: `show`/`validate` для невідомих та неоднозначних елементів видають `{status:[{code: unknown_item | ambiguous_item, ...}]}`; викинуті помилки в `status`/`instructions`/`list`/`show`/`validate` маршрутизуються через помічник збою, що розуміє JSON (нульова форма команди + `status`); `store <unknown subcommand> --json` видає `{status:[{code: unknown_store_subcommand}]}`; `list` несе свою нульову форму `{changes|specs: [], root: null}` при збоях визначення.
2. `store_root_missing` видається з двома рівнями серйозності (попередження при видаленні, помилка при store doctor) — залежить від контексту, задокументовано вище.
3. snake_case (сімейство store) vs camelCase (сімейство workflow); `root.store_id` є snake_case скрізь.
4. Чотири паралельні оголошення типу конверта існують у src; діагностика архіву ніколи не несе `target`.
5. `list --json` повторно використовує ключ `status` як рядковий перелік для кожної зміни.
6. Лише вивід `validate` несе поле `version`.
7. `schemas`/`templates` ігнорують вибір кореня (на основі cwd, без `--store`).
8. Застарілі форми іменників (`change`/`spec` підкоманди) видають неконвертовані корисні навантаження без `root`/`status`.