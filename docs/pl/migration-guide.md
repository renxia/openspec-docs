# Migracja do OPSX

Ten przewodnik pomoże Ci przejść ze starszego przepływu pracy OpenSpec do OPSX. Migracja została zaprojektowana tak, aby była płynna — Twoja dotychczasowa praca pozostaje zachowana, a nowy system oferuje większą elastyczność.

## Co się zmienia?

OPSX zastępuje stary przepływ pracy zablokowany w etapach płynnym, opartym na akcjach podejściem. Oto kluczowa zmiana:

| Aspekt | Starsze podejście | OPSX |
|--------|--------|------|
| **Polecenia** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Domyślnie: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (opcjonalnie rozszerzone polecenia przepływu pracy) |
| **Przepływ pracy** | Twórz wszystkie artefakty naraz | Twórz przyrostowo lub wszystkie naraz — Ty decydujesz |
| **Powrót** | Niewygodne bramy etapów | Naturalny — aktualizuj dowolny artefakt w dowolnym momencie |
| **Dostosowanie** | Struktura stała | Oparty na schemacie, w pełni modyfikowalny |
| **Konfiguracja** | `CLAUDE.md` z markerami + `project.md` | Przejrzysta konfiguracja w `openspec/config.yaml` |

**Zmiana filozofii:** Praca nie jest liniowa. OPSX przestał udawać, że jest.

## Zanim Zaczniesz

### Twoja Istniejąca Praca Jest Bezpieczna

Proces migracji został zaprojektowany z myślą o zachowaniu danych:

- **Aktywne zmiany w `openspec/changes/`** — Całkowicie zachowane. Możesz kontynuować pracę nad nimi za pomocą poleceń OPSX.
- **Zarchiwizowane zmiany** — Nienaruszone. Twoja historia pozostaje nietknięta.
- **Główne specyfikacje w `openspec/specs/`** — Nienaruszone. To jest Twoje źródło prawdy.
- **Twoja treść w CLAUDE.md, AGENTS.md itp.** — Zachowana. Usuwane są tylko bloki znaczników OpenSpec; wszystko, co napisałeś, pozostaje.

### Co Zostanie Usunięte

Tylko pliki zarządzane przez OpenSpec, które są zastępowane:

| Co | Dlaczego |
|------|-----|
| Katalogi/pliki poleceń ukośników (slash commands) w starszych wersjach | Zastąpione przez nowy system umiejętności (skills) |
| `openspec/AGENTS.md` | Przestarzały wyzwalacz przepływu pracy |
| Znaczniki OpenSpec w `CLAUDE.md`, `AGENTS.md` itp. | Nie są już potrzebne |

**Lokalizacje starszych poleceń według narzędzia** (przykłady — Twoje narzędzie może się różnić):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (tylko rozszerzenia IDE; nieobsługiwane w Copilot CLI)
- Codex: OpenSpec teraz używa `.codex/skills/openspec-*`; starsze porządki dotyczą tylko dozwolonych nazw plików promptów OpenSpec w `$CODEX_HOME/prompts` lub `~/.codex/prompts`, i usuwane są one dopiero po istnieniu zastępczych umiejętności.
- I inne (Augment, Continue, Amazon Q itp.)

Migracja wykrywa narzędzia, które masz skonfigurowane, i czyści ich starsze pliki.

Lista usuwanych plików może wydawać się długa, ale są to wszystkie pliki, które OpenSpec pierwotnie utworzył. Twoja własna treść nigdy nie jest usuwana.

### Co Wymaga Twojej Uwagi

Jeden plik wymaga ręcznej migracji:

**`openspec/project.md`** — Ten plik nie jest usuwany automatycznie, ponieważ może zawierać kontekst projektu, który napisałeś. Będziesz musiał:

1. Przejrzeć jego zawartość
2. Przenieść przydatny kontekst do `openspec/config.yaml` (zobacz wskazówki poniżej)
3. Usunąć plik, gdy będziesz gotowy

**Dlaczego wprowadziliśmy tę zmianę:**

Stary `project.md` był pasywny — agenci mogli go przeczytać, mogli nie, mogli zapomnieć, co przeczytali. Odkryliśmy, że niezawodność była niespójna.

Nowy kontekst w `config.yaml` jest **aktywnie wstrzykiwany w każde żądanie planowania OpenSpec**. Oznacza to, że Twoje konwencje projektowe, stos technologiczny i reguły są zawsze obecne, gdy AI tworzy artefakty. Wyższa niezawodność.

**Kompromis:**

