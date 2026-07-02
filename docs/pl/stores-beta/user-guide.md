# Stores: Plan w Własnym Repo

> **Beta.** Stores, references, working context i worksets są nowe. Nazwy komend, flagi, formaty plików i JSON output mogą nadal zmieniać kształt między wydaniami. Każdy przewodnik poniżej został uruchomiony na podstawie obecnej wersji, ale prosimy o ponowne przeczytanie tego przewodnika po aktualizacji.

## Problem, który to rozwiązuje

OpenSpec zazwyczajowo znajduje się w jednym repozie: folderze `openspec/` obok Twojego kodu, zawierającym specyfikacje i zmiany dla tego repo.

To przestaje pasować, gdy planowanie jest większe niż jedno repo:

- Twoja praca obejmuje wiele repozytoriów — jedna funkcja dotyka serwera API, aplikacji webowej i biblioteki współdzielonej. W jakim folderze `openspec/` ma się znajdować ten plan?
- Twój zespół planuje zanim kod istnieje lub planuje rzeczy, które nigdy nie staną się kodem w *tym* repo.
- Wymagania są własnością jednego zespołu i konsumowane przez inne. Wersja z wiki ulega dryfowaniu, a Twój agent kodujący i tak tego nie przeczyta.

**Store** jest odpowiedzią: samodzielne repo, którego jedynym zadaniem jest planowanie. Ma ten sam kształt `openspec/`, który już znaszuje — specyfikacje i zmiany — plus mały plik identyfikacyjny. Rejestrujesz go raz na swoim komputerze, pod nazwą, a następnie każda normalna komenda OpenSpec może działać w nim z dowolnego miejsca.

## Kształt

```
            team-plans  (a store: planning in its own repo)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      what is true
                └── changes/    what is in motion
                      ▲
                      │ registered on each machine by name;
                      │ shared by pushing/cloning like any repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

Dwie zasady utrzymują to w prostocie:

1. **Store to jest po prostu repozytorium Git.** Samodzielnie commitasz, pushujesz, pullujesz i go recenzujesz. OpenSpec nigdy sam nie klonuje, synchronizuje ani niczego pushuje.
2. **Deklaracje, a nie mechanizmy.** Repozytoria mogą *deklarować*, jak odnoszą się do store'ów (pokazano poniżej). Deklaracje zmieniają to, co OpenSpec może Ci powiedzieć – nigdy to, gdzie działają Twoje komendy.

## Pięć minut do pierwszego store'a

Dwie komendy przenoszą Cię od niczego do działającej zmiany z zakresu store:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Następnie: uruchom standardowe komendy OpenSpec względem tego store'a, na przykład:
  openspec new change <change-id> --store team-plans
Udostępnij ten store, committując i pushując go tak jak każde repozytorium Git.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Następnie: openspec status --change add-login --store team-plans
```

To jest cały model. Od tego momentu cykl życia jest dokładnie taki, jaki znasz – `status`, `instructions`, `validate`, `archive` — z `--store team-plans` w każdej komendzie, a każdy wyświetlony hint niesie flagę dla Ciebie. Linia `Using OpenSpec root:` zawsze mówi Ci, gdzie dana komenda działa.

## Historia: jeden zespół, jedno repozytorium planowania

Zespół przechowuje swoje specyfikacje i zmiany w `team-plans`, zamiast rozrzucać je po różnych repozytoriach kodu.

**Dzień pierwszy (kto to skonfiguruje):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Przekazanie `--remote` zapisuje URL klonowania w wewnętrznym pliku tożsamości store'a (`.openspec-store/store.yaml`) podczas początkowego commita. Każde przyszłe klonowanie rodzi się wiedząc, skąd pochodzi, dzięki czemu sprawdzenia stanu i komunikaty o błędach mogą wyświetlić kompletne, kopiowalne rozwiązanie dla kolegów z zespołu, którzy jeszcze go nie mają.

**Każdy członek zespołu (raz na maszynę):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

