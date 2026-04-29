# CLI-referentie

De OpenSpec CLI (`openspec`) biedt terminalcommando's voor projectopzet, validatie, statusinspectie en beheer. Deze commando's vullen de AI-slashcommando's (zoals `/opsx:propose`) aan die gedocumenteerd zijn in [Commando's](commands.md).

## Overzicht

| Categorie | Commando's | Doel |
|----------|----------|---------|
| **Opzet** | `init`, `update` | OpenSpec initialiseren en bijwerken in uw project |
| **Verkenning** | `list`, `view`, `show` | Wijzigingen en specificaties verkennen |
| **Validatie** | `validate` | Wijzigingen en specificaties controleren op problemen |
| **Levenscyclus** | `archive` | Voltooide wijzigingen finaliseren |
| **Workflow** | `status`, `instructions`, `templates`, `schemas` | Ondersteuning voor artefactgestuurde workflows |
| **Schema's** | `schema init`, `schema fork`, `schema validate`, `schema which` | Aangepaste workflows aanmaken en beheren |
| **Configuratie** | `config` | Instellingen bekijken en aanpassen |
| **Hulpmiddelen** | `feedback`, `completion` | Feedback en shell-integratie |

## Mens vs Agent Commando's

De meeste CLI-commando's zijn ontworpen voor **menselijk gebruik** in een terminal. Sommige commando's ondersteunen ook **agent-/scriptgebruik** via JSON-uitvoer.

### Alleen voor Mensen Commando's

Deze commando's zijn interactief en ontworpen voor terminalgebruik:

| Commando | Doel |
|----------|------|
| `openspec init` | Project initialiseren (interactieve prompts) |
| `openspec view` | Interactief dashboard |
| `openspec config edit` | Configuratie openen in editor |
| `openspec feedback` | Feedback indienen via GitHub |
| `openspec completion install` | Shell-completies installeren |

### Agent-Compatibele Commando's

Deze commando's ondersteunen `--json`-uitvoer voor programmatisch gebruik door AI-agents en scripts:

| Commando | Menselijk Gebruik | Agent Gebruik |
|----------|-------------------|---------------|
| `openspec list` | Bladeren door wijzigingen/specs | `--json` voor gestructureerde gegevens |
| `openspec show <item>` | Inhoud lezen | `--json` voor parsing |
| `openspec validate` | Controleren op problemen | `--all --json` voor bulkvalidatie |
| `openspec status` | Voortgang van artefacten bekijken | `--json` voor gestructureerde status |
| `openspec instructions` | Volgende stappen ophalen | `--json` voor agent-instructies |
| `openspec templates` | Sjabloonpaden vinden | `--json` voor padresolutie |
| `openspec schemas` | Beschikbare schema's weergeven | `--json` voor schema-ontdekking |

---

## Globale Opties

Deze opties werken met alle commando's:

| Optie | Beschrijving |
|-------|--------------|
| `--version`, `-V` | Versienummer weergeven |
| `--no-color` | Kleurenuitvoer uitschakelen |
| `--help`, `-h` | Help voor commando weergeven |

---

## Setup Commando's

### `openspec init`

Initialiseer OpenSpec in uw project. Maakt de mappenstructuur en configureert AI-toolintegraties.

Standaardgedrag gebruikt globale configuratiestandaarden: profiel `core`, levering `both`, workflows `propose, explore, apply, archive`.

```
openspec init [pad] [opties]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `pad` | Nee | Doelmap (standaard: huidige map) |

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--tools <lijst>` | AI-tools niet-interactief configureren. Gebruik `all`, `none,` of kommagescheiden lijst |
| `--force` | Automatisch oude bestanden opschonen zonder te vragen |
| `--profile <profiel>` | Globaal profiel voor deze init-run overschrijven (`core` of `custom`) |

`--profile custom` gebruikt de workflows die momenteel zijn geselecteerd in de globale configuratie (`openspec config profile`).

**Ondersteunde tool-ID's (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

**Voorbeelden:**

```bash
# Interactieve initialisatie
openspec init

# Initialiseren in een specifieke map
openspec init ./my-project

# Niet-interactief: configureren voor Claude en Cursor
openspec init --tools claude,cursor

# Configureren voor alle ondersteunde tools
openspec init --tools all

# Profiel voor deze run overschrijven
openspec init --profile core

# Prompts overslaan en automatisch oude bestanden opschonen
openspec init --force
```

