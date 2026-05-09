# Migracja do OPSX

Ten przewodnik pomoże Ci przejść z przestarzałego procesu OpenSpec do OPSX. Migracja została zaprojektowana tak, aby była płynna — Twoja dotychczasowa praca zostaje zachowana, a nowy system oferuje większą elastyczność.

## Co się zmienia?

OPSX zastępuje stary, sztywny proces podejścia opartego na fazach, płynnym, opartym na działaniach. Oto kluczowa zmiana:

| Aspekt | Stary system | OPSX |
|--------|--------------|------|
| **Komendy** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Domyślnie: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (opcjonalne komendy rozszerzonego procesu) |
| **Proces** | Tworzenie wszystkich artefaktów naraz | Tworzenie przyrostowe lub naraz — Twój wybór |
| **Powrót do poprzednich etapów** | Niewygodne bramki fazowe | Naturalne — aktualizacja dowolnego artefaktu w dowolnym momencie |
| **Dostosowanie** | Sztywna struktura | Sterowana schematem, w pełni konfigurowalna |
| **Konfiguracja** | `CLAUDE.md` ze znacznikami + `project.md` | Czysta konfiguracja w `openspec/config.yaml`

**Zmiana filozofii:** Praca nie jest liniowa. OPSX przestaje udawać, że jest inaczej.

---

## Zanim Zaczniesz

### Twoja Istniejąca Praca Jest Bezpieczna

Proces migracji został zaprojektowany z myślą o zachowaniu danych:

- **Aktywne zmiany w `openspec/changes/`** — W pełni zachowane. Możesz kontynuować je za pomocą poleceń OPSX.
- **Zarchiwizowane zmiany** — Nietknięte. Twoja historia pozostaje nienaruszona.
- **Główne specyfikacje w `openspec/specs/`** — Nietknięte. Są one Twoim źródłem prawdy.
- **Twoja zawartość w CLAUDE.md, AGENTS.md itp.** — Zachowana. Usuwane są jedynie bloki znaczników OpenSpec; wszystko, co napisałeś, pozostaje.

### Co Zostanie Usunięte

Tylko pliki zarządzane przez OpenSpec, które są zastępowane:

| Co | Dlaczego |
|------|-----|
| Starsze katalogi/pliki poleceń slash | Zastąpione przez nowy system umiejętności |
| `openspec/AGENTS.md` | Przestarzały wyzwalacz przepływu pracy |
| Znaczniki OpenSpec w `CLAUDE.md`, `AGENTS.md` itp. | Nie są już potrzebne |

**Lokalizacje starszych poleceń według narzędzia** (przykłady — Twoje narzędzie może się różnić):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (tylko rozszerzenia IDE; nieobsługiwane w Copilot CLI)
- I inne (Augment, Continue, Amazon Q itp.)

Migracja wykrywa narzędzia, które masz skonfigurowane, i czyści ich starsze pliki.

Lista usuwanych elementów może wydawać się długa, ale są to wszystko pliki, które OpenSpec pierwotnie utworzył. Twoja własna zawartość nigdy nie jest usuwana.

### Co Wymaga Twojej Uwagi

Jeden plik wymaga ręcznej migracji:

**`openspec/project.md`** — Ten plik nie jest automatycznie usuwany, ponieważ może zawierać kontekst projektu, który napisałeś. Będziesz musiał:

1. Przejrzeć jego zawartość
2. Przenieść przydatny kontekst do `openspec/config.yaml` (patrz wskazówki poniżej)
3. Usunąć plik, gdy będziesz gotowy

**Dlaczego wprowadziliśmy tę zmianę:**

Stary `project.md` był pasywny — agenci mogli go przeczytać, mogli nie przeczytać, mogli zapomnieć, co przeczytali. Stwierdziliśmy, że niezawodność była niespójna.

