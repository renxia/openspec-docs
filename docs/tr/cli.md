# CLI Referansı

OpenSpec CLI (`openspec`), proje kurulumu, doğrulama, durum incelemesi ve yönetim için terminal komutları sağlar. Bu komutlar, [Komutlar](commands.md) bölümünde belgelenen AI eğik çizgi komutlarını (örneğin `/opsx:propose`) tamamlar.

## Özet

| Kategori | Komutlar | Amaç |
|----------|----------|---------|
| **Kurulum** | `init`, `update` | Projenizde OpenSpec'i başlatmak ve güncellemek |
| **Çalışma Alanları (beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace update`, `workspace open` | Bağlı depolar veya klasörler üzerinde yerel görünümler ayarlamak |
| **Paylaşımlı bağlam (beta)** | `context-store setup`, `context-store register`, `context-store unregister`, `context-store remove`, `context-store list`, `context-store doctor`, `initiative create`, `initiative show`, `initiative list` | Yerel context-store kayıtlarını ve kalıcı girişim bağlamını yönetmek |
| **Gözatma** | `list`, `view`, `show` | Değişiklikleri ve spesifikasyonları keşfetmek |
| **Doğrulama** | `validate` | Değişiklikleri ve spesifikasyonları sorunlar için kontrol etmek |
| **Yaşam Döngüsü** | `archive` | Tamamlanmış değişiklikleri sonlandırmak |
| **İş Akışı** | `new change`, `set change`, `status`, `instructions`, `templates`, `schemas` | Eser odaklı iş akışı desteği |
| **Şemalar** | `schema init`, `schema fork`, `schema validate`, `schema which` | Özel iş akışları oluşturmak ve yönetmek |
| **Yapılandırma** | `config` | Ayarları görüntülemek ve değiştirmek |
| **Yardımcı Program** | `feedback`, `completion` | Geri bildirim ve kabuk entegrasyonu |

---

## İnsan ve Agent Komutları

Çoğu CLI komutu, terminalde **insan kullanımı** için tasarlanmıştır. Bazı komutlar ayrıca JSON çıktısı aracılığıyla **agent/betik kullanımını** destekler.

### Yalnızca İnsan Komutları

Bu komutlar etkileşimlidir ve terminal kullanımı için tasarlanmıştır:

| Komut | Amaç |
|---------|---------|
| `openspec init` | Projeyi başlatır (etkileşimli istemler) |
| `openspec view` | Etkileşimli gösterge paneli |
| `openspec config edit` | Yapılandırmayı düzenleyicide açar |
| `openspec feedback` | GitHub üzerinden geri bildirim gönderir |
| `openspec completion install` | Kabuk tamamlamalarını yükler |

### Agent Uyumlu Komutlar

Bu komutlar, AI agent'ları ve betikler tarafından programlı kullanım için `--json` çıktısını destekler:

| Komut | İnsan Kullanımı | Agent Kullanımı |
|---------|-----------|-----------|
| `openspec list` | Değişiklikleri/özellikleri tarar | Yapılandırılmış veri için `--json` |
| `openspec show <item>` | İçeriği okur | Ayrıştırma için `--json` |
| `openspec validate` | Sorunları kontrol eder | Toplu doğrulama için `--all --json` |
| `openspec status` | Yapı ilerlemesini gösterir | Yapılandırılmış durum için `--json` |
| `openspec instructions` | Sonraki adımları alır | Agent talimatları için `--json` |
| `openspec templates` | Şablon yollarını bulur | Yol çözümleme için `--json` |
| `openspec schemas` | Mevcut şemaları listeler | Şema keşfi için `--json` |
| `openspec workspace setup --no-interactive` | Açık girdilerle bir çalışma alanı oluşturur | Yapılandırılmış kurulum çıktısı için `--json` |
| `openspec workspace list` | Bilinen çalışma alanlarını tarar | Tip atanmış çalışma alanı nesneleri için `--json` |
| `openspec workspace link` | Bir depo veya klasörü bağlar | Yapılandırılmış bağlama çıktısı için `--json` |
| `openspec workspace relink` | Bağlı bir yolu onarır | Yapılandırılmış bağlama çıktısı için `--json` |
| `openspec workspace doctor` | Bir çalışma alanını kontrol eder | Yapılandırılmış durum çıktısı için `--json` |
| `openspec workspace update` | Çalışma alanı yerel kılavuzunu ve agent becerilerini yeniler | Agent'ları seçmek için `--tools`; profil iş akışlarını seçer |
| `openspec context-store setup <id>` | Yerel bir bağlam deposu oluşturur | Yapılandırılmış kurulum çıktısı için açık girdilerle `--json` |
| `openspec context-store register <path>` | Mevcut bir bağlam deposunu kaydeder | Yapılandırılmış kayıt çıktısı için `--json` |
| `openspec context-store unregister <id>` | Yerel bir bağlam deposu kaydını siler | Yapılandırılmış temizlik çıktısı için `--json` |
| `openspec context-store remove <id>` | Kayıtlı bir yerel bağlam deposu klasörünü siler | Etkileşimsiz silme için `--yes --json` |
| `openspec context-store list` | Kayıtlı bağlam depolarını tarar | Yapılandırılmış kayıtlar için `--json` |
| `openspec context-store doctor` | Yerel depo kurulumunu kontrol eder | Yapılandırılmış teşhisler için `--json` |
| `openspec initiative list` | Paylaşılan girişimleri tarar | Yapılandırılmış girişim kayıtları için `--json` |
| `openspec initiative show <id>` | Bir girişimi çözümler | Normatif yollar ve üstveri için `--json` |
| `openspec new change <id>` | Depo yerel değişiklik iskelesi oluşturur | `--json`, ayrıca paylaşılan koordinasyon bağlantıları için `--initiative` |
| `openspec set change <id>` | Check-in yapılmış değişiklik üstverisini günceller | `--json`, ayrıca paylaşılan koordinasyon bağlantıları için `--initiative` |

---

## Genel Seçenekler

Bu seçenekler tüm komutlarla çalışır:

| Seçenek | Açıklama |
|--------|-------------|
| `--version`, `-V` | Sürüm numarasını gösterir |
| `--no-color` | Renkli çıktıyı devre dışı bırakır |
| `--help`, `-h` | Komut için yardımı görüntüler |

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
| `--tools <list>` | AI araçlarını etkileşimsiz olarak yapılandırır. `all`, `none` veya virgülle ayrılmış liste kullanın |
| `--force` | Eski dosyaları sormadan otomatik temizler |
| `--profile <profile>` | Bu başlatma çalışması için global profili geçersiz kılın (`core` veya `custom`) |

`--profile custom`, global yapılandırmada (`openspec config profile`) o anda seçili olan iş akışlarını kullanır.

**Desteklenen araç kimlikleri (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**Örnekler:**

```bash
# Etkileşimli başlatma
openspec init

# Belirli bir dizinde başlatma
openspec init ./my-project

# Etkileşim olmayan: Claude ve Cursor için yapılandır
openspec init --tools claude,cursor

# Tüm desteklenen araçlar için yapılandır
openspec init --tools all

# Bu çalışma için profili geçersiz kıl
openspec init --profile core

# İstemleri atla ve eski dosyaları otomatik temizle
openspec init --force
```

**Oluşturdukları:**

```
openspec/
├── specs/              # Özellikleriniz (gerçekliğin kaynağı)
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

Çalışma alanı komutları beta sürümündedir. Aşağıdaki yerel görünüm modeli mevcut yöndür, ancak dış otomasyon, entegrasyonlar ve uzun süreli iş akışları, komut davranışını, durum dosyalarını ve JSON çıktısını değişken olarak ele almaya devam etmelidir.

Koordinasyon çalışma alanları, bağlı depolar veya klasörler üzerinde makine yerel görünümleridir. Çalışma alanı görünürlüğü, değişiklik taahhüdü değildir: OpenSpec'in bilmesi gereken depoları veya klasörleri bağlayın, ardından belirli işleri planlamaya hazır olduğunuzda değişiklikler oluşturun.

### `openspec workspace setup`

Standart OpenSpec çalışma alanı konumunda bir çalışma alanı oluşturur ve en az bir mevcut depoyu veya klasörü bağlar.

```bash
openspec workspace setup [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--name <name>` | Çalışma alanı adı. Adlar kebab-case olmalıdır |
| `--link <path>` | Mevcut bir depoyu veya klasörü bağlar ve bağlantı adını klasör adından çıkarır |
| `--link <name>=<path>` | Mevcut bir depoyu veya klasörü açık bir bağlantı adıyla bağlar |
| `--opener <id>` | Etkileşimsiz kurulum sırasında tercih edilen bir açıcı depolar: `codex-cli`, `claude`, `github-copilot` veya `editor` |
| `--tools <tools>` | Agent'lar için çalışma alanı yerel OpenSpec becerileri yükler. `all`, `none` veya virgülle ayrılmış araç kimlikleri kullanın |
| `--no-interactive` | İstemleri devre dışı bırakır; `--name` ve en az bir `--link` gerektirir |
| `--json` | JSON çıktısı verir; `--no-interactive` gerektirir |

**Örnekler:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli
openspec workspace setup --no-interactive --name platform --link /repos/api --tools codex,claude
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

Etkileşimli kurulum, tercih edilen bir açıcı ister ve seçili agent'lar için çalışma alanı yerel OpenSpec becerileri yükleyebilir. Etkileşimsiz kurulum, yalnızca `--opener` sağlandığında tercih edilen bir açıcı depolar; aksi takdirde `workspace open`, desteklenen bir açıcı mevcut olduğunda etkileşimli terminallerde daha sonra ister veya betiklerden `--agent <tool>` veya `--editor` geçirmesini ister.

Çalışma alanı beceri yüklemesi, bu beta diliminde yalnızca beceri seviyesindedir: global teslimat `commands` veya `both` olsa bile, çalışma alanı kurulumu, çalışma alanı kökünde agent beceri klasörleri yazar ve eğik çizgi komut dosyaları oluşturmaz. Aktif global profil, hangi iş akışı becerilerinin yükleneceğini seçer; `--tools` ise bunları hangi agent'ların alacağını seçer. Etkileşimsiz kurulumda `--tools` atlanırsa, beceri yüklenmez ve `workspace update --tools <ids>` bunları daha sonra ekleyebilir.

### `openspec workspace list`

Yerel kayıt defterinden bilinen OpenSpec çalışma alanlarını listeler.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

Liste, her çalışma alanının konumunu ve bağlı depoları veya klasörleri gösterir. Eski kayıt kayıtları raporlanır ancak değiştirilmez.

### `openspec workspace link`

Bir çalışma alanı için mevcut bir depoyu veya klasörü kaydeder.

```bash
openspec workspace link [name] <path> [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--workspace <name>` | Yerel kayıt defterinden bilinen bir çalışma alanı seçer |
| `--json` | JSON çıktısı verir |
| `--no-interactive` | Çalışma alanı seçici istemlerini devre dışı bırakır |

**Örnekler:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

Yol zaten mevcut olmalıdır. Göreli yollar, OpenSpec doğrulanmış mutlak yolu makine yerel çalışma alanı durumuna depolamadan önce, komutun geçerli dizinine göre çözümlenir. Bağlı yollar, depo yerel `openspec/` durumu olmayan tam depolar, paketler, hizmetler, uygulamalar veya klasörler olabilir.

### `openspec workspace relink`

Mevcut bir bağlantının yerel yolunu onarır veya değiştirir.

```bash
openspec workspace relink <name> <path> [options]
```

Yol zaten mevcut olmalıdır. Relink, yalnızca sabit bağlantı adı için makine yerel yolunu günceller.

### `openspec workspace doctor`

Bir çalışma alanının geçerli makinede neyi çözebileceğini kontrol eder.

```bash
openspec workspace doctor [options]
```

Doctor, çalışma alanı konumunu, bağlı depoları veya klasörleri, eksik yolları, mevcut olduğunda depo yerel özellik yollarını ve önerilen düzeltmeleri gösterir. JSON çıktısı ayrıca uyumluluk için çalışma alanı planlama yolunu içerir. Yalnızca sorunları rapor eder; otomatik olarak onarmaz.

Bir çalışma alanı gerektiren komutlar, bir çalışma alanı klasöründen veya alt dizininden çalıştırıldığında geçerli çalışma alanını kullanır. Başka bir yerden `--workspace <name>` geçin, etkileşimli terminalde seçiciyi kullanın veya yalnızca bir tane mevcut olduğunda tek bilinen çalışma alanına güvenin. `--json` veya `--no-interactive` modunda, belirsiz seçim, yapılandırılmış bir durum hatasıyla başarısız olur ve `--workspace <name>` önerir.

JSON yanıtları, `status` dizileri artı tip atanmış nesneler kullanır. Birincil veriler `workspace`, `workspaces` veya `link` içinde bulunur; uyarılar ve hatalar `status` içinde bulunur.

### `openspec workspace update`

Çalışma alanı yerel OpenSpec kılavuzunu ve agent becerilerini yeniler.

```bash
openspec workspace update [name] [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--workspace <name>` | Yerel kayıt defterinden bilinen bir çalışma alanı seçer |
| `--tools <tools>` | Çalışma alanı becerileri için agent'ları seçer. `all`, `none` veya virgülle ayrılmış araç kimlikleri kullanın |
| `--json` | JSON çıktısı verir |
| `--no-interactive` | Çalışma alanı seçici istemlerini devre dışı bırakır |

**Örnekler:**

```bash
openspec workspace update
openspec workspace update platform
openspec workspace update --workspace platform --tools codex,claude
openspec workspace update --workspace platform --tools none
```

`workspace update`, oluşturulan çalışma alanı kılavuz bloğunu ve yerel açık yüzeyi yeniler. Agent becerileri için, `--tools` atlandığında depolanmış çalışma alanı beceri agent seçimini yeniden kullanır. `--tools` geçmek, o depolanmış seçimin yerini alır. Yalnızca çalışma alanında depo kökündeki OpenSpec tarafından yönetilen iş akışı beceri dizinlerini yeniler, seçilmemiş yönetilen iş akışı becerilerini kaldırır ve bağlı depoları ve klasörleri dokunulmadan bırakır.

Bir çalışma alanı içinden `openspec update` çalıştırmak, `openspec workspace update`'e yönlendirir; depo sahipli araç dosyalarının güncellenmesini istediğinizde, depo yerel projelerin içinde `openspec update` çalıştırın.

### `openspec workspace open`

Depolanmış tercih edilen açıcı, tek seanslık bir agent geçersiz kılması veya VS Code düzenleyici modu aracılığıyla bir çalışma alanı çalışma kümesini açar.

```bash
openspec workspace open [name] [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--workspace <name>` | Konumsal çalışma alanı adı için takma ad |
| `--initiative <id>` | Bir girişimi yerel bir çalışma alanı görünümü olarak açar. `<id>` veya `<store>/<id>` kabul eder |
| `--store <id>` | `--initiative` için kayıtlı bağlam deposu kimliği |
| `--store-path <path>` | `--initiative` için mevcut yerel bağlam deposu kökü |
| `--agent <tool>` | Tek seanslık agent geçersiz kılması: `codex-cli`, `claude` veya `github-copilot` |
| `--editor` | Bakımlı VS Code çalışma alanı dosyasını normal bir düzenleyici çalışma alanı olarak açar |
| `--no-interactive` | Çalışma alanı ve açıcı seçici istemlerini devre dışı bırakır |

**Örnekler:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex-cli
openspec workspace open --editor
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative platform/billing-launch
```

`workspace open`, birinin içinde çalıştırıldığında geçerli çalışma alanını kullanır, başka bir yerde çalıştırıldığında tek bilinen çalışma alanını otomatik seçer ve birden fazla çalışma alanı bilindiğinde kullanıcının seçmesini ister. `--agent` ve `--editor`, depolanmış tercih edilen açıcıyı değiştirmez. Her iki açıcı geçersiz kılmasını da geçmek hatadır; `--agent <tool>` veya `--editor`'dan birini seçin.

`--initiative` kullanıldığında, OpenSpec o girişim için özel bir yerel çalışma alanı görünümü hazırlar veya seçer. Kayıt defteri tarafından seçilen depolar kimliğe göre depolanır; `--store-path`, çalışma alanı görünümleri özel yerel durum olduğundan, çalışma zamanı yerel bir yol seçici depolar.

OpenSpec, VS Code düzenleyici ve GitHub Copilot-in-VS-Code açmaları için çalışma alanında `<workspace-name>.code-workspace` dosyasını bakımını yapar. Bu dosya, makine yerel çalışma alanı görünümü durumudur.

Bakımlı VS Code çalışma alanı, önce geçerli bağlı depoları veya klasörleri, ardından eklenmiş olduğunda girişim bağlamını, ardından OpenSpec çalışma alanı dosyalarını listeler. VS Code bu girdileri kökler arası bir çalışma alanı olarak görüntüler.

Kök çalışma alanı açma, keşif ve bağlam için bağlı depoları veya klasörleri görünür kılar. Uygulama düzenlemeleri, yalnızca açık bir kullanıcı isteği ve normal bir OpenSpec uygulama iş akışından sonra başlamalıdır.

---

## Ortak Bağlam Komutları

Bağlam depoları ve inisiyatifler, beta aşama koordinasyon yüzeyleridir. Bir bağlam deposu, kalıcı ortak bağlam için yerel bir kayıttır; genellikle Git destekli bir klasör veya klonlamadır. İni̇si̇yati̇f ise bir bağlam deposu içindeki ortak koordinasyon bağlamıdır; depo içi değişiklikler, paylaşılan planı her depoya kopyalamadan buna bağlantı verebilir.

### `openspec context-store setup`

Yerel bir bağlam deposu oluşturur ve kaydeder. Terminalde bağımsız değişken verilmediğinde OpenSpec kullanıcıyı kurulum sürecinde yönlendirir. Aracılar ve betikler açık girdiler vermeli ve `--json` kullanmalıdır.

```bash
openspec context-store setup [id] [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--path <path>` | Bağlam deposu klasör yolu; öntanımlı olarak OpenSpec'in yönettiği yerel veri dizinini kullanır |
| `--init-git` | Bağlam deposunda bir Git deposu başlatır |
| `--no-init-git` | Git deposu başlatmaz |
| `--json` | JSON çıktısı verir |

`--path` atlandığında kurulum, deposu `getGlobalDataDir()/context-stores/<id>` altında oluşturur: `XDG_DATA_HOME` ayarlıyken `$XDG_DATA_HOME/openspec/context-stores/<id>` veya Unix tarzı geri dönüşlerde `~/.local/share/openspec/context-stores/<id>` konumunu kullanır. Deposu görünür bir klonlama veya ekibe özel bir klasörde tutmak istediğinizde `--path` parametresini kullanın.

Örnekler:

```bash
openspec context-store setup
openspec context-store setup team-context
openspec context-store setup team-context --path /repos/team-context --no-init-git
openspec context-store setup team-context --json --no-init-git
```

### `openspec context-store register`

Var olan bir yerel bağlam deposu klasörünü kaydeder.

```bash
openspec context-store register [path] [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--id <id>` | Bağlam deposu kimliği; öntanımlı olarak depo meta verisini veya klasör adını kullanır |
| `--json` | JSON çıktısı verir |

### `openspec context-store unregister`

Dosyaları silmeden bir yerel bağlam deposu kaydını kaldırır.

```bash
openspec context-store unregister <id> [--json]
```

Bu komutu bir deposu taşındığında, başka bir yere klonlandığında veya bu makinede OpenSpec tarafından artık gösterilmek istenmediğinde kullanın.

### `openspec context-store remove`

Yerel bir bağlam deposu kaydını kaldırır ve yerel klasörünü siler.

```bash
openspec context-store remove <id> [--yes] [--json]
```

`remove` komutu, etkileşimli bir terminalde silme işleminden önce tam klasör yolunu gösterir. Aracılar, betikler ve JSON çağrıcılar silmeyi onaylamak için `--yes` parametresini geçmelidir. OpenSpec, eşleşen bağlam deposu meta verisi içermeyen bir klasörü silmeyi reddeder.

### `openspec context-store list`

Yerel olarak kayıtlı bağlam depolarını listeler.

```bash
openspec context-store list [--json]
openspec context-store ls [--json]
```

### `openspec context-store doctor`

Yerel bağlam deposu kaydını, meta verisini ve Git varlığını kontrol eder.

```bash
openspec context-store doctor [id] [--json]
```

Doctor yalnızca tanısal amaçlıdır; deposu değiştirmeden eksik kök dizinleri, meta veri uyumsuzluklarını ve geçersiz yerel kayıt durumunu raporlar.

### `openspec initiative create`

Bir bağlam deposunda bir inisiyatif oluşturur.

```bash
openspec initiative create <id> --title <title> --summary <summary> [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--store <id>` | Yerel kayıttaki bağlam deposu kimliği |
| `--store-path <path>` | Var olan yerel bağlam deposu kök dizini |
| `--title <title>` | İni̇si̇yati̇f başlığı |
| `--summary <summary>` | İni̇si̇yati̇f özeti |
| `--json` | JSON çıktısı verir |

### `openspec initiative list`

İni̇si̇yati̇fleri listeler. Bir seçici belirtilmediğinde tüm kayıtlı bağlam depolarını arar ve `status` alanında kısmi okuma uyarılarını raporlar.

```bash
openspec initiative list [options]
openspec initiative ls [options]
```

**Seçenekler:**

| Seçenek | Açıklama |
|--------|-------------|
| `--store <id>` | Kayıtlı bir bağlam deposunu listeler |
| `--store-path <path>` | Var olan bir yerel bağlam deposu kök dizinini listeler |
| `--json` | JSON çıktısı verir |

### `openspec initiative show`

Bir inisiyatifi çözümler ve canonical konumunu yazdırır.

```bash
openspec initiative show <id> [options]
openspec initiative show <store>/<id> [options]
```

`--store` belirtilmediğinde OpenSpec kayıtlı bağlam depolarını arar. Aynı inisiyatif kimliği birden fazla depoda mevcutsa `--store <id>` parametresini geçin veya `<store>/<id>` biçimini kullanın.

---

## Tarama Komutları

### `openspec list`

Projenizdeki değişiklikleri veya belirtimleri listeleyin.

```
openspec list [seçenekler]
```

**Seçenekler:**

| Seçenek | Açıklama |
|---------|----------|
| `--specs` | Değişiklikler yerine belirtimleri listele |
| `--changes` | Değişiklikleri listele (varsayılan) |
| `--sort <sıra>` | Sıralama: `recent` (varsayılan) veya `name` |
| `--json` | Çıktıyı JSON olarak ver |

**Örnekler:**

```bash
# Tüm aktif değişiklikleri listele
openspec list

# Tüm belirtimleri listele
openspec list --specs

# Betikler için JSON çıktısı
openspec list --json
```

**Çıktı (metin):**

```
Aktif değişiklikler:
  add-dark-mode     Arayüz tema desteği
  fix-login-bug     Oturum zaman aşımı işleme
```

---

### `openspec view`

Belirtimleri ve değişiklikleri keşfetmek için etkileşimli bir gösterge tablosu görüntüleyin.

```
openspec view
```

Projenizin belirtimleri ve değişiklikleri arasında gezinmek için terminal tabanlı bir arayüz açar.

---

### `openspec show`

Bir değişikliğin veya belirtimin ayrıntılarını görüntüleyin.

```
openspec show [öğe-adı] [seçenekler]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|---------|---------|----------|
| `öğe-adı` | Hayır | Değişiklik veya belirtim adı (atlanırsa istenir) |

**Seçenekler:**

| Seçenek | Açıklama |
|---------|----------|
| `--type <tür>` | Türü belirt: `change` veya `spec` (belirsizse otomatik algılanır) |
| `--json` | Çıktıyı JSON olarak ver |
| `--no-interactive` | İstemleri devre dışı bırak |

**Değişikliğe özel seçenekler:**

| Seçenek | Açıklama |
|---------|----------|
| `--deltas-only` | Yalnızca delta belirtimlerini göster (JSON modu) |

**Belirtimlere özel seçenekler:**

| Seçenek | Açıklama |
|---------|----------|
| `--requirements` | Yalnızca gereksinimleri göster, senaryoları hariç tut (JSON modu) |
| `--no-scenarios` | Senaryo içeriğini hariç tut (JSON modu) |
| `-r, --requirement <id>` | 1 tabanlı dizinle belirli bir gereksinimi göster (JSON modu) |

**Örnekler:**

```bash
# Etkileşimli seçim
openspec show

# Belirli bir değişikliği göster
openspec show add-dark-mode

# Belirli bir belirtimi göster
openspec show auth --type spec

# Ayrıştırma için JSON çıktısı
openspec show add-dark-mode --json
```

---

## Doğrulama Komutları

### `openspec validate`

Değişiklikleri ve belirtimleri yapısal sorunlar için doğrulayın.

```
openspec validate [öğe-adı] [seçenekler]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|---------|---------|----------|
| `öğe-adı` | Hayır | Doğrulanacak belirli öğe (atlanırsa istenir) |

**Seçenekler:**

| Seçenek | Açıklama |
|---------|----------|
| `--all` | Tüm değişiklikleri ve belirtimleri doğrula |
| `--changes` | Tüm değişiklikleri doğrula |
| `--specs` | Tüm belirtimleri doğrula |
| `--type <tür>` | Ad belirsiz olduğunda türü belirt: `change` veya `spec` |
| `--strict` | Katı doğrulama modunu etkinleştir |
| `--json` | Çıktıyı JSON olarak ver |
| `--concurrency <n>` | Maksimum paralel doğrulama (varsayılan: 6, veya `OPENSPEC_CONCURRENCY` ortam değişkeni) |
| `--no-interactive` | İstemleri devre dışı bırak |

**Örnekler:**

```bash
# Etkileşimli doğrulama
openspec validate

# Belirli bir değişikliği doğrula
openspec validate add-dark-mode

# Tüm değişiklikleri doğrula
openspec validate --changes

# Her şeyi JSON çıktısıyla doğrula (CI/betikler için)
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

Tamamlanmış bir değişikliği arşivleyin ve delta belirtimlerini ana belirtimlerle birleştirin.

```
openspec archive [değişiklik-adı] [seçenekler]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|---------|---------|----------|
| `değişiklik-adı` | Hayır | Arşivlenecek değişiklik (atlanırsa istenir) |

**Seçenekler:**

| Seçenek | Açıklama |
|---------|----------|
| `-y, --yes` | Onay istemlerini atla |
| `--skip-specs` | Belirtim güncellemelerini atla (altyapı/araç/sadece doküman değişiklikleri için) |
| `--no-validate` | Doğrulamayı atla (onay gerektirir) |

**Örnekler:**

```bash
# Etkileşimli arşivleme
openspec archive

# Belirli bir değişikliği arşivle
openspec archive add-dark-mode

# İstemler olmadan arşivle (CI/betikler)
openspec archive add-dark-mode --yes

# Belirtimleri etkilemeyen bir araç değişikliğini arşivle
openspec archive update-ci-config --skip-specs
```

**Ne yapar:**

1. Değişikliği doğrular (`--no-validate` yoksa)
2. Onay ister (`--yes` yoksa)
3. Delta belirtimlerini `openspec/specs/` ile birleştirir
4. Değişiklik klasörünü `openspec/changes/archive/YYYY-MM-DD-<ad>/` taşır

---

## İş Akışı Komutları

Bu komutlar, eser odaklı OPSX iş akışını destekler. Hem ilerlemeyi kontrol eden insanlar hem de sonraki adımları belirleyen ajanlar için kullanışlıdır.

### `openspec new change`

Depo yerel bir değişiklik dizini ve isteğe bağlı olarak kaydedilen meta veriler oluşturun.

```bash
openspec new change <ad> [seçenekler]
```

**Seçenekler:**

| Seçenek | Açıklama |
|---------|----------|
| `--description <metin>` | `README.md`'ye eklenecek açıklama |
| `--goal <metin>` | Değişiklikle birlikte saklanacak çalışma alanı ürün hedefi |
| `--areas <isimler>` | Virgülle ayrılmış etkilenen çalışma alanı bağlantı adları |
| `--initiative <id>` | Depo yerel değişikliği bir girişimle ilişkilendir |
| `--store <id>` | `--initiative` için bağlam deposu kimliği |
| `--store-path <yol>` | `--initiative` için mevcut yerel bağlam deposu kök dizini |
| `--schema <ad>` | Kullanılacak iş akışı şeması |
| `--json` | JSON çıktısı ver |

Örnekler:

```bash
openspec new change add-billing-api --initiative billing-launch --store platform
openspec new change add-billing-api --initiative platform/billing-launch --json
```

### `openspec set change`

Değişikliği yeniden oluşturmadan depo yerel değişiklik meta verilerini güncelleyin.

```bash
openspec set change <ad> [seçenekler]
```

**Seçenekler:**

| Seçenek | Açıklama |
|---------|----------|
| `--initiative <id>` | Depo yerel değişikliği bir girişimle ilişkilendir |
| `--store <id>` | `--initiative` için bağlam deposu kimliği |
| `--store-path <yol>` | `--initiative` için mevcut yerel bağlam deposu kök dizini |
| `--json` | JSON çıktısı ver |

`set change --initiative`, istenen bağlantı zaten mevcut olduğunda idempotenttir ve farklı bir mevcut girişim bağlantısını değiştirmeyi reddeder.

### `openspec status`

Bir değişiklik için eser tamamlanma durumunu görüntüleyin.

```
openspec status [seçenekler]
```

**Seçenekler:**

| Seçenek | Açıklama |
|---------|----------|
| `--change <id>` | Değişiklik adı (atlanırsa istenir) |
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

[x] proposal
[ ] design
[x] specs
[-] tasks (engelleyen: design)
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

Bir eser oluşturmak veya görevleri uygulamak için zenginleştirilmiş talimatlar alın. Yapay zeka ajanları tarafından ne oluşturacaklarını anlamak için kullanılır.

```
openspec instructions [eser] [seçenekler]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|---------|---------|----------|
| `eser` | Hayır | Eser kimliği: `proposal`, `specs`, `design`, `tasks` veya `apply` |

**Seçenekler:**

| Seçenek | Açıklama |
|---------|----------|
| `--change <id>` | Değişiklik adı (etkileşimli olmayan modda gerekli) |
| `--schema <ad>` | Şema geçersiz kılma |
| `--json` | Çıktıyı JSON olarak ver |

**Özel durum:** Görev uygulama talimatları almak için `apply` eserini kullanın.

**Örnekler:**

```bash
# Bir sonraki eser için talimatları al
openspec instructions --change add-dark-mode

# Belirli bir eser talimatını al
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

Bir şemadaki tüm eserler için çözümlenmiş şablon yollarını gösterin.

```
openspec templates [seçenekler]
```

**Seçenekler:**

| Seçenek | Açıklama |
|---------|----------|
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
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Açıklamaları ve eser akışlarıyla birlikte mevcut iş akışı şemalarını listeleyin.

```
openspec schemas [seçenekler]
```

**Seçenekler:**

| Seçenek | Açıklama |
|---------|----------|
| `--json` | Çıktıyı JSON olarak ver |

**Örnek:**

```bash
openspec schemas
```

**Çıktı:**

```
Mevcut şemalar:

  spec-driven (paket)
    Varsayılan belirtim odaklı geliştirme iş akışı
    Akış: proposal → specs → design → tasks

  my-custom (proje)
    Bu proje için özel iş akışı
    Akış: research → proposal → tasks
```

---

## Şema Komutları

Özel iş akışı şemaları oluşturma ve yönetme komutları.

### `openspec schema init`

Yeni bir projeye özel şema oluşturun.

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
| `--artifacts <list>` | Virgülle ayrılmış yapıt kimlikleri (varsayılan: `proposal,specs,design,tasks`) |
| `--default` | Projenin varsayılan şeması olarak ayarla |
| `--no-default` | Varsayılan olarak ayarlamak için sorma |
| `--force` | Mevcut şemanın üzerine yaz |
| `--json` | Çıktıyı JSON olarak ver |

**Örnekler:**

```bash
# Etkileşimli şema oluşturma
openspec schema init research-first

# Belirli yapıtlarla etkileşimsiz oluşturma
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**Neler oluşturur:**

```
openspec/schemas/<name>/
├── schema.yaml           # Şema tanımı
└── templates/
    ├── proposal.md       # Her yapıt için şablon
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Özelleştirme için mevcut bir şemayı projenize kopyalayın.

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
| `--json` | Çıktıyı JSON olarak ver |

**Örnek:**

```bash
# Yerleşik spec-driven şemasını çatallayın
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
| `name` | Hayır | Doğrulanacak şema (belirtilmezse tüm şemalar doğrulanır) |

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

Bir şemanın nereden çözümlendiğini gösterir (öncelik sıralaması için kullanışlıdır).

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
| `--json` | Çıktıyı JSON olarak ver |

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

**Şema öncelik sıralaması:**

1. Proje: `openspec/schemas/<name>/`
2. Kullanıcı: `~/.local/share/openspec/schemas/<name>/`
3. Paket: Yerleşik şemalar

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
| `reset` | Varsayılanlara sıfırla |
| `edit` | `$EDITOR` ile aç |
| `profile [preset]` | İş akışı profilini etkileşimli olarak veya ön ayar ile yapılandır |

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

# Yapılandırmayı editörde düzenle
openspec config edit

# Aksiyon tabanlı sihirbazla profil yapılandırması
openspec config profile

# Hızlı ön ayar: iş akışlarını core'a geçir (teslimat modunu korur)
openspec config profile core
```

`openspec config profile` mevcut durum özetiyle başlar, ardından şunları seçmenizi sağlar:
- Teslimat + iş akışlarını değiştir
- Yalnızca teslimatı değiştir
- Yalnızca iş akışlarını değiştir
- Mevcut ayarları koru (çıkış)

Mevcut ayarları korursanız hiçbir değişiklik yazılır ve güncelleme istemi gösterilmez.
Yapılandırma değişikliği olmasa bile mevcut proje veya çalışma alanı dosyalarınız global profil/teslimat ayarlarınızla eşleşmiyorsa, OpenSpec bir uyarı gösterir ve yerel projeler için `openspec update`, çalışma alanı yerel yönergeler ve beceriler için `openspec workspace update` komutunu önerecektir.
`Ctrl+C` tuşuna basmak da akışı temizce iptal eder (yığın izi göstermez) ve `130` çıkış koduyla sonlanır.
İş akışı kontrol listesinde `[x]`, iş akışının global yapılandırmada seçili olduğu anlamına gelir. Bu seçimleri proje dosyalarına uygulamak için `openspec update` komutunu çalıştırın (veya bir proje içindeyken istendiğinde `Apply changes to this project now?` seçeneğini belirleyin). Bir çalışma alanı içinden, çalışma alanı yerel yönergeleri ve becerilerini yenilemek için `openspec workspace update` kullanın; bu, oluşturulan ajan iş akışı dosyaları için yalnızca beceriler düzeyinde kalır ve çalışma alanı eğik çizgi komutları oluşturmaz.

**Etkileşimli örnekler:**

```bash
# Yalnızca teslimat güncellemesi
openspec config profile
# seç: Yalnızca teslimatı değiştir
# teslimat seç: Yalnızca beceriler

# Yalnızca iş akışı güncellemesi
openspec config profile
# seç: Yalnızca iş akışlarını değiştir
# kontrol listesinde iş akışlarını değiştir, ardından onayla
```

---

## Yardımcı Komutlar

### `openspec feedback`

OpenSpec hakkında geri bildirim gönderin. Bir GitHub issue oluşturur.

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
| `--body <text>` | Ayrıntılı açıklama |

**Gereksinimler:** GitHub CLI (`gh`) yüklü ve kimlik doğrulaması yapılmış olmalıdır.

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
| `generate [shell]` | Tamamlama betiğini stdout'a çıktıla |
| `install [shell]` | Kabuğunuz için tamamlama yükle |
| `uninstall [shell]` | Yüklü tamamlamaları kaldır |

**Desteklenen kabuklar:** `bash`, `zsh`, `fish`, `powershell`

**Örnekler:**

```bash
# Tamplamaları yükle (kabuğu otomatik algılar)
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
| `OPENSPEC_TELEMETRY` | Telemetri devre dışı bırakmak için `0` olarak ayarlayın |
| `DO_NOT_TRACK` | Telemetri devre dışı bırakmak için `1` olarak ayarlayın (standart DNT sinyali) |
| `OPENSPEC_CONCURRENCY` | Toplu doğrulama için varsayılan eşzamanlılık (varsayılan: 6) |
| `EDITOR` veya `VISUAL` | `openspec config edit` için editör |
| `NO_COLOR` | Ayarlandığında renkli çıktıyı devre dışı bırakır |

---

## İlgili Belgelendirme

- [Komutlar](commands.md) - AI eğik çizgi komutları (`/opsx:propose`, `/opsx:apply` vb.)
- [İş Akışları](workflows.md) - Yaygın kalıplar ve her komutun ne zaman kullanılacağı
- [Özelleştirme](customization.md) - Özel şemalar ve şablonlar oluşturma
- [Başlarken](getting-started.md) - İlk kurulum kılavuzu