# Odniesienie do interfejsu wiersza poleceń (CLI)

OpenSpec CLI (`openspec`) zapewnia komendy terminalowe do konfiguracji projektu, walidacji, inspekcji statusu i zarządzania. Te komendy uzupełniają komendy z `/` AI (takie jak `/opsx:propose`), udokumentowane w [Commands](commands.md).

## Podsumowanie

| Kategoria | Komendy | Cel |
|----------|----------|---------|
| **Konfiguracja** | `init`, `update` | Inicjalizacja i aktualizacja OpenSpec w Twoim projekcie |
| **Magazyny (standalone OpenSpec repos)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Zarządzanie magazynami — samodzielnymi repozytoriami OpenSpec, które zarejestrowałeś |
| **Stan** | `doctor` | Raportowanie stanu relacji dla rozstrzygniętego korzenia |
| **Kontekst roboczy** | `context` | Składanie zbioru roboczego (korzeń + odwołane magazyny) |
| **Osobiste zbiory pracy** | `workset create`, `workset list`, `workset open`, `workset remove` | Przechowywanie i otwieranie osobistych, lokalnych widoków roboczych w Twoim narzędziu |
| **Przeglądanie** | `list`, `view`, `show` | Eksplorowanie zmian i specyfikacji |
| **Walidacja** | `validate` | Sprawdzanie zmian i specyfikacji pod kątem problemów |
| **Cykl życia** | `archive` | Finalizowanie ukończonych zmian |
| **Przepływ pracy** | `new change`, `status`, `instructions`, `templates`, `schemas` | Obsługa przepływu pracy oparta na artefaktach |
| **Schematy** | `schema init`, `schema fork`, `schema validate`, `schema which` | Tworzenie i zarządzanie niestandardowymi przepływami pracy |
| **Konfiguracja** | `config` | Wyświetlanie i modyfikowanie ustawień |
| **Użyteczność** | `feedback`, `completion` | Informacja zwrotna i integracja z powłoką (shell) |

---

## Komendy dla człowieka a agenta

Większość komend CLI jest przeznaczona do **użycia przez człowieka** w terminalu. Niektóre komendy obsługują również **użycie przez agenta/skrypt** poprzez wyjście JSON.

### Komendy tylko dla człowieka

Te komendy są interaktywne i przeznaczone do użytku w terminalu:

| Komenda | Cel |
|---------|---------|
| `openspec init` | Inicjalizacja projektu (interaktywne podpowiedzi) |
| `openspec view` | Interaktywna tablica (dashboard) |
| `openspec workset open <name>` | Otwarcie zapisanej pracy (okno edytora lub sesja agenta terminalowego) |
| `openspec config edit` | Otwarcie konfiguracji w edytorze |
| `openspec feedback` | Przesłanie opinii przez GitHub |
| `openspec completion install` | Instalacja kompletów poleceń dla powłoki (shell completions) |

### Komendy kompatybilne z agentami

Te komendy obsługują wyjście `--json` do programatycznego użycia przez AI agents i skrypty:

| Komenda | Użycie ludzkie | Użycie agenta |
|---------|-----------|-----------|
| `openspec list` | Przegląd zmian/specyfikacji | `--json` dla ustrukturyzowanych danych |
| `openspec show <item>` | Odczyt treści | `--json` do parsowania |
| `openspec validate` | Sprawdzenie problemów | `--all --json` do walidacji zbiorczej |
| `openspec status` | Wyświetlenie postępu artefaktu | `--json` dla ustrukturyzowanego statusu |
| `openspec instructions` | Pobranie kolejnych kroków | `--json` dla instrukcji agenta |
| `openspec templates` | Znalezienie ścieżek szablonów | `--json` do rozwiązywania ścieżek |
| `openspec schemas` | Lista dostępnych schematów | `--json` do odkrywania schematów |
| `openspec store setup <id>` | Utworzenie i zarejestrowanie lokalnego magazynu (store) | `--json` z wyraźnymi danymi wejściowymi dla ustrukturyzowanego wyjścia konfiguracji |
| `openspec store register <path>` | Rejestracja istniejącego magazynu | `--json` dla ustrukturyzowanego wyjścia rejestracji |
| `openspec store unregister <id>` | Zapomnienie o lokalnej rejestracji magazynu | `--json` dla ustrukturyzowanego wyjścia czyszczenia |
| `openspec store remove <id>` | Usunięcie zarejestrowanego folderu magazynu | `--yes --json` do nieinteraktywnego usuwania |
| `openspec store list` | Przegląd zarejestrowanych magazynów | `--json` dla ustrukturyzowanych rejestracji |
| `openspec store doctor` | Sprawdzenie konfiguracji lokalnego magazynu | `--json` dla ustrukturyzowanej diagnostyki |
| `openspec new change <id>` | Utworzenie szkieletu zmiany specyficznej dla repozytorium | `--json`, plus `--store <id>` do użycia zarejestrowanego magazynu jako korzenia OpenSpec |
| `openspec workset create [name]` | Skomponowanie osobistego widoku roboczego | `--member <path> --json` do nieinteraktywnego komponowania |
| `openspec workset list` | Przegląd zapisanych widoków | `--json` dla ustrukturyzowanych widoków |
| `openspec workset remove <name>` | Usunięcie zapisanego widoku | `--yes --json` do nieinteraktywnego usuwania |

