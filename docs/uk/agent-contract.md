# Контракт Агента OpenSpec

Машинозчитувані поверхні `openspec` CLI, перевірені проти `src/` (аудит Capstone, 2026-06-11). Кожна форма нижче описана на основі емітуючого коду.

## 1. Загальні конвенції

- **Один JSON-документ за виклик.** У режимі `--json` stdout містить рівно один JSON-документ (форматований з відступами по 2 пробіли). Людські описи, спінери та банер сховища направляються до stderr.
- **Банер сховища.** У людському режимі кореневий елемент, обраний сховищем, виводить у stderr: `Using OpenSpec root: <id> (<path>)`. Ніколи не виводиться в JSON-режимі.
- **Регістр ключів залежить від поверхні** (див. Відомі невідповідності): завантаження для store/doctor/context використовують `snake_case`; завантаження робочого процесу (workflow payloads) (`status`, `instructions`, `new change`, `validate`, `list`) використовують `camelCase`, окрім вбудованого об'єкта `root`, який завжди використовує `store_id`.
- **Необов'язкові ключі відсутні, а не нульові** у більшості завантажень (наприклад, `root.store_id`, `member.path`). Винятки, які використовують явний `null`, зазначені для кожної форми (doctor сховища `git.*`, завантаження з помил).

## 2. Діагностична обгортка (Diagnostic envelope)

Одна форма обгортки використовується всіма машинозчитуваними діагнозами (`StoreDiagnostic`):

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Діагнози з'являються у двох місцях: **масиви статусу** (`status: StoreDiagnostic[]` на верхньому рівні або для кожного елемента) для виявлених проблем, та **викинуті помилки**, які конвертуються в масив `status` з одним елементом при невдачі команди.

## 3. Вибір кореня та `RootOutput`

