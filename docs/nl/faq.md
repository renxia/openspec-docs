# FAQ

Snelle antwoorden op de vragen die mensen het meest stellen. Als uw vraag echt een "er is iets kapot" vraag is, is [Troubleshooting](troubleshooting.md) de juiste pagina. Als u een term wilt definiëren, zie dan het [Glossary](glossary.md).

## De basisprincipes

### Wat is OpenSpec in één zin?

Een lichtgewichtige laag die u en uw AI-coderingassistent erover eens krijgt wat te bouwen, schriftelijk vastgelegd, voordat er enige code wordt geschreven.

### Waarom zou ik dat willen?

Omdat AI-assistenten zelfverzekerd zijn, zelfs als ze fouten maken. Als de vereisten alleen bestaan in een chatdraad, vult de AI gaten met aannames, en u ontdekt dit pas nadat de code bestaat. OpenSpec brengt het eens worden naar een vroeger stadium, waar fouten goedkoop te herstellen zijn. Zie [Core Concepts at a Glance](overview.md) voor het volledige verhaal.

### Moet ik het voor alles gebruiken?

Nee. Gebruik het waar overeenstemming ertoe doet, wat de meeste niet-triviale taken zijn. Voor een typefout van één teken is de ceremonie waarschijnlijk niet de moeite waard, en dat is prima.

### Kan ik het gebruiken op een grote bestaande codebase, of alleen op nieuwe projecten?

Bestaande codebases zijn het hoofdonderwerp. OpenSpec is gericht op brownfield: u hoeft uw hele applicatie niet vooraf te documenteren. U schrijft specificaties alleen voor wat elke wijziging raakt, en uw specificaties worden in de loop van de tijd gevuld rondom het werk dat u daadwerkelijk uitvoert. Er is een speciale handleiding: [Using OpenSpec in an Existing Project](existing-projects.md).

### Is het gekoppeld aan één AI-tool?

Nee. OpenSpec werkt met 25+ assistenten, waaronder Claude Code, Cursor, Windsurf, GitHub Copilot, Gemini CLI, Codex en meer. De volledige lijst en details per tool staan in [Supported Tools](supported-tools.md).

## Het uitvoeren van commando's

### Waar typ ik `/opsx:propose` in?

In de chat van uw AI-assistent, niet in uw terminal. Dit is het meest voorkomende punt van verwarring, dus het heeft zijn eigen pagina: [How Commands Work](how-commands-work.md). Korte versie: `openspec ...` draait in de terminal, `/opsx:...` draait in de chat.

### Hoe "start ik de interactieve modus"?

Er is geen aparte modus om te starten. U opent uw AI-assistent zoals normaal en typt een slash-commando in zijn chat. Het slash-commando is hoe u OpenSpec "binnengaat". (De enige echt interactieve terminalfunctie is `openspec view`, een dashboard voor het bekijken van specificaties en wijzigingen.) Volledige uitleg in [How Commands Work](how-commands-work.md).

### Ik typte een slash-commando en er gebeurde niets. Waarom?

Meestal heeft u het getypt in de terminal in plaats van in uw AI chat, of de commando's zijn nog niet geïnstalleerd. Voer `openspec update` uit in uw project, start uw assistent opnieuw op, probeer dan `/opsx` in de chat te typen en kijk naar de autocomplete. [Troubleshooting](troubleshooting.md#commands-dont-show-up) bevat de volledige checklist.

### Waarom is de syntax `/opsx:propose` in één tool en `/opsx-propose` in een andere?

Elke AI-tool toont aangepaste commando's op een iets andere manier. De intentie is identiek; alleen de leestekens veranderen. Typ een slash in uw chat en de autocomplete laat u zien welke vorm uw tool verwacht. De tabel per tool staat in [How Commands Work](how-commands-work.md#slash-command-syntax-by-tool).

### Wat is het verschil tussen een skill en een commando?

Beide zijn bestanden die OpenSpec schrijft zodat uw assistent de workflow kan uitvoeren. Skills (`.../skills/openspec-*/SKILL.md`) zijn de nieuwere cross-tool standaard; commando's (`.../commands/opsx-*`) zijn de oudere per tool slash-bestanden. U hoeft er geen keuze uit te maken. U typt gewoon het slash-commando, en OpenSpec installeert degene die uw tool gebruikt.

## De workflow

### Waar moet ik beginnen als ik niet zeker weet wat ik moet bouwen?

