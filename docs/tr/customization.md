# Özelleştirme

OpenSpec üç düzeyde özelleştirme sunar:

| Düzey | Ne yapar | En uygun olan |
|-------|----------|---------------|
| **Proje Yapılandırması** | Varsayılanları ayarlayın, bağlam/kurallar ekleyin | Çoğu ekip |
| **Özel Şemalar** | Kendi iş akışı eserlerinizi tanımlayın | Benzersiz süreçlere sahip ekipler |
| **Genel Geçersiz Kılmalar** | Şemaları tüm projelerde paylaşın | Güçlü kullanıcılar |

---

## Proje Yapılandırması

`openspec/config.yaml` dosyası, OpenSpec'i ekibiniz için özelleştirmenin en kolay yoludur. Bu dosya şunları yapmanızı sağlar:

- **Varsayılan bir şema ayarlayın** - Her komutta `--schema` atlayın
- **Proje bağlamı ekleyin** - AI teknoloji yığınınızı, kurallarınızı vb. görür
- **Eser başına kurallar ekleyin** - Belirli eserler için özel kurallar

### Hızlı Kurulum

```bash
openspec init
```

Bu, interaktif olarak bir yapılandırma oluşturmanıza rehberlik eder. Veya manuel olarak oluşturun:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Teknoloji yığını: TypeScript, React, Node.js, PostgreSQL
  API stili: RESTful, docs/api.md'de belgelenmiş
  Test: Jest + React Testing Library
  Tüm genel API'ler için geriye dönük uyumluluğa değer veriyoruz

rules:
  proposal:
    - Geri alma planı ekleyin
    - Etkilenen ekipleri belirleyin
  specs:
    - Given/When/Then formatını kullanın
    - Yeni kalıplar icat etmeden önce mevcut kalıplara atıfta bulunun
```

### Nasıl Çalışır

**Varsayılan şema:**

```bash
# Yapılandırma olmadan
openspec new change my-feature --schema spec-driven

# Yapılandırma ile - şema otomatiktir
openspec new change my-feature
```

**Bağlam ve kuralların eklenmesi:**

Herhangi bir eser oluşturulurken, bağlamınız ve kurallarınız AI istemine eklenir:

```xml
<context>
Teknoloji yığını: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Geri alma planı ekleyin
- Etkilenen ekipleri belirleyin
</rules>

<template>
[Şemanın yerleşik şablonu]
</template>
```

- **Bağlam** TÜM eserlerde görünür
- **Kurallar** SADECE eşleşen eser için görünür

### Şema Çözümleme Sırası

OpenSpec bir şemaya ihtiyaç duyduğunda, şu sırayla kontrol eder:

1. CLI bayrağı: `--schema <name>`
2. Değişiklik meta verisi (değişiklik klasöründeki `.openspec.yaml`)
3. Proje yapılandırması (`openspec/config.yaml`)
4. Varsayılan (`spec-driven`)

---

## Özel Şemalar

Proje yapılandırması yeterli olmadığında, tamamen özel bir iş akışıyla kendi şemanızı oluşturun. Özel şemalar, projenizin `openspec/schemas/` dizininde yaşar ve kodunuzla birlikte sürüm kontrolüne tabi tutulur.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Proje yapılandırması
│   ├── schemas/           # Özel şemalar burada yaşar
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Değişiklikleriniz
└── src/
```

### Mevcut Bir Şemayı Çatallayın

Özelleştirmenin en hızlı yolu, yerleşik bir şemayı çatallamaktır:

```bash
openspec schema fork spec-driven my-workflow
```

Bu, tüm `spec-driven` şemasını `openspec/schemas/my-workflow/` dizinine kopyalar ve burada serbestçe düzenleyebilirsiniz.

**Neler elde edersiniz:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # İş akışı tanımı
└── templates/
    ├── proposal.md       # Teklif eseri için şablon
    ├── spec.md           # Spesifikasyonlar için şablon
    ├── design.md         # Tasarım için şablon
    └── tasks.md          # Görevler için şablon
```

Şimdi iş akışını değiştirmek için `schema.yaml` dosyasını düzenleyin veya AI'nın oluşturduklarını değiştirmek için şablonları düzenleyin.

### Sıfırdan Şema Oluşturun

Tamamen yeni bir iş akışı için:

```bash
# İnteraktif
openspec schema init research-first

# İnteraktif olmayan
openspec schema init rapid \
  --description "Hızlı yineleme iş akışı" \
  --artifacts "proposal,tasks" \
  --default
```

### Şema Yapısı

Bir şema, iş akışınızdaki eserleri ve bunların birbirlerine nasıl bağımlı olduğunu tanımlar:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: Ekibimin özel iş akışı

artifacts:
  - id: proposal
    generates: proposal.md
    description: İlk teklif belgesi
    template: proposal.md
    instruction: |
      Bu değişikliğe NEDEN ihtiyaç duyulduğunu açıklayan bir teklif oluşturun.
      Çözüme değil, soruna odaklanın.
    requires: []

  - id: design
    generates: design.md
    description: Teknik tasarım
    template: design.md
    instruction: |
      NASIL uygulanacağını açıklayan bir tasarım belgesi oluşturun.
    requires:
      - proposal    # Teklif oluşturulmadan tasarım oluşturulamaz

  - id: tasks
    generates: tasks.md
    description: Uygulama kontrol listesi
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Anahtar alanlar:**

| Alan | Amaç |
|------|------|
| `id` | Benzersiz tanımlayıcı, komutlarda ve kurallarda kullanılır |
| `generates` | Çıktı dosya adı (`specs/**/*.md` gibi glob'ları destekler) |
| `template` | `templates/` dizinindeki şablon dosyası |
| `instruction` | Bu eseri oluşturmak için AI talimatları |
| `requires` | Bağımlılıklar - hangi eserlerin önce mevcut olması gerektiği |

### Şablonlar

Şablonlar, AI'ya rehberlik eden markdown dosyalarıdır. Bu eser oluşturulurken isteme eklenirler.

```markdown
<!-- templates/proposal.md -->
## Neden

