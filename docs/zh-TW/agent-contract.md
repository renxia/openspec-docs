# OpenSpec Agent 合約

`openspec` CLI 的可機讀取介面，已針對 `src/` 進行驗證（capstone 審計，2026-06-11）。下方所有形狀均源自發射程式碼。

## 1. 一般規範

- **每次呼叫一個 JSON 文件。** 在 `--json` 模式下，stdout 承載恰好一個 JSON 文件（使用 2 個空格進行美觀格式化）。人類可讀的文字、旋轉指示器和儲存庫橫幅資訊會輸出到 stderr。
- **儲存庫橫幅資訊。** 在人類模式下，選定的儲存根目錄會將 `Using OpenSpec root: <id> (<path>)` 寫入 stderr。在 JSON 模式下絕不會顯示。
- **鍵的命名規範取決於介面**（參見已知不一致性）：store/doctor/context 的資料負載使用 `snake_case`；工作流程 (workflow) 資料負載 (`status`, `instructions`, `new change`, `validate`, `list`) 使用 `camelCase`，但嵌入的 `root` 物件總是使用 `store_id`。
- **可選鍵會被省略，而非設為 null**，在大多數資料負載中（例如 `root.store_id`、`member.path`）。那些明確使用 `null` 的例外情況會在每個介面中說明（儲存庫 doctor `git.*`、失敗資料負載）。

## 2. 診斷封裝 (Diagnostic Envelope)

一個封裝形狀被所有可機讀取的診斷 (`StoreDiagnostic`) 所共享：

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

診斷出現在兩個位置：用於健康狀況的**狀態陣列**（頂層的 `status: StoreDiagnostic[]` 或每個條目），以及轉換為單一元素 `status` 陣列的**拋出錯誤**（在命令失敗時）。

## 3. Root 選取和 `RootOutput`

所有解析 root 的命令 (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) 都會以一種優先順序來解析一個 OpenSpec root：

1. `--store <id>` → 註冊儲存庫的 root (`source: "store"`)。
2. 否則，最近的祖先且包含 `openspec/`：規劃形狀 (planning shape) → `source: "nearest"`（忽略帶有 `store:` 指針的設定檔目錄，並在 stderr 發出警告）；具有有效 `store:` 指針的僅配置目錄 → 該儲存庫，`source: "declared"`。
3. 沒有最近的 root + 註冊儲存庫存在 → 錯誤 `no_root_with_registered_stores`。
4. 沒有 root，也沒有儲存庫：架構命令 (scaffolding commands) 將當前工作目錄 (cwd) 視為 `source: "implicit"`；診斷命令 (`doctor`, `context`) 不會進行架構，而是以 `no_openspec_root` 失敗——它們只會檢查。

成功的 JSON 資料負載會嵌入 root：

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Root 失敗合約**：在 JSON 模式下，解析失敗會將 `{ ...commandNullShape, "status": [diagnostic] }` 輸出到 stdout 並以 1 退出。

## 4. 命令 JSON 形狀

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — 請注意，每個變更的 `status` 在這裡是一個字串枚舉。`--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`。

### 4.2 `show <item> --json`
Change: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`。Spec: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`。

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`。當任何項目失敗時，退出碼為 1。

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"ready"|"blocked", missingDeps?} ], "root" }`。沒有活動變更時：`{ "changes": [], "message", "root" }`，退出碼為 0。

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "template", "dependencies": [{id,done,path,description}], "unlocks", "root" }`。

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — 已解析的條目會攜帶 root/specs/fetch；未解析的則攜帶 store_id + 警告狀態。索引限制為 50KB (`reference_index_truncated`)。

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`。

### 4.7 `new change <name> --json`
成功：`{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`。失敗：`{ "change": null, "status": [d] }`，退出碼為 1。

