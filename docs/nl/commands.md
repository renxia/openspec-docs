# Commando's

Dit is de referentie voor de slash-commando's van OpenSpec. Deze commando's worden aangeroepen in het chatinterface van uw AI-coderingassistent (bijv. Claude Code, Cursor, Windsurf).

Voor workflowpatronen en wanneer u elk commando moet gebruiken, zie [Workflows](workflows.md). Voor CLI-commando's, zie [CLI](cli.md).

## Snelle Referentie

### Standaard Snel Pad (`core` profiel)

| Command | Doel |
|---------|---------|
| `/opsx:propose` | Creëer een wijziging en genereer planningsartefacten in één stap. |
| `/opsx:explore` | Denk door over ideeën voordat u een wijziging vastlegt. |
| `/opsx:apply` | Implementeer taken uit de wijziging. |
| `/opsx:sync` | Voeg delta-specificaties samen met hoofdspecificaties. |
| `/opsx:archive` | Archiveer een voltooide wijziging. |

### Uitgebreide Workflow Commando's (aanpassing van workflowselectie)

| Command | Doel |
|---------|---------|
| `/opsx:new` | Start een nieuw wijzigingsskelet. |
| `/opsx:continue` | Maak het volgende artefact op basis van afhankelijkheden. |
| `/opsx:ff` | Fast-forward: creëer alle planningsartefacten in één keer. |
| `/opsx:verify` | Valideer of de implementatie overeenkomt met de artefacten. |
| `/opsx:bulk-archive` | Archiveer meerdere wijzigingen tegelijkertijd. |
| `/opsx:onboard` | Geleide tutorial door het volledige workflow. |

Het standaard globale profiel is `core`. Om uitgebreide workflowcommando's te activeren, voer `openspec config profile` uit, selecteer de workflows en voer vervolgens `openspec update` uit in uw project.

## Commando Referentie

### `/opsx:propose`

Creëer een nieuwe wijziging en genereer planningsartefacten in één stap. Dit is het standaard startcommando in het `core`-profiel.

**Syntaxis:**
```text
/opsx:propose [change-name-or-description]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|-------------|
| `change-name-or-description` | Nee | Naam in kebab-case of een beschrijving van de wijziging in gewone taal |

**Wat het doet:**
- Creëert `openspec/changes/<change-name>/`
- Genereert artefacten die nodig zijn vóór implementatie (voor `spec-driven`: proposal, specs, design, tasks)
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
- Als u stapsgewijze controle over artefacten wilt, schakel dan uitgebreide workflows in en gebruik `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **Begin hier als u zich onzeker voelt.** Explore is een denkpartner zonder risico's: het leest uw codebase, vergelijkt opties en maakt van een vage gedachte een concreet plan voordat er enige wijziging bestaat. Het is opgenomen in het standaardprofiel. Voor de volledige casus en meer voorbeelden, zie de [Explore First](explore.md) handleiding.

Denk door over ideeën, onderzoek problemen en verduidelijk vereisten voordat u zich committeert aan een wijziging.

**Syntaxis:**
```
/opsx:explore [topic]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|-------------|
| `topic` | Nee | Wat u wilt verkennen of onderzoeken |

**Wat het doet:**
- Opent een exploratieve conversatie zonder dat er structuur nodig is
- Onderzoekt de codebase om vragen te beantwoorden
- Vergelijkt opties en benaderingen
- Creëert visuele diagrammen om denken te verduidelijken
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
- Gebruik dit wanneer de vereisten onduidelijk zijn of u onderzoek nodig heeft
- Er worden geen artefacten gecreëerd tijdens het verkennen
- Goed voor het vergelijken van meerdere benaderingen voordat u beslist
- Kan bestanden lezen en de codebase doorzoeken

---

### `/opsx:new`

Start een nieuwe wijzigingsopzet (scaffold). Creëert de change map en wacht op u om artefacten te genereren met `/opsx:continue` of `/opsx:ff`.

Dit commando maakt deel uit van de uitgebreide workflow set (niet inbegrepen in het standaard `core`-profiel).

**Syntaxis:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|-------------|
| `change-name` | Nee | Naam voor de change map (gevraagd als deze niet wordt verstrekt) |
| `--schema` | Nee | Workflow schema om te gebruiken (standaard: uit config of `spec-driven`) |

**Wat het doet:**
- Creëert de directory `openspec/changes/<change-name>/`
- Creëert het metadata bestand `.openspec.yaml` in de change map
- Toont het eerste artefact template klaar voor creatie
- Vraagt om de wijzigingsnaam en het schema als deze niet worden verstrekt

**Wat het creëert:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Wijzigingsmetadata (schema, creatiedatum)
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
- Het schema kan ook worden ingesteld in de projectconfiguratie (`openspec/config.yaml`)

---

### `/opsx:continue`

Creëer het volgende artefact in de afhankelijkheidsketen. Creëert één artefact tegelijk voor incrementele voortgang.

**Syntaxis:**
```
/opsx:continue [change-name]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|-------------|
| `change-name` | Nee | Welke wijziging moet worden voortgezet (afgeleid uit de context als deze niet wordt verstrekt) |

