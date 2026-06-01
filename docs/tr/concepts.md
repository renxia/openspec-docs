# Kavramlar

Bu kılavuz, OpenSpec'in arkasındaki temel fikirleri ve bunların nasıl bir araya geldiğini açıklar. Pratik kullanım için bkz. [Başlarken](getting-started.md) ve [İş Akışları](workflows.md).

## Felsefe

OpenSpec, dört temel ilke üzerine kurulmuştur:

```
katı değil akıcı         — faz kapıları yok, mantıklı olan üzerinde çalışın
şelale değil yinelemeli — oluştururken öğren, ilerledikçe geliştir
karmaşık değil kolay     — hafif kurulum, minimal formalite
önce brownfield          — sadece sıfırdan değil, mevcut kod tabanlarıyla çalışır
```

### Bu İlkeler Neden Önemlidir

**Katı değil akıcı.** Geleneksel belirtim sistemleri sizi fazlara kilitler: önce planlar, sonra uygular, sonra biter. OpenSpec daha esnektir — çalışmalarınız için mantıklı olan herhangi bir sırada yapıtlar oluşturabilirsiniz.

**Şelale değil yinelemeli.** Gereksinimler değişir. Anlayış derinleşir. Başlangıçta iyi görünen bir yaklaşım, kod tabanını gördükten sonra geçerliliğini yitirebilir. OpenSpec bu gerçeği kucaklar.

**Karmaşık değil kolay.** Bazı belirtim çerçeveleri kapsamlı kurulum, katı formatlar veya ağır süreçler gerektirir. OpenSpec yolunuzdan çekilir. Saniyeler içinde başlatın, hemen çalışmaya başlayın, yalnızca gerekirse özelleştirin.

**Önce brownfield.** Çoğu yazılım çalışması sıfırdan oluşturma değil — mevcut sistemleri değiştirmedir. OpenSpec'in delta tabanlı yaklaşımı, yalnızca yeni sistemleri tanımlamak yerine mevcut davranışlarda değişiklikler belirtmeyi kolaylaştırır.

## Büyük Resim

OpenSpec çalışmanızı iki ana alana organize eder:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source of truth    │◄─────│  Proposed modifications       │   │
│   │  How your system    │ merge│  Each change = one folder     │   │
│   │  currently works    │      │  Contains artifacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Spesifikasyonlar** gerçeğin tek kaynağıdır — sisteminizin şu anda nasıl çalıştığını tanımlar.

**Değişiklikler** önerilen değişikliklerdir — birleştirmeye hazır olana kadar ayrı klasörlerde yaşarlar.

Bu ayrım anahtardır. Çakışmalar olmadan paralel olarak birden fazla değişiklik üzerinde çalışabilirsiniz. Ana spesifikasyonları etkilemeden önce bir değişikliği inceleyebilirsiniz. Ve bir değişikliği arşivlediğinizde, deltaları temiz bir şekilde gerçeğin tek kaynağına birleşir.

## Koordinasyon Çalışma Alanları

Çalışma Alanı desteği beta sürümündedir. Aşağıdaki yerel görünüm modeli mevcut yönlendirmedir, ancak harici otomasyonlar, entegrasyonlar ve uzun süreli iş akışları hâlâ komut davranışını, durum dosyalarını ve JSON çıktısını değişken olarak ele almalıdır.

Aşağıdaki komutlar, bağlı depoları veya klasörleri açmak için ilk kurulum akışını sağlar.

Repo-lokal OpenSpec projeleri, planlama, uygulama ve arşiv akışına tek bir repo sahip olduğunda doğru varsayılan değerdir. Bazı işler birden fazla repo veya klasörü kapsar. Bu durumda, bir OpenSpec koordinasyon çalışma alanı, bağlı yolları, açıcı durumunu ve ajan kurulumunu bir arada tutan makine-lokal bir görünümdür.

Çalışma Alanı zihinsel modeli şudur:

```text
workspace     = private local view over context stores, initiatives, repos, and folders
context store = durable shared context container
initiative    = durable coordination context inside a context store
link          = a stable name for a repo or folder the workspace can resolve locally
change        = one planned piece of work; implementation belongs in the owning repo
```

Bir çalışma alanının, repo-lokal bir projeden farklı bir şekli vardır:

```text
getGlobalDataDir()/workspaces/<workspace-name>/
├── workspace.yaml                 # Private local view record
├── AGENTS.md                      # Generated runtime guidance
└── <workspace-name>.code-workspace # Generated editor workspace file
```

Repo-lokal OpenSpec durumu mevcut şekli korur:

```text
repo-root/
└── openspec/
    ├── specs/
    └── changes/
```

Bu ayrım önemlidir. Çalışma alanı klasörü, bağlı depoları veya klasörleri açmak ve incelemek için yerel bir koordinasyon yüzeyidir. Her repo'nun `openspec/` dizini, repo'ya ait spesifikasyonlar, repo-lokal değişiklikler ve uygulama planlaması için merkez olmaya devam eder. Kullanıcıların bir çalışma alanı klasörü içinde repo-lokal `openspec init` çalıştırmasına gerek yoktur.

Kararlı bağlantı adları, bir çalışma alanının depolara ve klasörlere başvurma yoludur. Özel çalışma alanı kaydı, `api`, `web` veya `checkout` gibi isimleri tutar ve bunları bu çalışma zamanının yerel yollarına eşler.

```yaml
# workspace.yaml
version: 1
name: platform
context: null
links:
  api: /repos/api
  web: /repos/web
```

Bir çalışma alanı bir inisiyatif açtığında, `context` seçilen bağlam deposu bağını ve inisiyatif kimliğini kaydeder. Kayıt-defteri seçili depolar kimliğe göre taşınabilir kalır; yol seçili depolar ise kasıtlı olarak çalışma zamanı-lokal yolu korur çünkü `workspace.yaml` özel yerel durumdur.

```yaml
context:
  kind: initiative
  store:
    id: platform
    selector:
      kind: registry
      id: platform
  initiative:
    id: billing-launch
```

Bağlantılı yollar tam depolar, büyük bir monorepo içindeki klasörler veya diğer mevcut klasörler olabilir. Çalışma alanı planlamasına katılmadan önce repo-lokal `openspec/` durumuna ihtiyaç duymazlar. Sonraki uygulama, doğrulama veya arşiv akışları daha fazla repo hazırlığı gerektirebilir, ancak planlama görünürlüğü bağlantı ile başlar.

```text
multi-repo:
  api      -> /repos/api
  web      -> /repos/web

large monorepo:
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

Yönetilen çalışma alanları standart OpenSpec veri dizini altında yaşar:

```text
getGlobalDataDir()/workspaces
```

Bu, `XDG_DATA_HOME` ayarlandığında `$XDG_DATA_HOME/openspec/workspaces`, Unix stili geri dönüşte `~/.local/share/openspec/workspaces` ve yerel Windows geri dönüşünde `%LOCALAPPDATA%\openspec\workspaces` anlamına gelir. Yerel Windows kabukları, PowerShell ve WSL2, OpenSpec'i çalıştıran çalışma zamanı için yol dizelerini ayrı ayrı tutar. Bu temel, `D:\repo`, `/mnt/d/repo` ve UNC WSL yolları arasında çeviri yapmaz.

OpenSpec, hâlâ eski beta çalışma alanı köklerini uyumluluk girdileri olarak okuyabilir, ancak yönetilen çalışma alanları artık yukarıdaki kök `workspace.yaml` kaydını kullanır. Çalışma alanı klasörü, kendi özel yerel görünümü için yetkili olmaya devam eder.

Çalışma alanı görünürlüğü, değişiklik taahhüdü değildir. Hangi depoların veya klasörlerin ilgili olduğunu OpenSpec'in bilmesi gerektiğinde bir çalışma alanı kurun; bir özellik, düzeltme, proje veya başka bir iş parçasını planlamaya hazır olduğunuzda daha sonra bir değişiklik oluşturun.

Faydalı komutlar:

```bash
# Guided setup
openspec workspace setup

# Automation-friendly setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli

# See known workspaces from the local registry
openspec workspace list
openspec workspace ls

# Add or repair links for the selected workspace
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Check what this machine can resolve
openspec workspace doctor
openspec workspace doctor --workspace platform

# Refresh workspace-local guidance and agent skills
openspec workspace update
openspec workspace update --workspace platform --tools codex,claude

# Open the linked working set
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor

# Open an initiative as a local workspace view
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative billing-launch --store-path /repos/platform-context
```

`workspace setup` her zaman çalışma alanını standart çalışma alanı konumunda oluşturur, yerel kayıt defterine kaydeder, çalışma alanının konumunu gösterir ve en az bir bağlı repo veya klasör gerektirir. Etkileşimli kurulum, tercih edilen bir açıcı ister ve seçilen ajanlar için OpenSpec becerilerini yükleyebilir. Etkileşim dışı kurulum, yalnızca `--opener codex-cli`, `--opener claude`, `--opener github-copilot` veya `--opener editor` sağlandığında bir tane saklar.

Çalışma alanı becerileri yalnızca çalışma alanı köküne yüklenir. Aktif global profil, hangi iş akışı becerilerinin oluşturulacağını seçer; `--tools` bunları hangi ajanların alacağını seçer. Çalışma alanı kurulumu ve güncelleme, global teslim komutları içerdiğinde bile eğik çizgi komut dosyaları oluşturmaz. Bağlı depoları veya klasörleri düzenlemek yerine, çalışma alanı-lokal yönlendirmeyi yenilemek, yönetilen çalışma alanı-lokal beceri dizinlerini eklemek, yenilemek veya kaldırmak için `openspec workspace update` komutunu çalıştırın.

OpenSpec ayrıca kök çalışma alanı açık dosyalarını da korur: `AGENTS.md` içindeki OpenSpec tarafından yönetilen bir yönlendirme bloğu ve VS Code ile GitHub Copilot-in-VS-Code açılışları için makine-lokal `<workspace-name>.code-workspace` dosyası. Yönetilen bir çalışma alanı bir repo değildir, bu nedenle OpenSpec varsayılan bir çalışma alanı `.gitignore` veya varsayılan bir çalışma alanı düzeyinde `changes/` dizini oluşturmaz.

Bakımı yapılan VS Code çalışma alanı, ilk olarak geçerli bağlı depoları veya klasörleri, ardından eklendiğinde inisiyatif bağlamını ve son olarak OpenSpec çalışma alanı dosyalarını listeler. VS Code bu girdileri çoklu kök çalışma alanı olarak görüntüler.

`workspace open`, saklanan tercih edilen açıcı ile bağlı iş kümesini açar; bu oturum için `--agent <tool>` veya `--editor` geçirilmediği sürece. Her iki açıcı geçişini birden yapmak bir hatadır. Kök çalışma alanı açma, keşif ve bağlam için bağlı depoları ve klasörleri görünür kılar; uygulama, kullanıcı açıkça uygulama çalışması isteyene kadar başlamaz.

`workspace link` ve `workspace relink` yalnızca mevcut klasörleri kaydeder; bağlı repo veya klasörü oluşturmak, kopyalamak, taşımak, başlatmak veya düzenlemek yoktur. Başarılı bir bağlantı veya yeniden bağlantıdan sonra OpenSpec, yönlendirmeyi ve VS Code çalışma alanı dosyasını yeniler.

Bir çalışma alanına ihtiyaç duyan çalışma alanı komutları, `--workspace <name>` ile herhangi bir yerden çalıştırılabilir. Bu komutları bir çalışma alanı klasörü veya alt dizini içinde çalıştırırsanız, OpenSpec o mevcut çalışma alanını kullanır. Bilinen birden fazla çalışma alanı mevcutsa ve `--workspace <name>` geçirmediyseniz, insan komutları bir seçici gösterir; `--json` ve `--no-interactive` ise istem yerine yapılandırılmış bir durum hatasıyla başarısız olur.

Doğrudan çalışma alanı komutları, betikler için JSON çıktısını destekler. JSON yanıtları birincil verileri `workspace`, `workspaces` veya `link` nesnelerinde tutar ve uyarıları veya hataları `status` dizilerinde raporlar. Sağlıklı nesneler `status: []` kullanır.

## Spesifikasyonlar

Spesifikasyonlar, sisteminizin davranışını yapılandırılmış gereksinimler ve senaryolar kullanarak tanımlar.

### Yapı

```
openspec/specs/
├── auth/
│   └── spec.md           # Authentication behavior
├── payments/
│   └── spec.md           # Payment processing
├── notifications/
│   └── spec.md           # Notification system
└── ui/
    └── spec.md           # UI behavior and themes
