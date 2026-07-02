# Kernkonzepte auf einen Blick

**OpenSpec ist eine leichtgewichtigte Abstimmungsschicht zwischen Ihnen und Ihrer KI.** Sie schreiben fest, was eine Änderung tun soll; die KI entwirft die Details, beide betrachten denselben Plan, und erst dann wird Code geschrieben. Diese Seite stellt das gesamte mentale Modell auf einem Bildschirm dar. Wenn Sie die ausführliche Version wünschen, finden Sie diese in [Concepts](concepts.md).

Hier ist die gesamte Idee in fünf Worten: **Zuerst einigen, dann selbstbewusst bauen.**

## Die fünf Ideen

Alles in OpenSpec basiert auf fünf Konzepten. Lernen Sie diese und der Rest ist Detail.

**1. Specs sind die Wahrheit.** Eine Spec beschreibt, wie Ihr System *im Moment* funktioniert. Sie lebt in `openspec/specs/`, organisiert nach Domäne (`auth/`, `payments/`, `ui/`). Specs bestehen aus Anforderungen ("das System SHALL Sitzungen nach 30 Minuten ablaufen lassen") und Szenarien (konkrete gegeben/wenn/dann-Beispiele). Betrachten Sie Specs als die einzige vereinbarte Antwort auf die Frage: „Was tut diese Software?“

**2. Eine Änderung ist eine Arbeitseinheit.** Wenn Sie Verhalten hinzufügen, ändern oder entfernen möchten, erstellen Sie eine Änderung: ein Ordner in `openspec/changes/`, der alles über diese Arbeit an einem Ort sammelt. Ein Vorschlag, ein Design, eine Aufgabenliste und die Spec-Änderungen. Eine Änderung, ein Ordner, eine Funktion.

**3. Delta Specs beschreiben, was sich ändert, nicht die ganze Welt.** Innerhalb einer Änderung schreiben Sie nicht die gesamte Spec neu. Sie verfassen ein kleines Delta: `ADDED` diese Anforderung, `MODIFIED` diese, `REMOVED` diese andere. Das ist der Trick, der OpenSpec gut darin macht, bestehende Systeme zu bearbeiten und nicht nur Neuentwicklungen. Sie beschreiben den Diff, nicht das Ziel.

**4. Artefakte bauen aufeinander auf.** Eine Änderung enthält einige Dokumente, die in einer natürlichen Reihenfolge erstellt werden und sich gegenseitig speisen:

```text
proposal ──► specs ──► design ──► tasks ──► implement
   warum    was       wie       schritte      machen
```

Sie können jederzeit auf eines davon zurückgreifen. Sie sind Ermöglicher, keine Hürden. (Mehr dazu unten.)

**5. Archivierung fängt die Änderung in der Wahrheit ein.** Wenn die Arbeit erledigt ist, archivieren Sie die Änderung. Ihre Delta Specs werden in die Haupt-Specs integriert, und der Änderungsordner wird mit einem Datumsstempel nach `changes/archive/` verschoben. Jetzt beschreiben Ihre Specs die neue Realität, und Sie sind bereit für die nächste Änderung. Der Zyklus schließt sich.

## Das Bild

```text
┌─────────────────────────────────────────────────────────────────┐
│                          openspec/                              │
│                                                                 │
│   ┌──────────────────┐         ┌──────────────────────────┐    │
│   │     specs/       │         │        changes/          │    │
│   │                  │ ◄─────  │                          │    │
│   │ Quelle der Wahrheit │  Merge  │ Ein Ordner pro Änderung  │    │
│   │ wie Dinge funktionieren │  auf     │ proposal · design ·      │    │
│   │ heute            │ archive │ tasks · delta specs      │    │
│   └──────────────────┘         └──────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Zwei Ordner. `specs/` ist die Wahrheit. `changes/` ist das, was Sie vorschlagen. Die Archivierung verschiebt einen Vorschlag in die Wahrheit.

## Der Loop, den Sie tatsächlich durchlaufen werden

In der Standardkonfiguration sieht Ihr Tag so aus. Denken Sie optional zuerst darüber nach; dann entwirft ein Befehl den Plan, Sie lesen ihn und passen ihn an, das nächste baut ihn, und das letzte speichert die Dateien ab.

```text
/opsx:explore                   →  (optional) Zuerst mit der KI durchdenken
/opsx:propose add-dark-mode     →  KI entwirft Vorschlag, Specs, Design, Aufgaben
        (Sie lesen und passen den Plan an)
