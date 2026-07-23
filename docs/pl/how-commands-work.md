# Jak działają polecenia

**Jedna rzecz do zapamiętania: OpenSpec ma dwa rodzaje poleceń i działają one w dwóch różnych miejscach.**

- Polecenia `openspec ...` działają w Twoim **terminalu**. (Przykład: `openspec init`.)
- Polecenia `/opsx:...` działają w **czacie Twojego asystenta AI**. (Przykład: `/opsx:propose`.)

Jeśli kiedykolwiek wpiszesz `/opsx:propose` w terminalu i nic się nie stanie, to jest powód. Rozmawiasz z niewłaściwą połową OpenSpec. Polecenia z ukośnikiem nie są poleceniami terminalowymi. To instrukcje, które przekazujesz swojemu asystentowi kodowania AI, w tym samym oknie czatu, w którym normalnie wpisałbyś "dodaj formularz logowania".

Ta jedna różnica to najczęstsza przeszkoda dla nowych użytkowników, więc wyjaśnmy to całkowicie jasno.

## Dwie połowy

OpenSpec to jeden projekt pełniący dwie funkcje.

**CLI (połowa terminalowa).** Program o nazwie `openspec`, który instalujesz i uruchamiasz z powłoki (shella). Konfiguruje Twój projekt, wyświetla listę i waliduje zmiany, pokazuje pulpit oraz archiwizuje zakończoną pracę. Wpisujesz je w iTerm, terminalu VS Code, PowerShell, wszędzie tam, gdzie uruchomiłbyś `git` lub `npm`.

```bash
openspec init        # skonfiguruj OpenSpec w tym projekcie
openspec list        # zobacz aktywne zmiany
openspec view        # otwórz interaktywny pulpit
```

**Polecenia z ukośnikiem (połowa czatowa).** Krótkie polecenia, takie jak `/opsx:propose` i `/opsx:apply`, które wpisujesz do swojego asystenta AI. Mówią one AI, aby przestrzegało przepływu pracy OpenSpec: szkicowanie propozycji, pisanie specyfikacji, budowanie na podstawie listy zadań, archiwizacja po zakończeniu. Wpisujesz je w Claude Code, Cursor, Windsurf, Copilot lub dowolnym innym używanym asystencie.

```text
/opsx:propose add-dark-mode    (wpisane w czacie AI)
/opsx:apply                    (wpisane w czacie AI)
/opsx:archive                  (wpisane w czacie AI)
```

Oto model mentalny na jednym obrazku:

```text
        TWÓJ TERMINAL                         CZAT TWOJEGO ASYSTENTA AI
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   instaluje   │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   polecenia   │  /opsx:archive                │
   └──────────────────────┘    i umiejętności   └──────────────────────────────┘
        uruchamiaj openspec tutaj                       uruchamiaj /opsx:* tutaj
```

Zwróć uwagę na strzałkę. Uruchomienie `openspec init` w terminalu *instaluje* polecenia z ukośnikiem w Twoim narzędziu AI. Połowa terminalowa konfiguruje połowę czatową. Po tym, codzienne sterowanie odbywa się głównie w czacie.

## "Jak rozpocząć tryb interaktywny?"

**Nie ma osobnego trybu interaktywnego do rozpoczęcia.** To pytanie pojawia się często, więc zasługuje na prostą odpowiedź.

Nie wchodzisz w specjalny tryb OpenSpec. Po prostu otwierasz swojego asystenta kodowania AI jak zawsze i wpisujesz polecenie z ukośnikiem w czacie. Polecenie z ukośnikiem *jest* sposobem na "wejście" do OpenSpec. Twój asystent rozpoznaje je, ładuje odpowiednią umiejętność OpenSpec i zaczyna przestrzegać przepływu pracy.

Więc prawdziwe instrukcje to:

1. Otwórz swojego asystenta kodowania AI (Claude Code, Cursor, Windsurf i tak dalej) w swoim projekcie.
2. Wpisz `/opsx:propose` w jego czacie, w tym samym miejscu, w którym wpisujesz inne żądania.
3. Obserwuj autouzupełnianie: jeśli OpenSpec jest zainstalowany, zobaczysz `/opsx:propose`, `/opsx:apply` i podobne pojawiające się podczas wpisywania ukośnika.

