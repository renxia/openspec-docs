# Dostosowywanie

OpenSpec oferuje trzy poziomy dostosowywania:

| Poziom | Co robi | Najlepszy dla |
|--------|---------|---------------|
| **Konfiguracja projektu** | Ustawia wartości domyślne, wstrzykuje kontekst/zasady | Większość zespołów |
| **Niestandardowe schematy** | Definiuje własne artefakty przepływu pracy | Zespoły z unikalnymi procesami |
| **Nadpisania globalne** | Udostępnia schematy we wszystkich projektach | Zaawansowani użytkownicy |

---

## Konfiguracja projektu

Plik `openspec/config.yaml` to najprostszy sposób na dostosowanie OpenSpec do potrzeb Twojego zespołu. Pozwala on na:

- **Ustawienie domyślnego schematu** – pomijanie `--schema` przy każdym poleceniu
- **Wstrzyknięcie kontekstu projektu** – AI widzi Twój stos technologiczny, konwencje itp.
- **Dodanie reguł dla poszczególnych artefaktów** – niestandardowe reguły dla określonych artefaktów

### Szybka konfiguracja

```bash
openspec init
```

Pomaga to w interaktywnym tworzeniu konfiguracji. Lub utwórz ją ręcznie:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Stos technologiczny: TypeScript, React, Node.js, PostgreSQL
  Styl API: RESTful, udokumentowany w docs/api.md
  Testowanie: Jest + React Testing Library
  Cenimy kompatybilność wsteczną dla wszystkich publicznych API

rules:
  proposal:
    - Dołącz plan wycofania
    - Zidentyfikuj dotknięte zespoły
  specs:
    - Używaj formatu Given/When/Then
    - Odnosź się do istniejących wzorców przed tworzeniem nowych
```

### Jak to działa

**Domyślny schemat:**

```bash
# Bez konfiguracji
openspec new change my-feature --schema spec-driven

# Z konfiguracją - schemat jest automatyczny
openspec new change my-feature
```

**Wstrzykiwanie kontekstu i reguł:**

Przy generowaniu dowolnego artefaktu Twój kontekst i reguły są wstrzykiwane do promptu AI:

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
[wbudowany szablon schematu]
</template>
```

- **Kontekst** pojawia się we WSZYSTKICH artefaktach
- **Reguły** pojawiają TYLKO dla pasującego artefaktu

### Kolejność rozwiązywania schematów

Gdy OpenSpec potrzebuje schematu, sprawdza w następującej kolejności:

1. Flaga CLI: `--schema <nazwa>`
2. Metadane zmiany (`.openspec.yaml` w folderze zmiany)
3. Konfiguracja projektu (`openspec/config.yaml`)
4. Domyślny (`spec-driven`)

---

## Niestandardowe schematy

Gdy konfiguracja projektu nie wystarcza, utwórz własny schemat z całkowicie niestandardowym przepływem pracy. Niestandardowe schematy znajdują się w katalogu `openspec/schemas/` Twojego projektu i są kontrolowane wersjami razem z kodem.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Konfiguracja projektu
│   ├── schemas/           # Niestandardowe schematy znajdują się tutaj
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Twoje zmiany
└── src/
```

### Rozwidlenie istniejącego schematu

Najszybszym sposobem dostosowania jest rozwidlenie wbudowanego schematu:

```bash
openspec schema fork spec-driven my-workflow
```

Kopiuje to cały schemat `spec-driven` do `openspec/schemas/my-workflow/`, gdzie możesz go swobodnie edytować.

**Co otrzymujesz:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Definicja przepływu pracy
└── templates/
    ├── proposal.md       # Szablon dla artefaktu proposal
    ├── spec.md           # Szablon dla specyfikacji
    ├── design.md         # Szablon dla projektu
    └── tasks.md          # Szablon dla zadań
```

Teraz edytuj `schema.yaml`, aby zmienić przepływ pracy, lub edytuj szablony, aby zmienić to, co generuje AI.

### Tworzenie schematu od zera

Aby stworzyć całkowicie nowy przepływ pracy:

```bash
# Interaktywnie
openspec schema init research-first

# Nieinteraktywnie
openspec schema init rapid \
  --description "Przepływ pracy szybkiej iteracji" \
  --artifacts "proposal,tasks" \
  --default
```

### Struktura schematu

