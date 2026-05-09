# Migreren naar OPSX

Deze gids helpt u bij de overgang van de verouderde OpenSpec-werkstroom naar OPSX. De migratie is ontworpen om soepel te verlopen—uw bestaande werk wordt behouden, en het nieuwe systeem biedt meer flexibiliteit.

## Wat verandert er?

OPSX vervangt de oude fase-gebonden werkstroom door een flexibele, actie-gebaseerde aanpak. Dit is de belangrijkste verschuiving:

| Aspect | Verouderd | OPSX |
|--------|-----------|------|
| **Commando's** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Standaard: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (uitgebreide werkstroomcommando's optioneel) |
| **Werkstroom** | Maak alle artefacten tegelijk aan | Maak incrementeel of allemaal tegelijk aan—uw keuze |
| **Teruggaan** | Ongemakkelijke fasepoorten | Natuurlijk—werk elk artefact op elk moment bij |
| **Aanpassing** | Vaste structuur | Schema-gestuurd, volledig aanpasbaar |
| **Configuratie** | `CLAUDE.md` met markeringen + `project.md` | Schone configuratie in `openspec/config.yaml` |

**De filosofische verandering:** Werk is niet lineair. OPSX doet niet alsof dat wel zo is.

---

## Voordat u begint

### Uw bestaande werk is veilig

Het migratieproces is ontworpen met behoud in gedachten:

- **Actieve wijzigingen in `openspec/changes/`** — Volledig bewaard. U kunt ze voortzetten met OPSX-opdrachten.
- **Gearchiveerde wijzigingen** — Ongewijzigd. Uw geschiedenis blijft intact.
- **Hoofdspecificaties in `openspec/specs/`** — Ongewijzigd. Dit zijn uw bron van waarheid.
- **Uw inhoud in CLAUDE.md, AGENTS.md, etc.** — Bewaard. Alleen de OpenSpec-markerblokken worden verwijderd; alles wat u heeft geschreven blijft behouden.

### Wat wordt verwijderd

Alleen door OpenSpec beheerde bestanden die worden vervangen:

| Wat | Waarom |
|-----|--------|
| Verouderde slash-opdrachtmappen/-bestanden | Vervangen door het nieuwe vaardighedensysteem |
| `openspec/AGENTS.md` | Verouderde workflow-trigger |
| OpenSpec-markeringen in `CLAUDE.md`, `AGENTS.md`, etc. | Niet langer nodig |

**Verouderde opdrachtlocaties per tool** (voorbeelden—uw tool kan afwijken):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (alleen IDE-extensies; niet ondersteund in Copilot CLI)
- En andere (Augment, Continue, Amazon Q, etc.)

De migratie detecteert welke tools u heeft geconfigureerd en ruimt hun verouderde bestanden op.

De verwijderingslijst kan lang lijken, maar dit zijn allemaal bestanden die OpenSpec oorspronkelijk heeft aangemaakt. Uw eigen inhoud wordt nooit verwijderd.

### Wat uw aandacht vereist

Eén bestand vereist handmatige migratie:

**`openspec/project.md`** — Dit bestand wordt niet automatisch verwijderd omdat het projectcontext kan bevatten die u heeft geschreven. U moet:

1. De inhoud beoordelen
2. Bruikbare context verplaatsen naar `openspec/config.yaml` (zie onderstaande richtlijn)
3. Het bestand verwijderen wanneer u klaar bent

**Waarom we deze wijziging hebben doorgevoerd:**

Het oude `project.md` was passief—agents lazen het misschien, misschien niet, en vergaten misschien wat ze lazen. We constateerden dat de betrouwbaarheid inconsistent was.

De nieuwe `config.yaml`-context wordt **actief in elke OpenSpec-planningsaanvraag geïnjecteerd**. Dit betekent dat uw projectconventies, techstack en regels altijd aanwezig zijn wanneer de AI artefacten aanmaakt. Hogere betrouwbaarheid.

**De afweging:**

Omdat context in elke aanvraag wordt geïnjecteerd, wilt u beknopt zijn. Focus op wat echt belangrijk is:
- Techstack en belangrijke conventies
- Niet-voor-de-hand-liggende beperkingen die de AI moet weten
- Regels die eerder vaak werden genegeerd

Maak u geen zorgen over perfectie. We leren nog steeds wat hier het beste werkt, en we zullen de contextinjectie blijven verbeteren naarmate we experimenteren.