**Wat het doet:**
- Vraagt naar de artefactafhankelijkheidsgraaf
- Toont welke artefacten klaar zijn versus geblokkeerd
- Creëert het eerste beschikbare artefact
- Leest afhankelijkheidsbestanden voor context
- Toont wat beschikbaar wordt na creatie

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
- Gebruik dit wanneer u elk artefact wilt beoordelen voordat u verdergaat
- Goed voor complexe wijzigingen waarbij u controle wilt
- Meerdere artefacten kunnen tegelijkertijd klaar worden
- U kunt de gecreëerde artefacten bewerken voordat u doorgaat

---

### `/opsx:ff`

Fast-forward (versnellen) van artefactcreatie. Creëert alle planningsartefacten in één keer.

**Syntaxis:**
```
/opsx:ff [change-name]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|-------------|
| `change-name` | Nee | Welke wijziging moet worden versneld (afgeleid uit de context als deze niet wordt verstrekt) |

**Wat het doet:**
- Creëert alle artefacten in volgorde van afhankelijkheid
- Houdt de voortgang bij via een todo lijst
- Stopt wanneer alle `apply-required` artefacten zijn voltooid
- Leest elke afhankelijkheid voordat het volgende artefact wordt gecreëerd

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
- Gebruik dit wanneer u een duidelijk beeld heeft van wat u bouwt
- Snellere dan `/opsx:continue` voor eenvoudige wijzigingen
- U kunt de artefacten nog steeds bewerken daarna
- Goed voor kleine tot middelgrote features

---

### `/opsx:apply`

Implementeer taken uit de wijziging. Werkt door de takenlijst, schrijft code en vinkt items af.

**Syntaxis:**
```
/opsx:apply [change-name]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|-------------|
| `change-name` | Nee | Welke wijziging moet worden geïmplementeerd (afgeleid uit de context als deze niet wordt verstrekt) |

**Wat het doet:**
- Leest `tasks.md` en identificeert onvoltooide taken
- Werkt door de taken één voor één
- Schrijft code, creëert bestanden, voert tests uit indien nodig
- Markeert taken als voltooid met checkboxes `[x]`

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
- Kan hervatten waar u gebleven bent als er onderbrekingen waren
- Gebruik voor parallelle wijzigingen door de naam van de wijziging te specificeren
- De voltooiingsstatus wordt bijgehouden in de `tasks.md` checkboxes

---

### `/opsx:verify`

Valideer dat de implementatie overeenkomt met uw wijzigingsartefacten. Controleert volledigheid, correctheid en coherentie.

**Syntaxis:**
```
/opsx:verify [change-name]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|-------------|
| `change-name` | Nee | Welke wijziging moet worden gevalideerd (afgeleid uit de context als deze niet wordt verstrekt) |

**Wat het doet:**
- Controleert drie dimensies van implementatiekwaliteit
- Zoekt in de codebase naar bewijs van de implementatie
- Rapporteert problemen gecategoriseerd als CRITICAL, WARNING of SUGGESTION
- Blokkeert het archiveren niet, maar toont problemen

**Verificatiedimensies:**

| Dimensie | Wat het valideert |
|-----------|-------------------|
| **Completeness** | Alle taken zijn voltooid, alle vereisten zijn geïmplementeerd, scenario's zijn gedekt |
| **Correctness** | Implementatie komt overeen met de intentie van de specificatie, randgevallen zijn afgehandeld |
| **Coherence** | Ontwerpbeslissingen worden weerspiegeld in de code, patronen zijn consistent |

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
- Voer uit vóór het archiveren om mismatches vroegtijdig op te sporen
- Waarschuwingen blokkeren het archiveren niet, maar wijzen op mogelijke problemen
- Goed voor het beoordelen van het werk van de AI voordat u committeert
- Kan drift onthullen tussen artefacten en implementatie

---

### `/opsx:sync`

**Optioneel commando.** Merge delta specs van een wijziging in de hoofdspecs. Archiveren zal vragen om te synchroniseren indien nodig, dus u hoeft dit doorgaans niet handmatig uit te voeren.

**Syntaxis:**
```
/opsx:sync [change-name]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|-------------|
| `change-name` | Nee | Welke wijziging moet worden gesynchroniseerd (afgeleid uit de context als deze niet wordt verstrekt) |