Nowy kontekst `config.yaml` jest **aktywnie wstrzykiwany do każdego żądania planowania OpenSpec**. Oznacza to, że Twoje konwencje projektowe, stos technologiczny i reguły są zawsze obecne, gdy AI tworzy artefakty. Wyższa niezawodność.

**Kompromis:**

Ponieważ kontekst jest wstrzykiwany do każdego żądania, warto być zwięzłym. Skup się na tym, co naprawdę ma znaczenie:
- Stos technologiczny i kluczowe konwencje
- Nieoczywiste ograniczenia, które AI musi znać
- Reguły, które wcześniej często były ignorowane

Nie martw się o doskonałość. Wciąż uczymy się, co działa najlepiej, i będziemy ulepszać sposób wstrzykiwania kontekstu w miarę naszych eksperymentów.

---

## Uruchamianie Migracji

Zarówno `openspec init`, jak i `openspec update` wykrywają starsze pliki i prowadzą Cię przez ten sam proces czyszczenia. Użyj tego, który pasuje do Twojej sytuacji:

- Nowe instalacje domyślnie używają profilu `core` (`propose`, `explore`, `apply`, `sync`, `archive`).
- Migrowane instalacje zachowują wcześniej zainstalowane przepływy pracy, zapisując profil `custom` w razie potrzeby.

### Użycie `openspec init`

Uruchom to, jeśli chcesz dodać nowe narzędzia lub ponownie skonfigurować, które narzędzia są ustawione:

```bash
openspec init
```

Polecenie init wykrywa starsze pliki i prowadzi Cię przez czyszczenie:

```
Upgrading to the new OpenSpec

OpenSpec now uses agent skills, the emerging standard across coding
agents. This simplifies your setup while keeping everything working
as before.

Files to remove
No user content to preserve:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Files to update
OpenSpec markers will be removed, your content preserved:
  • CLAUDE.md
  • AGENTS.md

Needs your attention
  • openspec/project.md
    We won't delete this file. It may contain useful project context.

    The new openspec/config.yaml has a "context:" section for planning
    context. This is included in every OpenSpec request and works more
    reliably than the old project.md approach.

    Review project.md, move any useful content to config.yaml's context
    section, then delete the file when ready.

? Upgrade and clean up legacy files? (Y/n)
```

**Co się stanie, gdy powiesz tak:**

1. Starsze katalogi poleceń slash są usuwane
2. Znaczniki OpenSpec są usuwane z `CLAUDE.md`, `AGENTS.md` itp. (Twoja zawartość zostaje)
3. `openspec/AGENTS.md` jest usuwany
4. Nowe umiejętności są instalowane w `.claude/skills/`
5. `openspec/config.yaml` jest tworzony z domyślnym schematem

### Użycie `openspec update`

Uruchom to, jeśli chcesz tylko przeprowadzić migrację i odświeżyć istniejące narzędzia do najnowszej wersji:

```bash
openspec update
```

Polecenie update również wykrywa i czyści starsze artefakty, a następnie odświeża wygenerowane umiejętności/polecenia, aby dopasować je do Twojego bieżącego profilu i ustawień dostarczania.

### Środowiska Nieinteraktywne / CI

Dla migracji zautomatyzowanych skryptami:

```bash
openspec init --force --tools claude
```

Flaga `--force` pomija monity i automatycznie akceptuje czyszczenie.

---

## Migracja project.md do config.yaml

Stary `openspec/project.md` był swobodnym plikiem markdown na kontekst projektu. Nowy `openspec/config.yaml` jest ustrukturyzowany i — co kluczowe — **wstrzykiwany do każdego żądania planowania**, dzięki czemu Twoje konwencje są zawsze obecne, gdy AI pracuje.

### Przed (project.md)

```markdown
# Project Context

This is a TypeScript monorepo using React and Node.js.
We use Jest for testing and follow strict ESLint rules.
Our API is RESTful and documented in docs/api.md.

## Conventions

- All public APIs must maintain backwards compatibility
- New features should include tests
- Use Given/When/Then format for specifications
```

