# Değişikliği İnceleme

OpenSpec'in tüm vaadi, siz ve yapay zekanız **herhangi bir kod yazılmadan önce ne yapacağınız üzerinde anlaşmaya varmanızdır.** Bu anlaşma, yapay zekanın taslakladığı şeyi gerçekten okuduğunuzda anlamlı olur. Bu sayfa, bunu yaptığınız o iki dakikadan bahsediyor — neyi açacağınız, hangi sırayla ve neye bakmanız gerektiği.

Bahis çok basit: Tek paragraflık bir planda yanlış bir yolu yakalamak neredeyse ücretsizdir. Aynı yanlış yolu 300 satır koddan yakalamak öyle değildir. İnceleme, bu bahsi topladığınız yerdir.

## İnceleme yaptığınız iki an

Tam olarak iki tane vardır:

```
/opsx:propose ──► PLANI İNCELE ──► /opsx:apply ──► KODU İNCELE ──► /opsx:archive
                  (herhangi bir kod yazılmadan önce)                    (/opsx:verify)
```

1. **`/opsx:apply`'den önce** (veya `/opsx:ff`'den sonra) — plan hala sadece kelimelerken okuyun.
2. **İnşa edildikten sonra**, `/opsx:verify` ile — kodun gerçekten plana uygun olarak çalıştığından emin olun.

İlk inceleme en çok kazandıran olanıdır ve insanların atladığı yerdir. Bu sayfa çoğu zamanını burada geçirir.

## Bu sırayla okuyun

Bir değişiklik, `openspec/changes/<name>/` klasöründeki düz Markdown dosyalarından oluşur. Bir şeyin yanlış olduğu durumda en erken çıkmanızı sağlayan sırayla dosyaları okuyun:

```
openspec/changes/add-dark-mode/
├── proposal.md      1. niyet ve kapsam   ← eğer bu yanlışsa burada durun
├── specs/…/spec.md  2. gereksinimler       ← incelemenin kalbi
├── design.md        (sadece daha büyük değişiklikler için) — teknik yaklaşım
└── tasks.md         3. iş planı
```

Her satırı okumanız gerekmez. Her dosya için bir tane olmak üzere üç soruyu cevaplamanız gerekir.

## Teklif: bu doğru soru mu?

Önce `proposal.md` dosyasını açın. "Neden" ve "ne"yi yakalar — niyet, kapsam, bir veya iki paragraflık yaklaşım.

**İyi görünüm neye benzer:** tek bir net niyet, tanıdığınız bir kapsam ve şimdi yapmaya değer bir neden.

**Kırmızı bayraklar:**

- Sorduğunuz sorudan biraz *farklı* bir sorunu çözer.
- Kapsam büyüdü — bir tema değiştirici istediniz ve teklif ayrıca "orada olduğumuz için" kimlik doğrulamayı da değiştiriyor.
- Belirsizdir. "Ayarlar sayfasını iyileştir" bir kapsam değildir; "OS tercihine saygı duyan karanlık mod değiştirici ekle" bir kapsamdır.

