# Glossarium

Elke OpenSpec-term op één plek, gedefinieerd in duidelijke taal. Blader er een keer door en de rest van de documentatie leest sneller.

Termen zijn gegroepeerd op onderwerp, en vervolgens alfabetisch geordend binnen elke groep.

## De Kernbegrippen

**Spec.** Een document dat beschrijft hoe een deel van uw systeem functioneert. Specs staan in `openspec/specs/`, zijn georganiseerd op domein en bestaan uit vereisten en scenario's. De spec is het overeengekomen antwoord op "wat doet deze software?". Zie [Concepts](concepts.md#specs).

**Source of truth.** Het volledige `openspec/specs/`-bestand. Het bevat het huidige, overeengekomen gedrag van uw systeem. Wijzigingen stellen suggesties voor edits; archivering past ze toe.

**Change.** Eén werkseenheid, verpakt als een map onder `openspec/changes/<name>/`. Een change bevat alles over dat werk: het voorstel, het ontwerp, de taken en de spec-edits die het introduceert. Eén change, één functie of fix.

**Artifact.** Een document binnen een change. De standaard artifacts zijn het voorstel, de delta specs, het ontwerp en de taken. Ze worden in afhankelijkheidsvolgorde gemaakt en voeden elkaar.

**Delta spec.** Een spec binnen een change die alleen beschrijft wat verandert, door gebruik te maken van de secties `ADDED`, `MODIFIED` en `REMOVED`, in plaats van de volledige spec opnieuw te stellen. Dit maakt het mogelijk voor OpenSpec om bestaande systemen schoon te bewerken. Zie [Concepts](concepts.md#delta-specs).

**Domain.** Een logische groepering voor specs, zoals `auth/`, `payments/` of `ui/`. U kiest domeinen die overeenkomen met hoe u over uw systeem denkt.

## Binnen een Spec

**Requirement.** Een enkel gedrag dat het systeem moet hebben, meestal geschreven met een RFC 2119-trefwoord: "Het systeem SHALL sessies na 30 minuten verlopen." Vereisten stellen het *wat* vast, niet het *hoe*.

**Scenario.** Een concreet, testbaar voorbeeld van een vereiste in actie, typisch in de Given/When/Then-vorm. Scenario's maken een vereiste verifieerbaar: u zou hieruit een geautomatiseerde test kunnen schrijven.

**RFC 2119 keywords.** De woorden MUST, SHALL, SHOULD en MAY, die een gestandaardiseerde betekenis dragen over hoe strikt een vereiste is. MUST en SHALL zijn absoluut. SHOULD wordt aanbevolen met ruimte voor uitzonderingen. MAY is optioneel. De naam komt van het internetstandaarddocument dat ze definieerde.

## De Artifacts

**Proposal (`proposal.md`).** Het *waarom* en *wat* van een change: de intentie, het bereik en de hoog-niveau benadering. Het eerste artifact dat u creëert.

**Design (`design.md`).** Het *hoe*: technische aanpak, architectuurbeslissingen en de bestanden die u verwacht aan te raken. Optioneel voor simpele changes.

**Tasks (`tasks.md`).** De implementatiechecklist, met selectievakjes. De AI doorloopt deze tijdens `/opsx:apply` en vink items af terwijl het gaat.

## De Levenscyclus

**Archive.** Het voltooien van een change. De delta specs worden samengevoegd met de hoofdspecs, en de change-map wordt naar `openspec/changes/archive/YYYY-MM-DD-<name>/` verplaatst. Na archivering beschrijven uw specs de nieuwe realiteit. Zie [Concepts](concepts.md#archive).

**Sync.** Het samenvoegen van een changes delta specs met de hoofdspecs *zonder* de change te archiveren. Meestal automatisch (archivering biedt aan om dit te doen), maar beschikbaar als `/opsx:sync` voor langlopende changes. Zie [Commands](commands.md#opsxsync).

## Workflow en Commando's

**OPSX.** De huidige standaard OpenSpec-workflow, gebouwd rond vloeiende acties in plaats van rigide fasen. Haar slash commands beginnen allemaal met `/opsx:`. Zie [OPSX Workflow](opsx.md).

**Slash command.** Een commando dat u typt in de chat van uw AI-assistent, zoals `/opsx:propose`. Slash commands sturen de workflow aan. Ze zijn geen terminalcommando's. Zie [How Commands Work](how-commands-work.md).

**Explore (`/opsx:explore`).** Het denkpartner commando. Het leest uw codebase, vergelijkt opties en maakt een vage gedachte om tot een concreet plan, zonder artifacts te creëren of code te schrijven. Het aanbevolen startpunt wanneer u een probleem heeft maar nog geen plan. Zie [Explore First](explore.md).

**CLI.** Het `openspec`-programma dat u uitvoert in uw terminal. Het richt projecten op, lijst en valideert changes, opent het dashboard en archiveert. De terminalkant van OpenSpec. Zie [CLI](cli.md).

**Skill.** Een map met instructies (`.../skills/openspec-*/SKILL.md`) die uw AI-assistent automatisch detecteert en volgt. Skills zijn de opkomende cross-tool standaard voor het leveren van de OpenSpec workflow aan uw assistent.

**Command file.** Een per-tool slash command bestand (`.../commands/opsx-*`). Het oudere leveringsmechanisme, nog steeds ondersteund naast skills. U raakt deze zelden direct aan.

**Profile.** De verzameling slash commands geïnstalleerd in uw project. **Core** (de standaard) zijn `propose`, `explore`, `apply`, `sync` en `archive`. De **expanded** set voegt toe `new`, `continue`, `ff`, `verify`, `bulk-archive` en `onboard`. Wijzig dit met `openspec config profile`.

**Delivery.** Of OpenSpec skills, command bestanden of beide voor uw tools installeert. Geconfigureerd globaal en toegepast met `openspec update`.

## Aanpassing

**Schema.** De definitie van welke artifacts een workflow heeft en hoe ze afhankelijk zijn van elkaar. De ingebouwde standaard is `spec-driven` (proposal → specs → design → tasks). U kunt deze forkken of uw eigen schrijven. Zie [Customization](customization.md#custom-schemas).

**Template.** Een Markdown bestand binnen een schema dat bepaalt wat de AI genereert voor een gegeven artifact. Het bewerken van een template verandert de output van de AI onmiddellijk, zonder opnieuw opbouw te hoeven doen.

**Project config (`openspec/config.yaml`).** Projectspecifieke instellingen: het standaard schema, de `context:` die in elke planningaanvraagte wordt ingevoegd, en per-artifact `rules:`. De eenvoudigste manier om OpenSpec kennis te laten maken met uw stack en conventies. Zie [Customization](customization.md#project-configuration).

**Context injection.** Het plaatsen van de projectachtergrond in het `context:` veld van `config.yaml` zodat deze automatisch wordt toegevoegd aan elk artifact dat de AI genereert. Dit is betrouwbaarder dan hopen dat de AI een apart bestand leest.

**Dependency graph.** De gerichte grafiek gevormd door artifact `requires:` relaties. Het is een DAG (directed acyclic graph: pijlen wijzen alleen vooruit, nooit in een lus), en OpenSpec gebruikt deze om te weten wat u nu kunt creëren.

**Enablers, not gates.** Het principe dat artifact-afhankelijkheden laten zien wat er *mogelijk* wordt volgende, niet wat *vereist* is volgende. U kunt elk artifact op elk moment opnieuw bekijken en bewerken. Zie [Core Concepts at a Glance](overview.md#enablers-not-gates).

## Coördinatie over Repositories (bèta)

Deze termen gelden alleen als uw planning meer dan één repo omspant. Ze zijn in bèta. De meeste gebruikers kunnen ze negeren. Zie de [Stores User Guide](stores-beta/user-guide.md).

**Store.** Een zelfstandige repo waarvan de hele taak het plannen is. Het heeft dezelfde `openspec/`-vorm die u al kent (specs en changes) plus een klein identiteitsbestand. U registreert deze één keer op uw machine, naar naam, en dan kan elk OpenSpec commando er vanaf elke plek in werken.

**Reference.** Een verklaring, in het `openspec/config.yaml` van een code repo, van een store waarop die repo zich beroept. References zijn read-only: de repo behoudt zijn eigen root, en `openspec instructions` krijgt een index van de specs van de referentieerde store, elk met het exacte commando om deze op te halen.

**Working context.** Wat `openspec context` verzamelt voor de huidige repo: de OpenSpec root ervan plus elke store die het refereert, elk met hoe deze moet worden opgehaald. Het antwoord op "waar werk ik mee?".

**Workset.** Een persoonlijke, lokaal op de machine gehouden verzameling mappen die u samen opent (een store naast de code repos waarop u werkt). Specifiek gemaakt met `openspec workset create`; niets over die lokale paden wordt in het gedeelde planningrepo gecommit.

## Zie ook

- [Core Concepts at a Glance](overview.md): de vijf ideeën, op één pagina
- [Concepts](concepts.md): de uitgebreide uitleg
- [How Commands Work](how-commands-work.md): slash commands versus de CLI