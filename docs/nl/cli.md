# CLI-referentie

De OpenSpec-CLI (`openspec`) biedt terminalopdrachten voor projectinstelling, validatie, statusinspectie en beheer. Deze opdrachten vullen de AI-slasopdrachten (zoals `/opsx:propose`) aan die zijn gedocumenteerd in [Opdrachten](commands.md).

## Samenvatting

| Categorie | Opdrachten | Doel |
|----------|----------|---------|
| **Opzetten** | `init`, `update` | Initialiseer en werk OpenSpec bij in je project |
| **Opslagplaatsen (standalone OpenSpec-repos)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Beheer opslagplaatsen — standalone OpenSpec-repos die je hebt geregistreerd |
| **Gezondheid** | `doctor` | Rapporteer de gezondheid van relaties voor de opgeloste root |
| **Werkcontext** | `context` | Stel de werkingsset samen (root + gerefereerde opslagplaatsen) |
| **Persoonlijke werkverzamelingen** | `workset create`, `workset list`, `workset open`, `workset remove` | Bewaar en open persoonlijke, lokale werkweergaven in je tool |
| **Bladeren** | `list`, `view`, `show` | Verken wijzigingen en specificaties |
| **Validatie** | `validate` | Controleer wijzigingen en specificaties op problemen |
| **Levenscyclus** | `archive` | Finaliseer afgeronde wijzigingen |
| **Workflow** | `new change`, `status`, `instructions`, `templates`, `schemas` | Ondersteuning voor artefactgedreven workflows |
| **Schema's** | `schema init`, `schema fork`, `schema validate`, `schema which` | Maak en beheer aangepaste workflows |
| **Configuratie** | `config` | Bekijk en wijzig instellingen |
| **Hulpmiddelen** | `feedback`, `completion` | Feedback en shell-integratie |

---

## Menselijke vs Agent-opdrachten

De meeste CLI-opdrachten zijn ontworpen voor **menselijk gebruik** in een terminal. Sommige opdrachten ondersteunen ook **agent/script-gebruik** via JSON-uitvoer.

### Alleen-mensen-opdrachten

Deze opdrachten zijn interactief en ontworpen voor terminalgebruik:

| Opdracht | Doel |
|---------|---------|
| `openspec init` | Project initialiseren (interactieve prompts) |
| `openspec view` | Interactief dashboard |
| `openspec workset open <name>` | Een opgeslagen workset openen (editorvenster of terminal-agentsessie) |
| `openspec config edit` | Configuratie openen in editor |
| `openspec feedback` | Feedback indienen via GitHub |
| `openspec completion install` | Shell-aanvullingen installeren |

### Agent-compatibele opdrachten

Deze opdrachten ondersteunen `--json`-uitvoer voor programmatisch gebruik door AI-agents en scripts:

| Opdracht | Menselijk gebruik | Agentgebruik |
|---------|-----------|-----------|
| `openspec list` | Wijzigingen/specs bladeren | `--json` voor gestructureerde gegevens |
| `openspec show <item>` | Inhoud lezen | `--json` voor parsing |
| `openspec validate` | Controleren op problemen | `--all --json` voor bulkvalidatie |
| `openspec status` | Voortgang van artefacten bekijken | `--json` voor gestructureerde status |
| `openspec instructions` | Volgende stappen opvragen | `--json` voor agentinstructies |
| `openspec templates` | Sjabloonpaden vinden | `--json` voor padresolutie |
| `openspec schemas` | Beschikbare schema's opsommen | `--json` voor schemaontdekking |
| `openspec store setup <id>` | Een lokale store aanmaken en registreren | `--json` met expliciete invoer voor gestructureerde setup-uitvoer |
| `openspec store register <path>` | Een bestaande store registreren | `--json` voor gestructureerde registratie-uitvoer |
| `openspec store unregister <id>` | Een lokale store-registratie vergeten | `--json` voor gestructureerde opschoning-uitvoer |
| `openspec store remove <id>` | Een geregistreerde lokale store-map verwijderen | `--yes --json` voor niet-interactieve verwijdering |
| `openspec store list` | Geregistreerde stores bladeren | `--json` voor gestructureerde registraties |
| `openspec store doctor` | Lokale store-setup controleren | `--json` voor gestructureerde diagnostiek |
| `openspec new change <id>` | Repo-lokale wijzigingsscaffolding aanmaken | `--json`, plus `--store <id>` om een geregistreerde store als OpenSpec-root te gebruiken |
| `openspec workset create [name]` | Een persoonlijke werkweergave samenstellen | `--member <path> --json` voor niet-interactieve samenstelling |
| `openspec workset list` | Opgeslagen worksets bladeren | `--json` voor gestructureerde weergaven |
| `openspec workset remove <name>` | Een opgeslagen weergave verwijderen | `--yes --json` voor niet-interactieve verwijdering |