### Po (config.yaml)

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  Testing: Jest with React Testing Library
  API: RESTful, documented in docs/api.md
  We maintain backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan for risky changes
  specs:
    - Use Given/When/Then format for scenarios
    - Reference existing patterns before inventing new ones
  design:
    - Include sequence diagrams for complex flows
```

### Kluczowe Różnice

| project.md | config.yaml |
|------------|-------------|
| Swobodny markdown | Ustrukturyzowany YAML |
| Jeden blok tekstu | Oddzielny kontekst i reguły dla poszczególnych artefaktów |
| Niejasne, kiedy jest używany | Kontekst pojawia się we WSZYSTKICH artefaktach; reguły pojawiają się tylko w pasujących artefaktach |
| Brak wyboru schematu | Jawne pole `schema:` ustawia domyślny przepływ pracy |

### Co Zachować, Co Odrzucić

Podczas migracji bądź selektywny. Zapytaj siebie: „Czy AI potrzebuje tego do *każdego* żądania planowania?"

**Dobrzy kandydaci na `context:`**
- Stos technologiczny (języki, frameworki, bazy danych)
- Kluczowe wzorce architektoniczne (monorepo, mikroserwisy itp.)
- Nieoczywiste ograniczenia („nie możemy użyć biblioteki X, ponieważ...")
- Krytyczne konwencje, które często są ignorowane

**Przenieś do `rules:` zamiast tego**
- Formatowanie specyficzne dla artefaktów („używaj Given/When/Then w specyfikacjach")
- Kryteria przeglądu („propozycje muszą zawierać plan wycofania")
- Te pojawiają się tylko dla pasującego artefaktu, odciążając inne żądania

**Pomiń całkowicie**
- Ogólne najlepsze praktyki, które AI już zna
- Rozwlekłe wyjaśnienia, które można podsumować
- Kontekst historyczny, który nie wpływa na bieżącą pracę

### Kroki Migracji

1. **Utwórz config.yaml** (jeśli nie został jeszcze utworzony przez init):
   ```yaml
   schema: spec-driven
   ```

2. **Dodaj swój kontekst** (bądź zwięzły — to trafia do każdego żądania):
   ```yaml
   context: |
     Tło Twojego projektu tutaj.
     Skup się na tym, co AI naprawdę musi wiedzieć.
   ```

3. **Dodaj reguły dla poszczególnych artefaktów** (opcjonalnie):
   ```yaml
   rules:
     proposal:
       - Twoje wytyczne specyficzne dla propozycji
     specs:
       - Twoje reguły pisania specyfikacji
   ```

4. **Usuń project.md** po przeniesieniu wszystkiego, co przydatne.

**Nie przejmuj się za bardzo.** Zacznij od podstaw i iteruj. Jeśli zauważysz, że AI czegoś ważnego nie uwzględnia, dodaj to. Jeśli kontekst wydaje się rozbudowany, skróć go. To żywy dokument.

### Potrzebujesz Pomocy? Użyj Tego Promptu

Jeśli nie masz pewności, jak skondensować swój project.md, poproś swojego asystenta AI:

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[wklej zawartość swojego project.md]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

AI pomoże Ci zidentyfikować, co jest istotne, a co można skrócić.

---

## Nowe Polecenia

Dostępność poleceń zależy od profilu:

**Domyślny (profil `core`):**

| Polecenie | Cel |
|---------|---------|
| `/opsx:propose` | Utwórz zmianę i wygeneruj artefakty planowania w jednym kroku |
| `/opsx:explore` | Przemyśl pomysły bez struktury |
| `/opsx:apply` | Wdróż zadania z tasks.md |
| `/opsx:archive` | Sfinalizuj i zarchiwizuj zmianę |

**Rozszerzony przepływ pracy (niestandardowy wybór):**

| Polecenie | Cel |
|---------|---------|
| `/opsx:new` | Rozpocznij nowy szkielet zmiany |
| `/opsx:continue` | Utwórz następny artefakt (po jednym na raz) |
| `/opsx:ff` | Przewiń do przodu — utwórz artefakty planowania naraz |
| `/opsx:verify` | Waliduj, czy implementacja odpowiada specyfikacjom |
| `/opsx:sync` | Scal specyfikacje delta z głównymi specyfikacjami |
| `/opsx:bulk-archive` | Zarchiwizuj wiele zmian naraz |
| `/opsx:onboard` | Prowadzony end-to-end przepływ pracy wdrożenia |

Włącz rozszerzone polecenia za pomocą `openspec config profile`, a następnie uruchom `openspec update`.

### Mapowanie Poleceń ze Starszej Wersji

| Starsza wersja | Odpowiednik OPSX |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (domyślnie) lub `/opsx:new` następnie `/opsx:ff` (rozszerzony) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Nowe Możliwości

Te możliwości są częścią zestawu poleceń rozszerzonego przepływu pracy.

**Szczegółowe tworzenie artefaktów:**
```
/opsx:continue
```
Tworzy jeden artefakt na raz na podstawie zależności. Użyj tego, gdy chcesz przejrzeć każdy krok.

**Tryb eksploracji:**
```
/opsx:explore
```
Przemyśl pomysły z partnerem, zanim zdecydujesz się na zmianę.

---

## Zrozumienie nowej architektury

### Od faz do płynności

Stary wymuszał liniowy postęp:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

Jeśli jesteś w fazie implementacji i zdajesz sobie sprawę, że projekt jest zły?
Trudno. Bramki faz nie pozwalają łatwo cofnąć się.
```

