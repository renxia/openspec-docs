# Bearbeiten und Iterieren einer Änderung

**Jedes Artefakt einer Änderung ist einfach eine Markdown-Datei, die Sie jederzeit bearbeiten können.** Es gibt keine gesperrte "Planungsphase", keine Genehmigungshürde, keinen speziellen Bearbeitungsmodus, den Sie aufrufen müssen. Sie möchten den Vorschlag ändern, nachdem Sie mit der Implementierung begonnen haben? Öffnen Sie `proposal.md` und ändern Sie ihn. Haben Sie festgestellt, dass das Design mitten in der Implementierung falsch ist? Korrigieren Sie `design.md` und machen Sie weiter. Das ist die gesamte Antwort, und das ist beabsichtigt.

Diese Seite ist für den Moment, in dem Sie denken: "Moment mal, kann ich zurückkehren und das ändern?" Ja. Hier erfahren Sie, wie das für jeden häufigen Fall funktioniert.

## Zwei Möglichkeiten, um etwas zu bearbeiten

Sie haben immer beide Optionen:

1. **Bearbeiten Sie die Datei direkt.** Artefakte sind einfaches Markdown im Ordner `openspec/changes/<name>/`. Öffnen Sie `proposal.md`, `design.md`, `tasks.md` oder eine Delta-Spezifikation unter `specs/` in Ihrem Editor und ändern Sie sie. Nichts weiter ist erforderlich.

2. **Bitten Sie Ihre KI, sie zu überarbeiten.** Sagen Sie im Chat einfach, was Sie möchten: "Aktualisiere den Vorschlag, um die Caching-Idee zu entfernen und einen Rate-Limit-Abschnitt hinzuzufügen" oder "Das Design sollte eine Warteschlange verwenden, kein Polling." Die KI bearbeitet das Artefakt für Sie und verwendet den Rest der Änderung als Kontext.

Verwenden Sie die Option, die zum jeweiligen Moment passt. Kleine Wortlautanpassung? Bearbeiten Sie die Datei. Grundlegende Überarbeitung? Lassen Sie die KI mit vollem Kontext überarbeiten.

## "Wie aktualisiere ich den Vorschlag (oder die Spezifikationen), nachdem ich begonnen habe?"

Aktualisieren Sie ihn einfach. Dieselbe Änderung, verfeinert.

Wenn Sie die erweiterten Befehle verwenden, ist der natürliche Ablauf: Bearbeiten Sie das Artefakt, führen Sie dann `/opsx:continue` aus, um vom neuen Zustand aus weiterzuarbeiten, oder `/opsx:apply`, um die Implementierung entsprechend dem aktualisierten Plan fortzusetzen. Wenn Sie die Standard-`core`-Befehle verwenden, bearbeiten Sie das Artefakt und führen Sie `/opsx:apply` aus; es liest die aktuellen Dateien, also baut es auf dem auf, was die Artefakte jetzt sagen.

Das mentale Modell: Artefakte sind der aktuelle Plan, kein unterzeichneter Vertrag. Die KI arbeitet immer von ihrem aktuellen Inhalt aus, also lenken Sie die Arbeit, indem Sie sie bearbeiten.

```text
You: I want to change the approach in this change.

You: [edit design.md, or tell the AI:]
     Update design.md to use a background job instead of a synchronous call.

AI:  Updated design.md. The task list still fits; want me to continue applying?

You: /opsx:apply
```

Das beantwortet eine sehr häufige Frage: Es gibt keinen separaten Befehl zum "Aktualisieren des Vorschlags", weil Sie keinen benötigen. Die Datei ist die Quelle der Wahrheit, und das Bearbeiten (von Hand oder über die KI) ist die Aktualisierung.

## "Wie gehe ich nach der Implementierung zurück zur Überprüfung?"

Sie müssen nicht "zurückgehen", weil Sie nie weg waren. Der Workflow ist flüssig: Überprüfung, Bearbeitung und Implementierung sind keine sequenziellen Phasen, in denen Sie gefangen sind.

