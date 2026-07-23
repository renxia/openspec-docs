# Koncepcje

Ten przewodnik wyjaśnia podstawowe idee stojące za OpenSpec oraz sposób ich wzajemnego powiązania. W celu uzyskania praktycznych informacji dotyczących użycia zobacz [Pierwsze kroki](getting-started.md) i [Przepływy pracy](workflows.md).

## Filozofia

OpenSpec jest oparty na czterech zasadach:

```
płynny a nie sztywny         — brak bram fazowych, pracuj nad tym, co ma sens
iteracyjny a nie kaskadowy — ucz się podczas tworzenia, udoskonalaj w miarę postępów
prosty a nie złożony        — lekka konfiguracja, minimalne formalności
pierwszeństwo dla istniejących systemów        — współpracuje z istniejącymi bazami kodu, a nie tylko z projektami greenfield
```

### Dlaczego te zasady są ważne

**Płynny a nie sztywny.** Tradycyjne systemy specyfikacji zamykają cię w fazach: najpierw planujesz, potem implementujesz, a potem jest koniec. OpenSpec jest znacznie bardziej elastyczny — możesz tworzyć artefakty w dowolnej kolejności, która ma sens w kontekście twojej pracy.

**Iteracyjny a nie kaskadowy.** Wymagania się zmieniają. Zrozumienie pogłębia się. To, co na początku wydawało się dobrym podejściem, może nie sprawdzić się po zapoznaniu się z bazą kodu. OpenSpec akceptuje tę rzeczywistość.

**Prosty a nie złożony.** Niektóre frameworki do tworzenia specyfikacji wymagają rozbudowanej konfiguracji, sztywnych formatów lub ciężkich procesów. OpenSpec nie wchodzi ci w drogę. Inicjalizacja trwa sekundy, możesz od razu rozpocząć pracę, a dostosowywanie jest możliwe tylko wtedy, gdy jest to potrzebne.

**Pierwszeństwo dla istniejących systemów (brownfield).** Większość pracy w zakresie oprogramowania nie polega na budowie od zera — polega na modyfikowaniu istniejących systemów. Podejście OpenSpec oparte na deltach ułatwia określanie zmian w istniejącym zachowaniu, a nie tylko opisywanie nowych systemów (greenfield).

## Ogólny zarys

OpenSpec organizuje Twoją pracę w dwóch głównych obszarach:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source of truth    │◄─────│  Proposed modifications       │   │
│   │  How your system    │ merge│  Each change = one folder     │   │
│   │  currently works    │      │  Contains artifacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specyfikacje (specs)** są źródłem prawdy – opisują, jak Twój system działa obecnie.

**Zmiany (changes)** to proponowane modyfikacje – przechowywane są w oddzielnych folderach, dopóki nie będziesz gotów je scalić.

To rozdzielenie jest kluczowe. Możesz pracować nad wieloma zmianami jednocześnie bez konfliktów. Możesz sprawdzić zmianę zanim wpłynie na główne specyfikacje. A gdy zarchiwizujesz zmianę, jej delta czysto scala się ze źródłem prawdy.

## Specyfikacje (specs)

Specyfikacje opisują zachowanie Twojego systemu za pomocą ustrukturyzowanych wymagań i scenariuszy.

### Struktura

```
openspec/specs/
├── auth/
│   └── spec.md           # Authentication behavior
├── payments/
│   └── spec.md           # Payment processing
├── notifications/
│   └── spec.md           # Notification system
└── ui/
    └── spec.md           # UI behavior and themes
```

Organizuj specyfikacje według domeny – logicznych grup, które mają sens dla Twojego systemu. Typowe wzorce:

- **Według obszaru funkcjonalnego**: `auth/`, `payments/`, `search/`
- **Według komponentu**: `api/`, `frontend/`, `workers/`
- **Według ograniczonego kontekstu**: `ordering/`, `fulfillment/`, `inventory/`

### Format specyfikacji

Specyfikacja zawiera wymagania, a każde wymaganie ma scenariusze:

