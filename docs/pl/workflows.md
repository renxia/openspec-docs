# Przepływy pracy

Ten przewodnik obejmuje typowe wzorce przepływów pracy dla OpenSpec oraz wskazuje, kiedy warto używać każdego z nich. Podstawową konfigurację znajdziesz w przewodniku [Pierwsze kroki](getting-started.md). Dokumentację poleceń znajdziesz w sekcji [Polecenia](commands.md).

## Filozofia: Działania, a nie fazy

Tradycyjne przepływy pracy wymuszają przejście przez kolejne fazy: planowanie, następnie implementacja, a na końcu zakończenie. Prawdziwa praca jednak nie pasuje idealnie do tych sztywnych szuflad.

OPSX stosuje inny podejście:

```text
Tradycyjny (zablokowany fazowo):

  PLANOWANIE ────────► IMPLEMENTACJA ────────► ZAKOŃCZENIE
      │                    │
      │   "Nie można cofnąć się do tyłu"  │
      └────────────────────┘

OPSX (płynne działania):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Kluczowe zasady:**

- **Działania, a nie fazy** – Polecenia to czynności, które możesz wykonywać, a nie etapy, w których utkniesz
- **Zależności to elementy umożliwiające** – Wskazują, co jest możliwe, a nie co jest wymagane jako następny krok

> **Dostosowywanie:** Przepływy pracy OPSX są sterowane przez schematy, które definiują kolejności artefaktów. Szczegóły dotyczące tworzenia własnych schematów znajdziesz w sekcji [Dostosowywanie](customization.md).

## Dwa tryby

### Domyślna szybka ścieżka (profil `core`)

Nowe instalacje domyślnie używają profilu `core`, który zapewnia:
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Typowy przepływ:

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (opcjonalnie)
```

#### Zacznij od eksploracji (nawyk wart kształtowania)

`/opsx:explore` jest częścią domyślnego profilu, a nie zaawansowanym dodatkiem. To ruch, który warto wykonać, gdy masz problem, ale jeszcze nie masz planu — co w przypadku asystenta AI ma miejsce większość czasu.

```text
Ty: /opsx:explore

AI:  Co chciałbyś zbadać?

Ty: Nasze wyniki wyszukiwania wydają się nieaktualne. Nie jestem pewien, czy to problem z cache'owaniem,
     indeksowaniem, czy samym zapytaniem.

AI:  Pozwól, że sprawdzę... [odczytuje usługę wyszukiwania i warstwę cache]
     To indeks: przebudowuje się tylko nocnie, więc zmiany nie pojawiają się
     do następnego dnia. Dwie opcje: przebudowa przy zapisie (prostsza,
     większe obciążenie) lub unieważnienie cache'a z krótkim TTL (więcej ruchomych części,
     mniejsze obciążenie). Biorąc pod uwagę niski wolumen zapisów, przebudowa-przy-zapisie
     jest czystszym rozwiązaniem. Chcesz to zakresowo określić?

Ty: Tak.

Ty: /opsx:propose rebuild-search-index-on-write
```

Eksploracja nie tworzy żadnych artefaktów i nie pisze kodu. To bezpłatna, bezryzykowna rozmowa, która zamienia mglistą obawę w precyzyjną zmianę, dzięki czemu następująca po niej propozycja jest ostra. Jeśli wiesz już dokładnie, czego chcesz, pomiń eksplorację i przejdź od razu do `/opsx:propose`. Pełny przewodnik: [Eksploracja w pierwszej kolejności](explore.md).

### Rozszerzony/pełny przepływ pracy (wybór niestandardowy)

Jeśli chcesz mieć jawne polecenia tworzenia szkieletu i budowania (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), włącz je za pomocą:

```bash
openspec config profile
openspec update
```

## Wzorce przepływu pracy (tryb rozszerzony)

### Szybka funkcja

Gdy wiesz, co chcesz zbudować i potrzebujesz tylko wykonać:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Przykładowa rozmowa:**

```text
Ty: /opsx:new add-logout-button

AI:  Utworzono openspec/changes/add-logout-button/
     Gotowe do utworzenia: proposal

Ty: /opsx:ff

AI:  Tworzę wszystkie artefakty planowania...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Gotowe do implementacji!

Ty: /opsx:apply

AI:  Pracuję nad zadaniami...
     ✓ Dodano przycisk wylogowania do nagłówka
     ✓ Zaimplementowano czyszczenie sesji
     ✓ Dodano dialog potwierdzenia
     Wszystkie zadania zakończone!

Ty: /opsx:archive

AI:  ✓ Scalono specyfikacje
     ✓ Zarchiwizowano zmianę
```

