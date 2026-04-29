# Migracja do OPSX

Ten przewodnik pomoże Ci przejść z tradycyjnego przepływu pracy OpenSpec do OPSX. Migracja została zaprojektowana tak, aby była płynna — Twoja dotychczasowa praca zostanie zachowana, a nowy system oferuje większą elastyczność.

## Co się zmienia?

OPSX zastępuje stary, sztywny przepływ pracy podejściem opartym na akcjach. Oto kluczowa zmiana:

| Aspekt | Tradycyjny | OPSX |
|--------|------------|------|
| **Komendy** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Domyślne: `/opsx:propose`, `/opsx:apply`, `/opsx:archive` (rozbudowane komendy przepływu pracy opcjonalne) |
| **Przepływ pracy** | Tworzenie wszystkich artefaktów naraz | Tworzenie stopniowo lub naraz — Twój wybór |
| **Powrót do tyłu** | Uciążliwe fazy bramkowe | Naturalne — aktualizuj dowolny artefakt w dowolnym momencie |
| **Dostosowywanie** | Sztywna struktura | Oparte na schemacie, w pełni modyfikowalne |
| **Konfiguracja** | `CLAUDE.md` ze znacznikami + `project.md` | Czysta konfiguracja w `openspec/config.yaml` |

**Zmiana filozofii:** Praca nie jest liniowa. OPSX przestaje udawać, że tak jest.

---

## Zanim zaczniesz

### Twoja istniejąca praca jest bezpieczna

Proces migracji został zaprojektowany z myślą o zachowaniu danych:

- **Aktywne zmiany w `openspec/changes/`** — Całkowicie zachowane. Możesz kontynuować je za pomocą poleceń OPSX.
- **Zarchiwizowane zmiany** — Nienaruszone. Twoja historia pozostaje nienaruszona.
- **Główne specyfikacje w `openspec/specs/`** — Nienaruszone. Są twoim źródłem prawdy.
- **Twoja zawartość w plikach CLAUDE.md, AGENTS.md itp.** — Zachowana. Usuwane są tylko bloki znaczników OpenSpec; wszystko, co napisałeś, pozostaje.

### Co zostanie usunięte

Tylko pliki zarządzane przez OpenSpec, które zostaną zastąpione:

| Co | Dlaczego |
|------|-----|
| Katalogi/pliki starszych poleceń slesowych | Zastąpione przez nowy system umiejętności |
| `openspec/AGENTS.md` | Przestarzały wyzwalacz przepływu pracy |
| Znaczniki OpenSpec w `CLAUDE.md`, `AGENTS.md` itp. | Już niepotrzebne |

**Lokalizacje starszych poleceń według narzędzia** (przykłady — twoje narzędzie może się różnić):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (tylko rozszerzenia IDE; nieobsługiwane w Copilot CLI)
- I inne (Augment, Continue, Amazon Q itp.)

Migracja wykrywa, które narzędzia masz skonfigurowane, i czyści ich starsze pliki.

Lista usunięć może wydawać się długa, ale są to wszystko pliki, które pierwotnie utworzył OpenSpec. Twoja własna zawartość nigdy nie jest usuwana.

### Co wymaga twojej uwagi

Jeden plik wymaga ręcznej migracji:

**`openspec/project.md`** — Ten plik nie jest usuwany automatycznie, ponieważ może zawierać kontekst projektu, który napisałeś. Będziesz musiał:

1. Przejrzeć jego zawartość
2. Przenieść przydatny kontekst do `openspec/config.yaml` (zobacz poniższe wskazówki)
3. Usunąć plik, gdy będziesz gotowy

**Dlaczego wprowadziliśmy tę zmianę:**

Stary `project.md` był pasywny — agenty mogły go przeczytać, mogły nie, mogły zapomnieć, co przeczytały. Stwierdziliśmy, że niezawodność była niespójna.

Nowy kontekst w `config.yaml` jest **aktywnie wstrzykiwany do każdego żądania planowania OpenSpec**. Oznacza to, że twoje konwencje projektowe, stos technologiczny i reguły są zawsze obecne, gdy AI tworzy artefakty. Wyższa niezawodność.

**Kompromis:**

