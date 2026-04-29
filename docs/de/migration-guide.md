# Migration zu OPSX

Dieser Leitfaden unterstützt Sie beim Übergang von der veralteten OpenSpec-Arbeitsweise zu OPSX. Die Migration ist so gestaltet, dass sie reibungslos verläuft – Ihre bisherige Arbeit bleibt erhalten, und das neue System bietet mehr Flexibilität.

## Was ändert sich?

OPSX ersetzt den alten phasenbasierten Arbeitsablauf durch einen flüssigen, aktionsbasierten Ansatz. Hier ist die wesentliche Änderung:

| Aspekt | Veraltet | OPSX |
|--------|----------|------|
| **Befehle** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Standard: `/opsx:propose`, `/opsx:apply`, `/opsx:archive` (erweiterte Workflow-Befehle optional) |
| **Arbeitsablauf** | Alle Artefakte auf einmal erstellen | Inkrementell oder auf einmal erstellen – Ihre Wahl |
| **Zurückkehren** | Umständliche Phasenübergänge | Natürlich – jederzeit jedes Artefakt aktualisieren |
| **Anpassbarkeit** | Feste Struktur | Schema-gesteuert, vollständig anpassbar |
| **Konfiguration** | `CLAUDE.md` mit Markierungen + `project.md` | Saubere Konfiguration in `openspec/config.yaml` |

**Die philosophische Änderung:** Arbeit ist nicht linear. OPSX hört auf, so zu tun, als wäre sie das.

## Vorab

### Ihre bestehenden Arbeiten sind sicher

Der Migrationsprozess wurde unter Berücksichtigung der Erhaltung entwickelt:

- **Aktive Änderungen in `openspec/changes/`** — Vollständig erhalten. Sie können diese mit OPSX-Befehlen fortsetzen.
- **Archivierte Änderungen** — Unberührt. Ihre Historie bleibt intakt.
- **Hauptspezifikationen in `openspec/specs/`** — Unberührt. Dies ist Ihre Wahrheitsquelle.
- **Ihre Inhalte in CLAUDE.md, AGENTS.md usw.** — Erhalten. Nur die OpenSpec-Markerblöcke werden entfernt; alles, was Sie geschrieben haben, bleibt erhalten.

### Was entfernt wird

Nur von OpenSpec verwaltete Dateien, die ersetzt werden:

| Was | Warum |
|------|-------|
| Veraltete Slash-Befehlsverzeichnisse/-dateien | Ersetzt durch das neue Skills-System |
| `openspec/AGENTS.md` | Veralteter Workflow-Trigger |
| OpenSpec-Marker in `CLAUDE.md`, `AGENTS.md` usw. | Nicht mehr benötigt |

**Veraltete Befehlsstandorte je nach Tool** (Beispiele – Ihr Tool kann abweichen):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (nur IDE-Erweiterungen; nicht im Copilot CLI unterstützt)
- Und andere (Augment, Continue, Amazon Q usw.)

Die Migration erkennt, welche Tools Sie konfiguriert haben, und räumt deren veraltete Dateien auf.

Die Liste der zu entfernenden Dateien mag lang erscheinen, aber dies sind alles Dateien, die OpenSpec ursprünglich erstellt hat. Ihre eigenen Inhalte werden nie gelöscht.

### Was Ihre Aufmerksamkeit erfordert

Eine Datei erfordert eine manuelle Migration:

**`openspec/project.md`** — Diese Datei wird nicht automatisch gelöscht, da sie Projektkontext enthalten könnte, den Sie verfasst haben. Sie müssen:

1. Ihren Inhalt überprüfen
2. Nützlichen Kontext in `openspec/config.yaml` verschieben (siehe Anleitung unten)
3. Die Datei löschen, wenn Sie bereit sind

**Warum wir diese Änderung vorgenommen haben:**

Die alte `project.md` war passiv – Agenten könnten sie lesen, könnten sie nicht lesen, könnten vergessen, was sie gelesen haben. Wir stellten fest, dass die Zuverlässigkeit inkonsistent war.

Der neue `config.yaml`-Kontext wird **aktiv in jede OpenSpec-Planungsanfrage injiziert**. Das bedeutet, dass Ihre Projektkonventionen, Ihr Technologie-Stack und Ihre Regeln immer vorhanden sind, wenn die AI Artefakte erstellt. Höhere Zuverlässigkeit.

