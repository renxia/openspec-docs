# CLI Referansı

OpenSpec CLI (`openspec`), proje kurulumu, doğrulama, durum incelemesi ve yönetim için terminal komutları sağlar. Bu komutlar, [Komutlar](commands.md) bölümünde belgelenen AI eğik çizgi komutlarını (örneğin `/opsx:propose`) tamamlar.

## Özet

| Kategori | Komutlar | Amaç |
|----------|----------|------|
| **Kurulum** | `init`, `update` | Projenizde OpenSpec'i başlatın ve güncelleyin |
| **Çalışma Alanları (beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace open` | Bağlı depolar veya klasörler arasında planlama yapın |
| **Göz Atma** | `list`, `view`, `show` | Değişiklikleri ve özellikleri keşfedin |
| **Doğrulama** | `validate` | Değişiklikleri ve özellikleri sorunlara karşı kontrol edin |
| **Yaşam Döngüsü** | `archive` | Tamamlanan değişiklikleri sonlandırın |
| **İş Akışı** | `status`, `instructions`, `templates`, `schemas` | Yapıt odaklı iş akışı desteği |
| **Şemalar** | `schema init`, `schema fork`, `schema validate`, `schema which` | Özel iş akışları oluşturun ve yönetin |
| **Yapılandırma** | `config` | Ayarları görüntüleyin ve değiştirin |
| **Yardımcı Araçlar** | `feedback`, `completion` | Geri bildirim ve kabuk entegrasyonu |

---

## İnsan ve Agent Komutları

Çoğu CLI komutu terminalde **insan kullanımı** için tasarlanmıştır. Bazı komutlar ayrıca JSON çıktısı aracılığıyla **agent/betik kullanımını** destekler.

### Yalnızca İnsan Komutları

Bu komutlar etkileşimlidir ve terminal kullanımı için tasarlanmıştır:

| Komut | Amaç |
|---------|---------|
| `openspec init` | Projeyi başlat (etkileşimli istemler) |
| `openspec view` | Etkileşimli kontrol paneli |
| `openspec config edit` | Yapılandırmayı düzenleyicide aç |
| `openspec feedback` | GitHub üzerinden geri bildirim gönder |
| `openspec completion install` | Kabuk tamamlamalarını yükle |

### Agent Uyumlu Komutlar

Bu komutlar, AI agent'lar ve betikler tarafından programatik kullanım için `--json` çıktısını destekler:

| Komut | İnsan Kullanımı | Agent Kullanımı |
|---------|-----------|-----------|
| `openspec list` | Değişiklikleri/spec'leri göz at | Yapılandırılmış veri için `--json` |
| `openspec show <item>` | İçeriği oku | Ayrıştırma için `--json` |
| `openspec validate` | Sorunları kontrol et | Toplu doğrulama için `--all --json` |
| `openspec status` | Eser ilerlemesini gör | Yapılandırılmış durum için `--json` |
| `openspec instructions` | Sonraki adımları al | Agent talimatları için `--json` |
| `openspec templates` | Şablon yollarını bul | Yol çözümlemesi için `--json` |
| `openspec schemas` | Mevcut şemaları listele | Şema keşfi için `--json` |
| `openspec workspace setup --no-interactive` | Açık girdilerle bir çalışma alanı oluştur | Yapılandırılmış kurulum çıktısı için `--json` |
| `openspec workspace list` | Bilinen çalışma alanlarını göz at | Tipik çalışma alanı nesneleri için `--json` |
| `openspec workspace link` | Bir depo veya klasörü bağla | Yapılandırılmış bağlantı çıktısı için `--json` |
| `openspec workspace relink` | Bağlı bir yolu onar | Yapılandırılmış bağlantı çıktısı için `--json` |
| `openspec workspace doctor` | Bir çalışma alanını kontrol et | Yapılandırılmış durum çıktısı için `--json` |

---

## Global Seçenekler

Bu seçenekler tüm komutlarla çalışır:

| Seçenek | Açıklama |
|--------|-------------|
| `--version`, `-V` | Sürüm numarasını göster |
| `--no-color` | Renkli çıktıyı devre dışı bırak |
| `--help`, `-h` | Komut için yardımı görüntüle |

---

## Kurulum Komutları

### `openspec init`

Projenizde OpenSpec'i başlatır. Klasör yapısını oluşturur ve AI araç entegrasyonlarını yapılandırır.

Varsayılan davranış, global yapılandırma varsayılanlarını kullanır: profil `core`, teslimat `both`, iş akışları `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `path` | Hayır | Hedef dizin (varsayılan: geçerli dizin) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--tools <list>` | AI araçlarını etkileşimli olmayan şekilde yapılandır. `all`, `none` veya virgülle ayrılmış liste kullanın |
| `--force` | Eski dosyaları sormadan otomatik temizle |
| `--profile <profile>` | Bu başlatma çalışması için global profili geçersiz kıl (`core` veya `custom`) |

`--profile custom`, global yapılandırmada (`openspec config profile`) şu anda seçili olan iş akışlarını kullanır.

**Desteklenen araç kimlikleri (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**Örnekler:**

```bash
# Etkileşimli başlatma
openspec init

# Belirli bir dizinde başlatma
openspec init ./my-project

# Etkileşimli olmayan: Claude ve Cursor için yapılandırma
openspec init --tools claude,cursor

# Tüm desteklenen araçlar için yapılandırma
openspec init --tools all

# Bu çalışma için profili geçersiz kıl
openspec init --profile core

# İstemleri atla ve eski dosyaları otomatik temizle
openspec init --force
```

**Oluşturdukları:**

```
openspec/
├── specs/              # Şartnameleriniz (gerçekliğin kaynağı)
├── changes/            # Önerilen değişiklikler
└── config.yaml         # Proje yapılandırması

.claude/skills/         # Claude Code becerileri (claude seçilmişse)
.cursor/skills/         # Cursor becerileri (cursor seçilmişse)
.cursor/commands/       # Cursor OPSX komutları (teslimat komutları içeriyorsa)
... (diğer araç yapılandırmaları)
```

---

### `openspec update`

CLI yükseltmesinden sonra OpenSpec talimat dosyalarını günceller. Mevcut global profilinizi, seçili iş akışlarınızı ve teslimat modunuzu kullanarak AI araç yapılandırma dosyalarını yeniden oluşturur.

```
openspec update [path] [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `path` | Hayır | Hedef dizin (varsayılan: geçerli dizin) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--force` | Dosyalar güncel olsa bile güncellemeyi zorla |

**Örnek:**

```bash
# npm yükseltmesinden sonra talimat dosyalarını güncelle
npm update @fission-ai/openspec
openspec update
```

---

## Çalışma Alanı Komutları

Çalışma alanı komutları aktif geliştirme aşamasındadır ve henüz kullanıma hazır değildir. Bu komut yüzeyi üzerine harici otomasyon, entegrasyon veya uzun ömürlü iş akışları oluşturmayın; komut davranışları, durum dosyaları ve JSON çıktısı herhangi bir anda değişebilir.

Koordinasyon çalışma alanları, birden fazla depoyu veya klasörü kapsayan çalışmalar için planlama evleridir. Çalışma alanı görünürlüğü değişiklik taahhüdü değildir: OpenSpec'in bilmesi gereken depoları veya klasörleri bağlayın, ardından belirli bir iş planlamaya hazır olduğunuzda değişiklikler oluşturun.

### `openspec workspace setup`

Standart OpenSpec çalışma alanı konumunda bir çalışma alanı oluşturur ve en az bir mevcut depoyu veya klasörü bağlar.

```bash
openspec workspace setup [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--name <name>` | Çalışma alanı adı. Adlar kebab-case olmalıdır |
| `--link <path>` | Mevcut bir depoyu veya klasörü bağla ve bağlantı adını klasör adından çıkar |
| `--link <name>=<path>` | Açık bir bağlantı adıyla mevcut bir depoyu veya klasörü bağla |
| `--opener <id>` | Etkileşimli olmayan kurulum sırasında tercih edilen bir açıcı saklayın: `codex`, `claude`, `github-copilot` veya `editor` |
| `--no-interactive` | İstemleri devre dışı bırak; `--name` ve en az bir `--link` gerektirir |
| `--json` | JSON çıktısı ver; `--no-interactive` gerektirir |

**Örnekler:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

Etkileşimli kurulum, tercih edilen bir açıcı ister ve makineye özgü çalışma alanı durumunda saklar. Etkileşimli olmayan kurulum, yalnızca `--opener` sağlandığında tercih edilen bir açıcı saklar; aksi takdirde `workspace open`, desteklenen bir açıcı mevcut olduğunda etkileşimli terminallerde daha sonra ister veya betiklerden `--agent <tool>` veya `--editor` geçirmesini ister.

### `openspec workspace list`

Yerel kayıt defterinden bilinen OpenSpec çalışma alanlarını listeler.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

Liste, her çalışma alanının konumunu ve bağlı depoları veya klasörleri gösterir. Eski kayıt defteri kayıtları rapor edilir ancak değiştirilmez.

### `openspec workspace link`

Bir çalışma alanı için mevcut bir depoyu veya klasörü kaydeder.

```bash
openspec workspace link [name] <path> [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--workspace <name>` | Yerel kayıt defterinden bilinen bir çalışma alanı seçin |
| `--json` | JSON çıktısı ver |
| `--no-interactive` | Çalışma alanı seçici istemlerini devre dışı bırak |

**Örnekler:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

Yol zaten mevcut olmalıdır. Göreceli yollar, OpenSpec doğrulanmış mutlak yolu makineye özgü çalışma alanında saklamadan önce komutun geçerli dizinine göre çözümlenir. Bağlı yollar, depo yerel `openspec/` durumu olmayan tam depolar, paketler, hizmetler, uygulamalar veya klasörler olabilir.

### `openspec workspace relink`

Mevcut bir bağlantının yerel yolunu onarın veya değiştirin.

```bash
openspec workspace relink <name> <path> [options]
```

Yol zaten mevcut olmalıdır. Relink, yalnızca kararlı bağlantı adı için makineye özgü yolu günceller.

### `openspec workspace doctor`

Bir çalışma alanının geçerli makinede neleri çözebileceğini kontrol edin.

```bash
openspec workspace doctor [options]
```

Doctor, çalışma alanı konumunu, planlama yolunu, bağlı depoları veya klasörleri, eksik yolları, mevcut olduğunda depo yerel spec yollarını ve önerilen düzeltmeleri gösterir. Yalnızca sorunları rapor eder; otomatik olarak onarmaz.

Bir çalışma alanına ihtiyaç duyan komutlar, bir çalışma alanı klasöründen veya alt dizininden çalıştırıldığında geçerli çalışma alanını kullanır. Başka bir yerden, `--workspace <name>` geçin, etkileşimli bir terminalde seçiciyi kullanın veya yalnızca bir tane mevcut olduğunda tek bilinen çalışma alanına güvenin. `--json` veya `--no-interactive` modunda, belirsiz seçim yapılandırılmış bir durum hatasıyla başarısız olur ve `--workspace <name>` önerir.

JSON yanıtları, tipik nesnelerin yanı sıra `status` dizileri kullanır. Birincil veriler `workspace`, `workspaces` veya `link` içinde yaşar; uyarılar ve hatalar `status` içinde yaşar.

### `openspec workspace open`

Saklanan tercih edilen açıcı, tek oturumluk bir agent geçersiz kılması veya VS Code düzenleyici modu aracılığıyla bir çalışma alanı çalışma kümesini açın.

```bash
openspec workspace open [name] [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--workspace <name>` | Konumsal çalışma alanı adı için takma ad |
| `--agent <tool>` | Tek oturumluk agent geçersiz kılması: `codex`, `claude` veya `github-copilot` |
| `--editor` | Bakımlı VS Code çalışma alanı dosyasını normal bir düzenleyici çalışma alanı olarak açın |
| `--no-interactive` | Çalışma alanı ve açıcı seçici istemlerini devre dışı bırak |

**Örnekler:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex
openspec workspace open --editor
```

`workspace open`, birinin içinde çalıştırıldığında geçerli çalışma alanını kullanır, başka bir yerde çalıştırıldığında tek bilinen çalışma alanını otomatik seçer ve birden fazla çalışma alanı bilindiğinde kullanıcıdan seçim yapmasını ister. `--agent` ve `--editor`, saklanan tercih edilen açıcıyı değiştirmez. Her iki açıcı geçersiz kılmasını geçirmek bir hatadır; ya `--agent <tool>` ya da `--editor` seçin.

OpenSpec, VS Code düzenleyici ve GitHub Copilot-in-VS-Code açmaları için çalışma alanı kökünde `<workspace-name>.code-workspace` dosyasını korur. Bu dosya makineye özgüdür ve varsayılan olarak belirli bir `<workspace-name>.code-workspace` `.gitignore` girdisiyle yoksayılır, böylece kullanıcı tarafından oluşturulan `*.code-workspace` dosyaları izleme için uygun olmaya devam eder.

Bakımlı VS Code çalışma alanı, koordinasyon kökünü `.` olarak ve geçerli bağlı depoları veya klasörleri ek kökler olarak içerir. VS Code bu girdileri çok köklü bir çalışma alanı olarak görüntüler.

Kök çalışma alanı açma, bağlı depolar veya klasörler genelinde keşif ve planlamayı destekler. Uygulama düzenlemeleri yalnızca açık bir kullanıcı isteği ve normal bir OpenSpec uygulama iş akışından sonra başlamalıdır.

## Tarama Komutları

### `openspec list`

Projenizdeki değişiklikleri veya özellikleri listeler.

```
openspec list [seçenekler]
```

**Seçenekler:**

| Seçenek | Açıklama |
|---------|----------|
| `--specs` | Değişiklikler yerine özellikleri listeler |
| `--changes` | Değişiklikleri listeler (varsayılan) |
| `--sort <sıra>` | `recent` (varsayılan) veya `name` ile sıralar |
| `--json` | Çıktıyı JSON olarak verir |

**Örnekler:**

```bash
# Tüm aktif değişiklikleri listele
openspec list

# Tüm özellikleri listele
openspec list --specs

# Scriptler için JSON çıktısı
openspec list --json
```

**Çıktı (metin):**

```
Aktif değişiklikler:
  add-dark-mode     UI tema değiştirme desteği
  fix-login-bug     Oturum zaman aşımı işleme
```

---

### `openspec view`

Özellikleri ve değişiklikleri keşfetmek için etkileşimli bir gösterge tablosu görüntüler.

```
openspec view
```

Projenizin spesifikasyonlarında ve değişikliklerinde gezinmek için terminal tabanlı bir arayüz açar.

---

### `openspec show`

Bir değişikliğin veya özelliğin ayrıntılarını görüntüler.

```
openspec show [öğe-adı] [seçenekler]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|---------|---------|----------|
| `öğe-adı` | Hayır | Değişiklik veya özelliğin adı (atlanırsa sorulur) |

**Seçenekler:**

| Seçenek | Açıklama |
|---------|----------|
| `--type <tür>` | Türü belirtir: `change` veya `spec` (belirsizlik yoksa otomatik algılanır) |
| `--json` | Çıktıyı JSON olarak verir |
| `--no-interactive` | İstemleri devre dışı bırakır |

**Değişikliğe özgü seçenekler:**

| Seçenek | Açıklama |
|---------|----------|
| `--deltas-only` | Yalnızca delta spesifikasyonlarını gösterir (JSON modu) |

**Özelliğe özgü seçenekler:**

| Seçenek | Açıklama |
|---------|----------|
| `--requirements` | Yalnızca gereksinimleri gösterir, senaryoları hariç tutar (JSON modu) |
| `--no-scenarios` | Senaryo içeriğini hariç tutar (JSON modu) |
| `-r, --requirement <id>` | 1 tabanlı dizine göre belirli bir gereksinimi gösterir (JSON modu) |

**Örnekler:**

```bash
# Etkileşimli seçim
openspec show

# Belirli bir değişikliği göster
openspec show add-dark-mode

# Belirli bir özelliği göster
openspec show auth --type spec

# Ayrıştırma için JSON çıktısı
openspec show add-dark-mode --json
```

---

## Doğrulama Komutları

### `openspec validate`

Değişiklikleri ve özellikleri yapısal sorunlar için doğrular.

```
openspec validate [öğe-adı] [seçenekler]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|---------|---------|----------|
| `öğe-adı` | Hayır | Doğrulanacak belirli öğe (atlanırsa sorulur) |

**Seçenekler:**

| Seçenek | Açıklama |
|---------|----------|
| `--all` | Tüm değişiklikleri ve özellikleri doğrular |
| `--changes` | Tüm değişiklikleri doğrular |
| `--specs` | Tüm özellikleri doğrular |
| `--type <tür>` | Ad belirsiz olduğunda türü belirtir: `change` veya `spec` |
| `--strict` | Katı doğrulama modunu etkinleştirir |
| `--json` | Çıktıyı JSON olarak verir |
| `--concurrency <n>` | Maksimum paralel doğrulama sayısı (varsayılan: 6 veya `OPENSPEC_CONCURRENCY` ortam değişkeni) |
| `--no-interactive` | İstemleri devre dışı bırakır |

**Örnekler:**

```bash
# Etkileşimli doğrulama
openspec validate

# Belirli bir değişikliği doğrula
openspec validate add-dark-mode

# Tüm değişiklikleri doğrula
openspec validate --changes

# Her şeyi JSON çıktısıyla doğrula (CI/scriptler için)
openspec validate --all --json

# Artırılmış paralellikle katı doğrulama
openspec validate --all --strict --concurrency 12
```

**Çıktı (metin):**

```
add-dark-mode doğrulanıyor...
  ✓ proposal.md geçerli
  ✓ specs/ui/spec.md geçerli
  ⚠ design.md: "Teknik Yaklaşım" bölümü eksik

1 uyarı bulundu
```

**Çıktı (JSON):**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: missing 'Technical Approach' section"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## Yaşam Döngüsü Komutları

### `openspec archive`

Tamamlanmış bir değişikliği arşivleyin ve delta spesifikasyonlarını ana spesifikasyonlarla birleştirin.

```
openspec archive [değişiklik-adı] [seçenekler]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `değişiklik-adı` | Hayır | Arşivlenecek değişiklik (atlanırsa kullanıcıya sorulur) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `-y, --yes` | Onay istemlerini atla |
| `--skip-specs` | Spesifikasyon güncellemelerini atla (altyapı/araç/dokümantasyon odaklı değişiklikler için) |
| `--no-validate` | Doğrulamayı atla (onay gerektirir) |

**Örnekler:**

```bash
# Etkileşimli arşivleme
openspec archive

# Belirli bir değişikliği arşivle
openspec archive add-dark-mode

# İstemler olmadan arşivle (CI/scripts için)
openspec archive add-dark-mode --yes

# Spesifikasyonları etkilemeyen bir araç değişikliğini arşivle
openspec archive update-ci-config --skip-specs
```

**Ne yapar:**

1. Değişikliği doğrular (`--no-validate` belirtilmedikçe)
2. Onay ister (`--yes` belirtilmedikçe)
3. Delta spesifikasyonlarını `openspec/specs/` diziniyle birleştirir
4. Değişiklik klasörünü `openspec/changes/archive/YYYY-MM-DD-<ad>/` dizinine taşır

---

## İş Akışı Komutları

Bu komutlar, eser odaklı OPSX iş akışını destekler. Hem ilerlemeyi kontrol eden insanlar hem de sonraki adımları belirleyen ajanlar için kullanışlıdır.

### `openspec status`

Bir değişiklik için eser tamamlanma durumunu görüntüler.

```
openspec status [seçenekler]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--change <id>` | Değişiklik adı (atlanırsa kullanıcıya sorulur) |
| `--schema <ad>` | Şema geçersiz kılma (değişikliğin yapılandırmasından otomatik algılanır) |
| `--json` | Çıktıyı JSON olarak ver |

**Örnekler:**

```bash
# Etkileşimli durum kontrolü
openspec status

# Belirli bir değişikliğin durumu
openspec status --change add-dark-mode

# Ajan kullanımı için JSON
openspec status --change add-dark-mode --json
```

**Çıktı (metin):**

```
Değişiklik: add-dark-mode
Şema: spec-driven
İlerleme: 4 eserden 2'si tamamlandı

[x] teklif
[ ] tasarım
[x] spesifikasyonlar
[-] görevler (engellendi: tasarım)
```

**Çıktı (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done"},
    {"id": "design", "outputPath": "design.md", "status": "ready"},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done"},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

Bir eser oluşturmak veya görevleri uygulamak için zenginleştirilmiş talimatlar alır. Yapay zeka ajanları tarafından bir sonraki neyin oluşturulacağını anlamak için kullanılır.

```
openspec instructions [eser] [seçenekler]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `eser` | Hayır | Eser Kimliği: `proposal`, `specs`, `design`, `tasks` veya `apply` |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--change <id>` | Değişiklik adı (etkileşimli olmayan modda zorunludur) |
| `--schema <ad>` | Şema geçersiz kılma |
| `--json` | Çıktıyı JSON olarak ver |

**Özel durum:** Görev uygulama talimatlarını almak için `apply` eserini kullanın.

**Örnekler:**

```bash
# Bir sonraki eser için talimatları al
openspec instructions --change add-dark-mode

# Belirli bir eser için talimatları al
openspec instructions design --change add-dark-mode

# Uygulama/uygulama talimatlarını al
openspec instructions apply --change add-dark-mode

# Ajan tüketimi için JSON
openspec instructions design --change add-dark-mode --json
```

**Çıktı şunları içerir:**

- Eser için şablon içeriği
- Yapılandırmadan proje bağlamı
- Bağımlılık eserlerinden gelen içerik
- Yapılandırmadan eser başına kurallar

---

### `openspec templates`

Bir şemadaki tüm eserler için çözümlenmiş şablon yollarını gösterir.

```
openspec templates [seçenekler]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--schema <ad>` | İncelenecek şema (varsayılan: `spec-driven`) |
| `--json` | Çıktıyı JSON olarak ver |

**Örnekler:**

```bash
# Varsayılan şema için şablon yollarını göster
openspec templates

# Özel şema için şablonları göster
openspec templates --schema my-workflow

# Programatik kullanım için JSON
openspec templates --json
```

**Çıktı (metin):**

```
Şema: spec-driven

Şablonlar:
  teklif    → ~/.openspec/schemas/spec-driven/templates/proposal.md
  spesifikasyonlar → ~/.openspec/schemas/spec-driven/templates/specs.md
  tasarım   → ~/.openspec/schemas/spec-driven/templates/design.md
  görevler  → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Açıklamaları ve eser akışlarıyla birlikte mevcut iş akışı şemalarını listeler.

```
openspec schemas [seçenekler]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--json` | Çıktıyı JSON olarak ver |

**Örnek:**

```bash
openspec schemas
```

**Çıktı:**

```
Mevcut şemalar:

  spec-driven (paket)
    Varsayılan spesifikasyon odaklı geliştirme iş akışı
    Akış: teklif → spesifikasyonlar → tasarım → görevler

  my-custom (proje)
    Bu proje için özel iş akışı
    Akış: araştırma → teklif → görevler
```

---

## Şema Komutları

Özel iş akışı şemaları oluşturmak ve yönetmek için komutlar.

### `openspec schema init`

Yeni bir proje yerel şeması oluşturun.

```
openspec schema init <ad> [seçenekler]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `ad` | Evet | Şema adı (kebab-case) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--description <metin>` | Şema açıklaması |
| `--artifacts <liste>` | Virgülle ayrılmış eser kimlikleri (varsayılan: `proposal,specs,design,tasks`) |
| `--default` | Projenin varsayılan şeması olarak ayarla |
| `--no-default` | Varsayılan olarak ayarlamak için sorma |
| `--force` | Mevcut şemanın üzerine yaz |
| `--json` | Çıktıyı JSON olarak ver |

**Örnekler:**

```bash
# Etkileşimli şema oluşturma
openspec schema init research-first

# Belirli eserlerle etkileşimli olmayan
openspec schema init rapid \
  --description "Hızlı yineleme iş akışı" \
  --artifacts "proposal,tasks" \
  --default
```

**Ne oluşturur:**

```
openspec/schemas/<ad>/
├── schema.yaml           # Şema tanımı
└── templates/
    ├── proposal.md       # Her eser için şablon
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Özelleştirmek için mevcut bir şemayı projenize kopyalayın.

```
openspec schema fork <kaynak> [ad] [seçenekler]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `kaynak` | Evet | Kopyalanacak şema |
| `ad` | Hayır | Yeni şema adı (varsayılan: `<kaynak>-custom`) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--force` | Mevcut hedefin üzerine yaz |
| `--json` | Çıktıyı JSON olarak ver |

**Örnek:**

```bash
# Dahili spec-driven şemasını dallandır
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Bir şemanın yapısını ve şablonlarını doğrulayın.

```
openspec schema validate [ad] [seçenekler]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `ad` | Hayır | Doğrulanacak şema (atlanırsa tümünü doğrular) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--verbose` | Ayrıntılı doğrulama adımlarını göster |
| `--json` | Çıktıyı JSON olarak ver |

**Örnek:**

```bash
# Belirli bir şemayı doğrula
openspec schema validate my-workflow

# Tüm şemaları doğrula
openspec schema validate
```

---

### `openspec schema which`

Bir şemanın nereden çözümlendiğini gösterir (önceliklendirme için kullanışlıdır).

```
openspec schema which [ad] [seçenekler]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `ad` | Hayır | Şema adı |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--all` | Tüm şemaları kaynaklarıyla birlikte listele |
| `--json` | Çıktıyı JSON olarak ver |

**Örnek:**

```bash
# Bir şemanın nereden geldiğini kontrol et
openspec schema which spec-driven
```

**Çıktı:**

```
spec-driven şu kaynaktan çözümleniyor: paket
  Kaynak: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Şema önceliği:**

1. Proje: `openspec/schemas/<ad>/`
2. Kullanıcı: `~/.local/share/openspec/schemas/<ad>/`
3. Paket: Dahili şemalar

---

## Yapılandırma Komutları

### `openspec config`

Global OpenSpec yapılandırmasını görüntüleyin ve değiştirin.

```
openspec config <alt komut> [seçenekler]
```

**Alt Komutlar:**

| Alt Komut | Açıklama |
|-----------|----------|
| `path` | Yapılandırma dosyası konumunu göster |
| `list` | Tüm mevcut ayarları göster |
| `get <anahtar>` | Belirli bir değeri al |
| `set <anahtar> <değer>` | Bir değer ayarla |
| `unset <anahtar>` | Bir anahtarı kaldır |
| `reset` | Varsayılanlara sıfırla |
| `edit` | `$EDITOR`'da aç |
| `profile [ön ayar]` | İş akışı profilini interaktif olarak veya ön ayar aracılığıyla yapılandır |

**Örnekler:**

```bash
# Yapılandırma dosyası yolunu göster
openspec config path

# Tüm ayarları listele
openspec config list

# Belirli bir değeri al
openspec config get telemetry.enabled

# Bir değer ayarla
openspec config set telemetry.enabled false

# Bir dizi değerini açıkça ayarla
openspec config set user.name "My Name" --string

# Özel bir ayarı kaldır
openspec config unset user.name

# Tüm yapılandırmayı sıfırla
openspec config reset --all --yes

# Yapılandırmayı editörünüzde düzenleyin
openspec config edit

# Eylem tabanlı sihirbazla profili yapılandır
openspec config profile

# Hızlı ön ayar: İş akışlarını çekirdeğe geçir (teslim modunu korur)
openspec config profile core
```

`openspec config profile` mevcut durum özetiyle başlar, ardından şunları seçmenize olanak tanır:
- Teslimat + iş akışlarını değiştir
- Yalnızca teslimatı değiştir
- Yalnızca iş akışlarını değiştir
- Mevcut ayarları koru (çıkış)

Mevcut ayarları korursanız, hiçbir değişiklik yazılmaz ve güncelleme istemi gösterilmez.
Yapılandırma değişikliği olmasa da mevcut proje dosyaları global profiliniz/teslimatınızla senkronize değilse, OpenSpec bir uyarı gösterecek ve `openspec update` komutunu çalıştırmanızı önerecektir.
`Ctrl+C`'ye basmak da akışı temizce iptal eder (yığın izi yok) ve `130` koduyla çıkar.
İş akışı kontrol listesinde `[x]`, iş akışının global yapılandırmada seçili olduğu anlamına gelir. Bu seçimleri proje dosyalarına uygulamak için `openspec update` komutunu çalıştırın (veya bir proje içindeyken istendiğinde `Bu projeye şimdi değişiklikleri uygula?` seçeneğini seçin).

**İnteraktif örnekler:**

```bash
# Yalnızca teslimat güncellemesi
openspec config profile
# seçin: Yalnızca teslimatı değiştir
# teslimat seçin: Yalnızca beceriler

# Yalnızca iş akışı güncellemesi
openspec config profile
# seçin: Yalnızca iş akışlarını değiştir
# kontrol listesindeki iş akışlarını değiştirin, ardından onaylayın
```

---

## Yardımcı Komutlar

### `openspec feedback`

OpenSpec hakkında geri bildirim gönderin. Bir GitHub sorunu oluşturur.

```
openspec feedback <mesaj> [seçenekler]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|---------|---------|----------|
| `mesaj` | Evet | Geri bildirim mesajı |

**Seçenekler:**

| Seçenek | Açıklama |
|---------|----------|
| `--body <metin>` | Ayrıntılı açıklama |

**Gereksinimler:** GitHub CLI (`gh`) kurulu ve kimlik doğrulaması yapılmış olmalıdır.

**Örnek:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

OpenSpec CLI için kabuk tamamlamalarını yönetin.

```
openspec completion <alt komut> [kabuk]
```

**Alt Komutlar:**

| Alt Komut | Açıklama |
|-----------|----------|
| `generate [kabuk]` | Tamamlama betiğini stdout'a çıktıla |
| `install [kabuk]` | Kabuğunuz için tamamlamayı yükleyin |
| `uninstall [kabuk]` | Yüklü tamamlamaları kaldırın |

**Desteklenen kabuklar:** `bash`, `zsh`, `fish`, `powershell`

**Örnekler:`

```bash
# Tamamlamaları yükle (kabuğu otomatik algılar)
openspec completion install

# Belirli bir kabuk için yükle
openspec completion install zsh

# Manuel kurulum için betik oluştur
openspec completion generate bash > ~/.bash_completion.d/openspec

# Kaldır
openspec completion uninstall
```

---

## Çıkış Kodları

| Kod | Anlamı |
|-----|--------|
| `0` | Başarılı |
| `1` | Hata (doğrulama hatası, eksik dosyalar vb.) |

---

## Ortam Değişkenleri

| Değişken | Açıklama |
|----------|----------|
| `OPENSPEC_TELEMETRY` | Telemetriyi devre dışı bırakmak için `0` olarak ayarlayın |
| `DO_NOT_TRACK` | Telemetriyi devre dışı bırakmak için `1` olarak ayarlayın (standart DNT sinyali) |
| `OPENSPEC_CONCURRENCY` | Toplu doğrulama için varsayılan eşzamanlılık (varsayılan: 6) |
| `EDITOR` veya `VISUAL` | `openspec config edit` için editör |
| `NO_COLOR` | Ayarlandığında renkli çıktıyı devre dışı bırakır |

---

## İlgili Belgeler

- [Komutlar](commands.md) - AI eğik çizgi komutları (`/opsx:propose`, `/opsx:apply`, vb.)
- [İş Akışları](workflows.md) - Yaygın kalıplar ve her komutun ne zaman kullanılacağı
- [Özelleştirme](customization.md) - Özel şablonlar ve şemalar oluşturma
- [Başlarken](getting-started.md) - İlk kurulum rehberi