---

## De migratie uitvoeren

Zowel `openspec init` als `openspec update` detecteren verouderde bestanden en begeleiden u door hetzelfde opruimingsproces. Gebruik degene die bij uw situatie past:

- Nieuwe installaties standaard naar profiel `core` (`propose`, `explore`, `apply`, `sync`, `archive`).
- Gemigreerde installaties behouden uw eerder geïnstalleerde workflows door indien nodig een `custom`-profiel te schrijven.

### `openspec init` gebruiken

Voer dit uit als u nieuwe tools wilt toevoegen of wilt herconfigureren welke tools zijn ingesteld:

```bash
openspec init
```

Het init-commando detecteert verouderde bestanden en begeleidt u bij het opruimen:

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

**Wat er gebeurt als u ja zegt:**

1. Verouderde slash-opdrachtmappen worden verwijderd
2. OpenSpec-markeringen worden verwijderd uit `CLAUDE.md`, `AGENTS.md`, etc. (uw inhoud blijft behouden)
3. `openspec/AGENTS.md` wordt verwijderd
4. Nieuwe vaardigheden worden geïnstalleerd in `.claude/skills/`
5. `openspec/config.yaml` wordt aangemaakt met een standaardschema

### `openspec update` gebruiken

Voer dit uit als u alleen wilt migreren en uw bestaande tools wilt vernieuwen naar de nieuwste versie:

```bash
openspec update
```

Het update-commando detecteert en ruimt ook verouderde artefacten op, en vernieuwt vervolgens gegenereerde vaardigheden/opdrachten om overeen te komen met uw huidige profiel- en leveringsinstellingen.

### Niet-interactieve / CI-omgevingen

Voor gescripte migraties:

```bash
openspec init --force --tools claude
```

De `--force`-vlag slaat prompts over en accepteert opruiming automatisch.

---

## project.md migreren naar config.yaml

Het oude `openspec/project.md` was een vrij opgemaakt markdown-bestand voor projectcontext. Het nieuwe `openspec/config.yaml` is gestructureerd en—cruciaal—**wordt in elke planningsaanvraag geïnjecteerd** zodat uw conventies altijd aanwezig zijn wanneer de AI werkt.

### Voorheen (project.md)

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

### Nadien (config.yaml)

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

### Belangrijkste verschillen

| project.md | config.yaml |
|------------|-------------|
| Vrij opgemaakte markdown | Gestruktureerde YAML |
| Eén blok tekst | Gescheiden context en per-artefactregels |
| Onduidelijk wanneer het wordt gebruikt | Context verschijnt in ALLE artefacten; regels verschijnen alleen in overeenkomende artefacten |
| Geen schemaselectie | Expliciet `schema:`-veld stelt standaardworkflow in |

### Wat behouden, wat weglaten

Wees selectief bij het migreren. Vraag uzelf af: "Heeft de AI dit nodig voor *elke* planningsaanvraag?"

**Goede kandidaten voor `context:`**
- Techstack (talen, frameworks, databases)
- Belangrijke architectuurpatronen (monorepo, microservices, etc.)
- Niet-voor-de-hand-liggende beperkingen ("we kunnen bibliotheek X niet gebruiken omdat...")
- Kritieke conventies die vaak worden genegeerd

**Verplaats in plaats daarvan naar `rules:`**
- Artefactspecifieke opmaak ("gebruik Given/When/Then in specificaties")
- Beoordelingscriteria ("voorstellen moeten terugdraaiplannen bevatten")
- Deze verschijnen alleen voor het overeenkomende artefact, waardoor andere aanvragen lichter blijven

**Laat volledig weg**
- Algemene best practices die de AI al kent
- Uitgebreide uitleg die samengevat kan worden
- Historische context die geen invloed heeft op het huidige werk

### Migratiestappen

1. **Maak config.yaml aan** (indien nog niet aangemaakt door init):
   ```yaml
   schema: spec-driven
   ```

2. **Voeg uw context toe** (wees beknopt—dit gaat in elke aanvraag):
   ```yaml
   context: |
     Uw projectachtergrond komt hier.
     Focus op wat de AI daadwerkelijk moet weten.
   ```

3. **Voeg per-artefactregels toe** (optioneel):
   ```yaml
   rules:
     proposal:
       - Uw voorstelspecifieke richtlijnen
     specs:
       - Uw regels voor het schrijven van specificaties
   ```

