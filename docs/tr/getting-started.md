# Başlangıç

Bu kılavuz, OpenSpec'in kurulup başlatıldıktan sonra nasıl çalıştığını açıklamaktadır. Kurulum talimatları için [ana README](../index.md#quick-start) veya [Kurulum rehberine](installation.md) bakınız. Tüm dokümantasyon setine yeni misiniz? [Dokümantasyon ana sayfası](index.md) her şeyi haritalandırır.

> **Bu komutları nereye yazıyorum?** İki yere, ve bunları karıştırmak en yaygın ilk hatadır.
>
> - `openspec ...` komutları (örneğin `openspec init`) **terminalinizde** çalışır.
> - `/opsx:...` komutları (örneğin `/opsx:propose`) **AI asistanınızın sohbetinde** çalışır; kod yazmasını istediğiniz kutu aynıdır.
>
> Başlamak için ayrı bir "etkileşim modu" yoktur. Sadece sohbette eğik çizgi komutunu yazarsınız ve asistanınız oradan devam eder. Tam açıklama: [Komutlar Nasıl Çalışır](how-commands-work.md).

## İlk Beş Dakikanız

Tüm döngü, her adımın nerede gerçekleştiğiyle etiketlenmiştir:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (isteğe bağlı: önce düşünün)
AI CHAT      /opsx:propose add-dark-mode      (AI planı taslaklar; siz gözden geçirirsiniz)
AI CHAT      /opsx:apply                      (AI inşa eder)
AI CHAT      /opsx:archive                    (specs güncellendi, değişiklik dosyalandı)
```

Kurulum için iki terminal adımı vardır, ardından sohbet ortamında çalışırsınız. Bu kılavuzun geri kalanı her adımın ne yaptığını ve ne göreceğinizi açar.

> **Henüz ne inşa edeceğinizden emin değil misiniz? `/opsx:explore` ile başlayın.** Bu, kod tabanınızı okuyan, seçenekleri tartarak belirsiz bir fikri somut bir plana dönüştüren, herhangi bir eser veya koddan önce çalışan risksiz bir düşünme ortağıdır. Resim netleştiğinde, `/opsx:propose`'a devredilir. Bu, aksi takdirde yanlış şeyi kendinden emin bir şekilde inşa edecek bir AI ile çalışmak için tek en iyi alışkanlıktır. [Explore rehberine](explore.md) bakın.

## Nasıl Çalışıyor

OpenSpec, herhangi bir kod yazılmadan önce sizin ve yapay zeka kodlama asistanınızın neyi inşa edeceğiniz konusunda anlaşmasına yardımcı olur.

**Varsayılan hızlı yol (çekirdek profili):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (isteğe bağlı)
```

Ne yapacağınızı bulurken `/opsx:explore` ile başlayın veya zaten biliyorsanız doğrudan `/opsx:propose`'a atlayın. Explore varsayılan profilde olduğundan, istediğiniz zaman oradadır.

**Genişletilmiş yol (özel iş akışı seçimi):**

```text
/opsx:new ──► /opsx:ff veya /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Varsayılan küresel profil `core`'dur ve `propose`, `explore`, `apply`, `sync` ve `archive` içerir. Genişletilmiş iş akışı komutlarını `openspec config profile` ve ardından `openspec update` ile etkinleştirebilirsiniz.

## OpenSpec Ne Oluşturur?

`openspec init` çalıştırıldıktan sonra projeniz bu yapıya sahiptir:

```
openspec/
├── specs/              # Gerçek kaynak (sisteminizin davranışı)
│   └── <domain>/
│       └── spec.md
├── changes/            # Önerilen güncellemeler (değişiklik başına bir klasör)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta specs (ne değişiyor)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Proje yapılandırması (isteğe bağlı)
```

**İki ana dizin:**

- **`specs/`** - Gerçek kaynak. Bu specs, sisteminizin şu anda nasıl davrandığını açıklar. Alan (örneğin, `specs/auth/`, `specs/payments/`) bazında düzenlenmiştir.

- **`changes/`** - Önerilen değişiklikler. Her değişiklik, ilgili tüm artefaktlarla kendi klasörünü alır. Bir değişiklik tamamlandığında, specs ana `specs/` dizinine birleştirilir.

## Artefaktları Anlamak

Her değişiklik klasörü, çalışmayı yönlendiren artefaktlar içerir:

| Artefakt | Amaç |
|----------|---------|
| `proposal.md` | "Neden" ve "ne" - niyeti, kapsamı ve yaklaşımı yakalar |
| `specs/` | EKlenen/DEĞİŞTİRİLEN/KALDIRILAN gereksinimleri gösteren Delta specs |
| `design.md` | "Nasıl" - teknik yaklaşım ve mimari kararlar |
| `tasks.md` | Kontrol kutucuklu uygulama kontrol listesi |

**Artefaktlar birbirine dayanır:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            öğrendikçe güncelle
```

