# Workflows

Diese Anleitung behandelt gängige Workflow-Muster für OpenSpec und wann jedes davon verwendet werden sollte. Für die grundlegende Einrichtung siehe [Getting Started](getting-started.md). Für eine Befehlsreferenz siehe [Commands](commands.md).

## Philosophie: Aktionen, keine Phasen

Herkömmliche Workflows zwingen Sie durch Phasen: Planung, dann Implementierung, dann Fertigstellung. Aber echte Arbeit passt nicht sauber in vorgegebene Kästchen.

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

- **Aktionen, keine Phasen** - Befehle sind Dinge, die Sie tun können, und keine Stadien, in denen Sie feststecken.
- **Abhängigkeiten sind Ermöglicher** - Sie zeigen auf, was möglich ist, nicht darauf, was als Nächstes erforderlich ist.

> **Anpassung (Customization):** OPSX Workflows werden durch Schemata gesteuert, die die Sequenz von Artefakten definieren. Für Details zur Erstellung benutzerdefinierter Schemata siehe [Customization](customization.md).

## Zwei Modi

### Standard-Schnellpfad (`core` Profil)

Neue Installationen verwenden standardmäßig `core`, welches Folgendes bereitstellt:
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Typischer Ablauf:

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (optional)
```

#### Beginnen Sie mit der Erkundung (die Gewohnheit, die man sich aneignen sollte)

`/opsx:explore` ist Teil des Standardprofils und kein erweitertes Add-on. Es ist der Schritt, den Sie unternehmen sollten, wenn Sie ein Problem haben, aber noch keinen Plan – was bei einem KI-Assistenten meistens der Fall ist.

```text
Sie: /opsx:explore

KI:  Was möchten Sie erkunden?

Sie: Unsere Suchergebnisse fühlen sich veraltet an. Ich bin mir nicht sicher, ob es am Caching,
     am Indexing oder an der Abfrage selbst liegt.

KI:  Lassen Sie mich nachsehen... [liest den Suchdienst und die Cache-Ebene]
     Es ist der Index: Er wird nur nachts neu aufgebaut, daher erscheinen Änderungen erst
     am nächsten Tag. Zwei Optionen: Rebuild on Write (einfach, mehr Last) oder eine kurze TTL-Cache-Invalidierung (mehr bewegliche Teile, weniger Last). Da Ihr Schreibvolumen gering ist, ist Rebuild-on-Write die sauberere Lösung. Möchten Sie es eingrenzen?

Sie: Ja.

Sie: /opsx:propose rebuild-search-index-on-write
```

Erkundung erzeugt keine Artefakte und schreibt keinen Code. Es ist ein kostenloses Gespräch ohne Risiko, das eine vage Sorge in eine präzise Änderung verwandelt, sodass der folgende Vorschlag scharf ist. Wissen Sie bereits genau, was Sie wollen? Überspringen Sie diesen Schritt und gehen Sie direkt zu `/opsx:propose`. Vollständige Anleitung: [Explore First](explore.md).

### Erweiterter/Vollständiger Workflow (benutzerdefinierte Auswahl)

Wenn Sie explizite Scaffold-und-Build-Befehle (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`) wünschen, aktivieren Sie diese mit:

```bash
openspec config profile
openspec update
```

## Workflow-Muster (Erweiterter Modus)

### Schnelles Feature

Wenn Sie wissen, was Sie bauen möchten und nur die Ausführung benötigen:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Beispielgespräch:**

```text
Sie: /opsx:new add-logout-button

KI:  Erstellt openspec/changes/add-logout-button/
     Bereit zur Erstellung bereit: proposal

Sie: /opsx:ff

KI:  Erstellt alle Planungsartefakte...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Bereit für die Implementierung!

Sie: /opsx:apply

KI:  Arbeitet an den Aufgaben...
     ✓ Logout-Button zum Header hinzugefügt
     ✓ Session Clearing implementiert
     ✓ Bestätigungsdialog hinzugefügt
     Alle Aufgaben erledigt!

Sie: /opsx:archive

KI:  ✓ Specs gemerged
     ✓ Änderung archiviert
```

**Am besten für:** Kleine bis mittlere Features, Bugfixes, einfache Änderungen.

### Explorativ

Wenn die Anforderungen unklar sind oder Sie zuerst untersuchen müssen:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Beispielgespräch:**

