# İyi Spec'ler Yazmak

Nadiren de olsa bir spec'i boş bir sayfadan yazarsınız. Bir değişikliği basit bir dille açıklarsınız, `/opsx:propose` gereksinimleri ve senaryoları taslak olarak oluşturur, ardından bunları iyi hale getirirsiniz. Bu sayfa son adımı ele alır — "iyi"nin neye benzediği ve yapay zekayı bunu yapmaya nasıl yönlendireceğiniz.

Bu, [Değişikliği İnceleme](reviewing-changes.md) sayfasının eşlikçisidir: inceleme, taslaktaki zayıf noktaları yakalamaktır, yazma ise güçlü bir spec'in neyden oluştuğunu bilmektir.

## Bir spec, kod değil davranıştır

Bir spec, sisteminizin *ne yaptığını*, herkesin kontrol edebileceği şekilde ifade eder — nasıl inşa edildiğini değil. **Gereksinimler** (davranış ifadeleri) ve **senaryolar** (bunları kanıtlayan somut örnekler) şeklinde oluşur.

```markdown
### Requirement: Session Timeout
The system SHALL expire a session after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass with no activity
- THEN the session is invalidated and the user must re-authenticate
```

*Nasıl* kısmını — kuyruk, kütüphane, tablo şeması — `design.md` dosyasında veya kodda tutun. Davranış ve uygulama tek bir gereksinimde karıştırıldığında, gereksinim test edilebilir olmaktan çıkar ve kod değiştiği anda eskimeye başlar.

## İyi bir gereksinimi ne oluşturur?

İyi bir gereksinim, test etmesi için başka birine verebileceğiniz kadar açık bir dille ifade edilmiş tek bir davranıştır.

- **Tek ifade, tek `SHALL`/`MUST`.** Bir gereksinimde üç tane "ve ayrıca" yan cümlesi varsa, aslında üç farklı gereksinimdir. Bunları ayırın.
- **Gözlemlenebilir.** Kodun dışındaki birinin bu gereksinimin sağlanıp sağlanmadığını anlayabilmesi gerekir. "Sistem, yükleme 10 MB'ı aştığında bir hata bandı gösterecektir" ifadesi gözlemlenebilirdir. "Sistem, büyük yüklemeleri zarif bir şekilde işleyecektir" ifadesi değildir.
- **Doğru güçlük.** OpenSpec, RFC 2119 anahtar kelimelerini kullanır ve bunların farklı anlamları vardır:

  | Anahtar Kelime | Anlamı |
  |---------------|--------|
  | `MUST` / `SHALL` | Sert bir gereksinim. Pazarlık payı yoktur. |
  | `SHOULD` | Gerekçelendirilebilir istisnalara yer veren güçlü bir öneridir. |
  | `MAY` | Tamamen isteğe bağlıdır. |

  Varsayılan olarak `MUST`/`SHALL` kullanın. `SHOULD` kelimesini sadece "iyi bir neden olmadıkça" gerçekten kastettiğiniz durumlarda kullanın.

Bir gereksinim için test: *hiç kod görmemiş bir testçi, bu gereksinimin sağlanıp sağlanmadığını anlayabilir mi?* Anlayamıyorsa, gereksinim keskinleştirilmelidir.

## İyi bir senaryoyu ne oluşturur?

Senaryolar, bir gereksinimin değerini kanıtladığı yerlerdir. Her biri, otomatik bir teste dönüştürülebilecek somut bir GIVEN / WHEN / THEN yapısıdır.

- **Gereksinimi karşılar.** Gereksinimi sadece başka kelimelerle tekrar eden bir senaryo hiçbir şey test etmez. Onu belirli bir durum ve belirli bir sonuç haline getirin.
- **Önemli olan durumları kapsayın, sadece mutlu sonlu yolu değil.** Geçerli giriş yapmak kolaydır. Boş giriş, süresi dolmuş token, ikinci tıklama, yanlış giden şey — bunlar hataların yaşadığı ve bir senaryonun en çok değer taşıdığı yerlerdir.
- **Başlıkta durumu adlandırın.** "Senaryo: Süresi dolmuş token'ı reddeder" ifadesi, bir gözden geçiren kısaca neyin kapsandığını anlatır; "Senaryo: Test 2" ifadesi anlatmaz.

Yararlı bir alışkanlık: onaylamadan önce, *kırılmış halini görmekten en çok üzüleceğim tek durum nedir?* diye sorun — ve bir senaryonun bunu adlandırdığından emin olun.

## Doğru türde delta seçin

Bir değişiklik, spec'lere yaptığı düzenlemeleri üç bölüm türüyle açıklar. Doğru olanı kullanmak, arşivlenmiş spec'lerinizin doğru kalmasını sağlar:

- **`## ADDED Requirements`** — daha önce mevcut olmayan yeni davranış.
- **`## MODIFIED Requirements`** — daha önce mevcut olan ve değiştirilen davranış. Yeni sürümün tamamını ekleyin; neyin değiştiğine dair kısa bir not, gözden geçiren için yardımcı olur.
- **`## REMOVED Requirements`** — kaldırılan davranış, nedenini belirten bir satır ekleyin.

Arşivleme sırasında ADDED, ana spec'e eklenir, MODIFIED eski sürümün yerini alır ve REMOVED silinir. Gerçek bir değişikliği ADDED olarak işaretlerseniz, iki adet birbirine rakip gereksinimle sonuçlanırsınız; yeni davranışı MODIFIED olarak tanımlarsanız, yerini alacak hiçbir şey olmaz. Şüphe durumunda, mevcut spec'i açın ve gereksinimin zaten orada olup olmadığını kontrol edin.

## Değişikliği doğru boyutlandırın

En yaygın yazım hatası, kötü ifade edilmiş bir gereksinim değildir — üç değişikliğe birden çalışan bir değişikliktir.

**İyi bir değişiklik, tek bir cümleyle ifade edebileceğiniz tek bir amaca sahiptir.** "Karanlık mod düğmesi ekle." "Giriş uç noktasını hız sınırlandır." "Oturumları çerezlerden taşı." Değişikliği açıklamak için çok fazla "ve ayrıca" kullanmanız gerekiyorsa, bunu ayırmanız gerektiğine dair bir işarettir.

Bir değişikliğin çok büyük olduğuna dair işaretler:
- Teklifin kapsamı, ilişkisiz özelliklerin bir listesi gibi okunuyor.
- Gözden geçirmek bir öğleden sonra alır, bu yüzden kimse yapmaz.
- İki kişi çakışma olmadan üzerinde çalışamaz.
- Görevlerin yarısı tek başına yayınlanabilir.

Daha küçük değişiklikler, gözden geçirmesi daha kolay, tek bir odaklanmış oturumda inşa etmesi daha kolay ve altı ay sonra arşivin tek kalıntısı olduğunda üzerinde düşünmesi daha kolaydır. İstediğiniz zaman birkaç değişikliği paralel olarak çalıştırabilirsiniz — bkz. [Düzenleme ve İterasyon](editing-changes.md) ve [İş Akışları](workflows.md).

Tersine de olabilir: tek satırlık bir yazım hatası düzeltmesi için üç gereksinim ve bir tasarım dokümanına ihtiyaç yoktur. Çabanın seviyesini risk seviyesiyle eşleştirin.

## Yapay zekayı iyi bir taslak üretmeye nasıl yönlendirirsiniz?

`/opsx:propose` ilk taslağı oluşturduğu için, geri aldığınız sonucun kalitesi, verdiğiniz girdinin kalitesiyle doğru orantılıdır. Gereksinimleri elle yazmanız gerekmez — yapay zekayı doğru şekilde yönlendirmeniz gerekir:

- **Amaç ve sınırı belirtin.** *"İlk yüklemede işletim sistemi ayarını takip eden bir karanlık mod düğmesi ekle — mevcut tema API'sine dokunma."* Kapsam dışı kısım, kapsam içi kısım kadar önemlidir.
- **Önemini gördüğünüz durumları adlandırın.** *"Zaten temayı elle seçmiş bir kullanıcı için bir senaryo olduğundan emin ol."* Yapay zeka, sizin işaret ettiğiniz şeyleri kapsar.
- **Ardından düzenleyin.** Düz Markdown'dır. Belirsiz bir `SHALL`'ı keskinleştirin, hiçbir şey test etmeyen bir senaryoyu silin, kaçırdığı durumu ekleyin — ya da yapay zekadan istemek için: *"zaman aşımı gereksinimi belirsiz, 30 dakikaya sabitle."*

Taslak oluşturun, keskinleştirin, tekrarlayın. Bunun birkaç turu, güvendiğiniz bir spec üretir, ki bu da tüm amacın ta kendisidir.

## Hızlı bir kontrol listesi

- [ ] Her gereksinim, `SHALL`/`MUST` içeren tek bir gözlemlenebilir davranıştır.
- [ ] Gereksinimlere hiçbir uygulama detayı gömülmemiştir.
- [ ] Her gereksinimin, onu gerçekten karşılayan en az bir senaryosu vardır.
- [ ] Önemli kenar ve hata durumları için senaryolar vardır, sadece mutlu sonlu yol için değil.
- [ ] Deltalar, mevcut spec'e göre ADDED / MODIFIED / REMOVED'u doğru kullanır.
- [ ] Tüm değişikliğin, tek bir cümleyle ifade edebileceğiniz tek bir amacı vardır.

## Sonra nereye gidebilirsiniz?

- [Değişikliği İnceleme](reviewing-changes.md) — kaçan şeyleri yakalayan iki dakikalık geçiş.
- [Kavramlar](concepts.md) — spec'ler, değişiklikler ve deltaların arkasındaki daha derin model.
- [Örnekler ve Tarifler](examples.md) — baştan sona gerçek değişiklikler.