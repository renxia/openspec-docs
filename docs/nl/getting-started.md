# Aan de slag

Deze gids legt uit hoe OpenSpec werkt nadat je het hebt geïnstalleerd en geïnitialiseerd. Voor installatie-instructies, zie de [hoofd-README](index.md#quick-start).

## Hoe het werkt

OpenSpec helpt jou en je AI-codeerassistent om overeen te komen wat er gebouwd moet worden voordat er ook maar één regel code wordt geschreven.

**Standaard snelle route (core-profiel):**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:archive
```

**Uitgebreide route (aangepaste workflowselectie):**

```text
/opsx:new ──► /opsx:ff of /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Het standaard globale profiel is `core`, dat `propose`, `explore`, `apply` en `archive` bevat. Je kunt de uitgebreide workflow-commando's inschakelen met `openspec config profile` en vervolgens `openspec update`.

## Wat OpenSpec aanmaakt

Na het uitvoeren van `openspec init` heeft je project deze structuur:

```
openspec/
├── specs/              # Bron van de waarheid (het gedrag van je systeem)
│   └── <domein>/
│       └── spec.md
├── changes/            # Voorgestelde updates (één map per wijziging)
│   └── <wijzigingsnaam>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta-specificaties (wat er verandert)
│           └── <domein>/
│               └── spec.md
└── config.yaml         # Projectconfiguratie (optioneel)
```

**Twee belangrijke mappen:**

- **`specs/`** - De bron van de waarheid. Deze specificaties beschrijven hoe je systeem zich momenteel gedraagt. Georganiseerd per domein (bijv. `specs/auth/`, `specs/payments/`).

- **`changes/`** - Voorgestelde wijzigingen. Elke wijziging krijgt zijn eigen map met alle gerelateerde artefacten. Wanneer een wijziging voltooid is, worden de specificaties ervan samengevoegd met de hoofdmap `specs/`.

## Artefacten begrijpen

Elke wijzigingsmap bevat artefacten die het werk begeleiden:

| Artifact | Doel |
|----------|---------|
| `proposal.md` | Het "waarom" en "wat" - legt de intentie, reikwijdte en aanpak vast |
| `specs/` | Delta-specificaties die TOEGEVOEGDE/GEWIJZIGDE/VERWIJDERDE vereisten tonen |
| `design.md` | Het "hoe" - technische aanpak en architectuurbeslissingen |
| `tasks.md` | Implementatiechecklijst met selectievakjes |

**Artefacten bouwen voort op elkaar:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            bijwerken naarmate je leert
```

Je kunt altijd teruggaan en eerdere artefacten verfijnen naarmate je meer leert tijdens de implementatie.

## Hoe Delta-Specificaties Werken

Delta-specificaties zijn het sleutelconcept in OpenSpec. Ze tonen wat er verandert ten opzichte van je huidige specificaties.

### Het Formaat

Delta-specificaties gebruiken secties om het type wijziging aan te geven:

```markdown
# Delta voor Auth

## TOEGEVOEGDE Vereisten

### Vereiste: Tweefactorauthenticatie
Het systeem MOET een tweede factor vereisen bij het inloggen.

#### Scenario: OTP vereist
- GEGEVEN een gebruiker met 2FA ingeschakeld
- WANNEER de gebruiker geldige referenties indient
- DAN wordt een OTP-uitdaging gepresenteerd

## GEWIJZIGDE Vereisten

### Vereiste: Sessietimeout
Het systeem ZAL sessies verlopen na 30 minuten inactiviteit.
(Eerder: 60 minuten)

#### Scenario: Inactieve timeout
- GEGEVEN een geauthenticeerde sessie
- WANNEER 30 minuten verstrijken zonder activiteit
- DAN wordt de sessie ongeldig verklaard

## VERWIJDERDE Vereisten

### Vereiste: Onthoud mij
(Vervangen door 2FA)
```

### Wat Er Gebeurt bij Archiveren

Wanneer je een wijziging archiveert:

1. **TOEGEVOEGDE** vereisten worden toegevoegd aan de hoofdspecificatie
2. **GEWIJZIGDE** vervangen de bestaande versie
3. **VERWIJDERDE** worden verwijderd uit de hoofdspecificatie

De wijzigingsmap wordt verplaatst naar `openspec/changes/archive/` voor de auditgeschiedenis.

## Voorbeeld: Je Eerste Wijziging

Laten we doorlopen hoe je donkere modus aan een applicatie toevoegt.

### 1. Start de Wijziging (Standaard)

```text
Jij: /opsx:propose add-dark-mode

AI:  Aangemaakt openspec/changes/add-dark-mode/
     ✓ proposal.md — waarom we dit doen, wat er verandert
     ✓ specs/       — vereisten en scenario's
     ✓ design.md    — technische aanpak
     ✓ tasks.md     — implementatiechecklijst
     Klaar voor implementatie!
```

Als je het uitgebreide workflowprofiel hebt ingeschakeld, kun je dit ook in twee stappen doen: `/opsx:new` en dan `/opsx:ff` (of `/opsx:continue` stapsgewijs).

### 2. Wat Er Wordt Aangemaakt

**proposal.md** - Legt de intentie vast:

```markdown
# Voorstel: Donkere Modus Toevoegen

## Intentie
Gebruikers hebben om een donkere modus-optie gevraagd om oogbelasting te verminderen
tijdens nachtelijk gebruik.

## Reikwijdte
- Schakelaar voor thema toevoegen in instellingen
- Ondersteuning voor detectie van systeemvoorkeur
- Voorkeur opslaan in localStorage

## Aankoop
Gebruik CSS-aangepaste eigenschappen voor thematisering met een React-context
voor het beheren van de status.
```

**specs/ui/spec.md** - Delta met nieuwe vereisten:

```markdown
# Delta voor UI

## TOEGEVOEGDE Vereisten

### Vereiste: Thema-selectie
Het systeem ZAL gebruikers toestaan te kiezen tussen lichte en donkere thema's.

#### Scenario: Handmatige schakelaar
- GEGEVEN een gebruiker op een willekeurige pagina
- WANNEER de gebruiker op de themaschakelaar klikt
- DAN schakelt het thema onmiddellijk over
- EN de voorkeur blijft behouden over sessies heen

#### Scenario: Systeemvoorkeur
- GEGEVEN een gebruiker zonder opgeslagen voorkeur
- WANNEER de applicatie laadt
- DAN wordt het voorkeursschema van het systeem gebruikt
```

**tasks.md** - Implementatiechecklijst:

```markdown
# Taken

## 1. Thema-infrastructuur
- [ ] 1.1 Maak ThemeContext aan met lichte/donkere status
- [ ] 1.2 Voeg CSS-aangepaste eigenschappen voor kleuren toe
- [ ] 1.3 Implementeer localStorage-opslag

## 2. UI-componenten
- [ ] 2.1 Maak ThemeToggle-component aan
- [ ] 2.2 Voeg schakelaar toe aan instellingenpagina
- [ ] 2.3 Werk Header bij om snelle schakelaar op te nemen

## 3. Styling
- [ ] 3.1 Definieer kleurenpalet voor donker thema
- [ ] 3.2 Werk componenten bij om CSS-variabelen te gebruiken
```

### 3. Implementeren

```
Jij: /opsx:apply

AI:  Verwerk taken...
     ✓ 1.1 ThemeContext aangemaakt met lichte/donkere status
     ✓ 1.2 CSS-aangepaste eigenschappen toegevoegd aan globals.css
     ✓ 1.3 localStorage-opslag geïmplementeerd
     ✓ 2.1 ThemeToggle-component aangemaakt
     ...
     Alle taken voltooid!
```

Tijdens de implementatie, als je ontdekt dat het ontwerp aangepast moet worden, werk je het artefact bij en ga je door.

### 4. Archiveren

```
Jij: /opsx:archive

AI:  Archiveren van add-dark-mode...
     ✓ Specificaties samengevoegd in openspec/specs/ui/spec.md
     ✓ Verplaatst naar openspec/changes/archive/2025-01-24-add-dark-mode/
     Klaar! Klaar voor de volgende functie.
```

Je delta-specificaties maken nu deel uit van de hoofdspecificaties en documenteren hoe je systeem werkt.

## Verifiëren en Beoordelen

Gebruik de CLI om je wijzigingen te controleren:

```bash
# Lijst met actieve wijzigingen
openspec list

# Bekijk wijzigingsdetails
openspec show add-dark-mode

# Valideer specificatieformattering
openspec validate add-dark-mode

# Interactief dashboard
openspec view
```

## Volgende Stappen

- [Workflows](workflows.md) - Veelgebruikte patronen en wanneer je elk commando gebruikt
- [Commando's](commands.md) - Volledige referentie voor alle slash-commando's
- [Concepten](concepts.md) - Dieper begrip van specificaties, wijzigingen en schema's
- [Aanpassing](customization.md) - Laat OpenSpec op jouw manier werken