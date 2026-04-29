# Opdrachten

Dit is de referentie voor de slash-opdrachten van OpenSpec. Deze opdrachten worden aangeroepen in de chatinterface van uw AI-code-assistent (bijv. Claude Code, Cursor, Windsurf).

Voor werkwijzepatronen en wanneer u elke opdracht moet gebruiken, zie [Werkwijzen](workflows.md). Voor CLI-opdrachten, zie [CLI](cli.md).

## Snelle referentie

### Standaard snelpad (`core` profiel)

| Opdracht | Doel |
|----------|------|
| `/opsx:propose` | Maak een wijziging aan en genereer in één stap planningsartefacten |
| `/opsx:explore` | Denk ideeën door voordat u zich vastlegt op een wijziging |
| `/opsx:apply` | Implementeer taken uit de wijziging |
| `/opsx:archive` | Archiveer een voltooide wijziging |

### Uitgebreide werkwijzeopdrachten (aangepaste werkwijzeselectie)

| Opdracht | Doel |
|----------|------|
| `/opsx:new` | Start een nieuw wijzigingsskelet |
| `/opsx:continue` | Maak het volgende artefact aan op basis van afhankelijkheden |
| `/opsx:ff` | Snel vooruit: maak alle planningsartefacten in één keer aan |
| `/opsx:verify` | Valideer of de implementatie overeenkomt met de artefacten |
| `/opsx:sync` | Voeg delta-specificaties samen in de hoofdspecificaties |
| `/opsx:bulk-archive` | Archiveer meerdere wijzigingen tegelijk |
| `/opsx:onboard` | Begeleide tutorial door de volledige werkwijze |

Het standaard globale profiel is `core`. Om uitgebreide werkwijzeopdrachten in te schakelen, voert u `openspec config profile` uit, selecteert u werkwijzen, en voert u vervolgens `openspec update` uit in uw project.

---

## Commandoreferentie

### `/opsx:propose`

Maak een nieuwe wijziging aan en genereer in één stap de planningsartefacten. Dit is het standaard startcommando in het `core`-profiel.

**Syntax:**
```text
/opsx:propose [wijzigingsnaam-of-beschrijving]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `wijzigingsnaam-of-beschrijving` | Nee | Naam in kebab-case of een taalkundige beschrijving van de wijziging |

**Wat het doet:**
- Maakt `openspec/changes/<wijzigingsnaam>/` aan
- Genereert de artefacten die nodig zijn vóór implementatie (voor `spec-driven`: voorstel, specificaties, ontwerp, taken)
- Stopt wanneer de wijziging klaar is voor `/opsx:apply`

**Voorbeeld:**
```text
Jij: /opsx:propose voeg-dark-mode-toe

AI:  Aangemaakt openspec/changes/voeg-dark-mode-toe/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Klaar voor implementatie. Voer /opsx:apply uit.
```

**Tips:**
- Gebruik dit voor het snelste end-to-end-pad
- Als je stapsgewijze controle over artefacten wilt, schakel uitgebreide workflows in en gebruik `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

Denk na over ideeën, onderzoek problemen en verduidelijk vereisten voordat je je vastlegt op een wijziging.

**Syntax:**
```
/opsx:explore [onderwerp]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `onderwerp` | Nee | Wat je wilt verkennen of onderzoeken |

**Wat het doet:**
- Opent een verkennend gesprek zonder vereiste structuur
- Onderzoekt de codebase om vragen te beantwoorden
- Vergelijkt opties en benaderingen
- Maakt visuele diagrammen om denkprocessen te verduidelijken
- Kan overgaan naar `/opsx:propose` (standaard) of `/opsx:new` (uitgebreide workflow) wanneer inzichten kristalliseren

**Voorbeeld:**
```text
Jij: /opsx:explore

AI:  Wat wil je verkennen?

Jij: Hoe moeten we authenticatie voor de mobiele app aanpakken?

AI:  Laat me je huidige authenticatie-instellingen onderzoeken...
     [Analyseert codebase]

     Ik zie dat je sessiegebaseerde authenticatie gebruikt voor de web-app.
     Voor mobiel hebben we drie hoofdopties:

     1. JWT-tokens (stateless, werkt offline)
     2. OAuth2 (als je externe login nodig hebt)
     3. Huidige sessies uitbreiden (eenvoudiger, maar vereist connectiviteit)

     Je API heeft al CORS geconfigureerd. Welke richting interesseert je?

