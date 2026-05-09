# Workflows

Deze gids behandelt veelvoorkomende workflowpatronen voor OpenSpec en wanneer je elk patroon kunt gebruiken. Voor de basisconfiguratie, zie [Aan de slag](getting-started.md). Voor de commandoreferentie, zie [Commando's](commands.md).

## Filosofie: Acties, Niet Fasen

Traditionele workflows dwingen je door fasen: plannen, dan implementeren, dan klaar. Maar echt werk past niet netjes in hokjes.

OPSX hanteert een andere aanpak:

```text
Traditioneel (fasen-gebonden):

  PLANNEN ────────► IMPLEMENTEREN ────────► KLAAR
      │                    │
      │   "Kan niet terug" │
      └────────────────────┘

OPSX (vloeiende acties):

  voorstel ──► specificaties ──► ontwerp ──► taken ──► implementeren
```

**Kernprincipes:**

- **Acties, niet fasen** - Commando's zijn dingen die je kunt doen, geen stadia waarin je vastzit
- **Afhankelijkheden zijn mogelijkmakers** - Ze tonen wat mogelijk is, niet wat als volgende vereist is

> **Aanpassing:** OPSX-workflows worden aangestuurd door schema's die artefactvolgordes definiëren. Zie [Aanpassing](customization.md) voor details over het maken van aangepaste schema's.

## Twee Modi

### Standaard Snel Pad (`core` profiel)

Nieuwe installaties standaard naar `core`, wat het volgende biedt:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Typische flow:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

### Uitgebreide/Volledige Workflow (aangepaste selectie)

Als je expliciete scaffold-en-build commando's wilt (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), schakel ze dan in met:

```bash
openspec config profile
openspec update
```

## Workflow Patronen (Uitgebreide Modus)

### Snelle Feature

Wanneer je weet wat je wilt bouwen en alleen hoeft uit te voeren:

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

AI:  Taken uitvoeren...
     ✓ Uitlogknop toegevoegd aan header
     ✓ Sessie-opruiming geïmplementeerd
     ✓ Bevestigingsdialoog toegevoegd
     Alle taken voltooid!

Jij: /opsx:archive

AI:  ✓ Specificaties samengevoegd
     ✓ Wijziging gearchiveerd
```

**Het meest geschikt voor:** Kleine tot middelgrote features, bugfixes, eenvoudige wijzigingen.

### Verkennend

Wanneer de vereisten onduidelijk zijn of je eerst moet onderzoeken:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Voorbeeldgesprek:**

```text
Jij: /opsx:explore

AI:  Wat wil je verkennen?

Jij: Ik wil de laadprestaties van pagina's verbeteren, maar ik weet niet waar de knelpunten zitten.

AI:  Laat me helpen onderzoeken...
     [Analyseert bundelgroottes, identificeert trage queries, beoordeelt
     component-renderpatronen]

     Ik heb drie hoofdknelpunten gevonden:
     1. Grote niet-geoptimaliseerde afbeeldingen
     2. Synchrone data-ophaling in ProductList
     3. Hertekeningen door contextwijzigingen

     Welke wil je eerst aanpakken?

Jij: Laten we het data-ophalingsprobleem aanpakken.

Jij: /opsx:new optimize-product-list-fetching

AI:  Wijziging aangemaakt. Klaar om te creëren: proposal

Jij: /opsx:continue

AI:  Proposal aanmaken op basis van onze verkenning...
     [Schrijft proposal met inzichten uit het onderzoek]

     Klaar om te creëren: specs, design
     Welke wil je hierna?

Jij: /opsx:continue

AI:  Specificaties aanmaken...
```

**Het meest geschikt voor:** Prestatieoptimalisatie, debugging, architectuurbeslissingen, onduidelijke vereisten.

### Parallelle Wijzigingen

Werk aan meerdere wijzigingen tegelijk:

```text
Wijziging A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in uitvoering)
                                         │
                                    context switch
                                         │
Wijziging B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Voorbeeldgesprek:**

```text
Jij: Ik werk aan add-dark-mode maar ben gestoord door een bugfix

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

Jij: Laten we teruggaan naar dark mode

Jij: /opsx:apply add-dark-mode

AI:  add-dark-mode hervatten...
     Verder bij taak 2.3: Header bijwerken...
```

**Het meest geschikt voor:** Parallelle werkstromen, urgente onderbrekingen, teamsamenwerking.

Wanneer je meerdere voltooide wijzigingen hebt, gebruik `/opsx:bulk-archive`:

