# Migration zu OPSX

Dieser Leitfaden hilft Ihnen beim Umstieg vom veralteten OpenSpec-Workflow zu OPSX. Die Migration ist darauf ausgelegt, reibungslos zu verlaufen – Ihre bestehenden Arbeiten bleiben erhalten und das neue System bietet zusätzliche Flexibilität.

## Was ändert sich?

OPSX ersetzt den alten phasengesperrten Workflow durch einen flüssigen, aktionsbasierten Ansatz. Hier die wichtigste Änderung:

| Aspekt | Veraltet | OPSX |
|--------|----------|------|
| **Befehle** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Standard: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (erweiterte Workflow-Befehle optional) |
| **Workflow** | Alle Artefakte auf einmal erstellen | Schrittweise oder alle auf einmal erstellen – Sie haben die Wahl |
| **Zurückkehren** | Umständliche Phasensperren | Natürlich – Sie können jedes Artefakt jederzeit aktualisieren |
| **Anpassung** | Feste Struktur | Schema-basiert und vollständig frei anpassbar |
| **Konfiguration** | `CLAUDE.md` mit Markern + `project.md` | Saubere Konfiguration in `openspec/config.yaml` |

**Die philosophische Änderung:** Arbeit verläuft nicht linear. OPSX tut nicht mehr so, als ob dies der Fall wäre.
---

## Bevor Sie Beginnen

### Ihre vorhandene Arbeit ist sicher

Der Migrationsprozess ist mit dem Ziel der Erhaltung konzipiert:

- **Aktive Änderungen in `openspec/changes/`** — Vollständig erhalten. Sie können sie mit OPSX-Befehlen fortsetzen.
- **Archivierte Änderungen** — Unverändert. Ihre Historie bleibt intakt.
- **Hauptspezifikationen in `openspec/specs/`** — Unverändert. Dies sind Ihre Quelle der Wahrheit.
- **Ihre Inhalte in CLAUDE.md, AGENTS.md usw.** — Erhalten. Nur die OpenSpec-Markerblöcke werden entfernt; alles, was Sie geschrieben haben, bleibt erhalten.

### Was entfernt wird

Nur OpenSpec-verwaltete Dateien, die ersetzt werden:

| Was | Grund |
|------|-----|
| Legacy-Slash-Befehlsverzeichnisse/-dateien | Ersetzt durch das neue Skills-System |
| `openspec/AGENTS.md` | Veralteter Workflow-Trigger |
| OpenSpec-Marker in `CLAUDE.md`, `AGENTS.md` usw. | Nicht mehr benötigt |

**Legacy-Befehlsspeicherorte nach Tool** (Beispiele – Ihr Tool kann abweichen):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.cinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (nur IDE-Erweiterungen; nicht unterstützt in Copilot CLI)
- Codex: OpenSpec verwendet jetzt `.codex/skills/openspec-*`; die Legacy-Bereinigung zielt nur auf die von OpenSpec zugelassenen Prompt-Dateinamen in `$CODEX_HOME/prompts` oder `~/.codex/prompts` ab und entfernt sie nur, nachdem Ersatz-Skills vorhanden sind.
- Und weitere (Augment, Continue, Amazon Q usw.)

Die Migration erkennt alle von Ihnen konfigurierten Tools und bereinigt deren Legacy-Dateien.

Die Liste der zu entfernenden Dateien mag lang erscheinen, aber dies sind alles Dateien, die OpenSpec ursprünglich erstellt hat. Ihre eigenen Inhalte werden niemals gelöscht.

### Was Ihre Aufmerksamkeit erfordert

Eine Datei erfordert eine manuelle Migration:

**`openspec/project.md`** — Diese Datei wird nicht automatisch gelöscht, da sie von Ihnen geschriebenen Projektkontext enthalten kann. Sie müssen:

1. Überprüfen Sie deren Inhalt
2. Nützlichen Kontext nach `openspec/config.yaml` verschieben (siehe Anleitung unten)
3. Löschen Sie die Datei, wenn Sie fertig sind

