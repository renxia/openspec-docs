# Commando's

Dit is de referentie voor de slashcommando's van OpenSpec. Deze commando's worden aangeroepen in de chatinterface van je AI-codeerassistent (bijv. Claude Code, Cursor, Windsurf).

Voor werkstroompatronen en wanneer je elk commando moet gebruiken, zie [Werkstromen](workflows.md). Voor CLI-commando's, zie [CLI](cli.md).

## Snelreferentie

### Standaard Snel Pad (`core` profiel)

| Commando | Doel |
|----------|------|
| `/opsx:propose` | Maak een wijziging aan en genereer planningsartefacten in één stap |
| `/opsx:explore` | Denk ideeën door voordat je je vastlegt op een wijziging |
| `/opsx:apply` | Implementeer taken uit de wijziging |
| `/opsx:sync` | Voeg delta-specificaties samen met de hoofdspecificaties |
| `/opsx:archive` | Archiveer een voltooide wijziging |

### Uitgebreide Werkstroomcommando's (aangepaste werkstroomselectie)

| Commando | Doel |
|----------|------|
| `/opsx:new` | Start een nieuw wijzigingsskelet |
| `/opsx:continue` | Maak het volgende artefact op basis van afhankelijkheden |
| `/opsx:ff` | Fast-forward: maak alle planningsartefacten in één keer aan |
| `/opsx:verify` | Valideer of de implementatie overeenkomt met de artefacten |
| `/opsx:bulk-archive` | Archiveer meerdere wijzigingen tegelijk |
| `/opsx:onboard` | Begeleide tutorial door de complete werkstroom |

Het standaard globale profiel is `core`. Om uitgebreide werkstroomcommando's in te schakelen, voer `openspec config profile` uit, selecteer werkstromen, en voer vervolgens `openspec update` uit in je project.

---

## Commando Referentie

### `/opsx:propose`

Maak een nieuwe wijziging aan en genereer planningsartefacten in één stap. Dit is het standaard startcommando in het `core` profiel.

**Syntax:**
```text
/opsx:propose [wijzigingsnaam-of-beschrijving]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `wijzigingsnaam-of-beschrijving` | Nee | Kebab-case naam of platte-taal wijzigingsbeschrijving |

**Wat het doet:**
- Maakt `openspec/changes/<wijzigingsnaam>/` aan
- Genereert artefacten die nodig zijn vóór implementatie (voor `spec-driven`: voorstel, specificaties, ontwerp, taken)
- Stopt wanneer de wijziging gereed is voor `/opsx:apply`

**Voorbeeld:**
```text
Jij: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Gereed voor implementatie. Voer /opsx:apply uit.
```

**Tips:**
- Gebruik dit voor het snelste end-to-end pad
- Als je stapsgewijze artefactcontrole wilt, schakel uitgebreide workflows in en gebruik `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

Denk ideeën door, onderzoek problemen en verhelder vereisten voordat je je vastlegt op een wijziging.

**Syntax:**
```
/opsx:explore [onderwerp]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `onderwerp` | Nee | Wat je wilt onderzoeken of uitpluizen |

**Wat het doet:**
- Opent een verkennend gesprek zonder vereiste structuur
- Onderzoekt de codebase om vragen te beantwoorden
- Vergelijkt opties en benaderingen
- Maakt visuele diagrammen om denkprocessen te verhelderen
- Kan overgaan naar `/opsx:propose` (standaard) of `/opsx:new` (uitgebreide workflow) wanneer inzichten concreet worden

**Voorbeeld:**
```text
Jij: /opsx:explore

AI:  Wat wil je onderzoeken?

Jij: Hoe moeten we authenticatie voor de mobiele app afhandelen?

AI:  Laat me je huidige auth-instellingen onderzoeken...
     [Analyseert codebase]

     Ik zie dat je sessie-gebaseerde authenticatie gebruikt voor de webapp.
     Voor mobiel hebben we drie hoofdopties:

     1. JWT-tokens (stateless, werkt offline)
     2. OAuth2 (als je externe login nodig hebt)
     3. Huidige sessies uitbreiden (eenvoudiger, maar vereist connectiviteit)

     Je API heeft al CORS geconfigureerd. Welke richting interesseert je?

Jij: Laten we voor JWT gaan. Kunnen we daar een wijziging voor starten?

