# Kavramlar

Bu kılavuz, OpenSpec'in temel fikirlerini ve bunların nasıl bir araya geldiğini açıklar. Pratik kullanım için bkz. [Başlarken](getting-started.md) ve [İş Akışları](workflows.md).

## Felsefe

OpenSpec dört ilke üzerine kurulmuştur:

```
akıcı, katı değil         — aşama kapıları yok, mantıklı olan üzerinde çalışın
yinelemeli, şelale değil  — inşa ederken öğrenin, ilerledikçe iyileştirin
kolay, karmaşık değil     — hafif kurulum, minimum formalite
mevcut kod tabanlı öncelikli — sadece sıfırdan değil, mevcut kod tabanlarıyla çalışır
```

### Bu İlkeler Neden Önemlidir

**Akıcı, katı değil.** Geleneksel spesifikasyon sistemleri sizi aşamalara kilitler: önce planlarsınız, sonra uygularsınız, sonra biter. OpenSpec daha esnektir — işiniz için mantıklı olan herhangi bir sırayla eserler oluşturabilirsiniz.

**Yinelemeli, şelale değil.** Gereksinimler değişir. Anlayış derinleşir. Başlangıçta iyi bir yaklaşım gibi görünen şey, kod tabanını gördükten sonra geçerliliğini yitirebilir. OpenSpec bu gerçeği benimser.

**Kolay, karmaşık değil.** Bazı spesifikasyon çerçeveleri kapsamlı kurulum, katı formatlar veya ağır süreçler gerektirir. OpenSpec yolunuzdan çekilir. Saniyeler içinde başlatın, hemen çalışmaya başlayın, yalnızca gerekirse özelleştirin.

**Mevcut kod tabanlı öncelikli.** Çoğu yazılım çalışması sıfırdan inşa etmek değil — mevcut sistemleri değiştirmektir. OpenSpec'in delta tabanlı yaklaşımı, yalnızca yeni sistemleri tanımlamayı değil, mevcut davranışlara yönelik değişiklikleri belirtmeyi kolaylaştırır.

## Genel Bakış

OpenSpec çalışmanızı iki ana alana ayırır:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Gerçekliğin kaynağı│◄─────│  Önerilen değişiklikler       │   │
│   │  Sisteminizin       │ birleş│  Her değişiklik = bir klasör  │   │
│   │  mevcut çalışma     │      │  Yapıt ve deltaları içerir    │   │
│   │  şekli              │      │                               │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** gerçekliğin kaynağıdır — sisteminizin şu anda nasıl davrandığını tanımlarlar.

**Changes** önerilen değişikliklerdir — birleştirmeye hazır olana kadar ayrı klasörlerde yaşarlar.

Bu ayrım anahtardır. Çakışma olmadan paralel olarak birden fazla değişiklik üzerinde çalışabilirsiniz. Bir değişiklik ana specs'leri etkilemeden önce inceleyebilirsiniz. Ve bir değişikliği arşivlediğinizde, deltaları gerçekliğin kaynağına temiz bir şekilde birleşir.

## Koordinasyon Çalışma Alanları

Çalışma alanı desteği aktif olarak geliştirilmektedir ve henüz kullanıma hazır değildir. Çalışma alanı davranışının üzerine harici otomasyon, entegrasyonlar veya uzun ömürlü iş akışları oluşturmayın; komutlar, durum dosyaları ve JSON çıktısı herhangi bir zamanda değişebilir.

Aşağıdaki komutlar, bağlantılı depolar veya klasörler arasında planlama için ilk kurulum akışını sağlar.

Depo yerel OpenSpec projeleri, bir depo planlama, uygulama ve arşivleme akışına sahip olduğunda doğru varsayılan değerdir. Bazı çalışmalar birkaç depo veya klasörü kapsar. Bu durumda, bir OpenSpec koordinasyon çalışma alanı kalıcı planlama evidir.

Çalışma alanı zihinsel modeli şudur:

```text
workspace = ilgili çapraz-depo değişikliklerinin yaşadığı yer
link      = çalışma alanının planlama yapabileceği bir depo veya klasör için sabit bir isim
change    = bir özellik, düzeltme, proje veya diğer planlanmış iş parçası
```

Bir çalışma alanı, depo yerel bir projeden farklı bir şekle sahiptir:

```text
workspace-folder/
├── changes/                       # Çalışma alanı düzeyinde planlama
└── .openspec-workspace/
    ├── workspace.yaml             # Paylaşılan çalışma alanı kimliği ve bağlantı isimleri
    └── local.yaml                 # Bu makinenin yerel yolları
```

Depo yerel OpenSpec durumu mevcut şekli korur:

```text
repo-root/
└── openspec/
    ├── specs/
    └── changes/
```

Bu ayrım önemlidir. Çalışma alanı klasörü, bağlantılı depolar veya klasörler arasında planlama için bir koordinasyon yüzeyidir. Her deponun `openspec/` dizini, depoya ait specs'ler, depo yerel değişiklikler ve uygulama planlaması için ev sahibi olmaya devam eder. Kullanıcıların bir çalışma alanı klasörü içinde depo yerel `openspec init` çalıştırmasına gerek yoktur.

Sabit bağlantı isimleri, çalışma alanı planlamasının depolara ve klasörlere atıfta bulunma yoludur. Paylaşılan çalışma alanı durumu `api`, `web` veya `checkout` gibi isimleri korur; her makine bu isimleri `.openspec-workspace/local.yaml` içindeki kendi yerel yollarıyla eşler.

```yaml
# .openspec-workspace/workspace.yaml
version: 1
name: platform
links:
  api: {}
  web: {}
```

```yaml
# .openspec-workspace/local.yaml
version: 1
paths:
  api: /repos/api
  web: /repos/web
```

OpenSpec tarafından oluşturulan çalışma alanları, varsayılan olarak taşınabilir işbirliği durumundan `.openspec-workspace/local.yaml` hariç tutar. `.openspec-workspace/workspace.yaml`, çalışma alanının adını ve sabit bağlantı isimlerini sakladığı, bir kullanıcının mutel çekme yollarını değil, için taşınabilir kalır.

Bağlantılı yollar tam depolar, büyük bir monorepo içindeki klasörler veya diğer mevcut klasörler olabilir. Çalışma alanı planlamasına katılmadan önce depo yerel `openspec/` durumuna ihtiyaç duymazlar. Daha sonraki uygulama, doğrulama veya arşivleme iş akışları daha fazla depo hazırlığı gerektirebilir, ancak planlama görünürlüğü bağlantı ile başlar.

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

Bu, `XDG_DATA_HOME` ayarlandığında `$XDG_DATA_HOME/openspec/workspaces`, Unix tarzı geri dönüşte `~/.local/share/openspec/workspaces` ve yerel Windows geri dönüşünde `%LOCALAPPDATA%\openspec\workspaces` anlamına gelir. Yerel Windows kabukları, PowerShell ve WSL2'nin her biri, OpenSpec'i çalıştıran çalışma zamanı için yol dizelerini korur. Bu temel, `D:\repo`, `/mnt/d/repo` ve UNC WSL yolları arasında çeviri yapmaz.

OpenSpec ayrıca makine yerel bir kayıt defteri de tutar:

```text
getGlobalDataDir()/workspaces/registry.yaml
```

Kayıt defteri, çalışma alanı isimlerini çalışma alanı konumlarıyla eşler, böylece daha sonraki global komutlar herhangi bir yerden bilinen çalışma alanlarını listeleyebilir veya seçebilir. Bu sadece bir dizindir. Her çalışma alanı klasörü, kendi `.openspec-workspace/workspace.yaml` ve `.openspec-workspace/local.yaml` dosyaları için yetkili olmaya devam eder, böylece eski kayıt kayıtları, çalışma alanının kendisini yeniden tanımlamadan rapor edilebilir ve onarılabilir.

Çalışma alanı görünürlüğü, değişiklik taahhüdü değildir. OpenSpec hangi depoların veya klasörlerin ilgili olduğunu bilmesi gerektiğinde bir çalışma alanı kurun; bir özellik, düzeltme, proje veya diğer iş parçasını planlamaya hazır olduğunuzda daha sonra bir değişiklik oluşturun.

Faydalı komutlar:

```bash
# Rehberli kurulum
openspec workspace setup

# Otomasyon dostu kurulum
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex

# Yerel kayıt defterinden bilinen çalışma alanlarını görün
openspec workspace list
openspec workspace ls

# Seçili çalışma alanı için bağlantı ekleyin veya onarın
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Bu makinenin neleri çözebileceğini kontrol edin
openspec workspace doctor
openspec workspace doctor --workspace platform

# Bağlantılı çalışma kümesini açın
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor
```

