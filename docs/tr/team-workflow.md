# Takımda OpenSpec

Diğer kılavuzlardaki her şey, tek başınıza çalışıp çalışmadığınıza veya yirmi kişilik bir takımda olup olmadığınıza bakılmaksızın aynı şekilde çalışır. Takımda değişen şey kenarlardaki sorulardır: spec'ler nerede saklanır, takım arkadaşları bir planı nasıl gözden geçirir ve tüm bunlar var olan pull-request akışına nasıl uyarlanır?

Kısa cevap: bir değişiklik sadece dosyalardır ve OpenSpec asla git'e dokunmaz. Böylece var olan iş akışınızı yerine geçmek yerine ona uyarlanır. Bu sayfa iyi çalışan kuralları açıklar.

## Tek kural: OpenSpec git'e dokunmaz

OpenSpec, `openspec/` altında düz Markdown okur ve yazar. Projenizde asla commit, branch oluşturma, push veya pull işlemi yapmaz ve kendi başına hiçbir zaman bir [mağaza](stores-beta/user-guide.md) klonlamaz veya senkronize etmez. Bu şu anlama gelir:

- **`openspec/` klasörünü herhangi bir kaynak dosyası gibi commit edersiniz.** Spec'ler, aktif değişiklikler ve arşiv, projenizin geçmişinin bir parçasıdır. (Evet, tüm klasörü commit edin — bkz. [SSS](faq.md#should-i-commit-the-openspec-folder-to-git).)
- **Bir değişiklik, koda uygulanan versiyonlama kurallarına tabi olan bir klasördür.** `openspec/changes/add-dark-mode/` sadece bir branch üzerindeki dosyalardır.
- **Aşağıdaki her şey zorunlu kural değil, kabul görmüş bir uygulamadır.** OpenSpec sizi bu şekilde yapmaya zorlamaz; sadece temiz bir şekilde uyum sağlar.

## Günlük iş akışı

İyi çalışan iş akışı, bir değişikliği bir branch ve bir pull request ile eşleştirir:

```
git switch -c add-dark-mode        her zamanki gibi bir branch oluştur
   │
/opsx:propose add-dark-mode        planın taslağını oluştur (proposal + spec'ler + görevler)
   │
REVIEW THE PLAN                    herhangi bir koddan önce onu okursunuz — bkz. Değişikliği Gözden Geçirme
   │
/opsx:apply                        oluşturun; yapıtlar ve kod değişikliği birlikte
   │
git commit && open a PR            PR, spec değişimini VE kodu içerir
   │
teammate reviews, merges
   │
/opsx:archive                      değişimi spec/'e katlar, değişikliği arşive taşır
```

Plan ve kod aynı branch içinde yan yana bulunur, böylece takım arkadaşlarınız her ikisini de birlikte gözden geçirir ve altı ay sonra bile arşivlenmiş spec, kodun neden şu anda olduğu gibi göründüğünü açıklamaya devam eder.

## Pull request içinde spec'leri gözden geçirme

Takımın faydasını hissettiği yer burasıdır. Bir PR değişikliğin delta spec'ini içerdiğinde, gözden geçiren kişi ham bir diff'in asla veremeyeceği bir şey elde eder: **bu değişikliğin ne yapması gerektiğine dair düz bir dil ifadesi**, herhangi bir kod satırını okumadan önce.

Gözden geçiren kişi için iyi bir gözden geçirme sırası:
1. **`proposal.md` dosyasını okuyun** — bu doğru sorun ve kapsam mı?
2. **`specs/` altındaki değişimi okuyun** — "tamam" doğru tanımlanmış mı? (Bu, [Değişikliği Gözden Geçirme](reviewing-changes.md) iki dakikalık geçişi, şimdi PR içinde gerçekleşiyor.)
3. **Ardından kod diff'ini okuyun** — tam olarak o gereksinimleri karşılıyor mu?

