# Konzepte

Dieser Leitfaden erklärt die Kernkonzepte hinter OpenSpec und wie sie zusammenwirken. Für die praktische Anwendung siehe [Erste Schritte](getting-started.md) und [Workflows](workflows.md).

## Philosophie

OpenSpec basiert auf vier Prinzipien:

```
flüssig statt starr         — keine Phasentore, arbeite an dem, was Sinn macht
iterativ statt Wasserfall   — lerne beim Bauen, verfeinere unterwegs
einfach statt komplex       — leichtgewichtige Einrichtung, minimaler Aufwand
Bestandscode zuerst         — funktioniert mit bestehenden Codebases, nicht nur mit neuen Projekten
```

### Warum diese Prinzipien wichtig sind

**Flüssig statt starr.** Traditionelle Spezifikationssysteme zwingen Sie in Phasen: Zuerst planen Sie, dann implementieren Sie, dann ist alles erledigt. OpenSpec ist flexibler — Sie können Artefakte in einer beliebigen Reihenfolge erstellen, die für Ihre Arbeit sinnvoll ist.

**Iterativ statt Wasserfall.** Anforderungen ändern sich. Das Verständnis vertieft sich. Was zu Beginn wie ein guter Ansatz erschien, hält möglicherweise nicht stand, nachdem Sie den Code gesehen haben. OpenSpec akzeptiert diese Realität.

**Einfach statt komplex.** Einige Spezifikations-Frameworks erfordern umfangreiche Einrichtung, starre Formate oder schwerfällige Prozesse. OpenSpec stellt sich Ihnen nicht in den Weg. Initialisieren Sie in Sekunden, beginnen Sie sofort mit der Arbeit und passen Sie nur an, wenn Sie es benötigen.

**Bestandscode zuerst.** Die meisten Softwarearbeiten bestehen nicht darin, etwas von Grund auf neu zu bauen — sondern bestehende Systeme zu verändern. OpenSpecs Delta-basierter Ansatz macht es einfach, Änderungen am bestehenden Verhalten zu spezifizieren, und nicht nur neue Systeme zu beschreiben.

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

**Spezifikationen** sind die Quelle der Wahrheit — sie beschreiben, wie Ihr System sich aktuell verhält.

**Änderungen** sind vorgeschlagene Modifikationen — sie leben in separaten Ordnern, bis Sie bereit sind, sie zusammenzuführen.

Diese Trennung ist entscheidend. Sie können an mehreren Änderungen parallel arbeiten, ohne Konflikte zu riskieren. Sie können eine Änderung überprüfen, bevor sie die Haupt-Spezifikationen beeinflusst. Und wenn Sie eine Änderung archivieren, verschmelzen ihre Deltas sauber mit der Quelle der Wahrheit.

## Spezifikationen

Spezifikationen beschreiben das Verhalten Ihres Systems mithilfe strukturierter Anforderungen und Szenarien.

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

Organisieren Sie Spezifikationen nach Domänen — logische Gruppierungen, die für Ihr System sinnvoll sind. Gängige Muster:

- **Nach Funktionsbereich**: `auth/`, `payments/`, `search/`
- **Nach Komponente**: `api/`, `frontend/`, `workers/`
- **Nach abgegrenztem Kontext**: `ordering/`, `fulfillment/`, `inventory/`

### Spezifikationsformat

Eine Spezifikation enthält Anforderungen, und jede Anforderung hat Szenarien:

```markdown
# Authentifizierungsspezifikation

## Zweck
Authentifizierung und Sitzungsverwaltung für die Anwendung.

## Anforderungen

### Anforderung: Benutzerauthentifizierung
Das System SOLL bei erfolgreicher Anmeldung ein JWT-Token ausstellen.

#### Szenario: Gültige Anmeldeinformationen
- ANGENOMMEN ein Benutzer mit gültigen Anmeldeinformationen
- WENN der Benutzer das Anmeldeformular absendet
- DANN wird ein JWT-Token zurückgegeben
- UND der Benutzer wird zum Dashboard weitergeleitet

#### Szenario: Ungültige Anmeldeinformationen
- ANGENOMMEN ungültige Anmeldeinformationen
- WENN der Benutzer das Anmeldeformular absendet
- DANN wird eine Fehlermeldung angezeigt
- UND es wird kein Token ausgestellt

### Anforderung: Sitzungsablauf
Das System MUSS Sitzungen nach 30 Minuten Inaktivität ablaufen lassen.

#### Szenario: Leerlaufzeitüberschreitung
- ANGENOMMEN eine authentifizierte Sitzung
- WENN 30 Minuten ohne Aktivität vergehen
- DANN wird die Sitzung ungültig
- UND der Benutzer muss sich erneut authentifizieren
```

