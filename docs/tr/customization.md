# Özelleştirme

OpenSpec üç düzeyde özelleştirme sunar:

| Düzey | Ne işe yarar | Kimler için en uygun |
|-------|--------------|----------------------|
| **Proje Yapılandırması** | Varsayılanları ayarlar, bağlam/kurallar ekler | Çoğu ekip |
| **Özel Şemalar** | Kendi iş akışı kalıplarınızı tanımlarsınız | Benzersiz süreçleri olan ekipler |
| **Genel Geçersiz Kılmalar** | Şemaları tüm projeler arasında paylaşır | Güç kullanıcıları |

---

## Proje Yapılandırması

`openspec/config.yaml` dosyası, ekibiniz için OpenSpec'ı özelleştirmenin en kolay yoludur. Size şunları yapma imkanı tanır:

- **Varsayılan şema ayarla** - Her komutta `--schema` parametresini kullanmayı atla
- **Proje bağlamı ekle** - Yapay zeka teknoloji yığınınızı, kurallarınızı vb. görür
- **Her kalıp için özel kural ekle** - Belirli kalıplar için özel kurallar

### Hızlı Kurulum

```bash
openspec init
```

Bu, yapılandırma oluşturma sürecinde size etkileşimli olarak rehberlik eder. Ya da manuel olarak bir tane oluşturabilirsiniz:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API style: RESTful, documented in docs/api.md
  Testing: Jest + React Testing Library
  We value backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones
```

### Nasıl Çalışır?

**Varsayılan şema:**

```bash
# Yapılandırma olmadan
openspec new change my-feature --schema spec-driven

# Yapılandırma ile - şema otomatiktir
openspec new change my-feature
```

**Bağlam ve kural ekleme:**

Herhangi bir kalıp oluştururken, bağlamınız ve kurallarınız yapay zeka istemine eklenir:

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Include rollback plan
- Identify affected teams
</rules>

<template>
[Schema's built-in template]
</template>
```

- **Bağlam** TÜM kalıplarda görünür
- **Kurallar** SADECE eşleşen kalıpta görünür

### Şema Çözümleme Sırası

OpenSpec bir şemaya ihtiyaç duyduğunda, bu sırayla kontrol eder:

1. CLI bayrağı: `--schema <name>`
2. Değişiklik meta verileri (değişiklik klasöründeki `.openspec.yaml`)
3. Proje yapılandırması (`openspec/config.yaml`)
4. Varsayılan (`spec-driven`)

---

## Özel Şemalar

Proje yapılandırması yeterli olmadığında, tamamen özel bir iş akışıyla kendi şemanızı oluşturun. Özel şemalar projenizin `openspec/schemas/` klasöründe bulunur ve kodunuzla birlikte sürüm kontrolü altında tutulur.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Proje yapılandırması
│   ├── schemas/           # Özel şemalar burada bulunur
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Değişiklikleriniz
└── src/
```

### Mevcut Bir Şemayı Fork'la

Özelleştirme yapmanın en hızlı yolu, yerleşik bir şemayı fork'lamaktır:

```bash
openspec schema fork spec-driven my-workflow
```

Bu, tüm `spec-driven` şemasını `openspec/schemas/my-workflow/` klasörüne kopyalar, burada istediğiniz gibi düzenleyebilirsiniz.

**Elde edeceğiniz şey:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # İş akışı tanımı
└── templates/
    ├── proposal.md       # Teklif kalıbı şablonu
    ├── spec.md           # Şartname şablonu
    ├── design.md         # Tasarım şablonu
    └── tasks.md          # Görev şablonu
```

Şimdi iş akışını değiştirmek için `schema.yaml` dosyasını düzenleyin, ya da yapay zekanın üreteceği içeriği değiştirmek için şablonları düzenleyin.

### Sıfırdan Şema Oluşturma

Tamamen yeni bir iş akışı için:

```bash
# Etkileşimli
openspec schema init research-first

# Etkileşimsiz
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Şema Yapısı

Bir şema, iş akışınızdaki kalıpları ve birbirlerine olan bağımlılıklarını tanımlar:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: My team's custom workflow

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initial proposal document
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Technical design
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal    # Tasarım oluşturmak için önce teklif kalıbının mevcut olması gerekir

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Önemli alanlar:**

| Alan | Amaç |
|------|------|
| `id` | Komutlarda ve kurallarda kullanılan benzersiz tanımlayıcı |
| `generates` | Çıktı dosya adı (`specs/**/*.md` gibi glob desenlerini destekler) |
| `template` | `templates/` klasöründeki şablon dosyası |
| `instruction` | Bu kalıbı oluşturmak için yapay zeka yönergeleri |
| `requires` | Bağımlılıklar - önce mevcut olması gereken kalıplar |

### Şablonlar

Şablonlar, yapay zekaya rehberlik eden markdown dosyalarıdır. İlgili kalıbı oluştururken isteme eklenirler.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Bu değişikliğin gerekçesini açıklayın. Hangi sorunu çözmektedir? -->

## What Changes

<!-- Ne değişeceğini açıklayın. Yeni yetenekler veya değişiklikler konusunda spesifik olun. -->

## Impact

<!-- Etkilenen kod, API'lar, bağımlılıklar, sistemler -->
```

