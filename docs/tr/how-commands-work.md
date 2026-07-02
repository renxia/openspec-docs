# Komutlar Nasıl Çalışır

**Bilinmesi gereken tek bir şey: OpenSpec'in iki tür komutu vardır ve bunlar iki farklı yerde çalışır.**

- `openspec ...` komutları **terminalinizde** çalışır. (Örnek: `openspec init`.)
- `/opsx:...` komutları **AI asistanınızın sohbetinde** çalışır. (Örnek: `/opsx:propose`.)

Eğer hiç terminal'e `/opsx:propose` yazarsanız ve hiçbir şey olmazsa, bu sayfa size yardımcı olacaktır. Bu bir yanlış anlaşılmadır. Onlar terminaller komutu değildir. Bunlar, AI kodlama asistanınıza verdiğiniz talimatlardır; normalde "bir giriş formu ekle" yazdığınız sohbet kutusunda verirsiniz.

Bu tek ayrım, yeni kullanıcıların en çok takıldığı nokta olduğu için, bunu netleştirelim.

## İki Yarı

OpenSpec iki şapka takan bir projedir.

**CLI (Terminal Yarısı).** Shell'den kurup çalıştırdığınız `openspec` adlı bir programdır. Projenizi hazırlar, değişiklikleri listeler ve doğrular, bir kontrol paneli gösterir ve bitmiş işleri arşivler. Bunları iTerm'e, VS Code terminaline, PowerShell'a veya `git` ya da `npm` çalıştırdığınız herhangi bir yere yazarsınız.

```bash
openspec init        # bu projede OpenSpec kurar
openspec list        # aktif değişiklikleri görür
openspec view        # etkileşimli kontrol panelini açar
```

**Slash Komutları (Sohbet Yarısı).** AI asistanınıza yazdığınız `/opsx:propose` ve `/opsx:apply` gibi kısa komutlardır. Bunlar, yapay zekanın OpenSpec iş akışını takip etmesini söylerler: bir teklif taslağı hazırlama, özellik yazma, görev listesinden oluşturma, bitince arşivleme. Bunları Claude Code, Cursor, Windsurf, Copilot veya kullandığınız herhangi bir asistanta yazarsınız.

```text
/opsx:propose add-dark-mode    (AI sohbetinde yazıldı)
/opsx:apply                    (AI sohbetinde yazıldı)
/opsx:archive                  (AI sohbetinde yazıldı)
```

İşte tek bir resimde mental model:

```text
        SİZİN TERMINALİN                         SİZİN AI ASİSTANINIZIN SOHBETİ
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   komutları    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   çalıştır      │  /opsx:archive                │
   └──────────────────────┘    & beceri   └──────────────────────────────┘
        burada openspec çalıştır                       burada /opsx:* çalıştır
```

Ok işaretine dikkat edin. Terminal'de `openspec init` çalıştırmak, slash komutlarını AI aracınıza *yükleyen* şeydir. Terminal yarısı sohbet yarısını hazırlar. Bundan sonra günlük çalışma büyük ölçüde sohbette gerçekleşir.

## "Etkileşimli Moda Nasıl Başlarım?"

**Başlatılacak ayrı bir etkileşimli mod yoktur.** Bu soru sıkça sorulduğu için, buna net bir cevap vermek gerekir.

Özel bir OpenSpec moduna girmiyorsunuz. Siz sadece her zaman yaptığınız gibi AI kodlama asistanınızı açar ve sohbete bir slash komutu yazarsınız. Slash komutu, OpenSpec'e "girmek" yöntemidir. Asistanınız bunu tanır, eşleşen OpenSpec becerisini yükler ve iş akışını takip etmeye başlar.

Gerçek talimatlar şunlardır:

1. Projenizde AI kodlama asistanınızı açın (Claude Code, Cursor, Windsurf vb.).
2. Sohbetine `/opsx:propose` yazın; başka herhangi bir istek yazdığınız yer burasıdır.
3. Otomatik tamamlama özelliğini izleyin: OpenSpec kuruluysa, slash'ı yazarken `/opsx:propose`, `/opsx:apply` ve benzerlerinin göründüğünü göreceksiniz.