**Wichtige Elemente:**

| Element | Zweck |
|---------|---------|
| `## Zweck` | Übergeordnete Beschreibung des Bereichs dieser Spezifikation |
| `### Anforderung:` | Ein spezifisches Verhalten, das das System haben muss |
| `#### Szenario:` | Ein konkretes Beispiel der Anforderung in der Praxis |
| SHALL/MUST/SHOULD | RFC 2119-Schlüsselwörter, die die Stärke der Anforderung angeben |

### Warum Spezifikationen so strukturiert werden

**Anforderungen sind das "Was"** — sie legen fest, was das System tun soll, ohne die Implementierung vorzuschreiben.

**Szenarien sind das "Wann"** — sie liefern konkrete Beispiele, die überprüft werden können. Gute Szenarien:
- Sind testbar (man könnte dafür einen automatisierten Test schreiben)
- Decken sowohl den Happy Path als auch Randfälle ab
- Verwenden ein strukturiertes Format wie Given/When/Then oder Ähnliches

**RFC 2119-Schlüsselwörter** (SHALL, MUST, SHOULD, MAY) vermitteln die Absicht:
- **MUST/SHALL** — absolute Anforderung
- **SHOULD** — empfohlen, aber Ausnahmen sind möglich
- **MAY** — optional

### Was eine Spezifikation ist (und was nicht)

Eine Spezifikation ist ein **Verhaltensvertrag**, kein Implementierungsplan.

Guter Spezifikationsinhalt:
- Beobachtbares Verhalten, auf das Benutzer oder nachgelagerte Systeme angewiesen sind
- Eingaben, Ausgaben und Fehlerbedingungen
- Externe Einschränkungen (Sicherheit, Datenschutz, Zuverlässigkeit, Kompatibilität)
- Szenarien, die getestet oder explizit validiert werden können

Vermeiden Sie in Spezifikationen:
- Interne Klassen-/Funktionsnamen
- Bibliotheks- oder Framework-Auswahls
- Schritt-für-Schritt-Implementierungsdetails
- Detaillierte Ausführungspläne (diese gehören in `design.md` oder `tasks.md`)

Schnelltest:
- Wenn sich die Implementierung ändern kann, ohne das extern sichtbare Verhalten zu ändern, gehört sie wahrscheinlich nicht in die Spezifikation.

### Leichtgewichtig halten: Schrittweise Strenge

OpenSpec zielt darauf ab, Bürokratie zu vermeiden. Verwenden Sie die leichteste Ebene, die die Änderung noch überprüfbar macht.

**Leichte Spezifikation (Standard):**
- Kurze, verhaltensorientierte Anforderungen
- Klare Abgrenzung und Nicht-Ziele
- Einige konkrete Akzeptanzprüfungen

**Vollständige Spezifikation (für höheres Risiko):**
- Änderungen über Teams oder Repositories hinweg
- API-/Vertragsänderungen, Migrationen, Sicherheits-/Datenschutzbedenken
- Änderungen, bei denen Mehrdeutigkeit wahrscheinlich zu kostspieligen Nacharbeiten führt

Die meisten Änderungen sollten im leichten Modus bleiben.

### Mensch + Agent Zusammenarbeit

In vielen Teams erforschen Menschen die Anforderungen und Agenten entwerfen Artefakte. Der vorgesehene Ablauf ist:

1. Mensch liefert Absicht, Kontext und Einschränkungen.
2. Agent wandelt dies in verhaltensorientierte Anforderungen und Szenarien um.
3. Agent hält Implementierungsdetails in `design.md` und `tasks.md`, nicht in `spec.md`.
4. Validierung bestätigt Struktur und Klarheit vor der Implementierung.

