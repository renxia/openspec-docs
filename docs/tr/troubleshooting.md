# Sorun Giderme

Somut sorunlara somut çözümler. Her bir giriş bir belirtiyi adlandırır, olası nedeni tek bir cümleyle açıklar ve size çözümü verir. Eğer sorununuz burada yoksa, [FAQ](faq.md) yardımcı olabilir ve [Discord](https://discord.gg/YctCnvvshC) kesinlikle yardımcı olacaktır.

## Kurulum ve Yapılandırma

### `openspec: command not found`

CLI kurulu değil veya kabuğunuz onu bulamıyor. Global olarak kurun ve kontrol edin:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Eğer kuruldu ama hala bulunmuyorsa, global npm bin dizininiz muhtemelen `PATH` değişkeninizde değil. Global ikili dosyalarının nerede bulunduğunu görmek için `npm bin -g` komutunu çalıştırın ve bu yolun kabuk profilinizde olduğundan emin olun.

### "Requires Node.js 20.19.0 or higher"

OpenSpec, Node 20.19.0+ üzerinde çalışır. Sürümünüzü kontrol edin ve gerekirse yükseltin:

```bash
node --version
```

Eğer OpenSpec'i kurmak için bun kullanıyorsanız, OpenSpec'in hala Node üzerinde *çalıştığını* unutmayın, bu nedenle `PATH` üzerinde Node 20.19.0+ bulunması gerekir. [Kurulum](installation.md) bölümüne bakın.

### `openspec init` benim AI aracımı yapılandırmadı

Init hangi araçların kurulacağını sorar. Eğer aracınızı atladıysanız veya başka birini eklemek istiyorsanız, sadece tekrar çalıştırın veya etkileşimli olmayan formu kullanın:

```bash
openspec init --tools claude,cursor
```

Araç ID'lerinin tam listesi [Desteklenen Araçlar](supported-tools.md)'da bulunmaktadır. Her şey için `--tools all`, araç kurulumunu atlamak için `--tools none` kullanın.

## Komutlar Görünmüyor

Eğer `/opsx:propose` (veya aracınızın eşdeğeri) görünmüyorsa veya hiçbir şey yapmıyorsa, bu listeyi inceleyin. Bunlar en hızlı kontrol edilmesi gereken sıraya göre düzenlenmiştir.

1. **Yanlış yerde olabilirsiniz.** Slash komutları terminalinizde değil, AI asistanınızın sohbetinde kullanılır. Eğer shell'inize `/opsx:propose` yazdıysanız, sorun budur. [Komutların Nasıl Çalıştığı](how-commands-work.md) bölümüne bakın.

2. **Dosyaları yeniden oluşturun.** Proje kök dizininden:

   ```bash
   openspec update
   ```

   Bu, yapılandırdığınız her araç için beceri (skill) ve komut dosyalarını yeniden yazar.

3. **Asistanınızı yeniden başlatın.** Çoğu araç başlangıçta becerileri ve komutları tarar. Yeni bir pencere genellikle bunu yapar.

4. **Dosyaların var olduğunu doğrulayın.** Claude Code için, `.claude/skills/` dizininin `openspec-*` klasörlerini içerdiğini kontrol edin. Diğer araçlar kendi dizinlerini kullanır; hepsi [Desteklenen Araçlar](supported-tools.md)'da listelenmiştir.

5. **Bu projeyi başlattığınızı doğrulayın.** Beceriler proje bazında yazılır. Eğer bir repo klonladıysanız veya klasör değiştirdiyseniz, orada `openspec init` (veya `openspec update`) çalıştırın.

6. **Aracınızın komut dosyalarını desteklediğini doğrulayın.** Birkaç araç (`Kimi CLI`, `Trae`, `ForgeCode`, `Mistral Vibe`), `opsx-*` komut dosyaları oluşturmaz; bunun yerine beceri tabanlı çağrılar kullanırlar. Formlar araç başına farklıdır: [Desteklenen Araçlar](supported-tools.md) ve [Komutların Nasıl Çalıştığı](how-commands-work.md#slash-command-syntax-by-tool) bölümlerine bakın.

## Değişikliklerle Çalışma

### "Change not found" (Değişiklik bulunamadı)

Komut, hangi değişikliği kastettiğinizi söyleyemedi. Onu açıkça adlandırın veya neyin mevcut olduğunu kontrol edin:

```bash
openspec list                    # aktif değişiklikleri gör
/opsx:apply add-dark-mode        # sohbette değişikliğe isim verin
```

Ayrıca doğru proje dizininde olduğunuzu doğrulayın.

### "No artifacts ready" (Hazır eser yok)

Her bir eser ya zaten oluşturulmuştur ya da bir bağımlılık bekleyerek bloke edilmiştir. Neyin engellediğini görün:

```bash
openspec status --change <name>
```

Ardından eksik olan bağımlılığı önce oluşturun. Sırayı unutmayın: öneri (proposal) spesifikasyonları ve tasarımı etkinleştirir; spesifikasyonlar ve tasarım birlikte görevleri etkinleştirir.

### `openspec validate` uyarı veya hata bildiriyor

Doğrulama, yapısal sorunlar için spesifikasyonlarınızı ve değişikliklerinizi kontrol eder. Mesajı okuyun: dosyayı ve sorunu adlandırır.

```bash
openspec validate <name>           # bir öğeyi doğrula
openspec validate --all            # her şeyi doğrula
openspec validate --all --strict   # daha katı kontroller, CI için iyidir
```

Yaygın nedenler eksik zorunlu bir bölüm (örneğin senaryosu olmayan bir spesifikasyon) veya hatalı biçimlendirilmiş delta başlığıdır. Dosyayı düzeltin ve tekrar çalıştırın. [CLI referansı](cli.md#openspec-validate) çıktı formatını belgeler.

### AI eksik veya yanlış eserler oluşturdu

AI yeterli bağlama sahip değildi. Birkaç kaldıraç yardımcı olabilir:

- Stack'inizi ve kurallarınızı her isteğe dahil etmek için `openspec/config.yaml` dosyasına proje bağlamı ekleyin. [Özelleştirme](customization.md#project-configuration) bölümüne bakın.
- Sadece spesifikasyonlar gibi belirli bir şeye uygulanan rehberlik sağlamak için eser başına `rules:` ekleyin.
- Öneri yaparken daha ayrıntılı bir açıklama verin.
- Her şeyi aynı anda yapan `/opsx:ff` yerine, tek tek bir eseri oluşturmak ve her biriyle gözden geçirmek için genişletilmiş olan `/opsx:continue` kullanın.

### Arşiv bitmiyor veya eksik görevler hakkında uyarıyor

Arşiv, eksik görevlerde *bloke olmaz*, ancak size uyarı verir, çünkü arşivleme genellikle işin bittiği anlamına gelir. Eğer görevler kasıtlı olarak kalıyorsa (kısmi bir değişiklik dosyalıyorsanız), devam edin. Aksi takdirde önce görevleri tamamlayın. Arşiv ayrıca henüz senkronize etmediyseniz delta spesifikasyonlarınızı ana spesifikasyonlarla senkronize etmeyi teklif edecektir; eğer bir nedeniniz yoksa evet deyin.

## Yapılandırma

### `config.yaml` uygulanmıyor

Üç yaygın şüpheli:

1. **Yanlış dosya adı.** Adı `.yml` değil, `openspec/config.yaml` olmalıdır.
2. **Geçersiz YAML.** Herhangi bir YAML doğrulayıcısı ile çalıştırın; CLI ayrıca satır numaralarıyla sözdizimi hatalarını da bildirir.
3. **Yeniden başlatma beklediniz.** Buna ihtiyacınız yok. Yapılandırma değişiklikleri anında yürürlüğe girer.

### "Unknown artifact ID in rules: X" (Kurallarda bilinmeyen eser ID'si: X)

`rules:` altındaki bir anahtar, şemanızdaki herhangi bir esere uymuyor. Varsayılan `spec-driven` şeması için geçerli kimlikler `proposal`, `specs`, `design` ve `tasks`'tır. Herhangi bir şema için ID'leri görmek için:

```bash
openspec schemas --json
```

### "Context too large" (Bağlam çok büyük)

`context:` alanı, her isteğe dahil edildiği için kasıtlı olarak 50KB ile sınırlıdır. Onu özetleyin veya uzun dokümanlara yapıştırmak yerine bir bağlantı verin. Az ve öz bağlam da daha iyi, daha hızlı sonuçlar üretir.

### "Schema not found" (Şema bulunamadı)

Referans verdiğiniz şema adı mevcut değil. Mevcut olanları listeleyin ve yazımını kontrol edin:

```bash
openspec schemas                    # mevcut şemaları listele
openspec schema which <name>        # bir şemanın nereden çözümlendiğini gör
openspec schema init <name>         # özel bir tane oluştur
```

[Özelleştirme](customization.md#custom-schemas) bölümüne bakın.

## Eski İş Akışından Geçiş

### "Legacy files detected in non-interactive mode" (Etkileşimli olmayan modda eski dosyalar algılandı)

CI veya etkileşimli olmayan bir kabuktasınız ve OpenSpec temizlemek için eski dosyalar buldu ancak size soru soramıyor. Otomatik olarak onaylayın:

```bash
openspec init --force
```

### Taşıma işleminden sonra komutlar görünmedi

IDE'nizi yeniden başlatın. Beceriler başlangıçta algılanır. Hala görünmüyorlarsa, `openspec update` çalıştırın ve [Desteklenen Araçlar](supported-tools.md)'daki dosya konumlarını kontrol edin.

### Eski `project.md` dosyam taşınmadı

Bu kasıtlıdır. OpenSpec, yazdığınız bağlamı içerebileceği için asla otomatik olarak `project.md`'yi silmez. Faydalı kısımları `config.yaml`'nin `context:` bölümüne taşıyın, ardından kendiniz silin. [Taşıma Kılavuzu](migration-guide.md#migrating-projectmd-to-configyaml), AI'ınıza verebileceğiniz bir görev dahil olmak üzere bunu anlatır.

## Hala Tıkandınız mı?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Sorunları:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Terminalinizden:** `openspec feedback "what went wrong"` sizin için bir sorun açar.

Bir sorun bildirirken, OpenSpec sürümünüzü (`openspec --version`), Node sürümünüzü (`node --version`), AI aracınızı ve tam komutu ile çıktıyı ekleyin. Bu, yardımı çok daha hızlı hale getirir.