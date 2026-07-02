# Komutlar

Bu belge, OpenSpec'in slash komutları için bir referanstır. Bu komutlar, yapay zeka (AI) kodlama asistanınızın sohbet arayüzünde çağrılır (örneğin, Claude Code, Cursor, Windsurf).

İş akışı kalıpları ve her bir komutun ne zaman kullanılacağına dair bilgi için [İş Akışları](workflows.md)'na bakın. CLI komutları için ise [CLI]'ya bakın.

## Hızlı Referans

### Varsayılan Hızlı Yol (`core` profili)

| Command | Purpose |
|---------|---------|
| `/opsx:propose` | Bir değişiklik oluşturun ve planlama varlıklarını tek adımda oluşturun |
| `/opsx:explore` | Değişikliğe geçmeden önce fikirleri düşünün |
| `/opsx:apply` | Değişiklikten görevleri uygulayın |
| `/opsx:sync` | Delta (fark) spesifikasyonlarını ana spesifikasyonlarla birleştirin |
| `/opsx:archive` | Tamamlanmış bir değişikliği arşivleyin |

### Genişletilmiş İş Akışı Komutları (özel iş akışı seçimi)

| Command | Purpose |
|---------|---------|
| `/opsx:new` | Yeni bir değişiklik iskeleti başlatın |
| `/opsx:continue` | Bağımlılıklara dayanarak sonraki varlıkı oluşturun |
| `/opsx:ff` | Hızlandırma (Fast-forward): tüm planlama varlıklarını aynı anda oluşturun |
| `/opsx:verify` | Uygulamanın varlıklarla eşleşip eşleşmediğini doğrulayın |
| `/opsx:bulk-archive` | Birden fazla değişikliği toplu olarak arşivleyin |
| `/opsx:onboard` | Tamamlanmış iş akışına rehberli bir tur (tutorial) ile giriş yapın |

Varsayılan global profil `core`'dur. Genişletilmiş iş akışı komutlarını etkinleştirmek için, `openspec config profile` komutunu çalıştırın, iş akışlarını seçin ve ardından projenizde `openspec update` komutunu çalıştırın.

## Komut Referansı

### `/opsx:propose`

Yeni bir değişiklik oluşturur ve planlama artefaktlarını tek adımda üretir. Bu, `core` profilindeki varsayılan başlangıç komutudur.

**Sözdizimi:**
```text
/opsx:propose [change-name-or-description]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|---------|-------------|
| `change-name-or-description` | Hayır | Kebab-case isim veya düz dil değişikliği açıklaması |

**Ne yapar:**
- `openspec/changes/<change-name>/` klasörünü oluşturur
- Uygulamadan önce gerekli olan artefaktları üretir (spec-driven için: proposal, specs, design, tasks)
- Değişiklik `/opsx:apply` komutu için hazır olduğunda durur

**Örnek:**
```text
You: /opsx:propose add-dark-mode

AI:  openspec/changes/add-dark-mode/ oluşturuldu
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Uygulamaya hazır. /opsx:apply komutunu çalıştırın.
```

**İpuçları:**
- En hızlı uçtan uca yol için bunu kullanın
- Adım adım artefakt kontrolü istiyorsanız, genişletilmiş iş akışlarını etkinleştirin ve `/opsx:new` + `/opsx:continue` kullanın

---

### `/opsx:explore`

> **Emin değilseniz buradan başlayın.** Explore, risk taşımayan bir düşünme ortağıdır: kod tabanınızı okur, seçenekleri karşılaştırır ve herhangi bir değişiklik oluşmadan önce belirsiz bir fikri somut bir plana dönüştürür. Varsayılan profilde gelir. Tam kapsam ve daha fazla örnek için [Explore First](explore.md) kılavuzuna bakın.

Bir değişikliğe bağlı kalmadan fikirler üzerine düşünün, sorunları araştırın ve gereksinimleri netleştirin.

**Sözdizimi:**
```
/opsx:explore [topic]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|---------|-------------|
| `topic` | Hayır | Keşfetmek veya araştırmak istediğiniz konu |

