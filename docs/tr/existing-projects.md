# Mevcut Bir Projede OpenSpec Kullanımı

Tüm kod tabanınızı belgelemek zorunda değilsiniz. Sadece değiştireceğiniz şeyler için spesifikasyonlar yazarsınız. Bu, mevcut bir projede OpenSpec benimsemenin bilmeniz gereken en önemli tek şeydir ve OpenSpec'in neden "brownfield" (mevcut altyapı üzerine inşa) olarak tasarlandığını açıklar.

Yaygın bir endişe şöyle seslenir: "Uygulamam 80.000 satır eski. OpenSpec kullanışlı hale gelmeden önce bunların hepsine spesifikasyon yazmalı mıyım?" Hayır. Siz de, biz de bundan nefret ederdik. OpenSpec, spesifikasyonlarınızı bir seferde bir değişiklik yaparak büyütür. İlk değişikliğiniz dokunduğu parçayı belgeler, sonraki değişiklik o parçasını belgeler ve aylar içinde spesifikasyonlarınız gerçekte yaptığınız işler etrafında doğal olarak dolup taşar.

Bu rehber, "okyanusu kaynatmadan" (yani her şeyi bir kerede halletmeye çalışmadan) ilk günden nasıl başlayacağınızı gösterir.

## Otuz Saniyelik Versiyon

```bash
$ cd your-existing-project
$ openspec init          # openspec/ klasörünü ve yapay zeka aracınızın komutlarını ekler
```

Ardından, yapay zeka sohbetinizde:

```text
/opsx:explore            # isteğe bağlı: yapay zekanın dokunacağınız alanı okumasını sağlayın
/opsx:propose <gerçek, küçük bir değişiklik ihtiyacınız olan>
/opsx:apply
/opsx:archive
```

Spesifikasyonlarınız artık değişikliğin dokunduğu sistem parçasını ve fazlasını hiçbir şeyi tanımlar. Bu doğru. Diğer 80.000 satır hakkında endişelenmeyi bırakmışsınız demektir.

## Neden Delta-First (Değişim Odaklı) Tüm Sırrı

OpenSpec değişiklikleri **deltalar** olarak yazılır: `ADDED` (EKLENDİ), `MODIFIED` (DEĞİŞTİRİLDİ), `REMOVED` (KALDIRILDI). Bir delta, tüm sistemi değil, mevcut davranışa göre neyin değiştiğini tanımlar.

Bu tam olarak "brownfield" işlerin ihtiyacı olan şeydir. Nadiren sıfırdan inşa ediyorsunuz. Bir alan ekliyorsunuz, bir yönlendirmeyi düzeltiyorsunuz, bir zaman aşımını sıkılaştırıyorsunuz. Bir delta, önce etrafındaki her şeyi kapsayan 40 sayfalık bir spesifikasyon yazmadan o tek değişikliği hassas bir şekilde belirtmenizi sağlar.

Bu nedenle `openspec/specs/` dizininiz dolu ve eksiksiz başlamaz. Neredeyse boş başlar ve birikir. Arşivlenen her değişiklik, kendi delta'sını birleştirir. `auth/` için olan spesifikasyon, ancak birkaç auth değişikliği yaptıktan sonra kapsamlı hale gelir; ki bu da tam olarak istediğiniz zamandır.

