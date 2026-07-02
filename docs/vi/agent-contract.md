# Hợp đồng OpenSpec Agent

Các bề mặt có thể đọc bằng máy của CLI `openspec`, được xác minh dựa trên `src/` (kiểm toán capstone, 2026-06-11). Mọi hình dạng bên dưới đều được tài liệu hóa từ mã phát sinh.

## 1. Quy ước chung

- **Một tài liệu JSON cho mỗi lần gọi.** Trong chế độ `--json`, stdout chứa chính xác một tài liệu JSON (định dạng đẹp với 2 khoảng trắng). Văn xuôi của con người, spinner và banner lưu trữ được gửi đến stderr.
- **Banner lưu trữ.** Trong chế độ dành cho con người, một root do store chọn sẽ in `Using OpenSpec root: <id> (<path>)` ra stderr. Không bao giờ được in trong chế độ JSON.
- **Cách viết hoa của khóa phụ thuộc vào bề mặt** (xem Các điểm không nhất quán đã biết): các tải trọng store/doctor/context sử dụng `snake_case`; các tải trọng workflow (`status`, `instructions`, `new change`, `validate`, `list`) sử dụng `camelCase`, ngoại trừ đối tượng `root` được nhúng, vốn luôn sử dụng `store_id`.
- **Các khóa tùy chọn bị bỏ qua chứ không phải là null**, trong hầu hết các tải trọng (ví dụ: `root.store_id`, `member.path`). Các trường hợp ngoại lệ sử dụng `null` tường minh được nêu rõ theo từng hình dạng (doctor store `git.*`, tải trọng lỗi).

## 2. Vỏ bọc chẩn đoán

Một hình dạng vỏ bọc được chia sẻ bởi mọi chẩn đoán có thể đọc bằng máy (`StoreDiagnostic`):

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Các chẩn đoán xuất hiện ở hai vị trí: **mảng status** (`status: StoreDiagnostic[]` ở cấp cao nhất hoặc trên mỗi mục) để tìm thấy các vấn đề về sức khỏe, và **các lỗi được ném ra** được chuyển đổi thành một mảng `status` đơn phần khi lệnh thất bại.

## 3. Lựa chọn Root và `RootOutput`

Tất cả các lệnh giải quyết root (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) sẽ giải quyết một root OpenSpec với một độ ưu tiên:

1. `--store <id>` → root của store đã đăng ký (`source: "store"`).
2. Nếu không, thì ancestor gần nhất có `openspec/`: hình dạng lập kế hoạch → `source: "nearest"` (một con trỏ đến `store:` sẽ bị bỏ qua với cảnh báo stderr); thư mục chỉ cấu hình với một con trỏ `store:` hợp lệ → store đó, `source: "declared"`.
3. Không có root gần nhất + không có stores đã đăng ký → lỗi `no_root_with_registered_stores`.
4. Không có root, không có stores: các lệnh scaffolding coi cwd là `source: "implicit"`; các lệnh chẩn đoán (`doctor`, `context`) thất bại với `no_openspec_root` thay vào đó — chúng kiểm tra, không bao giờ tạo khung (scaffold).

Các tải trọng JSON thành công sẽ nhúng root:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "nearest" | "implicit", "store_id": "id (chỉ khi được chọn store)" }
```

**Hợp đồng lỗi gốc**: trong chế độ JSON, một sự cố thất bại giải quyết sẽ in `{ ...commandNullShape, "status": [diagnostic] }` ra stdout và thoát với mã 1.

## 4. Các hình dạng JSON của lệnh

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — lưu ý rằng `status` trên mỗi thay đổi là một enum chuỗi ở đây. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Change: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spec: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Thoát 1 khi bất kỳ mục nào thất bại.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"ready"|"blocked", missingDeps?} ], "root" }`. Không có thay đổi nào đang hoạt động: `{ "changes": [], "message", "root" }`, thoát 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "template", "dependencies": [{id,done,path,description}], "unlocks", "root" }`.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — các mục đã được giải quyết sẽ mang root/specs/fetch; các mục chưa được giải quyết sẽ mang store_id + trạng thái cảnh báo. Chỉ số bị giới hạn ở mức 50KB (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Thành công: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Thất bại: `{ "change": null, "status": [d] }`, thoát 1.

### 4.8 `archive <name> --json`
Thành công: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Thất bại: `{ "archive": null, "root"?, "status": [d] }`, thoát 1. Chế độ JSON hoàn toàn không tương tác: mọi điểm nhắc nhở đều trở thành một mã `archive_*`.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "status": [] } | null, "references": [...], "status": [] }`. Các tìm thấy về sức khỏe ở bất kỳ mức độ nào đều thoát 0. Tải trọng thất bại: `{ "root": null, "store": null, "references": [], "status": [d] }`, thoát 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. AVAILABLE = path hiện diện VÀ status trống. `--code-workspace <path>` ghi `{folders:[{name,path}]}` (chỉ các stores được tham chiếu, có tiền tố `ref:`); trong chế độ JSON, việc ghi chạy trước khi in nên stdout chứa chính xác một tài liệu ngay cả khi việc ghi thất bại. Thất bại: `{ "root": null, "members": [], "status": [d] }`, thoát 1.

