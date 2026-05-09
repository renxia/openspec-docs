# Koncepcje

Ten przewodnik wyjaśnia główne idee stojące za OpenSpec i sposób, w jaki się ze sobą łączą. Aby zapoznać się z praktycznym użyciem, zobacz [Pierwsze kroki](getting-started.md) oraz [Przepływy pracy](workflows.md).

## Filozofia

OpenSpec opiera się na czterech zasadach:

```
płynny, nie sztywny         — bez bramek fazowych, pracuj nad tym, co ma sens
iteracyjny, nie kaskadowy   — ucz się w trakcie budowania, udoskonalaj na bieżąco
prosty, nie złożony         — lekka konfiguracja, minimalna biurokracja
brownfield-first            — działa z istniejącymi bazami kodu, nie tylko z zielonymi polami
```

### Dlaczego te zasady są ważne

**Płynny, nie sztywny.** Tradycyjne systemy specyfikacji blokują cię w fazach: najpierw planujesz, potem implementujesz, a potem kończysz. OpenSpec jest bardziej elastyczny — możesz tworzyć artefakty w dowolnej kolejności, która ma sens dla twojej pracy.

**Iteracyjny, nie kaskadowy.** Wymagania się zmieniają. Zrozumienie pogłębia się. To, co wydawało się dobrym podejściem na początku, może nie przetrwać po zapoznaniu się z bazą kodu. OpenSpec akceptuje tę rzeczywistość.

**Prosty, nie złożony.** Niektóre frameworki specyfikacji wymagają rozległej konfiguracji, sztywnych formatów lub ciężkich procesów. OpenSpec nie wchodzi ci w drogę. Inicjalizacja w sekundy, natychmiastowe rozpoczęcie pracy, dostosowanie tylko w razie potrzeby.

**Brownfield-first.** Większość pracy z oprogramowaniem nie polega na budowaniu od zera — to modyfikowanie istniejących systemów. Podejście OpenSpec oparte na deltach ułatwia określanie zmian w istniejącym zachowaniu, a nie tylko opisywanie nowych systemów.

## Obraz całości

OpenSpec organizuje Twoją pracę w dwóch głównych obszarach:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Źródło prawdy      │◄─────│  Proponowane modyfikacje      │   │
│   │  Jak Twój system    │ merge│  Każda zmiana = jeden folder  │   │
│   │  obecnie działa     │      │  Zawiera artefakty + delty    │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specyfikacje** są źródłem prawdy — opisują, jak Twój system obecnie się zachowuje.

**Zmiany** to proponowane modyfikacje — przebywają w osobnych folderach, dopóki nie będziesz gotowy je scalić.

To rozdzielenie jest kluczowe. Możesz pracować nad wieloma zmianami równolegle bez konfliktów. Możesz przejrzeć zmianę, zanim wpłynie ona na główne specyfikacje. A kiedy archiwizujesz zmianę, jej delty czysto scalają się ze źródłem prawdy.

## Przestrzenie robocze koordynacji

Wsparcie dla przestrzeni roboczych jest aktywnie rozwijane i nie jest jeszcze gotowe do użytku. Nie buduj zewnętrznej automatyzacji, integracji ani długotrwałych przepływów pracy opartych na zachowaniu przestrzeni roboczych; polecenia, pliki stanu i wyjście JSON mogą się zmienić w dowolnym momencie.

Poniższe polecenia zapewniają pierwszy przepływ konfiguracji dla planowania w powiązanych repozytoriach lub folderach.

Projekty OpenSpec lokalne dla repozytorium są właściwym domyślnym ustawieniem, gdy jedno repozytorium jest właścicielem przepływu planowania, implementacji i archiwizacji. Niektóre prace obejmują kilka repozytoriów lub folderów. W takim przypadku przestrzeń robocza koordynacji OpenSpec jest trwałym domem planowania.

Model mentalny przestrzeni roboczej to:

```text
workspace = gdzie przebywają powiązane zmiany między repozytoriami
link      = stabilna nazwa dla repozytorium lub folderu, wobec którego przestrzeń robocza może planować
change    = jedna funkcja, poprawka, projekt lub inny planowany element pracy
```

