# Koncepty

Ten przewodnik wyjaśnia kluczowe idee stojące za OpenSpec oraz sposób ich powiązania. W celu praktycznego wykorzystania, zapoznaj się z sekcją [Pierwsze kroki](getting-started.md) oraz [Przepływy pracy](workflows.md).

## Filozofia

OpenSpec opiera się na czterech zasadach:

```
płynne a nie sztywne         — bez bramek fazowych, praca nad tym, co ma sens
iteracyjne a nie kaskadowe   — nauka w trakcie budowania, udoskonalanie w drodze
proste a nie złożone         — lekka konfiguracja, minimalna ceremonia
priorytet dla istniejących   — działa z istniejącymi bazami kodu, nie tylko dla nowych projektów
projektów (brownfield-first)
```

### Dlaczego te zasady są ważne

**Płynne a nie sztywne.** Tradycyjne systemy specyfikacji blokują w fazach: najpierw planujesz, potem implementujesz, a na końcu masz gotowy produkt. OpenSpec jest bardziej elastyczny — możesz tworzyć artefakty w dowolnej kolejności, która ma sens dla Twojej pracy.

**Iteracyjne a nie kaskadowe.** Wymagania się zmieniają. Zrozumienie pogłębia się. To, co na początku wydawało się dobrym podejściem, może nie przetrwać po poznaniu istniejącego kodu. OpenSpec akceptuje tę rzeczywistość.

**Proste a nie złożone.** Niektóre ramy specyfikacji wymagają rozbudowanej konfiguracji, sztywnych formatów lub procesów o dużej wadze. OpenSpec nie przeszkadza. Inicjalizacja w sekundy, natychmiastowe rozpoczęcie pracy, dostosowanie tylko w razie potrzeby.

**Priorytet dla istniejących projektów (brownfield-first).** Większość pracy programistycznej to nie tworzenie od zera — to modyfikowanie istniejących systemów. Podejście oparte na delcie ułatwia w OpenSpec precyzyjne definiowanie zmian w istniejącym zachowaniu, a nie tylko opisywanie nowych systemów.

## Pełny obraz

OpenSpec organizuje Twoją pracę w dwóch głównych obszarach:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Źródło prawdy      │◄─────│  Proponowane modyfikacje      │   │
│   │  Jak Twój system    │ merguj│  Każda zmiana = jeden folder  │   │
│   │  aktualnie działa   │      │  Zawiera artefakty + delty    │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specyfikacje** (Specs) są źródłem prawdy — opisują, jak Twój system aktualnie się zachowuje.

**Zmiany** (Changes) to proponowane modyfikacje — przebywają w oddzielnych folderach, dopóki nie będziesz gotowy je połączyć.

To rozdzielenie jest kluczowe. Możesz pracować nad wieloma zmianami równolegle, bez konfliktów. Możesz przeglądać zmianę, zanim wpłynie na główne specyfikacje. A kiedy archiwizujesz zmianę, jej delty czysto łączą się ze źródłem prawdy.

## Obszary robocze koordynacji (Coordination Workspaces)

Wsparcie dla obszarów roboczych jest w wersji beta. Poniższy model lokalnego widoku jest obecnym kierunkiem, ale zewnętrzna automatyzacja, integracje i długotrwałe przepływy pracy powinny wciąż traktować zachowanie poleceń, pliki stanu i wyjście JSON jako ewoluujące.

Poniższe polecenia zapewniają pierwszy przepływ konfiguracji do otwierania lokalnych widoków nad powiązanymi repozytoriami lub folderami.

Projekty OpenSpec lokalne dla repozytorium są właściwym domyślnym ustawieniem, gdy jedno repozytorium posiada przepływ planowania, implementacji i archiwizacji. Niektóre prace obejmują kilka repozytoriów lub folderów. W takim przypadku obszar roboczy koordynacji OpenSpec to widok lokalny dla maszyny, który przechowuje powiązane ścieżki, stan openera i konfigurację agenta razem.

Model mentalny obszaru roboczego to:

```text
workspace     = prywatny lokalny widok nad magazynami kontekstu, inicjatywami, repozytoriami i folderami
context store = trwały kontener współdzielonego kontekstu
initiative    = trwały kontekst koordynacji wewnątrz magazynu kontekstu
link          = stabilna nazwa repozytorium lub folderu, które obszar roboczy może rozwiązać lokalnie
change        = jeden zaplanowany kawałek pracy; implementacja należy do repozytorium, które ją posiada
```