Ponieważ kontekst jest wstrzykiwany w każde żądanie, warto być zwięzłym. Skup się na tym, co naprawdę ważne:
- Stos technologiczny i kluczowe konwencje
- Nieoczywiste ograniczenia, o których AI musi wiedzieć
- Reguły, które często były ignorowane wcześniej

Nie przejmuj się, żeby było idealnie. Wciąż uczymy się, co działa najlepiej, i będziemy ulepszać sposób wstrzykiwania kontekstu w miarę eksperymentowania.

---

## Uruchamianie Migracji

Zarówno `openspec init`, jak i `openspec update` wykrywają starsze pliki i prowadzą ten sam proces czyszczenia. Użyj tego, które pasuje do Twojej sytuacji:

- Nowe instalacje domyślnie używają profilu `core` (`propose`, `explore`, `apply`, `sync`, `archive`).
- Zmigrowane instalacje zachowują wcześniej zainstalowane przepływy pracy, zapisując profil `custom` gdy to konieczne.

### Używanie `openspec init`

Uruchom to, jeśli chcesz dodać nowe narzędzia lub ponownie skonfigurować, które narzędzia są ustawione:

```bash
openspec init
```

Polecenie init wykrywa starsze pliki i prowadzi przez proces czyszczenia:

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

1. Katalogi starszych poleceń ukośników zostaną usunięte
2. Znaczniki OpenSpec zostaną usunięte z `CLAUDE.md`, `AGENTS.md` itp. (Twoja treść pozostaje)
3. `openspec/AGENTS.md` zostanie usunięty
4. Nowe umiejętności zostaną zainstalowane w `.claude/skills/`
5. `openspec/config.yaml` zostanie utworzony ze schematem domyślnym

### Używanie `openspec update`

Uruchom to, jeśli chcesz tylko zmigrować i odświeżyć istniejące narzędzia do najnowszej wersji:

```bash
openspec update
```

Polecenie update również wykrywa i czyści starsze artefakty, a następnie odświeża wygenerowane umiejętności/polecenia, aby pasowały do Twojego obecnego profilu i ustawień dostarczania.

### Środowiska Nieinteraktywne / CI

Dla migrowanych skryptowo:

```bash
openspec init --force --tools claude
```

Flaga `--force` pomija monity i automatycznie akceptuje czyszczenie.

Obejmuje to czyszczenie plików promptów Codex zarządzanych przez OpenSpec w globalnym katalogu promptów Codex. Czyszczenie dotyczy tylko dozwolonych nazw plików starszych promptów OpenSpec, usuwa je dopiero po istnieniu zastępczych umiejętności `.codex/skills/openspec-*`, i zachowuje wszystkie inne pliki.

---

## Migracja project.md do config.yaml

Stary `openspec/project.md` był dowolnym plikiem markdown dla kontekstu projektu. Nowy `openspec/config.yaml` jest ustrukturyzowany i — co kluczowe — **wstrzykiwany w każde żądanie planowania**, dzięki czemu Twoje konwencje są zawsze obecne, gdy AI pracuje.

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
| Dowolny markdown | Ustrukturyzowany YAML |
| Jeden blok tekstu | Oddzielny kontekst i reguły per artefakt |
| Niejasne, kiedy jest używany | Kontekst pojawia się we WSZYSTKICH artefaktach; reguły pojawiają się tylko w pasujących artefaktach |
| Brak wyboru schematu | Jawne pole `schema:` ustawia domyślny przepływ pracy |

### Co Zachować, Co Odrzucić

Podczas migracji bądź selektywny. Zapytaj siebie: "Czy AI potrzebuje tego do *każdego* żądania planowania?"

**Dobry kandydat do `context:`**
- Stos technologiczny (języki, frameworki, bazy danych)
- Kluczowe wzorce architektoniczne (monorepo, mikroserwisy itp.)
- Nieoczywiste ograniczenia ("nie możemy używać biblioteki X, ponieważ...")
- Krytyczne konwencje, które często są ignorowane

**Przenieś do `rules:`**
- Formatowanie specyficzne dla artefaktu ("użyj Given/When/Then w specyfikacjach")
- Kryteria przeglądu ("propozycje muszą zawierać plany wycofania")
- Te pojawiają się tylko dla pasującego artefaktu, utrzymując inne żądania lżejszymi

**Pomiń całkowicie**
- Ogólne najlepsze praktyki, które AI już zna
- Rozległe wyjaśnienia, które można podsumować
- Kontekst historyczny, który nie wpływa na bieżącą pracę

### Kroki Migracji

1. **Utwórz config.yaml** (jeśli nie został już utworzony przez init):
   ```yaml
   schema: spec-driven
   ```

