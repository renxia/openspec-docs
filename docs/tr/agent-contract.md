# OpenSpec Ajan Sözleşmesi

`openspec` CLI'sinin makine okunabilir arayüzleri, `src/` dizinine karşı doğrulanmıştır (capstone denetimi, 2026-06-11). Aşağıdaki her yapı, yayınlayan koddan dokümante edilmiştir.

## 1. Genel Kurallar

- **Her çağrıda tek bir JSON belgesi.** `--json` modunda stdout tam olarak tek bir JSON belgesi taşır (2 boşluklu girintili biçimde). Doğal dil çıktısı, döner çubuklar ve mağaza afişi stderr'a yönlendirilir.
- **Mağaza afişi.** İnsan modunda, mağaza tarafından seçilen kök, stderr'a `Using OpenSpec root: <id> (<path>)` satırını yazdırır. JSON modunda hiçbir zaman yazdırılmaz.
- **Anahtar büyük/küçük harf kullanımı arayüze bağlıdır** (Bilinen tutarsızlıklara bakın): mağaza/doktor/bağlam yükleri `snake_case` kullanır; iş akışı yükleri (`status`, `instructions`, `new change`, `validate`, `list`) `camelCase` kullanır, ancak gömülü `root` nesnesi her zaman `store_id` anahtarını kullanır.
- **Çoğu yükte isteğe bağlı anahtarlar null olarak değil, tamamen çıkarılır** (ör. `root.store_id`, `member.path`). Açıkça `null` değeri kullanan istisnalar her yapı için özellikle belirtilir (mağaza doktoru `git.*`, hata yükleri).

## 2. Tanısal zarf

Her makine okunabilir tanısal (`StoreDiagnostic`) tarafından paylaşılan tek bir zarf şekli vardır:

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Tanısalar iki konumda görünür: Sağlık bulguları için **durum dizileri** (`status: StoreDiagnostic[]` üst düzeyde veya giriş başına) ve komut hatasında tek öğeli bir `status` dizisine dönüştürülen **ortaya atılan hatalar**.

## 3. Kök seçimi ve `RootOutput`

Tüm kök çözme komutları (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) tek bir öncelikle tek bir OpenSpec kökü çözer:

1. `--store <id>` → kayıtlı mağazanın kökü (`source: "store"`).
2. Aksi takdirde, `openspec/` içeren en yakın üst dizin: planlama şekli → `source: "nearest"` (bir `store:` işaretçisi stderr uyarısıyla yok sayılır); geçerli bir `store:` işaretçisi içeren yalnızca yapılandırma dizini → bu mağaza, `source: "declared"`.
3. En yakın kök yok + küresel `defaultStore` ayarlanmış (`openspec config set defaultStore <id>`) → bu mağaza, `source: "global_default"`; eski bir kimlik, temel alınan mağaza hatası ve `openspec config unset defaultStore` adlı bir `fix` ile başarısız olur.
4. En yakın kök yok, varsayılan yok + kayıtlı mağaza mevcut → `no_root_with_registered_stores` hatası.
5. Kök yok, varsayılan yok, mağaza yok: iskele komutları mevcut çalışma dizinini `source: "implicit"` olarak ele alır; tanısal komutlar (`doctor`, `context`) bunun yerine `no_openspec_root` hatasıyla başarısız olur — bunlar incelemek için kullanılır, asla iskele oluşturmaz.

Başarılı JSON yükleri kökü içerir:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Kök başarısızlığı sözleşmesi**: JSON modunda bir çözümleme başarısızlığında stdout üzerinden `{ ...commandNullShape, "status": [diagnostic] }` yazdırılır ve 1 çıkış koduyla çıkılır.

## 4. Komut JSON şekilleri

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — değişiklik başına `status` burada bir dize enum'dur. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Değişiklik: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spec: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Herhangi bir öğe başarısız olduğunda 1 çıkış koduyla çıkılır.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`. Her sanat eserinin `requires` alanı, doğrudan bağımlılık kimlikleridir (her durum için mevcuttur, bu nedenle sanat eseri `done` olsa bile geçişli gerekli küme hesaplanabilir); `missingDeps` yalnızca `blocked` olduğunda görünür. `"skipped"`, `.openspec.yaml` dosyasında `skip_specs: true` bildiren bir değişiklikte `generates` yolu `specs/` altında olan bir sanat eserini işaretler; bağımlılıkları karşılar ancak oluşturulmamalıdır. Aktif değişiklik yok: `{ "changes": [], "message", "root" }`, 0 çıkış koduyla çıkılır.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`. Değişiklik `skip_specs: true` bildirdiğinde ve bu sanat eseri atlandığında `"skipped": true` (ile `"warning"`) görünür — dosyalarını oluşturmayın. `skipped: true` olan bir bağımlılık girişi, dosyalar olmadan karşılanır — yollarını okumaya çalışmayın.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — çözülmüş girişler root/specs/fetch taşır; çözülmemiş olanlar store_id + uyarı durumu taşır. Dizin 50KB ile sınırlıdır (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Başarı: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Başarısızlık: `{ "change": null, "status": [d] }`, 1 çıkış koduyla çıkılır.