```markdown
# Auth Specification

## Purpose
Authentication and session management for the application.

## Requirements

### Requirement: User Authentication
The system SHALL issue a JWT token upon successful login.

#### Scenario: Valid credentials
- GIVEN a user with valid credentials
- WHEN the user submits login form
- THEN a JWT token is returned
- AND the user is redirected to dashboard

#### Scenario: Invalid credentials
- GIVEN invalid credentials
- WHEN the user submits login form
- THEN an error message is displayed
- AND no token is issued

### Requirement: Session Expiration
The system MUST expire sessions after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated
- AND the user must re-authenticate
```

**Kluczowe elementy:**

| Element | Cel |
|---------|-----|
| `## Purpose` | Ogólny opis domeny tej specyfikacji |
| `### Requirement:` | Określone zachowanie, jakie system musi mieć |
| `#### Scenario:` | Konkretny przykład działania wymagania |
| SHALL/MUST/SHOULD | Słowa kluczowe RFC 2119 określające siłę wymagania |

### Dlaczego strukturyować specyfikacje w ten sposób

**Wymagania to "co"** – określają, co system powinien robić, bez podawania implementacji.

**Scenariusze to "kiedy"** – dostarczają konkretnych przykładów, które można zweryfikować. Dobre scenariusze:
- Są testowalne (można dla nich napisać test automatyczny)
- Obejmują zarówno ścieżkę szczęśliwą, jak i przypadki brzegowe
- Używają struktury Given/When/Then lub podobnego ustrukturyzowanego formatu

**Słowa kluczowe RFC 2119** (SHALL, MUST, SHOULD, MAY) przekazują intencję:
- **MUST/SHALL** – bezwzględne wymaganie
- **SHOULD** – zalecane, ale istnieją wyjątki
- **MAY** – opcjonalne

### Czym jest (i czym nie jest) specyfikacja

Specyfikacja jest **kontraktem zachowania**, a nie planem implementacji.

Dobra zawartość specyfikacji:
- Obserwowalne zachowanie, na którym polegają użytkownicy lub systemy podrzędne
- Wejścia, wyjścia i warunki błędów
- Zewnętrzne ograniczenia (bezpieczeństwo, prywatność, niezawodność, kompatybilność)
- Scenariusze, które można przetestować lub wyraźnie zweryfikować

Unikaj w specyfikacjach:
- Nazw wewnętrznych klas/funkcji
- Wyboru bibliotek lub frameworków
- Szczegółów implementacji krok po kroku
- Szczegółowych planów wykonania (należą one do plików `design.md` lub `tasks.md`)

Szybki test:
- Jeśli implementacja może ulec zmianie bez zmiany obserwowalnego zewnętrznie zachowania, prawdopodobnie nie należy jej umieszczać w specyfikacji.

### Utrzymuj lekkość: Stopniowa rygorystyczność

OpenSpec ma na celu uniknięcie biurokracji. Używaj najlżejszego poziomu, który nadal sprawia, że zmiana jest weryfikowalna.

**Lekka specyfikacja (domyślna):**
- Krótkie wymagania skupione na zachowaniu
- Jasny zakres i cele nieobjęte pracą
- Kilka konkretnych sprawdzeń akceptacyjnych

**Pełna specyfikacja (dla zmian o wyższym ryzyku):**
- Zmiany międzyzespołowe lub międzyrepozytoryjne
- Zmiany API/kontraktów, migracje, kwestie bezpieczeństwa/prywatności
- Zmiany, w których niejasności mogą spowodować kosztowną ponowną pracę

Większość zmian powinna pozostać w trybie lekkim.

### Współpraca człowieka i agenta

W wielu zespołach ludzie badają problem, a agenci tworzą wstępne wersje artefaktów. Planowany cykl wygląda tak:

1. Człowiek dostarcza intencję, kontekst i ograniczenia.
2. Agent przekształca to w wymagania i scenariusze skupione na zachowaniu.
3. Agent umieszcza szczegóły implementacji w plikach `design.md` i `tasks.md`, a nie w `spec.md`.
4. Walidacja potwierdza strukturę i jasność przed rozpoczęciem implementacji.

Zapewnia to, że specyfikacje są czytelne dla ludzi i spójne dla agentów.

## Zmiany

Zmiana to proponowana modyfikacja Twojego systemu, spakowana jako folder z wszystkim, co potrzebne do zrozumienia i wdrożenia jej.

