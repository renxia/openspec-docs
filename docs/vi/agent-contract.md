# Hợp đồng Tác nhân OpenSpec

Các giao diện có thể đọc được bằng máy của CLI `openspec`, đã được xác minh đối với thư mục `src/` (capstone audit, 2026-06-11). Mọi cấu trúc dữ liệu dưới đây đều được tài liệu hóa dựa trên mã phát ra.

## 1. Các quy ước chung

- **Một tài liệu JSON mỗi lần gọi.** Ở chế độ `--json`, stdout truyền chính xác một tài liệu JSON (định dạng đẹp với khoảng cách 2 dấu cách). Văn bản dành cho người dùng, hiệu ứng quay tải và biểu ngữ cửa hàng được gửi đến stderr.
- **Biểu ngữ cửa hàng.** Ở chế độ dành cho người dùng, gốc được cửa hàng lựa chọn sẽ in dòng `Using OpenSpec root: <id> (<path>)` đến stderr. Không bao giờ được in ở chế độ JSON.
- **Kiểu chữ của khóa phụ thuộc vào giao diện tương ứng** (xem phần Các không nhất quán đã biết): các payload của cửa hàng/lệnh doctor/ngữ cảnh sử dụng `snake_case`; các payload của quy trình (`status`, `instructions`, `new change`, `validate`, `list`) sử dụng `camelCase`, ngoại trừ đối tượng `root` nhúng, luôn sử dụng khóa `store_id`.
- **Các khóa tùy chọn bị bỏ đi thay vì đặt thành null** ở hầu hết các payload (ví dụ: `root.store_id`, `member.path`). Các ngoại lệ sử dụng giá trị `null` rõ ràng được ghi rõ theo từng cấu trúc dữ liệu (các payload `git.*` của lệnh doctor cửa hàng, các payload lỗi).

## 2. Phong bì chẩn đoán

Mọi chẩn đoán có thể đọc được bằng máy (`StoreDiagnostic`) đều chia sẻ cùng một cấu trúc phong bì:

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Các chẩn đoán xuất hiện ở hai vị trí: **mảng trạng thái** (`status: StoreDiagnostic[]` ở cấp cao nhất hoặc trên mỗi mục) dùng cho các kết quả kiểm tra sức khỏe, và **lỗi được ném ra** được chuyển đổi thành mảng `status` chỉ có một phần tử khi lệnh thất bại.

## 3. Lựa chọn gốc và `RootOutput`

Tất cả các lệnh giải quyết gốc (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) sẽ giải quyết một gốc OpenSpec theo thứ tự ưu tiên sau:

1. `--store <id>` → gốc của kho đã đăng ký (`source: "store"`).
2. Nếu không, tổ tiên gần nhất có thư mục `openspec/` theo cấu trúc kế hoạch → `source: "nearest"` (con trỏ `store:` sẽ bị bỏ qua kèm cảnh báo trên stderr); thư mục chỉ chứa cấu hình có con trỏ `store:` hợp lệ → kho đó, `source: "declared"`.
3. Không có gốc gần nhất + `defaultStore` toàn cục đã được đặt (`openspec config set defaultStore <id>`) → kho đó, `source: "global_default"`; id hết hạn sẽ thất bại với lỗi kho cơ bản và một `fix` có tên `openspec config unset defaultStore`.
4. Không có gốc gần nhất, không có mặc định + các kho đã đăng ký tồn tại → lỗi `no_root_with_registered_stores`.
5. Không có gốc, không có mặc định, không có kho: các lệnh tạo khung sẽ coi thư mục làm việc hiện tại là `source: "implicit"`; các lệnh chẩn đoán (`doctor`, `context`) sẽ thất bại với lỗi `no_openspec_root` thay vào đó — chúng chỉ kiểm tra, không bao giờ tạo khung.

