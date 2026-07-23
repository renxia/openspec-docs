---
layout: home

hero:
  name: "OpenSpec"
  text: "AI Asistanları için Spesifikasyon Odaklı Geliştirme"
  tagline: AI asistanı projelerini oluşturmak ve yönetmek için hafif bir spesifikasyon.
  actions:
    - theme: brand
      text: Başla
      link: ./getting-started
    - theme: alt
      text: Ana Sayfa
      link: /

features:
  - title: Önce Spesifikasyon İş Akışı
    details: Kod yazmadan önce gereksinimleri tanımlayın.
  - title: AI-Native Tasarım
    details: Claude Code, Cursor, Windsurf ve daha fazlası için tasarlandı.
  - title: Çoklu Dil Desteği
    details: Dokümantasyon birden fazla dilde mevcut.
---

# OpenSpec Dokümantasyonu

Hoş geldiniz. Bu, OpenSpec ile ilgili her şeyin bulunduğu ana sayfadır.

OpenSpec, sizin ve yapay zeka kodlama asistanınızın **herhangi bir kod yazılmadan önce ne yapacağınıza anlaşmasına** yardımcı olur. Değişikliği siz tanımlarsınız, yapay zeka kısa bir spesifikasyon ve görev listesi hazırlar, her ikiniz de aynı planı incelersiniz ve ardından çalışma başlar. Artık çalışmanın ortasında yapay zekanın yanlış şey yaptığını keşfetmek yok.

Eğer başka hiçbir şey okumazsanız, bu iki sayfayı okuyun:

1. [Başla](getting-started.md): kurulum yapın, başlatın ve ilk değişikliğinizi tamamlayın.
2. [Komutlar Nasıl Çalışır](how-commands-work.md): `/opsx:propose` komutunu aslında nereye yazacağınız (ipucu: yapay zeka sohbetine, terminale değil). Bu, neredeyse herkesi bir kez yanıltır.

İkincisi, göründüğünden daha önemli. OpenSpec'in iki ayrı kısmı var: terminalde çalıştırdığınız bir komut satırı aracı ve yapay zeka asistanınıza verdiğiniz eğik çizgi komutları (slash commands). Hangisinin hangisi olduğunu bilmek, en yaygın kafa karışıklığını önler.

> **İlk olarak edinmeniz gereken en iyi alışkanlık: ne yapacağınızdan emin değilseniz, `/opsx:explore` ile başlayın.** Kod veya herhangi bir ürün ortaya çıkmadan önce kodunuzu okuyan, seçenekleri değerlendiren ve bulanık bir fikri somut bir plana dönüştüren, hiçbir riski olmayan bir düşünme ortağıdır. [Önce Keşfet](explore.md) rehberi bunu açıklar.

## Yolunu Seç

**Yeni başlıyorsunuz.** [Başla](getting-started.md) ile başlayın, ardından [Temel Kavramlara Genel Bakış](overview.md) sayfasına göz atın. Bir şey gizli gelirse, [SSS](faq.md) ve [Sözlük](glossary.md) sayfaları yanınızda.

**Sorununuz var ama henüz bir planınız yok.** Bu en yaygın durumdur ve ona özel bir çözüm var: [Önce Keşfet](explore.md). Herhangi bir şeye başlamadan önce fikri yapay zeka ile birlikte düşünmek için `/opsx:explore` komutunu kullanın.

**Büyük mevcut bir kod tabanınız var.** Tümünü belgelemek zorunda değilsiniz. [Mevcut Projede OpenSpec Kullanımı](existing-projects.md) sayfası, okyanusu kaynatmadan gerçek, brownfield kod üzerinde nasıl başlayacağınızı gösterir.

**Sadece çalışır hale getirmek istiyorum.** [Kurulum](installation.md) sayfasını okuyun, `openspec init` komutunu çalıştırın, ardından ilk eğik çizgi komutunuzu doğru yere yazmak için [Komutlar Nasıl Çalışır](how-commands-work.md) sayfasını okuyun.

**Örneklerle öğrenmeyi tercih ediyorum.** [Örnekler ve Tarifler](examples.md) sayfası, gerçek değişiklikleri baştan sona anlatır: küçük bir özellik, hata düzeltmesi, yeniden düzenleme, keşif.

**Yapay zeka sadece bir plan hazırladı — şimdi ne olacak?** Onu okuyun. [Değişikliği İnceleme](reviewing-changes.md) sayfası, hala ucuzken yanlış bir yolu yakalayan iki dakikalık inceleme sürecini gösterir ve [İyi Spesifikasyonlar Yazma](writing-specs.md) sayfası, onaylanmaya değer bir planın neyden oluştuğunu kapsar.

**Takımda çalışıyorum.** [Takımda OpenSpec](team-workflow.md) sayfası, bir değişikliğin bir dal ve bir çekme isteğine (pull request) nasıl dönüştüğünü ve takım arkadaşlarının koddan önce bir planı nasıl incelediğini gösterir.

**Eski iş akışından geliyorum.** [Geçiş Rehberi](migration-guide.md) sayfası, neyin değiştiğini ve nedenini açıklar ve mevcut çalışmalarınızın güvende olduğunu taahhüt eder.

**Takımımın sürecine uyarlamak istiyorum.** [Özelleştirme](customization.md) sayfası, proje yapılandırmasını, özel şemaları ve paylaşılan bağlamı kapsar.

**Bir şeyler bozuk.** [Sorun Giderme](troubleshooting.md) sayfası, insanların gerçekten karşılaştığı hataları ve çözümlerini toplar.

## Tüm Harita

### Buradan Başla

