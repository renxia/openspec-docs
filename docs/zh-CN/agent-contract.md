# OpenSpec Agent Contract

`openspec` CLI 的机器可读表面，已针对 `src/` 进行验证（capstone 审计，2026-06-11）。下方所有形状均源自发射代码。

## 1. 通用约定

- **每次调用一个 JSON 文档。** 在 `--json` 模式下，stdout 承载恰好一个 JSON 文档（2 个空格缩进打印）。人类可读文本、转圈和存储横幅会输出到 stderr。
- **存储横幅。** 在人类模式下，一个由存储选择的根会向 stderr 打印 `Using OpenSpec root: <id> (<path>)`。在 JSON 模式下绝不打印。
- **键的大小写取决于表面类型**（参见已知的不一致性）：store/doctor/context 的 payload 使用 `snake_case`；工作流 payload (`status`, `instructions`, `new change`, `validate`, `list`) 使用 `camelCase`，但嵌入的 `root` 对象始终使用 `store_id`。
- **可选键被省略，而不是设置为 null**，在大多数 payload 中（例如 `root.store_id`、`member.path`）。那些显式使用 `null` 的例外情况会在每个形状中说明（存储 doctor `git.*`、失败 payload）。

## 2. 诊断封装体

一个封装体形状被所有机器可读的诊断 (`StoreDiagnostic`) 所共享：

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

诊断出现在两个位置：用于健康状况的**status 数组**（顶级或每个条目中的 `status: StoreDiagnostic[]`），以及转换为单个元素的 `status` 数组的**抛出错误**。

## 3. 根选择和 `RootOutput`

所有解析根的命令（`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`）都以一种优先级顺序解析一个 OpenSpec 根：

1. `--store <id>` → 已注册存储的根 (`source: "store"`)。
2. 否则，具有 `openspec/` 的最近祖先 → planning 形状 → `source: "nearest"`（忽略带有 `store:` 指针的设置目录，会发出 stderr 警告）；具有有效 `store:` 指针的仅配置目录 → 该存储，`source: "declared"`。
3. 没有最近的根且没有已注册的存储 → 错误 `no_root_with_registered_stores`。
4. 没有根，也没有存储：脚手架命令将当前工作目录 (cwd) 视为 `source: "implicit"`；诊断命令（`doctor`, `context`）则以 `no_openspec_root` 失败——它们进行检查，而非脚手架。

成功的 JSON payload 会嵌入根：

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**根故障契约**：在 JSON 模式下，解析失败会在 stdout 上打印 `{ ...commandNullShape, "status": [diagnostic] }` 并以 1 退出。

## 4. 命令 JSON 形状

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — 注意，每个 change 的 `status` 在这里是一个字符串枚举。`--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`。

### 4.2 `show <item> --json`
Change: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`。Spec: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`。

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`。任何一个 item 失败时，退出码为 1。

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"ready"|"blocked", missingDeps?} ], "root" }`。没有活动更改时：`{ "changes": [], "message", "root" }`，退出码为 0。

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "template", "dependencies": [{id,done,path,description}], "unlocks", "root" }`。

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — 已解析的条目包含 root/specs/fetch；未解析的则包含 store_id + 警告状态。索引限制在 50KB (`reference_index_truncated`)。

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`。

### 4.7 `new change <name> --json`
成功：`{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`。失败：`{ "change": null, "status": [d] }`，退出码为 1。

### 4.8 `archive <name> --json`
成功：`{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`。失败：`{ "archive": null, "root"?, "status": [d] }`，退出码为 1。JSON 模式是严格非交互式的：每一个提示点都成为一个 `archive_*` 代码。

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "status": [] } | null, "references": [...], "status": [] }`。任何级别的健康状况都会导致退出码为 0。失败 payload：`{ "root": null, "store": null, "references": [], "status": [d] }`，退出码为 1。

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`。AVAILABLE = path 存在 AND status 为空。`--code-workspace <path>` 会写入 `{folders:[{name,path}]}`（仅包含可用的引用存储，使用 `ref:` 前缀）；在 JSON 模式下，写入操作先于打印执行，因此即使写入失败，stdout 也只包含一个文档。失败：`{ "root": null, "members": [], "status": [d] }`，退出码为 1。

### 4.11 `store ... --json`
setup/register: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`。unregister/remove: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`。list: `{ "stores": [{id, root}], "status": [] }`。doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = 未知/未探测)。健康状况会导致退出码为 0；失败则以匹配的 null-shape 退出码为 1。提示取消操作退出码为 130。

### 4.12 `schemas --json` / `templates --json`
`schemas`: 裸数组 `[ {name, description, artifacts, source} ]`。`templates`: 键值对象 `{ "<artifactId>": {path, source} }`。两者均基于 cwd，不包含 root/status 键。

## 5. 退出码契约

| 情况 | 退出码 | Stdout |
|---|---|---|
| 成功，包括健康状况（doctor/context/store doctor） | 0 | payload |
| 在 `--json` 模式下命令失败 | 1 | 一个包含 `status: [d]` 和命令 null-shape 的 JSON 文档 |
| `validate` 中有项目失败 | 1 | 完整的报告 |
| 提示取消操作（store 组，人类模式） | 130 | 仅 stderr |

## 6. 诊断代码目录

### 解析 (Resolution)
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`；传递性：`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`。

### OpenSpec-root 健康状况 (error, no fix)
`openspec_store_root_missing`, `openspec_root_missing`, `openspec_config_missing`, `openspec_specs_missing`, `openspec_changes_missing`, `openspec_archive_missing`，以及这些每个项的 `_not_directory` 变体。

### 存储注册表/身份/状态
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info)。

### 存储设置/注册/移除
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (移除时警告，doctor 时错误), `store_root_not_directory`。

### 存储 git
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (warning), `store_clone_fragile_directories` (warning), `store_remote_divergence` (info, doctor)。

### 引用 (警告)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`。

### 关系 (警告；doctor；context 只保留 registry 的)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`。

### 归档 (JSON 模式)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`。

### Context 写入
`context_file_exists`, `context_output_dir_missing`。

### 回退机制 (Fallbacks)
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`。

## 已知的不一致性

由 capstone 审计记录；已发布的关键重命名是推迟到本版本之后的产品决策：

1. ~~在 `--json` 模式下，有多个失败路径只向 stderr 打印而没有 JSON 文档。~~ 在 capstone gauntlet 轮次中修复：`show`/`validate` 未知或模糊的 item 会发出 `{status:[{code: unknown_item | ambiguous_item, ...}]}`；`status`/`instructions`/`list`/`show`/`validate` 中的抛出错误会通过 JSON 感知的失败助手（命令的 null-shape + `status`）路由；`store <unknown subcommand> --json` 会发出 `{status:[{code: unknown_store_subcommand}]}`；在解析失败时，`list` 携带其 `{changes|specs: [], root: null}` 的 null-shape。
2. `store_root_missing` 以两种严重性（移除时的警告，存储 doctor 中的错误）发出——取决于上下文，已在上文记录。
3. snake_case (store 家族) 与 camelCase (工作流家族) 的键大小写；`root.store_id` 在所有地方都是 snake_case。
4. src 中存在四种并行的封装体类型声明；归档诊断永远不包含 `target`。
5. `list --json` 重用 `status` 键作为每个更改的字符串枚举。
6. 只有 `validate` 输出才携带 `version` 字段。
7. `schemas`/`templates` 忽略根选择（基于 cwd，没有 `--store`）。
8. 已弃用的名词形式（`change`/`spec` 子命令）会发出不带 `root`/`status` 的非封装 payload。