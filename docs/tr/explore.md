# Keşfetme (Explore)

**`/opsx:explore` sizin düşünce ortağınızdır.** Bir sorununuz olduğunda ama henüz bir planınız olmadığında ona yönelin. Kod tabanınızı inceler, seçenekleri sizinle birlikte tartıp ne istediğinizi netleştirir; bu süreçte tek bir çıktı veya kod satırı oluşturulmadan önce bunu yapar. Resim netleştiğinde, işi `/opsx:propose`'a devreder.

Bu dokümanlardan bir alışkanlık edinmek isterseniz, şunu edinin: **Emin değilseniz, teklif vermeden önce keşfedin.**

Bunun neden önemli olduğunu açıklayalım. AI kodlama asistanları heveslidir. Belirsiz sorular sorun ve onlar kendinden emin bir şekilde *bir şeyler* oluştururlar; belki de ihtiyacınız olan şeyi değil. Explore bu durumun panzehiridir. Bu, sizin ve yapay zekanın doğru hamleyi birlikte bulduğu, risksiz bir konuşmadır. Böylece teklif verdiğinizde, doğru şeyi teklif etmiş olursunuz.

## Ne zaman keşfetmeli (When to explore)

Explore, insanların düşündüğünden daha sık doğru ilk adımdır. Aşağıdakilerden herhangi biri geçerliyse onu kullanın:

- *Sorunu* biliyor ancak *çözümü* bilmiyorsunuz. ("Sayfalar yavaş geliyor." "Kimlik doğrulama (Auth) karmaşık.")
- Yaklaşımlar arasında seçim yapıyorsunuz ve bu yaklaşımların kendi kodunuzla olan ödünleşmelerini (tradeoffs) görmek istiyorsunuz.
- Bir kod tabanına yeni başlıyorsunuz ve onu değiştirmeden önce bir şeyin nasıl çalıştığını anlamanız gerekiyor.
- Gereksinimler muğlak (fuzzy) ve taahhütte bulunmadan önce onları keskinleştirmek istiyorsunuz.
- İşin göründüğünden daha büyük veya daha küçük olabileceğini düşünüyorsunuz ve dürüstünce kapsamını belirlemek istiyorsunuz.

Yalnızca ne istediğinizi ve nasıl yapacağınızı kesin olarak biliyorsanız explore'u atlayın. Bu durumda doğrudan [`/opsx:propose`](commands.md#opsxpropose) komutuna gidin.

## Ne yapar (ve ne yapmaz)

Explore bir **konuşmadır**, bir üretici değildir.

**Şunları yapar:**
- Gerçek soruları yanıtlamak için kod tabanınızı okur ve arar.
- Seçenekleri karşılaştırır ve her birinin ödünleşmelerini belirtir.
- Bir tasarımı anlaşılır kılmak için diyagramlar çizer.
- Muğlak bir fikri somut, yapılabilir bir kapsama daraltmanıza yardımcı olur.
- Hazır olduğunuzda `/opsx:propose`'a geçiş yapar.

**Şunları yapmaz:**
- Bir değişiklik klasörü oluşturur.
- Herhangi bir çıktı (proposal, specs, tasarım veya görevler) yazmaz.
- Kod yazmaz veya düzenlemez.

İşte mesele bu. Keşfetmek size hiçbir şey maliyet çıkarmaz ve sizi hiçbir şeye taahhüt etmez. Üç tane çıkmaza keşif yapabilir, her birinden bir şeyler öğrenebilir ve ancak o zaman hayatta kalan yolu teklif edebilirsiniz.

## Zaten yüklü (It's already installed)

İyi haber: `/opsx:explore`, `propose`, `apply`, `sync` ve `archive` ile birlikte gelen varsayılan **core** profiline dahildir. Hiçbir şeyi etkinleştirmenize gerek yok. Eğer OpenSpec projenizde kuruluysa, explore yapay zeka sohbetinizde hazırdır. (Tüm `/opsx:*` komutları gibi, bunu terminalde değil asistanınızın sohbetinde yazarsınız. [Komutların Nasıl Çalıştığı](how-commands-work.md) bölümüne bakın.)

## Tam bir örnek

Muğlak bir endişenin keskin, yapılabilir bir değişikliğe nasıl dönüştüğünü izleyin.

