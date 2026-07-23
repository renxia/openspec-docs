# Voorbeelden & Recepten

Echte wijzigingen, van begin tot eind. Elk recept toont de opdrachten die je zou typen en wat je terugziet, zodat je je situatie kunt vergelijken met een patroon en het kunt kopiëren. Deze gebruiken de standaard **core**-opdrachten (`propose`, `explore`, `apply`, `sync`, `archive`); waar de uitgebreide set helpt, wordt dat vermeld.

Een herinnering voordat je begint: slash-opdrachten zoals `/opsx:propose` horen in de **chat van je AI-assistent**, en `openspec`-opdrachten horen in je **terminal**. Als dit nieuw voor je is, lees dan eerst [Hoe Opdrachten Werken](how-commands-work.md). In de transcripties hieronder vertegenwoordigen `You:` en `AI:` de chat, en regels die beginnen met `$` zijn de terminal.

> **Nog niet zeker wat je gaat bouwen?** De meeste van deze recepten zijn scherper als je eerst met `/opsx:explore` begint om het te doordenken. [Recept 3](#recipe-3-exploring-before-you-commit) laat het in actie zien, en de [Eerst Verkenen](explore.md)-gids legt het volledige geval uit.

## Recept 1: Een kleine functie, de snelle route

**Wanneer te gebruiken:** je weet wat je wilt, en het is een afgebakend stuk werk. Dit is het meest voorkomende recept.

Het geheel bestaat uit drie opdrachten. Voorstellen, bouwen, archiveren.

```text
You: /opsx:propose add-logout-button

AI:  Gemaakt openspec/changes/add-logout-button/
     ✓ proposal.md — waarom en wat
     ✓ specs/      — de nieuwe vereiste en de bijbehorende scenario's
     ✓ design.md   — technische aanpak
     ✓ tasks.md    — implementatielijst
     Klaar voor implementatie. Voer /opsx:apply uit.
```

Lees nu het plan. Open het voorstel en de delta-specificatie. Dit is het moment waarop OpenSpec voor is gebouwd: een verkeerde aanname vangen terwijl het nog maar een alinea is, niet 400 regels code. Bewerk elk artefact direct als er iets niet klopt, en ga dan verder.

```text
You: /opsx:apply

AI:  Taken uitvoeren...
     ✓ 1.1 Voeg uitlogknop toe aan koptekst
     ✓ 1.2 Wis sessie bij klikken
     ✓ 1.3 Voeg bevestigingsdialoog toe
     Alle taken zijn voltooid!

You: /opsx:archive

AI:  Archiveren van add-logout-button...
     ✓ Samengevoegde specificaties naar openspec/specs/auth/spec.md
     ✓ Verplaatst naar openspec/changes/archive/2026-06-22-add-logout-button/
     Klaar. Klaar voor de volgende wijziging.
```

Dat is het. Het uitloggedrag is nu onderdeel van je specificaties, en de wijziging is met de volledige context opgeslagen.

## Recept 2: Een bugfix

**Wanneer te gebruiken:** er is iets kapot en je wilt dat de fix wordt vastgelegd als een opzettelijke gedragsaanpassing, niet als een mysterieuze commit.

Bugfixes werken precies zoals functies. Het verschil zit in hoe je het voorstel opstelt: beschrijf het *juiste* gedrag, niet alleen "fix de bug".

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Gemaakt openspec/changes/fix-login-redirect-loop/
     Het voorstel legt het huidige kapotte gedrag en het
     beoogde gedrag vast. De delta-specificatie WIJZIGT de
     omleidingsvereiste zodat deze nu nauwkeurig en testbaar is.
     Klaar voor implementatie.
```

Omdat de fix landt als een `MODIFIED`-vereiste met een nieuw scenario, ziet de volgende persoon (of de volgende AI-sessie) niet alleen dat je het hebt gefixt, maar ook wat "correct" betekent. Vervolgens doe je `/opsx:apply` en `/opsx:archive` zoals gewoonlijk.

Tip: voor een fix is een goed scenario de regressietest in proza. "GIVEN a logged-out user, WHEN they submit valid credentials, THEN they land on the dashboard and are not redirected again." Schrijf dat op, en de implementatie heeft een duidelijk doel.

## Recept 3: Verken voordat je vastlegt

**Wanneer te gebruiken:** je hebt een probleem maar nog geen plan. Je weet niet zeker wat je moet bouwen, of welke aanpak de juiste is.

Begin met `/opsx:explore`. Het is een denkpartner zonder structuur en zonder gecreëerde artefacten. Het leest je codebase en helpt je te beslissen.

```text
You: /opsx:explore

AI:  Wat zou je willen verkennen?

You: Pagina's laden voelen traag, maar ik weet niet waar de tijd naartoe gaat.

AI:  Laat me kijken... Ik heb drie waarschijnlijke oorzaken gevonden:
     1. Grote ongeoptimaliseerde afbeeldingen op de productenlijst
     2. Synchroon data ophalen dat de rendering blokkeert
     3. Opnieuw renderen veroorzaakt door contextwijzigingen
     Welke moeten we eerst aanpakken?

You: Die van het data ophalen.

You: /opsx:propose optimize-product-list-fetching

AI:  De wijziging is gemaakt, met een voorstel gebaseerd op wat we net
     hebben gevonden. Klaar voor implementatie.
```

Verkennen verduidelijkt je denken *voordat* je een wijziging eraan besteedt. Wanneer het inzicht kristalliseert, stel je een voorstel, en de AI neemt de context met zich mee.

## Recept 4: Twee wijzigingen tegelijkertijd managen

**Wanneer te gebruiken:** je zit midden in een functie en er is een dringende fix die voor springt.

Wijzigingen zijn onafhankelijke mappen, dus parallel werk botst niet. Start de fix, lever hem in, en keer dan terug naar de functie precies waar je was gebleven.

```text
You: Ik ben halverwege add-dark-mode, maar ik moet nu een loginbug fixen.

You: /opsx:propose fix-login-redirect

AI:  Gemaakt openspec/changes/fix-login-redirect/. Klaar voor implementatie.

You: /opsx:apply

AI:  De fix is geïmplementeerd. Alle taken zijn voltooid.

You: /opsx:archive

AI:  ✓ fix-login-redirect gearchiveerd.

You: Terug naar dark mode.

You: /opsx:apply add-dark-mode

AI:  Hervatten van add-dark-mode. We gaan verder bij taak 2.3: Header bijwerken...
```

Het noemen van de wijziging in `/opsx:apply add-dark-mode` is hoe je de AI op een specifieke wijziging laat wijzen als er meer dan één actief is. Omdat taken de voortgang bijhouden in `tasks.md`, weet de AI precies waar je was gebleven.

Als er verschillende wijzigingen tegelijk worden gedaan, archiveert de uitgebreide `/opsx:bulk-archive` ze samen en lost specificatieconflicten op door te controleren wat daadwerkelijk is geïmplementeerd. Zie [Werkstromen](workflows.md#parallel-changes).

## Recept 5: Een refactor zonder gedragsverandering

**Wanneer te gebruiken:** je herstructureert code, en extern zichtbaar gedrag moet identiek blijven.

Dit is de interessante casus, omdat een pure refactor *niets heeft om aan je specificaties toe te voegen*. Het gedragscontract verandert niet; alleen de implementatie verandert. Dus het werk zit in het ontwerp en de taken, en de delta-specificatie is leeg of afwezig.

```text
You: /opsx:propose refactor-payment-module

AI:  De wijziging is gemaakt. Het voorstel stelt het doel (splits de
     betaalmodule, geen gedragsverandering) en het ontwerp legt de
     nieuwe structuur vast. Geen specificatiewijzigingen, omdat het
     gedrag identiek is. Klaar voor implementatie.
```

Verklaar de lege delta expliciet door `skip_specs: true` in te stellen in de `.openspec.yaml` van de wijziging:

```yaml
schema: spec-driven
skip_specs: true
```

Zonder de markering weigert `openspec validate` een wijziging met nul delta's (zodat een vergeten specificatiefase nog steeds wordt opgemerkt); ermee gaat de validatie goed en toont `openspec status` de specificatiefase als expliciet overgeslagen in plaats van in behandeling. Als de refactor uiteindelijk toch gedrag verandert, verwijder dan `skip_specs` uit `.openspec.yaml` en schrijf de delta-specificaties — validate behandelt de markering plus specificatiebestanden als een conflict, zodat de verouderde markering niet stilzwijgend kan blijven staan.

Archiveren van een gemarkeerde wijziging heeft geen extra vlaggen nodig (er zijn geen delta's om samen te voegen). Onafhankelijk daarvan vertelt de `--skip-specs`-vlag de terminalopdracht expliciet om de specificatiestap over te slaan:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

Dezelfde vlag is handig voor tooling, CI en wijzigingen die alleen documentatie betreffen. Het principe: specificaties beschrijven gedrag, dus als het gedrag niet verandert, zou de specificatie ook niet moeten veranderen. Zie [Concepten](concepts.md#what-a-spec-is-and-is-not).

## Recept 6: Stap-voor-stap controle (uitgebreide opdrachten)

**Wanneer te gebruiken:** een complexe of riskante wijziging waarbij je elk artefact wilt beoordelen voordat je verdergaat.

De kernopdracht `/opsx:propose` stelt alles in één keer op. Als je liever stap voor stap gaat, schakel je de uitgebreide opdrachten in:

```bash
$ openspec config profile      # selecteer de uitgebreide workflows
$ openspec update              # pas ze toe op dit project
```

Nu kun je incrementeel opbouwen en ontwikkelen:

```text
You: /opsx:new add-2fa

AI:  Gemaakt openspec/changes/add-2fa/. Klaar om te creëren: voorstel.

You: /opsx:continue

AI:  proposal.md is gemaakt. Nu beschikbaar: specificaties, ontwerp.

You: /opsx:continue

AI:  specs/auth/spec.md is gemaakt. Nu beschikbaar: ontwerp.
```

Beoordeel elk artefact zodra het er is, bewerk het vrij, en ga verder als je tevreden bent. Als je de rest in één keer wilt opstellen, versnelt `/opsx:ff` door de resterende planartefacten. Voor het archiveren controleert `/opsx:verify` of de implementatie daadwerkelijk overeenkomt met de specificaties. Zie [Werkstromen](workflows.md#opsxff-vs-opsxcontinue).

## Recept 7: De hele loop hands-on leren

**Wanneer te gebruiken:** je hebt OpenSpec geïnstalleerd en wilt de workflow *gevoelen* aan de hand van je eigen code, niet een voorbeeld met speelgoed.

Schakel de uitgebreide opdrachten in (zie Recept 6), en dan:

```text
You: /opsx:onboard

AI:  Welkom bij OpenSpec! Ik zal je door een complete wijziging lopen
     met je eigen codebase. Laat me zoeken naar een kleine, veilige
     verbetering die we samen kunnen doen...
```

`/opsx:onboard` vindt een echte (kleine) verbetering, maakt er een wijziging voor, implementeert het en archiveert het, waarbij elke stap wordt verteld. Het duurt 15 tot 30 minuten en laat je achter met een echte wijziging die je kunt bewaren of weggooien. Het is de zachtste manier om te leren. Zie [Opdrachten](commands.md#opsxonboard).

## Je werk controleren vanaf de terminal

Altijd, vanaf je terminal, kun je de staat van zaken inspecteren:

```bash
$ openspec list                      # actieve wijzigingen
$ openspec show add-dark-mode        # één wijziging in detail
$ openspec validate add-dark-mode    # controleer structuur
$ openspec view                      # interactief dashboard
```

Dit zijn lees- en inspectiegereedschappen. Het voorstellen en bouwen gebeurt nog steeds via slash-opdrachten in de chat. Volledige details in de [CLI-reference](cli.md).

## Vervolgrichtingen

- [Eerst Verkenen](explore.md): de aanbevolen manier om te beginnen als je onzeker bent
- [Werkstromen](workflows.md): de bovenstaande patronen, met beslissingsondersteuning over wanneer je welke moet gebruiken
- [Opdrachten](commands.md): elke slash-opdracht in detail
- [Aan de Slag](getting-started.md): de canonieke doorloop van de eerste wijziging
- [Concepten](concepts.md): waarom de onderdelen op deze manier in elkaar passen