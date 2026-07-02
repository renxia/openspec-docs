# Kavramlar

Bu rehber, OpenSpec'in temel fikirlerini ve bunların nasıl bir araya girdiğini açıklamaktadır. Pratik kullanım için lütfen [Başlangıç Rehberi](getting-started.md) ve [İş Akışları](workflows.md)'ne bakın.

## Felsefe

OpenSpec dört ilke üzerine kurulmuştur:

```
fluid not rigid         — no phase gates, work on what makes sense
iterative not waterfall — learn as you build, refine as you go
easy not complex        — lightweight setup, minimal ceremony
brownfield-first        — works with existing codebases, not just greenfield
```

### Bu İlkeler Neden Önemli

**Fluid not rigid.** Geleneksel spesifikasyon sistemleri sizi aşamalara kilitler: önce planlarsınız, sonra uygularsınız ve bitti. OpenSpec daha esnektir — işiniz için mantıklı olan herhangi bir sırayla çıktı oluşturabilirsiniz.

**Iterative not waterfall.** Gereksinimler değişir. Anlayış derinleşir. Başlangıçta iyi bir yaklaşım gibi görünen şey, kod tabanını gördükten sonra geçerli olmayabilir. OpenSpec bu gerçeği benimser.

**Easy not complex.** Bazı spesifikasyon çerçeveleri kapsamlı kurulumlar, katı formatlar veya ağır süreçler gerektirir. OpenSpec yolunuza engel olmaz. Saniyeler içinde başlatın, hemen çalışmaya başlayın, yalnızca ihtiyacınız olursa özelleştirin.

**Brownfield-first.** Yazılım işlerinin çoğu sıfırdan inşa etmek değildir — mevcut sistemleri değiştirmektir. OpenSpec'in delta tabanlı yaklaşımı, sadece yeni sistemler tanımlamak yerine mevcut davranışlara değişiklik belirtmeyi kolaylaştırır.

## Genel Bakış

OpenSpec, işinizi iki ana alana göre düzenler:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Gerçeğin Kaynağı    │◄─────│  Önerilen Değişiklikler       │   │
│   │  Sisteminizin       │ merge│  Her değişiklik = bir klasör     │   │
│   │  şu anda nasıl çalıştığı │      │  Artifacts + deltas          │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs**, gerçeğin kaynağıdır — sisteminizin şu anda nasıl davrandığını tanımlarlar.

**Changes (Değişiklikler)** ise önerilen modifikasyonlardır — bunları birleştirmeye hazır olana kadar ayrı klasörlerde tutulurlar.

Bu ayrım çok önemlidir. Çatışma olmadan birden fazla değişiklik üzerinde çalışabilirsiniz. Ana specs'leri etkilemeden bir değişikliği inceleyebilirsiniz. Ve bir değişikliği arşivlediğinizde, deltaları gerçeğin kaynağına temiz bir şekilde birleşir.

## Specs (Özellikler)

Specs, sisteminizin davranışını yapılandırılmış gereksinimler ve senaryolar kullanarak tanımlar.

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

Specs'leri, sisteminiz için mantıklı olan gruplamalara göre alanlara (domain) göre düzenleyin. Yaygın kalıplar:

- **Özellik alanına göre**: `auth/`, `payments/`, `search/`
- **Bileşene göre**: `api/`, `frontend/`, `workers/`
- **Sınırlı bağlama (bounded context) göre**: `ordering/`, `fulfillment/`, `inventory/`

### Spec Formatı

Bir spec, gereksinimleri içerir ve her bir gereksinimin senaryoları vardır:

```markdown
# Auth Specification (Kimlik Doğrulama Özelliği)

## Amaç
Uygulama için kimlik doğrulama ve oturum yönetimi.

## Gereksinimler

### Requirement: Kullanıcı Kimlik Doğrulaması
Sistem, başarılı bir giriş sonrasında bir JWT tokenı vermELİDİR (SHALL).

#### Scenario: Geçerli kimlik bilgileri
- GIVEN geçerli kimlik bilgilere sahip bir kullanıcı
- WHEN kullanıcı giriş formunu gönderir
- THEN bir JWT tokenı döndürülür
- AND kullanıcı kontrol paneline yönlendirilir

#### Scenario: Geçersiz kimlik bilgileri
- GIVEN geçersiz kimlik bilgileri
- WHEN kullanıcı giriş formunu gönderir
- THEN bir hata mesajı gösterilir
- AND herhangi bir token verilmez

### Requirement: Oturum Süresi Dolması
Sistem, 30 dakikalık hareketsizlikten sonra oturumları sona erdirmELİDİR (MUST).

#### Scenario: Boşta kalma zaman aşımı
- GIVEN kimlik doğrulanmış bir oturum
- WHEN 30 dakika boyunca aktivite olmazsa
- THEN oturum geçersiz kılınır
- AND kullanıcı yeniden kimlik doğrulaması yapmalıdır
```

