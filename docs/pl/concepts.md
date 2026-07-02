# Koncepcje

Ten przewodnik wyjaśnia podstawowe idee OpenSpec i to, jak one się ze sobą łączą. Do praktycznego użytkowania zobacz [Getting Started](getting-started.md) oraz [Workflows](workflows.md).

## Filozofia

OpenSpec opiera się na czterech zasadach:

```
fluid not rigid         — no phase gates, work on what makes sense
iterative not waterfall — learn as you build, refine as you go
easy not complex        — lightweight setup, minimal ceremony
brownfield-first        — works with existing codebases, not just greenfield
```

### Dlaczego te zasady są ważne

**Fluid not rigid.** Tradycyjne systemy specyfikacji zmuszają Cię do przestrzegania faz: najpierw planujesz, potem implementujesz, a na koniec kończysz. OpenSpec jest bardziej elastyczny — możesz tworzyć artefakty w dowolnej kolejności, która ma sens dla Twojej pracy.

**Iterative not waterfall.** Wymagania się zmieniają. Zrozumienie pogłębia się. To, co wydawało się dobrym podejściem na początku, może nie wytrzymać po przejrzeniu codebase. OpenSpec akceptuje tę rzeczywistość.

**Easy not complex.** Niektóre frameworki do specyfikacji wymagają rozbudowanego setupu, sztywnych formatów lub ciężkich procesów. OpenSpec nie przeszkadza. Zainicjuj w kilka sekund, zacznij pracę natychmiast, dostosowując tylko wtedy, gdy jest to konieczne.

**Brownfield-first.** Większość pracy nad oprogramowaniem nie polega na budowaniu od zera – polega na modyfikowaniu istniejących systemów. Podejście OpenSpec oparte na delta (delta-based approach) ułatwia określanie zmian w istniejącym zachowaniu, a nie tylko opisywanie nowych systemów.

## Całościowy Obraz

OpenSpec organizuje Twoją pracę w dwa główne obszary:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Źródło prawdy     │◄─────│    Proponowane modyfikacje      │   │
│   │  Jak działa Twój system │      │  Każda zmiana = jeden folder  │   │
│   │                     │      │  Zawiera artefakty + delty  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** to źródło prawdy — opisują one, jak obecnie działa Twój system.

**Changes** są proponowanymi modyfikacjami — znajdują się w oddzielnych folderach do momentu ich scalenia.

To rozdzielenie jest kluczowe. Możesz pracować nad wieloma zmianami równolegle bez konfliktów. Możesz przejrzeć daną zmianę, zanim wpłynie ona na główne specsy. A gdy zarchiwizujesz zmianę, jej delty płynnie integrują się ze źródłem prawdy.

## Specs

Specs opisują zachowanie Twojego systemu, używając ustrukturyzowanych wymagań i scenariuszy.

### Struktura

```
openspec/specs/
├── auth/
│   └── spec.md           # Zachowanie uwierzytelniania
├── payments/
│   └── spec.md           # Przetwarzanie płatności
├── notifications/
│   └── spec.md           # System powiadomień
└── ui/
    └── spec.md           # Zachowanie UI i motywy
```

Organizuj specs według domeny — logicznych grupowań, które mają sens dla Twojego systemu. Typowe wzorce:

- **Według obszaru funkcjonalnego**: `auth/`, `payments/`, `search/`
- **Według komponentu**: `api/`, `frontend/`, `workers/`
- **Według ograniczonego kontekstu (bounded context)**: `ordering/`, `fulfillment/`, `inventory/`

### Format Specyfikacji

Spec zawiera wymagania, a każde wymaganie ma scenariusze:

```markdown
# Specyfikacja Auth

## Cel (Purpose)
Uwierzytelnianie i zarządzanie sesjami dla aplikacji.

## Wymagania

### Wymaganie: Uwierzytelnianie użytkownika
System POWINIEN BEZWARUNKOWO wydać token JWT po pomyślnym zalogowaniu.

#### Scenariusz: Prawidłowe dane uwierzytelniające
- ZAŁOŻONO, że użytkownik posiada prawidłowe dane uwierzytelniające
- GDY użytkownik przesyła formularz logowania
- Wtedy zwrócony jest token JWT
- I użytkownik zostaje przekierowany na pulpit nawigacyjny

#### Scenariusz: Nieprawidłowe dane uwierzytelniające
- ZAŁOŻONO, że dane uwierzytelniające są nieprawidłowe
- GDY użytkownik przesyła formularz logowania
- Wtedy wyświetlany jest komunikat o błędzie
- I żaden token nie zostaje wydany

### Wymaganie: Wygaśnięcie sesji
System MUSI wygaszać sesje po 30 minutach bezczynności.

#### Scenariusz: Timeout bezczynności
- ZAŁOŻONO, że istnieje uwierzytelniona sesja
- GDY miną 30 minut bez aktywności
- Wtedy sesja zostaje unieważniona
- I użytkownik musi ponownie się zalogować
```

**Kluczowe elementy:**

| Element | Cel |
|---------|---------|
| `## Purpose` | Wysokopoziomowy opis domeny tej specyfikacji |
| `### Requirement:` | Konkretne zachowanie, które system musi posiadać |
| `#### Scenario:` | Konkretny przykład danego wymagania w działaniu |
| SHALL/MUST/SHOULD | Słowa kluczowe RFC 2119 wskazujące siłę wymogu |

### Dlaczego tak skonstruować Specsy

**Wymagania to „co”** — określają, co system powinien zrobić, bez specyfikowania implementacji.

**Scenariusze to „kiedy”** — dostarczają konkretnych przykładów, które można zweryfikować. Dobre scenariusze:
- Są testowalne (można dla nich napisać automatyczny test)
- Obejmują zarówno ścieżkę szczęśliwą (happy path), jak i przypadki brzegowe (edge cases)
- Używają formatu Given/When/Then lub podobnego

**Słowa kluczowe RFC 2119** (SHALL, MUST, SHOULD, MAY) komunikują intencję:
- **MUST/SHALL** — absolutny wymóg
- **SHOULD** — zalecany, ale istnieją wyjątki
- **MAY** — opcjonalny

### Czym jest Specyfikacja (a czym nie jest)

Specyfikacja to **kontrakt behawioralny**, a nie plan implementacji.

Dobra zawartość specyfikacji:
- Obserwowalne zachowanie, na którym polegają użytkownicy lub systemy docelowe
- Dane wejściowe, dane wyjściowe i warunki błędów
- Zewnętrzne ograniczenia (bezpieczeństwo, prywatność, niezawodność, kompatybilność)
- Scenariusze, które mogą być przetestowane lub wyraźnie zweryfikowane

Czego unikać w specyfikacjach:
- Wewnętrzne nazwy klasy/funkcji
- Wybory bibliotek czy frameworków
- Szczegółowe szczegóły implementacji krok po kroku
- Szczegółowe plany wykonania (one należą do `design.md` lub `tasks.md`)

Szybki test:
- Jeśli implementacja może się zmienić bez zmiany zewnętrznie widocznego zachowania, prawdopodobnie nie należy tego włączać do specyfikacji.

### Utrzymuj Lekkość: Progresywna Rygorystyczność (Progressive Rigor)

OpenSpec dąży do unikania biurokracji. Używaj najniższego poziomu, który nadal umożliwia weryfikację zmiany.

**Lite spec (domyślny):**
- Krótkie wymagania zorientowane na zachowanie
- Jasny zakres i cele, których nie należy realizować (non-goals)
- Kilka konkretnych kontroli akceptacji

**Full spec (dla wyższego ryzyka):**
- Zmiany między zespołami lub repozytoriami
- Zmiany API/kontraktów, migracje, obawy dotyczące bezpieczeństwa/prywatności
- Zmiany, w których niejasność może prowadzić do kosztownej odbudowy

Większość zmian powinna pozostać w trybie Lite.

### Współpraca Człowiek + Agent

W wielu zespołach ludzie eksplorują, a agenci tworzą artefakty. Zamierzony cykl wygląda następująco:

