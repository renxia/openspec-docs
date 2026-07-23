# Befehle

Dies ist die Referenz für die Schrägstrichbefehle von OpenSpec. Diese Befehle werden in der Chat-Oberfläche deines KI-Coding-Assistenten aufgerufen (z. B. Claude Code, Cursor, Windsurf).

Für Workflow-Muster und Informationen zur Verwendung der einzelnen Befehle siehe [Workflows](workflows.md). Für CLI-Befehle siehe [CLI](cli.md).

## Schnellreferenz

### Standard-Schnellpfad (`core`-Profil)

| Befehl | Zweck |
|---------|---------|
| `/opsx:propose` | Erstelle eine Änderung und generiere Planungsartefakte in einem Schritt |
| `/opsx:explore` | Gehe Ideen durch, bevor du dich zu einer Änderung verpflichtest |
| `/opsx:apply` | Implementiere Aufgaben aus der Änderung |
| `/opsx:update` | Überarbeite die Planungsartefakte einer Änderung und halte sie konsistent |
| `/opsx:sync` | Führe Delta-Spezifikationen in Hauptspezifikationen zusammen |
| `/opsx:archive` | Archiviere eine abgeschlossene Änderung |

### Erweiterte Workflow-Befehle (Auswahl benutzerdefinierter Workflows)

| Befehl | Zweck |
|---------|---------|
| `/opsx:new` | Starte ein neues Änderungsgerüst |
| `/opsx:continue` | Erstelle das nächste Artefakt basierend auf Abhängigkeiten |
| `/opsx:ff` | Fast-Forward: Erstelle alle Planungsartefakte auf einmal |
| `/opsx:verify` | Validiere, dass die Implementierung mit den Artefakten übereinstimmt |
| `/opsx:bulk-archive` | Archiviere mehrere Änderungen auf einmal |
| `/opsx:onboard` | Geführtes Tutorial durch den vollständigen Workflow |

Das standardmäßige globale Profil ist `core`. Um die erweiterten Workflow-Befehle zu aktivieren, führe `openspec config profile` aus, wähle Workflows aus und führe anschließend `openspec update` in deinem Projekt aus.

## Befehlsreferenz

### `/opsx:propose`

Erstelle eine neue Änderung und generiere Planungsartefakte in einem Schritt. Dies ist der Standardstartbefehl im `core`-Profil.

**Syntax:**
```text
/opsx:propose [change-name-or-description]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `change-name-or-description` | Nein | Kebab-Case-Name oder verständliche Beschreibung in einfacher Sprache |

**Was es tut:**
- Erstellt `openspec/changes/<change-name>/`
- Generiert Artefakte, die vor der Implementierung benötigt werden (für `spec-driven`: Vorschlag, Spezifikationen, Entwurf, Aufgaben)
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
- Verwende dies für den schnellsten End-to-End-Pfad
- Wenn du schrittweise Artefaktkontrolle möchtest, aktiviere erweiterte Workflows und verwende `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **Starte hier, wenn du unsicher bist.** Explore ist ein risikofreier Denkpartner: Es liest deine Codebasis, vergleicht Optionen und schärft eine vage Idee zu einem konkreten Plan, bevor eine Änderung existiert. Es ist im Standardprofil enthalten. Für den vollständigen Anwendungsfall und weitere Beispiele siehe den [Explore First](explore.md)-Leitfaden.

Durchdenke Ideen, untersuche Probleme und kläre Anforderungen, bevor du dich auf eine Änderung festlegst.

