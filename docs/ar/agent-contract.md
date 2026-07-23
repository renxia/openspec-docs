# عقد وكيل OpenSpec

أسطح قابلة للقراءة آلياً لأمر `openspec` CLI، تم التحقق منها مقابل `src/` (تدقيق Capstone، 2026-06-11). كل شكل موضح أدناه موثق انطلاقاً من الكود المُصدر.

## 1. الاتفاقيات العامة

- **مستند JSON واحد لكل استدعاء.** في وضع `--json`، يحتوي مخرج stdout على بالضبط مستند JSON واحد (مُنسق بمسافات 2 للقراءة). أما النص البشري، المؤشرات الدوارة للتحميل، وشارة المتجر، فتُوجه إلى مخرج stderr.
- **شارة المتجر.** في الوضع البشري، يقوم الجذر المحدد من قبل المتجر بطباعة السلسلة `Using OpenSpec root: <id> (<path>)` إلى مخرج stderr. لا تُطبع هذه الشارة أبداً في وضع JSON.
- **حالة الأحرف في المفاتيح تعتمد على نوع السطح** (انظر عدم الاتساقات المعروفة): تحميلات أسطح store/doctor/context تستخدم `snake_case`؛ بينما تستخدم تحميلات سير العمل (`status`, `instructions`, `new change`, `validate`, `list`) نمط `camelCase`، باستثناء الكائن `root` المضمن، الذي يستخدم دائماً `store_id`.
- **يتم حذف المفاتيح الاختيارية بدلاً من تعيينها إلى قيمة null**، في معظم الحمولات (مثال: `root.store_id`، `member.path`). يتم الإشارة إلى الاستثناءات التي تستخدم قيمة `null` صريحة لكل شكل على حدة (مثل الحقول `git.*` في حمولات أمر store doctor، وحمولات الفشل).

## 2. ظرف التشخيص

يتم مشاركة شكل ظرف واحد لكل تشخيص قابل للقراءة آلياً (`StoreDiagnostic`):

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

تظهر التشخيصات في موضعين: **مصفوفات الحالة** (`status: StoreDiagnostic[]` على المستوى الأعلى أو لكل إدخال) لنتائج الفحص الصحي، و **الأخطاء المُطلقة** التي يتم تحويلها إلى مصفوفة `status` ذات عنصر واحد عند فشل الأمر.

## 3. تحديد الجذر و `RootOutput`

تحدد جميع أوامر تحديد الجذر (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) جذر OpenSpec واحد بأولوية واحدة:

1. `--store <id>` → جذر المتجر المسجل (`source: "store"`).
2. وإلا، السلف الأقرب الذي يحتوي على `openspec/`: شكل التخطيط → `source: "nearest"` (يتم تجاهل مؤشر `store:` مع تحذير على stderr)؛ دليل التكوين فقط مع مؤشر `store:` صالح → ذلك المتجر، `source: "declared"`.
3. لا يوجد جذر قريب + تعيين `defaultStore` العام (`openspec config set defaultStore <id>`) → ذلك المتجر، `source: "global_default"`؛ يفشل المعرف القديم مع خطأ المتجر الأساسي و `fix` يسمي `openspec config unset defaultStore`.
4. لا يوجد جذر قريب، لا يوجد افتراضي + توجد متاجر مسجلة → خطأ `no_root_with_registered_stores`.
5. لا يوجد جذر، لا يوجد افتراضي، لا توجد متاجر: تعامل أوامر الهيكلة الدليل الحالي كـ `source: "implicit"`؛ تفشل أوامر التشخيص (`doctor`, `context`) بـ `no_openspec_root` بدلاً من ذلك — فهي تفحص، ولا تنشئ هياكل أبداً.

تضم حمولات JSON الناجحة الجذر:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**عقد فشل الجذر**: في وضع JSON، يطبع فشل التحديد `{ ...commandNullShape, "status": [diagnostic] }` على stdout ويخرج برمز 1.