**Warum wir diese Änderung vorgenommen haben:**

Die alte `project.md` war passiv – Agents konnten sie lesen, mussten es aber nicht, und konnten vergessen, was sie gelesen haben. Wir haben festgestellt, dass die Zuverlässigkeit uneinheitlich war.

Der Kontext der neuen `config.yaml` wird **aktiv in jede OpenSpec-Planungsanfrage injiziert**. Das bedeutet, dass Ihre Projektkonventionen, Ihr Tech-Stack und Ihre Regeln immer vorhanden sind, wenn die KI Artefakte erstellt. Höhere Zuverlässigkeit.

**Der Kompromiss:**

Da der Kontext in jede Anfrage injiziert wird, sollten Sie präzise sein. Konzentrieren Sie sich auf das, was wirklich wichtig ist:
- Tech-Stack und zentrale Konventionen
- Nicht offensichtliche Einschränkungen, die die KI kennen muss
- Regeln, die zuvor häufig ignoriert wurden

Machen Sie sich keine Sorgen, wenn es nicht perfekt ist. Wir lernen noch, was hier am besten funktioniert, und wir werden die Funktionsweise der Kontextinjektion im Rahmen unserer Experimente weiter verbessern.

---

## Ausführen der Migration

Sowohl `openspec init` als auch `openspec update` erkennen Legacy-Dateien und führen Sie durch den gleichen Bereinigungsprozess. Verwenden Sie den Befehl, der zu Ihrer Situation passt:

- Neue Installationen verwenden standardmäßig das Profil `core` (`propose`, `explore`, `apply`, `sync`, `archive`).
- Migrierte Installationen bewahren Ihre zuvor installierten Workflows, indem sie bei Bedarf ein `custom`-Profil schreiben.

### Verwendung von `openspec init`

Führen Sie dies aus, wenn Sie neue Tools hinzufügen oder neu konfigurieren möchten, welche Tools eingerichtet werden:

```bash
openspec init
```

Der Init-Befehl erkennt Legacy-Dateien und führt Sie durch die Bereinigung:

```
Aktualisierung auf das neue OpenSpec

OpenSpec verwendet jetzt Agent-Skills, den aufkommenden Standard für Coding-Agents.
Dies vereinfacht Ihre Einrichtung, während alles wie zuvor funktioniert.

Zu entfernende Dateien
Keine zu erhaltenden Benutzerinhalte:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Zu aktualisierende Dateien
OpenSpec-Marker werden entfernt, Ihre Inhalte bleiben erhalten:
  • CLAUDE.md
  • AGENTS.md

Erfordert Ihre Aufmerksamkeit
  • openspec/project.md
    Wir löschen diese Datei nicht. Sie kann nützlichen Projektkontext enthalten.

    Die neue openspec/config.yaml hat einen "context:"-Abschnitt für Planungskontext.
    Dieser wird in jede OpenSpec-Anfrage einbezogen und funktioniert zuverlässiger als der alte project.md-Ansatz.

    Überprüfen Sie project.md, verschieben Sie alle nützlichen Inhalte in den context-Abschnitt von config.yaml und löschen Sie die Datei dann, wenn Sie fertig sind.

? Legacy-Dateien aktualisieren und bereinigen? (Y/n)
```

**Was passiert, wenn Sie mit Ja antworten:**

1. Legacy-Slash-Befehlsverzeichnisse werden entfernt
2. OpenSpec-Marker werden aus `CLAUDE.md`, `AGENTS.md` usw. entfernt (Ihre Inhalte bleiben erhalten)
3. `openspec/AGENTS.md` wird gelöscht
4. Neue Skills werden in `.claude/skills/` installiert
5. `openspec/config.yaml` wird mit einem Standardschema erstellt

### Verwendung von `openspec update`

Führen Sie dies aus, wenn Sie nur Ihre vorhandenen Tools migrieren und auf die neueste Version aktualisieren möchten:

