# OpenSpec 代理契约

`openspec` CLI 的可机器读取接口，已对照 `src/` 完成验证（顶石审计，2026-06-11）。以下所有数据结构均直接源自生成代码的文档。

## 1. 通用约定

- **每次调用仅输出一个 JSON 文档。** 在 `--json` 模式下，stdout 仅输出一个经过 2 空格缩进格式化的 JSON 文档。人类可读文本、加载动画和存储横幅均输出至 stderr。
- **存储横幅。** 在人类可读模式下，已选中的存储根目录会向 stderr 输出 `Using OpenSpec root: <id> (<path>)`。JSON 模式下不会打印该横幅。
- **键的大小写规则因接口而异**（参见「已知不一致项」）：存储/doctor/上下文负载使用 `snake_case`；工作流负载（`status`、`instructions`、`new change`、`validate`、`list`）使用 `camelCase`，但内嵌的 `root` 对象除外，该对象始终使用 `store_id` 作为键。
- **大多数负载中，可选键会被直接省略，而非设为 `null`**（例如 `root.store_id`、`member.path`）。使用显式 `null` 的例外情况会在对应数据结构中单独标注（存储 doctor 的 `git.*` 字段、失败负载）。

## 2. 诊断信封结构

所有机器可读的诊断项（`StoreDiagnostic`）共享同一信封结构：

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

诊断项会出现在两个位置：用于健康检查结果的**状态数组**（`status: StoreDiagnostic[]`，位于顶层或单个条目下），以及命令失败时被转换为单元素 `status` 数组的**抛出错误**。

## 3. 根节点选择与 `RootOutput`

所有需要解析根节点的命令（`list`、`show`、`validate`、`status`、`instructions`、`instructions apply`、`new change`、`archive`、`doctor`、`context`）按照以下唯一优先级解析一个 OpenSpec 根节点：

1. `--store <id>` → 使用已注册存储的根节点（`source: "store"`）。
2. 否则，查找最近包含 `openspec/` 目录的祖先目录：若为规划形态根节点 → `source: "nearest"`（此时 `store:` 指针会被忽略，同时向标准错误输出警告）；若为仅包含配置的目录且存在有效的 `store:` 指针 → 使用该存储，`source: "declared"`。
3. 无最近根节点且已设置全局默认存储（通过 `openspec config set defaultStore <id>` 设置） → 使用该存储，`source: "global_default"`；若存储ID已失效，则返回底层存储错误，同时 `fix` 字段会提示执行 `openspec config unset defaultStore`。
4. 无最近根节点、无默认存储，且存在已注册存储 → 返回错误 `no_root_with_registered_stores`。
5. 无根节点、无默认存储、无已注册存储：脚手架类命令将当前工作目录视为 `source: "implicit"`；诊断类命令（`doctor`、`context`）则返回 `no_openspec_root` 错误——这类命令仅做检查，不会执行脚手架搭建。

成功的 JSON 响应会嵌入根节点信息：

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**根节点失败约定**：JSON 模式下，解析失败时会在标准输出打印 `{ ...commandNullShape, "status": [diagnostic] }` 并以退出码 1 结束进程。

