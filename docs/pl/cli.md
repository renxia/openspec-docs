# Referencja CLI

OpenSpec CLI (`openspec`) udostępnia polecenia terminalowe do konfiguracji projektu, walidacji, inspekcji stanu i zarządzania. Te polecenia uzupełniają komendy slash AI (takie jak `/opsx:propose`) udokumentowane w sekcji [Commands](commands.md).

## Podsumowanie

| Kategoria | Polecenia | Cel |
|-----------|-----------|-----|
| **Konfiguracja** | `init`, `update` | Inicjalizacja i aktualizacja OpenSpec w projekcie |
| **Przestrzenie robocze (beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace update`, `workspace open` | Konfiguracja widoków lokalnych dla połączonych repozytoriów lub folderów |
| **Kontekst współdzielony (beta)** | `context-store setup`, `context-store register`, `context-store unregister`, `context-store remove`, `context-store list`, `context-store doctor`, `initiative create`, `initiative show`, `initiative list` | Zarządzanie lokalnymi rejestracjami kontekst-store i trwałym kontekstem inicjatyw |
| **Przeglądanie** | `list`, `view`, `show` | Eksploracja zmian i specyfikacji |
| **Walidacja** | `validate` | Sprawdzanie zmian i specyfikacji pod kątem problemów |
| **Cykl życia** | `archive` | Finalizacja ukończonych zmian |
| **Przepływ pracy** | `new change`, `set change`, `status`, `instructions`, `templates`, `schemas` | Wsparcie przepływu pracy opartego na artefaktach |
| **Schematy** | `schema init`, `schema fork`, `schema validate`, `schema which` | Tworzenie i zarządzanie niestandardowymi przepływami pracy |
| **Konfiguracja** | `config` | Przeglądanie i modyfikacja ustawień |
| **Narzędzia** | `feedback`, `completion` | Opinie i integracja z powłoką

---

## Polecenia dla człowieka vs agenta

Większość poleceń CLI jest przeznaczona do **użytku przez człowieka** w terminalu. Niektóre polecenia obsługują również **użytek przez agenty/skrypty** poprzez wyjście JSON.

### Polecenia wyłącznie dla człowieka

Te polecenia są interaktywne i przeznaczone do użytku w terminalu:

| Polecenie | Przeznaczenie |
|-----------|---------------|
| `openspec init` | Inicjalizacja projektu (interaktywne monity) |
| `openspec view` | Interaktywny panel |
| `openspec config edit` | Otwórz konfigurację w edytorze |
| `openspec feedback` | Wyślij opinię przez GitHub |
| `openspec completion install` | Zainstaluj uzupełnienia powłoki |

### Polecenia kompatybilne z agentami

Te polecenia obsługują wyjście `--json` do programistycznego użytku przez agenty AI i skrypty:

| Polecenie | Użytek przez człowieka | Użytek przez agenta |
|-----------|------------------------|---------------------|
| `openspec list` | Przeglądaj zmiany/specyfikacje | `--json` dla danych strukturalnych |
| `openspec show <item>` | Czytaj zawartość | `--json` do parsowania |
| `openspec validate` | Sprawdź problemy | `--all --json` do masowej walidacji |
| `openspec status` | Zobacz postęp artefaktów | `--json` dla strukturalnego statusu |
| `openspec instructions` | Uzyskaj następne kroki | `--json` dla instrukcji agenta |
| `openspec templates` | Znajdź ścieżki szablonów | `--json` do rozwiązywania ścieżek |
| `openspec schemas` | Lista dostępnych schematów | `--json` do odkrywania schematów |
| `openspec workspace setup --no-interactive` | Utwórz przestrzeń roboczą z jawnymi danymi wejściowymi | `--json` dla strukturalnego wyjścia konfiguracji |
| `openspec workspace list` | Przeglądaj znane przestrzenie robocze | `--json` dla typowanych obiektów przestrzeni roboczej |
| `openspec workspace link` | Połącz repozytorium lub folder | `--json` dla strukturalnego wyjścia łączenia |
| `openspec workspace relink` | Napraw połączoną ścieżkę | `--json` dla strukturalnego wyjścia łączenia |
| `openspec workspace doctor` | Sprawdź jedną przestrzeń roboczą | `--json` dla strukturalnego wyjścia statusu |
| `openspec workspace update` | Odśwież lokalne wskazówki przestrzeni roboczej i umiejętności agentów | `--tools` wybiera agenty; profil wybiera przepływy pracy |
| `openspec context-store setup <id>` | Utwórz lokalny magazyn kontekstu | `--json` z jawnymi danymi wejściowymi dla strukturalnego wyjścia konfiguracji |
| `openspec context-store register <path>` | Zarejestruj istniejący magazyn kontekstu | `--json` dla strukturalnego wyjścia rejestracji |
| `openspec context-store unregister <id>` | Zapomnij rejestrację lokalnego magazynu kontekstu | `--json` dla strukturalnego wyjścia czyszczenia |
| `openspec context-store remove <id>` | Usuń zarejestrowany folder lokalnego magazynu kontekstu | `--yes --json` do nieinteraktywnego usuwania |
| `openspec context-store list` | Przeglądaj zarejestrowane magazyny kontekstu | `--json` dla strukturalnych rejestracji |
| `openspec context-store doctor` | Sprawdź konfigurację lokalnego magazynu | `--json` dla strukturalnej diagnostyki |
| `openspec initiative list` | Przeglądaj wspólne inicjatywy | `--json` dla strukturalnych rekordów inicjatyw |
| `openspec initiative show <id>` | Rozwiąż inicjatywę | `--json` dla kanonicznych ścieżek i metadanych |
| `openspec new change <id>` | Utwórz lokalne rusztowanie zmiany w repozytorium | `--json` oraz `--initiative` dla wspólnych łączy koordynacji |
| `openspec set change <id>` | Zaktualizuj metadane zatwierdzonej zmiany | `--json` oraz `--initiative` dla wspólnych łączy koordynacji |

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

Zainicjalizuj OpenSpec w swoim projekcie. Tworzy strukturę folderów i konfiguruje integracje narzędzi AI.

Domyślne zachowanie używa globalnych domyślnych wartości konfiguracji: profil `core`, dostarczanie `both`, przepływy pracy `propose, explore, apply, sync, archive`.

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
| `--tools <list>` | Skonfiguruj narzędzia AI nieinteraktywnie. Użyj `all`, `none` lub listy oddzielonej przecinkami |
| `--force` | Automatycznie usuń starsze pliki bez pytania |
| `--profile <profile>` | Nadpisz globalny profil dla tego uruchomienia init (`core` lub `custom`) |

`--profile custom` używa aktualnie wybranych przepływów pracy w konfiguracji globalnej (`openspec config profile`).

**Obsługiwane identyfikatory narzędzi (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**Przykłady:**

```bash
# Interaktywna inicjalizacja
openspec init

# Inicjalizacja w określonym katalogu
openspec init ./my-project

# Nieinteraktywna: konfiguracja dla Claude i Cursor
openspec init --tools claude,cursor

# Konfiguracja dla wszystkich obsługiwanych narzędzi
openspec init --tools all

# Nadpisanie profilu dla tego uruchomienia
openspec init --profile core

# Pomiń monity i automatycznie usuń starsze pliki
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

Zaktualizuj pliki instrukcji OpenSpec po aktualizacji CLI. Ponownie generuje pliki konfiguracji narzędzi AI, używając bieżącego globalnego profilu, wybranych przepływów pracy i trybu dostarczania.

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
| `--force` | Wymuś aktualizację, nawet gdy pliki są aktualne |

**Przykład:**

```bash
# Aktualizuj pliki instrukcji po aktualizacji npm
npm update @fission-ai/openspec
openspec update
```

---

## Polecenia przestrzeni roboczej

Polecenia przestrzeni roboczej są w wersji beta. Poniższy model widoku lokalnego jest bieżącym kierunkiem, ale zewnętrzna automatyzacja, integracje i długotrwałe przepływy pracy powinny nadal traktować zachowanie poleceń, pliki stanu i wyjście JSON jako zmieniające się.

Przestrzenie robocze koordynacji to lokalne widoki maszynowe na połączonych repozytoriach lub folderach. Widoczność przestrzeni roboczej nie oznacza zobowiązania do zmiany: połącz repozytorium lub foldery, które OpenSpec powinien znać, a następnie twórz zmiany, gdy będziesz gotowy do planowania konkretnej pracy.

### `openspec workspace setup`

Utwórz przestrzeń roboczą w standardowej lokalizacji przestrzeni roboczej OpenSpec i połącz co najmniej jedno istniejące repozytorium lub folder.

```bash
openspec workspace setup [options]
```

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--name <name>` | Nazwa przestrzeni roboczej. Nazwy muszą być w formacie kebab-case |
| `--link <path>` | Połącz istniejące repozytorium lub folder i wywnioskuj nazwę łącza z nazwy folderu |
| `--link <name>=<path>` | Połącz istniejące repozytorium lub folder z jawną nazwą łącza |
| `--opener <id>` | Zapisz preferowane narzędzie otwierające podczas nieinteraktywnej konfiguracji: `codex-cli`, `claude`, `github-copilot` lub `editor` |
| `--tools <tools>` | Zainstaluj lokalne umiejętności OpenSpec w przestrzeni roboczej dla agentów. Użyj `all`, `none` lub identyfikatorów narzędzi oddzielonych przecinkami |
| `--no-interactive` | Wyłącz monity; wymaga `--name` i co najmniej jednego `--link` |
| `--json` | Wyjście JSON; wymaga `--no-interactive` |

**Przykłady:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli
openspec workspace setup --no-interactive --name platform --link /repos/api --tools codex,claude
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

Interaktywna konfiguracja pyta o preferowane narzędzie otwierające i może instalować lokalne umiejętności OpenSpec w przestrzeni roboczej dla wybranych agentów. Nieinteraktywna konfiguracja zapisuje preferowane narzędzie otwierające tylko wtedy, gdy podano `--opener`; w przeciwnym razie `workspace open` monituje później w interaktywnych terminalach, gdy dostępne jest obsługiwane narzędzie otwierające, lub prosi skrypty o przekazanie `--agent <tool>` lub `--editor`.

Instalacja umiejętności przestrzeni roboczej obejmuje tylko umiejętności w tym wydaniu beta: nawet jeśli globalne dostarczanie to `commands` lub `both`, konfiguracja przestrzeni roboczej zapisuje foldery umiejętności agentów w katalogu głównym przestrzeni roboczej i nie tworzy plików poleceń ukośnikowych. Aktywny globalny profil decyduje, które umiejętności przepływu pracy są instalowane; `--tools` decyduje, które agenty je otrzymują. Jeśli pominięto `--tools` w nieinteraktywnej konfiguracji, żadne umiejętności nie są instalowane i `workspace update --tools <ids>` może je dodać później.

### `openspec workspace list`

Wyświetl listę znanych przestrzeni roboczych OpenSpec z rejestru lokalnego.

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
| `--workspace <name>` | Wybierz znaną przestrzeń roboczą z rejestru lokalnego |
| `--json` | Wyjście JSON |
| `--no-interactive` | Wyłącz monity wyboru przestrzeni roboczej |

**Przykłady:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

Ścieżka musi już istnieć. Ścieżki względne są rozwiązywane względem bieżącego katalogu polecenia, zanim OpenSpec zapisze zweryfikowaną ścieżkę bezwzględną w lokalnym stanie maszynowym przestrzeni roboczej. Połączone ścieżki mogą być pełnymi repozytoriami, paczkami, usługami, aplikacjami lub folderami bez lokalnego stanu `openspec/` w repozytorium.

### `openspec workspace relink`

Napraw lub zmień lokalną ścieżkę dla istniejącego łącza.

```bash
openspec workspace relink <name> <path> [options]
```

Ścieżka musi już istnieć. Relink aktualizuje tylko lokalną ścieżkę maszynową dla stabilnej nazwy łącza.

### `openspec workspace doctor`

Sprawdź, co jedna przestrzeń robocza może rozwiązać na bieżącej maszynie.

```bash
openspec workspace doctor [options]
```

Doctor pokazuje lokalizację przestrzeni roboczej, połączone repozytoria lub foldery, brakujące ścieżki, ścieżki specyfikacji lokalnych repozytoriów, gdy są obecne, oraz sugerowane poprawki. Wyjście JSON zawiera również ścieżkę planowania przestrzeni roboczej dla kompatybilności. Raportuje tylko problemy; nie naprawia ich automatycznie.

Polecenia wymagające jednej przestrzeni roboczej używają bieżącej przestrzeni roboczej, gdy są uruchamiane z folderu lub podkatalogu przestrzeni roboczej. Z innego miejsca przekaż `--workspace <name>`, wybierz z selektora w interaktywnym terminalu lub polegaj na jedynej znanej przestrzeni roboczej, gdy istnieje dokładnie jedna. W trybie `--json` lub `--no-interactive` niejednoznaczny wybór kończy się błędem strukturalnego statusu i sugeruje `--workspace <name>`.

Odpowiedzi JSON używają typowanych obiektów oraz tablic `status`. Dane główne znajdują się w `workspace`, `workspaces` lub `link`; ostrzeżenia i błędy znajdują się w `status`.

### `openspec workspace update`

Odśwież lokalne wskazówki OpenSpec przestrzeni roboczej i umiejętności agentów.

```bash
openspec workspace update [name] [options]
```

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--workspace <name>` | Wybierz znaną przestrzeń roboczą z rejestru lokalnego |
| `--tools <tools>` | Wybierz agenty dla umiejętności przestrzeni roboczej. Użyj `all`, `none` lub identyfikatorów narzędzi oddzielonych przecinkami |
| `--json` | Wyjście JSON |
| `--no-interactive` | Wyłącz monity wyboru przestrzeni roboczej |

**Przykłady:**

```bash
openspec workspace update
openspec workspace update platform
openspec workspace update --workspace platform --tools codex,claude
openspec workspace update --workspace platform --tools none
```

`workspace update` odświeża wygenerowany blok wskazówek przestrzeni roboczej i lokalną powierzchnię otwartą. Dla umiejętności agentów ponownie używa zapisanego wyboru agenta umiejętności przestrzeni roboczej, gdy pominięto `--tools`. Przekazanie `--tools` zastępuje ten zapisany wybór. Odświeża tylko katalogi umiejętności przepływu pracy zarządzane przez OpenSpec w katalogu głównym przestrzeni roboczej, usuwa odznaczone zarządzane umiejętności przepływu pracy i nie dotyka połączonych repozytoriów i folderów.

Uruchomienie `openspec update` z wnętrza przestrzeni roboczej przekierowuje do `openspec workspace update`; uruchom `openspec update` w projektach lokalnych repozytoriów, gdy chcesz zaktualizować pliki narzędzi należące do repozytorium.

### `openspec workspace open`

Otwórz zbiór roboczy przestrzeni roboczej przez zapisane preferowane narzędzie otwierające, jednosesyjne nadpisanie agenta lub tryb edytora VS Code.

```bash
openspec workspace open [name] [options]
```

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--workspace <name>` | Alias dla pozycyjnej nazwy przestrzeni roboczej |
| `--initiative <id>` | Otwórz inicjatywę jako lokalny widok przestrzeni roboczej. Akceptuje `<id>` lub `<store>/<id>` |
| `--store <id>` | Identyfikator zarejestrowanego magazynu kontekstu dla `--initiative` |
| `--store-path <path>` | Istniejący lokalny katalog główny magazynu kontekstu dla `--initiative` |
| `--agent <tool>` | Jednosesyjne nadpisanie agenta: `codex-cli`, `claude` lub `github-copilot` |
| `--editor` | Otwórz utrzymywany plik przestrzeni roboczej VS Code jako normalną przestrzeń roboczą edytora |
| `--no-interactive` | Wyłącz monity wyboru przestrzeni roboczej i narzędzia otwierającego |

**Przykłady:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex-cli
openspec workspace open --editor
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative platform/billing-launch
```

`workspace open` używa bieżącej przestrzeni roboczej, gdy jest uruchamiane w jej wnętrzu, automatycznie wybiera jedyną znaną przestrzeń roboczą, gdy jest uruchamiane z innego miejsca, i pyta użytkownika o wybór, gdy znanych jest wiele przestrzeni roboczych. `--agent` i `--editor` nie zmieniają zapisanego preferowanego narzędzia otwierającego. Przekazanie obu nadpisań narzędzia otwierającego jest błędem; wybierz `--agent <tool>` lub `--editor`.

Gdy użyto `--initiative`, OpenSpec przygotowuje lub wybiera prywatny lokalny widok przestrzeni roboczej dla tej inicjatywy. Magazyny wybrane z rejestru są zapisywane według identyfikatora; `--store-path` zapisuje selektor ścieżki lokalnej dla środowiska uruchomieniowego, ponieważ widoki przestrzeni roboczej są prywatnym stanem lokalnym.

OpenSpec utrzymuje `<workspace-name>.code-workspace` w katalogu głównym przestrzeni roboczej dla otwarć VS Code i GitHub Copilot w VS Code. Ten plik jest stanem lokalnego widoku maszynowego przestrzeni roboczej.

Utrzymywana przestrzeń robocza VS Code列出 najpierw prawidłowe połączone repozytoria lub foldery, następnie kontekst inicjatywy, gdy jest dołączony, a następnie pliki przestrzeni roboczej OpenSpec. VS Code wyświetla te wpisy jako przestrzeń roboczą wielokorzeniową.

Otwarcie głównej przestrzeni roboczej czyni połączone repozytoria lub foldery widocznymi do eksploracji i kontekstu. Edycje implementacji powinny rozpocząć się dopiero po jawnym żądaniu użytkownika i normalnym przepływie pracy implementacji OpenSpec.

---

## Komendy współdzielonego kontekstu

Magazyny kontekstu i inicjatywy to koordynacyjne powierzchnie w fazie beta. Magazyn kontekstu jest lokalną rejestracją dla trwałego współdzielonego kontekstu, zazwyczaj folderu lub klonu opartego na Git. Inicjatywa to współdzielony kontekst koordynacji wewnątrz magazynu kontekstu; lokalne zmiany w repozytorium mogą się do niego odwoływać bez kopiowania współdzielonego planu do każdego repozytorium.

### `openspec context-store setup`

Tworzenie i rejestrowanie lokalnego magazynu kontekstu. W terminalu bez argumentów OpenSpec przeprowadzi użytkownika przez konfigurację. Agenty i skrypty powinny przekazywać jawne dane wejściowe i używać `--json`.

```bash
openspec context-store setup [id] [options]
```

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--path <path>` | Ścieżka folderu magazynu kontekstu; domyślnie katalog danych lokalnych zarządzanych przez OpenSpec |
| `--init-git` | Inicjalizuj repozytorium Git w magazynie kontekstu |
| `--no-init-git` | Nie inicjalizuj repozytorium Git |
| `--json` | Wynik w formacie JSON |

Gdy `--path` jest pominięte, konfiguracja tworzy magazyn w `getGlobalDataDir()/context-stores/<id>`: `$XDG_DATA_HOME/openspec/context-stores/<id>` gdy `XDG_DATA_HOME` jest ustawione lub `~/.local/share/openspec/context-stores/<id>` jako alternatywa w stylu Uniksowym. Użyj `--path`, gdy chcesz, aby magazyn znajdował się w widocznym klonie lub folderze specyficznym dla zespołu.

Przykłady:

```bash
openspec context-store setup
openspec context-store setup team-context
openspec context-store setup team-context --path /repos/team-context --no-init-git
openspec context-store setup team-context --json --no-init-git
```

### `openspec context-store register`

Rejestrowanie istniejącego lokalnego folderu magazynu kontekstu.

```bash
openspec context-store register [path] [options]
```

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--id <id>` | Identyfikator magazynu kontekstu; domyślnie metadane magazynu lub nazwa folderu |
| `--json` | Wynik w formacie JSON |

### `openspec context-store unregister`

Usunięcie rejestracji lokalnego magazynu kontekstu bez usuwania plików.

```bash
openspec context-store unregister <id> [--json]
```

Użyj tej komendy, gdy magazyn został przeniesiony, sklonowany w inne miejsce lub nie powinien być już wyświetlany przez OpenSpec na tym komputerze.

### `openspec context-store remove`

Usunięcie rejestracji lokalnego magazynu kontekstu i usunięcie jego lokalnego folderu.

```bash
openspec context-store remove <id> [--yes] [--json]
```

`remove` wyświetla dokładną ścieżkę folderu przed usunięciem w interaktywnym terminalu. Agenty, skrypty i wywołania JSON muszą przekazać `--yes`, aby potwierdzić usunięcie. OpenSpec odmawia usunięcia folderu, który nie zawiera pasujących metadanych magazynu kontekstu.

### `openspec context-store list`

Listowanie lokalnie zarejestrowanych magazynów kontekstu.

```bash
openspec context-store list [--json]
openspec context-store ls [--json]
```

### `openspec context-store doctor`

Sprawdzanie lokalnej rejestracji magazynu kontekstu, metadanych i obecności Git.

```bash
openspec context-store doctor [id] [--json]
```

Doctor jest narzędziem wyłącznie diagnostycznym; raportuje brakujące katalogi główne, niezgodności metadanych i nieprawidłowy stan lokalnej rejestracji bez modyfikowania magazynu.

### `openspec initiative create`

Tworzenie inicjatywy w magazynie kontekstu.

```bash
openspec initiative create <id> --title <title> --summary <summary> [options]
```

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--store <id>` | Identyfikator magazynu kontekstu z lokalnej rejestracji |
| `--store-path <path>` | Istniejący lokalny katalog główny magazynu kontekstu |
| `--title <title>` | Tytuł inicjatywy |
| `--summary <summary>` | Podsumowanie inicjatywy |
| `--json` | Wynik w formacie JSON |

### `openspec initiative list`

Listowanie inicjatyw. Bez selektora, komenda przeszukuje wszystkie zarejestrowane magazyny kontekstu i raportuje ostrzeżenia o częściowym odczycie w `status`.

```bash
openspec initiative list [options]
openspec initiative ls [options]
```

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--store <id>` | Listowanie jednego zarejestrowanego magazynu kontekstu |
| `--store-path <path>` | Listowanie jednego istniejącego lokalnego katalogu głównego magazynu kontekstu |
| `--json` | Wynik w formacie JSON |

### `openspec initiative show`

Rozwiązywanie inicjatywy i wyświetlanie jej kanonicznej lokalizacji.

```bash
openspec initiative show <id> [options]
openspec initiative show <store>/<id> [options]
```

Bez `--store` OpenSpec przeszukuje zarejestrowane magazyny kontekstu. Jeśli ten sam identyfikator inicjatywy istnieje w wielu magazynach, przekaż `--store <id>` lub użyj formularza `<store>/<id>`.

---

## Komendy przeglądania

### `openspec list`

Wyświetl zmiany lub specyfikacje w swoim projekcie.

```
openspec list [opcje]
```

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--specs` | Wyświetl specyfikacje zamiast zmian |
| `--changes` | Wyświetl zmiany (domyślnie) |
| `--sort <kolejność>` | Sortuj wg `recent` (domyślnie) lub `name` |
| `--json` | Wyświetl jako JSON |

**Przykłady:**

```bash
# Wyświetl wszystkie aktywne zmiany
openspec list

# Wyświetl wszystkie specyfikacje
openspec list --specs

# Wynik JSON dla skryptów
openspec list --json
```

**Wynik (tekst):**

```
Active changes:
  add-dark-mode     UI theme switching support
  fix-login-bug     Session timeout handling
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
| `nazwa-elementu` | Nie | Nazwa zmiany lub specyfikacji (pyta o podanie, jeśli pominięto) |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--type <typ>` | Określ typ: `change` lub `spec` (wykrywany automatycznie, jeśli jednoznaczny) |
| `--json` | Wyświetl jako JSON |
| `--no-interactive` | Wyłącz monity |

**Opcje specyficzne dla zmian:**

| Opcja | Opis |
|--------|-------------|
| `--deltas-only` | Wyświetl tylko delty specyfikacji (tryb JSON) |

**Opcje specyficzne dla specyfikacji:**

| Opcja | Opis |
|--------|-------------|
| `--requirements` | Wyświetl tylko wymagania, wyklucz scenariusze (tryb JSON) |
| `--no-scenarios` | Wyklucz zawartość scenariuszy (tryb JSON) |
| `-r, --requirement <id>` | Wyświetl określone wymaganie wg indeksu od 1 (tryb JSON) |

**Przykłady:**

```bash
# Interaktywny wybór
openspec show

# Wyświetl określoną zmianę
openspec show add-dark-mode

# Wyświetl określoną specyfikację
openspec show auth --type spec

# Wynik JSON do przetwarzania
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
| `nazwa-elementu` | Nie | Określony element do walidacji (pyta o podanie, jeśli pominięto) |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--all` | Waliduj wszystkie zmiany i specyfikacje |
| `--changes` | Waliduj wszystkie zmiany |
| `--specs` | Waliduj wszystkie specyfikacje |
| `--type <typ>` | Określ typ, gdy nazwa jest niejednoznaczna: `change` lub `spec` |
| `--strict` | Włącz tryb ścisłej walidacji |
| `--json` | Wyświetl jako JSON |
| `--concurrency <n>` | Maksymalna liczba równoległych walidacji (domyślnie: 6 lub zmienna env `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Wyłącz monity |

**Przykłady:**

```bash
# Interaktywna walidacja
openspec validate

# Waliduj określoną zmianę
openspec validate add-dark-mode

# Waliduj wszystkie zmiany
openspec validate --changes

# Waliduj wszystko z wynikiem JSON (dla CI/skryptów)
openspec validate --all --json

# Ścisła walidacja ze zwiększonym stopniem równoległości
openspec validate --all --strict --concurrency 12
```

**Wynik (tekst):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**Wynik (JSON):**

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

## Komendy cyklu życia

### `openspec archive`

Archiwizuj ukończoną zmianę i scal delty specyfikacji do głównych specyfikacji.

```
openspec archive [nazwa-zmiany] [opcje]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `nazwa-zmiany` | Nie | Zmiana do archiwizacji (pyta o podanie, jeśli pominięto) |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `-y, --yes` | Pomiń monity potwierdzenia |
| `--skip-specs` | Pomiń aktualizacje specyfikacji (dla zmian dotyczących tylko infrastruktury/narzędzi/dokumentacji) |
| `--no-validate` | Pomiń walidację (wymaga potwierdzenia) |

**Przykłady:**

```bash
# Interaktywna archiwizacja
openspec archive

# Archiwizuj określoną zmianę
openspec archive add-dark-mode

# Archiwizacja bez monitów (CI/skrypty)
openspec archive add-dark-mode --yes

# Archiwizacja zmiany narzędziowej, która nie wpływa na specyfikacje
openspec archive update-ci-config --skip-specs
```

**Co robi:**

1. Waliduje zmianę (chyba że `--no-validate`)
2. Prosi o potwierdzenie (chyba że `--yes`)
3. Scal delty specyfikacji do `openspec/specs/`
4. Przenosi folder zmiany do `openspec/changes/archive/YYYY-MM-DD-<nazwa>/`

---

## Komendy przepływu pracy

Te komendy obsługują przepływ pracy OPSX oparty na artefaktach. Są przydatne zarówno dla osób sprawdzających postęp, jak i agentów określających następne kroki.

### `openspec new change`

Utwórz lokalny katalog zmiany w repozytorium i opcjonalny metadane zapisane w repozytorium.

```bash
openspec new change <nazwa> [opcje]
```

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--description <tekst>` | Opis do dodania w `README.md` |
| `--goal <tekst>` | Cel produktu workspace'u do przechowywania ze zmianą |
| `--areas <nazwy>` | Nazwy powiązanych linków workspace'u oddzielone przecinkami |
| `--initiative <id>` | Powiąż lokalną zmianę z inicjatywą |
| `--store <id>` | Identyfikator magazynu kontekstu dla `--initiative` |
| `--store-path <ścieżka>` | Istniejący lokalny katalog główny magazynu kontekstu dla `--initiative` |
| `--schema <nazwa>` | Schemat przepływu pracy do użycia |
| `--json` | Wyświetl JSON |

Przykłady:

```bash
openspec new change add-billing-api --initiative billing-launch --store platform
openspec new change add-billing-api --initiative platform/billing-launch --json
```

### `openspec set change`

Zaktualizuj metadane lokalnej zmiany zapisane w repozytorium bez ponownego tworzenia zmiany.

```bash
openspec set change <nazwa> [opcje]
```

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--initiative <id>` | Powiąż lokalną zmianę z inicjatywą |
| `--store <id>` | Identyfikator magazynu kontekstu dla `--initiative` |
| `--store-path <ścieżka>` | Istniejący lokalny katalog główny magazynu kontekstu dla `--initiative` |
| `--json` | Wyświetl JSON |

`set change --initiative` jest idempotentne, gdy żądane powiązanie już istnieje, i odmawia zastąpienia innego istniejącego powiązania z inicjatywą.

### `openspec status`

Wyświetl status ukończenia artefaktów dla zmiany.

```
openspec status [opcje]
```

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--change <id>` | Nazwa zmiany (pyta o podanie, jeśli pominięto) |
| `--schema <nazwa>` | Nadpisanie schematu (wykrywane automatycznie z konfiguracji zmiany) |
| `--json` | Wyświetl jako JSON |

**Przykłady:**

```bash
# Interaktywne sprawdzenie statusu
openspec status

# Status określonej zmiany
openspec status --change add-dark-mode

# JSON dla agenta
openspec status --change add-dark-mode --json
```

**Wynik (tekst):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

**Wynik (JSON):**

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

Uzyskaj wzbogacone instrukcje do tworzenia artefaktu lub wdrażania zadań. Używane przez agentów AI do zrozumienia, co utworzyć dalej.

```
openspec instructions [artefakt] [opcje]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `artefakt` | Nie | Identyfikator artefaktu: `proposal`, `specs`, `design`, `tasks` lub `apply` |

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--change <id>` | Nazwa zmiany (wymagana w trybie nieinteraktywnym) |
| `--schema <nazwa>` | Nadpisanie schematu |
| `--json` | Wyświetl jako JSON |

**Przypadek specjalny:** Użyj `apply` jako artefaktu, aby uzyskać instrukcje implementacji zadań.

**Przykłady:**

```bash
# Uzyskaj instrukcje dla następnego artefaktu
openspec instructions --change add-dark-mode

# Uzyskaj instrukcje dla określonego artefaktu
openspec instructions design --change add-dark-mode

# Uzyskaj instrukcje apply/implementacji
openspec instructions apply --change add-dark-mode

# JSON dla agenta
openspec instructions design --change add-dark-mode --json
```

**Wynik zawiera:**

- Treść szablonu dla artefaktu
- Kontekst projektu z konfiguracji
- Treść z artefaktów zależności
- Reguły dla każdego artefaktu z konfiguracji

---

### `openspec templates`

Wyświetl rozstrzygnięte ścieżki szablonów dla wszystkich artefaktów w schemacie.

```
openspec templates [opcje]
```

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--schema <nazwa>` | Schemat do sprawdzenia (domyślnie: `spec-driven`) |
| `--json` | Wyświetl jako JSON |

**Przykłady:**

```bash
# Wyświetl ścieżki szablonów dla domyślnego schematu
openspec templates

# Wyświetl szablony dla niestandardowego schematu
openspec templates --schema my-workflow

# JSON do użycia programistycznego
openspec templates --json
```

**Wynik (tekst):**

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
openspec schemas [opcje]
```

**Opcje:**

| Opcja | Opis |
|--------|-------------|
| `--json` | Wyświetl jako JSON |

**Przykład:**

```bash
openspec schemas
```

**Wynik:**

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

## Polecenia Schematów

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
| `--artifacts <list>` | Lista identyfikatorów artefaktów oddzielonych przecinkami (domyślnie: `proposal,specs,design,tasks`) |
| `--default` | Ustaw jako domyślny schemat projektu |
| `--no-default` | Nie pytaj o ustawienie jako domyślny |
| `--force` | Nadpisz istniejący schemat |
| `--json` | Wynik w formacie JSON |

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

**Co zostanie utworzone:**

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
| `--json` | Wynik w formacie JSON |

**Przykład:**

```bash
# Fork wbudowanego schematu spec-driven
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Waliduj strukturę schematu i szablony.

```
openspec schema validate [name] [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `name` | Nie | Schemat do walidacji (jeśli pominięty, waliduje wszystkie) |

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--verbose` | Pokaż szczegółowe kroki walidacji |
| `--json` | Wynik w formacie JSON |

**Przykład:**

```bash
# Waliduj określony schemat
openspec schema validate my-workflow

# Waliduj wszystkie schematy
openspec schema validate
```

---

### `openspec schema which`

Pokaż, skąd rozwiązywany jest schemat (przydatne do debugowania priorytetów).

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
| `--json` | Wynik w formacie JSON |

**Przykład:**

```bash
# Sprawdź, skąd pochodzi schemat
openspec schema which spec-driven
```

**Wynik:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Priorytet schematów:**

1. Projekt: `openspec/schemas/<name>/`
2. Użytkownik: `~/.local/share/openspec/schemas/<name>/`
3. Pakiet: Wbudowane schematy

---

## Polecenia Konfiguracji

### `openspec config`

Wyświetl i modyfikuj globalną konfigurację OpenSpec.

```
openspec config <subcommand> [options]
```

**Podpolecenia:**

| Podpolecenie | Opis |
|--------------|------|
| `path` | Pokaż lokalizację pliku konfiguracji |
| `list` | Pokaż wszystkie bieżące ustawienia |
| `get <key>` | Pobierz określoną wartość |
| `set <key> <value>` | Ustaw wartość |
| `unset <key>` | Usuń klucz |
| `reset` | Przywróć wartości domyślne |
| `edit` | Otwórz w `$EDITOR` |
| `profile [preset]` | Konfiguruj profil przepływu pracy interaktywnie lub za pomocą presetu |

**Przykłady:**

```bash
# Pokaż ścieżkę pliku konfiguracji
openspec config path

# Wyświetl wszystkie ustawienia
openspec config list

# Pobierz określoną wartość
openspec config get telemetry.enabled

# Ustaw wartość
openspec config set telemetry.enabled false

# Jawne ustawienie wartości tekstowej
openspec config set user.name "My Name" --string

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

`openspec config profile` rozpoczyna się od podsumowania bieżącego stanu, a następnie pozwala wybrać:
- Zmień dostarczanie + przepływy pracy
- Zmień tylko dostarczanie
- Zmień tylko przepływy pracy
- Zachowaj bieżące ustawienia (zakończ)

Jeśli zachowasz bieżące ustawienia, żadne zmiany nie zostaną zapisane i nie zostanie wyświetlony monit o aktualizację.
Jeśli nie ma zmian w konfiguracji, ale bieżące pliki projektu lub obszaru roboczego są niezsynchronizowane z globalnym profilem/trybem dostarczania, OpenSpec wyświetli ostrzeżenie i zasugeruje `openspec update` dla projektów lokalnych repozytorium lub `openspec workspace update` dla lokalnych wytycznych i umiejętności obszaru roboczego.
Naciśnięcie `Ctrl+C` również czysto anuluje proces (bez śladu stosu) i kończy z kodem `130`.
Na liście kontrolnej przepływów pracy `[x]` oznacza, że przepływ pracy jest wybrany w konfiguracji globalnej. Aby zastosować te wybory do plików projektu, uruchom `openspec update` (lub wybierz `Apply changes to this project now?` gdy zostaniesz o to poproszony wewnątrz projektu). Z poziomu obszaru roboczego użyj `openspec workspace update`, aby odświeżyć lokalne wytyczne i umiejętności obszaru roboczego; dotyczy to wyłącznie umiejętności dla wygenerowanych plików przepływu pracy agenta i nie generuje poleceń ukośnych obszaru roboczego.

**Przykłady interaktywne:**

```bash
# Aktualizacja tylko dostarczania
openspec config profile
# wybierz: Change delivery only
# wybierz dostarczanie: Skills only

# Aktualizacja tylko przepływów pracy
openspec config profile
# wybierz: Change workflows only
# przełącz przepływy pracy na liście kontrolnej, a następnie potwierdź
```

---

## Polecenia Narzędziowe

### `openspec feedback`

Prześlij opinię na temat OpenSpec. Tworzy zgłoszenie na GitHubie.

```
openspec feedback <message> [options]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|------|
| `message` | Tak | Treść opinii |

**Opcje:**

| Opcja | Opis |
|-------|------|
| `--body <text>` | Szczegółowy opis |

**Wymagania:** GitHub CLI (`gh`) musi być zainstalowany i uwierzytelniony.

**Przykład:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Zarządzaj uzupełnianiami powłoki dla CLI OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Podpolecenia:**

| Podpolecenie | Opis |
|--------------|------|
| `generate [shell]` | Wygeneruj skrypt uzupełniania na stdout |
| `install [shell]` | Zainstaluj uzupełnianie dla twojej powłoki |
| `uninstall [shell]` | Usuń zainstalowane uzupełniania |

**Obsługiwane powłoki:** `bash`, `zsh`, `fish`, `powershell`

**Przykłady:**

```bash
# Zainstaluj uzupełniania (automatyczne wykrywanie powłoki)
openspec completion install

# Instalacja dla określonej powłoki
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
| `1` | Błąd (niepowodzenie walidacji, brakujące pliki itp.) |

---

## Zmienne Środowiskowe

| Zmienna | Opis |
|---------|------|
| `OPENSPEC_TELEMETRY` | Ustaw na `0`, aby wyłączyć telemetrię |
| `DO_NOT_TRACK` | Ustaw na `1`, aby wyłączyć telemetrię (standardowy sygnał DNT) |
| `OPENSPEC_CONCURRENCY` | Domyślna współbieżność dla zbiorczej walidacji (domyślnie: 6) |
| `EDITOR` lub `VISUAL` | Edytor dla `openspec config edit` |
| `NO_COLOR` | Wyłącza kolorowe wyjście, gdy ustawione |

---

## Powiązana Dokumentacja

- [Polecenia](commands.md) - Polecenia ukośne AI (`/opsx:propose`, `/opsx:apply` itp.)
- [Przepływy pracy](workflows.md) - Typowe wzorce i kiedy używać poszczególnych poleceń
- [Dostosowywanie](customization.md) - Tworzenie niestandardowych schematów i szablonów
- [Pierwsze kroki](getting-started.md) - Przewodnik po pierwszej konfiguracji