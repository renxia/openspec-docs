# Komutlar

Bu, OpenSpec'in eğik çizgi komutları için referans dokümanıdır. Bu komutlar, yapay zeka kod asistanınızın sohbet arayüzünde (örneğin Claude Code, Cursor, Windsurf) çağrılır.

İş akışı kalıpları ve her komutun ne zaman kullanılacağı hakkında bilgi için [İş Akışları](workflows.md) belgesine bakın. CLI komutları için [CLI](cli.md) belgesine bakın.

## Hızlı Referans

### Varsayılan Hızlı Yol (`core` profili)

| Komut | Amaç |
|---------|---------|
| `/opsx:propose` | Tek adımda bir değişiklik oluşturun ve planlama yapıtlarını üretin |
| `/opsx:explore` | Bir değişikliğe bağlanmadan önce fikirleri değerlendirin |
| `/opsx:apply` | Değişiklikteki görevleri uygulayın |
| `/opsx:update` | Bir değişikliğin planlama yapıtlarını düzeltin ve tutarlılığını koruyun |
| `/opsx:sync` | Delta spesifikasyonları ana spesifikasyonlarla birleştirin |
| `/opsx:archive` | Tamamlanmış bir değişikliği arşivleyin |

### Genişletilmiş İş Akışı Komutları (özel iş akışı seçimi)

| Komut | Amaç |
|---------|---------|
| `/opsx:new` | Yeni bir değişiklik iskeleti başlatın |
| `/opsx:continue` | Bağımlılıklara dayanarak bir sonraki yapıtı oluşturun |
| `/opsx:ff` | Hızlı ilerletme: tüm planlama yapıtlarını tek seferde oluşturun |
| `/opsx:verify` | Uygulamanın yapıtlarla eşleştiğini doğrulayın |
| `/opsx:bulk-archive` | Birden fazla değişikliği tek seferde arşivleyin |
| `/opsx:onboard` | Tam iş akışı boyunca rehberli eğitim alın |

Varsayılan global profil `core`'dur. Genişletilmiş iş akışı komutlarını etkinleştirmek için `openspec config profile` komutunu çalıştırın, iş akışlarını seçin, ardından projenizde `openspec update` komutunu çalıştırın.

## Komut Referansı

### `/opsx:propose`

Tek değişiklik oluşturun ve tek adımda planlama eserlerini üretin. Bu, `core` profilindeki varsayılan başlangıç komutudur.

**Sözdizimi:**
```text
/opsx:propose [change-name-or-description]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `change-name-or-description` | Hayır | Kebab-case ad veya basit dille yazılmış değişiklik açıklaması |

**Ne yapar:**
- `openspec/changes/<change-name>/` dizinini oluşturur
- Uygulama öncesinde gerekli eserleri üretir (`spec-driven` için: proposal, specs, design, tasks)
- Değişiklik `/opsx:apply` komutu için hazır olduğunda durur

**Örnek:**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```
Çevirisi:
```text
You: /opsx:propose add-dark-mode

AI:  openspec/changes/add-dark-mode/ dizini oluşturuldu
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Uygulamaya hazır. /opsx:apply komutunu çalıştırın.
```

**İpuçları:**
- En hızlı uçtan uca yol için bunu kullanın
- Adım adım eser kontrolü istiyorsanız, genişletilmiş iş akışlarını etkinleştirin ve `/opsx:new` + `/opsx:continue` komutlarını kullanın

---

### `/opsx:explore`

> **Emin değilseniz buradan başlayın.** Explore, hiç riski olmayan bir düşünme ortağıdır: kod tabanınızı okur, seçenekleri karşılaştırır ve herhangi bir değişiklik oluşturulmadan önce bulanık bir fikri somut bir plana dönüştürür. Varsayılan profilde yer alır. Tam vaka ve daha fazla örnek için [Explore First](explore.md) rehberine bakın.

Fikirleri düşünün, sorunları araştırın ve bir değişikliğe bağlanmadan önce gereksinimleri netleştirin.

