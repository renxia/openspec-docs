# Wie die Befehle funktionieren

**Das eine Ding, das Sie wissen müssen: OpenSpec hat zwei Arten von Befehlen, und sie laufen an zwei verschiedenen Orten.**

- `openspec ...` Befehle laufen in Ihrem **Terminal**. (Beispiel: `openspec init`.)
- `/opsx:...` Befehle laufen in dem Chat Ihres **KI-Assistenten**. (Beispiel: `/opsx:propose`.)

Wenn Sie jemals `/opsx:propose` in Ihr Terminal eingeben und nichts passiert, ist diese Seite der Grund. Sie sprechen mit der falschen Hälfte von OpenSpec. Slash-Befehle sind keine Terminalbefehle. Sie sind Anweisungen, die Sie Ihrem KI-Coding-Assistenten geben – im selben Chatfenster, in dem Sie normalerweise „ein Login-Formular hinzufügen“ eingeben würden.

Diese einzelne Unterscheidung ist das häufigste Stolperstein für neue Benutzer, also machen wir es kristallklar.

## Die zwei Hälften

OpenSpec ist ein Projekt mit zwei Hüten.

**Die CLI (Terminalhälfte).** Ein Programm namens `openspec`, das Sie installieren und aus Ihrer Shell ausführen. Es richtet Ihr Projekt ein, listet und validiert Änderungen, zeigt ein Dashboard an und archiviert abgeschlossene Arbeit. Sie geben diese in iTerm, das VS Code Terminal, PowerShell oder überall dort ein, wo Sie `git` oder `npm` ausführen würden.

```bash
openspec init        # OpenSpec in diesem Projekt einrichten
openspec list        # aktive Änderungen anzeigen
openspec view        # das interaktive Dashboard öffnen
```

**Die Slash-Befehle (Chathälfte).** Kurze Befehle wie `/opsx:propose` und `/opsx:apply`, die Sie in Ihren KI-Assistenten eingeben. Diese weisen die KI an, den OpenSpec-Workflow zu befolgen: einen Vorschlag entwerfen, Spezifikationen schreiben, aus der Aufgabenliste bauen, archivieren, wenn fertig. Sie geben diese in Claude Code, Cursor, Windsurf, Copilot oder welchen Assistenten Sie auch verwenden, ein.

```text
/opsx:propose add-dark-mode    (eingeben im KI-Chat)
/opsx:apply                    (eingeben im KI-Chat)
/opsx:archive                  (eingeben im KI-Chat)
```

Hier ist das mentale Modell in einem Bild zusammengefasst:

```text
        IHR TERMINAL                         DER CHAT IHRES KI-ASSISTENTEN
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   installiert    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   Befehle        │  /opsx:archive                │
   └──────────────────────┘    & skills   └──────────────────────────────┘
        hier openspec ausführen                       hier /opsx:* ausführen
```

Beachten Sie den Pfeil. Die Ausführung von `openspec init` in Ihrem Terminal ist das, was die Slash-Befehle in Ihr KI-Tool *installiert*. Die Terminalhälfte richtet die Chat-Hälfte ein. Danach findet der tägliche Betrieb hauptsächlich im Chat statt.

## „Wie starte ich den interaktiven Modus?“

**Es gibt keinen separaten interaktiven Modus, um zu starten.** Diese Frage kommt häufig auf und verdient eine klare Antwort.

Sie betreten keinen speziellen OpenSpec-Modus. Sie öffnen einfach Ihren KI-Coding-Assistenten wie gewohnt und geben einen Slash-Befehl in den Chat ein. Der Slash-Befehl *ist* die Art, wie Sie OpenSpec „betreten“. Ihr Assistent erkennt ihn, lädt das entsprechende OpenSpec-Skill und beginnt, dem Workflow zu folgen.

Die wahren Anweisungen lauten also:

1. Öffnen Sie Ihren KI-Coding-Assistenten (Claude Code, Cursor, Windsurf usw.) in Ihrem Projekt.
2. Geben Sie `/opsx:propose` in seinen Chat ein, an der Stelle, wo Sie jede andere Anfrage eingeben würden.
3. Beobachten Sie die Vervollständigung: Wenn OpenSpec installiert ist, werden Sie sehen, wie `/opsx:propose`, `/opsx:apply` und Co. erscheinen, während Sie den Slash eingeben.