## 4. أشكال JSON للأوامر

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — لاحظ أن `status` لكل تغيير هو تعداد نصي هنا. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
التغيير: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. المواصفة: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. يخرج برمز 1 عند فشل أي عنصر.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`. إن `requires` لكل قطعة أثرية هي معرفات تبعياتها المباشرة (موجودة لكل حالة، لذا يمكن حساب المجموعة المطلوبة العابرة حتى عندما تكون القطعة الأثرية `done`)؛ يظهر `missingDeps` فقط عندما تكون `blocked`. `"skipped"` يحدد قطعة أثرية التي مسار `generates` الخاص بها تحت `specs/` في تغيير يعلن `.openspec.yaml` عنه `skip_specs: true`؛ فهي تلبي التبعيات ولكن لا يجب إنشاؤها. لا توجد تغييرات نشطة: `{ "changes": [], "message", "root" }`، يخرج برمز 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`. يظهر `"skipped": true` (مع `"warning"`) عندما يعلن التغيير `skip_specs: true` ويتم تخطي هذه القطعة الأثرية — لا تنشئ ملفاتها. إدخال تبعية مع `skipped: true` مُرضى بدون ملفات — لا تحاول قراءة مساراتها.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — تحمل الإدخالات المُحللة root/specs/fetch؛ تحمل الإدخالات غير المُحللة store_id + حالة تحذير. الفهرس محدد بـ 50 كيلوبايت (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
النجاح: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. الفشل: `{ "change": null, "status": [d] }`، يخرج برمز 1.

### 4.8 `archive <name> --json`
النجاح: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. الفشل: `{ "archive": null, "root"?, "status": [d] }`، يخرج برمز 1. وضع JSON غير تفاعلي بشكل صارم: كل نقطة موجهة تصبح كود `archive_*`.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`. `drift` (موجود فقط لاستخراج متجر مدعوم بـ git له مرجع تتبع upstream) هو عدادات متقدمة/متأخرة مقابل آخر upstream تم جلببه، وليس الـ remote المباشر. توجد نتائج فحص صحي من أي خطورة تخرج برمز 0. حمولة الفشل: `{ "root": null, "store": null, "references": [], "status": [d] }`، يخرج برمز 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. متاح = المسار موجود AND الحالة فارغة. `--code-workspace <path>` يكتب `{folders:[{name,path}]}` (المتاجر المشار إليها المتاحة فقط، ببادئات `ref:``)؛ في وضع JSON، يعمل الكتابة قبل الطباعة لذا يحمل stdout مستنداً واحداً بالضبط حتى عند فشل الكتابة. الفشل: `{ "root": null, "members": [], "status": [d] }`، يخرج برمز 1.

### 4.11 `store ... --json`
إعداد/تسجيل: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. إلغاء تسجيل/إزالة: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. قائمة: `{ "stores": [{id, root}], "status": [] }`. فحص: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = غير معروف/لم يتم فحصه). توجد نتائج فحص صحي تخرج برمز 0؛ تفشل الفشلات تخرج برمز 1 مع شكل null المطابق. إلغاء الموجه يخرج برمز 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: مصفوفة عادية `[ {name, description, artifacts, source} ]`. `templates`: كائن بمفاتيح `{ "<artifactId>": {path, source} }`. كليهما قائم على الدليل الحالي، بدون مفاتيح root/status.

## 5. عقد رمز الخروج

| الحالة | الخروج | stdout |
|---|---|---|
| النجاح، بما في ذلك نتائج الفحص الصحي (doctor/context/store doctor) | 0 | الحمولة |
| فشل الأمر في وضع `--json` | 1 | مستند JSON واحد مع `status: [d]` وشكل null للأمر |
| `validate` مع عناصر فاشلة | 1 | تقرير كامل |
| إلغاء الموجه (مجموعة `store`، الوضع البشري) | 130 | stderr فقط |

## 6. فهرس أكواد التشخيص

### الحل
`no_openspec_root`، `no_root_with_registered_stores`، `no_registered_stores`، `unknown_store`، `store_identity_mismatch`، `unhealthy_store_root`، `store_path_not_supported`، `invalid_store_pointer`، `initiative_option_removed`، `areas_option_removed`؛ تمرير: `invalid_store_id`، `invalid_store_registry`، `invalid_store_metadata`.

### صحة جذر OpenSpec (خطأ، بدون إصلاح)
`openspec_store_root_missing`، `openspec_store_root_not_directory`، `openspec_root_missing`، `openspec_root_not_directory`، `openspec_config_missing`، `openspec_config_not_file`، `openspec_specs_not_directory`، `openspec_changes_not_directory`، `openspec_archive_not_directory`. أثناء مرحلة بيتا للمتاجر، قد تكون `openspec/specs/`، `openspec/changes/`، و `openspec/changes/archive/` غائبة في جذر صحي؛ فهي أخطاء صحية فقط عندما تكون موجودة ولكنها ليست أدلة.

