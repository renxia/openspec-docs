# Überprüfung einer Änderung

Das gesamte Versprechen von OpenSpec ist, dass du und deine KI **euch einig seid, was gebaut werden soll, bevor überhaupt Code geschrieben wird.** Diese Einigung zählt nur, wenn du tatsächlich liest, was die KI entworfen hat. Diese Seite handelt von den zwei Minuten, in denen du das tust – was du öffnest, in welcher Reihenfolge und worauf du achten solltest.

Die Wette ist einfach: Einen falschen Weg in einem einabsätzigen Plan zu erkennen, ist fast kostenlos. Den gleichen falschen Weg in 300 Zeilen Code zu erkennen, ist das nicht. Die Überprüfung ist der Punkt, an dem du diese Wette einlöst.

## Die beiden Momente der Überprüfung

Es gibt genau zwei:

```
/opsx:propose ──► REVIEW THE PLAN ──► /opsx:apply ──► REVIEW THE CODE ──► /opsx:archive
                  (before any code)                    (/opsx:verify)
```

1. **Nach `/opsx:propose`** (oder `/opsx:ff`), vor `/opsx:apply` – lies den Plan, solange er noch nur aus Wörtern besteht.
2. **Nach dem Bauen**, mit `/opsx:verify` – prüfe, ob der Code tatsächlich das gemacht hat, was der Plan vorsah.

Die erste Überprüfung spart dir am meisten, und die, die die meisten überspringen. Diese Seite verbringt den größten Teil der Zeit damit.

## Lies es in dieser Reihenfolge

Eine Änderung ist ein Ordner mit reinem Markdown unter `openspec/changes/<name>/`. Lies die Dateien in der Reihenfolge, in der du am frühesten aufhören kannst, wenn etwas falsch ist:

```
openspec/changes/add-dark-mode/
├── proposal.md      1. die Absicht und der Umfang   ← wenn das falsch ist, hör hier auf
├── specs/…/spec.md  2. die Anforderungen       ← das Herzstück der Überprüfung
├── design.md        (nur für größere Änderungen) — der technische Ansatz
└── tasks.md         3. der Arbeitsplan
```

Du musst nicht jede Zeile lesen. Du musst drei Fragen beantworten, eine pro Datei.

## Der Vorschlag: Ist das das richtige Problem?

Öffne zuerst `proposal.md`. Es erfasst das "Warum" und das "Was" – die Absicht, den Umfang, den Ansatz in einem oder zwei Absätzen.

**Was gut aussieht:** eine klare Absicht, ein Umfang, den du wiedererkennst, und ein Grund, warum es sich lohnt, das jetzt zu tun.

**Rote Flaggen:**

- Es löst ein leicht *anderes* Problem als das, das du angefordert hast.
- Der Umfang ist gewachsen – du hast nach einem Themenumschalter gefragt und der Vorschlag berührt auch die Authentifizierung "wo wir schon mal dabei sind".
- Es ist vage. "Verbessere die Einstellungsseite" ist kein Umfang; "füge einen Dunkelmodus-Umschalter hinzu, der die Betriebssystemeinstellung berücksichtigt" schon.

