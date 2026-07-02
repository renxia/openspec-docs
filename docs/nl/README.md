# OpenSpec Documentatie

Welkom. Dit is de thuisbasis voor alles wat met OpenSpec te maken heeft.

OpenSpec helpt jou en je AI-coderingassistent om **akkoord te gaan over wat er gebouwd moet worden voordat er enige code wordt geschreven.** Jij beschrijft de wijziging, de AI stelt een korte specificatie en een takenlijst op, jullie bekijken beide hetzelfde plan, en daarna vindt het werk plaats. Geen meer verrassingen halverwege dat de AI iets anders heeft gebouwd.

Als je niets anders leest, lees dan deze twee pagina's:

1. [Getting Started](getting-started.md): installeer, initialiseer en lever je eerste wijziging aan.
2. [How Commands Work](how-commands-work.md): waar je daadwerkelijk `/opsx:propose` typt (hint: in je AI-chat, niet in de terminal). Dit is een valkuil voor bijna iedereen.

Dat tweede punt is belangrijker dan het lijkt. OpenSpec heeft twee delen: een command-line tool die je in je terminal uitvoert, en slash commands die je aan je AI-assistent geeft. Weten welke wat zijn, bespaart de meest voorkomende bron van verwarring.

> **De beste gewoonte om eerst te ontwikkelen: als je niet zeker weet wat je moet bouwen, begin dan met `/opsx:explore`.** Het is een denkpartner zonder druk die je code leest, opties afweegt en een vage gedachte omzet in een concreet plan voordat er enig artefact of code bestaat. De [Explore First](explore.md) gids maakt dit duidelijk.

## Kies jouw pad

**Ik ben compleet nieuw.** Begin met [Getting Started](getting-started.md), bekijk daarna snel de [Core Concepts at a Glance](overview.md). Als iets mysterieus aanvoelt, zijn de [FAQ](faq.md) en [Glossary](glossary.md) dichtbij.

**Ik heb een probleem maar geen plan.** Dit is het gangbare geval, en er is een toegewijd antwoord voor: [Explore First](explore.md). Gebruik `/opsx:explore` om dit met de AI door te denken voordat je iets vastlegt.

**Ik heb een grote bestaande codebase.** Je hoeft het allemaal niet te documenteren. [Using OpenSpec in an Existing Project](existing-projects.md) toont hoe je kunt beginnen met echte, bestaande code zonder alles te moeten overzien.

**Ik wil gewoon dat het werkt.** [Install](installation.md), voer `openspec init` uit en lees vervolgens [How Commands Work](how-commands-work.md) zodat jouw eerste slash command op de juiste plek terechtkomt.

**Ik leer door voorbeelden.** De pagina [Examples & Recipes](examples.md) leidt je door echte wijzigingen van begin tot eind: een kleine functie, een bugfix, een refactor, een exploratie.

**Ik kom uit het oude workflow.** De [Migration Guide](migration-guide.md) legt uit wat er is veranderd en waarom, en garandeert dat je bestaand werk veilig is.

**Ik wil het aanpassen aan mijn teamproces.** [Customization](customization.md) behandelt projectconfiguratie, aangepaste schema's en gedeelde context.

**Iets is kapot.** [Troubleshooting](troubleshooting.md) verzamelt de fouten die mensen daadwerkelijk tegenkomen, inclusief oplossingen.

## De volledige kaart

### Begin hier

| Doc | Wat het je geeft |
|-----|-------------------|
| [Getting Started](getting-started.md) | Installeer, initialiseer en voer je eerste wijziging van begin tot eind uit |
| [Explore First](explore.md) | Gebruik `/opsx:explore` om een idee door te denken voordat je iets vastlegt |
| [How Commands Work](how-commands-work.md) | Waar slash commands draaien, wat "interactive mode" betekent, terminal versus chat |
| [Core Concepts at a Glance](overview.md) | Het volledige mentale model op één pagina: specs, wijzigingen, deltas, archief |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix en hoe je kunt verifiëren dat het werkt |

### Gebruik het dagelijks

| Doc | Wat het je geeft |
|-----|-------------------|
| [Workflows](workflows.md) | Gangbare patronen en wanneer je welke command moet gebruiken |
| [Examples & Recipes](examples.md) | Volledige doorloopgangen van echte wijzigingen, kopieerbaar |
| [Using OpenSpec in an Existing Project](existing-projects.md) | Het adopteren van OpenSpec op een grote bestaande codebase |
| [Editing & Iterating on a Change](editing-changes.md) | Artefacten updaten, teruggaan, handmatige wijzigingen reconciliëren |
| [Commands](commands.md) | Referentie voor elke `/opsx:*` slash command |
| [CLI](cli.md) | Referentie voor elke `openspec` terminal command |

### Begrijp het diepgaand

| Doc | Wat het je geeft |
|-----|-------------------|
| [Concepts](concepts.md) | De uitgebreide uitleg van specs, wijzigingen, artefacten, schema's en archief |
| [OPSX Workflow](opsx.md) | Waarom de workflow vloeiend is in plaats van fase-gebonden, plus een architectuur diepduik |
| [Glossary](glossary.md) | Elke term gedefinieerd op één plek |

### Maak het van jou

| Doc | Wat het je geeft |
|-----|-------------------|
| [Customization](customization.md) | Projectconfiguratie, aangepaste schema's en gedeelde context |
| [Multi-Language](multi-language.md) | Artefacten genereren in talen behalve Engels |
| [Supported Tools](supported-tools.md) | De 25+ AI tools waarmee OpenSpec integreert, en waar de bestanden terechtkomen |

### Als je hulp nodig hebt

| Doc | Wat het je geeft |
|-----|-------------------|
| [FAQ](faq.md) | Snelle antwoorden op de meest gestelde vragen |
| [Troubleshooting](troubleshooting.md) | Concrete oplossingen voor concrete fouten |
| [Migration Guide](migration-guide.md) | Van het legacy workflow naar OPSX bewegen |

### Coördineren over repos (beta)

| Doc | Wat het je geeft |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | Plannen in zijn eigen repo wanneer je werk meerdere repos of teams omspant |
| [Agent Contract](agent-contract.md) | De machineleesbare CLI die agents aansturen |

## De dertigsecondenversie

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in je AI-chat)  /opsx:explore           ← optioneel, maar een geweldige gewoonte
4. Propose        (in je AI-chat)  /opsx:propose add-dark-mode
5. Build          (in je AI-chat)  /opsx:apply
6. Archive        (in je AI-chat)  /opsx:archive
```

Stap 1 en 2 gebeuren in je terminal. De rest gebeurt in de chat van je AI-assistent. Dat onderscheid is het ene ding dat het waard is om te onthouden, en [How Commands Work](how-commands-work.md) legt precies uit waarom. Stap 3 is optioneel, maar beginnen met `/opsx:explore` als je twijfelt is de gewoonte die het meest waard is om aan te nemen.

## Waar kun je nog meer hulp vinden

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) voor vragen, ideeën en hulp.
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) voor bugs en feature requests.
- **`openspec feedback "your message"`** stuurt feedback rechtstreeks van je terminal (het opent een GitHub issue).

Heb je iets in deze documentatie gevonden dat fout is, verouderd of verwarrend? Dat is een bug. Open een issue of een PR. Documentatieverbeteringen zijn een van de meest waardevolle bijdragen die je kunt leveren.