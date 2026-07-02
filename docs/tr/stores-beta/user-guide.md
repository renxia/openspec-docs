# Stores: Kendi Repo'su Olan Planlama

> **Beta.** Stores, referanslar, çalışma bağlamı (working context) ve iş setleri (worksets) yeni eklenmiştir. Komut adları, bayraklar (flags), dosya formatları ve JSON çıktısı sürümler arasında değişebilir. Aşağıdaki her bir deneme mevcut derlemeye karşı çalıştırılmıştır, ancak yükseltme yaptıktan sonra bu rehberi tekrar okuyun.

## Bu Sorunu Çözmesi

OpenSpec normalde tek bir kod deposu (repo) içinde bulunur: o deponun yanında bulunan bir `openspec/` klasörü, ilgili repo için spesifikasyonları ve değişiklikleri içerir.

Bu durum, planlamanız birden fazla depoyu kapsadığında yetersiz kalır:

- Çalışmanız birkaç depoyu kapsar — bir özellik API sunucusunu, web uygulamasını ve paylaşılan bir kütüphaneyi etkiliyor olabilir. Plan hangi `openspec/` klasöründe yer alacak?
- Ekibiniz koddan önce planlama yapar veya bu repo'da asla kod haline gelmeyecek şeyleri planlar.
- Gereksinimler bir ekip tarafından sahiplenir ve diğer ekipler tarafından tüketilir. Wiki sürümü değişir, ancak kodlama aracınız bunu okuyamaz.

Bir **store**, bunun cevaptır: Planlamanın tek görevi olan bağımsız bir depodur (standalone repo). Zaten bildiğiniz gibi spesifikasyonlar ve değişiklikleri içeren `openspec/` yapısına sahiptir — buna küçük bir kimlik dosyası eklenmiştir. Bunu makinenizde bir kez, adıyla kaydedersiniz ve böylece her normal OpenSpec komutu herhangi bir yerden bunda çalışabilir.

## The shape

```
            team-plans  (a store: planning in its own repo)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      what is true
                └── changes/    what is in motion
                      ▲
                      │ registered on each machine by name;
                      │ shared by pushing/cloning like any repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

İki kural bunu basitleştirir:

1. **Bir store sadece bir git repo'sudur.** Kendiniz commit eder, push, pull ve inceleme yaparsınız. OpenSpec kendi başına hiçbir şeyi klonlamaz, senkronize etmez veya push etmez.
2. **Makine değil, deklarasyonlar.** Repolar, stores ile nasıl ilişkili olduklarını *deklare edebilirler* (aşağıda gösterildiği gibi). Bu deklarasyonlar, OpenSpec'in size ne söyleyebileceğini değiştirir — asla komutlarınızın nerede çalıştığını değil.

## İlk store'unuza beş dakika

Sıfırdan çalışan, store kapsamlı bir değişikliğe ulaşmanızı sağlayan iki komut vardır:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Next: run normal OpenSpec commands against this store, for example:
  openspec new change <change-id> --store team-plans
Share this store by committing and pushing it like any Git repo.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Next: openspec status --change add-login --store team-plans
```

Bu tüm modeli oluşturur. Buradan itibaren yaşam döngüsü tam olarak bildiğiniz gibidir — `status`, `instructions`, `validate`, `archive` — her komutta `--store team-plans` ile birlikte ve basılan her ipucu sizin için bayrağı taşır. `Using OpenSpec root:` satırı daima bir komutun nerede çalıştığını söyler.

## Hikaye: Bir ekip, bir planlama deposu

Bir ekip, gereksinimlerini kod depolarına dağıtmak yerine `team-plans` içinde tutar.

**İlk gün (kurulumu yapan kim olursa):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

`--remote` parametresini geçirmek, klon URL'sini store'un kendi kimlik dosyası (`.openspec-store/store.yaml`) içine ilk commit ile kaydeder. Her gelecekteki klonlama, nereden geldiğini bilerek doğar; bu sayede sağlık kontrolleri ve hata mesajları, henüz sahip olmayan ekip arkadaşları için eksiksiz, yapıştırılabilir bir çözüm gösterebilir.

**Her ekip arkadaşı (makine başına bir kez):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