**Sözdizimi:**
```
/opsx:explore [topic]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `topic` | Hayır | Keşfetmek veya araştırmak istediğiniz konu |

**Ne yapar:**
- Herhangi bir yapı gerektirmeyen keşif amaçlı bir konuşma başlatır
- Soruları cevaplamak için kod tabanını araştırır
- Seçenekleri ve yaklaşımları karşılaştırır
- Düşünceleri netleştirmek için görsel diyagramlar oluşturur
- İçgörüler somutlaştığında `/opsx:propose` (varsayılan) veya `/opsx:new` (genişletilmiş iş akışı) komutuna geçebilir

**Örnek:**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT. Can we start a change for that?

AI:  Ready when you are. Run /opsx:propose add-jwt-auth to begin.
```
Çevirisi:
```text
You: /opsx:explore

AI:  Ne keşfetmek istersiniz?

You: Mobil uygulama için kimlik doğrulama işlemini nasıl yönetmeliyiz?

AI:  Mevcut kimlik doğrulama (auth) kurulumunuzu araştırayım...
     [Kod tabanını analiz ediyor]

     Web uygulaması için oturum tabanlı (session-based) kimlik doğrulama kullandığınızı görüyorum.
     Mobil için üç ana seçeneğimiz var:

     1. JWT token'ları (durumsuz, çevrimdışı çalışır)
     2. OAuth2 (üçüncü parti giriş gerekiyorsa)
     3. Mevcut oturumları genişlet (daha basit, ancak bağlantı gerektirir)

     API'nizde zaten CORS yapılandırılmış. Hangi yön ilginizi çekiyor?

You: JWT ile devam edelim. Bunun için bir değişiklik başlatabilir miyiz?

AI:  Hazırım. Başlamak için /opsx:propose add-jwt-auth komutunu çalıştırın.
```

**İpuçları:**
- Gereksinimler belirsizse veya araştırma yapmanız gerektiğinde kullanın
- Keşif sırasında hiçbir eser oluşturulmaz
- Karar vermeden önce birden fazla yaklaşımı karşılaştırmak için iyidir
- Dosyaları okuyabilir ve kod tabanında arama yapabilir

---

### `/opsx:new`

Yeni bir değişiklik iskeleti oluştur. Değişiklik klasörünü oluşturur ve `/opsx:continue` veya `/opsx:ff` komutlarıyla eser üretmenizi bekler.

Bu komut, genişletilmiş iş akışı setinin bir parçasıdır (varsayılan `core` profiline dahil değildir).

**Sözdizimi:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `change-name` | Hayır | Değişiklik klasörü için ad (verilmezse sorulur) |
| `--schema` | Hayır | Kullanılacak iş akışı şeması (varsayılan: yapılandırmadan veya `spec-driven`) |

**Ne yapar:**
- `openspec/changes/<change-name>/` dizinini oluşturur
- Değişiklik klasörüne `.openspec.yaml` üstveri dosyası oluşturur
- Oluşturulmaya hazır ilk eser şablonunu gösterir
- Verilmezse değişiklik adı ve şeması için giriş ister

**Ne oluşturur:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Değişiklik üstverisi (şema, oluşturulma tarihi)
```

**Örnek:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```
Çevirisi:
```
You: /opsx:new add-dark-mode

AI:  openspec/changes/add-dark-mode/ dizini oluşturuldu
     Şema: spec-driven

     Oluşturulmaya hazır: proposal
     Oluşturmak için /opsx:continue komutunu, tüm eserleri oluşturmak için /opsx:ff komutunu kullanın.
```

**İpuçları:**
- Açıklayıcı adlar kullanın: `add-feature`, `fix-bug`, `refactor-module`
- `update`, `changes`, `wip` gibi genel adlardan kaçının
- Şema ayrıca proje yapılandırmasında da ayarlanabilir (`openspec/config.yaml`)

---

### `/opsx:continue`

Bağımlılık zincirindeki bir sonraki eseri oluştur. Artımlı ilerleme için tek seferde bir eser oluşturur.