Dies hält Spezifikationen für Menschen lesbar und für Agenten konsistent.

## Änderungen

Eine Änderung ist eine vorgeschlagene Modifikation Ihres Systems, die als Ordner mit allem gepackt ist, was zum Verständnis und zur Implementierung benötigt wird.

### Änderungsstruktur

```
openspec/changes/add-dark-mode/
├── proposal.md           # Warum und Was
├── design.md             # Wie (technischer Ansatz)
├── tasks.md              # Implementierungs-Checkliste
├── .openspec.yaml        # Änderungs-Metadaten (optional)
└── specs/                # Delta-Spezifikationen
    └── ui/
        └── spec.md       # Was sich in ui/spec.md ändert
```

Jede Änderung ist eigenständig. Sie enthält:
- **Artefakte** — Dokumente, die Absicht, Design und Aufgaben erfassen
- **Delta-Spezifikationen** — Spezifikationen für das, was hinzugefügt, geändert oder entfernt wird
- **Metadaten** — optionale Konfiguration für diese spezifische Änderung

### Warum Änderungen Ordner sind

Eine Änderung als Ordner zu paketieren hat mehrere Vorteile:

1. **Alles zusammen.** Vorschlag, Design, Aufgaben und Spezifikationen leben an einem Ort. Kein Suchen an verschiedenen Stellen.

2. **Parallele Arbeit.** Mehrere Änderungen können gleichzeitig existieren, ohne zu konkurrieren. Arbeiten Sie an `add-dark-mode`, während `fix-auth-bug` ebenfalls in Bearbeitung ist.

3. **Saubere Historie.** Wenn sie archiviert werden, wechseln Änderungen mit ihrem vollständigen Kontext in `changes/archive/`. Sie können zurückblicken und verstehen, nicht nur was sich geändert hat, sondern auch warum.

4. **Überprüfungsfreundlich.** Ein Änderungsordner ist einfach zu überprüfen — öffnen Sie ihn, lesen Sie den Vorschlag, prüfen Sie das Design, sehen Sie sich die Spezifikations-Deltas an.

## Artefakte

Artefakte sind die Dokumente innerhalb einer Änderung, die die Arbeit leiten.

### Der Artefakt-Fluss

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   warum           was           wie          Schritte
 + Umfang        Änderungen    Ansatz      zu unternehmen
```

Artefakte bauen aufeinander auf. Jedes Artefakt liefert den Kontext für das nächste.

### Artefakt-Typen

#### Vorschlag (`proposal.md`)

Der Vorschlag erfasst **Absicht**, **Umfang** und **Ansatz** auf hoher Ebene.

```markdown
# Vorschlag: Dunklen Modus hinzufügen

## Absicht
Benutzer haben nach einer Option für einen dunklen Modus gefragt, um Augenbelastung bei nächtlicher Nutzung zu reduzieren und Systempräferenzen widerzuspiegeln.

## Umfang
Im Umfang:
- Theme-Umschalter in den Einstellungen
- Erkennung von Systempräferenzen
- Speicherung der Präferenz in localStorage

Außerhalb des Umfangs:
- Benutzerdefinierte Farbthemes (zukünftige Arbeit)
- Seitenspezifische Theme-Überschreibungen

## Ansatz
Verwendung von CSS Custom Properties für das Theming mit einem React-Kontext
für das Zustandsmanagement. Erkennung der Systempräferenz beim ersten Laden,
manuelle Überschreibung erlauben.
```

**Wann der Vorschlag aktualisiert werden sollte:**
- Der Umfang ändert sich (eingeschränkt oder erweitert)
- Die Absicht wird klarer (besseres Verständnis des Problems)
- Der Ansatz verschiebt sich grundlegend

#### Spezifikationen (Delta-Spezifikationen in `specs/`)

Delta-Spezifikationen beschreiben **was sich ändert** im Verhältnis zu den aktuellen Spezifikationen. Siehe [Delta-Spezifikationen](#delta-specs) unten.

#### Design (`design.md`)

Das Design erfasst den **technischen Ansatz** und **Architekturentscheidungen**.

````markdown
# Design: Dunklen Modus hinzufügen

## Technischer Ansatz
Theme-Zustand wird über React Context verwaltet, um Prop-Drilling zu vermeiden.
CSS Custom Properties ermöglichen das Umschalten zur Laufzeit ohne Klassenumschaltung.

## Architekturentscheidungen

### Entscheidung: Context statt Redux
Verwendung von React Context für den Theme-Zustand, weil:
- Einfacher binärer Zustand (hell/dunkel)
- Keine komplexen Zustandsübergänge
- Vermeidet die Abhängigkeit von Redux

### Entscheidung: CSS Custom Properties
Verwendung von CSS-Variablen anstelle von CSS-in-JS, weil:
- Funktioniert mit bestehenden Stylesheets
- Kein Laufzeitaufwand
- Browser-native Lösung

## Datenfluss
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variablen (angewendet auf :root)
```

