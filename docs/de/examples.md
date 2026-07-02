# Beispiele und Anleitungen (Recipes)

Reale Änderungen, von Anfang bis Ende. Jede Anleitung zeigt die Befehle, die Sie eingeben würden, und was Sie zurückbekämen, sodass Sie Ihre Situation einem Muster zuordnen und es kopieren können. Diese verwenden die Standardbefehle **core** (`propose`, `explore`, `apply`, `sync`, `archive`); falls ein erweiterter Satz hilfreich ist, wird dies vermerkt.

Eine Erinnerung, bevor Sie beginnen: Slash-Befehle wie `/opsx:propose` geben Sie in den **Chat Ihres KI-Assistenten** ein, und `openspec`-Befehle geben Sie in Ihr **Terminal** ein. Falls das neu für Sie ist, lesen Sie zuerst [Wie Befehle funktionieren](how-commands-work.md). In den Transkripten unten sind `You:` und `AI:` der Chat, und Zeilen, die mit `$` beginnen, sind das Terminal.

> **Sind Sie sich noch nicht sicher, was Sie bauen?** Die meisten dieser Anleitungen sind schärfer, wenn Sie mit `/opsx:explore` beginnen, um es zuerst durchzudenken. [Anleitung 3](#recipe-3-exploring-before-you-commit) zeigt dies in Aktion, und der Leitfaden [Zuerst erkunden (Explore First)](explore.md) gibt die volle Begründung.

## Anleitung 1: Ein kleines Feature, der schnelle Weg

**Wann verwenden:** Sie wissen, was Sie wollen, und es ist ein abgegrenztes Stück Arbeit. Dies ist die häufigste Anleitung.

Das Ganze besteht aus drei Befehlen. Propose, bauen, archivieren.

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

Lesen Sie nun den Plan. Öffnen Sie den Vorschlag und die Delta-Spezifikation. Dies ist der Moment, für den OpenSpec gemacht wurde: das Erfassen einer falschen Annahme, solange sie noch ein Absatz und keine 400 Zeilen Code ist. Bearbeiten Sie direkt jedes Artefakt, falls etwas nicht stimmt, und fahren Sie fort.

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

Das war's. Das Logout-Verhalten ist nun Teil Ihrer Spezifikationen, und die Änderung ist mit ihrem vollen Kontext abgelegt.

## Anleitung 2: Ein Bugfix

**Wann verwenden:** Etwas ist kaputt, und Sie möchten den Fix als bewusste Änderung des Verhaltens und nicht als mysteriösen Commit festhalten.

Bugfixes funktionieren genau wie Features. Der Unterschied liegt darin, wie Sie den Vorschlag formulieren: beschreiben Sie das *korrekte* Verhalten, nicht nur „beheben Sie den Bug“.

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

Da der Fix als `MODIFIED` Anforderung mit einem frischen Szenario landet, sieht die nächste Person (oder die nächste KI-Sitzung) nicht nur, dass Sie es behoben haben, sondern auch, was „korrekt“ bedeutet. Dann `/opsx:apply` und `/opsx:archive` wie gewohnt.

Tipp: Für einen Fix ist ein gutes Szenario der Regressionstest in Prosa. „GEBEN einem abgemeldeten Benutzer, WENN er gültige Anmeldedaten eingibt, DANN landet er auf dem Dashboard und wird nicht erneut umgeleitet.“ Schreiben Sie das, und die Implementierung hat ein klares Ziel.

## Anleitung 3: Erkunden vor dem Commit

**Wann verwenden:** Sie haben ein Problem, aber noch keinen Plan. Sie sind sich nicht sicher, was Sie bauen sollen oder welche Vorgehensweise richtig ist.

Beginnen Sie mit `/opsx:explore`. Es ist ein Denkpartner ohne Struktur und ohne erstellte Artefakte. Es liest Ihren Codebase und hilft Ihnen bei der Entscheidung.

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

Die Erkundung klärt Ihr Denken *bevor* Sie dafür eine Änderung aufwenden. Wenn die Einsicht kristallisiert ist, schlagen Sie vor, und die KI trägt den Kontext weiter.

## Anleitung 4: Zwei Änderungen gleichzeitig jonglieren

**Wann verwenden:** Sie sind mitten in einem Feature, und ein dringender Fix springt an die Reihe.

Änderungen sind unabhängige Ordner, daher gibt es keine Konflikte bei paralleler Arbeit. Starten Sie den Fix, liefern Sie ihn aus, kehren Sie dann zu dem Feature zurück, genau dort, wo Sie aufgehört haben.

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

Die Benennung der Änderung in `/opsx:apply add-dark-mode` ist die Art, wie Sie die KI auf eine bestimmte Änderung hinweisen, wenn mehrere aktiv sind. Da Aufgaben den Abschluss in `tasks.md` verfolgen, weiß die KI genau, wo Sie aufgehört haben.

Wenn mehrere Änderungen gleichzeitig abgeschlossen werden, archiviert der erweiterte `/opsx:bulk-archive` sie zusammen und löst Spezifikationskonflikte, indem er prüft, was tatsächlich implementiert wurde. Sehen Sie sich [Workflows](workflows.md#parallel-changes) an.

## Anleitung 5: Ein Refactor ohne Verhaltensänderung

**Wann verwenden:** Sie strukturieren Code um, und das extern sichtbare Verhalten soll identisch bleiben.

Dies ist der interessante Fall, da ein reiner Refactoring *nichts zu Ihren Spezifikationen hinzufügt*. Der Verpflichtungsvertrag ändert sich nicht; nur die Implementierung tut dies. Daher lebt die Arbeit im Design und in den Aufgaben, und das Spec Delta ist leer oder fehlt.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

Wenn Sie eine Änderung archivieren, die die Spezifikationen nicht berührt, können Sie dem Terminalbefehl sagen, den Spec-Schritt zu überspringen:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

Das gleiche Flag ist nützlich für Tooling, CI und Docs-only-Änderungen. Das Prinzip: Spezifikationen beschreiben das Verhalten, daher sollte die Spezifikation nicht geändert werden, wenn sich das Verhalten nicht ändert. Sehen Sie sich [Konzepte](concepts.md#what-a-spec-is-and-is-not) an.

## Anleitung 6: Schrittweise Kontrolle (erweiterte Befehle)

**Wann verwenden:** Eine komplexe oder riskante Änderung, bei der Sie jede Artefakt durchgehen möchten, bevor Sie fortfahren.

Der Kernbefehl `/opsx:propose` entwirft alles auf einmal. Wenn Sie lieber schrittweise vorgehen möchten, aktivieren Sie die erweiterten Befehle:

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

Jetzt können Sie inkrementell Scaffolding erstellen und bauen:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

Überprüfen Sie jedes Artefakt, wenn es erstellt wird, bearbeiten Sie frei und fahren Sie fort, wenn Sie zufrieden sind. Wenn Sie möchten, dass der Rest in einem Rutsch fertiggestellt wird, fährt `/opsx:ff` (fast-forward) durch die verbleibenden Planungsartefakte. Bevor Sie archivieren, prüft `/opsx:verify`, ob die Implementierung tatsächlich mit den Spezifikationen übereinstimmt. Sehen Sie sich [Workflows](workflows.md#opsxff-vs-opsxcontinue) an.

## Anleitung 7: Den gesamten Loop praktisch lernen

**Wann verwenden:** Sie haben OpenSpec installiert und möchten den Workflow an Ihrem eigenen Code *fühlen*, nicht an einem Spielzeugbeispiel.

Aktivieren Sie die erweiterten Befehle (siehe Anleitung 6), dann:

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` findet eine echte (kleine) Verbesserung, erstellt eine Änderung dafür, implementiert sie und archiviert sie, wobei es jeden Schritt narrativ erklärt. Es dauert 15 bis 30 Minuten und hinterlässt Ihnen eine reale Änderung, die Sie behalten oder verwerfen können. Es ist die sanfteste Art zu lernen. Sehen Sie sich [Befehle](commands.md#opsxonboard) an.

## Ihre Arbeit im Terminal überprüfen

Jederzeit können Sie aus Ihrem Terminal den Zustand der Dinge inspizieren:

```bash
$ openspec list                      # active changes
$ openspec show add-dark-mode        # one change in detail
$ openspec validate add-dark-mode    # check structure
$ openspec view                      # interactive dashboard
```

Dies sind Prüf- und Inspektionstools. Das Vorschlagen und Bauen geschieht weiterhin über Slash-Befehle im Chat. Die vollständige Dokumentation finden Sie im [CLI-Referenz](cli.md).

## Wohin geht es als Nächstes

- [Zuerst erkunden (Explore First)](explore.md): die empfohlene Art, zu beginnen, wenn Sie unsicher sind
- [Workflows](workflows.md): die oben genannten Muster mit Entscheidungsleitfaden, wann welches verwendet werden soll
- [Befehle](commands.md): jeder Slash-Befehl im Detail
- [Erste Schritte (Getting Started)](getting-started.md): der kanonische Durchlauf für die erste Änderung
- [Konzepte](concepts.md): warum die Teile so zusammenpassen