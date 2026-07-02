# Genel Bakışta Temel Kavramlar

**OpenSpec, sizinle yapay zeka (AI) arasında hafif bir anlaşma katmanıdır.** Siz neyin değişmesi gerektiğini yazarsınız, AI detayları taslak haline getirir, ikiniz de aynı planı incelersiniz ve ancak o zaman kod yazılır. Bu sayfa, tüm zihinsel modeli tek bir ekranda sunar. Uzun versiyonu istediğinizde [Concepts](concepts.md) bölümüne bakabilirsiniz.

İşte tüm fikrin beş kelimede özeti: **Önce anlaşın, sonra güvenle inşa edin.**

## Beş Temel Fikir

OpenSpec'teki her şey beş kavramdan oluşur. Bunları öğrenin, gerisi detaydır.

**1. Specs (Spesifikasyonlar) gerçektir.** Bir spec, sisteminizin *şu anda* nasıl davrandığını tanımlar. `openspec/specs/` içinde bulunur ve alanlara göre (`auth/`, `payments/`, `ui/`) organize edilir. Specs, gereksinimlerden ("sistem 30 dakika sonra oturumları sonlandırmalıdır") ve senaryolardan (somut given/when/then örnekleri) oluşur. Specs'i, "bu yazılım ne işe yarar?" sorusuna verilen tek birleşmiş cevap olarak düşünün.

**2. Bir değişiklik, bir iş birimidir.** Davranışı eklemek, değiştirmek veya kaldırmak istediğinizde bir değişiklik oluşturursunuz: bu çalışma hakkındaki her şeyi tek bir yerde tutan `openspec/changes/` içindeki bir klasördür. Bir öneri, bir tasarım, bir görev listesi ve spec düzenlemeleri. Tek bir değişiklik, tek bir klasör, tek bir özellik.

**3. Delta specs (Fark Spescikleri), tüm dünyayı değil, neyin değiştiğini tanımlar.** Bir değişiklik içinde tüm spesifikasyonu yeniden yazmazsınız. Küçük bir delta yazarsınız: bu gereksinim *EKLENDİ*, şu olanı *DEĞİŞTİRİLDİ*, bunu *KALDIRILDI*. Bu, OpenSpec'i sadece sıfırdan başlayan projeler için değil, mevcut sistemleri düzenlemede iyi yapan hilekandır. Varış noktayı değil, farkı tanımlarsınız.

**4. Artifacts (Eserler) birbirinin üzerine inşa edilir.** Bir değişiklik, doğal bir sırada oluşturulan birkaç belge içerir ve her biri diğerine besin sağlar:

```text
proposal ──► specs ──► design ──► tasks ──► implement
   why        what       how       steps      do it
```

İstediğiniz zaman herhangi birini tekrar inceleyebilirsiniz. Onlar engel değil, kolaylaştırıcıdır (Aşağıda daha fazlası).

**5. Arşivleme, değişikliği gerçeğe geri döndürür.** İş bittiğinde, değişikliği arşivlersiniz. Delta specs'leri ana spesifikasyonlarınıza birleştirilir ve değişiklik klasörü, tarih damgasıyla birlikte `changes/archive/` konumuna taşınır. Artık spesifikasyonlarınız yeni gerçekliği tanımlar ve bir sonraki değişikliğe hazırsınız demektir. Döngü kapanmıştır.

## Görsel Temsil

```text
┌─────────────────────────────────────────────────────────────────┐
│                          openspec/                              │
│                                                                 │
│   ┌──────────────────┐         ┌──────────────────────────┐    │
│   │     specs/       │         │        changes/          │    │
│   │                  │ ◄─────  │                          │    │
│   │ source of truth  │  merge  │ one folder per change    │    │
│   │ how things work  │  on     │ proposal · design ·      │    │
│   │ today            │ archive │ tasks · delta specs      │    │
│   └──────────────────┘         └──────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

İki klasör. `specs/` gerçektir. `changes/` ise önerdiğinizdir. Arşivleme, bir öneriyi gerçeğe taşır.

## Gerçekte Çalıştıracağınız Döngü

Varsayılan kurulumda gününüz böyle geçer. İsteğe bağlı olarak önce düşünün; sonra bir komut planı taslaklar, siz okursunuz, diğeri inşa eder ve sonuncusu dosyalar.

```text
/opsx:explore                   →  (isteğe bağlı) Önce AI ile düşünmek
/opsx:propose add-dark-mode     →  AI öneri, specs, tasarım, görevler taslağı çıkarır
        (siz planı okur ve düzenlersiniz)