1. Człowiek dostarcza intencję, kontekst i ograniczenia.
2. Agent przekształca to w wymagania zorientowane na zachowanie i scenariusze.
3. Agent przechowuje szczegóły implementacji w `design.md` i `tasks.md`, a nie w `spec.md`.
4. Walidacja potwierdza strukturę i jasność przed implementacją.

Pozwala to, aby specsy były czytelne dla ludzi i spójne dla agentów.

## Changes

Change jest proponowaną modyfikacją Twojego systemu, zapakowaną jako folder zawierający wszystko, co niezbędne do zrozumienia i wdrożenia jej.

### Struktura Zmiany

```
openspec/changes/add-dark-mode/
├── proposal.md           # Dlaczego i co
├── design.md             # Jak (podejście techniczne)
├── tasks.md              # Lista kontrolna implementacji
├── .openspec.yaml        # Metadane zmiany (opcjonalnie)
└── specs/                # Specyfikacje delta
    └── ui/
        └── spec.md       # Co zmienia się w ui/spec.md
```

Każda zmiana jest samowystarczalna. Posiada:
- **Artefakty** — dokumenty, które opisują intencję, projekt i zadania
- **Delta specs** — specyfikacje dotyczące tego, co jest dodawane, modyfikowane lub usuwane
- **Metadane** — opcjonalna konfiguracja dla tej konkretnej zmiany

### Dlaczego Zmiany Są Folderami

Pakowanie zmiany jako folder niesie ze sobą wiele korzyści:

1. **Wszystko w jednym miejscu.** Propozycja, projekt, zadania i specsy znajdują się w jednym miejscu. Nie trzeba szukać w różnych lokalizacjach.

2. **Praca równoległa.** Wiele zmian może istnieć jednocześnie bez konfliktów. Pracuj nad `add-dark-mode`, podczas gdy `fix-auth-bug` jest również w trakcie realizacji.

3. **Czysta historia.** Po archiwizacji zmiany przenosi się do `changes/archive/`, zachowując pełny kontekst. Możesz cofnąć się i zrozumieć nie tylko co zostało zmienione, ale też dlaczego.

4. **Przyjazne dla recenzji.** Folder zmiany jest łatwy do przejścia — otwórz go, przeczytaj propozycję, sprawdź projekt, zobacz delty specsów.

## Artefakty

Artefakty to dokumenty w ramach zmiany, które kierują pracą.

### Przepływ Artefaktów

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   dlaczego        co           jak          kroki do wykonania
 + zakres       zmiany      podejście     do zrealizowania
```

Artefakty budują na sobie. Każdy artefakt dostarcza kontekst dla kolejnego.

### Typy Artefaktów

#### Propozycja (`proposal.md`)

Propozycja opisuje **intencję**, **zakres** i **podejście** na wysokim poziomie.

```markdown
# Propozycja: Dodanie trybu ciemnego

## Intencja (Intent)
Użytkownicy poprosili o opcję trybu ciemnego, aby zmniejszyć zmęczenie oczu podczas użytkowania w nocy i dopasować się do preferencji systemu.

## Zakres (Scope)
W zakresie:
- Przełącznik motywu w ustawieniach
- Wykrywanie preferencji systemu
- Utrzymywanie preferencji w localStorage

Poza zakresem:
- Spersonalizowane motywy kolorów (praca przyszła)
- Nadpisywanie motywów na poziomie strony

