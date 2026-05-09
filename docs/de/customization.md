# Anpassung

OpenSpec bietet drei Anpassungsebenen:

| Ebene | Was sie bewirkt | Ideal für |
|-------|-----------------|-----------|
| **Projektkonfiguration** | Standardeinstellungen festlegen, Kontext/Regeln injizieren | Die meisten Teams |
| **Benutzerdefinierte Schemas** | Eigene Workflow-Artefakte definieren | Teams mit einzigartigen Prozessen |
| **Globale Überschreibungen** | Schemas über alle Projekte hinweg teilen | Power-Nutzer |

---

## Projektkonfiguration

Die Datei `openspec/config.yaml` ist der einfachste Weg, OpenSpec für Ihr Team anzupassen. Sie ermöglicht es Ihnen:

- **Ein Standardschema festzulegen** – `--schema` bei jedem Befehl überspringen
- **Projektkontext injizieren** – Die KI sieht Ihren Tech-Stack, Konventionen usw.
- **Regeln pro Artefakt hinzufügen** – Benutzerdefinierte Regeln für bestimmte Artefakte

### Schnelleinrichtung

```bash
openspec init
```

Dies führt Sie interaktiv durch die Erstellung einer Konfiguration. Oder erstellen Sie eine manuell:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech-Stack: TypeScript, React, Node.js, PostgreSQL
  API-Stil: RESTful, dokumentiert in docs/api.md
  Testing: Jest + React Testing Library
  Wir legen Wert auf Abwärtskompatibilität für alle öffentlichen APIs

rules:
  proposal:
    - Rollback-Plan einbeziehen
    - Betroffene Teams identifizieren
  specs:
    - Given/When/Then-Format verwenden
    - Vorhandene Muster referenzieren, bevor neue erfunden werden
```

### Funktionsweise

**Standardschema:**

```bash
# Ohne Konfiguration
openspec new change my-feature --schema spec-driven

# Mit Konfiguration – Schema ist automatisch
openspec new change my-feature
```

**Kontext- und Regelinjektion:**

Bei der Generierung jedes Artefakts werden Ihr Kontext und Ihre Regeln in den KI-Prompt injiziert:

```xml
<context>
Tech-Stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Rollback-Plan einbeziehen
- Betroffene Teams identifizieren
</rules>

<template>
[Eingebaute Vorlage des Schemas]
</template>
```

- **Kontext** erscheint in ALLEN Artefakten
- **Regeln** erscheinen NUR für das passende Artefakt

### Schema-Auflösungsreihenfolge

Wenn OpenSpec ein Schema benötigt, prüft es in dieser Reihenfolge:

1. CLI-Flag: `--schema <name>`
2. Change-Metadaten (`.openspec.yaml` im Change-Ordner)
3. Projektkonfiguration (`openspec/config.yaml`)
4. Standard (`spec-driven`)

---

## Benutzerdefinierte Schemas

Wenn die Projektkonfiguration nicht ausreicht, erstellen Sie Ihr eigenes Schema mit einem völlig benutzerdefinierten Workflow. Benutzerdefinierte Schemas liegen im Verzeichnis `openspec/schemas/` Ihres Projekts und werden zusammen mit Ihrem Code versioniert.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Projektkonfiguration
│   ├── schemas/           # Benutzerdefinierte Schemas liegen hier
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Ihre Änderungen
└── src/
```

### Ein vorhandenes Schema forken

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
    ├── spec.md           # Vorlage für Spezifikationen
    ├── design.md         # Vorlage für das Design
    └── tasks.md          # Vorlage für Aufgaben
```

Bearbeiten Sie nun `schema.yaml`, um den Workflow zu ändern, oder bearbeiten Sie die Vorlagen, um zu ändern, was die KI generiert.

### Ein Schema von Grund auf erstellen

Für einen völlig neuen Workflow:

```bash
# Interaktiv
openspec schema init research-first

# Nicht-interaktiv
openspec schema init rapid \
  --description "Rapid Iteration Workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Schema-Struktur

Ein Schema definiert die Artefakte in Ihrem Workflow und wie sie voneinander abhängen:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: Der benutzerdefinierte Workflow meines Teams

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initiales Proposal-Dokument
    template: proposal.md
    instruction: |
      Erstellen Sie ein Proposal, das erklärt, WARUM diese Änderung benötigt wird.
      Konzentrieren Sie sich auf das Problem, nicht auf die Lösung.
    requires: []

  - id: design
    generates: design.md
    description: Technisches Design
    template: design.md
    instruction: |
      Erstellen Sie ein Design-Dokument, das erklärt, WIE implementiert werden soll.
    requires:
      - proposal    # Design kann nicht erstellt werden, bevor Proposal existiert

  - id: tasks
    generates: tasks.md
    description: Implementierungs-Checkliste
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Schlüsselfelder:**

