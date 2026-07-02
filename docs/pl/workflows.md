# Przepływy Pracy

Ten przewodnik omawia powszechne wzorce przepływów pracy dla OpenSpec i kiedy należy użyć każdego z nich. Podstawową konfigurację można znaleźć w [Getting Started](getting-started.md). Odniesienie się do komend znajdziesz w [Commands](commands.md).

## Filozofia: Akcje, a nie Fazy

Tradycyjne przepływy pracy zmuszają Cię przez fazy: planowanie, następnie implementacja, a na końcu ukończenie. Ale prawdziwa praca nie mieści się idealnie w pudełkach.

OPSX podchodzi do tego inaczej:

```text
Traditional (phase-locked):

  PLANNING ────────► IMPLEMENTING ────────► DONE
      │                    │
      │   "Can't go back"  │
      └────────────────────┘

OPSX (fluid actions):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Kluczowe zasady:**

- **Akcje, a nie fazy** - Komendy to rzeczy, które możesz zrobić, a nie etapy, w których jesteś uwięziony.
- **Zależności są umożliwiające** - Pokazują one, co jest możliwe, a nie co musi nastąpić dalej.

> **Dostosowanie:** Przepływy pracy OPSX są sterowane przez schematy definiujące sekwencje artefaktów. Więcej szczegółów na temat tworzenia niestandardowych schematów znajdziesz w [Customization](customization.md).

## Dwa Tryby

### Standardowa Szybka Ścieżka (`core` profil)

Nowe instalacje domyślnie używają `core`, który zapewnia:
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Typowy przepływ pracy:

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (opcjonalnie)
```

#### Zacznij od eksploracji (nawyk, który warto wyrobić)

`/opsx:explore` jest częścią profilu domyślnego, a nie zaawansowaną dodatkową funkcją. Jest to ruch, jaki należy podjąć, gdy masz problem, ale jeszcze nie plan, co zdarza się najczęściej przy pomocy asystenta AI.

```text
You: /opsx:explore

AI:  Co chciałbyś zbadać?

You: Nasze wyniki wyszukiwania wydają się być przestarzałe. Nie jestem pewien, czy to problem z cache'owaniem, indeksowaniem, czy samym zapytaniem.

AI:  Pozwól mi sprawdzić... [czyta warstwę usługi wyszukiwania i pamięci podręcznej]
     To jest indeks: odświeża go tylko raz dziennie, więc edycje nie pojawiają się do następnego dnia. Dwa opcje: rebuild on write (prostsze, więcej obciążenia) lub krótkotrwała invalidacja cache'a (więcej elementów ruchomych, mniej obciążenia). Biorąc pod uwagę niski wolumen Twoich zapisów, rebuild-on-write jest czystszym rozwiązaniem. Czy chcesz to określić?

You: Tak.

You: /opsx:propose rebuild-search-index-on-write
```

Eksploracja nie tworzy żadnych artefaktów ani kodu. Jest to bezpłatna rozmowa bez ryzyka, która zamienia mgliste zmartwienie w precyzyjną zmianę, dzięki czemu propozycja, która następuje po niej, jest trafna. Czy już wiesz dokładnie, czego potrzebujesz? Omiń ten krok i przejdź bezpośrednio do `/opsx:propose`. Pełny przewodnik: [Explore First](explore.md).

### Rozszerzony/Pełny Przepływ Pracy (niestandardowy wybór)

Jeśli chcesz mieć jawne komendy scaffoldowania i budowania (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), włącz je za pomocą:

```bash
openspec config profile
openspec update
```

## Schematy Pracy (Rozszerzony Tryb)

### Szybka Funkcjonalność

Gdy wiesz, co chcesz zbudować i potrzebujesz tylko wykonać to zadanie:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Przykład rozmowy:**

```text
You: /opsx:new add-logout-button

AI:  Utworzono openspec/changes/add-logout-button/
     Gotowe do utworzenia: proposal

You: /opsx:ff

AI:  Tworzenie wszystkich artefaktów planistycznych...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Gotowe do implementacji!

You: /opsx:apply

AI:  Praca nad zadaniami...
     ✓ Dodano przycisk wylogowania do nagłówka
     ✓ Zaimplementowano czyszczenie sesji
     ✓ Dodano dialog potwierdzający
     Wszystkie zadania zakończone!

You: /opsx:archive

AI:  ✓ Połączono specyfikacje
     ✓ Archiwizacja zmiany
```

**Najlepsze dla:** Małych i średnich funkcji, poprawek błędów, prostych zmian.

