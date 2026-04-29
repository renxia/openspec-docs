---
layout: home

hero:
  name: "OpenSpec"
  text: "Yapay Zeka Asistanları İçin Belirtme Tabanlı Geliştirme"
  tagline: Yapay zeka asistanı projelerini oluşturmak ve yönetmek için hafif bir belirtme.
  actions:
    - theme: brand
      text: Başlayın
      link: ./getting-started
    - theme: alt
      text: Ana Sayfa
      link: /

features:
  - title: Belirtme-Öncelikli İş Akışı
    details: Kod yazmadan önce gereksinimleri tanımlayın.
  - title: Yapay Zeka Yerli Tasarım
    details: Claude Code, Cursor, Windsurf ve daha fazlası için oluşturuldu.
  - title: Çoklu Dil
    details: Dokümantasyon birden fazla dilde mevcuttur.
---


<details>
<summary><strong>En çok sevilen belirtme çerçevesi.</strong></summary>

[![Stars](https://img.shields.io/github/stars/Fission-AI/OpenSpec?style=flat-square&label=Stars)](https://github.com/Fission-AI/OpenSpec/stargazers)
[![Downloads](https://img.shields.io/npm/dm/@fission-ai/openspec?style=flat-square&label=Downloads/mo)](https://www.npmjs.com/package/@fission-ai/openspec)
[![Contributors](https://img.shields.io/github/contributors/Fission-AI/OpenSpec?style=flat-square&label=Contributors)](https://github.com/Fission-AI/OpenSpec/graphs/contributors)

</details>
<p></p>
Felsefemiz:

```text
→ akıcı, katı değil
→ yinelemeli, şelale değil
→ kolay, karmaşık değil
→ sadece yeşil alan için değil, kahverengi alan için de oluşturuldu
→ kişisel projelerden kurumsal projelere kadar ölçeklenebilir
```

> [!TIP]
> **Yeni iş akışı artık mevcut!** OpenSpec'i yeni bir eser yönlendirmeli iş akışıyla yeniden oluşturduk.
>
> Başlamak için `/opsx:propose "fikriniz"` komutunu çalıştırın. → [Buradan daha fazla bilgi edinin](opsx.md)

<p align="center">
  Güncellemeler için <a href="https://x.com/0xTab">@0xTab'ı X'te takip edin</a> · Yardım ve sorular için <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord'una katılın</a>.
</p>

<!-- TODO: /opsx:propose → /opsx:archive iş akışının GIF demosunu ekle -->

## Kullanımını görün

```text
Siz: /opsx:propose add-dark-mode
YZ:  openspec/changes/add-dark-mode/ oluşturuldu
     ✓ proposal.md — bunu neden yapıyoruz, ne değişiyor
     ✓ specs/       — gereksinimler ve senaryolar
     ✓ design.md    — teknik yaklaşım
     ✓ tasks.md     — uygulama kontrol listesi
     Uygulamaya hazır!

Siz: /opsx:apply
YZ:  Görevler uygulanıyor...
     ✓ 1.1 Tema bağlam sağlayıcısı ekle
     ✓ 1.2 Toggle bileşeni oluştur
     ✓ 2.1 CSS değişkenleri ekle
     ✓ 2.2 localStorage'ı bağla
     Tüm görevler tamamlandı!

Siz: /opsx:archive
YZ:  openspec/changes/archive/2025-01-23-add-dark-mode/ arşivlendi
     Belirtmeler güncellendi. Bir sonraki özellik için hazır.
```

<details>
<summary><strong>OpenSpec Kontrol Paneli</strong></summary>

</details>

## Hızlı Başlangıç

**Node.js 20.19.0 veya üzeri gerektirir.**

OpenSpec'i globally yükleyin:

```bash
npm install -g @fission-ai/openspec@latest
```

Ardından proje dizinize gidin ve başlatın:

```bash
cd your-project
openspec init
```

Şimdi yapay zeka asistanınıza şunu söyleyin: `/opsx:propose <ne-inşa-etmek-istediğiniz>`

Genişletilmiş iş akışını (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`) istiyorsanız, `openspec config profile` ile seçin ve `openspec update` ile uygulayın.

> [!NOTE]
> Aracınızın desteklenip desteklenmediğinden emin değil misiniz? [Tam listeyi görüntüleyin](supported-tools.md) – 25'ten fazla aracı destekliyoruz ve sayısı artıyor.
>
> Ayrıca pnpm, yarn, bun ve nix ile çalışır. [Kurulum seçeneklerini görün](installation.md).

## Dokümantasyon

→ **[Başlangıç](getting-started.md)**: ilk adımlar<br>
→ **[İş Akışları](workflows.md)**: kombinasyonlar ve kalıplar<br>
→ **[Komutlar](commands.md)**: eğik çizgi komutları ve beceriler<br>
→ **[CLI](cli.md)**: terminal referansı<br>
→ **[Desteklenen Araçlar](supported-tools.md)**: araç entegrasyonları ve kurulum yolları<br>
→ **[Kavramlar](concepts.md)**: her şey nasıl bir araya geliyor<br>
→ **[Çoklu Dil](multi-language.md)**: çoklu dil desteği<br>
→ **[Özelleştirme](customization.md)**: kendinize göre ayarlayın


## Neden OpenSpec?

Yapay zeka kodlama asistanları güçlüdür, ancak gereksinimler yalnızca sohbet geçmişinde yaşadığında öngörülemez olabilir. OpenSpec, herhangi bir kod yazılmadan önce neyi inşa edeceğiniz konusunda anlaşmanız için hafif bir belirtme katmanı ekler.

- **İnşa etmeden önce anlaşın** — insan ve yapay zeka, kod yazılmadan önce belirtmeler üzerinde hemfikir olur
- **Düzenli kalın** — her değişiklik, teklif, belirtme, tasarım ve görevlerle kendi klasörünü alır
- **Akıcı çalışın** — herhangi bir eseri istediğiniz zaman güncelleyin, katı aşama kapıları yok
- **Araçlarınızı kullanın** — eğik çizgi komutları aracılığıyla 20'den fazla yapay zeka asistanıyla çalışır

### Nasıl karşılaştırılırız

**[Spec Kit](https://github.com/github/spec-kit)** (GitHub) ile karşılaştırıldığında — Kapsamlı ama ağır. Katı aşama kapıları, çok fazla Markdown, Python kurulumu. OpenSpec daha hafiftir ve özgürce yinelemenize olanak tanır.

**[Kiro](https://kiro.dev)** (AWS) ile karşılaştırıldığında — Güçlü ama kendi IDE'sine kilitlenirsiniz ve yalnızca Claude modelleriyle sınırlıdır. OpenSpec, zaten kullandığınız araçlarla çalışır.

**Hiçbiriyle karşılaştırıldığında** — Belirtmesiz yapay zeka kodlama, belirsiz istemler ve öngörülemeyen sonuçlar demektir. OpenSpec, törensiz bir şekilde öngörülebilirlik getirir.

## OpenSpec'i Güncelleme

**Paketi yükseltin**

```bash
npm install -g @fission-ai/openspec@latest

**Ajan talimatlarını yenileyin**

Her projenin içinde çalıştırarak yapay zeka rehberliğini yeniden oluşturun ve en son eğik çizgi komutlarının etkin olduğundan emin olun:

```bash
openspec update
```

## Kullanım Notları

**Model seçimi**: OpenSpec, yüksek akıl yürütmeli modellerle en iyi şekilde çalışır. Hem planlama hem de uygulama için Opus 4.5 ve GPT 5.2'yi öneriyoruz.

**Bağlam hijyeni**: OpenSpec, temiz bir bağlam penceresinden faydalanır. Uygulamaya başlamadan önce bağlamınızı temizleyin ve oturumunuz boyunca iyi bağlam hijyeni koruyun.

## Katkıda Bulunma

**Küçük düzeltmeler** — Hata düzeltmeleri, yazım hatası düzeltmeleri ve küçük iyileştirmeler doğrudan PR olarak gönderilebilir.

**Daha büyük değişiklikler** — Yeni özellikler, önemli yeniden düzenlemeler veya mimari değişiklikler için lütfen önce bir OpenSpec değişiklik teklifi gönderin, böylece uygulama başlamadan önce niyet ve hedefler üzerinde hemfikir olabiliriz.

Teklif yazarken OpenSpec felsefesini aklınızda bulundurun: farklı kodlama ajanları, modeller ve kullanım durumları genelinde çok çeşitli kullanıcılara hizmet ediyoruz. Değişiklikler herkes için iyi çalışmalıdır.

**Yapay zeka tarafından üretilen kod hoştur** — test edilmiş ve doğrulanmış olduğu sürece. Yapay zeka tarafından üretilen kod içeren PR'lar, kullanılan kodlama ajanını ve modeli belirtmelidir (örneğin, "claude-opus-4-5-20251101 kullanılarak Claude Code ile oluşturuldu").

### Geliştirme

- Bağımlılıkları yükleyin: `pnpm install`
- Derleyin: `pnpm run build`
- Test edin: `pnpm test`
- CLI'yı yerel olarak geliştirin: `pnpm run dev` veya `pnpm run dev:cli`
- Geleneksel提交ler (tek satır): `type(scope): subject`

## Diğer

<details>
<summary><strong>Telemetri</strong></summary>

OpenSpec anonim kullanım istatistikleri toplar.

Yalnızca kullanım kalıplarını anlamak için komut adlarını ve sürümü toplar. Argüman, yol, içerik veya kişisel tanımlanabilir bilgi (PII) toplamaz. CI'da otomatik olarak devre dışıdır.

**Devre dışı bırakma:** `export OPENSPEC_TELEMETRY=0` veya `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>Sorumlular ve Danışmanlar</strong></summary>

Projenin yolunu çizmeye yardımcı olan çekirdek sorumlular ve danışmanların listesi için [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) dosyasına bakın.

</details>



## Lisans

MIT