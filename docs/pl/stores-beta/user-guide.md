# Stores: Plan w własnym repozytorium

> **Beta.** Stores, references, working context i worksets są nowe. Nazwy poleceń, flagi, formaty plików i dane wyjściowe JSON mogą jeszcze zmieniać kształt między wydaniami. Każdy poniższy przewodnik krok po kroku został uruchomiony na bieżącej kompilacji, ale przeczytaj ponownie ten przewodnik po aktualizacji.

## Problem, który rozwiązuje

OpenSpec domyślnie znajduje się w jednym repozytorium kodu: folderze `openspec/` obok Twojego kodu, przechowującym specs i changes dla tego repozytorium.

To przestaje być wystarczające, gdy planowanie wykracza poza zakres jednego repozytorium:

- Twoja praca obejmuje kilka repozytoriów – jedna funkcja dotyczy serwera API, aplikacji webowej i wspólnej biblioteki. W którym folderze `openspec/` ma przechowywany plan?
- Twój zespół tworzy plany przed powstaniem kodu, lub planuje rzeczy, które nigdy nie staną się kodem w *tym* repozytorium.
- Wymagania są własnością jednego zespołu i wykorzystywane przez innych. Wersja na wiki rozjeżdża się, a Twój agent kodujący i tak nie może jej odczytać.

**store** jest odpowiedzią: samodzielne repozytorium, którego jedynym zadaniem jest planowanie. Ma taką samą strukturę folderu `openspec/`, którą już znasz – specs i changes – oraz mały plik tożsamości. Rejestrujesz go raz na swoim komputerze, podając nazwę, a następnie każde standardowe polecenie OpenSpec może w nim działać z dowolnego miejsca.

## Struktura

```
            team-plans  (magazyn: planowanie we własnym repozytorium)
            ├── .openspec-store/store.yaml     tożsamość: "Jestem team-plans"
            └── openspec/
                ├── specs/      co jest prawdą
                └── changes/    co jest w ruchu
                      ▲
                      │ rejestrowane na każdej maszynie po nazwie;
                      │ współdzielone przez pushowanie/klonowanie jak każde repozytorium
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (repozytorium kodu)   (repozytorium kodu)    (repozytorium kodu)
```

Dwie zasady sprawiają, że to jest proste:

1. **Magazyn to po prostu repozytorium Git.** Samodzielnie dokonujesz commitów, pushy, pull i recenzji. OpenSpec nigdy nie klonuje, synchronizuje ani nie pushuje niczego samodzielnie.
2. **Deklaracje, a nie maszyneria.** Repozytoria mogą *deklarować*, jak odnoszą się do magazynów (pokazane poniżej). Deklaracje zmieniają to, co OpenSpec może Ci powiedzieć — nigdzie nie zmieniają, gdzie działają Twoje polecenia.

## Pięć minut do Twojego pierwszego magazynu

Dwie komendy prowadzą Cię od zera do działającej zmiany o zasięgu magazynu:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Next: run normal OpenSpec commands against this store, for example:
  openspec new change <change-id> --store team-plans
Share this store by committing and pushing it like any Git repo.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Next: openspec status --change add-login --store team-plans
```

To cały model. Od tego momentu cykl życia jest dokładnie taki, jak znasz — `status`, `instructions`, `validate`, `archive` — z `--store team-plans` w każdym poleceniu, a każda wydrukowana podpowiedź niesie ten flagę za Ciebie. Linia `Using OpenSpec root:` zawsze mówi Ci, gdzie działa polecenie.

## Historia: jeden zespół, jedno repozytorium planowania

Zespół przechowuje swoje specyfikacje i zmiany w `team-plans`, zamiast rozpraszać je po repozytoriach kodu.

**Dzień pierwszy (ktoś, kto to konfiguruje):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Przekazanie `--remote` zapisuje URL klonowania wewnątrz własnego pliku identyfikacyjnego magazynu (`.openspec-store/store.yaml`), w początkowym commicie. Każdy przyszły klon rodzi się, wiedząc, skąd pochodzi, dzięki czemu sprawdzenia stanu i komunikaty o błędach mogą wydrukować kompletną, gotową do wklejenia poprawkę dla członków zespołu, którzy jeszcze go nie mają.

**Każdy członek zespołu (raz na maszynę):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

Od tego momentu wszyscy pracują w tym samym repozytorium planowania po nazwie:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**Udostępnianie pracy to celowe użycie gita.** Zmiana, którą tworzysz, istnieje tylko w Twoim checkoutie, dopóki nie zrobisz commit i push — tak samo jak kod. Plany dostają gałęzie, pull requesty i recenzję za darmo, ponieważ magazyn to zwykłe repozytorium.

**Łączenie repozytoriów kodu zespołu.** Repozytorium kodu, którego planowanie jest w pełni zewnętrzne, potrzebuje dokładnie jednej linii w `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Teraz każde polecenie OpenSpec uruchomione wewnątrz `web-app` działa na `team-plans` bez żadnych flag:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

