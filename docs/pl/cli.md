# Referencja CLI

Interfejs CLI OpenSpec (`openspec`) udostępnia polecenia terminalowe do konfiguracji projektu, walidacji, inspekcji stanu oraz zarządzania. Polecenia te uzupełniają polecenia AI z ukośnikiem (takie jak `/opsx:propose`) udokumentowane w [Commands](commands.md).

## Podsumowanie

| Kategoria | Polecenia | Przeznaczenie |
|----------|----------|---------|
| **Konfiguracja** | `init`, `update` | Inicjalizacja i aktualizacja OpenSpec w projekcie |
| **Repozytoria (samodzielne repozytoria OpenSpec)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Zarządzanie repozytoriami — samodzielnymi repozytoriami OpenSpec, które zarejestrowałeś |
| **Stan** | `doctor` | Raportowanie stanu relacji dla rozwiązanego katalogu głównego |
| **Kontekst roboczy** | `context` | Składanie zestawu roboczego (katalog główny + przywołane repozytoria) |
| **Osobiste zestawy robocze** | `workset create`, `workset list`, `workset open`, `workset remove` | Przechowywanie i otwieranie osobistych, lokalnych widoków roboczych w narzędziu |
| **Przeglądanie** | `list`, `view`, `show` | Eksploracja zmian i specyfikacji |
| **Walidacja** | `validate` | Sprawdzanie zmian i specyfikacji pod kątem problemów |
| **Cykl życia** | `archive` | Finalizacja zakończonych zmian |
| **Przepływ pracy** | `new change`, `status`, `instructions`, `templates`, `schemas` | Wsparcie przepływu pracy opartego na artefaktach |
| **Schematy** | `schema init`, `schema fork`, `schema validate`, `schema which` | Tworzenie i zarządzanie niestandardowymi przepływami pracy |
| **Konfiguracja** | `config` | Wyświetlanie i modyfikowanie ustawień |
| **Narzędzia** | `feedback`, `completion` | Informacje zwrotne i integracja z powłoką |

---

## Polecenia dla ludzi vs agentów

Większość poleceń CLI jest przeznaczona do **użytku przez człowieka** w terminalu. Niektóre polecenia obsługują również **użycie przez agentów/skrypty** za pomocą wyjścia w formacie JSON.

### Polecenia tylko dla ludzi

Te polecenia są interaktywne i przeznaczone do użytku w terminalu:

| Polecenie | Cel |
|-----------|-----|
| `openspec init` | Inicjalizuje projekt (zapytania interaktywne) |
| `openspec view` | Interaktywny pulpit nawigacyjny |
| `openspec workset open <name>` | Otwiera zapisany zestaw roboczy (okno edytora lub sesja agenta w terminalu) |
| `openspec config edit` | Otwiera konfigurację w edytorze |
| `openspec feedback` | Przesyła opinię przez GitHub |
| `openspec completion install` | Instaluje uzupełnienia powłoki |

### Polecenia zgodne z użyciem przez agentów

Te polecenia obsługują wyjście `--json` do programowego użycia przez agentów AI i skrypty:

| Polecenie | Użycie przez człowieka | Użycie przez agenta |
|-----------|------------------------|---------------------|
| `openspec list` | Przeglądanie zmian/specyfikacji | `--json` do ustrukturyzowanych danych |
| `openspec show <item>` | Odczytywanie zawartości | `--json` do parsowania |
| `openspec validate` | Sprawdzanie pod kątem problemów | `--all --json` do walidacji wsadowej |
| `openspec status` | Przeglądanie postępu artefaktów | `--json` do ustrukturyzowanego statusu |
| `openspec instructions` | Pobieranie kolejnych kroków | `--json` do instrukcji dla agentów |
| `openspec templates` | Wyszukiwanie ścieżek szablonów | `--json` do rozwiązywania ścieżek |
| `openspec schemas` | Wyświetlanie dostępnych schematów | `--json` do wykrywania schematów |
| `openspec store setup <id>` | Tworzenie i rejestracja lokalnego magazynu | `--json` z jawnymi danymi wejściowymi do ustrukturyzowanego wyjścia konfiguracji |
| `openspec store register <path>` | Rejestracja istniejącego magazynu | `--json` do ustrukturyzowanego wyjścia rejestracji |
| `openspec store unregister <id>` | Usuwanie rejestracji lokalnego magazynu | `--json` do ustrukturyzowanego wyjścia czyszczenia |
| `openspec store remove <id>` | Usuwanie folderu zarejestrowanego lokalnego magazynu | `--yes --json` do nieinteraktywnego usuwania |
| `openspec store list` | Przeglądanie zarejestrowanych magazynów | `--json` do ustrukturyzowanych rejestracji |
| `openspec store doctor` | Sprawdzanie konfiguracji lokalnego magazynu | `--json` do ustrukturyzowanych diagnostyk |
| `openspec new change <id>` | Tworzenie szkieletu zmian lokalnych dla repozytorium | `--json`, a także `--store <id>` do użycia zarejestrowanego magazynu jako głównego katalogu OpenSpec |
| `openspec workset create [name]` | Tworzenie spersonalizowanego widoku roboczego | `--member <path> --json` do nieinteraktywnego tworzenia widoku |
| `openspec workset list` | Przeglądanie zapisanych zestawów roboczych | `--json` do ustrukturyzowanych widoków |
| `openspec workset remove <name>` | Usuwanie zapisanego widoku | `--yes --json` do nieinteraktywnego usuwania |

