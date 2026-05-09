# Przepływy pracy

Ten przewodnik opisuje typowe wzorce przepływów pracy dla OpenSpec oraz kiedy z nich korzystać. Podstawową konfigurację znajdziesz w sekcji [Pierwsze kroki](getting-started.md). Referencję poleceń znajdziesz w sekcji [Polecenia](commands.md).

## Filozofia: Czynności, nie fazy

Tradycyjne przepływy pracy zmuszają do przechodzenia przez fazy: planowanie, potem implementacja, potem koniec. Ale prawdziwa praca nie mieści się w takich sztywnych ramach.

OPSX przyjmuje inne podejście:

```text
Tradycyjne (zablokowane fazami):

  PLANOWANIE ────────► IMPLEMENTACJA ────────► GOTOWE
      │                    │
      │   "Nie można wrócić"│
      └────────────────────┘

OPSX (płynne czynności):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Kluczowe zasady:**

- **Czynności, nie fazy** - Polecenia to rzeczy, które możesz zrobić, a nie etapy, w których utknąłeś
- **Zależności jako umożliwiacze** - Pokazują, co jest możliwe, a nie co jest wymagane jako następne

> **Dostosowywanie:** Przepływy pracy OPSX są sterowane przez schematy definiujące sekwencje artefaktów. Szczegóły dotyczące tworzenia niestandardowych schematów znajdziesz w sekcji [Dostosowywanie](customization.md).

## Dwa tryby

### Domyślna ścieżka szybka (profil `core`)

Nowe instalacje domyślnie korzystają z `core`, który udostępnia:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Typowy przepływ:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

### Rozszerzony/Pełny przepływ (wybór niestandardowy)

Jeśli potrzebujesz jawnych poleceń do tworzenia i budowania (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), włącz je za pomocą:

```bash
openspec config profile
openspec update
```

## Wzorce przepływu pracy (tryb rozszerzony)

### Szybka funkcjonalność

Gdy wiesz, co chcesz zbudować i wystarczy Ci wykonanie:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Przykładowa rozmowa:**

```text
You: /opsx:new add-logout-button

AI:  Created openspec/changes/add-logout-button/
     Ready to create: proposal

You: /opsx:ff

AI:  Creating all planning artifacts...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Ready for implementation!

You: /opsx:apply

AI:  Working through tasks...
     ✓ Added logout button to header
     ✓ Implemented session clearing
     ✓ Added confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  ✓ Merged specs
     ✓ Archived change
```

**Najlepsze do:** Małych i średnich funkcjonalności, poprawek błędów, prostych zmian.

### Badawczy

Gdy wymagania nie są jasne lub najpierw trzeba zbadać problem:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Przykładowa rozmowa:**

```text
You: /opsx:explore

AI:  What would you like to explore?

You: I want to improve page load performance but I'm not sure
     where the bottlenecks are.

AI:  Let me help investigate...
     [Analyzes bundle sizes, identifies slow queries, reviews
     component render patterns]

     I found three main bottlenecks:
     1. Large unoptimized images
     2. Synchronous data fetching in ProductList
     3. Re-renders from context changes

     Which would you like to address first?

You: Let's tackle the data fetching issue.

You: /opsx:new optimize-product-list-fetching

AI:  Created change. Ready to create: proposal

You: /opsx:continue

AI:  Creating proposal based on our exploration...
     [Writes proposal incorporating investigation insights]

     Ready to create: specs, design
     Which would you like next?

You: /opsx:continue

AI:  Creating specs...
```

**Najlepsze do:** Optymalizacji wydajności, debugowania, decyzji architektonicznych, niejasnych wymagań.

### Zmiany równoległe

Praca nad wieloma zmianami jednocześnie:

```text
Zmiana A: /opsx:new ──► /opsx:ff ──► /opsx:apply (w trakcie)
                                         │
                                    zmiana kontekstu
                                         │
Zmiana B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Przykładowa rozmowa:**

```text
You: I'm working on add-dark-mode but got pulled into a bug fix

You: /opsx:new fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/

You: /opsx:ff

AI:  ✓ Created planning artifacts

You: /opsx:apply

AI:  Working on fix-login-redirect...
     [Implements the fix]
     All tasks complete!

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect

You: Let's get back to dark mode

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode...
     Picking up at task 2.3: Update Header...
```

