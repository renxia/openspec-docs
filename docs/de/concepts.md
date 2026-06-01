# Konzepte

Diese Anleitung erklärt die grundlegenden Ideen hinter OpenSpec und wie sie zusammenpassen. Für die praktische Anwendung siehe [Erste Schritte](getting-started.md) und [Workflows](workflows.md).

## Philosophie

OpenSpec basiert auf vier Prinzipien:

```
flüssig, nicht starr       — keine Phasentore, arbeiten Sie an dem, was sinnvoll ist
iterativ, nicht kaskadenförmig — lernen Sie beim Bauen, verfeinern Sie im Prozess
einfach, nicht komplex      — leichtgewichtige Einrichtung, minimaler Aufwand
brownfield-first            — funktioniert mit bestehenden Codebasen, nicht nur bei Greenfield
```

### Warum diese Prinzipien wichtig sind

**Flüssig, nicht starr.** Traditionelle Spezifikationssysteme zwingen Sie in Phasen: zuerst planen Sie, dann implementieren Sie, dann sind Sie fertig. OpenSpec ist flexibler – Sie können Artefakte in jeder für Ihre Arbeit sinnvollen Reihenfolge erstellen.

**Iterativ, nicht kaskadenförmig.** Anforderungen ändern sich. Das Verständnis vertieft sich. Was zu Beginn wie ein guter Ansatz schien, hält möglicherweise nicht stand, nachdem Sie die Codebasis gesehen haben. OpenSpec begrüßt diese Realität.

**Einfach, nicht komplex.** Einige Spezifikations-Frameworks erfordern umfangreiche Einrichtung, starre Formate oder schwergewichtige Prozesse. OpenSpec bleibt Ihnen aus dem Weg. Initialisierung in Sekunden, sofort mit der Arbeit beginnen, nur bei Bedarf anpassen.

**Brownfield-first.** Die meiste Softwarearbeit ist kein Neuaufbau – es ist die Modifikation bestehender Systeme. Der delta-basierte Ansatz von OpenSpec erleichtert die Spezifikation von Änderungen am bestehenden Verhalten, anstatt nur neue Systeme zu beschreiben.

## Das große Ganze

OpenSpec organisiert Ihre Arbeit in zwei Hauptbereiche:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source of truth    │◄─────│  Vorgeschlagene Änderungen    │   │
│   │  Wie Ihr System     │ merge│  Jede Änderung = ein Ordner   │   │
│   │  derzeit funktioniert│     │  Enthält Artefakte + Deltas   │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** sind die zentrale Quelle der Wahrheit – sie beschreiben, wie sich Ihr System derzeit verhält.

**Changes** sind vorgeschlagene Änderungen – sie befinden sich in separaten Ordnern, bis Sie bereit sind, sie zusammenzuführen.

Diese Trennung ist entscheidend. Sie können parallel an mehreren Änderungen arbeiten, ohne Konflikte zu haben. Sie können eine Änderung überprüfen, bevor sie sich auf die Hauptspezifikationen auswirkt. Und wenn Sie eine Änderung archivieren, fließen ihre Deltas sauber in die zentrale Wahrheitsquelle ein.

## Koordinierungs-Workspaces

Die Workspace-Unterstützung befindet sich in der Beta-Phase. Das unten beschriebene lokale Sichtmodell ist die aktuelle Ausrichtung, aber externe Automatisierungen, Integrationen und lang laufende Workflows sollten das Kommandoverhalten, Statusdateien und die JSON-Ausgabe weiterhin als sich entwickelnd betrachten.

Die folgenden Befehle bieten den ersten Einrichtungsablauf zum Öffnen lokaler Ansichten über verknüpfte Repos oder Ordner.

Repo-lokale OpenSpec-Projekte sind die richtige Voreinstellung, wenn ein einzelnes Repo den Planungs-, Implementierungs- und Archivierungsablauf steuert. Manche Arbeiten erstrecken sich über mehrere Repos oder Ordner. Für diesen Fall ist ein OpenSpec-Koordinierungs-Workspace eine maschinenlokale Ansicht, die verknüpfte Pfade, den Opener-Status und die Agent-Einrichtung zusammenhält.

Das mentale Modell des Workspaces ist:

```text
workspace     = private lokale Ansicht über Kontextspeicher, Initiativen, Repos und Ordner
context store = dauerhafter geteilter Kontextcontainer
initiative    = dauerhafter Koordinierungskontext in einem Kontextspeicher
link          = ein stabiler Name für ein Repo oder einen Ordner, den der Workspace lokal auflösen kann
change        = ein geplantes Arbeitspaket; die Implementierung gehört in das besitzende Repo
```

Ein Workspace hat eine andere Struktur als ein repo-lokales Projekt:

```text
getGlobalDataDir()/workspaces/<workspace-name>/
├── workspace.yaml                 # Private lokaler Ansichtsdatensatz
├── AGENTS.md                      # Generierte Laufzeitanleitung
└── <workspace-name>.code-workspace # Generierte Editor-Workspace-Datei
```

Repo-lokaler OpenSpec-Zustand behält die bestehende Struktur bei:

```text
repo-root/
└── openspec/
    ├── specs/
    └── changes/
```

Diese Unterscheidung ist wichtig. Der Workspace-Ordner ist eine lokale Koordinationsoberfläche zum Öffnen und Inspizieren verknüpfter Repos oder Ordner. Das `openspec/`-Verzeichnis jedes Repos bleibt die Heimat für repo-eigene Spezifikationen, repo-lokale Änderungen und Implementierungsplanung. Benutzer müssen kein repo-lokales `openspec init` innerhalb eines Workspace-Ordners ausführen.

Stabile Link-Namen sind die Art, wie ein Workspace auf Repos und Ordner verweist. Der private Workspace-Datensatz speichert Namen wie `api`, `web` oder `checkout` und ordnet sie den lokalen Pfaden dieser Laufzeit zu.

```yaml
# workspace.yaml
version: 1
name: platform
context: null
links:
  api: /repos/api
  web: /repos/web
```

Wenn ein Workspace eine Initiative öffnet, speichert `context` die ausgewählte Kontextspeicher-Binding und die Initiati-ID. Durch die Registry ausgewählte Speicher bleiben über die ID portabel; pfadausgewählte Speicher bewusst den laufzeitlokalen Pfad, da `workspace.yaml` ein privater lokaler Zustand ist.

Verknüpfte Pfade können vollständige Repos, Ordner innerhalb eines großen Monorepos oder andere bestehende Ordner sein. Sie benötigen keinen repo-lokalen `openspec/`-Zustand, bevor sie an der Workspace-Planung teilnehmen können. Spätere Implementierungs-, Verifizierungs- oder Archivierungsworkflows erfordern möglicherweise mehr Repo-Bereitschaft, aber die Planungssichtbarkeit beginnt mit dem Link.

```text
multi-repo:
  api      -> /repos/api
  web      -> /repos/web

large monorepo:
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

Verwaltete Workspaces liegen unter dem standardmäßigen OpenSpec-Datenverzeichnis:

```text
getGlobalDataDir()/workspaces
```

Das bedeutet `$XDG_DATA_HOME/openspec/workspaces`, wenn `XDG_DATA_HOME` gesetzt ist, `~/.local/share/openspec/workspaces` als Fallback bei Unix-Systemen und `%LOCALAPPDATA%\openspec\workspaces` als natives Windows-Fallback. Native Windows-Shells, PowerShell und WSL2 führen jeweils die Pfadstrings für die Laufzeit, die OpenSpec ausführt. Diese Grundlage übersetzt nicht zwischen `D:\repo`, `/mnt/d/repo` und UNC-WSL-Pfaden.

OpenSpec kann weiterhin ältere Beta-Workspace-Roots als Kompatibilitätseingaben lesen, aber verwaltete Workspaces verwenden jetzt den oben beschriebenen Root-`workspace.yaml`-Datensatz. Der Workspace-Ordner bleibt maßgeblich für seine eigene private lokale Ansicht.

Workspace-Sichtbarkeit ist nicht Änderungsverpfrichtung. Richten Sie einen Workspace ein, wenn OpenSpec wissen soll, welche Repos oder Ordner relevant sind; erstellen Sie später eine Änderung, wenn Sie bereit sind, ein Feature, einen Fix, ein Projekt oder ein anderes Arbeitspaket zu planen.

Nützliche Befehle:

```bash
# Geführte Einrichtung
openspec workspace setup

