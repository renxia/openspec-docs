# Başlarken

Bu kılavuz, OpenSpec'i yükledikten ve başlattıktan sonra nasıl çalıştığını açıklar. Kurulum talimatları için [ana README](index.md#quick-start) sayfasına bakın.

## Nasıl Çalışır

OpenSpec, herhangi bir kod yazılmadan önce neyin inşa edileceği konusunda siz ve yapay zeka kodlama asistanınızın anlaşmanıza yardımcı olur.

**Varsayılan hızlı yol (çekirdek profil):**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

**Genişletilmiş yol (özel iş akışı seçimi):**

```text
/opsx:new ──► /opsx:ff veya /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Varsayılan global profil `core`'dur ve `propose`, `explore`, `apply`, `sync` ve `archive` komutlarını içerir. Genişletilmiş iş akışı komutlarını `openspec config profile` ve ardından `openspec update` komutlarıyla etkinleştirebilirsiniz.

## OpenSpec Ne Oluşturur

`openspec init` komutunu çalıştırdıktan sonra projenizde şu yapı oluşur:

```
openspec/
├── specs/              # Doğruluk kaynağı (sisteminizin davranışı)
│   └── <domain>/
│       └── spec.md
├── changes/            # Önerilen güncellemeler (her değişiklik için bir klasör)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta spesifikasyonları (ne değişiyor)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Proje yapılandırması (isteğe bağlı)
```

**İki ana dizin:**

- **`specs/`** - Doğruluk kaynağı. Bu spesifikasyonlar sisteminizin şu anki davranışını tanımlar. Alana göre organize edilir (ör. `specs/auth/`, `specs/payments/`).

- **`changes/`** - Önerilen değişiklikler. Her değişiklik, tüm ilgili eserlerle birlikte kendi klasörünü alır. Bir değişiklik tamamlandığında, spesifikasyonları ana `specs/` dizinine birleşir.

## Eserlerin Anlaşılması

Her değişiklik klasörü, çalışmayı yönlendiren eserler içerir:

| Eser | Amaç |
|------|------|
| `proposal.md` | "Neden" ve "ne" - amacı, kapsamı ve yaklaşımı yakalar |
| `specs/` | EKLENEN/DEĞİŞTİRİLEN/KALDIRILAN gereksinimleri gösteren delta spesifikasyonları |
| `design.md` | "Nasıl" - teknik yaklaşım ve mimari kararlar |
| `tasks.md` | Onay kutuları ile uygulama kontrol listesi |

**Eserler birbirinin üzerine inşa edilir:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            öğrendikçe güncelle
```

Uygulama sırasında daha fazla şey öğrendikçe her zaman geri dönüp önceki eserleri iyileştirebilirsiniz.

## Delta Spesifikasyonları Nasıl Çalışır

Delta spesifikasyonları, OpenSpec'in temel kavramıdır. Mevcut spesifikasyonlarınıza göre neyin değiştiğini gösterirler.

### Biçim

Delta spesifikasyonları, değişiklik türünü belirtmek için bölümler kullanır:

```markdown
# Auth için Delta

## EKLENEN Gereksinimler

### Gereksinim: İki Faktörlü Kimlik Doğrulama
Sistem, giriş sırasında ikinci bir faktör ZORUNLU kılmalıdır.

#### Senaryo: OTP gerekli
- 2FA etkin bir kullanıcı VERİLDİĞİNDE
- Kullanıcı geçerli kimlik bilgilerini GÖNDERDİĞİNDE
- BİR OTP mücadelesi SUNULUR

## DEĞİŞTİRİLEN Gereksinimler

### Gereksinim: Oturum Zaman Aşımı
Sistem, 30 dakikalık hareketsizlikten sonra oturumları SONA ERDİRMELİDİR.
(Önceden: 60 dakika)

#### Senaryo: Boşta kalma zaman aşımı
- Kimliği doğrulanmış bir oturum VERİLDİĞİNDE
- Hareketsiz 30 dakika GEÇTİĞİNDE
- Oturum GEÇERSİZ kılınır

## KALDIRILAN Gereksinimler

### Gereksinim: Beni Hatırla
(2FA lehine kullanımdan kaldırıldı)
```

### Arşivlemede Ne Olur

Bir değişikliği arşivlediğinizde:

1. **EKLENEN** gereksinimler ana spesifikasyona eklenir
2. **DEĞİŞTİRİLEN** gereksinimler mevcut sürümün yerini alır
3. **KALDIRILAN** gereksinimler ana spesifikasyondan silinir

Değişiklik klasörü, denetim geçmişi için `openspec/changes/archive/` dizinine taşınır.

## Örnek: İlk Değişikliğiniz

Bir uygulamaya karanlık mod eklemeyi adım adım inceleyelim.

### 1. Değişikliği Başlat (Varsayılan)

