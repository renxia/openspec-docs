# Pierwsze kroki

Ten przewodnik wyjaśnia, jak działa OpenSpec po jego zainstalowaniu i zainicjowaniu. Instrukcje instalacji znajdziesz w [głównym pliku README](../index.md#quick-start) lub w [przewodniku po instalacji](installation.md). Nowy w zestawie dokumentacji? [Strona główna dokumentacji](index.md) zawiera mapę wszystkiego.

> **Gdzie wpisuję te polecenia?** W dwóch miejscach, a ich pomyłka to najczęstszy wczesny błąd.
>
> - Polecenia `openspec ...` (np. `openspec init`) uruchamia się w **terminalu**.
> - Polecenia `/opsx:...` (np. `/opsx:propose`) uruchamia się w **czacie asystenta AI**, w tym samym polu, w którym poprosiłbyś go o napisanie kodu.
>
> Nie ma osobnego "trybu interaktywnego" do uruchomienia. Po prostu wpisujesz polecenie z ukośnikiem w czacie, a asystent robi resztę. Pełne wyjaśnienie: [Jak działają polecenia](how-commands-work.md).

## Twoje pierwsze pięć minut

Pętla w całości, z każdym krokiem oznaczonym miejscem jego wystąpienia:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (opcjonalne: najpierw to przemyśl)
AI CHAT      /opsx:propose add-dark-mode      (AI przygotowuje plan; ty go przeglądasz)
AI CHAT      /opsx:apply                      (AI to buduje)
AI CHAT      /opsx:archive                    (specyfikacje zaktualizowane, zmiana zarchiwizowana)
```

Dwa kroki w terminalu, aby skonfigurować, a potem pracujesz w czacie. Reszta tego przewodnika wyjaśnia, co robi każdy krok i co zobaczysz.

> **Nie jesteś jeszcze pewien, co zbudować? Zacznij od `/opsx:explore`.** To partner do myślenia bez ryzyka, który czyta twoją bazę kodu, rozważa opcje i doprecyzowuje mglistą ideę w konkretny plan, wszystko zanim jakikolwiek artefakt lub kod powstanie. Kiedy obraz jest jasny, przekazuje do `/opsx:propose`. To najlepszy nawyk przy pracy z AI, które w przeciwnym razie z pewnością zbuduje coś złego. Zobacz [przewodnik po eksploracji](explore.md).

## Jak to działa

OpenSpec pomaga tobie i twojemu asystentowi kodowania AI uzgodnić, co zbudować, zanim jakikolwiek kod zostanie napisany.

**Domyślna szybka ścieżka (profil core):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (opcjonalne)
```

Zacznij od `/opsx:explore`, gdy zastanawiasz się, co robić, lub przejdź od razu do `/opsx:propose`, gdy już wiesz. Explore jest w domyślnym profilu, więc zawsze jest dostępny, gdy go potrzebujesz.

**Rozszerzona ścieżka (niestandardowy wybór przepływu pracy):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Domyślnym profilem globalnym jest `core`, który zawiera `propose`, `explore`, `apply`, `sync` i `archive`. Możesz włączyć rozszerzone polecenia przepływu pracy za pomocą `openspec config profile`, a następnie `openspec update`.

## Co tworzy OpenSpec

Po uruchomieniu `openspec init`, twój projekt ma następującą strukturę:

```
openspec/
├── specs/              # Źródło prawdy (zachowanie twojego systemu)
│   └── <domain>/
│       └── spec.md
├── changes/            # Proponowane aktualizacje (jeden folder na zmianę)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Specyfikacje delta (co się zmienia)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Konfiguracja projektu (opcjonalna)
```

**Dwa kluczowe katalogi:**

- **`specs/`** - Źródło prawdy. Te specyfikacje opisują, jak obecnie zachowuje się twój system. Zorganizowane według domeny (np. `specs/auth/`, `specs/payments/`).

- **`changes/`** - Proponowane modyfikacje. Każda zmiana otrzymuje własny folder ze wszystkimi powiązanymi artefaktami. Gdy zmiana jest zakończona, jej specyfikacje są scalane z głównym katalogiem `specs/`.

## Zrozumienie artefaktów

Każdy folder zmian zawiera artefakty, które prowadzą pracę:

| Artefakt | Cel |
|----------|-----|
| `proposal.md` | "Dlaczego" i "co" - przechwytuje intencję, zakres i podejście |
| `specs/` | Specyfikacje delta pokazujące DODANE/ZMODYFIKOWANE/USUNIĘTE wymagania |
| `design.md` | "Jak" - podejście techniczne i decyzje architektoniczne |
| `tasks.md` | Lista kontrolna implementacji z polami wyboru |

**Artefakty opierają się na sobie nawzajem:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            aktualizuj w miarę nauki
```

Zawsze możesz wrócić i udoskonalić wcześniejsze artefakty, gdy dowiesz się więcej podczas implementacji.

## Jak działają specyfikacje delta

Specyfikacje delta to kluczowy koncept w OpenSpec. Pokazują, co się zmienia w stosunku do obecnych specyfikacji.

### Format

Specyfikacje delta używają sekcji, aby wskazać typ zmiany:

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST require a second factor during login.

#### Scenario: OTP required
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented

## MODIFIED Requirements

### Requirement: Session Timeout
The system SHALL expire sessions after 30 minutes of inactivity.
(Previously: 60 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA)
```

### Co się dzieje podczas archiwizacji

Gdy archiwizujesz zmianę:

1. Wymagania **DODANE** są dołączane do głównej specyfikacji
2. Wymagania **ZMODYFIKOWANE** zastępują istniejącą wersję
3. Wymagania **USUNIĘTE** są usuwane z głównej specyfikacji

Folder zmian przenosi się do `openspec/changes/archive/` w celu historii audytu.

## Przykład: Twoja pierwsza zmiana

Przejdźmy przez proces dodawania trybu ciemnego do aplikacji.

### 1. Rozpocznij zmianę (Domyślne)

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — dlaczego to robimy, co się zmienia
     ✓ specs/       — wymagania i scenariusze
     ✓ design.md    — podejście techniczne
     ✓ tasks.md     — lista kontrolna implementacji
     Ready for implementation!
```

Jeśli włączyłeś rozszerzony profil przepływu pracy, możesz to zrobić również w dwóch krokach: `/opsx:new`, a następnie `/opsx:ff` (lub `/opsx:continue` przyrostowo).

### 2. Co zostanie utworzone

**proposal.md** - Przechwytuje intencję:

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage.

## Scope
- Add theme toggle in settings
- Support system preference detection
- Persist preference in localStorage

## Approach
Use CSS custom properties for theming with a React context
for state management.
```

**specs/ui/spec.md** - Delta pokazująca nowe wymagania:

```markdown
# Delta for UI

## ADDED Requirements

### Requirement: Theme Selection
The system SHALL allow users to choose between light and dark themes.

#### Scenario: Manual toggle
- GIVEN a user on any page
- WHEN the user clicks the theme toggle
- THEN the theme switches immediately
- AND the preference persists across sessions

#### Scenario: System preference
- GIVEN a user with no saved preference
- WHEN the application loads
- THEN the system's preferred color scheme is used
```

**tasks.md** - Lista kontrolna implementacji:

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
```

### 3. Implementacja

```
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Created ThemeContext with light/dark state
     ✓ 1.2 Added CSS custom properties to globals.css
     ✓ 1.3 Implemented localStorage persistence
     ✓ 2.1 Created ThemeToggle component
     ...
     All tasks complete!
```

Podczas implementacji, jeśli odkryjesz, że projekt wymaga korekty, po prostu zaktualizuj artefakt i kontynuuj.

### 4. Archiwizacja

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

Twoje specyfikacje delta są teraz częścią głównych specyfikacji, dokumentując, jak działa twój system.

## Weryfikacja i przegląd

Użyj CLI, aby sprawdzić swoje zmiany:

```bash
# Lista aktywnych zmian
openspec list

# Wyświetl szczegóły zmiany
openspec show add-dark-mode

# Sprawdź formatowanie specyfikacji
openspec validate add-dark-mode

# Interaktywny panel
openspec view
```

## Następne kroki

- [Eksploracja najpierw](explore.md) - Użyj `/opsx:explore`, aby przemyśleć pomysł przed zobowiązaniem się
- [Przeglądanie zmiany](reviewing-changes.md) - Co sprawdzić w planie przygotowanym przez AI, przed jakimkolwiek kodem
- [Pisanie dobrych specyfikacji](writing-specs.md) - Jak wygląda silne wymaganie i scenariusz
- [Używanie OpenSpec w istniejącym projekcie](existing-projects.md) - Rozpocznij pracę w dużej istniejącej bazie kodu
- [Edycja i iterowanie zmiany](editing-changes.md) - Aktualizuj artefakty, wróć, uzgodnij ręczne edycje
- [Koncepcje podstawowe w skrócie](overview.md) - Cały model mentalny na jednej stronie
- [Przykłady i przepisy](examples.md) - Rzeczywiste zmiany, od początku do końca
- [Przepływy pracy](workflows.md) - Typowe wzorce i kiedy używać każdego polecenia
- [Polecenia](commands.md) - Pełne odniesienie dla wszystkich poleceń z ukośnikiem
- [Koncepcje](concepts.md) - Głębsze zrozumienie specyfikacji, zmian i schematów
- [Dostosowywanie](customization.md) - Spraw, aby OpenSpec działał po twojemu
- [Magazyny](stores-beta/user-guide.md) - Planowanie obejmujące repozytoria lub zespoły? Przechowuj je w osobnym repozytorium (beta)
- [FAQ](faq.md) i [Rozwiązywanie problemów](troubleshooting.md) - Gdy utkniesz