Ponieważ kontekst jest wstrzykiwany do każdego żądania, będziesz chciał być zwięzły. Skup się na tym, co naprawdę ważne:
- Stos technologiczny i kluczowe konwencje
- Nieoczywiste ograniczenia, o których AI musi wiedzieć
- Reguły, które często były ignorowane

Nie martw się o perfekcję. Wciąż uczymy się, co tutaj działa najlepiej, i będziemy ulepszać sposób działania wstrzykiwania kontekstu w miarę eksperymentów.

---

## Uruchamianie migracji

Zarówno `openspec init`, jak i `openspec update` wykrywają starsze pliki i przeprowadzają przez ten sam proces czyszczenia. Użyj tego, który pasuje do twojej sytuacji:

- Nowe instalacje domyślnie używają profilu `core` (`propose`, `explore`, `apply`, `archive`).
- Zainstalowane migracje zachowują twoje wcześniej zainstalowane przepływy pracy, zapisując profil `custom` w razie potrzeby.

### Używanie `openspec init`

Uruchom to, jeśli chcesz dodać nowe narzędzia lub skonfigurować, które narzędzia są ustawione:

```bash
openspec init
```

Polecenie init wykrywa starsze pliki i przeprowadza przez czyszczenie:

```
Aktualizacja do nowego OpenSpec

OpenSpec teraz używa umiejętności agentów, standardu rozwijającego się w
środowiskach programistycznych. Upraszcza to twoją konfigurację, zachowując
wszystko działające jak wcześniej.

Pliki do usunięcia
Brak zawartości użytkownika do zachowania:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Pliki do zaktualizowania
Znaczniki OpenSpec zostaną usunięte, twoja zawartość zachowana:
  • CLAUDE.md
  • AGENTS.md

Wymaga twojej uwagi
  • openspec/project.md
    Nie usuniemy tego pliku. Może zawierać użyteczny kontekst projektu.

    Nowy openspec/config.yaml ma sekcję "context:" dla kontekstu planowania.
    Jest ona dołączana do każdego żądania OpenSpec i działa bardziej
    niezawodnie niż stare podejście z project.md.

    Przejrzyj project.md, przenieś wszelkie użyteczne treści do sekcji
    context w config.yaml, a następnie usuń plik, gdy będziesz gotowy.

? Zaktualizować i wyczyścić starsze pliki? (Y/n)
```

**Co się stanie, gdy powiesz tak:**

1. Starsze katalogi poleceń slesowych zostaną usunięte
2. Znaczniki OpenSpec zostaną usunięte z `CLAUDE.md`, `AGENTS.md` itp. (twoja zawartość pozostaje)
3. `openspec/AGENTS.md` zostanie usunięty
4. Nowe umiejętności zostaną zainstalowane w `.claude/skills/`
5. `openspec/config.yaml` zostanie utworzony z domyślnym schematem

### Używanie `openspec update`

Uruchom to, jeśli chcesz tylko migrować i odświeżyć istniejące narzędzia do najnowszej wersji:

```bash
openspec update
```

Polecenie update również wykrywa i czyści starsze artefakty, a następnie odświeża wygenerowane umiejętności/polecenia, aby dopasować je do twojego bieżącego profilu i ustawień dostarczania.

### Środowiska nieinteraktywne / CI

Dla migracji w skryptach:

```bash
openspec init --force --tools claude
```

Flaga `--force` pomija monity i automatycznie akceptuje czyszczenie.

---

## Migracja project.md do config.yaml

Stary `openspec/project.md` był swobodnym plikiem markdown dla kontekstu projektu. Nowy `openspec/config.yaml` jest strukturalny i — co kluczowe — **wstrzykiwany do każdego żądania planowania**, dzięki czemu twoje konwencje są zawsze obecne, gdy AI pracuje.

### Przed (project.md)

```markdown
# Kontekst projektu

To jest monorepo TypeScript używające React i Node.js.
Używamy Jesta do testów i przestrzegamy surowych reguł ESLint.
Nasz API jest RESTful i udokumentowane w docs/api.md.

## Konwencje

- Wszystkie publiczne API muszą zachowywać wsteczną kompatybilność
- Nowe funkcje powinny zawierać testy
- Używaj formatu Given/When/Then dla specyfikacji
```

