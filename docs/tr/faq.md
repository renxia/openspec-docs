# SSS (Sıkça Sorulan Sorular)

En çok sorulan sorulara hızlı yanıtlar. Eğer sorunuz gerçekten "bir şey bozuk" ise, [Sorun Giderme](troubleshooting.md) daha uygun bir sayfadır. Bir terimin tanımını istiyorsanız, [Glossary'e](glossary.md) bakın.

## Temel Bilgiler

### OpenSpec nedir, tek bir cümleyle?

Herhangi bir kod yazılmadan önce, sizin ve yapay zeka (AI) kodlama asistanınızın ne inşa edeceğine dair yazılı olarak anlaşmanızı sağlayan hafif bir katmandır.

### Bunu neden isteyebilirim?

Çünkü AI asistanları yanlış olsalar bile kendilerine güvenirler. Gereksinimler yalnızca bir sohbet dizisinde mevcut olduğunda, yapay zeka boşlukları tahminlerle doldurur ve siz kod var olduktan sonra bunu fark edersiniz. OpenSpec ise anlaşmayı daha erken aşamaya taşır; böylece hataları düzeltmek ucuzdur. Tüm detaylı bilgiyi [Genel Bakış](overview.md)'a bakarak öğrenebilirsiniz.

### Her şey için kullanmak zorunda mıyım?

Hayır. Anlaşmanın önemli olduğu yerlerde, yani çoğu sıradan olmayan işte kullanın. Bir karakterlik bir yazım hatasını düzeltmek için bu tören muhtemelen değmez ve bu sorun değil.

### Büyük mevcut bir kod tabanı üzerinde mi yoksa sadece yeni projelerde mi kullanabilirim?

Mevcut kod tabanları asıl odak noktasıdır. OpenSpec, *brownfield* (mevcut sistemler) öncelikli çalışır: tüm uygulamanızı baştan belgelemek zorunda değilsiniz. Sadece her değişikliğin dokunduğu şeyleri için spesifikasyon yazarsınız ve bu spesifikasyonlar zamanla yaptığınız işlerin etrafını doldurur. Bunun için özel bir rehber mevcuttur: [Mevcut Bir Projede OpenSpec Kullanımı](existing-projects.md).

### Tek bir AI aracına mı bağlı?

Hayır. OpenSpec, Claude Code, Cursor, Windsurf, GitHub Copilot, Gemini CLI, Codex ve daha fazlası dahil olmak üzere 25'ten fazla asistan ile çalışır. Tam liste ve araç bazlı detaylar [Desteklenen Araçlar](supported-tools.md)'da yer alır.

## Komutları Çalıştırma

### `/opsx:propose` komutunu nerede yazarım?

Terminalinizde değil, AI asistanınızın sohbet penceresinde. Bu en yaygın kafa karışıklığı noktasıdır, bu yüzden bunun için özel bir sayfa vardır: [Komutlar Nasıl Çalışır](how-commands-work.md). Kısa versiyonu şudur: `openspec ...` terminalde çalışır, `/opsx:...` ise sohbette çalışır.

### "Etkileşimli moda" nasıl girerim?

Başlatılacak ayrı bir mod yoktur. AI asistanınızı normal şekilde açın ve sohbetine bir eğik çizgi komutu (slash command) yazın. Eğik çizgi komutu, OpenSpec'e "giriş" yapma şeklinizdir. (Gerçekten etkileşimli terminal özelliği `openspec view`'dur; bu, spesifikasyonları ve değişiklikleri göz atmak için bir kontrol panelidir.) Tam açıklama [Komutlar Nasıl Çalışır](how-commands-work.md)'da yer alır.

### Bir eğik çizgi komutu yazdım ama hiçbir şey olmadı. Neden?

