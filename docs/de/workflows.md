# Workflows

Dieser Leitfaden behandelt gängige Workflow-Muster für OpenSpec und wann jedes einzelne verwendet wird. Für die grundlegende Einrichtung siehe [Erste Schritte](getting-started.md). Für eine Befehlsübersicht siehe [Befehle](commands.md).

## Philosophie: Aktionen, keine Phasen

Traditionelle Workflows zwingen Sie durch Phasen: Planung, dann Umsetzung, dann Fertig. Aber reale Arbeit passt nicht so sauber in Schubladen.

OPSX verfolgt einen anderen Ansatz:

```text
Traditionell (phasenverriegelt):

  PLANUNG ────────► UMSETZUNG ────────► FERTIG
      │                    │
      │   "Kein Zurück"    │
      └────────────────────┘

OPSX (flüssige Aktionen):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Wesentliche Prinzipien:**

- **Aktionen, keine Phasen** - Befehle sind Dinge, die Sie tun können, nicht Stadien, in denen Sie feststecken.
- **Abhängigkeiten sind Ermöglicher** - Sie zeigen, was möglich ist, nicht, was als Nächstes erforderlich ist.

> **Anpassung:** OPSX-Workflows werden durch Schemas angetrieben, die Artefaktsequenzen definieren. Details zur Erstellung benutzerdefinierter Schemas finden Sie unter [Anpassung](customization.md).

## Zwei Modi

### Standard-Schnellweg (`core`-Profil)

Neue Installationen verwenden standardmäßig `core`, das Folgendes bietet:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:archive`

Typischer Ablauf:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:archive
```

### Erweiterter/Vollständiger Workflow (benutzerdefinierte Auswahl)

Wenn Sie explizite Erstellungs- und Aufbau-Befehle (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`) verwenden möchten, aktivieren Sie diese mit:

```bash
openspec config profile
openspec update
```

## Workflow-Muster (Erweiterter Modus)

### Schnelle Funktion

Wenn Sie wissen, was Sie bauen möchten, und nur ausführen müssen:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Beispielgespräch:**

```text
You: /opsx:new add-logout-button

AI:  Created openspec/changes/add-logout-button/
     Ready to create: proposal

You: /opsx:ff

AI:  Creating all planning artifacts...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Ready for implementation!

You: /opsx:apply

AI:  Working through tasks...
     ✓ Added logout button to header
     ✓ Implemented session clearing
     ✓ Added confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  ✓ Merged specs
     ✓ Archived change
```

**Am besten geeignet für:** Kleine bis mittlere Funktionen, Fehlerbehebungen, unkomplizierte Änderungen.

### Explorativ

Wenn Anforderungen unklar sind oder Sie zuerst untersuchen müssen:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Beispielgespräch:**

```text
You: /opsx:explore

AI:  What would you like to explore?

You: I want to improve page load performance but I'm not sure
     where the bottlenecks are.

AI:  Let me help investigate...
     [Analyzes bundle sizes, identifies slow queries, reviews
     component render patterns]

     I found three main bottlenecks:
     1. Large unoptimized images
     2. Synchronous data fetching in ProductList
     3. Re-renders from context changes

     Which would you like to address first?

You: Let's tackle the data fetching issue.

You: /opsx:new optimize-product-list-fetching

AI:  Created change. Ready to create: proposal

You: /opsx:continue

AI:  Creating proposal based on our exploration...
     [Writes proposal incorporating investigation insights]

     Ready to create: specs, design
     Which would you like next?

You: /opsx:continue

AI:  Creating specs...
```

**Am besten geeignet für:** Leistungsoptimierung, Debugging, Architekturentscheidungen, unklare Anforderungen.

### Parallele Änderungen

Arbeiten Sie an mehreren Änderungen gleichzeitig:

```text
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in progress)
                                         │
                                    context switch
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Beispielgespräch:**

```text
You: I'm working on add-dark-mode but got pulled into a bug fix

You: /opsx:new fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/

You: /opsx:ff

AI:  ✓ Created planning artifacts

You: /opsx:apply

AI:  Working on fix-login-redirect...
     [Implements the fix]
     All tasks complete!

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect

You: Let's get back to dark mode

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode...
     Picking up at task 2.3: Update Header...
