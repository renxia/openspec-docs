# Polecenia

To jest referencja dla poleceń ukośnych OpenSpec. Te polecenia są wywoływane w interfejsie czatu Twojego asystenta kodowania AI (np. Claude Code, Cursor, Windsurf).

Aby poznać wzorce przepływu pracy i kiedy używać poszczególnych poleceń, zobacz [Przepływy pracy](workflows.md). Aby zobaczyć polecenia CLI, zobacz [CLI](cli.md).

## Szybka Referencja

### Domyślna Szybka Ścieżka (profil `core`)

| Polecenie | Cel |
|-----------|-----|
| `/opsx:propose` | Utwórz zmianę i wygeneruj artefakty planowania w jednym kroku |
| `/opsx:explore` | Przemyśl pomysły przed zatwierdzeniem zmiany |
| `/opsx:apply` | Wdróż zadania ze zmiany |
| `/opsx:sync` | Scal specyfikacje delta z głównymi specyfikacjami |
| `/opsx:archive` | Zarchiwizuj ukończoną zmianę |

### Rozszerzone Polecenia Przepływu Pracy (niestandardowy wybór przepływu pracy)

| Polecenie | Cel |
|-----------|-----|
| `/opsx:new` | Rozpocznij nowe rusztowanie zmiany |
| `/opsx:continue` | Utwórz następny artefakt na podstawie zależności |
| `/opsx:ff` | Przewiń do przodu: utwórz wszystkie artefakty planowania naraz |
| `/opsx:verify` | Sprawdź, czy wdrożenie odpowiada artefaktom |
| `/opsx:bulk-archive` | Zarchiwizuj wiele zmian naraz |
| `/opsx:onboard` | Prowadzony samouczek przez kompletny przepływ pracy |

Domyślnym profilem globalnym jest `core`. Aby włączyć rozszerzone polecenia przepływu pracy, uruchom `openspec config profile`, wybierz przepływy pracy, a następnie uruchom `openspec update` w swoim projekcie.

---

## Referencja Komend

### `/opsx:propose`

Utwórz nową zmianę i wygeneruj artefakty planowania w jednym kroku. To jest domyślna komenda startowa w profilu `core`.

**Składnia:**
```text
/opsx:propose [change-name-or-description]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|------|
| `change-name-or-description` | Nie | Nazwa w formacie kebab-case lub opis zmiany w języku naturalnym |

**Co robi:**
- Tworzy `openspec/changes/<change-name>/`
- Generuje artefakty potrzebne przed implementacją (dla `spec-driven`: propozycja, specyfikacje, projekt, zadania)
- Zatrzymuje się, gdy zmiana jest gotowa do `/opsx:apply`

**Przykład:**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**Wskazówki:**
- Użyj tej komendy, aby uzyskać najszybszą ścieżkę od początku do końca
- Jeśli chcesz kontrolować artefakty krok po kroku, włącz rozszerzone przepływy pracy i użyj `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

Przemyśl pomysły, zbadaj problemy i doprecyzuj wymagania przed zatwierdzeniem zmiany.

**Składnia:**
```
/opsx:explore [topic]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|------|
| `topic` | Nie | Co chcesz zbadać lub zbadać |

**Co robi:**
- Otwiera rozmowę eksploracyjną bez wymaganej struktury
- Bada bazę kodu, aby odpowiedzieć na pytania
- Porównuje opcje i podejścia
- Tworzy wizualne diagramy, aby wyjaśnić myślenie
- Może przejść do `/opsx:propose` (domyślnie) lub `/opsx:new` (rozszerzony przepływ pracy), gdy wnioski się skrystalizują

**Przykład:**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT. Can we start a change for that?

AI:  Ready when you are. Run /opsx:propose add-jwt-auth to begin.
```