# Automatisierungsfreundliche Einrichtung
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli

# Bekannte Workspaces aus dem lokalen Register anzeigen
openspec workspace list
openspec workspace ls

# Links für den ausgewählten Workspace hinzufügen oder reparieren
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Überprüfen, was dieser Rechner auflösen kann
openspec workspace doctor
openspec workspace doctor --workspace platform

# Workspace-lokale Anleitung und Agent-Skills aktualisieren
openspec workspace update
openspec workspace update --workspace platform --tools codex,claude

# Das verknüpfte Arbeitsset öffnen
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor

# Eine Initiative als lokale Workspace-Ansicht öffnen
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative billing-launch --store-path /repos/platform-context
```

`workspace setup` erstellt den Workspace immer am standardmäßigen Workspace-Standort, zeichnet ihn im lokalen Register auf, zeigt den Workspace-Standort an und erfordert mindestens einen verknüpften Repo oder Ordner. Die interaktive Einrichtung fragt nach einem bevorzugten Opener und kann OpenSpec-Skills für ausgewählte Agents installieren. Die nicht-interaktive Einrichtung speichert einen nur, wenn `--opener codex-cli`, `--opener claude`, `--opener github-copilot` oder `--opener editor` angegeben wird.

Workspace-Skills werden nur im Workspace-Root installiert. Das aktive globale Profil bestimmt, welche Workflow-Skills generiert werden; `--tools` wählt aus, welche Agents sie erhalten. Workspace-Setup und -Update erstellen keine Slash-Befehlsdateien, auch wenn die globale Bereitstellung Befehle enthält. Führen Sie `openspec workspace update` aus, um die workspace-lokale Anleitung zu aktualisieren und verwaltete workspace-lokale Skill-Verzeichnisse hinzuzufügen, zu aktualisieren oder zu entfernen, ohne verknüpfte Repos oder Ordner zu bearbeiten.

OpenSpec pflegt auch Root-Workspace-Open-Dateien: einen von OpenSpec verwalteten Anleitungsblock in `AGENTS.md` und eine maschinenlokale `<workspace-name>.code-workspace`-Datei für VS Code und GitHub Copilot-in-VS-Code-Öffnungen. Ein verwalteter Workspace ist kein Repo, daher erstellt OpenSpec keine standardmäßige Workspace-`.gitignore` oder ein standardmäßiges Workspace-Level-`changes/`-Verzeichnis.

Die gepflegte VS Code-Workspace-Datei listet zuerst gültige verknüpfte Repos oder Ordner auf, dann den Initiati-Kontext, wenn verbunden, und dann die OpenSpec-Workspace-Dateien. VS Code zeigt diese Einträge als Multi-Root-Workspace an.

`workspace open` öffnet das verknüpfte Arbeitsset mit dem gespeicherten bevorzugten Opener, es sei denn, `--agent <tool>` oder `--editor` wird für diese eine Sitzung übergeben. Beide Opener-Überschreibungen gleichzeitig zu übergeben ist ein Fehler. Root-Workspace-Open macht verknüpfte Repos und Ordner sichtbar für Exploration und Kontext; die Implementierung beginnt, nachdem der Benutzer explizit nach Implementierungsarbeit fragt.

`workspace link` und `workspace relink` zeichnen nur bestehende Ordner auf; sie erstellen, kopieren, verschieben, initialisieren oder bearbeiten den verknüpften Repo oder Ordner nicht. Nach einem erfolgreichen Link oder Relink aktualisiert OpenSpec die verwaltete Anleitung und die VS Code-Workspace-Datei.

Workspace-Befehle, die einen Workspace benötigen, können von überall mit `--workspace <name>` ausgeführt werden. Wenn Sie sie innerhalb eines Workspace-Ordners oder Unterverzeichnisses ausführen, verwendet OpenSpec diesen aktuellen Workspace. Wenn mehrere bekannte Workspaces verfügbar sind und Sie `--workspace <name>` nicht übergeben, zeigen menschliche Befehle einen Picker an; `--json` und `--no-interactive` schlagen mit einem strukturierten Statusfehler fehl, anstatt nachzufragen.

Direkte Workspace-Befehle unterstützen JSON-Ausgabe für Skripte. JSON-Antworten halten primäre Daten in `workspace`, `workspaces` oder `link`-Objekten und melden Warnungen oder Fehler in `status`-Arrays. Gesunde Objekte verwenden `status: []`.

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

Organisieren Sie Spezifikationen nach Domäne – logische Gruppierungen, die für Ihr System sinnvoll sind. Gängige Muster:

- **Nach Funktionsbereich**: `auth/`, `payments/`, `search/`
- **Nach Komponente**: `api/`, `frontend/`, `workers/`
- **Nach Bounded Context**: `ordering/`, `fulfillment/`, `inventory/`

### Spezifikationsformat

Eine Spezifikation enthält Anforderungen, und jede Anforderung hat Szenarien:

```markdown
# Authentifizierungsspezifikation

