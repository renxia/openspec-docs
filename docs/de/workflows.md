# Workflows

Dieser Leitfaden behandelt gängige Workflow-Muster für OpenSpec und den Einsatzbereich jedes einzelnen. Für die grundlegende Einrichtung siehe [Erste Schritte](getting-started.md). Für die Befehlsreferenz siehe [Befehle](commands.md).

## Philosophie: Aktionen, nicht Phasen

Traditionelle Workflows zwingen Sie durch Phasen: Planung, dann Implementierung, dann Fertig. Aber echte Arbeit fügt sich nicht sauber in Schachteln.

OPSX verfolgt einen anderen Ansatz:

```text
Traditional (phase-locked):

  PLANNING ────────► IMPLEMENTING ────────► DONE
      │                    │
      │   "Can't go back"  │
      └────────────────────┘

OPSX (fluid actions):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Schlüsselprinzipien:**

- **Aktionen, nicht Phasen** – Befehle sind Dinge, die Sie tun können, keine Phasen, in denen Sie feststecken
- **Abhängigkeiten sind Ermöglicher** – Sie zeigen, was möglich ist, nicht was als nächstes erforderlich ist

> **Anpassung:** OPSX-Workflows werden durch Schemas gesteuert, die Artefaktsequenzen definieren. Details zur Erstellung benutzerdefinierter Schemas finden Sie unter [Anpassung](customization.md).

## Zwei Modi

### Standard-Schnellpfad (`core`-Profil)

Neuinstallationen verwenden standardmäßig `core`, welches Folgendes bietet:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Typischer Ablauf:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

### Erweiterter/Vollständiger Workflow (benutzerdefinierte Auswahl)

Wenn Sie explizite Scaffold- und Build-Befehle (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`) benötigen, aktivieren Sie diese mit:

```bash
openspec config profile
openspec update
```

## Workflow-Muster (Erweiterter Modus)

### Schnelles Feature

Wenn Sie wissen, was Sie bauen wollen, und nur die Ausführung benötigen:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Beispielgespräch:**

```text
Sie: /opsx:new add-logout-button

KI:  Erstellt openspec/changes/add-logout-button/
     Bereit zur Erstellung: proposal

Sie: /opsx:ff

KI:  Erstelle alle Planungsartefakte...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Bereit zur Implementierung!

Sie: /opsx:apply

KI:  Arbeite Aufgaben ab...
     ✓ Abmelde-Button zur Kopfzeile hinzugefügt
     ✓ Sitzungslöschung implementiert
     ✓ Bestätigungsdialog hinzugefügt
     Alle Aufgaben abgeschlossen!

Sie: /opsx:archive

KI:  ✓ Spezifikationen zusammengeführt
     ✓ Änderung archiviert
```

**Am besten geeignet für:** Kleine bis mittlere Features, Bugfixes, unkomplizierte Änderungen.

### Explorativ

Wenn die Anforderungen unklar sind oder Sie zuerst untersuchen müssen:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Beispielgespräch:**

```text
Sie: /opsx:explore

KI:  Was möchten Sie erkunden?

Sie: Ich möchte die Seitenladeleistung verbessern, bin mir aber nicht sicher,
     wo die Engpässe liegen.

KI:  Lassen Sie mich bei der Untersuchung helfen...
     [Analysiert Bundle-Größen, identifiziert langsame Abfragen, überprüft
     Komponenten-Render-Muster]

     Ich habe drei Hauptengpässe gefunden:
     1. Große, nicht optimierte Bilder
     2. Synchrone Datenabfrage in ProductList
     3. Neu-Renderings durch Kontextänderungen

     Welchen möchten Sie zuerst angehen?

Sie: Lassen Sie uns das Problem mit der Datenabfrage angehen.

Sie: /opsx:new optimize-product-list-fetching

KI:  Änderung erstellt. Bereit zur Erstellung: proposal

Sie: /opsx:continue

KI:  Erstelle Proposal basierend auf unserer Erkundung...
     [Schreibt Proposal unter Einbeziehung der Untersuchungsergebnisse]

     Bereit zur Erstellung: specs, design
     Was möchten Sie als Nächstes?

Sie: /opsx:continue

KI:  Erstelle Spezifikationen...
```

