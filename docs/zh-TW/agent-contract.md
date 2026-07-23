# OpenSpec Agent 合約

`openspec` CLI 的可機器讀取介面，已對照 `src/` 進行驗證（capstone 稽核，2026-06-11）。以下所有結構的說明均直接對應發出這些資料的程式碼。

## 1. 通用慣例

- **每次呼叫僅輸出單一 JSON 文件**。在 `--json` 模式下，stdout 僅包含一份經過 2 空格縮排美化的 JSON 文件；人類可讀文字、進度動畫以及商店橫幅則輸出至 stderr。
- **商店橫幅**。在人類可讀模式下，若已選取商店根目錄，會將 `Using OpenSpec root: <id> (<path>)` 輸出至 stderr；JSON 模式下絕不會印出此橫幅。
- **鍵名大小寫取決於對應介面**（詳見「已知不一致之處」）：store/doctor/context 承載內容使用 `snake_case`；工作流程承載內容（`status`、`instructions`、`new change`、`validate`、`list`）使用 `camelCase`，但內嵌的 `root` 物件例外，其鍵名一律為 `store_id`。
- **大部分承載內容中，可選鍵會直接被省略，不會設為 null**（例如 `root.store_id`、`member.path`）。會明確使用 `null` 的例外情況會在各結構說明中標註（例如 store doctor 的 `git.*`、失敗承載內容）。

## 2. 診斷結構外觀

所有機器可讀的診斷（`StoreDiagnostic`）都共用同一種結構外觀：

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

診斷結果會出現在兩個位置：用於健康檢查結果的**狀態陣列**（頂層或各條目下的 `status: StoreDiagnostic[]`），以及指令執行失敗時轉換為單元素 `status` 陣列的**拋出錯誤**。

## 3. 根目錄選擇與 `RootOutput`

所有需要解析根目錄的指令（`list`、`show`、`validate`、`status`、`instructions`、`instructions apply`、`new change`、`archive`、`doctor`、`context`）都會依照單一優先順序解析出一個 OpenSpec 根目錄：
1. 指定 `--store <id>` → 使用已註冊存儲的根目錄（`source: "store"`）。
2. 否則，查找最近上層包含 `openspec/` 目錄的節點：若為規劃形狀 → `source: "nearest"`（此時 `store:` 指標會被忽略，並於標準錯誤輸出警告）；若為僅包含配置的目錄且帶有有效的 `store:` 指標 → 使用該存儲，`source: "declared"`。
3. 無最近根目錄且已設定全域預設存儲（透過 `openspec config set defaultStore <id>`）→ 使用該存儲，`source: "global_default"`；若 id 已失效則會拋出底層存儲錯誤，並附帶修復建議 `openspec config unset defaultStore`。
4. 無最近根目錄、無全域預設且存在已註冊存儲 → 觸發錯誤 `no_root_with_registered_stores`。
5. 無根目錄、無全域預設、無已註冊存儲：scaffolding 指令會將當前工作目錄視為 `source: "implicit"`；而診斷指令（`doctor`、`context`）則會觸發 `no_openspec_root` 錯誤——這類指令僅執行檢查，不會建立 scaffolding。

執行成功的 JSON 承載內容會內嵌根目錄資訊：
```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**根目錄解析失敗約定**：在 JSON 模式下，若解析失敗，會於標準輸出打印 `{ ...commandNullShape, "status": [diagnostic] }` 並以退出碼 1 結束。

## 4. 指令 JSON 結構

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }`——請注意此處每個變更的 `status` 是字串列舉。加上 `--specs` 參數時輸出結構為：`{ "specs": [ { "id", "requirementCount" } ], "root" }`。

