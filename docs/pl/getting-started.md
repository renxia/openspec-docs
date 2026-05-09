# Pierwsze kroki

Ten przewodnik wyjaśnia, jak działa OpenSpec po zainicjalizowaniu i skonfigurowaniu. Instrukcje instalacji znajdziesz w [głównym pliku README](index.md#quick-start).

## Jak to działa

OpenSpec pomaga Tobie i Twojemu asystentowi AI do programowania ustalić, co zbudować, zanim zostanie napisany jakikolwiek kod.

**Domyślna ścieżka szybka (profil rdzeniowy):**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

**Ścieżka rozszerzona (wybór niestandardowego przepływu pracy):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Domyślny profil globalny to `core`, który zawiera `propose`, `explore`, `apply`, `sync` i `archive`. Możesz włączyć rozszerzone polecenia przepływu pracy za pomocą `openspec config profile`, a następnie `openspec update`.

## Co tworzy OpenSpec

Po uruchomieniu `openspec init` Twój projekt zyskuje następującą strukturę:

```
openspec/
├── specs/              # Źródło prawdy (zachowanie Twojego systemu)
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

- **`specs/`** - Źródło prawdy. Te specyfikacje opisują aktualne zachowanie Twojego systemu. Uporządkowane według domen (np. `specs/auth/`, `specs/payments/`).

- **`changes/`** - Proponowane modyfikacje. Każda zmiana ma własny folder ze wszystkimi powiązanymi artefaktami. Po zakończeniu zmiany jej specyfikacje scalane są z głównym katalogiem `specs/`.

## Zrozumienie artefaktów

Każdy folder zmiany zawiera artefakty, które prowadzą prace:

| Artefakt | Przeznaczenie |
|----------|---------------|
| `proposal.md` | „Dlaczego" i „co" — uchwytuje intencję, zakres i podejście |
| `specs/` | Specyfikacje delta pokazujące DODANE/ZMODYFIKOWANE/USUNIĘTE wymagania |
| `design.md` | „Jak" — podejście techniczne i decyzje architektoniczne |
| `tasks.md` | Lista kontrolna implementacji z polami wyboru |

**Artefakty budują na sobie nawzajem:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            aktualizuj w miarę postępu prac
```

Zawsze możesz wrócić i udoskonalić wcześniejsze artefakty, gdy dowiesz się więcej w trakcie implementacji.

## Jak działają specyfikacje delta

Specyfikacje delta to kluczowy koncept w OpenSpec. Pokazują, co się zmienia w odniesieniu do Twoich aktualnych specyfikacji.

### Format

Specyfikacje delta używają sekcji do oznaczenia typu zmiany:

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

1. **DODANE** wymagania są dołączane do głównej specyfikacji
2. **ZMODYFIKOWANE** wymagania zastępują istniejącą wersję
3. **USUNIĘTE** wymagania są usuwane z głównej specyfikacji

Folder zmiany przenoszony jest do `openspec/changes/archive/` na potrzeby historii audytu.

## Przykład: Twoja pierwsza zmiana

Przejdźmy przez proces dodawania trybu ciemnego do aplikacji.

### 1. Rozpocznij zmianę (domyślnie)

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

Jeśli włączyłeś rozszerzony profil przepływu pracy, możesz to zrobić w dwóch krokach: `/opsx:new`, a następnie `/opsx:ff` (lub `/opsx:continue` przyrostowo).

### 2. Co zostaje utworzone

**proposal.md** — Uchwytuje intencję:

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

**specs/ui/spec.md** — Delta pokazująca nowe wymagania:

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

**tasks.md** — Lista kontrolna implementacji:

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

W trakcie implementacji, jeśli odkryjesz, że projekt wymaga dostosowania, po prostu zaktualizuj artefakt i kontynuuj.

### 4. Archiwizacja

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

Twoje specyfikacje delta są teraz częścią głównych specyfikacji, dokumentując działanie Twojego systemu.

## Weryfikacja i przeglądanie

Użyj interfejsu CLI, aby sprawdzić swoje zmiany:

```bash
# List active changes
openspec list

# View change details
openspec show add-dark-mode

# Validate spec formatting
openspec validate add-dark-mode

# Interactive dashboard
openspec view
```

## Następne kroki

- [Przepływy pracy](workflows.md) — Typowe wzorce i kiedy używać poszczególnych poleceń
- [Polecenia](commands.md) — Pełny opis wszystkich poleceń ukośnikowych
- [Koncepty](concepts.md) — Głębsze zrozumienie specyfikacji, zmian i schematów
- [Dostosowywanie](customization.md) — Dostosuj OpenSpec do swoich potrzeb