# Stores: Kendi Deposunda Planlama

> **Beta.** Stores, references, working context ve workset'ler yeni özelliklerdir. Komut adları, bayraklar, dosya formatları ve JSON çıktısı yayınlar arasında hala değişiklik gösterebilir. Aşağıdaki tüm adım adım açıklamalar mevcut derleme üzerinde çalıştırılmıştır, ancak yükseltme yaptıktan sonra bu kılavuzu tekrar okumanızı öneririz.

## Çözdüğü sorun

OpenSpec normalde tek bir repo içinde yer alır: kodunuzun yanında bulunan, bu repo için spesifikasyonları ve değişiklikleri barındıran bir `openspec/` klasörü.

Planlama çalışmalarınız tek bir repodan daha büyük olduğu anda bu durum artık uygun olmaz:
- Çalışmalarınız birden fazla repoyu kapsıyor: tek bir özellik API sunucusunu, web uygulamasını ve ortak bir kütüphaneyi etkiliyor. Plan hangi reponun `openspec/` klasöründe yer almalı?
- Ekibiniz kod oluşturulmadan önce planlama yapıyor ya da *bu* repoda hiç kod haline gelmeyecek şeyler planlıyor.
- Gereksinimler bir ekibe ait, diğer ekipler tarafından kullanılıyor. Wiki sürümü zamanla tutarsız hale geliyor, ayrıca coding agent'ınız zaten onu okuyamıyor.

**Store** bu soruna cevaptır: tüm amacı planlama olan bağımsız bir repodur. Daha önce bildiğiniz `openspec/` yapısına sahiptir — spesifikasyonlar ve değişiklikler — ek olarak küçük bir kimlik dosyası da bulunur. Makinenize bir kez isimle kaydettikten sonra, tüm standart OpenSpec komutları herhangi bir yerden bu repoda çalışabilir.

## Yapı

```
            team-plans  (bir depo: kendi deposunda planlama)
            ├── .openspec-store/store.yaml     kimlik: "Ben team-plans'im"
            └── openspec/
                ├── specs/      doğru olanlar
                └── changes/    devam edenler
                      ▲
                      │ her makinede ada göre kayıtlıdır;
                      │ herhangi bir depo gibi itme/klonlama yoluyla paylaşılır
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

İki kural bunu basit tutar:

1. **Bir depo sadece bir git deposudur.** Kendiniz commit atar, itir, çekersiniz ve incelersiniz. OpenSpec hiçbir zaman kendi başına hiçbir şeyi klonlamaz, senkronize etmez veya itmez.
2. **Bildirimler, makineler değil.** Depolar, depolar ile ilişkilerini *bildirebilir* (aşağıda gösterilmiştir). Bildirimler, OpenSpec'ın size ne söyleyebileceğini değiştirir — asla komutlarınızın nerede çalıştığını değiştirmez.

## İlk deponuza beş dakika

İki komut sizi hiçbir şeyden çalışan, depo kapsamlı bir değişikliğe kadar götürür:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Depo hazır: team-plans
Konum: /Users/you/openspec/team-plans
OpenSpec kökü: hazır
Kayıt: kayıtlı

Sonraki adım: bu depoya karşı normal OpenSpec komutlarını çalıştırın, örneğin:
  openspec new change <change-id> --store team-plans
Bu depoyu herhangi bir Git deposu gibi commit atıp iterek paylaşın.
```

```bash
openspec new change add-login --store team-plans
```

```
Kullanılan OpenSpec kökü: team-plans (/Users/you/openspec/team-plans)
'add-login' değişikliği /Users/you/openspec/team-plans/openspec/changes/add-login/ konumunda oluşturuldu
Şema: spec-driven
Sonraki adım: openspec status --change add-login --store team-plans
```

İşte tüm model. Buradan itibaren yaşam döngüsü tam olarak bildiğiniz gibidir — `status`, `instructions`, `validate`, `archive` — her komutta `--store team-plans` bayrağıyla birlikte, ve yazdırılan her ipucu sizin için bu bayrağı taşır. `Using OpenSpec root:` satırı her zaman bir komutun nerede çalıştığını size söyler.