Jij: Laten we JWT gebruiken. Kunnen we daar een wijziging voor starten?

AI:  Klaar wanneer jij dat bent. Voer /opsx:propose voeg-jwt-auth-toe uit om te beginnen.
```

**Tips:**
- Gebruik wanneer vereisten onduidelijk zijn of je onderzoek moet doen
- Er worden geen artefacten aangemaakt tijdens het verkennen
- Goed om meerdere benaderingen te vergelijken voordat je beslist
- Kan bestanden lezen en de codebase doorzoeken

---

### `/opsx:new`

Start een nieuwe wijzigingsscaffold. Maakt de wijzigingsmap aan en wacht tot je artefacten genereert met `/opsx:continue` of `/opsx:ff`.

Dit commando maakt deel uit van de uitgebreide workflowset (niet opgenomen in het standaard `core`-profiel).

**Syntax:**
```
/opsx:new [wijzigingsnaam] [--schema <schema-naam>]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `wijzigingsnaam` | Nee | Naam voor de wijzigingsmap (wordt gevraagd indien niet opgegeven) |
| `--schema` | Nee | Te gebruiken workflowschema (standaard: uit config of `spec-driven`) |

**Wat het doet:**
- Maakt de map `openspec/changes/<wijzigingsnaam>/` aan
- Maakt het metadata-bestand `.openspec.yaml` in de wijzigingsmap
- Toont het eerste artefactsjabloon dat klaar is om te worden aangemaakt
- Vraagt om wijzigingsnaam en schema als deze niet zijn opgegeven

**Wat het aanmaakt:**
```
openspec/changes/<wijzigingsnaam>/
└── .openspec.yaml    # Wijzigingsmetadata (schema, aanmaakdatum)
```

**Voorbeeld:**
```
Jij: /opsx:new voeg-dark-mode-toe

AI:  Aangemaakt openspec/changes/voeg-dark-mode-toe/
     Schema: spec-driven

     Klaar om aan te maken: voorstel
     Gebruik /opsx:continue om het aan te maken, of /opsx:ff om alle artefacten aan te maken.
```

**Tips:**
- Gebruik beschrijvende namen: `voeg-functie-toe`, `fix-bug`, `refactor-module`
- Vermijd generieke namen zoals `update`, `changes`, `wip`
- Schema kan ook worden ingesteld in de projectconfiguratie (`openspec/config.yaml`)

---

### `/opsx:continue`

Maak het volgende artefact in de afhankelijkheidsketen aan. Maakt één artefact per keer voor incrementele voortgang.

**Syntax:**
```
/opsx:continue [wijzigingsnaam]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `wijzigingsnaam` | Nee | Welke wijziging moet worden voortgezet (wordt afgeleid uit de context indien niet opgegeven) |

**Wat het doet:**
- Vraagt de artefactafhankelijkheidsgrafiek op
- Toont welke artefacten gereed zijn versus geblokkeerd
- Maakt het eerste gereede artefact aan
- Leest afhankelijkheidsbestanden voor context
- Toont wat beschikbaar komt na aanmaak

**Voorbeeld:**
```
Jij: /opsx:continue

AI:  Wijziging: voeg-dark-mode-toe

     Artefactstatus:
     ✓ proposal    (klaar)
     ◆ specs       (gereed)
     ◆ design      (gereed)
     ○ tasks       (geblokkeerd - vereist: specs)

     Specificaties aanmaken...

     [Leest proposal.md, maakt specificaties op basis van vereisten]

     ✓ Aangemaakt openspec/changes/voeg-dark-mode-toe/specs/ui/spec.md

     Nu beschikbaar: taken
     Voer /opsx:continue uit om het volgende artefact aan te maken.
