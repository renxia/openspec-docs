# OPSX'e Geçiş

Bu kılavuz, eski OpenSpec iş akışından OPSX'e geçiş yapmanıza yardımcı olur. Geçiş sorunsuz olacak şekilde tasarlanmıştır—mevcut çalışmalarınız korunur ve yeni sistem daha fazla esneklik sunar.

## Ne Değişiyor?

OPSX, eski aşamalı kilitli iş akışını akışkan, eylem temelli bir yaklaşımla değiştirir. İşte temel değişiklik:

| Yön | Eski Sürüm | OPSX |
|--------|--------|------|
| **Komutlar** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Varsayılan: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (genişletilmiş iş akışı komutları isteğe bağlıdır) |
| **İş Akışı** | Tüm yapıtları bir kerede oluştur | Kademeli olarak veya bir kerede oluştur—tercih sizin |
| **Geri Dönüş** | Garip aşama geçitleri | Doğal—istediğiniz zaman herhangi bir yapıtı güncelleyin |
| **Özelleştirme** | Sabit yapı | Şema temelli, tamamen özelleştirilebilir |
| **Yapılandırma** | `CLAUDE.md` (işaretçilerle) + `project.md` | `openspec/config.yaml` içinde temiz yapılandırma |

**Felsefe değişikliği:** İş doğrusal değildir. OPSX, öyle olduğu iddiasında bulunmayı bırakır.

---

## Başlamadan Önce

### Mevcut Çalışmalarınız Güvende

Geçiş süreci, mevcut içeriklerin korunması göz önünde bulundurularak tasarlanmıştır:

- **`openspec/changes/` dizinindeki aktif değişiklikler** — Tamamen korunur. OPSX komutları ile üzerlerinde çalışmaya devam edebilirsiniz.
- **Arşivlenmiş değişiklikler** — Dokunulmaz. Geçmişiniz tamamen korunur.
- **`openspec/specs/` dizinindeki ana spesifikasyonlar** — Dokunulmaz. Bunlar doğru kaynaklarınızdır.
- **CLAUDE.md, AGENTS.md vb. dosyalardaki içerikleriniz** — Korunur. Sadece OpenSpec işaretleyici blokları kaldırılır; yazdığınız her şey kalır.

### Neler Kaldırılıyor

Sadece yerini alan OpenSpec tarafından yönetilen dosyalar kaldırılır:

| Ne | Neden |
|----|-------|
| Eski eğik çizgi komut dizinleri/dosyaları | Yeni beceri (skills) sistemi ile değiştirildi |
| `openspec/AGENTS.md` | Artık kullanılmayan iş akışı tetikleyicisi |
| CLAUDE.md, AGENTS.md vb. dosyalardaki OpenSpec işaretleyicileri | Artık gerekli değil |