**Wat het aanmaakt:**

```
openspec/
├── specs/              # Uw specificaties (bron van de waarheid)
├── changes/            # Voorgestelde wijzigingen
└── config.yaml         # Projectconfiguratie

.claude/skills/         # Claude Code-vaardigheden (als claude geselecteerd)
.cursor/skills/         # Cursor-vaardigheden (als cursor geselecteerd)
.cursor/commands/       # Cursor OPSX-commando's (als levering commando's bevat)
... (andere toolconfiguraties)
```

---

### `openspec update`

Werk OpenSpec-instructiebestanden bij na het upgraden van de CLI. Genereert AI-toolconfiguratiebestanden opnieuw met uw huidige globale profiel, geselecteerde workflows en leveringsmodus.

```
openspec update [pad] [opties]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `pad` | Nee | Doelmap (standaard: huidige map) |

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--force` | Update forceren, zelfs als bestanden up-to-date zijn |

**Voorbeeld:**

```bash
# Instructiebestanden bijwerken na npm-upgrade
npm update @fission-ai/openspec
openspec update
```

---

## Bladercommando's

### `openspec list`

Lijst wijzigingen of specs in uw project.

```
openspec list [opties]
```

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--specs` | Specs weergeven in plaats van wijzigingen |
| `--changes` | Wijzigingen weergeven (standaard) |
| `--sort <volgorde>` | Sorteren op `recent` (standaard) of `name` |
| `--json` | Uitvoer als JSON |

**Voorbeelden:**

```bash
# Alle actieve wijzigingen weergeven
openspec list

# Alle specs weergeven
openspec list --specs

# JSON-uitvoer voor scripts
openspec list --json
```

**Uitvoer (tekst):**

```
Actieve wijzigingen:
  add-dark-mode     UI-thema-wisselondersteuning
  fix-login-bug     Sessie-timeoutafhandeling
```

---

### `openspec view`

Toon een interactief dashboard om specs en wijzigingen te verkennen.

```
openspec view
```

Opent een op de terminal gebaseerde interface om door de specificaties en wijzigingen van uw project te navigeren.

---

### `openspec show`

Toon details van een wijziging of spec.

```
openspec show [item-naam] [opties]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `item-naam` | Nee | Naam van wijziging of spec (vraagt om als het ontbreekt) |

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--type <type>` | Type specificeren: `change` of `spec` (automatisch gedetecteerd als ondubbelzinnig) |
| `--json` | Uitvoer als JSON |
| `--no-interactive` | Prompts uitschakelen |

**Wijzigingsspecifieke opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--deltas-only` | Alleen delta-specs weergeven (JSON-modus) |

**Spec-specifieke opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--requirements` | Alleen eisen weergeven, scenario's uitsluiten (JSON-modus) |
| `--no-scenarios` | Scenario-inhoud uitsluiten (JSON-modus) |
| `-r, --requirement <id>` | Specifieke eis weergeven op basis van 1-gebaseerde index (JSON-modus) |

**Voorbeelden:**

```bash
# Interactieve selectie
openspec show

# Specifieke wijziging weergeven
openspec show add-dark-mode

# Specifieke spec weergeven
openspec show auth --type spec

# JSON-uitvoer voor parsing
openspec show add-dark-mode --json
```

---

## Validatiecommando's

### `openspec validate`

Valideer wijzigingen en specs op structurele problemen.

```
openspec validate [item-naam] [opties]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `item-naam` | Nee | Specifiek item om te valideren (vraagt om als het ontbreekt) |

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--all` | Alle wijzigingen en specs valideren |
| `--changes` | Alle wijzigingen valideren |
| `--specs` | Alle specs valideren |
| `--type <type>` | Type specificeren als de naam ondubbelzinnig is: `change` of `spec` |
| `--strict` | Strikte validatiemodus inschakelen |
| `--json` | Uitvoer als JSON |
| `--concurrency <n>` | Maximaal parallelle validaties (standaard: 6, of `OPENSPEC_CONCURRENCY` env) |
| `--no-interactive` | Prompts uitschakelen |

**Voorbeelden:**

```bash
# Interactieve validatie
openspec validate

# Specifieke wijziging valideren
openspec validate add-dark-mode

# Alle wijzigingen valideren
openspec validate --changes

# Alles valideren met JSON-uitvoer (voor CI/scripts)
openspec validate --all --json

