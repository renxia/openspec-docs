# Gute Spezifikationen schreiben

Selten schreibst du eine Spezifikation von Grund auf neu. Du beschreibst eine Änderung in einfacher Sprache, `/opsx:propose` erstellt den ersten Entwurf der Anforderungen und Szenarien, und dann verfeinerst du sie. Diese Seite handelt von genau diesem letzten Schritt – was „gut“ bedeutet und wie du die KI darauf ausrichtest.

Sie ist die Ergänzung zu [Änderungen prüfen](reviewing-changes.md): Prüfen bedeutet, die Schwachstellen in einem Entwurf zu finden, Schreiben bedeutet, zu wissen, woraus eine starke Spezifikation besteht.

## Eine Spezifikation beschreibt Verhalten, kein Code

Eine Spezifikation beschreibt, was dein System *tut*, in einer Weise, die jeder überprüfen kann – nicht, wie es implementiert ist. Sie besteht aus **Anforderungen** (Verhaltensaussagen) und **Szenarien** (konkreten Beispielen, die diese nachweisen).

```markdown
### Requirement: Session Timeout
The system SHALL expire a session after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass with no activity
- THEN the session is invalidated and the user must re-authenticate
```

Behalte das *Wie* – die Warteschlange, die Bibliothek, das Tabellenschema – in `design.md` oder im Code. Wenn Verhalten und Implementierung in einer Anforderung vermischt werden, ist die Anforderung nicht mehr testbar und wird in dem Moment veraltet, in dem sich der Code ändert.

## Was eine gute Anforderung ausmacht

Eine gute Anforderung beschreibt genau ein Verhalten, so klar formuliert, dass du sie an eine andere Person zum Testen weitergeben könntest.

- **Eine Aussage, ein `SHALL`/`MUST`.** Wenn eine Anforderung drei „und auch“-Klauseln hat, handelt es sich eigentlich um drei Anforderungen. Teile sie auf.
- **Beobachtbar.** Jemand, der nicht am Code beteiligt ist, sollte in der Lage sein zu erkennen, ob die Anforderung erfüllt ist. „Das System SHALL eine Fehleranzeige anzeigen, wenn der Upload 10 MB überschreitet“ ist beobachtbar. „Das System SHALL große Uploads anmutig verarbeiten“ ist es nicht.
- **Die richtige Stärke.** OpenSpec verwendet die Schlüsselwörter aus RFC 2119, die jeweils unterschiedliche Bedeutungen haben:

  | Schlüsselwort | Bedeutung |
  |---------|---------|
  | `MUST` / `SHALL` | Eine zwingende Anforderung. Nicht verhandelbar. |
  | `SHOULD` | Eine starke Empfehlung, bei der eine begründete Ausnahme möglich ist. |
  | `MAY` | Wirklich optional. |

  Greife standardmäßig auf `MUST`/`SHALL` zurück. Verwende `SHOULD` nur, wenn du wirklich „es sei denn, es gibt einen guten Grund dagegen“ meinst.

Der Test für eine Anforderung lautet: *Könnte ein Tester, der noch nie den Code gesehen hat, erkennen, ob die Anforderung erfüllt ist?* Wenn nicht, muss sie geschärft werden.

## Was ein gutes Szenario ausmacht

Szenarien sind der Teil, in dem eine Anforderung ihren Nutzen beweist. Jedes ist ein konkretes GIVEN / WHEN / THEN, das zu einem automatisierten Test werden könnte.

- **Es prüft seine zugehörige Anforderung.** Ein Szenario, das die Anforderung nur mit anderen Worten wiederholt, testet nichts. Mache es zu einer konkreten Situation mit einem konkreten Ergebnis.
- **Decke die relevanten Fälle ab, nicht nur den Happy Path.** Die erfolgreiche Anmeldung ist einfach. Die leere Eingabe, das abgelaufene Token, der zweite Klick, der Fall, der schiefgeht – dort lauern Fehler, und dort ist ein Szenario am wertvollsten.
- **Nenne den Fall in der Überschrift.** „Szenario: Lehnt ein abgelaufenes Token ab“ verrät einem Prüfer auf einen Blick, was abgedeckt ist; „Szenario: Test 2“ nicht.

Eine nützliche Gewohnheit: Frage vor der Genehmigung *Welchen Fall würde ich am meisten ärgern, wenn er kaputt geht?* – und stelle sicher, dass ein Szenario ihn abdeckt.

## Wähle die richtige Art von Delta

Eine Änderung beschreibt ihre Anpassungen an den Spezifikationen mit drei Abschnittstypen. Die Verwendung des richtigen Typs hält deine archivierten Spezifikationen korrekt:

- **`## ADDED Requirements`** – völlig neues Verhalten, das vorher nicht existierte.
- **`## MODIFIED Requirements`** – Verhalten, das bereits existierte und geändert wird. Füge die vollständige neue Version hinzu; eine kurze Notiz zu den Änderungen hilft dem Prüfer.
- **`## REMOVED Requirements`** – Verhalten, das entfernt wird, mit einer Begründung.

