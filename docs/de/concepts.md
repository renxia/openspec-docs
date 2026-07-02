# Konzepte

Diese Anleitung erklärt die Kernideen hinter OpenSpec und wie diese zusammenpassen. Für die praktische Nutzung siehe [Getting Started](getting-started.md) und [Workflows](workflows.md).

## Philosophie

OpenSpec basiert auf vier Prinzipien:

```
fluid not rigid         — no phase gates, work on what makes sense
iterative not waterfall — learn as you build, refine as you go
easy not complex        — lightweight setup, minimal ceremony
brownfield-first        — works with existing codebases, not just greenfield
```

### Warum diese Prinzipien wichtig sind

**Fließend statt starr.** Traditionelle Spezifikationssysteme zwingen dich zu Phasen: zuerst planst du, dann implementierst du, und dann bist du fertig. OpenSpec ist flexibler – du kannst Artefakte in jeder Reihenfolge erstellen, die für deine Arbeit sinnvoll ist.

**Iterativ statt Wasserfall.** Anforderungen ändern sich. Das Verständnis vertieft sich. Was am Anfang wie ein guter Ansatz erschien, hält möglicherweise nicht stand, nachdem man die Codebase gesehen hat. OpenSpec nimmt diese Realität an.

**Einfach statt komplex.** Einige Spezifikationsframeworks erfordern umfangreiches Setup, starre Formate oder rechenintensive Prozesse. OpenSpec greift nicht in deinen Weg ein. Initialisiere in Sekunden, beginne sofort mit der Arbeit, passe es nur an, wenn du musst.

**Brownfield-First.** Die meisten Softwarearbeiten bestehen nicht darin, von Grund auf neu zu bauen – sondern in der Modifikation bestehender Systeme. Der delta-basierte Ansatz von OpenSpec macht es einfach, Änderungen am bestehenden Verhalten zu spezifizieren, anstatt nur neue Systeme zu beschreiben.

## Das Gesamtbild

OpenSpec organisiert Ihre Arbeit in zwei Hauptbereichen:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Wahrheitsquelle    │◄─────│     Vorgeschlagene Änderungen │   │
│   │  Wie Ihr System    │ merge│  Jede Änderung = ein Ordner     │   │
│   │  aktuell funktioniert│      │  Enthält Artefakte + Deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** sind die Wahrheitsquelle – sie beschreiben, wie Ihr System derzeit funktioniert.

**Changes** (Änderungen) sind vorgeschlagene Modifikationen – sie existieren in separaten Ordnern, bis Sie bereit sind, sie zu mergen.

Diese Trennung ist entscheidend. Sie können an mehreren Änderungen parallel arbeiten, ohne dass es zu Konflikten kommt. Sie können eine Änderung überprüfen, bevor sie die Haupt-Specs beeinflusst. Und wenn Sie eine Änderung archivieren, werden ihre Deltas sauber in die Wahrheitsquelle integriert.

## Specs

Specs beschreiben das Verhalten Ihres Systems mithilfe strukturierter Anforderungen und Szenarien.

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
    └── spec.md           # UI-Verhalten und Themen (Themes)
```

Organisieren Sie Specs nach Domäne – logische Gruppierungen, die für Ihr System Sinn ergeben. Häufige Muster:

- **Nach Funktionsbereich:** `auth/`, `payments/`, `search/`
- **Nach Komponente:** `api/`, `frontend/`, `workers/`
- **Nach abgegrenztem Kontext (Bounded Context):** `ordering/`, `fulfillment/`, `inventory/`

### Spec-Format

Eine Spec enthält Anforderungen, und jede Anforderung hat Szenarien:

```markdown
# Auth Specification

## Purpose (Zweck)
Authentifizierung und Sitzungsmanagement für die Anwendung.

## Requirements (Anforderungen)

### Requirement: User Authentication (Benutzerauthentifizierung)
Das System MUSS bei erfolgreichem Login ein JWT-Token ausstellen.

#### Scenario: Valid credentials (Gültige Anmeldedaten)
- GIVEN a user with valid credentials (GEBEN einem Benutzer gültige Anmeldedaten)
- WHEN the user submits login form (WENN der Benutzer das Login-Formular sendet)
- THEN a JWT token is returned (DANN wird ein JWT-Token zurückgegeben)
- AND the user is redirected to dashboard (UND der Benutzer zum Dashboard weitergeleitet wird)

