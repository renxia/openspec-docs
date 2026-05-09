# Konzepte

Diese Anleitung erklärt die grundlegenden Ideen hinter OpenSpec und wie sie zusammenpassen. Für die praktische Anwendung siehe [Erste Schritte](getting-started.md) und [Workflows](workflows.md).

## Philosophie

OpenSpec basiert auf vier Prinzipien:

```
flüssig nicht starr         — keine Phasentore, arbeiten Sie an dem, was sinnvoll ist
iterativ nicht Wasserfall   — lernen Sie während des Bauens, verfeinern Sie unterwegs
einfach nicht komplex       — leichtgewichtige Einrichtung, minimale Formalitäten
brownfield-first            — funktioniert mit bestehenden Codebasen, nicht nur bei Greenfield-Projekten
```

### Warum diese Prinzipien wichtig sind

**Flüssig nicht starr.** Traditionelle Spezifikationssysteme zwingen Sie in Phasen: Zuerst planen Sie, dann implementieren Sie, dann sind Sie fertig. OpenSpec ist flexibler – Sie können Artefakte in jeder für Ihre Arbeit sinnvollen Reihenfolge erstellen.

**Iterativ nicht Wasserfall.** Anforderungen ändern sich. Das Verständnis vertieft sich. Was zu Beginn wie ein guter Ansatz schien, hält möglicherweise nicht stand, nachdem Sie die Codebasis gesehen haben. OpenSpec akzeptiert diese Realität.

**Einfach nicht komplex.** Einige Spezifikations-Frameworks erfordern umfangreiche Einrichtung, starre Formate oder schwergewichtige Prozesse. OpenSpec steht Ihnen nicht im Weg. Initialisierung in Sekunden, sofortige Arbeitsaufnahme, Anpassung nur bei Bedarf.

**Brownfield-first.** Die meisten Softwarearbeiten bestehen nicht im Neuaufbau – sondern in der Modifikation bestehender Systeme. Der delta-basierte Ansatz von OpenSpec erleichtert die Spezifikation von Änderungen am bestehenden Verhalten, nicht nur die Beschreibung neuer Systeme.

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

**Specs** sind die Quelle der Wahrheit – sie beschreiben, wie sich Ihr System aktuell verhält.

**Changes** sind vorgeschlagene Änderungen – sie liegen in separaten Ordnern, bis Sie bereit sind, sie zusammenzuführen.

Diese Trennung ist der Schlüssel. Sie können parallel an mehreren Änderungen arbeiten, ohne Konflikte. Sie können eine Änderung überprüfen, bevor sie die Haupt-Specs beeinflusst. Und wenn Sie eine Änderung archivieren, führen sich ihre Deltas sauber in die Quelle der Wahrheit zusammen.

## Koordinations-Workspaces

Die Workspace-Unterstützung befindet sich in aktiver Entwicklung und ist noch nicht einsatzbereit. Bauen Sie keine externen Automatisierungen, Integrationen oder langfristigen Workflows auf das Workspace-Verhalten auf; die Befehle, Statusdateien und die JSON-Ausgabe können sich jederzeit ändern.

Die folgenden Befehle bieten den ersten Einrichtungsablauf für die Planung über verknüpfte Repos oder Ordner hinweg.

Repo-lokale OpenSpec-Projekte sind die richtige Voreinstellung, wenn ein Repo den Planungs-, Implementierungs- und Archivierungsablauf besitzt. Manche Arbeiten erstrecken sich über mehrere Repos oder Ordner. Für diesen Fall ist ein OpenSpec-Koordinations-Workspace die dauerhafte Planungsheimat.

Das mentale Modell des Workspaces ist:

```text
workspace = wo verwandte repo-übergreifende Änderungen leben
link      = ein stabiler Name für ein Repo oder einen Ordner, gegen den der Workspace planen kann
change    = ein Feature, eine Korrektur, ein Projekt oder eine andere geplante Arbeitseinheit
```

Ein Workspace hat eine andere Struktur als ein repo-lokales Projekt:

```text
workspace-folder/
├── changes/                       # Workspace-weite Planung
└── .openspec-workspace/
    ├── workspace.yaml             # Gemeinsame Workspace-Identität und Link-Namen
    └── local.yaml                 # Lokale Pfade dieser Maschine
```