**Ne yapar:**
- Yapı gerektirmeyen keşifsel bir sohbet başlatır
- Soruları yanıtlamak için kod tabanını araştırır
- Seçenekleri ve yaklaşımları karşılaştırır
- Düşünmeyi netleştirmek için görsel diyagramlar oluşturur
- İçgörüler kristalleştiğinde `/opsx:propose` (varsayılan) veya `/opsx:new` (genişletilmiş iş akışı) aşamasına geçebilir

**Örnek:**
```text
You: /opsx:explore

AI:  Ne keşfetmek istersiniz?

You: Mobil uygulama için kimlik doğrulamayı nasıl ele almalıyız?

AI:  Mevcut auth (kimlik doğrulama) kurulumunuzu inceleyeyim...
     [Kod tabanını analiz ediyor]

     Web uygulaması için oturum tabanlı kimlik doğrulaması kullandığınızı görüyorum.
     Mobil için üç ana seçeneğimiz var:

     1. JWT token'ları (durumsuz, çevrimdışı çalışır)
     2. OAuth2 (üçüncü taraf login ihtiyacınız varsa)
     3. Mevcut oturumların genişletilmesi (daha basit, ancak bağlantı gerektirir)

     API'niz zaten CORS yapılandırılmış durumda. Hangi yön ilginizi çekiyor?

You: JWT ile gidelim. Bunun için bir değişiklik başlatabilir miyiz?

AI:  Hazır olduğunuzda. Başlamak için /opsx:propose add-jwt-auth komutunu çalıştırın.
```

**İpuçları:**
- Gereksinimler belirsizse veya araştırma yapmanız gerekiyorsa kullanın
- Keşif sırasında hiçbir artefakt oluşturulmaz
- Karar vermeden önce birden fazla yaklaşımı karşılaştırmak için iyidir
- Dosyaları okuyabilir ve kod tabanını arayabilir

---

### `/opsx:new`

Yeni bir değişiklik iskeleti (scaffold) başlatır. Değişiklik klasörünü oluşturur ve artefaktları `/opsx:continue` veya `/opsx:ff` ile üretmenizi bekler.

Bu komut, genişletilmiş iş akışı setinin bir parçasıdır (varsayılan `core` profilde bulunmaz).

**Sözdizimi:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|---------|-------------|
| `change-name` | Hayır | Değişiklik klasörünün adı (sağlanmazsa sorulur) |
| `--schema` | Hayır | Kullanılacak iş akışı şeması (varsayılan: yapılandırmadan veya `spec-driven`) |

**Ne yapar:**
- `openspec/changes/<change-name>/` dizinini oluşturur
- Değişiklik klasöründe `.openspec.yaml` meta veri dosyasını oluşturur
- Oluşturmaya hazır olan ilk artefakt şablonunu gösterir
- Sağlanmazsa değişiklik adı ve şeması için sorar

**Ne oluşturur:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Değişiklik meta verisi (şema, oluşturulma tarihi)
```

**Örnek:**
```
You: /opsx:new add-dark-mode

AI:  openspec/changes/add-dark-mode/ oluşturuldu
     Şema: spec-driven

     Oluşturmaya hazır: proposal
     Bunu oluşturmak için /opsx:continue kullanın veya tüm artefaktları oluşturmak için /opsx:ff kullanın.
```

**İpuçları:**
- Açıklayıcı isimler kullanın: `add-feature`, `fix-bug`, `refactor-module`
- `update`, `changes`, `wip` gibi genel isimlerden kaçının
- Şema, proje yapılandırmasında (`openspec/config.yaml`) da ayarlanabilir

---

### `/opsx:continue`

Bağımlılık zincirindeki bir sonraki artefaktı oluşturur. Aşama aşama ilerleme için tek seferde bir artefakt oluşturur.

**Sözdizimi:**
```
/opsx:continue [change-name]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|---------|-------------|
| `change-name` | Hayır | Devam ettirilecek değişiklik (sağlanmazsa bağlamdan çıkarılır) |

