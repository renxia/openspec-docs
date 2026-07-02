# Kluczowe Koncepcje na Szybko

**OpenSpec to lekka warstwa porozumienia między Tobą a Twoim AI.** Ty zapisujesz, co zmiana powinna robić, AI szkicuje szczegóły, oboje oglądacie ten sam plan, i dopiero wtedy kod jest pisany. Ta strona stanowi cały model mentalny na jednym ekranie. Jeśli chcesz pełną wersję, [Concepts](concepts.md) ją zawiera.

Oto cała idea w pięciu słowach: **najpierw się zgodź, potem buduj pewnie.**

## Pięć Idei

Wszystko w OpenSpec opiera się na pięciu koncepcjach. Naucz się ich, a reszta to szczegóły.

**1. Specyfikacje są prawdą.** Specyfikacja opisuje, jak Twój system działa *teraz*. Znajduje się ona w `openspec/specs/`, zorganizowana według domeny (`auth/`, `payments/`, `ui/`). Specyfikacje składają się z wymagań ("system SHALL unieważniać sesje po 30 minutach") i scenariuszy (konkretnych przykładów given/when/then). Pomyśl o specyfikacjach jako o jedynym uzgodnionym отвеcie na pytanie: „co robi to oprogramowanie?”.

**2. Zmiana to jedna jednostka pracy.** Gdy chcesz dodać, zmodyfikować lub usunąć zachowanie, tworzysz zmianę: folder w `openspec/changes/` przechowujący wszystko o tej pracy w jednym miejscu. Propozycja, projekt, lista zadań i edycje specyfikacji. Jedna zmiana, jeden folder, jedna funkcja.

**3. Delta specyfikacji opisuje to, co się zmienia, a nie cały świat.** W ramach zmiany nie przepisujesz całej specyfikacji. Piszesz małą deltę: `ADDED` to wymaganie, `MODIFIED` ten drugi, `REMOVED` ten inny. To jest sztuczka, która sprawia, że OpenSpec dobrze radzi sobie z edytowaniem istniejących systemów, a nie tylko tych od zera. Opisujesz różnicę (diff), a nie cel.

**4. Artefakty budują na sobie.** Zmiana zawiera kilka dokumentów, stworzonych w naturalnej kolejności, każdy wzbogacający następny:

```text
proposal ──► specs ──► design ──► tasks ──► implement
   why        what       how       steps      do it
```

Możesz wrócić do któregokolwiek z nich w dowolnym momencie. Są one umożliwiające, a nie blokujące. (Więcej na ten temat poniżej.)

**5. Archiwizacja sprowadza zmianę z powrotem do prawdy.** Gdy praca jest skończona, archiwizujesz zmianę. Jej delta specyfikacji łączy się z głównymi specyfikacjami, a folder zmiany przenosi się do `changes/archive/` wraz z datą. Teraz Twoje specyfikacje opisują nową rzeczywistość, i jesteś gotowy na następną zmianę. Cykl się zamyka.

## Schemat

```text
┌─────────────────────────────────────────────────────────────────┐
│                          openspec/                              │
│                                                                 │
│   ┌──────────────────┐         ┌──────────────────────────┐    │
│   │     specs/       │         │        changes/          │    │
│   │                  │ ◄─────  │                          │    │
│   │ source of truth  │  merge  │ one folder per change    │    │
│   │ how things work  │  on     │ proposal · design ·      │    │
│   │ today            │ archive │ tasks · delta specs      │    │
│   └──────────────────┘         └──────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Dwa foldery. `specs/` to prawda. `changes/` to Twoja propozycja. Archiwizacja przenosi propozycję do prawdy.

## Pętla, którą faktycznie będziesz uruchamiać

W domyślnym ustawieniu Twój dzień wygląda tak. Opcjonalnie najpierw to przemyśl; następnie jedna komenda szkicuje plan, Ty go czytasz, następna buduje, a ostatnia archiwizuje.

```text
/opsx:explore                   →  (opcjonalnie) przemyśl to z AI na początku
/opsx:propose add-dark-mode     →  AI szkicuje propozycję, specyfikację, projekt i zadania
        (Ty czytasz i dostosowujesz plan)