**Najlepsze do:** Równoległych strumieni pracy, pilnych przerwań, pracy zespołowej.

Gdy masz wiele ukończonych zmian, użyj `/opsx:bulk-archive`:

```text
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (all tasks done)
     - fix-login-redirect (all tasks done)
     - update-footer (all tasks done)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will apply in chronological order.

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-redirect
     ✓ Archived update-footer
     Specs merged in order: add-dark-mode → update-footer
```

Masowe archiwizowanie wykrywa, gdy wiele zmian dotyczy tych samych specyfikacji, i rozwiązuje konflikty, sprawdzając, co faktycznie zostało zaimplementowane.

### Finalizacja zmiany

Rekomendowany przepływ finalizacji:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              waliduje           proponuje synchronizację
              implementację      w razie potrzeby
```

#### Weryfikacja: Sprawdź swoją pracę

`/opsx:verify` waliduje implementację względem artefaktów w trzech wymiarach:

```text
You: /opsx:verify

AI:  Verifying add-auth...

     COMPLETENESS
     ✓ All 12 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Session timeout after inactivity" not tested

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "event-driven" but implementation uses polling

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for session timeout scenario
     2. Consider refactoring to event-driven as designed, or update design.md
```

**Co sprawdza weryfikacja:**

| Wymiar | Co waliduje |
|--------|-------------|
| Kompletność | Wszystkie zadania wykonane, wszystkie wymagania zaimplementowane, scenariusze pokryte |
| Poprawność | Implementacja odpowiada intencji specyfikacji, obsłużone przypadki brzegowe |
| Spójność | Decyzje projektowe odzwierciedlone w kodzie, wzorce konsekwentne |

Weryfikacja nie blokuje archiwizacji, ale wskazuje problemy, które warto najpierw rozwiązać.

#### Archiwizacja: Finalizacja zmiany

`/opsx:archive` finalizuje zmianę i przenosi ją do archiwum:

```text
You: /opsx:archive

AI:  Archiving add-auth...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (12/12 tasks complete)

     Delta specs: Not yet synced to main
     → Would you like to sync now?

You: Yes

AI:  ✓ Synced specs to openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-auth/

     Change archived successfully.
```

Archiwizacja zapyta, jeśli specyfikacje nie zostały zsynchronizowane. Nie zablokuje się z powodu nieukończonych zadań, ale wyświetli ostrzeżenie.

## Kiedy czego używać

### `/opsx:ff` vs `/opsx:continue`

| Sytuacja | Użyj |
|----------|------|
| Jasne wymagania, gotowy do budowania | `/opsx:ff` |
| Badanie, chcesz przejrzeć każdy krok | `/opsx:continue` |
| Chcesz iterować nad propozycją przed specyfikacjami | `/opsx:continue` |
| Presja czasowa, trzeba działać szybko | `/opsx:ff` |
| Złożona zmiana, chcesz mieć kontrolę | `/opsx:continue` |

**Zasada ogólna:** Jeśli potrafisz opisać pełny zakres z góry, użyj `/opsx:ff`. Jeśli dopiero to odkrywasz w trakcie pracy, użyj `/opsx:continue`.

### Kiedy aktualizować, a kiedy zaczynać od nowa

Częste pytanie: kiedy można zaktualizować istniejącą zmianę, a kiedy lepiej rozpocząć nową?

**Zaktualizuj istniejącą zmianę, gdy:**

- Ta sama intencja, doprecyzowane wykonanie
- Zakres się zawęża (najpierw MVP, reszta później)
- Korekty wynikające z nauki (kod nie jest taki, jak się spodziewano)
- Dostosowania projektu na podstawie odkryć podczas implementacji

**Rozpocznij nową zmianę, gdy:**

- Intencja uległa fundamentalnej zmianie
- Zakres rozrósł się do zupełnie innej pracy
- Oryginalna zmiana może być oznaczona jako „ukończona" samodzielnie
- Łatki bardziej by zdezorientowały niż wyjaśniły

```text
                     ┌─────────────────────────────────────┐
                     │     Czy to ta sama praca?           │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Ta sama intencja?  >50% nakładania?   Czy oryginalna
          Ten sam problem?   Ten sam zakres?     zmiana może być
                 │                  │          „ukończona" bez
                 │                  │          tych zmian?
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      TAK               NIE TAK          NIE NIE             TAK
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
   AKTUALIZUJ        NOWA AKTUALIZUJ   NOWA AKTUALIZUJ     NOWA
