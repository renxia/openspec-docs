# สัญญาของ OpenSpec Agent

พื้นผิวที่สามารถอ่านได้ด้วยเครื่องจักร (Machine-readable surfaces) ของ CLI `openspec` ซึ่งได้รับการตรวจสอบเทียบกับ `src/` (การตรวจสอบ Capstone, 2026-06-11) รูปแบบทั้งหมดด้านล่างนี้ถูกบันทึกไว้จากโค้ดที่ส่งออก

## 1. ข้อตกลงทั่วไป (General conventions)

- **เอกสาร JSON หนึ่งฉบับต่อการเรียกใช้.** ในโหมด `--json` stdout จะบรรจุเอกสาร JSON เพียงหนึ่งฉบับ (จัดรูปแบบแบบ 2 ช่องว่าง). ข้อความที่เป็นภาษาคน (Human prose), สปินเนอร์ (spinners), และแบนเนอร์ของที่เก็บข้อมูล (store banner) จะถูกส่งไปยัง stderr.
- **Store banner.** ในโหมดสำหรับมนุษย์ (human mode) ที่เก็บข้อมูลจะแสดง `Using OpenSpec root: <id> (<path>)` ไปยัง stderr. จะไม่ปรากฏในโหมด JSON.
- **การกำหนดรูปแบบตัวพิมพ์ของคีย์ขึ้นอยู่กับพื้นผิว** (ดู Known inconsistencies): เพย์โหลดของ store/doctor/context ใช้ `snake_case`; เพย์โหลดของ workflow (`status`, `instructions`, `new change`, `validate`, `list`) ใช้ `camelCase` ยกเว้นออบเจกต์ `root` ที่ฝังอยู่ ซึ่งจะใช้ `store_id` เสมอ.
- **คีย์ที่เป็นทางเลือก (Optional keys) จะถูกละไว้ ไม่ใช่เป็น null** ในเพย์โหลดส่วนใหญ่ (เช่น `root.store_id`, `member.path`). ข้อยกเว้นที่ใช้ `null` อย่างชัดเจนจะระบุไว้สำหรับแต่ละรูปแบบ (store doctor `git.*`, failure payloads).

## 2. Diagnostic envelope

หนึ่งรูปแบบของ envelope ถูกใช้งานร่วมกันโดยทุกการวินิจฉัยที่สามารถอ่านได้ด้วยเครื่องจักร (`StoreDiagnostic`):

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

การวินิจฉัยจะปรากฏในสองตำแหน่ง: **อาร์เรย์สถานะ** (`status: StoreDiagnostic[]` ที่ระดับบนสุดหรือต่อรายการ) สำหรับสิ่งที่ค้นพบด้านสุขภาพ และ **ข้อผิดพลาดที่ถูกโยนออก** ซึ่งถูกแปลงเป็นอาร์เรย์ `status` แบบองค์ประกอบเดียวเมื่อคำสั่งล้มเหลว.

## 3. การเลือก Root และ `RootOutput`

คำสั่งทั้งหมดที่เกี่ยวข้องกับการแก้ไข root (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) จะทำการแก้ไข OpenSpec root หนึ่งอันด้วยลำดับความสำคัญดังนี้:

1. `--store <id>` → root ของ store ที่ลงทะเบียนไว้ (`source: "store"`).
2. มิฉะนั้น ให้เลือก ancestor ที่ใกล้ที่สุดที่มี `openspec/`: รูปแบบการวางแผน (planning shape) → `source: "nearest"` (pointer ของ `store:` จะถูกละเลยพร้อมคำเตือนใน stderr); ไดเรกทอรีที่กำหนดค่าเท่านั้น (config-only dir) ที่มี pointer `store:` ที่ถูกต้อง → store นั้น, `source: "declared"`.
3. ไม่มี root ที่ใกล้ที่สุดและไม่มี stores ที่ลงทะเบียนไว้ → ข้อผิดพลาด `no_root_with_registered_stores`.
4. ไม่มี root และไม่มี stores: คำสั่ง scaffolding จะถือว่า cwd (current working directory) เป็น `source: "implicit"`; คำสั่งวินิจฉัย (`doctor`, `context`) จะล้มเหลวด้วย `no_openspec_root` แทน — พวกมันจะตรวจสอบ ไม่ใช่ทำการสร้างโครงร่าง (scaffold).

