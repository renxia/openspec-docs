# Workflows

Deze gids behandelt veelgebruikte workflowpatronen voor OpenSpec en wanneer je elk ervan moet gebruiken. Voor de basisconfiguratie zie [Aan de slag](getting-started.md). Voor een overzicht van commando's zie [Commando's](commands.md).

## Filosofie: Acties, Geen Fasen

Traditionele workflows dwingen je door fasen: plannen, dan implementeren, dan klaar. Maar echt werk past niet netjes in hokjes.

OPSX hanteert een andere aanpak:

```text
Traditioneel (fase-geblokkeerd):

  PLANNEN ────────► IMPLEMENTEREN ────────► KLAAR
      │                    │
      │   "Kan niet terug" │
      └────────────────────┘

OPSX (vloeiende acties):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Belangrijke principes:**

- **Acties, geen fasen** - Commando's zijn dingen die je kunt doen, geen stadia waar je in vastzit
- **Afhankelijkheden zijn mogelijkheidmakers** - Ze laten zien wat mogelijk is, niet wat er als volgt moet gebeuren

> **Aanpassing:** OPSX-workflows worden aangestuurd door schema's die de volgorde van artefacten definiëren. Zie [Aanpassing](customization.md) voor details over het aanmaken van aangepaste schema's.

## Twee Modi

### Standaard Snelle Pad (`core` profiel)

Nieuwe installaties standaard op `core`, wat het volgende biedt:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:archive`

Typische stroom:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:archive
```

### Uitgebreid/Volledige Werkstroom (aangepaste selectie)

Als je expliciete scaffold-en-build commando's wilt (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), schakel deze dan in met:

```bash
openspec config profile
openspec update
```

## Werkstroompatronen (Uitgebreide Modus)

### Snelle Feature

Wanneer je weet wat je wilt bouwen en gewoon uit moet voeren:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Voorbeeldconversatie:**

```text
Jij: /opsx:new add-logout-button

AI:  Aangemaakt openspec/changes/add-logout-button/
     Gereed om aan te maken: proposal

Jij: /opsx:ff

AI:  Alle planningsartefacten worden aangemaakt...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Gereed voor implementatie!

Jij: /opsx:apply

AI:  Taken worden uitgevoerd...
     ✓ Uitlogknop toegevoegd aan header
     ✓ Sessie wissen geïmplementeerd
     ✓ Bevestigingsdialoog toegevoegd
     Alle taken voltooid!

Jij: /opsx:archive

AI:  ✓ Specs samengevoegd
     ✓ Wijziging gearchiveerd
```

**Geschikt voor:** Kleine tot middelgrote features, bugfixes, eenvoudige wijzigingen.

### Verkennend

Wanneer vereisten onduidelijk zijn of je eerst onderzoek moet doen:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Voorbeeldconversatie:**

```text
Jij: /opsx:explore

AI:  Wat wil je verkennen?

Jij: Ik wil de paginalaadtijd verbeteren, maar ik weet niet zeker
     waar de knelpunten zitten.

AI:  Laat me helpen met het onderzoek...
     [Analyseert bundelgroottes, identificeert trage queries, beoordeelt
     component renderpatronen]

     Ik heb drie hoofdknopelpunten gevonden:
     1. Grote niet-geoptimaliseerde afbeeldingen
     2. Synchrone gegevensophaling in ProductList
     3. Her-rendering door contextwijzigingen

     Welke wil je als eerste aanpakken?

Jij: Laten we het probleem met de gegevensophaling aanpakken.

Jij: /opsx:new optimize-product-list-fetching

AI:  Wijziging aangemaakt. Gereed om aan te maken: proposal

Jij: /opsx:continue

AI:  Proposal aanmaken op basis van ons onderzoek...
     [Schrijft proposal met inzichten uit het onderzoek]

     Gereed om aan te maken: specs, design
     Wat wil je hierna?

Jij: /opsx:continue

AI:  Specs aanmaken...
```

**Geschikt voor:** Prestatieoptimalisatie, debuggen, architectuurbeslissingen, onduidelijke vereisten.

### Parallelle Wijzigingen

Werk aan meerdere wijzigingen tegelijk:

```text
Wijziging A: /opsx:new ──► /opsx:ff ──► /opsx:apply (bezig)
                                         │
                                    contextwissel
                                         │
Wijziging B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Voorbeeldconversatie:**

```text
Jij: Ik werk aan add-dark-mode, maar ik moest een bugfix doen

Jij: /opsx:new fix-login-redirect

AI:  Aangemaakt openspec/changes/fix-login-redirect/

Jij: /opsx:ff

AI:  ✓ Planningsartefacten aangemaakt

Jij: /opsx:apply

AI:  Bezig met fix-login-redirect...
     [Implementeert de fix]
     Alle taken voltooid!

Jij: /opsx:archive

AI:  ✓ fix-login-redirect gearchiveerd

Jij: Laten we terugkeren naar dark mode

Jij: /opsx:apply add-dark-mode

AI:  add-dark-mode wordt hervat...
     Wordt opgepakt bij taak 2.3: Header bijwerken...
```

