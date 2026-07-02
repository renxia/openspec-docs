# Eerst Verkennen

**`/opsx:explore` is uw denkpartner.** Gebruik het wanneer u een probleem heeft maar nog geen plan. Het onderzoekt uw codebase, weegt opties met u mee en maakt duidelijk wat u daadwerkelijk wilt, alles voordat er een enkel artefact of regel code wordt gecreëerd. Wanneer het beeld duidelijk is, geeft het over aan aan `/opsx:propose`.

Als u één gewoonte uit deze documentatie neemt, neem dan deze: **als u zich niet zeker voelt, verkennen dan voordat u voorstelt.**

Hieruit blijkt waarom dit belangrijk is. AI coding assistants zijn gretig. Vraag vaag en ze zullen met vertrouwen *iets* bouwen, misschien maar niet het ding dat u nodig had. Explore is de remedie. Het is een conversatie zonder risico waarin u en de AI samen de juiste stap uitzoeken, zodat wanneer u voorstelt, u het juiste voorstelt.

## Wanneer te verkennen

Explore is vaker de juiste eerste stap dan mensen verwachten. Gebruik het als een van de volgende waar is:

- U weet het *probleem* maar niet de *oplossing*. ("De pagina's voelen traag aan." "Auth is een puinhoop." "We krijgen steeds dubbele bestellingen.")
- U kiest tussen benaderingen en wilt de afwegingen (tradeoffs) tegenover uw eigen code zien.
- U bent nieuw in een codebase en moet begrijpen hoe iets werkt voordat u het verandert.
- De vereisten zijn vaag en u wilt ze aanscherpen voordat u zich vastlegt.
- U vermoedt dat het werk groter of kleiner is dan het lijkt en wilt dit eerlijk inschatten (scope).

Sla explore over als u precies weet wat u wilt en hoe. In dat geval gaat u rechtstreeks naar [`/opsx:propose`](commands.md#opsxpropose).

## Wat het doet (en niet)

Explore is een **gesprek**, geen generator.

**Het doet:**
- Leest en zoekt door uw codebase om echte vragen te beantwoorden.
- Vergelijkt opties en noemt de afwegingen van elk.
- Tekent diagrammen om het ontwerp leesbaar te maken.
- Helpt u een vage gedachte om te zetten in een concreet, uitvoerbaar scope.
- Gaat over naar `/opsx:propose` wanneer u er klaar voor bent.

**Het doet niet:**
- Maakt een wijzigingsmap.
- Schrijft enig artefact (geen proposal, specificaties, ontwerp of taken).
- Schrijft of wijzigt code.

Dat is het punt. Verkennen kost u niets en bindt u aan niets. U kunt drie doodlopende wegen verkennen, iets leren van elk, en pas dan de weg voorstellen die heeft overleefd.

## Het is al geïnstalleerd

Goed nieuws: `/opsx:explore` wordt meegeleverd in het standaard **core** profiel, naast `propose`, `apply`, `sync` en `archive`. U hoeft niets te activeren. Als OpenSpec in uw project is ingesteld, dan is explore klaar in uw AI chat. (Net als bij alle `/opsx:*` commando's typt u het in de chat van uw assistent, niet in de terminal. Zie [Hoe Commando's Werken](how-commands-work.md).)

## Een volledig voorbeeld

Kijk hoe een vage zorg verandert in een scherpe, uitvoerbare wijziging.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Our checkout sometimes creates duplicate orders. I don't know why
     and I don't know how to fix it safely.

