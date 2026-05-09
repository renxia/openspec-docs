# Aan de slag

Deze gids legt uit hoe OpenSpec werkt nadat je het hebt geïnstalleerd en geïnitialiseerd. Voor installatie-instructies, zie de [hoofd README](index.md#quick-start).

## Hoe het werkt

OpenSpec helpt jou en je AI-codeerassistent overeenstemming te bereiken over wat er gebouwd moet worden voordat er code wordt geschreven.

**Standaard snelle route (core profiel):**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

**Uitgebreide route (aangepaste workflow selectie):**

```text
/opsx:new ──► /opsx:ff of /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Het standaard globale profiel is `core`, dat `propose`, `explore`, `apply`, `sync` en `archive` omvat. Je kunt de uitgebreide workflowcommando's inschakelen met `openspec config profile` en vervolgens `openspec update`.

## Wat OpenSpec aanmaakt

Na het uitvoeren van `openspec init` heeft je project deze structuur:

```
openspec/
├── specs/              # Bron van waarheid (het gedrag van je systeem)
│   └── <domein>/
│       └── spec.md
├── changes/            # Voorgestelde updates (één map per wijziging)
│   └── <wijzigingsnaam>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta specs (wat er verandert)
│           └── <domein>/
│               └── spec.md
└── config.yaml         # Projectconfiguratie (optioneel)
```

**Twee sleutelmappen:**

- **`specs/`** - De bron van waarheid. Deze specs beschrijven hoe je systeem zich momenteel gedraagt. Georganiseerd per domein (bijv. `specs/auth/`, `specs/payments/`).

- **`changes/`** - Voorgestelde wijzigingen. Elke wijziging krijgt zijn eigen map met alle gerelateerde artefacten. Wanneer een wijziging is voltooid, worden de specs samengevoegd in de hoofdmap `specs/`.

## Artefacten begrijpen

Elke wijzigingsmap bevat artefacten die het werk begeleiden:

| Artefact | Doel |
|----------|------|
| `proposal.md` | Het "waarom" en "wat" - legt intentie, reikwijdte en aanpak vast |
| `specs/` | Delta specs die TOEGEVOEGD/GEWIJZIGD/VERWIJDERD vereisten tonen |
| `design.md` | Het "hoe" - technische aanpak en architectuurbeslissingen |
| `tasks.md` | Implementatiechecklist met selectievakjes |

**Artefacten bouwen op elkaar voort:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            update terwijl je leert
```

Je kunt altijd teruggaan en eerdere artefacten verfijnen naarmate je meer leert tijdens de implementatie.

## Hoe Delta Specs werken

Delta specs zijn het sleutelconcept in OpenSpec. Ze tonen wat er verandert ten opzichte van je huidige specs.

### Het formaat

Delta specs gebruiken secties om het type wijziging aan te geven:

```markdown
# Delta voor Auth

## TOEGEVOEGD Vereisten

### Vereist: Tweefactorauthenticatie
Het systeem MOET een tweede factor vereisen tijdens het inloggen.

#### Scenario: OTP vereist
- GEGEVEN een gebruiker met 2FA ingeschakeld
- WANNEER de gebruiker geldige inloggegevens indient
- DAN wordt een OTP-uitdaging gepresenteerd

## GEWIJZIGD Vereisten

### Vereist: Sessie-timeout
Het systeEM ZAL sessies verlopen na 30 minuten inactiviteit.
(Eerder: 60 minuten)

#### Scenario: Inactieve timeout
- GEGEVEN een geauthenticeerde sessie
- WANNEER 30 minuten verstrijken zonder activiteit
- DAN wordt de sessie ongeldig gemaakt

## VERWIJDERD Vereisten

### Vereist: Onthoud mij
(Vervangen door 2FA)
```

### Wat er gebeurt bij archiveren

Wanneer je een wijziging archiveert:

1. **TOEGEVOEGD** vereisten worden toegevoegd aan de hoofdspec
2. **GEWIJZIGD** vereisten vervangen de bestaande versie
3. **VERWIJDERD** vereisten worden verwijderd uit de hoofdspec

De wijzigingsmap wordt verplaatst naar `openspec/changes/archive/` voor auditgeschiedenis.

## Voorbeeld: Je eerste wijziging

We doorlopen het toevoegen van een donkere modus aan een applicatie.

### 1. Start de wijziging (standaard)

```text
Jij: /opsx:propose add-dark-mode

AI:  Aangemaakt openspec/changes/add-dark-mode/
     ✓ proposal.md — waarom we dit doen, wat er verandert
     ✓ specs/       — vereisten en scenario's
     ✓ design.md    — technische aanpak
     ✓ tasks.md     — implementatiechecklist
     Klaar voor implementatie!
```

Als je het uitgebreide workflowprofiel hebt ingeschakeld, kun je dit ook in twee stappen doen: `/opsx:new` dan `/opsx:ff` (of `/opsx:continue` stapsgewijs).

### 2. Wat er wordt aangemaakt

**proposal.md** - Legt de intentie vast:

```markdown
# Voorstel: Donkere modus toevoegen

## Intentie
Gebruikers hebben een optie voor donkere modus gevraagd om oogvermoeidheid
te verminderen tijdens gebruik 's nachts.

## Reikwijdte
- Thema-schakelaar toevoegen in instellingen
- Detectie van systeemvoorkeur ondersteunen
- Voorkeur opslaan in localStorage

## Aanpak
CSS aangepaste eigenschappen gebruiken voor theming met een React context
voor statusbeheer.
```

**specs/ui/spec.md** - Delta met nieuwe vereisten:

```markdown
# Delta voor UI

## TOEGEVOEGD Vereisten

### Vereist: Themaselectie
Het systeem ZAL gebruikers toestaan te kiezen tussen lichte en donkere thema's.

#### Scenario: Handmatige schakelaar
- GEGEVEN een gebruiker op elke pagina
- WANNEER de gebruiker op de themaschakelaar klikt
- DAN schakelt het thema onmiddellijk
- EN de voorkeur blijft behouden over sessies heen

#### Scenario: Systeemvoorkeur
- GEGEVEN een gebruiker zonder opgeslagen voorkeur
- WANNEER de applicatie laadt
- DAN wordt het voorkeurskleurenschema van het systeem gebruikt
```

**tasks.md** - Implementatiechecklist:

```markdown
# Taken

## 1. Themainfrastructuur
- [ ] 1.1 ThemeContext aanmaken met lichte/donkere status
- [ ] 1.2 CSS aangepaste eigenschappen voor kleuren toevoegen
- [ ] 1.3 localStorage-opslag implementeren

## 2. UI-componenten
- [ ] 2.1 ThemeToggle-component aanmaken
- [ ] 2.2 Schakelaar toevoegen aan instellingenpagina
- [ ] 2.3 Header bijwerken om snelle schakelaar op te nemen

## 3. Styling
- [ ] 3.1 Donker thema kleurenpalet definiëren
- [ ] 3.2 Componenten bijwerken om CSS-variabelen te gebruiken
```

### 3. Implementeren

```
Jij: /opsx:apply

AI:  Taken doorwerken...
     ✓ 1.1 ThemeContext aangemaakt met lichte/donkere status
     ✓ 1.2 CSS aangepaste eigenschappen toegevoegd aan globals.css
     ✓ 1.3 localStorage-opslag geïmplementeerd
     ✓ 2.1 ThemeToggle-component aangemaakt
     ...
     Alle taken voltooid!
```

Tijdens de implementatie, als je ontdekt dat het ontwerp aanpassing nodig heeft, werk je gewoon het artefact bij en ga je verder.

### 4. Archiveren

```
Jij: /opsx:archive

AI:  add-dark-mode archiveren...
     ✓ Specs samengevoegd in openspec/specs/ui/spec.md
     ✓ Verplaatst naar openspec/changes/archive/2025-01-24-add-dark-mode/
     Klaar! Gereed voor de volgende functie.
```

Je delta specs zijn nu onderdeel van de hoofdspecs en documenteren hoe je systeem werkt.

## Verifiëren en beoordelen

Gebruik de CLI om je wijzigingen te controleren:

```bash
# Actieve wijzigingen weergeven
openspec list

# Wijzigingsdetails bekijken
openspec show add-dark-mode

# Specformattering valideren
openspec validate add-dark-mode

# Interactief dashboard
openspec view
```

## Volgende stappen

- [Workflows](workflows.md) - Veelvoorkomende patronen en wanneer elk commando te gebruiken
- [Commando's](commands.md) - Volledige referentie voor alle slashcommando's
- [Concepten](concepts.md) - Dieper begrip van specs, wijzigingen en schema's
- [Aanpassing](customization.md) - Laat OpenSpec op jouw manier werken