**Wat het doet:**
- Leest delta specs van de change folder
- Parses ADDED/MODIFIED/REMOVED/RENAMED secties
- Mergt wijzigingen in de hoofdmap `openspec/specs/`
- Behoudt bestaande inhoud die niet wordt genoemd in de delta
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

**Wanneer handmatig te gebruiken:**

| Scenario | Gebruik sync? |
|----------|--------------|
| Langlopende wijziging, wil specs in de hoofdmap vóór archiveren | Ja |
| Meerdere parallelle wijzigingen hebben de bijgewerkte basisspecs nodig | Ja |
| Wil de merge apart beoordelen/bekijken | Ja |
| Snelle wijziging, gaat direct naar archiveren | Nee (archive regelt dit) |

**Tips:**
- Sync is intelligent, geen copy-paste
- Kan scenario's toevoegen aan bestaande vereisten zonder duplicatie
- De wijziging blijft actief na sync (niet gearchiveerd)
- De meeste gebruikers zullen dit nooit direct hoeven aanroepen—archive vraagt indien nodig

---

### `/opsx:archive`

Archiveer een voltooide wijziging. Finaliseert de wijziging en verplaatst deze naar de archive map.

**Syntaxis:**
```
/opsx:archive [change-name]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|-------------|
| `change-name` | Nee | Welke wijziging moet worden gearchiveerd (afgeleid uit de context als deze niet wordt verstrekt) |

**Wat het doet:**
- Controleert de voltooiingsstatus van artefacten
- Controleert de taakvoltooiing (waarschuwt indien onvolledig)
- Biedt aan om delta specs te synchroniseren indien nog niet gesynchroniseerd
- Verplaatst de change map naar `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Behoudt alle artefacten voor het auditspoor

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
- Archiveren zal niet blokkeren op onvoltooide taken, maar wel waarschuwen
- Delta specs kunnen worden gesynchroniseerd tijdens het archiveren of daarvoor
- Gearchiveerde wijzigingen worden bewaard voor de geschiedenis
- Gebruik `/opsx:verify` eerst om problemen te vangen

---

### `/opsx:bulk-archive`

Archiveer meerdere voltooide wijzigingen in één keer. Behandelt specconflicten tussen wijzigingen.