Przestrzeń robocza ma inny kształt niż projekt lokalny dla repozytorium:

```text
workspace-folder/
├── changes/                       # Planowanie na poziomie przestrzeni roboczej
└── .openspec-workspace/
    ├── workspace.yaml             # Udostępniona tożsamość przestrzeni roboczej i nazwy linków
    └── local.yaml                 # Lokalne ścieżki tego komputera
```

Stan OpenSpec lokalny dla repozytorium zachowuje istniejący kształt:

```text
repo-root/
└── openspec/
    ├── specs/
    └── changes/
```

To rozróżnienie ma znaczenie. Folder przestrzeni roboczej jest powierzchnią koordynacji do planowania w powiązanych repozytoriach lub folderach. Katalog `openspec/` każdego repozytorium pozostaje domem dla specyfikacji należących do repozytorium, zmian lokalnych dla repozytorium i planowania implementacji. Użytkownicy nie muszą uruchamiać lokalnego dla repozytorium `openspec init` wewnątrz folderu przestrzeni roboczej.

Stabilne nazwy linków to sposób, w jaki planowanie przestrzeni roboczej odnosi się do repozytoriów i folderów. Udostępniony stan przestrzeni roboczej przechowuje nazwy takie jak `api`, `web` lub `checkout`; każde mapowanie maszyny tych nazw na własne lokalne ścieżki w `.openspec-workspace/local.yaml`.

```yaml
# .openspec-workspace/workspace.yaml
version: 1
name: platform
links:
  api: {}
  web: {}
```

```yaml
# .openspec-workspace/local.yaml
version: 1
paths:
  api: /repos/api
  web: /repos/web
```

Przestrzenie robocze utworzone przez OpenSpec domyślnie wykluczają `.openspec-workspace/local.yaml` z przenośnego stanu współpracy. `.openspec-workspace/workspace.yaml` pozostaje przenośny, ponieważ przechowuje nazwę przestrzeni roboczej i stabilne nazwy linków, a nie bezwzględne ścieżki checkoutu jednego użytkownika.

Powiązane ścieżki mogą być pełnymi repozytoriami, folderami wewnątrz dużego monorepo lub innymi istniejącymi folderami. Nie potrzebują lokalnego dla repozytorium stanu `openspec/`, zanim będą mogły uczestniczyć w planowaniu przestrzeni roboczej. Późniejsze przepływy pracy implementacji, weryfikacji lub archiwizacji mogą wymagać większej gotowości repozytorium, ale widoczność planowania zaczyna się od linku.

```text
multi-repo:
  api      -> /repos/api
  web      -> /repos/web

large monorepo:
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

Zarządzane przestrzenie robocze znajdują się w standardowym katalogu danych OpenSpec:

```text
getGlobalDataDir()/workspaces
```

Oznacza to `$XDG_DATA_HOME/openspec/workspaces`, gdy `XDG_DATA_HOME` jest ustawione, `~/.local/share/openspec/workspaces` w przypadku fallbacku w stylu Uniksa i `%LOCALAPPDATA%\openspec\workspaces` w przypadku natywnego fallbacku Windows. Natywne powłoki Windows, PowerShell i WSL2 każda przechowuje ciągi ścieżek dla środowiska uruchomieniowego uruchamiającego OpenSpec. Ta podstawa nie tłumaczy między `D:\repo`, `/mnt/d/repo` i ścieżkami UNC WSL.

OpenSpec przechowuje również rejestr lokalny dla maszyny w:

```text
getGlobalDataDir()/workspaces/registry.yaml
```

Rejestr mapuje nazwy przestrzeni roboczych na ich lokalizacje, aby późniejsze globalne polecenia mogły列出 lub wybierać znane przestrzenie robocze z dowolnego miejsca. Jest to tylko indeks. Każdy folder przestrzeni roboczej pozostaje autorytatywny dla własnego `.openspec-workspace/workspace.yaml` i `.openspec-workspace/local.yaml`, więc przestarzałe rekordy rejestru mogą być raportowane i naprawiane bez重新definiowania samej przestrzeni roboczej.

Widoczność przestrzeni roboczej nie jest zobowiązaniem do zmiany. Skonfiguruj przestrzeń roboczą, gdy OpenSpec powinien wiedzieć, które repozytoria lub foldery są istotne; utwórz zmianę później, gdy będziesz gotowy zaplanować funkcję, poprawkę, projekt lub inny element pracy.

Przydatne polecenia:

```bash
# Konfiguracja prowadzona
openspec workspace setup