Repo-lokaler OpenSpec-Status behält die bestehende Struktur bei:

```text
repo-root/
└── openspec/
    ├── specs/
    └── changes/
```

Diese Unterscheidung ist wichtig. Der Workspace-Ordner ist eine Koordinationsoberfläche für die Planung über verknüpfte Repos oder Ordner hinweg. Das `openspec/`-Verzeichnis jedes Repos bleibt die Heimat für repo-eigene Specs, repo-lokale Änderungen und Implementierungsplanung. Benutzer müssen kein repo-lokales `openspec init` innerhalb eines Workspace-Ordners ausführen.

Stabile Link-Namen sind die Art, wie die Workspace-Planung auf Repos und Ordner verweist. Der gemeinsame Workspace-Status speichert Namen wie `api`, `web` oder `checkout`; jede Maschine ordnet diese Namen ihren eigenen lokalen Pfaden in `.openspec-workspace/local.yaml` zu.

```yaml
# .openspec-workspace/workspace.yaml
version: 1
name: platform
links:
  api: {}
  web: {}
```

```yaml
# .openspec-workspace/local.yaml
version: 1
paths:
  api: /repos/api
  web: /repos/web
```

Von OpenSpec erstellte Workspaces schließen `.openspec-workspace/local.yaml` standardmäßig vom portablen Kollaborationsstatus aus. `.openspec-workspace/workspace.yaml` bleibt portabel, da es den Workspace-Namen und stabile Link-Namen speichert, nicht die absoluten Checkout-Pfade eines einzelnen Benutzers.

Verknüpfte Pfade können ganze Repos, Ordner innerhalb eines großen Monorepos oder andere bestehende Ordner sein. Sie benötigen keinen repo-lokalen `openspec/`-Status, bevor sie an der Workspace-Planung teilnehmen können. Spätere Implementierungs-, Verifizierungs- oder Archivierungsworkflows erfordern möglicherweise mehr Repo-Bereitschaft, aber die Planungssichtbarkeit beginnt mit dem Link.

```text
multi-repo:
  api      -> /repos/api
  web      -> /repos/web

large monorepo:
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

Verwaltete Workspaces leben unter dem Standard-OpenSpec-Datenverzeichnis:

```text
getGlobalDataDir()/workspaces
```

Das bedeutet `$XDG_DATA_HOME/openspec/workspaces`, wenn `XDG_DATA_HOME` gesetzt ist, `~/.local/share/openspec/workspaces` als Unix-Standardrückgriff und `%LOCALAPPDATA%\openspec\workspaces` als nativer Windows-Rückgriff. Native Windows-Shells, PowerShell und WSL2 speichern jeweils die Pfadzeichenketten für die Laufzeit, die OpenSpec ausführt. Diese Grundlage übersetzt nicht zwischen `D:\repo`, `/mnt/d/repo` und UNC-WSL-Pfaden.

OpenSpec führt auch ein maschinenlokales Register unter:

```text
getGlobalDataDir()/workspaces/registry.yaml
```

Das Register ordnet Workspace-Namen Workspace-Standorten zu, sodass spätere globale Befehle bekannte Workspaces von überall auflisten oder auswählen können. Es ist nur ein Index. Jeder Workspace-Ordner bleibt maßgebend für seine eigene `.openspec-workspace/workspace.yaml` und `.openspec-workspace/local.yaml`, sodass veraltete Registereinträge gemeldet und repariert werden können, ohne den Workspace selbst neu zu definieren.

Workspace-Sichtbarkeit ist keine Änderungsverpflichtung. Richten Sie einen Workspace ein, wenn OpenSpec wissen soll, welche Repos oder Ordner relevant sind; erstellen Sie eine Änderung später, wenn Sie bereit sind, ein Feature, eine Korrektur, ein Projekt oder eine andere Arbeitseinheit zu planen.

Nützliche Befehle:

```bash
# Geführte Einrichtung
openspec workspace setup

# Automatisierungsfreundliche Einrichtung
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex

# Bekannte Workspaces aus dem lokalen Register anzeigen
openspec workspace list
openspec workspace ls

# Links für den ausgewählten Workspace hinzufügen oder reparieren
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Überprüfen, was diese Maschine auflösen kann
openspec workspace doctor
openspec workspace doctor --workspace platform