```

Spesifikasyonları alana göre organize edin — sisteminiz için anlamlı mantıksal gruplar. Yaygın desenler:

- **Özellik alanına göre**: `auth/`, `payments/`, `search/`
- **Bileşene göre**: `api/`, `frontend/`, `workers/`
- **Sınırlandırılmış bağlama göre**: `ordering/`, `fulfillment/`, `inventory/`

### Spesifikasyon Biçimi

Bir spesifikasyon gereksinimler içerir ve her gereksinimin senaryoları vardır:

```markdown
# Auth Specification

## Purpose
Authentication and session management for the application.

## Requirements

### Requirement: User Authentication
The system SHALL issue a JWT token upon successful login.

#### Scenario: Valid credentials
- GIVEN a user with valid credentials
- WHEN the user submits login form
- THEN a JWT token is returned
- AND the user is redirected to dashboard

#### Scenario: Invalid credentials
- GIVEN invalid credentials
- WHEN the user submits login form
- THEN an error message is displayed
- AND no token is issued

### Requirement: Session Expiration
The system MUST expire sessions after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated
- AND the user must re-authenticate
```

**Anahtar unsurlar:**

| Unsur | Amaç |
|---------|---------|
| `## Purpose` | Bu spesifikasyon alanının üst düzey açıklaması |
| `### Requirement:` | Sistemin sahip olması gereken belirli bir davranış |
| `#### Scenario:` | Gereksinimin uygulamadaki somut bir örneği |
| SHALL/MUST/SHOULD | Gereksinim gücünü gösteren RFC 2119 anahtar kelimeleri |

### Spesifikasyonlar Neden Bu Şekilde Yapılandırılıyor

**Gereksinimler "ne"dir** — sistemin ne yapması gerektiğini, uygulamayı belirtmeden ifade ederler.

**Senaryolar "ne zaman"dır** — doğrulanabilen somut örnekler sağlarlar. İyi senaryolar:
- Test edilebilir (bunlar için otomatik bir test yazabilirsiniz)
- Hem mutlu yolu hem de uç durumları kapsar
- Given/When/Then veya benzeri yapılandırılmış bir biçim kullanır

**RFC 2119 anahtar kelimeleri** (SHALL, MUST, SHOULD, MAY) niyeti iletir:
- **MUST/SHALL** — kesin gereksinim
- **SHOULD** — önerilen, ancak istisnalar var
- **MAY** — isteğe bağlı

### Bir Spesifikasyon Nedir (ve Nedir Değil)

Bir spesifikasyon bir **davranış sözleşmesidir**, bir uygulama planı değil.

İyi spesifikasyon içeriği:
- Kullanıcıların veya aşağı akış sistemlerin güvendiği gözlemlenebilir davranış
- Girdiler, çıktılar ve hata koşulları
- Dış kısıtlamalar (güvenlik, gizlilik, güvenilirlik, uyumluluk)
- Test edilebilen veya açıkça doğrulanabilen senaryolar

Spesifikasyonlardan kaçınılması gerekenler:
- Dahali sınıf/fonksiyon adları
- Kütüphane veya çerçeve seçimleri
- Adım adım uygulama ayrıntıları
- Ayrıntılı yürütme planları (bunlar `design.md` veya `tasks.md` içinde yer alır)

Hızlı test:
- Eğer uygulama, dışarıdan görünür davranış değişmeden değişebiliyorsa, muhtemelen spesifikasyonda yer almaz.

### Hafif Tutun: Aşamalı Titizlik

OpenSpec bürokrasiden kaçınmayı amaçlamak. Değişikliği doğrulanabilir kılan en hafif düzeyi kullanın.

**Hafif spesifikasyon (varsayılan):**
- Kısa davranış-odaklı gereksinimler
- Net kapsam ve hedef dışı alanlar
- Birkaç somut kabul kontrolü

**Tam spesifikasyon (daha yüksek risk için):**
- Takımlar arası veya repo'lar arası değişiklikler
- API/sözleşme değişiklikleri, geçişler, güvenlik/gizlilik endişeleri
- Belirsizliğin pahalı yeniden çalışmaya yol açma olasılığının yüksek olduğu değişiklikler

Çoğu değişiklik Hafif modda kalmalıdır.

### İnsan + Ajan İşbirliği

Birçok takımda, insanlar keşfeder ve ajanlar eserler taslağını oluşturur. Öngörülen döngü şudur:

1. İnsan niyeti, bağlamı ve kısıtlamaları sağlar.
2. Ajan bunu davranış-odaklı gereksinimlere ve senaryolara dönüştürür.
3. Ajan uygulama ayrıntılarını `spec.md` yerine `design.md` ve `tasks.md` içinde tutar.
4. Doğrulama, uygulamadan önce yapı ve netliği onaylar.

Bu, spesifikasyonları insanlar için okunabilir ve ajanlar-tutarlı tutar.

## Değişiklikler

Bir değişiklik, anlamak ve uygulamak için gereken her şeyi bir klasörde paketleyerek sisteminize önerilen bir değişikliktir.

### Değişiklik Yapısı

```
openspec/changes/add-dark-mode/
├── proposal.md           # Neden ve ne
├── design.md             # Nasıl (teknik yaklaşım)
├── tasks.md              # Uygulama kontrol listesi
├── .openspec.yaml        # Değişiklik meta verileri (isteğe bağlı)
└── specs/                # Delta spesifikasyonları
    └── ui/
        └── spec.md       # ui/spec.md'de ne değişiyor
```

Her değişiklik kendine yeterlidir. Şunları içerir:
- **Eserler** — amacı, tasarımı ve görevleri yakalayan belgeler
- **Delta spesifikasyonları** — eklenen, değiştirilen veya kaldırılan öğelerin spesifikasyonları
- **Meta veriler** — bu belirli değişiklik için isteğe bağlı yapılandırma

### Değişiklikler Neden Klasördür

Bir değişikliği klasör olarak paketlemenin birkaç avantajı vardır:

1. **Her şey bir arada.** Öneri, tasarım, görevler ve spesifikasyonlar tek bir yerde bulunur. Farklı konumlarda arama yapmanıza gerek kalmaz.

2. **Paralel çalışma.** Birden fazla değişiklik aynı anda çakışmadan var olabilir. `fix-auth-bug` devam ederken `add-dark-mode` üzerinde çalışabilirsiniz.

3. **Temiz geçmiş.** Arşivlendiğinde, değişiklikler tam bağlamı korunarak `changes/archive/` klasörüne taşınır. Geriye bakıp neyin değiştiğini değil, neden değiştiğini de anlayabilirsiniz.

4. **İnceleme dostu.** Bir değişiklik klasörünü incelemek kolaydır — açın, öneriyi okuyun, tasarımı kontrol edin, spesifikasyon farklarını görün.

## Eserler

Eserler, bir değişiklik içindeki çalışmayı yönlendiren belgelerdir.

### Eser Akışı

```
öneri ──────► spesifikasyonlar ──────► tasarım ──────► görevler ──────► uygulama
    │               │                    │                │
   neden           ne                  nasıl           adımlar
 + kapsam        değişiyor            yaklaşım        atılacak
```

Eserler birbirinin üzerine inşa edilir. Her eser bir sonrakine bağlam sağlar.

### Eser Türleri

#### Öneri (`proposal.md`)

Öneri, üst düzeyde **amacı**, **kapsamı** ve **yaklaşımı** yakalar.

```markdown
# Proposal: Add Dark Mode
```

## Amaç
Kullanıcılar, gece kullanımda göz yorgunluğunu azaltmak ve sistem tercihleriyle uyum sağlamak için bir karanlık mod seçeneği talep ettiler.

## Kapsam
Kapsam dahilinde:
- Ayarlarda tema değiştirici
- Sistem tercihlerinin algılanması
- Tercihin localStorage'da saklanması

Kapsam dışında:
- Özel renk temaları (gelecek çalışma)
- Sayfa bazlı tema geçersiz kılmaları