Daha derin mekanikleri öğrenmek isterseniz, [Concepts: Delta Specs](concepts.md#delta-specs) sayfasına bakın.

## Gerçek Bir Kod Tabanı Üzerindeki İlk Değişikliğiniz

Küçük ve gerçek bir şey seçin. Oyuncak değil, yeniden yazım değil. Zaten bu hafta yapmayı düşündüğünüz bir değişiklik. Küçük ilk değişiklikler, düşük riskle iş akışını öğrenmenizi sağlar.

**Adım 1: Yapay Zekanın İlgili Alanı Okumasına İzin Verin.** İşte `/opsx:explore`'un alışılmadık veya büyük bir kod tabanında neden değerli olduğunu gösterdiği yer burasıdır. Dokunmaya hazırlandığınız parçaya işaret edin ve herhangi bir şey önermeden önce nasıl çalıştığını haritalamasını sağlayın.

```text
Siz: /opsx:explore

Yapay Zeka: Ne keşfetmek istersiniz?

Siz: Genel API'mıza hız sınırlama eklemem gerekiyor, ancak isteklerin şu anda middleware üzerinden nasıl aktığı konusunda emin değilim.

Yapay Zeka: İzleyeyim... [router'ı, middleware yığınını ve yapılandırmayı okuyor]
İstekler Express'e ulaşıyor, auth middleware'i üzerinden geçiyor, ardından kontrolcülerinize gidiyorlar. Şu anda bir hız sınırlama katmanı yok. En temiz ekleme noktası, auth'tan hemen sonra gelen bir middleware'dir. Bunu kapsamamı ister misiniz?
```

Yapay Zekanın artık gerçek yapınızı anladığını fark edin; bu nedenle yazacağı öneri genel bir şablon değil, sizin kodunuza uyacaktır. Büyük bir kod tabanında bu tek alışkanlık en çok acıyı kurtarır. [Explore First](explore.md) sayfasına bakın.

**Adım 2: Değişikliği Önerin.** Öneri ve delta spesifikasyonu sadece bu değişikliği yakalar.

```text
Siz: /opsx:propose add-api-rate-limiting
```

**Adım 3: `/opsx:apply` ve `/opsx:archive` ile oluşturun ve arşivleyin**, tıpkı herhangi bir değişiklik gibi. Arşivledikten sonra, zaten yapmanız gereken bir değişiklikten doğmuş olan hız sınırlama davranışınız için gerçek bir spesifikasyonunuz olur.

## Rehberli Bir Tur Tercih Ediyor musunuz? onboard Kullanın

Eğer tüm döngünün kendi kodunuz üzerinde anlatımla gerçekleşmesini izlemeyi tercih ediyorsanız, genişletilmiş `/opsx:onboard` komutu tam olarak bunu yapar: küçük, güvenli bir iyileştirme için kod tabanınızı tarar, ardından önererek, oluşturarak ve arşivleyerek sizi yönlendirir ve her adımı açıklar.

Önce genişletilmiş komutları etkinleştirin:

```bash
$ openspec config profile      # genişletilmiş iş akışlarını seçer
$ openspec update              # bunları projeye uygular
```

Ardından sohbette:

```text
/opsx:onboard
```

Bu, gerçek bir proje üzerinde mümkün olan en nazik tanıtımdır ve size tutabileceğiniz veya atabileceğiniz gerçek (küçük) bir değişiklik bırakır. [Commands: `/opsx:onboard`](commands.md#opsxonboard) sayfasına bakın.

## "Ama zaten gereksinim dokümanlarım var"

Belki bir PRD, bir SRS, resmi bir spesifikasyonunuz ya da TLA+ modelleriniz vardır. İyi. Onları bütün olarak içe aktarmazsınız ve onları çöpe de atmazsınız.

Mevcut belgeleri **dönüştürülecek spesifikalar değil, keşif için kaynak materyal** olarak ele alın. Bir değişiklik başlattığınızda, ilgili bölüme yapıştırın veya yapay zekayı oraya yönlendirin ve ondan odaklanmış bir OpenSpec delta'sı oluşturmasını sağlayın. Delta, şu anda değiştirdiğiniz davranışı, OpenSpec'in test edilebilir gereksinim ve senaryo biçiminde yakalar. Orijinal belgeler arka plan olarak kaldıkları yerde kalır.

Dürüst nedeni: OpenSpec spesifikasyonları kasıtlı olarak davranış odaklıdır ve değişikliklere göre kapsamlandırılmıştır. 40 sayfalık bir PRD, farklı bir işlevi olan farklı bir eserdir. Tek seferlik toplu dönüşüm zorlamak genellikle kimsenin güvenmediği büyük, bayatlamış bir spesifikasyon üretir. Spesifikaların gerçek değişikliklerden büyütülmesine izin vermek onları doğru tutar.

```text
Siz: /opsx:explore
Siz: İşte ödeme (checkout) ile ilgili PRD'mizin bölümü. "Misafir olarak ödeme" gereksinimini uyguluyorum.
[ilgili gereksinimi yapıştırın]
Yapay Zeka: [okuyor, açıklayıcı sorular soruyor, ardından bir değişiklik kapsamasına yardımcı oluyor]
Siz: /opsx:propose add-guest-checkout
```

## Büyük Bir Kod Tabanında Spesifikaları Düzenleme

Spesifikalar `openspec/specs/` altında, **alan (domain)** bazında gruplanır; bu da ekibinizin sistemi düşündüğü mantıksal bir alandır. Tüm taksonomiyi baştan tasarlamak zorunda değilsiniz. O alandaki ilk değişikliğiniz gerektirdiğinde bir alan klasörü oluşturun.

Alanları bölmenin yaygın yolları:

- **Özellik alanı (Feature area) bazında:** `auth/`, `payments/`, `search/`
- **Bileşen (Component) bazında:** `api/`, `frontend/`, `workers/`
- **Sınırlı bağlam (Bounded context) bazında:** `ordering/`, `fulfillment/`, `inventory/`

Yeni gelen birinin başını sallamasını sağlayacak olanı seçin. Daha sonra iyileştirebilirsiniz. [Concepts: Specs](concepts.md#specs) sayfasına bakın.

## Monorepo'lar ve Birden Fazla Depoyu Kapsayan İşler

Bir monorepo için en basit model, depo kökünde bir `openspec/` dizini olmasıdır; bu dizin alanları paketlerinize veya hizmetlerinize karşılık gelir. Bu çoğu ekibi kapsar.

Eğer işiniz gerçekten **birden fazla depoyu** (veya ayrı olarak ele aldığınız birkaç paketi) kapsıyorsa, OpenSpec'te beta bir **stores** (depolar) özelliği bulunmaktadır: planlama, herhangi bir kod deposunun referans verebileceği kendi bağımsız deposunda yaşar, böylece plan tek bir deponun `openspec/` klasöründe yaşamaya zorunda kalmaz. Bu beta aşamasındadır, bu nedenle komutlarını ve durumunu gelişmekte olan olarak ele alın. Zihinsel model ve en küçük kullanışlı yol için [Stores User Guide](stores-beta/user-guide.md) ile başlayın.

## Birkaç Dürüst Uyarı

- **Her şeyi geri doldurma dürtüsüne direnin.** Değiştirmediğiniz kod için spesifikasyon yazmak üretken hissettirir ve genellikle öyle değildir. Bu spesifikalar bayatlar, çünkü onları gerçeklikle takip etmeye zorlayan hiçbir şey yoktur. Gerçek değişikliklerin spesifikaları yönlendirmasına izin verin.
- **Erkenki değişiklikleri küçük tutun.** İlk birkaç değişikliğiniz, teslim etmek kadar ritmi öğrenmekle de ilgilidir. Dar bir kapsam, döngüyü hızlı ve dersleri ucuz yapar.
- **`openspec/` klasörünü git'e commit edin.** Spesifikasyonlarınız ve arşiviniz, tanımladıkları koduyla birlikte sürüm kontrolünde olmalıdır.
- **Yapay Zekaya bağlam sağlayın.** Güçlü kuralları olan büyük bir kod tabanında, her önerinin yığınınızı ve kalıplarınızı saygı duyması için `openspec/config.yaml` dosyasındaki `context:` alanını doldurun. [Customization](customization.md#project-configuration) sayfasına bakın.

## Nereye Gidebilirsiniz?

- [Explore First](explore.md) - Değiştirmeden önce kodu anlamanın ana alışkanlığı
- [Getting Started](getting-started.md) - Tam ilk değişiklik rehberi
- [Editing & Iterating on a Change](editing-changes.md) - Öğrenirken bir değişikliği ayarlama
- [Concepts: Delta Specs](concepts.md#delta-specs) - Deltaların "brownfield" işleri neden temiz hale getirdiğini açıklıyor
- [Customization](customization.md) - OpenSpec'e projenizin kurallarını öğretin