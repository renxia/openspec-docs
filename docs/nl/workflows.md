# Werkstromen

Deze handleiding behandelt gangbare workflowpatronen voor OpenSpec en wanneer elk ervan te gebruiken. Voor de basisinstelling zie [Getting Started](getting-started.md). Voor een referentie van commando's zie [Commands](commands.md).

## Filosofie: Acties, Geen Fasen

Traditionele werkstromen dwingen je door fasen: plannen, dan implementatie, dan voltooid. Maar echt werk past niet netjes in hokjes.

OPSX hanteert een andere aanpak:

```text
Traditional (phase-locked):

  PLANNING ────────► IMPLEMENTING ────────► DONE
      │                    │
      │   "Can't go back"  │
      └────────────────────┘

OPSX (fluid actions):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Kernprincipes:**

- **Acties, geen fasen** - Commando's zijn dingen die je kunt doen, geen stadia waarin je vastzit.
- **Afhankelijkheden zijn mogelijkmakers** - Ze tonen wat mogelijk is, niet wat er vervolgens vereist is.

> **Aanpassing (Customization):** OPSX werkstromen worden aangedreven door schema's die artefactreeks definiëren. Zie [Customization](customization.md) voor details over het maken van aangepaste schema's.

## Twee Modi

### Standaard Snelpad (`core` profiel)

Nieuwe installaties zijn standaard ingesteld op `core`, wat het volgende biedt:
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Typische stroom:

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (optioneel)
```

#### Begin met verkennen (de gewoonte die je moet aanleren)

`/opsx:explore` is onderdeel van het standaardprofiel, geen geavanceerde aanvulling. Het is de stap die je moet zetten wanneer je een probleem hebt maar nog geen plan, wat in de meeste gevallen zo is.

```text
Jij: /opsx:explore

AI:  Wat wilt u verkennen?

Jij: Onze zoekresultaten voelen stagnerend aan. Ik weet niet of het caching,
     indexering of de query zelf is.

AI:  Laat me kijken... [leest de zoekservice en cachelaag]
     Het is de index: deze wordt alleen nachtelijk opnieuw opgebouwd, dus wijzigingen
     verschijnen pas de volgende dag. Twee opties: rebuild-on-write (eenvoudig,
     meer belasting) of een korte TTL cache-invalidatie (meer onderdelen, minder belasting). Gezien uw schrijfvolume is rebuild-on-write de schonere oplossing. Wilt u het omvatten?

Jij: Ja.

Jij: /opsx:propose rebuild-search-index-on-write
```

Verkennen creëert geen artefacten en schrijft geen code. Het is een gratis, risicovrije conversatie die een vage zorg omzet in een precieze wijziging, waardoor het daaropvolgende voorstel scherp is. Weet u al precies wat u wilt? Sla het over en ga rechtstreeks naar `/opsx:propose`. Volledige gids: [Explore First](explore.md).

### Uitgebreide/Volledige Werkstroom (op maat gemaakte selectie)

Als u expliciete scaffold-en-build commando's wilt (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), activeer deze dan met:

```bash
openspec config profile
openspec update
```

## Werkpatronen (Uitgebreide Modus)

### Snelle Functie

Wanneer u weet wat u wilt bouwen en alleen de uitvoering moet verzorgen:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Voorbeeldconversatie:**

```text
Jij: /opsx:new add-logout-button

AI:  Heeft openspec/changes/add-logout-button/ aangemaakt
     Klaar om te creëren: voorstel

Jij: /opsx:ff

AI:  Creëert alle planningsartefacten...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Klaar voor implementatie!

Jij: /opsx:apply

AI:  Werk aan de taken...
     ✓ Logout-knop toegevoegd aan header
     ✓ Sessie wissen geïmplementeerd
     ✓ Bevestigingsdialoog toegevoegd
     Alle taken voltooid!

Jij: /opsx:archive

AI:  ✓ Specs samengevoegd
     ✓ Wijziging gearchiveerd
```

**Beste voor:** Kleine tot middelgrote functies, bugfixes, eenvoudige wijzigingen.

### Verkennend

Wanneer de vereisten onduidelijk zijn of u eerst wilt onderzoeken:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Voorbeeldconversatie:**

