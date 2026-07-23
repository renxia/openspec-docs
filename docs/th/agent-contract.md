# OpenSpec Agent Contract

พื้นผิวที่อ่านได้โดยเครื่องของ CLI `openspec` ที่ได้รับการตรวจสอบความถูกต้องกับไดเรกทอรี `src/` (การตรวจสอบจุดสิ้นสุด (capstone audit), 11 มิถุนายน 2026) รูปแบบข้อมูลทั้งหมดด้านล่างถูกจัดทำเอกสารจากโค้ดที่ส่งผลลัพธ์ออกมา

## 1. ข้อกำหนดทั่วไป

- **เอกสาร JSON หนึ่งรายการต่อการเรียกใช้** เมื่ออยู่ในโหมด `--json` stdout จะส่งออกมาได้เพียงเอกสาร JSON หนึ่งรายการเท่านั้น (จัดรูปแบบด้วยการเว้นว่าง 2 ช่อง) ข้อความที่เป็นภาษามนุษย์ สปินเนอร์ และแบนเนอร์ของสโตร์จะถูกส่งออกไปที่ stderr
- **แบนเนอร์ของสโตร์** เมื่ออยู่ในโหมดสำหรับมนุษย์ รากของสโตร์ที่ถูกเลือกจะพิมพ์ข้อความ `Using OpenSpec root: <id> (<path>)` ไปที่ stderr ไม่เคยถูกพิมพ์ในโหมด JSON
- **รูปแบบตัวพิมพ์ของคีย์ขึ้นอยู่กับชนิดของพื้นผิว** (ดูส่วน Known inconsistencies): รูปแบบข้อมูลของสโตร์/doctor/context ใช้ `snake_case`; รูปแบบข้อมูลของเวิร์กโฟลว์ (`status`, `instructions`, `new change`, `validate`, `list`) ใช้ `camelCase` ยกเว้นออบเจกต์ `root` ที่ฝังอยู่ซึ่งจะใช้ `store_id` เสมอ
- **คีย์ที่เป็นตัวเลือกจะถูกตัดออก ไม่ใช่กำหนดค่าเป็น `null`** ในรูปแบบข้อมูลส่วนใหญ่ (เช่น `root.store_id`, `member.path`) ข้อยกเว้นที่ใช้ `null` อย่างชัดเจนจะถูกระบุไว้ในแต่ละรูปแบบข้อมูล (เช่น `git.*` ของคำสั่ง doctor ของสโตร์ รูปแบบข้อมูลของความล้มเหลว)

## 2. ซอง envelop การวินิจฉัย

รูปแบบซอง envelop หนึ่งรูปแบบใช้ร่วมกันสำหรับการวินิจฉัยที่อ่านได้ด้วยเครื่องทั้งหมด (`StoreDiagnostic`):

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

การวินิจฉัยปรากฏอยู่ในสองตำแหน่ง: **อาร์เรย์สถานะ** (`status: StoreDiagnostic[]` ที่ระดับบนสุดหรือต่อรายการ) สำหรับผลการตรวจสอบสุขภาพ และ **ข้อผิดพลาดที่ถูกโยนออก** ที่ถูกแปลงเป็นอาร์เรย์ `status` ที่มีสมาชิกเดียวเมื่อคำสั่งล้มเหลว

## 3. การเลือก root และ `RootOutput`

คำสั่งทั้งหมดที่แก้ไข root (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) จะแก้ไข OpenSpec root หนึ่งรายการด้วยลำดับความสำคัญหนึ่ง:

1. `--store <id>` → root ของ store ที่ลงทะเบียนแล้ว (`source: "store"`).
2. หากไม่พบ ให้ใช้บรรพบุรุษที่ใกล้ที่สุดที่มี `openspec/`: รูปแบบการวางแผน → `source: "nearest"` (pointer `store:` จะถูกเพิกเฉยพร้อมกับคำเตือน stderr); ไดเร็กทอรีที่มีเพียง config ที่มี pointer `store:` ที่ถูกต้อง → store นั้น `source: "declared"`.
3. ไม่มี root ที่ใกล้ที่สุด + ตั้งค่า `defaultStore` ระดับโลก (`openspec config set defaultStore <id>`) → store นั้น `source: "global_default"`; id ที่ล้าสมัยจะล้มเหลวพร้อมกับข้อผิดพลาดของ store และ `fix` ชื่อว่า `openspec config unset defaultStore`.
4. ไม่มี root ที่ใกล้ที่สุด ไม่มีค่าเริ่มต้น + มี store ที่ลงทะเบียนอยู่ → ข้อผิดพลาด `no_root_with_registered_stores`.
5. ไม่มี root ไม่มีค่าเริ่มต้น ไม่มี store: คำสั่ง scaffolding จะถือว่า cwd เป็น `source: "implicit"`; คำสั่งวินิจฉัย (`doctor`, `context`) จะล้มเหลวด้วย `no_openspec_root` แทน — พวกมันตรวจสอบ ไม่ได้สร้างโครงสร้าง scaffolding

