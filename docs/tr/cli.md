# CLI Referansı

OpenSpec CLI (`openspec`), proje kurulumu, doğrulama, durum inceleme ve yönetimi için terminal komutları sağlar. Bu komutlar, [Komutlar](commands.md) belgesinde belgelenen AI eğik çizgi komutlarını (örneğin `/opsx:propose`) tamamlar.

## Özet

| Kategori | Komutlar | Amaç |
|----------|----------|------|
| **Kurulum** | `init`, `update` | Projenizde OpenSpec'i başlatın ve güncelleyin |
| **Göz Atma** | `list`, `view`, `show` | Değişiklikleri ve spesifikasyonları keşfedin |
| **Doğrulama** | `validate` | Değişiklikleri ve spesifikasyonları sorunlar için kontrol edin |
| **Yaşam Döngüsü** | `archive` | Tamamlanmış değişiklikleri nihai hale getirin |
| **İş Akışı** | `status`, `instructions`, `templates`, `schemas` | Artefak odaklı iş akışı desteği |
| **Şemalar** | `schema init`, `schema fork`, `schema validate`, `schema which` | Özel iş akışlarını oluşturun ve yönetin |
| **Yapılandırma** | `config` | Ayarları görüntüleyin ve değiştirin |
| **Yardımcı Programlar** | `feedback`, `completion` | Geri bildirim ve kabuk entegrasyonu |

---

## İnsan ve Ajan Komutları

Çoğu CLI komutu, terminalde **insan kullanımı** için tasarlanmıştır. Bazı komutlar ayrıca JSON çıktısı aracılığıyla **otomatik/script kullanımı** destekler.

### Yalnızca İnsan Kullanımına Yönelik Komutlar

Bu komutlar etkileşimlidir ve terminal kullanımı için tasarlanmıştır:

| Komut | Amaç |
|---------|---------|
| `openspec init` | Projeyi başlat (etkileşimli istemler) |
| `openspec view` | Etkileşimli kontrol paneli |
| `openspec config edit` | Yapılandırmayı editörde aç |
| `openspec feedback` | GitHub aracılığıyla geri bildirim gönder |
| `openspec completion install` | Shell tamamlamalarını yükle |

### Ajan Uyumlu Komutlar

Bu komutlar, yapay zeka ajanları ve scriptler tarafından programlı kullanım için `--json` çıktısını destekler:

| Komut | İnsan Kullanımı | Ajan Kullanımı |
|---------|-----------|-----------|
| `openspec list` | Değişiklikleri/özellikleri gözden geçir | `--json` yapılandırılmış veri için |
| `openspec show <item>` | İçeriği oku | `--json` ayrıştırma için |
| `openspec validate` | Sorunları kontrol et | `--all --json` toplu doğrulama için |
| `openspec status` | Çıkarımların ilerlemesini gör | `--json` yapılandırılmış durum için |
| `openspec instructions` | Sonraki adımları al | `--json` ajan talimatları için |
| `openspec templates` | Şablon yollarını bul | `--json` yol çözümleme için |
| `openspec schemas` | Mevcut şemaları listele | `--json` şema keşfi için |

---

## Genel Seçenekler

Bu seçenekler tüm komutlarla çalışır:

| Seçenek | Açıklama |
|--------|-------------|
| `--version`, `-V` | Sürüm numarasını göster |
| `--no-color` | Renkli çıktıyı devre dışı bırak |
| `--help`, `-h` | Komut için yardımı göster |

---

## Kurulum Komutları

### `openspec init`

Projenizde OpenSpec'i başlatır. Klasör yapısını oluşturur ve yapay zeka araç entegrasyonlarını yapılandırır.

Varsayılan davranış, global yapılandırma varsayılanlarını kullanır: profil `core`, teslimat `her ikisi`, iş akışları `propose, explore, apply, archive`.

```
openspec init [path] [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `path` | Hayır | Hedef dizin (varsayılan: mevcut dizin) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--tools <list>` | Yapay zeka araçlarını etkileşimli olmadan yapılandır. `all`, `none` veya virgülle ayrılmış liste kullanın |
| `--force` | Eski dosyaları istemeden otomatik temizle |
| `--profile <profile>` | Bu başlatma çalışması için global profili geçersiz kıl (`core` veya `custom`) |

