# Komutlar

Bu belge, OpenSpec'in eğik çizgi komutları için referans niteliğindedir. Bu komutlar, yapay zeka kodlama asistanınızın sohbet arayüzünde (örn. Claude Code, Cursor, Windsurf) çağrılır.

İş akışı desenleri ve her bir komutun ne zaman kullanılacağı hakkında bilgi için [İş Akışları](workflows.md) bölümüne bakın. Komut satırı komutları için [CLI](cli.md) bölümüne bakın.

## Hızlı Referans

### Varsayılan Hızlı Yol (`core` profili)

| Komut | Amaç |
|---------|---------|
| `/opsx:propose` | Bir değişiklik oluşturur ve planlama araçlarını tek adımda üretir |
| `/opsx:explore` | Bir değişiklik yapmadan önce fikirler üzerinde düşünür |
| `/opsx:apply` | Değişiklikten gelen görevleri uygular |
| `/opsx:archive` | Tamamlanmış bir değişikliği arşivler |

### Genişletilmiş İş Akışı Komutları (özel iş akışı seçimi)

| Komut | Amaç |
|---------|---------|
| `/opsx:new` | Yeni bir değişiklik iskeleti başlatır |
| `/opsx:continue` | Bağımlılıklara göre bir sonraki aracı oluşturur |
| `/opsx:ff` | İleri sarma: tüm planlama araçlarını tek seferde oluşturur |
| `/opsx:verify` | Uygulamanın araçlarla eşleşip eşleşmediğini doğrular |
| `/opsx:sync` | Delta özelliklerini ana özelliklere birleştirir |
| `/opsx:bulk-archive` | Birden fazla değişikliği tek seferde arşivler |
| `/opsx:onboard` | Tam iş akışı boyunca rehberli eğitim |

Varsayılan global profil `core`'dur. Genişletilmiş iş akışı komutlarını etkinleştirmek için `openspec config profile` komutunu çalıştırın, iş akışlarını seçin ve ardından projenizde `openspec update` komutunu çalıştırın.

---

## Komut Referansı

### `/opsx:propose`

Yeni bir değişiklik oluşturun ve planlama araçlarını tek adımda üretin. Bu, `core` profilindeki varsayılan başlatma komutudur.

**Sözdizimi:**
```text
/opsx:propose [degisiklik-adi-veya-aciklama]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `degisiklik-adi-veya-aciklama` | Hayır | Kebab-case formatında ad veya düz dilde değişiklik açıklaması |

**Ne yapar:**
- `openspec/changes/<degisiklik-adi>/` dizinini oluşturur
- Uygulama öncesi gerekli araçları üretir (`spec-driven` için: proposal, specs, design, tasks)
- Değişiklik `/opsx:apply` komutuna hazır olduğunda durur

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

**İpuçları:**
- En hızlı uçtan uca yol için bunu kullanın
- Adım adım araç kontrolü istiyorsanız, genişletilmiş iş akıtlarını etkinleştirin ve `/opsx:new` + `/opsx:continue` kullanın

---

### `/opsx:explore`

Bir değişiklik yapmadan önce fikirler üzerinde düşünün, sorunları araştırın ve gereksinimleri netleştirin.

**Sözdizimi:**
```
/opsx:explore [konu]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `konu` | Hayır | Keşfetmek veya araştırmak istediğiniz konu |

**Ne yapar:**
- Yapı gerektirmeyen keşifsel bir konuşma başlatır
- Soruları yanıtlamak için kod tabanını araştırır
- Seçenekleri ve yaklaşımları karşılaştırır
- Düşünceleri netleştirmek için görsel diyagramlar oluşturur
- İçgörüler netleştiğinde `/opsx:propose` (varsayılan) veya `/opsx:new` (genişletilmiş iş akışı) komutuna geçiş yapabilir

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

