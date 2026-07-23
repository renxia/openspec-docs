# Werkstromen

Deze gids behandelt veelvoorkomende werkstroompatronen voor OpenSpec en wanneer u welke moet gebruiken. Voor basisinstellingen, zie [Aan de slag](getting-started.md). Voor een overzicht van opdrachten, zie [Opdrachten](commands.md).

## Filosofie: Acties, geen fasen

Traditionele werkstromen dwingen u door fasen: planning, dan implementatie, dan klaar. Maar echt werk past niet netjes in vakken.

OPSX kiest een andere aanpak:

```text
Traditional (phase-locked):

  PLANNING ────────► IMPLEMENTING ────────► DONE
      │                    │
      │   "Can't go back"  │
      └────────────────────┘

OPSX (fluid actions):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Belangrijkste principes:**

- **Acties, geen fasen** - Opdrachten zijn dingen die u kunt doen, geen fasen waarin u vastzit
- **Afhankelijkheden zijn mogelijkheden** - Ze tonen wat mogelijk is, niet wat de volgende vereiste is

> **Aanpassing:** OPSX-workflows worden gedreven door schema's die artefactreeksen definiëren. Zie [Aanpassing](customization.md) voor details over het maken van aangepaste schema's.

## Twee Modi

### Standaard Snelle Route (`core` profiel)

Nieuwe installaties gebruiken standaard `core`, dat biedt:
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Typische flow:

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (optioneel)
```

#### Begin met verkennen (de gewoonte die het waard is aan te leren)

`/opsx:explore` maakt deel uit van het standaard profiel, niet van een geavanceerde toevoeging. Het is de zet die je moet doen wanneer je een probleem hebt maar nog geen plan, wat, met een AI-assistent, het grootste deel van de tijd het geval is.

```text
Jij: /opsx:explore

AI:  Wat zou je willen verkennen?

Jij: Onze zoekresultaten voelen verouderd. Ik weet niet of het aan caching,
     indexering of aan de query zelf ligt.

AI:  Laat me kijken... [leest de zoekservice en cachelaag]
     Het is de index: die wordt alleen 's nachts opnieuw opgebouwd, dus bewerkingen verschijnen
     niet tot de volgende dag. Twee opties: opnieuw opbouwen bij schrijven (eenvoudig,
     meer belasting) of een cache-invalidatie met korte TTL (meer bewegende delen,
     minder belasting). Gezien je schrijfvolume laag is, is opnieuw-opbouwen-bij-schrijven
     de schonere oplossing. Wil je het toepassingsgebied bepalen?

Jij: Ja.

Jij: /opsx:propose rebuild-search-index-on-write
```

Explore maakt geen artefacten aan en schrijft geen code. Het is een gratis, risicovolle gesprek dat een vage zorg vertaalt in een precieze wijziging, zodat het volgende voorwerp scherp is. Weet je precies wat je wilt? Sla het over en ga direct naar `/opsx:propose`. Volgide gids: [Eerst Verkennen](explore.md).

### Uitgebreide/Volledige Workflow (aangepaste selectie)

Als je expliciete scaffold- en build-opdrachten wilt (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), schakel ze in met:

```bash
openspec config profile
openspec update
```

## Workflowpatronen (Uitgebreide Modus)

### Snelle Functie

Wanneer je weet wat je wilt bouwen en alleen uitvoering nodig hebt:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Voorbeeldgesprek:**

```text
Jij: /opsx:new add-logout-button

AI:  Aangemaakt openspec/changes/add-logout-button/
     Klaar om te creëren: proposal

Jij: /opsx:ff

AI:  Alle planning-artefacten aanmaken...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Klaar voor implementatie!

Jij: /opsx:apply

AI:  Werken aan taken...
     ✓ Logout-knop toegevoegd aan header
     ✓ Sessie-wissen geïmplementeerd
     ✓ Bevestigingsdialoog toegevoegd
     Alle taken voltooid!

Jij: /opsx:archive

AI:  ✓ Specs samengevoegd
     ✓ Wijziging gearchiveerd
```

**Het beste voor:** Kleine tot middelgrote functies, bugfixes, eenvoudige wijzigingen.

### Verkennend

