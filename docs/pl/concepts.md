# Koncepcje

Ten przewodnik wyjaśnia kluczowe pomysły stojące za OpenSpec i sposób, w jaki się ze sobą łączą. Aby poznać praktyczne zastosowanie, zapoznaj się z sekcjami [Pierwsze kroki](getting-started.md) i [Przepływy pracy](workflows.md).

## Filozofia

OpenSpec opiera się na czterech zasadach:

```
płynność nie sztywność       — brak bramek fazowych, pracuj nad tym, co ma sens
iteracyjność nie kaskadowość — ucz się w trakcie budowania, udoskonalaj w miarę postępów
prostota nie złożoność       — lekka konfiguracja, minimalna ceremonia
pierwszeństwo istniejącego kodu — działa z istniejącymi bazami kodu, nie tylko z nowymi projektami
```

### Dlaczego te zasady są ważne

**Płynność nie sztywność.** Tradycyjne systemy specyfikacji zamykają Cię w fazach: najpierw planujesz, potem implementujesz, a potem kończysz. OpenSpec jest bardziej elastyczny — możesz tworzyć artefakty w dowolnej kolejności, która ma sens dla Twojej pracy.

**Iteracyjność nie kaskadowość.** Wymagania się zmieniają. Zrozumienie pogłębia. To, co na początku wydawało się dobrym podejściem, może nie przetrwać po zapoznaniu się z bazą kodu. OpenSpec akceptuje tę rzeczywistość.

**Prostota nie złożoność.** Niektóre ramy specyfikacji wymagają rozległej konfiguracji, sztywnych formatów lub ciężkich procesów. OpenSpec nie przeszkadza. Zainicjalizuj w kilka sekund, zacznij pracować natychmiast, dostosuj tylko wtedy, gdy tego potrzebujesz.

**Pierwszeństwo istniejącego kodu.** Większość pracy nad oprogramowaniem nie polega na tworzeniu od zera — to modyfikacja istniejących systemów. Podejście OpenSpec oparte na delcie ułatwia specyfikowanie zmian w istniejącym zachowaniu, a nie tylko opisywanie nowych systemów.

## Ogólny obraz

OpenSpec organizuje Twoją pracę w dwóch głównych obszarach:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Prawda źródłowa    │◄─────│  Proponowane modyfikacje      │   │
│   │  Jak Twój system    │ merge│  Każda zmiana = jeden folder  │   │
│   │  obecnie działa     │      │  Zawiera artefakty + delty    │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specyfikacje** są prawdą źródłową — opisują, jak Twój system obecnie się zachowuje.

**Zmiany** to proponowane modyfikacje — mieszkają w oddzielnych folderach, dopóki nie będziesz gotowy, aby je scalić.

To rozdzielenie jest kluczowe. Możesz pracować nad wieloma zmianami jednocześnie, bez konfliktów. Możesz przejrzeć zmianę, zanim wpłynie na główne specyfikacje. A kiedy archiwizujesz zmianę, jej delty scalają się czysto z prawdą źródłową.

## Specyfikacje

Specyfikacje opisują zachowanie Twojego systemu za pomocą uporządkowanych wymagań i scenariuszy.

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
    └── spec.md           # Zachowanie interfejsu i motywy
```

Organizuj specyfikacje według domen — logicznych grup, które mają sens dla Twojego systemu. Popularne wzorce:

- **Według obszaru funkcjonalnego**: `auth/`, `payments/`, `search/`
- **Według komponentu**: `api/`, `frontend/`, `workers/`
- **Według kontekstu ograniczonego**: `ordering/`, `fulfillment/`, `inventory/`

### Format specyfikacji

Specyfikacja zawiera wymagania, a każde wymaganie ma scenariusze:

```markdown
# Specyfikacja uwierzytelniania

## Cel
Uwierzytelnianie i zarządzanie sesjami dla aplikacji.

## Wymagania

### Wymaganie: Uwierzytelnianie użytkownika
System WYDA token JWT po pomyślnym zalogowaniu.