**Ne yapar:**
- Artefakt bağımlılık grafiğini sorgular
- Hangi artefaktların hazır, hangilerinin engelli olduğunu gösterir
- İlk hazır artefaktı oluşturur
- Bağlam için bağımlılık dosyalarını okur
- Oluşturulduktan sonra neyin mevcut hale geldiğini gösterir

**Örnek:**
```
You: /opsx:continue

AI:  Değişiklik: add-dark-mode

     Artefakt durumu:
     ✓ proposal    (tamamlandı)
     ◆ specs       (hazır)
     ◆ design      (hazır)
     ○ tasks       (engelli - gerektiriyor: specs)

     specs oluşturuluyor...

     [proposal.md'yi okur, gereksinimlere göre specs oluşturur]

     ✓ openspec/changes/add-dark-mode/specs/ui/spec.md oluşturuldu

     Şimdi mevcut olanlar: tasks
     Bir sonraki artefaktı oluşturmak için /opsx:continue komutunu çalıştırın.
```

**İpuçları:**
- Her bir artefaktı incelemek istediğinizde kullanın
- Kontrol istediğiniz karmaşık değişiklikler için iyidir
- Birden fazla artefakt aynı anda hazır olabilir
- Devam etmeden önce oluşturulan artefaktları düzenleyebilirsiniz

---

### `/opsx:ff`

Artefakt oluşturma sürecini hızlandırır (Fast-forward). Tüm planlama artefaktlarını tek seferde oluşturur.

**Sözdizimi:**
```
/opsx:ff [change-name]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|---------|-------------|
| `change-name` | Hayır | Hızlandırılacak değişiklik (sağlanmazsa bağlamdan çıkarılır) |

**Ne yapar:**
- Tüm artefaktları bağımlılık sırasına göre oluşturur
- Yapılacaklar listesi aracılığıyla ilerlemeyi takip eder
- Tüm `apply-required` artefaktları tamamlandığında durur
- Bir sonraki artefaktı oluşturmadan önce her bir bağımlılığı okur

**Örnek:**
```
You: /opsx:ff add-dark-mode

AI:  add-dark-mode hızlandırılıyor...

     ✓ proposal.md oluşturuluyor
     ✓ specs/ui/spec.md oluşturuluyor
     ✓ design.md oluşturuluyor
     ✓ tasks.md oluşturuluyor

     Tüm planlama artefaktları tamamlandı!
     Uygulamaya hazır. Başlamak için /opsx:apply komutunu çalıştırın.
```

**İpuçları:**
- Doğrudan değişiklikler için `/opsx:continue`'dan daha hızlıdır
- Daha sonra hala artefaktları düzenleyebilirsiniz
- Küçükten orta boyuta kadar olan özellikler için iyidir

---

### `/opsx:apply`

Değişiklikteki görevleri uygular. Görev listesi üzerinden ilerleyerek kod yazar ve maddeleri işaretler.

**Sözdizimi:**
```
/opsx:apply [change-name]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|---------|-------------|
| `change-name` | Hayır | Uygulanacak değişiklik (sağlanmazsa bağlamdan çıkarılır) |

**Ne yapar:**
- `tasks.md` dosyasını okur ve tamamlanmamış görevleri belirler
- Görevler üzerinden sırayla ilerler
- Gerekli olduğunda kod yazar, dosyalar oluşturur, testleri çalıştırır
- Görevleri onay kutucukları `[x]` ile işaretler

**Örnek:**
```
You: /opsx:apply

AI:  add-dark-mode uygulanıyor...

     tasks.md okunuyor:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     1.1 üzerinde çalışılıyor: Create ThemeContext...
     [src/context/ThemeContext.tsx oluşturuldu]

     ✓ 1.1 Tamamlandı

     1.2 üzerinde çalışılıyor: Add CSS custom properties...
     [src/styles/globals.css güncellendi]

     ✓ 1.2 Tamamlandı
     ...
```

**İpuçları:**
- Kesintiye uğrarsa kaldığı yerden devam edebilir
- Değişiklik adını belirterek paralel değişiklikler için kullanın
- Tamamlama durumu `tasks.md` onay kutucuklarında takip edilir

