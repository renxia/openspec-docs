# Pierwsze kroki

Ten przewodnik wyjaśnia, jak działa OpenSpec po jego zainstalowaniu i zainicjalizowaniu. Instrukcje instalacji znajdziesz w [głównym pliku README](index.md#quick-start).

## Jak to działa

OpenSpec pomaga Tobie i Twojemu asystentowi programującemu AI uzgodnić, co należy zbudować, zanim zostanie napisany jakikolwiek kod.

**Domyślna krótka ścieżka (profil podstawowy):**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:archive
```

**Rozszerzona ścieżka (niestandardowy wybór przepływu pracy):**

```text
/opsx:new ──► /opsx:ff lub /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Domyślnym globalnym profilem jest `core`, który obejmuje `propose`, `explore`, `apply` i `archive`. Możesz włączyć rozszerzone komendy przepływu pracy za pomocą `openspec config profile`, a następnie `openspec update`.

## Co tworzy OpenSpec

Po uruchomieniu `openspec init` Twój projekt ma następującą strukturę:

```
openspec/
├── specs/              # Prawda źródłowa (zachowanie Twojego systemu)
│   └── <domena>/
│       └── spec.md
├── changes/            # Proponowane zmiany (jeden folder na zmianę)
│   └── <nazwa-zmiany>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Specyfikacje delta (co się zmienia)
│           └── <domena>/
│               └── spec.md
└── config.yaml         # Konfiguracja projektu (opcjonalna)
```

**Dwa kluczowe katalogi:**

- **`specs/`** - Prawda źródłowa. Te specyfikacje opisują, jak Twój system obecnie się zachowuje. Są zorganizowane według domen (np. `specs/auth/`, `specs/payments/`).

- **`changes/`** - Proponowane modyfikacje. Każda zmiana otrzymuje własny folder ze wszystkimi powiązanymi artefaktami. Gdy zmiana jest kompletna, jej specyfikacje są scalane z głównym katalogiem `specs/`.

## Zrozumienie artefaktów

Każdy folder zmiany zawiera artefakty kierujące pracą:

| Artefakt | Cel |
|----------|-----|
| `proposal.md` | "Dlaczego" i "co" - uchwytuje intencję, zakres i podejście |
| `specs/` | Specyfikacje delta pokazujące wymagania DODANE/ZMODYFIKOWANE/USUNIĘTE |
| `design.md` | "Jak" - podejście techniczne i decyzje architektoniczne |
| `tasks.md` | Lista kontrolna implementacji z polami wyboru |

**Artefakty budują się na sobie nawzajem:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            aktualizuj w miarę zdobywania wiedzy
Zawsze możesz wrócić i dopracować wcześniejsze artefakty, gdy w trakcie implementacji zdobędziesz więcej informacji.
```

## Jak działają specyfikacje delta

Specyfikacje delta są kluczowym konceptem w OpenSpec. Pokazują, co się zmienia w stosunku do Twoich obecnych specyfikacji.

### Format

Specyfikacje delta używają sekcji, aby wskazać typ zmiany:

```markdown
# Delta dla Auth

## DODANE Wymagania

### Wymaganie: Uwierzytelnianie dwuskładnikowe
System MUSI wymagać drugiego składnika podczas logowania.

#### Scenariusz: Wymagany OTP
- ZAKŁADAJĄC użytkownika z włączonym 2FA
- GDY użytkownik przesyła prawidłowe dane logowania
- WTEDY prezentowane jest wyzwanie OTP

## ZMODYFIKOWANE Wymagania

### Wymaganie: Limit czasu sesji
System POWINIEN wygaszać sesje po 30 minutach nieaktywności.
(Wcześniej: 60 minut)

#### Scenariusz: Limit czasu bezczynności
- ZAKŁADAJĄC uwierzytelnioną sesję
- GDY mija 30 minut bez aktywności
- WTEDY sesja jest unieważniana

## USUNIĘTE Wymagania

### Wymaganie: Zapamiętaj mnie
(Przestarzałe na rzecz 2FA)
```

### Co się dzieje przy archiwizacji

Gdy archiwizujesz zmianę:

1. Wymagania **DODANE** są dołączane do głównej specyfikacji
2. Wymagania **ZMODYFIKOWANE** zastępują istniejącą wersję
3. Wymagania **USUNIĘTE** są usuwane z głównej specyfikacji

Folder zmiany jest przenoszony do `openspec/changes/archive/` w celu zachowania historii audytu.

## Przykład: Twoja pierwsza zmiana

Przejdźmy przez dodanie trybu ciemnego do aplikacji.

### 1. Rozpocznij zmianę (domyślnie)

```text
Ty: /opsx:propose add-dark-mode

AI:  Utworzono openspec/changes/add-dark-mode/
     ✓ proposal.md — dlaczego to robimy, co się zmienia
     ✓ specs/       — wymagania i scenariusze
     ✓ design.md    — podejście techniczne
     ✓ tasks.md     — lista kontrolna implementacji
     Gotowe do implementacji!
```

Jeśli włączyłeś rozszerzony profil przepływu pracy, możesz to również zrobić w dwóch krokach: `/opsx:new`, a następnie `/opsx:ff` (lub `/opsx:continue` stopniowo).

### 2. Co zostaje utworzone

**proposal.md** - Uchwytuje intencję:

```markdown
# Propozycja: Dodanie trybu ciemnego

## Intencja
Użytkownicy prosili o opcję trybu ciemnego, aby zmniejszyć zmęczenie oczu podczas nocnego korzystania.

## Zakres
- Dodanie przełącznika motywu w ustawieniach
- Obsługa wykrywania preferencji systemowych
- Trwałe zapisywanie preferencji w localStorage

## Podejście
Użycie niestandardowych właściwości CSS do motywów z kontekstem React do zarządzania stanem.
```

**specs/ui/spec.md** - Delta pokazująca nowe wymagania:

```markdown
# Delta dla UI

## DODANE Wymagania

### Wymaganie: Wybór motywu
System POWINIEN pozwalać użytkownikom na wybór między motywami jasnym i ciemnym.

#### Scenariusz: Ręczny przełącznik
- ZAKŁADAJĄC użytkownika na dowolnej stronie
- GDY użytkownik kliknie przełącznik motywu
- WTEDY motyw przełącza się natychmiast
- I preferencja jest zachowywana między sesjami

#### Scenariusz: Preferencja systemowa
- ZAKŁADAJĄC użytkownika bez zapisanej preferencji
- GDY aplikacja się uruchamia
- WTEDY używana jest preferowana kolorystyka systemu
```

**tasks.md** - Lista kontrolna implementacji:

```markdown
# Zadania

## 1. Infrastruktura motywów
- [ ] 1.1 Utworzenie ThemeContext ze stanem jasny/ciemny
- [ ] 1.2 Dodanie niestandardowych właściwości CSS dla kolorów
- [ ] 1.3 Implementacja trwałego zapisywania w localStorage

## 2. Komponenty UI
- [ ] 2.1 Utworzenie komponentu ThemeToggle
- [ ] 2.2 Dodanie przełącznika do strony ustawień
- [ ] 2.3 Aktualizacja Header, aby zawierał szybki przełącznik

## 3. Style
- [ ] 3.1 Zdefiniowanie palety kolorów motywu ciemnego
- [ ] 3.2 Aktualizacja komponentów, aby używały zmiennych CSS
```

### 3. Zaimplementuj

```
Ty: /opsx:apply

AI:  Pracuję nad zadaniami...
     ✓ 1.1 Utworzono ThemeContext ze stanem jasny/ciemny
     ✓ 1.2 Dodano niestandardowe właściwości CSS do globals.css
     ✓ 1.3 Zaimplementowano trwałe zapisywanie w localStorage
     ✓ 2.1 Utworzono komponent ThemeToggle
     ...
     Wszystkie zadania zakończone!
```

Podczas implementacji, jeśli odkryjesz, że projekt wymaga dostosowania, po prostu zaktualizuj artefakt i kontynuuj.

### 4. Archiwizuj

```
Ty: /opsx:archive

AI:  Archiwizuję add-dark-mode...
     ✓ Scalono specyfikacje do openspec/specs/ui/spec.md
     ✓ Przeniesiono do openspec/changes/archive/2025-01-24-add-dark-mode/
     Gotowe! Gotowy na następną funkcję.
```

Twoje specyfikacje delta są teraz częścią głównych specyfikacji, dokumentujących, jak działa Twój system.

## Weryfikacja i przeglądanie

Użyj CLI, aby sprawdzić swoje zmiany:

```bash
# Wylistuj aktywne zmiany
openspec list

# Wyświetl szczegóły zmiany
openspec show add-dark-mode

# Waliduj format specyfikacji
openspec validate add-dark-mode

# Interaktywny panel sterowania
openspec view
```

## Kolejne kroki

- [Przepływy pracy](workflows.md) - Popularne wzorce i kiedy używać każdej komendy
- [Komendy](commands.md) - Pełna referencja wszystkich komend ukośnika
- [Koncepty](concepts.md) - Głębsze zrozumienie specyfikacji, zmian i schematów
- [Dostosowywanie](customization.md) - Spraw, aby OpenSpec działał po Twojemu