**Wskazówki:**
- Użyj, gdy wymagania nie są jasne lub musisz przeprowadzić dochodzenie
- Podczas eksploracji nie są tworzone żadne artefakty
- Przydatne do porównywania wielu podejść przed podjęciem decyzji
- Może czytać pliki i przeszukiwać bazę kodu

---

### `/opsx:new`

Rozpocznij nowe rusztowanie zmiany. Tworzy folder zmiany i czeka na wygenerowanie artefaktów za pomocą `/opsx:continue` lub `/opsx:ff`.

Ta komenda jest częścią zestawu rozszerzonych przepływów pracy (nie jest uwzględniona w domyślnym profilu `core`).

**Składnia:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|------|
| `change-name` | Nie | Nazwa folderu zmiany (monitowana, jeśli nie podano) |
| `--schema` | Nie | Schemat przepływu pracy do użycia (domyślnie: z konfiguracji lub `spec-driven`) |

**Co robi:**
- Tworzy katalog `openspec/changes/<change-name>/`
- Tworzy plik metadanych `.openspec.yaml` w folderze zmiany
- Pokazuje pierwszy szablon artefaktu gotowy do utworzenia
- Prosi o nazwę zmiany i schemat, jeśli nie zostały podane

**Co tworzy:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Metadane zmiany (schemat, data utworzenia)
```

**Przykład:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**Wskazówki:**
- Używaj opisowych nazw: `add-feature`, `fix-bug`, `refactor-module`
- Unikaj ogólnych nazw jak `update`, `changes`, `wip`
- Schemat można również ustawić w konfiguracji projektu (`openspec/config.yaml`)

---

### `/opsx:continue`

Utwórz następny artefakt w łańcuchu zależności. Tworzy jeden artefakt na raz, aby uzyskać przyrostowy postęp.

**Składnia:**
```
/opsx:continue [change-name]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|------|
| `change-name` | Nie | Którą zmianę kontynuować (wywnioskowana z kontekstu, jeśli nie podano) |

**Co robi:**
- Odpytuje graf zależności artefaktów
- Pokazuje, które artefakty są gotowe, a które zablokowane
- Tworzy pierwszy gotowy artefakt
- Czyta pliki zależności dla kontekstu
- Pokazuje, co staje się dostępne po utworzeniu

**Przykład:**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: tasks
     Run /opsx:continue to create the next artifact.
```

**Wskazówki:**
- Użyj, gdy chcesz przejrzeć każdy artefakt przed kontynuowaniem
- Przydatne dla złożonych zmian, gdy chcesz mieć kontrolę
- Wiele artefaktów może stać się gotowych jednocześnie
- Możesz edytować utworzone artefakty przed kontynuowaniem

---

### `/opsx:ff`

Przewiń do przodu tworzenie artefaktów. Tworzy wszystkie artefakty planowania naraz.

**Składnia:**
```
/opsx:ff [change-name]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|------|
| `change-name` | Nie | Którą zmianę przewinąć (wywnioskowana z kontekstu, jeśli nie podano) |

**Co robi:**
- Tworzy wszystkie artefakty w kolejności zależności
- Śledzi postęp za pomocą listy zadań
- Zatrzymuje się, gdy wszystkie artefakty `apply-required` są zakończone
- Czyta każdą zależność przed utworzeniem następnego artefaktu

**Przykład:**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**Wskazówki:**
- Użyj, gdy masz jasny obraz tego, co budujesz
- Szybsze niż `/opsx:continue` dla prostych zmian
- Nadal możesz edytować artefakty później
- Przydatne dla małych i średnich funkcji

---

### `/opsx:apply`

Zaimplementuj zadania ze zmiany. Przechodzi przez listę zadań, pisząc kod i odhaczając pozycje.