**Temel öğeler:**

| Element | Amaç |
|---------|---------|
| `## Purpose` | Bu spec'in alanına dair üst düzey açıklama |
| `### Requirement:` | Sistemin sahip olması gereken belirli bir davranış |
| `#### Scenario:` | Gereksinimin somut bir örneği |
| SHALL/MUST/SHOULD | Gereksinim gücünü belirten RFC 2119 anahtar kelimeleri |

### Neden Specs'leri Bu Şekilde Yapılandırmak?

**Gereksinimler "ne"dir** — bunlar, uygulamayı belirtmeden ne yapması gerektiğini ifade eder.

**Senaryolar "ne zaman"dır** — Bunlar doğrulanabilen somut örneklerdir. İyi senaryolar:
- Test edilebilir (onlar için otomatik bir test yazabilirsiniz)
- Hem mutlu yolu hem de uç durumları kapsar
- Given/When/Then veya benzeri yapılandırılmış format kullanır

**RFC 2119 anahtar kelimeleri** (SHALL, MUST, SHOULD, MAY) niyeti iletir:
- **MUST/SHALL** — mutlak gereklilik
- **SHOULD** — tavsiye edilir, ancak istisnaları vardır
- **MAY** — isteğe bağlı

### Bir Spec Nedir (ve Ne Değildir)?

Bir spec, bir uygulama planı değil, bir **davranış sözleşmesidir**.

İyi spec içeriği:
- Kullanıcıların veya alıcı sistemlerin bağımlı olduğu gözlemlenebilir davranışlar
- Girdiler, çıktılar ve hata koşulları
- Harici kısıtlamalar (güvenlik, gizlilik, güvenilirlik, uyumluluk)
- Test edilebilen veya açıkça doğrulanabilen senaryolar

Specs'lerde kaçınılması gerekenler:
- Dahili sınıf/fonksiyon adları
- Kütüphane veya çerçeve seçimleri
- Adım adım uygulama ayrıntıları
- Detaylı yürütme planları (bunlar `design.md` veya `tasks.md` içinde yer almalıdır)

Hızlı bir test:
- Eğer uygulamanın değişmesi, dışarıdan görünen davranışı değiştirmeden yapabiliyorsa, muhtemelen spec'e ait değildir.

### Hafif Tutun: Aşamalı Titizlik (Progressive Rigor)

OpenSpec bürokrasiyi önlemeyi amaçlar. Değişikliği doğrulanabilir kılan en hafif seviyeyi kullanın.

**Hafif spec (varsayılan):**
- Kısa, davranış odaklı gereksinimler
- Açık kapsam ve hedef dışı konular
- Birkaç somut kabul kontrolü

**Tam spec (daha yüksek risk için):**
- Çapraz ekip veya çapraz depo değişiklikleri
- API/sözleşme değişiklikleri, geçişler, güvenlik/gizlilik endişeleri
- Belirsizliğin pahalı yeniden işe neden olma ihtimali olan değişiklikler

Çoğu değişiklik Hafif modda kalmalıdır.

### İnsan + Agent İşbirliği

Birçok ekipte insanlar keşfeder ve agent'lar (yapay zeka) artifact'ları taslak haline getirir. Amaçlanan döngü şudur:

1. İnsan niyeti, bağlam ve kısıtlamaları sağlar.
2. Agent bunu davranış odaklı gereksinimlere ve senaryolara dönüştürür.
3. Agent uygulama ayrıntılarını `spec.md` yerine `design.md` ve `tasks.md` içinde tutar.
4. Doğrulama, uygulamadan önce yapının ve netliğin onaylanmasını sağlar.

Bu, specs'lerin insanlar için okunabilir olmasını ve agent'lar için tutarlı olmasını sağlar.

