# Beispiele & Rezepte

Echte Änderungen, von Anfang bis Ende. Jedes Rezept zeigt die Befehle, die Sie eingeben würden, und die zugehörigen Ausgaben, sodass Sie Ihre Situation einem Muster zuordnen und es übernehmen können. Diese Rezepte verwenden die standardmäßigen **Kernbefehle** (`propose`, `explore`, `apply`, `sync`, `archive`); falls das erweiterte Befehlsset hilfreich ist, wird dies entsprechend vermerkt.

Eine Erinnerung, bevor Sie beginnen: Schrägstrichbefehle wie `/opsx:propose` geben Sie im **Chat Ihres KI-Assistenten** ein, und `openspec`-Befehle führen Sie in Ihrem **Terminal** aus. Wenn das neu für Sie ist, lesen Sie zuerst [How Commands Work](how-commands-work.md). In den unten stehenden Transkripten steht `You:` für den Chat und Zeilen, die mit `$` beginnen, für das Terminal.

> **Sie wissen noch nicht genau, was Sie entwickeln möchten?** Die meisten dieser Rezepte sind effektiver, wenn Sie zuerst mit `/opsx:explore` beginnen, um die Sache durchzudenken. [Rezept 3](#recipe-3-exploring-before-you-commit) zeigt dies in der Praxis, und der Leitfaden [Explore First](explore.md) erläutert die vollständige Begründung.

## Rezept 1: Eine kleine Funktion, der schnelle Weg

**Wann Sie es verwenden:** Sie wissen genau, was Sie möchten, und es handelt sich um einen abgegrenzten Arbeitsaufwand. Dies ist das häufigste Rezept.

Das Ganze besteht aus drei Befehlen: Vorschlagen, Implementieren, Archivieren.

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

Lesen Sie nun den Plan. Öffnen Sie den Vorschlag und die Delta-Spezifikation. Genau für diesen Moment ist OpenSpec entwickelt worden: Einen falschen Annahme zu erkennen, solange sie noch ein Absatz ist und nicht 400 Zeilen Code umfasst. Bearbeiten Sie alle Artefakte direkt, falls etwas nicht stimmt, und fahren Sie dann fort.

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Add logout button to header
     ✓ 1.2 Clear session on click
     ✓ 1.3 Add confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  Archiving add-logout-button...
     ✓ Merged specs into openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2026-06-22-add-logout-button/
     Done. Ready for the next change.
```

Das war's. Das Abmeldeverhalten ist nun Teil Ihrer Spezifikationen, und die Änderung wurde mit ihrem vollständigen Kontext abgelegt.

## Rezept 2: Ein Fehlerbehebung

**Wann Sie es verwenden:** Etwas ist defekt und Sie möchten, dass die Fehlerbehebung als bewusste Verhaltensänderung und nicht als mysteriöser Commit erfasst wird.

Fehlerbehebungen funktionieren genau wie Funktionen. Der Unterschied liegt in der Formulierung des Vorschlags: Beschreiben Sie das *korrekte* Verhalten, nicht nur "fix the bug".

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

Da die Fehlerbehebung als `MODIFIED`-Anforderung mit einem neuen Szenario eingereicht wird, sieht die nächste Person (oder die nächste KI-Sitzung) nicht nur, dass Sie den Fehler behoben haben, sondern auch, was "korrekt" bedeutet. Führen Sie danach wie gewohnt `/opsx:apply` und `/opsx:archive` aus.

Tipp: Für eine Fehlerbehebung ist ein gutes Szenario der Regressionstest in Prosa. "GIVEN a logged-out user, WHEN they submit valid credentials, THEN they land on the dashboard and are not redirected again." Schreiben Sie das auf, dann hat die Implementierung ein klares Ziel.

## Rezept 3: Erkunden, bevor Sie sich festlegen

**Wann Sie es verwenden:** Sie haben ein Problem, aber noch keinen Plan. Sie sind sich nicht sicher, was Sie entwickeln sollen oder welcher Ansatz der richtige ist.

Beginnen Sie mit `/opsx:explore`. Es ist ein Denkpartner ohne vorgegebene Struktur, der keine Artefakte erstellt. Es liest Ihre Codebasis und hilft Ihnen bei der Entscheidungsfindung.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Page loads feel slow but I don't know where the time goes.

AI:  Let me look... I found three likely culprits:
     1. Large unoptimized images on the product list
     2. Synchronous data fetching that blocks render
     3. Re-renders triggered by context changes
     Which should we tackle first?

You: The data fetching one.

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation.
```

Die Erkundung klärt Ihre Gedanken, *bevor* Sie eine Änderung dafür aufwenden. Wenn die Erkenntnis kristallisiert ist, erstellen Sie einen Vorschlag, und die KI übernimmt den Kontext.

## Rezept 4: Gleichzeitige Bearbeitung von zwei Änderungen

**Wann Sie es verwenden:** Sie sind mitten in der Implementierung einer Funktion und eine dringende Fehlerbehebung springt in der Warteschlange nach vorne.

Änderungen sind in unabhängigen Ordnern gespeichert, sodass parallele Arbeit keine Konflikte verursacht. Beginnen Sie mit der Fehlerbehebung, schließen Sie sie ab und kehren Sie dann genau an der Stelle zur Funktion zurück, an der Sie aufgehört haben.

```text
You: I'm partway through add-dark-mode, but I need to fix a login bug now.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Ready for implementation.

You: /opsx:apply

AI:  Implemented the fix. All tasks complete.

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect.

You: Back to dark mode.

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode. Picking up at task 2.3: Update Header...
```

Durch die Angabe des Änderungsnamens in `/opsx:apply add-dark-mode` weisen Sie die KI auf eine bestimmte Änderung hin, wenn mehrere gleichzeitig aktiv sind. Da Aufgaben den Fertigstellungsstatus in `tasks.md` verfolgen, weiß die KI genau, an welcher Stelle Sie aufgehört haben.

Wenn mehrere Änderungen gleichzeitig abgeschlossen werden, archiviert der erweiterte Befehl `/opsx:bulk-archive` sie gemeinsam und löst Spezifikationskonflikte auf, indem er prüft, was tatsächlich implementiert ist. Siehe [Workflows](workflows.md#parallel-changes).

## Rezept 5: Ein Refactoring ohne Verhaltensänderung

**Wann Sie es verwenden:** Sie strukturieren Code um, und das extern sichtbare Verhalten soll identisch bleiben.

Dies ist der interessante Fall, da ein reines Refactoring *nichts zu Ihren Spezifikationen hinzuzufügen* hat. Der Verhaltensvertrag ändert sich nicht, nur die Implementierung. Die Arbeit liegt also im Design und in den Aufgaben, und das Spezifikationsdelta ist leer oder nicht vorhanden.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

Deklarieren Sie das leere Delta explizit, indem Sie `skip_specs: true` in der `.openspec.yaml` der Änderung festlegen:

```yaml
schema: spec-driven
skip_specs: true
```

Ohne diese Markierung lehnt `openspec validate` eine Änderung mit null Deltas ab (sodass eine vergessene Spezifikationsphase trotzdem erkannt wird); mit der Markierung besteht die Validierung und `openspec status` zeigt die Spezifikationsphase als explizit übersprungen und nicht als ausstehend an. Wenn sich das Refactoring nachträglich doch als verhaltensändernd herausstellt, entfernen Sie `skip_specs` aus der `.openspec.yaml` und schreiben Sie die Delta-Spezifikationen – die Validierung behandelt die Markierung zusammen mit Spezifikationsdateien als Konflikt, sodass eine veraltete Markierung nicht stillschweigend bestehen bleiben kann.

Das Archivieren einer markierten Änderung erfordert keine zusätzlichen Flags (es gibt keine zusammenzuführenden Deltas). Unabhängig davon weist das Flag `--skip-specs` den Terminalbefehl an, den Spezifikationsschritt explizit zu überspringen:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

Dasselbe Flag ist praktisch für Tooling, CI und dokumentationsbezogene Änderungen. Das Prinzip: Spezifikationen beschreiben Verhalten, also sollte sich die Spezifikation auch nicht ändern, wenn sich das Verhalten nicht geändert hat. Siehe [Concepts](concepts.md#what-a-spec-is-and-is-not).

## Rezept 6: Schrittweise Steuerung (erweiterte Befehle)

**Wann Sie es verwenden:** Eine komplexe oder riskante Änderung, bei der Sie jedes Artefakt prüfen möchten, bevor Sie fortfahren.

Der Kernbefehl `/opsx:propose` erstellt alle Entwürfe auf einmal. Wenn Sie lieber Schritt für Schritt vorgehen möchten, aktivieren Sie die erweiterten Befehle:

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

Nun können Sie das Gerüst schrittweise erstellen und die Implementierung vorantreiben:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

Prüfen Sie jedes Artefakt, sobald es erstellt ist, bearbeiten Sie es frei und fahren Sie fort, wenn Sie zufrieden sind. Wenn Sie den Rest der Entwürfe in einem Zug erstellen möchten, springt `/opsx:ff` durch die verbleibenden Planungsartefakte. Vor dem Archivieren prüft `/opsx:verify`, ob die Implementierung tatsächlich mit den Spezifikationen übereinstimmt. Siehe [Workflows](workflows.md#opsxff-vs-opsxcontinue).

## Rezept 7: Den gesamten Ablauf praktisch lernen

**Wann Sie es verwenden:** Sie haben OpenSpec installiert und möchten den Ablauf an Ihrem eigenen Code *erleben*, nicht an einem Beispiel ohne praktischen Bezug.

Aktivieren Sie die erweiterten Befehle (siehe Rezept 6) und führen Sie dann Folgendes aus:

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` findet eine echte (kleine) Verbesserung, erstellt eine Änderung dafür, implementiert sie und archiviert sie, wobei jeder Schritt erläutert wird. Es dauert 15 bis 30 Minuten und hinterlässt eine echte Änderung, die Sie behalten oder verwerfen können. Es ist der schonendste Weg, den Ablauf zu lernen. Siehe [Commands](commands.md#opsxonboard).

## Überprüfen Ihrer Arbeit über das Terminal

Sie können jederzeit über Ihr Terminal den Status von Elementen überprüfen:

```bash
$ openspec list                      # active changes
$ openspec show add-dark-mode        # one change in detail
$ openspec validate add-dark-mode    # check structure
$ openspec view                      # interactive dashboard
```

Dies sind Lese- und Überprüfungswerkzeuge. Das Erstellen von Vorschlägen und die Implementierung erfolgen weiterhin über Schrägstrichbefehle im Chat. Vollständige Details finden Sie in der [CLI-Referenz](cli.md).

## Weiterführende Informationen

- [Explore First](explore.md): Der empfohlene Einstieg, wenn Sie sich unsicher sind
- [Workflows](workflows.md): Die oben genannten Muster mit Entscheidungshilfen zur Verwendung der einzelnen Rezepte
- [Commands](commands.md): Alle Schrägstrichbefehle im Detail
- [Getting Started](getting-started.md): Der standardmäßige Walkthrough für die erste Änderung
- [Concepts](concepts.md): Die Begründung, warum die einzelnen Komponenten genau auf diese Weise zusammenspielen