# Używanie OpenSpec w istniejącym projekcie

Nie musisz dokumentować całego swojego kodu źródłowego na początku. Piszesz specyfikacje tylko dla tego, co zamierzasz zmienić. To jest najważniejsza rzecz do zapamiętania przy przejściu na OpenSpec w istniejącym projekcie, i dlatego OpenSpec został zaprojektowany z myślą o pracy na istniejącej infrastrukturze (brownfield-first).

Typowe obawy brzmią tak: „Mój aplikacja ma 80 000 linii kodu. Czy muszę napisać specyfikacje dla wszystkiego, zanim OpenSpec będzie użyteczny?” Nie. Ty byś tego nie chciał, a my też. OpenSpec rozbudowuje Twoje specyfikacje po jednej zmianie naraz. Twoja pierwsza zmiana dokumentuje fragment, który ją dotyka, następna zmiana dokumentuje swój fragment, a w ciągu miesięcy Twoje specyfikacje naturalnie wypełniają się wokół pracy, którą faktycznie wykonujesz.

Ten przewodnik pokazuje, jak zacząć od razu, bez próby „ugotowania całego oceanu”.

## Wersja trzydziestosekundowa

```bash
$ cd your-existing-project
$ openspec init          # dodaje openspec/ i komendy Twojego narzędzia AI
```

Następnie w swoim czacie z AI:

```text
/opsx:explore            # opcjonalnie: pozwól AI przeczytać obszar, który zamierzasz dotknąć
/opsx:propose <a real, small change you actually need> # zaproponuj rzeczywistą, małą zmianę, której naprawdę potrzebujesz
/opsx:apply
/opsx:archive
```

Twoje specyfikacje opisują teraz dokładnie ten fragment systemu, który została zmieniony, i nic więcej. To jest prawidłowe. Przestań martwić się o pozostałe 80 000 linii kodu.

## Dlaczego podejście delta-first to cała sztuczka

Zmiany w OpenSpec są pisane jako **deltas**: `ADDED`, `MODIFIED`, `REMOVED`. Delta opisuje, co zmienia się w stosunku do obecnego zachowania, a nie cały system.

To jest dokładnie to, czego potrzebuje praca na istniejącej infrastrukturze (brownfield). Rzadko kiedy budujesz od zera. Dodajesz pole, naprawiasz przekierowanie, zaostrzasz limit czasu. Delta pozwala Ci precyzyjnie określić tę jedną zmianę bez konieczności najpierw napisania 40-stronicowej specyfikacji wszystkiego wokół niej.

Dlatego Twój katalog `openspec/specs/` nie zaczyna się pełny i kompletny. Zaczyna się prawie pusty i gromadzi informacje. Każda zarchiwizowana zmiana integruje swoją deltę. Specyfikacja dla `auth/` staje się gruntowna dopiero po tym, jak wykonasz kilka zmian związanych z uwierzytelnianiem, co jest dokładnie tym momentem, w którym chcesz, aby była ona gruntowna.