**Syntax:**
```
/opsx:explore [topic]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `topic` | Nein | Was du erkunden oder untersuchen möchtest |

**Was es tut:**
- Öffnet ein exploratives Gespräch ohne erforderliche Struktur
- Untersucht die Codebasis, um Fragen zu beantworten
- Vergleicht Optionen und Ansätze
- Erstellt visuelle Diagramme zur Verdeutlichung des Denkens
- Kann zu `/opsx:propose` (Standard) oder `/opsx:new` (erweiterter Workflow) übergehen, wenn sich die Erkenntnisse verdichten

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
- Verwende dies, wenn Anforderungen unklar sind oder du etwas untersuchen musst
- Während der Erkundung werden keine Artefakte erstellt
- Gut zum Vergleichen mehrerer Ansätze vor der Entscheidung
- Kann Dateien lesen und die Codebasis durchsuchen

---

### `/opsx:new`

Erstelle ein neues Gerüst für eine Änderung. Erstellt den Änderungsordner und wartet darauf, dass du Artefakte mit `/opsx:continue` oder `/opsx:ff` generierst.

Dieser Befehl ist Teil des erweiterten Workflow-Sets (nicht im Standard-`core`-Profil enthalten).

**Syntax:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `change-name` | Nein | Name für den Änderungsordner (wird abgefragt, falls nicht angegeben) |
| `--schema` | Nein | Zu verwendendes Workflow-Schema (Standard: aus Konfiguration oder `spec-driven`) |

**Was es tut:**
- Erstellt das Verzeichnis `openspec/changes/<change-name>/`
- Erstellt die Metadatendatei `.openspec.yaml` im Änderungsordner
- Zeigt die erste zur Erstellung bereite Artefaktvorlage an
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
- Verwende aussagekräftige Namen: `add-feature`, `fix-bug`, `refactor-module`
- Vermeide generische Namen wie `update`, `changes`, `wip`
- Das Schema kann auch in der Projektkonfiguration festgelegt werden (`openspec/config.yaml`)

---

### `/opsx:continue`

Erstelle das nächste Artefakt in der Abhängigkeitskette. Erstellt jeweils ein Artefakt nach dem anderen für inkrementellen Fortschritt.

**Syntax:**
```
/opsx:continue [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `change-name` | Nein | Welche Änderung fortgesetzt werden soll (wird aus dem Kontext abgeleitet, falls nicht angegeben) |

**Was es tut:**
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
- Verwende dies, wenn du jedes Artefakt vor dem Fortfahren überprüfen möchtest
- Gut für komplexe Änderungen, bei denen du Kontrolle haben möchtest
- Mehrere Artefakte können gleichzeitig bereit werden
- Du kannst erstellte Artefakte bearbeiten, bevor du fortfährst

---

### `/opsx:ff`

Schnelldurchlauf durch die Artefakterstellung. Erstellt alle Planungsartefakte auf einmal.

**Syntax:**
```
/opsx:ff [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `change-name` | Nein | Welche Änderung schnell durchlaufen werden soll (wird aus dem Kontext abgeleitet, falls nicht angegeben) |

**Was es tut:**
- Erstellt alle Artefakte in Abhängigkeitsreihenfolge
- Verfolgt den Fortschritt über eine Todo-Liste
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
- Verwende dies, wenn du ein klares Bild davon hast, was du baust
- Schneller als `/opsx:continue` für unkomplizierte Änderungen
- Du kannst Artefakte danach immer noch bearbeiten
- Gut für kleine bis mittlere Funktionen

---

### `/opsx:apply`

Implementiere Aufgaben aus der Änderung. Arbeitet sich durch die Aufgabenliste, schreibt Code und hakt Elemente ab.

**Syntax:**
```
/opsx:apply [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `change-name` | Nein | Welche Änderung implementiert werden soll (wird aus dem Kontext abgeleitet, falls nicht angegeben) |

**Was es tut:**
- Liest `tasks.md` und identifiziert unvollständige Aufgaben
- Arbeitet sich Aufgabe für Aufgabe durch
- Schreibt Code, erstellt Dateien, führt Tests nach Bedarf aus
- Markiert Aufgaben mit Checkboxen `[x]` als abgeschlossen

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
- Kann unterbrochene Arbeit an der Stelle wieder aufnehmen, an der du aufgehört hast
- Verwende dies für parallele Änderungen durch Angabe des Änderungsnamens
- Der Fertigstellungsstatus wird in den Checkboxen von `tasks.md` verfolgt

---

### `/opsx:update`

Überarbeite vorhandene Planungsartefakte einer Änderung und halte sie untereinander kohärent. Nur Planungsartefakte – es bearbeitet niemals Code.

**Syntax:**

```text
/opsx:update [change-name]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `change-name` | Nein | Welche Änderung aktualisiert werden soll (wird aus dem Kontext abgeleitet, falls nicht angegeben) |

**Was es tut:**

- Liest die Artefakte der Änderung über `openspec status --change <name> --json`
- Wendet deine angeforderte Überarbeitung an oder prüft die Artefakte auf Widersprüche, falls du keine benannt hast
- Stimmt die anderen vorhandenen Artefakte in beliebiger Richtung ab (eine Entwurfsänderung kann bis zum Vorschlag zurückwirken)
- Bestätigt jede Bearbeitung mit dir, bevor sie geschrieben wird, jeweils ein Artefakt nach dem anderen
- Endet mit einer Empfehlung für den nächsten Schritt: `/opsx:continue` (Artefakte fehlen), `/opsx:apply` (einen überarbeiteten Plan in Code umsetzen) oder `/opsx:archive` (alles erledigt)

**Beispiel:**

```text
You: /opsx:update add-dark-mode - we're storing the theme in a cookie now, not localStorage

AI:  Reading add-dark-mode artifacts...

     The design references localStorage in two places; tasks 1.3 covers
     localStorage persistence; the proposal doesn't mention storage.

     Proposed revisions:
     1. design.md - swap localStorage decision for cookie storage
     2. tasks.md - reword task 1.3 to cookie persistence

     Apply revision 1? (design.md)
```

**Tipps:**

- Es erstellt keine fehlenden Artefakte – das ist `/opsx:continue`
- Wenn die Änderung bereits implementiert wurde, folge mit `/opsx:apply`, damit der Code dem überarbeiteten Plan entspricht
- Wenn deine Überarbeitung die *Absicht* der Änderung ändert, fange stattdessen neu mit einer neuen Änderung an (siehe [When to Update vs. Start Fresh](opsx.md#when-to-update-vs-start-fresh))

---

### `/opsx:verify`

Validiere, dass die Implementierung mit deinen Änderungsartefakten übereinstimmt. Prüft Vollständigkeit, Korrektheit und Kohärenz.

**Syntax:**
```
/opsx:verify [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `change-name` | Nein | Welche Änderung verifiziert werden soll (wird aus dem Kontext abgeleitet, falls nicht angegeben) |

**Was es tut:**
- Prüft drei Dimensionen der Implementierungsqualität
- Durchsucht die Codebasis nach Implementierungsnachweisen
- Meldet Probleme, kategorisiert als CRITICAL, WARNING oder SUGGESTION
- Blockiert das Archivieren nicht, sondern macht Probleme sichtbar

**Verifikationsdimensionen:**

| Dimension | Was wird validiert |
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
- Führe dies vor dem Archivieren aus, um Abweichungen frühzeitig zu erkennen
- Warnungen blockieren das Archivieren nicht, weisen aber auf potenzielle Probleme hin
- Gut zur Überprüfung der Arbeit von KI, bevor du committest
- Kann Abweichungen zwischen Artefakten und Implementierung aufdecken

---

### `/opsx:sync`

**Optionaler Befehl.** Führe Delta-Spezifikationen aus einer Änderung in die Hauptspezifikationen zusammen. Das Archivieren fragt nach der Synchronisierung, falls benötigt, also musst du dies normalerweise nicht manuell ausführen.

**Syntax:**
```
/opsx:sync [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `change-name` | Nein | Welche Änderung synchronisiert werden soll (wird aus dem Kontext abgeleitet, falls nicht angegeben) |

**Was es tut:**
- Liest Delta-Spezifikationen aus dem Änderungsordner
- Analysiert ADDED/MODIFIED/REMOVED/RENAMED-Abschnitte
- Führt Änderungen in das Hauptverzeichnis `openspec/specs/` zusammen
- Erhält vorhandene Inhalte, die nicht in den Delta-Spezifikationen erwähnt werden
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

**Wann es manuell verwendet werden soll:**

| Szenario | Synchronisierung verwenden? |
|----------|---------------------------|
| Lang laufende Änderung, Spezifikationen vor dem Archivieren im Hauptzweig haben wollen | Ja |
| Mehrere parallele Änderungen benötigen die aktualisierten Basisspezifikationen | Ja |
| Zusammenführung separat vorab prüfen/überprüfen wollen | Ja |
| Schnelle Änderung, geht direkt zum Archivieren | Nein (Archivieren übernimmt dies) |

**Tipps:**
- Die Synchronisierung ist intelligent, kein Copy-Paste
- Kann Szenarien zu vorhandenen Anforderungen hinzufügen, ohne Duplikate zu erstellen
- Die Änderung bleibt nach der Synchronisierung aktiv (nicht archiviert)
- Die meisten Benutzer müssen dies nie direkt aufrufen – das Archivieren fragt bei Bedarf nach

---

### `/opsx:archive`

Archiviere eine abgeschlossene Änderung. Schließt die Änderung ab und verschiebt sie in den Archivordner.

**Syntax:**
```
/opsx:archive [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `change-name` | Nein | Welche Änderung archiviert werden soll (wird aus dem Kontext abgeleitet, falls nicht angegeben) |

**Was es tut:**
- Prüft den Abschlussstatus der Artefakte
- Prüft den Aufgabenabschluss (warnt bei unvollständigen Aufgaben)
- Bietet an, Delta-Spezifikationen zu synchronisieren, falls noch nicht geschehen
- Verschiebt den Änderungsordner nach `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Erhält alle Artefakte zur Prüfspur

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
- Das Archivieren blockiert nicht bei unvollständigen Aufgaben, warnt aber
- Delta-Spezifikationen können während des Archivierens oder davor synchronisiert werden
- Archivierte Änderungen werden zur Historie erhalten
- Verwende zuerst `/opsx:verify`, um Probleme frühzeitig zu erkennen

---

### `/opsx:bulk-archive`

Archiviere mehrere abgeschlossene Änderungen auf einmal. Behandelt Spezifikationskonflikte zwischen Änderungen.

**Syntax:**
```
/opsx:bulk-archive [change-names...]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `change-names` | Nein | Bestimmte zu archivierende Änderungen (fragt zur Auswahl, falls nicht angegeben) |

**Was es tut:**
- Listet alle abgeschlossenen Änderungen auf
- Validiert jede Änderung vor dem Archivieren
- Erkennt Spezifikationskonflikte zwischen Änderungen
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
- Gut für parallele Arbeitsabläufe
- Die Konfliktlösung ist agentisch (prüft die Codebasis)
- Änderungen werden in der Reihenfolge ihrer Erstellung archiviert
- Fragt vor dem Überschreiben von Spezifikationsinhalten nach

---

### `/opsx:onboard`

Geführtes Onboarding durch den vollständigen OpenSpec-Workflow. Ein interaktives Tutorial unter Verwendung deiner tatsächlichen Codebasis.

**Syntax:**
```
/opsx:onboard
```

**Was es tut:**
- Geht mit Erläuterungen durch einen vollständigen Workflow-Zyklus
- Durchsucht deine Codebasis nach tatsächlichen Verbesserungsmöglichkeiten
- Erstellt eine tatsächliche Änderung mit echten Artefakten
- Implementiert tatsächliche Arbeit (kleine, sichere Änderungen)
- Archiviert die abgeschlossene Änderung
- Erläutert jeden Schritt, während er stattfindet

**Phasen:**
1. Begrüßung und Codebasis-Analyse
2. Eine Verbesserungsmöglichkeit finden
3. Eine Änderung erstellen (`/opsx:new`)
4. Den Vorschlag schreiben
5. Spezifikationen erstellen
6. Den Entwurf schreiben
7. Aufgaben erstellen
8. Aufgaben implementieren (`/opsx:apply`)
9. Implementierung verifizieren
10. Die Änderung archivieren
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
- Verwendet echten Code, keine Beispielanwendungen
- Erstellt eine echte Änderung, die du behalten oder verwerfen kannst
- Benötigt 15-30 Minuten zur Fertigstellung

## Befehlssyntax je nach KI-Tool

Verschiedene KI-Tools verwenden leicht unterschiedliche Befehlssyntax. Verwenden Sie das Format, das zu Ihrem Tool passt:

| Tool | Syntaxbeispiel |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | Skill-basierte Aufrufe wie `/openspec-propose`, `/openspec-apply-change` (keine generierten `opsx-*`-Befehlsdateien) |
| Codex | Skill-basierte Aufrufe aus `.codex/skills/openspec-*` (keine generierten `opsx-*`-Prompt-Dateien) |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi Code | Skill-basierte Aufrufe wie `/skill:openspec-propose`, `/skill:openspec-apply-change` (keine generierten `opsx-*`-Befehlsdateien) |
| Trae | `/opsx-propose`, `/opsx-apply` |

Die Funktionsweise ist bei allen Tools gleich, aber die Art und Weise, wie Befehle bereitgestellt werden, kann je nach Integration variieren.

> **Hinweis:** GitHub Copilot-Befehle (`.github/prompts/*.prompt.md`) sind nur in IDE-Erweiterungen (VS Code, JetBrains, Visual Studio) verfügbar. Die GitHub Copilot CLI unterstützt derzeit keine benutzerdefinierten Prompt-Dateien – Details und Problemumgehungen finden Sie unter [Unterstützte Tools](supported-tools.md).

---

## Legacy-Befehle

Diese Befehle verwenden den älteren „Alles-auf-einmal“-Workflow. Sie funktionieren noch, aber es werden die OPSX-Befehle empfohlen.

| Befehl | Funktion |
|--------|----------|
| `/openspec:proposal` | Alle Artefakte auf einmal erstellen (Vorschlag, Spezifikationen, Design, Aufgaben) |
| `/openspec:apply` | Die Änderung implementieren |
| `/openspec:archive` | Die Änderung archivieren |

**Wann Legacy-Befehle verwendet werden sollen:**
- Vorhandene Projekte, die den alten Workflow verwenden
- Einfache Änderungen, bei denen Sie keine schrittweise Erstellung von Artefakten benötigen
- Wenn Sie den Alles-oder-nichts-Ansatz bevorzugen

**Migration zu OPSX:**
Legacy-Änderungen können mit OPSX-Befehlen fortgesetzt werden. Die Artefaktstruktur ist kompatibel.

---

## Fehlerbehebung

### „Änderung nicht gefunden“

Der Befehl konnte nicht ermitteln, welche Änderung verarbeitet werden soll.

**Lösungen:**
- Geben Sie den Namen der Änderung explizit an: `/opsx:apply add-dark-mode`
- Prüfen Sie, ob der Änderungsordner existiert: `openspec list`
- Stellen Sie sicher, dass Sie sich im richtigen Projektverzeichnis befinden

### „Keine Artefakte bereit“

Alle Artefakte sind entweder bereits abgeschlossen oder durch fehlende Abhängigkeiten blockiert.

**Lösungen:**
- Führen Sie `openspec status --change <name>` aus, um zu sehen, was blockiert
- Prüfen Sie, ob die erforderlichen Artefakte vorhanden sind
- Erstellen Sie zuerst die fehlenden Abhängigkeitsartefakte

### „Schema nicht gefunden“

Das angegebene Schema existiert nicht.

**Lösungen:**
- Lassen Sie sich verfügbare Schemas anzeigen: `openspec schemas`
- Prüfen Sie die Schreibweise des Schemanamens
- Erstellen Sie das Schema, falls es sich um ein benutzerdefiniertes handelt: `openspec schema init <name>`

### Befehle werden nicht erkannt

Das KI-Tool erkennt die OpenSpec-Befehle nicht.

**Lösungen:**
- Stellen Sie sicher, dass OpenSpec initialisiert ist: `openspec init`
- Generieren Sie die Skills neu: `openspec update`
- Prüfen Sie, ob das Verzeichnis `.claude/skills/` existiert (für Claude Code)
- Starten Sie Ihr KI-Tool neu, damit es die neuen Skills erkennt

### Artefakte werden nicht korrekt generiert

Die KI erstellt unvollständige oder fehlerhafte Artefakte.

**Lösungen:**
- Fügen Sie Projektkontext in `openspec/config.yaml` hinzu
- Fügen Sie Regeln pro Artefakt für spezifische Anleitungen hinzu
- Geben Sie mehr Details in Ihrer Änderungsbeschreibung an
- Verwenden Sie `/opsx:continue` statt `/opsx:ff` für mehr Kontrolle

---

## Nächste Schritte

- [Workflows](workflows.md) - Häufige Muster und Anwendungsfälle für die einzelnen Befehle
- [CLI](cli.md) - Terminalbefehle zur Verwaltung und Validierung
- [Anpassung](customization.md) - Erstellen Sie benutzerdefinierte Schemas und Workflows