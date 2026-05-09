---
layout: home

hero:
  name: "OpenSpec"
  text: "Specificatie-gestuurde ontwikkeling voor AI-assistenten"
  tagline: Een lichtgewicht specificatie voor het bouwen en beheren van AI-assistentprojecten.
  actions:
    - theme: brand
      text: Aan de slag
      link: ./getting-started
    - theme: alt
      text: Home
      link: /

features:
  - title: Spec-First Workflow
    details: Definieer vereisten voordat je code schrijft.
  - title: AI-Native Ontwerp
    details: Gebouwd voor Claude Code, Cursor, Windsurf en meer.
  - title: Meertalig
    details: Documentatie beschikbaar in meerdere talen.
---


Onze filosofie:

```text
→ vloeiend niet star
→ iteratief niet waterval
→ eenvoudig niet complex
→ gebouwd voor brownfield niet alleen greenfield
→ schaalbaar van persoonlijke projecten tot ondernemingen
```

> [!TIP]
> **Nieuwe workflow nu beschikbaar!** We hebben OpenSpec herbouwd met een nieuwe artefact-geleide workflow.
>
> Voer `/opsx:propose "jouw idee"` uit om te beginnen. → [Meer informatie hier](opsx.md)

<p align="center">
  Volg <a href="https://x.com/0xTab">@0xTab op X</a> voor updates · Doe mee met de <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord</a> voor hulp en vragen.
</p>

## Zie het in actie

```text
Jij: /opsx:propose donkere-modus-toevoegen
AI:  Aangemaakt openspec/changes/donkere-modus-toevoegen/
     ✓ proposal.md — waarom we dit doen, wat er verandert
     ✓ specs/       — vereisten en scenario's
     ✓ design.md    — technische aanpak
     ✓ tasks.md     — implementatielijst
     Klaar voor implementatie!

Jij: /opsx:apply
AI:  Taken implementeren...
     ✓ 1.1 Thema-contextprovider toevoegen
     ✓ 1.2 Toggle-component aanmaken
     ✓ 2.1 CSS-variabelen toevoegen
     ✓ 2.2 localStorage aansluiten
     Alle taken voltooid!

Jij: /opsx:archive
AI:  Gearchiveerd naar openspec/changes/archive/2025-01-23-donkere-modus-toevoegen/
     Specificaties bijgewerkt. Klaar voor de volgende functie.
```

<details>
<summary><strong>OpenSpec Dashboard</strong></summary>
</details>

## Snelstart

**Vereist Node.js 20.19.0 of hoger.**

Installeer OpenSpec globaal:

```bash
npm install -g @fission-ai/openspec@latest
```

Ga vervolgens naar je projectmap en initialiseer:

```bash
cd je-project
openspec init
```

Vertel nu je AI: `/opsx:propose <wat-je-wilt-bouwen>`

Als je de uitgebreide workflow wilt (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), selecteer deze met `openspec config profile` en pas toe met `openspec update`.

> [!NOTE]
> Niet zeker of jouw tool wordt ondersteund? [Bekijk de volledige lijst](supported-tools.md) – we ondersteunen 25+ tools en het aantal groeit.
>
> Werkt ook met pnpm, yarn, bun en nix. [Bekijk installatie-opties](installation.md).

## Documentatie

