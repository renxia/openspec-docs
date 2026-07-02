# CLI Referentie

De OpenSpec CLI (`openspec`) biedt terminalcommando's voor projectopzet, validatie, statusinspectie en beheer. Deze commando's vullen de AI slash-commando's (zoals `/opsx:propose`) aan die gedocumenteerd zijn in [Commands](commands.md).

## Overzicht

| Categorie | Commando's | Doel |
|----------|----------|---------|
| **Opzet** | `init`, `update` | Initialiseer en update OpenSpec in uw project |
| **Opslagplaatsen (standalone OpenSpec repos)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Beheer opslagplaatsen - standalone OpenSpec repositories die u heeft geregistreerd |
| **Gezondheid** | `doctor` | Rapporteer de gezondheid van relaties voor de opgeloste root |
| **Werkcontext** | `context` | Stel de werkschat (root + gerefereerde opslagplaatsen) samen |
| **Persoonlijke werksets** | `workset create`, `workset list`, `workset open`, `workset remove` | Bewaar en open persoonlijke, lokale werkweergaven in uw tool |
| **Doorbladeren** | `list`, `view`, `show` | Verken wijzigingen en specificaties |
| **Validatie** | `validate` | Controleer wijzigingen en specificaties op problemen |
| **Levenscyclus** | `archive` | Voltooi de geregistreerde wijzigingen |
| **Werkstroom** | `new change`, `status`, `instructions`, `templates`, `schemas` | Ondersteuning voor werkstromen op basis van artefacten |
| **Schema's** | `schema init`, `schema fork`, `schema validate`, `schema which` | Creëer en beheer aangepaste werkstromen |
| **Configuratie** | `config` | Bekijk en wijzig instellingen |
| **Nutsvoorziening** | `feedback`, `completion` | Feedback en shell-integratie |

---

## Human vs Agent Commands

De meeste CLI-commando's zijn ontworpen voor **gebruik door mensen** in een terminal. Sommige commando's ondersteunen ook **agent-/scriptgebruik** via JSON-uitvoer.

### Human-Only Commands

Deze commando's zijn interactief en bedoeld voor terminaal gebruik:

| Command | Doel |
|---------|------|
| `openspec init` | Project initialiseren (interactieve prompts) |
| `openspec view` | Interactief dashboard |
| `openspec workset open <name>` | Een opgeslagen werkset openen (editorvenster of terminal agent sessie) |
| `openspec config edit` | Config in editor openen |
| `openspec feedback` | Feedback indienen via GitHub |
| `openspec completion install` | Shell completions installeren |

### Agent-Compatible Commands

Deze commando's ondersteunen `--json`-uitvoer voor programmeerbaar gebruik door AI agents en scripts:

| Command | Human Use (Gebruik door mens) | Agent Use (Agentgebruik) |
|---------|-------------------------------|--------------------------|
| `openspec list` | Wijzigingen/specificaties bekijken | `--json` voor gestructureerde gegevens |
| `openspec show <item>` | Inhoud lezen | `--json` voor parsing |
| `openspec validate` | Op zoek gaan naar problemen | `--all --json` voor bulkvalidatie |
| `openspec status` | Artifact voortgang bekijken | `--json` voor gestructureerde status |
| `openspec instructions` | Volgende stappen krijgen | `--json` voor agentinstructies |
| `openspec templates` | Templatepaden vinden | `--json` voor padresolutie |
| `openspec schemas` | Beschikbare schema's weergeven | `--json` voor schema-ontdekking |
| `openspec store setup <id>` | Een lokale store aanmaken en registreren | `--json` met expliciete inputs voor gestructureerde uitvoer van de setup |
| `openspec store register <path>` | Een bestaande store registreren | `--json` voor gestructureerde registratie-uitvoer |
| `openspec store unregister <id>` | Een lokale storeregistratie vergeten | `--json` voor gestructureerde opruimingsuitvoer |
| `openspec store remove <id>` | Een geregistreerde lokale store map verwijderen | `--yes --json` voor niet-interactieve verwijdering |
| `openspec store list` | Geregistreerde stores bekijken | `--json` voor gestructureerde registraties |
| `openspec store doctor` | Lokale store setup controleren | `--json` voor gestructureerde diagnostiek |
| `openspec new change <id>` | Repo-lokale wijzigingsscaffolding aanmaken | `--json`, plus `--store <id>` om een geregistreerde store te gebruiken als de OpenSpec root |
| `openspec workset create [name]` | Een persoonlijk werkvenster samenstellen | `--member <path> --json` voor niet-interactieve compositie |
| `openspec workset list` | Opgeslagen werksets bekijken | `--json` voor gestructureerde weergaven |
| `openspec workset remove <name>` | Een opgeslagen weergave verwijderen | `--yes --json` voor niet-interactieve verwijdering |