### Po (config.yaml)

```yaml
schema: spec-driven

context: |
  Stos technologiczny: TypeScript, React, Node.js
  Testowanie: Jest z React Testing Library
  API: RESTful, udokumentowane w docs/api.md
  Zachowujemy wsteczną kompatybilność dla wszystkich publicznych API

rules:
  proposal:
    - Dołącz plan wycofania dla ryzykownych zmian
  specs:
    - Używaj formatu Given/When/Then dla scenariuszy
    - Odwołuj się do istniejących wzorców przed wymyślaniem nowych
  design:
    - Dołącz diagramy sekwencji dla złożonych przepływów
```

### Kluczowe różnice

| project.md | config.yaml |
|------------|-------------|
| Swobodny markdown | Strukturalny YAML |
| Jeden blok tekstu | Oddzielny kontekst i reguły dla poszczególnych artefaktów |
| Niejasne, kiedy jest używany | Kontekst pojawia się we WSZYSTKICH artefaktach; reguły tylko w pasujących artefaktach |
| Brak wyboru schematu | Jawne pole `schema:` ustawia domyślny przepływ pracy |

### Co zachować, co odrzucić

Podczas migracji bądź wybiórczy. Zadaj sobie pytanie: „Czy AI potrzebuje tego do *każdego* żądania planowania?"

