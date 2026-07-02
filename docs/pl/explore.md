# Odkrywanie (Explore)

**`/opsx:explore` jest Twoim partnerem do myślenia. Sięgnij po niego, gdy masz problem, ale jeszcze nie plan.** Analizuje on Twoją bazę kodu, rozważa z Tobą opcje i wyjaśnia, czego naprawdę chcesz, zanim zostanie stworzony choć jeden artefakt czy linia kodu. Gdy obraz jest jasny, przekazuje sprawę do `/opsx:propose`.

Jeśli masz wynieść jedną zasadę z tych dokumentów, niech to będzie ta: **gdy nie jesteś pewien, najpierw odkrywaj (explore), zanim zaczniesz proponować.**

Oto dlaczego to ma znaczenie. Asystenci kodowania AI są pełni entuzjazmu. Zadaj ogólne pytanie, a oni z pewnością zbudują *coś*, choćby nie to, czego potrzebowałeś. Explore jest lekarstwem. Jest to rozmowa bez ryzyka, w której Ty i AI wspólnie znajdujecie właściwy kierunek, tak aby do momentu proponowania proponować właściwą rzecz.

## Kiedy należy odkrywać (explore)

Explore jest prawidłowym pierwszym krokiem częściej, niż ludzie zakładają. Użyj go, gdy zachodzi któryś z poniższych przypadków:

- Wiesz *problem*, ale nie *rozwiązanie*. ("Strony wydają się wolne." "Autoryzacja to bałagan." "Ciągle otrzymujemy duplikaty zamówień.")
- Wybierasz między podejściami i chcesz, aby kompromisy zostały przedstawione w kontekście Twojego kodu.
- Jesteś nowy w danej bazie kodu i musisz zrozumieć, jak coś działa, zanim to zmienisz.
- Wymagania są niejasne, a Ty chcesz je doprecyzować, zanim się zobowiążesz.
- Podejmujesz podejrzenie, że praca jest większa lub mniejsza niż wygląda i chcesz realistycznie określić zakres.