## Changes (Değişiklikler)

Bir değişiklik, sisteminize yapılan önerilen bir modifikasyondur; bunu anlamak ve uygulamak için gereken her şeyle paketlenmiş bir klasördür.

### Değişiklik Yapısı

```
openspec/changes/add-dark-mode/
├── proposal.md           # Neden ve ne
├── design.md             # Nasıl (teknik yaklaşım)
├── tasks.md              # Uygulama kontrol listesi
├── .openspec.yaml        # Değişiklik meta verisi (isteğe bağlı)
└── specs/                # Delta specs'leri
    └── ui/
        └── spec.md       # ui/spec.md'de ne değişiyor
```

Her değişiklik kendi içinde tamamlanmış durumdadır. Şunları içerir:
- **Artifacts (Eserler)** — Niyeti, tasarımı ve görevleri yakalayan belgeler
- **Delta specs** — Ne eklendiğinin, değiştirildiğinin veya kaldırıldığının spesifikasyonları
- **Metadata** — Bu özel değişiklik için isteğe bağlı yapılandırma

### Değişikliklerin Klasör Olmasının Nedeni

Bir değişikliği klasör olarak paketlemenin birkaç faydası vardır:

1. **Her şey bir arada.** Proposal (Öneri), design (Tasarım), tasks (Görevler) ve specs (Spesifikasyonlar) tek bir yerde bulunur. Farklı yerlerde arama yapmaya gerek kalmaz.

2. **Paralel çalışma.** Birden fazla değişiklik aynı anda çatışma olmadan var olabilir. `add-dark-mode` üzerinde çalışırken `fix-auth-bug` da devam edebilir.

3. **Temiz geçmiş.** Arşivlendiğinde, değişiklikler tam bağlamları korunarak `changes/archive/` konumuna taşınır. Geriye dönüp neyin değiştiğini değil, neden değiştiğini anlayabilirsiniz.

4. **İncelemeye uygun.** Bir değişiklik klasörü incelemek kolaydır — açın, öneriyi okuyun, tasarımı kontrol edin, spec deltalarını görün.

## Artifacts (Eserler)

Artifact'lar, işi yönlendiren bir değişikliğin içindeki belgelerdir.

### Artifact Akışı

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   neden            ne           nasıl          atılması gereken adımlar
 + kapsam        değişiklikler       yaklaşım      yapılacaklar
```

Artifact'lar birbirinin üzerine inşa edilir. Her artifact, bir sonrakine bağlam sağlar.

### Artifact Türleri

#### Proposal (`proposal.md`)

Proposal, **niyeti**, **kapsamı** ve **yaklaşımı** üst düzeyde yakalar.

```markdown
# Proposal: Add Dark Mode (Koyu Mod Ekleme Önerisi)

## Niyet (Intent)
Kullanıcılar, gece kullanımı sırasında göz yorgunluğunu azaltmak ve sistem tercihlerini karşılamak için koyu mod seçeneği talep etti.

## Kapsam (Scope)
Kapsam dahilinde:
- Ayarlar içinde tema değiştirme düğmesi
- Sistem tercihinin tespiti
- Tercihi localStorage'da saklama

Kapsam dışında:
- Özel renk temaları (gelecekteki işler)
- Sayfa bazlı tema geçersiz kılmaları

## Yaklaşım (Approach)
Durum yönetimi için bir React context kullanarak CSS özel özelliklerini temalandırmada kullanmak. İlk yüklemede sistem tercihini tespit etmek ve manuel geçersiz kılmaya izin vermek.
```

**Proposal'ı ne zaman güncellemeli:**
- Kapsam değişiklikleri (daraltma veya genişletme)
- Niyetin netleşmesi (sorunun daha iyi anlaşılması)
- Yaklaşımın temelden değişmesi

#### Specs (Delta specs in `specs/`)

Delta specs, mevcut specs'lere göre **neyin değiştiğini** tanımlar. Aşağıdaki [Delta Specs](#delta-specs)'e bakın.

#### Design (`design.md`)

Design, **teknik yaklaşımı** ve **mimari kararları** yakalar.

````markdown
# Design: Add Dark Mode (Koyu Mod Ekleme Tasarımı)

## Teknik Yaklaşım
Prop drilling'i önlemek için tema durumu React Context üzerinden yönetilecektir. CSS özel özellikleri, sınıf değiştirme olmadan çalışma zamanında geçiş yapmayı sağlar.

## Mimari Kararlar

### Decision: Context over Redux (Redux yerine Context kullanımı)
Tema durumu için React Context kullanılması çünkü:
- Basit ikili durum (açık/koyu)
- Karmaşık durum geçişleri yok
- Redux bağımlılığı eklemekten kaçınılır

### Decision: CSS Custom Properties (CSS Özel Özellikleri)
CSS-in-JS yerine CSS değişkenlerinin kullanılması çünkü:
- Mevcut stil sayfasıyla çalışır
- Çalışma zamanı yükü yoktur
- Tarayıcı yerel çözümü

## Veri Akışı
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (root'a uygulananlar)
```

