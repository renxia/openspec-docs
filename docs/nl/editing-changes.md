# Het bewerken en itereren op een wijziging

**Elk artefact in een wijziging is simpelweg een Markdown-bestand dat u op elk moment kunt bewerken.** Er is geen vergrendelde "planfase", geen goedkeuringspoort, en er is geen speciale bewerkmodus om te betreden. Wilt u het voorstel aanpassen nadat u bent begonnen met bouwen? Open `proposal.md` en pas deze aan. Realiseert u dat het ontwerp fout is halverwege de implementatie? Fix `design.md` en ga door. Dat is het volledige antwoord, en dit is bewust zo ontworpen.

Deze pagina is voor het moment waarop u denkt: "wacht, kan ik teruggaan en dat veranderen?" Ja. Zo werkt het, voor elk gebruikelijk geval.

## Twee manieren om iets te bewerken

U heeft altijd beide opties:

1. **Bewerk het bestand direct.** Artefacten zijn platte Markdown in `openspec/changes/<name>/`. Open `proposal.md`, `design.md`, `tasks.md` of een delta spec onder `specs/` in uw editor en pas deze aan. Niets anders is vereist.

2. **Vraag uw AI om het te herzien.** Geef in de chat gewoon aan wat u wilt: "Pas het voorstel aan om de caching-ideeën te schrappen en een rate-limit sectie toe te voegen," of "het ontwerp moet een wachtrij gebruiken, geen polling." De AI bewerkt het artefact voor u, waarbij hij de rest van de wijziging als context gebruikt.

Gebruik degene die past bij het moment. Een kleine formulering aanpassen? Bewerk het bestand. Een substantiële heroverweging? Laat de AI reviseren met volledige context.

## "Hoe update ik het voorstel (of de specificaties) nadat ik ben begonnen?"

Update het dan. Dezelfde wijziging, verfijnd.

Als u de uitgebreide commando's gebruikt, is de natuurlijke flow: bewerk het artefact, voer vervolgens `/opsx:continue` uit om verder te gaan vanaf de nieuwe staat, of `/opsx:apply` om door te gaan met implementeren tegen het bijgewerkte plan. Als u de standaard `core` commando's gebruikt, bewerk dan het artefact en voer `/opsx:apply` uit; dit leest de huidige bestanden, dus het bouwt tegen wat de artefacten nu zeggen.

Het mentale model: artefacten zijn het levende plan, geen ondertekend contract. De AI werkt altijd vanuit hun huidige inhoud, dus ze bewerken ze om de voortgang te sturen.

```text
U: Ik wil de aanpak van deze wijziging veranderen.

U: [bewerk design.md, of vertel de AI:]
     Pas design.md aan om een achtergrondtaak in plaats van een synchrone oproep te gebruiken.

AI:  design.md is bijgewerkt. De taallijst past nog steeds; wilt u dat ik doorga met toepassen?

U: /opsx:apply
```

Dit beantwoordt een zeer veelgestelde vraag: er is geen afzonderlijk "voorstel updaten" commando, omdat dit niet nodig is. Het bestand is de waarheidbron, en het bewerken ervan (met de hand of via de AI) is de update.

## "Hoe ga ik terug om te beoordelen nadat ik heb geïmplementeerd?"

U hoeft er niet "terug te gaan", want u bent nooit weggegaan. De workflow is vloeiend: beoordelen, bewerken en implementatie zijn geen opeenvolgende fasen waarin u vastzit.

Concreet, na enig werk met `/opsx:apply`:

- Wilt u het plan opnieuw bekijken? Open de artefacten en lees ze door, of voer `openspec show <change>` uit in uw terminal voor een geconsolideerd overzicht.
- Heeft u iets gevonden om te veranderen? Bewerk het artefact (of vraag de AI dit te doen), en ga verder.
- Wilt u een gestructureerde controle dat de code overeenkomt met het plan? Voer `/opsx:verify` uit (uitgebreid commando). Dit rapporteert volledigheid, correctheid en coherentie zonder iets te blokkeren. Zie [Workflows: Verify](workflows.md#verify-check-your-work).

Er is geen "beoordelingsfase" om naar terug te keren, want beoordelen is iets wat u op elk moment kunt doen, inclusief na de implementatie.

## "Ik heb de code met de hand bewerkt. Hoe breng ik dit in overeenstemming met OpenSpec?"

Dit gebeurt voortdurend en dat is prima. U heeft iets in uw editor aangepast, en nu komen de code en de artefacten niet overeen. Breng ze weer in sync in welke richting dan ook waar is:

- **De code is nu correct, de specificatie is verouderd.** Update de delta spec (en taken, indien relevant) om het gedrag te beschrijven dat u daadwerkelijk hebt geleverd. De specificatie moet overeenkomen met de realiteit voordat u archiveert, want archiveren mergt de specificatie in uw waarheidbron.
- **De specificatie is correct, de code is afgewandeld.** Blijf bouwen of repareren totdat de code overeenkomt met de specificatie.

Een snelle manier om mismatches te tonen is `/opsx:verify`: het leest uw artefacten en uw code en vertelt u waar ze van elkaar afwijken. Behandel de output als een takenlijst voor reconciliatie, en archiveer pas wanneer ze overeenkomen.

Het principe: bij archivering worden uw specificaties de officiële waarheid. Dus voordat u archiveert, maak de specificaties eerlijk over wat de code doet. Handmatige bewerkingen zijn welkom; laat ze alleen niet stilletjes van de sync afwijken.

## Het verfijnen van een voorstel waar u niet tevreden mee bent

Als een gegenereerd voorstel tekortschiet, heeft u drie goede opties:

- **Itereer op dezelfde plek.** Vertel de AI wat er mis is ("de scope is te breed, schrap de adminfuncties") en laat deze reviseren. Het goedkoopst en meestal het juiste.
- **Eerst verkennen, dan opnieuw voorstellen.** Als het probleem is dat het idee zelf onduidelijk is, stap dan terug naar `/opsx:explore`, denk erover na, en laat een scherpere voorstel daaruit komen. Zie [Explore First](explore.md).
- **Begin opnieuw.** Als de intentie fundamenteel is veranderd, kan een nieuwe wijziging duidelijker zijn dan het pleisteren van de oude.

Die laatste optie heeft zijn eigen beslissingsgids, zo meteen.

## Wanneer updaten versus een nieuwe wijziging starten

Korte versie: **update wanneer het hetzelfde werk is dat verfijnd is; start nieuw wanneer de intentie fundamenteel is veranderd of de scope is geëxplodeerd in ander werk.**

- Zelfde doel, betere aanpak? Update.
- Scope vernauwen (nu de MVP leveren, meer later)? Update, archiveer dan, en daarna een nieuwe wijziging voor fase twee.
- Het probleem zelf is veranderd ("dark mode toevoegen" is geworden "een volledig themasysteem bouwen")? Nieuwe wijziging.

Er is een volledige flowchart en werkende voorbeelden in [Workflows: When to Update vs Start Fresh](workflows.md#when-to-update-vs-start-fresh) en een diepere behandeling in [OPSX: When to Update vs. Start Fresh](opsx.md#when-to-update-vs-start-fresh).

## Een opmerking over taken

`tasks.md` is een levende checklist, geen bevroren plan. Naarmate u implementeert, kunt u taken toevoegen die u ontdekt heeft, die onnodig bleken te verwijderen, of ze herschikken. De AI vinkt items af zodra deze worden voltooid tijdens `/opsx:apply`, en hij hervat bij de eerste niet-gevinkte taak als u later terugkomt. Het bewerken van de lijst onderweg is verwacht.

## Waar te gaan
- [Workflows](workflows.md) - patronen, plus de beslissingsgids over updaten versus nieuw starten
- [Explore First](explore.md) - de plek om naar terug te keren als een idee heroverwogen moet worden
- [Commands](commands.md) - `/opsx:continue`, `/opsx:apply` en `/opsx:verify` in detail
- [Concepts: Artifacts](concepts.md#artifacts) - waar elk artefact voor dient