# Örnekler ve Tarifler

Gerçek değişiklikler, baştan sona. Her tarif, yazacağınız komutları ve geri alacağınız çıktıyı gösterir; böylece kendi durumunuzu bir kalıba benzetleyip kopyalayabilirsiniz. Bunlar varsayılan **core** komutlarını (`propose`, `explore`, `apply`, `sync`, `archive`) kullanır; genişletilmiş setin yardımcı olduğu yer belirtilmiştir.

Başlamadan önce bir hatırlatma: `/opsx:propose` gibi eğik çizgi (slash) komutları **AI asistanınızın sohbetine**, `openspec` komutları ise **terminalinize** girer. Eğer bu size yeni ise, önce [How Commands Work](how-commands-work.md)'ü okuyun. Aşağıdaki transkriptlerde, `You:` ve `AI:` sohbeti temsil ederken, `$` ile başlayan satırlar terminaldir.

> **Henüz ne inşa ettiğinizi bilmiyor musunuz?** Bu tariflerin çoğu, önce düşünmek için `/opsx:explore` ile başlamanız halinde daha keskin hale gelir. [Recipe 3](#recipe-3-exploring-before-you-commit) bunu uygulamalı olarak gösterir ve [Explore First](explore.md) rehberi tüm argümanı sunar.

## Recipe 1: Küçük bir özellik, hızlı yol

**Ne zaman kullanılır:** Ne istediğinizi biliyorsunuz ve bu sınırlı bir çalışma parçasıdır. Bu en yaygın tariftir.

Tüm süreç üç komuttan oluşur. Propose (Öneri), build (Oluşturma), archive (Arşivleme).

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — neden ve ne
     ✓ specs/      — yeni gereksinim ve senaryoları
     ✓ design.md   — teknik yaklaşım
     ✓ tasks.md    — uygulama kontrol listesi
     Implementation için hazır. /opsx:apply komutunu çalıştırın.
```

Şimdi planı okuyun. Proposal'ı ve delta spec'i açın. OpenSpec'in yapıldığı an budur: yanlış bir varsayımı henüz 400 satır kod değil, tek bir paragraf iken yakalamak. Eğer bir şey yanlışsa herhangi bir artefaktı doğrudan düzenleyin, sonra devam edin.

```text
You: /opsx:apply

AI:  Görevler üzerinde çalışılıyor...
     ✓ 1.1 Header'a logout butonu ekle
     ✓ 1.2 Tıklamada oturumu temizle
     ✓ 1.3 Onaylama iletişim kutusu ekle
     Tüm görevler tamamlandı!

You: /opsx:archive

AI:  add-logout-button arşivleniyor...
     ✓ Specs, openspec/specs/auth/spec.md içine birleştirildi
     ✓ openspec/changes/archive/2026-06-22-add-logout-button/ içine taşındı
     Bitti. Bir sonraki değişiklik için hazır.
```

Hepsi bu kadar. Logout davranışı artık specs'lerinizin bir parçası ve değişiklik, tam bağlamıyla birlikte dosyalandı.

## Recipe 2: Bir hata düzeltme

**Ne zaman kullanılır:** Bir şey bozuk ve bunu gizemli bir commit yerine kasıtlı bir davranış değişikliği olarak kaydetmek istiyorsunuz.

Hata düzeltmeleri özellikler gibi çalışır. Fark, öneriyi nasıl çerçevelediğinizdedir: sadece "hatayı düzelt" demek yerine *doğru* davranışı tanımlayın.

```text
You: /opsx:propose fix-login-redirect-loop

AI:  openspec/changes/fix-login-redirect-loop/ oluşturuldu
     Öneri, mevcut bozuk davranışı ve amaçlanan davranışı yakalar. Delta spec, yönlendirme gereksinimini MODİFIE ederek artık kesin ve test edilebilir hale getirir.
     Implementation için hazır.
```

Düzeltme bir `MODIFIED` gereksinimi olarak ve yeni bir senaryo ile geldiği için, sonraki kişi (veya sonraki AI oturumu) sadece düzelttiğinizi değil, "doğru"nun ne anlama geldiğini de görür. Ardından normal şekilde `/opsx:apply` ve `/opsx:archive`.

İpucu: bir düzeltme için iyi bir senaryo, prozayla yazılmış regresyon testidir. "GİRİŞTE oturumu kapatılmış bir kullanıcı VARSA, GEÇERLİ kimlik bilgilerini GÖNDERİRSE, PANODAYA ulaşır ve tekrar yönlendirilmez." Bunu yazın ve uygulama net bir hedef edinir.

## Recipe 3: Commit etmeden önce keşfetme

**Ne zaman kullanılır:** Bir sorununuz var ama henüz bir planınız yok. Ne inşa edeceğinizden veya hangi yaklaşımın doğru olduğundan emin değilsiniz.

`/opsx:explore` ile başlayın. Bu, yapısı olmayan ve herhangi bir artefakt oluşturmayan bir düşünce ortağıdır. Kod tabanınızı okur ve karar vermenize yardımcı olur.

```text
You: /opsx:explore

AI:  Ne keşfetmek istersiniz?

You: Sayfa yüklenmesi yavaş geliyor ama zamanın nereye gittiğini bilmiyorum.

AI:  Bakmama izin verin... Üç olası suçlu buldum:
     1. Ürün listesindeki büyük, optimize edilmemiş görseller
     2. Render'ı engelleyen senkron veri çekme
     3. Context değişiklikleri tarafından tetiklenen yeniden renderlar
     Hangisine önce odaklanmalıyız?

You: Veri çekme olanına.

You: /opsx:propose optimize-product-list-fetching

AI:  Yeni bulduklarımızla bilgilendirilmiş bir öneri ile değişikliği oluşturuldu. Implementation için hazır.
```

Keşfetme, bir değişiklik harcamadan *önce* düşüncenizi netleştirir. İçgörü kristalleştiğinde, öneriyi yapın ve AI bağlamı ileriye taşısın.

## Recipe 4: Aynı anda iki değişikliği yönetmek

**Ne zaman kullanılır:** Bir özelliğin ortasındasınız ve acil bir düzeltme sırayı atlıyor.

Değişiklikler bağımsız klasörlerdir, bu yüzden paralel çalışma çakışmaz. Düzeltmeyi başlatın, gönderin, sonra kaldığınız yerden özelliğe geri dönün.

```text
You: add-dark-mode üzerinde yarı yoldayım ama şimdi bir login hatasını düzeltmem gerekiyor.

You: /opsx:propose fix-login-redirect

AI:  openspec/changes/fix-login-redirect/ oluşturuldu. Implementation için hazır.

You: /opsx:apply

AI:  Düzeltme uygulandı. Tüm görevler tamamlandı.

You: /opsx:archive

AI:  ✓ fix-login-redirect arşivlendi.

You: Dark mode'a geri dönüyorum.

You: /opsx:apply add-dark-mode

AI:  add-dark-mode devam ediyor. Görev 2.3: Header Güncelleme'den devam ediliyor...
```

`/opsx:apply add-dark-mode` içinde değişikliğin adını vermek, birden fazla aktif değişiklik olduğunda AI'ı belirli bir değişikliğe yönlendirmenin yoludur. Görevler `tasks.md` içinde tamamlanmayı izlediği için, AI tam olarak nerede durduğunuzu bilir.

Birden fazla değişiklik aynı anda yapıldığında, genişletilmiş `/opsx:bulk-archive` onları birlikte arşivler ve neyin gerçekten uygulandığını kontrol ederek spec çakışmalarını çözer. [Workflows](workflows.md#parallel-changes)'e bakın.

## Recipe 5: Davranış değişikliği olmayan bir refactor (yeniden düzenleme)

**Ne zaman kullanılır:** Kodu yeniden yapılandırıyorsunuz ve dışarıdan görünen davranışın aynı kalması gerekiyor.

Bu ilginç durumdur, çünkü saf bir refactor'da *specs'lere ekleyecek hiçbir şey yoktur*. Davranış sözleşmesi değişmez; sadece uygulama değişir. Bu nedenle iş tasarım ve görevlerde yer alır ve spec delta boş veya yoktur.

```text
You: /opsx:propose refactor-payment-module

AI:  Değişiklik oluşturuldu. Öneri, hedefi (ödeme modülünü ayırmak, davranış değişikliği yok) belirtir ve tasarım yeni yapıyı yakalar. Davranış aynı olduğu için spec değişikliği yok. Implementation için hazır.
```

Specs'lere dokunmayan bir değişikliği arşivlerken, terminal komutuna spec adımını atlamasını söyleyebilirsiniz:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

Aynı bayrak, araçlar (tooling), CI ve sadece dokümantasyon değişiklikleri için de kullanışlıdır. Prensip şudur: specs davranışı tanımlar, bu yüzden davranış değişmediyse, spec de değişmemelidir. [Concepts](concepts.md#what-a-spec-is-and-is-not)'e bakın.

## Recipe 6: Adım adım kontrol (genişletilmiş komutlar)

**Ne zaman kullanılır:** Bir sonraki adıma geçmeden önce her artefaktı gözden geçirmek istediğiniz karmaşık veya riskli bir değişiklik.

Temel `/opsx:propose` hepsini aynı anda taslak haline getirir. Teker teker ilerlemeyi tercih ediyorsanız, genişletilmiş komutları etkinleştirin:

```bash
$ openspec config profile      # genişletilmiş iş akışlarını seç
$ openspec update              # bunları bu projeye uygula
```

Şimdi aşamalı olarak iskelet oluşturabilir ve inşa edebilirsiniz:

```text
You: /opsx:new add-2fa

AI:  openspec/changes/add-2fa/ oluşturuldu. proposal oluşturmaya hazır.

You: /opsx:continue

AI:  proposal.md oluşturuldu. Şimdi mevcut olanlar: specs, design.

You: /opsx:continue

AI:  specs/auth/spec.md oluşturuldu. Şimdi mevcut olanlar: design.
```

Her artefakt geldiğinde gözden geçirin, özgürce düzenleyin ve memnun olduğunuzda devam edin. Geri kalanların hepsinin bir kerede taslak haline getirilmesini istiyorsanız, `/opsx:ff` kalan planlama artefaktlarını ileri sarar (fast-forwards). Arşivlemeden önce, `/opsx:verify` uygulamanın gerçekten specs'lere uyup uymadığını kontrol eder. [Workflows](workflows.md#opsxff-vs-opsxcontinue)'e bakın.

## Recipe 7: Tüm döngüyü uygulamalı olarak öğrenme

**Ne zaman kullanılır:** OpenSpec'i kurdunuz ve bir oyuncak örnek değil, kendi kodunuz üzerinde iş akışını *hissetmek* istiyorsunuz.

Genişletilmiş komutları etkinleştirin (Recipe 6'ya bakın), ardından:

```text
You: /opsx:onboard

AI:  OpenSpec'e hoş geldiniz! Gerçek kod tabanınızı kullanarak tam bir değişiklik üzerinden size rehberlik edeceğim. Birlikte yapabileceğimiz küçük, güvenli bir iyileştirme için tarama yapmama izin verin...
```

`/opsx:onboard` gerçek (küçük) bir iyileştirme bulur, bunun için bir değişiklik oluşturur, uygular ve her adımı anlatarak arşivler. 15 ila 30 dakika sürer ve size tutabileceğiniz veya atabileceğiniz gerçek bir değişiklik bırakır. Bu öğrenmenin en nazik yoludur. [Commands](commands.md#opsxonboard)'a bakın.

## Terminalden çalışmanızı kontrol etme

İstediğiniz zaman, terminalinizden her şeyin durumunu inceleyebilirsiniz:

```bash
$ openspec list                      # aktif değişiklikler
$ openspec show add-dark-mode        # bir değişikliği detaylı olarak
$ openspec validate add-dark-mode    # yapıyı kontrol et
$ openspec view                      # etkileşimli gösterge tablosu
```

Bunlar okuma ve inceleme araçlarıdır. Öneri yapma ve inşa etme hala sohbet içindeki eğik çizgi komutları aracılığıyla yapılır. Tam ayrıntılar [CLI reference](cli.md)'da.

## Nereye devam edebilirsiniz?

- [Explore First](explore.md): Emin olmadığınızda başlamak için önerilen yol
- [Workflows](workflows.md): Hangi durumda hangisini kullanacağınıza dair karar verme rehberliği ile yukarıdaki kalıplar
- [Commands](commands.md): Her bir eğik çizgi komutunun ayrıntılı
- [Getting Started](getting-started.md): Kanonik ilk değişiklik kılavuzu
- [Concepts](concepts.md): Parçaların neden birlikte çalıştığı