`workspace setup` her zaman çalışma alanını standart çalışma alanı konumunda oluşturur, yerel kayıt defterine kaydeder, çalışma alanı konumunu gösterir ve en az bir bağlantılı depo veya klasör gerektirir. Etkileşimli kurulum tercih edilen bir açıcı sorar. Etkileşimli olmayan kurulum, yalnızca `--opener codex`, `--opener claude`, `--opener github-copilot` veya `--opener editor` sağlandığında bir tane saklar.

OpenSpec ayrıca kök çalışma alanı açık dosyalarını da korur: `AGENTS.md` içinde OpenSpec tarafından yönetilen bir rehber bloğu, VS Code ve GitHub Copilot-in-VS-Code açılışları için makine yerel `<workspace-name>.code-workspace` dosyası ve bu korunan `.code-workspace` dosyası için özel bir yok sayma girdisi. Kullanıcı tarafından oluşturulan `*.code-workspace` dosyaları, yok sayma kuralı yalnızca korunan dosyayı hedeflediği için izlenebilir kalır.

Korunan VS Code çalışma alanı, koordinasyon kökünü `.` ve geçerli bağlantılı depoları veya klasörleri ek kökler olarak içerir. VS Code bu girdileri çoklu kök çalışma alanı olarak görüntüler.

`workspace open`, saklanan tercih edilen açıcı ile bağlantılı çalışma kümesini açar, ancak bu bir oturum için `--agent <tool>` veya `--editor` geçirilmediği sürece. Her iki açıcı geçersiz kılmasını geçirmek bir hatadır. Kök çalışma alanı açma, bağlantılı depoları ve klasörleri keşif ve planlama için görünür kılar; uygulama, kullanıcı açıkça uygulama çalışması istedikten sonra başlar.

`workspace link` ve `workspace relink` yalnızca mevcut klasörleri kaydeder; bağlantılı depoyu veya klasörü oluşturmaz, kopyalamaz, taşımayı başlatmaz veya düzenlemez. Başarılı bir bağlantı veya yeniden bağlantıdan sonra OpenSpec, yönetilen rehberi, VS Code çalışma alanı dosyasını ve yok sayma kuralını yeniler.

Bir çalışma alanı gerektiren çalışma alanı komutları, `--workspace <name>` ile herhangi bir yerden çalıştırılabilir. Bir çalışma alanı klasörü veya alt dizini içinde çalıştırırsanız, OpenSpec o mevcut çalışma alanını kullanır. Birden fazla bilinen çalışma alanı mevcutsa ve `--workspace <name>` geçirmezseniz, insan komutları bir seçici gösterir; `--json` ve `--no-interactive` ise istem yerine yapılandırılmış bir durum hatasıyla başarısız olur.

Doğrudan çalışma alanı komutları, betikler için JSON çıktısını destekler. JSON yanıtları, birincil verileri `workspace`, `workspaces` veya `link` nesnelerinde tutar ve uyarıları veya hataları `status` dizilerinde raporlar. Sağlıklı nesneler `status: []` kullanır.

## Specs

Specs, yapılandırılmış gereksinimler ve senaryolar kullanarak sisteminizin davranışını tanımlar.

### Yapı

```
openspec/specs/
├── auth/
│   └── spec.md           # Kimlik doğrulama davranışı
├── payments/
│   └── spec.md           # Ödeme işleme
├── notifications/
│   └── spec.md           # Bildirim sistemi
└── ui/
    └── spec.md           # UI davranışı ve temalar
```

Specs'leri etki alanına göre düzenleyin — sisteminiz için anlamlı mantıksal gruplamalar. Yaygın desenler:

- **Özellik alanına göre**: `auth/`, `payments/`, `search/`
- **Bileşene göre**: `api/`, `frontend/`, `workers/`
- **Sınırlı bağlama göre**: `ordering/`, `fulfillment/`, `inventory/`

### Spec Biçimi

Bir spec gereksinimler içerir ve her gereksinimin senaryoları vardır:

```markdown
# Auth Specification
```

## Amaç
Uygulama için kimlik doğrulama ve oturum yönetimi.