# Konfiguracja przyjazna dla automatyzacji
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex

# Zobacz znane przestrzenie robocze z lokalnego rejestru
openspec workspace list
openspec workspace ls

# Dodaj lub napraw linki dla wybranej przestrzeni roboczej
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Sprawdź, co ta maszyna może rozwiązać
openspec workspace doctor
openspec workspace doctor --workspace platform

# Otwórz powiązany zestaw roboczy
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor
```

`workspace setup` zawsze tworzy przestrzeń roboczą w standardowej lokalizacji przestrzeni roboczej, rejestruje ją w lokalnym rejestrze, pokazuje lokalizację przestrzeni roboczej i wymaga co najmniej jednego powiązanego repozytorium lub folderu. Konfiguracja interaktywna pyta o preferowany program otwierający. Konfiguracja nieinteraktywna przechowuje go tylko wtedy, gdy podano `--opener codex`, `--opener claude`, `--opener github-copilot` lub `--opener editor`.

OpenSpec utrzymuje również pliki otwierania głównej przestrzeni roboczej: blok prowadzenia zarządzany przez OpenSpec w `AGENTS.md`, plik lokalny dla maszyny `<workspace-name>.code-workspace` dla VS Code i GitHub Copilot-in-VS-Code oraz konkretną regułę ignorowania dla tego utrzymywanego pliku `.code-workspace`. Pliki `*.code-workspace` napisane przez użytkownika pozostają śledzone, ponieważ reguła ignorowania dotyczy tylko utrzymywanego pliku.

Utrzymywana przestrzeń robocza VS Code zawiera katalog główny koordynacji jako `.` plus prawidłowe powiązane repozytoria lub foldery jako dodatkowe katalogi główne. VS Code wyświetla te wpisy jako przestrzeń roboczą z wieloma katalogami głównymi.

`workspace open` otwiera powiązany zestaw roboczy z zapisanym preferowanym programem otwierającym, chyba że dla tej jednej sesji zostanie przekazane `--agent <tool>` lub `--editor`. Przekazanie obu nadpisań programu otwierającego jest błędem. Otwarcie głównej przestrzeni roboczej czyni powiązane repozytoria i foldery widocznymi do eksploracji i planowania; implementacja rozpoczyna się po tym, jak użytkownik wyraźnie poprosi o pracę implementacyjną.

`workspace link` i `workspace relink` rejestrują tylko istniejące foldery; nie tworzą, kopiują, przenoszą, inicjalizują ani nie edytują powiązanego repozytorium lub folderu. Po pomyślnym linkowaniu lub relinkowaniu OpenSpec odświeża zarządzane prowadzenie, plik przestrzeni roboczej VS Code i regułę ignorowania.

Polecenia przestrzeni roboczej, które potrzebują jednej przestrzeni roboczej, mogą być uruchamiane z dowolnego miejsca za pomocą `--workspace <name>`. Jeśli uruchomisz je wewnątrz folderu przestrzeni roboczej lub podkatalogu, OpenSpec używa tej bieżącej przestrzeni roboczej. Jeśli dostępnych jest kilka znanych przestrzeni roboczych i nie przekażesz `--workspace <name>`, polecenia dla człowieka wyświetlają selektor; `--json` i `--no-interactive` kończą się błędem ze strukturalnym stanem zamiast提示u.

Bezpośrednie polecenia przestrzeni roboczej obsługują wyjście JSON dla skryptów. Odpowiedzi JSON przechowują główne dane w obiektach `workspace`, `workspaces` lub `link` i raportują ostrzeżenia lub błędy w tablicach `status`. Zdrowe obiekty używają `status: []`.

## Specyfikacje

Specyfikacje opisują zachowanie Twojego systemu przy użyciu strukturyzowanych wymagań i scenariuszy.

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
    └── spec.md           # Zachowanie interfejsu użytkownika i motywy
```