Omiń explore tylko wtedy, gdy wiesz dokładnie, czego chcesz i jak to zrobić. W takim przypadku przejdź bezpośrednio do [`/opsx:propose`](commands.md#opsxpropose).

## Co robi (a czego nie)

Explore jest **rozmową**, a nie generatorem.

**Co robi:**
- Czyta i przeszukuje Twoją bazę kodu, aby odpowiedzieć na prawdziwe pytania.
- Porównuje opcje i określa kompromisy dla każdej z nich.
- Tworzy diagramy, aby uczynić projekt czytelnym.
- Pomaga Ci zawęzić niejasny pomysł do konkretnego, możliwego do zbudowania zakresu.
- Przechodzi do `/opsx:propose`, gdy będziesz gotowy.

**Czego nie robi:**
- Nie tworzy folderów zmian.
- Nie pisze żadnych artefaktów (żadnych propozycji, specyfikacji, projektów ani zadań).
- Nie pisze ani nie modyfikuje kodu.

Taka jest zasada. Odkrywanie nic Cię nie kosztuje i nie zobowiązuje Cię do niczego. Możesz przeanalizować trzy ślepe zaułki, nauczyć się czegoś z każdego, a dopiero potem zaproponować drogę, która przetrwała.

## Jest już zainstalowane

Dobra wiadomość: `/opsx:explore` jest zawarty w domyślnym profilu **core**, obok `propose`, `apply`, `sync` i `archive`. Nie musisz niczego aktywować. Jeśli OpenSpec jest skonfigurowany w Twoim projekcie, explore jest gotowy w czacie AI. (Podobnie jak we wszystkich komendach `/opsx:*`, wpisujesz ją w czacie swojego asystenta, a nie w terminalu. Zobacz [Jak działają Komendy](how-commands-work.md).)

## Pełny przykład

Zobacz, jak ogólne zmartwienie zamienia się w ostry, możliwy do zbudowania przypadek.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Our checkout sometimes creates duplicate orders. I don't know why
     and I don't know how to fix it safely.

AI:  Let me dig into the checkout path...
     [reads the order service, the payment webhook handler, and the
      client submit logic]

     Here's what I found. There are two ways a duplicate can happen:

     1. The client can submit twice (double-click, retry on slow network).
        Nothing debounces it.
     2. The payment webhook can fire more than once, and the handler
        creates an order each time. There's no idempotency key.

     Cause #2 is the dangerous one: it can charge and fulfill twice.

     Three ways to fix it, roughly in order of robustness:
     - Idempotency key on the order-creation endpoint (handles both causes)
     - Dedup on the webhook by payment-intent id (handles #2 only)
     - Client-side debounce (handles #1 only, papers over the real bug)

     Given your code already stores the payment-intent id, the
     idempotency-key approach is a small change with the biggest payoff.
     Want me to scope that?

You: Yes, let's do the idempotency key.

You: /opsx:propose add-order-idempotency-key

AI:  Created openspec/changes/add-order-idempotency-key/, with a proposal
     and delta spec grounded in what we just found. Ready for implementation.
```

Zauważ, co się wydarzyło. Punktem wyjścia było "coś jest nie tak i boję się tego dotknąć". Dwadzieścia sekund eksploracji zamieniły to w nazwany pierwotny powód, trzy uszeregowane opcje, rekomendację związaną z istniejącym kodem i precyzyjną zmianę. Propozycja, która następuje, jest ostra, ponieważ myślenie odbyło się najpierw.

## Przekazanie do propose

Explore niczego nie archiwizuje. Gdy będziesz gotowy, po prostu rozpoczniesz zmianę, a AI przeniesie kontekst z Twojej rozmowy do artefaktów.

```text
explore  ──►  propose  ──►  apply  ──►  archive
 (think)     (agree)       (build)     (record)
```

Możesz to powiedzieć zwykłym językiem ("zróbmy z tego zmianę") lub uruchomić `/opsx:propose <name>` bezpośrednio. W obu przypadkach eksploracja, którą właśnie przeprowadziłeś, staje się fundamentem propozycji, a nie jednorazową rozmową.

Jeśli używasz rozszerzonego zestawu komend, explore może przekazać sprawę do `/opsx:new` zamiast tego, dla tworzenia artefaktów krok po kroku. Zobacz [Workflowy](workflows.md).

## Wskazówki dotyczące dobrej eksploracji

- **Przynieś problem, a nie rozwiązanie.** "Logowania są wolne" daje AI przestrzeń do zbadania. "Dodaj cache Redis" zobowiązuje Cię z góry do odpowiedzi, której jeszcze nie przetestowałeś.
- **Poproś o przedstawienie kompromisów na głos.** "Jakie są wady każdej opcji?" zapewni bardziej uczciwe porównanie.
- **Pozwól mu najpierw czytać.** Najlepsze eksploracje zaczynają się od tego, że AI faktycznie ogląda Twój kod, a nie zgaduje. Wskaż odpowiedni obszar, jeśli to pomoże.
- **Nic nie szkodzi w rezygnacji.** Jeśli eksploracja ujawni, że pomysł nie jest wart wysiłku, to jest to zwycięstwo. Nauczyłeś się tego tanio.
- **Eksploruj ponownie w trakcie zmiany.** Utknąłeś podczas `/opsx:apply`? Możesz cofnąć się i zbadać podproblem, a potem wrócić.

## Szczere kompromisy

**Co zyskujesz:** explore łapie błędne zakręty w najtańszym możliwym momencie, zanim powstanie jakikolwiek artefakt. Jest szczególnie potężny w nieznanej bazie kodu, gdzie zdolność AI do czytania i podsumowywania systemu oszczędza Ci popołudnie spędzane na grzebaniu.

**Co to kosztuje:** trochę cierpliwości. Explore jest rozmową, więc jest wolniejszy niż natychmiastowe uruchomienie `/opsx:propose` z nadzieją. Dla pracy, którą rozumiesz już w pełni, ten dodatkowy krok jest czystym narzutem i powinieneś go pominąć.

Zasada kciuka: im bardziej niejasne zadanie, tym większa korzyść z explore. Im jaśniejsze zadanie, tym więcej możesz przejść bezpośrednio do proponowania.

## Gdzie dalej?

- [Komendy: `/opsx:explore`](commands.md#opsxexplore): precyzyjne odniesienie
- [Workflowy](workflows.md): explore jako część codziennej pętli pracy
- [Przykłady i przepisy](examples.md#recipe-3-exploring-before-you-commit): explore w pełnym przewodniku
- [Rozpoczęcie pracy](getting-started.md): przewodnik po pierwszej zmianie, włączając eksplorację