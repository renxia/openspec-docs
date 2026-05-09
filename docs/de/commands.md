# Befehle

Dies ist die Referenz für die Slash-Befehle von OpenSpec. Diese Befehle werden in der Chat-Oberfläche Ihres KI-Coding-Assistenten aufgerufen (z. B. Claude Code, Cursor, Windsurf).

Für Workflow-Muster und den Einsatzzeitpunkt der einzelnen Befehle siehe [Workflows](workflows.md). Für CLI-Befehle siehe [CLI](cli.md).

## Schnellreferenz

### Standard-Schnellpfad (`core`-Profil)

| Befehl | Zweck |
|---------|---------|
| `/opsx:propose` | Änderung erstellen und Planungsartefakte in einem Schritt generieren |
| `/opsx:explore` | Ideen durchdenken, bevor eine Änderung festgelegt wird |
| `/opsx:apply` | Aufgaben aus der Änderung implementieren |
| `/opsx:sync` | Delta-Spezifikationen in Hauptspezifikationen zusammenführen |
| `/opsx:archive` | Eine abgeschlossene Änderung archivieren |

### Erweiterte Workflow-Befehle (benutzerdefinierte Workflow-Auswahl)

| Befehl | Zweck |
|---------|---------|
| `/opsx:new` | Ein neues Änderungsgerüst starten |
| `/opsx:continue` | Das nächste Artefakt basierend auf Abhängigkeiten erstellen |
| `/opsx:ff` | Vorspulen: Alle Planungsartefakte auf einmal erstellen |
| `/opsx:verify` | Überprüfen, ob die Implementierung mit den Artefakten übereinstimmt |
| `/opsx:bulk-archive` | Mehrere Änderungen auf einmal archivieren |
| `/opsx:onboard` | Geführtes Tutorial durch den gesamten Workflow |

Das Standard-Globaprofil ist `core`. Um erweiterte Workflow-Befehle zu aktivieren, führen Sie `openspec config profile` aus, wählen Sie Workflows aus und führen Sie dann `openspec update` in Ihrem Projekt aus.

---

## Befehlsreferenz

### `/opsx:propose`

Erstellt eine neue Änderung und generiert Planungsartefakte in einem Schritt. Dies ist der Standard-Startbefehl im `core`-Profil.

**Syntax:**
```text
/opsx:propose [change-name-or-description]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `change-name-or-description` | Nein | Name im Kebab-Case oder Änderungsbeschreibung in natürlicher Sprache |

**Was es bewirkt:**
- Erstellt `openspec/changes/<change-name>/`
- Generiert die für die Implementierung benötigten Artefakte (für `spec-driven`: Vorschlag, Spezifikationen, Entwurf, Aufgaben)
- Stoppt, wenn die Änderung bereit für `/opsx:apply` ist

**Beispiel:**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**Tipps:**
- Verwenden Sie diesen Befehl für den schnellsten End-to-End-Ablauf
- Wenn Sie schrittweise Kontrolle über die Artefakte wünschen, aktivieren Sie erweiterte Workflows und verwenden Sie `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

Ideen durchdenken, Probleme untersuchen und Anforderungen klären, bevor Sie sich auf eine Änderung festlegen.

**Syntax:**
```
/opsx:explore [topic]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `topic` | Nein | Was Sie erkunden oder untersuchen möchten |

**Was es bewirkt:**
- Öffnet ein exploratives Gespräch ohne Strukturvorgaben
- Untersucht den Codebase, um Fragen zu beantworten
- Vergleicht Optionen und Ansätze
- Erstellt visuelle Diagramme zur Verdeutlichung
- Kann zu `/opsx:propose` (Standard) oder `/opsx:new` (erweiterter Workflow) wechseln, wenn Erkenntnisse konkret werden

**Beispiel:**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT. Can we start a change for that?

AI:  Ready when you are. Run /opsx:propose add-jwt-auth to begin.
```