### Eksploracyjna

Gdy wymagania są niejasne lub musisz najpierw zbadać:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Przykład rozmowy:**

```text
You: /opsx:explore

AI:  Co chciałbyś zbadać?

You: Chcę poprawić wydajność ładowania strony, ale nie jestem pewien, gdzie są wąskie gardła.

AI:  Pozwól mi pomóc w badaniu...
     [Analizuje rozmiary pakietów, identyfikuje wolne zapytania, przegląda wzorce renderowania komponentów]

     Znalazłem trzy główne wąskie gardła:
     1. Duże nieoptymalizowane obrazy
     2. Synchronous data fetching w ProductList
     3. Re-renders z powodu zmian kontekstu

     Któremu chciałbyś się przyjrzeć najpierw?

You: Zajmijmy się problemem związanym z pobieraniem danych.

You: /opsx:new optimize-product-list-fetching

AI:  Utworzono zmianę. Gotowe do utworzenia: proposal

You: /opsx:continue

AI:  Tworzenie propozycji na podstawie naszej eksploracji...
     [Pisze propozycję, uwzględniając wnioski z badania]

     Gotowe do utworzenia: specs, design
     Co chciałbyś zrobić dalej?

You: /opsx:continue

AI:  Tworzenie specyfikacji...
```

**Najlepsze dla:** Optymalizacji wydajności, debugowania, decyzji architektonicznych, niejasnych wymagań.

### Równoległe Zmiany

Pracuj nad kilkoma zmianami naraz:

```text
Zmiana A: /opsx:new ──► /opsx:ff ──► /opsx:apply (w toku)
                                         │
                                    zmiana kontekstu
                                         │
Zmiana B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Przykład rozmowy:**

```text
You: Pracuję nad add-dark-mode, ale zostałem wciągnięty w naprawę błędu.

You: /opsx:new fix-login-redirect

AI:  Utworzono openspec/changes/fix-login-redirect/

You: /opsx:ff

AI:  ✓ Utworzone artefakty planistyczne

You: /opsx:apply

AI:  Praca nad fix-login-redirect...
     [Implementuje poprawkę]
     Wszystkie zadania zakończone!

You: /opsx:archive

AI:  ✓ Zarchiwizowano fix-login-redirect

You: Wróćmy do dark mode.

You: /opsx:apply add-dark-mode

AI:  Wznawiam add-dark-mode...
     Kontynuowanie od zadania 2.3: Aktualizacja Nagłówka...
```

**Najlepsze dla:** Równoległych strumieni pracy, pilnych przerwań, współpracy zespołowej.

Gdy masz wiele ukończonych zmian, użyj `/opsx:bulk-archive`:

```text
You: /opsx:bulk-archive

AI:  Znaleziono 3 ukończone zmiany:
     - add-dark-mode (wszystkie zadania wykonane)
     - fix-login-redirect (wszystkie zadania wykonane)
     - update-footer (wszystkie zadania wykonane)

     Sprawdzanie konfliktów specyfikacji...
     ⚠ add-dark-mode i update-footer dotykają specs/ui/

     Inspekcja kodu źródłowego w celu rozwiązania...
     Obie zmiany zostały zaimplementowane. Zostaną zastosowane w kolejności chronologicznej.

     Archiwizować wszystkie 3 zmiany?

You: Tak

AI:  ✓ Zarchiwizowano add-dark-mode
     ✓ Zarchiwizowano fix-login-redirect
     ✓ Zarchiwizowano update-footer
     Specyfikacje połączone w kolejności: add-dark-mode → update-footer
```

Bulk archive wykrywa, kiedy wiele zmian dotyka te same specyfikacje i rozwiązuje konflikty poprzez sprawdzenie tego, co zostało faktycznie zaimplementowane.

### Ukończenie Zmiany

Zalecany przepływ ukończenia:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              waliduje          pyta o synchronizację
              implementację     jeśli to konieczne
```

#### Verify (Weryfikacja): Sprawdź Swoją Pracę

`/opsx:verify` waliduje implementację względem Twoich artefaktów w trzech wymiarach:

