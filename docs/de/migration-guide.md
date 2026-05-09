# Migration zu OPSX

Diese Anleitung hilft Ihnen beim Übergang vom veralteten OpenSpec-Workflow zu OPSX. Die Migration ist so gestaltet, dass sie reibungslos verläuft – Ihre bisherige Arbeit bleibt erhalten, und das neue System bietet mehr Flexibilität.

## Was ändert sich?

OPSX ersetzt den alten phasenstarren Workflow durch einen flüssigen, aktionsbasierten Ansatz. Hier die wesentliche Veränderung:

| Aspekt | Legacy | OPSX |
|--------|--------|------|
| **Befehle** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Standard: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (erweiterte Workflow-Befehle optional) |
| **Workflow** | Alle Artefakte auf einmal erstellen | Inkrementell oder auf einmal erstellen – Ihre Wahl |
| **Zurückgehen** | Umständliche Phasenübergänge | Natürlich – jederzeit jedes Artefakt aktualisieren |
| **Anpassung** | Feste Struktur | Schema-gesteuert, vollständig anpassbar |
| **Konfiguration** | `CLAUDE.md` mit Markierungen + `project.md` | Saubere Konfiguration in `openspec/config.yaml` |

**Der Philosophiewechsel:** Arbeit verläuft nicht linear. OPSX hört auf, so zu tun, als wäre es so.

---

## Bevor Sie beginnen

### Ihre bestehende Arbeit ist sicher

Der Migrationsprozess wurde mit dem Gedanken an die Bewahrung entwickelt:

- **Aktive Änderungen in `openspec/changes/`** — Vollständig erhalten. Sie können diese mit OPSX-Befehlen fortsetzen.
- **Archivierte Änderungen** — Unberührt. Ihre Historie bleibt intakt.
- **Hauptspezifikationen in `openspec/specs/`** — Unberührt. Dies sind Ihre Quellen der Wahrheit.
- **Ihre Inhalte in CLAUDE.md, AGENTS.md usw.** — Bewahrt. Nur die OpenSpec-Marker-Blöcke werden entfernt; alles, was Sie geschrieben haben, bleibt erhalten.

### Was entfernt wird

Nur von OpenSpec verwaltete Dateien, die ersetzt werden:

| Was | Warum |
|------|-------|
| Legacy-Slash-Befehlsverzeichnisse/-dateien | Ersetzt durch das neue Skills-System |
| `openspec/AGENTS.md` | Veralteter Workflow-Trigger |
| OpenSpec-Marker in `CLAUDE.md`, `AGENTS.md` usw. | Nicht mehr benötigt |

**Legacy-Befehlsspeicherorte nach Tool** (Beispiele — Ihr Tool kann abweichen):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (Nur IDE-Erweiterungen; nicht unterstützt in Copilot CLI)
- Und andere (Augment, Continue, Amazon Q usw.)

Die Migration erkennt, welche Tools Sie konfiguriert haben, und bereinigt deren Legacy-Dateien.

Die Entfernungsliste mag lang erscheinen, aber dies sind alles Dateien, die OpenSpec ursprünglich erstellt hat. Ihre eigenen Inhalte werden nie gelöscht.

### Was Ihre Aufmerksamkeit erfordert

Eine Datei erfordert eine manuelle Migration:

**`openspec/project.md`** — Diese Datei wird nicht automatisch gelöscht, da sie Projektkontext enthalten kann, den Sie geschrieben haben. Sie müssen:

1. Den Inhalt überprüfen
2. Nützlichen Kontext in `openspec/config.yaml` verschieben (siehe nachfolgende Anleitung)
3. Die Datei löschen, wenn Sie bereit sind

**Warum wir diese Änderung vorgenommen haben:**

Die alte `project.md` war passiv — Agenten könnten sie lesen, könnten es auch nicht, könnten vergessen, was sie gelesen haben. Wir stellten fest, dass die Zuverlässigkeit inkonsistent war.

Der neue `config.yaml`-Kontext wird **aktiv in jede OpenSpec-Planungsanfrage injiziert**. Das bedeutet, dass Ihre Projektkonventionen, Ihr Tech-Stack und Ihre Regeln immer präsent sind, wenn die KI Artefakte erstellt. Höhere Zuverlässigkeit.

**Der Kompromiss:**

Da der Kontext in jede Anfrage injiziert wird, sollten Sie präzise sein. Konzentrieren Sie sich auf das, was wirklich wichtig ist:
- Tech-Stack und zentrale Konventionen
- Nicht offensichtliche Einschränkungen, die die KI kennen muss
- Regeln, die zuvor häufig ignoriert wurden