### سجل/هوية/حالة المتجر
`invalid_store_id`، `invalid_store_registry`، `invalid_store_metadata`، `store_registry_busy`، `store_not_found`، `no_store_registry`، `store_registry_changed`، `store_metadata_missing`، `store_metadata_id_mismatch`، `store_metadata_invalid`، `store_id_conflict`، `store_path_conflict`، `store_already_registered` (معلومات).

### إعداد/تسجيل/إزالة المتجر
`store_setup_id_required`، `store_setup_path_required`، `store_setup_path_not_directory`، `store_setup_inside_git_repo`، `store_setup_non_empty_directory`، `store_setup_cancelled`، `store_path_required`، `store_path_missing`، `store_path_not_directory`، `store_root_pointer_declared`، `store_register_root_unhealthy`، `store_register_identity_confirmation_required`، `store_register_cancelled`، `store_remote_empty`، `store_remote_requires_hand_edit`، `store_remove_confirmation_required`، `store_remove_cancelled`، `store_remove_path_not_directory`، `store_remove_metadata_missing`، `store_root_missing` (تحذير في الإزالة، خطأ في فحص المتجر)، `store_root_not_directory`.

### git للمتجر
`store_git_init_failed`، `store_git_identity_missing`، `store_git_commit_failed`، `store_git_no_commits` (تحذير)، `store_clone_fragile_directories` (تحذير)، `store_remote_divergence` (معلومات، فحص)، `store_checkout_drift` (معلومات، فحص).

### المراجع (تحذير)
`reference_invalid_id`، `reference_registry_unreadable`، `reference_unresolved`، `reference_root_unhealthy`، `reference_index_truncated`.

### العلاقات (تحذير؛ الفحص؛ السياق يحتفظ فقط بذاك السجلي)
`relationship_registry_unreadable`، `root_pointer_ignored`، `root_pointer_invalid`، `pointer_declarations_inert`.

### الأرشيف (وضع JSON)
`archive_change_name_required`، `archive_change_not_found`، `archive_validation_failed`، `archive_confirmation_required`، `archive_tasks_incomplete`، `archive_spec_update_failed`، `archive_spec_validation_failed`، `archive_target_exists`، `archive_error`.

### كتابات السياق
`context_file_exists`، `context_output_dir_missing`.

### الاحتياطيات
`doctor_failed`، `context_failed`، `store_error`، `change_error`، `archive_error`.

## عدم تناسبات معروفة

تم تسجيلها من خلال تدقيق الـ capstone؛ إعادة تسمية المفاتيح المنشورة هي قرارات منتج مؤجلة بعد هذا الإصدار:

1. ~~في وضع `--json`، تطبع مسارات الفشل العديدة stderr فقط بدون مستند JSON.~~ تم الإصلاح في جولة الـ gauntlet: `show`/`validate` العناصر غير المعروفة والغامضة تُصدر `{status:[{code: unknown_item | ambiguous_item, ...}]}`؛ الأخطاء المُطلقة في `status`/`instructions`/`list`/`show`/`validate` تمر عبر مساعد الفشل الواعي لـ JSON (شكل null للأمر + `status`)؛ `store <unknown subcommand> --json` يُصدر `{status:[{code: unknown_store_subcommand}]}`؛ `list` يحمل شكل null `{changes|specs: [], root: null}` على فشلات التحديد.
2. يتم إصدار `store_root_missing` بخطورتين (تحذير في الإزالة، خطأ في فحص المتجر) — يعتمد على السياق، موثق أعلاه.
3. حالة مفاتيح snake_case (عائلة المتجر) مقابل camelCase (عائلة سير العمل)؛ `root.store_id` هو snake_case في كل مكان.
4. توجد أربع إعلانات نوع ظرف متوازية في src؛ تشخيصات الأرشيف لا تحمل `target` أبداً.
5. `list --json` يعيد استخدام مفتاح `status` كتعداد نصي لكل تغيير.
6. فقط مخرج `validate` يحمل حقل `version`.
7. `schemas`/`templates` يتجاهل تحديد الجذر (قائم على الدليل الحالي، بدون `--store`).
8. أشكال الأسماء المهملة (أوامر `change`/`spec` الفرعية) تُصدر حمولات غير مغلفة بدون `root`/`status`.