2. **Dodaj swój kontekst** (bądź zwięzły — to trafia do każdego żądania):
   ```yaml
   context: |
     Twoje tło projektu trafia tutaj.
     Skup się na tym, co AI naprawdę musi wiedzieć.
   ```

3. **Dodaj reguły per artefakt** (opcjonalnie):
   ```yaml
   rules:
     proposal:
       - Twoje wskazówki specyficzne dla propozycji
     specs:
       - Twoje reguły pisania specyfikacji
   ```

4. **Usuń project.md** gdy przeniesiesz wszystko przydatne.

**Nie przesadzaj z analizą.** Zacznij od podstaw i iteruj. Jeśli zauważysz, że AI czegoś ważnego nie uwzględnia, dodaj to. Jeśli kontekst wydaje się przeładowany, skróć to. To żywy dokument.

### Potrzebujesz Pomocy? Użyj Tego Promptu

Jeśli nie jesteś pewien, jak skondensować swój project.md, zapytaj swojego asystenta AI:

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

AI pomoże Ci zidentyfikować, co jest istotne, a co można skrócić.

---

## Nowe Polecenia

Dostępność poleceń zależy od profilu:

**Domyślnie (profil `core`):**

| Polecenie | Cel |
|---------|---------|
| `/opsx:propose` | Utwórz zmianę i wygeneruj artefakty planowania w jednym kroku |
| `/opsx:explore` | Przemyśl pomysły bez struktury |
| `/opsx:apply` | Zadania implementacyjne z tasks.md |
| `/opsx:archive` | Sfinalizuj i zarchiwizuj zmianę |

**Rozszerzony przepływ pracy (wybór niestandardowy):**

| Polecenie | Cel |
|---------|---------|
| `/opsx:new` | Rozpocznij nowy szkielet zmiany |
| `/opsx:continue` | Utwórz następny artefakt (po jednym) |
| `/opsx:ff` | Fast-forward — utwórz artefakty planowania naraz |
| `/opsx:verify` | Zweryfikuj, że implementacja pasuje do specyfikacji |
| `/opsx:sync` | Scal specyfikacje delta w główne specyfikacje |
| `/opsx:bulk-archive` | Zarchiwizuj wiele zmian naraz |
| `/opsx:onboard` | Przewodnik end-to-end po onboardingu |

Włącz rozszerzone polecenia za pomocą `openspec config profile`, a następnie uruchom `openspec update`.

### Mapowanie Poleceń ze Starszej Wersji

| Starsza wersja | Odpowiednik OPSX |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (domyślnie) lub `/opsx:new` potem `/opsx:ff` (rozszerzone) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Nowe Możliwości

Te możliwości są częścią rozszerzonego zestawu poleceń przepływu pracy.

**Szczegółowe tworzenie artefaktów:**
```
/opsx:continue
```
Tworzy po jednym artefakcie na podstawie zależności. Użyj tego, gdy chcesz przejrzeć każdy krok.

**Tryb eksploracji:**
```
/opsx:explore
```
Przemyśl pomysły z partnerem przed zobowiązaniem się do zmiany.

---

## Zrozumienie Nowej Architektury

### Od Sztywnych Faz do Płynności

Starszy przepływ pracy wymuszał liniową progresję:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

If you're in implementation and realize the design is wrong?
Too bad. Phase gates don't let you go back easily.
```

OPSX używa akcji, nie faz:

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

### Graf Zależności

Artefakty tworzą graf skierowany. Zależności są wspierające, nie blokujące:

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

Gdy uruchomisz `/opsx:continue`, sprawdza, co jest gotowe, i proponuje następny artefakt. Możesz też tworzyć wiele gotowych artefaktów w dowolnej kolejności.

### Umiejętności vs Polecenia

Starszy system używał plików poleceń specyficznych dla narzędzia:

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

Umiejętności są rozpoznawane przez wiele narzędzi AI do kodowania i zapewniają bogatsze metadane.

Codex w OPSX jest wyłącznie oparty na umiejętnościach. OpenSpec nie generuje już niestandardowych plików promptów Codex; użyj zamiast tego wygenerowanych katalogów `.codex/skills/openspec-*`.

---

## Kontynuowanie istniejących zmian

Twoje trwające zmiany bezproblemowo współpracują z poleceniami OPSX.

**Masz aktywną zmianę ze starszego przepływu pracy?**

```
/opsx:apply add-my-feature
```

OPSX odczytuje istniejące artefakty i kontynuuje od miejsca, w którym przerwałeś.

**Chcesz dodać więcej artefaktów do istniejącej zmiany?**

```
/opsx:continue add-my-feature
```

Pokazuje, co jest gotowe do utworzenia na podstawie tego, co już istnieje.

**Chcesz zobaczyć status?**

```bash
openspec status --change add-my-feature
```

---

## Nowy system konfiguracji

### Struktura config.yaml

```yaml
# Wymagane: Domyślny schemat dla nowych zmian
schema: spec-driven