#### Scenario: Invalid credentials (Ungültige Anmeldedaten)
- GIVEN invalid credentials (GEBEN ungültige Anmeldedaten)
- WHEN the user submits login form (WENN der Benutzer das Login-Formular sendet)
- THEN an error message is displayed (DANN wird eine Fehlermeldung angezeigt)
- AND no token is issued (UND kein Token ausgestellt wird)

### Requirement: Session Expiration (Sitzungsablaufzeit)
Das System MUSS Sitzungen nach 30 Minuten Inaktivität ablaufen lassen.

#### Scenario: Idle timeout (Inaktivitätszeitüberschreitung)
- GIVEN an authenticated session (GEBEN eine authentifizierte Sitzung)
- WHEN 30 minutes pass without activity (WENN 30 Minuten ohne Aktivität vergehen)
- THEN the session is invalidated (DANN wird die Sitzung ungültig gemacht)
- AND the user must re-authenticate (UND der Benutzer muss sich erneut authentifizieren)
```

**Schlüsselkomponenten:**

| Element | Zweck |
|---------|---------|
| `## Purpose` | Hochrangige Beschreibung des Bereichs dieser Spec |
| `### Requirement:` | Ein spezifisches Verhalten, das das System haben muss |
| `#### Scenario:` | Ein konkretes Beispiel der Anforderung in Aktion |
| SHALL/MUST/SHOULD | RFC 2119-Schlüsselwörter zur Angabe der Anforderungsstärke |

### Warum Specs so strukturiert sind

**Anforderungen (Requirements) sind das „Was“** – sie geben an, was das System tun soll, ohne die Implementierung festzulegen.

**Szenarien (Scenarios) sind das „Wann“** – sie liefern konkrete Beispiele, die überprüft werden können. Gute Szenarien:
- Sind testbar (man könnte einen automatisierten Test dafür schreiben)
- Decken sowohl den Happy Path als auch Randfälle ab
- Verwenden Given/When/Then oder ein ähnliches strukturiertes Format

**RFC 2119 Schlüsselwörter** (SHALL, MUST, SHOULD, MAY) kommunizieren die Absicht:
- **MUST/SHALL** — absolute Anforderung
- **SHOULD** — empfohlen, aber Ausnahmen sind möglich
- **MAY** — optional

### Was eine Spec ist (und was sie nicht ist)

Eine Spec ist ein **Verhaltensvertrag**, kein Implementierungsplan.

Guter Spec-Inhalt:
- Beobachtbares Verhalten, auf das Benutzer oder nachgelagerte Systeme verlassen
- Eingaben, Ausgaben und Fehlerbedingungen
- Externe Einschränkungen (Sicherheit, Datenschutz, Zuverlässigkeit, Kompatibilität)
- Szenarien, die getestet oder explizit validiert werden können

Vermeiden Sie in Specs:
- Interne Klassen-/Funktionsnamen
- Bibliotheks- oder Framework-Auswahlen
- Schrittweise Implementierungsdetails
- Detaillierte Ausführungspläne (diese gehören in `design.md` oder `tasks.md`)

Kurzer Test:
- Wenn die Implementierung geändert werden kann, ohne dass das extern sichtbare Verhalten zu ändern, gehört sie wahrscheinlich nicht in die Spec.

### Halten Sie es leicht: Progressive Rigor (Schrittweise Verfeinerung)

OpenSpec zielt darauf ab, Bürokratie zu vermeiden. Verwenden Sie das leichteste Niveau, das die Änderung dennoch überprüfbar macht.

**Lite spec (Standard):**
- Kurze, verhaltensorientierte Anforderungen
- Klarer Umfang und Nicht-Ziele (Non-Goals)
- Einige konkrete Akzeptanzprüfungen

**Full spec (Für höhere Risiken):**
- Cross-Team- oder Cross-Repo-Änderungen
- API-/Vertragsänderungen, Migrationen, Sicherheits-/Datenschutzbedenken
- Änderungen, bei denen eine Ambiguität zu kostspieliger Nacharbeit führen könnte

Die meisten Änderungen sollten im Lite-Modus bleiben.

### Menschliche + Agenten-Kollaboration

In vielen Teams erforschen Menschen und erstellen Agenten die Artefakte. Der beabsichtigte Ablauf ist:

1.  Der Mensch liefert Absicht, Kontext und Einschränkungen.
2.  Der Agent wandelt dies in verhaltensorientierte Anforderungen und Szenarien um.
3.  Der Agent behält Implementierungsdetails in `design.md` und `tasks.md` und nicht in `spec.md`.
4.  Die Validierung bestätigt Struktur und Klarheit, bevor die Implementierung erfolgt.

