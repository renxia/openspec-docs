# OPSX Workflow
> Feedback ist auf [Discord](https://discord.gg/YctCnvvshC) willkommen.
## Was ist das?
OPSX ist jetzt der Standard-Workflow für OpenSpec.
Es handelt sich um einen **flüssigen, iterativen Workflow** für OpenSpec-Änderungen. Keine starren Phasen mehr – nur Aktionen, die man jederzeit durchführen kann.

## Warum das existiert

Der Legacy-OpenSpec-Workflow funktioniert, ist aber **starr verriegelt**:

- **Anweisungen sind fest kodiert** – sie sind in TypeScript vergraben und können nicht geändert werden
- **Alles-oder-nichts** – ein einziger großer Befehl erstellt alles, einzelne Komponenten können nicht einzeln getestet werden
- **Feste Struktur** – derselbe Workflow für alle, keine Anpassungsmöglichkeit
- **Blackbox** – wenn die KI-Ausgabe schlecht ist, können die Prompts nicht angepasst werden

**OPSX öffnet das Ganze.** Jetzt kann jeder:

1. **Mit Anweisungen experimentieren** – eine Vorlage bearbeiten und prüfen, ob die KI bessere Ergebnisse liefert
2. **Granular testen** – die Anweisungen jedes einzelnen Artefakts unabhängig voneinander validieren
3. **Workflows anpassen** – eigene Artefakte und Abhängigkeiten definieren
4. **Schnell iterieren** – eine Vorlage ändern, sofort testen, kein Neubuild erforderlich

```
Legacy workflow:                      OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Hardcoded in package  │           │  schema.yaml           │◄── You edit this
│  (can't change)        │           │  templates/*.md        │◄── Or this
│        ↓               │           │        ↓               │
│  Wait for new release  │           │  Instant effect        │
│        ↓               │           │        ↓               │
│  Hope it's better      │           │  Test it yourself      │
└────────────────────────┘           └────────────────────────┘
```

**Das ist für alle gedacht:**
- **Teams** – Workflows erstellen, die zu ihrer tatsächlichen Arbeitsweise passen
- **Power-User** – Prompts anpassen, um bessere KI-Ausgaben für ihre Codebasis zu erhalten
- **OpenSpec-Mitwirkende** – mit neuen Ansätzen experimentieren, ohne Releases durchführen zu müssen

Wir alle lernen noch, was am besten funktioniert. OPSX ermöglicht es uns, gemeinsam zu lernen.

## Die Benutzererfahrung

**Das Problem mit linearen Workflows:**
Du bist "in der Planungsphase", dann "in der Implementierungsphase", dann "fertig". Aber die reale Arbeit funktioniert nicht so. Du implementierst etwas, stellst fest, dass dein Design falsch war, musst die Spezifikationen aktualisieren und weiter implementieren. Lineare Phasen widersprechen der Art und Weise, wie Arbeit tatsächlich abläuft.

**Der OPSX-Ansatz:**
- **Aktionen statt Phasen** – erstellen, implementieren, aktualisieren, archivieren – jede dieser Aktionen kann jederzeit durchgeführt werden
- **Abhängigkeiten sind Enabler** – sie zeigen, was möglich ist, nicht was als Nächstes erforderlich ist

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Einrichtung

```bash
# Stelle sicher, dass openspec installiert ist – Skills werden automatisch generiert
openspec init
```

Dadurch werden Skills in `.claude/skills/` (oder einem äquivalenten Pfad) erstellt, die von KI-Coding-Assistenten automatisch erkannt werden.

Standardmäßig verwendet OpenSpec das `core`-Workflow-Profil (`propose`, `explore`, `apply`, `sync`, `archive`). Wenn du die erweiterten Workflow-Befehle (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) verwenden möchtest, konfiguriere sie mit `openspec config profile` und wende die Änderungen mit `openspec update` an.

Während der Einrichtung wirst du aufgefordert, eine **Projektkonfiguration** (`openspec/config.yaml`) zu erstellen. Diese ist optional, aber empfehlenswert.

## Projektkonfiguration

Mit der Projektkonfiguration kannst du Standardwerte festlegen und projektspezifischen Kontext in alle Artefakte einfügen.

### Konfiguration erstellen

Die Konfiguration wird während `openspec init` erstellt, oder manuell:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech-Stack: TypeScript, React, Node.js
  API-Konventionen: RESTful, JSON-Antworten
  Tests: Vitest für Unit-Tests, Playwright für E2E-Tests
  Stil: ESLint mit Prettier, striktes TypeScript

rules:
  proposal:
    - Rollback-Plan hinzufügen
    - Betroffene Teams identifizieren
  specs:
    - Given/When/Then-Format für Szenarien verwenden
  design:
    - Sequenzdiagramme für komplexe Abläufe hinzufügen
```

### Konfigurationsfelder

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `schema` | Zeichenkette | Standard-Schema für neue Änderungen (z. B. `spec-driven`) |
| `context` | Zeichenkette | Projektkontext, der in alle Artefakt-Anweisungen eingefügt wird |
| `rules` | Objekt | Artefakt-spezifische Regeln, Schlüssel sind die Artefakt-IDs |

### Funktionsweise

**Schema-Priorität** (höchste zu niedrigster):
1. CLI-Flag (`--schema <Name>`)
2. Änderungs-Metadaten (`.openspec.yaml` im Änderungsverzeichnis)
3. Projektkonfiguration (`openspec/config.yaml`)
4. Standard (`spec-driven`)

**Kontext-Einfügung:**
- Der Kontext wird jeder Artefakt-Anweisung vorangestellt
- Er wird in `<context>...</context>`-Tags eingeschlossen
- Hilft der KI, die Konventionen deines Projekts zu verstehen

**Regel-Einfügung:**
- Regeln werden nur für passende Artefakte eingefügt
- Sie werden in `<rules>...</rules>`-Tags eingeschlossen
- Sie erscheinen nach dem Kontext, vor der Vorlage

### Artefakt-IDs nach Schema

**spec-driven** (Standard):
- `proposal` – Änderungsvorschlag
- `specs` – Spezifikationen
- `design` – Technisches Design
- `tasks` – Implementierungsaufgaben

### Konfigurationsvalidierung

- Unbekannte Artefakt-IDs in `rules` erzeugen Warnungen
- Schema-Namen werden gegen verfügbare Schemas validiert
- Der Kontext hat eine Größenbeschränkung von 50 KB
- Ungültiges YAML wird mit Zeilennummern gemeldet

### Fehlerbehebung

**"Unbekannte Artefakt-ID in Regeln: X"**
- Prüfe, ob die Artefakt-IDs zu deinem Schema passen (siehe Liste oben)
- Führe `openspec schemas --json` aus, um die Artefakt-IDs für jedes Schema anzuzeigen

**Konfiguration wird nicht angewendet:**
- Stelle sicher, dass die Datei unter `openspec/config.yaml` (nicht `.yml`) gespeichert ist
- Prüfe die YAML-Syntax mit einem Validator
- Konfigurationsänderungen treten sofort in Kraft (kein Neustart erforderlich)

**Kontext zu groß:**
- Der Kontext ist auf 50 KB begrenzt
- Fasse ihn stattdessen zusammen oder verlinke auf externe Dokumentation

## Befehle

| Befehl | Funktion |
|--------|----------|
| `/opsx:propose` | Erstellt eine Änderung und generiert Planungsartefakte in einem Schritt (Standard-Schnellpfad) |
| `/opsx:explore` | Durchdenkt Ideen, untersucht Probleme, klärt Anforderungen |
| `/opsx:new` | Erstellt ein neues Änderungsgerüst (erweiterter Workflow) |
| `/opsx:continue` | Erstellt das nächste Artefakt (erweiterter Workflow) |
| `/opsx:ff` | Fast-Forward von Planungsartefakten (erweiterter Workflow) |
| `/opsx:apply` | Implementiert Aufgaben und aktualisiert Artefakte bei Bedarf |
| `/opsx:update` | Überarbeitet die Planungsartefakte einer Änderung und hält sie konsistent |
| `/opsx:verify` | Validiert die Implementierung anhand der Artefakte (erweiterter Workflow) |
| `/opsx:sync` | Synchronisiert Delta-Spezifikationen mit dem Hauptzweig (Standard-Workflow, optional) |
| `/opsx:archive` | Archiviert die Änderung, wenn sie abgeschlossen ist |
| `/opsx:bulk-archive` | Archiviert mehrere abgeschlossene Änderungen (erweiterter Workflow) |
| `/opsx:onboard` | Geführter Durchlauf einer durchgängigen Änderung (erweiterter Workflow) |

## Verwendung

### Eine Idee durchdenken
```
/opsx:explore
```
Durchdenke Ideen, untersuche Probleme, vergleiche Optionen. Keine Struktur erforderlich – einfach ein Denkpartner. Wenn sich Erkenntnisse herauskristallisieren, wechsle zu `/opsx:propose` (Standard) oder `/opsx:new`/`/opsx:ff` (erweitert).

### Eine neue Änderung starten
```
/opsx:propose
```
Erstellt die Änderung und generiert die vor der Implementierung benötigten Planungsartefakte.

Wenn du erweiterte Workflows aktiviert hast, kannst du stattdessen folgende Befehle verwenden:

```text
/opsx:new        # Nur Gerüst erstellen
/opsx:continue   # Ein Artefakt nach dem anderen erstellen
/opsx:ff         # Alle Planungsartefakte auf einmal erstellen
```

### Artefakte erstellen
```
/opsx:continue
```
Zeigt an, was basierend auf Abhängigkeiten bereit zur Erstellung ist, und erstellt dann ein Artefakt. Verwende den Befehl wiederholt, um deine Änderung schrittweise aufzubauen.

```
/opsx:ff add-dark-mode
```
Erstellt alle Planungsartefakte auf einmal. Verwende ihn, wenn du ein klares Bild davon hast, was du baust.

### Implementieren (der flüssige Teil)
```
/opsx:apply
```
Bearbeitet Aufgaben und hakt sie währenddessen ab. Wenn du mehrere Änderungen gleichzeitig bearbeitest, kannst du `/opsx:apply <Name>` ausführen; andernfalls wird er aus dem Gesprächsverlauf abgeleitet und fragt dich zur Auswahl, falls er es nicht erkennen kann.

### Eine Änderung aktualisieren
```
/opsx:update add-dark-mode - we're storing the theme in a cookie now
```
Überarbeitet die vorhandenen Planungsartefakte der Änderung und hält sie konsistent – in jede Richtung (eine Design-Änderung kann sich bis zum Vorschlag fortsetzen). Nur Planungsartefakte: Er bearbeitet niemals Code und erstellt niemals fehlende Artefakte (das ist die Aufgabe von `/opsx:continue`). Jede Bearbeitung wird zuerst mit dir bestätigt. Wenn die Änderung bereits implementiert wurde, empfiehlt er `/opsx:apply`, damit der Code mit dem überarbeiteten Plan Schritt hält. Wenn deine Überarbeitung die *Absicht* der Änderung verändert, fange stattdessen neu an – siehe [When to Update vs. Start Fresh](#when-to-update-vs-start-fresh).

### Abschließen
```
/opsx:archive   # Bei Abschluss ins Archiv verschieben (fragt bei Bedarf nach Synchronisierung der Spezifikationen)
```

## Wann aktualisieren vs. neu anfangen {#when-to-update-vs-start-fresh}

Du kannst deinen Vorschlag oder deine Spezifikationen jederzeit vor der Implementierung bearbeiten. Aber wann wird aus Verfeinerung "das ist eine andere Arbeit"?

### Was ein Vorschlag abdeckt

Ein Vorschlag definiert drei Dinge:
1. **Absicht** – Welches Problem löst du?
2. **Umfang** – Was gehört dazu, was nicht?
3. **Vorgehen** – Wie wirst du es lösen?

Die Frage ist: Was hat sich geändert, und in welchem Ausmaß?

### Die vorhandene Änderung aktualisieren, wenn:

**Gleiche Absicht, verfeinerte Ausführung**
- Du entdeckst Randfälle, die du nicht bedacht hast
- Das Vorgehen muss angepasst werden, aber das Ziel bleibt gleich
- Die Implementierung zeigt, dass das Design leicht abweichend war

**Umfang verkleinert sich**
- Du stellst fest, dass der volle Umfang zu groß ist und zuerst das MVP ausliefern möchtest
- "Dark Mode hinzufügen" → "Dark-Mode-Umschalter hinzufügen (Systempräferenz in v2)"

**Lerngetriebene Korrekturen**
- Die Codebasis ist nicht so strukturiert, wie du dachtest
- Eine Abhängigkeit funktioniert nicht wie erwartet
- "CSS-Variablen verwenden" → "Stattdessen das `dark:`-Präfix von Tailwind verwenden"

### Eine neue Änderung starten, wenn:

**Absicht hat sich grundlegend geändert**
- Das Problem selbst ist jetzt ein anderes
- "Dark Mode hinzufügen" → "Umfassendes Theme-System mit benutzerdefinierten Farben, Schriftarten und Abständen hinzufügen"

**Umfang ist explodiert**
- Die Änderung ist so stark angewachsen, dass es im Wesentlichen eine andere Arbeit ist
- Der ursprüngliche Vorschlag wäre nach Aktualisierungen nicht mehr wiederzuerkennen
- "Login-Fehler beheben" → "Auth-System neu schreiben"

**Ursprüngliche Änderung ist abschließbar**
- Die ursprüngliche Änderung kann als "erledigt" markiert werden
- Die neue Arbeit steht für sich, ist keine Verfeinerung
- "Dark-Mode-MVP abschließen" → Archivieren → Neue Änderung "Dark-Mode erweitern"

### Die Heuristiken

```
                        ┌─────────────────────────────────────┐
                        │     Is this the same work?          │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Same intent?      >50% overlap?      Can original
             Same problem?     Same scope?        be "done" without
                    │                  │          these changes?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         YES               NO YES           NO  NO              YES
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       UPDATE            NEW  UPDATE       NEW  UPDATE          NEW
```

| Test | Aktualisieren | Neue Änderung |
|------|---------------|---------------|
| **Identität** | "Dasselbe, verfeinert" | "Andere Arbeit" |
| **Umfangsüberlappung** | >50 % überlappen | <50 % überlappen |
| **Abschluss** | Kann ohne Änderungen nicht als "erledigt" markiert werden | Ursprüngliche Änderung kann abgeschlossen werden, neue Arbeit steht für sich |
| **Geschichte** | Die Aktualisierungskette erzählt eine kohärente Geschichte | Patches würden mehr verwirren als klären |

### Das Prinzip

> **Aktualisieren bewahrt Kontext. Eine neue Änderung sorgt für Klarheit.**
>
> Wähle Aktualisieren, wenn die Historie deiner Überlegungen wertvoll ist.
> Wähle eine neue Änderung, wenn ein Neuanfang klarer wäre als das Patchen.

Stell es dir wie Git-Zweige vor:
- Committe weiter, während du an demselben Feature arbeitest
- Erstelle einen neuen Zweig, wenn es wirklich neue Arbeit ist
- Manchmal mergest du ein teilweise abgeschlossenes Feature und fängst für Phase 2 neu an

## Was ist anders?

| | Legacy (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Struktur** | Ein einziges großes Vorschlagsdokument | Diskrete Artefakte mit Abhängigkeiten |
| **Workflow** | Lineare Phasen: planen → implementieren → archivieren | Flüssige Aktionen – jede Aktion kann jederzeit durchgeführt werden |
| **Iteration** | Umständlich, zurückzugehen | Artefakte aktualisieren, sobald du neue Erkenntnisse hast |
| **Anpassung** | Feste Struktur | Schema-basiert (definiere eigene Artefakte) |

**Die wichtigste Erkenntnis:** Arbeit ist nicht linear. OPSX hört auf, so zu tun, als wäre sie es.

## Architektur im Detail

Dieser Abschnitt erklärt, wie OPSX intern funktioniert und wie es sich mit dem Legacy-Workflow vergleicht. Beispiele in diesem Abschnitt verwenden den erweiterten Befehlssatz (`new`, `continue` usw.); Standardnutzer von `core` können denselben Ablauf auf `propose → apply → sync → archive` abbilden.

### Philosophie: Phasen vs. Aktionen

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LEGACY WORKFLOW                                      │
│                    (Phase-Locked, All-or-Nothing)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │             │
│   │    PHASE     │      │    PHASE     │      │    PHASE     │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Erstellt ALLE Artefakte auf einmal                                     │
│   • Keine Möglichkeit, Spezifikationen während der Implementierung          │
│     nachträglich zu aktualisieren                                           │
│   • Phasengates erzwingen einen linearen Ablauf                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            OPSX WORKFLOW                                     │
│                      (Fluid Actions, Iterative)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           AKIONEN (keine Phasen)           │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              beliebige Reihenfolge         │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Artefakte einzeln erstellen ODER vorspringen                           │
│   • Spezifikationen, Design und Aufgaben während der Implementierung        │
│     aktualisieren                                                           │
│   • Abhängigkeiten ermöglichen Fortschritt, Phasen existieren nicht         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Komponentenarchitektur

**Legacy-Workflow** verwendet fest codierte Vorlagen in TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      KOMPONENTEN DES LEGACY-WORKFLOWS                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Fest codierte Vorlagen (TypeScript-Zeichenketten)                         │
│                    │                                                        │
│                    ▼                                                        │
│   Toolspezifische Konfiguratoren/Adapter                                     │
│                    │                                                        │
│                    ▼                                                        │
│   Generierte Befehlsdateien (.claude/commands/openspec/*.md)                │
│                                                                             │
│   • Feste Struktur, keine Artefakt-Erkennung                                │
│   • Änderungen erfordern Code-Anpassung + Neubuild                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** verwendet externe Schemata und eine Abhängigkeitsgraphen-Engine:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KOMPONENTEN VON OPSX                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Schema-Definitionen (YAML)                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Abhängigkeiten                   │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Glob-Muster                      │   │
│   │      requires: [proposal]      ◄── Wird nach Vorschlag aktiviert    │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Artefakt-Graphen-Engine                                                    │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Topologische Sortierung (Reihenfolge nach Abhängigkeiten)        │   │
│   │  • Zustandserkennung (Vorhandensein im Dateisystem)                 │   │
│   │  • Generierung umfassender Anweisungen (Vorlagen + Kontext)         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Skill-Dateien (.claude/skills/openspec-*/SKILL.md)                         │
│                                                                             │
│   • Editorübergreifend kompatibel (Claude Code, Cursor, Windsurf)           │
│   • CLI zur Abfrage von Skills für strukturierte Daten                      │
│   • Vollständig anpassbar über Schema-Dateien                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Abhängigkeitsgraphen-Modell

Artefakte bilden einen gerichteten azyklischen Graphen (DAG). Abhängigkeiten sind **Enabler**, keine Gates:

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
                          │ ANWENDUNGSPHASE  │
                          │ (erfordert:   │
                          │  tasks)      │
                          └──────────────┘
```

**Zustandsübergänge:**

```
   BLOCKIERT ────────────────► BEREIT ────────────────► ABGESCHLOSSEN
      │                        │                       │
   Fehlende                  Alle Abhängigkeiten     Datei ist im
   Abhängigkeiten            sind abgeschlossen      Dateisystem vorhanden
```

### Informationsfluss

**Legacy-Workflow** – Der Agent erhält statische Anweisungen:

```
  Benutzer: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Statische Anweisungen:                 │
  │  • proposal.md erstellen                │
  │  • tasks.md erstellen                   │
  │  • design.md erstellen                  │
  │  • specs/<capability>/spec.md erstellen │
  │                                         │
  │  Keine Kenntnis darüber, welche         │
  │  Artefakte bereits existieren oder      │
  │  welche Abhängigkeiten zwischen ihnen   │
  │  bestehen                               │
  └─────────────────────────────────────────┘
           │
           ▼
  Der Agent erstellt ALLE Artefakte auf einmal
```

**OPSX** – Der Agent fragt umfassenden Kontext ab:

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
  │  │      {"id": "specs", "status": "ready"},      ◄── Erstes bereites   │  │
  │  │                                                                    │  │
  │  │      Artefakt                                                       │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked", "missingDeps": ["specs"]}│  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Schritt 2: Umfassende Anweisungen für das bereite Artefakt abrufen      │
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
  │  Schritt 3: Abhängigkeiten lesen → EIN Artefakt erstellen → Anzeigen,    │
  │  was freigeschaltet wird                                                 │
  └──────────────────────────────────────────────────────────────────────────┘
```

### Iterationsmodell

**Legacy-Workflow** – Umständlich zu iterieren:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Moment mal, das Design ist falsch"
       │               │
       │               ├── Optionen:
       │               │   • Dateien manuell bearbeiten (bricht den Kontext)
       │               │   • Verwerfen und neu anfangen
       │               │   • Durchdrücken und später beheben
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
      │                │            Bearbeiten Sie einfach design.md
      │                │            und fahren Sie fort!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply setzt dort fort,
      │                │         wo Sie aufgehört haben
      │                │
      │                └── Erstellt EIN Artefakt, zeigt, was freigeschaltet ist
      │
      └── Erstellt ein Gerüst für die Änderung, wartet auf Anweisungen
```

### Benutzerdefinierte Schemas

Erstellen Sie benutzerdefinierte Arbeitsabläufe mithilfe der Befehle zur Schema-Verwaltung:

```bash
# Erstellen Sie ein neues Schema von Grund auf (interaktiv)
openspec schema init my-workflow

# Oder forken Sie ein vorhandenes Schema als Ausgangspunkt
openspec schema fork spec-driven my-workflow

# Validieren Sie Ihre Schema-Struktur
openspec schema validate my-workflow

# Sehen Sie, wo ein Schema aufgelöst wird (nützlich zum Debuggen)
openspec schema which my-workflow
```

Schemas werden in `openspec/schemas/` (projekt-lokal, versionskontrolliert) oder `~/.local/share/openspec/schemas/` (benutzerweit) gespeichert.

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
  - id: research        # Wird vor dem Vorschlag hinzugefügt
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Hängt nun von research ab

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
| **Vorlagen** | Fest codiertes TypeScript | Externes YAML + Markdown |
| **Abhängigkeiten** | Keine (alle auf einmal) | DAG mit topologischer Sortierung |
| **Status** | Phasenbasiertes mentales Modell | Dateisystemexistenz |
| **Anpassung** | Quelldatei bearbeiten, neu bauen | schema.yaml erstellen |
| **Iteration** | Phasengesperrt | Flüssig, beliebige Bearbeitung |
| **Editor-Unterstützung** | Toolspezifische Konfiguratoren/Adapter | Einzelnes Skills-Verzeichnis |

## Schemas

Schemas definieren, welche Artefakte existieren und deren Abhängigkeiten. Derzeit verfügbar:

- **spec-driven** (Standard): proposal → specs → design → tasks

```bash
# Verfügbare Schemas auflisten
openspec schemas

# Alle Schemas mit ihren Auflösungsquellen anzeigen
openspec schema which --all

# Ein neues Schema interaktiv erstellen
openspec schema init my-workflow

# Ein vorhandenes Schema zur Anpassung forken
openspec schema fork spec-driven my-workflow

# Schema-Struktur vor der Verwendung validieren
openspec schema validate my-workflow
```

## Tipps

- Verwenden Sie `/opsx:explore`, um eine Idee durchzudenken, bevor Sie sich zu einer Änderung verpflichten
- Verwenden Sie `/opsx:ff`, wenn Sie wissen, was Sie wollen, `/opsx:continue`, wenn Sie noch erkunden
- Wenn während `/opsx:apply` etwas falsch ist: Beheben Sie das Artefakt und fahren Sie dann fort
- Aufgaben verfolgen den Fortschritt über Kontrollkästchen in `tasks.md`
- Prüfen Sie jederzeit den Status mit: `openspec status --change "name"`

## Feedback

Das ist noch unausgereift. Das ist beabsichtigt — wir lernen gerade, was funktioniert.

Einen Bug gefunden? Haben Sie Ideen? Treten Sie unserem [Discord](https://discord.gg/YctCnvvshC) bei oder eröffnen Sie ein Issue auf [GitHub](https://github.com/Fission-AI/openspec/issues).