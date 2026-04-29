# Referencja CLI

CLI OpenSpec (`openspec`) udostępnia polecenia terminalowe do konfiguracji projektu, walidacji, inspekcji stanu i zarządzania. Polecenia te uzupełniają komendy AI slash (takie jak `/opsx:propose`) opisane w sekcji [Komendy](commands.md).

## Podsumowanie

| Kategoria | Polecenia | Przeznaczenie |
|-----------|-----------|---------------|
| **Konfiguracja** | `init`, `update` | Inicjalizacja i aktualizacja OpenSpec w projekcie |
| **Przeglądanie** | `list`, `view`, `show` | Eksploracja zmian i specyfikacji |
| **Walidacja** | `validate` | Sprawdzanie zmian i specyfikacji pod kątem problemów |
| **Cykl życia** | `archive` | Finalizacja zakończonych zmian |
| **Przepływ pracy** | `status`, `instructions`, `templates`, `schemas` | Wsparcie przepływu pracy opartego na artefaktach |
| **Schematy** | `schema init`, `schema fork`, `schema validate`, `schema which` | Tworzenie i zarządzanie niestandardowymi przepływami pracy |
| **Konfiguracja** | `config` | Przeglądanie i modyfikacja ustawień |
| **Narzędzia** | `feedback`, `completion` | Informacje zwrotne i integracja z powłoką |

---

## Polecenia dla ludzi a polecenia dla agentów

Większość poleceń CLI jest zaprojektowana do **użycia przez ludzi** w terminalu. Niektóre polecenia obsługują również **użycie przez agenty/skrypty** za pomocą wyjścia w formacie JSON.

### Polecenia tylko dla ludzi

Te polecenia są interaktywne i przeznaczone do użytku w terminalu:

| Polecenie | Cel |
|-----------|-----|
| `openspec init` | Inicjalizacja projektu (interaktywne monity) |
| `openspec view` | Interaktywny panel sterowania |
| `openspec config edit` | Otwórz konfigurację w edytorze |
| `openspec feedback` | Wyślij opinię przez GitHub |
| `openspec completion install` | Zainstaluj uzupełnienia powłoki |

### Polecenia kompatybilne z agentami

Te polecenia obsługują wyjście `--json` do programistycznego użycia przez agentów AI i skrypty:

| Polecenie | Użycie przez ludzi | Użycie przez agentów |
|-----------|-------------------|---------------------|
| `openspec list` | Przeglądanie zmian/specyfikacji | `--json` dla ustrukturyzowanych danych |
| `openspec show <element>` | Odczyt treści | `--json` do parsowania |
| `openspec validate` | Sprawdzanie problemów | `--all --json` do masowej walidacji |
| `openspec status` | Podgląd postępu artefaktów | `--json` dla ustrukturyzowanego statusu |
| `openspec instructions` | Uzyskanie kolejnych kroków | `--json` dla instrukcji dla agenta |
| `openspec templates` | Znalezienie ścieżek szablonów | `--json` do rozwiązywania ścieżek |
| `openspec schemas` | Lista dostępnych schematów | `--json` do odkrywania schematów |

---

## Opcje globalne

Te opcje działają ze wszystkimi poleceniami:

| Opcja | Opis |
|-------|------|
| `--version`, `-V` | Wyświetl numer wersji |
| `--no-color` | Wyłącz kolorowe wyjście |
| `--help`, `-h` | Wyświetl pomoc dla polecenia |

---

## Polecenia konfiguracyjne

### `openspec init`

Inicjalizuje OpenSpec w Twoim projekcie. Tworzy strukturę folderów i konfiguruje integracje z narzędziami AI.

Domyślne zachowanie używa globalnych ustawień domyślnych: profil `core`, dostarczanie `both`, przepływy pracy `propose, explore, apply, archive`.