## Podejście (Approach)
Użycie niestandardowych właściwości CSS do tematyzacji z kontekstem React do zarządzania stanem. Wykrycie preferencji systemu przy pierwszym załadowaniu, zezwolenie na ręczne nadpisanie.
```

**Kiedy aktualizować propozycję:**
- Zmiany w zakresie (ograniczenie lub rozszerzenie)
- Uściślenie intencji (lepsze zrozumienie problemu)
- Fundamentalna zmiana podejścia

#### Specsy (delta specs w `specs/`)

Delta specs opisują **co się zmienia** w stosunku do obecnych specyfikacji. Zobacz poniżej [Delta Specs](#delta-specs).

#### Projekt (`design.md`)

Projekt opisuje **podejście techniczne** i **decyzje architektoniczne**.

````markdown
# Projekt: Dodanie trybu ciemnego

## Podejście Techniczne (Technical Approach)
Stan motywu zarządzany za pomocą Context React, aby uniknąć prop drilling. Niestandardowe właściwości CSS umożliwiają przełączanie w czasie rzeczywistym bez przełączania klas.

## Decyzje Architektoniczne (Architecture Decisions)

### Decyzja: Context zamiast Redux
Użycie Context React dla stanu motywu, ponieważ:
- Prosty stan binarny (jasny/ciemny)
- Brak skomplikowanych przejść stanu
- Unikanie dodawania zależności Redux

### Decyzja: Niestandardowe Właściwości CSS
Użycie zmiennych CSS zamiast CSS-in-JS, ponieważ:
- Działa z istniejącym arkuszem stylów
- Brak narzutu w czasie wykonania (runtime overhead)
- Rozwiązanie natywne dla przeglądarki

## Przepływ Danych (Data Flow)
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (zaaplikowane do :root)
```

## Zmiany Plików (File Changes)
- `src/contexts/ThemeContext.tsx` (nowy)
- `src/components/ThemeToggle.tsx` (nowy)
- `src/styles/globals.css` (zmodyfikowany)
````

**Kiedy aktualizować projekt:**
- Implementacja ujawnia, że podejście nie zadziała
- Odkrycie lepszego rozwiązania
- Zmiana zależności lub ograniczeń

#### Zadania (`tasks.md`)

Zadania to **lista kontrolna implementacji** — konkretne kroki z checklistami.

```markdown
# Zadania

## 1. Infrastruktura Motywu
- [ ] 1.1 Utworzenie ThemeContext ze stanem jasny/ciemny
- [ ] 1.2 Dodanie niestandardowych właściwości CSS dla kolorów
- [ ] 1.3 Implementacja trwałości w localStorage
- [ ] 1.4 Dodanie wykrywania preferencji systemu

## 2. Komponenty UI
- [ ] 2.1 Utworzenie komponentu ThemeToggle
- [ ] 2.2 Dodanie przełącznika do strony ustawień
- [ ] 2.3 Aktualizacja nagłówka, aby zawierał szybki przełącznik

## 3. Stylizacja
- [ ] 3.1 Określenie palety kolorów dla ciemnego motywu
- [ ] 3.2 Aktualizacja komponentów w celu używania zmiennych CSS
- [ ] 3.3 Testowanie współczynników kontrastu pod kątem dostępności
```

**Najlepsze praktyki dotyczące zadań:**
- Grupowanie powiązanych zadań pod nagłówkami
- Używanie numeracji hierarchicznej (1.1, 1.2 itd.)
- Utrzymywanie zadań na tyle małych, aby można je ukończyć w jednej sesji
- Odznaczanie zadań po ich wykonaniu

## Delta Specsy

Delta specs to kluczowe pojęcie, które sprawia, że OpenSpec działa dla rozwoju systemów istniejących (brownfield development). Opisują **co się zmienia**, zamiast powtarzać całą specyfikację.

### Format

```markdown
# Delta dla Auth

## DODANE Wymagania

### Wymaganie: Uwierzytelnianie dwuskładnikowe (Two-Factor Authentication)
System MUSI obsługiwać uwierzytelnianie dwuskładnikowe oparte na TOTP.

#### Scenariusz: Rejestracja 2FA
- ZAŁOŻONO, że użytkownik nie ma włączonego 2FA
- GDY użytkownik włącza 2FA w ustawieniach
- Wtedy wyświetlany jest kod QR do konfiguracji aplikacji uwierzytelniającej
- I użytkownik musi zweryfikować się za pomocą kodu przed aktywacją

#### Scenariusz: Logowanie z 2FA
- ZAŁOŻONO, że użytkownik ma włączone 2FA
- GDY użytkownik przesyła prawidłowe dane uwierzytelniające
- Wtedy prezentowane jest wyzwanie OTP
- I logowanie kończy się dopiero po podaniu poprawnego OTP

## ZMIENIONE Wymagania

### Wymaganie: Wygaśnięcie sesji
System MUSI wygaszać sesje po 15 minutach bezczynności.
(Wcześniej: 30 minut)

#### Scenariusz: Timeout bezczynności
- ZAŁOŻONO, że istnieje uwierzytelniona sesja
- GDY minie 15 minut bez aktywności
- Wtedy sesja zostaje unieważniona

## USUNIĘTE Wymagania

### Wymaganie: Pamiętaj mnie (Remember Me)
(Przestarzałe na rzecz 2FA. Użytkownicy powinni ponownie się zalogować za każdą sesję.)
```