### Struktura zmiany

```
openspec/changes/add-dark-mode/
├── proposal.md           # Why and what
├── design.md             # How (technical approach)
├── tasks.md              # Implementation checklist
├── .openspec.yaml        # Change metadata (optional): schema, created, skip_specs
└── specs/                # Delta specs
    └── ui/
        └── spec.md       # What's changing in ui/spec.md
```

Każda zmiana jest samodzielna. Zawiera:
- **Artefakty** – dokumenty, które przechwytują intencję, projekt i zadania
- **Delta specyfikacji** – specyfikacje tego, co jest dodawane, modyfikowane lub usuwane
- **Metadane** – opcjonalna konfiguracja dla tej konkretnej zmiany

### Dlaczego zmiany są folderami

Spakowanie zmiany jako folderu ma kilka korzyści:

1. **Wszystko w jednym miejscu.** Propozycja, projekt, zadania i specyfikacje znajdują się w jednym miejscu. Nie trzeba przeszukiwać różnych lokalizacji.
2. **Praca równoległa.** Wiele zmian może istnieć jednocześnie bez konfliktów. Możesz pracować nad `add-dark-mode` podczas gdy `fix-auth-bug` jest również w toku.
3. **Czysta historia.** Gdy zmiana jest archiwizowana, przenosi się do `changes/archive/` z zachowanym pełnym kontekstem. Możesz spojrzeć wstecz i zrozumieć nie tylko to, co się zmieniło, ale dlaczego.
4. **Przyjazne do sprawdzania.** Folder zmiany jest łatwy do sprawdzenia – otwórz go, przeczytaj propozycję, sprawdź projekt, zobacz delta specyfikacji.

## Artefakty

Artefakty to dokumenty w obrębie zmiany, które kierują pracą.

### Przepływ artefaktów

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Artefakty budują się na sobie. Każdy artefakt dostarcza kontekstu dla następnego.

### Typy artefaktów

#### Propozycja (`proposal.md`)

Propozycja przechwytuje **intencję**, **zakres** i **podejście** na wysokim poziomie.

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage and match system preferences.

## Scope
In scope:
- Theme toggle in settings
- System preference detection
- Persist preference in localStorage

Out of scope:
- Custom color themes (future work)
- Per-page theme overrides

## Approach
Use CSS custom properties for theming with a React context
for state management. Detect system preference on first load,
allow manual override.
```

**Kiedy aktualizować propozycję:**
- Zmienia się zakres (zwężanie lub rozszerzanie)
- Intencja się wyjaśnia (lepsze zrozumienie problemu)
- Podejście ulega fundamentalnej zmianie

#### Specyfikacje (delta specyfikacji w folderze `specs/`)

Delta specyfikacji opisują **co się zmienia** względem obecnych specyfikacji. Zobacz sekcję [Delta specyfikacji](#delta-specs) poniżej.

#### Projekt (`design.md`)

Projekt przechwytuje **podejście techniczne** i **decyzje architektoniczne**.

````markdown
# Design: Add Dark Mode

## Technical Approach
Theme state managed via React Context to avoid prop drilling.
CSS custom properties enable runtime switching without class toggling.

## Architecture Decisions

### Decision: Context over Redux
Using React Context for theme state because:
- Simple binary state (light/dark)
- No complex state transitions
- Avoids adding Redux dependency

### Decision: CSS Custom Properties
Using CSS variables instead of CSS-in-JS because:
- Works with existing stylesheet
- No runtime overhead
- Browser-native solution

## Data Flow
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes
- `src/contexts/ThemeContext.tsx` (new)
- `src/components/ThemeToggle.tsx` (new)
- `src/styles/globals.css` (modified)
````

**Kiedy aktualizować projekt:**
- Implementacja ujawnia, że podejście nie zadziała
- Odkryto lepsze rozwiązanie
- Zmieniają się zależności lub ograniczenia

#### Zadania (`tasks.md`)

Zadania to **lista kontrolna implementacji** – konkretne kroki z polami wyboru.

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence
- [ ] 1.4 Add system preference detection

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
- [ ] 3.3 Test contrast ratios for accessibility
```

