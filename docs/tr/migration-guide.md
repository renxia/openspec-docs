# OPSX'ye Geçiş

Bu kılavuz, eski OpenSpec iş akışından OPSX'ye geçiş yapmanıza yardımcı olur. Geiş süreci sorunsuz olacak şekilde tasarlanmıştır—mevcut çalışmalarınız korunur ve yeni sistem daha fazla esneklik sunar.

## Neler Değişiyor?

OPSX, eski aşama-kilitli iş akışını akıcı, eylem tabanlı bir yaklaşımla değiştirir. İşte temel değişim:

| Yön | Eski Sistem | OPSX |
|--------|--------|------|
| **Komutlar** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Varsayılan: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (genişletilmiş iş akış komutları isteğe bağlı) |
| **İş Akışı** | Tüm çıktıları bir anda oluştur | Aşamalı veya bir anda oluştur—sizin seçiminiz |
| **Geri Dönme** | Hantal aşama kapıları | Doğal—herhangi bir çıktıyı istediğiniz zaman güncelleyin |
| **Özelleştirme** | Sabit yapı | Şema odaklı, tamamen özelleştirilebilir |
| **Yapılandırma** | İşaretleyicilerle `CLAUDE.md` + `project.md` | `openspec/config.yaml` içinde temiz yapılandırma |

**Felsefe değişikliği:** İş doğrusal değildir. OPSX bunu yapma iddiasını bırakır.

---

## Başlamadan Önce

### Mevcut Çalışmalarınız Güvende

Geçiş süreci, koruma odaklı olarak tasarlanmıştır:

- **`openspec/changes/` içindeki aktif değişiklikler** — Tamamen korunur. OPSX komutlarıyla bunlara devam edebilirsiniz.
- **Arşivlenmiş değişiklikler** — Değiştirilmez. Geçmişiniz bozulmadan kalır.
- **`openspec/specs/` içindeki ana spesifikasyonlar** — Değiştirilmez. Bunlar doğruluk kaynağınızdır.
- **CLAUDE.md, AGENTS.md vb. içindeki içerikleriniz** — Korunur. Yalnızca OpenSpec işaret blokları kaldırılır; yazdığınız her şey kalır.

### Neler Kaldırılır

Yalnızca değiştirilen OpenSpec tarafından yönetilen dosyalar:

| Ne | Neden |
|------|-----|
| Eski eğik çizgi komut dizinleri/dosyaları | Yeni beceriler sistemiyle değiştirildi |
| `openspec/AGENTS.md` | Kullanımdan kaldırılmış iş akışı tetikleyicisi |
| `CLAUDE.md`, `AGENTS.md` vb. içindeki OpenSpec işaretleri | Artık gerekli değil |

