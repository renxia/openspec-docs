# Migratie naar OPSX

Deze gids helpt u bij de overgang van de verouderde OpenSpec-werkwijze naar OPSX. De migratie is zo ontworpen dat deze soepel verloopt—uw bestaande werk wordt behouden, en het nieuwe systeem biedt meer flexibiliteit.

## Wat verandert er?

OPSX vervangt de oude, gefaseerde werkwijze door een vloeibare, op acties gebenaderde aanpak. Hier is de belangrijkste verschuiving:

| Aspect | Verouderd | OPSX |
|--------|-----------|------|
| **Commando's** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Standaard: `/opsx:propose`, `/opsx:apply`, `/opsx:archive` (uitgebreide werkkommando's optioneel) |
| **Werkwijze** | Alle artefacten tegelijk aanmaken | Incrementeel of allemaal tegelijk aanmaken—uw keuze |
| **Teruggaan** | Ongemakkelijke fasemuren | Natuurlijk—werk elk artefact op elk moment bij |
| **Aanpassing** | Vaste structuur | Schema-gestuurd, volledig aanpasbaar |
| **Configuratie** | `CLAUDE.md` met markeringen + `project.md` | Schone configuratie in `openspec/config.yaml` |

**De filosofische verandering:** Werk is niet lineair. OPSX houdt op te doen alsof het dat wel is.

---

## Voordat u begint

### Uw bestaande werk is veilig

Het migratieproces is ontworpen met behoud in gedachten:

- **Actieve wijzigingen in `openspec/changes/`** — Volledig bewaard. U kunt deze voortzetten met OPSX-opdrachten.
- **Gearchiveerde wijzigingen** — Onaangeroerd. Uw geschiedenis blijft intact.
- **Hoofdspecificaties in `openspec/specs/`** — Onaangeroerd. Dit zijn uw bron van waarheid.
- **Uw inhoud in CLAUDE.md, AGENTS.md, enz.** — Bewaard. Alleen de OpenSpec-markeringsblokken worden verwijderd; alles wat u heeft geschreven, blijft.

### Wat wordt verwijderd

Alleen OpenSpec-beheerde bestanden die worden vervangen:

| Wat | Waarom |
|------|--------|
| Verouderde slash-commando-mappen/bestanden | Vervangen door het nieuwe vaardighedensysteem |
| `openspec/AGENTS.md` | Verouderde workflowtrigger |
| OpenSpec-markeringen in `CLAUDE.md`, `AGENTS.md`, enz. | Niet meer nodig |

**Verouderde commandolocaties per tool** (voorbeelden—uw tool kan variëren):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (alleen IDE-extensies; niet ondersteund in Copilot CLI)
- En andere (Augment, Continue, Amazon Q, enz.)

De migratie detecteert welke tools u heeft geconfigureerd en ruimt hun verouderde bestanden op.

De verwijderingslijst kan lang lijken, maar dit zijn allemaal bestanden die OpenSpec oorspronkelijk heeft aangemaakt. Uw eigen inhoud wordt nooit verwijderd.

### Wat uw aandacht vereist

Een bestand vereist handmatige migratie:

**`openspec/project.md`** — Dit bestand wordt niet automatisch verwijderd, omdat het projectcontext kan bevatten die u heeft geschreven. U moet:

1. De inhoud ervan bekijken
2. Nuttige context verplaatsen naar `openspec/config.yaml` (zie onderstaande richtlijnen)
3. Het bestand verwijderen wanneer u klaar bent

**Waarom we deze wijziging hebben gemaakt:**

Het oude `project.md` was passief—agents konden het lezen, misschien niet, misschien vergeten wat ze lazen. We vonden dat de betrouwbaarheid inconsistent was.

De nieuwe `config.yaml`-context wordt **actief geïnjecteerd in elk OpenSpec-planningsverzoek**. Dit betekent dat uw projectconventies, technische stack en regels altijd aanwezig zijn wanneer de AI artefacten aanmaakt. Hogere betrouwbaarheid.

**De afweging:**