**Sözdizimi:**
```
/opsx:continue [change-name]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `change-name` | Hayır | Hangi değişikliğin devam edileceği (verilmezse bağlamdan çıkarılır) |

**Ne yapar:**
- Eser bağımlılık grafiğini sorgular
- Hangi eserlerin hazır, hangilerinin engelli olduğunu gösterir
- Hazır olan ilk eseri oluşturur
- Bağlam için bağımlılık dosyalarını okur
- Oluşturulduktan sonra hangi eserlerin kullanılabilir hale geleceğini gösterir

**Örnek:**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: tasks
     Run /opsx:continue to create the next artifact.
```
Çevirisi:
```
You: /opsx:continue

AI:  Değişiklik: add-dark-mode

     Eser durumu:
     ✓ proposal    (tamamlandı)
     ◆ specs       (hazır)
     ◆ design      (hazır)
     ○ tasks       (engelli - gerekli: specs)

     specs oluşturuluyor...

     [proposal.md okunur, gereksinimlere dayalı olarak specs oluşturulur]

     ✓ openspec/changes/add-dark-mode/specs/ui/spec.md oluşturuldu

     Şimdi kullanılabilir: tasks
     Sonraki eseri oluşturmak için /opsx:continue komutunu çalıştırın.
```

**İpuçları:**
- İlerlemeden önce her eseri gözden geçirmek istediğinizde kullanın
- Kontrol istediğiniz karmaşık değişiklikler için iyidir
- Birden fazla eser aynı anda hazır hale gelebilir
- Devam etmeden önce oluşturulan eserleri düzenleyebilirsiniz

---

### `/opsx:ff`

Eser oluşturma işleminde hızlı ilerleme. Tüm planlama eserlerini tek seferde oluşturur.

**Sözdizimi:**
```
/opsx:ff [change-name]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `change-name` | Hayır | Hızlı ilerleme yapılacak değişiklik (verilmezse bağlamdan çıkarılır) |

**Ne yapar:**
- Tüm eserleri bağımlılık sırasına göre oluşturur
- İlerlemeyi yapılacaklar listesiyle takip eder
- Tüm `apply-required` eserleri tamamlandığında durur
- Sonraki eseri oluşturmadan önce her bağımlılığı okur

**Örnek:**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```
Çevirisi:
```
You: /opsx:ff add-dark-mode

AI:  add-dark-mode için hızlı ilerleme yapılıyor...

     ✓ proposal.md oluşturuluyor
     ✓ specs/ui/spec.md oluşturuluyor
     ✓ design.md oluşturuluyor
     ✓ tasks.md oluşturuluyor

     Tüm planlama eserleri tamamlandı!
     Uygulamaya hazır. Başlamak için /opsx:apply komutunu çalıştırın.
```

**İpuçları:**
- Ne build ettiğinizi net olarak biliyorsanız kullanın
- Basit değişiklikler için `/opsx:continue` komutuna göre daha hızlıdır
- Oluşturulduktan sonra yine de eserleri düzenleyebilirsiniz
- Küçük ve orta ölçekli özellikler için iyidir

---

### `/opsx:apply`

Değişiklikteki görevleri uygula. Görev listesi üzerinden ilerler, kod yazar ve öğeleri tamamlandı olarak işaretler.

**Sözdizimi:**
```
/opsx:apply [change-name]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `change-name` | Hayır | Uygulanacak değişiklik (verilmezse bağlamdan çıkarılır) |

**Ne yapar:**
- `tasks.md` dosyasını okur ve tamamlanmamış görevleri belirler
- Görevleri tek tek işler
- Gerektiğinde kod yazar, dosya oluşturur, test çalıştırır
- Görevleri onay kutuları `[x]` ile tamamlandı olarak işaretler

**Örnek:**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```
Çevirisi:
```
You: /opsx:apply

AI:  add-dark-mode uygulanıyor...

     tasks.md okunuyor:
     - [ ] 1.1 ThemeContext oluştur
     - [ ] 1.2 CSS custom properties ekle
     - [ ] 1.3 localStorage persistence uygula

     1.1 görevi üzerinde çalışılıyor: ThemeContext oluştur...
     [src/context/ThemeContext.tsx oluşturuluyor]

     ✓ 1.1 Tamamlandı

     1.2 görevi üzerinde çalışılıyor: CSS custom properties ekle...
     [src/styles/globals.css güncelleniyor]

     ✓ 1.2 Tamamlandı
     ...
```

