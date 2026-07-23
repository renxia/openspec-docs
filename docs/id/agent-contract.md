# OpenSpec Agent Kontrak

Antarmuka yang dapat dibaca mesin dari CLI `openspec`, yang diverifikasi terhadap `src/` (audit capstone, 2026-06-11). Setiap struktur di bawah didokumentasikan langsung dari kode yang memancarkannya.

## 1. Konvensi umum

- **Satu dokumen JSON per pemanggilan.** Dalam mode `--json`, stdout hanya membawa tepat satu dokumen JSON (diformat cantik dengan indentasi 2 spasi). Prosa untuk pengguna, spinners, dan banner store diarahkan ke stderr.
- **Banner store.** Dalam mode untuk pengguna, root yang dipilih oleh store mencetak `Using OpenSpec root: <id> (<path>)` ke stderr. Tidak pernah dicetak dalam mode JSON.
- **Casing kunci bergantung pada antarmuka** (lihat Ketidakkonsistenan yang Diketahui): payload dari store, doctor, dan context menggunakan `snake_case`; payload alur kerja (`status`, `instructions`, `new change`, `validate`, `list`) menggunakan `camelCase`, kecuali objek `root` yang disematkan, yang selalu menggunakan `store_id`.
- **Kunci opsional dihilangkan, bukan bernilai null**, pada sebagian besar payload (misalnya `root.store_id`, `member.path`). Pengecualian yang menggunakan `null` eksplisit disebutkan per struktur (store doctor `git.*`, payload kegagalan).

## 2. Amplop diagnostik

Satu bentuk amplop dibagikan oleh setiap diagnostik yang dapat dibaca mesin (`StoreDiagnostic`):

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Diagnostik muncul di dua posisi: **array status** (`status: StoreDiagnostic[]` di tingkat atas atau per entri) untuk temuan kesehatan, dan **kesalahan yang dilempar** yang dikonversi menjadi array status satu elemen saat perintah gagal.

## 3. Pemilihan root dan `RootOutput`

Semua perintah yang menyelesaikan root (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) menyelesaikan satu root OpenSpec dengan satu prioritas:

1. `--store <id>` → root toko yang terdaftar (`source: "store"`).
2. Jika tidak, leluhur terdekat dengan `openspec/`: bentuk perencanaan → `source: "nearest"` (penunjuk `store:` diabaikan dengan peringatan stderr); direktori hanya konfigurasi dengan penunjuk `store:` yang valid → toko itu, `source: "declared"`.
3. Tidak ada root terdekat + `defaultStore` global diatur (`openspec config set defaultStore <id>`) → toko itu, `source: "global_default"`; id yang kedaluwarsa gagal dengan kesalahan toko yang mendasarinya dan `fix` yang menamai `openspec config unset defaultStore`.
4. Tidak ada root terdekat, tidak ada default + toko terdaftar ada → kesalahan `no_root_with_registered_stores`.
5. Tidak ada root, tidak ada default, tidak ada toko: perintah penggubungan memperlakukan cwd sebagai `source: "implicit"`; perintah diagnostik (`doctor`, `context`) gagal dengan `no_openspec_root` sebagai gantinya — mereka memeriksa, tidak pernah membuat kerangka.

Payload JSON yang berhasil menyematkan root:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (hanya ketika dipilih toko)" }
```

**Kontrak kegagalan root**: dalam mode JSON, kegagalan resolusi mencetak `{ ...commandNullShape, "status": [diagnostic] }` di stdout dan keluar dengan kode 1.

## 4. Bentuk JSON perintah

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — perhatikan `status` per perubahan adalah enum string di sini. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Perubahan: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spesifikasi: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Keluar dengan kode 1 ketika ada item yang gagal.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`. Setiap `requires` artefak adalah id dependensi langsungnya (ada untuk setiap status, jadi himpunan dependensi transitif dapat dihitung bahkan ketika artefak `done`); `missingDeps` hanya muncul ketika `blocked`. `"skipped"` menandai artefak yang jalur `generates`nya berada di bawah `specs/` dalam perubahan yang `.openspec.yaml`-nya menyatakan `skip_specs: true`; ia memenuhi dependensi tetapi tidak boleh dibuat. Tidak ada perubahan aktif: `{ "changes": [], "message", "root" }`, keluar dengan kode 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`. `"skipped": true` (dengan `"warning"`) muncul ketika perubahan menyatakan `skip_specs: true` dan artefak ini dilewati — jangan buat file-nya. Entri dependensi dengan `skipped: true` terpenuhi tanpa file — jangan coba baca jalurnya.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — entri yang teratasi membawa root/specs/fetch; yang tidak teratasi membawa store_id + status peringatan. Indeks dibatasi menjadi 50KB (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Sukses: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Kegagalan: `{ "change": null, "status": [d] }`, keluar dengan kode 1.

### 4.8 `archive <name> --json`
Sukses: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Kegagalan: `{ "archive": null, "root"?, "status": [d] }`, keluar dengan kode 1. Mode JSON sepenuhnya non-interaktif: setiap titik prompt menjadi kode `archive_*`.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`. `drift` (hanya ada untuk checkout toko yang didukung git yang memiliki ref pelacakan upstream) adalah hitungan maju/mundur terhadap upstream terakhir yang diambil, bukan remote langsung. Temuan kesehatan dengan tingkat keparahan apa pun keluar dengan kode 0. Payload kegagalan: `{ "root": null, "store": null, "references": [], "status": [d] }`, keluar dengan kode 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. TERSEDIA = jalur ada DAN status kosong. `--code-workspace <path>` menulis `{folders:[{name,path}]}` (hanya toko referensi yang tersedia, awalan `ref:`); dalam mode JSON penulisan berjalan sebelum mencetak jadi stdout memegang tepat satu dokumen bahkan ketika penulisan gagal. Kegagalan: `{ "root": null, "members": [], "status": [d] }`, keluar dengan kode 1.

