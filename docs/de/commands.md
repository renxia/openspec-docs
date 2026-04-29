# Befehle

Dies ist die Referenz für OpenSpecs Schrägstrichbefehle. Diese Befehle werden in der Chat-Oberfläche Ihres KI-gestützten Code-Assistenten aufgerufen (z. B. Claude Code, Cursor, Windsurf).

Für Arbeitsablaufmuster und die Verwendung der einzelnen Befehle siehe [Arbeitsabläufe](workflows.md). Für CLI-Befehle siehe [CLI](cli.md).

## Schnellreferenz

### Standard-Schnellweg (`core`-Profil)

| Befehl | Zweck |
|---------|---------|
| `/opsx:propose` | Eine Änderung erstellen und Planungsartefakte in einem Schritt generieren |
| `/opsx:explore` | Ideen durchdenken, bevor man sich für eine Änderung entscheidet |
| `/opsx:apply` | Aufgaben aus der Änderung implementieren |
| `/opsx:archive` | Eine abgeschlossene Änderung archivieren |

### Erweiterte Arbeitsablaufbefehle (benutzerdefinierte Arbeitsablaufauswahl)

| Befehl | Zweck |
|---------|---------|
| `/opsx:new` | Einen neuen Änderungsscaffold starten |
| `/opsx:continue` | Das nächste Artefakt basierend auf Abhängigkeiten erstellen |
| `/opsx:ff` | Schnellvorlauf: Alle Planungsartefakte auf einmal erstellen |
| `/opsx:verify` | Überprüfen, ob die Implementierung mit den Artefakten übereinstimmt |
| `/opsx:sync` | Delta-Spezifikationen in die Hauptspezifikationen zusammenführen |
| `/opsx:bulk-archive` | Mehrere Änderungen auf einmal archivieren |
| `/opsx:onboard` | Geführtes Tutorial durch den gesamten Arbeitsablauf |

Das Standard-Globale Profil ist `core`. Um erweiterte Arbeitsablaufbefehle zu aktivieren, führen Sie `openspec config profile` aus, wählen Sie Arbeitsabläufe aus und führen Sie dann `openspec update` in Ihrem Projekt aus.

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
|----------|--------------|--------------|
| `change-name-or-description` | Nein | Name in Kebab-Form oder Beschreibung der Änderung in Klartext |

**Was es macht:**
- Erstellt `openspec/changes/<change-name>/`
- Generiert die vor der Implementierung benötigten Artefakte (für `spec-driven`: Vorschlag, Spezifikationen, Design, Aufgaben)
- Stoppt, wenn die Änderung für `/opsx:apply` bereit ist

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
- Verwenden Sie dies für den schnellsten End-to-End-Weg
- Wenn Sie eine schrittweise Artefaktkontrolle wünschen, aktivieren Sie erweiterte Workflows und verwenden Sie `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

Durchdenken Sie Ideen, untersuchen Sie Probleme und klären Sie Anforderungen, bevor Sie sich für eine Änderung entscheiden.

**Syntax:**
```
/opsx:explore [topic]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|--------------|
| `topic` | Nein | Was Sie erkunden oder untersuchen möchten |

**Was es macht:**
- Eröffnet ein exploratives Gespräch ohne vorgegebene Struktur
- Untersucht den Codebase, um Fragen zu beantworten
- Vergleicht Optionen und Ansätze
- Erstellt visuelle Diagramme zur Verdeutlichung des Gedankengangs
- Kann zu `/opsx:propose` (Standard) oder `/opsx:new` (erweiterter Workflow) übergehen, wenn Erkenntnisse reifen

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
- Verwenden Sie dies, wenn Anforderungen unklar sind oder Sie untersuchen müssen
- Während der Erkundung werden keine Artefakte erstellt
- Gut zum Vergleich mehrerer Ansätze vor einer Entscheidung
- Kann Dateien lesen und den Codebase durchsuchen

---

### `/opsx:new`

Startet eine neue Änderungsvorlage. Erstellt den Änderungsordner und wartet darauf, dass Sie Artefakte mit `/opsx:continue` oder `/opsx:ff` generieren.

Dieser Befehl ist Teil des erweiterten Workflow-Sets (nicht im Standard-`core`-Profil enthalten).

**Syntax:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|--------------|
| `change-name` | Nein | Name für den Änderungsordner (wird bei Nichtangabe abgefragt) |
| `--schema` | Nein | Zu verwendendes Workflow-Schema (Standard: aus Konfiguration oder `spec-driven`) |

