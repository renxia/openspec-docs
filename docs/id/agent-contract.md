# Kontrak Agen OpenSpec

Permukaan yang dapat dibaca mesin dari `openspec` CLI, diverifikasi terhadap `src/` (audit capstone, 11-06-2026). Setiap bentuk di bawah didokumentasikan dari kode yang memancarkannya.

## 1. Konvensi umum

- **Satu dokumen JSON per panggilan.** Dalam mode `--json`, stdout membawa tepat satu dokumen JSON (dicetak rapi dengan spasi 2). Prose manusia, spinner, dan banner penyimpanan dialihkan ke stderr.
- **Banner penyimpanan.** Dalam mode manusia, root yang dipilih oleh toko akan mencetak `Using OpenSpec root: <id> (<path>)` ke stderr. Tidak pernah dicetak dalam mode JSON.
- **Kasus penamaan kunci bergantung pada permukaan** (lihat Inkonsistensi yang Diketahui): payload store/doctor/context menggunakan `snake_case`; payload workflow (`status`, `instructions`, `new change`, `validate`, `list`) menggunakan `camelCase`, kecuali objek `root` yang tertanam, yang selalu menggunakan `store_id`.
- **Kunci opsional dihilangkan, bukan null**, dalam sebagian besar payload (misalnya. `root.store_id`, `member.path`). Pengecualian yang menggunakan `null` secara eksplisit disebutkan per bentuk (doctor toko `git.*`, payload kegagalan).

## 2. Wadah diagnostik

Satu bentuk wadah dibagikan oleh setiap diagnostik yang dapat dibaca mesin (`StoreDiagnostic`):

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Diagnostik muncul di dua posisi: **array status** (`status: StoreDiagnostic[]` di tingkat atas atau per entri) untuk temuan kesehatan, dan **kesalahan yang dilempar** yang dikonversi menjadi array `status` satu elemen pada kegagalan perintah.

## 3. Pemilihan Root dan `RootOutput`

Semua perintah yang menyelesaikan root (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) menyelesaikan satu root OpenSpec dengan satu urutan prioritas:

1. `--store <id>` → root toko yang terdaftar (`source: "store"`).
2. Jika tidak, leluhur terdekat dengan `openspec/`: bentuk perencanaan → `source: "nearest"` (pointer `store:` diabaikan dengan peringatan stderr); direktori hanya konfigurasi dengan pointer `store:` yang valid → toko tersebut, `source: "declared"`.
3. Tidak ada root terdekat + toko yang terdaftar ada → kesalahan `no_root_with_registered_stores`.
4. Tidak ada root, tidak ada toko: perintah scaffolding memperlakukan cwd sebagai `source: "implicit"`; perintah diagnostik (`doctor`, `context`) gagal dengan `no_openspec_root` alih-alih — mereka memeriksa, tidak pernah membuat kerangka (scaffold).

Payload JSON yang berhasil menyematkan root:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "nearest" | "implicit", "store_id": "id (hanya ketika toko dipilih)" }
```

**Kontrak kegagalan Root**: dalam mode JSON, kegagalan resolusi mencetak `{ ...commandNullShape, "status": [diagnostic] }` di stdout dan keluar dengan kode 1.

## 4. Bentuk JSON Perintah

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — perhatikan bahwa `status` per perubahan adalah enum string di sini. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Perubahan: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spec: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Keluar 1 jika ada item yang gagal.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"ready"|"blocked", missingDeps?} ], "root" }`. Tidak ada perubahan aktif: `{ "changes": [], "message", "root" }`, keluar 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "template", "dependencies": [{id,done,path,description}], "unlocks", "root" }`.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — entri yang telah diselesaikan membawa root/specs/fetch; yang belum terselesaikan membawa `store_id` + status peringatan. Indeks dibatasi hingga 50KB (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Sukses: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Kegagalan: `{ "change": null, "status": [d] }`, keluar 1.

### 4.8 `archive <name> --json`
Sukses: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Kegagalan: `{ "archive": null, "root"?, "status": [d] }`, keluar 1. Mode JSON secara ketat non-interaktif: setiap titik prompt menjadi kode `archive_*`.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "status": [] } | null, "references": [...], "status": [] }`. Temuan kesehatan apa pun yang memiliki tingkat keparahan keluar 0. Payload kegagalan: `{ "root": null, "store": null, "references": [], "status": [d] }`, keluar 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. AVAILABLE = path ada DAN status kosong. `--code-workspace <path>` menulis `{folders:[{name,path}]}` (hanya toko yang dirujuk, awalan `ref:`); dalam mode JSON penulisanan berjalan sebelum mencetak sehingga stdout hanya berisi satu dokumen bahkan pada kegagalan penulisanan. Kegagalan: `{ "root": null, "members": [], "status": [d] }`, keluar 1.