Obszar roboczy ma inny kształt niż projekt lokalny dla repozytorium:

```text
getGlobalDataDir()/workspaces/<workspace-name>/
├── workspace.yaml                 # Prywatny rekord lokalnego widoku
├── AGENTS.md                      # Wygenerowane wytyczne dla środowiska uruchomieniowego
└── <workspace-name>.code-workspace # Wygenerowany plik obszaru roboczego edytora
```

Stan OpenSpec lokalny dla repozytorium zachowuje istniejący kształt:

```text
repo-root/
└── openspec/
    ├── specs/
    └── changes/
```

To rozróżnienie ma znaczenie. Folder obszaru roboczego to lokalna powierzchnia koordynacji do otwierania i inspekcji powiązanych repozytoriów lub folderów. Katalog `openspec/` każdego repozytorium pozostaje domem dla specyfikacji posiadanych przez repo, zmian lokalnych dla repo i planowania implementacji. Użytkownicy nie muszą uruchamiać lokalnego dla repo `openspec init` wewnątrz folderu obszaru roboczego.

Stabilne nazwy powiązań to sposób, w jaki obszar roboczy odnosi się do repozytoriów i folderów. Prywatny rekord obszaru roboczego przechowuje nazwy takie jak `api`, `web` lub `checkout` i mapuje je na lokalne ścieżki tego środowiska uruchomieniowego.

```yaml
# workspace.yaml
version: 1
name: platform
context: null
links:
  api: /repos/api
  web: /repos/web
```

Gdy obszar roboczy otwiera inicjatywę, `context` zapisuje wybrane powiązanie magazynu kontekstu i identyfikator inicjatywy. Magazyny wybrane z rejestru pozostają przenośne po identyfikatorze; magazyny wybrane ze ścieżki celowo zachowują ścieżkę lokalną dla środowiska uruchomieniowego, ponieważ `workspace.yaml` jest prywatnym stanem lokalnym.

```yaml
context:
  kind: initiative
  store:
    id: platform
    selector:
      kind: registry
      id: platform
  initiative:
    id: billing-launch
```

Powiązane ścieżki mogą być pełnymi repozytoriami, folderami wewnątrz dużego monorepo lub innymi istniejącymi folderami. Nie potrzebują lokalnego dla repo stanu `openspec/`, zanim będą mogły uczestniczyć w planowaniu obszaru roboczego. Późniejsza implementacja, weryfikacja lub archiwizacja mogą wymagać większej gotowości repo, ale widoczność planowania zaczyna się od powiązania.

```text
multi-repo:
  api      -> /repos/api
  web      -> /repos/web

large monorepo:
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

Zarządzane obszary robocze znajdują się pod standardowym katalogiem danych OpenSpec:

```text
getGlobalDataDir()/workspaces
```

Oznacza to `$XDG_DATA_HOME/openspec/workspaces`, gdy `XDG_DATA_HOME` jest ustawiony, `~/.local/share/openspec/workspaces` w przypadku fallbacku na stylu uniksowym i `%LOCALAPPDATA%\openspec\workspaces` w przypadku natywnego fallbacku Windows. Natywne powłoki Windows, PowerShell i WSL2 każda przechowują łańcuchy ścieżek dla środowiska uruchomieniowego uruchamiającego OpenSpec. Ta podstawa nie tłumaczy się między `D:\repo`, `/mnt/d/repo` i ścieżkami UNC WSL.

OpenSpec wciąż może odczytywać starsze korzenie obszaru roboczego beta jako dane wejściowe kompatybilności, ale zarządzane obszary robocze używają teraz powyższego rekordu korzenia `workspace.yaml`. Folder obszaru roboczego pozostaje autorytatywny dla własnego prywatnego lokalnego widoku.

Widoczność obszaru roboczego nie jest zobowiązaniem do zmiany. Skonfiguruj obszar roboczy, gdy OpenSpec powinien wiedzieć, które repozytoria lub foldery są istotne; utwórz zmianę później, gdy będziesz gotowy zaplanować funkcję, poprawkę, projekt lub inny kawałek pracy.

Przydatne polecenia:

```bash
# Konfiguracja z przewodnikiem
openspec workspace setup