## Hikaye: bir takım, bir planlama deposu

Bir takım, spec'lerini ve değişikliklerini kod depolarına dağıtmak yerine `team-plans` deposunda tutar.

**İlk gün (kurulumu yapan kişi):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

`--remote` bayrağını geçmek, klon URL'sini deponun kendi kimlik dosyasına (`.openspec-store/store.yaml`), ilk commit içine kaydeder. Gelecekteki her klon, nereden geldiğini bilerek doğar, böylece sağlık kontrolleri ve hata mesajları, henüz sahip olmayan takım arkadaşları için tam, yapıştırılabilir bir çözüm yazdırabilir.

**Her takım arkadaşı (makine başına bir kez):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

O andan itibaren herkes aynı planlama deposunda ada göre çalışır:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**İş paylaşımı kasıtlı olarak git'tir.** Oluşturduğunuz bir değişiklik, commit atıp itene kadar sadece sizin çektiğiniz kopyada vardır — kod ile aynı şekilde. Planlar ücretsiz olarak dallar, çekme istekleri ve inceleme alır, çünkü bir depo sıradan bir depodur.

**Takımın kod depolarını bağlama.** Planlaması tamamen dışa aktarılmış bir kod deposu, `openspec/config.yaml` içinde tam olarak bir satıra ihtiyaç duyar:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Artık `web-app` içinde çalıştırılan her OpenSpec komutu, hiç bayrak kullanmadan `team-plans` üzerinde çalışır:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

Bu işaretçi bir yedek olasılıktır, asla bir geçersiz kılma değildir: açıkça belirtilmiş bir `--store` her zaman kazanır, ve eğer depo kendi gerçek planlama klasörlerini geliştirirse, bunlar kazanır (eski işaretçiyi kaldırma uyarısıyla birlikte).

**Makinenizdeki her depo için tek bir varsayılan.** Aynı depoya planlayan birçok kod deposu üzerinde çalışıyorsanız, her depoya `store:` satırı eklemek yerine global olarak bir kez ayarlayın:

```bash
openspec config set defaultStore team-plans
```

Artık bir planlama kökü dışında çalıştırılan ve `--store` veya proje işaretçisi olmayan her komut, `team-plans` olarak çözülür. Öncelik listesinin en altında yer alır, bu nedenle `--store`, yerel bir kök ve projenin `store:` işaretçisi hala kazanır. Kök başlığı ve JSON `root` bloğu, depo kimliği ile birlikte `source: "global_default"` olarak raporlar, böylece her zaman makine genelindeki varsayılanı bir deponun kendi işaretçisinden ayırt edebilirsiniz. `openspec config unset defaultStore` komutuyla temizleyin. Kimlik kayıtlı değilse, komutlar hata verir ve kayıt etmenizi veya eski varsayılanı temizlemenizi söyler.

## Hikaye: takım sınırlarını aşan gereksinimler

Bir platform takımı gereksinimlere sahiptir. Ürün takımları, kendi depolarında, kendi tasarımlarıyla bu gereksinimlere göre inşa eder. Bir referans, hiç kimsenin işini taşımadan bu ilişkiyi tanımlar.

```
   platform-reqs (depo)                 api-server (kod deposu)
   platform takımı tarafından sahiplenilir            bir ürün takımı tarafından sahiplenilir
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ okur    │   referanslar:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (kendi tasarımları)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (kendi işleri)       │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**Ürün takımı, neyi temel aldığını** kendi deposunun `openspec/config.yaml` dosyasında bildirir:

```yaml
references:
  - platform-reqs