---

## Globale opties

Deze opties werken met alle opdrachten:

| Optie | Beschrijving |
|--------|-------------|
| `--version`, `-V` | Versienummer tonen |
| `--no-color` | Kleuruitvoer uitschakelen |
| `--help`, `-h` | Help voor opdracht tonen |

---

## Setup-opdrachten

### `openspec init`

OpenSpec in uw project initialiseren. Maakt de mapstructuur aan en configureert AI-toolintegraties.

Standaardgedrag gebruikt globale configuratiestandaardwaarden: profiel `core`, levering `both`, workflows `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `path` | Nee | Doelmap (standaard: huidige map) |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--tools <list>` | AI-tools niet-interactief configureren. Gebruik `all`, `none`, of kommagescheiden lijst |
| `--force` | Automatisch oude bestanden opschonen zonder te vragen |
| `--profile <profile>` | Globaal profiel overschrijven voor deze init-uitvoering (`core` of `custom`) |

`--profile custom` gebruikt de workflows die momenteel zijn geselecteerd in de globale configuratie (`openspec config profile`).

**Ondersteunde tool-ID's (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

> Deze lijst weerspiegelt `AI_TOOLS` in `src/core/config.ts`. Zie [Supported Tools](supported-tools.md) voor de skill- en opdrachtpaden van elke tool.

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

# Profiel overschrijven voor deze uitvoering
openspec init --profile core

# Prompten overslaan en automatisch oude bestanden opschonen
openspec init --force
```

**Wat het aanmaakt:**

```
openspec/
├── specs/              # Uw specificaties (bron van waarheid)
├── changes/            # Voorgestelde wijzigingen
└── config.yaml         # Projectconfiguratie

