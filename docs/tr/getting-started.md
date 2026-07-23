# Başlarken

Bu kılavuz, OpenSpec'ı kurduğunuz ve başlattığınız sonra nasıl çalıştığını açıklar. Kurulum talimatları için [ana README](../index.md#quick-start) veya [Kurulum kılavuzuna](installation.md) bakın. Tüm belge setine yeni misiniz? [Belge ana sayfası](index.md) her şeyi haritalıyor.

> **Bu komutları nerede yazacağım?** İki yer var ve bunları karıştırmak en yaygın erken hata.
>
> - `openspec ...` komutları (örneğin `openspec init`) **terminalinizde** çalışır.
> - `/opsx:...` komutları (örneğin `/opsx:propose`) **yapay zeka asistanınızın sohbetinde**, koda yazmasını istediğiniz aynı kutuda çalışır.
>
> Ayrı bir "etkileşimli mod" başlatmanız gerekmez. Slash komutunu sohbete yazarsınız ve asistanınız gerisini halleder. Tam açıklama: [Komutlar Nasıl Çalışır](how-commands-work.md).

## İlk Beş Dakikanız

Her adımın nerede gerçekleştiği ile etiketlenmiş tüm döngü:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (isteğe bağlı: önce düşünerek başla)
AI CHAT      /opsx:propose add-dark-mode      (Yapay zeka planı tasarlar; siz incelersiniz)
AI CHAT      /opsx:apply                      (Yapay zeka oluşturur)
AI CHAT      /opsx:archive                    (spec'ler güncellendi, değişiklik arşivlendi)
```

Kurulum için iki terminal adımı, sonra sohbette yaşarsınız. Bu kılavuzun geri kalanı, her adımın ne yaptığını ve ne göreceğinizi açıklayacaktır.

> **Henüz ne yapacağınızı bilmiyor musunuz? `/opsx:explore` ile başlayın.** Kod tabanınızı okuyan, seçenekleri değerlendiren ve bulanık bir fikri somut bir plana dönüştüren, hiçbir eser veya kod oluşturulmadan önce düşünme ortağınızdır. Resim netleştiğinde, `/opsx:propose`'a devreder. Bu, aksi takdirde kendinden emin bir şekilde yanlış şeyi yapacak olan bir yapay zeka ile çalışırken alabileceğiniz en iyi alışkanlıktır. [Keşif kılavuzuna](explore.md) bakın.

## Nasıl Çalışır

OpenSpec, herhangi bir kod yazılmadan önce yapay zeka kodlama asistanınızla ne yapacağınız konusunda anlaşmanıza yardımcı olur.

**Varsayılan hızlı yol (çekirdek profil):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (isteğe bağlı)
```

Ne yapacağınızı anlamaya çalışıyorsanız `/opsx:explore` ile başlayın, ya da zaten biliyorsanız doğrudan `/opsx:propose`'a geçin. Keşif varsayılan profilde olduğu için istediğinizde her zaman oradadır.

**Genişletilmiş yol (özel iş akışı seçimi):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Varsayılan global profil `core`'dur ve `propose`, `explore`, `apply`, `sync` ve `archive` içerir. Genişletilmiş iş akışı komutlarını `openspec config profile` ve ardından `openspec update` ile etkinleştirebilirsiniz.

## OpenSpec Ne Oluşturur

`openspec init` komutunu çalıştırdıktan sonra projenizde şu yapı bulunur:

```
openspec/
├── specs/              # Tek gerçek kaynak (sisteminizin davranışı)
│   └── <domain>/
│       └── spec.md
├── changes/            # Önerilen güncellemeler (değişiklik başına bir klasör)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta spec'ler (değişen şeyler)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Proje yapılandırması (isteğe bağlı)
```

**İki ana dizin:**

- **`specs/`** - Tek gerçek kaynak. Bu spec'ler sisteminizin şu anda nasıl davrandığını açıklar. Etki alanına göre düzenlenir (örneğin, `specs/auth/`, `specs/payments/`).
- **`changes/`** - Önerilen değişiklikler. Her değişiklik, ilgili tüm eserlerle birlikte kendi klasörünü alır. Bir değişiklik tamamlandığında, spec'leri ana `specs/` dizinine birleştirilir.

## Eserleri Anlamak

Her değişiklik klasörü, çalışmayı yönlendiren eserleri içerir:

| Eser | Amaç |
|----------|---------|
| `proposal.md` | "Neden" ve "Ne" - niyet, kapsam ve yaklaşımı yakalar |
| `specs/` | EKLENEN/DÜZENLENEN/KALDIRILAN gereksinimleri gösteren delta spec'ler |
| `design.md` | "Nasıl" - teknik yaklaşım ve mimari kararlar |
| `tasks.md` | Onay kutuları içeren uygulama kontrol listesi |

**Eserler birbirini tamamlar:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            daha fazla şey öğrendikçe güncelleyin
```

Uygulama sırasında daha fazla şey öğrendikçe daha önceki eserleri her zaman geri gidip iyileştirebilirsiniz.

## Delta Spec'ler Nasıl Çalışır

Delta spec'ler OpenSpec'ın anahtar kavramıdır. Mevcut spec'lerinize göre neyin değiştiğini gösterirler.

### Format

Delta spec'ler, değişiklik türünü belirtmek için bölümler kullanır:

```markdown
# Auth için Delta

## EKLENEN Gereksinimler

### Gereksinim: İki Faktörlü Kimlik Doğrulama
Sistem, giriş sırasında ikinci bir faktör gerektirmelidir.

#### Senaryo: OTP gerekli
- VERİLEN: 2FA etkin bir kullanıcı
- NE ZAMAN: Kullanıcı geçerli kimlik bilgilerini gönderir
- O ZAMAN: Bir OTP sorgusu sunulur

## DÜZENLENEN Gereksinimler

### Gereksinim: Oturum Zaman Aşımı
Sistem, 30 dakika etkinlik olmadan oturumları sonlandırmalıdır.
(Önceki: 60 dakika)

#### Senaryo: Boşta kalma zaman aşımı
- VERİLEN: Kimliği doğrulanmış bir oturum
- NE ZAMAN: 30 dakika etkinlik olmadan geçer
- O ZAMAN: Oturum geçersizdir

## KALDIRILAN Gereksinimler

### Gereksinim: Beni Hatırla
(2FA lehine kullanım dışı bırakıldı)
```

### Arşivleme Sırasında Ne Olur

Bir değişikliği arşivlediğinizde:
1. **EKLENEN** gereksinimler ana spec'e eklenir
2. **DÜZENLENEN** gereksinimler mevcut sürümü değiştirir
3. **KALDIRILAN** gereksinimler ana spec'ten silinir

Değişiklik klasörü, denetim geçmişi için `openspec/changes/archive/` dizinine taşınır.

## Örnek: İlk Değişliğiniz

Bir uygulamaya karanlık mod eklemek için adımları izleyelim.

### 1. Değişikliği Başlat (Varsayılan)

```text
Siz: /opsx:propose add-dark-mode

Yapay Zeka:  openspec/changes/add-dark-mode/ oluşturuldu
     ✓ proposal.md — bunu neden yaptığımız, neyin değiştiği
     ✓ specs/       — gereksinimler ve senaryolar
     ✓ design.md    — teknik yaklaşım
     ✓ tasks.md     — uygulama kontrol listesi
     Uygulamaya hazır!
```

Genişletilmiş iş akışı profilini etkinleştirdiyseniz bunu iki adımda da yapabilirsiniz: önce `/opsx:new` sonra `/opsx:ff` (ya da artımlı olarak `/opsx:continue`).

### 2. Ne Oluşturulur

**proposal.md** - Niyeti yakalar:

```markdown
# Öneri: Karanlık Mod Ekle

## Niyet
Kullanıcılar, gece kullanımı sırasında göz yorgunluğunu azaltmak için karanlık mod seçeneği talep ettiler.

## Kapsam
- Ayarlara tema değiştirici ekle
- Sistem tercihi algılama desteği
- Tercihi localStorage'da kalıcı olarak sakla

## Yaklaşım
Durum yönetimi için React context ile birlikte temalandırma için CSS özel özelliklerini kullan.
```

**specs/ui/spec.md** - Yeni gereksinimleri gösteren delta:

```markdown
# UI için Delta

## EKLENEN Gereksinimler

### Gereksinim: Tema Seçimi
Sistem, kullanıcıların açık ve karanlık temalar arasında seçim yapmasına izin vermelidir.

#### Senaryo: Manuel değiştirici
- VERİLEN: Herhangi bir sayfadaki kullanıcı
- NE ZAMAN: Kullanıcı tema değiştiricisine tıklar
- O ZAMAN: Tema hemen değişir
- VE: Tercih oturumlar arasında kalıcı olarak saklanır

#### Senaryo: Sistem tercihi
- VERİLEN: Kayıtlı tercihi olmayan kullanıcı
- NE ZAMAN: Uygulama yüklenir
- O ZAMAN: Sistemin tercih ettiği renk düzeni kullanılır
```

**tasks.md** - Uygulama kontrol listesi:

```markdown
# Görevler

## 1. Tema Altyapısı
- [ ] 1.1 Açık/karanlık durumuyla ThemeContext oluştur
- [ ] 1.2 Renkler için CSS özel özellikleri ekle
- [ ] 1.3 localStorage kalıcılığını uygula

## 2. UI Bileşenleri
- [ ] 2.1 ThemeToggle bileşeni oluştur
- [ ] 2.2 Ayarlar sayfasına değiştirici ekle
- [ ] 2.3 Hızlı değiştirici eklemek için Header'ı güncelle

## 3. Stil
- [ ] 3.1 Karanlık tema renk paletini tanımla
- [ ] 3.2 Bileşenleri CSS değişkenlerini kullanacak şekilde güncelle
```

### 3. Uygula

```text
Siz: /opsx:apply

Yapay Zeka:  Görevler üzerinden çalışılıyor...
     ✓ 1.1 Açık/karanlık durumuyla ThemeContext oluşturuldu
     ✓ 1.2 globals.css'e CSS özel özellikleri eklendi
     ✓ 1.3 localStorage kalıcılığı uygulandı
     ✓ 2.1 ThemeToggle bileşeni oluşturuldu
     ...
     Tüm görevler tamamlandı!
```

Uygulama sırasında tasarımın ayarlanması gerektiğini keşfederseniz, sadece eseri güncelleyin ve devam edin.

### 4. Arşivle

```text
Siz: /opsx:archive

Yapay Zeka:  add-dark-mode arşivleniyor...
     ✓ Spec'ler openspec/specs/ui/spec.md dosyasına birleştirildi
     ✓ openspec/changes/archive/2025-01-24-add-dark-mode/ dizinine taşındı
     Tamam! Sonraki özellik için hazır.
```

Delta spec'leriniz artık ana spec'lerin bir parçası, sisteminizin nasıl çalıştığını belgeleyen.

## Doğrulama ve İnceleme

Değişikliklerinizi kontrol etmek için CLI'yi kullanın:

```bash
# Aktif değişiklikleri listele
openspec list

# Değişiklik detaylarını görüntüle
openspec show add-dark-mode

# Spec biçimlendirmesini doğrula
openspec validate add-dark-mode

# Etkileşimli kontrol paneli
openspec view
```

## Sonraki Adımlar

- [Önce Keşfet](explore.md) - Bir fikri taahhüt etmeden önce düşünmek için `/opsx:explore` kullanın
- [Bir Değişikliği İnceleme](reviewing-changes.md) - Herhangi bir kod yazılmadan önce yapay zekanın tasarladığı planda neye bakmanız gerektiği
- [İyi Spec'ler Yazma](writing-specs.md) - Güçlü bir gereksinim ve senaryonun nasıl göründüğü
- [Mevcut Bir Projede OpenSpec Kullanma](existing-projects.md) - Büyük kahverengi alan (brownfield) kod tabanında çalışmaya başlama
- [Bir Değişikliği Düzenleme ve İyileştirme](editing-changes.md) - Eserleri güncelleme, geri dönme, elle yapılan düzenlemeleri uzlaştırma
- [Bir Bakışta Çekirdek Kavramlar](overview.md) - Tüm zihinsel model tek sayfada
- [Örnekler ve Tarifler](examples.md) - Gerçek değişiklikler, baştan sona
- [İş Akışları](workflows.md) - Yaygın kalıplar ve her komutu ne zaman kullanmanız gerektiği
- [Komutlar](commands.md) - Tüm slash komutları için tam referans
- [Kavramlar](concepts.md) - Spec'ler, değişiklikler ve şemalar hakkında daha derin anlayış
- [Özelleştirme](customization.md) - OpenSpec'ı kendi istediğiniz şekilde çalıştırın
- [Mağazalar](stores-beta/user-guide.md) - Depolar veya ekipler arasında yayılan planlama mı? Kendi deposunda tutun (beta)
- [SSS](faq.md) ve [Sorun Giderme](troubleshooting.md) - Takılıp kaldığınızda