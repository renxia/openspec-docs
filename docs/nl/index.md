---
layout: home

hero:
  name: "OpenSpec"
  text: "Specificatiegedreven ontwikkeling voor AI-assistenten"
  tagline: Een lichtgewicht specificatie voor het bouwen en beheren van AI-assistentenprojecten.
  actions:
    - theme: brand
      text: Aan de slag
      link: ./getting-started
    - theme: alt
      text: Start
      link: /

features:
  - title: Specificatie-eerst werkwijze
    details: Definieer vereisten voordat je code schrijft.
  - title: AI-native ontwerp
    details: Ontwikkeld voor Claude Code, Cursor, Windsurf en meer.
  - title: Meertalig
    details: Documentatie beschikbaar in verschillende talen.
---

# OpenSpec-documentatie

Welkom. Dit is de centrale plek voor alles wat met OpenSpec te maken heeft.

OpenSpec helpt jou en je AI-coderingassistent **overeenstemming te bereiken over wat er gebouwd moet worden voordat er überhaupt code wordt geschreven.** Je beschrijft de wijziging, de AI stelt een korte specificatie en een takenlijst op, jullie kijken samen naar hetzelfde plan en daarna gaat het werk van start. Geen verrassingen meer halverwege dat de AI het verkeerde ding heeft gebouwd.

Als je niets anders leest, lees dan deze twee pagina's:

1. [Aan de slag](getting-started.md): installeer, initialiseer en lever je eerste wijziging.
2. [Hoe opdrachten werken](how-commands-work.md): waar je daadwerkelijk `/opsx:propose` intypt (tip: in je AI-chat, niet in de terminal). Dit zorgt bij bijna iedereen een keer voor verwarring.

Die tweede pagina is belangrijker dan het lijkt. OpenSpec bestaat uit twee onderdelen: een opdrachtregelgereedschap dat je in je terminal uitvoert, en slashopdrachten die je aan je AI-assistent geeft. Weten wat het verschil is, bespaart je de meest voorkomende verwarring.

> **De beste gewoonte om eerst te ontwikkelen: als je niet zeker weet wat je moet bouwen, begin dan met `/opsx:explore`.** Het is een risicoloze denkpartner die je code leest, opties afweegt en een vaag idee aanscherpt tot een concreet plan voordat er enig artefact of code bestaat. De [Eerst verkennen](explore.md)-gids legt uit waarom dit werkt.

## Kies je pad

**Ik ben helemaal nieuw.** Begin met [Aan de slag](getting-started.md), blader daarna door [Kernconcepten in een oogopslag](overview.md). Wanneer iets onduidelijk is, vind je het [FAQ](faq.md) en [Woordenlijst](glossary.md) vlakbij.

**Ik heb een probleem maar geen plan.** Dit is de meest voorkomende situatie, en er is een specifiek antwoord voor: [Eerst verkennen](explore.md). Gebruik `/opsx:explore` om het met de AI te doordenken voordat je je op iets vastlegt.

**Ik heb een grote bestaande codebase.** Je hoeft niet de hele codebase te documenteren. [OpenSpec gebruiken in een bestaand project](existing-projects.md) toont hoe je begint met echte, brownfield-code zonder de zee te koken.

**Ik wil het gewoon laten werken.** [Installeer](installation.md), voer `openspec init` uit, en lees daarna [Hoe opdrachten werken](how-commands-work.md) zodat je eerste slashopdracht op de juiste plek landt.

**Ik leer aan de hand van voorbeelden.** De pagina [Voorbeelden & Recepten](examples.md) behandelt echte wijzigingen van begin tot eind: een kleine functie, een bugfix, een refactor, een verkenning.

**De AI heeft zojuist een plan opgesteld — wat nu?** Lees het. [Een wijziging beoordelen](reviewing-changes.md) laat de twee-minutencontrole zien die een verkeerde bocht opvangt terwijl dit nog weinig moeite kost, en [Goede specificaties schrijven](writing-specs.md) behandelt waar een plan dat het waard is om goed te keuren, uit bestaat.

**Ik werk in een team.** [OpenSpec in een team](team-workflow.md) laat zien hoe een wijziging wordt toegewezen aan een branch en een pull request, en hoe teamleden een plan beoordelen voordat er code wordt geschreven.

**Ik kom uit de oude werkwijze.** De [Migratiegids](migration-guide.md) legt uit wat er is veranderd en waarom, en belooft dat je bestaande werk veilig is.

**Ik wil het aanpassen aan het werkproces van mijn team.** [Aanpassing](customization.md) behandelt projectconfiguratie, aangepaste schema's en gedeelde context.

**Er gaat iets mis.** [Problemen oplossen](troubleshooting.md) verzamelt de fouten die mensen daadwerkelijk tegenkomen, met oplossingen.

## De volledige overzichtskaart

### Begin hier

