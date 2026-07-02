# Het Gebruik van OpenSpec in een Bestaand Project

**Je documenteert niet je gehele codebase om te beginnen. Je schrijft specificaties alleen voor wat je op het punt staat te wijzigen.** Dit is het allerbelangrijkste om te weten bij het adopteren van OpenSpec op een bestaand project, en dit is waarom OpenSpec vanaf de grond (brownfield-first) is gebouwd.

Een veelvoorkomende zorg luidt: "Mijn app is 80.000 regels oud. Moet ik eerst specificaties voor alles schrijven voordat OpenSpec nuttig is?" Nee. Dat zou je niet plezierig vinden, en dat zouden wij ook niet. OpenSpec groeit jouw specificaties één keer per wijziging. Je eerste wijziging documenteert het deel van de code waarop deze raakt; de volgende wijziging documenteert zijn deel, en na maanden vullen je specificaties zich organisch aan rondom het werk dat je daadwerkelijk uitvoert.

Deze handleiding laat zien hoe je kunt beginnen op dag één zonder te veel tegelijk te willen doen.

## De dertig seconden versie

```bash
$ cd your-existing-project
$ openspec init          # voegt openspec/ en de commando's van jouw AI-tool toe
```

Vervolgens, in je AI chat:

```text
/opsx:explore            # optioneel: laat de AI het gebied dat je gaat aanraken lezen
/opsx:propose <een echte, kleine wijziging die je daadwerkelijk nodig hebt>
/opsx:apply
/opsx:archive
```

Je specificaties beschrijven nu precies het deel van het systeem waarop de wijziging raakte, en niets meer. Dat is correct. Je hoeft niet meer na te denken over de andere 80.000 regels.

## Waarom delta-first de hele truc is

OpenSpec wijzigingen worden geschreven als **deltas**: `ADDED`, `MODIFIED`, `REMOVED`. Een delta beschrijft wat er verandert ten opzichte van het huidige gedrag, niet het gehele systeem.

Dit is precies wat brownfield-werk nodig heeft. Je bouwt zelden iets uit het niets. Je voegt een veld toe, corrigeert een redirect, verscherpt een timeout. Een delta stelt je in staat om die ene wijziging nauwkeurig te specificeren zonder eerst een 40 pagina's durende specificatie van alles eromheen te schrijven.

Dus jouw `openspec/specs/` map begint niet vol en compleet. Hij begint bijna leeg en accumuleert. Elke gearchiveerde wijziging voegt zijn delta toe. De specificatie voor `auth/` wordt pas grondig nadat je verschillende auth-wijzigingen hebt doorgevoerd, wat precies is wanneer je het grondig wilt hebben.