**Am besten geeignet für:** Leistungsoptimierung, Debugging, Architekturentscheidungen, unklare Anforderungen.

### Parallele Änderungen

An mehreren Änderungen gleichzeitig arbeiten:

```text
Änderung A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in Bearbeitung)
                                         │
                                    Kontextwechsel
                                         │
Änderung B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Beispielgespräch:**

```text
Sie: Ich arbeite an add-dark-mode, wurde aber in einen Bugfix gezogen.

Sie: /opsx:new fix-login-redirect

KI:  Erstellt openspec/changes/fix-login-redirect/

Sie: /opsx:ff

KI:  ✓ Planungsartefakte erstellt

Sie: /opsx:apply

KI:  Arbeite an fix-login-redirect...
     [Implementiert den Fix]
     Alle Aufgaben abgeschlossen!

Sie: /opsx:archive

KI:  ✓ fix-login-redirect archiviert

Sie: Lassen Sie uns zum Dark Mode zurückkehren.

Sie: /opsx:apply add-dark-mode

KI:  Setze add-dark-mode fort...
     Setze bei Aufgabe 2.3 fort: Header aktualisieren...
```

**Am besten geeignet für:** Parallele Arbeitsströme, dringende Unterbrechungen, Teamzusammenarbeit.

Wenn Sie mehrere abgeschlossene Änderungen haben, verwenden Sie `/opsx:bulk-archive`:

```text
Sie: /opsx:bulk-archive

KI:  3 abgeschlossene Änderungen gefunden:
     - add-dark-mode (alle Aufgaben erledigt)
     - fix-login-redirect (alle Aufgaben erledigt)
     - update-footer (alle Aufgaben erledigt)

     Prüfe auf Spezifikationskonflikte...
     ⚠ add-dark-mode und update-footer betreffen beide specs/ui/

     Überprüfe Codebasis zur Lösung...
     Beide Änderungen sind implementiert. Werden in chronologischer Reihenfolge angewendet.

     Alle 3 Änderungen archivieren?

Sie: Ja

KI:  ✓ add-dark-mode archiviert
     ✓ fix-login-redirect archiviert
     ✓ update-footer archiviert
     Spezifikationen in Reihenfolge zusammengeführt: add-dark-mode → update-footer
```

Bulk-Archive erkennt, wenn mehrere Änderungen dieselben Spezifikationen betreffen, und löst Konflikte, indem überprüft wird, was tatsächlich implementiert ist.

### Abschluss einer Änderung

Der empfohlene Abschlussablauf:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              validiert          fordert zur Synchronisation
              Implementierung    auf, falls nötig
```

#### Verify: Überprüfen Sie Ihre Arbeit

`/opsx:verify` validiert die Implementierung anhand Ihrer Artefakte in drei Dimensionen:

```text
Sie: /opsx:verify

KI:  Verifiziere add-auth...

     VOLLSTÄNDIGKEIT
     ✓ Alle 12 Aufgaben in tasks.md sind abgehakt
     ✓ Alle Anforderungen in Spezifikationen haben entsprechenden Code
     ⚠ Szenario "Sitzungszeitlimit nach Inaktivität" nicht getestet

     KORREKTHEIT
     ✓ Implementierung entspricht der Spezifikationsabsicht
     ✓ Randfälle aus Szenarien werden behandelt
     ✓ Fehlerzustände entsprechen den Spezifikationsdefinitionen

     KOHÄRENZ
     ✓ Entwurfsentscheidungen spiegeln sich in der Codestruktur wider
     ✓ Namenskonventionen sind konsistent mit design.md
     ⚠ Entwurf erwähnt "event-driven", aber Implementierung verwendet Polling

     ZUSAMMENFASSUNG
     ─────────────────────────────
     Kritische Probleme: 0
     Warnungen: 2
     Bereit zum Archivieren: Ja (mit Warnungen)

     Empfehlungen:
     1. Test für Sitzungszeitlimit-Szenario hinzufügen
     2. Erwägen Sie eine Umstrukturierung zu event-driven wie entworfen, oder aktualisieren Sie design.md
```