```bash
openspec update
```

Der Update-Befehl erkennt und bereinigt ebenfalls Legacy-Artefakte und aktualisiert dann generierte Skills/Befehle, um sie an Ihr aktuelles Profil und Ihre Bereitstellungseinstellungen anzupassen.

### Nicht-interaktive / CI-Umgebungen

Für skriptgesteuerte Migrationen:

```bash
openspec init --force --tools claude
```

Das Flag `--force` überspringt Eingabeaufforderungen und akzeptiert die Bereinigung automatisch.

Dies umfasst die Bereinigung von OpenSpec-verwalteten Codex-Prompt-Dateien im globalen Codex-Prompt-Verzeichnis. Die Bereinigung zielt nur auf die von OpenSpec zugelassenen Legacy-Codex-Prompt-Dateinamen ab, entfernt sie nur, nachdem Ersatz-Skills unter `.codex/skills/openspec-*` vorhanden sind, und bewahrt alle anderen Dateien auf.

---

## Migration von project.md zu config.yaml

Die alte `openspec/project.md` war eine freiformatierte Markdown-Datei für Projektkontext. Die neue `openspec/config.yaml` ist strukturiert und – entscheidend – **wird in jede Planungsanfrage injiziert**, sodass Ihre Konventionen immer vorhanden sind, wenn die KI arbeitet.

### Vorher (project.md)

```markdown
# Projektkontext

Dies ist ein TypeScript-Monorepo, das React und Node.js verwendet.
Wir verwenden Jest zum Testen und befolgen strenge ESLint-Regeln.
Unsere API ist RESTful und in docs/api.md dokumentiert.

## Konventionen

- Alle öffentlichen APIs müssen die Abwärtskompatibilität gewährleisten
- Neue Funktionen sollten Tests enthalten
- Verwenden Sie das Given/When/Then-Format für Spezifikationen
```

### Nachher (config.yaml)

```yaml
schema: spec-driven

context: |
  Tech-Stack: TypeScript, React, Node.js
  Testen: Jest mit React Testing Library
  API: RESTful, dokumentiert in docs/api.md
  Wir gewährleisten Abwärtskompatibilität für alle öffentlichen APIs

rules:
  proposal:
    - Fügen Sie einen Rollback-Plan für riskante Änderungen hinzu
  specs:
    - Verwenden Sie das Given/When/Then-Format für Szenarien
    - Verweisen Sie auf vorhandene Muster, bevor Sie neue erfinden
  design:
    - Fügen Sie Sequenzdiagramme für komplexe Abläufe hinzu
```

### Wichtige Unterschiede

| project.md | config.yaml |
|------------|-------------|
| Freiformatierte Markdown | Strukturiertes YAML |
| Ein einziger Textblock | Getrennter Kontext und pro-Artefakt-Regeln |
| Unklar, wann es verwendet wird | Kontext erscheint in ALLEN Artefakten; Regeln erscheinen nur in passenden Artefakten |
| Keine Schemaauswahl | Explizites `schema:`-Feld legt den Standard-Workflow fest |

### Was behalten, was entfernen

Bei der Migration seien Sie selektiv. Fragen Sie sich: "Braucht die KI dies für *jede* Planungsanfrage?"

**Gute Kandidaten für `context:`**
- Tech-Stack (Sprachen, Frameworks, Datenbanken)
- Zentrale Architekturmuster (Monorepo, Microservices usw.)
- Nicht offensichtliche Einschränkungen ("wir können Bibliothek X nicht verwenden, weil...")
- Kritische Konventionen, die häufig ignoriert werden

**Stattdessen in `rules:` verschieben**
- Artefakt-spezifische Formatierung ("verwenden Sie Given/When/Then in Spezifikationen")
- Prüfkriterien ("Vorschläge müssen Rollback-Pläne enthalten")
- Diese erscheinen nur für das passende Artefakt und halten andere Anfragen leichter