## Dateiänderungen
- `src/contexts/ThemeContext.tsx` (neu)
- `src/components/ThemeToggle.tsx` (neu)
- `src/styles/globals.css` (geändert)
````

**Wann das Design aktualisiert werden sollte:**
- Die Umsetzung zeigt, dass der Ansatz nicht funktioniert
- Eine bessere Lösung wird entdeckt
- Abhängigkeiten oder Einschränkungen ändern sich

#### Aufgaben (`tasks.md`)

Aufgaben sind die **Umsetzungs-Checkliste** – konkrete Schritte mit Häkchen.

```markdown
# Aufgaben

## 1. Theme-Infrastruktur
- [ ] 1.1 ThemeContext mit light/dark-Zustand erstellen
- [ ] 1.2 CSS-Eigenschaften für Farben hinzufügen
- [ ] 1.3 localStorage-Persistenz implementieren
- [ ] 1.4 Systempräferenz-Erkennung hinzufügen

## 2. UI-Komponenten
- [ ] 2.1 ThemeToggle-Komponente erstellen
- [ ] 2.2 Umschalter zur Einstellungsseite hinzufügen
- [ ] 2.3 Header aktualisieren, um schnellen Umschalter einzubeziehen

## 3. Styling
- [ ] 3.1 Farbpalette für dunkles Theme definieren
- [ ] 3.2 Komponenten aktualisieren, um CSS-Variablen zu verwenden
- [ ] 3.3 Kontrastverhältnisse für Barrierefreiheit testen
```

**Best Practices für Aufgaben:**
- Gruppiere verwandte Aufgaben unter Überschriften
- Verwende hierarchische Nummerierung (1.1, 1.2 usw.)
- Halte Aufgaben klein genug, um sie in einer Sitzung abzuschließen
- Hake Aufgaben ab, wenn du sie erledigt hast

## Delta-Spezifikationen

Delta-Spezifikationen sind das Schlüsselkonzept, das OpenSpec für Brownfield-Entwicklung geeignet macht. Sie beschreiben, **was sich ändert**, anstatt die gesamte Spezifikation neu zu formulieren.

### Das Format

```markdown
# Delta für Auth

## HINZUGEFÜGEN Anforderungen

### Anforderung: Zwei-Faktor-Authentifizierung
Das System MUSS eine TOTP-basierte Zwei-Faktor-Authentifizierung unterstützen.

#### Szenario: 2FA-Registrierung
- ANGENOMMEN ein Benutzer ohne aktiviertes 2FA
- WENN der Benutzer 2FA in den Einstellungen aktiviert
- DANN wird ein QR-Code für die Einrichtung der Authenticator-App angezeigt
- UND der Benutzer muss mit einem Code verifizieren, bevor die Aktivierung erfolgt

#### Szenario: 2FA-Anmeldung
- ANGENOMMEN ein Benutzer mit aktiviertem 2FA
- WENN der Benutzer gültige Anmeldeinformationen eingibt
- DANN wird eine OTP-Herausforderung präsentiert
- UND die Anmeldung wird nur nach gültigem OTP abgeschlossen

## GEÄNDERT Anforderungen

### Anforderung: Sitzungsablauf
Das System MUSS Sitzungen nach 15 Minuten Inaktivität ablaufen lassen.
(Vorher: 30 Minuten)

#### Szenario: Leerlauf-Timeout
- ANGENOMMEN eine authentifizierte Sitzung
- WENN 15 Minuten ohne Aktivität vergehen
- DANN wird die Sitzung ungültig

## ENTFERNTE Anforderungen

### Anforderung: Angemeldet bleiben
(Veraltet zugunsten von 2FA. Benutzer sollten sich bei jeder Sitzung erneut authentifizieren.)
```

