# Przeglądanie zmiany

Cała obietnica OpenSpec polega na tym, że Ty i Twój AI **zgodzicie się na to, co zbudować, zanim zostanie napisany jakikolwiek kod.** Ta umowa ma znaczenie tylko wtedy, jeśli faktycznie przeczytasz to, co AI przygotowało. Ta strona dotyczy tych dwóch minut, w których to robisz — co otworzyć, w jakiej kolejności i na co zwrócić uwagę.

Zakład jest prosty: złapanie błędnego kierunku w jednoparagrafowym planie jest prawie bezpłatne. Złapanie tego samego błędnego kierunku w 300 liniach kodu już nie. Przeglądanie to moment, w którym realizujesz ten zakład.

## Dwa momenty, w których przeprowadzasz przegląd

Są dokładnie dwa:

```
/opsx:propose ──► REVIEW THE PLAN ──► /opsx:apply ──► REVIEW THE CODE ──► /opsx:archive
                  (before any code)                    (/opsx:verify)
```

1. **Po `/opsx:propose`** (lub `/opsx:ff`), przed `/opsx:apply` — przeczytaj plan, gdy jest jeszcze tylko słowami.
2. **Po zbudowaniu**, za pomocą `/opsx:verify` — sprawdź, czy kod faktycznie zrobił to, co przewidywał plan.

Pierwszy przegląd jest tym, który oszczędza Ci najwięcej, a jednocześnie jest pomijany przez większość osób. Ta strona poświęca mu najwięcej czasu.

## Czytaj w tej kolejności

Zmiana to folder z zwykłym Markdownem w `openspec/changes/<name>/`. Czytaj pliki w kolejności, która pozwoli Ci najwcześniej przerwać, jeśli coś jest nie tak:

```
openspec/changes/add-dark-mode/
├── proposal.md      1. the intent and scope   ← if this is wrong, stop here
├── specs/…/spec.md  2. the requirements       ← the heart of the review
├── design.md        (only for bigger changes) — the technical approach
└── tasks.md         3. the plan of work
```

Nie musisz czytać każdej linii. Musisz odpowiedzieć na trzy pytania, po jednym na każdy plik.

## Propozycja: czy to jest właściwy problem?

Najpierw otwórz `proposal.md`. Zawiera on "dlaczego" i "co" — intencję, zakres, podejście w jednym lub dwóch akapitach.

**Jak wygląda dobra propozycja:** jedna jasna intencja, zakres, który rozpoznajesz, oraz powód, dla którego warto to zrobić teraz.

**Czerwone flagi:**
- Rozwiązuje nieco *inny* problem, niż ten, o który prosiłeś.
- Zakres się powiększył — prosiłeś o przełącznik motywu, a propozycja dotyczy również autoryzacji "skoro już jesteśmy w temacie".
- Jest niejasna. "Ulepsz stronę ustawień" nie jest zakresem; "dodaj przełącznik trybu ciemnego, który uwzględnia preferencje systemu operacyjnego" już jest.

