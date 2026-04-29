# Kavramlar

Bu kılavuz, OpenSpec'in arkasındaki temel fikirleri ve bunların nasıl bir araya geldiğini açıklar. Pratik kullanım için [Başlangıç](getting-started.md) ve [İş Akışları](workflows.md) bölümlerine bakın.

## Felsefe

OpenSpec dört ilke üzerine kurulmuştur:

```
akıcı katı değil         — faz kapıları yok, anlamlı olan üzerinde çalışın
yinelemeli şelale değil  — inşa ederken öğrenin, ilerledikçe iyileştirin
basit karmaşık değil     — hafif kurulum, minimum tören
mevcut kod tabanı öncelikli — sadece sıfırdan projelerle değil, mevcut kod tabanlarıyla çalışır
```

### Bu İlkeler Neden Önemlidir?

**Akıcı katı değil.** Geleneksel spec sistemleri sizi belirli fazlara kilitler: önce planlarsınız, sonra uygularsınız, sonra işiniz biter. OpenSpec daha esnektir — çalışmanız için anlamlı olan herhangi bir sırayla artefaktlar oluşturabilirsiniz.

**Yinelemeli şelale değil.** Gereksinimler değişir. Anlayış derinleşir. Başta iyi bir yaklaşım gibi görünen şey, kod tabanını gördükten sonra geçerli olmayabilir. OpenSpec bu gerçeği kucaklar.

**Basit karmaşık değil.** Bazı spec çerçeveleri kapsamlı kurulum, katı formatlar veya ağır süreçler gerektirir. OpenSpec yolunuzdan çekilir. Saniyeler içinde başlatın, hemen çalışmaya başlayın, yalnızca ihtiyacınız varsa özelleştirin.

**Mevcut kod tabanı öncelikli.** Yazılım çalışmasının çoğu sıfırdan inşa etmek değil — mevcut sistemleri değiştirmektir. OpenSpec'in delta tabanlı yaklaşımı, sadece yeni sistemleri değil, mevcut davranıştaki değişiklikleri belirtmeyi kolaylaştırır.

## Genel Bakış

OpenSpec, çalışmanızı iki ana alana ayırır:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Hakikat kaynağı    │◄─────│  Önerilen değişiklikler       │   │
│   │  Sisteminizin şu an │ birleşt.│  Her değişiklik = bir klasör│   │
│   │  nasıl çalıştığı    │      │  Artifacts + deltas içerir    │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** (Özellikler) hakikat kaynağıdır — sisteminizin şu anki davranışını tanımlar.

**Changes** (Değişiklikler) önerilen değişikliklerdir — birleştirmeye hazır olana kadar ayrı klasörlerde bulunurlar.

Bu ayrım anahtardır. Birden fazla değişiklik üzerinde çakışma olmadan paralel olarak çalışabilirsiniz. Bir değişikliği ana özelliklere etki etmeden inceleyebilirsiniz. Ve bir değişikliği arşivlediğinizde, delta'ları hakikat kaynağına temiz bir şekilde birleşir.

## Specs (Özellikler)

Özellikler, yapılandırılmış gereksinimler ve senaryolar kullanarak sisteminizin davranışını tanımlar.

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
    └── spec.md           # UI davranışı ve temaları
```

Özellikleri alana göre organize edin — sisteminiz için anlamlı olan mantıksal gruplar. Yaygın kalıplar:

- **Özellik alanına göre**: `auth/`, `payments/`, `search/`
- **Bileşene göre**: `api/`, `frontend/`, `workers/`
- **Sınırlı bağlama göre**: `ordering/`, `fulfillment/`, `inventory/`

### Özellik Formatı

Bir özellik gereksinimler içerir ve her gereksinimin senaryoları vardır:

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

**Temel unsurlar:**

| Unsur | Amaç |
|---------|---------|
| `## Purpose` | Bu özelliğin alanının üst düzey tanımı |
| `### Requirement:` | Sistemin sahip olması gereken belirli bir davranış |
| `#### Scenario:` | Gereksinimin eylemdeki somut bir örneği |
| SHALL/MUST/SHOULD | Gereksinim gücünü belirten RFC 2119 anahtar kelimeleri |

