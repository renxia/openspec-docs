# OpenSpec w zespole

Wszystko w innych przewodnikach działa tak samo, niezależnie od tego, czy pracujesz sam, czy w dwudziestoosobowym zespole. W pracy zespołowej zmieniają się kwestie poboczne: gdzie znajdują się specyfikacje, jak współpracownicy recenzują plan i jak to wszystko wpisuje się w nasz istniejący przepływ pull request.

Krótka odpowiedź: zmiana to po prostu pliki, a OpenSpec nigdy nie ingeruje w git. Dlatego pasuje do Twojego istniejącego przepływu pracy, zamiast go zastępować. Ta strona szczegółowo opisuje konwencje, które sprawdzają się dobrze.

## Jedna zasada: OpenSpec nie ingeruje w git

OpenSpec odczytuje i zapisuje czysty Markdown w katalogu `openspec/`. Nigdy nie commituje, nie branchuje, nie pushuje ani nie pulluje w Twoim projekcie — i nigdy samodzielnie nie klonuje ani nie synchronizuje [store](stores-beta/user-guide.md). Oznacza to:

- **Commitujesz `openspec/` jak każde źródło.** Specyfikacje, aktywne zmiany i archiwum są częścią historii Twojego projektu. (Tak, commituj cały folder — zobacz [FAQ](faq.md#should-i-commit-the-openspec-folder-to-git).)
- **Zmiana to folder, który wersjonujesz jak kod.** `openspec/changes/add-dark-mode/` to po prostu pliki na branchu.
- **Wszystko poniżej to konwencja, nie przymus.** OpenSpec nie zmusi Cię do robienia tego w ten sposób; po prostu to dobrze pasuje.

## Codzienny przepływ pracy

Przepływ pracy, który sprawdza się dobrze, mapuje zmianę na branch i pull request:

```
git switch -c add-dark-mode        rozpocznij branch, jak zwykle
   │
/opsx:propose add-dark-mode        szkic planu (propozycja + specyfikacje + zadania)
   │
REVIEW THE PLAN                    czytasz go przed jakimkolwiek kodem — patrz Recenzowanie Zmiany
   │
/opsx:apply                        budujesz; artefakty + zmiana kodu razem
   │
git commit && otwierasz PR         PR zawiera deltę specyfikacji ORAZ kod
   │
współpracownik recenzuje, merge'uje
   │
/opsx:archive                      zwija deltę do specs/, przenosi zmianę do archive/
```

Plan i kod znajdują się obok na tym samym branchu, dzięki czemu współpracownicy recenzują je razem, a sześć miesięcy później zarchiwizowana specyfikacja nadal wyjaśnia, dlaczego kod wygląda tak, a nie inaczej.

## Recenzowanie specyfikacji w pull requeście

To tutaj zespół widzi zysk. Kiedy PR zawiera deltę specyfikacji zmiany, recenzent otrzymuje coś, czego surowy diff nigdy nie zapewni: **opis w prostym języku tego, co ta zmiana ma zrobić**, zanim przeczyta jakąkolwiek linijkę kodu.

Dobra kolejność recenzji dla recenzenta:

1. **Przeczytaj `proposal.md`** — czy to jest właściwy problem i zakres?
2. **Przeczytaj deltę w `specs/`** — czy "zrobione" jest zdefiniowane poprawnie? (To jest dwuminutowy przebieg [Recenzowania Zmiany](reviewing-changes.md), który teraz odbywa się w PR.)
3. **Następnie przeczytaj diff kodu** — czy spełnia on dokładnie te wymagania?

Recenzent, który nie zgadza się z *podejściem*, może wyrazić to wobec propozycji, bez dodatkowych kosztów, zamiast ponownie spierać się o to w 300 liniach kodu. Umieść deltę specyfikacji blisko góry opisu PR lub wskaż recenzentom folder zmiany, aby zaczęli od niego.

## Kiedy archiwizować

Archiwizacja scala delty zmiany z Twoim głównym `openspec/specs/` i przenosi folder zmiany do `openspec/changes/archive/YYYY-MM-DD-<name>/`. Ponieważ `specs/` jest **wspólnym źródłem prawdy**, czas ma znaczenie w zespole. Dwie działające konwencje:

- **Archiwizuj po scaleniu PR (zalecane).** Branch niesie aktywną zmianę; gdy zostanie scalony z Twoim głównym branchiem, archiwizuj tam (często mały commit uzupełniający lub zaplanowane porządki). To utrzymuje współdzielony `specs/` w ruchu naprzód tylko z pracą, która faktycznie została dostarczona.
- **Archiwizuj wewnątrz PR.** Prostsze dla małych zespołów: to samo PR, które dodaje kod, również synchronizuje i archiwizuje. Kompromis polega na tym, że Twój `specs/` diff i kod diff lądują razem, co może sprawić, że PR staje się bardziej głośny.

Wybierz jedną i bądź konsekwentny. W każdym razie, `/opsx:archive` sprawdza, czy zadania są kompletne, i oferuje najpierw synchronizację, aby nic nie zostało scalone na wpół ukończone przez przypadek.

## Dwie osoby, równoległe zmiany

Ponieważ zmiany to oddzielne foldery, nie kolidują:

- **Różne zmiany, różne osoby — nie ma problemu.** `add-dark-mode` i `rate-limit-login` to różne foldery na różnych branchach; nigdy nie dotykają się nawzajem, dopóki obie nie zostaną zarchiwizowane.
- **Jedna zmiana, jeden właściciel.** Dwie osoby edytujące ten sam folder zmiany konfliktują dokładnie tak, jak dwie osoby edytujące ten sam file. Zachowaj zmianę dla jednego autora lub podziel ją na dwie zmiany (kolejny powód, aby [odpowiednio dobrać rozmiar](writing-specs.md#right-size-the-change)).
- **Jedno miejsce, w którym pojawiają się konflikty, to `specs/`.** Jeśli dwie zmiany modyfikują *to samo* wymaganie, archiwizacja drugiej spowoduje konflikt w `openspec/specs/…/spec.md` — rozwiąż go jak każdy konflikt merge'u, zachowując wymaganie, które odzwierciedla rzeczywistość. To rzadkie i jest to funkcja: to git mówi Ci, że dwie zmiany nie zgadzały się co do tego, jak system powinien się zachowywać.

## Kiedy planowanie wykracza poza jedno repo

Wszystko powyżej zakłada, że plan znajduje się we własnym folderze `openspec/` repo kodu, co jest właściwym domyślnym ustawieniem. Kiedy Twoje planowanie naprawdę obejmuje kilka repo lub zespołów — jedna funkcja dotyka trzech usług lub wymagania, których właścicielem jest jeden zespół, a konsumują je inne — to właśnie do tego służy funkcja beta **stores**: planowanie dostaje własne repo, na które może wskazać dowolne repo kodu. Zacznij od [Przewodnika Użytkownika Stores](stores-beta/user-guide.md).

## Co dalej

- [Recenzowanie Zmiany](reviewing-changes.md) — przebieg recenzji, teraz wewnątrz Twojego PR.
- [Pisanie Dobrych Specyfikacji](writing-specs.md) — w tym jak odpowiednio dobrać rozmiar zmiany, aby pasowała do jednego brancha.
- [Przewodnik Użytkownika Stores](stores-beta/user-guide.md) — planowanie, które obejmuje repo i zespoły.