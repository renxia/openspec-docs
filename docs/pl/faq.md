# FAQ

Szybkie odpowiedzi na najczęściej zadawane pytania. Jeśli Twoje pytanie dotyczy tego, że „coś jest zepsute”, lepsza będzie strona [Troubleshooting](troubleshooting.md). Jeśli chcesz, aby jakiś termin został zdefiniowany, sprawdź [Glossary](glossary.md).

## Podstawy

### Czym jest OpenSpec w jednym zdaniu?

Lekka warstwa, która zapewnia Tobie i Twojemu asystentowi AI zgodę na to, co ma zostać zbudowane – zapisane na piśmie – zanim zostanie napisany choć jeden kod.

### Dlaczego miałbym tego używać?

Ponieważ asystenci AI są pewni siebie nawet wtedy, gdy się mylą. Kiedy wymagania istnieją tylko w wątku czatu, AI wypełnia luki domysłami, a Ty dowiadujesz się o tym dopiero po istnieniu kodu. OpenSpec przenosi to porozumienie na wcześniejszy etap, gdzie błędy są tanie do naprawienia. Sprawdź [Core Concepts at a Glance](overview.md), aby poznać pełny kontekst.

### Czy muszę go używać we wszystkim?

Nie. Używaj go tam, gdzie zależy Ci na porozumieniu – czyli w większości pracy nietrywialnej. W przypadku poprawki literówki o jeden znak ceremonia prawdopodobnie nie jest tego warta, a to nic.

### Czy mogę go użyć na dużej istniejącej bazie kodu, czy tylko na nowych projektach?

Istniejące bazy kodu są głównym celem. OpenSpec jest priorytetowo nastawiony na projekty istniejące (brownfield-first): nie musisz dokumentować całej swojej aplikacji od raz. Piszesz specyfikacje tylko dla tych zmian, które dany element dotyka, a Twoje specyfikacje wypełniają się w miarę postępu pracy. Jest dedykowany przewodnik: [Using OpenSpec in an Existing Project](existing-projects.md).

### Czy jest powiązany z jednym narzędziem AI?

Nie. OpenSpec działa z ponad 25 asystentami, w tym Claude Code, Cursor, Windsurf, GitHub Copilot, Gemini CLI, Codex i innymi. Pełną listę oraz szczegóły dla każdego narzędzia znajdziesz w [Supported Tools](supported-tools.md).

## Uruchamianie poleceń

### Gdzie wpisuję `/opsx:propose`?

W czacie swojego asystenta AI, a nie w terminalu. To jest najczęstsze źródło zamieszania, dlatego ma własną stronę: [How Commands Work](how-commands-work.md). Krótka wersja: `openspec ...` działa w terminalu, `/opsx:...` działa w czacie.

### Jak „rozpocząć tryb interaktywny”?

Nie ma osobnego trybu do uruchomienia. Otwierasz swojego asystenta AI jak zwykle i wpisujesz komendę ukośnika (slash command) do jego czatu. Komenda ukośnika jest sposobem na „wejście” w OpenSpec. (Jedyną naprawdę interaktywną funkcją terminalową jest `openspec view`, czyli pulpit nawigacyjny do przeglądania specyfikacji i zmian). Pełne wyjaśnienie znajdziesz w [How Commands Work](how-commands-work.md).

### Wpisałem komendę ukośnika, a nic się nie stało. Dlaczego?