### Özellikler Neden Bu Şekilde Yapılandırılır

**Gereksinimler "ne"yi** belirtir — sistemin ne yapması gerektiğini, uygulamayı belirtmeden söyler.

**Senaryolar "ne zaman"ı** belirtir — doğrulanabilecek somut örnekler sunar. İyi senaryolar:
- Test edilebilir (onlar için otomatik bir test yazabilirsiniz)
- Hem mutlu yolu hem de kenar durumlarını kapsar
- Given/When/Then veya benzeri yapılandırılmış formatı kullanır

**RFC 2119 anahtar kelimeleri** (SHALL, MUST, SHOULD, MAY) niyeti iletir:
- **MUST/SHALL** — mutlak gereksinim
- **SHOULD** — önerilen, ancak istisnalar var
- **MAY** — isteğe bağlı

### Özellik Nedir (Değildir)

Özellik bir **davranış sözleşmesidir**, bir uygulama planı değil.

İyi özellik içeriği:
- Kullanıcıların veya alt sistemlerin güvendiği gözlemlenebilir davranış
- Girdiler, çıktılar ve hata koşulları
- Dış kısıtlamalar (güvenlik, gizlilik, güvenilirlik, uyumluluk)
- Test edilebilen veya açıkça doğrulanabilen senaryolar

