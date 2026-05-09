# İş Akışları

Bu kılavuz, OpenSpec için yaygın iş akışı kalıplarını ve her birinin ne zaman kullanılacağını kapsar. Temel kurulum için bkz. [Başlarken](getting-started.md). Komut referansı için bkz. [Komutlar](commands.md).

## Felsefe: Aşamalar Değil, Eylemler

Geleneksel iş akışları sizi aşamalara zorlar: planlama, ardından uygulama, ardından tamamlandı. Ancak gerçek iş düzgün kutulara sığmaz.

OPSX farklı bir yaklaşım benimser:

```text
Geleneksel (aşama kilitli):

  PLANLAMA ────────► UYGULAMA ────────► TAMAMLANDI
      │                    │
      │   "Geri dönülemez" │
      └────────────────────┘

OPSX (akıcı eylemler):

  teklif ──► spesifikasyonlar ──► tasarım ──► görevler ──► uygulama
```

**Temel ilkeler:**

- **Aşamalar değil, eylemler** - Komutlar, sıkışıp kaldığınız aşamalar değil, yapabileceğiniz şeylerdir
- **Bağımlılıklar kolaylaştırıcılardır** - Sıradaki neyin gerekli olduğunu değil, neyin mümkün olduğunu gösterirler

> **Özelleştirme:** OPSX iş akışları, eser dizilerini tanımlayan şemalar tarafından yönlendirilir. Özel şemalar oluşturma hakkında ayrıntılar için bkz. [Özelleştirme](customization.md).

## İki Mod

### Varsayılan Hızlı Yol (`core` profili)

Yeni kurulumlar varsayılan olarak `core` kullanır, şu komutları sağlar:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Tipik akış:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

### Genişletilmiş/Tam İş Akışı (özel seçim)