Wanneer vereisten onduidelijk zijn of je eerst moet onderzoeken:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Voorbeeldgesprek:**

```text
Jij: /opsx:explore

AI:  Wat zou je willen verkennen?

Jij: Ik wil de laadtijd van pagina's verbeteren maar ik weet niet
     waar de knelpunten zitten.

AI:  Laat me helpen onderzoeken...
     [Analyseert bundelgroottes, identificeert trage queries, beoordeelt
     component-renderpatronen]

     Ik heb drie hoofdknelpunten gevonden:
     1. Grote niet-geoptimaliseerde afbeeldingen
     2. Synchrone data-ophaling in ProductList
     3. Herhalingen vanwege contextwijzigingen

     Welke wil je als eerste aanpakken?

Jij: Laten we het data-ophalingsprobleem aanpakken.

Jij: /opsx:new optimize-product-list-fetching

AI:  Wijziging aangemaakt. Klaar om te creëren: proposal

Jij: /opsx:continue

AI:  Proposal aanmaken op basis van onze verkenning...
     [Schrijft proposal met inzichten uit onderzoek]

     Klaar om te creëren: specs, design
     Wat wil je als volgende?

Jij: /opsx:continue

AI:  Specs aanmaken...
```

**Het beste voor:** Prestatie-optimalisatie, debuggen, architectuurbeslissingen, onduidelijke vereisten.

### Parallelle Wijzigingen

Werk aan meerdere wijzigingen tegelijk:

```text
Wijziging A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in uitvoering)
                                         │
                                    contextwisseling
                                         │
Wijziging B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Voorbeeldgesprek:**

```text
Jij: Ik werk aan add-dark-mode maar werd onderbroken voor een bugfix

Jij: /opsx:new fix-login-redirect

AI:  Aangemaakt openspec/changes/fix-login-redirect/

Jij: /opsx:ff

AI:  ✓ Planning-artefacten aangemaakt

Jij: /opsx:apply

AI:  Werken aan fix-login-redirect...
     [Implementeert de fix]
     Alle taken voltooid!

Jij: /opsx:archive

AI:  ✓ fix-login-redirect gearchiveerd

Jij: Laten we terug naar dark mode

Jij: /opsx:apply add-dark-mode

AI:  add-dark-mode hervatten...
     Verdergaan bij taak 2.3: Header bijwerken...
```

**Het beste voor:** Parallelle werkstromen, urgente onderbrekingen, teamwerk.

Wanneer je meerdere voltooide wijzigingen hebt, gebruik `/opsx:bulk-archive`:

```text
Jij: /opsx:bulk-archive

AI:  3 voltooide wijzigingen gevonden:
     - add-dark-mode (alle taken klaar)
     - fix-login-redirect (alle taken klaar)
     - update-footer (alle taken klaar)

     Controleren op spec-conflicten...
     ⚠ add-dark-mode en update-footer beide raken specs/ui/

     Codebase inspecteren om op te lossen...
     Beide wijzigingen zijn geïmplementeerd. Worden in chronologische volgorde toegepast.

     Alle 3 wijzigingen archiveren?

Jij: Ja

AI:  ✓ add-dark-mode gearchiveerd
     ✓ fix-login-redirect gearchiveerd
     ✓ update-footer gearchiveerd
     Specs samengevoegd in volgorde: add-dark-mode → update-footer
```

Bulk archive detecteert wanneer meerdere wijzigingen dezelfde specs raken en lost conflicten op door te controleren wat daadwerkelijk is geïmplementeerd.

### Een Wijziging Voltooien

De aanbevolen voltooiingsflow:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              valideert          vraagt om sync
              implementatie      indien nodig
```

#### Verifieer: Controleer Je Werk

`/opsx:verify` valideert implementatie tegen je artefacten over drie dimensies:

```text
Jij: /opsx:verify

AI:  add-auth verifiëren...

     VOLLEDIGHEID
     ✓ Alle 12 taken in tasks.md zijn afgevinkt
     ✓ Alle vereisten in specs hebben bijbehorende code
     ⚠ Scenario "Sessie-timeout na inactiviteit" niet getest

     CORRECTHEID
     ✓ Implementatie komt overeen met spec-intentie
     ✓ Edge cases van scenario's zijn afgehandeld
     ✓ Foutstatussen komen overeen met spec-definities

     COHENTIE
     ✓ Ontwerpbeslissingen weerspiegeld in codestructuur
     ✓ Naamgevingsconsequenties consistent met design.md
     ◇ Design vermeldt "event-driven" maar implementatie gebruikt polling

     SAMENVATTING
     ─────────────────────────────
     Kritieke problemen: 0
     Waarschuwingen: 2
     Klaar om te archiveren: Ja (met waarschuwingen)

     Aanbevelingen:
     1. Voeg test toe voor sessie-timeout scenario
     2. Overweeg refactoring naar event-driven zoals ontworpen, of werk design.md bij
```

**Wat verify controleert:**

| Dimensie | Wat het valideert |
|-----------|------------------|
| Volledigheid | Alle taken klaar, alle vereisten geïmplementeerd, scenario's gedekt |
| Correctheid | Implementatie komt overeen met spec-intentie, edge cases afgehandeld |
| Coherentie | Ontwerpbeslissingen weerspiegeld in code, patronen consistent |

Verify blokkeert archiveren niet, maar brengt problemen aan het licht die je mogelijk eerst wilt aanpakken.

#### Archiveer: De Wijziging Voltooien

`/opsx:archive` voltooit de wijziging en verplaatst deze naar het archief:

```text
Jij: /opsx:archive

AI:  add-auth archiveren...

     Artefactstatus:
     ✓ proposal.md bestaat
     ✓ specs/ bestaat
     ✓ design.md bestaat
     ✓ tasks.md bestaat (12/12 taken voltooid)

     Delta specs: Nog niet gesynchroniseerd naar main
     → Wil je nu synchroniseren?

Jij: Ja

AI:  ✓ Specs gesynchroniseerd naar openspec/specs/auth/spec.md
     ✓ Verplaatst naar openspec/changes/archive/2025-01-24-add-auth/

     Wijziging succesvol gearchiveerd.
```

Archiveer zal vragen als specs niet zijn gesynchroniseerd. Het blokkeert niet bij onvoltooide taken, maar zal je waarschuwen.

## Wanneer Wat Gebruiken

### `/opsx:ff` vs `/opsx:continue`

| Situatie | Gebruik |
|-----------|-----|
| Duidelijke vereisten, klaar om te bouwen | `/opsx:ff` |
| Verkent, wil elke stap beoordelen | `/opsx:continue` |
| Wil itereren op proposal vóór specs | `/opsx:continue` |
| Tijdsdruk, moet snel gaan | `/opsx:ff` |
| Complexe wijziging, wil controle | `/opsx:continue` |

**Vuistregel:** Als je het volledige toepassingsgebied vooruit kunt beschrijven, gebruik `/opsx:ff`. Als je het onderweg uitvindt, gebruik `/opsx:continue`.

### Wanneer Bijwerken vs Nieuw Beginnen

Een veelgestelde vraag: wanneer is het bijwerken van een bestaande wijziging oké, en wanneer moet je een nieuwe beginnen?

**Werk de bestaande wijziging bij wanneer:**

- Zelfde intentie, verfijnde uitvoering
- Toepassingsgebied versmalt (MVP eerst, rest later)
- Leergecorrecties (codebase is niet wat je verwachtte)
- Ontwerpassingen op basis van implementatie-ontdekkingen

**Begin een nieuwe wijziging wanneer:**

- Intentie fundamenteel veranderd
- Toepassingsgebied explodeerde naar heel ander werk
- Originele wijziging kan als "klaar" worden gemarkeerd
- Patches zouden meer verwarren dan verduidelijken

```text
                     ┌─────────────────────────────────────┐
                     │     Is dit hetzelfde werk?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Zelfde intentie?    >50% overlap?      Kan origineel
          Zelfde probleem?    Zelfde scope?      "klaar" zonder
                 │                  │          deze wijzigingen?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      JA               NEE  JA           NEE  NEE              JA
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    BIJWERKEN         NIEUW  BIJWERKEN    NIEUW  BIJWERKEN      NIEUW
```

**Voorbeeld: "Dark mode toevoegen"**