/opsx:apply                     →  KI baut es und prüft die Aufgaben ab
/opsx:archive                   →  Specs aktualisiert, Änderung archiviert
```

**Im Zweifel fallend, beginnen Sie mit der Erkundung.** `/opsx:explore` ist ein Denkpartner ohne Risiko: Er liest Ihren Code, skizziert Optionen und verwandelt eine vage Idee in einen konkreten Plan, bevor irgendein Artefakt existiert. Es ist das beste Gegenmittel gegen eine KI, die sonst *irgendetwas* aus einem vagen Prompt bauen würde. Wissen Sie bereits genau, was Sie wollen? Springen Sie direkt zu `/opsx:propose`. Auf jeden Fall führt Explore im Standardprofil mit, also es ist immer da. Sehen Sie den [Explore Guide](explore.md).

Dies sind Slash-Befehle, die in Ihrem KI-Assistenten eingegeben werden. Die Einrichtung (`openspec init`) erfolgt in Ihrer Konsole. Wenn dieser Schnitt für Sie neu ist, lesen Sie zuerst [How Commands Work](how-commands-work.md); dies ist der häufigste Punkt der Verwirrung.

## „Ermöglicher, keine Hürde“

Dieser Satz taucht überall in OpenSpec auf, daher hier seine Bedeutung in einfachen Worten.

Alte Spezifikationsprozesse sind Wasserfälle: Beenden Sie die Planung und *dann* dürfen Sie implementieren; zurückzukehren ist schmerzhaft. OpenSpec lehnt das ab. Die Reihenfolge `proposal → specs → design → tasks` zeigt, was als Nächstes *möglich* wird, nicht was Sie als Nächstes *gezwungen* sind zu tun.

Entdecken Sie während der Implementierung, dass das Design falsch war? Bearbeiten Sie `design.md` und machen Sie weiter. Stellen Sie fest, dass der Umfang reduziert werden sollte? Aktualisieren Sie den Vorschlag. Nichts blockiert. Die Abhängigkeiten existieren nur, damit die KI den Kontext hat, den sie braucht (Sie können keine guten Aufgaben schreiben, ohne Specs als Grundlage zu haben), nicht um Sie einzuschränken.

Die Stärke liegt hier in der Ehrlichkeit: Echte Arbeit ist unordentlich und iterativ, und OpenSpec erlaubt das. Der Kompromiss ist Disziplin: Da nichts Sie vorantreibt, liegt es an Ihnen, eine Änderung fokussiert zu halten, anstatt sie ausuattern zu lassen. Der [Workflows Guide](workflows.md) enthält gute Gewohnheiten dafür.

## Warum sich der kleine Mehraufwand lohnt

Die einfache Wahrheit ist: OpenSpec fügt einen Schritt hinzu. Sie schreiben einen kurzen Plan, bevor Sie bauen. Was bekommen Sie dafür?

- **Sie fangen falsche Richtungen ab, bevor sie Ihnen Kosten verursachen.** Ein Missverständnis in einem einseitigen Vorschlag zu korrigieren, ist kostenlos. Es nach dem KI 400 Zeilen geschrieben hat, nicht.
- **Der Plan und der Code bleiben im selben Repo.** Sechs Monate später sagt Ihnen die Spec (und die nächste KI-Sitzung), warum das System so funktioniert, wie es tut.
- **Änderungen sind überprüfbar.** Ein Änderungsordner ist ein ordentliches Paket: Lesen Sie den Vorschlag, überfliegen Sie die Deltas, prüfen Sie die Aufgaben. Keine Archäologie durch Chatverlauf.
- **Es passt zu bestehenden Codebasen.** Deltas bedeuten, dass Sie eine Änderung an einer 50.000 Zeilen großen App spezifizieren können, ohne zuerst das Ganze zu dokumentieren.

Und der ehrliche Kompromiss: Für eine wirklich triviale Einzeilige Korrektur zahlt sich die Zeremonie möglicherweise nicht aus, und das ist in Ordnung. OpenSpec ist darauf ausgelegt, leichtgewichtig zu sein, aber es ist nicht kostenlos. Verwenden Sie es dort, wo die Abstimmung wichtig ist – was sich herausstellt, dass dies bei der Arbeit mit einer KI, die selbstbewusst *irgendetwas* bauen wird, was Sie vage angefordert haben, meistens der Fall ist.

## Wohin geht's als Nächstes

- Sind Sie neu hier? [Getting Started](getting-started.md) führt durch die erste Änderung im Detail.
- Wissen Sie noch nicht, was Sie bauen sollen? [Explore First](explore.md) ist der richtige Ort, um anzufangen.
- Sind Sie verwirrt, wo Befehle laufen? [How Commands Work](how-commands-work.md).
- Wollen Sie die tiefere Version von allem oben Genannten? [Concepts](concepts.md).
- Lernen Sie am Beispiel? [Examples & Recipes](examples.md).
- Benötigen Sie einen Begriff definiert? [Glossary](glossary.md).