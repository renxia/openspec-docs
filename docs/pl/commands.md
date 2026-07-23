# Polecenia

Jest to dokumentacja poleceń ukośnikowych OpenSpec. Polecenia te są wywoływane w interfejsie czatu Twojego asystenta kodowania AI (np. Claude Code, Cursor, Windsurf).

Wzorce przepływów pracy oraz informacje o tym, kiedy używać każdego polecenia, znajdziesz w sekcji [Przepływy pracy](workflows.md). Polecenia CLI znajdziesz w sekcji [CLI](cli.md).

## Szybkie odwołanie

### Domyślna ścieżka szybka (profil `core`)

| Polecenie | Cel |
|---------|---------|
| `/opsx:propose` | Utwórz zmianę i wygeneruj artefakty planowania w jednym kroku |
| `/opsx:explore` | Przeanalizuj pomysły przed podjęciem decyzji o wprowadzeniu zmiany |
| `/opsx:apply` | Wykonaj zadania z zakresu zmiany |
| `/opsx:update` | Zaktualizuj artefakty planowania zmiany i zachowaj ich spójność |
| `/opsx:sync` | Scal specyfikacje delta z głównymi specyfikacjami |
| `/opsx:archive` | Archiwizuj zakończoną zmianę |

---

### Rozszerzone polecenia przepływów pracy (wybór niestandardowego przepływu pracy)

| Polecenie | Cel |
|---------|---------|
| `/opsx:new` | Rozpocznij nowy szkielet zmiany |
| `/opsx:continue` | Utwórz kolejny artefakt na podstawie zależności |
| `/opsx:ff` | Fast-forward: utwórz wszystkie artefakty planowania naraz |
| `/opsx:verify` | Sprawdź, czy implementacja jest zgodna z artefaktami |
| `/opsx:bulk-archive` | Archiwizuj wiele zmian naraz |
| `/opsx:onboard` | Przewodnik krok po kroku przez cały przepływ pracy |

Domyślnym globalnym profilem jest `core`. Aby włączyć rozszerzone polecenia przepływów pracy, uruchom `openspec config profile`, wybierz przepływy pracy, a następnie uruchom `openspec update` w swoim projekcie.

## Referencja poleceń

### `/opsx:propose`

Utwórz nową zmianę i wygeneruj artefakty planowania w jednym kroku. To domyślne początkowe polecenie w profilu `core`.

**Składnia:**
```text
/opsx:propose [change-name-or-description]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|-------------|
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
- Użyj tego do najszybszej ścieżki end-to-end
- Jeśli chcesz mieć kontrolę nad artefaktami krok po kroku, włącz rozszerzone przepływy pracy i użyj `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **Zacznij tutaj, gdy nie jesteś pewien.** Explore to partner do myślenia bez ryzyka: czyta bazę kodu, porównuje opcje i doprecyzowuje mglistą ideę w konkretny plan, zanim jakakolwiek zmiana powstanie. Jest dostarczany w domyślnym profilu. Pełny przypadek i więcej przykładów znajdziesz w przewodniku [Explore First](explore.md).

Przemyśl idee, zbadaj problemy i doprecyzuj wymagania przed zobowiązaniem się do zmiany.