```text
You: /opsx:verify

AI:  Weryfikowanie add-auth...

     KOMPLETNOŚĆ (COMPLETENESS)
     ✓ Wszystkie 12 zadań z tasks.md zostało sprawdzone
     ✓ Wszystkie wymagania w specach mają odpowiadający kod
     ⚠ Scenariusz "Timeout sesji po bezczynności" nie został przetestowany

     POPRAWNOŚĆ (CORRECTNESS)
     ✓ Implementacja zgadza się z intencją specyfikacji
     ✓ Obsługiwane są przypadki brzegowe ze scenariuszy
     ✓ Stany błędów odpowiadają definicjom w specyfikacji

     SPÓJNOŚĆ (COHERENCE)
     ✓ Decyzje projektowe odzwierciedlone w strukturze kodu
     ✓ Konwencje nazewnictwa zgodne z design.md
     ⚠ Projekt wspomina "event-driven", ale implementacja używa pollingu

     PODSUMOWANIE (SUMMARY)
     ─────────────────────────────
     Krytyczne problemy: 0
     Ostrzeżenia: 2
     Gotowe do archiwizacji: Tak (z ostrzeżeniami)

     Rekomendacje:
     1. Dodaj test dla scenariusza timeoutu sesji
     2. Rozważ refaktoryzację na event-driven, zgodnie z projektem, lub aktualizację design.md
```

**Co sprawdza Verify:**

| Wymiar | Co waliduje |
|-----------|------------------|
| Completeness (Kompletność) | Wszystkie zadania wykonane, wszystkie wymagania zaimplementowane, scenariusze objęte |
| Correctness (Poprawność) | Implementacja zgadza się z intencją specyfikacji, przypadki brzegowe obsługiwane |
| Coherence (Spójność) | Decyzje projektowe odzwierciedlone w kodzie, wzorce spójne |

Verify nie zablokuje archiwizacji, ale ujawnia problemy, które możesz chcieć rozwiązać najpierw.

#### Archive (Archiwizacja): Finalizacja Zmiany

`/opsx:archive` kończy zmianę i przenosi ją do archiwum:

```text
You: /opsx:archive

AI:  Archiwizowanie add-auth...

     Status artefaktów:
     ✓ proposal.md istnieje
     ✓ specs/ istnieje
     ✓ design.md istnieje
     ✓ tasks.md istnieje (12/12 zadań ukończonych)

     Delta specyfikacji: Jeszcze nie zsynchronizowana z głównym repozytorium
     → Czy chcesz teraz zsynchronizować?

You: Tak

AI:  ✓ Zsynchronizowano specyfikacje do openspec/specs/auth/spec.md
     ✓ Przeniesiono do openspec/changes/archive/2025-01-24-add-auth/

     Zmiana pomyślnie zarchiwizowana.
```

Archive poprosi o synchronizację, jeśli specyfikacje nie są zsynchronizowane. Nie zablokuje pracy na niezakończonych zadaniach, ale ostrzeże o tym.

## Kiedy Używać Czego

### `/opsx:ff` vs `/opsx:continue`

| Sytuacja | Użyj |
|-----------|-----|
| Jasne wymagania, gotowy do budowania | `/opsx:ff` |
| Eksplorowanie, chcesz przejrzeć każdy krok | `/opsx:continue` |
| Chcesz iterować nad propozycją przed specyfikacjami | `/opsx:continue` |
| Presja czasu, potrzebujesz szybko działać | `/opsx:ff` |
| Złożona zmiana, chcesz mieć kontrolę | `/opsx:continue` |

**Zasada ogólna:** Jeśli możesz opisać pełny zakres z góry, użyj `/opsx:ff`. Jeśli odkrywasz to w trakcie pracy, użyj `/opsx:continue`.

### Kiedy Aktualizować vs. Zaczynać od Nowa

Powszechne pytanie: kiedy jest OK zaktualizować istniejącą zmianę, a kiedy należy zacząć nową?

**Aktualizuj istniejącą zmianę, gdy:**

- Intencja jest ta sama, ale wykonanie zostało dopracowane
- Zakres się zawęża (najpierw MVP, reszta później)
- Korekty wynikające z nauki (kod nie był taki jak oczekiwano)
- Drobne poprawki na podstawie odkryć implementacyjnych

**Zacznij nową zmianę, gdy:**

- Intencja uległa fundamentalnej zmianie
- Zakres eksplodował w zupełnie inną pracę
- Oryginalna zmiana może być oznaczona jako "ukończona" niezależnie
- Łatki spowodowałyby więcej niejasności niż wyjaśnienia

```text
                     ┌─────────────────────────────────────┐
                     │     Czy to jest ta sama praca?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Ta sama intencja?      >50% nakładania się?      Czy oryginalna
          Ten sam problem?       Ten sam zakres?        może być "ukończona" bez tych zmian?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      TAK               NIE TAK YES           NIE  NIE              TAK
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    AKTUALIZACJA        NOWA  AKTUALIZACJA     NOWA  AKTUALIZACJA    NOWA
```