Açık iskelet oluşturma ve derleme komutlarına (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`) ihtiyacınız varsa, bunları şu şekilde etkinleştirin:

```bash
openspec config profile
openspec update
```

## İş Akışı Desenleri (Genişletilmiş Mod)

### Hızlı Özellik

Ne inşa etmek istediğinizi biliyorsanız ve sadece uygulamaya geçmeniz gerekiyorsa:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Örnek konuşma:**

```text
Siz: /opsx:new add-logout-button

YZ:  openspec/changes/add-logout-button/ oluşturuldu
     Oluşturmaya hazır: proposal

Siz: /opsx:ff

YZ:  Tüm planlama çıktıları oluşturuluyor...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Uygulamaya hazır!

Siz: /opsx:apply

YZ:  Görevler üzerinde çalışılıyor...
     ✓ Header'a çıkış butonu eklendi
     ✓ Oturum temizleme uygulandı
     ✓ Onay iletişim kutusu eklendi
     Tüm görevler tamamlandı!

Siz: /opsx:archive

YZ:  ✓ Spesifikasyonlar birleştirildi
     ✓ Değişiklik arşivlendi
```

**En uygun olduğu durumlar:** Küçük ve orta ölçekli özellikler, hata düzeltmeleri, basit değişiklikler.

### Keşif Amaçlı

Gereksinimler belirsiz olduğunda veya önce araştırma yapmanız gerektiğinde:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Örnek konuşma:**

```text
Siz: /opsx:explore

YZ:  Neyi keşfetmek istiyorsunuz?

Siz: Sayfa yükleme performansını iyileştirmek istiyorum ama
     darboğazların nerede olduğundan emin değilim.

YZ:  Araştırmaya yardımcı olayım...
     [Paket boyutlarını analiz eder, yavaş sorguları belirler,
     bileşen render desenlerini inceler]

     Üç ana darboğaz buldum:
     1. Büyük optimize edilmemiş görseller
     2. ProductList'te eşzamanlı veri çekme
     3. Context değişikliklerinden kaynaklanan yeniden render'lar

     Hangisini önce ele almak istersiniz?

Siz: Veri çekme sorununu ele alalım.

Siz: /opsx:new optimize-product-list-fetching

YZ:  Değişiklik oluşturuldu. Oluşturmaya hazır: proposal

Siz: /opsx:continue

YZ:  Keşfimize dayanarak öneri oluşturuluyor...
     [Araştırma bulgularını içeren öneri yazılır]

     Oluşturmaya hazır: specs, design
     Hangisini istersiniz?

Siz: /opsx:continue

YZ:  Spesifikasyonlar oluşturuluyor...
```

**En uygun olduğu durumlar:** Performans optimizasyonu, hata ayıklama, mimari kararlar, belirsiz gereksinimler.

### Paralel Değişiklikler

Aynı anda birden fazla değişiklik üzerinde çalışın:

```text
Değişiklik A: /opsx:new ──► /opsx:ff ──► /opsx:apply (devam ediyor)
                                         │
                                    bağlam değişimi
                                         │
Değişiklik B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Örnek konuşma:**

```text
Siz: add-dark-mode üzerinde çalışıyordum ama bir hata düzeltmesi için çağrıldım

Siz: /opsx:new fix-login-redirect

YZ:  openspec/changes/fix-login-redirect/ oluşturuldu

Siz: /opsx:ff

YZ:  ✓ Planlama çıktıları oluşturuldu

Siz: /opsx:apply

YZ:  fix-login-redirect üzerinde çalışılıyor...
     [Düzeltmeyi uygular]
     Tüm görevler tamamlandı!

Siz: /opsx:archive

YZ:  ✓ fix-login-redirect arşivlendi

Siz: Karanlık mod'a geri dönelim

Siz: /opsx:apply add-dark-mode

YZ:  add-dark-mode devam ettiriliyor...
     Görev 2.3'ten devam ediliyor: Header güncelleme...
```

**En uygun olduğu durumlar:** Paralel iş akışları, acil kesintiler, ekip işbirliği.

Birden fazla tamamlanmış değişikliğiniz olduğunda `/opsx:bulk-archive` kullanın:

```text
Siz: /opsx:bulk-archive

YZ:  3 tamamlanmış değişiklik bulundu:
     - add-dark-mode (tüm görevler tamamlandı)
     - fix-login-redirect (tüm görevler tamamlandı)
     - update-footer (tüm görevler tamamlandı)

     Spesifikasyon çakışmaları kontrol ediliyor...
     ⚠ add-dark-mode ve update-footer ikisi de specs/ui/ dosyalarını etkiliyor

     Çözümlemek için kod tabanı inceleniyor...
     Her iki değişiklik de uygulanmış. Kronolojik sırayla uygulanacak.

     3 değişiklik de arşivlensin mi?

Siz: Evet

YZ:  ✓ add-dark-mode arşivlendi
     ✓ fix-login-redirect arşivlendi
     ✓ update-footer arşivlendi
     Spesifikasyonlar sırayla birleştirildi: add-dark-mode → update-footer
```

Toplu arşivleme, birden fazla değişikliğin aynı spesifikasyonları etkilediğini tespit eder ve aslında neyin uygulandığını kontrol ederek çakışmaları çözer.

### Bir Değişikliği Tamamlama

Önerilen tamamlama akışı:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              uygulamayı           gerekirse
              doğrular             senkronize etmeyi
                                   önerir
```

#### Verify: Çalışmanızı Kontrol Edin

`/opsx:verify`, uygulamayı üç boyutta çıktılarınızla doğrular:

```text
Siz: /opsx:verify

YZ:  add-auth doğrulanıyor...

     TAMAMLIK
     ✓ tasks.md'deki 12 görevin hepsi işaretli
     ✓ Spesifikasyonlardaki tüm gereksinimlerin karşılık gelen kodu var
     ⚠ "Hareketsizlik sonrası oturum zaman aşımı" senaryosu test edilmemiş

     DOĞRULUK
     ✓ Uygulama spesifikasyon amacına uygun
     ✓ Senaryolardaki sınır durumları ele alınmış
     ✓ Hata durumları spesifikasyon tanımlarıyla eşleşiyor

     TUTARLILIK
     ✓ Tasarım kararları kod yapısına yansımış
     ✓ Adlandırma kuralları design.md ile tutarlı
     ⚠ Tasarım "olay odaklı"dan bahsediyor ama uygulama polling kullanıyor

     ÖZET
     ─────────────────────────────
     Kritik sorunlar: 0
     Uyarılar: 2
     Arşivlemeye hazır: Evet (uyarılarla birlikte)

     Öneriler:
     1. Oturum zaman aşımı senaryosu için test ekleyin
     2. Tasarımdaki gibi olay odaklı yapıya geçmeyi düşünün veya design.md'yi güncelleyin
```

**Verify'in kontrol ettikleri:**

| Boyut | Ne doğrular |
|-------|-------------|
| Tamamlık | Tüm görevler yapılmış, tüm gereksinimler uygulanmış, senaryolar kapsanmış |
| Doğruluk | Uygulama spesifikasyon amacına uygun, sınır durumları ele alınmış |
| Tutarlılık | Tasarım kararları koda yansımış, desenler tutarlı |

Verify arşivlemeyi engellemez, ancak önce ele almak isteyebileceğiniz sorunları ortaya çıkarır.

#### Archive: Değişikliği Sonuçlandırın

`/opsx:archive` değişikliği tamamlar ve arşive taşır:

```text
Siz: /opsx:archive

YZ:  add-auth arşivleniyor...

     Çıktı durumu:
     ✓ proposal.md mevcut
     ✓ specs/ mevcut
     ✓ design.md mevcut
     ✓ tasks.md mevcut (12/12 görev tamamlandı)

     Delta spesifikasyonları: Henüz main'e senkronize edilmedi
     → Şimdi senkronize etmek ister misiniz?

Siz: Evet

YZ:  ✓ specs/auth/spec.md'ye senkronize edildi
     ✓ openspec/changes/archive/2025-01-24-add-auth/ konumuna taşındı

     Değişiklik başarıyla arşivlendi.
```

Arşivleme, spesifikasyonlar senkronize edilmemişse sizi uyarır. Tamamlanmamış görevlerde engellemez, ancak uyarı verir.

## Ne Zaman Ne Kullanılır

### `/opsx:ff` vs `/opsx:continue`

| Durum | Kullanın |
|-------|----------|
| Gereksinimler net, inşa etmeye hazır | `/opsx:ff` |
| Keşif aşamasında, her adımı incelemek istiyorum | `/opsx:continue` |
| Spesifikasyonlardan önce öneriyi yinelemek istiyorum | `/opsx:continue` |
| Zaman baskısı var, hızlı ilerlemem gerekiyor | `/opsx:ff` |
| Karmaşık değişiklik, kontrol istiyorum | `/opsx:continue` |

**Genel kural:** Kapsamı baştan tanımlayabiliyorsanız `/opsx:ff` kullanın. İlerledikçe keşfediyorsanız `/opsx:continue` kullanın.

### Güncelleme vs Sıfırdan Başlama

Sık sorulan bir soru: mevcut bir değişikliği güncellemek ne zaman uygundur ve ne zaman yeni bir tane başlatmalısınız?

**Mevcut değişikliği güncelleyin:**

- Aynı amaç, iyileştirilmiş uygulama
- Kapsam daralır (önce MVP, geri kalanı sonra)
- Öğrenmeye dayalı düzeltmeler (kod tabanı beklediğiniz gibi değil)
- Uygulama keşiflerine dayalı tasarım ince ayarları

**Yeni bir değişiklik başlatın:**

- Amaç temelden değişti
- Kapsam tamamen farklı bir işe genişledi
- Orijinal değişiklik tek başına "tamamlandı" olarak işaretlenebilir
- Yamalar açıklamaktan çok kafa karıştırır

```text
                     ┌─────────────────────────────────────┐
                     │     Bu aynı iş mi?                  │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Aynı amaç mı?    >%50 örtüşme mü?   Orijinal bu
          Aynı sorun mu?   Aynı kapsam mı?    değişiklikler
                 │                  │          olmadan "tamam"
                 │                  │          olabilir mi?
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      EVET              HAYIR EVET       HAYIR HAYIR         EVET
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
   GÜNCELLE           YENİ GÜNCELLE    YENİ GÜNCELLE        YENİ
```

**Örnek: "Karanlık mod ekle"**

- "Ayrıca özel temaları desteklememiz gerekiyor" → Yeni değişiklik (kapsam genişledi)
- "Sistem tercihi algılama beklediğimden daha zor" → Güncelleme (aynı amaç)
- "Önce anahtarı gönderelim, tercihleri sonra ekleyelim" → Güncelle, arşivle, sonra yeni değişiklik

## En İyi Uygulamalar

### Değişiklikleri Odaklı Tutun

Değişiklik başına bir mantıksal iş birimi. "X özelliğini ekle ve ayrıca Y'yi yeniden yapılandır" yapıyorsanız, iki ayrı değişiklik düşünün.

**Neden önemli:**
- İncelemesi ve anlaması daha kolay
- Daha temiz arşiv geçmişi
- Bağımsız olarak gönderilebilir
- Gerekirse geri alması daha basit

### Belirsiz Gereksinimler İçin `/opsx:explore` Kullanın

Bir değişikliğe geçmeden önce sorun alanını keşfedin:

```text
Siz: /opsx:explore

YZ:  Neyi keşfetmek istiyorsunuz?

Siz: API'miz için hız sınırlamasını nasıl ele almalıyız?

YZ:  Mevcut kurulumunuzu ve seçeneklerinizi araştırayım...
     [Kod tabanını araştırır, desenleri değerlendirir]

     Üç yaklaşım görebiliriz:
     1. Middleware tabanlı (basit, uç nokta başına)
     2. Redis destekli (ölçeklenebilir, paylaşımlı durum)
     3. Kullanıcı başına token bucket (adil, karmaşık)

     Mevcut teknoloji yığınınız #1 veya #2'yi öneriyor. Ölçeğiniz nedir?
```

Keşif, çıktılar oluşturmadan önce düşünce sürecinizi netleştirir.

### Arşivlemeden Önce Doğrulayın

Uygulamanın çıktılarla eşleştiğini kontrol etmek için `/opsx:verify` kullanın:

```text
Siz: /opsx:verify

YZ:  add-dark-mode doğrulanıyor...

     ✓ tasks.md'deki tüm görevler işaretli
     ✓ Spesifikasyonlardaki gereksinimlerin karşılık gelen kodu var
     ✓ Tasarım kararları uygulamaya yansımış

     Arşivlemeye hazır!
```

Değişikliği kapatmadan önce uyumsuzlukları yakalar.

### Değişiklikleri Açıkça Adlandırın

İyi isimler `openspec list` komutunu kullanışlı kılar:

```text
İyi:                           Kaçının:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Komut Hızlı Referansı

Tüm komut detayları ve seçenekleri için bkz. [Komutlar](commands.md).

| Komut | Amaç | Ne Zaman Kullanılır |
|---------|---------|-------------|
| `/opsx:propose` | Değişiklik + planlama eserleri oluştur | Hızlı varsayılan yol (`core` profili) |
| `/opsx:explore` | Fikirleri düşünmek | Belirsiz gereksinimler, araştırma |
| `/opsx:new` | Bir değişiklik iskelesi başlat | Genişletilmiş mod, açık eser kontrolü |
| `/opsx:continue` | Sonraki eseri oluştur | Genişletilmiş mod, adım adım eser oluşturma |
| `/opsx:ff` | Tüm planlama eserlerini oluştur | Genişletilmiş mod, net kapsam |
| `/opsx:apply` | Görevleri uygula | Kod yazmaya hazır |
| `/opsx:verify` | Uygulamayı doğrula | Genişletilmiş mod, arşivlemeden önce |
| `/opsx:sync` | Delta spesifikasyonlarını birleştir | Genişletilmiş mod, isteğe bağlı |
| `/opsx:archive` | Değişikliği tamamla | Tüm işler bitti |
| `/opsx:bulk-archive` | Birden fazla değişikliği arşivle | Genişletilmiş mod, paralel çalışma |

## Sonraki Adımlar

- [Komutlar](commands.md) - Seçeneklerle tam komut referansı
- [Kavramlar](concepts.md) - Spesifikasyonlar, eserler ve şemalara derinlemesine bakış
- [Özelleştirme](customization.md) - Özel iş akışları oluşturun