→ **[Aan de slag](getting-started.md)**: eerste stappen<br>
→ **[Workflows](workflows.md)**: combinaties en patronen<br>
→ **[Commando's](commands.md)**: slash-commando's & vaardigheden<br>
→ **[CLI](cli.md)**: terminalreferentie<br>
→ **[Ondersteunde tools](supported-tools.md)**: toolintegraties & installatiepaden<br>
→ **[Concepten](concepts.md)**: hoe alles samenwerkt<br>
→ **[Meertalig](multi-language.md)**: meertalige ondersteuning<br>
→ **[Aanpassing](customization.md)**: maak het van jou


## Waarom OpenSpec?

AI-codingassistenten zijn krachtig maar onvoorspelbaar wanneer vereisten alleen in chatgeschiedenis bestaan. OpenSpec voegt een lichtgewicht specificatielaag toe zodat je het eens wordt over wat er gebouwd moet worden voordat er code wordt geschreven.

- **Eens worden voordat je bouwt** — mens en AI stemmen af op specificaties voordat er code wordt geschreven
- **Georganiseerd blijven** — elke wijziging krijgt zijn eigen map met voorstel, specificaties, ontwerp en taken
- **Vloeiend werken** — werk elk artefact op elk moment bij, geen starre fasepoorten
- **Je tools gebruiken** — werkt met 20+ AI-assistenten via slash-commando's

### Hoe we ons vergelijken

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Grondig maar zwaar. Starre fasepoorten, veel Markdown, Python-opstelling. OpenSpec is lichter en laat je vrij itereren.

**vs. [Kiro](https://kiro.dev)** (AWS) — Krachtig maar je zit vast aan hun IDE en beperkt tot Claude-modellen. OpenSpec werkt met de tools die je al gebruikt.

**vs. niets** — AI-coding zonder specificaties betekent vage prompts en onvoorspelbare resultaten. OpenSpec brengt voorspelbaarheid zonder de ceremonie.

## OpenSpec bijwerken

**Het pakket upgraden**

```bash
npm install -g @fission-ai/openspec@latest
```

**Agentinstructies vernieuwen**

Voer dit uit in elk project om AI-begeleiding opnieuw te genereren en ervoor te zorgen dat de nieuwste slash-commando's actief zijn:

```bash
openspec update
```

## Gebruiksnotities

**Modelselectie**: OpenSpec werkt het beste met modellen met hoge redeneercapaciteit. We raden Opus 4.5 en GPT 5.2 aan voor zowel planning als implementatie.

**Contexthygiëne**: OpenSpec heeft baat bij een schone contextvenster. Wis je context voordat je begint met implementeren en onderhoud goede contexthygiëne gedurende je sessie.

## Bijdragen

**Kleine fixes** — Bugfixes, typocorrecties en kleine verbeteringen kunnen direct als PR's worden ingediend.

**Grotere wijzigingen** — Voor nieuwe functies, significante refactoring of architectonische wijzigingen, dien eerst een OpenSpec-wijzigingsvoorstel in zodat we de intentie en doelen kunnen afstemmen voordat de implementatie begint.

Bij het schrijven van voorstellen, houd de OpenSpec-filosofie in gedachten: we dienen een breed scala aan gebruikers met verschillende codingagents, modellen en use cases. Wijzigingen moeten voor iedereen goed werken.

**AI-gegenereerde code is welkom** — zolang het getest en geverifieerd is. PR's met AI-gegenereerde code moeten de gebruikte codingagent en het model vermelden (bijv. "Gegenereerd met Claude Code met claude-opus-4-5-20251101").

### Ontwikkeling

- Installeer afhankelijkheden: `pnpm install`
- Bouwen: `pnpm run build`
- Testen: `pnpm test`
- Ontwikkel CLI lokaal: `pnpm run dev` of `pnpm run dev:cli`
- Conventionele commits (eenregelig): `type(scope): onderwerp`

## Overig

<details>
<summary><strong>Telemetrie</strong></summary>

OpenSpec verzamelt anonieme gebruiksstatistieken.

We verzamelen alleen commandonamen en versie om gebruikspatronen te begrijpen. Geen argumenten, paden, inhoud of persoonlijk identificeerbare informatie. Automatisch uitgeschakeld in CI.

**Uitschakelen:** `export OPENSPEC_TELEMETRY=0` of `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>Onderhouders & Adviseurs</strong></summary>

Zie [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) voor de lijst van kernonderhouders en adviseurs die het project helpen begeleiden.

</details>



## Licentie

MIT