**Najlepsze dla:** Małych i średnich funkcji, poprawek błędów, prostych zmian.

### Eksploracyjne

Gdy wymagania są niejasne lub musisz najpierw zbadać:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Przykładowa rozmowa:**

```text
Ty: /opsx:explore

AI:  Co chciałbyś zbadać?

Ty: Chcę poprawić wydajność ładowania stron, ale nie jestem pewien,
     gdzie są wąskie gardła.

AI:  Pomogę zbadać...
     [Analizuje rozmiary bundle'ów, identyfikuje wolne zapytania, przegląda
     wzorce renderowania komponentów]

     Znalazłem trzy główne wąskie gardła:
     1. Duże nieoptymalizowane obrazy
     2. Synchroniczne pobieranie danych w ProductList
     3. Ponowne renderowania ze zmian kontekstu

     Które chciałbyś rozwiązać w pierwszej kolejności?

Ty: Zajmijmy się problemem pobierania danych.

Ty: /opsx:new optimize-product-list-fetching

AI:  Utworzono zmianę. Gotowe do utworzenia: proposal

Ty: /opsx:continue

AI:  Tworzę propozycję na podstawie naszej eksploracji...
     [Pisze propozycję uwzględniającą wyniki badania]

     Gotowe do utworzenia: specs, design
     Co chciałbyś dalej?

Ty: /opsx:continue

AI:  Tworzę specyfikacje...
```

**Najlepsze dla:** Optymalizacji wydajności, debugowania, decyzji architektonicznych, niejednoznacznych wymagań.

### Zmiany równoległe

Pracuj nad wieloma zmianami jednocześnie:

```text
Zmiana A: /opsx:new ──► /opsx:ff ──► /opsx:apply (w toku)
                                         │
                                    przełączenie kontekstu
                                         │
Zmiana B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Przykładowa rozmowa:**

```text
Ty: Pracuję nad add-dark-mode, ale zostałem ściągnięty do poprawki błędu

Ty: /opsx:new fix-login-redirect

AI:  Utworzono openspec/changes/fix-login-redirect/

Ty: /opsx:ff

AI:  ✓ Utworzono artefakty planowania

Ty: /opsx:apply

AI:  Pracuję nad fix-login-redirect...
     [Implementuje poprawkę]
     Wszystkie zadania zakończone!

Ty: /opsx:archive

AI:  ✓ Zarchiwizowano fix-login-redirect

Ty: Wróćmy do trybu ciemnego

Ty: /opsx:apply add-dark-mode

AI:  Wznawiam add-dark-mode...
     Kontynuuję od zadania 2.3: Update Header...
```

**Najlepsze dla:** Równoległych strumieni pracy, pilnych przerwań, współpracy zespołowej.

Gdy masz wiele ukończonych zmian, użyj `/opsx:bulk-archive`:

```text
Ty: /opsx:bulk-archive

AI:  Znaleziono 3 ukończone zmiany:
     - add-dark-mode (wszystkie zadania wykonane)
     - fix-login-redirect (wszystkie zadania wykonane)
     - update-footer (wszystkie zadania wykonane)

     Sprawdzam konflikty specyfikacji...
     ⚠ add-dark-mode i update-footer obie dotykają specs/ui/

     Przeglądam bazę kodu, aby rozwiązać...
     Obie zmiany są zaimplementowane. Zastosuję w kolejności chronologicznej.

     Zarchiwizować wszystkie 3 zmiany?

Ty: Tak

AI:  ✓ Zarchiwizowano add-dark-mode
     ✓ Zarchiwizowano fix-login-redirect
     ✓ Zarchiwizowano update-footer
     Specyfikacje scalono w kolejności: add-dark-mode → update-footer
```

Archiwizacja zbiorcza wykrywa, gdy wiele zmian dotyczy tych samych specyfikacji, i rozwiązuje konflikty, sprawdzając, co faktycznie jest zaimplementowane.

### Ukończenie zmiany

Zalecany przepływ pracy dla ukończenia:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              waliduje          monituje o synchronizację
              implementację     w razie potrzeby
```

#### Weryfikacja: Sprawdź swoją pracę

`/opsx:verify` waliduje implementację względem artefaktów w trzech wymiarach:

```text
Ty: /opsx:verify

AI:  Weryfikuję add-auth...

     KOMPLETNOŚĆ
     ✓ Wszystkie 12 zadań w tasks.md jest zaznaczonych
     ✓ Wszystkie wymagania w specs mają odpowiadający kod
     ⚠ Scenariusz "Sesja wygasa po bezczynności" nie został przetestowany

     POPRAWNOŚĆ
     ✓ Implementacja odpowiada zamysłowi specyfikacji
     ✓ Przypadki brzegowe ze scenariuszy są obsłużone
     ✓ Stany błędów odpowiadają definicjom ze specyfikacji

     SPÓJNOŚĆ
     ✓ Decyzje projektowe odzwierciedlone w strukturze kodu
     ✓ Konwencje nazewnicze spójne z design.md
     ✓ Design wspomina o "event-driven", ale implementacja używa pollingu

     PODSUMOWANIE
     ─────────────────────────────
     Krytyczne problemy: 0
     Ostrzeżenia: 2
     Gotowe do archiwizacji: Tak (z ostrzeżeniami)

     Zalecenia:
     1. Dodaj test dla scenariusza wygasania sesji
     2. Rozważ refaktoryzację do event-driven zgodnie z projektem, lub zaktualizuj design.md
```

**Co sprawdza weryfikacja:**

| Wymiar | Co waliduje |
|--------|-------------|
| Kompletność | Wszystkie zadania wykonane, wszystkie wymagania zaimplementowane, scenariusze pokryte |
| Poprawność | Implementacja odpowiada zamysłowi specyfikacji, przypadki brzegowe obsłużone |
| Spójność | Decyzje projektowe odzwierciedlone w kodzie, wzorce spójne |

Weryfikacja nie zablokuje archiwizacji, ale wykaże problemy, które możesz chcieć najpierw rozwiązać.

#### Archiwizacja: Zakończ zmianę

`/opsx:archive` kończy zmianę i przenosi ją do archiwum:

```text
Ty: /opsx:archive

AI:  Archiwizuję add-auth...

     Status artefaktów:
     ✓ proposal.md istnieje
     ✓ specs/ istnieje
     ✓ design.md istnieje
     ✓ tasks.md istnieje (12/12 zadań zakończonych)

     Delta specs: Jeszcze nie zsynchronizowane z głównymi
     → Czy chcesz zsynchronizować teraz?

Ty: Tak

AI:  ✓ Zsynchronizowano specyfikacje do openspec/specs/auth/spec.md
     ✓ Przeniesiono do openspec/changes/archive/2025-01-24-add-auth/

     Zmiana zarchiwizowana pomyślnie.
```

Archiwizacja wyświetli monit, jeśli specyfikacje nie są zsynchronizowane. Nie zablokuje się na niezadanych zadaniach, ale ostrzeże cię.

## Kiedy czego używać

### `/opsx:ff` vs `/opsx:continue`

| Sytuacja | Użyj |
|----------|------|
| Jasne wymagania, gotowy do budowania | `/opsx:ff` |
| Eksploracja, chcesz przejrzeć każdy krok | `/opsx:continue` |
| Chcesz iterować propozycję przed specyfikacjami | `/opsx:continue` |
| Presja czasu, potrzebujesz szybko się poruszać | `/opsx:ff` |
| Złożona zmiana, chcesz mieć kontrolę | `/opsx:continue` |

**Zasada ogólna:** Jeśli możesz opisać pełny zakres z góry, użyj `/opsx:ff`. Jeśli dopiero się orientujesz w trakcie, użyj `/opsx:continue`.

### Kiedy aktualizować, a kiedy zaczynać od nowa

Częste pytanie: kiedy można aktualizować istniejącą zmianę, a kiedy powinno się zacząć nową?

**Aktualizuj istniejącą zmianę, gdy:**

- Ten sam zamysł, dopracowana realizacja
- Zakres się zwęza (najpierw MVP, reszta później)
- Korekty wynikające z uczenia się (baza kodu nie jest taka, jakiej się spodziewałeś)
- Dostosowania projektu wynikające z odkryć podczas implementacji

**Zacznij nową zmianę, gdy:**

- Zamysł fundamentalnie się zmienił
- Zakres eksplodował do zupełnie innej pracy
- Oryginalna zmiana może być oznaczona jako „zakończona" samodzielnie
- Łaty bardziej by myliły niż wyjaśniały

```text
                     ┌─────────────────────────────────────┐
                     │     Czy to ta sama praca?           │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Ten sam zamysł?    >50% nakładania?    Czy oryginalna
          Ten sam problem?   Ten sam zakres?    może być "zakończona"
                 │                  │          bez tych zmian?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      TAK              NIE TAK           NIE NIE             TAK
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    AKTUALIZACJA       NOWA AKTUALIZACJA NOWA AKTUALIZACJA    NOWA
```

**Przykład: „Dodaj tryb ciemny"**

