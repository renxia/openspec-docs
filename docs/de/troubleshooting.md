# Fehlerbehebung

Konkrete Lösungen für konkrete Probleme. Jeder Eintrag nennt ein Symptom, erklärt die wahrscheinliche Ursache in einem Satz und gibt Ihnen die Lösung. Wenn Sie Ihr Problem hier nicht finden, kann Ihnen die [FAQ](faq.md) helfen, und der [Discord](https://discord.gg/YctCnvvshC) wird es definitiv tun.

## Installation und Einrichtung

### `openspec: command not found`

Die CLI ist nicht installiert oder Ihre Shell kann sie nicht finden. Installieren Sie sie global und prüfen Sie dies:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Wenn sie installiert wurde, aber immer noch nicht gefunden wird, liegt wahrscheinlich das globale npm bin Verzeichnis nicht in Ihrem `PATH`. Führen Sie `npm bin -g` aus, um zu sehen, wo die globalen Binärdateien gespeichert sind, und stellen Sie sicher, dass dieser Pfad in Ihrem Shell-Profil enthalten ist.

### "Requires Node.js 20.19.0 or higher"

OpenSpec läuft auf Node 20.19.0+. Überprüfen Sie Ihre Version und aktualisieren Sie bei Bedarf:

```bash
node --version
```

Wenn Sie bun verwenden, um OpenSpec zu installieren, beachten Sie, dass OpenSpec weiterhin auf Node *läuft*, daher benötigen Sie unabhängig davon Node 20.19.0+ in Ihrem `PATH`. Sehen Sie sich [Installation](installation.md) an.

### `openspec init` hat mein KI-Tool nicht konfiguriert

Init fragt ab, welche Tools eingerichtet werden sollen. Wenn Sie Ihr Tool übersprungen haben oder ein weiteres hinzufügen möchten, führen Sie es einfach erneut aus oder verwenden Sie die nicht-interaktive Form:

```bash
openspec init --tools claude,cursor
```

Die vollständige Liste der Tool IDs finden Sie in [Supported Tools](supported-tools.md). Verwenden Sie `--tools all` für alles und `--tools none`, um die Tool-Einrichtung zu überspringen.

## Befehle werden nicht angezeigt

Wenn `/opsx:propose` (oder das Äquivalent Ihres Tools) nicht erscheint oder nichts tut, gehen Sie diese Liste durch. Sie sind nach der schnellsten Überprüfung geordnet.

1. **Sie befinden sich möglicherweise am falschen Ort.** Slash-Befehle gehören in den Chat Ihres KI-Assistenten und nicht in Ihr Terminal. Wenn Sie `/opsx:propose` in Ihre Shell eingegeben haben, ist das das Problem. Sehen Sie sich [How Commands Work](how-commands-work.md) an.

2. **Generieren Sie die Dateien neu.** Vom Stammverzeichnis Ihres Projekts:

   ```bash
   openspec update
   ```

   Dies schreibt die Skill- und Befehlsdateien für jedes konfigurierte Tool neu.

3. **Starten Sie Ihren Assistenten neu.** Die meisten Tools scannen beim Start nach Skills und Befehlen. Ein neues Fenster erledigt dies oft.

4. **Bestätigen Sie, dass die Dateien existieren.** Für Claude Code prüfen Sie, ob `.claude/skills/` die `openspec-*`-Ordner enthält. Andere Tools verwenden ihre eigenen Verzeichnisse, alle aufgelistet in [Supported Tools](supported-tools.md).

5. **Überprüfen Sie, ob Sie dieses Projekt initialisiert haben.** Skills werden pro Projekt geschrieben. Wenn Sie ein Repo geklontet oder den Ordner gewechselt haben, führen Sie `openspec init` (oder `openspec update`) dort aus.

6. **Bestätigen Sie, dass Ihr Tool Befehlsdateien unterstützt.** Einige Tools (Kimi CLI, Trae, ForgeCode, Mistral Vibe) erhalten keine generierten `opsx-*` Befehlsdateien; sie verwenden stattdessen skill-basierte Aufrufe. Die Formulare unterscheiden sich je nach Tool: siehe [Supported Tools](supported-tools.md) und [How Commands Work](how-commands-work.md#slash-command-syntax-by-tool).

## Arbeiten mit Änderungen

### "Change not found" (Änderung nicht gefunden)

Der Befehl konnte nicht sagen, welche Änderung Sie meinen. Nennen Sie sie explizit oder prüfen Sie, was existiert:

```bash
openspec list                    # aktive Änderungen anzeigen
/opsx:apply add-dark-mode        # die Änderung im Chat benennen
```

Bestätigen Sie außerdem, dass Sie sich im richtigen Projektverzeichnis befinden.

### "No artifacts ready" (Keine Artefakte bereit)

Jedes Artefakt ist entweder bereits erstellt oder wartet auf eine Abhängigkeit. Sehen Sie nach, was blockiert:

```bash
openspec status --change <name>
```

Erstellen Sie zuerst die fehlende Abhängigkeit. Denken Sie an die Reihenfolge: Vorschlag ermöglicht Specs und Design; Specs und Design ermöglichen Aufgaben (Tasks).

### `openspec validate` meldet Warnungen oder Fehler

Validierung prüft Ihre Specs und Änderungen auf strukturelle Probleme. Lesen Sie die Meldung: sie nennt die Datei und das Problem.

```bash
openspec validate <name>           # ein Element validieren
openspec validate --all            # alles validieren
openspec validate --all --strict   # strengere Prüfungen, gut für CI
```

Häufige Ursachen sind ein fehlender erforderlicher Abschnitt (wie eine Spec ohne Szenarien) oder ein fehlerhaftes Delta-Header. Beheben Sie die Datei und führen Sie es erneut aus. Die [CLI Reference](cli.md#openspec-validate) dokumentiert das Ausgabeformat.

### Die KI hat unvollständige oder falsche Artefakte erstellt

Die KI hatte nicht genügend Kontext. Einige Hebel helfen:

- Fügen Sie Projektkontext in `openspec/config.yaml` hinzu, damit Ihr Stack und Ihre Konventionen in jede Anfrage injiziert werden. Sehen Sie sich [Customization](customization.md#project-configuration) an.
- Fügen Sie pro Artefakt `rules:` für Anleitungen hinzu, die nur auf bestimmte Dinge zutreffen, zum Beispiel Specs.
- Geben Sie eine detailliertere Beschreibung beim Vorschlagen.
- Verwenden Sie den erweiterten `/opsx:continue`, um ein Artefakt nach dem anderen zu erstellen und jedes zu überprüfen, anstatt `/opsx:ff` sie alle auf einmal durchzuführen.

### Archive wird nicht fertig oder warnt vor unvollständigen Aufgaben

Archive wird nicht bei unvollständigen Aufgaben *blockieren*, aber es warnt Sie, da das Archivieren normalerweise bedeutet, dass die Arbeit erledigt ist. Wenn Aufgaben absichtlich verbleiben (Sie reichen eine teilweise Änderung ein), fahren Sie fort. Andernfalls schließen Sie zuerst die Aufgaben ab. Archive bietet auch an, Ihre Delta-Specs in die Hauptspecs zu synchronisieren, falls Sie dies noch nicht getan haben; sagen Sie ja, es sei denn, Sie haben einen Grund dagegen.

## Konfiguration

### Mein `config.yaml` wird nicht angewendet

Drei übliche Verdächtige:

1. **Falscher Dateiname.** Es muss `openspec/config.yaml` sein und nicht `.yml`.
2. **Ungültiges YAML.** Führen Sie es durch einen beliebigen YAML-Validator; die CLI meldet auch Syntaxfehler mit Zeilennummern.
3. **Sie haben einen Neustart erwartet.** Das ist nicht nötig. Konfigurationsänderungen treten sofort in Kraft.

### "Unknown artifact ID in rules: X" (Unbekannte Artefakt-ID in Regeln: X)

Ein Schlüssel unter `rules:` stimmt mit keinem Artefakt in Ihrem Schema überein. Für das Standard-`spec-driven`-Schema sind die gültigen IDs `proposal`, `specs`, `design`, `tasks`. Um die IDs für jedes Schema zu sehen, führen Sie aus:

```bash
openspec schemas --json
```

### "Context too large" (Kontext zu groß)

Das Feld `context:` ist absichtlich auf 50KB begrenzt, da es in jede Anfrage injiziert wird. Fassen Sie es zusammen oder verlinken Sie stattdessen auf längere Dokumentationen, anstatt sie einzufügen. Ein prägnanter Kontext liefert auch bessere, schnellere Ergebnisse.

### "Schema not found" (Schema nicht gefunden)

Der von Ihnen referenzierte Schema-Name existiert nicht. Listen Sie die verfügbaren Schemata auf und prüfen Sie die Schreibweise:

```bash
openspec schemas                    # verfügbare Schemata auflisten
openspec schema which <name>        # anzeigen, wo ein Schema aufgelöst wird
openspec schema init <name>         # eines erstellen
```

Sehen Sie sich [Customization](customization.md#custom-schemas) an.

## Migration vom Legacy Workflow

### "Legacy files detected in non-interactive mode" (Legacy-Dateien im nicht-interaktiven Modus gefunden)

Sie befinden sich in CI oder einer nicht-interaktiven Shell, und OpenSpec hat alte Dateien zur Bereinigung gefunden, kann Sie aber nicht fragen. Genehmigen Sie dies automatisch:

```bash
openspec init --force
```

### Befehle erschienen nicht nach der Migration

Starten Sie Ihre IDE neu. Skills werden beim Start erkannt. Wenn sie immer noch nicht erscheinen, führen Sie `openspec update` aus und prüfen Sie die Speicherorte in [Supported Tools](supported-tools.md).

### Mein altes `project.md` wurde nicht migriert

Das ist beabsichtigt. OpenSpec löscht `project.md` niemals automatisch, da es Kontext enthalten kann, den Sie geschrieben haben. Verschieben Sie die nützlichen Teile in das `context:`-Feld von `config.yaml` und löschen Sie es dann selbst. Der [Migration Guide](migration-guide.md#migrating-projectmd-to-configyaml) führt dies durch und enthält einen Hinweis, den Sie Ihrer KI geben können, um die Destillation durchzuführen.

## Immer noch festgefahren?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Aus Ihrem Terminal:** `openspec feedback "what went wrong"` eröffnet ein Issue für Sie.

Wenn Sie ein Problem melden, fügen Sie Ihre OpenSpec-Version (`openspec --version`), Ihre Node-Version (`node --version`), Ihr KI-Tool sowie den genauen Befehl und die Ausgabe bei. Das macht die Hilfe viel schneller.