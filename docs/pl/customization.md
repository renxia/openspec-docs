# Dostosowywanie

OpenSpec oferuje trzy poziomy dostosowywania:

| Poziom | Co robi | Najlepsze dla |
|-------|---------|--------------|
| **Konfiguracja projektu** | Ustawia wartości domyślne, wstrzykuje kontekst/reguły | Większość zespołów |
| **Niestandardowe schematy** | Definiuje własne artefakty przepływu pracy | Zespoły z unikalnymi procesami |
| **Globalne nadpisania** | Udostępnia schematy we wszystkich projektach | Użytkownicy zaawansowani |

---

## Konfiguracja projektu

Plik `openspec/config.yaml` jest najprostszym sposobem na dostosowanie OpenSpec do potrzeb Twojego zespołu. Umożliwia on:

- **Ustaw domyślny schemat** – Pomijaj flagę `--schema` przy każdym poleceniu
- **Wstrzyknij kontekst projektu** – AI widzi Twój stos technologiczny, konwencje itp.
- **Dodaj reguły dla poszczególnych artefaktów** – Niestandardowe reguły dla określonych artefaktów

### Szybka konfiguracja

```bash
openspec init
```

Przeprowadzi Cię przez interaktywne tworzenie konfiguracji. Alternatywnie możesz ją utworzyć ręcznie:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Stos technologiczny: TypeScript, React, Node.js, PostgreSQL
  Styl API: RESTful, udokumentowany w docs/api.md
  Testy: Jest + React Testing Library
  Wartościujemy zgodność wsteczną dla wszystkich publicznych API

rules:
  proposal:
    - Dołącz plan wycofania
    - Zidentyfikuj dotknięte zespoły
  specs:
    - Używaj formatu Given/When/Then
    - Odwołuj się do istniejących wzorców przed wymyśleniem nowych
```

### Jak to działa

**Domyślny schemat:**

```bash
# Bez konfiguracji
openspec new change my-feature --schema spec-driven

# Z konfiguracją – schemat jest ustawiany automatycznie
openspec new change my-feature
```

**Wstrzykiwanie kontekstu i reguł:**

Podczas generowania dowolnego artefaktu Twój kontekst i reguły są wstrzykiwane do zapytania AI:

```xml
<context>
Stos technologiczny: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Dołącz plan wycofania
- Zidentyfikuj dotknięte zespoły
</rules>

<template>
[Wbudowany szablon schematu]
</template>
```

- **Kontekst** pojawia się we WSZYSTKICH artefaktach
- **Reguły** pojawiają się WYŁĄCZNIE dla pasującego artefaktu

### Kolejność rozwiązywania schematów

Gdy OpenSpec potrzebuje schematu, sprawdza go w następującej kolejności:

1. Flaga CLI: `--schema <name>`
2. Metadane zmiany (`.openspec.yaml` w folderze zmiany)
3. Konfiguracja projektu (`openspec/config.yaml`)
4. Domyślny (`spec-driven`)

---

## Niestandardowe schematy

Gdy konfiguracja projektu nie wystarcza, utwórz własny schemat z w pełni niestandardowym przepływem pracy. Niestandardowe schematy przechowywane są w katalogu `openspec/schemas/` Twojego projektu i są zarządzane w systemie kontroli wersji razem z kodem.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Konfiguracja projektu
│   ├── schemas/           # Tutaj przechowywane są niestandardowe schematy
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Twoje zmiany
└── src/
```

### Sforkuj istniejący schemat

Najszybszym sposobem na dostosowanie jest sforkowanie wbudowanego schematu:

```bash
openspec schema fork spec-driven my-workflow
```

Kopiuje cały schemat `spec-driven` do katalogu `openspec/schemas/my-workflow/`, gdzie możesz go dowolnie edytować.

**Co otrzymujesz:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Definicja przepływu pracy
└── templates/
    ├── proposal.md       # Szablon artefaktu propozycji
    ├── spec.md           # Szablon specyfikacji
    ├── design.md         # Szablon projektu technicznego
    └── tasks.md          # Szablon zadań