Jeśli interesują Cię głębsze mechanizmy, zobacz [Concepts: Delta Specs](concepts.md#delta-specs).

## Twoja pierwsza zmiana na prawdziwej bazie kodu

Wybierz coś małego i realnego. Nie zabawka, nie przepisanie wszystkiego. Zmianę, którą planowałeś zrobić w tym tygodniu. Małe pierwsze zmiany uczą Cię workflow przy niskim poziomie ryzyka.

**Krok 1: Pozwól AI przeczytać odpowiedni obszar.** To jest moment, w którym `/opsx:explore` zasługuje na swoje miejsce w nieznanej lub dużej bazie kodu. Wskaż ją na fragment, który zamierzasz dotknąć, i pozwól jej przeanalizować, jak działają rzeczy, zanim cokolwiek zaproponujesz.

```text
Ty: /opsx:explore

AI:  Co chciałbyś zbadać?

Ty: Muszę dodać ograniczanie liczby żądań (rate limiting) do naszego publicznego API, ale nie jestem pewien, jak obecnie przepływają żądania przez middleware.

AI:  Pozwól mi to prześledzić... [czyta router, stos middleware i konfigurację]
     Żądania trafiają do Express, przechodzą przez middleware uwierzytelniania, a następnie Twoje kontrolery. Obecnie nie ma warstwy ograniczania liczby żądań. Najczystszym punktem wstawienia jest middleware zaraz po uwierzytleniu. Czy mam to ująć?
```

Zauważ, że AI rozumie teraz Twoją rzeczywistą strukturę, więc propozycja, którą napisze, pasuje do Twojego kodu, a nie do ogólnego szablonu. W dużym projekcie ta jedna nawykowa zmiana oszczędza najwięcej bólu. Zobacz [Explore First](explore.md).

**Krok 2: Zaproponuj zmianę.** Propozycja i jej specyfikacja delta obejmują tylko tę jedną zmianę.

```text
Ty: /opsx:propose add-api-rate-limiting
```

**Krok 3: Zbuduj i zarchiwizuj** za pomocą `/opsx:apply` i `/opsx:archive`, tak jak każdą inną zmianę. Po archiwizacji masz prawdziwą specyfikację zachowania dotyczącego ograniczania liczby żądań, urodzoną z zmiany, którą i tak musiałeś wprowadzić.

## Wolisz przewodnik? Użyj onboard

Jeśli wolisz obserwować cały proces na swoim własnym kodzie wraz z narracją, rozszerzona komenda `/opsx:onboard` robi dokładnie to samo: skanuje Twój kod źródłowy w poszukiwaniu małej, bezpiecznej poprawki, a następnie prowadzi Cię przez propozycję, budowanie i archiwizację tej zmiany, wyjaśniając każdy krok.

Najpierw włącz rozszerzone komendy:

```bash
$ openspec config profile      # wybierz rozszerzone workflow
$ openspec update              # zastosuj je do tego projektu
```

Następnie w czacie:

```text
/opsx:onboard
```

Jest to najłagodniejsze możliwe wprowadzenie na prawdziwym projekcie, a kończy się tym, że masz autentyczną (małą) zmianę, którą możesz zachować lub odrzucić. Zobacz [Commands: `/opsx:onboard`](commands.md#opsxonboard).

## „Ale mam już dokumentację wymagań”

Może posiadasz PRD, SRS, formalną specyfikację, nawet modele TLA+. Dobrze. Nie importujesz ich w całości ani nie odrzucasz.

Traktuj istniejącą dokumentację jako **materiał źródłowy do eksploracji**, a nie jako specyfikacje do konwersji. Gdy zaczniesz zmianę, wklej lub skieruj AI na odpowiedni fragment i pozwól jej ukształtować skoncentrowaną deltę OpenSpec z niego. Delta przechwytuje zachowanie, które zmieniasz teraz, w formie testowalnego wymagania i scenariusza OpenSpec. Twoje oryginalne dokumenty pozostają tam jako tło.

Szczera przyczyna: Specyfikacje OpenSpec są celowo skoncentrowane na zachowaniu (behavior-first) i ograniczone do zmian. 40-stronicowy PRD to inny artefakt z innym zadaniem. Wymuszanie jednorazowej masowej konwersji ma tendencję do generowania dużej, przestarzałej specyfikacji, której nikt nie ufa. Pozwalanie na wzrost specyfikacji z realnych zmian utrzymuje ich dokładność.

```text
Ty: /opsx:explore
Ty: Oto sekcja naszego PRD dotycząca procesu realizacji zamówienia (checkout). Implementuję wymaganie „guest checkout”.
     [wklej odpowiednie wymaganie]
AI:  [czyta, zadaje pytania wyjaśniające, a następnie pomaga ująć zmianę]
Ty: /opsx:propose add-guest-checkout
```

## Organizowanie specyfikacji w dużej bazie kodu

Specyfikacje znajdują się w `openspec/specs/`, pogrupowane według **domeny**: logicznego obszaru, który odpowiada temu, jak Twój zespół myśli o systemie. Nie musisz projektować całej taksonomii od razu. Utwórz folder domeny, gdy Twoja pierwsza zmiana w tym obszarze tego wymaga.

Typowe sposoby dzielenia domen:

- **Według obszaru funkcjonalnego:** `auth/`, `payments/`, `search/`
- **Według komponentu:** `api/`, `frontend/`, `workers/`
- **Według ograniczonego kontekstu (bounded context):** `ordering/`, `fulfillment/`, `inventory/`

Wybierz to, co sprawi, że nowicjusz skinie głową z uznaniem. Możesz to dopracować później. Zobacz [Concepts: Specs](concepts.md#specs).

## Monorepo i praca rozciągająca się na wiele repozytoriów

Dla monorepo najprostszym modelem jest jeden katalog `openspec/` w głównym katalogu repozytorium, z domenami mapującymi się do Twoich pakietów lub usług. To obejmuje większość zespołów.

Jeśli Twoja praca rzeczywiście rozciąga się na **wiele repozytoriów** (lub kilka pakietów, które traktujesz jako oddzielne), OpenSpec ma betaową funkcję **stores**: planowanie odbywa się w osobnym, niezależnym repozytorium, do którego każde z Twoich repozytoriów kodu może się odwoływać. Oznacza to, że plan nie musi istnieć wewnątrz folderu `openspec/` jednego z repozytoriów. Jest to beta, więc traktuj jej komendy i stan jako ewoluujące. Zacznij od [Stores User Guide](stores-beta/user-guide.md), aby zrozumieć model mentalny i najprostsza użyteczna ścieżka.

## Kilka szczerych ostrzeżeń

- **Opornaj się pokusie wypełniania luk (back-fill) wszystkiego.** Pisanie specyfikacji dla kodu, którego nie zmieniasz, wydaje się produktywne, ale zazwyczaj nie jest. Te specyfikacje stają się przestarzałe, ponieważ nic ich nie zmusza do śledzenia rzeczywistości. Niech realne zmiany napędzają Twoje specyfikacje.
- **Utrzymuj wczesne zmiany na małej skali.** Twoje pierwsze zmiany są równie ważne dla nauczenia rytmu, co dla dostarczenia produktu. Ograniczony zakres sprawia, że pętla jest szybka, a lekcje tanie.
- **Commituj `openspec/` do git.** Twoje specyfikacje i archiwum należą do systemu kontroli wersji obok kodu, który je opisują.
- **Daj AI kontekst.** W dużym projekcie z silnymi konwencjami uzupełnij `context:` w `openspec/config.yaml`, aby każda propozycja szanowała Twój stos i wzorce. Zobacz [Customization](customization.md#project-configuration).

## Dokąd się udać dalej

- [Explore First](explore.md) - kluczowy nawyk, by zrozumieć kod przed jego zmianą
- [Getting Started](getting-started.md) - pełny przewodnik po pierwszej zmianie
- [Editing & Iterating on a Change](editing-changes.md) - dostosowywanie zmiany w miarę uczenia się
- [Concepts: Delta Specs](concepts.md#delta-specs) - dlaczego delty sprawiają, że praca na istniejącej infrastrukturze jest czysta
- [Customization](customization.md) - naucz OpenSpec konwencjom swojego projektu