```

**Tips:**
- Gebruik wanneer je elk artefact wilt beoordelen voordat je doorgaat
- Goed voor complexe wijzigingen waarbij je controle wilt
- Meerdere artefacten kunnen tegelijkertijd gereed komen
- Je kunt aangemaakte artefacten bewerken voordat je doorgaat

---

### `/opsx:ff`

Snel door artefactaanmaak. Maakt alle planningsartefacten in één keer aan.

**Syntax:**
```
/opsx:ff [wijzigingsnaam]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `wijzigingsnaam` | Nee | Welke wijziging moet worden doorgespoeld (wordt afgeleid uit de context indien niet opgegeven) |

**Wat het doet:**
- Maakt alle artefacten in afhankelijkheidsvolgorde aan
- Houdt voortgang bij via een takenlijst
- Stopt wanneer alle `apply-required` artefacten compleet zijn
- Leest elke afhankelijkheid voordat het volgende artefact wordt aangemaakt

**Voorbeeld:**
```
Jij: /opsx:ff voeg-dark-mode-toe

AI:  Voeg-dark-mode-toe doorspoelen...

     ✓ proposal.md aanmaken
     ✓ specs/ui/spec.md aanmaken
     ✓ design.md aanmaken
     ✓ tasks.md aanmaken

     Alle planningsartefacten compleet!
     Klaar voor implementatie. Voer /opsx:apply uit om te beginnen.
```

**Tips:**
- Gebruik wanneer je een duidelijk beeld hebt van wat je bouwt
- Sneller dan `/opsx:continue` voor eenvoudige wijzigingen
- Je kunt artefacten nog steeds achteraf bewerken
- Goed voor kleine tot middelgrote functies

---

### `/opsx:apply`

Implementeer taken uit de wijziging. Werkt de takenlijst af, schrijft code en vinkt items af.

**Syntax:**
```
/opsx:apply [wijzigingsnaam]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `wijzigingsnaam` | Nee | Welke wijziging moet worden geïmplementeerd (wordt afgeleid uit de context indien niet opgegeven) |

**Wat het doet:**
- Leest `tasks.md` en identificeert onvoltooide taken
- Werkt taken één voor één af
- Schrijft code, maakt bestanden aan, voert tests uit indien nodig
- Markeert taken als voltooid met selectievakjes `[x]`

**Voorbeeld:**
```
Jij: /opsx:apply

AI:  Voeg-dark-mode-toe implementeren...

     tasks.md lezen:
     - [ ] 1.1 ThemeContext aanmaken
     - [ ] 1.2 CSS-aangepaste eigenschappen toevoegen
     - [ ] 1.3 localStorage-persistentie implementeren

     Werkt aan 1.1: ThemeContext aanmaken...
     [Maakt src/context/ThemeContext.tsx aan]

     ✓ 1.1 Voltooid

     Werkt aan 1.2: CSS-aangepaste eigenschappen toevoegen...
     [Werkt src/styles/globals.css bij]

     ✓ 1.2 Voltooid
     ...
```

**Tips:**
- Kan hervatten waar je was gebleven als je wordt onderbroken
- Gebruik voor parallelle wijzigingen door de wijzigingsnaam op te geven
- Voltooiingsstatus wordt bijgehouden in de selectievakjes van `tasks.md`

---

### `/opsx:verify`

Valideer dat de implementatie overeenkomt met je wijzigingsartefacten. Controleert volledigheid, correctie en coherentie.

**Syntax:**
```
/opsx:verify [wijzigingsnaam]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `wijzigingsnaam` | Nee | Welke wijziging moet worden geverifieerd (wordt afgeleid uit de context indien niet opgegeven) |

**Wat het doet:**
- Controleert drie dimensies van implementatiekwaliteit
- Doorzoekt de codebase naar implementatiebewijs
- Rapporteert problemen gecategoriseerd als CRITISCH, WAARSCHUWING of SUGGESTIE
- Blokkeert geen archivering, maar geeft problemen aan

**Verificatiedimensies:**

| Dimensie | Wat het valideert |
|-----------|-------------------|
| **Volledigheid** | Alle taken gedaan, alle vereisten geïmplementeerd, scenario's gedekt |
| **Correctie** | Implementatie komt overeen met specificatie-intentie, randgevallen afgehandeld |
| **Coherentie** | Ontwerpbeslissingen weerspiegeld in code, patronen consistent |