**Araca göre eski komut konumları** (örnekler—aracınız farklı olabilir):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (Yalnızca IDE uzantıları; Copilot CLI'da desteklenmez)
- Ve diğerleri (Augment, Continue, Amazon Q vb.)

Geçiş, yapılandırdığınız araçları algılar ve eski dosyalarını temizler.

Kaldırma listesi uzun görünebilir, ancak bunların tümü OpenSpec'in başlangıçta oluşturduğu dosyalardır. Sizin kendi içeriğiniz asla silinmez.

### Dikkat Etmeniz Gerekenler

Bir dosya manuel geçiş gerektirir:

**`openspec/project.md`** — Bu dosya, yazdığınız proje bağlamını içerebileceğinden otomatik olarak silinmez. Şunları yapmanız gerekir:

1. İçeriğini inceleyin
2. Yararlı bağlamı `openspec/config.yaml` dosyasına taşıyın (aşağıdaki yönergeye bakın)
3. Hazır olduğunuzda dosyayı silin

**Bu değişikliği neden yaptık:**

Eski `project.md` pasifti—yapay zeka ajanları onu okuyabilir, okumayabilir veya okuduklarını unutabilir. Güvenilirliğin tutarsız olduğunu tespit ettik.

Yeni `config.yaml` bağlamı, **her OpenSpec planlama istemine aktif olarak enjekte edilir**. Bu, proje sözleşmelerinizin, teknoloji yığınınızın ve kurallarınızın yapay zeka ürünler oluştururken her zaman mevcut olduğu anlamına gelir. Daha yüksek güvenilirlik.

**Taviz:**

Bağlam her isteme enjekte edildiğinden, özlü olmak isteyeceksiniz. Gerçekten önemli olana odaklanın:
- Teknoloji yığını ve temel sözleşmeler
- Yapay zekanın bilmesi gereken bariz olmayan kısıtlamalar
- Daha önce sıkça göz ardı edilen kurallar

Mükemmel olmaya çalışmayın. Burada neyin en iyi işe yaradığını hâlâ öğreniyoruz ve deneylerimizle bağlam enjeksiyonunun nasıl çalıştığını geliştirmeye devam edeceğiz.

---

## Geçişi Çalıştırmak

Hem `openspec init` hem de `openspec update` eski dosyaları algılar ve sizi aynı temizleme sürecinden geçirir. Durumunuza uygun olanı kullanın:

- Yeni kurulumlar varsayılan olarak `core` profilini kullanır (`propose`, `explore`, `apply`, `sync`, `archive`).
- Geçiş yapılan kurulumlar, gerektiğinde `custom` profili yazarak daha önce yüklediğiniz iş akışlarını korur.

### `openspec init` Kullanımı

Yeni araçlar eklemek veya hangi araçların kurulduğunu yeniden yapılandırmak istiyorsanız bunu çalıştırın:

```bash
openspec init
```

init komutu eski dosyaları algılar ve temizlikte size rehberlik eder:

```
Yeni OpenSpec'e yükseltme

OpenSpec artık kodlama ajanları arasında ortaya çıkan standart olan
yapay zeka becerilerini kullanır. Bu, her şeyi önceki gibi çalışır
tutarken kurulumunuzu basitleştirir.

Kaldırılacak dosyalar
Korunacak kullanıcı içeriği yok:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Güncellenecek dosyalar
OpenSpec işaretleri kaldırılacak, içeriğiniz korunacak:
  • CLAUDE.md
  • AGENTS.md

Dikkatinizi gerektirenler
  • openspec/project.md
    Bu dosyayı silmeyeceğiz. Yararlı proje bağlamı içerebilir.

    Yeni openspec/config.yaml dosyasında planlama bağlamı için bir
    "context:" bölümü vardır. Bu, her OpenSpec istemine dahil edilir
    ve eski project.md yaklaşımından daha güvenilir çalışır.

    project.md'yi inceleyin, yararlı içeriği config.yaml'nin context
    bölümüne taşıyın, ardından hazır olduğunuzda dosyayı silin.

? Eski dosyalar yükseltip temizlensin mi? (E/h)
```

**Evet dediğinizde ne olur:**

1. Eski eğik çizgi komut dizinleri kaldırılır
2. `CLAUDE.md`, `AGENTS.md` vb. dosyalardan OpenSpec işaretleri çıkarılır (içeriğiniz kalır)
3. `openspec/AGENTS.md` silinir
4. Yeni beceriler `.claude/skills/` dizinine yüklenir
5. `openspec/config.yaml` varsayılan bir şemayla oluşturulur

### `openspec update` Kullanımı

Yalnızca geçiş yapmak ve mevcut araçlarınızı en son sürüme yenilemek istiyorsanız bunu çalıştırın:

```bash
openspec update
```

update komutu da eski kalıntıları algılar ve temizler, ardından oluşturulan becerileri/komutları mevcut profil ve teslim ayarlarınıza uyacak şekilde yeniler.

### İnteraktif Olmayan / CI Ortamları

Betik tabanlı geçişler için:

```bash
openspec init --force --tools claude
```

`--force` bayrağı istemleri atlar ve temizliği otomatik olarak kabul eder.

---

## project.md'yi config.yaml'ye Geçirmek

Eski `openspec/project.md`, proje bağlamı için serbest biçimli bir markdown dosyasıydı. Yeni `openspec/config.yaml` yapılandırılmıştır ve—kritik olarak—**her planlama istemine enjekte edilir**, böylece sözleşmeleriniz yapay zeka çalışırken her zaman mevcut olur.

### Önce (project.md)

```markdown
# Proje Bağlamı

Bu, React ve Node.js kullanan bir TypeScript monorepo'sudur.
Testler için Jest kullanıyoruz ve katı ESLint kurallarına uyuyoruz.
API'miz RESTful ve docs/api.md'de belgelenmiştir.

## Sözleşmeler

- Tüm genel API'ler geriye dönük uyumluluğu korumalıdır
- Yeni özellikler test içermelidir
- Spesifikasyonlar için Verilen/Olduğunda/O zaman biçimini kullanın
```

### Sonra (config.yaml)

```yaml
schema: spec-driven

context: |
  Teknoloji yığını: TypeScript, React, Node.js
  Test: Jest ve React Testing Library
  API: RESTful, docs/api.md'de belgelenmiştir
  Tüm genel API'ler için geriye dönük uyumluluğu koruyoruz

rules:
  proposal:
    - Riskli değişiklikler için geri alma planı ekleyin
  specs:
    - Senaryolar için Verilen/Olduğunda/O zaman biçimini kullanın
    - Yeni icat etmeden önce mevcut desenlere referans verin
  design:
    - Karmaşık akışlar için sıra diyagramları ekleyin
```

### Temel Farklar

| project.md | config.yaml |
|------------|-------------|
| Serbest biçimli markdown | Yapılandırılmış YAML |
| Tek bir metin bloğu | Ayrı bağlam ve ürüne özel kurallar |
| Ne zaman kullanıldığı belirsiz | Bağlam TÜM ürünlerde görünür; kurallar yalnızca eşleşen ürünlerde görünür |
| Şema seçimi yok | Açık `schema:` alanı varsayılan iş akışını belirler |

### Ne Tutulmalı, Ne Bırakılmalı

Geçiş yaparken seçici olun. Kendinize şunu sorun: "Yapay zekanın bunu *her* planlama istemi için mi bilmesi gerekiyor?"

**`context:` için iyi adaylar**
- Teknoloji yığını (diller, çerçeveler, veritabanları)
- Temel mimari desenler (monorepo, mikro hizmetler vb.)
- Bariz olmayan kısıtlamalar ("X kütüphanesini kullanamayız çünkü...")
- Sıkça göz ardı edilen kritik sözleşmeler

**Bunun yerine `rules:`'a taşıyın**
- Ürüne özel biçimlendirme ("spesifikasyonlarda Verilen/Olduğunda/O zaman kullanın")
- İnceleme kriterleri ("öneriler geri alma planı içermelidir")
- Bunlar yalnızca eşleşen ürün için görünür, diğer istemleri daha hafif tutar

**Tamamen bırakın**
- Yapay zekanın zaten bildiği genel en iyi uygulamalar
- Özetlenebilecek ayrıntılı açıklamalar
- Mevcut çalışmayı etkilemeyen tarihsel bağlam

### Geçiş Adımları

1. **config.yaml oluşturun** (init tarafından zaten oluşturulmadıysa):
   ```yaml
   schema: spec-driven
   ```

2. **Bağlamınızı ekleyin** (özlü olun—bu her isteme gider):
   ```yaml
   context: |
     Proje arka planınız buraya gelir.
     Yapay zekanın gerçekten bilmesi gereken şeye odaklanın.
   ```

3. **Ürüne özel kurallar ekleyin** (isteğe bağlı):
   ```yaml
   rules:
     proposal:
       - Öneriye özel yönergeniz
     specs:
       - Spesifikasyon yazma kurallarınız
   ```

4. **project.md'yi silin** yararlı her şeyi taşıdıktan sonra.

**Çok fazla düşünmeyin.** Temellerle başlayın ve yineleyin. Yapay zekanın önemli bir şeyi kaçırdığını fark ederseniz ekleyin. Bağlam hantal geliyorsa kısaltın. Bu yaşayan bir belgedir.

### Yardım mı Lazım? Bu İstemi Kullanın

project.md'nizi nasıl damıtacağınızdan emin değilseniz, yapay zeka asistanınıza sorun:

```
OpenSpec'in eski project.md formatından yeni config.yaml formatına geçiş yapıyorum.

İşte mevcut project.md'm:
[project.md içeriğinizi yapıştırın]

Lütfen şunları içeren bir config.yaml oluşturmama yardımcı olun:
1. Özlü bir `context:` bölümü (bu her planlama istemine enjekte edilir, bu yüzden kısa tutun—teknoloji yığınına, temel kısıtlamalara ve sıkça göz ardı edilen sözleşmelere odaklanın)
2. Herhangi bir içerik ürüne özelse `rules:` (örneğin, "Verilen/Olduğunda/O zaman kullanın" spesifikasyon kurallarına aittir, genel bağlama değil)

Yapay zeka modellerinin zaten bildiği genel şeyleri bırakın. Özlülük konusunda acımasız olun.
```

Yapay zeka, neyin temel olduğunu neyin kısaltılabileceğini belirlemenize yardımcı olacaktır.

---

## Yeni Komutlar

Komut kullanılabilirliği profile bağlıdır:

**Varsayılan (`core` profili):**

| Komut | Amaç |
|---------|---------|
| `/opsx:propose` | Bir değişiklik oluşturun ve planlama ürünlerini tek adımda üretin |
| `/opsx:explore` | Yapı olmadan fikirleri düşünün |
| `/opsx:apply` | tasks.md'deki görevleri uygulayın |
| `/opsx:archive` | Değişikliği sonlandırın ve arşivleyin |

**Genişletilmiş iş akışı (özel seçim):**

| Komut | Amaç |
|---------|---------|
| `/opsx:new` | Yeni bir değişiklik iskelesi başlatın |
| `/opsx:continue` | Bir sonraki ürünü oluşturun (seferde bir tane) |
| `/opsx:ff` | Hızlı ileri—planlama ürünlerini bir anda oluşturun |
| `/opsx:verify` | Uygulamanın spesifikasyonlara uygunluğunu doğrulayın |
| `/opsx:sync` | Delta spesifikasyonlarını ana spesifikasyonlarla birleştirin |
| `/opsx:bulk-archive` | Birden fazla değişikliği bir anda arşivleyin |
| `/opsx:onboard` | Yönlendirmeli uçtan uca katılım iş akışı |

Genişletilmiş komutları `openspec config profile` ile etkinleştirin, ardından `openspec update` çalıştırın.

### Eski Komutlardan Komut Eşleme

| Eski | OPSX Karşılığı |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (varsayılan) veya `/opsx:new` ardından `/opsx:ff` (genişletilmiş) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Yeni Yetenekler

Bu yetenekler genişletilmiş iş akışı komut setinin bir parçasıdır.

**Ayrıntılı ürün oluşturma:**
```
/opsx:continue
```
Bağımlılıklara göre seferde bir ürün oluşturur. Her adımı incelemek istediğinizde bunu kullanın.

**Keşif modu:**
```
/opsx:explore
```
Bir değişikliğe karar vermeden önce bir partnerle fikirleri düşünün.

---

## Yeni Mimarının Anlaşılması

### Faz Kilitliden Akıcıya

Eski iş akışı doğrusal ilerlemeye zorluyordu:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANLAMA   │ ───► │ UYGULAMA     │ ───► │  ARŞİVLEME   │
│    FAZI      │      │    FAZI      │      │    FAZI      │
└──────────────┘      └──────────────┘      └──────────────┘

Uygulama aşamasındayken tasarımın yanlış olduğunu fark ederseniz?
Çok kötü. Faz kapıları kolayca geri dönmenize izin vermez.
```

OPSX fazlar yerine eylemler kullanır:

```
         ┌───────────────────────────────────────────────┐
         │           EYLEMLER (fazlar değil)             │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                herhangi bir sıra              │
         └───────────────────────────────────────────────┘
```

### Bağımlılık Grafiği

Yapıtlar yönlü bir grafik oluşturur. Bağımlılıklar kapılar değil, etkinleştiricilerdir:

```
                        proposal
                     (kök düğüm)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (gerekli:                   (gerekli:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (gerekli:
                     specs, design)
```

`/opsx:continue` komutunu çalıştırdığınızda, neyin hazır olduğunu kontrol eder ve bir sonraki yapıtı sunar. Ayrıca hazır birden fazla yapıtı herhangi bir sırada oluşturabilirsiniz.

### Beceriler vs Komutlar

Eski sistem, araca özgü komut dosyaları kullanıyordu:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX, ortaya çıkan **beceriler** standardını kullanır:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Beceriler, birden fazla AI kodlama aracı tarafından tanınır ve daha zengin meta veriler sağlar.

---

## Mevcut Değişikliklere Devam Etme

Devam eden değişiklikleriniz OPSX komutlarıyla sorunsuz çalışır.

**Eski iş akışından aktif bir değişikliğiniz mi var?**

```
/opsx:apply add-my-feature
```

OPSX mevcut yapıtları okur ve kaldığınız yerden devam eder.

**Mevcut bir değişikliğe daha fazla yapıt eklemek mi istiyorsunuz?**

```
/opsx:continue add-my-feature
```

Zaten var olana dayanarak neyin oluşturulmaya hazır olduğunu gösterir.

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

# İsteğe bağlı: Proje bağlamı (maks. 50KB)
# TÜM yapıt talimatlarına eklenir
context: |
  Projenizin arka planı, teknoloji yığını,
  kuralları ve kısıtlamaları.

# İsteğe bağlı: Yapıta özel kurallar
# Yalnızca eşleşen yapıtlara eklenir
rules:
  proposal:
    - Geri alma planı dahil et
  specs:
    - Given/When/Then biçimini kullan
  design:
    - Yedek stratejileri belgele
  tasks:
    - Maksimum 2 saatlik parçalara böl
```

### Şema Çözümleme

Hangi şemanın kullanılacağını belirlerken OPSX sırayla kontrol eder:

1. **CLI bayrağı**: `--schema <name>` (en yüksek öncelik)
2. **Değişiklik meta verileri**: Değişiklik dizinindeki `.openspec.yaml`
3. **Proje yapılandırması**: `openspec/config.yaml`
4. **Varsayılan**: `spec-driven`

### Mevcut Şemalar

| Şema | Yapıtlar | En İyi Kullanım Alanı |
|------|----------|-----------------------|
| `spec-driven` | proposal → specs → design → tasks | Çoğu proje |

Mevcut tüm şemaları listele:

```bash
openspec schemas
```

### Özel Şemalar

Kendi iş akışınızı oluşturun:

```bash
openspec schema init my-workflow
```

Veya mevcut birini çatallayın:

```bash
openspec schema fork spec-driven my-workflow
```

Ayrıntılar için bkz. [Özelleştirme](customization.md).

---

## Sorun Giderme

### "Etkileşimli olmayan modda eski dosyalar algılandı"

Bir CI veya etkileşimli olmayan ortamda çalışıyorsunuz. Şunu kullanın:

```bash
openspec init --force
```

### Geçişten sonra komutlar görünmüyor

IDE'nizi yeniden başlatın. Beceriler başlangıçta algılanır.

### "Kurallarda bilinmeyen yapıt kimliği"

`rules:` anahtarlarınızın şemanızın yapıt kimlikleriyle eşleştiğinden emin olun:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Geçerli yapıt kimliklerini görmek için bunu çalıştırın:

```bash
openspec schemas --json
```

### Yapılandırma uygulanmıyor

1. Dosyanın `openspec/config.yaml` konumunda olduğundan emin olun (`.yml` değil)
2. YAML sözdizimini doğrulayın
3. Yapılandırma değişiklikleri hemen geçerlidir—yeniden başlatma gerekmez

### project.md taşınmadı

Sistem, özel içeriğiniz olabileceğinden kasıtlı olarak `project.md` dosyasını korur. Manuel olarak inceleyin, yararlı kısımları `config.yaml` dosyasına taşıyın, ardından silin.

### Nelerin temizleneceğini görmek mi istiyorsunuz?

`init` komutunu çalıştırın ve temizleme istemini reddedin—herhangi bir değişiklik yapılmadan tam algılama özetini göreceksiniz.

---

## Hızlı Referans

### Geçiş Sonrası Dosyalar

```
project/
├── openspec/
│   ├── specs/                    # Değişmedi
│   ├── changes/                  # Değişmedi
│   │   └── archive/              # Değişmedi
│   └── config.yaml               # YENİ: Proje yapılandırması
├── .claude/
│   └── skills/                   # YENİ: OPSX becerileri
│       ├── openspec-propose/     # varsayılan temel profil
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # genişletilmiş profil new/continue/ff/vb. ekler
├── CLAUDE.md                     # OpenSpec işaretleri kaldırıldı, içeriğiniz korundu
└── AGENTS.md                     # OpenSpec işaretleri kaldırıldı, içeriğiniz korundu
```

### Kaldırılanlar

- `.claude/commands/openspec/` — `.claude/skills/` ile değiştirildi
- `openspec/AGENTS.md` — kullanımdan kaldırıldı
- `openspec/project.md` — `config.yaml` dosyasına taşıyın, ardından silin
- `CLAUDE.md`, `AGENTS.md` vb. dosyalardaki OpenSpec işaret blokları

### Komut Hızlı Referansı

```text
/opsx:propose      Hızlıca başla (varsayılan temel profil)
/opsx:apply        Görevleri uygula
/opsx:archive      Bitir ve arşivle

# Genişletilmiş iş akışı (etkinleştirilmişse):
/opsx:new          Bir değişiklik iskeleti oluştur
/opsx:continue     Sonraki yapıtı oluştur
/opsx:ff           Planlama yapıtları oluştur
```

---

## Yardım Alma

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Sorunları**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Belgeler**: Tam OPSX referansı için [docs/opsx.md](opsx.md)