Bei der Archivierung wird ADDED an die Hauptspezifikation angehängt, MODIFIED ersetzt die alte Version und REMOVED wird gelöscht. Wenn du eine echte Änderung als ADDED markierst, endest du mit zwei widersprüchlichen Anforderungen; wenn du neues Verhalten als MODIFIED beschreibst, gibt es nichts zu ersetzen. Wenn du dir unsicher bist, öffne die aktuelle Spezifikation und prüfe, ob die Anforderung bereits vorhanden ist.

## Wähle die richtige Größe für die Änderung

Der häufigste Fehler beim Erstellen von Spezifikationen ist keine schlecht formulierte Anforderung – sondern eine Änderung, die versucht, drei Änderungen auf einmal zu sein.

**Eine gute Änderung hat eine einzige Absicht, die du in einem Satz ausdrücken kannst.** „Füge einen Dunkelmodus-Schalter hinzu.“ „Führe ein Rate-Limit für den Anmeldeendpunkt ein.“ „Migriere Sitzungen weg von Cookies.“ Wenn du für die Beschreibung der Änderung viele „und auch“ brauchst, ist das ein Signal, sie aufzuteilen.

Anzeichen, dass eine Änderung zu groß ist:
- Der Umfang des Vorschlags liest sich wie eine Liste von unzusammenhängenden Funktionen.
- Die Prüfung würde einen ganzen Nachmittag dauern, also wird es niemand machen.
- Zwei Personen könnten nicht gleichzeitig daran arbeiten, ohne sich gegenseitig zu behindern.
- Die Hälfte der Aufgaben könnte für sich allein ausgeliefert werden.

Kleinere Änderungen sind einfacher zu prüfen, einfacher in einer konzentrierten Arbeitssitzung umzusetzen und einfacher nachvollziehbar, wenn sechs Monate später nur noch das Archiv übrig ist. Du kannst immer mehrere Änderungen parallel ausführen – siehe [Bearbeiten & Iterieren](editing-changes.md) und [Workflows](workflows.md).

Das Gegenteil kommt auch vor: Eine einzeilige Tippfehlerkorrektur braucht keine drei Anforderungen und ein Designdokument. Passe den Aufwand an die Bedeutung der Änderung an.

## So lenkst du die KI zu einem guten Entwurf

Da `/opsx:propose` den ersten Entwurf erstellt, hängt die Qualität des Ergebnisses direkt von der Qualität deiner Eingabe ab. Du musst Anforderungen nicht von Hand schreiben – du musst die KI nur richtig ausrichten:

- **Nenne die Absicht und die Grenzen.** *„Füge einen Dunkelmodus-Schalter hinzu, der beim ersten Laden die Einstellung des Betriebssystems übernimmt – greife nicht auf die vorhandene Theme-API zu.“* Der nicht im Rahmen liegende Teil ist genauso wichtig wie der im Rahmen liegende.
- **Nenne die Fälle, die dir wichtig sind.** *„Stelle sicher, dass es ein Szenario für einen Benutzer gibt, der bereits manuell ein Theme ausgewählt hat.“* Die KI deckt das ab, worauf du hinweist.
- **Verfeinere dann.** Es ist einfaches Markdown. Schärfe ein vages `SHALL`, lösche ein Szenario, das nichts testet, füge den Fall hinzu, den es verpasst hat – oder bitte die KI darum: *„Die Timeout-Anforderung ist vage, lege sie auf 30 Minuten fest.“*

Entwerfen, schärfen, wiederholen. Ein paar Runden davon ergeben eine Spezifikation, der du vertraust – das ist der ganze Sinn.

## Eine kurze Checkliste

- [ ] Jede Anforderung beschreibt ein einziges beobachtbares Verhalten mit einem `SHALL`/`MUST`.
- [ ] Keine Implementierungsdetails sind in den Anforderungen fest verankert.
- [ ] Jede Anforderung hat mindestens ein Szenario, das sie tatsächlich prüft.
- [ ] Die wichtigen Rand- und Fehlerfälle haben Szenarien, nicht nur der Happy Path.
- [ ] Deltas verwenden ADDED / MODIFIED / REMOVED korrekt gegenüber der aktuellen Spezifikation.
- [ ] Die gesamte Änderung hat eine einzige Absicht, die du in einem Satz ausdrücken kannst.

## Weiterführende Inhalte

- [Änderungen prüfen](reviewing-changes.md) – der zweiminütige Durchgang, der Fehler aufdeckt, die durchgerutscht sind.
- [Konzepte](concepts.md) – das tiefergehende Modell hinter Spezifikationen, Änderungen und Deltas.
- [Beispiele & Rezepte](examples.md) – echte Änderungen von Anfang bis Ende.