**Dobre kandydaty do `context:`**
- Stos technologiczny (języki, frameworki, bazy danych)
- Kluczowe wzorce architektoniczne (monorepo, mikroserwisy itp.)
- Nieoczywiste ograniczenia („nie możemy użyć biblioteki X, ponieważ...")
- Kluczowe konwencje, które często są ignorowane

**Przenieś do `rules:` zamiast tego**
- Formatowanie specyficzne dla artefaktów („używaj Given/When/Then w specyfikacjach")
- Kryteria przeglądu („propozycje muszą zawierać plany wycofania")
- Pojawiają się tylko dla pasującego artefaktu, utrzymując inne żądania lżejszymi

**Pomijaj całkowicie**
- Ogólne najlepsze praktyki, które AI już zna
- Rozległe wyjaśnienia, które można streścić
- Kontekst historyczny, który nie wpływa na bieżącą pracę

### Kroki migracji

1. **Utwórz config.yaml** (jeśli nie został już utworzony przez init):
   ```yaml
   schema: spec-driven
   ```

2. **Dodaj swój kontekst** (bądź zwięzły — trafia do każdego żądania):
   ```yaml
   context: |
     Twoje tło projektu tutaj.
     Skup się na tym, czego AI naprawdę potrzebuje wiedzieć.
   ```

3. **Dodaj reguły dla poszczególnych artefaktów** (opcjonalnie):
   ```yaml
   rules:
     proposal:
       - Twoje wskazówki specyficzne dla propozycji
     specs:
       - Twoje reguły pisania specyfikacji
   ```

4. **Usuń project.md**, gdy przeniesiesz wszystko użyteczne.

**Nie przesadzaj.** Zacznij od podstaw i iteruj. Jeśli zauważysz, że AI pomija coś ważnego, dodaj to. Jeśli kontekst wydaje się rozbity, skróć go. To żywy dokument.

### Potrzebujesz pomocy? Użyj tego monitu

Jeśli nie jesteś pewien, jak wyodrębnić swój project.md, zapytaj swojego asystenta AI:

```
Migruję ze starego project.md OpenSpec do nowego formatu config.yaml.

Oto mój obecny project.md:
[wklej zawartość swojego project.md]

Pomóż mi utworzyć config.yaml z:
1. Zwięzłą sekcją `context:` (jest wstrzykiwana do każdego żądania planowania, więc bądź zwięzły — skup się na stosie technologicznym, kluczowych ograniczeniach i konwencjach, które często są ignorowane)
2. `rules:` dla konkretnych artefaktów, jeśli jakaś zawartość jest specyficzna dla artefaktów (np. „używaj Given/When/Then" należy do reguł specs, a nie globalnego kontekstu)

Pomijaj wszystko ogólnego, co modele AI już znają. Bądź bezwzględny w kwestii zwięzłości.
```

AI pomoże ci zidentyfikować, co jest niezbędne, a co można skrócić.

---

## Nowe polecenia

Dostępność poleceń zależy od profilu:

**Domyślny (profil `core`):**

| Polecenie | Cel |
|---------|---------|
| `/opsx:propose` | Utwórz zmianę i wygeneruj artefakty planowania w jednym kroku |
| `/opsx:explore` | Przemyśl pomysły bez struktury |
| `/opsx:apply` | Zaimplementuj zadania z tasks.md |
| `/opsx:archive` | Finalizuj i archiwizuj zmianę |

**Rozszerzony przepływ pracy (niestandardowy wybór):**

| Polecenie | Cel |
|---------|---------|
| `/opsx:new` | Rozpocznij nowy szkielet zmiany |
| `/opsx:continue` | Utwórz następny artefakt (po jednym na raz) |
| `/opsx:ff` | Szybkie przesunięcie — utwórz artefakty planowania naraz |
| `/opsx:verify` | Waliduj, czy implementacja odpowiada specyfikacjom |
| `/opsx:sync` | Podgląd/scalanie specyfikacji bez archiwizacji |
| `/opsx:bulk-archive` | Archiwizuj wiele zmian naraz |
| `/opsx:onboard` | Prowadzony kompleksowy przepływ pracy onboardingu |

Włącz rozszerzone polecenia za pomocą `openspec config profile`, a następnie uruchom `openspec update`.

### Mapowanie poleceń ze starszych

| Starsze | Odpowiednik OPSX |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (domyślne) lub `/opsx:new` potem `/opsx:ff` (rozszerzone) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Nowe możliwości

Te możliwości są częścią zestawu poleceń rozszerzonego przepływu pracy.

**Szczegółowe tworzenie artefaktów:**
```
/opsx:continue
```
Tworzy jeden artefakt na raz na podstawie zależności. Używaj tego, gdy chcesz przeglądać każdy krok.

**Tryb eksploracji:**
```
/opsx:explore
```
Przemyśl pomysły z partnerem przed zaangażowaniem się w zmianę.

---

## Zrozumienie nowej architektury

### Od fazowej do płynnej

Stary workflow wymuszał postęp liniowy:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANOWANIE │ ───► │ REALIZACJA   │ ───► │ ARCHIWIZACJA │
│    FAZA      │      │    FAZA      │      │    FAZA      │
└──────────────┘      └──────────────┘      └──────────────┘

Jeśli jesteś w fazie realizacji i zdasz sobie sprawę, że projekt jest zły?
Niestety. Bramy faz nie pozwalają łatwo wrócić.
```

OPSX używa akcji, nie faz:

```
         ┌───────────────────────────────────────────────┐
         │           AKCJE (nie fazy)                    │
         │                                               │
         │     nowa ◄──► kontynuuj ◄──► zastosuj ◄──► archiwizuj │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    dowolna kolejność          │
         └───────────────────────────────────────────────┘
```

### Graf zależności

Artefakty tworzą graf skierowany. Zależności są ułatwieniami, nie bramami:

```
                        propozycja
                       (węzeł główny)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specyfikacje               projekt
        (wymaga:                  (wymaga:
         propozycji)               propozycji)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         zadania
                     (wymaga:
                     specyfikacji, projektu)
```

Kiedy uruchamiasz `/opsx:continue`, sprawdza, co jest gotowe i proponuje następny artefakt. Możesz też tworzyć wiele gotowych artefaktów w dowolnej kolejności.

### Umiejętności vs Polecenia

Stary system używał specyficznych dla narzędzi plików poleceń:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX używa nowego standardu **umiejętności**:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Umiejętności są rozpoznawane przez wiele narzędzi AI do kodowania i dostarczają bogatsze metadane.

---

## Kontynuacja istniejących zmian

Twoje trwające zmiany współpracują bezproblemowo z poleceniami OPSX.

**Masz aktywną zmianę ze starego workflow?**

```
/opsx:apply add-my-feature
```

OPSX odczytuje istniejące artefakty i kontynuuje od miejsca, w którym skończyłeś.

**Chcesz dodać więcej artefaktów do istniejącej zmiany?**

```
/opsx:continue add-my-feature
```

Wyświetla, co jest gotowe do utworzenia na podstawie tego, co już istnieje.

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
# Wstrzykiwany do instrukcji WSZYSTKICH artefaktów
context: |
  Tło Twojego projektu, stos technologiczny,
  konwencje i ograniczenia.

# Opcjonalne: Reguły dla poszczególnych artefaktów
# Wstrzykiwane tylko do pasujących artefaktów
rules:
  proposal:
    - Dołącz plan wycofania
  specs:
    - Używaj formatu Given/When/Then
  design:
    - Dokumentuj strategie awaryjne
  tasks:
    - Dziel na bloki maks. 2-godzinne
```

### Rozwiązywanie schematu

Przy określaniu, którego schematu użyć, OPSX sprawdza w kolejności:

1. **Flaga CLI**: `--schema <nazwa>` (najwyższy priorytet)
2. **Metadane zmiany**: `.openspec.yaml` w katalogu zmiany
3. **Konfiguracja projektu**: `openspec/config.yaml`
4. **Domyślny**: `spec-driven`

### Dostępne schematy

| Schemat | Artefakty | Najlepszy dla |
|---------|-----------|---------------|
| `spec-driven` | propozycja → specyfikacje → projekt → zadania | Większość projektów |

Wyświetl wszystkie dostępne schematy:

```bash
openspec schemas
```

### Niestandardowe schematy

Utwórz własny workflow:

```bash
openspec schema init my-workflow
```

Lub rozwidl istniejący:

```bash
openspec schema fork spec-driven my-workflow
```

Zobacz [Dostosowywanie](customization.md) po szczegóły.

---

## Rozwiązywanie problemów

### "Wykryto stare pliki w trybie nieinteraktywnym"

Uruchamiasz w środowisku CI lub nieinteraktywnym. Użyj:

```bash
openspec init --force
```

### Polecenia nie pojawiają się po migracji

Uruchom ponownie IDE. Umiejętności są wykrywane przy starcie.

### "Nieznany ID artefaktu w regułach"

Sprawdź, czy klucze w `rules:` pasują do ID artefaktów w Twoim schemacie:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Uruchom to, aby zobaczyć prawidłowe ID artefaktów:

```bash
openspec schemas --json
```

### Konfiguracja nie jest stosowana

1. Upewnij się, że plik znajduje się w `openspec/config.yaml` (nie `.yml`)
2. Sprawdź składnię YAML
3. Zmiany konfiguracji są stosowane natychmiast — nie wymagają restartu

### project.md nie został zmigrowany

System celowo zachowuje `project.md`, ponieważ może zawierać Twoje niestandardowe treści. Przejrzyj go ręcznie, przenieś użyteczne części do `config.yaml`, a następnie usuń go.

### Chcesz zobaczyć, co zostałoby wyczyszczone?

Uruchom init i odrzuć monit o czyszczenie — zobaczysz pełne podsumowanie wykrycia bez wprowadzania żadnych zmian.

---

## Szybki referencja

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
│       ├── openspec-propote/     # domyślny profil podstawowy
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       └── ...                   # rozszerzony profil dodaje new/continue/ff/itp.
├── CLAUDE.md                     # Usunięto znaczniki OpenSpec, zachowano Twoje treści
└── AGENTS.md                     # Usunięto znaczniki OpenSpec, zachowano Twoje treści
```

### Co zniknęło

- `.claude/commands/openspec/` — zastąpione przez `.claude/skills/`
- `openspec/AGENTS.md` — przestarzałe
- `openspec/project.md` — migruj do `config.yaml`, a następnie usuń
- Bloki znaczników OpenSpec w `CLAUDE.md`, `AGENTS.md` itp.

### Ściągawka poleceń

```text
/opsx:propote      Zacznij szybko (domyślny profil podstawowy)
/opsx:apply        Realizuj zadania
/opsx:archive      Zakończ i archiwizuj

# Rozszerzony workflow (jeśli włączony):
/opsx:new          Przygotuj szkielet zmiany
/opsx:continue     Utwórz następny artefakt
/opsx:ff           Utwórz artefakty planowania
```

---

## Uzyskanie pomocy

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Dokumentacja**: [docs/opsx.md](opsx.md) dla pełnej referencji OPSX