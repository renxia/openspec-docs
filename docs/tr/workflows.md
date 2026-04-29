# İş Akışları

Bu kılavuz, OpenSpec için yaygın iş akışı kalıplarını ve her birinin ne zaman kullanılacağını ele almaktadır. Temel kurulum için [Başlangıç](getting-started.md) sayfasına bakın. Komut referansı için [Komutlar](commands.md) sayfasına bakın.

## Felsefe: Aşamalar Değil, Eylemler

Geleneksel iş akışları sizi aşamalara zorlar: planlama, ardından uygulama ve sonra bitirme. Ancak gerçek çalışma bu kadar düzgün kutulara sığmaz.

OPSX farklı bir yaklaşım benimser:

```text
Geleneksel (aşama kilitli):

  PLANLAMA ────────► UYGULAMA ────────► BİTİRME
      │                    │
      │   "Geri dönemem"   │
      └────────────────────┘

OPSX (akıcı eylemler):

  teklif ──► özellikler ──► tasarım ──► görevler ──► uygulama
```

**Temel ilkeler:**

- **Eylemler, aşamalar değil** - Komutlar yapabileceğiniz şeylerdir, takıldığınız aşamalar değil
- **Bağımlılıklar birer kolaylaştırıcıdır** - Neyin mümkün olduğunu gösterirler, bir sonraki adımın ne olduğunu değil

> **Özelleştirme:** OPSX iş akışları, çıktı sıralarını tanımlayan şemalar tarafından yönlendirilir. Özel şemalar oluşturma hakkında ayrıntılar için [Özelleştirme](customization.md) sayfasına bakın.

## İki Mod

### Varsayılan Hızlı Yol (`core` profili)

Yeni kurulumlar varsayılan olarak `core` profilini kullanır ve şunları sağlar:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:archive`

Tipik akış:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:archive
```

### Genişletilmiş/Tam İş Akışı (özel seçim)