เพย์โหลด JSON ที่สำเร็จจะฝัง root ไว้:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**สัญญาการล้มเหลวของ Root**: ในโหมด JSON การล้มเหลวในการแก้ไขจะแสดง `{ ...commandNullShape, "status": [diagnostic] }` บน stdout และออกสถานะ 1.

## 4. รูปแบบ JSON ของคำสั่ง (Command JSON shapes)

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — โปรดสังเกตว่า `status` ต่อการเปลี่ยนแปลงเป็น enum string ที่นี่. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Change: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spec: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. ออกสถานะ 1 เมื่อมีรายการใดล้มเหลว.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"ready"|"blocked", missingDeps?} ], "root" }`. ไม่มีการเปลี่ยนแปลงที่ใช้งานอยู่: `{ "changes": [], "message", "root" }`, ออกสถานะ 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "template", "dependencies": [{id,done,path,description}], "unlocks", "root" }`.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — รายการที่แก้ไขแล้วจะบรรจุ root/specs/fetch; ที่ยังไม่ได้รับการแก้ไขจะบรรจุ store_id + status คำเตือน. Index ถูกจำกัดไว้ที่ 50KB (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
สำเร็จ: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. ล้มเหลว: `{ "change": null, "status": [d] }`, ออกสถานะ 1.

### 4.8 `archive <name> --json`
สำเร็จ: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. ล้มเหลว: `{ "archive": null, "root"?, "status": [d] }`, ออกสถานะ 1. โหมด JSON เป็นแบบไม่โต้ตอบอย่างเคร่งครัด: ทุกจุดที่ต้องป้อนข้อมูลจะกลายเป็นรหัส `archive_*`.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "status": [] } | null, "references": [...], "status": [] }`. การค้นพบด้านสุขภาพใด ๆ ที่มีระดับความรุนแรงจะออกสถานะ 0. เพย์โหลดความล้มเหลว: `{ "root": null, "store": null, "references": [], "status": [d] }`, ออกสถานะ 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. AVAILABLE = path มีอยู่จริง และ status เป็นค่าว่าง. `--code-workspace <path>` จะเขียน `{folders:[{name,path}]}` (เฉพาะ stores ที่อ้างถึงได้, ใช้ prefix `ref:`); ในโหมด JSON การเขียนจะทำงานก่อนการพิมพ์ ดังนั้น stdout จึงบรรจุเอกสารเพียงฉบับเดียวแม้ว่าจะล้มเหลวในการเขียน. ความล้มเหลว: `{ "root": null, "members": [], "status": [d] }`, ออกสถานะ 1.

### 4.11 `store ... --json`
setup/register: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. unregister/remove: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. list: `{ "stores": [{id, root}], "status": [] }`. doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = ไม่ทราบ/ไม่ได้ตรวจสอบ). การค้นพบด้านสุขภาพจะออกสถานะ 0; ความล้มเหลวจะออกสถานะ 1 ด้วย null-shape ที่ตรงกัน. การยกเลิกการสั่งงาน (Prompt cancellation) ออกสถานะ 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: อาร์เรย์เปล่า `[ {name, description, artifacts, source} ]`. `templates`: ออบเจกต์ที่มีคีย์ `{ "<artifactId>": {path, source} }`. ทั้งสองแบบอิงตาม cwd (current working directory) และไม่มีคีย์ root/status.

## 5. สัญญาการออกรหัสสถานะ (Exit-code contract)

| สถานการณ์ | Exit | Stdout |
|---|---|---|
| สำเร็จ รวมถึงการค้นพบด้านสุขภาพ (doctor/context/store doctor) | 0 | เพย์โหลด |
| คำสั่งล้มเหลวในโหมด `--json` | 1 | เอกสาร JSON หนึ่งฉบับพร้อม `status: [d]` และ null-shape ของคำสั่งนั้น |
| `validate` ที่มีรายการล้มเหลว | 1 | รายงานฉบับเต็ม |
| การยกเลิกการสั่งงาน (Prompt cancellation) (`store` group, human mode) | 130 | stderr เท่านั้น |

## 6. แคตตาล็อกรหัสการวินิจฉัย (Diagnostic code catalog)

### Resolution
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; การส่งผ่าน (pass-through): `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### OpenSpec-root health (error, no fix)
`openspec_store_root_missing`, `openspec_root_missing`, `openspec_config_missing`, `openspec_specs_missing`, `openspec_changes_missing`, `openspec_archive_missing`, รวมทั้งรูปแบบ `_not_directory` ของแต่ละรายการ.