**Syntaxis:**
```
/opsx:bulk-archive [change-names...]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|-------------|
| `change-names` | Nee | Specifieke wijzigingen om te archiveren (vraagt om selectie indien niet verstrekt) |

**Wat het doet:**
- Lijst alle voltooide wijzigingen op
- Valideert elke wijziging vóór het archiveren
- Detecteert specconflicten over de wijzigingen heen
- Lost conflicten op door te controleren wat er daadwerkelijk is geïmplementeerd
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
- Conflictresolutie is agentisch (controleert de codebase)
- Wijzigingen worden gearchiveerd in volgorde van creatie
- Vraagt voordat het spec content wordt overschreven

---

### `/opsx:onboard`

Geleide onboarding door de volledige OpenSpec workflow. Een interactieve tutorial met gebruikmaking van uw eigen codebase.

**Syntaxis:**
```
/opsx:onboard
```

**Wat het doet:**
- Loopt een complete workflow cyclus door met narratie
- Scant uw codebase voor echte verbeteringsmogelijkheden
- Creëert een daadwerkelijke wijziging met echte artefacten
- Implementeert echt werk (kleine, veilige wijzigingen)
- Archiveert de voltooide wijziging
- Legt elke stap uit terwijl deze plaatsvindt

**Fasen:**
1. Welkom en codebase analyse
2. Een verbeteringsmogelijkheid vinden
3. Creëren van een wijziging (`/opsx:new`)
4. Schrijven van het proposal
5. Creëren van specs
6. Schrijven van het design
7. Creëren van taken
8. Implementeren van taken (`/opsx:apply`)
9. Verifiëren van de implementatie
10. Archiveren van de wijziging
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
- Gebruikt echte code, geen speelvoorbeelden
- Creëert een echte wijziging die u kunt behouden of weggooien
- Kost 15-30 minuten om te voltooien

## Opdrachtsyntaxis per AI-tool

Verschillende AI-tools gebruiken enigszal verschillende opdrachtsyntaxis. Gebruik het formaat dat overeenkomt met uw tool:

| Tool | Syntax Example |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Skill-based invocations such as `/skill:openspec-propose`, `/skill:openspec-apply-change` (no generated `opsx-*` command files) |
| Trae | Skill-based invocations such as `/openspec-propose`, `/openspec-apply-change` (no generated `opsx-*` command files) |

De intentie is overal bij de tools hetzelfde, maar hoe commando's worden gepresenteerd kan verschillen per integratie.

> **Opmerking:** GitHub Copilot commands (`.github/prompts/*.prompt.md`) zijn alleen beschikbaar in IDE-extensies (VS Code, JetBrains, Visual Studio). De GitHub Copilot CLI ondersteunt momenteel geen aangepaste promptbestanden — zie [Supported Tools](supported-tools.md) voor details en omzeilmethoden.

---

## Legacy Opdrachten

Deze opdrachten gebruiken de oudere "alles-in-één" workflow. Ze werken nog steeds, maar OPSX commando's worden aanbevolen.

| Command | Wat het doet |
|---------|--------------|
| `/openspec:proposal` | Creëert alle artefacten tegelijk (voorstel, specificaties, ontwerp, taken) |
| `/openspec:apply` | Implementeert de wijziging |
| `/openspec:archive` | Archiveert de wijziging |

**Wanneer legacy opdrachten gebruiken:**
- Bestaande projecten die de oude workflow gebruiken
- Eenvoudige wijzigingen waarbij u geen incrementele artefactcreatie nodig heeft
- De voorkeur voor een alles-of-niets benadering

**Migreren naar OPSX:**
Legacy wijzigingen kunnen worden voortgezet met OPSX commando's. De artefactstructuur is compatibel.

---

## Probleemoplossing (Troubleshooting)

### "Change not found" (Wijziging niet gevonden)

Het commando kon niet bepalen welke wijziging het moest behandelen.

**Oplossingen:**
- Specificeer de wijzigingsnaam expliciet: `/opsx:apply add-dark-mode`
- Controleer of de wijzigingsmap bestaat: `openspec list`
- Verifieer dat u zich in de juiste projectmap bevindt

### "No artifacts ready" (Geen artefacten klaar)

Alle artefacten zijn ofwel voltooid, of worden geblokkeerd door ontbrekende afhankelijkheden.

**Oplossingen:**
- Voer `openspec status --change <name>` uit om te zien wat blokkeert
- Controleer of de vereiste artefacten bestaan
- Creëer eerst de ontbrekende afhankelijkheidsartefacten

### "Schema not found" (Schema niet gevonden)

Het gespecificeerde schema bestaat niet.

**Oplossingen:**
- Liste beschikbare schemas: `openspec schemas`
- Controleer de spelling van de schemaname
- Creëer het schema als dit een aangepaste is: `openspec schema init <name>`

### Commands not recognized (Opdrachten niet herkend)

De AI-tool herkent OpenSpec commando's niet.

**Oplossingen:**
- Zorg ervoor dat OpenSpec is geïnitialiseerd: `openspec init`
- Genereer de skills opnieuw: `openspec update`
- Controleer of de map `.claude/skills/` bestaat (voor Claude Code)
- Herstart uw AI-tool om de nieuwe skills te laden

### Artifacts not generating properly (Artefacten genereren niet correct)

De AI creëert onvolledige of incorrecte artefacten.

**Oplossingen:**
- Voeg projectcontext toe aan `openspec/config.yaml`
- Voeg per-artefact regels toe voor specifieke begeleiding
- Geef meer details in uw wijzigingsbeschrijving
- Gebruik `/opsx:continue` in plaats van `/opsx:ff` voor meer controle

---

## Volgende Stappen (Next Steps)

- [Workflows](workflows.md) - Algemene patronen en wanneer u elk commando moet gebruiken
- [CLI](cli.md) - Terminalcommando's voor beheer en validatie
- [Customization](customization.md) - Creëer aangepaste schemas en workflows