**Voorbeeld:**
```
Jij: /opsx:verify

AI:  Voeg-dark-mode-toe verifiëren...

     VOLLEDIGHEID
     ✓ Alle 8 taken in tasks.md zijn aangevinkt
     ✓ Alle vereisten in specificaties hebben bijbehorende code
     ⚠ Scenario "Detectie systeemvoorkeur" heeft geen testdekking

     CORRECTIE
     ✓ Implementatie komt overeen met specificatie-intentie
     ✓ Randgevallen uit scenario's zijn afgehandeld
     ✓ Foutstatussen komen overeen met specificatiedefinities

     COHERENTIE
     ✓ Ontwerpbeslissingen weerspiegeld in codestructuur
     ✓ Naamgevingsconventies consistent met design.md
     ⚠ Ontwerp noemt "CSS-variabelen" maar implementatie gebruikt Tailwind-klassen

     SAMENVATTING
     ─────────────────────────────
     Kritieke problemen: 0
     Waarschuwingen: 2
     Klaar om te archiveren: Ja (met waarschuwingen)

     Aanbevelingen:
     1. Voeg test toe voor detectie systeemvoorkeur
     2. Werk design.md bij om Tailwind-gebruik weer te geven, of refactoreer naar CSS-variabelen
```

**Tips:**
- Voer uit vóór archivering om mismatching vroeg te vinden
- Waarschuwingen blokkeren geen archivering maar wijzen op mogelijke problemen
- Goed om het werk van de AI te beoordelen voordat je commit
- Kan afwijkingen tussen artefacten en implementatie aan het licht brengen

---

### `/opsx:sync`

**Optioneel commando.** Voeg delta-specificaties uit een wijziging samen met de hoofdspecificaties. Archivering zal indien nodig vragen om te synchroniseren, dus je hoeft dit meestal niet handmatig uit te voeren.

**Syntax:**
```
/opsx:sync [wijzigingsnaam]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `wijzigingsnaam` | Nee | Welke wijziging moet worden gesynchroniseerd (wordt afgeleid uit de context indien niet opgegeven) |

**Wat het doet:**
- Leest delta-specificaties uit de wijzigingsmap
- Parseert TOEGEVOEGD/GEWIJZIGD/VERWIJDERD/HERNOEMD-secties
- Voegt wijzigingen samen in de hoofdmap `openspec/specs/`
- Behaalt bestaande inhoud die niet in de delta wordt genoemd
- Archiveert de wijziging niet (blijft actief)

**Voorbeeld:**
```text
Jij: /opsx:sync