# Den verknüpften Arbeitsbereich öffnen
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor
```

`workspace setup` erstellt den Workspace immer am Standard-Workspace-Standort, trägt ihn im lokalen Register ein, zeigt den Workspace-Standort an und erfordert mindestens ein verknüpftes Repo oder einen Ordner. Die interaktive Einrichtung fragt nach einem bevorzugten Opener. Die nicht-interaktive Einrichtung speichert einen nur, wenn `--opener codex`, `--opener claude`, `--opener github-copilot` oder `--opener editor` angegeben wird.

OpenSpec pflegt auch Workspace-öffnende Dateien im Root: einen von OpenSpec verwalteten Guidance-Block in `AGENTS.md`, eine maschinenlokale `<workspace-name>.code-workspace`-Datei für VS Code und GitHub Copilot-in-VS-Code-Öffnungen sowie einen spezifischen Ignore-Eintrag für diese gepflegte `.code-workspace`-Datei. Vom Benutzer erstellte `*.code-workspace`-Dateien bleiben verfolgbar, da die Ignore-Regel nur auf die gepflegte Datei abzielt.

Die gepflegte VS Code Workspace-Datei enthält den Koordinations-Root als `.` plus gültige verknüpfte Repos oder Ordner als zusätzliche Roots. VS Code zeigt diese Einträge als Multi-Root-Workspace an.

`workspace open` öffnet den verknüpften Arbeitsbereich mit dem gespeicherten bevorzugten Opener, es sei denn, `--agent <tool>` oder `--editor` wird für diese eine Sitzung übergeben. Beide Opener-Overrides zu übergeben ist ein Fehler. Das Öffnen des Root-Workspaces macht verknüpfte Repos und Ordner für Exploration und Planung sichtbar; die Implementierung beginnt, nachdem der Benutzer explizit nach Implementierungsarbeit fragt.

`workspace link` und `workspace relink` zeichnen nur bestehende Ordner auf; sie erstellen, kopieren, verschieben, initialisieren oder bearbeiten das verknüpfte Repo oder den Ordner nicht. Nach einem erfolgreichen Link oder Relink aktualisiert OpenSpec die verwaltete Guidance, die VS Code Workspace-Datei und die Ignore-Regel.

Workspace-Befehle, die einen Workspace benötigen, können von überall mit `--workspace <name>` ausgeführt werden. Wenn Sie sie innerhalb eines Workspace-Ordners oder Unterverzeichnisses ausführen, verwendet OpenSpec diesen aktuellen Workspace. Wenn mehrere bekannte Workspaces verfügbar sind und Sie `--workspace <name>` nicht übergeben, zeigen menschliche Befehle eine Auswahl an; `--json` und `--no-interactive` schlagen mit einem strukturierten Statusfehler fehl, anstatt nachzufragen.

Direkte Workspace-Befehle unterstützen JSON-Ausgabe für Skripte. JSON-Antworten halten primäre Daten in `workspace`, `workspaces` oder `link`-Objekten und melden Warnungen oder Fehler in `status`-Arrays. Gesunde Objekte verwenden `status: []`.

## Specs

Specs beschreiben das Verhalten Ihres Systems unter Verwendung strukturierter Anforderungen und Szenarien.

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

Organisieren Sie Specs nach Domäne – logische Gruppierungen, die für Ihr System sinnvoll sind. Gängige Muster:

- **Nach Feature-Bereich**: `auth/`, `payments/`, `search/`
- **Nach Komponente**: `api/`, `frontend/`, `workers/`
- **Nach begrenztem Kontext**: `ordering/`, `fulfillment/`, `inventory/`

### Spec-Format

Eine Spec enthält Anforderungen, und jede Anforderung hat Szenarien:

```markdown
# Auth-Spezifikation
```

## Zweck
Authentifizierung und Sitzungsverwaltung für die Anwendung.

## Anforderungen

### Anforderung: Benutzer-Authentifizierung
Das System MUSS bei erfolgreicher Anmeldung ein JWT-Token ausstellen.

#### Szenario: Gültige Anmeldedaten
- ANGENOMMEN ein Benutzer mit gültigen Anmeldedaten
- WENN der Benutzer das Anmeldeformular absendet
- DANN wird ein JWT-Token zurückgegeben
- UND der Benutzer wird zum Dashboard weitergeleitet

#### Szenario: Ungültige Anmeldedaten
- ANGENOMMEN ungültige Anmeldedaten
- WENN der Benutzer das Anmeldeformular absendet
- DANN wird eine Fehlermeldung angezeigt
- UND kein Token wird ausgestellt

### Anforderung: Sitzungsablauf
Das System MUSS Sitzungen nach 30 Minuten Inaktivität ablaufen lassen.

#### Szenario: Leerlauf-Timeout
- ANGENOMMEN eine authentifizierte Sitzung
- WENN 30 Minuten ohne Aktivität vergehen
- DANN wird die Sitzung ungültig
- UND der Benutzer muss sich erneut authentifizieren
```