Усі команди, що вирішують корінь (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`), знаходять один корінь OpenSpec з одним порядком пріоритетності:

1. `--store <id>` → корінь зареєстрованого сховища (`source: "store"`).
2. В іншому випадку — найближчий предок з `openspec/`: форма планування (planning shape) → `source: "nearest"` (посилання на `store:` ігнорується зі сповіщенням до stderr); директорія, що містить лише конфігурацію та має дійсне посилання `store:` → те сховище, `source: "declared"`.
3. Немає найближчого кореня + зареєстровані сховища існують → помилка `no_root_with_registered_stores`.
4. Немає кореня, немає сховищ: команди скаффолдингу (scaffolding) розглядають cwd як `source: "implicit"`; діагностичні команди (`doctor`, `context`) завершуються з помилкою `no_openspec_root` — вони інспектують, а не створюють.

Успішні JSON-завантаження містять корінь:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Контракт відмови кореня**: у JSON-режимі збій вирішення виводить `{ ...commandNullShape, "status": [diagnostic] }` у stdout і завершується кодом 1.

## 4. JSON-форми команд

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — зверніть увагу, що `status` для кожної зміни є рядковим перерахуванням (string enum). `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Зміна: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spec: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Завершує кодом 1, якщо будь-який елемент не проходить перевірку.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"ready"|"blocked", missingDeps?} ], "root" }`. Немає активних змін: `{ "changes": [], "message", "root" }`, завершує кодом 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "template", "dependencies": [{id,done,path,description}], "unlocks", "root" }`.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — вирішені записи містять root/specs/fetch; невирішені містять store_id + статус попередження. Індекс обмежений 50KB (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Успіх: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Невдача: `{ "change": null, "status": [d] }`, завершує кодом 1.

### 4.8 `archive <name> --json`
Успіх: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Невдача: `{ "archive": null, "root"?, "status": [d] }`, завершує кодом 1. JSON-режим суворо неінтерактивний: кожна точка запиту стає кодом `archive_*`.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "status": [] } | null, "references": [...], "status": [] }`. Виявлені проблеми будь-якої серйозності завершують кодом 0. Завантаження з помилкою: `{ "root": null, "store": null, "references": [], "status": [d] }`, завершує кодом 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. AVAILABLE = path присутній І статус порожній. `--code-workspace <path>` записує `{folders:[{name,path}]}` (тільки доступні посилання на сховища, префікси `ref:`); у JSON-режимі запис виконується перед виведенням, тому stdout містить рівно один документ навіть при невдачі запису. Невдача: `{ "root": null, "members": [], "status": [d] }`, завершує кодом 1.

### 4.11 `store ... --json`
setup/register: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. unregister/remove: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. list: `{ "stores": [{id, root}], "status": [] }`. doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = невідомо/непроверено). Виявлені проблеми завершують кодом 0; збої завершують кодом 1 із відповідною нульовою формою. Скасування запиту завершує кодом 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: простий масив `[ {name, description, artifacts, source} ]`. `templates`: об'єкт з ключами `{ "<artifactId>": {path, source} }`. Обидва залежать від cwd, без ключів root/status.

## 5. Контракт коду виходу

| Ситуація | Вихідний код | Stdout |
|---|---|---|
| Успіх, включаючи виявлені проблеми (doctor/context/store doctor) | 0 | відповідне завантаження (payload) |
| Збій команди у режимі `--json` | 1 | один JSON-документ із `status: [d]` та нульовою формою команди |
| `validate` з елементами, що не пройшли перевірку | 1 | повний звіт |
| Скасування запиту (група `store`, людський режим) | 130 | Тільки до stderr |

## 6. Каталог діагностичних кодів

### Вирішення (Resolution)
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; прохідні: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Здоров'я OpenSpec-кореня (OpenSpec-root health, помилка, без виправлення)
`openspec_store_root_missing`, `openspec_root_missing`, `openspec_config_missing`, `openspec_specs_missing`, `openspec_changes_missing`, `openspec_archive_missing`, а також варіанти з `_not_directory`.

### Реєстр/ідентичність/стан сховища
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Налаштування/реєстрація/видалення сховища
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (warning у видаленні, помилка в doctor), `store_root_not_directory`.

### Git сховища
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (warning), `store_clone_fragile_directories` (warning), `store_remote_divergence` (info, doctor).

### Посилання (References) (warning)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Зв'язки (Relationships) (warning; doctor; context зберігає лише реєстрну)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Архівування (Archive) (JSON-режим)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Записи контексту (Context writes)
`context_file_exists`, `context_output_dir_missing`.

### Запасні варіанти (Fallbacks)
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Відомі невідповідності (Known inconsistencies)

Зафіксовано аудитом Capstone; перейменування ключових елементів — це рішення продукту, відкладені після цього релізу:

1. ~~У режимі `--json` кілька шляхів збоїв виводили лише до stderr без JSON-документа.~~ Виправлено в раунд Gauntlet Capstone: `show`/`validate` невідомі та неоднозначні елементи генерують `{status:[{code: unknown_item | ambiguous_item, ...}]}`; викинуті помилки у `status`/`instructions`/`list`/`show`/`validate` проходять через допоміжний механізм з помил, обізнаний із JSON (нульова форма команди + `status`); `store <unknown subcommand> --json` генерує `{status:[{code: unknown_store_subcommand}]}`; `list` містить свою нульову форму `{changes|specs: [], root: null}` при збоях вирішення.
2. `store_root_missing` виводиться з двома серйозностями (warning у видаленні, помилка в store doctor) — залежить від контексту, описано вище.
3. Регістр ключів snake_case (сім'я store) проти camelCase (сім'я workflow); `root.store_id` завжди snake_case.
4. У src існує чотири паралельні декларації типів обгортки; діагнози архівування ніколи не містять `target`.
5. `list --json` повторно використовує ключ `status` як рядкове перерахування для кожної зміни.
6. Тільки вивід `validate` містить поле `version`.
7. `schemas`/`templates` ігнорують вибір кореня (залежать від cwd, без `--store`).
8. Застарілі іменники (`change`/`spec` підкоманди) генерують завантаження без обгортки без `root`/`status`.