## Yaklaşım
Durum yönetimi için bir React context ile temalandırmada CSS özel özellikleri kullanın. İlk yüklemede sistem tercihini algılayın, manuel geçersiz kılmalara izin verin.
```

**Teklif ne zaman güncellenmeli:**
- Kapsam değişiklikleri (daraltma veya genişletme)
- Amaç netleşir (problemin daha iyi anlaşılması)
- Yaklaşım temelden değişir

#### Özellikler (`specs/` içindeki delta özellikler)

Delta özellikleri, mevcut özelliklere göre **neyin değiştiğini** tanımlar. Aşağıdaki [Delta Özellikleri](#delta-özellikleri) bölümüne bakın.

#### Tasarım (`design.md`)

Tasarım, **teknik yaklaşımı** ve **mimari kararları** yakalar.

````markdown
# Tasarım: Karanlık Mod Ekleme

## Teknik Yaklaşım
Prop drilling'i önlemek için React Context ile tema durumu yönetilir.
CSS özel özellikleri, sınıf geçişi olmadan çalışma zamanı geçişine olanak tanır.

## Mimari Kararlar

### Karar: Redux yerine Context
Tema durumu için React Context kullanılıyor çünkü:
- Basit ikili durum (aydınlık/karanlık)
- Karmaşık durum geçişleri yok
- Redux bağımlılığı eklemekten kaçınılıyor

### Karar: CSS Özel Özellikleri
CSS-in-JS yerine CSS değişkenleri kullanılıyor çünkü:
- Mevcut stil dosyasıyla çalışır
- Çalışma zamanı ek yükü yok
- Tarayıcıya özgü çözüm

## Veri Akışı
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Değişkenleri (:root'a uygulanır)
```

## Dosya Değişiklikleri
- `src/contexts/ThemeContext.tsx` (yeni)
- `src/components/ThemeToggle.tsx` (yeni)
- `src/styles/globals.css` (değiştirildi)
````

**Tasarım ne zaman güncellenmeli:**
- Uygulama, yaklaşımın çalışmayacağını ortaya koyarsa
- Daha iyi bir çözüm keşfedilirse
- Bağımlılıklar veya kısıtlamalar değişirse

#### Görevler (`tasks.md`)

Görevler, **uygulama kontrol listesidir** — onay kutuları olan somut adımlar.

```markdown
# Görevler

## 1. Tema Altyapısı
- [ ] 1.1 Aydınlık/karanlık durumlu ThemeContext oluştur
- [ ] 1.2 Renkler için CSS özel özellikleri ekle
- [ ] 1.3 localStorage kalıcılığını uygula
- [ ] 1.4 Sistem tercihi algılama ekle

## 2. UI Bileşenleri
- [ ] 2.1 ThemeToggle bileşeni oluştur
- [ ] 2.2 Ayarlar sayfasına geçici ekleyici ekle
- [ ] 2.3 Hızlı geçiş eklemek için Başlığı güncelle

## 3. Stil
- [ ] 3.1 Karanlık tema renk paleti tanımla
- [ ] 3.2 Bileşenleri CSS değişkenleri kullanacak şekilde güncelle
- [ ] 3.3 Erişilebilirlik için kontrast oranlarını test et
```

**Görev en iyi uygulamaları:**
- İlgili görevleri başlıklar altında gruplayın
- Hiyerarşik numaralandırma kullanın (1.1, 1.2, vb.)
- Görevleri bir oturumda tamamlayabilecek kadar küçük tutun
- Görevleri tamamladıkça işaretleyin

## Delta Özellikleri

Delta özellikleri, OpenSpec'in eski kod tabanlı geliştirme için çalışmasını sağlayan temel kavramdır. Tüm özelliği yeniden ifade etmek yerine **neyin değiştiğini** tanımlarlar.

### Format

```markdown
# Auth için Delta

## EKLENEN Gereksinimler

### Gereksinim: İki Faktörlü Kimlik Doğrulama
Sistem TOTP tabanlı iki faktörlü kimlik doğrulamayı DESTEKLEMELİDİR.

#### Senaryo: 2FA kayıt
- 2FA etkinleştirilmemiş bir kullanıcı verildiğinde
- Kullanıcı ayarlarda 2FA'yı etkinleştirdiğinde
- Authenticator uygulaması kurulumu için bir QR kodu görüntülenir
- VE kullanıcı etkinleştirmeden önce bir kodla doğrulama yapmalıdır

#### Senaryo: 2FA oturum açma
- 2FA etkinleştirilmiş bir kullanıcı verildiğinde
- Kullanıcı geçerli kimlik bilgilerini gönderdiğinde
- Bir OTP sorusu sunulur
- VE oturum açma yalnızca geçerli OTP'den sonra tamamlanır

## DEĞİŞTİRİLEN Gereksinimler

### Gereksinim: Oturum Sonlanması
Sistem oturumları 15 dakika hareketsizlikten sonra sona erdirmelidir.
(Önceden: 30 dakika)

#### Senaryo: Boşta kalma zaman aşımı
- Doğrulanmış bir oturum verildiğinde
- 15 dakika etkinlik olmadan geçtiğinde
- Oturum geçersiz kılınır

## KALDIRILAN Gereksinimler

### Gereksinim: Beni Hatırla
(2FA lehine kullanımdan kaldırıldı. Kullanıcılar her oturumda yeniden kimlik doğrulamalıdır.)
```

