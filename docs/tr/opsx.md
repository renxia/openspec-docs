# OPSX İş Akışı

> [Discord](https://discord.gg/YctCnvvshC) üzerinden geri bildirimlerinizi bekliyoruz.

## Nedir?

OPSX artık OpenSpec için standart iş akışıdır.

Bu, OpenSpec değişiklikleri için **akıcı, yinelemeli bir iş akışıdır**. Katı aşamalar yok — sadece istediğiniz zaman yapabileceğiniz eylemler var.

## Neden Var

Eski OpenSpec iş akışı çalışıyor, ancak **kilitli**:

- **Talimatlar sabit kodlanmış** — TypeScript'e gömülmüş, değiştiremezsiniz
- **Hep ya da hiç** — tek bir büyük komut her şeyi oluşturuyor, parçaları ayrı ayrı test edemezsiniz
- **Sabit yapı** — herkes için aynı iş akışı, özelleştirme yok
- **Kara kutu** — AI çıktısı kötü olduğunda, istemleri ayarlayamazsınız

**OPSX bunu açıyor.** Artık herkes:

1. **Talimatlarla deney yapabilir** — bir şablonu düzenleyin, AI daha iyi yapıp yapmadığını görün
2. **Ayrıntılı test edebilir** — her ürünün talimatlarını bağımsız olarak doğrulayabilir
3. **İş akışlarını özelleştirebilir** — kendi ürünlerinizi ve bağımlılıklarınızı tanımlayabilir
4. **Hızlıca yineleyebilir** — bir şablonu değiştirin, hemen test edin, yeniden oluşturma yok

```
Eski iş akışı:                      OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Pakette sabit kodlanmış│           │  schema.yaml           │◄── Bunu düzenlersiniz
│  (değiştirilemez)       │           │  templates/*.md        │◄── Ya da bunu
│        ↓               │           │        ↓               │
│  Yeni sürümü bekleyin  │           │  Anında etki           │
│        ↓               │           │        ↓               │
│  Umarız daha iyi olur  │           │  Kendiniz test edin    │
└────────────────────────┘           └────────────────────────┘
```

**Bu herkes içindir:**
- **Ekipler** — gerçekten nasıl çalışıyorsanız ona uygun iş akışları oluşturun
- **Güçlü kullanıcılar** — kod tabanınız için daha iyi AI çıktıları almak üzere istemleri ayarlayın
- **OpenSpec katkıda bulunanlar** — sürümler olmadan yeni yaklaşımlarla deney yapın

Hepimiz hâlâ neyin en iyi olduğunu öğreniyoruz. OPSX birlikte öğrenmemizi sağlar.

## Kullanıcı Deneyimi

**Doğrusal iş akışlarının sorunu:**
"Planlama aşamasındasınız", sonra "uygulama aşamasındasınız", sonra "bitti". Ancak gerçek iş böyle yürümez. Bir şey uygularsınız, tasarımınızın yanlış olduğunu fark edersiniz, spesifikasyonları güncellemeniz gerekir, uygulamaya devam edersiniz. Doğrusal aşamalar, işin gerçekten nasıl yürüdüğüne karşı savaşır.

**OPSX yaklaşımı:**
- **Aşamalar değil, eylemler** — oluştur, uygula, güncelle, arşivle — herhangi birini istediğiniz zaman yapın
- **Bağımlılıklar etkinleştiricilerdir** — neyin gerekli olduğunu değil, neyin mümkün olduğunu gösterirler

```
  teklif ──→ spesifikasyonlar ──→ tasarım ──→ görevler ──→ uygula
```

## Kurulum

```bash
# openspec'in kurulu olduğundan emin olun — beceriler otomatik olarak oluşturulur
openspec init
```

Bu, `.claude/skills/` (veya eşdeğeri) içinde AI kodlama yardımcılarının otomatik olarak algıladığı beceriler oluşturur.

Varsayılan olarak OpenSpec, `core` iş akışı profilini kullanır (`propose`, `explore`, `apply`, `sync`, `archive`). Genişletilmiş iş akışı komutlarını (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) istiyorsanız, bunları `openspec config profile` ile yapılandırın ve `openspec update` ile uygulayın.

Kurulum sırasında bir **proje yapılandırması** (`openspec/config.yaml`) oluşturmanız istenecektir. Bu isteğe bağlıdır ancak önerilir.

## Proje Yapılandırması

Proje yapılandırması, varsayılanları ayarlamanıza ve projiye özgü bağlamı tüm ürünlerde kullanmanıza olanak tanır.

### Yapılandırma Oluşturma

Yapılandırma `openspec init` sırasında veya manuel olarak oluşturulur:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Teknoloji yığını: TypeScript, React, Node.js
  API sözleşmeleri: RESTful, JSON yanıtları
  Test: Birim testleri için Vitest, e2e için Playwright
  Stil: Prettier ile ESLint, katı TypeScript

rules:
  proposal:
    - Geri alma planı dahil edin
    - Etkilenen ekipleri belirleyin
  specs:
    - Senaryolar için Given/When/Then biçimini kullanın
  design:
    - Karmaşık akışlar için sıra diyagramları dahil edin
```

### Yapılandırma Alanları

| Alan | Tür | Açıklama |
|------|-----|----------|
| `schema` | string | Yeni değişiklikler için varsayılan şema (ör. `spec-driven`) |
| `context` | string | Tüm ürün talimatlarına eklenen proje bağlamı |
| `rules` | object | Ürün kimliğine göre anahtarlanan, ürüne özel kurallar |

### Nasıl Çalışır

**Şema önceliği** (en yükseğe en düşüğe):
1. CLI bayrağı (`--schema <ad>`)
2. Değişiklik meta verisi (değişiklik dizinindeki `.openspec.yaml`)
3. Proje yapılandırması (`openspec/config.yaml`)
4. Varsayılan (`spec-driven`)

**Bağlam enjeksiyonu:**
- Bağlam, her ürünün talimatlarının başına eklenir
- `<context>...</context>` etiketleriyle sarılır
- AI'ın projenizin sözleşmelerini anlamasına yardımcı olur

**Kural enjeksiyonu:**
- Kurallar yalnızca eşleşen ürünler için enjekte edilir
- `<rules>...</rules>` etiketleriyle sarılır
- Bağlamdan sonra, şablondan önce görünür

### Şemaya Göre Ürün Kimlikleri

**spec-driven** (varsayılan):
- `proposal` — Değişiklik teklifi
- `specs` — Spesifikasyonlar
- `design` — Teknik tasarım
- `tasks` — Uygulama görevleri

### Yapılandırma Doğrulaması

- `rules`'daki bilinmeyen ürün kimlikleri uyarı üretir
- Şema adları mevcut şemalara karşı doğrulanır
- Bağlamın 50KB boyut sınırı vardır
- Geçersiz YAML satır numaralarıyla rapor edilir

### Sorun Giderme

**"rules'da bilinmeyen ürün kimliği: X"**
- Ürün kimliklerinin şemanızla eşleştiğini kontrol edin (yukarıdaki listeye bakın)
- Her şema için ürün kimliklerini görmek üzere `openspec schemas --json` komutunu çalıştırın

**Yapılandırma uygulanmıyor:**
- Dosyanın `openspec/config.yaml` (`.yml` değil) konumunda olduğundan emin olun
- YAML sözdizimini bir doğrulayıcıyla kontrol edin
- Yapılandırma değişiklikleri hemen geçerli olur (yeniden başlatma gerekmez)

**Bağlam çok büyük:**
- Bağlam 50KB ile sınırlıdır
- Bunun yerine özetleyin veya harici belgelere bağlantı verin

## Komutlar

| Komut | Ne yapar |
|-------|----------|
| `/opsx:propose` | Bir değişiklik oluşturun ve planlama ürünlerini tek adımda oluşturun (varsayılan hızlı yol) |
| `/opsx:explore` | Fikirler üzerinde düşünün, sorunları araştırın, gereksinimleri netleştirin |
| `/opsx:new` | Yeni bir değişiklik iskelesi başlatın (genişletilmiş iş akışı) |
| `/opsx:continue` | Bir sonraki ürünü oluşturun (genişletilmiş iş akışı) |
| `/opsx:ff` | Planlama ürünlerini hızlıca ileri sarın (genişletilmiş iş akışı) |
| `/opsx:apply` | Görevleri uygulayın, ürünleri gerektiği gibi güncelleyin |
| `/opsx:verify` | Uygulamayı ürünlere karşı doğrulayın (genişletilmiş iş akışı) |
| `/opsx:sync` | Delta spesifikasyonlarını ana dal ile senkronize edin (varsayılan iş akışı, isteğe bağlı) |
| `/opsx:archive` | Bittiğinde arşivleyin |
| `/opsx:bulk-archive` | Tamamlanmış birden fazla değişikliği arşivleyin (genişletilmiş iş akışı) |
| `/opsx:onboard` | Uçtan uca bir değişiklik için yönlendirmeli yürüyüş (genişletilmiş iş akışı) |

## Kullanım

### Bir fikri keşfedin
```
/opsx:explore
```
Fikirler üzerinde düşünün, sorunları araştırın, seçenekleri karşılaştırın. Yapı gerekmez - sadece bir düşünme ortağı. İçgörüler netleştiğinde, `/opsx:propose`'a (varsayılan) veya `/opsx:new`/`/opsx:ff`'ye (genişletilmiş) geçin.

### Yeni bir değişiklik başlatın
```
/opsx:propose
```
Değişikliği oluşturur ve uygulamadan önce gerekli planlama ürünlerini üretir.

Genişletilmiş iş akışlarını etkinleştirdiyseniz, bunun yerine şunları kullanabilirsiniz:

```text
/opsx:new        # yalnızca iskele
/opsx:continue   # seferde bir ürün oluşturun
/opsx:ff         # tüm planlama ürünlerini bir kerede oluşturun
```

### Ürünler oluşturun
```
/opsx:continue
```
Bağımlılıklara göre neyin oluşturulmaya hazır olduğunu gösterir, ardından bir ürün oluşturur. Değişikliğinizi adım adım oluşturmak için tekrar tekrar kullanın.

```
/opsx:ff add-dark-mode
```
Tüm planlama ürünlerini bir kerede oluşturur. Ne inşa ettiğiniz konusunda net bir resminiz olduğunda kullanın.

### Uygulayın (akışkan kısım)
```
/opsx:apply
```
Görevler üzerinde çalışır, ilerledikçe bunları işaretler. Birden fazla değişiklikle uğraşıyorsanız, `/opsx:apply <ad>` komutunu çalıştırabilirsiniz; aksi takdirde konuşmadan çıkarmalı ve belirleyemiyorsa sizi seçmeye yönlendirmelidir.

### Bitirin
```
/opsx:archive   # Bittiğinde arşive taşıyın (gerekirse spesifikasyonları senkronize etmenizi ister)
```

## Ne Zaman Güncelleyin vs. Sıfırdan Başlayın

Uygulamadan önce her zaman teklifinizi veya spesifikasyonlarınızı düzenleyebilirsiniz. Ancak iyileştirme ne zaman "bu farklı bir iş" haline gelir?

### Bir Teklifin Yakaladıkları

Bir teklif üç şeyi tanımlar:
1. **Niyet** — Hangi sorunu çözüyorsunuz?
2. **Kapsam** — Sınırların içinde ve dışında ne var?
3. **Yaklaşım** — Bunu nasıl çözeceksiniz?

Soru şu: hangisi değişti ve ne kadar?

### Mevcut Değişikliği Şu Durumlarda Güncelleyin:

**Aynı niyet, iyileştirilmiş uygulama**
- Dikkate almadığınız kenar durumlarını keşfedersiniz
- Yaklaşımın ayarlanması gerekir ama hedef değişmez
- Uygulama, tasarımın biraz hatalı olduğunu ortaya çıkarır

**Kapsam daralır**
- Tam kapsamın çok büyük olduğunu fark edersiniz, önce MVP'yi göndermek istersiniz
- "Karanlık mod ekle" → "Karanlık mod geçişi ekle (v2'de sistem tercihi)"

**Öğrenmeye dayalı düzeltmeler**
- Kod tabanı düşündüğünüz gibi yapılandırılmamış
- Bir bağımlılık beklendiği gibi çalışmıyor
- "CSS değişkenleri kullan" → "Bunun yerine Tailwind'in dark: önekini kullanın"

### Yeni Bir Değişikliği Şu Durumlarda Başlatın:

**Niyet temel olarak değişti**
- Sorunun kendisi artık farklı
- "Karanlık mod ekle" → "Özel renkler, yazı tipleri, boşluklarla kapsamlı tema sistemi ekle"

**Kapsam patladı**
- Değişiklik o kadar büyüdü ki esasen farklı bir iş
- Orijinal teklif güncellemelerden sonra tanınmaz olur
- "Giriş hatasını düzelt" → "Kimlik doğrulama sistemini yeniden yaz"

**Orijinal tamamlanabilir**
- Orijinal değişiklik "bitti" olarak işaretlenebilir
- Yeni iş tek başına durur, bir iyileştirme değil
- "Karanlık mod MVP'si ekle"yi tamamlayın → Arşivleyin → "Karanlık modu geliştir" yeni değişikliği

### Sezgisel Kurallar

```
                        ┌─────────────────────────────────────┐
                        │     Bu aynı iş mi?                  │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Aynı niyet?      >%50 örtüşme?    Orijinal bu
             Aynı sorun?      Aynı kapsam?     değişiklikler
                    │                  │          olmadan "bitti"
                    │                  │          olabilir mi?
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         EVET              HAYIR EVET       HAYIR HAYIR          EVET
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       GÜNCELLE          YENİ GÜNCELLE     YENİ GÜNCELLE       YENİ
```

| Test | Güncelleme | Yeni Değişiklik |
|------|------------|-----------------|
| **Kimlik** | "Aynı şey, iyileştirilmiş" | "Farklı iş" |
| **Kapsam örtüşmesi** | >%50 örtüşür | <%50 örtüşür |
| **Tamamlanma** | Değişiklikler olmadan "bitti" olamaz | Orijinali bitirebilir, yeni iş tek başına durur |
| **Hikaye** | Güncelleme zinciri tutarlı bir hikaye anlatır | Yamalar netleştirmekten çok kafa karıştırır |

### İlke

> **Güncelleme bağlamı korur. Yeni değişiklik netlik sağlar.**
>
> Düşünme geçmişiniz değerli olduğunda güncellemeyi seçin.
> Yamalamaktan daha net olacağı için sıfırdan başlamayı seçin.

Bunu git dalları gibi düşünün:
- Aynı özellik üzerinde çalışırken komit atmaya devam edin
- Gerçekten yeni bir iş olduğunda yeni bir dal başlatın
- Bazen kısmi bir özelliği birleştirin ve aşama 2 için sıfırdan başlayın

## Fark Nedir?

| | Eski (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Yapı** | Tek büyük teklif belgesi | Bağımlılıklara sahip ayrı ayrı eserler |
| **İş Akışı** | Doğrusal aşamalar: planla → uygula → arşivle | Akıcı eylemler — istediğiniz zaman her şeyi yapın |
| **Yineleme** | Geri dönmek zahmetli | Öğrendikçe eserleri güncelleyin |
| **Özelleştirme** | Sabit yapı | Şema odaklı (kendi eserlerinizi tanımlayın) |

**Temel içgörü:** iş doğrusal değildir. OPSX, öyleymiş gibi yapmayı bırakır.

## Mimari Derinlemesine İnceleme

Bu bölüm, OPSX'in arka planda nasıl çalıştığını ve eski iş akışıyla nasıl karşılaştırıldığını açıklar.
Bu bölümdeki örnekler genişletilmiş komut setini (`new`, `continue`, vb.) kullanır; varsayılan `core` kullanıcıları aynı akışı `propose → apply → sync → archive` olarak eşleştirebilir.

### Felsefe: Aşamalar vs Eylemler

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ESKİ İŞ AKIŞI                                      │
│                    (Aşama Kilitli, Hep ya da Hiç)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   PLANLAMA   │ ───► │ UYGULAMA     │ ───► │  ARŞİVLEME   │             │
│   │    AŞAMASI   │      │    AŞAMASI   │      │    AŞAMASI   │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Tüm eserleri tek seferde oluşturur                                    │
│   • Uygulama sırasında spesifikasyonları güncellemeye geri dönemez        │
│   • Aşama kapıları doğrusal ilerlemeyi zorunlu kılar                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                            OPSX İŞ AKIŞI                                     │
│                      (Akıcı Eylemler, Yinelemeli)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           EYLEMLER (aşamalar değil)        │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              herhangi bir sıra             │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Eserleri tek tek oluşturun VEYA hızlı ileri sarın                      │
│   • Uygulama sırasında spesifikasyonları/tasarımları/görevleri güncelleyin │
│   • Bağımlılıklar ilerlemeyi sağlar, aşamalar yoktur                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Bileşen Mimarisi

**Eski iş akışı**, TypeScript'te kodlanmış şablonlar kullanır:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ESKİ İŞ AKIŞI BİLEŞENLERİ                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Kodlanmış Şablonlar (TypeScript dizeleri)                                 │
│                    │                                                        │
│                    ▼                                                        │
│   Araç özel yapılandırıcılar/adaptörler                                    │
│                    │                                                        │
│                    ▼                                                        │
│   Oluşturulan Komut Dosyaları (.claude/commands/openspec/*.md)              │
│                                                                             │
│   • Sabit yapı, eser farkındalığı yok                                      │
│   • Değişiklik, kod değişikliği + yeniden derleme gerektirir               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX**, harici şemalar ve bir bağımlılık grafik motoru kullanır:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OPSX BİLEŞENLERİ                                      │
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
│   │      generates: specs/**/*.md  ◄── Glob desenleri                   │   │
│   │      requires: [proposal]      ◄── proposal'dan sonra etkinleşir    │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Eser Grafik Motoru                                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Topolojik sıralama (bağımlılık sıralaması)                       │   │
│   │  • Durum algılama (dosya sistemi varlığı)                           │   │
│   │  • Zengin talimat oluşturma (şablonlar + bağlam)                    │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Yetenek Dosyaları (.claude/skills/openspec-*/SKILL.md)                    │
│                                                                             │
│   • Editörler arası uyumlu (Claude Code, Cursor, Windsurf)                 │
│   • Yetenekler yapılandırılmış veri için CLI'yi sorgular                   │
│   • Şema dosyaları aracılığıyla tamamen özelleştirilebilir                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Bağımlılık Grafik Modeli

Eserler yönlü döngüsel olmayan bir grafik (DAG) oluşturur. Bağımlılıklar **etkinleştiricilerdir**, kapılar değil:

```
                              proposal
                             (kök düğüm)
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
                 specs                       design
              (requires:                  (requires:
               proposal)                   proposal)
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                               tasks
                           (requires:
                           specs, design)
                                  │
                                  ▼
                          ┌──────────────┐
                          │ UYGULAMA     │
                          │ AŞAMASI      │
                          │ (requires:   │
                          │  tasks)      │
                          └──────────────┘
```

**Durum geçişleri:**

```
   ENGELLİ ────────────────► HAZIR ────────────────► TAMAMLANDI
      │                        │                       │
   Eksik                    Tüm bağımlılıklar       Dosya
   bağımlılıklar            TAMAMLANDI              dosya sisteminde
                                                    mevcut
```

### Bilgi Akışı

**Eski iş akışı** — ajan statik talimatlar alır:

```
  Kullanıcı: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Statik talimatlar:                     │
  │  • proposal.md oluştur                  │
  │  • tasks.md oluştur                     │
  │  • design.md oluştur                    │
  │  • specs/<capability>/spec.md oluştur   │
  │                                         │
  │  Neyin mevcut olduğunun veya            │
  │  eserler arası bağımlılıkların          │
  │  farkında değil                         │
  └─────────────────────────────────────────┘
           │
           ▼
  Ajan TÜM eserleri tek seferde oluşturur
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
  │  │      {"id": "specs", "status": "ready"},      ◄── İlk hazır olan   │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked", "missingDeps": ["specs"]}│  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Adım 2: Hazır eser için zengin talimatlar al                            │
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
│  Adım 3: Bağımlılıkları oku → BİR eser oluştur → Neyin kilidinin açıldığını göster │
└──────────────────────────────────────────────────────────────────────────┘
```

### Yineleme Modeli

**Eski iş akışı** — yineleme yapmak hantal:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Bekle, tasarım yanlış"
       │               │
       │               ├── Seçenekler:
       │               │   • Dosyaları manuel düzenle (bağlamı bozar)
       │               │   • Vazgeç ve yeniden başla
       │               │   • Devam et ve sonra düzelt
       │               │
       │               └── Resmi bir "geri dön" mekanizması yok
       │
       └── TÜM eserleri tek seferde oluşturur
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
      │                │         /opsx:apply kaldığınız yerden
      │                │         devam eder
      │                │
      │                └── BİR eser oluşturur, neyin kilidinin açıldığını gösterir
      │
      └── Değişikliği iskeletler, yön için bekler
```

### Özel Şemalar

Şema yönetim komutlarını kullanarak özel iş akışları oluşturun:

```bash
# Sıfırdan yeni bir şema oluştur (etkileşimli)
openspec schema init my-workflow

# Veya mevcut bir şemayı başlangıç noktası olarak çatalla
openspec schema fork spec-driven my-workflow

# Şema yapınızı doğrulayın
openspec schema validate my-workflow

# Bir şemanın nereden çözümlendiğini görün (hata ayıklama için kullanışlı)
openspec schema which my-workflow
```

Şemalar `openspec/schemas/` (proje yerel, sürüm kontrolü altında) veya `~/.local/share/openspec/schemas/` (kullanıcı global) dizinlerinde saklanır.

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
  - id: research        # proposal'dan önce eklenir
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Şimdi research'e bağımlı

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**Bağımlılık Grafiği:**
```
   research ──► proposal ──► tasks
```

### Özet

| Yön | Eski | OPSX |
|--------|----------|------|
| **Şablonlar** | Kodlanmış TypeScript | Harici YAML + Markdown |
| **Bağımlılıklar** | Yok (hepsi birden) | Topolojik sıralamalı DAG |
| **Durum** | Aşama tabanlı zihinsel model | Dosya sistemi varlığı |
| **Özelleştirme** | Kaynağı düzenle, yeniden derle | schema.yaml oluştur |
| **Yineleme** | Aşama kilitli | Akıcı, her şeyi düzenleyin |
| **Editör Desteği** | Araç özel yapılandırıcı/adaptörler | Tek yetenekler dizini |

## Şemalar

Şemalar hangi yapıtların var olduğunu ve bunların bağımlılıklarını tanımlar. Şu anda mevcut olanlar:

- **spec-driven** (varsayılan): teklif → spesifikasyonlar → tasarım → görevler

```bash
# Mevcut şemaları listele
openspec schemas

# Tüm şemaları ve çözüm kaynaklarını göster
openspec schema which --all

# Etkileşimli olarak yeni bir şema oluştur
openspec schema init my-workflow

# Özelleştirme için mevcut bir şemayı çatalla
openspec schema fork spec-driven my-workflow

# Kullanmadan önce şema yapısını doğrula
openspec schema validate my-workflow
```

## İpuçları

- Bir değişiklik yapmadan önce bir fikri düşünmek için `/opsx:explore` kullanın
- Ne istediğinizi biliyorsanız `/opsx:ff`, keşif yapıyorsanız `/opsx:continue` kullanın
- `/opsx:apply` sırasında bir şey yanlışsa — yapıtı düzeltin, ardından devam edin
- Görevler, `tasks.md` dosyasındaki onay kutuları aracılığıyla ilerlemeyi takip eder
- Durumu istediğiniz zaman kontrol edin: `openspec status --change "name"`

## Geri Bildirim

Bu taslak bir çalışmadır. Bu kasıtlıdır — neyin işe yaradığını öğreniyoruz.

Bir hata mı buldunuz? Fikirleriniz mi var? [Discord](https://discord.gg/YctCnvvshC)'da bize katılın veya [GitHub](https://github.com/Fission-AI/openspec/issues)'da bir sorun açın.