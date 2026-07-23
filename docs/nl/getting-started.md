# Aan de slag

Deze gids legt uit hoe OpenSpec werkt nadat je het hebt geïnstalleerd en geïnitialiseerd. Voor installatie-instructies, zie de [hoofd-README](../index.md#quick-start) of de [Installatiegids](installation.md). Nieuw bij de hele documentatieset? De [documentatie-startpagina](index.md) brengt alles in kaart.

> **Waar typ ik deze commando's?** Twee plaatsen, en door elkaar halen is de meest voorkomende vroege struikelblok.
>
> - `openspec ...` commando's (zoals `openspec init`) draaien in je **terminal**.
> - `/opsx:...` commando's (zoals `/opsx:propose`) draaien in de **chat van je AI-assistent**, hetzelfde vak waarin je het zou vragen om code te schrijven.
>
> Er is geen aparte "interactieve modus" om te starten. Je typt gewoon het slash-commando in de chat en je assistent neemt het van daar over. Volledige uitleg: [Hoe commando's werken](how-commands-work.md).

## Je eerste vijf minuten

De hele lus, met elke stap gelabeld waar deze plaatsvindt:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (optioneel: denk er eerst goed over na)
AI CHAT      /opsx:propose add-dark-mode      (AI stelt het plan op; jij beoordeelt het)
AI CHAT      /opsx:apply                      (AI bouwt het)
AI CHAT      /opsx:archive                    (specs bijgewerkt, wijziging gearchiveerd)
```

Twee terminalstappen om in te stellen, daarna leef je in de chat. De rest van deze gids pakt uit wat elke stap doet en wat je zult zien.

> **Weet je nog niet wat je moet bouwen? Begin met `/opsx:explore`.** Het is een denkpartner zonder risico die je codebase leest, opties afweegt, en een vaag idee scherpt tot een concreet plan, alle voordat er een artefact of code bestaat. Wanneer het beeld duidelijk is, geeft het door aan `/opsx:propose`. Dit is de beste gewoonte om met een AI te werken die anders met vertrouwen het verkeerde zou bouwen. Zie de [Explore-gids](explore.md).

## Hoe het werkt

OpenSpec helpt jou en je AI-codeerassistent om het eens te worden over wat er gebouwd moet worden voordat er code wordt geschreven.

**Standaard snelle pad (kernprofiel):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (optioneel)
```

Begin met `/opsx:explore` wanneer je uitzoekt wat je moet doen, of spring direct naar `/opsx:propose` wanneer je het al weet. Explore staat in het standaardprofiel, dus het is er altijd wanneer je het wilt.

**Uitgebreid pad (aangepaste workflow-selectie):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Het standaard globale profiel is `core`, dat `propose`, `explore`, `apply`, `sync`, en `archive` bevat. Je kunt de uitgebreide workflow-commando's inschakelen met `openspec config profile` en daarna `openspec update`.

## Wat OpenSpec creëert

Na het uitvoeren van `openspec init` heeft je project deze structuur:

```
openspec/
├── specs/              # Bron van waarheid (gedrag van je systeem)
│   └── <domain>/
│       └── spec.md
├── changes/            # Voorgestelde updates (één map per wijziging)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta-specs (wat verandert)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Projectconfiguratie (optioneel)
```

**Twee belangrijkste mappen:**

- **`specs/`** - De bron van waarheid. Deze specs beschrijven hoe je systeem zich momenteel gedraagt. Georganiseerd per domein (bijv. `specs/auth/`, `specs/payments/`).

- **`changes/`** - Voorgestelde wijzigingen. Elke wijziging krijgt een eigen map met alle gerelateerde artefacten. Wanneer een wijziging voltooid is, worden de specs samengevoegd met de hoofdmap `specs/`.

## Artefacten begrijpen

Elke wijzigingsmap bevat artefacten die het werk begeleiden:

| Artefact | Doel |
|----------|---------|
| `proposal.md` | Het "waarom" en "wat" - legt intentie, reikwijdte en aanpak vast |
| `specs/` | Delta-specs die TOEGEVOEGD/GEMODIFICEERD/VERWIJDERD-vereisten tonen |
| `design.md` | Het "hoe" - technische aanpak en architectuurbeslissingen |
| `tasks.md` | Implementatie-checklist met selectievakjes |

**Artefacten bouwen op elkaar voort:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            bijwerken terwijl je leert
```

Je kunt altijd teruggaan en eerdere artefacten verfijnen naarmate je meer leert tijdens de implementatie.

## Hoe delta-specs werken

Delta-specs zijn het sleutelconcept in OpenSpec. Ze tonen wat er verandert ten opzichte van je huidige specs.

### Het formaat

Delta-specs gebruiken secties om het type wijziging aan te geven:

```markdown
# Delta voor Auth

## TOEGEVOEGD Vereisten

### Vereiste: Tweefactorauthenticatie
Het systeem MOET een tweede factor vereisen tijdens het inloggen.

#### Scenario: OTP vereist
- GEGEVEN een gebruiker met 2FA ingeschakeld
- WANNEER de gebruiker geldige inloggegevens indient
- DAN wordt een OTP-uitdaging gepresenteerd

## GEMODIFICEERD Vereisten

### Vereiste: Sessietimeout
Het systeem ZAL sessies laten verlopen na 30 minuten inactiviteit.
(Eerder: 60 minuten)

#### Scenario: Inactiviteitstimeout
- GEGEVEN een geauthenticeerde sessie
- WANNEER 30 minuten verstrijken zonder activiteit
- DAN wordt de sessie ongeldig gemaakt

## VERWIJDERD Vereisten

### Vereiste: Onthoud mij
(Vervallen ten gunste van 2FA)
```

### Wat er gebeurt bij archiveren

Wanneer je een wijziging archiveert:

1. **TOEGEVOEGD**-vereisten worden toegevoegd aan de hoofdspec
2. **GEMODIFICEERD**-vereisten vervangen de bestaande versie
3. **VERWIJDERD**-vereisten worden verwijderd uit de hoofdspec

De wijzigingsmap verplaatst naar `openspec/changes/archive/` voor auditgeschiedenis.

## Voorbeeld: Je eerste wijziging

Laten we het toevoegen van donkere modus aan een applicatie doorlopen.

### 1. Start de wijziging (Standaard)

```text
Jij: /opsx:propose add-dark-mode

AI:  Aangemaakt openspec/changes/add-dark-mode/
     ✓ proposal.md — waarom we dit doen, wat er verandert
     ✓ specs/       — vereisten en scenario's
     ✓ design.md    — technische aanpak
     ✓ tasks.md     — implementatie-checklist
     Klaar voor implementatie!
```

Als je het uitgebreide workflow-profiel hebt ingeschakeld, kun je dit ook in twee stappen doen: `/opsx:new` en dan `/opsx:ff` (of `/opsx:continue` incrementeel).

### 2. Wat er wordt aangemaakt

**proposal.md** - Legt de intentie vast:

```markdown
# Voorstel: Donkere modus toevoegen

## Intentie
Gebruikers hebben een donkere modus-optie gevraagd om vermoeide ogen
tijdens gebruik in de nacht te verminderen.

## Reikwijdte
- Themaknop toevoegen in instellingen
- Ondersteuning voor detectie van systeemvoorkeur
- Voorkeur opslaan in localStorage

## Aanpak
Gebruik CSS custom properties voor theming met een React context
voor statusbeheer.
```

**specs/ui/spec.md** - Delta die nieuwe vereisten toont:

```markdown
# Delta voor UI

## TOEGEVOEGD Vereisten

### Vereiste: Thema-selectie
Het systeem ZAL gebruikers toestaan te kiezen tussen lichte en donkere thema's.

#### Scenario: Handmatige schakelaar
- GEGEVEN een gebruiker op een willekeurige pagina
- WANNEER de gebruiker op de themaknop klikt
- DAN wisselt het thema onmiddellijk
- EN blijft de voorkeur bestaan over sessies heen

#### Scenario: Systeemvoorkeur
- GEGEVEN een gebruiker zonder opgeslagen voorkeur
- WANNEER de applicatie laadt
- DAN wordt het voorkeurenschema van het systeem gebruikt
```

**tasks.md** - Implementatie-checklist:

```markdown
# Taken

## 1. Thema-infrastructuur
- [ ] 1.1 ThemeContext aanmaken met licht/donker-status
- [ ] 1.2 CSS custom properties voor kleuren toevoegen
- [ ] 1.3 localStorage-persistentie implementeren

## 2. UI-componenten
- [ ] 2.1 ThemeToggle-component aanmaken
- [ ] 2.2 Schakelaar toevoegen aan instellingenpagina
- [ ] 2.3 Header bijwerken om snelle schakelaar op te nemen

## 3. Styling
- [ ] 3.1 Kleurenpalet voor donker thema definiëren
- [ ] 3.2 Componenten bijwerken om CSS-variabelen te gebruiken
```

### 3. Implementeren

```
Jij: /opsx:apply

AI:  Taken verwerken...
     ✓ 1.1 ThemeContext aangemaakt met licht/donker-status
     ✓ 1.2 CSS custom properties toegevoegd aan globals.css
     ✓ 1.3 localStorage-persistentie geïmplementeerd
     ✓ 2.1 ThemeToggle-component aangemaakt
     ...
     Alle taken voltooid!
```

Tijdens de implementatie, als je ontdekt dat het ontwerp aanpassing nodig heeft, werk je gewoon het artefact bij en ga je door.

### 4. Archiveren

```
Jij: /opsx:archive

AI:  add-dark-mode archiveren...
     ✓ Specs samengevoegd in openspec/specs/ui/spec.md
     ✓ Verplaatst naar openspec/changes/archive/2025-01-24-add-dark-mode/
     Klaar! Klaar voor de volgende functie.
```

Je delta-specs zijn nu onderdeel van de hoofdspecs, die documenteren hoe je systeem werkt.

## Verifiëren en beoordelen

Gebruik de CLI om je wijzigingen te controleren:

```bash
# Actieve wijzigingen weergeven
openspec list

# Wijzigingsdetails weergeven
openspec show add-dark-mode

# Spec-formaat valideren
openspec validate add-dark-mode

# Interactief dashboard
openspec view
```

## Volgende stappen

- [Eerst exploreren](explore.md) - Gebruik `/opsx:explore` om een idee door te nemen voordat je je eraan bindt
- [Een wijziging beoordelen](reviewing-changes.md) - Wat je moet controleren in het plan dat de AI opstelt, voordat er code komt
- [Goede specs schrijven](writing-specs.md) - Hoe een sterke vereiste en scenario eruitzien
- [OpenSpec gebruiken in een bestaand project](existing-projects.md) - Begin in een grote brownfield-codebase
- [Een wijziging bewerken & itereren](editing-changes.md) - Artefacten bijwerken, teruggaan, handmatige bewerkingen afstemmen
- [Kernconcepten in één oogopslag](overview.md) - Het hele mentale model op één pagina
- [Voorbeelden & Recepten](examples.md) - Echte wijzigingen, van begin tot eind
- [Workflows](workflows.md) - Veelvoorkomende patronen en wanneer elk commando te gebruiken
- [Commando's](commands.md) - Volledige referentie voor alle slash-commando's
- [Concepten](concepts.md) - Dieper begrip van specs, wijzigingen, en schema's
- [Aanpassing](customization.md) - Laat OpenSpec op jouw manier werken
- [Stores](stores-beta/user-guide.md) - Planning die repos of teams omvat? Bewaar het in een eigen repo (bèta)
- [FAQ](faq.md) en [Probleemoplossing](troubleshooting.md) - Wanneer je vastloopt