Wskaźnik to rezerwa, nigdy nadpisanie: jawne `--store` zawsze wygrywa, a jeśli repozytorium wyrosnę własne prawdziwe foldery planowania, one wygrywają (z ostrzeżeniem o usunięciu nieaktualnego wskaźnika).

**Jedna wartość domyślna dla każdego repozytorium na Twojej maszynie.** Jeśli pracujesz w wielu repozytoriach kodu, które planują wszystkie do tego samego magazynu, ustaw to raz, globalnie, zamiast dodawać linię `store:` do każdego repozytorium:

```bash
openspec config set defaultStore team-plans
```

Teraz każde polecenie uruchomione pozy rootem planowania — i bez `--store` oraz bez wskaźnika projektu — rozwiązuje się do `team-plans`. Znajduje się na dole listy pierwszeństwa, więc `--store`, lokalny root i wskaźnik `store:` projektu nadal wygrywają. Baner roota i blok `root` w JSON raportują `source: "global_default"` z id magazynu, dzięki czemu zawsze odróżnisz domyślną wartość dla całej maszyny od własnego wskaźnika repozytorium. Wyczyść to za pomocą `openspec config unset defaultStore`. Jeśli id nie jest zarejestrowane, polecenia zwracają błąd i mówią, aby je zarejestrować lub wyczyścić nieaktualną wartość domyślną.

## Historia: wymagania przekraczające granice zespołów

Zespół platformy jest właścicielem wymagań. Zespoły produktowe budują na ich podstawie, we własnych repozytoriach, z własnymi projektami. Referencja opisuje tę relację bez przenoszenia czyjejkolwiek pracy.

```
   platform-reqs (magazyn)                 api-server (repozytorium kodu)
   własność zespołu platformy              własność zespołu produktowego
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ odczyt   │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (ich własne projekty)  │
   │   praca platformy        │          │ openspec/changes/        │
   │                          │          │   (ich własna praca)     │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**Zespół produktowy deklaruje, na czym się opiera** we własnym repozytorium `openspec/config.yaml`:

```yaml
references:
  - platform-reqs