**Składnia:**
```
/opsx:apply [change-name]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|------|
| `change-name` | Nie | Którą zmianę zaimplementować (wywnioskowana z kontekstu, jeśli nie podano) |

**Co robi:**
- Czyta `tasks.md` i identyfikuje nieukończone zadania
- Przechodzi przez zadania po kolei
- Pisze kod, tworzy pliki, uruchamia testy w razie potrzeby
- Oznacza zadania jako ukończone za pomocą pól wyboru `[x]`

**Przykład:**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**Wskazówki:**
- Może wznowić od miejsca przerwania w razie przerwania
- Użyj dla równoległych zmian, podając nazwę zmiany
- Stan ukończenia jest śledzony w polach wyboru `tasks.md`

---

### `/opsx:verify`

Sprawdź, czy implementacja odpowiada Twoim artefaktom zmiany. Sprawdza kompletność, poprawność i spójność.

**Składnia:**
```
/opsx:verify [change-name]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|------|
| `change-name` | Nie | Którą zmianę zweryfikować (wywnioskowana z kontekstu, jeśli nie podano) |

**Co robi:**
- Sprawdza trzy wymiary jakości implementacji
- Przeszukuje bazę kodu w poszukiwaniu dowodów implementacji
- Raportuje problemy sklasyfikowane jako KRYTYCZNE, OSTRZEŻENIE lub SUGESTIA
- Nie blokuje archiwizacji, ale ujawnia problemy

**Wymiary weryfikacji:**

| Wymiar | Co weryfikuje |
|--------|---------------|
| **Kompletność** | Wszystkie zadania wykonane, wszystkie wymagania zaimplementowane, scenariusze pokryte |
| **Poprawność** | Implementacja odpowiada intencji specyfikacji, obsłużone przypadki brzegowe |
| **Spójność** | Decyzje projektowe odzwierciedlone w kodzie, spójne wzorce |

**Przykład:**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**Wskazówki:**
- Uruchom przed archiwizacją, aby wcześnie wykryć niezgodności
- Ostrzeżenia nie blokują archiwizacji, ale wskazują na potencjalne problemy
- Przydatne do przeglądania pracy AI przed zatwierdzeniem
- Może ujawnić dryf między artefaktami a implementacją

---

### `/opsx:sync`

**Komenda opcjonalna.** Scal specyfikacje delta ze zmiany do głównych specyfikacji. Archiwizacja zasugeruje synchronizację w razie potrzeby, więc zazwyczaj nie musisz uruchamiać tego ręcznie.

**Składnia:**
```
/opsx:sync [change-name]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|------|
| `change-name` | Nie | Którą zmianę zsynchronizować (wywnioskowana z kontekstu, jeśli nie podano) |

**Co robi:**
- Czyta specyfikacje delta z folderu zmiany
- Parsuje sekcje ADDED/MODIFIED/REMOVED/RENAMED
- Scala zmiany do głównego katalogu `openspec/specs/`
- Zachowuje istniejącą treść nieuwzględnioną w delcie
- Nie archiwizuje zmiany (pozostaje aktywna)

**Przykład:**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**Kiedy używać ręcznie:**

| Scenariusz | Użyć sync? |
|------------|------------|
| Długotrwała zmiana, chcesz specyfikacje w głównych przed archiwizacją | Tak |
| Wiele równoległych zmian potrzebuje zaktualizowanych specyfikacji bazowych | Tak |
| Chcesz osobno podejrzeć/przejrzeć scalenie | Tak |
| Szybka zmiana, idziesz prosto do archiwizacji | Nie (archiwizacja obsługuje to) |

**Wskazówki:**
- Sync jest inteligentny, nie jest kopiuj-wklej
- Może dodawać scenariusze do istniejących wymagań bez duplikowania
- Zmiana pozostaje aktywna po synchronizacji (nie jest zarchiwizowana)
- Większość użytkowników nigdy nie będzie musiała wywoływać tego bezpośrednio — archiwizacja zasugeruje w razie potrzeby

---

### `/opsx:archive`

Zarchiwizuj ukończoną zmianę. Finalizuje zmianę i przenosi ją do folderu archiwum.

**Składnia:**
```
/opsx:archive [change-name]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|------|
| `change-name` | Nie | Którą zmianę zarchiwizować (wywnioskowana z kontekstu, jeśli nie podano) |

