# Przykłady i przepisy

Prawdziwe zmiany, od początku do końca. Każdy przepis pokazuje polecenia, które wpisałbyś, oraz to, co byś zobaczył w odpowiedzi, dzięki czemu możesz dopasować swoją sytuację do wzorca i go skopiować. Wykorzystują one domyślne polecenia **core** (`propose`, `explore`, `apply`, `sync`, `archive`); tam, gdzie rozszerzony zestaw jest pomocny, jest to zaznaczone.

Przypomnienie przed rozpoczęciem: polecenia ukośnikowe takie jak `/opsx:propose` wpisujesz w **czat asystenta AI**, a polecenia `openspec` wpisujesz w swoim **terminalu**. Jeśli to nowość, przeczytaj najpierw [Jak działają polecenia](how-commands-work.md). W poniższych transkryptach `Ty:` i `AI:` to czat, a linie zaczynające się od `$` to terminal.

> **Nie masz jeszcze pewności, co budujesz?** Większość z tych przepisów jest skuteczniejsza, jeśli zaczniesz od `/opsx:explore`, aby najpierw to przemyśleć. [Przepis 3](#przepis-3-eksploracja-przed-zobowizaniem) pokazuje to w praktyce, a przewodnik [Eksploracja najpierw](explore.md) przedstawia pełny argument.

## Przepis 1: Mała funkcja, szybka ścieżka

**Kiedy go użyć:** wiesz, czego chcesz, i jest to zamknięty kawałek pracy. To najczęstszy przepis.

Całość to trzy polecenia. Zaproponuj, zbuduj, zarchiwizuj.

```text
Ty: /opsx:propose add-logout-button

AI:  Utworzono openspec/changes/add-logout-button/
     ✓ proposal.md — dlaczego i co
     ✓ specs/      — nowe wymaganie i jego scenariusze
     ✓ design.md   — podejście techniczne
     ✓ tasks.md    — lista kontrolna implementacji
     Gotowe do implementacji. Uruchom /opsx:apply.
```

Teraz przeczytaj plan. Otwórz propozycję i specyfikację delty. To jest moment, do którego OpenSpec jest zbudowany: wyłapanie błędnego założenia, gdy jest jeszcze jednym akapitem, a nie 400 liniami kodu. Edytuj dowolny artefakt bezpośrednio, jeśli coś jest nie tak, a następnie kontynuuj.

```text
Ty: /opsx:apply

AI:  Praca nad zadaniami...
     ✓ 1.1 Dodaj przycisk wylogowania do nagłówka
     ✓ 1.2 Wyczyść sesję po kliknięciu
     ✓ 1.3 Dodaj okno potwierdzenia
     Wszystkie zadania ukończone!

Ty: /opsx:archive

AI:  Archiwizacja add-logout-button...
     ✓ Scalono specyfikacje do openspec/specs/auth/spec.md
     ✓ Przeniesiono do openspec/changes/archive/2026-06-22-add-logout-button/
     Gotowe. Gotowe na następną zmianę.
```

To wszystko. Zachowanie wylogowania jest teraz częścią twoich specyfikacji, a zmiana została zachowana wraz z pełnym kontekstem.

## Przepis 2: Naprawa błędu

**Kiedy go użyć:** coś jest zepsute i chcesz, aby naprawa została zapisana jako celowa zmiana zachowania, a nie tajemniczy commit.

Naprawy błędów działają dokładnie tak jak funkcje. Różnica polega na sposobie sformułowania propozycji: opisz *poprawne* zachowanie, a nie tylko „napraw błąd”.

```text
Ty: /opsx:propose fix-login-redirect-loop

AI:  Utworzono openspec/changes/fix-login-redirect-loop/
     Propozycja przechwytuje obecne zepsute zachowanie oraz
     zamierzone zachowanie. Specyfikacja delty MODYFIKUJE wymaganie
     przekierowania, dzięki czemu jest teraz precyzyjne i testowalne.
     Gotowe do implementacji.
```

Ponieważ naprawa trafia jako `MODIFIED` wymaganie ze świeżym scenariuszem, następna osoba (lub następna sesja AI) widzi nie tylko to, że to naprawiłeś, ale też oznacza „poprawne”. Następnie `/opsx:apply` i `/opsx:archive` jak zwykle.

Wskazówka: dla naprawy dobrym scenariuszem jest test regresji w formie opisu. „GIVEN wylogowany użytkownik, WHEN przesyła prawidłowe dane logowania, THEN trafia na pulpit i nie jest ponownie przekierowywany”. Napisz to, a implementacja będzie miała jasny cel.

## Przepis 3: Eksploracja przed zobowiązaniem

**Kiedy go użyć:** masz problem, ale jeszcze nie planu. Nie masz pewności, co zbudować, lub które podejście jest właściwe.

Zacznij od `/opsx:explore`. To partner do myślenia bez struktury i bez tworzonych artefaktów. Czyta twoją bazę pomaga i pomaga ci podjąć decyzję.

```text
Ty: /opsx:explore

AI:  Co chciałbyś zbadać?

Ty: Ładowanie stron wydaje się wolne, ale nie wiem, gdzie idzie czas.

AI:  Pozwól, że sprawdzę... Znalazłem trzy prawdopodobne przyczyny:
     1. Duże nieoptymalizowane obrazy na liście produktów
     2. Synchroniczne pobieranie danych, które blokuje renderowanie
     3. Ponowne renderowania wywołane przez zmiany kontekstu
     Którym powinniśmy się zająć najpierw?

Ty: Tym z pobieraniem danych.

Ty: /opsx:propose optimize-product-list-fetching

AI:  Utworzono zmianę z propozycją opartą na tym, co właśnie
     znaleźliśmy. Gotowe do implementacji.
```

Eksploracja wyjaśnia twoje myślenie *zanim* wydasz zmianę. Gdy krystalizuje się wniosek, zaproponuj, a AI przeniesie kontekst dalej.

## Przepis 4: Praca z dwiema zmianami naraz

**Kiedy go użyć:** jesteś w trakcie implementacji funkcji, a pilna naprawa przeskakuje w kolejce.

Zmiany to niezależne foldery, więc praca równoległa nie powoduje konfliktów. Rozpocznij naprawę, wydaj ją, a następnie wróć do funkcji dokładnie tam, gdzie skończyłeś.

```text
Ty: Jestem w trakcie add-dark-mode, ale muszę teraz naprawić błąd logowania.

Ty: /opsx:propose fix-login-redirect

AI:  Utworzono openspec/changes/fix-login-redirect/. Gotowe do implementacji.

Ty: /opsx:apply

AI:  Zaimplementowano naprawę. Wszystkie zadania ukończone.

Ty: /opsx:archive

AI:  ✓ Zarchiwizowano fix-login-redirect.

Ty: Powrót do trybu ciemnego.

Ty: /opsx:apply add-dark-mode

AI:  Wznawiam add-dark-mode. Kontynuuję od zadania 2.3: Zaktualizuj nagłówek...
```

Nazwanie zmiany w `/opsx:apply add-dark-mode` to sposób, w jaki wskazujesz AI konkretną zmianę, gdy więcej niż jedna jest aktywna. Ponieważ zadania śledzą ukończenie w `tasks.md`, AI wie dokładnie, gdzie się zatrzymałeś.

Gdy kilka zmian jest gotowych naraz, rozszerzone `/opsx:bulk-archive` archiwizuje je razem i rozwiązuje konflikty specyfikacji, sprawdzając to, co faktycznie zaimplementowano. Zobacz [Przepływy pracy](workflows.md#parallel-changes).

## Przepis 5: Refaktoryzacja bez zmiany zachowania

**Kiedy go użyć:** restrukturyzujesz kod, a zachowanie widoczne z zewnątrz powinno pozostać identyczne.

To interesujący przypadek, ponieważ czysta refaktoryzacja nie ma *niczego do dodania do twoich specyfikacji*. Kontrakt zachowania się nie zmienia; zmienia się tylko implementacja. Więc praca znajduje się w projekcie i zadaniach, a specyfikacja delty jest pusta lub nieobecna.

```text
Ty: /opsx:propose refactor-payment-module

AI:  Utworzono zmianę. Propozycja określa cel (podział
     modułu płatności, bez zmiany zachowania), a projekt przechwytuje
     nową strukturę. Brak zmian specyfikacji, ponieważ zachowanie jest identyczne.
     Gotowe do implementacji.
```

Zadeklaruj pustą deltę jawnie, ustawiając `skip_specs: true` w pliku `.openspec.yaml` zmiany:

```yaml
schema: spec-driven
skip_specs: true
```

Bez tego znacznika `openspec validate` odrzuca zmianę z zerowymi deltami (więc zapomniana faza specyfikacji i tak zostanie wyłapana); z nim walidacja przechodzi, a `openspec status` pokazuje etap specyfikacji jako jawnie pominięty, a nie oczekujący. Jeśli refaktoryzacja okaże się ostatecznie zmieniać zachowanie, usuń `skip_specs` z `.openspec.yaml` i napisz specyfikacje delty — validate traktuje znacznik plus pliki specyfikacji jako konflikt, więc stary znacznik nie może pozostać niezauważony.

Archiwizacja oznaczonej zmiany nie wymaga dodatkowych flag (nie ma delt do scalenia). Niezależnie od tego, flaga `--skip-specs` mówi poleceniu terminalowemu, aby jawnie pominąć krok specyfikacji:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

Ta sama flaga jest przydatna dla narzędzi, CI i zmian tylko w dokumentacji. Zasada: specyfikacje opisują zachowanie, więc jeśli zachowanie się nie zmieniło, specyfikacja też nie powinna. Zobacz [Pojęcia](concepts.md#what-a-spec-is-and-is-not).

## Przepis 6: Kontrola krok po kroku (rozszerzone polecenia)

**Kiedy go użyć:** złożona lub ryzykowna zmiana, w której chcesz przejrzeć każdy artefakt przed przejściem dalej.

Podstawowe `/opsx:propose` szkicuje wszystko naraz. Kiedy wolisz iść krok po kroku, włącz rozszerzone polecenia:

```bash
$ openspec config profile      # wybierz rozszerzone przepływy pracy
$ openspec update              # zastosuj je do tego projektu
```

Teraz możesz tworzyć szkielet i budować przyrostowo:

```text
Ty: /opsx:new add-2fa

AI:  Utworzono openspec/changes/add-2fa/. Gotowe do utworzenia: propozycja.

Ty: /opsx:continue

AI:  Utworzono proposal.md. Teraz dostępne: specs, design.

Ty: /opsx:continue

AI:  Utworzono specs/auth/spec.md. Teraz dostępne: design.
```

Przeglądaj każdy artefakt po jego utworzeniu, edytuj swobodnie i kontynuuj, gdy jesteś zadowolony. Kiedy chcesz, aby reszta została szkicowana naraz, `/opsx:ff` przechodzi szybko przez pozostałe artefaktowania planowania. Przed archiwizacją `/opsx:verify` sprawdza, czy implementacja faktycznie odpowiada specyfikacjom. Zobacz [Przepływy pracy](workflows.md#opsxff-vs-opsxcontinue).

## Przepis 7: Nauka całej pętli w praktyce

**Kiedy go użyć:** zainstalowałeś OpenSpec i chcesz *poczuć* przepływ pracy na własnym kodzie, a nie na przykładowym projekcie.

Włącz rozszerzone polecenia (zobacz Przepis 6), a następnie:

```text
Ty: /opsx:onboard

AI:  Witaj w OpenSpec! Przeprowadzę cię przez kompletną zmianę
     używając twojej rzeczywistej bazy kodu. Pozwól, że przeszukam
     w poszukiwaniu małej, bezpiecznej poprawki, którą możemy
     wprowadzić razem...
```

`/opsx:onboard` znajduje prawdziwą (małą) poprawkę, tworzy dla niej zmianę, implementuje ją i archiwizuje, opisując każdy krok. Zajmuje to od 15 do 30 minut i zostawia cię z prawdziwą zmianą, którą możesz zachować lub odrzucić. To najłagodniejsza forma nauki. Zobacz [Polecenia](commands.md#opsxonboard).

## Sprawdzanie swojej pracy z terminala

W dowolnym momencie, ze swojego terminala, możesz sprawdzić stan rzeczy:

```bash
$ openspec list                      # aktywne zmiany
$ openspec show add-dark-mode        # jedna zmiana szczegółowo
$ openspec validate add-dark-mode    # sprawdź strukturę
$ openspec view                      # interaktywny panel
```

To narzędzia do odczytu i inspekcji. Propozycje i budowanie nadal odbywają się przez polecenia ukośnikowe w czatne. Pełne szczegóły w [odwołaniu CLI](cli.md).

## Dokiej dalej

- [Eksploracja najpierw](explore.md): zalecany sposób rozpoczęcia, gdy nie masz pewności
- [Przepływy pracy](workflows.md): powyższe wzorce z wskazówkami decyzyjnymi, kiedy używać każdego
- [Polecenia](commands.md): każde polecenie ukośnikowe szczegółowo
- [Pierwsze kroki](getting-started.md): kanoniczne przewodnik po pierwszej zmianie
- [Pojęcia](concepts.md): dlaczego elementy pasują do siebie w ten sposób