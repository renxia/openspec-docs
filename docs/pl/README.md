# Dokumentacja OpenSpec

Witamy. To jest centrum wszystkich informacji o OpenSpec.

OpenSpec pomaga Tobie i Twojemu asystentowi AI do kodowania **uzgodnić, co należy zbudować, zanim zostanie napisany jakikolwiek kod.** Ty opisujesz zmianę, AI szkicuje krótką specyfikację i listę zadań, oboje przeglądacie ten sam plan, a następnie praca się realizowana. Koniec z odkrywaniem w połowie drogi, że AI zbudowało coś nieprawidłowego.

Jeśli przeczytasz tylko dwie strony:

1. [Getting Started](getting-started.md): instalacja, inicjalizacja i wypuszczenie pierwszej zmiany.
2. [How Commands Work](how-commands-work.md): gdzie faktycznie wpisujesz `/opsx:propose` (wskazówka: w czacie AI, a nie w terminalu). To pułapka dla prawie każdego na początku.

Druga ta jest ważniejsza, niż się wydaje. OpenSpec ma dwie części: narzędzie liniowe, które uruchamiasz w terminalu, oraz komendy ze ukośnikiem (slash commands), które podajesz swojemu asystentowi AI. Wiedza, która jest która, oszczędzi Ci najczęstszy moment nieporozumienia.

> **Najlepszy nawyk do wyrobienia na początku: gdy nie jesteś pewien, co należy zbudować, zacznij od `/opsx:explore`.** Jest to partner do myślenia bez ryzyka, który czyta Twój kod, waży opcje i przekształca mgliste pomysły w konkretny plan, zanim powstanie jakikolwiek artefakt lub kod. Przewodnik [Explore First](explore.md) potwierdza tę tezę.

## Wybierz swoją ścieżkę

**Jestem zupełnie nowy.** Zacznij od [Getting Started](getting-started.md), a następnie przejrzyj [Core Concepts at a Glance](overview.md). Gdy coś wydaje się tajemnicze, blisko są [FAQ](faq.md) i [Glossary](glossary.md).

**Mam problem, ale nie mam planu.** To jest najczęstszy przypadek, a ma on dedykowaną odpowiedź: [Explore First](explore.md). Użyj `/opsx:explore`, aby przeanalizować to z AI, zanim zobowiążesz się do czegokolwiek.

**Mam dużą istniejącą bazę kodu.** Nie musisz dokumentować wszystkiego. [Using OpenSpec in an Existing Project](existing-projects.md) pokazuje, jak zacząć pracę nad rzeczywistym kodem (brownfield), bez próby "ugotowania całego oceanu".

**Chcę po prostu sprawić, by to działało.** [Install](installation.md), uruchom `openspec init`, a następnie przeczytaj [How Commands Work](how-commands-work.md), aby Twoja pierwsza komenda ze ukośnikiem trafiła w odpowiednie miejsce.

**Uczę się na przykładach.** Strona [Examples & Recipes](examples.md) prowadzi przez rzeczywiste zmiany od początku do końca: małą funkcję, poprawkę błędu, refaktoryzację, eksplorację.

**Przechodzę z poprzedniego workflow.** [Migration Guide](migration-guide.md) wyjaśnia, co się zmieniło i dlaczego, obiecując bezpieczeństwo Twojej istniejącej pracy.

**Chcę dostosować to do procesu mojego zespołu.** [Customization](customization.md) obejmuje konfigurację projektu, niestandardowe schematy i wspólny kontekst.

**Coś jest zepsute.** [Troubleshooting](troubleshooting.md) zbiera problemy, z którymi faktycznie spotykają użytkownicy, wraz z rozwiązaniami.

## Cała mapa

### Zacznij tutaj

| Dokumentacja | Co to daje |
|-----|-------------------|
| [Getting Started](getting-started.md) | Instalację, inicjalizację i wykonanie pierwszej zmiany od początku do końca |
| [Explore First](explore.md) | Użyj `/opsx:explore`, aby przeanalizować pomysł przed zobowiązaniem się |
| [How Commands Work](how-commands-work.md) | Gdzie działają komendy ze ukośnikiem, co oznacza „tryb interaktywny”, terminal vs czat |
| [Core Concepts at a Glance](overview.md) | Całe mentalne modelowanie na jednej stronie: specyfikacje, zmiany, delty, archiwum |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix i jak zweryfikować działanie |

