# Komendy

Jest to odniesienie do komend z ukośnikiem OpenSpec. Te komendy są wywoływane w interfejsie czatu Twojego asystenta kodowania AI (np. Claude Code, Cursor, Windsurf).

Aby dowiedzieć się o wzorcach przepływu pracy i kiedy używać każdej komendy, zapoznaj się z [Przepływami Pracy](workflows.md). W przypadku komend CLI, sprawdź [CLI](cli.md).

## Szybki Przewodnik

### Standardowa Ścieżka Szybkiego Użycia (`core` profil)

| Command | Purpose |
|---------|---------|
| `/opsx:propose` | Utwórz zmianę i wygeneruj artefakty planowania w jednym kroku |
| `/opsx:explore` | Przeanalizuj pomysły przed zatwierdzeniem zmiany |
| `/opsx:apply` | Zrealizuj zadania z danej zmiany |
| `/opsx:sync` | Połącz specyfikacje delty ze specyfikacjami głównymi |
| `/opsx:archive` | Zarchiwizuj zakończoną zmianę |

### Rozszerzone Komendy Przepływu Pracy (wybór niestandardowego przepływu pracy)

| Command | Purpose |
|---------|---------|
| `/opsx:new` | Rozpocznij nowy szkielet zmiany |
| `/opsx:continue` | Utwórz następny artefakt na podstawie zależności |
| `/opsx:ff` | Przyspieszenie (Fast-forward): utwórz wszystkie artefakty planowania jednocześnie |
| `/opsx:verify` | Zweryfikuj, czy implementacja odpowiada artefaktom |
| `/opsx:bulk-archive` | Zarchiwizuj wiele zmian naraz |
| `/opsx:onboard` | Przewodnik krok po kroku przez cały przepływ pracy |

Domyślnym globalnym profilem jest `core`. Aby włączyć rozszerzone komendy przepływu pracy, uruchom `openspec config profile`, wybierz przepływy pracy, a następnie uruchom `openspec update` w swoim projekcie.

## Odniesienie Komend

### `/opsx:propose`

Tworzy nową zmianę i generuje artefakty planowania w jednym kroku. Jest to domyślna komenda startowa w profilu `core`.

**Składnia:**
```text
/opsx:propose [change-name-or-description]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `change-name-or-description` | Nie | Nazwa w formacie kebab-case lub opis zmiany w języku naturalnym |

**Co to robi:**
- Tworzy katalog `openspec/changes/<change-name>/`
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
- Używaj tego do najszybszej ścieżki od początku do końca
- Jeśli chcesz kontrolować artefakty krok po kroku, włącz rozszerzone przepływy pracy i użyj `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **Zacznij tutaj, gdy nie jesteś pewien.** Explore jest partnerem do myślenia bez ryzyka: czyta bazę kodu, porównuje opcje i przekształca niejasny pomysł w konkretny plan zanim jakakolwiek zmiana zostanie wprowadzona. Jest dostępny w profilu domyślnym. Aby uzyskać pełną wiedzę i więcej przykładów, zapoznaj się z przewodnikiem [Explore First](explore.md).

Przeanalizuj pomysły, zbadaj problemy i wyjaśnij wymagania przed zobowiązaniem się do jakiejkolwiek zmiany.

**Składnia:**
```
/opsx:explore [topic]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `topic` | Nie | Co chcesz zbadać lub przeanalizować |

**Co to robi:**
- Rozpoczyna eksploracyjną rozmowę bez narzucania struktury
- Badana jest baza kodu w celu odpowiedzi na pytania
- Porównuje opcje i podejścia
- Tworzy wizualne diagramy, aby wyjaśnić myślenie
- Może przejść do `/opsx:propose` (domyślnie) lub `/opsx:new` (rozszerzony workflow), gdy wnioski się skrystalizują

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
- Używaj, gdy wymagania są niejasne lub potrzebujesz dogłębnego zbadania tematu
- Podczas eksploracji żadne artefakty nie są tworzone
- Jest dobre do porównywania wielu podejść przed podjęciem decyzji
- Może czytać pliki i przeszukiwać bazę kodu

---

### `/opsx:new`

Rozpocznij nowy szkielet zmiany. Tworzy folder zmiany i czeka na to, aż wygenerujesz artefakty za pomocą `/opsx:continue` lub `/opsx:ff`.

Ta komenda jest częścią rozszerzonego zestawu przepływów pracy (nie jest zawarta w domyślnym profilu `core`).

**Składnia:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `change-name` | Nie | Nazwa folderu zmiany (poproszony, jeśli nie jest podana) |
| `--schema` | Nie | Schemat przepływu pracy do użycia (domyślnie: z konfiguracji lub `spec-driven`) |

**Co to robi:**
- Tworzy katalog `openspec/changes/<change-name>/`
- Tworzy plik metadanych `.openspec.yaml` w folderze zmiany
- Pokazuje pierwszy szablon artefaktu do utworzenia
- Prosi o nazwę i schemat zmiany, jeśli nie są podane

**Co to tworzy:**
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
- Unikaj ogólnych nazw takich jak `update`, `changes`, `wip`
- Schemat można również ustawić w konfiguracji projektu (`openspec/config.yaml`)

---

### `/opsx:continue`

Twórz następny artefakt w łańcuchu zależności. Tworzy po jednym artefakcie dla stopniowego postępu.

**Składnia:**
```
/opsx:continue [change-name]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `change-name` | Nie | Którą zmianę kontynuować (wywniosana z kontekstu, jeśli nie jest podana) |