**Ganz weglassen**
- Allgemeine Best Practices, die die KI bereits kennt
- Ausführliche Erklärungen, die zusammengefasst werden könnten
- Historischer Kontext, der keine Auswirkung auf die aktuelle Arbeit hat

### Migrationsschritte

1. **Erstellen Sie config.yaml** (falls nicht bereits durch Init erstellt):
   ```yaml
   schema: spec-driven
   ```

2. **Fügen Sie Ihren Kontext hinzu** (seien Sie präzise – dies geht in jede Anfrage):
   ```yaml
   context: |
     Ihr Projekthintergrund gehört hierher.
     Konzentrieren Sie sich auf das, was die KI wirklich wissen muss.
   ```

3. **Fügen Sie pro-Artefakt-Regeln hinzu** (optional):
   ```yaml
   rules:
     proposal:
       - Ihre vorschlagsspezifischen Anleitungen
     specs:
       - Ihre Regeln für das Schreiben von Spezifikationen
   ```

4. **Löschen Sie project.md**, sobald Sie alles Nützliche verschoben haben.

**Machen Sie sich keine Gedanken darum.** Beginnen Sie mit dem Wesentlichen und iterieren Sie. Wenn Sie feststellen, dass die KI etwas Wichtiges vergisst, fügen Sie es hinzu. Wenn der Kontext überladen erscheint, kürzen Sie ihn. Dies ist ein lebendes Dokument.

### Brauchen Sie Hilfe? Verwenden Sie diese Eingabeaufforderung

Wenn Sie unsicher sind, wie Sie Ihre project.md zusammenfassen sollen, fragen Sie Ihren KI-Assistenten:

```
Ich migriere von der alten OpenSpec-project.md zum neuen config.yaml-Format.

Hier ist meine aktuelle project.md:
[Fügen Sie hier den Inhalt Ihrer project.md ein]

Bitte helfen Sie mir, eine config.yaml zu erstellen mit:
1. Einem präzisen `context:`-Abschnitt (dieser wird in jede Planungsanfrage injiziert, halten Sie ihn also knapp – konzentrieren Sie sich auf Tech-Stack, zentrale Einschränkungen und Konventionen, die häufig ignoriert werden)
2. `rules:` für spezifische Artefakte, falls Inhalte artefakt-spezifisch sind (z. B. gehört "verwenden Sie Given/When/Then" in die Spezifikationsregeln, nicht in den globalen Kontext)

Lassen Sie alles Generische weg, das KI-Modelle bereits wissen. Seien Sie schonungslos bei der Kürze.
```

Die KI hilft Ihnen, zu identifizieren, was wesentlich ist und was gekürzt werden kann.

---

## Die neuen Befehle

Die Befehlsverfügbarkeit hängt vom Profil ab:

**Standard (`core`-Profil):**

| Befehl | Zweck |
|---------|-------|
| `/opsx:propose` | Erstellen Sie eine Änderung und generieren Sie Planungsartefakte in einem Schritt |
| `/opsx:explore` | Durchdenken Sie Ideen ohne Struktur |
| `/opsx:apply` | Implementieren Sie Aufgaben aus tasks.md |
| `/opsx:archive` | Finalisieren und archivieren Sie die Änderung |

**Erweiterter Workflow (benutzerdefinierte Auswahl):**

| Befehl | Zweck |
|---------|-------|
| `/opsx:new` | Starten Sie ein neues Änderungsgerüst |
| `/opsx:continue` | Erstellen Sie das nächste Artefakt (eines nach dem anderen) |
| `/opsx:ff` | Fast-Forward – Erstellen Sie Planungsartefakte auf einmal |
| `/opsx:verify` | Überprüfen Sie, ob die Implementierung den Spezifikationen entspricht |
| `/opsx:sync` | Führen Sie Delta-Spezifikationen in Hauptspezifikationen zusammen |
| `/opsx:bulk-archive` | Archivieren Sie mehrere Änderungen auf einmal |
| `/opsx:onboard` | Geführter End-to-End-Onboarding-Workflow |

