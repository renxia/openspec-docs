# Konzepte

Dieser Leitfaden erklärt die zentralen Konzepte von OpenSpec und deren Zusammenspiel. Für die praktische Anwendung siehe [Erste Schritte](getting-started.md) und [Arbeitsabläufe](workflows.md).

## Philosophie

OpenSpec basiert auf vier Grundprinzipien:

```
flexibel statt starr         — keine Phasengatter, arbeite an dem, was sinnvoll ist
iterativ statt Wasserfall   — lerne während du baust, verfeinere nach und nach
einfach statt komplex       — leichtgewichtige Einrichtung, minimale Formalitäten
brownfield-first            — funktioniert mit bestehenden Codebasen, nicht nur bei Greenfield-Projekten
```

### Warum diese Prinzipien wichtig sind

**Flexibel statt starr.** Herkömmliche Spezifikationssysteme zwingen Sie in starre Phasen: Zuerst planen Sie, dann implementieren Sie, dann sind Sie fertig. OpenSpec ist deutlich flexibler — Sie können Artefakte in beliebiger Reihenfolge erstellen, die für Ihre Arbeit sinnvoll ist.

**Iterativ statt Wasserfall.** Anforderungen ändern sich. Das Verständnis vertieft sich. Was zu Beginn als guter Ansatz erschien, erweist sich möglicherweise als nicht haltbar, sobald Sie die Codebasis kennen. OpenSpec akzeptiert diese Realität.

**Einfach statt komplex.** Einige Spezifikationsframeworks erfordern einen umfangreichen Setup, starre Formate oder schwergewichtige Prozesse. OpenSpec kommt Ihnen nicht in die Quere. Initialisieren Sie es in Sekunden, beginnen Sie sofort mit der Arbeit und passen Sie es nur an, wenn Sie es benötigen.

**Brownfield-first.** Der Großteil der Softwareentwicklung besteht nicht darin, etwas von Grund auf neu zu bauen — sondern darin, bestehende Systeme zu modifizieren. Der delta-basierte Ansatz von OpenSpec macht es einfach, Änderungen an bestehendem Verhalten zu spezifizieren, anstatt nur neue Systeme zu beschreiben.

## Das Gesamtbild

OpenSpec organisiert Ihre Arbeit in zwei Hauptbereiche:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Quelle der Wahrheit│◄─────│  Vorgeschlagene Änderungen    │   │
│   │  Wie Ihr System     │ merge│  Jede Änderung = ein Ordner   │   │
│   │  aktuell funktioniert│     │  Enthält Artefakte + Deltas   │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Spezifikationen** sind die Quelle der Wahrheit – sie beschreiben, wie Ihr System aktuell funktioniert.

**Änderungen** sind vorgeschlagene Modifikationen – sie liegen in separaten Ordnern, bis Sie bereit sind, sie zusammenzuführen.

Diese Trennung ist entscheidend. Sie können parallel an mehreren Änderungen arbeiten, ohne Konflikte zu haben. Sie können eine Änderung prüfen, bevor sie die Haupt-Spezifikationen beeinflusst. Und wenn Sie eine Änderung archivieren, fügen sich deren Deltas sauber in die Quelle der Wahrheit ein.

## Spezifikationen

Spezifikationen beschreiben das Verhalten Ihres Systems anhand strukturierter Anforderungen und Szenarien.

### Struktur

```
openspec/specs/
├── auth/
│   └── spec.md           # Authentifizierungsverhalten
├── payments/
│   └── spec.md           # Zahlungsabwicklung
├── notifications/
│   └── spec.md           # Benachrichtigungssystem
└── ui/
    └── spec.md           # UI-Verhalten und Themes
```

Organisieren Sie Spezifikationen nach Domäne – logische Gruppierungen, die für Ihr System sinnvoll sind. Gängige Muster:

- **Nach Funktionsbereich**: `auth/`, `payments/`, `search/`
- **Nach Komponente**: `api/`, `frontend/`, `workers/`
- **Nach begrenztem Kontext**: `ordering/`, `fulfillment/`, `inventory/`

### Spezifikationsformat

Eine Spezifikation enthält Anforderungen, und jede Anforderung hat Szenarien:

