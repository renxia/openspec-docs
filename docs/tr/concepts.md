# Kavramlar

Bu kılavuz, OpenSpec'in arkasındaki temel fikirleri ve bunların nasıl bir arada çalıştığını açıklar. Pratik kullanım için [Başlarken](getting-started.md) ve [İş Akışları](workflows.md) belgelerine bakın.

## Felsefe

OpenSpec dört ilke etrafında inşa edilmiştir:

```
akışkan, katı değil        — faz kapıları yok, mantıklı olan üzerinde çalışın
iteratif, şelale değil — yaparken öğrenin, ilerlerken iyileştirin
kolay, karmaşık değil       — hafif kurulum, minimum formalite
brownfield öncelikli        — sadece greenfield projeler değil, mevcut kod tabanlarıyla da çalışır
```

### Bu İlkelerin Neden Önemli Olduğu

**Akışkan, katı değil.** Geleneksel spec sistemleri sizi belirli fazlara hapseder: önce planlama yaparsınız, sonra uygulama gerçekleştirirsiniz, sonra iş tamamlanır. OpenSpec daha esnektir — çalışmanız için mantıklı olan herhangi bir sırayla artifact'lar oluşturabilirsiniz.

**İteratif, şelale değil.** Gereksinimler değişir. Anlayışınız derinleşir. Başlangıçta iyi bir yaklaşım gibi görünen şey, kod tabanını inceledikten sonra geçerliliğini yitirebilir. OpenSpec bu gerçeği benimser.

**Kolay, karmaşık değil.** Bazı spec çerçeveleri kapsamlı kurulum, katı formatlar veya ağır süreçler gerektirir. OpenSpec işinize karışmaz. Saniyeler içinde başlatın, hemen çalışmaya başlayın, yalnızca ihtiyacınız olduğunda özelleştirin.

**Brownfield öncelikli.** Çoğu yazılım çalışması sıfırdan yapılmaz — mevcut sistemleri değiştirmektir. OpenSpec'in delta tabanlı yaklaşımı, yalnızca yeni sistemleri tanımlamakla kalmayıp mevcut davranışlardaki değişiklikleri belirtmeyi kolaylaştırır.

## Genel Resim

OpenSpec çalışmalarınızı iki ana alana düzenler:

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

**Specs** (Özellik Tanımları) tek gerçek kaynaktır — sisteminizin mevcut çalışma şeklini tanımlarlar.
**Changes** (Değişiklikler) önerilen modifikasyonlardır — birleştirmeye hazır olana kadar ayrı klasörlerde bulunur.

Bu ayrım çok önemlidir. Birden fazla değişiklik üzerinde çakışma olmadan paralel olarak çalışabilirsiniz. Ana spec'lere etkisi olmadan önce bir değişikliği inceleyebilirsiniz. Bir değişikliği arşivlediğinizde ise deltaları tek gerçek kaynağa sorunsuz bir şekilde birleştirilir.

## Specs

Spec'ler, yapılandırılmış gereksinimler ve senaryolar kullanarak sisteminizin davranışını tanımlar.

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

Spec'leri alan (domain) bazında düzenleyin — sisteminiz için mantıklı gruplamalar. Yaygın kalıplar:

- **Özellik alanına göre**: `auth/`, `payments/`, `search/`
- **Bileşene göre**: `api/`, `frontend/`, `workers/`
- **Sınırlı bağlama göre**: `ordering/`, `fulfillment/`, `inventory/`

### Spec Formatı

Bir spec, gereksinimleri içerir ve her gereksinimin birden fazla senaryosu vardır:

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

**Temel elemanlar:**

| Eleman | Amaç |
|---------|---------|
| `## Purpose` | Bu spec'ın alanına ilişkin yüksek seviyeli açıklama |
| `### Requirement:` | Sistemin sahip olması gereken belirli bir davranış |
| `#### Scenario:` | Gereksinimin gerçek dünyadaki somut çalıştırma örneği |
| SHALL/MUST/SHOULD | Gereksinim gücünü belirten RFC 2119 anahtar kelimeleri |

