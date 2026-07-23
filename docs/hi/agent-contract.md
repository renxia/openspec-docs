# OpenSpec एजेंट अनुबंध

`openspec` CLI की मशीन-पठनीय सतहें, जिन्हें `src/` के खिलाफ सत्यापित किया गया है (कैपस्टोन ऑडिट, 2026-06-11)। नीचे दिए गए हर आकृति को उस कोड से दस्तावेजित किया गया है जो इसे उत्पन्न करता है।

## 1. सामान्य परंपराएं

- **प्रत्येक निष्पादन के लिए एक ही JSON दस्तावेज़।** `--json` मोड में, stdout में ठीक एक JSON दस्तावेज़ (2-स्पेस प्रेटी-प्रिंटेड) होता है। मानव गद्य, स्पिनर और स्टोर बैनर stderr पर जाते हैं।
- **स्टोर बैनर।** मानव मोड में, स्टोर द्वारा चयनित रूट stderr पर `Using OpenSpec root: <id> (<path>)` प्रिंट करता है। JSON मोड में यह कभी भी प्रिंट नहीं किया जाता।
- **की केसिंग सतह पर निर्भर है** (ज्ञात असंगतियों को देखें): स्टोर/डॉक्टर/कॉन्टेक्स्ट पेलोड में `snake_case` का उपयोग किया जाता है; कार्यप्रवाह पेलोड (`status`, `instructions`, `new change`, `validate`, `list`) में `camelCase` का उपयोग किया जाता है, सिवाय एम्बेडेड `root` ऑब्जेक्ट के, जिसमें हमेशा `store_id` का उपयोग होता है।
- **वैकल्पिक कुंजियां अधिकांश पेलोड में शून्य (null) नहीं, बल्कि छोड़ दी जाती हैं**, (उदाहरण: `root.store_id`, `member.path`)। जिन अपवादों में स्पष्ट `null` का उपयोग किया जाता है, उन्हें प्रत्येक आकृति के अनुसार अलग से उल्लिखित किया गया है (स्टोर डॉक्टर `git.*`, विफल पेलोड)।

## 2. डायग्नोस्टिक एनवेलोप

हर मशीन-पठनीय डायग्नोस्टिक (`StoreDiagnostic`) द्वारा साझा किया गया एक ही एनवेलोप आकार है:

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

डायग्नोस्टिक्स दो स्थितियों में दिखाई देते हैं: स्वास्थ्य निष्कर्षों के लिए **स्टेटस सरणियाँ** (`status: StoreDiagnostic[]` टॉप लेवल पर या प्रत्येक एंट्री पर), और कमांड विफलता पर एकल-तत्व `status` सरणी में बदली गई **थ्रोन एरर**।

## 3. रूट सेलेक्शन और `RootOutput`

सभी रूट-रेज़ॉल्विंग कमांड्स (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) एक ही प्राथमिकता के साथ एक OpenSpec रूट रेज़ॉल्व करते हैं:

1. `--store <id>` → रजिस्टर्ड स्टोर का रूट (`source: "store"`)।
2. अन्यथा, `openspec/` वाला निकटतम पूर्वज → प्लानिंग आकार → `source: "nearest"` (`store:` पॉइंटर को स्टैंडर्ड एरर वार्निंग के साथ नज़रअंदाज किया जाता है); वैध `store:` पॉइंटर वाला केवल कॉन्फिग डिरेक्ट्री → वह स्टोर, `source: "declared"`।
3. कोई निकटतम रूट नहीं + ग्लोबल `defaultStore` सेट (`openspec config set defaultStore <id>`) → वह स्टोर, `source: "global_default"`; एक स्टेल आईडी अंडरलाइंग स्टोर एरर और `openspec config unset defaultStore` नाम वाली `fix` के साथ विफल होती है।
4. कोई निकटतम रूट नहीं, कोई डिफॉल्ट नहीं + रजिस्टर्ड स्टोर्स मौजूद हैं → एरर `no_root_with_registered_stores`।
5. कोई रूट नहीं, कोई डिफॉल्ट नहीं, कोई स्टोर्स नहीं: स्कैफोल्डिंग कमांड्स CWD को `source: "implicit"` के रूप में ट्रीट करती हैं; डायग्नोस्टिक कमांड्स (`doctor`, `context`) `no_openspec_root` के साथ विफल होती हैं — ये इंस्पेक्ट करती हैं, कभी स्कैफोल्ड नहीं करती हैं।

सफल JSON पेलोड में रूट एम्बेड होता है:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**रूट-विफलता अनुबंध**: JSON मोड में रेज़ॉल्यूशन विफलता पर `{ ...commandNullShape, "status": [diagnostic] }` स्टैंडर्ड आउटपुट पर प्रिंट होता है और एक्सिट 1 होता है।