Od tego czasu wszyscy pracują w tym samym repozytorium planowania, identyfikującym się przez nazwę:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**Dzielenie pracy to Git, i to celowo.** Zmiana, którą tworzysz, istnieje tylko w Twoim checkoutie, dopóki nie commitasz i nie pushujesz jej – tak jak kod. Plany otrzymują gałęzie (branches), pull requesty i recenzje za darmo, ponieważ store jest zwykłym repozytorium.

**Łączenie repozytoriów kodu zespołu.** Repozytorium kodu, którego planowanie jest w pełni zexternalizowane, potrzebuje dokładnie jednej linii w pliku `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Teraz każda komenda OpenSpec uruchomiona wewnątrz `web-app` działa na `team-plans` bez żadnych flag:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

Wskaźnik jest opcją zapasową, nigdy nadpisaniem: jawny `--store` zawsze wygrywa, a jeśli repozytorium rozwinie własne foldery planowania, te zwyciężą (z ostrzeżeniem o usunięciu nieaktualnego wskaźnika).

## Historia: wymagania przekraczające granice zespołów

Zespół platformy posiada te wymagania. Zespoły produktowe budują na nich, w swoich własnych repozytoriach, z własnymi projektami. Odniesienie opisuje tę relację bez przemieszczania pracy nikogo.

```
   platform-reqs (store)                 api-server (code repo)
   owned by the platform team            owned by a product team
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ reads    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (their own designs)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (their own work)       │
   │                          │          │          └──────────────────────────┘
   └──────────────────────────┘
```

**Zespół produktowy deklaruje, na czym się opiera** w pliku `openspec/config.yaml` swojego repozytorium:

```yaml
references:
  - platform-reqs
```

Odniesienia są kontekstem tylko do odczytu. Repozytorium zachowuje swój własny główny katalog `openspec/`; praca pozostaje tam. Co się zmienia: `openspec instructions` w tym repozytorium teraz zawiera indeks specyfikacji referencyjnego store'a — każda z jednowierszowym podsumowaniem i dokładną komendą pobrania (`openspec show <spec-id> --type spec --store platform-reqs`). Agent pracujący w `api-server` może znaleźć upstreamowe wymagania dotyczące płatności, je przywołać i napisać swój niskopoziomowy projekt w własnym głównym katalogu repozytorium — bez konieczności kopiowania kontekstu.

Odniesienie może zawierać źródło klonowania, dzięki czemu członkowie zespołu, którzy jeszcze nie mają tego store'a, otrzymują kompletne rozwiązanie zamiast ślepego zaułka:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Gdy chcesz mieć plan i kod otwarte razem, utwórz workset.** Jest to osobiste i jawne: każda osoba wybiera foldery, z którymi faktycznie pracuje na swojej maszynie. Nic o tych lokalnych ścieżkach checkoutu nie jest committowane do wspólnego repozytorium planowania.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Dwa pytania, które zawsze możesz zadać

**„Czy moja konfiguracja jest zdrowa?”** — `openspec doctor` sprawdza bieżący główny katalog i odniesione store'y, tylko do odczytu, z kopiowalnym rozwiązaniem dla każdego znaleziska:

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Odniesiony store 'design-system' nie jest zarejestrowany na tej maszynie.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**„Z czym pracuję?”** — `openspec context` składa zestaw pracy z deklaracji OpenSpec: głównego katalogu i odniesionych store'ów.

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

Oba wspierają `--json` dla agentów. `openspec context --code-workspace <path>` dodatkowo zapisuje plik przestrzeni roboczej VS Code zawierający cały zestaw – to jedyna operacja zapisu wykonywana przez tę komendę.

## Worksety: ponownie otwórz foldery, nad którymi pracujesz razem

Osobno od wszystkiego powyższego: większość ludzi otwiera te same kilka folderów podczas każdej sesji – repozytorium planowania oraz dwa lub trzy repozytoria kodu. **Workset** to osobisty, nazwany widok tego dokładnie, ponownie otwarty jedną komendą w wybranym narzędziu.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       all three open in your tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --member ~/src/web-app
openspec workset list
```

```
platform  (opens in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` następnie uruchamia zapisane narzędzie: edytory (VS Code, Cursor) otwierają jedno okno ze wszystkimi członkami i wracają. Pierwszy członek jest główny. Możesz zawsze nadpisać narzędzie za pomocą `--tool <id>`.