Konkret nach einiger `/opsx:apply`-Arbeit:
- Sie möchten den Plan nochmal durchgehen? Öffnen Sie die Artefakte und lesen Sie sie, oder führen Sie `openspec show <change>` in Ihrem Terminal aus, um eine zusammengefasste Ansicht zu erhalten.
- Haben Sie etwas gefunden, das Sie ändern möchten? Bearbeiten Sie das Artefakt (oder bitten Sie die KI darum) und fahren Sie dann fort.
- Sie möchten eine strukturierte Prüfung, ob der Code dem Plan entspricht? Führen Sie `/opsx:verify` aus (erweiterter Befehl). Es meldet Vollständigkeit, Korrektheit und Kohärenz, ohne etwas zu blockieren. Siehe [Workflows: Überprüfen](workflows.md#verify-check-your-work).

Es gibt keine "Überprüfungsphase", zu der Sie zurückkehren müssen, weil Sie die Überprüfung jederzeit durchführen können, auch nach der Implementierung.

## "Ich habe den Code von Hand bearbeitet. Wie bringe ich das mit OpenSpec in Einklang?"

Das passiert ständig und ist kein Problem. Sie haben etwas in Ihrem Editor angepasst, und jetzt stimmen Code und Artefakte nicht mehr überein. Bringen Sie sie in die Richtung in Einklang, die der Wahrheit entspricht:
- **Der Code ist jetzt korrekt, die Spezifikation ist veraltet.** Aktualisieren Sie die Delta-Spezifikation (und ggf. die Aufgaben), um das Verhalten zu beschreiben, das Sie tatsächlich ausgeliefert haben. Die Spezifikation sollte der Realität entsprechen, bevor Sie sie archivieren, da beim Archivieren die Spezifikation in Ihre Quelle der Wahrheit zusammengeführt wird.
- **Die Spezifikation ist korrekt, der Code ist abgewichen.** Bauen oder reparieren Sie weiter, bis der Code der Spezifikation entspricht.

Ein schneller Weg, um Abweichungen aufzudecken, ist `/opsx:verify`: Es liest Ihre Artefakte und Ihren Code und sagt Ihnen, wo sie voneinander abweichen. Betrachten Sie seine Ausgabe als To-Do-Liste für den Abgleich, und archivieren Sie, sobald sie übereinstimmen.

Das Prinzip: Zum Zeitpunkt der Archivierung werden Ihre Spezifikationen zur verbindlichen Wahrheit. Machen Sie die Spezifikationen also vor der Archivierung ehrlich darüber, was der Code tut. Manuelle Bearbeitungen sind willkommen; lassen Sie sie nur nicht stillschweigend die Spezifikation desynchronisieren.

## Verfeinern eines Vorschlags, mit dem Sie nicht zufrieden sind

Wenn ein generierter Vorschlag daneben liegt, haben Sie drei gute Optionen:
- **Iterieren Sie an Ort und Stelle.** Sagen Sie der KI, was falsch ist ("der Umfang ist zu groß, entferne die Admin-Funktionen") und lassen Sie sie überarbeiten. Am günstigsten und meistens richtig.
- **Erkunden Sie zuerst, dann schlagen Sie neu vor.** Wenn das Problem darin besteht, dass die Idee selbst unklar ist, gehen Sie zurück zu `/opsx:explore`, denken Sie sie durch und lassen Sie einen schärferen Vorschlag daraus entstehen. Siehe [Erkunden Sie zuerst](explore.md).
- **Fangen Sie neu an.** Wenn die Absicht grundlegend geändert hat, kann eine neue Änderung klarer sein als das Patchen der alten.

Diese letzte Option hat ihre eigene Entscheidungshilfe, weiter unten.

## Wann aktualisieren und wann eine neue Änderung starten

Kurze Version: **Aktualisieren Sie, wenn es sich um dieselbe verfeinerte Arbeit handelt; starten Sie neu, wenn die Absicht grundlegend geändert hat oder der Umfang zu unterschiedlicher Arbeit explodiert ist.**

- Gleiches Ziel, besserer Ansatz? Aktualisieren.
- Umfangsverkleinerung (MVP jetzt ausliefern, mehr später)? Aktualisieren, dann archivieren, dann eine neue Änderung für Phase zwei.
- Das Problem selbst hat sich geändert ("dunklen Modus hinzufügen" wurde zu "ein vollständiges Theming-System erstellen")? Neue Änderung.

Es gibt ein vollständiges Flussdiagramm und ausgearbeitete Beispiele in [Workflows: Wann aktualisieren vs. neu anfangen](workflows.md#when-to-update-vs-start-fresh) und eine ausführlichere Behandlung in [OPSX: Wann aktualisieren vs. neu anfangen](opsx.md#when-to-update-vs-start-fresh).

## Ein Hinweis zu Aufgaben

`tasks.md` ist eine lebendige Checkliste, kein eingefrorener Plan. Während der Implementierung können Sie entdeckte Aufgaben hinzufügen, nicht benötigte entfernen oder neu anordnen. Die KI hakt Elemente ab, wenn sie sie während `/opsx:apply` abschließt, und setzt bei der ersten nicht abgehakten Aufgabe fort, wenn Sie später zurückkommen. Das Bearbeiten der Liste während des laufenden Betriebs ist vorgesehen.

## Wo es weitergeht

- [Arbeitsabläufe](workflows.md) - Muster plus die Entscheidungshilfe Aktualisieren vs. Neu
- [Überprüfen einer Änderung](reviewing-changes.md) - der zweiminütige Durchgang eines Plans, bevor Sie ihn implementieren
- [Erkunden Sie zuerst](explore.md) - der Ort, zu dem Sie zurückkehren, wenn eine Idee neu durchdacht werden muss
- [Befehle](commands.md) - `/opsx:continue`, `/opsx:apply` und `/opsx:verify` im Detail
- [Konzepte: Artefakte](concepts.md#artifacts) - wofür jedes Artefakt gedacht ist