```
openspec init [ścieżka] [opcje]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `ścieżka` | Nie | Katalog docelowy (domyślnie: bieżący katalog) |

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--tools <lista>` | Konfiguruj narzędzia AI w sposób nieinteraktywny. Użyj `all`, `none` lub listy oddzielonej przecinkami |
| `--force` | Automatycznie usuń przestarzałe pliki bez monitowania |
| `--profile <profil>` | Nadpisz globalny profil dla tego uruchomienia inicjalizacji (`core` lub `custom`) |

`--profile custom` używa przepływów pracy aktualnie wybranych w globalnej konfiguracji (`openspec config profile`).

**Obsługiwane identyfikatory narzędzi (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

**Przykłady:**

```bash
# Interaktywna inicjalizacja
openspec init

# Inicjalizacja w określonym katalogu
openspec init ./mój-projekt

# Nieinteraktywna: konfiguracja dla Claude i Cursor
openspec init --tools claude,cursor

# Konfiguracja dla wszystkich obsługiwanych narzędzi
openspec init --tools all

# Nadpisanie profilu dla tego uruchomienia
openspec init --profile core

# Pominięcie monitów i automatyczne usunięcie przestarzałych plików
openspec init --force
```

**Co tworzy:**

```
openspec/
├── specs/              # Twoje specyfikacje (źródło prawdy)
├── changes/            # Proponowane zmiany
└── config.yaml         # Konfiguracja projektu

.claude/skills/         # Umiejętności Claude Code (jeśli wybrano claude)
.cursor/skills/         # Umiejętności Cursor (jeśli wybrano cursor)
.cursor/commands/       # Polecenia OPSX dla Cursor (jeśli dostarczanie obejmuje polecenia)
... (inne konfiguracje narzędzi)
```

---

### `openspec update`

Aktualizuje pliki instrukcji OpenSpec po uaktualnieniu CLI. Ponownie generuje pliki konfiguracyjne narzędzi AI, używając Twojego aktualnego globalnego profilu, wybranych przepływów pracy i trybu dostarczania.

```
openspec update [ścieżka] [opcje]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `ścieżka` | Nie | Katalog docelowy (domyślnie: bieżący katalog) |

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--force` | Wymuś aktualizację nawet wtedy, gdy pliki są aktualne |

**Przykład:**

```bash
# Aktualizacja plików instrukcji po uaktualnieniu npm
npm update @fission-ai/openspec
openspec update
```

---

## Polecenia przeglądania

### `openspec list`

Wyświetla listę zmian lub specyfikacji w Twoim projekcie.

```
openspec list [opcje]
```

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--specs` | Wyświetl specyfikacje zamiast zmian |
| `--changes` | Wyświetl zmiany (domyślnie) |
| `--sort <kolejność>` | Sortuj według `recent` (domyślnie) lub `name` |
| `--json` | Wyjście w formacie JSON |

**Przykłady:**

```bash
# Wyświetlenie wszystkich aktywnych zmian
openspec list

# Wyświetlenie wszystkich specyfikacji
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

Wyświetla interaktywny panel do przeglądania specyfikacji i zmian.

```
openspec view
```

Otwiera interfejs oparty na terminalu do nawigacji po specyfikacjach i zmianach Twojego projektu.

---

### `openspec show`

Wyświetla szczegóły zmiany lub specyfikacji.

```
openspec show [nazwa-elementu] [opcje]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `nazwa-elementu` | Nie | Nazwa zmiany lub specyfikacji (monituje, jeśli pominięto) |

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--type <typ>` | Określ typ: `change` lub `spec` (wykrywany automatycznie, jeśli jednoznaczny) |
| `--json` | Wyjście w formacie JSON |
| `--no-interactive` | Wyłącz monity |

**Opcje specyficzne dla zmian:**

| Opcja | Opis |
|-------|------|
| `--deltas-only` | Wyświetl tylko specyfikacje delta (tryb JSON) |

**Opcje specyficzne dla specyfikacji:**

| Opcja | Opis |
|-------|------|
| `--requirements` | Wyświetl tylko wymagania, wyklucz scenariusze (tryb JSON) |
| `--no-scenarios` | Wyklucz treść scenariuszy (tryb JSON) |
| `-r, --requirement <id>` | Wyświetl konkretne wymaganie według indeksu od 1 (tryb JSON) |

**Przykłady:**

```bash
# Interaktywny wybór
openspec show

# Wyświetlenie konkretnej zmiany
openspec show add-dark-mode

# Wyświetlenie konkretnej specyfikacji
openspec show auth --type spec

# Wyjście JSON do parsowania
openspec show add-dark-mode --json
```

---

## Polecenia walidacji

### `openspec validate`

Waliduje zmiany i specyfikacje pod kątem problemów strukturalnych.

```
openspec validate [nazwa-elementu] [opcje]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `nazwa-elementu` | Nie | Konkretny element do walidacji (monituje, jeśli pominięto) |

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--all` | Waliduj wszystkie zmiany i specyfikacje |
| `--changes` | Waliduj wszystkie zmiany |
| `--specs` | Waliduj wszystkie specyfikacje |
| `--type <typ>` | Określ typ, gdy nazwa jest niejednoznaczna: `change` lub `spec` |
| `--strict` | Włącz tryb ścisłej walidacji |
| `--json` | Wyjście w formacie JSON |
| `--concurrency <n>` | Maksymalna liczba równoległych walidacji (domyślnie: 6 lub zmienna środowiskowa `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Wyłącz monity |

**Przykłady:**

```bash
# Interaktywna walidacja
openspec validate

# Walidacja konkretnej zmiany
openspec validate add-dark-mode

# Walidacja wszystkich zmian
openspec validate --changes

# Walidacja wszystkiego z wyjściem JSON (dla CI/skryptów)
openspec validate --all --json

# Ścisła walidacja ze zwiększonym równoległością
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
        "warnings": ["design.md: missing 'Technical Approach' section"]
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

Archiwizuje zakończoną zmianę i scala specyfikacje delta z głównymi specyfikacjami.

```
openspec archive [nazwa-zmiany] [opcje]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `nazwa-zmiany` | Nie | Zmiana do zarchiwizowania (monituje, jeśli pominięto) |

**Opcje:**

| Opcja | Opis |
|-------|------|
| `-y, --yes` | Pomiń monity potwierdzające |
| `--skip-specs` | Pomiń aktualizacje specyfikacji (dla zmian dotyczących tylko infrastruktury/narzędzi/dokumentacji) |
| `--no-validate` | Pomiń walidację (wymaga potwierdzenia) |

**Przykłady:**

```bash
# Interaktywna archiwizacja
openspec archive

# Archiwizacja konkretnej zmiany
openspec archive add-dark-mode

# Archiwizacja bez monitów (CI/skrypty)
openspec archive add-dark-mode --yes

# Archiwizacja zmiany narzędziowej, która nie wpływa na specyfikacje
openspec archive update-ci-config --skip-specs
```

**Co robi:**

1. Waliduje zmianę (chyba że `--no-validate`)
2. Monituje o potwierdzenie (chyba że `--yes`)
3. Scala specyfikacje delta do `openspec/specs/`
4. Przenosi folder zmiany do `openspec/changes/archive/YYYY-MM-DD-<nazwa>/`

---

## Polecenia przepływu pracy

Te polecenia obsługują przepływ pracy OPSX oparty na artefaktach. Są przydatne zarówno dla ludzi sprawdzających postęp, jak i agentów określających kolejne kroki.

### `openspec status`

Wyświetla status ukończenia artefaktów dla zmiany.

```
openspec status [opcje]
```

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--change <id>` | Nazwa zmiany (monituje, jeśli pominięto) |
| `--schema <nazwa>` | Nadpisanie schematu (wykrywane automatycznie z konfiguracji zmiany) |
| `--json` | Wyjście w formacie JSON |

**Przykłady:**

```bash
# Interaktywne sprawdzanie statusu
openspec status

# Status dla konkretnej zmiany
openspec status --change add-dark-mode

# JSON dla użycia przez agenta
openspec status --change add-dark-mode --json
```

**Wyjście (tekst):**

```
Zmiana: add-dark-mode
Schemat: spec-driven
Postęp: 2/4 artefaktów ukończonych

[x] proposal
[ ] design
[x] specs
[-] tasks (zablokowane przez: design)
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

Uzyskuje wzbogacone instrukcje tworzenia artefaktu lub realizacji zadań. Używane przez agentów AI do zrozumienia, co należy stworzyć dalej.

```
openspec instructions [artefakt] [opcje]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `artefakt` | Nie | ID artefaktu: `proposal`, `specs`, `design`, `tasks` lub `apply` |

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--change <id>` | Nazwa zmiany (wymagana w trybie nieinteraktywnym) |
| `--schema <nazwa>` | Nadpisanie schematu |
| `--json` | Wyjście w formacie JSON |

**Przypadek specjalny:** Użyj `apply` jako artefaktu, aby uzyskać instrukcje realizacji zadań.

**Przykłady:**

```bash
# Uzyskanie instrukcji dla następnego artefaktu
openspec instructions --change add-dark-mode

# Uzyskanie instrukcji dla konkretnego artefaktu
openspec instructions design --change add-dark-mode

# Uzyskanie instrukcji realizacji/zastosowania
openspec instructions apply --change add-dark-mode

# JSON dla zużycia przez agenta
openspec instructions design --change add-dark-mode --json
```

**Wyjście obejmuje:**

- Treść szablonu dla artefaktu
- Kontekst projektu z konfiguracji
- Treść z artefaktów zależnych
- Zasady dla poszczególnych artefaktów z konfiguracji

---

### `openspec templates`

Wyświetla rozstrzygnięte ścieżki szablonów dla wszystkich artefaktów w schemacie.

```
openspec templates [opcje]
```

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--schema <nazwa>` | Schemat do sprawdzenia (domyślnie: `spec-driven`) |
| `--json` | Wyjście w formacie JSON |

**Przykłady:**

```bash
# Wyświetlenie ścieżek szablonów dla domyślnego schematu
openspec templates

# Wyświetlenie szablonów dla niestandardowego schematu
openspec templates --schema mój-przepływ

# JSON do użycia programistycznego
openspec templates --json
```

**Wyjście (tekst):**

```
Schemat: spec-driven

Szablony:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Wyświetla listę dostępnych schematów przepływu pracy z ich opisami i przepływami artefaktów.

```
openspec schemas [opcje]
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
Dostępne schematy:

  spec-driven (pakiet)
    Domyślny przepływ pracy oparty na specyfikacjach
    Przepływ: proposal → specs → design → tasks

  mój-niestandardowy (projekt)
    Niestandardowy przepływ pracy dla tego projektu
    Przepływ: research → proposal → tasks
```

---

## Polecenia schematów

Polecenia do tworzenia i zarządzania niestandardowymi schematami przepływów pracy.

### `openspec schema init`

Tworzy nowy, lokalny dla projektu schemat.

```
openspec schema init <nazwa> [opcje]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `nazwa` | Tak | Nazwa schematu (format kebab-case) |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--description <tekst>` | Opis schematu |
| `--artifacts <lista>` | Lista identyfikatorów artefaktów oddzielona przecinkami (domyślnie: `proposal,specs,design,tasks`) |
| `--default` | Ustaw jako domyślny schemat projektu |
| `--no-default` | Nie pytaj o ustawienie jako domyślny |
| `--force` | Nadpisz istniejący schemat |
| `--json` | Wyjście w formacie JSON |

**Przykłady:**

```bash
# Interaktywne tworzenie schematu
openspec schema init research-first

# Nieinteraktywne z określonymi artefaktami
openspec schema init rapid \
  --description "Schemat szybkiej iteracji" \
  --artifacts "proposal,tasks" \
  --default
```

**Co zostaje utworzone:**

```
openspec/schemas/<nazwa>/
├── schema.yaml           # Definicja schematu
└── templates/
    ├── proposal.md       # Szablon dla każdego artefaktu
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Kopiuje istniejący schemat do Twojego projektu w celu dostosowania.

```
openspec schema fork <źródło> [nazwa] [opcje]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `źródło` | Tak | Schemat do skopiowania |
| `nazwa` | Nie | Nowa nazwa schematu (domyślnie: `<źródło>-custom`) |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--force` | Nadpisz istniejący cel |
| `--json` | Wyjście w formacie JSON |

**Przykład:**

```bash
# Skopiuj wbudowany schemat spec-driven
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Waliduje strukturę i szablony schematu.

```
openspec schema validate [nazwa] [opcje]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `nazwa` | Nie | Schemat do walidacji (jeśli pominięto, waliduje wszystkie) |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--verbose` | Pokaż szczegółowe kroki walidacji |
| `--json` | Wyjście w formacie JSON |

**Przykład:**

```bash
# Walidacja konkretnego schematu
openspec schema validate my-workflow

# Walidacja wszystkich schematów
openspec schema validate
```

---

### `openspec schema which`

Wyświetla, skąd rozwiązuje się dany schemat (przydatne do debugowania priorytetów).

```
openspec schema which [nazwa] [opcje]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `nazwa` | Nie | Nazwa schematu |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--all` | Wylistuj wszystkie schematy wraz z ich źródłami |
| `--json` | Wyjście w formacie JSON |

**Przykład:**

```bash
# Sprawdź, skąd pochodzi schemat
openspec schema which spec-driven
```

**Wyjście:**

```
spec-driven rozwiązuje się z: package
  Źródło: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Priorytet schematów:**

1. Projekt: `openspec/schemas/<nazwa>/`
2. Użytkownik: `~/.local/share/openspec/schemas/<nazwa>/`
3. Pakiet: Wbudowane schematy

---

## Polecenia konfiguracji

### `openspec config`

Wyświetla i modyfikuje globalną konfigurację OpenSpec.

```
openspec config <podpolecenie> [opcje]
```

**Podpolecenia:**

| Podpolecenie | Opis |
|------------|-------------|
| `path` | Pokaż lokalizację pliku konfiguracyjnego |
| `list` | Pokaż wszystkie bieżące ustawienia |
| `get <klucz>` | Pobierz wartość dla konkretnego klucza |
| `set <klucz> <wartość>` | Ustaw wartość |
| `unset <klucz>` | Usuń klucz |
| `reset` | Przywróć ustawienia domyślne |
| `edit` | Otwórz w `$EDITOR` |
| `profile [preset]` | Konfiguruj profil przepływu pracy interaktywnie lub za pomocą presetu |

**Przykłady:**

```bash
# Pokaż ścieżkę do pliku konfiguracyjnego
openspec config path

# Wylistuj wszystkie ustawienia
openspec config list

# Pobierz wartość konkretnego klucza
openspec config get telemetry.enabled

# Ustaw wartość
openspec config set telemetry.enabled false

# Jawne ustawienie wartości tekstowej
openspec config set user.name "Moja Nazwa" --string

# Usuń niestandardowe ustawienie
openspec config unset user.name

# Resetuj całą konfigurację
openspec config reset --all --yes

# Edytuj konfigurację w edytorze
openspec config edit

# Konfiguruj profil za pomocą kreatora opartego na akcjach
openspec config profile

# Szybki preset: przełącz przepływy pracy na core (zachowuje tryb dostarczania)
openspec config profile core
```

`openspec config profile` rozpoczyna się od podsumowania stanu bieżącego, a następnie pozwala wybrać:
- Zmień tryb dostarczania + przepływy pracy
- Zmień tylko tryb dostarczania
- Zmień tylko przepływy pracy
- Zachowaj bieżące ustawienia (zakończ)

Jeśli zachowasz bieżące ustawienia, żadne zmiany nie zostaną zapisane i nie pojawi się monit o aktualizację.
Jeśli nie ma zmian w konfiguracji, ale bieżące pliki projektu są niespójne z Twoim globalnym profilem/trybem dostarczania, OpenSpec wyświetli ostrzeżenie i zasugeruje uruchomienie `openspec update`.
Naciśnięcie `Ctrl+C` również czysto przerywa przepływ (bez śladu stosu) i kończy z kodem wyjścia `130`.
Na liście kontrolnej przepływów pracy, `[x]` oznacza, że przepływ pracy jest wybrany w konfiguracji globalnej. Aby zastosować te wybory do plików projektu, uruchom `openspec update` (lub wybierz `Zastosuj zmiany do tego projektu teraz?` gdy pojawi się monit wewnątrz projektu).

**Przykłady interaktywne:**

```bash
# Aktualizacja tylko trybu dostarczania
openspec config profile
# wybierz: Zmień tylko tryb dostarczania
# wybierz tryb dostarczania: Tylko umiejętności

# Aktualizacja tylko przepływów pracy
openspec config profile
# wybierz: Zmień tylko przepływy pracy
# przełącz przepływy pracy na liście kontrolnej, a następnie potwierdź
```

---

## Polecenia pomocnicze

### `openspec feedback`

Prześlij opinię na temat OpenSpec. Tworzy zgłoszenie na GitHubie.

```
openspec feedback <wiadomość> [opcje]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `wiadomość` | Tak | Treść opinii |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--body <tekst>` | Szczegółowy opis |

**Wymagania:** Musi być zainstalowany i uwierzytelniony klient GitHub CLI (`gh`).

**Przykład:**

```bash
openspec feedback "Dodaj obsługę niestandardowych typów artefaktów" \
  --body "Chciałbym definiować własne typy artefaktów wykraczające poza wbudowane."
```

---

### `openspec completion`

Zarządzaj uzupełnianiem poleceń w powłoce dla CLI OpenSpec.

```
openspec completion <podpolecenie> [powłoka]
```

**Podpolecenia:**

| Podpolecenie | Opis |
|------------|-------------|
| `generate [powłoka]` | Wygeneruj skrypt uzupełniania na standardowe wyjście |
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

## Kody wyjścia

| Kod | Znaczenie |
|------|---------|
| `0` | Sukces |
| `1` | Błąd (niepowodzenie walidacji, brakujące pliki itp.) |

---

## Zmienne środowiskowe

| Zmienna | Opis |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Ustaw na `0`, aby wyłączyć telemetrię |
| `DO_NOT_TRACK` | Ustaw na `1`, aby wyłączyć telemetrię (standardowy sygnał DNT) |
| `OPENSPEC_CONCURRENCY` | Domyślna liczba równoległych operacji dla walidacji zbiorczej (domyślnie: 6) |
| `EDITOR` lub `VISUAL` | Edytor dla `openspec config edit` |
| `NO_COLOR` | Wyłącza kolorowe wyjście, gdy jest ustawiona |

---

## Powiązana dokumentacja

- [Polecenia](commands.md) - Polecenia sztucznej inteligencji (`/opsx:propose`, `/opsx:apply` itp.)
- [Przepływy pracy](workflows.md) - Popularne wzorce i kiedy używać danego polecenia
- [Dostosowywanie](customization.md) - Twórz niestandardowe schematy i szablony
- [Pierwsze kroki](getting-started.md) - Przewodnik konfiguracji na start