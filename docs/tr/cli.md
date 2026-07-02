# CLI Referansı

OpenSpec CLI (`openspec`), proje kurulumu, doğrulama, durum denetimi ve yönetimi için terminal komutları sağlar. Bu komutlar, [Commands](commands.md) belgesinde yer alan AI slash komutlarını (örneğin `/opsx:propose`) tamamlar.

## Özet

| Kategori | Komutlar | Amaç |
|----------|----------|---------|
| **Kurulum** | `init`, `update` | Projenizde OpenSpec'i başlatır ve günceller |
| **Depolar (bağımsız OpenSpec repoları)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Kayıtlı bağımsız OpenSpec depolarını yönetir |
| **Sağlık** | `doctor` | Çözümlenmiş kök için ilişki sağlığını bildirir |
| **Çalışma bağlamı** | `context` | Çalışma kümesini (kök + referans verilen depolar) birleştirir |
| **Kişisel çalışma kümeleri** | `workset create`, `workset list`, `workset open`, `workset remove` | Aracınızda kişisel, yerel çalışma görünümlerini saklar ve açar |
| **Gözatma** | `list`, `view`, `show` | Değişiklikleri ve spesifikasyonları keşfeder |
| **Doğrulama** | `validate` | Değişiklikleri ve spesifikasyonları sorunlar açısından kontrol eder |
| **Yaşam döngüsü** | `archive` | Tamamlanan değişiklikleri sonlandırır |
| **İş akışı** | `new change`, `status`, `instructions`, `templates`, `schemas` | Artefakt odaklı iş akışı desteği |
| **Şemalar** | `schema init`, `schema fork`, `schema validate`, `schema which` | Özel iş akışları oluşturur ve yönetir |
| **Yapılandırma** | `config` | Ayarları görüntüler ve değiştirir |
| **Yardımcı programlar** | `feedback`, `completion` | Geri bildirim ve kabuk entegrasyonu |

---

## İnsan ve Ajan Komutları

Çoğu CLI komutu, bir terminalde **insan kullanımı** için tasarlanmıştır. Bazı komutlar ise JSON çıktısı aracılığıyla **ajan/betik kullanımı** da destekler.

### Yalnızca İnsan Komutları

Bu komutlar etkileşimlidir ve terminal kullanımı için tasarlanmıştır:

| Komut | Amaç |
|---------|---------|
| `openspec init` | Projeyi başlatır (etkileşimli istemler) |
| `openspec view` | Etkileşimli gösterge paneli |
| `openspec workset open <name>` | Kaydedilmiş bir çalışma setini açar (editör penceresi veya terminal ajanı oturumu) |
| `openspec config edit` | Yapılandırmayı düzenleyicide açar |
| `openspec feedback` | GitHub üzerinden geri bildirim gönderir |
| `openspec completion install` | Kabuk tamamlama yükler |

### Ajan Uyumlu Komutlar

Bu komutlar, yapay zeka ajanları ve betikler tarafından programatik kullanım için `--json` çıktısını destekler:

| Komut | İnsan Kullanımı | Ajan Kullanımı |
|---------|-----------|-----------|
| `openspec list` | Değişiklikleri/özellikleri göz atma | Yapılandırılmış veri için `--json` |
| `openspec show <item>` | İçeriği okuma | Ayrıştırma (parsing) için `--json` |
| `openspec validate` | Sorunları kontrol etme | Toplu doğrulama için `--all --json` |
| `openspec status` | Artefakt ilerlemesini görme | Yapılandırılmış durum için `--json` |
| `openspec instructions` | Sonraki adımları alma | Ajan talimatları için `--json` |
| `openspec templates` | Şablon yollarını bulma | Yol çözünürlüğü için `--json` |
| `openspec schemas` | Mevcut şemaları listeleme | Şema keşfi için `--json` |
| `openspec store setup <id>` | Yerel bir mağaza oluşturur ve kaydeder | Yapılandırılmış kurulum çıktısı için açık girdilerle `--json` |
| `openspec store register <path>` | Mevcut bir mağazayı kaydeder | Yapılandırılmış kayıt çıktısı için `--json` |
| `openspec store unregister <id>` | Yerel bir mağaza kaydını unutur | Yapılandırılmış temizlik çıktısı için `--json` |
| `openspec store remove <id>` | Kaydedilmiş yerel bir mağaza klasörünü siler | Etkileşimli olmayan silme için `--yes --json` |
| `openspec store list` | Kayıtlı mağazaları göz atma | Yapılandırılmış kayıtlar için `--json` |
| `openspec store doctor` | Yerel mağaza kurulumunu kontrol eder | Yapılandırılmış teşhisler için `--json` |
| `openspec new change <id>` | Depo-yerel değişiklik iskeleti oluşturur | Kayıtlı bir mağazayı OpenSpec kökü olarak kullanmak için `--json`, ayrıca `--store <id>` |
| `openspec workset create [name]` | Kişisel bir çalışma görünümü oluşturur | Etkileşimli olmayan bileşen için `--member <path> --json` |
| `openspec workset list` | Kaydedilmiş çalışma setlerini göz atma | Yapılandırılmış görünümler için `--json` |
| `openspec workset remove <name>` | Kaydedilmiş bir görünümü siler | Etkileşimli olmayan kaldırma için `--yes --json` |