**Schlüsselelemente:**

| Element | Zweck |
|---------|-------|
| `## Purpose` | Übergeordnete Beschreibung des Bereichs dieser Spezifikation |
| `### Requirement:` | Ein bestimmtes Verhalten, das das System haben muss |
| `#### Scenario:` | Ein konkretes Beispiel der Anforderung in Aktion |
| SHALL/MUST/SHOULD | RFC-2119-Schlüsselwörter zur Angabe der Anforderungsstärke |

### Warum Spezifikationen so strukturiert werden

**Anforderungen sind das „Was"** – sie beschreiben, was das System tun soll, ohne die Implementierung festzulegen.

**Szenarien sind das „Wann"** – sie liefern konkrete Beispiele, die überprüft werden können. Gute Szenarien:
- Sind testbar (man könnte einen automatisierten Test dafür schreiben)
- Decken sowohl den Happy Path als auch Randfälle ab
- Verwenden das Format Gegeben/Wenn/Dann oder eine ähnliche strukturierte Form

**RFC-2119-Schlüsselwörter** (SHALL, MUST, SHOULD, MAY) kommunizieren die Absicht:
- **MUST/SHALL** – absolute Anforderung
- **SOLL** – empfohlen, aber Ausnahmen sind möglich
- **KANN** – optional

### Was eine Spezifikation ist (und was nicht)

Eine Spezifikation ist ein **Verhaltensvertrag**, kein Implementierungsplan.

Guter Spezifikationsinhalt:
- Beobachtbares Verhalten, auf das Benutzer oder nachgelagerte Systeme angewiesen sind
- Eingaben, Ausgaben und Fehlerbedingungen
- Externe Einschränkungen (Sicherheit, Datenschutz, Zuverlässigkeit, Kompatibilität)
- Szenarien, die getestet oder explizit validiert werden können

Was in Spezifikationen vermieden werden sollte:
- Interne Klassen-/Funktionsnamen
- Bibliotheks- oder Framework-Wahl
- Schritt-für-Schritt-Implementierungsdetails
- Detaillierte Ausführungspläne (diese gehören in `design.md` oder `tasks.md`)

Schnelltest:
- Wenn sich die Implementierung ändern kann, ohne dass sich das nach außen sichtbare Verhalten ändert, gehört es wahrscheinlich nicht in die Spezifikation.

### Leichtgewichtig halten: Progressive Strenge

OpenSpec zielt darauf ab, Bürokratie zu vermeiden. Verwenden Sie die leichteste Stufe, die die Änderung noch überprüfbar macht.

**Lite-Spezifikation (Standard):**
- Kurze verhaltensorientierte Anforderungen
- Klarer Umfang und Nicht-Ziele
- Einige konkrete Akzeptanzprüfungen

**Vollständige Spezifikation (für höheres Risiko):**
- Team- oder Repository-übergreifende Änderungen
- API-/Vertragsänderungen, Migrationen, Sicherheits-/Datenschutzbedenken
- Änderungen, bei denen Mehrdeutigkeit wahrscheinlich zu kostspieliger Nacharbeit führt

Die meisten Änderungen sollten im Lite-Modus bleiben.

### Mensch + Agent Zusammenarbeit

In vielen Teams erkunden Menschen und Agenten entwerfen Artefakte. Die beabsichtigte Schleife ist:

1. Der Mensch liefert Absicht, Kontext und Einschränkungen.
2. Der Agent wandelt dies in verhaltensorientierte Anforderungen und Szenarien um.
3. Der Agent hält Implementierungsdetails in `design.md` und `tasks.md`, nicht in `spec.md`.
4. Die Validierung bestätigt Struktur und Klarheit vor der Implementierung.

