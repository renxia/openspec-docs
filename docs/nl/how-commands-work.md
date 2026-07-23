# Hoe commando's werken

**Het enige dat u moet weten: OpenSpec heeft twee soorten commando's, en deze worden op twee verschillende plaatsen uitgevoerd.**

- `openspec ...`-commando's worden uitgevoerd in uw **terminal**. (Voorbeeld: `openspec init`.)
- `/opsx:...`-commando's worden uitgevoerd in de **chat van uw AI-assistent**. (Voorbeeld: `/opsx:propose`.)

Als u ooit `/opsx:propose` in uw terminal typt en er gebeurt niets, dan is deze pagina de reden. U praat met de verkeerde helft van OpenSpec. Slash-commando's zijn geen terminalcommando's. Het zijn instructies die u aan uw AI-codeerassistent geeft, in dezelfde chatbox waar u normaal gesproken "voeg een login-formulier toe" zou typen.

Die ene onderscheid is de meest voorkomende struikelblok voor nieuwe gebruikers, dus laten we het helder maken.

## De twee helften

OpenSpec is één project dat twee petjes draagt.

**De CLI (terminalhelft).** Een programma genaamd `openspec` dat u installeert en uitvoert vanuit uw shell. Het stelt uw project in, geeft wijzigingen weer en valideert deze, toont een dashboard en archiveert voltooide werkzaamheden. U typt deze in iTerm, de VS Code-terminal, PowerShell, overal waar u `git` of `npm` zou uitvoeren.

```bash
openspec init        # stel OpenSpec in voor dit project
openspec list        # bekijk actieve wijzigingen
openspec view        # open het interactieve dashboard
```

**De slash-commando's (chathelft).** Korte commando's zoals `/opsx:propose` en `/opsx:apply` die u in uw AI-assistent typt. Deze vertellen de AI om de OpenSpec-workflow te volgen: een voorstel opstellen, specificaties schrijven, bouwen vanuit de takenlijst, archiveren wanneer klaar. U typt deze in Claude Code, Cursor, Windsurf, Copilot, of welke assistent u ook gebruikt.

```text
/opsx:propose add-dark-mode    (getypt in uw AI-chat)
/opsx:apply                    (getypt in uw AI-chat)
/opsx:archive                  (getypt in uw AI-chat)
```

Hier is het mentale model in één plaatje:

```text
        UW TERMINAL                         DE CHAT VAN UW AI-ASSISTENT
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   installeert │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   commando's  │  /opsx:archive                │
   └──────────────────────┘    & skills   └──────────────────────────────┘
        voer openspec hier uit                   voer /opsx:* hier uit
```

Merk de pijl op. Het uitvoeren van `openspec init` in uw terminal is wat de slash-commando's in uw AI-tool *installeert*. De terminalhelft stelt de chathelft in. Daarna gebeurt het dagelijks besturen meestal in de chat.

## "Hoe start ik de interactieve modus?"

**Er is geen aparte interactieve modus om te starten.** Deze vraag komt vaak voor, dus het verdient een duidelijk antwoord.

U hoeft geen speciale OpenSpec-modus te openen. U opent gewoon uw AI-codeerassistent zoals u dat altijd doet, en typt een slash-commando in de chat. Het slash-commando *is* hoe u OpenSpec "opent". Uw assistent herkent het, laadt de bijbehorende OpenSpec-skill en begint de workflow te volgen.

Dus de werkelijke instructies zijn:

1. Open uw AI-codeerassistent (Claude Code, Cursor, Windsurf, enzovoort) in uw project.
2. Typ `/opsx:propose` in de chat, dezelfde plaats waar u andere verzoeken typt.
3. Kijk naar de automatische aanvulling: als OpenSpec is geïnstalleerd, zult u `/opsx:propose`, `/opsx:apply` en andere zien verschijnen terwijl u de slash typt.

Dat is het. Geen modus om te wisselen, geen daemon om te starten, geen apart venster.

Eén ding dat *echt* interactief is, bevindt zich in de terminal: `openspec view`. Het opent een dashboard om door uw specificaties en wijzigingen te bladeren. Maar dat is een viewer, niet hetgene waarmee u voorstellen doet en bouwt. Het bouwen gebeurt via slash-commando's in de chat.

## Waarom deze splitsing bestaat

Het is de moeite waard om te begrijpen, omdat het uitlegt waarom OpenSpec met meer dan 25 verschillende AI-tools werkt.

De CLI is de **motor**. Het kent de regels: hoe een wijzigingsmap eruit ziet, welke artefacten van welke afhankelijk zijn, hoe een deltaspecificatie samen te voegen met uw bron van waarheid. Het is overal hetzelfde.

De slash-commando's zijn het **stuurwiel**, en elke AI-tool heeft een iets andere. Claude Code noemt ze commando's. Cursor en Windsurf hebben hun eigen formaten. Sommige tools noemen ze skills. Wanneer u `openspec init` uitvoert, genereert OpenSpec het juiste type bestand voor elke tool die u heeft geselecteerd, zodat dezelfde `/opsx:propose`-intentie werkt, ongeacht welke assistent u prefereert.

De kracht van dit ontwerp: u leert de workflow één keer en kunt hem over tools heen meenemen. De afweging: de exacte syntaxis van een commando kan enigszins verschillen tussen tools, wat het volgende onderdeel is.

## Slash-commandosyntaxis per tool

De intentie is overal identiek. De interpunctie verschilt. Gebruik de vorm die overeenkomt met uw assistent.