---

## Global Options (Globale Opties)

Deze opties werken met alle commando's:

| Option | Description (Beschrijving) |
|--------|-----------------------------|
| `--version`, `-V` | Versienummer weergeven |
| `--no-color` | Kleuruitvoer uitschakelen |
| `--help`, `-h` | Hulp voor commando weergeven |

---

## Setup Commands (Setup Commando's)

### `openspec init`

Initialiseer OpenSpec in uw project. Maakt de mapstructuur aan en configureert AI-toolintegraties.

Het standaardgedrag gebruikt globale configuratie-standaarden: profiel `core`, levering `both`, workflows `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Arguments (Argumenten):**

| Argument | Required (Vereist) | Description (Beschrijving) |
|----------|--------------------|-----------------------------|
| `path` | No (Nee) | Doelmap (standaard: huidige map) |

**Options (Opties):**

| Option | Description (Beschrijving) |
|--------|-----------------------------|
| `--tools <list>` | AI-tools niet-interactief configureren. Gebruik `all`, `none` of een komma-gescheiden lijst |
| `--force` | Legacy bestanden automatisch opruimen zonder te vragen |
| `--profile <profile>` | Het globale profiel voor deze init-run overschrijven (`core` of `custom`) |

`--profile custom` gebruikt de workflows die momenteel zijn geselecteerd in de globale configuratie (`openspec config profile`).

**Supported tool IDs (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

> Deze lijst weerspiegelt `AI_TOOLS` in `src/core/config.ts`. Zie [Supported Tools](supported-tools.md) voor de vaardigheden en commando paden van elke tool.

**Examples (Voorbeelden):**

```bash
# Interactieve initialisatie
openspec init

# Initialiseren in een specifieke map
openspec init ./my-project

# Niet-interactief: configureren voor Claude en Cursor
openspec init --tools claude,cursor

# Configureren voor alle ondersteunde tools
openspec init --tools all

# Profiel overschrijven voor deze run
openspec init --profile core

# Prompts overslaan en legacy bestanden automatisch opruimen
openspec init --force
```

**What it creates (Wat het aanmaakt):**

```
openspec/
├── specs/              # Uw specificaties (waarheidscentrum)
├── changes/            # Voorgestelde wijzigingen
└── config.yaml         # Projectconfiguratie

