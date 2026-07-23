# Migreren naar OPSX

Deze gids helpt u bij de overgang van de verouderde OpenSpec-workflow naar OPSX. De migratie is ontworpen om soepel te verlopen—uw bestaande werk wordt behouden en het nieuwe systeem biedt meer flexibiliteit.

## Wat verandert er?

OPSX vervangt de oude fase-vergrendelde workflow met een vloeiende, op acties gebaseerde aanpak. Hier is de belangrijkste verandering:

| Aspect | Verouderd | OPSX |
|--------|--------|------|
| **Opdrachten** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Standaard: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (uitgebreide workflow-opdrachten optioneel) |
| **Workflow** | Alle artefacten tegelijkertijd aanmaken | Incrementeel of allemaal tegelijk aanmaken—uw keuze |
| **Teruggaan** | Onhandige fasepoorten | Natuurlijk—update elk artefact op elk moment |
| **Aanpassing** | Vaste structuur | Schema-gedreven, volledig hackbaar |
| **Configuratie** | `CLAUDE.md` met markeringen + `project.md` | Schone configuratie in `openspec/config.yaml` |

**De filosofie-verandering:** Werk is niet lineair. OPSX stopt met doen alsof het wel is.

---

## Voordat je begint

### Je bestaande werk is veilig

Het migratieproces is ontworpen met behoud van gegevens in gedachten:

- **Actieve wijzigingen in `openspec/changes/`** — Volledig bewaard. Je kunt ze voortzetten met OPSX-commando's.
- **Gearchiveerde wijzigingen** — Ongewijzigd. Je geschiedenis blijft intact.
- **Hoofdspecificaties in `openspec/specs/`** — Ongewijzigd. Dit zijn je bron van waarheid.
- **Je inhoud in CLAUDE.md, AGENTS.md, enz.** — Bewaard. Alleen de OpenSpec-markeerblokken worden verwijderd; alles wat je hebt geschreven blijft staan.

### Wat wordt verwijderd

Alleen door OpenSpec beheerde bestanden die worden vervangen:

| Wat | Waarom |
|-----|--------|
| Verouderde slash-opdrachtdirectories/-bestanden | Vervangen door het nieuwe vaardighedensysteem |
| `openspec/AGENTS.md` | Verouderde workflow-trigger |
| OpenSpec-markeringen in `CLAUDE.md`, `AGENTS.md`, enz. | Niet langer nodig |

**Verouderde opdrachtlocaties per tool** (voorbeelden—je tool kan variëren):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.cinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (alleen IDE-extensies; niet ondersteund in Copilot CLI)
- Codex: OpenSpec gebruikt nu `.codex/skills/openspec-*`; verouderde opruiming richt zich alleen op op de allowlist van OpenSpec staande promptbestandsnamen in `$CODEX_HOME/prompts` of `~/.codex/prompts`, en verwijdert deze alleen nadat vervangende vaardigheden bestaan.
- En anderen (Augment, Continue, Amazon Q, enz.)

De migratie detecteert welke tools je hebt geconfigureerd en ruimt hun verouderde bestanden op.

De verwijderingslijst lijkt misschien lang, maar dit zijn allemaal bestanden die oorspronkelijk door OpenSpec zijn gemaakt. Je eigen inhoud wordt nooit verwijderd.

### Wat aandacht nodig heeft

Eén bestand vereist handmatige migratie:

**`openspec/project.md`** — Dit bestand wordt niet automatisch verwijderd omdat het projectcontext kan bevatten die je hebt geschreven. Je moet:

1. De inhoud controleren
2. Nuttige context verplaatsen naar `openspec/config.yaml` (zie richtlijnen hieronder)
3. Het bestand verwijderen als je klaar bent

**Waarom we deze wijziging hebben gemaakt:**

Het oude `project.md` was passief—agenten konden het lezen, konden het ook niet, en konden vergeten wat ze hadden gelezen. We vonden dat de betrouwbaarheid inconsistent was.

