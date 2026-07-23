# Контракт агента OpenSpec

Машинночитаемые интерфейсы CLI `openspec`, проверенные на соответствие коду в каталоге `src/` (итоговый аудит, 2026-06-11). Каждая структура ниже документируется на основе генерирующего её код.

## 1. Общие соглашения

- **Один JSON-документ на вызов.** В режиме `--json` в stdout передаётся ровно один JSON-документ (с форматированием в 2 пробела). Человекочитаемый текст, спиннеры и баннер хранилища выводятся в stderr.
- **Баннер хранилища.** В человекочитаемом режиме для выбранного хранилищем корня в stderr выводится строка `Using OpenSpec root: <id> (<path>)`. Никогда не выводится в JSON-режиме.
- **Регистр ключей зависит от интерфейса** (см. раздел «Известные несоответствия»): полезные нагрузки команд `store`, `doctor` и `context` используют `snake_case`; полезные нагрузки рабочих процессов (`status`, `instructions`, `new change`, `validate`, `list`) используют `camelCase`, за исключением встроенного объекта `root`, для которого всегда используется ключ `store_id`.
- **Опциональные ключи в большинстве полезных нагрузок опускаются, а не устанавливаются в значение `null`** (например, `root.store_id`, `member.path`). Исключения, в которых используется явное значение `null`, перечислены отдельно для каждой структуры (полезные нагрузки команды `doctor` хранилища с префиксом `git.*`, полезные нагрузки сбоев).

## 2. Конверт диагностики

Одна и та же структура конверта используется для всех машинно-читаемых диагностических сообщений (`StoreDiagnostic`):

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Диагностические сообщения отображаются в двух местах: **массивы статусов** (`status: StoreDiagnostic[]` на верхнем уровне или для каждой записи) для выводов о работоспособности, а также **выбрасываемые ошибки**, которые при сбое команды преобразуются в массив `status` из одного элемента.

## 3. Выбор корня и `RootOutput`

