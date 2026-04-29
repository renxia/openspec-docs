# Przepływ pracy OPSX

> Opinie mile widziane na [Discord](https://discord.gg/YctCnvvshC).

## Co to jest?

OPSX jest obecnie standardowym przepływem pracy dla OpenSpec.

Jest to **elastyczny, iteracyjny przepływ pracy** dla zmian w OpenSpec. Koniec z sztywnymi fazami — masz do dyspozycji działania, które możesz podjąć w dowolnym momencie.

## Dlaczego to istnieje

Dziedziczny przepływ pracy OpenSpec działa, ale jest **sztywno zamknięty**:

- **Instrukcje są zakodowane na sztywno** — ukryte w TypeScript, nie możesz ich zmienić
- **Wszystko albo nic** — jedno wielkie polecenie tworzy wszystko, nie da się testować poszczególnych elementów
- **Stała struktura** — ten sam przepływ dla wszystkich, brak personalizacji
- **Czarna skrzynka** — gdy wyjście AI jest złe, nie możesz dostroić podpowiedzi

**OPSX otwiera to na nowo.** Teraz każdy może:

1. **Eksperymentować z instrukcjami** — edytować szablon, sprawdzać, czy AI radzi sobie lepiej
2. **Testować szczegółowo** — niezależnie walidować instrukcje dla każdego artefaktu
3. **Personalizować przepływy pracy** — definiować własne artefakty i zależności
4. **Szybko iterować** — zmieniać szablon, natychmiast testować, bez przebudowy

```
Dziedziczny przepływ pracy:           OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Zakodowane na sztywno │           │  schema.yaml           │◄── Ty to edytujesz
│  w pakiecie            │           │  templates/*.md        │◄── Lub to
│  (niezmienne)          │           │        ↓               │
│        ↓               │           │  Natychmiastowy efekt  │
│  Czekaj na nową        │           │        ↓               │
│  wersję                │           │  Przetestuj samodzielnie│
│        ↓               │           └────────────────────────┘
│  Miej nadzieję, że     │
│  będzie lepiej         │
└────────────────────────┘
```

**To jest dla każdego:**
- **Zespoły** — twórzcie przepływy pracy dopasowane do tego, jak naprawdę pracujecie
- **Zaawansowani użytkownicy** — dostrojcie podpowiedzi, aby uzyskać lepsze wyniki AI dla waszego kodu
- **Współtwórcy OpenSpec** — eksperymentujcie z nowymi podejściami bez konieczności wydawania nowych wersji

Wciąż wszyscy uczymy się, co działa najlepiej. OPSX pozwala nam uczyć się razem.

## Doświadczenie użytkownika

**Problem z przepływami pracy w fazach:**
Jesteś „w fazie planowania", potem „w fazie implementacji", potem „zrobione". Ale prawdziwa praca tak nie wygląda. Implementujesz coś, zdajesz sobie sprawę, że twój projekt był zły, musisz zaktualizować specyfikacje, kontynuować implementację. Liniowe fazy walczą z tym, jak praca naprawdę się odbywa.

**Podejście OPSX:**
- **Akcje, nie fazy** — twórz, implementuj, aktualizuj, archiwizuj — rób cokolwiek w dowolnym momencie
- **Zależności to ułatwienia** — pokazują, co jest możliwe, a nie co jest wymagane dalej

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Konfiguracja

```bash
# Upewnij się, że masz zainstalowany openspec — umiejętności są generowane automatycznie
openspec init
```

Tworzy to umiejętności w `.claude/skills/` (lub odpowiedniku), które asystenci kodowania AI wykrywają automatycznie.

Domyślnie OpenSpec używa profilu przepływu pracy `core` (`propose`, `explore`, `apply`, `archive`). Jeśli chcesz rozszerzonych poleceń przepływu pracy (`new`, `continue`, `ff`, `verify`, `sync`, `bulk-archive`, `onboard`), skonfiguruj je za pomocą `openspec config profile` i zastosuj za pomocą `openspec update`.

Podczas konfiguracji zostaniesz poproszony o utworzenie **konfiguracji projektu** (`openspec/config.yaml`). Jest to opcjonalne, ale zalecane.

## Konfiguracja projektu

Konfiguracja projektu pozwala ustawić wartości domyślne i wstrzyknąć kontekst specyficzny dla projektu do wszystkich artefaktów.

### Tworzenie konfiguracji

Konfiguracja jest tworzona podczas `openspec init` lub ręcznie:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Stos technologiczny: TypeScript, React, Node.js
  Konwencje API: RESTful, odpowiedzi JSON
  Testowanie: Vitest do testów jednostkowych, Playwright do testów end-to-end
  Styl: ESLint z Prettier, ścisły TypeScript

rules:
  proposal:
    - Dołącz plan wycofania
    - Zidentyfikuj dotknięte zespoły
  specs:
    - Używaj formatu Given/When/Then dla scenariuszy
  design:
    - Dołącz diagramy sekwencji dla złożonych przepływów
```

### Pola konfiguracji

| Pole | Typ | Opis |
|-------|------|-------------|
| `schema` | string | Domyślna schema dla nowych zmian (np. `spec-driven`) |
| `context` | string | Kontekst projektu wstrzykiwany do instrukcji wszystkich artefaktów |
| `rules` | object | Reguły dla poszczególnych artefaktów, kluczowane przez ID artefaktu |

### Jak to działa

**Priorytet schemy** (od najwyższego do najniższego):
1. Flaga CLI (`--schema <nazwa>`)
2. Metadane zmiany (`.openspec.yaml` w katalogu zmiany)
3. Konfiguracja projektu (`openspec/config.yaml`)
4. Domyślna (`spec-driven`)

**Wstrzykiwanie kontekstu:**
- Kontekst jest dodawany na początku instrukcji każdego artefaktu
- Opakowany w tagi `<context>...</context>`
- Pomaga AI zrozumieć konwencje twojego projektu

**Wstrzykiwanie reguł:**
- Reguły są wstrzykiwane tylko dla pasujących artefaktów
- Opakowane w tagi `<rules>...</rules>`
- Pojawiają się po kontekście, przed szablonem

### ID artefaktów według schemy

**spec-driven** (domyślna):
- `proposal` — Propozycja zmiany
- `specs` — Specyfikacje
- `design` — Projekt techniczny
- `tasks` — Zadania implementacyjne

### Walidacja konfiguracji

- Nieznane ID artefaktów w `rules` generują ostrzeżenia
- Nazwy schem są walidowane wobec dostępnych schem
- Kontekst ma limit rozmiaru 50KB
- Nieprawidłowy YAML jest raportowany z numerami linii

### Rozwiązywanie problemów

**„Nieznane ID artefaktu w rules: X"**
- Sprawdź, czy ID artefaktów pasują do twojej schemy (zobacz listę powyżej)
- Uruchom `openspec schemas --json`, aby zobaczyć ID artefaktów dla każdej schemy

**Konfiguracja nie jest stosowana:**
- Upewnij się, że plik znajduje się w `openspec/config.yaml` (nie `.yml`)
- Sprawdź składnię YAML za pomocą walidatora
- Zmiany konfiguracji są stosowane natychmiast (nie wymagają restartu)

**Kontekst jest za duży:**
- Kontekst jest ograniczony do 50KB
- Podsumuj lub zamieść link do zewnętrznej dokumentacji zamiast tego

## Polecenia

| Polecenie | Co robi |
|---------|--------------|
| `/opsx:propose` | Tworzy zmianę i generuje artefakty planowania w jednym kroku (domyślna szybka ścieżka) |
| `/opsx:explore` | Przetwarza pomysły, bada problemy, wyjaśnia wymagania |
| `/opsx:new` | Rozpoczyna nowy szkielet zmiany (rozszerzony przepływ pracy) |
| `/opsx:continue` | Tworzy następny artefakt (rozszerzony przepływ pracy) |
| `/opsx:ff` | Szybko przesuwa artefakty planowania (rozszerzony przepływ pracy) |
| `/opsx:apply` | Implementuje zadania, aktualizując artefakty w razie potrzeby |
| `/opsx:verify` | Waliduje implementację wobec artefaktów (rozszerzony przepływ pracy) |
| `/opsx:sync` | Synchronizuje specyfikacje delta z głównymi (rozszerzony przepływ pracy, opcjonalne) |
| `/opsx:archive` | Archiwizuje po zakończeniu |
| `/opsx:bulk-archive` | Archiwizuje wiele zakończonych zmian (rozszerzony przepływ pracy) |
| `/opsx:onboard` | Prowadzi przewodnik po końcowej zmianie end-to-end (rozszerzony przepływ pracy) |

## Użycie

### Eksploruj pomysł
```
/opsx:explore
```
Przetwarzaj pomysły, badaj problemy, porównuj opcje. Nie wymaga struktury — po prostu partner do myślenia. Gdy spostrzeżenia się krystalizują, przejdź do `/opsx:propose` (domyślne) lub `/opsx:new`/`/opsx:ff` (rozszerzone).

### Rozpocznij nową zmianę
```
/opsx:propose
```
Tworzy zmianę i generuje artefakty planowania potrzebne przed implementacją.

Jeśli włączyłeś rozszerzone przepływy pracy, możesz zamiast tego użyć:

```text
/opsx:new        # tylko szkielet
/opsx:continue   # tworzy jeden artefakt na raz
/opsx:ff         # tworzy wszystkie artefakty planowania naraz
```

### Twórz artefakty
```
/opsx:continue
```
Pokazuje, co jest gotowe do utworzenia na podstawie zależności, a następnie tworzy jeden artefakt. Używaj wielokrotnie, aby stopniowo budować swoją zmianę.

```
/opsx:ff add-dark-mode
```
Tworzy wszystkie artefakty planowania naraz. Używaj, gdy masz jasny obraz tego, co budujesz.

### Implementuj (ta płynna część)
```
/opsx:apply
```
Przechodzi przez zadania, odhaczając je w miarę postępu. Jeśli zarządzasz wieloma zmianami, możesz uruchomić `/opsx:apply <nazwa>`; w przeciwnym razie powinien wywnioskować z rozmowy i zasugerować wybór, jeśli nie może ustalić.

### Zakończ
```
/opsx:archive   # Przenieś do archiwum po zakończeniu (pyta o synchronizację specyfikacji, jeśli to konieczne)
```

## Kiedy aktualizować, a kiedy zaczynać od nowa

Zawsze możesz edytować swoją propozycję lub specyfikacje przed implementacją. Ale kiedy dopracowywanie staje się „to jest inna praca"?

### Co ujmuje propozycja

Propozycja definiuje trzy rzeczy:
1. **Intencję** — Jaki problem rozwiązujesz?
2. **Zakres** — Co jest w zakresie, a co poza nim?
3. **Podejście** — Jak to rozwiążesz?

Pytanie brzmi: co się zmieniło i o ile?

### Aktualizuj istniejącą zmianę, gdy:

**Ta sama intencja, dopracowana realizacja**
- Odkrywasz przypadki brzegowe, których nie rozważałeś
- Podejście wymaga drobnych korekt, ale cel pozostaje ten sam
- Implementacja ujawnia, że projekt był trochę niedokładny

**Zakres się zawęża**
- Zdajesz sobie sprawę, że pełny zakres jest za duży, chcesz najpierw dostarczyć MVP
- „Dodaj tryb ciemny" → „Dodaj przełącznik trybu ciemnego (preferencja systemowa w v2)"

**Korekty wynikające z nauki**
- Struktura bazy kodu nie jest taka, jak myślałeś
- Zależność nie działa zgodnie z oczekiwaniami
- „Użyj zmiennych CSS" → „Zamiast tego użyj prefiksu dark: w Tailwind"

### Rozpocznij nową zmianę, gdy:

**Intencja fundamentalnie się zmieniła**
- Sam problem jest teraz inny
- „Dodaj tryb ciemny" → „Dodaj kompleksowy system motywów z niestandardowymi kolorami, czcionkami, odstępami"

**Zakres eksplodował**
- Zmiana urosła tak bardzo, że jest zasadniczo inną pracą
- Oryginalna propozycja byłaby nierozpoznawalna po aktualizacjach
- „Napraw błąd logowania" → „Przepisz system uwierzytelniania"

**Oryginalna jest możliwa do zakończenia**
- Oryginalna zmiana może być oznaczona jako „zrobiona"
- Nowa praca jest samodzielna, nie jest dopracowaniem
- Zakończ „Dodaj tryb ciemny MVP" → Archiwizuj → Nowa zmianę „Ulepsz tryb ciemny"

### Heurystyki

```
                        ┌─────────────────────────────────────┐
                        │     Czy to ta sama praca?           │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Ta sama intencja?  >50% nakładania?  Czy oryginalna
             Ten sam problem?   Ten sam zakres?   może być „zrobiona"
                    │                  │          bez tych zmian?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         TAK               NIE TAK           NIE NIE              TAK
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       AKTUALIZUJ       NOWA AKTUALIZUJ   NOWA AKTUALIZUJ      NOWA
```

| Test | Aktualizacja | Nowa zmiana |
|------|--------|------------|
| **Tożsamość** | „Ta sama rzecz, dopracowana" | „Inna praca" |
| **Nakładanie zakresu** | >50% nakładania | <50% nakładania |
| **Zakończenie** | Nie może być „zrobiona" bez zmian | Można zakończyć oryginalną, nowa praca jest samodzielna |
| **Historia** | Łańcuch aktualizacji opowiada spójną historię | Łatki bardziej myliłyby niż wyjaśniały |

### Zasada

> **Aktualizacja zachowuje kontekst. Nowa zmiana zapewnia jasność.**
>
> Wybierz aktualizację, gdy historia twojego myślenia jest cenna.
> Wybierz nową, gdy rozpoczęcie od nowa byłoby jaśniejsze niż łatki.

Pomyśl o tym jak o gałęziach git:
- Kontynuuj commitowanie, gdy pracujesz nad tą samą funkcją
- Rozpocznij nową gałąź, gdy to naprawdę nowa praca
- Czasami scal częściową funkcję i zacznij od nowa dla fazy 2

## Co się zmieniło?

| | Starszy system (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Struktura** | Jeden duży dokument propozycji | Dyskretne artefakty z zależnościami |
| **Przepływ pracy** | Liniowe fazy: planowanie → wdrażanie → archiwizacja | Elastyczne działania — dowolna kolejność |
| **Iteracja** | Trudne cofanie się | Aktualizacja artefaktów w miarę zdobywania wiedzy |
| **Dostosowanie** | Stała struktura | Sterowane schematem (definiuj własne artefakty) |

**Kluczowy wniosek:** praca nie jest liniowa. OPSX przestaje udawać, że tak jest.

## Głębokie zanurzenie w architekturę

Ta sekcja wyjaśnia, jak działa OPSX pod maską i jak wypada w porównaniu z tradycyjnym przepływem pracy.
Przykłady w tej sekcji używają rozszerzonego zestawu poleceń (`new`, `continue` itp.); domyślni użytkownicy `core` mogą odwzorować ten sam przepływ na `propose → apply → archive`.

### Filozofia: Fazy vs Akcje

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TRADYCYJNY PRZEPŁYW PRACY                           │
│                    (Zablokowane Fazy, Wszystko-lub-nic)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   PLANOWANIE │ ───► │ REALIZACJA   │ ───► │  ARCHIWIZACJA│             │
│   │     FAZA     │      │     FAZA     │      │     FAZA     │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Tworzy WSZYSTKIE artefakty naraz                                       │
│   • Nie można wrócić do aktualizacji specyfikacji podczas realizacji       │
│   • Bramy faz wymuszają liniowy postęp                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                         PRZEPŁYW PRACY OPSX                                 │
│                      (Płynne Akcje, Iteracyjny)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           AKCJE (nie fazy)                 │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              w dowolnej kolejności         │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Tworzy artefakty po kolei LUB przyspiesza                               │
│   • Aktualizuje specyfikacje/projekt/zadania podczas realizacji            │
│   • Zależności umożliwiają postęp, fazy nie istnieją                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Architektura Komponentów

**Tradycyjny przepływ pracy** używa sztywno zakodowanych szablonów w TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  KOMPONENTY TRADYCYJNEGO PRZEPŁYWU PRACY                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Sztywno zakodowane szablony (couchi TypeScript)                           │
│                    │                                                        │
│                    ▼                                                        │
│   Konfiguratory/adaptery specyficzne dla narzędzi                           │
│                    │                                                        │
│                    ▼                                                        │
│   Wygenerowane pliki poleceń (.claude/commands/openspec/*.md)               │
│                                                                             │
│   • Stała struktura, brak świadomości artefaktów                            │
│   • Zmiana wymaga modyfikacji kodu + przebudowy                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** używa zewnętrznych schematów i silnika grafu zależności:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KOMPONENTY OPSX                                     │
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
│   │      requires: [proposal]      ◄── Odblokowuje po proposal         │   │
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
│   • Kompatybilne z różnymi edytorami (Claude Code, Cursor, Windsurf)        │
│   • Umiejętności odpytują CLI o ustrukturyzowane dane                      │
│   • W pełni konfigurowalne za pomocą plików schematów                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Model Grafu Zależności

Artefakty tworzą skierowany graf acykliczny (DAG). Zależności są **ułatwieniami**, nie bramami:

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
                                  │
                                  ▼
                          ┌──────────────┐
                          │  FAZA APPLY  │
                          │  (wymaga:    │
                          │   tasks)     │
                          └──────────────┘
```

**Przejścia stanów:**

```
   ZABLOKOWANY ────────────────► GOTOWY ────────────────► ZROBIONY
      │                        │                       │
   Brakujące                 Wszystkie              Plik istnieje
   zależności                zależności             w systemie plików
                             są ZROBIONE
```

### Przepływ Informacji

**Tradycyjny przepływ pracy** — agent otrzymuje statyczne instrukcje:

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
  │  Krok 1: Zapytaj o bieżący stan                                         │
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
  │  Krok 2: Pobierz bogate instrukcje dla gotowego artefaktu                │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec instructions specs --change "add-auth" --json          │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "template": "# Specyfikacja\n\n## DODANE Wymagania...",        │  │
  │  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
  │  │    "unlocks": ["tasks"]                                            │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Krok 3: Odczytaj zależności → Utwórz JEDEN artefakt → Pokaż, co        │
  │          zostało odblokowane                                             │
  └──────────────────────────────────────────────────────────────────────────┘
```

### Model Iteracji

**Tradycyjny przepływ pracy** — trudny do iteracji:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Czekaj, projekt jest zły"
       │               │
       │               ├── Opcje:
       │               │   • Ręczna edycja plików (łamie kontekst)
       │               │   • Porzuć i zacznij od nowa
       │               │   • Przeciskaj się i naprawiaj później
       │               │
       │               └── Brak oficjalnego mechanizmu "cofania"
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
      │                │         /opsx:apply kontynuuje
      │                │         tam, gdzie skończyłeś
      │                │
      │                └── Tworzy JEDEN artefakt, pokazuje, co odblokował
      │
      └── Szkicuje zmianę, czeka na kierunek
```

### Niestandardowe Schematy

Twórz niestandardowe przepływy pracy za pomocą poleceń zarządzania schematami:

```bash
# Utwórz nowy schemat od zera (interaktywnie)
openspec schema init my-workflow

# Lub odgałęź istniejący schemat jako punkt wyjścia
openspec schema fork spec-driven my-workflow

# Waliduj strukturę swojego schematu
openspec schema validate my-workflow

# Sprawdź, skąd rozwiązuje się schemat (przydatne do debugowania)
openspec schema which my-workflow
```

Schematy są przechowywane w `openspec/schemas/` (lokalne dla projektu, kontrolowane wersjami) lub `~/.local/share/openspec/schemas/` (globalne dla użytkownika).

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
  - id: research        # Dodano przed proposal
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

| Aspekt | Tradycyjny | OPSX |
|--------|----------|------|
| **Szablony** | Sztywno zakodowane TypeScript | Zewnętrzne YAML + Markdown |
| **Zależności** | Brak (wszystko naraz) | DAG ze sortowaniem topologicznym |
| **Stan** | Mentalny model oparty na fazach | Istnienie w systemie plików |
| **Dostosowywanie** | Edycja źródła, przebudowa | Utworzenie schema.yaml |
| **Iteracja** | Zablokowane fazy | Płynna, edycja czegokolwiek |
| **Wsparcie edytora** | Konfiguratory/adaptery narzędzia | Pojedynczy katalog umiejętności |

## Schematy

Schematy definiują, jakie artefakty istnieją i jakie są ich zależności. Aktualnie dostępne:

- **spec-driven** (domyślny): propozycja → specyfikacje → projekt → zadania

```bash
# Wyświetl dostępne schematy
openspec schemas

# Zobacz wszystkie schematy ze źródłami rozwiązań
openspec schema which --all

# Utwórz nowy schemat interaktywnie
openspec schema init my-workflow

# Sklonuj istniejący schemat do dostosowania
openspec schema fork spec-driven my-workflow

# Sprawdź strukturę schematu przed użyciem
openspec schema validate my-workflow
```

## Wskazówki

- Użyj `/opsx:explore`, aby przemyśleć pomysł przed wprowadzeniem zmian
- `/opsx:ff`, gdy wiesz, czego chcesz, `/opsx:continue` podczas eksploracji
- Podczas `/opsx:apply`, jeśli coś jest nie tak — napraw artefakt, a następnie kontynuuj
- Zadania śledzą postęp za pomocą pól wyboru w `tasks.md`
- Sprawdź status w dowolnym momencie: `openspec status --change "name"`

## Informacje zwrotne

To jest wersja wstępna. To celowe — uczymy się, co działa.

Znalazłeś błąd? Masz pomysły? Dołącz do nas na [Discord](https://discord.gg/YctCnvvshC) lub otwórz zgłoszenie na [GitHub](https://github.com/Fission-AI/openspec/issues).