```markdown
# Auth-Spezifikation

## Zweck
Authentifizierung und Sitzungsverwaltung für die Anwendung.

## Anforderungen

### Anforderung: Benutzerauthentifizierung
Das System MUSS bei erfolgreicher Anmeldung ein JWT-Token ausstellen.

#### Szenario: Gültige Anmeldedaten
- GEGEBEN ein Benutzer mit gültigen Anmeldedaten
- WENN der Benutzer das Anmeldeformular absendet
- DANN wird ein JWT-Token zurückgegeben
- UND der Benutzer wird zum Dashboard weitergeleitet

#### Szenario: Ungültige Anmeldedaten
- GEGEBEN ungültige Anmeldedaten
- WENN der Benutzer das Anmeldeformular absendet
- DANN wird eine Fehlermeldung angezeigt
- UND es wird kein Token ausgestellt

### Anforderung: Sitzungsablauf
Das System MUSS Sitzungen nach 30 Minuten Inaktivität beenden.

#### Szenario: Inaktivitätszeitüberschreitung
- GEGEBEN eine authentifizierte Sitzung
- WENN 30 Minuten ohne Aktivität vergehen
- DANN wird die Sitzung ungültig gemacht
- UND der Benutzer muss sich erneut authentifizieren
```

**Wichtige Elemente:**

| Element | Zweck |
|---------|-------|
| `## Purpose` | Allgemeine Beschreibung des Domänenbereichs dieser Spezifikation |
| `### Requirement:` | Ein spezifisches Verhalten, das das System aufweisen muss |
| `#### Scenario:` | Ein konkretes Beispiel für die Anforderung in Aktion |
| SHALL/MUST/SHOULD | RFC 2119-Schlüsselwörter, die die Anforderungsstärke angeben |

### Warum Specs auf diese Weise strukturieren

**Anforderungen sind das "Was"** – sie geben an, was das System tun soll, ohne die Implementierung zu spezifizieren.

**Szenarien sind das "Wann"** – sie liefern konkrete, überprüfbare Beispiele. Gute Szenarien:
- Sind testbar (Sie könnten dafür einen automatisierten Test schreiben)
- Decken sowohl den Happy Path als auch Grenzfälle ab
- Verwenden Given/When/Then oder ein ähnliches strukturiertes Format

**RFC 2119-Schlüsselwörter** (SHALL, MUST, SHOULD, MAY) vermitteln die Intention:
- **MUST/SHALL** – absolute Anforderung
- **SHOULD** – empfohlen, aber Ausnahmen sind zulässig
- **MAY** – optional

### Was eine Spezifikation ist (und was nicht)

Eine Spezifikation ist ein **Verhaltensvertrag**, kein Implementierungsplan.

Guter Inhalt für Spezifikationen:
- Beobachtbares Verhalten, auf das Benutzer oder nachgelagerte Systeme angewiesen sind
- Eingaben, Ausgaben und Fehlerbedingungen
- Externe Einschränkungen (Sicherheit, Datenschutz, Zuverlässigkeit, Kompatibilität)
- Szenarien, die getestet oder explizit validiert werden können

Vermeiden Sie in Spezifikationen:
- Interne Klassen-/Funktionsnamen
- Auswahl von Bibliotheken oder Frameworks
- Schrittweise Implementierungsdetails
- Detaillierte Ausführungspläne (diese gehören in `design.md` oder `tasks.md`)

Schnelltest:
- Wenn die Implementierung geändert werden kann, ohne das extern sichtbare Verhalten zu ändern, gehört sie wahrscheinlich nicht in die Spezifikation.

### Halten Sie es leichtgewichtig: Progressiver Detaillierungsgrad

OpenSpec zielt darauf ab, Bürokratie zu vermeiden. Verwenden Sie den leichtesten Detaillierungsgrad, der die Änderung dennoch überprüfbar macht.

**Lite-Spezifikation (Standard):**
- Kurze, verhaltensorientierte Anforderungen
- Klarer Umfang und Nicht-Ziele
- Einige konkrete Abnahmekriterien

**Vollständige Spezifikation (für höheres Risiko):**
- Änderungen, die mehrere Teams oder Repos betreffen
- API-/Vertragsänderungen, Migrationen, Sicherheits-/Datenschutzbedenken
- Änderungen, bei denen Unklarheiten wahrscheinlich zu kostspieliger Nacharbeit führen

Die meisten Änderungen sollten im Lite-Modus bleiben.

### Zusammenarbeit zwischen Mensch und Agent

In vielen Teams erkunden Menschen den Raum und Agenten entwerfen Artefakte. Der vorgesehene Ablauf ist:

1. Der Mensch liefert Intention, Kontext und Einschränkungen.
2. Der Agent wandelt dies in verhaltensorientierte Anforderungen und Szenarien um.
3. Der Agent hält Implementierungsdetails in `design.md` und `tasks.md`, nicht in `spec.md`.
4. Die Validierung bestätigt Struktur und Klarheit vor der Implementierung.

Dadurch bleiben Spezifikationen für Menschen lesbar und für Agenten konsistent.

## Änderungen

Eine Änderung ist eine vorgeschlagene Modifikation Ihres Systems, verpackt als Ordner mit allem, was zum Verstehen und Implementieren benötigt wird.

### Struktur von Änderungen

```
openspec/changes/add-dark-mode/
├── proposal.md           # Warum und Was
├── design.md             # Wie (technischer Ansatz)
├── tasks.md              # Implementierungscheckliste
├── .openspec.yaml        # Änderungsmetadaten (optional): Schema, erstellt, skip_specs
└── specs/                # Delta-Spezifikationen
    └── ui/
        └── spec.md       # Was sich in ui/spec.md ändert
```

Jede Änderung ist in sich geschlossen. Sie hat:
- **Artefakte** – Dokumente, die Intention, Design und Aufgaben erfassen
- **Delta-Spezifikationen** – Spezifikationen für das, was hinzugefügt, geändert oder entfernt wird
- **Metadaten** – optionale Konfiguration für diese spezifische Änderung

### Warum Änderungen als Ordner verpackt sind

Das Verpacken einer Änderung als Ordner hat mehrere Vorteile:

1. **Alles an einem Ort.** Vorschlag, Design, Aufgaben und Spezifikationen befinden sich an einem einzigen Ort. Keine Suche in verschiedenen Verzeichnissen.
2. **Parallele Arbeit.** Mehrere Änderungen können gleichzeitig existieren, ohne Konflikte zu verursachen. Arbeiten Sie an `add-dark-mode`, während `fix-auth-bug` ebenfalls in Bearbeitung ist.
3. **Saubere Historie.** Bei Archivierung werden Änderungen nach `changes/archive/` verschoben, wobei der gesamte Kontext erhalten bleibt. Sie können zurückblicken und nicht nur verstehen, was geändert wurde, sondern auch warum.
4. **Überprüfungsfreundlich.** Ein Änderungsordner ist einfach zu prüfen – öffnen Sie ihn, lesen Sie den Vorschlag, prüfen Sie das Design und sehen Sie sich die Spezifikationsdeltas an.

## Artefakte

Artefakte sind die Dokumente innerhalb einer Änderung, die die Arbeit leiten.

### Der Artefakt-Ablauf

```
Vorschlag ──────► Spezifikationen ──────► Design ──────► Aufgaben ──────► Implementierung
    │               │             │              │
   Warum          Was           Wie           Schritte
 + Umfang       Änderungen     Ansatz        zu unternehmen
```

Artefakte bauen aufeinander auf. Jedes Artefakt liefert Kontext für das nächste.

### Artefakttypen

#### Vorschlag (`proposal.md`)

Der Vorschlag erfasst **Intention**, **Umfang** und **Vorgehen** auf hoher Ebene.

```markdown
# Vorschlag: Dunkelmodus hinzufügen

## Intention
Benutzer haben einen Dunkelmodus angefordert, um die Augenbelastung bei nächtlicher Nutzung zu reduzieren und Systemeinstellungen zu entsprechen.

## Umfang
Im Umfang:
- Themenumschalter in den Einstellungen
- Erkennung von Systemeinstellungen
- Persistente Speicherung der Einstellung in localStorage

Nicht im Umfang:
- Benutzerdefinierte Farbthemen (zukünftige Arbeit)
- Themenüberschreibungen pro Seite

## Vorgehen
Verwenden Sie CSS-Custom-Properties für das Theming mit einem React-Kontext für die Zustandsverwaltung. Erkennen Sie die Systemeinstellung beim ersten Laden und erlauben Sie eine manuelle Überschreibung.
```

**Wann der Vorschlag aktualisiert werden sollte:**
- Umfangsänderungen (Verengung oder Erweiterung)
- Klärung der Intention (besseres Verständnis des Problems)
- Grundlegende Änderung des Vorgehens

#### Spezifikationen (Delta-Spezifikationen in `specs/`)

