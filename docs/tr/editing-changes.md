# Bir Değişikliği Düzenleme ve Yineleme

Bir değişiklikteki her eser, istediğiniz zaman düzenleyebileceğiniz bir Markdown dosyasıdır. Kilitlenmiş bir "planlama aşaması," bir onay kapısı veya girilmesi gereken özel bir düzenleme modu yoktur. Teklifi inşa etmeye başladıktan sonra değiştirmek mi istiyorsunuz? `proposal.md` dosyasını açın ve değiştirin. Tasarımın uygulamanın ortasında yanlış olduğunu fark ettiniz mi? `design.md` dosyasını düzeltin ve devam edin. Bütün cevap budur ve bu bilinçli bir tasarımdır.

Bu sayfa, "dur, geri dönüp bunu değiştirebilir miyim?" diye düşündüğünüz an içindir. Evet. İşte her yaygın durum için nasıl yapacağınız.

## Her şeyi düzenlemenin iki yolu

Her zaman ikisine de sahipsiniz:

1. **Dosyayı doğrudan düzenlemek.** Eserler `openspec/changes/<name>/` altında düz Markdown dosyalarıdır. Düzenleyicinizde `proposal.md`, `design.md`, `tasks.md` veya `specs/` altındaki bir delta spec dosyasını açın ve değiştirin. Başka hiçbir şeye ihtiyacınız yok.

2. **Yapay Zekadan (AI) revize etmesini istemek.** Sohbet üzerinden, ne istediğinizi söyleyin: "Önbellekleme fikrini çıkarmak ve bir hız sınırlama bölümü eklemek için teklifi güncelleyin," veya "tasarımın sorgulama yerine bir kuyruk kullanması gerekiyor." Yapay Zeka, değişikliğin geri kalanını bağlam olarak kullanarak eseri sizin için düzenler.

Anın hangisinin uygun olduğuna karar verin. Küçük bir kelime değişikliği mi? Dosyayı düzenleyin. Maddi bir düşünce revizyonu mu? Yapay Zekanın tam bağlamla revize etmesine izin verin.

## "Başladıktan sonra teklifi (veya spesifikasyonları) nasıl güncellerim?"

Güncelleyin. Aynı değişiklik, rafine edilmiş haliyle.

Genişletilmiş komutları kullanıyorsanız, doğal akış şudur: eseri düzenleyin, ardından yeni durumdan devam etmek için `/opsx:continue` veya güncellenmiş plana karşı uygulamaya devam etmek için `/opsx:apply` çalıştırın. Varsayılan `core` komutlarını kullanıyorsanız, eseri düzenleyin ve `/opsx:apply` çalıştırın; bu, mevcut dosyaları okur, bu nedenle eserlerin şu anda ne dediğine göre inşa eder.

Zihinsel model şudur: Eserler imzalı bir sözleşme değil, canlı plandır. Yapay Zeka her zaman onların mevcut içeriğinden çalıştığı için, onları düzenlemek işi yönlendirir.

```text
Siz: Bu değişiklikteki yaklaşımı değiştirmek istiyorum.

Siz: [design.md'yi düzenleyin veya yapay zekaya söyleyin:]
     Senkron bir çağrı yerine arka plan görevi kullanacak şekilde design.md'yi güncelleyin.

Yapay Zeka:  design.md güncellendi. Görev listesi hala uyuyor; uygulamaya devam etmemi ister misiniz?

Siz: /opsx:apply
```

Bu, çok yaygın bir soruyu yanıtlar: ayrı bir "teklifi güncelle" komutu yoktur çünkü buna ihtiyacınız yok. Dosya doğru kaynağıdır ve onu düzenlemek (elle veya yapay zeka aracılığıyla) güncellemeyi temsil eder.

## "Uyguladıktan sonra nasıl gözden geçiririm?"

"Geri dönmeniz" gerekmez, çünkü siz asla ayrılmadınız. İş akışı akışkandır: inceleme, düzenleme ve uygulama sizi hapsettiğiniz sıralı bir aşama değildir.

Somut olarak, bazı `/opsx:apply` çalışmaları yaptıktan sonra:

- Planı yeniden incelemek mi istiyorsunuz? Eserleri açın ve okuyun veya konsolunuzda toplu bir görünüm için `openspec show <change>` çalıştırın.
- Değiştirilmesi gereken bir şey buldunuz mu? Eseri düzenleyin (veya yapay zekadan isteyin), sonra devam edin.
- Kodun planla eşleştiğine dair yapılandırılmış bir kontrol mü istiyorsunuz? `/opsx:verify` çalıştırın (genişletilmiş komut). Hiçbir şeyi engellemeden tamamlama, doğruluk ve tutarlılığı raporlar. [Çalışma Akışları: Doğrulamak](workflows.md#verify-check-your-work) bölümüne bakın.

Geri dönülecek bir "inceleme aşaması" yoktur, çünkü inceleme, uygulama sonrasında bile herhangi bir zamanda yapabileceğiniz bir şeydir.

## "Kodu elle düzenledim. Bunu OpenSpec ile nasıl uyumlu hale getiririm?"

Bu sürekli olur ve sorun değil. Düzenleyicinizde bir şeyi ayarladınız ve şimdi kod ile eserler anlaşamıyor. Hangisi doğruysa o yöne doğru onları senkronize edin:

- **Kod artık doğru, spesifikasyon eskidi.** Gerçekte gönderdiğiniz davranışı tanımlamak için delta spec'i (ve ilgiliyse görevleri) güncelleyin. Arşivlemeden önce spesifikasyonun gerçeklikle eşleşmesi gerekir, çünkü arşivleme spesifikasyonu doğru kaynağa birleştirir.
- **Spesifikasyon doğru, kod kaydı.** Kod spesifikasyonla eşleşene kadar inşa etmeye veya düzeltmeye devam edin.

Uyuşmazlıkları hızlıca ortaya çıkarmanın bir yolu `/opsx:verify` kullanmaktır: eserlerinizi ve kodunuzu okur ve nerede ayrıldıklarını size söyler. Çıktısını, uyumlaştırma için yapılması gerekenler listesi olarak ele alın, sonra anlaştıklarında arşivleyin.

Prensip şudur: Arşivleme zamanında, spesifikasyonlarınız kayıtlı gerçeği temsil eder. Bu nedenle, arşivlemeden önce, spesifikasyonların kodun ne yaptığını dürüstane belirtmesini sağlayın. Manuel düzenlemeler memnuniyetle karşılanır; sadece onları sessizce spesifikasyondan uyumsuz hale getirmeyin.

## Memnun olmadığınız bir teklifi rafine etmek

Oluşturulan bir teklif beklentiyi karşılamazsa, üç iyi hareketiniz vardır:

- **Yerinde yineleme yapmak.** Yapay Zekaya neyin yanlış olduğunu söyleyin ("kapsam çok geniş, yönetici özelliklerini çıkar") ve revize etmesine izin verin. En ucuz ve genellikle doğru olanıdır.
- **Önce keşfetmek, sonra yeniden teklif vermek.** Sorun fikrin kendisinin belirsiz olmasıysa, `/opsx:explore` adımına geri dönün, derinlemesine düşünün ve daha keskin bir teklifin ortaya çıkmasına izin verin. [Önce Keşfet](explore.md) bölümüne bakın.
- **Sıfırdan başlamak.** Eğer niyet temelden değiştiyse, yeni bir değişiklik eski olanı yamalamaktan daha açık olabilir.

Bu son hareketinin kendi karar kılavuzu vardır, sonraki kısımda.

## Ne zaman güncelleme ne zaman yeni bir değişiklik başlatma

Kısa versiyon: **Aynı işin rafine edilmesi ise güncelleyin; niyet temelden değiştiyse veya kapsam farklı işlere yayıldıysa yeni bir tane başlatın.**

- Aynı amaç, daha iyi bir yaklaşım mı? Güncelleyin.
- Kapsam daraltma (şimdi MVP'yi gönderin, faz iki için sonra)? Güncelleyin, ardından arşivleyin ve ikinci aşama için yeni bir değişiklik yapın.
- Sorunun kendisi değişti mi ("koyu mod ekle" "tam bir temalandırma sistemi oluştur" haline geldi)? Yeni bir değişiklik.

Tam bir akış şeması ve çalışılmış örnekler [Çalışma Akışları: Ne Zaman Güncelleme Ne Zaman Sıfırdan Başlama](workflows.md#when-to-update-vs-start-fresh) bölümünde, daha derinlemesine bir inceleme ise [OPSX: Ne Zaman Güncelleme Ne Zaman Sıfırdan Başlama](opsx.md#when-to-update-vs-start-fresh) bölümündedir.

## Görevler hakkında bir not

`tasks.md`, dondurulmuş bir plan değil, yaşayan bir kontrol listesidir. Uygulama sırasında keşfettiğiniz görevleri ekleyebilir, gereksiz olduğunu anladıklarınızı kaldırabilir veya sıralarını değiştirebilirsiniz. Yapay Zeka, `/opsx:apply` sırasında bunları tamamladıkça işaretler ve daha sonra geri dönerseniz ilk işareti yapılmamış görevi kaldığı yerden devam ettirir. Ortada listeyi düzenlemek beklenendir.

## Nereye gitmeli

- [Çalışma Akışları](workflows.md) - desenler, ayrıca güncelleme vs yeni karar kılavuzu
- [Önce Keşfet](explore.md) - bir fikrin yeniden düşünülmesi gerektiğinde geri dönülecek yer
- [Komutlar](commands.md) - `/opsx:continue`, `/opsx:apply` ve `/opsx:verify` ayrıntılarıyla
- [Kavramlar: Eserler](concepts.md#artifacts) - her eserin amacı nedir