Bundan sonra herkes, ismine göre aynı planlama deposunda çalışır:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**İş paylaşımı kasıtlı olarak git'tir.** Oluşturduğunuz bir değişiklik, siz commit edip push yapana kadar sadece sizin checkout'ınızda bulunur — bu da kodla aynıdır. Planlar, bir store sıradan bir depo olduğu için dallar, pull request'ler ve inceleme kazanır.

**Ekibin kod depolarını bağlamak.** Planlaması tamamen dışarıya aktarılmış olan bir kod deposu, `openspec/config.yaml` dosyasında tam olarak tek bir satıra ihtiyaç duyar:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Şimdi `web-app` içinde çalıştırılan her OpenSpec komutu, hiçbir bayrak kullanmadan `team-plans` üzerinde hareket eder:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

Bu işaretçi bir yedek, asla bir geçersiz kılma değildir: açıkça belirtilen `--store` her zaman kazanır ve eğer depo kendi planlama klasörlerini büyütürse, onlar kazanır (eski işaretçiyi kaldırma uyarısıyla birlikte).

## Hikaye: Ekip sınırlarını aşan gereksinimler

Bir platform ekibi gereksinimleri sahiplenir. Ürün ekipleri, kendi depolarında ve kendi tasarımlarıyla bunlara karşı çalışır. Bir referans, kimsenin işini hareket ettirmeden bu ilişkiyi tanımlar.

```
   platform-reqs (store)                 api-server (code repo)
   owned by the platform team            owned by a product team
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ reads    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (their own designs)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (their own work)       │
   │                          │          │          └──────────────────────────┘
   └──────────────────────────┘
```

**Ürün ekibi, kendi deposundaki `openspec/config.yaml` dosyasında neye dayandığını deklar eder:**

```yaml
references:
  - platform-reqs
```

Referanslar salt okunur bağlamdır. Depo kendi `openspec/` kökünü korur; iş orada kalır. Ne değişir? O repodaki `openspec instructions`, şimdi referans verilen store'un spec'lerinin bir dizinini içerir — her biri tek satırlık bir özet ve tam çekme komutu (`openspec show <spec-id> --type spec --store platform-reqs`). Bir `api-server` içinde çalışan bir ajan, yukarı akış (upstream) ödeme gereksinimlerini bulabilir, bunları alıntılayabilir ve kendi deposunun kökünde düşük seviyeli tasarımını yazabilir — kimsenin bağlamı yapıştırmasına gerek kalmadan.

Bir referans klon kaynağını taşıyabilir, böylece henüz store'a sahip olmayan ekip arkadaşları ölü bir uç yerine eksiksiz bir çözüm alır:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Plan ve kodu birlikte açmak istediğinizde bir workset oluşturun.** Bu kişiseldir ve açıktır: her kişi kendi makinesinde gerçekten çalıştığı klasörleri seçer. Bu yerel checkout yollarıyla ilgili hiçbir şey paylaşılan planlama deposuna commit edilmez.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Her zaman sorabileceğiniz iki soru

**"Kurulumum sağlıklı mı?"** — `openspec doctor`, mevcut kökü ve referans verilen stores'ları salt okunur olarak kontrol eder, her bulgu için yapıştırılabilir bir çözüm sunar:

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Referenced store 'design-system' is not registered on this machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"Ne ile çalışıyorum?"** — `openspec context`, OpenSpec deklarasyonlarından çalışma setini toplar: kök ve referans verdiği stores'lar.

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

Her ikisi de ajanlar için `--json` destekler. `openspec context --code-workspace <path>`, tüm seti içeren bir VS Code çalışma alanı dosyası yazar — bu komutun yaptığı tek yazma işlemidir.

## Worksetler: Birlikte çalıştığınız klasörleri yeniden açın