## 4. कमांड JSON आकार

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — ध्यान दें कि प्रति-चेंज `status` यहां एक स्ट्रिंग एनम है। `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`।

### 4.2 `show <item> --json`
चेंज: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`। स्पेक: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`।

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`। जब भी कोई आइटम विफल होता है तो एक्सिट 1 होता है।

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`। प्रत्येक आर्टिफैक्ट का `requires` इसकी सीधी निर्भरता आईडी होती है (प्रत्येक स्टेटस के लिए मौजूद है, इसलिए जब आर्टिफैक्ट `done` हो तक भी ट्रांजिटिव रिक्वायर्ड सेट कंप्यूट करने योग्य होता है); `missingDeps` केवल `blocked` होने पर दिखाई देता है। `"skipped"` उस आर्टिफैक्ट को मार्क करता है जिसका `generates` पाथ `specs/` के अंदर हो और जिस चेंज का `.openspec.yaml` `skip_specs: true` घोषित करता हो; यह निर्भरताओं को पूरा करता है लेकिन नहीं बनाया जाना चाहिए। कोई एक्टिव चेंज नहीं: `{ "changes": [], "message", "root" }`, एक्सिट 0।

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`। जब चेंज `skip_specs: true` घोषित करती है और यह आर्टिफैक्ट स्किप होता है तो `"skipped": true` (`"warning"` के साथ) दिखाई देता है — इसके फाइल्स नहीं बनाएं। `skipped: true` वाली निर्भरता एंट्री फाइल्स के बिना संतुष्ट होती है — इसके पाथ को पढ़ने की कोशिश न करें।

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — रेज़ॉल्व की गई एंट्रीज रूट/स्पेक्स/फेच लेती हैं; अनरेज़ॉल्व की गई एंट्रीज स्टोर_आईडी + वार्निंग स्टेटस लेती हैं। इंडेक्स 50KB तक सीमित है (`reference_index_truncated`)।

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`।

### 4.7 `new change <name> --json`
सफलता: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`। विफलता: `{ "change": null, "status": [d] }`, एक्सिट 1।

### 4.8 `archive <name> --json`
सफलता: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`। विफलता: `{ "archive": null, "root"?, "status": [d] }`, एक्सिट 1। JSON मोड कठोर रूप से नॉन-इंटरैक्टिव है: प्रत्येक प्रॉम्प्ट पॉइंट एक `archive_*` कोड बन जाता है।

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`। `drift` (केवल उपस्ट्रीम ट्रैकिंग रेफ वाले गिट-बैक्ड स्टोर चेकआउट के लिए मौजूद) लास्ट-फेच किए गए उपस्ट्रीम के खिलाफ ऑहेड/बिहाइड काउंट है, लाइव रिमोट के खिलाफ नहीं। किसी भी गंभीरता के स्वास्थ्य निष्कर्ष एक्सिट 0 करते हैं। विफलता पेलोड: `{ "root": null, "store": null, "references": [], "status": [d] }`, एक्सिट 1।

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`। AVAILABLE = पाथ मौजूद AND स्टेटस खाली। `--code-workspace <path>` `{folders:[{name,path}]}` लिखता है (केवल उपलब्ध रेफरेंस्ड स्टोर्स, `ref:` प्रिफिक्स); JSON मोड में लिखने से पहिंटिंग से पहले रन होता है ताकि लिखने की विफलता पर भी स्टैंडर्ड आउटपुट में बिल्कुल एक ही डॉक्यूमेंट हो। विफलता: `{ "root": null, "members": [], "status": [d] }`, एक्सिट 1।

### 4.11 `store ... --json`
सेटअप/रजिस्टर: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`। अनरजिस्टर/रिमूव: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`। लिस्ट: `{ "stores": [{id, root}], "status": [] }`। डॉक्टर: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = अज्ञात/नहीं जांचा गया)। स्वास्थ्य निष्कर्ष एक्सिट 0 करते हैं; विफलताएं मिलान वाली नल-शेप के साथ एक्सिट 1 करती हैं। प्रॉम्प्ट कैंसलेशन एक्सिट 130 करता है।

### 4.12 `schemas --json` / `templates --json`
`schemas`: बेयर एरे `[ {name, description, artifacts, source} ]`। `templates`: कीड ऑब्जेक्ट `{ "<artifactId>": {path, source} }`। दोनों CWD-आधारित हैं, कोई रूट/स्टेटस की नहीं।

## 5. एक्सिट-कोड अनुबंध

