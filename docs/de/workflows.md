# Arbeitsabläufe

Dieser Leitfaden behandelt gängige Arbeitsablaufmuster für OpenSpec und wann Sie welches verwenden sollten. Für die grundlegende Einrichtung siehe [Erste Schritte](getting-started.md). Für die Befehlsreferenz siehe [Befehle](commands.md).

## Philosophie: Aktionen statt Phasen

Traditionelle Arbeitsabläufe zwingen Sie durch starre Phasen: Planung, dann Implementierung, dann fertig. Aber echte Arbeit passt nicht sauber in vordefinierte Schubladen.

OPSX verfolgt einen anderen Ansatz:

```text
Traditionell (phasenfixiert):

  PLANUNG ────────► IMPLEMENTIERUNG ────────► FERTIG
      │                    │
      │   "Kann nicht zurückgehen"  │
      └────────────────────┘

OPSX (flüssige Aktionen):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Grundprinzipien:**

- **Aktionen statt Phasen** – Befehle sind Dinge, die Sie tun können, keine Phasen, in denen Sie feststecken
- **Abhängigkeiten sind Ermöglicher** – Sie zeigen, was möglich ist, nicht was als Nächstes erforderlich ist

> **Anpassung:** OPSX-Arbeitsabläufe werden durch Schemata gesteuert, die Abfolgen von Artefakten definieren. Details zur Erstellung benutzerdefinierter Schemata finden Sie unter [Anpassung](customization.md).

## Zwei Modi

### Standard-Schnellpfad (`core`-Profil)

Neue Installationen verwenden standardmäßig `core`, das folgende Funktionen bereitstellt:
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

#### Beginnen Sie mit der Erkundung (die lohnende Gewohnheit)

`/opsx:explore` ist Teil des Standardprofils und kein erweitertes Add-On. Es ist die richtige Aktion, wenn Sie ein Problem haben, aber noch keinen Plan haben – was bei der Arbeit mit einem KI-Assistenten die meiste Zeit der Fall ist.

```text
Sie: /opsx:explore

KI:  Was möchten Sie erkunden?

Sie: Unsere Suchergebnisse sind veraltet. Ich bin mir nicht sicher, ob es am Caching,
     der Indizierung oder der Abfrage selbst liegt.

KI:  Lassen Sie mich nachsehen... [liest den Suchdienst und die Cache-Ebene]
     Es liegt am Index: Er wird nur nachts neu erstellt, also werden Änderungen erst am nächsten Tag angezeigt. Zwei Optionen: Neuerstellung bei Schreibvorgang (einfach, höhere Last) oder eine Cache-Invalidierung mit kurzer TTL (mehr bewegliche Teile, geringere Last). Da Ihr Schreibvolumen niedrig ist, ist die Neuerstellung bei Schreibvorgang die sauberere Lösung. Möchten Sie den Umfang festlegen?

Sie: Ja.

Sie: /opsx:propose rebuild-search-index-on-write
```

Die Erkundung erzeugt keine Artefakte und schreibt keinen Code. Es ist ein kostenloses, risikofreies Gespräch, das eine vage Sorge in eine präzise Änderung verwandelt, sodass der folgende Vorschlag präzise ist. Sie wissen bereits genau, was Sie wollen? Überspringen Sie es und gehen Sie direkt zu `/opsx:propose`. Vollständige Anleitung: [Zuerst erkunden](explore.md).

### Erweiterter/Vollständiger Arbeitsablauf (benutzerdefinierte Auswahl)

Wenn Sie explizite Gerüst- und Erstellungsbefehle (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`) verwenden möchten, aktivieren Sie diese mit:

```bash
openspec config profile
openspec update
```

## Arbeitsablaufmuster (Erweiterter Modus)

### Schnelle Funktion

Wenn Sie wissen, was Sie erstellen möchten und es nur umsetzen müssen:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Beispielgespräch:**

```text
Sie: /opsx:new add-logout-button

KI:  Erstellt openspec/changes/add-logout-button/
     Bereit zur Erstellung: Vorschlag

Sie: /opsx:ff

KI:  Erstelle alle Planungsartefakte...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Bereit zur Implementierung!

Sie: /opsx:apply

KI:  Arbeite die Aufgaben ab...
     ✓ Abmeldebutton zum Header hinzugefügt
     ✓ Sitzungsbereinigung implementiert
     ✓ Bestätigungsdialog hinzugefügt
     Alle Aufgaben abgeschlossen!

Sie: /opsx:archive

KI:  ✓ Spezifikationen zusammengeführt
     ✓ Änderung archiviert
```

**Ideal für:** Kleine bis mittlere Funktionen, Fehlerbehebungen, unkomplizierte Änderungen.

### Erkundend

