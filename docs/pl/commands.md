# Polecenia

To jest referencja dotycząca poleceń slash w OpenSpec. Polecenia te są wywoływane w interfejsie czatu asystenta kodującego AI (np. Claude Code, Cursor, Windsurf).

Wzorce przepływów pracy i informacje o tym, kiedy używać poszczególnych poleceń, znajdziesz w sekcji [Przepływy pracy](workflows.md). Polecenia CLI opisano w sekcji [CLI](cli.md).

## Szybki przegląd

### Domyślna szybka ścieżka (profil `core`)

| Polecenie | Przeznaczenie |
|-----------|---------------|
| `/opsx:propose` | Utwórz zmianę i wygeneruj artefakty planowania w jednym kroku |
| `/opsx:explore` | Przemyśl pomysły przed zaangażowaniem się w zmianę |
| `/opsx:apply` | Zaimplementuj zadania z tej zmiany |
| `/opsx:archive` | Zarchiwizuj zakończoną zmianę |

### Rozszerzone polecenia przepływu pracy (niestandardowy wybór przepływu pracy)

| Polecenie | Przeznaczenie |
|-----------|---------------|
| `/opsx:new` | Rozpocznij nowy szkielet zmiany |
| `/opsx:continue` | Utwórz następny artefakt na podstawie zależności |
| `/opsx:ff` | Szybkie przesunięcie: utwórz wszystkie artefakty planowania naraz |
| `/opsx:verify` | Sprawdź, czy implementacja jest zgodna z artefaktami |
| `/opsx:sync` | Scal specyfikacje delta ze specyfikacjami głównymi |
| `/opsx:bulk-archive` | Zarchiwizuj wiele zmian naraz |
| `/opsx:onboard` | Przewodnik tutorialowy przez kompletny przepływ pracy |

Domyślnym globalnym profilem jest `core`. Aby włączyć rozszerzone polecenia przepływu pracy, uruchom `openspec config profile`, wybierz przepływy pracy, a następnie uruchom `openspec update` w swoim projekcie.

---

## Referencja komend

### `/opsx:propose`

Tworzy nową zmianę i generuje artefakty planowania w jednym kroku. To domyślna komenda startowa w profilu `core`.

**Składnia:**
```text
/opsx:propose [nazwa-lub-opis-zmiany]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|------|
| `nazwa-lub-opis-zmiany` | Nie | Nazwa w formacie kebab-case lub opis zmiany w języku naturalnym |

**Co robi:**
- Tworzy `openspec/changes/<nazwa-zmiany>/`
- Generuje artefakty niezbędne przed implementacją (dla `spec-driven`: propozycja, specyfikacje, projekt, zadania)
- Zatrzymuje się, gdy zmiana jest gotowa do `/opsx:apply`

**Przykład:**
```text
Ty: /opsx:propose add-dark-mode

AI:  Utworzono openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Gotowe do implementacji. Uruchom /opsx:apply.
```

**Wskazówki:**
- Używaj tej komendy dla najszybszej ścieżki end-to-end
- Jeśli chcesz kontrolować tworzenie artefaktów krok po kroku, włącz rozszerzone przepływy pracy i użyj `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

Przemyśl pomysły, zbadaj problemy i doprecyzuj wymagania przed podjęciem decyzji o zmianie.

**Składnia:**
```
/opsx:explore [temat]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|------|
| `temat` | Nie | Co chcesz zbadać lub sprawdzić |

**Co robi:**
- Otwiera eksploracyjną rozmowę bez wymaganej struktury
- Badanie bazy kodu, aby odpowiedzieć na pytania
- Porównuje opcje i podejścia
- Tworzy diagramy wizualne do wyjaśnienia myślenia
- Może przejść do `/opsx:propose` (domyślnie) lub `/opsx:new` (rozszerzony przepływ pracy), gdy wnioski się krystalizują

**Przykład:**
```text
Ty: /opsx:explore

AI:  Co chciałbyś zbadać?

