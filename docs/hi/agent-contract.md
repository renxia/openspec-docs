# OpenSpec एजेंट अनुबंध

`openspec` CLI की मशीन-पठनीय सतहें, जो `src/` के विरुद्ध सत्यापित हैं (कैपस्टोन ऑडिट, 2026-06-11)। नीचे हर आकार उत्सर्जित करने वाले कोड से प्रलेखित है।

## 1. सामान्य कन्वेंशन (General Conventions)

- **प्रत्येक आह्वान के लिए एक JSON दस्तावेज़।** `--json` मोड में, stdout ठीक एक JSON दस्तावेज़ रखता है (2-स्पेस प्रीटी-प्रिंटेड)। मानव पाठ, स्पिनर और स्टोर बैनर stderr पर जाते हैं।
- **स्टोर बैनर।** मानव मोड में, एक स्टोर-चयनित रूट stderr पर `Using OpenSpec root: <id> (<path>)` प्रिंट करता है। इसे कभी भी JSON मोड में प्रिंट नहीं किया जाता है।
- **की केसिंग सतह पर निर्भर करती है** (ज्ञात विसंगतियों देखें): स्टोर/डॉक्टर/संदर्भ पेलोड में `snake_case` का उपयोग किया जाता है; वर्कफ़्लो पेलोड (`status`, `instructions`, `new change`, `validate`, `list`) में `camelCase` का उपयोग करते हैं, सिवाय इसके एम्बेडेड `root` ऑब्जेक्ट के, जो हमेशा `store_id` का उपयोग करता है।
- **वैकल्पिक कीज़ को हटा दिया जाता है, न कि नल** अधिकांश पेलोड में (उदाहरण के लिए, `root.store_id`, `member.path`)। स्पष्ट रूप से नल का उपयोग करने वाले अपवाद प्रत्येक आकार के अनुसार बताए गए हैं (स्टोर डॉक्टर `git.*`, विफलता पेलोड)।

## 2. डायग्नोस्टिक एनवलप (The Diagnostic Envelope)

एक एनवलप आकार प्रत्येक मशीन-पठनीय डायग्नोस्टिक (`StoreDiagnostic`) द्वारा साझा किया जाता है:

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

डायग्नोस्टिक्स दो स्थानों पर दिखाई देते हैं: स्वास्थ्य निष्कर्षों के लिए **स्टेटस ऐरेज़** (`status: StoreDiagnostic[]` शीर्ष स्तर पर या प्रति प्रविष्टि) और कमांड विफलता पर एक एकल-तत्व वाले `status` ऐरे में परिवर्तित **फेंके गए त्रुटियाँ (thrown errors)**।

## 3. रूट चयन और RootOutput

सभी रूट-हल करने वाले कमांड (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) एक प्राथमिकता के साथ एक OpenSpec रूट हल करते हैं:

1. `--store <id>` → पंजीकृत स्टोर का रूट (`source: "store"`)।
2. अन्यथा, निकटतम पूर्वज जिसके पास `openspec/` है: योजना आकार (planning shape) → `source: "nearest"` (एक `store:` पॉइंटर को stderr चेतावनी के साथ अनदेखा कर दिया जाता है); वैध `store:` पॉइंटर वाली कॉन्फ़िगरेशन-केवल डायरेक्टरी → वह स्टोर, `source: "declared"`।
3. कोई निकटतम रूट + पंजीकृत स्टोर मौजूद नहीं हैं → त्रुटि `no_root_with_registered_stores`।
4. कोई रूट, कोई स्टोर नहीं: स्कैफोल्डिंग कमांड cwd को `source: "implicit"` के रूप में मानते हैं; डायग्नोस्टिक कमांड (`doctor`, `context`) इसके बजाय `no_openspec_root` के साथ विफल होते हैं — वे निरीक्षण करते हैं, कभी भी स्कैफोल्ड नहीं करते।

सफल JSON पेलोड में रूट एम्बेड किया जाता है:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**रूट विफलता अनुबंध (Root-failure contract)**: JSON मोड में एक संकल्प विफलता stdout पर `{ ...commandNullShape, "status": [diagnostic] }` प्रिंट करती है और 1 से बाहर निकलती है।

## 4. कमांड JSON आकार (Command JSON Shapes)

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — ध्यान दें कि प्रति परिवर्तन `status` यहाँ एक स्ट्रिंग enum है। `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`।

### 4.2 `show <item> --json`
परिवर्तन: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`। Spec: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`।

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`। किसी भी आइटम के विफल होने पर 1 से बाहर निकलें।

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"ready"|"blocked", missingDeps?} ], "root" }`। कोई सक्रिय परिवर्तन नहीं हैं: `{ "changes": [], "message", "root" }`, 0 से बाहर निकलें।

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "template", "dependencies": [{id,done,path,description}], "unlocks", "root" }`।
`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — हल की गई प्रविष्टियाँ रूट/स्पेक्स/फ़ेच रखती हैं; अनसुलझी स्टोर\_आईडी + चेतावनी स्थिति रखती हैं। इंडेक्स 50KB पर सीमित है (`reference_index_truncated`)।

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`।

### 4.7 `new change <name> --json`
सफलता: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`। विफलता: `{ "change": null, "status": [d] }`, 1 से बाहर निकलें।

