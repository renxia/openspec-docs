---
layout: home

hero:
  name: "OpenSpec"
  text: "Specificatiegestuurd Ontwikkelen voor AI Assistenten"
  tagline: Een lichtgewicht specificatie voor het bouwen en beheren van AI assistentprojecten.
  actions:
    - theme: brand
      text: Beginnen
      link: ./getting-started
    - theme: alt
      text: Home
      link: /

features:
  - title: Spec-First Workflow
    details: Definieer vereisten voordat u code schrijft.
  - title: AI-Native Design
    details: Gebouwd voor Claude Code, Cursor, Windsurf en meer.
  - title: Multi-Language
    details: Documentatie beschikbaar in meerdere talen.
---

# OpenSpec Documentatie

Welkom. Dit is de thuispagina van alles over OpenSpec.

OpenSpec helpt u en uw AI coderingassistent **akkoord te gaan over wat er gebouwd moet worden voordat er enige code is geschreven.** U beschrijft de wijziging, de AI stelt een korte specificatie en een taaklijst op, jullie kijken beiden naar hetzelfde plan, en dan gebeurt het werk. Geen meer ontdekken halverwege dat de AI iets verkeerd heeft gebouwd.

Als u niets anders leest, lees dan deze twee pagina's:

1. [Getting Started](getting-started.md): installeer, initialiseer en stuur uw eerste wijziging.
2. [How Commands Work](how-commands-work.md): waar u daadwerkelijk `/opsx:propose` typt (hint: in uw AI chat, niet in de terminal). Dit is een valkuil voor bijna iedereen.

Die tweede pagina is belangrijker dan het lijkt. OpenSpec heeft twee helften: een command-line tool die u in uw terminal uitvoert, en slash commands die u aan uw AI assistent geeft. Weten welke wat is, bespaart u de meest voorkomende verwarring.

> **De beste gewoonte om eerst op te bouwen: als u niet zeker weet wat u moet bouwen, begin dan met `/opsx:explore`.** Het is een denkpartner zonder risico die uw code leest, opties afweegt en een vage gedachte omzet in een concreet plan voordat er enig artefact of code bestaat. De gids [Explore First](explore.md) onderbouwt dit.

## Kies uw pad

**Ik ben compleet nieuw.** Begin met [Getting Started](getting-started.md), en blader daarna door de [Core Concepts at a Glance](overview.md). Als iets mysterieus aanvoelt, zijn de [FAQ](faq.md) en [Glossary](glossary.md) in de buurt.

**Ik heb een probleem, maar geen plan.** Dit is het veelvoorkomende geval, en het heeft een specifieke oplossing: [Explore First](explore.md). Gebruik `/opsx:explore` om er met de AI over na te denken voordat u zich ergens aan bindt.

**Ik heb een grote bestaande codebase.** U documenteert niet alles. [Using OpenSpec in an Existing Project](existing-projects.md) toont hoe u kunt beginnen met echte, brownfield code zonder het oceaan op te koken.

**Ik wil gewoon dat het werkt.** [Install](installation.md), voer `openspec init` uit, en lees dan [How Commands Work](how-commands-work.md) zodat uw eerste slash command op de juiste plek terechtkomt.

**Ik leer door voorbeelden.** De pagina [Examples & Recipes](examples.md) leidt u door echte wijzigingen van begin tot eind: een kleine functie, een bugfix, een refactor, een exploratie.

**Ik kom uit het oude workflow.** De [Migration Guide](migration-guide.md) legt uit wat er is veranderd en waarom, en belooft dat uw bestaande werk veilig is.

**Ik wil het aanpassen aan het proces van mijn team.** [Customization](customization.md) behandelt projectconfiguratie, aangepaste schemas en gedeelde context.

**Iets is kapot.** [Troubleshooting](troubleshooting.md) verzamelt de fouten die mensen daadwerkelijk tegenkomen, inclusief oplossingen.

## De hele kaart

### Begin hier

