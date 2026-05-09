# Komutlar

Bu belge, OpenSpec'in eğik çizgi komutları için referans niteliğindedir. Bu komutlar, yapay zeka kodlama asistanınızın sohbet arayüzünde (örneğin, Claude Code, Cursor, Windsurf) çağrılır.

İş akışı kalıpları ve her komutun ne zaman kullanılacağı için [İş Akışları](workflows.md) bölümüne bakın. CLI komutları için bkz. [CLI](cli.md).

## Hızlı Referans

### Varsayılan Hızlı Yol (`core` profili)

| Komut | Amaç |
|---------|---------|
| `/opsx:propose` | Tek adımda bir değişiklik oluşturun ve planlama çıktıları üretin |
| `/opsx:explore` | Bir değişikliğe karar vermeden önce fikirleri düşünün |
| `/opsx:apply` | Değişiklikteki görevleri uygulayın |
| `/opsx:sync` | Delta spesifikasyonlarını ana spesifikasyonlarla birleştirin |
| `/opsx:archive` | Tamamlanmış bir değişikliği arşivleyin |

### Genişletilmiş İş Akışı Komutları (özel iş akışı seçimi)

| Komut | Amaç |
|---------|---------|
| `/opsx:new` | Yeni bir değişiklik iskelesi başlatın |
| `/opsx:continue` | Bağımlılıklara dayalı olarak bir sonraki çıktıyı oluşturun |
| `/opsx:ff` | Hızlı ileri: Tüm planlama çıktılarını bir kerede oluşturun |
| `/opsx:verify` | Uygulamanın çıktılarla eşleştiğini doğrulayın |
| `/opsx:bulk-archive` | Birden fazla değişikliği bir kerede arşivleyin |
| `/opsx:onboard` | Tam iş akışı boyunca yönlendirmeli eğitim |

Varsayılan global profil `core`'dur. Genişletilmiş iş akışı komutlarını etkinleştirmek için `openspec config profile` komutunu çalıştırın, iş akışlarını seçin, ardından projenizde `openspec update` komutunu çalıştırın.

---

## Komut Referansı

### `/opsx:propose`

Tek adımda yeni bir değişiklik oluşturun ve planlama yapıtları üretin. Bu, `core` profilindeki varsayılan başlangıç komutudur.

**Sözdizimi:**
```text
/opsx:propose [değişiklik-adı-veya-açıklaması]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `değişiklik-adı-veya-açıklaması` | Hayır | Kebab-case ad veya düz metin değişiklik açıklaması |

**Ne yapar:**
- `openspec/changes/<değişiklik-adı>/` oluşturur
- Uygulamadan önce gerekli yapıtları üretir (`spec-driven` için: öneri, spesifikasyonlar, tasarım, görevler)
- Değişiklik `/opsx:apply` için hazır olduğunda durur

**Örnek:**
```text
Siz: /opsx:propose add-dark-mode

Yapay Zeka:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Uygulama için hazır. /opsx:apply komutunu çalıştırın.
```

**İpuçları:**
- En hızlı uçtan uca yol için bunu kullanın
- Adım adım yapıt kontrolü istiyorsanız, genişletilmiş iş akışlarını etkinleştirin ve `/opsx:new` + `/opsx:continue` kullanın

---

### `/opsx:explore`

Bir değişikliğe karar vermeden önce fikirleri düşünün, sorunları araştırın ve gereksinimleri netleştirin.

**Sözdizimi:**
```
/opsx:explore [konu]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `konu` | Hayır | Keşfetmek veya araştırmak istediğiniz şey |

**Ne yapar:**
- Yapı gerektirmeyen keşif amaçlı bir konuşma açar
- Soruları yanıtlamak için kod tabanını araştırır
- Seçenekleri ve yaklaşımları karşılaştırır
- Düşünceyi netleştirmek için görsel şemalar oluşturur
- İçgörüler somutlaştığında `/opsx:propose`'a (varsayılan) veya `/opsx:new`'e (genişletilmiş iş akışı) geçebilir

