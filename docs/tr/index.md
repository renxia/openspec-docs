---
layout: home

hero:
  name: "OpenSpec"
  text: "Yapay Zeka Asistanları için Spesifikasyon Odaklı Geliştirme"
  tagline: Yapay zeka asistanı projeleri oluşturmak ve yönetmek için hafif bir spesifikasyon.
  actions:
    - theme: brand
      text: Başlarken
      link: ./getting-started
    - theme: alt
      text: Ana Sayfa
      link: /

features:
  - title: Spesifikasyon Odaklı İş Akışı
    details: Kod yazmadan önce gereksinimleri tanımlayın.
  - title: Yapay Zeka Doğal Tasarım
    details: Claude Code, Cursor, Windsurf ve daha fazlası için oluşturuldu.
  - title: Çoklu Dil
    details: Belgeler birden fazla dilde mevcuttur.
---


Felsefemiz:

```text
→ akıcı, katı değil
→ yinelemeli, şelale değil
→ kolay, karmaşık değil
→ sadece sıfırdan değil, mevcut projeler için de uygun
→ kişisel projelerden kurumsal ölçeklere kadar genişletilebilir
```

> [!TIP]
> **Yeni iş akışı artık kullanılabilir!** OpenSpec'i yeni bir yapıt odaklı iş akışıyla yeniden oluşturduk.
>
> Başlamak için `/opsx:propose "fikriniz"` komutunu çalıştırın. → [Buradan daha fazlasını öğrenin](opsx.md)

<p align="center">
  Güncellemeler için <a href="https://x.com/0xTab">@0xTab'ı X'te</a> takip edin · Yardım ve sorular için <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord</a>'una katılın.
</p>

## Eylem halinde görün

```text
Siz: /opsx:propose add-dark-mode
YZ:  openspec/changes/add-dark-mode/ oluşturuldu
     ✓ proposal.md — neden bunu yapıyoruz, ne değişiyor
     ✓ specs/       — gereksinimler ve senaryolar
     ✓ design.md    — teknik yaklaşım
     ✓ tasks.md     — uygulama kontrol listesi
     Uygulamaya hazır!

Siz: /opsx:apply
YZ:  Görevler uygulanıyor...
     ✓ 1.1 Tema bağlam sağlayıcısı ekle
     ✓ 1.2 Geçiş bileşeni oluştur
     ✓ 2.1 CSS değişkenleri ekle
     ✓ 2.2 localStorage'ı bağla
     Tüm görevler tamamlandı!

Siz: /opsx:archive
YZ:  openspec/changes/archive/2025-01-23-add-dark-mode/ konumuna arşivlendi
     Spesifikasyonlar güncellendi. Sonraki özellik için hazır.
```

<details>
<summary><strong>OpenSpec Gösterge Paneli</strong></summary>
</details>

## Hızlı Başlangıç

**Node.js 20.19.0 veya üzeri gerektirir.**

OpenSpec'i global olarak yükleyin:

```bash
npm install -g @fission-ai/openspec@latest
```

Ardından proje dizinine gidin ve başlatın:

```bash
cd your-project
openspec init
```

Şimdi yapay zekanıza şunu söyleyin: `/opsx:propose <ne-inşa-etmek-istediğiniz>`