**Składnia:**
```
/opsx:explore [topic]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `topic` | Nie | Temat, który chcesz zbadać lub sprawdzić |

**Co robi:**
- Otwiera rozpoczęcie rozmowy eksploracyjnej bez wymogu struktury
- Bada bazę kodu, aby odpowiedzieć na pytania
- Porównuje opcje i podejścia
- Tworzy diagramy wizualne, aby wyjaśnić myśli
- Może przejść do `/opsx:propose` (domyślnie) lub `/opsx:new` (rozszerzony przepływ pracy), gdy spostrzeżenia się krystalizują

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
- Użyj, gdy wymagania są niejasne lub musisz przeprawdzić
- Podczas eksploracji nie są tworzone żadne artefakty
- Dobre do porównania wielu podejść przed podjęciem decyzji
- Może czytać pliki i przeszukiwać bazę kodu

---

### `/opsx:new`

Rozpocznij nowy szkielet zmiany. Tworzy folder zmiany i czeka na wygenerowanie artefaktów za pomocą `/opsx:continue` lub `/opsx:ff`.

To polecenie jest częścią rozszerzonego zestawu przepływów pracy (nie jest uwzględnione w domyślnym profilu `core`).

**Składnia:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `change-name` | Nie | Nazwa folderu zmiany (zostanie wyświetlony monit, jeśli nie zostanie podana) |
| `--schema` | Nie | Schemat przepływu pracy do użycia (domyślnie: z config lub `spec-driven`) |

**Co robi:**
- Tworzy katalog `openspec/changes/<change-name>/`
- Tworzy plik metadanych `.openspec.yaml` w folderze zmiany
- Pokazuje pierwszy szablon artefaktu gotowy do utworzenia
- Wyświetla monit o nazwę zmiany i schemat, jeśli nie zostały podane

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
- Unikaj ogólnych nazw, takich jak `update`, `changes`, `wip`
- Schemat można również ustawić w konfiguracji projektu (`openspec/config.yaml`)

---

### `/opsx:continue`

Utwórz następny artefakt w łańcuchu zależności. Tworzy jeden artefakt na raz dla przyrostowego postępu.

**Składnia:**
```
/opsx:continue [change-name]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `change-name` | Nie | Którą zmianę kontynuować (wywnioskowane z kontekstu, jeśli nie zostanie podane) |

**Co robi:**
- Wysyła zapytanie do grafu zależności artefaktów
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
- Użyj, gdy chcesz przejrzeć każdy artefakt przed kontynuacją
- Dobre dla złożonych zmian, gdzie chcesz mieć kontrolę
- Wiele artefaktów może stać się gotowych jednocześnie
- Możesz edytować utworzone artefakty przed kontynuowaniem

---

### `/opsx:ff`

Przewijanie do przodu przez tworzenie artefaktów. Tworzy wszystkie artefakty planowania naraz.

**Składnia:**
```
/opsx:ff [change-name]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `change-name` | Nie | Którą zmianę przewinąć do przodu (wywnioskowane z kontekstu, jeśli nie zostanie podane) |

**Co robi:**
- Tworzy wszystkie artefakty w kolejności zależności
- Śledzi postęp za pomocą listy zadań do zrobienia
- Zatrzymuje się, gdy wszystkie artefakty wymagające `apply` są kompletne
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
- Dobre dla małych i średnich funkcji

---

### `/opsx:apply`

Wdróż zadania ze zmiany. Pracuje przez listę zadań, pisząc kod i odhaczając elementy.

**Składnia:**
```
/opsx:apply [change-name]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `change-name` | Nie | Którą zmianę wdrożyć (wywnioskowane z kontekstu, jeśli nie zostanie podane) |

**Co robi:**
- Czyta `tasks.md` i identyfikuje niekompletne zadania
- Pracuje przez zadania jedno po drugim
- Pisze kod, tworzy pliki, uruchamia testy w razie potrzeby
- Oznacza zadania jako kompletne za pomocą pól wyboru `[x]`

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
- Może wznowić pracę od miejsca, w którym przerwano
- Użyj dla równoległych zmian, określając nazwę zmiany
- Stan ukończenia jest śledzony w polach wyboru `tasks.md`

---

### `/opsx:update`

Zweryfikuj istniejące artefakty planowania zmiany i zachowaj ich spójność. Tylko artefakty planowania - nigdy nie edytuje kodu.

**Składnia:**

```text
/opsx:update [change-name]
```

**Argumenty:**

| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `change-name` | Nie | Którą zmianę zaktualizować (wywnioskowane z kontekstu, jeśli nie zostanie podane) |

**Co robi:**