## 4. 命令 JSON 结构

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` —— 注意此处每个变更的 `status` 是字符串枚举类型。添加 `--specs` 参数时返回 `{ "specs": [ { "id", "requirementCount" } ], "root" }`。

### 4.2 `show <item> --json`
变更项：`{ "id", "title", "deltaCount", "deltas": [...], "root" }`。规范项：`{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`。

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`。任意条目验证失败时退出码为 1。

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`。每个产物的 `requires` 字段是其直接依赖的ID列表（所有状态都会携带该字段，因此即使产物状态为 `done`，也可计算其传递依赖集合）；`missingDeps` 仅在产物状态为 `blocked` 时出现。`"skipped"` 标记的产物是指：变更的 `.openspec.yaml` 声明了 `skip_specs: true`，且该产物的 `generates` 路径位于 `specs/` 目录下——这类产物已满足依赖条件，但禁止创建。无活跃变更时返回 `{ "changes": [], "message", "root" }`，退出码为 0。

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`。当变更声明了 `skip_specs: true` 且当前产物被跳过时，会返回 `"skipped": true`（伴随 `"warning"` 字段）——此时禁止创建该产物的文件。依赖条目中 `skipped: true` 表示该依赖无需文件即可满足——此时不要尝试读取其路径。

`ReferenceIndexEntry` 结构为：`{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }`——已解析的条目会携带 root/specs/fetch 字段；未解析的条目仅携带 store_id 和警告状态。索引大小上限为 50KB（超出时触发 `reference_index_truncated` 诊断）。

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`。

### 4.7 `new change <name> --json`
成功时返回 `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`。失败时返回 `{ "change": null, "status": [d] }`，退出码为 1。

### 4.8 `archive <name> --json`
成功时返回 `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`。失败时返回 `{ "archive": null, "root"?, "status": [d] }`，退出码为 1。JSON 模式下完全无交互：所有需要用户确认的提示点都会转换为 `archive_*` 类型的错误码。

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`。`drift` 字段仅在基于 Git 的存储检出存在上游跟踪引用时出现，其值为相对于上次拉取的上游的领先/落后提交数，而非实时远程仓库的数值。任意严重程度的健康检查结果均以退出码 0 结束。失败响应为 `{ "root": null, "store": null, "references": [], "status": [d] }`，退出码为 1。

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`。`AVAILABLE` 表示路径存在且状态数组为空。添加 `--code-workspace <path>` 参数时会写入 `{folders:[{name,path}]}`（仅包含可用的引用存储，路径带 `ref:` 前缀）；JSON 模式下写入操作会在打印响应前执行，因此即使写入失败，标准输出也只会输出一份文档。失败响应为 `{ "root": null, "members": [], "status": [d] }`，退出码为 1。

### 4.11 `store ... --json`
setup/register（设置/注册）：`{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`。unregister/remove（注销/移除）：`{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`。list（列出）：`{ "stores": [{id, root}], "status": [] }`。doctor（检查）：`{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }`（`null` 表示未知/未探测）。健康检查结果以退出码 0 结束；失败时以退出码 1 返回对应的空结构响应。用户取消提示时退出码为 130。

### 4.12 `schemas --json` / `templates --json`
`schemas`（规范）：纯数组 `[ {name, description, artifacts, source} ]`。`templates`（模板）：键值对象 `{ "<artifactId>": {path, source} }`。两者均基于当前工作目录，不包含 root/status 字段。

## 5. 退出码约定

| 场景 | 退出码 | 标准输出 |
|---|---|---|
| 执行成功（含健康检查结果，如 doctor/context/store doctor 命令） | 0 | 响应载荷 |
| `--json` 模式下命令执行失败 | 1 | 包含 `status: [d]` 和命令空结构的单份 JSON 文档 |
| `validate` 命令存在验证失败的条目 | 1 | 完整报告 |
| 用户取消提示（`store` 命令组，人工交互模式） | 130 | 仅标准错误输出 |

## 6. 诊断码目录

### 解析类
`no_openspec_root`、`no_root_with_registered_stores`、`no_registered_stores`、`unknown_store`、`store_identity_mismatch`、`unhealthy_store_root`、`store_path_not_supported`、`invalid_store_pointer`、`initiative_option_removed`、`areas_option_removed`；透传错误码：`invalid_store_id`、`invalid_store_registry`、`invalid_store_metadata`。

### OpenSpec 根节点健康（错误，无修复建议）
`openspec_store_root_missing`、`openspec_store_root_not_directory`、`openspec_root_missing`、`openspec_root_not_directory`、`openspec_config_missing`、`openspec_config_not_file`、`openspec_specs_not_directory`、`openspec_changes_not_directory`、`openspec_archive_not_directory`。存储测试版期间，健康的根节点可以不存在 `openspec/specs/`、`openspec/changes/` 和 `openspec/changes/archive/` 目录；仅当这些目录存在但不是目录类型时，才判定为健康错误。

### 存储注册表/身份/状态
`invalid_store_id`、`invalid_store_registry`、`invalid_store_metadata`、`store_registry_busy`、`store_not_found`、`no_store_registry`、`store_registry_changed`、`store_metadata_missing`、`store_metadata_id_mismatch`、`store_metadata_invalid`、`store_id_conflict`、`store_path_conflict`、`store_already_registered`（信息级）。

### 存储设置/注册/移除
`store_setup_id_required`、`store_setup_path_required`、`store_setup_path_not_directory`、`store_setup_inside_git_repo`、`store_setup_non_empty_directory`、`store_setup_cancelled`、`store_path_required`、`store_path_missing`、`store_path_not_directory`、`store_root_pointer_declared`、`store_register_root_unhealthy`、`store_register_identity_confirmation_required`、`store_register_cancelled`、`store_remote_empty`、`store_remote_requires_hand_edit`、`store_remove_confirmation_required`、`store_remove_cancelled`、`store_remove_path_not_directory`、`store_remove_metadata_missing`、`store_root_missing`（移除时为警告，doctor 检查时为错误）、`store_root_not_directory`。

### 存储 Git 相关
`store_git_init_failed`、`store_git_identity_missing`、`store_git_commit_failed`、`store_git_no_commits`（警告）、`store_clone_fragile_directories`（警告）、`store_remote_divergence`（信息级，doctor 命令）、`store_checkout_drift`（信息级，doctor 命令）。

### 引用（警告级）
`reference_invalid_id`、`reference_registry_unreadable`、`reference_unresolved`、`reference_root_unhealthy`、`reference_index_truncated`。

### 关联关系（警告级；doctor 命令触发；context 命令仅保留注册表类关联）
`relationship_registry_unreadable`、`root_pointer_ignored`、`root_pointer_invalid`、`pointer_declarations_inert`。

### 归档（JSON 模式）
`archive_change_name_required`、`archive_change_not_found`、`archive_validation_failed`、`archive_confirmation_required`、`archive_tasks_incomplete`、`archive_spec_update_failed`、`archive_spec_validation_failed`、`archive_target_exists`、`archive_error`。

### 上下文写入
`context_file_exists`、`context_output_dir_missing`。

### 回退错误
`doctor_failed`、`context_failed`、`store_error`、`change_error`、`archive_error`。

## 已知不一致性

由最终审计记录；已发布键的重命名属于产品决策，将推迟到本次发布之后处理：

1. ~~`--json` 模式下，部分失败路径仅输出标准错误，不返回 JSON 文档。~~ 已在最终验收轮次修复：`show`/`validate` 命令遇到未知或歧义条目时，会输出 `{status:[{code: unknown_item | ambiguous_item, ...}]}`；`status`/`instructions`/`list`/`show`/`validate` 命令的抛出错误会通过 JSON 感知的失败辅助工具处理（返回命令空结构 + `status` 字段）；`store <unknown subcommand> --json` 会输出 `{status:[{code: unknown_store_subcommand}]}`；`list` 命令在解析失败时会携带 `{changes|specs: [], root: null}` 空结构返回。
2. `store_root_missing` 错误码会携带两种严重程度（移除时为警告，存储 doctor 检查时为错误）——具体取决于上下文，已在上述文档中说明。
3. 键命名规则不一致：存储类命令使用 snake_case，工作流类命令使用 camelCase；`root.store_id` 全局统一使用 snake_case。
4. 源码中存在四份并行的信封类型声明；归档类诊断项从不携带 `target` 字段。
5. `list --json` 的输出中，每个变更的 `status` 键被复用为字符串枚举类型。
6. 仅 `validate` 命令的输出携带 `version` 字段。
7. `schemas`/`templates` 命令忽略根节点选择逻辑（基于当前工作目录，不支持 `--store` 参数）。
8. 已废弃的名词形式子命令（`change`/`spec`）会输出未封装的结构，不包含 `root`/`status` 字段。