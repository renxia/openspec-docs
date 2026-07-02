# Bearbeiten und Iterieren einer Änderung

**Jedes Artefakt in einer Änderung ist einfach eine Markdown-Datei, die Sie jederzeit bearbeiten können.** Es gibt keine gesperrte „Planungsphase“, kein Genehmigungs-Gate und keinen speziellen Bearbeitungsmodus. Möchten Sie den Vorschlag ändern, nachdem Sie mit dem Bauen begonnen haben? Öffnen Sie `proposal.md` und ändern Sie ihn. Haben Sie festgestellt, dass das Design während der Implementierung falsch ist? Beheben Sie `design.md` und fahren Sie fort. Das ist die ganze Antwort, und es ist beabsichtigt so.

Diese Seite ist für den Moment gedacht, in dem Sie denken: „Warte, kann ich zurückgehen und das ändern?“ Ja. So geht das Vorgehen für jeden gängigen Fall.

## Zwei Wege, um alles zu bearbeiten

Sie haben immer beide Möglichkeiten:

1. **Bearbeiten Sie die Datei direkt.** Artefakte sind einfache Markdown-Dateien in `openspec/changes/<name>/`. Öffnen Sie `proposal.md`, `design.md`, `tasks.md` oder eine Delta-Spezifikation unter `specs/` in Ihrem Editor und ändern Sie sie. Nichts anderes ist erforderlich.

2. **Bitten Sie Ihre KI, es zu überarbeiten.** Sagen Sie im Chat einfach, was Sie möchten: „Aktualisieren Sie den Vorschlag, um die Caching-Idee zu streichen und einen Abschnitt zur Ratenbegrenzung hinzuzufügen,“ oder „das Design sollte eine Warteschlange verwenden, nicht Polling.“ Die KI bearbeitet das Artefakt für Sie und nutzt den Rest der Änderung als Kontext.

Verwenden Sie je nach Situation das passende Vorgehen. Eine kleine Formulierungskorrektur? Bearbeiten Sie die Datei. Ein substanzielles Nachdenken? Lassen Sie die KI mit dem vollständigen Kontext überarbeiten.

## „Wie aktualisiere ich den Vorschlag (oder die Spezifikationen), nachdem ich angefangen habe?“

Aktualisieren Sie ihn einfach. Dieselbe Änderung, verfeinert.

Wenn Sie die erweiterten Befehle verwenden, ist der natürliche Ablauf: bearbeiten Sie das Artefakt und führen Sie `/opsx:continue` aus, um vom neuen Zustand aufzunehmen, oder `/opsx:apply`, um weiterhin gegen den aktualisierten Plan zu implementieren. Wenn Sie die Standardbefehle `core` verwenden, bearbeiten Sie das Artefakt und führen Sie `/opsx:apply` aus; es liest die aktuellen Dateien und baut daher basierend darauf, was die Artefakte nun besagen.

Das mentale Modell: Artefakte sind der Live-Plan, kein unterzeichneter Vertrag. Die KI arbeitet immer von deren aktuellem Inhalt aus, daher lenkt das Bearbeiten die Arbeit.

```text
Sie: Ich möchte den Ansatz in dieser Änderung ändern.

Sie: [bearbeiten Sie design.md oder sagen Sie es der KI:]
     Aktualisieren Sie design.md, um stattdessen einen Hintergrundjob anstelle eines synchronen Aufrufs zu verwenden.

KI:  design.md aktualisiert. Die Aufgabenliste passt immer noch; soll ich fortfahren mit der Anwendung?

Sie: /opsx:apply
```

Dies beantwortet eine sehr häufige Frage: Es gibt keinen separaten „Vorschlag aktualisieren“-Befehl, weil Sie ihn nicht benötigen. Die Datei ist die alleinige Wahrheit (Source of Truth), und sie zu bearbeiten (manuell oder über die KI) ist das Update.

## „Wie gehe ich nach der Implementierung zurück, um zu überprüfen?“

Sie müssen nicht „zurückgehen“, denn Sie sind nie weg gewesen. Der Workflow ist fließend: Überprüfen, Bearbeiten und Implementierung sind keine sequenziellen Phasen, in denen Sie gefangen sind.

Konkret, nachdem Sie einige Arbeit mit `/opsx:apply` geleistet haben:

- Möchten Sie den Plan erneut prüfen? Öffnen Sie die Artefakte und lesen Sie sie durch oder führen Sie `openspec show <change>` in Ihrem Terminal aus, um eine konsolidierte Ansicht zu erhalten.
- Haben Sie etwas zu ändern gefunden? Bearbeiten Sie das Artefakt (oder bitten Sie die KI darum), dann fahren Sie fort.
- Möchten Sie eine strukturierte Überprüfung, dass der Code dem Plan entspricht? Führen Sie `/opsx:verify` (erweiterter Befehl) aus. Er meldet Vollständigkeit, Korrektheit und Kohärenz, ohne etwas zu blockieren. Sehen Sie sich [Workflows: Ihre Arbeit überprüfen](workflows.md#verify-check-your-work) an.

Es gibt keine „Überprüfungsphase“, auf die Sie zurückkehren müssten, denn Überprüfung ist etwas, das Sie jederzeit tun können, auch nach der Implementierung.

## „Ich habe den Code manuell bearbeitet. Wie bringe ich das mit OpenSpec in Einklang?“

Das passiert ständig und das ist in Ordnung. Sie haben etwas in Ihrem Editor angepasst, und nun stimmen der Code und die Artefakte nicht überein. Bringen Sie sie in Einklang, egal in welche Richtung es geht:

- **Der Code ist jetzt korrekt, die Spezifikation ist veraltet.** Aktualisieren Sie die Delta-Spezifikation (und die Aufgaben, falls relevant), um das Verhalten zu beschreiben, das Sie tatsächlich ausgeliefert haben. Die Spezifikation sollte der Realität entsprechen, bevor Sie archivieren, da das Archivieren die Spezifikation in Ihre alleinige Wahrheit integriert.
- **Die Spezifikation ist korrekt, der Code hat abgedriftet.** Bauen oder beheben Sie weiter, bis der Code mit der Spezifikation übereinstimmt.

Ein schneller Weg, um Abweichungen aufzuzeigen, ist `/opsx:verify`: es liest Ihre Artefakte und Ihren Code und sagt Ihnen, wo sie voneinander abweichen. Behandeln Sie dessen Ausgabe als eine To-Do-Liste zur Versöhnung, archivieren Sie erst, wenn sie übereinstimmen.

Das Prinzip: Zum Zeitpunkt des Archivierens werden Ihre Spezifikationen die Wahrheit der Aufzeichnung. Daher sollten Sie vor dem Archivieren sicherstellen, dass die Spezifikationen ehrlich sind in Bezug auf das, was der Code tut. Manuelle Bearbeitungen sind willkommen; lassen Sie sie aber nicht heimlich von der Spezifikation abdriften.

## Verfeinern eines Vorschlags, der Sie nicht zufriedenstellt

Wenn ein generierter Vorschlag daneben liegt, haben Sie drei gute Möglichkeiten:

- **Am Ort iterieren.** Sagen Sie der KI, was falsch ist („Der Umfang ist zu weit gefasst, streichen Sie die Admin-Funktionen“) und lassen Sie sie es überarbeiten. Am günstigsten und meistens richtig.
- **Zuerst erforschen, dann neu vorschlagen.** Wenn das Problem darin besteht, dass die Idee selbst unklar ist, gehen Sie zurück zu `/opsx:explore`, denken Sie darüber nach und lassen Sie einen schärferen Vorschlag entstehen. Sehen Sie sich [Erstens erkunden](explore.md) an.
- **Von Grund auf neu starten.** Wenn sich die Absicht grundlegend geändert hat, kann eine neue Änderung klarer sein als das Patchen der alten.

Diese letzte Maßnahme hat ihren eigenen Entscheidungsleitfaden, gleich.

## Wann aktualisieren und wann eine neue Änderung beginnen

Kurz gesagt: **aktualisieren Sie, wenn es dieselbe Arbeit ist, die verfeinert wurde; starten Sie neu, wenn sich die Absicht grundlegend geändert hat oder der Umfang in unterschiedliche Arbeiten explodiert ist.**

- Gleiches Ziel, besserer Ansatz? Aktualisieren.
- Eingrenzung des Umfangs (MVP jetzt liefern, mehr später)? Aktualisieren, dann archivieren und eine neue Änderung für Phase zwei starten.
- Das Problem selbst hat sich geändert („Dark Mode hinzufügen“ wurde zu „ein vollständiges Theming-System erstellen“)? Neue Änderung.

Es gibt einen vollständigen Flussdiagramm und durchgeführte Beispiele in [Workflows: Wann aktualisieren vs. neu beginnen](workflows.md#when-to-update-vs-start-fresh) und eine tiefere Behandlung in [OPSX: Wann aktualisieren vs. neu beginnen](opsx.md#when-to-update-vs-start-fresh).

## Ein Hinweis zu Aufgaben

`tasks.md` ist eine lebendige Checkliste, kein eingefrorener Plan. Während Sie implementieren, können Sie hinzugefügte Aufgaben eintragen, die Sie entdecken, solche entfernen, die sich als unnötig erwiesen haben, oder sie neu anordnen. Die KI setzt erledigte Punkte ab, während sie diese bei `/opsx:apply` abschließt, und sie nimmt von der ersten nicht abgehakten Aufgabe wieder auf, wenn Sie später zurückkehren. Das Bearbeiten der Liste unterwegs ist zu erwarten.

## Wohin geht es als Nächstes

- [Workflows](workflows.md) – Muster sowie den Entscheidungsleitfaden für Aktualisieren vs. Neu
- [Erstens erkunden](explore.md) – Der Ort, an den Sie zurückkehren, wenn eine Idee überdacht werden muss
- [Befehle](commands.md) – `/opsx:continue`, `/opsx:apply` und `/opsx:verify` im Detail
- [Konzepte: Artefakte](concepts.md#artifacts) – Wofür jedes Artefakt dient