#### Scenariusz: Prawidłowe dane logowania
- GIVEN użytkownik z prawidłowymi danymi logowania
- WHEN użytkownik przesyła formularz logowania
- THEN zwracany jest token JWT
- AND użytkownik jest przekierowywany do panelu głównego

#### Scenariusz: Nieprawidłowe dane logowania
- GIVEN nieprawidłowe dane logowania
- WHEN użytkownik przesyła formularz logowania
- THEN wyświetlane jest komunikat o błędzie
- AND token nie jest wydawany

### Wymaganie: Wygaśnięcie sesji
System MUSI unieważniać sesje po 30 minutach nieaktywności.

#### Scenariusz: Przekroczenie czasu bezczynności
- GIVEN uwierzytelniona sesja
- WHEN mija 30 minut bez aktywności
- THEN sesja jest unieważniana
- AND użytkownik musi się ponownie uwierzytelnić
```

**Kluczowe elementy:**

| Element | Cel |
|---------|-----|
| `## Cel` | Opis na wysokim poziomie domeny tej specyfikacji |
| `### Wymaganie:` | Konkretne zachowanie, które system musi posiadać |
| `#### Scenariusz:` | Konkretny przykład wymagania w działaniu |
| SHALL/MUST/SHOULD | Kluczowe słowa z RFC 2119 wskazujące siłę wymagania |

### Dlaczego specyfikacje są ustrukturyzowane w ten sposób

**Wymagania to "co"** — określają, co system powinien robić, bez precyzowania implementacji.

**Scenariusze to "kiedy"** — dostarczają konkretne przykłady, które można zweryfikować. Dobre scenariusze:
- Są testowalne (można dla nich napisać testy automatyczne)
- Obejmują zarówno główną ścieżkę, jak i przypadki brzegowe
- Używają formatu GIVEN/WHEN/THEN lub podobnego uporządkowanego formatu

**Kluczowe słowa RFC 2119** (SHALL, MUST, SHOULD, MAY) komunikują intencję:
- **MUST/SHALL** — bezwzględne wymaganie
- **SHOULD** — zalecane, ale istnieją wyjątki
- **MAY** — opcjonalne

### Czym specyfikacja jest (a czym nie jest)

Specyfikacja to **kontrakt zachowania**, a nie plan implementacji.

Dobra zawartość specyfikacji:
- Obserwowalne zachowanie, na które polegają użytkownicy lub systemy downstream
- Dane wejściowe, wyjściowe i warunki błędu
- Zewnętrzne ograniczenia (bezpieczeństwo, prywatność, niezawodność, kompatybilność)
- Scenariusze, które można przetestować lub wyraźnie zweryfikować

Unikaj w specyfikacjach:
- Wewnętrznych nazw klas/funkcji
- Wyboru bibliotek lub frameworków
- Szczegółowych kroków implementacji
- Szczegółowych planów wykonania (te należą do `design.md` lub `tasks.md`)

Szybki test:
- Jeśli implementacja może się zmienić bez zmiany zewnętrznie widocznego zachowania, prawdopodobnie nie należy do specyfikacji.

### Zachowaj lekkość: Stopniowa rygorystyczność

OpenSpec ma na celu unikanie biurokracji. Używaj najlżejszego poziomu, który nadal czyni zmianę weryfikowalną.

**Lekka specyfikacja (domyślna):**
- Krótkie wymagania skupione na zachowaniu
- Jasny zakres i cele poza zakresem
- Kilka konkretnych punktów akceptacji

**Pełna specyfikacja (dla wyższego ryzyka):**
- Zmiany międzyzespołowe lub międzyrepozytorium
- Zmiany API/kontraktów, migracje, kwestie bezpieczeństwa/prywatności
- Zmiany, w których niejasność może prowadzić do kosztownych poprawek

Większość zmian powinna pozostać w trybie Lite.

### Współpraca człowieka i agenta

W wielu zespołach ludzie eksplorują, a agenci tworzą artefakty. Planowana pętla to:

1. Człowiek dostarcza intencję, kontekst i ograniczenia.
2. Agent przekształca to w wymagania skupione na zachowaniu i scenariusze.
3. Agent utrzymuje szczegóły implementacji w `design.md` i `tasks.md`, a nie w `spec.md`.
4. Walidacja potwierdza strukturę i przejrzystość przed implementacją.

Dzięki temu specyfikacje są czytelne dla ludzi i spójne dla agentów.

## Zmiany

Zmiana to proponowana modyfikacja Twojego systemu, zapakowana jako folder ze wszystkim, czego potrzeba, aby ją zrozumieć i wdrożyć.

### Struktura zmiany

```
openspec/changes/add-dark-mode/
├── proposal.md           # Dlaczego i co
├── design.md             # Jak (podejście techniczne)
├── tasks.md              # Lista kontrolna implementacji
├── .openspec.yaml        # Metadane zmiany (opcjonalne)
└── specs/                # Delty specyfikacji
    └── ui/
        └── spec.md       # Co zmienia się w ui/spec.md
```

Każda zmiana jest samodzielna. Zawiera:
- **Artefakty** — dokumenty uchwycające intencję, projekt i zadania
- **Delty specyfikacji** — specyfikacje tego, co jest dodawane, modyfikowane lub usuwane
- **Metadane** — opcjonalna konfiguracja dla tej konkretnej zmiany

### Dlaczego zmiany to foldery

Pakowanie zmiany jako folder ma kilka zalet:

1. **Wszystko razem.** Propozycja, projekt, zadania i specyfikacje mieszkają w jednym miejscu. Nie trzeba szukać w różnych lokalizacjach.

2. **Praca równoległa.** Wiele zmian może istnieć jednocześnie bez konfliktów. Pracuj nad `add-dark-mode`, podczas gdy `fix-auth-bug` również jest w toku.

3. **Czysta historia.** Po archiwizacji zmiany przenoszą się do `changes/archive/` z zachowanym pełnym kontekstem. Możesz cofnąć się i zrozumieć nie tylko co się zmieniło, ale dlaczego.

4. **Przyjazna do przeglądu.** Folder zmiany jest łatwy do przejrzenia — otwórz go, przeczytaj propozycję, sprawdź projekt, zobacz delty specyfikacji.

## Artefakty

Artefakty to dokumenty w ramach zmiany, które kierują pracą.

### Przepływ artefaktów

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   dlaczego        co            jak          kroki
 + zakres        zmiany       podejście     do podjęcia
```

Artefakty budują się na sobie nawzajem. Każdy artefakt dostarcza kontekstu dla następnego.

### Typy artefaktów

#### Propozycja (`proposal.md`)

Propozycja uchwyca **intencję**, **zakres** i **podejście** na wysokim poziomie.

```markdown
# Propozycja: Dodanie trybu ciemnego

## Intencja
Użytkownicy prosili o opcję trybu ciemnego, aby zmniejszyć zmęczenie oczu
podczas nocnego korzystania i dopasować do preferencji systemowych.

## Zakres
W zakresie:
- Przełącznik motywu w ustawieniach
- Wykrywanie preferencji systemowych
- Zachowywanie preferencji w localStorage

Poza zakresem:
- Niestandardowe motywy kolorów (praca na przyszłość)
- Nadpisywanie motywów dla poszczególnych stron