### 4.11 `store ... --json`
setup/register: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. unregister/remove: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. list: `{ "stores": [{id, root}], "status": [] }`. doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = tidak diketahui/tidak diperiksa). Temuan kesehatan keluar 0; kegagalan keluar 1 dengan bentuk null yang sesuai. Pembatalan prompt keluar 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: array kosong `[ {name, description, artifacts, source} ]`. `templates`: objek berindeks `{ "<artifactId>": {path, source} }`. Keduanya berbasis cwd, tanpa kunci root/status.

## 5. Kontrak Kode Keluar

| Situasi | Keluar | Stdout |
|---|---|---|
| Sukses, termasuk temuan kesehatan (doctor/context/store doctor) | 0 | payload |
| Kegagalan perintah dalam mode `--json` | 1 | satu dokumen JSON dengan `status: [d]` dan bentuk null dari perintah tersebut |
| `validate` dengan item yang gagal | 1 | laporan lengkap |
| Pembatalan prompt (kelompok `store`, mode manusia) | 130 | stderr saja |

## 6. Katalog Kode Diagnostik

### Resolusi
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; diteruskan: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Kesehatan OpenSpec-root (error, tanpa perbaikan)
`openspec_store_root_missing`, `openspec_root_missing`, `openspec_config_missing`, `openspec_specs_missing`, `openspec_changes_missing`, `openspec_archive_missing`, ditambah varian `_not_directory` dari masing-masing.

### Registri/Identitas/Status Toko
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Setup/Register/Remove Toko
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (peringatan dalam penghapusan, error dalam doctor), `store_root_not_directory`.

### Git Toko
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (peringatan), `store_clone_fragile_directories` (peringatan), `store_remote_divergence` (info, doctor).

### Referensi (peringatan)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Hubungan (peringatan; doctor; context hanya menyimpan yang registry)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Arsip (mode JSON)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Penulisan Context
`context_file_exists`, `context_output_dir_missing`.

### Fallback
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Inkonsistensi yang Diketahui

Dicatat oleh audit capstone; penamaan ulang kunci yang dipublikasikan adalah keputusan produk yang ditunda setelah rilis ini:

1. ~~Dalam mode `--json`, beberapa jalur kegagalan hanya mencetak ke stderr tanpa dokumen JSON.~~ Diperbaiki dalam putaran gauntlet capstone: `show`/`validate` item yang tidak diketahui dan ambigu memancarkan `{status:[{code: unknown_item | ambiguous_item, ...}]}`; kesalahan yang dilempar di `status`/`instructions`/`list`/`show`/`validate` melewati helper kegagalan sadar JSON (bentuk null dari perintah + `status`); `store <subcommand tidak diketahui> --json` memancarkan `{status:[{code: unknown_store_subcommand}]}`; `list` membawa bentuk null `{changes|specs: [], root: null}` pada kegagalan resolusi.
2. `store_root_missing` dipancarkan dengan dua tingkat keparahan (peringatan dalam penghapusan, error dalam doctor) — tergantung konteks, didokumentasikan di atas.
3. Kasus penamaan kunci snake_case (keluarga store) vs camelCase (keluarga workflow); `root.store_id` adalah snake_case di mana-mana.
4. Empat deklarasi tipe wadah paralel ada di src; diagnostik arsip tidak pernah membawa `target`.
5. `list --json` menggunakan kembali kunci `status` sebagai enum string per perubahan.
6. Hanya output `validate` yang membawa bidang `version`.
7. `schemas`/`templates` mengabaikan pemilihan root (berbasis cwd, tanpa `--store`).
8. Bentuk kata benda yang usang (`change`/`spec` subperintah) memancarkan payload tanpa wadah tanpa `root`/`status`.