### 4.11 `store ... --json`
setup/register: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. unregister/remove: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. list: `{ "stores": [{id, root}], "status": [] }`. doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = không rõ/chưa được kiểm tra). Các tìm thấy về sức khỏe thoát 0; các thất bại thoát 1 với hình dạng null tương ứng. Hủy bỏ nhắc nhở thoát 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: mảng trần `[ {name, description, artifacts, source} ]`. `templates`: đối tượng được đánh khóa `{ "<artifactId>": {path, source} }`. Cả hai đều dựa trên cwd, không có các khóa root/status.

## 5. Hợp đồng mã thoát (Exit-code contract)

| Tình huống | Mã thoát | Stdout |
|---|---|---|
| Thành công, bao gồm cả các tìm thấy về sức khỏe (doctor/context/store doctor) | 0 | tải trọng |
| Lệnh thất bại trong chế độ `--json` | 1 | một tài liệu JSON với `status: [d]` và hình dạng null của lệnh |
| `validate` với các mục bị lỗi | 1 | báo cáo đầy đủ |
| Hủy bỏ nhắc nhở (nhóm `store`, chế độ con người) | 130 | chỉ stderr |

## 6. Bảng mã Chẩn đoán (Diagnostic code catalog)

### Giải quyết định (Resolution)
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; truyền qua: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Sức khỏe OpenSpec-root (error, không có cách khắc phục)
`openspec_store_root_missing`, `openspec_root_missing`, `openspec_config_missing`, `openspec_specs_missing`, `openspec_changes_missing`, `openspec_archive_missing`, cộng với các biến thể `_not_directory`.

### Registry/identity/state của Store
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Setup/register/remove của Store
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (warning trong remove, error trong doctor), `store_root_not_directory`.

### Git của Store
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (warning), `store_clone_fragile_directories` (warning), `store_remote_divergence` (info, doctor).

### References (warning)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Relationships (warning; doctor; context chỉ giữ lại loại registry)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Archive (chế độ JSON)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Ghi Context
`context_file_exists`, `context_output_dir_missing`.

### Fallbacks (Phương án dự phòng)
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Các điểm không nhất quán đã biết

Được ghi lại bởi kiểm toán capstone; việc đổi tên khóa công khai là các quyết định sản phẩm được hoãn lại sau bản phát hành này:

1. ~~Trong chế độ `--json`, một số đường dẫn thất bại chỉ in ra stderr mà không có tài liệu JSON.~~ Đã được khắc phục trong vòng gauntlet capstone: `show`/`validate` emit `{status:[{code: unknown_item | ambiguous_item, ...}]}`; các lỗi được ném ra trong `status`/`instructions`/`list`/`show`/`validate` đi qua helper thất bại nhận biết JSON (hình dạng null của lệnh + `status`); `store <unknown subcommand> --json` emit `{status:[{code: unknown_store_subcommand}]}`; `list` mang hình dạng null `{changes|specs: [], root: null}` trên các lần thất bại giải quyết.
2. `store_root_missing` được phát ra với hai mức độ nghiêm trọng (warning trong remove, error trong store doctor) — phụ thuộc vào ngữ cảnh, đã được tài liệu hóa ở trên.
3. Cách viết hoa của khóa snake_case (gia đình store) so với camelCase (gia đình workflow); `root.store_id` là snake_case ở mọi nơi.
4. Bốn khai báo loại vỏ bọc song song tồn tại trong src; các chẩn đoán archive không bao giờ mang `target`.
5. `list --json` tái sử dụng khóa `status` như một enum chuỗi trên mỗi thay đổi.
6. Chỉ đầu ra của `validate` mới chứa trường `version`.
7. `schemas`/`templates` bỏ qua việc lựa chọn root (dựa trên cwd, không có `--store`).
8. Các dạng danh từ đã lỗi thời (`change`/`spec` subcommands) emit các tải trọng không được bọc mà không có `root`/`status`.