**Geschikt voor:** Parallelle werkstromen, urgente onderbrekingen, teamsamenwerking.

Wanneer je meerdere voltooide wijzigingen hebt, gebruik `/opsx:bulk-archive`:

```text
Jij: /opsx:bulk-archive

AI:  3 voltooide wijzigingen gevonden:
     - add-dark-mode (alle taken gedaan)
     - fix-login-redirect (alle taken gedaan)
     - update-footer (alle taken gedaan)

     Controleren op spec-conflicten...
     ⚠ add-dark-mode en update-footer wijzigen beide specs/ui/

     Codebase inspecteren om op te lossen...
     Beide wijzigingen zijn geïmplementeerd. Zullen in chronologische volgorde worden toegepast.

     Alle 3 wijzigingen archiveren?

Jij: Ja

AI:  ✓ add-dark-mode gearchiveerd
     ✓ fix-login-redirect gearchiveerd
     ✓ update-footer gearchiveerd
     Specs samengevoegd in volgorde: add-dark-mode → update-footer
```

Bulk-archivering detecteert wanneer meerdere wijzigingen dezelfde specs wijzigen en lost conflicten op door te controleren wat er daadwerkelijk is geïmplementeerd.

### Een Wijziging Afronden

De aanbevolen afrondingsstroom:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              valideert          vraagt om sync
              implementatie      indien nodig
```

#### Verifiëren: Controleer Je Werk

`/opsx:verify` valideert de implementatie tegen je artefacten over drie dimensies:

```text
Jij: /opsx:verify

AI:  Verifiëren van add-auth...

     VOLLEDIGHEID
     ✓ Alle 12 taken in tasks.md zijn aangevinkt
     ✓ Alle vereisten in specs hebben bijbehorende code
     ⚠ Scenario "Sessie-timeout na inactiviteit" niet getest

     CORRECTHEID
     ✓ Implementatie komt overeen met spec-intentie
     ✓ Randgevallen uit scenario's zijn afgehandeld
     ✓ Foutstatussen komen overeen met spec-definities

     COHERENTIE
     ✓ Ontwerpbeslissingen weerspiegeld in codestructuur
     ✓ Naamgevingsconventies consistent met design.md
     ⚠ Ontwerp noemt "event-driven" maar implementatie gebruikt polling

     SAMENVATTING
     ─────────────────────────────
     Kritieke problemen: 0
     Waarschuwingen: 2
     Gereed om te archiveren: Ja (met waarschuwingen)

     Aanbevelingen:
     1. Test toevoegen voor sessie-timeout scenario
     2. Overweeg refactoring naar event-driven zoals ontworpen, of update design.md
```

**Wat verifiëren controleert:**

| Dimensie | Wat het valideert |
|-----------|------------------|
| Volledigheid | Alle taken gedaan, alle vereisten geïmplementeerd, scenario's gedekt |
| Correctheid | Implementatie komt overeen met spec-intentie, randgevallen afgehandeld |
| Coherentie | Ontwerpbeslissingen weerspiegeld in code, patronen consistent |

Verifiëren blokkeert archivering niet, maar het brengt problemen aan het licht die je mogelijk eerst wilt aanpakken.

#### Archiveren: De Wijziging Afronden

`/opsx:archive` voltooit de wijziging en verplaatst deze naar het archief:

```text
Jij: /opsx:archive

AI:  add-auth archiveren...

     Status artefacten:
     ✓ proposal.md bestaat
     ✓ specs/ bestaat
     ✓ design.md bestaat
     ✓ tasks.md bestaat (12/12 taken voltooid)

     Deltaspecs: Nog niet gesynchroniseerd met main
     → Wil je nu synchroniseren?

Jij: Ja

AI:  ✓ Specs gesynchroniseerd naar openspec/specs/auth/spec.md
     ✓ Verplaatst naar openspec/changes/archive/2025-01-24-add-auth/

     Wijziging succesvol gearchiveerd.