# Strikte validatie met verhoogde paralleliteit
openspec validate --all --strict --concurrency 12
```

**Uitvoer (tekst):**

```
Valideren van add-dark-mode...
  ✓ proposal.md geldig
  ✓ specs/ui/spec.md geldig
  ⚠ design.md: ontbrekende sectie "Technische Aanpak"

1 waarschuwing gevonden
```

**Uitvoer (JSON):**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: ontbrekende sectie 'Technische Aanpak'"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## Levenscycluscommando's

### `openspec archive`

Archiveer een voltooide wijziging en merge delta-specs in hoofdspecs.

```
openspec archive [wijzigingsnaam] [opties]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `wijzigingsnaam` | Nee | Wijziging om te archiveren (vraagt om als het ontbreekt) |

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `-y, --yes` | Bevestigingsprompts overslaan |
| `--skip-specs` | Spec-updates overslaan (voor wijzigingen aan infrastructuur/tools/documentatie) |
| `--no-validate` | Validatie overslaan (vereist bevestiging) |

**Voorbeelden:**

```bash
# Interactief archiveren
openspec archive

# Specifieke wijziging archiveren
openspec archive add-dark-mode

# Archiveren zonder prompts (CI/scripts)
openspec archive add-dark-mode --yes

# Een tooling-wijziging archiveren die geen invloed heeft op specs
openspec archive update-ci-config --skip-specs
```

**Wat het doet:**

1. Valideert de wijziging (tenzij `--no-validate`)
2. Vraagt om bevestiging (tenzij `--yes`)
3. Merged delta-specs in `openspec/specs/`
4. Verplaatst de wijzigingsmap naar `openspec/changes/archive/YYYY-MM-DD-<naam>/`

---

## Workflowcommando's

Deze commando's ondersteunen de artefactgestuurde OPSX-workflow. Ze zijn nuttig zowel voor mensen die de voortgang controleren als voor agents die de volgende stappen bepalen.

### `openspec status`

Toon de voltooiingsstatus van artefacten voor een wijziging.

```
openspec status [opties]
```

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--change <id>` | Wijzigingsnaam (vraagt om als het ontbreekt) |
| `--schema <naam>` | Schema-overschrijving (automatisch gedetecteerd uit de configuratie van de wijziging) |
| `--json` | Uitvoer als JSON |

**Voorbeelden:**

```bash
# Interactieve statuscontrole
openspec status

# Status voor specifieke wijziging
openspec status --change add-dark-mode

# JSON voor agentgebruik
openspec status --change add-dark-mode --json
```

**Uitvoer (tekst):**

```
Wijziging: add-dark-mode
Schema: spec-driven
Voortgang: 2/4 artefacten voltooid

[x] proposal
[ ] design
[x] specs
[-] tasks (geblokkeerd door: design)
```

**Uitvoer (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done"},
    {"id": "design", "outputPath": "design.md", "status": "ready"},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done"},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

Verkrijg verrijkte instructies voor het aanmaken van een artefact of het toepassen van taken. Gebruikt door AI-agents om te begrijpen wat er als volgende gecreëerd moet worden.

```
openspec instructions [artefact] [opties]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `artefact` | Nee | Artefact-ID: `proposal`, `specs`, `design`, `tasks` of `apply` |

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--change <id>` | Wijzigingsnaam (vereist in niet-interactieve modus) |
| `--schema <naam>` | Schema-overschrijving |
| `--json` | Uitvoer als JSON |

**Speciaal geval:** Gebruik `apply` als artefact om instructies voor taakimplementatie te krijgen.

**Voorbeelden:**

```bash
# Instructies voor volgend artefact ophalen
openspec instructions --change add-dark-mode

# Specifieke artefactinstructies ophalen
openspec instructions design --change add-dark-mode

# Apply/implementatie-instructies ophalen
openspec instructions apply --change add-dark-mode

# JSON voor agentconsumptie
openspec instructions design --change add-dark-mode --json
```

**Uitvoer bevat:**

- Sjablooninhoud voor het artefact
- Projectcontext uit configuratie
- Inhoud van afhankelijke artefacten
- Per-artefactregels uit configuratie

---

### `openspec templates`

Toon opgeloste sjabloonpaden voor alle artefacten in een schema.

```
openspec templates [opties]
```

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--schema <naam>` | Schema om te inspecteren (standaard: `spec-driven`) |
| `--json` | Uitvoer als JSON |