### Neden Spec'leri Bu Şekilde Yapılandırıyoruz

**Gereksinimler "ne" kısmıdır** — uygulama detaylarını belirtmeden sistemin ne yapması gerektiğini ifade ederler.

**Senaryolar "ne zaman" kısmıdır** — doğrulanabilir somut örnekler sunarlar. İyi senaryolar:
- Test edilebilir (onlar için otomatik bir test yazabilirsiniz)
- Hem doğru yolu hem de kenar durumları kapsar
- Given/When/Then veya benzeri yapılandırılmış format kullanır

**RFC 2119 anahtar kelimeleri** (SHALL, MUST, SHOULD, MAY) niyeti ifade eder:
- **MUST/SHALL** — mutlak gereksinim
- **SHOULD** — önerilir, ancak istisnalar vardır
- **MAY** — isteğe bağlı

### Bir Spec Nedir (Ve Nedir)

Bir spec, bir **davranış sözleşmesidir**, uygulama planı değildir.

İyi spec içeriği:
- Kullanıcıların veya alt sistemlerin güvendiği gözlemlenebilir davranış
- Girdiler, çıktılar ve hata koşulları
- Harici kısıtlamalar (güvenlik, gizlilik, güvenilirlik, uyumluluk)
- Test edilebilir veya açıkça doğrulanabilir senaryolar

Spec'lerden kaçınılması gerekenler:
- Dahili sınıf/fonksiyon adları
- Kütüphane veya framework seçimleri
- Adım adım uygulama detayları
- Detaylı çalıştırma planları (bunlar `design.md` veya `tasks.md` içinde yer alır)

Hızlı test:
- Uygulama, dışarıdan görülen davranışı değiştirmeden değişebiliyorsa, muhtemelen spec içinde yer almamalıdır.

### Hafif Tutun: Artan Sıkılık (Progressive Rigor)

OpenSpec, bürokrasiden kaçınmayı hedefler. Değişikliği hala doğrulanabilir kılan en hafif seviyeyi kullanın.

**Hafif spec (varsayılan):**
- Kısa, davranış odaklı gereksinimler
- Net kapsam ve hedefler dışındakiler
- Birkaç somut kabul kontrolü

**Tam spec (daha yüksek risk için):**
- Ekipler arası veya depolar arası değişiklikler
- API/sözleşme değişiklikleri, geçişler, güvenlik/gizlilik endişeleri
- Belirsizliğin pahalı yeniden çalışmaya neden olabileceği değişiklikler

Çoğu değişiklik Hafif modda kalmalıdır.

### İnsan + Ajan (Agent) İşbirliği

Birçok ekipte, insanlar keşif yapar ve ajanlar (agent) eserlerin taslaklarını çıkarır. İstenen döngü şöyledir:

1. İnsan niyet, bağlam ve kısıtlamaları sağlar.
2. Ajan bunu davranış odaklı gereksinimlere ve senaryolara dönüştürür.
3. Ajan uygulama detaylarını `spec.md` yerine `design.md` ve `tasks.md` içinde tutar.
4. Uygulamadan önce doğrulama, yapıyı ve netliği onaylar.

Bu, spec'leri insanlar için okunabilir ve ajanlar için tutarlı tutar.

## Değişiklikler (Changes)

Bir değişiklik (change), sisteminize yapılan önerilen bir modifikasyondur, anlaşılması ve uygulanması için gereken her şeyi içeren bir klasör olarak paketlenir.

### Değişiklik Yapısı

```
openspec/changes/add-dark-mode/
├── proposal.md           # Why and what
├── design.md             # How (technical approach)
├── tasks.md              # Implementation checklist
├── .openspec.yaml        # Change metadata (optional): schema, created, skip_specs
└── specs/                # Delta specs
    └── ui/
        └── spec.md       # What's changing in ui/spec.md
```

Her değişiklik kendi kendine yeterlidir. Şunları içerir:
- **Eserler (Artifacts)** — niyet, tasarım ve görevleri yakalayan belgeler
- **Delta Spec'ler** — eklenen, değiştirilen veya kaldırılan özellikler için özellik tanımları
- **Meta Veriler** — bu belirli değişiklik için isteğe bağlı yapılandırma