```

Archivering vraagt om bevestiging als specs niet gesynchroniseerd zijn. Het blokkeert niet bij onvoltooide taken, maar het waarschuwt je wel.

## Wanneer Wat Te Gebruiken

### `/opsx:ff` vs `/opsx:continue`

| Situatie | Gebruik |
|-----------|-----|
| Duidelijke vereisten, gereed om te bouwen | `/opsx:ff` |
| Verkennen, elke stap willen bekijken | `/opsx:continue` |
| Willen itereren op proposal voordat specs worden gemaakt | `/opsx:continue` |
| Tijdsdruk, snel moeten handelen | `/opsx:ff` |
| Complexe wijziging, controle willen | `/opsx:continue` |

**Vuistregel:** Als je de volledige omvang van tevoren kunt beschrijven, gebruik `/opsx:ff`. Als je het onderweg uitvindt, gebruik `/opsx:continue`.

### Wanneer Bijwerken vs. Opnieuw Beginnen

Een veelgestelde vraag: wanneer is het bijwerken van een bestaande wijziging oké, en wanneer moet je een nieuwe beginnen?

**Bijwerk de bestaande wijziging wanneer:**

- Dezelfde intentie, verfijnde uitvoering
- Omvang verkleint (MVP eerst, de rest later)
- Op learnings gebaseerde correcties (codebase is niet wat je verwachtte)
- Ontwerpaanpassingen op basis van implementatie-ontdekkingen

**Begin een nieuwe wijziging wanneer:**

- Intentie fundamenteel veranderd
- Omvang is geëxplodeerd naar geheel ander werk
- Originele wijziging kan als "klaar" worden gemarkeerd op zichzelf
- Patches zouden meer verwarren dan verduidelijken

```text
                     ┌─────────────────────────────────────┐
                     │     Is dit hetzelfde werk?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Dezelfde intentie?  >50% overlap?      Kan origineel
          Dezelfde probleem?  Dezelfde omvang?   "klaar" zijn zonder
                 │                  │          deze wijzigingen?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      JA                NEE JA           NEE NEE              JA
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    BIJWERK           NIEUW BIJWERK     NIEUW BIJWERK        NIEUW
```

**Voorbeeld: "Dark mode toevoegen"**

- "Moet ook aangepaste thema's ondersteunen" → Nieuwe wijziging (omvang geëxplodeerd)
- "Systeemvoorkeurdetectie is moeilijker dan verwacht" → Bijwerken (dezelfde intentie)
- "Laten we eerst de schakelaar uitbrengen, voorkeuren later toevoegen" → Bijwerken en archiveren, dan nieuwe wijziging

## Best Practices

### Houd Wijzigingen Gericht

Eén logische eenheid van werk per wijziging. Als je "voeg feature X toe en refactoreer ook Y" doet, overweeg dan twee aparte wijzigingen.

**Waarom dit belangrijk is:**
- Gemakkelijker te beoordelen en te begrijpen
- Schoon archiefhistorie
- Kan onafhankelijk worden uitgebracht
- Eenvoudiger terugdraaien indien nodig

### Gebruik `/opsx:explore` voor Onduidelijke Vereisten

Voordat je je vastlegt op een wijziging, verken de probleemruimte:

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

Verduidelijkt het denken voordat je artefacten aanmaakt.

### Verifieer Voordat Je Archiveert

Gebruik `/opsx:verify` om te controleren of de implementatie overeenkomt met artefacten:

```text
Jij: /opsx:verify

AI:  add-dark-mode verifiëren...

     ✓ Alle taken in tasks.md zijn aangevinkt
     ✓ Vereisten in specs hebben bijbehorende code
     ✓ Ontwerpbeslissingen zijn weerspiegeld in implementatie

     Gereed om te archiveren!
```

Vangt mismatches op voordat je de wijziging afsluit.

### Noem Wijzigingen Duidelijk

Goede namen maken `openspec list` nuttig:

```text
Goed:                          Vermijd:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Snelle referentie voor opdrachten

Voor volledige details en opties van opdrachten, zie [Opdrachten](commands.md).

| Opdracht | Doel | Wanneer te gebruiken |
|----------|------|----------------------|
| `/opsx:propose` | Wijziging + planningsartefacten aanmaken | Snelle standaardroute (`core` profiel) |
| `/opsx:explore` | Ideeën doordenken | Onduidelijke vereisten, onderzoek |
| `/opsx:new` | Een wijzigingsskelet starten | Uitgebreide modus, expliciete artefactcontrole |
| `/opsx:continue` | Volgend artefact aanmaken | Uitgebreide modus, stapsgewijze artefactcreatie |
| `/opsx:ff` | Alle planningsartefacten aanmaken | Uitgebreide modus, duidelijke scope |
| `/opsx:apply` | Taken implementeren | Klaar om code te schrijven |
| `/opsx:verify` | Implementatie valideren | Uitgebreide modus, voor archivering |
| `/opsx:sync` | Deltaspecificaties samenvoegen | Uitgebreide modus, optioneel |
| `/opsx:archive` | De wijziging voltooien | Alle werkzaamheden afgerond |
| `/opsx:bulk-archive` | Meerdere wijzigingen archiveren | Uitgebreide modus, parallel werk |

## Volgende stappen

- [Opdrachten](commands.md) - Volledige opdrachtreferentie met opties
- [Concepten](concepts.md) - Diepgaande uitleg over specificaties, artefacten en schema's
- [Aanpassing](customization.md) - Aangepaste workflows maken