Aktivieren Sie erweiterte Befehle mit `openspec config profile`, dann führen Sie `openspec update` aus.

### Befehlszuordnung aus dem Legacy-System

| Legacy | OPSX-Äquivalent |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (Standard) oder `/opsx:new` dann `/opsx:ff` (erweitert) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Neue Funktionen

Diese Funktionen sind Teil des erweiterten Workflow-Befehlssatzes.

**Granulare Artefakterstellung:**
```
/opsx:continue
```
Erstellt ein Artefakt nach dem anderen basierend auf Abhängigkeiten. Verwenden Sie dies, wenn Sie jeden Schritt überprüfen möchten.

**Explorationsmodus:**
```
/opsx:explore
```
Durchdenken Sie Ideen mit einem Partner, bevor Sie sich zu einer Änderung verpflichten.

---

## Verständnis der neuen Architektur

### Von phasengesperrt zu fließend

Der Legacy-Workflow erzwingte einen linearen Verlauf:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

Wenn Sie sich in der Implementierung befinden und feststellen, dass das Design falsch ist?
Pech gehabt. Phasentore lassen einen nicht einfach zurückgehen.
```

OPSX verwendet Aktionen, keine Phasen:

```
         ┌───────────────────────────────────────────────┐
         │           ACTIONS (not phases)                │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    any order                  │
         └───────────────────────────────────────────────┘
```

### Abhängigkeitsgraph

Artefakte bilden einen gerichteten Graphen. Abhängigkeiten sind Enabler, keine Tore:

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

Wenn Sie `/opsx:continue` ausführen, prüft es, was bereit ist, und bietet das nächste Artefakt an. Sie können auch mehrere bereite Artefakte in beliebiger Reihenfolge erstellen.

### Skills im Vergleich zu Befehlen

Das Legacy-System verwendete tool-spezifische Befehlsdateien:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX verwendet den aufkommenden **Skills**-Standard:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Skills werden von mehreren KI-Coding-Tools erkannt und bieten umfassendere Metadaten.

Codex ist in OPSX nur auf Skills angewiesen. OpenSpec generiert keine benutzerdefinierten Codex-Prompt-Dateien mehr; verwenden Sie stattdessen die generierten Verzeichnisse `.codex/skills/openspec-*`.

## Fortsetzung bestehender Änderungen

Ihre laufenden Änderungen funktionieren nahtlos mit OPSX-Befehlen.

**Haben Sie eine aktive Änderung aus dem Legacy-Workflow?**

```
/opsx:apply add-my-feature
```

OPSX liest die vorhandenen Artefakte ein und setzt dort fort, wo Sie aufgehört haben.

**Möchten Sie weitere Artefakte zu einer bestehenden Änderung hinzufügen?**

```
/opsx:continue add-my-feature
```

Zeigt an, was auf Basis der bereits vorhandenen Inhalte erstellt werden kann.

**Möchten Sie den Status einsehen?**

```bash
openspec status --change add-my-feature
```

---

## Das neue Konfigurationssystem

### Struktur von config.yaml

```yaml
# Erforderlich: Standardschema für neue Änderungen
schema: spec-driven

# Optional: Projektkontext (max. 50 KB)
# Wird in ALLE Artefakt-Anweisungen eingefügt
context: |
  Ihr Projekt-Hintergrund, Tech-Stack,
  Konventionen und Einschränkungen.

# Optional: Artefakt-spezifische Regeln
# Wird nur in passende Artefakte eingefügt
rules:
  proposal:
    - Rollback-Plan hinzufügen
  specs:
    - Given/When/Then-Format verwenden
  design:
    - Fallback-Strategien dokumentieren
  tasks:
    - In maximal 2-stündige Arbeitspakete aufteilen