### Neden Değişiklikler Klasör Olarak Paketleniyor

Bir değişikliği klasör olarak paketlemenin birkaç faydası vardır:

1. **Her şey bir arada.** Öneri, tasarım, görevler ve spec'ler tek bir yerde bulunur. Farklı konumlarda arama yapma derdiniz olmaz.
2. **Paralel çalışma.** Birden fazla değişiklik aynı anda çakışma olmadan bulunabilir. `fix-auth-bug` değişikliği de aynı şekilde devam ederken `add-dark-mode` üzerinde çalışabilirsiniz.
3. **Temiz geçmiş.** Arşivlendiğinde, değişiklikler tüm bağlamları korunarak `changes/archive/` klasörüne taşınır. Sadece neyin değiştiğini değil, neden değiştiğini de geriye dönük olarak anlayabilirsiniz.
4. **İnceleme dostu.** Bir değişiklik klasörü incelenmesi kolaydır — klasörü açın, öneriyi okuyun, tasarımı kontrol edin, spec deltalarını görün.

## Eserler (Artifacts)

Eserler (Artifacts), değişiklik içinde çalışmayı yönlendiren belgelerdir.

### Eser Akışı

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Eserler birbirini tamamlar. Her eser bir sonraki için bağlam sağlar.

### Eser Türleri

#### Öneri (`proposal.md`)

Öneri, yüksek seviyede **niyet**, **kapsam** ve **yaklaşımı** yakalar.

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

**Öneriyi ne zaman güncellemelisiniz:**
- Kapsam değişiklikleri (daraltma veya genişletme)
- Niyet netleştiğinde (soruna daha iyi anladığımızda)
- Yaklaşım temel olarak değiştiğinde

#### Spec'ler (`specs/` klasöründeki delta spec'ler)