Ty: Jak powinniśmy obsłużyć uwierzytelnianie w aplikacji mobilnej?

AI:  Pozwól, że zbadam Twoją obecną konfigurację uwierzytelniania...
     [Analizuje bazę kodu]

     Widzę, że używasz uwierzytelniania sesyjnego dla aplikacji webowej.
     Dla mamy trzy główne opcje:

     1. Tokeny JWT (bezstanowe, działa offline)
     2. OAuth2 (jeśli potrzebujesz logowania przez strony trzecie)
     3. Rozszerzenie obecnych sesji (prostsze, ale wymaga łączności)

     Twoje API ma już skonfigurowane CORS. Która opcja Cię interesuje?

Ty: Wybierzmy JWT. Czy możemy rozpocząć zmianę dla tego?

AI:  Jestem gotowy. Uruchom /opsx:propose add-jwt-auth, aby rozpocząć.
```

**Wskazówki:**
- Używaj, gdy wymagania są niejasne lub musisz coś zbadać
- Podczas eksploracji nie są tworzone żadne artefakty
- Dobrze sprawdza się do porównywania wielu podejść przed podjęciem decyzji
- Może czytać pliki i przeszukiwać bazę kodu

---

### `/opsx:new`

Rozpoczyna nowy szkielet zmiany. Tworzy folder zmiany i czeka na wygenerowanie artefaktów za pomocą `/opsx:continue` lub `/opsx:ff`.

Ta komenda jest częścią rozszerzonego zestawu przepływów pracy (nie jest uwzględniona w domyślnym profilu `core`).

**Składnia:**
```
/opsx:new [nazwa-zmiany] [--schema <nazwa-schematu>]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|------|
| `nazwa-zmiany` | Nie | Nazwa folderu zmiany (pytanie, jeśli nie podano) |
| `--schema` | Nie | Schemat przepływu pracy do użycia (domyślnie: z konfiguracji lub `spec-driven`) |

**Co robi:**
- Tworzy katalog `openspec/changes/<nazwa-zmiany>/`
- Tworzy plik metadanych `.openspec.yaml` w folderze zmiany
- Wyświetla pierwszy szablon artefaktu gotowy do utworzenia
- Pyta o nazwę zmiany i schemat, jeśli nie zostały podane

**Co tworzy:**
```
openspec/changes/<nazwa-zmiany>/
└── .openspec.yaml    # Metadane zmiany (schemat, data utworzenia)
```

**Przykład:**
```
Ty: /opsx:new add-dark-mode

AI:  Utworzono openspec/changes/add-dark-mode/
     Schemat: spec-driven

     Gotowe do utworzenia: proposal
     Użyj /opsx:continue, aby go utworzyć, lub /opsx:ff, aby utworzyć wszystkie artefakty.
```

**Wskazówki:**
- Używaj opisowych nazw: `add-feature`, `fix-bug`, `refactor-module`
- Unikaj ogólnych nazw takich jak `update`, `changes`, `wip`
- Schemat można również ustawić w konfiguracji projektu (`openspec/config.yaml`)

---

### `/opsx:continue`

Tworzy następny artefakt w łańcuchu zależności. Tworzy jeden artefakt na raz dla postępu przyrostowego.

**Składnia:**
```
/opsx:continue [nazwa-zmiany]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|------|
| `nazwa-zmiany` | Nie | Którą zmianę kontynuować (wywnioskowane z kontekstu, jeśli nie podano) |

**Co robi:**
- Pyta o graf zależności artefaktów
- Wyświetla, które artefakty są gotowe vs zablokowane
- Tworzy pierwszy gotowy artefakt
- Czyta pliki zależności dla kontekstu
- Wyświetla, co staje się dostępne po utworzeniu

**Przykład:**
```
Ty: /opsx:continue