**Co to robi:**
- Zapytuje o graf zależności artefaktów
- Pokazuje, które artefakty są gotowe, a które są zablokowane
- Tworzy pierwszy gotowy artefakt
- Czyta pliki zależności dla kontekstu
- Pokazuje, co stanie się dostępnym po utworzeniu

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
- Używaj, gdy chcesz przejrzeć każdy artefakt przed kontynuowaniem
- Jest dobre dla złożonych zmian, gdzie potrzebujesz kontroli
- Kilka artefaktów może stać się gotowych jednocześnie
- Możesz edytować utworzone artefakty przed kontynuowaniem

---

### `/opsx:ff`

Przeskocz przez tworzenie artefaktów. Tworzy wszystkie artefakty planowania naraz.

**Składnia:**
```
/opsx:ff [change-name]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `change-name` | Nie | Którą zmianę przeskoczyć (wywniosana z kontekstu, jeśli nie jest podana) |

**Co to robi:**
- Tworzy wszystkie artefakty w kolejności zależności
- Śledzi postęp za pomocą listy zadań
- Zatrzymuje się, gdy wszystkie artefakty `apply-required` zostaną ukończone
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
- Używaj, gdy masz jasny obraz tego, co budujesz
- Jest szybsze niż `/opsx:continue` dla prostych zmian
- Nadal możesz edytować artefakty później
- Dobre do małych i średnich funkcji

---

### `/opsx:apply`

Implementuje zadania z zmiany. Przechodzi przez listę zadań, pisząc kod i odznaczając pozycje.

**Składnia:**
```
/opsx:apply [change-name]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `change-name` | Nie | Którą zmianę implementować (wywniosana z kontekstu, jeśli nie jest podana) |

**Co to robi:**
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
- Może wznowić pracę, jeśli została przerwana
- Używaj do równoległych zmian, podając nazwę zmiany
- Stan ukończenia jest śledzony w polach wyboru `tasks.md`

---

### `/opsx:verify`

Sprawdza, czy implementacja odpowiada artefaktom zmiany. Kontroluje kompletność, poprawność i spójność.

**Składnia:**
```
/opsx:verify [change-name]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `change-name` | Nie | Którą zmianę zweryfikować (wywniosana z kontekstu, jeśli nie jest podana) |

**Co to robi:**
- Sprawdza trzy wymiary jakości implementacji
- Przeszukuje bazę kodu w poszukiwaniu dowodów na implementację
- Raportuje problemy skategoryzowane jako CRITICAL (KRYTYCZNY), WARNING (OSTRZEŻENIE) lub SUGGESTION (SUGESTIA)
- Nie blokuje archiwizacji, ale ujawnia problemy

**Wymiary weryfikacji:**

| Wymiar | Co jest sprawdzane |
|-----------|-------------------|
| **Completeness** | Wszystkie zadania wykonane, wszystkie wymagania zaimplementowane, scenariusze objęte |
| **Correctness** | Implementacja odpowiada intencjom specyfikacji, przypadki brzegowe są obsłużone |
| **Coherence** | Decyzje projektowe odzwierciedlone w kodzie, wzorce są spójne |

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
- Jest dobre do przeglądania pracy AI przed zobowiązaniem się
- Może ujawnić rozbieżność między artefaktami a implementacją

---

### `/opsx:sync`

**Opcjonalna komenda.** Łączy specyfikacje delta z danej zmiany z głównymi specyfikacjami. Archiwizacja poprosi o synchronizację, jeśli to konieczne, więc zazwyczaj nie musisz uruchamiać tego ręcznie.

**Składnia:**
```
/opsx:sync [change-name]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `change-name` | Nie | Którą zmianę zsynchronizować (wywniosana z kontekstu, jeśli nie jest podana) |