### 4.2 `show <item> --json`
變更項：`{ "id", "title", "deltaCount", "deltas": [...], "root" }`。規範項：`{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`。

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`。若任一項目驗證失敗則退出碼為 1。

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`。每個構件的 `requires` 欄位是其直接依賴的 id 列表（所有狀態下都會存在此欄位，因此即使構件狀態為 `done`，也可計算其傳遞依賴集合）；`missingDeps` 僅在狀態為 `blocked` 時出現。`"skipped"` 狀態標記的是：變更的 `.openspec.yaml` 中宣告了 `skip_specs: true`，且該構件的 `generates` 路徑位於 `specs/` 目錄下——這類構件已滿足依賴條件，但不得建立。無進行中變更時輸出結構為：`{ "changes": [], "message", "root" }`，退出碼為 0。

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`。當變更宣告了 `skip_specs: true` 且當前構件被跳過時，會出現 `"skipped": true`（同時帶有 `"warning"` 欄位）——此時不得建立該構件的檔案。若依賴條目的 `skipped` 為 `true`，則表示該依賴已滿足、無需對應檔案——此時不得嘗試讀取其路徑。
`ReferenceIndexEntry`（參考索引條目）：`{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }`——已解析的條目會包含 root/specs/fetch 欄位；未解析的條目僅包含 store_id 和警告狀態的 status 欄位。索引大小上限為 50KB，超出時會觸發 `reference_index_truncated` 診斷。

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`。

### 4.7 `new change <name> --json`
執行成功：`{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`。執行失敗：`{ "change": null, "status": [d] }`，退出碼為 1。

### 4.8 `archive <name> --json`
執行成功：`{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`。執行失敗：`{ "archive": null, "root"?, "status": [d] }`，退出碼為 1。JSON 模式為嚴格非互動模式：所有提示點都會轉換為對應的 `archive_*` 診斷碼。

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`。`drift` 欄位僅在基於 git 的存儲检出（checkout）具有上游追蹤引用時出現，其值為與最後一次取樣的上遊的落後/超前提交數，而非與實時遠端倉庫的對比。任何嚴重程度的健康檢查結果均以退出碼 0 結束。執行失敗的承載內容為：`{ "root": null, "store": null, "references": [], "status": [d] }`，退出碼為 1。

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`。AVAILABLE = 路徑存在 且 status 為空。加上 `--code-workspace <path>` 參數時會寫入 `{folders:[{name,path}]}`（僅包含可用的參考存儲，路徑帶 `ref:` 前綴）；在 JSON 模式下，寫入操作會在打印前執行，因此即使寫入失敗，標準輸出也僅會輸出一個文件。執行失敗的承載內容為：`{ "root": null, "members": [], "status": [d] }`，退出碼為 1。

### 4.11 `store ... --json`
setup/register（設定/註冊）：`{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`。unregister/remove（註銷/移除）：`{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`。list（列出）：`{ "stores": [{id, root}], "status": [] }`。doctor（檢查）：`{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }`（`null` 代表未知/未探測）。健康檢查結果以退出碼 0 結束；執行失敗則以對應的 null 結構輸出內容，退出碼為 1。提示取消時退出碼為 130。

### 4.12 `schemas --json` / `templates --json`
`schemas`（結構描述）：純陣列 `[ {name, description, artifacts, source} ]`。`templates`（範本）：鍵值對物件 `{ "<artifactId>": {path, source} }`。兩者皆基於當前工作目錄，不包含 root/status 鍵。

## 5. 退出碼約定

| 情境 | 退出碼 | 標準輸出 |
|---|---|---|
| 執行成功，包含健康檢查結果（doctor/context/store doctor） | 0 | 對應的承載內容 |
| `--json` 模式下指令執行失敗 | 1 | 包含 `status: [d]` 和指令 null 結構的單個 JSON 文件 |
| `validate` 指令存在未通過的驗證項目 | 1 | 完整報告 |
| 提示取消（`store` 指令群，人工模式） | 130 | 僅標準錯誤輸出 |

## 6. 診斷碼目錄

### 解析類
`no_openspec_root`、`no_root_with_registered_stores`、`no_registered_stores`、`unknown_store`、`store_identity_mismatch`、`unhealthy_store_root`、`store_path_not_supported`、`invalid_store_pointer`、`initiative_option_removed`、`areas_option_removed`；透傳類：`invalid_store_id`、`invalid_store_registry`、`invalid_store_metadata`。

### OpenSpec 根目錄健康檢查（錯誤，無修復方案）
`openspec_store_root_missing`、`openspec_store_root_not_directory`、`openspec_root_missing`、`openspec_root_not_directory`、`openspec_config_missing`、`openspec_config_not_file`、`openspec_specs_not_directory`、`openspec_changes_not_directory`、`openspec_archive_not_directory`。在存儲功能測試期間，健康的根目錄中可以不存在 `openspec/specs/`、`openspec/changes/` 和 `openspec/changes/archive/` 目錄；僅當這些目錄存在但並非資料夾時，才會被判定為健康錯誤。