**Was es macht:**
- Erstellt das Verzeichnis `openspec/changes/<change-name>/`
- Erstellt die Metadaten-Datei `.openspec.yaml` im Änderungsordner
- Zeigt die erste Artefaktvorlage, die zur Erstellung bereit ist
- Fragt nach Änderungsname und Schema, wenn nicht angegeben

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
- Verwenden Sie beschreibende Namen: `add-feature`, `fix-bug`, `refactor-module`
- Vermeiden Sie generische Namen wie `update`, `changes`, `wip`
- Das Schema kann auch in der Projektkonfiguration (`openspec/config.yaml`) gesetzt werden

---

### `/opsx:continue`

Erstellt das nächste Artefakt in der Abhängigkeitskette. Erstellt ein Artefakt nach dem anderen für schrittweisen Fortschritt.

**Syntax:**
```
/opsx:continue [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|--------------|
| `change-name` | Nein | Welche Änderung fortgesetzt werden soll (wird aus dem Kontext abgeleitet, wenn nicht angegeben) |

**Was es macht:**
- Fragt den Artefakt-Abhängigkeitsgraphen ab
- Zeigt, welche Artefakte bereit vs. blockiert sind
- Erstellt das erste bereite Artefakt
- Liest Abhängigkeitsdateien für Kontext
- Zeigt, was nach der Erstellung verfügbar wird

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
- Verwenden Sie dies, wenn Sie jedes Artefakt vor dem Fortfahren überprüfen möchten
- Gut für komplexe Änderungen, bei denen Sie Kontrolle wünschen
- Mehrere Artefakte können gleichzeitig bereit werden
- Sie können erstellte Artefakte vor dem Fortfahren bearbeiten

---

### `/opsx:ff`

Schnelldurchlauf durch die Artefakterstellung. Erstellt alle Planungsartefakte auf einmal.

**Syntax:**
```
/opsx:ff [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|--------------|
| `change-name` | Nein | Welche Änderung schnelldurchlaufen werden soll (wird aus dem Kontext abgeleitet, wenn nicht angegeben) |

**Was es macht:**
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
- Verwenden Sie dies, wenn Sie ein klares Bild davon haben, was Sie bauen
- Schneller als `/opsx:continue` für unkomplizierte Änderungen
- Sie können Artefakte danach immer noch bearbeiten
- Gut für kleine bis mittlere Funktionen

---

### `/opsx:apply`

Implementiert Aufgaben aus der Änderung. Arbeitet die Aufgabenliste ab, schreibt Code und hakt Punkte ab.

**Syntax:**
```
/opsx:apply [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|--------------|
| `change-name` | Nein | Welche Änderung implementiert werden soll (wird aus dem Kontext abgeleitet, wenn nicht angegeben) |

**Was es macht:**
- Liest `tasks.md` und identifiziert unvollständige Aufgaben
- Arbeitet Aufgaben eine nach der anderen ab
- Schreibt Code, erstellt Dateien, führt Tests bei Bedarf aus
- Markiert Aufgaben als abgeschlossen mit Häkchen `[x]`

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
- Kann unterbrochen werden und dort fortsetzen, wo Sie aufgehört haben
- Verwenden Sie dies für parallele Änderungen durch Angabe des Änderungsnamens
- Der Abschlussstatus wird in den Häkchen von `tasks.md` verfolgt

---

### `/opsx:verify`

Validiert, dass die Implementierung Ihren Änderungsartefakten entspricht. Prüft Vollständigkeit, Korrektheit und Kohärenz.

**Syntax:**
```
/opsx:verify [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|--------------|
| `change-name` | Nein | Welche Änderung überprüft werden soll (wird aus dem Kontext abgeleitet, wenn nicht angegeben) |

**Was es macht:**
- Prüft drei Dimensionen der Implementierungsqualität
- Durchsucht den Codebase nach Implementierungsnachweisen
- Meldet Probleme, kategorisiert als KRITISCH, WARNUNG oder VORSCHLAG
- Blockiert die Archivierung nicht, zeigt aber Probleme auf

**Verifizierungsdimensionen:**

| Dimension | Was sie validiert |
|-----------|-------------------|
| **Vollständigkeit** | Alle Aufgaben erledigt, alle Anforderungen implementiert, Szenarien abgedeckt |
| **Korrektheit** | Implementierung entspricht Spezifikationsabsicht, Randfälle behandelt |
| **Kohärenz** | Designentscheidungen im Code widergespiegelt, Muster konsistent |

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
- Führen Sie dies vor der Archivierung aus, um Diskrepanzen frühzeitig zu erfassen
- Warnungen blockieren die Archivierung nicht, weisen aber auf potenzielle Probleme hin
- Gut zur Überprüfung der KI-Arbeit vor dem Commit
- Kann Abweichungen zwischen Artefakten und Implementierung aufdecken

---

### `/opsx:sync`

**Optionaler Befehl.** Führt Delta-Spezifikationen aus einer Änderung in die Hauptspezifikationen zusammen. Die Archivierung wird bei Bedarf zum Synchronisieren auffordern, daher müssen Sie dies normalerweise nicht manuell ausführen.

**Syntax:**
```
/opsx:sync [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|--------------|
| `change-name` | Nein | Welche Änderung synchronisiert werden soll (wird aus dem Kontext abgeleitet, wenn nicht angegeben) |

**Was es macht:**
- Liest Delta-Spezifikationen aus dem Änderungsordner
- Parst HINZUGEFÜGT/GEÄNDERT/ENTFERNT/UMBENANNT-Abschnitte
- Führt Änderungen in das Hauptverzeichnis `openspec/specs/` zusammen
- Erhält bestehende Inhalte, die im Delta nicht erwähnt werden
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
| Lang laufende Änderung, Spezifikationen vor Archivierung in Hauptdateien haben wollen | Ja |
| Mehrere parallele Änderungen benötigen die aktualisierten Basisspezifikationen | Ja |
| Zusammenführung separat Vorschauen/überprüfen wollen | Ja |
| Schnelle Änderung, direkt zur Archivierung | Nein (Archivierung erledigt dies) |

**Tipps:**
- Sync ist intelligent, kein Kopieren und Einfügen
- Kann Szenarien zu bestehenden Anforderungen hinzufügen, ohne zu duplizieren
- Änderung bleibt nach Sync aktiv (nicht archiviert)
- Die meisten Benutzer müssen dies nie direkt aufrufen – die Archivierung fordert bei Bedarf auf

---

### `/opsx:archive`

Archiviert eine abgeschlossene Änderung. Finalisiert die Änderung und verschiebt sie in den Archivordner.

**Syntax:**
```
/opsx:archive [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|--------------|
| `change-name` | Nein | Welche Änderung archiviert werden soll (wird aus dem Kontext abgeleitet, wenn nicht angegeben) |

**Was es macht:**
- Prüft den Abschlussstatus der Artefakte
- Prüft den Aufgabenabschluss (warnt bei Unvollständigkeit)
- Bietet an, Delta-Spezifikationen zu synchronisieren, wenn dies noch nicht geschehen ist
- Verschiebt den Änderungsordner nach `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Erhält alle Artefakte für eine Prüfungsprotokoll

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
- Archivierte Änderungen werden für die Historie aufbewahren
- Verwenden Sie zuerst `/opsx:verify`, um Probleme zu erfassen

---

### `/opsx:bulk-archive`

Archiviert mehrere abgeschlossene Änderungen auf einmal. Behandelt Spezifikationskonflikte zwischen Änderungen.

**Syntax:**
```
/opsx:bulk-archive [change-names...]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|--------------|
| `change-names` | Nein | Bestimmte Änderungen zum Archivieren (wird bei Nichtangabe zur Auswahl aufgefordert) |

**Was es macht:**
- Listet alle abgeschlossenen Änderungen auf
- Validiert jede Änderung vor der Archivierung
- Erkennt Spezifikationskonflikte über Änderungen hinweg
- Löst Konflikte durch Prüfung, was tatsächlich implementiert ist
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
- Gut für parallele Arbeitsströme
- Konfliktlösung ist agentenbasiert (prüft den Codebase)
- Änderungen werden in der Reihenfolge ihrer Erstellung archiviert
- Fordert vor dem Überschreiben von Spezifikationsinhalten auf

---

### `/opsx:onboard`

Geführtes Onboarding durch den vollständigen OpenSpec-Workflow. Ein interaktives Tutorial unter Verwendung Ihres tatsächlichen Codebase.

**Syntax:**
```
/opsx:onboard
```

**Was es macht:**
- Durchläuft einen vollständigen Workflow-Zyklus mit Erläuterungen
- Scannt Ihren Codebase nach realen Verbesserungsmöglichkeiten
- Erstellt eine tatsächliche Änderung mit realen Artefakten
- Implementiert tatsächliche Arbeit (kleine, sichere Änderungen)
- Archiviert die abgeschlossene Änderung
- Erklärt jeden Schritt während der Durchführung

**Phasen:**
1. Willkommen und Codebase-Analyse
2. Finden einer Verbesserungsmöglichkeit
3. Erstellen einer Änderung (`/opsx:new`)
4. Schreiben des Vorschlags
5. Erstellen der Spezifikationen
6. Schreiben des Designs
7. Erstellen der Aufgaben
8. Implementieren der Aufgaben (`/opsx:apply`)
9. Überprüfen der Implementierung
10. Archivieren der Änderung
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
- Am besten für neue Benutzer, die den Workflow lernen
- Verwendet echten Code, keine Spielzeugbeispiele
- Erstellt eine echte Änderung, die Sie behalten oder verwerfen können
- Dauert 15-30 Minuten zum Abschluss

---

## Befehlssyntax je nach KI-Tool

Verschiedene KI-Tools verwenden leicht unterschiedliche Befehlssyntaxen. Verwenden Sie das Format, das zu Ihrem Tool passt:

| Tool | Syntax-Beispiel |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Trae | Skill-basierte Aufrufe wie `/openspec-propose`, `/openspec-apply-change` (keine generierten `opsx-*` Befehlsdateien) |

Die Absicht ist bei allen Tools dieselbe, aber die Art und Weise, wie Befehle bereitgestellt werden, kann je nach Integration variieren.

> **Hinweis:** GitHub Copilot Befehle (`.github/prompts/*.prompt.md`) sind nur in IDE-Erweiterungen (VS Code, JetBrains, Visual Studio) verfügbar. GitHub Copilot CLI unterstützt derzeit keine benutzerdefinierten Prompt-Dateien – siehe [Unterstützte Tools](supported-tools.md) für Details und Workarounds.

---

## Veraltete Befehle

Diese Befehle verwenden den älteren "Alles-auf-einmal"-Workflow. Sie funktionieren noch, aber OPSX-Befehle werden empfohlen.

| Befehl | Was er tut |
|---------|--------------|
| `/openspec:proposal` | Alle Artefakte auf einmal erstellen (Vorschlag, Spezifikationen, Design, Aufgaben) |
| `/openspec:apply` | Die Änderung implementieren |
| `/openspec:archive` | Die Änderung archivieren |

**Wann veraltete Befehle verwenden:**
- Bestehende Projekte, die den alten Workflow verwenden
- Einfache Änderungen, bei denen keine schrittweise Artefakterstellung benötigt wird
- Bevorzugung des Alles-oder-nichts-Ansatzes

**Migration zu OPSX:**
Veraltete Änderungen können mit OPSX-Befehlen fortgesetzt werden. Die Artefaktstruktur ist kompatibel.

---

## Fehlerbehebung

### "Change not found"

Der Befehl konnte nicht ermitteln, an welcher Änderung gearbeitet werden soll.

**Lösungen:**
- Geben Sie den Änderungsnamen explizit an: `/opsx:apply add-dark-mode`
- Überprüfen Sie, ob der Änderungsordner existiert: `openspec list`
- Stellen Sie sicher, dass Sie sich im richtigen Projektverzeichnis befinden

### "No artifacts ready"

Alle Artefakte sind entweder abgeschlossen oder durch fehlende Abhängigkeiten blockiert.

**Lösungen:**
- Führen Sie `openspec status --change <name>` aus, um zu sehen, was blockiert
- Prüfen Sie, ob die erforderlichen Artefakte vorhanden sind
- Erstellen Sie zuerst die fehlenden Abhängigkeitsartefakte

### "Schema not found"

Das angegebene Schema existiert nicht.

**Lösungen:**
- Listen Sie verfügbare Schemata auf: `openspec schemas`
- Überprüfen Sie die Schreibweise des Schemanamens
- Erstellen Sie das Schema, falls es benutzerdefiniert ist: `openspec schema init <name>`

### Befehle werden nicht erkannt

Das KI-Tool erkennt OpenSpec-Befehle nicht.

**Lösungen:**
- Stellen Sie sicher, dass OpenSpec initialisiert ist: `openspec init`
- Generieren Sie Skills neu: `openspec update`
- Überprüfen Sie, ob das Verzeichnis `.claude/skills/` existiert (für Claude Code)
- Starten Sie Ihr KI-Tool neu, um neue Skills zu laden

### Artefakte werden nicht korrekt generiert

Die KI erstellt unvollständige oder falsche Artefakte.

**Lösungen:**
- Fügen Sie Projektkontext in `openspec/config.yaml` hinzu
- Fügen Sie regelbasierte Artefaktanweisungen für spezifische Leitlinien hinzu
- Geben Sie mehr Details in Ihrer Änderungsbeschreibung an
- Verwenden Sie `/opsx:continue` statt `/opsx:ff` für mehr Kontrolle

---

## Nächste Schritte

- [Workflows](workflows.md) - Gängige Muster und wann jeder Befehl verwendet wird
- [CLI](cli.md) - Terminalbefehle für Verwaltung und Validierung
- [Anpassung](customization.md) - Erstellen Sie benutzerdefinierte Schemata und Workflows