# Kernconcepten in één oogopslag

**OpenSpec is een lichtgewichtige overeenkomstlaag tussen jou en je AI.** Jij schrijft op wat een wijziging moet doen, de AI stelt de details op, jullie bekijken samen hetzelfde plan, en pas daarna wordt code geschreven. Deze pagina bevat het volledige mentale model op één scherm. Als je de uitgebreide versie wilt, dan staat deze in [Concepts](concepts.md).

Hier is het hele idee in vijf woorden: **eerst overeenkomen, dan met vertrouwen bouwen.**

## De vijf ideeën

Alles wat in OpenSpec zit, is gebouwd op vijf concepten. Leer deze en de rest is detail.

**1. Specs zijn de waarheid.** Een spec beschrijft hoe je systeem *nu* functioneert. Het staat in `openspec/specs/`, georganiseerd per domein (`auth/`, `payments/`, `ui/`). Specs bestaan uit vereisten ("het systeem MOET sessies na 30 minuten verlopen") en scenario's (concrete given/when/then voorbeelden). Zie specs als het enige overeengekomen antwoord op de vraag "wat doet deze software?".

**2. Een wijziging is één werkseenheid.** Als je gedrag wilt toevoegen, aanpassen of verwijderen, creëer je een wijziging: een map in `openspec/changes/` die alles over dat werk op één plek bevat. Een voorstel, een ontwerp, een takenlijst en de spec-wijzigingen. Eén wijziging, één map, één functionaliteit.

**3. Delta specs beschrijven wat verandert, niet de hele wereld.** Binnen een wijziging herschrijf je niet de volledige spec. Je schrijft een kleine delta: `ADDED` deze vereiste, `MODIFIED` die ene, `REMOVED` deze andere. Dit is de truc waardoor OpenSpec goed is in het bewerken van bestaande systemen, en niet alleen projecten vanaf nulpunt. Je beschrijft het verschil (diff), niet de bestemming.

**4. Artefacten bouwen op elkaar voort.** Een wijziging bevat een aantal documenten, die in een natuurlijke volgorde worden gecreëerd, waarbij elk het volgende voedt:

```text
proposal ──► specs ──► design ──► tasks ──► implement
   waarom    wat       hoe       stappen      doe het
```

Je kunt ze op elk moment opnieuw bekijken. Ze zijn facilitators, geen obstakels. (Meer hieronder.)

**5. Archivering brengt de wijziging terug in de waarheid.** Als het werk is voltooid, archiveer je de wijziging. De delta specs worden samengevoegd met de hoofdspecs, en de wijzigingsmap wordt naar `changes/archive/` verplaatst met een datumstempel. Nu beschrijven je specs de nieuwe realiteit, en je bent klaar voor de volgende wijziging. De cyclus is gesloten.

## Het overzicht

```text
┌─────────────────────────────────────────────────────────────────┐
│                          openspec/                              │
│                                                                 │
│   ┌──────────────────┐         ┌──────────────────────────┐    │
│   │     specs/       │         │        changes/          │    │
│   │                  │ ◄─────  │                          │    │
│   │ bron van waarheid │  merge  │ één map per wijziging    │    │
│   │ hoe dingen werken│  op     │ proposal · design ·      │    │
│   │ vandaag         │ archive │ tasks · delta specs      │    │
│   └──────────────────┘         └──────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Twee mappen. `specs/` is wat waar is. `changes/` is wat je voorstelt. Archivering verplaatst een voorstel naar de waarheid.

## De loop die je daadwerkelijk gaat draaien

In de standaardinstelling ziet je dag er zo uit. Denk optioneel eerst na; daarna stelt één commando het plan op, je leest het, de volgende bouwt het, en de laatste archiveert de bestanden.

```text
/opsx:explore                   →  (optioneel) eerst nadenken met de AI
/opsx:propose add-dark-mode     →  AI stelt voorstel, specs, ontwerp en taken op
        (je leest het plan en past het aan)