Dies hält Specs für Menschen lesbar und für Agenten konsistent.

## Changes (Änderungen)

Eine Change ist eine vorgeschlagene Modifikation Ihres Systems, verpackt als ein Ordner mit allem, was nötig ist, um sie zu verstehen und zu implementieren.

### Änderungsstruktur

```
openspec/changes/add-dark-mode/
├── proposal.md           # Warum und was
├── design.md             # Wie (technischer Ansatz)
├── tasks.md              # Implementierungs-Checkliste
├── .openspec.yaml        # Metadaten der Änderung (optional)
└── specs/                # Delta Specs
    └── ui/
        └── spec.md       # Was in ui/spec.md geändert wird
```

Jede Change ist eigenständig. Sie enthält:
- **Artifacts** – Dokumente, die Absicht, Design und Aufgaben erfassen
- **Delta specs** – Spezifikationen dessen, was hinzugefügt, modifiziert oder entfernt wird
- **Metadata** – Optionale Konfiguration für diese spezifische Änderung

### Warum Changes Ordner sind

Die Verpackung einer Change als Ordner bietet mehrere Vorteile:

1.  **Alles zusammen.** Vorschlag, Design, Aufgaben und Specs befinden sich an einem Ort. Kein Suchen in verschiedenen Orten.
2.  **Parallele Arbeit.** Mehrere Änderungen können gleichzeitig existieren, ohne dass es zu Konflikten kommt. Arbeiten Sie an `add-dark-mode`, während `fix-auth-bug` ebenfalls im Gange ist.
3.  **Sauberer Verlauf.** Wenn sie archiviert werden, verschieben sich die Changes in `changes/archive/` wobei ihr voller Kontext erhalten bleibt. Man kann zurückblicken und nicht nur verstehen, was geändert wurde, sondern auch warum.
4.  **Überprüfungsfreundlich.** Ein Change-Ordner ist einfach zu überprüfen – öffnen Sie ihn, lesen Sie den Vorschlag, prüfen Sie das Design, sehen Sie die Spec Deltas.

## Artifacts (Artefakte)

Artefakte sind die Dokumente innerhalb einer Change, die die Arbeit leiten.

### Der Artefaktfluss

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   warum            was           wie          schritte
 + umfang        änderungen     ansatz      die zu ergreifen
```

Artefakte bauen aufeinander auf. Jedes Artefakt liefert Kontext für das nächste.

### Artefakttypen

#### Proposal (`proposal.md`)

Der Vorschlag erfasst die **Absicht**, den **Umfang** und den **Ansatz** auf einer hohen Ebene.

```markdown
# Proposal: Add Dark Mode (Dunkelmodus hinzufügen)

## Intent (Absicht)
Benutzer haben eine Dunkelmodus-Option angefordert, um Augenbelastung während der nächtlichen Nutzung zu reduzieren und die Systemeinstellungen widerzuspiegeln.

## Scope (Umfang)
Im Umfang enthalten:
- Theme-Umschalter in den Einstellungen
- Erkennung der Systemeinstellung
- Speicherung der Einstellung im localStorage

Nicht im Umfang enthalten:
- Benutzerdefinierte Farbschemata (zukünftige Arbeit)
- Themenspezifische Überschreibungen pro Seite

## Approach (Ansatz)
Verwendung von CSS Custom Properties für das Theming in Verbindung mit einem React Context zur Zustandsverwaltung. Erkennung der Systemeinstellung beim ersten Laden, Ermöglichung manueller Überschreibung.
```

**Wann den Vorschlag aktualisieren:**
- Änderungen des Umfangs (Einschränken oder Ausweiten)
- Klärung der Absicht (besseres Verständnis des Problems)
- Fundamentale Verschiebung des Ansatzes

#### Specs (Delta Specs in `specs/`)

Delta Specs beschreiben, **was sich im Vergleich zu den aktuellen Specs ändert**. Siehe [Delta Specs](#delta-specs) unten.

#### Design (`design.md`)

Das Design erfasst den **technischen Ansatz** und die **Architekturentscheidungen**.

````markdown
# Design: Add Dark Mode (Dunkelmodus hinzufügen)

## Technical Approach (Technischer Ansatz)
Theme-Zustand wird über React Context verwaltet, um Prop Drilling zu vermeiden. CSS Custom Properties ermöglichen das Umschalten zur Laufzeit ohne Klassenumschaltung.

## Architecture Decisions (Architekturentscheidungen)

### Decision: Context over Redux (Context statt Redux)
Verwendung von React Context für den Theme-Zustand, weil:
- Einfacher binärer Zustand (hell/dunkel)
- Keine komplexen Zustandsübergänge
- Vermeidung der Hinzufügung einer Redux-Abhängigkeit

### Decision: CSS Custom Properties (CSS Custom Properties)
Verwendung von CSS-Variablen anstelle von CSS-in-JS, weil:
- Funktioniert mit dem bestehenden Stylesheet
- Kein Laufzeit-Overhead
- Browser-native Lösung

## Data Flow (Datenfluss)
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (angewendet auf :root)
```