---

## Global Seçenekler

Bu seçenekler tüm komutlarla birlikte çalışır:

| Seçenek | Açıklama |
|--------|-------------|
| `--version`, `-V` | Sürüm numarasını gösterir |
| `--no-color` | Renkli çıktıyı devre dışı bırakır |
| `--help`, `-h` | Komut için yardım gösterir |

---

## Kurulum Komutları

### `openspec init`

OpenSpec'i projenizde başlatır. Klasör yapısını oluşturur ve yapay zeka araç entegrasyonlarını yapılandırır.

Varsayılan davranış küresel yapılandırma varsayılanlarını kullanır: profil `core`, teslimat `both`, iş akışları `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Argümanlar:**

| Argüman | Gereklilik | Açıklama |
|----------|----------|-------------|
| `path` | Hayır | Hedef dizin (varsayılan: mevcut dizin) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--tools <list>` | Yapay zeka araçlarını etkileşimli olmayan bir şekilde yapılandırır. `all`, `none` veya virgülle ayrılmış liste kullanın |
| `--force` | İstem olmadan eski dosyaları otomatik olarak temizler |
| `--profile <profile>` | Bu init çalıştırması için küresel profili geçersiz kılar (`core` veya `custom`) |

`--profile custom`, global yapılandırmada (`openspec config profile`) şu anda seçilen iş akışlarını kullanır.