- „Trzeba również obsługiwać niestandardowe motywy" → Nowa zmiana (zakres eksplodował)
- „Wykrywanie preferencji systemu jest trudniejsze niż oczekiwano" → Aktualizacja (ten sam zamysł)
- „Wydajmy najpierw przełącznik, dodajmy preferencje później" → Aktualizacja, potem archiwizacja, potem nowa zmiana

## Najlepsze praktyki

### Utrzymuj zmiany skupione

Jedna logiczna jednostka pracy na zmianę. Jeśli robisz „dodaj funkcję X i również refaktoryzuj Y", rozważ dwie osobne zmiany.

**Dlaczego to jest ważne:**
- Łatwiejsze do przeglądu i zrozumienia
- Czystsza historia archiwum
- Można wydawać niezależnie
- Prostszy rollback w razie potrzeby

### Użyj `/opsx:explore` dla niejednoznacznych wymagań

Przed zobowiązaniem się do zmiany, zbadaj przestrzeń problemu:

```text
Ty: /opsx:explore

AI:  Co chciałbyś zbadać?

Ty: Jak powinniśmy obsługiwać rate limiting dla naszego API?

AI:  Pozwól, że zbadam twoją obecną konfigurację i opcje...
     [Bada bazę kodu, rozważa wzorce]

     Widzę trzy podejścia, które możemy przyjąć:
     1. Oparte na middleware (proste, per-endpoint)
     2. Wspierane przez Redis (skalowalne, współdzielony stan)
     3. Token bucket na użytkownika (sprawiedliwe, złożone)

     Twój obecny stos sugeruje #1 lub #2. Jaka jest twoja skala?
```

Eksploracja wyjaśnia myślenie przed utworzeniem artefaktów.

### Weryfikuj przed archiwizacją

Użyj `/opsx:verify`, aby sprawdzić, czy implementacja odpowiada artefaktom:

```text
Ty: /opsx:verify

AI:  Weryfikuję add-dark-mode...

     ✓ Wszystkie zadania w tasks.md są zaznaczone
     ✓ Wymagania w specs mają odpowiadający kod
     ✓ Decyzje projektowe są odzwierciedlone w implementacji

     Gotowe do archiwizacji!
```

Wychwytuje niezgodności przed zakończeniem zmiany.

### Nazywaj zmiany jasno

Dobre nazwy sprawiają, że `openspec list` jest przydatne:

```text
Dobre:                         Unikaj:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Szybki przewodnik po poleceniach

Pełne szczegóły i opcje wszystkich poleceń znajdziesz w sekcji [Polecenia](commands.md).

| Polecenie | Cel | Kiedy używać |
|---------|---------|-------------|
| `/opsx:propose` | Tworzyć zmianę + artefakty planowania | Szybka domyślna ścieżka (profil `core`) |
| `/opsx:explore` | Rozważać pomysły z pomocą AI | Zacznij tutaj, gdy nie masz pewności: niejasne wymagania, badanie, porównywanie opcji |
| `/opsx:new` | Rozpoczynać szkielet zmiany | Tryb rozszerzony, jawna kontrola nad artefaktami |
| `/opsx:continue` | Tworzyć kolejny artefakt | Tryb rozszerzony, tworzenie artefaktów krok po kroku |
| `/opsx:ff` | Tworzyć wszystkie artefakty planowania | Tryb rozszerzony, jasno określony zakres |
| `/opsx:apply` | Wdrażać zadania | Gotowy do napisania kodu |
| `/opsx:verify` | Walidować implementację | Tryb rozszerzony, przed archiwizacją |
| `/opsx:sync` | Scalać specyfikacje delta | Tryb rozszerzony, opcjonalne |
| `/opsx:archive` | Ukończyć zmianę | Wszystkie prace ukończone |
| `/opsx:bulk-archive` | Archiwizować wiele zmian | Tryb rozszerzony, praca równoległa |

## Następne kroki

- [Pisanie dobrych specyfikacji](writing-specs.md) - Jak wyglądają solidne wymaganie i scenariusz oraz jak dobrać odpowiedni rozmiar zmiany
- [Przeglądanie zmiany](reviewing-changes.md) - Dwuminutowe sprawdzenie przygotowanego planu przed rozpoczęciem pracy z kodem
- [OpenSpec w zespole](team-workflow.md) - Jak zmiany wpisują się w gałęzie i pull requesty
- [Polecenia](commands.md) - Pełna dokumentacja poleceń z dostępnymi opcjami
- [Pojęcia](concepts.md) - Głębokie omówienie specyfikacji, artefaktów i schematów
- [Dostosowywanie](customization.md) - Tworzenie niestandardowych przepływów pracy