AI:  Zmiana: add-dark-mode

     Status artefaktów:
     ✓ proposal    (zrobione)
     ◆ specs       (gotowe)
     ◆ design      (gotowe)
     ○ tasks       (zablokowane - wymaga: specs)

     Tworzenie specs...

     [Czyta proposal.md, tworzy specs na podstawie wymagań]

     ✓ Utworzono openspec/changes/add-dark-mode/specs/ui/spec.md

     Teraz dostępne: tasks
     Uruchom /opsx:continue, aby utworzyć następny artefakt.
```

**Wskazówki:**
- Używaj, gdy chcesz przejrzeć każdy artefakt przed kontynuowaniem
- Dobrze sprawdza się przy złożonych zmianach, gdy chcesz mieć kontrolę
- Kilka artefaktów może stać się gotowych jednocześnie
- Możesz edytować utworzone artefakty przed kontynuowaniem

---

### `/opsx:ff`

Szybkie przewijanie przez tworzenie artefaktów. Tworzy wszystkie artefakty planowania naraz.

**Składnia:**
```
/opsx:ff [nazwa-zmiany]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|------|
| `nazwa-zmiany` | Nie | Którą zmianę przewinąć (wywnioskowane z kontekstu, jeśli nie podano) |

**Co robi:**
- Tworzy wszystkie artefakty w kolejności zależności
- Śledzi postęp za pomocą listy zadań
- Zatrzymuje się, gdy wszystkie artefakty wymagane do `apply` są kompletne
- Czyta każdą zależność przed utworzeniem następnego artefaktu

**Przykład:**
```
Ty: /opsx:ff add-dark-mode

AI:  Przewijanie add-dark-mode...

     ✓ Tworzenie proposal.md
     ✓ Tworzenie specs/ui/spec.md
     ✓ Tworzenie design.md
     ✓ Tworzenie tasks.md

     Wszystkie artefakty planowania kompletne!
     Gotowe do implementacji. Uruchom /opsx:apply, aby rozpocząć.
```

**Wskazówki:**
- Używaj, gdy masz jasny obraz tego, co budujesz
- Szybsze niż `/opsx:continue` dla prostych zmian
- Nadal możesz edytować artefakty po utworzeniu
- Dobrze sprawdza się dla małych i średnich funkcjonalności

---

### `/opsx:apply`

Implementuje zadania ze zmiany. Przechodzi przez listę zadań, pisząc kod i odhaczając pozycje.

**Składnia:**
```
/opsx:apply [nazwa-zmiany]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|------|
| `nazwa-zmiany` | Nie | Którą zmianę zaimplementować (wywnioskowane z kontekstu, jeśli nie podano) |

**Co robi:**
- Czyta `tasks.md` i identyfikuje niekompletne zadania
- Przechodzi przez zadania jedno po drugim
- Pisze kod, tworzy pliki, uruchamia testy w razie potrzeby
- Oznacza zadania jako kompletne za pomocą pól wyboru `[x]`

**Przykład:**
```
Ty: /opsx:apply

AI:  Implementacja add-dark-mode...

     Czytanie tasks.md:
     - [ ] 1.1 Utwórz ThemeContext
     - [ ] 1.2 Dodaj niestandardowe właściwości CSS
     - [ ] 1.3 Zaimplementuj trwałość localStorage

     Praca nad 1.1: Tworzenie ThemeContext...
     [Tworzy src/context/ThemeContext.tsx]

     ✓ 1.1 Kompletne

     Praca nad 1.2: Dodawanie niestandardowych właściwości CSS...
     [Aktualizuje src/styles/globals.css]

     ✓ 1.2 Kompletne
     ...
```

**Wskazówki:**
- Możesz wznowić od miejsca, w którym skończyłeś, jeśli zostaniesz przerwany
- Używaj dla równoległych zmian, podając nazwę zmiany
- Stan ukończenia jest śledzony w polach wyboru w `tasks.md`

---

### `/opsx:verify`

Waliduje, czy implementacja odpowiada artefaktom Twojej zmiany. Sprawdza kompletność, poprawność i spójność.

**Składnia:**
```
/opsx:verify [nazwa-zmiany]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|------|
| `nazwa-zmiany` | Nie | Którą zmianę zweryfikować (wywnioskowane z kontekstu, jeśli nie podano) |