Begin met `/opsx:explore`. Het is een denkpartner zonder risico die uw codebase leest, opties schetst en een vage probleemstelling omzet in een concreet plan, allemaal voordat er enige wijziging of code bestaat. Het staat in het standaardprofiel, dus het is altijd beschikbaar. Wanneer het plan duidelijk is, gaat het door naar `/opsx:propose`. Dit is de beste gewoonte die u kunt aanleren, omdat het een enthousiaste AI ervan weerhoudt om met vertrouwen het verkeerde te bouwen. Zie [Explore First](explore.md).

### Wat is de simpelst mogelijke flow?

```text
/opsx:explore (optioneel)   dan   /opsx:propose <wat u wilt>   dan   /opsx:apply   dan   /opsx:archive
```

Explore om het door te denken, propose om het plan op te stellen, apply om het te bouwen, archive om het weg te archiveren. Sla explore over als u precies weet wat u wilt.

### Wat is het verschil tussen `/opsx:propose` en `/opsx:new`?

`/opsx:propose` is het standaard één-stap commando: het creëert de wijziging en stelt alle planningsartefacten tegelijk op. `/opsx:new` maakt deel uit van de uitgebreide set commando's en schetst alleen een lege wijziging, waardoor u de artefacten één voor één moet aanmaken met `/opsx:continue` (of allemaal tegelijk met `/opsx:ff`). Gebruik propose tenzij u stapsgewijze controle wilt. Zie [Commands](commands.md).

### Wat zijn `core` en uitgebreide profielen?

Een profiel bepaalt welke slash-commando's geïnstalleerd worden. **Core** (het standaardprofiel) geeft u `propose`, `explore`, `apply`, `sync`, `archive`. De **uitgebreide** set voegt toe `new`, `continue`, `ff`, `verify`, `bulk-archive` en `onboard` voor fijnere controle. Schakel over met `openspec config profile`, en pas dan toe met `openspec update`.

### Moet ik `/opsx:sync` uitvoeren?

