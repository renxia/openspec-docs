# Befehle

Dies ist die Referenz für die Slash-Befehle von OpenSpec. Diese Befehle werden in der Chat-Oberfläche Ihres KI-Coding-Assistenten aufgerufen (z. B. Claude Code, Cursor, Windsurf).

Für Workflow-Muster und die Verwendung jedes Befehls siehe [Workflows](workflows.md). Für CLI-Befehle siehe [CLI](cli.md).

## Kurzübersicht

### Standard-Kurzpfad (`core` Profil)

| Command | Purpose |
|---------|---------|
| `/opsx:propose` | Erstellen einer Änderung und Generieren von Planungsartefakten in einem Schritt |
| `/opsx:explore` | Ideen durchdenken, bevor eine Änderung festgelegt wird |
| `/opsx:apply` | Implementieren der Aufgaben aus der Änderung |
| `/opsx:sync` | Zusammenführen von Delta-Spezifikationen in die Hauptspezifikationen |
| `/opsx:archive` | Archivieren einer abgeschlossenen Änderung |

### Erweiterte Workflow-Befehle (benutzerdefinierte Workflow-Auswahl)

| Command | Purpose |
|---------|---------|
| `/opsx:new` | Starten eines neuen Änderungsgerüsts |
| `/opsx:continue` | Erstellen des nächsten Artefakts basierend auf Abhängigkeiten |
| `/opsx:ff` | Schnellvorwärtslauf (Fast-Forward): Alle Planungsartefakte auf einmal erstellen |
| `/opsx:verify` | Validieren, dass die Implementierung mit den Artefakten übereinstimmt |
| `/opsx:bulk-archive` | Mehrere Änderungen gleichzeitig archivieren |
| `/opsx:onboard` | Geführte Anleitung durch den kompletten Workflow |

Das standardmäßige globale Profil ist `core`. Um die erweiterten Workflow-Befehle zu aktivieren, führen Sie `openspec config profile` aus, wählen Sie die Workflows aus und führen Sie anschließend `openspec update` in Ihrem Projekt aus.

## Befehlsreferenz

### `/opsx:propose`

Erstellt eine neue Änderung und generiert Planungsartefakte in einem Schritt. Dies ist der Standardstartbefehl im `core`-Profil.

**Syntax:**
```text
/opsx:propose [change-name-or-description]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `change-name-or-description` | Nein | Name im Kebab-Case oder eine Beschreibung der Änderung in normaler Sprache |

**Was es tut:**
- Erstellt `openspec/changes/<change-name>/`
- Generiert Artefakte, die vor der Implementierung benötigt werden (für `spec-driven`: Vorschlag, Spezifikationen, Design, Aufgaben)
- Stoppt, wenn die Änderung bereit für `/opsx:apply` ist

**Beispiel:**
```text
You: /opsx:propose add-dark-mode

AI:  Erstellt openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Bereit zur Implementierung. Führen Sie /opsx:apply aus.
```

**Tipps:**
- Verwenden Sie dies für den schnellsten End-to-End-Pfad
- Wenn Sie eine schrittweise Kontrolle über die Artefakte wünschen, aktivieren Sie erweiterte Workflows und verwenden Sie `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **Starten Sie hier, wenn Sie sich unsicher sind.** Explore ist ein Denkpartner ohne Risiko: Er liest Ihre Codebasis, vergleicht Optionen und prägt eine vage Idee zu einem konkreten Plan, bevor irgendeine Änderung existiert. Es ist im Standardprofil enthalten. Für den vollständigen Fall und weitere Beispiele siehe die [Explore First](explore.md) Anleitung.

Denken Sie über Ideen nach, untersuchen Sie Probleme und klären Sie Anforderungen, bevor Sie sich auf eine Änderung festlegen.

