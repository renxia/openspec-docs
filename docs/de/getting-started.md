# Erste Schritte

Diese Anleitung erklärt, wie OpenSpec funktioniert, nachdem Sie es installiert und initialisiert haben. Installationsanweisungen finden Sie in der [Haupt-README](index.md#quick-start).

## Funktionsweise

OpenSpec hilft Ihnen und Ihrem KI-Coding-Assistenten, sich darauf zu einigen, was gebaut werden soll, bevor Code geschrieben wird.

**Standard-Schnellweg (Kernprofil):**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

**Erweiterter Pfad (benutzerdefinierte Workflow-Auswahl):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Das Standard-Globale Profil ist `core`, welches `propose`, `explore`, `apply`, `sync` und `archive` umfasst. Sie können die erweiterten Workflow-Befehle mit `openspec config profile` und anschließend `openspec update` aktivieren.

## Was OpenSpec erstellt

Nach der Ausführung von `openspec init` hat Ihr Projekt diese Struktur:

```
openspec/
├── specs/              # Quelle der Wahrheit (das Verhalten Ihres Systems)
│   └── <domain>/
│       └── spec.md
├── changes/            # Vorgeschlagene Aktualisierungen (ein Ordner pro Änderung)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta-Spezifikationen (was sich ändert)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Projektkonfiguration (optional)
```

**Zwei Schlüsselverzeichnisse:**

- **`specs/`** - Die Quelle der Wahrheit. Diese Spezifikationen beschreiben, wie sich Ihr System derzeit verhält. Organisiert nach Domäne (z.B. `specs/auth/`, `specs/payments/`).

- **`changes/`** - Vorgeschlagene Änderungen. Jede Änderung erhält ihren eigenen Ordner mit allen zugehörigen Artefakten. Wenn eine Änderung abgeschlossen ist, werden ihre Spezifikationen in das Hauptverzeichnis `specs/` zusammengeführt.

## Verständnis der Artefakte

Jeder Änderungsordner enthält Artefakte, die die Arbeit leiten:

| Artefakt | Zweck |
|----------|-------|
| `proposal.md` | Das "Warum" und "Was" - erfasst Absicht, Umfang und Ansatz |
| `specs/` | Delta-Spezifikationen, die HINZUGEFÜGT/GEÄNDERT/ENTFERNT Anforderungen anzeigen |
| `design.md` | Das "Wie" - technischer Ansatz und Architekturentscheidungen |
| `tasks.md` | Implementierungs-Checkliste mit Kontrollkästchen |

**Artefakte bauen aufeinander auf:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            Aktualisierung während der Arbeit
```

Sie können jederzeit zurückgehen und frühere Artefakte verfeinern, während Sie während der Implementierung mehr erfahren.

## Funktionsweise der Delta-Spezifikationen

Delta-Spezifikationen sind das Schlüsselkonzept in OpenSpec. Sie zeigen, was sich relativ zu Ihren aktuellen Spezifikationen ändert.

### Das Format

Delta-Spezifikationen verwenden Abschnitte, um die Art der Änderung anzuzeigen:

```markdown
# Delta für Auth

## HINZUGEFÜGT Anforderungen

### Anforderung: Zwei-Faktor-Authentifizierung
Das System MUSS während der Anmeldung einen zweiten Faktor verlangen.

#### Szenario: OTP erforderlich
- ANGENOMMEN ein Benutzer mit aktiviertem 2FA
- WENN der Benutzer gültige Anmeldedaten eingibt
- DANN wird eine OTP-Herausforderung präsentiert

## GEÄNDERT Anforderungen

### Anforderung: Sitzungs-Timeout
Das System SOLL Sitzungen nach 30 Minuten Inaktivität ablaufen lassen.
(Zuvor: 60 Minuten)

#### Szenario: Leerlauf-Timeout
- ANGENOMMEN eine authentifizierte Sitzung
- WENN 30 Minuten ohne Aktivität vergehen
- DANN wird die Sitzung ungültig

## ENTFERNT Anforderungen

### Anforderung: Angemeldet bleiben
(Veraltet zugunsten von 2FA)
```

### Was beim Archivieren passiert

Wenn Sie eine Änderung archivieren:

1. **HINZUGEFÜGT** Anforderungen werden an die Hauptspezifikation angehängt
2. **GEÄNDERT** Anforderungen ersetzen die vorhandene Version
3. **ENTFERNT** Anforderungen werden aus der Hauptspezifikation gelöscht

Der Änderungsordner wird zur Audit-Historie nach `openspec/changes/archive/` verschoben.

## Beispiel: Ihre erste Änderung

Lassen Sie uns durchgehen, wie man einen Dunkelmodus zu einer Anwendung hinzufügt.

### 1. Die Änderung starten (Standard)

```text
Sie: /opsx:propose add-dark-mode

KI:  Erstellt openspec/changes/add-dark-mode/
     ✓ proposal.md — warum wir das tun, was sich ändert
     ✓ specs/       — Anforderungen und Szenarien
     ✓ design.md    — technischer Ansatz
     ✓ tasks.md     — Implementierungs-Checkliste
     Bereit für die Implementierung!
```

Wenn Sie das erweiterte Workflow-Profil aktiviert haben, können Sie dies auch in zwei Schritten tun: `/opsx:new` dann `/opsx:ff` (oder `/opsx:continue` schrittweise).

### 2. Was erstellt wird

**proposal.md** - Erfasst die Absicht:

```markdown
# Vorschlag: Dunkelmodus hinzufügen

## Absicht
Benutzer haben eine Dunkelmodus-Option angefordert, um die Augenbelastung
bei nächtlicher Nutzung zu reduzieren.

## Umfang
- Themenschalter in den Einstellungen hinzufügen
- Systempräferenzerkennung unterstützen
- Präferenz in localStorage speichern

## Ansatz
CSS Custom Properties für Theming mit einem React-Kontext
für das Zustandsmanagement verwenden.
```

**specs/ui/spec.md** - Delta mit neuen Anforderungen:

```markdown
# Delta für UI

## HINZUGEFÜGT Anforderungen

### Anforderung: Themenauswahl
Das System SOLL Benutzern erlauben, zwischen hellen und dunklen Themen zu wählen.

#### Szenario: Manueller Schalter
- ANGENOMMEN ein Benutzer auf einer beliebigen Seite
- WENN der Benutzer auf den Themenschalter klickt
- DANN wechselt das Thema sofort
- UND die Präferenz bleibt über Sitzungen hinweg bestehen

#### Szenario: Systempräferenz
- ANGENOMMEN ein Benutzer ohne gespeicherte Präferenz
- WENN die Anwendung lädt
- DANN wird das bevorzugte Farbschema des Systems verwendet
```

**tasks.md** - Implementierungs-Checkliste:

```markdown
# Aufgaben

## 1. Themen-Infrastruktur
- [ ] 1.1 ThemeContext mit hell/dunkel Zustand erstellen
- [ ] 1.2 CSS Custom Properties für Farben hinzufügen
- [ ] 1.3 localStorage-Persistenz implementieren

## 2. UI-Komponenten
- [ ] 2.1 ThemeToggle-Komponente erstellen
- [ ] 2.2 Schalter zur Einstellungsseite hinzufügen
- [ ] 2.3 Header aktualisieren, um schnellen Schalter einzuschließen

## 3. Styling
- [ ] 3.1 Dunkle Themen-Farbpalette definieren
- [ ] 3.2 Komponenten aktualisieren, um CSS-Variablen zu verwenden
```

### 3. Implementieren

```
Sie: /opsx:apply

KI:  Arbeite Aufgaben ab...
     ✓ 1.1 ThemeContext mit hell/dunkel Zustand erstellt
     ✓ 1.2 CSS Custom Properties zu globals.css hinzugefügt
     ✓ 1.3 localStorage-Persistenz implementiert
     ✓ 2.1 ThemeToggle-Komponente erstellt
     ...
     Alle Aufgaben abgeschlossen!
```

Während der Implementierung, wenn Sie entdecken, dass das Design Anpassungen benötigt, aktualisieren Sie einfach das Artefakt und fahren fort.

### 4. Archivieren

```
Sie: /opsx:archive

KI:  Archiviere add-dark-mode...
     ✓ Spezifikationen in openspec/specs/ui/spec.md zusammengeführt
     ✓ Verschoben nach openspec/changes/archive/2025-01-24-add-dark-mode/
     Fertig! Bereit für das nächste Feature.
```

Ihre Delta-Spezifikationen sind nun Teil der Hauptspezifikationen und dokumentieren, wie Ihr System funktioniert.

## Überprüfen und Reviewen

Verwenden Sie die CLI, um Ihre Änderungen zu überprüfen:

```bash
# Aktive Änderungen auflisten
openspec list

# Änderungsdetails anzeigen
openspec show add-dark-mode

# Spezifikationsformatierung validieren
openspec validate add-dark-mode

# Interaktives Dashboard
openspec view
```

## Nächste Schritte

- [Workflows](workflows.md) - Gängige Muster und wann welcher Befehl verwendet wird
- [Befehle](commands.md) - Vollständige Referenz für alle Slash-Befehle
- [Konzepte](concepts.md) - Tieferes Verständnis von Spezifikationen, Änderungen und Schemas
- [Anpassung](customization.md) - OpenSpec nach Ihren Wünschen anpassen