## Zweck
Authentifizierung und Sitzungsmanagement für die Anwendung.

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
- UND es wird kein Token ausgestellt

### Anforderung: Sitzungsablauf
Das System MUSS Sitzungen nach 30 Minuten Inaktivität ablaufen lassen.

#### Szenario: Zeitlimit bei Untätigkeit
- ANGENOMMEN eine authentifizierte Sitzung
- WENN 30 Minuten ohne Aktivität vergehen
- DANN wird die Sitzung ungültig
- UND der Benutzer muss sich erneut authentifizieren
```

**Schlüsselelemente:**

| Element | Zweck |
|---------|-------|
| `## Zweck` | Hochrangige Beschreibung der Domäne dieser Spezifikation |
| `### Anforderung:` | Ein spezifisches Verhalten, das das System haben muss |
| `#### Szenario:` | Ein konkreter Beispiel der Anforderung in Aktion |
| SHALL/MUST/SHOULD | RFC 2119-Schlüsselwörter zur Angabe der Anforderungsstärke |

### Warum Spezifikationen so strukturieren

**Anforderungen sind das „Was"** – sie legen fest, was das System tun soll, ohne die Implementierung zu spezifizieren.

**Szenarien sind das „Wann"** – sie liefern konkrete Beispiele, die verifiziert werden können. Gute Szenarien:
- Sind testbar (man könnte einen automatisierten Test dafür schreiben)
- Decken sowohl den Happy Path als auch Randfälle ab
- Verwenden Gegeben/Wenn/Dann oder ein ähnliches strukturiertes Format

**RFC 2119-Schlüsselwörter** (SHALL, MUST, SHOULD, MAY) kommunizieren die Absicht:
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

Was in Spezifikationen vermieden werden sollte:
- Interne Klassen-/Funktionsnamen
- Bibliotheks- oder Framework-Wahl
- Schritt-für-Schritt-Implementierungsdetails
- Detaillierte Ausführungspläne (diese gehören in `design.md` oder `tasks.md`)

Schnelltest:
- Wenn sich die Implementierung ändern kann, ohne dass sich das extern sichtbare Verhalten ändert, gehört sie wahrscheinlich nicht in die Spezifikation.

### Leichtgewichtig halten: Progressive Strenge

OpenSpec zielt darauf ab, Bürokratie zu vermeiden. Verwenden Sie die leichteste Stufe, die die Änderung noch verifizierbar macht.

**Lite-Spezifikation (Standard):**
- Kurze verhaltensorientierte Anforderungen
- Klarer Umfang und Nicht-Ziele
- Einige konkrete Akzeptanzprüfungen

**Vollständige Spezifikation (für höheres Risiko):**
- Team- oder repo-übergreifende Änderungen
- API-/Vertragsänderungen, Migrationen, Sicherheits-/Datenschutzbedenken
- Änderungen, bei denen Mehrdeutigkeit wahrscheinlich zu kostspieliger Überarbeitung führt

Die meisten Änderungen sollten im Lite-Modus bleiben.

### Mensch + Agent Zusammenarbeit

In vielen Teams erkunden Menschen und Agents entwerfen Artefakte. Der vorgesehene Ablauf ist:

1. Der Mensch liefert Absicht, Kontext und Einschränkungen.
2. Der Agent wandelt dies in verhaltensorientierte Anforderungen und Szenarien um.
3. Der Agent hält Implementierungsdetails in `design.md` und `tasks.md`, nicht in `spec.md`.
4. Die Validierung bestätigt Struktur und Klarheit vor der Implementierung.

Dies hält Spezifikationen für Menschen lesbar und für Agents konsistent.

## Änderungen

Eine Änderung ist eine vorgeschlagene Modifikation Ihres Systems, die als Ordner mit allem Nötigen zum Verständnis und zur Implementierung gepackt ist.

### Struktur einer Änderung

```
openspec/changes/add-dark-mode/
├── proposal.md           # Warum und was
├── design.md             # Wie (technischer Ansatz)
├── tasks.md              # Implementierungs-Checkliste
├── .openspec.yaml        # Metadaten der Änderung (optional)
└── specs/                # Delta-Spezifikationen
    └── ui/
        └── spec.md       # Was sich in ui/spec.md ändert
```

Jede Änderung ist in sich geschlossen. Sie enthält:
- **Artefakte** — Dokumente, die Absicht, Design und Aufgaben festhalten
- **Delta-Spezifikationen** — Spezifikationen für das, was hinzugefügt, geändert oder entfernt wird
- **Metadaten** — optionale Konfiguration für diese spezifische Änderung

### Warum Änderungen Ordner sind

Das Packen einer Änderung in einen Ordner hat mehrere Vorteile:

1. **Alles zusammen.** Vorschlag, Design, Aufgaben und Spezifikationen leben an einem Ort. Kein Suchen an verschiedenen Stellen.

2. **Parallele Arbeit.** Mehrere Änderungen können gleichzeitig existieren, ohne sich zu widersprechen. Arbeiten Sie an `add-dark-mode`, während `fix-auth-bug` ebenfalls in Bearbeitung ist.

3. **Saubere Historie.** Wenn archiviert, werden Änderungen mit ihrem vollständigen Kontext nach `changes/archive/` verschoben. Sie können zurückblicken und verstehen, nicht nur was sich geändert hat, sondern auch warum.

4. **Überprüfungsfreundlich.** Ein Änderungsordner ist leicht zu überprüfen — öffnen Sie ihn, lesen Sie den Vorschlag, prüfen Sie das Design, sehen Sie sich die Spezifikationsdeltas an.

## Artefakte

Artefakte sind die Dokumente innerhalb einer Änderung, die die Arbeit leiten.

### Der Artefakt-Fluss

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Artefakte bauen aufeinander auf. Jedes Artefakt liefert den Kontext für das nächste.

### Artefakttypen

#### Vorschlag (`proposal.md`)

Der Vorschlag erfasst auf hoher Ebene die **Absicht**, den **Umfang** und den **Ansatz**.

```markdown
# Vorschlag: Dark Mode hinzufügen
```

## Intent
Benutzer haben eine Dark-Mode-Option angefordert, um die Belastung der Augen bei nächtlicher Nutzung zu verringern und an Systemeinstellungen angepasst zu werden.

## Scope
Im Umfang enthalten:
- Theme-Umschaltung in den Einstellungen
- Erkennung der Systemeinstellungen
- Speichern der Präferenz im localStorage

Nicht im Umfang enthalten:
- Benutzerdefinierte Farbthemen (zukünftige Arbeit)
- Seitenspezifische Theme-Überschreibungen