Dies hält Spezifikationen für Menschen lesbar und für Agenten konsistent.

## Änderungen

Eine Änderung ist eine vorgeschlagene Modifikation Ihres Systems, die als Ordner mit allem gepackt ist, was zum Verständnis und zur Umsetzung benötigt wird.

### Struktur einer Änderung

```
openspec/changes/add-dark-mode/
├── proposal.md           # Warum und was
├── design.md             # Wie (technischer Ansatz)
├── tasks.md              # Implementierungs-Checkliste
├── .openspec.yaml        # Änderungs-Metadaten (optional)
└── specs/                # Delta-Spezifikationen
    └── ui/
        └── spec.md       # Was sich in ui/spec.md ändert
```

Jede Änderung ist in sich geschlossen. Sie enthält:
- **Artefakte** — Dokumente, die Absicht, Design und Aufgaben erfassen
- **Delta-Spezifikationen** — Spezifikationen für das, was hinzugefügt, geändert oder entfernt wird
- **Metadaten** — optionale Konfiguration für diese spezifische Änderung

### Warum Änderungen Ordner sind

Das Packen einer Änderung als Ordner bietet mehrere Vorteile:

1. **Alles zusammen.** Proposal, Design, Aufgaben und Spezifikationen befinden sich an einem Ort. Kein Suchen an verschiedenen Stellen.

2. **Parallele Arbeit.** Mehrere Änderungen können gleichzeitig existieren, ohne sich zu überschneiden. Arbeiten Sie an `add-dark-mode`, während `fix-auth-bug` ebenfalls in Bearbeitung ist.

3. **Saubere Historie.** Wenn archiviert, werden Änderungen mit ihrem vollständigen Kontext nach `changes/archive/` verschoben. Sie können zurückblicken und verstehen, nicht nur was sich geändert hat, sondern auch warum.

4. **Review-freundlich.** Ein Änderungsordner ist leicht zu prüfen — öffnen Sie ihn, lesen Sie das Proposal, prüfen Sie das Design, sehen Sie die Spezifikations-Deltas.

## Artefakte

Artefakte sind die Dokumente innerhalb einer Änderung, die die Arbeit leiten.

### Der Artefakt-Fluss

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Artefakte bauen aufeinander auf. Jedes Artefakt liefert Kontext für das nächste.

### Artefakt-Typen

#### Proposal (`proposal.md`)

Das Proposal erfasst **Absicht**, **Umfang** und **Ansatz** auf hoher Ebene.

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage and match system preferences.

## Scope
In scope:
- Theme toggle in settings
- System preference detection
- Persist preference in localStorage

Out of scope:
- Custom color themes (future work)
- Per-page theme overrides

## Approach
Use CSS custom properties for theming with a React context
for state management. Detect system preference on first load,
allow manual override.
```

**Wann das Proposal aktualisiert werden sollte:**
- Der Umfang ändert sich (Eingrenzung oder Erweiterung)
- Die Absicht klärt sich (besseres Verständnis des Problems)
- Der Ansatz ändert sich grundlegend

#### Spezifikationen (Delta-Spezifikationen in `specs/`)

Delta-Spezifikationen beschreiben, **was sich ändert**, bezogen auf die aktuellen Spezifikationen. Siehe [Delta-Spezifikationen](#delta-specs) unten.

#### Design (`design.md`)

Das Design erfasst den **technischen Ansatz** und **Architekturentscheidungen**.

````markdown
# Design: Add Dark Mode

## Technical Approach
Theme state managed via React Context to avoid prop drilling.
CSS custom properties enable runtime switching without class toggling.

## Architecture Decisions

### Decision: Context over Redux
Using React Context for theme state because:
- Simple binary state (light/dark)
- No complex state transitions
- Avoids adding Redux dependency

### Decision: CSS Custom Properties
Using CSS variables instead of CSS-in-JS because:
- Works with existing stylesheet
- No runtime overhead
- Browser-native solution

## Data Flow
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes
- `src/contexts/ThemeContext.tsx` (new)
- `src/components/ThemeToggle.tsx` (new)
- `src/styles/globals.css` (modified)
````

**Wann das Design aktualisiert werden sollte:**
- Die Implementierung zeigt, dass der Ansatz nicht funktioniert
- Eine bessere Lösung wird entdeckt
- Abhängigkeiten oder Einschränkungen ändern sich

#### Aufgaben (`tasks.md`)

Aufgaben sind die **Implementierungs-Checkliste** — konkrete Schritte mit Kontrollkästchen.

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence
- [ ] 1.4 Add system preference detection

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
- [ ] 3.3 Test contrast ratios for accessibility
```