### Delta Bölümleri

| Bölüm | Anlamı | Arşivde Ne Olur |
|---------|---------|------------------------|
| `## EKLENEN Gereksinimler` | Yeni davranış | Ana özelliğe eklenir |
| `## DEĞİŞTİRİLEN Gereksinimler` | Değişen davranış | Mevcut gereksinimin yerini alır |
| `## KALDIRILAN Gereksinimler` | Kullanımdan kaldırılan davranış | Ana özellikten silinir |

### Neden Tam Özellikler Yerine Deltalar

**Netlik.** Bir delta, tam olarak neyin değiştiğini gösterir. Tam bir özelliği okurken, mevcut sürümle zihninizde karşılaştırma yapmanız gerekirdi.

**Çatışma önleme.** İki değişiklik, farklı gereksinimleri değiştirdikleri sürece, aynı özellik dosyasına dokunabilir ve çakışmayabilir.

**İnceleme verimliliği.** İnceleyenler değişikliği görür, değişmeyen bağlamı değil. Önemli olana odaklanın.

**Eski kod tabanına uygunluk.** Çoğu çalışma mevcut davranışı değiştirir. Deltalar, değişiklikleri bir art düşünce değil, birinci sınıf hale getirir.

## Şemalar

Şemalar, bir iş akışı için eser türlerini ve bunların bağımlılıklarını tanımlar.