De nieuwe `config.yaml`-context wordt **actief geïnjecteerd in elke OpenSpec-planningsaanvraag**. Dit betekent dat je projectconventies, techstack en regels altijd aanwezig zijn wanneer de AI artefacten creëert. Hogere betrouwbaarheid.

**De afweging:**

Omdat context in elke aanvraag wordt geïnjecteerd, wil je beknopt zijn. Focus op wat echt belangrijk is:
- Techstack en belangrijke conventies
- Niet voor de hand liggende beperkingen die de AI moet kennen
- Regels die eerder vaak werden genegeerd

Maak je geen zorgen of het perfect wordt. We leren nog wat hier het beste werkt, en we zullen de contextinjectie blijven verbeteren naarmate we experimenteren.

---

## De migratie uitvoeren

Zowel `openspec init` als `openspec update` detecteren verouderde bestanden en begeleiden je door hetzelfde opschoonproces. Gebruik welke past bij je situatie:

- Nieuwe installaties gebruiken standaard profiel `core` (`propose`, `explore`, `apply`, `sync`, `archive`).
- Gemigreerde installaties behouden je eerder geïnstalleerde workflows door een `custom` profiel te schrijven indien nodig.

### `openspec init` gebruiken

Voer dit uit als je nieuwe tools wilt toevoegen of wilt herconfigureren welke tools zijn ingesteld:

```bash
openspec init
```

Het init-commando detecteert verouderde bestanden en begeleidt je door de opruiming:

```
Upgrading to the new OpenSpec

OpenSpec now uses agent skills, the emerging standard across coding
agents. This simplifies your setup while keeping everything working
as before.

Files to remove
No user content to preserve:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Files to update
OpenSpec markers will be removed, your content preserved:
  • CLAUDE.md
  • AGENTS.md

Needs your attention
  • openspec/project.md
    We won't delete this file. It may contain useful project context.

    The new openspec/config.yaml has a "context:" section for planning
    context. This is included in every OpenSpec request and works more
    reliably than the old project.md approach.

    Review project.md, move any useful content to config.yaml's context
    section, then delete the file when ready.

? Upgrade and clean up legacy files? (Y/n)
```

**Wat er gebeurt als je ja zegt:**

1. Verouderde slash-opdrachtdirectories worden verwijderd
2. OpenSpec-markeringen worden gestript uit `CLAUDE.md`, `AGENTS.md`, enz. (je inhoud blijft staan)
3. `openspec/AGENTS.md` wordt verwijderd
4. Nieuwe vaardigheden worden geïnstalleerd in `.claude/skills/`
5. `openspec/config.yaml` wordt aangemaakt met een standaardschema

### `openspec update` gebruiken

Voer dit uit als je alleen wilt migreren en je bestaande tools wilt vernieuwen naar de nieuwste versie:

```bash
openspec update
```

Het update-commando detecteert en ruimt ook verouderde artefacten op, en vernieeft daarna gegenereerde vaardigheden/commando's om overeen te komen met je huidige profiel en leveringsinstellingen.

### Niet-interactieve / CI-omgevingen

Voor gescripte migraties:

```bash
openspec init --force --tools claude
```

De `--force` vlag slaat prompts over en accepteert de opruiming automatisch.

Dit omvat opruiming van door OpenSpec beheerde Codex-promptbestanden in de globale Codex-promptdirectory. Opruiming richt zich alleen op op de allowlist van OpenSpec staande verouderde Codex-promptbestandsnamen, verwijdert deze alleen nadat vervangende `.codex/skills/openspec-*` vaardigheden bestaan, en behoudt alle andere bestanden.

---

## project.md migreren naar config.yaml

Het oude `openspec/project.md` was een vrij vorm markdownbestand voor projectcontext. Het nieuwe `openspec/config.yaml` is gestructureerd en—belangrijkste—**wordt geïnjecteerd in elke planningsaanvraag** zodat je conventies altijd aanwezig zijn wanneer de AI werkt.