Machen Sie sich keine Sorgen, es perfekt zu machen. Wir lernen noch, was hier am besten funktioniert, und werden die Kontextinjektion verbessern, während wir experimentieren.

---

## Ausführung der Migration

Sowohl `openspec init` als auch `openspec update` erkennen Legacy-Dateien und führen Sie durch denselben Bereinigungsprozess. Verwenden Sie das, was zu Ihrer Situation passt:

- Neue Installationen verwenden standardmäßig das Profil `core` (`propose`, `explore`, `apply`, `sync`, `archive`).
- Migrierte Installationen bewahren Ihre zuvor installierten Workflows, indem sie bei Bedarf ein `custom`-Profil schreiben.

### Verwendung von `openspec init`

Führen Sie dies aus, wenn Sie neue Tools hinzufügen oder konfigurieren möchten, welche Tools eingerichtet werden:

```bash
openspec init
```

Der init-Befehl erkennt Legacy-Dateien und führt Sie durch die Bereinigung:

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

**Was passiert, wenn Sie mit Ja antworten:**

1. Legacy-Slash-Befehlsverzeichnisse werden entfernt
2. OpenSpec-Marker werden aus `CLAUDE.md`, `AGENTS.md` usw. entfernt (Ihre Inhalte bleiben erhalten)
3. `openspec/AGENTS.md` wird gelöscht
4. Neue Skills werden in `.claude/skills/` installiert
5. `openspec/config.yaml` wird mit einem Standardschema erstellt

### Verwendung von `openspec update`

Führen Sie dies aus, wenn Sie nur migrieren und Ihre vorhandenen Tools auf die neueste Version aktualisieren möchten:

```bash
openspec update
```

Der update-Befehl erkennt und bereinigt ebenfalls Legacy-Artefakte und aktualisiert dann generierte Skills/Befehle, um Ihrem aktuellen Profil und Ihren Delivery-Einstellungen zu entsprechen.

### Nicht-interaktive / CI-Umgebungen

Für skriptgesteuerte Migrationen:

```bash
openspec init --force --tools claude
```

Der `--force`-Parameter überspringt Eingabeaufforderungen und akzeptiert die Bereinigung automatisch.

---

## Migration von project.md zu config.yaml

Die alte `openspec/project.md` war eine freiformartige Markdown-Datei für Projektkontext. Die neue `openspec/config.yaml` ist strukturiert und — entscheidend — wird **in jede Planungsanfrage injiziert**, sodass Ihre Konventionen immer präsent sind, wenn die KI arbeitet.

### Vorher (project.md)

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

### Nachher (config.yaml)

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

### Wesentliche Unterschiede

| project.md | config.yaml |
|------------|-------------|
| Freiformartiges Markdown | Strukturiertes YAML |
| Ein Textblock | Separater Kontext und artefaktspezifische Regeln |
| Unklar, wann es verwendet wird | Kontext erscheint in ALLEN Artefakten; Regeln erscheinen nur in passenden Artefakten |
| Keine Schemaauswahl | Explizites `schema:`-Feld legt den Standardworkflow fest |

### Was behalten, was weglassen

Seien Sie bei der Migration selektiv. Fragen Sie sich: „Braucht die KI dies für *jede* Planungsanfrage?"

