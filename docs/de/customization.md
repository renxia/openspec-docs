# Anpassung

OpenSpec bietet drei Anpassungsebenen:

| Ebene | Funktion | Optimal für |
|-------|----------|-------------|
| **Projektkonfiguration** | Standardwerte festlegen, Kontext/Regeln einfügen | Die meisten Teams |
| **Benutzerdefinierte Schemata** | Eigene Workflow-Artefakte definieren | Teams mit einzigartigen Prozessen |
| **Globale Überschreibungen** | Schemata für alle Projekte freigeben | Power-User |

---

## Projektkonfiguration

Die Datei `openspec/config.yaml` ist der einfachste Weg, um OpenSpec für Ihr Team anzupassen. Sie ermöglicht Ihnen:

- **Standard-Schema festlegen** – Überspringen Sie `--schema` bei jedem Befehl
- **Projektkontext einfügen** – Die KI sieht Ihren Technologie-Stack, Konventionen usw.
- **Artefaktbezogene Regeln hinzufügen** – Benutzerdefinierte Regeln für bestimmte Artefakte

### Schnelleinrichtung

```bash
openspec init
```

Dies führt Sie interaktiv durch die Erstellung einer Konfiguration. Oder erstellen Sie eine manuell:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API style: RESTful, documented in docs/api.md
  Testing: Jest + React Testing Library
  We value backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones
```

### Funktionsweise

**Standard-Schema:**

```bash
# Ohne Konfiguration
openspec new change my-feature --schema spec-driven

# Mit Konfiguration – Schema wird automatisch verwendet
openspec new change my-feature
```

**Einfügen von Kontext und Regeln:**

Bei der Generierung eines beliebigen Artefakts werden Ihr Kontext und Ihre Regeln in den KI-Prompt eingefügt:

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Include rollback plan
- Identify affected teams
</rules>

<template>
[Schema's built-in template]
</template>
```

- **Kontext** wird in ALLEN Artefakten angezeigt
- **Regeln** werden NUR für das passende Artefakt angezeigt

### Schema-Auflösungsreihenfolge

Wenn OpenSpec ein Schema benötigt, prüft es in dieser Reihenfolge:

1. CLI-Flag: `--schema <name>`
2. Änderungsmetadaten (`.openspec.yaml` im Änderungsordner)
3. Projektkonfiguration (`openspec/config.yaml`)
4. Standard (`spec-driven`)

---

## Benutzerdefinierte Schemata

Wenn die Projektkonfiguration nicht ausreicht, erstellen Sie Ihr eigenes Schema mit einem vollständig benutzerdefinierten Workflow. Benutzerdefinierte Schemata befinden sich im Verzeichnis `openspec/schemas/` Ihres Projekts und werden zusammen mit Ihrem Code versionsverwaltet.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Project config
│   ├── schemas/           # Custom schemas live here
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Your changes
└── src/
```

### Forken eines vorhandenen Schemas

Der schnellste Weg zur Anpassung ist das Forken eines integrierten Schemas:

```bash
openspec schema fork spec-driven my-workflow
```

Dies kopiert das gesamte `spec-driven`-Schema nach `openspec/schemas/my-workflow/`, wo Sie es frei bearbeiten können.

**Was Sie erhalten:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Workflow definition
└── templates/
    ├── proposal.md       # Template for proposal artifact
    ├── spec.md           # Template for specs
    ├── design.md         # Template for design
    └── tasks.md          # Template for tasks
```

Bearbeiten Sie nun `schema.yaml`, um den Workflow zu ändern, oder bearbeiten Sie die Vorlagen, um die Ausgabe der KI anzupassen.

### Erstellen eines Schemas von Grund auf

Für einen vollständig neuen Workflow:

```bash
# Interaktiv
openspec schema init research-first

# Nicht-interaktiv
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Schema-Struktur

Ein Schema definiert die Artefakte in Ihrem Workflow und deren Abhängigkeiten untereinander:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: My team's custom workflow

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initial proposal document
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Technical design
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal    # Can't create design until proposal exists

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Wichtige Felder:**

| Feld | Zweck |
|------|-------|
| `id` | Eindeutiger Bezeichner, der in Befehlen und Regeln verwendet wird |
| `generates` | Ausgabedateiname (unterstützt Globs wie `specs/**/*.md`) |
| `template` | Vorlagendatei im Verzeichnis `templates/` |
| `instruction` | KI-Anweisungen zur Erstellung dieses Artefakts |
| `requires` | Abhängigkeiten – welche Artefakte zuerst vorhanden sein müssen |

### Vorlagen

Vorlagen sind Markdown-Dateien, die die KI anleiten. Sie werden bei der Erstellung des entsprechenden Artefakts in den Prompt eingefügt.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

Vorlagen können enthalten:
- Abschnittsüberschriften, die die KI ausfüllen soll
- HTML-Kommentare mit Anweisungen für die KI
- Beispielformate, die die erwartete Struktur zeigen

### Validieren Ihres Schemas

Validieren Sie ein benutzerdefiniertes Schema vor der Verwendung:

```bash
openspec schema validate my-workflow
```

Dadurch werden folgende Punkte geprüft:
- Syntax von `schema.yaml` ist korrekt
- Alle referenzierten Vorlagen existieren
- Keine zirkulären Abhängigkeiten
- Artefakt-IDs sind gültig

### Verwenden Ihres benutzerdefinierten Schemas

Nach der Erstellung können Sie Ihr Schema wie folgt verwenden:

```bash
# Bei Befehl angeben
openspec new change feature --schema my-workflow