**İpuçları:**
- Gereksinimler belirsiz olduğunda veya araştırma yapmanız gerektiğinde kullanın
- Keşif sırasında araç üretilmez
- Karar vermeden önce birden fazla yaklaşımı karşılaştırmak için iyidir
- Dosyaları okuyabilir ve kod tabanında arama yapabilir

---

### `/opsx:new`

Yeni bir değişiklik iskeleti başlatın. Değişiklik klasörünü oluşturur ve `/opsx:continue` veya `/opsx:ff` ile araç üretmenizi bekler.

Bu komut, genişletilmiş iş akışı setinin bir parçasıdır (varsayılan `core` profilinde yer almaz).

**Sözdizimi:**
```
/opsx:new [degisiklik-adi] [--schema <sema-adi>]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `degisiklik-adi` | Hayır | Değişiklik klasörü için ad (verilmezse sorulur) |
| `--schema` | Hayır | Kullanılacak iş akışı şeması (varsayılan: yapılandırmadan veya `spec-driven`) |

**Ne yapar:**
- `openspec/changes/<degisiklik-adi>/` dizinini oluşturur
- Değişiklik klasöründe `.openspec.yaml` meta dosyası oluşturur
- Oluşturmaya hazır ilk araç şablonunu gösterir
- Verilmezse değişiklik adı ve şema için sorar

**Ne oluşturur:**
```
openspec/changes/<degisiklik-adi>/
└── .openspec.yaml    # Değişiklik meta verileri (şema, oluşturulma tarihi)
```

**Örnek:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**İpuçları:**
- Açıklayıcı adlar kullanın: `add-feature`, `fix-bug`, `refactor-module`
- `update`, `changes`, `wip` gibi genel adlardan kaçının
- Şema ayrıca proje yapılandırmasında (`openspec/config.yaml`) ayarlanabilir

---

### `/opsx:continue`

Bağımlılık zincirindeki bir sonraki aracı oluşturun. Artışlı ilerleme için bir seferde bir araç oluşturur.

**Sözdizimi:**
```
/opsx:continue [degisiklik-adi]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `degisiklik-adi` | Hayır | Hangi değişikliğin devam edeceği (verilmezse bağlamdan çıkarılır) |

**Ne yapar:**
- Araç bağımlılık grafiğini sorgular
- Hangi araçların hazır olduğunu vs. engellendiğini gösterir
- İlk hazır aracı oluşturur
- Bağlam için bağımlılık dosyalarını okur
- Oluşturma sonrası neyin kullanılabilir olduğunu gösterir

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

**İpuçları:**
- Her aracı devam etmeden önce incelemek istediğinizde kullanın
- Kontrol istediğiniz karmaşık değişiklikler için iyidir
- Birden fazla araç aynı anda hazır hale gelebilir
- Devam etmeden önce oluşturulan araçları düzenleyebilirsiniz

---

### `/opsx:ff`

Araç oluşturmada hızlı ileri sarma. Tüm planlama araçlarını bir anda oluşturur.

**Sözdizimi:**
```
/opsx:ff [degisiklik-adi]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `degisiklik-adi` | Hayır | Hangi değişikliğin hızlı ileri sarılacağı (verilmezse bağlamdan çıkarılır) |

**Ne yapar:**
- Tüm araçları bağımlılık sırasına göre oluşturur
- Yapılacaklar listesi üzerinden ilerlemeyi takip eder
- Tüm `apply-required` araçları tamamlandığında durur
- Bir sonraki aracı oluşturmadan önce her bağımlılığı okur

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

**İpuçları:**
- Ne inşa ettiğiniz konusunda net bir resminiz olduğunda kullanın
- Basit değişiklikler için `/opsx:continue`'dan daha hızlıdır
- Yine de araçları sonradan düzenleyebilirsiniz
- Küçük ila orta ölçekli özellikler için iyidir

---

### `/opsx:apply`

Değişiklikten gelen görevleri uygulayın. Görev listesinde çalışarak kod yazar ve maddeleri işaretler.

**Sözdizimi:**
```
/opsx:apply [degisiklik-adi]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `degisiklik-adi` | Hayır | Hangi değişikliğin uygulanacağı (verilmezse bağlamdan çıkarılır) |

