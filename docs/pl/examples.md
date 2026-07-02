# Przykłady i Przepisy

Prawdziwe zmiany, od początku do końca. Każdy przepis pokazuje komendy, które należy wpisać, oraz to, co zostanie wyświetlone, dzięki czemu możesz dopasować swoją sytuację do wzorca i go skopiować. Używają one domyślnych komend **core** (`propose`, `explore`, `apply`, `sync`, `archive`); jeśli rozszerzony zestaw jest pomocny, zostaje to zaznaczone.

Przypomnienie przed rozpoczęciem: komendy z ukośnikiem (slash commands) takie jak `/opsx:propose` wpisuje się do **czatu asystenta AI**, a komendy `openspec` wpisuje się do **terminala**. Jeśli jest to dla Ciebie nowe, najpierw przeczytaj [Jak działają komendy](how-commands-work.md). W poniższych transkrypcjach `You:` i `AI:` stanowią czat, a linie zaczynające się od `$` to terminal.

> **Nie jesteś pewien, co budujesz?** Większość tych przepisów jest bardziej przydatna, jeśli zaczniesz od `/opsx:explore`, aby najpierw to przeanalizować. [Przepis 3](#recipe-3-exploring-before-you-commit) pokazuje to w praktyce, a przewodnik [Explore First](explore.md) przedstawia pełne uzasadnienie.

## Przepis 1: Mała funkcja, szybka ścieżka

**Kiedy tego używać:** Wiesz, czego chcesz i jest to zamknięty element pracy. Jest to najczęstszy przepis.

Całość składa się z trzech komend: Propose (proponowanie), build (budowanie) i archive (archiwizacja).

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — dlaczego i co
     ✓ specs/      — nowe wymagania i ich scenariusze
     ✓ design.md   — podejście techniczne
     ✓ tasks.md    — lista kontrolna implementacji
     Gotowe do implementacji. Uruchom /opsx:apply.
```

Teraz przeczytaj plan. Otwórz propozycję i specyfikację delty. To jest moment, dla którego został stworzony OpenSpec: wychwycenie błędnego założenia, zanim stanie się to 400-liniowym kodem, a nie jednym akapidem. Edytuj dowolny artefakt bezpośrednio, jeśli coś jest nie tak, a następnie kontynuuj.

```text
You: /opsx:apply

AI:  Pracuję nad zadaniami...
     ✓ 1.1 Dodanie przycisku wylogowania do nagłówka
     ✓ 1.2 Wyczyść sesję po kliknięciu
     ✓ 1.3 Dodanie okna dialogowego z potwierdzeniem
     Wszystkie zadania ukończone!

You: /opsx:archive

AI:  Archiwizowanie add-logout-button...
     ✓ Połączono specyfikacje do openspec/specs/auth/spec.md
     ✓ Przeniesiono do openspec/changes/archive/2026-06-22-add-logout-button/
     Gotowe. Gotowy na kolejną zmianę.
```

Tyle. Zachowanie wylogowania jest teraz częścią Twoich specyfikacji, a zmiana została zapisana wraz z pełnym kontekstem.

## Przepis 2: Naprawa błędu

**Kiedy tego używać:** Coś jest zepsute i chcesz, aby naprawa została odnotowana jako celowa zmiana zachowania, a nie tajemniczy commit.

Naprawy błędów działają dokładnie tak samo jak funkcje. Różnica polega na tym, w jaki sposób formułujesz propozycję: opisz *poprawne* zachowanie, a nie tylko „napraw błąd”.

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     Propozycja przechwytuje obecne błędne zachowanie i
     zamierzone zachowanie. Specyfikacja delty MODYFIKUJE wymaganie
     przekierowania, tak aby było ono teraz precyzyjne i testowalne.
     Gotowe do implementacji.
```

Ponieważ naprawa ląduje jako `MODIFIED` (zmodyfikowane) wymaganie z nowym scenariuszem, następna osoba (lub sesja AI) widzi nie tylko, że to naprawiłeś, ale co oznacza „poprawnie”. Następnie `/opsx:apply` i `/opsx:archive` jak zwykle.

Wskazówka: dla poprawki dobrym scenariuszem jest test regresyjny w formie prozy. „ZAŁOŻONO użytkownika bez zalogowania, GDY wprowadza ważne dane uwierzytelniające, Wtedy ląduje na pulpicie i nie jest ponownie przekieramiany.” Napisz to, a implementacja będzie miała jasny cel.

## Przepis 3: Eksplorowanie przed zatwierdzeniem

**Kiedy tego używać:** Masz problem, ale jeszcze nie masz planu. Nie jesteś pewien, co budować lub który jest właściwy kierunek.

Zacznij od `/opsx:explore`. Jest to partner do myślenia bez struktury i bez tworzenia artefaktów. Czyta on Twoją bazę kodu i pomaga Ci podjąć decyzję.

```text
You: /opsx:explore

AI:  Co chciałbyś zbadać?

You: Ładowanie stron wydaje się powolne, ale nie wiem, gdzie tracony jest czas.

AI:  Pozwól mi sprawdzić... Znalazłem trzy prawdopodobne przyczyny:
     1. Duże nieoptymalizowane obrazy na liście produktów
     2. Synchroniczne pobieranie danych blokujące renderowanie
     3. Ponowne renderowanie wywołane zmianami kontekstu
     Któremu powinniśmy się zająć najpierw?

You: Ten związany z pobieraniem danych.

You: /opsx:propose optimize-product-list-fetching

AI:  Utworzyłem zmianę, opartą na tym, co właśnie znaleźliśmy. Gotowe do implementacji.
```

Eksploracja wyjaśnia Twoje myśli *przed* wydaniem zmiany na to. Gdy wglądanie się w problematykę ustabilizuje się, zaproponuj, a AI przejmie kontekst.

## Przepis 4: Zarządzanie dwiema zmianami naraz

**Kiedy tego używać:** Jesteś w trakcie pracy nad funkcją, a pilna poprawka przeskakuje kolejność.

Zmiany są niezależnymi folderami, więc praca równoległa nie powoduje konfliktów. Rozpocznij naprawę, wypuść ją, a następnie wróć do funkcji dokładnie tam, gdzie skończyłeś.

```text
You: Jestem w połowie pracy nad add-dark-mode, ale muszę teraz naprawić błąd logowania.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Gotowe do implementacji.

You: /opsx:apply

AI:  Zaimplementowano poprawkę. Wszystkie zadania ukończone.

You: /opsx:archive

AI:  ✓ Zarchiwizowano fix-login-redirect.

You: Powrót do dark mode.

You: /opsx:apply add-dark-mode

AI:  Wznawiam pracę nad add-dark-mode. Kontynuuję od zadania 2.3: Aktualizacja Nagłówka...
```

Nazwanie zmiany w `/opsx:apply add-dark-mode` jest sposobem na wskazanie AI konkretnej zmiany, gdy działa ich więcej niż jedna. Ponieważ zadania śledzą ukończenie w `tasks.md`, AI wie dokładnie, na jakim etapie się zatrzymałeś.

Gdy wiele zmian jest robionych jednocześnie, rozszerzony `/opsx:bulk-archive` grupuje je i rozwiązuje konflikty specyfikacji, sprawdzając, co zostało faktycznie zaimplementowane. Zobacz [Workflows](workflows.md#parallel-changes).

## Przepis 5: Refaktoryzacja bez zmiany zachowania

**Kiedy tego używać:** Restrukturyzujesz kod, a zewnętrznie widoczne zachowanie ma pozostać identyczne.

To jest ciekawy przypadek, ponieważ czysta refaktoryzacja *nic nie dodaje do Twoich specyfikacji*. Kontrakt zachowania się nie zmienia; zmienia się tylko implementacja. Dlatego praca znajduje się w projekcie i zadaniach, a delta specyfikacji jest pusta lub nieobecna.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. Propozycja określa cel (podział modułu płatności, bez zmiany zachowania), a projekt przechwytuje nową strukturę. Brak zmian specyfikacji, ponieważ zachowanie jest identyczne. Gotowe do implementacji.
```

Gdy archiwizujesz zmianę, która nie dotyka specyfikacji, możesz polecić komendzie terminalowej pominięcie kroku specyfikacji:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

Ten sam flag jest przydatny dla narzędzi, CI i zmian dotyczących tylko dokumentacji. Zasada jest taka: specyfikacje opisują zachowanie, więc jeśli zachowanie się nie zmieniło, specyfikacja też nie powinna. Zobacz [Concepts](concepts.md#what-a-spec-is-and-is-not).

## Przepis 6: Kontrola krok po kroku (rozszerzone komendy)

**Kiedy tego używać:** Gdy jest to zmiana skomplikowana lub ryzykowna, a chcesz przejrzeć każdy artefakt, zanim przejdziesz dalej.

Podstawowe `/opsx:propose` szkicuje wszystko naraz. Kiedy wolisz działać krok po kroku, aktywuj rozszerzone komendy:

```bash
$ openspec config profile      # wybierz rozszerzone przepływy pracy
$ openspec update              # zastosuj je do tego projektu
```

Teraz możesz stopniowo tworzyć szkice i budować:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Gotowe do utworzenia: proposal.

You: /opsx:continue

AI:  Created proposal.md. Teraz dostępne są: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Teraz dostępne jest: design.
```

Przejrzyj każdy artefakt w miarę jego pojawiania się, edytuj swobodnie i kontynuuj, gdy będziesz zadowolony. Kiedy chcesz, aby reszta została przygotowana naraz, `/opsx:ff` przyspiesza przez pozostałe artefakty planowania. Przed archiwizacją, `/opsx:verify` sprawdza, czy implementacja faktycznie odpowiada specyfikacjom. Zobacz [Workflows](workflows.md#opsxff-vs-opsxcontinue).

## Przepis 7: Naucz się całego cyklu w praktyce

**Kiedy tego używać:** Zainstalowałeś OpenSpec i chcesz *poczuć* ten przepływ pracy na swoim własnym kodzie, a nie na przykładzie zabawkowym.

Aktywuj rozszerzone komendy (patrz Przepis 6), a następnie:

```text
You: /opsx:onboard

AI:  Witamy w OpenSpec! Poprowadzę Cię przez pełną zmianę, używając Twojej rzeczywistej bazy kodu. Pozwól mi przeskanować drobne, bezpieczne ulepszenie, które możemy zrobić razem...
```

`/opsx:onboard` znajduje prawdziwe (małe) ulepszenie, tworzy dla niego zmianę, implementuje ją i archiwizuje, narrując każdy krok. Zajmuje to 15 do 30 minut i zostawia Ci realną zmianę, którą możesz zachować lub odrzucić. Jest to najłagodniejsza metoda nauki. Zobacz [Commands](commands.md#opsxonboard).

## Sprawdzanie swojej pracy z terminala

W dowolnym momencie możesz sprawdzić stan rzeczy za pomocą terminala:

```bash
$ openspec list                      # aktywne zmiany
$ openspec show add-dark-mode        # jedna zmiana w szczegółach
$ openspec validate add-dark-mode    # sprawdzenie struktury
$ openspec view                      # interaktywny pulpit nawigacyjny
```

Są to narzędzia do czytania i inspekcji. Proponowanie i budowanie odbywają się nadal za pomocą komend z ukośnikiem w czacie. Pełne szczegóły znajdziesz w [CLI reference](cli.md).

## Dokąd iść dalej

- [Explore First](explore.md): zalecony sposób rozpoczęcia, gdy nie jesteś pewien
- [Workflows](workflows.md): wzorce opisane powyżej z wytycznymi decyzyjnymi dotyczącymi użycia każdego z nich
- [Commands](commands.md): każda komenda z ukośnikiem w szczegółach
- [Getting Started](getting-started.md): kanoniczny przewodnik po pierwszej zmianie
- [Concepts](concepts.md): dlaczego elementy pasują do siebie w ten sposób