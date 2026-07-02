# Hoe Commando's Werken

**Het ene dat je moet weten: OpenSpec heeft twee soorten commando's, en ze draaien op twee verschillende plaatsen.**

- `openspec ...` commando's draaien in je **terminal**. (Voorbeeld: `openspec init`.)
- `/opsx:...` commando's draaien in de **chat van je AI-assistent**. (Voorbeeld: `/opsx:propose`.)

Als je ooit `/opsx:propose` in je terminal typt en er niets gebeurt, dan is dit het antwoord. Je praat met de verkeerde helft van OpenSpec. Slash commando's zijn geen terminalcommando's. Ze zijn instructies die je geeft aan je AI-coderingassistent, in hetzelfde chatvenster waar je normaal gespreek zou "voeg een login formulier toe".

Dit ene onderscheid is het meest voorkomende struikelblok voor nieuwe gebruikers, dus laten we dit kristalhelder maken.

## De twee helften

OpenSpec is één project dat twee hoeden draagt.

**De CLI (terminalhelft).** Een programma genaamd `openspec` dat je installeert en uitvoert vanuit je shell. Het zet je project op, lijstt en valideert wijzigingen, toont een dashboard en archiveert afgerond werk. Je typt deze in iTerm, de VS Code terminal, PowerShell, overal waar je `git` of `npm` zou draaien.

```bash
openspec init        # stel OpenSpec op in dit project
openspec list        # zie actieve wijzigingen
openspec view        # open het interactieve dashboard
```

**De slash commando's (chathelft).** Korte commando's zoals `/opsx:propose` en `/opsx:apply` die je typt in je AI-assistent. Deze vertellen de AI om het OpenSpec workflow te volgen: een voorstel opstellen, specificaties schrijven, bouwen vanuit de taaklijst, archiveren wanneer klaar. Je typt deze in Claude Code, Cursor, Windsurf, Copilot of welke assistent dan ook je gebruikt.

```text
/opsx:propose add-dark-mode    (getypt in je AI chat)
/opsx:apply                    (getypt in je AI chat)
/opsx:archive                  (getypt in je AI chat)
```

Hier is het mentale model in één plaatje:

```text
        JOU TERMINAL                         DE CHAT VAN JE AI-ASSISTENT
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   installeert    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   commando's    │  /opsx:archive                │
   └──────────────────────┘    & skills   └──────────────────────────────┘
        draai openspec hier                       draai /opsx:* hier
```

Merk de pijl op. Het uitvoeren van `openspec init` in je terminal is wat de slash commando's *installeert* in je AI-tool. De terminalhelft zet de chathelft op. Daarna gebeurt het dagelijkse werk grotendeels in de chat.

## "Hoe begin ik de interactieve modus?"

**Er is geen aparte interactieve modus om te starten.** Deze vraag komt vaak voor, dus hij verdient een duidelijke antwoord.

Je gaat niet in een speciale OpenSpec-modus. Je opent gewoon je AI-coderingassistent zoals je dat altijd doet en typt een slash commando in de chat. Het slash commando *is* hoe je "OpenSpec ingaat". Je assistent herkent het, laadt de bijbehorende OpenSpec skill en begint met het volgen van het workflow.

Dus de echte instructies zijn:

1. Open je AI-coderingassistent (Claude Code, Cursor, Windsurf, enz.) in je project.
2. Typ `/opsx:propose` in de chat ervan, op dezelfde plek als je elke andere aanvraagteintypt.
3. Kijk naar de autocomplete: als OpenSpec is geïnstalleerd, zie je `/opsx:propose`, `/opsx:apply` en vrienden verschijnen terwijl je de slash typt.

Dat is het. Geen modus om in te schakelen, geen daemon om op te starten, geen apart venster.

Eén ding dat daadwerkelijk interactief is, leeft in de terminal: `openspec view`. Het opent een dashboard voor het bekijken van je specificaties en wijzigingen. Maar dit is een weergave, niet het middel waarmee je proposeert en bouwt. Het bouwen gebeurt via slash commando's in de chat.

## Waarom deze splitsing bestaat

Het is de moeite waard om te begrijpen, want het verklaart waarom OpenSpec met 25+ verschillende AI-tools werkt.

De CLI is de **motor**. Hij kent de regels: hoe een wijzigingsmap eruitziet, welke artefacten afhankelijk zijn van welke, hoe je een delta spec in je waarheidbron merget. Het is overal hetzelfde.

De slash commando's zijn het **stuurwiel**, en elke AI-tool heeft een iets ander stuurwiel. Claude Code noemt ze commando's. Cursor en Windsurf hebben hun eigen formaten. Sommige tools noemen ze skills. Wanneer je `openspec init` uitvoert, genereert OpenSpec het juiste soort bestand voor elke tool die je hebt geselecteerd, zodat dezelfde `/opsx:propose`-intentie werkt, ongeacht welke assistent je verkiest.

De kracht van dit ontwerp: je leert de workflow één keer en draagt deze over naar verschillende tools. Het nadeel: de exacte syntax van een commando kan licht verschillen tussen tools, wat het volgende gedeelte betreft.

## Syntax van de slash commando's per tool

De intentie is overal identiek. De interpunctie verschilt. Gebruik het formaat dat overeenkomt met je assistent.

