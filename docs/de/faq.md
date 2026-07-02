# FAQ

Schnelle Antworten auf die häufigsten Fragen. Wenn Ihre Frage wirklich eine „etwas ist kaputt“-Frage ist, ist [Troubleshooting](troubleshooting.md) die bessere Seite. Wenn Sie einen Begriff definiert haben möchten, siehe [Glossary](glossary.md).

## Die Grundlagen

### Was ist OpenSpec in einem Satz?

Eine leichtgewichtige Schicht, die sicherstellt, dass Sie und Ihr KI-Codierungsassistent aufschreiben festlegen, was zu bauen ist, bevor auch nur eine Zeile Code geschrieben wurde.

### Warum sollte ich das wollen?

Weil KI-Assistenten selbst dann zuversichtlich sind, wenn sie falsch liegen. Wenn Anforderungen nur in einem Chat-Thread existieren, füllt die KI Lücken mit Vermutungen, und Sie erfahren es erst, nachdem der Code da ist. OpenSpec verschiebt die Einigung an einen früheren Punkt, wo Fehler noch günstig zu beheben sind. Sehen Sie sich [Core Concepts at a Glance](overview.md) für den vollständigen Fallbeispielbericht an.

### Muss ich es für alles verwenden?

Nein. Verwenden Sie es dort, wo eine Einigung wichtig ist, also bei der meisten nicht trivialen Arbeit. Für die Korrektur eines einstelligen Tippfehlers ist die Zeremonie wahrscheinlich nicht nötig, und das ist in Ordnung.

### Kann ich es auf einer großen bestehenden Codebasis oder nur auf neuen Projekten verwenden?

Bestehende Codebasen sind das Hauptthema. OpenSpec ist „brownfield-first“: Sie müssen Ihre gesamte Anwendung nicht von Anfang an dokumentieren. Sie schreiben Spezifikationen nur für die Änderungen, die jede Änderung berührt, und Ihre Spezifikationen füllen sich im Laufe der Zeit rund um die Arbeit, die Sie tatsächlich leisten. Es gibt eine spezielle Anleitung: [Using OpenSpec in an Existing Project](existing-projects.md).

### Ist es an ein bestimmtes KI-Tool gebunden?

Nein. OpenSpec funktioniert mit 25+ Assistenten, darunter Claude Code, Cursor, Windsurf, GitHub Copilot, Gemini CLI, Codex und mehr. Die vollständige Liste und Details pro Tool finden Sie in [Supported Tools](supported-tools.md).

## Befehle ausführen

### Wo tippe ich `/opsx:propose` ein?

In dem Chat Ihres KI-Assistenten, nicht in Ihrem Terminal. Dies ist der häufigste Punkt der Verwirrung, daher gibt es eine eigene Seite: [How Commands Work](how-commands-work.md). Kurze Version: `openspec ...` wird im Terminal ausgeführt, `/opsx:...` wird im Chat ausgeführt.

### Wie "starte" ich den interaktiven Modus?

Es gibt keinen separaten Modus zum Starten. Sie öffnen Ihren KI-Assistenten wie gewohnt und tippen einen Slash-Befehl in dessen Chat ein. Der Slash-Befehl ist die Art, wie Sie OpenSpec „betreten“. (Die eine wirklich interaktive Terminalfunktion ist `openspec view`, ein Dashboard zum Durchsuchen von Spezifikationen und Änderungen.) Die vollständige Erklärung finden Sie in [How Commands Work](how-commands-work.md).

### Ich habe einen Slash-Befehl eingegeben, und es ist nichts passiert. Warum?