Özelliklerden kaçınılması gerekenler:
- İç sınıf/fonksiyon isimleri
- Kütüphane veya çerçeve seçimleri
- Adım adım uygulama detayları
- Detaylı yürütme planları (bunlar `design.md` veya `tasks.md`'ye aittir)

Hızlı test:
- Uygulama, dışarıdan görünür davranışı değiştirmeden değişebiliyorsa, muhtemelen özelliğe ait değildir.

### Hafif Tutun: Aşamalı Titizlik

OpenSpec bürokrasiden kaçınmayı hedefler. Değişikliği doğrulanabilir kılan en hafif düzeyi kullanın.

**Hafif özellik (varsayılan):**
- Kısa, davranış öncelikli gereksinimler
- Net kapsam ve hedef dışı alanlar
- Birkaç somut kabul kontrolü

**Tam özellik (daha yüksek risk için):**
- Çapraz ekip veya çapraz depo değişiklikleri
- API/sözleşme değişiklikleri, geçişler, güvenlik/gizlilik endişeleri
- Belirsizliğin pahalı yeniden çalışmaya neden olma ihtimalinin yüksek olduğu değişiklikler

Çoğu değişiklik Hafif modda kalmalıdır.

### İnsan + Ajan İşbirliği

Birçok ekipte, insanlar keşfeder ve ajanlar taslaklar oluşturur. Amaçlanan döngü şudur:

1. İnsan niyeti, bağlamı ve kısıtlamaları sağlar.
2. Ajan bunu davranış öncelikli gereksinimlere ve senaryolara dönüştürür.
3. Ajan uygulama detaylarını `design.md` ve `tasks.md`'de tutar, `spec.md`'de değil.
4. Doğrulama, uygulamadan önce yapıyı ve netliği doğrular.

Bu, özellikleri insanlar için okunabilir ve ajanlar için tutarlı kılar.

## Changes (Değişiklikler)

Bir değişiklik, sisteminize önerilen bir değişikliktir; anlamak ve uygulamak için gereken her şeyi içeren bir klasör olarak paketlenir.

### Değişiklik Yapısı

```
openspec/changes/add-dark-mode/
├── proposal.md           # Neden ve ne
├── design.md             # Nasıl (teknik yaklaşım)
├── tasks.md              # Uygulama kontrol listesi
├── .openspec.yaml        # Değişiklik meta verisi (isteğe bağlı)
└── specs/                # Delta özellikleri
    └── ui/
        └── spec.md       # ui/spec.md'de neler değişiyor
```

Her değişiklik bağımsızdır. İçerir:
- **Artifacts** — niyeti, tasarımı ve görevleri yakalayan belgeler
- **Delta specs** — eklenen, değiştirilen veya kaldırılan şeyler için özellikler
- **Metadata** — bu belirli değişiklik için isteğe bağlı yapılandırma

### Değişiklikler Neden Klasörlerdir

Bir değişikliği klasör olarak paketlemenin birkaç faydası vardır:

1. **Her şey bir arada.** Teklif, tasarım, görevler ve özellikler tek bir yerde. Farklı yerlerde avlanmaya gerek yok.

2. **Paralel çalışma.** Birden fazla değişiklik aynı anda var olabilir ve çakışmaz. `fix-auth-bug` devam ederken `add-dark-mode` üzerinde çalışabilirsiniz.

3. **Temiz geçmiş.** Arşivlendiğinde, değişiklikler tam bağlamı korunarak `changes/archive/`'a taşınır. Geriye dönüp sadece neyin değiştiğini değil, neden değiştiğini anlayabilirsiniz.

4. **İncelemeye uygun.** Bir değişiklik klasörü incelemek için kolaydır — açın, teklifi okuyun, tasarımı kontrol edin, özellik delta'larını görün.

## Artifacts (Yapı Taşları)

Artifacts, çalışmayı yönlendiren değişiklik içindeki belgelerdir.

### Artifact Akışı

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   neden           ne            nasıl         alınacak
 + kapsam       değişiklikler  yaklaşım      adımlar
```

Artifacts birbirini tamamlar. Her artifact bir sonraki için bağlam sağlar.

### Artifact Türleri

#### Proposal (`proposal.md`)

Teklif, **niyeti**, **kapsamı** ve **yaklaşımı** üst düzeyde yakalar.

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage and match system preferences.

## Scope
In scope:
- Theme toggle in settings
- System preference detection
- Persist preference in localStorage

Out of scope:
- Custom color themes (future work)
- Per-page theme overrides

## Approach
Use CSS custom properties for theming with a React context
for state management. Detect system preference on first load,
allow manual override.
```

**Teklif ne zaman güncellenir:**
- Kapsam değiştiğinde (daralma veya genişleme)
- Niyet netleştiğinde (sorunun daha iyi anlaşılması)
- Yaklaşım kökten değiştiğinde

#### Specs (`specs/` içindeki delta özellikleri)

Delta özellikleri, mevcut özelliklere kıyasla **nelerin değiştiğini** tanımlar. Aşağıdaki [Delta Specs](#delta-specs) bölümüne bakın.

#### Design (`design.md`)

Tasarım **teknik yaklaşımı** ve **mimari kararları** yakalar.

````markdown
# Design: Add Dark Mode

## Technical Approach
Theme state managed via React Context to avoid prop drilling.
CSS custom properties enable runtime switching without class toggling.

## Mimari Kararlar

### Karar: Redux Yerine Context
Tema durumu için React Context kullanıyoruz çünkü:
- Basit ikili durum (açık/koyu)
- Karmaşık durum geçişleri yok
- Redux bağımlılığını eklemekten kaçınıyoruz

### Karar: CSS Değişkenleri
CSS-in-JS yerine CSS değişkenleri kullanıyoruz çünkü:
- Mevcut stil dosyasıyla çalışır
- Çalışma zamanı yükü yoktur
- Tarayıcıya özgü çözümdür

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
- Uygulama, yaklaşımın çalışmayacağını ortaya koyduğunda
- Daha iyi bir çözüm keşfedildiğinde
- Bağımlılıklar veya kısıtlamalar değiştiğinde

#### Görevler (`tasks.md`)

Görevler **uygulama kontrol listesidir** — onay kutuları olan somut adımlar.

```markdown
# Görevler

## 1. Tema Altyapısı
- [ ] 1.1 Açık/koyu durumlu ThemeContext oluştur
- [ ] 1.2 Renkler için CSS özel değişkenleri ekle
- [ ] 1.3 localStorage kalıcılığını uygula
- [ ] 1.4 Sistem tercihi algılamasını ekle

## 2. UI Bileşenleri
- [ ] 2.1 ThemeToggle bileşenini oluştur
- [ ] 2.2 Ayarlar sayfasına toggle ekle
- [ ] 2.3 Başlığa hızlı toggle ekle

## 3. Stilendirme
- [ ] 3.1 Koyu tema renk paletini tanımla
- [ ] 3.2 Bileşenleri CSS değişkenlerini kullanacak şekilde güncelle
- [ ] 3.3 Erişilebilirlik için kontrast oranlarını test et
```

**Görev en iyi uygulamaları:**
- İlgili görevleri başlıklar altında gruplandır
- Hiyerarşik numaralandırma kullan (1.1, 1.2, vb.)
- Görevleri tek bir oturumda tamamlayacak kadar küçük tut
- Tamamladıkça görevlerin onay kutularını işaretle

## Delta Spesifikasyonları

Delta spesifikasyonları, OpenSpec'in mevcut yazılım geliştirmeye (brownfield development) uygun olmasını sağlayan anahtardır. Tüm spesifikasyonu yeniden yazmak yerine **neyin değiştiğini** tanımlarlar.

### Biçim

```markdown
# Auth için Delta

## EKLENEN Gereksinimler

### Gereksinim: İki Faktörlü Kimlik Doğrulama
Sistem, TOTP tabanlı iki faktörlü kimlik doğrulamayı DESTEKLEMELİDİR.

#### Senaryo: 2FA kaydı
- VERİLDİĞİNDE 2FA etkin olmayan bir kullanıcı
- Kullanıcı ayarlarda 2FA'yı etkinleştirdiğinde
- O ZAMAN kimlik doğrulayıcı uygulama kurulumu için bir QR kodu görüntülenir
- VE kullanıcı etkinleştirmeden önce bir kodla doğrulama yapmalıdır

#### Senaryo: 2FA ile giriş
- VERİLDİĞİNDE 2FA etkin bir kullanıcı
- Kullanıcı geçerli kimlik bilgilerini gönderdiğinde
- O ZAMAN bir OTP istemi sunulur
- VE giriş yalnızca geçerli OTP'den sonra tamamlanır

## DEĞİŞTİRİLMİŞ Gereksinimler

### Gereksinim: Oturum Süresi Dolumu
Sistem, 15 dakika hareketsizlikten sonra oturumları SÜRESİNİ DOLDURMALIDIR.
(Önceden: 30 dakika)

#### Senaryo: Boşta kalma zaman aşımı
- VERİLDİĞİNDE kimliği doğrulanmış bir oturum
- 15 dakika aktivite olmadan geçtiğinde
- O ZAMAN oturum geçersiz kılınır

## KALDIRILAN Gereksinimler

### Gereksinim: Beni Hatırla
(2FA lehine kaldırıldı. Kullanıcılar her oturumda yeniden kimlik doğrulamalıdır.)
```

### Delta Bölümleri

| Bölüm | Anlamı | Arşivlemede Ne Olur |
|---------|---------|------------------------|
| `## EKLENEN Gereksinimler` | Yeni davranış | Ana spesifikasyona eklenir |
| `## DEĞİŞTİRİLMİŞ Gereksinimler` | Değiştirilmiş davranış | Mevcut gereksinimi değiştirir |
| `## KALDIRILAN Gereksinimler` | Kaldırılmış davranış | Ana spesifikasyondan silinir |

### Neden Delta, Tam Spesifikasyonlar Yerine?

**Netlik.** Delta, neyin değiştiğini tam olarak gösterir. Tam bir spesifikasyonu okurken, onu mevcut sürüme karşı zihinsel olarak fark etmeniz gerekirdi.

**Çakışma önleme.** İki değişiklik, farklı gereksinimleri değiştirdikleri sürece aynı spesifikasyon dosyasına dokunabilir.

**İnceleme verimliliği.** İnceleyiciler değişikliği görür, değişmeyen bağlamı değil. Önemli olana odaklanın.

**Mevcut yazılıma uygunluk.** Çalışmanın çoğu mevcut davranışı değiştirir. Delta, değişiklikleri sonradan düşünülen bir şey değil, birinci sınıf yapar.

## Şemalar

Şemalar, bir iş akışı için ürün türlerini ve bağımlılıklarını tanımlar.

### Şemalar Nasıl Çalışır

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Bağımlılık yok, ilk oluşturulabilir

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Oluşturulmadan önce proposal'a ihtiyaç duyar

  - id: design
    generates: design.md
    requires: [proposal]      # Specs ile paralel olarak oluşturulabilir

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Önce hem specs hem de design'a ihtiyaç duyar
```

**Ürünler bir bağımlılık grafiği oluşturur:**

```
                    proposal
                   (kök düğüm)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (ihtiyaç duyar:               (ihtiyaç duyar:
    proposal)                    proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (ihtiyaç duyar:
                specs, design)
```

**Bağımlılıklar etkinleştiricilerdir, kapı bekçileri değil.** Neyin oluşturulabileceğini gösterirler, bir sonraki adımda neyi oluşturmanız gerektiğini değil. Gerekmiyorsa design'ı atlayabilirsiniz. Specs'i design'dan önce veya sonra oluşturabilirsiniz — her ikisi de yalnızca proposal'a bağlıdır.

### Yerleşik Şemalar

**spec-driven** (varsayılan)

Spec-driven geliştirme için standart iş akışı:

```
proposal → specs → design → tasks → implement
```

En iyi şu durum için: Uygulamadan önce specs üzerinde anlaşmaya varmak istediğiniz çoğu özellik çalışması.

### Özel Şemalar

Ekibinizin iş akışı için özel şemalar oluşturun:

```bash
# Sıfırdan oluşturun
openspec schema init research-first

# Veya mevcut bir şemadan çatallayın
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
    requires: [research]   # Araştırma ile desteklenen proposal

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Specs/design'ı atlayın, doğrudan görevlere geçin
```

Özel şemalar oluşturma ve kullanma hakkında tam ayrıntılar için [Özelleştirme](customization.md) bölümüne bakın.

## Arşivleme

Arşivleme, bir değişikliğin delta spesifikasyonlarını ana spesifikasyonlara birleştirerek ve değişikliği geçmiş için koruyarak tamamlar.

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
        ├── design.md                │ birleştirme
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Arşivlemeden sonra:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Artık 2FA gereksinimlerini içerir
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

1. **Deltaları birleştirin.** Her delta spesifikasyonu bölümü (EKLENEN/DEĞİŞTİRİLEN/KALDIRILAN), karşılık gelen ana spesifikasyona uygulanır.

2. **Arşive taşıyın.** Değişiklik klasörü, kronolojik sıralama için tarih ön ekli olarak `changes/archive/` konumuna taşınır.

3. **Bağlamı koruyun.** Tüm ürünler arşivde sağlam kalır. Bir değişikliğin neden yapıldığını anlamak için her zaman geriye bakabilirsiniz.

### Neden Arşivleme Önemlidir?

**Temiz durum.** Aktif değişiklikler (`changes/`) yalnızca devam eden çalışmaları gösterir. Tamamlanan çalışmalar yolun dışına çıkar.

**Denetim izi.** Arşiv, her değişikliğin tam bağlamını korur — yalnızca neyin değiştiğini değil, nedenini açıklayan proposal'ı, nasılını açıklayan design'ı ve yapılan çalışmaları gösteren görevleri.

**Spesifikasyon evrimi.** Değişiklikler arşivlendikçe spesifikasyonlar organik olarak büyür. Her arşiv deltalarını birleştirerek zaman içinde kapsamlı bir spesifikasyon oluşturur.

## Her Şey Nasıl Bir Araya Gelir

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC AKIŞI                                  │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. DEĞİŞİKLİĞİ│  /opsx:propose (çekirdek) veya /opsx:new (genişletilmiş)│
│   │     BAŞLAT      │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. ÜRÜNLERİ   │  /opsx:ff veya /opsx:continue (genişletilmiş iş akışı) │
│   │     OLUŞTUR    │  proposal → specs → design → tasks oluşturur            │
│   │                │  (şema bağımlılıklarına göre)                           │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. GÖREVLERİ  │  /opsx:apply                                            │
│   │     UYGULA     │  Görevler üzerinde çalışın, onay kutularını işaretleyin │
│   │                │◄──── Öğrendikçe ürünleri güncelleyin                    │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. ÇALIŞMAYI  │  /opsx:verify (isteğe bağlı)                            │
│   │     DOĞRULA    │  Uygulamanın specs ile eşleştiğini kontrol edin         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. DEĞİŞİKLİĞİ│────►│  Delta spesifikasyonları ana spesifikasyonlara│    │
│   │     ARŞİVLE    │     │  birleştirilir                               │    │
│   └────────────────┘     │  Değişiklik klasörü archive/ konumuna taşınır│    │
│                          │  Spesifikasyonlar artık güncellenmiş gerçeklik │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**İyilik döngüsü:**

1. Spesifikasyonlar mevcut davranışı tanımlar
2. Değişiklikler (deltalar olarak) değişiklikler önerir
3. Uygulama değişiklikleri gerçeğe dönüştürür
4. Arşivleme deltaları spesifikasyonlara birleştirir
5. Spesifikasyonlar artık yeni davranışı tanımlar
6. Bir sonraki değişiklik güncellenmiş spesifikasyonlar üzerine inşa edilir

## Sözlük

| Terim | Tanım |
|-------|-------|
| **Artifact** | Bir değişiklik içindeki belge (öneri, tasarım, görevler veya delta spesifikasyonları) |
| **Archive** | Bir değişikliği tamamlama ve delta'larını ana spesifikasyonlara birleştirme süreci |
| **Change** | Sistem için önerilen bir değişiklik, artifact'larla paketlenmiş bir klasör olarak |
| **Delta spec** | Mevcut spesifikasyonlara göre değişiklikleri (EKLENEN/DEĞİŞTİRİLEN/KALDIRILAN) tanımlayan bir spesifikasyon |
| **Domain** | Spesifikasyonlar için mantıksal bir gruplandırma (ör. `auth/`, `payments/`) |
| **Requirement** | Sistemin sahip olması gereken belirli bir davranış |
| **Scenario** | Bir gereksinimin somut örneği, genellikle Verildiğinde/Zamanında/O zaman formatında |
| **Schema** | Artifact türlerini ve bağımlılıklarını tanımlayan bir şema |
| **Spec** | Sistem davranışını tanımlayan, gereksinimleri ve senaryoları içeren bir spesifikasyon |
| **Source of truth** | Mevcut üzerinde anlaşmaya varılan davranışı içeren `openspec/specs/` dizini |

## Sonraki Adımlar

- [Başlangıç](getting-started.md) - Pratik ilk adımlar
- [İş Akışları](workflows.md) - Yaygın kalıplar ve her birinin ne zaman kullanılacağı
- [Komutlar](commands.md) - Tam komut referansı
- [Özelleştirme](customization.md) - Özel şemalar oluşturun ve projenizi yapılandırın