# Anpassung

OpenSpec bietet drei Ebenen der Anpassung:

| Ebene | Was es tut | Am besten geeignet für |
|-------|------------|------------------------|
| **Projektkonfiguration** | Standardwerte setzen, Kontext/Regeln injizieren | Die meisten Teams |
| **Benutzerdefinierte Schemas** | Eigene Workflow-Artefakte definieren | Teams mit einzigartigen Prozessen |
| **Globale Überschreibungen** | Schemas über alle Projekte hinweg teilen | Fortgeschrittene Benutzer |

---

## Projektkonfiguration

Die Datei `openspec/config.yaml` ist der einfachste Weg, OpenSpec für Ihr Team anzupassen. Sie ermöglicht es Ihnen:

- **Ein Standardschema festzulegen** - Überspringen Sie `--schema` bei jedem Befehl
- **Projektkontext zu injizieren** - Die KI sieht Ihren Technologie-Stack, Konventionen usw.
- **Regeln pro Artefakt hinzuzufügen** - Benutzerdefinierte Regeln für bestimmte Artefakte

### Schnelle Einrichtung

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

**Standardschema:**

```bash
# Ohne Konfiguration
openspec new change my-feature --schema spec-driven

# Mit Konfiguration - Schema ist automatisch
openspec new change my-feature
```

**Kontext- und Regelinjektion:**

Bei der Erstellung eines beliebigen Artefakts werden Ihr Kontext und Ihre Regeln in den KI-Prompt injiziert:

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

- **Kontext** erscheint in ALLEN Artefakten
- **Regeln** erscheinen NUR für das passende Artefakt

### Schema-Auflösungsreihenfolge

Wenn OpenSpec ein Schema benötigt, prüft es in dieser Reihenfolge:

1. CLI-Flag: `--schema <name>`
2. Änderungs-Metadaten (`.openspec.yaml` im Änderungsordner)
3. Projektkonfiguration (`openspec/config.yaml`)
4. Standard (`spec-driven`)

---

## Benutzerdefinierte Schemas

Wenn die Projektkonfiguration nicht ausreicht, erstellen Sie Ihr eigenes Schema mit einem völlig benutzerdefinierten Workflow. Benutzerdefinierte Schemas befinden sich im Verzeichnis `openspec/schemas/` Ihres Projekts und werden mit Ihrem Code versioniert.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Projektkonfiguration
│   ├── schemas/           # Benutzerdefinierte Schemas befinden sich hier
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Ihre Änderungen
└── src/
```

### Ein bestehendes Schema forken

Der schnellste Weg zur Anpassung ist das Forken eines eingebauten Schemas:

```bash
openspec schema fork spec-driven my-workflow
```

Dies kopiert das gesamte `spec-driven`-Schema nach `openspec/schemas/my-workflow/`, wo Sie es frei bearbeiten können.

**Was Sie erhalten:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Workflow-Definition
└── templates/
    ├── proposal.md       # Vorlage für das Proposal-Artefakt
    ├── spec.md           # Vorlage für Specs
    ├── design.md         # Vorlage für Design
    └── tasks.md          # Vorlage für Tasks
```

Bearbeiten Sie nun `schema.yaml`, um den Workflow zu ändern, oder bearbeiten Sie die Vorlagen, um zu ändern, was die KI generiert.

### Ein Schema von Grund auf erstellen

Für einen völlig neuen Workflow:

```bash
# Interaktiv
openspec schema init research-first

# Nicht-interaktiv
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Schemastruktur

Ein Schema definiert die Artefakte in Ihrem Workflow und wie sie voneinander abhängen:

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
| `id` | Eindeutige Kennung, verwendet in Befehlen und Regeln |
| `generates` | Ausgabedateiname (unterstützt Glob-Muster wie `specs/**/*.md`) |
| `template` | Vorlagendatei im Verzeichnis `templates/` |
| `instruction` | KI-Anweisungen zur Erstellung dieses Artefakts |
| `requires` | Abhängigkeiten - welche Artefakte müssen zuerst existieren |

### Vorlagen

Vorlagen sind Markdown-Dateien, die die KI leiten. Sie werden in den Prompt injiziert, wenn dieses Artefakt erstellt wird.

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
- HTML-Kommentare mit Anleitung für die KI
- Beispielformate, die die erwartete Struktur zeigen

### Validieren Sie Ihr Schema

Bevor Sie ein benutzerdefiniertes Schema verwenden, validieren Sie es:

```bash
openspec schema validate my-workflow
```

Dies prüft:
- `schema.yaml`-Syntax ist korrekt
- Alle referenzierten Vorlagen existieren
- Keine zirkulären Abhängigkeiten
- Artefakt-IDs sind gültig

### Verwenden Sie Ihr benutzerdefiniertes Schema

Nach der Erstellung verwenden Sie Ihr Schema mit:

```bash
# Im Befehl angeben
openspec new change feature --schema my-workflow

# Oder als Standard in config.yaml festlegen
schema: my-workflow
```

### Schema-Auflösung debuggen

Nicht sicher, welches Schema verwendet wird? Prüfen Sie mit:

```bash
# Sehen, wo ein bestimmtes Schema aufgelöst wird
openspec schema which my-workflow

# Alle verfügbaren Schemas auflisten
openspec schema which --all
```

Die Ausgabe zeigt, ob es aus Ihrem Projekt, dem Benutzerverzeichnis oder dem Paket stammt:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Hinweis:** OpenSpec unterstützt auch benutzerdefinierte Schemas auf Benutzerebene unter `~/.local/share/openspec/schemas/` zur Weitergabe über Projekte hinweg, aber projektspezifische Schemas in `openspec/schemas/` werden empfohlen, da sie mit Ihrem Code versioniert werden.

---

## Beispiele

### Schneller Iterations-Workflow

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

Forken Sie den Standard und fügen Sie einen Review-Schritt hinzu:

```bash
openspec schema fork spec-driven with-review
```

Bearbeiten Sie dann `schema.yaml`, um Folgendes hinzuzufügen:

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

## Siehe auch

- [CLI-Referenz: Schema-Befehle](cli.md#schema-commands) - Vollständige Befehlsdokumentation