## Ansatz
Verwendung von CSS Custom Properties für Theming mit einem React Context zur Zustandsverwaltung. Erkennung der Systemeinstellung beim ersten Laden, manuelle Überschreibung ermöglichen.
```

**Wann das Proposal aktualisiert werden sollte:**
- Änderungen des Umfangs (Einschränkung oder Erweiterung)
- Klärung der Intention (besseres Verständnis des Problems)
- Grundlegende Änderung des Ansatzes

#### Spezifikationen (Delta-Spezifikationen in `specs/`)

Delta-Spezifikationen beschreiben, **was sich ändert**, bezogen auf die aktuellen Spezifikationen. Siehe [Delta-Spezifikationen](#delta-spezifikationen) unten.

#### Entwurf (`design.md`)

Der Entwurf dokumentiert den **technischen Ansatz** und die **Architekturentscheidungen**.

````markdown
# Entwurf: Dark Mode hinzufügen

## Technischer Ansatz
Theme-Zustand wird über React Context verwaltet, um Prop-Drilling zu vermeiden.
CSS Custom Properties ermöglichen Runtime-Switching ohne Klassen-Umschaltung.

## Architekturentscheidungen

### Entscheidung: Context statt Redux
Verwendung von React Context für den Theme-Zustand, weil:
- Einfacher binärer Zustand (hell/dunkel)
- Keine komplexen Zustandsübergänge
- Vermeidung der Hinzufügung einer Redux-Abhängigkeit

### Entscheidung: CSS Custom Properties
Verwendung von CSS-Variablen statt CSS-in-JS, weil:
- Funktioniert mit bestehendem Stylesheet
- Kein Runtime-Overhead
- Browser-native Lösung

## Datenfluss
```
ThemeProvider (Context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS-Variablen (angewendet auf :root)
```

## Dateiänderungen
- `src/contexts/ThemeContext.tsx` (neu)
- `src/components/ThemeToggle.tsx` (neu)
- `src/styles/globals.css` (geändert)
````

**Wann der Entwurf aktualisiert werden sollte:**
- Die Implementierung zeigt, dass der Ansatz nicht funktioniert
- Eine bessere Lösung wird entdeckt
- Abhängigkeiten oder Einschränkungen ändern sich

#### Aufgaben (`tasks.md`)

Aufgaben sind die **Implementierungs-Checkliste** – konkrete Schritte mit Checkboxen.

```markdown
# Aufgaben

## 1. Theme-Infrastruktur
- [ ] 1.1 ThemeContext mit hell/dunkel-Zustand erstellen
- [ ] 1.2 CSS Custom Properties für Farben hinzufügen
- [ ] 1.3 localStorage-Persistenz implementieren
- [ ] 1.4 Systemeinstellungs-Erkennung hinzufügen

## 2. UI-Komponenten
- [ ] 2.1 ThemeToggle-Komponente erstellen
- [ ] 2.2 Umschaltung zur Einstellungsseite hinzufügen
- [ ] 2.3 Header aktualisieren, um schnelle Umschaltung zu integrieren

## 3. Styling
- [ ] 3.1 Dunkles Theme-Farbpalette definieren
- [ ] 3.2 Komponenten aktualisieren, um CSS-Variablen zu verwenden
- [ ] 3.3 Kontrastverhältnisse für Barrierefreiheit testen
```

**Best Practices für Aufgaben:**
- Verwandte Aufgaben unter Überschriften gruppieren
- Hierarchische Nummerierung verwenden (1.1, 1.2 usw.)
- Aufgaben klein genug halten, um in einer Sitzung abgeschlossen zu werden
- Aufgaben nach Abschluss abhaken

## Delta-Spezifikationen

Delta-Spezifikationen sind das Schlüsselkonzept, das OpenSpec für die Weiterentwicklung bestehender Systeme nutzbar macht. Sie beschreiben, **was sich ändert**, anstatt die gesamte Spezifikation zu wiederholen.

### Das Format

```markdown
# Delta für Authentifizierung

## HINZUGEFÜGT Anforderungen

### Anforderung: Zwei-Faktor-Authentifizierung
Das System MUSS TOTP-basierte Zwei-Faktor-Authentifizierung unterstützen.

#### Szenario: 2FA-Registrierung
- ANGENOMMEN ein Benutzer ohne aktiviertes 2FA
- WENN der Benutzer 2FA in den Einstellungen aktiviert
- DANN wird ein QR-Code zur Einrichtung einer Authentifizierungs-App angezeigt
- UND der Benutzer muss sich mit einem Code vor der Aktivierung verifizieren

#### Szenario: 2FA-Anmeldung
- ANGENOMMEN ein Benutzer mit aktiviertem 2FA
- WENN der Benutzer gültige Zugangsdaten einreicht
- DANN wird eine OTP-Herausforderung präsentiert
- UND die Anmeldung wird erst nach gültigem OTP abgeschlossen

## GEÄNDERT Anforderungen

### Anforderung: Sitzungsablauf
Das System MUSS Sitzungen nach 15 Minuten Inaktivität ablaufen lassen.
(Zuvor: 30 Minuten)

#### Szenario: Inaktivitäts-Timeout
- ANGENOMMEN eine authentifizierte Sitzung
- WENN 15 Minuten ohne Aktivität vergehen
- DANN wird die Sitzung ungültig

## ENTFERNT Anforderungen

### Anforderung: Angemeldet bleiben
(Veraltet zugunsten von 2FA. Benutzer sollten sich bei jeder Sitzung neu authentifizieren.)
```

### Delta-Sektionen

| Sektion | Bedeutung | Was beim Archivieren passiert |
|---------|-----------|-------------------------------|
| `## HINZUGEFÜGT Anforderungen` | Neues Verhalten | Wird zur Hauptspezifikation hinzugefügt |
| `## GEÄNDERT Anforderungen` | Geändertes Verhalten | Ersetzt die bestehende Anforderung |
| `## ENTFERNT Anforderungen` | Veraltetes Verhalten | Wird aus der Hauptspezifikation gelöscht |

### Warum Deltas statt vollständiger Spezifikationen

**Klarheit.** Ein Delta zeigt genau, was sich ändert. Bei der Lektüre einer vollständigen Spezifikation müsste man sie mental gegen die aktuelle Version differenzieren.

**Konfliktvermeidung.** Zwei Änderungen können dieselbe Spezifikationsdatei betreffen, ohne sich zu widersprechen, solange sie verschiedene Anforderungen modifizieren.

**Effizienz der Überprüfung.** Prüfer sehen die Änderung, nicht den unveränderten Kontext. Der Fokus liegt auf dem Wesentlichen.

**Passend für die Weiterentwicklung.** Die meiste Arbeit modifiziert bestehendes Verhalten. Deltas machen Modifikationen zu erstklassigen Bürgern, nicht zu nachträglichen Gedanken.

## Schemata

Schemata definieren die Artefakttypen und ihre Abhängigkeiten für einen Workflow.

### Wie Schemata funktionieren

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

**Abhängigkeiten sind Ermöglicher, nicht Tore.** Sie zeigen, was erstellt werden kann, nicht was als nächstes erstellt werden muss. Sie können den Entwurf überspringen, wenn Sie ihn nicht benötigen. Sie können die Spezifikationen vor oder nach dem Entwurf erstellen – beide hängen nur vom Proposal ab.

### Integrierte Schemata

**spec-driven** (Standard)

Der Standard-Workflow für spezifikationsgetriebene Entwicklung:

```
proposal → specs → design → tasks → implement
```

Geeignet für: Die meisten Feature-Arbeiten, bei denen eine Einigung über Spezifikationen vor der Implementierung gewünscht wird.

### Benutzerdefinierte Schemata

Erstellen Sie benutzerdefinierte Schemata für den Workflow Ihres Teams:

```bash
# Von Grund auf erstellen
openspec schema init research-first

# Oder ein bestehendes forken
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
    requires: [research]   # Proposal auf Grundlage der Recherche

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Spezifikationen/Entwurf überspringen, direkt zu Aufgaben
```

Vollständige Details zur Erstellung und Verwendung benutzerdefinierter Schemata finden Sie unter [Anpassung](customization.md).

## Archivieren

Das Archivieren schließt eine Änderung ab, indem es ihre Delta-Spezifikationen in die Hauptspezifikationen zusammenführt und die Änderung für die Historie bewahrt.

### Was beim Archivieren passiert

```
Vor dem Archivieren:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ zusammenführen
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
        └── 2025-01-24-add-2fa/    # Für die Historie bewahrt
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Der Archivierungsprozess

1. **Deltas zusammenführen.** Jede Delta-Spezifikationssektion (HINZUGEFÜGT/GEÄNDERT/ENTFERNT) wird auf die entsprechende Hauptspezifikation angewendet.

2. **Verschieben ins Archiv.** Der Änderungsordner wird nach `changes/archive/` verschoben und erhält ein Datumspräfix für die chronologische Sortierung.

3. **Kontext bewahren.** Alle Artefakte bleiben im Archiv erhalten. Sie können immer zurückblicken, um zu verstehen, warum eine Änderung vorgenommen wurde.

### Warum Archivieren wichtig ist

**Saubere Übersicht.** Aktive Änderungen (`changes/`) zeigt nur Arbeit in Bearbeitung. Abgeschlossene Arbeit wird aus dem Weg geräumt.

**Prüfpfad.** Das Archiv bewahrt den vollständigen Kontext jeder Änderung – nicht nur was sich geändert hat, sondern das Proposal, das erklärt warum, der Entwurf, der erklärt wie, und die Aufgaben, die die geleistete Arbeit zeigen.

**Spezifikationsentwicklung.** Spezifikationen wachsen organisch, wenn Änderungen archiviert werden. Jedes Archiv zusammenführt seine Deltas und baut im Laufe der Zeit eine umfassende Spezifikation auf.

## Wie alles zusammenpasst

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC-FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. BEGINNE     │  /opsx:propose (Kern) oder /opsx:new (erweitert)       │
│   │     ÄNDERUNG    │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. ERSTELLE   │  /opsx:ff oder /opsx:continue (erweiterter Workflow)    │
│   │     ARTEFAKTE   │  Erstellt proposal → specs → design → tasks            │
│   │                │  (basierend auf Schema-Abhängigkeiten)                  │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLMENTIERE│  /opsx:apply                                          │
│   │     AUFGABEN    │  Aufgaben abarbeiten und abhaken                       │
│   │                │◄──── Artefakte aktualisieren beim Lernen                │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. ÜBERPRÜFE  │  /opsx:verify (optional)                               │
│   │     ARBEIT     │  Überprüfen, ob Implementierung den Spezifikationen     │
│   └───────┬────────┘      entspricht                                        │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVIERE │────►│  Delta-Spezifikationen werden zu Hauptspezifikationen │    │
│   │     ÄNDERUNG   │     │  zusammengeführt                           │    │
│   └────────────────┘     │  Änderungsordner wird ins Archiv verschoben │    │
│                          │  Spezifikationen sind jetzt die aktualisierte│    │
│                          │  Quelle der Wahrheit                        │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Der tugendhafte Kreislauf:**

1. Spezifikationen beschreiben das aktuelle Verhalten
2. Änderungen schlagen Modifikationen vor (als Deltas)
3. Die Implementierung macht die Änderungen real
4. Das Archivieren zusammenführt die Deltas in die Spezifikationen
5. Spezifikationen beschreiben jetzt das neue Verhalten
6. Die nächste Änderung baut auf den aktualisierten Spezifikationen auf

## Glossar

| Begriff | Definition |
|---------|------------|
| **Artifact** | Ein Dokument innerhalb einer Änderung (Vorschlag, Design, Tasks oder Deltaspezifikationen) |
| **Archive** | Der Prozess des Abschließens einer Änderung und Zusammenführens ihrer Deltas in Hauptspezifikationen |
| **Change** | Eine vorgeschlagene Modifikation des Systems, gebündelt als Ordner mit Artefakten |
| **Delta spec** | Eine Spezifikation, die Änderungen (HINZUGEFÜGT/GEÄNDERT/ENTFERNT) relativ zu aktuellen Spezifikationen beschreibt |
| **Domain** | Eine logische Gruppierung für Spezifikationen (z.B. `auth/`, `payments/`) |
| **Requirement** | Ein spezifisches Verhalten, das das System haben muss |
| **Scenario** | Ein konkreter Anwendungsfall einer Anforderung, typischerweise im Given/When/Then-Format |
| **Schema** | Eine Definition von Artefakttypen und deren Abhängigkeiten |
| **Spec** | Eine Spezifikation, die Systemverhalten beschreibt und Anforderungen und Szenarien enthält |
| **Source of truth** | Das Verzeichnis `openspec/specs/`, das das aktuell vereinbarte Verhalten enthält |

## Nächste Schritte

- [Erste Schritte](getting-started.md) - Praktische erste Schritte
- [Workflows](workflows.md) - Gängige Muster und wann sie verwendet werden
- [Befehle](commands.md) - Vollständige Befehlsreferenz
- [Anpassung](customization.md) - Erstellen Sie eigene Schemas und konfigurieren Sie Ihr Projekt