Omdat context in elk verzoek wordt geïnjecteerd, wilt u beknopt zijn. Focus op wat echt belangrijk is:
- Technische stack en belangrijke conventies
- Niet-overduidelijke beperkingen die de AI moet weten
- Regels die voorheen vaak werden genegeerd

Maak u geen zorgen over perfectie. We leren nog steeds wat hier het beste werkt, en we zullen verbeteren hoe contextinjectie werkt terwijl we experimenteren.

---

## Het migratieproces uitvoeren

Zowel `openspec init` als `openspec update` detecteren verouderde bestanden en begeleiden u door hetzelfde opschoningsproces. Gebruik degene die bij uw situatie past:

- Nieuwe installaties gebruiken standaard profiel `core` (`propose`, `explore`, `apply`, `archive`).
- Gemigreerde installaties behouden uw eerder geïnstalleerde workflows door indien nodig een `custom` profiel te schrijven.

### Gebruik van `openspec init`

Voer dit uit als u nieuwe tools wilt toevoegen of de configuratie van ingestelde tools wilt wijzigen:

```bash
openspec init
```

Het init-commando detecteert verouderde bestanden en begeleidt u door de opschoning:

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

1. Verouderde slash-commandomappen worden verwijderd
2. OpenSpec-markeringen worden verwijderd uit `CLAUDE.md`, `AGENTS.md`, enz. (uw inhoud blijft)
3. `openspec/AGENTS.md` wordt verwijderd
4. Nieuwe vaardigheden worden geïnstalleerd in `.claude/skills/`
5. `openspec/config.yaml` wordt aangemaakt met een standaardschema

### Gebruik van `openspec update`

Voer dit uit als u alleen wilt migreren en uw bestaande tools wilt bijwerken naar de nieuwste versie:

```bash
openspec update
```

Het update-commando detecteert en ruimt ook verouderde artefacten op en vernieuwt vervolgens de gegenereerde vaardigheden/commando's om overeen te komen met uw huidige profiel en afleveringsinstellingen.

### Niet-interactieve / CI-omgevingen

Voor scriptgebaseerde migraties:

```bash
openspec init --force --tools claude
```

De `--force`-vlag slaat prompts over en accepteert opschoning automatisch.

---

## project.md migreren naar config.yaml

Het oude `openspec/project.md` was een vrij markdown-bestand voor projectcontext. Het nieuwe `openspec/config.yaml` is gestructureerd en—belangrijk—**geïnjecteerd in elk planningsverzoek**, zodat uw conventies altijd aanwezig zijn wanneer de AI werkt.

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

### Belangrijkste verschillen

| project.md | config.yaml |
|------------|-------------|
| Vrije markdown | Gestрукtureerde YAML |
| één blok tekst | Gescheiden context en per-artefactregels |
| Onbekend wanneer het wordt gebruikt | Context verschijnt in ALLE artefacten; regels verschijnen alleen in bijpassende artefacten |
| Geenselectie van schema | Expliciet `schema:`-veld stelt standaardworkflow in |

### Wat te behouden, wat te laten vallen

Wees selectief bij het migreren. Vraag uzelf af: "Heeft de AI dit nodig voor *elk* planningsverzoek?"

**Goede kandidaten voor `context:`**
- Technische stack (talen, frameworks, databases)
- Belangrijke architectuurpatronen (monorepo, microservices, enz.)
- Niet-overduidelijke beperkingen ("we kunnen library X niet gebruiken omdat...")
- Kritieke conventies die vaak worden genegeerd

**Verplaats naar `rules:` in plaats daarvan**
- Artefact-specifieke opmaak ("gebruik Given/When/Then in specificaties")
- Beoordelingscriteria ("voorstellen moeten een terugdraaiplan bevatten")
- Deze verschijnen alleen voor het bijpassende artefact, waardoor andere verzoeken lichter blijven

**Laat volledig weg**
- Algemene best practices die de AI al kent
- Uitgebreide uitleg die kan worden samengevat
- Historische context die geen invloed heeft op huidig werk

### Migratiestappen

1. **Maak config.yaml aan** (indien niet al aangemaakt door init):
   ```yaml
   schema: spec-driven
   ```