# Konfiguracja przyjazna automatyzacji
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli

# Zobacz znane obszary robocze z lokalnego rejestru
openspec workspace list
openspec workspace ls

# Dodaj lub napraw powiązania dla wybranego obszaru roboczego
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Sprawdź, co ta maszyna może rozwiązać
openspec workspace doctor
openspec workspace doctor --workspace platform

# Odśwież lokalne wytyczne obszaru roboczego i umiejętności agenta
openspec workspace update
openspec workspace update --workspace platform --tools codex,claude

# Otwórz powiązany zestaw roboczy
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor

# Otwórz inicjatywę jako lokalny widok obszaru roboczego
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative billing-launch --store-path /repos/platform-context
```

`workspace setup` zawsze tworzy obszar roboczy w standardowej lokalizacji obszaru roboczego, rejestruje go w lokalnym rejestrze, pokazuje lokalizację obszaru roboczego i wymaga co najmniej jednego powiązanego repozytorium lub folderu. Konfiguracja interaktywna pyta o preferowany opener i może zainstalować umiejętności OpenSpec dla wybranych agentów. Konfiguracja nieinteraktywna przechowuje opener tylko wtedy, gdy podano `--opener codex-cli`, `--opener claude`, `--opener github-copilot` lub `--opener editor`.

Umiejętności obszaru roboczego są instalowane tylko w korzeniu obszaru roboczego. Aktywny globalny profil wybiera, które umiejętności przepływu pracy są generowane; `--tools` wybiera, którzy agenci je otrzymują. Konfiguracja i aktualizacja obszaru roboczego nie tworzą plików poleceń ukośnikowych, nawet gdy globalna dostarczanie obejmuje polecenia. Uruchom `openspec workspace update`, aby odświeżyć lokalne wytyczne obszaru roboczego i dodać, odświeżyć lub usunąć zarządzane lokalne katalogi umiejętności obszaru roboczego bez edytowania powiązanych repozytoriów lub folderów.

OpenSpec utrzymuje również pliki otwierania korzenia obszaru roboczego: blok wytycznych zarządzany przez OpenSpec w `AGENTS.md` i lokalny dla maszyny plik `<workspace-name>.code-workspace` dla otwarć VS Code i GitHub Copilot-in-VS-Code. Zarządzany obszar roboczy nie jest repo, więc OpenSpec nie tworzy domyślnego `.gitignore` obszaru roboczego ani domyślnego katalogu `changes/` na poziomie obszaru roboczego.

Utrzymywany obszar roboczy VS Code najpierw列出 poprawne powiązane repozytoria lub foldery, następnie kontekst inicjatywy, gdy jest dołączony, a na końcu pliki obszaru roboczego OpenSpec. VS Code wyświetla te wpisy jako obszar roboczy z wieloma korzeniami.

`workspace open` otwiera powiązany zestaw roboczy z zapisanym preferowanym openerem, chyba że podano `--agent <tool>` lub `--editor` dla tej jednej sesji. Podanie obu nadpisań openera jest błędem. Otwieranie korzenia obszaru roboczego czyni powiązane repozytoria i foldery widocznymi do eksploracji i kontekstu; implementacja rozpoczyna się po tym, jak użytkownik wyraźnie poprosi o pracę implementacyjną.

`workspace link` i `workspace relink` rejestrują tylko istniejące foldery; nie tworzą, nie kopiują, nie przenoszą, nie inicjalizują ani nie edytują powiązanego repozytorium lub folderu. Po pomyślnym powiązaniu lub ponownym powiązaniu OpenSpec odświeża zarządzane wytyczne i plik obszaru roboczego VS Code.

Polecenia obszaru roboczego, które potrzebują jednego obszaru roboczego, mogą być uruchamiane z dowolnego miejsca z `--workspace <name>`. Jeśli uruchomisz je wewnątrz folderu obszaru roboczego lub podkatalogu, OpenSpec używa tego bieżącego obszaru roboczego. Jeśli dostępnych jest kilka znanych obszarów roboczych i nie podasz `--workspace <name>`, polecenia dla ludzi pokazują selektor; `--json` i `--no-interactive` kończą się błędem ze strukturalnym statusem zamiast monitowania.

Bezpośrednie polecenia obszaru roboczego obsługują wyjście JSON dla skryptów. Odpowiedzi JSON przechowują podstawowe dane w obiektach `workspace`, `workspaces` lub `link` i zgłaszają ostrzeżenia lub błędy w tablicach `status`. Zdrowe obiekty używają `status: []`.

## Specyfikacje (Specs)

Specyfikacje opisują zachowanie Twojego systemu za pomocą strukturyzowanych wymagań i scenariuszy.

### Struktura

```
openspec/specs/
├── auth/
│   └── spec.md           # Zachowanie uwierzytelniania
├── payments/
│   └── spec.md           # Przetwarzanie płatności
├── notifications/
│   └── spec.md           # System powiadomień
└── ui/
    └── spec.md           # Zachowanie interfejsu użytkownika i motywy
