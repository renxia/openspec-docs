# Edytowanie i iteracja nad zmianą

**Każdy artefakt w ramach zmiany jest po prostu plikiem Markdown, który możesz edytować w dowolnym momencie.** Nie ma zablokowanej „fazy planowania”, żadnej bramy akceptacji ani specjalnego trybu edycji. Chcesz zmienić propozycję po rozpoczęciu budowy? Otwórz `proposal.md` i zmień ją. Zauważyłeś, że projekt jest błędny w trakcie implementacji? Napraw `design.md` i kontynuuj pracę. To cała odpowiedź, a to celowe założenie.

Ta strona jest dla momentu, gdy myślisz: „poczekaj, czy mogę wrócić i coś zmienić?”. Tak możesz. Oto jak w każdym typowym przypadku.

## Dwa sposoby na edytowanie czegokolwiek

Masz zawsze obie opcje:

1. **Edytuj plik bezpośrednio.** Artefakty są zwykłym Markdownem w `openspec/changes/<name>/`. Otwórz `proposal.md`, `design.md`, `tasks.md` lub delta specyfikację z folderu `specs/` w swoim edytorze i zmień ją. Nic innego nie jest wymagane.

2. **Poproś swoją AI o rewizję.** W czacie po prostu powiedz, czego chcesz: „Zaktualizuj propozycję, aby usunąć pomysł buforowania i dodać sekcję dotyczącą limitu żądań” lub „projekt powinien używać kolejki, a nie pollinga”. AI edytuje artefakt za Ciebie, wykorzystując resztę zmiany jako kontekst.

Użyj tego, co pasuje do danej chwili. Mała korekta językowa? Edytuj plik. Fundamentalna przemyślenie? Pozwól AI dokonać rewizję z pełnym kontekstem.

## „Jak mogę zaktualizować propozycję (lub specyfikacje) po rozpoczęciu pracy?”

Po prostu ją zaktualizuj. Ta sama zmiana, ale ulepszona.

Jeśli używasz rozszerzonych poleceń, naturalny przebieg jest taki: edytujesz artefakt, a następnie uruchamiasz `/opsx:continue`, aby kontynuować od nowego stanu, lub `/opsx:apply`, aby nadal implementować w oparciu o zaktualizowany plan. Jeśli używasz domyślnych poleceń `core`, edytuj artefakt i uruchom `/opsx:apply`; czyta on aktualne pliki, więc buduje na podstawie tego, co mówią artefakty.

Model myślowy jest taki: artefakty stanowią żywy plan, a nie podpisana umowa. AI zawsze pracuje na podstawie ich bieżącej zawartości, dlatego edytowanie tych plików kieruje pracą.

```text
Ty: Chcę zmienić podejście w tej zmianie.

Ty: [edytuj design.md lub powiedz AI:]
     Zaktualizuj design.md, aby używał zadania w tle zamiast synchronicznego wywołania.

AI:  design.md zaktualizowany. Lista zadańczeń nadal pasuje; czy mam kontynuować aplikowanie?

Ty: /opsx:apply
```

To odpowiada na bardzo częste pytanie: nie ma osobnego polecenia „aktualizacja propozycji”, ponieważ ono nie jest potrzebne. Plik jest jedyną prawdą, a edytowanie go (ręcznie lub za pomocą AI) stanowi aktualizację.

## „Jak mogę wrócić do przeglądu po implementacji?”

Nie musisz „wracać”, ponieważ nigdy nie odszedłeś. Przepływ pracy jest płynny: przeglądanie, edycja i implementacja to nie są sekwencyjne fazy, w które jesteś uwięziony.

Konkretnie, po wykonaniu jakiejkolwiek pracy z `/opsx:apply`:

- Chcesz ponownie przeanalizować plan? Otwórz artefakty i przeczytaj je lub uruchom `openspec show <change>` w terminalu, aby uzyskać ujednolicony widok.
- Znaleźli coś do zmiany? Edytuj artefakt (lub poproś AI), a następnie kontynuuj pracę.
- Chcesz ustrukturyzowaną kontrolę, czy kod odpowiada planowi? Uruchom `/opsx:verify` (rozszerzone polecenie). Raportuje on kompletność, poprawność i spójność bez blokowania niczego. Zobacz [Przepływy pracy: Weryfikacja](workflows.md#verify-check-your-work).

Nie ma „fazy przeglądu”, do której musiałbyś wrócić, ponieważ przeglądanie jest czymś, co możesz zrobić w dowolnym momencie, łącznie z po implementacji.

## „Edytowałem kod ręcznie. Jak to pogodzić z OpenSpec?”

To dzieje się nieustannie i jest to w porządku. Coś poprawiłeś w edytorze, a teraz kod i artefakty są niezgodne. Przywróć je do synchronizacji w kierunku, który jest prawdziwy:

- **Kod jest poprawny, specyfikacja jest przestarzała.** Zaktualizuj delta specyfikację (i zadania, jeśli to istotne), aby opisać zachowanie, które faktycznie zostało dostarczone. Specyfikacja powinna odpowiadać rzeczywistości przed archiwizacją, ponieważ archiwizacja łączy specyfikację z jedyną prawdą.
- **Specyfikacja jest poprawna, kod się rozjechał.** Kontynuuj budowę lub naprawianie, aż kod będzie zgodny ze specyfikacją.

Szybkim sposobem na wykrycie niezgodności jest `/opsx:verify`: czyta on Twoje artefakty i Twój kod i mówi Ci, w których miejscach są one rozbieżne. Potraktuj jego wynik jako listę zadań, które należy ukończyć dla rekonsyliacji, a następnie zarchiwizuj, gdy się zgodzą.

Zasada jest taka: w momencie archiwizacji Twoje specyfikacje stają się prawdą rejestrowaną. Zatem przed archiwizacją upewnij się, że specyfikacje są uczciwe wobec tego, co robi kod. Edycje ręczne są mile widziane; po prostu nie pozwól, aby cicho rozjechały specyfikację.

## Ulepszanie propozycji, która Cię nie satysfakcjonuje

Jeśli wygenerowana propozycja nie spełnia oczekiwań, masz trzy dobre opcje:

- **Iteruj na miejscu.** Powiedz AI, co jest nie tak („zakres jest zbyt szeroki, usuń funkcje administracyjne”) i pozwól jej to zrewidować. To najtańsza i zazwyczaj właściwa opcja.
- **Najpierw eksploruj, a potem ponownie proponuj.** Jeśli problem polega na tym, że sama idea jest niejasna, cofnij się do `/opsx:explore`, przemyśl to i pozwól, aby z tego powstała ostrzejsza propozycja. Zobacz [Eksploracja najpierw](explore.md).
- **Zacznij od nowa.** Jeśli intencja uległa fundamentalnej zmianie, nowa zmiana może być jaśniejsza niż łatanie starej.

Ten ostatni ruch ma własny przewodnik decyzyjny, później.

## Kiedy aktualizować, a kiedy rozpoczynać nową zmianę

Krótka wersja: **aktualizuj, gdy jest to ta sama praca ulepszona; zacznij nową, gdy intencja fundamentalnie się zmieniła lub zakres rozrosł się na inne prace.**

- Ten sam cel, lepsze podejście? Aktualizuj.
- Zawężenie zakresu (dostarcz MVP teraz, reszta później)? Aktualizuj, a następnie zarchiwizuj, a potem nowa zmiana dla fazy drugiej.
- Sam problem się zmienił („dodaj tryb ciemny” stało się „zbuduj pełny system tematyczny”)? Nowa zmiana.

Pełny schemat blokowy i przykładowe przypadki znajdziesz w [Przepływach pracy: Kiedy aktualizować, a kiedy zaczynać od nowa](workflows.md#when-to-update-vs-start-fresh), a głębsze omówienie w [OPSX: Kiedy aktualizować, a kiedy zaczynać od nowa](opsx.md#when-to-update-vs-start-fresh).

## Uwaga na temat zadań
`tasks.md` to żywa lista kontrolna, a nie zamrożony plan. W miarę implementacji możesz dodawać odkryte zadania, usuwać te, które okazały się zbędne, lub zmieniać ich kolejność. AI odznacza pozycje w trakcie `/opsx:apply`, a jeśli wrócisz później, kontynuuje od pierwszego nieodhaczonego zadania. Edytowanie listy w trakcie pracy jest oczekiwane.

## Gdzie dalej
- [Przepływy pracy](workflows.md) - wzorce działania oraz przewodnik decyzyjny: aktualizacja vs nowa zmiana
- [Eksploracja najpierw](explore.md) - miejsce, do którego możesz wrócić, gdy idea wymaga przemyślenia
- [Polecenia](commands.md) - `/opsx:continue`, `/opsx:apply` i `/opsx:verify` w szczegółach
- [Koncepcje: Artefakty](concepts.md#artifacts) - do czego służy każdy artefakt