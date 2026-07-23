# Wie Befehle funktionieren

**Das Wichtigste zuerst: OpenSpec hat zwei Arten von Befehlen, die an zwei verschiedenen Orten ausgeführt werden.**

- `openspec ...`-Befehle werden in deinem **Terminal** ausgeführt. (Beispiel: `openspec init`.)
- `/opsx:...`-Befehle werden im **Chat deines KI-Assistenten** ausgeführt. (Beispiel: `/opsx:propose`.)

Wenn du jemals `/opsx:propose` in dein Terminal eingibst und nichts passiert, liegt das an der Erklärung auf dieser Seite. Du sprichst mit der falschen Hälfte von OpenSpec. Slash-Befehle sind keine Terminal-Befehle. Es sind Anweisungen, die du deinem KI-Coding-Assistenten gibst, in dem gleichen Chat-Fenster, in dem du normalerweise „Füge ein Anmeldeformular hinzu“ eingibst.

Diese einzelne Unterscheidung ist die häufigste Hürde für neue Nutzer, also machen wir sie ganz klar.

## Die beiden Hälften

OpenSpec ist ein einziges Projekt, das zwei Rollen übernimmt.

**Die CLI (Terminal-Hälfte).** Ein Programm namens `openspec`, das du installierst und von deiner Shell aus ausführst. Es richtet dein Projekt ein, listet und validiert Änderungen, zeigt ein Dashboard an und archiviert abgeschlossene Arbeiten. Du gibst diese Befehle in iTerm, dem VS Code-Terminal, PowerShell oder an jedem Ort ein, an dem du auch `git` oder `npm` ausführen würdest.

```bash
openspec init        # richtet OpenSpec in diesem Projekt ein
openspec list        # zeigt aktive Änderungen an
openspec view        # öffnet das interaktive Dashboard
```

**Die Slash-Befehle (Chat-Hälfte).** Kurze Befehle wie `/opsx:propose` und `/opsx:apply`, die du in deinen KI-Assistenten eingibst. Diese weisen die KI an, dem OpenSpec-Workflow zu folgen: einen Vorschlag entwerfen, Spezifikationen schreiben, anhand der Aufgabenliste umsetzen, nach Abschluss archivieren. Du gibst diese Befehle in Claude Code, Cursor, Windsurf, Copilot oder dem Assistenten deiner Wahl ein.

```text
/opsx:propose add-dark-mode    (wird in deinem KI-Chat eingegeben)
/opsx:apply                    (wird in deinem KI-Chat eingegeben)
/opsx:archive                  (wird in deinem KI-Chat eingegeben)
```

Hier ist das mentale Modell in einer Grafik:

```text
        DEIN TERMINAL                         CHAT DEINES KI-ASSISTENTEN
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   installiert  │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   Befehle     │  /opsx:archive                │
   └──────────────────────┘    & Skills   └──────────────────────────────┘
        führe openspec hier aus                       führe /opsx:* hier aus
```

Beachte den Pfeil. Das Ausführen von `openspec init` in deinem Terminal ist das, was die Slash-Befehle in deinem KI-Tool *installiert*. Die Terminal-Hälfte richtet die Chat-Hälfte ein. Danach findet die tägliche Arbeit hauptsächlich im Chat statt.

## "Wie starte ich den interaktiven Modus?"

**Es gibt keinen separaten interaktiven Modus, den du starten musst.** Diese Frage taucht sehr häufig auf, also verdient sie eine klare Antwort.

Du musst keinen speziellen OpenSpec-Modus aufrufen. Du öffnest einfach deinen KI-Coding-Assistenten wie immer und gibst einen Slash-Befehl in den Chat ein. Der Slash-Befehl *ist* die Art, wie du OpenSpec "aufrufst". Dein Assistent erkennt ihn, lädt den passenden OpenSpec-Skill und beginnt, dem Workflow zu folgen.

Also lauten die tatsächlichen Anweisungen:

1. Öffne deinen KI-Coding-Assistenten (Claude Code, Cursor, Windsurf und so weiter) in deinem Projekt.
2. Gib `/opsx:propose` in dessen Chat ein, an der gleichen Stelle, an der du auch alle anderen Anfragen eingibst.
3. Beobachte die Autovervollständigung: Wenn OpenSpec installiert ist, siehst du `/opsx:propose`, `/opsx:apply` und weitere Befehle, sobald du den Slash eingibst.