---

### `/opsx:verify`

Uygulamanın değişikliğe uygun olup olmadığını doğrular. Tamamlanmışlık, doğruluk ve tutarlılık kontrolü yapar.

**Sözdizimi:**
```
/opsx:verify [change-name]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|---------|-------------|
| `change-name` | Hayır | Doğrulanacak değişiklik (sağlanmazsa bağlamdan çıkarılır) |

**Ne yapar:**
- Üç boyutta uygulama kalitesini kontrol eder
- Uygulama kanıtı için kod tabanını arar
- CRITICAL, WARNING veya SUGGESTION olarak kategorize edilmiş sorunları raporlar
- Arşivlemeyi engellemez, ancak sorunları görünür kılar

**Doğrulama boyutları:**

| Boyut | Ne doğrulanır |
|-----------|-------------------|
| **Completeness (Tamamlanmışlık)** | Tüm görevler tamamlandı mı, tüm gereksinimler uygulandı mı, senaryolar kapsandı mı |
| **Correctness (Doğruluk)** | Uygulama, spesifikasyon amacına uygun mu, uç durumlar ele alındı mı |
| **Coherence (Tutarlılık)** | Tasarım kararları koda yansıtıldı mı, desenler tutarlı mı |

**Örnek:**
```
You: /opsx:verify

AI:  add-dark-mode doğrulanıyor...

     TAMAMLANMIŞLIK
     ✓ tasks.md'deki 8 görevin tamamı işaretli
     ✓ Specs'teki tüm gereksinimler karşılık gelen koda sahip
     ⚠ "Sistem tercihi tespiti" senaryosunun test kapsamı yok

     DOĞRULUK
     ✓ Uygulama, spesifikasyon amacına uygun
     ✓ Senaryolardan kaynaklanan uç durumlar ele alındı
     ✓ Hata durumları spesifikasyon tanımlarıyla eşleşiyor

     TUTARLILIK
     ✓ Tasarım kararları kod yapısına yansıtıldı
     ✓ İsimlendirme kuralları design.md ile tutarlı
     ⚠ Tasarım "CSS değişkenlerini" belirtiyor ancak uygulama Tailwind sınıflarını kullanıyor

     ÖZET
     ─────────────────────────────
     Kritik sorunlar: 0
     Uyarılar: 2
     Arşivlemeye hazır: Evet (uyarılarla birlikte)

     Öneriler:
     1. Sistem tercihi tespiti için test ekleyin
     2. Tailwind kullanımı yansıtılmasını sağlamak veya CSS değişkenlerini kullanmak için design.md'yi güncelleyin
```

**İpuçları:**
- Hataları erken yakalamak için arşivlemeden önce çalıştırın
- Uyarılar arşivlemeyi engellemez ancak potansiyel sorunları gösterir
- Bir şeye bağlı kalmadan önce AI'nın işini gözden geçirmek için iyidir
- Artefaktlar ile uygulama arasındaki sapmayı ortaya çıkarabilir

---

### `/opsx:sync`

**İsteğe bağlı komut.** Bir değişiklikten gelen delta (fark) spesifikasyonlarını ana spesifikasyonlara birleştirir. Gerekirse arşivleme bunu soracaktır, bu yüzden genellikle manuel olarak çalıştırmanıza gerek yoktur.

**Sözdizimi:**
```
/opsx:sync [change-name]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|---------|-------------|
| `change-name` | Hayır | Senkronize edilecek değişiklik (sağlanmazsa bağlamdan çıkarılır) |

**Ne yapar:**
- Değişiklik klasöründen delta spesifikasyonlarını okur
- EKLEME/DEĞİŞTİRME/KALDIRMA/YENİDEN ADLANDIRMA bölümlerini ayrıştırır
- Değişiklikleri ana `openspec/specs/` dizinine birleştirir
- Delta'da bahsedilmeyen mevcut içeriği korur
- Değişikliği arşivlemez (aktif kalır)