2. **Voeg uw context toe** (wees beknopt—dit gaat in elk verzoek):
   ```yaml
   context: |
     Uw projectachtergrond hier.
     Focus op wat de AI echt moet weten.
   ```

3. **Voeg per-artefactregels toe** (optioneel):
   ```yaml
   rules:
     proposal:
       - Uw voorstel-specifieke richtlijnen
     specs:
       - Uw specificatieregels
   ```

4. **Verwijder project.md** zodra u alles nuttigs heeft verplaatst.

**Denk er niet te lang over na.** Begin met de essentiële zaken en iteratie. Als u merkt dat de AI iets belangrijks mist, voeg het toe. Als de context opgezwollen aanvoelt, trim het. Dit is een levend document.

### Hulp nodig? Gebruik dit prompt

Als u niet zeker weet hoe u uw project.md kunt distilleren, vraag uw AI-assistent:

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

De AI zal u helpen identificeren wat essentieel is versus wat kan worden ingekort.

---

## De nieuwe commando's

Commandobeschikbaarheid is profielafhankelijk:

**Standaard (`core` profiel):**

| Commando | Doel |
|---------|------|
| `/opsx:propose` | Maak een wijziging aan en genereer planningsartefacten in één stap |
| `/opsx:explore` | Denk na over ideeën zonder structuur |
| `/opsx:apply` | Implementeer taken uit tasks.md |
| `/opsx:archive` | Finaliseer en archiveer de wijziging |

**Uitgebreide workflow (aangepaste selectie):**

| Commando | Doel |
|---------|------|
| `/opsx:new` | Start een nieuwe wijzigingsscaffold |
| `/opsx:continue` | Maak het volgende artefact aan (één per keer) |
| `/opsx:ff` | Snel vooruit—maak planningsartefacten tegelijk aan |
| `/opsx:verify` | Valideer of implementatie overeenkomt met specificaties |
| `/opsx:sync` | Voorbeeld/spec-merge zonder archivering |
| `/opsx:bulk-archive` | Archiveer meerdere wijzigingen tegelijk |
| `/opsx:onboard` | Begeleide end-to-end onboardingworkflow |

Schakel uitgebreide commando's in met `openspec config profile` en voer dan `openspec update` uit.

### Commandomapping vanuit verouderde versie

| Verouderd | OPSX-equivalent |
|-----------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (standaard) of `/opsx:new` dan `/opsx:ff` (uitgebreid) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Nieuwe mogelijkheden

Deze mogelijkheden maken deel uit van de uitgebreide workflowcommandoset.

**Gefragmenteerde artefactaanmaak:**
```
/opsx:continue
```
Maak één artefact per keer aan op basis van afhankelijkheden. Gebruik dit wanneer u elke stap wilt beoordelen.

**Verkenningsmodus:**
```
/opsx:explore
```
Denk na over ideeën met een partner voordat u zich vastlegt op een wijziging.

---

## Het Nieuwe Architectuur Begrijpen

### Van Fase-Gebonden naar Vloeibaar

Het verouderde workflow dwong een lineaire voortgang af:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

Als je in de implementatiefase zit en ontdekt dat het ontwerp verkeerd is?
Helaas. Fase-poorten laten je niet gemakkelijk teruggaan.
```

OPSX gebruikt acties, geen fases:

```
         ┌───────────────────────────────────────────────┐
         │           ACTIES (geen fases)                 │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    willekeurige volgorde      │
         └───────────────────────────────────────────────┘
```

### Afhankelijkheidsgraaf

Artefacten vormen een gerichte graaf. Afhankelijkheden zijn mogelijkmakers, geen poorten:

```
                        proposal
                       (hoofdknooppunt)
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

Wanneer je `/opsx:continue` uitvoert, controleert het wat gereed is en biedt het het volgende artefact aan. Je kunt ook meerdere gereede artefacten in willekeurige volgorde aanmaken.

### Vaardigheden vs. Commando's

Het verouderde systeem gebruikte specifieke commandobestanden per tool:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX gebruikt de opkomende **skills**-standaard:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Vaardigheden worden herkend door meerdere AI-codingtools en bieden rijkere metadata.

---

