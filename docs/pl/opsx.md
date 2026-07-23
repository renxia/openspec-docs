# Przepływ pracy OPSX

> Opinie mile widziane na [Discord](https://discord.gg/YctCnvvshC).

## Co to jest?

OPSX jest teraz standardowym przepływem pracy dla OpenSpec.

Jest to **płynny, iteracyjny przepływ pracy** dla zmian w OpenSpec. Koniec z sztywnymi fazami — tylko akcje, które możesz podjąć w dowolnym momencie.

## Dlaczego to istnieje

Starszy workflow OpenSpec działa, ale jest **zablokowany**:

- **Instrukcje są na stałe wpisane w kod** — ukryte w TypeScript, nie można ich zmienić
- **Wszystko albo nic** — jedna duża komenda tworzy wszystko, nie można testować poszczególnych elementów
- **Stała struktura** — ten sam workflow dla wszystkich, bez możliwości dostosowania
- **Czarna skrzynka** — gdy wynik działania AI jest zły, nie można dostosować promptów

**OPSX otwiera to na nowo.** Teraz każdy może:

1. **Eksperymentować z instrukcjami** — edytować szablon, sprawdzić czy AI działa lepiej
2. **Testować szczegółowo** — weryfikować instrukcje każdego artefaktu niezależnie
3. **Dostosowywać workflow** — definiować własne artefakty i zależności
4. **Iterować szybko** — zmienić szablon, przetestować od razu, bez ponownej budowy

```
Starszy proces pracy:                      OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Wpisane na stałe w    │           │  schema.yaml           │◄── Ty edytujesz to
│  pakiecie              │           │  templates/*.md        │◄── Lub to
│  (nie można zmienić)   │           │        ↓               │
│        ↓               │           │  Natychmiastowy efekt  │
│  Czekaj na nową wersję │           │        ↓               │
│        ↓               │           │  Przetestuj sam        │
│  Miej nadzieję, że     │           └────────────────────────┘
│  będzie lepsza         │
└────────────────────────┘
```

**To jest dla każdego:**
- **Zespoły** — tworzą workflow dopasowane do tego, jak rzeczywiście pracujecie
- **Zaawansowani użytkownicy** — dostosowują prompty, aby uzyskać lepsze wyniki AI dla swojej bazy kodu
- **Współtwórcy OpenSpec** — eksperymentują z nowymi podejściami bez konieczności wydawania nowych wersji

Wszyscy nadal uczymy się, co działa najlepiej. OPSX pozwala nam uczyć się wspólnie.

## Doświadczenie użytkownika

**Problem z liniowymi procesami pracy:**
Jesteś "w fazie planowania", potem "w fazie implementacji", potem "gotowe". Ale prawdziwa praca nie działa w ten sposób. Implementujesz coś, zdajesz sobie sprawę, że projekt był błędny, musisz zaktualizować specyfikacje, kontynuować implementację. Liniowe fazy stoją w sprzeczności z tym, jak praca faktycznie wygląda.

**Podejście OPSX:**
- **Działania, a nie fazy** — tworz, implementuj, aktualizuj, archiwizuj — wykonuj je w dowolnym momencie
- **Zależności są możliwościami** — pokazują co jest możliwe, a nie co jest wymagane jako następne

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Konfiguracja

```bash
# Upewnij się, że masz zainstalowanego openspec — umiejętności są generowane automatycznie
openspec init
```

Tworzy umiejętności w `.claude/skills/` (lub odpowiednim miejscu), które asystenci kodowania AI wykrywają automatycznie.

Domyślnie OpenSpec używa profilu workflow `core` (`propose`, `explore`, `apply`, `sync`, `archive`). Jeśli chcesz używać rozszerzonych poleceń workflow (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`), skonfiguruj je za pomocą `openspec config profile` i zastosuj za pomocą `openspec update`.

Podczas konfiguracji zostaniesz poproszony o utworzenie **konfiguracji projektu** (`openspec/config.yaml`). Jest to opcjonalne, ale zalecane.

## Konfiguracja projektu

Konfiguracja projektu pozwala ustawić wartości domyślne i wstrzyknąć kontekst specyficzny dla projektu do wszystkich artefaktów.

### Tworzenie konfiguracji

Konfiguracja jest tworzona podczas `openspec init`, lub ręcznie:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Stos technologiczny: TypeScript, React, Node.js
  Konwencje API: RESTful, odpowiedzi JSON
  Testowanie: Vitest do testów jednostkowych, Playwright do testów e2e
  Styl: ESLint z Prettier, ścisły TypeScript

rules:
  proposal:
    - Uwzględnij plan cofania zmian
    - Zidentyfikuj dotknięte zespoły
  specs:
    - Używaj formatu Given/When/Then dla scenariuszy
  design:
    - Uwzględnij diagramy sekwencji dla złożonych przepływów
```

### Pola konfiguracji

| Pole | Typ | Opis |
|------|-----|------|
| `schema` | string | Domyślny schemat dla nowych zmian (np. `spec-driven`) |
| `context` | string | Kontekst projektu wstrzykiwany do instrukcji wszystkich artefaktów |
| `rules` | object | Reguły dla poszczególnych artefaktów, kluczowane według identyfikatora artefaktu |

### Jak to działa

**Priorytet schematów** (od najwyższego do najniższego):
1. Flaga CLI (`--schema <name>`)
2. Metadane zmiany (`.openspec.yaml` w katalogu zmiany)
3. Konfiguracja projektu (`openspec/config.yaml`)
4. Domyślny (`spec-driven`)

**Wstrzykiwanie kontekstu:**
- Kontekst jest dołączany na początku instrukcji każdego artefaktu
- Otoczony tagami `<context>...</context>`
- Pomaga AI zrozumieć konwencje Twojego projektu

**Wstrzykiwanie reguł:**
- Reguły są wstrzykiwane tylko dla pasujących artefaktów
- Otoczone tagami `<rules>...</rules>`
- Pojawiają się po kontekście, przed szablonem

### Identyfikatory artefaktów według schematu

**spec-driven** (domyślny):
- `proposal` — Propozycja zmiany
- `specs` — Specyfikacje
- `design` — Projekt techniczny
- `tasks` — Zadania implementacji

### Walidacja konfiguracji

- Nieznane identyfikatory artefaktów w `rules` generują ostrzeżenia
- Nazwy schematów są walidowane względem dostępnych schematów
- Kontekst ma limit rozmiaru 50 KB
- Nieprawidłowy YAML jest raportowany z numerami linii

### Rozwiązywanie problemów

**"Nieznany identyfikator artefaktu w regułach: X"**
- Sprawdź, czy identyfikatory artefaktów pasują do Twojego schematu (zobacz listę powyżej)
- Uruchom `openspec schemas --json`, aby zobaczyć identyfikatory artefaktów dla każdego schematu

**Konfiguracja nie jest stosowana:**
- Upewnij się, że plik znajduje się w `openspec/config.yaml` (a nie `.yml`)
- Sprawdź składnię YAML za pomocą walidatora
- Zmiany w konfiguracji są stosowane natychmiast (nie wymagana restartu)

**Zbyt duży kontekst:**
- Kontekst jest ograniczony do 50 KB
- Zamiast tego podsumuj treść lub dodaj link do zewnętrznej dokumentacji

## Polecenia

| Polecenie | Co robi |
|-----------|---------|
| `/opsx:propose` | Tworzy zmianę i generuje artefakty planowania w jednym kroku (domyślna ścieżka szybka) |
| `/opsx:explore` | Przemyśla pomysły, bada problemy, wyjaśnia wymagania |
| `/opsx:new` | Rozpoczyna szkielet nowej zmiany (rozszerzony workflow) |
| `/opsx:continue` | Tworzy następny artefakt (rozszerzony workflow) |
| `/opsx:ff` | Przyspiesza tworzenie artefaktów planowania (rozszerzony workflow) |
| `/opsx:apply` | Implementuje zadania, aktualizując artefakty w razie potrzeby |
| `/opsx:update` | Poprawia artefakty planowania zmiany i utrzymuje ich spójność |
| `/opsx:verify` | Waliduje implementację względem artefaktów (rozszerzony workflow) |
| `/opsx:sync` | Synchronizuje delta specyfikacje z gałęzią główną (domyślny workflow, opcjonalne) |
| `/opsx:archive` | Archiwizuje po zakończeniu |
| `/opsx:bulk-archive` | Archiwizuje wiele zakończonych zmian (rozszerzony workflow) |
| `/opsx:onboard` | Przewodnik krok po kroku przez zmianę od początku do końca (rozszerzony workflow) |

## Użycie

### Przeglądaj pomysł
```
/opsx:explore
```
Przemyśl pomysły, badaj problemy, porównuj opcje. Nie wymagana żadna struktura — wystarczy partner do myślenia. Gdy spostrzeżenia się wyklarują, przejdź do `/opsx:propose` (domyślne) lub `/opsx:new`/`/opsx:ff` (rozszerzone).

### Rozpocznij nową zmianę
```
/opsx:propose
```
Tworzy zmianę i generuje artefakty planowania potrzebne przed implementacją.

Jeśli włączyłeś rozszerzone workflow, możesz zamiast tego użyć:

```text
/opsx:new        # tylko szkielet
/opsx:continue   # twórz jeden artefakt na raz
/opsx:ff         # twórz wszystkie artefakty planowania od razu
```

### Twórz artefakty
```
/opsx:continue
```
Pokazuje co jest gotowe do utworzenia na podstawie zależności, następnie tworzy jeden artefakt. Używaj wielokrotnie, aby stopniowo budować swoją zmianę.

```
/opsx:ff add-dark-mode
```
Tworzy wszystkie artefakty planowania od razu. Używaj, gdy masz jasny obraz tego, co budujesz.

### Implementuj (płynna część)
```
/opsx:apply
```
Przechodzi przez zadania, oznaczając je jako wykonane w miarę postępu. Jeśli obsługujesz wiele zmian jednocześnie, możesz uruchomić `/opsx:apply <name>`; w przeciwnym razie powinien wywnioskować ją z rozmowy i poprosić o wybór, jeśli nie może jej określić.

### Aktualizowanie zmiany
```
/opsx:update add-dark-mode - we're storing the theme in a cookie now
```
Poprawia istniejące artefakty planowania zmiany i utrzymuje ich spójność — w dowolnym kierunku (edycja projektu może oddziaływać wstecz na propozycję). Dotyczy tylko artefaktów planowania: nigdy nie edytuje kodu i nigdy nie tworzy brakujących artefaktów (do tego służy `/opsx:continue`). Każda edycja jest najpierw potwierdzana z Tobą. Jeśli zmiana została już zaimplementowana, poleca `/opsx:apply`, aby kod dogonił zaktualizowany plan. Jeśli Twoja poprawa zmienia *intencję* zmiany, zacznij od nowa — zobacz [Kiedy aktualizować, a kiedy zacząć od nowa](#when-to-update-vs-start-fresh).

### Zakończ
```
/opsx:archive   # Przenieś do archiwum po zakończeniu (pyta o synchronizację specyfikacji w razie potrzeby)
```

## Kiedy aktualizować, a kiedy zacząć od nowa

Zawsze możesz edytować swoją propozycję lub specyfikacje przed implementacją. Ale kiedy poprawa staje się "to jest inna praca"?

### Co uchwyca propozycja

Propozycja definiuje trzy rzeczy:
1. **Intencja** — jaki problem rozwiązujesz?
2. **Zakres** — co jest włączone, a co wyłączone?
3. **Podejście** — jak go rozwiążesz?

Pytanie brzmi: co się zmieniło i o ile?

### Aktualizuj istniejącą zmianę, gdy:

**Ta sama intencja, dopracowana realizacja**
- Odkrywasz przypadki brzegowe, które nie wziąłeś pod uwagę
- Podejście wymaga drobnych poprawek, ale cel jest niezmieniony
- Implementacja ujawnia, że projekt był nieco błędny

**Zakres się zawęża**
- Zauważasz, że pełny zakres jest za duży, chcesz najpierw wypuścić wersję MVP
- "Dodaj tryb ciemny" → "Dodaj przełącznik trybu ciemnego (preferencje systemowe w wersji 2)"

**Korekty wynikające z nowej wiedzy**
- Baza kodu nie jest zorganizowana tak, jak myślałeś
- Zależność nie działa zgodnie z oczekiwaniami
- "Używaj zmiennych CSS" → "Zamiast tego używaj przedrostka `dark:` z Tailwind"

### Zacznij nową zmianę, gdy:

**Intencja fundamentalnie się zmieniła**
- Sam problem jest teraz inny
- "Dodaj tryb ciemny" → "Dodaj kompleksowy system motywów z niestandardowymi kolorami, czcionkami, odstępami"

**Zakres znacznie się powiększył**
- Zmiana urosła tak bardzo, że jest to w zasadzie inna praca
- Oryginalna propozycja byłaby nie do rozpoznania po poprawkach
- "Napraw błąd logowania" → "Przepisz system autoryzacji"

**Oryginał można ukończyć**
- Oryginalną zmianę można oznaczyć jako „ukończoną”
- Nowa praca jest samodzielna, a nie dopracowaniem
- Ukończ „Dodaj tryb ciemny MVP” → Archiwizuj → Nowa zmiana „Ulepsz tryb ciemny”

### Heurystyki

```
                        ┌─────────────────────────────────────┐
                        │     Czy to jest ta sama praca?       │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Ta sama intencja?      >50% nakładania?    Czy oryginał
             Ten sam problem?      Ten sam zakres?     może być „ukończony”
                    │                  │          bez tych zmian?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         TAK               NIE TAK          NIE  NIE            TAK
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       AKTUALIZUJ        NOWA AKTUALIZUJ   NOWA AKTUALIZUJ      NOWA
```

| Test | Aktualizacja | Nowa zmiana |
|------|--------------|-------------|
| **Tożsamość** | "Ta sama rzecz, dopracowana" | "Inna praca" |
| **Nakładanie zakresu** | >50% nakładania | <50% nakładania |
| **Ukończenie** | Nie można „ukończyć” bez zmian | Można ukończyć oryginał, nowa praca jest samodzielna |
| **Historia** | Łańcuch aktualizacji opowiada spójną historię | Łatki bardziej byłyby mylące niż wyjaśniające |

### Zasada

> **Aktualizacja zachowuje kontekst. Nowa zmiana zapewnia jasność.**
>
> Wybierz aktualizację, gdy historia Twoich przemyśleń jest wartościowa.
> Wybierz nową zmianę, gdy rozpoczęcie od nowa będzie jaśniejsze niż nakładanie łatków.

Pomyśl o tym jak o gałęziach git:
- Wykonuj commity podczas pracy nad tą samą funkcją
- Rozpocznij nową gałąź, gdy to jest naprawdę nowa praca
- Czasem scal częściową funkcję i zacznij od nowa dla fazy 2

## Co się różni?

| | Starszy (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Struktura** | Jeden duży dokument propozycji | Oddzielne artefakty z zależnościami |
| **Proces pracy** | Liniowe fazy: plan → implementacja → archiwizacja | Płynne działania — wykonuj cokolwiek w dowolnym momencie |
| **Iteracja** | Nieporadne cofanie się | Aktualizuj artefakty w miarę zdobywania wiedzy |
| **Dostosowanie** | Stała struktura | Opiera się na schematach (definiuj własne artefakty) |

**Kluczowa spostrzeżenie:** praca nie jest liniowa. OPSX przestaje udawać, że tak jest.

## Dogłębna analiza architektury

Ta sekcja wyjaśnia, jak OPSX działa pod maską i jak wypada w porównaniu do starszego przepływu pracy.
Przykłady w tej sekcji wykorzystują rozszerzony zestaw poleceń (`new`, `continue` itd.); użytkownicy domyślnego zestawu `core` mogą zmapować ten sam przepływ na `propose → apply → sync → archive`.

### Filozofia: Fazy vs Akcje

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STARSZY PRZEPŁYW PRACY                              │
│                    (Zablokowany fazami, wszystko-nic)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   PLANOWANIE │ ───►│ IMPLEMENTACJA │ ───► │   ARCHIWIZACJA│             │
│   │    FAZA      │      │    FAZA      │      │    FAZA      │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Tworzy WSZYSTKIE artefakty naraz                                       │
│   • Nie można wrócić, aby zaktualizować specyfikacje podczas implementacji │
│   • Bramki fazowe wymuszają liniową progresję                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            PRZEPŁYW PRACY OPSX                              │
│                      (Płynne akcje, iteracyjne)                             │
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
│   • Twórz artefakty pojedynczo LUB przyspieszaj                            │
│   • Aktualizuj specyfikacje/projekt/zadania podczas implementacji          │
│   • Zależności umożliwiają postęp, fazy nie istnieją                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Architektura komponentów

**Starszy przepływ pracy** wykorzystuje sztywno zakodowane szablony w TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      KOMPONENTY STARSZEGO PRZEPŁYWU PRACY                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Sztywno zakodowane szablony (ciągi znaków TypeScript)                     │
│                    │                                                        │
│                    ▼                                                        │
│   Konfiguratory/adaptery specyficzne dla narzędzi                           │
│                    │                                                        │
│                    ▼                                                        │
│   Generowane pliki poleceń (.claude/commands/openspec/*.md)                 │
│                                                                             │
│   • Stała struktura, brak świadomości artefaktów                            │
│   • Zmiana wymaga modyfikacji kodu + przebudowy                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** wykorzystuje zewnętrzne schematy i silnik grafu zależności:

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
│   │      requires: []              ◄── Zależności                      │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Wzorce glob                     │   │
│   │      requires: [proposal]      ◄── Włącza się po proposal           │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Silnik grafu artefaktów                                                   │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Sortowanie topologiczne (kolejność zależności)                   │   │
│   │  • Wykrywanie stanu (istnienie w systemie plików)                   │   │
│   │  • Bogate generowanie instrukcji (szablony + kontekst)              │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Pliki umiejętności (.claude/skills/openspec-*/SKILL.md)                   │
│                                                                             │
│   • Kompatybilne z różnymi edytorami (Claude Code, Cursor, Windsurf)        │
│   • Umiejętności odpytywają CLI po strukturalne dane                        │
│   • W pełni konfigurowalne poprzez pliki schematów                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Model grafu zależności

Artefakty tworzą skierowany acykliczny graf (DAG). Zależności są **włącznikami**, nie bramkami:

```
                              proposal
                             (węzeł główny)
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
                 specs                       design
              (wymaga:                     (wymaga:
               proposal)                    proposal)
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
                          │ FAZA APPLY   │
                          │ (wymaga:     │
                          │  tasks)      │
                          └──────────────┘
```

**Przejścia stanów:**

```
   ZABLOKOWANY ────────────────► GOTOWY ────────────────► ZROBIONY
      │                           │                        │
   Brakuje                    Wszystkie zależności      Plik istnieje
   zależności                 są ZROBIONE               w systemie plików
```

### Przepływ informacji

**Starszy przepływ pracy** — agent otrzymuje statyczne instrukcje:

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
  │  Brak świadomości tego, co istnieje,    │
  │  ani zależności między artefaktami      │
  └─────────────────────────────────────────┘
           │
           ▼
  Agent tworzy WSZYSTKIE artefakty naraz
```

**OPSX** — agent odpytuje o bogaty kontekst:

```
  Użytkownik: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Krok 1: Odpytaj aktualny stan                                           │
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
  │  │    "template": "# Specification\n\n## ADDED Requirements...",      │  │
  │  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
  │  │    "unlocks": ["tasks"]                                            │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Krok 3: Przeczytaj zależności → Utwórz JEDEN artefakt → Pokaż co odblokował│
  └──────────────────────────────────────────────────────────────────────────┘
```

### Model iteracji

**Starszy przepływ pracy** — niezgrabny w iterowaniu:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── „Czekaj, projekt jest nieprawidłowy”
       │               │
       │               ├── Opcje:
       │               │   • Ręczna edycja plików (utraciasz kontekst)
       │               │   • Porzuć i zacznij od nowa
       │               │   • Przejdź do końca i napraw później
       │               │
       │               └── Brak oficjalnego mechanizmu „powrotu”
       │
       └── Tworzy WSZYSTKIE artefakty naraz
```

**OPSX** — naturalna iteracja:

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── „Projekt jest nieprawidłowy”
      │                │                  │
      │                │                  ▼
      │                │            Wystarczy edytować design.md
      │                │            i kontynuować!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply wznawia pracę
      │                │         od miejsca, w którym przerwałeś
      │                │
      │                └── Tworzy JEDEN artefakt, pokazuje co zostało odblokowane
      │
      └── Tworzy szkielet zmian, czeka na dalsze wskazówki
```

### Niestandardowe schematy

Twórz niestandardowe przepływy pracy za pomocą poleceń do zarządzania schematami:

```bash
# Utwórz nowy schemat od zera (interaktywnie)
openspec schema init my-workflow

# Lub zrób fork istniejącego schematu jako punkt wyjścia
openspec schema fork spec-driven my-workflow

# Sprawdź poprawność struktury schematu
openspec schema validate my-workflow

# Sprawdź, z jakiego źródła jest ładowany schemat (przydatne przy debugowaniu)
openspec schema which my-workflow
```

Schematy są przechowywane w `openspec/schemas/` (lokalne dla projektu, wersjonowane) lub `~/.local/share/openspec/schemas/` (globalne dla użytkownika).

**Struktura schematu:**
```
openspec/schemas/research-first/
├── schema.yaml
└── templates/
    ├── research.md
    ├── proposal.md
    └── tasks.md
```

**Przykładowy plik schema.yaml:**
```yaml
name: research-first
artifacts:
  - id: research        # Added before proposal
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Now depends on research

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**Graf zależności:**
```
   research ──► proposal ──► tasks
```

### Podsumowanie

| Aspekt | Legacy | OPSX |
|--------|----------|------|
| **Szablony** | Hardkodowany TypeScript | Zewnętrzne YAML + Markdown |
| **Zależności** | Brak (wszystkie naraz) | DAG z sortowaniem topologicznym |
| **Stan** | Model mentalny oparty na fazach | Istnienie w systemie plików |
| **Dostosowywanie** | Edycja źródła, ponowna budowa | Utworzenie schema.yaml |
| **Iteracja** | Zablokowana na fazach | Płynna, edycja dowolnych elementów |
| **Wsparcie edytorów** | Konfigurator/adaptery specyficzne dla narzędzia | Pojedynczy katalog skills |
## Schematy

Schematy definiują, jakie artefakty istnieją i ich zależności. Obecnie dostępne:

- **spec-driven** (domyślny): proposal → specs → design → tasks

```bash
# Wyświetl listę dostępnych schematów
openspec schemas

# Wyświetl wszystkie schematy wraz z ich źródłami ładowania
openspec schema which --all

# Utwórz nowy schemat w sposób interaktywny
openspec schema init my-workflow

# Zrób fork istniejącego schematu w celu dostosowania
openspec schema fork spec-driven my-workflow

# Sprawdź poprawność struktury schematu przed użyciem
openspec schema validate my-workflow
```

## Wskazówki

- Użyj `/opsx:explore`, aby przemyśleć pomysł przed rozpoczęciem wprowadzania zmian
- Użyj `/opsx:ff`, gdy wiesz co chcesz, a `/opsx:continue` podczas eksploracji
- Podczas `/opsx:apply`, jeśli coś jest nie tak — napraw artefakt, a następnie kontynuuj
- Zadania śledzą postęp za pomocą pól wyboru w pliku `tasks.md`
- Sprawdź status w dowolnym momencie: `openspec status --change "name"`

## Opinie i sugestie

Ten projekt jest nieukończony i wymaga dopracowania. Jest to celowe — dopiero uczymy się, co działa najlepiej.

Znalazłeś błąd? Masz pomysły? Dołącz do nas na [Discord](https://discord.gg/YctCnvvshC) lub złóż zgłoszenie błędu na [GitHub](https://github.com/Fission-AI/openspec/issues).