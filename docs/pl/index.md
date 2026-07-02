---
layout: home

hero:
  name: "OpenSpec"
  text: "Rozwój sterowany specyfikacją dla asystentów AI"
  tagline: Lekka specyfikacja do budowania i zarządzania projektami asystentów AI.
  actions:
    - theme: brand
      text: Rozpocznij
      link: ./getting-started
    - theme: alt
      text: Strona główna
      link: /

features:
  - title: Przepływ pracy Spec-First
    details: Definiuj wymagania przed pisaniem kodu.
  - title: Projektowanie natywne dla AI
    details: Zbudowane dla Claude Code, Cursor, Windsurf i innych.
  - title: Wielojęzyczność
    details: Dokumentacja dostępna w wielu językach.
---

# Dokumentacja OpenSpec

Witaj. To strona główna wszystkiego, co dotyczy OpenSpec.

OpenSpec pomaga Ci i Twojemu asystentowi kodującemu AI **ustalić, co ma zostać zbudowane, zanim napisany zostanie jakikolwiek kod.** Opisujesz zmianę, AI szkicuje krótką specyfikację i listę zadań, oboje patrzycie na ten sam plan, a następnie praca się odbywa. Koniec z odkrywaniem w połowie drogi, że AI zbudowało coś nieprawidłowego.

Jeśli przeczytasz tylko jedną rzecz, niech to będą te dwie strony:

1. [Getting Started](getting-started.md): instalacja, inicjalizacja i wysłanie Twojej pierwszej zmiany.
2. [How Commands Work](how-commands-work.md): gdzie faktycznie wpisujesz `/opsx:propose` (wskazówka: w swoim czacie AI, a nie w terminalu). To pułapka dla prawie każdego raz.

Ta druga jest ważniejsza, niż się wydaje. OpenSpec ma dwie części: narzędzie linii komendowej, które uruchamiasz w terminalu, oraz polecenia z ukośnikiem, które podajesz swojemu asystentowi AI. Wiedza, który jest który, ratuje Cię przed najczęstszym momentem nieporozumienia.

> **Najlepszy nawyk do zbudowania na początku: gdy nie jesteś pewien, co budować, zacznij od `/opsx:explore`.** Jest to partner myślowy bez ryzyka, który czyta Twój kod, waży opcje i wyostrza mgliste pomysły w konkretny plan, zanim powstanie jakikolwiek artefakt lub kod. Przewodnik [Explore First](explore.md) przedstawia tę tezę.

## Wybierz swoją ścieżkę

**Jestem kompletnie nowy.** Zacznij od [Getting Started](getting-started.md), a następnie przejrzyj [Core Concepts at a Glance](overview.md). Gdy coś wydaje się tajemnicze, [FAQ](faq.md) i [Glossary](glossary.md) są blisko.

**Mam problem, ale nie mam planu.** To jest typowy przypadek, a ma on dedykowaną odpowiedź: [Explore First](explore.md). Użyj `/opsx:explore`, aby przemyśleć to z AI przed zobowiązaniem się do czegokolwiek.

**Mam dużą istniejącą bazę kodu.** Nie dokumentujesz jej w całości. [Using OpenSpec in an Existing Project](existing-projects.md) pokazuje, jak zacząć od prawdziwego, "brązowego" kodu bez próby zjedzenia całego oceanu.

**Chcę po prostu sprawić, by to działało.** [Install](installation.md), uruchom `openspec init`, a następnie przeczytaj [How Commands Work](how-commands-work.md), aby Twoje pierwsze polecenie z ukośnikiem trafiło w odpowiednie miejsce.

**Uczę się na przykładach.** Strona [Examples & Recipes](examples.md) przeprowadza przez rzeczywiste zmiany od początku do końca: mała funkcja, poprawka błędu, refaktoryzacja, eksploracja.

**Przechodzę ze starego przepływu pracy.** [Migration Guide](migration-guide.md) wyjaśnia, co się zmieniło i dlaczego, obiecując, że Twoja istniejąca praca jest bezpieczna.

**Chcę dostosować to do procesu mojego zespołu.** [Customization](customization.md) obejmuje konfigurację projektu, niestandardowe schematy i kontekst współdzielony.

**Coś się zepsuło.** [Troubleshooting](troubleshooting.md) zbiera awarie, z którymi ludzie faktycznie się borykają, wraz z poprawkami.

## Cała mapa

### Zacznij tutaj

