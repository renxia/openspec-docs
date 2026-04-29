---
layout: home

hero:
  name: "OpenSpec"
  text: "Specificatiegestuurde Ontwikkeling voor AI-Assistenten"
  tagline: Een lichtgewicht specificatie voor het bouwen en beheren van AI-assistentprojecten.
  actions:
    - theme: brand
      text: Aan de slag
      link: ./getting-started
    - theme: alt
      text: Home
      link: /

features:
  - title: Specificatie-Eerst Werkwijze
    details: Definieer vereisten voordat je code schrijft.
  - title: AI-Natief Ontwerp
    details: Gebouwd voor Claude Code, Cursor, Windsurf en meer.
  - title: Meertalig
    details: Documentatie beschikbaar in meerdere talen.
---


<details>
<summary><strong>Het meest geliefde specificatieframework.</strong></summary>

[![Stars](https://img.shields.io/github/stars/Fission-AI/OpenSpec?style=flat-square&label=Stars)](https://github.com/Fission-AI/OpenSpec/stargazers)
[![Downloads](https://img.shields.io/npm/dm/@fission-ai/openspec?style=flat-square&label=Downloads/mo)](https://www.npmjs.com/package/@fission-ai/openspec)
[![Contributors](https://img.shields.io/github/contributors/Fission-AI/OpenSpec?style=flat-square&label=Contributors)](https://github.com/Fission-AI/OpenSpec/graphs/contributors)

</details>
<p></p>
Onze filosofie:

```text
→ vloeiend, niet rigide
→ iteratief, nieterval
→ eenvoudig, niet complex
→ gebouwd voor bestaande projecten, niet alleen voor nieuwe
→ schaalbaar van persoonlijke projecten tot ondernemingen
```

> [!TIP]
> **Nieuwe werkwijze nu beschikbaar!** We hebben OpenSpec herbouwd met een nieuw artefactgestuurd werkwijze.
>
> Voer `/opsx:propose "jouw idee"` uit om te beginnen. → [Leer hier meer](opsx.md)

<p align="center">
  Volg <a href="https://x.com/0xTab">@0xTab op X</a> voor updates · Doe mee met de <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord</a> voor hulp en vragen.
</p>

<!-- TODO: Voeg GIF-demo toe van /opsx:propose → /opsx:archive werkwijze -->

## Zie het in actie

```text
Jij: /opsx:propose voeg-donkere-modus-toe
AI:  Aangemaakt openspec/changes/voeg-donkere-modus-toe/
     ✓ proposal.md — waarom we dit doen, wat er verandert
     ✓ specs/       — vereisten en scenario's
     ✓ design.md    — technische aanpak
     ✓ tasks.md     — implementatiechecklijst
     Klaar voor implementatie!

Jij: /opsx:apply
AI:  Taken implementeren...
     ✓ 1.1 Thema-contextprovider toevoegen
     ✓ 1.2 Schakelcomponent aanmaken
     ✓ 2.1 CSS-variabelen toevoegen
     ✓ 2.2 Koppelen aan localStorage
     Alle taken voltooid!

Jij: /opsx:archive
AI:  Gearchiveerd naar openspec/changes/archive/2025-01-23-voeg-donkere-modus-toe/
     Specificaties bijgewerkt. Klaar voor de volgende functie.
```

<details>
<summary><strong>OpenSpec Dashboard</strong></summary>

</details>

## Snelle Start

**Vereist Node.js 20.19.0 of hoger.**

Installeer OpenSpec wereldwijd:

```bash
npm install -g @fission-ai/openspec@latest
```

Navigeer vervolgens naar je projectmap en initialiseer:

```bash
cd jouw-project
openspec init
```

Vertel nu je AI: `/opsx:propose <wat-je-wilt-bouwen>`

Als je de uitgebreide werkwijze wilt (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), selecteer deze dan met `openspec config profile` en pas toe met `openspec update`.

> [!NOTE]
> Weet je niet zeker of je tool wordt ondersteund? [Bekijk de volledige lijst](supported-tools.md) – we ondersteunen 25+ tools en dit aantal groeit.
>
> Werkt ook met pnpm, yarn, bun en nix. [Zie installatieopties](installation.md).

## Documentatie

→ **[Aan de slag](getting-started.md)**: eerste stappen<br>
→ **[Werkwijzen](workflows.md)**: combinaties en patronen<br>
→ **[Commando's](commands.md)**: slash-commando's & vaardigheden<br>
→ **[CLI](cli.md)**: terminalreferentie<br>
→ **[Ondersteunde Tools](supported-tools.md)**: toolintegraties & installatiepaden<br>
→ **[Concepten](concepts.md)**: hoe het allemaal samenwerkt<br>
→ **[Meertalig](multi-language.md)**: meertalige ondersteuning<br>
→ **[Aanpassing](customization.md)**: maak het het jouwe


## Waarom OpenSpec?

AI-codeerassistenten zijn krachtig maar onvoorspelbaar wanneer vereisten alleen in de chatgeschiedenis leven. OpenSpec voegt een lichtgewicht specificatielaag toe zodat je het erover eens bent wat er gebouwd moet worden voordat er ook maar één regel code wordt geschreven.

- **Eens vóórdat je bouwt** — mens en AI komen overeen over specificaties voordat code wordt geschreven
- **Blijf georganiseerd** — elke wijziging krijgt zijn eigen map met voorstel, specificaties, ontwerp en taken
- **Werk vloeiend** — werk elk artefact op elk moment bij, geen rigide fasemijlpalen
- **Gebruik je tools** — werkt met 20+ AI-assistenten via slash-commando's

### Hoe wij ons verhouden

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Grondig maar zwaar. Rigide fasemijlpalen, veel Markdown, Python-setup. OpenSpec is lichter en laat je vrij itereren.

**vs. [Kiro](https://kiro.dev)** (AWS) — Krachtig maar je bent vastgelegd op hun IDE en beperkt tot Claude-modellen. OpenSpec werkt met de tools die je al gebruikt.

**vs. niets** — AI-codeerwerk zonder specificaties betekent vage prompts en onvoorspelbare resultaten. OpenSpec brengt voorspelbaarheid zonder de opsmuk.

## OpenSpec bijwerken

**Pakket upgraden**

```bash
npm install -g @fission-ai/openspec@latest
```

**Agentinstructies vernieuwen**

Voer dit uit in elk project om de AI-begeleiding opnieuw te genereren en ervoor te zorgen dat de nieuwste slash-commando's actief zijn:

```bash
openspec update
```

## Gebruiksaanmerkingen

**Modelselectie**: OpenSpec werkt het beste met modellen met hoge redeneervaardigheden. We raden Opus 4.5 en GPT 5.2 aan voor zowel planning als implementatie.

**Context-hygiëne**: OpenSpec profiteert van een schone contextvenster. Wis je context voordat je met implementatie begint en onderhoud een goede context-hygiëne gedurende je sessie.

## Bijdragen

**Kleine fixes** — Bugfixes, typecorrecties en kleine verbeteringen kunnen direct als PR's worden ingediend.

**Grotere wijzigingen** — Voor nieuwe functies, significante refactors of architectonische wijzigingen, dien eerst een OpenSpec-wijzigingsvoorstel in zodat we over de intentie en doelen kunnen overeenkomen voordat de implementatie begint.

Houd bij het schrijven van voorstellen de OpenSpec-filosofie in gedachten: we bedienen een breed scala aan gebruikers over verschillende codeeragents, modellen en gebruikssituaties. Wijzigingen moeten voor iedereen goed werken.

**AI-gegenereerde code is welkom** — zolang deze getest en geverifieerd is. PR's met AI-gegenereerde code moeten de gebruikte codeeragent en het model vermelden (bijv. "Gegenereerd met Claude Code met behulp van claude-opus-4-5-20251101").

### Ontwikkeling

- Afhankelijkheden installeren: `pnpm install`
- Bouwen: `pnpm run build`
- Testen: `pnpm test`
- CLI lokaal ontwikkelen: `pnpm run dev` of `pnpm run dev:cli`
- Conventionele commits (éénregelig): `type(scope): onderwerp`

## Overig

<details>
<summary><strong>Telemetrie</strong></summary>

OpenSpec verzamelt anonieme gebruiksstatistieken.

We verzamelen alleen commandonamen en versie om gebruikspatronen te begrijpen. Geen argumenten, paden, inhoud of PII. Automatisch uitgeschakeld in CI.

**Uitschakelen:** `export OPENSPEC_TELEMETRY=0` of `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>Beheerders & Adviseurs</strong></summary>

Zie [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) voor de lijst van kernbeheerders en adviseurs die helpen het project te begeleiden.

</details>



## Licentie

MIT