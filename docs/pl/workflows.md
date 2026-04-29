# Przepływy pracy

Ten przewodnik omawia typowe wzorce przepływów pracy w OpenSpec oraz kiedy stosować każdy z nich. Informacje na temat podstawowej konfiguracji znajdziesz w sekcji [Pierwsze kroki](getting-started.md). Odnośnik do poleceń znajduje się w sekcji [Polecenia](commands.md).

## Filozofia: Działania, nie fazy

Tradycyjne przepływy pracy wymuszają przejście przez fazy: planowanie, następnie realizacja, a na końcu gotowe. Ale prawdziwa praca nie mieści się w tak sztywnych ramach.

OPSX przyjmuje inne podejście:

```text
Tradycyjne (zablokowane fazy):

  PLANOWANIE ────────► REALIZACJA ────────► GOTOWE
      │                    │
      │   "Nie można wrócić"  │
      └────────────────────┘

OPSX (płynne działania):

  propozycja ──► specyfikacje ──► projekt ──► zadania ──► realizacja
```

**Kluczowe zasady:**

- **Działania, nie fazy** - Polecenia to rzeczy, które możesz zrobić, a nie etapy, w których utknąłeś
- **Zależności to ułatwienia** - Pokazują, co jest możliwe, a nie co jest wymagane dalej

> **Dostosowywanie:** Przepływy pracy OPSX są napędzane przez schematy definiujące sekwencje artefaktów. Szczegóły dotyczące tworzenia niestandardowych schematów znajdziesz w sekcji [Dostosowywanie](customization.md).

## Dwa tryby

### Domyślna szybka ścieżka (profil `core`)

Nowe instalacje domyślnie używają profilu `core`, który zapewnia:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:archive`

Typowy przepływ:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:archive
```

### Rozszerzony/Pełny przepływ (niestandardowy wybór)

Jeśli chcesz显式使用 explicit scaffold-and-build commands (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), włącz je za pomocą:

```bash
openspec config profile
openspec update
```

## Wzorce przepływu (tryb rozszerzony)

### Szybka funkcja

Kiedy wiesz, co chcesz zbudować i potrzebujesz tylko wykonać:

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

**Najlepsze dla:** Małych do średnich funkcji, poprawek błędów, prostych zmian.

### Eksploracyjne

Kiedy wymagania są niejasne lub musisz najpierw zbadać problem:

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

**Najlepsze dla:** Optymalizacji wydajności, debugowania, decyzji architektonicznych, niejasnych wymagań.

### Zmiany równoległe

Praca nad wieloma zmianami jednocześnie:

```text
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in progress)
                                         │
                                    context switch
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
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

**Najlepsze dla:** Równoległych strumieni pracy, pilnych przerw, współpracy w zespole.

Kiedy masz wiele ukończonych zmian, użyj `/opsx:bulk-archive`:

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

Masowa archiwizacja wykrywa, kiedy wiele zmian dotyczy tych samych specyfikacji i rozwiązuje konflikty, sprawdzając, co faktycznie zostało zaimplementowane.

### Finalizacja zmiany

Zalecany przepływ finalizacji:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              validates          prompts to sync
              implementation     if needed
```

#### Weryfikacja: Sprawdź swoją pracę

`/opsx:verify` waliduje implementację względem twoich artefaktów w trzech wymiarach:

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
|-----------|------------------|
| Kompletność | Wszystkie zadania wykonane, wszystkie wymagania zaimplementowane, scenariusze uwzględnione |
| Prawidłowość | Implementacja odpowiada intencji specyfikacji, obsłużone przypadki brzegowe |
| Spójność | Decyzje projektowe odzwierciedlone w kodzie, wzorce spójne |

Weryfikacja nie zablokuje archiwizacji, ale ujawnia problemy, które możesz chcieć najpierw rozwiązać.

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

Archiwizacja zapyta, jeśli specyfikacje nie są zsynchronizowane. Nie zablokuje niekompletnych zadań, ale cię ostrzeże.

## Kiedy używać czego

### `/opsx:ff` vs `/opsx:continue`

| Sytuacja | Użyj |
|-----------|-----|
| Jasne wymagania, gotowy do budowania | `/opsx:ff` |
| Eksploracja, chcesz przeglądać każdy krok | `/opsx:continue` |
| Chcesz iterować propozycję przed specyfikacjami | `/opsx:continue` |
| Presja czasu, trzeba działać szybko | `/opsx:ff` |
| Złożona zmiana, chcesz kontroli | `/opsx:continue` |

**Zasada:** Jeśli możesz opisać pełny zakres z góry, użyj `/opsx:ff`. Jeśli odkrywasz go w trakcie, użyj `/opsx:continue`.