**Cevaplamanız gereken soru:** *Bu benim gerçekten istediğim şeyle eşleşiyor mu ve arka planda bir şeyler sızıyor mu?* Cevap hayırsa durun — daha ileri okumayın, teklifi düzeltin (bkz. [Geri basmak ucuzdur](#geri-basmak-ucuzdur)).

## Spec delta'ları: "tamam" doğru tanımlandı mı?

Bu incelemenin kalbidir. `specs/` altındaki delta spec'leri, değişiklik kargoya verildiğinde neyin doğru olacağını söyler — gereksinimler ve bunları kanıtlayan senaryolar olarak:

```markdown
## EKLENEN Gereksinimler

### Gereksinim: Karanlık Mod Değiştirici
Sistem KULLANICININ açık ve karanlık temalar arasında geçiş yapmasına izin VERECEKTİR (SHALL).

#### Senaryo: İlk açılışta OS tercihine saygı duyar
- KULLANICI hiçbir zaman tema ayarlamadığında
- KULLANICI karanlık moda ayarlanmış bir cihazda uygulamayı açtığında
- UYGULAMA karanlık modda render edilir
```

**İyi bir gereksinime ne benzer:** bir testçiye verebileceğiniz tek bir net `SHALL`/`MUST` ifadesi ve bu ifadeyi gerçekten çalıştıran en az bir GIVEN/WHEN/THEN senaryosu.

**Kırmızı bayraklar:**

- **Belirsiz bir gereksinim.** "Sistem HIZLI olacaktır (SHALL)" inşa edilemez veya test edilemez. Hızlı ne demek?
- **Senaryosu olmayan bir gereksinim**, veya altında bulunduğu gereksinimi test etmeyen bir senaryo.
- **En değerli yakalama: eksik olan ne?** Yapay zeka sizin *söylediğiniz* şeyi sadakatle yazıyor. Sizin işiniz *söylemeyi unuttuğunuz* şeyi fark etmektir. En çok OS tercihi durumunu önemsediyseniz ve hiçbir senaryo ondan bahsetmiyorsa, inceleme kendi masrafını karşılıyor.

Delta'ları şu soruyu sorarak okuyun: *Sistemin tam olarak — ve sadece — bunu yapmasından mutlu olur muyum?* Burada henüz kod yok, bu yüzden değiştirmek ucuz kalıyor.

## Görevler: iş planı mantıklı mı?

Son olarak `tasks.md` dosyasını açın. Yapay zekanın çalışacağı uygulama kontrol listesidir.

**İyi görünüm neye benzer:** sıralı adımlar, her biri bir gereksinime izlenebilir, hiçbir gizli şey yok.

**Kırmızı bayraklar:**

- Eşleşen gereksinimi olmayan bir görev (bu nereden geldi?).
- Tüm gerçek kararları gizleyen tek devasa "özelliği uygula" görevi.
- Az önce onayladığınız kapsamın dışında bir şeye dokunan bir görev.

Burada tahmin yapıyor veya mikroyönetim yapmıyorsunuz — zaten kabul ettiğiniz gereksinimlerle planın eşleştiğini kontrol ediyorsunuz.

## Geri basmak ucuzdur

Üç sorudan herhangi biri yanlış çıktıysa bunu söyleyin. Aşamalar yok ve hiçbir şey kilitli değil — düzelterek devam edersiniz. [Değişikliği düzenlemede](editing-changes.md) olduğu gibi tam olarak iki yol vardır:

- **Dosyayı kendiniz düzenleyin.** Düz Markdown'dır; kapsam satırını değiştirin, gereksinimi sıkılaştırın, görevi silin.
- **Yapay zekaya neyin yanlış olduğunu söyleyin** ve revize etmesini sağlayın: *"kimlik doğrulama değişikliklerini çıkar — kapsam dışında,"* *"kullanıcı zaten bir tema seçtiğinde bir senaryo ekle,"* *"3. görevi şema ve UI olarak ayır."*

Sonra değiştirdiğiniz kısmı tekrar okuyun. İmzalayabileceğiniz bir plan olana kadar yeniden taslağınız. Bu gidiş dönüş *ürünün çalışmasıdır.*

## Kod sonrası: doğrula

İş bir kez inşa edildikten sonra, `/opsx:verify` ikinci incelemenizdir. Eserleri ve kodu tekrar okur ve üç boyutta uyumsuzlukları raporlar:

| Boyut | Ne kontrol eder |
|-------|-----------------|
| **Tamamlık** | Her görev tamamlandı mı, her gereksinim uygulandı mı, senaryolar kapsandı mı |
| **Doğruluk** | Uygulama, spec'in niyetine uyuyor mu, kenar durumları ele alındı mı |
| **Uyum** | Tasarım kararları kodda gerçekten görülüyor mu |

```
Siz: /opsx:verify

Yapay zeka:  add-dark-mode doğrulanıyor...

     TAMAMLIK
     ✓ tasks.md'deki tüm 8 görev işaretlendi
     ✓ Spec'lerdeki tüm gereksinimlerin karşılık gelen kodu var
     ⚠ "İlk açılışta OS tercihine saygı duyar" senaryosunun test kapsaması yok
```

Sorunları KRİTİK, UYARI veya ÖNERİ olarak işaretler ve arşivlemeyi **engellemez** — boşlukları ortaya çıkarır ve kararı size bırakır. Bu, "yapay zeka kod yazdı mı" ile "sözleştiğimiz şeyi inşa etti mi" arasındaki farktır.

`/opsx:verify` genişletilmiş profilde yer alır. Eğer sahip değilseniz, `openspec config profile` ile açın (ardından `openspec update`), ya da kendiniz değişikliği ve diff'i tekrar okuyun.

## İncelemeyi boyutlandırın

Her değişiklik tam geçişi hak etmez. Tek dosyalı bir yazım hatası düzeltmesi yirmi saniyelik bir göz atmaya layıktır. Kimlik doğrulama, ödemeler veya geri alınamayacak verileri değiştiren bir değişiklik yukarıdaki tüm soruları hak eder. Nokta asla bir seremoniden ibaret değildir — hatanız pahalı olacağı yere dikkatinizi harcarsınız, pahalı olmayacağı yere göz atarsınız.

## İki dakikalık kontrol listesi

- [ ] Teklifin niyeti benim istediğim şeyle eşleşiyor.
- [ ] Kapsama ekstra hiçbir şey sızmadı.
- [ ] Her gereksinim test edilebilecek kadar özeldir.
- [ ] Her gereksinim, onu gerçekten çalıştıran bir senaryoya sahiptir.
- [ ] En çok önemsediğim durum kapsanıyor.
- [ ] Görevler gereksinimlere eşleniyor; hiçbir şey gizli veya kapsam dışında değil.
- [ ] Yapay zekanın tam olarak bunu ve başka hiçbir şeyi inşa etmesinden rahat olurum.

Yedi maddeden hepsi geçerse, güvenle `/opsx:apply` komutunu çalıştırın. Herhangi biri başarısız olursa, bu bir gerileme değildir — iki dakikanın işini yapmasıdır.

## Sonra nereye gidebilirsiniz

- [İyi Spec'ler Yazma](writing-specs.md) — diğer taraf: onaylanmaya değer gereksinimler ve senaryolar nasıl tasarlanır.
- [Değişikliği Düzenleme ve Üzerinde İterasyon Yapma](editing-changes.md) — planı başladıktan sonra değiştirmenin mekanikleri.
- [İş Akışları](workflows.md) — incelemenin daha büyük döngüde nerede yer aldığı.