.claude/skills/         # Claude Code skills (indien claude geselecteerd)
.cursor/skills/         # Cursor skills (indien cursor geselecteerd)
.cursor/commands/       # Cursor OPSX-opdrachten (indien levering opdrachten bevat)
... (andere toolconfiguraties)
```

---

### `openspec update`

OpenSpec-instructiebestanden upgraden na de CLI-upgrade. Genereert AI-toolconfiguratiebestanden opnieuw met uw huidige globale profiel, geselecteerde workflows en leveringsmodus.

```
openspec update [path] [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `path` | Nee | Doelmap (standaard: huidige map) |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--force` | Update forceren zelfs wanneer bestanden up-to-date zijn |

**Voorbeeld:**

```bash
# Instructiebestanden upgraden na npm-upgrade
npm update @fission-ai/openspec
openspec update
```

---

## Stores (zelfstandige OpenSpec-repo's)

> **Beta.** Stores en de erop gebaseerde functies (referenties, werkcontext, worksets) zijn nieuw; opdrachtnamen, vlaggen, bestandsindelingen en JSON-uitvoer kunnen tussen releases van vorm veranderen. Voor de probleem-eerste walkthrough, zie de [stores guide](stores-beta/user-guide.md).

Een store is een zelfstandige OpenSpec-repo die u op deze machine heeft geregistreerd — bijvoorbeeld een planningsrepo of een contractenrepo. Door een store te registreren, kunnen normale opdrachten (`list`, `show`, `status`, `validate`, `new change`, `archive`, ...) erin handelen vanaf elke locatie door `--store <id>` door te geven.

### `openspec store setup`

Een lokale store aanmaken en registreren. Zonder argumenten in een terminal
geleidt OpenSpec de gebruiker door de setup. Agents en scripts moeten expliciete
invoer doorgeven en `--json` gebruiken.

```bash
openspec store setup [id] [options]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--path <path>` | Map waar de store moet staan (bijvoorbeeld `~/openspec/<id>`) |
| `--remote <url>` | De canonieke remote vastleggen in de `store.yaml` van de nieuwe store |
| `--init-git` | Een Git-repository initialiseren met een initiële commit (standaard) |
| `--no-init-git` | Elke Git-actie overslaan: geen init, geen initiële commit |
| `--json` | JSON-uitvoer |

Niet-interactieve uitvoeringen (`--json`, scripts, agents) moeten zowel de store-id als `--path` doorgeven. In een interactieve terminal vraagt de setup naar de locatie met een bewerkbaar voorstel in een zichtbare, gebruikereigendom locatie (bijvoorbeeld `~/openspec/<id>`); het valt nooit terug naar OpenSpec's beheerde gegevensmap.

Voorbeelden:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Een bestaande lokale store-map registreren. Tijdens de stores-beta kan een root
geregistreerd worden voordat er wijzigingen bestaan, specs zijn toegepast, of wijzigingen
zijn gearchiveerd; in dat geval kunnen `openspec/changes/`, `openspec/specs/`, en
`openspec/changes/archive/` afwezig zijn totdat normale opdrachten ze aanmaken.
Een alleen-configuratie-repo die `store: <id>` declareert, blijft een pointer naar een andere
store en wordt niet geregistreerd als een store-root tenzij die pointer wordt verwijderd.

```bash
openspec store register [path] [options]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--id <id>` | Store-id; valt terug naar store-metadate of mapnaam |
| `--yes` | Bevestig het aanmaken van store-identiteitsmetadate voor een gezonde OpenSpec-root |
| `--json` | JSON-uitvoer |

### `openspec store unregister`

Een lokale store-registratie vergeten zonder bestanden te verwijderen.

```bash
openspec store unregister <id> [--json]
```

Gebruik dit wanneer een store is verplaatst, ergens anders is gekloond, of niet langer
door OpenSpec op deze machine moet worden getoond.

### `openspec store remove`

Een lokale store-registratie vergeten en de lokale map verwijderen.

```bash
openspec store remove <id> [--yes] [--json]
```

`remove` toont de exacte map vóór het verwijderen in een interactieve terminal.
Agents, scripts, en JSON-aanroepers moeten `--yes` doorgeven om verwijdering te bevestigen.
OpenSpec weigert een map te verwijderen die geen overeenkomstige
store-metadate bevat.

### `openspec store list`

Lokaal geregistreerde stores opsommen.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Lokale store-registratie, metadate en Git-aanwezigheid controleren.

```bash
openspec store doctor [id] [--json]
```

Doctor is alleen diagnostisch; het rapporteert ontbrekende roots, metadate-mismatches en ongeldige lokale registerstatus zonder de store te wijzigen.

### Stores refereren vanuit een project

Een project-repo kan declareren op welke stores zijn werk steunt in `openspec/config.yaml`:

```yaml
schema: spec-driven
references:
  - team-context
```

Vanaf dat moment bevat de `openspec instructions`-uitvoer in die repo (zowel de per-artefact- als `apply`-vlakken, JSON- en menselijke modi) een index van de specs van elke gerefereerde store — spec-ids, een regel samenvatting uit de Purpose-sectie van elke spec, en de fetch-opdracht (`openspec show <spec-id> --type spec --store <id>`). De index wordt live opgebouwd uit de geregistreerde checkout bij elke uitvoering; spec-inhoud wordt nooit gekopieerd naar de uitvoer.

Referenties zijn alleen-lezen context. Ze veranderen nooit waar opdrachten handelen: werk blijft in de eigen root van de repo, en schrijven naar een gerefereerde store blijft een expliciete `--store`-actie. Een referentie die niet kan worden opgelost (bijvoorbeeld, een store die niet op deze machine is geregistreerd) degradeert tot een waarschuwing in de index met de exacte oplossing, en instructies worden nog steeds gegenereerd. `openspec doctor` rapporteert de gezondheid van referenties op één plaats.

### Vastleggen waar een store van is gekloond

Een store kan zijn canonieke kloonbron vastleggen in zijn vastgelegde identiteitsbestand, zodat onboarding nooit doodloopt bij "de store registreren":

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

De remote landt in `.openspec-store/store.yaml` binnen de initiële commit, zodat elke kloon geboren wordt met die kennis. Voor een bestaande store, bewerk `store.yaml` handmatig en commit. `store doctor` toont de vastgelegde remote (en de waargenomen Git-oorsprong van de checkout); setup/register-deelnoemhulpen noemen het; en register registreert de oorsprong van de checkout in het machine-lokale register.

Een referentie-declaratie kan de kloonbron ook dragen, zodat een teamgenoot die de store nog niet heeft een volledige, plakbare oplossing krijgt (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

Een remote vastleggen is geen sync: OpenSpec kloont, pullt of pusht nooit zelf.

### Een standaard store declareren

Een repo waarvan de planning volledig is geëxternaliseerd — geen lokale `openspec/specs/` of `openspec/changes/` — kan zijn store eenmalig declareren in plaats van `--store` bij elke opdracht door te geven:

```yaml
# openspec/config.yaml (het enige bestand onder openspec/)
store: team-context
```

Normale opdrachten lossen dan automatisch op naar de gedeclareerde store; de root-banner en JSON `root`-blok rapporteren `source: "declared"` met de store-id, en afgedrukte hints dragen nog steeds `--store <id>`. De declaratie is een fallback, nooit een overschrijving: expliciete `--store` wint altijd, en een map met echte planningsmappen negeert de pointer (met een waarschuwing). Om een pointer-repo om te zetten in een lokale OpenSpec-root, verwijder de `store:`-regel en voer `openspec init` uit — init weigert te scaffolden terwijl de declaratie aanwezig is.

Een machine-niveau variant dekt alle repo's tegelijk: `openspec config set defaultStore <id>` (zie Configuratie). Het wordt alleen geraadpleegd nadat `--store`, een lokale root, en een project-pointer allemaal niet hebben kunnen oplossen; de root-banner en JSON `root`-blok rapporteren dan `source: "global_default"`.

## Doctor (relatiegezondheid)

Eén alleen-lezen vraag, één plek: is de OpenSpec-root gezond, en zijn de stores waaraan het refereert op deze machine beschikbaar?

```bash
openspec doctor [--store <id>] [--json]
```

Het rapport scheidt root-gezondheid, store-metadata-gezondheid (inclusief een notitie wanneer de opgenomen remote en de origin van de checkout divergeren, en een notitie wanneer de store-checkout achterblijft bij zijn laatst-gehaalde upstream-tracking-ref), en referentie-gezondheid (dezelfde diagnostische instructies worden getoond, met clone-fixes voor onopgeloste referenties). Gezondheidsbevindingen van elke ernst exit 0 — agents lezen de `status`-arrays; alleen opdrachtfouten (geen root, onbekende store) exit 1. Doctor cloneert nooit, synchroniseert nooit of repareert nooit. Om het samengestelde set zelf te krijgen in plaats van zijn gezondheid, gebruik `openspec context`.

## Werkcontext (het samengestelde set)

Alles waaraan dit werk refereert via OpenSpec-declaraties, in één werk-set: de OpenSpec-root en de stores waaraan het refereert.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

De JSON-brief is agent-consumeerbaar (elke beschikbare gerefereerde store bevat zijn fetch-recept; onopgeloste leden bevatten dezelfde fix-instructies en doctor-weergave). `--code-workspace` schrijft bovendien een VS Code-werkbestand dat de root plus de beschikbare gerefereerde stores bevat (`ref:<id>` mappen) — de enige schrijfoperatie die deze opdracht uitvoert, geweigerd zonder `--force` als het bestand bestaat. Onbeschikbare leden worden gerapporteerd, nooit geraden.

"Werkcontext" is het samengestelde set; het `context:`-veld in `openspec/config.yaml` is projectachtergrond die in instructies wordt geïnjecteerd — twee verschillende dingen. `openspec doctor` antwoordt of het set gezond is; `openspec context` antwoordt wat het set is.

## Persoonlijke werksets

> **Beta.** Werksets maken deel uit van het nieuwe beta-oppervlak; commandos, vlaggen en bestandsindelingen kunnen tussen releases van vorm veranderen. Zie de [gids voor stores](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together) voor de walkthrough.

Een werkset is een persoonlijke, benoemde weergave van de mappen waaraan je samenwerkt — een planning-root plus wat je verder kiest — opgeslagen op je machine en opnieuw te openen op naam in je tool. Het is puur lokaal: nooit gecommit, nooit gedeeld, nooit afgeleid van declaraties, en het verwijderen ervan raakt nooit een lidmap.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` doorloopt een korte begeleide flow (of neemt `--member`-vlaggen niet-interactief; het eerste lid is de primaire — sessies starten daar). `open` start de gekozen tool: editors (VS Code, Cursor) openen een venster met elk lid en keren terug; CLI-agents (Claude Code, codex) nemen deze terminal over als sessie met elk lid gekoppeld en geen vooraf ingevulde prompt, eindigend wanneer je afsluit. Een ontbrekende lidmap bij het openen wordt overgeslagen met een opmerking; de rest opent. De opgeslagen toolvoorkeur is per open-actie te overschrijven met `--tool`.

Een nieuwe tool ondersteunen is configuratie, geen code. Elke tool heeft een van twee startstijlen — `workspace-file` (gestart met het gegenereerde `.code-workspace`) of `attach-dirs` (één koppelingsvlag per lid) — en de `openers`-sleutel in de globale `config.json` (open deze met `openspec config edit`) voegt tools toe of past ingebouwde tools aan per veld:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Alle werkset-statussen bevinden zich onder de `worksets/`-map van de globale gegevensdirectory (de opgeslagen weergaves plus de gegenereerde `<name>.code-workspace`-bestanden, bij elke opening opnieuw gegenereerd); het verwijderen van die map verwijdert elk spoor.

---

## Bladercommando's

### `openspec list`

Lijst van wijzigingen of specs in je project.

```
openspec list [options]
```

**Opties:**

| Option | Description |
|--------|-------------|
| `--specs` | Lijst van specs in plaats van wijzigingen |
| `--changes` | Lijst van wijzigingen (standaard) |
| `--sort <order>` | Sorteer op `recent` (standaard) of `naam` |
| `--json` | Uitvoer als JSON |

**Voorbeelden:**

```bash
# Lijst van alle actieve wijzigingen
openspec list

# Lijst van alle specs
openspec list --specs

# JSON-uitvoer voor scripts
openspec list --json
```

**Uitvoer (tekst):**

```
Wijzigingen:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

Toon een interactief dashboard voor het verkennen van specs en wijzigingen.

```
openspec view
```

Opent een terminalgebaseerde interface voor het navigeren door de specificaties en wijzigingen van je project.

---

### `openspec show`

Toon details van een wijziging of spec.

```
openspec show [item-name] [options]
```

**Argumenten:**

| Argument | Required | Description |
|----------|----------|-------------|
| `item-name` | No | Naam van wijziging of spec (vraagt indien weggelaten) |

**Opties:**

| Option | Description |
|--------|-------------|
| `--type <type>` | Specificeer type: `change` of `spec` (automatisch gedetecteerd indien eenduidig) |
| `--json` | Uitvoer als JSON |
| `--no-interactive` | Schakel prompts uit |

**Wijzigingsspecifieke opties:**

| Option | Description |
|--------|-------------|
| `--deltas-only` | Toon alleen delta-specs (JSON-modus) |

**Specifieke opties:**

| Option | Description |
|--------|-------------|
| `--requirements` | Toon alleen vereisten, sluit scenario's uit (JSON-modus) |
| `--no-scenarios` | Sluit scenario-inhoud uit (JSON-modus) |
| `-r, --requirement <id>` | Toon specifieke vereiste op 1-gebaseerde index (JSON-modus) |

**Voorbeelden:**

```bash
# Interactieve selectie
openspec show

# Toon een specifieke wijziging
openspec show add-dark-mode

# Toon een specifieke spec
openspec show auth --type spec

# JSON-uitvoer voor parsing
openspec show add-dark-mode --json
```

---

## Validatiecommando's

### `openspec validate`

Valideer wijzigingen en specs voor structurele problemen.

```
openspec validate [item-name] [options]
```

Een wijziging met nul spec-deltas slaagt niet voor validatie tenzij het `.openspec.yaml` `skip_specs: true` declareert (voor zuivere refactors, tooling, of documentatiewerk — zie [Recept 5](examples.md#recipe-5-a-refactor-with-no-behavior-change)).

**Argumenten:**

| Argument | Required | Description |
|----------|----------|-------------|
| `item-name` | No | Specifiek item om te valideren (vraagt indien weggelaten) |

**Opties:**

| Option | Description |
|--------|-------------|
| `--all` | Valideer alle wijzigingen en specs |
| `--changes` | Valideer alle wijzigingen |
| `--specs` | Valideer alle specs |
| `--type <type>` | Specificeer type wanneer naam ambigu is: `change` of `spec` |
| `--strict` | Schakel strikte validatiemodus in |
| `--json` | Uitvoer als JSON |
| `--concurrency <n>` | Max parallelle validaties (standaard: 6, of `OPENSPEC_CONCURRENCY` env) |
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

# Strikte validatie met verhoogde parallelliteit
openspec validate --all --strict --concurrency 12
```

**Uitvoer (tekst):**

```
Valideren van add-dark-mode...
  ✓ proposal.md geldig
  ✓ specs/ui/spec.md geldig
  ⚠ design.md: ontbreekt "Technical Approach"-sectie

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
        "warnings": ["design.md: missing 'Technical Approach' section"]
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

Archiveer een voltooide wijziging en voeg delta-specs samen in hoofd-specs.

```
openspec archive [change-name] [options]
```

**Argumenten:**

| Argument | Required | Description |
|----------|----------|-------------|
| `change-name` | No | Wijziging om te archiveren (vraagt indien weggelaten) |

**Opties:**

| Option | Description |
|--------|-------------|
| `-y, --yes` | Sla bevestigingsprompts over |
| `--skip-specs` | Sla spec-updates over voor één archiefuitvoering. Een wijziging die permanent geen spec-deltas heeft, moet in plaats daarvan `skip_specs: true` declareren in zijn `.openspec.yaml` — het archiveert zonder vlag |
| `--no-validate` | Sla validatie over (vereist bevestiging) |

**Voorbeelden:**

```bash
# Interactief archiveren
openspec archive

# Archiveer specifieke wijziging
openspec archive add-dark-mode

# Archiveren zonder prompts (CI/scripts)
openspec archive add-dark-mode --yes

# Archiveer een tooling-wijziging die specs niet beïnvloedt
openspec archive update-ci-config --skip-specs
```

**Wat het doet:**

1. Valideert de wijziging (tenzij `--no-validate`)
2. Vraagt om bevestiging (tenzij `--yes`)
3. Voegt delta-specs samen in `openspec/specs/`
4. Verplaatst wijzigingsmap naar `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Workflowcommando's

Deze commando's ondersteunen de artefact-gedreven OPSX-workflow. Ze zijn nuttig voor zowel mensen die voortgang controleren als agents die de volgende stappen bepalen.

### `openspec new change`

Maak een wijzigingsmap en optionele gecontroleerde metadata in de opgeloste OpenSpec-root.

```bash
openspec new change <name> [options]
```

Wijzigingsnamen moeten kleine letters gebruiken in kebab-case. Ze beginnen met een kleine letter, bevatten dan kleine letters, cijfers en enkelvoudige koppeltekens. Ze kunnen niet beginnen met een cijfer, spaties, underscores, hoofdletters, opeenvolgende koppeltekens of voorloop/afsluitende koppeltekens bevatten. Bij het opnemen van een extern ticket-ID, prefix het met een woord, bijvoorbeeld `ticket-123-add-notifications` in plaats van `123-add-notifications`.

**Opties:**

| Option | Description |
|--------|-------------|
| `--description <text>` | Beschrijving om toe te voegen aan `index.md` |
| `--goal <text>` | Optionele doel-metadata om op te slaan met de wijziging |
| `--schema <name>` | Workflow-schema om te gebruiken |
| `--store <id>` | Store-id om te gebruiken als OpenSpec-root (een store is een standalone OpenSpec-repo die je hebt geregistreerd) |
| `--json` | JSON-uitvoer |

Voorbeelden:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Toon artefactvoltooiingsstatus voor een wijziging.

```
openspec status [options]
```

**Opties:**

| Option | Description |
|--------|-------------|
| `--change <id>` | Wijzigingsnaam (vraagt indien weggelaten) |
| `--schema <name>` | Schema-overschrijving (automatisch gedetecteerd uit wijzigingsconfiguratie) |
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

Een wijziging die `skip_specs: true` declareert, toont zijn specs-stadium als `[~] specs (overgeslagen: wijziging declareert skip_specs)` en sluit het uit van de voortgangstelling.

**Uitvoer (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done", "requires": []},
    {"id": "design", "outputPath": "design.md", "status": "ready", "requires": ["proposal"]},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done", "requires": ["proposal"]},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "requires": ["specs", "design"], "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

Verrijkte instructies ophalen voor het maken van een artefact of het toepassen van taken. Gebruikt door AI-agents om te begrijpen wat er als volgende gemaakt moet worden.

```
openspec instructions [artifact] [options]
```

**Argumenten:**

| Argument | Required | Description |
|----------|----------|-------------|
| `artifact` | No | Artefact-ID: `proposal`, `specs`, `design`, `tasks`, of `apply` |

**Opties:**

| Option | Description |
|--------|-------------|
| `--change <id>` | Wijzigingsnaam (vereist in niet-interactieve modus) |
| `--schema <name>` | Schema-overschrijving |
| `--json` | Uitvoer als JSON |

**Speciaal geval:** Gebruik `apply` als het artefact om taakimplementatie-instructies te krijgen.

**Voorbeelden:**

```bash
# Instructies ophalen voor volgende artefact
openspec instructions --change add-dark-mode

# Specifieke artefact-instructies ophalen
openspec instructions design --change add-dark-mode

# Apply/implementatie-instructies ophalen
openspec instructions apply --change add-dark-mode

# JSON voor agentconsumptie
openspec instructions design --change add-dark-mode --json
```

**Uitvoer bevat:**

- Template-inhoud voor het artefact
- Projectcontext uit configuratie
- Inhoud van afhankelijke artefacten
- Per-artefact-regels uit configuratie

Voor een artefact overgeslagen via `skip_specs: true`, is de uitvoer alleen een waarschuwing (JSON voegt `skipped`/`warning`-velden toe) — het artefact mag niet worden gemaakt.

---

### `openspec templates`

Toon opgeloste template-paden voor alle artefacten in een schema.

```
openspec templates [options]
```

**Opties:**

| Option | Description |
|--------|-------------|
| `--schema <name>` | Schema om te inspecteren (standaard: `spec-driven`) |
| `--json` | Uitvoer als JSON |

**Voorbeelden:**

```bash
# Toon template-paden voor standaard schema
openspec templates

# Toon templates voor aangepast schema
openspec templates --schema my-workflow

# JSON voor programmatisch gebruik
openspec templates --json
```

**Uitvoer (tekst):**

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

Lijst van beschikbare workflow-schema's met hun beschrijvingen en artefact-flows.

```
openspec schemas [options]
```

**Opties:**

| Option | Description |
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
    De standaard spec-gedreven ontwikkelworkflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Aangepaste workflow voor dit project
    Flow: research → proposal → tasks
```

---

## Schema-opdrachten

Opdrachten voor het maken en beheren van aangepaste workflowschema's.

### `openspec schema init`

Maak een nieuw project-lokaal schema.

```
openspec schema init <name> [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `name` | Ja | Schemanaam (kebab-case) |

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--description <text>` | Schemabeschrijving |
| `--artifacts <list>` | Door komma's gescheiden artefact-ID's (standaard: `proposal,specs,design,tasks`) |
| `--default` | Instellen als standaardschema voor het project |
| `--no-default` | Niet vragen om in te stellen als standaard |
| `--force` | Bestaand schema overschrijven |
| `--json` | Uitvoeren als JSON |

**Voorbeelden:**

```bash
# Interactief schema aanmaken
openspec schema init research-first

# Niet-interactief met specifieke artefacten
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**Wat het maakt:**

```
openspec/schemas/<name>/
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
|----------|---------|--------------|
| `source` | Ja | Te kopiëren schema |
| `name` | Nee | Nieuwe schemanaam (standaard: `<source>-custom`) |

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--force` | Bestaande bestemming overschrijven |
| `--json` | Uitvoeren als JSON |

**Voorbeeld:**

```bash
# Fork het ingebouwde spec-driven schema
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
|----------|---------|--------------|
| `name` | Nee | Te valideren schema (valideert allemaal indien weggelaten) |

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--verbose` | Toon gedetailleerde validatiestappen |
| `--json` | Uitvoeren als JSON |

**Voorbeeld:**

```bash
# Valideer een specifiek schema
openspec schema validate my-workflow

# Valideer alle schema's
openspec schema validate
```

---

### `openspec schema which`

Toon waar een schema vandaan wordt opgelost (handig voor het debuggen van prioriteit).

```
openspec schema which [name] [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `name` | Nee | Schemanaam |

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--all` | Toon alle schema's met hun bronnen |
| `--json` | Uitvoeren als JSON |

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

**Schemaprioriteit:**

1. Project: `openspec/schemas/<name>/`
2. Gebruiker: `~/.local/share/openspec/schemas/<name>/`
3. Pakket: Ingebouwde schema's

---

## Configuratie-opdrachten

### `openspec config`

Bekijk en wijzig de globale OpenSpec-configuratie.

```
openspec config <subcommand> [options]
```

**Subopdrachten:**

| Subopdracht | Beschrijving |
|-------------|--------------|
| `path` | Toon locatie van configuratiebestand |
| `list` | Toon alle huidige instellingen |
| `get <key>` | Verkrijg een specifieke waarde |
| `set <key> <value>` | Stel een waarde in |
| `unset <key>` | Verwijder een sleutel |
| `reset` | Terugzetten naar standaardwaarden |
| `edit` | Openen in `$EDITOR` |
| `profile [preset]` | Configureer werkstroomprofiel interactief of via een voorinstelling |

**Voorbeelden:**

```bash
# Toon configuratiebestandspad
openspec config path

# Toon alle instellingen
openspec config list

# Verkrijg een specifieke waarde
openspec config get telemetry.enabled

# Stel een waarde in
openspec config set telemetry.enabled false

# Stel een tekenreekswaarde expliciet in
openspec config set user.name "My Name" --string

# Verwijder een aangepaste instelling
openspec config unset user.name

# Stel een machine-niveau standaardstore in (terugvalroot wanneer geen --store,
# lokale root, of projectstore: pointer wordt opgelost)
openspec config set defaultStore team-plans

# Reset alle configuratie
openspec config reset --all --yes

# Bewerk configuratie in je editor
openspec config edit

# Configureer profiel met actie-gebaseerde wizard
openspec config profile

# Snelle voorinstelling: schakel werkstromen naar core (behoudt leveringsmodus)
openspec config profile core
```

`openspec config profile` begint met een samenvatting van de huidige staat, waarna je kunt kiezen:
- Levering + werkstromen wijzigen
- Alleen levering wijzigen
- Alleen werkstromen wijzigen
- Huidige instellingen behouden (afsluiten)

Als je de huidige instellingen behoudt, worden er geen wijzigingen geschreven en wordt er geen update-prompt getoond.
Als er geen configuratiewijzigingen zijn, maar de huidige projectbestanden niet synchroon lopen met je globaal profiel/levering, toont OpenSpec een waarschuwing en stelt `openspec update` voor.
Drukken op `Ctrl+C` annuleert ook de flow netjes (geen stacktrace) en sluit af met code `130`.
In de werkstroomcontrolelijst betekent `[x]` dat de werkstroom is geselecteerd in de globale configuratie. Om deze selecties toe te passen op projectbestanden, voer je `openspec update` uit (of kies `Wijzigingen nu op dit project toepassen?` wanneer je hierom wordt gevraagd binnen een project).

**Interactieve voorbeelden:**

```bash
# Alleen levering bijwerken
openspec config profile
# kies: Alleen levering wijzigen
# kies levering: Alleen Skills

# Alleen werkstromen bijwerken
openspec config profile
# kies: Alleen werkstromen wijzigen
# schakel werkstromen in de controlelijst, bevestig daarna
```

---

## Hulpopdrachten

### `openspec feedback`

Verzend feedback over OpenSpec. Maakt een GitHub-issue.

```
openspec feedback <message> [options]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|---------|--------------|
| `message` | Ja | Feedbackbericht |

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--body <text>` | Gedetailleerde beschrijving |

**Vereisten:** GitHub CLI (`gh`) moet geïnstalleerd en geauthenticeerd zijn.

**Voorbeeld:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Beheer shellvoltooiingen voor de OpenSpec CLI.

```
openspec completion <subcommand> [shell]
```

**Subopdrachten:**

| Subopdracht | Beschrijving |
|-------------|--------------|
| `generate [shell]` | Voltooiingsscript naar stdout uitvoeren |
| `install [shell]` | Voltooiing installeren voor je shell |
| `uninstall [shell]` | Geïnstalleerde voltoeiingen verwijderen |

**Ondersteunde shells:** `bash`, `zsh`, `fish`, `powershell`

**Voorbeelden:**

```bash
# Installeer voltooiingen (detecteert shell automatisch)
openspec completion install

# Installeer voor specifieke shell
openspec completion install zsh

# Genereer script voor handmatige installatie
openspec completion generate bash > ~/.bash_completion.d/openspec

# Deïnstalleer
openspec completion uninstall
```

---

## Afsluitcodes

| Code | Betekenis |
|------|-----------|
| `0` | Succes |
| `1` | Fout (validatiefout, ontbrekende bestanden, etc.) |

---

## Omgevingsvariabelen

| Variabele | Beschrijving |
|-----------|--------------|
| `OPENSPEC_TELEMETRY` | Instellen op `0` om telemetrie uit te schakelen |
| `DO_NOT_TRACK` | Instellen op `1` om telemetrie uit te schakelen (standaard DNT-signaal) |
| `OPENSPEC_CONCURRENCY` | Standaard gelijktijdigheid voor bulkvalidatie (standaard: 6) |
| `EDITOR` of `VISUAL` | Editor voor `openspec config edit` |
| `NO_COLOR` | Schakel kleuruitvoer uit wanneer ingesteld |

---

## Gerelateerde documentatie

- [Opdrachten](commands.md) - AI slash-opdrachten (`/opsx:propose`, `/opsx:apply`, etc.)
- [Werkstromen](workflows.md) - Veelvoorkomende patronen en wanneer je elke opdracht moet gebruiken
- [Aanpassing](customization.md) - Maak aangepaste schema's en sjablonen
- [Aan de slag](getting-started.md) - Eerste keer installatiegids