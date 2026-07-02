# OpenSpec Dokumentation

Willkommen. Dies ist die zentrale Anlaufstelle für alles rund um OpenSpec.

OpenSpec hilft Ihnen und Ihrem KI-Coding-Assistenten, **bevor Code geschrieben wird, sich darauf zu einigen, was gebaut werden soll.** Sie beschreiben die Änderung, die KI erstellt einen kurzen Spezifikationsentwurf und eine Aufgabenliste, Sie beide betrachten denselben Plan, und dann erfolgt die Arbeit. Nie wieder das Entdecken in der Mitte des Prozesses, dass die KI das falsche Ding gebaut hat.

Wenn Sie nichts anderes lesen, lesen Sie diese beiden Seiten:

1. [Getting Started](getting-started.md): Installation, Initialisierung und Bereitstellung Ihrer ersten Änderung.
2. [How Commands Work](how-commands-work.md): Wo Sie `/opsx:propose` tatsächlich eingeben (Tipp: in Ihrem KI-Chat, nicht im Terminal). Das ist der Stolperstein für fast jeden.

Dieses zweite Dokument ist wichtiger, als es scheint. OpenSpec hat zwei Komponenten: ein Kommandozeilenwerkzeug, das Sie im Terminal ausführen, und Slash-Befehle, die Sie Ihrem KI-Assistenten geben. Zu wissen, welches was ist, erspart Ihnen den häufigsten Moment der Verwirrung.

> **Die beste Gewohnheit, zuerst zu etablieren: Wenn Sie sich nicht sicher sind, was Sie bauen sollen, beginnen Sie mit `/opsx:explore`.** Es ist ein denkender Partner ohne Risiko, der Ihren Code liest, Optionen abwägt und eine vage Idee in einen konkreten Plan verwandelt, bevor irgendein Artefakt oder Code existiert. Der Leitfaden [Explore First](explore.md) belegt dies.

## Wählen Sie Ihren Weg

**Ich bin brandneu.** Beginnen Sie mit [Getting Started](getting-started.md) und werfen Sie dann einen Blick auf die [Core Concepts at a Glance](overview.md). Wenn etwas mysteriös erscheint, sind das [FAQ](faq.md) und das [Glossary](glossary.md) hilfreich.

**Ich habe ein Problem, aber keinen Plan.** Dies ist der häufigste Fall, und er hat eine spezielle Antwort: [Explore First](explore.md). Nutzen Sie `/opsx:explore`, um mit der KI darüber nachzudenken, bevor Sie sich auf irgendetwas festlegen.

**Ich habe eine große bestehende Codebasis.** Sie müssen sie nicht komplett dokumentieren. [Using OpenSpec in an Existing Project](existing-projects.md) zeigt, wie man bei realem, bestehendem Code beginnt, ohne das ganze Ozean zu kochen.

**Ich möchte einfach nur, dass es funktioniert.** [Installieren](installation.md), führen Sie `openspec init` aus und lesen Sie [How Commands Work](how-commands-work.md), damit Ihr erster Slash-Befehl am richtigen Ort ankommt.

**Ich lerne durch Beispiele.** Die Seite [Examples & Recipes](examples.md) führt Sie durch reale Änderungen von Anfang bis Ende: ein kleines Feature, einen Bugfix, ein Refactoring, eine Exploration.

**Ich komme aus dem alten Workflow.** Das [Migration Guide](migration-guide.md) erklärt, was sich geändert hat und warum, und verspricht, dass Ihre bestehende Arbeit sicher ist.

**Ich möchte es an den Prozess meines Teams anpassen.** [Customization](customization.md) behandelt die Projektkonfiguration, benutzerdefinierte Schemata und den gemeinsamen Kontext.

**Etwas ist kaputt.** [Troubleshooting](troubleshooting.md) sammelt die Fehler, auf die Menschen tatsächlich erleben, zusammen mit Lösungen.

## Die komplette Übersicht

### Hier anfangen

| Doc | Was es Ihnen gibt |
|-----|-------------------|
| [Getting Started](getting-started.md) | Installation, Initialisierung und Ausführung Ihrer ersten Änderung von Anfang bis Ende |
| [Explore First](explore.md) | Nutzen Sie `/opsx:explore`, um eine Idee zu durchdenken, bevor Sie sich festlegen |
| [How Commands Work](how-commands-work.md) | Wo Slash-Befehle ausgeführt werden, was „interaktiver Modus“ bedeutet, Terminal vs Chat |
| [Core Concepts at a Glance](overview.md) | Das gesamte mentale Modell auf einer Seite: Spezifikationen, Änderungen, Deltas, Archiv |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix und wie Sie überprüfen können, ob es funktioniert hat |

