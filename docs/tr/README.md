# OpenSpec Dokümantasyonu

Hoş geldiniz. Burası OpenSpec ile ilgili her şeyin merkezidir.

OpenSpec, **herhangi bir kod yazılmadan önce ne inşa edeceğiniz konusunda sizin ve yapay zeka kodlama asistanınızın anlaşmasına yardımcı olur.** Siz değişikliği tanımlarsınız, AI kısa bir spesifikasyon ve bir görev listesi taslağı hazırlar; ikiniz de aynı planı incelersiniz ve ardından çalışma gerçekleşir. Artık yarım yolda AI'nın yanlış şeyi inşa ettiğini keşfetmek zorunda değilsiniz.

Başka hiçbir şey okumayacaksanız, bu iki sayfayı okuyun:

1. [Getting Started](getting-started.md): Kurulum, başlatma ve ilk değişikliğinizi yayınlama.
2. [How Commands Work](how-commands-work.md): `/opsx:propose` komutlarını nerede yazdığınız (ipucu: terminalde değil, AI sohbetinizde). Bu neredeyse herkesin başına gelen bir durumdur.

İkinci olanı göründüğünden daha fazla önem taşıyor. OpenSpec'in iki yarısı vardır: Terminalde çalıştırdığınız bir komut satırı aracı ve AI asistanınıza verdiğiniz eğik (slash) komutları. Hangisinin hangisi olduğunu bilmek, en yaygın kafa karışıklığı anını önler.

> **Öncelikle edinilmesi gereken en iyi alışkanlık: Ne inşa edeceğinizden emin değilseniz, `/opsx:explore` ile başlayın.** Bu, kodunuzu okuyan, seçenekleri tartıp ve herhangi bir eser veya koddan önce belirsiz bir fikri somut bir plana dönüştüren risksiz bir düşünme ortağıdır. [Explore First](explore.md) rehberi bunu kanıtlar niteliktedir.

## Yolunuzu Seçin

**Ben tamamen yeni biriyim.** [Getting Started](getting-started.md) ile başlayın, ardından [Core Concepts at a Glance](overview.md)'ı gözden geçirin. Bir şey gizemli gelirse, [FAQ](faq.md) ve [Glossary](glossary.md) yakınınızdadır.

**Bir sorunum var ama bir planım yok.** Bu yaygın bir durumdur ve bunun özel bir cevabı vardır: [Explore First](explore.md). Herhangi bir şeye bağlı kalmadan önce AI ile birlikte düşünmek için `/opsx:explore` kullanın.

**Büyük, mevcut bir kod tabanım var.** Tümünü dokümante etmenize gerek yok. [Using OpenSpec in an Existing Project](existing-projects.md), okyanusu kaynatmadan gerçek, "brownfield" (mevcut) kod üzerinde nasıl başlayacağınızı gösterir.

**Sadece çalışır hale getirmek istiyorum.** [Install](installation.md)'ı yapın, `openspec init` komutunu çalıştırın ve ilk eğik komutunuzun doğru yere düşmesi için [How Commands Work](how-commands-work.md)'i okuyun.

**Örneklerle öğreniyorum.** [Examples & Recipes](examples.md) sayfası gerçek değişiklikleri baştan sona anlatır: küçük bir özellik, bir hata düzeltme, bir refactor (yeniden düzenleme), bir keşif.

**Eski iş akışından geliyorum.** [Migration Guide](migration-guide.md), neyin değiştiğini ve nedenini açıklar ve mevcut çalışmanızın güvende olduğunu vaat eder.

**Ekibimin sürecine uydurmak istiyorum.** [Customization](customization.md), proje yapılandırmasını, özel şemaları ve paylaşılan bağlamı kapsar.

**Bir şey bozuldu.** [Troubleshooting](troubleshooting.md), insanların gerçekten karşılaştığı hataları düzeltmeleriyle birlikte toplar.

## Tüm Harita

### Şuradan Başlayın