## Gereksinimler

### Gereksinim: Kullanıcı Kimlik Doğrulama
Sistem, başarılı giriş üzerine bir JWT token'ı vermelidir.

#### Senaryo: Geçerli kimlik bilgileri
- GEÇERLİ kimlik bilgilerine sahip bir kullanıcı VERİLDİĞİNDE
- Kullanıcı giriş formunu GÖNDERDİĞİNDE
- O ZAMAN bir JWT token'ı döndürülür
- VE kullanıcı kontrol paneline yönlendirilir

#### Senaryo: Geçersiz kimlik bilgileri
- GEÇERSİZ kimlik bilgileri VERİLDİĞİNDE
- Kullanıcı giriş formunu GÖNDERDİĞİNDE
- O ZAMAN bir hata mesajı görüntülenir
- VE herhangi bir token verilmez

### Gereksinim: Oturum Süresinin Dolması
Sistem, 30 dakikalık hareketsizlikten sonra oturumları sona ERDİRMELİDİR.

#### Senaryo: Boşta kalma zaman aşımı
- Doğrulanmış bir oturum VERİLDİĞİNDE
- Hareket olmadan 30 dakika GEÇTİĞİNDE
- O ZAMAN oturum geçersiz kılınır
- VE kullanıcının yeniden kimlik doğrulaması yapması gerekir
```

**Anahtar unsurlar:**

| Unsur | Amaç |
|---------|---------|
| `## Purpose` | Bu spesifikasyonun alanının üst düzey açıklaması |
| `### Requirement:` | Sistemin sahip olması gereken belirli bir davranış |
| `#### Scenario:` | Gereksinimin eylem halinde somut bir örneği |
| SHALL/MUST/SHOULD | Gereksinim gücünü gösteren RFC 2119 anahtar kelimeleri |

### Spesifikasyonlar Neden Bu Şekilde Yapılandırılır

**Gereksinimler "ne"dir** — uygulamayı belirtmeden sistemin ne yapması gerektiğini ifade ederler.

**Senaryolar "zaman"dır** — doğrulanabilen somut örnekler sağlarlar. İyi senaryolar:
- Test edilebilir (otomatik bir test yazabilirsiniz)
- Mutlu yolu ve sınır durumlarını kapsar
- Verilen/Zaman/O Zaman veya benzeri yapılandırılmış biçimi kullanır

**RFC 2119 anahtar kelimeleri** (SHALL, MUST, SHOULD, MAY) niyeti iletir:
- **MUST/SHALL** — kesin gereksinim
- **SHOULD** — önerilen, ancak istisnalar vardır
- **MAY** — isteğe bağlı

### Spesifikasyon Nedir (ve Ne Değildir)

Bir spesifikasyon bir **davranış sözleşmesidir**, bir uygulama planı değil.

İyi spesifikasyon içeriği:
- Kullanıcıların veya alt sistemlerin güvendiği gözlemlenebilir davranış
- Girdiler, çıktılar ve hata koşulları
- Dış kısıtlamalar (güvenlik, gizlilik, güvenilirlik, uyumluluk)
- Test edilebilen veya açıkça doğrulanabilen senaryolar

Spesifikasyonlardan kaçınılması gerekenler:
- Dahili sınıf/fonksiyon adları
- Kütüphane veya çerçeve seçimleri
- Adım adım uygulama ayrıntıları
- Ayrıntılı yürütme planları (bunlar `design.md` veya `tasks.md` dosyalarına aittir)

Hızlı test:
- Eğer uygulama, dışarıdan görülebilir davranışı değiştirmeden değişebiliyorsa, muhtemelen spesifikasyona ait değildir.

### Hafif Tutun: Aşamalı Titizlik

OpenSpec bürokrasiden kaçınmayı amaçlar. Değişikliği doğrulanabilir kılan en hafif düzeyi kullanın.

**Hafif spesifikasyon (varsayılan):**
- Kısa, davranış odaklı gereksinimler
- Açık kapsam ve olmayan hedefler
- Birkaç somut kabul kontrolü

**Tam spesifikasyon (daha yüksek risk için):**
- Ekipler arası veya depo değişiklikleri
- API/sözleşme değişiklikleri, geçişler, güvenlik/gizlilik endişeleri
- Belirsizliğin pahalı yeniden çalışmaya yol açma olasılığının yüksek olduğu değişiklikler

