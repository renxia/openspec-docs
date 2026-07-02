# Rozwiązywanie problemów

Konkretne rozwiązania na konkretne problemy. Każdy wpis podaje objaw, wyjaśnia prawdopodobną przyczynę w jednym zdaniu i przedstawia rozwiązanie. Jeśli nie znalazłeś swojego problemu, [FAQ](faq.md) może pomóc, a [Discord](https://discord.gg/YctCnvvshC) na pewno.

## Instalacja i konfiguracja

### `openspec: command not found`

CLI nie jest zainstalowane lub Twoja powłoka (shell) go nie znajduje. Zainstaluj je globalnie i sprawdź:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Jeśli zostało zainstalowane, ale nadal nie jest znajdowane, prawdopodobnie katalog bin dla npm został przez Ciebie pominięty w zmiennej `PATH`. Uruchomienie `npm bin -g` pokaże, gdzie znajdują się globalne pliki wykonywalne (binaries), upewnij się, że ta ścieżka znajduje się w profilu Twojej powłoki.

### "Requires Node.js 20.19.0 or higher"

OpenSpec działa na Node 20.19.0+. Sprawdź swoją wersję i zaktualizuj, jeśli to konieczne:

```bash
node --version
```

Jeśli używasz bun do instalacji OpenSpec, pamiętaj, że OpenSpec *działa* na Node, więc potrzebujesz dostępnego w `PATH` Node 20.19.0 lub nowszej wersji. Odwołaj się do [Instalacji](installation.md).

### `openspec init` nie skonfigurował mojego narzędzia AI

Init pyta, które narzędzia należy skonfigurować. Jeśli pominąłeś swoje narzędzie lub chcesz dodać inne, po prostu uruchom to ponownie lub użyj formy nieinteraktywnej:

```bash
openspec init --tools claude,cursor
```

Pełna lista ID narzędzi znajduje się w [Obsługiwanych Narzędziach](supported-tools.md). Użyj `--tools all` dla wszystkich, a `--tools none`, aby pominąć konfigurację narzędzi.

## Komendy nie pojawiają się

Jeśli `/opsx:propose` (lub odpowiednik Twojego narzędzia) nie pojawia się lub nic nie robi, przejdź przez tę listę. Są one uporządkowane od najszybszego do sprawdzenia.

1. **Możesz być w złym miejscu.** Komendy z ukośnikiem (slash commands) należy używać w czacie swojego asystenta AI, a nie w terminalu. Jeśli wpisałeś `/opsx:propose` do swojej powłoki, to jest problem. Odwołaj się do [Jak działają komendy](how-commands-work.md).

2. **Wygeneruj ponownie pliki.** Z katalogu głównego swojego projektu:

   ```bash
   openspec update
   ```

   To przepisuje pliki umiejętności (skill) i komend dla każdego skonfigurowanego narzędzia.

3. **Uruchom ponownie asystenta.** Większość narzędzi skanuje umiejętności i komendy przy starcie. Nowe okno często to rozwiązuje.

4. **Potwierdź, że pliki istnieją.** Dla Claude Code sprawdź, czy `.claude/skills/` zawiera foldery `openspec-*`. Inne narzędzia używają własnych katalogów, wszystkie wymienione w [Obsługiwanych Narzędziach](supported-tools.md).

5. **Potwierdź, że zainicjowałeś ten projekt.** Umiejętności są pisane na poziomie projektu. Jeśli sklonowałeś repozytorium lub zmieniłeś foldery, uruchom `openspec init` (lub `openspec update`) w tym miejscu.

6. **Potwierdź, że Twoje narzędzie obsługuje pliki komend.** Kilka narzędzi (Kimi CLI, Trae, ForgeCode, Mistral Vibe) nie generuje plików komend `opsx-*`; używają one wywołań opartych na umiejętnościach. Formy różnią się dla każdego narzędzia: sprawdź [Obsługiwane Narzędzia](supported-tools.md) i [Jak działają komendy](how-commands-work.md#slash-command-syntax-by-tool).

## Praca z zmianami

### "Change not found" (Zmiana nie znaleziona)

Komenda nie była w stanie określić, o jaką zmianę chodziło. Podaj jej nazwę jawnie lub sprawdź, jakie zmiany istnieją:

```bash
openspec list                    # zobacz aktywne zmiany
/opsx:apply add-dark-mode        # nazwij zmianę w czacie
```

Potwierdź również, że jesteś w odpowiednim katalogu projektu.

### "No artifacts ready" (Żadne artefakty nie są gotowe)

Każdy artefakt jest albo już utworzony, albo zablokowany oczekując na zależność. Sprawdź, co blokuje:

```bash
openspec status --change <name>
```

Następnie utwórz brakujące zależności. Pamiętaj o kolejności: propozycja umożliwia specyfikacje i projekt; specyfikacje i projekt razem umożliwiają zadania (tasks).

### `openspec validate` zgłasza ostrzeżenia lub błędy

Walidacja sprawdza Twoje specyfikacje i zmiany pod kątem problemów strukturalnych. Przeczytaj komunikat: podaje on plik i problem.

```bash
openspec validate <name>           # waliduj jeden element
openspec validate --all            # waliduj wszystko
openspec validate --all --strict   # bardziej rygorystyczne sprawdzenia, dobre do CI
```

Najczęstszymi przyczynami są brakująca wymagana sekcja (np. specyfikacja bez scenariuszy) lub źle utworzony nagłówek delty. Napraw plik i uruchom ponownie. [Odwołanie CLI](cli.md#openspec-validate) dokumentuje format wyjściowy.

### AI stworzyło niekompletne lub błędne artefakty

AI nie miało wystarczającego kontekstu. Kilka rozwiązań może pomóc:

*   Dodaj kontekst projektu w `openspec/config.yaml`, aby Twoja struktura i konwencje były wstrzykiwane do każdego żądania. Odwołaj się do [Personalizacji](customization.md#project-configuration).
*   Dodaj reguły (`rules:`) na poziomie artefaktu dla wskazówek, które mają zastosowanie tylko np. do specyfikacji.
*   Podaj bardziej szczegółowy opis podczas proponowania.
*   Użyj rozszerzonego `/opsx:continue`, aby tworzyć po kolei jeden artefakt i przejrzeć go, zamiast `/opsx:ff` robiącego to wszystko naraz.

### Archiwum nie kończy się lub ostrzega o niekompletnych zadaniach

Archiwum nie będzie *blokować* z powodu niekompletnych zadań, ale ostrzega Cię, ponieważ archiwizacja zazwyczaj oznacza, że praca jest skończona. Jeśli zadania pozostają celowo (czyli składasz częściową zmianę), postępuj dalej. W przeciwnym razie ukończ najpierw zadania. Archiwum zaoferuje również synchronizację Twoich specyfikacji delty do głównych, jeśli jeszcze tego nie zrobiłeś; odpowiedz tak, chyba że masz powód, by odmówić.

## Konfiguracja

### Moje `config.yaml` nie jest stosowane

Trzy typowe podejrzane elementy:

1.  **Nieprawidłowa nazwa pliku.** Musi to być `openspec/config.yaml`, a nie `.yml`.
2.  **Nieważny YAML.** Przejdź go przez dowolnego walidatora YAML; CLI również zgłasza błędy składniowe z numerami linii.
3.  **Oczekiwałeś ponownego uruchomienia.** Nie jest to konieczne. Zmiany konfiguracji mają natychmiastowy wpływ.

### "Unknown artifact ID in rules: X" (Nieznany ID artefaktu w regułach: X)

Klucz pod `rules:` nie pasuje do żadnego artefaktu w Twoim schemacie. Dla domyślnego schematu `spec-driven` ważne ID to `proposal`, `specs`, `design`, `tasks`. Aby zobaczyć ID dla dowolnego schematu:

```bash
openspec schemas --json
```

### "Context too large" (Zbyt duży kontekst)

Poledko `context:` jest ograniczone do 50KB, celowo, ponieważ jest wstrzykiwane do każdego żądania. Podsumuj go lub podaj linki do dłuższej dokumentacji zamiast wklejać całość. Lekki kontekst daje również lepsze i szybsze rezultaty.

### "Schema not found" (Schemat nie został znaleziony)

Nazwa schematu, którą podałeś, nie istnieje. Wypisz dostępne schematy i sprawdź pisownię:

```bash
openspec schemas                    # lista dostępnych schematów
openspec schema which <name>        # zobacz, skąd rozstrzyga się schemat
openspec schema init <name>         # utwórz własny
```

Odwołaj się do [Personalizacji](customization.md#custom-schemas).

## Migracja ze starego przepływu pracy (legacy workflow)

### "Legacy files detected in non-interactive mode" (Stare pliki wykryte w trybie nieinteraktywnym)

Jesteś w CI lub w powłoce nieinteraktywnej, a OpenSpec znalazł stare pliki do czyszczenia, ale nie może Cię poprosić o zatwierdzenie. Zatwierdź automatycznie:

```bash
openspec init --force
```

### Komendy nie pojawiły się po migracji

Uruchom ponownie IDE. Umiejętności są wykrywane przy starcie. Jeśli nadal nie pojawiają się, uruchom `openspec update` i sprawdź lokalizacje plików w [Obsługiwanych Narzędziach](supported-tools.md).

### Mój stary `project.md` nie został zmigrowany

To jest celowe. OpenSpec nigdy automatycznie nie usuwa `project.md`, ponieważ może on zawierać kontekst, który Ty napisałeś. Przenieś użyteczne części do sekcji `context:` w `config.yaml`, a następnie sam usuń ten plik. [Przewodnik Migracji](migration-guide.md#migrating-projectmd-to-configyaml) opisuje to procesowo, włączając podpowiedź, którą możesz przekazać swojemu AI do destylacji.

## Nadal utknąłeś?

*   **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
*   **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
*   **Z terminala:** `openspec feedback "co poszło nie tak"` utworzy dla Ciebie zgłoszenie (issue).

Gdy zgłaszasz problem, dołącz wersję OpenSpec (`openspec --version`), wersję Node (`node --version`), swoje narzędzie AI oraz dokładną komendę i wynik. To znacznie przyspiesza pomoc.