### Store registry/identity/state
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Store setup/register/remove
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (warning ในการลบ, error ใน doctor), `store_root_not_directory`.

### Store git
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (warning), `store_clone_fragile_directories` (warning), `store_remote_divergence` (info, doctor).

### References (warning)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Relationships (warning; doctor; context เก็บเฉพาะ registry)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Archive (JSON mode)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Context writes
`context_file_exists`, `context_output_dir_missing`.

### Fallbacks
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Known inconsistencies

บันทึกโดยการตรวจสอบ Capstone; การเปลี่ยนชื่อคีย์ที่เผยแพร่เป็นข้อตัดสินใจของผลิตภัณฑ์ที่ถูกเลื่อนออกไปจากเวอร์ชันนี้:

1. ~~ในโหมด `--json` เส้นทางความล้มเหลวหลายเส้นได้พิมพ์ไปยัง stderr เท่านั้นโดยไม่มีเอกสาร JSON.~~ แก้ไขแล้วในการทดสอบ Capstone gauntlet: `show`/`validate` รายการที่ไม่ทราบและคลุมเคร่ออก `{status:[{code: unknown_item | ambiguous_item, ...}]}`; ข้อผิดพลาดที่ถูกโยนออกใน `status`/`instructions`/`list`/`show`/`validate` จะผ่านตัวช่วยความล้มเหลวที่รับรู้ JSON (null-shape ของคำสั่ง + `status`); `store <unknown subcommand> --json` ออก `{status:[{code: unknown_store_subcommand}]}`; `list` บรรจุ null-shape `{changes|specs: [], root: null}` ในกรณีที่การแก้ไขล้มเหลว.
2. `store_root_missing` ถูกปล่อยออกมาพร้อมสองระดับความรุนแรง (warning ในการลบ, error ใน store doctor) — ขึ้นอยู่กับบริบท, ได้บันทึกไว้ข้างต้น.
3. การกำหนดรูปแบบคีย์แบบ snake_case (ครอบครัว store) เทียบกับ camelCase (ครอบครัว workflow); `root.store_id` เป็น snake_case เสมอ.
4. มีการประกาศประเภท envelope สี่ชนิดใน src; การวินิจฉัย archive ไม่เคยบรรจุ `target`.
5. `list --json` ใช้คีย์ `status` ซ้ำเป็น enum string ต่อการเปลี่ยนแปลง.
6. เฉพาะเอาต์พุตของ `validate` เท่านั้นที่บรรจุฟิลด์ `version`.
7. `schemas`/`templates` ละเลยการเลือก root (อิงตาม cwd, ไม่ใช้ `--store`).
8. รูปแบบคำนามที่ถูกยกเลิกแล้ว (`change`/`spec` subcommands) จะออกเพย์โหลดที่ไม่ถูกห่อหุ้มพร้อมด้วย `root`/`status`.