| Belge | Size Ne Sunar? |
|-----|-------------------|
| [Başla](getting-started.md) | Kurulum yapma, başlatma ve ilk değişikliğinizi uçtan uca çalıştırma |
| [Önce Keşfet](explore.md) | Herhangi bir şeye başlamadan önce bir fikri düşünmek için `/opsx:explore` kullanımı |
| [Komutlar Nasıl Çalışır](how-commands-work.md) | Eğik çizgi komutlarının nerede çalıştığı, "etkileşimli mod"un ne anlama geldiği, terminal ile sohbet arasındaki fark |
| [Temel Kavramlara Genel Bakış](overview.md) | Tek sayfada tüm zihinsel model: spesifikasyonlar, değişiklikler, deltalar, arşiv |
| [Kurulum](installation.md) | npm, pnpm, yarn, bun, Nix ve kurulumun doğru çalıştığını nasıl doğrulayacağınız |

### Günlük Kullanım

| Belge | Size Ne Sunar? |
|-----|-------------------|
| [İş Akışları](workflows.md) | Yaygın kalıplar ve her komuta ne zaman başvurulacağı |
| [Örnekler ve Tarifler](examples.md) | Gerçek değişikliklerin tam adım adım anlatımları, kopyala-yapıştırılabilir |
| [İyi Spesifikasyonlar Yazma](writing-specs.md) | Güçlü bir gereksinimin ve senaryonun nasıl göründüğü ve bir değişikliği doğru boyutta nasıl yapacağınız |
| [Değişikliği İnceleme](reviewing-changes.md) | Herhangi bir kod yazılmadan önce hazırlanan bir plan üzerinde yapılan iki dakikalık inceleme |
| [Takımda OpenSpec](team-workflow.md) | Değişikliklerin dallar, çekme istekleri ve incelemelere nasıl uyarlanacağı |
| [Mevcut Projede OpenSpec Kullanımı](existing-projects.md) | Büyük bir brownfield kod tabanında OpenSpec'i benimseme |
| [Değişikliği Düzenleme ve İyileştirme](editing-changes.md) | Ürünleri güncelleme, geri dönme, elle yapılan düzenlemeleri uzlaştırma |
| [Komutlar](commands.md) | Her `/opsx:*` eğik çizgi komutu için referans |
| [CLI](cli.md) | Her `openspec` terminal komutu için referans |

### Derinlemesine Anlama

| Belge | Size Ne Sunar? |
|-----|-------------------|
| [Kavramlar](concepts.md) | Spesifikasyonlar, değişiklikler, ürünler, şemalar ve arşiv için uzun açıklamalar |
| [OPSX İş Akışı](opsx.md) | İş akışının neden aşamalı kilitli değil de akışkan olduğu, artı bir mimari derinlemesine incelemesi |
| [Sözlük](glossary.md) | Tüm terimlerin tek bir yerde tanımlanması |

### Kendinize Uyarlayın

| Belge | Size Ne Sunar? |
|-----|-------------------|
| [Özelleştirme](customization.md) | Proje yapılandırması, özel şemalar, paylaşılan bağlam |
| [Çoklu Dil Desteği](multi-language.md) | İngilizce dışındaki dillerde ürün oluşturma |
| [Desteklenen Araçlar](supported-tools.md) | OpenSpec'in entegre olduğu 25'ten fazla AI aracı ve dosyaların nereye kaydedileceği |

### Yardım İhtiyacınız Olduğunda

| Belge | Size Ne Sunar? |
|-----|-------------------|
| [SSS](faq.md) | En çok sorulan sorulara hızlı cevaplar |
| [Sorun Giderme](troubleshooting.md) | Somut hatalar için somut çözümler |
| [Geçiş Rehberi](migration-guide.md) | Eski iş akışından OPSX'ye geçiş |

### Repolar Arasında Koordinasyon (beta)

| Belge | Size Ne Sunar? |
|-----|-------------------|
| [Mağazalar: Kullanıcı Rehberi](stores-beta/user-guide.md) | Çalışmanız birden fazla depo veya takımı kapsadığında planı kendi deposunda tutma |
| [Aracı Sözleşmesi](agent-contract.md) | Aracıların sürdürdüğü makine okunabilir CLI yüzeyleri |

## Otuz Saniyelik Versiyon

```text
1. Kurulum        npm install -g @fission-ai/openspec@latest
2. Başlatma     cd your-project && openspec init
3. Keşfet        (in your AI chat)  /opsx:explore           ← isteğe bağlıdır, ancak edinmeniz gereken en iyi alışkanlıktır
4. Öner        (in your AI chat)  /opsx:propose add-dark-mode
5. Oluştur          (in your AI chat)  /opsx:apply
6. Arşivle        (in your AI chat)  /opsx:archive
```

1. ve 2. adımlar terminalinizde gerçekleşir. Geri kalanı yapay zeka asistanınızın sohbetinde gerçekleşir. Bu ayrım, ezberlemeye değer tek şeydir ve [Komutlar Nasıl Çalışır](how-commands-work.md) sayfası tam olarak nedenini açıklar. 3. adım isteğe bağlıdır, ancak emin değilseniz `/opsx:explore` ile başlamak, edinmeniz en değerli alışkanlıktır.

## Başka Nereden Yardım Alabilirsiniz?

- **Discord:** Sorular, fikirler ve yardım için [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Sorunları:** Hatalar ve özellik istekleri için [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **`openspec feedback "mesajınız"`** komutu, terminalinizden doğrudan geri bildirim gönderir (bir GitHub sorunu açar).

Bu dokümanlarda yanlış, güncel olmayan veya kafa karıştırıcı bir şey buldunuz? Bu bir hatadır. Bir sorun veya bir çekme isteği (PR) açın. Dokümantasyon iyileştirmeleri, yapabileceğiniz en değerli katkılardan bazılarıdır.