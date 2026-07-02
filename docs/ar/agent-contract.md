# عقد وكيل OpenSpec

الأسطح القابلة للقراءة آلياً لواجهة سطر الأوامر `openspec`، والمُدققة مقابل `src/` (تدقيق Capstone، 2026-06-11). يتم توثيق كل شكل أدناه من الكود المُصدِر.

## 1. الاتفاقيات العامة

- **وثيقة JSON واحدة لكل استدعاء.** في وضع `--json`، يحمل `stdout` وثيقة JSON واحدة بالضبط (مُنسقة بمسافتين). تذهب النصوص البشرية وعدادات التقدم (spinners) وشعار التخزين إلى `stderr`.
- **شعار التخزين (Store banner).** في الوضع البشري، يطبع الجذر المحدد من التخزين (`store`) النص التالي إلى `stderr`: `Using OpenSpec root: <id> (<path>)`. لا يُطبع هذا الشعار أبداً في وضع JSON.
- **حالة تسمية المفاتيح تعتمد على السطح** (انظر التناقضات المعروفة): تستخدم حمولات (payloads) التخزين/الطبيب/السياق `snake_case`؛ وتستخدم حمولات سير العمل (`status`، `instructions`، `new change`، `validate`، `list`) `camelCase`، باستثناء الكائن المضمن `root` الذي يستخدم دائماً `store_id`.
- **يتم حذف المفاتيح الاختيارية، وليس تعيينها على null**، في معظم الحمولات (على سبيل المثال: `root.store_id`، `member.path`). يتم الإشارة إلى الاستثناءات التي تستخدم `null` صراحةً لكل شكل (طبيب التخزين `git.*`، حمولات الفشل).

## 2. غلاف التشخيص (The diagnostic envelope)

يتم مشاركة شكل الغلاف هذا من قبل كل تشخيص قابل للقراءة آلياً (`StoreDiagnostic`):

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

تظهر التشخيصات في موضعين: **مصفوفات الحالة** (`status: StoreDiagnostic[]` على المستوى الأعلى أو لكل إدخال) للعثور على المشكلات، و**الأخطاء المرمية** المحولة إلى مصفوفة `status` ذات عنصر واحد عند فشل الأمر.

## 3. اختيار الجذر و`RootOutput`

تقوم جميع الأوامر التي تحل الجذر (`list`، `show`، `validate`، `status`، `instructions`، `instructions apply`، `new change`، `archive`، `doctor`، `context`) بحل جذر OpenSpec واحد وفقاً للأسبقية التالية:

1. `--store <id>` → جذر التخزين المسجل (`source: "store"`).
2. بخلاف ذلك، أقرب سلف يحتوي على `openspec/`: شكل تخطيطي (planning shape) → `source: "nearest"` (يتم تجاهل مؤشر `store:` مع تحذير في `stderr`)؛ دليل مخصص بالتكوينات (config-only dir) ويحتوي على مؤشر `store:` صالح → ذلك التخزين، `source: "declared"`.
3. لا يوجد جذر قريب ولا توجد تخزينات مسجلة → خطأ `no_root_with_registered_stores`.
4. لا يوجد جذر، ولا توجد تخزينات: تتعامل أوامر السقالات (scaffolding commands) مع دليل العمل الحالي (`cwd`) كـ `source: "implicit"`؛ وتفشل الأوامر التشخيصية (`doctor`، `context`) باستخدام `no_openspec_root` بدلاً من ذلك — فهي تفحص ولا تقوم بالسقالة.

تحمل حمولات JSON الناجحة الجذر:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**عقدة فشل الجذر**: في وضع JSON، يطبع فشل الحل `{ ...commandNullShape, "status": [diagnostic] }` على `stdout` ويخرج برمز 1.