**Örnek:**
```text
You: /opsx:sync

AI:  add-dark-mode delta spesifikasyonları senkronize ediliyor...

     Okunuyor: openspec/changes/add-dark-mode/specs/ui/spec.md
     Hedef:  openspec/specs/ui/spec.md

     Uygulanacak değişiklikler:
     ✓ EKLEME: Tema Seçimi gereksinimi (2 senaryo)
     ✓ EKLEME: Erişilebilirlik gereksinimi (1 senaryo)

     Birleştiriliyor...
     ✓ openspec/specs/ui/spec.md güncellendi

     Değişiklik aktif kalıyor. Tamamlamak için /opsx:archive komutunu çalıştırın.
```

**Ne zaman manuel olarak kullanılır:**

| Senaryo | Sync yapmalı mı? |
|----------|-----------|
| Uzun süren bir değişiklik, arşivlemeden önce ana spesifikasyonlarda olmasını istiyor | Evet |
| Birden fazla paralel değişikliğin güncellenmiş temel spesifikasyonlara ihtiyacı var | Evet |
| Birleştirmeyi ayrı olarak önizlemek/incelemek istiyorsunuz | Evet |
| Hızlı bir değişiklik, doğrudan arşivlemeye gidiliyor | Hayır (arşivleme bunu halleder) |

**İpuçları:**
- Sync akıllıdır, kopyala yapıştır değildir
- Mevcut gereksinimlere senaryolar ekleyebilir, tekrar etmeye gerek kalmaz
- Senkronizasyondan sonra değişiklik aktif kalır (arşivlenmez)
- Çoğu kullanıcı bunu doğrudan çağırmaya ihtiyacı olmayacaktır—gerekirse arşivleme soracaktır

---

### `/opsx:archive`

Tamamlanmış bir değişikliği arşivler. Değişikliği sonlandırır ve arşiv klasörüne taşır.

**Sözdizimi:**
```
/opsx:archive [change-name]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|---------|-------------|
| `change-name` | Hayır | Arşivlenecek değişiklik (sağlanmazsa bağlamdan çıkarılır) |

**Ne yapar:**
- Artefakt tamamlama durumunu kontrol eder
- Görev tamamlamasını kontrol eder (eksikse uyarır)
- Gerekirse delta spesifikasyonlarını senkronize etmeyi teklif eder
- Değişiklik klasörünü `openspec/changes/archive/YYYY-MM-DD-<name>/` konumuna taşır
- Denetim izi için tüm artefaktları korur

**Örnek:**
```text
You: /opsx:archive

AI:  add-dark-mode arşivleniyor...

     Artefakt durumu:
     ✓ proposal.md mevcut
     ✓ specs/ mevcut
     ✓ design.md mevcut
     ✓ tasks.md mevcut (8/8 görev tamamlandı)

     Delta spesifikasyonları: Henüz senkronize edilmedi
     → Şimdi Senkronize Et? (önerilir)

You: Evet

AI:  ✓ Specs, openspec/specs/ui/spec.md'ye senkronize edildi
     ✓ openspec/changes/archive/2025-01-24-add-dark-mode/ konumuna taşındı

     Değişiklik başarıyla arşivlendi.
```

**İpuçları:**
- Arşivleme, tamamlanmamış görevlerde takılmaz, ancak uyarır
- Delta spesifikasyonlar arşiv sırasında veya öncesinde senkronize edilebilir
- Arşivlenen değişiklikler geçmiş için korunur
- Hataları yakalamak için önce `/opsx:verify` kullanın

---

### `/opsx:bulk-archive`

Birden fazla tamamlanmış değişikliği tek seferde arşivler. Değişiklikler arasındaki spesifikasyon çatışmalarını yönetir.

**Sözdizimi:**
```
/opsx:bulk-archive [change-names...]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|---------|-------------|
| `change-names` | Hayır | Arşivlenecek belirli değişiklikler (sağlanmazsa seçmek için sorar) |