**Co robi:**
- Sprawdza trzy wymiary jakości implementacji
- Przeszukuje bazę kodu w poszukiwaniu dowodów implementacji
- Raportuje problemy sklasyfikowane jako KRYTYCZNE, OSTRZEŻENIE lub SUGESTIA
- Nie blokuje archiwizacji, ale ujawnia problemy

**Wymagery walidacji:**

| Wymiar | Co waliduje |
|-----------|-------------------|
| **Kompletność** | Wszystkie zadania zrobione, wszystkie wymagania zaimplementowane, scenariusze uwzględnione |
| **Poprawność** | Implementacja odpowiada intencji specyfikacji, obsłużone przypadki brzegowe |
| **Spójność** | Decyzje projektowe odzwierciedlone w kodzie, wzorce spójne |

**Przykład:**
```
Ty: /opsx:verify

AI:  Weryfikacja add-dark-mode...

     KOMPLETNOŚĆ
     ✓ Wszystkie 8 zadań w tasks.md jest odhaczonych
     ✓ Wszystkie wymagania w specs mają odpowiadający kod
     ⚠ Scenariusz "Wykrywanie preferencji systemowych" nie ma pokrycia testowego

     POPRAWNOŚĆ
     ✓ Implementacja odpowiada intencji specyfikacji
     ✓ Przypadki brzegowe z scenariuszy są obsłużone
     ✓ Stany błędów odpowiadają definicjom w specyfikacji

     SPÓJNOŚĆ
     ✓ Decyzje projektowe odzwierciedlone w strukturze kodu
     ✓ Konwencje nazewnictwa spójne z design.md
     ⚠ Projekt wspomina o "zmiennych CSS", ale implementacja używa klas Tailwind

     PODSUMOWANIE
     ─────────────────────────────
     Problemy krytyczne: 0
     Ostrzeżenia: 2
     Gotowe do archiwizacji: Tak (z ostrzeżeniami)

     Zalecenia:
     1. Dodaj test dla wykrywania preferencji systemowych
     2. Zaktualizuj design.md, aby odzwierciedlić użycie Tailwind, lub refactoruj, aby używać zmiennych CSS
```

**Wskazówki:**
- Uruchamiaj przed archiwizacją, aby wcześnie wykryć rozbieżności
- Ostrzeżenia nie blokują archiwizacji, ale wskazują na potencjalne problemy
- Dobrze sprawdza się do przeglądu pracy AI przed zatwierdzeniem
- Może ujawnić dryf między artefaktami a implementacją

---

### `/opsx:sync`

**Opcjonalna komenda.** Scal delta specyfikacji ze zmiany do głównych specyfikacji. Archiwizacja zapyta o synchronizację w razie potrzeby, więc zazwyczaj nie musisz uruchamiać tej komendy ręcznie.

**Składnia:**
```
/opsx:sync [nazwa-zmiany]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|------|
| `nazwa-zmiany` | Nie | Którą zmianę synchronizować (wywnioskowane z kontekstu, jeśli nie podano) |

**Co robi:**
- Czyta delta specyfikacji z folderu zmiany
- Parsuje sekcje DODANO/ZMODYFIKOWANO-USUNIĘTO/PRZEMIANOWANO
- Scal zmiany do głównego katalogu `openspec/specs/`
- Zachowuje istniejącą treść nieuwzględnioną w delcie
- Nie archiwizuje zmiany (pozostaje aktywna)

**Przykład:**
```text
Ty: /opsx:sync

