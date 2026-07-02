# İş Akışları

Bu rehber, OpenSpec için yaygın iş akışı kalıplarını ve her birinin ne zaman kullanılacağını kapsar. Temel kurulum için [Başlangıç](getting-started.md)'a bakın. Komut referansı için [Komutlar](commands.md)'a bakın.

## Felsefe: Aşamalar Değil, Eylemler

Geleneksel iş akışları sizi aşamalardan geçirir: planlama, ardından uygulama, sonra bitirme. Ancak gerçek çalışma düzgün bir şekilde kutulara sığmaz.

OPSX farklı bir yaklaşım sergiler:

```text
Traditional (phase-locked):

  PLANNING ────────► IMPLEMENTING ────────► DONE
      │                    │
      │   "Can't go back"  │
      └────────────────────┘

OPSX (fluid actions):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Temel İlkeler:**

- **Aşamalar Değil, Eylemler** - Komutlar takılıp kaldığınız aşamalar değil, yapabileceğiniz şeylerdir.
- **Bağımlılıklar Etkenlerdir (Enabler)** - Bunlar neyin mümkün olduğunu gösterir, bir sonraki adımda neyin gerekli olduğunu değil.

> **Özelleştirme:** OPSX iş akışları, eser (artifact) dizilerini tanımlayan şemalar tarafından yönlendirilir. Özel şemalar oluşturma hakkında ayrıntılar için [Özelleştirme](customization.md)'a bakın.

## İki Mod

### Varsayılan Hızlı Yol (`core` profili)

Yeni kurulumlar `core` varsayılanına sahiptir ve bu şunları sağlar:
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Tipik iş akışı:

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (isteğe bağlı)
```

#### Keşif ile Başlayın (Geliştirilmesi Gereken Alışkanlık)

`/opsx:explore`, gelişmiş bir eklenti değil, varsayılan profilin bir parçasıdır. Bu, bir sorununuz ancak henüz bir planınız yoksa yapmanız gereken hamledir; ki bu durum çoğu zaman böyledir.

```text
Siz: /opsx:explore

AI:  Ne keşfetmek istersiniz?

Siz: Arama sonuçlarımız bayatlamış gibi hissediyorum. Bunun önbellekleme,
     indeksleme mi yoksa sorgunun kendisi mi olduğunu bilmiyorum.

AI:  Bakmama izin verin... [arama servisini ve önbellek katmanını okuyor]
     Sorun indeksde: yalnızca gece yeniden oluşturuluyor, bu yüzden düzenlemeler
     bir sonraki güne kadar görünmüyor. İki seçenek var: yazarken yeniden oluşturma (basit, daha fazla yük)
     veya kısa TTL'li önbellek geçersiz kılma (daha çok hareketli parça, daha az yük). Yazma hacminiz düşük olduğu için, yazarken yeniden oluşturma daha temiz bir çözümdür. Kapsamını belirlemek ister misiniz?

Siz: Evet.

Siz: /opsx:propose rebuild-search-index-on-write
```

Keşif herhangi bir çıktı (artifact) oluşturmaz ve kod yazmaz. Bu, muğlak bir endişeyi kesin bir değişikliğe dönüştüren ücretsiz, risksiz bir konuşmadır, bu nedenle ardından gelen öneri keskindir. Tam olarak ne istediğinizi biliyor musunuz? Bu adımı atlayın ve doğrudan `/opsx:propose`'a gidin. Tam rehber: [Keşif ile Başla](explore.md).

### Genişletilmiş/Tam İş Akışı (Özel Seçim)

