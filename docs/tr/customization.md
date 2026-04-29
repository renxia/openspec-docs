# Özelleştirme

OpenSpec üç düzeyde özelleştirme sunar:

| Düzey | Ne yapar | En iyi kullanım alanı |
|-------|----------|----------------------|
| **Proje Yapılandırması** | Varsayılanları ayarla, bağlam/kurallar ekle | Çoğu ekip |
| **Özel Şemalar** | Kendi iş akışı varlıklarınızı tanımlayın | Benzersiz süreçlere sahip ekip |
| **Küresel Geçersiz Kılmalar** | Şemaları tüm projeler arasında paylaşın | Güçlü kullanıcılar |

---

## Proje Yapılandırması

`openspec/config.yaml` dosyası, OpenSpec'i ekibiniz için özelleştirmenin en kolay yoludur. Şunları yapmanızı sağlar:

- **Varsayılan bir şema ayarlayın** - Her komutta `--schema` seçeneğini atlayın
- **Proje bağlamı ekleyin** - Yapay zeka teknoloji yığınınızı, kurallarınızı vb. görsün
- **Varlık başına kurallar ekleyin** - Belirli varlıklar için özel kurallar

### Hızlı Kurulum

```bash
openspec init
```

Bu, size interaktif olarak bir yapılandırma oluşturmada rehberlik eder. Veya manuel olarak bir tane oluşturun:

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

### Nasıl Çalışır

**Varsayılan şema:**

```bash
# Yapılandırma olmadan
openspec new change my-feature --schema spec-driven

# Yapılandırmayla - şema otomatik
openspec new change my-feature
```

**Bağlam ve kural ekleme:**

Herhangi bir varlık oluştururken, bağlamınız ve kurallarınız yapay zeka istemine eklenir:

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

- **Bağlam** TÜM varlıklarda görünür
- **Kurallar** SADECE eşleşen varlık için görünür

### Şema Çözümleme Sırası

OpenSpec'in bir şemaya ihtiyacı olduğunda, şu sırayla kontrol eder:

1. CLI bayrağı: `--schema <adı>`
2. Değişiklik meta verisi (değişiklik klasöründeki `.openspec.yaml`)
3. Proje yapılandırması (`openspec/config.yaml`)
4. Varsayılan (`spec-driven`)

---

## Özel Şemalar

Proje yapılandırması yeterli olmadığında, tamamen özel bir iş akışıyla kendi şemanızı oluşturun. Özel şemalar projenizin `openspec/schemas/` dizininde bulunur ve kodunuzla birlikte sürüm kontrolüne tabi tutulur.

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

### Mevcut Bir Şemayı Çatallayın

Özelleştirmenin en hızlı yolu, yerleşik bir şemayı çatallamaktır:

```bash
openspec schema fork spec-driven my-workflow
```

Bu, `spec-driven` şemasının tamamını `openspec/schemas/my-workflow/` dizinine kopyalar; burada serbestçe düzenleyebilirsiniz.

**Elde ettikleriniz:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # İş akışı tanımı
└── templates/
    ├── proposal.md       # Öneri varlığı için şablon
    ├── spec.md           # Teknik özellikler için şablon
    ├── design.md         # Tasarım için şablon
    └── tasks.md          # Görevler için şablon
```

Şimdi iş akışını değiştirmek için `schema.yaml`'ı düzenleyin veya yapay zekanın ne oluşturduğunu değiştirmek için şablonları düzenleyin.

### Sıfırdan Bir Şema Oluşturun

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

Bir şema, iş akışınızdaki varlıkları ve bunların birbirine nasıl bağımlı olduğunu tanımlar:

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
      - proposal    # Can't create design until proposal exists

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

**Temel alanlar:**

| Alan | Amaç |
|------|------|
| `id` | Komutlarda ve kurallarda kullanılan benzersiz tanımlayıcı |
| `generates` | Çıktı dosya adı (glob desenleri destekler, örneğin `specs/**/*.md`) |
| `template` | `templates/` dizinindeki şablon dosyası |
| `instruction` | Bu varlığı oluşturmak için yapay zeka talimatları |
| `requires` | Bağımlılıklar - önce hangi varlıkların var olması gerektiği |

### Şablonlar

Şablonlar, yapay zekaya rehberlik eden markdown dosyalarıdır. O varlık oluşturulurken isteme eklenirler.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

Şablonlar şunları içerebilir:
- Yapay zekanın doldurması gereken bölüm başlıkları
- Yapay zeka için yönlendirme içeren HTML yorumları
- Beklenen yapının gösterildiği örnek formatlar

### Şemanızı Doğrulayın

Özel bir şema kullanmadan önce, onu doğrulayın:

```bash
openspec schema validate my-workflow
```

Bu şunları kontrol eder:
- `schema.yaml` sözdizimi doğrudur
- Tüm referans verilen şablonlar mevcuttur
- Döngüsel bağımlılık yoktur
- Varlık ID'leri geçerlidir

### Özel Şemanızı Kullanın

Oluşturulduktan sonra, şemanızı şu şekilde kullanın:

```bash
# Komutta belirtin
openspec new change feature --schema my-workflow

# Veya config.yaml'da varsayılan olarak ayarlayın
schema: my-workflow
```

### Şema Çözümlemeyi Hata Ayıklayın

Hangi şemanın kullanıldığından emin değil misiniz? Şu komutla kontrol edin:

```bash
# Belirli bir şemanın nereden çözüldüğünü görün
openspec schema which my-workflow

# Mevcut tüm şemaları listeleyin
openspec schema which --all
```

Çıktı, şemanın projenizden, kullanıcı dizininden mi yoksa paketten mi geldiğini gösterir:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Not:** OpenSpec ayrıca projeler arasında paylaşım için `~/.local/share/openspec/schemas/` konumunda kullanıcı düzeyinde şemaları da destekler, ancak projeler arası paylaşım için `openspec/schemas/` içindeki proje düzeyindeki şemalar önerilir çünkü bunlar kodunuzla birlikte sürüm kontrolüne tabi tutulur.

---

## Örnekler

### Hızlı Iterasyon İş Akışı

Hızlı iterasyonlar için minimal bir iş akışı:

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

### Bir İnceleme Varlığı Ekleme

Varsayılanı çatallayın ve bir inceleme adımı ekleyin:

```bash
openspec schema fork spec-driven with-review
```

Ardından `schema.yaml`'ı düzenleyerek şunu ekleyin:

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
    # ... existing tasks config ...
    requires:
      - specs
      - design
      - review    # Now tasks require review too
```

---

## Ayrıca Bakınız

- [CLI Referansı: Şema Komutları](cli.md#schema-commands) - Tam komut belgeleri