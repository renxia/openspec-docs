# Bewerken & Itereren op een Wijziging

**Elk artefact in een wijziging is gewoon een Markdown-bestand dat je op elk moment kunt bewerken.** Er is geen vergrendelde 'planningsfase', geen goedkeuringspoort, geen speciale bewerkingsmodus om in te gaan. Wil je het voorstel aanpassen nadat je bent begonnen met bouwen? Open `proposal.md` en pas het aan. Merk je dat het ontwerp halverwege de implementatie fout is? Herstel `design.md` en ga door. Dat is het hele antwoord, en het is opzettelijk zo.

Deze pagina is voor het moment dat je denkt 'wacht, kan ik teruggaan en dat aanpassen?' Ja. Hier is hoe, voor elke veelvoorkomende situatie.

## Twee manieren om alles te bewerken

Je hebt altijd beide:

1. **Bewerk het bestand direct.** Artefacten zijn eenvoudige Markdown in `openspec/changes/<name>/`. Open `proposal.md`, `design.md`, `tasks.md`, of een delta-specificatie onder `specs/` in je editor en pas het aan. Niets anders is nodig.

2. **Vraag je AI om het te herzien.** In de chat zeg je gewoon wat je wilt: "Update the proposal to drop the caching idea and add a rate-limit section," of "the design should use a queue, not polling." De AI bewerkt het artefact voor jou, met de rest van de wijziging als context.

Gebruik wat het beste past bij het moment. Kleine aanpassing van de woorden? Bewerk het bestand. Fundamentele herziening? Laat de AI herzien met volledige context.

## "Hoe update ik het voorstel (of specificaties) nadat ik ben begonnen?"

Update het gewoon. Dezelfde wijziging, verfijnd.

Als je de uitgebreide opdrachten gebruikt, is de natuurlijke flow: bewerk het artefact, voer daarna `/opsx:continue` uit om op te pakken vanaf de nieuwe staat, of `/opsx:apply` om door te gaan met implementeren tegen de bijgewerkte planning. Als je de standaard `core`-opdrachten gebruikt, bewerk je het artefact en voer je `/opsx:apply` uit; het leest de huidige bestanden, dus het bouwt tegen wat de artefacten nu zeggen.

Het mentale model: artefacten zijn de actuele planning, geen ondertekend contract. De AI werkt altijd vanuit hun huidige inhoud, dus bewerken ervan stuurt het werk.

```text
You: I want to change the approach in this change.

You: [edit design.md, or tell the AI:]
     Update design.md to use a background job instead of a synchronous call.

AI:  Updated design.md. The task list still fits; want me to continue applying?

You: /opsx:apply
```

Dit beantwoordt een veelvoorkomende vraag: er is geen aparte 'update voorstel'-opdracht omdat je die niet nodig hebt. Het bestand is de bron van waarheid, en het bewerken ervan (met de hand of via de AI) is de update.

## "Hoe ga ik terug naar reviewen na implementatie?"

Je hoeft niet 'terug te gaan', want je bent nooit weggegaan. De werkflow is vloeiend: reviewen, bewerken en implementatie zijn geen opeenvolgende fasen waarin je gevangen zit.

Concreet, na enige `/opsx:apply` werk:

- Wil je het plan opnieuw bekijken? Open de artefacten en lees ze, of voer `openspec show <change>` uit in je terminal voor een geconsolideerd overzicht.
- Iets gevonden om te veranderen? Bewerk het artefact (of vraag de AI ernaar), ga dan verder.
- Wil je een gestructureerde controle of de code overeenkomt met het plan? Voer `/opsx:verify` uit (uitgebreide opdracht). Het rapporteert volledigheid, correctheid en samenhang zonder iets te blokkeren. Zie [Werkflows: Verifiëren](workflows.md#verify-check-your-work).

Er is geen 'reviewfase' om naar terug te keren, want reviewen is iets wat je op elk moment kunt doen, ook na implementatie.

## "Ik heb de code handmatig bewerkt. Hoe breng ik die in overeenstemming met OpenSpec?"

Dit gebeurt constant en dat is prima. Je hebt iets aangepast in je editor, en nu zijn de code en de artefacten het oneens. Breng ze weer in sync in de richting die juist is:

- **De code is nu correct, de specificatie is verouderd.** Update de delta-specificatie (en taken, indien relevant) om het gedrag te beschrijven dat je daadwerkelijk hebt uitgerold. De specificatie moet overeenkomen met de werkelijkheid voordat je archiveert, omdat archivering de specificatie samenvoegt met je bron van waarheid.
- **De specificatie is correct, de code is afgedreven.** Blijf bouwen of repareren tot de code overeenkomt met de specificatie.

Een snelle manier om afwijkingen te vinden is `/opsx:verify`: het leest je artefacten en je code en vertelt je waar ze afwijken. Behandel de uitvoer als een takenlijst voor reconciliatie, en archiveer zodra ze overeenkomen.

Het principe: op het moment van archivering worden je specificaties de officiële waarheid. Dus voordat je archiveert, zorg dat de specificaties eerlijk zijn over wat de code doet. Handmatige bewerkingen zijn welkom; laat ze alleen niet stilaan de specificatie uit sync brengen.

## Een voorstel verfijnen waar je niet tevreden over bent

Als een gegenereerd voorstel niet goed zit, heb je drie goede opties:

- **Itereer ter plaatse.** Vertel de AI wat er mis is ("the scope is too broad, drop the admin features") en laat het herzien. Goedkoopst en meestal juist.
- **Verken eerst, en stel daarna opnieuw voor.** Als het probleem is dat het idee zelf onduidelijk is, stap terug naar `/opsx:explore`, denk het na en laat een scherper voorstel daaruit voortkomen. Zie [Eerst Verken](explore.md).
- **Begin opnieuw.** Als de intentie fundamenteel is veranderd, kan een nieuwe wijziging duidelijker zijn dan het oude patchen.

Die laatste optie heeft zijn eigen beslissingsgids, hierna.

## Wanneer updaten vs. een nieuwe wijziging starten

Korte versie: **updaten als het hetzelfde verfijnde werk is; een nieuwe starten als de intentie fundamenteel is veranderd of de scope is geëxplodeerd in ander werk.**

- Zelfde doel, betere aanpak? Updaten.
- Scope verkleinen (de MVP nu uitrollen, meer later)? Updaten, dan archiveren, dan een nieuwe wijziging voor fase twee.
- Het probleem zelf is veranderd ("add dark mode" werd "build a full theming system")? Nieuwe wijziging.

Er is een volledig stroomdiagram en uitgewerkte voorbeelden in [Werkflows: Wanneer Updaten vs. Opnieuw Beginnen](workflows.md#when-to-update-vs-start-fresh) en een diepere behandeling in [OPSX: Wanneer Updaten vs. Opnieuw Beginnen](opsx.md#when-to-update-vs-start-fresh).

## Een opmerking over taken

`tasks.md` is een levende checklist, geen bevroren planning. Tijdens het implementeren kun je taken toevoegen die je ontdekt, verwijdert die zich als onnodig blijken, of herschikken. De AI vinkt items af terwijl het ze voltooit tijdens `/opsx:apply`, en het hervat vanaf de eerste onvinkte taak als je later terugkomt. Bewerken van de lijst tijdens de vlucht is verwacht.

## Vervolgrichtingen

- [Werkflows](workflows.md) - patronen, plus de update-vs-nieuw beslissingsgids
- [Een Wijziging Reviewen](reviewing-changes.md) - de twee-minuten beoordeling op een plan voordat je het bouwt
- [Eerst Verken](explore.md) - de plaats om naar terug te stappen wanneer een idee opnieuw moet worden doordacht
- [Opdrachten](commands.md) - `/opsx:continue`, `/opsx:apply`, en `/opsx:verify` in detail
- [Concepten: Artefacten](concepts.md#artifacts) - waarvoor elk artefact dient