/opsx:apply                     →  AI to buduje, odznaczając zadania
/opsx:archive                   →  specyfikacje zaktualizowane, zmiana archiwizowana
```

**Gdy masz wątpliwości, zacznij od eksploracji.** `/opsx:explore` jest partnerem do myślenia bez ryzyka: czyta Twój kod, przedstawia opcje i zamienia rozmyty pomysł w konkretny plan, zanim powstanie jakikolwiek artefakt. Jest to najlepsze antidotum na AI, które inaczej zbuduje *coś* z niejasnego polecenia. Czy już wiesz dokładnie, czego chcesz? Przejdź bezpośrednio do `/opsx:propose`. W obu przypadkach eksploracja jest obecna w domyślnym profilu, więc zawsze tam jest. Sprawdź [Przewodnik po Eksploracji](explore.md).

Są to komendy z ukośnikiem (slash commands), wpisywane w czacie swojego asystenta AI. Ustawienie (`openspec init`) odbywa się w terminalu. Jeśli ten podział jest dla Ciebie nowy, przeczytaj najpierw [Jak Działają Komendy](how-commands-work.md); to najbardziej powszechny punkt nieporozumień.

## „Ułatwiacze, a nie bramy”

To wyrażenie pojawia się wszędzie w OpenSpec, więc oto co oznacza to w prostych słowach.

Tradycyjne procesy specyfikacji są wodospadami: kończysz planowanie, *dopiero potem* możesz implementować, a powrót jest bolesny. OpenSpec temu zaprzecza. Kolejność `proposal → specs → design → tasks` pokazuje, co staje się *możliwe* dalej, a nie to, co jesteś *zmuszony* zrobić następne.

Odkryłeś podczas implementacji, że projekt był zły? Edytuj `design.md` i kontynuuj. Uświadomiłeś sobie, że zakres powinien się zmniejszyć? Zaktualizuj propozycję. Nic niczego nie blokuje. Zależności istnieją tylko po to, aby AI miało potrzebny kontekst (nie możesz napisać dobrych zadań bez specyfikacji do ich podstawienia), a nie by Cię ograniczać.

Siłą jest tu uczciwość: prawdziwa praca jest nieuporządkowana i iteracyjna, a OpenSpec to toleruje. Kompromisem jest dyscyplina: ponieważ nic Cię nie zmusza do postępu, Ty musisz utrzymać zmianę w skupieniu, zamiast pozwolić jej rozlewać się. Przewodnik [Workflows](workflows.md) zawiera dobre nawyki w tym zakresie.

## Dlaczego to jest warte niewielkiego narzutu

Prosta prawda: OpenSpec dodaje krok. Piszesz krótki plan przed budową. Więc co z tego masz?

- **Łapiesz błędne zakręty, zanim będą Cię kosztować.** Naprawienie nieporozumienia w jednoparagrafowej propozycji jest darmowe. Naprawienie tego po tym, jak AI napisało 400 linii, nie jest.
- **Plan i kod pozostają w tym samym repozytorium.** Sześć miesięcy później specyfikacja powie Ci (i kolejnej sesji AI), dlaczego system działa tak, a nie inaczej.
- **Zmiany są możliwe do przejrzenia.** Folder zmiany to schludny pakiet: przeczytaj propozycję, przejrzyj delty, sprawdź zadania. Żadnej archeologii w historii czatu.
- **Pasuje do istniejących baz kodów.** Delty oznaczają, że możesz określić zmianę w aplikacji liczącej 50 000 linii bez najpierw udokumentowania wszystkiego.

A uczciwy kompromis: dla naprawdę trywialnej poprawki jednej linii ceremonia może nie przynieść efektów, i to nic. OpenSpec jest zaprojektowany tak, by być lekki, ale nie jest darmowy. Używaj go tam, gdzie zależy na porozumieniu, co okazuje się być w większości przypadków, gdy pracujesz z AI, które pewnie zbuduje wszystko, o czym mgliście poprosiłeś.

## Co dalej

- Jesteś nowy? [Getting Started](getting-started.md) przeprowadza przez pierwszą zmianę w całości.
- Nie jesteś pewien, co budować? [Explore First](explore.md) to miejsce, aby zacząć.
- Masz wątpliwości co do tego, gdzie działają komendy? [How Commands Work](how-commands-work.md).
- Chcesz pełną wersję wszystkiego powyższego? [Concepts](concepts.md).
- Naucz się na przykładach? [Examples & Recipes](examples.md).
- Potrzebujesz definicji terminu? [Glossary](glossary.md).