Worksety celowo *nie* są stanem współdzielonym. Istnieją na Twojej maszynie, nigdy nie są committowane i nic nie mówią o pracy – rejestrują jedynie to, co lubisz mieć otwarte razem. Usunięcie jednego nigdy nie dotyka folderów członków. Nowe narzędzia są konfiguracją, a nie kodem: wszystko, co jest uruchamiane za pomocą pliku przestrzeni roboczej lub flag attach per-folder, może być dodane pod kluczem `openers` w globalnej konfiguracji (`openspec config edit`).

## Jak komendy decydują, gdzie działać

Każda zwykła komenda rozstrzyga swój główny katalog w ten sam sposób, w tej kolejności:

```
1. --store <id>          Ty to jawnie podałeś        → ten store
2. nearest openspec/     Prawdziwy główny katalog planowania tutaj → to repozytorium
   (walking up from cwd)
3. store: pointer        config.yaml deklaruje store  → ten store
4. none of the above     Store'ów nie ma na tej maszynie?         → błąd z sugestią wyboru
                         nie ma zarejestrowanych store'ów?         → bieżący katalog
                                                          (klasyczne zachowanie)
```

Linia `Using OpenSpec root:` (oraz blok `root` w wyjściu `--json`) mówi Ci, w jakim przypadku się znajdujesz.

## Znane ograniczenia

- **Kształt beta.** Wszystko na tej stronie może ulec zmianie między wydaniami – nazwy, flagi, formaty plików, klucze JSON.
- **Jeden checkout na identyfikator store na maszynę.** Rejestracja drugiego checkoutu pod tym samym ID kończy się niepowodzeniem z sugestią, aby najpierw wykonać `store unregister`.
- **Żadnego synchronizowania, nigdy – celowo.** OpenSpec nigdy nie klonuje, nie pobiera ani nie pushuje. Nieaktualny checkout pokazuje nieaktualne specyfikacje, dopóki *Ty* ich nie pobierzesz; odniesienia są indeksowane na żywo z tego, co znajduje się na dysku.
- **Niektóre komendy pozostają niezmienione.** `view`, `templates`, `schemas` oraz przestarzałe formy rzeczownikowe (`openspec change show`, ...) działają tylko na bieżącym katalogu – bez `--store`.
- **Stan na maszynę jest specyficzny dla danej maszyny.** Rejestr store'ów i worksety są lokalnymi ustawieniami. Nic o układzie Twojej maszyny nigdy nie jest committowane do wspólnego planowania.
- **Dwa style uruchamiania dla worksetów.** Narzędzie, które nie może być uruchomione za pomocą pliku przestrzeni roboczej lub flag attach per-folder, nie może zostać dodane jako opener.
- **JSON agenta ma znany podział wielkości liter** (klucze rodzinne store są w formacie snake_case, rodzinne przepływy pracy w camelCase). Jest to udokumentowane w [agent contract](../agent-contract.md); ujednolicenie jest odroczone do wydania z numerem wersji.

## Gdzie rzeczy istnieją

| Co | Gdzie | Czy jest współdzielone? |
|---|---|---|
| Planowanie store'a | `<store>/openspec/` (specs, changes) | Tak — committuj i pushuj |
| Tożsamość store'a | `<store>/.openspec-store/store.yaml` | Tak — committowana z store'em |
| Rejestr store'ów | `<data dir>/openspec/stores/registry.yaml` | Nie — tylko na tej maszynie |
| Worksety | `<data dir>/openspec/worksets/` | Nie — tylko na tej maszynie |

`<data dir>` to `~/.local/share/openspec` na macOS i Linux (lub `$XDG_DATA_HOME/openspec`, gdy jest ustawione), a `%LOCALAPPDATA%\openspec` na Windows.
## Odniesienie

Dokładne flagi i kształty JSON dla każdej komendy na tej stronie: [CLI reference](../cli.md) (Store'y, Doktor, Kontekst pracy, Osobiste worksety) oraz [agent contract](../agent-contract.md).