```

Organizuj specyfikacje według domen — logiczne grupowania, które mają sens dla Twojego systemu. Typowe wzorce:

- **Według obszaru funkcjonalnego**: `auth/`, `payments/`, `search/`
- **Według komponentu**: `api/`, `frontend/`, `workers/`
- **Według ograniczonego kontekstu**: `ordering/`, `fulfillment/`, `inventory/`

### Format specyfikacji

Specyfikacja zawiera wymagania, a każde wymaganie ma scenariusze:

```markdown
# Specyfikacja uwierzytelniania

## Cel
Uwierzytelnianie i zarządzanie sesjami dla aplikacji.

## Wymagania

### Wymaganie: Uwierzytelnianie użytkownika
System MUSI wydać token JWT po pomyślnym logowaniu.

#### Scenariusz: Poprawne poświadczenia
- DANY użytkownik z poprawnymi poświadczeniami
- GDY użytkownik przesyła formularz logowania
- WTEDY zwracany jest token JWT
- ORAZ użytkownik jest przekierowany do pulpitu nawigacyjnego

#### Scenariusz: Niepoprawne poświadczenia
- DANE niepoprawne poświadczenia
- GDY użytkownik przesyła formularz logowania
- WTEDY wyświetlany jest komunikat o błędzie
- ORAZ nie jest wydawany żaden token

### Wymaganie: Wygasanie sesji
System MUSI unieważniać sesje po 30 minutach bezczynności.

#### Scenariusz: Limit czasu bezczynności
- DANA uwierzytelniona sesja
- GDY minie 30 minut bez aktywności
- WTEDY sesja jest unieważniana
- ORAZ użytkownik musi się ponownie uwierzytelnić
```

**Kluczowe elementy:**

| Element | Cel |
|---------|-----|
| `## Cel` | Opis na wysokim poziomie domeny tej specyfikacji |
| `### Wymaganie:` | Konkretne zachowanie, które system musi mieć |
| `#### Scenariusz:` | Konkretny przykład wymagania w działaniu |
| MUSI/POWINIEN/ MOŻE | Słowa kluczowe RFC 2119 wskazujące siłę wymagania |

### Dlaczego strukturyzować specyfikacje w ten sposób

**Wymagania to „co"** — określają, co system powinien robić, bez określania implementacji.

**Scenariusze to „kiedy"** — dostarczają konkretne przykłady, które można zweryfikować. Dobre scenariusze:
- Są testowalne (mógłbyś napisać dla nich automatyczny test)
- Obejmują zarówno ścieżkę szczęśliwą, jak i przypadki brzegowe
- Używają formatu Given/When/Then lub podobnego strukturalnego formatu

**Słowa kluczowe RFC 2119** (MUSI, POWINIEN, MOŻE) komunikują intencję:
- **MUSI** — bezwzględne wymaganie
- **POWINIEN** — zalecany, ale istnieją wyjątki
- **MOŻE** — opcjonalny

### Czym specyfikacja jest (a czym nie jest)

Specyfikacja to **umowa zachowania**, a nie plan implementacji.

Dobra treść specyfikacji:
- Obserwowalne zachowanie, na którym polegają użytkownicy lub systemy nadrzędne
- Wejścia, wyjścia i warunki błędów
- Ograniczenia zewnętrzne (bezpieczeństwo, prywatność, niezawodność, kompatybilność)
- Scenariusze, które można przetestować lub wyraźnie zwalidować

