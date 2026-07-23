# İş Akışları

Bu kılavuz, OpenSpec için yaygın iş akışı kalıplarını ve her birinin ne zaman kullanılacağını ele alır. Temel kurulum için [Başlarken](getting-started.md) belgesine, komut referansı için [Komutlar](commands.md) belgesine bakın.

## Felsefe: Eylemler, Aşamalar Değil

Geleneksel iş akışları sizi aşamalardan geçmeye zorlar: önce planlama, sonra uygulama, sonra bitti. Ancak gerçek iş çalışmaları kutucuklara tam olarak sığmaz.

OPSX farklı bir yaklaşım benimser:

```text
Geleneksel (aşama kilitli):

  PLANLAMA ────────► UYGULAMA ────────► BİTTİ
      │                    │
      │   "Geri dönülemez"  │
      └────────────────────┘

OPSX (akışkan eylemler):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Temel İlkeler:**

- **Eylemler, aşamalar değil** - Komutlar yapabileceğiniz şeylerdir, sıkılıp kaldığınız aşamalar değildir
- **Bağımlılıklar, imkan sağlayıcılardır** - Sıradaki zorunlu gereksinimleri değil, hangi adımların mümkün olduğunu gösterirler

> **Özelleştirme:** OPSX iş akışları, kalıp dizilerini tanımlayan şemalar tarafından yönlendirilir. Özel şema oluşturma hakkında ayrıntılı bilgi için [Özelleştirme](customization.md) belgesine bakın.

## İki Mod

### Varsayılan Hızlı Yol (`core` profili)

Yeni kurulumlar varsayılan olarak `core` profilini kullanır, bu da şunları sağlar:
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Tipik akış:

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (isteğe bağlı)
```

#### Keşfetmekle başlayın (edinilecek değerli bir alışkanlık)

`/opsx:explore`, varsayılan profilin bir parçasıdır, gelişmiş bir eklenti değildir. Bir sorununuz olduğu ancak henüz bir planınız olmadığında, yani bir AI asistanıyla çalıştığınızda çoğu zaman olduğu gibi, yapmanız gereken ilk hamledir.

```text
You: /opsx:explore

AI:  Ne keşfetmek istersiniz?

You: Arama sonuçlarımız eski gibi görünüyor. Nedeninin önbelleğe alma (caching),
     indeksleme mi yoksa sorgunun kendisi mi olduğundan emin değilim.

AI:  Bir bakayım... [arama servisini ve önbellek katmanını inceler]
     Sorun indeks: sadece geceleri yeniden oluşturuluyor, yani yapılan düzenlemeler ertesi güne kadar görünmüyor. İki seçenek var: yazma işlemi sırasında yeniden oluştur (basit, daha fazla yük) veya kısa TTL'li önbellek geçersizliği (daha fazla hareketli parça, daha az yük). Yazma hacminiz düşük olduğu için, yazma sırasında yeniden oluştur daha temiz bir çözüm. Kapsamını belirlemek ister misiniz?

You: Evet.

You: /opsx:propose rebuild-search-index-on-write
```

Keşif, hiçbir artifakt oluşturmaz ve kod yazmaz. Risksiz, hiçbir kayıp olmayan bir konuşmadır, belirsiz bir endişeyi kesin bir değişikliğe dönüştürür, böylece sonrasında gelen öneri de keskin ve net olur. Zaten istediğiniz şeyi tam olarak biliyor musunuz? Bu adımı atlayın ve doğrudan `/opsx:propose` komutuna gidin. Tam kılavuz: [Önce Keşfedin](explore.md).

### Genişletilmiş/Tam İş Akışı (özel seçim)