### Sekcje Delta

| Sekcja | Znaczenie | Co dzieje się po archiwizacji |
|---------|---------|-----------------------------|
| `## DODANE Wymagania` | Nowe zachowanie | Dołączane do głównej specyfikacji |
| `## ZMIENIONE Wymagania` | Zmienione zachowanie | Zastępuje istniejące wymaganie |
| `## USUNIĘTE Wymagania` | Przestarzałe zachowanie | Usuwane z głównej specyfikacji |

### Dlaczego Deltas zamiast Pełnych Specyfikacji

**Jasność.** Delta pokazuje dokładnie, co się zmienia. Czytając pełną specyfikację, musiałbyś mentalnie porównywać ją z obecną wersją.

**Unikanie konfliktów.** Dwie zmiany mogą dotykać tego samego pliku specyfikacji bez konfliktu, pod warunkiem, że modyfikują różne wymagania.

**Efektywność recenzji.** Recenzenci widzą zmianę, a nie niezmieniony kontekst. Skupiają się na tym, co jest istotne.

**Dopasowanie do systemów istniejących (Brownfield fit).** Większość pracy polega na modyfikowaniu istniejącego zachowania. Deltas sprawiają, że modyfikacje są klasą pierwszą, a nie czymś, co przychodzi na końcu.

## Schemasy

Schemas definiują typy artefaktów i ich zależności dla przepływu pracy (workflow).

### Jak działają Schematy

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Brak zależności, może być stworzony jako pierwszy

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Wymaga proposal przed utworzeniem

  - id: design
    generates: design.md
    requires: [proposal]      # Może być tworzony równolegle z specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Wymaga zarówno specs, jak i design
