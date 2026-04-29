# Başlangıç

Bu kılavuz, OpenSpec'i kurduktan ve başlattıktan sonra nasıl çalıştığını açıklar. Kurulum talimatları için [ana README](index.md#quick-start) dosyasına bakın.

## Nasıl Çalışır

OpenSpec, herhangi bir kod yazılmadan önce sizin ve yapay zeka kodlama asistanınızın ne inşa edeceğiniz konusunda anlaşmasına yardımcı olur.

**Varsayılan hızlı yol (çekirdek profili):**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:archive
```

**Genişletilmiş yol (özel iş akışı seçimi):**

```text
/opsx:new ──► /opsx:ff veya /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Varsayılan global profil `core`'dur ve `propose`, `explore`, `apply` ve `archive` komutlarını içerir. Genişletilmiş iş akışı komutlarını `openspec config profile` ve ardından `openspec update` ile etkinleştirebilirsiniz.

## OpenSpec'in Oluşturdukları

`openspec init` komutunu çalıştırdıktan sonra projeniz şu yapıya sahip olur:

```
openspec/
├── specs/              # Hakikat kaynağı (sisteminizin davranışı)
│   └── <alan>/
│       └── spec.md
├── changes/            # Önerilen güncellemeler (değişiklik başına bir klasör)
│   └── <değişiklik-adı>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta spesifikasyonları (değişen kısım)
│           └── <alan>/
│               └── spec.md
└── config.yaml         # Proje yapılandırması (isteğe bağlı)
```

**İki önemli dizin:**

- **`specs/`** - Hakikat kaynağı. Bu spesifikasyonlar, sisteminizin şu anki davranışını tanımlar. Alana göre düzenlenir (ör. `specs/auth/`, `specs/payments/`).

- **`changes/`** - Önerilen değişiklikler. Her değişiklik, ilgili tüm varlıkları içeren bir klasör alır. Bir değişiklik tamamlandığında, spesifikasyonları ana `specs/` dizinine birleştirilir.

## Varlıkları Anlamak

Her değişiklik klasörü, çalışmayı yönlendiren varlıklar içerir:

| Varlık | Amaç |
|----------|---------|
| `proposal.md` | "Neden" ve "Ne" - niyeti, kapsamı ve yaklaşımı yakalar |
| `specs/` | EKLENEN/DEĞİŞTİRİLEN/SİLİNEN gereksinimleri gösteren delta spesifikasyonları |
| `design.md` | "Nasıl" - teknik yaklaşım ve mimari kararlar |
| `tasks.md` | Onay kutuları ile uygulama kontrol listesi |

**Varlıklar birbirini tamamlar:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            öğrendikçe güncelle
```

Uygulama sırasında daha fazla şey öğrendikçe her zaman geri dönüp önceki varlıkları geliştirebilirsiniz.

## Delta Spesifikasyonları Nasıl Çalışır

Delta spesifikasyonları, OpenSpec'teki temel kavramdır. Mevcut spesifikasyonlarınıza göre neyin değiştiğini gösterirler.

### Biçim

Delta spesifikasyonları, değişiklik türünü belirtmek için bölümler kullanır:

```markdown
# Auth için Delta

## EKLENEN Gereksinimler

### Gereksinim: İki Faktörlü Kimlik Doğrulama
Sistem, giriş sırasında ikinci bir faktör gerektirmelidir.

#### Senaryo: OTP gerekli
- VERİLDİ 2FA etkin bir kullanıcı
- NE ZAMAN kullanıcı geçerli kimlik bilgilerini gönderir
- SONRA bir OTP doğrulaması sunulur

## DEĞİŞTİRİLEN Gereksinimler

### Gereksinim: Oturum Zaman Aşımı
Sistem, 30 dakikalık hareketsizlikten sonra oturumları sona erdirmelidir.
(Önceden: 60 dakika)

#### Senaryo: Boşta kalma zaman aşımı
- VERİLDİ kimliği doğrulanmış bir oturum
- NE ZAMAN aktivite olmadan 30 dakika geçer
- SONRA oturum geçersiz kılınır

## SİLİNEN Gereksinimler

### Gereksinim: Beni Hatırla
(2FA lehine kullanımdan kaldırıldı)
```

### Arşivleme Sırasında Ne Olur

Bir değişikliği arşivlediğinizde:

1. **EKLENEN** gereksinimler ana spesifikasyona eklenir
2. **DEĞİŞTİRİLEN** gereksinimler mevcut sürümü değiştirir
3. **SİLİNEN** gereksinimler ana spesifikasyondan silinir

Değişiklik klasörü, denetim geçmişi için `openspec/changes/archive/` dizinine taşınır.

## Örnek: İlk Değişikliğiniz

Bir uygulamaya karanlık mod eklemeyi inceleyelim.

### 1. Değişikliği Başlatın (Varsayılan)

```text
Siz: /opsx:propose add-dark-mode