### 4.11 `store ... --json`
setup/register: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. unregister/remove: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. list: `{ "stores": [{id, root}], "status": [] }`. doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = tidak diketahui/tidak diperiksa). Temuan kesehatan keluar dengan kode 0; kegagalan keluar dengan kode 1 dengan bentuk null yang sesuai. Pembatalan prompt keluar dengan kode 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: array mentah `[ {name, description, artifacts, source} ]`. `templates`: objek berkey `{ "<artifactId>": {path, source} }`. Keduanya berbasis cwd, tidak ada kunci root/status.

## 5. Kontrak kode keluar

| Situasi | Keluar | Stdout |
|---|---|---|
| Sukses, termasuk temuan kesehatan (doctor/context/store doctor) | 0 | payload |
| Kegagalan perintah dalam mode `--json` | 1 | satu dokumen JSON dengan `status: [d]` dan bentuk null perintah |
| `validate` dengan item yang gagal | 1 | laporan lengkap |
| Pembatalan prompt (grup `store`, mode manusia) | 130 | hanya stderr |

## 6. Katalog kode diagnostik

### Resolusi
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; lewat: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Kesehatan root OpenSpec (kesalahan, tanpa perbaikan)
`openspec_store_root_missing`, `openspec_store_root_not_directory`, `openspec_root_missing`, `openspec_root_not_directory`, `openspec_config_missing`, `openspec_config_not_file`, `openspec_specs_not_directory`, `openspec_changes_not_directory`, `openspec_archive_not_directory`. Selama beta toko, `openspec/specs/`, `openspec/changes/`, dan `openspec/changes/archive/` mungkin tidak ada dalam root yang sehat; mereka hanya kesalahan kesehatan ketika ada tetapi bukan direktori.

### Registri/identitas/status toko
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Penyiapan/pendaftaran/penghapusan toko
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_root_pointer_declared`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (peringatan dalam remove, kesalahan dalam doctor), `store_root_not_directory`.

### Git toko
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (peringatan), `store_clone_fragile_directories` (peringatan), `store_remote_divergence` (info, doctor), `store_checkout_drift` (info, doctor).

### Referensi (peringatan)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Hubungan (peringatan; doctor; context hanya menyimpan yang registri)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Arsip (mode JSON)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Penulisan konteks
`context_file_exists`, `context_output_dir_missing`.

### Fallback
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Ketidakkonsistenan yang diketahui

Dicatat oleh audit puncak; penggantian nama kunci yang dipublikasikan adalah keputusan produk yang ditunda melebihi rilis ini:

1. ~~Dalam mode `--json`, beberapa jalur kegagalan hanya mencetak stderr tanpa dokumen JSON.~~ Diperbaiki di putaran gauntlet puncak: `show`/`validate` item yang tidak diketahui dan ambigu memancarkan `{status:[{code: unknown_item | ambiguous_item, ...}]}`; kesalahan yang dilempar di `status`/`instructions`/`list`/`show`/`validate` melewati helper kegagalan yang sadar JSON (bentuk null perintah + `status`); `store <unknown subcommand> --json` memancarkan `{status:[{code: unknown_store_subcommand}]}`; `list` membawa bentuk null `{changes|specs: [], root: null}` pada kegagalan resolusi.
2. `store_root_missing` dipancarkan dengan dua tingkat keparahan (peringatan dalam remove, kesalahan dalam store doctor) — tergantung konteks, didokumentasikan di atas.
3. Kasus huruf snake_case (keluarga toko) vs camelCase (keluarga alur kerja); `root.store_id` adalah snake_case di mana-mana.
4. Empat deklarasi jenis amplop paralel ada di src; diagnostik arsip tidak pernah membawa `target`.
5. `list --json` menggunakan kembali kunci `status` sebagai enum string per perubahan.
6. Hanya keluaran `validate` yang membawa bidang `version`.
7. `schemas`/`templates` mengabaikan pemilihan root (berbasis cwd, tidak ada `--store`).
8. Bentuk kata benda yang usang (`change`/`spec` subcommands) memancarkan payload yang tidak dibungkus tanpa `root`/`status`.