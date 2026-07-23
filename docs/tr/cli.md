# CLI Referansı

OpenSpec CLI'si (`openspec`), proje kurulumu, doğrulama, durum incelemesi ve yönetimi için terminal komutları sağlar. Bu komutlar, [Komutlar](commands.md) belgesinde belgelenen AI slash komutlarına (örneğin `/opsx:propose`) ek olarak gelir.

## Özet

| Kategori | Komutlar | Amaç |
|----------|----------|------|
| **Kurulum** | `init`, `update` | Projenizde OpenSpec'i başlatın ve güncelleyin |
| **Mağazalar (bağımsız OpenSpec depoları)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Mağazaları yönetin — kaydettiğiniz bağımsız OpenSpec depoları |
| **Sağlık** | `doctor` | Çözümlenmiş kök için ilişki sağlığını raporlayın |
| **Çalışma bağlamı** | `context` | Çalışma kümesini (kök + referans verilen mağazalar) bir araya getirin |
| **Kişisel çalışma kümeleri** | `workset create`, `workset list`, `workset open`, `workset remove` | Aracınızda kişisel, yerel çalışma görünümlerini saklayın ve açın |
| **Göz atma** | `list`, `view`, `show` | Değişiklikleri ve spesifikasyonları keşfedin |
| **Doğrulama** | `validate` | Değişiklikleri ve spesifikasyonları olası sorunlar açısından kontrol edin |
| **Yaşam döngüsü** | `archive` | Tamamlanmış değişiklikleri arşivleyin |
| **İş akışı** | `new change`, `status`, `instructions`, `templates`, `schemas` | Artefakt odaklı iş akışı desteği |
| **Şemalar** | `schema init`, `schema fork`, `schema validate`, `schema which` | Özel iş akışları oluşturun ve yönetin |
| **Yapılandırma** | `config` | Ayarları görüntüleyin ve değiştirin |
| **Yardımcı araçlar** | `feedback`, `completion` | Geri bildirim ve kabuk entegrasyonu |

---

## İnsan ve Aracı Komutları

Çoğu CLI komutu terminalde **insan kullanımı** için tasarlanmıştır. Bazı komutlar ayrıca JSON çıktısı ile **aracı/komut dosyası kullanımı** için de destek sağlar.

### Sadece İnsan Kullanımına Yönelik Komutlar

Bu komutlar etkileşimlidir ve terminal kullanımı için tasarlanmıştır:

| Komut | Amaç |
|-------|------|
| `openspec init` | Proje başlat (etkileşimli istemler) |
| `openspec view` | Etkileşimli kontrol paneli |
| `openspec workset open <name>` | Kayıtlı bir çalışma setini aç (düzenleyici penceresi veya terminal aracı oturumu) |
| `openspec config edit` | Yapılandırmayı düzenleyicide aç |
| `openspec feedback` | GitHub üzerinden geri bildirim gönder |
| `openspec completion install` | Kabuk tamamlamalarını yükle |

### Aracıyla Uyumlu Komutlar

Bu komutlar, AI aracıları ve komut dosyaları tarafından programatik kullanım için `--json` çıktısını destekler:

| Komut | İnsan Kullanımı | Aracı Kullanımı |
|-------|-----------------|-----------------|
| `openspec list` | Değişiklikler/spec'leri göz at | Yapılandırılmış veri için `--json` |
| `openspec show <item>` | İçeriği oku | Ayrıştırma için `--json` |
| `openspec validate` | Sorunları kontrol et | Toplu doğrulama için `--all --json` |
| `openspec status` | Artefakt ilerlemesini gör | Yapılandırılmış durum için `--json` |
| `openspec instructions` | Sonraki adımları al | Aracı talimatları için `--json` |
| `openspec templates` | Şablon yollarını bul | Yol çözümleme için `--json` |
| `openspec schemas` | Mevcut şemaları listele | Şema keşfi için `--json` |
| `openspec store setup <id>` | Yerel bir mağaza oluştur ve kaydet | Yapılandırılmış kurulum çıktısı için açık girdilerle `--json` |
| `openspec store register <path>` | Mevcut bir mağazayı kaydet | Yapılandırılmış kayıt çıktısı için `--json` |
| `openspec store unregister <id>` | Yerel mağaza kaydını unut | Yapılandırılmış temizlik çıktısı için `--json` |
| `openspec store remove <id>` | Kayıtlı yerel mağaza klasörünü sil | Etkileşimsiz silme için `--yes --json` |
| `openspec store list` | Kayıtlı mağazaları göz at | Yapılandırılmış kayıtlar için `--json` |
| `openspec store doctor` | Yerel mağaza kurulumunu kontrol et | Yapılandırılmış teşhis için `--json` |
| `openspec new change <id>` | Depo içi değişiklik iskeleti oluştur | Kayıtlı bir mağazayı OpenSpec kökü olarak kullanmak için `--json` ve ek olarak `--store <id>` |
| `openspec workset create [name]` | Kişisel bir çalışma görünümü oluştur | Etkileşimsiz oluşturma için `--member <path> --json` |
| `openspec workset list` | Kayıtlı çalışma setlerini göz at | Yapılandırılmış görünümler için `--json` |
| `openspec workset remove <name>` | Kayıtlı bir görünümü sil | Etkileşimsiz kaldırma için `--yes --json` |

