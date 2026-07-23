# Pisanie dobrych specyfikacji

Rzadko pisze się specyfikację od zera. Opisuje się zmianę w języku naturalnym, `/opsx:propose` szkicuje wymagania i scenariusze, a następnie się je dopracowuje. Ta strona dotyczy właśnie tej ostatniej części — jak wygląda „dobra" specyfikacja i jak kierować AI w jej kierunku.

Jest to uzupełnienie do [Przeglądanie zmiany](reviewing-changes.md): przeglądanie polega na wychwyceniu słabych punktów w szkicu, a pisanie — na wiedzy, z czego składa się mocna specyfikacja.

## Specyfikacja to zachowanie, a nie kod

Specyfikacja mówi, co system *robi*, w sposób, który każdy może zweryfikować — a nie jak jest zbudowany. Składa się z **wymagań** (opisów zachowania) i **scenariuszy** (konkretnych przykładów je udowadniających).

```markdown
### Requirement: Session Timeout
The system SHALL expire a session after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass with no activity
- THEN the session is invalidated and the user must re-authenticate
```

Zostaw *jak* — kolejkę, bibliotekę, schemat tabeli — w `design.md` lub w kodzie. Gdy zachowanie i implementacja wymieszają się w jednym wymaganiu, wymaganie przestaje być testowe i zaczyna się dezaktualizować w momencie zmiany kodu.

## Co sprawia, że wymaganie jest dobre

Dobre wymaganie to jedno zachowanie, sformułowane tak jasno, że można je komuś oddać do przetestowania.

- **Jedno stwierdzenie, jedno `SHALL`/`MUST`.** Jeśli wymaganie ma trzy klauzule „a także", to tak naprawdę są to trzy wymagania. Rozdziel je.
- **Obserwowalne.** Ktoś spoza kodu powinien być w stanie stwierdzić, czy jest spełnione. „System SHALL wyświetlać baner błędu, gdy przesyłany plik przekracza 10 MB" jest obserwowalne. „System SHALL obsługuje duże pliki z gracją" — nie jest.
- **Odpowiednia siła.** OpenSpec używa słów kluczowych RFC 2119 i oznaczają one różne rzeczy:

  | Słowo kluczowe | Znaczenie |
  |---------|---------|
  | `MUST` / `SHALL` | Twarde wymaganie. Bezwzględne. |
  | `SHOULD` | Silna rekomendacja, z miejsce na uzasadniony wyjątek. |
  | `MAY` | Naprawdę opcjonalne. |

  Domyślnie sięgaj po `MUST`/`SHALL`. Używaj `SHOULD` tylko wtedy, gdy naprawdę masz na myśli „chyba że jest dobry powód, żeby tego nie robić".

Test na dobre wymaganie: *czy tester, który nigdy nie widział kodu, mógłby stwierdzić, czy zostało spełnione?* Jeśli nie, wymaga wyostrzenia.

## Co sprawia, że scenariusz jest dobry

Scenariusze to miejsce, w którym wymaganie dowodzi swojej wartości. Każdy z nich to konkretny GIVEN / WHEN / THEN, który może stać się testem automatycznym.

- **Ćwiczy swoje wymaganie.** Scenariusz, który tylko przeformułowuje wymaganie innymi słowami, nic nie testuwe. Spraw, by był konkretną sytuacją z konkretnym wynikiem.
- **Pokrywaj przypadki, które mają znaczenie, nie tylko ścieżkę szczęśliwą.** Poprawne logowanie jest łatwe. Puste dane wejściowe, wygasły token, drugie kliknięcie, coś, co idzie nie tak — tam żyją błędy, a scenariusz jest najbardziej wartościowy.
- **Nazwij przypadek w tytule.** „Scenario: Odrzuca wygasły token" mówi recenzentowi na pierwszy rzut oka, co jest pokryte; „Scenario: Test 2" — nie mówi.

Przyzwyczajenie wartościowe: przed zatwierdzeniem zapytaj *jaki jest ten jeden przypadek, którego awarii bym się obawiał?* — i upewnij się, że scenariusz go nazywa.

## Wybierz odpowiedni typ delty

Zmiana opisuje swoje edycje specyfikacji za pomocą trzech typów sekcji. Użycie odpowiedniego zapenia uczciwość archiwizowanym specyfikacjom:

- **`## ADDED Requirements`** — zupełnie nowe zachowanie, które wcześniej nie istniało.
- **`## MODIFIED Requirements`** — zachowanie, które już istniało i się zmienia. Dołącz pełną nową wersję; krótka notatka o tym, co się zmieniło, pomaga recenzentowi.
- **`## REMOVED Requirements`** — zachowanie odchodzące, z wierszem wyjaśniającym dlaczego.

Podczas archiwizacji ADDED jest dołączane do głównej specyfikacji, MODIFIED zastępuje starą wersję, a REMOVED jest usuwane. Jeśli oznaczysz prawdziwą zmianę jako ADDED, skończysz z dwoma konkurującymi wymaganiami; jeśli opiszesz nowe zachowanie jako MODIFIED, nie będzie czego zastępować. W razie wątpliwości otwórz aktualną specyfikację i sprawdź, czy wymaganie już tam jest.

## Odpowiedni rozmiar zmiany

Najczęstszym błędem autorskim nie jest źle sformułowane wymaganie — to zmiana, która próbuje być trzema zmianami.

**Dobra zmiana ma jeden cel, który można powiedzieć w jednym zdaniu.** „Dodaj przełącznik trybu ciemnego." „Ogranicz częstotliwość żądań do endpointu logowania." „Zmigruj sesje z cookies." Jeśli opisanie zmiany wymaga wielu „a także", to jest to sygnał do podzielenia.

Oznaki zbyt dużej zmiany:

- Zakres propozycji brzmi jak lista niepowiązanych ze sobą funkcji.
- Przeglądanie jej zajęłoby popołudnie, więc nikt tego nie zrobi.
- Dwie osoby nie mogłyby nad nią pracować bez kolizji.
- Połowa zadań mogłaby zostać wydana samodzielnie.

Mniejsze zmiany są łatwiejsze do przeglądania, łatwiejsze do zbudowania w jednej skupionej sesji i łatwiejsze do rozumowania sześć miesięcy później, gdy archiwum jest tym, co zostaje. Zawsze możesz prowadzić kilka zmian równolegle — zobacz [Edycja i iterowanie](editing-changes.md) oraz [Przepływy pracy](workflows.md).

Dzieje się też odwrotnie: jednowierszowa poprawka literatury nie wymaga trzech wymagań i dokumentu projektowego. Dopasuj formalności do stawki.

## Jak kierować AI w stronę dobrego szkicu

Ponieważ `/opsx:propose` wykonuje pierwszy szkic, jakość tego, co otrzymasz, śledzi jakość tego, co mu podasz. Nie musisz pisać wymagań ręcznie — musisz dobrze wycelować AI:

- **Określ cel i granicę.** *„Dodaj przełącznik trybu ciemnego, który podąża za ustawieniem systemu operacyjnego przy pierwszym załadowaniu — nie dotykaj istniejącego API motywu."* Część poza zakresem ma tyle samo znaczenia, co część w zakresie.
- **Nazwij przypadki, na których ci zależy.** *„Upewnij się, że jest scenariusz dla użytkownika, który już ręcznie wybrał motyw."* AI pokryje to, na co wskazujesz.
- **Następnie edytuj.** To zwykły Markdown. Zawęź mgliste `SHALL`, usuń scenariusz, który nic nie testuje, dodaj przypadek, który pominęło — lub poproś AI o to: *„wymaganie o limicie czasu jest mgliste, przypnij je do 30 minut."*

Szkic, wyostrzanie, powtórka. Kilka rund tego procesu daje specyfikację, której ufasz, co jest całym sensem.

## Szybka lista kontrolna

- [ ] Każde wymaganie to jedno obserwowalne zachowanie z `SHALL`/`MUST`.
- [ ] Żadne szczegóły implementacji nie są wbudowane w wymagania.
- [ ] Każde wymaganie ma przynajmniej jeden scenariusz, który faktycznie je ćwiczy.
- [ ] Ważne przypadki brzegowe i błędów mają scenariusze, nie tylko ścieżka szczęśliwa.
- [ ] Delty używają ADDED / MODIFIED / REMOVED poprawnie względem aktualnej specyfikacji.
- [ ] Cała zmiana ma jeden cel, który można powiedzieć w jednym zdaniu.

## Gdzie przejść dalej

- [Przeglądanie zmiany](reviewing-changes.md) — dwuminutowy przegląd, który wyłapuje to, co umknęło.
- [Koncepcje](concepts.md) — głębszy model stojący za specyfikacjami, zmianami i deltami.
- [Przykłady i przepisy](examples.md) — prawdziwe zmiany od początku do końca.