Höchstwahrscheinlich haben Sie ihn im Terminal anstatt in Ihrem KI-Chat eingegeben, oder die Befehle sind noch nicht installiert. Führen Sie `openspec update` in Ihrem Projekt aus, starten Sie Ihren Assistenten neu und versuchen Sie dann, `/opsx` im Chat einzugeben und achten Sie auf die 자동 Vervollständigung (autocomplete). [Troubleshooting](troubleshooting.md#commands-dont-show-up) enthält die vollständige Checkliste.

### Warum ist die Syntax `/opsx:propose` in einem Tool und `/opsx-propose` in einem anderen?

Jedes KI-Tool präsentiert benutzerdefinierte Befehle etwas unterschiedlich. Die Absicht ist identisch; nur die Satzzeichen ändern sich. Tippen Sie einen Slash in Ihren Chat, und die Vervollständigung zeigt Ihnen das Format, das Ihr Tool erwartet. Die Tabelle pro Tool finden Sie in [How Commands Work](how-commands-work.md#slash-command-syntax-by-tool).

### Was ist der Unterschied zwischen einer Skill und einem Command?

Beides sind Dateien, die OpenSpec erstellt, damit Ihr Assistent den Workflow ausführen kann. Skills (`.../skills/openspec-*/SKILL.md`) sind der neuere Cross-Tool-Standard; Commands (`.../commands/opsx-*`) sind die älteren Slash-Dateien pro Tool. Sie müssen sich nicht entscheiden. Sie tippen einfach den Slash-Befehl, und OpenSpec installiert das, was Ihr Tool verwendet.

## Der Workflow

### Wo soll ich anfangen, wenn ich mir nicht sicher bin, was ich bauen soll?

Mit `/opsx:explore`. Es ist ein Denkenpartner ohne Risiko, der Ihre Codebasis liest, Optionen aufzeigt und aus einem vagen Problem einen konkreten Plan macht – und das alles, bevor irgendeine Änderung oder Code existiert. Er ist im Standardprofil verfügbar und somit immer zugänglich. Wenn der Plan klar ist, übergibt er an `/opsx:propose`. Dies ist die beste Gewohnheit, die Sie entwickeln können, da sie verhindert, dass eine eifrige KI das falsche Ding zuversichtlich baut. Sehen Sie sich [Explore First](explore.md) an.

### Was ist der einfachste mögliche Ablauf?

```text
/opsx:explore (optional)   dann   /opsx:propose <was Sie wollen>   dann   /opsx:apply   dann   /opsx:archive
```

Erkunden, um es durchzudenken; vorschlagen, um den Plan zu entwerfen; anwenden, um es zu bauen; archivieren, um es abzulegen. Überspringen Sie das Erkunden, wenn Sie bereits genau wissen, was Sie wollen.

### Was ist der Unterschied zwischen `/opsx:propose` und `/opsx:new`?

`/opsx:propose` ist der Standard-Einzelschritt-Befehl: Er erstellt die Änderung und entwirft alle Planungsartefakte auf einmal. `/opsx:new` ist Teil des erweiterten Befehlssets und skaliert nur eine leere Änderung, sodass Sie die Artefakte einzeln mit `/opsx:continue` (oder alles auf einmal mit `/opsx:ff`) erstellen müssen. Verwenden Sie Propose, es sei denn, Sie möchten die Kontrolle Schritt für Schritt behalten. Sehen Sie sich [Commands](commands.md) an.

### Was sind Core- und Expanded-Profile?

Ein Profil entscheidet, welche Slash-Befehle installiert werden. **Core** (das Standardprofil) gibt Ihnen `propose`, `explore`, `apply`, `sync` und `archive`. Das **Expanded** Set fügt `new`, `continue`, `ff`, `verify`, `bulk-archive` und `onboard` für feinere Kontrolle hinzu. Wechseln Sie mit `openspec config profile` und wenden Sie es dann mit `openspec update` an.

### Muss ich `/opsx:sync` ausführen?

Normalerweise nicht. Sync verschmilzt die Delta-Spezifikationen einer Änderung in Ihre Hauptspezifikationen, und `/opsx:archive` bietet an, dies für Sie zu tun. Führen Sie Sync manuell nur aus, wenn Sie möchten, dass die Spezifikationen vor der Archivierung verschmolzen sind, beispielsweise bei einer langlaufenden Änderung. Sehen Sie sich [Commands](commands.md#opsxsync) an.

### Wie bearbeite ich einen Vorschlag, eine Spezifikation oder eine Aufgabe, nachdem ich angefangen habe?

Bearbeiten Sie einfach die Datei. Jedes Artefakt ist ein reines Markdown in `openspec/changes/<name>/`, und es gibt keine gesperrte Phase oder einen speziellen Bearbeitungsmodus. Ändern Sie es manuell oder bitten Sie Ihre KI, es zu überarbeiten („aktualisiere das Design, um eine Warteschlange zu verwenden“), und fahren Sie fort. Die KI arbeitet immer von den aktuellen Dateiinhhalten aus. Vollständige Anleitung: [Editing & Iterating on a Change](editing-changes.md).

### Kann ich zurückgehen und den Plan ändern, nachdem ich einen Teil davon implementiert habe?

Ja, jederzeit. Der Workflow ist fließend, daher sind Überprüfung und Bearbeitung keine Phasen, von denen Sie ausgeschlossen werden. Bearbeiten Sie das Artefakt und fahren Sie fort. Wenn Sie eine strukturierte Überprüfung wünschen, dass der Code immer noch dem Plan entspricht, führen Sie `/opsx:verify` aus. Sehen Sie sich [Editing & Iterating on a Change](editing-changes.md) an.

### Ich habe den Code manuell bearbeitet. Wie bringe ich ihn mit der Spezifikation in Einklang?

Bringen Sie sie vor der Archivierung wieder in Einklang, da die Archivierung Ihre Spezifikationen zur wahren Quelle macht. Wenn der Code nun korrekt ist, aktualisieren Sie die Delta-Spezifikation, um sie an das gelieferte abzugleichen; wenn die Spezifikation korrekt ist, bauen Sie weiter, bis der Code zustimmt. `/opsx:verify` zeigt die Abweichungen auf. Sehen Sie sich [Editing & Iterating on a Change](editing-changes.md) an.

### Wann sollte ich eine bestehende Änderung aktualisieren und wann eine neue beginnen?

Aktualisieren Sie, wenn es dieselbe Arbeit ist, nur verfeinert. Beginnen Sie neu, wenn die Absicht fundamental geändert wurde oder der Umfang in verschiedene Arbeiten explodierte. Es gibt einen Entscheidungsflussdiagramm und Beispiele in [Workflows](workflows.md#when-to-update-vs-start-fresh).

### Was passiert, wenn meine Sitzung den Kontext verliert oder sich die Anforderungen während der Implementierung ändern?

Hier sind Spezifikationen nützlich. Da der Plan in Dateien (und nicht nur im Chatverlauf) existiert, können Sie Ihren Kontext löschen, eine neue KI-Sitzung starten und mit `/opsx:apply` fortfahren; es liest die Artefakte und setzt bei der ersten unkontrollierten Aufgabe fort. Wenn sich Anforderungen ändern, bearbeiten Sie die Artefakte entsprechend der neuen Realität und fahren Sie fort. Ein sauberes Kontextfenster zu behalten führt auch zu besseren Ergebnissen; löschen Sie es vor der Implementierung.

### Soll ich den `openspec/`-Ordner zu git committen?

Ja. Ihre Spezifikationen, aktive Änderungen und das Archiv sind Teil der Historie Ihres Projekts. Committen Sie sie wie jede andere Quelle. Das Archiv wird insbesondere ein dauerhafter Nachweis dafür, warum Ihr System so funktioniert, wie es tut.

## Specs und Changes

### Was gehört in eine Spec im Vergleich zu einem Design?

Eine Spec beschreibt das beobachtbare Verhalten: was das System tut, seine Eingaben, Ausgaben und Fehlerbedingungen. Ein Design beschreibt, *wie* Sie es bauen werden: der technische Ansatz, die Architekturentscheidungen, die Dateianpassungen. Wenn die Implementierung sich ändern könnte, ohne dass das extern sichtbare Verhalten zu ändern, gehört sie in das Design und nicht in die Spec. [Concepts](concepts.md#what-a-spec-is-and-is-not) geht tiefer ins Detail.

### Was ist eine Delta Spec?

Eine Spezifikation, die nur beschreibt, was sich ändert, unter Verwendung der Abschnitte `ADDED`, `MODIFIED` und `REMOVED`, anstatt die gesamte Spezifikation zu wiederholen. Es ist die Art, wie OpenSpec Änderungen an bestehenden Systemen sauber handhabt. Sehen Sie sich [Concepts](concepts.md#delta-specs) an.

### Wohin gehen archivierte Changes?

In `openspec/changes/archive/YYYY-MM-DD-<name>/`, wobei alle Artefakte erhalten bleiben. Nichts wird gelöscht; die Änderung verlässt einfach Ihre aktive Liste.

## Konfiguration und Anpassung

### Wie sage ich der KI von meinem Tech Stack?

Legen Sie es in `openspec/config.yaml` unter `context:`. Dieser Text wird in jede Planungsanfrage injiziert, sodass die KI immer Ihren Stack und Ihre Konventionen kennt. Sehen Sie sich [Customization](customization.md#project-configuration) an.

### Kann ich Spezifikationen in einer Sprache außer Englisch generieren?

Ja. Fügen Sie eine Sprachanweisung zu `context:` in Ihrer Konfiguration hinzu. [Multi-Language](multi-language.md) enthält Copy-Paste-Schnipsel für mehrere Sprachen.

### Kann ich den Workflow selbst ändern?

Ja, mit benutzerdefinierten Schemata. Ein Schema definiert, welche Artefakte existieren und wie sie voneinander abhängen. Forken Sie das Standardschema mit `openspec schema fork spec-driven my-workflow` und bearbeiten Sie es. Sehen Sie sich [Customization](customization.md#custom-schemas) an.

## Modelle, Datenschutz und Upgrades

### Welches KI-Modell sollte ich verwenden?

OpenSpec funktioniert am besten mit Modellen mit hohem Schlussfolgerungsvermögen (high-reasoning models). Die README empfiehlt Modelle wie Codex 5.5 und Opus 4.7 sowohl für die Planung als auch für die Implementierung. Halten Sie außerdem Ihr Kontextfenster sauber: löschen Sie es vor der Implementierung für die besten Erfolg.

### Sammelt OpenSpec Daten?

Es sammelt anonymisierte Nutzungsstatistiken: nur Befehlsnamen und Versionsnummer. Keine Argumente, Pfade, Inhalte oder persönliche Daten, und es ist im CI automatisch deaktiviert. Opt-out mit `export OPENSPEC_TELEMETRY=0` oder `export DO_NOT_TRACK=1`.

### Wie führe ich ein Upgrade durch?

Zwei Schritte. Aktualisieren Sie das Paket (`npm install -g @fission-ai/openspec@latest`), und führen Sie dann `openspec update` in jedem Projekt aus, um die generierten Skills und Commands zu aktualisieren.

### Wie deinstalliere ich OpenSpec?

Es gibt keinen Deinstallationsbefehl, da es sich nur um ein globales Paket plus Dateien in Ihrem Projekt handelt. Entfernen Sie das Paket (`npm uninstall -g @fission-ai/openspec`), und löschen Sie optional den `openspec/`-Ordner und die generierten Tool-Dateien. Eine Schritt-für-Schritt-Anleitung, einschließlich dessen, was sicher aufbewahrt werden kann, finden Sie in [Installation: Uninstalling](installation.md#uninstalling).

## Hilfe erhalten

### Wo stelle ich Fragen oder melde Bugs?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Von Ihrem Terminal:** `openspec feedback "Ihre Nachricht"` öffnet ein GitHub Issue für Sie.

### Diese Docs sind falsch oder verwirrend. Was soll ich tun?

Sagen Sie es uns, oder korrigieren Sie es. Dokumentations-PRs (Pull Requests) sind willkommen und werden geschätzt. Erstellen Sie ein Issue oder senden Sie einen Pull Request.