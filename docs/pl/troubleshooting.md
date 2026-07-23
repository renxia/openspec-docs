# Rozwiązywanie problemów

Konkretne rozwiązania dla konkretnych problemów. Każdy wpis opisuje objaw, wyjaśnia prawdopodobną przyczynę w jednym zdaniu i podaje rozwiązanie. Jeśli nie znajdziesz tutaj swojego problemu, [FAQ](faq.md) może pomóc, a [Discord](https://discord.gg/YctCnvvshC) na pewno pomoże.

## Instalacja i konfiguracja

### `openspec: command not found`

Interfejs CLI nie jest zainstalowany lub Twoja powłoka go nie może znaleźć. Zainstaluj go globalnie i sprawdź:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Jeśli został zainstalowany, ale nadal nie jest znaleziony, prawdopodobnie globalny katalog binarny npm nie znajduje się w Twojej zmiennej `PATH`. Uruchom `npm bin -g`, aby zobaczyć, gdzie znajdują się globalne pliki binarne, i upewnij się, że ta ścieżka jest w profilu Twojej powłoki.

### "Requires Node.js 20.19.0 or higher"

OpenSpec działa na Node 20.19.0+. Sprawdź swoją wersję i zaktualizuj w razie potrzeby:

```bash
node --version
```

Jeśli używasz bun do zainstalowania OpenSpec, pamiętaj, że OpenSpec nadal *działa* na Node, więc potrzebujesz Node 20.19.0+ dostępnego w swojej zmiennej `PATH` niezależnie od sposobu instalacji. Zobacz [Instalacja](installation.md).

### `openspec init` nie skonfigurował mojego narzędzia AI

Init pyta, które narzędzia skonfigurować. Jeśli pominąłeś swoje narzędzie lub chcesz dodać kolejne, po prostu uruchom ponownie lub użyj formy nieinteraktywnej:

```bash
openspec init --tools claude,cursor
```

Pełna lista identyfikatorów narzędzi znajduje się w [Obsługiwane narzędzia](supported-tools.md). Użyj `--tools all` dla wszystkiego, `--tools none` aby pominąć konfigurację narzędzi.

## Polecenia nie pojawiają się

Jeśli `/opsx:propose` (lub odpowiednik Twojego narzędzia) nie pojawia się lub nie robi nic, przejdź przez tę listę. Są uporządkowane od najszybszych do sprawdzenia.

1. **Możesz być w złym miejscu.** Polecenia z ukośnikiem trafiają na czat Twojego asystenta AI, nie do terminala. Jeśli wpisałeś `/opsx:propose` w powłoce, to jest problem. Zobacz [Jak działają polecenia](how-commands-work.md).

2. **Wygeneruj ponownie pliki.** Z katalogu głównego projektu:

   ```bash
   openspec update
   ```

   To przepisuje pliki umiejętności i poleceń dla każdego skonfigurowanego narzędzia.

3. **Uruchom ponownie asystenta.** Większość narzędzi skanuje umiejętności i polecenia przy starcie. Świeże okno często rozwiązuje problem.

4. **Potwierdź, że pliki istnieją.** Dla Claude Code sprawdź, czy `.claude/skills/` zawiera foldery `openspec-*`. Inne narzędzia używają własnych katalogów, wszystkie wymienione w [Obsługiwane narzędzia](supported-tools.md).

5. **Sprawdź, czy zainicjowałeś ten projekt.** Umiejętności są zapisywane per projekt. Jeśli sklonowałeś repozytorium lub zmieniłeś katalog, uruchom `openspec init` (lub `openspec update`) w tym miejscu.

6. **Potwierdź, że Twoje narzędzie obsługuje pliki poleceń.** Codex i kilka innych narzędzi (CodeArts, Kimi CLI, ForgeCode, Mistral Vibe) nie otrzymują generowanych plików poleceń `opsx-*`; zamiast tego używają wywołań opartych na umiejętnościach. Dla Codex sprawdź `.codex/skills/openspec-*`. Formy różnią się per narzędzie: zobacz [Obsługiwane narzędzia](supported-tools.md) i [Jak działają polecenia](how-commands-work.md#slash-command-syntax-by-tool).

## Praca ze zmianami

### "Change not found"

Polecenie nie mogło określić, o którą zmianę chodzi. Nazwij ją jawnie lub sprawdź, co istnieje:

```bash
openspec list                    # zobacz aktywne zmiany
/opsx:apply add-dark-mode        # nazwij zmianę na czacie
```

Potwierdź również, że jesteś w właściwym katalogu projektu.

### "No artifacts ready"

Każdy artefakt jest już utworzony lub zablokowany, czekając na zależność. Sprawdź, co blokuje:

```bash
openspec status --change <name>
```

Najpierw utwórz brakującą zależność. Pamiętaj o kolejności: propozycja odblokowuje specyfikacje i projekt; specyfikacje i projekt razem odblokowują zadania.

### `openspec validate` zgłasza ostrzeżenia lub błędy

Walidacja sprawdza Twoje specyfikacje i zmiany pod kątem problemów strukturalnych. Przeczytaj komunikat: wymienia plik i problem.

```bash
openspec validate <name>           # waliduj jeden element
openspec validate --all            # waliduj wszystko
openspec validate --all --strict   # surowsze sprawdzenia, dobre dla CI
```

Typowe przyczyny to brakująca wymagana sekcja (np. specyfikacja bez scenariuszy) lub nieprawidłowy nagłówek delty. Napraw plik i uruchom ponownie. [Dokumentacja CLI](cli.md#openspec-validate) opisuje format wyjścia.

### AI utworzyło niekompletne lub błędne artefakty

AI nie miało wystarczającego kontekstu. Kilka dźwigni pomaga:

- Dodaj kontekst projektu w `openspec/config.yaml`, aby Twój stos technologiczny i konwencje były wstrzykiwane w każdym żądaniu. Zobacz [Dostosowywanie](customization.md#project-configuration).
- Dodaj `rules:` per artefakt dla wskazówek, które dotyczą tylko np. specyfikacji.
- Podaj bardziej szczegółowy opis podczas propozycji.
- Użyj rozszerzonego `/opsx:continue`, aby tworzyć artefakty po jednym i przeglądać każdy, zamiast `/opsx:ff` robiącego wszystko naraz.

### Archiwizacja nie kończy się lub ostrzega o niekompletnych zadaniach

Archiwizacja nie *blokuje* się na niekompletnych zadaniach, ale ostrzega, ponieważ archiwizacja zazwyczaj oznacza, że praca jest skończona. Jeśli zadania pozostają celowo (archiwizujesz częściową zmianę), kontynuuj. W przeciwnym razie najpierw zakończ zadania. Archiwizacja zaproponuje również synchronizację Twoich specyfikacji delty do głównych specyfikacji, jeśli jeszcze nie zsynchronizowałeś; powiedz tak, chyba że masz powód, by tego nie robić.

## Konfiguracja

### Mój `config.yaml` nie jest stosowany

Trzy typowe podejrzane:

1. **Zła nazwa pliku.** Musi to być `openspec/config.yaml`, nie `.yml`.
2. **Nieprawidłowy YAML.** Prześlij go przez dowolny walidator YAML; CLI również zgłasza błędy składni z numerami linii.
3. **Oczekiwałeś restartu.** Nie musisz. Zmiany konfiguracji wchodzą w życie natychmiast.

### "Unknown artifact ID in rules: X"

Klucz pod `rules:` nie pasuje do żadnego artefaktu w Twoim schemacie. Dla domyślnego schematu `spec-driven` prawidłowe identyfikatory to `proposal`, `specs`, `design`, `tasks`. Aby zobaczyć identyfikatory dla dowolnego schematu:

```bash
openspec schemas --json
```

### "Context too large"

Pole `context:` jest ograniczone do 50KB, celowo, ponieważ jest wstrzykiwane w każdym żądaniu. Podsumuj je lub podaj link do dłuższej dokumentacji zamiast wklejać. Lżejszy kontekst daje również lepsze, szybsze wyniki.

### "Schema not found"

Nazwa schematu, do której się odwołujesz, nie istnieje. Wyświetl dostępne i sprawdź pisownię:

```bash
openspec schemas                    # wyświetl dostępne schematy
openspec schema which <name>        # zobacz, skąd schemat się rozwiązuje
openspec schema init <name>         # utwórz niestandardowy
```

Zobacz [Dostosowywanie](customization.md#custom-schemas).

## Migracja ze starszego przepływu pracy

### "Legacy files detected in non-interactive mode"

Jesteś w CI lub nieinteraktywnej powłoce, a OpenSpec znalazł stare pliki do wyczyszczenia, ale nie może zapytać Cię o zgodę. Zatwierdź automatycznie:

```bash
openspec init --force
```

Dla Codex, OpenSpec może wykryć stare zarządzane pliki promptów w `$CODEX_HOME/prompts` lub `~/.codex/prompts`. To oczyszczanie jest ograniczone do listy dozwolonych nazw plików legacy Codex OpenSpec, a nieinteraktywny `openspec init` usuwa tylko pliki, dla których istnieją zastępcze umiejętności `.codex/skills/openspec-*`. Nieinteraktywny `openspec update` pozostawia całe oczyszczanie legacy bez zmian, chyba że przekażesz `--force`.

### Polecenia nie pojawiły się po migracji

Uruchom ponownie swoje IDE. Umiejętności są wykrywane przy starcie. Jeśli nadal się nie pojawiają, uruchom `openspec update` i sprawdź lokalizacje plików w [Obsługiwane narzędzia](supported-tools.md).

### Mój stary `project.md` nie został zmigrowany

To celowe. OpenSpec nigdy nie usuwa `project.md` automatycznie, ponieważ może zawierać kontekst, który napisałeś. Przenieś przydatne części do sekcji `context:` w `config.yaml`, a następnie usuń go samodzielnie. [Przewodnik migracji](migration-guide.md#migrating-projectmd-to-configyaml) przeprowadzi Cię przez ten proces, w tym prompt, który możesz przekazać swojemu AI do wykonania dystylacji.

## Wciąż utknąłeś?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Z terminala:** `openspec feedback "what went wrong"` otworzy zgłoszenie dla Ciebie.

Zgłaszając problem, podaj swoją wersję OpenSpec (`openspec --version`), swoją wersję Node (`node --version`), swoje narzędzie AI oraz dokładne polecenie i wynik. To znacznie przyspiesza pomoc.