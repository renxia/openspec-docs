---
layout: home

hero:
  name: "OpenSpec"
  text: "Specification-Driven Development for AI Assistants"
  tagline: A lightweight spec for building and managing AI assistant projects.
  actions:
    - theme: brand
      text: Başlayın
      link: ./getting-started
    - theme: alt
      text: Ana Sayfa
      link: /

features:
  - title: Spec-First Workflow
    details: Kod yazmadan önce gereksinimleri tanımlayın.
  - title: AI-Native Design
    details: Claude Code, Cursor, Windsurf ve daha fazlası için tasarlandı.
  - title: Multi-Language
    details: Çoklu dillerde dokümantasyon mevcuttur.
---

# OpenSpec Dokümantasyonu

Hoş geldiniz. Burası OpenSpec ile ilgili her şeyin ana sayfasıdır.

OpenSpec, herhangi bir kod yazılmadan önce yapılması gerekenler konusunda sizin ve Yapay Zeka (AI) kodlama asistanınızın **anlaşmasını** sağlar. Değişikliği siz tanımlarsınız, AI kısa bir spesifikasyon ve bir görev listesi taslağı hazırlar, ikiniz de aynı planı incelersiniz ve ardından çalışma gerçekleşir. Yarı yolda yapay zekanın yanlış bir şey inşa ettiğini keşfetme derdi kalmaz.

Başka hiçbir şeyi okumazsanız, bu iki sayfayı okuyun:

1. [Getting Started](getting-started.md): kurulum, başlatma ve ilk değişikliğinizi yayınlama.
2. [How Commands Work](how-commands-work.md): `/opsx:propose` komutunu nerede yazdığınız (ipucu: terminalde değil, AI sohbetinizde). Bu neredeyse herkesin bir kez takıldığı yerdir.

İkinci olanı göründüğünden daha önemlidir. OpenSpec iki yarımden oluşur: terminalinizde çalıştırdığınız bir komut satırı aracı ve Yapay Zeka asistanınıza verdiğiniz eğik (slash) komutlar. Hangisinin hangisi olduğunu bilmek, en yaygın kafa karışıklığı anını ortadan kaldırır.

> **İlk oluşturulması gereken en iyi alışkanlık: ne inşa edeceğinizden emin değilseniz `/opsx:explore` ile başlayın.** Bu, kodunuzu okuyan, seçenekleri tartarak belirsiz bir fikri herhangi bir çıktı veya kod var olmadan somut bir plana dönüştüren risksiz bir düşünce ortağıdır. [Explore First](explore.md) rehberi bu durumu açıklar.

## Yolunuzu Seçin

**Tamamen yeni gibiyim.** [Getting Started](getting-started.md) ile başlayın, ardından [Core Concepts at a Glance](overview.md)'yi hızlıca gözden geçirin. Bir şey gizemli gelirse, [FAQ](faq.md) ve [Glossary](glossary.md) yakındadır.

**Bir sorunum var ama bir planım yok.** Bu yaygın durumdur ve özel bir cevabı vardır: [Explore First](explore.md). Herhangi bir şeye taahhütte bulunmadan önce AI ile düşünmek için `/opsx:explore` kullanın.

**Büyük, mevcut bir kod tabanım var.** Tümünü dokümante etmenize gerek yok. [Using OpenSpec in an Existing Project](existing-projects.md), okyanusu kaynatmadan gerçek, eski (brownfield) kod üzerinde nasıl başlayacağınızı gösterir.

**Sadece çalışır hale getirmek istiyorum.** [Install](installation.md)'ı okuyun, `openspec init` komutunu çalıştırın ve ilk eğik komutunuzun doğru yere düşmesi için [How Commands Work](how-commands-work.md)'yi okuyun.

**Örneklerle öğreniyorum.** [Examples & Recipes](examples.md) sayfası gerçek değişiklikleri baştan sona anlatır: küçük bir özellik, bir hata düzeltmesi, yeniden yapılandırma (refactor), bir keşif.

**Eski iş akışından geliyorum.** [Migration Guide](migration-guide.md), neyin ve neden değiştiğini açıklar ve mevcut çalışmanızın güvende olduğunu vaat eder.

**Bunu ekibimin sürecine uyarlamak istiyorum.** [Customization](customization.md), proje yapılandırmasını, özel şemaları ve paylaşılan bağlamı kapsar.

**Bir şey bozuldu.** [Troubleshooting](troubleshooting.md), insanların gerçekten karşılaştığı hataları düzeltmeleriyle birlikte toplar.

## Bütün Harita

### Buradan başlayın

