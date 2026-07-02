# Jak działają komendy

**Jedna rzecz do wiedzy: OpenSpec ma dwa rodzaje komend, a są one uruchamiane w dwóch różnych miejscach.**

- Komendy `openspec ...` działają w Twoim **terminalu**. (Przykład: `openspec init`.)
- Komendy `/opsx:...` działają w **czacie asystenta AI**. (Przykład: `/opsx:propose`.)

Jeśli kiedykolwiek wpiszesz `/opsx:propose` do terminala i nic się nie stanie, ta strona jest odpowiedzią. Rozmawiasz z niewłaściwą częścią OpenSpec. Komendy ze znakiem ukośnika (slash commands) nie są komendami terminalowymi. Są to instrukcje, które podajesz swojemu asystentowi kodującemu AI, w tym samym polu czatu, w którym normalnie wpisałbyś „dodaj formularz logowania”.

Ta jedna różnica jest najczęstszym punktem zapalnym dla nowych użytkowników, więc postarajmy się to wyjaśnić jak najbardziej precyzyjnie.

## Dwie części

OpenSpec to jeden projekt noszący dwa nakrycia głowy.

**CLI (terminalowa część).** Jest to program o nazwie `openspec`, który instalujesz i uruchamiasz ze swojej powłoki (shell). Konfiguruje on Twój projekt, wyświetla listę zmian i waliduje je, pokazuje pulpit nawigacyjny (dashboard) i archiwizuje ukończoną pracę. Wpisujesz te komendy do iTerm, terminala VS Code, PowerShell – wszędzie tam, gdzie uruchamiasz `git` lub `npm`.

```bash
openspec init        # konfiguruje OpenSpec w tym projekcie
openspec list        # wyświetla aktywne zmiany
openspec view        # otwiera interaktywny pulpit nawigacyjny
```

**Komendy ze znakiem ukośnika (slash commands, czatowa część).** Są to krótkie komendy, takie jak `/opsx:propose` i `/opsx:apply`, które wpisujesz do swojego asystenta AI. Mówią one AI, aby podążało za przepływem pracy OpenSpec: przygotowanie propozycji, pisanie specyfikacji, budowanie na podstawie listy zadań, archiwizacja po zakończeniu. Wpisujesz je do Claude Code, Cursor, Windsurf, Copilot lub dowolnego asystenta, którego używasz.

```text
/opsx:propose add-dark-mode    (wpisane w czacie AI)
/opsx:apply                    (wpisane w czacie AI)
/opsx:archive                  (wpisane w czacie AI)
```

Oto mentalny model na jednym obrazku:

```text
        TWÓJ TERMINAL                         CZAT ASYSTENTA AI
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   instaluje    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   komendy      │  /opsx:archive                │
   └──────────────────────┘    & umiejętności (skills)   └──────────────────────────────┘
        uruchamiasz openspec tutaj                       uruchamiasz /opsx:* tutaj
```

Zauważ strzałkę. Uruchomienie `openspec init` w terminalu to to, co *instaluje* komendy ze znakiem ukośnika do Twojego narzędzia AI. Terminalowa część konfiguruje czatową część. Po tym wszystkim codzienne działanie odbywa się głównie w czacie.

## „Jak zacząć tryb interaktywny?”

**Nie ma osobnego trybu interaktywnego, który trzeba uruchomić.** To pytanie pojawia się często, więc zasługuje na proste wyjaśnienie.

Nie wchodzisz w specjalny tryb OpenSpec. Po prostu otwierasz swojego asystenta kodującego AI tak jak zawsze i wpisujesz komendę ze znakiem ukośnika do czatu. Komenda ze znakiem ukośnika *jest* sposobem na „wejście” do OpenSpec. Twój asystent ją rozpoznaje, ładuje pasującą umiejętność (skill) OpenSpec i zaczyna podążać za przepływem pracy.

Prawdziwe instrukcje są następujące:

1. Otwórz swojego asystenta kodującego AI (Claude Code, Cursor, Windsurf i podobne) w swoim projekcie.
2. Wpisz `/opsx:propose` do jego czatu, tak jak każdą inną prośbę.
3. Obserwuj autouzupełnianie: jeśli OpenSpec jest zainstalowany, zobaczysz `/opsx:propose`, `/opsx:apply` i innych, gdy będziesz wpisywać znak ukośnika.

