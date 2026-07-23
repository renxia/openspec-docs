# Goede Specificaties Schrijven

Je schrijft zelden een specificatie op vanaf een blanco pagina. Je beschrijft een wijziging in gewone taal, `/opsx:propose` stelt de vereisten en scenario's op, en dan maak je ze goed. Deze pagina gaat over dat laatste deel — hoe "goed" eruitziet, en hoe je de AI in die richting stuurt.

Het is het complement op [Een Wijziging Beoordelen](reviewing-changes.md): beoordelen is het vinden van de zwakke punten in een concept, schrijven is weten waar een sterke opgebouwd is.

## Een specificatie is gedrag, geen code

Een specificatie zegt wat je systeem *doet*, in termen die iedereen kan controleren — niet hoe het gebouwd is. Het bestaat uit **vereisten** (uitspraken over gedrag) en **scenario's** (concrete voorbeelden die ze bewijzen).

```markdown
### Requirement: Session Timeout
The system SHALL expire a session after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass with no activity
- THEN the session is invalidated and the user must re-authenticate
```

Bewaar het *hoe* — de wachtrij, de bibliotheek, het tabelschema — in `design.md` of de code. Wanneer gedrag en implementatie in één vereiste worden gemengd, stopt de vereiste met testbaar te zijn en begint deze te verouderen zodra de code verandert.

## Wat maakt een goede vereiste

Een goede vereiste is één gedrag, zo duidelijk verwoord dat je het aan iemand anders kunt geven om te testen.

- **Eén uitspraak, één `SHALL`/`MUST`.** Als een vereiste drie "en ook" clausules heeft, zijn het in feite drie vereisten. Splits ze.
- **Observeerbaar.** Iemand buiten de code moet kunnen bepalen of het waar is. "Het systeem MOET een foutbanner weergeven wanneer de upload 10 MB overschrijdt" is observeerbaar. "Het systeem MOET grote uploads elegant verwerken" is dat niet.
- **De juiste sterkte.** OpenSpec gebruikt de RFC 2119 trefwoorden, en ze betekenen verschillende dingen:

  | Trefwoord | Betekenis |
  |---------|---------|
  | `MUST` / `SHALL` | Een harde vereiste. Onderhandelingsvrij. |
  | `SHOULD` | Een sterke aanbeveling, met ruimte voor een gerechtvaardigde uitzondering. |
  | `MAY` | Echt optioneel. |

  Gebruik standaard `MUST`/`SHALL`. Gebruik `SHOULD` alleen als je echt bedoelt "tenzij er een goede reden is om het niet te doen."

De test voor een vereiste: *zou een tester die de code nog nooit heeft gezien kunnen zeggen of deze geslaagd is?* Zo niet, dan moet het worden aangescherpt.

## Wat maakt een goed scenario

Scenario's zijn waar een vereiste zijn waarde bewijst. Elk is een concreet GIVEN / WHEN / THEN dat een geautomatiseerde test zou kunnen worden.

- **Het oefent zijn vereiste.** Een scenario dat de vereiste gewoon in andere woorden herhaalt, test niets. Maak er een specifieke situatie met een specifiek resultaat van.
- **Dek de gevallen die ertoe doen, niet alleen het happy path.** De geldige login is makkelijk. De lege invoer, het verlopen token, de tweede klik, het wat misgaat — daar leven de bugs, en daar is een scenario het meest waard.
- **Noem het geval in de titel.** "Scenario: Weigert een verlopen token" vertelt een beoordeler in één oogopslag wat gedekt is; "Scenario: Test 2" niet.

Een nuttige gewoonte: voor je goedkeurt, vraag *wat is het enige geval waarvan ik het vervelend zou vinden als het kapot is?* — en zorg ervoor dat een scenario het noemt.

## Kies het juiste type delta

Een wijziging beschrijft zijn bewerkingen aan de specificaties met drie sectietypen. Het gebruik van de juiste houdt je gearchiveerde specificaties eerlijk:

- **`## ADDED Requirements`** — gloednieuw gedrag dat eerder niet bestond.
- **`## MODIFIED Requirements`** — gedrag dat al bestaat en verandert. Neem de volledige nieuwe versie op; een korte notitie over wat er veranderd is, helpt een beoordeler.
- **`## REMOVED Requirements`** — gedrag dat verdwijnt, met een regel over waarom.

Bij archivering wordt ADDED toegevoegd aan de hoofdspecificatie, vervangt MODIFIED de oude versie en wordt REMOVED verwijderd. Als je een echte wijziging markeert als ADDED, eindig je met twee concurrerende vereisten; als je nieuw gedrag beschrijft als MODIFIED, is er niets om te vervangen. Bij twijfel open je de huidige specificatie en kijk je of de vereiste er al staat.

## Maak de wijziging de juiste grootte

De meest voorkomende schrijffout is niet een slecht geformuleerde vereiste — het is een wijziging die probeert drie wijzigingen te zijn.

**Een goede wijziging heeft één intentie die je in één zin kunt zeggen.** "Voeg een schakelaar voor de donkere modus toe." "Rate-limit het login-eindpunt." "Migreer sessies weg van cookies." Als het beschrijven van de wijziging veel "en ook" nodig heeft, is dat het signaal om het te splitsen.

Tekenen dat een wijziging te groot is:

- Het voorstel leest zich als een lijst met niet-gerelateerde functies.
- Het beoordelen ervan zou een namiddag duren, dus niemand zal het doen.
- Twee mensen zouden er niet aan kunnen werken zonder te botsen.
- De helft van de taken zou op zichzelf kunnen worden geleverd.

Kleinere wijzigingen zijn makkelijker te beoordelen, makkelijker in één gerichte sessie te bouwen, en makkelijker over na te denken zes maanden later als het archief het enige is dat overblijft. Je kunt altijd meerdere wijzigingen parallel uitvoeren — zie [Bewerken & itereren](editing-changes.md) en [Workflows](workflows.md).

Het tegenovergestelde gebeurt ook: een typfoutcorrectie van één regel heeft geen drie vereisten en een ontwerpnodig nodig. Stem de formaliteiten af op het belang.

## Hoe je de AI naar een goed concept stuurt

Omdat `/opsx:propose` het eerste concept doet, loopt de kwaliteit van wat je terugkrijgt gelijk met de kwaliteit van wat je geeft. Je hoeft vereisten niet met de hand te schrijven — je moet de AI goed richten:

- **Geef de intentie en de grens aan.** *"Voeg een schakelaar voor de donkere modus toe die de OS-instelling volgt bij het eerste laden — raak de bestaande thema-API niet aan."* De out-of-scope helft is net zo belangrijk als de in-scope helft.
- **Noem de gevallen waar je om geeft.** *"Zorg ervoor dat er een scenario is voor een gebruiker die al handmatig een thema heeft gekozen."* De AI dekt wat je aanwijst.
- **Bewerk het daarna.** Het is gewone Markdown. Scherp een vage `SHALL` aan, verwijder een scenario dat niets test, voeg het geval toe dat het miste — of vraag het de AI: *"de time-out vereiste is vaag, maak het 30 minuten."*

Concept, aanscherpen, herhalen. Een paar rondes daarvan produceren een specificatie die je zou vertrouwen, wat het hele punt is.

## Een snelle checklist

- [ ] Elke vereiste is één observeerbaar gedrag met een `SHALL`/`MUST`.
- [ ] Er zijn geen implementatiedetails in de vereisten verwerkt.
- [ ] Elke vereiste heeft ten minste één scenario die het daadwerkelijk oefent.
- [ ] De belangrijke edge- en foutgevallen hebben scenario's, niet alleen het happy path.
- [ ] Delta's gebruiken ADDED / MODIFIED / REMOVED correct ten opzichte van de huidige specificatie.
- [ ] De hele wijziging heeft één intentie die je in één zin kunt verwoorden.

## Waar je verder heen kunt

- [Een Wijziging Beoordelen](reviewing-changes.md) — de twee-minutencontrole die vangt wat er door de mand is gevallen.
- [Concepten](concepts.md) — het dieperliggende model achter specificaties, wijzigingen en delta's.
- [Voorbeelden & Recepten](examples.md) — echte wijzigingen van begin tot eind.