AI:  Gereed wanneer jij dat bent. Voer /opsx:propose add-jwt-auth uit om te beginnen.
```

**Tips:**
- Gebruik wanneer vereisten onduidelijk zijn of je moet onderzoeken
- Er worden geen artefacten aangemaakt tijdens verkenning
- Goed voor het vergelijken van meerdere benaderingen voordat je beslist
- Kan bestanden lezen en de codebase doorzoeken

---

### `/opsx:new`

Start een nieuw wijzigingsskelet. Maakt de wijzigingsmap aan en wacht tot je artefacten genereert met `/opsx:continue` of `/opsx:ff`.

Dit commando maakt deel uit van de uitgebreide workflowset (niet inbegrepen in het standaard `core` profiel).

**Syntax:**
```
/opsx:new [wijzigingsnaam] [--schema <schemanaam>]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `wijzigingsnaam` | Nee | Naam voor de wijzigingsmap (wordt gevraagd als niet opgegeven) |
| `--schema` | Nee | Te gebruiken workflowschema (standaard: uit configuratie of `spec-driven`) |

**Wat het doet:**
- Maakt de map `openspec/changes/<wijzigingsnaam>/` aan
- Maakt het metadata-bestand `.openspec.yaml` in de wijzigingsmap aan
- Toont het eerste artefactsjabloon dat gereed is om aan te maken
- Vraagt om wijzigingsnaam en schema als deze niet zijn opgegeven

**Wat het aanmaakt:**
```
openspec/changes/<wijzigingsnaam>/
└── .openspec.yaml    # Wijzigingsmetadata (schema, aanmaakdatum)
```

**Voorbeeld:**
```
Jij: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Gereed om aan te maken: proposal
     Gebruik /opsx:continue om het aan te maken, of /opsx:ff om alle artefacten aan te maken.
```

**Tips:**
- Gebruik beschrijvende namen: `add-feature`, `fix-bug`, `refactor-module`
- Vermijd generieke namen zoals `update`, `changes`, `wip`
- Schema kan ook ingesteld worden in projectconfiguratie (`openspec/config.yaml`)

---

### `/opsx:continue`

Maak het volgende artefact in de afhankelijkheidsketen. Maakt één artefact per keer aan voor incrementele voortgang.

**Syntax:**
```
/opsx:continue [wijzigingsnaam]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `wijzigingsnaam` | Nee | Welke wijziging voort te zetten (afgeleid uit context als niet opgegeven) |

**Wat het doet:**
- Vraagt de artefactafhankelijkheidsgrafiek op
- Toont welke artefacten gereed versus geblokkeerd zijn
- Maakt het eerste gereedstaande artefact aan
- Leest afhankelijkheidsbestanden voor context
- Toont wat beschikbaar wordt na aanmaak

**Voorbeeld:**
```
Jij: /opsx:continue

AI:  Wijziging: add-dark-mode

     Artefactstatus:
     ✓ proposal    (gereed)
     ◆ specs       (gereed)
     ◆ design      (gereed)
     ○ tasks       (geblokkeerd - heeft nodig: specs)

     Specs aanmaken...

     [Leest proposal.md, maakt specs aan op basis van vereisten]

     ✓ Aangemaakt openspec/changes/add-dark-mode/specs/ui/spec.md

     Nu beschikbaar: tasks
     Voer /opsx:continue uit om het volgende artefact aan te maken.
```

**Tips:**
- Gebruik wanneer je elk artefact wilt beoordelen voordat je verdergaat
- Goed voor complexe wijzigingen waarbij je controle wilt
- Meerdere artefacten kunnen tegelijk gereed worden
- Je kunt aangemaakte artefacten bewerken voordat je verdergaat

---

### `/opsx:ff`

Snel vooruit door artefactaanmaak. Maakt alle planningsartefacten in één keer aan.

**Syntax:**
```
/opsx:ff [wijzigingsnaam]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `wijzigingsnaam` | Nee | Welke wijziging te versnellen (afgeleid uit context als niet opgegeven) |

**Wat het doet:**
- Maakt alle artefacten in afhankelijkheidsvolgorde aan
- Volgt voortgang via een takenlijst
- Stopt wanneer alle `apply-required` artefacten compleet zijn
- Leest elke afhankelijkheid voordat het volgende artefact wordt aangemaakt