.claude/skills/         # Claude Code vaardigheden (indien claude geselecteerd is)
.cursor/skills/         # Cursor vaardigheden (indien cursor geselecteerd is)
.cursor/commands/       # Cursor OPSX commando's (indien levering commando's bevat)
... (andere toolconfiguratiebestanden)
```

---

### `openspec update`

Update de OpenSpec instructiebestanden na het upgraden van de CLI. Genereert opnieuw AI-toolconfiguratiebestanden met behulp van uw huidige globale profiel, geselecteerde workflows en leveringsmodus.

```
openspec update [path] [options]
```

**Arguments (Argumenten):**

| Argument | Required (Vereist) | Description (Beschrijving) |
|----------|--------------------|-----------------------------|
| `path` | No (Nee) | Doelmap (standaard: huidige map) |

**Options (Opties):**

| Option | Description (Beschrijving) |
|--------|-----------------------------|
| `--force` | Dwing update af, zelfs als de bestanden up-to-date zijn |

**Example (Voorbeeld):**

```bash
# Instructiebestanden updaten na npm upgrade
npm update @fission-ai/openspec
openspec update
```

---

## Stores (standalone OpenSpec repos)

> **Beta.** Stores en de functies die erop gebaseerd zijn (referenties, werkcontext, worksets) zijn nieuw; commando'snamen, vlaggen, bestandsformaten en JSON-uitvoer kunnen tussen releases veranderen. Voor de problem-first walkthrough, zie de [stores guide](stores-beta/user-guide.md).

Een store is een standalone OpenSpec repo die u op deze machine heeft geregistreerd — bijvoorbeeld een planningrepo of een contractenrepo. Het registreren van een store stelt normale commando's (`list`, `show`, `status`, `validate`, `new change`, `archive`, ...) in staat om ermee te werken vanaf elke locatie door `--store <id>` door te geven.

### `openspec store setup`

Maak en registreer een lokale store. Zonder argumenten in een terminal leidt OpenSpec de gebruiker door de setup. Agents en scripts moeten expliciete inputs doorgeven en `--json` gebruiken.

```bash
openspec store setup [id] [options]
```

**Options (Opties):**

| Option | Description (Beschrijving) |
|--------|-----------------------------|
| `--path <path>` | De map waarin de store moet worden geplaatst (bijvoorbeeld `~/openspec/<id>`) |
| `--remote <url>` | Registreer de canonieke remote in de `store.yaml` van de nieuwe store |
| `--init-git` | Initialiseer een Git repository met een initiële commit (standaard) |
| `--no-init-git` | Sla elke Git-actie over: geen init, geen initiële commit |
| `--json` | JSON uitvoeren |

Niet-interactieve runs (`--json`, scripts, agents) moeten zowel de store ID als `--path` doorgeven. In een interactieve terminal vraagt de setup om de locatie met een bewerkbare suggestie op een zichtbare, door de gebruiker beheerde plek (bijvoorbeeld `~/openspec/<id>`); het valt nooit terug op de beheerde data directory van OpenSpec.

Examples (Voorbeelden):

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Registreer een bestaande lokale store map.

```bash
openspec store register [path] [options]
```

**Options (Opties):**

| Option | Description (Beschrijving) |
|--------|-----------------------------|
| `--id <id>` | Store ID; standaard is de store metadata of mapnaam |
| `--yes` | Bevestig het aanmaken van store-identiteitsmetadata voor een gezonde OpenSpec root |
| `--json` | JSON uitvoeren |

### `openspec store unregister`

Vergeet een lokale storeregistratie zonder bestanden te verwijderen.

```bash
openspec store unregister <id> [--json]
```

Gebruik dit wanneer een store is verplaatst, ergens anders gekloond is, of niet langer door OpenSpec op deze machine getoond moet worden.

### `openspec store remove`

Vergeet een lokale storeregistratie en verwijder de lokale map ervan.

```bash
openspec store remove <id> [--yes] [--json]
```

`remove` toont de exacte map voordat deze in een interactieve terminal wordt verwijderd. Agents, scripts en JSON-aanroepers moeten `--yes` doorgeven om de verwijdering te bevestigen. OpenSpec weigert een map te verwijderen die niet de overeenkomende store metadata bevat.

### `openspec store list`

Weergeef lokaal geregistreerde stores.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Controleer lokale storeregistratie, metadata en Git-aanwezigheid.

```bash
openspec store doctor [id] [--json]
```

Doctor is uitsluitend diagnostisch; het rapporteert ontbrekende roots, metadata mismatches en ongeldige lokale registratiestatus zonder de store te wijzigen.

### Referencing stores from a project (Refereren naar stores vanuit een project)

Een projectrepo kan aangeven welke stores zijn gebruikt in de werkzaamheden van de `openspec/config.yaml`:

```yaml
schema: spec-driven
references:
  - team-context