Uygulama sırasında daha fazla şey öğrendikçe her zaman önceki artefaktları geri dönüp iyileştirebilirsiniz.

## Delta Specs Nasıl Çalışır?

Delta specs, OpenSpec'teki ana kavramdır. Mevcut specs'inize göre neyin değiştiğini gösterirler.

### Format

Delta specs, değişiklik türünü belirtmek için bölümler kullanır:

```markdown
# Auth İçin Delta

## EKlenen Gereksinimler

### Gereksinim: İki Faktörlü Kimlik Doğrulama
Sistem, giriş sırasında ikinci bir faktör gerektirmelidir.

#### Senaryo: OTP gerekli
- VERİLEN: 2FA etkinleştirilmiş bir kullanıcı
- DÜŞÜNÜLEN: Kullanıcı geçerli kimlik bilgilerini gönderdiğinde
- SONUÇ: Bir OTP zorluğu sunulur

## DEĞİŞTİRİLEN Gereksinimler

### Gereksinim: Oturum Zaman Aşımı
Sistem, 30 dakika hareketsizlikten sonra oturumları sona erdirmelidir.
(Önceki: 60 dakika)

#### Senaryo: Boşta Kalma zaman aşımı
- VERİLEN: Kimlik doğrulaması yapılmış bir oturum
- DÜŞÜNÜLEN: 30 dakika hareketsiz geçildiğinde
- SONUÇ: Oturum geçersiz kılınır

## KALDIRILAN Gereksinimler

### Gereksinim: Beni Hatırla
(2FA lehine kullanımdan kaldırıldı)
```

### Arşivlenirken Ne Olur?

Bir değişikliği arşivlediğinizde:

1. **EKlenen** gereksinimler ana spec'e eklenir.
2. **DEĞİŞTİRİLEN** gereksinimler mevcut sürümü değiştirir.
3. **KALDIRILAN** gereksinimler ana speçten silinir.

Değişiklik klasörü, denetim geçmişi için `openspec/changes/archive/` konumuna taşınır.

## Örnek: İlk Değişikliğiniz

Bir uygulamaya karanlık mod ekleme sürecini inceleyelim.

### 1. Değişikliği Başlatma (Varsayılan)

```text
Siz: /opsx:propose add-dark-mode

AI:  openspec/changes/add-dark-mode/ oluşturuldu
     ✓ proposal.md — neden bunu yaptığımız, ne değişiyor
     ✓ specs/       — gereksinimler ve senaryolar
     ✓ design.md    — teknik yaklaşım
     ✓ tasks.md     — uygulama kontrol listesi
     Uygulamaya hazır!
```

Genişletilmiş iş akışı profilini etkinleştirdiyseniz, bunu iki adım olarak da yapabilirsiniz: `/opsx:new` ardından `/opsx:ff` (veya kademeli olarak `/opsx:continue`).

### 2. Ne Oluşturulur?

**proposal.md** - Niyeti yakalar:

```markdown
# Öneri: Karanlık Mod Ekleme

## Amaç
Kullanıcılar, gece kullanımı sırasında göz yorgunluğunu azaltmak için karanlık mod seçeneği talep etti.

## Kapsam
- Ayarlarda tema anahtarı ekleme
- Sistem tercihi algılamayı destekleme
- Tercihi localStorage'da kalıcı hale getirme

## Yaklaşım
Durum yönetimi için bir React bağlamı ile temalandırma amacıyla CSS özel özelliklerini kullanma.
```

**specs/ui/spec.md** - Yeni gereksinimleri gösteren Delta:

```markdown
# UI İçin Delta

## EKlenen Gereksinimler

### Gereksinim: Tema Seçimi
Sistem, kullanıcıların açık ve koyu temalar arasında seçim yapmasına izin vermelidir.

#### Senaryo: Manuel anahtar
- VERİLEN: Herhangi bir sayfadaki bir kullanıcı
- DÜŞÜNÜLEN: Kullanıcı tema anahtarına tıkladığında
- SONUÇ: Tema hemen değişir
- VE tercih oturumlar arasında kalıcı olur

#### Senaryo: Sistem tercihi
- VERİLEN: Kaydedilmiş tercihi olmayan bir kullanıcı
- DÜŞÜNÜLEN: Uygulama yüklendiğinde
- SONUÇ: Sistemin tercih edilen renk şeması kullanılır
```

**tasks.md** - Uygulama kontrol listesi:

```markdown
# Görevler

## 1. Tema Altyapısı
- [ ] 1.1 light/dark durumu ile ThemeContext oluşturma
- [ ] 1.2 Renklar için CSS özel özelliklerini ekleme
- [ ] 1.3 localStorage kalıcılığını uygulama

## 2. UI Bileşenleri
- [ ] 2.1 ThemeToggle bileşeni oluşturma
- [ ] 2.2 Ayarlar sayfasına anahtar ekleme
- [ ] 2.3 Hızlı anahtarı içerecek şekilde Başlığı güncelleme

## 3. Stil
- [ ] 3.1 Koyu tema renk paletini tanımlama
- [ ] 3.2 Bileşenleri CSS değişkenlerini kullanacak şekilde güncelleme
```

### 3. Uygulama

```
Siz: /opsx:apply

AI:  Görevler üzerinde çalışılıyor...
     ✓ 1.1 light/dark durumu ile ThemeContext oluşturuldu
     ✓ 1.2 globals.css'e CSS özel özellikleri eklendi
     ✓ 1.3 localStorage kalıcılığı uygulandı
     ✓ 2.1 ThemeToggle bileşeni oluşturuldu
     ...
     Tüm görevler tamamlandı!
```

Uygulama sırasında tasarımın ayarlanması gerektiğini keşfederseniz, sadece artefaktı güncelleyin ve devam edin.

### 4. Arşivleme

```
Siz: /opsx:archive

AI:  add-dark-mode arşivleniyor...
     ✓ specs openspec/specs/ui/spec.md içine birleştirildi
     ✓ openspec/changes/archive/2025-01-24-add-dark-mode/ konumuna taşındı
     Bitti! Sonraki özellik için hazır.
```

Delta specs'iniz artık sisteminizin nasıl çalıştığını belgeleyen ana speçin bir parçasıdır.

## Doğrulama ve İnceleme

Değişikliklerinizi kontrol etmek için CLI kullanın:

```bash
# Aktif değişiklikleri listele
openspec list

# Değişiklik detaylarını görüntüle
openspec show add-dark-mode

# Spec formatını doğrula
openspec validate add-dark-mode

# Etkileşimli gösterge tablosu
openspec view
```

## Sonraki Adımlar

- [Önce Keşfet](explore.md) - Taahhüt vermeden önce bir fikri düşünmek için `/opsx:explore` kullanın
- [Mevcut Bir Projede OpenSpec Kullanma](existing-projects.md) - Büyük, eski bir kod tabanında başlayın
- [Bir Değişikliği Düzenleme ve Yineleme](editing-changes.md) - Artefaktları güncelleyin, geri dönün, manuel düzenlemeleri uzlaştırın
- [Temel Kavramlar Genel Bakışta](overview.md) - Tüm zihinsel model tek bir sayfada
- [Örnekler ve Tarifler](examples.md) - Gerçek değişiklikler, baştan sona
- [İş Akışları](workflows.md) - Ortak desenler ve her komutu ne zaman kullanacağınız
- [Komutlar](commands.md) - Tüm eğik çizgi komutlarının tam referansı
- [Kavramlar](concepts.md) - Specs, değişiklikler ve şemalar hakkında daha derinlemesine anlayış
- [Özelleştirme](customization.md) - OpenSpec'i kendi tarzınıza göre yapın
- [Depolar](stores-beta/user-guide.md) - Tekil depoları veya ekipleri kapsayan planlama mı? Kendi deposunda tutun (beta)
- [SSS](faq.md) ve [Sorun Giderme](troubleshooting.md) - Takıldığınızda