**Najlepsze praktyki dotyczące zadań:**
- Grupuj powiązane zadania pod nagłówkami
- Używaj numeracji hierarchicznej (1.1, 1.2 itd.)
- Utrzymuj zadania na tyle małe, aby można je było ukończyć w jednej sesji
- Oznaczaj zadania jako wykonane po ich ukończeniu

## Delta specyfikacji

Delta specyfikacji są kluczowym pojęciem, które sprawia, że OpenSpec działa przy rozwoju istniejących systemów (brownfield). Opisują **co się zmienia**, zamiast powtarzać całej specyfikacji.

### Format

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup
- AND the user must verify with a code before activation

#### Scenario: 2FA login
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented
- AND login completes only after valid OTP

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users should re-authenticate each session.)
```

### Sekcje delty

| Sekcja | Znaczenie | Co się dzieje po archiwizacji |
|---------|---------|------------------------|
| `## ADDED Requirements` | Nowe zachowanie | Dołączane do głównej specyfikacji |
| `## MODIFIED Requirements` | Zmienione zachowanie | Zastępuje istniejące wymaganie |
| `## REMOVED Requirements` | Przestarzałe zachowanie | Usuwane z głównej specyfikacji |

### Dlaczego delty zamiast pełnych specyfikacji

**Jasność.** Delta pokazuje dokładnie, co się zmienia. Czytając pełną specyfikację, musiałbyś mentalnie porównać ją z obecną wersją.

**Uniknięcie konfliktów.** Dwie zmiany mogą dotyczyć tego samego pliku specyfikacji bez konfliktów, o ile modyfikują różne wymagania.

**Wydajność sprawdzania.** Osoby sprawdzające widzą zmianę, a nie niezmieniony kontekst. Skupiają się na tym, co ma znaczenie.

**Dopasowanie do rozwoju istniejących systemów (brownfield).** Większość pracy modyfikuje istniejące zachowanie. Delta sprawia, że modyfikacje są traktowane priorytetowo, a nie jako przydatek.

## Schematy

Schematy definiują typy artefaktów i ich zależności dla przepływu pracy.

### Jak działają schematy

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Brak zależności, można utworzyć jako pierwszy

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Wymaga proposal przed utworzeniem

  - id: design
    generates: design.md
    requires: [proposal]      # Można tworzyć równolegle z specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Wymaga zarówno specs, jak i design jako pierwsze