/opsx:apply                     →  AI inşa eder, görevleri işaretler
/opsx:archive                   →  specs güncellenir, değişiklik arşivlenir
```

**Şüpheye düştüğünüzde keşfetmeye başlayın.** `/opsx:explore`, risksiz bir düşünme ortağıdır: kodunuzu okur, seçenekleri sıralar ve herhangi bir eser oluşmadan önce belirsiz bir fikri somut bir plana dönüştürür. Bu, aksi takdirde yapay zekanın muğlak bir komuttan *bir şey* inşa etmesini engelleyen en iyi panzehirdir. Zaten ne istediğinizi biliyor musunuz? Doğrudan `/opsx:propose`'a geçin. Her iki durumda da keşfetme özelliği varsayılan profilde mevcuttur, bu yüzden her zaman oradadır. [Explore guide](explore.md)'ı görün.

Bunlar, AI asistanınızın sohbetine yazdığınız slash komutlarıdır. Kurulum (`openspec init`) terminalinizde yapılır. Bu ayrım size yeni ise, önce [How Commands Work](how-commands-work.md)'ü okuyun; bu en yaygın kafa karışıklığı noktasıdır.

## "Engeller değil, kolaylaştırıcılar"

Bu ifade OpenSpec'te her yerde karşınıza çıkar, bu yüzden bunun ne anlama geldiğini basitçe açıklayalım.

Eski usul spec süreçleri şelale gibidir: planlamayı bitirin, *sonra* uygulamaya izin verilir ve geri dönmek acı vericidir. OpenSpec buna karşıdır. `proposal → specs → design → tasks` sırası, bir sonra neyin *mümkün olacağını*, bir sonra ne yapmak zorunda olduğunuzu göstermez.

Tasarımın yanlış olduğunu uygulama sırasında mı fark ettiniz? `design.md` dosyasını düzenleyin ve devam edin. Kapsamın küçültülmesi gerektiğini mi anladınız? Öneriyi güncelleyin. Hiçbir şey kilitlenmez. Bağımlılıklar, sizi sınırlamak için değil, AI'nın ihtiyacı olan bağlama sahip olması için vardır (temel almadan iyi görevler yazamazsınız).

Buradaki güç dürüstlüktür: Gerçek iş dağınık ve yinelemelidir ve OpenSpec buna izin verir. Bunun karşılığı disiplindir: Hiçbir şey sizi ileri itmediği için, değişikliği yayılmaya bırakmak yerine odaklanmış tutmak sizin sorumluluğunuzdadır. [Workflows](workflows.md) rehberi bu konuda iyi alışkanlıklar sunar.

## Bu Küçük Ek Yükün Neden Değerli Olduğu

Basit bir gerçek: OpenSpec bir adım ekler. İnşa etmeden önce kısa bir plan yazarsınız. Peki karşılığında ne alıyorsunuz?

- **Yanlış yollara sapmadan önce yakalarsınız.** Bir paragraf uzunluğundaki bir önerideki yanlış anlaşılmayı düzeltmek ücretsizdir. Bunu AI 400 satır kod yazdıktan sonra düzeltmek ise ücretsiz değildir.
- **Plan ve kod aynı repo'da kalır.** Altı ay sonra, spec sistemin neden bu şekilde çalıştığını size (veya bir sonraki AI oturumuna) anlatır.
- **Değişiklikler gözden geçirilebilir.** Bir değişiklik klasörü düzenli bir pakettir: öneriyi okuyun, delta'ları inceleyin, görevleri kontrol edin. Sohbet geçmişinde arkeoloji yapmayın.
- **Mevcut kod tabanlarına uyar.** Delta'lar sayesinde, 50.000 satırlık bir uygulamaya önce tümünü dokümante etmeden değişikliği belirtebilirsiniz.

Ve dürüst tradeoff (takas): Gerçekten önemsiz, tek satırlık bir düzeltme için bu tören fayda sağlamayabilir ve bu sorun değil. OpenSpec hafif olmak üzere tasarlanmıştır, ancak ücretsiz değildir. Onu kullanmanız gereken yer, anlaşmanın önemli olduğu yerdir; ki bu da AI ile çalıştığınızda (ve o size muğlakça sorduğunuz her şeyi güvenle inşa edeceğinizde) çoğu zaman böyledir.

## Nereye Devam Etmeli?

- Yeni misiniz? [Getting Started](getting-started.md), ilk değişikliği tam olarak anlatır.
- Henüz ne inşa edeceğinize karar vermediniz mi? [Explore First](explore.md) başlamak için doğru yerdir.
- Komutların nerede çalıştığı konusunda mı kafanız karıştı? [How Commands Work](how-commands-work.md).
- Yukarıdakilerin derinlemesine versiyonunu mu istiyorsunuz? [Concepts](concepts.md).
- Örneklerle mi öğrenmek istersiniz? [Examples & Recipes](examples.md).
- Bir terimin tanımını mı arıyorsunuz? [Glossary](glossary.md).