## Doorgaan met Bestaande Wijzigingen

Je lopende wijzigingen werken naadloos samen met OPSX-commando's.

**Heb je een actieve wijziging uit het verouderde workflow?**

```
/opsx:apply add-my-feature
```

OPSX leest de bestaande artefacten en gaat verder waar je was gebleven.

**Wil je meer artefacten toevoegen aan een bestaande wijziging?**

```
/opsx:continue add-my-feature
```

Toont wat er gereed is om aan te maken op basis van wat er al is.

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
    - Inclusief terugdraaiplan
  specs:
    - Gebruik Given/When/Then-formaat
  design:
    - Documenteer terugvalstrategieën
  tasks:
    - Splits in maximaal 2-uur chunks
```

### Schema-oplossing

Bij het bepalen welk schema te gebruiken, controleert OPSX in deze volgorde:

1. **CLI-vlag**: `--schema <naam>` (hoogste prioriteit)
2. **Wijzigingsmetadata**: `.openspec.yaml` in de wijzigingsmap
3. **Projectconfiguratie**: `openspec/config.yaml`
4. **Standaard**: `spec-driven`

### Beschikbare Schema's

| Schema | Artefacten | Het Beste Voor |
|--------|------------|----------------|
| `spec-driven` | proposal → specs → design → tasks | De meeste projecten |

Lijst alle beschikbare schema's op:

```bash
openspec schemas
```

### Aangepaste Schema's

Maak je eigen workflow:

```bash
openspec schema init my-workflow
```

Of fork een bestaande:

```bash
openspec schema fork spec-driven my-workflow
```

Zie [Aanpassing](customization.md) voor details.

---

## Probleemoplossing

### "Legacy-bestanden gedetecteerd in niet-interactieve modus"

Je draait in een CI- of niet-interactieve omgeving. Gebruik:

```bash
openspec init --force
```

### Commando's verschijnen niet na migratie

Herstart je IDE. Vaardigheden worden bij het opstarten gedetecteerd.

### "Onbekende artefact-ID in regels"

Controleer of je `rules:`-sleutels overeenkomen met de artefact-ID's van je schema:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Voer dit uit om geldige artefact-ID's te zien:

```bash
openspec schemas --json
```

### Configuratie wordt niet toegepast

1. Zorg ervoor dat het bestand op `openspec/config.yaml` staat (niet `.yml`)
2. Valideer de YAML-syntax
3. Configuratieaanpassingen worden onmiddellijk van kracht—geen herstart nodig

### project.md niet gemigreerd

Het systeem bewaart `project.md` opzettelijk omdat het je aangepaste inhoud kan bevatten. Bekijk het handmatig, verplaats bruikbare delen naar `config.yaml` en verwijder het dan.

### Wil je zien wat er zou worden opgeruimd?

Voer init uit en weiger de opschoningsprompt—je ziet het volledige detectie-overzicht zonder dat er wijzigingen worden aangebracht.

---

## Snelle Referentie

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
│       └── ...                   # uitgebreid profiel voegt new/continue/ff/etc. toe
├── CLAUDE.md                     # OpenSpec-markeringen verwijderd, je inhoud bewaard
└── AGENTS.md                     # OpenSpec-markeringen verwijderd, je inhoud bewaard
```

### Wat is Verdwenen

- `.claude/commands/openspec/` — vervangen door `.claude/skills/`
- `openspec/AGENTS.md` — verouderd
- `openspec/project.md` — migreer naar `config.yaml` en verwijder het dan
- OpenSpec-markeringblokken in `CLAUDE.md`, `AGENTS.md`, etc.

### Commando-Spiekbriefje

```text
/opsx:propose      Snel starten (standaard kernprofiel)
/opsx:apply        Taken implementeren
/opsx:archive      Afronden en archiveren

# Uitgebreide workflow (indien ingeschakeld):
/opsx:new          Een wijziging opzetten
/opsx:continue     Volgend artefact aanmaken
/opsx:ff           Planning-artefacten aanmaken
```

---

## Hulp Krijgen

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Documentatie**: [docs/opsx.md](opsx.md) voor de volledige OPSX-referentie