- Czyta artefakty zmiany za pomocą `openspec status --change <name> --json`
- Stosuje żądaną rewizję lub przegląda artefakty pod kątem sprzeczności, jeśli nie nazwałeś żadnej
- Uzgodnia pozostałe istniejące artefakty w dowolnym kierunku (edycja projektu może mieć wpływ z powrotem na propozycję)
- Potwierdza każdą edycję z Tobą przed zapisaniem, jeden artefakt na raz
- Kończy się rekomendacją następnego kroku: `/opsx:continue` (brakujące artefakty), `/opsx:apply` (przenieś zmodyfikowany plan do kodu) lub `/opsx:archive` (wszystko zrobione)

**Przykład:**

```text
You: /opsx:update add-dark-mode - we're storing the theme in a cookie now, not localStorage

AI:  Reading add-dark-mode artifacts...

     The design references localStorage in two places; tasks 1.3 covers
     localStorage persistence; the proposal doesn't mention storage.

     Proposed revisions:
     1. design.md - swap localStorage decision for cookie storage
     2. tasks.md - reword task 1.3 to cookie persistence

     Apply revision 1? (design.md)
```

**Wskazówki:**

- Nie utworzy brakujących artefaktów - to robi `/opsx:continue`
- Jeśli zmiana została już wdrożona, kontynuuj za pomocą `/opsx:apply`, aby kod odpowiadał zmodyfikowanemu planowi
- Jeśli Twoja rewizja zmienia *intencję* zmiany, zacznij od nowa z nową zmianą (zobacz [Kiedy aktualizować, a kiedy zaczynać od nowa](opsx.md#when-to-update-vs-start-fresh))

---

### `/opsx:verify`

Sprawdź, czy implementacja odpowiada Twoim artefaktom zmiany. Sprawdza kompletność, poprawność i spójność.

**Składnia:**
```
/opsx:verify [change-name]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `change-name` | Nie | Którą zmianę zweryfikować (wywnioskowane z kontekstu, jeśli nie zostanie podane) |

**Co robi:**
- Sprawdza trzy wymiary jakości implementacji
- Przeszukuje bazę kodu pod kątem dowodów na implementację
- Zgłasza problemy skategoryzowane jako CRITICAL, WARNING lub SUGGESTION
- Nie blokuje archiwizacji, ale ujawnia problemy

**Wymiary weryfikacji:**

| Wymiar | Co waliduje |
|-----------|-------------------|
| **Kompletność** | Wszystkie zadania wykonane, wszystkie wymagania zaimplementowane, scenariusze objęte |
| **Poprawność** | Implementacja odpowiada intencji specyfikacji, przypadki brzegowe obsłużone |
| **Spójność** | Decyzje projektowe odzwierciedlone w kodzie, wzorce spójne |

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
- Dobre do przeglądu pracy AI przed zatwierdzeniem
- Może ujawnić dryf między artefaktami a implementacją

---

### `/opsx:sync`

**Polecenie opcjonalne.** Scal specyfikacje delta ze zmiany w główne specyfikacje. Archiwum wyświetli monit o synchronizację w razie potrzeby, więc zazwyczaj nie musisz uruchamiać tego ręcznie.

**Składnia:**
```
/opsx:sync [change-name]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `change-name` | Nie | Którą zmianę zsynchronizować (wywnioskowane z kontekstu, jeśli nie zostanie podane) |

**Co robi:**
- Czyta specyfikacje delta z folderu zmiany
- Analizuje sekcje ADDED/MODIFIED/REMOVED/RENAMED
- Scal zmiany w główny katalog `openspec/specs/`
- Zachowuje istniejącą zawartość niezmienioną w delta
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
|----------|-----------|
| Długotrwała zmiana, chcesz mieć specyfikacje w głównym przed archiwizacją | Tak |
| Wiele równoległych zmian potrzebuje zaktualizowanych podstawowych specyfikacji | Tak |
| Chcesz podglądu/przejrzenia scalenia osobno | Tak |
| Szybka zmiana, przechodząc bezpośrednio do archiwum | Nie (archiwum obsłuży to) |

**Wskazówki:**
- Synchronizacja jest inteligentna, a nie kopiuj-wklej
- Może dodawać scenariusze do istniejących wymagań bez duplikowania
- Zmiana pozostaje aktywna po synchronizacji (nie zarchiwizowana)
- Większość użytkowników nigdy nie będzie musiała wywoływać tego bezpośrednio — archiwum wyświetli monit w razie potrzeby

---

### `/opsx:archive`

Archiwizuj ukończoną zmianę. Finalizuje zmianę i przenosi ją do folderu archiwum.

**Składnia:**
```
/opsx:archive [change-name]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `change-name` | Nie | Którą zmianę zarchiwizować (wywnioskowane z kontekstu, jeśli nie zostanie podane) |

**Co robi:**
- Sprawdza stan ukończenia artefaktów
- Sprawdza ukończenie zadań (ostrzega, jeśli niekompletne)
- Oferuje synchronizację specyfikacji delta, jeśli nie zostały jeszcze zsynchronizowane
- Przenosi folder zmiany do `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Zachowuje wszystkie artefakty na potrzeby ścieżki audytu

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
- Archiwum nie zablokuje się na niekompletnych zadaniach, ale ostrzeże
- Specyfikacje delta mogą być zsynchronizowane podczas archiwizacji lub wcześniej
- Zarchiwizowane zmiany są zachowywane dla historii
- Użyj najpierw `/opsx:verify`, aby wyłapać problemy

---

### `/opsx:bulk-archive`

Archiwizuj wiele ukończonych zmian naraz. Obsługuje konflikty specyfikacji między zmianami.

**Składnia:**
```
/opsx:bulk-archive [change-names...]
```

**Argumenty:**
| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `change-names` | Nie | Konkretne zmiany do zarchiwizowania (monituje o wybór, jeśli nie zostaną podane) |

**Co robi:**
- Wyświetla listę wszystkich ukończonych zmian
- Waliduje każdą zmianę przed archiwizacją
- Wykrywa konflikty specyfikacji między zmianami
- Rozwiązuje konflikty, sprawdzając, co faktycznie zaimplementowano
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
- Dobre dla równoległych strumieni pracy
- Rozwiązywanie konfliktów jest agentowe (sprawdza bazę kodu)
- Zmiany są archiwizowane w kolejności ich utworzenia
- Monituje przed nadpisaniem zawartości specyfikacji

---

### `/opsx:onboard`

Kierowany onboarding przez kompletny przepływ pracy OpenSpec. Interaktywny samouczek używający Twojej rzeczywistej bazy kodu.

**Składnia:**
```
/opsx:onboard
```

**Co robi:**
- Przechodzi przez kompletny cykl przepływu pracy z narracją
- Skanuje Twoją bazę kodu pod kątem rzeczywistych możliwości poprawy
- Tworzy rzeczywistą zmianę z prawdziwymi artefaktami
- Wdraża rzeczywistą pracę (małe, bezpieczne zmiany)
- Archiwizuje ukończoną zmianę
- Wyjaśnia każdy krok w trakcie jego wykonywania

**Fazy:**
1. Powitanie i analiza bazy kodu
2. Znajdowanie możliwości poprawy
3. Tworzenie zmiany (`/opsx:new`)
4. Pisanie propozycji
5. Tworzenie specyfikacji
6. Pisanie projektu
7. Tworzenie zadań
8. Wdrażanie zadań (`/opsx:apply`)
9. Weryfikacja implementacji
10. Archiwizacja zmiany
11. Podsumowanie i następne kroki

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
- Używa prawdziwego kodu, a nie przykładów zabawkowych
- Tworzy prawdziwą zmianę, którą możesz zachować lub odrzucić
- Zajmuje 15-30 minut

---

## Składnia poleceń według narzędzia AI

Różne narzędzia AI używają nieco innej składni poleceń. Używaj formatu zgodnego z Twoim narzędziem:

| Narzędzie | Przykład składni |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | Wywołania oparte na umiejętnościach, np. `/openspec-propose`, `/openspec-apply-change` (nie generują plików poleceń `opsx-*`) |
| Codex | Wywołania oparte na umiejętnościach z katalogu `.codex/skills/openspec-*` (nie generują plików promptów `opsx-*`) |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi Code | Wywołania oparte na umiejętnościach, np. `/skill:openspec-propose`, `/skill:openspec-apply-change` (nie generują plików poleceń `opsx-*`) |
| Trae | `/opsx-propose`, `/opsx-apply` |

Zamiar jest taki sam we wszystkich narzędziach, ale sposób udostępniania poleceń może się różnić w zależności od integracji.

> **Uwaga:** Polecenia GitHub Copilot (`.github/prompts/*.prompt.md`) są dostępne wyłącznie w rozszerzeniach IDE (VS Code, JetBrains, Visual Studio). GitHub Copilot CLI obecnie nie obsługuje niestandardowych plików promptów — szczegóły i obejścia znajdziesz w sekcji [Obsługiwane narzędzia](supported-tools.md).

---

## Polecenia starszej wersji

Te polecenia używają starszego przepływu pracy "wszystko naraz". Nadal działają, ale zaleca się używanie poleceń OPSX.

| Polecenie | Co robi |
|---------|--------------|
| `/openspec:proposal` | Tworzy wszystkie artefakty naraz (propozycję, specyfikacje, projekt, zadania) |
| `/openspec:apply` | Wdraża zmianę |
| `/openspec:archive` | Archiwizuje zmianę |

**Kiedy używać poleceń starszej wersji:**
- Istniejące projekty korzystające ze starego przepływu pracy
- Proste zmiany, przy których nie potrzebujesz przyrostowego tworzenia artefaktów
- Preferencja dla podejścia "wszystko lub nic"

**Migracja do OPSX:**
Zmiany z starszej wersji można kontynuować za pomocą poleceń OPSX. Struktura artefaktów jest zgodna.

---

## Rozwiązywanie problemów

### "Nie znaleziono zmiany"

Polecenie nie mogło zidentyfikować, na której zmianie ma pracować.

**Rozwiązania:**
- Podaj jawnie nazwę zmiany: `/opsx:apply add-dark-mode`
- Sprawdź, czy folder zmiany istnieje: `openspec list`
- Sprawdź, czy znajdujesz się we właściwym katalogu projektu

### "Brak gotowych artefaktów"

Wszystkie artefakty są albo ukończone, albo zablokowane z powodu brakujących zależności.

**Rozwiązania:**
- Uruchom `openspec status --change <name>`, aby sprawdzić, co blokuje pracę
- Sprawdź, czy wymagane artefakty istnieją
- Najpierw utwórz brakujące artefakty zależności

### "Nie znaleziono schematu"

Określony schemat nie istnieje.

**Rozwiązania:**
- Wyświetl listę dostępnych schematów: `openspec schemas`
- Sprawdź pisownię nazwy schematu
- Utwórz schemat, jeśli jest niestandardowy: `openspec schema init <name>`

### Polecenia nie rozpoznawane

Narzędzie AI nie rozpoznaje poleceń OpenSpec.

**Rozwiązania:**
- Upewnij się, że OpenSpec jest zainicjowany: `openspec init`
- Wygeneruj ponownie umiejętności: `openspec update`
- Sprawdź, czy katalog `.claude/skills/` istnieje (dla Claude Code)
- Uruchom ponownie narzędzie AI, aby załadowało nowe umiejętności

### Artefakty generują się nieprawidłowo

AI tworzy niekompletne lub nieprawidłowe artefakty.

**Rozwiązania:**
- Dodaj kontekst projektu w pliku `openspec/config.yaml`
- Dodaj reguły dla poszczególnych artefaktów w celu uzyskania szczegółowych wskazówek
- Podaj więcej szczegółów w opisie zmiany
- Używaj `/opsx:continue` zamiast `/opsx:ff`, aby mieć większą kontrolę

---

## Następne kroki

- [Przepłyły pracy](workflows.md) – Typowe wzorce i kiedy używać każdego polecenia
- [CLI](cli.md) – Polecenia terminala do zarządzania i walidacji
- [Dostosowywanie](customization.md) – Tworzenie niestandardowych schematów i przepływów pracy