Das ist alles. Kein Modus zum Umschalten, kein Daemon zum Starten, kein separates Fenster.

Eine Funktion, die *tatsächlich* interaktiv ist, befindet sich im Terminal: `openspec view`. Es öffnet ein Dashboard zum Durchsuchen deiner Spezifikationen und Änderungen. Aber das ist nur ein Betrachter, nicht das Werkzeug, mit dem du Vorschläge machst und umsetzt. Die Umsetzung erfolgt über Slash-Befehle im Chat.

## Warum diese Aufteilung existiert

Es lohnt sich, das zu verstehen, weil es erklärt, warum OpenSpec mit über 25 verschiedenen KI-Tools funktioniert.

Die CLI ist der **Motor**. Sie kennt die Regeln: wie ein Änderungsordner aufgebaut ist, welche Artefakte von welchen abhängen, wie eine Delta-Spezifikation in deine Quelle der Wahrheit zusammengeführt wird. Sie ist überall gleich.

Die Slash-Befehle sind das **Lenkrad**, und jedes KI-Tool hat ein leicht abweichendes. Claude Code nennt sie Befehle. Cursor und Windsurf haben eigene Formate. Einige Tools nennen sie Skills. Wenn du `openspec init` ausführst, generiert OpenSpec die passende Dateiart für jedes von dir ausgewählte Tool, sodass die gleiche Absicht von `/opsx:propose` unabhängig davon funktioniert, welchen Assistenten du bevorzugst.

Die Stärke dieses Designs: Du lernst den Workflow einmal und kannst ihn in allen Tools anwenden. Der Kompromiss: Die genaue Syntax eines Befehls kann zwischen den Tools leicht abweichen, was im nächsten Abschnitt erklärt wird.

## Slash-Befehlssyntax pro Tool

Die Absicht ist überall identisch. Die Zeichensetzung weicht ab. Nutze die Form, die zu deinem Assistenten passt.

| Tool | Eingabe |
|------|---------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | Skill-Stil, z. B. `/openspec-propose` |
| Codex | Skill-Stil über `.codex/skills/openspec-*` |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Skill-Stil, z. B. `/skill:openspec-propose` |
| Trae | `/opsx-propose`, `/opsx-apply` |

Die meisten Tools nutzen entweder die Doppelpunkt-Form (`/opsx:propose`) oder die Bindestrich-Form (`/opsx-propose`). Einige Tools stellen OpenSpec als benannte Skills statt als Slash-Befehle bereit; für diese rufst du den Skill über seinen Namen auf. Die vollständige Liste pro Tool, einschließlich der genauen Speicherorte der geschriebenen Dateien, findest du unter [Unterstützte Tools](supported-tools.md).

Wenn du unsicher bist, gib einen Slash in deinen KI-Chat ein und schau dir die Autovervollständigung an. Dein Tool zeigt dir die erwartete Form an.

## Wie die Befehle dorthin gelangen: Skills und Befehle

Wenn du `openspec init` (oder `openspec update`) ausführst, schreibt OpenSpec kleine Dateien in dein Projekt, damit dein KI-Tool den Workflow finden kann. Je nach Tool und Einstellungen sind das **Skills**, **Befehle** oder beides.

- **Skills** befinden sich an Orten wie `.claude/skills/openspec-*/SKILL.md`. Sie sind der aufkommende plattformübergreifende Standard: ein Ordner mit Anweisungen, den dein Assistent automatisch erkennt.
- **Befehle** befinden sich an Orten wie `.claude/commands/opsx/<id>.md`. Sie sind die älteren, pro Tool spezifischen Slash-Befehl-Dateien. Für Codex werden keine generierten Befehl-Dateien erstellt; nutze stattdessen `.codex/skills/openspec-*`.

Du musst nicht wissen, welches dein Tool nutzt. Du gibst einfach den Slash-Befehl ein und er funktioniert. Aber zu wissen, dass diese Dateien existieren, hilft, wenn etwas schiefgeht: Wenn deine Befehle verschwinden, bedeutet das normalerweise, dass diese Dateien fehlen oder veraltet sind, und `openspec update` generiert sie neu.

