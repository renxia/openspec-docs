# OpenSpec Agent Sözleşmesi

`openspec` CLI'ın makine tarafından okunabilir yüzeyleri, `src/`'a karşı doğrulanmıştır (capstone denetimi, 2026-06-11). Aşağıdaki her şekil, yayımlayan koddan belgelenmiştir.

## 1. Genel Kurallar

- **Her çağrım için bir JSON dokümanı.** `--json` modunda, stdout tam olarak tek bir JSON dokümanı taşır (2 boşlukla güzel biçimde yazdırılmış). İnsan dilindeki anlatımlar, dönme göstergeleri ve depo bayrağı stderr'a gider.
- **Depo Bayrağı.** İnsan modunda, depo tarafından seçilen kök, `Using OpenSpec root: <id> (<path>)` ifadesini stderr'a yazdırır. JSON modunda asla yazdırılmaz.
- **Anahtar büyük harflandırması yüzeye bağlıdır** (Bilinen Tutarsızlıklar'a bakın): store/doctor/context yükleri `snake_case`; iş akışı yükleri (`status`, `instructions`, `new change`, `validate`, `list`) `camelCase` kullanır, ancak gömülü olan `root` nesnesi her zaman `store_id` kullanır.
- **İsteğe bağlı anahtarlar `null` değil, eksiktir**, çoğu yükte (örneğin. `root.store_id`, `member.path`). Açıkça `null` kullanan istisnalar, şekil bazında belirtilmiştir (store doctor `git.*`, hata yükleri).

## 2. Tanısal Zarf

Her makine tarafından okunabilir tanı (`StoreDiagnostic`) için bir zarf şekli:

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Tanılar iki konumda görünür: sağlık bulguları için **durum dizileri** (`status: StoreDiagnostic[]` en üst seviyede veya her giriş başına) ve komut hatası durumunda tek elemanlı bir `status` dizisine dönüştürülen **fırlatılan hatalar**.

## 3. Kök Seçimi ve `RootOutput`

Tüm kök çözen komutlar (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`), bir öncelik sırasına göre tek bir OpenSpec kökü çözümler:

1. `--store <id>` → kayıtlı deponun kökü (`source: "store"`).
2. Aksi takdirde, en yakın ata ve `openspec/` içeren şekil → `source: "nearest"` (bir `store:` işaretçisi stderr uyarısıyla göz ardı edilir); geçerli bir `store:` işaretçisine sahip config-only dizini → o depo, `source: "declared"`.
3. Hiçbir yakın kök ve kayıtlı depolar yok → hata `no_root_with_registered_stores`.
4. Kök yok, depo yok: iskele oluşturma komutları mevcut çalışma dizinini (`cwd`) `source: "implicit"` olarak ele alır; tanısal komutlar (`doctor`, `context`) bunun yerine `no_openspec_root` ile başarısız olur — onlar inceler, asla iskelet oluşturmazlar.

Başarılı JSON yükleri kökü gömer:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Kök Hata Sözleşmesi**: JSON modunda bir çözme hatası, stdout'da `{ ...commandNullShape, "status": [diagnostic] }` yazdırır ve 1 ile çıkar.

## 4. Komut JSON Şekilleri

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — burada her değişiklik için olan `status` bir dize enum'udur. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Değişiklik: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Şekil: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Herhangi bir öğe başarısız olursa 1 ile çıkar.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"ready"|"blocked", missingDeps?} ], "root" }`. Aktif değişiklik yoksa: `{ "changes": [], "message", "root" }`, 0 ile çıkar.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "template", "dependencies": [{id,done,path,description}], "unlocks", "root" }`.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — çözülmüş girişler kök/şekiller/çekme taşır; çözülmemiş olanlar `store_id` + uyarı durumu taşır. İndeks 50KB ile sınırlıdır (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Başarılı: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Başarısızlık: `{ "change": null, "status": [d] }`, 1 ile çıkar.

### 4.8 `archive <name> --json`
Başarılı: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Başarısızlık: `{ "archive": null, "root"?, "status": [d] }`, 1 ile çıkar. JSON modu kesinlikle etkileşimli değildir: her istem noktası bir `archive_*` kodu haline gelir.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "status": [] } | null, "references": [...], "status": [] }`. Herhangi bir şiddetteki sağlık bulguları 0 ile çıkar. Hata yükü: `{ "root": null, "store": null, "references": [], "status": [d] }`, 1 ile çıkar.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. AVAILABLE = path mevcut VE status boş. `--code-workspace <path>` `{folders:[{name,path}]}` yazar (sadece referans alınan depolar; `ref:` önekleri); JSON modunda yazma işlemi yazdırmadan önce çalışır, bu nedenle stdout yazma hatası olsa bile tam olarak tek bir doküman içerir. Hata: `{ "root": null, "members": [], "status": [d] }`, 1 ile çıkar.

### 4.11 `store ... --json`
kurulum/kayıt: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. kaydı silme/kaldırma: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. listeleme: `{ "stores": [{id, root}], "status": [] }`. doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = bilinmeyen/incelemedi). Sağlık bulguları 0 ile çıkar; hatalar eşleşen null-şekil ile 1 ile çıkar. İstem iptali 130 ile çıkar.

