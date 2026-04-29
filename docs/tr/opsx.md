# OPSX İş Akışı

> Geri bildirimlerinizi [Discord](https://discord.gg/YctCnvvshC) üzerinden bekliyoruz.

## Nedir?

OPSX artık OpenSpec için standart iş akışıdır.

OpenSpec değişiklikleri için **akıcı, yinelemeli bir iş akışı** sunar. Artık katı aşamalar yok — yalnızca istediğiniz zaman gerçekleştirebileceğiniz eylemler var.

## Neden Bu Var

Eski OpenSpec iş akışı çalışıyor, ancak **kısıtlı**:

- **Talimatlar kodlanmış** — TypeScript içinde gizli, değiştiremezsiniz
- **Hep ya da hiç** — tek bir büyük komut her şeyi oluşturur, parçaları ayrı ayrı test edemezsiniz
- **Sabit yapı** — herkes için aynı iş akışı, özelleştirme yok
- **Kara kutu** — AI çıktısı kötü olduğunda, istemleri ayarlayamazsınız

**OPSX onu açıyor.** Artık herkes şunları yapabilir:

1. **Talimatlarla deney yapın** — bir şablonu düzenleyin, AI'nin daha iyi yapıp yapmadığını görün
2. **Ayrıntılı test edin** — her bir çıktının talimatlarını bağımsız olarak doğrulayın
3. **İş akışlarını özelleştirin** — kendi çıktlarınızı ve bağımlılıklarınızı tanımlayın
4. **Hızlıca yineleyin** — bir şablonu değiştirin, hemen test edin, yeniden oluşturmaya gerek yok

```
Eski iş akışı:                          OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Pakette kodlanmış     │           │  schema.yaml           │◄── Bunu düzenlersiniz
│  (değiştirilemez)      │           │  templates/*.md        │◄── Ya da bunu
│        ↓               │           │        ↓               │
│  Yeni sürüm bekleyin   │           │  Anında etki           │
│        ↓               │           │        ↓               │
│  Daha iyi olmasını     │           │  Kendiniz test edin    │
│  umut edin             │           │                        │
└────────────────────────┘           └────────────────────────┘
```

**Bu herkes içindir:**
- **Takımlar** — gerçekten çalıştığınız şekilde iş akışları oluşturun
- **Gelişmiş kullanıcılar** — kod tabanınız için daha iyi AI çıktıları almak için istemleri ayarlayın
- **OpenSpec katkıda bulunanları** — sürümler olmadan yeni yaklaşımlarla deney yapın

Hâlâ en iyi çalışan şeyin ne olduğunu birlikte öğreniyoruz. OPSX bize birlikte öğrenme imkanı tanıyor.

## Kullanıcı Deneyimi

**Doğrusal iş akışlarının sorunu:**
"Planlama aşamasındasınız", sonra "uygulama aşamasındasınız", sonra "bitti". Ancak gerçek çalışma böyle çalışmaz. Bir şey uygularsınız, tasarımınızın yanlış olduğunu fark edersiniz, spesifikasyonları güncellemeniz gerekir, uygulamaya devam edersiniz. Doğrusal aşamalar, çalışmanın aslında nasıl gerçekleştiğine karşı koyar.

**OPSX yaklaşımı:**
- **Aşamalar değil, eylemler** — oluşturun, uygulayın, güncelleyin, arşivleyin — bunlardan herhangi birini istediğiniz zaman yapın
- **Bağımlılıklar birer olanaktır** — neyin mümkün olduğunu gösterirler, bir sonraki adımda neyin gerekli olduğunu değil

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Kurulum

```bash
# openspec'in kurulu olduğundan emin olun — beceriler otomatik olarak oluşturulur
openspec init
```

Bu, `.claude/skills/` (veya eşdeğeri) içinde AI kodlama asistanlarının otomatik olarak algıladığı beceriler oluşturur.

Varsayılan olarak OpenSpec, `core` iş akışı profilini (`propose`, `explore`, `apply`, `archive`) kullanır. Genişletilmiş iş akışı komutlarını (`new`, `continue`, `ff`, `verify`, `sync`, `bulk-archive`, `onboard`) istiyorsanız, bunları `openspec config profile` ile yapılandırın ve `openspec update` ile uygulayın.

Kurulum sırasında bir **proje yapılandırması** (`openspec/config.yaml`) oluşturmanız istenecektir. Bu isteğe bağlıdır ancak önerilir.

## Proje Yapılandırması

Proje yapılandırması, varsayılanları ayarlamanıza ve tüm çıktılara proje bağlamını enjekte etmenize olanak tanır.

### Yapılandırma Oluşturma

Yapılandırma, `openspec init` sırasında veya manuel olarak oluşturulur:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Teknoloji yığını: TypeScript, React, Node.js
  API kuralları: RESTful, JSON yanıtları
  Test: Birim testleri için Vitest, uçtan uca testler için Playwright
  Stil: ESLint ve Prettier ile, katı TypeScript

rules:
  proposal:
    - Geri alma planı dahil edin
    - Etkilenen takımları belirtin
  specs:
    - Senaryolar için Given/When/Then formatı kullanın
  design:
    - Karmaşık akışlar için sıralama diyagramları dahil edin
```

### Yapılandırma Alanları

| Alan | Tür | Açıklama |
|-------|------|-------------|
| `schema` | string | Yeni değişiklikler için varsayılan şema (ör. `spec-driven`) |
| `context` | string | Tüm çıktılara enjekte edilen proje bağlamı |
| `rules` | object | Çıktıya özel kurallar, çıktı ID'sine göre anahtarlanmıştır |

### Nasıl Çalışır

**Şema önceliği** (en yüksekten en düşüğe):
1. CLI bayrağı (`--schema <adı>`)
2. Değişiklik meta verileri (değişiklik dizinindeki `.openspec.yaml`)
3. Proje yapılandırması (`openspec/config.yaml`)
4. Varsayılan (`spec-driven`)

**Bağlam enjeksiyonu:**
- Bağlam, her çıktının talimatlarının başına eklenir
- `<context>...</context>` etiketlerine sarılır
- AI'nin projenizin kurallarını anlamasına yardımcı olur

**Kural enjeksiyonu:**
- Kurallar yalnızca eşleşen çıktılara enjekte edilir
- `<rules>...</rules>` etiketlerine sarılır
- Bağlamdan sonra, şablondan önce görünür

### Şemalara Göre Çıktı ID'leri

**spec-driven** (varsayılan):
- `proposal` — Değişiklik önerisi
- `specs` — Spesifikasyonlar
- `design` — Teknik tasarım
- `tasks` — Uygulama görevleri

### Yapılandırma Doğrulaması

- `rules` içindeki bilinmeyen çıktı ID'leri uyarılar üretir
- Şema adları mevcut şemalara göre doğrulanır
- Bağlam için 50KB boyut sınırı vardır
- Geçersiz YAML satır numaralarıyla birlikte raporlanır

### Sorun Giderme

**"Rules içinde bilinmeyen çıktı ID'si: X"**
- Çıktı ID'lerinizin şemanızla eşleştiğinden emin olun (yukarıdaki listeye bakın)
- Her şema için çıktı ID'lerini görmek için `openspec schemas --json` komutunu çalıştırın

**Yapılandırma uygulanmıyor:**
- Dosyanın `openspec/config.yaml` konumunda olduğundan emin olun (`.yml` değil)
- YAML sözdizimini bir doğrulayıcı ile kontrol edin
- Yapılandırma değişiklikleri hemen yürürlüğe girer (yeniden başlatma gerekmez)

**Bağlam çok büyük:**
- Bağlam 50KB ile sınırlıdır
- Özetleyin veya harici belgelere bağlantı verin

## Komutlar

| Komut | Ne yapar |
|---------|--------------|
| `/opsx:propose` | Bir değişiklik oluşturur ve planlama çıktılarını tek adımda üretir (varsayılan hızlı yol) |
| `/opsx:explore` | Fikirler üzerinde düşünür, sorunları araştırır, gereksinimleri netleştirir |
| `/opsx:new` | Yeni bir değişiklik iskeleti başlatır (genişletilmiş iş akışı) |
| `/opsx:continue` | Bir sonraki çıktıyı oluşturur (genişletilmiş iş akışı) |
| `/opsx:ff` | Planlama çıktılarını hızlıca ileri sarar (genişletilmiş iş akışı) |
| `/opsx:apply` | Görevleri uygular, gerektiğinde çıktıları günceller |
| `/opsx:verify` | Uygulamayı çıktılara göre doğrular (genişletilmiş iş akışı) |
| `/opsx:sync` | Delta spesifikasyonlarını ana dala senkronize eder (genişletilmiş iş akışı, isteğe bağlı) |
| `/opsx:archive` | Bittiğinde arşivler |
| `/opsx:bulk-archive` | Birden fazla tamamlanmış değişikliği arşivler (genişletilmiş iş akışı) |
| `/opsx:onboard` | Uçtan uca bir değişikliğin yönlendirmeli turunu yapar (genişletilmiş iş akışı) |

## Kullanım

### Bir fikri keşfedin
```
/opsx:explore
```
Fikirler üzerinde düşünün, sorunları araştırın, seçenekleri karşılaştırın. Yapı gerekmez - sadece bir düşünme ortağı. İçgörüler netleştiğinde, `/opsx:propose`'a (varsayılan) veya `/opsx:new`/`/opsx:ff`'e (genişletilmiş) geçin.

### Yeni bir değişiklik başlatın
```
/opsx:propose
```
Değişikliği oluşturur ve uygulama öncesi gerekli planlama çıktılarını üretir.

Genişletilmiş iş akışlarını etkinleştirdiyseniz, bunun yerine şunları kullanabilirsiniz:

```text
/opsx:new        # sadece iskelet
/opsx:continue   # bir seferde bir çıktı oluşturun
/opsx:ff         # tüm planlama çıktılarını bir seferde oluşturun
```

### Çıktılar oluşturun
```
/opsx:continue
```
Bağımlılıklara göre neyin oluşturulmaya hazır olduğunu gösterir, ardından bir çıktı oluşturur. Değişikliğinizi kademeli olarak oluşturmak için tekrar tekrar kullanın.

```
/opsx:ff add-dark-mode
```
Tüm planlama çıktılarını bir seferde oluşturur. Ne inşa ettiğinize dair net bir resminiz olduğunda kullanın.

### Uygulayın (akışkan kısım)
```
/opsx:apply
```
Görevler üzerinde çalışır, ilerledikçe bunları işaretler. Birden fazla değişiklikle uğraşıyorsanız, `/opsx:apply <adı>` komutunu çalıştırabilirsiniz; aksi takdirde konuşmadan çıkarmalı ve söyleyemezse seçmeniz için size sormalıdır.

### Bitirin
```
/opsx:archive   # Bittiğinde arşive taşıyın (gerekirse spesifikasyonları senkronize etmenizi ister)
```

## Ne Zaman Güncelleme Yapılır vs. Sıfırdan Başlanır

Uygulama öncesi her zaman önerinizi veya spesifikasyonlarınızı düzenleyebilirsiniz. Ancak iyileştirme ne zaman "bu farklı bir çalışma" haline gelir?

### Bir Öneri Neyi Yakalar

Bir öneri üç şeyi tanımlar:
1. **Niyet** — Hangi sorunu çözüyorsunuz?
2. **Kapsam** — Neler dahil/dahil değil?
3. **Yaklaşım** — Bunu nasıl çözeceksiniz?

Soru şu: Hangisi değişti ve ne kadar?

### Mevcut Değişikliği Güncelleyin Şunlar Olduğunda:

**Aynı niyet, iyileştirilmiş uygulama**
- Düşünmediğiniz uç durumlar keşfediniz
- Yaklaşım ayarlanmalı ancak hedef değişmedi
- Uygulama, tasarımın biraz hatalı olduğunu ortaya koyuyor

**Kapsam daralıyor**
- Tam kapsamın çok büyük olduğunu fark ediyorsunuz, önce MVP'yi göndermek istiyorsunuz
- "Karanlık mod ekle" → "Karanlık mod anahtarı ekle (sistem tercihi v2'de)"

**Öğrenmeye dayalı düzeltmeler**
- Kod tabanı düşündüğünüz gibi yapılandırılmamış
- Bir bağımlılık beklediğiniz gibi çalışmıyor
- "CSS değişkenleri kullan" → "Bunun yerine Tailwind'in dark: ön ekini kullan"

### Yeni Bir Değişiklik Başlatın Şunlar Olduğunda:

**Niyet kökten değişti**
- Sorunun kendisi artık farklı
- "Karanlık mod ekle" → "Özel renkler, yazı tipleri, boşluklar ile kapsamlı bir tema sistemi ekle"

**Kapsam patladı**
- Değişiklik o kadar büyüdü ki aslında farklı bir çalışma haline geldi
- Orijinal öneri güncellemelerden sonra tanınmaz hale gelirdi
- "Giriş hatasını düzelt" → "Kimlik doğrulama sistemini yeniden yaz"

**Orijinal tamamlanabilir**
- Orijinal değişiklik "bitti" olarak işaretlenebilir
- Yeni çalışma bağımsızdır, bir iyileştirme değil
- "Karanlık mod MVP'si ekle" tamamla → Arşivle → Yeni değişiklik "Karanlık modu geliştir"

### Sezgisel Kurallar

```
                        ┌─────────────────────────────────────┐
                        │     Bu aynı çalışma mı?            │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Aynı niyet mi?    >50% örtüşme mi?    Orijinal bu
             Aynı sorun mu?    Aynı kapsam mı?     değişiklikler olmadan
                    │                  │              "bitti" olabilir mi?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         EVET              HAYIR EVET        HAYIR HAYIR          EVET
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       GÜNCELLE          YENİ GÜNCELLE     YENİ GÜNCELLE        YENİ
```

| Test | Güncelleme | Yeni Değişiklik |
|------|--------|------------|
| **Kimlik** | "Aynı şey, iyileştirilmiş" | "Farklı bir çalışma" |
| **Kapsam örtüşmesi** | >50% örtüşüyor | <50% örtüşüyor |
| **Tamamlanma** | Değişiklikler olmadan "bitti" olamaz | Orijinal tamamlanabilir, yeni çalışma bağımsızdır |
| **Hikaye** | Güncelleme zinciri tutarlı bir hikaye anlatır | Yamalar kafa karışıklığı yaratır, netlik değil |

### Prensip

> **Güncelleme bağlamı korur. Yeni değişiklik netlik sağlar.**
>
> Düşünme geçmişiniz değerli olduğunda güncellemeyi seçin.
> Sıfırdan başlamak yamamaktan daha net olacaksa yeni değişikliği seçin.

Bunu git dalları gibi düşünün:
- Aynı özellik üzerinde çalışırken sürekli commit yapın
- Gerçekten yeni bir çalışma olduğunda yeni bir dal başlatın
- Bazen kısmi bir özelliği birleştirin ve 2. aşama için sıfırdan başlayın

## Farklar Nelerdir?

| | Legacy (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Yapı** | Tek büyük teklif belgesi | Bağımlılıklara sahip ayrı unsurlar |
| **İş Akışı** | Doğrusal aşamalar: planla → uygula → arşivle | Akıcı eylemler — her zaman her şeyi yapabilirsiniz |
| **Yineleme** | Geri dönmek zor | Öğrendikçe unsurları güncelleyin |
| **Özelleştirme** | Sabit yapı | Şema tarafından驱动 (kendi unsurlarınızı tanımlayın) |

**Temel içgörü:** çalışma doğrusal değildir. OPSX, öyleymiş gibi davranmayı bırakır.

## Mimari Derinlemesine Bakış

Bu bölüm, OPSX'in nasıl çalıştığını ve eski iş akışıyla karşılaştırmasını açıklar.
Bu bölümdeki örnekler genişletilmiş komut setini (`new`, `continue`, vb.) kullanır; varsayılan `core` kullanıcıları aynı iş akışını `propose → apply → archive` olarak eşleyebilir.

### Felsefe: Fazlar mı Eylemler mi

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ESKİ İŞ AKIŞI                                      │
│                    (Faz Kilitli, Hep ya da Hiç)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   PLANLAMA   │ ───► │ UYGULAMA     │ ───► │   ARŞİVLEME  │             │
│   │    FAZI      │      │    FAZI      │      │    FAZI      │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Tüm ürünleri tek seferde oluşturur                                    │
│   • Uygulama sırasında spesifikasyonları güncellemeye geri dönülemez      │
│   • Faz kapıları doğrusal ilerlemeyi zorunlu kılar                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                            OPSX İŞ AKIŞI                                    │
│                      (Akıcı Eylemler, Yinelemeli)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           EYLEMLER (fazlar değil)          │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              herhangi bir sırada           │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Ürünleri tek tek oluşturun VEYA hızlı ileri sarın                     │
│   • Uygulama sırasında spesifikasyonları/tasarımları/görevleri güncelleyin │
│   • Bağımlılıklar ilerlemeyi sağlar, fazlar yoktur                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Bileşen Mimarisi

**Eski iş akışı**, TypeScript'te yerleşik şablonlar kullanır:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ESKİ İŞ AKIŞI BİLEŞENLERİ                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Yerleşik Şablonlar (TypeScript dizeleri)                                  │
│                    │                                                        │
│                    ▼                                                        │
│   Araca özgü yapılandırıcılar/adaptörler                                   │
│                    │                                                        │
│                    ▼                                                        │
│   Oluşturulan Komut Dosyaları (.claude/commands/openspec/*.md)              │
│                                                                             │
│   • Sabit yapı, ürün farkındalığı yok                                     │
│   • Değişiklik kod değişikliği + yeniden oluşturma gerektirir              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX**, harici şemalar ve bir bağımlılık grafik motoru kullanır:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OPSX BİLEŞENLERİ                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Şema Tanımları (YAML)                                                    │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Bağımlılıklar                    │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Glob kalıpları                  │   │
│   │      requires: [proposal]      ◄── Proposal'dan sonra etkinleşir   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Ürün Grafiği Motoru                                                      │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Topolojik sıralama (bağımlılık sıralaması)                      │   │
│   │  • Durum algılama (dosya sistemi varlığı)                           │   │
│   │  • Zengin talimat üretimi (şablonlar + bağlam)                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Yetenek Dosyaları (.claude/skills/openspec-*/SKILL.md)                   │
│                                                                             │
│   • Çapraz düzenleyici uyumlu (Claude Code, Cursor, Windsurf)              │
│   • Yetenekler yapılandırılmış veri için CLI sorgular                      │
│   • Şema dosyaları aracılığıyla tamamen özelleştirilebilir                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Bağımlılık Grafik Modeli

Ürünler yönlü döngüsüz bir grafik (DAG) oluşturur. Bağımlılıklar kapılar değil, **etkinleştiricilerdir**:

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
                                  │
                                  ▼
                          ┌──────────────┐
                          │ UYGULAMA FAZI│
                          │ (gerektirir: │
                          │  tasks)      │
                          └──────────────┘
```

**Durum geçişleri:**

```
   ENGELLİ ────────────────► HAZIR ────────────────► TAMAMLANMIŞ
      │                        │                       │
   Eksik                     Tüm bağımlılıklar      Dosya dosya
   bağımlılıklar             TAMAMLANMIŞ             sisteminde var
```

### Bilgi Akışı

**Eski iş akışı** — ajan statik talimatlar alır:

```
  Kullanıcı: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Statik talimatlar:                     │
  │  • proposal.md oluşturun                │
  │  • tasks.md oluşturun                   │
  │  • design.md oluşturun                  │
  │  • specs/<yetenek>/spec.md oluşturun    │
  │                                         │
  │  Ürünlerin ne olduğu veya               │
  │  aralarındaki bağımlılıklar hakkında     │
  │  farkındalık yok                        │
  └─────────────────────────────────────────┘
           │
           ▼
  Ajan TÜM ürünleri tek seferde oluşturur
```

**OPSX** — ajan zengin bağlam için sorgular:

```
  Kullanıcı: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Adım 1: Mevcut durumu sorgula                                          │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec status --change "add-auth" --json                      │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "artifacts": [                                                  │  │
  │  │      {"id": "proposal", "status": "done"},                         │  │
  │  │      {"id": "specs", "status": "ready"},      ◄── İlk hazır       │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked", "missingDeps": ["specs"]}│  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Adım 2: Hazır ürün için zengin talimatlar al                           │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec instructions specs --change "add-auth" --json          │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "template": "# Spesifikasyon\n\n## EKLENEN Gereksinimler...",   │  │
  │  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
  │  │    "unlocks": ["tasks"]                                            │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Adım 3: Bağımlılıkları oku → BİR ürün oluştur → Nelerin açıldığını    │
  │          göster                                                         │
  └──────────────────────────────────────────────────────────────────────────┘
```

### Yineleme Modeli

**Eski iş akışı** — yinelemek zahmetlidir:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Bekle, tasarım yanlış"
       │               │
       │               ├── Seçenekler:
       │               │   • Dosyaları manuel düzenle (bağlamı bozar)
       │               │   • Vazgeç ve baştan başla
       │               │   • Devam et ve sonra düzelt
       │               │
       │               └── Resmi "geri dön" mekanizması yok
       │
       └── TÜM ürünleri tek seferde oluşturur
```

**OPSX** — doğal yineleme:

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── "Tasarım yanlış"
      │                │                  │
      │                │                  ▼
      │                │            Sadece design.md'yi düzenle
      │                │            ve devam et!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply kaldığın
      │                │         yerden devam eder
      │                │
      │                └── BİR ürün oluşturur, nelerin açıldığını gösterir
      │
      └── Değişikliği iskeletler, yön bekler
```

### Özel Şemalar

Şema yönetim komutlarını kullanarak özel iş akışları oluşturun:

```bash
# Sıfırdan yeni bir şema oluşturun (etkileşimli)
openspec schema init my-workflow

# Veya mevcut bir şemayı başlangıç noktası olarak çatallayın
openspec schema fork spec-driven my-workflow

# Şema yapınızı doğrulayın
openspec schema validate my-workflow

# Bir şemanın nereden çözüldüğünü görün (hata ayıklama için faydalı)
openspec schema which my-workflow
```

Şemalar `openspec/schemas/` (proje yerel, sürüm kontrolünde) veya `~/.local/share/openspec/schemas/` (kullanıcı genel) konumunda saklanır.

**Şema yapısı:**
```
openspec/schemas/research-first/
├── schema.yaml
└── templates/
    ├── research.md
    ├── proposal.md
    └── tasks.md
```

**Örnek schema.yaml:**
```yaml
name: research-first
artifacts:
  - id: research        # Proposal'dan önce eklendi
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Artık research'e bağlı

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**Bağımlılık Grafiği:**
```
   research ──► proposal ──► tasks
```

### Özet

| Yön          | Eski İş Akışı          | OPSX                     |
|--------------|------------------------|--------------------------|
| **Şablonlar**| Yerleşik TypeScript    | Harici YAML + Markdown   |
| **Bağımlılıklar**| Yok (hepsi bir anda) | Topolojik sıralamalı DAG |
| **Durum**    | Faza dayalı zihinsel model | Dosya sistemi varlığı   |
| **Özelleştirme**| Kaynağı düzenle, yeniden oluştur | schema.yaml oluştur |
| **Yineleme** | Faz kilitli            | Akıcı, her şeyi düzenle |
| **Düzenleyici Desteği**| Araca özgü yapılandırıcı/adaptörler | Tek yetenekler dizini |

## Şemalar

Şemalar, hangi çıktılara sahip olduklarını ve bunların bağımlılıklarını tanımlar. Şu anda mevcut olanlar:

- **spec-driven** (varsayılan): proposal → specs → design → tasks

```bash
# Mevcut şemaları listele
openspec schemas

# Tüm şemaları ve çözüm kaynaklarını gör
openspec schema which --all

# Yeni bir şemayı etkileşimli olarak oluştur
openspec schema init my-workflow

# Özelleştirme için mevcut bir şemayı çatalla
openspec schema fork spec-driven my-workflow

# Kullanımdan önce şema yapısını doğrula
openspec schema validate my-workflow
```

## İpuçları

- Bir değişiklik yapmadan önce bir fikri düşünmek için `/opsx:explore` kullanın
- Ne istediğinizi biliyorsanız `/opsx:ff`, keşfediyorsanız `/opsx:continue` kullanın
- `/opsx:apply` sırasında bir sorun varsa — çıktıyı düzeltin, ardından devam edin
- Görevler `tasks.md` içindeki onay kutuları aracılığıyla ilerlemeyi takip eder
- Durumu istediğiniz zaman kontrol edin: `openspec status --change "name"`

## Geri Bildirim

Bu hâlâ kaba. Bu kasıtlı — neyin işe yaradığını öğreniyoruz.

Bir hata mı buldunuz? Fikirleriniz mi var? Bize [Discord](https://discord.gg/YctCnvvshC) üzerinden katılın veya [GitHub](https://github.com/Fission-AI/openspec/issues) üzerinden bir sorun açın.