### Voor (project.md)

```markdown
# Project Context

This is a TypeScript monorepo using React and Node.js.
We use Jest for testing and follow strict ESLint rules.
Our API is RESTful and documented in docs/api.md.

## Conventions

- All public APIs must maintain backwards compatibility
- New features should include tests
- Use Given/When/Then format for specifications
```

### Na (config.yaml)

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  Testing: Jest with React Testing Library
  API: RESTful, documented in docs/api.md
  We maintain backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan for risky changes
  specs:
    - Use Given/When/Then format for scenarios
    - Reference existing patterns before inventing new ones
  design:
    - Include sequence diagrams for complex flows
```

### Belangrijke verschillen

| project.md | config.yaml |
|------------|-------------|
| Vrij vorm markdown | Gestructureerde YAML |
| Eén klomp tekst | Aparte context en per-artefact regels |
| Onduidelijk wanneer het wordt gebruikt | Context verschijnt in ALLE artefacten; regels verschijnen alleen in overeenkomende artefacten |
| Geen schemaselectie | Expliciete `schema:`-veld stelt standaard workflow in |

### Wat behouden, wat weglaten

Wees selectief bij het migreren. Vraag jezelf af: "Heeft de AI dit nodig voor *elke* planningsaanvraag?"

**Goede kandidaten voor `context:`**
- Techstack (talen, frameworks, databases)
- Belangrijke architectuurpatronen (monorepo, microservices, enz.)
- Niet voor de hand liggende beperkingen ("we kunnen bibliotheek X niet gebruiken omdat...")
- Kritieke conventies die vaak worden genegeerd

**Verplaatsen naar `rules:` in plaats daarvan**
- Artefactspecifieke opmaak ("gebruik Given/When/Then in specificaties")
- Beoordelingscriteria ("voorstellen moeten terugdraaiplannen bevatten")
- Deze verschijnen alleen voor het overeenkomende artefact, waardoor andere aanvragen lichter blijven

**Helemaal weglaten**
- Algemene best practices die de AI al kent
- Uitgebreide uitleg die kan worden samengevat
- Historische context die geen invloed heeft op het huidige werk

### Migratiestappen

1. **config.yaml aanmaken** (indien niet al aangemaakt door init):
   ```yaml
   schema: spec-driven
   ```

2. **Je context toevoegen** (wees beknopt—dit gaat in elke aanvraag):
   ```yaml
   context: |
     Je projectachtergrond gaat hier.
     Focus op wat de AI echt moet weten.
   ```

3. **Per-artefact regels toevoegen** (optioneel):
   ```yaml
   rules:
     proposal:
       - Jouw voorstelspecifieke richtlijnen
     specs:
       - Jouw regels voor het schrijven van specificaties
   ```

4. **project.md verwijderen** zodra je alles nuttigs hebt verplaatst.

**Maak er geen gedoe van.** Begin met de essentie en itereer. Als je merkt dat de AI iets belangrijks mist, voeg het toe. Als de context overladen aanvoelt, trim het. Dit is een levend document.

### Hulp nodig? Gebruik deze prompt

Als je niet zeker weet hoe je je project.md moet samenvatten, vraag je AI-assistent:

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

De AI zal je helpen te identificeren wat essentieel is en wat kan worden getrimd.

---

## De nieuwe commando's

Beschikbaarheid van commando's is profielafhankelijk:

**Standaard (`core` profiel):**

| Commando | Doel |
|----------|------|
| `/opsx:propose` | Maak een wijziging en genereer planningartefacten in één stap |
| `/opsx:explore` | Denk na over ideeën zonder structuur |
| `/opsx:apply` | Implementeer taken uit taken.md |
| `/opsx:archive` | Finaliseer en archiveer de wijziging |

**Uitgebreide workflow (aangepaste selectie):**

| Commando | Doel |
|----------|------|
| `/opsx:new` | Start een nieuwe wijzigingsstructuur |
| `/opsx:continue` | Maak het volgende artefact (één voor één) |
| `/opsx:ff` | Fast-forward—maak planningartefacten in één keer |
| `/opsx:verify` | Valideer of implementatie overeenkomt met specificaties |
| `/opsx:sync` | Voeg delta-specificaties samen met hoofdspecificaties |
| `/opsx:bulk-archive` | Archiveer meerdere wijzigingen in één keer |
| `/opsx:onboard` | Begeleide end-to-end onboarding workflow |

Schakel uitgebreide commando's in met `openspec config profile`, voer daarna `openspec update` uit.

### Opdrachttoewijzing van verouderde systeem

| Verouderd | OPSX-equivalent |
|-----------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (standaard) of `/opsx:new` gevolgd door `/opsx:ff` (uitgebreid) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Nieuwe mogelijkheden

Deze mogelijkheden maken deel uit van de set commando's voor de uitgebreide workflow.

**Gedetailleerde artefactcreatie:**
```
/opsx:continue
```
Maakt één artefact per keer aan op basis van afhankelijkheden. Gebruik dit als je elke stap wilt beoordelen.

**Verkenmodus:**
```
/opsx:explore
```
Denk na over ideeën met een partner voordat je je vastlegt op een wijziging.

---

## De nieuwe architectuur begrijpen

### Van fasergrendeld naar vloeiend

De verouderde workflow dwong een lineaire voortgang:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

If you're in implementation and realize the design is wrong?
Too bad. Phase gates don't let you go back easily.
```