---

## Genel Seçenekler

Bu seçenekler tüm komutlarla çalışır:

| Seçenek | Açıklama |
|--------|----------|
| `--version`, `-V` | Sürüm numarasını göster |
| `--no-color` | Renkli çıktıyı devre dışı bırak |
| `--help`, `-h` | Komut için yardımı göster |

---

## Kurulum Komutları

### `openspec init`

Projenizde OpenSpec'i başlatın. Klasör yapısını oluşturur ve AI araç entegrasyonlarını yapılandırır.

Varsayılan davranış, global yapılandırma varsayılanlarını kullanır: profil `core`, teslimat `both`, iş akışları `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|---------|---------|----------|
| `path` | Hayır | Hedef dizin (varsayılan: mevcut dizin) |

**Seçenekler:**

| Seçenek | Açıklama |
|---------|----------|
| `--tools <list>` | AI araçlarını etkileşimsiz olarak yapılandır. `all`, `none` veya virgülle ayrılmış liste kullanın |
| `--force` | Eski dosyaları sormadan otomatik olarak temizle |
| `--profile <profile>` | Bu init çalıştırması için global profili geçersiz kıl (`core` veya `custom`) |

`--profile custom`, global yapılandırmada şu anda seçili olan iş akışlarını kullanır (`openspec config profile`).

**Desteklenen araç kimlikleri (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

> Bu liste, `src/core/config.ts` içindeki `AI_TOOLS` ile eşleşir. Her aracın beceri ve komut yolları için [Desteklenen Araçlar](supported-tools.md) sayfasına bakın.

**Örnekler:**

```bash
# Etkileşimli başlatma
openspec init

# Belirli bir dizinde başlat
openspec init ./my-project

# Etkileşimsiz: Claude ve Cursor için yapılandır
openspec init --tools claude,cursor

# Tüm desteklenen araçlar için yapılandır
openspec init --tools all

# Bu çalıştırma için profili geçersiz kıl
openspec init --profile core

# İstemleri atla ve eski dosyaları otomatik temizle
openspec init --force
```

**Oluşturduğu içerikler:**

```
openspec/
├── specs/              # Spesifikasyonlarınız (doğru kaynak)
├── changes/            # Önerilen değişiklikler
└── config.yaml         # Proje yapılandırması

