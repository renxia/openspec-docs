# Erforschen (Explore)

**`/opsx:explore` ist Ihr Denkpartner.** Greifen Sie zu ihm, wann immer Sie ein Problem haben, aber noch keinen Plan. Er untersucht Ihre Codebasis, erwägt Optionen mit Ihnen und klärt, was Sie wirklich wollen – und das alles, bevor ein einziges Artefakt oder eine Zeile Code erstellt wird. Wenn das Bild klar ist, übergibt er die Verantwortung an `/opsx:propose`.

Wenn Sie aus diesen Dokumentationen eine Gewohnheit übernehmen möchten, dann diese: **Seien Sie unsicher, erkunden Sie, bevor Sie vorschlagen.**

Hier ist der Grund, warum das wichtig ist. KI-Codierungsassistenten sind eifrig. Stellen Sie vage Fragen, und sie werden selbstbewusst *etwas* erstellen – vielleicht aber nicht genau das, was Sie brauchten. Explore ist die Heilung dafür. Es ist ein risikofreies Gespräch, in dem Sie und die KI gemeinsam die richtige Vorgehensweise herausfinden, sodass Sie beim Vorschlag das Richtige vorschlagen.

## Wann sollte man erkunden (Explore)?

Explore ist oft der richtige erste Schritt – öfter als die Leute annehmen. Verwenden Sie es, wenn eines dieser zutrifft:

- Sie kennen das *Problem*, aber nicht die *Lösung*. ("Die Seiten fühlen sich langsam an." "Auth ist ein Chaos." "Wir erhalten ständig doppelte Bestellungen.")
- Sie wählen zwischen Ansätzen und möchten die Kompromisse (Tradeoffs) gegen Ihren tatsächlichen Code abwägen.
- Sie sind neu in einer Codebasis und müssen verstehen, wie etwas funktioniert, bevor Sie es ändern.
- Die Anforderungen sind vage, und Sie möchten sie schärfen, bevor Sie sich festlegen.
- Sie vermuten, dass die Arbeit größer oder kleiner ist als sie scheint, und möchten den Umfang ehrlich einschätzen (scope).