4. **Verwijder project.md** zodra u alles bruikbare heeft verplaatst.

**Denk er niet te veel over na.** Begin met de essentie en itereer. Als u merkt dat de AI iets belangrijks mist, voeg het toe. Als de context te uitgebreid aanvoelt, snoei het bij. Dit is een levend document.

### Hulp nodig? Gebruik deze prompt

Als u niet zeker weet hoe u uw project.md moet destilleren, vraag het uw AI-assistent:

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[plak hier uw project.md-inhoud]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

De AI helpt u bij het identificeren van wat essentieel is versus wat kan worden gesnoeid.

---

## De nieuwe opdrachten

Opdrachtbeschikbaarheid is profielafhankelijk:

**Standaard (`core`-profiel):**

| Opdracht | Doel |
|----------|------|
| `/opsx:propose` | Maak een wijziging aan en genereer planningsartefacten in één stap |
| `/opsx:explore` | Denk ideeën door zonder structuur |
| `/opsx:apply` | Implementeer taken uit tasks.md |
| `/opsx:archive` | Rond af en archiveer de wijziging |

**Uitgebreide workflow (aangepaste selectie):**

| Opdracht | Doel |
|----------|------|
| `/opsx:new` | Start een nieuw wijzigingsskelet |
| `/opsx:continue` | Maak het volgende artefact aan (één tegelijk) |
| `/opsx:ff` | Fast-forward—maak planningsartefacten in één keer aan |
| `/opsx:verify` | Valideer of implementatie overeenkomt met specificaties |
| `/opsx:sync` | Voeg deltaspecificaties samen in hoofdspecificaties |
| `/opsx:bulk-archive` | Archiveer meerdere wijzigingen tegelijk |
| `/opsx:onboard` | Begeleide end-to-end onboardingworkflow |

Schakel uitgebreide opdrachten in met `openspec config profile`, en voer vervolgens `openspec update` uit.

### Opdrachtmapping vanuit verouderde versie

| Verouderd | OPSX-equivalent |
|-----------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (standaard) of `/opsx:new` dan `/opsx:ff` (uitgebreid) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Nieuwe mogelijkheden

Deze mogelijkheden maken deel uit van de uitgebreide workflowopdrachtenset.

**Gedetailleerde artefactcreatie:**
```
/opsx:continue
```
Maakt één artefact per keer aan op basis van afhankelijkheden. Gebruik dit wanneer u elke stap wilt beoordelen.

**Verkenningsmodus:**
```
/opsx:explore
``
Denk ideeën door met een partner voordat u zich vastlegt op een wijziging.

---

## De Nieuwe Architectuur Begrijpen

### Van Fase-gebonden Naar Vloeiend

De verouderde workflow dwong een lineaire voortgang af:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

Als je in de implementatiefase zit en ontdekt dat het ontwerp fout is?
Helaas. Fasepoorten laten je niet gemakkelijk teruggaan.
```

OPSX gebruikt acties, geen fases:

```
         ┌───────────────────────────────────────────────┐
         │           ACTIES (geen fases)                 │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                  willekeurige volgorde         │
         └───────────────────────────────────────────────┘
```

### Afhankelijkheidsgraaf

Artefacten vormen een gerichte graaf. Afhankelijkheden zijn mogelijkmakers, geen poorten:

```
                        proposal
                       (knooppunt)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (vereist:                   (vereist:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (vereist:
                     specs, design)
```

Wanneer je `/opsx:continue` uitvoert, controleert het systeem wat gereed is en biedt het het volgende artefact aan. Je kunt ook meerdere gereedstaande artefacten in willekeurige volgorde aanmaken.

### Vaardigheden vs Commando's

Het verouderde systeem gebruikte tool-specifieke commandobestanden:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX gebruikt de opkomende **vaardigheden**-standaard:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Vaardigheden worden herkend door meerdere AI-codeertools en bieden rijkere metadata.

---

## Bestaande Wijzigingen Voortzetten

Je lopende wijzigingen werken naadloos samen met OPSX-commando's.

**Heb je een actieve wijziging uit de verouderde workflow?**

```
/opsx:apply add-my-feature
```

OPSX leest de bestaande artefacten en gaat verder waar je was gebleven.

**Wil je meer artefacten toevoegen aan een bestaande wijziging?**

```
/opsx:continue add-my-feature
```