```text
Jij: /opsx:bulk-archive

AI:  3 voltooide wijzigingen gevonden:
     - add-dark-mode (alle taken gedaan)
     - fix-login-redirect (alle taken gedaan)
     - update-footer (alle taken gedaan)

     Controleren op specificatieconflicten...
     ⚠ add-dark-mode en update-footer raken beide specs/ui/

     Codebase inspecteren om op te lossen...
     Beide wijzigingen zijn geïmplementeerd. Wordt in chronologische volgorde toegepast.

     Alle 3 wijzigingen archiveren?

Jij: Ja

AI:  ✓ add-dark-mode gearchiveerd
     ✓ fix-login-redirect gearchiveerd
     ✓ update-footer gearchiveerd
     Specificaties samengevoegd in volgorde: add-dark-mode → update-footer
```

Bulk archive detecteert wanneer meerdere wijzigingen dezelfde specificaties raken en lost conflicten op door te controleren wat daadwerkelijk is geïmplementeerd.

### Een Wijziging Voltooien

De aanbevolen voltooiingsflow:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              valideert          vraagt om te synchroniseren
              implementatie      indien nodig
```

#### Verify: Controleer Je Werk

`/opsx:verify` valideert de implementatie tegen je artefacten op drie dimensies:

```text
Jij: /opsx:verify

AI:  add-auth verifiëren...

     VOLLEDIGHEID
     ✓ Alle 12 taken in tasks.md zijn afgevinkt
     ✓ Alle vereisten in specificaties hebben overeenkomstige code
     ⚠ Scenario "Sessie-timeout na inactiviteit" niet getest

     JUISTHEID
     ✓ Implementatie komt overeen met specificatie-intentie
     ✓ Randgevallen uit scenario's worden afgehandeld
     ✓ Foutstatussen komen overeen met specificatiedefinities

     SAMENHANG
     ✓ Ontwerpbeslissingen weerspiegeld in codestructuur
     ✓ Naamgevingsconventies consistent met design.md
     ⚠ Ontwerp vermeldt "event-driven" maar implementatie gebruikt polling

     SAMENVATTING
     ─────────────────────────────
     Kritieke problemen: 0
     Waarschuwingen: 2
     Klaar om te archiveren: Ja (met waarschuwingen)

     Aanbevelingen:
     1. Test toevoegen voor sessie-timeout-scenario
     2. Overweeg refactoren naar event-driven zoals ontworpen, of werk design.md bij
```

**Wat verify controleert:**

| Dimensie | Wat het valideert |
|----------|-------------------|
| Volledigheid | Alle taken gedaan, alle vereisten geïmplementeerd, scenario's afgedekt |
| Juistheid | Implementatie komt overeen met specificatie-intentie, randgevallen afgehandeld |
| Samenhang | Ontwerpbeslissingen weerspiegeld in code, patronen consistent |

Verify blokkeert het archiveren niet, maar het brengt problemen aan het licht die je misschien eerst wilt aanpakken.

#### Archive: De Wijziging Afronden

`/opsx:archive` voltooit de wijziging en verplaatst deze naar het archief:

```text
Jij: /opsx:archive

AI:  add-auth archiveren...

     Artefactstatus:
     ✓ proposal.md bestaat
     ✓ specs/ bestaat
     ✓ design.md bestaat
     ✓ tasks.md bestaat (12/12 taken voltooid)

     Delta-specificaties: Nog niet gesynchroniseerd naar main
     → Wil je nu synchroniseren?

Jij: Ja

AI:  ✓ Specificaties gesynchroniseerd naar openspec/specs/auth/spec.md
     ✓ Verplaatst naar openspec/changes/archive/2025-01-24-add-auth/

     Wijziging succesvol gearchiveerd.
