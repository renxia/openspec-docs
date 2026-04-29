# OPSX-Workflow

> Feedback ist willkommen auf [Discord](https://discord.gg/YctCnvvshC).

## Was ist das?

OPSX ist nun der Standard-Workflow für OpenSpec.

Es ist ein **flüssiger, iterativer Workflow** für OpenSpec-Änderungen. Keine starren Phasen mehr – nur Aktionen, die Sie jederzeit ausführen können.

## Warum dies existiert

Der herkömmliche OpenSpec-Workflow funktioniert, ist aber **starr**:

- **Anweisungen sind fest verdrahtet** — vergraben in TypeScript, Sie können sie nicht ändern
- **Alles-oder-nichts** — ein großer Befehl erstellt alles, einzelne Teile können nicht getestet werden
- **Feste Struktur** — gleicher Workflow für alle, keine Anpassung
- **Black Box** — wenn die KI-Ausgabe schlecht ist, können Sie die Prompts nicht anpassen

**OPSX macht es offen.** Jetzt kann jeder:

1. **Mit Anweisungen experimentieren** — eine Vorlage bearbeiten, sehen, ob die KI besser arbeitet
2. **Granular testen** — die Anweisungen für jedes Artefakt unabhängig validieren
3. **Workflows anpassen** — eigene Artefakte und Abhängigkeiten definieren
4. **Schnell iterieren** — eine Vorlage ändern, sofort testen, kein Neubau

```
Herkömmlicher Workflow:              OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Fest verdrahtet im    │           │  schema.yaml           │◄── Sie bearbeiten dies
│  Paket (nicht änderbar)│           │  templates/*.md        │◄── oder dies
│        ↓               │           │        ↓               │
│  Warten auf neue       │           │  Sofortige Wirkung     │
│  Version               │           │        ↓               │
│        ↓               │           │  Selbst testen         │
│  Hoffen, dass es       │           │                        │
│  besser ist            │           │                        │
└────────────────────────┘           └────────────────────────┘
```

**Dies ist für alle:**
- **Teams** — erstellen Sie Workflows, die Ihrer tatsächlichen Arbeitsweise entsprechen
- **Fortgeschrittene Benutzer** — passen Sie Prompts an, um bessere KI-Ausgaben für Ihren Code zu erhalten
- **OpenSpec-Mitwirkende** — experimentieren Sie mit neuen Ansätzen ohne Releases

Wir lernen alle noch, was am besten funktioniert. OPSX lässt uns gemeinsam lernen.

## Die Benutzererfahrung

**Das Problem mit linearen Workflows:**
Sie sind „in der Planungsphase“, dann „in der Implementierungsphase“, dann „fertig“. Aber echte Arbeit funktioniert nicht so. Sie implementieren etwas, stellen fest, dass Ihr Design falsch war, müssen die Spezifikationen aktualisieren, setzen die Implementierung fort. Lineare Phasen kämpfen gegen die tatsächliche Arbeitsweise.

**OPSX-Ansatz:**
- **Aktionen, nicht Phasen** — erstellen, implementieren, aktualisieren, archivieren — jederzeit jede davon ausführen
- **Abhängigkeiten sind Ermöglicher** — sie zeigen, was möglich ist, nicht, was als Nächstes erforderlich ist

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Einrichtung

```bash
# Stellen Sie sicher, dass openspec installiert ist — Skills werden automatisch generiert
openspec init
```

Dies erstellt Skills in `.claude/skills/` (oder entsprechend), die KI-Coding-Assistenten automatisch erkennen.

Standardmäßig verwendet OpenSpec das `core`-Workflow-Profil (`propose`, `explore`, `apply`, `archive`). Wenn Sie die erweiterten Workflow-Befehle (`new`, `continue`, `ff`, `verify`, `sync`, `bulk-archive`, `onboard`) verwenden möchten, konfigurieren Sie diese mit `openspec config profile` und wenden Sie sie mit `openspec update` an.

Während der Einrichtung werden Sie aufgefordert, eine **Projektkonfiguration** (`openspec/config.yaml`) zu erstellen. Dies ist optional, aber empfohlen.

## Projektkonfiguration

Die Projektkonfiguration ermöglicht es Ihnen, Standardwerte festzulegen und projektspezifischen Kontext in alle Artefakte einzubetten.

### Konfiguration erstellen

Die Konfiguration wird während `openspec init` erstellt oder manuell:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech-Stack: TypeScript, React, Node.js
  API-Konventionen: RESTful, JSON-Antworten
  Testen: Vitest für Unit-Tests, Playwright für E2E
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
| `context` | string | Projektkontext, der in alle Artefakt-Anweisungen eingebettet wird |
| `rules` | object | Artefakt-spezifische Regeln, nach Artefakt-ID geschlüsselt |

### Wie es funktioniert

**Schema-Vorrang** (höchster bis niedrigster):
1. CLI-Flag (`--schema <name>`)
2. Änderungs-Metadaten (`.openspec.yaml` im Änderungsverzeichnis)
3. Projektkonfiguration (`openspec/config.yaml`)
4. Standard (`spec-driven`)

**Kontext-Einbettung:**
- Kontext wird den Anweisungen jedes Artefakts vorangestellt
- In `<context>...</context>`-Tags eingewickelt
- Hilft der KI, die Konventionen Ihres Projekts zu verstehen

**Regeln-Einbettung:**
- Regeln werden nur für passende Artefakte eingebettet
- In `<rules>...</rules>`-Tags eingewickelt
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
- Kontext hat eine Größenbegrenzung von 50KB
- Ungültiges YAML wird mit Zeilennummern gemeldet

### Fehlerbehebung

**"Unbekannte Artefakt-ID in rules: X"**
- Überprüfen Sie, ob die Artefakt-IDs mit Ihrem Schema übereinstimmen (siehe obige Liste)
- Führen Sie `openspec schemas --json` aus, um die Artefakt-IDs für jedes Schema anzuzeigen

**Konfiguration wird nicht angewendet:**
- Stellen Sie sicher, dass die Datei unter `openspec/config.yaml` liegt (nicht `.yml`)
- Überprüfen Sie die YAML-Syntax mit einem Validator
- Konfigurationsänderungen treten sofort in Kraft (kein Neustart erforderlich)

**Kontext zu groß:**
- Kontext ist auf 50KB begrenzt
- Fassen Sie zusammen oder verlinken Sie auf externe Dokumentation stattdessen

## Befehle

| Befehl | Was er tut |
|--------|------------|
| `/opsx:propose` | Erstellt eine Änderung und generiert Planungsartefakte in einem Schritt (Standard-Schnellweg) |
| `/opsx:explore` | Ideen durchdenken, Probleme untersuchen, Anforderungen klären |
| `/opsx:new` | Startet eine neue Änderungsschablone (erweiterter Workflow) |
| `/opsx:continue` | Erstellt das nächste Artefakt (erweiterter Workflow) |
| `/opsx:ff` | Blättert Planungsartefakte vor (erweiterter Workflow) |
| `/opsx:apply` | Implementiert Aufgaben und aktualisiert bei Bedarf Artefakte |
| `/opsx:verify` | Validiert die Implementierung gegen die Artefakte (erweiterter Workflow) |
| `/opsx:sync` | Synchronisiert Delta-Spezifikationen mit dem Hauptzweig (erweiterter Workflow, optional) |
| `/opsx:archive` | Archiviert bei Fertigstellung |
| `/opsx:bulk-archive` | Archiviert mehrere abgeschlossene Änderungen (erweiterter Workflow) |
| `/opsx:onboard` | Geführte Durchführung einer End-to-End-Änderung (erweiterter Workflow) |

## Verwendung

### Eine Idee erkunden
```
/opsx:explore
```
Ideen durchdenken, Probleme untersuchen, Optionen vergleichen. Keine Struktur erforderlich — nur ein Denkpartner. Wenn Erkenntnisse reifen, wechseln Sie zu `/opsx:propose` (Standard) oder `/opsx:new`/`/opsx:ff` (erweitert).

### Eine neue Änderung starten
```
/opsx:propose
```
Erstellt die Änderung und generiert die vor der Implementierung erforderlichen Planungsartefakte.

Wenn Sie erweiterte Workflows aktiviert haben, können Sie stattdessen verwenden:

```text
/opsx:new        # nur Schablone
/opsx:continue   # ein Artefakt nach dem anderen erstellen
/opsx:ff         # alle Planungsartefakte auf einmal erstellen
```

### Artefakte erstellen
```
/opsx:continue
```
Zeigt basierend auf Abhängigkeiten, was erstellt werden kann, und erstellt dann ein Artefakt. Verwenden Sie es wiederholt, um Ihre Änderung schrittweise aufzubauen.

```
/opsx:ff add-dark-mode
```
Erstellt alle Planungsartefakte auf einmal. Verwenden Sie es, wenn Sie ein klares Bild davon haben, was Sie bauen.

### Implementieren (der flüssige Teil)
```
/opsx:apply
```
Bearbeitet Aufgaben und streicht sie nach und nach durch. Wenn Sie mehrere Änderungen parallel bearbeiten, können Sie `/opsx:apply <name>` ausführen; andernfalls sollte es aus dem Gespräch ableiten und Sie zur Auswahl auffordern, wenn es nicht erkennen kann.

### Abschließen
```
/opsx:archive   # Bei Fertigstellung in das Archiv verschieben (fordert bei Bedarf zur Synchronisierung der Spezifikationen auf)
```

## Wann aktualisieren vs. neu beginnen

Sie können Ihren Vorschlag oder Ihre Spezifikationen vor der Implementierung immer bearbeiten. Aber wann wird Verfeinerung zu „dies ist eine andere Arbeit“?

### Was ein Vorschlag erfasst

Ein Vorschlag definiert drei Dinge:
1. **Absicht** — Welches Problem lösen Sie?
2. **Umfang** — Was ist ein-/ausgeschlossen?
3. **Vorgehensweise** — Wie werden Sie es lösen?

Die Frage lautet: Was hat sich geändert, und wie stark?

### Bestehende Änderung aktualisieren, wenn:

**Gleiche Absicht, verfeinerte Ausführung**
- Sie entdecken Grenzfälle, die Sie nicht bedacht haben
- Die Vorgehensweise muss angepasst werden, aber das Ziel bleibt gleich
- Die Implementierung zeigt, dass das Design leicht falsch war

**Umfang verengt sich**
- Sie stellen fest, dass der volle Umfang zu groß ist, möchten zuerst MVP ausliefern
- „Dark Mode hinzufügen“ → „Dark-Mode-Umschalter hinzufügen (Systempräferenz in v2)“

**Lerngetriebene Korrekturen**
- Die Codebasis ist nicht so strukturiert, wie Sie dachten
- Eine Abhängigkeit funktioniert nicht wie erwartet
- „CSS-Variablen verwenden“ → „Stattdessen den `dark:`-Präfix von Tailwind verwenden“

### Neue Änderung starten, wenn:

**Absicht hat sich grundlegend geändert**
- Das Problem selbst ist jetzt ein anderes
- „Dark Mode hinzufügen“ → „Umfassendes Themesystem mit benutzerdefinierten Farben, Schriftarten, Abständen hinzufügen“

**Umfang explodiert**
- Die Änderung ist so groß geworden, dass es im Wesentlichen andere Arbeit ist
- Der ursprüngliche Vorschlag wäre nach Aktualisierungen unkenntlich
- „Login-Bug beheben“ → „Auth-System neu schreiben“

**Original ist abschließbar**
- Die ursprüngliche Änderung kann als „erledigt“ markiert werden
- Neue Arbeit steht für sich, ist keine Verfeinerung
- „Dark-Mode-MVP hinzufügen“ abschließen → Archivieren → Neue Änderung „Dark Mode verbessern“

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
                    │                  │              „erledigt“ sein?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         JA                NEIN JA           NEIN NEIN           JA
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       AKTUALISIEREN     NEU  AKTUALISIEREN NEU AKTUALISIEREN   NEU
```

| Test | Aktualisieren | Neue Änderung |
|------|---------------|---------------|
| **Identität** | „Dasselbe, verfeinert“ | „Andere Arbeit“ |
| **Umfangsüberlappung** | >50% Überlappung | <50% Überlappung |
| **Abschluss** | Kann ohne Änderungen nicht „erledigt“ sein | Kann Original abschließen, neue Arbeit steht für sich |
| **Geschichte** | Aktualisierungskette erzählt kohärente Geschichte | Patches würden mehr verwirren als klären |

### Das Prinzip

> **Aktualisierung bewahrt Kontext. Neue Änderung bietet Klarheit.**
>
> Wählen Sie Aktualisierung, wenn die Geschichte Ihres Denkens wertvoll ist.
> Wählen Sie Neu, wenn ein Neustart klarer wäre als ein Patch.

Denken Sie es wie Git-Zweige:
- Weiterhin committen, während Sie an derselben Funktion arbeiten
- Einen neuen Zweig starten, wenn es sich um wirklich neue Arbeit handelt
- Manchmal eine Teilfunktion mergen und für Phase 2 neu beginnen

## Was ist anders?

| | Legacy (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Struktur** | Ein großes Vorschlagsdokument | Eigenständige Artefakte mit Abhängigkeiten |
| **Arbeitsablauf** | Lineare Phasen: planen → implementieren → archivieren | Fließende Aktionen — jederzeit alles möglich |
| **Iteration** | Rückwärts gehen ist umständlich | Artefakte aktualisieren, während man dazulernt |
| **Anpassbarkeit** | Feste Struktur | Schema-gesteuert (definiere deine eigenen Artefakte) |

**Die zentrale Erkenntnis:** Arbeit ist nicht linear. OPSX hört auf, so zu tun, als wäre sie das.

## Architektur im Detail

Dieser Abschnitt erklärt, wie OPSX unter der Haube funktioniert und wie es mit dem alten Workflow verglichen wird.
Die Beispiele in diesem Abschnitt verwenden den erweiterten Befehlssatz (`new`, `continue` etc.); Benutzer des Standard-`core`-Modells können denselben Ablauf als `propose → apply → archive` abbilden.

### Philosophie: Phasen vs. Aktionen

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LEGACY WORKFLOW                                      │
│                    (Phasenbasiert, Alles-oder-Nichts)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   PLANUNG    │ ───► │ IMPLEMENTIERUNG│ ───► │  ARCHIVIERUNG│             │
│   │    PHASE     │      │    PHASE     │      │    PHASE     │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Erstellt ALLE Artefakte auf einmal                                     │
│   • Kein Zurückkehren zum Aktualisieren von Specs während der Implementierung│
│   • Phasentore erzwingen linearen Fortschritt                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                            OPSX WORKFLOW                                     │
│                      (Fluide Aktionen, Iterativ)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           AKTIONEN (keine Phasen)          │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              in beliebiger Reihenfolge     │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Erstellt Artefakte einzeln ODER überspringt Schritte                   │
│   • Aktualisiert Specs/Design/Tasks während der Implementierung            │
│   • Abhängigkeiten ermöglichen Fortschritt, Phasen existieren nicht        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Komponentenarchitektur

Der **Legacy-Workflow** verwendet fest kodierte Vorlagen in TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      LEGACY WORKFLOW KOMPONENTEN                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Fest kodierte Vorlagen (TypeScript-Strings)                               │
│                    │                                                        │
│                    ▼                                                        │
│   Werkzeugspezifische Konfiguratoren/Adapter                                │
│                    │                                                        │
│                    ▼                                                        │
│   Generierte Befehlsdateien (.claude/commands/openspec/*.md)                │
│                                                                             │
│   • Feste Struktur, keine Artefakt-Bewusstheit                              │
│   • Änderung erfordert Code-Modifikation + Neubau                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** verwendet externe Schemas und eine Abhängigkeitsgraph-Engine:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OPSX KOMPONENTEN                                    │
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
│   │      generates: specs/**/*.md  ◄── Glob-Muster                      │   │
│   │      requires: [proposal]      ◄── Ermöglicht nach proposal         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Artefakt-Graph-Engine                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Topologische Sortierung (Abhängigkeitsreihenfolge)               │   │
│   │  • Zustandserkennung (Dateisystem-Existenz)                         │   │
│   │  • Reichhaltige Anweisungsgenerierung (Vorlagen + Kontext)          │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Skill-Dateien (.claude/skills/openspec-*/SKILL.md)                        │
│                                                                             │
│   • Redaktionsübergreifend kompatibel (Claude Code, Cursor, Windsurf)       │
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
              (erfordert:                  (erfordert:
               proposal)                   proposal)
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                               tasks
                           (erfordert:
                           specs, design)
                                  │
                                  ▼
                          ┌──────────────┐
                          │ APPLY PHASE  │
                          │ (erfordert:  │
                          │  tasks)      │
                          └──────────────┘
```

**Zustandsübergänge:**

```
   BLOCKIERT ────────────────► BEREIT ────────────────► ERLEDIGT
      │                        │                       │
   Fehlende                  Alle Abhängigkeiten     Datei existiert
   Abhängigkeiten            sind ERLEDIGT           im Dateisystem
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
  │  Kein Bewusstsein dafür, was existiert  │
  │  oder Abhängigkeiten zwischen Artefakten│
  └─────────────────────────────────────────┘
           │
           ▼
  Agent erstellt ALLE Artefakte auf einmal
```

**OPSX** — Agent fragt nach reichhaltigem Kontext ab:

```
  Benutzer: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Schritt 1: Aktuellen Zustand abfragen                                  │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec status --change "add-auth" --json                      │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "artifacts": [                                                  │  │
  │  │      {"id": "proposal", "status": "done"},                         │  │
  │  │      {"id": "specs", "status": "ready"},      ◄── Erstes bereites  │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked", "missingDeps": ["specs"]}│  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Schritt 2: Reichhaltige Anweisungen für bereites Artefakt abrufen      │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec instructions specs --change "add-auth" --json          │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "template": "# Spezifikation\n\n## HINZUGEFÜGTE Anforderungen...",│  │
  │  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
  │  │    "unlocks": ["tasks"]                                            │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Schritt 3: Abhängigkeiten lesen → EIN Artefakt erstellen →             │
  │             Anzeigen, was freigeschaltet wurde                           │
  └──────────────────────────────────────────────────────────────────────────┘
```

### Iterationsmodell

**Legacy-Workflow** — Umständlich zu iterieren:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Moment, das Design ist falsch"
       │               │
       │               ├── Optionen:
       │               │   • Dateien manuell bearbeiten (bricht Kontext)
       │               │   • Aufgeben und von vorne beginnen
       │               │   • Durchziehen und später beheben
       │               │
       │               └── Kein offizieller "Zurück"-Mechanismus
       │
       └── Erstellt ALLE Artefakte auf einmal
```

**OPSX** — Natürliche Iteration:

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
      │                │         wo du aufgehört hast
      │                │
      │                └── Erstellt EIN Artefakt, zeigt, was freigeschaltet wurde
      │
      └── Baut Änderung auf, wartet auf Anweisungen
```

### Benutzerdefinierte Schemas

Erstellen Sie benutzerdefinierte Workflows mit den Schema-Verwaltungsbefehlen:

```bash
# Ein neues Schema von Grund auf erstellen (interaktiv)
openspec schema init my-workflow

# Oder ein bestehendes Schema als Ausgangspunkt forken
openspec schema fork spec-driven my-workflow

# Die Schemastruktur validieren
openspec schema validate my-workflow

# Prüfen, wo ein Schema aufgelöst wird (nützlich zum Debuggen)
openspec schema which my-workflow
```

Schemas werden in `openspec/schemas/` (projektlokal, versioniert) oder `~/.local/share/openspec/schemas/` (benutzerweit) gespeichert.

**Schemastruktur:**
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
| **Vorlagen** | Fest kodierte TypeScript | Externes YAML + Markdown |
| **Abhängigkeiten** | Keine (alles auf einmal) | DAG mit topologischer Sortierung |
| **Zustand** | Phasenbasiertes Mentales Modell | Dateisystem-Existenz |
| **Anpassbarkeit** | Quellcode bearbeiten, neu bauen | schema.yaml erstellen |
| **Iteration** | Phasenbasiert | Fluid, alles bearbeitbar |
| **Editor-Unterstützung** | Werkzeugspezifische Konfiguratoren/Adapter | Einzelnes Skills-Verzeichnis |

## Schemas

Schemas definieren, welche Artefakte existieren und deren Abhängigkeiten. Derzeit verfügbar:

- **spec-driven** (Standard): Vorschlag → Spezifikationen → Design → Aufgaben

```bash
# Verfügbare Schemas auflisten
openspec schemas

# Alle Schemas mit ihren Auflösungsquellen anzeigen
openspec schema which --all

# Ein neues Schema interaktiv erstellen
openspec schema init my-workflow

# Ein bestehendes Schema zur Anpassung abzweigen
openspec schema fork spec-driven my-workflow

# Schemastruktur vor der Verwendung validieren
openspec schema validate my-workflow
```

## Tipps

- Verwenden Sie `/opsx:explore`, um eine Idee zu durchdenken, bevor Sie eine Änderung vornehmen
- `/opsx:ff`, wenn Sie wissen, was Sie wollen, `/opsx:continue` beim Erkunden
- Wenn während `/opsx:apply` etwas nicht stimmt — korrigieren Sie das Artefakt und fahren Sie dann fort
- Aufgaben verfolgen den Fortschritt über Kontrollkästchen in `tasks.md`
- Überprüfen Sie jederzeit den Status: `openspec status --change "name"`

## Feedback

Dies ist noch roh. Das ist beabsichtigt — wir lernen, was funktioniert.

Haben Sie einen Fehler gefunden? Haben Sie Ideen? Treten Sie uns bei [Discord](https://discord.gg/YctCnvvshC) bei oder eröffnen Sie ein Issue auf [GitHub](https://github.com/Fission-AI/openspec/issues).