### Den Alltag nutzen

| Doc | Was es Ihnen gibt |
|-----|-------------------|
| [Workflows](workflows.md) | Häufige Muster und wann Sie welchen Befehl verwenden sollten |
| [Examples & Recipes](examples.md) | Volle Durchläufe realer Änderungen, kopierfertig |
| [Using OpenSpec in an Existing Project](existing-projects.md) | Die Einführung von OpenSpec in einer großen bestehenden Codebasis |
| [Editing & Iterating on a Change](editing-changes.md) | Artefakte aktualisieren, zurückgehen, manuelle Bearbeitungen rekonsilianieren |
| [Commands](commands.md) | Referenz für jeden `/opsx:*` Slash-Befehl |
| [CLI](cli.md) | Referenz für jeden `openspec` Terminalbefehl |

### Es tiefgehend verstehen

| Doc | Was es Ihnen gibt |
|-----|-------------------|
| [Concepts](concepts.md) | Die ausführliche Erklärung von Spezifikationen, Änderungen, Artefakten, Schemata und Archiv |
| [OPSX Workflow](opsx.md) | Warum der Workflow fließend statt phasenfest ist, plus ein Architektur-Deep-Dive |
| [Glossary](glossary.md) | Jeder Begriff an einem Ort definiert |

### Es zu Ihrem machen

| Doc | Was es Ihnen gibt |
|-----|-------------------|
| [Customization](customization.md) | Projektkonfiguration, benutzerdefinierte Schemata, gemeinsamer Kontext |
| [Multi-Language](multi-language.md) | Erstellen von Artefakten in Sprachen außer Englisch |
| [Supported Tools](supported-tools.md) | Die 25+ KI-Tools, mit denen OpenSpec integriert ist, und wo die Dateien landen |

### Wenn Sie Hilfe benötigen

| Doc | Was es Ihnen gibt |
|-----|-------------------|
| [FAQ](faq.md) | Schnelle Antworten auf die häufigsten Fragen |
| [Troubleshooting](troubleshooting.md) | Konkrete Lösungen für konkrete Fehler |
| [Migration Guide](migration-guide.md) | Der Übergang vom Legacy-Workflow zu OPSX |

### Über Repos koordinieren (Beta)

| Doc | Was es Ihnen gibt |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | Planen in einem eigenen Repo, wenn Ihre Arbeit mehrere Repos oder Teams umfasst |
| [Agent Contract](agent-contract.md) | Die von der Maschine lesbaren CLI-Schnittstellen, die Agenten steuern |

## Die dreißig Sekunden Version

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in Ihrem KI-Chat)  /opsx:explore           ← optional, aber eine großartige Gewohnheit
4. Propose        (in Ihrem KI-Chat)  /opsx:propose add-dark-mode
5. Build          (in Ihrem KI-Chat)  /opsx:apply
6. Archive        (in Ihrem KI-Chat)  /opsx:archive
```

Schritte 1 und 2 finden in Ihrem Terminal statt. Der Rest geschieht im Chat Ihres KI-Assistenten. Diese Trennung ist das eine Ding, das es wert ist, auswendig gelernt zu werden, und [How Commands Work](how-commands-work.md) erklärt genau warum. Schritt 3 ist optional, aber mit `/opsx:explore` zu beginnen, wenn Sie unsicher sind, ist die Gewohnheit, die sich am meisten lohnt.

## Wo Sie sonst noch Hilfe finden
- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) für Fragen, Ideen und Hilfe.
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) für Bugs und Feature-Anfragen.
- **`openspec feedback "Ihre Nachricht"`** sendet Feedback direkt aus Ihrem Terminal (es öffnet ein GitHub Issue).

Haben Sie etwas in dieser Dokumentation gefunden, das falsch ist, veraltet oder verwirrend? Das ist ein Bug. Erstellen Sie ein Issue oder einen PR. Verbesserungen der Dokumentation sind einige der wertvollsten Beiträge, die Sie leisten können.