Delta spec'ler, mevcut spec'lere göre **neyin değiştiğini** tanımlar. Aşağıdaki [Delta Spec'ler](#delta-specs) bölümüne bakın.

#### Tasarım (`design.md`)

Tasarım, **teknik yaklaşımı** ve **mimari kararları** yakalar.

````markdown
# Design: Add Dark Mode

## Technical Approach
Theme state managed via React Context to avoid prop drilling.
CSS custom properties enable runtime switching without class toggling.

## Architecture Decisions

### Decision: Context over Redux
Using React Context for theme state because:
- Simple binary state (light/dark)
- No complex state transitions
- Avoids adding Redux dependency

### Decision: CSS Custom Properties
Using CSS variables instead of CSS-in-JS because:
- Works with existing stylesheet
- No runtime overhead
- Browser-native solution

## Data Flow
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes
- `src/contexts/ThemeContext.tsx` (new)
- `src/components/ThemeToggle.tsx` (new)
- `src/styles/globals.css` (modified)
````

**Tasarımı ne zaman güncellemelisiniz:**
- Uygulama, yaklaşımın çalışmayacağını ortaya çıkardığında
- Daha iyi bir çözüm bulunduğunda
- Bağımlılıklar veya kısıtlamalar değiştiğinde

#### Görevler (`tasks.md`)

Görevler, **uygulama kontrol listesidir** — onay kutuları olan somut adımlardır.

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence
- [ ] 1.4 Add system preference detection

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
- [ ] 3.3 Test contrast ratios for accessibility
```

**Görev en iyi uygulamaları:**
- İlgili görevleri başlıklar altında gruplayın
- Hiyerarşik numaralandırma kullanın (1.1, 1.2 vb.)
- Görevleri tek seansda tamamlanabilecek kadar küçük tutun
- Görevleri tamamladıkça işaretleyin

## Delta Spec'ler {#delta-specs}

Delta spec'ler, OpenSpec'in mevcut sistem üzerinde geliştirme (brownfield development) yaparken çalışmasını sağlayan temel kavramdır. Tüm spec'i yeniden yazmak yerine **neyin değiştiğini** tanımlarlar.

### Format

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup
- AND the user must verify with a code before activation

#### Scenario: 2FA login
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented
- AND login completes only after valid OTP

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users should re-authenticate each session.)
```

### Delta Bölümleri

| Bölüm | Anlamı | Arşivlendiğinde Ne Olur |
|---------|---------|------------------------|
| `## ADDED Requirements` | Yeni davranış | Ana spec'e eklenir |
| `## MODIFIED Requirements` | Değiştirilen davranış | Mevcut gereksinim ile değiştirilir |
| `## REMOVED Requirements` | Kullanımdan kaldırılan davranış | Ana spec'ten silinir |

### Neden Tam Spec Yerine Delta Kullanıyoruz

**Netlik.** Bir delta, tam olarak neyin değiştiğini gösterir. Tam bir spec okuduğunuzda, mevcut sürüm ile zihinsel olarak karşılaştırma yapmanız gerekir.

**Çakışma önleme.** Farklı gereksinimleri değiştirdikleri sürece, iki değişiklik aynı spec dosyasına dokunabilir çakışma olmadan.

**İnceleme verimliliği.** İnceleyiciler değişikliği görür, değişmemiş bağlamı değil. Önemli olan şeye odaklanın.

**Mevcut sistem uyumu.** Çoğu iş mevcut davranışı değiştirir. Deltalar, modifikasyonları ikinci sınıf bir şey değil, birinci sınıf yapar.

## Şemalar

Şemalar, bir iş akışı için yapıt türlerini ve bunların bağımlılıklarını tanımlar.

### Şemalar Nasıl Çalışır

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Bağımlılığı yok, ilk olarak oluşturulabilir

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Oluşturmadan önce teklif gerektirir

  - id: design
    generates: design.md
    requires: [proposal]      # Teklif ile paralel olarak oluşturulabilir

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Hem tasarım hem de teklif önce oluşturulmalıdır
```

**Yapıtlar bir bağımlılık grafiği oluşturur:**

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

**Bağımlılıklar engelleyiciler değil, olanak sağlayıcılardır.** Sıradaki neyi oluşturmanız gerektiğini değil, neyin oluşturulabileceğini gösterirler. Gerekmiyorsa tasarımı atlayabilirsiniz. Tasarımdan önce veya sonra specs oluşturabilirsiniz — her ikisi de sadece teklife bağlıdır.

### Dahili Şemalar

**spec-driven** (varsayılan)

Spec-driven geliştirme için standart iş akışı:

```
proposal → specs → design → tasks → implement
```

En uygun olduğu durum: Uygulamadan önce spesifikasyonlarda anlaşmak istediğiniz çoğu özellik çalışması.

### Özel Şemalar

Ekibinizin iş akışı için özel şemalar oluşturun:

```bash
# Sıfırdan oluştur
openspec schema init research-first

# Veya mevcut birini çatallayın
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
    requires: [research]   # Teklif araştırma ile bilgilendirilir

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Specs/tasarımı atla, doğrudan görevlere geç
```

Özel şemalar oluşturma ve kullanma hakkında tam bilgi için [Özelleştirme](customization.md) belgesine bakın.

## Arşivleme

Arşivleme, değişikliğin delta spesifikasyonlarını ana spesifikasyonlarla birleştirerek değişikliği tamamlar ve geçmiş için saklar.

### Arşivlediğinizde Ne Olur

```
Arşivlemeden önce:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │ birleştir
        ├── design.md                │
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
        └── 2025-01-24-add-2fa/    # Geçmiş için saklandı
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Arşivleme Süreci

1. **Deltaları birleştir.** Her delta spesifikasyon bölümü (EKLEDİ/DÜZENLEDİ/KALDIRDI) ilgili ana spesifikasyona uygulanır.
2. **Arşive taşı.** Değişiklik klasörü kronolojik sıralama için tarih önekiyle birlikte `changes/archive/` klasörüne taşınır.
3. **Bağlamı koru.** Tüm yapıtlar arşivde tamamen kalır. Bir değişikliğin neden yapıldığını anlamak için her zaman geri dönebilirsiniz.

### Arşivlemenin Önemi

**Temiz durum.** Aktif değişiklikler (`changes/`) yalnızca devam eden çalışmaları gösterir. Tamamlanan çalışmalar yoldan çıkarılır.

**Denetim izi.** Arşiv, her değişikliğin tam bağlamını korur — sadece neyin değiştiğini değil, nedenini açıklayan teklif, nasıl yapıldığını açıklayan tasarım ve yapılan işi gösteren görevleri de korur.

**Spesifikasyon evrimi.** Spesifikasyonlar arşivlendikçe organik olarak büyür. Her arşivleme deltalarını birleştirerek zamanla kapsamlı bir spesifikasyon oluşturur.

## Her Şeyin Nasıl Birlikte Çalıştığı

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC AKIŞI                                  │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. DEĞİŞİKLİĞİ│  /opsx:propose (çekirdek) veya /opsx:new (genişletilmiş)│
│   │     BAŞLAT     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. YAPITLARI  │  /opsx:ff veya /opsx:continue (genişletilmiş iş akışı) │
│   │     OLUŞTUR   │  Teklif → specs → tasarım → görevler oluşturur           │
│   │                │  (şema bağımlılıklarına dayanarak)                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. GÖREVLERİ  │  /opsx:apply                                            │
│   │     UYGULA    │  Görevleri tamamlayın, işaretleyin                       │
│   │                │◄──── Öğrendikçe yapıtları güncelleyin                  │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. ÇALIŞMAYI  │  /opsx:verify (isteğe bağlı)                           │
│   │     DOĞRULA   │  Uygulamanın spesifikasyonlarla eşleştiğini kontrol edin │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. DEĞİŞİKLİĞİ│────►│  Delta spesifikasyonlar ana spesifikasyonlarla │    │
│   │     ARŞİVLE   │     │  birleştirilir                                │    │
│   │                │     │  Değişiklik klasörü arşive taşınır            │    │
│   └────────────────┘     │  Spesifikasyonlar artık güncellenmiş doğru     │    │
│                          │  kaynaktır                                    │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Erdemli döngü:**

1. Spesifikasyonlar mevcut davranışı tanımlar
2. Değişiklikler değişiklikleri önerir (delta olarak)
3. Uygulama değişiklikleri gerçekleştirir
4. Arşivleme deltaları spesifikasyonlarla birleştirir
5. Spesifikasyonlar artık yeni davranışı tanımlar
6. Sonraki değişiklik güncellenmiş spesifikasyonlar üzerine inşa edilir

## Sözlük

| Terim | Tanım |
|------|------------|
| **Yapıt** | Bir değişiklik içindeki belge (teklif, tasarım, görevler veya delta spesifikasyonlar) |
| **Arşivleme** | Bir değişikliği tamamlayıp deltalarını ana spesifikasyonlarla birleştirme süreci |
| **Değişiklik** | Sisteme yapılan önerilen bir değişiklik, yapıtlarla birlikte paketlenmiş bir klasör olarak |
| **Delta spesifikasyon** | Mevcut spesifikasyonlara göre değişiklikleri (EKLEDİ/DÜZENLEDİ/KALDIRDI) tanımlayan bir spesifikasyon |
| **Etki alanı** | Spesifikasyonlar için mantıksal bir gruplama (örneğin `auth/`, `payments/`) |
| **Gereksinim** | Sistemin sahip olması gereken belirli bir davranış |
| **Senaryo** | Bir gereksinimin somut örneği, genellikle Given/When/Then formatında |
| **Şema** | Yapıt türlerini ve bağımlılıklarını tanımlayan yapı |
| **Spesifikasyon** | Sistem davranışını tanımlayan, gereksinimleri ve senaryoları içeren belge |
| **Tek doğru kaynak** | Mevcut kabul edilmiş davranışı içeren `openspec/specs/` dizini |

## Sonraki Adımlar

- [Başlarken](getting-started.md) - Pratik ilk adımlar
- [İş Akışları](workflows.md) - Yaygın kalıplar ve her birinin ne zaman kullanılacağı
- [Komutlar](commands.md) - Tam komut referansı
- [Özelleştirme](customization.md) - Özel şemalar oluşturun ve projenizi yapılandırın