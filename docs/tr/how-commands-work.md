# Komutlar Nasıl Çalışır

**Bilmeniz gereken tek şey: OpenSpec'ın iki tür komutu var ve bunlar iki farklı yerde çalışıyor.**

- `openspec ...` komutları **terminalinizde** çalışır. (Örnek: `openspec init`.)
- `/opsx:...` komutları **AI asistanınızın sohbetinde** çalışır. (Örnek: `/opsx:propose`.)

Eğer bir zamanlar `/opsx:propose` komutunu terminalinize yazıp hiçbir şey olmazsa bunun nedeni bu sayfadadır. OpenSpec'ın yanlış yarısıyla konuşuyorsunuz demektir. Slash komutları terminal komutları değildir. Bunlar, normalde "bir giriş formu ekle" yazdığınız sohbet kutusuna AI kodlama asistanınıza verdiğiniz talimatlardır.

Bu tek ayrım, yeni kullanıcılar için en yaygın takılma noktasıdır, o yüzden bunu son derece net hale getirelim.

## İki yarı

OpenSpec, iki şapka takan tek bir projedir.

**CLI (terminal yarısı).** Kabuğunuzdan yükleyip çalıştırdığınız `openspec` adlı bir program. Projenizi kurar, değişiklikleri listeler ve doğrular, bir gösterge paneli açar ve bitmiş işleri arşivler. Bu komutları iTerm, VS Code terminali, PowerShell, `git` veya `npm` çalıştırdığınız herhangi bir yere yazabilirsiniz.

```bash
openspec init        # bu projede OpenSpec'ı kur
openspec list        # aktif değişiklikleri görüntüle
openspec view        # etkileşimli gösterge panelini aç
```

**Slash komutları (sohbet yarısı).** AI asistanınıza yazdığınız `/opsx:propose` ve `/opsx:apply` gibi kısa komutlar. Bunlar AI'ya OpenSpec iş akışını takip etmesini söyler: bir öneri taslağı oluştur, özellik belgeleri yaz, görev listesinden oluştur, bittiğinde arşivle. Bu komutları Claude Code, Cursor, Windsurf, Copilot veya kullandığınız herhangi bir asistanın sohbetine yazabilirsiniz.

```text
/opsx:propose add-dark-mode    (AI sohbetinize yazıldı)
/opsx:apply                    (AI sohbetinize yazıldı)
/opsx:archive                  (AI sohbetinize yazıldı)
```

İşte tek bir resimde zihinsel model:

```text
        TERMINALİNİZ                         AI ASİSTANINIZIN SOHBETİ
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   yükler      │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   komutlar     │  /opsx:archive                │
   └──────────────────────┘    & beceriler └──────────────────────────────┘
        openspec'ı burada çalıştır                       /opsx:* komutlarını burada çalıştır
```

Okuyu fark edin. Terminalinizde `openspec init` çalıştırmak, slash komutlarını AI aracınıza *yükleyen* eylemdir. Terminal yarısı, sohbet yarısını kurar. Bundan sonra günlük kullanım büyük ölçüde sohbette gerçekleşir.

## "Etkileşimli modu nasıl başlatırım?"

**Başlatılacak ayrı bir etkileşimli mod yoktur.** Bu soru çok sık sorulur, o yüzden net bir cevap verme hakkımız var.

Özel bir OpenSpec moduna girmenize gerek yoktur. Her zaman yaptığınız gibi AI kodlama asistanınızı açın ve sohbete bir slash komutu yazın. Slash komutu, OpenSpec'a "girdiğiniz" yoldur. Asistanınız bunu tanır, eşleşen OpenSpec becerisini yükler ve iş akışını takip etmeye başlar.

O halde gerçek talimatlar şunlardır:
1. Projenizde AI kodlama asistanınızı (Claude Code, Cursor, Windsurf vb.) açın.
2. Sohbetine `/opsx:propose` yazın, başka herhangi bir isteği yazdığınız aynı yere.
3. Otomatik tamamlamayı izleyin: OpenSpec yüklüyse, slash yazdığınızda `/opsx:propose`, `/opsx:apply` ve benzeri komutlar görünecektir.

