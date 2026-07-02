# OpenSpec in einem bestehenden Projekt verwenden

**Sie dokumentieren nicht Ihre gesamte Codebasis von Anfang an. Sie schreiben Spezifikationen nur für das, was Sie ändern wollen.** Das ist die wichtigste Sache, die Sie über die Einführung von OpenSpec in ein bestehendes Projekt wissen müssen, und deshalb wurde OpenSpec mit dem Ansatz des Brownfield-First entwickelt.

Eine häufige Sorge lautet: „Meine App ist 80.000 Zeilen alt. Muss ich vorher Spezifikationen für alles schreiben, bevor OpenSpec nützlich wird?“ Nein. Das würden Sie genauso hassen wie wir. OpenSpec erweitert Ihre Spezifikationen Stück für Stück bei jeder Änderung. Ihre erste Änderung dokumentiert den Teil, den sie berührt; die nächste Änderung dokumentiert ihren Teil, und im Laufe der Monate füllen sich Ihre Spezifikationen natürlich um die Arbeit, die Sie tatsächlich leisten.

Dieser Leitfaden zeigt, wie Sie von Tag eins an beginnen können, ohne das Ganze auf einmal erledigen zu wollen.

## Die dreißig-sekunden-Version

```bash
$ cd your-existing-project
$ openspec init          # adds openspec/ and your AI tool's commands
```

Danach in Ihrem KI-Chat:

```text
/opsx:explore            # optional: lassen Sie die KI den Bereich lesen, den Sie ansprechen werden
/opsx:propose <a real, small change you actually need>
/opsx:apply
/opsx:archive
```

Ihre Spezifikationen beschreiben nun genau den Teil des Systems, der von der Änderung berührt wurde – und nichts mehr. Das ist richtig. Sie müssen sich keine Sorgen um die anderen 80.000 Zeilen machen.

## Warum Delta-First der ganze Trick ist

OpenSpec-Änderungen werden als **Deltas** geschrieben: `ADDED`, `MODIFIED`, `REMOVED`. Ein Delta beschreibt, was im Verhältnis zum aktuellen Verhalten geändert wird, nicht das gesamte System.

Genau das braucht die Brownfield-Arbeit. Sie bauen selten von Grund auf. Sie fügen ein Feld hinzu, korrigieren eine Weiterleitung oder straffen einen Timeout. Ein Delta ermöglicht es Ihnen, diese eine Änderung präzise zu spezifizieren, ohne zuerst eine 40-seitige Spezifikation von allem drumherum schreiben zu müssen.

Ihr `openspec/specs/`-Verzeichnis beginnt also nicht voll und vollständig. Es beginnt fast leer und akkumuliert. Jede archivierte Änderung fügt ihr Delta hinzu. Die Spezifikation für `auth/` wird erst dann gründlich, nachdem Sie mehrere Auth-Änderungen vorgenommen haben – genau in dem Moment, in dem Sie sie gründlich haben möchten.