**Desteklenen araç kimlikleri (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

> Bu liste, `src/core/config.ts` içindeki `AI_TOOLS` ile eşleşir. Her aracın becerisi ve komut yolları için [Desteklenen Araçlar](supported-tools.md)'a bakın.

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

# Bu çalıştırma için profili geçersiz kılma
openspec init --profile core

# İstemleri atlama ve eski dosyaları otomatik temizleme
openspec init --force
```

**Ne oluşturur:**

```
openspec/
├── specs/              # Özellikleriniz (gerçek kaynak)
├── changes/            # Önerilen değişiklikler
└── config.yaml         # Proje yapılandırması

.claude/skills/         # Claude Kod becerileri (eğer claude seçildiyse)
.cursor/skills/         # Cursor becerileri (eğer cursor seçildiyse)
.cursor/commands/       # Cursor OPSX komutları (teslimat komutları içeriyorsa)
... (diğer araç yapılandırmaları)
```

---

### `openspec update`

CLI yükseltmesinden sonra OpenSpec talimat dosyalarını günceller. Mevcut küresel profilinizi, seçilen iş akışlarınızı ve teslimat modunuzu kullanarak yapay zeka araç yapılandırma dosyalarını yeniden oluşturur.

```
openspec update [path] [options]
```

**Argümanlar:**

| Argüman | Gereklilik | Açıklama |
|----------|----------|-------------|
| `path` | Hayır | Hedef dizin (varsayılan: mevcut dizin) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--force` | Dosyalar güncel olsa bile zorla güncelleme yapar |

**Örnek:**

```bash
# npm yükseltmesinden sonra talimat dosyalarını güncelleme
npm update @fission-ai/openspec
openspec update
```

---

## Mağazalar (bağımsız OpenSpec depoları)

> **Beta.** Mağazalar ve üzerlerinde oluşturulan özellikler (referanslar, çalışma bağlamı, çalışma setleri) yenidir; komut adları, bayraklar, dosya formatları ve JSON çıktısı sürümler arasında şekil değiştirebilir. Sorun odaklı gezinme için [mağazalar rehberine](stores-beta/user-guide.md) bakın.

Bir mağaza, bu makinede kaydettiğiniz bağımsız bir OpenSpec deposudur; örneğin bir planlama deposu veya sözleşme deposu. Bir mağazayı kaydetmek, normal komutların (`list`, `show`, `status`, `validate`, `new change`, `archive`, ...) `--store <id>` geçirerek her yerden bu depoda işlem yapmasına olanak tanır.

### `openspec store setup`

Yerel bir mağaza oluşturur ve kaydeder. Terminalde argüman olmadan, OpenSpec kullanıcıyı kurulum boyunca yönlendirir. Ajanlar ve betikler açık girdiler sağlamalı ve `--json` kullanmalıdır.

```bash
openspec store setup [id] [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--path <path>` | Mağazanın bulunması gereken klasör (örneğin `~/openspec/<id>`) |
| `--remote <url>` | Yeni mağazanın `store.yaml` dosyasına kanonik uzaklığı kaydeder |
| `--init-git` | Başlangıç taahhüdü ile bir Git deposu başlatır (varsayılan) |
| `--no-init-git` | Herhangi bir Git eylemini atlar: init yok, başlangıç taahhüdü yok |
| `--json` | JSON çıktısı |

Etkileşimli olmayan çalıştırmalar (`--json`, betikler, ajanlar) hem mağaza kimliğini hem de `--path` parametresini sağlamalıdır. Etkileşimli bir terminalde kurulum, konumu görünür, kullanıcıya ait bir yerde düzenlenebilir bir öneriyle ister (örneğin `~/openspec/<id>`); asla OpenSpec'in yönetilen veri dizinine varsayılan olarak geçmez.

Örnekler:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Mevcut bir yerel mağaza klasörünü kaydeder.

```bash
openspec store register [path] [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--id <id>` | Mağaza kimliği; varsayılan olarak mağaza meta verisi veya klasör adıdır |
| `--yes` | Sağlıklı bir OpenSpec kökü için mağaza kimlik meta verisini onaylar |
| `--json` | JSON çıktısı |

### `openspec store unregister`

Dosyaları silmeden yerel bir mağaza kaydını unutur.

```bash
openspec store unregister <id> [--json]
```

Bu, bir mağaza taşındığında, başka bir yere klonlandığında veya bu makinede OpenSpec tarafından artık gösterilmemesi gerektiğinde kullanılır.

### `openspec store remove`

Yerel bir mağaza kaydını unutur ve yerel klasörünü siler.

```bash
openspec store remove <id> [--yes] [--json]
```

`remove`, etkileşimli bir terminalde silmeden önce tam klasörü gösterir. Ajanlar, betikler ve JSON çağırıcıları silmeyi onaylamak için `--yes` sağlamalıdır. OpenSpec, eşleşen mağaza meta verisi içermeyen bir klasörü silmeyi reddeder.

### `openspec store list`

Yerel olarak kayıtlı mağazaları listeler.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Yerel mağaza kaydını, meta verisini ve Git varlığını kontrol eder.

```bash
openspec store doctor [id] [--json]
```

Doctor yalnızca teşhis amaçlıdır; mağazayı değiştirmeden eksik kökleri, meta veri uyuşmazlıklarını ve geçersiz yerel kayıt durumunu raporlar.

### Bir projeden mağaza referansları

Bir proje deposu, işinin hangi mağazalara dayandığını `openspec/config.yaml` içinde belirtebilir:

```yaml
schema: spec-driven
references:
  - team-context
```

Bundan sonra, o depodaki `openspec instructions` çıktısı (hem tekil artefakt hem de `apply` yüzeyleri, JSON ve insan modları) her referans verilen mağazanın özelliklerinin bir dizinini taşır — özellik kimlikleri, her özelliğin Amaç bölümünden alınan tek satırlık özet ve çekme komutu (`openspec show <spec-id> --type spec --store <id>`). Bu dizin her çalıştırmada kayıtlı kontrol noktasından canlı olarak oluşturulur; özellik içeriği asla çıktıya kopyalanmaz.

Referanslar salt okunur bağlamdır. Komutların nerede işlem yaptığı asla değişmez: çalışma, deponun kendi kökünde kalır ve referans verilen bir mağazaya yazmak açık bir `--store` eylemi olmaya devam eder. Çözümlenemeyen bir referans (örneğin, bu makinede kayıtlı olmayan bir mağaza) dizinde tam düzeltme ile bir uyarıya dönüşür ve talimatlar yine de oluşturulur. `openspec doctor`, referans sağlığını tek bir yerde raporlar.

### Bir mağazanın nereden klonlandığını kaydetmek

Bir mağaza, kanonik klon kaynağını taahhüt edilmiş kimlik dosyasında kaydedebilir, böylece işe alım ('mağazayı kaydet') aşamasında takılmaz:

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

Uzaklık, ilk taahhütte `.openspec-store/store.yaml` içine düşer, böylece her klon bunu bilerek doğar. Mevcut bir mağaza için `store.yaml` dosyasını elle düzenleyin ve taahhüt edin. `store doctor`, kaydedilen uzaklığı (ve kontrol noktasının gözlemlediği Git kaynağını) gösterir; kurulum/kayıt, adlandırma kılavuzları paylaşır; ve kayıt, makine yerel kaydındaki kontrol noktasının kaynağını kaydeder.

Bir referans bildirimi de klon kaynağını taşıyabilir, böylece mağazaya sahip olmayan bir ekip arkadaşı eksiksiz, yapıştırılabilir bir düzeltme alır (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

Uzaklık kaydetmek senkronizasyon değildir: OpenSpec asla kendi başına klonlamaz, çekmez veya itmez.

### Varsayılan bir mağaza bildirmek

Planlaması tamamen haricileştirilmiş bir depo (yerel `openspec/specs/` veya `openspec/changes/` içermeyen) her komutta `--store` geçirmek yerine mağazasını tek seferde belirtebilir:

```yaml
# openspec/config.yaml (openspec altındaki tek dosya)
store: team-context
```

Normal komutlar daha sonra bildirilen mağazaya otomatik olarak çözümlenir; kök banner ve JSON `root` bloğu, mağaza kimliği ile `source: "declared"` raporlar ve basılan ipuçları hala `--store <id>` taşır. Bu bildirim bir yedektir, asla bir geçersiz kılma değildir: açıkça belirtilen `--store` her zaman kazanır ve gerçek planlama klasörlerine sahip bir dizin bu işaretçiyi görmezden gelir (bir uyarı ile). Bir işaretçi depoyu yerel bir OpenSpec köküne dönüştürmek için `store:` satırını kaldırın ve `openspec init` çalıştırın — bildirim mevcutken init iskelet oluşturmayı reddeder.

## Doktor (ilişki sağlığı)

Tek bir okuma sorusu, tek bir yer: OpenSpec kökü sağlıklı mı ve referans verdiği depolar bu makinede mevcut mu?

```bash
openspec doctor [--store <id>] [--json]
```

Rapor, kök sağlığını, depo meta verisi sağlığını (kaydedilen uzak ve kontrol çıkışının kaynağı ayrıldığında bir not dahil) ve referans sağlığını ayırır (aynı teşhis talimatları gösterilir, çözülmemiş referanslar için klon düzeltmeleriyle). Herhangi bir ciddiyetteki sağlık bulguları 0 ile çıkar — ajanlar `status` dizilerini okur; yalnızca komut hataları (kök yok, bilinmeyen depo) 1 ile çıkar. Doktor asla klonlama, senkronizasyon veya onarım yapmaz. Sağlık yerine derlenen seti almak için `openspec context` kullanın.

## Çalışma bağlamı (derlenmiş küme)

Bu çalışma, OpenSpec bildirimleri aracılığıyla tek bir çalışma kümesinde ilişkilendirdiği her şeyi kapsar: OpenSpec kökü ve referans verdiği depolar.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

JSON özeti ajan tarafından kullanılabilir durumdadır (her mevcut referans verilen depo kendi çekme tarifini taşır; çözülmemiş üyeler aynı düzeltme talimatlarını ve doktor gösterimini taşır). `--code-workspace` ayrıca kökü ve mevcut referans verilen depoları (`ref:<id>` klasörleri) içeren bir VS Code çalışma alanı dosyası yazar — bu komutun yaptığı tek yazma işlemidir, dosya varsa `--force` olmadan reddedilir. Mevcut olmayan üyeler bildirilir, asla tahmin edilmez.

"Çalışma bağlamı" derlenmiş kümedir; `openspec/config.yaml` içindeki `context:` alanı, talimatlara enjekte edilen proje arka planıdır — bunlar iki farklı şeydir. `openspec doctor` kümenin sağlıklı olup olmadığını yanıtlar; `openspec context` ise kümenin ne olduğunu yanıtlar.

## Kişisel Çalışma Kümeleri

> **Beta.** Çalışma kümeleri yeni beta yüzeyinin bir parçasıdır; komutlar, bayraklar ve dosya formatları sürümler arasında şekil değiştirebilir. Detaylı kullanım için [stores guide](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together) bölümüne bakınız.

Bir çalışma kümesi, birlikte çalıştığınız klasörlerin kişisel, adlandırılmış bir görünümüdür—bir planlama kökü ve seçtiğiniz diğer her şeydir—makinenizde tutulur ve aracınızda isimle yeniden açılır. Tamamen yereldir: asla commit edilmez, asla paylaşılmaz, deklarasyonlardan türetilmez ve birini silmek hiçbir üye klasörüyle uğraşmaz.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create`, kısa bir rehberli akış çalıştırır (veya `--member` bayraklarını etkileşim dışı alır; ilk üye birincil olandır — oturum orada başlar). `open`, seçilen aracı başlatır: editörler (VS Code, Cursor) her üyeyi içeren bir pencere açar ve geri döner; CLI ajanları (Claude Code, codex), her üyeye bağlı ve önceden doldurulmamış herhangi bir komut istemi olmadan bu terminali bir oturum olarak devralır ve siz çıkana kadar devam eder. Açma zamanında eksik olan bir üye klasörü notla atlanır; geri kalanı açılır. Kaydedilen araç tercihi, `--tool` ile her açmada geçersiz kılınabilir.

Yeni bir aracı desteklemek kod değil, yapılandırmadır. Her araç iki lansman stilinden biridir — `workspace-file` (oluşturulan `.code-workspace` ile başlatılır) veya `attach-dirs` (üye başına bir ekleme bayrağı) — ve global `config.json` dosyasındaki `openers` anahtarı (açmak için `openspec config edit` kullanın) alan başına araçları ekler veya yerleşik olanları ayarlar:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Tüm çalışma kümesi durumu, global veri dizininin `worksets/` klasöründe (kaydedilen görünümler ve her açmada yeniden oluşturulan `<name>.code-workspace` dosyaları) yaşar; bu klasörü silmek tüm izleri kaldırır.

---

## Göz Atma Komutları

### `openspec list`

Projenizdeki değişiklikleri veya özellikleri listeleyin.

```
openspec list [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--specs` | Değişiklikler yerine özellikleri listeler |
| `--changes` | Değişiklikleri listeler (varsayılan) |
| `--sort <order>` | `recent` (yeni) veya `name` (isim) ile sıralar |
| `--json` | JSON olarak çıktı verir |

**Örnekler:**

```bash
# Tüm aktif değişiklikleri listele
openspec list

# Tüm özellikleri listele
openspec list --specs

# Betikler için JSON çıktısı al
openspec list --json
```

**Çıktı (metin):**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

Özellikleri ve değişiklikleri keşfetmek için etkileşimli bir gösterge görüntüleyin.

```
openspec view
```

Projenizin özelliklerini ve değişikliklerini gezinmek için terminal tabanlı bir arayüz açar.

---

### `openspec show`

Bir değişikliğin veya özelliğin ayrıntılarını görüntüle.

```
openspec show [item-name] [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `item-name` | Hayır | Değişiklik veya özellik adı (eksikse komut istemi gösterir) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--type <type>` | Tür belirtin: `change` (değişiklik) veya `spec` (özellik) (belirsiz değilse otomatik algılanır) |
| `--json` | JSON olarak çıktı verir |
| `--no-interactive` | Komut istemlerini devre dışı bırakır |

**Değişikliğe özgü seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--deltas-only` | Yalnızca delta özelliklerini gösterir (JSON modu) |

**Özelliğe özgü seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--requirements` | Yalnızca gereksinimleri gösterir, senaryoları hariç tutar (JSON modu) |
| `--no-scenarios` | Senaryo içeriğini hariç tutar (JSON modu) |
| `-r, --requirement <id>` | 1 tabanlı indeks ile belirli bir gereksinimi gösterir (JSON modu) |

**Örnekler:**

```bash
# Etkileşimli seçim
openspec show

# Belirli bir değişikliği göster
openspec show add-dark-mode

# Belirli bir özelliği göster
openspec show auth --type spec

# Ayrıştırma için JSON çıktısı al
openspec show add-dark-mode --json
```

---

## Doğrulama Komutları

### `openspec validate`

Yapısal sorunlar için değişiklikleri ve özellikleri doğrulayın.

```
openspec validate [item-name] [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `item-name` | Hayır | Doğrulanacak belirli öğe (eksikse komut istemi gösterir) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--all` | Tüm değişiklikleri ve özellikleri doğrular |
| `--changes` | Tüm değişiklikleri doğrular |
| `--specs` | Tüm özellikleri doğrular |
| `--type <type>` | İsim belirsiz olduğunda tür belirtir: `change` veya `spec` |
| `--strict` | Katı doğrulama modunu etkinleştirir |
| `--json` | JSON olarak çıktı verir |
| `--concurrency <n>` | Maksimum paralel doğrulama (varsayılan: 6, veya `OPENSPEC_CONCURRENCY` ortam değişkeni) |
| `--no-interactive` | Komut istemlerini devre dışı bırakır |

**Örnekler:**

```bash
# Etkileşimli doğrulama
openspec validate

# Belirli bir değişikliği doğrula
openspec validate add-dark-mode

# Tüm değişiklikleri doğrula
openspec validate --changes

# CI/betikler için JSON çıktısıyla her şeyi doğrula
openspec validate --all --json

# Artırılmış paralellik ile katı doğrulama yap
openspec validate --all --strict --concurrency 12
```

**Çıktı (metin):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: "Technical Approach" bölümü eksik

1 warning found
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

Tamamlanmış bir değişikliği arşivleyin ve delta özelliklerini ana özelliklere birleştirin.

```
openspec archive [change-name] [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `change-name` | Hayır | Arşivlenecek değişiklik (eksikse komut istemi gösterir) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `-y, --yes` | Onay komutlarını atla |
| `--skip-specs` | Özellik güncellemelerini atlar (altyapı/araçlandırma/sadece doküman değişiklikleri için) |
| `--no-validate` | Doğrulama işlemini atlar (onay gerektirir) |

**Örnekler:**

```bash
# Etkileşimli arşivleme
openspec archive

# Belirli bir değişikliği arşivle
openspec archive add-dark-mode

# Komut istemleri olmadan arşivle (CI/betikler)
openspec archive add-dark-mode --yes

# Özellikleri etkilemeyen bir araçlandırma değişikliğini arşivle
openspec archive update-ci-config --skip-specs
```

**Ne yapar:**

1. Değişikliği doğrular (eğer `--no-validate` kullanılmıyorsa)
2. Onay için komut istemi gösterir (eğer `--yes` kullanılmıyorsa)
3. Delta özelliklerini `openspec/specs/` içine birleştirir
4. Değişiklik klasörünü `openspec/changes/archive/YYYY-MM-DD-<name>/` konumuna taşır

---

## İş Akışı Komutları

Bu komutlar, eser odaklı OPSX iş akışını destekler. Hem ilerlemeyi kontrol eden insanlar hem de sonraki adımları belirleyen ajanlar için kullanışlıdır.

### `openspec new change`

Çözümlenmiş OpenSpec kök dizininde bir değişiklik klasörü ve isteğe bağlı olarak kaydedilmiş meta veri oluşturur.

```bash
openspec new change <name> [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--description <text>` | `index.md` dosyasına eklenecek açıklama |
| `--goal <text>` | Değişiklikle birlikte saklanacak isteğe bağlı hedef meta verisi |
| `--schema <name>` | Kullanılacak iş akışı şeması |
| `--store <id>` | OpenSpec kök dizini olarak kullanılacak mağaza kimliği (bir mağaza, kaydettiğiniz bağımsız bir OpenSpec deposudur) |
| `--json` | JSON çıktısı verir |

**Örnekler:**

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Bir değişiklik için eser tamamlama durumunu gösterir.

```
openspec status [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--change <id>` | Değişiklik adı (eksikse komut istemi gösterir) |
| `--schema <name>` | Şema geçersiz kılma (değişikliğin yapılandırmasından otomatik algılanır) |
| `--json` | JSON olarak çıktı verir |

**Örnekler:**

```bash
# Etkileşimli durum kontrolü yap
openspec status

# Belirli bir değişiklik için durum
openspec status --change add-dark-mode

# Ajan kullanımı için JSON çıktısı al
openspec status --change add-dark-mode --json
```

**Çıktı (metin):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
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

Bir eser oluşturmak veya görevleri uygulamak için zenginleştirilmiş talimatlar alın. Bu, neyin oluşturulacağını anlaması için yapay zeka ajanları tarafından kullanılır.

```
openspec instructions [artifact] [options]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `artifact` | Hayır | Eser Kimliği: `proposal`, `specs`, `design`, `tasks` veya `apply` |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--change <id>` | Değişiklik adı (etkileşim dışı modda zorunludur) |
| `--schema <name>` | Şema geçersiz kılma |
| `--json` | JSON olarak çıktı verir |

**Özel durum:** Görev uygulama talimatlarını almak için `apply` kullanın.

**Örnekler:**

```bash
# Sonraki eser için talimatları al
openspec instructions --change add-dark-mode

# Belirli bir eser için talimatları al
openspec instructions design --change add-dark-mode

# Uygulama/uygulama talimatlarını al
openspec instructions apply --change add-dark-mode

# Ajan tüketimi için JSON çıktısı al
openspec instructions design --change add-dark-mode --json
```

**Çıktı şunları içerir:**

- Eser için Şablon içeriği
- Yapılandırmadan gelen Proje bağlamı
- Bağımlılık eserlerinden gelen İçerik
- Yapılandırmadan gelen Eser başına kurallar

---

### `openspec templates`

Bir şemadaki tüm eserler için çözümlenmiş şablon yollarını göster.

```
openspec templates [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--schema <name>` | İncelenecek şema (varsayılan: `spec-driven`) |
| `--json` | JSON olarak çıktı verir |

**Örnekler:**

```bash
# Varsayılan şema için şablon yollarını göster
openspec templates

# Özel bir şema için şablonları göster
openspec templates --schema my-workflow

# Programatik kullanım için JSON çıktısı al
openspec templates --json
```

**Çıktı (metin):**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Mevcut iş akışı şemalarını, açıklamaları ve eser akışlarıyla birlikte listele.

```
openspec schemas [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--json` | JSON olarak çıktı verir |

**Örnek:**

```bash
openspec schemas
```

**Çıktı:**

```
Available schemas:

  spec-driven (package)
    Varsayılan spec-driven geliştirme iş akışı
    Akış: proposal → specs → design → tasks

  my-custom (project)
    Bu proje için özel iş akışı
    Akış: research → proposal → tasks
```

## Şema Komutları

Özel iş akışı şemalarını oluşturmak ve yönetmek için kullanılan komutlar.

### `openspec schema init`

Yeni, proje yerel bir şema oluşturur.

```
openspec schema init <name> [options]
```

**Argümanlar:**

| Argüman | Zorunlu mu | Açıklama |
|----------|-------------|-------------|
| `name` | Evet | Şema adı (kebab-case) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--description <text>` | Şema açıklaması |
| `--artifacts <list>` | Virgülle ayrılmış artifact ID'leri (varsayılan: `proposal,specs,design,tasks`) |
| `--default` | Proje varsayılan şeması olarak ayarla |
| `--no-default` | Varsayılan olarak ayarlama uyarısı verme |
| `--force` | Mevcut şemayı üzerine yaz |
| `--json` | JSON olarak çıktı ver |

**Örnekler:**

```bash
# Etkileşimli şema oluşturma
openspec schema init research-first

# Belirli artifact'lar ile etkileşimsiz çalıştırma
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
    ├── proposal.md       # Her artifact için şablon
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Mevcut bir şemayı özelleştirme amacıyla projenize kopyalar.

```
openspec schema fork <source> [name] [options]
```

**Argümanlar:**

| Argüman | Zorunlu mu | Açıklama |
|----------|-------------|-------------|
| `source` | Evet | Kopyalanacak şema |
| `name` | Hayır | Yeni şema adı (varsayılan: `<source>-custom`) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--force` | Mevcut hedefi üzerine yaz |
| `--json` | JSON olarak çıktı ver |

**Örnek:**

```bash
# Dahili spec-driven şemasını çatallama (fork)
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Bir şemanın yapısını ve şablonlarını doğrular.

```
openspec schema validate [name] [options]
```

**Argümanlar:**

| Argüman | Zorunlu mu | Açıklama |
|----------|-------------|-------------|
| `name` | Hayır | Doğrulanacak şema (belirtilmezse tümünü doğrular) |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--verbose` | Detaylı doğrulama adımlarını göster |
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

Bir şemanın nereden çözümlendiğini gösterir (öncelik kontrolü için kullanışlıdır).

```
openspec schema which [name] [options]
```

**Argümanlar:**

| Argüman | Zorunlu mu | Açıklama |
|----------|-------------|-------------|
| `name` | Hayır | Şema adı |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--all` | Tüm şemaları kaynaklarıyla listele |
| `--json` | JSON olarak çıktı ver |

**Örnek:**

```bash
# Bir şemanın nereden geldiğini kontrol et
openspec schema which spec-driven
```

**Çıktı:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Şema önceliği:**

1. Proje: `openspec/schemas/<name>/`
2. Kullanıcı: `~/.local/share/openspec/schemas/<name>/`
3. Paket: Dahili şemalar

---

## Yapılandırma Komutları

### `openspec config`

Global OpenSpec yapılandırmasını görüntüle ve değiştir.

```
openspec config <subcommand> [options]
```

**Alt komutlar:**

| Alt komut | Açıklama |
|------------|-------------|
| `path` | Yapılandırma dosya konumunu göster |
| `list` | Tüm mevcut ayarları göster |
| `get <key>` | Belirli bir değeri al |
| `set <key> <value>` | Bir değer ayarla |
| `unset <key>` | Bir anahtarı kaldır |
| `reset` | Varsayılanlara sıfırla |
| `edit` | `$EDITOR` içinde aç |
| `profile [preset]` | İş akışı profilini etkileşimli veya ön ayar aracılığıyla yapılandır |

**Örnekler:**

```bash
# Yapılandırma dosya yolunu göster
openspec config path

# Tüm ayarları listele
openspec config list

# Belirli bir değeri al
openspec config get telemetry.enabled

# Bir değer ayarla
openspec config set telemetry.enabled false

# Dize değerini açıkça ayarla
openspec config set user.name "My Name" --string

# Özel bir ayarı kaldır
openspec config unset user.name

# Tüm yapılandırmayı sıfırla
openspec config reset --all --yes

# Düzenleyicide yapılandırmayı düzenle
openspec config edit

# Eylem tabanlı sihirbaz ile profili yapılandır
openspec config profile

# Hızlı ön ayar: iş akışlarını core'a geçir (delivery modunu korur)
openspec config profile core
```

`openspec config profile`, mevcut durum özetiyle başlar, ardından şunları seçmenizi sağlar:
- Teslimatı + iş akışlarını değiştir
- Yalnızca teslimatı değiştir
- Yalnızca iş akışlarını değiştir
- Mevcut ayarları koru (çıkış)

Mevcut ayarları tutarsanız, herhangi bir değişiklik yazılmaz ve güncelleme uyarısı gösterilmez.
Yapılandırma değişikliği olmamasına rağmen mevcut proje dosyaları global profilinizle/teslimatınızla senkronize değilse, OpenSpec bir uyarı gösterecek ve `openspec update` önerecektir.
`Ctrl+C` tuşuna basmak da akışı temiz bir şekilde iptal eder (yığın izi olmadan) ve `130` koduyla çıkar.
İş akışı kontrol listesinde, `[x]` iş akışının global yapılandırmada seçili olduğu anlamına gelir. Bu seçimleri proje dosyalarına uygulamak için `openspec update` çalıştırın (veya bir projede uyarlandığında `Apply changes to this project now?` seçeneğini seçin).

**Etkileşimli örnekler:**

```bash
# Yalnızca teslimat güncellemesi
openspec config profile
# seç: Sadece teslimatı değiştir
# delivery seç: Yalnızca beceriler (Skills)

# Yalnızca iş akışı güncellemesi
openspec config profile
# seç: Yalnızca iş akışlarını değiştir
# kontrol listesindeki iş akışlarını değiştirin, ardından onaylayın
```

---

## Yardımcı Komutlar

### `openspec feedback`

OpenSpec hakkında geri bildirim gönderir. Bir GitHub sorunu oluşturur.

```
openspec feedback <message> [options]
```

**Argümanlar:**

| Argüman | Zorunlu mu | Açıklama |
|----------|-------------|-------------|
| `message` | Evet | Geri bildirim mesajı |

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--body <text>` | Detaylı açıklama |

**Gereksinimler:** GitHub CLI (`gh`) kurulu ve kimlik doğrulaması yapılmış olmalıdır.

**Örnek:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

OpenSpec CLI için kabuk tamamlama (shell completions) yönetir.

```
openspec completion <subcommand> [shell]
```

**Alt komutlar:**

| Alt komut | Açıklama |
|------------|-------------|
| `generate [shell]` | Tamamlama betiğini stdout'a çıktı ver |
| `install [shell]` | Kabuk için tamamlama yükle |
| `uninstall [shell]` | Yüklenen tamamlama dosyasını kaldır |

**Desteklenen kabuklar:** `bash`, `zsh`, `fish`, `powershell`

**Örnekler:**

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
|------|---------|
| `0` | Başarılı |
| `1` | Hata (doğrulama hatası, eksik dosyalar vb.) |

---

## Ortam Değişkenleri

| Değişken | Açıklama |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Telemetriyi devre dışı bırakmak için `0` olarak ayarlanır |
| `DO_NOT_TRACK` | Telemetriyi devre dışı bırakmak için `1` olarak ayarlanır (standart DNT sinyali) |
| `OPENSPEC_CONCURRENCY` | Toplu doğrulama için varsayılan eşzamanlılık (varsayılan: 6) |
| `EDITOR` veya `VISUAL` | `openspec config edit` için kullanılan düzenleyici |
| `NO_COLOR` | Ayarlandığında renk çıktısını devre dışı bırakır |

---

## İlgili Dokümantasyon

- [Commands](commands.md) - AI eğik komutları (`/opsx:propose`, `/opsx:apply`, vb.)
- [Workflows](workflows.md) - Ortak desenler ve her komutu ne zaman kullanacağınız
- [Customization](customization.md) - Özel şemalar ve şablonlar oluşturma
- [Getting Started](getting-started.md) - İlk kurulum rehberi