| Doc | Size ne sağlıyor |
|-----|-------------------|
| [Getting Started](getting-started.md) | İlk değişikliğinizi uçtan uca kurun, başlatın ve çalıştırın |
| [Explore First](explore.md) | Taahhütte bulunmadan önce bir fikri düşünmek için `/opsx:explore` kullanın |
| [How Commands Work](how-commands-work.md) | Eğik komutların nerede çalıştığı, "interaktif mod"un ne anlama geldiği, terminal vs sohbet |
| [Core Concepts at a Glance](overview.md) | Bütün zihinsel model tek bir sayfada: spesifikasyonlar, değişiklikler, deltalar (deltas), arşiv |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix ve çalıştığını nasıl doğrulayacağınız |

### Günlük kullanımda kullanın

| Doc | Size ne sağlıyor |
|-----|-------------------|
| [Workflows](workflows.md) | Yaygın desenler ve her komuta ne zaman başvurulacağı |
| [Examples & Recipes](examples.md) | Tam değişiklik anlatımları, kopyalanabilir |
| [Using OpenSpec in an Existing Project](existing-projects.md) | Büyük bir eski kod tabanında OpenSpec benimseme |
| [Editing & Iterating on a Change](editing-changes.md) | Çıktıları güncelleme, geri dönme, manuel düzenlemeleri uzlaştırma |
| [Commands](commands.md) | Her `/opsx:*` eğik komutu için referans |
| [CLI](cli.md) | Her `openspec` terminal komutu için referans |

### Derinlemesine anlayın

| Doc | Size ne sağlıyor |
|-----|-------------------|
| [Concepts](concepts.md) | Spesifikasyonlar, değişiklikler, çıktılar (artifacts), şemalar ve arşiv hakkında uzun formlu açıklama |
| [OPSX Workflow](opsx.md) | İş akışının neden aşama kilidi yerine akıcı olduğu ve mimari derinlemesine inceleme |
| [Glossary](glossary.md) | Tanımlanan her terim tek bir yerde |

### Kendinize uyarlayın

| Doc | Size ne sağlıyor |
|-----|-------------------|
| [Customization](customization.md) | Proje yapılandırması, özel şemalar, paylaşılan bağlam |
| [Multi-Language](multi-language.md) | İngilizce dışındaki dillerde çıktı (artifact) oluşturma |
| [Supported Tools](supported-tools.md) | OpenSpec'in entegre olduğu 25+ yapay zeka aracı ve dosyaların nereye düştüğü |

### Yardım gerektiğinde

| Doc | Size ne sağlıyor |
|-----|-------------------|
| [FAQ](faq.md) | İnsanların en çok sorduğu sorulara hızlı yanıtlar |
| [Troubleshooting](troubleshooting.md) | Somut hatalar için somut çözümler |
| [Migration Guide](migration-guide.md) | Eski iş akışından OPSX'e geçiş |

### Depolar arasında koordinasyon (beta)

| Doc | Size ne sağlıyor |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | Çalışmanız depolar veya ekipler arasında yayılıyorsa kendi deposunda planlama |
| [Agent Contract](agent-contract.md) | Ajanların yönlendirdiği makine tarafından okunabilen CLI yüzeyleri |

## Otuz Saniyelik Versiyon

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in your AI chat)  /opsx:explore           ← isteğe bağlı, ama harika bir alışkanlık
4. Propose        (in your AI chat)  /opsx:propose add-dark-mode
5. Build          (in your AI chat)  /opsx:apply
6. Archive        (in your AI chat)  /opsx:archive
```

Adım 1 ve 2 terminalinizde gerçekleşir. Geri kalanı Yapay Zeka asistanınızın sohbetinde gerçekleşir. Bu ayrım akılda tutulması gereken tek şeydir ve [How Commands Work](how-commands-work.md) tam olarak nedenini açıklar. Adım 3 isteğe bağlıdır, ancak emin olmadığınız bir durumda `/opsx:explore` ile başlamak en çok fayda sağlayan alışkanlıktır.

## Nereden daha yardım alabilirsiniz?

- **Discord:** Sorular, fikirler ve yardım için [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC).
- **GitHub Issues:** Hatalar ve özellik istekleri için [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues).
- **`openspec feedback "mesajınız"`** geri bildirimi doğrudan terminalinizden gönderir (bir GitHub sorusu açar).

Bu dokümanlarda yanlış, eskimiş veya kafa karıştırıcı bir şey mi buldunuz? Bu bir hatadır. Bir sorun veya PR açın. Dokümantasyon iyileştirmeleri yapabileceğiniz en değerli katkılardan bazılarıdır.