```

Vanaf dat moment bevat de uitvoer van `openspec instructions` in die repo (zowel het per-artifact als het `apply`-oppervlak, JSON en menselijke modi) een index van de specificaties van elke gerefereerde store — spec IDs, een één-regelige samenvatting uit elk spec's Purpose gedeelte, en het fetch commando (`openspec show <spec-id> --type spec --store <id>`). De index wordt live gebouwd vanuit de geregistreerde checkout bij elke run; de specinhoud wordt nooit in de uitvoer gekopieerd.

Referenties zijn read-only context. Ze veranderen nooit waar commando's op werken: het werk blijft in de eigen root van de repo, en schrijven naar een gerefereerde store blijft een expliciete `--store` actie. Een referentie die niet kan worden opgelost (bijvoorbeeld een store die niet is geregistreerd op deze machine) degraderen tot een waarschuwing in de index met de exacte oplossing, en instructies worden nog steeds gegenereerd. `openspec doctor` rapporteert de gezondheid van referenties op één plek.

### Recording where a store is cloned from (Registreren waar een store vandaan is gekloond)

Een store kan zijn canonieke clonebron registreren in zijn gecommitteerde identiteitsbestand, zodat onboarding nooit stopt bij "registreer de store":

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

De remote wordt opgeslagen in `.openspec-store/store.yaml` binnen de initiële commit, zodat elke clone het weet vanaf de geboorte. Voor een bestaande store, bewerk `store.yaml` handmatig en commit. `store doctor` toont de geregistreerde remote (en de waargenomen Git origin van de checkout); setup/register benoemt het met richtlijnen; en register registreert de origin van de checkout in de machine-lokale registratie.

Een referentieverklaring kan ook de clonebron bevatten, zodat een teamgenoot die de store nog niet heeft, een complete, plakbare oplossing krijgt (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

Het registreren van een remote is geen synchronisatie: OpenSpec klont, pullt of pusht nooit zelf.

### Declaring a default store (Een standaard store verklaren)

Een repo waarvan de planning volledig extern is — zonder lokale `openspec/specs/` of `openspec/changes/` — kan zijn store één keer verklaren in plaats van `--store` bij elk commando door te geven:

```yaml
# openspec/config.yaml (het enige bestand onder openspec/)
store: team-context
```

Normale commando's lossen dan automatisch op naar de verklaarde store; de root banner en het JSON `root`-blok rapporteren `source: "declared"` met de store ID, en de getoonde hints bevatten nog steeds `--store <id>`. De verklaring is een fallback, nooit een override: expliciet `--store` wint altijd, en een map met echte planningmappen negeert de pointer (met een waarschuwing). Om een pointer-repo om te zetten in een lokale OpenSpec root, verwijder de `store:` regel en voer `openspec init` uit — init weigert scaffolding terwijl de verklaring aanwezig is.

## Doctor (gezondheid van de relatie)

Eén leesbare vraag, één plaats: is de OpenSpec root gezond, en zijn de opslagplaatsen waarop deze verwijst beschikbaar op deze machine?

```bash
openspec doctor [--store <id>] [--json]
```

Het rapport onderscheidt de gezondheid van de root, de metadata-gezondheid van de opslagplaatsen (inclusief een opmerking wanneer de geregistreerde remote en de oorsprong van de checkout afwijken), en de referentiegezondheid (dezelfde diagnostische instructies worden getoond, met clone fixes voor onopgeloste referenties). Gezondheidsbevindingen van welke ernst dan ook keren 0 terug — agents lezen de `status` arrays; alleen commando-fouten (geen root, onbekende opslagplaats) keren 1 terug. Doctor klont, synchroniseert of repareert nooit. Om de samengestelde set zelf te krijgen in plaats van de gezondheid ervan, gebruik `openspec context`.

## Werkcontext (de samengestelde set)

Alles wat met dit werk verband houdt via OpenSpec-declaraties, in één werkset: de OpenSpec root en de opslagplaatsen waarop deze verwijst.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

De JSON-samenvatting is bruikbaar voor agents (elke beschikbare referentie opslagplaats heeft zijn ophaalinstructies; onopgeloste leden hebben dezelfde fixes instructies en laten de doctor zien). `--code-workspace` schrijft bovendien een VS Code workspace bestand dat de root plus de beschikbare referenties opgeslagen opslagplaatsen (`ref:<id>` mappen) bevat — dit is het enige schrijfproces dat dit commando uitvoert, geweigerd zonder `--force` als het bestand bestaat. Niet-beschikbare leden worden gerapporteerd, nooit geraten.

"Werkcontext" is de samengestelde set; het `context:`-veld in `openspec/config.yaml` is projectachtergrond die in instructies wordt geïnjecteerd — twee verschillende dingen. `openspec doctor` antwoordt of de set gezond is; `openspec context` antwoordt wat de set is.

## Persoonlijke worksets

> **Beta.** Worksets maken deel uit van het nieuwe beta-oppervlak; commando's, vlaggen en bestandsformaten kunnen tussen releases veranderen. Voor de walkthrough zie [stores guide](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together).

Een workset is een persoonlijke, benoemde weergave van de mappen waarmee u samenwerkt — een planningsoverzicht plus wat u anders kiest — die op uw machine wordt bewaard en met naam in uw tool opnieuw wordt geopend. Het is puur lokaal: nooit gedecommit, nooit gedeeld, nooit afgeleid van declaraties, en het verwijderen ervan raakt nooit een lidmap.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` voert een korte begeleide stroom uit (of gebruikt de `--member` vlaggen niet-interactief; het eerste lid is de primaire — sessies starten daar). `open` start de gekozen tool: editors (VS Code, Cursor) openen een venster met elk lid en keren terug; CLI-agenten (Claude Code, codex) nemen deze terminal over als een sessie met elk lid bevestigd en zonder vooraf ingevuld prompt, eindigend wanneer u afsluit. Een lidmap die bij de opening ontbreekt, wordt met een opmerking overgeslagen; de rest wordt geopend. De opgeslagen toolvoorkeur is per openbaar te overrulen met `--tool`.