Wenn Sie die tieferen Mechanismen wissen möchten, siehe [Concepts: Delta Specs](concepts.md#delta-specs).

## Ihre erste Änderung an einer echten Codebasis

Wählen Sie etwas Kleines und Reales. Kein Spielzeug, keine Neugestaltung. Eine Änderung, die Sie ohnehin diese Woche vorhatten. Kleine Anfangsänderungen lehren Sie den Workflow bei geringem Risiko.

**Schritt 1: Lassen Sie die KI den relevanten Bereich lesen.** Hier ist `/opsx:explore` nützlich, wenn es um eine unbekannte oder große Codebasis geht. Zeigen Sie es auf den Teil, den Sie ansprechen wollen, und lassen Sie es abbilden, wie die Dinge funktionieren, bevor Sie etwas vorschlagen.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: I need to add rate limiting to our public API, but I'm not sure
     how requests currently flow through the middleware.

AI:  Let me trace it... [reads the router, middleware stack, and config]
     Requests hit Express, pass through auth middleware, then your
     controllers. There's no rate-limiting layer today. The cleanest
     insertion point is a middleware right after auth. Want me to scope it?
```

Beachten Sie, dass die KI nun Ihre tatsächliche Struktur versteht, sodass der von ihr geschriebene Vorschlag zu Ihrem Code und nicht zu einer generischen Vorlage passt. An einer großen Codebasis spart dieser eine kleine Gewohnheit die meisten Probleme. Sehen Sie [Explore First](explore.md).

**Schritt 2: Schlagen Sie die Änderung vor.** Der Vorschlag und seine Delta-Spezifikation erfassen nur diese eine Änderung.

```text
You: /opsx:propose add-api-rate-limiting
```

**Schritt 3: Erstellen und archivieren** mit `/opsx:apply` und `/opsx:archive`, genau wie bei jeder anderen Änderung. Nach dem Archivieren haben Sie eine echte Spezifikation für Ihr Rate Limiting Verhalten, die aus einer Änderung entstanden ist, die Sie ohnehin gebraucht hätten.

## Bevorzugen Sie eine geführte Tour? Verwenden Sie onboard

Wenn Sie lieber beobachten möchten, wie der gesamte Zyklus an Ihrem eigenen Code abläuft und das kommentiert wird, erledigt der erweiterte Befehl `/opsx:onboard` genau das: Er scannt Ihre Codebasis nach einer kleinen, sicheren Verbesserung und führt Sie dann durch den Vorschlag, die Erstellung und das Archivieren dieser Änderung und erklärt jeden Schritt.

Schalten Sie zuerst die erweiterten Befehle ein:

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

Danach im Chat:

```text
/opsx:onboard
```

Es ist die sanfteste mögliche Einführung in einem echten Projekt, und es hinterlässt Ihnen eine echte (kleine) Änderung, die Sie behalten oder verwerfen können. Sehen Sie [Commands: `/opsx:onboard`](commands.md#opsxonboard).

## „Aber ich habe bereits Anforderungsdokumente“

Vielleicht haben Sie ein PRD, ein SRS, eine formelle Spezifikation, sogar TLA+-Modelle. Gut. Sie importieren sie nicht vollständig und werfen sie auch nicht weg.

Behandeln Sie bestehende Dokumente als **Quellmaterial für die Exploration**, nicht als Spezifikationen zur Konvertierung. Wenn Sie eine Änderung beginnen, fügen Sie den relevanten Abschnitt ein oder zeigen Sie der KI darauf und lassen Sie ihr daraus ein fokussiertes OpenSpec Delta formen. Das Delta erfasst das Verhalten, das Sie jetzt ändern, in Form einer testbaren Anforderung und eines Szenarios von OpenSpec. Ihre ursprünglichen Dokumente bleiben als Hintergrund bestehen.

Der ehrliche Grund: OpenSpec-Spezifikationen sind absichtlich verhaltensorientiert und auf Änderungen ausgerichtet. Ein 40-seitiges PRD ist ein anderes Artefakt mit einer anderen Aufgabe. Eine erzwungene einmalige Massenkonvertierung neigt dazu, eine große, überholte Spezifikation zu erzeugen, der niemand vertraut. Das Wachstum der Spezifikationen aus echten Änderungen hält sie aktuell.

```text
You: /opsx:explore
You: Hier ist der Abschnitt unseres PRD zum Checkout. Ich implementiere die Anforderung
     „Guest Checkout“ als Nächstes.
     [paste the relevant requirement]
AI:  [reads it, asks clarifying questions, then helps scope a change]
You: /opsx:propose add-guest-checkout
```

## Spezifikationen in einer großen Codebasis organisieren

Spezifikationen leben unter `openspec/specs/`, gruppiert nach **Domäne**: einem logischen Bereich, der der der Art entspricht, wie Ihr Team an das System denkt. Sie müssen die gesamte Taxonomie nicht von Anfang an entwerfen. Erstellen Sie ein Domänenverzeichnis, wenn Ihre erste Änderung in diesem Bereich dies erfordert.

Häufige Arten zur Aufteilung von Domänen:

- **Nach Feature-Bereich:** `auth/`, `payments/`, `search/`
- **Nach Komponente:** `api/`, `frontend/`, `workers/`
- **Nach Bounded Context:** `ordering/`, `fulfillment/`, `inventory/`

Wählen Sie das, was einem Neuling zustimmt. Sie können es später verfeinern. Sehen Sie [Concepts: Specs](concepts.md#specs).

## Monorepos und Arbeit, die Repos überspannt

Für ein Monorepo ist das einfachste Modell ein `openspec/`-Verzeichnis im Stammverzeichnis des Repositories mit Domänen, die auf Ihre Pakete oder Services abgebildet werden. Das deckt die meisten Teams ab.

Wenn Ihre Arbeit tatsächlich **mehrere Repositories** (oder mehrere Pakete, die Sie als getrennt betrachtet haben) überspannt, verfügt OpenSpec über eine Beta-Funktion namens **Stores**: Die Planung lebt in einem eigenen, eigenständigen Repo, auf das alle Ihre Code-Repos referenzieren kann. So muss der Plan nicht im `openspec/`-Ordner eines Repositories leben. Es ist Beta, daher behandeln Sie seine Befehle und seinen Zustand als entwickelnd. Beginnen Sie mit dem [Stores User Guide](stores-beta/user-guide.md) für das mentale Modell und den kleinstmöglichen nützlichen Weg.

## Ein paar ehrliche Warnungen

- **Widerstehen Sie dem Drang, alles nachträglich zu füllen.** Spezifikationen für Code zu schreiben, den Sie nicht ändern, fühlt sich produktiv an und ist meistens das nicht. Diese Spezifikationen werden veraltet, weil nichts sie dazu zwingt, der Realität zu folgen. Lassen Sie echte Änderungen Ihre Spezifikationen antreiben.
- **Halten Sie die frühen Änderungen klein.** Ihre ersten paar Änderungen geht es genauso ums Lernen des Rhythmus wie um das Ausliefern. Ein enger definierter Umfang macht den Zyklus schnell und die Lektionen günstig.
- **Commiten Sie `openspec/` zu git.** Ihre Spezifikationen und Archive gehören in die Versionskontrolle zusammen mit dem Code, den sie beschreiben.
- **Geben Sie der KI Kontext.** Bei einer großen Codebasis mit starken Konventionen füllen Sie `openspec/config.yaml`s `context:` aus, damit jeder Vorschlag Ihren Stack und Ihre Muster respektiert. Sehen Sie [Customization](customization.md#project-configuration).

## Wohin geht es als Nächstes

- [Explore First](explore.md) – die Schlüsselgewohnheit, um Code zu verstehen, bevor man ihn ändert
- [Getting Started](getting-started.md) – der vollständige Durchlauf der ersten Änderung
- [Editing & Iterating on a Change](editing-changes.md) – eine Änderung anpassen, während man lernt
- [Concepts: Delta Specs](concepts.md#delta-specs) – warum Deltas die Brownfield-Arbeit sauber machen
- [Customization](customization.md) – lehren Sie OpenSpec die Konventionen Ihres Projekts