Toont wat gereed is om aan te maken op basis van wat al bestaat.

**Moet je de status zien?**

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
  Je projectachtergrond, technische stack,
  conventies en beperkingen.

# Optioneel: Regels per artefact
# Alleen geïnjecteerd in overeenkomende artefacten
rules:
  proposal:
    - Neem een terugvalplan op
  specs:
    - Gebruik Gegeven/Wanneer/Dan-formaat
  design:
    - Documenteer terugvalstrategieën
  tasks:
    - Opsplitsen in brokken van maximaal 2 uur
```

### Schemaresolutie

Bij het bepalen welk schema te gebruiken, controleert OPSX in volgorde:

1. **CLI-vlag**: `--schema <naam>` (hoogste prioriteit)
2. **Wijzigingsmetadata**: `.openspec.yaml` in de wijzigingsmap
3. **Projectconfiguratie**: `openspec/config.yaml`
4. **Standaard**: `spec-driven`

### Beschikbare Schemas

| Schema | Artefacten | Geschikt voor |
|--------|------------|---------------|
| `spec-driven` | proposal → specs → design → tasks | De meeste projecten |

Alle beschikbare schemas weergeven:

```bash
openspec schemas
```

### Aangepaste Schemas

Maak je eigen workflow aan:

```bash
openspec schema init my-workflow
```

Of kopieer een bestaand schema:

```bash
openspec schema fork spec-driven my-workflow
```

Zie [Aanpassingen](customization.md) voor details.

---

## Probleemoplossing

### "Verouderde bestanden gedetecteerd in niet-interactieve modus"

Je draait in een CI- of niet-interactieve omgeving. Gebruik:

```bash
openspec init --force
```

### Commando's verschijnen niet na migratie

Start je IDE opnieuw op. Vaardigheden worden bij het opstarten gedetecteerd.

### "Onbekende artefact-ID in regels"

Controleer of je `rules:`-sleutels overeenkomen met de artefact-ID's van je schema:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Voer dit uit om geldige artefact-ID's te zien:

```bash
openspec schemas --json
```

### Configuratie wordt niet toegepast

1. Zorg dat het bestand op `openspec/config.yaml` staat (niet `.yml`)
2. Valideer de YAML-syntaxis
3. Configuratieveranderingen worden onmiddellijk van kracht—geen herstart nodig

### project.md niet gemigreerd

Het systeem bewaart opzettelijk `project.md` omdat het je aangepaste inhoud kan bevatten. Bekijk het handmatig, verplaats bruikbare delen naar `config.yaml` en verwijder het dan.

### Wil je zien wat zou worden opgeruimd?

Voer init uit en weiger het opruimverzoek—je ziet de volledige detectiesamenvatting zonder dat er wijzigingen worden aangebracht.

---

## Snelle Verwijzing

### Bestanden Na Migratie

```
project/
├── openspec/
│   ├── specs/                    # Ongewijzigd
│   ├── changes/                  # Ongewijzigd
│   │   └── archive/              # Ongewijzigd
│   └── config.yaml               # NIEUW: Projectconfiguratie
├── .claude/
│   └── skills/                   # NIEUW: OPSX-vaardigheden
│       ├── openspec-propose/     # standaard kernprofiel
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # uitgebreid profiel voegt new/continue/ff/etc. toe
├── CLAUDE.md                     # OpenSpec-markeringen verwijderd, jouw inhoud bewaard
└── AGENTS.md                     # OpenSpec-markeringen verwijderd, jouw inhoud bewaard
```

### Wat is Verdwenen

- `.claude/commands/openspec/` — vervangen door `.claude/skills/`
- `openspec/AGENTS.md` — verouderd
- `openspec/project.md` — migreer naar `config.yaml`, verwijder daarna
- OpenSpec-markeringsblokken in `CLAUDE.md`, `AGENTS.md`, etc.

### Commando-Overzicht

```text
/opsx:propose      Snel starten (standaard kernprofiel)
/opsx:apply        Taken implementeren
/opsx:archive      Afronden en archiveren

# Uitgebreide workflow (indien ingeschakeld):
/opsx:new          Een wijziging opzetten
/opsx:continue     Volgende artefact aanmaken
/opsx:ff           Planningartefacten aanmaken
```

---

## Hulp Krijgen

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Documentatie**: [docs/opsx.md](opsx.md) voor de volledige OPSX-referentie