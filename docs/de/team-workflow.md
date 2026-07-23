# OpenSpec in einem Team

Alles in den anderen Handbüchern funktioniert gleichermaßen, ob du alleine arbeitest oder in einem Team von zwanzig Personen. Was sich in einem Team ändert, sind die Randfragen: Wo liegen die Spezifikationen, wie reviewen Teammitglieder einen Plan und wie passt das alles in den Pull-Request-Workflow, den wir bereits haben?

Die kurze Antwort: Eine Änderung besteht nur aus Dateien, und OpenSpec greift niemals auf git zu. Es passt also in deinen bestehenden Workflow, statt ihn zu ersetzen. Auf dieser Seite werden die Konventionen erläutert, die sich bewährt haben.

## Eine Regel: OpenSpec greift nicht auf git zu

OpenSpec liest und schreibt einfaches Markdown im Ordner `openspec/`. Es committet, erstellt Branches, pusht oder pullt niemals in deinem Projekt – und es klont oder synchronisiert auch nie eigenständig einen [Store](stores-beta/user-guide.md). Das bedeutet:

- **Du committest `openspec/` wie jede andere Quelldatei.** Spezifikationen, aktive Änderungen und das Archiv sind Teil der Historie deines Projekts. (Ja, committe den gesamten Ordner – siehe die [FAQ](faq.md#should-i-commit-the-openspec-folder-to-git).)
- **Eine Änderung ist ein Ordner, den du wie Code versionierst.** `openspec/changes/add-dark-mode/` besteht nur aus Dateien in einem Branch.
- **Alles Folgende ist Konvention, keine Pflicht.** OpenSpec zwingt dich nicht, es so zu machen; es passt nur sauber.

## Der alltägliche Workflow

Der gut funktionierende Workflow ordnet eine Änderung einem Branch und einem Pull Request zu:

```
git switch -c add-dark-mode        starte einen Branch wie gewohnt
   │
/opsx:propose add-dark-mode        erstelle den Entwurf des Plans (Vorschlag + Spezifikationen + Aufgaben)
   │
PLAN REVIEWEN                    du liest ihn vor jedem Code – siehe Review von Änderungen
   │
/opsx:apply                        baue die Änderung; Artefakte und Codeänderungen entstehen gemeinsam
   │
git commit && open a PR            der PR enthält das Spezifikationsdelta UND den Code
   │
Teammitglieder reviewen, mergen
   │
/opsx:archive                      fasse die Deltas in specs/ zusammen, verschiebe die Änderung in das Archiv/
```

Plan und Code liegen nebeneinander im gleichen Branch, also reviewen deine Teammitglieder beide gemeinsam, und sechs Monate später erklärt die archivierte Spezifikation immer noch, warum der Code so aussieht, wie er aussieht.

## Review von Spezifikationen in einem Pull Request

Hier merkt ein Team den Nutzen erst richtig. Wenn ein PR das Delta-Spezifikation der Änderung enthält, erhält der Reviewer etwas, was ein reines Diff ihm nie gibt: **eine Erklärung in einfacher Sprache, was diese Änderung tun soll**, bevor er auch nur eine Zeile Code liest.

Eine gute Review-Reihenfolge für den Reviewer:
1. **Lese `proposal.md`** – handelt es sich um das richtige Problem und den richtigen Umfang?
2. **Lese das Delta unter `specs/`** – ist "fertig" korrekt definiert? (Dies ist der [Review von Änderungen](reviewing-changes.md) Zwei-Minuten-Durchlauf, der jetzt im PR stattfindet.)
3. **Lies dann das Code-Diff** – erfüllt es genau diese Anforderungen?

Ein Reviewer, der mit dem *Ansatz* nicht einverstanden ist, kann dies kostengünstig am Vorschlag äußern, statt es über 300 Zeilen Code neu zu verhandeln. Platziere die Delta-Spezifikation oben in der PR-Beschreibung oder verweise Reviewer auf den Änderungsordner, sodass sie dort anfangen.

## Wann archivieren

Beim Archivieren werden die Deltas einer Änderung in dein Haupt-`openspec/specs/` übernommen und der Änderungsordner nach `openspec/changes/archive/YYYY-MM-DD-<name>/` verschoben. Da `specs/` die **gemeinsame Wahrheitsquelle** ist, ist der Zeitpunkt in einem Team wichtig. Zwei praktikable Konventionen:
- **Archiviere nach dem Merge des PRs (empfohlen).** Der Branch enthält die aktive Änderung; sobald sie in deinen Haupt-Branch gemergt wurde, archivierst du dort (oft ein kleiner Folge-Commit oder eine geplante Bereinigung). Dadurch aktualisiert sich die gemeinsame `specs/` nur mit Arbeit, die tatsächlich ausgeliefert wurde.
- **Archiviere innerhalb des PRs.** Einfacher für kleine Teams: Der gleiche PR, der den Code hinzufügt, synchronisiert und archiviert auch. Der Nachteil ist, dass dein `specs/`-Diff und dein Code-Diff gemeinsam landen, was den PR lauter machen kann.

Wähle eine Variante und bleib konsistent. In beiden Fällen prüft `/opsx:archive`, ob Aufgaben abgeschlossen sind, und bietet zuerst eine Synchronisation an, sodass nichts aus Versehen nur halb fertig gemergt wird.

## Zwei Personen, parallele Änderungen

Da Änderungen separate Ordner sind, kollidieren sie nicht:
- **Verschiedene Änderungen, verschiedene Personen – kein Problem.** `add-dark-mode` und `rate-limit-login` sind verschiedene Ordner auf verschiedenen Branches; sie berühren sich nie, bis beide archiviert werden.
- **Eine Änderung, ein Besitzer.** Wenn zwei Personen den gleichen Änderungsordner bearbeiten, entsteht genau der gleiche Konflikt wie bei zwei Personen, die die gleiche Datei bearbeiten. Weise einer Änderung nur einen einzigen Autor zu oder teile sie in zwei Änderungen auf (ein weiterer Grund, die Änderung [richtig zu dimensionieren](writing-specs.md#right-size-the-change)).
- **Der einzige Ort, an dem Konflikte auftauchen, ist `specs/`.** Wenn zwei Änderungen die gleiche Anforderung modifizieren, führt das Archivieren der zweiten zu einem Konflikt in `openspec/specs/…/spec.md` – löse ihn wie jeden Merge-Konflikt, indem du die Anforderung behältst, die der Realität entspricht. Das ist selten und sogar ein Feature: Git sagt dir damit, dass zwei Änderungen unterschiedlicher Meinung darüber waren, wie das System sich verhalten soll.

## Wenn die Planung einen einzelnen Repo übersteigt

Alles oben geht davon aus, dass der Plan im eigenen `openspec/`-Ordner des Code-Repos liegt, was die richtige Standardeinstellung ist. Wenn deine Planung tatsächlich mehrere Repos oder Teams umfasst – also ein Feature drei Dienste berührt oder Anforderungen, die ein Team besitzt und andere nutzen –, ist das genau für die Beta-Funktion **Stores** gedacht: Die Planung erhält ein eigenes Repo, auf das jedes Code-Repo verweisen kann. Fang mit dem [Stores-Benutzerhandbuch](stores-beta/user-guide.md) an.

## Wo es weitergeht

- [Review von Änderungen](reviewing-changes.md) – der Review-Durchlauf, jetzt direkt in deinem PR.
- [Gute Spezifikationen schreiben](writing-specs.md) – inklusive wie du eine Änderung richtig dimensionierst, sodass sie in einen Branch passt.
- [Stores-Benutzerhandbuch](stores-beta/user-guide.md) – Planung, die Repos und Teams umspannt.