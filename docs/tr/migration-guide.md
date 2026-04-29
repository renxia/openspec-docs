# OPSX'e Geçiş

Bu kılavuz, eski OpenSpec iş akışından OPSX'e geçiş sürecinde size yardımcı olur. Geçiş süreci sorunsuz olacak şekilde tasarlanmıştır—mevcut çalışmalarınız korunur ve yeni sistem daha fazla esneklik sunar.

## Neler Değişiyor?

OPSX, eski aşamalara kilitlenmiş iş akışını yerine, akışkan, eylem tabanlı bir yaklaşımla değiştiriyor. İşte temel değişim:

| Yön | Eski Sistem | OPSX |
|--------|--------|------|
| **Komutlar** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Varsayılan: `/opsx:propose`, `/opsx:apply`, `/opsx:archive` (genişletilmiş iş akışı komutları isteğe bağlıdır) |
| **İş Akışı** | Tüm eserleri tek seferde oluşturun | Kademeli olarak veya tek seferde oluşturun—sizin seçiminiz |
| **Geri Dönüş** | Zorunlu aşama kapıları | Doğal—herhangi bir eseri istediğiniz zaman güncelleyin |
| **Özelleştirme** | Sabit yapı | Şema tarafından驱动, tamamen değiştirilebilir |
| **Yapılandırma** | İşaretleyiciler içeren `CLAUDE.md` + `project.md` | `openspec/config.yaml` içinde temiz yapılandırma |

**Felsefe değişikliği:** Çalışma doğrusal değildir. OPSX, öyleymiş gibi davranmayı bırakır.

---

## Başlamadan Önce

### Mevcut Çalışmanız Güvende

Geçiş süreci, korumayı göz önünde bulundurarak tasarlanmıştır:

- **`openspec/changes/` içindeki aktif değişiklikler** — Tamamen korunur. OPSX komutlarıyla bunlara devam edebilirsiniz.
- **Arşivlenmiş değişiklikler** — Dokunulmaz. Geçmişiniz sağlam kalır.
- **`openspec/specs/` içindeki ana özellikler** — Dokunulmaz. Bunlar gerçeklik kaynağınızdır.
- **CLAUDE.md, AGENTS.md vb. içindeki içeriğiniz** — Korunur. Yalnızca OpenSpec işaretçi blokları kaldırılır; yazdığınız her şey kalır.

### Kaldırılan Şeyler

Yalnızca değiştirilen OpenSpec tarafından yönetilen dosyalar:

| Ne | Neden |
|------|-----|
| Eski eğik çizgi komutu dizinleri/dosyaları | Yeni beceri sistemi tarafından değiştirildi |
| `openspec/AGENTS.md` | Eski iş akışı tetikleyicisi |
| `CLAUDE.md`, `AGENTS.md` vb. içindeki OpenSpec işaretçileri | Artık gerekli değil |