**Ne yapar:**
- `tasks.md` dosyasını okur ve tamamlanmamış görevleri belirler
- Görevleri tek tek işler
- Gerektiğinde kod yazar, dosyalar oluşturur, testleri çalıştırır
- Görevleri `[x]` onay kutularıyla tamamlanmış olarak işaretler

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

**İpuçları:**
- Kesintiye uğrarsanız kaldığınız yerden devam edebilirsiniz
- Paralel değişiklikler için değişiklik adını belirterek kullanın
- Tamamlanma durumu `tasks.md` onay kutularında takip edilir

---

### `/opsx:verify`

Uygulamanın değişiklik araçlarınızla eşleşip eşleşmediğini doğrulayın. Eksiksizliği, doğruluğu ve tutarlılığı kontrol eder.

**Sözdizimi:**
```
/opsx:verify [degisiklik-adi]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `degisiklik-adi` | Hayır | Hangi değişikliğin doğrulanacağı (verilmezse bağlamdan çıkarılır) |

**Ne yapar:**
- Uygulama kalitesinin üç boyutunu kontrol eder
- Uygulama kanıtı için kod tabanında arama yapar
- KRİTİK, UYARI veya ÖNERİ olarak kategorize edilmiş sorunları raporlar
- Arşivlemeyi engellemez, ancak sorunları yüzeye çıkarır

**Doğrulama boyutları:**

| Boyut | Ne doğrular |
|-----------|-------------------|
| **Eksiksizlik** | Tüm görevler yapıldı, tüm gereksinimler uygulandı, senaryolar kapsandı |
| **Doğruluk** | Uygulama spec niyetiyle eşleşiyor, kenar durumları ele alınıyor |
| **Tutarlılık** | Tasarım kararları kodda yansıtılıyor, kalıplar tutarlı |

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

**İpuçları:**
- Eşitsizlikleri erken yakalamak için arşivlemeden önce çalıştırın
- Uyarılar arşivlemeyi engellemez ancak olası sorunları gösterir
- İşlemeden önce AI'ın çalışmasını incelemek için iyidir
- Araçlar ile uygulama arasındaki sapmaları ortaya çıkarabilir

---

### `/opsx:sync`

**İsteğe bağlı komut.** Bir değişiklikten gelen delta spec'leri ana spec'lere birleştirin. Gerekirse arşivleme senkronizasyonu sorar, bu yüzden bunu genellikle manuel olarak çalıştırmanıza gerek yoktur.

**Sözdizimi:**
```
/opsx:sync [degisiklik-adi]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `degisiklik-adi` | Hayır | Hangi değişikliğin senkronize edileceği (verilmezse bağlamdan çıkarılır) |

**Ne yapar:**
- Değişiklik klasöründen delta spec'leri okur
- EKLENMİŞ/DEĞİŞTİRİLMİŞ/KALDIRILMİŞ/YENİDEN ADLANDIRILMIŞ bölümlerini ayrıştırır
- Değişiklikleri ana `openspec/specs/` dizinine birleştirir
- Delta'da bahsedilmemiş mevcut içeriği korur
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

**Ne zaman manuel kullanılır:**

| Senaryo | sync kullan? |
|----------|-----------|
| Uzun süren değişiklik, spec'leri arşivlemeden önce ana dizinde istiyorum | Evet |
| Birden fazla paralel değişiklik güncellenmiş temel spec'lere ihtiyaç duyuyor | Evet |
| Birleştirmeyi ayrı olarak önizlemek/incelemek istiyorum | Evet |
| Hızlı değişiklik, doğrudan arşivlemeye geçiyorum | Hayır (arşivleme halleder) |