**Was Verify prüft:**

| Dimension | Was validiert wird |
|-----------|-------------------|
| Vollständigkeit | Alle Aufgaben erledigt, alle Anforderungen implementiert, Szenarien abgedeckt |
| Korrektheit | Implementierung entspricht der Spezifikationsabsicht, Randfälle behandelt |
| Kohärenz | Entwurfsentscheidungen im Code widergespiegelt, Muster konsistent |

Verify blockiert das Archivieren nicht, zeigt aber Probleme auf, die Sie möglicherweise zuerst beheben möchten.

#### Archive: Die Änderung abschließen

`/opsx:archive` schließt die Änderung ab und verschiebt sie in das Archiv:

```text
Sie: /opsx:archive

KI:  Archiviere add-auth...

     Artefaktstatus:
     ✓ proposal.md vorhanden
     ✓ specs/ vorhanden
     ✓ design.md vorhanden
     ✓ tasks.md vorhanden (12/12 Aufgaben abgeschlossen)

     Delta-Spezifikationen: Noch nicht mit main synchronisiert
     → Möchten Sie jetzt synchronisieren?

Sie: Ja

KI:  ✓ Spezifikationen nach openspec/specs/auth/spec.md synchronisiert
     ✓ Verschoben nach openspec/changes/archive/2025-01-24-add-auth/

     Änderung erfolgreich archiviert.
```

Archive fragt nach, wenn Spezifikationen nicht synchronisiert sind. Es blockiert nicht bei unvollständigen Aufgaben, warnt aber.

## Wann was verwenden

### `/opsx:ff` vs `/opsx:continue`

| Situation | Verwenden |
|-----------|-----------|
| Klare Anforderungen, bereit zum Bauen | `/opsx:ff` |
| Erkunden, jeden Schritt überprüfen wollen | `/opsx:continue` |
| Proposal vor Spezifikationen iterieren wollen | `/opsx:continue` |
| Zeitdruck, schnell vorankommen müssen | `/opsx:ff` |
| Komplexe Änderung, Kontrolle behalten wollen | `/opsx:continue` |

**Faustregel:** Wenn Sie den gesamten Umfang im Voraus beschreiben können, verwenden Sie `/opsx:ff`. Wenn Sie es während der Arbeit herausfinden, verwenden Sie `/opsx:continue`.

### Wann aktualisieren vs. neu beginnen

Eine häufige Frage: Wann ist es in Ordnung, eine bestehende Änderung zu aktualisieren, und wann sollten Sie eine neue beginnen?

**Aktualisieren Sie die bestehende Änderung, wenn:**

- Gleiche Absicht, verfeinerte Ausführung
- Umfang verengt sich (zuerst MVP, Rest später)
- Lerngetriebene Korrekturen (Codebasis ist nicht wie erwartet)
- Entwurfsanpassungen basierend auf Implementierungserkenntnissen

**Beginnen Sie eine neue Änderung, wenn:**

- Die Absicht sich grundlegend geändert hat
- Der Umfang zu völlig anderer Arbeit explodiert ist
- Die ursprüngliche Änderung eigenständig als "erledigt" markiert werden kann
- Patches mehr verwirren als klären

```text
                     ┌─────────────────────────────────────┐
                     │     Ist dies dieselbe Arbeit?       │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Gleiche Absicht?   >50% Überlappung?   Kann Original
          Gleiches Problem?  Gleicher Umfang?    ohne diese Änderungen
                 │                  │          "erledigt" sein?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      JA                NEIN JA          NEIN NEIN            JA
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    AKTUALISIEREN      NEU AKTUALISIEREN NEU AKTUALISIEREN   NEU
```

**Beispiel: "Dark Mode hinzufügen"**

