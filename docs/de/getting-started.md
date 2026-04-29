# Erste Schritte

Diese Anleitung erklärt, wie OpenSpec funktioniert, nachdem Sie es installiert und initialisiert haben. Für Installationsanweisungen siehe die [Haupt-README](index.md#quick-start).

## So funktioniert es

OpenSpec hilft Ihnen und Ihrem KI-Programmierassistenten, sich darauf zu einigen, was gebaut werden soll, bevor ein einziger Codezeile geschrieben wird.

**Standard-Schnellweg (Core-Profil):**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:archive
```

**Erweiterter Weg (benutzerdefinierte Workflow-Auswahl):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Das Standard-Globale Profil ist `core`, das `propose`, `explore`, `apply` und `archive` umfasst. Sie können die erweiterten Workflow-Befehle mit `openspec config profile` und dann `openspec update` aktivieren.

## Was OpenSpec erstellt

Nach der Ausführung von `openspec init` hat Ihr Projekt diese Struktur:

```
openspec/
├── specs/              # Wahrheitsquelle (das Verhalten Ihres Systems)
│   └── <domain>/
│       └── spec.md
├── changes/            # Vorgeschlagene Änderungen (ein Ordner pro Änderung)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta-Specs (was sich ändert)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Projektkonfiguration (optional)
```

**Zwei Schlüsselverzeichnisse:**

- **`specs/`** - Die Wahrheitsquelle. Diese Specs beschreiben, wie sich Ihr System derzeit verhält. Organisiert nach Domäne (z.B. `specs/auth/`, `specs/payments/`).

- **`changes/`** - Vorgeschlagene Änderungen. Jede Änderung erhält eigenen Ordner mit allen zugehörigen Artefakten. Wenn eine Änderung abgeschlossen ist, werden ihre Specs in das Hauptverzeichnis `specs/` zusammengeführt.

## Artefakte verstehen

Jeder Änderungsordner enthält Artefakte, die die Arbeit leiten:

| Artefakt | Zweck |
|----------|---------|
| `proposal.md` | Das "Warum" und "Was" - erfasst Absicht, Umfang und Vorgehensweise |
| `specs/` | Delta-Specs, die HINZUGEFÜGTE/GEÄNDERTE/ENTFERNTE Anforderungen zeigen |
| `design.md` | Das "Wie" - technischer Ansatz und Architekturentscheidungen |
| `tasks.md` | Implementierungs-Checkliste mit Kontrollkästchen |

**Artefakte bauen aufeinander auf:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            aktualisieren Sie, während Sie dazulernen
```

Sie können jederzeit zu früheren Artefakten zurückkehren und diese verfeinern, während Sie während der Implementierung mehr erfahren.

## So funktionieren Delta-Specs

Delta-Specs sind das Schlüsselkonzept in OpenSpec. Sie zeigen, was sich im Vergleich zu Ihren aktuellen Specs ändert.

### Das Format

Delta-Specs verwenden Abschnitte, um die Art der Änderung anzugeben:

```markdown
# Delta für Auth

## HINZUGEFÜGTE Anforderungen

### Anforderung: Zwei-Faktor-Authentifizierung
Das System MUSS einen zweiten Faktor bei der Anmeldung erfordern.

#### Szenario: OTP erforderlich
- ANGENOMMEN ein Benutzer mit aktiviertem 2FA
- WENN der Benutzer gültige Anmeldedaten eingibt
- WIRD eine OTP-Herausforderung präsentiert

## GEÄNDERTE Anforderungen

### Anforderung: Sitzungs-Timeout
Das System SOLLTE Sitzungen nach 30 Minuten Inaktivität beenden.
(Vorher: 60 Minuten)

#### Szenario: Leerlauf-Timeout
- ANGENOMMEN eine authentifizierte Sitzung
- WENN 30 Minuten ohne Aktivität vergehen
- WIRD die Sitzung ungültig

## ENTFERNTE Anforderungen

### Anforderung: Angemeldet bleiben
(Veraltet zugunsten von 2FA)
```

### Was beim Archivieren passiert

Wenn Sie eine Änderung archivieren:

1. **HINZUGEFÜGTE** Anforderungen werden an das Haupt-Spec angehängt
2. **GEÄNDERTE** Anforderungen ersetzen die vorhandene Version
3. **ENTFERNTE** Anforderungen werden aus dem Haupt-Spec gelöscht

Der Änderungsordner wird für die Audit-Historie nach `openspec/changes/archive/` verschoben.

## Beispiel: Ihre erste Änderung

Gehen wir durch, wie man einen dunklen Modus zu einer Anwendung hinzufügt.

### 1. Änderung starten (Standard)

```text
Sie: /opsx:propose add-dark-mode

KI:  Erstellt openspec/changes/add-dark-mode/
     ✓ proposal.md — warum wir das tun, was sich ändert
     ✓ specs/       — Anforderungen und Szenarien
     ✓ design.md    — technischer Ansatz
     ✓ tasks.md     — Implementierungs-Checkliste
     Bereit für die Implementierung!
```

Wenn Sie den erweiterten Workflow-Profil aktiviert haben, können Sie dies auch in zwei Schritten tun: `/opsx:new` dann `/opsx:ff` (oder `/opsx:continue` schrittweise).

### 2. Was erstellt wird

**proposal.md** - Erfasst die Absicht:

```markdown
# Vorschlag: Dunklen Modus hinzufügen

## Absicht
Benutzer haben nach einer Option für den dunklen Modus gefragt, um Augenbelastung bei nächtlicher Nutzung zu reduzieren.

## Umfang
- Theme-Umschalter in den Einstellungen hinzufügen
- Systempräferenz-Erkennung unterstützen
- Präferenz in localStorage speichern

## Vorgehensweise
Verwenden Sie CSS-Eigenschaften für das Theming mit einem React-Kontext für das Zustandsmanagement.
```

**specs/ui/spec.md** - Delta mit neuen Anforderungen:

```markdown
# Delta für UI

## HINZUGEFÜGTE Anforderungen

### Anforderung: Theme-Auswahl
Das System SOLLTE Benutzern erlauben, zwischen hellen und dunklen Themes zu wählen.

#### Szenario: Manueller Umschalter
- ANGENOMMEN ein Benutzer auf einer beliebigen Seite
- WENN der Benutzer auf den Theme-Umschalter klickt
- WIRD das Theme sofort umgeschaltet
- UND die Präferenz bleibt über Sitzungen hinweg erhalten

#### Szenario: Systempräferenz
- ANGENOMMEN ein Benutzer ohne gespeicherte Präferenz
- WENN die Anwendung geladen wird
- WIRD das bevorzugte Farbschema des Systems verwendet
```

**tasks.md** - Implementierungs-Checkliste:

```markdown
# Aufgaben

## 1. Theme-Infrastruktur
- [ ] 1.1 ThemeContext mit Hell/Dunkel-Zustand erstellen
- [ ] 1.2 CSS-Eigenschaften für Farben hinzufügen
- [ ] 1.3 localStorage-Persistenz implementieren

## 2. UI-Komponenten
- [ ] 2.1 ThemeToggle-Komponente erstellen
- [ ] 2.2 Umschalter zur Einstellungsseite hinzufügen
- [ ] 2.3 Header aktualisieren, um schnellen Umschalter einzuschließen

## 3. Styling
- [ ] 3.1 Farbpalette für dunkles Theme definieren
- [ ] 3.2 Komponenten aktualisieren, um CSS-Variablen zu verwenden
```

### 3. Implementieren

```
Sie: /opsx:apply

KI:  Bearbeite Aufgaben...
     ✓ 1.1 ThemeContext mit Hell/Dunkel-Zustand erstellt
     ✓ 1.2 CSS-Eigenschaften zu globals.css hinzugefügt
     ✓ 1.3 localStorage-Persistenz implementiert
     ✓ 2.1 ThemeToggle-Komponente erstellt
     ...
     Alle Aufgaben abgeschlossen!
```

Während der Implementierung, wenn Sie feststellen, dass das Design angepasst werden muss, aktualisieren Sie einfach das Artefakt und fahren Sie fort.

### 4. Archivieren

```
Sie: /opsx:archive

KI:  Archiviere add-dark-mode...
     ✓ Specs in openspec/specs/ui/spec.md zusammengeführt
     ✓ Nach openspec/changes/archive/2025-01-24-add-dark-mode/ verschoben
     Erledigt! Bereit für die nächste Funktion.
```

Ihre Delta-Specs sind nun Teil der Haupt-Specs und dokumentieren, wie Ihr System funktioniert.

## Überprüfen und Reviewen

Verwenden Sie die CLI, um Ihre Änderungen zu prüfen:

```bash
# Aktive Änderungen auflisten
openspec list

# Änderungsdetails anzeigen
openspec show add-dark-mode

# Spec-Formatierung validieren
openspec validate add-dark-mode

# Interaktives Dashboard
openspec view
```

## Nächste Schritte

- [Workflows](workflows.md) - Häufige Muster und wann jeder Befehl verwendet wird
- [Befehle](commands.md) - Vollständige Referenz für alle Slash-Befehle
- [Konzepte](concepts.md) - Tiefes Verständnis von Specs, Änderungen und Schemas
- [Anpassung](customization.md) - Lassen Sie OpenSpec nach Ihrer Art arbeiten