.claude/skills/         # Claude Code becerileri (eğer claude seçilmişse)
.cursor/skills/         # Cursor becerileri (eğer cursor seçilmişse)
.cursor/commands/       # Cursor OPSX komutları (eğer teslimat komutları içeriyorsa)
... (diğer araç yapılandırmaları)
```

---

### `openspec update`

CLI'ı yükselttikten sonra OpenSpec talimat dosyalarını güncelleyin. Mevcut global profiliniz, seçili iş akışlarınız ve teslimat modunuzu kullanarak AI araç yapılandırma dosyalarını yeniden oluşturun.

```
openspec update [path] [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|---------|---------|----------|
| `path` | Hayır | Hedef dizin (varsayılan: mevcut dizin) |

**Seçenekler:**

| Seçenek | Açıklama |
|---------|----------|
| `--force` | Dosyalar güncel olsa bile güncellemeyi zorla |

**Örnek:**

```bash
# npm yükselmesinden sonra talimat dosyalarını güncelle
npm update @fission-ai/openspec
openspec update
```

---

## Mağazalar (bağımsız OpenSpec depoları)

> **Beta.** Mağazalar ve üzerine inşa edilen özellikler (referanslar, çalışma bağlamı, çalışma setleri) yenidir; komut isimleri, bayraklar, dosya formatları ve JSON çıktısı sürümler arasında değişebilir. Sorun odaklı geçiş için [mağazalar rehberine](stores-beta/user-guide.md) bakın.

Bir mağaza, bu makinede kaydettiğiniz bağımsız bir OpenSpec deposudur — örneğin bir planlama deposu veya sözleşme deposu. Bir mağazayı kaydettikten sonra normal komutların (`list`, `show`, `status`, `validate`, `new change`, `archive`, ...) herhangi bir yerden `--store <id>` ile bu depoda çalışmasını sağlarsınız.

### `openspec store setup`

Yerel bir mağaza oluşturun ve kaydedin. Terminalde argüman verilmeden çalıştırıldığında OpenSpec kullanıcıyı kurulum adımlarında yönlendirir. Aracılar ve komut dosyaları açık girdiler vermeli ve `--json` kullanmalıdır.

```bash
openspec store setup [id] [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|---------|----------|
| `--path <path>` | Mağazanın bulunacağı klasör (örneğin `~/openspec/<id>`) |
| `--remote <url>` | Yeni mağazanın `store.yaml` dosyasına standart uzak depoyu kaydet |
| `--init-git` | İlk commit ile bir Git deposu başlat (varsayılan) |
| `--no-init-git` | Tüm Git işlemlerini atla: başlatma yok, ilk commit yok |
| `--json` | JSON çıktısı ver |

Etkileşimsiz çalıştırmalar (`--json`, komut dosyaları, aracılar) hem mağaza kimliğini hem de `--path`'i vermek zorundadır. Etkileşimli bir terminalde, kurulum kullanıcıya ait, görünür bir yerde düzenlenebilir bir konum önerisiyle konum sorar (örneğin `~/openspec/<id>`); hiçbir zaman OpenSpec tarafından yönetilen veri dizinini varsayılan olarak kullanmaz.

Örnekler:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Mevcut bir yerel mağaza klasörünü kaydedin. Mağazalar beta sürecinde, herhangi bir değişiklik oluşturulmadan, spec'ler uygulanmadan veya değişiklikler arşivlenmeden önce bir kök kaydedilebilir; bu durumda normal komutlar oluşturana kadar `openspec/changes/`, `openspec/specs/` ve `openspec/changes/archive/` klasörleri bulunmayabilir. Sadece `store: <id>` bildiren yalnızca yapılandırma deposu, başka bir mağazaya işaretçi olarak kalır ve bu işaretçi kaldırılmadığı sürece mağaza kökü olarak kaydedilmez.

```bash
openspec store register [path] [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|---------|----------|
| `--id <id>` | Mağaza kimliği; varsayılan olarak mağaza meta verileri veya klasör adıdır |
| `--yes` | Sağlıklı bir OpenSpec kökü için mağaza kimlik meta verileri oluşturmayı onayla |
| `--json` | JSON çıktısı ver |

### `openspec store unregister`

Dosyaları silmeden yerel mağaza kaydını unut.

```bash
openspec store unregister <id> [--json]
```

Bir mağaza taşındığında, başka bir yere klonlandığında veya bu makinede OpenSpec tarafından artık gösterilmemesi gerektiğinde bunu kullanın.

### `openspec store remove`

Yerel mağaza kaydını unut ve yerel klasörünü sil.

```bash
openspec store remove <id> [--yes] [--json]
```

`remove`, etkileşimli bir terminalde silmeden önce tam klasörü gösterir. Aracılar, komut dosyaları ve JSON çağıranları silmeyi onaylamak için `--yes` geçmek zorundadır. OpenSpec, eşleşen mağaza meta verileri içermeyen bir klasörü silmeyi reddeder.

### `openspec store list`

Yerel olarak kayıtlı mağazaları listele.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Yerel mağaza kaydını, meta verilerini ve Git varlığını kontrol et.

```bash
openspec store doctor [id] [--json]
```

Doctor yalnızca teşhis amaclıdır; mağazayı değiştirmeden eksik kökleri, meta veri uyumsuzluklarını ve geçersiz yerel kayıt defteri durumunu raporlar.

---

### Bir projeden mağazalara referans verme

Bir proje deposu, çalışmalarının hangi mağazalardan yararlandığını `openspec/config.yaml` dosyasında bildirebilir:

```yaml
schema: spec-driven
references:
  - team-context
```

Bundan sonra, bu depodaki `openspec instructions` çıktısı (hem artefakt başına hem de `apply` yüzeyleri, JSON ve insan modları) her referans verilen mağazanın spec'lerinin bir dizinini taşır — spec kimlikleri, her spec'in Amaç bölümünden tek satırlık özet ve getirme komutu (`openspec show <spec-id> --type spec --store <id>`). Dizin her çalıştırmada kayıtlı checkout'tan canlı olarak oluşturulur; spec içeriği hiçbir zaman çıktıya kopyalanmaz.

Referanslar yalnızca okunabilir bağlamdır. Komutların nerede çalıştığını hiçbir zaman değiştirmezler: çalışma deposunun kendi kökünde kalır ve referans verilen bir mağazaya yazmak yine açık bir `--store` eylemidir. Çözümlenemeyen bir referans (örneğin bu makinede kayıtlı olmayan bir mağaza), dizinde tam olarak düzeltme adımı içeren bir uyarıya düşer ve talimatlar yine de oluşturulur. `openspec doctor`, referans sağlığını tek bir yerde raporlar.

---

### Bir mağazanın nereden klonlandığını kaydetme

Bir mağaza, standart klon kaynağını işlenmiş kimlik dosyasına kaydedebilir, böylece yeni kullanıcı ekleme asla "mağazayı kaydet" adımında takılı kalmaz:

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

Uzak depo, ilk commit içindeki `.openspec-store/store.yaml` dosyasına kaydedilir, böylece her klon bunu doğduğu andan bilir. Mevcut bir mağaza için `store.yaml` dosyasını elle düzenleyin ve commit edin. `store doctor`, kaydedilmiş uzak depoyu (ve checkout'un gözlemlenen Git kaynağını) gösterir; kurulum/kayıt paylaşım rehberi ona bir isim verir ve kayıt işlemi, checkout'un kaynağını makine yerel kayıt defterine kaydeder.

Bir referans bildirimine klon kaynağı da eklenebilir, böylece mağazaya henüz sahip olmayan bir ekip üyesi tamamen, yapıştırılabilir bir düzeltme alır (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

Uzak depo kaydetmek senkronizasyon değildir: OpenSpec hiçbir zaman kendi başına klonlama, çekme veya gönderme işlemi yapmaz.

---

### Varsayılan mağaza bildirme

Planlaması tamamen dışa aktarılmış bir depo — yerel `openspec/specs/` veya `openspec/changes/` klasörü yok — her komutta `--store` geçmek yerine mağazasını bir kez bildirebilir:

```yaml
# openspec/config.yaml (openspec/ altındaki tek dosya)
store: team-context
```

Ardından normal komutlar otomatik olarak bildirilen mağazaya yönlendirilir; kök afişi ve JSON `root` bloğu mağaza kimliği ile birlikte `source: "declared"` olarak raporlar ve yazdırılan ipuçları yine `--store <id>` taşır. Bu bildirim bir yedek olarak çalışır, asla geçersiz kılmaz: açık `--store` her zaman kazanır ve gerçek planlama klasörleri içeren bir dizin işaretçiyi yok sayar (bir uyarı ile). Bir işaretçi deposunu yerel bir OpenSpec köküne dönüştürmek için `store:` satırını kaldırın ve `openspec init` komutunu çalıştırın — bildirim mevcut olduğu sürece init iskelet oluşturmayı reddeder.

Makine düzeyinde bir varyant tüm depoları tek seferde kapsar: `openspec config set defaultStore <id>` (Yapılandırma bölümüne bakın). Bu seçenek yalnızca `--store`, yerel bir kök ve proje işaretçisi hepsi çözümlenemedikten sonra kullanılır; kök afişi ve JSON `root` bloğu ardından `source: "global_default"` olarak raporlar.

## Doktor (ilişki sağlığı)

Tek salt okunur soru, tek yer: OpenSpec kökü sağlıklı mı ve referans verdiği depolar bu makinede kullanılabilir mi?

```bash
openspec doctor [--store <id>] [--json]
```

Rapor, kök sağlığını, depo meta verisi sağlığını (kaydedilmiş uzak depo ile checkout'un orijini ayrıldığında bir not, ve depo checkout'ının son çekilen üst akış izleme referansının gerisinde kaldığında bir not içerir) ve referans sağlığını (çözümlenmemiş referanslar için klonlama düzeltmeleriyle birlikte aynı tanılama talimatlarını gösterir) ayırır. Herhangi bir şiddetteki sağlık bulguları 0 çıkış koduyla sonlanır — ajanlar `status` dizilerini okur; sadece komut hataları (kök yok, bilinmeyen depo) 1 çıkış koduyla sonlanır. Doktor asla klonlama, senkronizasyon veya onarım yapmaz. Sağlık durumu yerine bir araya getirilmiş küme setinin kendisini almak için `openspec context` komutunu kullanın.

## Çalışma bağlamı (bir araya getirilmiş küme)

Bu çalışmanın OpenSpec bildirimleri aracılığıyla ilişkili olduğu her şey, tek bir çalışma kümesinde: OpenSpec kökü ve referans verdiği depolar.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

JSON özeti ajanlar tarafından tüketilebilir (her kullanılabilir referans verilen depo, getirme tarifini taşır; çözümlenmemiş üyeler aynı düzeltme talimatlarını ve doktor çıktısını taşır). `--code-workspace` ayrıca kökü ve kullanılabilir referans verilen depoları (`ref:<id>` klasörleri) içeren bir VS Code çalışma alanı dosyası yazar — bu komutun gerçekleştirdiği tek yazma işlemi, dosya zaten varsa `--force` parametresi olmadan reddedilir. Kullanılamayan üyeler raporlanır, asla tahmin edilmez.

"Çalışma bağlamı" bir araya getirilmiş kümedir; `openspec/config.yaml` içindeki `context:` alanı ise talimatlara enjekte edilen proje arka planıdır — iki farklı şeydir. `openspec doctor` kümenin sağlıklı olup olmadığını yanıtlar; `openspec context` ise kümenin ne olduğunu yanıtlar.

## Kişisel çalışma kümeleri (workset)

> **Beta.** Workset'ler yeni beta yüzeyin bir parçasıdır; komutlar, bayraklar ve dosya formatları sürümler arasında değişiklik gösterebilir. Adım adım kullanım kılavuzu için [mağaza rehberine](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together) bakın.

Bir workset, birlikte çalıştığınız klasörlerin kişisel, adlandırılmış bir görünümüdür — bir planlama kökü ve istediğiniz diğer klasörler — makinenizde saklanır ve araçlarınızda adıyla yeniden açılır. Tamamen yereldir: hiçbir zaman işlenmez, paylaşılmaz, bildirimlerden türetilmez ve bir workset silindiğinde hiçbir üye klasöre dokunulmaz.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` komutu kısa bir adım adım akış çalıştırır (veya `--member` bayraklarını etkileşimsiz olarak alır; ilk üye birincil üyedir — oturumlar orada başlar). `open` komutu seçili aracı başlatır: düzenleyiciler (VS Code, Cursor) tüm üyeleri içeren bir pencere açar ve geri döner; CLI aracıları (Claude Code, codex) tüm üyeler ekli, önceden doldurulmuş bir istem olmadan bu terminali bir oturum olarak alır ve siz çıkana kadar devam eder. Açılırken eksik olan bir üye klasörü bir notla atlanır; geri kalanı açılır. Kaydedilmiş araç tercihi, her açışta `--tool` bayrağıyla geçersizdirilebilir.

Yeni bir aracı desteklemek kod değişikliği değil, yapılandırma işlemidir. Her araç iki başlatma stilinden birine sahiptir — `workspace-file` (oluşturulan `.code-workspace` dosyasıyla başlatılır) veya `attach-dirs` (üye başına bir ekleme bayrağı) — ve genel `config.json` dosyasındaki `openers` anahtarı (`openspec config edit` komutuyla açılabilir) araçları ekler veya yerel araçları alan bazında ayarlar:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Tüm workset durumu, genel veri dizinindeki `worksets/` klasörü altında bulunur (kaydedilmiş görünümler ve her açılışta yeniden oluşturulan `<name>.code-workspace` dosyaları); bu klasörü silmek tüm izleri temizler.

---

## Tarama Komutları

### `openspec list`

Projenizdeki değişiklikleri veya spec'leri listeler.

```
openspec list [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|----------|
| `--specs` | Değişiklikler yerine spec'leri listeler |
| `--changes` | Değişiklikleri listeler (varsayılan) |
| `--sort <order>` | `recent` (varsayılan) veya `name` ile sırala |
| `--json` | JSON olarak çıktı ver |

**Örnekler:**

```bash
# Tüm aktif değişiklikleri listele
openspec list

# Tüm spec'leri listele
openspec list --specs

# Script'ler için JSON çıktısı
openspec list --json
```

**Çıktı (metin):**

```
Değişiklikler:
  add-dark-mode     Görev yok      az önce
```

---

### `openspec view`

Spec'leri ve değişiklikleri keşfetmek için etkileşimli bir gösterge paneli görüntüler.

```
openspec view
```

Projenizin spec'lerini ve değişikliklerini gezinmek için terminal tabanlı bir arayüz açar.

---

### `openspec show`

Bir değişikliğin veya spec'in ayrıntılarını görüntüler.

```
openspec show [item-name] [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|---------|----------|
| `item-name` | Hayır | Değişiklik veya spec adı (belirtilmezse sorulur) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|----------|
| `--type <type>` | Türü belirt: `change` veya `spec` (belirsiz değilse otomatik algılanır) |
| `--json` | JSON olarak çıktı ver |
| `--no-interactive` | İstemleri devre dışı bırak |

**Değişiklik özel seçenekleri:**

| Seçenek | Açıklama |
|--------|----------|
| `--deltas-only` | Sadece delta spec'leri göster (JSON modu) |

**Spec özel seçenekleri:**

| Seçenek | Açıklama |
|--------|----------|
| `--requirements` | Sadece gereksinimleri göster, senaryoları hariç tut (JSON modu) |
| `--no-scenarios` | Senaryo içeriğini hariç tut (JSON modu) |
| `-r, --requirement <id>` | 1 tabanlı indekse göre belirli gereksinimi göster (JSON modu) |

**Örnekler:**

```bash
# Etkileşimli seçim
openspec show

# Belirli bir değişikliği göster
openspec show add-dark-mode

# Belirli bir spec'i göster
openspec show auth --type spec

# Ayrıştırma için JSON çıktısı
openspec show add-dark-mode --json
```

---

## Doğrulama Komutları

### `openspec validate`

Değişiklikleri ve spec'leri yapısal sorunlar için doğrular.

```
openspec validate [item-name] [options]
```

Sıfır spec delta'sı olan bir değişiklik, `.openspec.yaml` dosyasında `skip_specs: true` beyan edilmediği sürece doğrulamadan geçemez (saf yeniden düzenlemeler, araç alanı değişiklikleri veya dokümantasyon çalışmaları için — bkz. [Tarif 5](examples.md#recipe-5-a-refactor-with-no-behavior-change)).

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|---------|----------|
| `item-name` | Hayır | Doğrulanacak belirli öğe (belirtilmezse sorulur) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|----------|
| `--all` | Tüm değişiklikleri ve spec'leri doğrula |
| `--changes` | Tüm değişiklikleri doğrula |
| `--specs` | Tüm spec'leri doğrula |
| `--type <type>` | Ad belirsiz olduğunda türü belirt: `change` veya `spec` |
| `--strict` | Katı doğrulama modunu etkinleştir |
| `--json` | JSON olarak çıktı ver |
| `--concurrency <n>` | Maksimum paralel doğrulama sayısı (varsayılan: 6, veya `OPENSPEC_CONCURRENCY` ortam değişkeni) |
| `--no-interactive` | İstemleri devre dışı bırak |

**Örnekler:**

```bash
# Etkileşimli doğrulama
openspec validate

# Belirli bir değişikliği doğrula
openspec validate add-dark-mode

# Tüm değişiklikleri doğrula
openspec validate --changes

# CI/script'ler için JSON çıktısı ile her şeyi doğrula
openspec validate --all --json

# Artırılmış paralellik ile katı doğrulama
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
        "warnings": ["design.md: 'Teknik Yaklaşım' bölümü eksik"]
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

Tamamlanmış bir değişikliği arşivle ve delta spec'leri ana spec'lere birleştir.

```
openspec archive [change-name] [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|---------|----------|
| `change-name` | Hayır | Arşivlenecek değişiklik (belirtilmezse sorulur) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|----------|
| `-y, --yes` | Onay istemlerini atla |
| `--skip-specs` | Tek arşivleme çalıştırması için spec güncellemelerini atla. Kalıcı olarak hiç spec delta'sı olmayan bir değişiklik, bunun yerine `.openspec.yaml` dosyasında `skip_specs: true` beyan etmelidir — bayrak kullanmadan arşivlenir |
| `--no-validate` | Doğrulamayı atla (onay gerektirir) |

**Örnekler:**

```bash
# Etkileşimli arşivleme
openspec archive

# Belirli bir değişikliği arşivle
openspec archive add-dark-mode

# İstemler olmadan arşivle (CI/script'ler için)
openspec archive add-dark-mode --yes

# Spec'leri etkilemeyen bir araç alanı değişikliğini arşivle
openspec archive update-ci-config --skip-specs
```

**Ne yapar?:**

1. Değişikliği doğrular (`--no-validate` belirtilmediği sürece)
2. Onay için sorar (`--yes` belirtilmediği sürece)
3. Delta spec'leri `openspec/specs/` dizinine birleştirir
4. Değişiklik klasörünü `openspec/changes/archive/YYYY-MM-DD-<name>/` dizinine taşır

---

## İş Akışı Komutları

Bu komutlar, esna odaklı OPSX iş akışını destekler. Hem ilerlemeyi kontrol eden insanlar hem de sonraki adımları belirleyen aracılar için kullanışlıdır.

### `openspec new change`

Çözümlenmiş OpenSpec kök dizininde bir değişiklik klasörü ve isteğe bağlı kontrol edilmiş meta veriler oluşturur.

```bash
openspec new change <name> [options]
```

Değişiklik adları küçük harf kebab-case kullanmalıdır. Küçük harfle başlar,
ardından küçük harfler, sayılar ve tek tireler içerir. Sayı ile başlayamaz,
boşluk, alt çizgi, büyük harf, ardışık tireler veya başta/sonda tire içeremez.
Harici bir bilet ID'si eklerken, örneğin `123-add-notifications` yerine bir kelime ön ek ekleyin,
örneğin `ticket-123-add-notifications`.

**Seçenekler:**

| Seçenek | Açıklama |
|--------|----------|
| `--description <text>` | `index.md` dosyasına eklenecek açıklama |
| `--goal <text>` | Değişiklikle birlikte saklanacak isteğe bağlı hedef meta verisi |
| `--schema <name>` | Kullanılacak iş akışı şeması |
| `--store <id>` | OpenSpec kök dizini olarak kullanılacak mağaza ID'si (mağaza, kaydettiğiniz bağımsız bir OpenSpec deposudur) |
| `--json` | JSON çıktısı ver |

Örnekler:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Bir değişiklik için esna tamamlanma durumunu görüntüler.

```
openspec status [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|----------|
| `--change <id>` | Değişiklik adı (belirtilmezse sorulur) |
| `--schema <name>` | Şema geçersiz kılma (değişikliğin yapılandırmasından otomatik algılanır) |
| `--json` | JSON olarak çıktı ver |

**Örnekler:**

```bash
# Etkileşimli durum kontrolü
openspec status

# Belirli bir değişiklik için durum
openspec status --change add-dark-mode

# Aracı kullanımı için JSON
openspec status --change add-dark-mode --json
```

**Çıktı (metin):**

```
Değişiklik: add-dark-mode
Şema: spec-driven
İlerleme: 2/4 esna tamamlandı

[x] öneri
[ ] tasarım
[x] spec'ler
[-] görevler (engelleyen: tasarım)
```

`skip_specs: true` beyan eden bir değişiklik, spec'ler aşamasını `[~] spec'ler (atlandı: değişiklik skip_specs beyan etti)` olarak gösterir ve ilerleme sayısından hariç tutar.

**Çıktı (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done", "requires": []},
    {"id": "design", "outputPath": "design.md", "status": "ready", "requires": ["proposal"]},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done", "requires": ["proposal"]},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "requires": ["specs", "design"], "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

Bir esna oluşturmak veya görevleri uygulamak için zenginleştirilmiş talimatlar alır. AI aracılarının bir sonraki adımda ne oluşturacaklarını anlamak için kullanılır.

```
openspec instructions [artifact] [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|---------|----------|
| `artifact` | Hayır | Esna ID'si: `proposal`, `specs`, `design`, `tasks` veya `apply` |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|----------|
| `--change <id>` | Değişiklik adı (etkileşimsiz modda gerekli) |
| `--schema <name>` | Şema geçersiz kılma |
| `--json` | JSON olarak çıktı ver |

**Özel durum:** Görev uygulama talimatlarını almak için esna olarak `apply` kullanın.

**Örnekler:**

```bash
# Sonraki esna için talimatları al
openspec instructions --change add-dark-mode

# Belirli bir esna için talimatları al
openspec instructions design --change add-dark-mode

# Uygulama/uygulama talimatlarını al
openspec instructions apply --change add-dark-mode

# Aracı tüketimi için JSON
openspec instructions design --change add-dark-mode --json
```

**Çıktı içeriği:**

- Esna için şablon içeriği
- Yapılandırmadan proje bağlamı
- Bağımlı esnalardan içerik
- Yapılandırmadan esna başına kurallar

`skip_specs: true` ile atlanan bir esna için çıktı sadece bir uyarıdır (JSON `skipped`/`warning` alanlarını ekler) — esna oluşturulmamalıdır.

---

### `openspec templates`

Bir şemadaki tüm esnalar için çözümlenmiş şablon yollarını gösterir.

```
openspec templates [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|----------|
| `--schema <name>` | İncelenecek şema (varsayılan: `spec-driven`) |
| `--json` | JSON olarak çıktı ver |

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
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Açıklamaları ve esna akışlarıyla birlikte mevcut iş akışı şemalarını listeler.

```
openspec schemas [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|----------|
| `--json` | JSON olarak çıktı ver |

**Örnek:**

```bash
openspec schemas
```

**Çıktı:**

```
Mevcut şemalar:

  spec-driven (paket)
    Varsayılan spec odaklı geliştirme iş akışı
    Akış: proposal → specs → design → tasks

  my-custom (proje)
    Bu proje için özel iş akışı
    Akış: research → proposal → tasks
```

## Şema Komutları

Özel iş akışı şemalarını oluşturmak ve yönetmek için komutlar.

### `openspec schema init`

Yeni bir proje yerel şeması oluştur.

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
| `--artifacts <list>` | Virgülle ayrılmış sanat kimliği listesi (varsayılan: `proposal,specs,design,tasks`) |
| `--default` | Proje varsayılan şeması olarak ayarla |
| `--no-default` | Varsayılan olarak ayarlama sorusunu sorma |
| `--force` | Mevcut şemayı üzerine yaz |
| `--json` | JSON olarak çıktı ver |

**Örnekler:**

```bash
# Etkileşimli şema oluşturma
openspec schema init research-first

# Belirli sanat kimlikleriyle etkileşimsiz
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**Ne oluşturur:**

```
openspec/schemas/<name>/
├── schema.yaml           # Şema tanımı
└── templates/
    ├── proposal.md       # Her sanat için şablon
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Özelleştirmek için mevcut bir şemayı projenize kopyalayın.

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
| `--force` | Mevcut hedefi üzerine yaz |
| `--json` | JSON olarak çıktı ver |

**Örnek:**

```bash
# Yerleşik spec-driven şemasını fork'la
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Bir şemanın yapısını ve şablonlarını doğrulayın.

```
openspec schema validate [name] [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `name` | Hayır | Doğrulanacak şema (belirtilmezse tümü doğrulanır) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--verbose` | Ayrıntılı doğrulama adımlarını göster |
| `--json` | JSON olarak çıktı ver |

**Örnek:**

```bash
# Belirli bir şemayı doğrula
openspec schema validate my-workflow

# Tüm şemaları doğrula
openspec schema validate
```

---

### `openspec schema which`

Bir şemanın nereden çözüldüğünü göster (öncelik sıralamasını hata ayıklamak için kullanışlıdır).

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
# Bir şemanın nereden geldiğini kontrol et
openspec schema which spec-driven
```

**Çıktı:**

```
spec-driven şeması şuradan çözülüyor: package
  Kaynak: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Şema önceliği:**

1. Proje: `openspec/schemas/<name>/`
2. Kullanıcı: `~/.local/share/openspec/schemas/<name>/`
3. Paket: Yerleşik şemalar

---

## Yapılandırma Komutları

### `openspec config`

Global OpenSpec yapılandırmasını görüntüleyin ve değiştirin.

```
openspec config <subcommand> [options]
```

**Alt komutlar:**

| Alt komut | Açıklama |
|------------|-------------|
| `path` | Yapılandırma dosyasının konumunu göster |
| `list` | Tüm mevcut ayarları göster |
| `get <key>` | Belirli bir değeri al |
| `set <key> <value>` | Bir değer ayarla |
| `unset <key>` | Bir anahtarı kaldır |
| `reset` | Varsayılanlara sıfırla |
| `edit` | `$EDITOR` içinde aç |
| `profile [preset]` | İş akışı profilini etkileşimli olarak veya ön ayar üzerinden yapılandır |

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

# Bir dizgi değerini açıkça ayarla
openspec config set user.name "My Name" --string

# Özel bir ayarı kaldır
openspec config unset user.name

# Makine düzeyi varsayılan deposu ayarla (--store, local root veya proje deposu belirtilmediğinde geri dönüş kökü: pointer çözülür)
openspec config set defaultStore team-plans

# Tüm yapılandırmayı sıfırla
openspec config reset --all --yes

# Yapılandırmayı düzenleyicinizde düzenleyin
openspec config edit

# Eylem tabanlı sihirbaz ile profili yapılandır
openspec config profile

# Hızlı ön ayar: iş akışlarını çekirdeğe değiştir (teslimat modunu korur)
openspec config profile core
```

`openspec config profile`, mevcut durum özeti ile başlar, ardından şunları seçmenize olanak tanır:
- Teslimat + iş akışlarını değiştir
- Yalnızca teslimatı değiştir
- Yalnızca iş akışlarını değiştir
- Mevcut ayarları koru (çık)

Mevcut ayarları korursanız, hiçbir değişiklik kaydedilmez ve güncelleme istemi gösterilmez.
Yapılandırma değişikliği yoksa ancak mevcut proje dosyaları global profiliniz/teslimat ile eşitlenmemişse OpenSpec bir uyarı gösterir ve `openspec update` komutunu önerir.
`Ctrl+C` tuşlarına basmak da akışı temiz bir şekilde iptal eder (yığın izleme yok) ve `130` çıkış koduyla çıkar.
İş akışı kontrol listesinde `[x]`, iş akışının global yapılandırmada seçili olduğu anlamına gelir. Bu seçimleri proje dosyalarına uygulamak için `openspec update` komutunu çalıştırın (veya bir proje içinde istendiğinde `Şimdi bu projeye değişiklikleri uygula?` seçeneğini seçin).

**Etkileşimli örnekler:**

```bash
# Yalnızca teslimat güncellemesi
openspec config profile
# seçin: Yalnızca teslimatı değiştir
# teslimat seçin: Yalnızca Beceriler

# Yalnızca iş akışları güncellemesi
openspec config profile
# seçin: Yalnızca iş akışlarını değiştir
# kontrol listesindeki iş akışlarını aç/kapa, ardından onayla
```

---

## Yardımcı Komutlar

### `openspec feedback`

OpenSpec hakkında geri bildirim gönderin. Bir GitHub sorunu oluşturur.

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

**Gereksinimler:** GitHub CLI (`gh`) yüklü ve kimliği doğrulanmış olmalıdır.

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
| `generate [shell]` | Tamamlama betiğini stdout'a çıktı ver |
| `install [shell]` | Kabuğunuz için tamamlamayı yükle |
| `uninstall [shell]` | Yüklü tamamlamaları kaldır |

**Desteklenen kabuklar:** `bash`, `zsh`, `fish`, `powershell`

**Örnekler:**

```bash
# Tamamlamaları yükle (kabuk otomatik olarak algılanır)
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
|------|---------|
| `0` | Başarı |
| `1` | Hata (doğrulama hatası, eksik dosyalar vb.) |

---

## Ortam Değişkenleri

| Değişken | Açıklama |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Telemetriyi devre dışı bırakmak için `0` olarak ayarlayın |
| `DO_NOT_TRACK` | Telemetriyi devre dışı bırakmak için `1` olarak ayarlayın (standart DNT sinyali) |
| `OPENSPEC_CONCURRENCY` | Toplu doğrulama için varsayılan eşzamanlılık (varsayılan: 6) |
| `EDITOR` or `VISUAL` | `openspec config edit` için düzenleyici |
| `NO_COLOR` | Ayarlanmışsa renkli çıktıyı devre dışı bırak |

---

## İlgili Dokümantasyon

- [Komutlar](commands.md) - AI eğik çizgi komutları (`/opsx:propose`, `/opsx:apply` vb.)
- [İş Akışları](workflows.md) - Yaygın kalıplar ve her komutun ne zaman kullanılacağı
- [Özelleştirme](customization.md) - Özel şema ve şablon oluşturma
- [Başlarken](getting-started.md) - İlk kurulum rehberi