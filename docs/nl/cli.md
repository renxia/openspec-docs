# CLI-referentie

De OpenSpec CLI (`openspec`) biedt terminalcommando's voor projectinstellingen, validatie, statuscontrole en beheer. Deze commando's vullen de AI slash-commando's (zoals `/opsx:propose`) aan die gedocumenteerd zijn in [Commands](commands.md).

## Overzicht

| Categorie | Commando's | Doel |
|-----------|------------|------|
| **Setup** | `init`, `update` | Initialiseer en werk OpenSpec bij in uw project |
| **Werkruimtes (beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace update`, `workspace open` | Stel lokale weergaven in over gekoppelde repositories of mappen |
| **Gedeelde context (beta)** | `context-store setup`, `context-store register`, `context-store unregister`, `context-store remove`, `context-store list`, `context-store doctor`, `initiative create`, `initiative show`, `initiative list` | Beheer lokale context-store registraties en duurzame initiatiefcontext |
| **Bladeren** | `list`, `view`, `show` | Verken wijzigingen en specificaties |
| **Validatie** | `validate` | Controleer wijzigingen en specificaties op problemen |
| **Levenscyclus** | `archive` | Rond voltooide wijzigingen af |
| **Werkstroom** | `new change`, `set change`, `status`, `instructions`, `templates`, `schemas` | Ondersteuning voor op artefacten gebaseerde werkstromen |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Maak en beheer aangepaste werkstromen |
| **Configuratie** | `config` | Bekijk en bewerk instellingen |
| **Hulpmiddelen** | `feedback`, `completion` | Feedback en shell-integratie |

---

## Mens versus Agent Commando's

De meeste CLI-commando's zijn ontworpen voor **menselijk gebruik** in een terminal. Sommige commando's ondersteunen ook **agent/script-gebruik** via JSON-uitvoer.

### Alleen-Mens Commando's

Deze commando's zijn interactief en ontworpen voor gebruik in de terminal:

| Commando | Doel |
|---------|---------|
| `openspec init` | Project initialiseren (interactieve prompts) |
| `openspec view` | Interactief dashboard |
| `openspec config edit` | Configuratie openen in editor |
| `openspec feedback` | Feedback indienen via GitHub |
| `openspec completion install` | Shell-voltooiingen installeren |

### Agent-Compatibele Commando's

Deze commando's ondersteunen `--json`-uitvoer voor programmatisch gebruik door AI-agents en scripts:

| Commando | Menselijk Gebruik | Agent-Gebruik |
|---------|-----------|-----------|
| `openspec list` | Wijzigingen/specs doorbladeren | `--json` voor gestructureerde gegevens |
| `openspec show <item>` | Inhoud lezen | `--json` voor parsen |
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
| `openspec workspace update` | Werkruimte-specifieke begeleiding en agentvaardigheden vernieuwen | `--tools` selecteert agents; profiel selecteert werkstromen |
| `openspec context-store setup <id>` | Een lokale contextopslag aanmaken | `--json` met expliciete invoer voor gestructureerde setup-uitvoer |
| `openspec context-store register <path>` | Een bestaande contextopslag registreren | `--json` voor gestructureerde registratieuitvoer |
| `openspec context-store unregister <id>` | Een registratie van lokale contextopslag vergeten | `--json` voor gestructureerde schoonmaakuitvoer |
| `openspec context-store remove <id>` | De geregistreerde map met lokale contextopslag verwijderen | `--yes --json` voor niet-interactieve verwijdering |
| `openspec context-store list` | Geregistreerde contextopslag doorbladeren | `--json` voor gestructureerde registraties |
| `openspec context-store doctor` | Lokale opslagconfiguratie controleren | `--json` voor gestructureerde diagnostiek |
| `openspec initiative list` | Gedeelde initiatieven doorbladeren | `--json` voor gestructureerde initiatiefrecords |
| `openspec initiative show <id>` | Een initiatief oplossen | `--json` voor canonieke paden en metadata |
| `openspec new change <id>` | Repo-lokale wijzigingsscaffold aanmaken | `--json`, plus `--initiative` voor gedeelde coördinatielinks |
| `openspec set change <id` | Ingecheckte wijzigingsmetadata bijwerken | `--json`, plus `--initiative` voor gedeelde coördinatielinks |

---

## Globale Opties

Deze opties werken met alle commando's:

| Optie | Beschrijving |
|--------|-------------|
| `--version`, `-V` | Versienummer weergeven |
| `--no-color` | Kleurenuitvoer uitschakelen |
| `--help`, `-h` | Help voor commando weergeven |

---

## Setup Commando's

### `openspec init`

Initialiseer OpenSpec in uw project. Maakt de mapstructuur aan en configureert AI-toolintegraties.

Standaard gedrag gebruikt globale configuratiedefaults: profiel `core`, levering `both`, werkstromen `propose, explore, apply, sync, archive`.

```
openspec init [pad] [opties]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `pad` | Nee | Doelmap (standaard: huidige map) |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--tools <lijst>` | AI-tools niet-interactief configureren. Gebruik `all`, `none`, of kommagescheiden lijst |
| `--force` | Automatisch oude bestanden opruimen zonder melding |
| `--profile <profiel>` | Globaal profiel overschrijven voor deze init-run (`core` of `custom`) |

`--profile custom` gebruikt de werkstromen die momenteel zijn geselecteerd in de globale configuratie (`openspec config profile`).

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

# Prompts overslaan en oude bestanden automatisch opruimen
openspec init --force
```

**Wat het aanmaakt:**

```
openspec/
├── specs/              # Uw specificaties (bron van waarheid)
├── changes/            # Voorgestelde wijzigingen
└── config.yaml         # Projectconfiguratie

.claude/skills/         # Claude Code-vaardigheden (als claude is geselecteerd)
.cursor/skills/         # Cursor-vaardigheden (als cursor is geselecteerd)
.cursor/commands/       # Cursor OPSX-commando's (als levering commando's bevat)
... (andere toolconfiguraties)
```

---

### `openspec update`

Werk OpenSpec-instructiebestanden bij na het upgraden van de CLI. Genereert AI-toolconfiguratiebestanden opnieuw met uw huidige profiel, geselecteerde werkstromen en leveringsmodus.

```
openspec update [pad] [opties]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `pad` | Nee | Doelmap (standaard: huidige map) |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--force` | Update forceren zelfs wanneer bestanden up-to-date zijn |

**Voorbeeld:**

```bash
# Werk instructiebestanden bij na npm-upgrade
npm update @fission-ai/openspec
openspec update
```

---

## Werkruimte Commando's

Werkruimte commando's zijn in bèta. Het onderstaande lokale-weergavemodel is de huidige richting, maar externe automatisering, integraties en langlopende werkstromen moeten het commandogedrag, statusbestanden en JSON-uitvoer nog steeds als in ontwikkeling beschouwen.

Coördinatiewerkruimtes zijn machine-lokale weergaven over gekoppelde repo's of mappen. Werkruimtezichtbaarheid is geen wijzigingscommitment: koppel de repo's of mappen die OpenSpec moet kennen, en maak vervolgens wijzigingen aan wanneer u specifiek werk wilt plannen.

### `openspec workspace setup`

Maak een werkruimte aan op de standaard OpenSpec-werkruimtelocatie en koppel minstens één bestaande repo of map.

```bash
openspec workspace setup [opties]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--name <naam>` | Werkruimtenamen. Namen moeten kebab-case zijn |
| `--link <pad>` | Koppel een bestaande repo of map en leid de koppelingsnaam af van de mapnaam |
| `--link <naam>=<pad>` | Koppel een bestaande repo of map met een expliciete koppelingsnaam |
| `--opener <id>` | Sla een voorkeursopener op tijdens niet-interactieve setup: `codex-cli`, `claude`, `github-copilot`, of `editor` |
| `--tools <tools>` | Installeer werkruimte-specifieke OpenSpec-vaardigheden voor agents. Gebruik `all`, `none`, of kommagescheiden tool-ID's |
| `--no-interactive` | Schakel prompts uit; vereist `--name` en minstens één `--link` |
| `--json` | Geef JSON-uitvoer; vereist `--no-interactive` |

**Voorbeelden:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli
openspec workspace setup --no-interactive --name platform --link /repos/api --tools codex,claude
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

Interactieve setup vraagt om een voorkeursopener en kan werkruimte-specifieke OpenSpec-vaardigheden installeren voor geselecteerde agents. Niet-interactieve setup slaat een voorkeursopener alleen op wanneer `--opener` is opgegeven; anders vraagt `workspace open` later in interactieve terminals wanneer een ondersteunde opener beschikbaar is, of vraagt scripts om `--agent <tool>` of `--editor` door te geven.

Werkruimtevaardigheid-installatie is in deze bèta-fase alleen vaardigheden: zelfs als globale levering `commands` of `both` is, schrijft werkruimte-setup agentvaardigheidsmappen in de werkruimteroot en maakt het geen slashcommandobestanden aan. Het actieve globale profiel bepaalt welke werkstroomvaardigheden worden geïnstalleerd; `--tools` bepaalt welke agents ze ontvangen. Als `--tools` is weggelaten in niet-interactieve setup, worden geen vaardigheden geïnstalleerd en kan `workspace update --tools <ids>` ze later toevoegen.

### `openspec workspace list`

Geef bekende OpenSpec-werkruimtes weer uit het lokale register.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

De lijst toont elke werkruimtelocatie en gekoppelde repo's of mappen. Verouderde registerrecords worden gerapporteerd maar niet gewijzigd.

### `openspec workspace link`

Leg een bestaande repo of map vast voor één werkruimte.

```bash
openspec workspace link [naam] <pad> [opties]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--workspace <naam>` | Selecteer een bekende werkruimte uit het lokale register |
| `--json` | Geef JSON-uitvoer |
| `--no-interactive` | Schakel werkruimtekiezer-prompts uit |

**Voorbeelden:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

Het pad moet al bestaan. Relatieve paden worden opgelost ten opzichte van de huidige map van het commando voordat OpenSpec het geverifieerde absolute pad opslaat in de machine-lokale werkruimtestatus. Gekoppelde paden kunnen volledige repo's, packages, services, apps of mappen zijn zonder repo-lokale `openspec/`-status.

### `openspec workspace relink`

Herstel of wijzig het lokale pad voor een bestaande koppeling.

```bash
openspec workspace relink <naam> <pad> [opties]
```

Het pad moet al bestaan. Relink werkt alleen het machine-lokale pad bij voor de stabiele koppelingsnaam.

### `openspec workspace doctor`

Controleer wat één werkruimte kan oplossen op de huidige machine.

```bash
openspec workspace doctor [opties]
```

Doctor toont de werkruimtelocatie, gekoppelde repo's of mappen, ontbrekende paden, repo-lokale specificatiepaden indien aanwezig, en voorgestelde oplossingen. JSON-uitvoer bevat ook het werkruimteplanningspad voor compatibiliteit. Het rapporteert alleen problemen; het herstelt ze niet automatisch.

Commando's die één werkruimte nodig hebben, gebruiken de huidige werkruimte wanneer ze worden uitgevoerd vanuit een werkruitmap of submap. Van elders, geef `--workspace <naam>` door, selecteer uit de kiezer in een interactieve terminal, of vertrouw op de enige bekende werkruimte wanneer er precies één bestaat. In `--json` of `--no-interactive` modus mislukt dubbelzinnige selectie met een gestructureerde statusfout en stelt `--workspace <naam>` voor.

JSON-antwoorden gebruiken getypeerde objecten plus `status`-arrays. Primaire gegevens staan in `workspace`, `workspaces` of `link`; waarschuwingen en fouten staan in `status`.

### `openspec workspace update`

Vernieuw werkruimte-specifieke OpenSpec-begeleiding en agentvaardigheden.

```bash
openspec workspace update [naam] [opties]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--workspace <naam>` | Selecteer een bekende werkruimte uit het lokale register |
| `--tools <tools>` | Selecteer agents voor werkruimtevaardigheden. Gebruik `all`, `none`, of kommagescheiden tool-ID's |
| `--json` | Geef JSON-uitvoer |
| `--no-interactive` | Schakel werkruimtekiezer-prompts uit |

**Voorbeelden:**

```bash
openspec workspace update
openspec workspace update platform
openspec workspace update --workspace platform --tools codex,claude
openspec workspace update --workspace platform --tools none
```

`workspace update` vernieuwt het gegenereerde werkruimtebegeleidingsblok en het lokale open oppervlak. Voor agentvaardigheden hergebruikt het de opgeslagen werkruimtevaardigheidsagentselectie wanneer `--tools` is weggelaten. Het doorgeven van `--tools` vervangt die opgeslagen selectie. Het vernieuwt alleen door OpenSpec beheerde werkstroomvaardigheidsmappen in de werkruimteroot, verwijdert gedeselecteerde beheerde werkstroomvaardigheden, en laat gekoppelde repo's en mappen onaangeroerd.

Het uitvoeren van `openspec update` vanuit een werkruimte leidt om naar `openspec workspace update`; voer `openspec update` uit binnen repo-lokale projecten wanneer u wilt dat repo-eigen toolbestanden worden bijgewerkt.

### `openspec workspace open`

Open een werkruimte-werkset via de opgeslagen voorkeursopener, een een-sessie agent-overschrijving of VS Code editor-modus.

```bash
openspec workspace open [naam] [opties]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--workspace <naam>` | Alias voor de positionele werkruimtenaam |
| `--initiative <id>` | Open een initiatief als een lokale werkruimteweergave. Accepteert `<id>` of `<store>/<id>` |
| `--store <id>` | Geregistreerde contextopslag-ID voor `--initiative` |
| `--store-path <pad>` | Bestaande lokale contextopslagroot voor `--initiative` |
| `--agent <tool>` | Een-sessie agent-overschrijving: `codex-cli`, `claude`, of `github-copilot` |
| `--editor` | Open het onderhouden VS Code-werkruimtebestand als een normaal editor-werkruimte |
| `--no-interactive` | Schakel werkruimte- en openerkiezer-prompts uit |

**Voorbeelden:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex-cli
openspec workspace open --editor
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative platform/billing-launch
```

`workspace open` gebruikt de huidige werkruimte wanneer het binnen één wordt uitgevoerd, selecteert automatisch de enige bekende werkruimte wanneer het elders wordt uitgevoerd, en vraagt de gebruiker om te kiezen wanneer meerdere werkruimtes bekend zijn. `--agent` en `--editor` veranderen de opgeslagen voorkeursopener niet. Het doorgeven van beide opener-overschrijvingen is een fout; kies ofwel `--agent <tool>` of `--editor`.

Wanneer `--initiative` wordt gebruikt, bereidt of selecteert OpenSpec een privé lokale werkruimteweergave voor dat initiatief. Via het register geselecteerde opslagplaatsen worden opgeslagen op ID; `--store-path` slaat een runtime-lokale padkiezer op omdat werkruimteweergaven privé lokale status zijn.

OpenSpec onderhoudt `<werkruimtenaam>.code-workspace` in de werkruimteroot voor VS Code-editor en GitHub Copilot-in-VS-Code opens. Dat bestand is machine-lokale werkruimteweergavestatus.

Het onderhouden VS Code-werkruimtebestand geeft eerst geldige gekoppelde repo's of mappen weer, dan initiatiefcontext wanneer gekoppeld, dan de OpenSpec-werkruimtebestanden. VS Code geeft die items weer als een multi-root werkruimte.

Rootwerkruimte-open maakt gekoppelde repo's of mappen zichtbaar voor verkenning en context. Implementatiebewerkingen moeten pas beginnen na een expliciet verzoek van de gebruiker en een normaal OpenSpec-implementatiewerkproces.

## Gedeelde Context Commando's

Contextopslag en initiatieven zijn bèta-coördinatieoppervlakken. Een contextopslag is een lokale registratie voor duurzame gedeelde context, meestal een Git-ondersteunde map of kloon. Een initiatief is gedeelde coördinatiecontext binnen een contextopslag; repo-lokale wijzigingen kunnen eraan koppelen zonder het gedeelde plan naar elke repo te kopiëren.

### `openspec context-store setup`

Maak een lokale contextopslag aan en registreer deze. Zonder argumenten in een terminal
leidt OpenSpec de gebruiker door het installatieproces. Agents en scripts moeten expliciete
invoer meegeven en `--json` gebruiken.

```bash
openspec context-store setup [id] [options]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--path <path>` | Pad naar de contextopslagmap; standaard naar het door OpenSpec beheerde lokale gegevensdirectory |
| `--init-git` | Initialiseer een Git-repository in de contextopslag |
| `--no-init-git` | Initialiseer geen Git-repository |
| `--json` | Voer JSON uit |

Wanneer `--path` is weggelaten, maakt de setup de opslag aan onder `getGlobalDataDir()/context-stores/<id>`: `$XDG_DATA_HOME/openspec/context-stores/<id>` als `XDG_DATA_HOME` is ingesteld, of `~/.local/share/openspec/context-stores/<id>` als Unix-achtige fallback. Geef `--path` op als u de opslag in een zichtbare kloon of team specifieke map wilt hebben.

Voorbeelden:

```bash
openspec context-store setup
openspec context-store setup team-context
openspec context-store setup team-context --path /repos/team-context --no-init-git
openspec context-store setup team-context --json --no-init-git
```

### `openspec context-store register`

Registreer een bestaande lokale contextopslagmap.

```bash
openspec context-store register [path] [options]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--id <id>` | Contextopslag-id; standaard naar opslagmetadata of mapnaam |
| `--json` | Voer JSON uit |

### `openspec context-store unregister`

Vergeet een lokale contextopslag-registratie zonder bestanden te verwijderen.

```bash
openspec context-store unregister <id> [--json]
```

Gebruik dit wanneer een opslag is verplaatst, elders is gekloond, of niet meer op deze machine door OpenSpec moet worden weergegeven.

### `openspec context-store remove`

Vergeet een lokale contextopslag-registratie en verwijder de bijbehorende lokale map.

```bash
openspec context-store remove <id> [--yes] [--json]
```

`remove` toont de exacte map vóór verwijdering in een interactieve terminal.
Agents, scripts en JSON-oproepers moeten `--yes` meegeven om verwijdering te bevestigen.
OpenSpec weigert een map te verwijderen die geen overeenkomstige
contextopslag-metadata bevat.

### `openspec context-store list`

Toon lokaal geregistreerde contextopslag.

```bash
openspec context-store list [--json]
openspec context-store ls [--json]
```

### `openspec context-store doctor`

Controleer de lokale contextopslag-registratie, metadata en de aanwezigheid van Git.

```bash
openspec context-store doctor [id] [--json]
```

Doctor is alleen diagnostisch; het rapporteert ontbrekende roots, metadata-overeenkomsten en ongeldige lokale registratiestatus zonder de opslag te wijzigen.

### `openspec initiative create`

Maak een initiatief aan in een contextopslag.

```bash
openspec initiative create <id> --title <title> --summary <summary> [options]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--store <id>` | Contextopslag-id uit de lokale registratie |
| `--store-path <path>` | Bestaande lokale contextopslag root |
| `--title <title>` | Titel van het initiatief |
| `--summary <summary>` | Samenvatting van het initiatief |
| `--json` | Voer JSON uit |

### `openspec initiative list`

Toon initiatieven. Zonder een selector doorzoekt dit alle geregistreerde contextopslag en rapporteert gedeeltelijk lees-waarschuwingen in `status`.

```bash
openspec initiative list [options]
openspec initiative ls [options]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--store <id>` | Toon één geregistreerde contextopslag |
| `--store-path <path>` | Toon één bestaande lokale contextopslag root |
| `--json` | Voer JSON uit |

### `openspec initiative show`

Bepaal een initiatief en druk de canonieke locatie af.

```bash
openspec initiative show <id> [options]
openspec initiative show <store>/<id> [options]
```

Zonder `--store` doorzoekt OpenSpec geregistreerde contextopslag. Als hetzelfde initiatief-id in meerdere opslagplaatsen bestaat, geef dan `--store <id>` op of gebruik de `<store>/<id>` notatie.

---

## Bladercommando's

### `openspec list`

Lijst wijzigingen of specificaties in je project op.

```
openspec list [opties]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--specs` | Lijst specificaties op in plaats van wijzigingen |
| `--changes` | Lijst wijzigingen op (standaard) |
| `--sort <volgorde>` | Sorteer op `recent` (standaard) of `name` |
| `--json` | Uitvoer als JSON |

**Voorbeelden:**

```bash
# Lijst alle actieve wijzigingen op
openspec list

# Lijst alle specificaties op
openspec list --specs

# JSON-uitvoer voor scripts
openspec list --json
```

**Uitvoer (tekst):**

```
Actieve wijzigingen:
  add-dark-mode     Ondersteuning voor UI-themawisseling
  fix-login-bug     Afhandeling van sessietime-out
```

---

### `openspec view`

Toon een interactief dashboard voor het verkennen van specificaties en wijzigingen.

```
openspec view
```

Opent een terminalgebaseerde interface voor het navigeren door de specificaties en wijzigingen van je project.

---

### `openspec show`

Toon details van een wijziging of specificatie.

```
openspec show [item-naam] [opties]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `item-naam` | Nee | Naam van wijziging of specificatie (vraagt indien weggelaten) |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--type <type>` | Geef type op: `change` of `spec` (automatisch gedetecteerd indien eenduidig) |
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

# JSON-uitvoer voor parsing
openspec show add-dark-mode --json
```

---

## Validatiecommando's

### `openspec validate`

Valideer wijzigingen en specificaties op structurele problemen.

```
openspec validate [item-naam] [opties]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `item-naam` | Nee | Specifiek item om te valideren (vraagt indien weggelaten) |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--all` | Valideer alle wijzigingen en specificaties |
| `--changes` | Valideer alle wijzigingen |
| `--specs` | Valideer alle specificaties |
| `--type <type>` | Geef type op wanneer naam eenduidig is: `change` of `spec` |
| `--strict` | Schakel strikte validatiemodus in |
| `--json` | Uitvoer als JSON |
| `--concurrency <n>` | Maximale parallelle validaties (standaard: 6, of `OPENSPEC_CONCURRENCY` env) |
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
openspec archive [wijziging-naam] [opties]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `wijziging-naam` | Nee | Wijziging om te archiveren (vraagt indien weggelaten) |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `-y, --yes` | Sla bevestigingsprompts over |
| `--skip-specs` | Sla specificatie-updates over (voor infrastructuur/tooling/docs-alleen wijzigingen) |
| `--no-validate` | Sla validatie over (vereist bevestiging) |

**Voorbeelden:**

```bash
# Interactief archiveren
openspec archive

# Archiveer specifieke wijziging
openspec archive add-dark-mode

# Archiveer zonder prompts (CI/scripts)
openspec archive add-dark-mode --yes

# Archiveer een tooling-wijziging die geen specificaties beïnvloedt
openspec archive update-ci-config --skip-specs
```

**Wat het doet:**

1. Valideert de wijziging (tenzij `--no-validate`)
2. Vraagt om bevestiging (tenzij `--yes`)
3. Voegt delta-specificaties samen in `openspec/specs/`
4. Verplaatst wijzigingenmap naar `openspec/changes/archive/YYYY-MM-DD-<naam>/`
```

---

## Workflowcommando's

Deze commando's ondersteunen de op artefacten gebaseerde OPSX-workflow. Ze zijn nuttig voor zowel mensen die de voortgang controleren als agents die de volgende stappen bepalen.

### `openspec new change`

Maak een repo-lokale wijzigingsmap en optionele ingecheckte metadata aan.

```bash
openspec new change <naam> [opties]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--description <tekst>` | Beschrijving om toe te voegen aan `README.md` |
| `--goal <tekst>` | Werkruimtedoelstelling om op te slaan bij de wijziging |
| `--areas <namen>` | Door komma's gescheiden namen van beïnvloede werkruimtekoppelingen |
| `--initiative <id>` | Koppel de repo-lokale wijziging aan een initiatief |
| `--store <id>` | Contextopslag-id voor `--initiative` |
| `--store-path <pad>` | Bestaande lokale contextopslagroot voor `--initiative` |
| `--schema <naam>` | Te gebruiken worksflowschema |
| `--json` | Uitvoer als JSON |

Voorbeelden:

```bash
openspec new change add-billing-api --initiative billing-launch --store platform
openspec new change add-billing-api --initiative platform/billing-launch --json
```

### `openspec set change`

Werk ingecheckte repo-lokale wijzigingsmetadata bij zonder de wijziging opnieuw aan te maken.

```bash
openspec set change <naam> [opties]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--initiative <id>` | Koppel de repo-lokale wijziging aan een initiatief |
| `--store <id>` | Contextopslag-id voor `--initiative` |
| `--store-path <pad>` | Bestaande lokale contextopslagroot voor `--initiative` |
| `--json` | Uitvoer als JSON |

`set change --initiative` is idempotent wanneer de gevraagde koppeling al bestaat en weigert een bestaande initiatiefkoppeling te vervangen.

### `openspec status`

Toon de voltooiingsstatus van artefacten voor een wijziging.

```
openspec status [opties]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--change <id>` | Naam van de wijziging (vraagt indien weggelaten) |
| `--schema <naam>` | Schema-overschrijving (automatisch gedetecteerd uit de configuratie van de wijziging) |
| `--json` | Uitvoer als JSON |

**Voorbeelden:**

```bash
# Interactieve statuscontrole
openspec status

# Status voor specifieke wijziging
openspec status --change add-dark-mode

# JSON voor gebruik door agenten
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

Verkrijg verrijkte instructies voor het aanmaken van een artefact of het toepassen van taken. Gebruikt door AI-agenten om te begrijpen wat ze als volgende moeten aanmaken.

```
openspec instructions [artefact] [opties]
```

**Argumenten:**

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `artefact` | Nee | Artefact-id: `proposal`, `specs`, `design`, `tasks`, of `apply` |

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--change <id>` | Naam van de wijziging (vereist in niet-interactieve modus) |
| `--schema <naam>` | Schema-overschrijving |
| `--json` | Uitvoer als JSON |

**Speciaal geval:** Gebruik `apply` als artefact om implementatie-instructies voor taken te krijgen.

**Voorbeelden:**

```bash
# Verkrijg instructies voor volgend artefact
openspec instructions --change add-dark-mode

# Verkrijg specifieke artefact-instructies
openspec instructions design --change add-dark-mode

# Verkrijg implementatie-instructies voor het toepassen
openspec instructions apply --change add-dark-mode

# JSON voor agentgebruik
openspec instructions design --change add-dark-mode --json
```

**Uitvoer bevat:**

- Sjabloonninhoud voor het artefact
- Projectcontext uit configuratie
- Inhoud van afhankelijke artefacten
- Per-artefact regels uit configuratie

---

### `openspec templates`

Toon opgeloste sjabloonpaden voor alle artefacten in een schema.

```
openspec templates [opties]
```

**Opties:**

| Optie | Beschrijving |
|--------|-------------|
| `--schema <naam>` | Te inspecteren schema (standaard: `spec-driven`) |
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

Lijst beschikbare workflowschema's op met hun beschrijvingen en artefactstromen.

```
openspec schemas [opties]
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

  spec-driven (pakket)
    De standaard spec-driven ontwikkelingsworkflow
    Stroom: proposal → specs → design → tasks

  my-custom (project)
    Aangepaste workflow voor dit project
    Stroom: research → proposal → tasks
```

---

## Schema-opdrachten

Opdrachten voor het aanmaken en beheren van aangepaste werkschemas.

### `openspec schema init`

Maak een nieuw projectlokaal schema aan.

```
openspec schema init <naam> [opties]
```

**Argumenten:**

| Argument | Verplicht | Beschrijving |
|----------|-----------|--------------|
| `naam` | Ja | Naam van het schema (kebab-case) |

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--description <tekst>` | Beschrijving van het schema |
| `--artifacts <lijst>` | Door komma's gescheiden artifact-ID's (standaard: `proposal,specs,design,tasks`) |
| `--default` | Instellen als standaardschema voor het project |
| `--no-default` | Niet vragen om als standaard in te stellen |
| `--force` | Bestaand schema overschrijven |
| `--json` | Uitvoer als JSON |

**Voorbeelden:**

```bash
# Interactieve schema-aanmaak
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
├── schema.yaml           # Schema-definitie
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

| Argument | Verplicht | Beschrijving |
|----------|-----------|--------------|
| `bron` | Ja | Te kopiëren schema |
| `naam` | Nee | Nieuwe schemanaam (standaard: `<bron>-custom`) |

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--force` | Bestaande bestemming overschrijven |
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

| Argument | Verplicht | Beschrijving |
|----------|-----------|--------------|
| `naam` | Nee | Te valideren schema (valideert allemaal indien weggelaten) |

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

Toont waar een schema vandaan wordt opgelost (handig voor het debuggen van prioriteit).

```
openspec schema which [naam] [opties]
```

**Argumenten:**

| Argument | Verplicht | Beschrijving |
|----------|-----------|--------------|
| `naam` | Nee | Schemanaam |

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--all` | Alle schema's met hun bronnen weergeven |
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

**Schema-prioriteit:**

1. Project: `openspec/schemas/<naam>/`
2. Gebruiker: `~/.local/share/openspec/schemas/<naam>/`
3. Pakket: Ingebouwde schema's

---

## Configuratie-opdrachten

### `openspec config`

Bekijk en wijzig de globale OpenSpec-configuratie.

```
openspec config <subopdracht> [opties]
```

**Subopdrachten:**

| Subopdracht | Beschrijving |
|-------------|--------------|
| `path` | Locatie van het configuratiebestand tonen |
| `list` | Alle huidige instellingen weergeven |
| `get <sleutel>` | Een specifieke waarde ophalen |
| `set <sleutel> <waarde>` | Een waarde instellen |
| `unset <sleutel>` | Een sleutel verwijderen |
| `reset` | Terugzetten naar standaardwaarden |
| `edit` | Openen in `$EDITOR` |
| `profile [preset]` | Werkstroomprofiel interactief of via een preset configureren |

**Voorbeelden:**

```bash
# Toon pad naar configuratiebestand
openspec config path

# Toon alle instellingen
openspec config list

# Haal een specifieke waarde op
openspec config get telemetry.enabled

# Stel een waarde in
openspec config set telemetry.enabled false

# Stel een tekenreekswaarde expliciet in
openspec config set user.name "Mijn Naam" --string

# Verwijder een aangepaste instelling
openspec config unset user.name

# Reset alle configuratie
openspec config reset --all --yes

# Bewerk configuratie in je editor
openspec config edit

# Configureer profiel met een op acties gebaseerde wizard
openspec config profile

# Snelle preset: werkstromen omschakelen naar kern (behoudt leveringsmodus)
openspec config profile core
```

`openspec config profile` begint met een overzicht van de huidige status, waarna je kunt kiezen:
- Levering + werkstromen wijzigen
- Alleen levering wijzigen
- Alleen werkstromen wijzigen
- Huidige instellingen behouden (afsluiten)

Als je huidige instellingen behoudt, worden geen wijzigingen geschreven en wordt geen updateprompt getoond.
Als er geen configuratiewijzigingen zijn, maar de huidige project- of werkruimtebestanden niet gesynchroniseerd zijn met je globale profiel/levering, toont OpenSpec een waarschuwing en stelt `openspec update` voor voor repo-lokale projecten of `openspec workspace update` voor werkruimte-lokale begeleiding en vaardigheden.
Het indrukken van `Ctrl+C` annuleert de flow ook netjes (geen stacktrace) en sluit af met code `130`.
In de werkstroomchecklist betekent `[x]` dat de werkstroom is geselecteerd in de globale configuratie. Om die selecties op projectbestanden toe te passen, voer je `openspec update` uit (of kies je `Wijzigingen nu op dit project toepassen?` wanneer je binnen een project wordt gevraagd). Vanuit een werkruimte gebruik je `openspec workspace update` om werkruimte-lokale begeleiding en vaardigheden te verversen; dit blijft beperkt tot vaardigheden voor gegenereerde werkstroombestanden van agenten en genereert geen werkruimte-slash-opdrachten.

**Interactieve voorbeelden:**

```bash
# Alleen levering bijwerken
openspec config profile
# kies: Alleen levering wijzigen
# kies levering: Alleen vaardigheden

# Alleen werkstromen bijwerken
openspec config profile
# kies: Alleen werkstromen wijzigen
# vink werkstromen aan/uit in de checklist en bevestig
```

---

## Hulpopdrachten

### `openspec feedback`

Dien feedback over OpenSpec in. Maakt een GitHub-issue aan.

```
openspec feedback <bericht> [opties]
```

**Argumenten:**

| Argument | Verplicht | Beschrijving |
|----------|-----------|--------------|
| `bericht` | Ja | Feedbackbericht |

**Opties:**

| Optie | Beschrijving |
|-------|--------------|
| `--body <tekst>` | Gedetailleerde beschrijving |

**Vereisten:** GitHub CLI (`gh`) moet geïnstalleerd en geauthenticeerd zijn.

**Voorbeeld:**

```bash
openspec feedback "Voeg ondersteuning voor aangepaste artifact-typen toe" \
  --body "Ik zou mijn eigen artifact-typen willen definiëren naast de ingebouwde."
```

---

### `openspec completion`

Beheer shell-autocompleties voor de OpenSpec CLI.

```
openspec completion <subopdracht> [shell]
```

**Subopdrachten:**

| Subopdracht | Beschrijving |
|-------------|--------------|
| `generate [shell]` | Genereer autocompletescript naar stdout |
| `install [shell]` | Installeer autocompletion voor je shell |
| `uninstall [shell]` | Verwijder geïnstalleerde autocompleties |

**Ondersteunde shells:** `bash`, `zsh`, `fish`, `powershell`

**Voorbeelden:**

```bash
# Installeer autocompleties (detecteert shell automatisch)
openspec completion install

# Installeer voor een specifieke shell
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
| `1` | Fout (validatiefout, ontbrekende bestanden, enz.) |

---

## Omgevingsvariabelen

| Variabele | Beschrijving |
|-----------|--------------|
| `OPENSPEC_TELEMETRY` | Stel in op `0` om telemetrie uit te schakelen |
| `DO_NOT_TRACK` | Stel in op `1` om telemetrie uit te schakelen (standaard DNT-signaal) |
| `OPENSPEC_CONCURRENCY` | Standaard gelijktijdigheid voor bulkvalidatie (standaard: 6) |
| `EDITOR` of `VISUAL` | Editor voor `openspec config edit` |
| `NO_COLOR` | Schakel kleuruitvoer uit indien ingesteld |

---

## Gerelateerde Documentatie

- [Opdrachten](commands.md) - AI slash-opdrachten (`/opsx:propose`, `/opsx:apply`, enz.)
- [Werkstromen](workflows.md) - Veelgebruikte patronen en wanneer elke opdracht te gebruiken
- [Aanpassing](customization.md) - Maak aangepaste schema's en sjablonen
- [Aan de slag](getting-started.md) - Installatiehandleiding voor de eerste keer