Tyle. Nie ma trybu do przełączania, nie ma demonu do uruchomienia, ani osobnego okna.

Jedna rzecz, która jest naprawdę interaktywna, istnieje w terminalu: `openspec view`. Otwiera on pulpit nawigacyjny do przeglądania swoich specyfikacji i zmian. Ale to jest widokacz (viewer), a nie narzędzie, za pomocą którego proponujesz i budujesz. Budowanie odbywa się poprzez komendy ze znakiem ukośnika w czacie.

## Dlaczego istnieje ten podział

Warto to zrozumieć, ponieważ wyjaśnia to, dlaczego OpenSpec działa z ponad 25 różnymi narzędziami AI.

CLI jest **silnikiem**. Ono zna zasady: jak wygląda folder zmian, które artefakty zależą od których, jak scalić delta spec do źródła prawdy. Jest ono takie samo wszędzie.

Komendy ze znakiem ukośnika są **volanem**, a każde narzędzie AI ma nieco inny swój. Claude Code nazywa je komendami. Cursor i Windsurf mają własne formaty. Niektóre narzędzia nazywają je umiejętnościami (skills). Kiedy uruchamiasz `openspec init`, OpenSpec generuje odpowiedni plik dla każdego wybranego przez Ciebie narzędzia, dzięki czemu ta sama intencja `/opsx:propose` działa niezależnie od tego, jakiego asystenta wolisz.

Siła tego projektu polega na tym, że uczysz się przepływu pracy raz i przenosisz go na różne narzędzia. Kompromisem jest to, że dokładna składnia komendy może nieznacznie różnić się między narzędziami, co jest tematem kolejnej sekcji.

## Składnia komend ze znakiem ukośnika dla poszczególnych narzędzi

Intencja jest identyczna wszędzie. Różni się interpunkcja. Użyj formatu pasującego do Twojego asystenta.

| Narzędzie | Jak to wpisujesz |
|------|-----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | styl umiejętności, np. `/skill:openspec-propose` |
| Trae | styl umiejętności, np. `/openspec-propose` |

Większość narzędzi używa albo formatu z dwukropkiem (`/opsx:propose`), albo formatu z myślnikiem (`/opsx-propose`). Kilka narzędzi prezentuje OpenSpec jako nazwane umiejętności zamiast komend ze znakiem ukośnika; dla nich wywołujesz tę umiejętność po nazwie. Pełna lista dla każdego narzędzia, w tym dokładnie które pliki są zapisywane gdzie, znajduje się w [Supported Tools](supported-tools.md).

W razie wątpliwości wpisz znak ukośnika do swojego czatu AI i sprawdź autouzupełnianie. Twoje narzędzie pokaże Ci format, którego oczekuje.

## Skąd pochodzą komendy: umiejętności (skills) a komendy

Kiedy uruchamiasz `openspec init` (lub `openspec update`), OpenSpec zapisuje małe pliki w swoim projekcie, aby Twoje narzędzie AI mogło znaleźć przepływ pracy. W zależności od Twojego narzędzia i ustawień są to **umiejętnościami (skills)**, **komendami**, czy oboma.

- **Umiejętności** znajdują się w miejscach takich jak `.claude/skills/openspec-*/SKILL.md`. Są to rozwijający się standard między narzędziami: folder instrukcji, który automatycznie wykrywa Twój asystent.
- **Komendy** znajdują się w miejscach takich jak `.claude/commands/opsx/<id>.md`. To starsze pliki komend ze znakiem ukośnika dla danego narzędzia.

Nie musisz dbać o to, które z nich używa Twoje narzędzie. Po prostu wpisujesz komendę ze znakiem ukośnika i działa. Ale wiedza o istnieniu tych plików pomaga, gdy coś pójdzie nie tak: jeśli Twoje komendy znikną, zazwyczaj oznacza to, że te pliki są brakujące lub nieaktualne, a `openspec update` je odtworzy.