AI:  Synchronizacja delta specyfikacji add-dark-mode...

     Czytanie: openspec/changes/add-dark-mode/specs/ui/spec.md
     Cel:  openspec/specs/ui/spec.md

     Zmiany do zastosowania:
     ✓ DODANO: Wymaganie Wyboru Motywu (2 scenariusze)
     ✓ DODANO: Wymaganie Dostępności (1 scenariusz)

     Scalanie...
     ✓ openspec/specs/ui/spec.md zaktualizowane

     Zmiana pozostaje aktywna. Uruchom /opsx:archive, gdy będziesz gotowy do zakończenia.
```

**Kiedy używać ręcznie:**

| Scenariusz | Użyć sync? |
|----------|-----------|
| Długotrwała zmiana, chcą mieć specyfikacje w głównej przed archiwizacją | Tak |
| Wiele równoległych zmian potrzebuje zaktualizowanych bazowych specyfikacji | Tak |
| Chcą podglądu/przeglądu scalenia osobno | Tak |
| Szybka zmiana, idąca bezpośrednio do archiwizacji | Nie (archiwizacja to obsługuje) |

**Wskazówki:**
- Sync jest inteligentny, nie jest kopiowaniem i wklejaniem
- Może dodawać scenariusze do istniejących wymagań bez duplikacji
- Zmiana pozostaje aktywna po synchronizacji (nie jest archiwizowana)
- Większość użytkowników nigdy nie będzie musiała wywoływać tej komendy bezpośrednio—archiwizacja zapyta w razie potrzeby

---

### `/opsx:archive`

Archiwizuje ukończoną zmianę. Finalizuje zmianę i przenosi ją do folderu archiwum.

**Składnia:**
```
/opsx:archive [nazwa-zmiany]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|------|
| `nazwa-zmiany` | Nie | Którą zmianę zarchiwizować (wywnioskowane z kontekstu, jeśli nie podano) |

**Co robi:**
- Sprawdza status ukończenia artefaktów
- Sprawdza ukończenie zadań (ostrzega, jeśli niekompletne)
- Oferuje synchronizację delta specyfikacji, jeśli nie zostały jeszcze zsynchronizowane
- Przenosi folder zmiany do `openspec/changes/archive/RRRR-MM-DD-<nazwa>/`
- Zachowuje wszystkie artefakty dla ścieżki audytu

**Przykład:**
```text
Ty: /opsx:archive

AI:  Archiwizacja add-dark-mode...

     Status artefaktów:
     ✓ proposal.md istnieje
     ✓ specs/ istnieje
     ✓ design.md istnieje
     ✓ tasks.md istnieje (8/8 zadań kompletnych)

     Delta specyfikacji: Jeszcze nie zsynchronizowane
     → Synchronizować teraz? (zalecane)

Ty: Tak

AI:  ✓ Zsynchronizowano specyfikacje do openspec/specs/ui/spec.md
     ✓ Przeniesiono do openspec/changes/archive/2025-01-24-add-dark-mode/

     Zmiana zarchiwizowana pomyślnie.
```

**Wskazówki:**
- Archiwizacja nie zablokuje się na niekompletnych zadaniach, ale ostrzeże
- Delta specyfikacji można synchronizować podczas archiwizacji lub wcześniej
- Zarchiwizowane zmiany są zachowywane dla historii
- Użyj najpierw `/opsx:verify`, aby wykryć problemy

---

### `/opsx:bulk-archive`

Archiwizuje wiele ukończonych zmian naraz. Obsługuje konflikty specyfikacji między zmianami.

**Składnia:**
```
/opsx:bulk-archive [nazwy-zmian...]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|------|
| `nazwy-zmian` | Nie | Konkretne zmiany do archiwizacji (pytanie o wybór, jeśli nie podano) |

**Co robi:**
- Wyświetla wszystkie ukończone zmiany
- Waliduje każdą zmianę przed archiwizacją
- Wykrywa konflikty specyfikacji między zmianami
- Rozwiązuje konflikty, sprawdzając, co faktycznie zostało zaimplementowane
- Archiwizuje w kolejności chronologicznej

**Przykład:**
```
Ty: /opsx:bulk-archive

