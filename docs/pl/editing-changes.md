# Edytowanie i iterowanie zmian

**Każdy artefakt w ramach zmiany jest po prostu plikiem Markdown, który możesz edytować w dowolnym momencie.** Nie ma zablokowanej „fazy planowania”, żadnej bramki zatwierdzania, żadnego specjalnego trybu edycji, do którego musiałbyś przejść. Chcesz zmienić propozycję po rozpoczęciu pracy? Otwórz `proposal.md` i zmień jego zawartość. Zdałeś sobie sprawę, że projekt jest błędny w trakcie implementacji? Popraw `design.md` i kontynuuj pracę. To cała odpowiedź, i jest to celowe.

Ta strona jest dla momentu, w którym myślisz: „Czekaj, czy mogę wrócić i to zmienić?”. Tak. Oto jak to zrobić w najczęstszych przypadkach.

## Dwa sposoby na edycję dowolnej zawartości

Zawsze masz do wyboru oba z nich:

1. **Edytuj plik bezpośrednio.** Artefakty to zwykłe pliki Markdown w katalogu `openspec/changes/<name>/`. Otwórz `proposal.md`, `design.md`, `tasks.md` lub specyfikację delta w podkatalogu `specs/` w swoim edytorze i zmień jej zawartość. Nic więcej nie jest wymagane.
2. **Poproś swojego AI o poprawkę.** W czacie po prostu powiedz, co chcesz osiągnąć: na przykład „Zaktualizuj propozycję, usuń pomysł z buforowaniem i dodaj sekcję z limitem żądań” lub „Projekt powinien używać kolejki, a nie mechanizmu odpytywania (polling).” AI edytuje artefakt za ciebie, wykorzystując resztę zmiany jako kontekst.

Używaj tego, co pasuje do danej sytuacji. Mała poprawka sformułowań? Edytuj plik. Znaczna zmiana koncepcji? Pozwól AI na poprawkę z wykorzystaniem pełnego kontekstu.

## „Jak zaktualizować propozycję (lub specyfikacje) po rozpoczęciu pracy?”

Po prostu ją zaktualizuj. To ta sama zmiana, tylko dopracowana.

Jeśli używasz rozszerzonych poleceń, naturalny przepływ pracy wygląda tak: edytuj artefakt, a następnie uruchom `/opsx:continue`, aby kontynuować pracę od nowego stanu, lub `/opsx:apply`, aby kontynuować implementację zgodnie z zaktualizowanym planem. Jeśli używasz domyślnych poleceń z grupy `core`, edytuj artefakt i uruchom `/opsx:apply`; narzędzie odczytuje aktualne pliki, więc pracuje na podstawie tego, co obecnie znajduje się w artefaktach.

Model mentalny: artefakty to żywy plan, a nie podpisana umowa. AI zawsze pracuje na podstawie ich aktualnej zawartości, więc ich edycja kieruje całą pracą.

```text
Ty: Chcę zmienić podejście w tej zmianie.

Ty: [edytuj plik design.md lub powiedz AI:]
     Zaktualizuj plik design.md, aby używał zadania w tle zamiast synchronicznego wywołania.

AI:  Zaktualizowano plik design.md. Lista zadań nadal pasuje; chcesz, abym kontynuował wdrażanie?

Ty: /opsx:apply
```

To odpowiada na bardzo częste pytanie: nie ma oddzielnego polecenia do aktualizacji propozycji, ponieważ nie jest ono potrzebne. Plik jest źródłem prawdy, a jego edycja (ręczna lub za pośrednictwem AI) stanowi aktualizację.

## „Jak wrócić do przeglądu po zakończeniu implementacji?”

Nie musisz „wracać”, bo nigdy nie odszedłeś. Przepływ pracy jest płynny: przegląd, edycja i implementacja nie są kolejnymi fazami, w których jesteś uwięziony.