**Örnek:**
```text
Siz: /opsx:explore

Yapay Zeka:  Neyi keşfetmek istersiniz?

Siz: Mobil uygulama için kimlik doğrulamayı nasıl ele almalıyız?

Yapay Zeka:  Mevcut kimlik doğrulama kurulumunuzu inceleyeyim...
     [Kod tabanını analiz eder]

     Web uygulaması için oturum tabanlı kimlik doğrulama kullandığınızı görüyorum.
     Mobil için üç ana seçeneğimiz var:

     1. JWT belirteçleri (durumsuz, çevrimdışı çalışır)
     2. OAuth2 (üçüncü taraf oturum açma gerekiyorsa)
     3. Mevcut oturumları genişletin (daha basit, ancak bağlantı gerektirir)

     API'nizde zaten CORS yapılandırılmış. Sizi hangi yön ilgilendiriyor?

Siz: JWT ile gidelim. Bunun için bir değişiklik başlatabilir miyiz?

Yapay Zeka:  Hazır olduğunuzda. Başlamak için /opsx:propose add-jwt-auth komutunu çalıştırın.
```

**İpuçları:**
- Gereksinimler net olmadığında veya araştırmanız gerektiğinde kullanın
- Keşif sırasında yapıt oluşturulmaz
- Karar vermeden önce birden fazla yaklaşımı karşılaştırmak için iyidir
- Dosyaları okuyabilir ve kod tabanında arama yapabilir

---

### `/opsx:new`

Yeni bir değişiklik iskelesi başlatır. Değişiklik klasörünü oluşturur ve `/opsx:continue` veya `/opsx:ff` ile yapıt üretmenizi bekler.

Bu komut, genişletilmiş iş akışı setinin bir parçasıdır (varsayılan `core` profiline dahil değildir).

**Sözdizimi:**
```
/opsx:new [değişiklik-adı] [--schema <şema-adı>]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `değişiklik-adı` | Hayır | Değişiklik klasörü için ad (belirtilmezse sorulur) |
| `--schema` | Hayır | Kullanılacak iş akışı şeması (varsayılan: yapılandırmadan veya `spec-driven`) |

**Ne yapar:**
- `openspec/changes/<değişiklik-adı>/` dizini oluşturur
- Değişiklik klasöründe `.openspec.yaml` meta veri dosyası oluşturur
- Oluşturmaya hazır ilk yapıt şablonunu gösterir
- Belirtilmezse değişiklik adı ve şema için istemde bulunur

**Ne oluşturur:**
```
openspec/changes/<değişiklik-adı>/
└── .openspec.yaml    # Değişiklik meta verileri (şema, oluşturulma tarihi)
```

**Örnek:**
```
Siz: /opsx:new add-dark-mode

Yapay Zeka:  Created openspec/changes/add-dark-mode/
     Şema: spec-driven

     Oluşturmaya hazır: proposal
     Oluşturmak için /opsx:continue veya tüm yapıtları oluşturmak için /opsx:ff kullanın.
```

**İpuçları:**
- Açıklayıcı adlar kullanın: `add-feature`, `fix-bug`, `refactor-module`
- `update`, `changes`, `wip` gibi genel adlardan kaçının
- Şema ayrıca proje yapılandırmasında (`openspec/config.yaml`) ayarlanabilir

---

### `/opsx:continue`

Bağımlılık zincirindeki bir sonraki yapıtı oluşturur. Artımlı ilerleme için seferde bir yapıt oluşturur.

**Sözdizimi:**
```
/opsx:continue [değişiklik-adı]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `değişiklik-adı` | Hayır | Hangi değişikliğe devam edilecek (belirtilmezse bağlamdan çıkarılır) |

**Ne yapar:**
- Yapıt bağımlılık grafiğini sorgular
- Hangi yapıtların hazır olduğunu, hangilerinin engellendiğini gösterir
- İlk hazır yapıtı oluşturur
- Bağlam için bağımlılık dosyalarını okur
- Oluşturma sonrası nelerin kullanılabilir hale geldiğini gösterir