**Ne yapar:**
- Tüm tamamlanmış değişiklikleri listeler
- Arşivlemeden önce her bir değişikliği doğrular
- Değişiklikler arasındaki spesifikasyon çatışmalarını tespit eder
- Gerçekten neyin uygulandığını kontrol ederek çatışmaları çözer
- Kronolojik sırayla arşivler

**Örnek:**
```
You: /opsx:bulk-archive

AI:  3 tamamlanmış değişiklik bulundu:
     - add-dark-mode (8/8 görev tamamlandı)
     - fix-login-bug (3/3 görev tamamlandı)
     - update-footer (2/2 görev tamamlandı)

     Spesifikasyon çatışmaları kontrol ediliyor...
     ⚠ add-dark-mode ve update-footer ikisi de specs/ui'yi ilgilendiriyor

     Çözmek için kod tabanı inceleniyor...
     Her iki değişiklik de uygulanmış durumda. Kronolojik sırayla birleştirilecek:
     1. add-dark-mode (Ocak 20'de oluşturuldu)
     2. update-footer (Ocak 22'de oluşturuldu)

     3 değişikliğin tamamını arşivleyelim mi?

You: Evet

AI:  ✓ add-dark-mode arşivlendi
     ✓ fix-login-bug arşivlendi
     ✓ update-footer arşivlendi
     Specs birleştirildi: add-dark-mode → update-footer
```

**İpuçları:**
- Paralel çalışma akışları için iyidir
- Çatışma çözümü ajansiyal (kod tabanını kontrol eder)
- Değişiklikler oluşturulma sırasına göre arşivlenir
- Spesifikasyon içeriğini üzerine yazmadan önce sorar

---

### `/opsx:onboard`

Tam OpenSpec iş akışında rehberliğe dayalı oryantasyon. Gerçek kod tabanınızı kullanan etkileşimli bir eğitimdir.

**Sözdizimi:**
```
/opsx:onboard
```

**Ne yapar:**
- Anlatımla birlikte tam bir iş akışı döngüsünü yürütür
- Gerçek iyileştirme fırsatları için kod tabanınızı tarar
-Gerçek artefaktlarla gerçek bir değişiklik oluşturur
-Gerçek çalışma uygular (küçük, güvenli değişiklikler)
-Tamamlanan değişikliği arşivler
-Her adım gerçekleşirken onu açıklar

**Aşamalar:**
1. Karşılama ve kod tabanı analizi
2. Bir iyileştirme fırsatı bulma
3. Bir değişiklik oluşturma (`/opsx:new`)
4. Proposal (Teklif) yazma
5. Specs (Spesifikasyonlar) oluşturma
6. Tasarım yazma
7. Görevler oluşturma
8. Görevleri uygulama (`/opsx:apply`)
9. Uygulamayı doğrulama
10. Değişikliği arşivleme
11. Özet ve sonraki adımlar

**Örnek:**
```
You: /opsx:onboard

AI:  OpenSpec'e hoş geldiniz!

     Gerçek kod tabanınızı kullanarak tam iş akışını sizinle birlikte yürüteceğim.
     Küçük bir şeyi iyileştirmek, bunun için uygun bir değişiklik oluşturmak,
     uygulamak ve arşivlemek üzere bulacağız.

     Kod tabanınızı fırsatlar açısından tarıyorum...

     [Kod tabanını analiz ediyor]

     İnceleyebileceğimiz birkaç şey buldum:
     1. İletişim formu için girdi doğrulama ekleme
     2. Auth akışındaki hata mesajlarını iyileştirme
     3. Asenkron butonlara yüklenme durumları (loading states) ekleme

     Hangisi ilginizi çekiyor? (veya başka bir şey önerin)
```

**İpuçları:**
- İş akışını öğrenen yeni kullanıcılar için en iyisidir
- Oyuncak örnekler değil, gerçek kod kullanır
- Tutabilir veya atabilirsiniz, gerçek bir değişiklik oluşturur
- Tamamlanması 15-30 dakika sürer

## Yapay Zeka Aracına Göre Komut Sözdizimi

Farklı yapay zeka araçları biraz farklı komut sözdizimleri kullanır. Aracınıza uyan formatı kullanın:

| Tool | Syntax Example |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Skill-based invocations such as `/skill:openspec-propose`, `/skill:openspec-apply-change` (no generated `opsx-*` command files) |
| Trae | Skill-based invocations such as `/openspec-propose`, `/openspec-apply-change` (no generated `opsx-*` command files) |

Amaç tüm araçlarda aynıdır, ancak komutların nasıl sunulduğu entegrasyona göre farklılık gösterebilir.

> **Not:** GitHub Copilot komutları (`.github/prompts/*.prompt.md`) yalnızca IDE eklentilerinde (VS Code, JetBrains, Visual Studio) mevcuttur. GitHub Copilot CLI şu anda özel prompt dosyalarını desteklememektedir — ayrıntılar ve geçici çözümler için [Supported Tools](supported-tools.md)'a bakın.

---

## Eski Komutlar

Bu komutlar daha eski olan "tek seferde hepsini yapma" iş akışını kullanır. Bunlar hala çalışıyor ancak OPSX komutları önerilmektedir.

| Command | What it does |
|---------|--------------|
| `/openspec:proposal` | Create all artifacts at once (proposal, specs, design, tasks) |
| `/openspec:apply` | Implement the change |
| `/openspec:archive` | Archive the change |

**Eski Komutlar Ne Zaman Kullanılmalı:**
- Eski iş akışını kullanan mevcut projeler.
- Artımlı eser oluşturmaya ihtiyacınız olmayan basit değişiklikler.
- Her şey ya da hiçbir şey yaklaşımına öncelik verme.

**OPSX'e Geçiş:**
Eski değişiklikler OPSX komutları ile devam ettirilebilir. Eser (artifact) yapısı uyumludur.

---

## Sorun Giderme

### "Değişiklik Bulunamadı"

Komut, hangi değişikliğin üzerinde çalışılacağını belirleyemedi.

**Çözümler:**
- Değişiklik adını açıkça belirtin: `/opsx:apply add-dark-mode`
- Değişiklik klasörünün var olup olmadığını kontrol edin: `openspec list`
- Doğru proje dizininde olduğunuzu doğrulayın.

### "Hazır Eser Yok"

Tüm eserler ya tamamlanmıştır ya da eksik bağımlılıklar nedeniyle engellenmiştir.

**Çözümler:**
- Neyin engel olduğunu görmek için `openspec status --change <name>` komutunu çalıştırın.
- Gerekli eserlerin var olup olmadığını kontrol edin.
- Önce eksik bağımlılık eserlerini oluşturun.

### "Şema Bulunamadı"

Belirtilen şema mevcut değil.

**Çözümler:**
- Mevcut şemaları listeleyin: `openspec schemas`
- Şema adının yazılışını kontrol edin.
- Eğer özel ise, şemayı oluşturun: `openspec schema init <name>`

### Komutlar Tanınmıyor

Yapay zeka aracı, OpenSpec komutlarını tanımamaktadır.

**Çözümler:**
- OpenSpec'in başlatıldığından emin olun: `openspec init`
- Becerileri yeniden oluşturun: `openspec update`
- `.claude/skills/` dizininin var olup olmadığını kontrol edin (Claude Code için).
- Yeni becerileri algılamak için yapay zeka aracınızı yeniden başlatın.

### Eserler Doğru Şekilde Oluşturulmuyor

Yapay zeka eksik veya yanlış eserler oluşturmaktadır.

**Çözümler:**
- `openspec/config.yaml` dosyasına proje bağlamı ekleyin.
- Özel rehberlik için eser bazlı kurallar ekleyin.
- Değişiklik açıklamanızda daha fazla ayrıntı sağlayın.
- Daha fazla kontrol için `/opsx:ff` yerine `/opsx:continue` kullanın.

---

## Sonraki Adımlar

- [İş Akışları](workflows.md) - Yaygın kalıplar ve her komutu ne zaman kullanacağınız
- [CLI](cli.md) - Yönetim ve doğrulama için terminal komutları
- [Özelleştirme](customization.md) - Özel şemalar ve iş akışları oluşturma