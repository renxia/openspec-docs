---
layout: home

hero:
  name: "OpenSpec"
  text: "Specification-Driven Development for AI Assistants"
  tagline: Ein leichtgewichtiges Spec zum Bauen und Verwalten von KI-Assistenten-Projekten.
  actions:
    - theme: brand
      text: Loslegen
      link: ./getting-started
    - theme: alt
      text: Startseite
      link: /

features:
  - title: Spec-First Workflow
    details: Anforderungen definieren, bevor Code geschrieben wird.
  - title: AI-Native Design
    details: Entwickelt für Claude Code, Cursor, Windsurf und mehr.
  - title: Multi-Language
    details: Dokumentation in mehreren Sprachen verfügbar.
---

# OpenSpec Dokumentation

Willkommen. Dies ist die Startseite für alles rund um OpenSpec.

OpenSpec hilft Ihnen und Ihrem KI-Codierungsassistenten, **sich darauf zu einigen, was gebaut werden soll, bevor irgendein Code geschrieben wird.** Sie beschreiben die Änderung, die KI entwirft eine kurze Spezifikation und eine Aufgabenliste, beide schauen sich denselben Plan an, und dann findet die Arbeit statt. Nie wieder das Entdecken auf halbem Weg, dass die KI etwas Falsches erstellt hat.

Wenn Sie nichts anderes lesen, lesen Sie diese beiden Seiten:

1. [Getting Started](getting-started.md): Installieren, initialisieren und Ihre erste Änderung veröffentlichen.
2. [How Commands Work](how-commands-work.md): Wo Sie tatsächlich `/opsx:propose` eingeben (Tipp: in Ihrem KI-Chat, nicht im Terminal). Das verunsichert fast jeden einmal.

Dieses zweite ist wichtiger, als es scheint. OpenSpec hat zwei Hälften: ein Kommandozeilen-Tool, das Sie in Ihrem Terminal ausführen, und Slash-Befehle, die Sie Ihrem KI-Assistenten geben. Zu wissen, welches was ist, erspart Ihnen den häufigsten Moment der Verwirrung.

> **Die beste Gewohnheit, zuerst zu entwickeln: Wenn Sie sich nicht sicher sind, was gebaut werden soll, beginnen Sie mit `/opsx:explore`.** Es ist ein Denkpartner ohne Risiko, der Ihren Code liest, Optionen abwägt und eine vage Idee in einen konkreten Plan verwandelt, bevor irgendein Artefakt oder Code existiert. Der Leitfaden [Explore First](explore.md) belegt dies.

## Wählen Sie Ihren Weg

**Ich bin ganz neu.** Beginnen Sie mit [Getting Started](getting-started.md) und werfen Sie dann einen Blick auf die [Core Concepts at a Glance](overview.md). Wenn etwas mysteriös erscheint, sind [FAQ](faq.md) und [Glossary](glossary.md) in der Nähe.

**Ich habe ein Problem, aber keinen Plan.** Das ist der häufige Fall, und er hat eine spezielle Antwort: [Explore First](explore.md). Nutzen Sie `/opsx:explore`, um es mit der KI durchzudenken, bevor Sie sich festlegen.

**Ich habe eine große bestehende Codebasis.** Sie dokumentieren sie nicht alle. [Using OpenSpec in an Existing Project](existing-projects.md) zeigt, wie man bei echter Brownfield-Code beginnt, ohne das ganze Ozean zu kochen.

**Ich möchte es einfach zum Laufen bringen.** [Install](installation.md), führen Sie `openspec init` aus und lesen Sie dann [How Commands Work](how-commands-work.md), damit Ihr erster Slash-Befehl am richtigen Ort landet.

**Ich lerne durch Beispiele.** Die Seite [Examples & Recipes](examples.md) führt Sie durch echte Änderungen von Anfang bis Ende: eine kleine Funktion, eine Fehlerbehebung, ein Refactoring, eine Erkundung.

**Ich komme aus dem alten Workflow.** Der [Migration Guide](migration-guide.md) erklärt, was sich geändert hat und warum, und verspricht, dass Ihre bestehende Arbeit sicher ist.

**Ich möchte es an den Prozess meines Teams anpassen.** [Customization](customization.md) behandelt die Projektkonfiguration, benutzerdefinierte Schemata und geteilten Kontext.

**Etwas ist kaputt.** [Troubleshooting](troubleshooting.md) sammelt die Fehler, auf die die Leute tatsächlich stoßen, zusammen mit Lösungen.

## Die ganze Karte

### Hier anfangen