**Co to robi:**
- Czyta specyfikacje delta z folderu zmiany
- Parsuje sekcje ADDED/MODIFIED/REMOVED/RENAMED
- Łączy zmiany z głównym katalogiem `openspec/specs/`
- Zachowuje istniejącą zawartość, która nie została wspomniana w delcie
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

| Scenariusz | Użyj sync? |
|----------|-----------|
| Długotrwała zmiana, chcę mieć specyfikacje w głównej wersji przed archiwizacją | Tak |
| Kilka równoległych zmian wymaga zaktualizowanej bazy specyfikacji | Tak |
| Chcę najpierw podglądnąć/przejrzeć połączenie osobno | Tak |
| Szybka zmiana, idę prosto do archiwizacji | Nie (archiwizacja to obsłuży) |

**Wskazówki:**
- Sync jest inteligentny, a nie kopiowaniem i wklejaniem
- Może dodawać scenariusze do istniejących wymagań bez duplikowania
- Zmiana pozostaje aktywna po synchronizacji (nie jest archiwizowana)
- Większość użytkowników nigdy nie będzie musiała tego wywoływać bezpośrednio — archiwizacja poprosi o to, jeśli zajdzie potrzeba

---

### `/opsx:archive`

Archiwizuje ukończoną zmianę. Finalizuje zmianę i przenosi ją do folderu archiwalnego.

**Składnia:**
```
/opsx:archive [change-name]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `change-name` | Nie | Którą zmianę archiwizować (wywniosana z kontekstu, jeśli nie jest podana) |

**Co to robi:**
- Sprawdza status ukończenia artefaktów
- Sprawdza ukończenie zadań (ostrzega, jeśli są nieukończone)
- Oferuje synchronizację specyfikacji delta, jeśli jeszcze nie została zsynchronizowana
- Przenosi folder zmiany do `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Zachowuje wszystkie artefakty dla ścieżki audytu

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
- Archiwowane zmiany są zachowywane dla historii
- Użyj `/opsx:verify` najpierw, aby wykryć problemy

---

### `/opsx:bulk-archive`

Archiwizuje wiele ukończonych zmian naraz. Obsługuje konflikty specyfikacji między zmianami.