Das war's. Kein Modus zum Umschalten, kein Daemon zum Starten, kein separates Fenster.

Ein Ding, das wirklich interaktiv ist, existiert im Terminal: `openspec view`. Es öffnet ein Dashboard zum Durchsuchen Ihrer Spezifikationen und Änderungen. Aber dies ist ein Viewer, nicht die Sache, mit der Sie Vorschläge machen und bauen. Das Bauen geschieht über Slash-Befehle im Chat.

## Warum diese Trennung existiert

Es ist wichtig zu verstehen, da es erklärt, warum OpenSpec mit 25+ verschiedenen KI-Tools funktioniert.

Die CLI ist der **Motor**. Sie kennt die Regeln: wie ein Änderungsordner aussieht, welche Artefakte von welchen abhängen, wie man eine Delta-Spezifikation in seine Wahrheitsquelle integriert. Das ist überall gleich.

Die Slash-Befehle sind das **Lenkrad**, und jedes KI-Tool hat sein eigenes leicht abweichendes Lenkrad. Claude Code nennt sie Befehle. Cursor und Windsurf haben ihre eigenen Formate. Einige Tools nennen sie Skills. Wenn Sie `openspec init` ausführen, generiert OpenSpec die richtige Art von Datei für jedes von Ihnen ausgewählte Tool, sodass dieselbe `/opsx:propose`-Absicht funktioniert, unabhängig davon, welchen Assistenten Sie bevorzugen.

Die Stärke dieses Designs: Sie lernen den Workflow einmal und tragen ihn über alle Tools mit sich. Der Kompromiss: Die genaue Syntax eines Befehls kann zwischen den Tools leicht abweichen, was der nächste Abschnitt behandelt.

## Slash-Befehlssyntax pro Tool

Die Absicht ist überall identisch. Die Satzzeichen unterscheiden sich. Verwenden Sie die Form, die zu Ihrem Assistenten passt.

| Tool | Wie Sie es eingeben |
|------|-----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | skill-Style, z. B. `/skill:openspec-propose` |
| Trae | skill-Style, z. B. `/openspec-propose` |

Die meisten Tools verwenden entweder die Colon-Form (`/opsx:propose`) oder die Dash-Form (`/opsx-propose`). Einige wenige Tools stellen OpenSpec als benannte Skills anstatt als Slash-Befehle bereit; für diese rufen Sie das Skill nach Name auf. Die vollständige Liste pro Tool, einschließlich der genauen Angabe, welche Dateien wohin geschrieben werden, finden Sie in [Supported Tools](supported-tools.md).

Im Zweifel geben Sie einen Slash in Ihren KI-Chat ein und schauen Sie sich die Vervollständigung an. Ihr Tool zeigt Ihnen das Format, das es erwartet.

## Wie die Befehle dorthin gelangten: Skills und Commands

Wenn Sie `openspec init` (oder `openspec update`) ausführen, schreibt OpenSpec kleine Dateien in Ihr Projekt, damit Ihr KI-Tool den Workflow finden kann. Je nach Ihrem Tool und Ihren Einstellungen sind dies **Skills**, **Commands** oder beides.

- **Skills** leben an Orten wie `.claude/skills/openspec-*/SKILL.md`. Sie sind der aufkommende cross-tool Standard: ein Ordner mit Anweisungen, den Ihr Assistent automatisch erkennt.
- **Commands** leben an Orten wie `.claude/commands/opsx/<id>.md`. Dies sind die älteren per-Tool Slash-Befehle-Dateien.

Sie müssen sich nicht darum kümmern, welches Ihr Tool verwendet. Sie geben einfach den Slash-Befehl ein und es funktioniert. Aber zu wissen, dass diese Dateien existieren, hilft, wenn etwas schiefläuft: Wenn Ihre Befehle verschwinden, bedeutet das in der Regel, dass diese Dateien fehlen oder veraltet sind, und `openspec update` regeneriert sie.