Yaklaşımı *reddeden* bir gözden geçiren kişi, 300 satır kod boyunca bunu yeniden tartışmak yerine, ucuz bir şekilde proposal'a karşı bunu söyleyebilir. Delta spec'i PR açıklamasının en üstüne koyun veya gözden geçirenleri değişiklik klasörüne yönlendirin, böylece orada başlarlar.

## Ne zaman arşivlemek gerektiğinde

Arşivleme, bir değişikliğin deltalarını ana `openspec/specs/` klasörünüze katlar ve değişiklik klasörünü `openspec/changes/archive/YYYY-MM-DD-<name>/` konumuna taşır. `specs/` klasörü **ortak doğru kaynak** olduğu için, takımda zamanlama önemlidir. İki uygulanabilir kural vardır:
- **PR birleştirildikten sonra arşivle (önerilir).** Branch aktif değişikliği taşır; ana branch'inize birleştirildikten sonra orada arşivleyin (genellikle küçük bir takip commit'i veya planlı bir temizlik işlemi olur). Bu, ortak `specs/` klasörünü yalnızca gerçekten dağıtılan çalışmalarla ilerletmesini sağlar.
- **PR içinde arşivle.** Küçük takımlar için daha basittir: kodu ekleyen aynı PR aynı zamanda senkronize eder ve arşivler. Bunun dezavantajı, `specs/` diff'iniz ve kod diff'iniz birlikte yüklenmesidir, bu da PR'ı daha gürültülü hale getirebilir.

Birini seçin ve tutarlı olun. Her iki durumda da `/opsx:archive`, görevlerin tamamlanıp tamamlanmadığını kontrol eder ve önce senkronize etme seçeneği sunar, böylece hiçbir şey yarı bırakılmış olarak birleştirilmez.

## İki kişi, paralel değişiklikler

Değişiklikler ayrı klasörler olduğu için çakışmazlar:
- **Farklı değişiklikler, farklı kişiler — sorun yok.** `add-dark-mode` ve `rate-limit-login` farklı klasörlerdir, farklı branch'ler üzerindedirler; ikisi de arşivlenene kadar birbirlerine dokunmazlar.
- **Bir değişiklik, bir sahibi.** Aynı değişiklik klasörünü düzenleyen iki kişi, tam olarak aynı dosyayı düzenleyen iki kişi gibi çakışır. Bir değişikliği tek bir yazara ait tutun veya iki ayrı değişikliğe ayırın (bunu [doğru boyutta yapmak](writing-specs.md#right-size-the-change) için bir başka neden).
- **Çakışmaların tek ortaya çıktığı yer `specs/` klasörüdür.** İki değişiklik de aynı gereksinimi değiştiriyorsa, ikincisini arşivlerken `openspec/specs/…/spec.md` dosyasında çakışma olur — herhangi bir birleştirme çakışması gibi çözün, gerçeği yansıtan gereksinimi koruyun. Bu nadirdir ve bir özelliktir: git, iki değişikliğin sistemin nasıl davranması gerektiği konusunda anlaşmadığını size bildirir.

## Planlama tek depoyu aştığında

Yukarıdaki her şey, planın kod deposunun kendi `openspec/` klasöründe bulunduğu varsayımına dayanır, bu da doğru varsayılandır. Planlama işleminiz gerçekten birden fazla depo veya takımı kapsadığında — üç servisi etkileyen bir özellik veya bir takımın sahip olduğu ve diğerlerinin kullandığı gereksinimler — tam olarak beta **mağaza** özelliğinin kullanım amacı budur: planlama kendi deposunu alır ve herhangi bir kod deposu bu depoya yönlendirebilir. [Mağaza Kullanıcı Kılavuzu](stores-beta/user-guide.md) ile başlayın.

## Sonra nereye gidebilirsiniz
- [Değişikliği Gözden Geçirme](reviewing-changes.md) — gözden geçirme geçişi, artık PR'ınızın içinde.
- [İyi Spec'ler Yazma](writing-specs.md) — tek bir branch'e sığacak şekilde bir değişikliği doğru boyutta yapma yöntemi de dahil.
- [Mağaza Kullanıcı Kılavuzu](stores-beta/user-guide.md) — depoları ve takımları kapsayan planlama.