| Doc | Wat het u geeft |
|-----|-------------------|
| [Getting Started](getting-started.md) | Installeer, initialiseer en voer uw eerste wijziging van begin tot eind uit |
| [Explore First](explore.md) | Gebruik `/opsx:explore` om een idee te overwegen voordat u zich committeert |
| [How Commands Work](how-commands-work.md) | Waar slash commands worden uitgevoerd, wat "interactive mode" betekent, terminal versus chat |
| [Core Concepts at a Glance](overview.md) | Het gehele mentale model op één pagina: specificaties, wijzigingen, deltas, archief |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix en hoe u kunt verifiëren dat het werkte |

### Gebruik dagelijks

| Doc | Wat het u geeft |
|-----|-------------------|
| [Workflows](workflows.md) | Veelvoorkomende patronen en wanneer u naar elke command moet grijpen |
| [Examples & Recipes](examples.md) | Volledige doortochten van echte wijzigingen, kopieerbaar |
| [Using OpenSpec in an Existing Project](existing-projects.md) | Het adopteren van OpenSpec op een grote brownfield codebase |
| [Editing & Iterating on a Change](editing-changes.md) | Artefacten bijwerken, teruggaan, handmatige wijzigingen reconciliëren |
| [Commands](commands.md) | Referentie voor elke `/opsx:*` slash command |
| [CLI](cli.md) | Referentie voor elke `openspec` terminal command |

### Begrijp het diepgaand

| Doc | Wat het u geeft |
|-----|-------------------|
| [Concepts](concepts.md) | De uitgebreide uitleg van specificaties, wijzigingen, artefacten, schemas en archief |
| [OPSX Workflow](opsx.md) | Waarom de workflow vloeiend is in plaats van fasegebonden, plus een architectuur deep dive |
| [Glossary](glossary.md) | Elke term gedefinieerd op één plek |

### Maak het van u

| Doc | Wat het u geeft |
|-----|-------------------|
| [Customization](customization.md) | Projectconfiguratie, aangepaste schemas en gedeelde context |
| [Multi-Language](multi-language.md) | Artefacten genereren in talen anders dan Engels |
| [Supported Tools](supported-tools.md) | De 25+ AI tools waarmee OpenSpec integreert, en waar de bestanden terechtkomen |

### Als u hulp nodig heeft

| Doc | Wat het u geeft |
|-----|-------------------|
| [FAQ](faq.md) | Snelle antwoorden op de vragen die mensen het meest stellen |
| [Troubleshooting](troubleshooting.md) | Concrete oplossingen voor concrete fouten |
| [Migration Guide](migration-guide.md) | Overstappen van de legacy workflow naar OPSX |

### Coördineren over repos (beta)

| Doc | Wat het u geeft |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | Plan in zijn eigen repo wanneer uw werk meerdere repos of teams omvat |
| [Agent Contract](agent-contract.md) | De machineleesbare CLI oppervlakken die agents aansturen |

## De dertig seconden versie

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in uw AI chat)  /opsx:explore           ← optioneel, maar een geweldige gewoonte
4. Propose        (in uw AI chat)  /opsx:propose add-dark-mode
5. Build          (in uw AI chat)  /opsx:apply
6. Archive        (in uw AI chat)  /opsx:archive
```

Stappen 1 en 2 gebeuren in uw terminal. De rest gebeurt in de chat van uw AI assistent. Dat onderscheid is het enige wat de moeite waard is om te onthouden, en [How Commands Work](how-commands-work.md) legt precies uit waarom. Stap 3 is optioneel, maar beginnen met `/opsx:explore` als u twijfelt is de gewoonte die het meest de moeite waard is om aan te nemen.

## Waar else hulp krijgen

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) voor vragen, ideeën en hulp.
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) voor bugs en feature requests.
- **`openspec feedback "uw bericht"`** stuurt feedback rechtstreeks van uw terminal (het opent een GitHub issue).

Vond u iets in deze documentatie dat fout, verouderd of verwarrend is? Dat is een bug. Open een issue of een PR. Documentatieverbeteringen zijn een van de meest waardevolle bijdragen die u kunt leveren.