Hepsi bu kadar. Açıp kapatılacak bir mod yok, başlatılacak bir daemon yok, ayrı bir pencere yok.

Gerçekten etkileşimli olan tek bir şey terminalde yer alır: `openspec view`. Bu, özelliklerinizi ve değişikliklerinizi göz atmak için bir kontrol paneli açar. Ancak bu bir görüntüleyicidir; teklif verdiğiniz ve oluşturduğunuz şey değildir. Oluşturma işlemi sohbetteki slash komutları aracılığıyla gerçekleşir.

## Bu Ayrımın Nedeni

Bu, OpenSpec'in 25'ten fazla farklı AI aracıyla neden çalıştığını açıkladığı için anlamaya değerdir.

CLI, **motorudur**. Kuralları bilir: bir değişiklik klasörünün nasıl göründüğünü, hangi eserlerin hangilerine bağlı olduğunu, bir delta spec'i doğru kaynağa nasıl birleştireceğini. Her yerde aynıdır.

Slash komutları ise **direksiyon simididir** ve her AI aracının biraz farklı olanı vardır. Claude Code onlara komut der. Cursor ve Windsurf kendi formatlarına sahiptir. Bazı araçlar onları beceri (skill) olarak adlandırır. `openspec init` çalıştırdığınızda, OpenSpec seçtiğiniz her araç için doğru türden bir dosya oluşturur, böylece hangi asistanı tercih ederseniz edin aynı `/opsx:propose` niyetinin işe yaramasını sağlar.

Bu tasarımın gücü şudur: İş akışını bir kez öğrenirsiniz ve bunu tüm araçlara taşırsınız. Dezavantajı ise şudur: Bir komutun tam sözdizimi, araçlar arasında biraz farklılık gösterebilir; bu da sonraki bölümdür.

## Araçlara Göre Slash Komutu Sözdizimi

Amaç her yerde aynıdır. Noktalama işaretleri farklılık gösterir. Asistanınızla eşleşen formu kullanın.

| Tool | How you type it |
|------|-----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | skill-style, e.g. `/skill:openspec-propose` |
| Trae | skill-style, e.g. `/openspec-propose` |

Çoğu araç ya iki nokta üstü formunu (`/opsx:propose`) ya da tireli formu (`/opsx-propose`) kullanır. Birkaç araç OpenSpec'i slash komutu yerine adlandırılmış bir beceri olarak gösterir; bu durumlar için beceriyi adıyla çağırırsınız. Tam, araç bazlı liste, tam olarak hangi dosyaların nereye yazılacağını içeren [Supported Tools](supported-tools.md)'da yer alır.

Şüpheye düştüğünüzde, AI sohbetinize bir slash yazın ve otomatik tamamlamaya bakın. Aracınız beklediği formu size gösterecektir.

## Komutlar Nasıl Oluştu: Skills ve Commands

`openspec init` (veya `openspec update`) çalıştırdığınızda, OpenSpec, AI aracınızın iş akışını bulabilmesi için projenize küçük dosyalar yazar. Aracınıza ve ayarlarına bağlı olarak bunlar **skills**, **commands** veya her ikisi olabilir.

- **Skills**, `.claude/skills/openspec-*/SKILL.md` gibi yerlerde bulunur. Bunlar, asistanınızın otomatik olarak algıladığı bir talimatlar klasörü olan ortaya çıkan çapraz araç standardıdır.
- **Commands**, `.claude/commands/opsx/<id>.md` gibi yerlerde bulunur. Bunlar eski, araç bazlı slash komutu dosyalarıdır.

Aracınızın hangisini kullandığını dert etmenize gerek yok. Siz sadece slash komutunu yazarsınız ve işe yarar. Ancak bu dosyaların var olduğunu bilmek bir şey ters gittiğinde yardımcı olur: eğer komutlarınız kaybolursa, genellikle bu dosyalar eksik veya eskimiş demektir ve `openspec update` onları yeniden oluşturur.

