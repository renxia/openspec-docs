# Starten

Deze handleiding legt uit hoe OpenSpec werkt nadat u het heeft geïnstalleerd en geïnitialiseerd. Voor installatie-instructies, zie de [hoofd README](../index.md#quick-start) of de [Installatiehandleiding](installation.md). Nieuw in het gehele documentatiepakket? De [documentatie homepage](index.md) geeft alles weer.

> **Waar typ ik deze commando's?** Op twee plaatsen, en ze door elkaar halen is de meest voorkomende vroege valkuil.
>
> - `openspec ...` commando's (zoals `openspec init`) draaien in uw **terminal**.
> - `/opsx:...` commando's (zoals `/opsx:propose`) draaien in het chatvenster van uw **AI-assistent**, hetzelfde venster waar u hem vraagt code te schrijven.
>
> Er is geen aparte "interactieve modus" om mee te beginnen. U typt simpelweg het slash-commando in de chat en uw assistent neemt het vanaf daar over. Volledige uitleg: [How Commands Work](how-commands-work.md).

## Uw Eerste Vijf Minuten

De gehele lus, met elke stap gelabeld door waar deze plaatsvindt:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (optioneel: eerst nadenken)
AI CHAT      /opsx:propose add-dark-mode      (AI stelt het plan op; u beoordeelt dit)
AI CHAT      /opsx:apply                      (AI bouwt het)
AI CHAT      /opsx:archive                    (specs zijn bijgewerkt, wijziging is gearchiveerd)
```

Twee terminalstappen om op te zetten, daarna werkt u in de chat. De rest van deze handleiding ontrafelt wat elke stap doet en wat u zult zien.

> **Niet zeker wat u moet bouwen? Begin met `/opsx:explore`.** Dit is een denkpartner zonder risico die uw codebase leest, opties afweegt en een vage idee omzet in een concreet plan, allemaal voordat er enig artefact of code bestaat. Wanneer het beeld duidelijk is, wordt overgedragen aan `/opsx:propose`. Dit is de beste gewoonte voor het werken met een AI die anders zelfverzekerd de verkeerde dingen zou bouwen. Zie de [Explore guide](explore.md).

## Hoe Het Werkt

OpenSpec helpt u en uw AI-coderingassistent om overeenstemming te komen over wat er gebouwd moet worden, voordat er enige code is geschreven.

**Standaard snelle route (core profiel):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (optioneel)
```

Begin met `/opsx:explore` wanneer u uitfiguren wat te doen, of spring direct naar `/opsx:propose` als u het al weet. Explore staat in het standaardprofiel, dus het is er altijd als u het nodig heeft.

**Uitgebreide route (custom workflow selectie):**

```text
/opsx:new ──► /opsx:ff of /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Het standaard globale profiel is `core`, wat `propose`, `explore`, `apply`, `sync` en `archive` omvat. U kunt de uitgebreide workflowcommando's inschakelen met `openspec config profile` en vervolgens `openspec update`.

## Wat OpenSpec Creëert

Na het uitvoeren van `openspec init` heeft uw project deze structuur:

```
openspec/
├── specs/              # Waarheidsbron (het gedrag van uw systeem)
│   └── <domain>/
│       └── spec.md
├── changes/            # Voorgestelde updates (één map per wijziging)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta specs (wat verandert)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Projectconfiguratie (optioneel)
```

**Twee belangrijke mappen:**

- **`specs/`** - De waarheidsbron. Deze specs beschrijven hoe uw systeem momenteel functioneert. Georganiseerd per domein (bijv. `specs/auth/`, `specs/payments/`).

- **`changes/`** - Voorgestelde wijzigingen. Elke wijziging krijgt zijn eigen map met alle gerelateerde artefacten. Wanneer een wijziging is voltooid, worden de specs samengevoegd in de hoofdmap `specs/`.

## Artefacten Begrijpen

Elke wijzigingsmap bevat artefacten die het werk begeleiden:

| Artefact | Doel |
|----------|---------|
| `proposal.md` | De "waarom" en "wat" - legt intentie, scope en aanpak vast |
| `specs/` | Delta specs die AANGEVOEGDE/GEMODIFICEERDE/VERWIJDERDE vereisten tonen |
| `design.md` | De "hoe" - technische aanpak en architectuurbeslissingen |
| `tasks.md` | Implementatielijst met checkboxes |

**Artefacten bouwen op elkaar voort:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            update terwijl u leert
```

U kunt altijd teruggaan en eerdere artefacten verfijnen naarmate u meer leert tijdens de implementatie.

## Hoe Delta Specs Werken

Delta specs zijn het sleutelconcept in OpenSpec. Ze tonen wat er verandert ten opzichte van uw huidige specs.

### Het Formaat

Delta specs gebruiken secties om het type wijziging aan te geven:

```markdown
# Delta voor Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
Het systeem MOET een tweede factor vereisen tijdens het inloggen.

#### Scenario: OTP vereist
- GIVEN een gebruiker met 2FA ingeschakeld
- WHEN de gebruiker geldige gegevens indient
- THEN wordt er een OTP-uitdaging gepresenteerd

## MODIFIED Requirements

### Requirement: Session Timeout
Het systeem MOET sessies na 30 minuten inactiviteit laten verlopen.
(Voorheen: 60 minuten)

#### Scenario: Inactieve timeout
- GIVEN een geauthenticeerde sessie
- WHEN 30 minuten voorbijgaan zonder activiteit
- THEN wordt de sessie ongeldig gemaakt

## REMOVED Requirements

### Requirement: Remember Me
(Verouderd ten gunste van 2FA)
```

### Wat Gebeurt Er Bij Archivering

Wanneer u een wijziging archiveert:

1. **ADDED** vereisten worden toegevoegd aan de hoofdspec
2. **MODIFIED** vereisten vervangen de bestaande versie
3. **REMOVED** vereisten worden verwijderd uit de hoofdspec

De wijzigingsmap wordt verplaatst naar `openspec/changes/archive/` voor auditgeschiedenis.

## Voorbeeld: Uw Eerste Wijziging

Laten we kijken hoe u dark mode aan een applicatie toevoegt.

### 1. De Wijziging Starten (Standaard)

```text
U: /opsx:propose add-dark-mode

AI:  Heeft openspec/changes/add-dark-mode/ aangemaakt
     ✓ proposal.md — waarom we dit doen, wat er verandert
     ✓ specs/       — vereisten en scenario's
     ✓ design.md    — technische aanpak
     ✓ tasks.md     — implementatielijst
     Klaar voor implementatie!
```

Als u het uitgebreide workflowprofiel heeft ingeschakeld, kunt u dit ook in twee stappen doen: `/opsx:new` dan `/opsx:ff` (of `/opsx:continue` incrementeel).

### 2. Wat Er Ontstaat

**proposal.md** - Legt de intentie vast:

```markdown
# Proposal: Add Dark Mode

## Intent
Gebruikers hebben een dark mode optie gevraagd om oogbelasting te verminderen
tijdens nachtgebruik.

## Scope
- Thematische schakelaar toevoegen in instellingen
- Ondersteuning voor systeemvoorkeurdetectie
- Voorkeur opslaan in localStorage

## Aanpak
Gebruik CSS custom properties voor theming met een React context
voor staatbeheer.
```

**specs/ui/spec.md** - Delta die nieuwe vereisten toont:

```markdown
# Delta voor UI

## ADDED Requirements

### Requirement: Theme Selectie
Het systeem MOET gebruikers in staat stellen te kiezen tussen lichte en donkere thema's.

#### Scenario: Handmatige schakelaar
- GIVEN een gebruiker op welke pagina dan ook is
- WHEN de gebruiker op de themaschakelaar klikt
- THEN wisselt het thema onmiddellijk
- EN wordt de voorkeur behouden over sessies

#### Scenario: Systeemvoorkeur
- GIVEN een gebruiker zonder opgeslagen voorkeur
- WHEN de applicatie laadt
- THEN wordt het door systeemvoorkeurs kleurenschema gebruikt
```

**tasks.md** - Implementatielijst:

```markdown
# Tasks

## 1. Thematische Infrastructuur
- [ ] 1.1 Create ThemeContext met light/dark state
- [ ] 1.2 Add CSS custom properties voor kleuren
- [ ] 1.3 Implement localStorage persistence

## 2. UI Componenten
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Voeg schakelaar toe aan de instellingenpagina
- [ ] 2.3 Update Header om snelle schakelaar op te nemen

## 3. Styling
- [ ] 3.1 Definieer donker thema kleurenpalet
- [ ] 3.2 Update componenten om CSS variabelen te gebruiken
```

### 3. Implementeren

```
U: /opsx:apply

AI:  Werkt door de taken...
     ✓ 1.1 Created ThemeContext with light/dark state
     ✓ 1.2 Added CSS custom properties to globals.css
     ✓ 1.3 Implemented localStorage persistence
     ✓ 2.1 Created ThemeToggle component
     ...
     Alle taken voltooid!
```

Tijdens de implementatie, als u ontdekt dat het ontwerp aangepast moet worden, update dan gewoon het artefact en ga verder.

### 4. Archiveren

```
U: /opsx:archive

AI:  Archiveert add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Klaar! Klaar voor de volgende functie.
```

Uw delta specs zijn nu onderdeel van de hoofdspecs en documenteren hoe uw systeem werkt.

## Verifiëren en Beoordelen

Gebruik de CLI om naar uw wijzigingen te kijken:

```bash
# Lijst actieve wijzigingen
openspec list

# Bekijk wijzigingsdetails
openspec show add-dark-mode

# Valideer spec-opmaakking
openspec validate add-dark-mode

# Interactief dashboard
openspec view
```

## Volgende Stappen

- [Explore First](explore.md) - Gebruik `/opsx:explore` om een idee te overwegen voordat u het commit.
- [Using OpenSpec in an Existing Project](existing-projects.md) - Begin met een grote brownfield codebase.
- [Editing & Iterating on a Change](editing-changes.md) - Update artefacten, ga terug, herstel handmatige wijzigingen.
- [Core Concepts at a Glance](overview.md) - Het gehele mentale model op één pagina.
- [Examples & Recipes](examples.md) - Echte wijzigingen, van begin tot eind.
- [Workflows](workflows.md) - Veelvoorkomende patronen en wanneer u elk commando moet gebruiken.
- [Commands](commands.md) - Volledige referentie voor alle slash commands.
- [Concepts](concepts.md) - Dieper begrip van specs, wijzigingen en schema's.
- [Customization](customization.md) - Laat OpenSpec werken naar uw manier.
- [Stores](stores-beta/user-guide.md) - Planning die repos of teams overspant? Houd het in zijn eigen repo (beta).
- [FAQ](faq.md) en [Troubleshooting](troubleshooting.md) - Wanneer u vastzit.