Organizuj specyfikacje według domen — logicznych grupowań, które mają sens dla Twojego systemu. Typowe wzorce:

- **Według obszaru funkcjonalnego**: `auth/`, `payments/`, `search/`
- **Według komponentu**: `api/`, `frontend/`, `workers/`
- **Według ograniczonego kontekstu**: `ordering/`, `fulfillment/`, `inventory/`

### Format specyfikacji

Specyfikacja zawiera wymagania, a każde wymaganie ma scenariusze:

```markdown
# Specyfikacja uwierzytelniania
```

## Cel
Uwierzytelnianie i zarządzanie sesjami dla aplikacji.

## Wymagania

### Wymaganie: Uwierzytelnianie użytkownika
System MUSI wydać token JWT po pomyślnym zalogowaniu.

#### Scenariusz: Prawidłowe dane uwierzytelniające
- DANY użytkownik z prawidłowymi danymi uwierzytelniającymi
- GDY użytkownik przesyła formularz logowania
- WTEDY zwracany jest token JWT
- ORAZ użytkownik jest przekierowany do panelu

#### Scenariusz: Nieprawidłowe dane uwierzytelniające
- DANE nieprawidłowe dane uwierzytelniające
- GDY użytkownik przesyła formularz logowania
- WTEDY wyświetlany jest komunikat o błędzie
- ORAZ żaden token nie jest wydany

### Wymaganie: Wygaśnięcie sesji
System MUSI unieważniać sesje po 30 minutach bezczynności.

#### Scenariusz: Przekroczenie limitu bezczynności
- DANA uwierzytelniona sesja
- GDY upłynie 30 minut bez aktywności
- WTEDY sesja jest unieważniana
- ORAZ użytkownik musi ponownie się uwierzytelnić
```

**Kluczowe elementy:**

| Element | Cel |
|---------|-----|
| `## Cel` | Opis wyższego poziomu domeny tej specyfikacji |
| `### Wymaganie:` | Konkretne zachowanie, które system musi posiadać |
| `#### Scenariusz:` | Konkretny przykład wymagania w działaniu |
| SHALL/MUST/SHOULD | Słowa kluczowe RFC 2119 wskazujące siłę wymagania |

### Dlaczego strukturyzować specyfikacje w ten sposób

**Wymagania to "co"** — określają, co system powinien robić, bez wskazywania implementacji.

**Scenariusze to "kiedy"** — dostarczają konkretnych przykładów, które można zweryfikować. Dobre scenariusze:
- Są testowalne (można dla nich napisać test automatyczny)
- Pokrywają zarówno ścieżkę pomyślną, jak i przypadki brzegowe
- Używają formatu Given/When/Then lub podobnej struktury

**Słowa kluczowe RFC 2119** (SHALL, MUST, SHOULD, MAY) komunikują intencję:
- **MUST/SHALL** — wymaganie bezwzględne
- **SHOULD** — zalecane, ale istnieją wyjątki
- **MAY** — opcjonalne

### Czym jest specyfikacja (a czym nie jest)

Specyfikacja to **umowa dotycząca zachowania**, a nie plan implementacji.

Dobra treść specyfikacji:
- Obserwowalne zachowanie, na którym polegają użytkownicy lub systemy nadrzędne
- Wejścia, wyjścia i warunki błędów
- Ograniczenia zewnętrzne (bezpieczeństwo, prywatność, niezawodność, kompatybilność)
- Scenariusze, które można przetestować lub jawnie zwalidować

Czego unikać w specyfikacjach:
- Wewnętrznych nazw klas/funkcji
- Wyboru bibliotek lub frameworków
- Szczegółowych kroków implementacji
- Szczegółowych planów wykonania (te należą do `design.md` lub `tasks.md`)

Szybki test:
- Jeśli implementacja może się zmienić bez zmiany widocznego zewnętrznie zachowania, prawdopodobnie nie należy ona do specyfikacji.