**Składnia:**
```
/opsx:bulk-archive [change-names...]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `change-names` | Nie | Konkretne zmiany do archiwizacji (poprosi o wybór, jeśli nie są podane) |

**Co to robi:**
- Lista wszystkie ukończone zmiany
- Waliduje każdą zmianę przed archiwizacją
- Wykrywa konflikty specyfikacji między zmianami
- Rozwiązuje konflikty poprzez sprawdzenie, co zostało faktycznie zaimplementowane
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
- Jest dobre dla równoległych strumieni pracy
- Rozwiązywanie konfliktów jest agentowe (sprawdza bazę kodu)
- Zmiany są archiwizowane w kolejności utworzenia
- Poprosi przed nadpisaniem zawartości specyfikacji

---

### `/opsx:onboard`

Prowadzenie przez pełny przepływ pracy OpenSpec. Interaktywny tutorial wykorzystujący Twoją rzeczywistą bazę kodu.

**Składnia:**
```
/opsx:onboard
```

**Co to robi:**
- Prowadzi przez kompletny cykl pracy z narracją
- Przeszukuje Twoją bazę kodu w celu znalezienia realnych możliwości ulepszenia
- Tworzy rzeczywistą zmianę z prawdziwymi artefaktami
- Implementuje rzeczywistą pracę (małe, bezpieczne zmiany)
- Archiwizuje ukończoną zmianę
- Wyjaśnia każdy krok, gdy ten się dzieje

**Fazy:**
1. Powitanie i analiza bazy kodu
2. Znalezienie możliwości ulepszenia
3. Tworzenie zmiany (`/opsx:new`)
4. Pisanie propozycji
5. Tworzenie specyfikacji
6. Pisanie projektu (design)
7. Tworzenie zadań
8. Implementacja zadań (`/opsx:apply`)
9. Weryfikacja implementacji
10. Archiwizowanie zmiany
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
- Używa prawdziwego kodu, a nie przykładów do zabawy
- Tworzy rzeczywistą zmianę, którą możesz zachować lub odrzucić
- Zajmuje 15-30 minut na ukończenie

## Składnia poleceń dla narzędzi AI

Różne narzędzia AI wykorzystują nieco inną składnię poleceń. Użyj formatu, który odpowiada Twojemu narzędziu:

| Tool | Syntax Example |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Skill-based invocations such as `/skill:openspec-propose`, `/skill:openspec-apply-change` (no generated `opsx-*` command files) |
| Trae | Skill-based invocations such as `/openspec-propose`, `/openspec-apply-change` (no generated `opsx-*` command files) |

Intencja jest taka sama we wszystkich narzędziach, ale sposób prezentowania poleceń może się różnić w zależności od integracji.

> **Uwaga:** Polecenia GitHub Copilot (`.github/prompts/*.prompt.md`) są dostępne tylko w rozszerzeniach IDE (VS Code, JetBrains, Visual Studio). CLI GitHub Copilot nie obsługuje obecnie niestandardowych plików promptów — szczegóły i obejścia znajdziesz na [Supported Tools](supported-tools.md).

---

## Starsze polecenia

Te polecenia wykorzystują starszy tryb pracy „wszystko naraz”. Nadal działają, ale zaleca się używanie poleceń OPSX.

| Command | What it does |
|---------|--------------|
| `/openspec:proposal` | Tworzy wszystkie artefakty jednocześnie (propozycja, specyfikacje, projekt, zadania) |
| `/openspec:apply` | Implementuje zmianę |
| `/openspec:archive` | Archiwuje zmianę |

**Kiedy używać starszych poleceń:**
- W istniejących projektach korzystających ze starego trybu pracy
- Przy prostych zmianach, w których nie jest wymagane stopniowe tworzenie artefaktów
- Gdy preferowany jest podejście „wszystko albo nic”

**Migracja do OPSX:**
Starsze zmiany można kontynuować za pomocą poleceń OPSX. Struktura artefaktów jest kompatybilna.

---

## Ustalanie problemów

### "Change not found" (Zmiana nie została znaleziona)

Polecenie nie było w stanie zidentyfikować, nad jaką zmianą ma pracować.

**Rozwiązania:**
- Podaj wyraźnie nazwę zmiany: `/opsx:apply add-dark-mode`
- Sprawdź, czy folder zmiany istnieje: `openspec list`
- Upewnij się, że jesteś w odpowiednim katalogu projektu

### "No artifacts ready" (Żadne artefakty nie są gotowe)

Wszystkie artefakty są albo ukończone, albo zablokowane brakiem zależności.

**Rozwiązania:**
- Uruchom `openspec status --change <name>`, aby zobaczyć, co blokuje proces
- Sprawdź, czy istnieją wymagane artefakty
- Najpierw utwórz brakujące artefakty zależne

### "Schema not found" (Schemat nie został znaleziony)

Podany schemat nie istnieje.

**Rozwiązania:**
- Wypisz dostępne schematy: `openspec schemas`
- Sprawdź pisownię nazwy schematu
- Utwórz schemat, jeśli jest on niestandardowy: `openspec schema init <name>`

### Commands not recognized (Polecenia nie są rozpoznawane)

Narzędzie AI nie rozpozna poleceń OpenSpec.

**Rozwiązania:**
- Upewnij się, że OpenSpec został zainicjowany: `openspec init`
- Odśwież umiejętności (skills): `openspec update`
- Sprawdź, czy istnieje katalog `.claude/skills/` (dla Claude Code)
- Uruchom ponownie swoje narzędzie AI, aby załadowało nowe umiejętności

### Artifacts not generating properly (Artefakty nie są poprawnie generowane)

AI tworzy niekompletne lub błędne artefakty.

**Rozwiązania:**
- Dodaj kontekst projektu w `openspec/config.yaml`
- Dodaj zasady dla poszczególnych artefaktów, aby zapewnić odpowiednie wskazówki
- Podaj więcej szczegółów w opisie zmiany
- Użyj `/opsx:continue` zamiast `/opsx:ff`, aby uzyskać większą kontrolę

---

## Następne kroki

- [Workflows](workflows.md) - Typowe wzorce i kiedy używać każdego polecenia
- [CLI](cli.md) - Polecenia terminala do zarządzania i walidacji
- [Customization](customization.md) - Tworzenie niestandardowych schematów i przepływów pracy