**Co robi:**
- Sprawdza status ukończenia artefaktów
- Sprawdza ukończenie zadań (ostrzega, jeśli nieukończone)
- Oferuje synchronizację specyfikacji delta, jeśli jeszcze nie zsynchronizowane
- Przenosi folder zmiany do `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Zachowuje wszystkie artefakty do audytu

**Przykład:**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**Wskazówki:**
- Archiwizacja nie zablokuje się na nieukończonych zadaniach, ale ostrzeże
- Specyfikacje delta mogą być zsynchronizowane podczas archiwizacji lub wcześniej
- Zarchiwizowane zmiany są zachowane dla historii
- Użyj `/opsx:verify` wcześniej, aby wykryć problemy

---

### `/opsx:bulk-archive`

Zarchiwizuj wiele ukończonych zmian naraz. Obsługuje konflikty specyfikacji między zmianami.

**Składnia:**
```
/opsx:bulk-archive [change-names...]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|------|
| `change-names` | Nie | Konkretne zmiany do zarchiwizowania (monit o wybór, jeśli nie podano) |

**Co robi:**
- Wyświetla wszystkie ukończone zmiany
- Waliduje każdą zmianę przed archiwizacją
- Wykrywa konflikty specyfikacji między zmianami
- Rozwiązuje konflikty, sprawdzając co faktycznie zostało zaimplementowane
- Archiwizuje w kolejności chronologicznej

**Przykład:**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**Wskazówki:**
- Przydatne dla równoległych strumieni pracy
- Rozwiązywanie konfliktów jest agentowe (sprawdza bazę kodu)
- Zmiany są archiwizowane w kolejności utworzenia
- Monituje przed nadpisaniem treści specyfikacji

---

### `/opsx:onboard`

Prowadzony onboarding przez kompletny przepływ pracy OpenSpec. Interaktywny tutorial z użyciem Twojej rzeczywistej bazy kodu.

**Składnia:**
```
/opsx:onboard
```

**Co robi:**
- Przeprowadza przez kompletny cykl przepływu pracy z narracją
- Skanuje Twoją bazę kodu w poszukiwaniu realnych możliwości ulepszeń
- Tworzy rzeczywistą zmianę z prawdziwymi artefaktami
- Implementuje rzeczywistą pracę (małe, bezpieczne zmiany)
- Archiwizuje ukończoną zmianę
- Wyjaśnia każdy krok w trakcie

**Fazy:**
1. Powitanie i analiza bazy kodu
2. Znalezienie możliwości ulepszenia
3. Utworzenie zmiany (`/opsx:new`)
4. Napisanie propozycji
5. Utworzenie specyfikacji
6. Napisanie projektu
7. Utworzenie zadań
8. Implementacja zadań (`/opsx:apply`)
9. Weryfikacja implementacji
10. Archiwizacja zmiany
11. Podsumowanie i kolejne kroki

**Przykład:**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**Wskazówki:**
- Najlepsze dla nowych użytkowników uczących się przepływu pracy
- Używa prawdziwego kodu, nie sztucznych przykładów
- Tworzy rzeczywistą zmianę, którą możesz zachować lub odrzucić
- Zajmuje 15-30 minut do ukończenia

---

## Składnia poleceń według narzędzia AI

Różne narzędzia AI używają nieco odmiennej składni poleceń. Użyj formatu odpowiadającego Twojemu narzędziu:

| Narzędzie | Przykład składni |
|-----------|------------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Wywołania oparte na umiejętnościach, takie jak `/skill:openspec-propose`, `/skill:openspec-apply-change` (bez generowanych plików poleceń `opsx-*`) |
| Trae | Wywołania oparte na umiejętnościach, takie jak `/openspec-propose`, `/openspec-apply-change` (bez generowanych plików poleceń `opsx-*`) |