OPSX używa akcji, a nie faz:

```
         ┌───────────────────────────────────────────────┐
         │           ACTIONS (not phases)                │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    any order                  │
         └───────────────────────────────────────────────┘
```

### Graf zależności

Artefakty tworzą graf skierowany. Zależności są czynnikami umożliwiającymi, a nie bramkami:

```
                        proposal
                       (root node)
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
```

Kiedy uruchomisz `/opsx:continue`, sprawdza on, co jest gotowe i oferuje następny artefakt. Możesz również tworzyć wiele gotowych artefaktów w dowolnej kolejności.

### Umiejętności vs Komendy

Stary system używał plików komend specyficznych dla narzędzi:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX używa rozwijającego się standardu **umiejętności (skills)**:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Umiejętności są rozpoznawane w wielu narzędziach do kodowania AI i zapewniają bogatsze metadane.

---

## Kontynuowanie istniejących zmian

Twoje zmiany w toku działają bezproblemowo z komendami OPSX.

**Masz aktywną zmianę ze starego workflow?**

```
/opsx:apply add-my-feature
```

OPSX odczytuje istniejące artefakty i kontynuuje od miejsca, w którym skończyłeś.

**Chcesz dodać więcej artefaktów do istniejącej zmiany?**

```
/opsx:continue add-my-feature
```

Pokazuje, co jest gotowe do utworzenia na podstawie tego, co już istnieje.

**Potrzebujesz zobaczyć status?**

```bash
openspec status --change add-my-feature
```

---

## Nowy system konfiguracji

### Struktura config.yaml

```yaml
# Wymagane: Domyślny schemat dla nowych zmian
schema: spec-driven

# Opcjonalne: Kontekst projektu (maks. 50KB)
# Wstrzykiwany do WSZYSTKICH instrukcji artefaktów
context: |
  Tło Twojego projektu, stos technologiczny,
  konwencje i ograniczenia.

# Opcjonalne: Reguły dla poszczególnych artefaktów
# Wstrzykiwane tylko do pasujących artefaktów
rules:
  proposal:
    - Uwzględnij plan wycofania
  specs:
    - Użyj formatu Given/When/Then
  design:
    - Dokumentuj strategie awaryjne
  tasks:
    - Podziel na maksymalnie 2-godzinne bloki
```