## Podejście
Użycie niestandardowych właściwości CSS do motywów z kontekstem React
do zarządzania stanem. Wykrywanie preferencji systemowych przy pierwszym załadowaniu,
umożliwienie ręcznego nadpisania.
```

**Kiedy aktualizować propozycję:**
- Zmiana zakresu (zawężenie lub rozszerzenie)
- Intencja się wyjaśnia (lepsze zrozumienie problemu)
- Podejście fundamentalnie się zmienia

#### Specyfikacje (delty specyfikacji w `specs/`)

Delty specyfikacji opisują **co się zmienia** w stosunku do bieżących specyfikacji. Zobacz [Delty specyfikacji](#delta-specs) poniżej.

#### Projekt (`design.md`)

Projekt uchwyca **podejście techniczne** i **decyzje architektoniczne**.

````markdown
# Projekt: Dodanie trybu ciemnego

## Podejście techniczne
Stan motywu zarządzany za pomocą React Context, aby uniknąć przekazywania propsów.
Niestandardowe właściwości CSS umożliwiają przełączanie w czasie wykonywania bez przełączania klas.

## Decyzje architektoniczne

### Decyzja: Kontekst zamiast Redux
Używamy React Context do stanu motywu, ponieważ:
- Prosty stan binarny (jasny/ciemny)
- Brak złożonych przejść stanów
- Unikamy dodawania zależności Redux

### Decyzja: Niestandardowe właściwości CSS
Używamy zmiennych CSS zamiast CSS-in-JS, ponieważ:
- Współpracuje z istniejącym arkuszem stylów
- Brak narzutu w czasie wykonywania
- Natywne rozwiązanie przeglądarki

## Przepływ danych
```
ThemeProvider (kontekst)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
Zmienne CSS (zastosowane do :root)
```

## Zmiany w plikach
- `src/contexts/ThemeContext.tsx` (nowy)
- `src/components/ThemeToggle.tsx` (nowy)
- `src/styles/globals.css` (zmodyfikowany)
````

**Kiedy aktualizować projekt:**
- Implementacja ujawnia, że podejście nie zadziała
- Odkryto lepsze rozwiązanie
- Zmieniają się zależności lub ograniczenia

#### Zadania (`tasks.md`)

Zadania to **lista kontrolna implementacji** — konkretne kroki z polami do zaznaczania.

```markdown
# Zadania

## 1. Infrastruktura motywów
- [ ] 1.1 Utworzyć ThemeContext ze stanem jasnym/ciemnym
- [ ] 1.2 Dodać niestandardowe właściwości CSS dla kolorów
- [ ] 1.3 Zaimplementować trwałość w localStorage
- [ ] 1.4 Dodać wykrywanie preferencji systemowych

## 2. Komponenty interfejsu użytkownika
- [ ] 2.1 Utworzyć komponent ThemeToggle
- [ ] 2.2 Dodać przełącznik do strony ustawień
- [ ] 2.3 Zaktualizować nagłówek, aby zawierał szybki przełącznik

## 3. Stylowanie
- [ ] 3.1 Zdefiniować paletę kolorów motywu ciemnego
- [ ] 3.2 Zaktualizować komponenty, aby używały zmiennych CSS
- [ ] 3.3 Przetestować współczynniki kontrastu pod kątem dostępności
```

**Najlepsze praktyki dotyczące zadań:**
- Grupuj powiązane zadania pod nagłówkami
- Używaj hierarchicznego numerowania (1.1, 1.2 itp.)
- Utrzymuj zadania wystarczająco małe, aby można je było ukończyć w jednej sesji
- Odhaczaj zadania po ich ukończeniu

## Specyfikacje Delta

Specyfikacje delta to kluczowa koncepcja, która sprawia, że OpenSpec działa w przypadku rozwoju w istniejących projektach (brownfield). Opisują **co się zmienia**, zamiast powtarzać całą specyfikację.

### Format

```markdown
# Delta dla Auth

## DODANE wymagania

### Wymaganie: Uwierzytelnianie dwuskładnikowe
System MUSI obsługiwać uwierzytelnianie dwuskładnikowe oparte na TOTP.

#### Scenariusz: Rejestracja 2FA
- ZAKŁADAJĄC użytkownika bez włączonego 2FA
- GDY użytkownik włącza 2FA w ustawieniach
- WTEDY wyświetlany jest kod QR do konfiguracji aplikacji uwierzytelniającej
- I użytkownik musi zweryfikować kod przed aktywacją

#### Scenariusz: Logowanie 2FA
- ZAKŁADAJĄC użytkownika z włączonym 2FA
- GDY użytkownik przesyła prawidłowe dane logowania
- WTEDY prezentowane jest wyzwanie OTP
- I logowanie kończy się dopiero po podaniu prawidłowego OTP

## ZMODYFIKOWANE wymagania