```text
You: /opsx:explore

AI:  Ne keşfetmek istersiniz?

You: Checkout sayfamız bazen çift sipariş oluşturuyor. Nedenini bilmiyorum ve güvenli bir şekilde nasıl düzelteceğimi de bilmiyorum.

AI:  Checkout yolunu incelememe izin verin...
     [sipariş servisini, ödeme webhook handler'ını ve
      client submit mantığını okur]

     İşte bulduklarım. Çift sipariş oluşmasının iki yolu var:

     1. Client iki kez gönderebilir (çifte tıklama, yavaş ağda tekrar deneme).
        Bunu hiçbir şey debounce etmiyor.
     2. Ödeme webhook'u birden fazla kez tetiklenebilir ve handler her seferinde bir sipariş oluşturur. Idempotency key yok.

     #2 tehlikeli olan: iki kez ücret alıp yerine getirme yapabilir.

     Düzeltmek için üç yol, kabaca sağlamlık sırasına göre:
     - Sipariş oluşturma endpoint'inde idempotency key (her iki nedeni de ele alır)
     - Ödeme intent id ile webhook üzerinde dedup (yalnızca #2'yi ele alır)
     - Client tarafı debounce (yalnızca #1'i ele alır, gerçek hatayı örtbas eder)

     Kodunuz zaten ödeme-intent id'sini tuttuğu için, idempotency-key yaklaşımı en büyük getiriyi sağlayan küçük bir değişikliktir.
     Bunu kapsamını belirlememi ister misiniz?

You: Evet, idempotency key yapalım.

You: /opsx:propose add-order-idempotency-key

AI:  Ne bulduğumuza dayanan bir proposal ve delta spec ile openspec/changes/add-order-idempotency-key/ oluşturuldu. Uygulamaya hazır.
```

Olanları fark edin. Başlangıç noktası "bir şey yanlış ve dokunmaktan korkuyorum" idi. Yirmi saniyelik keşif, bunu adlandırılmış bir kök nedene, üç sıralanmış seçeneğe, mevcut koda bağlı bir öneriye ve kesin bir değişikliğe dönüştürdü. Takip eden teklif keskindir çünkü düşünme önce yapılmıştır.

## Propose'a devretmek (Handing off to propose)

Explore hiçbir şeye arşivleme yapmaz. Hazır olduğunuzda, basitçe bir değişiklik başlatırsınız ve AI sohbetinizdeki bağlamı çıktılara taşır.

```text
explore  ──►  propose  ──►  apply  ──►  archive
 (düşünme)     (onaylama)       (oluşturma)     (kaydetme)
```

Bunu düz bir dille söyleyebilirsiniz ("bunu bir değişikliğe dönüştürelim") veya doğrudan `/opsx:propose <name>` çalıştırabilirsiniz. Her iki durumda da, az önce yaptığınız keşif, atılacak bir sohbet değil, teklifin temelini oluşturur.

Genişletilmiş komut setini kullanırsanız, explore bunun yerine adım adım çıktı oluşturma için `/opsx:new`'a devredebilir. [İş Akışları](workflows.md) bölümüne bakın.

## İyi bir keşif için ipuçları

- **Çözümü değil, sorunu getirin.** "Loginlar yavaş geliyor" AI'ya araştırma yapması için alan sağlar. "Bir Redis cache ekleyin" henüz test etmediğiniz bir cevaba önceden taahhüt vermiş olursunuz.
- **Ödünleşmeleri yüksek sesle sorun.** "Her seçeneğin dezavantajları nelerdir?" daha dürüstünce bir karşılaştırma almanızı sağlar.
- **İlk önce okumasını sağlayın.** En iyi keşifler, AI'nın tahmin etmek yerine gerçekten kodunu incelemesiyle başlar. Gerekirse ilgili alana işaret edin.
- **Pes etmek sorun değildir.** Keşif fikrin değmeyeceğini gösterirse, bu bir zaferdir. Bunu ucuza öğrendiniz.
- **Değişiklik sırasında tekrar keşfedin.** `/opsx:apply` sırasında takıldınız mı? Geri dönüp alt bir sorunu keşfedebilir ve sonra geri dönebilirsiniz.

## Dürüst ödünleşmeler (The honest tradeoffs)

**Ne kazanırsınız:** explore, herhangi bir çıktıdan önce, en ucuz anda yanlış yolları yakalar. Bu, özellikle AI'nın sistemi okuma ve özetleme yeteneğinin öğleden sonraki bir araştırma yapma ihtiyacını ortadan kaldırdığı tanıdık olmayan kodlarda çok güçlüdür.

**Ne maliyeti vardır:** Biraz sabır. Explore bir konuşmadır, bu yüzden `/opsx:propose` çalıştırıp umut etmekten daha yavaştır. Eğer işi gerçekten anlıyorsanız, o ekstra adım saf bir yükümlülüktür ve onu atlamalısınız.

Kural: Görev ne kadar muğlaksa, explore o kadar çok fayda sağlar. Görev ne kadar netse, teklif vermeye doğrudan geçme şansınız o kadar fazladır.

## Nereye devam etmeli (Where to go next)

- [Komutlar: `/opsx:explore`](commands.md#opsxexplore): kesin referans
- [İş Akışları](workflows.md): günlük döngünün bir parçası olarak explore
- [Örnekler ve Tarifler](examples.md#recipe-3-exploring-before-you-commit): tam bir rehberde explore
- [Başlangıç (Getting Started)](getting-started.md): keşfi içeren ilk değişiklik rehberi