Czego unikać w specyfikacjach:
- Wewnętrzne nazwy klas/funkcji
- Wybory bibliotek lub frameworków
- Szczegółowe kroki implementacji
- Szczegółowe plany wykonania (należą do `design.md` lub `tasks.md`)

Szybki test:
- Jeśli implementacja może się zmienić bez zmiany widocznego zewnętrznego zachowania, prawdopodobnie nie należy do specyfikacji.

### Zachowaj lekkość: Progresywna rygoryzacja

OpenSpec ma na celu unikanie biurokracji. Używaj najlżejszego poziomu, który wciąż czyni zmianę weryfikowalną.

**Lekka specyfikacja (domyślna):**
- Krótkie wymagania zorientowane na zachowanie
- Jasny zakres i cele nie-będące celem
- Kilka konkretnych kontroli akceptacji

**Pełna specyfikacja (dla wyższego ryzyka):**
- Zmiany międzyzespołowe lub między repozytoriami
- Zmiany API/umów, migracje, obawy dotyczące bezpieczeństwa/prywatności
- Zmiany, w których niejasność prawdopodobnie spowoduje kosztowne przerobienie

Większość zmian powinna pozostać w trybie lekkim.

### Współpraca człowiek + agent

W wielu zespołach ludzie eksplorują, a agenci tworzą szkice artefaktów. Zamierzona pętla to:

1. Człowiek dostarcza intencję, kontekst i ograniczenia.
2. Agent przekształca to w wymagania zorientowane na zachowanie i scenariusze.
3. Agent trzyma szczegóły implementacji w `design.md` i `tasks.md`, nie w `spec.md`.
4. Walidacja potwierdza strukturę i jasność przed implementacją.

To sprawia, że specyfikacje są czytelne dla ludzi i spójne dla agentów.

## Zmiany

Zmiana to proponowana modyfikacja Twojego systemu, zapakowana jako folder zawierający wszystko, co potrzebne do jej zrozumienia i wdrożenia.

### Struktura Zmiany

```
openspec/changes/add-dark-mode/
├── proposal.md           # Why and what
├── design.md             # How (technical approach)
├── tasks.md              # Implementation checklist
├── .openspec.yaml        # Change metadata (optional)
└── specs/                # Delta specs
    └── ui/
        └── spec.md       # What's changing in ui/spec.md
```

Każda zmiana jest samodzielnym elementem. Zawiera:
- **Artefakty** — dokumenty przechwytujące intencję, projekt i zadania
- **Specyfikacje delta** — specyfikacje określające, co jest dodawane, modyfikowane lub usuwane
- **Metadane** — opcjonalna konfiguracja dla danej zmiany

### Dlaczego Zmiany są Folderami

Pakowanie zmiany jako folder ma kilka zalet:

1. **Wszystko w jednym miejscu.** Propozycja, projekt, zadania i specyfikacje znajdują się w jednym miejscu. Nie trzeba szukać w różnych lokalizacjach.

2. **Praca równoległa.** Wiele zmian może istnieć jednocześnie bez konfliktów. Możesz pracować nad `add-dark-mode`, podczas gdy `fix-auth-bug` również jest w trakcie realizacji.

3. **Czytelna historia.** Po zarchiwizowaniu zmiany przenoszą się do `changes/archive/` wraz z zachowanym pełnym kontekstem. Możesz cofnąć się i zrozumieć nie tylko co się zmieniło, ale dlaczego.

4. **Łatwość przeglądu.** Folder zmiany jest łatwy do przejrzenia — otwierasz go, czytasz propozycję, sprawdzasz projekt, widzisz zmiany w specyfikacji.

## Artefakty

Artefakty to dokumenty w ramach zmiany, które prowadzą prace.

### Przepływ Artefaktów

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Artefakty budują się na sobie. Każdy artefakt dostarcza kontekst dla następnego.

### Typy Artefaktów

#### Propozycja (`proposal.md`)

Propozycja przechwytuje na wysokim poziomie **intencję**, **zakres** i **podejście**.

```markdown
# Proposal: Add Dark Mode
```

## Cel
Użytkownicy żądali opcji trybu ciemnego, aby zmniejszyć zmęczenie oczu
podczas nocnego użytkowania i dopasować się do preferencji systemowych.

## Zakres
W zakresie:
- Przełączanie motywu w ustawieniach
- Wykrywanie preferencji systemowych
- Zapisywanie preferencji w localStorage