İskelet-oluşturma ve derleme komutlarını (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`) açıkça kullanmak istiyorsanız, şu komutlarla etkinleştirin:

```bash
openspec config profile
openspec update
```

## İş Akışı Modelleri (Genişletilmiş Mod)

### Hızlı Özellik

Yapmak istediğiniz şeyi biliyorsanız ve sadece uygulamaya başlamak istiyorsanız:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Örnek konuşma:**

```text
You: /opsx:new add-logout-button

AI:  openspec/changes/add-logout-button/ dizini oluşturuldu
     Oluşturmaya hazır: öneri

You: /opsx:ff

AI:  Tüm planlama artifaktları oluşturuluyor...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Uygulamaya hazır!

You: /opsx:apply

AI:  Görevler üzerinden geçiliyor...
     ✓ Çıkış butonu başlığa eklendi
     ✓ Oturum temizleme uygulandı
     ✓ Onay iletişim kutusu eklendi
     Tüm görevler tamamlandı!

You: /opsx:archive

AI:  ✓ Spec'lar birleştirildi
     ✓ Değişiklik arşivlendi
```

**En iyi kullanım alanı:** Küçük ve orta ölçekli özellikler, hata düzeltmeleri, basit değişiklikler.

### Keşifsel

Gereksinimler belirsizse veya önce araştırma yapmanız gerekiyorsa:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Örnek konuşma:**

```text
You: /opsx:explore

AI:  Ne keşfetmek istersiniz?

You: Sayfa yükleme performansını artırmak istiyorum ancak darboğazların nerede olduğundan emin değilim.

AI:  Araştırmanıza yardımcı olayım...
     [Paket boyutlarını analiz eder, yavaş sorguları belirler, bileşen render kalıplarını gözden geçirir]

     Üç ana darboğaz buldum:
     1. Optimize edilmemiş büyük görseller
     2. ProductList içindeki senkron veri çekme
     3. Bağlam değişikliklerinden kaynaklanan yeniden render işlemleri

     Önce hangisini ele almak istersiniz?

You: Veri çekme konusunu ele alalım.

You: /opsx:new optimize-product-list-fetching

AI:  Değişiklik oluşturuldu. Oluşturmaya hazır: öneri

You: /opsx:continue

AI:  Keşif çalışmamızı temel alan öneri oluşturuluyor...
     [Araştırma bulgularını içeren öneriyi yazar]

     Oluşturmaya hazır: spec'lar, tasarım
     Sonra ne yapmak istersiniz?

You: /opsx:continue

AI:  Spec'lar oluşturuluyor...
```

**En iyi kullanım alanı:** Performans optimizasyonu, hata ayıklama, mimari kararları, belirsiz gereksinimler.

### Paralel Değişiklikler

Aynı anda birden fazla değişiklik üzerinde çalışın:

```text
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (devam ediyor)
                                         │
                                    bağlam değiştirme
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Örnek konuşma:**

```text
You: add-dark-mode üzerinde çalışıyordum ama bir hata düzeltmesi için yönlendirildim

You: /opsx:new fix-login-redirect

AI:  openspec/changes/fix-login-redirect/ dizini oluşturuldu

You: /opsx:ff

AI:  ✓ Planlama artifaktları oluşturuldu

You: /opsx:apply

AI:  fix-login-redirect üzerinde çalışılıyor...
     [Düzeltmeyi uygular]
     Tüm görevler tamamlandı!

You: /opsx:archive

AI:  ✓ fix-login-redirect arşivlendi

You: Hadi karanlık moda geri dönelim

You: /opsx:apply add-dark-mode

AI:  add-dark-mode devam ettiriliyor...
     2.3 görevine devam ediliyor: Başlığı Güncelle...
```

**En iyi kullanım alanı:** Paralel iş akışları, acil kesintiler, ekip işbirlikleri.

Birden fazla tamamlanmış değişikliğiniz olduğunda `/opsx:bulk-archive` komutunu kullanın:

```text
You: /opsx:bulk-archive

AI:  3 tamamlanmış değişiklik bulundu:
     - add-dark-mode (tüm görevler tamamlandı)
     - fix-login-redirect (tüm görevler tamamlandı)
     - update-footer (tüm görevler tamamlandı)

     Spec çakışmaları kontrol ediliyor...
     ⚠ add-dark-mode ve update-footer her ikisi de specs/ui/ klasörünü etkiliyor

     Çakışmayı çözmek için kod tabanı inceleniyor...
     Her iki değişiklik de uygulanmış durumda. Kronolojik sırayla uygulanacak.

     Tüm 3 değişikliği arşivle?

You: Evet

AI:  ✓ add-dark-mode arşivlendi
     ✓ fix-login-redirect arşivlendi
     ✓ update-footer arşivlendi
     Spec'lar sırayla birleştirildi: add-dark-mode → update-footer
```

Toplu arşivleme, birden fazla değişikliğin aynı spec'lara dokunup dokunmadığını tespit eder ve gerçekten uygulanan şeyleri kontrol ederek çakışmaları çözer.

### Bir Değişikliği Tamamlama

Önerilen tamamlama akışı:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              uygulamayı          gerekirse senkronize
              doğrular            etmek için uyarı verir
```

#### Doğrula: Çalışmanızı Kontrol Edin

`/opsx:verify`, uygulamayı artifaktlarınızla üç boyutta doğrular:

```text
You: /opsx:verify

AI:  add-auth doğrulanıyor...

     TAMLIK
     ✓ tasks.md'deki tüm 12 görev işaretlendi
     ✓ Spec'lardaki tüm gereksinimlerin karşılık gelen kodu var
     ⚠ "İnaktiflik sonrası oturum zaman aşımı" senaryosu test edilmedi

     DOĞRULUK
     ✓ Uygulama, spec'ın amacıyla eşleşiyor
     ✓ Senaryolardaki kenar durumlar ele alındı
     ✓ Hata durumları spec tanımlarıyla eşleşiyor

     TUTARLILIK
     ✓ Tasarım kararları kod yapısında yansıtıldı
     ✓ İsimlendirme kuralları design.md ile tutarlı
     ⚠ Tasarımda "event-driven (olay temelli)" bahsedilmiş ancak uygulama polling (periyodik sorgulama) kullanıyor

     ÖZET
     ─────────────────────────────
     Kritik sorun: 0
     Uyarı: 2
     Arşivlemeye hazır: Evet (uyarılarla birlikte)

     Öneriler:
     1. İnaktiflik sonrası oturum zaman aşımı senaryosu için test ekleyin
     2. Tasarımda olduğu gibi olay temelli yapıya yeniden düzenlemeyi düşünün ya da design.md'yi güncelleyin
```

**Doğrulama neyi kontrol eder:**

| Boyut | Ne doğrulanır |
|-------|---------------|
| Tamlık | Tüm görevlerin tamamlanması, tüm gereksinimlerin uygulanması, senaryoların kapsanması |
| Doğruluk | Uygulamanın spec amacıyla eşleşmesi, kenar durumların ele alınması |
| Tutarlılık | Tasarım kararlarının kodda yansıtılması, kalıpların tutarlı olması |

Doğrulama, arşivlemeyi engellemez ancak önce ele almak istediğiniz sorunları ortaya çıkarır.

#### Arşivle: Değişikliği Sonlandırın

`/opsx:archive`, değişikliği tamamlar ve arşive taşır:

```text
You: /opsx:archive

AI:  add-auth arşivleniyor...

     Artifakt durumu:
     ✓ proposal.md mevcut
     ✓ specs/ mevcut
     ✓ design.md mevcut
     ✓ tasks.md mevcut (12/12 görev tamamlandı)

     Delta spec'lar: Ana dala henüz senkronize edilmedi
     → Şimdi senkronize etmek ister misiniz?

You: Evet

AI:  ✓ Spec'lar openspec/specs/auth/spec.md dosyasına senkronize edildi
     ✓ openspec/changes/archive/2025-01-24-add-auth/ dizinine taşındı

     Değişiklik başarıyla arşivlendi.
```

Arşivleme, spec'lar senkronize edilmediyse sizi uyarır. Tamamlanmamış görevler nedeniyle işlemi engellemez ancak size bir uyarı verir.

## Ne Zaman Neyi Kullanmalısınız

### `/opsx:ff` vs `/opsx:continue`

| Durum | Kullan |
|-------|-------|
| Gereksinimler net, derlemeye hazır | `/opsx:ff` |
| Keşif yapıyorsunuz, her adımı gözden geçirmek istiyorsunuz | `/opsx:continue` |
| Spec'lar oluşturulmadan önce öneriyi tekrar tekrar düzeltmek istiyorsunuz | `/opsx:continue` |
| Zaman baskısı var, hızlıca ilerlemek gerekiyor | `/opsx:ff` |
| Karmaşık bir değişiklik, kontrolü elinizde tutmak istiyorsunuz | `/opsx:continue` |

**Kural:** Tüm kapsamı önceden tarif edebiliyorsanız `/opsx:ff` kullanın. İlerlerken adım adım belirliyorsanız `/opsx:continue` kullanın.

### Güncelleme vs Yeniden Başlama Zamanı

Sık sorulan bir soru: Mevcut bir değişikliği güncellemek ne zaman uygun, ne zaman yeni bir değişiklik başlatmalısınız?

**Mevcut değişikliği güncelleştirin:**
- Aynı amaç, iyileştirilmiş uygulama
- Kapsam daralıyor (önce MVP, geri kalanı sonra)
- Öğrenme odaklı düzeltmeler (kod tabanı beklediğiniz gibi değil)
- Uygulama sırasında ortaya çıkan bulgulara dayalı tasarım ayarlamaları

**Yeni bir değişiklik başlatın:**
- Amaç temelinden değişti
- Kapsam tamamen farklı bir işe genişledi
- Orijinal değişiklik tek başına "tamamlandı" olarak işaretlenebilir
- Yama (patch) uygulamak açıklığa katarak daha çok karışıklığa neden olur

```text
                     ┌─────────────────────────────────────┐
                     │     Bu aynı iş mi?                  │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Aynı amaç mı?      %50'den fazla örtüşme var mı?      Orijinal değişiklik
          Aynı sorun mu?     Aynı kapsam mı?        bu değişiklikler olmadan
                 │                  │          "tamamlanabilir" mi?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      EVET              HAYIR EVET        HAYIR HAYIR         EVET
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    GÜNCELLE           YENİ GÜNCELLE     YENİ GÜNCELLE       YENİ
```

**Örnek: "Karanlık mod ekle"**
- "Özel temaları da desteklemek gerekiyor" → Yeni değişiklik (kapsam genişledi)
- "Sistem tercihi algılama beklenenden daha zor" → Güncelleme (aynı amaç)
- "Önce anahtarı (toggle) yayınlayalım, tercihleri sonra ekleyelim" → Önce güncelle, arşivle, sonra yeni değişiklik

## En İyi Uygulamalar

### Değişiklikleri Odaklı Tutun

Değişiklik başına bir mantıksal iş birimi. "X özelliği ekle ve ayrıca Y'yi yeniden düzenle" gibi birden fazla iş yapıyorsanız, iki ayrı değişiklik düşünün.

**Neden önemli:**
- Gözden geçirmesi ve anlaşılması daha kolay
- Daha temiz arşiv geçmişi
- Bağımsız olarak yayınlanabilir
- Gerekirse geri alma daha basit

### Belirsiz Gereksinimler İçin `/opsx:explore` Kullanın

Bir değişikliğe başlamadan önce sorun alanını keşfedin:

```text
You: /opsx:explore

AI:  Ne keşfetmek istersiniz?

You: API'miz için hız sınırlamasını (rate limiting) nasıl yönetmeliyiz?

AI:  Mevcut kurulumunuzu ve seçenekleri araştırayım...
     [Kod tabanını araştırır, kalıpları değerlendirir]

     Üç yaklaşım görüyorum:
     1. Middleware tabanlı (basit, her uç nokta için)
     2. Redis destekli (ölçeklenebilir, paylaşılan durum)
     3. Kullanıcı başına jeton kovalası (adil, karmaşık)

     Mevcut teknoloji yığınınız #1 veya #2'yi öneriyor. Ölçeğiniz nedir?
```

Keşif, artifaktlar oluşturmadan önce düşüncelerinizi netleştirir.

### Arşivlemeden Önce Doğrulayın

Uygulamanın artifaktlarla eşleştiğini kontrol etmek için `/opsx:verify` kullanın:

```text
You: /opsx:verify

AI:  add-dark-mode doğrulanıyor...

     ✓ tasks.md'deki tüm görevler işaretlendi
     ✓ Spec'lardaki tüm gereksinimlerin karşılık gelen kodu var
     ✓ Tasarım kararları uygulamada yansıtıldı

     Arşivlemeye hazır!
```

Değişikliği kapatmadan önce uyumsuzlukları yakalar.

### Değişiklikleri Net Adlandırın

İyi isimler `openspec list` komutunu kullanışlı hale getirir:

```text
İyi:                          Kaçın:
add-dark-mode                  feature-1
fix-login-redirect             güncelleme
optimize-product-query         değişiklikler
implement-2fa                  wip
```

## Komut Hızlı Referansı

Komutların tüm ayrıntıları ve seçenekleri için [Komutlar](commands.md) belgesine bakın.

| Komut | Amaç | Kullanım Zamanı |
|---------|---------|-------------|
| `/opsx:propose` | Değişiklik + planlama yapıtları oluştur | Hızlı varsayılan yol (`core` profili) |
| `/opsx:explore` | Fikirleri yapay zeka ile birlikte düşün | Emin olmadığınızda buradan başlayın: belirsiz gereksinimler, araştırma, seçenekleri karşılaştırma |
| `/opsx:new` | Bir değişiklik iskeleti başlat | Genişletilmiş mod, açık yapıt kontrolü |
| `/opsx:continue` | Sonraki yapıtı oluştur | Genişletilmiş mod, adım adım yapıt oluşturma |
| `/opsx:ff` | Tüm planlama yapıtlarını oluştur | Genişletilmiş mod, net kapsam |
| `/opsx:apply` | Görevleri uygula | Kod yazmaya hazır |
| `/opsx:verify` | Uygulamayı doğrula | Genişletilmiş mod, arşivlemeden önce |
| `/opsx:sync` | Delta spesifikasyonlarını birleştir | Genişletilmiş mod, isteğe bağlı |
| `/opsx:archive` | Değişikliği tamamla | Tüm işler bitti |
| `/opsx:bulk-archive` | Birden fazla değişikliği arşivle | Genişletilmiş mod, paralel çalışma |

## Sonraki Adımlar

- [İyi Spesifikasyon Yazma](writing-specs.md) - Güçlü bir gereksinim ve senaryonun nasıl göründüğü, bir değişikliği doğru boyutta yapma
- [Değişikliği İnceleme](reviewing-changes.md) - Herhangi bir kod yazmadan önce tasarlanmış plan üzerinde iki dakikalık kontrol
- [Takımda OpenSpec](team-workflow.md) - Değişikliklerin dallar ve çekme istekleri ile nasıl uyum sağladığı
- [Komutlar](commands.md) - Seçeneklerle birlikte tam komut referansı
- [Kavramlar](concepts.md) - Spesifikasyonlar, yapıtlar ve şemalar üzerine derinlemesine inceleme
- [Özelleştirme](customization.md) - Özel iş akışları oluşturma