| Tool | Hoe u het typt |
|------|-----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | skill-stijl, bijv. `/openspec-propose` |
| Codex | skill-stijl via `.codex/skills/openspec-*` |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | skill-stijl, bijv. `/skill:openspec-propose` |
| Trae | `/opsx-propose`, `/opsx-apply` |

De meeste tools gebruiken ofwel de dubbelepuntvorm (`/opsx:propose`) of de streepjesvorm (`/opsx-propose`). Enkele tools presenteren OpenSpec als benoemde skills in plaats van slash-commando's; voor die roept u de skill op naam op. De volledige per-tool-lijst, inclusief precies welke bestanden waar worden weggeschreven, staat in [Supported Tools](supported-tools.md).

Bij twijfel, typ een slash in uw AI-chat en kijk naar de automatische aanvulling. Uw tool zal u de vorm tonen die het verwacht.

## Hoe de commando's daar kwamen: skills en commando's

Wanneer u `openspec init` (of `openspec update`) uitvoert, schrijft OpenSpec kleine bestanden in uw project zodat uw AI-tool de workflow kan vinden. Afhankelijk van uw tool en instellingen zijn dit **skills**, **commands**, of beide.

- **Skills** bevinden zich op plaatsen zoals `.claude/skills/openspec-*/SKILL.md`. Zij zijn de opkomende cross-toolstandaard: een map met instructies die uw assistent automatisch detecteert.
- **Commands** bevinden zich op plaatsen zoals `.claude/commands/opsx/<id>.md`. Het zijn de oudere per-tool slash-commandobestanden. Codex krijgt geen gegenereerde commandobestanden; gebruik `.codex/skills/openspec-*`.

U hoeft u geen zorgen te maken welke uw tool gebruikt. U typt gewoon het slash-commando en het werkt. Maar weten dat deze bestanden bestaan helpt wanneer er iets misgaat: als uw commando's verdwijnen, betekent dit meestal dat deze bestanden ontbreken of verouderd zijn, en `openspec update` regenereert ze.

Zie [Supported Tools](supported-tools.md) voor de exacte paden per tool, en [Migration Guide](migration-guide.md) voor hoe skills de oudere command-only aanpak hebben vervangen.

## Bevestigen dat het is geïnstalleerd

Snelle controles, snelste eerst:

1. **Typ een slash in uw AI-chat.** Begin met het typen van `/opsx` en kijk naar suggesties voor automatische aanvulling. Als ze verschijnen, bent u klaar.
2. **Zoek naar de bestanden.** Voor Claude Code, controleer of `.claude/skills/` `openspec-*` mappen bevat. Andere tools gebruiken hun eigen mappen ([Supported Tools](supported-tools.md) geeft ze weer).
3. **Voer de installatie opnieuw uit.** Vanuit de hoofdmap van uw project, voer `openspec update` uit. Dit regenereert de skill- en commandobestanden voor de tools die u heeft geconfigureerd.
4. **Herstart uw assistent.** Veel tools scannen bij het opstarten naar skills en commando's, dus een nieuw venster kan de ontbrekende stap zijn.

## Welke commando's heb ik eigenlijk?

Standaard installeert OpenSpec de **kern**set van slash-commando's:

- `/opsx:explore`: denk met de AI na over een idee voordat u zich vastlegt op een wijziging (geweldige eerste stap als u het niet zeker weet)
- `/opsx:propose`: maak een wijziging en stel al zijn planningartefacten in één stap op
- `/opsx:apply`: bouw de wijziging door zijn takenlijst af te werken
- `/opsx:sync`: voeg de specificatie-updates van een wijziging samen met uw hoofdspecificaties (meestal automatisch)
- `/opsx:archive`: voltooi een wijziging en archiveer deze

Een goed standaardritme: `explore` wanneer u uitzoekt wat u moet doen, daarna `propose`, `apply`, `archive`. De [Explore First](explore.md)-gids legt uit waarom die openingsstap zichzelf uitbetaalt.

Er is ook een **uitgebreide** set voor mensen die meer controle willen (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). U schakelt deze in met `openspec config profile`, en past deze vervolgens toe met `openspec update`.

Nieuw in dit alles? `/opsx:onboard` (in de uitgebreide set) leidt u door een volledige wijziging op uw eigen codebase, waarbij elke stap wordt uitgelegd. Het is de vriendelijkst mogelijke introductie.

Voor wat elk commando in detail doet, zie [Commands](commands.md). Voor wanneer u welk commando moet gebruiken, zie [Workflows](workflows.md).

## Een schone eerste uitvoer

Alles samengevat, hier is de hele reeks met elke stap gelabeld waar deze plaatsvindt.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (installeert slash-commando's in uw AI-tool)

AI CHAT      /opsx:explore
              (optioneel: denk eerst met de AI na over het idee)

AI CHAT      /opsx:propose add-dark-mode
              (AI stelt voorstel, specificaties, ontwerp en taken op)

AI CHAT      /opsx:apply
              (AI bouwt het, taken worden afgevinkt)

AI CHAT      /opsx:archive
              (wijziging wordt samengevoegd met uw specificaties en gearchiveerd)
```

Twee terminalstappen om in te stellen. Daarna leeft u in de chat. Dat is het ritme.

## Gerelateerd

- [Getting Started](getting-started.md): de volledige eerste-wijziging-walkthrough
- [Commands](commands.md): elk slash-commando in detail
- [CLI](cli.md): elk terminalcommando in detail
- [Supported Tools](supported-tools.md): syntaxis en bestandslocaties per tool
- [FAQ](faq.md): meer snelle antwoorden
- [Troubleshooting](troubleshooting.md): oplossingen wanneer commando's niet verschijnen