JSON payload ที่สำเร็จจะฝัง root ไว้ข้างใน:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**สัญญาณ Root-failure**: ในโหมด JSON การแก้ไขที่ล้มเหลวจะพิมพ์ `{ ...commandNullShape, "status": [diagnostic] }` ไปยัง stdout และออกด้วยรหัส 1

## 4. รูปร่าง JSON ของคำสั่ง

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — โปรดทราบว่า `status` ต่อการเปลี่ยนแปลงเป็น string enum ที่นี่ `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
การเปลี่ยนแปลง: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spec: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. ออกด้วยรหัส 1 เมื่อรายการใดรายการหนึ่งล้มเหลว

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`. `requires` ของแต่ละ artifact เป็น id ของ dependencies โดยตรง (ปรากฏในทุกสถานะ ดังนั้นชุดของ dependencies ที่ต้องใช้ทั้งหมดจึงคำนวณได้แม้เมื่อ artifact เป็น `done`); `missingDeps` ปรากฏเฉพาะเมื่อเป็น `blocked`. `"skipped"` ทำเครื่องหมาย artifact ที่เส้นทาง `generates` อยู่ภายใต้ `specs/` ในการเปลี่ยนแปลงที่ `.openspec.yaml` ประกาศ `skip_specs: true`; มันตอบสนอง dependencies แต่ไม่ควรถูกสร้าง. ไม่มีการเปลี่ยนแปลงที่ใช้งานอยู่: `{ "changes": [], "message", "root" }`, ออกด้วยรหัส 0

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`. `"skipped": true` (พร้อมกับ `"warning"`) ปรากฏเมื่อการเปลี่ยนแปลงประกาศ `skip_specs: true` และ artifact นี้ถูกข้าม — อย่าสร้างไฟล์ของมัน. รายการ dependency ที่มี `skipped: true` ถูกตอบสนองโดยไม่มีไฟล์ — อย่าพยายามอ่านเส้นทางของมัน

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — รายการที่แก้ไขแล้ว carries root/specs/fetch; รายการที่ยังไม่แก้ไข carries store_id + สถานะคำเตือน. ดัชนีจำกัดที่ 50KB (`reference_index_truncated`)

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
สำเร็จ: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. ล้มเหลว: `{ "change": null, "status": [d] }`, ออกด้วยรหัส 1

### 4.8 `archive <name> --json`
สำเร็จ: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. ล้มเหลว: `{ "archive": null, "root"?, "status": [d] }`, ออกด้วยรหัส 1. โหมด JSON ไม่ได้โต้ตอบอย่างเด็ดขาด: จุดแจ้งเตือนทุกจุดกลายเป็นรหัส `archive_*`

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`. `drift` (ปรากฏเฉพาะสำหรับ store checkout ที่ใช้ git และมี upstream tracking ref) เป็นจำนวน ahead/behind เทียบกับ upstream ที่ดึงล่าสุด ไม่ใช่ remote ที่ใช้งานจริง. ผลการตรวจสอบสุขภาพของความรุนแรงใดๆ ออกด้วยรหัส 0. Payload เมื่อล้มเหลว: `{ "root": null, "store": null, "references": [], "status": [d] }`, ออกด้วยรหัส 1

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. AVAILABLE = มี path และสถานะว่าง. `--code-workspace <path>` เขียน `{folders:[{name,path}]}` (เฉพาะ referenced stores ที่มีอยู่เท่านั้น พร้อมคำนำหน้า `ref:`); ในโหมด JSON การเขียนทำงานก่อนการพิมพ์ ดังนั้น stdout จะมีเอกสารเพียงหนึ่งฉบับแม้เมื่อการเขียนล้มเหลว. ล้มเหลว: `{ "root": null, "members": [], "status": [d] }`, ออกด้วยรหัส 1

### 4.11 `store ... --json`
setup/register: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. unregister/remove: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. list: `{ "stores": [{id, root}], "status": [] }`. doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = unknown/not probed). ผลการตรวจสอบสุขภาพออกด้วยรหัส 0; ความล้มเหลวออกด้วยรหัส 1 ร่วมกับ null-shape ที่ตรงกัน. การยกเลิก prompt ออกด้วยรหัส 130

### 4.12 `schemas --json` / `templates --json`
`schemas`: อาร์เรย์เปล่า `[ {name, description, artifacts, source} ]`. `templates`: ออบเจ็กต์ที่มีคีย์ `{ "<artifactId>": {path, source} }`. ทั้งสองอิงจาก cwd ไม่มีคีย์ root/status