### Używaj tego na co dzień

| Dokumentacja | Co to daje |
|-----|-------------------|
| [Workflows](workflows.md) | Typowe wzorce i kiedy sięgnąć po każdą komendę |
| [Examples & Recipes](examples.md) | Pełne przeprowadzanie rzeczywistych zmian, do skopiowania i wklejenia |
| [Using OpenSpec in an Existing Project](existing-projects.md) | Adopcja OpenSpec na dużej bazie kodu brownfield |
| [Editing & Iterating on a Change](editing-changes.md) | Aktualizacja artefaktów, powrót wstecz, ujednolicanie ręcznych edycji |
| [Commands](commands.md) | Odniesienie dla każdej komendy `/opsx:*` |
| [CLI](cli.md) | Odniesienie dla każdej komendy `openspec` w terminalu |

### Zrozum to dogłębnie

| Dokumentacja | Co to daje |
|-----|-------------------|
| [Concepts](concepts.md) | Rozbudowane wyjaśnienie specyfikacji, zmian, artefaktów, schematów i archiwum |
| [OPSX Workflow](opsx.md) | Dlaczego workflow jest płynny, a nie zablokowany fazowo, plus dogłębna analiza architektury |
| [Glossary](glossary.md) | Każdy termin zdefiniowany w jednym miejscu |

### Spraw, by to było Twoje

| Dokumentacja | Co to daje |
|-----|-------------------|
| [Customization](customization.md) | Konfiguracja projektu, niestandardowe schematy, wspólny kontekst |
| [Multi-Language](multi-language.md) | Generowanie artefaktów w językach innych niż angielski |
| [Supported Tools](supported-tools.md) | Ponad 25 narzędzi AI, z którymi integruje się OpenSpec i gdzie lądują pliki |

### Gdy potrzebujesz pomocy

| Dokumentacja | Co to daje |
|-----|-------------------|
| [FAQ](faq.md) | Szybkie odpowiedzi na najczęściej zadawane pytania |
| [Troubleshooting](troubleshooting.md) | Konkretne naprawy dla konkretnych awarii |
| [Migration Guide](migration-guide.md) | Przejście z przestarzałego workflow do OPSX |

### Koordynacja między repozytoriami (beta)

| Dokumentacja | Co to daje |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | Planowanie w własnym repo, gdy Twoja praca obejmuje wiele repozytoriów lub zespołów |
| [Agent Contract](agent-contract.md) | Interfejsy CLI czytane przez agenty |

## Wersja trzydziestosekundowa

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (w czacie AI)  /opsx:explore           ← opcjonalne, ale świetny nawyk
4. Propose        (w czacie AI)  /opsx:propose add-dark-mode
5. Build          (w czacie AI)  /opsx:apply
6. Archive        (w czacie AI)  /opsx:archive
```

Kroki 1 i 2 wykonujesz w terminalu. Reszta dzieje się w czacie Twojego asystenta AI. Ten podział jest jedną rzeczą, którą warto zapamiętać, a [How Commands Work](how-commands-work.md) wyjaśnia dokładnie dlaczego. Krok 3 jest opcjonalny, ale rozpoczęcie od `/opsx:explore`, gdy jesteś niepewny, to nawyk najbardziej wart pielęgnowania.

## Gdzie jeszcze możesz uzyskać pomoc

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) z pytaniami, pomysłami i pomocą.
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) w sprawie błędów i żądań funkcji.
- **`openspec feedback "twoja wiadomość"`** wysyła informację zwrotną bezpośrednio z Twojego terminala (otwiera zgłoszenie na GitHub).

Czy znalazłeś coś w tej dokumentacji, co jest nieprawidłowe, przestarzałe lub mylące? To jest błąd. Utwórz zgłoszenie lub PR. Ulepszenia dokumentacji są jednymi z najbardziej wartościowych wkładów, jakie możesz wnieść.