OPSX gebruikt acties, geen fasen:

```
         ┌───────────────────────────────────────────────┐
         │           ACTIONS (not phases)                │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    any order                  │
         └───────────────────────────────────────────────┘
```

### Afhankelijkheidsgraaf

Artefacten vormen een gerichte graaf. Afhankelijkheden zijn mogelijkheden, geen poorten:

```
                        proposal
                       (root node)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (requires:                  (requires:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (requires:
                     specs, design)
```

Wanneer je `/opsx:continue` uitvoert, controleert het wat klaar is en biedt het het volgende artefact aan. Je kunt ook meerdere klaarstaande artefacten in willekeurige volgorde aanmaken.

### Vaardigheden versus commando's

Het verouderde systeem gebruikte toolspecifieke opdrachtbestanden:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX gebruikt de opkomende **vaardigheden** standaard:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Vaardigheden worden herkend door meerdere AI-coderingstools en bieden rijkere metadata.

Codex is vaardigheden-only in OPSX. OpenSpec genereert geen Codex-aangepaste promptbestanden meer; gebruik de gegenereerde `.codex/skills/openspec-*` directories in plaats daarvan.

## Voortbestaande Wijzigingen Voortzetten

Je lopende wijzigingen werken naadloos met OPSX-commando's.

**Heb je een actieve wijziging van de oude workflow?**

```
/opsx:apply add-my-feature
```

OPSX leest de bestaande artefacten en gaat verder waar je gebleven was.

**Wil je meer artefacten toevoegen aan een bestaande wijziging?**

```
/opsx:continue add-my-feature
```

Toont wat klaar is om aangemaakt te worden op basis van wat er al bestaat.

**Wil je de status zien?**

```bash
openspec status --change add-my-feature
```

---

## Het Nieuwe Configuratiesysteem

### config.yaml Structuur

```yaml
# Vereist: Standaardschema voor nieuwe wijzigingen
schema: spec-driven

# Optioneel: Projectcontext (max 50KB)
# Geïnjecteerd in ALLE artefactinstructies
context: |
  Je projectachtergrond, tech stack,
  conventies en beperkingen.

# Optioneel: Regels per artefact
# Alleen geïnjecteerd in overeenkomende artefacten
rules:
  proposal:
    - Voeg een rollbackplan toe
  specs:
    - Gebruik het Given/When/Then-formaat
  design:
    - Documenteer fallbackstrategieën
  tasks:
    - Splits op in maximaal 2-uur blokken
```