Schemat definiuje artefakty w Twoim przepływie pracy i ich wzajemne zależności:

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
      Utwórz propozycję wyjaśniającą DLACZEGO ta zmiana jest potrzebna.
      Skup się na problemie, a nie na rozwiązaniu.
    requires: []

  - id: design
    generates: design.md
    description: Projekt techniczny
    template: design.md
    instruction: |
      Utwórz dokument projektu wyjaśniający JAK zaimplementować zmianę.
    requires:
      - proposal    # Nie można utworzyć projektu, dopóki nie istnieje propozycja

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
|------|-----|
| `id` | Unikalny identyfikator, używany w poleceniach i regułach |
| `generates` | Nazwa pliku wyjściowego (obsługuje wzorce takie jak `specs/**/*.md`) |
| `template` | Plik szablonu w katalogu `templates/` |
| `instruction` | Instrukcje AI dla tworzenia tego artefaktu |
| `requires` | Zależności - które artefakty muszą istnieć wcześniej |

### Szablony

Szablony to pliki markdown, które prowadzą AI. Są wstrzykiwane do promptu podczas tworzenia danego artefaktu.

```markdown
<!-- templates/proposal.md -->
## Dlaczego

<!-- Wyjaśnij motywację tej zmiany. Jaki problem rozwiązuje? -->

## Co się zmienia

<!-- Opisz, co się zmieni. Bądź konkretny w kwestii nowych możliwości lub modyfikacji. -->

## Wpływy

<!-- Dotknięty kod, API, zależności, systemy -->
```

Szablony mogą zawierać:
- Nagłówki sekcji, które AI powinno wypełnić
- Komentarze HTML z wskazówkami dla AI
- Przykłady formatów pokazujące oczekiwaną strukturę

### Walidacja schematu

Przed użyciem niestandardowego schematu sprawdź jego poprawność:

```bash
openspec schema validate my-workflow
```

Sprawdza to:
- Poprawność składni `schema.yaml`
- Istnienie wszystkich odwołanych szablonów
- Brak zależności cyklicznych
- Poprawność identyfikatorów artefaktów

### Używanie niestandardowego schematu

Po utworzeniu używaj swojego schematu za pomocą:

```bash
# Określ w poleceniu
openspec new change feature --schema my-workflow

# Lub ustaw jako domyślny w config.yaml
schema: my-workflow
```

### Debugowanie rozwiązywania schematów

Nie jesteś pewien, który schemat jest używany? Sprawdź za pomocą:

```bash
# Zobacz, skąd rozwiązuje się konkretny schemat
openspec schema which my-workflow

# Wylistuj wszystkie dostępne schematy
openspec schema which --all
```

Wyjście pokazuje, czy pochodzi z Twojego projektu, katalogu użytkownika czy pakietu:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Uwaga:** OpenSpec obsługuje również schematy na poziomie użytkownika w `~/.local/share/openspec/schemas/` do udostępniania między projektami, ale zaleca się schematy na poziomie projektu w `openspec/schemas/`, ponieważ są kontrolowane wersjami razem z kodem.

---

## Przykłady

### Przepływ pracy szybkiej iteracji

Minimalny przepływ pracy do szybkich iteracji:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Szybka iteracja z minimalnym narzutem

artifacts:
  - id: proposal
    generates: proposal.md
    description: Szybka propozycja
    template: proposal.md
    instruction: |
      Utwórz zwięzłą propozycję tej zmiany.
      Skup się na tym i dlaczego, pomijając szczegółowe specyfikacje.
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

### Dodawanie artefaktu recenzji

Rozwiń domyślny schemat i dodaj krok recenzji:

```bash
openspec schema fork spec-driven with-review
```

Następnie edytuj `schema.yaml`, aby dodać:

```yaml
  - id: review
    generates: review.md
    description: Lista kontrolna recenzji przed implementacją
    template: review.md
    instruction: |
      Utwórz listę kontrolną recenzji na podstawie projektu.
      Uwzględnij kwestie bezpieczeństwa, wydajności i testowania.
    requires:
      - design

  - id: tasks
    # ... istniejąca konfiguracja zadań ...
    requires:
      - specs
      - design
      - review    # Teraz zadania wymagają również recenzji
```

---

## Zobacz również

- [Referencja CLI: Polecenia schematów](cli.md#schema-commands) - Pełna dokumentacja poleceń