Delta-Spezifikationen beschreiben **was sich ändert** im Vergleich zu den aktuellen Spezifikationen. Siehe [Delta Specs](#delta-specs) unten.

#### Design (`design.md`)

Das Design erfasst das **technische Vorgehen** und **Architekturentscheidungen**.

````markdown
# Design: Dunkelmodus hinzufügen

## Technisches Vorgehen
Der Themenstatus wird über React-Kontext verwaltet, um Prop-Drilling zu vermeiden. CSS-Custom-Properties ermöglichen einen Wechsel zur Laufzeit ohne Klassenumschaltung.

## Architekturentscheidungen

### Entscheidung: Kontext statt Redux
Verwendung von React-Kontext für den Themenstatus, weil:
- Einfacher binärer Status (Hell/Dunkel)
- Keine komplexen Statusübergänge
- Vermeidet die Hinzufügung einer Redux-Abhängigkeit

### Entscheidung: CSS-Custom-Properties
Verwendung von CSS-Variablen statt CSS-in-JS, weil:
- Funktioniert mit dem vorhandenen Stylesheet
- Kein Laufzeitaufwand
- Browser-native Lösung

## Datenfluss
```
ThemeProvider (Kontext)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS-Variablen (auf :root angewendet)
```

## Dateiänderungen
- `src/contexts/ThemeContext.tsx` (neu)
- `src/components/ThemeToggle.tsx` (neu)
- `src/styles/globals.css` (geändert)
````

**Wann das Design aktualisiert werden sollte:**
- Die Implementierung zeigt, dass der Ansatz nicht funktioniert
- Eine bessere Lösung wurde entdeckt
- Abhängigkeiten oder Einschränkungen ändern sich

#### Aufgaben (`tasks.md`)

Aufgaben sind die **Implementierungscheckliste** – konkrete Schritte mit Kontrollkästchen.

```markdown
# Aufgaben

## 1. Themeninfrastruktur
- [ ] 1.1 ThemeContext mit Hell-/Dunkel-Status erstellen
- [ ] 1.2 CSS-Custom-Properties für Farben hinzufügen
- [ ] 1.3 localStorage-Persistenz implementieren
- [ ] 1.4 Erkennung von Systemeinstellungen hinzufügen

## 2. UI-Komponenten
- [ ] 2.1 ThemeToggle-Komponente erstellen
- [ ] 2.2 Umschalter zur Einstellungsseite hinzufügen
- [ ] 2.3 Header aktualisieren, um einen Schnellumschalter hinzuzufügen

## 3. Styling
- [ ] 3.1 Farbpalette für den Dunkelmodus definieren
- [ ] 3.2 Komponenten aktualisieren, um CSS-Variablen zu verwenden
- [ ] 3.3 Kontrastverhältnisse für Barrierefreiheit testen
```

**Best Practices für Aufgaben:**
- Gruppieren Sie verwandte Aufgaben unter Überschriften
- Verwenden Sie eine hierarchische Nummerierung (1.1, 1.2 usw.)
- Halten Sie Aufgaben klein genug, um sie in einer Arbeitssitzung abzuschließen
- Markieren Sie Aufgaben als erledigt, sobald Sie sie abgeschlossen haben

## Delta Specs

Delta-Spezifikationen sind das zentrale Konzept, das OpenSpec für die Weiterentwicklung von bestehenden Systemen (Brownfield-Entwicklung) funktionsfähig macht. Sie beschreiben **was sich ändert**, anstatt die gesamte Spezifikation neu zu formulieren.

### Das Format

```markdown
# Delta für die Authentifizierung

## HINZUGEFÜGTE Anforderungen

### Anforderung: Zwei-Faktor-Authentifizierung
Das System MUSS eine TOTP-basierte Zwei-Faktor-Authentifizierung unterstützen.

#### Szenario: 2FA-Registrierung
- GEGEBEN ein Benutzer ohne aktivierte 2FA
- WENN der Benutzer 2FA in den Einstellungen aktiviert
- DANN wird ein QR-Code zur Einrichtung der Authentifizierungs-App angezeigt
- UND der Benutzer muss vor der Aktivierung einen Code zur Verifizierung eingeben

#### Szenario: 2FA-Anmeldung
- GEGEBEN ein Benutzer mit aktivierter 2FA
- WENN der Benutzer gültige Anmeldedaten absendet
- DANN wird eine OTP-Herausforderung angezeigt
- UND die Anmeldung wird erst nach einem gültigen OTP abgeschlossen

## GEÄNDERTE Anforderungen

### Anforderung: Sitzungsablauf
Das System MUSS Sitzungen nach 15 Minuten Inaktivität beenden.
(Zuvor: 30 Minuten)

#### Szenario: Inaktivitätszeitüberschreitung
- GEGEBEN eine authentifizierte Sitzung
- WENN 15 Minuten ohne Aktivität vergehen
- DANN wird die Sitzung ungültig gemacht

## ENTFERNTE Anforderungen

### Anforderung: Angemeldet bleiben
(Veraltet zugunsten von 2FA. Benutzer sollten sich bei jeder Sitzung erneut authentifizieren.)
```

### Delta-Abschnitte

| Abschnitt | Bedeutung | Was bei Archivierung passiert |
|-----------|-----------|-------------------------------|
| `## ADDED Requirements` | Neues Verhalten | Wird an die Hauptspezifikation angehängt |
| `## MODIFIED Requirements` | Geändertes Verhalten | Ersetzt die vorhandene Anforderung |
| `## REMOVED Requirements` | Veraltetes Verhalten | Wird aus der Hauptspezifikation gelöscht |

### Warum Deltas statt vollständiger Spezifikationen

**Klarheit.** Ein Delta zeigt genau, was sich ändert. Bei einer vollständigen Spezifikation müssten Sie die Unterschiede zur aktuellen Version mental ermitteln.

**Konfliktvermeidung.** Zwei Änderungen können dieselbe Spezifikationsdatei betreffen, ohne Konflikte zu verursachen, solange sie unterschiedliche Anforderungen ändern.

**Effiziente Überprüfung.** Prüfer sehen die Änderung, nicht den unveränderten Kontext. Fokus auf das Wesentliche.

**Passend für Brownfield-Entwicklung.** Die meiste Arbeit ändert bestehendes Verhalten. Deltas machen Änderungen zu einem erstklassigen Konzept, nicht zu einem nachträglichen Gedanken.

## Schemas

Schemas definieren die Artefakttypen und deren Abhängigkeiten für einen Workflow.

### Funktionsweise von Schemas

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Keine Abhängigkeiten, kann zuerst erstellt werden

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Benötigt proposal, bevor es erstellt werden kann

  - id: design
    generates: design.md
    requires: [proposal]      # Kann parallel zu specs erstellt werden

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Benötigt sowohl specs als auch design zuerst
```

**Artefakte bilden einen Abhängigkeitsgraphen:**

```
                    proposal
                   (Wurzelknoten)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (benötigt:                  (benötigt:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (benötigt:
                specs, design)
```

**Abhängigkeiten sind Enabler, keine Barrieren.** Sie zeigen, was erstellt werden kann, nicht was als Nächstes erstellt werden muss. Sie können `design` überspringen, wenn Sie es nicht benötigen. Sie können `specs` vor oder nach `design` erstellen – beide hängen nur von `proposal` ab.

### Integrierte Schemata

**spec-driven** (Standard)

Der Standard-Workflow für die spezifikationsgetriebene Entwicklung:

```
proposal → specs → design → tasks → implement
```

Ideal für: Die meisten Feature-Arbeiten, bei denen Sie sich vor der Implementierung auf Spezifikationen einigen möchten.

### Benutzerdefinierte Schemata

Erstellen Sie benutzerdefinierte Schemata für den Workflow Ihres Teams:

```bash
# Von Grund auf neu erstellen
openspec schema init research-first

# Oder ein bestehendes Schema forken
openspec schema fork spec-driven research-first
```

**Beispiel für ein benutzerdefiniertes Schema:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Führen Sie zuerst die Recherche durch

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal wird durch die Recherche informiert

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Überspringen Sie specs/design, gehen Sie direkt zu tasks
```

Vollständige Details zum Erstellen und Verwenden benutzerdefinierter Schemata finden Sie unter [Anpassung](customization.md).

## Archivierung

Die Archivierung schließt eine Änderung ab, indem sie deren Delta-Specs in die Hauptspezifikationen zusammenführt und die Änderung für die Historie aufbewahrt.

### Was passiert bei der Archivierung

```
Vor der Archivierung:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │ Zusammenführen
        ├── design.md                │
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Nach der Archivierung:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Enthält nun die 2FA-Anforderungen
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Für die Historie aufbewahrt
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Der Archivierungsprozess

1. **Zusammenführen von Deltas.** Jeder Delta-Spec-Abschnitt (HINZUGEFÜGT/GEÄNDERT/ENTFERNT) wird auf die entsprechende Hauptspezifikation angewendet.
2. **Verschieben ins Archiv.** Der Änderungsordner wird nach `changes/archive/` mit einem Datumspräfix zur chronologischen Sortierung verschoben.
3. **Kontext bewahren.** Alle Artefakte bleiben im Archiv vollständig erhalten. Sie können jederzeit zurückblicken, um zu verstehen, warum eine Änderung vorgenommen wurde.

### Warum die Archivierung wichtig ist

**Sauberer Zustand.** Aktive Änderungen (`changes/`) zeigen nur laufende Arbeiten. Abgeschlossene Arbeiten werden aus dem Weg geräumt.

**Prüfpfad.** Das Archiv bewahrt den vollständigen Kontext jeder Änderung auf – nicht nur was geändert wurde, sondern auch das Proposal, das den Grund erläutert, das Design, das die Umsetzung beschreibt, und die Aufgaben, die die durchgeführte Arbeit dokumentieren.

**Weiterentwicklung von Spezifikationen.** Spezifikationen wachsen organisch, während Änderungen archiviert werden. Jede Archivierung führt deren Deltas zusammen und baut im Laufe der Zeit eine umfassende Spezifikation auf.

## Wie alles zusammenhängt

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (Kern) oder /opsx:new (erweiterter Workflow)           │
│   │     ÄNDERUNG   │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. ERSTELLEN  │  /opsx:ff oder /opsx:continue (erweiterter Workflow)         │
│   │     ARTEKFAKTE│  Erstellt proposal → specs → design → tasks              │
│   │                │  (basierend auf Schema-Abhängigkeiten)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENTIEREN  │  /opsx:apply                                            │
│   │     AUFGABEN   │  Arbeiten Sie die Aufgaben ab, haken Sie sie ab                  │
│   │                │◄---- Aktualisieren Sie Artefakte, wenn Sie neue Erkenntnisse gewinnen                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. ÜBERPRÜFEN │  /opsx:verify (optional)                                │
│   │     ARBEIT     │  Prüfen, ob die Implementierung den Spezifikationen entspricht                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVIEREN    │────►│  Delta-Specs werden in Hauptspezifikationen zusammengeführt           │    │
│   │     ÄNDERUNG     │     │  Änderungsordner wird nach archive/ verschoben             │    │
│   └────────────────┘     │  Spezifikationen sind nun die aktualisierte Wahrheitsquelle   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Der positive Zyklus:**

1. Spezifikationen beschreiben das aktuelle Verhalten
2. Änderungen schlagen Modifikationen vor (als Deltas)
3. Die Implementierung macht die Änderungen real
4. Die Archivierung führt Deltas in Spezifikationen zusammen
5. Spezifikationen beschreiben nun das neue Verhalten
6. Die nächste Änderung baut auf den aktualisierten Spezifikationen auf

## Glossar

| Begriff | Definition |
|---------|------------|
| **Artefakt** | Ein Dokument innerhalb einer Änderung (Proposal, Design, Aufgaben oder Delta-Specs) |
| **Archivierung** | Der Prozess des Abschließens einer Änderung und des Zusammenführens ihrer Deltas in die Hauptspezifikationen |
| **Änderung** | Eine vorgeschlagene Modifikation des Systems, verpackt als Ordner mit Artefakten |
| **Delta-Spec** | Eine Spezifikation, die Änderungen (HINZUGEFÜGT/GEÄNDERT/ENTFERNT) relativ zu aktuellen Spezifikationen beschreibt |
| **Domäne** | Eine logische Gruppierung für Spezifikationen (z. B. `auth/`, `payments/`) |
| **Anforderung** | Ein spezifisches Verhalten, das das System haben muss |
| **Szenario** | Ein konkretes Beispiel für eine Anforderung, typischerweise im Given/When/Then-Format |
| **Schema** | Eine Definition von Artefakttypen und deren Abhängigkeiten |
| **Spezifikation** | Eine Spezifikation, die das Systemverhalten beschreibt und Anforderungen sowie Szenarien enthält |
| **Wahrheitsquelle** | Das Verzeichnis `openspec/specs/`, das das aktuell vereinbarte Verhalten enthält |

## Nächste Schritte

- [Erste Schritte](getting-started.md) - Praktische erste Schritte
- [Workflows](workflows.md) - Häufige Muster und Anwendungsfälle für jeden
- [Befehle](commands.md) - Vollständige Befehlsreferenz
- [Anpassung](customization.md) - Erstellen Sie benutzerdefinierte Schemata und konfigurieren Sie Ihr Projekt