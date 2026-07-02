# Słowniczek

Każdy termin OpenSpec w jednym miejscu, zdefiniowany prostym językiem. Przejrzyj go raz, a reszta dokumentacji będzie czytana szybciej.

Terminy są pogrupowane tematycznie, a następnie alfabetycznie w ramach każdej grupy.

## Podstawowe rzeczowniki (The core nouns)

**Spec.** Dokument opisujący działanie części Twojego systemu. Specs znajdują się w `openspec/specs/`, są zorganizowane według domeny i składają się z wymagań i scenariuszy. Spec jest zgodną odpowiedzią na pytanie: „co robi to oprogramowanie?”. Zobacz [Concepts](concepts.md#specs).

**Source of truth.** Całe katalogu `openspec/specs/`. Zawiera ono aktualne, ustalone zachowanie Twojego systemu. Zmiany proponują edycje do niego; archiwizacja je stosuje.

**Change.** Jednostka pracy, spakowana jako folder w `openspec/changes/<name>/`. Change zawiera wszystko o tej pracy: jej propozycję, projekt, zadania i edycje speca, które wprowadza. Jeden change to jedna funkcja lub poprawka.

**Artifact.** Dokument znajdujący się w ramach change'u. Standardowe artefakty to propozycja, delta specs, projekt i zadania. Są tworzone w kolejności zależności i wzajemnie się odwołują.

**Delta spec.** Spec w ramach change'a, który opisuje tylko to, co się zmienia, używając sekcji `ADDED`, `MODIFIED` i `REMOVED`, zamiast powtarzać cały spec. To pozwala OpenSpec na czyste edytowanie istniejących systemów. Zobacz [Concepts](concepts.md#delta-specs).

**Domain.** Logiczna grupa dla specs, np. `auth/`, `payments/` lub `ui/`. Ty wybierasz domeny, które odpowiadają Twojemu sposobie myślenia o swoim systemie.

## Wewnątrz speca (Inside a spec)

**Requirement.** Pojedyncze zachowanie, jakie musi posiadać system, zazwyczaj zapisane przy użyciu słowa kluczowego RFC 2119: „System SHALL wygasa sesje po 30 minutach.”. Wymagania określają *co*, a nie *jak*.

**Scenario.** Konkretny, testowalny przykład wymagania w działaniu, zazwyczaj w formie Given/When/Then. Scenariusze sprawiają, że wymaganie jest weryfikowalne: można z nich napisać automatyczny test.

**RFC 2119 keywords.** Słowa MUST, SHALL, SHOULD i MAY, które niosą ustandaryzowane znaczenie dotyczące tego, jak rygorystyczne jest dane wymaganie. MUST i SHALL są absolutne. SHOULD jest zalecane z możliwością wyjątków. MAY jest opcjonalne. Nazwa pochodzi od dokumentu standardowego internetu, który je zdefiniował.

## Artefakty (The artifacts)

**Proposal (`proposal.md`).** *Dlaczego* i *co* zmieniające: ich intencja, zakres i ogólne podejście. To pierwszy artefakt, jaki tworzysz.

**Design (`design.md`).** *Jak*: techniczne podejście, decyzje architektoniczne i pliki, które spodziewasz się dotknąć. Opcjonalny dla prostych zmian.

**Tasks (`tasks.md`).** Lista kontrolna implementacji z polami wyboru. AI przechodzi przez nią podczas `/opsx:apply` i odznacza po postępie.

## Cykl życia (The lifecycle)

**Archive.** Akt zakończenia change'a. Jego delta specs są scalane z głównymi specami, a folder change'a przenoszony do `openspec/changes/archive/YYYY-MM-DD-<name>/`. Po archiwizacji Twoje specs opisują nową rzeczywistość. Zobacz [Concepts](concepts.md#archive).

**Sync.** Scalanie delta specs z change'a z głównymi specami *bez* archiwizowania change'a. Jest to zazwyczaj automatyczne (archiwizacja oferuje tę opcję), ale dostępne samodzielnie jako `/opsx:sync` dla długotrwałych zmian. Zobacz [Commands](commands.md#opsxsync).

## Przepływ pracy i komendy (Workflow and commands)

**OPSX.** Obecny standardowy przepływ OpenSpec, zbudowany wokół płynnych działań zamiast sztywnych faz. Wszystkie jego komendy ze ukośnikiem zaczynają się od `/opsx:`. Zobacz [OPSX Workflow](opsx.md).

**Slash command.** Komenda, którą wpisujesz do czatu swojego asystenta AI, np. `/opsx:propose`. Slash commands napędzają przepływ pracy. Nie są to komendy terminalowe. Zobacz [How Commands Work](how-commands-work.md).

**Explore (`/opsx:explore`).** Komenda partnera myślowego. Czyta bazę kodu, porównuje opcje i klaruje niejasny pomysł w konkretny plan, bez tworzenia żadnych artefaktów i pisania kodu. Jest to zalecany punkt wyjścia, gdy masz problem, ale jeszcze nie plan. Zobacz [Explore First](explore.md).

**CLI.** Program `openspec`, który uruchamiasz w terminalu. Ustawia projekty, wymienia i waliduje zmiany, otwiera dashboard i archiwizuje. To część terminalowa OpenSpec. Zobacz [CLI](cli.md).

**Skill.** Folder instrukcji (`.../skills/openspec-*/SKILL.md`), który automatycznie wykrywa i podąża za niego Twój asystent AI. Skills są rozwijającym się standardem międzysystemowym do dostarczania przepływu pracy OpenSpec swojemu asystentowi.

**Command file.** Plik komendy ze ukośnikiem dla danego narzędzia (`.../commands/opsx-*`). Starszy mechanizm dostarczania, nadal wspierany obok skillsów. Rzadko musisz się z nimi bezpośrednio bawić.

**Profile.** Zbiórze slash commands zainstalowanych w Twoim projekcie. **Core** (domyślny) to `propose`, `explore`, `apply`, `sync`, `archive`. Rozszerzony zestaw dodaje `new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`. Zmieniaj go za pomocą `openspec config profile`.

**Delivery.** Czy OpenSpec instaluje skills, pliki komend, czy oba dla Twoich narzędzi. Konfigurowane globalnie i stosowane za pomocą `openspec update`.

## Dostosowanie (Customization)

**Schema.** Definicja, jakie artefakty ma przepływ pracy i jak zależą od siebie. Wbudowany domyślny to `spec-driven` (proposal → specs → design → tasks). Możesz go rozwidlić lub napisać własny. Zobacz [Customization](customization.md#custom-schemas).

**Template.** Plik Markdown w ramach schematu, który kształtuje to, co AI generuje dla danego artefaktu. Edycja szablonu natychmiast zmienia wyjście AI, bez konieczności ponownego budowania.

**Project config (`openspec/config.yaml`).** Ustawienia na poziomie projektu: domyślny schemat, `context:` wstrzyknięty do każdego zapytania planowania oraz reguły na poziomie artefaktów. Najłatwiejszy sposób na nauczenie OpenSpec o Twoim stosie i konwencjach. Zobacz [Customization](customization.md#project-configuration).

**Context injection.** Umieszczanie tła projektu w polu `context:` pliku `config.yaml`, aby było ono automatycznie dodawane do każdego artefaktu generowanego przez AI. Jest to bardziej niezawodne niż nadzieja, że AI przeczyta osobny plik.

**Dependency graph.** Graf skierowany utworzony na podstawie relacji `requires:` między artefaktami. Jest to DAG (directed acyclic graph: strzałki wskazują tylko do przodu, nigdy w pętli), a OpenSpec używa go, aby wiedzieć, co możesz stworzyć dalej.

**Enablers, not gates.** Zasada mówiąca, że zależności artefaktów pokazują, co staje się *możliwe* jako następne, a nie co jest *wymagane* jako następne. Możesz w dowolnym momencie przejrzeć i edytować każdy artefakt. Zobacz [Core Concepts at a Glance](overview.md#enablers-not-gates).

## Koordynacja między repozytoriami (beta)

Te terminy mają zastosowanie tylko wtedy, gdy Twoje planowanie obejmuje więcej niż jedno repozytorium. Są one w fazie beta. Większość użytkowników może je zignorować. Zobacz [Stores User Guide](stores-beta/user-guide.md).

**Store.** Samodzielne repozytorium, którego jedynym zadaniem jest planowanie. Ma ten sam kształt `openspec/`, który już znasz (specs i changes), plus mały plik identyfikacyjny. Rejestrujesz je raz na swojej maszynie, pod nazwą, a następnie każda komenda OpenSpec może działać w nim z dowolnego miejsca.

**Reference.** Deklaracja w `openspec/config.yaml` repozytorium kodu, wskazująca na store, z którego to repozytorium korzysta. References są tylko do odczytu: repozytorium zachowuje swój własny rdzeń, a `openspec instructions` otrzymuje indeks speców referencyjnego store'a, każdy z dokładną komendą do pobrania go.

**Working context.** To, co `openspec context` gromadzi dla bieżącego repozytorium: jego główny katalog OpenSpec wraz ze wszystkimi odniesionymi przez nie stores, każdy z informacją, jak go pobrać. Odpowiedź na pytanie „z czym pracuję?”.

**Workset.** Osobista zestawienie folderów lokalnych, które otwierasz razem (store obok repozytoriów kodu, nad którymi pracujesz). Tworzony wyraźnie za pomocą `openspec workset create`; nic z tych lokalnych ścieżek nie jest zatwierdzane do wspólnego repozytorium planowania.

## Zobacz również (See also)

- [Core Concepts at a Glance](overview.md): pięć idei na jednej stronie
- [Concepts](concepts.md): rozbudowane wyjaśnienie
- [How Commands Work](how-commands-work.md): slash commands kontra CLI