```

Teraz edytuj plik `schema.yaml`, aby zmienić przepływ pracy, lub edytuj szablony, aby zmienić to, co generuje AI.

### Utwórz schemat od zera

Dla zupełnie nowego przepływu pracy:

```bash
# Interaktywne
openspec schema init research-first

# Nieinteraktywne
openspec schema init rapid \
  --description "Szybki przepływ pracy iteracyjny" \
  --artifacts "proposal,tasks" \
  --default
```

### Struktura schematu

Schemat definiuje artefakty w Twoim przepływie pracy oraz sposób, w jaki od siebie zależą:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: Niestandardowy przepływ pracy mojego zespołu

artifacts:
  - id: proposal
    generates: proposal.md
    description: Wstępny dokument propozycji
    template: proposal.md
    instruction: |
      Utwórz propozycję, która wyjaśnia, DLACZEGO ta zmiana jest potrzebna.
      Skup się na problemie, a nie na rozwiązaniu.
    requires: []

  - id: design
    generates: design.md
    description: Projekt techniczny
    template: design.md
    instruction: |
      Utwórz dokument projektu technicznego wyjaśniający, JAK go zaimplementować.
    requires:
      - proposal    # Nie można utworzyć projektu technicznego, dopóki nie istnieje propozycja

  - id: tasks
    generates: tasks.md
    description: Lista kontrolna implementacji
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Kluczowe pola:**

| Pole | Cel |
|-------|---------|
| `id` | Unikalny identyfikator, używany w poleceniach i regułach |
| `generates` | Nazwa pliku wyjściowego (obsługuje globs, np. `specs/**/*.md`) |
| `template` | Plik szablonu w katalogu `templates/` |
| `instruction` | Instrukcje dla AI dotyczące tworzenia tego artefaktu |
| `requires` | Zależności – które artefakty muszą istnieć wcześniej |

### Szablony

Szablony to pliki w formacie Markdown, które kierują pracą AI. Są one wstrzykiwane do zapytania podczas tworzenia danego artefaktu.

```markdown
<!-- templates/proposal.md -->
## Dlaczego

<!-- Wyjaśnij motywację tej zmiany. Jaki problem rozwiązuje? -->

## Co się zmienia

<!-- Opisz, co się zmieni. Bądź konkretny dotycząco nowych funkcji lub modyfikacji. -->

## Wpływ

<!-- Dotknięty kod, API, zależności, systemy -->
```

Szablony mogą zawierać:
- Nagłówki sekcji, które AI powinno wypełnić
- Komentarze HTML z wskazówkami dla AI
- Przykładowe formaty pokazujące oczekiwaną strukturę

### Sprawdź poprawność schematu

Przed użyciem niestandardowego schematu sprawdź jego poprawność:

```bash
openspec schema validate my-workflow
```

Sprawdza on:
- Poprawność składni pliku `schema.yaml`
- Czy wszystkie odwołujące się szablony istnieją
- Czy nie ma zależności cyklicznych
- Czy identyfikatory artefaktów są poprawne

### Użyj niestandardowego schematu

Po utworzeniu użyj schematu w następujący sposób:

```bash
# Podaj w poleceniu
openspec new change feature --schema my-workflow

# Lub ustaw jako domyślny w pliku config.yaml
schema: my-workflow
```

### Debuguj rozwiązywanie schematów

Nie wiesz, który schemat jest obecnie używany? Sprawdź to za pomocą:

```bash
# Zobacz, skąd pochodzi określony schemat
openspec schema which my-workflow