| Feld | Zweck |
|------|-------|
| `id` | Eindeutiger Bezeichner, verwendet in Befehlen und Regeln |
| `generates` | Ausgabedateiname (unterstützt Globs wie `specs/**/*.md`) |
| `template` | Vorlagendatei im `templates/`-Verzeichnis |
| `instruction` | KI-Anweisungen zur Erstellung dieses Artefakts |
| `requires` | Abhängigkeiten – welche Artefakte zuerst vorhanden sein müssen |

### Vorlagen

Vorlagen sind Markdown-Dateien, die die KI anleiten. Sie werden in den Prompt injiziert, wenn dieses Artefakt erstellt wird.

```markdown
<!-- templates/proposal.md -->
## Warum

<!-- Erklären Sie die Motivation für diese Änderung. Welches Problem löst dies? -->

## Was sich ändert

<!-- Beschreiben Sie, was sich ändern wird. Seien Sie spezifisch bezüglich neuer Fähigkeiten oder Modifikationen. -->

## Auswirkungen

<!-- Betroffener Code, APIs, Abhängigkeiten, Systeme -->
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
- Die Syntax von `schema.yaml` ist korrekt
- Alle referenzierten Vorlagen existieren
- Keine zirkulären Abhängigkeiten
- Artefakt-IDs sind gültig

### Verwenden Sie Ihr benutzerdefiniertes Schema

Nach der Erstellung verwenden Sie Ihr Schema mit:

```bash
# Im Befehl angeben
openspec new change feature --schema my-workflow

# Oder in config.yaml als Standard festlegen
schema: my-workflow
```

### Schema-Auflösung debuggen

Nicht sicher, welches Schema verwendet wird? Prüfen Sie mit:

```bash
# Sehen Sie, woher ein bestimmtes Schema aufgelöst wird
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

> **Hinweis:** OpenSpec unterstützt auch Schemas auf Benutzerebene unter `~/.local/share/openspec/schemas/` zum Teilen über Projekte hinweg, aber Schemas auf Projektebene in `openspec/schemas/` werden empfohlen, da sie zusammen mit Ihrem Code versioniert werden.

---

## Beispiele

### Rapid-Iteration-Workflow

Ein minimaler Workflow für schnelle Iterationen:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Schnelle Iteration mit minimalem Overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Kurzes Proposal
    template: proposal.md
    instruction: |
      Erstellen Sie ein kurzes Proposal für diese Änderung.
      Konzentrieren Sie sich auf das Was und Warum, überspringen Sie detaillierte Spezifikationen.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementierungs-Checkliste
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
    description: Vor-Implementierungs-Review-Checkliste
    template: review.md
    instruction: |
      Erstellen Sie eine Review-Checkliste basierend auf dem Design.
      Beziehen Sie Sicherheits-, Leistungs- und Testaspekte ein.
    requires:
      - design

  - id: tasks
    # ... vorhandene tasks-Konfiguration ...
    requires:
      - specs
      - design
      - review    # Jetzt erfordern tasks auch review
```

---

## Community-Schemas

OpenSpec unterstützt auch von der Community gewartete Schemas, die über eigenständige Repositories verteilt werden. Diese bieten meinungsstarke Workflows, die OpenSpec mit anderen Tools oder Systemen integrieren, ähnlich wie [github/spec-kits Community-Erweiterungskatalog](https://github.com/github/spec-kit/tree/main/extensions) für spec-kit funktioniert.

Community-Schemas sind nicht in den OpenSpec-Kern eingebunden – sie leben in ihren eigenen Repositories mit ihrem eigenen Release-Zyklus. Um eines zu verwenden, kopieren Sie das Schema-Bundle in das Verzeichnis `openspec/schemas/<schema-name>/` Ihres Projekts (jedes Repository hat Installationsanweisungen in der README).

| Schema | Betreuer | Repository | Beschreibung |
|--------|----------|------------|--------------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Integriert OpenSpecs Artefakt-Governance mit [obra/superpowers](https://github.com/obra/superpowers) Ausführungsfähigkeiten (Brainstorming, Planerstellung, TDD über Subagenten, Code-Review, Abschluss). Fügt ein evidenzbasiertes `retrospective`-Artefakt hinzu, das eine Lücke füllt, die Superpowers nicht nativ abdeckt. |

> Möchten Sie ein Community-Schema beitragen? Eröffnen Sie ein Issue mit einem Link zu Ihrem Repository, oder senden Sie eine PR, die eine Zeile zu dieser Tabelle hinzufügt.

---

## Siehe auch

- [CLI-Referenz: Schema-Befehle](cli.md#schema-commands) - Vollständige Befehlsdokumentation