### Zachowaj lekkość: Progresywna rygoryzm

OpenSpec ma na celu unikanie biurokracji. Używaj najlżejszego poziomu, który nadal czyni zmianę weryfikowalną.

**Specyfikacja lite (domyślna):**
- Krótkie wymagania skupione na zachowaniu
- Jasny zakres i cele niebędące celami
- Kilka konkretnych kontroli akceptacji

**Pełna specyfikacja (dla wyższego ryzyka):**
- Zmiany międzyzespołowe lub między repozytoriami
- Zmiany API/umów, migracje, kwestie bezpieczeństwa/prywatności
- Zmiany, w których niejasność może prowadzić do kosztownych przeróbek

Większość zmian powinna pozostać w trybie lite.

### Współpraca człowiek + agent

W wielu zespołach ludzie eksplorują, a agenci tworzą artefakty. Zamierzona pętla to:

1. Człowiek dostarcza intencję, kontekst i ograniczenia.
2. Agent przekształca to w wymagania skupione na zachowaniu i scenariusze.
3. Agent przechowuje szczegóły implementacji w `design.md` i `tasks.md`, a nie w `spec.md`.
4. Walidacja potwierdza strukturę i jasność przed implementacją.

To sprawia, że specyfikacje są czytelne dla ludzi i spójne dla agentów.

## Zmiany

Zmiana to proponowana modyfikacja Twojego systemu, spakowana jako folder zawierający wszystko, co potrzebne do jej zrozumienia i wdrożenia.

### Struktura zmiany

```
openspec/changes/add-dark-mode/
├── proposal.md           # Dlaczego i co
├── design.md             # Jak (podejście techniczne)
├── tasks.md              # Lista kontrolna implementacji
├── .openspec.yaml        # Metadane zmiany (opcjonalne)
└── specs/                # Specyfikacje delta
    └── ui/
        └── spec.md       # Co się zmienia w ui/spec.md
```

Każda zmiana jest samodzielnym modułem. Zawiera:
- **Artefakty** — dokumenty opisujące intencję, projekt i zadania
- **Specyfikacje delta** — specyfikacje określające, co jest dodawane, modyfikowane lub usuwane
- **Metadane** — opcjonalna konfiguracja dla konkretnej zmiany

### Dlaczego zmiany są folderami

Pakowanie zmian w formie folderów ma kilka zalet:

1. **Wszystko w jednym miejscu.** Propozycja, projekt, zadania i specyfikacje żyją w jednym miejscu. Nie trzeba szukać w różnych lokalizacjach.

2. **Praca równoległa.** Wiele zmian może istnieć jednocześnie bez konfliktów. Można pracować nad `add-dark-mode`, podczas gdy `fix-auth-bug` jest również w toku.

3. **Czytelna historia.** Po zarchiwizowaniu zmiany przenoszą się do `changes/archive/` z zachowaniem pełnego kontekstu. Można cofnąć się i zrozumieć nie tylko co się zmieniło, ale dlaczego.

4. **Łatwość przeglądu.** Folder zmiany jest łatwy do przejrzenia — otwierasz go, czytasz propozycję, sprawdzasz projekt, widzisz delta specyfikacji.

## Artefakty

Artefakty to dokumenty w ramach zmiany, które prowadzą prace.

### Przepływ artefaktów

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Artefakty budują się na sobie. Każdy artefakt dostarcza kontekst dla następnego.

### Typy artefaktów

#### Propozycja (`proposal.md`)

Propozycja uchwytuje na wysokim poziomie **intencję**, **zakres** i **podejście**.

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
- Zmienia się zakres (zawężenie lub rozszerzenie)
- Intencja się wyjaśnia (lepsze zrozumienie problemu)
- Podejście ulega fundamentalnej zmianie

#### Specyfikacje (delta specyfikacje w `specs/`)