- "Moet ook aangepaste thema's ondersteunen" → Nieuwe wijziging (toepassingsgebied geëxplodeerd)
- "Systeemvoorkeursdetectie is moeilijker dan verwacht" → Bijwerken (zelfde intentie)
- "Laten we eerst schakelaar leveren, later voorkeuren toevoegen" → Bijwerken dan archiveren, dan nieuwe wijziging

## Beste Praktijken

### Houd Wijzigingen Gericht

Eén logische werkeenheid per wijziging. Als je "functie X toevoegen en ook Y refactort" doet, overweeg dan twee aparte wijzigingen.

**Waarom het ertoe doet:**
- Makkelijker te beoordelen en te begrijpen
- Schoner archiefgeschiedenis
- Kunnen onafhankelijk worden opgeleverd
- Eenvoudiger terugdraaien indien nodig

### Gebruik `/opsx:explore` voor Onduidelijke Vereisten

Voordat je je vastlegt op een wijziging, verkennen je de probleemruimte:

```text
Jij: /opsx:explore

AI:  Wat zou je willen verkennen?

Jij: Hoe moeten we rate limiting voor onze API aanpakken?

AI:  Laat me je huidige setup en opties onderzoeken...
     [Onderzoekt codebase, overweegt patronen]

     Ik zie drie benaderingen die we zouden kunnen nemen:
     1. Middleware-gebaseerd (eenvoudig, per-endpoint)
     2. Redis-ondersteund (schaalbaar, gedeelde staat)
     3. Token bucket per gebruiker (eerlijk, complex)

     Je huidige stack suggereert #1 of #2. Wat is je schaal?
```

Verkenning verheldert het denken voordat je artefacten aanmaakt.

### Verifieer Vóór Archiveren

Gebruik `/opsx:verify` om te controleren of implementatie overeenkomt met artefacten:

```text
Jij: /opsx:verify

AI:  add-dark-mode verifiëren...

     ✓ Alle taken in tasks.md zijn afgevinkt
     ✓ Vereisten in specs hebben bijbehorende code
     ✓ Ontwerpbeslissingen zijn weerspiegeld in implementatie

     Klaar om te archiveren!
```

Vangt discrepanties op voordat je de wijziging afsluit.

### Benoem Wijzigingen Duidelijk

Goede namen maken `openspec list` bruikbaar:

```text
Goed:                          Vermijd:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Snelle referentie voor opdrachten

Voor volledige opdrachtdetails en opties, zie [Opdrachten](commands.md).

| Opdracht | Doel | Wanneer te gebruiken |
|---------|---------|-------------|
| `/opsx:propose` | Maak wijziging + planningartefacten | Snelle standaardpad (`core` profiel) |
| `/opsx:explore` | Denk na over ideeën met de AI | Begin hier als je onzeker bent: onduidelijke vereisten, onderzoek, opties vergelijken |
| `/opsx:new` | Start een wijzigingsraamwerk | Uitgebreide modus, expliciete artefactbeheer |
| `/opsx:continue` | Maak volgende artefact | Uitgebreide modus, stap-voor-stap artefactcreatie |
| `/opsx:ff` | Maak alle planningartefacten | Uitgebreide modus, duidelijk scope |
| `/opsx:apply` | Implementeer taken | Klaar om code te schrijven |
| `/opsx:verify` | Valideer implementatie | Uitgebreide modus, voor archivering |
| `/opsx:sync` | Voeg delta-specificaties samen | Uitgebreide modus, optioneel |
| `/opsx:archive` | Voltooi de wijziging | Alle werk is klaar |
| `/opsx:bulk-archive` | Archiveer meerdere wijzigingen | Uitgebreide modus, parallel werk |

## Volgende stappen

- [Goede specificaties schrijven](writing-specs.md) - Wat een sterke vereiste en scenario zijn, en hoe u een wijziging de juiste grootte geeft
- [Een wijziging reviewen](reviewing-changes.md) - De twee-minutencontrole op een ontwerpplan voordat er code wordt geschreven
- [OpenSpec in een team](team-workflow.md) - Hoe wijzigingen passen bij branches en pull requests
- [Opdrachten](commands.md) - Volledige opdrachtreferentie met opties
- [Concepten](concepts.md) - Diepte duik in specificaties, artefacten en schema's
- [Aanpassing](customization.md) - Maak aangepaste werkstromen