Die genauen Pfade pro Tool findest du unter [Unterstützte Tools](supported-tools.md), und im [Migrationsleitfaden](migration-guide.md) erfährst du, wie Skills den älteren, nur auf Befehle basierenden Ansatz abgelöst haben.

## Überprüfen der Installation

Schnelle Prüfungen, in der Reihenfolge ihrer Geschwindigkeit:

1. **Gib einen Slash in deinen KI-Chat ein.** Fang an, `/opsx` einzugeben und achte auf Autovervollständigungsvorschläge. Wenn diese erscheinen, ist alles eingerichtet.
2. **Suche nach den Dateien.** Bei Claude Code prüfe, dass der Ordner `.claude/skills/` Ordner mit dem Namen `openspec-*` enthält. Andere Tools nutzen eigene Verzeichnisse (diese sind unter [Unterstützte Tools](supported-tools.md) aufgelistet).
3. **Führe die Einrichtung erneut aus.** Führe im Wurzelverzeichnis deines Projekts `openspec update` aus. Dadurch werden die Skill- und Befehl-Dateien für alle von dir konfigurierten Tools neu generiert.
4. **Starte deinen Assistenten neu.** Viele Tools scannen beim Start nach Skills und Befehlen, also kann ein neues Fenster der fehlende Schritt sein.

## Welche Befehle habe ich überhaupt?

Standardmäßig installiert OpenSpec den **Kern**satz an Slash-Befehlen:

- `/opsx:explore`: Durchdenke eine Idee gemeinsam mit der KI, bevor du dich zu einer Änderung verpflichtest (perfekter erster Schritt, wenn du unsicher bist)
- `/opsx:propose`: Erstelle eine Änderung und entwerfe alle zugehörigen Planungsartefakte in einem Schritt
- `/opsx:apply`: Setze die Änderung um, indem du die zugehörige Aufgabenliste abarbeitest
- `/opsx:sync`: Führe die Spezifikationsaktualisierungen einer Änderung in deine Hauptspezifikationen zusammen (normalerweise automatisch)
- `/opsx:archive`: Schließe eine Änderung ab und archiviere sie

Ein guter Standard-Rhythmus: `explore`, wenn du herausfindest, was du tun willst, danach `propose`, `apply`, `archive`. Der Leitfaden [Zuerst explorieren](explore.md) erklärt, warum sich dieser einleitende Schritt lohnt.

Es gibt außerdem einen **erweiterten** Satz für Nutzer, die feinere Kontrolle wünschen (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Du aktivierst ihn mit `openspec config profile` und wendest ihn dann mit `openspec update` an.

Neu in all dem? `/opsx:onboard` (im erweiterten Satz) führt dich durch eine vollständige Änderung in deiner eigenen Codebasis und erklärt jeden Schritt. Es ist die freundlichste mögliche Einführung.

Was jeder Befehl genau tut, findest du unter [Befehle](commands.md). Wann du welchen Befehl nutzen solltest, findest du unter [Workflows](workflows.md).

## Ein reibungsloser erster Durchlauf

Hier ist die gesamte Abfolge mit Angabe des Ortes, an dem jeder Schritt ausgeführt wird.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (installiert Slash-Befehle in deinem KI-Tool)

AI CHAT      /opsx:explore
              (optional: durchdenke die Idee zuerst gemeinsam mit der KI)

AI CHAT      /opsx:propose add-dark-mode
              (KI entwirft Vorschlag, Spezifikationen, Design, Aufgaben)

AI CHAT      /opsx:apply
              (KI setzt es um und hakt Aufgaben ab)

AI CHAT      /opsx:archive
              (Änderung wird in deine Spezifikationen zusammengeführt und archiviert)
```

Zwei Terminal-Schritte zur Einrichtung. Danach arbeitest du hauptsächlich im Chat. Das ist der Rhythmus.

## Verwandte Themen

- [Erste Schritte](getting-started.md): Die vollständige Anleitung für die erste Änderung
- [Befehle](commands.md): Alle Slash-Befehle im Detail
- [CLI](cli.md): Alle Terminal-Befehle im Detail
- [Unterstützte Tools](supported-tools.md): Syntax pro Tool und Speicherorte von Dateien
- [FAQ](faq.md): Weitere kurze Antworten
- [Fehlerbehebung](troubleshooting.md): Lösungen, wenn Befehle nicht angezeigt werden