## 5. สัญญาณรหัสออก

| สถานการณ์ | รหัสออก | Stdout |
|---|---|---|
| สำเร็จ รวมถึงผลการตรวจสอบสุขภาพ (doctor/context/store doctor) | 0 | the payload |
| ความล้มเหลวของคำสั่งในโหมด `--json` | 1 | เอกสาร JSON หนึ่งฉบับที่มี `status: [d]` และ null-shape ของคำสั่ง |
| `validate` ที่มีรายการล้มเหลว | 1 | รายงานเต็ม |
| การยกเลิก prompt (กลุ่ม `store` โหมดมนุษย์) | 130 | stderr เท่านั้น |

## 6. แคตตาล็อกรหัสการวินิจฉัย

### การแก้ไข
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; ผ่านตรงๆ: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`

### สุขภาพของ OpenSpec-root (ข้อผิดพลาด ไม่มีการแก้ไข)
`openspec_store_root_missing`, `openspec_store_root_not_directory`, `openspec_root_missing`, `openspec_root_not_directory`, `openspec_config_missing`, `openspec_config_not_file`, `openspec_specs_not_directory`, `openspec_changes_not_directory`, `openspec_archive_not_directory`. ในระหว่างช่วง beta ของ stores `openspec/specs/`, `openspec/changes/`, และ `openspec/changes/archive/` อาจขาดหายใน root ที่ปกติ; พวกมันเป็นข้อผิดพลาดสุขภาพก็ต่อเมื่อมีอยู่แต่ไม่ใช่ไดเร็กทอรี

### รีจิสทรี/เอกลักษณ์/สถานะของ Store
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info)

### การตั้งค่า/ลงทะเบียน/ลบของ Store
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_root_pointer_declared`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (warning in remove, error in doctor), `store_root_not_directory`

### Git ของ Store
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (warning), `store_clone_fragile_directories` (warning), `store_remote_divergence` (info, doctor), `store_checkout_drift` (info, doctor)

### ข้อมูลอ้างอิง (คำเตือน)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`

### ความสัมพันธ์ (คำเตือน; doctor; context เก็บเฉพาะรายการรีจิสทรี)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`

### Archive (โหมด JSON)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`

### การเขียนของ Context
`context_file_exists`, `context_output_dir_missing`

### การสำรอง
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`

## ความไม่สอดคล้องที่ทราบ

บันทึกโดยการตรวจสอบ capstone; การเปลี่ยนชื่อคีย์ที่เผยแพร่เป็นคำตัดสินใจของผลิตภัณฑ์ที่เลื่อนออกไปหลังจากการเปิดตัวนี้:

1. ~~ในโหมด `--json` เส้นทางความล้มเหลวหลายเส้นทางพิมพ์ stderr เท่านั้นโดยไม่มีเอกสาร JSON~~ แก้ไขในรอบ capstone gauntlet: `show`/`validate` รายการที่ไม่รู้จักและไม่ชัดเจนส่งออก `{status:[{code: unknown_item | ambiguous_item, ...}]}`; ข้อผิดพลาดที่ถูกโยนออกใน `status`/`instructions`/`list`/`show`/`validate` ผ่านตัวช่วยจัดการความล้มเหลวที่รู้จัก JSON (null-shape ของคำสั่ง + `status`); `store <unknown subcommand> --json` ส่งออก `{status:[{code: unknown_store_subcommand}]}`; `list` นำ null-shape `{changes|specs: [], root: null}` ไปด้วยเมื่อเกิดความล้มเหลวในการแก้ไข
2. `store_root_missing` ถูกส่งออกด้วยความรุนแรงสองระดับ (คำเตือนในการลบ ข้อผิดพลาดในการตรวจสอบ store) — ขึ้นอยู่กับบริบท ได้บันทึกไว้ด้านบน
3. snake_case (ครอบครัว store) vs camelCase (ครอบครัว workflow) การพิมพ์คีย์; `root.store_id` เป็น snake_case ทุกที่
4. มีการประกาศประเภทซอง envelop จำนวนสี่ที่อยู่ใน src; การวินิจฉัย archive ไม่เคยมี `target`
5. `list --json` ใช้คีย์ `status` ซ้ำเป็น string enum ต่อการเปลี่ยนแปลง
6. เฉพาะเอาต์พุตของ `validate` เท่านั้นที่มีฟิลด์ `version`
7. `schemas`/`templates` เพิกเฉยการเลือก root (อิงจาก cwd ไม่มี `--store`)
8. รูปแบบคำนามที่เลิกใช้แล้ว (คำสั่งย่อย `change`/`spec`) ส่งออก payload ที่ไม่มีซอง envelop โดยไม่มี `root`/`status`