Intencja jest taka sama we wszystkich narzędziach, ale sposób prezentacji poleceń może się różnić w zależności od integracji.

> **Uwaga:** Polecenia GitHub Copilot (`.github/prompts/*.prompt.md`) są dostępne tylko w rozszerzeniach IDE (VS Code, JetBrains, Visual Studio). GitHub Copilot CLI obecnie nie obsługuje niestandardowych plików promptów — zobacz [Obsługiwane narzędzia](supported-tools.md), aby uzyskać szczegóły i obejścia.

---

## Polecenia starszej wersji

Te polecenia używają starszego przepływu pracy „wszystko naraz". Nadal działają, ale zalecane są polecenia OPSX.

| Polecenie | Co robi |
|-----------|---------|
| `/openspec:proposal` | Tworzy wszystkie artefakty naraz (propozycję, specyfikacje, projekt, zadania) |
| `/openspec:apply` | Wdraża zmianę |
| `/openspec:archive` | Archiwizuje zmianę |

**Kiedy używać poleceń starszej wersji:**
- Istniejące projekty korzystające ze starego przepływu pracy
- Proste zmiany, w których nie potrzebujesz przyrostowego tworzenia artefaktów
- Preferencja podejścia „wszystko albo nic"

**Migracja do OPSX:**
Zmiany starszej wersji mogą być kontynuowane za pomocą poleceń OPSX. Struktura artefaktów jest kompatybilna.

---

## Rozwiązywanie problemów

### „Change not found"

Polecenie nie mogło zidentyfikować, nad którą zmianą pracować.

**Rozwiązania:**
- Jawne określenie nazwy zmiany: `/opsx:apply add-dark-mode`
- Sprawdzenie, czy folder zmiany istnieje: `openspec list`
- Upewnienie się, że jesteś w odpowiednim katalogu projektu

### „No artifacts ready"

Wszystkie artefakty są albo ukończone, albo zablokowane przez brakujące zależności.

**Rozwiązania:**
- Uruchomienie `openspec status --change <name>`, aby zobaczyć, co blokuje
- Sprawdzenie, czy wymagane artefakty istnieją
- Najpierw utworzenie brakujących artefaktów zależności

### „Schema not found"

Określone schemat nie istnieje.

**Rozwiązania:**
- Wyświetlenie dostępnych schematów: `openspec schemas`
- Sprawdzenie pisowni nazwy schematu
- Utworzenie schematu, jeśli jest niestandardowy: `openspec schema init <name>`

### Polecenia nierozpoznawane

Narzędzie AI nie rozpoznaje poleceń OpenSpec.

**Rozwiązania:**
- Upewnienie się, że OpenSpec jest zainicjalizowany: `openspec init`
- Ponowne wygenerowanie umiejętności: `openspec update`
- Sprawdzenie, czy katalog `.claude/skills/` istnieje (dla Claude Code)
- Ponowne uruchomienie narzędzia AI, aby załadować nowe umiejętności

### Artefakty generowane nieprawidłowo

AI tworzy niekompletne lub niepoprawne artefakty.

**Rozwiązania:**
- Dodanie kontekstu projektu w `openspec/config.yaml`
- Dodanie reguł dla poszczególnych artefaktów w celu uzyskania konkretnych wytycznych
- Podanie więcej szczegółów w opisie zmiany
- Użycie `/opsx:continue` zamiast `/opsx:ff` dla większej kontroli

---

## Następne kroki

- [Przepływy pracy](workflows.md) - Typowe wzorce i kiedy używać poszczególnych poleceń
- [CLI](cli.md) - Polecenia terminala do zarządzania i walidacji
- [Dostosowywanie](customization.md) - Tworzenie niestandardowych schematów i przepływów pracy