### Kiedy aktualizować vs zaczynać od nowa

Częste pytanie: kiedy aktualizacja istniejącej zmiany jest w porządku, a kiedy powinieneś zacząć nową?

**Aktualizuj istniejącą zmianę, gdy:**

- Ta sama intencja, dopracowane wykonanie
- Zakres się zawęża (najpierw MVP, reszta później)
- Korekty wynikające z nauki (kod jest inny niż oczekiwano)
- Drobne zmiany projektowe na podstawie odkryć implementacyjnych

**Zacznij nową zmianę, gdy:**

- Intencja fundamentalnie się zmieniła
- Zakres eksplodował na zupełnie inną pracę
- Oryginalna zmiana może być oznaczona jako "zrobiona" samodzielnie
- Łatki bardziej mylą niż wyjaśniają

```text
                     ┌─────────────────────────────────────┐
                     │     Is this the same work?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Same intent?      >50% overlap?      Can original
          Same problem?     Same scope?        be "done" without
                 │                  │          these changes?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      YES               NO YES           NO  NO              YES
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    UPDATE            NEW  UPDATE       NEW  UPDATE          NEW
```

**Przykład: "Dodaj tryb ciemny"**

- "Trzeba też obsługiwać niestandardowe motywy" → Nowa zmiana (eksplozja zakresu)
- "Wykrywanie preferencji systemowych jest trudniejsze niż oczekiwano" → Aktualizacja (ta sama intencja)
- "Najpierw włączmy przełącznik, preferencje dodamy później" → Aktualizacja, archiwizacja, potem nowa zmiana

## Najlepsze praktyki

### Utrzymuj zmiany skupione

Jedna logiczna jednostka pracy na zmianę. Jeśli robisz "dodaj funkcję X i refactoruj Y", rozważ dwie osobne zmiany.

**Dlaczego to ważne:**
- Łatwiejsza do przeglądania i zrozumienia
- Czystsza historia archiwum
- Może być wdrożona niezależnie
- Prostszy rollback w razie potrzeby

### Używaj `/opsx:explore` dla niejasnych wymagań

Przed zaangażowaniem się w zmianę, zbadaj przestrzeń problemu:

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

Eksploracja澄清思路 zanim stworzysz artefakty.

### Weryfikuj przed archiwizacją

Używaj `/opsx:verify`, aby sprawdzić, czy implementacja odpowiada artefaktom:

```text
You: /opsx:verify

AI:  Verifying add-dark-mode...

     ✓ All tasks in tasks.md are checked
     ✓ Requirements in specs have corresponding code
     ✓ Design decisions are reflected in implementation

     Ready to archive!
```

Wykrywa rozbieżności przed zamknięciem zmiany.

### Nazwy zmian powinny być jasne

Dobre nazwy sprawiają, że `openspec list` jest użyteczne:

```text
Good:                          Avoid:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Szybki przegląd poleceń

Szczegółowe informacje o poleceniach i ich opcjach znajdziesz w sekcji [Polecenia](commands.md).

| Polecenie | Cel | Kiedy używać |
|-----------|-----|--------------|
| `/opsx:propose` | Tworzenie zmiany i artefaktów planowania | Szybka domyślna ścieżka (profil `core`) |
| `/opsx:explore` | Przemyślenie pomysłów | Niejasne wymagania, badanie |
| `/opsx:new` | Rozpoczęcie szkieletu zmiany | Tryb rozszerzony, jawna kontrola artefaktów |
| `/opsx:continue` | Tworzenie następnego artefaktu | Tryb rozszerzony, tworzenie artefaktów krok po kroku |
| `/opsx:ff` | Tworzenie wszystkich artefaktów planowania | Tryb rozszerzony, jasny zakres |
| `/opsx:apply` | Implementacja zadań | Gotowość do pisania kodu |
| `/opsx:verify` | Walidacja implementacji | Tryb rozszerzony, przed archiwizacją |
| `/opsx:sync` | Scalanie specyfikacji delta | Tryb rozszerzony, opcjonalne |
| `/opsx:archive` | Zakończenie zmiany | Cała praca zakończona |
| `/opsx:bulk-archive` | Archiwizacja wielu zmian | Tryb rozszerzony, praca równoległa |

## Kolejne kroki

- [Polecenia](commands.md) - Pełna referencja poleceń z opcjami
- [Koncepcje](concepts.md) - Szczegółowe omówienie specyfikacji, artefaktów i schematów
- [Dostosowywanie](customization.md) - Tworzenie niestandardowych przepływów pracy