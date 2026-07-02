# Erste Schritte

Dieser Leitfaden erklärt, wie OpenSpec funktioniert, nachdem Sie es installiert und initialisiert haben. Für Installationsanweisungen konsultieren Sie die [main README](../index.md#quick-start) oder den [Installationsleitfaden](installation.md). Sind Sie neu in der gesamten Dokumentation? Die [Dokumentations-Startseite](index.md) bietet einen Überblick über alles.

> **Wo gebe ich diese Befehle ein?** An zwei Stellen, und das Vermischen ist der häufigste Anfängerfehler.
>
> - `openspec ...` Befehle (wie `openspec init`) werden in Ihrem **Terminal** ausgeführt.
> - `/opsx:...` Befehle (wie `/opsx:propose`) werden im **Chat Ihres KI-Assistenten** ausgeführt, demselben Feld, in dem Sie ihn bitten würden, Code zu schreiben.
>
> Es gibt keinen separaten „Interaktionsmodus“ zum Starten. Sie geben einfach den Slash-Befehl im Chat ein, und Ihr Assistent geht von dort aus weiter. Volle Erklärung: [How Commands Work](how-commands-work.md).

## Ihre ersten fünf Minuten

Der gesamte Ablauf, wobei jeder Schritt durch seinen Ort gekennzeichnet ist:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (optional: zuerst nachdenken)
AI CHAT      /opsx:propose add-dark-mode      (KI erstellt den Plan; Sie überprüfen ihn)
AI CHAT      /opsx:apply                      (KI baut es)
AI CHAT      /opsx:archive                    (Spezifikationen aktualisiert, Änderung archiviert)
```

Zwei Terminalschritte zur Einrichtung, danach arbeiten Sie im Chat. Der Rest dieses Leitfadens erklärt, was jeder Schritt tut und was Sie sehen werden.

> **Wissen Sie noch nicht, was Sie bauen sollen? Beginnen Sie mit `/opsx:explore`.** Es ist ein Partner zum Nachdenken ohne Risiko, der Ihre Codebasis liest, Optionen abwägt und eine vage Idee in einen konkreten Plan verwandelt – alles bevor irgendein Artefakt oder Code existiert. Wenn das Bild klar ist, wird die Übergabe an `/opsx:propose` gemacht. Dies ist die beste Gewohnheit beim Arbeiten mit einer KI, die sonst selbstbewusst das Falsche bauen könnte. Sehen Sie den [Explore Leitfaden](explore.md).

## Funktionsweise

OpenSpec hilft Ihnen und Ihrem KI-Coding-Assistenten, sich darauf zu einigen, was gebaut werden soll, bevor irgendein Code geschrieben wird.

**Standard-Schnellpfad (Core Profil):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (optional)
```

Beginnen Sie mit `/opsx:explore`, wenn Sie herausfinden, was zu tun ist, oder springen Sie direkt zu `/opsx:propose`, wenn Sie es bereits wissen. Explore ist im Standardprofil enthalten, daher ist es immer da, wenn Sie es benötigen.

**Erweiterter Pfad (Benutzerdefinierte Workflow-Auswahl):**

```text
/opsx:new ──► /opsx:ff oder /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Das Standardglobalprofil ist `core`, welches `propose`, `explore`, `apply`, `sync` und `archive` beinhaltet. Sie können die erweiterten Workflow-Befehle mit `openspec config profile` und dann `openspec update` aktivieren.

## Was OpenSpec erstellt

Nach der Ausführung von `openspec init` hat Ihr Projekt diese Struktur:

```
openspec/
├── specs/              # Wahrheitsquelle (das Verhalten Ihres Systems)
│   └── <domain>/
│       └── spec.md
├── changes/            # Vorgeschlagene Aktualisierungen (ein Ordner pro Änderung)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta Specs (was sich ändert)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Projektkonfiguration (optional)
```

**Zwei Schlüsselverzeichnisse:**

- **`specs/`** - Die Wahrheitsquelle. Diese Spezifikationen beschreiben, wie Ihr System derzeit funktioniert. Organisiert nach Domäne (z. B. `specs/auth/`, `specs/payments/`).

- **`changes/`** - Vorgeschlagene Änderungen. Jede Änderung erhält ihren eigenen Ordner mit allen zugehörigen Artefakten. Wenn eine Änderung abgeschlossen ist, werden ihre Spezifikationen in das Hauptverzeichnis `specs/` integriert.

## Verständnis der Artefakte

Jeder Änderungsordner enthält Artefakte, die die Arbeit leiten:

| Artefakt | Zweck |
|----------|---------|
| `proposal.md` | Das „Warum“ und „Was“ – erfasst Absicht, Umfang und Ansatz |
| `specs/` | Delta Specs, die HINZUGEFÜGTE/GEÄNDERTE/ENTFERNTE Anforderungen zeigen |
| `design.md` | Das „Wie“ – technische Vorgehensweise und Architekturentscheidungen |
| `tasks.md` | Implementierungs-Checkliste mit Kontrollkästchen |

**Artefakte bauen aufeinander auf:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            aktualisieren, während Sie lernen
```

Sie können jederzeit zu früheren Artefakten zurückkehren und diese verfeinern, je mehr Sie während der Implementierung lernen.

## Wie Delta Specs funktionieren

Delta Specs sind das Schlüsselkonzept in OpenSpec. Sie zeigen, was sich im Verhältnis zu Ihren aktuellen Spezifikationen ändert.

### Das Format

Delta Specs verwenden Abschnitte, um den Typ der Änderung anzugeben:

```markdown
# Delta für Auth

## ADDED Requirements (HINZUGEFÜGTE Anforderungen)

### Requirement: Two-Factor Authentication (Zweifaktor-Authentifizierung)
Das System MUSS einen zweiten Faktor während des Logins verlangen.

#### Scenario: OTP required (OTP erforderlich)
- GIVEN ein Benutzer mit 2FA aktiviert
- WHEN der Benutzer gültige Anmeldedaten sendet
- THEN wird eine OTP-Herausforderung präsentiert

## MODIFIED Requirements (GEÄNDERTE Anforderungen)

### Requirement: Session Timeout (Sitzungs-Timeout)
Das System SOLL Sitzungen nach 30 Minuten Inaktivität beenden.
(Zuvor: 60 Minuten)

#### Scenario: Idle timeout (Inaktiver Timeout)
- GIVEN eine authentifizierte Sitzung
- WHEN 30 Minuten ohne Aktivität vergehen
- THEN wird die Sitzung ungültig gemacht

## REMOVED Requirements (ENTFERNTE Anforderungen)

### Requirement: Remember Me (Angemeldet bleiben)
(Veraltet zugunsten von 2FA)
```

### Was passiert beim Archivieren

Wenn Sie eine Änderung archivieren:

1. **ADDED** Anforderungen werden dem Hauptspezifikation angehängt.
2. **MODIFIED** Anforderungen ersetzen die bestehende Version.
3. **REMOVED** Anforderungen werden aus der Hauptspezifikation gelöscht.

Der Änderungsordner wird zu `openspec/changes/archive/` verschoben, um die Prüfhistorie zu gewährleisten.

## Beispiel: Ihre erste Änderung

Lassen Sie uns durch das Hinzufügen des Dark Modes zu einer Anwendung gehen.

### 1. Die Änderung starten (Standard)

```text
You: /opsx:propose add-dark-mode

AI:  Erstellt openspec/changes/add-dark-mode/
     ✓ proposal.md — warum wir das tun, was sich ändert
     ✓ specs/       — Anforderungen und Szenarien
     ✓ design.md    — technischer Ansatz
     ✓ tasks.md     — Implementierungs-Checkliste
     Bereit für die Implementierung!
```

Wenn Sie das erweiterte Workflow-Profil aktiviert haben, können Sie dies auch in zwei Schritten tun: `/opsx:new` und dann `/opsx:ff` (oder inkrementell `/opsx:continue`).

### 2. Was erstellt wird

**proposal.md** - Erfasst die Absicht:

```markdown
# Proposal: Add Dark Mode (Dark Mode hinzufügen)

## Intent (Absicht)
Benutzer haben eine Option für den Dunkelmodus angefordert, um Augenbelastung
während der nächtlichen Nutzung zu reduzieren.

## Scope (Umfang)
- Hinzufügen eines Theme-Toggles in den Einstellungen
- Unterstützung der Systempräferenzerkennung
- Speichern der Präferenz im localStorage

## Approach (Ansatz)
Verwendung von CSS Custom Properties für das Theming mit einem React Context
für das Zustandsmanagement.
```

**specs/ui/spec.md** - Delta, das neue Anforderungen zeigt:

```markdown
# Delta for UI (Delta für die Benutzeroberfläche)

## ADDED Requirements (HINZUGEFÜGTE Anforderungen)

### Requirement: Theme Selection (Themenauswahl)
Das System SOLL den Benutzern ermöglichen, zwischen hellen und dunklen Themen zu wählen.

#### Scenario: Manual toggle (Manuelles Umschalten)
- GIVEN ein Benutzer auf einer beliebigen Seite
- WHEN der Benutzer den Theme-Toggle anklickt
- THEN wechselt das Thema sofort
- AND die Präferenz bleibt über Sitzungen erhalten

#### Scenario: System preference (Systempräferenz)
- GIVEN ein Benutzer ohne gespeicherte Präferenz
- WHEN die Anwendung geladen wird
- THEN wird das bevorzugte Farbschema des Systems verwendet
```

**tasks.md** - Implementierungs-Checkliste:

```markdown
# Tasks (Aufgaben)

## 1. Theme Infrastructure (Themen-Infrastruktur)
- [ ] 1.1 Erstellen von ThemeContext mit light/dark Zustand
- [ ] 1.2 Hinzufügen von CSS Custom Properties für Farben
- [ ] 1.3 Implementierung der localStorage Persistenz

## 2. UI Components (UI Komponenten)
- [ ] 2.1 Erstellen des ThemeToggle Components
- [ ] 2.2 Hinzufügen des Toggles zur Einstellungsseite
- [ ] 2.3 Aktualisieren des Headers, um den schnellen Umschalter einzubinden

## 3. Styling (Styling)
- [ ] 3.1 Definition der Dark Theme Farbpalette
- [ ] 3.2 Aktualisieren der Komponenten zur Verwendung von CSS Variablen
```

### 3. Implementieren

```
You: /opsx:apply

AI:  Arbeitet an den Aufgaben...
     ✓ 1.1 Erstellt ThemeContext mit light/dark Zustand
     ✓ 1.2 Fügt CSS Custom Properties zu globals.css hinzu
     ✓ 1.3 Implementiert localStorage Persistenz
     ✓ 2.1 Erstellt ThemeToggle Component
     ...
     Alle Aufgaben erledigt!
```

Während der Implementierung können Sie das Artefakt immer aktualisieren und fortfahren, wenn Sie feststellen, dass das Design angepasst werden muss.

### 4. Archivieren

```
You: /opsx:archive

AI:  Archiviert add-dark-mode...
     ✓ Spezifikationen in openspec/specs/ui/spec.md integriert
     ✓ Verschiebt nach openspec/changes/archive/2025-01-24-add-dark-mode/
     Fertig! Bereit für das nächste Feature.
```

Ihre Delta Specs sind nun Teil der Hauptspezifikationen und dokumentieren, wie Ihr System funktioniert.

## Überprüfen und Bewerten (Verifizieren)

Verwenden Sie die CLI, um Ihre Änderungen zu überprüfen:

```bash
# Aktive Änderungen auflisten
openspec list

# Änderungsdetails anzeigen
openspec show add-dark-mode

# Spezifikationsformat validieren
openspec validate add-dark-mode

# Interaktives Dashboard
openspec view
```

## Nächste Schritte

- [Explore First](explore.md) - Verwenden Sie `/opsx:explore`, um eine Idee zu durchdenken, bevor Sie sie festlegen
- [Using OpenSpec in an Existing Project](existing-projects.md) - Starten Sie mit einer großen Brownfield Codebase
- [Editing & Iterating on a Change](editing-changes.md) - Aktualisieren Sie Artefakte, gehen Sie zurück, gleichen Sie manuelle Bearbeitungen ab
- [Core Concepts at a Glance](overview.md) - Das gesamte mentale Modell auf einer Seite
- [Examples & Recipes](examples.md) - Echte Änderungen, von Anfang bis Ende
- [Workflows](workflows.md) - Häufige Muster und wann Sie welchen Befehl verwenden sollten
- [Commands](commands.md) - Vollständige Referenz für alle Slash Commands
- [Concepts](concepts.md) - Tieferes Verständnis der Spezifikationen, Änderungen und Schemata
- [Customization](customization.md) - Machen Sie OpenSpec zu Ihrem Werkzeug
- [Stores](stores-beta/user-guide.md) - Planen, das Repos oder Teams umfasst? Behalten Sie es in einem eigenen Repo (Beta)
- [FAQ](faq.md) und [Troubleshooting](troubleshooting.md) - Wenn Sie stecken bleiben