Çoğu değişiklik Hafif modda kalmalıdır.

### İnsan + Ajan İşbirliği

Birçok ekipte, insanlar keşfeder ve ajanlar taslaklar üretir. Hedeflenen döngü şudur:

1. İnsan niyet, bağlam ve kısıtlamaları sağlar.
2. Ajan bunu davranış odaklı gereksinimlere ve senaryolara dönüştürür.
3. Ajan uygulama ayrıntısını `design.md` ve `tasks.md` dosyalarında tutar, `spec.md` dosyasında değil.
4. Doğrulama, uygulamadan önce yapıyı ve netliği onaylar.

Bu, spesifikasyonları insanlar için okunabilir ve ajan-tutarlı tutar.

## Değişiklikler

Bir değişiklik, sisteminize önerilen bir değişikliktir; anlamak ve uygulamak için gereken her şeyi bir klasör olarak paketler.

### Değişiklik Yapısı

```
openspec/changes/add-dark-mode/
├── proposal.md           # Neden ve ne
├── design.md             # Nasıl (teknik yaklaşım)
├── tasks.md              # Uygulama kontrol listesi
├── .openspec.yaml        # Değişiklik meta verileri (isteğe bağlı)
└── specs/                # Delta spesifikasyonları
    └── ui/
        └── spec.md       # ui/spec.md dosyasında ne değişiyor
```

Her değişiklik kendi içinde bütündür. Şunları içerir:
- **Artefaktlar** — amacı, tasarımı ve görevleri yakalayan belgeler
- **Delta spesifikasyonları** — eklenen, değiştirilen veya kaldırılan şeyler için spesifikasyonlar
- **Meta veriler** — bu belirli değişiklik için isteğe bağlı yapılandırma

### Değişiklikler Neden Klasörlerdir

Bir değişikliği klasör olarak paketlemenin birkaç faydası vardır:

1. **Her şey bir arada.** Teklif, tasarım, görevler ve spesifikasyonlar tek bir yerde yaşar. Farklı konumları aramak zorunda kalmazsınız.

2. **Paralel çalışma.** Birden fazla değişiklik aynı anda çakışmadan var olabilir. `add-dark-mode` üzerinde çalışırken `fix-auth-bug` da devam edebilir.

3. **Temiz geçmiş.** Arşivlendiğinde, değişiklikler tam bağlamı korunarak `changes/archive/` klasörüne taşınır. Sadece neyin değiştiğini değil, neden değiştiğini de geriye dönük anlayabilirsiniz.

4. **İncelemeye uygun.** Bir değişiklik klasörünü incelemek kolaydır — açın, teklifi okuyun, tasarımı kontrol edin, spesifikasyon deltalarını görün.

## Artefaktlar

Artefaktlar, bir değişiklik içindeki çalışmayı yönlendiren belgelerdir.

### Artefakt Akışı

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Artefaktlar birbirinin üzerine inşa edilir. Her artefakt, bir sonraki için bağlam sağlar.

### Artefakt Türleri

#### Teklif (`proposal.md`)

Teklif, üst düzeyde **amacı**, **kapsamı** ve **yaklaşımı** yakalar.

```markdown
# Teklif: Karanlık Mod Ekleme

## Amaç
Kullanıcılar, gece kullanımı sırasında göz yorgunluğunu azaltmak
ve sistem tercihleriyle eşleşmek için bir karanlık mod seçeneği talep etti.

## Kapsam
Kapsam dahilinde:
- Ayarlarda tema geçişi
- Sistem tercihi algılama
- Tercihi localStorage'da saklama

Kapsam dışında:
- Özel renk temaları (gelecek çalışma)
- Sayfa başına tema geçersiz kılma

## Yaklaşım
Durum yönetimi için bir React context ile temalandırma için
CSS özel özellikleri kullanın. İlk yüklemede sistem tercihini algılayın,
manuel geçersiz kılınmaya izin verin.
```

**Teklif ne zaman güncellenmeli:**
- Kapsam değiştiğinde (daraltma veya genişletme)
- Amaç netleştiğinde (problemi daha iyi anlama)
- Yaklaşım temelden değiştiğinde

#### Spesifikasyonlar (`specs/` klasöründeki delta spesifikasyonları)