**Der Kompromiss:**

Da der Kontext in jede Anfrage injiziert wird, sollten Sie prägnant sein. Konzentrieren Sie sich auf das, was wirklich wichtig ist:
- Technologie-Stack und wichtige Konventionen
- Nicht offensichtliche Einschränkungen, die die AI kennen muss
- Regeln, die zuvor oft ignoriert wurden

Keine Sorge, wenn es nicht perfekt ist. Wir lernen noch, was hier am besten funktioniert, und werden verbessern, wie die Kontextinjektion funktioniert, während wir experimentieren.

---

## Die Migration ausführen

Sowohl `openspec init` als auch `openspec update` erkennen veraltete Dateien und führen Sie durch denselben Bereinigungsprozess. Verwenden Sie den Befehl, der zu Ihrer Situation passt:

- Neue Installationen verwenden standardmäßig das Profil `core` (`propose`, `explore`, `apply`, `archive`).
- Migrierte Installationen erhalten Ihre zuvor installierten Workflows, indem sie bei Bedarf ein `custom`-Profil schreiben.

### Verwendung von `openspec init`

Führen Sie dies aus, wenn Sie neue Tools hinzufügen oder die Konfiguration der eingerichteten Tools ändern möchten:

```bash
openspec init
```

Der Init-Befehl erkennt veraltete Dateien und führt Sie durch die Bereinigung:

```
Upgrade auf das neue OpenSpec

OpenSpec verwendet jetzt Agent Skills, den aufkommenden Standard für Coding-Agenten. Dies vereinfacht Ihre Einrichtung, während alles wie zuvor funktioniert.

Zu entfernende Dateien
Keine Benutzerinhalte zu erhalten:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Zu aktualisierende Dateien
OpenSpec-Marker werden entfernt, Ihre Inhalte bleiben erhalten:
  • CLAUDE.md
  • AGENTS.md

Erfordert Ihre Aufmerksamkeit
  • openspec/project.md
    Wir werden diese Datei nicht löschen. Sie könnte nützlichen Projektkontext enthalten.

    Die neue openspec/config.yaml hat einen "context:"-Bereich für Planungskontext. Dieser wird in jede OpenSpec-Anfrage einbezogen und funktioniert zuverlässiger als der alte project.md-Ansatz.

    Überprüfen Sie project.md, verschieben Sie nützliche Inhalte in den context-Bereich von config.yaml und löschen Sie die Datei dann, wenn Sie bereit sind.

? Upgrade und veraltete Dateien bereinigen? (Y/n)
```

**Was passiert, wenn Sie Ja sagen:**

1. Veraltete Slash-Befehlsverzeichnisse werden entfernt
2. OpenSpec-Marker werden aus `CLAUDE.md`, `AGENTS.md` usw. entfernt (Ihre Inhalte bleiben erhalten)
3. `openspec/AGENTS.md` wird gelöscht
4. Neue Skills werden in `.claude/skills/` installiert
5. `openspec/config.yaml` wird mit einem Standard-Schema erstellt

### Verwendung von `openspec update`

Führen Sie dies aus, wenn Sie nur migrieren und Ihre vorhandenen Tools auf die neueste Version aktualisieren möchten:

```bash
openspec update
```

Der Update-Befehl erkennt und bereinigt ebenfalls veraltete Artefakte und aktualisiert dann die generierten Skills/Befehle, um sie an Ihr aktuelles Profil und Ihre Bereitstellungseinstellungen anzupassen.

### Nicht-interaktive / CI-Umgebungen

Für skriptgesteuerte Migrationen:

```bash
openspec init --force --tools claude
```

Die `--force`-Option überspringt Aufforderungen und akzeptiert die Bereinigung automatisch.

---

## Migration von project.md zu config.yaml

Die alte `openspec/project.md` war eine freiformierte Markdown-Datei für Projektkontext. Die neue `openspec/config.yaml` ist strukturiert und – entscheidend – **in jede Planungsanfrage injiziert**, sodass Ihre Konventionen immer vorhanden sind, wenn die AI arbeitet.

### Vorher (project.md)

```markdown
# Project Context

This is a TypeScript monorepo using React and Node.js.
We use Jest for testing and follow strict ESLint rules.
Our API is RESTful and documented in docs/api.md.

## Conventions

- All public APIs must maintain backwards compatibility
- New features should include tests
- Use Given/When/Then format for specifications
```