**Syntax:**
```
/opsx:explore [topic]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `topic` | Nein | Was Sie erkunden oder untersuchen möchten |

**Was es tut:**
- Leitet ein exploratives Gespräch ohne festes Gerüst ein
- Untersucht die Codebasis, um Fragen zu beantworten
- Vergleicht Optionen und Ansätze
- Erstellt visuelle Diagramme zur Klärung des Denkens
- Kann zu `/opsx:propose` (standardmäßig) oder `/opsx:new` (erweiterter Workflow) wechseln, wenn Erkenntnisse sich festigen

**Beispiel:**
```text
You: /opsx:explore

AI:  Was möchten Sie erkunden?

You: Wie sollten wir die Authentifizierung für die mobile App handhaben?

AI:  Lassen Sie mich Ihr aktuelles Auth-Setup untersuchen...
     [Analysiert Codebasis]

     Ich sehe, dass Sie session-based auth für die Web-App verwenden.
     Für Mobil haben wir drei Hauptoptionen:

     1. JWT tokens (stateless, funktioniert offline)
     2. OAuth2 (wenn Sie Login von Drittanbietern benötigen)
     3. Aktuelle Sessions erweitern (einfacher, erfordert aber Konnektivität)

     Ihre API hat bereits CORS konfiguriert. Welche Richtung interessiert Sie?

You: Lassen wir JWT verwenden. Können wir dafür eine Änderung starten?

AI:  Bereit, wenn Sie es sind. Führen Sie /opsx:propose add-jwt-auth aus, um zu beginnen.
```

**Tipps:**
- Verwenden Sie dies, wenn die Anforderungen unklar sind oder Sie etwas untersuchen müssen
- Es werden keine Artefakte während der Erkundung erstellt
- Gut zum Vergleichen mehrerer Ansätze, bevor man sich entscheidet
- Kann Dateien lesen und die Codebasis durchsuchen

---

### `/opsx:new`

Startet einen neuen Änderungs-Scaffold. Erstellt den Änderungsordner und wartet darauf, dass Sie die Artefakte mit `/opsx:continue` oder `/opsx:ff` generieren.

Dieser Befehl ist Teil des erweiterten Workflow-Sets (nicht enthalten im Standardprofil `core`).

**Syntax:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `change-name` | Nein | Name für den Änderungsordner (wird abgefragt, wenn er nicht angegeben wird) |
| `--schema` | Nein | Workflow-Schema zur Verwendung (Standard: aus der Konfiguration oder `spec-driven`) |

**Was es tut:**
- Erstellt das Verzeichnis `openspec/changes/<change-name>/`
- Erstellt die Metadaten-Datei `.openspec.yaml` im Änderungsordner
- Zeigt die erste Artefaktvorlage zur Erstellung an
- Fragt nach dem Änderungsnamen und Schema, falls diese nicht angegeben sind

**Was es erstellt:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Änderungsmetadaten (Schema, Erstellungsdatum)
```

**Beispiel:**
```
You: /opsx:new add-dark-mode

AI:  Erstellt openspec/changes/add-dark-mode/
     Schema: spec-driven

     Bereit zur Erstellung: proposal
     Verwenden Sie /opsx:continue, um es zu erstellen, oder /opsx:ff, um alle Artefakte zu erstellen.
```

**Tipps:**
- Verwenden Sie beschreibende Namen: `add-feature`, `fix-bug`, `refactor-module`
- Vermeiden Sie generische Namen wie `update`, `changes`, `wip`
- Das Schema kann auch in der Projektkonfiguration (`openspec/config.yaml`) festgelegt werden

---

### `/opsx:continue`

Erstellt das nächste Artefakt in der Abhängigkeitskette. Erstellt Artefakte einzeln für inkrementellen Fortschritt.

**Syntax:**
```
/opsx:continue [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `change-name` | Nein | Welche Änderung fortgesetzt werden soll (wird aus dem Kontext abgeleitet, wenn sie nicht angegeben wird) |

**Was es tut:**
- Fragt den Artefakt-Abhängigkeitsgraphen ab
- Zeigt an, welche Artefakte bereit und welche blockiert sind
- Erstellt das erste verfügbare Artefakt
- Liest Abhängigkeitsdateien für Kontext
- Zeigt, was nach der Erstellung verfügbar wird

**Beispiel:**
```
You: /opsx:continue