Lassen Sie Explore überspringen, wenn Sie genau wissen, was Sie wollen und wie es geht. In diesem Fall gehen Sie direkt zu [`/opsx:propose`](commands.md#opsxpropose).

## Was es tut (und was nicht)

Explore ist ein **Gespräch**, kein Generator.

**Es tut:**
- Liest und durchsucht Ihre Codebasis, um reale Fragen zu beantworten.
- Vergleicht Optionen und benennt die Kompromisse jeder Option.
- Erstellt Diagramme, um das Design lesbar zu machen.
- Hilft Ihnen dabei, eine vage Idee in einen konkreten, realisierbaren Umfang einzugrenzen.
- Übergibt an `/opsx:propose`, wenn Sie bereit sind.

**Es tut nicht:**
- Erstellt einen Änderungsordner (change folder).
- Verfasst Artefakte (kein Vorschlag, keine Spezifikationen, kein Design oder Aufgaben).
- Schreibt oder ändert Code.

Das ist der Sinn der Sache. Das Erkunden kostet Sie nichts und bindet Sie an nichts. Sie können drei Sackgassen erkunden, von jeder etwas lernen und dann den Weg vorschlagen, der überlebt hat.

## Es ist bereits installiert

Gute Nachrichten: `/opsx:explore` wird im Standardprofil **core** mitgeliefert, direkt neben `propose`, `apply`, `sync` und `archive`. Sie müssen nichts aktivieren. Wenn OpenSpec in Ihrem Projekt eingerichtet ist, ist Explore in Ihrem KI-Chat bereit. (Wie bei allen `/opsx:*`-Befehlen geben Sie ihn in den Chat Ihres Assistenten ein, nicht in das Terminal. Sehen Sie [Wie Befehle funktionieren](how-commands-work.md).)

## Ein vollständiges Beispiel

Sehen Sie, wie eine vage Sorge zu einer präzisen, realisierbaren Änderung wird.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Our checkout sometimes creates duplicate orders. I don't know why
     and I don't know how to fix it safely.

AI:  Let me dig into the checkout path...
     [reads the order service, the payment webhook handler, and the
      client submit logic]

     Here's what I found. There are two ways a duplicate can happen:

     1. The client can submit twice (double-click, retry on slow network).
        Nothing debounces it.
     2. The payment webhook can fire more than once, and the handler
        creates an order each time. There's no idempotency key.

     Cause #2 is the dangerous one: it can charge and fulfill twice.

     Three ways to fix it, roughly in order of robustness:
     - Idempotency key on the order-creation endpoint (handles both causes)
     - Dedup on the webhook by payment-intent id (handles #2 only)
     - Client-side debounce (handles #1 only, papers over the real bug)

     Given your code already stores the payment-intent id, the
     idempotency-key approach is a small change with the biggest payoff.
     Want me to scope that?

You: Yes, let's do the idempotency key.

You: /opsx:propose add-order-idempotency-key

AI:  Created openspec/changes/add-order-idempotency-key/, with a proposal
     and delta spec grounded in what we just found. Ready for implementation.
```

Beachten Sie, was passiert ist. Der Ausgangspunkt war "etwas stimmt nicht und ich habe Angst, es anzufassen". Zwanzig Sekunden der Erkundung haben dies zu einer benannten Grundursache, drei eingestuften Optionen, eine Empfehlung, die an den bestehenden Code gekoppelt ist, und eine präzise Änderung verwandelt. Der anschließende Vorschlag ist scharf, weil das Denken zuerst stattfand.

## Übergabe an Propose

Explore archiviert nichts in irgendetwas. Wenn Sie bereit sind, starten Sie einfach eine Änderung, und die KI übernimmt den Kontext aus Ihrem Gespräch in die Artefakte.

```text
explore  ──►  propose  ──►  apply  ──►  archive
 (think)     (agree)       (build)     (record)
```

Sie können es in natürlicher Sprache sagen ("lassen wir dies zu einer Änderung werden") oder direkt `/opsx:propose <name>` ausführen. Auf beiden Wegen wird die von Ihnen durchgeführte Erkundung zur Grundlage des Vorschlags und nicht zu einem Wegwerfgespräch.

Wenn Sie den erweiterten Befehlsatz verwenden, kann Explore stattdessen an `/opsx:new` übergeben werden, für eine schrittweise Erstellung der Artefakte. Sehen Sie [Workflows](workflows.md).

## Tipps für eine gute Erkundung

- **Bringen Sie das Problem mit, nicht die Lösung.** "Logins fühlen sich langsam an" gibt der KI Raum zur Untersuchung. "Fügen Sie einen Redis Cache hinzu" bindet Sie bereits an eine Antwort, die Sie noch nicht getestet haben.
- **Fragen Sie nach den Kompromissen laut.** "Was sind die Nachteile jeder Option?" bringt Ihnen einen ehrlicheren Vergleich.
- **Lassen Sie sie zuerst lesen.** Die besten Erkundungen beginnen damit, dass die KI tatsächlich Ihren Code ansieht und nicht ratet. Zeigen Sie ihr den relevanten Bereich, wenn dies hilft.
- **Es ist in Ordnung, abzubrechen (bail).** Wenn die Erkundung zeigt, dass die Idee keinen Aufwand wert ist, ist das ein Gewinn. Sie haben es günstig gelernt.
- **Erforschen Sie erneut während der Änderung.** Stecken Sie bei `/opsx:apply` fest? Sie können einen Schritt zurücktreten und ein Unterproblem erkunden, bevor Sie fortfahren.

## Die ehrlichen Kompromisse (Tradeoffs)

**Was Sie gewinnen:** Explore fängt falsche Wendungen zum kostengünstigsten Zeitpunkt ab, bevor irgendein Artefakt existiert. Es ist besonders mächtig bei unbekanntem Code, wo die Fähigkeit der KI, das System zu lesen und zusammenzufassen, Ihnen einen Nachmittag des Grabenlesens erspart.

**Was es kostet:** Ein wenig Geduld. Explore ist ein Gespräch, daher ist es langsamer als das Ausführen von `/opsx:propose` und hoffen. Für Arbeit, die Sie bereits wirklich verstehen, ist dieser zusätzliche Schritt reiner Overhead, und Sie sollten ihn überspringen.

Die Faustregel: Je vager die Aufgabe, desto mehr zahlt sich Explore aus. Je klarer die Aufgabe, desto mehr können Sie direkt mit dem Vorschlagen beginnen.

## Wohin Sie als Nächstes gehen können

- [Befehle: `/opsx:explore`](commands.md#opsxexplore): Die präzise Referenz
- [Workflows](workflows.md): Explore als Teil der täglichen Schleife
- [Beispiele und Rezepte](examples.md#recipe-3-exploring-before-you-commit): Explore in einer vollständigen Durchsicht
- [Erste Schritte (Getting Started)](getting-started.md): Der Leitfaden für die erste Änderung, einschließlich Exploration