To wszystko. Żadnego trybu do przełączenia, żadnego demona do uruchomienia, żadnego osobnego okna.

Jedna rzecz, która *jest* naprawdę interaktywna, znajduje się w terminalu: `openspec view`. Otwiera on pulpit do przeglądania Twoich specyfikacji i zmian. Ale to jest przeglądarka, a nie narzędzie, za pomocą którego proponujesz i budujesz. Budowanie odbywa się za pomocą poleceń z ukośnikiem w czacie.

## Dlaczego ten podział istnieje

Warto to zrozumieć, ponieważ wyjaśnia, dlaczego OpenSpec działa z ponad 25 różnymi narzędziami AI.

CLI to **silnik**. Zna zasady: jak wygląda folder zmian, które artefakty od czego zależą, jak scalić deltę specyfikacji ze źródłem prawdy. Jest wszędzie takie samo.

Polecenia z ukośnikiem to **kierownica**, a każde narzędzie AI ma nieco inną. Claude Code nazywa je poleceniami. Cursor i Windsurf mają własne formaty. Niektóre narzędzia nazywają je umiejętnościami. Kiedy uruchamiasz `openspec init`, OpenSpec generuje odpowiedni rodzaj pliku dla każdego wybranego narzędzia, więc ta sama intencja `/opsx:propose` działa niezależnie od preferowanego asystenta.

Zaleta tego projektu: uczysz się przepływu pracy raz i przenosisz go między narzędziami. Kompromis: dokładna składnia polecenia może się nieznacznie różnić między narzędziami, co jest tematem następnej sekcji.

## Składnia poleceń z ukośnikiem według narzędzia

Intencja jest wszędzie identyczna. Różni się interpunkcja. Użyj formy, która pasuje do Twojego asystenta.

| Narzędzie | Jak to wpisujesz |
|------|-----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | styl umiejętności, np. `/openspec-propose` |
| Codex | styl umiejętności przez `.codex/skills/openspec-*` |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | styl umiejętności, np. `/skill:openspec-propose` |
| Trae | `/opsx-propose`, `/opsx-apply` |

Większość narzędzi używa formy z dwukropkiem (`/opsx:propose`) lub formy z myślnikiem (`/opsx-propose`). Kilka narzędzi wyświetla OpenSpec jako nazwane umiejętności zamiast poleceń z ukośnikiem; w takich przypadkach wywołujesz umiejętność po nazwie. Pełna lista dla każdego narzędzia, w tym dokładne informacje o tym, które pliki są zapisywane i gdzie, znajduje się w [Obsługiwane narzędzia](supported-tools.md).

Gdy masz wątpliwości, wpisz ukośnik w czacie AI i spójrz na autouzupełnianie. Twoje narzędzie pokaże Ci formę, której oczekuje.

## Jak polecenia się tam znalazły: umiejętności i polecenia

Kiedy uruchamiasz `openspec init` (lub `openspec update`), OpenSpec zapisuje małe pliki w Twoim projekcie, aby Twoje narzędzie AI mogło znaleźć przepływ pracy. W zależności od Twojego narzędzia i ustawień, są to **umiejętności**, **polecenia** lub oba.

- **Umiejętności** znajdują się w miejscach takich jak `.claude/skills/openspec-*/SKILL.md`. To powstający standard między narzędziami: folder z instrukcjami, które Twój asystent wykrywa automatycznie.
- **Polecenia** znajdują się w miejscach takich jak `.claude/commands/opsx/<id>.md`. To starsze pliki poleceń z ukośnikiem dla poszczególnych narzędzi. Codex nie generuje plików poleceń; użyj `.codex/skills/openspec-*`.

Nie musisz się martwić, którego z nich używa Twoje narzędzie. Po prostu wpisujesz polecenie z ukośnikiem i działa. Ale wiedza o istnieniu tych plików pomaga, gdy coś pójdzie nie tak: jeśli Twoje polecenia znikną, zazwyczaj oznacza to, że te pliki są brakujące lub nieaktualne, a `openspec update` regeneruje je.