**Przykład: "Dodanie ciemnego trybu"**

- "Potrzebujemy też obsługi spersonalizowanych motywów" → Nowa zmiana (zakres eksplodował)
- "Wykrywanie preferencji systemu jest trudniejsze niż się spodziewałem" → Aktualizacja (ta sama intencja)
- "Najpierw wypuścimy przełącznik, a preferencje dodamy później" → Aktualizuj i zarchiwizuj, potem nowa zmiana

## Najlepsze Praktyki

### Utrzymuj Zmiany Skupione

Jednolity jednostka pracy na jedną zmianę. Jeśli robisz "dodanie funkcji X i refaktoryzację Y", rozważ dwie oddzielne zmiany.

**Dlaczego to jest ważne:**
- Łatwiej jest przejrzeć i zrozumieć
- Czysta historia archiwizacji
- Można wypuścić niezależnie
- Prostszy rollback, jeśli będzie konieczny

### Używaj `/opsx:explore` dla Niejasnych Wymagań

Zanim zobowiążesz się do zmiany, zbadaj przestrzeń problemową:

```text
You: /opsx:explore

AI:  Co chciałbyś zbadać?

You: Jak powinniśmy obsłużyć ograniczanie liczby żądań (rate limiting) dla naszego API?

AI:  Pozwól mi zbadać Twoje obecne ustawienia i opcje...
     [Badanie kodu źródłowego, rozważanie wzorców]

     Widzę trzy podejścia, które moglibyśmy zastosować:
     1. Oparte na middleware (proste, na endpoint)
     2. Zasilane Redis (skalowalne, wspólny stan)
     3. Token bucket na użytkownika (uczciwe, złożone)

     Obeczne stos sugerują #1 lub #2. Jaki jest Twój skalę?
```

Eksploracja wyjaśnia myślenie, zanim stworzysz artefakty.

### Weryfikuj Przed Archiwizacją

Używaj `/opsx:verify`, aby sprawdzić, czy implementacja odpowiada artefaktom:

```text
You: /opsx:verify

AI:  Weryfikowanie add-dark-mode...

     ✓ Wszystkie zadania z tasks.md zostały sprawdzone
     ✓ Wymagania w specach mają odpowiadający kod
     ✓ Decyzje projektowe są odzwierciedlone w implementacji

     Gotowe do archiwizacji!
```

Łapie niezgodności, zanim zamkniesz zmianę.

### Jasno Nazwij Zmiany

Dobre nazwy sprawiają, że `openspec list` jest użyteczne:

```text
Dobrze:                          Unikać:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Szybkie Odniesienie Poleceń

Pełne szczegóły i opcje poleceń można znaleźć w [Komendach](commands.md).

| Command | Cel działania | Kiedy używać |
|---------|---------------|--------------|
| `/opsx:propose` | Utwórz zmiany i artefakty planowania | Szybka ścieżka domyślna (`core` profile) |
| `/opsx:explore` | Przeanalizuj pomysły z pomocą AI | Rozpocznij tutaj, gdy jesteś niepewny: niejasne wymagania, badanie, porównywanie opcji |
| `/opsx:new` | Rozpocznij szkielet zmiany | Tryb rozszerzony, jawna kontrola artefaktów |
| `/opsx:continue` | Utwórz następny artefakt | Tryb rozszerzony, tworzenie artefaktów krok po kroku |
| `/opsx:ff` | Utwórz wszystkie artefakty planowania | Tryb rozszerzony, jasny zakres |
| `/opsx:apply` | Zrealizuj zadania | Gotowy do pisania kodu |
| `/opsx:verify` | Zweryfikuj implementację | Tryb rozszerzony, przed archiwizacją |
| `/opsx:sync` | Połącz specyfikacje delty | Tryb rozszerzony, opcjonalnie |
| `/opsx:archive` | Ukończ zmianę | Cała praca zakończona |
| `/opsx:bulk-archive` | Zarchiwizuj wiele zmian | Tryb rozszerzony, praca równoległa |

## Następne Kroki

- [Komendy](commands.md) - Pełna referencja poleceń wraz z opcjami
- [Koncepcje](concepts.md) - Dogłębna analiza specyfikacji, artefaktów i schematów
- [Dostosowanie](customization.md) - Tworzenie niestandardowych przepływów pracy