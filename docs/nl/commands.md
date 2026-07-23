# Commando's

Dit is de referentie voor OpenSpec's slash-commando's. Deze commando's worden aangeroepen in de chatinterface van jouw AI-codeerassistent (bijv. Claude Code, Cursor, Windsurf).

Voor werkstroompatronen en wanneer elk commando te gebruiken, zie [Werkstromen](workflows.md). Voor CLI-commando's, zie [CLI](cli.md).

## Snelle Referentie

### Standaard Snelle Pad (`core` profiel)

| Commando | Doel |
|---------|---------|
| `/opsx:propose` | Maak een wijziging aan en genereer planning-artefacten in één stap |
| `/opsx:explore` | Denk na over ideeën voordat je een wijziging doorvoert |
| `/opsx:apply` | Implementeer taken uit de wijziging |
| `/opsx:update` | Herschrijf de planning-artefacten van een wijziging en houd ze coherent |
| `/opsx:sync` | Voeg delta-specificaties samen met hoofdspecificaties |
| `/opsx:archive` | Archiveer een voltooide wijziging |

### Uitgebreide Werkstroomcommando's (aangepaste werkstroomselectie)

| Commando | Doel |
|---------|---------|
| `/opsx:new` | Start een nieuwe wijzigingsscaffold |
| `/opsx:continue` | Maak het volgende artefact op basis van afhankelijkheden |
| `/opsx:ff` | Snel vooruit: maak alle planning-artefacten in één keer aan |
| `/opsx:verify` | Valideer of de implementatie overeenkomt met de artefacten |
| `/opsx:bulk-archive` | Archiveer meerdere wijzigingen tegelijk |
| `/opsx:onboard` | Begeleide tutorial door de volledige werkstroom |

Het standaard globale profiel is `core`. Om uitgebreide werkstroomcommando's in te schakelen, voer `openspec config profile` uit, selecteer werkstromen, en voer vervolgens `openspec update` uit in jouw project.

---

## Command Reference

### `/opsx:propose`

Maak een nieuwe wijziging en genereer in één stap planning-artefacten. Dit is het standaard startcommando in het `core` profiel.

**Syntaxis:**
```text
/opsx:propose [change-name-or-description]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `change-name-or-description` | Nee | Kebab-case naam of eenvoudige taalwijzigingsbeschrijving |

**Wat het doet:**
- Maakt `openspec/changes/<change-name>/`
- Genereert artefacten die nodig zijn vóór implementatie (voor `spec-driven`: voorstel, specificaties, ontwerp, taken)
- Stopt wanneer de wijziging klaar is voor `/opsx:apply`

**Voorbeeld:**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**Tips:**
- Gebruik dit voor de snelste end-to-end route
- Als u stap-voor-stap artefactcontrole wilt, schakel uitgebreide workflows in en gebruik `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **Begin hier als u onzeker bent.** Explore is een denkpartner zonder risico: het leest uw codebase, vergelijkt opties en scherpt een vaag idee af tot een concreet plan voordat er een wijziging bestaat. Het wordt geleverd in het standaard profiel. Voor het volledige geval en meer voorbeelden, zie de [Explore First](explore.md) gids.

Denk ideeën na, onderzoek problemen en verduidelijk vereisten voordat u zich vastlegt op een wijziging.

**Syntaxis:**
```
/opsx:explore [topic]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `topic` | Nee | Wat u wilt verkennen of onderzoeken |

**Wat het doet:**
- Opent een verkennend gesprek zonder dat structuur vereist is
- Onderzoekt de codebase om vragen te beantwoorden
- Vergelijkt opties en benaderingen
- Maakt visuele diagrammen om het denken te verduidelijken
- Kan overgaan naar `/opsx:propose` (standaard) of `/opsx:new` (uitgebreide workflow) wanneer inzichten kristalliseren

**Voorbeeld:**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT. Can we start a change for that?

AI:  Ready when you are. Run /opsx:propose add-jwt-auth to begin.
```

**Tips:**
- Gebruik wanneer vereisten onduidelijk zijn of u onderzoek moet doen
- Er worden geen artefacten gemaakt tijdens de verkenning
- Goed voor het vergelijken van meerdere benaderingen voordat u besluit
- Kan bestanden lezen en de codebase doorzoeken