```

**Am besten geeignet für:** Parallele Arbeitsströme, dringende Unterbrechungen, Teamzusammenarbeit.

Wenn Sie mehrere abgeschlossene Änderungen haben, verwenden Sie `/opsx:bulk-archive`:

```text
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (all tasks done)
     - fix-login-redirect (all tasks done)
     - update-footer (all tasks done)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will apply in chronological order.

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-redirect
     ✓ Archived update-footer
     Specs merged in order: add-dark-mode → update-footer
```

Die Massenarchivierung erkennt, wenn mehrere Änderungen dieselben Spezifikationen betreffen, und löst Konflikte, indem überprüft wird, was tatsächlich implementiert ist.

### Abschluss einer Änderung

Der empfohlene Abschlussfluss:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              validates          prompts to sync
              implementation     if needed
```

#### Verify: Überprüfen Sie Ihre Arbeit

`/opsx:verify` validiert die Implementierung anhand Ihrer Artefakte in drei Dimensionen:

```text
You: /opsx:verify

AI:  Verifying add-auth...

     COMPLETENESS
     ✓ All 12 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Session timeout after inactivity" not tested

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "event-driven" but implementation uses polling

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for session timeout scenario
     2. Consider refactoring to event-driven as designed, or update design.md
```

**Was verify überprüft:**

| Dimension | Was es validiert |
|-----------|------------------|
| Vollständigkeit | Alle Aufgaben erledigt, alle Anforderungen implementiert, Szenarien abgedeckt |
| Korrektheit | Implementierung entspricht Spezifikationsabsicht, Grenzfälle behandelt |
| Kohärenz | Designentscheidungen in Code widergespiegelt, Muster konsistent |

Verify blockiert die Archivierung nicht, zeigt jedoch Probleme auf, die Sie möglicherweise zuerst beheben möchten.

#### Archive: Die Änderung abschließen

`/opsx:archive` schließt die Änderung ab und verschiebt sie in das Archiv:

```text
You: /opsx:archive

AI:  Archiving add-auth...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (12/12 tasks complete)

     Delta specs: Not yet synced to main
     → Would you like to sync now?

You: Yes

AI:  ✓ Synced specs to openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-auth/

     Change archived successfully.
```

Archive fordert auf, wenn Spezifikationen nicht synchronisiert sind. Es blockiert nicht bei unvollständigen Aufgaben, warnt Sie jedoch.

## Wann verwenden Sie was

### `/opsx:ff` vs `/opsx:continue`

| Situation | Verwenden Sie |
|-----------|---------------|
| Klare Anforderungen, bereit zum Bauen | `/opsx:ff` |
| Explorieren, jeden Schritt überprüfen wollen | `/opsx:continue` |
| Vorschlag vor Spezifikationen iterieren wollen | `/opsx:continue` |
| Zeitdruck, schnell vorankommen müssen | `/opsx:ff` |
| Komplexe Änderung, Kontrolle wünschen | `/opsx:continue`

**Faustregel:** Wenn Sie den gesamten Umfang im Voraus beschreiben können, verwenden Sie `/opsx:ff`. Wenn Sie ihn unterwegs herausfinden, verwenden Sie `/opsx:continue`.

### Aktualisieren vs. Neu starten

Eine häufige Frage: Wann ist es in Ordnung, eine bestehende Änderung zu aktualisieren, und wann sollten Sie eine neue beginnen?

**Aktualisieren Sie die bestehende Änderung, wenn:**

- Gleicher Zweck, verfeinerte Ausführung
- Umfang verengt (zuerst MVP, Rest später)
- Lerngetriebene Korrekturen (Codebasis ist nicht wie erwartet)
- Designanpassungen basierend auf Implementierungsentdeckungen

**Starten Sie eine neue Änderung, wenn:**

- Zweck grundlegend geändert
- Umfang explodiert zu völlig anderer Arbeit
- Ursprüngliche Änderung kann eigenständig als „erledigt“ markiert werden
- Patches würden mehr verwirren als klären