Het ondersteunen van een nieuwe tool is configuratie, geen code. Elke tool is een van twee lanceerstijlen — `workspace-file` (gelanceerd met het gegenereerde `.code-workspace`) of `attach-dirs` (één attach-vlag per lid) — en de sleutel `openers` in de globale `config.json` (open deze met `openspec config edit`) voegt tools toe of past ingebouwde functies aan per veld:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Alle workset-toestanden worden opgeslagen onder de `worksets/` map van de globale datadirectory (de opgeslagen weergaven plus de gegenereerde `<name>.code-workspace` bestanden, die bij elke opening opnieuw worden gemaakt); het verwijderen van die map verwijdert elk spoor.

---

## Browsing Commands

### `openspec list`

Lijst wijzigingen of specificaties in uw project.

```
openspec list [options]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--specs` | Lijst specificaties in plaats van wijzigingen |
| `--changes` | Lijst wijzigingen (standaard) |
| `--sort <order>` | Sorteer op `recent` (standaard) of `name` |
| `--json` | Output als JSON |

**Voorbeelden:**

```bash
# Toon alle actieve wijzigingen
openspec list

# Toon alle specificaties
openspec list --specs

# JSON output voor scripts
openspec list --json
```

**Output (tekst):**

```
Changes:
  add-dark-mode     Geen taken      net nu
```

---

### `openspec view`

Toont een interactief dashboard om specificaties en wijzigingen te verkennen.

```
openspec view
```

Opent een terminalgebaseerd interface voor het navigeren door de specificaties en wijzigingen van uw project.

---

### `openspec show`

Toont details van een wijziging of specificatie.

```
openspec show [item-name] [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `item-name` | Nee | Naam van de wijziging of specificatie (vraagt indien weggelaten) |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--type <type>` | Specificeer type: `change` of `spec` (automatisch gedetecteerd als onambigu) |
| `--json` | Output als JSON |
| `--no-interactive` | Schakel prompts uit |

**Wijziging-specifieke opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--deltas-only` | Toon alleen delta specificaties (JSON modus) |

**Specificatie-specifieke opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--requirements` | Toon alleen vereisten, sluit scenario's uit (JSON modus) |
| `--no-scenarios` | Sluit scenario-inhoud uit (JSON modus) |
| `-r, --requirement <id>` | Toon specifieke vereiste op basis van 1-index (JSON modus) |

**Voorbeelden:**

```bash
# Interactieve selectie
openspec show

# Toon een specifieke wijziging
openspec show add-dark-mode

# Toon een specifieke specificatie
openspec show auth --type spec

# JSON output voor parsing
openspec show add-dark-mode --json
```

---

## Validatie Commands

### `openspec validate`

Valideert wijzigingen en specificaties op structurele problemen.

```
openspec validate [item-name] [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `item-name` | Nee | Specifiek item om te valideren (vraagt indien weggelaten) |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--all` | Valideer alle wijzigingen en specificaties |
| `--changes` | Valideer alle wijzigingen |
| `--specs` | Valideer alle specificaties |
| `--type <type>` | Specificeer type wanneer de naam ambigu is: `change` of `spec` |
| `--strict` | Schakel strikte validatiemodus in |
| `--json` | Output als JSON |
| `--concurrency <n>` | Maximaal parallelle validaties (standaard: 6, of `OPENSPEC_CONCURRENCY` omgevingsvariabele) |
| `--no-interactive` | Schakel prompts uit |

**Voorbeelden:**