| Tool | Hoe je het typt |
|------|-----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | skill-stijl, bijv. `/skill:openspec-propose` |
| Trae | skill-stijl, bijv. `/openspec-propose` |

De meeste tools gebruiken of het colon formaat (`/opsx:propose`) of het dash formaat (`/opsx-propose`). Een paar tools tonen OpenSpec als genaamde skills in plaats van slash commando's; voor die roep je de skill op met naam. De volledige lijst per tool, inclusief precies welke bestanden waar worden geschreven, staat in [Supported Tools](supported-tools.md).

Als je twijfelt, typ dan een slash in je AI chat en kijk naar de autocomplete. Je tool zal je het verwachte formaat laten zien.

## Hoe de commando's er zijn gekomen: skills en commands

Wanneer je `openspec init` (of `openspec update`) uitvoert, schrijft OpenSpec kleine bestanden in je project zodat je AI-tool de workflow kan vinden. Afhankelijk van je tool en instellingen zijn dit **skills**, **commands** of beide.

- **Skills** leven op plekken zoals `.claude/skills/openspec-*/SKILL.md`. Ze zijn de opkomende cross-tool standaard: een map met instructies die je assistent automatisch detecteert.
- **Commands** leven op plekken zoals `.claude/commands/opsx/<id>.md`. Dit zijn de oudere per-tool slash commando's bestanden.

Je hoeft niet te weten welke je tool gebruikt. Je typt gewoon het slash commando en het werkt. Maar weten dat deze bestanden bestaan helpt als er iets misgaat: als je commando's verdwijnen, betekent dit meestal dat deze bestanden ontbreken of verouderd zijn, en `openspec update` genereert ze opnieuw.

Zie [Supported Tools](supported-tools.md) voor de exacte paden per tool, en [Migration Guide](migration-guide.md) voor hoe skills het oudere commando-alleen benadering hebben vervangen.

## Bevestigen dat het is geïnstalleerd

Snelle controles, snelst eerst:

1. **Typ een slash in je AI chat.** Begin met typen `/opsx` en kijk naar de autocomplete suggesties. Als ze verschijnen, ben je klaar.
2. **Zoek naar de bestanden.** Voor Claude Code controleer je of `.claude/skills/` `openspec-*` mappen bevat. Andere tools gebruiken hun eigen mappen ([Supported Tools](supported-tools.md) vermeldt deze).
3. **Voer de setup opnieuw uit.** Voer vanuit de root van je project `openspec update` uit. Dit genereert de skill- en commando'bestanden voor alle tools die je hebt geconfigureerd.
4. **Start je assistent opnieuw op.** Veel tools scannen naar skills en commando's bij het opstarten, dus een nieuw venster kan de ontbrekende stap zijn.

## Welke commando's heb ik inmiddels?

Standaard installeert OpenSpec de **core** set van slash commando's:

- `/opsx:explore`: denk door een idee met de AI voordat je een wijziging vastlegt (een geweldige eerste stap als je onzeker bent)
- `/opsx:propose`: creëer een wijziging en stel alle planningsartefacten in één keer op
- `/opsx:apply`: bouw de wijziging door het afwerken van de taaklijst
- `/opsx:sync`: merge de spec-updates van een wijziging naar je hoofdspecs (meestal automatisch)
- `/opsx:archive`: voltooi een wijziging en archiveer deze

Een goed standaardritme: `explore` wanneer je uitvindt wat je moet doen, dan `propose`, `apply`, `archive`. De [Explore First](explore.md) gids legt uit waarom die openingsstap loont.

Er is ook een **uitgebreide** set voor mensen die fijnere controle willen (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Je schakelt deze in met `openspec config profile` en past deze toe met `openspec update`.

Nieuw in dit alles? `/opsx:onboard` (in de uitgebreide set) begeleidt je door een volledige wijziging op je eigen codebase, waarbij elke stap wordt verteld. Het is de vriendelijkste mogelijke introductie.

Voor wat elk commando doet in detail, zie [Commands](commands.md). Voor wanneer je welke moet gebruiken, zie [Workflows](workflows.md).

## Een schone eerste draai

Om het samen te vatten, hier is de volledige sequentie met elke stap gelabeld door waar deze plaatsvindt.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (installeert slash commando's in je AI tool)

AI CHAT      /opsx:explore
              (optioneel: denk eerst het idee door met de AI)

AI CHAT      /opsx:propose add-dark-mode
              (AI stelt voorstel, specificaties, ontwerp en taken op)

AI CHAT      /opsx:apply
              (AI bouwt het, vinkt taken af)

AI CHAT      /opsx:archive
              (wijziging wordt gemerged in je specs en gearchiveerd)
```

Twee terminalstappen om op te zetten. Daarna leef je in de chat. Dat is het ritme.

## Gerelateerd

- [Getting Started](getting-started.md): de volledige walkthrough van de eerste wijziging
- [Commands](commands.md): elk slash commando in detail
- [CLI](cli.md): elk terminalcommando in detail
- [Supported Tools](supported-tools.md): syntax en bestandslocaties per tool
- [FAQ](faq.md): meer snelle antwoorden
- [Troubleshooting](troubleshooting.md): oplossingen wanneer commando's niet verschijnen