### Nachher (config.yaml)

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  Testing: Jest with React Testing Library
  API: RESTful, documented in docs/api.md
  We maintain backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan for risky changes
  specs:
    - Use Given/When/Then format for scenarios
    - Reference existing patterns before inventing new ones
  design:
    - Include sequence diagrams for complex flows
```

### Wesentliche Unterschiede

| project.md | config.yaml |
|------------|-------------|
| Freiformiertes Markdown | Strukturiertes YAML |
| Ein Textblock | Getrennter Kontext und artefaktspezifische Regeln |
| Unklar, wann es verwendet wird | Kontext erscheint in ALLEN Artefakten; Regeln erscheinen nur in passenden Artefakten |
| Keine Schemaauswahl | Explizites `schema:`-Feld setzt den Standardworkflow |

### Was behalten, was weglassen

Seien Sie bei der Migration selektiv. Fragen Sie sich: "Braucht die AI das für *jede* Planungsanfrage?"

**Gute Kandidaten für `context:`**
- Technologie-Stack (Sprachen, Frameworks, Datenbanken)
- Wichtige Architekturmuster (Monorepo, Microservices usw.)
- Nicht offensichtliche Einschränkungen ("Wir können Library X nicht verwenden, weil...")
- Kritische Konventionen, die oft ignoriert werden

**Stattdessen in `rules:` verschieben**
- Artefaktspezifische Formatierung ("Verwende Given/When/Then in Specs")
- Überprüfungskriterien ("Vorschläge müssen Rückfallpläne enthalten")
- Diese erscheinen nur für das passende Artefakt und halten andere Anfragen leichter

**Ganz weglassen**
- Allgemeine Best Practices, die die AI bereits kennt
 Ausführliche Erklärungen, die zusammengefasst werden könnten
- Historischer Kontext, der die aktuelle Arbeit nicht beeinflusst

### Migrationsschritte

1. **Erstellen Sie config.yaml** (falls nicht bereits durch init erstellt):
   ```yaml
   schema: spec-driven
   ```

2. **Fügen Sie Ihren Kontext hinzu** (seien Sie prägnant – dies geht in jede Anfrage):
   ```yaml
   context: |
     Ihr Projekt-Hintergrund kommt hier hin.
     Konzentrieren Sie sich auf das, was die AI wirklich wissen muss.
   ```

3. **Fügen Sie artefaktspezifische Regeln hinzu** (optional):
   ```yaml
   rules:
     proposal:
       - Ihre vorschlagspezifischen Leitlinien
     specs:
       - Ihre Regeln für die Spezifikationserstellung
   ```

4. **Löschen Sie project.md**, sobald Sie alles Nützliche verschoben haben.

**Überdenken Sie es nicht.** Beginnen Sie mit dem Wesentlichen und iterieren Sie. Wenn Sie bemerken, dass die AI etwas Wichtiges verpasst, fügen Sie es hinzu. Wenn der Kontext aufgebläht wirkt, kürzen Sie ihn. Dies ist ein lebendes Dokument.

### Brauchen Sie Hilfe? Verwenden Sie diesen Prompt

Wenn Sie unsicher sind, wie Sie Ihr project.md destillieren sollen, fragen Sie Ihren AI-Assistenten:

```
Ich migriere von OpenSpecs altem project.md zum neuen config.yaml-Format.

Hier ist mein aktuelles project.md:
[Fügen Sie Ihren project.md-Inhalt ein]

Bitte helfen Sie mir, eine config.yaml zu erstellen mit:
1. Einem prägnanten `context:`-Bereich (dies wird in jede Planungsanfrage injiziert, also halten Sie ihn knapp – konzentrieren Sie sich auf Technologie-Stack, wichtige Einschränkungen und Konventionen, die oft ignoriert werden)
2. `rules:` für spezifische Artefakte, falls ein Inhalt artefaktspezifisch ist (z.B. "Verwende Given/When/Then" gehört in die Specs-Regeln, nicht in den globalen Kontext)