# Opcjonalne: Kontekst projektu (maks. 50 KB)
# Wstrzykiwane do WSZYSTKICH instrukcji artefaktów
context: |
  Twoje tło projektu, stos technologiczny,
  konwencje i ograniczenia.

# Opcjonalne: Reguły dla poszczególnych artefaktów
# Wstrzykiwane tylko do pasujących artefaktów
rules:
  proposal:
    - Dołącz plan wycofania
  specs:
    - Użyj formatu Given/When/Then
  design:
    - Udokumentuj strategie awaryjne
  tasks:
    - Podziel na maksymalnie 2-godzinne fragmenty
```

### Rozstrzyganie schematu

Przy określaniu, którego schematu użyć, OPSX sprawdza w kolejności:

1. **Flaga CLI**: `--schema <name>` (najwyższy priorytet)
2. **Metadane zmiany**: `.openspec.yaml` w katalogu zmiany
3. **Konfiguracja projektu**: `openspec/config.yaml`
4. **Domyślny**: `spec-driven`

### Dostępne schematy

| Schema | Artefakty | Najlepszy dla |
|--------|-----------|---------------|
| `spec-driven` | proposal → specs → design → tasks | Większość projektów |

Wyświetl wszystkie dostępne schematy:

```bash
openspec schemas
```

### Schematy niestandardowe

Utwórz własny przepływ pracy:

```bash
openspec schema init my-workflow
```

Lub utwórz fork istniejącego:

```bash
openspec schema fork spec-driven my-workflow
```

Zobacz [Dostosowywanie](customization.md) po szczegóły.

---

## Rozwiązywanie problemów

### „Wykryto pliki starszego typu w trybie nieinteraktywnym”

Pracujesz w środowisku CI lub nieinteraktywnym. Użyj:

```bash
openspec init --force
```

### Polecenia nie pojawiają się po migracji

Uruchom ponownie IDE. Umiejętności są wykrywane podczas uruchamiania.

### „Nieznany identyfikator artefaktu w regułach”

Sprawdź, czy klucze `rules:` pasują do identyfikatorów artefaktów Twojego schematu:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Uruchom to, aby zobaczyć prawidłowe identyfikatory artefaktów:

```bash
openspec schemas --json
```

### Konfiguracja nie jest stosowana

1. Upewnij się, że plik znajduje się w `openspec/config.yaml` (nie `.yml`)
2. Sprawdź poprawność składni YAML
3. Zmiany konfiguracji wchodzą w życie natychmiast — ponowne uruchamianie nie jest potrzebne

### project.md nie został zmigrowany

System celowo zachowuje `project.md`, ponieważ może zawierać Twoją niestandardową zawartość. Przejrzyj go ręcznie, przenieś przydatne części do `config.yaml`, a następnie usuń go.

### Chcesz zobaczyć, co zostałoby wyczyszczone?

Uruchom init i odrzuć monit o czyszczenie — zobaczysz pełne podsumowanie wykrycia bez wprowadzania jakichkolwiek zmian.

---

## Szybka referencja

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
│       ├── openspec-propose/     # domyślny profil podstawowy
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # rozszerzony profil dodaje new/continue/ff/itp.
├── CLAUDE.md                     # Znaczniki OpenSpec usunięte, Twoja zawartość zachowana
└── AGENTS.md                     # Znaczniki OpenSpec usunięte, Twoja zawartość zachowana
```

### Co zniknęło

- `.claude/commands/openspec/` — zastąpione przez `.claude/skills/`
- `openspec/AGENTS.md` — przestarzałe
- `openspec/project.md` — zmigruj do `config.yaml`, następnie usuń
- Bloki znaczników OpenSpec w `CLAUDE.md`, `AGENTS.md`, itp.

### Ściągawka poleceń

```text
/opsx:propose      Szybki start (domyślny profil podstawowy)
/opsx:apply        Implementuj zadania
/opsx:archive      Zakończ i zarchiwizuj

# Rozszerzony przepływ pracy (jeśli włączony):
/opsx:new          Utwórz szkielet zmiany
/opsx:continue     Utwórz następny artefakt
/opsx:ff           Utwórz artefakty planowania
```

---

## Uzyskiwanie pomocy

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Dokumentacja**: [docs/opsx.md](opsx.md) dla pełnej dokumentacji OPSX