Prawdopodobnie wpisałeś ją w terminalu zamiast w czacie swojego AI, albo komendy nie są jeszcze zainstalowane. Uruchom `openspec update` w swoim projekcie, zrestartuj asystenta, a następnie spróbuj wpisać `/opsx` w czacie i obserwuj autouzupełnianie. [Troubleshooting](troubleshooting.md#commands-dont-show-up) zawiera pełną checklistę.

### Dlaczego składnia `/opsx:propose` jest jedna w jednym narzędziu, a `/opsx-propose` w innym?

Każde narzędzie AI wyświetla niestandardowe komendy nieco inaczej. Intencja jest identyczna; zmienia się tylko interpunkcja. Wpisz ukośnik do czatu i autouzupełnianie pokaże Ci format, jakiego oczekuje Twoje narzędzie. Tabela dla każdego narzędzia znajduje się w [How Commands Work](how-commands-work.md#slash-command-syntax-by-tool).

### Jaka jest różnica między umiejętnością (skill) a komendą (command)?

Oba są plikami, które OpenSpec pisze, aby Twój asystent mógł uruchomić przepływ pracy. Umiejętności (`.../skills/openspec-*/SKILL.md`) to nowszy standard przechodzący przez narzędzia; komendy (`.../commands/opsx-*`) to starsze pliki ukośnika specyficzne dla danego narzędzia. Nie musisz wybierać. Po prostu wpisujesz komendę ukośnika, a OpenSpec instaluje tę, której używa Twoje narzędzie.

## Przepływ pracy (Workflow)

### Od czego zacząć, jeśli nie jesteś pewien, co chcesz zbudować?

Od `/opsx:explore`. Jest to partner do myślenia bez ryzyka, który czyta Twoją bazę kodu, przedstawia opcje i zamienia nieprecyzyjny problem w konkretny plan – wszystko zanim pojawi się jakakolwiek zmiana lub kod. Znajduje się on w profilu domyślnym, więc jest zawsze dostępny. Gdy plan jest jasny, przekazuje pracę do `/opsx:propose`. To jest najlepszy nawyk, jaki możesz wyrobić, ponieważ zapobiega to entuzjastycznemu AI budowaniu czegoś złego z pełnym przekonaniem. Sprawdź [Explore First](explore.md).

### Jaki jest najprostszy możliwy przepływ?

```text
/opsx:explore (opcjonalnie)   następnie   /opsx:propose <co chcesz>   następnie   /opsx:apply   następnie   /opsx:archive
```

Przejrzyj, aby to przemyśleć; zaproponuj, aby sporządzić plan; zastosuj, aby zbudować; zarchiwizuj, aby odłożyć na później. Omiń etap przeglądania, jeśli wiesz dokładnie, czego chcesz.

### Jaka jest różnica między `/opsx:propose` a `/opsx:new`?

`/opsx:propose` to domyślna komenda jednorazowa: tworzy zmianę i opracowuje wszystkie artefakty planowania jednocześnie. `/opsx:new` jest częścią rozszerzonego zestawu komend i tylko szkicuje pustą zmianę, pozostawiając Ci zadanie stworzenia artefaktów po kolei za pomocą `/opsx:continue` (lub wszystkich naraz za pomocą `/opsx:ff`). Używaj `propose`, chyba że chcesz mieć kontrolę krok po kroku. Sprawdź [Commands](commands.md).

### Czym są profile `core` i rozszerzone?

Profil decyduje, które komendy ukośnika zostaną zainstalowane. **Core** (domyślny) zapewnia Ci `propose`, `explore`, `apply`, `sync` i `archive`. Zestaw **expanded** dodaje `new`, `continue`, `ff`, `verify`, `bulk-archive` i `onboard` dla bardziej szczegółowej kontroli. Przełącz się za pomocą `openspec config profile`, a następnie zastosuj zmianę za pomocą `openspec update`.

### Czy muszę uruchamiać `/opsx:sync`?

Zazwyczaj nie. Sync łączy delta-specyfikacje zmiany z głównymi specyfikacjami, a `/opsx:archive` zaproponuje to zrobić za Ciebie. Uruchom sync ręcznie tylko wtedy, gdy chcesz, aby specyfikacje zostały połączone przed archiwizacją, na przykład w przypadku długotrwałej zmiany. Sprawdź [Commands](commands.md#opsxsync).

### Jak edytować propozycję, specyfikację lub zadanie po rozpoczęciu?

Po prostu edytuj plik. Każdy artefakt jest zwykłym Markdownem w `openspec/changes/<name>/`, a nie ma żadnego zablokowanego etapu ani specjalnego trybu edycji. Zmień go ręcznie lub poproś AI o rewizję („zaktualizuj projekt, aby używał kolejki”), a następnie kontynuuj. AI zawsze działa na podstawie aktualnej zawartości pliku. Pełny przewodnik: [Editing & Iterating on a Change](editing-changes.md).

### Czy mogę cofnąć się i zmienić plan po wdrożeniu części z niego?

Tak, w dowolnym momencie. Przepływ pracy jest płynny, więc przeglądanie i edycja nie są fazami, z których można zostać wykluczonym. Edytuj artefakt, a następnie kontynuuj. Jeśli chcesz mieć ustrukturyzowaną weryfikację, czy kod nadal odpowiada planowi, uruchom `/opsx:verify`. Sprawdź [Editing & Iterating on a Change](editing-changes.md#how-do-i-go-back-to-review-after-implementing).

### Edytowałem kod ręcznie. Jak to pogodzić ze specyfikacją?

Przywróć je do synchronizacji przed archiwizacją, ponieważ archiwizacja czyni z Twoich specyfikacji ostateczny zapis prawdy. Jeśli kod jest teraz poprawny, zaktualizuj delta-specyfikację, aby odpowiadała temu, co zostało wysłane; jeśli to specyfikacja jest poprawna, kontynuuj budowanie, dopóki kod nie zgodzi się. `/opsx:verify` ujawnia niezgodności. Sprawdź [Editing & Iterating on a Change](editing-changes.md#i-edited-the-code-by-hand-how-do-i-reconcile-that-with-openspec).

### Kiedy powinienem aktualizować istniejącą zmianę, a kiedy zacząć nową?

Aktualizuj, gdy jest to ta sama praca, ale ulepszona. Zacznij od nowa, gdy intencja fundamentalnie się zmieniła lub zakres eksplodował w inną pracę. Istnieje schemat decyzyjny i przykłady w [Workflows](workflows.md#when-to-update-vs-start-fresh).

### Co jeśli moja sesja straci kontekst, a wymagania zmieniają się w trakcie implementacji?

Tutaj specyfikacje są na wagę złota. Ponieważ plan istnieje w plikach (a nie tylko w historii czatu), możesz oczyścić swój kontekst, rozpocząć nową sesję AI i wznowić pracę za pomocą `/opsx:apply`; odczyta on artefakty i rozpocznie od pierwszego niezrealizowanego zadania. Jeśli wymagania się zmieniają, edytuj artefakty, aby pasowały do nowej rzeczywistości i kontynuuj. Utrzymywanie czystego okna kontekstowego daje również lepsze rezultaty; oczyść je przed implementacją.

### Czy powinienem zatwierdzić folder `openspec/` do git?

Tak. Twoje specyfikacje, aktywne zmiany i archiwum są częścią historii projektu. Zatwierdź je tak jak każdy inny kod źródłowy. Archiwum w szczególności staje się trwałą rejestracją tego, dlaczego Twój system działa w dany sposób.

## Specyfikacje i zmiany

### Co trafia do specyfikacji, a co do projektu (design)?

Specyfikacja opisuje zachowanie obserwowane: co robi system, jakie ma wejścia, wyjścia i warunki błędów. Projekt opisuje, *jak* to zbudujesz: podejście techniczne, decyzje architektoniczne, zmiany w plikach. Jeśli implementacja mogłaby się zmienić bez zmiany zewnętrznie widocznego zachowania, należy to do projektu, a nie do specyfikacji. [Concepts](concepts.md#what-a-spec-is-and-is-not) zagłębia się w ten temat.

### Czym jest delta specyfikacja?

Specyfikacja, która opisuje tylko to, co się zmienia, używając sekcji `ADDED`, `MODIFIED` i `REMOVED`, zamiast powtarzać całą specyfikację. Jest to sposób, w jaki OpenSpec radzi sobie z edycjami istniejących systemów. Sprawdź [Concepts](concepts.md#delta-specs).

### Dokąd trafiają archiwalne zmiany?

Do `openspec/changes/archive/YYYY-MM-DD-<name>/`, ze wszystkimi zachowanymi artefaktami. Nic nie jest usuwane; zmiana po prostu opuszcza Twoją aktywną listę.

## Konfiguracja i niestandardowość

### Jak powiedzieć AI o moim stosie technologicznym?

Umieść to w `openspec/config.yaml` pod kluczem `context:`. Ten tekst jest wstrzykiwany do każdego żądania planowania, dzięki czemu AI zawsze zna Twój stos i konwencje. Sprawdź [Customization](customization.md#project-configuration).

### Czy mogę generować specyfikacje w języku innym niż angielski?

Tak. Dodaj instrukcję językową do `context:` w swojej konfiguracji. [Multi-Language](multi-language.md) zawiera fragmenty do skopiowania dla kilku języków.

### Czy mogę zmienić sam przepływ pracy?

Tak, za pomocą niestandardowych schematów (schemas). Schemat definiuje, jakie artefakty istnieją i jak zależą od siebie nawzajem. Rozgałęź ten domyślny za pomocą `openspec schema fork spec-driven my-workflow`, a następnie go edytuj. Sprawdź [Customization](customization.md#custom-schemas).

## Modele, prywatność i aktualizacje

### Który model AI powinienem używać?

OpenSpec najlepiej działa z modelami o wysokim stopniu rozumowania. README poleca modele takie jak Codex 5.5 i Opus 4.7 zarówno do planowania, jak i implementacji. Pamiętaj również o czystym oknie kontekstowym: oczyść je przed implementacją dla najlepszych rezultatów.

### Czy OpenSpec zbiera dane?

Zbiera anonimowe statystyki użycia: nazwy komend i wersję. Żadne argumenty, ścieżki, treści ani dane osobowe nie są zbierane, a w CI jest to wyłączone automatycznie. Możesz zrezygnować, ustawiając `export OPENSPEC_TELEMETRY=0` lub `export DO_NOT_TRACK=1`.

### Jak aktualizować?

Dwa kroki. Zaktualizuj pakiet (`npm install -g @fission-ai/openspec@latest`), a następnie uruchom `openspec update` w każdym projekcie, aby odświeżyć wygenerowane umiejętności i komendy.

### Jak odinstalować OpenSpec?

Nie ma komendy do odinstalowania, ponieważ jest to tylko globalny pakiet wraz z plikami w Twoim projekcie. Usuń pakiet (`npm uninstall -g @fission-ai/openspec`), a opcjonalnie usuń katalog `openspec/` oraz wygenerowane pliki narzędzi. Instrukcja krok po kroku, w tym co jest bezpieczne do zachowania, znajduje się w [Installation: Uninstalling](installation.md#uninstalling).

## Uzyskanie pomocy

### Gdzie zadawać pytania lub zgłaszać błędy?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Z terminala:** `openspec feedback "twoje przesłanie"` otworzy dla Ciebie zgłoszenie na GitHub.

### Te dokumenty są błędne lub mylące. Co mam zrobić?

Poinformuj nas, albo popraw to. PR (Pull Request) dotyczące dokumentacji są mile widziane i bardzo cenione. Otwórz zgłoszenie lub wyślij pull request.