Poza zakresem:
- Niestandardowe motywy kolorów (przyszła praca)
- Nadpisywanie motywu na poszczególnych stronach

## Podejście
Użyj niestandardowych właściwości CSS do stylowania z użyciem kontekstu React
do zarządzania stanem. Wykryj preferencje systemowe przy pierwszym załadowaniu,
pozwól na ręczne nadpisanie.
```

**Kiedy aktualizować propozycję:**
- Zmiany zakresu (zawężenie lub rozszerzenie)
- Uściślenie celu (lepsze zrozumienie problemu)
- Fundamentalna zmiana podejścia

#### Specyfikacje (specyfikacje delta w `specs/`)

Specyfikacje delta opisują **co się zmienia** w odniesieniu do bieżących specyfikacji. Zobacz [Specyfikacje Delta](#specyfikacje-delta) poniżej.

#### Projekt (`design.md`)

Projekt zawiera **podejście techniczne** i **decyzje architektoniczne**.

````markdown
# Projekt: Dodanie trybu ciemnego

## Podejście techniczne
Stan motywu zarządzany przez kontekst React, aby uniknąć przekazywania właściwości w dół (prop drilling).
Niestandardowe właściwości CSS umożliwiają przełączanie w czasie rzeczywistym bez przełączania klas.

## Decyzje architektoniczne

### Decyzja: Context zamiast Redux
Użycie kontekstu React dla stanu motywu, ponieważ:
- Prosty stan binarny (jasny/ciemny)
- Brak złożonych przejść stanu
- Unikanie dodawania zależności Redux

### Decyzja: Niestandardowe właściwości CSS
Użycie zmiennych CSS zamiast CSS-in-JS, ponieważ:
- Działa z istniejącym arkuszem stylów
- Brak narzutu w czasie wykonywania
- Natywne rozwiązanie przeglądarkowe

## Przepływ danych
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## Zmiany plików
- `src/contexts/ThemeContext.tsx` (nowy)
- `src/components/ThemeToggle.tsx` (nowy)
- `src/styles/globals.css` (zmodyfikowany)
````

**Kiedy aktualizować projekt:**
- Implementacja ujawnia, że podejście nie zadziała
- Odkryto lepsze rozwiązanie
- Zmieniają się zależności lub ograniczenia

#### Zadania (`tasks.md`)

Zadania to **lista kontrolna implementacji** — konkretne kroki z polami wyboru.

```markdown
# Zadania

## 1. Infrastruktura motywu
- [ ] 1.1 Utworzyć ThemeContext ze stanem jasny/ciemny
- [ ] 1.2 Dodać niestandardowe właściwości CSS dla kolorów
- [ ] 1.3 Zaimplementować trwałość localStorage
- [ ] 1.4 Dodać wykrywanie preferencji systemowych

## 2. Komponenty UI
- [ ] 2.1 Utworzyć komponent ThemeToggle
- [ ] 2.2 Dodać przełącznik na stronę ustawień
- [ ] 2.3 Zaktualizować Header, aby zawierał szybki przełącznik

## 3. Stylizacja
- [ ] 3.1 Zdefiniować paletę kolorów ciemnego motywu
- [ ] 3.2 Zaktualizować komponenty do używania zmiennych CSS
- [ ] 3.3 Przetestować kontrast w celu zapewnienia dostępności
```

**Najlepsze praktyki zadań:**
- Grupuj powiązane zadania pod nagłówkami
- Używaj hierarchicznej numeracji (1.1, 1.2, itp.)
- Utrzymuj zadania na tyle małe, aby ukończyć je w jednej sesji
- Odhaczaj zadania po ich ukończeniu

## Specyfikacje Delta

Specyfikacje delta to kluczowa koncepcja, która sprawia, że OpenSpec działa dla rozwoju typu brownfield. Opisują **co się zmienia**, zamiast powtarzać całą specyfikację.

### Format

```markdown
# Delta dla Auth

## DODANE Wymagania

### Wymaganie: Uwierzytelnianie dwuskładnikowe
System MUSI obsługiwać uwierzytelnianie dwuskładnikowe oparte na TOTP.

#### Scenariusz: Rejestracja 2FA
- GIVEN użytkownik bez włączonej 2FA
- WHEN użytkownik włącza 2FA w ustawieniach
- THEN wyświetlany jest kod QR do konfiguracji aplikacji uwierzytelniającej
- AND użytkownik musi zweryfikować kodem przed aktywacją