| Doc | Co to daje |
|-----|-------------------|
| [Getting Started](getting-started.md) | Instalację, inicjalizację i uruchomienie Twojej pierwszej zmiany od A do Z |
| [Explore First](explore.md) | Użyj `/opsx:explore`, aby przemyśleć pomysł przed zobowiązaniem się |
| [How Commands Work](how-commands-work.md) | Gdzie działają polecenia z ukośnikiem, co oznacza „tryb interaktywny”, terminal a czat |
| [Core Concepts at a Glance](overview.md) | Cały model mentalny na jednej stronie: specyfikacje, zmiany, delty, archiwum |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix i jak zweryfikować działanie |

### Używaj codziennie

| Doc | Co to daje |
|-----|-------------------|
| [Workflows](workflows.md) | Typowe wzorce i kiedy sięgnąć po każde polecenie |
| [Examples & Recipes](examples.md) | Pełne przewodniki rzeczywistych zmian, do kopiowania i wklejania |
| [Using OpenSpec in an Existing Project](existing-projects.md) | Adopcja OpenSpec w dużej bazie kodu "brązowego" |
| [Editing & Iterating on a Change](editing-changes.md) | Aktualizacja artefaktów, powrót, rekonsyliowanie ręcznych edycji |
| [Commands](commands.md) | Odniesienie do każdego polecenia z ukośnikiem `/opsx:*` |
| [CLI](cli.md) | Odniesienie do każdego polecenia terminalowego `openspec` |

### Zrozum to dogłębnie

| Doc | Co to daje |
|-----|-------------------|
| [Concepts](concepts.md) | Długoformowa wyjaśnienie specyfikacji, zmian, artefaktów, schematów i archiwum |
| [OPSX Workflow](opsx.md) | Dlaczego przepływ pracy jest płynny, a nie zablokowany fazowo, plus dogłębna analiza architektury |
| [Glossary](glossary.md) | Każdy termin zdefiniowany w jednym miejscu |

### Spraw to swoim

| Doc | Co to daje |
|-----|-------------------|
| [Customization](customization.md) | Konfiguracja projektu, niestandardowe schematy, kontekst współdzielony |
| [Multi-Language](multi-language.md) | Generowanie artefaktów w językach innych niż angielski |
| [Supported Tools](supported-tools.md) | Ponad 25 narzędzi AI, z którymi integruje się OpenSpec i gdzie lądują pliki |

### Gdy potrzebujesz pomocy

| Doc | Co to daje |
|-----|-------------------|
| [FAQ](faq.md) | Szybkie odpowiedzi na najczęściej zadawane pytania |
| [Troubleshooting](troubleshooting.md) | Konkretne poprawki konkretnych awarii |
| [Migration Guide](migration-guide.md) | Przejście ze starego przepływu pracy do OPSX |

### Koordynuj między repozytoriami (beta)

| Doc | Co to daje |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | Planowanie w własnym repo, gdy Twoja praca obejmuje wiele repo lub zespołów |
| [Agent Contract](agent-contract.md) | Interfejsy CLI czytane przez agentów |

## Wersja trzydziestosekundowa

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (w swoim czacie AI)  /opsx:explore           ← opcjonalnie, ale świetny nawyk
4. Propose        (w swoim czacie AI)  /opsx:propose add-dark-mode
5. Build          (w swoim czacie AI)  /opsx:apply
6. Archive        (w swoim czacie AI)  /opsx:archive
```

Kroki 1 i 2 odbywają się w Twoim terminalu. Reszta dzieje się w czacie Twojego asystenta AI. Ten podział jest rzeczą wartą zapamiętania, a [How Commands Work](how-commands-work.md) wyjaśnia dokładnie dlaczego. Krok 3 jest opcjonalny, ale rozpoczęcie od `/opsx:explore`, gdy nie jesteś pewien, to nawyk najbardziej godny pielęgnowania.

## Gdzie jeszcze szukać pomocy

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) w sprawie pytań, pomysłów i pomocy.
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) w sprawie błędów i próśb o funkcje.
- **`openspec feedback "twoja wiadomość"`** wysyła informację zwrotną prosto z Twojego terminala (otwiera błąd na GitHubie).

Znalazłeś coś w tej dokumentacji, co jest nieprawidłowe, przestarzałe lub mylące? To jest błąd. Otwórz zgłoszenie lub PR. Ulepszenia dokumentacji to jedne z najbardziej wartościowych wkładów, jakie możesz wnieść.