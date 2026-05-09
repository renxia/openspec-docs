# Przepływ pracy OPSX

> Opinie mile widziane na [Discordzie](https://discord.gg/YctCnvvshC).

## Czym to jest?

OPSX jest teraz standardowym przepływem pracy dla OpenSpec.

To **płynny, iteracyjny przepływ pracy** dla zmian w OpenSpec. Koniec z sztywnymi fazami — po prostu działania, które możesz podjąć w dowolnym momencie.

## Dlaczego to istnieje

Dziedziczny workflow OpenSpec działa, ale jest **zamknięty**:

- **Instrukcje są zahardkodowane** — ukryte w TypeScript, nie możesz ich zmienić
- **Wszystko albo nic** — jedno duże polecenie tworzy wszystko, nie można testować poszczególnych elementów
- **Stała struktura** — ten sam workflow dla wszystkich, bez możliwości dostosowania
- **Czarna skrzynka** — gdy wynik AI jest zły, nie możesz dostosować promptów

**OPSX otwiera to.** Teraz każdy może:

1. **Eksperymentować z instrukcjami** — edytuj szablon, sprawdź czy AI radzi sobie lepiej
2. **Testować szczegółowo** — waliduj instrukcje każdego artefaktu niezależnie
3. **Dostosowywać workflow** — definiuj własne artefakty i zależności
4. **Iterować szybko** — zmień szablon, przetestuj natychmiast, bez przebudowy

```
Dziedziczny workflow:                 OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Hardcoded in package  │           │  schema.yaml           │◄── You edit this
│  (can't change)        │           │  templates/*.md        │◄── Or this
│        ↓               │           │        ↓               │
│  Wait for new release  │           │  Instant effect        │
│        ↓               │           │        ↓               │
│  Hope it's better      │           │  Test it yourself      │
└────────────────────────┘           └────────────────────────┘
```

**To jest dla wszystkich:**
- **Zespoły** — twórz workflow dopasowane do tego, jak naprawdę pracujesz
- **Zaawansowani użytkownicy** — dostosowuj prompty, aby uzyskać lepsze wyniki AI dla swojego kodu
- **Współtwórcy OpenSpec** — eksperymentuj z nowymi podejściami bez wydań

Wszyscy wciąż się uczymy, co działa najlepiej. OPSX pozwala nam uczyć się razem.

## Doświadczenie użytkownika

**Problem z liniowymi workflow:**
Jesteś „w fazie planowania", potem „w fazie implementacji", potem „gotowe". Ale prawdziwa praca tak nie działa. Implementujesz coś, zdajesz sobie sprawę, że projekt był zły, musisz zaktualizować specyfikacje, kontynuować implementację. Liniowe fazy walczą z tym, jak praca naprawdę przebiega.

**Podejście OPSX:**
- **Akcje, nie fazy** — twórz, implementuj, aktualizuj, archiwizuj — wykonuj dowolną z nich w dowolnym momencie
- **Zależności umożliwiają** — pokazują, co jest możliwe, nie co jest wymagane jako następne

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Konfiguracja

```bash
# Make sure you have openspec installed — skills are automatically generated
openspec init
```

To tworzy umiejętności w `.claude/skills/` (lub odpowiedniku), które asystenci kodowania AI automatycznie wykrywają.

Domyślnie OpenSpec używa profilu workflow `core` (`propose`, `explore`, `apply`, `sync`, `archive`). Jeśli chcesz rozszerzonych poleceń workflow (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`), skonfiguruj je za pomocą `openspec config profile` i zastosuj za pomocą `openspec update`.

Podczas konfiguracji zostaniesz poproszony o utworzenie **konfiguracji projektu** (`openspec/config.yaml`). Jest to opcjonalne, ale zalecane.

## Konfiguracja projektu

Konfiguracja projektu pozwala ustawić wartości domyślne i wstrzykiwać kontekst specyficzny dla projektu do wszystkich artefaktów.

### Tworzenie konfiguracji

Konfiguracja jest tworzona podczas `openspec init` lub ręcznie:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  API conventions: RESTful, JSON responses
  Testing: Vitest for unit tests, Playwright for e2e
  Style: ESLint with Prettier, strict TypeScript

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format for scenarios
  design:
    - Include sequence diagrams for complex flows
```

### Pola konfiguracji

| Pole | Typ | Opis |
|------|-----|------|
| `schema` | string | Domyślne schema dla nowych zmian (np. `spec-driven`) |
| `context` | string | Kontekst projektu wstrzykiwany do instrukcji wszystkich artefaktów |
| `rules` | object | Reguły per-artefakt, kluczowane wg ID artefaktu |

### Jak to działa

**Priorytet schemy** (od najwyższego do najniższego):
1. Flaga CLI (`--schema <name>`)
2. Metadane zmiany (`.openspec.yaml` w katalogu zmiany)
3. Konfiguracja projektu (`openspec/config.yaml`)
4. Domyślne (`spec-driven`)

**Wstrzykiwanie kontekstu:**
- Kontekst jest dodawany na początku instrukcji każdego artefaktu
- Otwarty w tagach `<context>...</context>`
- Pomaga AI zrozumieć konwencje Twojego projektu

**Wstrzykiwanie reguł:**
- Reguły są wstrzykiwane tylko dla pasujących artefaktów
- Otwarte w tagach `<rules>...</rules>`
- Pojawiają się po kontekście, przed szablonem

### ID artefaktów wg schemy

**spec-driven** (domyślne):
- `proposal` — Propozycja zmiany
- `specs` — Specyfikacje
- `design` — Projekt techniczny
- `tasks` — Zadania implementacyjne

### Walidacja konfiguracji

- Nieznane ID artefaktów w `rules` generują ostrzeżenia
- Nazwy schem są walidowane względem dostępnych schem
- Kontekst ma limit rozmiaru 50KB
- Nieprawidłowy YAML jest raportowany z numerami linii

### Rozwiązywanie problemów

**„Unknown artifact ID in rules: X"**
- Sprawdź, czy ID artefaktów pasują do Twojej schemy (patrz lista powyżej)
- Uruchom `openspec schemas --json`, aby zobaczyć ID artefaktów dla każdej schemy

**Konfiguracja nie jest stosowana:**
- Upewnij się, że plik jest w `openspec/config.yaml` (nie `.yml`)
- Sprawdź składnię YAML za pomocą walidatora
- Zmiany konfiguracji obowiązują natychmiast (nie wymagają restartu)

**Kontekst za duży:**
- Kontekst jest ograniczony do 50KB
- Podsumuj lub odwołaj się do zewnętrznej dokumentacji

## Polecenia

| Polecenie | Co robi |
|-----------|---------|
| `/opsx:propose` | Tworzy zmianę i generuje artefakty planowania w jednym kroku (domyślna szybka ścieżka) |
| `/opsx:explore` | Przemyśl pomysły, zbadaj problemy, wyjaśnij wymagania |
| `/opsx:new` | Rozpocznij nowe rusztowanie zmiany (rozszerzony workflow) |
| `/opsx:continue` | Utwórz następny artefakt (rozszerzony workflow) |
| `/opsx:ff` | Przewiń do przodu artefakty planowania (rozszerzony workflow) |
| `/opsx:apply` | Implementuj zadania, aktualizując artefakty w razie potrzeby |
| `/opsx:verify` | Waliduj implementację względem artefaktów (rozszerzony workflow) |
| `/opsx:sync` | Synchronizuj specyfikacje delta do głównej (domyślny workflow, opcjonalny) |
| `/opsx:archive` | Archiwizuj po zakończeniu |
| `/opsx:bulk-archive` | Archiwizuj wiele ukończonych zmian (rozszerzony workflow) |
| `/opsx:onboard` | Prowadzony przegląd zmiany end-to-end (rozszerzony workflow) |

## Użycie

### Eksploruj pomysł
```
/opsx:explore
```
Przemyśl pomysły, zbadaj problemy, porównaj opcje. Nie wymaga struktury — po prostu partner do myślenia. Gdy spostrzeżenia się skrystalizują, przejdź do `/opsx:propose` (domyślny) lub `/opsx:new`/`/opsx:ff` (rozszerzony).

### Rozpocznij nową zmianę
```
/opsx:propose
```
Tworzy zmianę i generuje potrzebne artefakty planowania przed implementacją.

Jeśli włączyłeś rozszerzone workflow, możesz zamiast tego użyć:

```text
/opsx:new        # scaffold only
/opsx:continue   # create one artifact at a time
/opsx:ff         # create all planning artifacts at once
```

### Twórz artefakty
```
/opsx:continue
```
Pokazuje, co jest gotowe do utworzenia na podstawie zależności, a następnie tworzy jeden artefakt. Używaj wielokrotnie, aby budować zmianę przyrostowo.

```
/opsx:ff add-dark-mode
```
Tworzy wszystkie artefakty planowania naraz. Użyj, gdy masz jasny obraz tego, co budujesz.

### Implementuj (płynna część)
```
/opsx:apply
```
Przechodzi przez zadania, odhaczając je po kolei. Jeśli zarządzasz wieloma zmianami, możesz uruchomić `/opsx:apply <name>`; w przeciwnym razie powinien wywnioskować z rozmowy i poprosić o wybór, jeśli nie może określić.

### Zakończ
```
/opsx:archive   # Move to archive when done (prompts to sync specs if needed)
```

## Kiedy aktualizować vs. zaczynać od nowa

Zawsze możesz edytować swoją propozycję lub specyfikacje przed implementacją. Ale kiedy udoskonalanie staje się „to jest inna praca"?

### Co ujmuje propozycja

Propozycja definiuje trzy rzeczy:
1. **Intencja** — Jaki problem rozwiązujesz?
2. **Zakres** — Co jest w/zakresu?
3. **Podejście** — Jak to rozwiążesz?

Pytanie brzmi: co się zmieniło i o ile?

### Aktualizuj istniejącą zmianę, gdy:

**Ta sama intencja, udoskonalone wykonanie**
- Odkrywasz przypadki brzegowe, których nie rozważałeś
- Podejście wymaga dostosowania, ale cel się nie zmienia
- Implementacja ujawnia, że projekt był lekko nietrafiony

**Zakres się zawęża**
- Zdajesz sobie sprawę, że pełny zakres jest za duży, chcesz najpierw wydać MVP
- „Dodaj tryb ciemny" → „Dodaj przełącznik trybu ciemnego (preferencje systemowe w v2)"

**Korekty oparte na nauce**
- Baza kodu nie jest strukturalizowana tak, jak myślałeś
- Zależność nie działa zgodnie z oczekiwaniami
- „Użyj zmiennych CSS" → „Użyj zamiast tego prefiksu Tailwind dark:"

### Rozpocznij nową zmianę, gdy:

**Intencja fundamentalnie się zmieniła**
- Sam problem jest teraz inny
- „Dodaj tryb ciemny" → „Dodaj kompleksowy system motywów z niestandardowymi kolorami, czcionkami, odstępami"

**Zakres eksplodował**
- Zmiana urosła tak bardzo, że jest zasadniczo inną pracą
- Oryginalna propozycja byłaby nie do rozpoznania po aktualizacjach
- „Napraw błąd logowania" → „Przepisz system uwierzytelniania"

**Oryginał jest do ukończenia**
- Oryginalna zmiana może zostać oznaczona jako „gotowa"
- Nowa praca jest samodzielna, nie udoskonaleniem
- Ukończ „Dodaj tryb ciemny MVP" → Archiwizuj → Nowa zmiana „Ulepsz tryb ciemny"

### Heurystyki

```
                        ┌─────────────────────────────────────┐
                        │     Is this the same work?          │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Same intent?      >50% overlap?      Can original
             Same problem?     Same scope?        be "done" without
                    │                  │          these changes?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         YES               NO YES           NO  NO              YES
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       UPDATE            NEW  UPDATE       NEW  UPDATE          NEW
```

| Test | Aktualizacja | Nowa zmiana |
|------|-------------|-------------|
| **Tożsamość** | „Ta sama rzecz, udoskonalona" | „Inna praca" |
| **Nakładanie zakresu** | >50% się pokrywa | <50% się pokrywa |
| **Ukończenie** | Nie może być „gotowe" bez zmian | Może ukończyć oryginał, nowa praca jest samodzielna |
| **Historia** | Łańcuch aktualizacji opowiada spójną historię | Łatki bardziej by myliły niż wyjaśniały |

### Zasada

> **Aktualizacja zachowuje kontekst. Nowa zmiana zapewnia przejrzystość.**
>
> Wybierz aktualizację, gdy historia Twojego myślenia jest wartościowa.
>
> Wybierz nową, gdy rozpoczęcie od nowa byłoby jaśniejsze niż łatanie.

Myśl o tym jak o gałęziach git:
- Kontynuuj commitowanie, pracując nad tą samą funkcją
- Rozpocznij nową gałąź, gdy to naprawdę nowa praca
- Czasami sczesczczęściowo funkcję i rozpocznij od nowa dla fazy 2

## Czym się różni?

| | Legacy (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Struktura** | Jeden duży dokument propozycji | Dyskretne artefakty z zależnościami |
| **Przepływ pracy** | Liniowe fazy: plan → implementacja → archiwizacja | Płynne działania — rób cokolwiek w dowolnym momencie |
| **Iteracja** | Niewygodne cofanie się | Aktualizuj artefakty w miarę zdobywania wiedzy |
| **Dostosowanie** | Stała struktura | Sterowana schematem (definiuj własne artefakty) |

**Kluczowy wniosek:** praca nie jest liniowa. OPSX przestaje udawać, że jest inaczej.

## Zagłębienie w architekturę

Ta sekcja wyjaśnia, jak OPSX działa od kuchni i jak porównuje się do starszego przepływu pracy.
Przykłady w tej sekcji używają rozszerzonego zestawu komend (`new`, `continue` itp.); domyślni użytkownicy `core` mogą odwzorować ten sam przepływ na `propose → apply → sync → archive`.

### Filozofia: Fazy vs Akcje

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PRZEPŁYW PRACY STAREGO TYPU                               │
│                  (Zablokowany fazowo, Wszystko-albo-nic)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   FAZA       │ ───► │   FAZA       │ ───► │   FAZA       │             │
│   │ PLANOWANIA   │      │IMPLEMENTACJI │      │  ARCHIWIZACJI│             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Tworzy WSZYSTKIE artefakty naraz                                       │
│   • Nie można wrócić do aktualizacji specyfikacji podczas implementacji    │
│   • Bramki faz wymuszają liniowy postęp                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                         PRZEPŁYW PRACY OPSX                                 │
│                      (Płynne akcje, Iteracyjny)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           AKCJE (nie fazy)                 │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              dowolna kolejność             │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Tworzenie artefaktów po jednym LUB szybkie przeskakiwanie              │
│   • Aktualizacja specyfikacji/projektu/zadań podczas implementacji         │
│   • Zależności umożliwiają postęp, fazy nie istnieją                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Architektura komponentów

**Przepływ pracy starego typu** używa zakodowanych na stałe szablonów w TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 KOMPONENTY PRZEPŁYWU PRACY STAREGO TYPU                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Szablony zakodowane na stałe (ciągi znaków TypeScript)                   │
│                    │                                                        │
│                    ▼                                                        │
│   Konfiguratory/adaptery specyficzne dla narzędzia                         │
│                    │                                                        │
│                    ▼                                                        │
│   Wygenerowane pliki poleceń (.claude/commands/openspec/*.md)              │
│                                                                             │
│   • Sztywna struktura, brak świadomości artefaktów                         │
│   • Zmiana wymaga modyfikacji kodu + przebudowy                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** używa zewnętrznych schematów i silnika grafu zależności:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KOMPONENTY OPSX                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Definicje schematów (YAML)                                                │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Zależności                       │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Wzorce glob                      │   │
│   │      requires: [proposal]      ◄── Umożliwia po proposal            │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Silnik grafu artefaktów                                                   │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Sortowanie topologiczne (kolejność zależności)                   │   │
│   │  • Wykrywanie stanu (istnienie w systemie plików)                   │   │
│   │  • Generowanie bogatych instrukcji (szablony + kontekst)            │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Pliki umiejętności (.claude/skills/openspec-*/SKILL.md)                   │
│                                                                             │
│   • Kompatybilne między edytorami (Claude Code, Cursor, Windsurf)          │
│   • Umiejętności odpytują CLI o dane strukturalne                          │
│   • W pełni konfigurowalne przez pliki schematów                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Model grafu zależności

Artefakty tworzą skierowany graf acykliczny (DAG). Zależności są **umożliwiaczami**, nie bramkami:

```
                              proposal
                             (węzeł główny)
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
                 specs                       design
              (requires:                  (requires:
               proposal)                   proposal)
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                               tasks
                           (requires:
                           specs, design)
                                  │
                                  ▼
                          ┌──────────────┐
                          │ FAZA APPLY   │
                          │ (requires:   │
                          │  tasks)      │
                          └──────────────┘
```

**Przejścia stanów:**

```
   BLOCKED ────────────────► READY ────────────────► DONE
      │                        │                       │
   Brakujące               Wszystkie zależności    Plik istnieje
   zależności               mają status DONE        w systemie plików
```

### Przepływ informacji

**Przepływ pracy starego typu** — agent otrzymuje statyczne instrukcje:

```
  Użytkownik: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Statyczne instrukcje:                  │
  │  • Utwórz proposal.md                   │
  │  • Utwórz tasks.md                      │
  │  • Utwórz design.md                     │
  │  • Utwórz specs/<capability>/spec.md    │
  │                                         │
  │  Brak świadomości, co istnieje lub      │
  │  zależności między artefaktami          │
  └─────────────────────────────────────────┘
           │
           ▼
  Agent tworzy WSZYSTKIE artefakty za jednym razem
```

**OPSX** — agent odpytuje o bogaty kontekst:

```
  Użytkownik: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Krok 1: Odpytanie o bieżący stan                                        │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec status --change "add-auth" --json                      │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "artifacts": [                                                  │  │
  │  │      {"id": "proposal", "status": "done"},                         │  │
  │  │      {"id": "specs", "status": "ready"},      ◄── Pierwszy gotowy  │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked", "missingDeps": ["specs"]}│  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Krok 2: Pobranie bogatych instrukcji dla gotowego artefaktu             │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  $ openspec instructions specs --change "add-auth" --json          │  │
│  │                                                                    │  │
│  │  {                                                                 │  │
│  │    "template": "# Specification\n\n## ADDED Requirements...",      │  │
│  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
│  │    "unlocks": ["tasks"]                                            │  │
│  │  }                                                                 │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Krok 3: Odczytanie zależności → Utworzenie JEDNEGO artefaktu → Pokazanie, co zostaje odblokowane  │
└──────────────────────────────────────────────────────────────────────────┘
```

### Model iteracji

**Przepływ pracy starego typu** — niezręczne iterowanie:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Czekaj, projekt jest zły"
       │               │
       │               ├── Opcje:
       │               │   • Ręczna edycja plików (łamie kontekst)
       │               │   • Porzucenie i zaczynanie od nowa
       │               │   • Przepchnięcie i naprawa później
       │               │
       │               └── Brak oficjalnego mechanizmu "cofnij się"
       │
       └── Tworzy WSZYSTKIE artefakty naraz
```

**OPSX** — naturalna iteracja:

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── "Projekt jest zły"
      │                │                  │
      │                │                  ▼
      │                │            Po prostu edytuj design.md
      │                │            i kontynuuj!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply wznawia
      │                │         od miejsca przerwania
      │                │
      │                └── Tworzy JEDEN artefakt, pokazuje, co zostaje odblokowane
      │
      └── Tworzy rusztowanie zmiany, czeka na kierunek
```

### Niestandardowe schematy

Tworzenie niestandardowych przepływów pracy za pomocą poleceń zarządzania schematami:

```bash
# Utwórz nowy schemat od zera (interaktywnie)
openspec schema init my-workflow

# Lub rozwidl istniejący schemat jako punkt wyjścia
openspec schema fork spec-driven my-workflow

# Waliduj strukturę schematu
openspec schema validate my-workflow

# Zobacz, skąd rozwiązuje się schemat (przydatne do debugowania)
openspec schema which my-workflow
```

Schematy są przechowywane w `openspec/schemas/` (lokalne dla projektu, wersjonowane) lub `~/.local/share/openspec/schemas/` (globalne użytkownika).

**Struktura schematu:**
```
openspec/schemas/research-first/
├── schema.yaml
└── templates/
    ├── research.md
    ├── proposal.md
    └── tasks.md
```

**Przykładowy schema.yaml:**
```yaml
name: research-first
artifacts:
  - id: research        # Dodane przed proposal
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Teraz zależy od research

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**Graf zależności:**
```
   research ──► proposal ──► tasks
```

### Podsumowanie

| Aspekt | Stary typ | OPSX |
|--------|----------|------|
| **Szablony** | Zakodowane na stałe w TypeScript | Zewnętrzne YAML + Markdown |
| **Zależności** | Brak (wszystko naraz) | DAG z sortowaniem topologicznym |
| **Stan** | Model mentalny oparty na fazach | Istnienie w systemie plików |
| **Dostosowanie** | Edycja kodu źródłowego, przebudowa | Utworzenie schema.yaml |
| **Iteracja** | Zablokowana fazowo | Płynna, edycja czegokolwiek |
| **Wsparcie edytorów** | Konfiguratory/adaptery specyficzne dla narzędzia | Pojedynczy katalog umiejętności |

## Schematy

Schematy definiują, jakie artefakty istnieją i jakie są między nimi zależności. Obecnie dostępne:

- **spec-driven** (domyślny): proposal → specs → design → tasks

```bash
# List available schemas
openspec schemas

# See all schemas with their resolution sources
openspec schema which --all

# Create a new schema interactively
openspec schema init my-workflow

# Fork an existing schema for customization
openspec schema fork spec-driven my-workflow

# Validate schema structure before use
openspec schema validate my-workflow
```

## Wskazówki

- Użyj `/opsx:explore`, aby przemyśleć pomysł przed wprowadzeniem zmian
- `/opsx:ff`, gdy wiesz, czego chcesz, `/opsx:continue`, gdy eksplorujesz
- Podczas `/opsx:apply`, jeśli coś jest nie tak — napraw artefakt, a potem kontynuuj
- Zadania śledzą postęp za pomocą pól wyboru w pliku `tasks.md`
- Sprawdź status w dowolnym momencie: `openspec status --change "name"`

## Opinie

To jest wersja wstępna. To celowe — uczymy się, co działa.

Znalazłeś błąd? Masz pomysły? Dołącz do nas na [Discord](https://discord.gg/YctCnvvshC) lub otwórz zgłoszenie na [GitHub](https://github.com/Fission-AI/openspec/issues).