# CLI-referentie

De OpenSpec CLI (`openspec`) biedt terminalcommando's voor projectconfiguratie, validatie, statusinspectie en beheer. Deze commando's vullen de AI-slashcommando's (zoals `/opsx:propose`) aan die zijn gedocumenteerd in [Commands](commands.md).

## Samenvatting

| Categorie | Commando's | Doel |
|-----------|------------|------|
| **Configuratie** | `init`, `update` | OpenSpec in uw project initialiseren en bijwerken |
| **Werkruimtes (bèta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace open` | Planning over gekoppelde repositories of mappen opzetten |
| **Doorbladeren** | `list`, `view`, `show` | Wijzigingen en specificaties verkennen |
| **Validatie** | `validate` | Wijzigingen en specificaties op problemen controleren |
| **Levenscyclus** | `archive` | Voltooide wijzigingen afronden |
| **Werkstroom** | `status`, `instructions`, `templates`, `schemas` | Ondersteuning voor artefactgestuurde werkstromen |
| **Schema's** | `schema init`, `schema fork`, `schema validate`, `schema which` | Aangepaste werkstromen aanmaken en beheren |
| **Configuratie** | `config` | Instellingen bekijken en wijzigen |
| **Hulpprogramma's** | `feedback`, `completion` | Feedback en shell-integratie |

---

## Mens vs Agent-opdrachten

De meeste CLI-opdrachten zijn ontworpen voor **menselijk gebruik** in een terminal. Sommige opdrachten ondersteunen ook **agent/scriptgebruik** via JSON-uitvoer.

### Alleen voor Mensen Bedoelde Opdrachten

Deze opdrachten zijn interactief en ontworpen voor gebruik in de terminal:

| Opdracht | Doel |
|----------|------|
| `openspec init` | Project initialiseren (interactieve prompts) |
| `openspec view` | Interactief dashboard |
| `openspec config edit` | Configuratie openen in editor |
| `openspec feedback` | Feedback indienen via GitHub |
| `openspec completion install` | Shell-completies installeren |

### Agent-compatibele Opdrachten

Deze opdrachten ondersteunen `--json`-uitvoer voor programmatisch gebruik door AI-agents en scripts:

| Opdracht | Menselijk Gebruik | Agent-gebruik |
|----------|-------------------|---------------|
| `openspec list` | Wijzigingen/specs doorbladeren | `--json` voor gestructureerde gegevens |
| `openspec show <item>` | Inhoud lezen | `--json` voor parsing |
| `openspec validate` | Controleren op problemen | `--all --json` voor bulkvalidatie |
| `openspec status` | Voortgang van artefacten bekijken | `--json` voor gestructureerde status |
| `openspec instructions` | Volgende stappen ophalen | `--json` voor agent-instructies |
| `openspec templates` | Sjabloonpaden zoeken | `--json` voor padresolutie |
| `openspec schemas` | Beschikbare schema's weergeven | `--json` voor schema-ontdekking |
| `openspec workspace setup --no-interactive` | Een werkruimte aanmaken met expliciete invoer | `--json` voor gestructureerde setup-uitvoer |
| `openspec workspace list` | Bekende werkruimtes doorbladeren | `--json` voor getypeerde werkruimte-objecten |
| `openspec workspace link` | Een repo of map koppelen | `--json` voor gestructureerde koppelingsuitvoer |
| `openspec workspace relink` | Een gekoppeld pad herstellen | `--json` voor gestructureerde koppelingsuitvoer |
| `openspec workspace doctor` | Eén werkruimte controleren | `--json` voor gestructureerde statusuitvoer |

---

## Globale Opties

Deze opties werken met alle opdrachten:

| Optie | Beschrijving |
|-------|--------------|
| `--version`, `-V` | Versienummer weergeven |
| `--no-color` | Kleuruitvoer uitschakelen |
| `--help`, `-h` | Help voor opdracht weergeven |

---

## Setup-opdrachten

### `openspec init`

Initialiseer OpenSpec in uw project. Maakt de mapstructuur aan en configureert AI-toolintegraties.

Standaardgedrag gebruikt globale configuratiestandaarden: profiel `core`, levering `both`, workflows `propose, explore, apply, sync, archive`.

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
| `--tools <lijst>` | AI-tools niet-interactief configureren. Gebruik `all`, `none` of een kommagescheiden lijst |
| `--force` | Verouderde bestanden automatisch opruimen zonder melding |
| `--profile <profiel>` | Globaal profiel overschrijven voor deze init-run (`core` of `custom`) |

`--profile custom` gebruikt de momenteel geselecteerde workflows in de globale configuratie (`openspec config profile`).

**Ondersteunde tool-ID's (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**Voorbeelden:**

```bash
# Interactieve initialisatie
openspec init

# Initialiseren in een specifieke map
openspec init ./mijn-project

# Niet-interactief: configureren voor Claude en Cursor
openspec init --tools claude,cursor

# Configureren voor alle ondersteunde tools
openspec init --tools all

# Profiel overschrijven voor deze run
openspec init --profile core

# Prompts overslaan en verouderde bestanden automatisch opruimen
openspec init --force
```

**Wat het aanmaakt:**

```
openspec/
├── specs/              # Uw specificaties (bron van waarheid)
├── changes/            # Voorgestelde wijzigingen
└── config.yaml         # Projectconfiguratie

.claude/skills/         # Claude Code-vaardigheden (indien claude geselecteerd)
.cursor/skills/         # Cursor-vaardigheden (indien cursor geselecteerd)
.cursor/commands/       # Cursor OPSX-opdrachten (indien levering opdrachten omvat)
... (andere toolconfiguraties)
```

---

### `openspec update`

Werk OpenSpec-instructiebestanden bij na het upgraden van de CLI. Her-genereert AI-toolconfiguratiebestanden met behulp van uw huidige globale profiel, geselecteerde workflows en leveringsmodus.

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
| `--force` | Update forceren, zelfs wanneer bestanden up-to-date zijn |

**Voorbeeld:**

```bash
# Instructiebestanden bijwerken na npm-upgrade
npm update @fission-ai/openspec
openspec update
```

---

## Werkruimte-opdrachten

Werkruimte-opdrachten zijn in actieve ontwikkeling en nog niet klaar voor gebruik. Bouw geen externe automatisering, integraties of langlopende workflows bovenop dit opdrachtoppervlak; het gedrag van opdrachten, statusbestanden en JSON-uitvoer kan op elk moment veranderen.

Coördinatiewerkruimtes zijn planningslocaties voor werk dat meerdere repos of mappen overspant. Werkruimtezichtbaarheid is geen wijzigingscommitment: koppel de repos of mappen die OpenSpec moet kennen, en maak vervolgens wijzigingen aan wanneer u klaar bent om specifiek werk te plannen.

### `openspec workspace setup`

Maak een werkruimte aan op de standaard OpenSpec-werkruimtelocatie en koppel ten minste één bestaande repo of map.

```bash
openspec workspace setup [opties]
```

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--name <naam>` | Werkruimtenaam. Namen moeten kebab-case zijn |
| `--link <pad>` | Koppel een bestaande repo of map en leid de koppelingsnaam af van de mapnaam |
| `--link <naam>=<pad>` | Koppel een bestaande repo of map met een expliciete koppelingsnaam |
| `--opener <id>` | Sla een voorkeursopener op tijdens niet-interactieve setup: `codex`, `claude`, `github-copilot` of `editor` |
| `--no-interactive` | Prompts uitschakelen; vereist `--name` en ten minste één `--link` |
| `--json` | JSON uitvoeren; vereist `--no-interactive` |

**Voorbeelden:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

Interactieve setup vraagt om een voorkeursopener en slaat deze op in de machine-lokale werkruimtestatus. Niet-interactieve setup slaat een voorkeursopener alleen op wanneer `--opener` is opgegeven; anders vraagt `workspace open` later in interactieve terminals wanneer een ondersteunde opener beschikbaar is, of vraagt scripts om `--agent <tool>` of `--editor` door te geven.

### `openspec workspace list`

Geef bekende OpenSpec-werkruimtes weer vanuit het lokale register.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

De lijst toont elke werkruimtelocatie en gekoppelde repos of mappen. Verouderde registerrecords worden gerapporteerd maar niet gewijzigd.

### `openspec workspace link`

Registreer een bestaande repo of map voor één werkruimte.

```bash
openspec workspace link [naam] <pad> [opties]
```

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--workspace <naam>` | Selecteer een bekende werkruimte uit het lokale register |
| `--json` | JSON uitvoeren |
| `--no-interactive` | Werkruimtekiezer-prompts uitschakelen |

**Voorbeelden:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

Het pad moet al bestaan. Relatieve paden worden opgelost ten opzichte van de huidige map van de opdracht voordat OpenSpec het geverifieerde absolute pad opslaat in de machine-lokale werkruimtestatus. Gekoppelde paden kunnen volledige repos, pakketten, services, apps of mappen zijn zonder repo-lokale `openspec/`-status.

### `openspec workspace relink`

Herstel of wijzig het lokale pad voor een bestaande koppeling.

```bash
openspec workspace relink <naam> <pad> [opties]
```

Het pad moet al bestaan. Relink werkt alleen het machine-lokale pad bij voor de stabiele koppelingsnaam.

### `openspec workspace doctor`

Controleer wat één werkruimte op de huidige machine kan oplossen.

```bash
openspec workspace doctor [opties]
```

Doctor toont de werkruimtelocatie, het planningspad, gekoppelde repos of mappen, ontbrekende paden, repo-lokale specificatiepaden indien aanwezig, en voorgestelde oplossingen. Het rapporteert alleen problemen; het herstelt ze niet automatisch.

Opdrachten die één werkruimte nodig hebben, gebruiken de huidige werkruimte wanneer ze vanuit een werkruimtemap of submap worden uitgevoerd. Van elders, geef `--workspace <naam>` door, selecteer uit de kiezer in een interactieve terminal, of vertrouw op de enige bekende werkruimte wanneer er precies één bestaat. In `--json` of `--no-interactive` modus mislukt een dubbelzinnige selectie met een gestructureerde statusfout en stelt `--workspace <naam>` voor.

JSON-antwoorden gebruiken getypeerde objecten plus `status`-arrays. Primaire gegevens bevinden zich in `workspace`, `workspaces` of `link`; waarschuwingen en fouten bevinden zich in `status`.

### `openspec workspace open`

Open een werkruimtewerkset via de opgeslagen voorkeursopener, een eenmalige agent-overschrijving of VS Code-editor-modus.

```bash
openspec workspace open [naam] [opties]
```

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--workspace <naam>` | Alias voor de positionele werkruimtenaam |
| `--agent <tool>` | Eenmalige agent-overschrijving: `codex`, `claude` of `github-copilot` |
| `--editor` | Open het onderhouden VS Code-werkruimtebestand als een normaal editor-werkruimte |
| `--no-interactive` | Werkruimte- en openerkiezer-prompts uitschakelen |

**Voorbeelden:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex
openspec workspace open --editor
```

`workspace open` gebruikt de huidige werkruimte wanneer er vanuit één wordt uitgevoerd, selecteert automatisch de enige bekende werkruimte wanneer elders wordt uitgevoerd, en vraagt de gebruiker om te kiezen wanneer meerdere werkruimtes bekend zijn. `--agent` en `--editor` wijzigen niet de opgeslagen voorkeursopener. Het doorgeven van beide opener-overschrijvingen is een fout; kies ofwel `--agent <tool>` of `--editor`.

OpenSpec onderhoudt `<werkruimte-naam>.code-workspace` in de werkruimteroot voor VS Code-editor en GitHub Copilot-in-VS-Code opens. Dat bestand is machine-lokaal en wordt standaard genegeerd met een specifieke `<werkruimte-naam>.code-workspace` `.gitignore`-regel, zodat door de gebruiker aangemaakte `*.code-workspace`-bestanden in aanmerking blijven komen voor tracking.

Het onderhouden VS Code-werkruimte omvat de coördinatieroot als `.` plus geldige gekoppelde repos of mappen als extra roots. VS Code geeft die items weer als een multi-root werkruimte.

Root-werkruimte-open ondersteunt verkenning en planning over gekoppelde repos of mappen. Implementatiebewerkingen moeten pas beginnen na een expliciet verzoek van de gebruiker en een normaal OpenSpec-implementatieworkflow.

---

## Bladercommando's

### `openspec list`

Lijst wijzigingen of specificaties in je project.

```
openspec list [options]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--specs` | Lijst specificaties in plaats van wijzigingen |
| `--changes` | Lijst wijzigingen (standaard) |
| `--sort <order>` | Sorteer op `recent` (standaard) of `name` |
| `--json` | Uitvoer als JSON |

**Voorbeelden:**

```bash
# Lijst alle actieve wijzigingen
openspec list

# Lijst alle specificaties
openspec list --specs

# JSON-uitvoer voor scripts
openspec list --json
```

**Uitvoer (tekst):**

```
Actieve wijzigingen:
  add-dark-mode     Ondersteuning voor themawisseling in de UI
  fix-login-bug     Afhandeling van sessie-timeout
```

---

### `openspec view`

Toon een interactief dashboard om specificaties en wijzigingen te verkennen.

```
openspec view
```

Opent een terminalgebaseerde interface voor het navigeren door de specificaties en wijzigingen van je project.

---

### `openspec show`

Toon details van een wijziging of specificatie.

```
openspec show [item-naam] [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `item-naam` | Nee | Naam van wijziging of specificatie (wordt gevraagd indien weggelaten) |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--type <type>` | Specificeer type: `change` of `spec` (automatisch gedetecteerd indien eenduidig) |
| `--json` | Uitvoer als JSON |
| `--no-interactive` | Schakel prompts uit |

**Wijziging-specifieke opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--deltas-only` | Toon alleen delta-specificaties (JSON-modus) |

**Specificatie-specifieke opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--requirements` | Toon alleen vereisten, sluit scenario's uit (JSON-modus) |
| `--no-scenarios` | Sluit scenario-inhoud uit (JSON-modus) |
| `-r, --requirement <id>` | Toon specifieke vereiste op basis van 1-gebaseerde index (JSON-modus) |

**Voorbeelden:**

```bash
# Interactieve selectie
openspec show

# Toon een specifieke wijziging
openspec show add-dark-mode

# Toon een specifieke specificatie
openspec show auth --type spec

# JSON-uitvoer voor verwerking
openspec show add-dark-mode --json
```

---

## Validatiecommando's

### `openspec validate`

Valideer wijzigingen en specificaties op structurele problemen.

```
openspec validate [item-naam] [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `item-naam` | Nee | Specifiek item om te valideren (wordt gevraagd indien weggelaten) |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--all` | Valideer alle wijzigingen en specificaties |
| `--changes` | Valideer alle wijzigingen |
| `--specs` | Valideer alle specificaties |
| `--type <type>` | Specificeer type wanneer naam eenduidig is: `change` of `spec` |
| `--strict` | Schakel strikte validatiemodus in |
| `--json` | Uitvoer als JSON |
| `--concurrency <n>` | Maximaal aantal parallelle validaties (standaard: 6, of `OPENSPEC_CONCURRENCY` env) |
| `--no-interactive` | Schakel prompts uit |

**Voorbeelden:**

```bash
# Interactieve validatie
openspec validate

# Valideer een specifieke wijziging
openspec validate add-dark-mode

# Valideer alle wijzigingen
openspec validate --changes

# Valideer alles met JSON-uitvoer (voor CI/scripts)
openspec validate --all --json

# Strikte validatie met verhoogde paralleliteit
openspec validate --all --strict --concurrency 12
```

**Uitvoer (tekst):**

```
Validatie van add-dark-mode...
  ✓ proposal.md geldig
  ✓ specs/ui/spec.md geldig
  ⚠ design.md: ontbrekende sectie "Technical Approach"

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
        "warnings": ["design.md: ontbrekende sectie 'Technical Approach'"]
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

Archiveer een voltooide wijziging en voeg delta-specificaties samen in de hoofdspecificaties.

```
openspec archive [change-name] [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `change-name` | Nee | Te archiveren wijziging (wordt gevraagd indien weggelaten) |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `-y, --yes` | Sla bevestigingsvragen over |
| `--skip-specs` | Sla specificatie-updates over (voor infrastructuur/tooling/documentatie-wijzigingen) |
| `--no-validate` | Sla validatie over (vereist bevestiging) |

**Voorbeelden:**

```bash
# Interactieve archivering
openspec archive

# Specifieke wijziging archiveren
openspec archive add-dark-mode

# Archiveren zonder vragen (CI/scripts)
openspec archive add-dark-mode --yes

# Een tooling-wijziging archiveren die geen invloed heeft op specificaties
openspec archive update-ci-config --skip-specs
```

**Wat het doet:**

1. Valideert de wijziging (tenzij `--no-validate`)
2. Vraagt om bevestiging (tenzij `--yes`)
3. Voegt delta-specificaties samen in `openspec/specs/`
4. Verplaatst de wijzigingsmap naar `openspec/changes/archive/YYYY-MM-DD-<naam>/`

---

## Workflowcommando's

Deze commando's ondersteunen de op artefacten gebaseerde OPSX-workflow. Ze zijn nuttig voor zowel mensen die de voortgang controleren als agents die de volgende stappen bepalen.

### `openspec status`

Toon de voltooiingsstatus van artefacten voor een wijziging.

```
openspec status [options]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--change <id>` | Wijzigingsnaam (wordt gevraagd indien weggelaten) |
| `--schema <name>` | Schema-overschrijving (automatisch gedetecteerd uit de configuratie van de wijziging) |
| `--json` | Uitvoer als JSON |

**Voorbeelden:**

```bash
# Interactieve statuscontrole
openspec status

# Status voor een specifieke wijziging
openspec status --change add-dark-mode

# JSON voor gebruik door agents
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

Verkrijg verrijkte instructies voor het aanmaken van een artefact of het toepassen van taken. Gebruikt door AI-agents om te begrijpen wat ze vervolgens moeten aanmaken.

```
openspec instructions [artifact] [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `artifact` | Nee | Artefact-ID: `proposal`, `specs`, `design`, `tasks`, of `apply` |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--change <id>` | Wijzigingsnaam (vereist in niet-interactieve modus) |
| `--schema <name>` | Schema-overschrijving |
| `--json` | Uitvoer als JSON |

**Bijzonder geval:** Gebruik `apply` als artefact om implementatie-instructies voor taken te verkrijgen.

**Voorbeelden:**

```bash
# Instructies voor het volgende artefact ophalen
openspec instructions --change add-dark-mode

# Specifieke artefactinstructies ophalen
openspec instructions design --change add-dark-mode

# Implementatieinstructies ophalen
openspec instructions apply --change add-dark-mode

# JSON voor agentgebruik
openspec instructions design --change add-dark-mode --json
```

**Uitvoer bevat:**

- Sjabloongegevens voor het artefact
- Projectcontext uit configuratie
- Inhoud van afhankelijke artefacten
- Per-artefactregels uit configuratie

---

### `openspec templates`

Toon opgeloste sjabloonpaden voor alle artefacten in een schema.

```
openspec templates [options]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--schema <name>` | Te inspecteren schema (standaard: `spec-driven`) |
| `--json` | Uitvoer als JSON |

**Voorbeelden:**

```bash
# Toon sjabloonpaden voor standaardschema
openspec templates

# Toon sjablonen voor aangepast schema
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

Geef beschikbare workflowschema's weer met hun beschrijvingen en artefactstromen.

```
openspec schemas [options]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--json` | Uitvoer als JSON |

**Voorbeeld:**

```bash
openspec schemas
```

**Uitvoer:**

```
Beschikbare schema's:

  spec-driven (package)
    De standaard spec-driven ontwikkelingsworkflow
    Stroom: proposal → specs → design → tasks

  my-custom (project)
    Aangepaste workflow voor dit project
    Stroom: research → proposal → tasks
```

---

## Schemacommando's

Commando's voor het aanmaken en beheren van aangepaste workflowschema's.

### `openspec schema init`

Maak een nieuw projectlokaal schema aan.

```
openspec schema init <name> [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `name` | Ja | Schemanaam (kebab-case) |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--description <text>` | Schemabeschrijving |
| `--artifacts <list>` | Door komma's gescheiden artefact-ID's (standaard: `proposal,specs,design,tasks`) |
| `--default` | Instellen als projectschemas |
| `--no-default` | Niet vragen om als standaard in te stellen |
| `--force` | Bestaand schema overschrijven |
| `--json` | Uitvoer als JSON |

**Voorbeelden:**

```bash
# Interactieve schema-creatie
openspec schema init research-first

# Niet-interactief met specifieke artefacten
openspec schema init rapid \
  --description "Snelle iteratieworkflow" \
  --artifacts "proposal,tasks" \
  --default
```

**Wat het aanmaakt:**

```
openspec/schemas/<naam>/
├── schema.yaml           # Schemadefinitie
└── templates/
    ├── proposal.md       # Sjabloon voor elk artefact
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Kopieer een bestaand schema naar je project voor aanpassing.

```
openspec schema fork <source> [name] [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `source` | Ja | Te kopiëren schema |
| `name` | Nee | Nieuwe schemanaam (standaard: `<bron>-custom`) |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--force` | Bestaande bestemming overschrijven |
| `--json` | Uitvoer als JSON |

**Voorbeeld:**

```bash
# Het ingebouwde spec-driven schema forken
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Valideer de structuur en sjablonen van een schema.

```
openspec schema validate [name] [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `name` | Nee | Te valideren schema (valideert alles indien weggelaten) |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--verbose` | Toon gedetailleerde validatiestappen |
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

Toon waar een schema vandaan wordt opgelost (nuttig voor het debuggen van voorrang).

```
openspec schema which [name] [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `name` | Nee | Schemanaam |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--all` | Geef alle schema's weer met hun bronnen |
| `--json` | Uitvoer als JSON |

**Voorbeeld:**

```bash
# Controleer waar een schema vandaan komt
openspec schema which spec-driven
```

**Uitvoer:**

```
spec-driven wordt opgelost vanuit: package
  Bron: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Schemavoorrang:**

1. Project: `openspec/schemas/<naam>/`
2. Gebruiker: `~/.local/share/openspec/schemas/<naam>/`
3. Package: Ingebouwde schema's

---

## Configuratiecommando's

### `openspec config`

Bekijk en wijzig de globale OpenSpec-configuratie.

```
openspec config <subcommand> [options]
```

**Subcommando's:**

| Subcommando | Beschrijving |
|------------|-------------|
| `path` | Toon locatie van het configuratiebestand |
| `list` | Toon alle huidige instellingen |
| `get <key>` | Haal een specifieke waarde op |
| `set <key> <value>` | Stel een waarde in |
| `unset <key>` | Verwijder een sleutel |
| `reset` | Herstel naar standaardwaarden |
| `edit` | Open in `$EDITOR` |
| `profile [preset]` | Configureer het workflowprofiel interactief of via een preset |

**Voorbeelden:**

```bash
# Toon pad naar configuratiebestand
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

# Herstel alle configuratie
openspec config reset --all --yes

# Bewerk configuratie in je editor
openspec config edit

# Configureer profiel met een op actie gebaseerde wizard
openspec config profile

# Snelle preset: schakel workflows naar core (behoudt leveringsmodus)
openspec config profile core
```

`openspec config profile` begint met een overzicht van de huidige status, waarna je kunt kiezen:
- Wijzig levering + workflows
- Wijzig alleen levering
- Wijzig alleen workflows
- Behoud huidige instellingen (afsluiten)

Als je de huidige instellingen behoudt, worden er geen wijzigingen geschreven en wordt er geen updateprompt getoond.
Als er geen configuratiewijzigingen zijn, maar de huidige projectbestanden niet synchroon lopen met je globale profiel/levering, toont OpenSpec een waarschuwing en stelt voor `openspec update` uit te voeren.
Het indrukken van `Ctrl+C` annuleert het proces ook netjes (geen stacktrace) en sluit af met code `130`.
In de workflowchecklist betekent `[x]` dat de workflow is geselecteerd in de globale configuratie. Om deze selecties op projectbestanden toe te passen, voer je `openspec update` uit (of kies je `Apply changes to this project now?` wanneer je daarom wordt gevraagd binnen een project).

**Interactieve voorbeelden:**

```bash
# Alleen levering bijwerken
openspec config profile
# kies: Change delivery only
# kies levering: Skills only

# Alleen workflows bijwerken
openspec config profile
# kies: Change workflows only
# schakel workflows in de checklist, bevestig dan
```

---

## Hulpcommando's

### `openspec feedback`

Dien feedback over OpenSpec in. Maakt een GitHub-issue aan.

```
openspec feedback <message> [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `message` | Ja | Feedbackbericht |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--body <text>` | Gedetailleerde beschrijving |

**Vereisten:** GitHub CLI (`gh`) moet zijn geïnstalleerd en geauthenticeerd.

**Voorbeeld:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Beheer shell-completies voor de OpenSpec CLI.

```
openspec completion <subcommand> [shell]
```

**Subcommando's:**

| Subcommando | Beschrijving |
|------------|-------------|
| `generate [shell]` | Voer completiescript uit naar stdout |
| `install [shell]` | Installeer completie voor je shell |
| `uninstall [shell]` | Verwijder geïnstalleerde completies |

**Ondersteunde shells:** `bash`, `zsh`, `fish`, `powershell`

**Voorbeelden:**

```bash
# Installeer completies (detecteert shell automatisch)
openspec completion install

# Installeer voor een specifieke shell
openspec completion install zsh

# Genereer script voor handmatige installatie
openspec completion generate bash > ~/.bash_completion.d/openspec

# Verwijderen
openspec completion uninstall
```

---

## Afsluitcodes

| Code | Betekenis |
|------|---------|
| `0` | Succes |
| `1` | Fout (validatiefout, ontbestanden, etc.) |

---

## Omgevingsvariabelen

| Variabele | Beschrijving |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Stel in op `0` om telemetrie uit te schakelen |
| `DO_NOT_TRACK` | Stel in op `1` om telemetrie uit te schakelen (standaard DNT-signaal) |
| `OPENSPEC_CONCURRENCY` | Standaard gelijktijdigheid voor bulkvalidatie (standaard: 6) |
| `EDITOR` of `VISUAL` | Editor voor `openspec config edit` |
| `NO_COLOR` | Schakel kleuruitvoer uit wanneer ingesteld |

---

## Gerelateerde Documentatie

- [Commando's](commands.md) - AI-slashcommando's (`/opsx:propose`, `/opsx:apply`, etc.)
- [Workflows](workflows.md) - Veelgebruikte patronen en wanneer elk commando te gebruiken
- [Aanpassing](customization.md) - Maak aangepaste schema's en sjablonen
- [Aan de slag](getting-started.md) - Eerste installatiehandleiding