| Document | Wat geeft het je? |
|-----|-------------------|
| [Aan de slag](getting-started.md) | Installeer, initialiseer en voer je eerste wijziging volledig uit |
| [Eerst verkennen](explore.md) | Gebruik `/opsx:explore` om een idee te doordenken voordat je je erop vastlegt |
| [Hoe opdrachten werken](how-commands-work.md) | Waar slashopdrachten worden uitgevoerd, wat "interactieve modus" betekent, terminal versus chat |
| [Kernconcepten in een oogopslag](overview.md) | Het volledige mentale model op één pagina: specificaties, wijzigingen, delta's, archief |
| [Installatie](installation.md) | npm, pnpm, yarn, bun, Nix en hoe je controleert of het werkt |

### Dagelijks gebruik

| Document | Wat geeft het je? |
|-----|-------------------|
| [Werkwijzen](workflows.md) | Veelvoorkomende patronen en wanneer je welke opdracht gebruikt |
| [Voorbeelden & Recepten](examples.md) | Volledige uitleg van echte wijzigingen, klaar om te kopiëren en plakken |
| [Goede specificaties schrijven](writing-specs.md) | Hoe een sterke vereiste en scenario eruitzien, en hoe je een wijziging de juiste omvang geeft |
| [Een wijziging beoordelen](reviewing-changes.md) | De twee-minutencontrole van een opgesteld plan voordat er code wordt geschreven |
| [OpenSpec in een team](team-workflow.md) | Hoe wijzigingen passen bij branches, pull requests en beoordeling |
| [OpenSpec gebruiken in een bestaand project](existing-projects.md) | OpenSpec adopteren op een grote, bestaande codebase |
| [Een wijziging bewerken en herhalen](editing-changes.md) | Artefacten bijwerken, teruggaan, handmatige bewerkingen verenigen |
| [Opdrachten](commands.md) | Naslagwerk voor elke `/opsx:*`-slashopdracht |
| [CLI](cli.md) | Naslagwerk voor elke `openspec`-terminalopdracht |

### Diepgaand begrijpen

| Document | Wat geeft het je? |
|-----|-------------------|
| [Concepten](concepts.md) | De lange uitleg van specificaties, wijzigingen, artefacten, schema's en archief |
| [OPSX-werkwijze](opsx.md) | Waarom de werkwijze flexibel is in plaats van gefaseerd, plus een diepgaande architectuuranalyse |
| [Woordenlijst](glossary.md) | Elke term op één plek gedefinieerd |

### Maak het je eigen

| Document | Wat geeft het je? |
|-----|-------------------|
| [Aanpassing](customization.md) | Projectconfiguratie, aangepaste schema's, gedeelde context |
| [Meertalig](multi-language.md) | Genereer artefacten in andere talen dan Engels |
| [Ondersteunde gereedschappen](supported-tools.md) | De 25+ AI-gereedschappen waarmee OpenSpec integreert, en waar bestanden terechtkomen |

### Wanneer je hulp nodig hebt

| Document | Wat geeft het je? |
|-----|-------------------|
| [Veelgestelde vragen](faq.md) | Snelle antwoorden op de meest gestelde vragen |
| [Problemen oplossen](troubleshooting.md) | Concrete oplossingen voor concrete fouten |
| [Migratiegids](migration-guide.md) | Overstappen van de verouderde werkwijze naar OPSX |

### Coördineren over repositories heen (bèta)

| Document | Wat geeft het je? |
|-----|-------------------|
| [Stores: Gebruikershandleiding](stores-beta/user-guide.md) | Maak een plan in een eigen repository als je werk over repositories of teams heen gaat |
| [Agentcontract](agent-contract.md) | De machine-leesbare CLI-oppervlakken die agents aansturen |

## De dertig seconden versie

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in your AI chat)  /opsx:explore           ← optional, but a great habit
4. Propose        (in your AI chat)  /opsx:propose add-dark-mode
5. Build          (in your AI chat)  /opsx:apply
6. Archive        (in your AI chat)  /opsx:archive
```

Stappen 1 en 2 gebeuren in je terminal. De rest gebeurt in de chat van je AI-assistent. Die splitsing is het enige waard om te onthouden, en [Hoe opdrachten werken](how-commands-work.md) legt precies uit waarom. Stap 3 is optioneel, maar beginnen met `/opsx:explore` als je niet zeker weet, is de gewoonte die het meest waard is om te ontwikkelen.

## Waar je nog meer hulp kunt krijgen

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) voor vragen, ideeën en hulp.
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) voor bugs en functieverzoeken.
- **`openspec feedback "je bericht"`** verzendt feedback direct vanuit je terminal (het opent een GitHub-issue).

Heb je iets in deze documentatie gevonden dat fout is, verouderd of verwarrend? Dat is een bug. Open een issue of een PR. Verbeteringen aan de documentatie behoren tot de meest waardevolle bijdragen die je kunt doen.