---

### `/opsx:new`

Start een nieuw wijzigingsframe. Maakt de wijzigingsmap en wacht tot u artefacten genereert met `/opsx:continue` of `/opsx:ff`.

Dit commando is onderdeel van de set met uitgebreide workflows (niet inbegrepen in het standaard `core` profiel).

**Syntaxis:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `change-name` | Nee | Naam voor de wijzigingsmap (wordt gevraagd indien niet opgegeven) |
| `--schema` | Nee | Workflowschema om te gebruiken (standaard: uit config of `spec-driven`) |

**Wat het doet:**
- Maakt de map `openspec/changes/<change-name>/`
- Maakt het metadata-bestand `.openspec.yaml` in de wijzigingsmap
- Toont het eerste artefactsjabloon klaar voor aanmaken
- Vraagt naar wijzigingsnaam en schema indien niet opgegeven

**Wat het maakt:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Wijzigingsmetadata (schema, aanmaakdatum)
```

**Voorbeeld:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**Tips:**
- Gebruik beschrijvende namen: `add-feature`, `fix-bug`, `refactor-module`
- Vermijd generieke namen zoals `update`, `changes`, `wip`
- Schema kan ook worden ingesteld in de projectconfig (`openspec/config.yaml`)

---

### `/opsx:continue`

Maak het volgende artefact in de afhankelijkheidsketen. Maakt één artefact tegelijk voor incrementele voortgang.

**Syntaxis:**
```
/opsx:continue [change-name]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `change-name` | Nee | Welke wijziging voort te zetten (wordt afgeleid uit de context indien niet opgegeven) |

**Wat het doet:**
- Vraagt de artefactafhankelijkheidsgrafiek op
- Toont welke artefacten klaar zijn versus geblokkeerd
- Maakt het eerste klaar artefact
- Leest afhankelijkheidsbestanden voor context
- Toont wat beschikbaar wordt na aanmaken

**Voorbeeld:**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: tasks
     Run /opsx:continue to create the next artifact.
```

**Tips:**
- Gebruik wanneer u elk artefact wilt beoordelen voordat u verdergaat
- Goed voor complexe wijzigingen waarbij u controle wilt
- Meerdere artefacten kunnen tegelijk klaar worden
- U kunt aangemaakte artefacten bewerken voordat u verdergaat

---

### `/opsx:ff`

Snel door artefactaanmaak heen. Maakt alle planningartefacten in één keer.

**Syntaxis:**
```
/opsx:ff [change-name]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `change-name` | Nee | Welke wijziging snel door te voeren (wordt afgeleid uit de context indien niet opgegeven) |

**Wat het doet:**
- Maakt alle artefacten in afhankelijkheidsvolgorde
- Houdt voortgang bij via een takenlijst
- Stopt wanneer alle `apply-required` artefacten compleet zijn
- Leest elke afhankelijkheid voordat het volgende artefact wordt aangemaakt

**Voorbeeld:**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**Tips:**
- Gebruik wanneer u een duidelijk beeld hebt van wat u bouwt
- Sneller dan `/opsx:continue` voor eenvoudige wijzigingen
- U kunt artefacten nog steeds achteraf bewerken
- Goed voor kleine tot middelgrote functies

---

### `/opsx:apply`

Implementeer taken uit de wijziging. Werkt de takenlijst af, schrijft code en vinkt items af.

**Syntaxis:**
```
/opsx:apply [change-name]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `change-name` | Nee | Welke wijziging te implementeren (wordt afgeleid uit de context indien niet opgegeven) |

**Wat het doet:**
- Leest `tasks.md` en identificeert onvolledige taken
- Werkt taken één voor één af
- Schrijft code, maakt bestanden, voert tests uit indien nodig
- Markeert taken als voltooid met selectievakjes `[x]`

**Voorbeeld:**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**Tips:**
- Kan hervatten waar u was gebleven indien onderbroken
- Gebruik voor parallelle wijzigingen door de wijzigingsnaam op te geven
- Voltooiingsstatus wordt bijgehouden in de selectievakjes van `tasks.md`

---

### `/opsx:update`

Herschrijf de bestaande planningartefacten van een wijziging en houd ze coherent met elkaar. Alleen planningartefacten - het bewerkt nooit code.

**Syntaxis:**

```text
/opsx:update [change-name]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `change-name` | Nee | Welke wijziging bij te werken (wordt afgeleid uit de context indien niet opgegeven) |