**Voorbeeld:**
```
Jij: /opsx:ff add-dark-mode

AI:  Snel vooruit met add-dark-mode...

     ✓ proposal.md aanmaken
     ✓ specs/ui/spec.md aanmaken
     ✓ design.md aanmaken
     ✓ tasks.md aanmaken

     Alle planningsartefacten compleet!
     Gereed voor implementatie. Voer /opsx:apply uit om te beginnen.
```

**Tips:**
- Gebruik wanneer je een duidelijk beeld hebt van wat je bouwt
- Sneller dan `/opsx:continue` voor eenvoudige wijzigingen
- Je kunt artefacten achteraf nog bewerken
- Goed voor kleine tot middelgrote functies

---

### `/opsx:apply`

Implementeer taken uit de wijziging. Werkt door de takenlijst, schrijft code en vinkt items af.

**Syntax:**
```
/opsx:apply [wijzigingsnaam]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `wijzigingsnaam` | Nee | Welke wijziging te implementeren (afgeleid uit context als niet opgegeven) |

**Wat het doet:**
- Leest `tasks.md` en identificeert onvoltooide taken
- Werkt taken een voor een af
- Schrijft code, maakt bestanden aan, voert tests uit indien nodig
- Markeert taken als voltooid met selectievakjes `[x]`

**Voorbeeld:**
```
Jij: /opsx:apply

AI:  Implementatie van add-dark-mode...

     tasks.md lezen:
     - [ ] 1.1 ThemeContext aanmaken
     - [ ] 1.2 CSS custom properties toevoegen
     - [ ] 1.3 localStorage-persistentie implementeren

     Bezig met 1.1: ThemeContext aanmaken...
     [Maakt src/context/ThemeContext.tsx aan]

     ✓ 1.1 Voltooid

     Bezig met 1.2: CSS custom properties toevoegen...
     [Werkt src/styles/globals.css bij]

     ✓ 1.2 Voltooid
     ...
```

**Tips:**
- Kan hervatten waar je was gebleven als je onderbroken werd
- Gebruik voor parallelle wijzigingen door de wijzigingsnaam op te geven
- Voltooiingsstatus wordt bijgehouden in de selectievakjes van `tasks.md`

---

### `/opsx:verify`

Valideer dat de implementatie overeenkomt met je wijzigingsartefacten. Controleert volledigheid, correctheid en coherentie.

**Syntax:**
```
/opsx:verify [wijzigingsnaam]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `wijzigingsnaam` | Nee | Welke wijziging te verifiëren (afgeleid uit context als niet opgegeven) |

**Wat het doet:**
- Controleert drie dimensies van implementatiekwaliteit
- Doorzoekt de codebase naar implementatiebewijs
- Rapporteert problemen gecategoriseerd als CRITICAL, WARNING of SUGGESTION
- Blokkeert het archiveren niet, maar brengt problemen aan het licht

**Verificatiedimensies:**

| Dimensie | Wat het valideert |
|-----------|-------------------|
| **Volledigheid** | Alle taken gedaan, alle vereisten geïmplementeerd, scenario's afgedekt |
| **Correctheid** | Implementatie komt overeen met specificatie-intentie, randgevallen afgehandeld |
| **Coherentie** | Ontwerpbeslissingen weerspiegeld in code, patronen consistent |

**Voorbeeld:**
```
Jij: /opsx:verify

AI:  Verificatie van add-dark-mode...

     VOLLEDIGHEID
     ✓ Alle 8 taken in tasks.md zijn aangevinkt
     ✓ Alle vereisten in specs hebben overeenkomstige code
     ⚠ Scenario "Systeemvoorkeur detectie" heeft geen testdekking

     CORRECTHEID
     ✓ Implementatie komt overeen met specificatie-intentie
     ✓ Randgevallen uit scenario's zijn afgehandeld
     ✓ Foutstatussen komen overeen met specificatiedefinities

     COHERENTIE
     ✓ Ontwerpbeslissingen weerspiegeld in codestructuur
     ✓ Naamconventies consistent met design.md
     ⚠ Ontwerp vermeldt "CSS-variabelen" maar implementatie gebruikt Tailwind-klassen

     SAMENVATTING
     ─────────────────────────────
     Kritieke problemen: 0
     Waarschuwingen: 2
     Gereed om te archiveren: Ja (met waarschuwingen)

     Aanbevelingen:
     1. Test toevoegen voor systeemvoorkeur detectie
     2. design.md bijwerken om Tailwind-gebruik weer te geven, of refactoren naar CSS-variabelen
```