---

## Opcje globalne

Te opcje działają ze wszystkimi poleceniami:

| Opcja | Opis |
|-------|------|
| `--version`, `-V` | Wyświetla numer wersji |
| `--no-color` | Wyłącza kolorowe wyjście |
| `--help`, `-h` | Wyświetla pomoc dla polecenia |

---

## Polecenia konfiguracji

### `openspec init`

Inicjalizuje OpenSpec w Twoim projekcie. Tworzy strukturę folderów i konfiguruje integracje z narzędziami AI.

Domyślne zachowanie korzysta z ustawień domyślnych konfiguracji globalnej: profil `core`, dostawa `both`, przepływy pracy `propose, explore, apply, sync, archive`.

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
| `--tools <list>` | Konfiguruje narzędzia AI w sposób nieinteraktywny. Użyj `all`, `none` lub listy rozdzielonej przecinkami |
| `--force` | Automatycznie usuwa stare pliki bez pytania |
| `--profile <profile>` | Zastępuje globalny profil dla tego uruchomienia inicjalizacji (`core` lub `custom`) |

`--profile custom` korzysta z przepływów pracy aktualnie wybranych w konfiguracji globalnej (`openspec config profile`).

**Obsługiwane identyfikatory narzędzi (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

> Ta lista odpowiada wartości `AI_TOOLS` w pliku `src/core/config.ts`. Zobacz [Obsługiwane narzędzia](supported-tools.md), aby poznać umiejętności i ścieżki poleceń każdego narzędzia.

**Przykłady:**

```bash
# Interaktywna inicjalizacja
openspec init

# Inicjalizacja w określonym katalogu
openspec init ./my-project

# Nieinteraktywne: konfiguracja dla Claude i Cursor
openspec init --tools claude,cursor

# Konfiguracja dla wszystkich obsługiwanych narzędzi
openspec init --tools all

# Zastąpienie profilu dla tego uruchomienia
openspec init --profile core

# Pominięcie zapytań i automatyczne usunięcie starych plików
openspec init --force
```

**Co tworzy:**

```
openspec/
├── specs/              # Twoje specyfikacje (źródło wiary)
├── changes/            # Proponowane zmiany
└── config.yaml         # Konfiguracja projektu

.claude/skills/         # Umiejętności Claude Code (jeśli wybrano claude)
.cursor/skills/         # Umiejętności Cursor (jeśli wybrano cursor)
.cursor/commands/       # Polecenia Cursor OPSX (jeśli dostawa obejmuje polecenia)
... (pozostałe konfiguracje narzędzi)
```

---

### `openspec update`

Aktualizuje pliki instrukcji OpenSpec po uaktualnieniu CLI. Ponownie generuje pliki konfiguracji narzędzi AI, korzystając z bieżącego globalnego profilu, wybranych przepływów pracy i trybu dostawy.

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
| `--force` | Wymusza aktualizację nawet jeśli pliki są aktualne |

**Przykład:**

```bash
# Aktualizacja plików instrukcji po uaktualnieniu npm
npm update @fission-ai/openspec
openspec update
```

---

## Magazyny (samodzielne repozytoria OpenSpec)

> **Beta.** Magazyny i funkcje zbudowane na ich podstawie (odniesienia, kontekst roboczy, zestawy robocze) są nowe; nazwy poleceń, flagi, formaty plików i wyjście JSON mogą ulegać zmianom między wydaniami. Aby zapoznać się z przewodnikiem opartym na rozwiązywaniu problemów, zobacz [przewodnik po magazynach](stores-beta/user-guide.md).

Magazyn to samodzielne repozytorium OpenSpec zarejestrowane na tej maszynie — na przykład repozytorium planowania lub repozytorium kontraktów. Rejestracja magazynu pozwala normalnym poleceniom (`list`, `show`, `status`, `validate`, `new change`, `archive`, ...) działać w nim z dowolnego miejsca po podaniu flagi `--store <id>`.

### `openspec store setup`

Tworzy i rejestruje lokalny magazyn. Jeśli nie podano argumentów w terminalu, OpenSpec prowadzi użytkownika przez proces konfiguracji. Agenci i skrypty powinny podawać jawne dane wejściowe i używać flagi `--json`.

```bash
openspec store setup [id] [options]
```

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--path <path>` | Folder, w którym ma znajdować się magazyn (na przykład `~/openspec/<id>`) |
| `--remote <url>` | Zapisuje kanoniczny zdalny adres w pliku `store.yaml` nowego magazynu |
| `--init-git` | Inicjalizuje repozytorium Git z początkowym commitem (domyślnie) |
| `--no-init-git` | Pomija wszystkie akcje związane z Gitem: nie inicjuje, nie tworzy początkowego commita |
| `--json` | Wyjście w formacie JSON |

Uruchomienia nieinteraktywne (z flagą `--json`, skrypty, agenci) muszą podawać zarówno identyfikator magazynu, jak i flagę `--path`. W interaktywnym terminalu konfiguracja proponuje lokalizację z edytowalną sugestią w widocznym miejscu należącym do użytkownika (na przykład `~/openspec/<id>`); nigdy nie domyślnie używa zarządzanego katalogu danych OpenSpec.

Przykłady:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Rejestruje istniejący folder lokalnego magazynu. Podczas fazy beta magazynów główny katalog może zostać zarejestrowany przed powstaniem jakichkolwiek zmian, zastosowaniem specyfikacji lub zarchiwizowaniem zmian; w takim przypadku foldery `openspec/changes/`, `openspec/specs/` i `openspec/changes/archive/` mogą być nieobecne, dopóki normalne polecenia ich nie utworzą. Repozytorium zawierające tylko konfigurację, które deklaruje `store: <id>`, pozostaje wskaźnikiem do innego magazynu i nie jest rejestrowane jako główny katalog magazynu, dopóki ten wskaźnik nie zostanie usunięty.

```bash
openspec store register [path] [options]
```

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--id <id>` | Identyfikator magazynu; domyślnie używa metadanych magazynu lub nazwy folderu |
| `--yes` | Potwierdza tworzenie metadanych tożsamości magazynu dla poprawnego głównego katalogu OpenSpec |
| `--json` | Wyjście w formacie JSON |

### `openspec store unregister`

Usuwa rejestrację lokalnego magazynu bez usuwania plików.

```bash
openspec store unregister <id> [--json]
```

Używaj tego, gdy magazyn został przeniesiony, sklonowany w inne miejsce lub nie powinien już być wyświetlany przez OpenSpec na tej maszynie.

### `openspec store remove`

Usuwa rejestrację lokalnego magazynu i usuwa jego lokalny folder.

```bash
openspec store remove <id> [--yes] [--json]
```

Polecenie `remove` wyświetla dokładną ścieżkę folderu przed usunięciem w interaktywnym terminalu. Agenci, skrypty i wywołania JSON muszą podać flagę `--yes`, aby potwierdzić usunięcie. OpenSpec odmówi usunięcia folderu, który nie zawiera pasujących metadanych magazynu.

### `openspec store list`

Wyświetla listę lokalnie zarejestrowanych magazynów.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Sprawdza rejestrację lokalnego magazynu, metadane i obecność repozytorium Git.

```bash
openspec store doctor [id] [--json]
```

Polecenie `doctor` służy wyłącznie do diagnostyki; zgłasza brakujące główne katalogi, niezgodności metadanych i nieprawidłowy stan lokalnego rejestru bez modyfikowania magazynu.

### Odwoływanie się do magazynów z projektu

Repozytorium projektu może deklarować, z jakich magazynów korzysta jego praca, w pliku `openspec/config.yaml`:

```yaml
schema: spec-driven
references:
  - team-context
```

Od tego momentu wyjście polecenia `openspec instructions` w tym repozytorium (zarówno dla poszczególnych artefaktów, jak i powierzchni `apply`, w trybach JSON i dla człowieka) zawiera indeks specyfikacji każdego odniesionego magazynu — identyfikatory specyfikacji, jednolinijkowe podsumowanie z sekcji Purpose każdej specyfikacji oraz polecenie pobrania (`openspec show <spec-id> --type spec --store <id>`). Indeks jest tworzony na żywo z zarejestrowanego checkoutu przy każdym uruchomieniu; zawartość specyfikacji nigdy nie jest kopiowana do wyjścia.

Odniesienia są kontekstem tylko do odczytu. Nigdy nie zmieniają miejsca działania poleceń: praca pozostaje w głównym katalogu własnego repozytorium, a zapis do odniesionego magazynu wymaga jawnego użycia akcji `--store`. Odniesienie, które nie może zostać rozwiązane (na przykład magazyn niezarejestrowany na tej maszynie), zamienia się w ostrzeżenie w indeksie wraz z dokładnym rozwiązaniem, a instrukcje są nadal generowane. Polecenie `openspec doctor` zgłasza stan zdrowia odniesień w jednym miejscu.

### Zapisywanie miejsca, z którego został sklonowany magazyn

Magazyn może zapisać swoje kanoniczne źródło klonowania w pliku tożsamości zatwierdzanym w repozytorium, dzięki czemu proces onboardingu nigdy nie kończy się na etapie "zarejestruj magazyn":

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

Zdalny adres jest zapisywany w pliku `.openspec-store/store.yaml` wewnątrz początkowego commita, więc każdy klon od razu go zna. W przypadku istniejącego magazynu edytuj plik `store.yaml` ręcznie i zatwierdź zmiany. Polecenie `store doctor` wyświetla zapisany zdalny adres (oraz obserwowane źródło Git checkoutu); wskazówki dotyczące udostępniania podczas konfiguracji/rejestracji go wymieniają, a polecenie register zapisuje źródło checkoutu w rejestrze lokalnym maszyny.

Deklaracja odniesienia może również zawierać źródło klonowania, dzięki czemu współpracownik, który jeszcze nie ma magazynu, otrzymuje kompletne, gotowe do wklejenia rozwiązanie (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

Zapisanie zdalnego adresu nie jest synchronizacją: OpenSpec nigdy nie klonuje, nie pobiera ani nie wysyła zmian samodzielnie.

### Deklarowanie domyślnego magazynu

Repozytorium, którego planowanie jest w pełni zewnętrzne — bez lokalnych folderów `openspec/specs/` lub `openspec/changes/` — może zadeklarować swój magazyn raz, zamiast podawać flagę `--store` przy każdym poleceniu:

```yaml
# openspec/config.yaml (jedyny plik w folderze openspec/)
store: team-context
```

Normalne polecenia rozpoznają wtedy automatycznie zadeklarowany magazyn; baner głównego katalogu i blok JSON `root` zgłaszają `source: "declared"` z identyfikatorem magazynu, a wyświetlane podpowiedzi nadal zawierają flagę `--store <id>`. Deklaracja jest rozwiązaniem zapasowym, nigdy zastępującym: jawna flaga `--store` zawsze ma priorytet, a katalog z prawdziwymi folderami planowania ignoruje wskaźnik (z ostrzeżeniem). Aby przekonwertować repozytorium-wskaźnik na lokalny główny katalog OpenSpec, usuń wiersz `store:` i uruchom polecenie `openspec init` — inicjalizacja odmówi utworzenia szkieletu, dopóki deklaracja jest obecna.

Wariant na poziomie maszyny obejmuje wszystkie repozytoria naraz: `openspec config set defaultStore <id>` (zobacz Konfiguracja). Jest on używany tylko wtedy, gdy flaga `--store`, lokalny główny katalog i wskaźnik projektu wszystkie nie powiodły się przy rozpoznawaniu; baner głównego katalogu i blok JSON `root` zgłaszają wtedy `source: "global_default"`.

## Doctor (kondycja relacji)

Jedno pytanie tylko do odczytu, w jednym miejscu: czy korzeń OpenSpec jest w dobrej kondycji, a magazyny, do których się odwołuje, dostępne na tej maszynie?

```bash
openspec doctor [--store <id>] [--json]
```

Raport oddziela kondycję korzenia, kondycję metadanych magazynu (w tym notatkę, gdy zapisany remote i origin checkoutu się rozbiegają, oraz notatkę, gdy checkout magazynu pozostaje w tyle za swoim ostatnio pobranym odniesieniem śledzenia upstreamu) i kondycję odniesień (te same instrukcje diagnostyki, z poprawkami przez klonowanie dla nierozwiązanych odniesień). Wyniki diagnostyki o dowolnym poziomie ważności zwracają kod 0 — agenci odczytują tablice `status`; tylko błędy polecenia (brak korzenia, nieznany magazyn) zwracają kod 1. Doctor nigdy nie klonuje, nie synchronizuje ani nie naprawia. Aby uzyskać sam zestaw złożony, a nie jego kondycję, użyj `openspec context`.

## Kontekst roboczy (zestaw złożony)

Wszystko, co ta praca dotyczy poprzez deklaracje OpenSpec, w jednym zestawie roboczym: korzeń OpenSpec i magazyny, do których się odwołuje.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

Zestawienie JSON jest przeznaczone do odczytu przez agentów (każdy dostępny przywołany magazyn zawiera swoją instrukcję pobierania; nierozwiązane elementy zawierają te same instrukcje naprawy co `doctor show`). `--code-workspace` dodatkowo zapisuje plik obszaru roboczego VS Code zawierający korzeń oraz dostępne przywołane magazyny (foldery `ref:<id>`) — jedyny zapis, które wykonuje to polecenie, odrzucany bez `--force`, jeśli plik istnieje. Niedostępne elementy są raportowane, a nigdy nie są zgadywane.

"Kontekst roboczy" to zestaw złożony; pole `context:` w `openspec/config.yaml` to tło projektu wstrzykiwane do instrukcji — dwie różne rzeczy. `openspec doctor` odpowiada, czy zestaw jest w dobrej kondycji; `openspec context` odpowiada, czym jest ten zestaw.

## Osobiste worksety

> **Beta.** Worksety są częścią nowej powierzchni beta; polecenia, flagi i formaty plików mogą ulegać zmianom między wydaniami. Aby zapoznać się z przewodnikiem krok po kroku, zobacz [przewodnik po sklepach](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together).

Workset to osobista, nazwana wizja folderów, na których pracujesz wspólnie — główny folder planowania plus dowolne inne foldery, które wybierzesz — przechowywana na Twoim komputerze i ponownie otwierana po nazwie w Twoim narzędziu. Jest wyłącznie lokalna: nigdy nie jest committowana do repozytorium, nigdy nie jest udostępniana innym, nigdy nie jest tworzona na podstawie deklaracji, a usunięcie worksetu nigdy nie dotyczy żadnego folderu członkowskiego.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

Polecenie `create` uruchamia krótki przewodzony proces (lub przyjmuje flagi `--member` w trybie nieinteraktywnym; pierwszy członek jest główny — sesje zaczynają się właśnie tam). Polecenie `open` uruchamia wybrane narzędzie: edytory (VS Code, Cursor) otwierają okno ze wszystkimi członkami i kończą działanie; agenty CLI (Claude Code, codex) przejmują ten terminal jako sesję z dołączonymi wszystkimi członkami, bez wstępnie wypełnionego zapytania, kończąc działanie po wyjściu. Brakujący folder członkowski w momencie otwierania jest pomijany z odpowiednią notatką; reszta jest otwierana. Zapisana preferencja narzędzia może być nadpisana przy każdym otwarciu za pomocą flagi `--tool`.

Obsługa nowego narzędzia opiera się na konfiguracji, a nie na kodzie. Każde narzędzie należy do jednego z dwóch stylów uruchamiania — `workspace-file` (uruchamiane za pomocą wygenerowanego pliku `.code-workspace`) lub `attach-dirs` (jedna flaga dołączania na każdy członek) — a klucz `openers` w globalnym pliku `config.json` (otwórz go za pomocą polecenia `openspec config edit`) służy do dodawania nowych narzędzi lub dostosowywania wbudowanych według poszczególnych pól:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Cały stan worksetów znajduje się w folderze `worksets/` w globalnym folderze z danymi (zapisane widoki plus wygenerowane pliki `<name>.code-workspace`, regenerowane przy każdym otwarciu); usunięcie tego folderu usuwa wszystkie ślady.

---

## Polecenia do przeglądania

### `openspec list`

Wyświetla listę zmian lub specyfikacji w Twoim projekcie.

```
openspec list [options]
```

**Opcje:**

| Opcja | Opis |
|--------|-------|
| `--specs` | Wyświetla listę specyfikacji zamiast zmian |
| `--changes` | Wyświetla listę zmian (domyślnie) |
| `--sort <order>` | Sortuj według `recent` (domyślnie) lub `name` |
| `--json` | Wyjście w formacie JSON |

**Przykłady:**

```bash
# List all active changes
openspec list

# List all specs
openspec list --specs

# JSON output for scripts
openspec list --json
```

**Wyjście (tekst):**

```
Zmiany:
  add-dark-mode     Brak zadań      przed chwilą
```

---

### `openspec view`

Wyświetla interaktywny pulpit do przeglądania specyfikacji i zmian.

```
openspec view
```

Otwiera interfejs oparty na terminalu do nawigowania po specyfikacjach i zmianach w Twoim projekcie.

---

### `openspec show`

Wyświetla szczegóły zmiany lub specyfikacji.

```
openspec show [item-name] [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `item-name` | Nie | Nazwa zmiany lub specyfikacji (zapytanie w przypadku pominięcia) |

**Opcje:**

| Opcja | Opis |
|--------|------|
| `--type <type>` | Określ typ: `change` lub `spec` (wykrywany automatycznie, jeśli jest jednoznaczny) |
| `--json` | Wyjście w formacie JSON |
| `--no-interactive` | Wyłącz zapytania |

**Opcje specyficzne dla zmian:**

| Opcja | Opis |
|--------|------|
| `--deltas-only` | Pokaż tylko delta specyfikacje (tryb JSON) |

**Opcje specyficzne dla specyfikacji:**

| Opcja | Opis |
|--------|------|
| `--requirements` | Pokaż tylko wymagania, wyklucz scenariusze (tryb JSON) |
| `--no-scenarios` | Wyklucz zawartość scenariuszy (tryb JSON) |
| `-r, --requirement <id>` | Pokaż konkretne wymaganie według indeksu opartego na 1 (tryb JSON) |

**Przykłady:**

```bash
# Interactive selection
openspec show

# Show a specific change
openspec show add-dark-mode

# Show a specific spec
openspec show auth --type spec

# JSON output for parsing
openspec show add-dark-mode --json
```

---

## Polecenia walidacji

### `openspec validate`

Waliduje zmiany i specyfikacje pod kątem problemów strukturalnych.

```
openspec validate [item-name] [options]
```

Zmiana bez żadnych delta specyfikacji nie przejdzie walidacji, chyba że jej plik `.openspec.yaml` deklaruje `skip_specs: true` (dla czystych refaktoryzacji, zmian w narzędziach lub pracy nad dokumentacją — zobacz [Przepis 5](examples.md#recipe-5-a-refactor-with-no-behavior-change)).

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `item-name` | Nie | Konkretny element do walidacji (zapytanie w przypadku pominięcia) |

**Opcje:**

| Opcja | Opis |
|--------|------|
| `--all` | Waliduj wszystkie zmiany i specyfikacje |
| `--changes` | Waliduj wszystkie zmiany |
| `--specs` | Waliduj wszystkie specyfikacje |
| `--type <type>` | Określ typ, gdy nazwa jest niejednoznaczna: `change` lub `spec` |
| `--strict` | Włącz tryb ścisłej walidacji |
| `--json` | Wyjście w formacie JSON |
| `--concurrency <n>` | Maksymalna liczba równoległych walidacji (domyślnie: 6, lub wartość zmiennej środowiskowej `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Wyłącz zapytania |

**Przykłady:**

```bash
# Interactive validation
openspec validate

# Validate a specific change
openspec validate add-dark-mode

# Validate all changes
openspec validate --changes

# Validate everything with JSON output (for CI/scripts)
openspec validate --all --json

# Strict validation with increased parallelism
openspec validate --all --strict --concurrency 12
```

**Wyjście (tekst):**

```
Walidowanie add-dark-mode...
  ✓ proposal.md prawidłowe
  ✓ specs/ui/spec.md prawidłowe
  ⚠ design.md: brakuje sekcji „Podejście techniczne”

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

Archiwizuje zakończoną zmianę i łączy delta specyfikacje z głównymi specyfikacjami.

```
openspec archive [change-name] [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `change-name` | Nie | Zmiana do archiwizacji (zapytanie w przypadku pominięcia) |

**Opcje:**

| Opcja | Opis |
|--------|------|
| `-y, --yes` | Pomijaj zapytania o potwierdzenie |
| `--skip-specs` | Pomijaj aktualizacje specyfikacji dla jednego uruchomienia archiwizacji. Zmiana, która trwale nie ma delta specyfikacji, powinna zadeklarować `skip_specs: true` w swoim pliku `.openspec.yaml` zamiast tego — jest archiwizowana bez tej flagi |
| `--no-validate` | Pomijaj walidację (wymaga potwierdzenia) |

**Przykłady:**

```bash
# Interactive archive
openspec archive

# Archive specific change
openspec archive add-dark-mode

# Archive without prompts (CI/scripts)
openspec archive add-dark-mode --yes

# Archive a tooling change that doesn't affect specs
openspec archive update-ci-config --skip-specs
```

**Działanie:**

1. Waliduje zmianę (chyba że użyto flagi `--no-validate`)
2. Pyta o potwierdzenie (chyba że użyto flagi `--yes`)
3. Łączy delta specyfikacje w `openspec/specs/`
4. Przenosi folder zmiany do `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Polecenia przepływu pracy

Te polecenia obsługują przepływ pracy OPSX oparty na artefaktach. Są przydatne zarówno dla ludzi sprawdzających postęp, jak i dla agentów określających kolejne kroki.

### `openspec new change`

Tworzy folder zmiany i opcjonalne metadane zatwierdzane w ustalonym korzeniu OpenSpec.

```bash
openspec new change <name> [options]
```

Nazwy zmian muszą używać małych liter w notacji kebab-case. Zaczynają się od małej litery, następnie zawierają małe litery, cyfry i pojedyncze myślniki. Nie mogą zaczynać się od cyfry, zawierać spacji, podkreśleń, wielkich liter, kolejnych myślników ani myślników na początku lub końcu. Jeśli dołączasz identyfikator zewnętrznego zgłoszenia, poprzedź go słowem, na przykład `ticket-123-add-notifications` zamiast `123-add-notifications`.

**Opcje:**

| Opcja | Opis |
|--------|------|
| `--description <text>` | Opis do dodania do `index.md` |
| `--goal <text>` | Opcjonalne metadane celu do zapisania wraz ze zmianą |
| `--schema <name>` | Schemat przepływu pracy do użycia |
| `--store <id>` | Identyfikator sklepu do użycia jako korzeń OpenSpec (sklep to samodzielne repozytorium OpenSpec, które zarejestrowałeś) |
| `--json` | Wyjście JSON |

Przykłady:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Wyświetla status ukończenia artefaktów dla zmiany.

```
openspec status [options]
```

**Opcje:**

| Opcja | Opis |
|--------|------|
| `--change <id>` | Nazwa zmiany (zapytanie w przypadku pominięcia) |
| `--schema <name>` | Nadpisanie schematu (wykrywane automatycznie na podstawie konfiguracji zmiany) |
| `--json` | Wyjście w formacie JSON |

**Przykłady:**

```bash
# Interactive status check
openspec status

# Status for specific change
openspec status --change add-dark-mode

# JSON for agent use
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

Zmiana, która deklaruje `skip_specs: true` wyświetla swój etap specyfikacji jako `[~] specs (pominięte: zmiana deklaruje skip_specs)` i wyklucza go z licznika postępu.

**Wyjście (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done", "requires": []},
    {"id": "design", "outputPath": "design.md", "status": "ready", "requires": ["proposal"]},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done", "requires": ["proposal"]},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "requires": ["specs", "design"], "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

Pobiera wzbogacone instrukcje do tworzenia artefaktu lub wykonywania zadań. Używane przez agentów AI do zrozumienia, co należy stworzyć następnie.

```
openspec instructions [artifact] [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `artifact` | Nie | Identyfikator artefaktu: `proposal`, `specs`, `design`, `tasks` lub `apply` |

**Opcje:**

| Opcja | Opis |
|--------|------|
| `--change <id>` | Nazwa zmiany (wymagana w trybie nieinteraktywnym) |
| `--schema <name>` | Nadpisanie schematu |
| `--json` | Wyjście w formacie JSON |

**Przypadek specjalny:** Użyj `apply` jako artefaktu, aby pobrać instrukcje implementacji zadań.

**Przykłady:**

```bash
# Get instructions for next artifact
openspec instructions --change add-dark-mode

# Get specific artifact instructions
openspec instructions design --change add-dark-mode

# Get apply/implementation instructions
openspec instructions apply --change add-dark-mode

# JSON for agent consumption
openspec instructions design --change add-dark-mode --json
```

**Wyjście zawiera:**

- Szablon zawartości artefaktu
- Kontekst projektu z konfiguracji
- Zawartość artefaktów zależnych
- Reguły per-artefakt z konfiguracji

W przypadku artefaktu pominiętego za pomocą `skip_specs: true`, wyjście składa się wyłącznie z ostrzeżenia (JSON dodaje pola `skipped`/`warning`) — artefaktu nie należy tworzyć.

---

### `openspec templates`

Wyświetla ścieżki do rozwiązań szablonów dla wszystkich artefaktów w schemacie.

```
openspec templates [options]
```

**Opcje:**

| Opcja | Opis |
|--------|------|
| `--schema <name>` | Schemat do sprawdzenia (domyślnie: `spec-driven`) |
| `--json` | Wyjście w formacie JSON |

**Przykłady:**

```bash
# Show template paths for default schema
openspec templates

# Show templates for custom schema
openspec templates --schema my-workflow

# JSON for programmatic use
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

Wyświetla listę dostępnych schematów przepływu pracy wraz z ich opisami i przepływami artefaktów.

```
openspec schemas [options]
```

**Opcje:**

| Opcja | Opis |
|--------|------|
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

  my-custom (projekt)
    Niestandardowy przepływ pracy dla tego projektu
    Przepływ: research → proposal → tasks
```

## Polecenia schematów

Polecenia do tworzenia i zarządzania niestandardowymi schematami przepływu pracy.

### `openspec schema init`

Utwórz nowy schemat lokalny dla projektu.

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
| `--artifacts <list>` | Lista artefaktów oddzielonych przecinkami (domyślnie: `proposal,specs,design,tasks`) |
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
|----------|----------|-------------|
| `source` | Tak | Schemat do skopiowania |
| `name` | Nie | Nazwa nowego schematu (domyślnie: `<source>-custom`) |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--force` | Nadpisz istniejące miejsce docelowe |
| `--json` | Wyjście w formacie JSON |

**Przykład:**

```bash
# Utwórz fork wbudowanego schematu spec-driven
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Sprawdź poprawność struktury i szablonów schematu.

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
# Sprawdź poprawność konkretnego schematu
openspec schema validate my-workflow

# Sprawdź poprawność wszystkich schematów
openspec schema validate
```

---

### `openspec schema which`

Pokaż, skąd rozwiązywany jest schemat (przydatne do debugowania kolejności).

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
| `--all` | Wyświetl listę wszystkich schematów z ich źródłami |
| `--json` | Wyjście w formacie JSON |

**Przykład:**

```bash
# Sprawdź, skąd pochodzi schemat
openspec schema which spec-driven
```

**Wyjście:**

```
spec-driven rozwiązywany z: package
  Źródło: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Kolejność schematów:**

1. Projekt: `openspec/schemas/<name>/`
2. Użytkownik: `~/.local/share/openspec/schemas/<name>/`
3. Pakiet: Wbudowane schematy

---

## Polecenia konfiguracji

### `openspec config`

Wyświetl i modyfikuj globalną konfigurację OpenSpec.

```
openspec config <subcommand> [options]
```

**Polecenia podrzędne:**

| Polecenie podrzędne | Opis |
|------------|-------------|
| `path` | Pokaż lokalizację pliku konfiguracyjnego |
| `list` | Pokaż wszystkie bieżące ustawienia |
| `get <key>` | Pobierz konkretną wartość |
| `set <key> <value>` | Ustaw wartość |
| `unset <key>` | Usuń klucz |
| `reset` | Przywróć domyślne |
| `edit` | Otwórz w `$EDITOR` |
| `profile [preset]` | Skonfiguruj profil przepływu pracy interaktywnie lub przez ustawienie wstępne |

**Przykłady:**

```bash
# Pokaż ścieżkę pliku konfiguracyjnego
openspec config path

# Wyświetl listę wszystkich ustawień
openspec config list

# Pobierz konkretną wartość
openspec config get telemetry.enabled

# Ustaw wartość
openspec config set telemetry.enabled false

# Ustaw wartość tekstową jawnie
openspec config set user.name "My Name" --string

# Usuń niestandardowe ustawienie
openspec config unset user.name

# Ustaw domyślny magazyn na poziomie maszyny (root rezerwowy, gdy nie ma --store,
# lokalnego root lub wskaźnika magazynu projektu)
openspec config set defaultStore team-plans

# Zresetuj całą konfigurację
openspec config reset --all --yes

# Edytuj konfigurację w swoim edytorze
openspec config edit

# Skonfiguruj profil za pomocą kreatora opartego na akcjach
openspec config profile

# Szybkie ustawienie wstępne: przełącz przepływy pracy na core (zachowuje tryb dostawy)
openspec config profile core
```

`openspec config profile` rozpoczyna się od podsumowania bieżącego stanu, a następnie pozwala wybrać:
- Zmień dostawę + przepływy pracy
- Zmień tylko dostawę
- Zmień tylko przepływy pracy
- Zachowaj bieżące ustawienia (wyjście)

Jeśli zachowasz bieżące ustawienia, żadne zmiany nie zostaną zapisane i nie pojawi się monit o aktualizację.
Jeśli nie ma zmian w konfiguracji, ale bieżące pliki projektu są niezsynchronizowane z twoim globalnym profilem/dostawą, OpenSpec wyświetli ostrzeżenie i zasugeruje `openspec update`.
Naciśnięcie `Ctrl+C` również anuluje przepływ w sposób czysty (bez śladu stosu) i wychodzi z kodem `130`.
Na liście kontrolnej przepływu pracy `[x]` oznacza, że przepływ pracy jest wybrany w konfiguracji globalnej. Aby zastosować te wybory do plików projektu, uruchom `openspec update` (lub wybierz `Apply changes to this project now?` po wyświetleniu monitu wewnątrz projektu).

**Przykłady interaktywne:**

```bash
# Aktualizacja tylko dostawy
openspec config profile
# wybierz: Zmień tylko dostawę
# wybierz dostawę: Skills only

# Aktualizacja tylko przepływów pracy
openspec config profile
# wybierz: Zmień tylko przepływy pracy
# przełącz przepływy pracy na liście kontrolnej, potem potwierdź
```

---

## Polecenia narzędziowe

### `openspec feedback`

Prześlij opinię o OpenSpec. Tworzy zgłoszenie GitHub.

```
openspec feedback <message> [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `message` | Tak | Wiadomość opinii |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--body <text>` | Szczegółowy opis |

**Wymagania:** GitHub CLI (`gh`) musi być zainstalowane i uwierzytelnione.

**Przykład:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Zarządzaj uzupełnianiem powłoki dla OpenSpec CLI.

```
openspec completion <subcommand> [shell]
```

**Polecenia podrzędne:**

| Polecenie podrzędne | Opis |
|------------|-------------|
| `generate [shell]` | Wyślij skrypt uzupełniania do stdout |
| `install [shell]` | Zainstaluj uzupełnianie dla twojej powłoki |
| `uninstall [shell]` | Usuń zainstalowane uzupełniania |

**Obsługiwane powłoki:** `bash`, `zsh`, `fish`, `powershell`

**Przykłady:**

```bash
# Zainstaluj uzupełniania (automatyczne wykrywanie powłoki)
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
| `OPENSPEC_CONCURRENCY` | Domyślna współbieżność dla walidacji masowej (domyślnie: 6) |
| `EDITOR` lub `VISUAL` | Edytor dla `openspec config edit` |
| `NO_COLOR` | Wyłącz kolorowe wyjście, gdy ustawione |

---

## Powiązana dokumentacja

- [Polecenia](commands.md) - Polecenia ukośnika AI (`/opsx:propose`, `/opsx:apply`, itp.)
- [Przepływy pracy](workflows.md) - Typowe wzorce i kiedy używać każdego polecenia
- [Dostosowywanie](customization.md) - Twórz niestandardowe schematy i szablony
- [Pierwsze kroki](getting-started.md) - Przewodnik konfiguracji po raz pierwszy