Konkretnie, po pewnej pracy za pomocą `/opsx:apply`:
- Chcesz ponownie sprawdzić plan? Otwórz artefakty i przeczytaj je, lub uruchom polecenie `openspec show <change>` w terminalu, aby uzyskać skonsolidowany widok.
- Znalazłeś coś, co chcesz zmienić? Edytuj artefakt (lub poproś o to AI), a następnie kontynuuj pracę.
- Chcesz przeprowadzić strukturalne sprawdzenie, czy kod pasuje do planu? Uruchom `/opsx:verify` (polecenie rozszerzone). Raportuje ono kompletność, poprawność i spójność bez blokowania żadnych procesów. Zobacz [Przepływy pracy: Weryfikacja](workflows.md#verify-check-your-work).

Nie ma żadnej „fazy przeglądu”, do której można by wrócić, ponieważ przegląd to coś, co możesz zrobić w dowolnym momencie, w tym po zakończeniu implementacji.

## „Edytowałem kod ręcznie. Jak go zsynchronizować z OpenSpec?”

Dzieje się to cały czas i nie ma nic w tym złego. Lekko zmodyfikowałeś coś w edytorze, a teraz kod i artefakty się nie zgadzają. Zsynchronizuj je ponownie w kierunku, który jest prawdziwy:
- **Kod jest teraz poprawny, a specyfikacja jest nieaktualna.** Zaktualizuj specyfikację delta (oraz zadania, jeśli jest to istotne), aby opisywała zachowanie, które faktycznie wdrożyłeś. Specyfikacja powinna pasować do rzeczywistości przed archiwizacją, ponieważ archiwizacja scala specyfikację z twoim źródłem prawdy.
- **Specyfikacja jest poprawna, a kod odbiega od niej.** Kontynuuj tworzenie lub naprawianie, aż kod będzie pasował do specyfikacji.

Szybki sposób na wykrycie niezgodności to użycie `/opsx:verify`: narzędzie odczytuje twoje artefakty i kod, a następnie informuje, gdzie występują rozbieżności. Traktuj jego wynik jako listę zadań do zsynchronizowania, a następnie zarchiwizuj, gdy się zgodzą.

Zasada: w momencie archiwizacji twoje specyfikacje stają się oficjalną prawdą. Dlatego przed archiwizacją upewnij się, że specyfikacje wiernie odzwierciedlają to, co robi kod. Ręczne edycje są mile widziane; po prostu nie pozwól, aby cicho zdesynchronizowały one specyfikację.

## Poprawianie propozycji, która cię nie zadowala

Jeśli wygenerowana propozycja nie trafiła w cel, masz trzy dobre opcje:
- **Iteruj w miejscu.** Powiedz AI, co jest nie tak („zakres jest zbyt szeroki, usuń funkcje administracyjne”) i pozwól jej na poprawkę. Najtańsza i zwykle najlepsza opcja.
- **Najpierw zbadaj, a następnie przygotuj nową propozycję.** Jeśli problem polega na tym, że sam pomysł jest niejasny, cofnij się do `/opsx:explore`, przemyśl go i pozwól, aby z tego wyłoniła się bardziej precyzyjna propozycja. Zobacz [Najpierw zbadaj](explore.md).
- **Zacznij od nowa.** Jeśli intencja uległa fundamentalnej zmianie, nowa zmiana może być jaśniejsza niż poprawianie starej.

Ostatnia opcja ma własny przewodnik po decyzjach, poniżej.

## Kiedy aktualizować, a kiedy zacząć nową zmianę

W skrócie: **aktualizuj, gdy to ta sama praca, tylko dopracowana; zacznij nową, gdy intencja uległa fundamentalnej zmianie lub zakres eksplodował na zupełnie inne zadania.**

- Ten sam cel, lepsze podejście? Aktualizuj.
- Zwężenie zakresu (wdrożenie MVP teraz, reszta później)? Aktualizuj, następnie zarchiwizuj, a potem rozpocznij nową zmianę dla drugiego etapu.
- Sam problem się zmienił („dodaj tryb ciemny” stało się „zbuduj pełny system motywów”)? Zacznij nową zmianę.

Pełny diagram przepływów i przykłady z rozwiązaniami znajdziesz w sekcji [Przepływy pracy: Kiedy aktualizować, a kiedy zacząć od nowa](workflows.md#when-to-update-vs-start-fresh), a bardziej szczegółowe omówienie w [OPSX: Kiedy aktualizować, a kiedy zacząć od nowa](opsx.md#when-to-update-vs-start-fresh).

## Uwaga dotycząca zadań

`tasks.md` to żywa lista kontrolna, a nie zamrożony plan. W trakcie implementacji możesz dodawać zadania, które odkryjesz, usuwać te, które okazały się niepotrzebne, lub zmieniać ich kolejność. AI odhacza pozycje podczas ich wykonywania w trakcie `/opsx:apply`, a jeśli wrócisz później, wznawia pracę od pierwszego nieodhaczonego zadania. Edycja listy w trakcie pracy jest oczekiwana.

## Co dalej?

- [Przepływy pracy](workflows.md) – wzorce oraz przewodnik po decyzjach dotyczących aktualizacji vs nowej zmiany
- [Przeglądanie zmiany](reviewing-changes.md) – dwuminutowy przegląd planu przed rozpoczęciem pracy
- [Najpierw zbadaj](explore.md) – miejsce, do którego możesz się cofnąć, gdy pomysł wymaga ponownego przemyślenia
- [Polecenia](commands.md) – szczegółowy opis `/opsx:continue`, `/opsx:apply` i `/opsx:verify`
- [Pojęcia: Artefakty](concepts.md#artifacts) – do czego służy każdy artefakt