AI:  Let me dig into the checkout path...
     [reads the order service, the payment webhook handler, and the
      client submit logic]

     Here's what I found. There are two ways a duplicate can happen:

     1. The client can submit twice (double-click, retry on slow network).
        Nothing debounces it.
     2. The payment webhook can fire more than once, and the handler
        creates an order each time. There's no idempotency key.

     Cause #2 is the dangerous one: it can charge and fulfill twice.

     Three ways to fix it, roughly in order of robustness:
     - Idempotency key on the order-creation endpoint (handles both causes)
     - Dedup on the webhook by payment-intent id (handles #2 only)
     - Client-side debounce (handles #1 only, papers over the real bug)

     Given your code already stores the payment-intent id, the
     idempotency-key approach is a small change with the biggest payoff.
     Want me to scope that?

You: Yes, let's do the idempotency key.

You: /opsx:propose add-order-idempotency-key

AI:  Created openspec/changes/add-order-idempotency-key/, with a proposal
     and delta spec grounded in what we just found. Ready for implementation.
```

Merk op wat er gebeurde. Het startpunt was "iets is mis en ik ben bang om het aan te raken." Twintig seconden van verkennen hebben dat omgezet in een benoemde oorzaak, drie gerangschikte opties, een aanbeveling gekoppeld aan de bestaande code en een precieze wijziging. Het daaropvolgende proposal is scherp omdat het denken eerst plaatsvond.

## Overdragen aan propose

Explore archiveert niets in iets. Wanneer u er klaar voor bent, start u simpelweg een wijziging, en de AI neemt de context van uw gesprek mee naar de artefacten.

```text
explore  ──►  propose  ──►  apply  ──►  archive
 (think)     (agree)       (build)     (record)
```

U kunt het in gewone taal zeggen ("laten we dit omzetten in een wijziging") of direct `/opsx:propose <name>` uitvoeren. Op welke manier dan ook, de exploratie die u zojuist heeft gedaan wordt de basis van het proposal, geen wegwerpchat.

Als u de uitgebreide commando's gebruikt, kan explore overdragen aan `/opsx:new` in plaats daarvan, voor stap-voor-stap creatie van artefacten. Zie [Workflows](workflows.md).

## Tips voor een goede exploratie

- **Breng het probleem mee, niet de oplossing.** "Logins voelen traag" geeft de AI ruimte om te onderzoeken. "Voeg een Redis cache toe" bindt u al aan een antwoord dat u nog niet heeft getest.
- **Vraag hardop naar de afwegingen (tradeoffs).** "Wat zijn de nadelen van elk optie?" levert een eerlijkere vergelijking op.
- **Laat het eerst lezen.** De beste exploraties beginnen met de AI die daadwerkelijk naar uw code kijkt, niet door te gokken. Wijs het aan de relevante sectie als dit helpt.
- **Het is oké om af te zien (bail).** Als de exploratie onthult dat het idee niet het waard is, is dat een overwinning. U heeft het goedkoop geleerd.
- **Verken opnieuw tijdens de wijziging.** Vastgelopen tijdens `/opsx:apply`? U kunt teruggaan en een subprobleem verkennen, en dan terugkeren.

## De eerlijke afwegingen (tradeoffs)

**Wat u wint:** explore pakt foutieve wendingen op het goedkoopst mogelijke moment, voordat er enig artefact bestaat. Het is bijzonder krachtig bij onbekende code, waarbij het vermogen van de AI om het systeem te lezen en samen te vatten u een middag speurwerk bespaart.

**Wat het kost:** een beetje geduld. Explore is een gesprek, dus het is langzamer dan het uitvoeren van `/opsx:propose` en hopen. Voor werk dat u al echt begrijpt, is die extra stap puur overhead, en u dient deze over te slaan.

De vuistregel: hoe vager de taak, hoe meer explore oplevert. Hoe duidelijker de taak, hoe meer u kunt overslaan naar het voorstellen.

## Waar u nu naartoe gaat

- [Commands: `/opsx:explore`](commands.md#opsxexplore): de precieze referentie
- [Workflows](workflows.md): explore als onderdeel van de dagelijkse cyclus
- [Examples & Recipes](examples.md#recipe-3-exploring-before-you-commit): explore in een volledige walkthrough
- [Getting Started](getting-started.md): de gids voor de eerste wijziging, inclusief exploratie