**Örnek:**
```
Siz: /opsx:continue

Yapay Zeka:  Değişiklik: add-dark-mode

     Yapıt durumu:
     ✓ proposal    (tamamlandı)
     ◆ specs       (hazır)
     ◆ design      (hazır)
     ○ tasks       (engellendi - gereken: specs)

     specs oluşturuluyor...

     [proposal.md okunur, gereksinimlere göre specs oluşturulur]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Şimdi kullanılabilir: tasks
     Bir sonraki yapıtı oluşturmak için /opsx:continue komutunu çalıştırın.
```

**İpuçları:**
- Devam etmeden önce her yapıtı incelemek istediğinizde kullanın
- Kontrol istediğiniz karmaşık değişiklikler için iyidir
- Birden fazla yapıt aynı anda hazır hale gelebilir
- Devam etmeden önce oluşturulan yapıtları düzenleyebilirsiniz

---

### `/opsx:ff`

Yapıt oluşturmada hızlı ileri sar. Tüm planlama yapıtlarını tek seferde oluşturur.

**Sözdizimi:**
```
/opsx:ff [değişiklik-adı]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `değişiklik-adı` | Hayır | Hangi değişiklik hızlı ileri sarılacak (belirtilmezse bağlamdan çıkarılır) |

**Ne yapar:**
- Tüm yapıtları bağımlılık sırasına göre oluşturur
- İlerlemeyi yapılacaklar listesi aracılığıyla takip eder
- Tüm `apply-required` yapıtları tamamlandığında durur
- Bir sonraki yapıtı oluşturmadan önce her bağımlılığı okur

**Örnek:**
```
Siz: /opsx:ff add-dark-mode

Yapay Zeka:  add-dark-mode hızlı ileri sarılıyor...

     ✓ proposal.md oluşturuluyor
     ✓ specs/ui/spec.md oluşturuluyor
     ✓ design.md oluşturuluyor
     ✓ tasks.md oluşturuluyor

     Tüm planlama yapıtları tamamlandı!
     Uygulama için hazır. Başlamak için /opsx:apply komutunu çalıştırın.
```

**İpuçları:**
- Ne inşa ettiğiniz hakkında net bir resminiz olduğunda kullanın
- Doğrudan değişiklikler için `/opsx:continue`'dan daha hızlıdır
- Yine de daha sonra yapıtları düzenleyebilirsiniz
- Küçük ve orta ölçekli özellikler için iyidir

---

### `/opsx:apply`

Değişiklikteki görevleri uygula. Görev listesi üzerinde çalışır, kod yazar ve maddeleri işaretler.

**Sözdizimi:**
```
/opsx:apply [değişiklik-adı]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `değişiklik-adı` | Hayır | Hangi değişiklik uygulanacak (belirtilmezse bağlamdan çıkarılır) |

**Ne yapar:**
- `tasks.md` dosyasını okur ve tamamlanmamış görevleri belirler
- Görevler üzerinde tek tek çalışır
- Gerektiğinde kod yazar, dosya oluşturur, testleri çalıştırır
- Görevleri `[x]` onay kutularıyla tamamlandı olarak işaretler

**Örnek:**
```
Siz: /opsx:apply

Yapay Zeka:  add-dark-mode uygulanıyor...

     tasks.md okunuyor:
     - [ ] 1.1 ThemeContext oluştur
     - [ ] 1.2 CSS özel özellikleri ekle
     - [ ] 1.3 localStorage kalıcılığını uygula

     1.1 üzerinde çalışılıyor: ThemeContext oluşturuluyor...
     [src/context/ThemeContext.tsx oluşturuluyor]

     ✓ 1.1 Tamamlandı

     1.2 üzerinde çalışılıyor: CSS özel özellikleri ekleniyor...
     [src/styles/globals.css güncelleniyor]

     ✓ 1.2 Tamamlandı
     ...
```

**İpuçları:**
- Kesintiye uğrarsa kaldığınız yerden devam edebilir
- Değişiklik adını belirterek paralel değişiklikler için kullanın
- Tamamlanma durumu `tasks.md` onay kutularında takip edilir

