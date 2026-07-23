# Erste Schritte

Dieser Leitfaden erklärt, wie OpenSpec funktioniert, nachdem Sie es installiert und initialisiert haben. Installationsanweisungen finden Sie in der [Haupt-README](../index.md#quick-start) oder dem [Installationsleitfaden](installation.md). Neu in der gesamten Dokumentation? Die [Dokumentationsstartseite](index.md) gibt Ihnen einen Überblick über alle Inhalte.

> **Wo geben Sie diese Befehle ein?** Es gibt zwei Stellen, und diese zu verwechseln ist der häufigste Fehler zu Beginn.
>
> - `openspec ...`-Befehle (wie `openspec init`) werden in Ihrem **Terminal** ausgeführt.
> - `/opsx:...`-Befehle (wie `/opsx:propose`) werden im **Chat Ihres KI-Assistenten** ausgeführt, also in dem gleichen Fenster, in dem Sie ihn bitten würden, Code zu schreiben.
>
> Es gibt keinen separaten "interaktiven Modus", den Sie starten müssen. Sie geben einfach den Slash-Befehl im Chat ein und Ihr Assistent erledigt den Rest. Vollständige Erklärung: [Wie Befehle funktionieren](how-commands-work.md).

## Ihre ersten fünf Minuten

Der gesamte Ablauf, bei dem jeder Schritt mit dem Ort seiner Ausführung gekennzeichnet ist:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (optional: think it through first)
AI CHAT      /opsx:propose add-dark-mode      (AI drafts the plan; you review it)
AI CHAT      /opsx:apply                      (AI builds it)
AI CHAT      /opsx:archive                    (specs updated, change filed away)
```

Zwei Schritte im Terminal zur Einrichtung, danach arbeiten Sie hauptsächlich im Chat. Der Rest dieses Leitfadens erklärt, was jeder Schritt tut und was Sie dabei sehen werden.

> **Noch nicht sicher, was Sie bauen sollen? Beginnen Sie mit `/opsx:explore`.** Es ist ein risikofreier Denkpartner, der Ihre Codebasis liest, Optionen abwägt und eine vage Idee zu einem konkreten Plan schärft – und das alles, bevor irgendwelche Artefakte oder Code existieren. Wenn die Lage klar ist, übergibt es an `/opsx:propose`. Das ist die beste Gewohnheit für die Arbeit mit einer KI, die sonst selbstbewusst das Falsche bauen würde. Siehe [Explore-Leitfaden](explore.md).

## Funktionsweise

OpenSpec hilft Ihnen und Ihrem KI-Code-Assistenten, sich darüber zu einigen, was gebaut werden soll, bevor irgendwelcher Code geschrieben wird.

**Standard-Schnellpfad (Core-Profil):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (optional)
```

Beginnen Sie mit `/opsx:explore`, wenn Sie noch herausfinden, was Sie tun möchten, oder springen Sie direkt zu `/opsx:propose`, wenn Sie es bereits wissen. Explore ist im Standardprofil enthalten, also immer verfügbar, wenn Sie es brauchen.

**Erweiterter Pfad (benutzerdefinierte Workflow-Auswahl):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Das standardmäßige globale Profil ist `core`, das die Befehle `propose`, `explore`, `apply`, `sync` und `archive` enthält. Sie können die erweiterten Workflow-Befehle mit `openspec config profile` und anschließend `openspec update` aktivieren.

## Was OpenSpec erstellt

Nach der Ausführung von `openspec init` hat Ihr Projekt diese Struktur:

```
openspec/
├── specs/              # Quelle der Wahrheit (Verhalten Ihres Systems)
│   └── <domain>/
│       └── spec.md
├── changes/            # Vorgeschlagene Änderungen (ein Ordner pro Änderung)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta-Spezifikationen (was sich ändert)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Projektkonfiguration (optional)
```

**Zwei Schlüsselordner:**

- **`specs/`** – Die Quelle der Wahrheit. Diese Spezifikationen beschreiben, wie Ihr System aktuell funktioniert. Sie sind nach Domänen organisiert (z. B. `specs/auth/`, `specs/payments/`).
- **`changes/`** – Vorgeschlagene Änderungen. Jede Änderung erhält einen eigenen Ordner mit allen zugehörigen Artefakten. Wenn eine Änderung abgeschlossen ist, werden ihre Spezifikationen in den Hauptordner `specs/` zusammengeführt.

## Artefakte verstehen

Jeder Änderungsordner enthält Artefakte, die die Arbeit leiten:

| Artefakt | Zweck |
|----------|-------|
| `proposal.md` | Das "Warum" und "Was" – erfasst Absicht, Umfang und Vorgehen |
| `specs/` | Delta-Spezifikationen, die HINZUGEFÜGTE/GEÄNDERTE/ENTFERNTE Anforderungen anzeigen |
| `design.md` | Das "Wie" – technischer Ansatz und Architekturentscheidungen |
| `tasks.md` | Implementierungscheckliste mit Kontrollkästchen |

**Artefakte bauen aufeinander auf:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            update as you learn
```

Sie können jederzeit zurückgehen und frühere Artefakte verfeinern, wenn Sie während der Implementierung mehr erfahren.

## Funktionsweise von Delta-Spezifikationen

Delta-Spezifikationen sind das zentrale Konzept in OpenSpec. Sie zeigen, was sich im Vergleich zu Ihren aktuellen Spezifikationen ändert.

### Das Format

Delta-Spezifikationen verwenden Abschnitte, um die Art der Änderung anzugeben:

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST require a second factor during login.

#### Scenario: OTP required
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented

## MODIFIED Requirements

### Requirement: Session Timeout
The system SHALL expire sessions after 30 minutes of inactivity.
(Previously: 60 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA)
```

### Was beim Archivieren passiert

Wenn Sie eine Änderung archivieren:
1. **HINZUGEFÜGTE** Anforderungen werden an die Hauptspezifikation angehängt
2. **GEÄNDERTE** Anforderungen ersetzen die vorhandene Version
3. **ENTFERNTE** Anforderungen werden aus der Hauptspezifikation gelöscht

Der Änderungsordner wird zur Prüfhistorie in `openspec/changes/archive/` verschoben.

## Beispiel: Ihre erste Änderung

Gehen wir gemeinsam durch das Hinzufügen eines Dunkelmodus zu einer Anwendung.

### 1. Änderung starten (Standard)

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

Wenn Sie das erweiterte Workflow-Profil aktiviert haben, können Sie dies auch in zwei Schritten durchführen: Zuerst `/opsx:new`, dann `/opsx:ff` (oder schrittweise `/opsx:continue`).

### 2. Was erstellt wird

**proposal.md** – Erfasst die Absicht:

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage.

## Scope
- Add theme toggle in settings
- Support system preference detection
- Persist preference in localStorage

## Approach
Use CSS custom properties for theming with a React context
for state management.
```

**specs/ui/spec.md** – Delta, das neue Anforderungen anzeigt:

```markdown
# Delta for UI

## ADDED Requirements

### Requirement: Theme Selection
The system SHALL allow users to choose between light and dark themes.

#### Scenario: Manual toggle
- GIVEN a user on any page
- WHEN the user clicks the theme toggle
- THEN the theme switches immediately
- AND the preference persists across sessions

#### Scenario: System preference
- GIVEN a user with no saved preference
- WHEN the application loads
- THEN the system's preferred color scheme is used
```

**tasks.md** – Implementierungscheckliste:

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
```

### 3. Implementieren

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Created ThemeContext with light/dark state
     ✓ 1.2 Added CSS custom properties to globals.css
     ✓ 1.3 Implemented localStorage persistence
     ✓ 2.1 Created ThemeToggle component
     ...
     All tasks complete!
```

Wenn Sie während der Implementierung feststellen, dass das Design angepasst werden muss, aktualisieren Sie einfach das Artefakt und fahren Sie fort.

### 4. Archivieren

```text
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

Ihre Delta-Spezifikationen sind nun Teil der Hauptspezifikationen und dokumentieren, wie Ihr System funktioniert.

## Überprüfen und Prüfen

Verwenden Sie die CLI, um den Status Ihrer Änderungen zu überprüfen:

```bash
# Aktive Änderungen auflisten
openspec list

# Details einer Änderung anzeigen
openspec show add-dark-mode

# Formatierung von Spezifikationen validieren
openspec validate add-dark-mode

# Interaktives Dashboard
openspec view
```

## Nächste Schritte

- [Zuerst erkunden](explore.md) – Verwenden Sie `/opsx:explore`, um eine Idee zu durchdenken, bevor Sie sich festlegen
- [Prüfung einer Änderung](reviewing-changes.md) – Was Sie in dem von der KI erstellten Plan prüfen sollten, bevor Code geschrieben wird
- [Gute Spezifikationen schreiben](writing-specs.md) – Wie eine starke Anforderung und ein passendes Szenario aussehen
- [OpenSpec in einem bestehenden Projekt verwenden](existing-projects.md) – Start in einer großen Brownfield-Codebasis
- [Bearbeiten und Iterieren einer Änderung](editing-changes.md) – Artefakte aktualisieren, zurückgehen, manuelle Änderungen abgleichen
- [Grundkonzepte auf einen Blick](overview.md) – Das gesamte mentale Modell auf einer Seite
- [Beispiele & Rezepte](examples.md) – Reale Änderungen von Anfang bis Ende
- [Workflows](workflows.md) – Häufige Muster und wann Sie welchen Befehl verwenden sollten
- [Befehle](commands.md) – Vollständige Referenz für alle Slash-Befehle
- [Konzepte](concepts.md) – Tieferes Verständnis von Spezifikationen, Änderungen und Schemata
- [Anpassung](customization.md) – Passen Sie OpenSpec nach Ihren Wünschen an
- [Stores](stores-beta/user-guide.md) – Planung, die mehrere Repos oder Teams umfasst? Speichern Sie sie in einem eigenen Repo (Beta)
- [FAQ](faq.md) und [Fehlerbehebung](troubleshooting.md) – Wenn Sie nicht weiterkommen