# Oder als Standard in config.yaml festlegen
schema: my-workflow
```

### Debuggen der Schema-Auflösung

Sie sind sich nicht sicher, welches Schema verwendet wird? Prüfen Sie es mit:

```bash
# Anzeigen, aus welcher Quelle ein bestimmtes Schema geladen wird
openspec schema which my-workflow

# Alle verfügbaren Schemata auflisten
openspec schema which --all
```

Die Ausgabe zeigt, ob das Schema aus Ihrem Projekt, dem Benutzerverzeichnis oder dem Paket stammt:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Hinweis:** OpenSpec unterstützt außerdem benutzerbezogene Schemata unter `~/.local/share/openspec/schemas/` zur Freigabe in mehreren Projekten. Es wird jedoch empfohlen, projektspezifische Schemata im Verzeichnis `openspec/schemas/` zu verwenden, da diese zusammen mit Ihrem Code versionsverwaltet werden.

---

## Beispiele

### Workflow für schnelle Iterationen

Ein minimaler Workflow für schnelle Iterationen:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Quick proposal
    template: proposal.md
    instruction: |
      Create a brief proposal for this change.
      Focus on what and why, skip detailed specs.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Hinzufügen eines Review-Artefakts

Forken Sie das Standardschema und fügen Sie einen Review-Schritt hinzu:

```bash
openspec schema fork spec-driven with-review
```

Bearbeiten Sie anschließend `schema.yaml`, um Folgendes hinzuzufügen:

```yaml
  - id: review
    generates: review.md
    description: Pre-implementation review checklist
    template: review.md
    instruction: |
      Create a review checklist based on the design.
      Include security, performance, and testing considerations.
    requires:
      - design

  - id: tasks
    # ... existing tasks config ...
    requires:
      - specs
      - design
      - review    # Now tasks require review too
```

---

## Community-Schemata

OpenSpec unterstützt außerdem von der Community gewartete Schemata, die über eigenständige Repositories verteilt werden. Diese bieten meinungsbildende Workflows, die OpenSpec mit anderen Tools oder Systemen integrieren, ähnlich wie der [Community-Erweiterungskatalog von github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) für spec-kit funktioniert.

Community-Schemata sind nicht im OpenSpec-Kern enthalten – sie befinden sich in eigenen Repositories mit eigenem Release-Zyklus. Um ein solches Schema zu verwenden, kopieren Sie das Schema-Bundle in das Verzeichnis `openspec/schemas/<schema-name>/` Ihres Projekts (die README jedes Repos enthält Installationsanweisungen).

| Schema | Betreuer | Repository | Beschreibung |
|--------|----------|------------|--------------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Integriert die Artefakt-Governance von OpenSpec mit den Ausführungsfähigkeiten von [obra/superpowers](https://github.com/obra/superpowers) (Brainstorming, Erstellung von Plänen, TDD über Subagenten, Code-Review, Abschluss). Fügt ein evidenzbasiertes `retrospective`-Artefakt hinzu, das eine Lücke schließt, die Superpowers nativ nicht abdeckt. |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | PM-first-Workflow. Führt die Planungspipeline von [nanopm](https://github.com/nmrtn/nanopm) (Audit → Strategie → Roadmap → PRD) vorgelagert zur Implementierung aus. Verbindet die Produktplanung mit dem spezifikationsgetriebenen Engineering-Workflow von OpenSpec. Artefakte werden bei Vorhandensein aus `.nanopm/` gelesen – der Vorschlag bezieht das Audit, das Design bezieht die Strategie und die Aufgaben beziehen die PRD-Aufschlüsselung. |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | Funktionsbezogene End-to-End-Test-Runbooks. Jede Funktion erhält eine unveränderliche Spezifikation, eine unveränderliche Aufgaben-Vorlage und einen zeitgestempelten Ausführungsdatensatz pro Durchlauf. Assertions beschränken sich ausschließlich auf beobachtbares Verhalten (HTTP-Status, Antworttext, persistierter Zustand – niemals Protokoll-Unterzeichenketten); jeder Durchlauf zeichnet Start/Ende in UTC, Dauer und den geschätzten LLM-Tokenverbrauch auf. |

> Möchten Sie ein Community-Schema beitragen? Eröffnen Sie ein Issue mit einem Link zu Ihrem Repository oder reichen Sie einen PR ein, der dieser Tabelle eine Zeile hinzufügt.

---

## Siehe auch

- [CLI-Referenz: Schema-Befehle](cli.md#schema-commands) – Vollständige Befehlsdokumentation