Delta spesifikasyonları, mevcut spesifikasyonlara göre **neyin değiştiğini** tanımlar. Aşağıdaki [Delta Spesifikasyonları](#delta-spesifikasyonları) bölümüne bakın.

#### Tasarım (`design.md`)

Tasarım, **teknik yaklaşımı** ve **mimari kararları** yakalar.

````markdown
# Tasarım: Karanlık Mod Ekleme

## Teknik Yaklaşım
Tema durumu, prop drilling'i önlemek için React Context üzerinden yönetilir.
CSS özel özellikleri, sınıf geçişi olmadan çalışma zamanı geçişine olanak tanır.

## Mimari Kararlar

### Karar: Redux yerine Context
Tema durumu için React Context kullanılıyor çünkü:
- Basit ikili durum (açık/koyu)
- Karmaşık durum geçişleri yok
- Redux bağımlılığı eklemekten kaçınılıyor

### Karar: CSS Özel Özellikleri
CSS-in-JS yerine CSS değişkenleri kullanılıyor çünkü:
- Mevcut stil sayfasıyla çalışır
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
CSS Variables (applied to :root)
```

## Dosya Değişiklikleri
- `src/contexts/ThemeContext.tsx` (yeni)
- `src/components/ThemeToggle.tsx` (yeni)
- `src/styles/globals.css` (değiştirildi)
````

**Tasarım ne zaman güncellenmeli:**
- Uygulama yaklaşımın çalışmayacağını ortaya koyduğunda
- Daha iyi bir çözüm keşfedildiğinde
- Bağımlılıklar veya kısıtlamalar değiştiğinde

#### Görevler (`tasks.md`)

Görevler, **uygulama kontrol listesi**dir — onay kutuları olan somut adımlar.

```markdown
# Görevler

## 1. Tema Altyapısı
- [ ] 1.1 Açık/koyu durumlu ThemeContext oluşturun
- [ ] 1.2 Renkler için CSS özel özellikleri ekleyin
- [ ] 1.3 localStorage kalıcılığını uygulayın
- [ ] 1.4 Sistem tercihi algılama ekleyin

## 2. UI Bileşenleri
- [ ] 2.1 ThemeToggle bileşeni oluşturun
- [ ] 2.2 Ayarlar sayfasına geçiş ekleyin
- [ ] 2.3 Hızlı geçiş eklemek için Header'ı güncelleyin

## 3. Stil
- [ ] 3.1 Koyu tema renk paletini tanımlayın
- [ ] 3.2 Bileşenleri CSS değişkenlerini kullanacak şekilde güncelleyin
- [ ] 3.3 Erişilebilirlik için kontrast oranlarını test edin
```

**Görev en iyi uygulamaları:**
- İlgili görevleri başlıklar altında gruplayın
- Hiyerarşik numaralandırma kullanın (1.1, 1.2, vb.)
- Görevleri bir oturumda tamamlayabilecek kadar küçük tutun
- Görevleri tamamladıkça işaretleyin

## Delta Spesifikasyonları

Delta spesifikasyonları, OpenSpec'in mevcut sistem geliştirme (brownfield) için çalışmasını sağlayan temel kavramdır. Tüm spesifikasyonu tekrarlamak yerine **neyin değiştiğini** tanımlarlar.

### Format

```markdown
# Auth için Delta

## EKLENEN Gereksinimler

### Gereksinim: İki Faktörlü Kimlik Doğrulama
Sistem, TOTP tabanlı iki faktörlü kimlik doğrulamayı DESTEKLEMELİDİR.

#### Senaryo: 2FA kaydı
- 2FA etkinleştirilmemiş bir kullanıcı VERİLDİĞİNDE
- Kullanıcı ayarlarda 2FA'yı etkinleştirdiğinde
- O zaman kimlik doğrulayıcı uygulama kurulumu için bir QR kodu görüntülenir
- VE kullanıcı etkinleştirmeden önce bir kodla doğrulama yapmalıdır

#### Senaryo: 2FA girişi
- 2FA etkinleştirilmiş bir kullanıcı VERİLDİĞİNDE
- Kullanıcı geçerli kimlik bilgilerini gönderdiğinde
- O zaman bir OTP mücadelesi sunulur
- VE giriş yalnızca geçerli OTP'den sonra tamamlanır

## DEĞİŞTİRİLEN Gereksinimler

### Gereksinim: Oturum Süresinin Dolması
Sistem, 15 dakikalık hareketsizlikten sonra oturumları sona ERDİRMELİDİR.
(Önceden: 30 dakika)

#### Senaryo: Boşta kalma zaman aşımı
- Kimliği doğrulanmış bir oturum VERİLDİĞİNDE
- Hareket olmadan 15 dakika geçtiğinde
- O zaman oturum geçersiz kılınır

## KALDIRILAN Gereksinimler

### Gereksinim: Beni Hatırla
(2FA lehine kullanımdan kaldırıldı. Kullanıcılar her oturumda yeniden kimlik doğrulamalıdır.)
```

### Delta Bölümleri

| Bölüm | Anlamı | Arşivlemede Ne Olur |
|---------|---------|------------------------|
| `## EKLENEN Gereksinimler` | Yeni davranış | Ana spesifikasyona eklenir |
| `## DEĞİŞTİRİLEN Gereksinimler` | Değişen davranış | Mevcut gereksinimin yerini alır |
| `## KALDIRILAN Gereksinimler` | Kullanımdan kaldırılan davranış | Ana spesifikasyondan silinir |

### Neden Tam Spesifikasyonlar Yerine Deltalar

**Netlik.** Bir delta tam olarak neyin değiştiğini gösterir. Tam bir spesifikasyonu okurken, mevcut sürümle zihninizde karşılaştırma yapmanız gerekirdi.

**Çakışmadan kaçınma.** İki değişiklik, farklı gereksinimleri değiştirdikçe aynı spesifikasyon dosyasına dokunabilir ve çakışmaz.

**İnceleme verimliliği.** İnceleyenler değişikliği görür, değişmeyen bağlamı değil. Önemli olana odaklanın.

**Mevcut sistem geliştirme uyumu.** Çoğu çalışma mevcut davranışı değiştirir. Deltalar, değişiklikleri birinci sınıf vatandaş yapar, sonradan akla gelen bir şey değil.

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
    requires: [proposal]      # Oluşturulmadan önce proposal'a ihtiyaç duyar

  - id: design
    generates: design.md
    requires: [proposal]      # specs ile paralel olarak oluşturulabilir

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Önce hem specs hem de design'a ihtiyaç duyar
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
   (requires:                  (requires:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (requires:
                specs, design)
```

**Bağımlılıklar etkinleştiricilerdir, kapılar değil.** Ne oluşturmanın mümkün olduğunu gösterir, sırada ne oluşturmanız gerektiğini değil. Tasarıma ihtiyacınız yoksa atlayabilirsiniz. Specs'i tasarımdan önce veya sonra oluşturabilirsiniz — her ikisi de yalnızca proposal'a bağlıdır.

### Yerleşik Şemalar

**spec-driven** (varsayılan)

Spec-driven geliştirme için standart iş akışı:

```
proposal → specs → design → tasks → implement
```

En uygun olduğu yer: Uygulamadan önce spesifikasyonlar üzerinde anlaşmak istediğiniz çoğu özellik çalışması.

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
    requires: []           # Önce araştırma yap

  - id: proposal
    generates: proposal.md
    requires: [research]   # Araştırmayla bilgilendirilmiş teklif

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # specs/design'ı atla, doğrudan görevlere geç
```

Özel şemalar oluşturma ve kullanma hakkında tüm ayrıntılar için [Özelleştirme](customization.md) bölümüne bakın.

## Arşivleme

Arşivleme, bir değişikliği tamamlayarak delta spesifikasyonlarını ana spesifikasyonlarla birleştirir ve değişikliği geçmiş için korur.

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
│       └── spec.md        # Artık 2FA gereksinimlerini içeriyor
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

1. **Deltaları birleştir.** Her delta spesifikasyon bölümü (EKLENEN/DEĞİŞTİRİLEN/KALDIRILAN) ilgili ana spesifikasyona uygulanır.

2. **Arşive taşı.** Değişiklik klasörü kronolojik sıralama için tarih ön ekiyle `changes/archive/` altına taşınır.

3. **Bağlamı koru.** Tüm eserler arşivde sağlam kalır. Bir değişikliğin neden yapıldığını anlamak için her zaman geriye bakabilirsiniz.

### Neden Arşivleme Önemlidir

**Temiz durum.** Aktif değişiklikler (`changes/`) yalnızca devam eden çalışmaları gösterir. Tamamlanan çalışmalar yoldan çekilir.

**Denetim izi.** Arşiv, her değişikliğin tam bağlamını korur — sadece neyin değiştiği değil, nedenini açıklayan teklif, nasılını açıklayan tasarım ve yapılan işi gösteren görevler.

**Spesifikasyon evrimi.** Spesifikasyonlar, değişiklikler arşivlendikçe organik olarak büyür. Her arşiv, deltalarını birleştirerek zaman içinde kapsamlı bir spesifikasyon oluşturur.

## Hepsi Nasıl Bir Araya Gelir

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC AKIŞI                                  │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. BAŞLAT     │  /opsx:propose (çekirdek) veya /opsx:new (genişletilmiş)│
│   │     DEĞİŞİKLİK│                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. OLUŞTUR    │  /opsx:ff veya /opsx:continue (genişletilmiş iş akışı)  │
│   │     ESERLER    │  proposal → specs → design → tasks oluşturur            │
│   │                │  (şema bağımlılıklarına dayalı)                          │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. UYGULA     │  /opsx:apply                                            │
│   │     GÖREVLER   │  Görevler üzerinde çalışın, işaretleyin                 │
│   │                │◄──── Öğrendikçe eserleri güncelleyin                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. DOĞRULA    │  /opsx:verify (isteğe bağlı)                             │
│   │     ÇALIŞMA    │  Uygulamanın spesifikasyonlara uygunluğunu kontrol edin  │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARŞİVLE    │────►│  Delta spesifikasyonlar ana spesifikasyonlara │    │
│   │     DEĞİŞİKLİK│     │  birleşir.                                   │    │
│   └────────────────┘     │  Değişiklik klasörü arşive taşınır.          │    │
│                          │  Spesifikasyonlar artık güncellenmiş          │    │
│                          │  gerçeğin kaynağıdır.                         │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Döngüsel süreç:**

1. Spesifikasyonlar mevcut davranışı tanımlar
2. Değişiklikler değişiklikleri önerir (deltalar olarak)
3. Uygulama değişiklikleri gerçeğe dönüştürür
4. Arşivleme deltaları spesifikasyonlara birleştirir
5. Spesifikasyonlar artık yeni davranışı tanımlar
6. Sonraki değişiklik güncellenmiş spesifikasyonlar üzerine inşa edilir

## Sözlük

| Terim | Tanım |
|------|------------|
| **Artifact (Eser)** | Bir değişiklik içindeki bir belge (teklif, tasarım, görevler veya delta spesifikasyonları) |
| **Archive (Arşivleme)** | Bir değişikliği tamamlama ve deltalarını ana spesifikasyonlara birleştirme süreci |
| **Change (Değişiklik)** | Sisteme önerilen bir değişiklik, eserlerle birlikte bir klasör olarak paketlenmiş |
| **Delta spec (Delta spesifikasyon)** | Mevcut spesifikasyonlara göre değişiklikleri (EKLENEN/DEĞİŞTİRİLEN/KALDIRILAN) tanımlayan bir spesifikasyon |
| **Domain (Alan)** | Spesifikasyonlar için mantıksal bir gruplama (ör. `auth/`, `payments/`) |
| **Requirement (Gereksinim)** | Sistemin sahip olması gereken belirli bir davranış |
| **Scenario (Senaryo)** | Bir gereksinimin somut bir örneği, genellikle Verilen/Olduğunda/O zaman biçiminde |
| **Schema (Şema)** | Eser türlerinin ve bunların bağımlılıklarının tanımı |
| **Spec (Spesifikasyon)** | Sistem davranışını tanımlayan, gereksinimler ve senaryolar içeren bir spesifikasyon |
| **Source of truth (Gerçeğin kaynağı)** | Mevcut üzerinde anlaşılmış davranışı içeren `openspec/specs/` dizini |

## Sonraki Adımlar

- [Başlarken](getting-started.md) - Pratik ilk adımlar
- [İş Akışları](workflows.md) - Yaygın kalıplar ve her birinin ne zaman kullanılacağı
- [Komutlar](commands.md) - Tam komut referansı
- [Özelleştirme](customization.md) - Özel şemalar oluşturun ve projenizi yapılandırın