İşte bu kadar. Açıp kapatacağınız bir mod yok, başlatılacak bir arka plan programı yok, ayrı bir pencere yok.

Gerçekten etkileşimli olan tek şey terminaldedir: `openspec view`. Özellik belgelerinizi ve değişikliklerinizi görmek için bir gösterge paneli açar. Ancak bu bir görüntüleyicidir, öneri yapıp üzerinde çalıştığınız araç değildir. Yapılandırma işlemi sohbetteki slash komutlarıyla gerçekleşir.

## Bu ayrımın neden var olduğu

Bunu anlamak değerli, çünkü OpenSpec'ın 25'ten fazla farklı AI aracıyla çalışmasının nedenini açıklar.

CLI **mottordur**. Kuralları bilir: bir değişiklik klasörünün nasıl göründüğü, hangi ürünlerin birbirine bağlı olduğu, bir delta özellik belgesini kaynak gerçeğinize nasıl birleştireceğiniz. Her yerde aynıdır.

Slash komutları **direksiyondur** ve her AI aracının kendine özgü biraz farklı bir direksiyonu vardır. Claude Code bunlara komut der. Cursor ve Windsurf kendi formatlarına sahiptir. Bazı araçlar bunlara beceri der. `openspec init` çalıştırdığınızda OpenSpec, seçtiğiniz her araç için doğru türde dosyaları oluşturur, bu sayede tercih ettiğiniz asistan ne olursa olsun aynı `/opsx:propose` amacı çalışır.

Bu tasarımın gücü: iş akışını bir kez öğrenir ve araçlar arasında taşırısınız. Değiş tokuş: bir komutun tam sözdizimi araçlar arasında biraz farklılık gösterebilir, bu konu bir sonraki bölümde ele alınacaktır.

## Araçlara göre slash komut sözdizimi

Amaç her yerde aynıdır. Noktalama işaretleri farklıdır. Asistanınıza uyan formu kullanın.

| Araç | Nasıl yazarsınız |
|------|-----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | beceri tarzı, örn. `/openspec-propose` |
| Codex | `.codex/skills/openspec-*` üzerinden beceri tarzı |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | beceri tarzı, örn. `/skill:openspec-propose` |
| Trae | `/opsx-propose`, `/opsx-apply` |

Çoğu araç ya iki nokta üst üste formunu (`/opsx:propose`) ya da tire formunu (`/opsx-propose`) kullanır. Birkaç araç, OpenSpec'ı slash komutları yerine adlandırılmış beceriler olarak sunar; bunlar için beceriyi adıyla çağırırsınız. Tam araç listesi, dosyaların tam olarak nereye yazıldığı dahil, [Desteklenen Araçlar](supported-tools.md) sayfasında yer alır.

Şüpheye düştüğünüzde AI sohbetinize bir slash yazın ve otomatik tamamlamaya bakın. Aracınız beklediği formu size gösterecektir.

## Komutlar nasıl oraya geldi: beceriler ve komutlar

`openspec init` (veya `openspec update`) çalıştırdığınızda OpenSpec, AI aracınızın iş akışını bulabilmesi için projenize küçük dosyalar yazar. Aracınıza ve ayarlarınıza bağlı olarak bunlar **beceriler**, **komutlar** veya her ikisidir.

- **Beceriler** `.claude/skills/openspec-*/SKILL.md` gibi yerlerde bulunur. Bunlar, yükselen çapraz araç standardıdır: asistanınızın otomatik olarak algıladığı bir talimatlar klasörüdür.
- **Komutlar** `.claude/commands/opsx/<id>.md` gibi yerlerde bulunur. Bunlar, daha eski araç özel slash komut dosyalarıdır. Codex için üretilmiş komut dosyaları yoktur; `.codex/skills/openspec-*` kullanın.

Aracınızın hangisini kullandığıyla ilgilenmenize gerek yoktur. Sadece slash komutunu yazın ve çalışsın. Ancak bu dosyaların var olduğunu bilmek, bir şeyler ters gittiğinde yardımcı olur: komutlarınız kaybolursa bunun genellikle bu dosyaların eksik veya eski olduğu anlamına gelir ve `openspec update` bunları yeniden üretir.