Als je de diepere mechanismen wilt weten, zie [Concepts: Delta Specs](concepts.md#delta-specs).

## Je eerste wijziging op een echte codebase

Kies iets kleins en reëels. Geen speelgoed, geen herschrijving. Een wijziging die je sowieso deze week zou gaan doen. Kleine initiële wijzigingen leren je de workflow met lage inzet.

**Stap 1: Laat de AI het relevante gebied lezen.** Dit is waar `/opsx:explore` zijn waarde bewijst op een onbekende of grote codebase. Wijs het aan op het deel dat je gaat aanraken en laat het mappen hoe dingen werken voordat je iets voorstelt.

```text
Jij: /opsx:explore

AI:  Wat zou u willen verkennen?

Jij: Ik moet rate limiting toevoegen aan onze publieke API, maar ik weet niet zeker
     hoe requests momenteel door de middleware stromen.

AI:  Laat me het traceren... [leest de router, de middleware stack en de config]
     Requests komen binnen bij Express, gaan door de auth middleware, dan naar uw
     controllers. Er is vandaag geen rate-limiting laag. Het schoonste
     insertiepunt is een middleware direct na de auth. Wilt u dat ik het scope?
```

Merk op dat de AI nu jouw werkelijke structuur begrijpt, waardoor het voorstel dat hij schrijft past bij je code, en niet bij een generische sjabloon. Op een grote codebase bespaart dit ene gewoontje de meeste moeite. Zie [Explore First](explore.md).

**Stap 2: Stel de wijziging voor.** Het voorstel en zijn delta-specificatie vangen alleen deze wijziging op.

```text
Jij: /opsx:propose add-api-rate-limiting
```

**Stap 3: Bouw en archiveer** met `/opsx:apply` en `/opsx:archive`, net als bij elke andere wijziging. Na het archiveren heb je een echte specificatie voor jouw rate-limiting gedrag, geboren uit een wijziging die je sowieso nodig had.

## Wil je liever een begeleide tour? Gebruik onboard

Als je liever wilt meekijken hoe de hele lus op jouw eigen code gebeurt met narratief, dan doet het uitgebreide commando `/opsx:onboard` precies dat: het scant je codebase naar een kleine, veilige verbetering en leidt je vervolgens door het voorstellen, bouwen en archiveren ervan, waarbij elke stap wordt uitgelegd.

Schakel eerst de uitgebreide commando's in:

```bash
$ openspec config profile      # selecteer de uitgebreide workflows
$ openspec update              # pas deze toe op dit project
```

Vervolgens in de chat:

```text
/opsx:onboard
```

Het is de zachtst mogelijke introductie op een echt project, en het laat je met een authentieke (kleine) wijziging die je kunt behouden of weggooien. Zie [Commands: `/opsx:onboard`](commands.md#opsxonboard).

## "Maar ik heb al vereisten documentatie"

Misschien heb je een PRD, een SRS, een formele specificatie, zelfs TLA+-modellen. Goed. Je importeert ze niet in één keer, en je gooit ze ook niet weg.

Behandel bestaande documentatie als **grondstof voor exploratie**, niet als specificaties om te converteren. Wanneer je een wijziging start, plak of wijs de AI op het relevante gedeelte, en laat deze een gefocuste OpenSpec delta daaruit vormen. De delta vangt het gedrag dat je nu verandert, in de testbare vereiste-en-scenariovorm van OpenSpec. Je oorspronkelijke documenten blijven staan als achtergrondinformatie.

De eerlijke reden: OpenSpec specificaties zijn opzettelijk gedragsgericht en beperkt tot wijzigingen. Een 40 pagina's PRD is een ander artefact met een andere taak. Het dwingen van een eenmalige bulkconversie leidt meestal tot een grote, verouderde specificatie die niemand vertrouwt. Het laten groeien van specificaties vanuit echte wijzigingen houdt ze accuraat.

```text
Jij: /opsx:explore
Jij: Hier is het gedeelte van onze PRD over de checkout. Ik implementeer de
     "guest checkout"-vereiste nu.
     [plak de relevante vereiste]
AI:  [leest, stelt verhelderende vragen en helpt bij het afbakenen van een wijziging]
Jij: /opsx:propose add-guest-checkout
```

## Het organiseren van specificaties in een grote codebase

Specificaties leven onder `openspec/specs/`, gegroepeerd op **domein**: een logisch gebied dat overeenkomt met hoe je team het systeem benadert. Je hoeft niet de hele taxonomie vooraf te ontwerpen. Maak een domeinmap wanneer je eerste wijziging in dat gebied dit vereist.

Veelgebruikte manieren om domeinen op te splitsen:

- **Op basis van featuregebied:** `auth/`, `payments/`, `search/`
- **Op basis van component:** `api/`, `frontend/`, `workers/`
- **Op basis van bounded context:** `ordering/`, `fulfillment/`, `inventory/`

Kies wat het meest intuïtief is voor een nieuwkomer. Je kunt later verfijnen. Zie [Concepts: Specs](concepts.md#specs).

## Monorepos en werk dat meerdere repos beslaat

Voor een monorepo is het eenvoudigste model één `openspec/` map in de repo-root, met domeinen die overeenkomen met je packages of services. Dat dekt de meeste teams af.

Als je werk daadwerkelijk meerdere **repositories** (of verschillende packages die je als gescheiden behandelt) beslaat, dan heeft OpenSpec een bèta **stores** functie: de planning leeft in zijn eigen onafhankelijke repo die elk van jouw code repos kan refereren, zodat het plan niet hoeft te leven binnen de `openspec/` map van één repo. Het is bèta, dus behandel zijn commando's en staat als evoluerend. Begin met de [Stores User Guide](stores-beta/user-guide.md) voor het mentale model en de kleinst mogelijke nuttige weg.

## Een paar eerlijke waarschuwingen

- **Weersta de drang om alles achteraf in te vullen.** Het schrijven van specificaties voor code die je niet verandert, voelt productief aan en is meestal dat niet. Die specificaties worden verouderd, omdat niets ze dwingt om de realiteit te volgen. Laat echte wijzigingen jouw specificaties sturen.
- **Houd vroege wijzigingen klein.** Je eerste paar wijzigingen gaat net zoveel over het leren van het ritme als over het opleveren. Een nauwe scope maakt de lus snel en de lessen goedkoop.
- **Commit `openspec/` naar git.** Jouw specificaties en archief behoren in versiebeheer samen met de code die ze beschrijven.
- **Geef de AI context.** Op een grote codebase met sterke conventies, vul het `context:` van `openspec/config.yaml` zodat elk voorstel jouw stack en patronen respecteert. Zie [Customization](customization.md#project-configuration).

## Waar kun je verder gaan

- [Explore First](explore.md) - de sleutelgewoonte om code te begrijpen voordat je deze verandert
- [Getting Started](getting-started.md) - de volledige walkthrough voor de eerste wijziging
- [Editing & Iterating on a Change](editing-changes.md) - een wijziging aanpassen terwijl je leert
- [Concepts: Delta Specs](concepts.md#delta-specs) - waarom deltas brownfield-werk schoon maken
- [Customization](customization.md) - leer OpenSpec de conventies van jouw project