```text
                     ┌─────────────────────────────────────┐
                     │     Ist dies dieselbe Arbeit?       │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Gleicher Zweck?    >50% Überlappung?   Kann ursprüngliche
          Dasselbe Problem?  Gleicher Umfang?    ohne diese Änderungen
                 │                  │             als „erledigt“ markiert werden?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      JA                NEIN JA           NEIN NEIN           JA
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    AKTUALISIEREN    NEU  AKTUALISIEREN NEU  AKTUALISIEREN   NEU
```

**Beispiel: „Dark Mode hinzufügen“**

- „Muss auch benutzerdefinierte Themes unterstützen“ → Neue Änderung (Umfang explodiert)
- „Systempräferenzerkennung ist schwieriger als erwartet“ → Aktualisieren (gleicher Zweck)
- „Schalten wir zuerst den Toggle um, fügen später Präferenzen hinzu“ → Aktualisieren, dann archivieren, dann neue Änderung

## Best Practices

### Halten Sie Änderungen fokussiert

Eine logische Arbeitseinheit pro Änderung. Wenn Sie „Funktion X hinzufügen und auch Y refaktorisieren“ machen, erwägen Sie zwei separate Änderungen.

**Warum das wichtig ist:**
- Leichter zu überprüfen und zu verstehen
- Sauberere Archivhistorie
- Kann unabhängig ausgeliefert werden
- Einfacheres Rollback bei Bedarf

### Verwenden Sie `/opsx:explore` für unklare Anforderungen

Bevor Sie sich auf eine Änderung festlegen, erkunden Sie den Problembereich:

```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle rate limiting for our API?

AI:  Let me investigate your current setup and options...
     [Researches codebase, considers patterns]

     I see three approaches we could take:
     1. Middleware-based (simple, per-endpoint)
     2. Redis-backed (scalable, shared state)
     3. Token bucket per user (fair, complex)

     Your current stack suggests #1 or #2. What's your scale?
```

Exploration klärt das Denken, bevor Sie Artefakte erstellen.

### Überprüfen Sie vor der Archivierung

Verwenden Sie `/opsx:verify`, um zu prüfen, ob die Implementierung mit den Artefakten übereinstimmt:

```text
You: /opsx:verify

AI:  Verifying add-dark-mode...

     ✓ All tasks in tasks.md are checked
     ✓ Requirements in specs have corresponding code
     ✓ Design decisions are reflected in implementation

     Ready to archive!
```

Fängt Diskrepanzen ab, bevor Sie die Änderung abschließen.

### Benennen Sie Änderungen klar

Gute Namen machen `openspec list` nützlich:

```text
Gut:                             Vermeiden:
add-dark-mode                    feature-1
fix-login-redirect               update
optimize-product-query           changes
implement-2fa                    wip
```

## Befehlsübersicht

Für vollständige Befehlsdetails und Optionen siehe [Befehle](commands.md).

| Befehl | Zweck | Einsatzzeitpunkt |
|---------|---------|-------------|
| `/opsx:propose` | Änderung + Planungsartefakte erstellen | Schneller Standardpfad (`core`-Profil) |
| `/opsx:explore` | Ideen durchdenken | Unklare Anforderungen, Untersuchung |
| `/opsx:new` | Änderungssgerüst starten | Erweiterter Modus, explizite Artefaktsteuerung |
| `/opsx:continue` | Nächstes Artefakt erstellen | Erweiterter Modus, schrittweise Artefakterstellung |
| `/opsx:ff` | Alle Planungsartefakte erstellen | Erweiterter Modus, klarer Umfang |
| `/opsx:apply` | Aufgaben implementieren | Bereit zum Schreiben von Code |
| `/opsx:verify` | Implementierung validieren | Erweiterter Modus, vor Archivierung |
| `/opsx:sync` | Deltaspezifikationen zusammenführen | Erweiterter Modus, optional |
| `/opsx:archive` | Änderung abschließen | Alle Arbeiten abgeschlossen |
| `/opsx:bulk-archive` | Mehrere Änderungen archivieren | Erweiterter Modus, parallele Arbeit |

## Nächste Schritte

- [Befehle](commands.md) - Vollständige Befehlsreferenz mit Optionen
- [Konzepte](concepts.md) - Tiefgehende Erklärung zu Spezifikationen, Artefakten und Schemas
- [Anpassung](customization.md) - Eigene Workflows erstellen