### Schema-Oplossing

Bij het bepalen welk schema te gebruiken, controleert OPSX in volgorde:

1. **CLI-vlag**: `--schema <naam>` (hoogste prioriteit)
2. **Wijzigingsmetadata**: `.openspec.yaml` in de wijzigingsmap
3. **Projectconfiguratie**: `openspec/config.yaml`
4. **Standaard**: `spec-driven`

### Beschikbare Schema's

| Schema | Artefacten | Het Beste Voor |
|--------|-----------|----------|
| `spec-driven` | proposal → specs → design → tasks | De meeste projecten |

Toon alle beschikbare schema's:

```bash
openspec schemas
```

### Aangepaste Schema's

Maak je eigen workflow:

```bash
openspec schema init my-workflow```

Of fork een bestaand schema:

```bash
openspec schema fork spec-driven my-workflow
```

Zie [Customization](customization.md) voor details.

---

## Problemen Oplossen

### "Legacy-bestanden gedetecteerd in niet-interactieve modus"

Je voert uit in een CI- of niet-interactieve omgeving. Gebruik:

```bash
openspec init --force
```

### Commando's verschijnen niet na migratie

Herstart je IDE. Skills worden gedetecteerd bij het opstarten.

### "Onbekende artefact-ID in rules"

Controleer dat je `rules:`-sleutelwoorden overeenkomen met de artefact-ID's van je schema:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Voer dit uit om geldige artefact-ID's te zien:

```bash
openspec schemas --json
```

### Configuratie niet toegepast

1. Zorg ervoor dat het bestand op `openspec/config.yaml` staat (niet `.yml`)
2. Valideer de YAML-syntaxis
3. Configuratiewijzigingen worden direct doorgevoerd—geen herstart nodig

### project.md niet gemigreerd

Het systeem bewaat `project.md` opzettelijk omdat het mogelijk je aangepaste inhoud bevat. Bekijk het handmatig, verhandige nuttige delen naar `config.yaml` en verwijder het vervolgens.

### Wil je zien wat er opgeschoond zou worden?

Voer init uit en weiger de opschoonprompt—je ziet dan de volledige detectiesamenvatting zonder dat er wijzigingen worden aangebracht.

---

## Snelle Referentie

### Bestanden Na Migratie

```
project/
├── openspec/
│   ├── specs/                    # Onveranderd
│   ├── changes/                  # Onveranderd
│   │   └── archive/              # Onveranderd
│   └── config.yaml               # NIEUW: Projectconfiguratie
├── .claude/
│   └── skills/                   # NIEUW: OPSX skills
│       ├── openspec-propose/     # standard core profile
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # expanded profile voegt new/continue/ff/etc. toe
├── CLAUDE.md                     # OpenSpec-markeringen verwijderd, je inhoud bewaard
└── AGENTS.md                     # OpenSpec-markeringen verwijderd, je inhoud bewaard
```

### Wat Er Niet Meer Is

- `.claude/commands/openspec/` — vervangen door `.claude/skills/`
- `openspec/AGENTS.md` — verouderd
- `openspec/project.md` — migreer naar `config.yaml`, daarna verwijderen
- OpenSpec-markeringenblokken in `CLAUDE.md`, `AGENTS.md`, etc.

### Command Cheatsheet

```text
/opsx:propose      Snel starten (standaard core profile)
/opsx:apply        Taken implementeren
/opsx:archive      Voltooien en archiveren

# Uitgebreide workflow (indien ingeschakeld):
/opsx:new          Een wijziging scaffolden
/opsx:continue     Volgende artefact aanmaken
/opsx:ff           Planningartefacten aanmaken
```

---

## Hulp Krijgen

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Documentatie**: [docs/opsx.md](opsx.md) voor de volledige OPSX-referentie