**İpuçları:**
- Yarıda kesilirse kaldığınız yerden devam edebilir
- Değişiklik adını belirterek paralel değişiklikler için kullanın
- Tamamlama durumu `tasks.md` içindeki onay kutularıyla takip edilir

---

### `/opsx:update`

Bir değişikliğin mevcut planlama eserlerini düzenleyin ve birbiriyle tutarlı kalmasını sağlayın. Sadece planlama eserleri ile ilgilenir - hiçbir zaman kodu düzenlemez.

**Sözdizimi:**

```text
/opsx:update [change-name]
```

**Argümanlar:**

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `change-name` | Hayır | Güncellenecek değişiklik (verilmezse bağlamdan çıkarılır) |

**Ne yapar:**

- Değişikliğin eserlerini `openspec status --change <name> --json` komutuyla okur
- İstediğiniz düzeltmeyi uygular, eğer bir düzeltme belirtmedenyseniz eserleri çelişkiler için gözden geçirir
- Diğer mevcut eserleri her yönde uzlaştırır (bir tasarım düzenlemesi öneriye geri yansıyabilir)
- Yazmadan önce her düzenlemeyi sizinle teyit eder, tek seferde bir eser üzerinde çalışır
- Sonunda bir sonraki adımı önerir: `/opsx:continue` (eksik eserler), `/opsx:apply` (düzeltilmiş planı koda uygula) veya `/opsx:archive` (tamamlandı)

**Örnek:**

```text
You: /opsx:update add-dark-mode - artık temayı localStorage yerine çerezde saklıyoruz

AI:  Reading add-dark-mode artifacts...

     The design references localStorage in two places; tasks 1.3 covers
     localStorage persistence; the proposal doesn't mention storage.

     Proposed revisions:
     1. design.md - swap localStorage decision for cookie storage
     2. tasks.md - reword task 1.3 to cookie persistence

     Apply revision 1? (design.md)
```
Çevirisi:
```text
You: /opsx:update add-dark-mode - artık temayı localStorage yerine çerezde saklıyoruz

AI:  add-dark-mode eserleri okunuyor...

     Tasarımda iki yerde localStorage'a referans var; görev 1.3 localStorage kalıcılığını kapsıyor; öneride depolama ile ilgili bir şey yok.

     Önerilen düzeltmeler:
     1. design.md - localStorage kararını çerez depolaması ile değiştir
     2. tasks.md - görev 1.3'ü çerez kalıcılığı olarak yeniden ifade et

     1. düzeltmeyi uygula? (design.md)
```

**İpuçları:**