Wenn die Anforderungen unklar sind oder Sie zuerst untersuchen müssen:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Beispielgespräch:**

```text
Sie: /opsx:explore

KI:  Was möchten Sie erkunden?

Sie: Ich möchte die Seitenladeleistung verbessern, aber ich bin mir nicht sicher,
     wo die Engpässe liegen.

KI:  Lassen Sie mich bei der Untersuchung helfen...
     [Analysiert Bündelgrößen, identifiziert langsame Abfragen, prüft
     Render-Muster von Komponenten]

     Ich habe drei Hauptengpässe gefunden:
     1. Große, nicht optimierte Bilder
     2. Synchrone Datenabfrage in ProductList
     3. Neurenderings durch Context-Änderungen

     Welches möchten Sie zuerst angehen?

Sie: Kümmern wir uns zuerst um das Datenabfrageproblem.

Sie: /opsx:new optimize-product-list-fetching

KI:  Änderung erstellt. Bereit zur Erstellung: Vorschlag

Sie: /opsx:continue

KI:  Erstelle Vorschlag basierend auf unserer Erkundung...
     [Schreibt Vorschlag unter Einbeziehung der Untersuchungsergebnisse]

     Bereit zur Erstellung: Spezifikationen, Entwurf
     Was möchten Sie als Nächstes?

Sie: /opsx:continue

KI:  Erstelle Spezifikationen...
```

**Ideal für:** Leistungsoptimierung, Fehlerbehebung, Architekturentscheidungen, unklare Anforderungen.

### Parallele Änderungen

Arbeiten Sie gleichzeitig an mehreren Änderungen:

```text
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in progress)
                                         │
                                    context switch
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Beispielgespräch:**

```text
Sie: Ich arbeite an add-dark-mode, aber wurde zu einer Fehlerbehebung gerufen

Sie: /opsx:new fix-login-redirect

KI:  Erstellt openspec/changes/fix-login-redirect/

Sie: /opsx:ff

KI:  ✓ Planungsartefakte erstellt

Sie: /opsx:apply

KI:  Arbeite an fix-login-redirect...
     [Implementiert die Fehlerbehebung]
     Alle Aufgaben abgeschlossen!

Sie: /opsx:archive

KI:  ✓ fix-login-redirect archiviert

Sie: Zurück zu Dark Mode

Sie: /opsx:apply add-dark-mode

KI:  Setze add-dark-mode fort...
     Setze bei Aufgabe 2.3 fort: Header aktualisieren...
```

**Ideal für:** Parallele Arbeitsabläufe, dringende Unterbrechungen, Teamzusammenarbeit.

Wenn Sie mehrere abgeschlossene Änderungen haben, verwenden Sie `/opsx:bulk-archive`:

```text
Sie: /opsx:bulk-archive

KI:  3 abgeschlossene Änderungen gefunden:
     - add-dark-mode (alle Aufgaben erledigt)
     - fix-login-redirect (alle Aufgaben erledigt)
     - update-footer (alle Aufgaben erledigt)

     Prüfe auf Spezifikationskonflikte...
     ⚠ add-dark-mode und update-footer berühren beide specs/ui/

     Untersuche Codebasis zur Konfliktlösung...
     Beide Änderungen sind implementiert. Werde sie in chronologischer Reihenfolge anwenden.

     Alle 3 Änderungen archivieren?

Sie: Ja

KI:  ✓ add-dark-mode archiviert
     ✓ fix-login-redirect archiviert
     ✓ update-footer archiviert
     Spezifikationen in Reihenfolge zusammengeführt: add-dark-mode → update-footer
```

Die Massenarchivierung erkennt, wenn mehrere Änderungen dieselben Spezifikationen berühren, und löst Konflikte, indem sie prüft, was tatsächlich implementiert ist.

### Abschließen einer Änderung

Der empfohlene Abschlussablauf:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              validiert           fragt nach Synchronisierung
              Implementierung     falls erforderlich
```

#### Überprüfen: Prüfen Sie Ihre Arbeit

`/opsx:verify` validiert die Implementierung anhand Ihrer Artefakte in drei Dimensionen:

```text
Sie: /opsx:verify

KI:  Überprüfe add-auth...

     VOLLSTÄNDIGKEIT
     ✓ Alle 12 Aufgaben in tasks.md sind abgehakt
     ✓ Alle Anforderungen in den Spezifikationen haben entsprechenden Code
     ⚠ Szenario "Sitzungszeitüberschreitung nach Inaktivität" nicht getestet

     KORREKTHEIT
     ✓ Implementierung entspricht der Spezifikationsabsicht
     ✓ Randfälle aus Szenarien werden behandelt
     ✓ Fehlerzustände entsprechen den Spezifikationsdefinitionen

     KOHÄRENZ
     ✓ Entwurfsentscheidungen spiegeln sich in der Codestruktur wider
     ✓ Namenskonventionen stimmen mit design.md überein
     ⚠ Entwurf erwähnt "ereignisgesteuert", aber Implementierung verwendet Abfrage

     ZUSAMMENFASSUNG
     ─────────────────────────────
     Kritische Probleme: 0
     Warnungen: 2
     Bereit zur Archivierung: Ja (mit Warnungen)

     Empfehlungen:
     1. Test für Szenario der Sitzungszeitüberschreitung hinzufügen
     2. Prüfen, ob eine Umstellung auf ereignisgesteuert wie entworfen sinnvoll ist, oder design.md aktualisieren
```

**Was die Überprüfung prüft:**

| Dimension | Was wird validiert |
|-----------|-------------------|
| Vollständigkeit | Alle Aufgaben erledigt, alle Anforderungen implementiert, Szenarien abgedeckt |
| Korrektheit | Implementierung entspricht der Spezifikationsabsicht, Randfälle behandelt |
| Kohärenz | Entwurfsentscheidungen spiegeln sich im Code wider, Muster stimmen überein |

Die Überprüfung blockiert die Archivierung nicht, aber sie zeigt Probleme auf, die Sie zuerst beheben möchten.

#### Archivieren: Abschließen der Änderung

`/opsx:archive` schließt die Änderung ab und verschiebt sie in das Archiv:

```text
Sie: /opsx:archive

KI:  Archiviere add-auth...

     Status der Artefakte:
     ✓ proposal.md vorhanden
     ✓ specs/ vorhanden
     ✓ design.md vorhanden
     ✓ tasks.md vorhanden (12/12 Aufgaben abgeschlossen)

     Delta-Spezifikationen: Noch nicht mit Hauptzweig synchronisiert
     → Möchten Sie jetzt synchronisieren?

Sie: Ja

KI:  ✓ Spezifikationen nach openspec/specs/auth/spec.md synchronisiert
     ✓ Nach openspec/changes/archive/2025-01-24-add-auth/ verschoben

     Änderung erfolgreich archiviert.
```

Die Archivierung fragt nach, falls die Spezifikationen nicht synchronisiert sind. Sie blockiert nicht bei unvollständigen Aufgaben, warnt Sie aber.

## Wann was verwenden

### `/opsx:ff` vs `/opsx:continue`

| Situation | Verwenden |
|-----------|-----------|
| Klare Anforderungen, bereit zur Implementierung | `/opsx:ff` |
| Erkundung, jeder Schritt soll geprüft werden | `/opsx:continue` |
| Vorschlag vor Spezifikationen iterieren möchten | `/opsx:continue` |
| Zeitdruck, schnell vorankommen | `/opsx:ff` |
| Komplexe Änderung, Kontrolle behalten | `/opsx:continue` |

**Faustregel:** Wenn Sie den gesamten Umfang im Voraus beschreiben können, verwenden Sie `/opsx:ff`. Wenn Sie es während der Arbeit herausfinden, verwenden Sie `/opsx:continue`.

### Wann aktualisieren und wann neu anfangen

Eine häufige Frage: Wann ist das Aktualisieren einer bestehenden Änderung sinnvoll und wann sollten Sie eine neue beginnen?

**Aktualisieren Sie die bestehende Änderung, wenn:**
- Gleiche Absicht, verfeinerte Ausführung
- Umfang verkleinert sich (zuerst MVP, Rest später)
- Lernbasierte Korrekturen (Codebasis entspricht nicht Ihren Erwartungen)
- Entwurfsanpassungen basierend auf Implementierungserkenntnissen

**Beginnen Sie eine neue Änderung, wenn:**
- Absicht grundlegend geändert
- Umfang ist auf völlig andere Arbeit ausgeweitet
- Ursprüngliche Änderung kann eigenständig als "erledigt" markiert werden
- Patches würden mehr verwirren als klären

```text
                     ┌─────────────────────────────────────┐
                     │     Ist dies die gleiche Arbeit?     │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Gleiche Absicht?     >50 % Überlappung?   Kann die ursprüngliche
          Gleiches Problem?    Gleicher Umfang?     Änderung ohne diese
                 │                  │          Änderungen "erledigt"
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      JA                NEIN JA           NEIN NEIN           JA
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    AKTUALISIEREN      NEU  AKTUALISIEREN NEU AKTUALISIEREN   NEU
```

**Beispiel: "Dark Mode hinzufügen"**
- "Muss auch benutzerdefinierte Themen unterstützen" → Neue Änderung (Umfang ausgeweitet)
- "Erkennung der Systemeinstellung ist schwieriger als erwartet" → Aktualisieren (gleiche Absicht)
- "Lassen Sie uns zuerst den Schalter ausliefern, Einstellungen später hinzufügen" → Zuerst aktualisieren und archivieren, dann neue Änderung