**Gute Kandidaten für `context:`**
- Tech-Stack (Sprachen, Frameworks, Datenbanken)
- Zentrale Architekturmuster (Monorepo, Microservices usw.)
- Nicht offensichtliche Einschränkungen („Wir können Bibliothek X nicht verwenden, weil...")
- Kritische Konventionen, die häufig ignoriert werden

**Stattdessen in `rules:` verschieben**
- Artefaktspezifische Formatierung („Verwende Given/When/Then in Spezifikationen")
- Prüfkriterien („Vorschläge müssen Rollback-Pläne enthalten")
- Diese erscheinen nur für das passende Artefakt und halten andere Anfragen schlanker

**Ganz weglassen**
- Allgemeine Best Practices, die die KI bereits kennt
- Ausführliche Erklärungen, die zusammengefasst werden könnten
- Historischer Kontext, der die aktuelle Arbeit nicht beeinflusst

### Migrationsschritte

1. **config.yaml erstellen** (falls nicht bereits durch init erstellt):
   ```yaml
   schema: spec-driven
   ```

2. **Ihren Kontext hinzufügen** (seien Sie präzise — dies geht in jede Anfrage):
   ```yaml
   context: |
     Ihr Projekthintergrund gehört hierher.
     Konzentrieren Sie sich darauf, was die KI wirklich wissen muss.
   ```

3. **Artefaktspezifische Regeln hinzufügen** (optional):
   ```yaml
   rules:
     proposal:
       - Ihre vorschlagsspezifische Anleitung
     specs:
       - Ihre Regeln für Spezifikationen
   ```

4. **project.md löschen**, sobald Sie alles Nützliche verschoben haben.

**Überdenken Sie es nicht.** Beginnen Sie mit den Grundlagen und iterieren Sie. Wenn Sie bemerken, dass der KI etwas Wichtiges fehlt, fügen Sie es hinzu. Wenn der Kontext aufgebläht wirkt, kürzen Sie ihn. Dies ist ein lebendiges Dokument.

### Brauchen Sie Hilfe? Verwenden Sie diese Eingabeaufforderung

Wenn Sie unsicher sind, wie Sie Ihre project.md destillieren sollen, fragen Sie Ihren KI-Assistenten:

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

Die KI hilft Ihnen dabei, zu erkennen, was wesentlich ist und was gekürzt werden kann.

---

## Die neuen Befehle

Die Verfügbarkeit von Befehlen ist profilabhängig:

**Standard (`core`-Profil):**

| Befehl | Zweck |
|--------|-------|
| `/opsx:propose` | Eine Änderung erstellen und Planungsartefakte in einem Schritt generieren |
| `/opsx:explore` | Ideen ohne Struktur durchdenken |
| `/opsx:apply` | Aufgaben aus tasks.md implementieren |
| `/opsx:archive` | Die Änderung abschließen und archivieren |

**Erweiterter Workflow (benutzerdefinierte Auswahl):**

| Befehl | Zweck |
|--------|-------|
| `/opsx:new` | Ein neues Änderungsgerüst starten |
| `/opsx:continue` | Das nächste Artefakt erstellen (eines nach dem anderen) |
| `/opsx:ff` | Fast-Forward — Planungsartefakte auf einmal erstellen |
| `/opsx:verify` | Validieren, dass die Implementierung den Spezifikationen entspricht |
| `/opsx:sync` | Delta-Spezifikationen in Hauptspezifikationen zusammenführen |
| `/opsx:bulk-archive` | Mehrere Änderungen auf einmal archivieren |
| `/opsx:onboard` | Geführter End-to-End-Onboarding-Workflow |

Aktivieren Sie erweiterte Befehle mit `openspec config profile` und führen Sie dann `openspec update` aus.

### Befehlszuordnung von Legacy

| Legacy | OPSX-Entsprechung |
|--------|-------------------|
| `/openspec:proposal` | `/opsx:propose` (Standard) oder `/opsx:new` dann `/opsx:ff` (erweitert) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Neue Fähigkeiten

Diese Fähigkeiten sind Teil des erweiterten Workflow-Befehlssatzes.

**Granulare Artefakterstellung:**
```
/opsx:continue
```
Erstellt ein Artefakt nach dem anderen basierend auf Abhängigkeiten. Verwenden Sie dies, wenn Sie jeden Schritt überprüfen möchten.

**Erkundungsmodus:**
```
/opsx:explore
```
Denken Sie Ideen mit einem Partner durch, bevor Sie sich auf eine Änderung festlegen.

---

## Die neue Architektur verstehen

### Von phasenfixiert zu flüssig

Der Legacy-Workflow erzwang eine lineare Abfolge:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

Wenn Sie in der Implementierungsphase feststellen, dass das Design falsch ist?
Pech. Phasentore lassen Sie nicht einfach zurückgehen.
```

OPSX verwendet Aktionen, keine Phasen:

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

### Abhängigkeitsgraph

Artefakte bilden einen gerichteten Graphen. Abhängigkeiten sind Ermöglicher, keine Tore:

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

Wenn Sie `/opsx:continue` ausführen, prüft es, was bereit ist, und bietet das nächste Artefakt an. Sie können auch mehrere bereite Artefakte in beliebiger Reihenfolge erstellen.

### Skills vs. Befehle

Das Legacy-System verwendete werkzeugspezifische Befehlsdateien:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX verwendet den entstehenden **Skills**-Standard:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Skills werden von mehreren KI-Coding-Werkzeugen erkannt und bieten reichhaltigere Metadaten.

---

## Fortsetzen bestehender Änderungen

Ihre laufenden Änderungen funktionieren nahtlos mit OPSX-Befehlen.

**Haben Sie eine aktive Änderung aus dem Legacy-Workflow?**

```
/opsx:apply add-my-feature
```

OPSX liest die vorhandenen Artefakte und setzt genau dort fort, wo Sie aufgehört haben.

**Möchten Sie weitere Artefakte zu einer bestehenden Änderung hinzufügen?**

```
/opsx:continue add-my-feature
```

Zeigt an, was basierend auf dem bereits vorhandenen Bestand als nächstes erstellt werden kann.

**Müssen Sie den Status überprüfen?**

```bash
openspec status --change add-my-feature
```

---

## Das neue Konfigurationssystem

### config.yaml-Struktur

```yaml
# Required: Default schema for new changes
schema: spec-driven

# Optional: Project context (max 50KB)
# Injected into ALL artifact instructions
context: |
  Your project background, tech stack,
  conventions, and constraints.

# Optional: Per-artifact rules
# Only injected into matching artifacts
rules:
  proposal:
    - Include rollback plan
  specs:
    - Use Given/When/Then format
  design:
    - Document fallback strategies
  tasks:
    - Break into 2-hour maximum chunks
```

### Schema-Auflösung

Bei der Bestimmung des zu verwendenden Schemas prüft OPSX in dieser Reihenfolge:

1. **CLI-Flag**: `--schema <name>` (höchste Priorität)
2. **Änderungsmetadaten**: `.openspec.yaml` im Änderungsverzeichnis
3. **Projektkonfiguration**: `openspec/config.yaml`
4. **Standard**: `spec-driven`

### Verfügbare Schemas

| Schema | Artefakte | Am besten geeignet für |
|--------|-----------|------------------------|
| `spec-driven` | proposal → specs → design → tasks | Die meisten Projekte |

Alle verfügbaren Schemas auflisten:

```bash
openspec schemas
```

### Benutzerdefinierte Schemas

Erstellen Sie Ihren eigenen Workflow:

```bash
openspec schema init my-workflow
```

Oder verzweigen Sie einen bestehenden:

```bash
openspec schema fork spec-driven my-workflow
```

Details finden Sie unter [Anpassung](customization.md).

---

## Fehlerbehebung

### "Legacy files detected in non-interactive mode"

Sie führen in einer CI- oder nicht-interaktiven Umgebung aus. Verwenden Sie:

```bash
openspec init --force
```

### Befehle erscheinen nach der Migration nicht

Starten Sie Ihre IDE neu. Skills werden beim Start erkannt.

### "Unknown artifact ID in rules"

Prüfen Sie, ob Ihre `rules:`-Schlüssel mit den Artefakt-IDs Ihres Schemas übereinstimmen:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Führen Sie dies aus, um gültige Artefakt-IDs anzuzeigen:

```bash
openspec schemas --json
```

### Konfiguration wird nicht angewendet

1. Stellen Sie sicher, dass die Datei unter `openspec/config.yaml` liegt (nicht `.yml`)
2. Validieren Sie die YAML-Syntax
3. Konfigurationsänderungen werden sofort wirksam – kein Neustart erforderlich

### project.md wurde nicht migriert

Das System bewahrt `project.md` absichtlich, da es Ihre benutzerdefinierten Inhalte enthalten kann. Überprüfen Sie es manuell, verschieben Sie nützliche Teile in `config.yaml` und löschen Sie es dann.

### Möchten Sie sehen, was bereinigt würde?

Führen Sie init aus und lehnen Sie die Bereinigungsaufforderung ab – Sie sehen die vollständige Erkennungszusammenfassung, ohne dass Änderungen vorgenommen werden.

---

## Kurzreferenz

### Dateien nach der Migration

```
project/
├── openspec/
│   ├── specs/                    # Unchanged
│   ├── changes/                  # Unchanged
│   │   └── archive/              # Unchanged
│   └── config.yaml               # NEW: Project configuration
├── .claude/
│   └── skills/                   # NEW: OPSX skills
│       ├── openspec-propose/     # default core profile
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # expanded profile adds new/continue/ff/etc.
├── CLAUDE.md                     # OpenSpec markers removed, your content preserved
└── AGENTS.md                     # OpenSpec markers removed, your content preserved
```

### Was ist weg?

- `.claude/commands/openspec/` — ersetzt durch `.claude/skills/`
- `openspec/AGENTS.md` — veraltet
- `openspec/project.md` — zu `config.yaml` migrieren, dann löschen
- OpenSpec-Markerblöcke in `CLAUDE.md`, `AGENTS.md` usw.

### Befehlsübersicht

```text
/opsx:propose      Start quickly (default core profile)
/opsx:apply        Implement tasks
/opsx:archive      Finish and archive

# Expanded workflow (if enabled):
/opsx:new          Scaffold a change
/opsx:continue     Create next artifact
/opsx:ff           Create planning artifacts
```

---

## Hilfe erhalten

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Dokumentation**: [docs/opsx.md](opsx.md) für die vollständige OPSX-Referenz