Genişletilmiş iş akışını (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`) istiyorsanız, `openspec config profile` ile seçin ve `openspec update` ile uygulayın.

> [!NOTE]
> Aracınızın desteklenip desteklenmediğinden emin değil misiniz? [Tam listeyi görüntüleyin](supported-tools.md) – 25'ten fazla aracı destekliyoruz ve bu sayı artıyor.
>
> Ayrıca pnpm, yarn, bun ve nix ile de çalışır. [Yükleme seçeneklerini görün](installation.md).

## Belgeler

→ **[Başlarken](getting-started.md)**: ilk adımlar<br>
→ **[İş Akışları](workflows.md)**: kombinasyonlar ve kalıplar<br>
→ **[Komutlar](commands.md)**: eğik çizgi komutları ve beceriler<br>
→ **[CLI](cli.md)**: terminal referansı<br>
→ **[Desteklenen Araçlar](supported-tools.md)**: araç entegrasyonları ve yükleme yolları<br>
→ **[Kavramlar](concepts.md)**: nasıl bir araya geliyor<br>
→ **[Çoklu Dil](multi-language.md)**: çoklu dil desteği<br>
→ **[Özelleştirme](customization.md)**: kendinize göre ayarlayın


## Neden OpenSpec?

Yapay zeka kodlama asistanları güçlüdür, ancak gereksinimler yalnızca sohbet geçmişinde yaşadığında öngörülemezdir. OpenSpec, herhangi bir kod yazılmadan önce ne inşa edeceğiniz konusunda anlaşmanız için hafif bir spesifikasyon katmanı ekler.

- **İnşa etmeden önce anlaşın** — insan ve yapay zeka, kod yazılmadan önce spesifikasyonlar üzerinde uzlaşır
- **Düzenli kalın** — her değişiklik kendi klasöründe teklif, spesifikasyonlar, tasarım ve görevlerle birlikte gelir
- **Akıcı çalışın** — herhangi bir yapiti istediğiniz zaman güncelleyin, katı aşama kapıları yok
- **Araçlarınızı kullanın** — eğik çizgi komutları aracılığıyla 20'den fazla yapay zeka asistanıyla çalışır

### Nasıl karşılaştırıyoruz

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Kapsamlı ama ağır. Katı aşama kapıları, çok fazla Markdown, Python kurulumu. OpenSpec daha hafiftir ve özgürce yineleme yapmanızı sağlar.

**vs. [Kiro](https://kiro.dev)** (AWS) — Güçlü ama kendi IDE'lerine kilitleniyorsunuz ve yalnızca Claude modelleriyle sınırlısınız. OpenSpec zaten kullandığınız araçlarla çalışır.

**vs. hiçbir şey** — Spesifikasyonlar olmadan yapay zeka kodlama, belirsiz istemler ve öngörülemeyen sonuçlar anlamına gelir. OpenSpec, törensizlikle birlikte öngörülebilirlik getirir.

## OpenSpec'i Güncelleme

**Paketi yükseltin**

```bash
npm install -g @fission-ai/openspec@latest
```

**Ajan talimatlarını yenileyin**

Yapay zeka yönlendirmesini yeniden oluşturmak ve en son eğik çizgi komutlarının aktif olduğundan emin olmak için her projede bunu çalıştırın:

```bash
openspec update
```

## Kullanım Notları

**Model seçimi**: OpenSpec, yüksek mantık yürütme kapasitesine sahip modellerle en iyi şekilde çalışır. Hem planlama hem de uygulama için Opus 4.5 ve GPT 5.2'yi öneriyoruz.

**Bağlam hijyeni**: OpenSpec, temiz bir bağlam penceresinden faydalanır. Uygulamaya başlamadan önce bağlamınızı temizleyin ve oturumunuz boyunca iyi bir bağlam hijyeni sağlayın.

## Katkıda Bulunma

**Küçük düzeltmeler** — Hata düzeltmeleri, yazım hataları ve küçük iyileştirmeler doğrudan PR olarak gönderilebilir.

**Daha büyük değişiklikler** — Yeni özellikler, önemli yeniden düzenlemeler veya mimari değişiklikler için lütfen önce bir OpenSpec değişiklik teklifi gönderin, böylece uygulamaya başlamadan önce amaç ve hedefler üzerinde uzlaşabiliriz.

Teklifleri yazarken OpenSpec felsefesini aklınızda bulundurun: farklı kodlama ajanları, modeller ve kullanım durumları genelinde çok çeşitli kullanıcılara hizmet ediyoruz. Değişiklikler herkes için iyi çalışmalıdır.

**Yapay zeka tarafından üretilen kod memnuniyetle karşılanır** — test edildiği ve doğrulandığı sürece. Yapay zeka tarafından üretilen kod içeren PR'ler, kullanılan kodlama ajanını ve modeli belirtmelidir (ör. "claude-opus-4-5-20251101 kullanılarak Claude Code ile oluşturuldu").

### Geliştirme

- Bağımlılıkları yükleyin: `pnpm install`
- Derleyin: `pnpm run build`
- Test edin: `pnpm test`
- CLI'yi yerel olarak geliştirin: `pnpm run dev` veya `pnpm run dev:cli`
- Geleneksel commit'ler (tek satır): `type(scope): subject`

## Diğer

<details>
<summary><strong>Telemetri</strong></summary>

OpenSpec anonim kullanım istatistikleri toplar.

Yalnızca kullanım kalıplarını anlamak için komut adlarını ve sürümü topluyoruz. Argümanlar, yollar, içerik veya PII yoktur. CI'da otomatik olarak devre dışı bırakılır.

**Devre dışı bırakma:** `export OPENSPEC_TELEMETRY=0` veya `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>Bakımcılar ve Danışmanlar</strong></summary>

Projeye rehberlik eden çekirdek bakımcılar ve danışmanların listesi için [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md)'ye bakın.

</details>



## Lisans

MIT