- Eksik eserler oluşturmaz - bu `/opsx:continue` komutunun işidir
- Eğer değişiklik zaten uygulanmışsa, kodun düzeltilmiş plan ile eşleşmesi için `/opsx:apply` komutunu takip edin
- Eğer düzeltmeniz değişikliğin *amacını* değiştiriyorsa, bunun yerine yeni bir değişiklikle yeniden başlayın (bkz. [Güncelleme vs. Yeniden Başlama](opsx.md#when-to-update-vs-start-fresh))

---

### `/opsx:verify`

Uygulamanın değişiklik eserlerinizle eşleştiğini doğrulayın. Tamlık, doğruluk ve tutarlılığı kontrol eder.

**Sözdizimi:**
```
/opsx:verify [change-name]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `change-name` | Hayır | Doğrulanacak değişiklik (verilmezse bağlamdan çıkarılır) |

**Ne yapar:**
- Uygulama kalitesinin üç boyutunu kontrol eder
- Uygulama kanıtı için kod tabanında arama yapar
- KRİTİK, UYARI veya ÖNERİ olarak kategorize edilmiş sorunları raporlar
- Arşivlemeyi engellemez, ancak sorunları ortaya çıkarır

**Doğrulama boyutları:**

| Boyut | Ne doğrulanır |
|-----------|---------------|
| **Tamlık** | Tüm görevlerin tamamlanması, tüm gereksinimlerin uygulanması, senaryoların kapsanması |
| **Doğruluk** | Uygulamanın spesifikasyon amacıyla eşleşmesi, kenar durumlarının ele alınması |
| **Tutarlılık** | Tasarım kararlarının kodda yansıtılması, desenlerin tutarlı olması |

**Örnek:**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```
Çevirisi:
```
You: /opsx:verify

AI:  add-dark-mode doğrulanıyor...

     TAMLIK
     ✓ tasks.md'deki tüm 8 görev işaretlendi
     ✓ Spesifikasyonlardaki tüm gereksinimlere karşılık gelen kod var
     ⚠ "Sistem tercihi algılama" senaryosunun test kapsaması yok

     DOĞRULUK
     ✓ Uygulama spesifikasyon amacıyla eşleşiyor
     ✓ Senaryolardaki kenar durumları ele alındı
     ✓ Hata durumları spesifikasyon tanımlarıyla eşleşiyor

     TUTARLILIK
     ✓ Tasarım kararları kod yapısında yansıtıldı
     ✓ İsimlendirme kuralları design.md ile tutarlı
     ⚠ Tasarımda "CSS değişkenleri"ndan bahsedilirken uygulama Tailwind sınıfları kullanıyor

     ÖZET
     ─────────────────────────────
     Kritik sorunlar: 0
     Uyarılar: 2
     Arşivlemeye hazır: Evet (uyarılarla birlikte)

     Öneriler:
     1. Sistem tercihi algılama için test ekle
     2. Tailwind kullanımını yansıtacak şekilde design.md'yi güncelle, veya CSS değişkenleri kullanacak şekilde yeniden düzenle
```

**İpuçları:**
- Arşivlemeden önce çalıştırın, uyumsuzlukları erken yakalayın
- Uyarılar arşivlemeyi engellemez ancak olası sorunları işaret eder
- İşleme almadan önce AI'ın çalışmasını gözden geçirmek için iyidir
- Eserler ile uygulama arasındaki uyumsuzluğu ortaya çıkarabilir

---

### `/opsx:sync`

**İsteğe bağlı komut.** Bir değişiklikten gelen delta spesifikasyonları ana spesifikasyonlarla birleştirir. Gerekirse arşivleme senkronizasyon yapmanızı ister, bu nedenle genellikle bunu manuel olarak çalıştırmanız gerekmez.

**Sözdizimi:**
```
/opsx:sync [change-name]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `change-name` | Hayır | Senkronize edilecek değişiklik (verilmezse bağlamdan çıkarılır) |

**Ne yapar:**
- Değişiklik klasöründen delta spesifikasyonlarını okur
- EKLENDİ/DÜZENLENDİ/KALDIRILDI/YENİDEN ADLANDIRILDI bölümlerini ayrıştırır
- Değişiklikleri ana `openspec/specs/` diziniyle birleştirir
- Delta'da bahsedilmeyen mevcut içeriği korur
- Değişikliği arşivlemez (aktif kalır)

**Örnek:**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```
Çevirisi:
```text
You: /opsx:sync

AI:  add-dark-mode delta spesifikasyonları senkronize ediliyor...

     Okunan: openspec/changes/add-dark-mode/specs/ui/spec.md
     Hedef:  openspec/specs/ui/spec.md

     Uygulanacak değişiklikler:
     ✓ EKLENDİ: Tema Seçimi gereksinimi (2 senaryo)
     ✓ EKLENDİ: Erişilebilirlik gereksinimi (1 senaryo)

     Birleştiriliyor...
     ✓ openspec/specs/ui/spec.md güncellendi

     Değişiklik aktif kalıyor. Tamamlamak için /opsx:archive komutunu çalıştırın.
```

**Manuel olarak ne zaman kullanılır:**

| Senaryo | Senkronizasyon kullan? |
|----------|-----------|
| Uzun süren değişiklik, arşivlemeden önce ana spesifikasyonlarda specs istiyor | Evet |
| Birden fazla paralel değişiklik güncellenmiş temel spesifikasyonlara ihtiyaç duyuyor | Evet |
| Birleştirmeyi ayrıca önizlemek/incelemek istiyorsunuz | Evet |
| Hızlı değişiklik, doğrudan arşivleme yapıyorsunuz | Hayır (arşivleme bunu halleder) |

**İpuçları:**
- Senkronizasyon akıllıdır, kopyala-yapıştır değildir
- Mevcut gereksinimlere tekrar etmeden senaryo ekleyebilir
- Senkronizasyon sonrası değişiklik aktif kalır (arşivlenmez)
- Çoğu kullanıcının bunu doğrudan çağırmasına gerek olmaz - gerekirse arşivleme sırasında istenir

---

### `/opsx:archive`

Tamamlanmış bir değişikliği arşivle. Değişikliği sonlandırır ve arşiv klasörüne taşır.

**Sözdizimi:**
```
/opsx:archive [change-name]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `change-name` | Hayır | Arşivlenecek değişiklik (verilmezse bağlamdan çıkarılır) |

**Ne yapar:**
- Eser tamamlama durumunu kontrol eder
- Görev tamamlama durumunu kontrol eder (tamamlanmamışsa uyarır)
- Henüz senkronize edilmediyse delta spesifikasyonları senkronize etmeyi teklif eder
- Değişiklik klasörünü `openspec/changes/archive/YYYY-MM-DD-<name>/` konumuna taşır
- Denetim izi için tüm eserleri korur

**Örnek:**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```
Çevirisi:
```text
You: /opsx:archive

AI:  add-dark-mode arşivleniyor...

     Eser durumu:
     ✓ proposal.md mevcut
     ✓ specs/ mevcut
     ✓ design.md mevcut
     ✓ tasks.md mevcut (8/8 görev tamamlandı)

     Delta spesifikasyonlar: Henüz senkronize edilmedi
     → Şimdi senkronize et? (önerilir)

You: Evet

AI:  ✓ Spesifikasyonlar openspec/specs/ui/spec.md ile senkronize edildi
     ✓ openspec/changes/archive/2025-01-24-add-dark-mode/ konumuna taşındı

     Değişiklik başarıyla arşivlendi.
```

**İpuçları:**
- Arşivleme tamamlanmamış görevler için engel olmaz, ancak uyarır
- Delta spesifikasyonları arşivleme sırasında veya önceden senkronize edilebilir
- Arşivlenmiş değişiklikler geçmiş için korunur
- Sorunları yakalamak için önce `/opsx:verify` komutunu kullanın

---

### `/opsx:bulk-archive`

Birden fazla tamamlanmış değişikliği tek seferde arşivle. Değişiklikler arasındaki spesifikasyon çakışmalarını halleder.

**Sözdizimi:**
```
/opsx:bulk-archive [change-names...]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `change-names` | Hayır | Arşivlenecek belirli değişiklikler (verilmezse seçim için sorulur) |

**Ne yapar:**
- Tüm tamamlanmış değişiklikleri listeler
- Arşivlemeden önce her değişikliği doğrular
- Değişiklikler arasındaki spesifikasyon çakışmalarını tespit eder
- Çakışmaları gerçekte neyin uygulandığını kontrol ederek çözer
- Kronolojik sırayla arşivler

**Örnek:**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```
Çevirisi:
```
You: /opsx:bulk-archive

AI:  3 tamamlanmış değişiklik bulundu:
     - add-dark-mode (8/8 görev tamamlandı)
     - fix-login-bug (3/3 görev tamamlandı)
     - update-footer (2/2 görev tamamlandı)

     Spesifikasyon çakışmaları kontrol ediliyor...
     ⚠ add-dark-mode ve update-footer her ikisi de specs/ui/ ile ilgili

     Çözmek için kod tabanı inceleniyor...
     Her iki değişiklik de uygulandı. Kronolojik sırayla birleştirilecek:
     1. add-dark-mode (20 Ocak'ta oluşturuldu)
     2. update-footer (22 Ocak'ta oluşturuldu)

     Tüm 3 değişikliği arşivle?

You: Evet

AI:  ✓ add-dark-mode arşivlendi
     ✓ fix-login-bug arşivlendi
     ✓ update-footer arşivlendi
     Spesifikasyonlar birleştirildi: add-dark-mode → update-footer
```

**İpuçları:**
- Paralel çalışma akışları için iyidir
- Çakışma çözümü aracıdır (kod tabanını kontrol eder)
- Değişiklikler oluşturma sırasına göre arşivlenir
- Spesifikasyon içeriğinin üzerine yazmadan önce onay ister

---

### `/opsx:onboard`

Tam OpenSpec iş akışı boyunca rehberli öğrenme süreci. Gerçek kod tabanınızı kullanan etkileşimli bir eğitim.

**Sözdizimi:**
```
/opsx:onboard
```

**Ne yapar:**
- Anlatımla birlikte tam bir iş akışı döngüsü boyunca ilerler
- Gerçek iyileştirme fırsatları için kod tabanınızı tarar
- Gerçek eserlerle gerçek bir değişiklik oluşturur
- Gerçek işi uygular (küçük, güvenli değişiklikler)
- Tamamlanmış değişikliği arşivler
- Her adımı gerçekleşirken açıklar

**Aşamalar:**
| Aşama | Açıklama |
|-------|-------------|
| 1. Welcome and codebase analysis | Karşılama ve kod tabanı analizi |
| 2. Finding an improvement opportunity | İyileştirme fırsatı bulma |
| 3. Creating a change (`/opsx:new`) | Değişiklik oluşturma (`/opsx:new`) |
| 4. Writing the proposal | Öneri yazma |
| 5. Creating specs | Spesifikasyonlar oluşturma |
| 6. Writing the design | Tasarım yazma |
| 7. Creating tasks | Görevler oluşturma |
| 8. Implementing tasks (`/opsx:apply`) | Görevleri uygulama (`/opsx:apply`) |
| 9. Verifying implementation | Uygulamayı doğrulama |
| 10. Archiving the change | Değişikliği arşivleme |
| 11. Summary and next steps | Özet ve sonraki adımlar |

**Örnek:**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```
Çevirisi:
```
You: /opsx:onboard

AI:  OpenSpec'e hoş geldiniz!

     Gerçek kod tabanınızı kullanarak tam iş akışı boyunca size rehberlik edeceğim.
     Küçük bir iyileştirme şeyi bulacağız, bunun için uygun bir değişiklik oluşturacağız,
     uygulayacağız ve arşivleyeceğiz.

     Hemen kod tabanınızı fırsatlar için tarayayım...

     [Kod tabanını analiz ediyor]

     Üzerinde çalışabileceğimiz birkaç şey buldum:
     1. İletişim formuna girdi doğrulaması ekle
     2. Kimlik doğrulama (auth) akışındaki hata mesajlarını iyileştir
     3. Asenkron düğmelere yükleme durumları ekle

     Hangi konu ilginizi çekiyor? (veya başka bir şey önerebilirsiniz)
```

**İpuçları:**
- İş akışını öğrenen yeni kullanıcılar için en iyisidir
- Gerçek kod kullanır, oyuncak örnekler değil
- Koruyabileceğiniz veya çıkarabileceğiniz gerçek bir değişiklik oluşturur
- Tamamlanması 15-30 dakika sürer

## Yapay Zeka Araçlarına Göre Komut Sözdizimi

Farklı yapay zeka araçları biraz farklı komut sözdizimi kullanır. Kendi aracınıza uygun olan formatı kullanın:

| Araç | Sözdizimi Örneği |
|------|------------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | Yetki tabanlı çağrılar örneğin `/openspec-propose`, `/openspec-apply-change` (üretilen `opsx-*` komut dosyaları yok) |
| Codex | `.codex/skills/openspec-*` konumundan yetki tabanlı çağrılar (üretilen `opsx-*` prompt dosyaları yok) |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi Code | Yetki tabanlı çağrılar örneğin `/skill:openspec-propose`, `/skill:openspec-apply-change` (üretilen `opsx-*` komut dosyaları yok) |
| Trae | `/opsx-propose`, `/opsx-apply` |

Tüm araçlarda amaç aynıdır ancak komutların nasıl sunulduğu entegrasyona göre değişebilir.

> **Not:** GitHub Copilot komutları (`.github/prompts/*.prompt.md`) yalnızca IDE eklentilerinde (VS Code, JetBrains, Visual Studio) kullanılabilir. GitHub Copilot CLI şu anda özel prompt dosyalarını desteklemez — detaylar ve geçici çözümler için [Desteklenen Araçlar](supported-tools.md) belgesine bakın.

---

## Eski Komutlar

Bu komutlar daha eski "tümü bir kerede" iş akışını kullanır. Hala çalışırlar ancak OPSX komutları önerilir.

| Komut | Ne işe yarar |
|-------|--------------|
| `/openspec:proposal` | Tüm yapıtları tek seferde oluştur (teklif, spesifikasyonlar, tasarım, görevler) |
| `/openspec:apply` | Değişikliği uygula |
| `/openspec:archive` | Değişikliği arşivle |

**Eski komutları ne zaman kullanmalısınız:**
- Eski iş akışını kullanan mevcut projeler
- Artımlı yapıt oluşturmaya ihtiyacınız olmayan basit değişiklikler
- Ya hepsi ya hiç yaklaşımını tercih ediyorsanız

**OPSX'ye geçiş yapma:**
Eski değişiklikler OPSX komutlarıyla devam ettirilebilir. Yapıt yapısı uyumludur.

---

## Sorun Giderme

### "Değişiklik bulunamadı"

Komut, üzerinde çalışılacak değişikliği tanımlayamadı.

**Çözümler:**
- Değişiklik adını açıkça belirtin: `/opsx:apply add-dark-mode`
- Değişiklik klasörünün var olduğunu kontrol edin: `openspec list`
- Doğru proje dizininde olduğunuzdan emin olun

### "Hazır yapıt yok"

Tüm yapıtlar ya tamamlanmış ya da eksik bağımlılıklar tarafından engellenmiştir.

**Çözümler:**
- Engelleyen şeyi görmek için `openspec status --change <name>` komutunu çalıştırın
- Gerekli yapıtların var olup olmadığını kontrol edin
- Önce eksik bağımlılık yapıtlarını oluşturun

### "Şema bulunamadı"

Belirtilen şema mevcut değil.

**Çözümler:**
- Mevcut şemaları listeleyin: `openspec schemas`
- Şema adının yazımını kontrol edin
- Özel bir şemaysa oluşturun: `openspec schema init <name>`

### Komutlar tanınmıyor

Yapay zeka aracı OpenSpec komutlarını tanımıyor.

**Çözümler:**
- OpenSpec'in başlatıldığından emin olun: `openspec init`
- Yetenekleri yeniden oluşturun: `openspec update`
- `.claude/skills/` dizininin var olduğunu kontrol edin (Claude Code için)
- Yeni yetenekleri almak için yapay zeka aracınızı yeniden başlatın

### Yapıtlar düzgün oluşturulmuyor

Yapay zeka eksik veya hatalı yapıtlar oluşturuyor.

**Çözümler:**
- `openspec/config.yaml` dosyasına proje bağlamı ekleyin
- Özel yönlendirmeler için her yapıt için kural ekleyin
- Değişiklik açıklamanızda daha fazla detay verin
- Daha fazla kontrol için `/opsx:ff` yerine `/opsx:continue` kullanın

---

## Sonraki Adımlar

- [İş Akışları](workflows.md) - Yaygın kalıplar ve her komutun ne zaman kullanılacağı
- [CLI](cli.md) - Yönetim ve doğrulama için terminal komutları
- [Özelleştirme](customization.md) - Özel şema ve iş akışları oluşturma