Lassen Sie alles Allgemeine weg, was AI-Modelle bereits kennen. Seien Sie gnadenlos bei der Kürze.
```

Die AI wird Ihnen helfen, das Wesentliche vom Kürzbaren zu unterscheiden.

---

## Die neuen Befehle

Die Befehlsverfügbarkeit ist profilabhängig:

**Standard (`core`-Profil):**

| Befehl | Zweck |
|---------|---------|
| `/opsx:propose` | Eine Änderung erstellen und Planungsartefakte in einem Schritt generieren |
| `/opsx:explore` | Ideen ohne Struktur durchdenken |
| `/opsx:apply` | Aufgaben aus tasks.md implementieren |
| `/opsx:archive` | Änderung abschließen und archivieren |

**Erweiterter Workflow (benutzerdefinierte Auswahl):**

| Befehl | Zweck |
|---------|---------|
| `/opsx:new` | Eine neue Änderungsschablone starten |
| `/opsx:continue` | Das nächste Artefakt erstellen (eines nach dem anderen) |
| `/opsx:ff` | Schnellvorlauf – Planungsartefakte auf einmal erstellen |
| `/opsx:verify` | Überprüfen, ob die Implementierung den Spezifikationen entspricht |
| `/opsx:sync` | Vorschau/Spezifikation zusammenführen ohne zu archivieren |
| `/opsx:bulk-archive` | Mehrere Änderungen auf einmal archivieren |
| `/opsx:onboard` | Geführter End-to-End-Einarbeitungsworkflow |

Aktivieren Sie erweiterte Befehle mit `openspec config profile` und führen Sie dann `openspec update` aus.

### Befehlszuordnung aus der veralteten Version

| Veraltet | OPSX-Äquivalent |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (Standard) oder `/opsx:new` dann `/opsx:ff` (erweitert) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Neue Fähigkeiten

Diese Fähigkeiten sind Teil des erweiterten Workflow-Befehlssatzes.

**Detaillierte Artefakterstellung:**
```
/opsx:continue
```
Erstellt ein Artefakt nach dem anderen basierend auf Abhängigkeiten. Verwenden Sie dies, wenn Sie jeden Schritt überprüfen möchten.

**Erkundungsmodus:**
```
/opsx:explore
```
Durchdenken Sie Ideen mit einem Partner, bevor Sie sich für eine Änderung entscheiden.

---

## Das neue Architekturmodell verstehen

### Von der Phasenbindung zur Flexibilität

Der alte Workflow erzwang einen linearen Ablauf:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANUNG    │ ───► │ IMPLEMENTIERUNG│ ───► │ ARCHIVIERUNG │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

Wenn Sie in der Implementierung sind und feststellen, dass das Design falsch ist?
Pech gehabt. Phasentore lassen Sie nicht einfach zurückkehren.
```

OPSX verwendet Aktionen, nicht Phasen:

```
         ┌───────────────────────────────────────────────┐
         │           AKTIONEN (nicht Phasen)             │
         │                                               │
         │     neu ◄──► fortsetzen ◄──► anwenden ◄──► archivieren │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    beliebige Reihenfolge      │
         └───────────────────────────────────────────────┘
```

### Abhängigkeitsgraph

Artefakte bilden einen gerichteten Graphen. Abhängigkeiten sind Ermöglicher, keine Tore:

```
                        proposal
                       (Wurzelknoten)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (erfordert:                  (erfordert:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (erfordert:
                     specs, design)
```

Wenn Sie `/opsx:continue` ausführen, prüft das System, was bereit ist, und schlägt das nächste Artefakt vor. Sie können auch mehrere bereite Artefakte in beliebiger Reihenfolge erstellen.

### Skills vs. Befehle

Das alte System verwendete werkzeugspezifische Befehlsdateien:

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

Skills werden von mehreren KI-Programmierwerkzeugen erkannt und bieten reichhaltigere Metadaten.

---

## Vorhandene Änderungen fortsetzen

Ihre laufenden Änderungen arbeiten nahtlos mit OPSX-Befehlen zusammen.

**Haben Sie eine aktive Änderung aus dem alten Workflow?**

```
/opsx:apply add-my-feature
```

OPSX liest die vorhandenen Artefakte und setzt dort fort, wo Sie aufgehört haben.

**Möchten Sie weitere Artefakte zu einer bestehenden Änderung hinzufügen?**

```
/opsx:continue add-my-feature
```

Zeigt an, was basierend auf dem Vorhandenen zum Erstellen bereit ist.

**Möchten Sie den Status sehen?**

```bash
openspec status --change add-my-feature
```

---

## Das neue Konfigurationssystem

### Struktur von config.yaml