```text
Siz: /opsx:propose add-dark-mode

AI:  openspec/changes/add-dark-mode/ oluşturuldu
     ✓ proposal.md — neden bunu yapıyoruz, ne değişiyor
     ✓ specs/       — gereksinimler ve senaryolar
     ✓ design.md    — teknik yaklaşım
     ✓ tasks.md     — uygulama kontrol listesi
     Uygulamaya hazır!
```

Genişletilmiş iş akışı profilini etkinleştirdiyseniz, bunu iki adımda da yapabilirsiniz: `/opsx:new` ardından `/opsx:ff` (veya adım adım `/opsx:continue`).

### 2. Neler Oluşturulur

**proposal.md** - Amacı yakalar:

```markdown
# Öneri: Karanlık Mod Ekle

## Amaç
Kullanıcılar, gece kullanımı sırasında göz yorgunluğunu azaltmak için
bir karanlık mod seçeneği talep etti.

## Kapsam
- Ayarlara tema geçişi ekle
- Sistem tercihi algılamasını destekle
- Tercihi localStorage'da sakla

## Yaklaşım
Durum yönetimi için bir React context ile temalandırma için
CSS özel özellikleri kullan.
```

**specs/ui/spec.md** - Yeni gereksinimleri gösteren delta:

```markdown
# UI için Delta

## EKLENEN Gereksinimler

### Gereksinim: Tema Seçimi
Sistem, kullanıcıların açık ve karanlık temalar arasında seçim yapmasına İZİN VERMELİDİR.

#### Senaryo: Manuel geçiş
- Herhangi bir sayfadaki bir kullanıcı VERİLDİĞİNDE
- Kullanıcı tema geçişine TIKLADIĞINDA
- Tema HEMEN değişir
- VE tercih oturumlar arasında KALICI olur

#### Senaryo: Sistem tercihi
- Kayıtlı tercihi olmayan bir kullanıcı VERİLDİĞİNDE
- Uygulama YÜKLENDİĞİNDE
- Sistemin tercih ettiği renk şeması KULLANILIR
```

**tasks.md** - Uygulama kontrol listesi:

```markdown
# Görevler

## 1. Tema Altyapısı
- [ ] 1.1 Açık/karanlık durumlu ThemeContext oluştur
- [ ] 1.2 Renkler için CSS özel özellikleri ekle
- [ ] 1.3 localStorage kalıcılığını uygula

## 2. UI Bileşenleri
- [ ] 2.1 ThemeToggle bileşeni oluştur
- [ ] 2.2 Ayarlar sayfasına geçiş ekle
- [ ] 2.3 Hızlı geçiş eklemek için Header'ı güncelle

## 3. Stil
- [ ] 3.1 Karanlık tema renk paletini tanımla
- [ ] 3.2 Bileşenleri CSS değişkenlerini kullanacak şekilde güncelle
```

### 3. Uygula

```
Siz: /opsx:apply

AI:  Görevler üzerinde çalışılıyor...
     ✓ 1.1 Açık/karanlık durumlu ThemeContext oluşturuldu
     ✓ 1.2 globals.css'e CSS özel özellikleri eklendi
     ✓ 1.3 localStorage kalıcılığı uygulandı
     ✓ 2.1 ThemeToggle bileşeni oluşturuldu
     ...
     Tüm görevler tamamlandı!
```

Uygulama sırasında tasarımın ayarlanması gerektiğini keşfederseniz, eseri güncelleyip devam edin.

### 4. Arşivle

```
Siz: /opsx:archive

AI:  add-dark-mode arşivleniyor...
     ✓ Spesifikasyonlar openspec/specs/ui/spec.md'ye birleştirildi
     ✓ openspec/changes/archive/2025-01-24-add-dark-mode/ dizinine taşındı
     Bitti! Sonraki özellik için hazır.
```

Delta spesifikasyonlarınız artık sisteminizin nasıl çalıştığını belgeleyen ana spesifikasyonların bir parçasıdır.

## Doğrulama ve İnceleme

Değişikliklerinizi kontrol etmek için CLI'ı kullanın:

```bash
# Aktif değişiklikleri listele
openspec list

# Değişiklik ayrıntılarını görüntüle
openspec show add-dark-mode

# Spesifikasyon biçimlendirmesini doğrula
openspec validate add-dark-mode

# Etkileşimli kontrol paneli
openspec view
```

## Sonraki Adımlar

- [İş Akışları](workflows.md) - Yaygın kalıplar ve her komutun ne zaman kullanılacağı
- [Komutlar](commands.md) - Tüm eğik çizgi komutları için tam referans
- [Kavramlar](concepts.md) - Spesifikasyonlar, değişiklikler ve şemalar hakkında daha derin anlayış
- [Özelleştirme](customization.md) - OpenSpec'i kendi yolunuzla çalıştırın