**Pytanie, na które musisz odpowiedzieć:** *Czy to odpowiada temu, o co faktycznie prosiłem, i czy coś się tu nie wkrada nieproszone?* Jeśli odpowiedź brzmi nie, przerwij — nie czytaj dalej, popraw propozycję (zobacz [Odpowiadanie jest tanie](#odpowiadanie-jest-tanie)).

## Delta specyfikacji: czy "gotowe" jest zdefiniowane poprawnie?

To jest sedno przeglądania. Delta specyfikacji w folderze `specs/` określają, co będzie *prawdziwe*, gdy zmiana zostanie wdrożona — jako wymagania i scenariusze, które je potwierdzają:

```markdown
## ADDED Requirements

### Requirement: Dark Mode Toggle
The system SHALL let a user switch between light and dark themes.

#### Scenario: Respects the OS preference on first load
- GIVEN a user who has never set a theme
- WHEN they open the app on a device set to dark mode
- THEN the app renders in dark mode
```

**Jak wygląda dobre wymaganie:** jedno jasne stwierdzenie `SHALL`/`MUST`, które możesz przekazać testerowi, oraz co najmniej jeden scenariusz, którego GIVEN/WHEN/THEN faktycznie sprawdza to stwierdzenie.

**Czerwone flagi:**
- **Niejasne wymaganie.** "System SHALL być szybki" nie może być zbudowane ani przetestowane. Co znaczy szybki?
- **Wymaganie bez scenariusza**, lub scenariusz, który nie sprawdza wymagania, pod którym się znajduje.
- **Najbardziej wartościowa rzecz do zauważenia: to, co brakuje.** AI wiernie zapisuje to, co *powiedziałeś*. Twoim zadaniem jest zauważyć to, co *zapomniałeś* powiedzieć. Jeśli najbardziej zależało Ci na przypadku z preferencjami systemu operacyjnego, a żaden scenariusz go nie wymienia, to przeglądanie się już opłaca.

Czytaj delta specyfikacji, zadając sobie pytanie *czy byłbym zadowolony, gdyby system robił dokładnie — i tylko — to?* Tutaj jeszcze nie ma mowy o kodzie, więc zmiany są tanie.

## Zadania: czy plan pracy jest rozsądny?

Otwórz `tasks.md` na końcu. To lista kontrolna implementacji, przez którą przejdzie AI.

**Jak wygląda dobry plan:** uporządkowane kroki, każdy powiązany z wymaganiem, nic tajemniczego.

**Czerwone flagi:**
- Zadanie bez odpowiadającego mu wymagania (skąd się wzięło?).
- Jedno ogromne zadanie "zaimplementuj funkcję", które ukrywa wszystkie rzeczywiste decyzje.
- Zadanie, które dotyczy czegoś poza zakresem, który właśnie zaakceptowałeś.

Nie szacujesz tu kosztów ani nie zarządzasz mikro — sprawdzasz, czy plan odpowiada wymaganiom, które już zaakceptowałeś.

## Odpowiadanie jest tanie

Jeśli odpowiedź na któreś z trzech pytań jest zła, powiedz o tym. Nie ma żadnych faz i nic nie jest zablokowane — poprawiasz to i przechodzisz dalej. Dwa sposoby, dokładnie jak w [Edytowaniu zmiany](editing-changes.md):
- **Edytuj plik sam.** To zwykły Markdown; zmień linijkę z zakresem, doprecyzuj wymaganie, usuń zadanie.
- **Powiedz AI, co jest nie tak** i pozwól jej na poprawki: *"usuń zmiany dotyczące autoryzacji — poza zakresem,"* *"dodaj scenariusz dla przypadku, gdy użytkownik już wybrał motyw,"* *"podziel zadanie 3 na schemat i interfejs użytkownika.*

Następnie ponownie przeczytaj część, którą zmieniłeś. Poprawiaj projekt, aż będzie to plan, który możesz podpisać własnym imieniem. Ta wymiana zdań *jest* pracą nad produktem.

## Po kodzie: weryfikacja

Gdy praca jest zbudowana, `/opsx:verify` jest Twoim drugim przeglądem. Ponownie odczytuje artefakty i kod oraz raportuje niezgodności w trzech wymiarach:

| Wymiar | Co sprawdza |
|-----------|----------------|
| **Completeness** | Każde zadanie wykonane, każde wymaganie zaimplementowane, scenariusze uwzględnione |
| **Correctness** | Implementacja odpowiada intencji specyfikacji, obsłużone przypadki brzegowe |
| **Coherence** | Decyzje projektowe faktycznie pojawiają się w kodzie |

```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Respects the OS preference on first load" has no test coverage
```

Oznacza problemy jako KRYTYCZNE, OSTRZEŻENIE lub SUGESTIA, a **nie** blokuje archiwizacji — wskazuje luki i pozostawia decyzję Tobie. To jest różnica między "czy AI napisało kod" a "czy zbudowało to, co umówiliśmy".

`/opsx:verify` znajduje się w rozszerzonym profilu. Jeśli go nie masz, włącz go za pomocą `openspec config profile` (następnie `openspec update`), lub po prostu ponownie przeczytaj zmianę i różnicę samodzielnie.

## Dopasuj rozmiar przeglądu do zmiany

Nie każda zmiana wymaga pełnego przeglądu. Poprawka literówki w jednym pliku zasługuje na dwudziestosekundowe przeczytanie. Zmiana, która dotyczy autoryzacji, płatności lub danych, których nie możesz odzyskać, zasługuje na wszystkie powyższe pytania. Nigdy nie chodziło o ceremonię — chodzi o to, aby poświęcać uwagę tam, gdzie błąd będzie kosztowny, a przeglądać pobieżnie tam, gdzie nie będzie.

## Dwuaminutowa lista kontrolna

- [ ] Intencja propozycji odpowiada temu, o co prosiłem.
- [ ] Nic dodatkowego nie wkradło się do zakresu.
- [ ] Każde wymaganie jest wystarczająco konkretne, aby można je było przetestować.
- [ ] Każde wymaganie ma scenariusz, który je faktycznie sprawdza.
- [ ] Przypadek, który mnie najbardziej interesuje, jest uwzględniony.
- [ ] Zadania odpowiadają wymaganiom; nic nie jest tajemnicze ani poza zakresem.
- [ ] Będę zadowolony, jeśli AI zbuduje dokładnie to i nic więcej.

Jeśli wszystkie siedem punktów przejdzie, uruchom `/opsx:apply` z pełną pewnością. Jeśli któryś nie przejdzie, to nie jest porażka — to dwie minuty, które robią swoją robotę.

## Gdzie przejść dalej

- [Pisanie dobrych specyfikacji](writing-specs.md) — odwrotna strona medalu: jak tworzyć wymagania i scenariusze warte zatwierdzenia.
- [Edytowanie i iterowanie zmiany](editing-changes.md) — mechanika zmiany planu po rozpoczęciu pracy.
- [Przepływy pracy](workflows.md) — gdzie przeglądanie pasuje do większego cyklu.