#### Scenariusz: Logowanie 2FA
- GIVEN użytkownik z włączoną 2FA
- WHEN użytkownik przesyła prawidłowe poświadczenia
- THEN prezentowane jest wyzwanie OTP
- AND logowanie kończy się dopiero po prawidłowym OTP

## ZMODYFIKOWANE Wymagania

### Wymaganie: Wygaszanie sesji
System MUSI wygasać sesje po 15 minutach bezczynności.
(Wcześniej: 30 minut)

#### Scenariusz: Przekroczenie limitu bezczynności
- GIVEN uwierzytelniona sesja
- WHEN minie 15 minut bez aktywności
- THEN sesja jest unieważniana

## USUNIĘTE Wymagania

### Wymaganie: Pamiętaj mnie
(Przestarzałe na rzecz 2FA. Użytkownicy powinni ponownie uwierzytelniać się przy każdej sesji.)
```

### Sekcje Delta

| Sekcja | Znaczenie | Co się dzieje przy archiwizacji |
|---------|---------|------------------------|
| `## DODANE Wymagania` | Nowe zachowanie | Dodane do głównej specyfikacji |
| `## ZMODYFIKOWANE Wymagania` | Zmienione zachowanie | Zastępuje istniejące wymaganie |
| `## USUNIĘTE Wymagania` | Przestarzałe zachowanie | Usunięte z głównej specyfikacji |

### Dlaczego delta zamiast pełnych specyfikacji

**Przejrzystość.** Delta pokazuje dokładnie, co się zmienia. Czytając pełną specyfikację, musiałbyś ją mentalnie porównać z bieżącą wersją.

**Unikanie konfliktów.** Dwie zmiany mogą dotyczyć tego samego pliku specyfikacji bez konfliktu, o ile modyfikują różne wymagania.

**Efektywność przeglądu.** Recenzenci widzą zmianę, a nie niezmieniony kontekst. Skupiają się na tym, co jest ważne.

**Dopasowanie do brownfield.** Większość pracy modyfikuje istniejące zachowanie. Delty czynią modyfikacje priorytetem, a nie przemyśleniem.

## Schemy

Schemy definiują typy artefaktów i ich zależności dla przepływu pracy.

### Jak działają schemy

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Brak zależności, można utworzyć jako pierwsze

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Wymaga propozycji przed utworzeniem

  - id: design
    generates: design.md
    requires: [proposal]      # Można utworzyć równolegle ze specyfikacjami

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Wymaga zarówno specyfikacji, jak i projektu
```

**Artefakty tworzą graf zależności:**

```
                    proposal
                   (węzeł główny)
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

**Zależności są enablerami, nie bramkami.** Pokazują, co jest możliwe do utworzenia, nie co musisz utworzyć następnie. Możesz pominąć projekt, jeśli go nie potrzebujesz. Możesz tworzyć specyfikacje przed lub po projekcie — oba zależą tylko od propozycji.

### Wbudowane schemy

**spec-driven** (domyślny)

Standardowy przepływ pracy dla rozwoju opartego na specyfikacjach:

```
proposal → specs → design → tasks → implement
```

Najlepsze dla: Większości pracy nad funkcjami, gdzie chcesz uzgodnić specyfikacje przed implementacją.

### Niestandardowe schemy

Utwórz niestandardowe schemy dla przepływu pracy Twojego zespołu:

```bash
# Utwórz od podstaw
openspec schema init research-first

# Lub rozwidlij istniejący
openspec schema fork spec-driven research-first
```

**Przykład niestandardowej schemy:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Najpierw badania

  - id: proposal
    generates: proposal.md
    requires: [research]   # Propozycja oparta na badaniach

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Pomiń specyfikacje/projekt, przejdź od razu do zadań
```

Pełne szczegóły dotyczące tworzenia i używania niestandardowych schem znajdują się w [Dostosowywanie](customization.md).

## Archiwizacja

Archiwizacja finalizuje zmianę, scalając jej specyfikacje delta z głównymi specyfikacjami i zachowując zmianę w historii.

### Co się dzieje podczas archiwizacji

```
Przed archiwizacją:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ scalenie
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Po archiwizacji:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Teraz zawiera wymagania 2FA
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Zachowane w historii
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Proces archiwizacji