AI:  Znaleziono 3 ukończone zmiany:
     - add-dark-mode (8/8 zadań kompletnych)
     - fix-login-bug (3/3 zadań kompletnych)
     - update-footer (2/2 zadań kompletnych)

     Sprawdzanie konfliktów specyfikacji...
     ⚠ add-dark-mode i update-footer obie dotyczą specs/ui/

     Inspekcja bazy kodu w celu rozwiązania...
     Obie zmiany są zaimplementowane. Zostaną scalone w kolejności chronologicznej:
     1. add-dark-mode (utworzona 20 stycznia)
     2. update-footer (utworzona 22 stycznia)

     Zarchiwizować wszystkie 3 zmiany?

Ty: Tak

AI:  ✓ Zarchiwizowano add-dark-mode
     ✓ Zarchiwizowano fix-login-bug
     ✓ Zarchiwizowano update-footer
     Scalono specyfikacje: add-dark-mode → update-footer
```

**Wskazówki:**
- Dobrze sprawdza się dla równoległych strumieni pracy
- Rozwiązywanie konfliktów jest agentyczne (sprawdza bazę kodu)
- Zmiany są archiwizowane w kolejności utworzenia
- Pyta przed nadpisywaniem treści specyfikacji

---

### `/opsx:onboard`

Przewodnik wprowadzający przez kompletny przepływ pracy OpenSpec. Interaktywny tutorial wykorzystujący Twoją rzeczywistą bazę kodu.

**Składnia:**
```
/opsx:onboard
```

**Co robi:**
- Przeprowadza przez kompletny cykl przepływu pracy z narracją
- Skanuje Twoją bazę kodu w poszukiwaniu realnych możliwości ulepszenia
- Tworzy rzeczywistą zmianę z prawdziwymi artefaktami
- Implementuje rzeczywistą pracę (małe, bezpieczne zmiany)
- Archiwizuje ukończoną zmianę
- Wyjaśnia każdy krok w trakcie jego wykonywania

**Fazy:**
1. Powitanie i analiza bazy kodu
2. Znalezienie możliwości ulepszenia
3. Tworzenie zmiany (`/opsx:new`)
4. Pisanie propozycji
5. Tworzenie specyfikacji
6. Pisanie projektu
7. Tworzenie zadań
8. Implementacja zadań (`/opsx:apply`)
9. Weryfikacja implementacji
10. Archiwizacja zmiany
11. Podsumowanie i dalsze kroki

**Przykład:**
```
Ty: /opsx:onboard

AI:  Witaj w OpenSpec!

     Przeprowadzę Cię przez kompletny przepływ pracy, wykorzystując Twoją rzeczywistą bazę kodu.
     Znajdziemy coś małego do ulepszenia, stworzymy dla tego odpowiednią zmianę,
     zaimplementujemy ją i zarchiwizujemy.

     Pozwól, że zeskanuję Twoją bazę kodu w poszukiwaniu możliwości...

     [Analizuje bazę kodu]

     Znalazłem kilka rzeczy, nad którymi moglibyśmy popracować:
     1. Dodanie walidacji wejścia do formularza kontaktowego
     2. Ulepszenie komunikatów błędów w przepływie uwierzytelniania
     3. Dodanie stanów ładowania do przycisków asynchronicznych

     Co Cię interesuje? (lub zaproponuj coś innego)