**Die Frage, die du beantworten musst:** *Passt das zu dem, was ich tatsächlich angefordert habe, und schleicht sich etwas Unerwünschtes ein?* Wenn die Antwort nein ist, hör auf – lies nicht weiter, korrigiere den Vorschlag (siehe [Gegenstimmen sind günstig](#gegenstimmen-sind-guenstig)).

## Die Spezifikationsänderungen: Ist "fertig" korrekt definiert?

Das ist das Herzstück der Überprüfung. Die Delta-Spezifikationen unter `specs/` sagen, was wahr sein wird, wenn die Änderung ausgeliefert wird – als Anforderungen und die Szenarien, die sie beweisen:

```markdown
## ADDED Requirements

### Requirement: Dark Mode Toggle
The system SHALL let a user switch between light and dark themes.

#### Scenario: Respects the OS preference on first load
- GIVEN a user who has never set a theme
- WHEN they open the app on a device set to dark mode
- THEN the app renders in dark mode
```

**Was eine gute Anforderung ausmacht:** eine klare `SHALL`/`MUSS`-Aussage, die du einem Tester geben könntest, und mindestens ein Szenario, dessen GIVEN/WHEN/THEN diese Aussage tatsächlich prüft.

**Rote Flaggen:**

- **Eine vage Anforderung.** "The system SHALL be fast" kann nicht gebaut oder getestet werden. Was ist schnell?
- **Eine Anforderung ohne Szenario**, oder ein Szenario, das die Anforderung, unter der es steht, nicht prüft.
- **Der wertvollste Fang überhaupt: Was fehlt.** Die KI schreibt gewissenhaft auf, was du *gesagt* hast. Deine Aufgabe ist es, zu bemerken, was du *vergessen* hast zu sagen. Wenn dir der OS-Präferenzfall am wichtigsten war und kein Szenario ihn erwähnt, hat sich die Überprüfung bereits gelohnt.

Lies die Änderungen mit der Frage: *Wäre ich zufrieden, wenn das System genau – und nur – das tut?* Hier geht es noch nicht um Code, also ist es billig, es zu ändern.

## Die Aufgaben: Ist der Arbeitsplan sinnvoll?

Öffne zuletzt `tasks.md`. Es ist die Implementierungscheckliste, die die KI abarbeitet.

**Was gut aussieht:** geordnete Schritte, jeder nachvollziehbar einer Anforderung zugeordnet, nichts Rätselhaftes.

**Rote Flaggen:**

- Eine Aufgabe ohne zugehörige Anforderung (woher kommt die?).
- Eine einzige große Aufgabe "implementiere die Funktion", die alle wirklichen Entscheidungen verbirgt.
- Eine Aufgabe, die etwas außerhalb des Umfangs berührt, den du gerade genehmigt hast.

Du schätzt hier nichts oder mikromanagest nicht – du prüfst nur, dass der Plan zu den Anforderungen passt, die du bereits akzeptiert hast.

## Gegenstimmen sind günstig

Wenn eine der drei Fragen falsch beantwortet wurde, sag es. Es gibt keine Phasen und nichts ist gesperrt – du korrigierst es und machst weiter. Zwei Wege, genau wie in [Bearbeiten einer Änderung](editing-changes.md):

- **Bearbeite die Datei selbst.** Es ist reines Markdown; ändere die Umfangszeile, präzisiere eine Anforderung, lösche eine Aufgabe.
- **Sag der KI, was falsch ist** und lass sie überarbeiten: *"lass die Authentifizierungsänderungen weg – außerhalb des Umfangs"*, *"füge ein Szenario hinzu, wenn der Benutzer bereits ein Thema ausgewählt hat"*, *"teile Aufgabe 3 in Schema und UI auf"*.

Dann lies den Teil, den du geändert hast, nochmal. Entwerfe neu, bis es ein Plan ist, für den du geradestehst. Dieses Hin und Her *ist* das funktionierende Produkt.

## Nach dem Code: Überprüfung

Sobald die Arbeit gebaut ist, ist `/opsx:verify` deine zweite Überprüfung. Sie liest die Artefakte und den Code nochmal und meldet Abweichungen in drei Dimensionen:

| Dimension | Was es prüft |
|-----------|--------------|
| **Vollständigkeit** | Jede Aufgabe erledigt, jede Anforderung implementiert, Szenarien abgedeckt |
| **Korrektheit** | Die Implementierung entspricht der Absicht der Spezifikation, Randfälle berücksichtigt |
| **Kohärenz** | Designentscheidungen zeigen sich tatsächlich im Code |

```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Respects the OS preference on first load" has no test coverage
```

Es markiert Probleme als CRITICAL, WARNING oder SUGGESTION, und es *blockiert* das Archivieren nicht – es macht die Lücken sichtbar und überlässt dir die Entscheidung. Das ist der Unterschied zwischen "hat die KI Code geschrieben" und "hat sie das gebaut, was wir vereinbart haben".

`/opsx:verify` ist im erweiterten Profil enthalten. Wenn du es nicht hast, schalte es mit `openspec config profile` ein (danach `openspec update`), oder lies die Änderung und den Diff einfach selbst nochmal durch.

## Maßgeschneiderte Überprüfung

Nicht jede Änderung verdient den vollen Durchlauf. Eine Ein-Datei-Tippfehlerkorrektur verdient einen zwanzigsekündigen Überblick. Eine Änderung, die Authentifizierung, Zahlungen oder nicht wiederherstellbare Daten berührt, verdient jede der oben genannten Fragen. Der Punkt war nie Zeremonie – es geht darum, deine Aufmerksamkeit dort einzusetzen, wo ein Fehler teuer wäre, und zu überfliegen, wo er es nicht wäre.

## Die Zwei-Minuten-Checkliste

- [ ] Die Absicht des Vorschlags passt zu dem, was ich angefordert habe.
- [ ] Nichts Unerwünschtes ist in den Umfang eingeschlichen.
- [ ] Jede Anforderung ist spezifisch genug, um getestet zu werden.
- [ ] Jede Anforderung hat ein Szenario, das sie tatsächlich prüft.
- [ ] Der Fall, der mir am wichtigsten ist, ist abgedeckt.
- [ ] Aufgaben sind Anforderungen zugeordnet; nichts ist rätselhaft oder außerhalb des Umfangs.
- [ ] Ich wäre damit einverstanden, wenn die KI genau das und nichts weiter baut.

Wenn alle sieben Punkte passen, führe `/opsx:apply` mit Zuversicht aus. Wenn einer fehlschlägt, ist das kein Rückschlag – es sind die zwei Minuten, die ihre Arbeit tun.

## Wo es weitergeht

- [Gute Spezifikationen schreiben](writing-specs.md) — die andere Seite: wie du Anforderungen und Szenarien entwirfst, die es wert sind, genehmigt zu werden.
- [Bearbeiten & Iterieren einer Änderung](editing-changes.md) — die Mechanik, einen Plan zu ändern, nachdem du angefangen hast.
- [Workflows](workflows.md) — wo die Überprüfung in den größeren Ablauf passt.