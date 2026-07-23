---
layout: home

hero:
  name: "OpenSpec"
  text: "Spezifikationsgesteuerte Entwicklung für KI-Assistenten"
  tagline: Eine leichtgewichtige Spezifikation für die Erstellung und Verwaltung von KI-Assistenten-Projekten.
  actions:
    - theme: brand
      text: Erste Schritte
      link: ./getting-started
    - theme: alt
      text: Startseite
      link: /

features:
  - title: Spezifikationsgesteuerter Workflow
    details: Definiere Anforderungen, bevor du Code schreibst.
  - title: KI-Natives Design
    details: Entwickelt für Claude Code, Cursor, Windsurf und weitere Tools.
  - title: Mehrsprachigkeit
    details: Dokumentation ist in mehreren Sprachen verfügbar.
---

# OpenSpec-Dokumentation

Willkommen. Dies ist die zentrale Anlaufstelle für alles rund um OpenSpec.

OpenSpec hilft dir und deinem KI-Code-Assistenten, **sich darauf zu einigen, was gebaut werden soll, bevor auch nur eine Zeile Code geschrieben wird.** Du beschreibst die Änderung, die KI erstellt einen kurzen Standard und eine Aufgabenliste, ihr beide schaut euch denselben Plan an und dann wird die Arbeit erledigt. Keine bösen Überraschungen mehr, wenn ihr erst zur Hälfte fertig seid und feststellt, dass die KI das Falsche gebaut hat.

Wenn du sonst nichts liest, lies diese beiden Seiten:

1. [Erste Schritte](getting-started.md): Installieren, initialisieren und deine erste Änderung veröffentlichen.
2. [Funktionsweise von Befehlen](how-commands-work.md): Wo du tatsächlich `/opsx:propose` eingibst (Tipp: in deinem KI-Chat, nicht im Terminal). Das verwirrt fast jeden einmal.

Die zweite Seite ist wichtiger, als es scheint. OpenSpec besteht aus zwei Teilen: einem Kommandozeilen-Tool, das du in deinem Terminal ausführst, und Schrägstrich-Befehlen, die du an deinen KI-Assistenten gibst. Wenn du weißt, was was ist, sparst du dir die häufigste Verwirrung.

> **Die beste Gewohnheit, die du dir zuerst aneignen solltest: Wenn du nicht weißt, was du bauen sollst, fange mit `/opsx:explore` an.** Es ist ein risikofreier Denkpartner, der deinen Code liest, Optionen abwägt und eine vage Idee zu einem konkreten Plan verfeinert, bevor irgendwelche Artefakte oder Code existieren. Der Leitfaden [Zuerst erkunden](explore.md) erklärt die Vorteile.

## Wähle deinen Pfad

**Ich bin neu hier.** Fang mit [Erste Schritte](getting-started.md) an, lies dann kurz die [Grundkonzepte auf einen Blick](overview.md). Wenn etwas unklar ist, findest du in der [FAQ](faq.md) und dem [Glossar](glossary.md) schnell Antworten.

**Ich habe ein Problem, aber keinen Plan.** Das ist der häufigste Fall, und dafür gibt es eine eigene Anleitung: [Zuerst erkunden](explore.md). Nutze `/opsx:explore`, um die Sache gemeinsam mit der KI durchzudenken, bevor du dich auf etwas festlegst.

**Ich habe eine große bestehende Codebasis.** Du musst nicht alles dokumentieren. [OpenSpec in einem bestehenden Projekt verwenden](existing-projects.md) zeigt, wie du mit echtem, gewachsenem Code anfängst, ohne das gesamte Projekt auf einmal umkrempeln zu müssen.

**Ich möchte es nur zum Laufen bringen.** [Installieren](installation.md), führe `openspec init` aus und lies dann [Funktionsweise von Befehlen](how-commands-work.md), damit dein erster Schrägstrich-Befehl an der richtigen Stelle ankommt.

**Ich lerne anhand von Beispielen.** Die Seite [Beispiele & Rezepte](examples.md) führt dich durch echte Änderungen von Anfang bis Ende: eine kleine Funktion, ein Bugfix, ein Refactoring, eine Erkundung.

**Die KI hat gerade einen Entwurf für einen Plan erstellt – was jetzt?** Lies ihn durch. [Eine Änderung prüfen](reviewing-changes.md) zeigt die zweiminütige Prüfung, die eine Fehlentscheidung abfängt, solange sie noch kostengünstig zu beheben ist, und [Gute Standards schreiben](writing-specs.md) erklärt, woraus ein genehmigungswürdiger Plan besteht.

**Ich arbeite in einem Team.** [OpenSpec im Team](team-workflow.md) zeigt, wie eine Änderung einem Branch und einem Pull Request zugeordnet wird und wie Teammitglieder einen Plan prüfen, bevor der Code geschrieben wird.

**Ich komme vom alten Workflow.** Der [Migrationsleitfaden](migration-guide.md) erklärt, was sich geändert hat und warum, und versichert, dass deine bestehende Arbeit sicher ist.

**Ich möchte es an den Prozess meines Teams anpassen.** [Anpassung](customization.md) behandelt Projektkonfiguration, benutzerdefinierte Schemata und gemeinsamen Kontext.

**Etwas funktioniert nicht.** [Fehlerbehebung](troubleshooting.md) sammelt die Fehler, die tatsächlich auftreten, mit passenden Lösungen.

## Die gesamte Übersicht

### Hier starten