```

**Wskazówki:**
- Najlepsze dla nowych użytkowników uczących się przepływu pracy
- Wykorzystuje prawdziwy kod, nie przykładowe projekty
- Tworzy prawdziwą zmianę, którą możesz zachować lub odrzucić
- Zajmuje 15-30 minut do ukończenia

---

## Składnia poleceń według narzędzia AI

Różne narzędzia AI używają nieco innej składni poleceń. Użyj formatu odpowiadającego Twojemu narzędziu:

| Narzędzie | Przykład składni |
|-----------|------------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Trae | Wywołania oparte na umiejętnościach, takie jak `/openspec-propose`, `/openspec-apply-change` (bez generowanych plików poleceń `opsx-*`) |

Zamysł jest taki sam we wszystkich narzędziach, ale sposób prezentacji poleceń może się różnić w zależności od integracji.

> **Uwaga:** Polecenia GitHub Copilot (`.github/prompts/*.prompt.md`) są dostępne tylko w rozszerzeniach IDE (VS Code, JetBrains, Visual Studio). GitHub Copilot CLI obecnie nie obsługuje niestandardowych plików promptów — szczegóły i obejścia znajdziesz w sekcji [Obsługiwane narzędzia](supported-tools.md).

---

## Polecenia starsze (Legacy)

Te polecenia używają starszego przepływu pracy „wszystko naraz". Nadal działają, ale zaleca się używanie poleceń OPSX.

| Polecenie | Co robi |
|-----------|---------|
| `/openspec:proposal` | Tworzy wszystkie artefakty naraz (propozycję, specyfikacje, projekt, zadania) |
| `/openspec:apply` | Wdraża zmianę |
| `/openspec:archive` | Archiwizuje zmianę |

**Kiedy używać starszych poleceń:**
- W istniejących projektach korzystających ze starego przepływu pracy
- W przypadku prostych zmian, gdzie nie jest potrzebne stopniowe tworzenie artefaktów
- Gdy preferowane jest podejście „wszystko albo nic"

**Migracja do OPSX:**
Zmiany starsze mogą być kontynuowane za pomocą poleceń OPSX. Struktura artefaktów jest kompatybilna.

---

## Rozwiązywanie problemów

### „Nie znaleziono zmiany"

Polecenie nie mogło zidentyfikować, nad którą zmianą pracować.

**Rozwiązania:**
- Wskaż wyraźnie nazwę zmiany: `/opsx:apply add-dark-mode`
- Sprawdź, czy folder zmiany istnieje: `openspec list`
- Upewnij się, że jesteś w odpowiednim katalogu projektu

### „Brak gotowych artefaktów"

Wszystkie artefakty są albo ukończone, albo zablokowane przez brakujące zależności.

**Rozwiązania:**
- Uruchom `openspec status --change <nazwa>`, aby zobaczyć, co blokuje postęp
- Sprawdź, czy wymagane artefakty istnieją
- Najpierw utwórz brakujące artefakty zależności

### „Nie znaleziono schematu"

Podany schemat nie istnieje.

**Rozwiązania:**
- Wylistuj dostępne schematy: `openspec schemas`
- Sprawdź pisownię nazwy schematu
- Utwórz schemat, jeśli jest niestandardowy: `openspec schema init <nazwa>`

### Polecenia nierozpoznawalne

Narzędzie AI nie rozpoznaje poleceń OpenSpec.

**Rozwiązania:**
- Upewnij się, że OpenSpec jest zainicjalizowany: `openspec init`
- Wygeneruj umiejętności ponownie: `openspec update`
- Sprawdź, czy istnieje katalog `.claude/skills/` (dla Claude Code)
- Uruchom ponownie narzędzie AI, aby załadować nowe umiejętności

### Artefakty generowane nieprawidłowo

AI tworzy niekompletne lub nieprawidłowe artefakty.

**Rozwiązania:**
- Dodaj kontekst projektu w `openspec/config.yaml`
- Dodaj reguły dla poszczególnych artefaktów, aby uzyskać szczegółowe wskazówki
- Podaj więcej szczegółów w opisie zmiany
- Użyj `/opsx:continue` zamiast `/opsx:ff`, aby uzyskać większą kontrolę

---

## Kolejne kroki

- [Przepływy pracy](workflows.md) - Popularne wzorce i kiedy używać danego polecenia
- [CLI](cli.md) - Polecenia terminalowe do zarządzania i walidacji
- [Dostosowywanie](customization.md) - Tworzenie niestandardowych schematów i przepływów pracy