```bash
# Interactieve validatie
openspec validate

# Valideer een specifieke wijziging
openspec validate add-dark-mode

# Valideer alle wijzigingen
openspec validate --changes

# Alles valideren met JSON output (voor CI/scripts)
openspec validate --all --json

# Strikte validatie met verhoogde parallelle uitvoering
openspec validate --all --strict --concurrency 12
```

**Output (tekst):**

```
Validating add-dark-mode...
  ✓ proposal.md geldig
  ✓ specs/ui/spec.md geldig
  ⚠ design.md: ontbrekend "Technische Aanpak" gedeelte

1 waarschuwing gevonden
```

**Output (JSON):**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: ontbrekend 'Technische Aanpak' gedeelte"]
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

## Lifecycle Commands

### `openspec archive`

Archiveert een voltooide wijziging en voegt delta specificaties samen met de hoofdspecificaties.

```
openspec archive [change-name] [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `change-name` | Nee | Wijziging om te archiveren (vraagt indien weggelaten) |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `-y, --yes` | Sla bevestigingsprompts over |
| `--skip-specs` | Sla spec-updates over (voor infrastructuur/tooling/doc-alleen wijzigingen) |
| `--no-validate` | Sla validatie over (vereist bevestiging) |

**Voorbeelden:**

```bash
# Interactief archiveren
openspec archive

# Specifieke wijziging archiveren
openspec archive add-dark-mode

# Archiveren zonder prompts (CI/scripts)
openspec archive add-dark-mode --yes

# Een toolingwijziging archiveren die geen invloed heeft op specificaties
openspec archive update-ci-config --skip-specs
```

**Wat het doet:**

1. Valideert de wijziging (tenzij `--no-validate`)
2. Vraagt om bevestiging (tenzij `--yes`)
3. Voegt delta specificaties samen in `openspec/specs/`
4. Verplaatst de wijzigingsmap naar `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Workflow Commands

Deze commando's ondersteunen het artefactgedreven OPSX workflow. Ze zijn nuttig voor zowel mensen die de voortgang controleren als agenten die de volgende stappen bepalen.

### `openspec new change`

Maakt een wijzigingsmap en optionele gecontroleerde metadata aan in de opgeloste OpenSpec root.

```bash
openspec new change <name> [options]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--description <text>` | Beschrijving om toe te voegen aan `index.md` |
| `--goal <text>` | Optionele doelmetadata om op te slaan met de wijziging |
| `--schema <name>` | Workflow schema te gebruiken |
| `--store <id>` | Store ID te gebruiken als OpenSpec root (een store is een standalone OpenSpec repo die u heeft geregistreerd) |
| `--json` | Output JSON |

Voorbeelden:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Toont de voltooiingsstatus van artefacten voor een wijziging.

```
openspec status [options]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--change <id>` | Wijzignamen (vraagt indien weggelaten) |
| `--schema <name>` | Schema override (automatisch gedetecteerd van de wijzigingsconfiguratie) |
| `--json` | Output als JSON |

**Voorbeelden:**

```bash
# Interactieve statuscontrole
openspec status

# Status voor specifieke wijziging
openspec status --change add-dark-mode

# JSON voor agentgebruik
openspec status --change add-dark-mode --json
```

**Output (tekst):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artefacten voltooid