| स्थिति | एक्सिट | स्टैंडर्ड आउटपुट |
|---|---|---|
| सफलता, स्वास्थ्य निष्कर्ष शामिल (डॉक्टर/कॉन्टेक्स्ट/स्टोर डॉक्टर) | 0 | पेलोड |
| `--json` मोड में कमांड विफलता | 1 | `status: [d]` और कमांड की नल-शेप वाला एक JSON डॉक्यूमेंट |
| विफल आइटम्स के साथ `validate` | 1 | पूरी रिपोर्ट |
| प्रॉम्प्ट कैंसलेशन (`store` ग्रुप, ह्यूमन मोड) | 130 | केवल स्टैंडर्ड एरर |

## 6. डायग्नोस्टिक कोड कैटालॉग

### रेज़ॉल्यूशन
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; पास-थ्रू: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`।

### ओपनस्पेक-रूट स्वास्थ्य (एरर, कोई फिक्स नहीं)
`openspec_store_root_missing`, `openspec_store_root_not_directory`, `openspec_root_missing`, `openspec_root_not_directory`, `openspec_config_missing`, `openspec_config_not_file`, `openspec_specs_not_directory`, `openspec_changes_not_directory`, `openspec_archive_not_directory`। स्टोर्स बीटा के दौरान, स्वस्थ रूट में `openspec/specs/`, `openspec/changes/`, और `openspec/changes/archive/` अनुपस्थित हो सकते हैं; ये केवल तब स्वास्थ्य एरर होते हैं जब मौजूद हों लेकिन डिरेक्ट्री न हों।

### स्टोर रजिस्ट्री/आइडेंटिटी/स्टेट
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (इंफो)।

### स्टोर सेटअप/रजिस्टर/रिमूव
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_root_pointer_declared`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (रिमूव में वार्निंग, डॉक्टर में एरर), `store_root_not_directory`।

### स्टोर गिट
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (वार्निंग), `store_clone_fragile_directories` (वार्निंग), `store_remote_divergence` (इंफो, डॉक्टर), `store_checkout_drift` (इंफो, डॉक्टर)।

### रेफरेंसिस (वार्निंग)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`।

### रिलेशनशिप्स (वार्निंग; डॉक्टर; कॉन्टेक्स्ट केवल रजिस्ट्री वाला रखता है)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`।

### आर्काइव (JSON मोड)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`।

### कॉन्टेक्स्ट राइट्स
`context_file_exists`, `context_output_dir_missing`।

### फॉलबैक्स
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`।

## ज्ञात असंगतियां

कैपस्टोन ऑडिट द्वारा रिकॉर्ड किया गया; प्रकाशित-की रीनेमिंग उत्पाद निर्णय हैं जो इस रिलीज़ के बाद के लिए टाल दिए गए हैं:

1. ~~`--json` मोड में, कई विफलता पाथ्स केवल स्टैंडर्ड एरर पर प्रिंट होते थे बिना किसी JSON डॉक्यूमेंट के।~~ कैपस्टोन गॉनलेट राउंड में फिक्स किया गया: `show`/`validate` अज्ञात और अस्पष्ट आइटम्स `{status:[{code: unknown_item | ambiguous_item, ...}]}` उत्सर्जित करते हैं; `status`/`instructions`/`list`/`show`/`validate` में थ्रोन एरर JSON-अवेयर फेल्योर हेल्पर के माध्यम से रूट होते हैं (कमांड की नल-शेप + `status`); `store <unknown subcommand> --json` `{status:[{code: unknown_store_subcommand}]}` उत्सर्जित करता है; रेज़ॉल्यूशन विफलताओं पर `list` अपनी `{changes|specs: [], root: null}` नल-शेप लेता है।
2. `store_root_missing` दो गंभीरताओं के साथ उत्सर्जित होता है (रिमूव में वार्निंग, स्टोर डॉक्टर में एरर) — कॉन्टेक्स्ट-डिपेंडेंट, ऊपर डॉक्यूमेंट किया गया है।
3. स्नेक_केस (स्टोर फैमिली) बनाम कैमलकेस (वर्कफ्लो फैमिली) की कैसिंग; `root.store_id` हर जगह स्नेक_केस है।
4. सोर्स में चार समानांतर एनवेलोप टाइप डिक्लेरेशंस मौजूद हैं; आर्काइव डायग्नोस्टिक्स कभी भी `target` नहीं लेते।
5. `list --json` प्रति चेंज स्ट्रिंग एनम के रूप में `status` की कोई फिर से उपयोग करता है।
6. केवल `validate` आउटपुट `version` फील्ड लेता है।
7. `schemas`/`templates` रूट सेलेक्शन को नज़रअंदाज करते हैं (CWD-आधारित, कोई `--store` नहीं)।
8. डिप्रेकेटेड नाउन फॉर्म्स (`change`/`spec` सबकमांड्स) `root`/`status` के बिना अनएनवेलप्ड पेलोड्स उत्सर्जित करते हैं।