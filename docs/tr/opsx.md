# OPSX İş Akışı

> Geri bildirimlerinizi [Discord](https://discord.gg/YctCnvvshC) üzerinden iletebilirsiniz.

## Nedir?

OPSX artık OpenSpec için standart iş akışıdır.

OpenSpec değişiklikleri için **akışkan, yinelemeli bir iş akışıdır**. Artık katı fazlar yok — istediğiniz zaman gerçekleştirebileceğiniz eylemler var.

## Neden Var?

Eski OpenSpec iş akışı çalışıyor, ancak **kilitli durumda**:

- **Talimatlar sabit kodlanmış** — TypeScript içine gömülü, değiştiremezsiniz
- **Ya hep ya hiç** — tek büyük komut her şeyi oluşturur, parçaları tek tek test edemezsiniz
- **Sabit yapı** — herkes için aynı iş akışı, özelleştirme yok
- **Kara kutu** — AI çıktısı kötü olduğunda, istemleri ayarlayamazsınız

**OPSX bunu açıyor.** Artık herkes şunları yapabilir:

1. **Talimatlarla deney yapın** — bir şablonu düzenleyin, AI'ın daha iyi çalışıp çalışmadığını görün
2. **Ayrıntılı test edin** — her bir yapıtın talimatlarını bağımsız olarak doğrulayın
3. **İş akışlarını özelleştirin** — kendi yapıtlarınızı ve bağımlılıklarınızı tanımlayın
4. **Hızlı yineleme yapın** — bir şablonu değiştirin, hemen test edin, yeniden derleme gerekmez

```
Eski iş akışı:                      OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Pakette sabit kodlanmış  │           │  schema.yaml           │◄── Bunu düzenlersiniz
│  (değiştirilemez)        │           │  templates/*.md        │◄── Ya da bunu
│        ↓               │           │        ↓               │
│  Yeni sürüm bekle       │           │  Anlık etki            │
│        ↓               │           │        ↓               │
│  Daha iyi olmasını um   │           │  Kendi test et         │
└────────────────────────┘           └────────────────────────┘
```

**Bu herkes için:**
- **Ekipler** — gerçekte çalıştığınız şekilde eşleşen iş akışları oluşturun
- **Güç kullanıcıları** — kod tabanınız için daha iyi AI çıktıları almak üzere istemleri ayarlayın
- **OpenSpec katkıda bulunanları** — sürüm yayınlamadan yeni yaklaşımlarla deney yapın

Hepimiz hala en iyi çalışan şeyleri öğreniyoruz. OPSX birlikte öğrenmemizi sağlıyor.

## Kullanıcı Deneyimi

**Doğrusal iş akışlarının sorunu:**
Önce "planlama aşamasındasınız", sonra "uygulama aşamasındasınız", sonra "bitti". Ancak gerçek iş bu şekilde çalışmaz. Bir şey uygularsınız, tasarımınızın yanlış olduğunu fark edersiniz, spesifikasyonları güncellemeniz gerekir, uygulamaya devam edersiniz. Doğrusal aşamalar, işin gerçekte nasıl gerçekleştiğiyle çelişir.

**OPSX yaklaşımı:**
- **Eylemler, aşamalar değil** — oluştur, uygula, güncelle, arşivle — bunlardan herhangi birini istediğiniz zaman yapın
- **Bağımlılıklar mümkün kılan şeylerdir** — sıradaki gerekenleri değil, mümkün olanları gösterirler

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Kurulum

```bash
# openspec yüklü olduğundan emin olun — skills otomatik olarak oluşturulur
openspec init
```

Bu, `.claude/skills/` (veya eşdeğeri) konumunda skills oluşturur, AI kod asistanları bunları otomatik olarak algılar.

Varsayılan olarak OpenSpec, `core` iş akışı profilini (`propose`, `explore`, `apply`, `sync`, `archive`) kullanır. Genişletilmiş iş akışı komutlarını (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) kullanmak istiyorsanız, `openspec config profile` ile yapılandırın ve `openspec update` ile uygulayın.

Kurulum sırasında bir **proje yapılandırması** (`openspec/config.yaml`) oluşturmanız istenir. Bu isteğe bağlıdır ancak önerilir.

## Proje Yapılandırması

Proje yapılandırması, tüm yapıtlara ön tanımlar ayarlamanızı ve proje özel bağlam eklemenizi sağlar.

### Yapılandırma Oluşturma

Yapılandırma, `openspec init` sırasında veya elle oluşturulur:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Teknoloji yığını: TypeScript, React, Node.js
  API kuralları: RESTful, JSON yanıtları
  Test: Birim testleri için Vitest, e2e için Playwright
  Stil: ESLint ve Prettier ile, katı TypeScript

rules:
  proposal:
    - Geri dönüş planı ekle
    - Etkilenen ekipleri belirle
  specs:
    - Senaryolar için Given/When/Then formatını kullan
  design:
    - Karmaşık akışlar için sıra diyagramları ekle
```

### Yapılandırma Alanları

| Alan | Türü | Açıklama |
|------|------|----------|
| `schema` | dize | Yeni değişiklikler için varsayılan şema (ör. `spec-driven`) |
| `context` | dize | Tüm yapıt talimatlarına eklenen proje bağlamı |
| `rules` | nesne | Yapıt kimliğine göre anahtarlanmış, yapıt başına kurallar |

### Nasıl Çalışır?

**Şema önceliği** (yüksekten düşüğe):
1. CLI bayrağı (`--schema <ad>`)
2. Değişiklik meta verileri (değişiklik dizinindeki `.openspec.yaml`)
3. Proje yapılandırması (`openspec/config.yaml`)
4. Varsayılan (`spec-driven`)

**Bağlam ekleme:**
- Bağlam, her yapıtın talimatlarının başına eklenir
- `<context>...</context>` etiketleriyle sarılır
- AI'ın proje kurallarınızı anlamasına yardımcı olur

**Kural ekleme:**
- Kurallar yalnızca eşleşen yapıtlar için eklenir
- `<rules>...</rules>` etiketleriyle sarılır
- Bağlamdan sonra, şablonlardan önce görünür

### Şemaya Göre Yapıt Kimlikleri

**spec-driven** (varsayılan):
- `proposal` — Değişiklik önerisi
- `specs` — Spesifikasyonlar
- `design` — Teknik tasarım
- `tasks` — Uygulama görevleri

### Yapılandırma Doğrulama

- `rules` içindeki bilinmeyen yapıt kimlikleri uyarı üretir
- Şema adları, mevcut şemalara göre doğrulanır
- Bağlamın 50KB boyut sınırı vardır
- Geçersiz YAML, satır numaralarıyla raporlanır

### Sorun Giderme

**"rules içinde bilinmeyen yapıt kimliği: X"**
- Yapıt kimliklerinin şemanızla eşleştiğinden emin olun (yukarıdaki listeye bakın)
- Her şema için yapıt kimliklerini görmek üzere `openspec schemas --json` komutunu çalıştırın

**Yapılandırma uygulanmıyor:**
- Dosyanın `openspec/config.yaml` konumunda olduğundan emin olun (`.yml` değil)
- Bir doğrulayıcı ile YAML sözdizimini kontrol edin
- Yapılandırma değişiklikleri hemen etkili olur (yeniden başlatma gerekmez)

**Bağlam çok büyük:**
- Bağlam 50KB ile sınırlıdır
- Bunun yerine özetleyin veya harici belgelere bağlantı verin

## Komutlar

| Komut | Ne yapar |
|-------|----------|
| `/opsx:propose` | Tek adımda bir değişiklik oluştur ve planlama yapıtlarını üret (varsayılan hızlı yol) |
| `/opsx:explore` | Fikirleri düşün, sorunları araştır, gereksinimleri netleştir |
| `/opsx:new` | Yeni bir değişiklik iskeleti başlat (genişletilmiş iş akışı) |
| `/opsx:continue` | Sonraki yapıtı oluştur (genişletilmiş iş akışı) |
| `/opsx:ff` | Planlama yapıtlarını hızlı ilerlet (genişletilmiş iş akışı) |
| `/opsx:apply` | Görevleri uygula, gerekli olduğunda yapıtları güncelle |
| `/opsx:update` | Bir değişikliğin planlama yapıtlarını düzelt ve tutarlı kalmasını sağla |
| `/opsx:verify` | Uygulamayı yapıtlara göre doğrula (genişletilmiş iş akışı) |
| `/opsx:sync` | Delta specs'i ana dala senkronize et (varsayılan iş akışı, isteğe bağlı) |
| `/opsx:archive` | Bittiğinde arşivle |
| `/opsx:bulk-archive` | Birden fazla tamamlanmış değişikliği arşivle (genişletilmiş iş akışı) |
| `/opsx:onboard` | Uçtan uca bir değişikliğin yönlendirilmiş ilerlemesi (genişletilmiş iş akışı) |

## Kullanım

### Bir fikri keşfedin
```
/opsx:explore
```
Fikirleri düşünün, sorunları araştırın, seçenekleri karşılaştırın. Hiçbir yapı gerektirmez - sadece bir düşünme ortağı. İçgörüler netleştiğinde, `/opsx:propose` (varsayılan) veya `/opsx:new`/`/opsx:ff` (genişletilmiş) komutlarına geçin.

### Yeni bir değişiklik başlat
```
/opsx:propose
```
Değişikliği oluşturur ve uygulamadan önce gerekli planlama yapıtlarını üretir.

Genişletilmiş iş akışlarını etkinleştirdiyseniz, bunun yerine şunları kullanabilirsiniz:

```text
/opsx:new        # yalnızca iskelet
/opsx:continue   # tek seferde bir yapıt oluştur
/opsx:ff         # tüm planlama yapıtlarını tek seferde oluştur
```

### Yapıtlar oluştur
```
/opsx:continue
```
Bağımlılıklara göre oluşturulmaya hazır olanları gösterir, ardından tek bir yapıt oluşturur. Değişikliğinizi kademeli olarak oluşturmak için tekrar tekrar kullanın.

```
/opsx:ff add-dark-mode
```
Tüm planlama yapıtlarını tek seferde oluşturur. Ne inşa ettiğiniz konusunda net bir görüğünüz olduğunda kullanın.

### Uygula (akışkan kısım)
```
/opsx:apply
```
Görevler üzerinden geçer, ilerledikçe onları işaretler. Birden fazla değişikliği aynı anda yürütüyorsanız `/opsx:apply <ad>` komutunu çalıştırabilirsiniz; aksi takdirde konuşmadan yorum yapmalı ve seçmenizi istemelidir.

### Bir değişikliği güncelleme
```
/opsx:update add-dark-mode - we're storing the theme in a cookie now
```
Değişikliğin mevcut planlama yapıtlarını düzeltir ve her yönde tutarlı kalmasını sağlar - herhangi bir yönde (bir tasarım düzenlemesi öneriye geri yansıyabilir). Yalnızca planlama yapıtları: hiç kod düzenlemez ve eksik yapıtlar oluşturmaz (bunun için `/opsx:continue` kullanın). Her düzenleme öncelikle sizinle onaylanır. Değişiklik zaten uygulandıysa, düzeltilen plana kodun yetişmesi için `/opsx:apply` önerir. Düzenlemeniz değişikliğin *niyetini* değiştiriyorsa, bunun yerine sıfırdan başlayın - bkz. [Güncelleme vs. Sıfırdan Başlama](#when-to-update-vs-start-fresh).

### Bitirme
```
/opsx:archive   # Bittiğinde arşive taşı (gerekirse specs'i senkronize etmek için sorar)
```

## Güncelleme vs. Sıfırdan Başlama Ne Zaman

Uygulamadan önce her zaman önerinizi veya specs'inizi düzenleyebilirsiniz. Ancak iyileştirme ne zaman "bu farklı iş" haline gelir?

### Bir Önerinin Ne Yakaladığı

Bir öneri üç şey tanımlar:
1. **Niyet** — Hangi sorunu çözüyorsunuz?
2. **Kapsam** — Sınırların içinde/ dışında ne var?
3. **Yaklaşım** — Bunu nasıl çözeceksiniz?

Soru şu: hangisi değişti ve ne kadar değişti?

### Mevcut Değişikliği Ne Zaman Güncelleyin:

**Aynı niyet, iyileştirilmiş uygulama**
- Düşünmediğiniz kenar durumları keşfedersiniz
- Yaklaşımda küçük ayarlar gerekir ama hedef değişmez
- Uygulama tasarımın biraz yanlış olduğunu ortaya çıkarır

**Kapsam daralır**
- Tam kapsamın çok büyük olduğunu fark edersiniz, önce MVP'yi yayınlamak istersiniz
- "Karanlık mod ekle" → "Karanlık mod anahtarı ekle (v2'de sistem tercihi)"

**Öğrenme odaklı düzeltmeler**
- Kod tabanı düşündüğünüz gibi yapılandırılmamıştır
- Bir bağımlılık beklenildiği gibi çalışmıyor
- "CSS değişkenleri kullan" → "Bunun yerine Tailwind'un dark: önekini kullan"

### Yeni Bir Değişikliği Ne Zaman Başlatın:

**Niyet temel olarak değişti**
- Sorunun kendisi şimdi farklı
- "Karanlık mod ekle" → "Özel renkler, yazı tipleri, boşluklarla kapsamlı tema sistemi ekle"

**Kapsam patladı**
- Değişiklik o kadar çok büyüdü ki temel olarak farklı iş haline geldi
- Orijinal öneri güncellemelerden sonra tanınmaz hale gelir
- "Giriş hatasını düzelt" → "Kimlik doğrulama sistemini yeniden yaz"

**Orijinal tamamlanabilir durumda**
- Orijinal değişiklik "tamamlandı" olarak işaretlenebilir
- Yeni iş tek başına durur, bir iyileştirme değildir
- "Karanlık mod MVP'sini tamamla" → Arşivle → Yeni değişiklik "Karanlık modu geliştir"

### Kılavuzlar

```
                        ┌─────────────────────────────────────┐
                        │     Bu aynı iş mi?                  │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Aynı niyet?      >%50 örtüşme?      Orijinal bu
             Aynı sorun?     Aynı kapsam?        değişiklikler olmadan
                    │                  │          "tamamlanabilir" mi?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         EVET              HAYIR EVET        HAYIR HAYIR         EVET
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       GÜNCELLE          YENİ  GÜNCELLE    YENİ  GÜNCELLE       YENİ
```

| Test | Güncelleme | Yeni Değişiklik |
|------|------------|-----------------|
| **Kimlik** | "Aynı şey, iyileştirilmiş hali" | "Farklı iş" |
| **Kapsam örtüşmesi** | >%50 örtüşme | <%50 örtüşme |
| **Tamamlanma** | Değişiklikler olmadan "tamamlanamaz" | Orijinali bitirebilir, yeni iş tek başına durur |
| **Hikaye** | Güncelleme zinciri tutarlı bir hikaye anlatır | Yamalar, netleştirmekten çok kafa karıştırır |

### İlke

> **Güncelleme bağlamı korur. Yeni değişiklik netlik sağlar.**
>
> Düşünce geçmişiniz değerli olduğunda güncellemeyi seçin.
> Yamalama yerine sıfırdan başlamanın daha net olacağı durumlarda yeni seçin.

Bunu git dalları gibi düşünün:
- Aynı özellik üzerinde çalışırken commit yapmaya devam edin
- Gerçekten yeni iş olduğunda yeni bir dal başlatın
- Bazen kısmi bir özelliği birleştirin ve 2. aşama için sıfırdan başlayın

## Farklı Neler Var?

| | Eski (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Yapı** | Tek büyük öneri belgesi | Bağımlılıkları olan ayrı yapıtlar |
| **İş akışı** | Doğrusal aşamalar: planla → uygula → arşivle | Akışkan eylemler — istediğiniz zaman istediğiniz şeyi yapın |
| **Yineleme** | Geri dönmek garip durur | Öğrendikçe yapıtları güncelleyin |
| **Özelleştirme** | Sabit yapı | Şema odaklı (kendi yapıtlarınızı tanımlayın) |

**Temel içgörü:** iş doğrusal değildir. OPSX öyle olduğu iddiasında bulunmayı bırakır.

## Mimari Derinlemesine İnceleme

Bu bölüm, OPSX'nin arka planda nasıl çalıştığını ve eski iş akışıyla nasıl karşılaştığını açıklar. Bu bölümdeki örnekler, genişletilmiş komut setini (`new`, `continue` vb.) kullanır; varsayılan `core` kullanıcıları aynı akışı `propose → apply → sync → archive` olarak eşleştirebilir.

### Felsefe: Aşamalar vs Eylemler

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ESKİ İŞ AKIŞI                                      │
│                    (Aşama Kilitli, Ya Hep Ya Hiç)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │  PLANLAMA    │ ───► │  UYGULAMA    │ ───► │  ARŞİVLEME   │             │
│   │    AŞAMASI   │      │    AŞAMASI   │      │    AŞAMASI   │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Tüm yapıtları bir kerede oluşturur                                     │
│   • Uygulama sırasında spesifikasyonları güncellemek için geri dönülemez    │
│   • Aşama geçitleri doğrusal ilerlemeyi zorunlu kılar                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            OPSX İŞ AKIŞI                                     │
│                      (Esnek Eylemler, Yinelemeli)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           EYLEMLER (aşamalar değil)        │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              istediğiniz sırayla           │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Yapıtları tek tek oluşturun VEYA hızlı ilerleyin                       │
│   • Uygulama sırasında spesifikasyonları/tasarımları/görevleri güncelleyin  │
│   • Bağımlılıklar ilerlemeyi sağlar, aşamalar mevcut değildir               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Bileşen Mimari

**Eski iş akışı**, TypeScript'de sabit kodlanmış şablonlar kullanır:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ESKİ İŞ AKIŞI BİLEŞENLERİ                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Sabit Kodlanmış Şablonlar (TypeScript dizeleri)                            │
│                    │                                                        │
│                    ▼                                                        │
│   Araç özel yapılandırıcılar/uyumlayıcılar                                   │
│                    │                                                        │
│                    ▼                                                        │
│   Oluşturulan Komut Dosyaları (.claude/commands/openspec/*.md)               │
│                                                                             │
│   • Sabit yapı, yapıt farkındalığı yok                                      │
│   • Değişiklik yapmak için kod değişikliği + yeniden derleme gerekir         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX**, harici şemalar ve bir bağımlılık grafiği motoru kullanır:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OPSX BİLEŞENLERİ                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Şema Tanımları (YAML)                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Bağımlılıklar                    │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Glob kalıpları                   │   │
│   │      requires: [proposal]      ◄── Tekliften sonra etkinleştirir     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Yapıt Grafiği Motoru                                                      │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Topolojik sıralama (bağımlılık sıralaması)                       │   │
│   │  • Durum algılama (dosya sistemi varlığı)                           │   │
│   │  • Zengin talimat üretimi (şablonlar + bağlam)                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Beceri Dosyaları (.claude/skills/openspec-*/SKILL.md)                     │
│                                                                             │
│   • Çapak düzenleyici uyumlu (Claude Code, Cursor, Windsurf)                │
│   • Yapılandırılmış veri için Beceri sorgulama CLI'sı                       │
│   • Şema dosyaları aracılığıyla tamamen özelleştirilebilir                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Bağımlılık Grafiği Modeli

Yapıtlar yönlü asiklik grafiği (DAG) oluşturur. Bağımlılıklar **etkinleştiriciler**dir, geçitler değildir:

```
                              proposal
                             (kök düğüm)
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
                 specs                       design
              (bağımlılık:                  (bağımlılık:
               proposal)                   proposal)
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                               tasks
                           (bağımlılık:
                           specs, design)
                                  │
                                  ▼
                          ┌──────────────┐
                          │ APPLY PHASE  │
                          │ (bağımlılık: │
                          │  tasks)      │
                          └──────────────┘
```

**Durum geçişleri:**

```
   BLOKE ────────────────► HAZIR ────────────────► TAMAMLANDI
      │                        │                       │
   Eksik                   Tüm bağımlılıklar        Dosya dosya
   bağımlılıklar           TAMAMLANDI               sisteminde mevcut
```

### Bilgi Akışı

**Eski iş akışı** — ajan statik talimatlar alır:

```
  User: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Statik talimatlar:                     │
  │  • proposal.md oluştur                  │
  │  • tasks.md oluştur                     │
  │  • design.md oluştur                    │
  │  • specs/<capability>/spec.md oluştur   │
  │                                         │
  │  Mevcut olanlar veya yapıtlar arasındaki│
  │  bağımlılıklar konusunda farkındalık yok│
  └─────────────────────────────────────────┘
           │
           ▼
  Ajan TÜM yapıtları tek seferde oluşturur
```

**OPSX** — ajan zengin bağlam için sorgular:

```
  User: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Adım 1: Mevcut durumu sorgula                                           │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec status --change "add-auth" --json                      │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "artifacts": [                                                  │  │
  │  │      {"id": "proposal", "status": "done"},                         │  │
  │  │      {"id": "specs", "status": "ready"},      ◄── İlk hazır         │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked", "missingDeps": ["specs"]}│  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Adım 2: Hazır yapıt için zengin talimatları al                          │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec instructions specs --change "add-auth" --json          │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "template": "# Specification\n\n## ADDED Requirements...",      │  │
  │  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
  │  │    "unlocks": ["tasks"]                                            │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Adım 3: Bağımlılıkları oku → TEK yapıt oluştur → Nevin etkinleştirildiğini göster  │
  └──────────────────────────────────────────────────────────────────────────┘
```

### Yineleme Modeli

**Eski iş akışı** — yinelemek için garip:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Tasarım yanlış"
       │               │
       │               ├── Seçenekler:
       │               │   • Dosyaları manuel düzenle (bağlamı bozar)
       │               │   • Vazgeç ve yeniden başla
       │               │   • İlerle ve sonra düzelt
       │               │
       │               └── Resmi bir "geri dön" mekanizması yok
       │
       └── Tüm kalıpları tek seferde oluşturur
```

**OPSX** — doğal yineleme:

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── "Tasarım yanlış"
      │                │                  │
      │                │                  ▼
      │                │            Sadece design.md dosyasını düzenle
      │                │            ve devam et!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply, bıraktığınız yerden devam eder
      │                │
      │                └── TEK kalıp oluşturur, neyin kilidini açtığını gösterir
      │
      └── Değişikliğin iskeletini oluşturur, yön bekler
```

### Özel Şemalar

Şema yönetimi komutlarını kullanarak özel iş akışları oluşturun:

```bash
# Sıfırdan yeni bir şema oluştur (etkileşimli)
openspec schema init my-workflow

# Veya başlangıç noktası olarak mevcut bir şemayı fork'la
openspec schema fork spec-driven my-workflow

# Şema yapınızı doğrulayın
openspec schema validate my-workflow

# Bir şemanın nereden çözüldüğünü görün (hata ayıklama için kullanışlı)
openspec schema which my-workflow
```

Şemalar `openspec/schemas/` (proje yerel, sürüm kontrolü altında) veya `~/.local/share/openspec/schemas/` (kullanıcı genel) dizinlerinde saklanır.

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
  - id: research        # Öneri'den önce eklendi
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Artık araştırma'ya bağımlı

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**Bağımlılık Grafiği:**
```
   research ──► proposal ──► tasks
```

### Özet

| Özellik | Eski | OPSX |
|--------|----------|------|
| **Şablonlar** | Sabitlenmiş TypeScript | Harici YAML + Markdown |
| **Bağımlılıklar** | Yok (hepsi tek seferde) | Topolojik sıralama ile DAG |
| **Durum** | Evre tabanlı zihinsel model | Dosya sistemi varlığı |
| **Özelleştirme** | Kaynağı düzenle, yeniden derle | schema.yaml oluştur |
| **Yineleme** | Evreye kilitli | Akışkan, her şeyi düzenle |
| **Editör Desteği** | Araca özel yapılandırıcı/bağdaştırıcılar | Tek beceri dizini |

## Şemalar

Şemalar, hangi kalıpların var olduğunu ve bağımlılıklarını tanımlar. Şu anda mevcut olanlar:

- **spec-driven** (varsayılan): proposal → specs → design → tasks

```bash
# Mevcut şemaları listele
openspec schemas

# Tüm şemaları çözüm kaynaklarıyla birlikte görüntüle
openspec schema which --all

# Etkileşimli olarak yeni bir şema oluştur
openspec schema init my-workflow

# Özelleştirme için mevcut bir şemayı fork'la
openspec schema fork spec-driven my-workflow

# Kullanmadan önce şema yapısını doğrula
openspec schema validate my-workflow
```

## İpuçları

- Bir değişikliğe başlamadan önce bir fikri düşünmek için `/opsx:explore` kullanın
- Ne istediğinizi bildiğinizde `/opsx:ff`, keşfediyorken `/opsx:continue` kullanın
- `/opsx:apply` sırasında bir şeyler yanlışsa — kalıbı düzeltin, sonra devam edin
- Görevler, `tasks.md` içindeki onay kutuları ile ilerlemeyi takip eder
- İstediğiniz zaman durumu kontrol edin: `openspec status --change "name"`

## Geri Bildirim

Bu henüz kaba bir taslak. Bu kasıtlıdır — neyin işe yaradığını öğreniyoruz.

Bir hata mı buldunuz? Fikirleriniz mi var? [Discord](https://discord.gg/YctCnvvshC) kanımıza katılın veya [GitHub](https://github.com/Fission-AI/openspec/issues) üzerinden bir sorun açın.