## 4. أشكال JSON الأوامر

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — لاحظ أن حالة التغيير (per-change status) هي تعداد نصي هنا. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
التغيير: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. المواصفة (Spec): `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. يخرج برمز 1 عندما يفشل أي عنصر.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"ready"|"blocked", missingDeps?} ], "root" }`. لا توجد تغييرات نشطة: `{ "changes": [], "message", "root" }`، يخرج برمز 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "template", "dependencies": [{id,done,path,description}], "unlocks", "root" }`.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — الإدخالات التي تم حلها تحمل الجذر/المواصفات/الاسترجاع؛ والإدخالات غير المحلولة تحمل `store_id` + حالة تحذير. يتم تحديد عدد الإدخالات بـ 50 كيلوبايت (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
النجاح: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. الفشل: `{ "change": null, "status": [d] }`، يخرج برمز 1.

### 4.8 `archive <name> --json`
النجاح: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. الفشل: `{ "archive": null, "root"?, "status": [d] }`، يخرج برمز 1. وضع JSON غير تفاعلي تماماً: كل نقطة مطالبة تصبح رمز `archive_*`.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "status": [] } | null, "references": [...], "status": [] }`. تخرج العثور على المشكلات ذات أي مستوى من الخطورة برمز 0. حمولة الفشل: `{ "root": null, "store": null, "references": [], "status": [d] }`، يخرج برمز 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. متاح (AVAILABLE) = وجود المسار وكون الحالة فارغة. `--code-workspace <path>` يكتب `{folders:[{name,path}]}` (التخزينات المرجعية فقط، باستخدام البادئة `ref:`). في وضع JSON، يعمل الكتاب قبل الطباعة لذا يحتفظ `stdout` بوثيقة واحدة بالضبط حتى عند فشل الكتابة. الفشل: `{ "root": null, "members": [], "status": [d] }`، يخرج برمز 1.