Zobacz [Supported Tools](supported-tools.md) po dokładne ścieżki dla każdego narzędzia i [Migration Guide](migration-guide.md), jak umiejętności zastąpiły starsze podejście oparte tylko na komendach.

## Potwierdzenie instalacji

Szybkie sprawdzenia, najpierw najszybsze:

1. **Wpisz znak ukośnika do swojego czatu AI.** Zacznij pisać `/opsx` i obserwuj sugestie autouzupełniania. Jeśli się pojawią, jesteś gotowy.
2. **Poszukaj plików.** Dla Claude Code sprawdź, czy `.claude/skills/` zawiera foldery `openspec-*`. Inne narzędzia używają własnych katalogów ([Supported Tools](supported-tools.md) je wymienia).
3. **Ponownie uruchom konfigurację.** Z korzenia swojego projektu uruchom `openspec update`. To odtworzy pliki umiejętności i komend dla wszystkich skonfigurowanych przez Ciebie narzędzi.
4. **Uruchom ponownie asystenta.** Wiele narzędzi skanuje umiejętności i komendy przy starcie, więc świeże okno może być brakującym krokiem.

## Jakie komendy mam?

Domyślnie OpenSpec instaluje zestaw **podstawowych** komend ze znakiem ukośnika:

- `/opsx:explore`: przemyśl pomysł z AI przed podjęciem decyzji o zmianie (świetny pierwszy krok, gdy nie jesteś pewien)
- `/opsx:propose`: stworzenie zmiany i przygotowanie wszystkich jej artefaktów planistycznych w jednym kroku
- `/opsx:apply`: budowanie zmiany poprzez przechodzenie przez listę zadań
- `/opsx:sync`: scalanie aktualizacji specyfikacji zmiany do Twoich głównych specyfikacji (zazwyczaj automatyczne)
- `/opsx:archive`: zakończenie zmiany i jej archiwizacja

Dobry domyślny rytm to: `explore`, gdy zastanawiasz się, co zrobić, a następnie `propose`, `apply`, `archive`. Przewodnik [Explore First](explore.md) wyjaśnia, dlaczego ten początkowy krok jest wartościowy.

Istnieje również **rozszerzony** zestaw dla osób pragnących większej kontroli (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Włączasz go za pomocą `openspec config profile`, a następnie aktywujesz za pomocą `openspec update`.

Nowy w tym wszystkim? `/opsx:onboard` (w rozszerzonym zestawie) przeprowadzi Cię przez całą zmianę na Twoim własnym kodzie, narrując każdy krok. To najprzyjazniejsze możliwe wprowadzenie.

Aby dowiedzieć się szczegółowo, co robi każda komenda, zobacz [Commands](commands.md). Aby wiedzieć, kiedy użyć której, zobacz [Workflows](workflows.md).

## Czyste pierwsze uruchomienie

Podsumowując, oto cała sekwencja z oznaczeniem każdego kroku miejscem, w którym się odbywa.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (instaluje komendy ze znakiem ukośnika do Twojego narzędzia AI)

AI CHAT      /opsx:explore
              (opcjonalnie: przemyśl pomysł z AI przed rozpoczęciem)

AI CHAT      /opsx:propose add-dark-mode
              (AI przygotowuje propozycję, specyfikacje, projekt i zadania)

AI CHAT      /opsx:apply
              (AI buduje zmianę, odznaczając zadania)

AI CHAT      /opsx:archive
              (zmiana jest scalana do Twoich specyfikacji i archiwizowana)
```

Dwa kroki w terminalu do konfiguracji. Potem żyjesz w czacie. Taki jest rytm.

## Powiązane

- [Getting Started](getting-started.md): pełne przejście przez pierwszą zmianę
- [Commands](commands.md): każda komenda ze znakiem ukośnika w szczegółach
- [CLI](cli.md): każda komenda terminalowa w szczegółach
- [Supported Tools](supported-tools.md): składnia i lokalizacje plików dla każdego narzędzia
- [FAQ](faq.md): więcej szybkich odpowiedzi
- [Troubleshooting](troubleshooting.md): naprawy, gdy komendy nie są widoczne