**Wat het doet:**

- Leest de artefacten van de wijziging via `openspec status --change <name> --json`
- Past uw gevraagde revisie toe, of beoordeelt de artefacten op tegenstrijdigheden als u er geen hebt genoemd
- Verzoent de andere bestaande artefacten in elke richting (een ontwerpwijziging kan terugwerken naar het voorstel)
- Bevestigt elke bewerking met u voordat het wordt geschreven, één artefact tegelijk
- Eindigt met het aanbevelen van de volgende stap: `/opsx:continue` (artefacten ontbreken), `/opsx:apply` (voer een herzien plan uit in code), of `/opsx:archive` (alles klaar)

**Voorbeeld:**

```text
You: /opsx:update add-dark-mode - we're storing the theme in a cookie now, not localStorage

AI:  Reading add-dark-mode artifacts...

     The design references localStorage in two places; tasks 1.3 covers
     localStorage persistence; the proposal doesn't mention storage.

     Proposed revisions:
     1. design.md - swap localStorage decision for cookie storage
     2. tasks.md - reword task 1.3 to cookie persistence

     Apply revision 1? (design.md)
```

**Tips:**

- Het maakt geen ontbrekende artefacten aan - dat is `/opsx:continue`
- Als de wijziging al is geïmplementeerd, volg op met `/opsx:apply` zodat de code overeenkomt met het herziene plan
- Als uw revisie de *intentie* van de wijziging verandert, begin dan opnieuw met een nieuwe wijziging (zie [When to Update vs. Start Fresh](opsx.md#when-to-update-vs-start-fresh))

---

### `/opsx:verify`

Valideer dat de implementatie overeenkomt met uw wijzigingsartefacten. Controleert volledigheid, juistheid en coherentie.

**Syntaxis:**
```
/opsx:verify [change-name]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `change-name` | Nee | Welke wijziging te verifiëren (wordt afgeleid uit de context indien niet opgegeven) |

**Wat het doet:**
- Controleert drie dimensies van implementatiekwaliteit
- Doorzoekt codebase naar implementatiebewijs
- Rapporteert problemen gecategoriseerd als CRITISCH, WAARSCHUWING of SUGGESTIE
- Blokkeert archivering niet, maar brengt problemen aan het licht

**Verificatiedimensies:**

| Dimensie | Wat het valideert |
|-----------|-------------------|
| **Volledigheid** | Alle taken gedaan, alle vereisten geïmplementeerd, scenario's gedekt |
| **Juistheid** | Implementatie komt overeen met specificatie-intentie, randgevallen behandeld |
| **Coherentie** | Ontwerpbeslissingen weerspiegeld in code, patronen consistent |

**Voorbeeld:**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**Tips:**
- Voer uit vóór archivering om mismatches vroeg te vangen
- Waarschuwingen blokkeren archivering niet maar geven potentiële problemen aan
- Goed voor het beoordelen van het werk van AI voordat u het vastlegt
- Kan afwijking tussen artefacten en implementatie onthullen

---

### `/opsx:sync`

**Optioneel commando.** Voeg delta-specificaties van een wijziging samen met hoofdspecificaties. Archivering zal vragen om te synchroniseren indien nodig, dus u hoeft dit meestal niet handmatig uit te voeren.

**Syntaxis:**
```
/opsx:sync [change-name]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `change-name` | Nee | Welke wijziging te synchroniseren (wordt afgeleid uit de context indien niet opgegeven) |

**Wat het doet:**
- Leest delta-specificaties uit de wijzigingsmap
- Parseert ADDED/MODIFIED/REMOVED/RENAMED secties
- Voegt wijzigingen samen in de hoofdmap `openspec/specs/`
- Behoudt bestaande inhoud die niet in de delta is vermeld
- Archiveert de wijziging niet (blijft actief)

**Voorbeeld:**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**Wanneer handmatig gebruiken:**

| Scenario | Synchroniseren gebruiken? |
|----------|---------------------------|
| Langlopende wijziging, wilt specificaties in hoofd voordat u archiveert | Ja |
| Meerdere parallelle wijzigingen hebben de bijgewerkte basisspecificaties nodig | Ja |
| Wilt de samenvoeging apart voorvertonen/beoordelen | Ja |
| Snelle wijziging, gaat direct naar archivering | Nee (archivering behandelt het) |

**Tips:**
- Synchronisatie is intelligent, geen kopiëren-plakken
- Kan scenario's toevoegen aan bestaande vereisten zonder te dupliceren
- Wijziging blijft actief na synchronisatie (niet gearchiveerd)
- De meeste gebruikers hoeven dit nooit direct aan te roepen—archivering vraagt erom indien nodig

---

### `/opsx:archive`

Archiveer een voltooide wijziging. Finaliseert de wijziging en verplaatst het naar de archiefmap.

**Syntaxis:**
```
/opsx:archive [change-name]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `change-name` | Nee | Welke wijziging te archiveren (wordt afgeleid uit de context indien niet opgegeven) |

**Wat het doet:**
- Controleert de voltooiingsstatus van artefacten
- Controleert taakvoltooiing (waarschuwt indien onvolledig)
- Biedt aan om delta-specificaties te synchroniseren als die nog niet zijn gesynchroniseerd
- Verplaatst de wijzigingsmap naar `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Bewaart alle artefacten voor auditpad

**Voorbeeld:**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**Tips:**
- Archivering blokkeert niet op onvolledige taken, maar waarschuwt
- Delta-specificaties kunnen tijdens archivering of van tevoren worden gesynchroniseerd
- Gearchiveerde wijzigingen worden bewaard voor de geschiedenis
- Gebruik eerst `/opsx:verify` om problemen te vangen

---

### `/opsx:bulk-archive`

Archiveer meerdere voltooide wijzigingen in één keer. Verwerkt specificatieconflicten tussen wijzigingen.

**Syntaxis:**
```
/opsx:bulk-archive [change-names...]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `change-names` | Nee | Specifieke wijzigingen om te archiveren (vraagt om selectie indien niet opgegeven) |

**Wat het doet:**
- Toont alle voltooide wijzigingen
- Valideert elke wijziging vóór archivering
- Detecteert specificatieconflicten tussen wijzigingen
- Lost conflicten op door te controleren wat daadwerkelijk is geïmplementeerd
- Archiveert in chronologische volgorde

**Voorbeeld:**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**Tips:**
- Goed voor parallelle werkstromen
- Conflictoplossing is agentisch (controleert codebase)
- Wijzigingen worden gearchiveerd in volgorde van aanmaak
- Vraagt voordat specificatie-inhoud wordt overschreven

---

### `/opsx:onboard`

Begeleide onboarding door de volledige OpenSpec-workflow. Een interactieve tutorial die uw daadwerkelijke codebase gebruikt.

**Syntaxis:**
```
/opsx:onboard
```

**Wat het doet:**
- Loopt door een volledige workflowcyclus met uitleg
- Scant uw codebase naar echte verbeteringsmogelijkheden
- Maakt een daadwerkelijke wijziging met echte artefacten
- Implementeert daadwerkelijk werk (kleine, veilige wijzigingen)
- Archiveert de voltooide wijziging
- Legt elke stap uit terwijl het gebeurt

**Fasen:**
1. Welkom en codebase-analyse
2. Een verbeteringsmogelijkheid vinden
3. Een wijziging aanmaken (`/opsx:new`)
4. Het voorstel schrijven
5. Specificaties aanmaken
6. Het ontwerp schrijven
7. Taken aanmaken
8. Taken implementeren (`/opsx:apply`)
9. Implementatie verifiëren
10. De wijziging archiveren
11. Samenvatting en volgende stappen

**Voorbeeld:**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**Tips:**
- Het beste voor nieuwe gebruikers die de workflow leren
- Gebruikt echte code, geen speelgoedvoorbeelden
- Maakt een echte wijziging die u kunt bewaren of weggooien
- Duurt 15-30 minuten om te voltooien

## Opdrachtsyntaxis per AI-tool

Verschillende AI-tools gebruiken iets andere opdrachtsyntaxis. Gebruik het formaat dat bij uw tool past:

| Tool | Syntaxisvoorbeeld |
|------|-------------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | Oproepen op basis van vaardigheden, zoals `/openspec-propose`, `/openspec-apply-change` (geen gegenereerde `opsx-*` opdrachtbestanden) |
| Codex | Oproepen op basis van vaardigheden vanuit `.codex/skills/openspec-*` (geen gegenereerde `opsx-*` promptbestanden) |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi Code | Oproepen op basis van vaardigheden, zoals `/skill:openspec-propose`, `/skill:openspec-apply-change` (geen gegenereerde `opsx-*` opdrachtbestanden) |
| Trae | `/opsx-propose`, `/opsx-apply` |

De bedoeling is hetzelfde voor alle tools, maar hoe opdrachten worden aangeboden kan verschillen per integratie.

> **Opmerking:** GitHub Copilot-opdrachten (`.github/prompts/*.prompt.md`) zijn alleen beschikbaar in IDE-extensies (VS Code, JetBrains, Visual Studio). GitHub Copilot CLI ondersteunt momenteel geen aangepaste promptbestanden — zie [Ondersteunde Tools](supported-tools.md) voor details en tijdelijke oplossingen.

---

## Verouderde Opdrachten

Deze opdrachten gebruiken de oudere "alles-in-een-keer" workflow. Ze werken nog steeds, maar OPSX-opdrachten worden aanbevolen.

| Opdracht | Wat het doet |
|---------|--------------|
| `/openspec:proposal` | Alle artefacten tegelijk aanmaken (voorstel, specificaties, ontwerp, taken) |
| `/openspec:apply` | De wijziging implementeren |
| `/openspec:archive` | De wijziging archiveren |

**Wanneer verouderde opdrachten te gebruiken:**
- Bestaande projecten die de oude workflow gebruiken
- Eenvoudige wijzigingen waarbij u geen incrementele artefactcreatie nodig hebt
- Voorkeur voor de alles-of-nietsaanpak

**Migreren naar OPSX:**
Verouderde wijzigingen kunnen worden voortgezet met OPSX-opdrachten. De artefactstructuur is compatibel.

---

## Problemen Oplossen

### "Wijziging niet gevonden"

De opdracht kon niet identificeren aan welke wijziging gewerkt moet worden.

**Oplossingen:**
- Specificeer de wijzigingsnaam expliciet: `/opsx:apply add-dark-mode`
- Controleer of de wijzigingsmap bestaat: `openspec list`
- Controleer of u in de juiste projectmap bent

### "Geen artefacten klaar"

Alle artefacten zijn ofwel voltooid ofwel geblokkeerd door ontbrekende afhankelijkheden.

**Oplossingen:**
- Voer `openspec status --change <name>` uit om te zien wat blokkeert
- Controleer of vereiste artefacten bestaan
- Maak eerst ontbrekende afhankelijkheidsartefacten aan

### "Schema niet gevonden"

Het opgegeven schema bestaat niet.

**Oplossingen:**
- Lijst van beschikbare schemas: `openspec schemas`
- Controleer de spelling van de schemanaam
- Maak het schema aan als het aangepast is: `openspec schema init <name>`

### Opdrachten niet herkend

De AI-tool herkent OpenSpec-opdrachten niet.

**Oplossingen:**
- Zorg ervoor dat OpenSpec is geïnitialiseerd: `openspec init`
- Regenereer vaardigheden: `openspec update`
- Controleer of de map `.claude/skills/` bestaat (voor Claude Code)
- Herstart uw AI-tool om nieuwe vaardigheden op te pakken

### Artefacten worden niet correct gegenereerd

De AI maakt onvolledige of onjuiste artefacten aan.

**Oplossingen:**
- Voeg projectcontext toe in `openspec/config.yaml`
- Voeg regels per artefact toe voor specifieke begeleiding
- Geef meer detail in uw wijzigingsbeschrijving
- Gebruik `/opsx:continue` in plaats van `/opsx:ff` voor meer controle

---

## Volgende Stappen

- [Workflows](workflows.md) - Veelvoorkomende patronen en wanneer elke opdracht te gebruiken
- [CLI](cli.md) - Terminalopdrachten voor beheer en validatie
- [Aanpassing](customization.md) - Maak aangepaste schemas en workflows aan