Araç bazlı tam yollar için [Supported Tools](supported-tools.md)'a, skills'in eski komut odaklı yaklaşımı nasıl değiştirdiğine dair ise [Migration Guide](migration-guide.md)'a bakın.

## Kurulduğunu Doğrulama

Hızlı kontroller, en hızlısı önce:

1. **AI sohbetinize bir slash yazın.** `/opsx` yazmaya başlayın ve otomatik tamamlama önerilerini izleyin. Eğer bunlar görünüyorsa, hazırsınız demektir.
2. **Dosyaları arayın.** Claude Code için, `.claude/skills/` içinde `openspec-*` klasörleri olup olmadığını kontrol edin. Diğer araçlar kendi dizinlerini kullanır ([Supported Tools](supported-tools.md) bunları listeler).
3. **Kurulumu tekrar çalıştırın.** Proje kökünden `openspec update` komutunu çalıştırın. Bu, yapılandırdığınız araçlar için beceri ve komut dosyalarını yeniden oluşturur.
4. **Asistanınızı yeniden başlatın.** Birçok araç başlangıçta becerileri ve komutları tarar, bu yüzden taze bir pencere eksik olan adım olabilir.

## Hangi Komutlara Sahibim?

Varsayılan olarak OpenSpec, **temel** slash komut seti'ni kurar:

- `/opsx:explore`: Bir değişikliğe karar vermeden önce AI ile bir fikri düşünme (kararsız olduğunuzda harika bir ilk adımdır)
- `/opsx:propose`: Bir değişiklik oluşturma ve tüm planlama eserlerini tek adımda taslak haline getirme
- `/opsx:apply`: Görev listesinden geçerek değişikliği oluşturma
- `/opsx:sync`: Bir değişikliğin spec güncellemelerini ana özelliklerinize birleştirme (genellikle otomatik)
- `/opsx:archive`: Bir değişikliği bitirip arşivleme

İyi bir varsayılan ritim: Ne yapacağını çözüyorsanız `explore`, ardından `propose`, `apply`, `archive`. [Explore First](explore.md) rehberi bu başlangıç adımının neden faydalı olduğunu açıklar.

Daha ince kontrol isteyenler için **genişletilmiş** bir set de vardır (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Bunu `openspec config profile` ile açar, ardından `openspec update` ile uygularsınız.

Tüm bunlara yeni misiniz? `/opsx:onboard` (genişletilmiş sette) kendi kod tabanınız üzerinde tam bir değişikliği size anlatarak adım adım sizi yönlendirir. Bu, mümkün olan en samimi tanımdır.

Her komutun ayrıntılığını ne yaptığını görmek için [Commands](commands.md)'a bakın. Hangisini ne zaman kullanmanız gerektiğini görmek için [Workflows](workflows.md)'a bakın.

## Temiz Bir İlk Çalıştırma

Bunları bir araya getirerek, her adımın nerede gerçekleştiği etiketlenmiş tüm sırayı aşağıda bulabilirsiniz.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (AI aracınıza slash komutlarını kurar)

AI CHAT      /opsx:explore
              (isteğe bağlı: fikri önce AI ile düşünme)

AI CHAT      /opsx:propose add-dark-mode
              (AI teklif, özellikler, tasarım ve görevleri taslak haline getirir)

AI CHAT      /opsx:apply
              (AI bunu oluşturur, görevleri işaretleyerek)

AI CHAT      /opsx:archive
              (değişiklik özelliklere birleştirilir ve arşivlenir)
```

Kurulum için iki terminal adımı. Sonra sohbette yaşıyorsunuz. İşte ritim bu.

## İlgili

- [Getting Started](getting-started.md): tam ilk değişiklik rehberi
- [Commands](commands.md): her slash komutu ayrıntılı olarak
- [CLI](cli.md): her terminal komutu ayrıntılı olarak
- [Supported Tools](supported-tools.md): araç bazlı sözdizimi ve dosya konumları
- [FAQ](faq.md): daha fazla hızlı cevap
- [Troubleshooting](troubleshooting.md): komutlar görünmediğinde çözümler