| Doc | Was es Ihnen gibt |
|-----|-------------------|
| [Getting Started](getting-started.md) | Installation, Initialisierung und Ausführung Ihrer ersten Änderung von Anfang bis Ende |
| [Explore First](explore.md) | `/opsx:explore` verwenden, um eine Idee zu durchdenken, bevor Sie sich festlegen |
| [How Commands Work](how-commands-work.md) | Wo Slash-Befehle ausgeführt werden, was „interaktiver Modus“ bedeutet, Terminal vs Chat |
| [Core Concepts at a Glance](overview.md) | Das gesamte mentale Modell auf einer Seite: Specs, Änderungen, Deltas, Archiv |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix und wie man überprüft, ob es funktioniert hat |

### Tagtäglich nutzen

| Doc | Was es Ihnen gibt |
|-----|-------------------|
| [Workflows](workflows.md) | Häufige Muster und wann Sie welchen Befehl verwenden sollten |
| [Examples & Recipes](examples.md) | Volle Durchführungen echter Änderungen, kopierbar |
| [Using OpenSpec in an Existing Project](existing-projects.md) | Die Einführung von OpenSpec bei einer großen Brownfield-Codebasis |
| [Editing & Iterating on a Change](editing-changes.md) | Artefakte aktualisieren, zurückgehen, manuelle Bearbeitungen rekonsolidieren |
| [Commands](commands.md) | Referenz für jeden `/opsx:*` Slash-Befehl |
| [CLI](cli.md) | Referenz für jeden `openspec`-Terminalbefehl |

### Es tiefgehend verstehen

| Doc | Was es Ihnen gibt |
|-----|-------------------|
| [Concepts](concepts.md) | Die ausführliche Erklärung von Specs, Änderungen, Artefakten, Schemata und Archiv |
| [OPSX Workflow](opsx.md) | Warum der Workflow fließend statt phasenfest ist, plus ein Architektur-Deep-Dive |
| [Glossary](glossary.md) | Jeder Begriff an einem Ort definiert |

### Es zu Ihrem machen

| Doc | Was es Ihnen gibt |
|-----|-------------------|
| [Customization](customization.md) | Projektkonfiguration, benutzerdefinierte Schemata, geteilter Kontext |
| [Multi-Language](multi-language.md) | Generierung von Artefakten in Sprachen außer Englisch |
| [Supported Tools](supported-tools.md) | Die 25+ KI-Tools, mit denen OpenSpec integriert ist, und wo die Dateien landen |

### Wenn Sie Hilfe benötigen

| Doc | Was es Ihnen gibt |
|-----|-------------------|
| [FAQ](faq.md) | Schnelle Antworten auf die häufigsten Fragen der Leute |
| [Troubleshooting](troubleshooting.md) | Konkrete Lösungen für konkrete Fehler |
| [Migration Guide](migration-guide.md) | Der Umstieg vom Legacy-Workflow auf OPSX |

### Über Repos koordinieren (beta)

| Doc | Was es Ihnen gibt |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | Planung in einem eigenen Repo, wenn Ihre Arbeit mehrere Repos oder Teams umfasst |
| [Agent Contract](agent-contract.md) | Die maschinenlesbaren CLI-Oberflächen, die von Agenten gesteuert werden |

## Die dreißig-sekunden-Version

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in Ihrem KI-Chat)  /opsx:explore           ← optional, aber eine tolle Gewohnheit
4. Propose        (in Ihrem KI-Chat)  /opsx:propose add-dark-mode
5. Build          (in Ihrem KI-Chat)  /opsx:apply
6. Archive        (in Ihrem KI-Chat)  /opsx:archive
```

Schritte 1 und 2 finden in Ihrem Terminal statt. Der Rest findet im Chat Ihres KI-Assistenten statt. Dieser Split ist das Einzige, was es wert ist, sich zu merken, und [How Commands Work](how-commands-work.md) erklärt genau, warum. Schritt 3 ist optional, aber mit `/opsx:explore` zu beginnen, wenn Sie unsicher sind, ist die Gewohnheit, die am meisten nützlich ist.

## Wo sonst Hilfe finden?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) für Fragen, Ideen und Hilfe.
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) für Bugs und Feature Requests.
- **`openspec feedback "Ihre Nachricht"`** sendet Feedback direkt von Ihrem Terminal (es öffnet ein GitHub Issue).

Haben Sie etwas in dieser Dokumentation gefunden, das falsch, veraltet oder verwirrend ist? Das ist ein Bug. Erstellen Sie ein Issue oder einen PR. Verbesserungen der Dokumentation sind einige der wertvollsten Beiträge, die Sie leisten können.