**İpuçları:**
- Senkronizasyon akıllıdır, kopyala-yapıştır değildir
- Mevcut gereksinimlere senaryolar ekleyebilir, çoğaltma yapmaz
- Senkronizasyon sonrası değişiklik aktif kalır (arşivlenmez)
- Çoğu kullanıcının bunu doğrudan çağırması gerekmez—arşivleme gerekirse sorar

---

### `/opsx:archive`

Tamamlanmış bir değişikliği arşivleyin. Değişikliği sonlandırır ve arşiv klasörüne taşır.

**Sözdizimi:**
```
/opsx:archive [degisiklik-adi]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `degisiklik-adi` | Hayır | Hangi değişikliğin arşivleneceği (verilmezse bağlamdan çıkarılır) |

**Ne yapar:**
- Araç tamamlanma durumunu kontrol eder
- Görev tamamlanmasını kontrol eder (tamamlanmamışsa uyarır)
- Henüz senkronize edilmemişse delta spec'lerini senkronize etmeyi teklif eder
- Değişiklik klasörünü `openspec/changes/archive/YYYY-MM-DD-<ad>/` dizinine taşır
- Denetim izi için tüm araçları korur

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

**İpuçları:**
- Arşivleme tamamlanmamış görevlerde durmaz ancak uyarır
- Delta spec'leri arşivleme sırasında veya öncesinde senkronize edilebilir
- Arşivlenmiş değişiklikler geçmiş için korunur
- Sorunları yakalamak için önce `/opsx:verify` kullanın

---

### `/opsx:bulk-archive`

Birden fazla tamamlanmış değişikliği bir anda arşivleyin. Değişiklikler arasındaki spec çakışmalarını ele alır.

**Sözdizimi:**
```
/opsx:bulk-archive [degisiklik-adi...]
```

**Argümanlar:**
| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `degisiklik-adi` | Hayır | Arşivlenecek belirli değişiklikler (verilmezse seçim yapmanız istenir) |

**Ne yapar:**
- Tüm tamamlanmış değişiklikleri listeler
- Arşivlemeden önce her değişikliği doğrular
- Değişiklikler arası spec çakışmalarını algılar
- Gerçekte neyin uygulandığını kontrol ederek çakışmaları çözer
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

**İpuçları:**
- Paralel iş akışları için iyidir
- Çakışma çözümü ajansiktir (kod tabanını kontrol eder)
- Değişiklikler oluşturma sırasına göre arşivlenir
- Spec içeriğinin üzerine yazmadan önce sorar

---

### `/opsx:onboard`

Tam OpenSpec iş akışı boyunca yönlendirilmiş onboardlama. Gerçek kod tabanınızı kullanan interaktif bir eğitim.

**Sözdizimi:**
```
/opsx:onboard
```

**Ne yapar:**
- Anlatımla birlikte tam bir iş akışı dolaşımı sağlar
- Gerçek iyileştirme fırsatları için kod tabanınızı tarar
- Gerçek araçlarla gerçek bir değişiklik oluşturur
- Gerçek iş uygular (küçük, güvenli değişiklikler)
- Tamamlanmış değişikliği arşivler
- Her adımı gerçekleşirken açıklar

**Aşamalar:**
1. Hoş geldiniz ve kod tabanı analizi
2. Bir iyileştirme fırsatı bulma
3. Değişiklik oluşturma (`/opsx:new`)
4. Teklifi yazma
5. Spec'leri oluşturma
6. Tasarımı yazma
7. Görevleri oluşturma
8. Görevleri uygulama (`/opsx:apply`)
9. Uygulamayı doğrulama
10. Değişikliği arşivleme
11. Özet ve sonraki adımlar

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

**İpuçları:**
- İş akışını öğrenen yeni kullanıcılar için en iyisidir
- Gerçek kod kullanır, örnekler değil
- Saklayabileceğiniz veya atabileceğiniz gerçek bir değişiklik oluşturur
- Tamamlanması 15-30 dakika sürer

---

## AI Aracına Göre Komut Sözdizimi

Farklı yapay zeka araçları biraz farklı komut sözdizimleri kullanır. Aracınızla eşleşen formatı kullanın:

| Araç | Sözdizimi Örneği |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Trae | Beceri tabanlı çağrımalar, örneğin `/openspec-propose`, `/openspec-apply-change` (oluşturulan `opsx-*` komut dosyaları yok) |

Amaç araçlar arasında aynıdır, ancak komutların sunulma biçimi entegrasyona göre farklılık gösterebilir.

> **Not:** GitHub Copilot komutları (`.github/prompts/*.prompt.md`) yalnızca IDE eklentilerinde (VS Code, JetBrains, Visual Studio) mevcuttur. GitHub Copilot CLI şu anda özel istem dosyalarını desteklememektedir — ayrıntılar ve geçici çözümler için [Desteklenen Araçlar](supported-tools.md) sayfasına bakın.

---

## Eski Komutlar

Bu komutlar eski "hepsi bir arada" iş akışını kullanır. Hâlâ çalışırlar ancak OPSX komutları önerilmektedir.

| Komut | Ne yapar |
|---------|--------------|
| `/openspec:proposal` | Tüm varlıkları tek seferde oluşturur (öneri, özellikler, tasarım, görevler) |
| `/openspec:apply` | Değişikliği uygular |
| `/openspec:archive` | Değişikliği arşivler |

**Eski komutları ne zaman kullanmalısınız:**
- Eski iş akışını kullanan mevcut projeler
- Artımlı varlık oluşturmaya ihtiyaç duymayan basit değişiklikler
- Hep ya da hiç yaklaşımına tercih

**OPSX'e Geçiş:**
Eski değişiklikler OPSX komutlarıyla devam ettirilebilir. Varlık yapısı uyumludur.

---

## Sorun Giderme

### "Değişiklik bulunamadı"

Komut, üzerinde çalışılacak değişikliği tanımlayamadı.

**Çözümler:**
- Değişiklik adını açıkça belirtin: `/opsx:apply add-dark-mode`
- Değişiklik klasörünün var olduğunu kontrol edin: `openspec list`
- Doğru proje dizininde olduğunuzdan emin olun

### "Hazır varlık yok"

Tüm varlıklar ya tamamlanmış ya da eksik bağımlılıklar nedeniyle engellenmiş.

**Çözümler:**
- Neyin engellediğini görmek için `openspec status --change <adı>` komutunu çalıştırın
- Gerekli varlıkların mevcut olup olmadığını kontrol edin
- Önce eksik bağımlılık varlıklarını oluşturun

### "Şema bulunamadı"

Belirtilen şema mevcut değil.

**Çözümler:**
- Mevcut şemaları listeleyin: `openspec schemas`
- Şema adının yazımını kontrol edin
- Özel bir şemaysa oluşturun: `openspec schema init <adı>`

### Komutlar tanınmıyor

Yapay zeka aracı OpenSpec komutlarını tanımıyor.

**Çözümler:**
- OpenSpec'in başlatıldığından emin olun: `openspec init`
- Becerileri yeniden oluşturun: `openspec update`
- `.claude/skills/` dizininin var olduğunu kontrol edin (Claude Code için)
- Yeni becerileri almak için yapay zeka aracınızı yeniden başlatın

### Varlıklar düzgün oluşturulmuyor

Yapay zeka, eksik veya hatalı varlıklar oluşturuyor.

**Çözümler:**
- `openspec/config.yaml` dosyasına proje bağlamı ekleyin
- Belirli yönergeler için varlık başına kurallar ekleyin
- Değişiklik açıklamanızda daha fazla ayrıntı verin
- Daha fazla kontrol için `/opsx:ff` yerine `/opsx:continue` kullanın

---

## Sonraki Adımlar

- [İş Akışları](workflows.md) - Ortak kalıplar ve her komutun ne zaman kullanılacağı
- [CLI](cli.md) - Yönetim ve doğrulama için terminal komutları
- [Özelleştirme](customization.md) - Özel şemalar ve iş akışları oluşturun