# Wyświetl listę wszystkich dostępnych schematów
openspec schema which --all
```

Wyjście pokazuje, czy schemat pochodzi z Twojego projektu, katalogu użytkownika czy pakietu:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Uwaga:** OpenSpec obsługuje również schematy na poziomie użytkownika w katalogu `~/.local/share/openspec/schemas/` do udostępniania między projektami, ale zaleca się używanie schematów na poziomie projektu w katalogu `openspec/schemas/`, ponieważ są one zarządzane w systemie kontroli wersji razem z kodem.

---

## Przykłady

### Szybki przepływ pracy iteracyjny

Minimalny przepływ pracy do szybkich iteracji:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Szybka iteracja z minimalnym nakładem pracy

artifacts:
  - id: proposal
    generates: proposal.md
    description: Szybka propozycja
    template: proposal.md
    instruction: |
      Utwórz krótką propozycję dla tej zmiany.
      Skup się na tym, co i dlaczego, pomijaj szczegółowe specyfikacje.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Lista kontrolna implementacji
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Dodawanie artefaktu przeglądu

Sforkuj domyślny schemat i dodaj krok przeglądu:

```bash
openspec schema fork spec-driven with-review
```

Następnie edytuj plik `schema.yaml`, aby dodać:

```yaml
  - id: review
    generates: review.md
    description: Lista kontrolna przeglądu przed implementacją
    template: review.md
    instruction: |
      Utwórz listę kontrolną przeglądu na podstawie projektu technicznego.
      Uwzględnij aspekty bezpieczeństwa, wydajności i testów.
    requires:
      - design

  - id: tasks
    # ... istniejąca konfiguracja zadań ...
    requires:
      - specs
      - design
      - review    # Teraz zadania również wymagają przeglądu
```

---

## Schematy społecznościowe

OpenSpec obsługuje również schematy utrzymywane przez społeczność, dystrybuowane za pośrednictwem samodzielnych repozytoriów. Zapewniają one opiniowe przepływy pracy, które integrują OpenSpec z innymi narzędziami lub systemami, podobnie jak [katalog rozszerzeń społeczności github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) działa dla spec-kit.

Schematy społecznościowe nie są dołączane do rdzenia OpenSpec – przechowywane są we własnych repozytoriach z własnym cyklem wydań. Aby ich użyć, skopiuj paczkę schematu do katalogu `openspec/schemas/<schema-name>/` w swoim projekcie (instrukcje instalacji znajdują się w pliku README każdego repozytorium).

| Schemat | Opiekun | Repozytorium | Opis |
|--------|---------|-------------|-------------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Integruje zarządzanie artefaktami OpenSpec z umiejętnościami wykonywania [obra/superpowers](https://github.com/obra/superpowers) (brainstorming, tworzenie planów, TDD za pomocą subagentów, przegląd kodu, finalizacja). Dodaje artefakt `retrospective` oparty na dowodach, który wypełnia lukę, której Superpowers natywnie nie obsługuje. |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | Przepływ pracy zorientowany na menedżera produktu. Uruchamia potok planowania [nanopm](https://github.com/nmrtn/nanopm) (audyt → strategia → roadmapa → PRD) przed implementacją. Łączy planowanie produktu z inżynieryjnym przepływem pracy opartym na specyfikacjach OpenSpec. Artefakty odczytują dane z katalogu `.nanopm/`, jeśli jest on obecny – propozycja korzysta z audytu, projekt techniczny ze strategii, a zadania z rozbicia PRD. |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | Runbooky testów end-to-end na poziomie możliwości. Każda możliwość otrzymuje niezmienną specyfikację, niezmienny szablon zadań oraz jeden zapis wykonania z znacznikiem czasu na każde uruchomienie. Asercje dotyczą wyłącznie obserwowalnego zachowania (status HTTP, treść odpowiedzi, trwały stan – nigdy podciągów logów); każde uruchomienie zapisuje czas rozpoczęcia/zakończenia w UTC, czas trwania oraz szacunkowe zużycie tokenów LLM. |

> Chcesz przyczynić się do rozwoju schematu społecznościowego? Otwórz issue z linkiem do swojego repozytorium lub wyślij PR dodający wiersz do tej tabeli.

---

## Zobacz również

- [Dokumentacja CLI: Polecenia do zarządzania schematami](cli.md#schema-commands) – Pełna dokumentacja poleceń