1. **Scalanie delt.** Każda sekcja specyfikacji delta (DODANE/ZMODYFIKOWANE/USUNIĘTE) jest zastosowana do odpowiedniej głównej specyfikacji.

2. **Przeniesienie do archiwum.** Folder zmiany przenoszony jest do `changes/archive/` z prefiksem daty dla porządku chronologicznego.

3. **Zachowanie kontekstu.** Wszystkie artefakty pozostają nienaruszone w archiwum. Zawsze możesz cofnąć się, aby zrozumieć, dlaczego wprowadzono zmianę.

### Dlaczego archiwizacja ma znaczenie

**Czysty stan.** Aktywne zmiany (`changes/`) pokazują tylko pracę w toku. Ukończona praca wychodzi z drogi.

**Ścieżka audytu.** Archiwum zachowuje pełny kontekst każdej zmiany — nie tylko co się zmieniło, ale też propozycję wyjaśniającą dlaczego, projekt wyjaśniający jak i zadania pokazujące wykonaną pracę.

**Ewolucja specyfikacji.** Specyfikacje rosną organicznie w miarę archiwizacji zmian. Każde archiwum scala swoje delty, budując z czasem kompleksową specyfikację.

## Jak to wszystko się łączy

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (core) lub /opsx:new (expanded)          │
│   │     CHANGE     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREATE     │  /opsx:ff lub /opsx:continue (expanded workflow)        │
│   │     ARTIFACTS  │  Tworzy proposal → specs → design → tasks               │
│   │                │  (oparte na zależnościach schemy)                        │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENT  │  /opsx:apply                                            │
│   │     TASKS      │  Pracuj nad zadaniami, odhaczając je                    │
│   │                │◄──── Aktualizuj artefakty, gdy się uczysz                │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFY     │  /opsx:verify (opcjonalne)                              │
│   │     WORK       │  Sprawdź, czy implementacja odpowiada specyfikacjom    │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVE    │────►│  Specyfikacje delta scalane z głównymi       │    │
│   │     CHANGE     │     │  specyfikacjami                              │    │
│   └────────────────┘     │  Folder zmiany przenoszony do archiwum/     │    │
│                          │  Specyfikacje stają się teraz zaktualizowanym│    │
│                          │  źródłem prawdy                              │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Cykl cnoty:**

1. Specyfikacje opisują bieżące zachowanie
2. Zmiany proponują modyfikacje (jako delty)
3. Implementacja czyni zmiany realnymi
4. Archiwizacja scala delty w specyfikacje
5. Specyfikacje teraz opisują nowe zachowanie
6. Następna zmiana buduje na zaktualizowanych specyfikacjach

## Słownik pojęć

| Termin | Definicja |
|------|------------|
| **Artefakt** | Dokument w ramach zmiany (propozycja, projekt, zadania lub specyfikacje delta) |
| **Archiwizacja** | Proces finalizacji zmiany i scalenia jej delt z głównymi specyfikacjami |
| **Zmiana** | Proponowana modyfikacja systemu, spakowana jako folder z artefaktami |
| **Specyfikacja delta** | Specyfikacja opisująca zmiany (DODANE/ZMODYFIKOWANE/USUNIĘTE) w odniesieniu do bieżących specyfikacji |
| **Domena** | Logiczne pogrupowanie specyfikacji (np. `auth/`, `payments/`) |
| **Wymaganie** | Konkretne zachowanie, które system musi posiadać |
| **Scenariusz** | Konkretny przykład wymagania, zazwyczaj w formacie Given/When/Then |
| **Schemat** | Definicja typów artefaktów i ich zależności |
| **Specyfikacja** | Dokument opisujący zachowanie systemu, zawierający wymagania i scenariusze |
| **Źródło prawdy** | Katalog `openspec/specs/`, zawierający aktualnie uzgodnione zachowania |

## Następne kroki

- [Wprowadzenie](getting-started.md) - Praktyczne pierwsze kroki
- [Przepływy pracy](workflows.md) - Popularne wzorce i kiedy z nich korzystać
- [Polecenia](commands.md) - Pełny referencja poleceń
- [Dostosowywanie](customization.md) - Tworzenie niestandardowych schematów i konfigurowanie projektu