Meestal niet. Sync mergt de delta-specificaties van een wijziging in uw hoofdspecificaties, en `/opsx:archive` zal dit voor u aanbieden. Voer sync handmatig uit alleen als u wilt dat de specificaties worden samengevoegd voordat ze worden gearchiveerd, bijvoorbeeld bij een langlopende wijziging. Zie [Commands](commands.md#opsxsync).

### Hoe bewerk ik een proposal, spec of taak nadat ik ben begonnen?

Bewerken van het bestand is voldoende. Elk artefact is platte Markdown in `openspec/changes/<name>/`, en er is geen vergrendelde fase of speciale bewerkmodus. Wijzig het handmatig, of vraag uw AI om het te herzien ("update het ontwerp om een wachtrij te gebruiken"), en ga door. De AI werkt altijd vanuit de huidige bestandsinhoud. Volledige handleiding: [Editing & Iterating on a Change](editing-changes.md).

### Kan ik teruggaan en het plan wijzigen nadat ik er al een deel van heb geïmplementeerd?

Ja, op elk moment. De workflow is vloeiend, dus beoordelen en bewerken zijn geen fasen waar u van wordt uitgesloten. Bewerk het artefact, en ga verder. Als u een gestructureerde controle wilt dat de code nog steeds overeenkomt met het plan, voer dan `/opsx:verify` uit. Zie [Editing & Iterating on a Change](editing-changes.md#how-do-i-go-back-to-review-after-implementing).

### Ik heb de code handmatig bewerkt. Hoe breng ik dit in overeenstemming met de spec?

Breng ze terug in sync voordat u archiveert, aangezien archiveren uw specificaties tot de waarheid vastlegt. Als de code nu correct is, update dan de delta-spec om deze overeen te laten komen met wat u heeft verzonden; als de spec correct is, blijf dan bouwen totdat de code akkoord gaat. `/opsx:verify` brengt de mismatches naar boven. Zie [Editing & Iterating on a Change](editing-changes.md#i-edited-the-code-by-hand-how-do-i-reconcile-that-with-openspec).

### Wanneer moet ik een bestaande wijziging updaten versus er een nieuwe starten?

Update wanneer het hetzelfde werk is, maar verfijnd. Start nieuw wanneer de intentie fundamenteel is gewijzigd of de scope is geëxplodeerd in ander werk. Er is een beslissingsflowchart en voorbeelden in [Workflows](workflows.md#when-to-update-vs-start-fresh).

### Wat als mijn sessie van context mist, of de vereisten veranderen midden in de implementatie?

Hier verdienen specificaties hun geld. Omdat het plan in bestanden staat (niet alleen in chatgeschiedenis), kunt u uw context wissen, een nieuwe AI-sessie starten en verdergaan met `/opsx:apply`; het leest de artefacten en hervat van de eerste onbeantwoorde taak. Als de vereisten veranderen, bewerk dan de artefacten om ze aan de nieuwe realiteit aan te passen en ga door. Een schone contextvenster te behouden levert ook betere resultaten op; wis het voordat u implementeert.

### Moet ik de `openspec/` map naar git committen?

Ja. Uw specificaties, actieve wijzigingen en archief zijn deel van de geschiedenis van uw project. Commit ze net als elke andere bron. Het archief wordt in het bijzonder een duurzaam verslag waarom uw systeem op de manier werkt die het doet.

## Specs en wijzigingen

### Wat hoort in een spec versus in een ontwerp?

Een spec beschrijft observeerbaar gedrag: wat het systeem doet, zijn inputs, outputs en foutvoorwaarden. Een ontwerp beschrijft hoe u het zult bouwen: de technische aanpak, architectuurbeslissingen, wijzigingen in bestanden. Als de implementatie kan veranderen zonder dat dit extern zichtbare gedragingen beïnvloedt, behoort het tot het ontwerp, niet tot de spec. [Concepts](concepts.md#what-a-spec-is-and-is-not) gaat dieper in op.

### Wat is een delta spec?

Een spec die alleen beschrijft wat verandert, met behulp van `ADDED`, `MODIFIED` en `REMOVED` secties, in plaats van de hele spec opnieuw te stellen. Het is hoe OpenSpec wijzigingen aan bestaande systemen schoon afhandelt. Zie [Concepts](concepts.md#delta-specs).

### Waar komen gearchiveerde wijzigingen terecht?

In `openspec/changes/archive/YYYY-MM-DD-<name>/`, met alle artefacten bewaard. Niets wordt verwijderd; de wijziging verlaat simpelweg uw actieve lijst.

## Configuratie en aanpassing

### Hoe vertel ik de AI over mijn tech stack?

Plaats het in `openspec/config.yaml` onder `context:`. Deze tekst wordt geïnjecteerd in elke planningsaanvraag, zodat de AI altijd uw stack en conventies kent. Zie [Customization](customization.md#project-configuration).

### Kan ik specificaties genereren in een taal anders dan Engels?

Ja. Voeg een taalinstructie toe aan de `context:` van uw config. [Multi-Language](multi-language.md) bevat copy-paste snippets voor verschillende talen.

### Kan ik de workflow zelf wijzigen?

Ja, met aangepaste schema's. Een schema definieert welke artefacten bestaan en hoe ze afhankelijk zijn van elkaar. Fork het standaardschema met `openspec schema fork spec-driven my-workflow`, en bewerk het vervolgens. Zie [Customization](customization.md#custom-schemas).

## Modellen, privacy en upgrades

### Welk AI-model moet ik gebruiken?

OpenSpec werkt het beste met modellen met hoog redeneervermogen. De README beveelt modellen zoals Codex 5.5 en Opus 4.7 aan voor zowel planning als implementatie. Houd ook uw contextvenster schoon: wis het voordat u implementeert voor de beste resultaten.

### Verzamelt OpenSpec gegevens?

Het verzamelt anonieme gebruiksstatistieken: alleen commando-namen en versie. Geen argumenten, paden, inhoud of persoonlijke gegevens, en dit is automatisch uitgeschakeld in CI. Opt out met `export OPENSPEC_TELEMETRY=0` of `export DO_NOT_TRACK=1`.

### Hoe upgrade ik?

Twee stappen. Upgrade het pakket (`npm install -g @fission-ai/openspec@latest`), en voer vervolgens `openspec update` uit binnen elk project om de gegenereerde skills en commando's te vernieuwen.

### Hoe verwijder ik OpenSpec?

Er is geen verwijdercommando, omdat het slechts een globaal pakket plus bestanden in uw project is. Verwijder het pakket (`npm uninstall -g @fission-ai/openspec`), en verwijder optioneel de `openspec/` map en de gegenereerde toolbestanden. Stap voor stap, inclusief wat veilig te bewaren, staat in [Installation: Uninstalling](installation.md#uninstalling).

## Hulp vragen

### Waar stel ik vragen of rapporteer ik bugs?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Vanuit uw terminal:** `openspec feedback "your message"` opent een GitHub issue voor u.

### Deze documentatie is fout of verwarrend. Wat moet ik doen?

Vertel het ons, of corrigeer het. Documentatie PR's zijn welkom en worden gewaardeerd. Open een issue of stuur een pull request.