| Doc | Was du damit bekommst |
|-----|-------------------|
| [Erste Schritte](getting-started.md) | Installieren, initialisieren und deine erste Änderung vollständig durchführen |
| [Zuerst erkunden](explore.md) | Nutze `/opsx:explore`, um eine Idee durchzudenken, bevor du dich festlegst |
| [Funktionsweise von Befehlen](how-commands-work.md) | Wo Schrägstrich-Befehle ausgeführt werden, was "interaktiver Modus" bedeutet, Terminal vs. Chat |
| [Grundkonzepte auf einen Blick](overview.md) | Das gesamte mentale Modell auf einer Seite: Standards, Änderungen, Deltas, Archiv |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix und wie du überprüfst, ob die Installation funktioniert hat |

### Tägliche Nutzung

| Doc | Was du damit bekommst |
|-----|-------------------|
| [Workflows](workflows.md) | Häufige Muster und wann du welchen Befehl nutzen solltest |
| [Beispiele & Rezepte](examples.md) | Vollständige Anleitungen für echte Änderungen, zum Kopieren und Einfügen |
| [Gute Standards schreiben](writing-specs.md) | Wie eine starke Anforderung und ein Szenario aussehen und wie du die Größe einer Änderung richtig wählst |
| [Eine Änderung prüfen](reviewing-changes.md) | Die zweiminütige Prüfung eines Entwurfsplans, bevor auch nur Code geschrieben wird |
| [OpenSpec im Team](team-workflow.md) | Wie Änderungen zu Branches, Pull Requests und Prüfungen passen |
| [OpenSpec in einem bestehenden Projekt verwenden](existing-projects.md) | Einführung von OpenSpec in einem großen, gewachsenen Codebasis |
| [Eine Änderung bearbeiten und iterieren](editing-changes.md) | Artefakte aktualisieren, zurückgehen, manuelle Bearbeitungen abgleichen |
| [Befehle](commands.md) | Referenz für alle `/opsx:*` Schrägstrich-Befehle |
| [CLI](cli.md) | Referenz für alle `openspec` Terminal-Befehle |

### Tiefer verstehen

| Doc | Was du damit bekommst |
|-----|-------------------|
| [Konzepte](concepts.md) | Die ausführliche Erklärung von Standards, Änderungen, Artefakten, Schemata und Archiv |
| [OPSX-Workflow](opsx.md) | Warum der Workflow flüssig statt phasenfixiert ist, plus ein Architektur-Deep-Dive |
| [Glossar](glossary.md) | Alle Begriffe an einem Ort definiert |

### An deine Bedürfnisse anpassen

| Doc | Was du damit bekommst |
|-----|-------------------|
| [Anpassung](customization.md) | Projektkonfiguration, benutzerdefinierte Schemata, gemeinsamer Kontext |
| [Mehrsprachigkeit](multi-language.md) | Artefakte in anderen Sprachen als Englisch generieren |
| [Unterstützte Tools](supported-tools.md) | Die über 25 KI-Tools, mit denen OpenSpec integriert, und wo Dateien abgelegt werden |

### Wenn du Hilfe brauchst

| Doc | Was du damit bekommst |
|-----|-------------------|
| [FAQ](faq.md) | Schnelle Antworten auf die häufigsten Fragen |
| [Fehlerbehebung](troubleshooting.md) | Konkrete Lösungen für konkrete Fehler |
| [Migrationsleitfaden](migration-guide.md) | Umstellung vom alten Workflow auf OPSX |

### Koordination über Repos hinweg (Beta)

| Doc | Was du damit bekommst |
|-----|-------------------|
| [Stores: Benutzerhandbuch](stores-beta/user-guide.md) | Plane in einem eigenen Repo, wenn deine Arbeit sich über mehrere Repos oder Teams erstreckt |
| [Agentenvertrag](agent-contract.md) | Die maschinenlesbaren CLI-Oberflächen, die Agenten steuern |

## Die 30-Sekunden-Version

```text
1. Installieren        npm install -g @fission-ai/openspec@latest
2. Initialisieren     cd your-project && openspec init
3. Erkunden        (in deinem KI-Chat)  /opsx:explore           ← optional, aber eine sehr gute Gewohnheit
4. Vorschlagen        (in deinem KI-Chat)  /opsx:propose add-dark-mode
5. Anwenden          (in deinem KI-Chat)  /opsx:apply
6. Archivieren        (in deinem KI-Chat)  /opsx:archive
```

Die Schritte 1 und 2 erfolgen in deinem Terminal. Der Rest läuft im Chat deines KI-Assistenten ab. Diese Aufteilung ist die einzige Sache, die es sich zu merken lohnt, und [Funktionsweise von Befehlen](how-commands-work.md) erklärt genau, warum das so ist. Schritt 3 ist optional, aber wenn du unsicher bist, mit `/opsx:explore` anzufangen, ist die Gewohnheit, die sich am meisten lohnt.

## Weitere Hilfsmöglichkeiten

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) für Fragen, Ideen und Unterstützung.
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) für Fehler und Funktionsanfragen.
- **`openspec feedback "your message"`** sendet Feedback direkt von deinem Terminal aus (es öffnet ein GitHub-Issue).

Hast du in dieser Dokumentation etwas gefunden, das falsch, veraltet oder verwirrend ist? Das ist ein Fehler. Öffne ein Issue oder einen PR. Verbesserungen an der Dokumentation gehören zu den wertvollsten Beiträgen, die du leisten kannst.