### Wymaganie: Wygaśnięcie sesji
System MUSI powodować wygaśnięcie sesji po 15 minutach nieaktywności.
(Wcześniej: 30 minut)

#### Scenariusz: Przekroczenie limitu bezczynności
- ZAKŁADAJĄC uwierzytelnioną sesję
- GDY mija 15 minut bez aktywności
- WTEDY sesja zostaje unieważniona

## USUNIĘTE wymagania

### Wymaganie: Zapamiętaj mnie
(Przestarzałe na rzecz 2FA. Użytkownicy powinni ponownie uwierzytelniać się w każdej sesji.)
```

### Sekcje Delta

| Sekcja | Znaczenie | Co się dzieje przy archiwizacji |
|---------|---------|------------------------|
| `## DODANE wymagania` | Nowe zachowanie | Dołączane do głównej specyfikacji |
| `## ZMODYFIKOWANE wymagania` | Zmienione zachowanie | Zastępuje istniejące wymaganie |
| `## USUNIĘTE wymagania` | Przestarzałe zachowanie | Usuwane z głównej specyfikacji |

### Dlaczego delty zamiast pełnych specyfikacji

**Jasność.** Delta pokazuje dokładnie, co się zmienia. Czytając pełną specyfikację, musiałbyś mentalnie porównywać ją z bieżącą wersją.

**Unikanie konfliktów.** Dwie zmiany mogą dotyczyć tego samego pliku specyfikacji bez konfliktów, o ile modyfikują różne wymagania.

**Wydajność przeglądu.** Recenzenci widzą zmianę, a nie niezmieniony kontekst. Skupiają się na tym, co istotne.

**Dopasowanie do istniejących projektów.** Większość pracy modyfikuje istniejące zachowanie. Delty stawiają modyfikacje w centrum, a nie traktują ich jako dodatek.

## Schemy

Schemy definiują typy artefaktów i ich zależności dla przepływu pracy.

