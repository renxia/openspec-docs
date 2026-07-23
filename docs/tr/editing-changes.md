# Değişiklik Üzerinde Düzenleme ve Yineleme

**Bir değişiklikteki her yapıt, istediğiniz zaman düzenleyebileceğiniz basit bir Markdown dosyasıdır.** Kilidi açılmamış bir "planlama aşaması" yok, onay kapısı yok, girmeniz gereken özel bir düzenleme modu da yok. Yapımına başladıktan sonra teklifi değiştirmek mi istiyorsunuz? `proposal.md` dosyasını açın ve değiştirin. Uygulama ortasında tasarımın yanlış olduğunu fark ettiniz mi? `design.md` dosyasını düzeltin ve devam edin. Cevap tam olarak bu, ve bu da tasarımın bir parçası.

Bu sayfa, "dur, bunu geri gidip değiştirebilir miyim?" diye düşündüğünüz anlar içindir. Evet, yapabilirsiniz. İşte her yaygın durum için nasıl yapacağınız.

## Her şeyi düzenlemenin iki yolu

Her zaman her ikisine de sahipsiniz:

1. **Dosyayı doğrudan düzenleyin.** Yapıtlar, `openspec/changes/<name>/` dizinindeki düz Markdown dosyalarıdır. `proposal.md`, `design.md`, `tasks.md` veya `specs/` altındaki bir delta spec'ı düzenleyicinizde açın ve değiştirin. Başka bir şey gerekmez.

2. **Yapay zekanızı yeniden düzenlemesi için isteyin.** Sohbette sadece istediğiniz şeyi söyleyin: "Teklife önbelleğe alma fikrini çıkarıp bir hız sınırlama bölümü ekle," veya "tasarlamada kuyruk kullanılmalı, yoksa yoklama yapılmamalı." Yapay zeka, değişikliğin geri kalanını bağlam olarak kullanarak yapıtı sizin için düzenler.

Hangi yöntemin o an için uygun olduğunu seçin. Küçük bir kelime düzeltmesi mi? Dosyayı düzenleyin. Önemli bir yeniden düşünme mi? Yapay zekanın tam bağlamla yeniden düzenlemesine izin verin.

## "Başladıktan sonra teklifi (veya spec'ları) nasıl güncellerim?"

Sadece güncelleyin. Aynı değişiklik, daha iyi hale getirilmiş hali.

Genişletilmiş komutları kullanıyorsanız, doğal akış şudur: yapıtı düzenleyin, ardından yeni durumdan devam etmek için `/opsx:continue` komutunu çalıştırın veya güncellenmiş plana göre uygulamaya devam etmek için `/opsx:apply` komutunu çalıştırın. Varsayılan `core` komutlarını kullanıyorsanız, yapıtı düzenleyin ve `/opsx:apply` komutunu çalıştırın; komut mevcut dosyaları okur, bu nedenle yapıtların şu anda ne içerdiğine göre çalışır.

Zihinsel model: yapıtlar canlı bir plandır, imzalı bir sözleşme değildir. Yapay zeka her zaman mevcut içeriklerinden çalışır, bu nedenle yapıtları düzenlemek çalışmayı yönlendirir.

```text
Siz: Bu değişiklikteki yaklaşımı değiştirmek istiyorum.

Siz: [design.md dosyasını düzenleyin, veya yapay zekaya şunu söyleyin:]
     design.md dosyasını senkron bir çağrı yerine arka plan işi kullanacak şekilde güncelle.

Yapay zeka: design.md güncellendi. Görev listesi hala uyuyor; uygulamaya devam etmemi ister misiniz?

Siz: /opsx:apply
```

Bu, çok yaygın bir soruyu cevaplar: ayrı bir "teklif güncelle" komutuna gerek yoktur, çünkü buna ihtiyacınız yoktur. Dosya doğrunun kaynağıdır, ve onu (elle veya yapay zeka aracılığıyla) düzenlemek güncelleme işlemidir.

## "Uygulamadan sonra geri dönüp inceleme yapmak istersem ne yapmalıyım?"

Geri dönmenize gerek yok, çünkü hiç ayrılmadınız bile. İş akışı akışkandır: inceleme, düzenleme ve uygulama, sıkıldığınız sıralı aşamalar değildir.

Somut olarak, birkaç `/opsx:apply` işleminden sonra:

- Planı tekrar gözden geçirmek mi istiyorsunuz? Yapıtları açın ve okuyun, veya birleştirilmiş bir görünüm için terminalinizde `openspec show <change>` komutunu çalıştırın.
- Değiştirilecek bir şey mi buldunuz? Yapıtı düzenleyin (veya yapay zekadan düzenlemesini isteyin), ardından devam edin.
- Kodun planla eşleşip eşleşmediğini yapılandırılmış bir şekilde kontrol etmek mi istiyorsunuz? `/opsx:verify` (genişletilmiş komut) komutunu çalıştırın. Komut, hiçbir şeyi engellemeden tamlık, doğruluk ve tutarlılık durumunu raporlar. Bkz. [İş Akışları: Doğrulama](workflows.md#verify-check-your-work).

Dönülecek bir "inceleme aşaması" yoktur, çünkü inceleme, uygulama sonrası da dahil olmak üzere herhangi bir anda yapabileceğiniz bir şeydir.

## "Kodu elle düzenledim. Bunu OpenSpec ile nasıl eşitlerim?"

Bu durum sürekli olur ve sorun değildir. Düzenleyicinizde bir şeyler değiştirdiniz, ve şimdi kod ile yapıtlar uyuşmuyor. Bunları doğru olan yönde tekrar eşit hale getirin:

- **Kod artık doğru, spec ise güncel değil.** Gerçekten teslim ettiğiniz davranışı tanımlamak için delta spec'ı (ve ilgiliyse görevleri) güncelleyin. Arşivleme yapmadan önce spec'ın gerçeklikle eşleşmesi gerekir, çünkü arşivleme spec'ı doğrunun kaynağına birleştirir.
- **Spec doğru, kod ise kaymış durumda.** Kodun spec ile eşleşmesi için inşa etmeye veya düzeltmeye devam edin.

Uyuşmazlıkları hızlıca ortaya çıkarmanın hızlı bir yolu `/opsx:verify` komutudur: komut yapıtlarınızı ve kodunuzu okur, hangi konularda ayrıldığınızı size söyler. Çıktısını uzlaştırma işleri için bir yapılacaklar listesi olarak kabul edin, ardından her iki taraf da anlaştığında arşivleyin.

İlke: arşivleme zamanında spec'larınız kayıtların doğrusu haline gelir. Bu nedenle arşivlemeden önce, spec'ların kodun ne yaptığı konusunda dürüst olmasını sağlayın. Manuel düzenlemeler memnuniyetle karşılanır; sadece bunların spec'ı sessizce desenkronize etmesine izin vermeyin.

## İçinden hoşlanmadığınız bir teklifi iyileştirme

Oluşturulan bir teklif hedefi kaçırırsa, yapabileceğiniz üç iyi hamle vardır:

- **Yerinde yineleyin.** Yapay zekaya neyin yanlış olduğunu söyleyin ("kapsam çok geniş, yönetici özelliklerini çıkar") ve yeniden düzenlemesine izin verin. En ucuz ve genellikle doğru olan yöntem budur.
- **Önce keşfedin, sonra yeniden teklif verin.** Sorun fikrinin kendisinin belirsiz olması ise, `/opsx:explore` komutuna geri çekilin, düşünün ve bundan daha net bir teklif çıkmasına izin verin. Bkz. [Önce Keşfedin](explore.md).
- **Sıfırdan başlayın.** Eğer niyet temel olarak değiştiyse, eski olanı yamak yerine yeni bir değişiklik daha net olabilir.

Son hamlenin kendi karar rehberi bir sonraki bölümdedir.

## Ne zaman güncelleme yapmalı, ne zaman yeni bir değişiklik başlatmalıyım

Kısa versiyon: **Aynı iş daha iyi hale getirildiğinde güncelleyin; niyet temel olarak değiştiğinde veya kapsam farklı işlere patladığında yeni bir değişiklik başlatın.**

- Aynı hedef, daha iyi yaklaşım? Güncelle.
- Kapsam daralması (MVP'yi şimdi teslim et, gerisini sonra)? Güncelle, ardından arşivle, sonra ikinci aşama için yeni bir değişiklik başlat.
- Sorunun kendisi değişti ("karanlık mod ekle" "tam bir tema sistemi inşa et" oldu)? Yeni değişiklik.

Tam bir akış şeması ve çalışılmış örnekler için [İş Akışları: Ne Zaman Güncellemeli Ne Zaman Sıfırdan Başlamalı](workflows.md#when-to-update-vs-start-fresh) ve daha detaylı açıklama için [OPSX: Ne Zaman Güncellemeli Ne Zaman Sıfırdan Başlamalı](opsx.md#when-to-update-vs-start-fresh) bağlantılarına bakabilirsiniz.

## Görevler hakkında bir not

`tasks.md` donan bir kontrol listesidir, donmuş bir plan değildir. Uygulama yaparken, keşfettiğiniz görevleri ekleyebilir, gerekli olmadığı ortaya çıkanları kaldırabilir veya sıralarını değiştirebilirsiniz. Yapay zeka, `/opsx:apply` sırasında tamamladığı öğeleri işaretler, ve daha sonra geri dönerseniz işaretlenmemiş ilk görevden devam eder. Uçuş ortasında listeyi düzenlemek beklenen bir durumdur.

## Sonra nereye gidebilirsiniz

- [İş Akışları](workflows.md) - kalıplar, artı güncelleme-yeni değişiklik karar rehberi
- [Değişikliği İnceleme](reviewing-changes.md) - yapımadan önce bir plan üzerinde iki dakikalık hızlı geçiş
- [Önce Keşfedin](explore.md) - bir fikrin yeniden düşünülmesi gerektiğinde geri çekileceğiniz yer
- [Komutlar](commands.md) - `/opsx:continue`, `/opsx:apply` ve `/opsx:verify` komutlarının detaylı açıklaması
- [Kavramlar: Yapıtlar](concepts.md#artifacts) - her yapıtın ne işe yaradığı