/opsx:apply                     →  AI bouwt het, vinkt taken af
/opsx:archive                   →  specs bijgewerkt, wijziging gearchiveerd
```

**Als je twijfelt, begin dan met verkennen.** `/opsx:explore` is een denkpartner zonder risico's: het leest je code, schetst opties en verandert een vage gedachte in een concreet plan voordat er enig artefact bestaat. Het is het beste antwoord op een AI die anders *iets* zou bouwen op basis van een vaag prompt. Weet je al precies wat je wilt? Ga dan direct door naar `/opsx:propose`. Hoe dan ook, verkennen is opgenomen in het standaardprofiel, dus het is altijd beschikbaar. Zie de [Explore guide](explore.md).

Dit zijn slash commands die worden ingevoerd in de chat van je AI-assistent. De setup (`openspec init`) gebeurt in je terminal. Als deze splitsing nieuw voor jou is, lees dan eerst [How Commands Work](how-commands-work.md); dit is het meest voorkomende punt van verwarring.

## "Faciliteren, geen obstakels"

Deze zin komt overal in OpenSpec voorbij, dus hier is wat het betekent in eenvoudige bewoordingen.

Oude specprocessen zijn watervallen: eerst de planning afronden, *dan* mag je implementeren, en teruggaan is pijnlijk. OpenSpec weigert dat. De volgorde `proposal → specs → design → tasks` toont wat *mogelijk wordt* daarna, niet wat je *gedwongen bent* te doen.

Ontdek tijdens de implementatie dat het ontwerp fout was? Bewerk `design.md` en ga door. Realiseer je dat de scope moet krimpen? Update het voorstel. Niets blokkeert. De afhankelijkheden bestaan alleen zodat de AI het context heeft nodig die zij nodig heeft (je kunt geen goede takenlijst schrijven zonder specs om op te baseren), niet om je in een kooi te stoppen.

De kracht hierin is eerlijkheid: echt werk is rommelig en iteratief, en OpenSpec laat dat toe. Het compromis is discipline: omdat niets je dwingt verder te gaan, ligt het aan jou om de wijziging gefocust te houden in plaats van dat deze uitwaait. De [Workflows](workflows.md) guide bevat goede gewoontes hiervoor.

## Waarom dit de kleine overhead waard is

Eerlijke waarheid: OpenSpec voegt een stap toe. Je schrijft eerst een kort plan voordat je bouwt. Dus wat krijg je ervoor terug?

- **Je vangt verkeerde keuzes op voordat ze je kosten.** Een misverstand in een paragraaf lang voorstel corrigeren is gratis. Dat na de AI 400 regels heeft geschreven, niet.
- **Het plan en de code blijven in dezelfde repo.** Zes maanden later vertelt de spec jou (en de volgende AI-sessie) waarom het systeem zo werkt.
- **Wijzigingen zijn reviewbaar.** Een wijzigingsmap is een nette bundel: lees het voorstel, skim de deltas, controleer de taken. Geen archeologie door chatgeschiedenis.
- **Het past bij bestaande codebase's.** Deltas betekenen dat je een wijziging aan een 50.000 regels grote app kunt specificeren zonder eerst het hele ding te documenteren.

En het eerlijke compromis: voor een echt triviale één-regelige fix is de ceremonie misschien niet opgewassen, en dat is prima. OpenSpec is ontworpen om lichtgewichtig te zijn, maar het is niet gratis. Gebruik het waar overeenstemming belangrijk is, wat blijkt te zijn de meeste tijd wanneer je met een AI werkt die zelfverzekerd bouwt wat je vaag hebt gevraagd.

## Waar je nu heen kunt

- Ben je nieuw hier? [Getting Started](getting-started.md) doorloopt de eerste wijziging volledig.
- Weet je nog niet wat je moet bouwen? [Explore First](explore.md) is het startpunt.
- Bent je in de war over waar commando's draaien? [How Commands Work](how-commands-work.md).
- Wil je de diepe versie van alles hierboven? [Concepts](concepts.md).
- Leer door voorbeelden? [Examples & Recipes](examples.md).
- Heb je een term gedefinieerd nodig? [Glossary](glossary.md).