AI:  Delta-specificaties van voeg-dark-mode-toe synchroniseren...

     Lezen: openspec/changes/voeg-dark-mode-toe/specs/ui/spec.md
     Doel:  openspec/specs/ui/spec.md

     Toe te passen wijzigingen:
     ✓ TOEGEVOEGD: Vereiste Themasectie (2 scenario's)
     ✓ TOEGEVOEGD: Toegankelijkheidsvereiste (1 scenario)

     Samenvoegen...
     ✓ openspec/specs/ui/spec.md bijgewerkt

     Wijziging blijft actief. Voer /opsx:archive uit wanneer je klaar bent om te voltooien.
```

**Wanneer handmatig te gebruiken:**

| Scenario | Sync gebruiken? |
|----------|-----------------|
| Langlopende wijziging, specificaties in hoofdcode willen vóór archivering | Ja |
| Meerdere parallelle wijzigingen hebben de bijgewerkte basisspecificaties nodig | Ja |
| Samenvoeging apart willen bekijken/beoordelen | Ja |
| Snelle wijziging, direct naar archivering | Nee (archivering regelt het) |

**Tips:**
- Sync is intelligent, geen copy-paste
- Kan scenario's aan bestaande vereisten toevoegen zonder duplicatie
- Wijziging blijft actief na synchronisatie (niet gearchiveerd)
- De meeste gebruikers hoeven dit nooit direct aan te roepen—archivering vraagt ernaar indien nodig

---

### `/opsx:archive`

Archiveer een voltooide wijziging. Finaliseert de wijziging en verplaatst deze naar de archiefmap.

**Syntax:**
```
/opsx:archive [wijzigingsnaam]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `wijzigingsnaam` | Nee | Welke wijziging moet worden gearchiveerd (wordt afgeleid uit de context indien niet opgegeven) |

**Wat het doet:**
- Controleert de voltooiingsstatus van artefacten
- Controleert taakvoltooiing (waarschuwt indien onvoltooid)
- Biedt aan om delta-specificaties te synchroniseren als dit nog niet is gebeurd
- Verplaatst de wijzigingsmap naar `openspec/changes/archive/YYYY-MM-DD-<naam>/`
- Bewaart alle artefacten voor een auditrail

**Voorbeeld:**
```text
Jij: /opsx:archive

AI:  Voeg-dark-mode-toe archiveren...

     Artefactstatus:
     ✓ proposal.md bestaat
     ✓ specs/ bestaat
     ✓ design.md bestaat
     ✓ tasks.md bestaat (8/8 taken voltooid)

     Delta-specificaties: Nog niet gesynchroniseerd
     → Nu synchroniseren? (aanbevolen)

Jij: Ja

AI:  ✓ Specificaties gesynchroniseerd naar openspec/specs/ui/spec.md
     ✓ Verplaatst naar openspec/changes/archive/2025-01-24-voeg-dark-mode-toe/

     Wijziging succesvol gearchiveerd.
```

**Tips:**
- Archivering blokkeert niet op onvoltooide taken, maar waarschuwt wel
- Delta-specificaties kunnen tijdens archivering of vooraf worden gesynchroniseerd
- Gearchiveerde wijzigingen worden bewaard voor de geschiedenis
- Gebruik `/opsx:verify` eerst om problemen te vinden

---

### `/opsx:bulk-archive`

Archiveer meerdere voltooide wijzigingen tegelijk. Handelt specificatieconflicten tussen wijzigingen af.

**Syntax:**
```
/opsx:bulk-archive [wijzigingsnamen...]
```

**Argumenten:**
| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `wijzigingsnamen` | Nee | Specifieke wijzigingen om te archiveren (vraagt om selectie indien niet opgegeven) |

**Wat het doet:**
- Lijst alle voltooide wijzigingen op
- Valideert elke wijziging vóór archivering
- Detecteert specificatieconflicten tussen wijzigingen
- Lost conflicten op door te controleren wat daadwerkelijk is geïmplementeerd
- Archiveert in chronologische volgorde

**Voorbeeld:**
```
Jij: /opsx:bulk-archive

AI:  3 voltooide wijzigingen gevonden:
     - voeg-dark-mode-toe (8/8 taken voltooid)
     - fix-login-bug (3/3 taken voltooid)
     - update-footer (2/2 taken voltooid)

     Controleren op specificatieconflicten...
     ⚠ voeg-dark-mode-toe en update-footer wijzigen beide specs/ui/

     Codebase inspecteren om op te lossen...
     Beide wijzigingen zijn geïmplementeerd. Zullen samenvoegen in chronologische volgorde:
     1. voeg-dark-mode-toe (aangemaakt 20 jan)
     2. update-footer (aangemaakt 22 jan)

     Alle 3 wijzigingen archiveren?

Jij: Ja

AI:  ✓ voeg-dark-mode-toe gearchiveerd
     ✓ fix-login-bug gearchiveerd
     ✓ update-footer gearchiveerd
     Specificaties samengevoegd: voeg-dark-mode-toe → update-footer
```

**Tips:**
- Goed voor parallelle werkstromen
- Conflictresolutie is agentic (controleert codebase)
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
- Scant je codebase op echte verbetermogelijkheden
- Maakt een echte wijziging aan met echte artefacten
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
11. Samenvatting en volgende stappen

**Voorbeeld:**
```
Jij: /opsx:onboard

AI:  Welkom bij OpenSpec!

     Ik loop je door de volledige workflow met je eigen codebase.
     We vinden iets kleins om te verbeteren, maken er een juiste wijziging voor aan,
     implementeren het en archiveren het.

     Laat me je codebase scannen op mogelijkheden...

     [Analyseert codebase]

     Ik heb een paar dingen gevonden waar we aan kunnen werken:
     1. Invoervalidatie toevoegen aan het contactformulier
     2. Foutmeldingen verbeteren in de authenticatiestroom
     3. Laadstatussen toevoegen aan async-knoppen

     Wat interesseert je? (of stel iets anders voor)
```

**Tips:**
- Het beste voor nieuwe gebruikers die de workflow leren
- Gebruikt echte code, geen speelse voorbeelden
- Maakt een echte wijziging aan die je kunt behouden of weggooien
- Duurt 15-30 minuten om te voltooien

---

## Opdrachtsyntax per AI-tool

Verschillende AI-tools gebruiken iets andere opdrachtsyntax. Gebruik het formaat dat bij uw tool past:

| Tool | Voorbeeld syntax |
|------|------------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Trae | Skill-gebaseerde aanroepen zoals `/openspec-propose`, `/openspec-apply-change` (geen gegenereerde `opsx-*` opdrachtbestanden) |

De bedoeling is hetzelfde voor alle tools, maar de manier waarop opdrachten worden aangeboden kan per integratie verschillen.

> **Opmerking:** GitHub Copilot-opdrachten (`.github/prompts/*.prompt.md`) zijn alleen beschikbaar in IDE-extensies (VS Code, JetBrains, Visual Studio). GitHub Copilot CLI ondersteunt momenteel geen aangepaste promptbestanden — zie [Ondersteunde Tools](supported-tools.md) voor details en oplossingen.

---

## Verouderde Opdrachten

Deze opdrachten gebruiken de oudere "alles-in-één-keer"-workflow. Ze werken nog steeds, maar OPSX-opdrachten worden aanbevolen.

| Opdracht | Wat het doet |
|----------|--------------|
| `/openspec:proposal` | Maak alle artefacten in één keer aan (voorstel, specificaties, ontwerp, taken) |
| `/openspec:apply` | Implementeer de wijziging |
| `/openspec:archive` | Archiveer de wijziging |

**Wanneer verouderde opdrachten te gebruiken:**
- Bestaande projecten die de oude workflow gebruiken
- Eenvoudige wijzigingen waarbij u geen incrementele artefactaanmaak nodig heeft
- De voorkeur voor de alles-of-niets-aanpak

**Migratie naar OPSX:**
Verouderde wijzigingen kunnen worden voortgezet met OPSX-opdrachten. De artefactstructuur is compatibel.

---

## Probleemoplossing

### "Wijziging niet gevonden"

De opdracht kon niet identificeren welke wijziging moet worden verwerkt.

**Oplossingen:**
- Specificeer de naam van de wijziging expliciet: `/opsx:apply add-dark-mode`
- Controleer of de wijzigingsmap bestaat: `openspec list`
- Controleer of u zich in de juiste projectmap bevindt

### "Geen artefacten gereed"

Alle artefacten zijn ofwel voltooid of geblokkeerd door ontbrekende afhankelijkheden.

**Oplossingen:**
- Voer `openspec status --change <naam>` uit om te zien wat blokkeert
- Controleer of vereiste artefacten bestaan
- Maak eerst de ontbrekende afhankelijkheidsartefacten aan

### "Schema niet gevonden"

Het opgegeven schema bestaat niet.

**Oplossingen:**
- Lijst beschikbare schema's op: `openspec schemas`
- Controleer de spelling van de schemanaam
- Maak het schema aan als het aangepast is: `openspec schema init <naam>`

### Opdrachten niet herkend

De AI-tool herkent OpenSpec-opdrachten niet.

**Oplossingen:**
- Zorg ervoor dat OpenSpec is geïnitialiseerd: `openspec init`
- Regenereer de skills: `openspec update`
- Controleer of de map `.claude/skills/` bestaat (voor Claude Code)
- Start uw AI-tool opnieuw op om nieuwe skills te laden

### Artefacten worden niet correct gegenereerd

De AI maakt onvolledige of onjuiste artefacten aan.

**Oplossingen:**
- Voeg projectcontext toe in `openspec/config.yaml`
- Voeg per-arteftregels toe voor specifieke begeleiding
- Geef meer details in uw wijzigingsbeschrijving
- Gebruik `/opsx:continue` in plaats van `/opsx:ff` voor meer controle

---

## Volgende Stappen

- [Workflows](workflows.md) - Veelgebruikte patronen en wanneer u elke opdracht gebruikt
- [CLI](cli.md) - Terminalopdrachten voor beheer en validatie
- [Aanpassing](customization.md) - Maak aangepaste schema's en workflows aan