### Jak działają schemy

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Brak zależności, można utworzyć jako pierwszy

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Wymaga proposal przed utworzeniem

  - id: design
    generates: design.md
    requires: [proposal]      # Można utworzyć równolegle ze specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Wymaga najpierw specs i design
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
   (wymaga:                  (wymaga:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (wymaga:
                specs, design)
```

**Zależności są ułatwieniami, nie bramkami.** Pokazują, co jest możliwe do utworzenia, a nie co musisz utworzyć w następnej kolejności. Możesz pominąć design, jeśli go nie potrzebujesz. Możesz utworzyć specs przed lub po designie — oba zależą tylko od proposal.

### Wbudowane schemy

**spec-driven** (domyślna)

Standardowy przepływ pracy dla rozwoju opartego na specyfikacjach:

```
proposal → specs → design → tasks → implement
```

Najlepsza dla: Większości prac nad funkcjonalnościami, gdzie chcesz uzgodnić specyfikacje przed implementacją.

### Niestandardowe schemy

Twórz niestandardowe schemy dla przepływu pracy swojego zespołu:

```bash
# Utwórz od zera
openspec schema init research-first

# Lub odgałęź istniejącą
openspec schema fork spec-driven research-first
```

**Przykład niestandardowej schemy:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Najpierw przeprowadź badania

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal oparty na badaniach

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Pomiń specs/design, przejdź od razu do zadań
```

Zobacz [Niestandardowe konfiguracje](customization.md), aby uzyskać szczegółowe informacje o tworzeniu i używaniu niestandardowych schem.

## Archiwizacja

Archiwizacja kończy zmianę, scalając jej specyfikacje delta z głównymi specyfikacjami i zachowując zmianę w historii.

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
        └── 2025-01-24-add-2fa/    # Zachowane dla historii
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Proces archiwizacji

1. **Scalanie delt.** Każda sekcja specyfikacji delta (DODANE/ZMODYFIKOWANE/USUNIĘTE) jest stosowana do odpowiedniej głównej specyfikacji.

2. **Przeniesienie do archiwum.** Folder ze zmianą przenosi się do `changes/archive/` z prefiksem daty dla zachowania porządku chronologicznego.

3. **Zachowanie kontekstu.** Wszystkie artefakty pozostają nienaruszone w archiwum. Zawsze możesz sięgnąć wstecz, aby zrozumieć, dlaczego dokonano zmiany.

### Dlaczego archiwizacja jest ważna

**Czysty stan.** Aktywne zmiany (`changes/`) pokazują tylko trwającą pracę. Ukończona praca zostaje usunięta z pola widzenia.

**Ślad audytowy.** Archiwum zachowuje pełen kontekst każdej zmiany — nie tylko to, co się zmieniło, ale także proposal wyjaśniający dlaczego, design wyjaśniający jak i zadania pokazujące wykonaną pracę.

**Ewolucja specyfikacji.** Specyfikacje rozwijają się organicznie w miarę archiwizowania zmian. Każda archiwizacja scala swoje delty, budując z czasem kompletną specyfikację.

## Jak to wszystko się łączy

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              PRZEPŁYW OPENSPEC                               │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. ROZPOCZNIJ │  /opsx:propose (podstawowy) lub /opsx:new (rozszerzony) │
│   │     ZMIANĘ     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. UTWÓRZ     │  /opsx:ff lub /opsx:continue (rozszerzony przepływ)    │
│   │     ARTEFAKTY  │  Tworzy proposal → specs → design → tasks               │
│   │                │  (na podstawie zależności schemy)                       │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. ZAIMPLEMEN-│  /opsx:apply                                            │
│   │     TUJ ZADANIA│  Wykonuj zadania, odhaczając je                         │
│   │                │◄──── Aktualizuj artefakty w miarę zdobywania wiedzy     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. WERYFIKUJ  │  /opsx:verify (opcjonalne)                              │
│   │     PRACĘ      │  Sprawdź, czy implementacja jest zgodna ze specyfikacją │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIWIZUJ │────►│  Specyfikacje delta scalają się z głównymi   │    │
│   │     ZMIANĘ     │     │  Folder zmian przenosi się do archive/       │    │
│   └────────────────┘     │  Specyfikacje są teraz zaktualizowanym      │    │
│                          │  źródłem prawdy                              │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Błędne koło doskonałości:**

1. Specyfikacje opisują bieżące zachowanie
2. Zmiany proponują modyfikacje (jako delty)
3. Implementacja materializuje zmiany
4. Archiwizacja scala delty ze specyfikacjami
5. Specyfikacje opisują teraz nowe zachowanie
6. Następna zmiana opiera się na zaktualizowanych specyfikacjach

## Słownik

| Termin | Definicja |
|------|------------|
| **Artefakt** | Dokument w ramach zmiany (propozycja, projekt, zadania lub specyfikacja delta) |
| **Archiwizacja** | Proces finalizowania zmiany i scalania jej delt z głównymi specyfikacjami |
| **Zmiana** | Proponowana modyfikacja systemu, zapakowana jako folder z artefaktami |
| **Specyfikacja delta** | Specyfikacja opisująca zmiany (DODANO/ZMODYFIKOWANO/USUNIĘTO) względem bieżących specyfikacji |
| **Domena** | Logiczna grupa dla specyfikacji (np. `auth/`, `payments/`) |
| **Wymaganie** | Konkretne zachowanie, które system musi posiadać |
| **Scenariusz** | Przykładowe spełnienie wymagania, zazwyczaj w formacie Dan/Kiedy/Wtedy |
| **Schemat** | Definicja typów artefaktów i ich zależności |
| **Specyfikacja** | Dokument opisujący zachowanie systemu, zawierający wymagania i scenariusze |
| **Prawda źródłowa** | Katalog `openspec/specs/`, zawierający bieżąco uzgodnione zachowanie systemu |

## Kolejne kroki

- [Pierwsze kroki](getting-started.md) - Praktyczne początkowe kroki
- [Przepływy pracy](workflows.md) - Popularne wzorce i kiedy używać każdego z nich
- [Polecenia](commands.md) - Pełna referencja poleceń
- [Dostosowywanie](customization.md) - Tworzenie niestandardowych schematów i konfigurowanie projektu