## Best Practices

### Änderungen fokussiert halten

Eine logische Arbeitseinheit pro Änderung. Wenn Sie "Funktion X hinzufügen und gleichzeitig Y umgestalten" machen, erwägen Sie zwei separate Änderungen.

**Warum das wichtig ist:**
- Einfacher zu prüfen und zu verstehen
- Sauberere Archivhistorie
- Kann unabhängig ausgeliefert werden
- Einfacheres Rollback bei Bedarf

### Verwenden Sie `/opsx:explore` bei unklaren Anforderungen

Bevor Sie sich zu einer Änderung verpflichten, erkunden Sie den Problembereich:

```text
Sie: /opsx:explore

KI:  Was möchten Sie erkunden?

Sie: Wie sollen wir die Ratenbegrenzung für unsere API handhaben?

KI:  Lassen Sie mich Ihre aktuelle Einrichtung und Optionen untersuchen...
     [Recherchiert Codebasis, prüft Muster]

     Ich sehe drei Ansätze, die wir verfolgen könnten:
     1. Middleware-basiert (einfach, pro Endpunkt)
     2. Redis-gestützt (skalierbar, gemeinsamer Zustand)
     3. Token Bucket pro Benutzer (fair, komplex)

     Ihr aktueller Stack deutet auf #1 oder #2 hin. Wie hoch ist Ihre Skalierung?
```

Die Erkundung klärt die Gedanken, bevor Sie Artefakte erstellen.

### Vor der Archivierung überprüfen

Verwenden Sie `/opsx:verify`, um zu prüfen, ob die Implementierung mit den Artefakten übereinstimmt:

```text
Sie: /opsx:verify

KI:  Überprüfe add-dark-mode...

     ✓ Alle Aufgaben in tasks.md sind abgehakt
     ✓ Anforderungen in Spezifikationen haben entsprechenden Code
     ✓ Entwurfsentscheidungen sind in der Implementierung berücksichtigt

     Bereit zur Archivierung!
```

Erkennt Abweichungen, bevor Sie die Änderung abschließen.

### Änderungen klar benennen

Gute Namen machen `openspec list` nützlich:

| Gut: | Vermeiden: |
|------|------------|
| add-dark-mode | feature-1 |
| fix-login-redirect | update |
| optimize-product-query | changes |
| implement-2fa | wip |

## Schnellreferenz für Befehle

Vollständige Befehlsdetails und Optionen finden Sie in [Befehle](commands.md).

| Befehl | Zweck | Einsatzsituation |
|---------|---------|-------------|
| `/opsx:propose` | Änderungs- und Planungsartefakte erstellen | Schneller Standardpfad (`core`-Profil) |
| `/opsx:explore` | Ideen gemeinsam mit der KI durchdenken | Hier starten, wenn Unsicherheit besteht: unklare Anforderungen, Recherche, Vergleich von Optionen |
| `/opsx:new` | Ein Änderungsgerüst starten | Erweiterter Modus, explizite Artefaktsteuerung |
| `/opsx:continue` | Nächstes Artefakt erstellen | Erweiterter Modus, schrittweise Erstellung von Artefakten |
| `/opsx:ff` | Alle Planungsartefakte erstellen | Erweiterter Modus, klarer Umfang |
| `/opsx:apply` | Aufgaben implementieren | Bereit zum Schreiben von Code |
| `/opsx:verify` | Implementierung validieren | Erweiterter Modus, vor der Archivierung |
| `/opsx:sync` | Delta-Spezifikationen zusammenführen | Erweiterter Modus, optional |
| `/opsx:archive` | Änderung abschließen | Alle Arbeiten abgeschlossen |
| `/opsx:bulk-archive` | Mehrere Änderungen archivieren | Erweiterter Modus, parallele Arbeiten |

## Nächste Schritte

- [Gute Spezifikationen schreiben](writing-specs.md) - Wie eine starke Anforderung und ein starkes Szenario aussehen und wie man eine Änderung richtig dimensioniert
- [Eine Änderung prüfen](reviewing-changes.md) - Der zweiminütige Durchgang eines entworfenen Plans vor der ersten Codezeile
- [OpenSpec im Team](team-workflow.md) - Wie Änderungen in Branches und Pull Requests eingebettet werden
- [Befehle](commands.md) - Vollständige Befehlsreferenz mit Optionen
- [Konzepte](concepts.md) - Vertiefung zu Spezifikationen, Artefakten und Schemata
- [Anpassung](customization.md) - Eigene Workflows erstellen