### Delta-Abschnitte

| Abschnitt | Bedeutung | Was beim Archivieren passiert |
|-----------|-----------|-------------------------------|
| `## HINZUGEFÜGEN Anforderungen` | Neues Verhalten | Wird an die Hauptspezifikation angehängt |
| `## GEÄNDERT Anforderungen` | Geändertes Verhalten | Ersetzt die bestehende Anforderung |
| `## ENTFERNTE Anforderungen` | Veraltetes Verhalten | Wird aus der Hauptspezifikation gelöscht |

### Warum Deltas statt vollständiger Spezifikationen

**Klarheit.** Ein Delta zeigt genau, was sich ändert. Beim Lesen einer vollständigen Spezifikation müsstest du sie mental gegen die aktuelle Version diffen.

**Vermeidung von Konflikten.** Zwei Änderungen können dieselbe Spezifikationsdatei berühren, ohne zu konfliktieren, solange sie unterschiedliche Anforderungen modifizieren.

**Effizienz bei der Überprüfung.** Überprüfer sehen die Änderung, nicht den unveränderten Kontext. Konzentriere dich auf das Wesentliche.

**Brownfield-Eignung.** Die meiste Arbeit modifiziert bestehendes Verhalten. Deltas machen Modifikationen zu einem erstklassigen Konzept, nicht zu einem nachträglichen Gedanken.

## Schemas

Schemas definieren die Artefakttypen und deren Abhängigkeiten für einen Workflow.

### Wie Schemas funktionieren

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Keine Abhängigkeiten, kann zuerst erstellt werden

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Benötigt proposal vor der Erstellung

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

**Abhängigkeiten sind Ermöglicher, keine Gates.** Sie zeigen, was erstellt werden kann, nicht, was als Nächstes erstellt werden muss. Du kannst design überspringen, wenn du es nicht brauchst. Du kannst specs vor oder nach design erstellen – beide hängen nur von proposal ab.

### Eingebaute Schemas

**spec-driven** (Standard)

Der Standard-Workflow für spezifikationsgetriebene Entwicklung:

```
proposal → specs → design → tasks → implement
```

Am besten geeignet für: Die meisten Feature-Arbeiten, bei denen du dich vor der Implementierung auf Spezifikationen einigen möchtest.

### Benutzerdefinierte Schemas

Erstelle benutzerdefinierte Schemas für den Workflow deines Teams:

```bash
# Von Grund auf erstellen
openspec schema init research-first

# Oder ein bestehendes Schema abzweigen
openspec schema fork spec-driven research-first
```

**Beispiel für ein benutzerdefiniertes Schema:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Zuerst Recherche durchführen

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal wird durch Recherche informiert

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Specs/design überspringen, direkt zu tasks
```

Siehe [Anpassung](customization.md) für vollständige Details zur Erstellung und Verwendung benutzerdefinierter Schemas.

## Archivierung

Die Archivierung schließt eine Änderung ab, indem ihre Delta-Spezifikationen in die Hauptspezifikationen zusammengeführt und die Änderung für die Historie aufbewahrt wird.

### Was bei der Archivierung passiert

```
Vor der Archivierung:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ Zusammenführung
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Nach der Archivierung:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Enthält jetzt 2FA-Anforderungen
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

1. **Deltas zusammenführen.** Jeder Delta-Spezifikationsabschnitt (HINZUGEFÜGEN/GEÄNDERT/ENTFERNTE) wird auf die entsprechende Hauptspezifikation angewendet.

2. **In Archiv verschieben.** Der Änderungsordner wird mit einem Datumspräfix zur chronologischen Sortierung nach `changes/archive/` verschoben.

3. **Kontext bewahren.** Alle Artefakte bleiben im Archiv intakt. Du kannst immer zurückblicken, um zu verstehen, warum eine Änderung vorgenommen wurde.

### Warum Archivierung wichtig ist