---

### `/opsx:verify`

Uygulamanın değişiklik yapıtlarınızla eşleştiğini doğrula. Bütünlüğü, doğruluğu ve tutarlılığı kontrol eder.

**Sözdizimi:**
```
/opsx:verify [değişiklik-adı]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `değişiklik-adı` | Hayır | Hangi değişiklik doğrulanacak (belirtilmezse bağlamdan çıkarılır) |

**Ne yapar:**
- Uygulama kalitesinin üç boyutunu kontrol eder
- Uygulama kanıtı için kod tabanını tarar
- SORUNLU, UYARI veya ÖNERİ olarak sınıflandırılmış sorunları raporlar
- Arşivlemeyi engellemez, ancak sorunları ortaya çıkarır

**Doğrulama boyutları:**

| Boyut | Ne doğrular |
|-----------|-------------------|
| **Bütünlük** | Tüm görevler yapılmış, tüm gereksinimler uygulanmış, senaryolar kapsanmış |
| **Doğruluk** | Uygulama spec amacına uygun, kenar durumlar ele alınmış |
| **Tutarlılık** | Tasarım kararları kodda yansıtılıyor, kalıplar tutarlı |

**Örnek:**
```
Siz: /opsx:verify

Yapay Zeka:  add-dark-mode doğrulanıyor...

     BÜTÜNLÜK
     ✓ tasks.md'deki tüm 8 görev işaretli
     ✓ specs'teki tüm gereksinimlerin karşılık gelen kodu var
     ⚠ "Sistem tercihi algılama" senaryosunun test kapsamı yok

     DOĞRULUK
     ✓ Uygulama spec amacına uygun
     ✓ Senaryolardaki kenar durumlar ele alınmış
     ✓ Hata durumları spec tanımlarıyla eşleşiyor

     TUTARLILIK
     ✓ Tasarım kararları kod yapısında yansıtılıyor
     ✓ Adlandırma kuralları design.md ile tutarlı
     ⚠ Tasarım "CSS değişkenleri"nden bahsediyor ancak uygulama Tailwind sınıfları kullanıyor

     ÖZET
     ─────────────────────────────
     Kritik sorunlar: 0
     Uyarılar: 2
     Arşivlemeye hazır: Evet (uyarılarla)

     Öneriler:
     1. Sistem tercihi algılama için test ekleyin
     2. Tailwind kullanımını yansıtmak için design.md'yi güncelleyin veya CSS değişkenleri kullanmak için yeniden düzenleyin
```

**İpuçları:**
- Uyuşmazlıkları erken yakalamak için arşivlemeden önce çalıştırın
- Uyarılar arşivlemeyi engellemez ancak potansiyel sorunları gösterir
- Taahhüt etmeden önce yapay zekanın çalışmasını gözden geçirmek için iyidir
- Yapıtlar ve uygulama arasındaki sapmaları ortaya çıkarabilir

---

### `/opsx:sync`

**İsteğe bağlı komut.** Bir değişiklikteki delta spesifikasyonlarını ana spesifikasyonlarla birleştirin. Arşivleme, gerekirse senkronize etmenizi isteyecektir, bu nedenle bunu genellikle manuel olarak çalıştırmanız gerekmez.

**Sözdizimi:**
```
/opsx:sync [değişiklik-adı]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `değişiklik-adı` | Hayır | Hangi değişiklik senkronize edilecek (belirtilmezse bağlamdan çıkarılır) |

**Ne yapar:**
- Değişiklik klasöründeki delta spesifikasyonlarını okur
- EKLENEN/DEĞİŞTİRİLEN/KALDIRILAN/YENİDEN ADLANDIRILAN bölümleri ayrıştırır
- Değişiklikleri ana `openspec/specs/` dizinine birleştirir
- Delta'da bahsedilmeyen mevcut içeriği korur
- Değişikliği arşivlemez (aktif kalır)