```text
Jij: /opsx:explore

AI:  Wat wilt u verkennen?

Jij: Ik wil de paginalaadtijd verbeteren, maar ik weet niet
     waar de knelpunten liggen.

AI:  Laat me helpen onderzoeken...
     [Analyseert bundlegroottes, identificeert trage queries, beoordeelt component render-patronen]

     Ik heb drie hoofdknelpunten gevonden:
     1. Grote ongeoptimaliseerde afbeeldingen
     2. Synchrone data-ophaalacties in ProductList
     3. Her-renders door contextwijzigingen

     Welk wilt u eerst aanpakken?

Jij: Laten we het probleem met de data-ophaalactie aanpakken.

Jij: /opsx:new optimize-product-list-fetching

AI:  Heeft wijziging aangemaakt. Klaar om te creëren: voorstel

Jij: /opsx:continue

AI:  Creëert voorstel op basis van ons onderzoek...
     [Schrijft voorstel met onderzoeksinzichten]

     Klaar om te creëren: specs, design
     Welke wilt u nu?

Jij: /opsx:continue

AI:  Creëert specs...
```

**Beste voor:** Prestatieoptimalisatie, debugging, architectonische beslissingen, onduidelijke vereisten.

### Parallelle Wijzigingen

Werk aan meerdere wijzigingen tegelijk:

```text
Wijziging A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in uitvoering)
                                         │
                                    context switch
                                         │
Wijziging B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Voorbeeldconversatie:**

```text
Jij: Ik werk aan add-dark-mode maar ben afgehaakt voor een bugfix

Jij: /opsx:new fix-login-redirect

AI:  Heeft openspec/changes/fix-login-redirect/ aangemaakt

Jij: /opsx:ff

AI:  ✓ Planningsartefacten gecreëerd

Jij: /opsx:apply

AI:  Werk aan fix-login-redirect...
     [Implementeert de fix]
     Alle taken voltooid!

Jij: /opsx:archive

AI:  ✓ fix-login-redirect gearchiveerd

Jij: Laten we teruggaan naar dark mode

Jij: /opsx:apply add-dark-mode

AI:  Vervolg van add-dark-mode...
     Pakt op bij taak 2.3: Update Header...
```

**Beste voor:** Parallelle werkstromen, dringende onderbrekingen, teamcollaboratie.

Wanneer u meerdere voltooide wijzigingen heeft, gebruik dan `/opsx:bulk-archive`:

```text
Jij: /opsx:bulk-archive

AI:  Gevonden 3 voltooide wijzigingen:
     - add-dark-mode (alle taken voltooid)
     - fix-login-redirect (alle taken voltooid)
     - update-footer (alle taken voltooid)

     Controle op spec-conflicten...
     ⚠ add-dark-mode en update-footer raken beide specs/ui/ aan

     Inspecteert codebase om dit op te lossen...
     Beide wijzigingen zijn geïmplementeerd. Zal in chronologische volgorde worden toegepast.

     Archiveer alle 3 wijzigingen?

Jij: Ja

AI:  ✓ add-dark-mode gearchiveerd
     ✓ fix-login-redirect gearchiveerd
     ✓ update-footer gearchiveerd
     Specs samengevoegd in de juiste volgorde: add-dark-mode → update-footer
```

Bulk archive detecteert wanneer meerdere wijzigingen dezelfde specs aanraken en lost conflicten op door te controleren wat er daadwerkelijk is geïmplementeerd.

### Een Wijziging Voltooien

De aanbevolen voltooiingsstroom:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              valideert          vraagt om synchronisatie
              implementatie     indien nodig
```

#### Verifiëren: Controleer je Werk

`/opsx:verify` valideert de implementatie tegen uw artefacten op drie dimensies:

```text
Jij: /opsx:verify

AI:  Verifieert add-auth...

     VOLTOOIDHEID
     ✓ Alle 12 taken in tasks.md zijn gecontroleerd
     ✓ Alle vereisten in specs hebben corresponderende code
     ⚠ Scenario "Sessie verloopt na inactiviteit" is niet getest

     CORRECTNESS (WAARHEIDIGHEID)
     ✓ Implementatie komt overeen met de intentie van de specificatie
     ✓ Randgevallen uit scenario's zijn afgehandeld
     ✓ Fouttoestanden komen overeen met de specificatiedefinitiesaties

     COHERENCE (GEPASTHEID)
     ✓ Ontwerpbeslissingen weerspiegeld in de code-structuur
     ✓ Naamgevingsconventies consistent met design.md
     ⚠ Design vermeldt "event-driven" maar de implementatie gebruikt polling

     SAMENVATTING
     ─────────────────────────────
     Kritieke problemen: 0
     Waarschuwingen: 2
     Klaar om te archiveren: Ja (met waarschuwingen)

     Aanbevelingen:
     1. Voeg test toe voor het sessie-timeoutscenario
     2. Overweeg refactoring naar event-driven zoals ontworpen, of update design.md
```

**Wat verifiëren controleert:**

| Dimensie | Wat het valideert |
|-----------|------------------|
| Voltooidheid | Alle taken zijn voltooid, alle vereisten zijn geïmplementeerd, scenario's zijn gedekt |
| Correctness (Waarachtigheid) | Implementatie komt overeen met de intentie van de specificatie, randgevallen zijn afgehandeld |
| Coherence (Gepastheid) | Ontwerpbeslissingen worden weerspiegeld in de code, patronen zijn consistent |

Verifiëren blokkeert het archiveren niet, maar het brengt problemen naar boven die u eerst wilt aanpakken.

#### Archiveren: Voltooi de Wijziging

`/opsx:archive` voltooit de wijziging en verplaatst deze naar het archief:

```text
Jij: /opsx:archive

AI:  Archiveert add-auth...

     Artefactstatus:
     ✓ proposal.md bestaat
     ✓ specs/ bestaat
     ✓ design.md bestaat
     ✓ tasks.md bestaat (12/12 taken voltooid)

     Delta specs: Nog niet gesynchroniseerd met de hoofdversie
     → Wilt u nu synchroniseren?

Jij: Ja

AI:  ✓ Specs gesynchroniseerd naar openspec/specs/auth/spec.md
     ✓ Verplaatst naar openspec/changes/archive/2025-01-24-add-auth/

     Wijziging succesvol gearchiveerd.
```

Archiveren zal vragen als de specs niet zijn gesynchroniseerd. Het blokkeert op onvoltooide taken, maar het waarschuwt u.

## Wanneer Welke te Gebruiken

### `/opsx:ff` versus `/opsx:continue`

| Situatie | Gebruik |
|-----------|-----|
| Duidelijke vereisten, klaar om te bouwen | `/opsx:ff` |
| Verkennen, wilt elke stap beoordelen | `/opsx:continue` |
| Wilt itereren op het voorstel voordat de specs er zijn | `/opsx:continue` |
| Tijdsdruk, moet snel doorgaan | `/opsx:ff` |
| Complexe wijziging, wil controle | `/opsx:continue` |

**Vuistregel:** Als u vooraf de volledige omvang kunt beschrijven, gebruik dan `/opsx:ff`. Als u het aan het lopen uitvindt, gebruikt u `/opsx:continue`.

### Wanneer Updaten versus Nieuw Beginnen

Een veelgestelde vraag: wanneer is het goed om een bestaande wijziging te updaten en wanneer moet u een nieuwe starten?

**Update de bestaande wijziging wanneer:**

- Dezelfde intentie, verfijnde uitvoering
- Omvang wordt smaller (MVP eerst, rest later)
- Correcties op basis van leren (de codebase is niet wat u verwachtte)
- Ontwerpaanpassingen op basis van implementatiedisontdekkingen

**Start een nieuwe wijziging wanneer:**

- De intentie fundamenteel is veranderd
- Het omvang is geëxplodeerd naar geheel andere werkzaamheden
- De oorspronkelijke wijziging kan als "klaar" worden gemarkeerd, los van deze wijzigingen
- Patches meer verwarring veroorzaken dan duidelijkheid

```text
                     ┌─────────────────────────────────────┐
                     │     Is dit hetzelfde werk?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Derselfde intentie?      >50% overlap?      Kan de oorspronkelijke
          Derselfde probleem?     Derselfde omvang?        wijzigingen "klaar" zijn zonder
                 │                  │          deze wijzigingen?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      JA               NEE JA           NEE  NEE              JA
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    UPDATE            NIEUW  UPDATE       NIEUW  UPDATE          NIEUW
```