```text
Sie: /opsx:explore

KI:  Was möchten Sie erkunden?

Sie: Ich möchte die Seitenladeleistung verbessern, bin mir aber nicht sicher, wo die Engpässe liegen.

KI:  Lassen Sie mich helfen zu untersuchen...
     [Analysiert Bundle-Größen, identifiziert langsame Abfragen, überprüft Komponenten-Render-Muster]

     Ich habe drei Hauptengpässe gefunden:
     1. Große, unoptimierte Bilder
     2. Synchrone Datenabfrage in ProductList
     3. Re-Renders durch Kontextänderungen

     Welches möchten Sie zuerst angehen?

Sie: Lassen Sie uns das Problem der Datenabfrage angehen.

Sie: /opsx:new optimize-product-list-fetching

KI:  Erstellt Änderung. Bereit zur Erstellung bereit: proposal

Sie: /opsx:continue

KI:  Erstellt Vorschlag basierend auf unserer Erkundung...
     [Schreibt den Vorschlag unter Einbeziehung der Untersuchungserkenntnisse]

     Bereit zur Erstellung bereit: specs, design
     Was möchten Sie als Nächstes tun?

Sie: /opsx:continue

KI:  Erstellt Specs...
```

**Am besten für:** Performance-Optimierung, Debugging, Architekturentscheidungen, unklare Anforderungen.

### Parallele Änderungen

Arbeiten Sie an mehreren Änderungen gleichzeitig:

```text
Änderung A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in Bearbeitung)
                                         │
                                    Kontextwechsel
                                         │
Änderung B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Beispielgespräch:**

```text
Sie: Ich arbeite an add-dark-mode, wurde aber in einen Bugfix hineingezogen.

Sie: /opsx:new fix-login-redirect

KI:  Erstellt openspec/changes/fix-login-redirect/

Sie: /opsx:ff

KI:  ✓ Planungsartefakte erstellt

Sie: /opsx:apply

KI:  Arbeitet an fix-login-redirect...
     [Implementiert den Fix]
     Alle Aufgaben erledigt!

Sie: /opsx:archive

KI:  ✓ fix-login-redirect archiviert

Sie: Lassen Sie uns zu dark mode zurückkehren.

Sie: /opsx:apply add-dark-mode

KI:  Setzt add-dark-mode fort...
     Beginnt bei Aufgabe 2.3: Header aktualisieren...
```

**Am besten für:** Parallele Arbeitsströme, dringende Unterbrechungen, Teamkollaboration.

Wenn Sie mehrere abgeschlossene Änderungen haben, verwenden Sie `/opsx:bulk-archive`:

```text
Sie: /opsx:bulk-archive

KI:  3 abgeschlossene Änderungen gefunden:
     - add-dark-mode (alle Aufgaben erledigt)
     - fix-login-redirect (alle Aufgaben erledigt)
     - update-footer (alle Aufgaben erledigt)

     Prüft auf Spezifikationskonflikte...
     ⚠ add-dark-mode und update-footer berühren beide specs/ui/

     Inspiziert die Codebasis zur Auflösung...
     Beide Änderungen sind implementiert. Werden in chronologischer Reihenfolge angewendet.

     Alle 3 Änderungen archivieren?

Sie: Ja

KI:  ✓ add-dark-mode archiviert
     ✓ fix-login-redirect archiviert
     ✓ update-footer archiviert
     Specs gemerged in der Reihenfolge: add-dark-mode → update-footer
```

Bulk Archive erkennt, wann mehrere Änderungen dieselben Specs berühren, und löst Konflikte auf, indem es überprüft, was tatsächlich implementiert ist.

### Abschluss einer Änderung

Der empfohlene Abschlussablauf:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              validiert          fragt nach Synchronisierung
              Implementierung     falls nötig
```

#### Verify: Überprüfen Sie Ihre Arbeit

`/opsx:verify` validiert die Implementierung anhand Ihrer Artefakte in drei Dimensionen:

```text
Sie: /opsx:verify

KI:  Überprüfung von add-auth...

     VÖLLSTÄNDIGKEIT (COMPLETENESS)
     ✓ Alle 12 Aufgaben in tasks.md sind geprüft
     ✓ Alle Anforderungen in den Specs haben entsprechenden Code
     ⚠ Szenario "Session abgelaufen nach Inaktivität" nicht getestet

     KORREKTHEIT (CORRECTNESS)
     ✓ Implementierung entspricht der Spezifikationsabsicht
     ✓ Randfälle aus den Szenarien sind behandelt
     ✓ Fehlerzustände entsprechen den Spec-Definitionen

     ZUSAMMENHANG (COHERENCE)
     ✓ Designentscheidungen spiegeln sich in der Code-Struktur wider
     ✓ Namenskonventionen stimmen mit design.md überein
     ⚠ Design erwähnt "event-driven", aber die Implementierung verwendet Polling

     ZUSAMMENFASSUNG (SUMMARY)
     ─────────────────────────────
     Kritische Probleme: 0
     Warnungen: 2
     Bereit zum Archivieren: Ja (mit Warnungen)

     Empfehlungen:
     1. Test für das Session-Timeout-Szenario hinzufügen
     2. Überlegen, ob man auf event-driven umstellt wie geplant oder design.md aktualisiert
```

**Was Verify prüft:**

| Dimension | Was es validiert |
|-----------|------------------|
| Vollständigkeit | Alle Aufgaben erledigt, alle Anforderungen implementiert, Szenarien abgedeckt |
| Korrektheit | Implementierung entspricht der Spezifikationsabsicht, Randfälle behandelt |
| Zusammenhang | Designentscheidungen spiegeln sich in der Code-Struktur wider, Muster sind konsistent |

Verify blockiert das Archivieren nicht, aber es weist auf Probleme hin, die Sie zuerst angehen möchten.

#### Archive: Abschließen der Änderung

`/opsx:archive` schließt die Änderung ab und verschiebt sie in das Archiv:

```text
Sie: /opsx:archive

KI:  Archiviert add-auth...

     Artefaktstatus:
     ✓ proposal.md existiert
     ✓ specs/ existiert
     ✓ design.md existiert
     ✓ tasks.md existiert (12/12 Aufgaben erledigt)

     Delta Specs: Noch nicht an Main synchronisiert
     → Möchten Sie jetzt synchronisieren?

Sie: Ja

KI:  ✓ Specs nach openspec/specs/auth/spec.md synchronisiert
     ✓ In openspec/changes/archive/2025-01-24-add-auth/ verschoben

     Änderung erfolgreich archiviert.
```

Archive fragt nach, wenn die Specs nicht synchronisiert sind. Es blockiert jedoch nicht bei unvollendeten Aufgaben, sondern warnt Sie.

## Wann was verwenden

### `/opsx:ff` vs `/opsx:continue`

| Situation | Verwenden |
|-----------|---------|
| Klare Anforderungen, bereit zum Bauen | `/opsx:ff` |
| Erkunden, möchte jeden Schritt überprüfen | `/opsx:continue` |
| Möchte den Vorschlag iterieren, bevor die Specs erstellt werden | `/opsx:continue` |
| Zeitdruck, muss schnell vorgehen | `/opsx:ff` |
| Komplexe Änderung, möchte Kontrolle haben | `/opsx:continue` |

**Faustregel:** Wenn Sie den gesamten Umfang im Voraus beschreiben können, verwenden Sie `/opsx:ff`. Wenn Sie es dabei herausfinden, gehen Sie mit `/opsx:continue`.

### Wann aktualisieren und wann neu starten

Eine häufige Frage: Wann ist es in Ordnung, eine bestehende Änderung zu aktualisieren, und wann sollte man eine neue beginnen?

**Aktualisieren Sie die bestehende Änderung, wenn:**

- Gleiche Absicht, verfeinerte Ausführung
- Der Umfang wird eingeschränkt (MVP zuerst, Rest später)
- Lernen-gesteuerte Korrekturen (die Codebasis ist nicht das, was Sie erwartet haben)
- Designanpassungen basierend auf Implementierungserkenntnissen

**Starten Sie eine neue Änderung, wenn:**

- Die Absicht sich grundlegend geändert hat
- Der Umfang explodiert ist und eine völlig andere Arbeit darstellt
- Die ursprüngliche Änderung als eigenständiges "erledigt" markiert werden kann
- Patches mehr verwirren als sie klären würden

```text
                     ┌─────────────────────────────────────┐
                     │     Ist dies dieselbe Arbeit?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
      Gleiche Absicht?  >50% Überlappung?   Kann die Originale
      Gleiches Problem? Gleicher Umfang?        "erledigt" sein, ohne diese Änderungen?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      JA               NEIN JA           NEIN  NEIN              JA
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    AKTUALISIEREN    NEU  AKTUALISIEREN  NEU  AKTUALISIEREN  NEU
```