```

**Przykład: „Dodaj tryb ciemny"**

- „Trzeba też obsługiwać niestandardowe motywy" → Nowa zmiana (zakres się rozszerzył)
- „Wykrywanie preferencji systemowych jest trudniejsze niż się spodziewałem" → Aktualizacja (ta sama intencja)
- „Wyślijmy najpierw przełącznik, preferencje dodamy później" → Aktualizacja, potem archiwizacja, potem nowa zmiana

## Najlepsze praktyki

### Utrzymuj zmiany skoncentrowane

Jedna logiczna jednostka pracy na zmianę. Jeśli robisz „dodaj funkcję X i jednocześnie refaktoruj Y", rozważ dwie osobne zmiany.

**Dlaczego to ważne:**
- Łatwiej do przejrzenia i zrozumienia
- Czystsza historia archiwum
- Można wdrożyć niezależnie
- Prostsze wycofanie w razie potrzeby

### Używaj `/opsx:explore` dla niejasnych wymagań

Przed podjęciem zmiany, zbadaj przestrzeń problemu:

```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle rate limiting for our API?

AI:  Let me investigate your current setup and options...
     [Researches codebase, considers patterns]

     I see three approaches we could take:
     1. Middleware-based (simple, per-endpoint)
     2. Redis-backed (scalable, shared state)
     3. Token bucket per user (fair, complex)

     Your current stack suggests #1 or #2. What's your scale?
```

Eksploracja porządkuje myślenie przed utworzeniem artefaktów.

### Weryfikuj przed archiwizacją

Użyj `/opsx:verify`, aby sprawdzić, czy implementacja odpowiada artefaktom:

```text
You: /opsx:verify

AI:  Verifying add-dark-mode...

     ✓ All tasks in tasks.md are checked
     ✓ Requirements in specs have corresponding code
     ✓ Design decisions are reflected in implementation

     Ready to archive!
```

Wyłapuje rozbieżności przed zamknięciem zmiany.

### Nazywaj zmiany jasno

Dobre nazwy sprawiają, że `openspec list` jest użyteczny:

```text
Dobrze:                        Unikaj:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Szybki odniesienie do poleceń

Pełne szczegóły poleceń i opcje znajdziesz w sekcji [Polecenia](commands.md).

| Polecenie | Cel | Kiedy używać |
|-----------|-----|--------------|
| `/opsx:propose` | Utwórz zmianę + artefakty planowania | Szybka domyślna ścieżka (profil `core`) |
| `/opsx:explore` | Przemyśl pomysły | Niejasne wymagania, zbadanie tematu |
| `/opsx:nowy` | Rozpocznij szkielet zmiany | Tryb rozszerzony, jawna kontrola artefaktów |
| `/opsx:continue` | Utwórz następny artefakt | Tryb rozszerzony, tworzenie artefaktów krok po kroku |
| `/opsx:ff` | Utwórz wszystkie artefakty planowania | Tryb rozszerzony, jasny zakres |
| `/opsx:apply` | Wdróż zadania | Gotowy do pisania kodu |
| `/opsx:verify` | Waliduj implementację | Tryb rozszerzony, przed archiwizacją |
| `/opsx:sync` | Scal specyfikacje delta | Tryb rozszerzony, opcjonalnie |
| `/opsx:archive` | Zakończ zmianę | Cała praca zakończona |
| `/opsx:bulk-archive` | Zarchiwizuj wiele zmian | Tryb rozszerzony, praca równoległa |

## Następne kroki

- [Polecenia](commands.md) - Pełna referencja poleceń z opcjami
- [Koncepcje](concepts.md) - Dogłębne omówienie specyfikacji, artefaktów i schematów
- [Dostosowywanie](customization.md) - Tworzenie niestandardowych przepływów pracy