**Tipps:**
- Verwenden Sie diesen Befehl, wenn Anforderungen unklar sind oder Sie untersuchen müssen
- Während der Exploration werden keine Artefakte erstellt
- Gut geeignet zum Vergleich mehrerer Ansätze vor der Entscheidung
- Kann Dateien lesen und den Codebase durchsuchen

---

### `/opsx:new`

Startet ein neues Änderungsgerüst. Erstellt den Änderungsordner und wartet darauf, dass Sie mit `/opsx:continue` oder `/opsx:ff` Artefakte generieren.

Dieser Befehl gehört zum erweiterten Workflow-Set (nicht im Standard-`core`-Profil enthalten).

**Syntax:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `change-name` | Nein | Name für den Änderungsordner (wird abgefragt, falls nicht angegeben) |
| `--schema` | Nein | Zu verwendendes Workflow-Schema (Standard: aus Konfiguration oder `spec-driven`) |

**Was es bewirkt:**
- Erstellt das Verzeichnis `openspec/changes/<change-name>/`
- Erstellt die Metadatendatei `.openspec.yaml` im Änderungsordner
- Zeigt die erste Artefaktvorlage zur Erstellung an
- Fragt nach Änderungsname und Schema, falls nicht angegeben

**Was es erstellt:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Änderungsmetadaten (Schema, Erstellungsdatum)
```

**Beispiel:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**Tipps:**
- Verwenden Sie aussagekräftige Namen: `add-feature`, `fix-bug`, `refactor-module`
- Vermeiden Sie generische Namen wie `update`, `changes`, `wip`
- Das Schema kann auch in der Projektkonfiguration (`openspec/config.yaml`) gesetzt werden

---

### `/opsx:continue`

Erstellt das nächste Artefakt in der Abhängigkeitskette. Erstellt jeweils ein Artefakt für inkrementellen Fortschritt.

**Syntax:**
```
/opsx:continue [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `change-name` | Nein | Welche Änderung fortgesetzt werden soll (wird aus dem Kontext abgeleitet, falls nicht angegeben) |

**Was es bewirkt:**
- Fragt den Artefakt-Abhängigkeitsgraphen ab
- Zeigt an, welche Artefakte bereit bzw. blockiert sind
- Erstellt das erste bereite Artefakt
- Liest Abhängigkeitsdateien für Kontext
- Zeigt an, was nach der Erstellung verfügbar wird

**Beispiel:**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: tasks
     Run /opsx:continue to create the next artifact.
```

**Tipps:**
- Verwenden Sie diesen Befehl, wenn Sie jedes Artefakt vor dem Fortfahren prüfen möchten
- Gut geeignet für komplexe Änderungen, bei denen Sie Kontrolle wünschen
- Mehrere Artefakte können gleichzeitig bereit werden
- Sie können erstellte Artefakte bearbeiten, bevor Sie fortfahren

---

### `/opsx:ff`

Schnellvorlauf durch die Artefakterstellung. Erstellt alle Planungsartefakte auf einmal.

**Syntax:**
```
/opsx:ff [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `change-name` | Nein | Welche Änderung schnell durchlaufen werden soll (wird aus dem Kontext abgeleitet, falls nicht angegeben) |

**Was es bewirkt:**
- Erstellt alle Artefakte in Abhängigkeitsreihenfolge
- Verfolgt den Fortschritt über eine Aufgabenliste
- Stoppt, wenn alle `apply-required`-Artefakte abgeschlossen sind
- Liest jede Abhängigkeit, bevor das nächste Artefakt erstellt wird

**Beispiel:**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**Tipps:**
- Verwenden Sie diesen Befehl, wenn Sie ein klares Bild davon haben, was Sie bauen
- Schneller als `/opsx:continue` für unkomplizierte Änderungen
- Sie können Artefakte auch nachträglich bearbeiten
- Gut geeignet für kleine bis mittlere Features

---

### `/opsx:apply`

Implementiert Aufgaben aus der Änderung. Arbeitet die Aufgabenliste ab, schreibt Code und hakt erledigte Punkte ab.

**Syntax:**
```
/opsx:apply [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `change-name` | Nein | Welche Änderung implementiert werden soll (wird aus dem Kontext abgeleitet, falls nicht angegeben) |

**Was es bewirkt:**
- Liest `tasks.md` und identifiziert unvollständige Aufgaben
- Arbeitet Aufgaben nacheinander ab
- Schreibt Code, erstellt Dateien, führt Tests bei Bedarf aus
- Markiert Aufgaben als erledigt mit Kontrollkästchen `[x]`

**Beispiel:**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**Tipps:**
- Kann an der unterbrochenen Stelle fortgesetzt werden
- Verwenden Sie den Änderungsnamen für parallele Änderungen
- Der Abschlussstatus wird in den Kontrollkästchen von `tasks.md` verfolgt

---

### `/opsx:verify`

Validiert, dass die Implementierung Ihren Änderungsartefakten entspricht. Prüft Vollständigkeit, Korrektheit und Kohärenz.

**Syntax:**
```
/opsx:verify [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `change-name` | Nein | Welche Änderung verifiziert werden soll (wird aus dem Kontext abgeleitet, falls nicht angegeben) |

**Was es bewirkt:**
- Prüft drei Dimensionen der Implementierungsqualität
- Durchsucht den Codebase nach Implementierungsnachweisen
- Meldet Probleme, kategorisiert als KRITISCH, WARNUNG oder EMPFEHLUNG
- Blockiert die Archivierung nicht, hebt aber Probleme hervor

**Verifizierungsdimensionen:**

| Dimension | Was sie validiert |
|-----------|-------------------|
| **Vollständigkeit** | Alle Aufgaben erledigt, alle Anforderungen implementiert, Szenarien abgedeckt |
| **Korrektheit** | Implementierung entspricht der Spezifikationsabsicht, Randfälle behandelt |
| **Kohärenz** | Entwurfsentscheidungen im Code widergespiegelt, Muster konsistent |

**Beispiel:**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**Tipps:**
- Vor der Archivierung ausführen, um Abweichungen frühzeitig zu erkennen
- Warnungen blockieren die Archivierung nicht, weisen aber auf potenzielle Probleme hin
- Gut geeignet zur Überprüfung der KI-Arbeit vor dem Commit
- Kann Abweichungen zwischen Artefakten und Implementierung aufdecken

---

### `/opsx:sync`

**Optionaler Befehl.** Führt Delta-Spezifikationen einer Änderung in die Hauptspezifikationen zusammen. Die Archivierung fordert bei Bedarf zur Synchronisation auf, daher müssen Sie diesen Befehl normalerweise nicht manuell ausführen.

**Syntax:**
```
/opsx:sync [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `change-name` | Nein | Welche Änderung synchronisiert werden soll (wird aus dem Kontext abgeleitet, falls nicht angegeben) |

**Was es bewirkt:**
- Liest Delta-Spezifikationen aus dem Änderungsordner
- Analysiert die Abschnitte HINZUGEFÜGT/GEÄNDERT/ENTFERNT/UMBENANNT
- Führt Änderungen in das Hauptverzeichnis `openspec/specs/` zusammen
- Erhält vorhandene Inhalte, die nicht in der Delta-Spezifikation erwähnt werden
- Archiviert die Änderung nicht (bleibt aktiv)

**Beispiel:**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**Wann manuell verwenden:**

| Szenario | Sync verwenden? |
|----------|-----------------|
| Lang laufende Änderung, Spezifikationen sollen vor der Archivierung im Hauptordner sein | Ja |
| Mehrere parallele Änderungen benötigen die aktualisierten Basisspezifikationen | Ja |
| Zusammenführung separat vorschauen/prüfen möchten | Ja |
| Schnelle Änderung, direkte Archivierung | Nein (Archivierung übernimmt das) |

**Tipps:**
- Sync ist intelligent, kein einfaches Kopieren-Einfügen
- Kann Szenarien zu bestehenden Anforderungen hinzufügen, ohne Duplikate zu erzeugen
- Änderung bleibt nach dem Sync aktiv (nicht archiviert)
- Die meisten Benutzer müssen diesen Befehl nie direkt aufrufen – die Archivierung fordert bei Bedarf auf

---

### `/opsx:archive`

Archiviert eine abgeschlossene Änderung. Schließt die Änderung ab und verschiebt sie in den Archivordner.

**Syntax:**
```
/opsx:archive [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `change-name` | Nein | Welche Änderung archiviert werden soll (wird aus dem Kontext abgeleitet, falls nicht angegeben) |

**Was es bewirkt:**
- Prüft den Abschlussstatus der Artefakte
- Prüft den Aufgabenabschluss (warnt bei unvollständigen Aufgaben)
- Bietet an, Delta-Spezifikationen zu synchronisieren, falls noch nicht geschehen
- Verschiebt den Änderungsordner nach `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Bewahrt alle Artefakte für die Nachverfolgung auf

**Beispiel:**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**Tipps:**
- Die Archivierung blockiert nicht bei unvollständigen Aufgaben, warnt aber
- Delta-Spezifikationen können während der Archivierung oder vorher synchronisiert werden
- Archivierte Änderungen werden für die Historie aufbewahrt
- Verwenden Sie zuerst `/opsx:verify`, um Probleme zu erkennen

---

### `/opsx:bulk-archive`

Archiviert mehrere abgeschlossene Änderungen auf einmal. Behandelt Spezifikationskonflikte zwischen Änderungen.

**Syntax:**
```
/opsx:bulk-archive [change-names...]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `change-names` | Nein | Bestimmte Änderungen zum Archivieren (wird zur Auswahl aufgefordert, falls nicht angegeben) |

**Was es bewirkt:**
- Listet alle abgeschlossenen Änderungen auf
- Validiert jede Änderung vor der Archivierung
- Erkennt Spezifikationskonflikte über Änderungen hinweg
- Löst Konflikte durch Überprüfung der tatsächlichen Implementierung
- Archiviert in chronologischer Reihenfolge

**Beispiel:**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**Tipps:**
- Gut geeignet für parallele Arbeitsströme
- Konfliktlösung ist agentenbasiert (prüft den Codebase)
- Änderungen werden in der Reihenfolge ihrer Erstellung archiviert
- Fordert vor dem Überschreiben von Spezifikationsinhalten auf

---

### `/opsx:onboard`

Geführte Einführung durch den vollständigen OpenSpec-Workflow. Ein interaktives Tutorial mit Ihrem tatsächlichen Codebase.

**Syntax:**
```
/opsx:onboard
```

**Was es bewirkt:**
- Führt durch einen vollständigen Workflow-Zyklus mit Erläuterungen
- Scannt Ihren Codebase nach echten Verbesserungsmöglichkeiten
- Erstellt eine tatsächliche Änderung mit echten Artefakten
- Implementiert tatsächliche Arbeit (kleine, sichere Änderungen)
- Archiviert die abgeschlossene Änderung
- Erklärt jeden Schritt während der Ausführung

**Phasen:**
1. Willkommen und Codebase-Analyse
2. Eine Verbesserungsmöglichkeit finden
3. Eine Änderung erstellen (`/opsx:new`)
4. Den Vorschlag schreiben
5. Spezifikationen erstellen
6. Den Entwurf schreiben
7. Aufgaben erstellen
8. Aufgaben implementieren (`/opsx:apply`)
9. Implementierung verifizieren
10. Änderung archivieren
11. Zusammenfassung und nächste Schritte

**Beispiel:**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**Tipps:**
- Am besten geeignet für neue Benutzer, die den Workflow erlernen
- Verwendet echten Code, keine Beispieldaten
- Erstellt eine echte Änderung, die Sie behalten oder verwerfen können
- Dauert ca. 15–30 Minuten

---

## Befehlssyntax nach KI-Tool

Verschiedene KI-Tools verwenden leicht unterschiedliche Befehlssyntaxen. Verwenden Sie das Format, das Ihrem Tool entspricht:

| Tool | Syntaxbeispiel |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Skill-basierte Aufrufe wie `/skill:openspec-propose`, `/skill:openspec-apply-change` (keine generierten `opsx-*` Befehlsdateien) |
| Trae | Skill-basierte Aufrufe wie `/openspec-propose`, `/openspec-apply-change` (keine generierten `opsx-*` Befehlsdateien) |

Die Absicht ist über alle Tools hinweg gleich, aber wie Befehle bereitgestellt werden, kann je nach Integration variieren.

> **Hinweis:** GitHub Copilot-Befehle (`.github/prompts/*.prompt.md`) sind nur in IDE-Erweiterungen (VS Code, JetBrains, Visual Studio) verfügbar. Die GitHub Copilot CLI unterstützt derzeit keine benutzerdefinierten Prompt-Dateien – siehe [Unterstützte Tools](supported-tools.md) für Details und Workarounds.

---

## Legacy-Befehle

Diese Befehle verwenden den älteren „Alles-auf-einmal“-Workflow. Sie funktionieren weiterhin, aber OPSX-Befehle werden empfohlen.

| Befehl | Was er tut |
|---------|--------------|
| `/openspec:proposal` | Alle Artefakte auf einmal erstellen (Vorschlag, Spezifikationen, Design, Aufgaben) |
| `/openspec:apply` | Die Änderung implementieren |
| `/openspec:archive` | Die Änderung archivieren |

**Wann Legacy-Befehle verwenden:**
- Bestehende Projekte, die den alten Workflow verwenden
- Einfache Änderungen, bei denen keine schrittweise Artefakterstellung benötigt wird
- Bevorzugung des „Alles-oder-nichts“-Ansatzes

**Migration zu OPSX:**
Legacy-Änderungen können mit OPSX-Befehlen fortgesetzt werden. Die Artefaktstruktur ist kompatibel.

---

## Fehlerbehebung

### „Änderung nicht gefunden“

Der Befehl konnte nicht identifizieren, an welcher Änderung gearbeitet werden soll.

**Lösungen:**
- Geben Sie den Änderungsnamen explizit an: `/opsx:apply add-dark-mode`
- Überprüfen Sie, ob der Änderungsordner existiert: `openspec list`
- Stellen Sie sicher, dass Sie sich im richtigen Projektverzeichnis befinden

### „Keine Artefakte bereit“

Alle Artefakte sind entweder abgeschlossen oder durch fehlende Abhängigkeiten blockiert.

**Lösungen:**
- Führen Sie `openspec status --change <name>` aus, um zu sehen, was blockiert
- Überprüfen Sie, ob erforderliche Artefakte vorhanden sind
- Erstellen Sie zuerst fehlende Abhängigkeitsartefakte

### „Schema nicht gefunden“

Das angegebene Schema existiert nicht.

**Lösungen:**
- Verfügbare Schemas auflisten: `openspec schemas`
- Überprüfen Sie die Schreibweise des Schemanamens
- Erstellen Sie das Schema, falls es benutzerdefiniert ist: `openspec schema init <name>`

### Befehle werden nicht erkannt

Das KI-Tool erkennt OpenSpec-Befehle nicht.

**Lösungen:**
- Stellen Sie sicher, dass OpenSpec initialisiert ist: `openspec init`
- Skills neu generieren: `openspec update`
- Überprüfen Sie, ob das Verzeichnis `.claude/skills/` existiert (für Claude Code)
- Starten Sie Ihr KI-Tool neu, um neue Skills zu laden

### Artefakte werden nicht ordnungsgemäß generiert

Die KI erstellt unvollständige oder fehlerhafte Artefakte.

**Lösungen:**
- Fügen Sie Projektkontext in `openspec/config.yaml` hinzu
- Fügen Sie regelbasierte Hinweise für spezifische Artefakte hinzu
- Geben Sie in Ihrer Änderungsbeschreibung mehr Details an
- Verwenden Sie `/opsx:continue` anstelle von `/opsx:ff` für mehr Kontrolle

---

## Nächste Schritte

- [Workflows](workflows.md) - Gängige Muster und wann welcher Befehl verwendet wird
- [CLI](cli.md) - Terminalbefehle für Verwaltung und Validierung
- [Anpassung](customization.md) - Benutzerdefinierte Schemas und Workflows erstellen