**Tips:**
- Voer uit vóór het archiveren om vroegtijdig inconsistenties op te sporen
- Waarschuwingen blokkeren het archiveren niet maar geven potentiële problemen aan
- Goed voor het beoordelen van het werk van de AI voordat je het vastlegt
- Kan afwijkingen tussen artefacten en implementatie aan het licht brengen

---

### `/opsx:sync`

**Optioneel commando.** Voeg delta-specificaties van een wijziging samen in de hoofdspecificaties. Het archiveringsproces zal vragen om te synchroniseren indien nodig, dus je hoeft dit doorgaans niet handmatig uit te voeren.

**Syntax:**
```
/opsx:sync [wijzigingsnaam]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `wijzigingsnaam` | Nee | Welke wijziging te synchroniseren (afgeleid uit context als niet opgegeven) |

**Wat het doet:**
- Leest delta-specificaties uit de wijzigingsmap
- Parseert secties TOEGEVOEGD/GEWIJZIGD/VERWIJDERD/HERNOEMD
- Voegt wijzigingen samen in de hoofdmap `openspec/specs/`
- Behoudt bestaande inhoud die niet in de delta wordt genoemd
- Archiveert de wijziging niet (blijft actief)

**Voorbeeld:**
```text
Jij: /opsx:sync