| Doküman | Ne Sağlar? |
|-----|-------------------|
| [Getting Started](getting-started.md) | Kurulum, başlatma ve ilk değişikliğinizi uçtan uca çalıştırma |
| [Explore First](explore.md) | Bir fikri taahhüt etmeden önce düşünmek için `/opsx:explore` kullanma |
| [How Commands Work](how-commands-work.md) | Eğik komutların nerede çalıştığı, "etkileşimli mod"un ne anlama geldiği, terminal vs sohbet |
| [Core Concepts at a Glance](overview.md) | Tek bir sayfada tüm zihinsel model: spesifikasyonlar, değişiklikler, deltalar, arşiv |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix ve bunun çalışıp çalışmadığını nasıl doğrulayacağınız |

### Günlük Kullanımda Kullanın

| Doküman | Ne Sağlar? |
|-----|-------------------|
| [Workflows](workflows.md) | Yaygın kalıplar ve hangi komutu ne zaman kullanmanız gerektiği |
| [Examples & Recipes](examples.md) | Gerçek değişikliklerin tam anlatımları, kopyalayıp yapıştırılabilir |
| [Using OpenSpec in an Existing Project](existing-projects.md) | Büyük bir brownfield kod tabanında OpenSpec'i benimseme |
| [Editing & Iterating on a Change](editing-changes.md) | Eserleri güncelleme, geri dönme, manuel düzenlemeleri uzlaştırma |
| [Commands](commands.md) | Her `/opsx:*` eğik komutu için referans |
| [CLI](cli.md) | Her `openspec` terminal komutu için referans |

### Derinlemesine Anlayın

| Doküman | Ne Sağlar? |
|-----|-------------------|
| [Concepts](concepts.md) | Spesifikasyonlar, değişiklikler, eserler, şemalar ve arşiv hakkında uzun formlu açıklama |
| [OPSX Workflow](opsx.md) | İş akışının neden aşama bazlı kilitli değil de akıcı olduğu, artı bir mimari derinlemesine inceleme |
| [Glossary](glossary.md) | Tanımlanan her terim tek bir yerde |

### Kendinize Uyarlayın

| Doküman | Ne Sağlar? |
|-----|-------------------|
| [Customization](customization.md) | Proje yapılandırması, özel şemalar, paylaşılan bağlam |
| [Multi-Language](multi-language.md) | İngilizce dışındaki dillerde eser oluşturma |
| [Supported Tools](supported-tools.md) | OpenSpec'in entegre olduğu 25+ AI aracı ve dosyaların nereye düştüğü |

### Yardım Gerektiğinde

| Doküman | Ne Sağlar? |
|-----|-------------------|
| [FAQ](faq.md) | İnsanların en çok sorduğu sorulara hızlı cevaplar |
| [Troubleshooting](troubleshooting.md) | Somut hatalar için somut çözümler |
| [Migration Guide](migration-guide.md) | Eski iş akışından OPSX'e geçiş |

### Repo'lar Arası Koordinasyon (beta)

| Doküman | Ne Sağlar? |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | Çalışmanızın repo'ları veya ekipleri kapsadığı durumlarda planlama |
| [Agent Contract](agent-contract.md) | Makinelerin okuyabileceği, ajanların yönlendirdiği sözleşme |

## Otuz Saniyelik Versiyon

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in your AI chat)  /opsx:explore           ← optional, but a great habit
4. Propose        (in your AI chat)  /opsx:propose add-dark-mode
5. Build          (in your AI chat)  /opsx:apply
6. Archive        (in your AI chat)  /opsx:archive
```

1. ve 2. adımlar terminalinizde gerçekleşir. Geri kalanlar yapay zeka asistanınızın sohbetinde gerçekleşir. Bu ayrım hatırlanması gereken tek şeydir ve [How Commands Work](how-commands-work.md) tam olarak nedenini açıklar. 3. adım isteğe bağlıdır, ancak emin olmadığınız zaman `/opsx:explore` ile başlamak edinilmesi en değerli alışkanlıktır.

## Yardım Alabileceğiniz Diğer Yerler

- **Discord:** Sorular, fikirler ve yardım için [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC).
- **GitHub Issues:** Hatalar ve özellik istekleri için [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues).
- **`openspec feedback "mesajınız"`** doğrudan terminalinizden geri bildirim gönderir (bir GitHub sorusu açar).

Bu dokümanlarda yanlış, eskimiş veya kafa karıştırıcı bir şey buldunuz mu? Bu bir hatadır. Bir sorun veya PR açın. Dokümantasyon iyileştirmeleri yapabileceğiniz en değerli katkılardan bazılarıdır.