## File Changes (Dateianpassungen)
- `src/contexts/ThemeContext.tsx` (neu)
- `src/components/ThemeToggle.tsx` (neu)
- `src/styles/globals.css` (modifiziert)
````

**Wann das Design aktualisieren:**
- Die Implementierung zeigt, dass der Ansatz nicht funktioniert
- Eine bessere Lösung wurde gefunden
- Abhängigkeiten oder Einschränkungen ändern sich

#### Tasks (`tasks.md`)

Tasks sind die **Implementierungs-Checkliste** – konkrete Schritte mit Kontrollkästchen.

```markdown
# Tasks (Aufgaben)

## 1. Theme Infrastructure (Themen-Infrastruktur)
- [ ] 1.1 Create ThemeContext with light/dark state (Erstellen Sie ThemeContext mit hell/dunkel Zustand)
- [ ] 1.2 Add CSS custom properties for colors (Fügen Sie CSS Custom Properties für Farben hinzu)
- [ ] 1.3 Implement localStorage persistence (Implementieren Sie die Speicherung in localStorage)
- [ ] 1.4 Add system preference detection (Fügen Sie die Erkennung der Systemeinstellung hinzu)

## 2. UI Components (UI-Komponenten)
- [ ] 2.1 Create ThemeToggle component (Erstellen Sie die ThemeToggle Komponente)
- [ ] 2.2 Add toggle to settings page (Fügen Sie den Umschalter zur Einstellungsseite hinzu)
- [ ] 2.3 Update Header to include quick toggle (Aktualisieren Sie den Header, um einen schnellen Umschalter einzubinden)

## 3. Styling (Styling)
- [ ] 3.1 Define dark theme color palette (Definieren Sie die Farbpalette für das dunkle Theme)
- [ ] 3.2 Update components to use CSS variables (Aktualisieren Sie Komponenten, um CSS Variablen zu verwenden)
- [ ] 3.3 Test contrast ratios for accessibility (Testen Sie Kontrastverhältnisse für Barrierefreiheit)
```

**Best Practices für Aufgaben:**
- Gruppieren Sie verwandte Aufgaben unter Überschriften
- Verwenden Sie hierarchische Nummerierung (1.1, 1.2 usw.)
- Halten Sie die Aufgaben so klein, dass sie in einer Sitzung erledigt werden können
- Setzen Sie Aufgaben als erledigt, sobald Sie sie abgeschlossen haben

## Delta Specs

Delta Specs sind das Schlüsselkonzept, das OpenSpec für Brownfield-Entwicklung funktionsfähig macht. Sie beschreiben, **was sich ändert**, anstatt die gesamte Spec erneut darzulegen.

### Das Format