AI:  Änderung: add-dark-mode

     Artefaktstatus:
     ✓ proposal    (erledigt)
     ◆ specs       (bereit)
     ◆ design      (bereit)
     ○ tasks       (blockiert - benötigt: specs)

     Erstelle specs...

     [Liest proposal.md, erstellt specs basierend auf den Anforderungen]

     ✓ Erstellt openspec/changes/add-dark-mode/specs/ui/spec.md

     Jetzt verfügbar: tasks
     Führen Sie /opsx:continue aus, um das nächste Artefakt zu erstellen.
```

**Tipps:**
- Verwenden Sie dies, wenn Sie jedes Artefakt überprüfen möchten, bevor Sie fortfahren
- Gut für komplexe Änderungen, bei denen Sie Kontrolle wünschen
- Mehrere Artefakte können gleichzeitig bereit werden
- Sie können die erstellten Artefakte bearbeiten, bevor Sie fortfahren

---

### `/opsx:ff`

Fast-Forward durch die Artefakt-Erstellung. Erstellt alle Planungsartefakte auf einmal.

**Syntax:**
```
/opsx:ff [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `change-name` | Nein | Welche Änderung fast-forwarded werden soll (wird aus dem Kontext abgeleitet, wenn sie nicht angegeben wird) |

**Was es tut:**
- Erstellt alle Artefakte in Abhängigkeitsreihenfolge
- Verfolgt den Fortschritt über eine To-Do-Liste
- Stoppt, wenn alle `apply-required` Artefakte abgeschlossen sind
- Liest jede Abhängigkeit, bevor das nächste Artefakt erstellt wird

**Beispiel:**
```
You: /opsx:ff add-dark-mode

AI:  Fast-Forwarding add-dark-mode...

     ✓ Erstellt proposal.md
     ✓ Erstellt specs/ui/spec.md
     ✓ Erstellt design.md
     ✓ Erstellt tasks.md

     Alle Planungsartefakte abgeschlossen!
     Bereit zur Implementierung. Führen Sie /opsx:apply aus, um zu beginnen.
```

**Tipps:**
- Verwenden Sie dies, wenn Sie ein klares Bild davon haben, was Sie bauen
- Schneller als `/opsx:continue` für unkomplizierte Änderungen
- Sie können die Artefakte auch danach noch bearbeiten
- Gut für kleine bis mittlere Features

---

### `/opsx:apply`

Implementiert Aufgaben aus der Änderung. Geht durch die Aufgabenliste, schreibt Code und setzt Punkte ab.

**Syntax:**
```
/opsx:apply [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `change-name` | Nein | Welche Änderung implementiert werden soll (wird aus dem Kontext abgeleitet, wenn sie nicht angegeben wird) |

**Was es tut:**
- Liest `tasks.md` und identifiziert unvollständige Aufgaben
- Geht die Aufgaben nacheinander durch
- Schreibt Code, erstellt Dateien, führt Tests durch, wie nötig
- Markiert Aufgaben als erledigt mit Checkboxen `[x]`

**Beispiel:**
```
You: /opsx:apply

AI:  Implementiere add-dark-mode...

     Lese tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Arbeite an 1.1: Create ThemeContext...
     [Erstellt src/context/ThemeContext.tsx]

     ✓ 1.1 Erledigt

     Arbeite an 1.2: Add CSS custom properties...
     [Aktualisiert src/styles/globals.css]

     ✓ 1.2 Erledigt
     ...
```

**Tipps:**
- Kann fortfahren, wo Sie aufgehört haben, falls unterbrochen wurde
- Verwenden Sie es für parallele Änderungen, indem Sie den Änderungsnamen angeben
- Der Abschlussstatus wird in den Checkboxen von `tasks.md` verfolgt

---

### `/opsx:verify`

Validiert, dass die Implementierung mit Ihren Änderungsartefakten übereinstimmt. Prüft Vollständigkeit, Korrektheit und Kohärenz.

**Syntax:**
```
/opsx:verify [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `change-name` | Nein | Welche Änderung zu überprüfen ist (wird aus dem Kontext abgeleitet, wenn sie nicht angegeben wird) |

**Was es tut:**
- Prüft drei Dimensionen der Implementierungsqualität
- Durchsucht die Codebasis nach Implementierungsbeweisen
- Meldet Probleme, kategorisiert als CRITICAL, WARNING oder SUGGESTION
- Blockiert das Archivieren nicht, zeigt aber Probleme an

**Verifizierungsdimensionen:**

| Dimension | Was es validiert |
|-----------|-------------------|
| **Vollständigkeit** | Alle Aufgaben erledigt, alle Anforderungen implementiert, Szenarien abgedeckt |
| **Korrektheit** | Implementierung entspricht der Spezifikationsabsicht, Randfälle behandelt |
| **Kohärenz** | Designentscheidungen spiegeln sich im Code wider, Muster sind konsistent |

**Beispiel:**
```
You: /opsx:verify

AI:  Überprüfe add-dark-mode...

     VOLLSTÄNDIGKEIT
     ✓ Alle 8 Aufgaben in tasks.md sind erledigt
     ✓ Alle Anforderungen in den Specs haben entsprechenden Code
     ⚠ Das Szenario "Systempräferenzerkennung" hat keine Testabdeckung

     KORREKTHEIT
     ✓ Implementierung entspricht der Spezifikationsabsicht
     ✓ Randfälle aus den Szenarien werden behandelt
     ✓ Fehlerzustände entsprechen den Spezifikationsdefinitionen

     KOHÄRENZ
     ✓ Designentscheidungen spiegeln sich in der Code-Struktur wider
     ✓ Namenskonventionen sind konsistent mit design.md
     ⚠ Das Design erwähnt "CSS variables", aber die Implementierung verwendet Tailwind-Klassen

     ZUSAMMENFASSUNG
     ─────────────────────────────
     Kritische Probleme: 0
     Warnungen: 2
     Bereit zum Archivieren: Ja (mit Warnungen)

     Empfehlungen:
     1. Füge einen Test für die Systempräferenzerkennung hinzu
     2. Aktualisiere design.md, um die Tailwind-Nutzung widerzuspiegeln, oder refaktorisiere zur Verwendung von CSS variables
```

**Tipps:**
- Führen Sie dies vor dem Archivieren aus, um Abweichungen frühzeitig zu erkennen
- Warnungen blockieren das Archivieren nicht, weisen aber auf potenzielle Probleme hin
- Gut zum Überprüfen der Arbeit der KI, bevor Sie sich festlegen
- Kann Abdrift zwischen Artefakten und Implementierung aufdecken

---

### `/opsx:sync`

**Optionaler Befehl.** Mergt Delta-Spezifikationen aus einer Änderung in die Hauptspezifikationen. Das Archivieren wird bei Bedarf zur Synchronisierung auffordern, daher müssen Sie dies normalerweise nicht manuell ausführen.

**Syntax:**
```
/opsx:sync [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `change-name` | Nein | Welche Änderung synchronisiert werden soll (wird aus dem Kontext abgeleitet, wenn sie nicht angegeben wird) |

**Was es tut:**
- Liest Delta-Spezifikationen aus dem Änderungsordner
- Parsed ADDED/MODIFIED/REMOVED/RENAMED Abschnitte
- Mergt Änderungen in das Hauptverzeichnis `openspec/specs/`
- Erhält den vorhandenen Inhalt, der nicht im Delta erwähnt wird
- Archiviert die Änderung nicht (sie bleibt aktiv)

**Beispiel:**
```text
You: /opsx:sync

AI:  Synchronisiere add-dark-mode delta specs...

     Lese: openspec/changes/add-dark-mode/specs/ui/spec.md
     Ziel:  openspec/specs/ui/spec.md

     Änderungen zum Anwenden:
     ✓ ADDED: Theme Selection requirement (2 Szenarien)
     ✓ ADDED: Accessibility requirement (1 Szenario)

     Mergen...
     ✓ openspec/specs/ui/spec.md aktualisiert

     Die Änderung bleibt aktiv. Führen Sie /opsx:archive aus, wenn sie abgeschlossen ist.
```

**Wann manuell verwenden:**

| Szenario | Sync verwenden? |
|----------|-----------|
| Langlaufende Änderung, möchte Spezifikationen vor dem Archivieren in der Hauptversion haben | Ja |
| Mehrere parallele Änderungen benötigen die aktualisierten Basis-Spezifikationen | Ja |
| Möchte das Mergen separat Vorschauen/überprüfen | Ja |
| Kurze Änderung, geht direkt zum Archivieren | Nein (das Archivieren kümmert sich darum) |

**Tipps:**
- Sync ist intelligent, kein Copy-Paste
- Kann Szenarien zu bestehenden Anforderungen hinzufügen, ohne sie zu duplizieren
- Die Änderung bleibt nach dem Sync aktiv (nicht archiviert)
- Die meisten Benutzer werden diesen Befehl nie direkt benötigen – das Archivieren fordert bei Bedarf zur Synchronisierung auf

---

### `/opsx:archive`

Archiviert eine abgeschlossene Änderung. Finalisiert die Änderung und verschiebt sie in den Archivordner.

**Syntax:**
```
/opsx:archive [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `change-name` | Nein | Welche Änderung archiviert werden soll (wird aus dem Kontext abgeleitet, wenn sie nicht angegeben wird) |

**Was es tut:**
- Prüft den Artefakt-Abschlussstatus
- Prüft den Aufgabenabschluss (warnt bei Unvollständigkeit)
- Bietet an, Delta-Spezifikationen zu synchronisieren, falls dies noch nicht geschehen ist
- Verschiebt den Änderungsordner nach `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Erhält alle Artefakte für die Prüfpfade

**Beispiel:**
```text
You: /opsx:archive

AI:  Archiviere add-dark-mode...

     Artefaktstatus:
     ✓ proposal.md existiert
     ✓ specs/ existiert
     ✓ design.md existiert
     ✓ tasks.md existiert (8/8 Aufgaben erledigt)

     Delta Specs: Noch nicht synchronisiert
     → Jetzt synchronisieren? (empfohlen)

You: Ja

AI:  ✓ Spezifikationen nach openspec/specs/ui/spec.md synchronisiert
     ✓ Verschiebt zu openspec/changes/archive/2025-01-24-add-dark-mode/

     Änderung erfolgreich archiviert.
```

**Tipps:**
- Das Archivieren blockiert nicht bei unvollständigen Aufgaben, sondern warnt nur
- Delta Specs können während des Archivierens oder vorher synchronisiert werden
- Archivierte Änderungen werden für die Historie erhalten
- Führen Sie zuerst `/opsx:verify` aus, um Probleme zu erkennen

---

### `/opsx:bulk-archive`

Archiviert mehrere abgeschlossene Änderungen auf einmal. Behandelt Spezifikationskonflikte zwischen den Änderungen.

**Syntax:**
```
/opsx:bulk-archive [change-names...]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|--------------|-------------|
| `change-names` | Nein | Spezifische Änderungen zum Archivieren (wird abgefragt, wenn sie nicht angegeben wird) |

**Was es tut:**
- Listet alle abgeschlossenen Änderungen auf
- Validiert jede Änderung vor dem Archivieren
- Erkennt Spezifikationskonflikte zwischen den Änderungen
- Löst Konflikte, indem es prüft, was tatsächlich implementiert wurde
- Archiviert in chronologischer Reihenfolge

**Beispiel:**
```
You: /opsx:bulk-archive

AI:  Gefunden 3 abgeschlossene Änderungen:
     - add-dark-mode (8/8 Aufgaben erledigt)
     - fix-login-bug (3/3 Aufgaben erledigt)
     - update-footer (2/2 Aufgaben erledigt)

     Prüfe auf Spezifikationskonflikte...
     ⚠ add-dark-mode und update-footer berühren beide specs/ui/

     Untersuche Codebasis zur Auflösung...
     Beide Änderungen sind implementiert. Werden in chronologischer Reihenfolge zusammengeführt:
     1. add-dark-mode (erstellt am 20. Jan)
     2. update-footer (erstellt am 22. Jan)

     Alle 3 Änderungen archivieren?

You: Ja

AI:  ✓ add-dark-mode archiviert
     ✓ fix-login-bug archiviert
     ✓ update-footer archiviert
     Spezifikationen zusammengeführt: add-dark-mode → update-footer
```

**Tipps:**
- Gut für parallele Arbeitsströme
- Die Konfliktlösung ist agentisch (prüft die Codebasis)
- Änderungen werden in der Erstellungsreihenfolge archiviert
- Fragt vor dem Überschreiben von Spezifikationsinhalten ab

---

### `/opsx:onboard`

Geführte Einarbeitung in den vollständigen OpenSpec Workflow. Ein interaktives Tutorial unter Verwendung Ihrer tatsächlichen Codebasis.

**Syntax:**
```
/opsx:onboard
```

**Was es tut:**
- Geht einen vollständigen Workflow-Zyklus mit Narration durch
- Durchsucht Ihre Codebasis nach echten Verbesserungsmöglichkeiten
- Erstellt eine echte Änderung mit echten Artefakten
- Implementiert tatsächliche Arbeit (kleine, sichere Änderungen)
- Archiviert die abgeschlossene Änderung
- Erklärt jeden Schritt, während er passiert

**Phasen:**
1. Begrüßung und Codebasisanalyse
2. Finden einer Verbesserungsmöglichkeit
3. Erstellen einer Änderung (`/opsx:new`)
4. Schreiben des Vorschlags
5. Erstellen der Spezifikationen
6. Schreiben des Designs
7. Erstellen von Aufgaben
8. Implementieren der Aufgaben (`/opsx:apply`)
9. Verifizieren der Implementierung
10. Archivieren der Änderung
11. Zusammenfassung und nächste Schritte

**Beispiel:**
```
You: /opsx:onboard

AI:  Willkommen bei OpenSpec!

     Ich werde Sie durch den vollständigen Workflow führen, unter Verwendung Ihrer tatsächlichen Codebasis.
     Wir werden etwas Kleines finden, um zu verbessern, eine angemessene Änderung dafür erstellen,
     es implementieren und es archivieren.

     Lassen Sie mich Ihre Codebasis nach Möglichkeiten durchsuchen...

     [Analysiert Codebasis]

     Ich habe einige Dinge gefunden, an denen wir arbeiten könnten:
     1. Füge Validierung für das Kontaktformular hinzu
     2. Verbessere die Fehlermeldungen im Auth-Flow
     3. Füge Ladezustände zu asynchronen Buttons hinzu

     Welches interessiert Sie? (oder schlagen Sie etwas anderes vor)
```

**Tipps:**
- Am besten für neue Benutzer, die den Workflow lernen möchten
- Verwendet echten Code, keine Spielzeugbeispiele
- Erstellt eine echte Änderung, die Sie behalten oder verwerfen können
- Dauert 15–30 Minuten

## Befehls-Syntax pro KI-Tool

Verschiedene KI-Tools verwenden leicht unterschiedliche Befehls-Syntaktiken. Verwenden Sie das Format, das zu Ihrem Tool passt:

| Tool | Syntax Example |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Skill-basierte Aufrufe wie `/skill:openspec-propose`, `/skill:openspec-apply-change` (keine generierten `opsx-*` Befehlsdateien) |
| Trae | Skill-basierte Aufrufe wie `/openspec-propose`, `/openspec-apply-change` (keine generierten `opsx-*` Befehlsdateien) |

Die Absicht ist über alle Tools gleich, aber die Art und Weise, wie die Befehle angezeigt werden, kann je nach Integration variieren.

> **Hinweis:** Die GitHub Copilot-Befehle (`.github/prompts/*.prompt.md`) sind nur in IDE-Erweiterungen (VS Code, JetBrains, Visual Studio) verfügbar. Die GitHub Copilot CLI unterstützt derzeit keine benutzerdefinierten Prompt-Dateien – siehe [Supported Tools](supported-tools.md) für Details und Workarounds.

---

## Legacy Commands

Diese Befehle verwenden den älteren „Alles-auf-einmal“-Workflow. Sie funktionieren immer noch, aber OPSX-Befehle werden empfohlen.

| Command | What it does |
|---------|--------------|
| `/openspec:proposal` | Erstellt alle Artefakte auf einmal (Proposal, Specs, Design, Tasks) |
| `/openspec:apply` | Implementiert die Änderung |
| `/openspec:archive` | Archiviert die Änderung |

**Wann Legacy Commands verwenden:**
- Bestehende Projekte, die den alten Workflow nutzen
- Einfache Änderungen, bei denen keine inkrementelle Erstellung von Artefakten erforderlich ist
- Präferenz für den All-or-Nothing-Ansatz

**Migration zu OPSX:**
Legacy-Änderungen können mit OPSX-Befehlen fortgesetzt werden. Die Artefaktstruktur ist kompatibel.

---

## Fehlerbehebung (Troubleshooting)

### "Change not found"

Der Befehl konnte nicht feststellen, welche Änderung bearbeitet werden soll.

**Lösungen:**
- Geben Sie den Änderungsnamen explizit an: `/opsx:apply add-dark-mode`
- Überprüfen Sie, ob das Change-Verzeichnis existiert: `openspec list`
- Vergewissern Sie sich, dass Sie sich im richtigen Projektverzeichnis befinden

### "No artifacts ready"

Alle Artefakte sind entweder abgeschlossen oder durch fehlende Abhängigkeiten blockiert.

**Lösungen:**
- Führen Sie `openspec status --change <name>` aus, um zu sehen, was blockiert
- Überprüfen Sie, ob die erforderlichen Artefakte existieren
- Erstellen Sie zuerst die fehlenden Abhängigkeitsartefakte

### "Schema not found"

Das angegebene Schema existiert nicht.

**Lösungen:**
- Listen Sie verfügbare Schemata auf: `openspec schemas`
- Überprüfen Sie die Schreibweise des Schema-Namens
- Erstellen Sie das Schema, falls es benutzerdefiniert ist: `openspec schema init <name>`

### Commands not recognized

Das KI-Tool erkennt OpenSpec-Befehle nicht.

**Lösungen:**
- Stellen Sie sicher, dass OpenSpec initialisiert ist: `openspec init`
- Regenerieren Sie die Skills: `openspec update`
- Überprüfen Sie, ob das Verzeichnis `.claude/skills/` existiert (für Claude Code)
- Starten Sie Ihr KI-Tool neu, damit es die neuen Skills übernimmt

### Artifacts not generating properly

Die KI erstellt unvollständige oder inkorrekte Artefakte.

**Lösungen:**
- Fügen Sie Projektkontext in `openspec/config.yaml` hinzu
- Fügen Sie Regeln pro Artefakt für spezifische Anweisungen hinzu
- Geben Sie mehr Details in Ihrer Änderungsbeschreibung an
- Verwenden Sie `/opsx:continue` anstelle von `/opsx:ff` für mehr Kontrolle

---

## Nächste Schritte (Next Steps)

- [Workflows](workflows.md) – Häufige Muster und wann welcher Befehl zu verwenden ist
- [CLI](cli.md) – Terminalbefehle für Verwaltung und Validierung
- [Customization](customization.md) – Erstellen von benutzerdefinierten Schemata und Workflows