`--profile custom`, global yapılandırmada (`openspec config profile`) şu anda seçili olan iş akışlarını kullanır.

**Desteklenen araç kimlikleri (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

**Örnekler:**

```bash
# Etkileşimli başlatma
openspec init

# Belirli bir dizinde başlat
openspec init ./my-project

# Etkileşimli olmadan: Claude ve Cursor için yapılandır
openspec init --tools claude,cursor

# Tüm desteklenen araçlar için yapılandır
openspec init --tools all

# Bu çalışma için profili geçersiz kıl
openspec init --core

# İstemleri atla ve eski dosyaları otomatik temizle
openspec init --force
```

**Oluşturulan yapı:**

```
openspec/
├── specs/              # Özellikleriniz (gerçek kaynağı)
├── changes/            # Önerilen değişiklikler
└── config.yaml         # Proje yapılandırması

.claude/skills/         # Claude Code becerileri (claude seçildiyse)
.cursor/skills/         # Cursor becerileri (cursor seçildiyse)
.cursor/commands/       # Cursor OPSX komutları (teslimat komutları içeriyorsa)
... (diğer araç yapılandırmaları)
```

---

### `openspec update`

CLI yükseltildikten sonra OpenSpec talimat dosyalarını günceller. Mevcut global profilinizi, seçili iş akışlarınızı ve teslimat modunuzu kullanarak yapay zeka araç yapılandırma dosyalarını yeniden oluşturur.

```
openspec update [path] [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `path` | Hayır | Hedef dizin (varsayılan: mevcut dizin) |

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

## Gözden Geçirme Komutları

### `openspec list`

Projenizdeki değişiklikleri veya özellikleri listeler.

```
openspec list [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--specs` | Değişiklikler yerine özellikleri listele |
| `--changes` | Değişiklikleri listele (varsayılan) |
| `--sort <order>` | `recent` (varsayılan) veya `name` ile sırala |
| `--json` | JSON olarak çıktı ver |

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
  add-dark-mode     UI tema geçiş desteği
  fix-login-bug     Oturum zaman aşımı işleme
```

---

### `openspec view`

Özellikleri ve değişiklikleri keşfetmek için etkileşimli bir kontrol paneli görüntüler.

```
openspec view
```

Projenizin özelliklerini ve değişikliklerini gezinmek için terminal tabanlı bir arayüz açar.

---

### `openspec show`

Bir değişikliğin veya özelliğin ayrıntılarını görüntüler.

```
openspec show [item-name] [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `item-name` | Hayır | Değişikliğin veya özelliğin adı (belirtilmezse istemde bulunur) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--type <type>` | Türü belirtin: `change` veya `spec` (belirsizse otomatik algılanır) |
| `--json` | JSON olarak çıktı ver |
| `--no-interactive` | İstemleri devre dışı bırak |

**Değişikliğe özgü seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--deltas-only` | Yalnızca delta özelliklerini göster (JSON modu) |

**Özelliğe özgü seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--requirements` | Yalnızca gereksinimleri göster, senaryoları hariç tut (JSON modu) |
| `--no-scenarios` | Senaryo içeriğini hariç tut (JSON modu) |
| `-r, --requirement <id>` | 1 tabanlı indeksle belirli bir gereksinimi göster (JSON modu) |

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
openspec validate [item-name] [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `item-name` | Hayır | Doğrulanacak belirli bir öğe (belirtilmezse istemde bulunur) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--all` | Tüm değişiklikleri ve özellikleri doğrula |
| `--changes` | Tüm değişiklikleri doğrula |
| `--specs` | Tüm özellikleri doğrula |
| `--type <type>` | Ad belirsizken türü belirtin: `change` veya `spec` |
| `--strict` | Sıkı doğrulama modunu etkinleştir |
| `--json` | JSON olarak çıktı ver |
| `--concurrency <n>` | Maksimum paralel doğrulama (varsayılan: 6 veya `OPENSPEC_CONCURRENCY` ortam değişkeni) |
| `--no-interactive` | İstemleri devre dışı bırak |

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

# Artırılmış paralellikle sıkı doğrulama
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

Tamamlanmış bir değişikliği arşivler ve delta özelliklerini ana özelliklere birleştirir.

```
openspec archive [change-name] [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `change-name` | Hayır | Arşivlenecek değişiklik (belirtilmezse istemde bulunur) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `-y, --yes` | Onay istemlerini atla |
| `--skip-specs` | Özellik güncellemelerini atla (yalnızca altyapı/araç/belge değişiklikleri için) |
| `--no-validate` | Doğrulamayı atla (onay gerektirir) |

**Örnekler:**

```bash
# Etkileşimli arşivleme
openspec archive

# Belirli bir değişikliği arşivle
openspec archive add-dark-mode

# İstemler olmadan arşivleme (CI/scriptler için)
openspec archive add-dark-mode --yes

# Özellikleri etkilemeyen bir araç değişikliğini arşivle
openspec archive update-ci-config --skip-specs
```

**Yaptığı şey:**

1. Değişikliği doğrular (`--no-validate` yoksa)
2. Onay ister (`--yes` yoksa)
3. Delta özelliklerini `openspec/specs/` içine birleştirir
4. Değişiklik klasörünü `openspec/changes/archive/YYYY-MM-DD-<name>/` konumuna taşır

---

## İş Akışı Komutları

Bu komutlar, çıkarıma dayalı OPSX iş akışını destekler. Hem ilerlemeyi kontrol eden insanlar hem de sonraki adımları belirleyen ajanlar için faydalıdır.

### `openspec status`

Bir değişiklik için çıkarımların tamamlanma durumunu görüntüler.

```
openspec status [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--change <id>` | Değişiklik adı (belirtilmezse istemde bulunur) |
| `--schema <name>` | Şema geçersiz kılma (değişikliğin yapılandırmasından otomatik algılanır) |
| `--json` | JSON olarak çıktı ver |

**Örnekler:**

```bash
# Etkileşimli durum kontrolü
openspec status

# Belirli bir değişiklik için durum
openspec status --change add-dark-mode

# Ajan kullanımı için JSON
openspec status --change add-dark-mode --json
```

**Çıktı (metin):**

```
Değişiklik: add-dark-mode
Şema: spec-driven
İlerleme: 2/4 çıkarım tamamlandı

[x] proposal
[ ] design
[x] specs
[-] tasks (tasarım tarafından engellendi)
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

Bir çıkarım oluşturmak veya görevleri uygulamak için zenginleştirilmiş talimatlar alır. Yapay zeka ajanları tarafından neyin oluşturulacağını anlamak için kullanılır.

```
openspec instructions [artifact] [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `artifact` | Hayır | Çıkarım kimliği: `proposal`, `specs`, `design`, `tasks` veya `apply` |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--change <id>` | Değişiklik adı (etkileşimli olmayan modda gerekli) |
| `--schema <name>` | Şema geçersiz kılma |
| `--json` | JSON olarak çıktı ver |

**Özel durum:** Görev uygulama talimatlarını almak için `apply` olarak çıkarımı kullanın.

**Örnekler:**

```bash
# Sonraki çıkarım için talimatları al
openspec instructions --change add-dark-mode

# Belirli bir çıkarım talimatlarını al
openspec instructions design --change add-dark-mode

# Uygulama/uygulama talimatlarını al
openspec instructions apply --change add-dark-mode

# Ajan tüketimi için JSON
openspec instructions design --change add-dark-mode --json
```

**Çıktı şunları içerir:**

- Çıkarım için şablon içeriği
- Yapılandırmadan proje bağlamı
- Bağımlı çıkarımlardan içerik
- Yapılandırmadan çıkarıma özgü kurallar

---

### `openspec templates`

Bir şemadaki tüm çıkarımlar için çözümlenmiş şablon yollarını gösterir.

```
openspec templates [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--schema <name>` | İncelenecek şema (varsayılan: `spec-driven`) |
| `--json` | JSON olarak çıktı ver |

**Örnekler:**

```bash
# Varsayılan şema için şablon yollarını göster
openspec templates

# Özel şema için şablonları göster
openspec templates --schema my-workflow

# Programlı kullanım için JSON
openspec templates --json
```

**Çıktı (metin):**

```
Şema: spec-driven

Şablonlar:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Açıklamaları ve çıkarım akışlarıyla birlikte mevcut iş akışı şemalarını listeler.

```
openspec schemas [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--json` | JSON olarak çıktı ver |

**Örnek:**

```bash
openspec schemas
```

**Çıktı:**

```
Mevcut şemalar:

  spec-driven (paket)
    Varsayılan özellik驱动lı geliştirme iş akışı
    Akış: proposal → specs → design → tasks

  my-custom (proje)
    Bu proje için özel iş akışı
    Akış: research → proposal → tasks
```

---

## Şema Komutları

Özel iş akışı şemalarını oluşturmak ve yönetmek için komutlar.

### `openspec schema init`

Yeni bir projeye özel şema oluşturur.

```
openspec schema init <name> [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `name` | Evet | Şema adı (kebab-case) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--description <text>` | Şema açıklaması |
| `--artifacts <list>` | Virgülle ayrılmış artifact ID'leri (varsayılan: `proposal,specs,design,tasks`) |
| `--default` | Proje varsayılan şeması olarak ayarla |
| `--no-default` | Varsayılan olarak ayarlamak için sorma |
| `--force` | Mevcut şemanın üzerine yaz |
| `--json` | JSON olarak çıktı ver |

**Örnekler:**

```bash
# Etkileşimli şema oluşturma
openspec schema init research-first

# Belirli artifact'lerle etkileşim dışı oluşturma
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**Oluşturulan yapı:**

```
openspec/schemas/<name>/
├── schema.yaml           # Şema tanımı
└── templates/
    ├── proposal.md       # Her artifact için şablon
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Mevcut bir şemayı projenize kopyalayarak özelleştirin.

```
openspec schema fork <source> [name] [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `source` | Evet | Kopyalanacak şema |
| `name` | Hayır | Yeni şema adı (varsayılan: `<source>-custom`) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--force` | Mevcut hedefin üzerine yaz |
| `--json` | JSON olarak çıktı ver |

**Örnek:**

```bash
# Dahili spec-driven şemasını çatallama
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Bir şemanın yapısını ve şablonlarını doğrular.

```
openspec schema validate [name] [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `name` | Hayır | Doğrulanacak şema (belirtilmezse tümünü doğrular) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--verbose` | Ayrıntılı doğrulama adımlarını göster |
| `--json` | JSON olarak çıktı ver |

**Örnek:**

```bash
# Belirli bir şemayı doğrulama
openspec schema validate my-workflow

# Tüm şemaları doğrulama
openspec schema validate
```

---

### `openspec schema which`

Bir şemanın nereden çözüldüğünü gösterir (öncelik sırasını hata ayıklamak için yararlıdır).

```
openspec schema which [name] [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `name` | Hayır | Şema adı |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--all` | Tüm şemaları kaynaklarıyla birlikte listele |
| `--json` | JSON olarak çıktı ver |

**Örnek:**

```bash
# Bir şemanın nereden geldiğini kontrol etme
openspec schema which spec-driven
```

**Çıktı:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Şema öncelik sırası:**

1. Proje: `openspec/schemas/<name>/`
2. Kullanıcı: `~/.local/share/openspec/schemas/<name>/`
3. Paket: Dahili şemalar

---

## Yapılandırma Komutları

### `openspec config`

Genel OpenSpec yapılandırmasını görüntüleyin ve değiştirin.

```
openspec config <subcommand> [options]
```

**Alt komutlar:**

| Alt komut | Açıklama |
|------------|-------------|
| `path` | Yapılandırma dosyası konumunu göster |
| `list` | Mevcut tüm ayarları göster |
| `get <key>` | Belirli bir değeri al |
| `set <key> <value>` | Bir değer ayarla |
| `unset <key>` | Bir anahtarı kaldır |
| `reset` | Varsayılana sıfırla |
| `edit` | `$EDITOR` içinde aç |
| `profile [preset]` | İş akışı profilini etkileşimli olarak veya ön ayar aracılığıyla yapılandır |

**Örnekler:**

```bash
# Yapılandırma dosyası yolunu gösterme
openspec config path

# Tüm ayarları listeleme
openspec config list

# Belirli bir değeri alma
openspec config get telemetry.enabled

# Bir değer ayarlama
openspec config set telemetry.enabled false

# Bir dize değerini açıkça ayarlama
openspec config set user.name "My Name" --string

# Özel bir ayarı kaldırma
openspec config unset user.name

# Tüm yapılandırmayı sıfırlama
openspec config reset --all --yes

# Yapılandırmayı düzenleyicide düzenleme
openspec config edit

# Eyleme dayalı sihirbazla profili yapılandırma
openspec config profile

# Hızlı ön ayar: iş akışlarını core'a değiştir (teslim modunu korur)
openspec config profile core
```

`openspec config profile`, mevcut durum özetiyle başlar ve ardından şunları seçmenize olanak tanır:
- Teslimatı + iş akışlarını değiştir
- Sadece teslimatı değiştir
- Sadece iş akışlarını değiştir
- Mevcut ayarları koru (çık)

Mevcut ayarları korursanız, hiçbir değişiklik yazılmaz ve güncelleme istemi gösterilmez.
Yapılandırma değişikliği yoksa ancak mevcut proje dosyaları genel profilinizle/teslimatınızla senkronize değilse, OpenSpec bir uyarı gösterecek ve `openspec update` çalıştırmanızı önerecektir.
`Ctrl+C` tuşuna basmak da akışı temiz bir şekilde iptal eder (yığın izi göstermez) ve `130` çıkış koduyla çıkar.
İş akışı kontrol listesinde, `[x]` iş akışının genel yapılandırmada seçili olduğunu belirtir. Bu seçimleri proje dosyalarına uygulamak için `openspec update` çalıştırın (veya bir projenin içinde istendiğinde `Apply changes to this project now?` seçeneğini tercih edin).

**Etkileşimli örnekler:**

```bash
# Sadece teslimat güncellemesi
openspec config profile
# seç: Change delivery only
# teslimatı seç: Skills only

# Sadece iş akışı güncellemesi
openspec config profile
# seç: Change workflows only
# kontrol listesindeki iş akışlarını açıp kapatın, ardından onaylayın
```

---

## Yardımcı Komutlar

### `openspec feedback`

OpenSpec hakkında geri bildirim gönderir. Bir GitHub sorunu oluşturur.

```
openspec feedback <message> [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `message` | Evet | Geri bildirim mesajı |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--body <text>` | Detaylı açıklama |

**Gereksinimler:** GitHub CLI (`gh`) kurulu ve kimlik doğrulanmış olmalıdır.

**Örnek:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

OpenSpec CLI için kabuk tamamlamalarını yönetin.

```
openspec completion <subcommand> [shell]
```

**Alt komutlar:**

| Alt komut | Açıklama |
|------------|-------------|
| `generate [shell]` | Tamamlama betiğini stdout'a yazdır |
| `install [shell]` | Kabuğunuz için tamamlamayı kur |
| `uninstall [shell]` | Kurulu tamamlamaları kaldır |

**Desteklenen kabuklar:** `bash`, `zsh`, `fish`, `powershell`

**Örnekler:**

```bash
# Tamamlamaları kurma (kabuğu otomatik algılar)
openspec completion install

# Belirli bir kabuk için kurma
openspec completion install zsh

# Manuel kurulum için betik oluşturma
openspec completion generate bash > ~/.bash_completion.d/openspec

# Kaldırma
openspec completion uninstall
```

---

## Çıkış Kodları

| Kod | Anlam |
|------|---------|
| `0` | Başarılı |
| `1` | Hata (doğrulama hatası, eksik dosyalar, vb.) |

---

## Ortam Değişkenleri

| Değişken | Açıklama |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Telemetriyi devre dışı bırakmak için `0` olarak ayarlayın |
| `DO_NOT_TRACK` | Telemetriyi devre dışı bırakmak için `1` olarak ayarlayın (standart DNT sinyali) |
| `OPENSPEC_CONCURRENCY` | Toplu doğrulama için varsayılan eşzamanlılık (varsayılan: 6) |
| `EDITOR` veya `VISUAL` | `openspec config edit` için düzenleyici |
| `NO_COLOR` | Ayarlandığında renkli çıktıyı devre dışı bırakır |

---

## İlgili Belgeler

- [Komutlar](commands.md) - Yapay zeka eğik çizgi komutları (`/opsx:propose`, `/opsx:apply`, vb.)
- [İş Akışları](workflows.md) - Yaygın kalıplar ve her komutun ne zaman kullanılacağı
- [Özelleştirme](customization.md) - Özel şemalar ve şablonlar oluşturma
- [Başlangıç](getting-started.md) - İlk kurulum kılavuzu