Açık scaffold-and-build komutlarını (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`) istiyorsanız, bunları şu komutlarla etkinleştirin:

```bash
openspec config profile
openspec update
```

## İş Akışı Örüntüleri (Genişletilmiş Mod)

### Hızlı Özellik

Ne inşa etmek istediğinizi biliyorsanız ve sadece uygulamaya ihtiyacınız varsa:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Örnek konuşma:**

```text
You: /opsx:new add-logout-button

AI:  Created openspec/changes/add-logout-button/
     Ready to create: proposal

You: /opsx:ff

AI:  Creating all planning artifacts...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Ready for implementation!

You: /opsx:apply

AI:  Working through tasks...
     ✓ Added logout button to header
     ✓ Implemented session clearing
     ✓ Added confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  ✓ Merged specs
     ✓ Archived change
```

**En iyi kullanım alanı:** Küçük ve orta ölçekli özellikler, hata düzeltmeleri, doğrudan değişiklikler.

### Keşif Amaçlı

Gereksinimler belirsiz olduğunda veya önce araştırma yapmanız gerektiğinde:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Örnek konuşma:**

```text
You: /opsx:explore

AI:  What would you like to explore?

You: I want to improve page load performance but I'm not sure
     where the bottlenecks are.

AI:  Let me help investigate...
     [Analyzes bundle sizes, identifies slow queries, reviews
     component render patterns]

     I found three main bottlenecks:
     1. Large unoptimized images
     2. Synchronous data fetching in ProductList
     3. Re-renders from context changes

     Which would you like to address first?

You: Let's tackle the data fetching issue.

You: /opsx:new optimize-product-list-fetching

AI:  Created change. Ready to create: proposal

You: /opsx:continue

AI:  Creating proposal based on our exploration...
     [Writes proposal incorporating investigation insights]

     Ready to create: specs, design
     Which would you like next?

You: /opsx:continue

AI:  Creating specs...
```

**En iyi kullanım alanı:** Performans optimizasyonu, hata ayıklama, mimari kararlar, belirsiz gereksinimler.

### Paralel Değişiklikler

Birden fazla değişiklik üzerinde aynı anda çalışın:

```text
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (devam ediyor)
                                         │
                                    bağlam değişimi
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Örnek konuşma:**

```text
You: I'm working on add-dark-mode but got pulled into a bug fix

You: /opsx:new fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/

You: /opsx:ff

AI:  ✓ Created planning artifacts

You: /opsx:apply

AI:  Working on fix-login-redirect...
     [Implements the fix]
     All tasks complete!

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect

You: Let's get back to dark mode

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode...
     Picking up at task 2.3: Update Header...
```

**En iyi kullanım alanı:** Paralel iş akışları, acil kesintiler, ekip işbirliği.

Birden fazla tamamlanmış değişikliğiniz olduğunda, `/opsx:bulk-archive` komutunu kullanın:

```text
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (all tasks done)
     - fix-login-redirect (all tasks done)
     - update-footer (all tasks done)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will apply in chronological order.

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-redirect
     ✓ Archived update-footer
     Specs merged in order: add-dark-mode → update-footer
```

Toplu arşivleme, birden fazla değişikliğin aynı spec'lere dokunduğunu tespit eder ve aslında neyin uygulandığını kontrol ederek çakışmaları çözer.

### Bir Değişikliği Tamamlama

Önerilen tamamlama akışı:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              doğrulama          senkronize etmeyi
              uygulamayı        isterse tetikler
```

#### Doğrulama: Çalışmanızı Kontrol Edin

`/opsx:verify`, uygulamanızı üç boyutta artifact'lerinize göre doğrular:

```text
You: /opsx:verify

AI:  Verifying add-auth...

     COMPLETENESS
     ✓ All 12 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Session timeout after inactivity" not tested

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "event-driven" but implementation uses polling

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for session timeout scenario
     2. Consider refactoring to event-driven as designed, or update design.md
```

**Doğrulamanın kontrol ettiği şeyler:**

| Boyut | Ne doğrulanır |
|-----------|------------------|
| Tamamlanma | Tüm görevler yapıldı, tüm gereksinimler uygulandı, senaryolar kapsandı |
| Doğruluk | Uygulama spec niyetini karşılıyor, uç durumlar ele alındı |
| Tutarlılık | Tasarım kararları kod yapısına yansıtıldı, örüntüler tutarlı |

Doğrulama, arşivlemeyi engellemez, ancak önce ele almak isteyebileceğiniz sorunları yüzeye çıkarır.

#### Arşivleme: Değişikliği Tamamlayın

`/opsx:archive`, değişikliği tamamlar ve arşive taşır:

```text
You: /opsx:archive

AI:  Archiving add-auth...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (12/12 tasks complete)

     Delta specs: Not yet synced to main
     → Would you like to sync now?

You: Yes

AI:  ✓ Synced specs to openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-auth/

     Change archived successfully.
```

Arşivleme, spec'ler senkronize edilmemişse bir istemde bulunur. Tamamlanmamış görevlerde engelleme yapmaz, ancak sizi uyarır.

## Ne Zaman Ne Kullanılır

### `/opsx:ff` vs `/opsx:continue`

| Durum | Kullanım |
|-----------|-----|
| Gereksinimler net, inşa etmeye hazırız | `/opsx:ff` |
| Keşfediyoruz, her adımı incelemek istiyoruz | `/opsx:continue` |
| Spec'lerden önce teklif üzerinde yineleme yapmak istiyoruz | `/opsx:continue` |
| Zaman baskısı var, hızlı hareket etmeliyiz | `/opsx:ff` |
| Karmaşık değişiklik, kontrol istiyoruz | `/opsx:continue` |

**Genel kural:** Kapsamı baştan tanımlayabiliyorsanız `/opsx:ff` kullanın. Yolculuk sırasında belirliyorsanız `/opsx:continue` kullanın.

### Güncelleme vs Yeniden Başlama

Yaygın bir soru: mevcut bir değişikliği ne zaman güncellemek uygundur ve ne zaman yenisi başlatılmalıdır?

**Mevcut değişikliği şu durumlarda güncelleyin:**

- Aynı niyet, daha iyi uygulama
- Kapsam daralıyor (önce MVP, geri kalanı sonra)
- Öğrenmeye dayalı düzeltmeler (kod tabanı beklediğiniz gibi değil)
- Uygulama keşiflerine dayalı tasarım ayarlamaları

**Yeni bir değişikliği şu durumlarda başlatın:**

- Niyet temelde değişti
- Kapsam tamamen farklı bir işe genişledi
- Orijinal değişiklik tek başına "tamamlandı" olarak işaretlenebilir
- Yamalar kafa karışıklığı yaratır

```text
                     ┌─────────────────────────────────────┐
                     │     Bu aynı iş mi?                  │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Aynı niyet mi?     %50'den fazla         Orijinal,
          Aynı sorun mu?     örtüşme mi?           bu değişiklikler
                 │                  │               olmadan "tamam"
                 │                  │               olabilir mi?
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      EVET              HAYIR EVET        HAYIR HAYIR         EVET
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    GÜNCELLE           YENİ GÜNCELLE    YENİ GÜNCELLE        YENİ
```

**Örnek: "Karanlık mod ekle"**

- "Özel temaları da desteklemeliyiz" → Yeni değişiklik (kapsam genişledi)
- "Sistem tercihi algılama beklenenden zor" → Güncelle (aynı niyet)
- "Önce geçişi ekleyelim, tercihleri sonra ekleyelim" → Güncelle, arşivle, sonra yeni değişiklik

## En İyi Uygulamalar

### Değişiklikleri Odaklı Tutun

Değişiklik başına bir mantıksal iş birimi. "X özelliğini ekleyelim ve ayrıca Y'yi yeniden yapılandıralım" yapıyorsanız, iki ayrı değişiklik düşünün.

**Önemli çünkü:**
- İncelemesi ve anlaşılması daha kolay
- Daha temiz arşiv geçmişi
- Bağımsız olarak sunulabilir
- Gerekirse geri alma daha basit

### Belirsiz Gereksinimler İçin `/opsx:explore` Kullanın

Bir değişiklik için taahhütte bulunmadan önce, problem alanını keşfedin:

```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle rate limiting for our API?

AI:  Let me investigate your current setup and options...
     [Researches codebae, considers patterns]

     I see three approaches we could take:
     1. Middleware-based (simple, per-endpoint)
     2. Redis-backed (scalable, shared state)
     3. Token bucket per user (fair, complex)

     Your current stack suggests #1 or #2. What's your scale?
```

Keşif, artifact'ler oluşturmadan önce düşünmenizi netleştirir.

### Arşivlemeden Önce Doğrulayın

Uygulamanın artifact'lerle eşleştiğini kontrol etmek için `/opsx:verify` kullanın:

```text
You: /opsx:verify

AI:  Verifying add-dark-mode...

     ✓ All tasks in tasks.md are checked
     ✓ Requirements in specs have corresponding code
     ✓ Design decisions are reflected in implementation

     Ready to archive!
```

Değişikliği kapatmadan önce uyumsuzlukları yakalar.

### Değişiklikleri Açık Adlandırın

İyi isimler `openspec list` komutunu işlevsel kılar:

```text
İyi:                           Kaçınılması gereken:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Komut Hızlı Referansı

Tüm komut detayları ve seçenekleri için [Komutlar](commands.md) sayfasına bakın.

| Komut | Amaç | Ne Zaman Kullanılır |
|-------|------|---------------------|
| `/opsx:propose` | Değişiklik + planlama araçları oluşturur | Hızlı varsayılan yol (`core` profili) |
| `/opsx:explore` | Fikirleri düşünmek için | Belirsiz gereksinimler, araştırma |
| `/opsx:new` | Bir değişiklik iskeleti başlatmak için | Genişletilmiş mod, açıkça belirlenmiş araç kontrolü |
| `/opsx:continue` | Bir sonraki aracı oluşturmak için | Genişletilmiş mod, adım adım araç oluşturma |
| `/opsx:ff` | Tüm planlama araçlarını oluşturmak için | Genişletilmiş mod, net kapsam |
| `/opsx:apply` | Görevleri uygulamak için | Kod yazmaya hazır olunduğunda |
| `/opsx:verify` | Uygulamayı doğrulamak için | Genişletilmiş mod, arşivlemeden önce |
| `/opsx:sync` | Delta spesifikasyonlarını birleştirmek için | Genişletilmiş mod, isteğe bağlı |
| `/opsx:archive` | Değişikliği tamamlamak için | Tüm işler bittiğinde |
| `/opsx:bulk-archive` | Birden fazla değişikliği arşivlemek için | Genişletilmiş mod, paralel çalışma |

## Sonraki Adımlar

- [Komutlar](commands.md) - Seçeneklerle tam komut referansı
- [Kavramlar](concepts.md) - Spesifikasyonlar, araçlar ve şemalar hakkında derinlemesine bilgi
- [Özelleştirme](customization.md) - Özel iş akışları oluşturma