```

Referanslar salt okunur bağlamdır. Depo kendi `openspec/` kökünü korur; iş orada kalır. Değişen şey: o depodaki `openspec instructions` komutu artık referans verilen deponun spec'lerinin bir dizinini içerir — her biri tek satırlık bir özet ve tam getirme komutuyla birlikte (`openspec show <spec-id> --type spec --store platform-reqs`). `api-server` içinde çalışan bir ajan, üst düzey ödeme gereksinimlerini bulabilir, onları alıntılayabilir ve düşük seviye tasarımını deponun kendi köküne yazabilir — hiç kimsenin bağlamı etrafa yapıştırmasına gerek kalmadan.

Bir referans kendi klon kaynağını taşıyabilir, böylece depoyu henüz sahip olmayan takım arkadaşları için bir çıkmaz sokak yerine tam bir çözüm sağlanır:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Planı ve kodu birlikte açık tutmak istediğinizde bir workset (çalışma kümesi) oluşturun.** Bu kişisel ve açıktır: her kişi makinesinde gerçekten çalıştığı klasörleri seçer. Bu yerel çekme kopyası yollarıyla ilgili hiçbir şey, paylaşılan planlama deposuna commit edilmez.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Her zaman sorabileceğiniz iki soru

**"Kurulumum sağlıklı mı?"** — `openspec doctor` komutu, salt okunur olarak mevcut kökü ve referans verilen depoları kontrol eder, her bulgu için yapıştırılabilir bir çözüm sunar:

```
Doktor

Kök
  Konum: /Users/you/src/api-server
  OpenSpec kökü: tamam

Referanslar
  - platform-reqs: tamam (/Users/you/openspec/platform-reqs)
  - design-system: Referans verilen 'design-system' deposu bu makinede kayıtlı değil.
    Çözüm: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"Ne ile çalışıyorum?"** — `openspec context` komutu, OpenSpec bildirimlerinden çalışma kümesini bir araya getirir: kök ve referans verdiği depolar.

```
api-server için çalışma bağlamı (/Users/you/src/api-server)

OpenSpec kökü
  api-server  /Users/you/src/api-server

Referans verilen depolar
  platform-reqs  /Users/you/openspec/platform-reqs
    Getir: openspec show <spec-id> --type spec --store platform-reqs
```

Her ikisi de ajanlar için `--json` bayrağını destekler. `openspec context --code-workspace <yol>` komutu ek olarak tüm seti içeren bir VS Code çalışma alanı dosyası yazar — bu komutun yaptığı tek yazma işlemidir.

## Workset'ler: birlikte çalıştığınız klasörleri yeniden açın