```

**Artefakty tworzą graf zależności:**

```
                    proposal
                   (główny węzeł)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (wymaga:                  (wymaga:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (wymaga:
                specs, design)
```

**Zależności są umożliwiajączeniami (enablers), a nie bramami.** Pokazują, co jest możliwe do stworzenia, a nie co musisz stworzyć jako następne. Możesz pominąć design, jeśli go nie potrzebujesz. Możesz utworzyć specs przed lub po designie — oba zależą tylko od proposal.

### Wbudowane Schematy

**spec-driven** (domyślny)

Standardowy przepływ pracy dla rozwoju opartego na specyfikacji:

```
proposal → specs → design → tasks → implement
```

Najlepsze do: Większości prac funkcjonalnych, w których chcesz zgodzić się na specyfikacje przed implementacją.

### Niestandardowe Schematy (Custom Schemas)

Utwórz niestandardowe schematy dla swojego zespołu:

```bash
# Utworzenie od podstaw
openspec schema init research-first

# Lub forkowanie istniejącego
openspec schema fork spec-driven research-first
```

**Przykład niestandardowego schematu:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Najpierw przeprowadź badania

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal oparty na badaniach

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Pomijamy specs/design, przechodzimy bezpośrednio do zadań
```

Zobacz [Customization](customization.md) po pełne szczegóły dotyczące tworzenia i używania niestandardowych schematów.

## Archiwizacja (Archive)

Archiwizacja kończy zmianę poprzez scalenie jej delta-specyfikacji z głównymi specyfikacjami, zachowując jednocześnie tę zmianę dla historii.

### Co dzieje się podczas archiwizacji

```
Przed archiwizacją:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ scalenie (merge)
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Po archiwizacji:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Teraz zawiera wymagania dotyczące 2FA
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Zachowane dla historii
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Proces archiwizacji

1. **Scalenie delt.** Każda sekcja delta-specyfikacji (DODANE/ZMIEŃCZONE/USUCONE) jest aplikowana do odpowiadającej głównej specyfikacji.
2. **Przeniesienie do archiwum.** Folder zawierający zmianę przenosi się do `changes/archive/` z prefiksem daty, aby zapewnić porządek chronologiczny.
3. **Zachowanie kontekstu.** Wszystkie artefakty pozostają nienaruszone w archiwum. Zawsze możesz cofnąć się, aby zrozumieć, dlaczego dokonano danej zmiany.

### Dlaczego Archwizacja jest Ważna

**Czysty stan.** Aktywne zmiany (`changes/`) pokazują tylko pracę w toku. Ukończona praca zostaje przeniesiona poza ten obszar.

**Ślad audytowy (Audit trail).** Archiwum zachowuje pełny kontekst każdej zmiany — nie tylko co się zmieniło, ale także proposal wyjaśniający dlaczego, design wyjaśniający jak i zadania pokazujące wykonaną pracę.

**Ewolucja specyfikacji.** Specyfikacje rozwijają się organicznie w miarę archiwizowania zmian. Każde archiwum scalia swoje delty, budując kompleksową specyfikację na przestrzeni czasu.

## Jak to wszystko działa razem

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (core) lub /opsx:new (expanded)           │
│   │     CHANGE     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREATE     │  /opsx:ff lub /opsx:continue (expanded workflow)         │
│   │     ARTIFACTS  │  Tworzy proposal → specs → design → tasks              │
│   │                │  (oparte na zależnościach schematu)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENT  │  /opsx:apply                                            │
│   │     TASKS      │  Pracowanie nad zadaniami, odznaczanie ich                  │
│   │                │◄──── Aktualizowanie artefaktów w miarze nauki                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFY     │  /opsx:verify (opcjonalne)                                │
│   │     WORK       │  Sprawdzenie, czy implementacja odpowiada specyfikacjom      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVE    │────►│  Delta-specyfikacje scalane z głównymi specyfikacjami │    │
│   │     CHANGE     │     │  Folder zmiany przenoszony do archive/             │    │
│   └────────────────┘     │  Specyfikacje są teraz aktualnym źródłem prawdy (source of truth)   │    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Cnotliwy cykl:**

1. Specs opisują obecne zachowanie.
2. Zmiany proponują modyfikacje (jako delty).
3. Implementacja realizuje zmiany.
4. Archiwizacja scalia delty z głównymi specyfikacjami.
5. Specs opisują nowe zachowanie.
6. Następna zmiana opiera się na zaktualizowanych specsach.

## Słowniczek (Glossary)

| Termin | Definicja |
|------|------------|
| **Artifact** | Dokument w ramach zmiany (proposal, design, tasks lub delta specs) |
| **Archive** | Proces kończenia zmiany i scalania jej delt z głównymi specyfikacjami |
| **Change** | Proponowana modyfikacja systemu, spakowana jako folder zawierający artefakty |
| **Delta spec** | Specyfikacja opisująca zmiany (DODANE/ZMIEŃCZONE/USUCONE) względem obecnych specsów |
| **Domain** | Logiczna grupa dla specyfikacji (np. `auth/`, `payments/`) |
| **Requirement** | Konkretne zachowanie, jakie musi posiadać system |
| **Scenario** | Konkretny przykład wymagania, zazwyczaj w formacie Given/When/Then |
| **Schema** | Definicja typów artefaktów i ich zależności |
| **Spec** | Specyfikacja opisująca zachowanie systemu, zawierająca wymagania i scenariusze |
| **Source of truth** | Katalog `openspec/specs/`, zawierający aktualnie uzgodnione zachowanie |

## Następne Kroki (Next Steps)

- [Getting Started](getting-started.md) - Praktyczne pierwsze kroki
- [Workflows](workflows.md) - Typowe wzorce i kiedy ich używać
- [Commands](commands.md) - Pełna referencja poleceń
- [Customization](customization.md) - Tworzenie niestandardowych schematów i konfiguracja projektu