Eğer açıkça belirtilmiş iskelet oluşturma ve derleme komutlarını (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`) istiyorsanız, bunları şu şekilde etkinleştirin:

```bash
openspec config profile
openspec update
```

## İş Akışı Kalıpları (Genişletilmiş Mod)

### Hızlı Özellik

Ne inşa etmek istediğinizi bildiğiniz ve sadece yürütmeniz gereken bir durum söz konusuysa:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Örnek konuşma:**

```text
Siz: /opsx:new add-logout-button

AI:  openspec/changes/add-logout-button/ oluşturuldu
     Hazır olan: proposal

Siz: /opsx:ff

AI:  Tüm planlama çıktıları oluşturuluyor...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Uygulamaya hazır!

Siz: /opsx:apply

AI:  Görevler üzerinde çalışılıyor...
     ✓ Başlığa çıkış düğmesi eklendi
     ✓ Oturum temizleme uygulandı
     ✓ Onaylama iletişim kutusu eklendi
     Tüm görevler tamamlandı!

Siz: /opsx:archive

AI:  ✓ Spesifikasyonlar birleştirildi
     ✓ Değişiklik arşivlendi
```

**En İyisi:** Küçük ila orta ölçekli özellikler, hata düzeltmeleri, basit değişikliklerdir.

### Keşif Odaklı

Gereksinimler belirsizse veya önce araştırma yapmanız gerekiyorsa:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Örnek konuşma:**

```text
Siz: /opsx:explore

AI:  Ne keşfetmek istersiniz?

Siz: Sayfa yükleme performansını iyileştirmek istiyorum ama darboğazların neresi olduğunu bilmiyorum.

AI:  Araştırmaya yardım edeyim...
     [Paket boyutlarını analiz ediyor, yavaş sorguları belirliyor, bileşen render kalıplarını inceliyor]

     Üç ana darboğaz buldum:
     1. Büyük optimize edilmemiş görseller
     2. ProductList'te senkron veri çekme
     3. Bağlam değişikliklerinden kaynaklanan yeniden çizimler (Re-renders)

     Hangisine önce odaklanmak istersiniz?

Siz: Veri çekme sorununu ele alalım.

Siz: /opsx:new optimize-product-list-fetching

AI:  Değişiklik oluşturuldu. Hazır olan: proposal

Siz: /opsx:continue

AI:  Keşifimize dayanarak öneri oluşturuluyor...
     [Araştırma içgörülerini içeren öneriyi yazar]

     Hazır olan: specs, design
     Sıradaki neyi yapmak istersiniz?

Siz: /opsx:continue

AI:  Specs oluşturuluyor...
```

**En İyisi:** Performans optimizasyonu, hata ayıklama (debugging), mimari kararlar, belirsiz gereksinimler.

### Paralel Değişiklikler

Aynı anda birden fazla değişiklikle çalışın:

```text
Değişiklik A: /opsx:new ──► /opsx:ff ──► /opsx:apply (devam ediyor)
                                         │
                                    bağlam değiştirme
                                         │
Değişiklik B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Örnek konuşma:**

```text
Siz: add-dark-mode üzerinde çalışıyorum ama bir hata düzeltmesine takıldım.

Siz: /opsx:new fix-login-redirect

AI:  openspec/changes/fix-login-redirect/ oluşturuldu

Siz: /opsx:ff

AI:  ✓ Planlama çıktıları oluşturuldu

Siz: /opsx:apply

AI:  fix-login-redirect üzerinde çalışılıyor...
     [Düzeltmeyi uyguluyor]
     Tüm görevler tamamlandı!

Siz: /opsx:archive

AI:  ✓ fix-login-redirect arşivlendi

Siz: Koyu moda geri dönelim.

Siz: /opsx:apply add-dark-mode

AI:  add-dark-mode devam ediyor...
     Görev 2.3'te kaldığı yerden devam ediliyor: Başlık Güncelleme...
```

**En İyisi:** Paralel çalışma akışları, acil kesintiler, ekip işbirliği.

Birden fazla tamamlanmış değişikliğiniz olduğunda, `/opsx:bulk-archive` kullanın:

```text
Siz: /opsx:bulk-archive

AI:  3 adet tamamlanmış değişiklik bulundu:
     - add-dark-mode (tüm görevler yapıldı)
     - fix-login-redirect (tüm görevler yapıldı)
     - update-footer (tüm görevler yapıldı)

     Spesifikasyon çakışmaları kontrol ediliyor...
     ⚠ add-dark-mode ve update-footer ikisi de specs/ui/ kısmına dokunuyor

     Çözmek için kod tabanı inceleniyor...
     Her iki değişiklik de uygulanmış durumda. Kronolojik sıraya göre uygulanacaktır.

     3 değişikliğin tamamını arşivleyelim mi?

Siz: Evet

AI:  ✓ add-dark-mode arşivlendi
     ✓ fix-login-redirect arşivlendi
     ✓ update-footer arşivlendi
     Spesifikasyonlar sırayla birleştirildi: add-dark-mode → update-footer
```

Toplu arşivleme, birden fazla değişikliğin aynı spesifikasyonlara dokunduğunu tespit eder ve neyin gerçekten uygulandığını kontrol ederek çakışmaları çözer.

### Bir Değişikliği Tamamlama

Önerilen tamamlama akışı:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              doğrular          senkronize etme isteği sorar
              uygulamanın       gerekiyorsa
```

#### Doğrulama: İşinizi Kontrol Edin

`/opsx:verify`, üç boyutta uygulamanın çıktılarınızla uyup uymadığını doğrular:

```text
Siz: /opsx:verify

AI:  add-auth doğrulanıyor...

     TAMAMLANMA
     ✓ tasks.md'deki 12 görevin tamamı kontrol edildi
     ✓ Spesifikasyonlardaki tüm gereksinimler karşılık gelen koda sahip
     ⚠ "Etkinliksiz kalma sonrası oturum zaman aşımı" senaryosu test edilmedi

     DOĞRULUK
     ✓ Uygulama, spesifikasyon amacına uyuyor
     ✓ Senaryolardan kaynaklanan uç durumlar ele alınıyor
     ✓ Hata durumları spesifikasyon tanımlarıyla eşleşiyor

     TUTARLILIK
     ✓ Tasarım kararları kod yapısına yansıtılmış
     ✓ Adlandırma kuralları design.md ile tutarlı
     ⚠ Tasarım "olay güdümlü"dan bahsediyor ancak uygulama polling kullanıyor

     ÖZET
     ─────────────────────────────
     Kritik sorunlar: 0
     Uyarılar: 2
     Arşivlemeye hazır: Evet (uyarılarla birlikte)

     Tavsiyeler:
     1. Oturum zaman aşımı senaryosu için test ekleyin
     2. Tasarımda belirtildiği gibi olay güdümlüye yeniden düzenleme yapmayı düşünün veya design.md'yi güncelleyin
```

**Doğrulamanın Neleri Kontrol Ettiği:**

| Boyut | Ne Doğrulanır |
|-----------|------------------|
| Tamamlanma | Tüm görevler tamamlandı, tüm gereksinimler uygulandı, senaryolar kapsandı |
| Doğruluk | Uygulama, spesifikasyon amacına uyuyor, uç durumlar ele alındı |
| Tutarlılık | Tasarım kararları koda yansıtıldı, kalıplar tutarlı |

Doğrulama, arşivlemeyi engellemez, ancak öncelikle ele almak isteyebileceğiniz sorunları ortaya çıkarır.

#### Arşivleme: Değişikliği Sonlandırma

`/opsx:archive`, değişikliği tamamlar ve onu arşive taşır:

```text
Siz: /opsx:archive

AI:  add-auth arşivlendi...

     Çıktı durumu:
     ✓ proposal.md mevcut
     ✓ specs/ mevcut
     ✓ design.md mevcut
     ✓ tasks.md mevcut (12/12 görev tamamlandı)

     Delta spesifikasyonları: Anaya henüz senkronize edilmedi
     → Şimdi senkronize etmek ister misiniz?

Siz: Evet

AI:  ✓ Spesifikasyonlar openspec/specs/auth/spec.md'ye senkronize edildi
     ✓ openspec/changes/archive/2025-01-24-add-auth/ konumuna taşındı

     Değişiklik başarıyla arşivlendi.
```

Arşivleme, spesifikasyonlar senkronize edilmemişse uyarı verecektir. Tamamlanmamış görevler nedeniyle engellemeyecek, ancak sizi uyaracaktır.

## Ne Zaman Neyi Kullanmalı

### `/opsx:ff` ve `/opsx:continue` Karşılaştırması

| Durum | Kullanılacak Komut |
|-----------|-----|
| Net gereksinimler, inşa etmeye hazır | `/opsx:ff` |
| Keşif yapılıyor, her adımı gözden geçirmek isteniyor | `/opsx:continue` |
| Spesifikasyonlardan önce öneri üzerinde yineleme yapmak isteniyor | `/opsx:continue` |
| Zaman baskısı var, hızlı hareket edilmesi gerekiyor | `/opsx:ff` |
| Karmaşık değişiklik, kontrol isteniyor | `/opsx:continue` |

**Temel Kural:** Eğer baştan tam kapsamı tanımlayabiliyorsanız, `/opsx:ff` kullanın. Yol ilerlerken çözüyorsanız, `/opsx:continue` kullanın.

### Ne Zaman Güncellemeli Ne Zaman Sıfırdan Başlamalı

Yaygın bir soru: Mevcut bir değişikliği ne zaman güncellemek uygun, ne zaman yeni bir tane başlatmalıyız?

**Mevcut değişikliği güncelleyin:**

- Aynı amaç, iyileştirilmiş uygulama
- Kapsam daralıyor (önce MVP, geri kalanı sonra)
- Öğrenmeye dayalı düzeltmeler (kod tabanı beklediğiniz gibi değil)
- Uygulama keşiflerine dayalı tasarım ayarlamaları

**Yeni bir değişiklik başlatın:**

- Amaç temelden değiştiyse
-Kapsam tamamen farklı bir işe doğru patladıysa
-Orijinal değişikliğin bağımsız olarak "tamamlanmış" olarak işaretlenebilmesi durumunda
-Yama (patch)ların açıklığa kavuşturmaktan çok kafa karışıklığı yaratacağı düşünülüyorsa

```text
                     ┌─────────────────────────────────────┐
                     │     Bu aynı iş mi?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Aynı amaç mı?      > %50 örtüşme var mı?    Orijinal
          Aynı sorun mu?     Aynı kapsamda mı?        Bu değişiklikler olmadan "tamamlanabilir" mi?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      EVET            HAYIR EVET           HAYIR  HAYIR              EVET
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    GÜNCELLEME        YENİ  GÜNCELLEME       YENİ  GÜNCELLEME      YENİ
```

**Örnek: "Koyu Mod Ekleme"**

- "Özel temaları da desteklemek gerekiyor" → Yeni değişiklik (kapsam patladı)
- "Sistem tercihi tespiti beklenenden daha zor" → Güncelleme (aynı amaç)
- "Önce geçiş düğmesini gönderelim, tercihleri sonra ekleriz" → Önce güncelle, sonra arşivle, ardından yeni bir değişiklik başlat

## En İyi Uygulamalar

### Değişiklikleri Odaklı Tutun

Her değişikliğe tek bir mantıksal iş birimi. Eğer "X özelliğini eklemek ve Y'yi yeniden düzenlemek" yapıyorsanız, iki ayrı değişiklik düşünün.

**Neden Önemli:**
- Gözden geçirilmesi ve anlaşılması daha kolaydır
- Daha temiz arşiv geçmişi sağlar
- Bağımsız olarak gönderilebilir
- Gerektiğinde geri alma işlemi basittir

### Belirsiz Gereksinimler İçin `/opsx:explore` Kullanın

Bir değişikliğe karar vermeden önce, sorun alanını keşfedin:

```text
Siz: /opsx:explore

AI:  Ne keşfetmek istersiniz?

Siz: API'mız için hız sınırlamasını nasıl ele almalıyız?

AI:  Mevcut kurulumunuzu ve seçenekleri araştırmama izin verin...
     [Kod tabanını araştırıyor, kalıpları değerlendiriyor]

     İzleyebileceğimiz üç yaklaşım görüyorum:
     1. Middleware tabanlı (basit, endpoint başına)
     2. Redis destekli (ölçeklenebilir, paylaşılan durum)
     3. Kullanıcı başına token kovası (adil, karmaşık)

     Mevcut yığınınız #1 veya #2'yi öneriyor. Ölçeğiniz nedir?
```

Keşif, çıktıları oluşturmadan önce düşünceyi netleştirir.

### Arşivlemeden Önce Doğrulayın

Uygulamanın çıktılarla eşleşip eşleşmediğini kontrol etmek için `/opsx:verify` kullanın:

```text
Siz: /opsx:verify

AI:  add-dark-mode doğrulanıyor...

     ✓ tasks.md'deki tüm görevler kontrol edildi
     ✓ Spesifikasyonlardaki gereksinimler karşılık gelen koda sahip
     ✓ Tasarım kararları uygulamaya yansıtılmış

     Arşivlemeye hazır!
```

Değişikliği kapatmadan önce uyumsuzlukları yakalar.

### Değişiklikleri Açıkça Adlandırın

İyi isimler `openspec list` komutunu kullanışlı hale getirir:

```text
İyi Olanlar:                          Kaçınılması Gerekenler:
add-dark-mode                  feature-1
fix-login-redirect             güncelleme (update)
optimize-product-query         değişiklikler (changes)
implement-2fa                  devam ediyor (wip)
```

## Komut Hızlı Referansı

Tam komut detayları ve seçenekleri için [Commands](commands.md)'e bakın.

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/opsx:propose` | Değişiklik ve planlama varlıklarını oluşturur | Hızlı varsayılan yol (`core` profili) |
| `/opsx:explore` | Yapay zeka ile fikirleri düşünür | Emin olmadığınızda buradan başlayın: belirsiz gereksinimler, araştırma, seçenekleri karşılaştırma |
| `/opsx:new` | Bir değişiklik iskeleti başlatır | Genişletilmiş mod, açık varlık kontrolü |
| `/opsx:continue` | Sonraki varlığı oluşturur | Genişletilmiş mod, adım adım varlık oluşturma |
| `/opsx:ff` | Tüm planlama varlıklarını oluşturur | Genişletilmiş mod, net kapsam |
| `/opsx:apply` | Görevleri uygular | Kod yazmaya hazırken |
| `/opsx:verify` | Uygulamayı doğrular | Genişletilmiş mod, arşivlemeden önce |
| `/opsx:sync` | Delta özelliklerini birleştirir | Genişletilmiş mod, isteğe bağlı |
| `/opsx:archive` | Değişikliği tamamlar | Tüm iş bitmişken |
| `/opsx:bulk-archive` | Birden çok değişikliği arşivler | Genişletilmiş mod, paralel çalışma |

## Sonraki Adımlar

- [Commands](commands.md) - Seçeneklerle tam komut referansı
- [Concepts](concepts.md) - Özelliklere (specs), varlıklara ve şemalara derinlemesine bakış
- [Customization](customization.md) - Özel iş akışları oluşturma