```

**Artefakty tworzą graf zależności:**

```
                    proposal
                   (węzeł główny)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (requires:                  (requires:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (requires:
                specs, design)
```

**Zależności są umożliwiającymi czynnikami, a nie bramami.** Określają, co można utworzyć, a nie co należy utworzyć jako następne. Możesz pominąć etap design, jeśli nie jest potrzebny. Możesz tworzyć specs przed lub po etapie design – oba zależą wyłącznie od proposal.

### Wbudowane schematy

**spec-driven** (domyślny)

Standardowy przepływ pracy dla rozwoju opartego na specyfikacjach (spec-driven):

```
proposal → specs → design → tasks → implement
```

Najlepszy do: Większości prac nad funkcjami, w przypadku których chcesz uzgodnić specyfikacje przed wdrożeniem.

### Niestandardowe schematy

Utwórz niestandardowe schematy dla przepływu pracy swojego zespołu:

```bash
# Utwórz od zera
openspec schema init research-first

# Lub skopiuj istniejący
openspec schema fork spec-driven research-first
```

**Przykładowy niestandardowy schemat:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Najpierw wykonaj badania

  - id: proposal
    generates: proposal.md
    requires: [research]   # Wniosek (proposal) oparty na badaniach

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Pomiń specs/design, przejdź od razu do tasks
```

Pełne informacje o tworzeniu i używaniu niestandardowych schematów znajdziesz w sekcji [Dostosowywanie](customization.md).

## Archiwum

Archiwizacja kończy zmianę przez scalenie jej specyfikacji delta z głównymi specyfikacjami i zachowanie zmiany w celach historycznych.

### Co się dzieje podczas archiwizacji

```
Przed archiwizacją:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ scal
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
        └── 2025-01-24-add-2fa/    # Zachowane w celach historycznych
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Proces archiwizacji

1. **Scal specyfikacje delta.** Każda sekcja specyfikacji delta (ADDED/MODIFIED/REMOVED) jest stosowana do odpowiedniej głównej specyfikacji.
2. **Przenieś do archiwum.** Folder zmiany jest przenoszony do `changes/archive/` z prefiksem daty w celu sortowania chronologicznego.
3. **Zachowaj kontekst.** Wszystkie artefakty pozostają nietknięte w archiwum. Zawsze możesz wrócić do poprzednich wersji, aby zrozumieć, dlaczego wprowadzono daną zmianę.

### Dlaczego archiwizacja jest ważna

**Czysty stan.** Aktywne zmiany (`changes/`) wyświetlają tylko pracę w toku. Ukończona praca jest przenoszona na bok, aby nie przeszkadzała.

**Ślad audytu.** Archiwum zachowuje pełny kontekst każdej zmiany – nie tylko to, co zostało zmienione, ale również proposal wyjaśniający dlaczego, design wyjaśniający jak oraz tasks pokazujące wykonaną pracę.

**Ewolucja specyfikacji.** Specs rozwijają się organicznie podczas archiwizacji zmian. Każda archiwizacja scala jej delta specs, budując z czasem kompleksową specyfikację.

## Jak to wszystko się łączy

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              PRZEPŁYW OPENSPEC                               │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. ROZPOCZNIJ │  /opsx:propose (podstawowy) lub /opsx:new (rozszerzony)  │
│   │     ZMIANĘ     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. UTWÓRZ     │  /opsx:ff lub /opsx:continue (rozszerzony przepływ pracy)│
│   │     ARTEFAKTY  │  Tworzy proposal → specs → design → tasks                │
│   │                │  (na podstawie zależności schematu)                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. WDROŻ      │  /opsx:apply                                            │
│   │     ZADANIA    │  Przejdź przez tasks, oznaczając je jako wykonane        │
│   │                │◄──── Aktualizuj artefakty w miarę zdobywania wiedzy     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. SPRAWDŹ    │  /opsx:verify (opcjonalnie)                             │
│   │     PRACĘ      │  Sprawdź, czy implementacja odpowiada specs              │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIWIZUJ │────►│  Delta specs są scalane z głównymi specs        │    │
│   │     ZMIANĘ     │     │  Folder zmiany jest przenoszony do archive/     │    │
│   └────────────────┘     │  Specs są teraz zaktualizowanym źródłem prawdy  │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Pozytywny cykl:**
1. Specs opisują obecne zachowanie systemu
2. Zmiany proponują modyfikacje (jako delta specs)
3. Implementacja wprowadza zmiany w życie
4. Archiwizacja scala delta specs z głównymi specs
5. Specs opisują teraz nowe zachowanie systemu
6. Następna zmiana buduje na zaktualizowanych specs

## Słowniczek

| Term | Definicja |
|------|-----------|
| **Artefakt** | Dokument w ramach zmiany (proposal, design, tasks lub delta specs) |
| **Archiwizacja** | Proces ukończenia zmiany i scalenia jej delta specs z głównymi specs |
| **Zmiana** | Proponowana modyfikacja systemu, spakowana jako folder z artefaktami |
| **Delta spec** | Specyfikacja opisująca zmiany (ADDED/MODIFIED/REMOVED) względem bieżących specs |
| **Domena** | Logiczna grupa dla specs (np. `auth/`, `payments/`) |
| **Wymaganie** | Określone zachowanie, jakie musi mieć system |
| **Scenariusz** | Konkretny przykład wymagania, zazwyczaj w formacie Given/When/Then |
| **Schemat** | Definicja typów artefaktów i ich zależności |
| **Spec** | Specyfikacja opisująca zachowanie systemu, zawierająca wymagania i scenariusze |
| **Źródło prawdy** | Katalog `openspec/specs/`, zawierający obecne uzgodnione zachowanie systemu |

## Następne kroki

- [Pierwsze kroki](getting-started.md) - Praktyczne pierwsze kroki
- [Przepływy pracy](workflows.md) - Typowe wzorce i wskazówki, kiedy używać każdego z nich
- [Polecenia](commands.md) - Pełna dokumentacja poleceń
- [Dostosowywanie](customization.md) - Tworzenie niestandardowych schematów i konfiguracja projektu