Все команды, разрешающие корень (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`), находят один корень OpenSpec по следующему приоритету:

1. `--store <id>` → корень зарегистрированного хранилища (`source: "store"`).
2. Иначе — ближайший предок с директорией `openspec/`: форма планирования → `source: "nearest"` (указатель `store:` игнорируется с предупреждением в stderr); директория только с конфигом и валидным указателем `store:` → это хранилище, `source: "declared"`.
3. Нет ближайшего корня + установлен глобальный `defaultStore` (`openspec config set defaultStore <id>`) → это хранилище, `source: "global_default"`; устаревший идентификатор вызывает ошибку хранилища с указанием `fix` для команды `openspec config unset defaultStore`.
4. Нет ближайшего корня, нет значения по умолчанию + есть зарегистрированные хранилища → ошибка `no_root_with_registered_stores`.
5. Нет корня, нет значения по умолчанию, нет хранилищ: команды создания каркаса рассматривают cwd как `source: "implicit"`; диагностические команды (`doctor`, `context`) вместо этого завершаются с ошибкой `no_openspec_root` — они только инспектируют, не создают каркас.

Успешные JSON-полезные нагрузки содержат встроенный корень:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Контракт при сбое разрешения корня**: в JSON-режиме при сбое разрешения в stdout выводится `{ ...commandNullShape, "status": [diagnostic] }` и процесс завершается с кодом 1.

## 4. Структуры JSON для команд

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — обратите внимание, что поле `status` для каждого изменения здесь является строковым перечислением. При использовании `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Для изменения: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Для спецификации: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Завершается с кодом 1, если какой-либо элемент не прошёл проверку.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`. Поле `requires` каждого артефакта содержит идентификаторы его прямых зависимостей (присутствует для всех статусов, поэтому множество транзитивных требуемых зависимостей можно вычислить даже если артефакт имеет статус `done`); поле `missingDeps` появляется только при статусе `blocked`. Статус `"skipped"` отмечает артефакт, путь `generates` которого находится в директории `specs/` у изменения, в файле `.openspec.yaml` которого указано `skip_specs: true`; он удовлетворяет зависимостям, но его не нужно создавать. При отсутствии активных изменений выводится `{ "changes": [], "message", "root" }`, завершение с кодом 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`. Поле `"skipped": true` (вместе с `"warning"`) появляется, если в изменении указано `skip_specs: true` и этот артефакт пропущен — не создавайте его файлы. Запись зависимости с `skipped: true` удовлетворена без файлов — не пытайтесь читать её пути.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — у разрешённых записей присутствуют поля root/specs/fetch; у неразрешённых — store_id и статус предупреждения. Размер индекса ограничен 50 КБ (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
При успехе: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. При сбое: `{ "change": null, "status": [d] }`, завершение с кодом 1.

### 4.8 `archive <name> --json`
При успехе: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. При сбое: `{ "archive": null, "root"?, "status": [d] }`, завершение с кодом 1. В JSON-режиме отсутствует интерактивное взаимодействие: каждый запрос на подтверждение преобразуется в код вида `archive_*`.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`. Поле `drift` (присутствует только для рабочей копии хранилища на Git с upstream-ссылкой отслеживания) показывает количество коммитов впереди/позади относительно последнего полученного upstream, а не актуального удалённого репозитория. При выводе результатов о работоспособности любой серьёзности завершение происходит с кодом 0. Полезная нагрузка при сбое: `{ "root": null, "store": null, "references": [], "status": [d] }`, завершение с кодом 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. Доступность (AVAILABLE) = путь присутствует И статус пустой. При использовании `--code-workspace <path>` выводится `{folders:[{name,path}]}` (только доступные хранилища, на которые есть ссылки, с префиксами `ref:`); в JSON-режиме запись происходит перед выводом, поэтому в stdout содержится ровно один документ даже при сбое записи. При сбое: `{ "root": null, "members": [], "status": [d] }`, завершение с кодом 1.

### 4.11 `store ... --json`
Настройка/регистрация: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. Отмена регистрации/удаление: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. Список: `{ "stores": [{id, root}], "status": [] }`. Проверка работоспособности: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = неизвестно/не проверено). При выводе результатов о работоспособности любой серьёзности завершение происходит с кодом 0; при сбоях завершение с кодом 1 с соответствующей пустой формой. При отмене запроса на подтверждение завершение с кодом 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: простой массив `[ {name, description, artifacts, source} ]`. `templates`: объект с ключами `{ "<artifactId>": {path, source} }`. Оба работают из текущей рабочей директории, не содержат ключей root/status.

## 5. Контракт кодов завершения

| Ситуация | Код завершения | Stdout |
|---|---|---|
| Успех, включая выводы о работоспособности (doctor/context/store doctor) | 0 | полезная нагрузка |
| Сбой команды в режиме `--json` | 1 | один JSON-документ с полем `status: [d]` и пустой формой команды |
| `validate` с элементами, не прошедшими проверку | 1 | полный отчёт |
| Отмена запроса на подтверждение (группа `store`, человекочитаемый режим) | 130 | только stderr |

## 6. Каталог кодов диагностических сообщений

### Разрешение
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; пропускаются без обработки: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Работоспособность корня OpenSpec (ошибка, без исправления)
`openspec_store_root_missing`, `openspec_store_root_not_directory`, `openspec_root_missing`, `openspec_root_not_directory`, `openspec_config_missing`, `openspec_config_not_file`, `openspec_specs_not_directory`, `openspec_changes_not_directory`, `openspec_archive_not_directory`. Во время бета-тестирования хранилищ директории `openspec/specs/`, `openspec/changes/` и `openspec/changes/archive/` могут отсутствовать в работоспособном корне; они считаются ошибками работоспособности только если присутствуют в файловой системе, но не являются директориями.

### Реестр хранилищ/идентичность/состояние
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (информационное сообщение).

### Настройка/регистрация/удаление хранилищ
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_root_pointer_declared`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (предупреждение при удалении, ошибка при проверке работоспособности хранилища), `store_root_not_directory`.

### Git-хранилища
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (предупреждение), `store_clone_fragile_directories` (предупреждение), `store_remote_divergence` (информационное сообщение, doctor), `store_checkout_drift` (информационное сообщение, doctor).

### Ссылки (предупреждения)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Связи (предупреждения; команда `doctor`; в команде `context` сохраняется только реестровое сообщение)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Архивация (режим JSON)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Запись данных контекста
`context_file_exists`, `context_output_dir_missing`.

### Резервные коды
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Известные несоответствия

Зафиксированы в ходе итогового аудита; переименования публикуемых ключей являются продуктовыми решениями, отложенными на релизы после текущего:

1. ~~В режиме `--json` несколько путей сбоя выводили данные только в stderr без JSON-документа.~~ Исправлено в финальном раунде всесторонней проверки: команды `show`/`validate` выводят `{status:[{code: unknown_item | ambiguous_item, ...}]}` для неизвестных и неоднозначных элементов; выбрасываемые ошибки в `status`/`instructions`/`list`/`show`/`validate` проходят через вспомогательный обработчик сбоев с поддержкой JSON (пустая форма команды + поле `status`); команда `store <неизвестная подкоманда> --json` выводит `{status:[{code: unknown_store_subcommand}]}`; команда `list` передаёт свою пустую форму `{changes|specs: [], root: null}` при сбоях разрешения корня.
2. Код `store_root_missing` выводится с двумя уровнями серьёзности (предупреждение при удалении, ошибка при проверке работоспособности хранилища) — зависит от контекста, описано выше.
3. Регистр ключей snake_case (для семейства хранилищ) против camelCase (для семейства рабочих процессов); поле `root.store_id` везде использует регистр snake_case.
4. В исходном коде (src) существует четыре параллельных объявления типов конвертов; диагностические сообщения архивации никогда не содержат поле `target`.
5. Команда `list --json` повторно использует ключ `status` как строковое перечисление для каждого изменения.
6. Только вывод команды `validate` содержит поле `version`.
7. Команды `schemas`/`templates` игнорируют выбор корня (работают из текущей рабочей директории, не поддерживают флаг `--store`).
8. Устаревшие формы существительных (подкоманды `change`/`spec`) выводят неконвертированные полезные нагрузки без полей `root`/`status`.