Yukarıdakilerin ayrıldığı bir konu: çoğu kişi her oturumda aynı birkaç klasörü birlikte açar — planlama deposu artı iki veya üç kod deposu. Bir **workset (çalışma kümesi)**, tam olarak bunun kişisel, adlandırılmış bir görünümüdür, seçtiğiniz araçla tek bir komutla yeniden açılır.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       tümü araçta açılır
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (VS Code'da açılır)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` komutu daha sonra kaydedilmiş aracı başlatır: editörler (VS Code, Cursor) tüm üyeleri içeren tek bir pencere açar ve döner. İlk üye birincildir. Araç istediğiniz zaman `--tool <kimlik>` ile geçersiz kılın.

Workset'ler kasıtlı olarak *paylaşılan durum* değildir. Makinenizde yaşar, asla commit edilmez ve iş hakkında hiçbir iddiada bulunmaz — sadece birlikte açmayı sevdiğiniz şeyleri kaydeder. Birini kaldırmak hiçbir zaman üye klasörlerine dokunmaz. Yeni araçlar yapılandırma, kod değildir: bir çalışma alanı dosyası veya klasör başına ekleme bayraklarıyla başlatılan her şey, global yapılandırmada (`openspec config edit`) `openers` anahtarı altına eklenebilir.

## Komutların nerede çalışacağını nasıl belirlediği

Her normal komut, kökünü aynı şekilde, bu sırayla çözer:

```
1. --store <kimlik>          açıkça belirttiniz        → o depo
2. en yakın openspec/     burada gerçek bir planlama kökü     → bu depo
   (cwd'den yukarı doğru yürüyerek)
3. store: işaretçisi        config.yaml bir depo bildirir  → o depo
4. defaultStore          global yapılandırma makine genelinde  → o depo
                         varsayılan ayarlar
5. yukarıdakilerin hiçbiri     bu makinede kayıtlı depolar var mı?  → seçim ipucuyla hata
                         makinede kayıtlı depo yok?         → mevcut
                                                          klasör
                                                          (klasik davranış)
```

`Using OpenSpec root:` satırı (ve `--json` çıktısındaki `root` bloğu) hangi durumda olduğunuzu size söyler.

## Bilinen sınırlamalar

- **Beta dönemi şekli.** Bu sayıdaki her şey yayınlar arasında değişebilir — isimler, bayraklar, dosya formatları, JSON anahtarları.
- **Makine başına depo kimliği başına tek bir çekme kopyası.** Aynı kimlik altında ikinci bir çekme kopyasını kaydetmek, önce `store unregister` komutunu kullanmanız için bir ipucuyla başarısız olur.
- **Asla senkronizasyon yok — tasarım gereği.** OpenSpec hiçbir zaman klonlamaz, çekmez veya itmez. Eski bir çekme kopyası, *siz* çekene kadar eski spec'leri gösterir; referanslar, diskte ne varsa canlı olarak dizinlenir.
- **Boş planlama klasörleri eksik olabilir.** Yeni bir depoda Git'te henüz `openspec/changes/`, `openspec/specs/` veya `openspec/changes/archive/` olmayabilir. Bu beta süresince kabul edilir; bu klasörler normal komutlar dosyalarını oluşturduğunda ortaya çıkar.
- **İşaretçi depolar işaretçi olarak kalır.** Sadece `openspec/config.yaml` içinde `store: <kimlik>` bildiren bir yapılandırma deposu, kaydedilecek bir depo çekme kopyası yerine dışa aktarılmış planlama olarak değerlendirilir. Kasıtlı olarak bu depoyu yerel bir depo köküne dönüştürmek istiyorsanız önce `store:` satırını kaldırın.
- **Bazı komutlar oldukları yerde kalır.** `view`, `templates`, `schemas` ve kullanımdan kalkmış isimli formlar (`openspec change show`, ...) sadece mevcut dizinde çalışır — `--store` bayrağı yoktur.
- **Makine başına durum, o makineye özeldir.** Depo kayıt defteri ve workset'ler yerel ayarlardır. Makinenizin düzeniyle ilgili hiçbir şey asla paylaşılan planlamaya commit edilmez.
- **Workset'ler için iki başlatma stili var.** Bir çalışma alanı dosyası veya klasör başına ekleme bayraklarıyla başlatılamayan bir araç, bir açıcı olarak eklenemez.
- **Ajan JSON'unda bilinen bir büyük/küçük harf ayrımı vardır** (depo ailesi anahtarları snake_case, iş akışı ailesi camelCase). [Ajan sözleşmesinde](../agent-contract.md) belgelenmiştir; birleştirilmesi sürümlü bir yayına ertelenmiştir.

## Neler nerede saklanır

| Nesne | Konum | Paylaşılıyor mu? |
|---|---|---|
| Mağazanın planlaması | `<store>/openspec/` (specs, changes) | Evet — commit edip push yapın |
| Mağazanın kimliği | `<store>/.openspec-store/store.yaml` | Evet — mağaza ile birlikte commit edilir |
| Mağaza kayıt defteri | `<data dir>/openspec/stores/registry.yaml` | Hayır — yalnızca bu makineye özeldir |
| Worksets | `<data dir>/openspec/worksets/` | Hayır — yalnızca bu makineye özeldir |

`<data dir>`, macOS ve Linux'ta `~/.local/share/openspec` (ayarlanmışsa `$XDG_DATA_HOME/openspec`) ve Windows'ta `%LOCALAPPDATA%\openspec` olarak tanımlanır.

## Referans

Bu sayfadaki her komut için tam bayraklar ve JSON şemaları:
[CLI reference](../cli.md) (Stores, Doctor, Working context, Personal worksets) ve [agent contract](../agent-contract.md).