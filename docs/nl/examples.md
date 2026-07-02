# Voorbeelden & Recepten

Echte wijzigingen, van begin tot eind. Elk recept toont de commando's die je zou typen en wat je terug zou zien, zodat je jouw situatie kunt matchen met een patroon en het kunt kopiëren. Deze gebruiken de standaard **core** commando's (`propose`, `explore`, `apply`, `sync`, `archive`); waar de uitgebreide set nuttig is, wordt dit vermeld.

Een herinnering voordat je begint: slash commands zoals `/opsx:propose` gaan in het **AI-assistent chat**, en `openspec` commando's gaan in je **terminal**. Als dit nieuw is, lees dan eerst [Hoe Commando's Werken](how-commands-work.md). In de transcripten hieronder zijn `You:` en `AI:` het chatgedeelte, en regels die beginnen met `$` zijn de terminal.

> **Weet je nog niet zeker wat je aan het werk bent?** De meeste van deze recepten zijn scherper als je begint met `/opsx:explore` om het eerst goed door te denken. [Recept 3](#recipe-3-exploring-before-you-commit) toont dit in actie, en de gids [Explore First](explore.md) geeft het volledige argument.

## Recept 1: Een kleine functie, de snelle route

**Wanneer te gebruiken:** je weet wat je wilt, en het is een afgebakende taak. Dit is het meest voorkomende recept.

Het geheel bestaat uit drie commando's. Propose, bouwen, archiveren.

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

Lees nu het plan. Open de propostie en de delta specificatie. Dit is het moment waarop OpenSpec voor gemaakt is: een foutieve aanname opvangen terwijl deze nog maar één paragraaf is, niet 400 regels code. Bewerk elk artefact direct als iets niet klopt, en ga dan verder.

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Add logout button to header
     ✓ 1.2 Clear session on click
     ✓ 1.3 Add confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  Archiving add-logout-button...
     ✓ Merged specs into openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2026-06-22-add-logout-button/
     Done. Ready for the next change.
```

Dat is het. Het logout-gedrag maakt nu deel uit van je specificaties, en de wijziging wordt gearchiveerd met zijn volledige context.

## Recept 2: Een bugfix

**Wanneer te gebruiken:** iets is kapot en je wilt de fix vastleggen als een bewuste wijziging in het gedrag, niet als een mysterieuze commit.

Bugfixes werken precies zoals functies. Het verschil zit in hoe je de propostie formuleert: beschrijf het *correcte* gedrag, niet alleen "fix de bug".

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

Omdat de fix als een `MODIFIED` vereiste wordt vastgelegd met een nieuw scenario, ziet de volgende persoon (of de volgende AI-sessie) niet alleen dat je het hebt gefixt, maar wat "correct" betekent. Dan `/opsx:apply` en `/opsx:archive` zoals gewoonlijk.

Tip: voor een fix is een goed scenario de regressietest in proza. "GEGEVEN een uitgelogde gebruiker, WANNEER deze geldige gegevens invoert, DAN komt hij op het dashboard terecht en wordt hij niet opnieuw doorgestuurd." Schrijf dat, en de implementatie heeft een duidelijk doelwit.

## Recept 3: Verkennen voordat je committet

**Wanneer te gebruiken:** je hebt een probleem maar nog geen plan. Je weet niet zeker wat je moet bouwen, of welke aanpakking juist is.

Begin met `/opsx:explore`. Het is een denkpartner zonder structuur en zonder dat er artefacten worden gecreëerd. Het leest je codebase en helpt je beslissen.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Page loads feel slow but I don't know where the time goes.

AI:  Let me look... I found three likely culprits:
     1. Large unoptimized images on the product list
     2. Synchronous data fetching that blocks render
     3. Re-renders triggered by context changes
     Which should we tackle first?

You: The data fetching one.

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation.
```

Verkenning verheldert je denken *voordat* je een wijziging daaraan besteedt. Wanneer de inzichten kristalliseren, proposeer dan, en de AI draagt de context door.

## Recept 4: Twee wijzigingen tegelijk beheren

**Wanneer te gebruiken:** je bent halverwege een functie en een dringende fix springt de wachtrij voor.

Wijzigingen zijn onafhankelijke mappen, dus parallel werk veroorzaakt geen conflicten. Start eerst de fix, lever deze aan, en keer dan terug naar de functie precies waar je gebleven was.

```text
You: I'm partway through add-dark-mode, but I need to fix a login bug now.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Ready for implementation.

You: /opsx:apply

AI:  Implemented the fix. All tasks complete.

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect.

You: Back to dark mode.

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode. Picking up at task 2.3: Update Header...
```

Het benoemen van de wijziging in `/opsx:apply add-dark-mode` is hoe je de AI naar een specifieke wijziging stuurt wanneer er meer dan één actief is. Omdat taken voltooiing bijhouden in `tasks.md`, weet de AI precies waar je geholpen was.

Wanneer meerdere wijzigingen tegelijk worden afgerond, bundelt het uitgebreide `/opsx:bulk-archive` ze en lost specificatieconflicten op door te controleren wat er daadwerkelijk is geïmplementeerd. Zie [Workflows](workflows.md#parallel-changes).

## Recept 5: Een refactoring zonder gedragsverandering

**Wanneer te gebruiken:** je structureert code, en het extern zichtbare gedrag moet identiek blijven.

Dit is de interessante casus, want een pure refactor heeft *niets toe te voegen aan je specificaties*. Het gedragscontract verandert niet; alleen de implementatie doet dat. De taak ligt dus in het ontwerp en de taken, en de specdelta is leeg of afwezig.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

Wanneer je een wijziging archiveert die de specificaties niet raakt, kun je het terminal commando aanwijzen om de spec-stap over te slaan:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

Deze vlag is handig voor tooling, CI en docs-only wijzigingen. Het principe: specificaties beschrijven gedrag, dus als het gedrag niet veranderde, hoeven de specificaties dat ook niet te doen. Zie [Concepts](concepts.md#what-a-spec-is-and-is-not).

## Recept 6: Stapsgewijze controle (uitgebreide commando's)

**Wanneer te gebruiken:** een complexe of risicovolle wijziging waarbij je elke artefact wilt beoordelen voordat je verdergaat.

De core `/opsx:propose` draft alles in één keer. Als je liever stap voor stap doorloopt, schakel dan de uitgebreide commando's in:

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

Nu kun je incrementeel scaffolden en bouwen:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

Beoordeel elk artefact zodra het verschijnt, bewerk vrijelijk, en ga verder wanneer je tevreden bent. Als je wilt dat de rest in één keer wordt gedraft, dan `/opsx:ff` fast-forwards door de resterende planningsartefacten. Voordat je archiveert, controleert `/opsx:verify` of de implementatie daadwerkelijk overeenkomt met de specificaties. Zie [Workflows](workflows.md#opsxff-vs-opsxcontinue).

## Recept 7: Het hele proces in de praktijk leren

**Wanneer te gebruiken:** je hebt OpenSpec geïnstalleerd en wilt het workflow *voelen* op je eigen code, niet op een speelvoorbeeld.

Schakel de uitgebreide commando's in (zie Recept 6), dan:

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` vindt een echt (klein) verbeterpunt, creëert een wijziging daarvoor, implementeert deze en archiveert deze, waarbij elk stap wordt verteld. Het duurt 15 tot 30 minuten en laat je met een echte wijziging achter die je kunt behouden of weggooien. Het is de zachtste manier om te leren. Zie [Commands](commands.md#opsxonboard).

## Je werk controleren vanuit de terminal

Op elk moment kun je, vanaf je terminal, de staat van zaken inspecteren:

```bash
$ openspec list                      # active changes
$ openspec show add-dark-mode        # one change in detail
$ openspec validate add-dark-mode    # check structure
$ openspec view                      # interactive dashboard
```

Dit zijn lees- en inspectietools. Het voorstellen en bouwen gebeuren nog steeds via slash commands in het chatgedeelte. Volledige details staan in de [CLI reference](cli.md).

## Waar kun je nu heen gaan

- [Explore First](explore.md): de aanbevolen manier om te beginnen als je onzeker bent
- [Workflows](workflows.md): de patronen hierboven, met beslissingsrichtlijnen over wanneer elk te gebruiken
- [Commands](commands.md): elk slash commando in detail
- [Getting Started](getting-started.md): de canonieke eerste wijziging walkthrough
- [Concepts](concepts.md): waarom de stukken op hun plaats passen