Yapay Zeka:  openspec/changes/add-dark-mode/ oluşturuldu
     ✓ proposal.md — bunu neden yapıyoruz, ne değişiyor
     ✓ specs/       — gereksinimler ve senaryolar
     ✓ design.md    — teknik yaklaşım
     ✓ tasks.md     — uygulama kontrol listesi
     Uygulamaya hazır!
```

Genişletilmiş iş akışı profilini etkinleştirdiyseniz, bunu iki adım olarak da yapabilirsiniz: `/opsx:new` ardından `/opsx:ff` (veya `/opsx:continue` ile kademeli olarak).

### 2. Oluşturulan Şeyler

**proposal.md** - Niyeti yakalar:

```markdown
# Öneri: Karanlık Mod Ekleme

## Niyet
Kullanıcılar, gece kullanımı sırasında göz yorgunluğunu azaltmak için bir karanlık mod seçeneği talep etmişlerdir.

## Kapsam
- Ayarlarda tema geçişi ekleme
- Sistem tercihi algılamayı destekleme
- Tercihi localStorage'da saklama

## Yaklaşım
Tema oluşturmak için CSS özel değişkenleri ve durum yönetimi için React bağlamı kullanın.
```

**specs/ui/spec.md** - Yeni gereksinimleri gösteren delta:

```markdown
# UI için Delta

## EKLENEN Gereksinimler

### Gereksinim: Tema Seçimi
Sistem, kullanıcıların açık ve karanlık temalar arasında seçim yapmasına izin vermelidir.

#### Senaryo: Manuel geçiş
- VERİLDİ herhangi bir sayfadaki bir kullanıcı
- NE ZAMAN kullanıcı tema geçişine tıklar
- SONRA tema hemen değişir
- VE tercih oturumlar arası korunur

#### Senaryo: Sistem tercihi
- VERİLDİ kayıtlı tercihi olmayan bir kullanıcı
- NE ZAMAN uygulama yüklenir
- SONRA sistemin tercih edilen renk şeması kullanılır
```

**tasks.md** - Uygulama kontrol listesi:

```markdown
# Görevler

## 1. Tema Altyapısı
- [ ] 1.1 Açık/karanlık durumu ile ThemeContext oluştur
- [ ] 1.2 Renkler için CSS özel değişkenleri ekle
- [ ] 1.3 localStorage kalıcılığını uygula

## 2. UI Bileşenleri
- [ ] 2.1 ThemeToggle bileşeni oluştur
- [ ] 2.2 Geçişi ayarlar sayfasına ekle
- [ ] 2.3 Başlığa hızlı geçiş ekle

## 3. Stil
- [ ] 3.1 Karanlık tema renk paletini tanımla
- [ ] 3.2 Bileşenleri CSS değişkenlerini kullanacak şekilde güncelle
```

### 3. Uygulayın

```
Siz: /opsx:apply

Yapay Zeka:  Görevler üzerinde çalışıyor...
     ✓ 1.1 Açık/karanlık durumu ile ThemeContext oluşturuldu
     ✓ 1.2 globals.css'e CSS özel değişkenleri eklendi
     ✓ 1.3 localStorage kalıcılığı uygulandı
     ✓ 2.1 ThemeToggle bileşeni oluşturuldu
     ...
     Tüm görevler tamamlandı!
```

Uygulama sırasında tasarımın ayarlanması gerektiğini fark ederseniz, varlığı güncellemeye devam edin.

### 4. Arşivleyin

```
Siz: /opsx:archive

Yapay Zeka:  add-dark-mode arşivleniyor...
     ✓ Spesifikasyonlar openspec/specs/ui/spec.md dosyasına birleştirildi
     ✓ openspec/changes/archive/2025-01-24-add-dark-mode/ dizinine taşındı
     Tamam! Bir sonraki özellik için hazır.
```

Delta spesifikasyonlarınız artık ana spesifikasyonların bir parçası ve sisteminizin nasıl çalıştığını belgeliyor.

## Doğrulama ve İnceleme

Değişikliklerinizi kontrol etmek için komut satırı aracını kullanın:

```bash
# Aktif değişiklikleri listele
openspec list

# Değişiklik ayrıntılarını görüntüle
openspec show add-dark-mode

# Spesifikasyon biçimini doğrula
openspec validate add-dark-mode

# Etkileşimli kontrol paneli
openspec view
```

## Sonraki Adımlar

- [İş Akışları](workflows.md) - Yaygın kalıplar ve her komutun ne zaman kullanılacağı
- [Komutlar](commands.md) - Tüm eğik çizgi komutlarının tam referansı
- [Kavramlar](concepts.md) - Spesifikasyonlar, değişiklikler ve şemalar hakkında daha derin anlayış
- [Özelleştirme](customization.md) - OpenSpec'i kendi yolunuzla çalıştırın