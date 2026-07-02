# Rozpoczęcie pracy

Ten przewodnik wyjaśnia, jak działa OpenSpec po jego zainstalowaniu i inicjalizacji. Instrukcje instalacji znajdziesz w [głównym pliku README](../index.md#quick-start) lub w [przewodniku instalacyjnym](installation.md). Nowy dla całego zestawu dokumentacji? [Strona główna dokumentacji](index.md) wszystko mapuje.

> **Gdzie wpisuję te komendy?** W dwóch miejscach, a mieszanie ich jest najczęstszym początkowym błędem.
>
> - Komendy `openspec ...` (takie jak `openspec init`) działają w Twoim **terminalu**.
> - Komendy `/opsx:...` (takie jak `/opsx:propose`) działają w **czacie Twojego asystenta AI**, w tym samym oknie, w którym prosiłbyś go o napisanie kodu.
>
> Nie ma oddzielnego „trybu interaktywnego” do rozpoczęcia. Po prostu wpisujesz komendę z ukośnikiem w czacie, a Twój asystent kontynuuje. Pełne wyjaśnienie: [Jak działają komendy](how-commands-work.md).

## Twoje pierwsze pięć minut

Cały cykl, z etykietą każdego kroku wskazującą miejsce jego wykonania:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (opcjonalnie: zastanów się najpierw)
AI CHAT      /opsx:propose add-dark-mode      (AI szkicuje plan; Ty go recenzujesz)
AI CHAT      /opsx:apply                      (AI to buduje)
AI CHAT      /opsx:archive                    (specyfikacje zaktualizowane, zmiana archiwizowana)
```

Dwa kroki w terminalu do konfiguracji, a potem pracujesz w czacie. Reszta tego przewodnika rozkłada na czynniki pierwsze, co robi każdy krok i co zobaczysz.

> **Nie wiesz jeszcze, co zbudować? Zacznij od `/opsx:explore`.** Jest to partner myślowy bez ryzyka, który czyta Twoją bazę kodu, waży opcje i dopracowuje niejasny pomysł w konkretny plan, zanim powstanie jakikolwiek artefakt lub kod. Gdy obraz jest jasny, przekazuje zadanie `/opsx:propose`. To najlepszy nawyk pracy z AI, które inaczej pewnie zbudowałoby coś złego. Sprawdź [przewodnik Explore](explore.md).

## Jak to działa

OpenSpec pomaga Tobie i Twojemu asystentowi kodującemu zgodzić się co do tego, co ma zostać zbudowane, zanim napisany zostanie jakikolwiek kod.

**Domyślna ścieżka szybkiego działania (profil core):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (opcjonalnie)
```

Rozpocznij od `/opsx:explore`, gdy zastanawiasz się, co robić, lub przejdź bezpośrednio do `/opsx:propose`, jeśli już wiesz. Explore jest w domyślnym profilu, więc zawsze jest dostępny, kiedy go potrzebujesz.

**Rozszerzona ścieżka (wybór niestandardowego przepływu pracy):**

```text
/opsx:new ──► /opsx:ff lub /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Domyślny globalny profil to `core`, który zawiera `propose`, `explore`, `apply`, `sync` i `archive`. Możesz włączyć rozszerzone komendy przepływu pracy za pomocą `openspec config profile`, a następnie `openspec update`.

## Co tworzy OpenSpec

Po uruchomieniu `openspec init` Twój projekt ma taką strukturę:

```
openspec/
├── specs/              # Źródło prawdy (zachowanie Twojego systemu)
│   └── <domain>/
│       └── spec.md
├── changes/            # Proponowane modyfikacje (jeden folder na zmianę)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Specyfikacje delta (co się zmienia)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Konfiguracja projektu (opcjonalnie)
```

**Dwa kluczowe katalogi:**

- **`specs/`** - Źródło prawdy. Te specyfikacje opisują, jak obecnie zachowuje się Twój system. Są zorganizowane według domeny (np. `specs/auth/`, `specs/payments/`).

- **`changes/`** - Proponowane modyfikacje. Każda zmiana otrzymuje własny folder ze wszystkimi powiązanymi artefaktami. Gdy zmiana jest zakończona, jej specyfikacje są łączone z głównym katalogiem `specs/`.

## Zrozumienie Artefaktów

Każdy folder zmiany zawiera artefakty, które kierują pracą:

| Artefakt | Cel |
|----------|---------|
| `proposal.md` | „Dlaczego” i „co” - uchwyca zamiar, zakres i podejście |
| `specs/` | Specyfikacje delta pokazujące wymagania DODANE/ZMIENIONE/USUNIĘTE |
| `design.md` | „Jak” - techniczne podejście i decyzje architektoniczne |
| `tasks.md` | Lista kontrolna implementacji z checkboxami |

**Artefakty budują się na sobie:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            aktualizuj w miarę nauki
```

Zawsze możesz wrócić i dopracować wcześniejsze artefakty, gdy więcej się dowiesz podczas implementacji.

## Jak działają Specyfikacje Delta

Specyfikacje delta są kluczowym konceptem w OpenSpec. Pokazują, co się zmienia w stosunku do Twoich obecnych specyfikacji.

### Format

Specyfikacje delta używają sekcji, aby wskazać typ zmiany:

```markdown
# Delta dla Auth

## Wymagania DODANE

### Wymaganie: Uwierzytelnianie dwuskładnikowe
System MUSI wymagać drugiego czynnika podczas logowania.

#### Scenariusz: wymagany OTP
- ZAŁOŻONO, że użytkownik ma włączone 2FA
- KIEDY użytkownik przesyła poprawne dane uwierzytelniające
- Wtedy prezentowany jest wyzwanie OTP

## Wymagania ZMIENIONE

### Wymaganie: Czas ważności sesji
System POWINIEN powinien unieważniać sesje po 30 minutach braku aktywności.
(Wcześniej: 60 minut)

#### Scenariusz: czas bezczynności
- ZAŁOŻONO, że istnieje uwierzytelniona sesja
- KIEDY mija 30 minut bez aktywności
- Wtedy sesja jest unieważniana

## Wymagania USUNIĘTE

### Wymaganie: Zapamiętaj mnie
(Przestarzałe na rzecz 2FA)
```

### Co się dzieje podczas archiwizacji

Kiedy archiwizujesz zmianę:

1. Wymagania **DODANE** są dołączane do głównej specyfikacji
2. Wymagania **ZMIENIONE** zastępują istniejącą wersję
3. Wymagania **USUNIĘTE** są usuwane z głównej specyfikacji

Folder zmiany jest przenoszony do `openspec/changes/archive/` w celu archiwizacji i historii audytu.

## Przykład: Twoja pierwsza zmiana

Przejdźmy przez dodawanie trybu ciemnego do aplikacji.

### 1. Rozpoczęcie zmiany (domyślne)

```text
Ty: /opsx:propose add-dark-mode

AI:  Utworzono openspec/changes/add-dark-mode/
     ✓ proposal.md — dlaczego to robimy, co się zmienia
     ✓ specs/       — wymagania i scenariusze
     ✓ design.md    — podejście techniczne
     ✓ tasks.md     — lista kontrolna implementacji
     Gotowe do implementacji!
```

Jeśli włączyłeś rozszerzony profil przepływu pracy, możesz to również zrobić jako dwa kroki: `/opsx:new`, a następnie `/opsx:ff` (lub `/opsx:continue` inkrementalnie).

### 2. Co zostało utworzone

**proposal.md** - Uchwyca zamiar:

```markdown
# Propozycja: Dodanie trybu ciemnego

## Zamiar
Użytkownicy poprosili o opcję trybu ciemnego, aby zmniejszyć zmęczenie oczu
podczas nocnego użytkowania.

## Zakres
- Dodaj przełącznik motywu w ustawieniach
- Obsługa wykrywania preferencji systemu
- Utrzymywanie preferencji w localStorage

## Podejście
Użycie niestandardowych właściwości CSS do tematyzacji z kontekstem React
do zarządzania stanem.
```

**specs/ui/spec.md** - Delta pokazująca nowe wymagania:

```markdown
# Delta dla UI

## Wymagania DODANE

### Wymaganie: Wybór motywu
System POWINIEN umożliwiać użytkownikom wybór między trybem jasnym a ciemnym.

#### Scenariusz: ręczne przełączanie
- ZAŁOŻONO, że użytkownik jest na dowolnej stronie
- KIEDY użytkownik klika przełącznik motywu
- Wtedy temat zmienia się natychmiast
- I preferencja jest utrzymywana między sesjami

#### Scenariusz: preferencja systemu
- ZAŁOŻONO, że użytkownik nie ma zapisanej preferencji
- KIEDY aplikacja się ładuje
- Wtedy używany jest preferowany schemat kolorów systemu
```

**tasks.md** - Lista kontrolna implementacji:

```markdown
# Zadania

## 1. Infrastruktura tematu
- [ ] 1.1 Stworzenie ThemeContext z jasnym/ciemnym stanem
- [ ] 1.2 Dodanie niestandardowych właściwości CSS dla kolorów
- [ ] 1.3 Implementacja trwałości localStorage

## 2. Komponenty UI
- [ ] 2.1 Utworzenie komponentu ThemeToggle
- [ ] 2.2 Dodanie przełącznika do strony ustawień
- [ ] 2.3 Aktualizacja nagłówka, aby zawierał szybkie przełączanie

## 3. Stylizacja
- [ ] 3.1 Definiowanie palety kolorów dla ciemnego motywu
- [ ] 3.2 Aktualizacja komponentów do używania zmiennych CSS
```

### 3. Implementacja

```
Ty: /opsx:apply

AI:  Pracuję nad zadaniami...
     ✓ 1.1 Stworzono ThemeContext z jasnym/ciemnym stanem
     ✓ 1.2 Dodano niestandardowe właściwości CSS do globals.css
     ✓ 1.3 Zaimplementowano trwałość localStorage
     ✓ 2.1 Utworzono komponent ThemeToggle
     ...
     Wszystkie zadania ukończone!
```

Podczas implementacji, jeśli odkryjesz, że projekt wymaga korekty, po prostu zaktualizuj artefakt i kontynuuj.

### 4. Archiwizacja

```
Ty: /opsx:archive

AI:  Archiwizowanie add-dark-mode...
     ✓ Połączono specyfikacje do openspec/specs/ui/spec.md
     ✓ Przeniesiono do openspec/changes/archive/2025-01-24-add-dark-mode/
     Gotowe! Czas na następną funkcję.
```

Twoje specyfikacje delta są teraz częścią głównych specyfikacji, dokumentując działanie Twojego systemu.

## Weryfikacja i recenzja

Użyj interfejsu CLI, aby sprawdzić swoje zmiany:

```bash
# Lista aktywnych zmian
openspec list

# Wyświetl szczegóły zmiany
openspec show add-dark-mode

# Waliduj format specyfikacji
openspec validate add-dark-mode

# Interaktywna tablica
openspec view
```

## Następne kroki

- [Explore First](explore.md) - Użyj `/opsx:explore`, aby zastanowić się nad pomysłem, zanim go zatwierdzisz
- [Using OpenSpec in an Existing Project](existing-projects.md) - Rozpocznij pracę na dużym kodzie brownfield
- [Editing & Iterating on a Change](editing-changes.md) - Aktualizuj artefakty, wracaj i ujednolicalne ręczne edycje
- [Core Concepts at a Glance](overview.md) - Cały model mentalny na jednej stronie
- [Examples & Recipes](examples.md) - Prawdziwe zmiany, od początku do końca
- [Workflows](workflows.md) - Typowe wzorce i kiedy używać każdej komendy
- [Commands](commands.md) - Pełne odniesienie dla wszystkich komend z ukośnikiem
- [Concepts](concepts.md) - Głębsze zrozumienie specyfikacji, zmian i schematów
- [Customization](customization.md) - Spraw, by OpenSpec działało zgodnie z Twoimi potrzebami
- [Stores](stores-beta/user-guide.md) - Planowanie, które wykracza poza repozytoria lub zespoły? Utrzymaj je w osobnym repo (beta)
- [FAQ](faq.md) i [Troubleshooting](troubleshooting.md) - Gdy utkniesz