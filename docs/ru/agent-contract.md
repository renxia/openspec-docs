# Контракт Агента OpenSpec

Поверхности `openspec` CLI, читаемые машиной и проверенные на основе `src/` (аудит Capstone, 2026-06-11). Каждая форма ниже документирована исходя из генерирующего кода.

## 1. Общие соглашения

- **Один JSON-документ за одно выполнение.** В режиме `--json` стандартный вывод (stdout) содержит ровно один JSON-документ (форматированный с отступом в 2 пробела). Человеческий текст, спиннеры и баннер хранилища направляются в stderr.
- **Баннер хранилища.** В человеческом режиме корневой элемент, выбранный хранилищем, выводит в stderr: `Using OpenSpec root: <id> (<path>)`. Никогда не выводится в JSON-режиме.
- **Регистр ключей зависит от поверхности** (см. Известные несоответствия): полезные данные для store/doctor/context используют `snake_case`; полезные данные для workflow (`status`, `instructions`, `new change`, `validate`, `list`) используют `camelCase`, за исключением встроенного объекта `root`, который всегда использует `store_id`.
- **Необязательные ключи опущены, а не установлены как null**, в большинстве полезных данных (например, `root.store_id`, `member.path`). Исключения, использующие явный `null`, указаны для каждой формы (doctor хранилища `git.*`, полезные данные ошибок).

## 2. Диагностическая оболочка

Одна форма оболочки используется всеми диагностическими поверхностями, читаемыми машиной (`StoreDiagnostic`):

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Диагностика появляется в двух местах: **массивы статусов** (`status: StoreDiagnostic[]` на верхнем уровне или для каждой записи) для результатов проверки состояния, и **брошенные ошибки**, преобразованные в массив `status` с одним элементом при сбое команды.

## 3. Выборка корня и `RootOutput`