**Voorbeelden:**

```bash
# Sjabloonpaden voor standaardschema weergeven
openspec templates

# Sjablonen voor aangepast schema weergeven
openspec templates --schema my-workflow

# JSON voor programmatisch gebruik
openspec templates --json
```

**Uitvoer (tekst):**

```
Schema: spec-driven

Sjablonen:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Lijst beschikbare workflowschema's met hun beschrijvingen en artefactstromen.

```
openspec schemas [opties]
```

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--json` | Uitvoer als JSON |

**Voorbeeld:**

```bash
openspec schemas
```

**Uitvoer:**

```
Beschikbare schema's:

  spec-driven (pakket)
    De standaard spec-driven ontwikkelingsworkflow
    Stroom: proposal → specs → design → tasks

  my-custom (project)
    Aangepaste workflow voor dit project
    Stroom: research → proposal → tasks
```

---

## Schema-opdrachten

Opdrachten voor het aanmaken en beheren van aangepaste workflowschema's.

### `openspec schema init`

Maak een nieuw projectlokaal schema aan.

```
openspec schema init <naam> [opties]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `naam` | Ja | Schema naam (kebab-case) |

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--description <tekst>` | Schema beschrijving |
| `--artifacts <lijst>` | Komma-gescheiden artifact IDs (standaard: `proposal,specs,design,tasks`) |
| `--default` | Instellen als standaard schema voor het project |
| `--no-default` | Niet vragen om als standaard in te stellen |
| `--force` | Bestaand schema overschrijven |
| `--json` | Uitvoer als JSON |

**Voorbeelden:**

```bash
# Interactieve schema aanmaak
openspec schema init research-first

# Niet-interactief met specifieke artifacts
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**Wat het aanmaakt:**

```
openspec/schemas/<naam>/
├── schema.yaml           # Schema definitie
└── templates/
    ├── proposal.md       # Sjabloon voor elk artifact
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Kopieer een bestaand schema naar je project voor aanpassing.

```
openspec schema fork <bron> [naam] [opties]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `bron` | Ja | Te kopiëren schema |
| `naam` | Nee | Nieuwe schema naam (standaard: `<bron>-custom`) |

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--force` | Bestaand doel overschrijven |
| `--json` | Uitvoer als JSON |

**Voorbeeld:**

```bash
# Fork het ingebouwde spec-driven schema
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Valideer de structuur en sjablonen van een schema.

```
openspec schema validate [naam] [opties]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `naam` | Nee | Te valideren schema (valideert alle als weggelaten) |

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--verbose` | Gedetailleerde validatiestappen tonen |
| `--json` | Uitvoer als JSON |

**Voorbeeld:**

```bash
# Valideer een specifiek schema
openspec schema validate my-workflow

# Valideer alle schema's
openspec schema validate
```

---

### `openspec schema which`

Toon waar een schema vandaan komt (nuttig voor het debuggen van voorrang).

```
openspec schema which [naam] [opties]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `naam` | Nee | Schema naam |

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--all` | Lijst alle schema's met hun bronnen |
| `--json` | Uitvoer als JSON |

**Voorbeeld:**

```bash
# Controleer waar een schema vandaan komt
openspec schema which spec-driven
```

**Uitvoer:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Schema voorrang:**

1. Project: `openspec/schemas/<naam>/`
2. Gebruiker: `~/.local/share/openspec/schemas/<naam>/`
3. Pakket: Ingebouwde schema's

---

## Configuratieopdrachten

### `openspec config`

Bekijk en wijzig de globale OpenSpec-configuratie.

```
openspec config <subopdracht> [opties]
```

**Subopdrachten:**

| Subopdracht | Beschrijving |
|-------------|--------------|
| `path` | Toon locatie van configuratiebestand |
| `list` | Toon alle huidige instellingen |
| `get <sleutel>` | Haal een specifieke waarde op |
| `set <sleutel> <waarde>` | Stel een waarde in |
| `unset <sleutel>` | Verwijder een sleutel |
| `reset` | Reset naar standaardwaarden |
| `edit` | Open in `$EDITOR` |
| `profile [preset]` | Configureer workflowprofiel interactief of via preset |

**Voorbeelden:**

```bash
# Toon configuratiebestandspad
openspec config path

# Lijst alle instellingen
openspec config list

# Haal een specifieke waarde op
openspec config get telemetry.enabled