**Sauberer Zustand.** Aktive Änderungen (`changes/`) zeigen nur laufende Arbeit. Abgeschlossene Arbeit wird aus dem Weg geräumt.

**Prüfpfad.** Das Archiv bewahrt den vollständigen Kontext jeder Änderung – nicht nur, was sich geändert hat, sondern auch das Proposal, das erklärt warum, das Design, das erklärt wie, und die Aufgaben, die die geleistete Arbeit zeigen.

**Spezifikationsentwicklung.** Spezifikationen wachsen organisch, während Änderungen archiviert werden. Jede Archivierung führt ihre Deltas zusammen und baut im Laufe der Zeit eine umfassende Spezifikation auf.

## Wie alles zusammenpasst

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC-ABLUF                                  │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. ÄNDERUNG   │  /opsx:propose (Kern) oder /opsx:new (erweitert)        │
│   │     STARTEN    │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. ARTEFAKTE  │  /opsx:ff oder /opsx:continue (erweiterter Workflow)    │
│   │     ERSTELLEN  │  Erstellt proposal → specs → design → tasks             │
│   │                │  (basierend auf Schema-Abhängigkeiten)                  │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. AUFGABEN   │  /opsx:apply                                            │
│   │     UMSETZEN   │  Arbeite Aufgaben ab und hake sie ab                    │
│   │                │◄──── Aktualisiere Artefakte, während du lernst          │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. ARBEIT     │  /opsx:verify (optional)                                │
│   │     PRÜFEN     │  Überprüfe, ob Implementierung mit Spezifikationen      │
│   │                │  übereinstimmt                                          │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ÄNDERUNG   │────►│  Delta-Spezifikationen werden in die         │    │
│   │     ARCHIVIEREN│     │  Hauptspezifikationen zusammengeführt        │    │
│   └────────────────┘     │  Änderungsordner wird nach archive/ verschoben│    │
│                          │  Spezifikationen sind jetzt die aktualisierte │    │
│                          │  Wahrheitsquelle                              │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Der Teufelskreis (im positiven Sinne):**

1. Spezifikationen beschreiben das aktuelle Verhalten
2. Änderungen schlagen Modifikationen vor (als Deltas)
3. Implementierung macht die Änderungen real
4. Archivierung führt Deltas in Spezifikationen zusammen
5. Spezifikationen beschreiben jetzt das neue Verhalten
6. Die nächste Änderung baut auf aktualisierten Spezifikationen auf

## Glossar

| Begriff | Definition |
|---------|------------|
| **Artefakt** | Ein Dokument innerhalb einer Änderung (Vorschlag, Design, Aufgaben oder Deltaspezifikationen) |
| **Archivierung** | Der Prozess des Abschlusses einer Änderung und des Zusammenführens ihrer Deltas in die Hauptspezifikationen |
| **Änderung** | Eine vorgeschlagene Modifikation des Systems, als Ordner mit Artefakten gepackt |
| **Delta-Spezifikation** | Eine Spezifikation, die Änderungen (HINZUGEFÜGT/MODIFIZIERT/ENTFERNT) im Verhältnis zu aktuellen Spezifikationen beschreibt |
| **Bereich** | Eine logische Gruppierung für Spezifikationen (z.B. `auth/`, `payments/`) |
| **Anforderung** | Ein spezifisches Verhalten, das das System haben muss |
| **Szenario** | Ein konkretes Beispiel einer Anforderung, typischerweise im Gegeben/Wenn/Dann-Format |
| **Schema** | Eine Definition von Artefakttypen und ihren Abhängigkeiten |
| **Spezifikation** | Eine Spezifikation, die das Systemverhalten beschreibt und Anforderungen sowie Szenarien enthält |
| **Wahrheitsquelle** | Das Verzeichnis `openspec/specs/`, das die aktuell vereinbarten Verhaltensweisen enthält |

## Nächste Schritte

- [Erste Schritte](getting-started.md) - Praktische erste Schritte
- [Arbeitsabläufe](workflows.md) - Häufige Muster und wann jedes verwendet wird
- [Befehle](commands.md) - Vollständige Befehlsreferenz
- [Anpassung](customization.md) - Erstellen Sie benutzerdefinierte Schemata und konfigurieren Sie Ihr Projekt