# Sorun Giderme

Somut sorunlar için somut çözümler. Her girdi bir belirtiyi adlandırır, olası nedeni bir cümleyle açıklar ve size çözümü sunar. Sorununuz burada görünmüyorsa [SSS](faq.md) yardımcı olabilir, kesinlikle [Discord](https://discord.gg/YctCnvvshC) da yardımcı olur.

## Kurulum ve ayar

### `openspec: command not found`

CLI kurulu değil veya shell'iniz onu bulamıyor. Global olarak kurun ve kontrol edin:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Eğer kuruldu ama hala bulunamıyorsa, global npm bin dizininiz muhtemelen `PATH` değişkeninizde değil. Global ikili dosyaların nerede yaşadığını görmek için `npm bin -g` komutunu çalıştırın ve bu dizinin shell profilinizde olduğundan emin olun.

### "Requires Node.js 20.19.0 or higher"

OpenSpec, Node 20.19.0+ sürümünde çalışır. Sürümünüzü kontrol edin ve gerekirse yükseltin:

```bash
node --version
```

OpenSpec'i `bun` ile kurarsanız, OpenSpec'in yine de Node üzerinde *çalıştığını* unutmayın, bu nedenle `PATH` değişkeninizde her durumda Node 20.19.0+ sürümünün bulunması gerekir. Bkz. [Kurulum](installation.md).

### `openspec init` didn't configure my AI tool

`init`, hangi araçları kuracağınızı sorar. Aracınızı atladıysanız veya başka bir tane eklemek istiyorsanız, sadece tekrar çalıştırın veya etkileşimsiz formu kullanın:

```bash
openspec init --tools claude,cursor
```

Arac kimliklerinin tam listesi [Desteklenen Araçlar](supported-tools.md) belgesinde bulunur. Tüm araçları kurmak için `--tools all`, araç kurulumunu atlamak için `--tools none` kullanın.

## Komutlar görünmüyor

Eğer `/opsx:propose` (veya aracınızın eşdeğeri) görünmüyorsa veya hiçbir şey yapmıyorsa, bu listeyi yukarıdan aşağı kontrol edin. En hızlı kontrol edilebileceklerden en yavaşa doğru sıralanmışlardır.

1. **Yanlış yerde olabilirsiniz.** Slash komutları AI asistanınızın sohbetine girer, terminalinize değil. Eğer `/opsx:propose` komutunu shell'inize yazdıysanız, sorun buradadır. Bkz. [Komutlar Nasıl Çalışır](how-commands-work.md).

2. **Dosyaları yeniden oluşturun.** Proje kök dizininden:

   ```bash
   openspec update
   ```

   Bu, yapılandırdığınız her araç için beceri ve komut dosyalarını yeniden yazar.

3. **Asistanınızı yeniden başlatın.** Çoğu araç, başlangıçta beceri ve komutları tarar. Yeni bir pencere genellikle sorunu çözer.

4. **Dosyaların var olduğunu doğrulayın.** Claude Code için, `.claude/skills/` dizininde `openspec-*` klasörlerinin bulunduğundan emin olun. Diğer araçlar kendi dizinlerini kullanır, tümü [Desteklenen Araçlar](supported-tools.md) belgesinde listelenmiştir.

5. **Bu projeyi başlattığınızı doğrulayın.** Beceriler proje başına yazılır. Bir depoyu klonladıysanız veya klasör değiştirdiyseniz, orada `openspec init` (veya `openspec update`) komutunu çalıştırın.

6. **Aracınızın komut dosyalarını desteklediğini doğrulayın.** Codex ve birkaç başka araç (CodeArts, Kimi CLI, ForgeCode, Mistral Vibe) için `opsx-*` komut dosyaları oluşturulmaz; bunun yerine beceri tabanlı çağrılar kullanırlar. Codex için `.codex/skills/openspec-*` dizinini kontrol edin. Formlar araca göre değişir: bkz. [Desteklenen Araçlar](supported-tools.md) ve [Komutlar Nasıl Çalışır](how-commands-work.md#slash-command-syntax-by-tool).

## Değişikliklerle Çalışma

### "Change not found"

Komut, kastettiğiniz değişikliği belirleyemedi. Açıkça adlandırın veya mevcut olanları kontrol edin:

```bash
openspec list                    # aktif değişiklikleri gör
/opsx:apply add-dark-mode        # değişikliği sohbette adlandır
```

Ayrıca doğru proje dizininde olduğunuzdan emin olun.

### "No artifacts ready"

Her yapıt ya zaten oluşturulmuştur ya da bir bağımlılık bekleyerek engellenmiştir. Engelleyen şeyi görün:

```bash
openspec status --change <name>
```

Ardından önce eksik bağımlılığı oluşturun. Sırayı unutmayın: öneri, spesifikasyonları ve tasarımı etkinleştirir; spesifikasyonlar ve tasarım birlikte görevleri etkinleştirir.

### `openspec validate` reports warnings or errors

Doğrulama, spesifikasyonlarınızı ve değişikliklerinizi yapısal sorunlar için kontrol eder. Mesajı okuyun: dosyayı ve sorunu adlandırır.

```bash
openspec validate <name>           # tek bir öğeyi doğrula
openspec validate --all            # her şeyi doğrula
openspec validate --all --strict   # daha sıkı kontroller, CI için uygun
```

Yaygın nedenler, eksik zorunlu bir bölüm (örneğin senaryosu olmayan bir spesifikasyon) veya hatalı biçimlendirilmiş bir delta başlığıdır. Dosyayı düzeltin ve tekrar çalıştırın. [CLI referansı](cli.md#openspec-validate) çıktı formatını belgeler.

### The AI created incomplete or wrong artifacts

AI'nin yeterli bağlamı yoktu. Birkaç ayar yardımcı olur:

- Yığınız ve kurallarınız her isteğe enjekte edilsin diye `openspec/config.yaml` dosyasına proje bağlamı ekleyin. Bkz. [Özelleştirme](customization.md#project-configuration).
- Örneğin sadece spesifikasyonlar için geçerli rehberlik sağlamak üzere her yapıt için `rules:` ekleyin.
- Öneri yaparken daha ayrıntılı bir açıklama verin.
- Tüm yapıtları bir kerede oluşturan `/opsx:ff` yerine, her yapıtı tek tek oluşturmak ve incelemek için genişletilmiş `/opsx:continue` komutunu kullanın.

### Archive won't finish, or warns about incomplete tasks

Arşiv, eksik görevler için *engel* olmaz ama sizi uyarır, çünkü arşivleme genellikle işin bittiği anlamına gelir. Görevler kasıtlı olarak kaldıysa (kısmi bir değişiklik dosyalıyorsanız) devam edin. Aksi takdirde önce görevleri bitirin. Arşiv, henüz senkronize etmediyseniz delta spesifikasyonlarınızı ana spesifikasyonlarla senkronize etme seçeneği de sunar; bir nedeniniz yoksa evet deyin.

## Yapılandırma

### My `config.yaml` isn't being applied

Üç yaygın neden:

1. **Yanlış dosya adı.** `.yml` yerine `openspec/config.yaml` olmalıdır.
2. **Geçersiz YAML.** Herhangi bir YAML doğrulayıcısından geçirin; CLI ayrıca satır numaralarıyla sözdizimi hatalarını bildirir.
3. **Yeniden başlatma beklediniz.** Gerek yok. Yapılandırma değişiklikleri hemen etkili olur.

### "Unknown artifact ID in rules: X"

`rules:` altındaki bir anahtar, şemanızdaki hiçbir yapıt ile eşleşmiyor. Varsayılan `spec-driven` şeması için geçerli kimlikler `proposal`, `specs`, `design`, `tasks`'tir. Herhangi bir şema için kimlikleri görmek için:

```bash
openspec schemas --json
```

### "Context too large"

`context:` alanı kasıtlı olarak 50KB ile sınırlıdır, çünkü her isteğe enjekte edilir. Özetleyin veya daha uzun belgeleri yapışturmak yerine bağlantı verin. Az bağlam daha iyi ve daha hızlı sonuçlar üretir.

### "Schema not found"

Referans verdiğiniz şema adı mevcut değil. Mevcut olanları listeleyin ve yazımı kontrol edin:

```bash
openspec schemas                    # mevcut şemaları listele
openspec schema which <name>        # bir şemanın nereden çözüldüğünü gör
openspec schema init <name>         # özel bir şema oluştur
```

Bkz. [Özelleştirme](customization.md#custom-schemas).

## Eski İş Akışından Geçiş

### "Legacy files detected in non-interactive mode"

CI veya etkileşimsiz bir shell'desiniz ve OpenSpec temizlenecek eski dosyalar buldu ama size soramıyor. Otomatik olarak onaylayın:

```bash
openspec init --force
```

Codex için, OpenSpec `$CODEX_HOME/prompts` veya `~/.codex/prompts` dizinindeki eski yönetilen prompt dosyalarını tespit edebilir. Bu temizleme, OpenSpec'in izin verilenler listesindeki eski Codex prompt dosya adlarıyla sınırlıdır ve etkileşimsiz `openspec init` yalnızca yerini alan `.codex/skills/openspec-*` becerileri olan dosyaları kaldırır. Etkileşimsiz `openspec update` komutu, `--force` parametresini vermediğiniz sürece tüm eski temizlemeye dokunmaz.

### Commands didn't appear after migrating

IDE'nizi yeniden başlatın. Beceriler başlangıçta tespit edilir. Hala görünmüyorsa `openspec update` komutunu çalıştırın ve dosya konumlarını [Desteklenen Araçlar](supported-tools.md) belgesinden kontrol edin.

### My old `project.md` wasn't migrated

Bu kasıtlıdır. OpenSpec hiçbir zaman `project.md` dosyasını otomatik olarak silmez, çünkü yazdığınız bağlamı içerebilir. Yararlı kısımları `config.yaml` dosyasının `context:` bölümüne taşıyın, ardından kendiniz silin. [Geçiş Kılavuzu](migration-guide.md#migrating-projectmd-to-configyaml) bunu adım adım anlatır, arındırma işlemini AI'nıza yaptırabileceğiniz bir prompt da içerir.

## Hala takılı kaldınız mı?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Terminalinizden:** `openspec feedback "ne yanlış gitti"` komutu sizin için bir sorun bildirir.

Bir sorun bildirirken, OpenSpec sürümünüzü (`openspec --version`), Node sürümünüzü (`node --version`), AI aracınızı ve tam komutu ve çıktıyı ekleyin. Bu, yardım almayı çok daha hızlı hale getirir.