Şablonlar şunları içerebilir:
- Yapay zekanın dolduracağı bölüm başlıkları
- Yapay zeka için rehberlik içeren HTML yorumları
- Beklenen yapıyı gösteren örnek formatlar

### Şemanızı Doğrulayın

Özel bir şema kullanmadan önce doğrulayın:

```bash
openspec schema validate my-workflow
```

Bu kontrolleri yapar:
- `schema.yaml` sözdizimi doğru mu
- Tüm referans verilen şablonlar var mı
- Döngüsel bağımlılık yok mu
- Kalıp kimlikleri geçerli mi

### Özel Şemanızı Kullanın

Oluşturulduktan sonra şemanızı şu şekilde kullanın:

```bash
# Komutta belirtin
openspec new change feature --schema my-workflow

# Ya da config.yaml'da varsayılan olarak ayarlayın
schema: my-workflow
```

### Şema Çözümlemesini Hata Ayıklayın

Hangi şemanın kullanıldığından emin değil misiniz? Şu komutla kontrol edin:

```bash
# Belirli bir şemanın nereden çözümlendiğini görün
openspec schema which my-workflow

# Tüm kullanılabilir şemaları listele
openspec schema which --all
```

Çıktı, şemanın projenizden, kullanıcı dizininden mi yoksa paketten mi geldiğini gösterir:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Not:** OpenSpec ayrıca projeler arasında paylaşım için `~/.local/share/openspec/schemas/` konumunda kullanıcı düzeyinde şemaları da destekler, ancak kodunuzla birlikte sürüm kontrolü altında tutuldukları için `openspec/schemas/` konumundaki proje düzeyinde şemalar önerilir.

---

## Örnekler

### Hızlı İterasyon İş Akışı

Hızlı iterasyonlar için minimalist bir iş akışı:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Quick proposal
    template: proposal.md
    instruction: |
      Create a brief proposal for this change.
      Focus on what and why, skip detailed specs.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### İnceleme Kalıbı Ekleme

Varsayılanı fork'layın ve bir inceleme adımı ekleyin:

```bash
openspec schema fork spec-driven with-review
```

Ardından eklemek için `schema.yaml` dosyasını düzenleyin:

```yaml
  - id: review
    generates: review.md
    description: Pre-implementation review checklist
    template: review.md
    instruction: |
      Create a review checklist based on the design.
      Include security, performance, and testing considerations.
    requires:
      - design

  - id: tasks
    # ... mevcut görev yapılandırması ...
    requires:
      - specs
      - design
      - review    # Artık görevler için inceleme de gerekli
```

---

## Topluluk Şemaları

OpenSpec ayrıca bağımsız depolar aracılığıyla dağıtılan topluluk tarafından bakılan şemaları da destekler. Bu şemalar, OpenSpec'ı diğer araçlar veya sistemlerle entegre eden, fikir beyan eden iş akışları sunar. Bu, [github/spec-kit topluluk uzantı kataloğunun](https://github.com/github/spec-kit/tree/main/extensions) spec-kit için çalışma şekline benzer şekildedir.

Topluluk şemaları OpenSpec çekirdeğine dahil edilmez — kendi yayınlama döngüleri olan kendi depolarında bulunurlar. Birini kullanmak için şema paketini projenizin `openspec/schemas/<şema-adı>/` klasörüne kopyalayın (her deponun README dosyasında kurulum yönergeleri bulunur).

| Şema | Sorumlu Kişi | Depo | Açıklama |
|------|--------------|------|----------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | OpenSpec'ın kalıp yönetişimini [obra/superpowers](https://github.com/obra/superpowers) yürütme becerileri ( beyin fırtınası, plan yazma, alt aracılar aracılığıyla TDD, kod incelemesi, tamamlama) ile entegre eder. Superpowers'in doğrudan desteklemediği bir boşluğu dolduran kanıt öncelikli `retrospective` kalıbı ekler. |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | PM öncelikli iş akışı. Uygulama öncesinde [nanopm](https://github.com/nmrtn/nanopm)'ın planlama hattını (denetim → strateji → yol haritası → PRD) çalıştırır. Ürün planlamasını OpenSpec'ın şartname odaklı mühendislik iş akışına köprüyler. Eğer `.nanopm/` klasörü mevcutsa kalıplar oradan okunur: teklif kalıbı denetimi kaynağı olarak, tasarım stratejiyi, görevler PRD ayrıştırmasını kaynak olarak kullanır. |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | Yetenek düzeyinde uçtan uca test çalışma kitapçıkları. Her yetenek için değiştirilemez bir şartname, değiştirilemez bir görev şablonu ve her çalıştırma için bir zaman damgalı çalıştırma kaydı alır. İddialar sadece gözlemlenebilir davranıştır (HTTP durumu, yanıt gövdesi, kalıcı durum — asla log alt dizeleri değil); her çalıştırma başlangıç/bitiş UTC, süre ve en iyi tahmin LLM jeton tüketimi kaydeder. |

> Topluluk şeması katkıda bulunmak ister misiniz? Deponuza bir bağlantı ekleyerek bir konu açın, ya da bu tabloya bir satır ekleyerek bir PR gönderin.

---

## Ayrıca Bakınız

- [CLI Referansı: Şema Komutları](cli.md#schema-commands) - Tam komut belgelendirmesi