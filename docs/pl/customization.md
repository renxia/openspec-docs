# Dostosowywanie

OpenSpec oferuje trzy poziomy dostosowywania:

| Poziom | Co robi | Najlepszy dla |
|--------|---------|---------------|
| **Konfiguracja projektu** | Ustawia domyślne wartości, wstrzykuje kontekst/reguły | Większości zespołów |
| **Niestandardowe schematy** | Definiowanie własnych artefaktów przepływu pracy | Zespołów z unikalnymi procesami |
| **Nadpisania globalne** | Udostępnianie schematów we wszystkich projektach | Zaawansowanych użytkowników |

---

## Konfiguracja projektu

Plik `openspec/config.yaml` to najprostszy sposób na dostosowanie OpenSpec do potrzeb Twojego zespołu. Pozwala on na:

- **Ustawienie domyślnego schematu** — pominięcie `--schema` przy każdym poleceniu
- **Wstrzyknięcie kontekstu projektu** — AI widzi Twój stos technologiczny, konwencje itp.
- **Dodanie reguł dla poszczególnych artefaktów** — niestandardowe reguły dla konkretnych artefaktów

### Szybka konfiguracja

```bash
openspec init
```

To przeprowadzi Cię przez interaktywne tworzenie konfiguracji. Możesz też utworzyć ją ręcznie:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API style: RESTful, documented in docs/api.md
  Testing: Jest + React Testing Library
  We value backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones
```

### Jak to działa

**Domyślny schemat:**

```bash
# Bez konfiguracji
openspec new change my-feature --schema spec-driven

# Z konfiguracją — schemat jest automatyczny
openspec new change my-feature
```

**Wstrzykiwanie kontekstu i reguł:**

Podczas generowania dowolnego artefaktu, Twój kontekst i reguły są wstrzykiwane do promptu AI:

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Include rollback plan
- Identify affected teams
</rules>

<template>
[Schema's built-in template]
</template>
```

- **Kontekst** pojawia się we WSZYSTKICH artefaktach
- **Reguły** pojawiają się TYLKO dla pasującego artefaktu

### Kolejność rozwiązywania schematów

Gdy OpenSpec potrzebuje schematu, sprawdza go w następującej kolejności:

1. Flaga CLI: `--schema <name>`
2. Metadane zmiany (`.openspec.yaml` w folderze zmiany)
3. Konfiguracja projektu (`openspec/config.yaml`)
4. Domyślny (`spec-driven`)

---

## Niestandardowe schematy

Gdy konfiguracja projektu nie wystarcza, utwórz własny schemat z całkowicie niestandardowym przepływem pracy. Niestandardowe schematy znajdują się w katalogu `openspec/schemas/` Twojego projektu i są wersjonowane razem z kodem.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Project config
│   ├── schemas/           # Custom schemas live here
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Your changes
└── src/
```

### Forkowanie istniejącego schematu

Najszybszym sposobem na dostosowanie jest forkowanie wbudowanego schematu:

```bash
openspec schema fork spec-driven my-workflow
```

To kopiuje cały schemat `spec-driven` do `openspec/schemas/my-workflow/`, gdzie możesz go swobodnie edytować.

**Co otrzymujesz:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Workflow definition
└── templates/
    ├── proposal.md       # Template for proposal artifact
    ├── spec.md           # Template for specs
    ├── design.md         # Template for design
    └── tasks.md          # Template for tasks
```

Teraz edytuj `schema.yaml`, aby zmienić przepływ pracy, lub edytuj szablony, aby zmienić to, co generuje AI.

### Tworzenie schematu od podstaw

Dla całkowicie nowego przepływu pracy:

```bash
# Interaktywnie
openspec schema init research-first

# Nieinteraktywnie
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Struktura schematu

Schemat definiuje artefakty w Twoim przepływie pracy oraz to, jak zależą od siebie:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: My team's custom workflow

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initial proposal document
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Technical design
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal    # Can't create design until proposal exists

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Kluczowe pola:**

| Pole | Przeznaczenie |
|------|---------------|
| `id` | Unikalny identyfikator, używany w poleceniach i regułach |
| `generates` | Nazwa pliku wyjściowego (obsługuje wzorce glob, np. `specs/**/*.md`) |
| `template` | Plik szablonu w katalogu `templates/` |
| `instruction` | Instrukcje AI do tworzenia tego artefaktu |
| `requires` | Zależności — które artefakty muszą istnieć wcześniej |

### Szablony

Szablony to pliki markdown, które kierują AI. Są wstrzykiwane do promptu podczas tworzenia danego artefaktu.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

Szablony mogą zawierać:
- Nagłówki sekcji, które AI powinno wypełnić
- Komentarze HTML z instrukcjami dla AI
- Przykładowe formaty pokazujące oczekiwaną strukturę

### Walidacja schematu

Przed użyciem niestandardowego schematu zweryfikuj go:

```bash
openspec schema validate my-workflow
```

Sprawdza to, czy:
- Składnia `schema.yaml` jest poprawna
- Wszystkie referencje do szablonów istnieją
- Nie ma cyklicznych zależności
- Identyfikatory artefaktów są prawidłowe

### Użycie niestandardowego schematu

Po utworzeniu użyj swojego schematu za pomocą:

```bash
# Określ w poleceniu
openspec new change feature --schema my-workflow

# Lub ustaw jako domyślny w config.yaml
schema: my-workflow
```

### Debugowanie rozwiązywania schematów

Nie wiesz, który schemat jest używany? Sprawdź za pomocą:

```bash
# Zobacz, skąd rozwiązywany jest konkretny schemat
openspec schema which my-workflow

# Lista wszystkich dostępnych schematów
openspec schema which --all
```

Wyjście pokazuje, czy pochodzi z Twojego projektu, katalogu użytkownika, czy pakietu:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Uwaga:** OpenSpec obsługuje również schematy na poziomie użytkownika w `~/.local/share/openspec/schemas/` do udostępniania między projektami, ale zalecane są schematy na poziomie projektu w `openspec/schemas/`, ponieważ są wersjonowane razem z kodem.

---

## Przykłady

### Szybki przepływ pracy iteracyjnej

Minimalistyczny przepływ pracy dla szybkich iteracji:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Quick proposal
    template: proposal.md
    instruction: |
      Create a brief proposal for this change.
      Focus on what and why, skip detailed specs.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Dodanie artefaktu recenzji

Sforkuj domyślny schemat i dodaj krok recenzji:

```bash
openspec schema fork spec-driven with-review
```

Następnie edytuj `schema.yaml`, aby dodać:

```yaml
  - id: review
    generates: review.md
    description: Pre-implementation review checklist
    template: review.md
    instruction: |
      Create a review checklist based on the design.
      Include security, performance, and testing considerations.
    requires:
      - design

  - id: tasks
    # ... existing tasks config ...
    requires:
      - specs
      - design
      - review    # Now tasks require review too
```

---

## Schematy społeczności

OpenSpec obsługuje również schematy utrzymywane przez społeczność, dystrybuowane za pośrednictwem oddzielnych repozytoriów. Zapewniają one opiniowane przepływy pracy, które integrują OpenSpec z innymi narzędzi lub systemami, podobnie jak [katalog rozszerzeń społeczności github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) działa dla spec-kit.

Schematy społeczności nie są dołączane do rdzenia OpenSpec — znajdują się we własnych repozytoriach z własnym cyklem wydań. Aby użyć jednego z nich, skopiuj paczkę schematu do katalogu `openspec/schemas/<schema-name>/` swojego projektu (README każdego repozytorium zawiera instrukcje instalacji).

| Schemat | Opiekun | Repozytorium | Opis |
|---------|---------|-------------|------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Integruje zarządzanie artefaktami OpenSpec z umiejętnościami wykonawczymi [obra/superpowers](https://github.com/obra/superpowers) (burza mózgów, planowanie, TDD przez podagentów, recenzja kodu, finalizacja). Dodaje artefakt `retrospective` oparty na dowodach, wypełniając lukę, której Superpowers natywnie nie pokrywa. |

> Chcesz przyczynić się do schematu społeczności? Otwórz issue z linkiem do swojego repozytorium lub prześlij PR z dodaniem wiersza do tej tabeli.

---

## Zobacz także

- [Referencja CLI: Polecenia schematów](cli.md#schema-commands) — pełna dokumentacja poleceń