Her araç için tam yollar için [Desteklenen Araçlar](supported-tools.md) sayfasına ve becerilerin daha eski yalnızca komut yaklaşımını nasıl değiştirdiğini görmek için [Geçiş Kılavuzu](migration-guide.md) sayfasına bakın.

## Yüklü olduğunu doğrulama

Hızlı kontroller, en hızlısından başlayarak:

1. **AI sohbetinize bir slash yazın.** `/opsx` yazmaya başlayın ve otomatik tamamlama önerilerini izleyin. Bunlar görünüyorsa her şey hazırdır.
2. **Dosyalara bakın.** Claude Code için `.claude/skills/` klasörünün `openspec-*` klasörleri içerdiğinden emin olun. Diğer araçlar kendi dizinlerini kullanır ([Desteklenen Araçlar](supported-tools.md) listeler).
3. **Kurulumu yeniden çalıştırın.** Proje kök dizininden `openspec update` komutunu çalıştırın. Bu, yapılandırdığınız araçlar için beceri ve komut dosyalarını yeniden üretir.
4. **Asistanınızı yeniden başlatın.** Birçok araç, beceri ve komutları başlangıçta tarar, bu yüzden yeni bir pencere eksik adım olabilir.

## Hangi komutlara sahibim?

Varsayılan olarak OpenSpec, slash komutlarının **çekirdek** kümesini yükler:

- `/opsx:explore`: bir değişikliğe bağlanmadan önce AI ile bir fikri düşünmek için (emin değilseniz harika bir ilk adımdır)
- `/opsx:propose`: bir değişiklik oluşturun ve tüm planlama ürünlerini tek adımda taslağını oluşturun
- `/opsx:apply`: görev listesinden geçerek değişikliği oluşturun
- `/opsx:sync`: bir değişikliğin özellik belgesi güncellemelerini ana özellik belgelerinizle birleştirin (genellikle otomatiktir)
- `/opsx:archive`: bir değişikliği bitirin ve arşivleyin

İyi bir varsayılan ritim: ne yapacağınızı anlamaya çalıştığınızda `explore`, sonra `propose`, `apply`, `archive`. [Önce Keşfet](explore.md) kılavuzu, bu açılış adımının neden değerli olduğunu açıklar.

Daha ince kontrol istiyorsanız **genişletilmiş** bir küme de vardır (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Bunu `openspec config profile` komutuyla etkinleştirirsiniz, ardından `openspec update` ile uygularsınız.

Buna yeni misiniz? `/opsx:onboard` (genişletilmiş kümede) kendi kod tabanınızda tam bir değişiklik boyunca size rehberlik eder, her adımı anlatır. Mümkün olan en dostça giriştir.

Her komutun ne yaptığını detaylı olarak görmek için [Komutlar](commands.md) sayfasına, hangisini ne zaman kullanacağınızı görmek için [İş Akışları](workflows.md) sayfasına bakın.

## Temiz bir ilk çalıştırma

Hepsi bir araya getirildiğinde, her adımın nerede gerçekleştiği etiketlenmiş tüm sıralama şu şekildedir:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (slash komutlarını AI aracınıza yükler)

AI SOHBETİ      /opsx:explore
              (isteğe bağlı: fikri önce AI ile düşünün)

AI SOHBETİ      /opsx:propose add-dark-mode
              (AI öneri taslağı, özellik belgeleri, tasarım ve görevleri oluşturur)

AI SOHBETİ      /opsx:apply
              (AI görevleri işaretleyerek oluşturur)

AI SOHBETİ      /opsx:archive
              (değişiklik özellik belgelerinizle birleştirilir ve arşivlenir)
```

Kurulum için iki terminal adımı. Sonra sohbette yaşarsınız. İşte bu ritim.

## İlgili

- [Başlarken](getting-started.md): ilk değişiklik için tam adım adım rehber
- [Komutlar](commands.md): her slash komutunun detaylı açıklaması
- [CLI](cli.md): her terminal komutunun detaylı açıklaması
- [Desteklenen Araçlar](supported-tools.md): araç özel sözdizimi ve dosya konumları
- [SSS](faq.md): daha fazla hızlı cevap
- [Sorun Giderme](troubleshooting.md): komutlar görünmeyince uygulanan düzeltmeler