```

Archive vraagt of specificaties niet zijn gesynchroniseerd. Het blokkeert niet bij onvoltooide taken, maar het waarschuwt je.

## Wanneer Wat Gebruiken

### `/opsx:ff` vs `/opsx:continue`

| Situatie | Gebruik |
|----------|---------|
| Duidelijke vereisten, klaar om te bouwen | `/opsx:ff` |
| Verkennen, elke stap willen beoordelen | `/opsx:continue` |
| Willen itereren op proposal voor specificaties | `/opsx:continue` |
| Tijdsdruk, snel moeten bewegen | `/opsx:ff` |
| Complexe wijziging, controle willen | `/opsx:continue` |

**Vuistregel:** Als je de volledige scope vooraf kunt beschrijven, gebruik `/opsx:ff`. Als je het onderweg uitvogelt, gebruik `/opsx:continue`.

### Wanneer Bijwerken vs Opnieuw Beginnen

Een veelgestelde vraag: wanneer is het ok om een bestaande wijziging bij te werken, en wanneer moet je een nieuwe beginnen?

**Werk de bestaande wijziging bij wanneer:**

- Dezelfde intentie, verfijnde uitvoering
- Scope smaller wordt (eerst MVP, de rest later)
- Leergestuurde correcties (codebase is niet wat je verwachtte)
- Ontwerpaanpassingen op basis van implementatie-ontdekkingen

**Begin een nieuwe wijziging wanneer:**

- Intentie fundamenteel veranderd is
- Scope is geëxplodeerd naar totaal ander werk
- Originele wijziging als "klaar" kan worden gemarkeerd zonder deze veranderingen
- Patches meer zouden verwarren dan verduidelijken

```text
                     ┌─────────────────────────────────────┐
                     │     Is dit hetzelfde werk?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Zelfde intentie?  >50% overlap?      Kan origineel
          Zelfde probleem?  Zelfde scope?      "klaar" zijn zonder
                 │                  │          deze veranderingen?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      JA                NEE JA           NEE NEE             JA
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    BIJWERKEN         NIEUW BIJWERKEN   NIEUW BIJWERKEN      NIEUW
```

**Voorbeeld: "Dark mode toevoegen"**

- "Moet ook aangepaste thema's ondersteunen" → Nieuwe wijziging (scope geëxplodeerd)
- "Systeemvoorkeurdetectie is moeilijker dan verwacht" → Bijwerken (zelfde intentie)
- "Laten we eerst de schakelaar uitbrengen, voorkeuren later" → Bijwerken, dan archiveren, dan nieuwe wijziging

## Best Practices

### Houd Wijzigingen Gefocust

Een logische werkeenheid per wijziging. Als je "feature X toevoegen en ook Y refactoren" doet, overweeg twee aparte wijzigingen.

**Waarom het belangrijk is:**
- Gemakkelijker te beoordelen en begrijpen
- Schoner archiefgeschiedenis
- Kan onafhankelijk worden uitgerold
- Eenvoudiger terug te draaien indien nodig

### Gebruik `/opsx:explore` voor Onduidelijke Vereisten

Voordat je je vastlegt op een wijziging, verken het probleemgebied:

```text
Jij: /opsx:explore

AI:  Wat wil je verkennen?

Jij: Hoe moeten we rate limiting voor onze API afhandelen?

AI:  Laat me je huidige setup en opties onderzoeken...
     [Onderzoekt codebase, overweegt patronen]

     Ik zie drie benaderingen die we kunnen nemen:
     1. Middleware-gebaseerd (eenvoudig, per endpoint)
     2. Redis-ondersteund (schaalbaar, gedeelde staat)
     3. Token bucket per gebruiker (eerlijk, complex)

     Je huidige stack suggereert #1 of #2. Wat is je schaal?
```

Verkenning verheldert het denken voordat je artefacten aanmaakt.

### Verifiëren voor Archiveren

Gebruik `/opsx:verify` om te controleren of de implementatie overeenkomt met artefacten:

```text
Jij: /opsx:verify

AI:  add-dark-mode verifiëren...

     ✓ Alle taken in tasks.md zijn afgevinkt
     ✓ Vereisten in specificaties hebben overeenkomstige code
     ✓ Ontwerpbeslissingen zijn weerspiegeld in implementatie

     Klaar om te archiveren!
```

Vangt mismatches op voordat je de wijziging afsluit.

### Geef Wijzigingen Duidelijke Namen

Goede namen maken `openspec list` bruikbaar:

```text
Goed:                          Vermijd:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Commando Snelreferentie

Voor volledige commandodetails en opties, zie [Commando's](commands.md).

| Commando | Doel | Wanneer te gebruiken |
|----------|------|----------------------|
| `/opsx:propose` | Maak wijzigingsvoorstel + planningartefacten | Snelle standaardroute (`core` profiel) |
| `/opsx:explore` | Ideeën doorgronden | Onheldere vereisten, onderzoek |
| `/opsx:new` | Start een wijzigingsscaffold | Uitgebreide modus, expliciete artefactcontrole |
| `/opsx:continue` | Maak het volgende artefact | Uitgebreide modus, stapsgewijze artefactcreatie |
| `/opsx:ff` | Maak alle planningartefacten | Uitgebreide modus, duidelijke scope |
| `/opsx:apply` | Implementeer taken | Klaar om code te schrijven |
| `/opsx:verify` | Valideer implementatie | Uitgebreide modus, vóór archivering |
| `/opsx:sync` | Voeg delta-specificaties samen | Uitgebreide modus, optioneel |
| `/opsx:archive` | Rond de wijziging af | Al het werk is voltooid |
| `/opsx:bulk-archive` | Archiveer meerdere wijzigingen | Uitgebreide modus, parallel werk |

## Volgende Stappen

- [Commando's](commands.md) - Volledige commandoreferentie met opties
- [Concepten](concepts.md) - Diepgaande blik op specificaties, artefacten en schema's
- [Aanpassing](customization.md) - Maak aangepaste workflows