---

## Opcje globalne

Te opcje działają z wszystkimi komendami:

| Opcja | Opis |
|--------|-------------|
| `--version`, `-V` | Wyświetlenie numeru wersji |
| `--no-color` | Wyłączenie kolorowego wyjścia |
| `--help`, `-h` | Wyświetlenie pomocy dla komendy |

---

## Komendy konfiguracji (Setup Commands)

### `openspec init`

Inicjalizuje OpenSpec w Twoim projekcie. Tworzy strukturę folderów i konfigurowuje integracje z narzędziami AI.

Domyślne zachowanie używa domyślnych globalnych ustawień: profil `core`, dostawa `both`, przepływy pracy `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `path` | Nie | Docelowy katalog (domyślnie: bieżący katalog) |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--tools <list>` | Konfiguruje narzędzia AI w sposób nieinteraktywny. Użyj `all`, `none` lub listy oddzielonej przecinkami |
| `--force` | Automatyczne czyszczenie starych plików bez pytania |
| `--profile <profile>` | Nadpisanie globalnego profilu dla tego uruchomienia inicjalizacji (`core` lub `custom`) |

Opcja `--profile custom` używa przepływów pracy wybranych w bieżącej konfiguracji globalnej (`openspec config profile`).

**Obsługiwane identyfikatory narzędzi (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

> Ta lista odzwierciedla `AI_TOOLS` w `src/core/config.ts`. Sprawdź [Supported Tools](supported-tools.md) dla umiejętności i ścieżek komend każdego narzędzia.

**Przykłady:**

```bash
# Inicjalizacja interaktywna
openspec init

# Inicjalizacja w konkretnym katalogu
openspec init ./my-project

# Nieinteraktywnie: konfiguracja dla Claude i Cursor
openspec init --tools claude,cursor

# Konfiguracja dla wszystkich obsługiwanych narzędzi
openspec init --tools all

# Nadpisanie profilu dla tego uruchomienia
openspec init --profile core

# Pomiń podpowiedzi i automatycznie wyczyść stare pliki
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
.cursor/commands/       # Komendy OPSX dla Cursor (jeśli dostawa zawiera komendy)
... (inne konfiguracje narzędzi)
```

---

### `openspec update`

Aktualizuje pliki instrukcji OpenSpec po uaktualnieniu CLI. Ponownie generuje pliki konfiguracji narzędzi AI, używając Twojego aktualnego globalnego profilu, wybranych przepływów pracy i trybu dostawy.

```
openspec update [path] [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `path` | Nie | Docelowy katalog (domyślnie: bieżący katalog) |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--force` | Wymusza aktualizację, nawet jeśli pliki są aktualne |

**Przykład:**

```bash
# Aktualizacja plików instrukcji po npm upgrade
npm update @fission-ai/openspec
openspec update
```

---

## Magazyny (Stores - samodzielne repozytoria OpenSpec)

> **Beta.** Magazyny i funkcje oparte na nich (odniesienia, kontekst pracy, worksety) są nowe; nazwy komend, flagi, formaty plików i wyjście JSON mogą się zmieniać między wydaniami. W celu przejścia przez proces oparty na problemie, sprawdź [stores guide](stores-beta/user-guide.md).

Magazyn (store) to samodzielne repozytorium OpenSpec zarejestrowane w tej maszynie — na przykład repozytorium planistyczne lub kontrakty. Rejestracja magazynu pozwala normalnym komendom (`list`, `show`, `status`, `validate`, `new change`, `archive`, ...) działać w nim z dowolnego miejsca, przekazując `--store <id>`.

### `openspec store setup`

Tworzy i rejestruje lokalny magazyn. Bez argumentów w terminalu OpenSpec prowadzi użytkownika przez konfigurację. Agenci i skrypty powinny podawać wyraźne dane wejściowe i używać `--json`.

```bash
openspec store setup [id] [options]
```

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--path <path>` | Folder, w którym ma się znajdować magazyn (np. `~/openspec/<id>`) |
| `--remote <url>` | Rejestruje kanoniczny zdalny adres w pliku `store.yaml` nowego magazynu |
| `--init-git` | Inicjalizuje repozytorium Git z początkowym commitem (domyślnie) |
| `--no-init-git` | Pomija każdą akcję Git: brak inicjalizacji, brak początkowego commitu |
| `--json` | Wyjście JSON |

Uruchomienia nieinteraktywne (`--json`, skrypty, agenci) muszą podawać zarówno id magazynu, jak i `--path`. W interaktywnym terminalu konfiguracja pyta o lokalizację z edytowalną sugestią w widocznym miejscu należącym do użytkownika (np. `~/openspec/<id>`); nigdy nie domyślnie używa katalogu danych zarządzanego przez OpenSpec.

Przykłady:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Rejestruje istniejący lokalny folder magazynu.

```bash
openspec store register [path] [options]
```

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--id <id>` | Id magazynu; domyślnie jest to metadane magazynu lub nazwa folderu |
| `--yes` | Potwierdza utworzenie metadanych tożsamości magazynu dla zdrowego korzenia OpenSpec |
| `--json` | Wyjście JSON |

### `openspec store unregister`

Zapomina o rejestracji lokalnego magazynu bez usuwania plików.

```bash
openspec store unregister <id> [--json]
```

Używaj tego, gdy magazyn został przeniesiony, sklonowany gdzie indziej lub nie powinien już być wyświetlany przez OpenSpec w tej maszynie.

### `openspec store remove`

Zapomina o rejestracji lokalnego magazynu i usuwa jego lokalny folder.

```bash
openspec store remove <id> [--yes] [--json]
```

Polecenie `remove` pokazuje dokładny folder przed usunięciem w interaktywnym terminalu. Agenci, skrypty i wywołujący JSON muszą użyć `--yes`, aby potwierdzić usunięcie. OpenSpec odmawia usunięcia folderu, który nie zawiera pasujących metadanych magazynu.

### `openspec store list`

Wyszukuje lokalnie zarejestrowane magazyny.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Sprawdza rejestrację lokalnego magazynu, metadane i obecność Git.

```bash
openspec store doctor [id] [--json]
```

Doctor jest przeznaczony wyłącznie do diagnostyki; raportuje brakujące korzenie, niezgodności metadanych i nieprawidłowy stan lokalnej rejestracji bez modyfikowania magazynu.

### Odwoływanie się do magazynów z projektu

Repozytorium projektu może deklarować, z jakich magazynów korzysta jego praca w pliku `openspec/config.yaml`:

```yaml
schema: spec-driven
references:
  - team-context
```

Od tego momentu wyjście `openspec instructions` w tym repozytorium (zarówno na poziomie poszczególnych artefaktów, jak i powierzchni `apply`, tryby JSON i ludzkie) zawiera indeks specyfikacji każdego odwołanego magazynu — identyfikatory specyfikacji, jednowersyjny podsumowanie z sekcji Celu (`Purpose`) każdej specyfikacji oraz komendę pobrania (`openspec show <spec-id> --type spec --store <id>`). Indeks jest budowany na żywo z zarejestrowanego checkouta przy każdym uruchomieniu; zawartość specyfikacji nigdy nie jest kopiowana do wyjścia.

Odwołania są kontekstem tylko do odczytu. Nigdy nie zmieniają miejsca działania komend: praca pozostaje w własnym korzeniu repozytorium, a zapis do odwoływanego magazynu pozostaje jawną akcją `--store`. Odwołanie, które nie może zostać rozwiązane (na przykład magazyn niezarejestrowany w tej maszynie), degradowuje się do ostrzeżenia w indeksie z dokładnym sposobem naprawy, a instrukcje nadal są generowane. `openspec doctor` raportuje stan odwołań w jednym miejscu.

### Rejestrowanie źródła klonowania magazynu

Magazyn może rejestrować swoje kanoniczne źródło klonowania w swoim zatwierdzonym pliku tożsamości, dzięki czemu proces onboardingu nigdy nie kończy się na "zarejestruj magazyn":

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

Zdalny adres trafia do `.openspec-store/store.yaml` wewnątrz początkowego commitu, więc każdy klon jest świadomy tego od początku. Dla istniejącego magazynu edytuj `store.yaml` ręcznie i zatwierdź zmiany. `store doctor` pokazuje zarejestrowany zdalny adres (i zaobserwowany Git origin checkouta); setup/register podaje nazwy wskazówek; a register rejestruje origin checkouta w lokalnej rejestracji maszyny.

Deklaracja odwołania może również zawierać źródło klonowania, dzięki czemu kolega, który jeszcze nie ma magazynu, otrzymuje kompletne, kopiowalne rozwiązanie (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

Rejestrowanie zdalnego adresu nie jest synchronizacją: OpenSpec nigdy sam nie klonuje, pobiera ani nie wysyła.

### Deklarowanie domyślnego magazynu

Repozytorium, którego planowanie jest w pełni zexternalizowane — bez lokalnych `openspec/specs/` lub `openspec/changes/` — może zadeklarować swój magazyn raz zamiast podawać `--store` przy każdej komendzie:

```yaml
# openspec/config.yaml (jedyny plik wewnątrz openspec/)
store: team-context
```

Normalne komendy automatycznie rozwiązują się do zadeklarowanego magazynu; baner korzenia i blok `root` JSON raportują `source: "declared"` wraz z id magazynu, a wyświetlane podpowiedzi nadal zawierają `--store <id>`. Deklaracja jest opcją zapasową, nigdy nadpisuje: jawne `--store` zawsze wygrywa, a katalog z prawdziwymi folderami planowania ignoruje wskaźnik (z ostrzeżeniem). Aby przekonwertować repozytorium wskazujące na lokalny korzeń OpenSpec, usuń linię `store:` i uruchom `openspec init` — inicjalizacja odmawia tworzenia szkieletu, gdy deklaracja jest obecna.

## Doctor (zdrowie relacji)

Jedno pytanie tylko do odczytu, jedno miejsce: czy korzeń OpenSpec jest zdrowy, a przechowywane w nim repozytoria są dostępne na tej maszynie?

```bash
openspec doctor [--store <id>] [--json]
```

Raport rozdziela stan zdrowia korzenia, metadane magazynów (w tym informację o rozbieżności między zarejestrowanym zdalnym a pochodzeniem checkoutu) oraz stan referencji (te same instrukcje diagnostyczne, z poprawkami klonowania dla nierozstrzygniętych referencji). Wyniki stanu zdrowia dowolnej wagi powodują wyjście 0 — agenci odczytują tablice `status`; tylko błędy poleceń (brak korzenia, nieznany magazyn) powodują wyjście 1. Doctor nigdy nie klonuje, nie synchronizuje ani nie naprawia. Aby uzyskać sam zebrany zbiór, a nie jego stan zdrowia, użyj `openspec context`.

## Kontekst roboczy (zebrany zbiór)

Wszystko, do czego ten mechanizm się odnosi za pomocą deklaracji OpenSpec, w jednym zestawie roboczym: korzeń OpenSpec i magazyny, na które on się odwołuje.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

JSON jest zwięzły i przeznaczony dla agentów (każdy dostępny referowany magazyn niesie swoją receptę pobrania; nierozstrzygnięte członkowie niosą te same instrukcje naprawy, a doctor pokazuje stan). `--code-workspace` dodatkowo zapisuje plik przestrzeni roboczej VS Code zawierający korzeń oraz dostępne referowane magazyny (`ref:<id>` foldery) — to jedyna operacja zapisu wykonywana przez to polecenie, odrzucana bez `--force`, jeśli plik istnieje. Niedostępne członkowie są zgłaszane, nigdy nie domyślane.

„Kontekst roboczy” jest zebranym zbiorem; pole `context:` w `openspec/config.yaml` to tło projektu wstrzyknięte do instrukcji — dwie różne rzeczy. `openspec doctor` odpowiada na pytanie, czy zbiór jest zdrowy; `openspec context` odpowiada na pytanie, czym jest ten zbiór.

## Osobiste zestawy pracy

> **Beta.** Zestawy pracy są częścią nowego beta interfejsu; komendy, flagi i formaty plików mogą ulegać zmianom między wydaniami. Aby przejść przez instrukcję, zapoznaj się z [stores guide](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together).

Zestaw pracy to osobista, nazwana widokacja folderów, nad którymi pracujesz wspólnie — korzeń planowania plus wszystko, co wybierzesz — przechowywana na Twojej maszynie i ponownie otwierana przez nazwę w Twoim narzędziu. Jest całkowicie lokalny: nigdy nie jest zatwierdzany, nigdy nie jest udostępniany, nigdy nie pochodzi z deklaracji, a usunięcie go nigdy nie dotyka folderów członkowskich.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` uruchamia krótki proces z przewodnikiem (lub przyjmuje flagi `--member` nieinteraktywnie; pierwszy członek jest główny — sesje rozpoczynają się tam). `open` uruchamia wybrany narzędzie: edytory (VS Code, Cursor) otwierają okno ze wszystkimi członkami i zwracają; agenci CLI (Claude Code, codex) przejmują to terminal jako sesję ze wszystkimi członkami załączonymi i bez wstępnie wypełnionego promptu, kończąc, gdy wyjdziesz. Folder członek, który brakuje w momencie otwarcia, jest pomijany z notatką; reszta się otwiera. Preferencje narzędzia zapisane są nadpisujące dla każdego otwarcia za pomocą `--tool`.

Wspieranie nowego narzędzia to konfiguracja, a nie kod. Każde narzędzie jest jednym ze dwóch stylów uruchamiania — `workspace-file` (uruchomiony z wygenerowanym `.code-workspace`) lub `attach-dirs` (jedna flaga załączająca na członka) — a klucz `openers` w globalnym pliku `config.json` (otwórz go za pomocą `openspec config edit`) dodaje narzędzia lub dostosowuje wbudowane elementy według pola:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Cały stan zestawu pracy znajduje się w folderze `worksets/` katalogu danych globalnych (widoki zapisane plus wygenerowane pliki `<name>.code-workspace`, regenerowane przy każdym otwarciu); usunięcie tego folderu usuwa wszelkie ślady.

---

## Komendy przeglądowe

### `openspec list`

Lista zmian lub specyfikacji w Twoim projekcie.

```
openspec list [options]
```

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--specs` | Lista specyfikacji zamiast zmian |
| `--changes` | Lista zmian (domyślnie) |
| `--sort <order>` | Sortowanie według `recent` (ostatnie) lub `name` (nazwa) |
| `--json` | Wyjście w formacie JSON |

**Przykłady:**

```bash
# Lista wszystkich aktywnych zmian
openspec list

# Lista wszystkich specyfikacji
openspec list --specs

# Wyjście JSON dla skryptów
openspec list --json
```

**Wyjście (tekst):**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

Wyświetla interaktywną konsolę do eksplorowania specyfikacji i zmian.

```
openspec view
```

Otwiera interfejs oparty na terminalu do nawigacji po specyfikacjach i zmianach Twojego projektu.

---

### `openspec show`

Wyświetla szczegóły zmiany lub specyfikacji.

```
openspec show [item-name] [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `item-name` | Nie | Nazwa zmiany lub specyfikacji (pyta, jeśli jest pominięta) |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--type <type>` | Określenie typu: `change` lub `spec` (automatycznie wykryty, jeśli niejednoznaczny) |
| `--json` | Wyjście w formacie JSON |
| `--no-interactive` | Wyłączanie pytań |

**Opcje specyficzne dla zmian:**

| Opcja | Opis |
|--------|-------------|
| `--deltas-only` | Pokaż tylko delty specyfikacji (tryb JSON) |

**Opcje specyficzne dla specyfikacji:**

| Opcja | Opis |
|--------|-------------|
| `--requirements` | Pokaż tylko wymagania, pomiń scenariusze (tryb JSON) |
| `--no-scenarios` | Pomijanie treści scenariuszów (tryb JSON) |
| `-r, --requirement <id>` | Pokaż konkretne wymaganie za pomocą indeksu opartego na 1 (tryb JSON) |

**Przykłady:**

```bash
# Interaktywne wybiórcze wyświetlenie
openspec show

# Wyświetl konkretną zmianę
openspec show add-dark-mode

# Wyświetl konkretną specyfikację
openspec show auth --type spec

# Wyjście JSON do parsowania
openspec show add-dark-mode --json
```

---

## Komendy walidacyjne

### `openspec validate`

Waliduje zmiany i specyfikacje pod kątem problemów strukturalnych.

```
openspec validate [item-name] [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `item-name` | Nie | Konkretny element do walidacji (pyta, jeśli jest pominięty) |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--all` | Waliduje wszystkie zmiany i specyfikacje |
| `--changes` | Waliduje wszystkie zmiany |
| `--specs` | Waliduje wszystkie specyfikacje |
| `--type <type>` | Określenie typu, gdy nazwa jest niejednoznaczna: `change` lub `spec` |
| `--strict` | Włączenie trybu ścisłej walidacji |
| `--json` | Wyjście w formacie JSON |
| `--concurrency <n>` | Maksymalna liczba równoległych walidacji (domyślnie: 6, lub zmienna środowiskowa `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Wyłączanie pytań |

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

# Ścisła walidacja ze zwiększoną równoległością
openspec validate --all --strict --concurrency 12
```

**Wyjście (tekst):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: brak sekcji "Technical Approach"

1 warning found
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

## Komendy cyklu życia

### `openspec archive`

Archiwuje ukończoną zmianę i łączy delty specyfikacji z głównymi specyfikacjami.

```
openspec archive [change-name] [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `change-name` | Nie | Zmiana do archiwizacji (pyta, jeśli jest pominięta) |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `-y, --yes` | Pomiń pytania o potwierdzenie |
| `--skip-specs` | Pomijanie aktualizacji specyfikacji (dla zmian tylko infrastrukturalnych/narzędziowych/dokumentacyjnych) |
| `--no-validate` | Pomijanie walidacji (wymaga potwierdzenia) |

**Przykłady:**

```bash
# Interaktywna archiwizacja
openspec archive

# Archiwizacja konkretnej zmiany
openspec archive add-dark-mode

# Archiwizacja bez pytań (CI/skrypty)
openspec archive add-dark-mode --yes

# Archiwizacja zmian narzędziowych, które nie wpływają na specyfikacje
openspec archive update-ci-config --skip-specs
```

**Co to robi:**

1. Waliduje zmianę (chyba że `--no-validate`)
2. Prosi o potwierdzenie (chyba że `--yes`)
3. Łączy delty specyfikacji do `openspec/specs/`
4. Przenosi folder zmiany do `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Komendy przepływu pracy

Te komendy wspierają przepływ pracy OPSX oparty na artefaktach. Są przydatne zarówno dla ludzi sprawdzających postęp, jak i agentów decydujących o kolejnych krokach.

### `openspec new change`

Tworzy katalog zmiany i opcjonalne metadane zatwierdzone w rozstrzelonym korzeniu OpenSpec.

```bash
openspec new change <name> [options]
```

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--description <text>` | Opis do dodania do `index.md` |
| `--goal <text>` | Opcjonalne metadane celu do przechowywania ze zmianą |
| `--schema <name>` | Schemat przepływu pracy do użycia |
| `--store <id>` | Identyfikator magazynu (store), który służy jako korzeń OpenSpec (magazyn to samodzielny repozytorium OpenSpec, które zarejestrowałeś) |
| `--json` | Wyjście JSON |

Przykłady:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Wyświetla status ukończenia artefaktu dla zmiany.

```
openspec status [options]
```

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--change <id>` | Nazwa zmiany (pyta, jeśli jest pominięta) |
| `--schema <name>` | Nadpisanie schematu (automatycznie wykryte z konfiguracji zmiany) |
| `--json` | Wyjście w formacie JSON |

**Przykłady:**

```bash
# Interaktywna kontrola statusu
openspec status

# Status dla konkretnej zmiany
openspec status --change add-dark-mode

# JSON do użycia przez agenta
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

Pobierz wzbogacone instrukcje do utworzenia artefaktu lub zastosowania zadań. Używane przez agentów AI, aby zrozumieć, co należy stworzyć dalej.

```
openspec instructions [artifact] [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `artifact` | Nie | ID artefaktu: `proposal`, `specs`, `design`, `tasks` lub `apply` |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--change <id>` | Nazwa zmiany (wymagana w trybie nieinteraktywnym) |
| `--schema <name>` | Nadpisanie schematu |
| `--json` | Wyjście w formacie JSON |

**Specjalny przypadek:** Użyj `apply` jako artefaktu, aby uzyskać instrukcje implementacji zadań.

**Przykłady:**

```bash
# Pobierz instrukcje dla następnego artefaktu
openspec instructions --change add-dark-mode

# Pobierz instrukcje dla konkretnego artefaktu
openspec instructions design --change add-dark-mode

# Pobierz instrukcje zastosowania/implementacji
openspec instructions apply --change add-dark-mode

# JSON do konsumpcji przez agenta
openspec instructions design --change add-dark-mode --json
```

**Wyjście zawiera:**

- Zawartość szablonu dla artefaktu
- Kontekst projektu z konfiguracji
- Treść z artefaktów zależności
- Zasady na artefakt, zgodnie z konfiguracją

---

### `openspec templates`

Pokaż rozstrzygnięte ścieżki szablonów dla wszystkich artefaktów w schemacie.

```
openspec templates [options]
```

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--schema <name>` | Schemat do inspekcji (domyślnie: `spec-driven`) |
| `--json` | Wyjście w formacie JSON |

**Przykłady:**

```bash
# Pokaż ścieżki szablonów dla domyślnego schematu
openspec templates

# Pokaż szablony dla niestandardowego schematu
openspec templates --schema my-workflow

# JSON do użycia programistycznego
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

Lista dostępnych schematów przepływu pracy wraz z ich opisami i przepływami artefaktów.

```
openspec schemas [options]
```

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--json` | Wyjście w formacie JSON |

**Przykład:**

```bash
openspec schemas
```

**Wyjście:**

```
Available schemas:

  spec-driven (package)
    Domyślny przepływ pracy rozwoju specyficznego.
    Przepływ: proposal → specs → design → tasks

  my-custom (project)
    Niestandardowy przepływ pracy dla tego projektu.
    Przepływ: research → proposal → tasks
```

## Komendy Schematów

Komendy służące do tworzenia i zarządzania niestandardowymi schematami przepływu pracy (workflow).

### `openspec schema init`

Tworzy nowy, lokalny dla projektu schemat.

```
openspec schema init <name> [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `name` | Tak | Nazwa schematu (kebab-case) |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--description <text>` | Opis schematu |
| `--artifacts <list>` | Lista ID artefaktów oddzielona przecinkami (domyślnie: `proposal,specs,design,tasks`) |
| `--default` | Ustaw jako domyślny schemat projektu |
| `--no-default` | Nie prosi o ustawienie jako domyślny |
| `--force` | Nadpisuje istniejący schemat |
| `--json` | Wyjście w formacie JSON |

**Przykłady:**

```bash
# Interaktywne tworzenie schematu
openspec schema init research-first

# Bez interakcji ze specyficznymi artefaktami
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**Co to tworzy:**

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

Kopiuje istniejący schemat do Twojego projektu w celu dostosowania.

```
openspec schema fork <source> [name] [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `source` | Tak | Schemat do skopiowania |
| `name` | Nie | Nowa nazwa schematu (domyślnie: `<source>-custom`) |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--force` | Nadpisuje istniejący cel |
| `--json` | Wyjście w formacie JSON |

**Przykład:**

```bash
# Forkowanie wbudowanego schematu spec-driven
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Waliduje strukturę i szablony schematu.

```
openspec schema validate [name] [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `name` | Nie | Schemat do walidacji (waliduje wszystkie, jeśli pominięto) |

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

Pokaż, skąd dany schemat jest rozstrzygany (przydatne do debugowania kolejności).

```
openspec schema which [name] [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `name` | Nie | Nazwa schematu |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--all` | Lista wszystkich schematów wraz z ich źródłami |
| `--json` | Wyjście w formacie JSON |

**Przykład:**

```bash
# Sprawdzenie, skąd pochodzi schemat
openspec schema which spec-driven
```

**Wyjście:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Kolejność rozstrzygania schematów (Schema precedence):**

1. Projekt: `openspec/schemas/<name>/`
2. Użytkownik: `~/.local/share/openspec/schemas/<name>/`
3. Pakiet: Wbudowane schematy

---

## Komendy Konfiguracyjne

### `openspec config`

Wyświetlanie i modyfikacja globalnej konfiguracji OpenSpec.

```
openspec config <subcommand> [options]
```

**Podkomendy:**

| Podkomenda | Opis |
|------------|-------------|
| `path` | Pokaż lokalizację pliku konfiguracyjnego |
| `list` | Pokaż wszystkie aktualne ustawienia |
| `get <key>` | Pobierz konkretną wartość |
| `set <key> <value>` | Ustaw wartość |
| `unset <key>` | Usuń klucz |
| `reset` | Resetuj do domyślnych wartości |
| `edit` | Otwórz w `$EDITOR` |
| `profile [preset]` | Interaktywnie skonfiguruj profil przepływu pracy lub użyj predefiniowanego zestawu |

**Przykłady:**

```bash
# Pokaż ścieżkę pliku konfiguracyjnego
openspec config path

# Lista wszystkich ustawień
openspec config list

# Pobierz konkretną wartość
openspec config get telemetry.enabled

# Ustawienie wartości
openspec config set telemetry.enabled false

# Jawne ustawienie wartości tekstowej
openspec config set user.name "My Name" --string

# Usunięcie niestandardowego ustawienia
openspec config unset user.name

# Resetowanie całej konfiguracji
openspec config reset --all --yes

# Edycja konfiguracji w edytorze
openspec config edit

# Konfiguracja profilu za pomocą kreatora opartego na akcjach
openspec config profile

# Szybki preset: przełączanie przepływów pracy na rdzeń (zachowuje tryb dostawy)
openspec config profile core
```

`openspec config profile` rozpoczyna się od podsumowania stanu i pozwala wybrać:
- Zmiana dostawy + przepływów pracy
- Zmiana tylko dostawy
- Zmiana tylko przepływów pracy
- Zachowanie bieżących ustawień (wyjście)

Jeśli zachowasz bieżące ustawienia, żadne zmiany nie są zapisywane i nie wyświetlany jest komunikat o aktualizacji.
Jeśli nie ma zmian w konfiguracji, ale pliki projektu są niesynchroniczne z Twoim globalnym profilem/dostawą, OpenSpec wyświetli ostrzeżenie i zasugeruje `openspec update`.
Naciśnięcie `Ctrl+C` również anuluje przepływ czysto (bez stack trace) i zakończy się kodem `130`.
W liście kontrolnym przepływu pracy, `[x]` oznacza, że przepływ został wybrany w globalnej konfiguracji. Aby zastosować te selekcje do plików projektu, uruchom `openspec update` (lub wybierz „Apply changes to this project now?” podczas promptu wewnątrz projektu).

**Przykłady interaktywne:**

```bash
# Aktualizacja tylko dostawy
openspec config profile
# wybór: Zmiana tylko dostawy
# wybór dostawa: Tylko umiejętności (Skills)

# Aktualizacja tylko przepływów pracy
openspec config profile
# wybór: Zmiana tylko przepływów pracy
# przełączanie przepływów pracy w liście kontrolnej, a następnie potwierdzenie
```

---

## Komendy Użyteczne (Utility Commands)

### `openspec feedback`

Przesyłanie informacji zwrotnych na temat OpenSpec. Tworzy zgłoszenie w GitHub.

```
openspec feedback <message> [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `message` | Tak | Wiadomość zwrotną |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--body <text>` | Szczegółowy opis |

**Wymagania:** Wymagana jest instalacja i autoryzacja CLI GitHub (`gh`).

**Przykład:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Zarządzanie uzupełnieniami poleceń (shell completions) dla CLI OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Podkomendy:**

| Podkomenda | Opis |
|------------|-------------|
| `generate [shell]` | Wyjście skryptu uzupełniania do stdout |
| `install [shell]` | Instalacja uzupełnienia dla Twojej powłoki (shell) |
| `uninstall [shell]` | Usunięcie zainstalowanych uzupełnień |

**Obsługiwane powłoki:** `bash`, `zsh`, `fish`, `powershell`

**Przykłady:**

```bash
# Instalacja uzupełnień (automatyczne wykrycie powłoki)
openspec completion install

# Instalacja dla konkretnej powłoki
openspec completion install zsh

# Generowanie skryptu do ręcznej instalacji
openspec completion generate bash > ~/.bash_completion.d/openspec

# Odinstalowanie
openspec completion uninstall
```

---

## Kody Wyjścia (Exit Codes)

| Kod | Znaczenie |
|------|---------|
| `0` | Sukces |
| `1` | Błąd (błąd walidacji, brak plików itp.) |

---

## Zmienne Środowiskowe (Environment Variables)

| Zmienna | Opis |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Ustawienie na `0` aby wyłączyć telemetrię |
| `DO_NOT_TRACK` | Ustawienie na `1` aby wyłączyć telemetrię (standardowy sygnał DNT) |
| `OPENSPEC_CONCURRENCY` | Domyślna równoległość dla masowej walidacji (domyślnie: 6) |
| `EDITOR` lub `VISUAL` | Edytor używany przez `openspec config edit` |
| `NO_COLOR` | Wyłączanie kolorowego wyjścia po ustawieniu |

---

## Powiązane Dokumentacje

- [Commands](commands.md) - Komendy z wykorzystaniem AI (slash commands, np. `/opsx:propose`, `/opsx:apply`)
- [Workflows](workflows.md) - Typowe wzorce i kiedy używać każdej komendy
- [Customization](customization.md) - Tworzenie niestandardowych schematów i szablonów
- [Getting Started](getting-started.md) - Przewodnik dla początkujących