**Best Practices für Aufgaben:**
- Gruppieren Sie verwandte Aufgaben unter Überschriften
- Verwenden Sie hierarchische Nummerierung (1.1, 1.2 usw.)
- Halten Sie Aufgaben klein genug, um sie in einer Sitzung abzuschließen
- Haken Sie Aufgaben ab, sobald Sie sie erledigt haben

## Delta-Spezifikationen

Delta-Spezifikationen sind das Schlüsselkonzept, das OpenSpec für die Weiterentwicklung bestehender Systeme (Brownfield-Entwicklung) nutzbar macht. Sie beschreiben, **was sich ändert**, anstatt die gesamte Spezifikation zu wiederholen.

### Das Format

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup
- AND the user must verify with a code before activation

#### Scenario: 2FA login
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented
- AND login completes only after valid OTP

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users should re-authenticate each session.)
```

### Delta-Abschnitte

| Abschnitt | Bedeutung | Was beim Archivieren passiert |
|---------|---------|------------------------|
| `## ADDED Requirements` | Neues Verhalten | An die Hauptspezifikation angehängt |
| `## MODIFIED Requirements` | Geändertes Verhalten | Ersetzt bestehende Anforderung |
| `## REMOVED Requirements` | Veraltetes Verhalten | Aus der Hauptspezifikation gelöscht |

### Warum Deltas statt vollständiger Spezifikationen

**Klarheit.** Ein Delta zeigt genau, was sich ändert. Bei einer vollständigen Spezifikation müssten Sie diese gedanklich gegen die aktuelle Version differenzieren.

**Konfliktvermeidung.** Zwei Änderungen können dieselbe Spezifikationsdatei betreffen, ohne sich zu überschneiden, solange sie unterschiedliche Anforderungen modifizieren.

**Review-Effizienz.** Reviewer sehen die Änderung, nicht den unveränderten Kontext. Der Fokus liegt auf dem, was wichtig ist.

**Passend für Brownfield-Entwicklung.** Die meisten Arbeiten modifizieren bestehendes Verhalten. Deltas machen Modifikationen zum primären Konzept, nicht zum Nachgedanken.

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

**Abhängigkeiten sind Ermöglicher, keine Tore.** Sie zeigen, was erstellt werden kann, nicht was als nächstes erstellt werden muss. Sie können design überspringen, wenn Sie es nicht benötigen. Sie können specs vor oder nach design erstellen – beide hängen nur von proposal ab.

### Integrierte Schemas

**spec-driven** (Standard)

Der Standard-Workflow für spezifikationsgetriebene Entwicklung:

```
proposal → specs → design → tasks → implement
```

Am besten geeignet für: Die meisten Feature-Arbeiten, bei denen Sie sich vor der Implementierung auf Spezifikationen einigen möchten.

### Benutzerdefinierte Schemas

Erstellen Sie benutzerdefinierte Schemas für den Workflow Ihres Teams:

```bash
# Von Grund auf neu erstellen
openspec schema init research-first

# Oder ein vorhandenes forken
openspec schema fork spec-driven research-first
```

**Beispiel für ein benutzerdefiniertes Schema:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Zuerst recherchieren

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal basierend auf Recherche

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Specs/Design überspringen, direkt zu Tasks
```

Weitere Details zur Erstellung und Verwendung benutzerdefinierter Schemas finden Sie unter [Anpassung](customization.md).

## Archiv

Das Archivieren schließt eine Änderung ab, indem ihre Delta-Spezifikationen in die Hauptspezifikationen zusammengeführt und die Änderung für die Historie erhalten wird.

### Was passiert beim Archivieren

```
Vor dem Archivieren:

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


Nach dem Archivieren:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Enthält jetzt 2FA-Anforderungen
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Für die Historie erhalten
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Der Archivierungsprozess

1. **Deltas zusammenführen.** Jeder Delta-Spezifikationsabschnitt (HINZUGEFÜGT/GEÄNDERT/ENTFERNT) wird auf die entsprechende Hauptspezifikation angewendet.