Büyük ihtimalle bunu AI sohbeti yerine terminalde yazdınız veya komutlar henüz kurulmadı. Projenizde `openspec update` çalıştırın, asistanınızı yeniden başlatın, ardından sohbete `/opsx` yazmayı deneyin ve otomatik tamamlama (autocomplete) özelliğini izleyin. [Sorun Giderme](troubleshooting.md#commands-dont-show-up), tam kontrol listesini içerir.

### Neden bir araçta sözdizimi `/opsx:propose` iken diğerinde `/opsx-propose`?

Her AI aracı özel komutları biraz farklı şekilde gösterir. Amaç aynıdır; sadece noktalama işaretleri değişir. Sohbetinize bir eğik çizgi yazın ve otomatik tamamlama, aracınızın beklediği biçimi size gösterecektir. Araç bazlı tablo [Komutlar Nasıl Çalışır](how-commands-work.md#slash-command-syntax-by-tool)'da yer alır.

### Bir beceri (skill) ile bir komut (command) arasındaki fark nedir?

Her ikisi de asistanınızın iş akışını çalıştırabilmesi için OpenSpec'in yazdığı dosyalardır. Beceriler (`.../skills/openspec-*/SKILL.md`), daha yeni, araçlar arası standarttır; komutlar (`.../commands/opsx-*`) ise eski, araç bazlı eğik çizgi dosyalarıdır. Birini seçmenize gerek yok. Eğik çizgi komutunu yazın ve OpenSpec, aracınızın hangisini kullandığını kurar.

## İş Akışı (Workflow)

### Ne inşa edeceğinizden emin değilseniz nereden başlamalıyım?

`/opsx:explore` ile. Bu, kod tabanınızı okuyan, seçenekleri sıralayan ve herhangi bir değişiklik veya kod var olmadan belirsiz bir sorunu somut bir plana dönüştüren, riski olmayan bir düşünme ortağıdır. Varsayılan profilde yer alır, bu yüzden her zaman mevcuttur. Plan netleştiğinde, `/opsx:propose`'a devredilir. Bu, en iyi alışkanlık haline getirilmesi gereken tek şeydir, çünkü hevesli bir AI'ın yanlış şeyi güvenle inşa etmesini engeller. [Önce Keşfet](explore.md)'e bakın.

### En basit olası akış nedir?

```text
/opsx:explore (isteğe bağlı)   sonra   /opsx:propose <ne istediğinizi>   sonra   /opsx:apply   sonra   /opsx:archive
```

Düşünmek için keşfet, planı taslak haline getirmek için teklif et, inşa etmek için uygula, dosyalamak için arşivle. Ne istediğinizi zaten biliyorsanız keşfetme adımını atlayın.

### `/opsx:propose` ile `/opsx:new` arasındaki fark nedir?

`/opsx:propose`, varsayılan tek adımlıktır: değişikliği oluşturur ve tüm planlama çıktılarını aynı anda taslak haline getirir. `/opsx:new`, genişletilmiş komut setinin bir parçasıdır ve yalnızca boş bir değişiklik iskeleti (scaffold) oluşturarak, sizi `/opsx:continue` ile (veya hepsini tek seferde `/opsx:ff` ile) çıktıları sırayla oluşturmaya bırakır. Adım adım kontrol istemiyorsanız propose kullanın. [Komutlar](commands.md)'a bakın.

### `core` ve genişletilmiş profiller nelerdir?

Bir profil hangi eğik çizgi komutlarının kurulacağını belirler. **Core** (varsayılan), size `propose`, `explore`, `apply`, `sync` ve `archive` verir. **Expanded** (genişletilmiş) set ise daha ince kontrol için `new`, `continue`, `ff`, `verify`, `bulk-archive` ve `onboard` ekler. `openspec config profile` ile değiştirin, ardından `openspec update` ile uygulayın.

### `/opsx:sync` çalıştırmam gerekiyor mu?

Genellikle gerekmez. Sync, bir değişikliğin delta (fark) spesifikasyonlarını ana spesifikasyonlara birleştirir ve `/opsx:archive` bunu sizin için yapmayı teklif edecektir. Sadece arşivlemeden önce spesifikasyonların birleşmesini istediğinizde, örneğin uzun süren bir değişiklikte manuel olarak sync çalıştırın. [Komutlar](commands.md#opsxsync)'a bakın.

### Bir öneriyi (proposal), spesifikasyonu veya görevi başlattıktan sonra nasıl düzenlerim?

Dosyayı düzenleyin. Her çıktı, `openspec/changes/<name>/` içindeki düz Markdown'dır ve kilitli bir aşama ya da özel bir düzenleme modu yoktur. El ile değiştirin veya AI'ınıza revize etmesini söyleyin ("tasarımı bir kuyruk kullanacak şekilde güncelle"), sonra devam edin. AI her zaman mevcut dosya içeriğinden çalışır. Tam rehber: [Bir Değişikliği Düzenlemek ve Yinelemek](editing-changes.md).

### Bir kısmını uyguladıktan sonra plana geri dönüp değiştirebilir miyim?

Evet, istediğiniz zaman. İş akışı akışkandır; bu nedenle inceleme ve düzenleme kilitli aşamalar değildir. Çıktıyı düzenleyin, sonra devam edin. Kodun hala planla eşleştiği yapılandırılmış bir kontrol istiyorsanız, `/opsx:verify` çalıştırın. [Bir Değişikliği Düzenlemek ve Yinelemek](editing-changes.md#how-do-i-go-back-to-review-after-implementing)'e bakın.

### Kodu elle düzenledim. Bunu spesifikasyonla nasıl uyumlu hale getiririm?

Arşivlemeden önce bunları senkronize edin, çünkü arşivleme sizin spesifikasyonlarınızı doğru kabulü (record of truth) yapar. Kod artık doğruysa, delta spesifikasyonunu gönderdiğiniz şeye uyması için güncelleyin; spesifikasyon doğruysa, kod razı olana kadar inşa etmeye devam edin. `/opsx:verify` uyumsuzlukları ortaya çıkarır. [Bir Değişikliği Düzenlemek ve Yinelemek](editing-changes.md#i-edited-the-code-by-hand-how-do-i-reconcile-that-with-openspec)'e bakın.

### Mevcut bir değişikliği ne zaman güncellerim, yeni bir tane başlatmalı mıyım?

Aynı işse ve rafine edilmişse güncelleyin. Niyet temelde değiştiyse veya kapsam farklı işlere dağıldıysa sıfırdan başlayın. [İş Akışları](workflows.md#when-to-update-vs-start-fresh)'da bir karar akış şeması ve örnekler bulunmaktadır.

### Oturumum bağlamdan çıkarsa veya gereksinimler uygulama sırasında değişirse ne yapmalıyım?

İşte spesifikasyonların değerini bulduğu yerdir. Çünkü plan dosyalarda (sadece sohbet geçmişinde değil) bulunur, bağlamınızı temizleyebilir, yeni bir AI oturumu başlatabilir ve `/opsx:apply` ile devam edebilirsiniz; bu, çıktıları okur ve ilk kontrol edilmemiş görevden devam eder. Gereksinimler değişirse, yeni gerçekliğe uyması için çıktıları düzenleyin ve devam edin. Temiz bir bağlam penceresi tutmak da daha iyi sonuçlar verir; uygulama öncesinde temizleyin.

### `openspec/` klasörünü git'e commit etmeli miyim?

Evet. Spesifikasyonlarınız, aktif değişiklikleriniz ve arşiviniz projenizin geçmişinin bir parçasıdır. Bunları diğer herhangi bir kaynak gibi commit edin. Özellikle arşiv, sisteminizin neden çalıştığını gösteren kalıcı bir kayıttır.

## Spesifikasyonlar ve Değişiklikler

### Bir spesifikasyonda (spec) ne konur, tasarımda (design) ne?

Bir spesifikasyon gözlemlenebilir davranışı tanımlar: sistemin ne yaptığı, girdileri, çıktıları ve hata koşulları. Bir tasarım ise bunu nasıl inşa edeceğinizi tanımlar: teknik yaklaşım, mimari kararlar, dosya değişiklikleri. Eğer uygulama, dışarıdan görünen davranış değişmeden değişebilirse, bu tasarımda değil, spesifikasyonda yer alır. [Kavramlar](concepts.md#what-a-spec-is-and-is-not) daha derine iner.

### Delta spesifikasyon nedir?

Tüm spesifikasyonu yeniden ifade etmek yerine yalnızca neyin değiştiğini tanımlayan, `ADDED` (EKLENDİ), `MODIFIED` (DEĞİŞTİRİLDİ) ve `REMOVED` (KALDIRILDI) bölümlerini kullanan bir spesifikasyondur. Bu, OpenSpec'in mevcut sistemlere düzenli bir şekilde yaptığı değişiklikleri yönetme biçimidir. [Kavramlar](concepts.md#delta-specs)'a bakın.

### Arşivlenmiş değişiklikler nereye gider?

Tüm çıktıların korunduğu `openspec/changes/archive/YYYY-MM-DD-<name>/` dizinine. Hiçbir şey silinmez; değişiklik sadece aktif listenizden çıkar.

## Yapılandırma ve Özelleştirme

### AI'a teknoloji yığınınız (tech stack) hakkında nasıl bilgi veririm?

Bunu `openspec/config.yaml` dosyasına `context:` altında koyun. Bu metin her planlama isteğine enjekte edilir, böylece AI daima yığınınızı ve geleneklerinizi bilir. [Özelleştirme](customization.md#project-configuration)'a bakın.

### İngilizce dışında bir dilde spesifikasyonlar üretebilir miyim?

Evet. Yapılandırmanıza (config) bir dil talimatı ekleyin. [Çok Dilli](multi-language.md), birkaç dil için kopyala-yapıştır parçaları içerir.

### İş akışını kendisi değiştirebilir miyim?

Evet, özel şemalarla. Bir şema hangi çıktıların var olduğunu ve bunların birbirine nasıl bağlı olduğunu tanımlar. `openspec schema fork spec-driven my-workflow` ile varsayılanı çatallayın, sonra düzenleyin. [Özelleştirme](customization.md#custom-schemas)'a bakın.

## Modeller, Gizlilik ve Güncellemeler

### Hangi AI modelini kullanmalıyım?

OpenSpec, yüksek muhakeme yeteneğine sahip modellerle en iyi şekilde çalışır. README, hem planlama hem de uygulama için Codex 5.5 ve Opus 4.7 gibi modelleri önermektedir. Ayrıca bağlam pencerenizi temiz tutun: en iyi sonuçlar için uygulama öncesinde temizleyin.

### OpenSpec veri topluyor mu?

Anonim kullanım istatistikleri toplar: sadece komut adları ve sürüm. Hiçbir argüman, yol, içerik veya kişisel veri toplanmaz ve CI'da otomatik olarak kapatılmıştır. `export OPENSPEC_TELEMETRY=0` veya `export DO_NOT_TRACK=1` ile çıkış yapın.

### Nasıl yükseltirim?

İki adım. Paketi yükseltin (`npm install -g @fission-ai/openspec@latest`), ardından oluşturulan becerileri ve komutları yenilemek için her projede `openspec update` çalıştırın.

### OpenSpec'i nasıl kaldırırım?

Kaldırma komutu yoktur, çünkü bu sadece küresel bir pakettir ve projenizde dosyalardır. Paketi kaldırın (`npm uninstall -g @fission-ai/openspec`), isteğe bağlı olarak `openspec/` dizinini ve oluşturulan araç dosyalarını silin. Neyin tutulmasının güvenli olduğu dahil olmak üzere adım adım rehber [Kurulum: Kaldırma](installation.md#uninstalling)'da yer alır.

## Yardım Alma

### Soruları nerede sorarım veya hataları bildiririm?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Sorunları:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Terminalinizden:** `openspec feedback "mesajınız"` sizin için bir GitHub sorunu açar.

### Bu belgeler yanlış veya kafa karıştırıcı. Ne yapmalıyım?

Bize söyleyin veya düzeltin. Dokümantasyon PR'ları (pull request) memnuniyetle karşılanır ve değerlidir. Bir sorun açın veya bir çekme isteği (pull request) gönderin.