### 4.8 `archive <name> --json`
Başarı: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Başarısızlık: `{ "archive": null, "root"?, "status": [d] }`, 1 çıkış koduyla çıkılır. JSON modu kesinlikle etkileşimli değildir: her istem noktası bir `archive_*` koduna dönüştürülür.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`. `drift` (yalnızca yukarı akış izleme referansı olan git tabanlı bir mağaza kontrol çalıştırmasında mevcuttur), son çekilen yukarı akışa karşı ileri/geri sayımlarıdır, canlı uzak sunucuya değil. Herhangi bir şiddetteki sağlık bulguları 0 çıkış koduyla çıkılır. Başarısızlık yükü: `{ "root": null, "store": null, "references": [], "status": [d] }`, 1 çıkış koduyla çıkılır.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. MEVCUT = yol mevcut VE durum boş. `--code-workspace <path>` `{folders:[{name,path}]}` yazar (yalnızca mevcut referanslı mağazalar, `ref:` ön ekleri); JSON modunda yazma işlemi yazdırmadan önce çalışır, böylece yazma hatası olsa bile stdout tam olarak tek bir belge içerir. Başarısızlık: `{ "root": null, "members": [], "status": [d] }`, 1 çıkış koduyla çıkılır.

### 4.11 `store ... --json`
kurulum/kayıt: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. kaldırma/sil: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. listeleme: `{ "stores": [{id, root}], "status": [] }`. doktor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = bilinmiyor/incelenmedi). Sağlık bulguları 0 çıkış koduyla çıkılır; başarısızlıklar eşleşen boş şekil ile 1 çıkış koduyla çıkılır. İstem iptali 130 çıkış koduyla çıkılır.

### 4.12 `schemas --json` / `templates --json`
`schemas`: dizi `[ {name, description, artifacts, source} ]`. `templates`: anahtarlı nesne `{ "<artifactId>": {path, source} }`. Her ikisi de mevcut çalışma dizinine dayalıdır, kök/durum anahtarları yoktur.

## 5. Çıkış kodu sözleşmesi

| Durum | Çıkış | Stdout |
|---|---|---|
| Başarı, sağlık bulguları dahil (doctor/context/store doctor) | 0 | yük |
| `--json` modunda komut başarısızlığı | 1 | `status: [d]` ve komutun boş şekli içeren tek bir JSON belgesi |
| Başarısız öğeleri olan `validate` | 1 | tam rapor |
| İstem iptali (`store` grubu, insan modu) | 130 | yalnızca stderr |

## 6. Tanısal kod kataloğu

### Çözümleme
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; aktarma: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### OpenSpec kökü sağlığı (hata, düzeltme yok)
`openspec_store_root_missing`, `openspec_store_root_not_directory`, `openspec_root_missing`, `openspec_root_not_directory`, `openspec_config_missing`, `openspec_config_not_file`, `openspec_specs_not_directory`, `openspec_changes_not_directory`, `openspec_archive_not_directory`. Mağazalar beta sırasında, `openspec/specs/`, `openspec/changes/` ve `openspec/changes/archive/` sağlıklı bir kökte bulunmayabilir; yalnızca mevcut olduklarında ancak dizin olmadıklarında sağlık hatalarıdır.

### Mağaza kayıt defteri/kimlik/durum
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Mağaza kurulumu/kaydı/kaldırma
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_root_pointer_declared`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (kaldırmada uyarı, doktor modunda hata), `store_root_not_directory`.

### Mağaza git
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (warning), `store_clone_fragile_directories` (warning), `store_remote_divergence` (info, doctor), `store_checkout_drift` (info, doctor).

### Referanslar (uyarı)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### İlişkiler (uyarı; doktor; context yalnızca kayıt defteri olanı saklar)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Arşiv (JSON modu)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Context yazma işlemleri
`context_file_exists`, `context_output_dir_missing`.

### Geri dönüşler
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Bilinen tutarsızlıklar

Capstone denetimi tarafından kaydedildi; yayınlanan anahtar yeniden adlandırmaları bu sürümden sonra ertelenen ürün kararlarıdır:

1. ~~`--json` modunda, çeşitli başarısızlık yolları JSON belgesi olmadan yalnızca stderr yazdırıyordu.~~ Capstone gauntlet turunda düzeltildi: `show`/`validate` bilinmeyen ve belirsiz öğeleri `{status:[{code: unknown_item | ambiguous_item, ...}]}` yayar; `status`/`instructions`/`list`/`show`/`validate` içindeki ortaya atılan hatalar JSON farkında olan başarısızlık yardımcısından geçer (komutun boş şekli + `status`); `store <bilinmeyen alt komut> --json` `{status:[{code: unknown_store_subcommand}]}` yayar; `list`, çözümleme başarısızlıklarında `{changes|specs: [], root: null}` boş şeklini taşır.
2. `store_root_missing` iki şiddetle yayınlanır (kaldırmada uyarı, mağaza doktorunda hata) — bağlama bağlı, yukarıda belgelenmiştir.
3. snake_case (mağaza ailesi) ile camelCase (iş akışı ailesi) anahtar büyüklüğü karşılaştırması; `root.store_id` her yerde snake_case'tir.
4. src içinde dört paralel zarf türü bildirimi vardır; arşiv tanısaları asla `target` taşımaz.
5. `list --json`, değişiklik başına bir dize enum olarak `status` anahtarını yeniden kullanır.
6. Yalnızca `validate` çıktısı `version` alanını taşır.
7. `schemas`/`templates` kök seçimini yok sayar (mevcut çalışma dizinine dayalı, `--store` yok).
8. Kullanım dışı isim formları (`change`/`spec` alt komutları) `root`/`status` içermeyen zarlanmamış yükler yayar.