- "Muss auch benutzerdefinierte Themes unterstützen" → Neue Änderung (Umfang explodiert)
- "Systempräferenzerkennung ist schwieriger als erwartet" → Aktualisierung (gleiche Absicht)
- "Lassen Sie uns zuerst den Toggle ausliefern, Präferenzen später hinzufügen" → Aktualisierung, dann archivieren, dann neue Änderung

## Best Practices

### Änderungen fokussiert halten

Eine logische Arbeitseinheit pro Änderung. Wenn Sie "Feature X hinzufügen und auch Y umstrukturieren", erwägen Sie zwei separate Änderungen.

**Warum es wichtig ist:**
- Einfacher zu überprüfen und zu verstehen
- Sauberere Archivhistorie
- Kann unabhängig ausgeliefert werden
- Einfacheres Rollback bei Bedarf

### Verwenden Sie `/opsx:explore` für unklare Anforderungen

Bevor Sie sich auf eine Änderung festlegen, erkunden Sie den Problembereich:

```text
Sie: /opsx:explore

KI:  Was möchten Sie erkunden?

Sie: Wie sollten wir Rate Limiting für unsere API handhaben?

KI:  Lassen Sie mich Ihre aktuelle Einrichtung und Optionen untersuchen...
     [Recherchiert Codebasis, betrachtet Muster]

     Ich sehe drei Ansätze, die wir verfolgen könnten:
     1. Middleware-basiert (einfach, pro Endpunkt)
     2. Redis-unterstützt (skalierbar, geteilter Zustand)
     3. Token-Bucket pro Benutzer (fair, komplex)

     Ihr aktueller Stack deutet auf #1 oder #2 hin. Wie groß ist Ihr Umfang?
```

Erkundung klärt das Denken, bevor Sie Artefakte erstellen.

### Vor dem Archivieren verifizieren

Verwenden Sie `/opsx:verify`, um zu prüfen, ob die Implementierung den Artefakten entspricht:

```text
Sie: /opsx:verify

KI:  Verifiziere add-dark-mode...

     ✓ Alle Aufgaben in tasks.md sind abgehakt
     ✓ Anforderungen in Spezifikationen haben entsprechenden Code
     ✓ Entwurfsentscheidungen sind in der Implementierung widergespiegelt

     Bereit zum Archivieren!
```

Erkennt Diskrepanzen, bevor Sie die Änderung abschließen.

### Änderungen klar benennen

Gute Namen machen `openspec list` nützlich:

```text
Gut:                           Vermeiden:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Befehlsreferenz

Für vollständige Befehlsdetails und Optionen siehe [Befehle](commands.md).

| Befehl | Zweck | Wann verwenden |
|---------|---------|-------------|
| `/opsx:propose` | Änderung + Planungsartefakte erstellen | Schneller Standardpfad (`core`-Profil) |
| `/opsx:explore` | Ideen durchdenken | Unklare Anforderungen, Untersuchung |
| `/opsx:new` | Ein Änderungsgerüst starten | Erweiterter Modus, explizite Artefaktsteuerung |
| `/opsx:continue` | Nächstes Artefakt erstellen | Erweiterter Modus, schrittweise Artefakterstellung |
| `/opsx:ff` | Alle Planungsartefakte erstellen | Erweiterter Modus, klarer Umfang |
| `/opsx:apply` | Aufgaben implementieren | Bereit zum Schreiben von Code |
| `/opsx:verify` | Implementierung validieren | Erweiterter Modus, vor dem Archivieren |
| `/opsx:sync` | Delta-Spezifikationen zusammenführen | Erweiterter Modus, optional |
| `/opsx:archive` | Die Änderung abschließen | Alle Arbeiten abgeschlossen |
| `/opsx:bulk-archive` | Mehrere Änderungen archivieren | Erweiterter Modus, parallele Arbeit |

## Nächste Schritte

- [Befehle](commands.md) - Vollständige Befehlsreferenz mit Optionen
- [Konzepte](concepts.md) - Tiefgehende Informationen zu Spezifikationen, Artefakten und Schemas
- [Anpassung](customization.md) - Benutzerdefinierte Workflows erstellen