### 4.12 `schemas --json` / `templates --json`
`schemas`: ham dizi `[ {name, description, artifacts, source} ]`. `templates`: anahtarlı nesne `{ "<artifactId>": {path, source} }`. Her ikisi de cwd tabanlıdır, kök/status anahtarları yoktur.

## 5. Çıkış Kodu Sözleşmesi

| Durum | Çıkış | Stdout |
|---|---|---|
| Başarı, sağlık bulguları dahil (doctor/context/store doctor) | 0 | yük |
| `--json` modunda komut hatası | 1 | `status: [d]` içeren ve komutun null-şeklini taşıyan tek bir JSON dokümanı |
| Hatalı öğeleri olan `validate` | 1 | tam rapor |
| İstem iptali (`store` grubu, insan modu) | 130 | sadece stderr |

## 6. Tanısal Kod Kataloğu

### Çözümleme (Resolution)
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; geçiş: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### OpenSpec-root Sağlığı (hata, düzeltme yok)
`openspec_store_root_missing`, `openspec_root_missing`, `openspec_config_missing`, `openspec_specs_missing`, `openspec_changes_missing`, `openspec_archive_missing`, her birinin `_not_directory` varyantları.

### Depo Kaydı/Kimlik/Durumu
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Depo Kurulumu/Kayıt/Kaldırma
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (kaldırmada uyarı, doctor'da hata), `store_root_not_directory`.

### Depo Git
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (uyarı), `store_clone_fragile_directories` (uyarı), `store_remote_divergence` (info, doctor).

### Referanslar (uyarı)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### İlişkiler (uyarı; doctor; context sadece kayıt olanı tutar)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Arşiv (JSON modu)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Context Yazımları
`context_file_exists`, `context_output_dir_missing`.

### Yedekleme (Fallbacks)
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Bilinen Tutarsızlıklar

Capstone denetimi tarafından kaydedilmiştir; yayınlanan anahtar yeniden adlandırmaları bu sürümden sonra ertelenmiş ürün kararlarıdır:

1. ~~JSON modunda, birkaç hata yolu sadece stderr'a JSON dokümanı olmadan yazdırıyordu.~~ Capstone gauntlet turunda düzeltildi: `show`/`validate` bilinmeyen ve muğlak öğeleri `{status:[{code: unknown_item | ambiguous_item, ...}]}` yayımlar; `status`/`instructions`/`list`/`show`/`validate` içindeki fırlatılan hatalar JSON'ı bilen hata yardımcı programından geçer (komutun null-şekli + `status`); `store <unknown subcommand> --json` `{status:[{code: unknown_store_subcommand}]}` yayımlar; `list`, çözme hatalarında `{changes|specs: [], root: null}` null-şeklini taşır.
2. `store_root_missing` iki şiddetle (kaldırmada uyarı, store doctor'da hata) yayımlan bir durumdur — bağlama bağlıdır, yukarıda belgelenmiştir.
3. snake_case (store ailesi) ve camelCase (iş akışı ailesi) anahtar büyük harflandırması; `root.store_id` her yerde snake_case'dir.
4. src içinde dört paralel zarf tipi bildirimi vardır; arşiv tanıları asla `target` taşımaz.
5. `list --json`, değişiklik başına bir dize enum olarak `status` anahtarını yeniden kullanır.
6. Sadece `validate` çıktısı bir `version` alanı taşır.
7. `schemas`/`templates` kök seçimini göz ardı eder (cwd tabanlı, `--store` yok).
8. Kullanım dışı bırakılmış isim formları (`change`/`spec` alt komutları) `root`/`status` içermeyen zarfsız yükler yayımlar.