Zobacz [Obsługiwane narzędzia](supported-tools.md) aby poznać dokładne ścieżki dla każdego narzędzia, oraz [Przewodnik migracji](migration-guide.md) aby dowiedzieć się, jak umiejętności zastąpiły starsze podejście oparte wyłącznie na poleceniach.

## Potwierdzanie, że jest zainstalowane

Szybkie sprawdzenia, od najszybszego:

1. **Wpisz ukośnik w czacie AI.** Zacznij wpisywać `/opsx` i obserwuj sugestie autouzupełniania. Jeśli się pojawią, wszystko jest gotowe.
2. **Poszukaj plików.** Dla Claude Code sprawdź, czy `.claude/skills/` zawiera foldery `openspec-*`. Inne narzędzia używają własnych katalogów ([Obsługiwane narzędzia](supported-tools.md) je wymienia).
3. **Uruchom ponownie konfigurację.** Z katalogu głównego swojego projektu uruchom `openspec update`. To regeneruje pliki umiejętności i poleceń dla skonfigurowanych narzędzi.
4. **Uruchom ponownie asystenta.** Wiele narzędzi skanuje umiejętności i polecenia podczas uruchamiania, więc nowe okno może być brakującym krokiem.

## Jakie polecenia w ogóle mam?

Domyślnie OpenSpec instaluje **podstawowy** zestaw poleceń z ukośnikiem:

- `/opsx:explore`: przemyśl pomysł z AI przed zobowiązaniem się do zmiany (świetny pierwszy krok, gdy nie jesteś pewien)
- `/opsx:propose`: utwórz zmianę i szkicuj wszystkie jej artefakty planowania w jednym kroku
- `/opsx:apply`: buduj zmianę, pracując nad jej listą zadań
- `/opsx:sync`: scal aktualizacje specyfikacji zmiany z Twoimi głównymi specyfikacjami (zazwyczaj automatycznie)
- `/opsx:archive`: zakończ zmianę i zarchiwizuj ją

Dobry domyślny rytm: `explore`, gdy zastanawiasz się, co robić, potem `propose`, `apply`, `archive`. Przewodnik [Najpierw eksploruj](explore.md) wyjaśnia, dlaczego ten początkowy krok się opłaca.

Istnieje również **rozszerzony** zestaw dla osób, które chcą mieć większą kontrolę (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Włączasz go za pomocą `openspec config profile`, a następnie zastosujesz za pomocą `openspec update`.

Jesteś nowy w tym wszystkim? `/opsx:onboard` (w zestawie rozszerzonym) przeprowadzi Cię przez kompletną zmianę w Twojej własnej bazie kodu, opowiadając każdy krok. To najprzyjazniejsze możliwe wprowadzenie.

Aby dowiedzieć się szczegółowo, co robi każde polecenie, zobacz [Polecenia](commands.md). Aby dowiedzieć się, kiedy sięgać po które, zobacz [Przepływy pracy](workflows.md).

## Czyste pierwsze uruchomienie

Składając to wszystko razem, oto cała sekwencja z każdym krokiem oznaczonym miejscem, w którym się on odbywa.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
                      (instaluje polecenia z ukośnikiem w Twoim narzędziu AI)

CZAT AI      /opsx:explore
                      (opcjonalnie: najpierw przemyśl pomysł z AI)

CZAT AI      /opsx:propose add-dark-mode
                      (AI szkicuje propozycję, specyfikacje, projekt, zadania)

CZAT AI      /opsx:apply
                      (AI buduje to, odhaczając zadania)

CZAT AI      /opsx:archive
                      (zmiana jest scalana z Twoimi specyfikacjami i archiwizowana)
```

Dwa kroki w terminalu, aby skonfigurować. Potem żyjesz w czacie. Taki jest rytm.

## Powiązane

- [Pierwsze kroki](getting-started.md): pełny przewodnik pierwszej zmiany
- [Polecenia](commands.md): każde polecenie z ukośnikiem szczegółowo
- [CLI](cli.md): każde polecenie terminalowe szczegółowo
- [Obsługiwane narzędzia](supported-tools.md): składnia dla każdego narzędzia i lokalizacje plików
- [FAQ](faq.md): więcej szybkich odpowiedzi
- [Rozwiązywanie problemów](troubleshooting.md): poprawki, gdy polecenia się nie pojawiają