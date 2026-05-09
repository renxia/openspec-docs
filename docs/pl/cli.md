# Referencja CLI

OpenSpec CLI (`openspec`) udostępnia komendy terminalowe do konfiguracji projektu, walidacji, inspekcji stanu oraz zarządzania. Komendy te uzupełniają komendy slash AI (takie jak `/opsx:propose`) udokumentowane w sekcji [Komendy](commands.md).

## Podsumowanie

| Kategoria | Komendy | Cel |
|-----------|---------|-----|
| **Konfiguracja** | `init`, `update` | Inicjalizacja i aktualizacja OpenSpec w projekcie |
| **Przestrzenie robocze (beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace open` | Konfiguracja planowania w powiązanych repozytoriach lub folderach |
| **Przeglądanie** | `list`, `view`, `show` | Eksploracja zmian i specyfikacji |
| **Walidacja** | `validate` | Sprawdzanie zmian i specyfikacji pod kątem problemów |
| **Cykl życia** | `archive` | Finalizacja ukończonych zmian |
| **Przepływ pracy** | `status`, `instructions`, `templates`, `schemas` | Obsługa przepływu pracy opartego na artefaktach |
| **Schematy** | `schema init`, `schema fork`, `schema validate`, `schema which` | Tworzenie i zarządzanie niestandardowymi przepływami pracy |
| **Konfiguracja** | `config` | Przeglądanie i modyfikacja ustawień |
| **Narzędzia** | `feedback`, `completion` | Informacje zwrotne i integracja z powłoką |

---

## Polecenia dla człowieka vs agenta

Większość poleceń CLI jest przeznaczona do **użytku przez człowieka** w terminalu. Niektóre polecenia obsługują również **użytek przez agenta/skrypt** dzięki wyjściu w formacie JSON.

### Polecenia wyłącznie dla człowieka

Te polecenia są interaktywne i przeznaczone do użytku w terminalu:

| Polecenie | Przeznaczenie |
|-----------|---------------|
| `openspec init` | Inicjalizacja projektu (interaktywne monity) |
| `openspec view` | Interaktywny panel |
| `openspec config edit` | Otwórz konfigurację w edytorze |
| `openspec feedback` | Wyślij opinię przez GitHub |
| `openspec completion install` | Zainstaluj uzupełnianie powłoki |

### Polecenia kompatybilne z agentami

Te polecenia obsługują wyjście `--json` do programistycznego użycia przez agentów AI i skrypty:

| Polecenie | Użytek przez człowieka | Użytek przez agenta |
|-----------|------------------------|---------------------|
| `openspec list` | Przeglądanie zmian/specyfikacji | `--json` dla danych strukturalnych |
| `openspec show <item>` | Odczyt zawartości | `--json` do parsowania |
| `openspec validate` | Sprawdzanie problemów | `--all --json` do masowej walidacji |
| `openspec status` | Postęp artefaktów | `--json` dla strukturalnego statusu |
| `openspec instructions` | Następne kroki | `--json` dla instrukcji agenta |
| `openspec templates` | Wyszukiwanie ścieżek szablonów | `--json` do rozwiązywania ścieżek |
| `openspec schemas` | Lista dostępnych schematów | `--json` do wykrywania schematów |
| `openspec workspace setup --no-interactive` | Tworzenie przestrzeni roboczej z jawnymi danymi wejściowymi | `--json` dla strukturalnego wyjścia konfiguracji |
| `openspec workspace list` | Przeglądanie znanych przestrzeni roboczych | `--json` dla typowanych obiektów przestrzeni roboczych |
| `openspec workspace link` | Łączenie repozytorium lub folderu | `--json` dla strukturalnego wyjścia łączenia |
| `openspec workspace relink` | Naprawa połączonej ścieżki | `--json` dla strukturalnego wyjścia łączenia |
| `openspec workspace doctor` | Sprawdzenie jednej przestrzeni roboczej | `--json` dla strukturalnego wyjścia statusu |

---

## Opcje globalne

Te opcje działają ze wszystkimi poleceniami:

| Opcja | Opis |
|-------|------|
| `--version`, `-V` | Wyświetl numer wersji |
| `--no-color` | Wyłącz kolorowe wyjście |
| `--help`, `-h` | Wyświetl pomoc dla polecenia |

---

## Polecenia konfiguracji

### `openspec init`

Inicjalizacja OpenSpec w Twoim projekcie. Tworzy strukturę folderów i konfiguruje integracje z narzędziami AI.

Domyślne zachowanie wykorzystuje globalne ustawienia domyślne: profil `core`, dostarczanie `both`, przepływy pracy `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `path` | Nie | Katalog docelowy (domyślnie: bieżący katalog) |

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--tools <list>` | Konfiguracja narzędzi AI w trybie nieinteraktywnym. Użyj `all`, `none` lub listy oddzielonej przecinkami |
| `--force` | Automatyczne czyszczenie starszych plików bez monitowania |
| `--profile <profile>` | Nadpisanie globalnego profilu dla tego uruchomienia init (`core` lub `custom`) |

`--profile custom` wykorzystuje aktualnie wybrane przepływy pracy w konfiguracji globalnej (`openspec config profile`).

**Obsługiwane identyfikatory narzędzi (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**Przykłady:**

```bash
# Interactive initialization
openspec init

# Initialize in a specific directory
openspec init ./my-project

# Non-interactive: configure for Claude and Cursor
openspec init --tools claude,cursor

# Configure for all supported tools
openspec init --tools all

# Override profile for this run
openspec init --profile core

# Skip prompts and auto-cleanup legacy files
openspec init --force
```

**Co tworzy:**

```
openspec/
├── specs/              # Your specifications (source of truth)
├── changes/            # Proposed changes
└── config.yaml         # Project configuration

.claude/skills/         # Claude Code skills (if claude selected)
.cursor/skills/         # Cursor skills (if cursor selected)
.cursor/commands/       # Cursor OPSX commands (if delivery includes commands)
... (other tool configs)
```

---

### `openspec update`

Aktualizacja plików instrukcji OpenSpec po aktualizacji CLI. Ponownie generuje pliki konfiguracyjne narzędzi AI, wykorzystując bieżący globalny profil, wybrane przepływy pracy i tryb dostarczania.

```
openspec update [path] [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `path` | Nie | Katalog docelowy (domyślnie: bieżący katalog) |

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--force` | Wymuś aktualizację nawet gdy pliki są aktualne |

**Przykład:**

```bash
# Update instruction files after npm upgrade
npm update @fission-ai/openspec
openspec update
```

---

## Polecenia przestrzeni roboczych

Polecenia przestrzeni roboczych są w fazie aktywnego rozwoju i nie są jeszcze gotowe do użytku. Nie buduj zewnętrznej automatyzacji, integracji ani długotrwałych przepływów pracy na bazie tego zestawu poleceń; zachowanie poleceń, pliki stanu i wyjście JSON mogą ulec zmianie w dowolnym momencie.

Przestrzenie robocze koordynacji są domami planowania dla pracy obejmującej wiele repozytoriów lub folderów. Widoczność przestrzeni roboczej nie oznacza zobowiązania do zmian: połącz repozytoria lub foldery, które OpenSpec powinien znać, a następnie twórz zmiany, gdy będziesz gotowy do planowania konkretnej pracy.

### `openspec workspace setup`

Utwórz przestrzeń roboczą w standardowej lokalizacji przestrzeni roboczych OpenSpec i połącz co najmniej jedno istniejące repozytorium lub folder.

```bash
openspec workspace setup [options]
```

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--name <name>` | Nazwa przestrzeni roboczej. Nazwy muszą być w formacie kebab-case |
| `--link <path>` | Połącz istniejące repozytorium lub folder i wywnioskuj nazwę łącza z nazwy folderu |
| `--link <name>=<path>` | Połącz istniejące repozytorium lub folder z jawną nazwą łącza |
| `--opener <id>` | Zapisz preferowane narzędzie otwierające podczas konfiguracji nieinteraktywnej: `codex`, `claude`, `github-copilot` lub `editor` |
| `--no-interactive` | Wyłącz monity; wymaga `--name` i co najmniej jednego `--link` |
| `--json` | Wyjście JSON; wymaga `--no-interactive` |

**Przykłady:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

Konfiguracja interaktywna pyta o preferowane narzędzie otwierające i zapisuje je w lokalnym stanie przestrzeni roboczej maszyny. Konfiguracja nieinteraktywna zapisuje preferowane narzędzie otwierające tylko wtedy, gdy podano `--opener`; w przeciwnym razie `workspace open` wyświetli monit później w terminalach interaktywnych, gdy dostępne jest obsługiwane narzędzie otwierające, lub poprosi skrypty o przekazanie `--agent <tool>` lub `--editor`.

### `openspec workspace list`

Wyświetl listę znanych przestrzeni roboczych OpenSpec z lokalnego rejestru.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

Lista pokazuje lokalizację każdej przestrzeni roboczej oraz połączone repozytoria lub foldery. Nieaktualne rekordy rejestru są raportowane, ale nie zmieniane.

### `openspec workspace link`

Zapisz istniejące repozytorium lub folder dla jednej przestrzeni roboczej.

```bash
openspec workspace link [name] <path> [options]
```

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--workspace <name>` | Wybierz znaną przestrzeń roboczą z lokalnego rejestru |
| `--json` | Wyjście JSON |
| `--no-interactive` | Wyłącz monity wyboru przestrzeni roboczej |

**Przykłady:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

Ścieżka musi już istnieć. Ścieżki względne są rozwiązywane względem bieżącego katalogu polecenia, zanim OpenSpec zapisze zweryfikowaną ścieżkę bezwzględną w lokalnym stanie przestrzeni roboczej maszyny. Połączone ścieżki mogą być pełnymi repozytoriami, pakietami, usługami, aplikacjami lub folderami bez stanu `openspec/` lokalnego dla repozytorium.

### `openspec workspace relink`

Napraw lub zmień lokalną ścieżkę dla istniejącego łącza.

```bash
openspec workspace relink <name> <path> [options]
```

Ścieżka musi już istnieć. Relink aktualizuje tylko lokalną ścieżkę maszyny dla stabilnej nazwy łącza.

### `openspec workspace doctor`

Sprawdź, co jedna przestrzeń robocza może rozwiązać na bieżącej maszynie.

```bash
openspec workspace doctor [options]
```

Doctor wyświetla lokalizację przestrzeni roboczej, ścieżkę planowania, połączone repozytoria lub foldery, brakujące ścieżki, ścieżki specyfikacji lokalnych repozytoriów (jeśli istnieją) oraz sugerowane poprawki. Raportuje tylko problemy; nie naprawia ich automatycznie.

Polecenia wymagające jednej przestrzeni roboczej używają bieżącej przestrzeni roboczej, gdy są uruchamiane z wnętrza folderu lub podkatalogu przestrzeni roboczej. Z innego miejsca przekaż `--workspace <name>`, wybierz z selektora w terminalu interaktywnym lub polegaj na jedynej znanej przestrzeni roboczej, gdy istnieje dokładnie jedna. W trybie `--json` lub `--no-interactive` niejednoznaczny wybór kończy się błędem strukturalnego statusu i sugeruje `--workspace <name>`.

Odpowiedzi JSON wykorzystują typowane obiekty oraz tablice `status`. Dane główne znajdują się w `workspace`, `workspaces` lub `link`; ostrzeżenia i błędy znajdują się w `status`.

### `openspec workspace open`

Otwórz zestaw roboczy przestrzeni roboczej przez zapisane preferowane narzędzie otwierające, jednorazowe nadpisanie agenta lub tryb edytora VS Code.

```bash
openspec workspace open [name] [options]
```

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--workspace <name>` | Alias dla pozycyjnej nazwy przestrzeni roboczej |
| `--agent <tool>` | Jednorazowe nadpisanie agenta: `codex`, `claude` lub `github-copilot` |
| `--editor` | Otwórz utrzymywany plik przestrzeni roboczej VS Code jako normalną przestrzeń roboczą edytora |
| `--no-interactive` | Wyłącz monity wyboru przestrzeni roboczej i narzędzia otwierającego |

**Przykłady:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex
openspec workspace open --editor
```

`workspace open` używa bieżącej przestrzeni roboczej, gdy jest uruchamiany w jej wnętrzu, automatycznie wybiera jedyną znaną przestrzeń roboczą, gdy jest uruchamiany z innego miejsca, i prosi użytkownika o wybór, gdy znanych jest wiele przestrzeni roboczych. `--agent` i `--editor` nie zmieniają zapisanego preferowanego narzędzia otwierającego. Przekazanie obu nadpisań narzędzia otwierającego jest błędem; wybierz albo `--agent <tool>`, albo `--editor`.

OpenSpec utrzymuje `<workspace-name>.code-workspace` w katalogu głównym przestrzeni roboczej dla otwarć w edytorze VS Code i GitHub Copilot w VS Code. Ten plik jest lokalny dla maszyny i domyślnie ignorowany dzięki specjalnemu wpisowi `.gitignore` dla `<workspace-name>.code-workspace`, więc pliki `*.code-workspace` tworzone przez użytkownika pozostają kwalifikalne do śledzenia.

Utrzymywana przestrzeń robocza VS Code zawiera katalog główny koordynacji jako `.` oraz prawidłowe połączone repozytoria lub foldery jako dodatkowe korzenie. VS Code wyświetla te wpisy jako przestrzeń roboczą wielokorzeniową.

Otwieranie przestrzeni roboczej głównej obsługuje eksplorację i planowanie w połączonych repozytoriach lub folderach. Edycje implementacji powinny rozpocząć się dopiero po jawnym żądaniu użytkownika i normalnym przepływie pracy implementacji OpenSpec.

---

## Komendy przeglądania

### `openspec list`

Wyświetl zmiany lub specyfikacje w projekcie.

```
openspec list [opcje]
```

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--specs` | Wyświetl specyfikacje zamiast zmian |
| `--changes` | Wyświetl zmiany (domyślnie) |
| `--sort <kolejność>` | Sortuj wg `recent` (domyślnie) lub `name` |
| `--json` | Wyjście w formacie JSON |

**Przykłady:**

```bash
# Wyświetl wszystkie aktywne zmiany
openspec list

# Wyświetl wszystkie specyfikacje
openspec list --specs

# Wyjście JSON dla skryptów
openspec list --json
```

**Wyjście (tekst):**

```
Aktywne zmiany:
  add-dark-mode     Obsługa przełączania motywu interfejsu
  fix-login-bug     Obsługa przekroczenia czasu sesji
```

---

### `openspec view`

Wyświetl interaktywny panel do przeglądania specyfikacji i zmian.

```
openspec view
```

Otwiera interfejs terminalowy do nawigacji po specyfikacjach i zmianach w projekcie.

---

### `openspec show`

Wyświetl szczegóły zmiany lub specyfikacji.

```
openspec show [nazwa-elementu] [opcje]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `nazwa-elementu` | Nie | Nazwa zmiany lub specyfikacji (pytanie, jeśli pominięto) |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--type <typ>` | Określ typ: `change` lub `spec` (automatycznie wykryty, jeśli jednoznaczny) |
| `--json` | Wyjście w formacie JSON |
| `--no-interactive` | Wyłącz pytania |

**Opcje specyficzne dla zmian:**

| Opcja | Opis |
|--------|-------------|
| `--deltas-only` | Pokaż tylko specyfikacje delta (tryb JSON) |

**Opcje specyficzne dla specyfikacji:**

| Opcja | Opis |
|--------|-------------|
| `--requirements` | Pokaż tylko wymagania, wyklucz scenariusze (tryb JSON) |
| `--no-scenarios` | Wyklucz zawartość scenariuszy (tryb JSON) |
| `-r, --requirement <id>` | Pokaż konkretne wymaganie wg indeksu od 1 (tryb JSON) |

**Przykłady:**

```bash
# Interaktywny wybór
openspec show

# Pokaż konkretną zmianę
openspec show add-dark-mode

# Pokaż konkretną specyfikację
openspec show auth --type spec

# Wyjście JSON do parsowania
openspec show add-dark-mode --json
```

---

## Komendy walidacji

### `openspec validate`

Waliduj zmiany i specyfikacje pod kątem problemów strukturalnych.

```
openspec validate [nazwa-elementu] [opcje]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `nazwa-elementu` | Nie | Konkretny element do walidacji (pytanie, jeśli pominięto) |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--all` | Waliduj wszystkie zmiany i specyfikacje |
| `--changes` | Waliduj wszystkie zmiany |
| `--specs` | Waliduj wszystkie specyfikacje |
| `--type <typ>` | Określ typ, gdy nazwa jest niejednoznaczna: `change` lub `spec` |
| `--strict` | Włącz tryb ścisłej walidacji |
| `--json` | Wyjście w formacie JSON |
| `--concurrency <n>` | Maks. równoległych walidacji (domyślnie: 6 lub zmienna env `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Wyłącz pytania |

**Przykłady:**

```bash
# Interaktywna walidacja
openspec validate

# Waliduj konkretną zmianę
openspec validate add-dark-mode

# Waliduj wszystkie zmiany
openspec validate --changes

# Waliduj wszystko z wyjściem JSON (dla CI/skryptów)
openspec validate --all --json

# Ścisła walidacja ze zwiększonym stopniem równoległości
openspec validate --all --strict --concurrency 12
```

**Wyjście (tekst):**

```
Walidacja add-dark-mode...
  ✓ proposal.md prawidłowy
  ✓ specs/ui/spec.md prawidłowy
  ⚠ design.md: brak sekcji "Technical Approach"

Znaleziono 1 ostrzeżenie
```

**Wyjście (JSON):**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: brak sekcji 'Technical Approach'"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## Polecenia cyklu życia

### `openspec archive`

Archiwizuj zakończoną zmianę i scal specyfikacje delta z głównymi specyfikacjami.

```
openspec archive [change-name] [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `change-name` | Nie | Zmiana do archiwizacji (pytanie interaktywne, jeśli pominięto) |

**Opcje:**

| Opcja | Opis |
|-------|------|
| `-y, --yes` | Pomiń pytania o potwierdzenie |
| `--skip-specs` | Pomiń aktualizacje specyfikacji (dla zmian dotyczących tylko infrastruktury/narzędzi/dokumentacji) |
| `--no-validate` | Pomiń walidację (wymaga potwierdzenia) |

**Przykłady:**

```bash
# Interaktywna archiwizacja
openspec archive

# Archiwizacja konkretnej zmiany
openspec archive add-dark-mode

# Archiwizacja bez pytań (CI/skrypty)
openspec archive add-dark-mode --yes

# Archiwizacja zmiany narzędziowej, która nie wpływa na specyfikacje
openspec archive update-ci-config --skip-specs
```

**Co robi:**

1. Waliduje zmianę (chyba że `--no-validate`)
2. Pyta o potwierdzenie (chyba że `--yes`)
3. Scal specyfikacje delta do `openspec/specs/`
4. Przenosi folder zmiany do `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Polecenia przepływu pracy

Te polecenia wspierają przepływ pracy OPSX oparty na artefaktach. Są przydatne zarówno dla ludzi sprawdzających postęp, jak i agentów określających kolejne kroki.

### `openspec status`

Wyświetl status ukończenia artefaktów dla zmiany.

```
openspec status [options]
```

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--change <id>` | Nazwa zmiany (pytanie interaktywne, jeśli pominięto) |
| `--schema <name>` | Nadpisanie schematu (automatycznie wykrywane z konfiguracji zmiany) |
| `--json` | Wyjście w formacie JSON |

**Przykłady:**

```bash
# Interaktywne sprawdzenie statusu
openspec status

# Status dla konkretnej zmiany
openspec status --change add-dark-mode

# JSON dla agenta
openspec status --change add-dark-mode --json
```

**Wyjście (tekst):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

**Wyjście (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done"},
    {"id": "design", "outputPath": "design.md", "status": "ready"},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done"},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

Uzyskaj wzbogacone instrukcje do tworzenia artefaktu lub wdrażania zadań. Używane przez agentów AI do zrozumienia, co stworzyć dalej.

```
openspec instructions [artifact] [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `artifact` | Nie | ID artefaktu: `proposal`, `specs`, `design`, `tasks` lub `apply` |

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--change <id>` | Nazwa zmiany (wymagana w trybie nieinteraktywnym) |
| `--schema <name>` | Nadpisanie schematu |
| `--json` | Wyjście w formacie JSON |

**Przypadek specjalny:** Użyj `apply` jako artefaktu, aby uzyskać instrukcje implementacji zadań.

**Przykłady:**

```bash
# Uzyskaj instrukcje dla następnego artefaktu
openspec instructions --change add-dark-mode

# Uzyskaj instrukcje dla konkretnego artefaktu
openspec instructions design --change add-dark-mode

# Uzyskaj instrukcje wdrożenia/implementacji
openspec instructions apply --change add-dark-mode

# JSON dla agenta
openspec instructions design --change add-dark-mode --json
```

**Wyjście zawiera:**

- Treść szablonu dla artefaktu
- Kontekst projektu z konfiguracji
- Treść z artefaktów zależnych
- Reguły dla poszczególnych artefaktów z konfiguracji

---

### `openspec templates`

Pokaż rozstrzygnięte ścieżki szablonów dla wszystkich artefaktów w schemacie.

```
openspec templates [options]
```

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--schema <name>` | Schemat do inspekcji (domyślnie: `spec-driven`) |
| `--json` | Wyjście w formacie JSON |

**Przykłady:**

```bash
# Pokaż ścieżki szablonów dla domyślnego schematu
openspec templates

# Pokaż szablony dla niestandardowego schematu
openspec templates --schema my-workflow

# JSON do użytku programistycznego
openspec templates --json
```

**Wyjście (tekst):**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Wyświetl dostępne schematy przepływu pracy wraz z ich opisami i przepływami artefaktów.

```
openspec schemas [options]
```

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--json` | Wyjście w formacie JSON |

**Przykład:**

```bash
openspec schemas
```

**Wyjście:**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

---

## Polecenia schematów

Polecenia do tworzenia i zarządzania niestandardowymi schematami przepływu pracy.

### `openspec schema init`

Utwórz nowy schemat lokalny projektu.

```
openspec schema init <name> [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `name` | Tak | Nazwa schematu (kebab-case) |

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--description <text>` | Opis schematu |
| `--artifacts <list>` | Lista ID artefaktów oddzielonych przecinkami (domyślnie: `proposal,specs,design,tasks`) |
| `--default` | Ustaw jako domyślny schemat projektu |
| `--no-default` | Nie pytaj o ustawienie jako domyślny |
| `--force` | Nadpisz istniejący schemat |
| `--json` | Wyjście w formacie JSON |

**Przykłady:**

```bash
# Interaktywne tworzenie schematu
openspec schema init research-first

# Nieinteraktywne z konkretnymi artefaktami
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**Co tworzy:**

```
openspec/schemas/<name>/
├── schema.yaml           # Definicja schematu
└── templates/
    ├── proposal.md       # Szablon dla każdego artefaktu
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Skopiuj istniejący schemat do swojego projektu w celu dostosowania.

```
openspec schema fork <source> [name] [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `source` | Tak | Schemat do skopiowania |
| `name` | Nie | Nazwa nowego schematu (domyślnie: `<source>-custom`) |

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--force` | Nadpisz istniejący cel |
| `--json` | Wyjście w formacie JSON |

**Przykład:**

```bash
# Fork wbudowanego schematu spec-driven
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Waliduj strukturę i szablony schematu.

```
openspec schema validate [name] [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `name` | Nie | Schemat do walidacji (waliduje wszystkie, jeśli pominięto) |

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--verbose` | Pokaż szczegółowe kroki walidacji |
| `--json` | Wyjście w formacie JSON |

**Przykład:**

```bash
# Waliduj konkretny schemat
openspec schema validate my-workflow

# Waliduj wszystkie schematy
openspec schema validate
```

---

### `openspec schema which`

Pokaż, skąd rozstrzyga się schemat (przydatne do debugowania priorytetów).

```
openspec schema which [name] [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `name` | Nie | Nazwa schematu |

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--all` | Wyświetl wszystkie schematy wraz z ich źródłami |
| `--json` | Wyjście w formacie JSON |

**Przykład:**

```bash
# Sprawdź, skąd pochodzi schemat
openspec schema which spec-driven
```

**Wyjście:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Priorytet schematów:**

1. Projekt: `openspec/schemas/<name>/`
2. Użytkownik: `~/.local/share/openspec/schemas/<name>/`
3. Pakiet: Wbudowane schematy

---

## Komendy Konfiguracji

### `openspec config`

Wyświetl i modyfikuj globalną konfigurację OpenSpec.

```
openspec config <podkomenda> [opcje]
```

**Podkomendy:**

| Podkomenda | Opis |
|------------|------|
| `path` | Pokaż lokalizację pliku konfiguracyjnego |
| `list` | Pokaż wszystkie bieżące ustawienia |
| `get <klucz>` | Pobierz konkretną wartość |
| `set <klucz> <wartość>` | Ustaw wartość |
| `unset <klucz>` | Usuń klucz |
| `reset` | Przywróć wartości domyślne |
| `edit` | Otwórz w `$EDITOR` |
| `profile [preset]` | Skonfiguruj profil przepływu pracy interaktywnie lub za pomocą presetu |

**Przykłady:**

```bash
# Pokaż ścieżkę pliku konfiguracyjnego
openspec config path

# Wylistuj wszystkie ustawienia
openspec config list

# Pobierz konkretną wartość
openspec config get telemetry.enabled

# Ustaw wartość
openspec config set telemetry.enabled false

# Jawne ustawienie wartości tekstowej
openspec config set user.name "Moje Imię" --string

# Usuń niestandardowe ustawienie
openspec config unset user.name

# Resetuj całą konfigurację
openspec config reset --all --yes

# Edytuj konfigurację w edytorze
openspec config edit

# Skonfiguruj profil za pomocą kreatora opartego na akcjach
openspec config profile

# Szybki preset: przełącz przepływy pracy na rdzenne (zachowuje tryb dostarczania)
openspec config profile core
```

`openspec config profile` rozpoczyna się od podsumowania stanu bieżącego, a następnie pozwala wybrać:
- Zmień dostarczanie + przepływy pracy
- Zmień tylko dostarczanie
- Zmień tylko przepływy pracy
- Zachowaj bieżące ustawienia (zakończ)

Jeśli zachowasz bieżące ustawienia, żadne zmiany nie zostaną zapisane i nie zostanie wyświetlony monit o aktualizację.
Jeśli nie ma zmian w konfiguracji, ale bieżące pliki projektu są niezsynchronizowane z Twoim globalnym profilem/dostarczaniem, OpenSpec wyświetli ostrzeżenie i zasugeruje uruchomienie `openspec update`.
Naciśnięcie `Ctrl+C` również czysto anuluje przepływ (bez śladu stosu) i zakończy działanie z kodem `130`.
Na liście kontrolnej przepływów pracy `[x]` oznacza, że przepływ pracy jest wybrany w konfiguracji globalnej. Aby zastosować te wybory do plików projektu, uruchom `openspec update` (lub wybierz `Zastosuj zmiany do tego projektu teraz?` gdy zostaniesz o to zapytany wewnątrz projektu).

**Przykłady interaktywne:**

```bash
# Aktualizacja tylko dostarczania
openspec config profile
# wybierz: Zmień tylko dostarczanie
# wybierz dostarczanie: Tylko umiejętności

# Aktualizacja tylko przepływów pracy
openspec config profile
# wybierz: Zmień tylko przepływy pracy
# przełącz przepływy pracy na liście kontrolnej, a następnie potwierdź
```

---

## Komendy Narzędziowe

### `openspec feedback`

Prześlij opinię o OpenSpec. Tworzy zgłoszenie na GitHubie.

```
openspec feedback <wiadomość> [opcje]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `message` | Tak | Wiadomość zwrotna |

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--body <tekst>` | Szczegółowy opis |

**Wymagania:** GitHub CLI (`gh`) musi być zainstalowany i uwierzytelniony.

**Przykład:**

```bash
openspec feedback "Dodaj obsługę niestandardowych typów artefaktów" \
  --body "Chciałbym zdefiniować własne typy artefaktów wykraczające poza wbudowane."
```

---

### `openspec completion`

Zarządzaj uzupełnianiami powłoki dla CLI OpenSpec.

```
openspec completion <podkomenda> [powłoka]
```

**Podkomendy:**

| Podkomenda | Opis |
|------------|------|
| `generate [powłoka]` | Wygeneruj skrypt uzupełniający na stdout |
| `install [powłoka]` | Zainstaluj uzupełnianie dla Twojej powłoki |
| `uninstall [powłoka]` | Usuń zainstalowane uzupełniania |

**Obsługiwane powłoki:** `bash`, `zsh`, `fish`, `powershell`

**Przykłady:**

```bash
# Zainstaluj uzupełniania (automatycznie wykrywa powłokę)
openspec completion install

# Zainstaluj dla konkretnej powłoki
openspec completion install zsh

# Wygeneruj skrypt do ręcznej instalacji
openspec completion generate bash > ~/.bash_completion.d/openspec

# Odinstaluj
openspec completion uninstall
```

---

## Kody Wyjścia

| Kod | Znaczenie |
|-----|-----------|
| `0` | Sukces |
| `1` | Błąd (błąd walidacji, brakujące pliki itp.) |

---

## Zmienne Środowiskowe

| Zmienna | Opis |
|---------|------|
| `OPENSPEC_TELEMETRY` | Ustaw na `0`, aby wyłączyć telemetrię |
| `DO_NOT_TRACK` | Ustaw na `1`, aby wyłączyć telemetrię (standardowy sygnał DNT) |
| `OPENSPEC_CONCURRENCY` | Domyślna współbieżność dla masowej walidacji (domyślnie: 6) |
| `EDITOR` lub `VISUAL` | Edytor dla `openspec config edit` |
| `NO_COLOR` | Wyłącz kolorowe wyjście, gdy ustawione |

---

## Powiązana Dokumentacja

- [Komendy](commands.md) - Komendy ukośnikowe AI (`/opsx:propose`, `/opsx:apply` itp.)
- [Przepływy pracy](workflows.md) - Typowe wzorce i kiedy używać każdej komendy
- [Dostosowywanie](customization.md) - Tworzenie niestandardowych schematów i szablonów
- [Pierwsze kroki](getting-started.md) - Przewodnik po pierwszej konfiguracji