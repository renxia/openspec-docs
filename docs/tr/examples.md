# Örnekler ve Tarifler

Gerçek değişiklikler, baştan sona. Her tarif, yazacağınız komutları ve geri döneceğiniz sonuçları gösterir, böylece durumunuzu bir kalıpla eşleştirebilir ve kopyalayabilirsiniz. Bunlar varsayılan **çekirdek** komutları (`propose`, `explore`, `apply`, `sync`, `archive`) kullanır; genişletilmiş komut setinin yardımcı olabileceği yerler belirtilmiştir.

Başlamadan önce bir hatırlatma: `/opsx:propose` gibi eğik çizgi komutları **AI asistanınızın sohbetine** girilir, `openspec` komutları ise **terminalinize** girilir. Bu yeniyseniz, önce [Komutlar Nasıl Çalışır](how-commands-work.md) belgesini okuyun. Aşağıdaki kayıtlarda, `You:` ve `AI:` sohbeti, `$` ile başlayan satırlar terminali temsil eder.

> **Henüz ne üreteceğinizden emin değil misiniz?** Bu tariflerin çoğu, önce `/opsx:explore` ile düşünerek başlarsanız daha etkili olur. [Tarif 3](#recipe-3-exploring-before-you-commit) bunu uygulamalı olarak gösterir ve [Önce Keşfet](explore.md) kılavuzu tüm durumu açıklar.

## Tarif 1: Küçük bir özellik, hızlı yol

**Ne zaman kullanılır:** İstediğiniz şeyi biliyorsunuz ve bu, kapsamı sınırlı bir iş parçasıdır. Bu en yaygın tariftir.

Tüm bunlar üç komuttan ibarettir. Öner, oluştur, arşivle.

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

Şimdi planı okuyun. Öneriyi ve delta spec'i açın. OpenSpec'in tam olarak bu an için tasarlandığı andır: yanlış bir varsayımı 400 satır kod yerine hala bir paragraf iken yakalamak. Bir şeyler yanlışsa herhangi bir kalıbı doğrudan düzenleyin, sonra devam edin.

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Add logout button to header
     ✓ 1.2 Clear session on click
     ✓ 1.3 Add confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  Archiving add-logout-button...
     ✓ Merged specs into openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2026-06-22-add-logout-button/
     Done. Ready for the next change.
```

Hepsi bu. Çıkış davranışı artık spec'lerinizin bir parçası ve değişiklik tüm bağlamıyla birlikte arşivlendi.

## Tarif 2: Hata düzeltmesi

**Ne zaman kullanılır:** Bir şey bozuk ve düzeltmeyi, davranışa yönelik kasıtlı bir değişiklik olarak kaydetmek istiyorsunuz, gizemli bir commit olarak değil.

Hata düzeltmeleri tam olarak özellikler gibi çalışır. Fark, öneriyi nasıl formülediğinizdedir: sadece "hatayı düzelt" demek yerine *doğru* davranışı tanımlayın.

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

Düzeltme, yeni bir senaryo ile birlikte `MODIFIED` gereksinimi olarak kaydedildiği için bir sonraki kişi (veya bir sonraki AI oturumu) sadece düzelttiğinizi değil, "doğru" olmanın ne anlama geldiğini de görür. Sonra her zamanki gibi `/opsx:apply` ve `/opsx:archive` komutlarını çalıştırın.

İpucu: Bir düzeltme için iyi bir senaryo, metin halindeki geri dönüş testidir. "GIVEN oturumu kapatılmış bir kullanıcı, WHEN geçerli kimlik bilgilerini gönderir, THEN panele yönlendirilir ve tekrar yönlendirilmez." Bunu yazın, uygulamanın net bir hedefi olur.

## Tarif 3: Taahhüt etmeden önce keşfetme

**Ne zaman kullanılır:** Bir sorununuz var ama henüz bir planınız yok. Ne üreteceğinizden veya hangi yaklaşımın doğru olduğundan emin değilsiniz.

`/opsx:explore` komutuyla başlayın. Bu, yapılandırılmış olmayan, hiçbir kalıp oluşturmayan bir düşünme ortağıdır. Kod tabanınızı okur ve karar vermenize yardımcı olur.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Page loads feel slow but I don't know where the time goes.

AI:  Let me look... I found three likely culprits:
     1. Large unoptimized images on the product list
     2. Synchronous data fetching that blocks render
     3. Re-renders triggered by context changes
     Which should we tackle first?

You: The data fetching one.

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation.
```

Keşif, düşüncelerinizi bir değişikliğe harcamadan *önce* netleştirir. İçgörü netleştiğinde öneri yapın, AI bağlamı ilerletir.

## Tarif 4: Aynı anda iki değişikliği yönetme

**Ne zaman kullanılır:** Bir özellik üzerinde çalışırken acil bir düzeltme sıraya giriyor.

Değişiklikler bağımsız klasörler olduğu için paralel çalışma çakışmaya neden olmaz. Düzeltmeyi başlatın, gönderin, sonra özelliğe bıraktığınız yerden dönün.

```text
You: I'm partway through add-dark-mode, but I need to fix a login bug now.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Ready for implementation.

You: /opsx:apply

AI:  Implemented the fix. All tasks complete.

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect.

You: Back to dark mode.

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode. Picking up at task 2.3: Update Header...
```

Birden fazla değişiklik aktif olduğunda `/opsx:apply add-dark-mode` ile değişikliği adlandırmak, AI'ı belirli bir değişikliğe yönlendirmenin yoludur. Görevler `tasks.md` dosyasında tamamlanma durumunu takip ettiği için AI, bıraktığınız yeri tam olarak bilir.

Birkaç değişiklik aynı anda tamamlandığında, genişletilmiş `/opsx:bulk-archive` komutu hepsini birlikte dosyalar ve gerçekten uygulananları kontrol ederek spec çakışmalarını çözer. Bkz. [İş Akışları](workflows.md#parallel-changes).

## Tarif 5: Davranış değişikliği olmayan bir yeniden düzenleme

**Ne zaman kullanılır:** Kodu yeniden yapılandırıyorsunuz ve dışarıdan görülebilir davranışın aynı kalması gerekiyor.

Bu ilginç durumdur, çünkü saf bir yeniden düzenleme, spec'lerinize *eklenecek hiçbir şey yoktur*. Davranış sözleşmesi değişmez; sadece uygulama değişir. Bu nedenle çalışma tasarım ve görevlerde yaşar, spec delta'sı boştur veya yoktur.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

Değişikliğin `.openspec.yaml` dosyasına `skip_specs: true` ayarlayarak boş delta'yı açıkça bildirin:

```yaml
schema: spec-driven
skip_specs: true
```

İşaret olmadan, `openspec validate` sıfır delta içeren bir değişikliği reddeder (böylece unutulmuş bir spec aşaması da yakalanır); işaret ile birlikte doğrulama geçer ve `openspec status` spec aşamasını beklemede yerine açıkça atlandı olarak gösterir. Yeniden düzenleme sonradan davranış değiştiriyorsa, `.openspec.yaml` dosyasından `skip_specs` ayarını kaldırın ve delta spec'leri yazın — doğrulama, işareti ve spec dosyalarını çakışma olarak değerlendirir, böylece eski işaret sessizce kalınamaz.

İşaretli bir değişikliği arşivlemek için ek bayrak gerekmez (birleştirilecek delta yoktur). Bağımsız olarak, `--skip-specs` bayrağı terminal komutuna spec adımını açıkça atlamasını söyler:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

Aynı bayrak, araçlar, CI ve sadece belge değişiklikleri için kullanışlıdır. İlke: spec'ler davranışı tanımlar, yani davranış değişmediyse spec de değişmemelidir. Bkz. [Kavramlar](concepts.md#what-a-spec-is-and-is-not).

## Tarif 6: Adım adım kontrol (genişletilmiş komutlar)

**Ne zaman kullanılır:** İlerlemeden önce her kalıbı gözden geçirmek istediğiniz karmaşık veya riskli bir değişiklik.

Çekirdek `/opsx:propose` komutu her şeyi bir kerede taslak olarak oluşturur. Adım adım gitmeyi tercih ediyorsanız, genişletilmiş komutları etkinleştirin:

```bash
$ openspec config profile      # genişletilmiş iş akışlarını seç
$ openspec update              # bunları bu projeye uygula
```

Artık iskeleti oluşturabilir ve kademeli olarak geliştirebilirsiniz:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

Her kalıp oluşturulduğunda gözden geçirin, özgürce düzenleyin ve memnun olduğunuzda devam edin. Kalan planlama kalıplarını bir kerede taslak olarak oluşturmak istediğinizde `/opsx:ff` komutunu kullanın. Arşivlemeden önce `/opsx:verify` komutu uygulamanın gerçekten spec'lerle eşleştiğini kontrol eder. Bkz. [İş Akışları](workflows.md#opsxff-vs-opsxcontinue).

## Tarif 7: Tüm döngüyü uygulamalı öğrenme

**Ne zaman kullanılır:** OpenSpec'i yüklediniz ve iş akışını kendi kodunuz üzerinde *hissetmek* istiyorsunuz, oyuncağı örnek yerine.

Genişletilmiş komutları etkinleştirin (Tarif 6'ya bakın), sonra:

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` gerçek (küçük) bir iyileştirme bulur, bunun için bir değişiklik oluşturur, uygular ve her adımı anlatarak arşivler. 15 ila 30 dakika sürer ve size saklayabileceğiniz veya çıkarabileceğiniz gerçek bir değişiklik bırakır. Öğrenmenin en nazik yoludur. Bkz. [Komutlar](commands.md#opsxonboard).

## İşinizi terminalden kontrol etme

İstediğiniz zaman, terminalinizden durumu kontrol edebilirsiniz:

```bash
$ openspec list                      # aktif değişiklikler
$ openspec show add-dark-mode        # tek bir değişikliğin ayrıntıları
$ openspec validate add-dark-mode    # yapıyı kontrol et
$ openspec view                      # etkileşimli kontrol paneli
```

Bunlar okuma ve denetleme araçlarıdır. Öneri yapma ve oluşturma işlemleri hala sohbetteki eğik çizgi komutlarıyla yapılır. Tüm ayrıntılar [CLI referansında](cli.md) bulunur.

## Sonra nereye gidebilirsiniz

- [Önce Keşfet](explore.md): emin olmadığınızda başlamanız için önerilen yol
- [İş Akışları](workflows.md): yukarıdaki kalıplar ve her birini ne zaman kullanacağınıza yönelik karar rehberliği
- [Komutlar](commands.md): tüm eğik çizgi komutlarının ayrıntıları
- [Başlarken](getting-started.md): standart ilk değişiklik yürütmesi
- [Kavramlar](concepts.md): parçaların neden böyle bir şekilde bir araya geldiği