```

Referencje to kontekst tylko do odczytu. Repozytorium zachowuje własny root `openspec/`; praca tam zostaje. Co się zmienia: `openspec instructions` w tym repozytorium zawiera teraz indeks specyfikacji przywoływanego magazynu — każda z jednoliniowym podsumowaniem i dokładną komendą pobierania (`openspec show <spec-id> --type spec --store platform-reqs`). Agent pracujący w `api-server` może znaleźć wymagania płatności upstream, zacytować je i zapisać swój niskopoziomowy projekt we własnym rootcie repozytorium — bez konieczności wklejania kontekstu przez kogokolwiek.

Referencja może nieść swój źródło klonowania, dzięki czemu członkowie zespołu, którzy nie mają jeszcze magazynu, dostają kompletną poprawkę zamiast ślepego zaułka:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Kiedy chcesz, aby plan i kod były otwarte razem, utwórz zestaw roboczy (workset).** To jest osobiste i jawne: każda osoba wybiera foldery, z którymi faktycznie pracuje na swojej maszynie. Nic o tych lokalnych ścieżkach checkout nie jest commitowane do współdzielonego repozytorium planowania.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Dwa pytania, które zawsze możesz zadać

**"Czy moja konfiguracja jest prawidłowa?"** — `openspec doctor` sprawdza bieżący root i przywoływane magazyny, tylko do odczytu, z gotową do wklejenia poprawką dla każdego znaleziska:

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Referenced store 'design-system' is not registered on this machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"Z czym pracuję?"** — `openspec context` składa zestaw roboczy z deklaracji OpenSpec: root i magazyny, które przywołuje.

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

Oba wspierają `--json` dla agentów. `openspec context --code-workspace <path>` dodatkowo zapisuje plik workspace VS Code zawierający cały zestaw — jedyne zapisywanie, które wykonuje to polecenie.

## Zestawy robocze (worksets): otwórz ponownie foldery, nad którymi pracujesz razem

Oddzielnie od powyższego: większość ludzi otwiera te same kilka folderów razem w każdej sesji — repozytorium planowania plus dwa lub trzy repozytoria kodu. **Zestaw roboczy (workset)** to osobisty, nazwany widok dokładnie tego, otwierany ponownie jedną komendą w wybranym narzędziu.

```
  zestaw roboczy "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       wszystkie trzy otwierają się w Twoim narzędziu
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (otwiera się w VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` uruchamia zapisane narzędzie: edytory (VS Code, Cursor) otwierają jedno okno z każdym członkiem i wracają. Pierwszy członek jest głównym. Nadpisz narzędzie w dowolnym momencie za pomocą `--tool <id>`.

Zestawy robocze są celowo *nie* współdzielonym stanem. Żyją na Twojej maszynie, nigdy nie są commitowane i nie roszczą sobie żadnych praw do pracy — tylko rejestrują, co lubisz mieć otwarte razem. Usunięcie jednego nigdy nie dotyka folderów członków. Nowe narzędzia to konfiguracja, a nie kod: wszystko uruchamiane za pomocą pliku workspace lub flag dołączania na folder można dodać pod kluczem `openers` w konfiguracji globalnej (`openspec config edit`).

## Jak polecenia decydują, gdzie działać

Każde normalne polecenie rozwiązuje swój root w ten sam sposób, w tej kolejności:

```
1. --store <id>          powiedziałeś to wyraźnie        → ten magazyn
2. najbliższe openspec/  prawdziwy root planowania tutaj  → to repozytorium
   (krokowanie w górę od cwd)
3. wskaźnik store:        config.yaml deklaruje magazyn   → ten magazyn
4. defaultStore          konfiguracja globalna ustawia    → ten magazyn
                         domyślną wartość maszyny
5. nic z powyższech      magazyny zarejestrowane na tej    → błąd z
                         maszynie?                          podpowiedzią wyboru
                         brak zarejestrowanych magazynów?   → bieżący
                                                              katalog
                                                              (klasyczne zachowanie)
```

Linia `Using OpenSpec root:` (i blok `root` w wyjściu `--json`) mówi Ci, w jakim przypadku się znajdujesz.

## Znane ograniczenia

- **Kształt beta.** Wszystko na tej stronie może się zmienić między wydaniami — nazwy, flagi, formaty plików, klucze JSON.
- **Jeden checkout na id magazynu na maszynę.** Rejestracja drugiego checkoutu pod tym samym id kończy się błędem z podpowiedzią, aby najpierw wykonać `store unregister`.
- **Brak synchronizacji, nigdy — celowo.** OpenSpec nigdy nie klonuje, nie pulluje ani nie pushuje. Nieaktualny checkout pokazuje nieaktualne specyfikacje, dopóki *Ty* nie zrobisz pull; referencje są indeksowane na żywo z tego, co jest na dysku.
- **Puste foldery planowania mogą być nieobecne.** Nowy magazyn może nie mieć jeszcze `openspec/changes/`, `openspec/specs/` lub `openspec/changes/archive/` w Git. Jest to akceptowane podczas beta; te foldery pojawiają się, gdy normalne polecenia utworzą dla nich pliki.
- **Repozytoria wskaźników pozostają wskaźnikami.** Repozytorium tylko z konfiguracją, którego `openspec/config.yaml` deklaruje `store: <id>`, jest traktowane jako zewnętrzne planowanie, a nie jako checkout magazynu do zarejestrowania. Usuń najpierw linię `store:`, jeśli celowo chcesz przekonwertować to repozytorium na lokalny root magazynu.
- **Niektóre polecenia pozostają tam, gdzie są.** `view`, `templates`, `schemas` i przestarzałe formy rzeczownikowe (`openspec change show`, ...) działają tylko na bieżącym katalogu — bez `--store`.
- **Stan na maszynę jest stanem na maszynę.** Rejestr magazynów i zestawy robocze to ustawienia lokalne. Nic o układzie Twojej maszyny nigdy nie jest commitowane do współdzielonego planowania.
- **Dwa style uruchamiania dla zestawów roboczych.** Narzędzie, którego nie można uruchomić za pomocą pliku workspace lub flag dołączania na folder, nie może być dodane jako opener.
- **Agent JSON ma znany podział wielkości liter** (klucze rodziny magazynów to `snake_case`, rodziny przepływu pracy to `camelCase`). Udokumentowane w [kontrakcie agenta](../agent-contract.md); ujednolicenie tego jest odroczone do wersjiowanego wydania.

## Gdzie przechowywane są dane

| Co | Gdzie | Udostępniane? |
|---|---|---|
| Planowanie sklepu | `<store>/openspec/` (specyfikacje, zmiany) | Tak — commit i push |
| Tożsamość sklepu | `<store>/.openspec-store/store.yaml` | Tak — zatwierdzona razem ze sklepem |
| Rejestr sklepów | `<data dir>/openspec/stores/registry.yaml` | Nie — tylko na tym urządzeniu |
| Zestawy robocze | `<data dir>/openspec/worksets/` | Nie — tylko na tym urządzeniu |

`<data dir>` to `~/.local/share/openspec` w systemach macOS i Linux (lub `$XDG_DATA_HOME/openspec` jeśli jest ustawiona), a `%LOCALAPPDATA%\openspec` w systemie Windows.

## Dokumentacja referencyjna

Dokładne flagi i struktury JSON dla wszystkich poleceń na tej stronie znajdują się w [referencji CLI](../cli.md) (Sklepy, Doctor, Kontekst roboczy, Osobiste zestawy robocze) oraz w [kontrakcie agenta](../agent-contract.md).