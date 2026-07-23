---
layout: home

hero:
  name: "OpenSpec"
  text: "Rozwój oparty na specyfikacji dla asystentów AI"
  tagline: Lekka specyfikacja do budowania i zarządzania projektami asystentów AI.
  actions:
    - theme: brand
      text: Rozpocznij
      link: ./getting-started
    - theme: alt
      text: Strona główna
      link: /

features:
  - title: Podejście oparte na specyfikacji
    details: Definiuj wymagania przed napisaniem kodu.
  - title: Projekt z myślą o AI
    details: Stworzony dla Claude Code, Cursor, Windsurf i innych.
  - title: Wielojęzyczność
    details: Dokumentacja dostępna w wielu językach.
---

# Dokumentacja OpenSpec

Witaj. To jest miejsce dla wszystkiego, co związane z OpenSpec.

OpenSpec pomaga Tobie i Twojemu asystentowi kodowania AI **uzgodnić, co zbudować, zanim jakikolwiek kod zostanie napisany.** Opisujesz zmianę, AI przygotowuje krótką specyfikację i listę zadań, obaj patrzycie na ten sam plan, a następnie zaczyna się praca. Koniec z odkrywaniem w połowie drogi, że AI zbudowało coś złego.

Jeśli nie przeczytasz nic innego, przeczytaj te dwie strony:

1. [Rozpoczęcie](getting-started.md): instalacja, inicjalizacja i wdrożenie pierwszej zmiany.
2. [Jak działają polecenia](how-commands-work.md): gdzie faktycznie wpisujesz `/opsx:propose` (podpowiedź: w czacie AI, nie w terminalu). To dezorientuje prawie każdego chociaż raz.

Ta druga strona jest ważniejsza, niż się wydaje. OpenSpec składa się z dwóch części: narzędzia wiersza polecenia, które uruchamiasz w terminalu, oraz poleceń z ukośnikiem (slash commands), które przekazujesz swojemu asystentowi AI. Znajomość tego, które jest które, chroni Cię przed najczęstszym momentem dezorientacji.

> **Najlepszy nawyk na początek: gdy nie jesteś pewien, co zbudować, zacznij od `/opsx:explore`.** To bezpieczny partner do myślenia, który czyta Twój kod, rozważa opcje i doprecyzowuje mglistą ideę w konkretny plan, zanim jakikolwiek artefakt lub kod powstanie. Przewodnik [Eksploracja najpierw](explore.md) wyjaśnia dlaczego.

## Wybierz swoją ścieżkę

**Jestem zupełnie nowy.** Zacznij od [Rozpoczęcia](getting-started.md), potem przejrzyj [Koncepcje główne w skrócie](overview.md). Gdy coś wydaje się tajemnicze, [FAQ](faq.md) i [Słownik](glossary.md) są pod ręką.

**Mam problem, ale nie mam planu.** To częsty przypadek i ma dedykowaną odpowiedź: [Eksploracja najpierw](explore.md). Użyj `/opsx:explore`, aby przemyśleć to z AI przed podjęciem jakichkolwiek zobowiązań.

**Mam dużą, istniejącą bazę kodu.** Nie dokumentujesz jej całej. [Używanie OpenSpec w istniejącym projekcie](existing-projects.md) pokazuje, jak zacząć od rzeczywistego, istniejącego kodu (brownfield) bez robienia z igły widła.

**Chcę tylko, żeby to działało.** [Zainstaluj](installation.md), uruchom `openspec init`, potem przeczytaj [Jak działają polecenia](how-commands-work.md), aby Twoje pierwsze polecenie z ukośnikiem trafiło we właściwe miejsce.

**Uczę się na przykładach.** Strona [Przykłady i przepisy](examples.md) przeprowadzi Cię przez rzeczywiste zmiany od początku do końca: małą funkcję, poprawkę błędu, refaktoryzację, eksplorację.

**AI właśnie przygotowało plan — co teraz?** Przeczytaj go. [Przeglądanie zmiany](reviewing-changes.md) pokazuje dwuminutowe przeglądnięcie, które wyłapuje błędny zakręt, gdy jest to jeszcze tanie, a [Pisanie dobrych specyfikacji](writing-specs.md) opisuje, z czego składa się plan warty zatwierdzenia.

**Pracujesz w zespole.** [OpenSpec w zespole](team-workflow.md) pokazuje, jak zmiana mapuje się na gałąź i pull request, oraz jak członkowie zespołu przeglądają plan przed kodem.

**Przechodzę ze starego przepływu pracy.** [Przewodnik migracji](migration-guide.md) wyjaśnia, co się zmieniło i dlaczego, oraz obiecuje, że Twoja istniejąca praca jest bezpieczna.

**Chcę dostosować go do procesu mojego zespołu.** [Dostosowywanie](customization.md) opisuje konfigurację projektu, niestandardowe schematy i współdzielony kontekst.

**Coś jest zepsute.** [Rozwiązywanie problemów](troubleshooting.md) zbiera awarie, które faktycznie spotykają ludzi, wraz z poprawkami.

## Cała mapa

### Zacznij tutaj