### Rozwiązywanie schematu

Przy określaniu, którego schematu użyć, OPSX sprawdza w kolejności:

1. **Flaga CLI**: `--schema <name>` (najwyższy priorytet)
2. **Metadane zmiany**: `.openspec.yaml` w katalogu zmiany
3. **Konfiguracja projektu**: `openspec/config.yaml`
4. **Domyślny**: `spec-driven`

### Dostępne schematy

| Schemat | Artefakty | Najlepsze dla |
|---------|-----------|---------------|
| `spec-driven` | proposal → specs → design → tasks | Większość projektów |

Wyświetl wszystkie dostępne schematy:

```bash
openspec schemas
```

### Schematy niestandardowe

Utwórz własny workflow:

```bash
openspec schema init my-workflow
```

Lub rozwidl istniejący:

```bash
openspec schema fork spec-driven my-workflow
```

Szczegóły znajdziesz w sekcji [Dostosowywanie](customization.md).

---

## Rozwiązywanie problemów

### "Legacy files detected in non-interactive mode"

Uruchamiasz w środowisku CI lub nieinteraktywnym. Użyj:

```bash
openspec init --force
```

### Komendy nie pojawiają się po migracji

Uruchom ponownie swoje IDE. Umiejętności są wykrywane przy starcie.

### "Unknown artifact ID in rules"

Sprawdź, czy klucze w `rules:` odpowiadają identyfikatorom artefaktów Twojego schematu:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Uruchom to, aby zobaczyć prawidłowe identyfikatory artefaktów:

```bash
openspec schemas --json
```

### Konfiguracja nie jest stosowana

1. Upewnij się, że plik znajduje się w `openspec/config.yaml` (nie `.yml`)
2. Waliduj składnię YAML
3. Zmiany konfiguracji obowiązują natychmiast — nie jest wymagany restart

### project.md nie zostało zmigrowane

System celowo zachowuje `project.md`, ponieważ może zawierać Twoje niestandardowe treści. Przejrzyj je ręcznie, przenieś przydatne części do `config.yaml`, a następnie usuń.

### Chcesz zobaczyć, co zostałoby wyczyszczone?

Uruchom init i odrzuć monit o czyszczenie — zobaczysz pełne podsumowanie wykrywania bez wprowadzania jakichkolwiek zmian.

---

## Szybka ściągawka

### Pliki po migracji

```
project/
├── openspec/
│   ├── specs/                    # Bez zmian
│   ├── changes/                  # Bez zmian
│   │   └── archive/              # Bez zmian
│   └── config.yaml               # NOWE: Konfiguracja projektu
├── .claude/
│   └── skills/                   # NOWE: Umiejętności OPSX
│       ├── openspec-propose/     # domyślny profil rdzenia
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # rozszerzony profil dodaje new/continue/ff/itd.
├── CLAUDE.md                     # Markery OpenSpec usunięte, Twoje treści zachowane
└── AGENTS.md                     # Markery OpenSpec usunięte, Twoje treści zachowane
```

### Co zniknęło

- `.claude/commands/openspec/` — zastąpione przez `.claude/skills/`
- `openspec/AGENTS.md` — przestarzałe
- `openspec/project.md` — zmigruj do `config.yaml`, a następnie usuń
- Bloki markerów OpenSpec w `CLAUDE.md`, `AGENTS.md` itp.

### Ściąga komend

```text
/opsx:propose      Zacznij szybko (domyślny profil rdzenia)
/opsx:apply        Wdróż zadania
/opsx:archive      Zakończ i zarchiwizuj

# Rozszerzony workflow (jeśli włączony):
/opsx:new          Zbuduj szkielet zmiany
/opsx:continue     Utwórz następny artefakt
/opsx:ff           Utwórz artefakty planowania
```

---

## Uzyskiwanie pomocy

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Dokumentacja**: [docs/opsx.md](opsx.md) — pełny referencja OPSX