Các tải trọng JSON thành công sẽ nhúng gốc:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Hợp đồng thất bại giải quyết gốc**: ở chế độ JSON, lỗi giải quyết sẽ in `{ ...commandNullShape, "status": [diagnostic] }` ra stdout và thoát với mã 1.

## 4. Các cấu trúc JSON của lệnh

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — lưu ý `status` trên mỗi thay đổi ở đây là kiểu liệt kê chuỗi. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Thay đổi: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Đặc tả: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Thoát với mã 1 khi bất kỳ mục nào thất bại.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`. Trường `requires` của mỗi tác phẩm là các id phụ thuộc trực tiếp của nó (có mặt ở mọi trạng thái, nên tập phụ thuộc bắc cầu có thể được tính ngay cả khi tác phẩm ở trạng thái `done`); `missingDeps` chỉ xuất hiện khi ở trạng thái `blocked`. Giá trị `"skipped"` đánh dấu một tác phẩm có đường dẫn `generates` nằm trong thư mục `specs/` của một thay đổi mà tệp `.openspec.yaml` khai báo `skip_specs: true`; nó thỏa mãn các phụ thuộc nhưng không được phép tạo. Không có thay đổi nào đang hoạt động: `{ "changes": [], "message", "root" }`, thoát với mã 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`. Giá trị `"skipped": true` (kèm `"warning"`) xuất hiện khi thay đổi khai báo `skip_specs: true` và tác phẩm này bị bỏ qua — không được tạo các tệp của nó. Mục phụ thuộc có `skipped: true` được thỏa mãn mà không cần tệp — không cố đọc các đường dẫn của nó.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — các mục đã giải quyết mang theo root/specs/fetch; các mục chưa giải quyết mang store_id + trạng thái cảnh báo. Chỉ mục bị giới hạn ở 50KB (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Thành công: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Thất bại: `{ "change": null, "status": [d] }`, thoát với mã 1.

### 4.8 `archive <name> --json`
Thành công: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Thất bại: `{ "archive": null, "root"?, "status": [d] }`, thoát với mã 1. Chế độ JSON hoàn toàn không tương tác: mọi điểm nhắc lệnh đều trở thành mã `archive_*`.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`. Trường `drift` (chỉ có ở kho được kiểm tra dựa trên git có tham chiếu theo dõi thượng nguồn) là số lượng commit đứng trước/đứng sau so với thượng nguồn được lấy lần cuối, không phải so với máy chủ từ xa trực tiếp. Các kết quả kiểm tra sức khỏe với mọi mức độ đều thoát với mã 0. Tải trọng thất bại: `{ "root": null, "store": null, "references": [], "status": [d] }`, thoát với mã 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. KHẢ DỤNG = đường dẫn tồn tại VÀ trạng thái rỗng. `--code-workspace <path>` ghi `{folders:[{name,path}]}` (chỉ các kho được tham chiếu khả dụng, có tiền tố `ref:`); ở chế độ JSON, thao tác ghi chạy trước khi in nên stdout chỉ chứa đúng một tài liệu ngay cả khi ghi thất bại. Thất bại: `{ "root": null, "members": [], "status": [d] }`, thoát với mã 1.

### 4.11 `store ... --json`
thiết lập/đăng ký: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. hủy đăng ký/xóa: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. liệt kê: `{ "stores": [{id, root}], "status": [] }`. kiểm tra sức khỏe: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = không xác định/không được kiểm tra). Các kết quả kiểm tra sức khỏe thoát với mã 0; lỗi thoát với mã 1 kèm cấu trúc rỗng tương ứng. Hủy nhắc lệnh thoát với mã 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: mảng thô `[ {name, description, artifacts, source} ]`. `templates`: đối tượng có khóa `{ "<artifactId>": {path, source} }`. Cả hai đều dựa trên thư mục làm việc hiện tại, không có khóa root/status.

## 5. Hợp đồng mã thoát

| Tình huống | Thoát | Stdout |
|---|---|---|
| Thành công, bao gồm cả kết quả kiểm tra sức khỏe (doctor/context/store doctor) | 0 | tải trọng |
| Lỗi lệnh ở chế độ `--json` | 1 | một tài liệu JSON có `status: [d]` và cấu trúc rỗng của lệnh |
| `validate` có mục thất bại | 1 | báo cáo đầy đủ |
| Hủy nhắc lệnh (nhóm `store`, chế độ người dùng) | 130 | chỉ stderr |

## 6. Danh mục mã chẩn đoán

### Giải quyết
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; được chuyển tiếp: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Sức khỏe gốc OpenSpec (lỗi, không có sửa chữa)
`openspec_store_root_missing`, `openspec_store_root_not_directory`, `openspec_root_missing`, `openspec_root_not_directory`, `openspec_config_missing`, `openspec_config_not_file`, `openspec_specs_not_directory`, `openspec_changes_not_directory`, `openspec_archive_not_directory`. Trong giai đoạn thử nghiệm kho, `openspec/specs/`, `openspec/changes/`, và `openspec/changes/archive/` có thể không tồn tại ở gốc khỏe mạnh; chúng chỉ là lỗi sức khỏe khi tồn tại nhưng không phải là thư mục.

### Đăng ký/định danh/trạng thái kho
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Thiết lập/đăng ký/xóa kho
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_root_pointer_declared`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (cảnh báo khi xóa, lỗi khi kiểm tra sức khỏe), `store_root_not_directory`.

### Git của kho
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (warning), `store_clone_fragile_directories` (warning), `store_remote_divergence` (info, doctor), `store_checkout_drift` (info, doctor).

### Tham chiếu (cảnh báo)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Quan hệ (cảnh báo; kiểm tra sức khỏe; context chỉ giữ cái thuộc đăng ký)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Lưu trữ (chế độ JSON)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Ghi dữ liệu context
`context_file_exists`, `context_output_dir_missing`.

### Dự phòng
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Các không nhất quán đã biết

Được ghi nhận bởi đợt kiểm toán capstone; các đổi tên khóa xuất bản là quyết định sản phẩm được hoãn lại sau bản phát hành này:

1. ~~Ở chế độ `--json`, một số đường lỗi chỉ in ra stderr mà không có tài liệu JSON.~~ Đã sửa ở vòng kiểm tra capstone gauntlet: `show`/`validate` các mục không xác định và mơ hồ phát ra `{status:[{code: unknown_item | ambiguous_item, ...}]}`; các lỗi được ném ra trong `status`/`instructions`/`list`/`show`/`validate` đi qua trình trợ giúp lỗi nhận biết JSON (cấu trúc rỗng của lệnh + `status`); `store <unknown subcommand> --json` phát ra `{status:[{code: unknown_store_subcommand}]}`; `list` mang theo cấu trúc rỗng `{changes|specs: [], root: null}` khi giải quyết thất bại.
2. `store_root_missing` được phát ra với hai mức độ nghiêm trọng (cảnh báo khi xóa, lỗi khi kiểm tra sức khỏe kho) — phụ thuộc ngữ cảnh, đã được ghi nhận ở trên.
3. kiểu chữ thường với dấu gạch dưới (nhóm kho) so với kiểu chữ thường đầu dấu gạch thường (nhóm quy trình làm việc) cho các khóa; `root.store_id` luôn dùng kiểu chữ thường với dấu gạch dưới.
4. Có bốn khai báo loại phong bì song song tồn tại trong src; các chẩn đoán lưu trữ không bao giờ mang theo `target`.
5. `list --json` tái sử dụng khóa `status` dưới dạng liệt kê chuỗi trên mỗi thay đổi.
6. Chỉ đầu ra của `validate` có trường `version`.
7. `schemas`/`templates` bỏ qua lựa chọn gốc (dựa trên thư mục làm việc hiện tại, không có `--store`).
8. Các dạng danh từ đã lỗi thời (lệnh con `change`/`spec`) phát ra tải trọng không có phong bì mà không có `root`/`status`.