**Voorbeeld: "Voeg donkere modus toe"**

- "We moeten ook ondersteuning voor aangepaste thema's hebben" → Nieuwe wijziging (omvang is geëxplodeerd)
- "Het detecteren van systeemvoorkeuren is moeilijker dan verwacht" → Update (dezelfde intentie)
- "Laten we eerst de toggle uitbrengen, en daarna de voorkeuren toevoegen" → Update en vervolgens archiveren, dan een nieuwe wijziging

## Best Practices

### Houd Wijzigingen Gericht

Eén logische werkseenheid per wijziging. Als u "functie X toevoegen én Y refactoren" doet, overweeg dan twee aparte wijzigingen.

**Waarom dit belangrijk is:**
- Makkelijker te beoordelen en te begrijpen
- Schoon archiefgeschiedenis
- Kan onafhankelijk worden uitgebracht
- Simpelere rollback indien nodig

### Gebruik `/opsx:explore` voor Onduidelijke Eisen

Voordat u een wijziging vastlegt, verkennen de probleemruimte:

```text
Jij: /opsx:explore

AI:  Wat wilt u verkennen?

Jij: Hoe moeten we rate limiting aanpakken voor onze API?

AI:  Laat me uw huidige setup en opties onderzoeken...
     [Onderzoekt codebase, overweegt patronen]

     Ik zie drie benaderingen die we kunnen nemen:
     1. Middleware-gebaseerd (eenvoudig, per endpoint)
     2. Redis-ondersteund (schaalbaar, gedeelde staat)
     3. Token bucket per gebruiker (eerlijk, complex)

     Uw huidige stack suggereert #1 of #2. Wat is uw schaal?
```

Verkenning maakt het denken duidelijk voordat u artefacten creëert.

### Verifieer Vóór het Archiveren

Gebruik `/opsx:verify` om te controleren of de implementatie overeenkomt met de artefacten:

```text
Jij: /opsx:verify

AI:  Verifieert add-dark-mode...

     ✓ Alle taken in tasks.md zijn gecontroleerd
     ✓ Vereisten in specs hebben corresponderende code
     ✓ Ontwerpbeslissingen worden weerspiegeld in de implementatie

     Klaar om te archiveren!
```

Dit vangt mismatches op voordat u de wijziging afsluit.

### Benoem Wijzigingen Duidelijk

Goede namen maken `openspec list` bruikbaar:

```text
Goed:                          Vermijd:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Snelle Referentie van Commando's

Voor volledige commando-details en opties, zie [Commands](commands.md).

| Command | Doel | Wanneer te Gebruiken |
|---------|---------|-------------|
| `/opsx:propose` | Creëer wijziging + planningsartefacten | Snelle standaardroute (`core` profiel) |
| `/opsx:explore` | Verken ideeën met de AI | Begin hier bij onzekerheid: onduidelijke vereisten, onderzoek, het vergelijken van opties |
| `/opsx:new` | Start een wijzigingsskelet | Uitgebreide modus, expliciete artefactcontrole |
| `/opsx:continue` | Creëer het volgende artefact | Uitgebreide modus, stapsgewijze creatie van artefacten |
| `/opsx:ff` | Creëer alle planningsartefacten | Uitgebreide modus, duidelijk scope |
| `/opsx:apply` | Implementeer taken | Klaar om code te schrijven |
| `/opsx:verify` | Valideer implementatie | Uitgebreide modus, voor het archiveren |
| `/opsx:sync` | Voegen delta-specificaties samen | Uitgebreide modus, optioneel |
| `/opsx:archive` | Voltooi de wijziging | Al het werk is voltooid |
| `/opsx:bulk-archive` | Archiveer meerdere wijzigingen | Uitgebreide modus, parallelle werking |

## Volgende Stappen

- [Commands](commands.md) - Volledige referentie van commando's met opties
- [Concepts](concepts.md) - Gedetailleerd overzicht van specificaties, artefacten en schema's
- [Customization](customization.md) - Creëer aangepaste workflows