**Araçlara göre eski komut konumları** (örnekler—aracınız farklı olabilir):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (Yalnızca IDE eklentileri; Copilot CLI'da desteklenmez)
- Ve diğerleri (Augment, Continue, Amazon Q vb.)

Geçiş, yapılandırdığınız araçları algılar ve eski dosyalarını temizler.

Kaldırma listesi uzun görünebilir, ancak bunların hepsi OpenSpec'in başlangıçta oluşturduğu dosyalardır. Kendi içeriğiniz asla silinmez.

### Dikkat Gerektiren Şeyler

Bir dosya manuel geçiş gerektirir:

**`openspec/project.md`** — Bu dosya otomatik olarak silinmez çünkü yazmış olabileceğiniz proje bağlamını içerebilir. Şunları yapmanız gerekecek:

1. İçeriğini incelemek
2. Yararlı bağlamı `openspec/config.yaml`'a taşımak (aşağıdaki rehbere bakın)
3. Hazır olduğunuzda dosyayı silmek

**Bu değişikliği neden yaptık:**

Eski `project.md` pasifti—ajanlar onu okuyabilir, okumayabilir, okuduklarını unutabilir. Güvenilirliğin tutarsız olduğunu bulduk.

Yeni `config.yaml` bağlamı **her OpenSpec planlama isteğine aktif olarak enjekte edilir**. Bu, proje geleneklerinizin, teknoloji yığınınızın ve kurallarınızın AI sanat eserleri oluştururken her zaman mevcut olduğu anlamına gelir. Daha yüksek güvenilirlik.

**Taviz:**

Bağlam her isteğe enjekte edildiğinden, kısa ve öz olmak isteyeceksiniz. Gerçekten önemli olan şeye odaklanın:
- Teknoloji yığını ve temel gelenekler
- AI'ın bilmesi gereken bariz olmayan kısıtlamalar
- Daha önce sıkça göz ardı edilen kurallar

Mükemmel olmak konusunda endişelenmeyin. Burada en iyi çalışan şeyin ne olduğunu hâlâ öğreniyoruz ve deneyler yaparak bağlam enjeksiyonu yöntemini geliştireceğiz.

---

## Geçişi Çalıştırma

Hem `openspec init` hem de `openspec update` eski dosyaları algılar ve sizi aynı temizleme sürecinden geçirir. Durumunuza uyanı kullanın:

- Yeni kurulumlar varsayılan olarak `core` profilini kullanır (`propose`, `explore`, `apply`, `archive`).
- Geçiş yapılmış kurulumlar, gerektiğinde `custom` profil yazarak daha önce yüklediğiniz iş akışlarını korur.

### `openspec init` Kullanma

Yeni araçlar eklemek veya hangi araçların kurulduğunu yeniden yapılandırmak istiyorsanız bunu çalıştırın:

```bash
openspec init
```

Init komutu eski dosyaları algılar ve temizlik sürecinde size rehberlik eder:

```
Yeni OpenSpec'e yükseltme

OpenSpec artık agent becerilerini kullanıyor, bu da kodlama
ajanları arasında ortaya çıkan bir standarttır. Bu, her şeyin
eskisi gibi çalışmaya devam etmesini sağlarken kurulumunuzu basitleştirir.

Kaldırılacak dosyalar
Kullanıcı içeriği korunmayacak:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Güncellenecek dosyalar
OpenSpec işaretçileri kaldırılacak, içeriğiniz korunacak:
  • CLAUDE.md
  • AGENTS.md

Dikkat gerektiriyor
  • openspec/project.md
    Bu dosyayı silmeyeceğiz. Yararlı proje bağlamı içerebilir.

    Yeni openspec/config.yaml, planlama bağlamı için bir "context:" bölümüne sahiptir.
    Bu, her OpenSpec isteğine dahil edilir ve eski project.md yaklaşımından
    daha güvenilir çalışır.

    project.md'yi inceleyin, yararlı içeriği config.yaml'ın context bölümüne
    taşıyın, sonra hazır olduğunuzda dosyayı silin.

? Yükselt ve eski dosyaları temizle? (Y/n)
```

**Evet dediğinizde ne olur:**

1. Eski eğik çizgi komutu dizinleri kaldırılır
2. `CLAUDE.md`, `AGENTS.md` vb. dosyalarından OpenSpec işaretçileri temizlenir (içeriğiniz kalır)
3. `openspec/AGENTS.md` silinir
4. `.claude/skills/` içine yeni beceriler yüklenir
5. Varsayılan şema ile `openspec/config.yaml` oluşturulur

### `openspec update` Kullanma

Yalnızca geçiş yapmak ve mevcut araçlarınızı en son sürüme yenilemek istiyorsanız bunu çalıştırın:

```bash
openspec update
```

Update komutu da eski kalıntıları algılar ve temizler, ardından oluşturulan becerileri/komutları mevcut profilinize ve teslim ayarlarınıza uyacak şekilde yeniler.

### Etkileşim Olmayan / CI Ortamları

Betik geçmişleri için:

```bash
openspec init --force --tools claude
```

`--force` bayrağı istekleri atlar ve temizliği otomatik olarak kabul eder.

---

## project.md'yi config.yaml'a Geçirme

Eski `openspec/project.md`, proje bağlamı için serbest biçimli bir markdown dosyasıydı. Yeni `openspec/config.yaml` yapılandırılmıştır ve—kritik olarak—**her planlama isteğine enjekte edilir**, böylece AI çalışırken gelenekleriniz her zaman mevcut olur.

### Önceki (project.md)

```markdown
# Proje Bağlamı

Bu, React ve Node.js kullanan bir TypeScript monorepo'sudur.
Testler için Jest kullanıyoruz ve katı ESLint kurallarına uyuyoruz.
API'miz RESTful'dur ve docs/api.md'de belgelenmiştir.

## Gelenekler

- Tüm genel API'ler geriye dönük uyumluluk korumalıdır
- Yeni özellikler testler içermelidir
- Özellikler için Given/When/Then formatı kullanın
```

### Sonraki (config.yaml)

```yaml
schema: spec-driven

context: |
  Teknoloji yığını: TypeScript, React, Node.js
  Test: Jest ve React Testing Library
  API: RESTful, docs/api.md'de belgelenmiştir
  Tüm genel API'ler için geriye dönük uyumluluk koruyoruz

rules:
  proposal:
    - Riskli değişiklikler için geri alma planı dahil et
  specs:
    - Senaryolar için Given/When/Then formatı kullan
    - Yeni kalıplar bulmadan önce mevcut kalıplara referans ver
  design:
    - Karmaşık akışlar için dizi diyagramları dahil et
```

### Temel Farklar

| project.md | config.yaml |
|------------|-------------|
| Serbest biçimli markdown | Yapılandırılmış YAML |
| Tek bir metin bloğu | Ayrı bağlam ve sanat eseri başına kurallar |
| Ne zaman kullanıldığı belirsiz | Bağlam TÜM sanat eserlerinde görünür; kurallar yalnızca eşleşen sanat eserlerinde görünür |
| Şema seçimi yok | Açıkça belirtilmiş `schema:` alanı varsayılan iş akışını ayarlar |

### Ne Saklanır, Ne Bırakılır

Geçiş yaparken seçici olun. Kendinize sorun: "AI'ın bunu *her* planlama isteği için bilmesi gerekiyor mu?"

**`context:` için iyi adaylar**
- Teknoloji yığını (diller, çerçeveler, veritabanları)
- Temel mimari kalıplar (monorepo, mikro servisler vb.)
- Bariz olmayan kısıtlamalar ("neden X kütüphanesini kullanamayız...")
- Sıkça göz ardı edilen kritik gelenekler

**Bunun yerine `rules:` taşıyın**
- Sanat eserine özgü biçimlendirme ("specs'te Given/When/Then kullan")
- İnceleme kriterleri ("teklifler geri alma planları içermeli")
- Bunlar yalnızca eşleşen sanat eseri için görünür, diğer istekleri daha hafif tutar

**Tamamen bırakın**
- AI'ın zaten bildiği genel en iyi uygulamalar
- Özetlenebilecek uzun açıklamalar
- Mevcut çalışmayı etkilemeyen tarihsel bağlam

### Geçiş Adımları

1. **config.yaml oluşturun** (eğer init tarafından zaten oluşturulmadıysa):
   ```yaml
   schema: spec-driven
   ```

2. **Bağlamanızı ekleyin** (kısa ve öz olun—bu her isteğe girer):
   ```yaml
   context: |
     Proje arka planınız buraya.
     AI'ın gerçekten bilmesi gereken şeye odaklanın.
   ```

3. **Sanat eseri başına kurallar ekleyin** (isteğe bağlı):
   ```yaml
   rules:
     proposal:
       - Teklife özel rehberliğiniz
     specs:
       - Özellik yazma kurallarınız
   ```

4. **Her şeyi faydalı bir şekilde taşıdıktan sonra project.md'yi silin.**

**Fazla düşünmeyin.** Temellerle başlayın ve yineleyin. AI'ın önemli bir şeyi kaçırdığını fark ederseniz ekleyin. Bağlam şişkin görünüyorsa kırpın. Bu yaşayan bir belgedir.

### Yardıma mı İhtiyacınız Var? Bu İstemiyi Kullanın

project.md'nizi nasıl damıtacağınızdan emin değilseniz, AI asistanınıza sorun:

```
OpenSpec'in eski project.md dosyasından yeni config.yaml formatına geçiyorum.

İşte mevcut project.md'm:
[project.md içeriğinizi yapıştırın]

Lütfen şu özelliklere sahip bir config.yaml oluşturmak için yardımcı olun:
1. Kısa ve öz bir `context:` bölümü (bu her planlama isteğine enjekte edilir, bu yüzden sıkı tutun—teknoloji yığınına, temel kısıtlamalara ve sıkça göz ardı edilen geleneklere odaklanın)
2. İçerik sanat eserine özgüyse (örneğin, "Given/When/Then kullan" specs kurallarına aittir, global bağlama değil) belirli sanat eserleri için `rules:`

AI modellerinin zaten bildiği her şeyi çıkarın. Kısalık konusunda acımasız olun.
```

AI, hangisinin gerekli olduğunu ve hangisinin kırpılabileceğini belirlemenize yardımcı olacaktır.

---

## Yeni Komutlar

Komut kullanılabilirliği profile bağlıdır:

**Varsayılan (`core` profili):**

| Komut | Amaç |
|---------|---------|
| `/opsx:propose` | Bir değişiklik oluşturur ve planlama sanat eserlerini tek adımda üretir |
| `/opsx:explore` | Fikirleri yapı olmadan düşünür |
| `/opsx:apply` | tasks.md'deki görevleri uygular |
| `/opsx:archive` | Değişikliği sonlandırır ve arşivler |

**Genişletilmiş iş akışı (özel seçim):**

| Komut | Amaç |
|---------|---------|
| `/opsx:new` | Yeni bir değişiklik iskeleti başlatır |
| `/opsx:continue` | Bir sonraki sanat eserini oluşturur (tek tek) |
| `/opsx:ff` | İleri sarma—planlama sanat eserlerini bir kerede oluşturur |
| `/opsx:verify` | Uygulamanın özelliklerle eşleştiğini doğrular |
| `/opsx:sync` | Arşivlemeden önizleme/özellik birleştirme |
| `/opsx:bulk-archive` | Birden fazla değişikliği bir kerede arşivler |
| `/opsx:onboard` | Yönlendirmeli uçtan uca dahil etme iş akışı |

Genişletilmiş komutları `openspec config profile` ile etkinleştirin, ardından `openspec update` çalıştırın.

### Eski Komutlardan Haritalama

| Eski | OPSX Karşılığı |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (varsayılan) veya `/opsx:new` ardından `/opsx:ff` (genişletilmiş) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Yeni Yetenekler

Bu yetenekler genişletilmiş iş akışı komut setinin bir parçasıdır.

**Ayrıntılı sanat eseri oluşturma:**
```
/opsx:continue
```
Bağımlılıklara göre tek seferde bir sanat eseri oluşturur. Her adımı incelemek istediğinizde bunu kullanın.

**Keşif modu:**
```
/opsx:explore
```
Bir değişikliğe commitment vermeden önce bir partnerle fikirlerinizi düşünün.

---

## Yeni Mimariyi Anlamak

### Faz Kilitlemeden Akışkan Sisteme

Eski iş akışı doğrusal ilerlemeyi zorunlu kılıyordu:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANLAMA   │ ───► │ UYGULAMA     │ ───► │   ARŞİVLEME  │
│    FAZI      │      │    FAZI      │      │    FAZI      │
└──────────────┘      └──────────────┘      └──────────────┘

Uygulama aşamasındayken tasarımın yanlış olduğunu fark ederseniz?
Ne yazık ki, faz kapıları geri dönmenizi kolaylaştırmaz.
```

OPSX fazlar yerine eylemler kullanır:

```
         ┌───────────────────────────────────────────────┐
         │           EYLEMLER (fazlar değil)             │
         │                                               │
         │     yeni ◄──► devam ◄──► uygula ◄──► arşivle │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    herhangi bir sırayla       │
         └───────────────────────────────────────────────┘
```

### Bağımlılık Grafiği

Çıktılar yönlendirilmiş bir graf oluşturur. Bağımlılıklar kapılar değil, etkinleştiricilerdir:

```
                        proposal
                       (kök düğümü)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (gerektirir:                  (gerektirir:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (gerektirir:
                     specs, design)
```

`/opsx:continue` komutunu çalıştırdığınızda, hangi çıktının hazır olduğunu kontrol eder ve bir sonraki çıktıyı önerir. Ayrıca hazır çıktıları herhangi bir sırayla oluşturabilirsiniz.

### Yetenekler vs Komutlar

Eski sistem araçlara özgü komut dosyaları kullanıyordu:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX, gelişen **skills** (yetenekler) standardını kullanır:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Yetenekler, birden fazla AI kodlama aracı tarafından tanınır ve daha zengin metadata sağlar.

---

## Mevcut Değişikliklere Devam Etme

Devam eden değişiklikleriniz OPSX komutlarıyla sorunsuz çalışır.

**Eski iş akışından aktif bir değişikliğiniz mi var?**

```
/opsx:apply add-my-feature
```

OPSX mevcut çıktıları okur ve kaldığınız yerden devam eder.

**Mevcut bir değişikliğe daha fazla çıktı eklemek mi istiyorsunuz?**

```
/opsx:continue add-my-feature
```

Mevcut olanlara dayanarak hangilerinin oluşturulmaya hazır olduğunu gösterir.

**Durumu görmek mi istiyorsunuz?**

```bash
openspec status --change add-my-feature
```

---

## Yeni Yapılandırma Sistemi

### config.yaml Yapısı

```yaml
# Zorunlu: Yeni değişiklikler için varsayılan şema
schema: spec-driven

# İsteğe bağlı: Proje bağlamı (maks 50KB)
# TÜM çıktı talimatlarına enjekte edilir
context: |
  Proje geçmişiniz, teknoloji yığınınız,
  kurallarınız ve kısıtlamalarınız.

# İsteğe bağlı: Çıktıya özel kurallar
# Yalnızca eşleşen çıktılara enjekte edilir
rules:
  proposal:
    - Geri alma planı dahil et
  specs:
    - Given/When/Then formatı kullan
  design:
    - Alternatif stratejileri belgele
  tasks:
    - Maksimum 2 saatlik parçalara böl
```

### Şema Çözümlemesi

Hangi şemanın kullanılacağı belirlenirken, OPSX sırayla kontrol eder:

1. **CLI bayrağı**: `--schema <adı>` (en yüksek öncelik)
2. **Değişiklik metadata'sı**: Değişiklik dizinindeki `.openspec.yaml`
3. **Proje yapılandırması**: `openspec/config.yaml`
4. **Varsayılan**: `spec-driven`

### Mevcut Şemalar

| Şema | Çıktılar | En İyisi İçin |
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

Veya mevcut bir şemadan çatallayın:

```bash
openspec schema fork spec-driven my-workflow
```

Ayrıntılar için [Özelleştirme](customization.md) bölümüne bakın.

---

## Sorun Giderme

### "Etkileşimli olmayan modda eski dosyalar tespit edildi"

CI veya etkileşimli olmayan bir ortamda çalıştırıyorsunuz. Şunu kullanın:

```bash
openspec init --force
```

### Göç sonrası komutlar görünmüyor

IDE'nizi yeniden başlatın. Yetenekler başlangıçta algılanır.

### "Kurallarda bilinmeyen çıktı ID'si"

`rules:` anahtarlarınızın şemanızın çıktı ID'leriyle eşleştiğinden emin olun:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Geçerli çıktı ID'lerini görmek için şunu çalıştırın:

```bash
openspec schemas --json
```

### Yapılandırma uygulanmıyor

1. Dosyanın `openspec/config.yaml` konumunda olduğundan emin olun (`.yml` değil)
2. YAML sözdizimini doğrulayın
3. Yapılandırma değişiklikleri hemen yürürlüğe girir—yeniden başlatma gerekmez

### project.md göç edilmemiş

Sistem kasıtlı olarak `project.md` dosyasını korur çünkü özel içeriğinizi içerebilir. Manuel olarak inceleyin, faydalı kısımları `config.yaml`'a taşıyın, ardından silin.

### Temizlenecek olanları görmek mi istiyorsunuz?

Init komutunu çalıştırın ve temizleme istemini reddedin—hiçbir değişiklik yapılmadan tam tespit özetini göreceksiniz.

---

## Hızlı Başvuru

### Göç Sonrası Dosyalar

```
project/
├── openspec/
│   ├── specs/                    # Değişmedi
│   ├── changes/                  # Değişmedi
│   │   └── archive/              # Değişmedi
│   └── config.yaml               # YENİ: Proje yapılandırması
├── .claude/
│   └── skills/                   # YENİ: OPSX yetenekleri
│       ├── openspec-propose/     # varsayılan çekirdek profili
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       └── ...                   # genişletilmiş profil yeni/devam/ff/vs. ekler
├── CLAUDE.md                     # OpenSpec işaretçileri kaldırıldı, içeriğiniz korundu
└── AGENTS.md                     # OpenSpec işaretçileri kaldırıldı, içeriğiniz korundu
```

### Kaldırılan Şeyler

- `.claude/commands/openspec/` — `.claude/skills/` ile değiştirildi
- `openspec/AGENTS.md` — artık kullanılmıyor
- `openspec/project.md` — `config.yaml`'a göç edin, ardından silin
- `CLAUDE.md`, `AGENTS.md` vb. içindeki OpenSpec işaretçi blokları

### Komut Hızlı Başvurusu

```text
/opsx:propose      Hızlıca başla (varsayılan çekirdek profili)
/opsx:apply        Görevleri uygula
/opsx:archive      Bitir ve arşivle

# Genişletilmiş iş akışı (etkinleştirilmişse):
/opsx:new          Bir değişiklik iskeleti oluştur
/opsx:continue     Bir sonraki çıktıyı oluştur
/opsx:ff           Planlama çıktılarını oluştur
```

---

## Yardım Alma

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Sorunları**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Dokümantasyon**: Tam OPSX referansı için [docs/opsx.md](opsx.md)