**Araçlara göre eski komut konumları** (örnekler—kullandığınız araç farklı olabilir):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (sadece IDE eklentileri; Copilot CLI'de desteklenmez)
- Codex: OpenSpec artık `.codex/skills/openspec-*` kullanır; eski temizlik sadece `$CODEX_HOME/prompts` veya `~/.codex/prompts` dizinindeki OpenSpec'ın izin verilen listesindeki eski Codex istem dosyalarını hedefler ve sadece yerini alan beceri dosyaları mevcut olduktan sonra bunları kaldırır.
- Diğer araçlar (Augment, Continue, Amazon Q vb.)

Geçiş süreci, yapılandırdığınız araçları tespit eder ve bu araçların eski dosyalarını temizler.

Kaldırılacak dosyalar listesi uzun görünebilir, ancak bunların hepsi OpenSpec tarafından başlangıçta oluşturulan dosyalardır. Kendi içerikleriniz asla silinmez.

### Dikkatinize Sunulması Gerekenler

Bir dosya için elle geçiş yapmanız gerekir:

**`openspec/project.md`** — Bu dosya otomatik olarak silinmez çünkü yazdığınız proje bağlamı içerebilir. Şunları yapmanız gerekir:

1. İçeriğini gözden geçirin
2. Yararlı bağlamı `openspec/config.yaml` dosyasına taşıyın (aşağıdaki yönlere bakın)
3. Hazır olduğunuzda dosyayı silin

**Bu değişikliği neden yaptık:**

Eski `project.md` pasifti—ajanlar onu okurdu, okumuyordu, okuduğunu unutuyordu. Güvenilirliğin düzensiz olduğunu gördük.

Yeni `config.yaml` bağlamı **her OpenSpec planlama isteğine aktif olarak eklenir**. Bu, proje kurallarınız, teknoloji yığınız ve kurallarınızın AI artıfact'ları oluştururken her zaman mevcut olması anlamına gelir. Daha yüksek güvenilirlik.

**Uzlaşı:**

Bağlam her isteğe eklendiği için öz olmalısınız. Gerçekten önemli olanlara odaklanın:
- Teknoloji yığını ve temel kurallar
- AI'nın bilmesi gereken açık olmayan kısıtlamalar
- Daha önce sık sık göz ardı edilen kurallar

Mükemmel olmasından endişe etmeyin. Burada neyin en iyi çalıştığını öğreniyoruz ve deneyimlerimizde bağlam ekleme yöntemini iyileştireceğiz.

---

## Geçişi Çalıştırma

Hem `openspec init` hem de `openspec update` komutları eski dosyaları tespit eder ve sizi aynı temizlik sürecinden yönlendirir. Durumunuza uygun olanı kullanın:

- Yeni kurulumlar varsayılan olarak `core` profilini kullanır (`propose`, `explore`, `apply`, `sync`, `archive`).
- Geçiş yapılmış kurulumlar, gerektiğinde `custom` profili yazarak daha önce kurduğunuz iş akışlarını korur.

### `openspec init` Kullanımı

Yeni araçlar eklemek veya kurulu araçları yeniden yapılandırmak istiyorsanız bunu çalıştırın:

```bash
openspec init
```

Init komutu eski dosyaları tespit eder ve sizi temizlik sürecinden yönlendirir:

```
Yeni OpenSpec sürümüne yükseltiliyor

OpenSpec artık kod yazma ajanları arasında ortaklaşa kullanılan standart olan
ajan becerilerini (skills) kullanır. Bu, kurulumunuzu basitleştirirken her şeyi
eskisi gibi çalışır durumda tutar.

Kaldırılacak dosyalar
Korunacak kullanıcı içeriği yok:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Güncellenecek dosyalar
OpenSpec işaretleyicileri kaldırılacak, içeriğiniz korunacak:
  • CLAUDE.md
  • AGENTS.md

Dikkatinize sunulması gerekenler
  • openspec/project.md
    Bu dosyayı silmeyeceğiz. Yararlı proje bağlamı içerebilir.

    Yeni openspec/config.yaml dosyasında planlama bağlamı için bir "context:" bölümü bulunur.
    Bu, eski project.md yaklaşımından daha güvenilir çalışır ve her OpenSpec isteğine dahil edilir.

    project.md dosyasını gözden geçirin, yararlı içeriği config.yaml'ın context bölümüne taşıyın,
    ardından hazır olduğunuzda dosyayı silin.

? Eski dosyaları yükselt ve temizle? (E/h)
```

**Evet derseniz ne olur:**

1. Eski eğik çizgi komut dizinleri kaldırılır
2. `CLAUDE.md`, `AGENTS.md` vb. dosyalardaki OpenSpec işaretleyicileri temizlenir (içeriğiniz kalır)
3. `openspec/AGENTS.md` dosyası silinir
4. Yeni beceriler `.claude/skills/` dizinine kurulur
5. Varsayılan şema ile `openspec/config.yaml` dosyası oluşturulur

### `openspec update` Kullanımı

Sadece geçiş yapmak ve mevcut araçlarınızı en son sürüme yenilemek istiyorsanız bunu çalıştırın:

```bash
openspec update
```

Update komutu da eski artıfact'ları tespit eder ve temizler, ardından mevcut profiliniz ve teslimat ayarlarınızla eşleşmesi için oluşturulan becerileri/komutları yeniler.

### Etkileşimsiz / CI Ortamları

Komut dosyası ile yapılan geçişler için:

```bash
openspec init --force --tools claude
```

`--force` bayrağı, istekleri atlar ve temizliği otomatik olarak kabul eder.

Bu, küresel Codex istem dizinindeki OpenSpec tarafından yönetilen Codex istem dosyalarının temizliğini de içerir. Temizlik sadece OpenSpec'ın izin verilen listesindeki eski Codex istem dosya adlarını hedefler, sadece yerini alan `.codex/skills/openspec-*` becerileri mevcut olduktan sonra bunları kaldırır ve diğer tüm dosyaları korur.

---

## project.md'den config.yaml'a Geçiş

Eski `openspec/project.md` proje bağlamı için serbest biçimli bir markdown dosyasıydı. Yeni `openspec/config.yaml` yapılandırılmıştır ve—kritik olarak—**her planlama isteğine eklenir** böylece AI çalışırken kurallarınız her zaman mevcut olur.

### Önce (project.md)

```markdown
# Project Context

This is a TypeScript monorepo using React and Node.js.
We use Jest for testing and follow strict ESLint rules.
Our API is RESTful and documented in docs/api.md.

## Conventions

- All public APIs must maintain backwards compatibility
- New features should include tests
- Use Given/When/Then format for specifications
```

### Sonra (config.yaml)

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  Testing: Jest with React Testing Library
  API: RESTful, documented in docs/api.md
  We maintain backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan for risky changes
  specs:
    - Use Given/When/Then format for scenarios
    - Reference existing patterns before inventing new ones
  design:
    - Include sequence diagrams for complex flows
```

### Temel Farklılıklar

| project.md | config.yaml |
|------------|-------------|
| Serbest biçimli markdown | Yapılandırılmış YAML |
| Tek bir metin parçası | Ayrı bağlam ve her artıfact için özel kurallar |
| Ne zaman kullanıldığı belirsiz | Bağlam TÜM artıfact'larda görünür; kurallar sadece eşleşen artıfact'larda görünür |
| Şema seçimi yok | Açık `schema:` alanı varsayılan iş akışını ayarlar |

### Neyi Saklamak, Neyi Çıkarmak Gerekiyor

Geçiş yaparken seçici olun. Kendinize şu soruyu sorun: "AI bunu *her* planlama isteği için gerektiriyor mu?"

**`context:` bölümü için iyi adaylar**
- Teknoloji yığını (diller, framework'ler, veritabanları)
- Temel mimari kalıplar (monorepo, mikroservisler vb.)
- Açık olmayan kısıtlamalar ("X kütüphanesini kullanamayız çünkü...")
- Sık sık göz ardı edilen kritik kurallar

**Bunlar yerine `rules:` bölümüne taşıyın**
- Artıfact'a özel biçimlendirme ("spesifikasyonlarda Given/When/Then formatını kullan")
- İnceleme kriterleri ("teklifler geri dönüş planları içermelidir")
- Bunlar sadece eşleşen artıfact için görünür, diğer istekleri daha hafif tutar

**Tamamen dışında bırakın**
- AI'nın zaten bildiği genel en iyi uygulamalar
- Özetlenebilecek ayrıntılı açıklamalar
- Mevcut çalışmayı etkilemeyen geçmiş bağlamı

### Geçiş Adımları

1. **config.yaml oluşturun** (init tarafından zaten oluşturulmadıysa):
   ```yaml
   schema: spec-driven
   ```

2. **Bağlamınızı ekleyin** (öz olun—bu her isteğe dahil edilir):
   ```yaml
   context: |
     Your project background goes here.
     Focus on what the AI genuinely needs to know.
   ```

3. **Her artıfact için kurallar ekleyin** (isteğe bağlı):
   ```yaml
   rules:
     proposal:
       - Your proposal-specific guidance
     specs:
       - Your spec-writing rules
   ```

4. **project.md'yi silin**, tüm yararlı içerikleri taşıdıktan sonra.

**Bunu çok düşünmeyin.** Temel şeylerle başlayın ve yineleyin. AI'nin önemli bir şeyi kaçırdığını fark ederseniz ekleyin. Bağlam şişkin görünüyorsa kısaltın. Bu bir canlı belgedir.

### Yardım mı Gerekiyor? Bu İstemi Kullanın

project.md içeriğinizi nasıl özetteleceğinizden emin değilseniz, AI asistanınıza sorun:

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

AI size temel olanı ve kısaltılabilecek olanı belirlemenize yardımcı olacaktır.

---

## Yeni Komutlar

Komut kullanılabilirliği profile bağlıdır:

**Varsayılan (`core` profili):**

| Komut | Amaç |
|-------|------|
| `/opsx:propose` | Tek adımda bir değişiklik oluştur ve planlama artıfact'larını üret |
| `/opsx:explore` | Yapılandırılmamış bir şekilde fikirleri düşün |
| `/opsx:apply` | tasks.md dosyasındaki görevleri uygula |
| `/opsx:archive` | Değişikliği sonlandır ve arşivle |

**Genişletilmiş iş akışı (özel seçim):**

| Komut | Amaç |
|-------|------|
| `/opsx:new` | Yeni bir değişiklik iskeleti oluştur |
| `/opsx:continue` | Sonraki artıfact'ı oluştur (tek seferde bir tane) |
| `/opsx:ff` | Hızlı ilerleme—planlama artıfact'larını tek seferde oluştur |
| `/opsx:verify` | Uygulamanın spesifikasyonlarla eşleştiğini doğrula |
| `/opsx:sync` | Delta spesifikasyonları ana spesifikasyonlarla birleştir |
| `/opsx:bulk-archive` | Birden fazla değişikliği tek seferde arşivle |
| `/opsx:onboard` | Rehberli uçtan uca kurulum iş akışı |

Genişletilmiş komutları etkinleştirmek için `openspec config profile` komutunu çalıştırın, ardından `openspec update` komutunu çalıştırın.

### Eski Sistemden Komut Eşleştirme

| Eski Sistem | OPSX Eşdeğeri |
|------------|---------------|
| `/openspec:proposal` | `/opsx:propose` (varsayılan) veya `/opsx:new` ardından `/opsx:ff` (genişletilmiş) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Yeni Yetenekler

Bu yetenekler genişletilmiş iş akışı komut setinin bir parçasıdır.

**Ayrıntılı artıfact oluşturma:**
```
/opsx:continue
```
Bağımlılıklara göre tek seferde bir artıfact oluşturur. Her adımı gözden geçirmek istediğinizde bunu kullanın.

**Keşif modu:**
```
/opsx:explore
```
Bir değişikliğe başlamadan önce fikirleri bir ortağıyla birlikte düşünün.

---

## Yeni Mimariyi Anlamak

### Kilitli Aşamalardan Esnek Yapıya

Eski iş akışı doğrusal ilerlemeyi zorunlu kılıyordu:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  PLANLAMA    │ ───► │ UYGULAMA     │ ───► │  ARŞİVLEME  │
│   AŞAMASI    │      │  AŞAMASI     │      │   AŞAMASI    │
└──────────────┘      └──────────────┘      └──────────────┘

Uygulama aşamasındayken tasarımın yanlış olduğunu fark ederseniz?
Çok kötü. Aşama geçitleri kolayca geri dönmenize izin vermez.
```

OPSX aşamalar yerine eylemler kullanır:

```
         ┌───────────────────────────────────────────────┐
         │           EYLEMLER (aşamalar değil)           │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │               istediğiniz sırayla            │
         └───────────────────────────────────────────────┘
```

### Bağımlılık Grafiği

Artıfact'lar yönlü bir grafik oluşturur. Bağımlılıklar geçitler değil, olanak sağlayıcılardır:

```
                        proposal
                       (kök düğüm)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (gerekli:                    (gerekli:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (gerekli:
                     specs, design)
```

`/opsx:continue` komutunu çalıştırdığınızda, hazır olanları kontrol eder ve sonraki artıfact'ı sunar. Ayrıca hazır olan birden fazla artıfact'ı istediğiniz sırayla oluşturabilirsiniz.

### Beceriler (Skills) vs Komutlar

Eski sistem araç özel komut dosyaları kullanıyordu:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX ortaya çıkan **beceri (skills)** standardını kullanır:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Beceriler birden fazla AI kod yazma aracı tarafından tanınır ve daha zengin meta veriler sağlar.

Codex için OPSX sadece beceri tabanlıdır. OpenSpec artık Codex özel istem dosyaları oluşturmaz; bunun yerine oluşturulan `.codex/skills/openspec-*` dizinlerini kullanın.

## Mevcut Değişikliklere Devam Et

Devam eden değişiklikleriniz OPSX komutlarıyla sorunsuz çalışır.

**Eski iş akışından aktif bir değişikliğiniz mi var?**

```
/opsx:apply add-my-feature
```

OPSX mevcut yapıtları okur ve bıraktığınız yerden devam eder.

**Mevcut bir değişikliğe daha fazla yapıt eklemek mi istiyorsunuz?**

```
/opsx:continue add-my-feature
```

Mevcut olanlara dayanarak oluşturulmaya hazır olanları gösterir.

**Durumu görmek mi istiyorsunuz?**

```bash
openspec status --change add-my-feature
```

---

## Yeni Yapılandırma Sistemi

### config.yaml Yapısı

```yaml
# Gerekli: Yeni değişiklikler için varsayılan şema
schema: spec-driven

# İsteğe bağlı: Proje bağlamı (en fazla 50KB)
# TÜM yapıt talimatlarına eklenir
context: |
  Proje arka planınız, teknoloji yığınız,
  kurallarınız ve kısıtlarınız.

# İsteğe bağlı: Yapıt başına kurallar
# Sadece eşleşen yapıtlara eklenir
rules:
  proposal:
    - Geri dönüş planı ekle
  specs:
    - Given/When/Then formatını kullan
  design:
    - Yedek stratejilerini belgele
  tasks:
    - En fazla 2 saatlik parçalara böl
```

### Şema Çözümleme

Hangi şemanın kullanılacağı belirlenirken OPSX sırayla kontrol eder:

1. **CLI bayrağı**: `--schema <ad>` (en yüksek öncelik)
2. **Değişiklik meta verisi**: Değişiklik dizinindeki `.openspec.yaml`
3. **Proje yapılandırması**: `openspec/config.yaml`
4. **Varsayılan**: `spec-driven`

### Mevcut Şemalar

| Şema | Yapıtlar | En İyi Kullanım Alanı |
|--------|-----------|----------|
| `spec-driven` | proposal → specs → design → tasks | Çoğu proje |

Tüm mevcut şemaları listele:

```bash
openspec schemas
```

### Özel Şemalar

Kendi iş akışınızı oluşturun:

```bash
openspec schema init my-workflow
```

Ya da mevcut birini çatallayın:

```bash
openspec schema fork spec-driven my-workflow
```

Ayrıntılar için [Özelleştirme](customization.md) belgesine bakın.

---

## Sorun Giderme

### "Etkileşimli olmayan modda eski dosyalar algılandı"

CI veya etkileşimli olmayan bir ortamda çalışıyorsunuz. Şunu kullanın:

```bash
openspec init --force
```

### Geçişten sonra komutlar görünmüyor

IDE'nizi yeniden başlatın. Beceriler başlangıçta algılanır.

### "Kurallarda bilinmeyen yapıt kimliği"

`rules:` anahtarlarının şemanızın yapıt kimlikleriyle eşleştiğinden emin olun:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Geçerli yapıt kimliklerini görmek için şunu çalıştırın:

```bash
openspec schemas --json
```

### Yapılandırma uygulanmıyor

1. Dosyanın `openspec/config.yaml` konumunda olduğundan emin olun (`.yml` değil)
2. YAML sözdizimini doğrulayın
3. Yapılandırma değişiklikleri hemen etkili olur—yeniden başlatmaya gerek yoktur

### project.md geçiş yapılmadı

Sistem, özelleştirilmiş içeriğiniz içerebileceği için `project.md` dosyasını kasıtlı olarak korur. Manuel olarak gözden geçirin, yararlı kısımları `config.yaml`'a taşıyın, ardından silin.

### Temizlenecekleri görmek mi istiyorsunuz?

Init komutunu çalıştırın ve temizleme istemini reddedin—hiçbir değişiklik yapılmadan tam algılama özetini göreceksiniz.

---

## Hızlı Referans

### Geçiş Sonrası Dosyalar

```
project/
├── openspec/
│   ├── specs/                    # Değiştirilmedi
│   ├── changes/                  # Değiştirilmedi
│   │   └── archive/              # Değiştirilmedi
│   └── config.yaml               # YENİ: Proje yapılandırması
├── .claude/
│   └── skills/                   # YENİ: OPSX becerileri
│       ├── openspec-propose/     # varsayılan çekirdek profil
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # genişletilmiş profil new/continue/ff vb. komutları ekler
├── CLAUDE.md                     # OpenSpec işaretçileri kaldırıldı, içeriğiniz korundu
└── AGENTS.md                     # OpenSpec işaretçileri kaldırıldı, içeriğiniz korundu
```

### Kaldırılanlar

- `.claude/commands/openspec/` — `.claude/skills/` ile değiştirildi
- `openspec/AGENTS.md` — kullanım dışı
- `openspec/project.md` — `config.yaml`'a geçirin, ardından silin
- `CLAUDE.md`, `AGENTS.md` vb. dosyalardaki OpenSpec işaretçi blokları

### Komut Hızlı Referansı

```text
/opsx:propose      Hızlı başla (varsayılan çekirdek profil)
/opsx:apply        Görevleri uygula
/opsx:archive      Bitir ve arşivle

# Genişletilmiş iş akışı (etkinse):
/opsx:new          Bir değişikliğin iskeletini oluştur
/opsx:continue     Sonraki yapıtı oluştur
/opsx:ff           Planlama yapıtlarını oluştur
```

---

## Yardım Alma

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Dokümantasyon**: Tam OPSX referansı için [docs/opsx.md](opsx.md)