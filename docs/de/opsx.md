# OPSX-Workflow

> Feedback willkommen auf [Discord](https://discord.gg/YctCnvvshC).

## Was ist das?

OPSX ist jetzt der Standard-Workflow für OpenSpec.

Es ist ein **flüssiger, iterativer Workflow** für OpenSpec-Änderungen. Keine starren Phasen mehr – nur Aktionen, die Sie jederzeit ausführen können.

## Warum dies existiert

Der Legacy-OpenSpec-Workflow funktioniert, ist aber **festgelegt**:

- **Anweisungen sind fest kodiert** — in TypeScript vergraben, Sie können sie nicht ändern
- **Alles oder nichts** — ein großer Befehl erstellt alles, einzelne Teile können nicht getestet werden
- **Feste Struktur** — gleicher Workflow für alle, keine Anpassung
- **Black Box** — wenn die KI-Ausgabe schlecht ist, können Sie die Prompts nicht anpassen

**OPSX öffnet es.** Jetzt kann jeder:

1. **Mit Anweisungen experimentieren** — eine Vorlage bearbeiten und sehen, ob die KI es besser macht
2. **Granular testen** — die Anweisungen jedes Artefakts unabhängig validieren
3. **Workflows anpassen** — eigene Artefakte und Abhängigkeiten definieren
4. **Schnell iterieren** — eine Vorlage ändern, sofort testen, kein Neuaufbau

```
Legacy-Workflow:                      OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Im Paket hartkodiert  │           │  schema.yaml           │◄── Sie bearbeiten dies
│  (kann nicht geändert  │           │  templates/*.md        │◄── Oder dies
│  werden)               │           │        ↓               │
│        ↓               │           │  Sofortige Wirkung     │
│  Auf neue Version      │           │        ↓               │
│  warten                │           │  Selber testen         │
│        ↓               │           │                        │
│  Hoffen, dass es besser│           │                        │
│  wird                  │           │                        │
└────────────────────────┘           └────────────────────────┘
```

**Das ist für alle:**
- **Teams** — erstellen Sie Workflows, die Ihrer tatsächlichen Arbeitsweise entsprechen
- **Power-User** — passen Sie Prompts an, um bessere KI-Ergebnisse für Ihren Code zu erhalten
- **OpenSpec-Mitwirkende** — experimentieren Sie mit neuen Ansätzen ohne Releases

Wir lernen alle noch, was am besten funktioniert. OPSX ermöglicht es uns, gemeinsam zu lernen.

## Die Benutzererfahrung

**Das Problem mit linearen Workflows:**
Sie sind in der „Planungsphase“, dann in der „Implementierungsphase“, dann „fertig“. Aber echte Arbeit funktioniert nicht so. Sie implementieren etwas, erkennen, dass Ihr Design falsch war, müssen Spezifikationen aktualisieren und weiter implementieren. Lineare Phasen widersprechen der tatsächlichen Arbeitsweise.

**OPSX-Ansatz:**
- **Aktionen, nicht Phasen** — erstellen, implementieren, aktualisieren, archivieren — jederzeit alles davon tun
- **Abhängigkeiten sind Ermöglicher** — sie zeigen, was möglich ist, nicht was als nächstes erforderlich ist

```
  Vorschlag ──→ Spezifikationen ──→ Design ──→ Aufgaben ──→ Implementierung
```

## Einrichtung

```bash
# Stellen Sie sicher, dass openspec installiert ist — Skills werden automatisch generiert
openspec init
```

Dies erstellt Skills in `.claude/skills/` (oder Äquivalent), die von KI-Coding-Assistenten automatisch erkannt werden.

Standardmäßig verwendet OpenSpec das `core`-Workflow-Profil (`propose`, `explore`, `apply`, `sync`, `archive`). Wenn Sie die erweiterten Workflow-Befehle (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) verwenden möchten, konfigurieren Sie diese mit `openspec config profile` und wenden Sie sie mit `openspec update` an.

Während der Einrichtung werden Sie aufgefordert, eine **Projektkonfiguration** (`openspec/config.yaml`) zu erstellen. Dies ist optional, aber empfohlen.

## Projektkonfiguration

Die Projektkonfiguration ermöglicht es Ihnen, Standardwerte festzulegen und projektspezifischen Kontext in alle Artefakte einzufügen.

### Konfiguration erstellen

Die Konfiguration wird während `openspec init` erstellt oder manuell:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech-Stack: TypeScript, React, Node.js
  API-Konventionen: RESTful, JSON-Antworten
  Tests: Vitest für Unit-Tests, Playwright für E2E
  Stil: ESLint mit Prettier, striktes TypeScript

rules:
  proposal:
    - Rollback-Plan einbeziehen
    - Betroffene Teams identifizieren
  specs:
    - Given/When/Then-Format für Szenarien verwenden
  design:
    - Sequenzdiagramme für komplexe Abläufe einbeziehen
```

### Konfigurationsfelder

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `schema` | string | Standard-Schema für neue Änderungen (z.B. `spec-driven`) |
| `context` | string | Projektkontext, der in alle Artefakt-Anweisungen eingefügt wird |
| `rules` | object | Artefaktspezifische Regeln, nach Artefakt-ID geschlüsselt |

### Funktionsweise

**Schema-Vorrang** (höchster bis niedrigster):
1. CLI-Flag (`--schema <name>`)
2. Änderungsmetadaten (`.openspec.yaml` im Änderungsverzeichnis)
3. Projektkonfiguration (`openspec/config.yaml`)
4. Standard (`spec-driven`)

**Kontext-Einfügung:**
- Der Kontext wird jeder Artefakt-Anweisung vorangestellt
- In `<context>...</context>`-Tags verpackt
- Hilft der KI, die Konventionen Ihres Projekts zu verstehen

**Regel-Einfügung:**
- Regeln werden nur für passende Artefakte eingefügt
- In `<rules>...</rules>`-Tags verpackt
- Erscheinen nach dem Kontext, vor der Vorlage

### Artefakt-IDs nach Schema

**spec-driven** (Standard):
- `proposal` — Änderungsvorschlag
- `specs` — Spezifikationen
- `design` — Technisches Design
- `tasks` — Implementierungsaufgaben

### Konfigurationsvalidierung

- Unbekannte Artefakt-IDs in `rules` erzeugen Warnungen
- Schema-Namen werden gegen verfügbare Schemas validiert
- Kontext hat ein Limit von 50 KB
- Ungültiges YAML wird mit Zeilennummern gemeldet

### Fehlerbehebung

**„Unbekannte Artefakt-ID in Regeln: X"**
- Überprüfen Sie, ob die Artefakt-IDs Ihrem Schema entsprechen (siehe Liste oben)
- Führen Sie `openspec schemas --json` aus, um die Artefakt-IDs für jedes Schema anzuzeigen

**Konfiguration wird nicht angewendet:**
- Stellen Sie sicher, dass die Datei unter `openspec/config.yaml` liegt (nicht `.yml`)
- Überprüfen Sie die YAML-Syntax mit einem Validator
- Konfigurationsänderungen werden sofort wirksam (kein Neustart erforderlich)

**Kontext zu groß:**
- Kontext ist auf 50 KB begrenzt
- Fassen Sie zusammen oder verlinken Sie auf externe Dokumente

## Befehle

| Befehl | Was er tut |
|--------|------------|
| `/opsx:propose` | Erstellt eine Änderung und generiert Planungsartefakte in einem Schritt (Standard-Schnellpfad) |
| `/opsx:explore` | Ideen durchdenken, Probleme untersuchen, Anforderungen klären |
| `/opsx:new` | Startet ein neues Änderungsgerüst (erweiterter Workflow) |
| `/opsx:continue` | Erstellt das nächste Artefakt (erweiterter Workflow) |
| `/opsx:ff` | Spult Planungsartefakte vor (erweiterter Workflow) |
| `/opsx:apply` | Implementiert Aufgaben und aktualisiert bei Bedarf Artefakte |
| `/opsx:verify` | Validiert die Implementierung gegen Artefakte (erweiterter Workflow) |
| `/opsx:sync` | Synchronisiert Delta-Spezifikationen mit dem Hauptzweig (Standard-Workflow, optional) |
| `/opsx:archive` | Archiviert bei Fertigstellung |
| `/opsx:bulk-archive` | Archiviert mehrere abgeschlossene Änderungen (erweiterter Workflow) |
| `/opsx:onboard` | Geführter Durchlauf einer End-to-End-Änderung (erweiterter Workflow) |

## Verwendung

### Eine Idee erkunden
```
/opsx:explore
```
Ideen durchdenken, Probleme untersuchen, Optionen vergleichen. Keine Struktur erforderlich – nur ein Denkpartner. Wenn Erkenntnisse reifen, wechseln Sie zu `/opsx:propose` (Standard) oder `/opsx:new`/`/opsx:ff` (erweitert).

### Eine neue Änderung starten
```
/opsx:propose
```
Erstellt die Änderung und generiert die für die Implementierung benötigten Planungsartefakte.

Wenn Sie erweiterte Workflows aktiviert haben, können Sie stattdessen verwenden:

```text
/opsx:new        # nur Gerüst
/opsx:continue   # erstellt ein Artefakt nach dem anderen
/opsx:ff         # erstellt alle Planungsartefakte auf einmal
```

### Artefakte erstellen
```
/opsx:continue
```
Zeigt basierend auf Abhängigkeiten an, was erstellt werden kann, und erstellt dann ein Artefakt. Verwenden Sie es wiederholt, um Ihre Änderung schrittweise aufzubauen.

```
/opsx:ff add-dark-mode
```
Erstellt alle Planungsartefakte auf einmal. Verwenden Sie es, wenn Sie ein klares Bild davon haben, was Sie bauen.

### Implementieren (der fließende Teil)
```
/opsx:apply
```
Arbeitet Aufgaben ab und hakt sie währenddessen ab. Wenn Sie mehrere Änderungen jonglieren, können Sie `/opsx:apply <name>` ausführen; andernfalls sollte es aus dem Gespräch ableiten und Sie auffordern, zu wählen, wenn es nicht sicher ist.

### Abschließen
```
/opsx:archive   # Bei Fertigstellung ins Archiv verschieben (fordert bei Bedarf zur Synchronisierung von Spezifikationen auf)
```

## Wann aktualisieren vs. neu beginnen

Sie können Ihren Vorschlag oder Ihre Spezifikationen vor der Implementierung jederzeit bearbeiten. Aber wann wird Verfeinern zu „das ist andere Arbeit“?

### Was ein Vorschlag erfasst

Ein Vorschlag definiert drei Dinge:
1. **Absicht** — Welches Problem lösen Sie?
2. **Umfang** — Was liegt im/außerhalb des Bereichs?
3. **Ansatz** — Wie werden Sie es lösen?

Die Frage ist: Was hat sich geändert, und um wie viel?

### Die bestehende Änderung aktualisieren, wenn:

**Gleiche Absicht, verfeinerte Ausführung**
- Sie entdecken Randfälle, die Sie nicht bedacht haben
- Der Ansatz muss angepasst werden, aber das Ziel bleibt unverändert
- Die Implementierung zeigt, dass das Design leicht daneben lag

**Umfang verengt sich**
- Sie erkennen, dass der volle Umfang zu groß ist, und möchten zuerst ein MVP ausliefern
- „Dunkelmodus hinzufügen“ → „Dunkelmodus-Umschalter hinzufügen (Systempräferenz in v2)“

**Lerngesteuerte Korrekturen**
- Die Codebasis ist nicht so strukturiert, wie Sie dachten
- Eine Abhängigkeit funktioniert nicht wie erwartet
- „CSS-Variablen verwenden“ → „Stattdessen Tailwinds dark:-Präfix verwenden“

### Eine neue Änderung starten, wenn:

**Die Absicht hat sich grundlegend geändert**
- Das Problem selbst ist jetzt anders
- „Dunkelmodus hinzufügen“ → „Umfassendes Themen-System mit benutzerdefinierten Farben, Schriftarten, Abständen hinzufügen“

**Umfang ist explodiert**
- Die Änderung ist so gewachsen, dass es im Wesentlichen andere Arbeit ist
- Der ursprüngliche Vorschlag wäre nach Aktualisierungen nicht wiederzuerkennen
- „Login-Bug beheben“ → „Authentifizierungssystem neu schreiben“

**Das Original ist abschließbar**
- Die ursprüngliche Änderung kann als „erledigt“ markiert werden
- Neue Arbeit steht für sich, keine Verfeinerung
- „Dunkelmodus-MVP hinzufügen“ abschließen → Archivieren → Neue Änderung „Dunkelmodus verbessern“

### Die Heuristiken

```
                        ┌─────────────────────────────────────┐
                        │     Ist dies dieselbe Arbeit?       │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Gleiche Absicht?   >50% Überlappung?   Kann das Original
             Gleiches Problem?  Gleicher Umfang?    ohne diese Änderungen
                    │                  │          „erledigt“ sein?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         JA               NEIN JA          NEIN NEIN            JA
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
      AKTUALISIEREN      NEU AKTUALISIEREN NEU AKTUALISIEREN   NEU
```

| Test | Aktualisieren | Neue Änderung |
|------|---------------|---------------|
| **Identität** | „Dasselbe, verfeinert“ | „Andere Arbeit“ |
| **Umfangsüberlappung** | >50% überlappen sich | <50% überlappen sich |
| **Fertigstellung** | Kann ohne Änderungen nicht „erledigt“ sein | Kann das Original abschließen, neue Arbeit steht für sich |
| **Geschichte** | Aktualisierungskette erzählt eine kohärente Geschichte | Patches würden mehr verwirren als klären |

### Das Prinzip

> **Aktualisierung bewahrt Kontext. Neue Änderung schafft Klarheit.**
>
> Wählen Sie Aktualisierung, wenn die Geschichte Ihres Denkens wertvoll ist.
> Wählen Sie Neu, wenn ein frischer Anfang klarer wäre als ein Flicken.

Denken Sie daran wie an Git-Branches:
- Committen Sie weiter, während Sie an derselben Funktion arbeiten
- Starten Sie einen neuen Branch, wenn es wirklich neue Arbeit ist
- Manchmal mergen Sie eine teilweise Funktion und starten für Phase 2 neu

## Was ist anders?

| | Legacy (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Struktur** | Ein großes Vorschlagsdokument | Einzelne Artefakte mit Abhängigkeiten |
| **Workflow** | Lineare Phasen: Planen → Implementieren → Archivieren | Flexible Aktionen – jederzeit alles tun |
| **Iteration** | Rückwärtsgehen ist umständlich | Artefakte aktualisieren, wenn man Neues lernt |
| **Anpassung** | Feste Struktur | Schema-gesteuert (definieren Sie Ihre eigenen Artefakte) |

**Die zentrale Erkenntnis:** Arbeit verläuft nicht linear. OPSX hört auf, so zu tun, als ob sie es täte.

## Architektur im Detail

Dieser Abschnitt erklärt, wie OPSX unter der Haube funktioniert und wie es sich mit dem Legacy-Workflow vergleicht.
Beispiele in diesem Abschnitt verwenden den erweiterten Befehlssatz (`new`, `continue`, usw.); Standard-`core`-Benutzer können denselben Ablauf auf `propose → apply → sync → archive` abbilden.

### Philosophie: Phasen vs. Aktionen

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LEGACY WORKFLOW                                      │
│                    (Phasenfixiert, Alles-oder-Nichts)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   PLANUNGS-  │ ───► │  IMPLEMENTIE-│ ───► │  ARCHIVIE-   │             │
│   │    PHASE     │      │  RUNGS-PHASE │      │  RUNGS-PHASE │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Erstellt ALLE Artefakte auf einmal                                     │
│   • Kann während der Implementierung nicht zur Aktualisierung              │
│     von Spezifikationen zurückkehren                                       │
│   • Phasen-Tore erzwingen linearen Fortschritt                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                            OPSX WORKFLOW                                     │
│                      (Flüssige Aktionen, Iterativ)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           AKTIONEN (nicht Phasen)          │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              beliebige Reihenfolge         │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Erstellt Artefakte einzeln ODER schnell vorwärts                       │
│   • Aktualisiert Spezifikationen/Design/Aufgaben während                   │
│     der Implementierung                                                    │
│   • Abhängigkeiten ermöglichen Fortschritt, Phasen existieren nicht        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Komponentenarchitektur

**Legacy-Workflow** verwendet hartcodierte Vorlagen in TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      LEGACY WORKFLOW KOMPONENTEN                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Hartcodierte Vorlagen (TypeScript-Zeichenketten)                          │
│                    │                                                        │
│                    ▼                                                        │
│   Werkzeugspezifische Konfiguratoren/Adapter                               │
│                    │                                                        │
│                    ▼                                                        │
│   Generierte Befehlsdateien (.claude/commands/openspec/*.md)                │
│                                                                             │
│   • Feste Struktur, keine Artefakt-Erkennung                               │
│   • Änderung erfordert Code-Modifikation + Neuerstellung                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** verwendet externe Schemas und eine Abhängigkeitsgraph-Engine:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OPSX KOMPONENTEN                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Schema-Definitionen (YAML)                                                │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Abhängigkeiten                   │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Glob-Muster                     │   │
│   │      requires: [proposal]      ◄── Ermöglicht nach proposal        │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Artefakt-Graph-Engine                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Topologische Sortierung (Abhängigkeitsreihenfolge)               │   │
│   │  • Zustandserkennung (Dateisystemexistenz)                          │   │
│   │  • Umfangreiche Anweisungsgenerierung (Vorlagen + Kontext)          │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Skill-Dateien (.claude/skills/openspec-*/SKILL.md)                        │
│                                                                             │
│   • Editorübergreifend kompatibel (Claude Code, Cursor, Windsurf)           │
│   • Skills fragen CLI für strukturierte Daten ab                            │
│   • Vollständig anpassbar über Schema-Dateien                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Abhängigkeitsgraph-Modell

Artefakte bilden einen gerichteten azyklischen Graphen (DAG). Abhängigkeiten sind **Ermöglicher**, keine Tore:

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
                                  │
                                  ▼
                          ┌──────────────┐
                          │ APPLY PHASE  │
                          │ (requires:   │
                          │  tasks)      │
                          └──────────────┘
```

**Zustandsübergänge:**

```
   BLOCKIERT ────────────────► BEREIT ────────────────► FERTIG
      │                        │                       │
   Fehlende                 Alle Abhängig-          Datei existiert
   Abhängigkeiten           keiten sind FERTIG      im Dateisystem
```

### Informationsfluss

**Legacy-Workflow** — Agent erhält statische Anweisungen:

```
  Benutzer: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Statische Anweisungen:                 │
  │  • Erstelle proposal.md                 │
  │  • Erstelle tasks.md                    │
  │  • Erstelle design.md                   │
  │  • Erstelle specs/<capability>/spec.md  │
  │                                         │
  │  Keine Kenntnis, was existiert oder     │
  │  Abhängigkeiten zwischen Artefakten     │
  └─────────────────────────────────────────┘
           │
           ▼
  Agent erstellt ALLE Artefakte auf einmal
```

**OPSX** — Agent fragt nach umfangreichem Kontext:

```
  Benutzer: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Schritt 1: Aktuellen Zustand abfragen                                   │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec status --change "add-auth" --json                      │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "artifacts": [                                                  │  │
  │  │      {"id": "proposal", "status": "done"},                         │  │
  │  │      {"id": "specs", "status": "ready"},      ◄── Erster bereit    │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked", "missingDeps": ["specs"]}│  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Schritt 2: Umfangreiche Anweisungen für bereites Artefakt abrufen       │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  $ openspec instructions specs --change "add-auth" --json          │  │
│  │                                                                    │  │
│  │  {                                                                 │  │
│  │    "template": "# Specification\n\n## ADDED Requirements...",      │  │
│  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
│  │    "unlocks": ["tasks"]                                            │  │
│  │  }                                                                 │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Schritt 3: Abhängigkeiten lesen → EIN Artefakt erstellen → Zeigen, was │
│             freigeschaltet wird                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Iterationsmodell

**Legacy-Workflow** — umständliche Iteration:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Moment, das Design ist falsch"
       │               │
       │               ├── Optionen:
       │               │   • Dateien manuell bearbeiten (bricht Kontext)
       │               │   • Abbrechen und von vorne beginnen
       │               │   • Durchziehen und später korrigieren
       │               │
       │               └── Kein offizieller "Zurück"-Mechanismus
       │
       └── Erstellt ALLE Artefakte auf einmal
```

**OPSX** — natürliche Iteration:

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── "Das Design ist falsch"
      │                │                  │
      │                │                  ▼
      │                │            Einfach design.md bearbeiten
      │                │            und weitermachen!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply setzt dort fort,
      │                │         wo Sie aufgehört haben
      │                │
      │                └── Erstellt EIN Artefakt, zeigt, was freigeschaltet ist
      │
      └── Erstellt Gerüst für Änderung, wartet auf Anweisung
```

### Benutzerdefinierte Schemas

Erstellen Sie benutzerdefinierte Workflows mit den Schema-Verwaltungsbefehlen:

```bash
# Neues Schema von Grund auf erstellen (interaktiv)
openspec schema init my-workflow

# Oder ein vorhandenes Schema als Ausgangspunkt forken
openspec schema fork spec-driven my-workflow

# Schema-Struktur validieren
openspec schema validate my-workflow

# Sehen, woher ein Schema aufgelöst wird (nützlich für Debugging)
openspec schema which my-workflow
```

Schemas werden in `openspec/schemas/` (projektlokal, versionskontrolliert) oder `~/.local/share/openspec/schemas/` (benutzerglobal) gespeichert.

**Schema-Struktur:**
```
openspec/schemas/research-first/
├── schema.yaml
└── templates/
    ├── research.md
    ├── proposal.md
    └── tasks.md
```

**Beispiel schema.yaml:**
```yaml
name: research-first
artifacts:
  - id: research        # Vor proposal hinzugefügt
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Hängt jetzt von research ab

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**Abhängigkeitsgraph:**
```
   research ──► proposal ──► tasks
```

### Zusammenfassung

| Aspekt | Legacy | OPSX |
|--------|----------|------|
| **Vorlagen** | Hartcodiertes TypeScript | Externes YAML + Markdown |
| **Abhängigkeiten** | Keine (alle auf einmal) | DAG mit topologischer Sortierung |
| **Zustand** | Phasenbasiertes Denkmodell | Dateisystemexistenz |
| **Anpassung** | Quelle bearbeiten, neu erstellen | schema.yaml erstellen |
| **Iteration** | Phasenfixiert | Flüssig, alles bearbeitbar |
| **Editor-Unterstützung** | Werkzeugspezifische Konfiguratoren/Adapter | Einzelnes Skills-Verzeichnis |

## Schemas

Schemas definieren, welche Artefakte existieren und welche Abhängigkeiten sie haben. Derzeit verfügbar:

- **spec-driven** (Standard): Vorschlag → Spezifikationen → Design → Aufgaben

```bash
# Verfügbare Schemas auflisten
openspec schemas

# Alle Schemas mit ihren Auflösungsquellen anzeigen
openspec schema which --all

# Interaktiv ein neues Schema erstellen
openspec schema init my-workflow

# Ein vorhandenes Schema zum Anpassen forken
openspec schema fork spec-driven my-workflow

# Die Schemastruktur vor der Verwendung validieren
openspec schema validate my-workflow
```

## Tipps

- Verwende `/opsx:explore`, um eine Idee durchzudenken, bevor du eine Änderung vornimmst
- `/opsx:ff`, wenn du weißt, was du willst, `/opsx:continue`, wenn du am Erkunden bist
- Während `/opsx:apply`: Wenn etwas nicht stimmt — korrigiere das Artefakt und fahre dann fort
- Aufgaben verfolgen den Fortschritt über Kontrollkästchen in `tasks.md`
- Status jederzeit prüfen: `openspec status --change "name"`

## Feedback

Das hier ist unfertig. Das ist beabsichtigt — wir lernen, was funktioniert.

Einen Fehler gefunden? Ideen? Tritt uns auf [Discord](https://discord.gg/YctCnvvshC) bei oder erstelle ein Issue auf [GitHub](https://github.com/Fission-AI/openspec/issues).