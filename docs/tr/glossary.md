# Sözlük

Her bir OpenSpec terimi tek bir yerde, sade bir dille tanımlanmıştır. Bir kez gözden geçirin ve diğer tüm dokümanlar daha hızlı okunur hale gelsin.

Terimler konu başlıklarına göre gruplandırılmış, ardından her grup içinde alfabetik sıraya konulmuştur.

## Temel İsimler (The core nouns)

**Spec.** Sisteminizin bir kısmının nasıl davrandığını açıklayan bir dokümandır. Specs, `openspec/specs/` dizininde bulunur; alana göre düzenlenir ve gereksinimlerden ile senaryolardan oluşur. Spec, "bu yazılım ne işe yarıyor?" sorusuna verilen üzerinde anlaşılmış cevaptır. [Concepts](concepts.md#specs) bölümüne bakın.

**Source of truth.** `openspec/specs/` dizinin tamamıdır. Sisteminizin mevcut ve üzerinde anlaşılan davranışını barındırır. Değişiklikler buna yönelik düzenlemeler önerir; arşivleme bu değişiklikleri uygular.

**Change.** Bir iş birimidir, `openspec/changes/<name>/` altında bir klasör olarak paketlenmiştir. Bir change, o işe dair her şeyi içerir: teklifini, tasarımını, görevlerini ve getirdiği spec düzenlemelerini. Bir change, bir özellik veya bir düzeltmedir.

**Artifact.** Bir change içindeki dokümandır. Standart artifact'ler şunlardır: teklif (proposal), delta specs, tasarım ve görevler. Bunlar bağımlılık sırasına göre oluşturulur ve birbirini besler.

**Delta spec.** Bir change içindeki ve yalnızca neyin değiştiğini anlatan bir specdır; tüm speci yeniden ifade etmek yerine `ADDED`, `MODIFIED` ve `REMOVED` bölümleri kullanılarak hazırlanır. Bu, OpenSpec'in mevcut sistemleri temiz bir şekilde düzenlemesini sağlayan şeydir. [Concepts](concepts.md#delta-specs) bölümüne bakın.

**Domain.** Specs için mantıksal bir gruplamadır; örneğin `auth/`, `payments/` veya `ui/`. Kendi sisteminiz hakkında düşündüğünüz şekle uyan domain'leri seçmelisiniz.

## Bir Spec İçinde (Inside a spec)

**Requirement.** Sistemin sahip olması gereken tek bir davranıştır, genellikle RFC 2119 anahtar kelimeleriyle yazılır: "Sistem, oturumları 30 dakika sonra sonlandırmalıdır." Requirements *ne* olduğunu, *nasıl* olacağını değil belirtir.

**Scenario.** Bir requirement'ın somut, test edilebilir bir örneğidir; tipik olarak Given/When/Then formatında bulunur. Senaryolar bir requirement'ı doğrulanabilir kılar: bunlardan otomatik bir test yazabilirsiniz.

**RFC 2119 keywords.** MUST, SHALL, SHOULD ve MAY kelimeleridir; bunlar bir requirement'ın ne kadar katı olması gerektiği hakkında standartlaştırılmış anlam taşır. MUST ve SHALL kesindir. SHOULD tavsiye edilir ve istisnalara yer bırakılır. MAY isteğe bağlıdır. Bu ismin adı, bunları tanımlayan internet standart dokümanından gelmektedir.

## Artifact'ler (The artifacts)

**Proposal (`proposal.md`).** Bir change'in *neden* ve *ne* olduğunu belirtir: niyeti, kapsamı ve üst düzey yaklaşımı. Oluşturduğunuz ilk artifact'tır.

**Design (`design.md`).** *Nasıl* yapılacağını anlatır: teknik yaklaşım, mimari kararlar ve dokunmanız gereken dosyalar. Basit değişiklikler için isteğe bağlıdır.

**Tasks (`tasks.md`).** Kontrol kutucukları olan uygulama kontrol listesidir. AI, `/opsx:apply` sırasında bunu işler ve ilerledikçe maddeleri işaretler.

## Yaşam Döngüsü (The lifecycle)

**Archive.** Bir change'i bitirme eylemidir. Delta specs'leri ana specs'lere birleştirilir ve change klasörü `openspec/changes/archive/YYYY-MM-DD-<name>/` konumuna taşınır. Arşivlemeden sonra, specs'ler yeni gerçekliği tanımlar. [Concepts](concepts.md#archive) bölümüne bakın.

**Sync.** Bir change'in delta specs'lerini ana specs'lere *arşivleme yapmadan* birleştirmektir. Genellikle otomatik olarak yapılır (archive bunu yapmak için teklif sunar), ancak uzun süren değişiklikler için `/opsx:sync` olarak bağımsız da kullanılabilir. [Commands](commands.md#opsxsync) bölümüne bakın.

## İş Akışı ve Komutlar (Workflow and commands)

**OPSX.** Katı aşamalar yerine akışkan eylemler üzerine inşa edilmiş mevcut standart OpenSpec iş akışıdır. Tüm slash komutları `/opsx:` ile başlar. [OPSX Workflow](opsx.md) bölümüne bakın.

**Slash command.** AI asistanınızın sohbetine yazdığınız bir komuttur, örneğin `/opsx:propose`. Slash komutları iş akışını yönlendirir. Bunlar terminal komutu değildir. [How Commands Work](how-commands-work.md) bölümüne bakın.

**Explore (`/opsx:explore`).** Düşünme ortağı komutudur. Kod tabanınızı okur, seçenekleri karşılaştırır ve belirsiz bir fikri somut bir plana dönüştürür; herhangi bir artifact oluşturmaz ve kod yazmaz. Bir sorununuz ancak henüz bir planınız yoksa önerilen başlangıç noktasıdır. [Explore First](explore.md) bölümüne bakın.

**CLI.** Terminalinizde çalıştırdığınız `openspec` programıdır. Projeleri kurar, değişiklikleri listeler ve doğrular, dashboard'u açar ve arşivler. OpenSpec'in terminal kısmıdır. [CLI](cli.md) bölümüne bakın.

**Skill.** AI asistanınızın otomatik olarak algıladığı ve takip ettiği bir talimatlar klasörüdür (`.../skills/openspec-*/SKILL.md`). Skills, OpenSpec iş akışını asistanınıza ulaştırmak için ortaya çıkan çapraz araç standardıdır.

**Command file.** Bir araca özel slash komut dosyasıdır (`.../commands/opsx-*`). Hala desteklenen eski bir dağıtım mekanizmasıdır; skills ile birlikte bulunur. Bunlara nadiren doğrudan dokunmanız gerekir.

**Profile.** Projenize yüklenmiş olan slash komutlarının kümesidir. **Core** (varsayılan) şunları içerir: `propose`, `explore`, `apply`, `sync`, `archive`. **Expanded** seti ise `new`, `continue`, `ff`, `verify`, `bulk-archive` ve `onboard`'ı ekler. Bunu `openspec config profile` ile değiştirebilirsiniz.

**Delivery.** OpenSpec'in araçlarınız için skill, komut dosyası veya her ikisini kurup kurmadığıdır. Global olarak yapılandırılır ve `openspec update` ile uygulanır.

## Özelleştirme (Customization)

**Schema.** Bir iş akışının hangi artifact'lara sahip olduğunu ve bunların birbirine nasıl bağlı olduğunu tanımlar. Yerleşik varsayılanı `spec-driven`'dir (proposal → specs → design → tasks). Bunu çatallayabilir veya kendi şemanızı yazabilirsiniz. [Customization](customization.md#custom-schemas) bölümüne bakın.

**Template.** Bir schema içindeki ve verilen bir artifact için AI'ın ne üreteceğini şekillendiren bir Markdown dosyasıdır. Bir template düzenlemek, yeniden derleme yapmadan AI'ın çıktısını anında değiştirir.

**Project config (`openspec/config.yaml`).** Proje bazlı ayarlar: varsayılan schema, her planlama isteğine enjekte edilen `context:` ve artifact'a özel `rules:`. OpenSpec'e yığınınız ve gelenekleriniz hakkında bilgi vermenin en kolay yoludur. [Customization](customization.md#project-configuration) bölümüne bakın.

**Context injection.** Proje arka planını, AI'ın ürettiği her artifact'a otomatik olarak eklenmesi için `config.yaml`'in `context:` alanına koymaktır. Bu, AI'ın ayrı bir dosyayı okumasını ummaktan daha güvenilirdir.

**Dependency graph.** Artifact `requires:` ilişkilerinden oluşan yönlü grafiktir. Bu bir DAG'dir (directed acyclic graph: oklar sadece ileriye doğru işaret eder, asla döngü içinde değildir) ve OpenSpec, neyi sonra oluşturabileceğinizi bilmek için bunu kullanır.

**Enablers, not gates.** Artifact bağımlılıklarının neyin *bir sonraki* olabileceğini, neyin *sonra gereklilik olduğunu* göstermesi prensibidir. Herhangi bir artifact'ı istediğiniz zaman tekrar gözden geçirebilir ve düzenleyebilirsiniz. [Core Concepts at a Glance](overview.md#enablers-not-gates) bölümüne bakın.

## Repolar Arası Koordinasyon (Beta)

Bu terimler, planlamanız birden fazla repo kapsıyorsa geçerlidir. Beta aşamasındadırlar. Çoğu kullanıcı bunları göz ardı edebilir. [Stores User Guide](stores-beta/user-guide.md) bölümüne bakın.

**Store.** Tamamen planlama işine odaklanmış bağımsız bir repodur. Bildiğiniz gibi aynı `openspec/` yapısına sahiptir (specs ve changes) artı küçük bir kimlik dosyası. Onu makinenizde bir kez, isimle kaydedersiniz ve ardından herhangi bir OpenSpec komutu neresinden olursa olsun onda çalışabilir.

**Reference.** Bir kod deposunun `openspec/config.yaml` dosyasında, o deponun dayandığı bir store'un beyanıdır. Referanslar salt okunurdur: depo kendi kökünü korur ve `openspec instructions`, referans verilen store'un specs'lerinin bir dizinini kazanır; her biri onu çekmek için tam komutu içerir.

**Working context.** `openspec context`'in mevcut repo için topladığı şeydir: OpenSpec root'u artı referans verdiği her store, her biri nasıl çekileceği bilgisiyle birlikte. "Ne ile uğraşıyorum?" sorusunun cevabıdır.

**Workset.** Birlikte açtığınız kişisel, makine yerel klasör setidir (çalıştığınız kod repolarının yanında bir store). `openspec workset create` ile açıkça oluşturulur; bu yerel yolların hiçbiri paylaşılan planlama reposuna commit edilmez.

## Ayrıca Bakınız (See also)

- [Core Concepts at a Glance](overview.md): beş fikir, tek bir sayfada
- [Concepts](concepts.md): uzun formlu açıklama
- [How Commands Work](how-commands-work.md): slash komutları ile CLI arasındaki farklar