```

### Schema-Auflösung

Bei der Bestimmung des zu verwendenden Schemas prüft OPSX in folgender Reihenfolge:

1. **CLI-Flag**: `--schema <Name>` (höchste Priorität)
2. **Änderungs-Metadaten**: `.openspec.yaml` im Änderungsverzeichnis
3. **Projektkonfiguration**: `openspec/config.yaml`
4. **Standard**: `spec-driven`

### Verfügbare Schemata

| Schema | Artefakte | Am besten geeignet für |
|--------|-----------|----------|
| `spec-driven` | proposal → specs → design → tasks | Die meisten Projekte |

Listen Sie alle verfügbaren Schemata auf:

```bash
openspec schemas
```

### Benutzerdefinierte Schemata

Erstellen Sie Ihren eigenen Workflow:

```bash
openspec schema init my-workflow
```

Oder forken Sie ein bestehendes:

```bash
openspec schema fork spec-driven my-workflow
```

Siehe [Anpassung](customization.md) für Details.

---

## Fehlerbehebung

### "Legacy-Dateien im nicht-interaktiven Modus erkannt"

Sie führen dies in einer CI- oder nicht-interaktiven Umgebung aus. Verwenden Sie:

```bash
openspec init --force
```

### Befehle erscheinen nach der Migration nicht

Starten Sie Ihre IDE neu. Skills werden beim Start erkannt.

### "Unbekannte Artefakt-ID in Regeln"

Prüfen Sie, dass die Schlüssel unter `rules:` mit den Artefakt-IDs Ihres Schemas übereinstimmen:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Führen Sie diesen Befehl aus, um gültige Artefakt-IDs anzuzeigen:

```bash
openspec schemas --json
```

### Konfiguration wird nicht angewendet

1. Stellen Sie sicher, dass die Datei unter `openspec/config.yaml` (nicht `.yml`) abgelegt ist
2. Überprüfen Sie die YAML-Syntax
3. Konfigurationsänderungen werden sofort wirksam – ein Neustart ist nicht erforderlich

### project.md wurde nicht migriert

Das System bewahrt `project.md` absichtlich auf, da es Ihre benutzerdefinierten Inhalte enthalten kann. Prüfen Sie die Datei manuell, verschieben Sie nützliche Teile nach `config.yaml` und löschen Sie die Datei anschließend.

### Möchten Sie sehen, was aufgeräumt würde?

Führen Sie `init` aus und lehnen Sie den Aufräum-Prompt ab – Sie erhalten die vollständige Erkennungsübersicht, ohne dass Änderungen vorgenommen werden.

---

## Schnellreferenz

### Dateien nach der Migration

```
project/
├── openspec/
│   ├── specs/                    # Unverändert
│   ├── changes/                  # Unverändert
│   │   └── archive/              # Unverändert
│   └── config.yaml               # NEU: Projektkonfiguration
├── .claude/
│   └── skills/                   # NEU: OPSX-Skills
│       ├── openspec-propose/     # Standard-Kernprofil
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # Erweitertes Profil fügt new/continue/ff/etc. hinzu
├── CLAUDE.md                     # OpenSpec-Marker entfernt, Ihre Inhalte bleiben erhalten
└── AGENTS.md                     # OpenSpec-Marker entfernt, Ihre Inhalte bleiben erhalten
```

### Was entfernt wurde

- `.claude/commands/openspec/` — ersetzt durch `.claude/skills/`
- `openspec/AGENTS.md` — veraltet
- `openspec/project.md` — nach `config.yaml` migrieren, dann löschen
- OpenSpec-Marker-Blöcke in `CLAUDE.md`, `AGENTS.md` usw.

### Befehlsübersicht

```text
/opsx:propose      Schnell starten (Standard-Kernprofil)
/opsx:apply        Aufgaben umsetzen
/opsx:archive      Abschließen und archivieren

# Erweiterter Workflow (falls aktiviert):
/opsx:new          Änderung erstellen
/opsx:continue     Nächstes Artefakt erstellen
/opsx:ff           Planungsartefakte erstellen
```

---

## Hilfe erhalten

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Dokumentation**: [docs/opsx.md](opsx.md) für die vollständige OPSX-Referenz