## Dosya Değişiklikleri
- `src/contexts/ThemeContext.tsx` (yeni)
- `src/components/ThemeToggle.tsx` (yeni)
- `src/styles/globals.css` (değiştirildi)
````

**Design'ı ne zaman güncellemeli:**
- Uygulama, yaklaşımın işe yaramayacağını ortaya çıkarırsa
- Daha iyi bir çözüm keşfedilirse
- Bağımlılıklar veya kısıtlamalar değişirse

#### Tasks (`tasks.md`)

Tasks, **uygulama kontrol listesidir** — onay kutucukları olan somut adımlar.

```markdown
# Görevler (Tasks)

## 1. Tema Altyapısı
- [ ] 1.1 light/dark durumu ile ThemeContext oluşturma
- [ ] 1.2 Renkler için CSS özel özelliklerini ekleme
- [ ] 1.3 localStorage kalıcılığını uygulama
- [ ] 1.4 Sistem tercihini tespit etme

## 2. UI Bileşenleri
- [ ] 2.1 ThemeToggle bileşenini oluşturma
- [ ] 2.2 Ayarlar sayfasına toggle ekleme
- [ ] 2.3 Hızlı geçişi içerecek şekilde Başlık (Header) güncelleme

## 3. Stil Oluşturma
- [ ] 3.1 Koyu tema renk paletini tanımlama
- [ ] 3.2 Bileşenleri CSS değişkenlerini kullanacak şekilde güncelleme
- [ ] 3.3 Erişilebilirlik için kontrast oranlarını test etme
```

**Görev en iyi uygulamaları:**
- İlgili görevleri başlıklar altında gruplayın
- Hiyerarşik numaralandırma kullanın (1.1, 1.2 vb.)
- Görevlerin tek bir oturumda tamamlanabilecek kadar küçük tutun
- Tamamladıkça görevleri işaretleyin

## Delta Specs (Değişim Spesifikasyonları)

Delta specs, OpenSpec'in brownfield (mevcut sistem üzerine inşa etme) geliştirme için çalışmasını sağlayan temel kavramdır. Bunlar, tüm spec'i yeniden ifade etmek yerine **neyin değiştiğini** tanımlar.

### Format
```markdown
# Delta for Auth (Kimlik Doğrulama Deltası)

## ADDED Requirements (EKLENEN Gereksinimler)

### Requirement: İki Faktörlü Kimlik Doğrulama
Sistem, TOTP tabanlı iki faktörlü kimlik doğrulamayı desteklemELİDİR.

#### Scenario: 2FA kayıt
- GIVEN 2FA'sı olmayan bir kullanıcı
- WHEN kullanıcı ayarlardan 2FA'yı etkinleştirir
- THEN doğrulayıcı uygulama için bir QR kodu gösterilir
- AND kullanıcı aktivasyon öncesinde bir kodla doğrulamalıdır

#### Scenario: 2FA ile giriş
- GIVEN 2FA'sı olan bir kullanıcı
- WHEN kullanıcı geçerli kimlik bilgilerini gönderir
- THEN bir OTP challenge (OTP zorlaması) sunulur
- AND giriş, yalnızca geçerli OTP sonrası tamamlanır

## MODIFIED Requirements (DEĞİŞTİRİLEN Gereksinimler)

### Requirement: Oturum Süresi Dolması
Sistem, 15 dakikalık hareketsizlikten sonra oturumları sona erdirmELİDİR.
(Önceki hali: 30 dakika)

#### Scenario: Boşta kalma zaman aşımı
- GIVEN kimlik doğrulanmış bir oturum
- WHEN 15 dakika boyunca aktivite olmazsa
- THEN oturum geçersiz kılınır

## REMOVED Requirements (KALDIRILAN Gereksinimler)

### Requirement: Beni Hatırla
(2FA lehine kullanımdan kaldırıldı. Kullanıcılar her oturumda yeniden kimlik doğrulaması yapmalıdır.)
```