2. **Ins Archiv verschieben.** Der Änderungsordner wird mit einem Datumspräfix für die chronologische Sortierung nach `changes/archive/` verschoben.

3. **Kontext bewahren.** Alle Artefakte bleiben im Archiv intakt. Sie können jederzeit zurückblicken, um zu verstehen, warum eine Änderung vorgenommen wurde.

### Warum Archivieren wichtig ist

**Saubere Zustand.** Aktive Änderungen (`changes/`) zeigt nur laufende Arbeiten an. Abgeschlossene Arbeit wird aus dem Weg geräumt.

**Prüfpfad.** Das Archiv bewahrt den vollständigen Kontext jeder Änderung – nicht nur was sich geändert hat, sondern auch das Proposal, das erklärt warum, das Design, das erklärt wie, und die Tasks, die die geleistete Arbeit zeigen.

**Spezifikationsentwicklung.** Spezifikationen wachsen organisch, wenn Änderungen archiviert werden. Jedes Archiv führt seine Deltas zusammen und baut im Laufe der Zeit eine umfassende Spezifikation auf.

## Wie alles zusammenpasst

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (Kern) oder /opsx:new (erweitert)        │
│   │     CHANGE     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREATE     │  /opsx:ff oder /opsx:continue (erweiterter Workflow)     │
│   │     ARTIFACTS  │  Erstellt proposal → specs → design → tasks             │
│   │                │  (basierend auf Schema-Abhängigkeiten)                   │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENT  │  /opsx:apply                                            │
│   │     TASKS      │  Tasks durcharbeiten und abhaken                         │
│   │                │◄──── Artefakte aktualisieren, wenn Sie Neues erfahren    │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFY     │  /opsx:verify (optional)                                │
│   │     WORK       │  Prüfen, ob die Implementierung den Spezifikationen     │
│   │                │  entspricht                                              │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVE    │────►│  Delta-Spezifikationen werden in die          │    │
│   │     CHANGE     │     │  Hauptspezifikationen zusammengeführt        │    │
│   └────────────────┘     │  Änderungsordner wird ins Archiv verschoben  │    │
│                          │  Spezifikationen sind jetzt die aktualisierte│    │
│                          │  Quelle der Wahrheit                         │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Der Tugendkreislauf:**

1. Spezifikationen beschreiben das aktuelle Verhalten
2. Änderungen schlagen Modifikationen vor (als Deltas)
3. Die Implementierung setzt die Änderungen um
4. Das Archiv führt Deltas in Spezifikationen zusammen
5. Spezifikationen beschreiben jetzt das neue Verhalten
6. Die nächste Änderung baut auf den aktualisierten Spezifikationen auf

## Glossar

| Term | Definition |
|------|------------|
| **Artifact** | Ein Dokument innerhalb einer Änderung (proposal, design, tasks oder Delta-Spezifikationen) |
| **Archive** | Der Prozess des Abschließens einer Änderung und Zusammenführens ihrer Deltas in die Hauptspezifikationen |
| **Change** | Eine vorgeschlagene Modifikation des Systems, gepackt als Ordner mit Artefakten |
| **Delta spec** | Eine Spezifikation, die Änderungen (HINZUGEFÜGT/GEÄNDERT/ENTFERNT) relativ zu den aktuellen Spezifikationen beschreibt |
| **Domain** | Eine logische Gruppierung für Spezifikationen (z.B. `auth/`, `payments/`) |
| **Requirement** | Ein bestimmtes Verhalten, das das System haben muss |
| **Scenario** | Ein konkretes Beispiel einer Anforderung, typischerweise im Given/When/Then-Format |
| **Schema** | Eine Definition von Artefakttypen und deren Abhängigkeiten |
| **Spec** | Eine Spezifikation, die das Systemverhalten beschreibt und Anforderungen und Szenarien enthält |
| **Source of truth** | Das Verzeichnis `openspec/specs/`, das das aktuell vereinbarte Verhalten enthält |

## Nächste Schritte

- [Erste Schritte](getting-started.md) - Praktische erste Schritte
- [Workflows](workflows.md) - Gängige Muster und wann jedes verwendet wird
- [Befehle](commands.md) - Vollständige Befehlsreferenz
- [Anpassung](customization.md) - Benutzerdefinierte Schemas erstellen und Ihr Projekt konfigurieren