### 4.8 `archive <name> --json`
成功：`{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`。失敗：`{ "archive": null, "root"?, "status": [d] }`，退出碼為 1。JSON 模式是嚴格非互動式的：每個提示點都會變成一個 `archive_*` 代碼。

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "status": [] } | null, "references": [...], "status": [] }`。任何嚴重程度的健康狀況都會以 0 退出。失敗資料負載：`{ "root": null, "store": null, "references": [], "status": [d] }`，退出碼為 1。

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`。AVAILABLE = path 存在 AND status 為空陣列。`--code-workspace <path>` 會寫入 `{folders:[{name,path}]}`（僅限可引用的儲存庫，使用 `ref:` 前綴）；在 JSON 模式下，寫入操作會在輸出前執行，因此即使寫入失敗，stdout 也會包含恰好一個文件。失敗：`{ "root": null, "members": [], "status": [d] }`，退出碼為 1。

### 4.11 `store ... --json`
setup/register：`{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`。unregister/remove：`{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`。list：`{ "stores": [{id, root}], "status": [] }`。doctor：`{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }`（`null` = 未知/未探測）。健康狀況以 0 退出；失敗則以 1 退出，並使用匹配的 null-shape。提示取消操作會以 130 退出。

### 4.12 `schemas --json` / `templates --json`
`schemas`: 裸陣列 `[ {name, description, artifacts, source} ]`。`templates`: 鍵值對物件 `{ "<artifactId>": {path, source} }`。兩者均基於 cwd，不包含 root/status 鍵。

## 5. 退出碼合約

| 情境 | 退出碼 | Stdout |
|---|---|---|
| 成功，包括健康狀況 (doctor/context/store doctor) | 0 | 資料負載 |
| 在 `--json` 模式下命令失敗 | 1 | 包含 `status: [d]` 的一個 JSON 文件和該命令的 null-shape |
| 包含失敗項目的 `validate` | 1 | 完整報告 |
| 提示取消操作 (store 群組，人類模式) | 130 | 僅輸出到 stderr |

## 6. 診斷代碼目錄

### 解析 (Resolution)
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`；傳遞：`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`。

### OpenSpec-root 健康狀況 (error, no fix)
`openspec_store_root_missing`, `openspec_root_missing`, `openspec_config_missing`, `openspec_specs_missing`, `openspec_changes_missing`, `openspec_archive_missing`，以及每個項目的 `_not_directory` 變體。

### 儲存庫註冊/身份/狀態
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info)。

### 儲存庫設置/註冊/移除
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (移除時的警告，doctor 中的錯誤), `store_root_not_directory`。

### 儲存庫 git
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (warning), `store_clone_fragile_directories` (warning), `store_remote_divergence` (info, doctor)。

### 引用 (References) (warning)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`。

### 關係 (Relationships) (warning; doctor; context 只保留 registry 一項)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`。

### 歸檔 (Archive) (JSON 模式)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`。

### Context 寫入
`context_file_exists`, `context_output_dir_missing`。

### 後備方案 (Fallbacks)
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`。

## 已知不一致性

由 capstone 審計記錄；發布鍵的重新命名是延遲到本版本之後的產品決策：

1. ~~在 `--json` 模式下，多個失敗路徑只輸出到 stderr 而沒有 JSON 文件。~~ 已在 capstone gauntlet 輪次中修復：`show`/`validate` 對於未知和模糊的項目會發出 `{status:[{code: unknown_item | ambiguous_item, ...}]}`；`status`/`instructions`/`list`/`show`/`validate` 中的拋出錯誤會通過 JSON 感知的失敗輔助工具（該命令的 null-shape + `status`）進行處理；`store <unknown subcommand> --json` 發出 `{status:[{code: unknown_store_subcommand}]}`；`list` 在解析失敗時攜帶其 `{changes|specs: [], root: null}` 的 null-shape。
2. `store_root_missing` 以兩種嚴重程度發出（移除時的警告，store doctor 中的錯誤）— 取決於上下文，詳見上文。
3. snake_case (store 家族) 與 camelCase (workflow 家族) 的鍵命名規範；`root.store_id` 在所有地方都是 snake_case。
4. src 中存在四種並行的封裝類型聲明；歸檔診斷從不攜帶 `target`。
5. `list --json` 重用 `status` 鍵作為每個變更的字串枚舉。
6. 只有 `validate` 的輸出會包含 `version` 欄位。
7. `schemas`/`templates` 會忽略 root 選取（基於 cwd，不使用 `--store`）。
8. 已棄用的名詞形式 (`change`/`spec` 子命令) 會發出沒有 `root`/`status` 的非封裝資料負載。