**Örnek:**
```text
Siz: /opsx:sync

Yapay Zeka:  add-dark-mode delta spesifikasyonları senkronize ediliyor...

     Okunuyor: openspec/changes/add-dark-mode/specs/ui/spec.md
     Hedef:  openspec/specs/ui/spec.md

     Uygulanacak değişiklikler:
     ✓ EKLENEN: Tema Seçimi gereksinimi (2 senaryo)
     ✓ EKLENEN: Erişilebilirlik gereksinimi (1 senaryo)

     Birleştiriliyor...
     ✓ openspec/specs/ui/spec.md güncellendi

     Değişiklik aktif kalır. Tamamlamak için hazır olduğunuzda /opsx:archive komutunu çalıştırın.
```

**Ne zaman manuel kullanılır:**

| Senaryo | sync kullanılsın mı? |
|----------|-----------|
| Uzun süren değişiklik, arşivlemeden önce ana spesifikasyonlarda isteniyor | Evet |
| Birden fazla paralel değişiklik güncellenmiş temel spesifikasyonlara ihtiyaç duyuyor | Evet |
| Birleştirmeyi ayrı olarak önizlemek/gözden geçirmek isteniyor | Evet |
| Hızlı değişiklik, doğrudan arşivlemeye gidiliyor | Hayır (arşivleme halleder) |

**İpuçları:**
- Senkronizasyon akıllıdır, kopyala-yapıştır değildir
- Mevcut gereksinimlere senaryo ekleyebilir, tekrarlamadan
- Senkronizasyon sonrası değişiklik aktif kalır (arşivlenmez)
- Çoğu kullanıcının bunu doğrudan çağırması gerekmeyecektir—arşivleme gerekirse ister

---

### `/opsx:archive`

Tamamlanmış bir değişikliği arşivle. Değişikliği sonlandırır ve arşiv klasörüne taşır.

**Sözdizimi:**
```
/opsx:archive [değişiklik-adı]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `değişiklik-adı` | Hayır | Hangi değişiklik arşivlenecek (belirtilmezse bağlamdan çıkarılır) |

**Ne yapar:**
- Yapıt tamamlanma durumunu kontrol eder
- Görev tamamlanmasını kontrol eder (tamamlanmamışsa uyarır)
- Henüz senkronize edilmemişse delta spesifikasyonlarını senkronize etmeyi teklif eder
- Değişiklik klasörünü `openspec/changes/archive/YYYY-MM-DD-<ad>/` konumuna taşır
- Denetim izi için tüm yapıtları korur

**Örnek:**
```text
Siz: /opsx:archive

Yapay Zeka:  add-dark-mode arşivleniyor...

     Yapıt durumu:
     ✓ proposal.md mevcut
     ✓ specs/ mevcut
     ✓ design.md mevcut
     ✓ tasks.md mevcut (8/8 görev tamamlandı)

     Delta spesifikasyonları: Henüz senkronize edilmedi
     → Şimdi senkronize edilsin mi? (önerilir)

Siz: Evet

Yapay Zeka:  ✓ specs/ui/spec.md'ye senkronize edildi
     ✓ openspec/changes/archive/2025-01-24-add-dark-mode/ konumuna taşındı

     Değişiklik başarıyla arşivlendi.
```

**İpuçları:**
- Arşivleme tamamlanmamış görevleri engellemez, ancak uyarır
- Delta spesifikasyonları arşivleme sırasında veya öncesinde senkronize edilebilir
- Arşivlenen değişiklikler geçmiş için korunur
- Sorunları yakalamak için önce `/opsx:verify` kullanın

---

### `/opsx:bulk-archive`

Birden fazla tamamlanmış değişikliği tek seferde arşivle. Değişiklikler arasındaki spec çakışmalarını ele alır.

**Sözdizimi:**
```
/opsx:bulk-archive [değişiklik-adları...]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `değişiklik-adları` | Hayır | Arşivlenecek belirli değişiklikler (belirtilmezse seçim yapmanız istenir) |

**Ne yapar:**
- Tüm tamamlanmış değişiklikleri listeler
- Arşivlemeden önce her değişikliği doğrular
- Değişiklikler arasında spec çakışmalarını tespit eder
- Çakışmaları aslında neyin uygulandığını kontrol ederek çözer
- Kronolojik sırayla arşivler

