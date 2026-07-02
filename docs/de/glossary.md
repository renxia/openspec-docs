# Glossar

Jeder OpenSpec-Begriff an einem Ort, in einfacher Sprache definiert. Werfen Sie einen Blick darauf und der Rest der Dokumentation liest schneller.

Die Begriffe sind nach Thema gruppiert und innerhalb jeder Gruppe alphabetisiert.

## Die Kernbegriffe (The core nouns)

**Spec.** Ein Dokument, das beschreibt, wie ein Teil Ihres Systems funktioniert. Specs leben in `openspec/specs/`, sind nach Domäne organisiert und bestehen aus Anforderungen und Szenarien. Das Spec ist die vereinbarte Antwort auf die Frage „Was tut diese Software?“ Siehe [Concepts](concepts.md#specs).

**Source of truth.** Das gesamte Verzeichnis `openspec/specs/`. Es enthält das aktuelle, vereinbarte Verhalten Ihres Systems. Änderungen schlagen Bearbeitungen daran vor; Archivierung wendet sie an.

**Change.** Eine Arbeitseinheit, verpackt als Ordner unter `openspec/changes/<name>/`. Ein Change enthält alles über diese Arbeit: ihren Vorschlag, ihr Design, die Aufgaben und die Spec-Bearbeitungen, die es einführt. Ein Change entspricht einer Funktion oder einem Fix.

**Artifact.** Ein Dokument innerhalb eines Changes. Die Standard-Artefakte sind der Vorschlag (proposal), die Delta Specs, das Design und die Aufgaben (tasks). Sie werden in Abhängigkeitsreihenfolge erstellt und speisen sich gegenseitig.

**Delta spec.** Eine Spec innerhalb eines Change, die nur beschreibt, was geändert wird, indem sie `ADDED`, `MODIFIED` und `REMOVED`-Abschnitte verwendet, anstatt die gesamte Spec erneut darzustellen. Dies ermöglicht es OpenSpec, bestehende Systeme sauber zu bearbeiten. Siehe [Concepts](concepts.md#delta-specs).

**Domain.** Eine logische Gruppierung für Specs, wie z. B. `auth/`, `payments/` oder `ui/`. Sie wählen Domains, die Ihrer Denkweise über Ihr System entsprechen.

## Innerhalb einer Spec (Inside a spec)

**Requirement.** Ein einzelnes Verhalten, das das System haben muss, normalerweise formuliert mit einem RFC 2119-Schlüsselwort: „Das System SHALL Sessions nach 30 Minuten ablaufen lassen.“ Anforderungen beschreiben das *Was*, nicht das *Wie*.

**Scenario.** Ein konkretes, testbares Beispiel einer Anforderung in Aktion, typischerweise in der Given/When/Then-Form. Szenarien machen eine Anforderung überprüfbar: daraus könnte man einen automatisierten Test schreiben.

**RFC 2119 keywords.** Die Wörter MUST, SHALL, SHOULD und MAY, die eine standardisierte Bedeutung dafür tragen, wie streng eine Anforderung ist. MUST und SHALL sind absolut. SHOULD wird empfohlen mit Spielraum für Ausnahmen. MAY ist optional. Der Name stammt vom Internet-Standardsdokument, das sie definiert hat.

## Die Artefakte (The artifacts)

**Proposal (`proposal.md`).** Das *Warum* und *Was* eines Changes: seine Absicht, sein Umfang und der High-Level-Ansatz. Das erste Artefakt, das Sie erstellen.

**Design (`design.md`).** Das *Wie*: technischer Ansatz, Architekturentscheidungen und die Dateien, die Sie erwarten, zu berühren. Optional bei einfachen Änderungen.

**Tasks (`tasks.md`).** Die Implementierungs-Checkliste mit Kontrollkästchen. Die KI arbeitet diese während `/opsx:apply` durch und setzt die Punkte ab.

## Der Lebenszyklus (The lifecycle)

**Archive.** Der Vorgang, ein Change abzuschließen. Seine Delta Specs werden in die Hauptspecs integriert, und der Change-Ordner wird nach `openspec/changes/archive/YYYY-MM-DD-<name>/` verschoben. Nach der Archivierung beschreiben Ihre Specs die neue Realität. Siehe [Concepts](concepts.md#archive).

**Sync.** Das Zusammenführen von Delta Specs eines Changes in die Hauptspecs *ohne* das Change zu archivieren. Normalerweise automatisch (Archivierung bietet dies an), aber auch als `/opsx:sync` für langlaufende Changes verfügbar. Siehe [Commands](commands.md#opsxsync).

## Workflow und Befehle (Workflow and commands)

**OPSX.** Der aktuelle OpenSpec-Workflow, der auf fließenden Aktionen statt auf starren Phasen aufgebaut ist. Seine Slash Commands beginnen alle mit `/opsx:`. Siehe [OPSX Workflow](opsx.md).

**Slash command.** Ein Befehl, den Sie in den Chat Ihres KI-Assistenten eingeben, wie z. B. `/opsx:propose`. Slash Commands steuern den Workflow. Sie sind keine Terminalbefehle. Siehe [How Commands Work](how-commands-work.md).

**Explore (`/opsx:explore`).** Der Denkpartner-Befehl. Er liest Ihre Codebasis, vergleicht Optionen und klärt eine vage Idee in einen konkreten Plan um, ohne Artefakte zu erstellen oder Code zu schreiben. Der empfohlene Ausgangspunkt, wann immer Sie ein Problem haben, aber noch keinen Plan. Siehe [Explore First](explore.md).

**CLI.** Das `openspec`-Programm, das Sie in Ihrem Terminal ausführen. Es richtet Projekte ein, listet und validiert Changes, öffnet das Dashboard und archiviert. Die Terminal-Hälfte von OpenSpec. Siehe [CLI](cli.md).

**Skill.** Ein Ordner mit Anweisungen (`.../skills/openspec-*/SKILL.md`), den Ihr KI-Assistent automatisch erkennt und befolgt. Skills sind der aufkommende Cross-Tool Standard zur Bereitstellung des OpenSpec-Workflows an Ihren Assistenten.

**Command file.** Eine Slash Command Datei pro Tool (`.../commands/opsx-*`). Der ältere Bereitstellungsmechanismus, der neben den Skills noch unterstützt wird. Sie berühren diese selten direkt.

**Profile.** Die Menge der Slash Commands, die in Ihrem Projekt installiert sind. **Core** (der Standard) umfasst `propose`, `explore`, `apply`, `sync`, `archive`. Der **expanded** Satz fügt `new`, `continue`, `ff`, `verify`, `bulk-archive` und `onboard` hinzu. Ändern Sie dies mit `openspec config profile`.

**Delivery.** Ob OpenSpec Skills, Command Files oder beides für Ihre Tools installiert. Konfiguriert global und angewendet mit `openspec update`.

## Anpassung (Customization)

**Schema.** Die Definition, welche Artefakte ein Workflow hat und wie diese voneinander abhängen. Der eingebaute Standard ist `spec-driven` (proposal → specs → design → tasks). Sie können es ableiten oder Ihr eigenes schreiben. Siehe [Customization](customization.md#custom-schemas).

**Template.** Eine Markdown-Datei innerhalb eines Schemas, die bestimmt, was die KI für ein gegebenes Artefakt generiert. Das Bearbeiten einer Vorlage ändert sofort die Ausgabe der KI, ohne Neukompilierung.

**Project config (`openspec/config.yaml`).** Projekteinstellungen: das Standardschema, das `context:`, das in jede Planungsanfrage injiziert wird, und die Artefakt-spezifischen `rules:`. Die einfachste Art, OpenSpec über Ihren Stack und Ihre Konventionen zu lehren. Siehe [Customization](customization.md#project-configuration).

**Context injection.** Das Einbringen von Projekthintergrund in das `context:`-Feld der `config.yaml`, sodass es automatisch jedem Artefakt hinzugefügt wird, das die KI generiert. Dies ist zuverlässiger, als darauf zu hoffen, dass die KI eine separate Datei liest.

**Dependency graph.** Der gerichtete Graph, der durch die `requires:`-Beziehungen der Artefakte gebildet wird. Es ist ein DAG (Directed Acyclic Graph: Pfeile zeigen nur vorwärts, niemals in einen Kreis), und OpenSpec nutzt ihn, um zu wissen, was Sie als Nächstes erstellen können.

**Enablers, not gates.** Das Prinzip, dass Artefakt-Abhängigkeiten zeigen, was als Nächstes *möglich* wird, nicht was als Nächstes *erforderlich* ist. Sie können jederzeit jedes Artefakt erneut ansehen und bearbeiten. Siehe [Core Concepts at a Glance](overview.md#enablers-not-gates).

## Koordination über Repositories hinweg (Beta)

Diese Begriffe gelten nur, wenn Ihre Planung mehr als ein Repository umfasst. Sie sind in Beta. Die meisten Benutzer können sie ignorieren. Siehe den [Stores User Guide](stores-beta/user-guide.md).

**Store.** Ein eigenständiges Repo, dessen ganzer Job die Planung ist. Es hat dieselbe `openspec/`-Struktur wie Sie bereits kennen (specs und changes) plus eine kleine Identifikationsdatei. Sie registrieren es einmal auf Ihrem Rechner nach Name, und dann kann jeder OpenSpec-Befehl darin von überall aus funktionieren.

**Reference.** Eine Deklaration in der `openspec/config.yaml` eines Code-Repos, die einen Store referenziert, auf den dieses Repo zurückgreift. Referenzen sind schreibgeschützt: Das Repo behält seinen eigenen Root, und `openspec instructions` erhält einen Index der Specs des referenzierten Stores, jede mit dem genauen Befehl zum Abrufen davon.

**Working context.** Was `openspec context` für das aktuelle Repo zusammenstellt: seinen OpenSpec-Root plus jeden referenzierten Store, jeweils mit der Methode, wie er abgerufen werden kann. Die Antwort auf die Frage „Mit was arbeite ich?“

**Workset.** Eine persönliche, maschinell lokale Menge von Ordnern, die Sie zusammen öffnen (ein Store neben den Code-Repos, an denen Sie arbeiten). Es wird explizit mit `openspec workset create` erstellt; nichts über diese lokalen Pfade wird in das gemeinsame Planungsrepo committed.

## Siehe auch

- [Core Concepts at a Glance](overview.md): die fünf Ideen auf einer Seite
- [Concepts](concepts.md): die ausführliche Erklärung
- [How Commands Work](how-commands-work.md): Slash Commands gegenüber der CLI