```markdown
# Delta for Auth (Delta für Auth)

## ADDED Requirements (HINZUGEFÜGTE Anforderungen)

### Requirement: Two-Factor Authentication (Zwei-Faktor-Authentifizierung)
Das System MUSS TOTP-basierte Zwei-Faktor-Authentifizierung unterstützen.

#### Scenario: 2FA enrollment (2FA-Anmeldung)
- GIVEN a user without 2FA enabled (GEBEN einem Benutzer, der 2FA nicht aktiviert hat)
- WHEN the user enables 2FA in settings (WENN der Benutzer 2FA in den Einstellungen aktiviert)
- THEN a QR code is displayed for authenticator app setup (DANN wird ein QR-Code für die Einrichtung der Authentifikator-App angezeigt)
- AND the user must verify with a code before activation (UND der Benutzer muss vor der Aktivierung mit einem Code verifizieren)

#### Scenario: 2FA login (2FA-Login)
- GIVEN a user with 2FA enabled (GEBEN einem Benutzer, der 2FA aktiviert hat)
- WHEN the user submits valid credentials (WENN der Benutzer gültige Anmeldedaten sendet)
- THEN an OTP challenge is presented (DANN wird eine OTP-Herausforderung präsentiert)
- AND login completes only after valid OTP (UND der Login wird erst nach dem gültigen OTP abgeschlossen)

## MODIFIED Requirements (GEÄNDERTE Anforderungen)

### Requirement: Session Expiration (Sitzungsablaufzeit)
Das System MUSS Sitzungen nach 15 Minuten Inaktivität ablaufen lassen.
(Zuvor: 30 Minuten)

#### Scenario: Idle timeout (Inaktivitätszeitüberschreitung)
- GIVEN an authenticated session (GEBEN eine authentifizierte Sitzung)
- WHEN 15 minutes pass without activity (WENN 15 Minuten ohne Aktivität vergehen)
- THEN the session is invalidated (DANN wird die Sitzung ungültig gemacht)

## REMOVED Requirements (ENTFERNTE Anforderungen)

### Requirement: Remember Me (Denken Sie daran)
(Veraltet zugunsten von 2FA. Benutzer sollten jede Sitzung erneut authentifizieren.)
```

### Delta-Abschnitte

| Abschnitt | Bedeutung | Was passiert beim Archivieren |
|---------|---------|------------------------|
| `## ADDED Requirements` | Neues Verhalten | Wird der Hauptspec angehängt |
| `## MODIFIED Requirements` | Geändertes Verhalten | Ersetzt die bestehende Anforderung |
| `## REMOVED Requirements` | Veraltetes Verhalten | Wird aus dem Hauptspec gelöscht |

### Warum Deltas statt Voll-Specs

**Klarheit.** Ein Delta zeigt genau, was sich ändert. Beim Lesen einer vollständigen Spec müsste man sie mental mit der aktuellen Version abgleichen.

**Konfliktvermeidung.** Zwei Änderungen können dieselbe Spec-Datei berühren, ohne in Konflikt zu geraten, solange sie unterschiedliche Anforderungen modifizieren.

**Effizienz bei der Überprüfung.** Prüfer sehen die Änderung und nicht den unveränderten Kontext. Der Fokus liegt auf dem, was wichtig ist.