<!-- Bu değişikliğin motivasyonunu açıklayın. Bu hangi sorunu çözüyor? -->

## Ne Değişecek

<!-- Ne değişeceğini tanımlayın. Yeni yetenekler veya değişiklikler hakkında spesifik olun. -->

## Etki

<!-- Etkilenen kod, API'ler, bağımlılıklar, sistemler -->
```

Şablonlar şunları içerebilir:
- AI'nın doldurması gereken bölüm başlıkları
- AI için rehberlik içeren HTML yorumları
- Beklenen yapıyı gösteren örnek formatlar

### Şemanızı Doğrulayın

Özel bir şemayı kullanmadan önce doğrulayın:

```bash
openspec schema validate my-workflow
```

Bu şunları kontrol eder:
- `schema.yaml` sözdizimi doğru mu
- Atıfta bulunulan tüm şablonlar mevcut mu
- Döngüsel bağımlılık yok mu
- Eser kimlikleri geçerli mi

### Özel Şemanızı Kullanın

Oluşturulduktan sonra, şemanızı şu şekilde kullanın:

```bash
# Komutta belirtin
openspec new change feature --schema my-workflow

# Veya config.yaml'da varsayılan olarak ayarlayın
schema: my-workflow
```

### Şema Çözümlemesini Hata Ayıklayın

Hangi şemanın kullanıldığından emin değil misiniz? Şununla kontrol edin:

```bash
# Belirli bir şemanın nereden çözümlendiğini görün
openspec schema which my-workflow

# Mevcut tüm şemaları listeleyin
openspec schema which --all
```

Çıktı, projenizden mi, kullanıcı dizininden mi yoksa paketten mi geldiğini gösterir:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Not:** OpenSpec ayrıca projeler arasında paylaşım için `~/.local/share/openspec/schemas/` konumunda kullanıcı düzeyinde şemaları destekler, ancak kodunuzla birlikte sürüm kontrolüne tabi oldukları için `openspec/schemas/` içindeki proje düzeyindeki şemalar önerilir.

---

## Örnekler

### Hızlı Yineleme İş Akışı

Hızlı yinelemeler için minimal bir iş akışı:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Minimum yük ile hızlı yineleme

artifacts:
  - id: proposal
    generates: proposal.md
    description: Hızlı teklif
    template: proposal.md
    instruction: |
      Bu değişiklik için kısa bir teklif oluşturun.
      Ne ve neden olduğuna odaklanın, ayrıntılı spesifikasyonları atlayın.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Uygulama kontrol listesi
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Bir İnceleme Eseri Eklemek

Varsayılanı çatallayın ve bir inceleme adımı ekleyin:

```bash
openspec schema fork spec-driven with-review
```

Ardından `schema.yaml` dosyasını düzenleyerek şunu ekleyin:

```yaml
  - id: review
    generates: review.md
    description: Uygulama öncesi inceleme kontrol listesi
    template: review.md
    instruction: |
      Tasarıma dayalı bir inceleme kontrol listesi oluşturun.
      Güvenlik, performans ve test hususlarını dahil edin.
    requires:
      - design

  - id: tasks
    # ... mevcut görev yapılandırması ...
    requires:
      - specs
      - design
      - review    # Şimdi görevler de inceleme gerektiriyor
```

---

## Topluluk Şemaları

OpenSpec ayrıca bağımsız depolar aracılığıyla dağıtılan topluluk tarafından sürdürülen şemaları da destekler. Bunlar, OpenSpec'i diğer araçlar veya sistemlerle entegre eden, [github/spec-kit'in topluluk uzantı kataloğu](https://github.com/github/spec-kit/tree/main/extensions)'nun spec-kit için çalıştığı şekilde, görüşlü iş akışları sağlar.

Topluluk şemaları OpenSpec çekirdeğine dahil edilmez — kendi depolarında kendi yayın döngüleriyle yaşarlar. Birini kullanmak için, şema paketini projenizin `openspec/schemas/<schema-name>/` dizinine kopyalayın (her deposunun README'sinde kurulum talimatları bulunur).

| Şema | Sorumlu | Depo | Açıklama |
|------|---------|------|----------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | OpenSpec'in eser yönetimini [obra/superpowers](https://github.com/obra/superpowers) yürütme becerileri (beyin fırtınası, plan yazma, alt temsilciler aracılığıyla TDD, kod incelemesi, tamamlama) ile entegre eder. Superpowers'ın yerel olarak kapsamadığı bir boşluğu dolduran kanıt odaklı bir `retrospective` eseri ekler. |

> Bir topluluk şeması katkıda bulunmak ister misiniz? Deponuza bir bağlantı içeren bir sorun açın veya bu tabloya bir satır ekleyen bir PR gönderin.

---

## Ayrıca Bakınız

- [CLI Referansı: Şema Komutları](cli.md#schema-commands) - Komut belgelerinin tamamı