### 存儲註冊表/身份/狀態
`invalid_store_id`、`invalid_store_registry`、`invalid_store_metadata`、`store_registry_busy`、`store_not_found`、`no_store_registry`、`store_registry_changed`、`store_metadata_missing`、`store_metadata_id_mismatch`、`store_metadata_invalid`、`store_id_conflict`、`store_path_conflict`、`store_already_registered`（資訊級）。

### 存儲設定/註冊/移除
`store_setup_id_required`、`store_setup_path_required`、`store_setup_path_not_directory`、`store_setup_inside_git_repo`、`store_setup_non_empty_directory`、`store_setup_cancelled`、`store_path_required`、`store_path_missing`、`store_path_not_directory`、`store_root_pointer_declared`、`store_register_root_unhealthy`、`store_register_identity_confirmation_required`、`store_register_cancelled`、`store_remote_empty`、`store_remote_requires_hand_edit`、`store_remove_confirmation_required`、`store_remove_cancelled`、`store_remove_path_not_directory`、`store_remove_metadata_missing`、`store_root_missing`（移除時為警告級，doctor 檢查時為錯誤級）、`store_root_not_directory`。

### 存儲 Git 相關
`store_git_init_failed`、`store_git_identity_missing`、`store_git_commit_failed`、`store_git_no_commits`（警告級）、`store_clone_fragile_directories`（警告級）、`store_remote_divergence`（資訊級，doctor 檢查時觸發）、`store_checkout_drift`（資訊級，doctor 檢查時觸發）。

### 參考項（警告級）
`reference_invalid_id`、`reference_registry_unreadable`、`reference_unresolved`、`reference_root_unhealthy`、`reference_index_truncated`。

### 關聯關係（警告級；doctor 檢查時觸發；context 僅保留註冊表類型的關聯）
`relationship_registry_unreadable`、`root_pointer_ignored`、`root_pointer_invalid`、`pointer_declarations_inert`。

### 歸檔（JSON 模式）
`archive_change_name_required`、`archive_change_not_found`、`archive_validation_failed`、`archive_confirmation_required`、`archive_tasks_incomplete`、`archive_spec_update_failed`、`archive_spec_validation_failed`、`archive_target_exists`、`archive_error`。

### Context 寫入
`context_file_exists`、`context_output_dir_missing`。

### 後備類
`doctor_failed`、`context_failed`、`store_error`、`change_error`、`archive_error`。

## 已知不一致問題

由 capstone 審計記錄；已發佈版本的金鑰重新命名屬於產品決策，將在本版本後續再行處理：
1. ~~在 `--json` 模式下，部分失敗路徑僅輸出標準錯誤，無對應 JSON 文件。~~ 已在 capstone 考驗回合修復：`show`/`validate` 遇到未知或模糊條目時會輸出 `{status:[{code: unknown_item | ambiguous_item, ...}]}`；`status`/`instructions`/`list`/`show`/`validate` 的拋出錯誤會透過 JSON 感知的失敗輔助工具處理（輸出指令的 null 結構 + `status` 欄位）；`store <unknown subcommand> --json` 會輸出 `{status:[{code: unknown_store_subcommand}]}`；`list` 在解析失敗時會攜帶其 `{changes|specs: [], root: null}` null 結構。
2. `store_root_missing` 會以兩種嚴重程度觸發（移除時為警告級，存儲 doctor 檢查時為錯誤級）——具體表現取決於上下文，已在上文說明。
3. 鍵的大小寫規則：存儲相關指令家族使用 snake_case，工作流程相關指令家族使用 camelCase；`root.store_id` 在所有場景下均為 snake_case。
4. 原始碼中存在四種並行的結構外觀類型宣告；歸檔類診斷永遠不會攜帶 `target` 欄位。
5. `list --json` 的輸出中，每個變更的 `status` 鍵被複用為字串列舉類型。
6. 僅 `validate` 指令的輸出包含 `version` 欄位。
7. `schemas`/`templates` 指令會忽略根目錄選擇規則（基於當前工作目錄，不支援 `--store` 參數）。
8. 已棄用的名詞形式子指令（`change`/`spec`）輸出的承載內容不包含結構外觀，無 `root`/`status` 欄位。