**Passung für Brownfield.** Die meisten Arbeit ändert bestehendes Verhalten. Deltas machen Modifikationen zur Erstklassigkeit, nicht zu einem Nachgedanken.

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
    requires: [proposal]      # Benötigt proposal, bevor es erstellt wird

  - id: design
    generates: design.md
    requires: [proposal]      # Kann parallel mit specs erstellt werden

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Benötigt sowohl specs als auch design zuerst
```

**Artefakte bilden einen Abhängigkeitsgraphen:**

```
                    proposal
                   (root node)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (requires:                  (requires:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (requires:
                specs, design)
```

**Abhängigkeiten sind Ermöglicher, keine Gatekeeper.** Sie zeigen auf, was erstellt werden kann, nicht was Sie als Nächstes erstellen müssen. Sie können das Design überspringen, wenn es nicht benötigt wird. Sie können specs vor oder nach dem Design erstellen – beide hängen nur von proposal ab.

### Eingebaute Schemas

**spec-driven** (Standard)

Der Standardworkflow für spec-driven Entwicklung:

```
proposal → specs → design → tasks → implement
```

Am besten geeignet für: Die meisten Feature-Arbeiten, bei denen Sie sich auf die Spezifikationen einigen möchten, bevor Sie mit der Implementierung beginnen.

### Benutzerdefinierte Schemas

Erstellen Sie benutzerdefinierte Schemas für den Workflow Ihres Teams:

```bash
# Von Grund auf
openspec schema init research-first

# Oder ein bestehendes forken
openspec schema fork spec-driven research-first
```

**Beispiel eines benutzerdefinierten Schemas:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Zuerst Forschung betreiben

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal basiert auf der Forschung

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Specs/Design überspringen, direkt zu Tasks gehen
```

Siehe [Customization](customization.md) für vollständige Details zur Erstellung und Verwendung benutzerdefinierter Schemas.

## Archive

Archivierung vervollständigt eine Änderung, indem sie deren Delta-Spezifikationen in die Hauptspezifikationen integriert und die Änderung für die Historie bewahrt.

### Was passiert bei der Archivierung

```
Vor der Archivierung:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ merge
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
        └── 2025-01-24-add-2fa/    # Bewahrt für die Historie
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Der Archivierungsprozess

1. **Mergen von Deltas.** Jeder Delta-Spezifikationsabschnitt (HINGEFÜGT/GEÄNDERT/ENTFERNT) wird auf die entsprechende Hauptspezifikation angewendet.

2. **Verschieben in das Archiv.** Der Änderungsordner wird nach `changes/archive/` verschoben und erhält einen Datumspräfix für die chronologische Sortierung.

3. **Kontext bewahren.** Alle Artefakte bleiben im Archiv intakt. Sie können jederzeit zurückblicken, um zu verstehen, warum eine Änderung vorgenommen wurde.

### Warum Archivierung wichtig ist

**Sauberer Zustand.** Aktuelle Änderungen (`changes/`) zeigen nur den Arbeitsfortschritt. Abgeschlossene Arbeit wird beiseite geräumt.

**Audit Trail (Prüfprotokoll).** Das Archiv bewahrt den vollständigen Kontext jeder Änderung – nicht nur, *was* sich geändert hat, sondern auch das Proposal, das erklärt, *warum*, das Design, das erklärt, *wie*, und die Tasks, die die erledigte Arbeit zeigen.

**Spec Evolution (Spezifikationsentwicklung).** Spezifikationen wachsen organisch, wenn Änderungen archiviert werden. Jedes Archiv integriert seine Deltas und baut so eine umfassende Spezifikation über die Zeit auf.

## Wie alles zusammenpasst

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (core) or /opsx:new (expanded)           │
│   │     CHANGE     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREATE     │  /opsx:ff or /opsx:continue (expanded workflow)         │
│   │     ARTIFACTS  │  Erstellt proposal → specs → design → tasks              │
│   │                │  (basierend auf Schema-Abhängigkeiten)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENT  │  /opsx:apply                                            │
│   │     TASKS      │  Arbeiten an den Tasks, diese abhaken                         │
│   │                │◄──── Artefakte aktualisieren, während Sie lernen                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFY     │  /opsx:verify (optional)                                │
│   │     WORK       │  Überprüfen, ob die Implementierung den Specs entspricht      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVE    │────►│  Delta-Spezifikationen werden in die Hauptspezifikationen integriert │    │
│   │     CHANGE     │     │  Der Änderungsordner wird nach archive/ verschoben       │    │
│   └────────────────┘     │  Die Specs sind nun die aktualisierte Quelle der Wahrheit   │    │
│                                                                              └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Der Tugendkreis:**

1. Spezifikationen beschreiben das aktuelle Verhalten
2. Änderungen schlagen Modifikationen vor (als Deltas)
3. Die Implementierung macht die Änderungen real
4. Archivierung integriert Deltas in die Spezifikationen
5. Spezifikationen beschreiben nun das neue Verhalten
6. Die nächste Änderung baut auf den aktualisierten Spezifikationen auf

## Glossar

| Begriff | Definition |
|------|------------|
| **Artifact** | Ein Dokument innerhalb einer Änderung (proposal, design, tasks oder delta specs) |
| **Archive** | Der Prozess der Vervollständigung einer Änderung und des Zusammenführens ihrer Deltas in die Hauptspezifikationen |
| **Change** | Eine vorgeschlagene Modifikation des Systems, verpackt als Ordner mit Artefakten |
| **Delta spec** | Eine Spezifikation, die Änderungen (HINGEFÜGT/GEÄNDERT/ENTFERNT) im Verhältnis zu den aktuellen Specs beschreibt |
| **Domain** | Eine logische Gruppierung für Specs (z. B. `auth/`, `payments/`) |
| **Requirement** | Ein spezifisches Verhalten, das das System haben muss |
| **Scenario** | Ein konkretes Beispiel für eine Anforderung, typischerweise im Given/When/Then-Format |
| **Schema** | Eine Definition der Artefakttypen und ihrer Abhängigkeiten |
| **Spec** | Eine Spezifikation, die das Systemverhalten beschreibt und Anforderungen sowie Szenarien enthält |
| **Source of truth** | Das `openspec/specs/` Verzeichnis, welches das aktuell vereinbarte Verhalten enthält |

## Nächste Schritte

- [Getting Started](getting-started.md) - Praktische erste Schritte
- [Workflows](workflows.md) - Häufige Muster und wann welche zu verwenden ist
- [Commands](commands.md) - Vollständige Befehlsreferenz
- [Customization](customization.md) - Erstellen benutzerdefinierter Schemas und Konfigurieren Ihres Projekts