**Beispiel: "Dark Mode hinzufügen"**

- "Wir müssen auch benutzerdefinierte Themen unterstützen" → Neue Änderung (Umfang explodiert)
- "Die Erkennung der Systemeinstellung ist schwieriger als erwartet" → Aktualisieren (gleiche Absicht)
- "Lassen Sie uns zuerst den Schalter liefern, die Präferenzen später hinzufügen" → Aktualisieren und dann archivieren, dann neue Änderung

## Best Practices

### Halten Sie Änderungen fokussiert

Ein logisches Arbeitseinheit pro Änderung. Wenn Sie "Feature X hinzufügen und Y refaktorieren" machen, ziehen Sie zwei separate Änderungen in Betracht.

**Warum das wichtig ist:**
- Leichter zu überprüfen und zu verstehen
- Sauberere Archivhistorie
- Kann unabhängig ausgeliefert werden
- Einfacheres Rollback bei Bedarf

### Verwenden Sie `/opsx:explore` für unklare Anforderungen

Bevor Sie sich auf eine Änderung festlegen, erkunden Sie den Problemraum:

```text
Sie: /opsx:explore

KI:  Was möchten Sie erkunden?

Sie: Wie sollten wir Ratenbegrenzung (Rate Limiting) für unsere API handhaben?

KI:  Lassen Sie mich Ihr aktuelles Setup und die Optionen untersuchen...
     [Recherchiert Codebasis, erwägt Muster]

     Ich sehe drei Ansätze, die wir verfolgen könnten:
     1. Middleware-basiert (einfach, pro Endpunkt)
     2. Redis-gestützt (skalierbar, gemeinsamer Zustand)
     3. Token Bucket pro Benutzer (fair, komplex)

     Ihr aktueller Stack deutet auf #1 oder #2 hin. Wie ist Ihr Maßstab?
```

Die Erkundung klärt das Denken, bevor Sie Artefakte erstellen.

### Überprüfen Sie vor dem Archivieren

Verwenden Sie `/opsx:verify`, um zu prüfen, ob die Implementierung mit den Artefakten übereinstimmt:

```text
Sie: /opsx:verify

KI:  Überprüfung von add-dark-mode...

     ✓ Alle Aufgaben in tasks.md sind geprüft
     ✓ Anforderungen in den Specs haben entsprechenden Code
     ✓ Designentscheidungen spiegeln sich in der Implementierung wider

     Bereit zum Archivieren!
```

Es fängt Abweichungen ab, bevor Sie die Änderung abschließen.

### Benennen Sie Änderungen klar

Gute Namen machen `openspec list` nützlich:

```text
Gut:                          Vermeiden:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Kurzübersicht der Befehle

Für vollständige Befehlsdetails und Optionen siehe [Commands](commands.md).

| Command | Zweck | Wann verwenden |
|---------|---------|-------------|
| `/opsx:propose` | Erstelle Änderungs- und Planungsartefakte | Schneller Standardpfad (`core`-Profil) |
| `/opsx:explore` | Ideen mit der KI durchdenken | Hier starten, wenn unsicher: unklare Anforderungen, Untersuchung, Optionen vergleichen |
| `/opsx:new` | Starte ein Änderungsgerüst (Scaffold) | Erweiterter Modus, explizite Artefaktkontrolle |
| `/opsx:continue` | Erstelle das nächste Artefakt | Erweiterter Modus, schrittweise Erstellung von Artefakten |
| `/opsx:ff` | Erstelle alle Planungsartefakte | Erweiterter Modus, klarer Umfang |
| `/opsx:apply` | Implementiere Aufgaben | Bereit zum Codeschreiben |
| `/opsx:verify` | Validiere die Implementierung | Erweiterter Modus, vor der Archivierung |
| `/opsx:sync` | Merge Delta-Spezifikationen | Erweiterter Modus, optional |
| `/opsx:archive` | Schließe die Änderung ab | Alle Arbeit abgeschlossen |
| `/opsx:bulk-archive` | Archiviere mehrere Änderungen | Erweiterter Modus, parallele Arbeit |

## Nächste Schritte

- [Commands](commands.md) - Vollständige Befehlsreferenz mit Optionen
- [Concepts](concepts.md) - Tiefgehende Betrachtung von Spezifikationen, Artefakten und Schemata
- [Customization](customization.md) - Erstelle benutzerdefinierte Workflows