AI:  Synchroniseren van add-dark-mode delta-specificaties...

     Leest: openspec/changes/add-dark-mode/specs/ui/spec.md
     Doel:  openspec/specs/ui/spec.md

     Toe te passen wijzigingen:
     ✓ TOEGEVOEGD: Thema Selectie vereiste (2 scenario's)
     ✓ TOEGEVOEGD: Toegankelijkheidsvereiste (1 scenario)

     Samenvoegen...
     ✓ openspec/specs/ui/spec.md bijgewerkt

     Wijziging blijft actief. Voer /opsx:archive uit wanneer gereed om te voltooien.
```

**Wanneer handmatig te gebruiken:**

| Scenario | Sync gebruiken? |
|----------|-----------------|
| Langlopende wijziging, specificaties in hoofdmap willen hebben vóór archivering | Ja |
| Meerdere parallelle wijzigingen hebben de bijgewerkte basisspecificaties nodig | Ja |
| Wilt de samenvoeging apart bekijken/beoordelen | Ja |
| Snelle wijziging, direct naar archivering | Nee (archivering handelt dit af) |

**Tips:**
- Sync is intelligent, geen knip-en-plakwerk
- Kan scenario's toevoegen aan bestaande vereisten zonder duplicatie
- Wijziging blijft actief na sync (niet gearchiveerd)
- De meeste gebruikers hoeven dit nooit direct aan te roepen—archivering vraagt het indien nodig

---

### `/opsx:archive`

Archiveer een voltooide wijziging. Rondt de wijziging af en verplaatst deze naar de archiefmap.

**Syntax:**
```
/opsx:archive [wijzigingsnaam]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `wijzigingsnaam` | Nee | Welke wijziging te archiveren (afgeleid uit context als niet opgegeven) |

**Wat het doet:**
- Controleert de voltooiingsstatus van artefacten
- Controleert taakvoltooiing (waarschuwt bij onvolledigheid)
- Biedt aan om delta-specificaties te synchroniseren als dat nog niet is gebeurd
- Verplaatst de wijzigingsmap naar `openspec/changes/archive/JJJJ-MM-DD-<naam>/`
- Behoudt alle artefacten voor audittrail

**Voorbeeld:**
```text
Jij: /opsx:archive

AI:  Archiveren van add-dark-mode...

     Artefactstatus:
     ✓ proposal.md bestaat
     ✓ specs/ bestaat
     ✓ design.md bestaat
     ✓ tasks.md bestaat (8/8 taken compleet)

     Delta-specificaties: Nog niet gesynchroniseerd
     → Nu synchroniseren? (aanbevolen)

Jij: Ja

AI:  ✓ Specificaties gesynchroniseerd naar openspec/specs/ui/spec.md
     ✓ Verplaatst naar openspec/changes/archive/2025-01-24-add-dark-mode/

     Wijziging succesvol gearchiveerd.
```

**Tips:**
- Archivering blokkeert niet bij onvolledige taken, maar waarschuwt wel
- Delta-specificaties kunnen tijdens archivering of vooraf gesynchroniseerd worden
- Gearchiveerde wijzigingen worden bewaard voor geschiedenis
- Gebruik eerst `/opsx:verify` om problemen op te sporen

---

### `/opsx:bulk-archive`

Archiveer meerdere voltooide wijzigingen tegelijk. Handelt specificatieconflicten tussen wijzigingen af.

**Syntax:**
```
/opsx:bulk-archive [wijzigingsnamen...]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `wijzigingsnamen` | Nee | Specifieke wijzigingen om te archiveren (vraagt om te selecteren als niet opgegeven) |

**Wat het doet:**
- Lijst alle voltooide wijzigingen op
- Valideert elke wijziging vóór archivering
- Detecteert specificatieconflicten over wijzigingen heen
- Lost conflicten op door te controleren wat daadwerkelijk is geïmplementeerd
- Archiveert in chronologische volgorde

**Voorbeeld:**
```
Jij: /opsx:bulk-archive

AI:  3 voltooide wijzigingen gevonden:
     - add-dark-mode (8/8 taken compleet)
     - fix-login-bug (3/3 taken compleet)
     - update-footer (2/2 taken compleet)

     Controleren op specificatieconflicten...
     ⚠ add-dark-mode en update-footer raken beide specs/ui/

     Codebase inspecteren om op te lossen...
     Beide wijzigingen zijn geïmplementeerd. Zal samenvoegen in chronologische volgorde:
     1. add-dark-mode (aangemaakt 20 jan)
     2. update-footer (aangemaakt 22 jan)

     Alle 3 wijzigingen archiveren?

Jij: Ja

AI:  ✓ add-dark-mode gearchiveerd
     ✓ fix-login-bug gearchiveerd
     ✓ update-footer gearchiveerd
     Specificaties samengevoegd: add-dark-mode → update-footer
```

**Tips:**
- Goed voor parallelle werkstromen
- Conflictresolutie is agentisch (controleert codebase)
- Wijzigingen worden gearchiveerd in volgorde van aanmaak
- Vraagt voordat specificatie-inhoud wordt overschreven

---

### `/opsx:onboard`

Begeleide onboarding door de volledige OpenSpec-workflow. Een interactieve tutorial met je eigen codebase.

**Syntax:**
```
/opsx:onboard
```

**Wat het doet:**
- Doorloopt een volledige workflowcyclus met toelichting
- Doorzoekt je codebase naar echte verbetermogelijkheden
- Maakt een daadwerkelijke wijziging aan met echte artefacten
- Implementeert daadwerkelijk werk (kleine, veilige wijzigingen)
- Archiveert de voltooide wijziging
- Legt elke stap uit terwijl deze plaatsvindt

**Fasen:**
1. Welkom en codebase-analyse
2. Een verbetermogelijkheid vinden
3. Een wijziging aanmaken (`/opsx:new`)
4. Het voorstel schrijven
5. Specificaties aanmaken
6. Het ontwerp schrijven
7. Taken aanmaken
8. Taken implementeren (`/opsx:apply`)
9. Implementatie verifiëren
10. De wijziging archiveren
11. Samenvatting en vervolgstappen

**Voorbeeld:**
```
Jij: /opsx:onboard

AI:  Welkom bij OpenSpec!

     Ik loop met je door de volledige workflow met je eigen codebase.
     We vinden iets kleins om te verbeteren, maken er een juiste wijziging voor,
     implementeren het, en archiveren het.

     Laat me je codebase doorzoeken op kansen...

     [Analyseert codebase]

     Ik heb een paar dingen gevonden waar we aan kunnen werken:
     1. Invoervalidatie toevoegen aan het contactformulier
     2. Foutmeldingen in de auth-flow verbeteren
     3. Laadstatussen toevoegen aan asynchrone knoppen

     Wat interesseert je? (of stel iets anders voor)
```

**Tips:**
- Het beste voor nieuwe gebruikers die de workflow leren
- Gebruikt echte code, geen voorbeelden
- Maakt een echte wijziging aan die je kunt behouden of weggooien
- Duurt 15-30 minuten om te voltooien

---

## Commandosyntaxis per AI-tool

Verschillende AI-tools gebruiken licht afwijkende commandosyntaxis. Gebruik het formaat dat overeenkomt met jouw tool:

| Tool | Syntaxisvoorbeeld |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Skill-gebaseerde aanroepen zoals `/skill:openspec-propose`, `/skill:openspec-apply-change` (geen gegenereerde `opsx-*` commandobestanden) |
| Trae | Skill-gebaseerde aanroepen zoals `/openspec-propose`, `/openspec-apply-change` (geen gegenereerde `opsx-*` commandobestanden) |

De bedoeling is hetzelfde voor alle tools, maar de manier waarop commando's worden gepresenteerd kan verschillen per integratie.

> **Let op:** GitHub Copilot-commando's (`.github/prompts/*.prompt.md`) zijn alleen beschikbaar in IDE-extensies (VS Code, JetBrains, Visual Studio). GitHub Copilot CLI ondersteunt momenteel geen aangepaste promptbestanden — zie [Ondersteunde tools](supported-tools.md) voor details en workarounds.

---

## Verouderde commando's

Deze commando's gebruiken de oudere "alles-in-één"-workflow. Ze werken nog steeds, maar OPSX-commando's worden aanbevolen.

| Commando | Wat het doet |
|---------|--------------|
| `/openspec:proposal` | Maak alle artefacten in één keer aan (voorstel, specificaties, ontwerp, taken) |
| `/openspec:apply` | Implementeer de wijziging |
| `/openspec:archive` | Archiveer de wijziging |

**Wanneer verouderde commando's te gebruiken:**
- Bestaande projecten die de oude workflow gebruiken
- Eenvoudige wijzigingen waarvoor geen incrementele artefactcreatie nodig is
- Voorkeur voor de alles-of-niets-aanpak

**Migreren naar OPSX:**
Verouderde wijzigingen kunnen worden voortgezet met OPSX-commando's. De artefactstructuur is compatibel.

---

## Probleemoplossing

### "Wijziging niet gevonden"

Het commando kon niet identificeren aan welke wijziging gewerkt moest worden.

**Oplossingen:**
- Geef de wijzigingsnaam expliciet op: `/opsx:apply add-dark-mode`
- Controleer of de wijzigingsmap bestaat: `openspec list`
- Controleer of je in de juiste projectdirectory bent

### "Geen artefacten gereed"

Alle artefacten zijn voltooid of geblokkeerd door ontbrekende afhankelijkheden.

**Oplossingen:**
- Voer `openspec status --change <naam>` uit om te zien wat blokkeert
- Controleer of vereiste artefacten bestaan
- Maak eerst ontbrekende afhankelijkheidsartefacten aan

### "Schema niet gevonden"

Het opgegeven schema bestaat niet.

**Oplossingen:**
- Maak een lijst van beschikbare schema's: `openspec schemas`
- Controleer de spelling van de schemanaam
- Maak het schema aan als het aangepast is: `openspec schema init <naam>`

### Commando's worden niet herkend

De AI-tool herkent OpenSpec-commando's niet.

**Oplossingen:**
- Zorg ervoor dat OpenSpec is geïnitialiseerd: `openspec init`
- Genereer skills opnieuw: `openspec update`
- Controleer of de map `.claude/skills/` bestaat (voor Claude Code)
- Herstart je AI-tool om nieuwe skills op te pikken

### Artefacten worden niet correct gegenereerd

De AI maakt onvolledige of onjuiste artefacten aan.

**Oplossingen:**
- Voeg projectcontext toe in `openspec/config.yaml`
- Voeg per-artefactregels toe voor specifieke begeleiding
- Geef meer detail in je wijzigingsbeschrijving
- Gebruik `/opsx:continue` in plaats van `/opsx:ff` voor meer controle

---

## Volgende stappen

- [Workflows](workflows.md) - Veelvoorkomende patronen en wanneer elk commando te gebruiken
- [CLI](cli.md) - Terminalcommando's voor beheer en validatie
- [Aanpassing](customization.md) - Maak aangepaste schema's en workflows