[x] proposal
[ ] design
[x] specs
[-] tasks (geblokkeerd door: design)
```

**Output (JSON):**

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

Haalt verrijkte instructies op voor het aanmaken van een artefact of het toepassen van taken. Wordt gebruikt door AI-agenten om te begrijpen wat er vervolgens moet worden aangemaakt.

```
openspec instructions [artifact] [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `artifact` | Nee | Artefact ID: `proposal`, `specs`, `design`, `tasks`, of `apply` |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--change <id>` | Wijzignamen (vereist in niet-interactieve modus) |
| `--schema <name>` | Schema override |
| `--json` | Output als JSON |

**Speciale gevallen:** Gebruik `apply` als het artefact om implementatie-instructies voor taken te krijgen.

**Voorbeelden:**

```bash
# Instructies ophalen voor het volgende artefact
openspec instructions --change add-dark-mode

# Specifieke artefactinstructies ophalen
openspec instructions design --change add-dark-mode

# Apply/implementatie-instructies ophalen
openspec instructions apply --change add-dark-mode

# JSON voor agentconsumptie
openspec instructions design --change add-dark-mode --json
```

**Output bevat:**

- Template-inhoud voor het artefact
- Projectcontext uit de configuratie
- Inhoud van afhankelijkheidsartefacten
- Per-artefact regels uit de configuratie

---

### `openspec templates`

Toont opgeloste templatepaden voor alle artefacten in een schema.

```
openspec templates [options]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--schema <name>` | Schema om te inspecteren (standaard: `spec-driven`) |
| `--json` | Output als JSON |

**Voorbeelden:**

```bash
# Toon templatepaden voor het standaard schema
openspec templates

# Toon templates voor een aangepast schema
openspec templates --schema my-workflow

# JSON voor programmeergebruik
openspec templates --json
```

**Output (tekst):**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Lijst beschikbare workflowschema's met hun beschrijvingen en artefactstromen.

```
openspec schemas [options]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--json` | Output als JSON |

**Voorbeeld:**

```bash
openspec schemas
```

**Output:**

```
Beschikbare schema's:

  spec-driven (package)
    Het standaard spec-driven ontwikkelingsworkflow
    Stroom: proposal → specs → design → tasks

  my-custom (project)
    Aangepast workflow voor dit project
    Stroom: research → proposal → tasks
```

## Schema Commando's

Commando's voor het aanmaken en beheren van aangepaste workflow schemas.

### `openspec schema init`

Maak een nieuw project-lokaal schema aan.

```
openspec schema init <name> [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|---------|-------------|
| `name` | Ja | Naam van het schema (kebab-case) |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--description <text>` | Beschrijving van het schema |
| `--artifacts <list>` | Komma-gescheiden artifact ID's (standaard: `proposal,specs,design,tasks`) |
| `--default` | Instellen als project standaardschema |
| `--no-default` | Niet vragen om te stellen als standaard |
| `--force` | Bestaand schema overschrijven |
| `--json` | Outputten als JSON |

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
openspec/schemas/<name>/
├── schema.yaml           # Schemadefinitie
└── templates/
    ├── proposal.md       # Template voor elk artifact
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Kopieer een bestaand schema naar uw project voor aanpassing.

```
openspec schema fork <source> [name] [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|---------|-------------|
| `source` | Ja | Het te kopiëren schema |
| `name` | Nee | Nieuwe schema naam (standaard: `<source>-custom`) |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--force` | Bestemming overschrijven als deze al bestaat |
| `--json` | Outputten als JSON |

**Voorbeeld:**

```bash
# Forken van het ingebouwde spec-driven schema
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Valideer de structuur en templates van een schema.

```
openspec schema validate [name] [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|---------|-------------|
| `name` | Nee | Het te valideren schema (valideert alles als dit weggelaten wordt) |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--verbose` | Toon gedetailleerde validatiestappen |
| `--json` | Outputten als JSON |

**Voorbeeld:**

```bash
# Valideer een specifiek schema
openspec schema validate my-workflow

# Valideer alle schemas
openspec schema validate
```

---

### `openspec schema which`

Toon waar een schema vandaan komt (handig voor het debuggen van precedentie).

```
openspec schema which [name] [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|---------|-------------|
| `name` | Nee | Naam van het schema |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--all` | Lijst alle schemas met hun bronnen |
| `--json` | Outputten als JSON |

**Voorbeeld:**

```bash
# Controleer waar een schema vandaan komt
openspec schema which spec-driven
```

**Output:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Schema precedentie:**

1. Project: `openspec/schemas/<name>/`
2. Gebruiker: `~/.local/share/openspec/schemas/<name>/`
3. Package: Ingebouwde schemas

---

## Configuratie Commando's

### `openspec config`

Bekijk en wijzig de globale OpenSpec configuratie.

```
openspec config <subcommand> [options]
```

**Subcommando's:**

| Subcommando | Beschrijving |
|------------|-------------|
| `path` | Toon locatie van het configbestand |
| `list` | Toon alle huidige instellingen |
| `get <key>` | Haal een specifieke waarde op |
| `set <key> <value>` | Stel een waarde in |
| `unset <key>` | Verwijder een sleutel |
| `reset` | Resetten naar standaardwaarden |
| `edit` | Openen in `$EDITOR` |
| `profile [preset]` | Interactief of via preset workflowprofiel configureren |

**Voorbeelden:**

```bash
# Toon pad van het configbestand
openspec config path

# Lijst alle instellingen
openspec config list

# Haal een specifieke waarde op
openspec config get telemetry.enabled

# Stel een waarde in
openspec config set telemetry.enabled false

# Stel expliciet een stringwaarde in
openspec config set user.name "My Name" --string

# Verwijder een aangepaste instelling
openspec config unset user.name

# Reset alle configuratie
openspec config reset --all --yes

# Bewerk config in uw editor
openspec config edit

# Configureer profiel met action-based wizard
openspec config profile

# Snelle preset: workflows overschakelen naar core (behoudt delivery mode)
openspec config profile core
```

`openspec config profile` begint met een samenvatting van de huidige staat, waarna u kunt kiezen:
- Delivery + workflows wijzigen
- Alleen delivery wijzigen
- Alleen workflows wijzigen
- Huidige instellingen behouden (afsluiten)

Als u de huidige instellingen behoudt, worden er geen wijzigingen opgeslagen en wordt er geen update prompt getoond.
Als er geen configuratiewijzigingen zijn, maar de huidige projectbestanden niet gesynchroniseerd zijn met uw globale profiel/delivery, toont OpenSpec een waarschuwing en suggereert `openspec update`.
Het indrukken van `Ctrl+C` annuleert de flow ook netjes (zonder stack trace) en sluit af met code `130`.
In de workflow checklist betekent `[x]` dat de workflow is geselecteerd in de globale configuratie. Om deze selecties toe te passen op projectbestanden, voert u `openspec update` uit (of kiest u `Apply changes to this project now?` wanneer dit binnen een project wordt gevraagd).

**Interactieve voorbeelden:**

```bash
# Alleen delivery update
openspec config profile
# kies: Alleen delivery wijzigen
# kies delivery: Skills only

# Alleen workflows update
openspec config profile
# kies: Alleen workflows wijzigen
# toggle de workflows in de checklist, en bevestig dan
```

---

## Utility Commando's

### `openspec feedback`

Stuur feedback over OpenSpec. Maakt een GitHub issue aan.

```
openspec feedback <message> [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|---------|-------------|
| `message` | Ja | Feedbackbericht |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--body <text>` | Gedetailleerde beschrijving |

**Vereisten:** De GitHub CLI (`gh`) moet geïnstalleerd en geauthenticeerd zijn.

**Voorbeeld:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Beheer shell completions voor de OpenSpec CLI.

```
openspec completion <subcommand> [shell]
```

**Subcommando's:**

| Subcommando | Beschrijving |
|------------|-------------|
| `generate [shell]` | Outputten van het completion script naar stdout |
| `install [shell]` | Installeer completion voor uw shell |
| `uninstall [shell]` | Verwijder geïnstalleerde completions |

**Ondersteunde shells:** `bash`, `zsh`, `fish`, `powershell`

**Voorbeelden:**

```bash
# Installeer completions (detecteert de shell automatisch)
openspec completion install

# Installeer voor een specifieke shell
openspec completion install zsh

# Genereer script voor handmatige installatie
openspec completion generate bash > ~/.bash_completion.d/openspec

# Uninstall
openspec completion uninstall
```

---

## Exit Codes

| Code | Betekenis |
|------|-----------|
| `0` | Succes |
| `1` | Fout (validatiefout, ontbrekende bestanden, enz.) |

---

## Environment Variables

| Variabele | Beschrijving |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Instellen op `0` om telemetry uit te schakelen |
| `DO_NOT_TRACK` | Instellen op `1` om telemetry uit te schakelen (standaard DNT signaal) |
| `OPENSPEC_CONCURRENCY` | Standaard gelijktijdigheid voor bulkvalidatie (standaard: 6) |
| `EDITOR` of `VISUAL` | Editor voor `openspec config edit` |
| `NO_COLOR` | Kleuroutput uitschakelen wanneer ingesteld |

---

## Gerelateerde Documentatie

- [Commands](commands.md) - AI slash commando's (`/opsx:propose`, `/opsx:apply`, enz.)
- [Workflows](workflows.md) - Gemeenschappelijke patronen en wanneer u elk commando moet gebruiken
- [Customization](customization.md) - Maak aangepaste schemas en templates aan
- [Getting Started](getting-started.md) - Handleiding voor de eerste installatie