Sehen Sie [Supported Tools](supported-tools.md) für die genauen Pfade pro Tool und [Migration Guide](migration-guide.md), wie Skills den älteren Befehle-only-Ansatz ersetzt haben.

## Bestätigen, dass es installiert ist

Schnelle Prüfungen, zuerst die schnellsten:

1. **Geben Sie einen Slash in Ihren KI-Chat ein.** Beginnen Sie mit der Eingabe von `/opsx` und achten Sie auf Vervollständigungsvorschläge. Wenn diese erscheinen, sind Sie fertig.
2. **Suchen Sie nach den Dateien.** Für Claude Code prüfen Sie, ob `.claude/skills/` die `openspec-*` Ordner enthält. Andere Tools verwenden ihre eigenen Verzeichnisse ([Supported Tools](supported-tools.md) listet sie auf).
3. **Führen Sie das Setup erneut aus.** Führen Sie von der Stammverzeichnis Ihres Projekts `openspec update` aus. Dies regeneriert die Skill- und Befehlsdateien für alle konfigurierten Tools.
4. **Starten Sie Ihren Assistenten neu.** Viele Tools scannen beim Start nach Skills und Befehlen, daher kann ein frisches Fenster der fehlende Schritt sein.

## Welche Befehle habe ich überhaupt?

Standardmäßig installiert OpenSpec die **Kern**-Satz von Slash-Befehlen:

- `/opsx:explore`: Denken Sie mit der KI über eine Idee nach, bevor Sie sich auf eine Änderung festlegen (ein großartiger erster Schritt, wenn Sie unsicher sind)
- `/opsx:propose`: Erstellen Sie eine Änderung und entwerfen Sie alle ihre Planungsartefakte in einem Schritt
- `/opsx:apply`: Bauen Sie die Änderung durch, indem Sie ihre Aufgabenliste abarbeiten
- `/opsx:sync`: Integrieren Sie die Spezifikationsaktualisierungen einer Änderung in Ihre Hauptspezifikationen (normalerweise automatisch)
- `/opsx:archive`: Beenden Sie eine Änderung und archivieren Sie sie

Ein guter Standardrhythmus: `explore`, wenn Sie herausfinden, was zu tun ist, dann `propose`, `apply`, `archive`. Der Leitfaden [Explore First](explore.md) erklärt, warum dieser anfängliche Schritt sich lohnt.

Es gibt auch eine **erweiterte** Satz für diejenigen, die mehr Kontrolle wünschen (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Sie schalten dies mit `openspec config profile` ein und wenden es dann mit `openspec update` an.

Neu in dieser Sache? `/opsx:onboard` (in der erweiterten Satz) führt Sie durch eine vollständige Änderung an Ihrer eigenen Codebasis und kommentiert jeden Schritt. Es ist die freundlichste mögliche Einführung.

Für die Details, was jeder Befehl tut, siehe [Commands](commands.md). Für wann man welchen verwenden soll, siehe [Workflows](workflows.md).

## Ein sauberer erster Durchlauf

Zusammenfassend ist hier die gesamte Sequenz mit der Kennzeichnung jedes Schritts danach, wo er stattfindet.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (installiert Slash-Befehle in Ihr KI-Tool)

AI CHAT      /opsx:explore
              (optional: die Idee zuerst mit der KI durchdenken)

AI CHAT      /opsx:propose add-dark-mode
              (KI entwirft Vorschlag, Spezifikationen, Design, Aufgaben)

AI CHAT      /opsx:apply
              (KI baut es und arbeitet die Aufgaben ab)

AI CHAT      /opsx:archive
              (Änderung wird in Ihre Spezifikationen integriert und archiviert)
```

Zwei Terminal-Schritte zur Einrichtung. Danach leben Sie im Chat. Das ist der Rhythmus.

## Verwandtes

- [Getting Started](getting-started.md): Die vollständige Durchführung des ersten Changes
- [Commands](commands.md): Jeder Slash-Befehl im Detail
- [CLI](cli.md): Jeder Terminalbefehl im Detail
- [Supported Tools](supported-tools.md): Syntax und Dateipfade pro Tool
- [FAQ](faq.md): Weitere schnelle Antworten
- [Troubleshooting](troubleshooting.md): Behebungen, wenn Befehle nicht erscheinen