### Delta Bölümleri

| Section | Anlamı | Arşivlendiğinde Ne Olur |
|---------|---------|------------------------|
| `## ADDED Requirements` | Yeni davranış | Ana spec'e eklenir (Append) |
| `## MODIFIED Requirements` | Değişen davranış | Mevcut gereksinimi değiştirir/yerine koyar |
| `## REMOVED Requirements` | Kullanımdan kaldırılan davranış | Ana spec'ten silinir |

### Tam Spec Yerine Delta Neden?

**Netlik.** Bir delta, tam olarak neyin değiştiğini gösterir. Tüm bir spec'i okumak, onu mevcut versiyonla zihinsel olarak karşılaştırmayı gerektirirdi.

**Çatışma önleme.** İki değişiklik, farklı gereksinimleri değiştirdiği sürece aynı spec dosyasına dokunabilir ve çatışmazlar.

**İnceleme verimliliği.** İncelemeciler değişimi görür, değişmeyen bağlamı değil. Önemli olana odaklanırlar.

**Brownfield uyumu.** Çoğu iş mevcut davranışı değiştirmeyi içerir. Deltalar, modifikasyonları sonradan bir düşünce değil, birinci sınıf vatandaş yapar.

## Şemalar (Schemas)

Şemalar, bir iş akışı için artefakt türlerini ve bunların bağımlılıklarını tanımlar.