**Örnek:**
```
Siz: /opsx:bulk-archive

Yapay Zeka:  3 tamamlanmış değişiklik bulundu:
     - add-dark-mode (8/8 görev tamamlandı)
     - fix-login-bug (3/3 görev tamamlandı)
     - update-footer (2/2 görev tamamlandı)

     Spec çakışmaları kontrol ediliyor...
     ⚠ add-dark-mode ve update-footer her ikisi de specs/ui/ dosyasını etkiliyor

     Çözüm için kod tabanı inceleniyor...
     Her iki değişiklik de uygulanmış. Kronolojik sırayla birleştirilecek:
     1. add-dark-mode (20 Ocak'ta oluşturuldu)
     2. update-footer (22 Ocak'ta oluşturuldu)

     Tüm 3 değişiklik arşivlensin mi?

Siz: Evet

Yapay Zeka:  ✓ add-dark-mode arşivlendi
     ✓ fix-login-bug arşivlendi
     ✓ update-footer arşivlendi
     Specs birleştirildi: add-dark-mode → update-footer
```

**İpuçları:**
- Paralel çalışma akışları için iyidir
- Çakışma çözümü ajanseldir (kod tabanını kontrol eder)
- Değişiklikler oluşturulma sırasına göre arşivlenir
- Spec içeriğinin üzerine yazmadan önce sorar

---

### `/opsx:onboard`

Eksiksiz OpenSpec iş akışında rehberli oryantasyon. Gerçek kod tabanınızı kullanan interaktif bir öğretici.

**Sözdizimi:**
```
/opsx:onboard
```

**Ne yapar:**
- Anlatımlı eksiksiz bir iş akışı döngüsünde yürür
- Gerçek iyileştirme fırsatları için kod tabanınızı tarar
- Gerçek yapıtlarla gerçek bir değişiklik oluşturur
- Gerçek çalışmayı uygular (küçük, güvenli değişiklikler)
- Tamamlanmış değişikliği arşivler
- Her adımı gerçekleşirken açıklar

**Aşamalar:**
1. Karşılama ve kod tabanı analizi
2. Bir iyileştirme fırsatı bulma
3. Bir değişiklik oluşturma (`/opsx:new`)
4. Öneriyi yazma
5. Spesifikasyonları oluşturma
6. Tasarımı yazma
7. Görevleri oluşturma
8. Görevleri uygulama (`/opsx:apply`)
9. Uygulamayı doğrulama
10. Değişikliği arşivleme
11. Özet ve sonraki adımlar

**Örnek:**
```
Siz: /opsx:onboard

Yapay Zeka:  OpenSpec'e hoş geldiniz!

     Sizi gerçek kod tabanınızı kullanarak eksiksiz iş akışında yürüteceğim.
     İyileştirmek için küçük bir şey bulacağız, bunun için düzgün bir değişiklik oluşturacağız,
     uygulayacağız ve arşivleyeceğiz.

     Fırsatlar için kod tabanınızı tarayayım...

     [Kod tabanını analiz eder]

     Üzerinde çalışabileceğimiz birkaç şey buldum:
     1. İletişim formuna girdi doğrulama ekleyin
     2. Kimlik doğrulama akışındaki hata mesajlarını iyileştirin
     3. Asenkron düğmelere yükleme durumları ekleyin

     Sizi hangisi ilgilendirir? (veya başka bir şey önerin)
```

**İpuçları:**
- İş akışını öğrenen yeni kullanıcılar için en iyisidir
- Oyuncak örnekler yerine gerçek kod kullanır
- Saklayabileceğiniz veya atabileceğiniz gerçek bir değişiklik oluşturur
- Tamamlanması 15-30 dakika sürer

---

## Yapay Zeka Aracına Göre Komut Sözdizimi

Farklı yapay zeka araçları biraz farklı komut sözdizimleri kullanır. Aracınıza uygun biçimi kullanın:

| Araç | Sözdizimi Örneği |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | `/skill:openspec-propose`, `/skill:openspec-apply-change` gibi beceri tabanlı çağırmalar (oluşturulan `opsx-*` komut dosyaları yoktur) |
| Trae | `/openspec-propose`, `/openspec-apply-change` gibi beceri tabanlı çağırmalar (oluşturulan `opsx-*` komut dosyaları yoktur) |

Tüm araçlarda amaç aynıdır, ancak komutların nasıl sunulduğu entegrasyona göre farklılık gösterebilir.

> **Not:** GitHub Copilot komutları (`.github/prompts/*.prompt.md`) yalnızca IDE eklentilerinde (VS Code, JetBrains, Visual Studio) kullanılabilir. GitHub Copilot CLI şu anda özel komut dosyalarını desteklemiyor — ayrıntılar ve geçici çözümler için [Desteklenen Araçlar](supported-tools.md) bölümüne bakın.

---

## Eski Komutlar

Bu komutlar daha eski "hepsi bir anda" iş akışını kullanır. Hâlâ çalışırlar ancak OPSX komutları önerilir.

| Komut | Ne yapar |
|---------|--------------|
| `/openspec:proposal` | Tüm ürünleri bir anda oluştur (öneri, spesifikasyonlar, tasarım, görevler) |
| `/openspec:apply` | Değişikliği uygula |
| `/openspec:archive` | Değişikliği arşivle |

**Eski komutlar ne zaman kullanılır:**
- Eski iş akışını kullanan mevcut projeler
- Artımlı ürün oluştirmaya ihtiyaç duymadığınız basit değişiklikler
- Hep ya da hiç yaklaşımını tercih etme

**OPSX'e geçiş:**
Eski değişiklikler OPSX komutlarıyla devam ettirilebilir. Ürün yapısı uyumludur.

---

## Sorun Giderme

### "Değişiklik bulunamadı"

Komut, üzerinde çalışılacak değişikliği tanımlayamadı.

**Çözümler:**
- Değişiklik adını açıkça belirtin: `/opsx:apply add-dark-mode`
- Değişiklik klasörünün var olup olmadığını kontrol edin: `openspec list`
- Doğru proje dizininde olduğunuzu doğrulayın

### "Hazır ürün yok"

Tüm ürünler tamamlanmış veya eksik bağımlılıklar tarafından engellenmiş durumda.

**Çözümler:**
- Neyin engellediğini görmek için `openspec status --change <ad>` komutunu çalıştırın
- Gerekli ürünlerin var olup olmadığını kontrol edin
- Önce eksik bağımlılık ürünlerini oluşturun

### "Şema bulunamadı"

Belirtilen şema mevcut değil.

**Çözümler:**
- Mevcut şemaları listeleyin: `openspec schemas`
- Şema adının yazılışını kontrol edin
- Özel bir şemaysa oluşturun: `openspec schema init <ad>`

### Komutlar tanınmıyor

Yapay zeka aracı OpenSpec komutlarını tanımıyor.

**Çözümler:**
- OpenSpec'in başlatıldığından emin olun: `openspec init`
- Becerileri yeniden oluşturun: `openspec update`
- `.claude/skills/` dizininin var olduğunu kontrol edin (Claude Code için)
- Yeni becerileri almak için yapay zeka aracınızı yeniden başlatın

### Ürünler düzgün oluşturulmuyor

Yapay zeka eksik veya hatalı ürünler oluşturuyor.

**Çözümler:**
- `openspec/config.yaml` dosyasına proje bağlamı ekleyin
- Belirli yönergeler için ürüne özel kurallar ekleyin
- Değişiklik açıklamanızda daha fazla ayrıntı sağlayın
- Daha fazla kontrol için `/opsx:ff` yerine `/opsx:continue` kullanın

---

## Sonraki Adımlar

- [İş Akışları](workflows.md) - Yaygın kalıplar ve her komutun ne zaman kullanılacağı
- [CLI](cli.md) - Yönetim ve doğrulama için terminal komutları
- [Özelleştirme](customization.md) - Özel şemalar ve iş akışları oluşturma