### Şemalar Nasıl Çalışır

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Bağımlılık yok, önce oluşturulabilir

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Oluşturmadan önce teklif gerekli

  - id: design
    generates: design.md
    requires: [proposal]      # Özelliklerle paralel oluşturulabilir

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Önce hem özellikler hem de tasarım gerekli
```

**Eserler bir bağımlılık grafiği oluşturur:**

```
                    proposal
                   (kök düğüm)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (gerekli:                  (gerekli:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (gerekli:
                specs, design)
```

**Bağımlılıklar etkinleştiricilerdir, kapılar değil.** Oluşturulabilecek olanı gösterirler, sırada ne oluşturmanız gerektiğini değil. Tasarıma ihtiyacınız yoksa atlayabilirsiniz. Özellikleri tasarımdan önce veya sonra oluşturabilirsiniz — her ikisi de yalnızca teklife bağlıdır.

### Yerleşik Şemalar

**spec-driven** (varsayılan)

Özellik odaklı geliştirme için standart iş akışı:

```
teklif → özellikler → tasarım → görevler → uygula
```

En uygun: Uygulamadan önce özellikler üzerinde anlaşmak istediğiniz çoğu özellik çalışması.

### Özel Şemalar

Ekibinizin iş akışı için özel şemalar oluşturun:

```bash
# Sıfırdan oluştur
openspec schema init research-first

# Veya mevcut birini çatalla
openspec schema fork spec-driven research-first
```

**Özel şema örneği:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Önce araştırma yapın

  - id: proposal
    generates: proposal.md
    requires: [research]   # Araştırmayla bilgilendirilen teklif

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Özellikleri/tasarımı atlayın, doğrudan görevlere geçin
```

Özel şemalar oluşturma ve kullanma hakkında tüm ayrıntılar için bkz. [Özelleştirme](customization.md).

## Arşiv

Arşivleme, bir değişikliğin delta özelliklerini ana özelliklerle birleştirerek ve değişikliği geçmiş için koruyarak tamamlar.

### Arşivlediğinizde Ne Olur

```
Arşivlemeden önce:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ birleştir
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Arşivlemeden sonra:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Şimdi 2FA gereksinimlerini içeriyor
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Geçmiş için korundu
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Arşivleme Süreci

1. **Deltaları birleştir.** Her delta özelliği bölümü (EKLENEN/DEĞİŞTİRİLEN/KALDIRILAN) ilgili ana özelliğe uygulanır.

2. **Arşive taşı.** Değişiklik klasörü, kronolojik sıralama için tarih ön ekiyle `changes/archive/` taşınır.

3. **Bağlamı koru.** Tüm eserler arşivde sağlam kalır. Bir değişikliğin neden yapıldığını anlamak için her zaman geriye bakabilirsiniz.

### Arşiv Neden Önemli

**Temiz durum.** Aktif değişiklikler (`changes/`) yalnızca devam eden çalışmaları gösterir. Tamamlanan çalışma yolun dışına çıkar.

**Denetim izi.** Arşiv, her değişikliğin tam bağlamını korur — sadece neyin değiştiği değil, nedenini açıklayan teklif, nasılını açıklayan tasarım ve yapılan işi gösteren görevler.

**Özellik evrimi.** Özellikler arşivlendikçe organik olarak büyür. Her arşiv, deltalarını birleştirir ve zaman içinde kapsamlı bir belirtim oluşturur.

## Hepsi Nasıl Bir Araya Gelir

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC AKIŞI                                  │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. BAŞLAT     │  /opsx:propose (çekirdek) veya /opsx:new (genişletilmiş)│
│   │   DEĞİŞİKLİK  │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. OLUŞTUR    │  /opsx:ff veya /opsx:continue (genişletilmiş iş akışı)  │
│   │    ESERLER     │  Teklif → özellikler → tasarım → görevler oluşturur      │
│   │                │  (şema bağımlılıklarına dayalı)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. UYGULA     │  /opsx:apply                                            │
│   │   GÖREVLER     │  Görevler üzerinde çalışın, işaretleyin                 │
│   │                │◄──── Öğrendikçe eserleri güncelleyin                    │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. DOĞRULA    │  /opsx:verify (isteğe bağlı)                            │
│   │   ÇALIŞMA      │  Uygulamanın özelliklerle eşleştiğini kontrol edin     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARŞİVLE    │────►│  Delta özellikler ana özelliklerle birleşir  │    │
│   │   DEĞİŞİKLİK  │     │  Değişiklik klasörü arşive taşınır           │    │
│   └────────────────┘     │  Özellikler artık güncellenmiş gerçeğin kaynağı│    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Faydalı döngü:**

1. Özellikler mevcut davranışı tanımlar
2. Değişiklikler (deltalar olarak) değişiklik önerir
3. Uygulama değişiklikleri gerçek yapar
4. Arşiv deltaları özelliklerle birleştirir
5. Özellikler artık yeni davranışı tanımlar
6. Sonraki değişiklik güncellenmiş özellikler üzerine kurulur

## Sözlük

| Terim | Tanım |
|------|------------|
| **Artifact** | Bir değişiklik içindeki belge (öneri, tasarım, görevler veya delta spesifikasyonları) |
| **Archive** | Bir değişikliği tamamlama ve deltalarını ana spesifikasyonlara birleştirme süreci |
| **Change** | Sisteme önerilen bir değişiklik, artifact'larla birlikte bir klasör olarak paketlenir |
| **Delta spec** | Mevcut spesifikasyonlara göre değişiklikleri (EKLENMİŞ/DEĞİŞTİRİLMİŞ/KALDIRILMIŞ) tanımlayan bir spesifikasyon |
| **Domain** | Spesifikasyonlar için mantıksal gruplama (örneğin, `auth/`, `payments/`) |
| **Requirement** | Sistemin sahip olması gereken belirli bir davranış |
| **Scenario** | Bir gereksinimin somut bir örneği, genellikle Given/When/Then biçiminde |
| **Schema** | Artifact türlerinin ve bunların bağımlılıklarının tanımı |
| **Spec** | Gereksinimleri ve senaryoları içeren, sistem davranışını tanımlayan bir spesifikasyon |
| **Source of truth** | Üzerinde anlaşmaya varılmış mevcut davranışı içeren `openspec/specs/` dizini |

## Sonraki Adımlar

- [Başlarken](getting-started.md) - Uygulamaya yönelik ilk adımlar
- [İş Akışları](workflows.md) - Yaygın kalıplar ve her birinin ne zaman kullanılacağı
- [Komutlar](commands.md) - Tam komut referansı
- [Özelleştirme](customization.md) - Özel şemalar oluşturun ve projenizi yapılandırın