Delta specyfikacje opisują **co się zmienia** w odniesieniu do bieżących specyfikacji. Patrz [Delta specyfikacje](#delta-specyfikacje) poniżej.

#### Projekt (`design.md`)

Projekt uchwytuje **podejście techniczne** i **decyzje architektoniczne**.

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

Zadania to **lista kontrolna implementacji** — konkretne kroki z polami wyboru.

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
- Używaj hierarchicznego numerowania (1.1, 1.2 itd.)
- Utrzymuj zadania na tyle małe, aby można je było ukończyć w jednej sesji
- Odznaczaj zadania po ich ukończeniu

## Delta specyfikacje

Delta specyfikacje to kluczowy koncept, który sprawia, że OpenSpec działa w przypadku rozwoju istniejącego systemu (brownfield). Opisują **co się zmienia**, zamiast powtarzać całą specyfikację.

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

### Sekcje delta

| Sekcja | Znaczenie | Co dzieje się przy archiwizacji |
|---------|---------|------------------------|
| `## ADDED Requirements` | Nowe zachowanie | Dołączane do głównej specyfikacji |
| `## MODIFIED Requirements` | Zmienione zachowanie | Zastępuje istniejący wymóg |
| `## REMOVED Requirements` | Wycofane zachowanie | Usuwane z głównej specyfikacji |

### Dlaczego delta zamiast pełnych specyfikacji

**Przejrzystość.** Delta pokazuje dokładnie, co się zmienia. Czytając pełną specyfikację, trzeba byłoby ją porównywać mentalnie z bieżącą wersją.

**Unikanie konfliktów.** Dwie zmiany mogą dotyczyć tego samego pliku specyfikacji bez konfliktu, o ile modyfikują różne wymagania.

**Efektywność przeglądu.** Recenzenci widzą zmianę, a nie niezmieniony kontekst. Skupiają się na tym, co istotne.

**Dopasowanie do brownfield.** Większość pracy modyfikuje istniejące zachowanie. Delta sprawia, że modyfikacje są obywatelami pierwszej klasy, a nie dodatkiem.

## Schemy

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
    requires: [proposal]      # Wymaga propozycji przed utworzeniem

  - id: design
    generates: design.md
    requires: [proposal]      # Można utworzyć równolegle ze specyfikacjami

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Wymaga zarówno specyfikacji, jak i projektu
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
   (wymaga:                    (wymaga:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (wymaga:
                specs, design)
```

**Zależności są czynnikami umożliwiającymi, a nie bramkami.** Pokazują, co jest możliwe do utworzenia, a nie co musisz utworzyć jako następne. Możesz pominąć projekt, jeśli go nie potrzebujesz. Możesz tworzyć specyfikacje przed lub po projekcie — oba zależą tylko od propozycji.

### Wbudowane schematy

**spec-driven** (domyślny)

Standardowy przepływ pracy dla rozwoju opartego na specyfikacjach:

```
proposal → specs → design → tasks → implement
```

Najlepszy dla: Większości prac nad funkcjonalnościami, gdzie chcesz uzgodnić specyfikacje przed implementacją.

### Niestandardowe schematy

Twórz niestandardowe schematy dla przepływu pracy Twojego zespołu:

```bash
# Utwórz od podstaw
openspec schema init research-first

# Lub rozwidl istniejący
openspec schema fork spec-driven research-first
```

**Przykładowy niestandardowy schemat:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Najpierw przeprowadź badania

  - id: proposal
    generates: proposal.md
    requires: [research]   # Propozycja oparta na badaniach

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Pomiń specyfikacje/projekt, przejdź od razu do zadań
```

Zobacz [Dostosowywanie](customization.md), aby uzyskać pełne informacje na temat tworzenia i używania niestandardowych schematów.

## Archiwizacja

Archiwizacja finalizuje zmianę, scalając jej specyfikacje delta z głównymi specyfikacjami i zachowując zmianę w historii.

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
        ├── design.md                │ scalanie
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Po archiwizacji:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Teraz zawiera wymagania 2FA
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Zachowane w historii
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Proces archiwizacji

1.  **Scalanie delt.** Każda sekcja specyfikacji delta (DODANO/ZMODYFIKOWANO/USUNIĘTO) jest stosowana do odpowiedniej głównej specyfikacji.

2.  **Przeniesienie do archiwum.** Folder zmiany jest przenoszony do `changes/archive/` z prefiksem daty dla porządku chronologicznego.

3.  **Zachowanie kontekstu.** Wszystkie artefakty pozostają nienaruszone w archiwum. Zawsze możesz cofnąć się, aby zrozumieć, dlaczego wprowadzono zmianę.

### Dlaczego archiwizacja jest ważna

**Czysty stan.** Aktywne zmiany (`changes/`) pokazują tylko pracę w toku. Ukończona praca jest usuwana z drogi.

**Ścieżka audytu.** Archiwum zachowuje pełny kontekst każdej zmiany — nie tylko to, co się zmieniło, ale także propozycję wyjaśniającą dlaczego, projekt wyjaśniający jak i zadania pokazujące wykonaną pracę.

**Ewolucja specyfikacji.** Specyfikacje rosną organicznie w miarę archiwizacji zmian. Każde archiwum scala swoje delty, budując kompleksową specyfikację z czasem.

## Jak to wszystko się łączy

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              PRZEPŁYW OPENSPEC                               │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. ROZPOCZNIJ │  /opsx:propose (rdzeń) lub /opsx:new (rozszerzony)      │
│   │     ZMIANĘ     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. TWÓRZ      │  /opsx:ff lub /opsx:continue (rozszerzony przepływ)     │
│   │     ARTEFAKTY  │  Tworzy propozycję → specyfikacje → projekt → zadania   │
│   │                │  (na podstawie zależności schematu)                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. WDROŻ      │  /opsx:apply                                            │
│   │     ZADANIA    │  Pracuj nad zadaniami, odhaczając je                     │
│   │                │◄──── Aktualizuj artefakty w miarę nauki                  │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. WERYFIKUJ  │  /opsx:verify (opcjonalnie)                             │
│   │     PRACĘ      │  Sprawdź, czy implementacja odpowiada specyfikacjom     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIWIZUJ │────►│  Specyfikacje delta scalane z głównymi      │    │
│   │     ZMIANĘ     │     │  Folder zmiany przenoszony do archive/       │    │
│   └────────────────┘     │  Specyfikacje są teraz zaktualizowanym źródłem prawdy │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Cykl cnotliwy:**

1.  Specyfikacje opisują bieżące zachowanie
2.  Zmiany proponują modyfikacje (jako delty)
3.  Implementacja urzeczywistnia zmiany
4.  Archiwizacja scala delty w specyfikacjach
5.  Specyfikacje opisują teraz nowe zachowanie
6.  Następna zmiana opiera się na zaktualizowanych specyfikacjach

## Słowniczek

| Termin | Definicja |
|--------|-----------|
| **Artefakt** | Dokument w ramach zmiany (propozycja, projekt, zadania lub specyfikacje delta) |
| **Archiwizacja** | Proces finalizacji zmiany i scalania jej delt z głównymi specyfikacjami |
| **Zmiana** | Proponowana modyfikacja systemu, spakowana jako folder z artefaktami |
| **Specyfikacja delta** | Specyfikacja opisująca zmiany (DODANO/ZMODYFIKOWANO/USUNIĘTO) w odniesieniu do bieżących specyfikacji |
| **Domena** | Logiczne grupowanie specyfikacji (np. `auth/`, `payments/`) |
| **Wymaganie** | Konkretne zachowanie, które system musi posiadać |
| **Scenariusz** | Konkretny przykład wymagania, zazwyczaj w formacie Given/When/Then |
| **Schemat** | Definicja typów artefaktów i ich zależności |
| **Specyfikacja** | Dokumentacja opisująca zachowanie systemu, zawierająca wymagania i scenariusze |
| **Źródło prawdy** | Katalog `openspec/specs/`, zawierający bieżące uzgodnione zachowanie |

## Następne kroki

- [Pierwsze kroki](getting-started.md) - Praktyczne pierwsze kroki
- [Przepływy pracy](workflows.md) - Typowe wzorce i kiedy ich używać
- [Polecenia](commands.md) - Pełna referencja poleceń
- [Dostosowywanie](customization.md) - Tworzenie niestandardowych schematów i konfiguracja projektu