Все команды, разрешающие корень (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`), разрешают один корень OpenSpec с одним приоритетом:

1. `--store <id>` → корень зарегистрированного хранилища (`source: "store"`).
2. В противном случае — ближайший предок с `openspec/`: форма планирования → `source: "nearest"` (указатель `store:` игнорируется, и выводится предупреждение в stderr); каталог, содержащий только конфигурацию, с действительным указателем `store:` → это хранилище, `source: "declared"`.
3. Нет ближайшего корня + нет зарегистрированных хранилищ → ошибка `no_root_with_registered_stores`.
4. Нет ни корня, ни хранилищ: команды скаффолдинга рассматривают текущую рабочую директорию как `source: "implicit"`; диагностические команды (`doctor`, `context`) завершаются ошибкой `no_openspec_root` — они инспектируют, а не создают.

Успешные JSON-полезные данные включают корень:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "nearest" | "implicit", "store_id": "id (только при выборе хранилища)" }
```

**Контракт сбоя корня**: в JSON-режиме сбой разрешения выводит `{ ...commandNullShape, "status": [diagnostic] }` в stdout и завершает работу кодом 1.

## 4. JSON-формы команд

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — обратите внимание, что `status` для каждой смены является строковым перечислением. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Смена: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Спецификация: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Завершает работу кодом 1, если хотя бы один элемент не пройден.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"ready"|"blocked", missingDeps?} ], "root" }`. Если активных изменений нет: `{ "changes": [], "message", "root" }`, завершает работу кодом 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "template", "dependencies": [{id,done,path,description}], "unlocks", "root" }`.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — разрешенные записи содержат `root`/`specs`/`fetch`; Нерешенные содержат `store_id` + статус предупреждения. Индекс ограничен 50 КБ (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Успех: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Сбой: `{ "change": null, "status": [d] }`, завершает работу кодом 1.

### 4.8 `archive <name> --json`
Успех: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Сбой: `{ "archive": null, "root"?, "status": [d] }`, завершает работу кодом 1. JSON-режим строго неинтерактивен: каждая точка запроса становится кодом `archive_*`.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "status": [] } | null, "references": [...], "status": [] }`. Результаты проверки состояния любой степени тяжести завершают работу кодом 0. Полезная нагрузка сбоя: `{ "root": null, "store": null, "references": [], "status": [d] }`, завершает работу кодом 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. ДОСТУПНО = наличие пути И пустой массив `status`. `--code-workspace <path>` записывает `{folders:[{name,path}]}` (только доступные ссылки); в JSON-режиме запись выполняется до вывода, поэтому stdout содержит ровно один документ даже при сбое записи. Сбой: `{ "root": null, "members": [], "status": [d] }`, завершает работу кодом 1.

### 4.11 `store ... --json`
Настройка/регистрация: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. Отмена регистрации/удаление: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. Список: `{ "stores": [{id, root}], "status": [] }`. Doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = неизвестно/не проверено). Результаты проверки состояния завершают работу кодом 0; сбои завершаются кодом 1 с соответствующей нулевой формой. Отмена запроса завершает работу кодом 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: простой массив `[ {name, description, artifacts, source} ]`. `templates`: объект с ключами `{ "<artifactId>": {path, source} }`. Оба основаны на текущей рабочей директории, без ключей `root`/`status`.

## 5. Контракт кодов завершения работы

| Ситуация | Код завершения | Stdout |
|---|---|---|
| Успех, включая результаты проверки состояния (doctor/context/store doctor) | 0 | Полезная нагрузка |
| Сбой команды в режиме `--json` | 1 | Один JSON-документ с `status: [d]` и нулевой формой команды |
| `validate` с неуспешными элементами | 1 | Полный отчет |
| Отмена запроса (группа `store`, человеческий режим) | 130 | Только stderr |

## 6. Каталог диагностических кодов

### Разрешение
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; пропускающие: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Состояние OpenSpec-корня (ошибка, без исправления)
`openspec_store_root_missing`, `openspec_root_missing`, `openspec_config_missing`, `openspec_specs_missing`, `openspec_changes_missing`, `openspec_archive_missing`, а также варианты с `_not_directory`.

### Реестр/Идентичность/Состояние хранилища
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Настройка/Регистрация/Удаление хранилища
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (warning при удалении, ошибка при doctor), `store_root_not_directory`.

### Git хранилища
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (warning), `store_clone_fragile_directories` (warning), `store_remote_divergence` (info, doctor).

### Ссылки (warning)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Связи (warning; doctor; context сохраняет только реестр)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Архив (JSON-режим)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Записи контекста
`context_file_exists`, `context_output_dir_missing`.

### Обратные вызовы (Fallbacks)
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Известные несоответствия

Зафиксированы аудитом Capstone; переименования ключей, опубликованные в продукте, являются решениями, отложенными после этого релиза:

1. ~~В режиме `--json` некоторые пути сбоя выводились только в stderr без JSON-документа.~~ Исправлено в раунде Gauntlet Capstone: `show`/`validate` неизвестные и неоднозначные элементы выводят `{status:[{code: unknown_item | ambiguous_item, ...}]}`; брошенные ошибки в `status`/`instructions`/`list`/`show`/`validate` проходят через вспомогательную функцию сбоя, осведомленную о JSON (нулевая форма команды + `status`); `store <unknown subcommand> --json` выводит `{status:[{code: unknown_store_subcommand}]}`; `list` содержит свою нулевую форму `{changes|specs: [], root: null}` при сбоях разрешения.
2. `store_root_missing` выводится с двумя степенями тяжести (warning при удалении, ошибка при doctor) — зависит от контекста, описано выше.
3. Регистр ключей snake_case (семейство store) против camelCase (семейство workflow); `root.store_id` везде в snake_case.
4. В src существует четыре параллельных типа диагностической оболочки; диагностика архива никогда не содержит `target`.
5. `list --json` повторно использует ключ `status` как строковое перечисление для каждой смены.
6. Только вывод `validate` содержит поле `version`.
7. `schemas`/`templates` игнорируют выбор корня (основаны на cwd, без `--store`).
8. Устаревшие существительные формы (`change`/`spec` подкоманды) выводят полезные данные без оболочки без `root`/`status`.