```yaml
# Erforderlich: Standard-Schema für neue Änderungen
schema: spec-driven

# Optional: Projektumfang (max. 50KB)
# Wird in ALLE Artefaktanweisungen eingespeist
context: |
  Ihr Projekt-Hintergrund, Technologie-Stack,
  Konventionen und Einschränkungen.

# Optional: Artefaktspezifische Regeln
# Werden nur in passende Artefakte eingespeist
rules:
  proposal:
    - Rückfallplan einbeziehen
  specs:
    - Given/When/Then-Format verwenden
  design:
    - Fallback-Strategien dokumentieren
  tasks:
    - In maximal 2-Stunden-Blöcke aufteilen
```

### Schema-Auflösung

Bei der Bestimmung, welches Schema verwendet wird, prüft OPSX in dieser Reihenfolge:

1. **CLI-Flag**: `--schema <name>` (höchste Priorität)
2. **Änderungsmetadaten**: `.openspec.yaml` im Änderungsverzeichnis
3. **Projektkonfiguration**: `openspec/config.yaml`
4. **Standard**: `spec-driven`

### Verfügbare Schemas

| Schema | Artefakte | Am besten geeignet für |
|--------|-----------|------------------------|
| `spec-driven` | proposal → specs → design → tasks | Die meisten Projekte |

Alle verfügbaren Schemas auflisten:

```bash
openspec schemas
```

### Benutzerdefinierte Schemas

Erstellen Sie Ihren eigenen Workflow:

```bash
openspec schema init my-workflow
```

Oder gabeln Sie einen bestehenden:

```bash
openspec schema fork spec-driven my-workflow
```

Siehe [Anpassung](customization.md) für Details.

---

## Fehlerbehebung

### "Legacy files detected in non-interactive mode"

Sie führen dies in einer CI- oder nicht-interaktiven Umgebung aus. Verwenden Sie:

```bash
openspec init --force
```

### Befehle erscheinen nach der Migration nicht

Starten Sie Ihre IDE neu. Skills werden beim Start erkannt.

### "Unknown artifact ID in rules"

Überprüfen Sie, ob Ihre `rules:`-Schlüssel mit den Artefakt-IDs Ihres Schemas übereinstimmen:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Führen Sie dies aus, um gültige Artefakt-IDs anzuzeigen:

```bash
openspec schemas --json
```

### Konfiguration wird nicht angewendet

1. Stellen Sie sicher, dass die Datei unter `openspec/config.yaml` liegt (nicht `.yml`)
2. Validieren Sie die YAML-Syntax
3. Konfigurationsänderungen werden sofort wirksam – kein Neustart erforderlich

### project.md wurde nicht migriert

Das System bewahrt `project.md` absichtlich auf, da es Ihre benutzerdefinierten Inhalte enthalten könnte. Überprüfen Sie es manuell, verschieben Sie nützliche Teile nach `config.yaml` und löschen Sie es dann.

### Möchten Sie sehen, was bereinigt würde?

Führen Sie init aus und lehnen Sie den Bereinigungshinweis ab – Sie sehen die vollständige Erkennungszusammenfassung, ohne dass Änderungen vorgenommen werden.

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
│       └── ...                   # Erweitertes Profil fügt new/continue/ff/etc. hinzu
├── CLAUDE.md                     # OpenSpec-Markierungen entfernt, Ihre Inhalte beibehalten
└── AGENTS.md                     # OpenSpec-Markierungen entfernt, Ihre Inhalte beibehalten
```

### Was verschwunden ist

- `.claude/commands/openspec/` — ersetzt durch `.claude/skills/`
- `openspec/AGENTS.md` — veraltet
- `openspec/project.md` — nach `config.yaml` migrieren, dann löschen
- OpenSpec-Markerblöcke in `CLAUDE.md`, `AGENTS.md` usw.

### Befehlsübersicht

```text
/opsx:propose      Schnell starten (Standard-Kernprofil)
/opsx:apply        Aufgaben implementieren
/opsx:archive      Abschließen und archivieren

# Erweiterter Workflow (falls aktiviert):
/opsx:new          Eine Änderung aufsetzen
/opsx:continue     Nächstes Artefakt erstellen
/opsx:ff           Planungsartefakte erstellen
```

---

## Hilfe erhalten

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Dokumentation**: [docs/opsx.md](opsx.md) für die vollständige OPSX-Referenz