| Dokument | Co Ci daje |
|-----|-------------------|
| [Rozpoczęcie](getting-started.md) | Instalacja, inicjalizacja i przeprowadzenie Twojej pierwszej zmiany od początku do końca |
| [Eksploracja najpierw](explore.md) | Użyj `/opsx:explore`, aby przemyśleć ideę przed podjęciem zobowiązania |
| [Jak działają polecenia](how-commands-work.md) | Gdzie uruchamiane są polecenia z ukośnikiem, co oznacza "tryb interaktywny", terminal kontra czat |
| [Koncepcje główne w skrócie](overview.md) | Cały model mentalny na jednej stronie: specyfikacje, zmiany, delty, archiwum |
| [Instalacja](installation.md) | npm, pnpm, yarn, bun, Nix i jak sprawdzić, czy zadziałało |

### Używaj na co dzień

| Dokument | Co Ci daje |
|-----|-------------------|
| [Przepływy pracy](workflows.md) | Typowe wzorce i kiedy sięgać po każde polecenie |
| [Przykłady i przepisy](examples.md) | Pełne przewodniki po rzeczywistych zmianach, gotowe do skopiowania i wklejenia |
| [Pisanie dobrych specyfikacji](writing-specs.md) | Jak wygląda silne wymaganie i scenariusz, oraz jak dopasować rozmiar zmiany |
| [Przeglądanie zmiany](reviewing-changes.md) | Dwuminutowe przeglądnięcie przygotowanego planu przed napisaniem jakiegokolwiek kodu |
| [OpenSpec w zespole](team-workflow.md) | Jak zmiany pasują do gałęzi, pull requestów i przeglądów |
| [Używanie OpenSpec w istniejącym projekcie](existing-projects.md) | Wdrażanie OpenSpec na dużej bazie kodu brownfield |
| [Edytowanie i iterowanie zmiany](editing-changes.md) | Aktualizuj artefakty, wróć, uzgodnij ręczne edycje |
| [Polecenia](commands.md) | Dokumentacja dla każdego polecenia z ukośnikiem `/opsx:*` |
| [CLI](cli.md) | Dokumentacja dla każdego polecenia terminala `openspec` |

### Zrozum głęboko

| Dokument | Co Ci daje |
|-----|-------------------|
| [Koncepcje](concepts.md) | Wyjaśnienie w długiej formie specyfikacji, zmian, artefaktów, schematów i archiwum |
| [Przepływ pracy OPSX](opsx.md) | Dlaczego przepływ jest płynny zamiast zablokowany na fazach, plus głębokie zanurzenie w architekturę |
| [Słownik](glossary.md) | Każdy termin zdefiniowany w jednym miejscu |

### Zrób to swoje

| Dokument | Co Ci daje |
|-----|-------------------|
| [Dostosowywanie](customization.md) | Konfiguracja projektu, niestandardowe schematy, współdzielony kontekst |
| [Wielojęzyczność](multi-language.md) | Generuj artefakty w językach innych niż angielski |
| [Obsługiwane narzędzia](supported-tools.md) | Ponad 25 narzędzi AI, z którymi integruje się OpenSpec, i gdzie lądują pliki |

### Gdy potrzebujesz pomocy

| Dokument | Co Ci daje |
|-----|-------------------|
| [FAQ](faq.md) | Szybkie odpowiedzi na pytania, które ludzie zadają najczęściej |
| [Rozwiązywanie problemów](troubleshooting.md) | Konkretne poprawki dla konkretnych awarii |
| [Przewodnik migracji](migration-guide.md) | Przechodzenie ze starszego przepływu pracy na OPSX |

### Koordynacja między repozytoriami (beta)

| Dokument | Co Ci daje |
|-----|-------------------|
| [Magazyny: Przewodnik użytkownika](stores-beta/user-guide.md) | Planuj we własnym repozytorium, gdy Twoja praca obejmuje repozytoria lub zespoły |
| [Kontrakt agenta](agent-contract.md) | Czytelne maszynowo CLI, którymi sterują agenci |

## Wersja na trzydzieści sekund

```text
1. Instalacja      npm install -g @fission-ai/openspec@latest
2. Inicjalizacja   cd your-project && openspec init
3. Eksploracja     (w czacie AI)  /opsx:explore           ← opcjonalne, ale świetny nawyk
4. Propozycja      (w czacie AI)  /opsx:propose add-dark-mode
5. Budowanie       (w czacie AI)  /opsx:apply
6. Archiwizacja    (w czacie AI)  /opsx:archive
```

Kroki 1 i 2 odbywają się w Twoim terminalu. Reszta dzieje się w czacie Twojego asystenta AI. Ten podział to jedna rzecz, którą warto zapamiętać, a [Jak działają polecenia](how-commands-work.md) dokładnie wyjaśnia dlaczego. Krok 3 jest opcjonalny, ale rozpoczynanie od `/opsx:explore`, gdy nie jesteś pewien, to nawyk, który najbardziej warto wypracować.

## Gdzie jeszcze szukać pomocy

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) dla pytań, pomysłów i pomocy.
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) dla błędów i próśb o nowe funkcje.
- **`openspec feedback "twoja wiadomość"`** wysyła opinię bezpośrednio z Twojego terminala (otwiera GitHub issue).

Znalazłeś coś w tej dokumentacji, co jest błędne, nieaktualne lub mylące? To błąd. Otwórz issue lub PR. Ulepszenia dokumentacji to jeden z najcenniejszych wkładów, jakie możesz wnieść.