### Şemaların Çalışma Biçimi

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Bağımlılık yok, ilk oluşturabilir

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Oluşturmadan önce proposal'a ihtiyacı var

  - id: design
    generates: design.md
    requires: [proposal]      # Specs ile paralel olarak oluşturulabilir

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Hem specs hem de design'a ihtiyaç duyar
```

**Artefaktlar bir bağımlılık grafiği oluşturur:**

```
                    proposal
                   (kök düğüm)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (gerektirir:                  (gerektirir:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (gerektirir:
                specs, design)
```

**Bağımlılıklar kapı değil, kolaylaştırıcıdır.** Bunlar neyin oluşturulabileceğini gösterir, bir sonraki adımda ne yapmanız gerektiğini göstermez. Eğer ihtiyacınız yoksa design'ı atlayabilirsiniz. Specs'i design'dan önce veya sonra oluşturabilirsiniz — her ikisi de sadece proposal'a bağlıdır.

### Yerleşik Şemalar (Built-in Schemas)

**spec-driven** (varsayılan)

Spec-driven geliştirme için standart iş akışı:

```
proposal → specs → design → tasks → implement
```

En uygun olduğu yerler: Uygulama öncesinde spesifikasyonlar üzerinde anlaşmak istediğiniz çoğu özellik çalışması.

### Özel Şemalar (Custom Schemas)

Ekibinizin iş akışı için özel şemalar oluşturun:

```bash
# Sıfırdan oluşturma
openspec schema init research-first

# Veya mevcut birini çatallama (fork)
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
    requires: [research]   # Proposal, araştırmayla bilgilendirilir

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Specs/design'ı atlayıp doğrudan görevlere geçin
```

Özel şemaların oluşturulması ve kullanılmasıyla ilgili tüm ayrıntılar için [Customization](customization.md)'a bakın.

## Arşivleme (Archive)

Arşivleme, bir değişikliği ana spesifikasyonlara delta'larını birleştirerek tamamlar ve değişikliği tarihçe için korur.

### Arşivlediğinizde Ne Olur?

```
Arşivden önce:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ merge
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Arşivden sonra:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Artık 2FA gereksinimlerini içeriyor
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Tarihçe için korunur
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Arşivleme Süreci

1. **Delta'ları Birleştirme.** Her delta spesifikasyon bölümü (EKLEME/DEĞİŞTİRİLMİŞ/KALDIRILMIŞ), ilgili ana spesifikasyona uygulanır.

2. **Arşive Taşıma.** Değişiklik klasörü, kronolojik sıralama için bir tarih öneki ile birlikte `changes/archive/` konumuna taşınır.

3. **Bağlamı Koruma.** Tüm artefaktlar arşivde sağlam kalır. Bir değişikliğin neden yapıldığını anlamak için her zaman geriye bakabilirsiniz.

### Arşivlemenin Önemi

**Temiz Durum.** Aktif değişiklikler (`changes/`) yalnızca devam eden çalışmaları gösterir. Tamamlanan işler yer açar.

**Denetim İzleri (Audit trail).** Arşiv, her değişikliğin tam bağlamını korur — sadece neyin değiştiğini değil, nedenini açıklayan proposal'ı, nasıl yapılacağını açıklayan design'ı ve yapılan işi gösteren görevleri.

**Spesifikasyon Evrimi.** Değişiklikler arşivlendikçe spesifikasyonlar organik olarak büyür. Her arşiv, delta'larını birleştirerek zaman içinde kapsamlı bir spesifikasyon oluşturur.

## Hepsi Nasıl Bir Arada?

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC AKIŞI                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. BAŞLATMA   │  /opsx:propose (core) veya /opsx:new (expanded)           │
│   │     DEĞİŞİKLİK │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. OLUŞTURMA  │  /opsx:ff veya /opsx:continue (genişletilmiş iş akışı)     │
│   │     ARTEFAKTLAR │  proposal → specs → design → tasks oluşturur              │
│   │                │  (şema bağımlılıklarına göre)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. UYGULAMA   │  /opsx:apply                                            │
│   │     GÖREVLER  │  Görevler üzerinde çalışılır ve işaretlenir                  │
│   │                │◄──── Öğrendikçe artefaktları Güncelleme                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. DOĞRULAMA  │  /opsx:verify (isteğe bağlı)                                │
│   │     İŞLER      │  Uygulamanın spesifikasyonlarla eşleştiğini kontrol etme    │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARŞİVLEME  │────►│  Delta spesifikasyonların ana spesifikasyonlara birleşmesi │    │
│   │     DEĞİŞİKLİK │     │  Değişiklik klasörü archive/ konumuna taşınır.       │    │
│   └────────────────┘     │  Spesifikasyonlar artık güncel doğru kaynaktır.      │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Erdemli Döngü (The virtuous cycle):**

1. Specs mevcut davranışı tanımlar.
2. Değişiklikler modifikasyonları önerir (delta'lar olarak).
3. Uygulama bu değişiklikleri gerçeğe dönüştürür.
4. Arşivleme, delta'ları spesifikasyonlara birleştirir.
5. Specs artık yeni davranışı tanımlar.
6. Bir sonraki değişiklik güncellenmiş specs üzerine inşa edilir.

## Sözlük (Glossary)

| Terim | Tanım |
|------|------------|
| **Artifact** | Bir değişim içindeki belge (proposal, design, tasks veya delta specs). |
| **Archive** | Bir değişikliği tamamlamak ve delta'larını ana spesifikasyonlara birleştirmek süreci. |
| **Change** | Artefaktlarla paketlenmiş, sisteme önerilen bir değişiklik. |
| **Delta spec** | Mevcut spesifikasyonlara göre değişiklikleri (EKLEME/DEĞİŞTİRİLMİŞ/KALDIRILMIŞ) tanımlayan bir spesifikasyon. |
| **Domain** | Spesifikasyonlar için mantıksal bir gruplama (örneğin, `auth/`, `payments/`). |
| **Requirement** | Sistemin sahip olması gereken belirli bir davranış. |
| **Scenario** | Bir gereksinimin somut bir örneği, tipik olarak Given/When/Then formatında. |
| **Schema** | Artefakt türlerinin ve bunların bağımlılıklarının tanımı. |
| **Spec** | Sistem davranışını tanımlayan, gereksinimler ve senaryolar içeren bir spesifikasyon. |
| **Source of truth** | Mevcut üzerinde anlaşılmış davranışı içeren `openspec/specs/` dizini. |

## Sonraki Adımlar (Next Steps)

- [Getting Started](getting-started.md) - Pratik ilk adımlar
- [Workflows](workflows.md) - Yaygın desenler ve ne zaman hangisini kullanmalı
- [Commands](commands.md) - Tam komut referansı
- [Customization](customization.md) - Özel şemalar oluşturma ve projenizi yapılandırma