### 4.8 `archive <name> --json`
सफलता: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`। विफलता: `{ "archive": null, "root"?, "status": [d] }`, 1 से बाहर निकलें। JSON मोड सख्ती से गैर-इंटरैक्टिव है: हर प्रॉम्प्ट पॉइंट एक `archive_*` कोड बन जाता है।

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "status": [] } | null, "references": [...], "status": [] }`। किसी भी गंभीरता के स्वास्थ्य निष्कर्ष 0 से बाहर निकलते हैं। विफलता पेलोड: `{ "root": null, "store": null, "references": [], "status": [d] }`, 1 से बाहर निकलें।

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`। AVAILABLE = पथ मौजूद है और स्टेटस खाली है। `--code-workspace <path>` `{folders:[{name,path}]}` लिखता है (केवल उपलब्ध संदर्भित स्टोर; `ref:` प्रीफिक्स); JSON मोड में लेखन प्रिंट करने से पहले होता है ताकि लेखन विफलता पर भी stdout ठीक एक दस्तावेज़ रखे। विफलता: `{ "root": null, "members": [], "status": [d] }`, 1 से बाहर निकलें।

### 4.11 `store ... --json`
सेटअप/पंजीकरण: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`। अनरजिस्टर/हटाना: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`। सूची: `{ "stores": [{id, root}], "status": [] }`। डॉक्टर: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = अज्ञात/जाँचा नहीं गया)। स्वास्थ्य निष्कर्ष 0 से बाहर निकलते हैं; विफलताएँ मिलान वाले नल-आकार के साथ 1 से बाहर निकलती हैं। प्रॉम्प्ट रद्द करना 130 से बाहर निकलता है।

### 4.12 `schemas --json` / `templates --json`
`schemas`: खाली ऐरे `[ {name, description, artifacts, source} ]`। `templates`: की वाले ऑब्जेक्ट `{ "<artifactId>": {path, source} }`। दोनों cwd-आधारित हैं, कोई रूट/स्टेटस कुंजी नहीं है।

## 5. एग्जिट-कोड अनुबंध (Exit-Code Contract)

| स्थिति | एग्जिट | Stdout |
|---|---|---|
| सफलता, स्वास्थ्य निष्कर्षों सहित (doctor/context/store doctor) | 0 | पेलोड |
| `--json` मोड में कमांड विफलता | 1 | एक JSON दस्तावेज़ जिसमें `status: [d]` और कमांड का नल-आकार हो |
| विफल आइटम के साथ `validate` | 1 | पूर्ण रिपोर्ट |
| प्रॉम्प्ट रद्द करना (store समूह, मानव मोड) | 130 | केवल stderr |

## 6. डायग्नोस्टिक कोड कैटलॉग

### संकल्प (Resolution)
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; पास-थ्रू: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`।

### OpenSpec-root स्वास्थ्य (error, no fix)
`openspec_store_root_missing`, `openspec_root_missing`, `openspec_config_missing`, `openspec_specs_missing`, `openspec_changes_missing`, `openspec_archive_missing`, साथ ही प्रत्येक के `_not_directory` वेरिएंट।

### स्टोर रजिस्ट्री/पहचान/स्थिति
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info)।

### स्टोर सेटअप/पंजीकरण/हटाना
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (हटाने में चेतावनी, डॉक्टर में त्रुटि), `store_root_not_directory`।

### स्टोर git
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (चेतावनी), `store_clone_fragile_directories` (चेतावनी), `store_remote_divergence` (info, doctor)।

### संदर्भ (References) (warning)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`।

### संबंध (Relationships) (warning; doctor; context केवल रजिस्ट्री वाले को रखता है)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`।

### संग्रह (Archive) (JSON मोड)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`।

### संदर्भ लेखन (Context writes)
`context_file_exists`, `context_output_dir_missing`।

### फॉलबैक (Fallbacks)
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`।

## ज्ञात विसंगतियाँ (Known Inconsistencies)

कैपस्टोन ऑडिट द्वारा दर्ज की गई; प्रकाशित कुंजी के नाम परिवर्तन इस रिलीज़ के बाद तक स्थगित उत्पाद निर्णय हैं:

1. ~~JSON मोड में, कई विफलता पथ केवल stderr पर बिना JSON दस्तावेज़ के प्रिंट करते थे।~~ कैपस्टोन गाuntlet राउंड में ठीक किया गया: `show`/`validate` अज्ञात और अस्पष्ट आइटमों को `{status:[{code: unknown_item | ambiguous_item, ...}]}` उत्सर्जित करते हैं; `status`/`instructions`/`list`/`show`/`validate` में फेंकी गई त्रुटियाँ JSON-जागरूक विफलता हेल्पर (कमांड का नल-आकार + `status`) के माध्यम से गुजरती हैं; `store <unknown subcommand> --json` `{status:[{code: unknown_store_subcommand}]}` उत्सर्जित करता है; संकल्प विफलताओं पर `list` अपना `{changes|specs: [], root: null}` नल-आकार रखता है।
2. `store_root_missing` दो गंभीरता के साथ उत्सर्जित किया जाता है (हटाने में चेतावनी, स्टोर डॉक्टर में त्रुटि) — संदर्भ-निर्भर, ऊपर प्रलेखित।
3. कुंजी केसिंग: snake\_case (स्टोर परिवार) बनाम camelCase (वर्कफ़्लो परिवार); `root.store_id` हर जगह snake\_case है।
4. src में चार समानांतर एनवलप प्रकार घोषणाएँ मौजूद हैं; संग्रह डायग्नोस्टिक्स कभी भी `target` नहीं रखते।
5. `list --json` प्रति परिवर्तन एक स्ट्रिंग enum के रूप में `status` कुंजी का पुन: उपयोग करता है।
6. केवल `validate` आउटपुट में `version` फ़ील्ड होता है।
7. `schemas`/`templates` रूट चयन को अनदेखा करते हैं (cwd-आधारित, कोई `--store`)।
8. अप्रचलित संज्ञा रूप (`change`/`spec` सबकमांड) बिना `root`/`status` के अनएनवलप्ड पेलोड उत्सर्जित करते हैं।