Yukarıdakilerin hepsinden ayrı olarak: Çoğu kişi her oturumda aynı birkaç klasörü birlikte açar — planlama deposu artı iki veya üç kod deposu. Bir **workset**, tam olarak bunu temsil eden kişisel, isimlendirilmiş bir görünümdür ve seçtiğiniz araçta tek bir komutla yeniden açılır.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       all three open in your tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (opens in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` daha sonra kaydedilmiş aracı başlatır: editörler (VS Code, Cursor) her üye ile tek bir pencere açar ve geri döner. İlk üye ana olandır. Aracı istediğiniz zaman `--tool <id>` ile geçersiz kılabilirsiniz.

Worksetler kasıtlı olarak *paylaşılan durum değildir*. Makinenizde yaşarlar, asla commit edilmezler ve iş hakkında herhangi bir iddia taşımazlar — sadece neyi birlikte açmayı sevdiğinizi kaydederler. Birini kaldırmak, üye klasörlerine dokunmaz. Yeni araçlar yapılandırmadır, kod değil: çalışma alanı dosyası veya per-folder attach bayrakları aracılığıyla başlatılan her şey, genel yapılandırma (`openspec config edit`) içindeki `openers` anahtarı altında eklenebilir.

## Komutların nerede hareket edeceğini nasıl belirlediği

Her normal komut kökünü aynı şekilde çözer, bu sırayla:

```
1. --store <id>          bunu açıkça siz söylediniz        → o store
2. nearest openspec/     burada gerçek bir planlama kökü var → bu depo
   (cwd'den yukarı doğru ilerleyerek)
3. store: pointer        config.yaml bir store deklar ediyor  → o store
4. none of the above     bu makinada kayıtlı store'lar yok?    → seçim ipucuyla hata
                         stores registered?         → hiçbir store kayıtlı değil mi? → mevcut
                                                          dizin (klasik davranış)
```

`Using OpenSpec root:` satırı (ve `--json` çıktısındaki `root` bloğu), hangi durumun içinde olduğunuzu söyler.

## Bilinen sınırlamalar

- **Beta şekli.** Bu sayfadaki her şey sürümler arasında değişebilir — isimler, bayraklar, dosya formatları, JSON anahtarları.
- **Makine başına bir checkout.** Aynı ID altında ikinci bir checkout kaydetmek, önce `store unregister` ile ipucu vererek başarısız olur.
- **Asla senkronizasyon yok — tasarım gereği.** OpenSpec asla klonlamaz, çekmez veya push etmez. Eski bir checkout, *siz* çekene kadar eski spec'leri gösterir; referanslar disktaki her şeyden canlı olarak dizinlenir.
- **Bazı komutlar yerinde kalır.** `view`, `templates`, `schemas` ve kullanımdan kaldırılmış isim formları (`openspec change show`, vb.) yalnızca mevcut klasör üzerinde hareket eder — `--store` gerektirmez.
- **Makineye özgü durum, makineye özgüdür.** Store kayıt defteri ve worksetler yerel ayarlardır. Makinenizin düzeni hakkında hiçbir şey paylaşılan planlamaya commit edilmez.
- **Worksetler için iki başlatma stili.** Bir çalışma alanı dosyası veya per-folder attach bayrakları ile başlatılamayan bir araç, açıcı (opener) olarak eklenemez.
- **Ajan JSON'unda bilinen bir casing ayrımı var** (store-family anahtarları snake_case, workflow-family camelCase). Bu durum [agent contract](../agent-contract.md)'te belgelenmiştir; bunu tek birleştirmek, sürüm odaklı bir sürüme ertelenmiştir.

## Her şey nerede bulunur

| Ne | Nerede | Paylaşılan mı? |
|---|---|---|
| Bir store'un planlaması | `<store>/openspec/` (specs, changes) | Evet — commit edin ve push yapın |
| Bir store'un kimliği | `<store>/.openspec-store/store.yaml` | Evet — store ile birlikte commit edilir |
| Store kayıt defteri | `<data dir>/openspec/stores/registry.yaml` | Hayır — bu makineye özeldir |
| Worksetler | `<data dir>/openspec/worksets/` | Hayır — bu makineye özeldir |

`<data dir>`, macOS ve Linux'ta `~/.local/share/openspec` (veya ayarlanmışsa `$XDG_DATA_HOME/openspec`), Windows'ta ise `%LOCALAPPDATA%\openspec`'tir.
## Referans

Bu sayfadaki her komut için kesin bayraklar ve JSON şekilleri:
[CLI reference](../cli.md) (Stores, Doctor, Working context, Personal worksets) ve [agent contract](../agent-contract.md).