# Stel een waarde in
openspec config set telemetry.enabled false

# Stel expliciet een tekenreekswaarde in
openspec config set user.name "My Name" --string

# Verwijder een aangepaste instelling
openspec config unset user.name

# Reset alle configuratie
openspec config reset --all --yes

# Bewerk configuratie in je editor
openspec config edit

# Configureer profiel met actiegebaseerde wizard
openspec config profile

# Snelle preset: schakel workflows over naar core (behoudt leveringsmodus)
openspec config profile core
```

`openspec config profile` begint met een samenvatting van de huidige status, en laat je dan kiezen:
- Wijzig levering + workflows
- Wijzig alleen levering
- Wijzig alleen workflows
- Behoud huidige instellingen (afsluiten)

Als je de huidige instellingen behoudt, worden er geen wijzigingen geschreven en wordt er geen update-aanmelding getoond.
Als er geen configuratiewijzigingen zijn, maar de huidige projectbestanden niet synchroniseren met je globale profiel/levering, toont OpenSpec een waarschuwing en stelt voor om `openspec update` uit te voeren.
Het indrukken van `Ctrl+C` annuleert ook de stroom netjes (geen stack trace) en sluit af met exitcode `130`.
In de workflow-checklijst betekent `[x]` dat de workflow is geselecteerd in de globale configuratie. Om die selecties op projectbestanden toe te passen, voer je `openspec update` uit (of kies je `Wijzigingen nu op dit project toepassen?` wanneer je daarom gevraagd wordt binnen een project).

**Interactieve voorbeelden:**

```bash
# Alleen leveringsupdate
openspec config profile
# kies: Wijzig alleen levering
# kies levering: Alleen Skills

# Alleen workflows-update
openspec config profile
# kies: Wijzig alleen workflows
# schakel workflows in de checklijst, bevestig dan
```

---

## Hulpprogramma-opdrachten

### `openspec feedback`

Dien feedback in over OpenSpec. Maakt een GitHub-issue aan.

```
openspec feedback <bericht> [opties]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `bericht` | Ja | Feedback bericht |

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--body <tekst>` | Gedetailleerde beschrijving |

**Vereisten:** GitHub CLI (`gh`) moet geïnstalleerd en geauthenticeerd zijn.

**Voorbeeld:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Beheer shell-aanvullingen voor de OpenSpec CLI.

```
openspec completion <subopdracht> [shell]
```

**Subopdrachten:**

| Subopdracht | Beschrijving |
|-------------|--------------|
| `generate [shell]` | Voer aanvullingsscript uit naar stdout |
| `install [shell]` | Installeer aanvulling voor je shell |
| `uninstall [shell]` | Verwijder geïnstalleerde aanvullingen |

**Ondersteunde shells:** `bash`, `zsh`, `fish`, `powershell`

**Voorbeelden:**

```bash
# Installeer aanvullingen (detecteert shell automatisch)
openspec completion install

# Installeer voor specifieke shell
openspec completion install zsh

# Genereer script voor handmatige installatie
openspec completion generate bash > ~/.bash_completion.d/openspec

# Verwijder
openspec completion uninstall
```

---

## Exitcodes

| Code | Betekenis |
|------|-----------|
| `0` | Succes |
| `1` | Fout (validatiefout, ontbrekende bestanden, enz.) |

---

## Omgevingsvariabelen

| Variabele | Beschrijving |
|-----------|--------------|
| `OPENSPEC_TELEMETRY` | Zet op `0` om telemetrie uit te schakelen |
| `DO_NOT_TRACK` | Zet op `1` om telemetrie uit te schakelen (standaard DNT-signaal) |
| `OPENSPEC_CONCURRENCY` | Standaard gelijktijdigheid voor bulkvalidatie (standaard: 6) |
| `EDITOR` of `VISUAL` | Editor voor `openspec config edit` |
| `NO_COLOR` | Schakel kleurenuitvoer uit wanneer ingesteld |

---

## Gerelateerde documentatie

- [Opdrachten](commands.md) - AI slash-opdrachten (`/opsx:propose`, `/opsx:apply`, enz.)
- [Workflows](workflows.md) - Veelgebruikte patronen en wanneer je elke opdracht gebruikt
- [Aanpassing](customization.md) - Maak aangepaste schema's en sjablonen
- [Aan de slag](getting-started.md) - Eerste installatiegids