### 4.11 `store ... --json`
الإعداد/التسجيل: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. إلغاء التسجيل/الحذف: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. القائمة: `{ "stores": [{id, root}], "status": [] }`. الطبيب (doctor): `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = غير معروف/لم يتم فحصه). تخرج العثور على المشكلات برمز 0؛ وتخرج حالات الفشل برمز 1 مع الشكل الصفري المطابق. إلغاء الطلب يخرج برمز 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: مصفوفة مجردة `[ {name, description, artifacts, source} ]`. `templates`: كائن مفتاحي `{ "<artifactId>": {path, source} }`. كلاهما يعتمد على دليل العمل الحالي، ولا يحتويان على مفاتيح الجذر/الحالة.

## 5. عقدة رمز الخروج (Exit-code contract)

| الحالة | الرمز | Stdout |
|---|---|---|
| النجاح، بما في ذلك العثور على المشكلات (doctor/context/store doctor) | 0 | الحمولة (payload) |
| فشل الأمر في وضع `--json` | 1 | وثيقة JSON واحدة مع `status: [d]` والشكل الصفري للأمر |
| `validate` بعناصر فاشلة | 1 | التقرير الكامل |
| إلغاء الطلب (مجموعة `store`، الوضع البشري) | 130 | إلى stderr فقط |

## 6. كتالوج الأكواد التشخيصية

### الحلول (Resolution)
`no_openspec_root`، `no_root_with_registered_stores`، `no_registered_stores`، `unknown_store`، `store_identity_mismatch`، `unhealthy_store_root`، `store_path_not_supported`، `invalid_store_pointer`، `initiative_option_removed`، `areas_option_removed`؛ تمرير: `invalid_store_id`، `invalid_store_registry`، `invalid_store_metadata`.

### صحة جذر OpenSpec (OpenSpec-root health) (خطأ، لا يوجد إصلاح)
`openspec_store_root_missing`، `openspec_root_missing`، `openspec_config_missing`، `openspec_specs_missing`، `openspec_changes_missing`، `openspec_archive_missing`، بالإضافة إلى المتغيرات التي تنتهي بـ `_not_directory`.

### سجل/هوية/حالة التخزين (Store registry/identity/state)
`invalid_store_id`، `invalid_store_registry`، `invalid_store_metadata`، `store_registry_busy`، `store_not_found`، `no_store_registry`، `store_registry_changed`، `store_metadata_missing`، `store_metadata_id_mismatch`، `store_metadata_invalid`، `store_id_conflict`، `store_path_conflict`، `store_already_registered` (معلومات).

### إعداد/تسجيل/إزالة التخزين (Store setup/register/remove)
`store_setup_id_required`، `store_setup_path_required`، `store_setup_path_not_directory`، `store_setup_inside_git_repo`، `store_setup_non_empty_directory`، `store_setup_cancelled`، `store_path_required`، `store_path_missing`، `store_path_not_directory`، `store_register_root_unhealthy`، `store_register_identity_confirmation_required`، `store_register_cancelled`، `store_remote_empty`، `store_remote_requires_hand_edit`، `store_remove_confirmation_required`، `store_remove_cancelled`، `store_remove_path_not_directory`، `store_remove_metadata_missing`، `store_root_missing` (تحذير في الإزالة، خطأ في الطبيب)، `store_root_not_directory`.

### Git التخزين (Store git)
`store_git_init_failed`، `store_git_identity_missing`، `store_git_commit_failed`، `store_git_no_commits` (تحذير)، `store_clone_fragile_directories` (تحذير)، `store_remote_divergence` (معلومات، الطبيب).

### المراجع (References) (تحذير)
`reference_invalid_id`، `reference_registry_unreadable`، `reference_unresolved`، `reference_root_unhealthy`، `reference_index_truncated`.

### العلاقات (Relationships) (تحذير؛ الطبيب؛ السياق يحتفظ فقط بالخاص بالسجل)
`relationship_registry_unreadable`، `root_pointer_ignored`، `root_pointer_invalid`، `pointer_declarations_inert`.

### الأرشفة (Archive) (وضع JSON)
`archive_change_name_required`، `archive_change_not_found`، `archive_validation_failed`، `archive_confirmation_required`، `archive_tasks_incomplete`، `archive_spec_update_failed`، `archive_spec_validation_failed`، `archive_target_exists`، `archive_error`.

### كتابة السياق (Context writes)
`context_file_exists`، `context_output_dir_missing`.

### حالات الطوارئ (Fallbacks)
`doctor_failed`، `context_failed`، `store_error`، `change_error`، `archive_error`.

## التناقضات المعروفة (Known inconsistencies)

سُجلت بواسطة تدقيق Capstone؛ وهي قرارات منتجية لتغيير الأسماء تم تأجيلها لما بعد هذا الإصدار:

1. ~~في وضع `--json`، كانت عدة مسارات فشل تطبع إلى stderr فقط دون وثيقة JSON.~~ تم إصلاح ذلك في جولة تحدي Capstone: الأوامر `show`/`validate` التي تحتوي على عناصر غير معروفة أو غامضة تصدر `{status:[{code: unknown_item | ambiguous_item, ...}]}`; والأخطاء المرمية في مسار `status`/`instructions`/`list`/`show`/`validate` تمر عبر مساعد الفشل الواعي لـ JSON (الشكل الصفري للأمر + `status`); الأمر `store <unknown subcommand> --json` يصدر `{status:[{code: unknown_store_subcommand}]}`; ويحمل `list` شكله الصفري `{changes|specs: [], root: null}` في حالات فشل الحل.
2. يتم إصدار `store_root_missing` بدرجتي خطورة (تحذير في الإزالة، خطأ في طبيب التخزين) — يعتمد على السياق، وموثق أعلاه.
3. حالة تسمية المفاتيح: `snake_case` (عائلة التخزين) مقابل `camelCase` (عائلة سير العمل)؛ و`root.store_id` هو دائماً `snake_case`.
4. توجد أربعة تصريحات أنواع أغلفة في المصدر؛ التشخيصات المتعلقة بالأرشفة لا تحمل أبداً `target`.
5. يعيد استخدام `list --json` المفتاح `status` كتعداد نصي لكل تغيير.
6. فقط مخرجات `validate` تحمل حقلاً `version`.
7. تتجاهل `schemas`/`templates` اختيار الجذر (تعتمد على دليل العمل الحالي، ولا تستخدم `--store`).
8. الأشكال الاسمية المهملة (`change`/`spec`) تصدر حمولات غير مغلفة بدون `root`/`status`.