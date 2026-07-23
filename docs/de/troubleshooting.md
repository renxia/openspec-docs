# Fehlerbehebung

Konkrete Lösungen für konkrete Probleme. Jeder Eintrag nennt ein Symptom, erklärt die wahrscheinliche Ursache in einem Satz und gibt Ihnen die entsprechende Lösung. Wenn Sie Ihr Problem hier nicht finden, hilft Ihnen möglicherweise die [FAQ](faq.md), und der [Discord](https://discord.gg/YctCnvvshC) auf jeden Fall.

## Installation und Einrichtung

### `openspec: command not found`

Die CLI ist nicht installiert, oder Ihre Shell kann sie nicht finden. Installieren Sie sie global und überprüfen Sie dies:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Wenn sie installiert ist, aber immer noch nicht gefunden wird, ist Ihr globales npm-bin-Verzeichnis wahrscheinlich nicht in Ihrem `PATH` enthalten. Führen Sie `npm bin -g` aus, um zu sehen, wo globale Binärdateien gespeichert sind, und stellen Sie sicher, dass dieser Pfad in Ihrem Shell-Profil enthalten ist.

### "Requires Node.js 20.19.0 or higher"

OpenSpec erfordert Node.js 20.19.0 oder höher. Überprüfen Sie Ihre Version und aktualisieren Sie sie bei Bedarf:

```bash
node --version
```

Wenn Sie OpenSpec mit bun installieren, beachten Sie, dass OpenSpec trotzdem *auf Node ausgeführt wird*, sodass Sie unabhängig davon Node.js 20.19.0+ in Ihrem `PATH` verfügbar haben müssen. Siehe [Installation](installation.md).

### `openspec init` didn't configure my AI tool

`init` fragt, welche Tools eingerichtet werden sollen. Wenn Sie Ihr Tool übersprungen haben oder ein weiteres hinzufügen möchten, führen Sie den Befehl einfach erneut aus, oder verwenden Sie die nicht-interaktive Form:

```bash
openspec init --tools claude,cursor
```

Die vollständige Liste der Tool-IDs finden Sie unter [Unterstützte Tools](supported-tools.md). Verwenden Sie `--tools all` für alle Tools und `--tools none`, um die Tool-Einrichtung zu überspringen.

## Befehle werden nicht angezeigt

Wenn `/opsx:propose` (oder das Äquivalent Ihres Tools) nicht angezeigt wird oder keine Aktion ausführt, gehen Sie diese Liste der Reihe nach durch. Sie ist so sortiert, dass Sie zuerst die am schnellsten zu prüfenden Punkte abarbeiten.

1. **Sie befinden sich möglicherweise am falschen Ort.** Slash-Befehle werden im Chat Ihres KI-Assistenten eingegeben, nicht in Ihrem Terminal. Wenn Sie `/opsx:propose` in Ihre Shell eingegeben haben, ist das das Problem. Siehe [Wie Befehle funktionieren](how-commands-work.md).

2. **Generieren Sie die Dateien neu.** Führen Sie dazu im Stammverzeichnis Ihres Projekts Folgendes aus:

   ```bash
   openspec update
   ```

   Dadurch werden die Skill- und Befehlsdateien für alle von Ihnen konfigurierten Tools neu geschrieben.

3. **Starten Sie Ihren Assistenten neu.** Die meisten Tools scannen beim Start nach Skills und Befehlen. Ein neues Fenster reicht dafür oft aus.

4. **Überprüfen Sie, ob die Dateien vorhanden sind.** Für Claude Code prüfen Sie, ob das Verzeichnis `.claude/skills/` Ordner enthält, die dem Muster `openspec-*` entsprechen. Andere Tools verwenden eigene Verzeichnisse, die alle unter [Unterstützte Tools](supported-tools.md) aufgelistet sind.

5. **Überprüfen Sie, ob Sie dieses Projekt initialisiert haben.** Skills werden pro Projekt erstellt. Wenn Sie ein Repository geklont oder den Ordner gewechselt haben, führen Sie dort `openspec init` (oder `openspec update`) aus.

6. **Überprüfen Sie, ob Ihr Tool Befehlsdateien unterstützt.** Für Codex und einige andere Tools (CodeArts, Kimi CLI, ForgeCode, Mistral Vibe) werden keine `opsx-*`-Befehlsdateien generiert; stattdessen verwenden sie auf Skills basierende Aufrufe. Für Codex prüfen Sie das Verzeichnis `.codex/skills/openspec-*`. Die Aufrufformen unterscheiden sich je nach Tool: siehe [Unterstützte Tools](supported-tools.md) und [Wie Befehle funktionieren](how-commands-work.md#slash-command-syntax-by-tool).

## Arbeit mit Änderungen

### "Change not found"

Der Befehl konnte nicht ermitteln, welche Änderung Sie meinten. Nennen Sie sie explizit, oder überprüfen Sie, welche Änderungen aktuell vorhanden sind:

```bash
openspec list                    # see active changes
/opsx:apply add-dark-mode        # name the change in chat
```

Stellen Sie außerdem sicher, dass Sie sich im richtigen Projektverzeichnis befinden.

### "No artifacts ready"

Jedes Artefakt ist entweder bereits erstellt oder blockiert, weil es auf eine Abhängigkeit wartet. Überprüfen Sie, was blockiert:

```bash
openspec status --change <name>
```

Erstellen Sie zuerst die fehlende Abhängigkeit. Beachten Sie die Reihenfolge: Ein Proposal aktiviert Specs und Design; Specs und Design zusammen aktivieren Tasks.

### `openspec validate` reports warnings or errors

Die Validierung prüft Ihre Specs und Änderungen auf strukturelle Probleme. Lesen Sie die Meldung: Sie gibt die betroffene Datei und das Problem an.

```bash
openspec validate <name>           # validate one item
openspec validate --all            # validate everything
openspec validate --all --strict   # stricter checks, good for CI
```

Häufige Ursachen sind eine fehlende erforderliche Sektion (z. B. eine Spec ohne Szenarien) oder ein fehlerhafter Delta-Header. Korrigieren Sie die Datei und führen Sie den Befehl erneut aus. Die [CLI-Referenz](cli.md#openspec-validate) dokumentiert das Ausgabeformat.

### The AI created incomplete or wrong artifacts

Die KI hatte nicht genug Kontext. Einige Stellschrauben helfen dabei:

- Fügen Sie Projektkontext in `openspec/config.yaml` hinzu, sodass Ihr Stack und Ihre Konventionen in jede Anfrage eingefügt werden. Siehe [Anpassung](customization.md#project-configuration).
- Fügen Sie artefaktbezogene `rules:` hinzu, um Anleitungen bereitzustellen, die nur für z. B. Specs gelten.
- Geben Sie eine detailliertere Beschreibung an, wenn Sie ein Proposal erstellen.
- Verwenden Sie den erweiterten Befehl `/opsx:continue`, um ein Artefakt nach dem anderen zu erstellen und jedes einzeln zu überprüfen, anstatt `/opsx:ff` zu verwenden, das alle auf einmal erstellt.

### Archivieren wird nicht abgeschlossen oder warnt vor unvollständigen Tasks

Das Archivieren blockiert nicht bei unvollständigen Tasks, warnt Sie aber davor, da Archivieren normalerweise bedeutet, dass die Arbeit abgeschlossen ist. Wenn Tasks absichtlich offen bleiben (z. B. bei einer partiellen Änderung, die Sie einreichen), fahren Sie fort. Andernfalls schließen Sie zuerst die Tasks ab. Das Archivieren bietet Ihnen außerdem an, Ihre Delta-Specs mit den Haupt-Specs zu synchronisieren, falls Sie dies noch nicht getan haben; stimmen Sie dem zu, es sei denn, Sie haben einen Grund dagegen.

## Konfiguration

### Meine `config.yaml` wird nicht angewendet

Drei häufige Ursachen:

1. **Falscher Dateiname.** Er muss `openspec/config.yaml` lauten, nicht `.yml`.
2. **Ungültiges YAML.** Führen Sie es durch einen beliebigen YAML-Validator; die CLI meldet ebenfalls Syntaxfehler mit zugehörigen Zeilennummern.
3. **Sie haben einen Neustart erwartet.** Das ist nicht nötig. Änderungen an der Konfiguration treten sofort in Kraft.

### "Unknown artifact ID in rules: X"

Ein Schlüssel unter `rules:` stimmt mit keinem Artefakt in Ihrem Schema überein. Für das standardmäßige `spec-driven`-Schema sind die gültigen IDs `proposal`, `specs`, `design` und `tasks`. Um die IDs für ein beliebiges Schema anzuzeigen:

```bash
openspec schemas --json
```

### "Context too large"

Das Feld `context:` ist absichtlich auf 50 KB begrenzt, da es in jede Anfrage eingefügt wird. Fassen Sie es zusammen, oder verlinken Sie auf längere Dokumente, anstatt sie einzufügen. Weniger Kontext führt außerdem zu besseren und schnelleren Ergebnissen.

### "Schema not found"

Der von Ihnen referenzierte Schemaname existiert nicht. Listen Sie die verfügbaren Schemas auf und überprüfen Sie die Schreibweise:

```bash
openspec schemas                    # list available schemas
openspec schema which <name>        # see where a schema resolves from
openspec schema init <name>         # create a custom one
```

Siehe [Anpassung](customization.md#custom-schemas).

## Migration vom alten Workflow

### "Legacy files detected in non-interactive mode"

Sie befinden sich in einer CI-Umgebung oder einer nicht-interaktiven Shell, und OpenSpec hat alte Dateien zum Bereinigen gefunden, kann Sie aber nicht zur Bestätigung auffordern. Genehmigen Sie die Bereinigung automatisch:

```bash
openspec init --force
```

Für Codex kann OpenSpec alte verwaltete Prompt-Dateien in `$CODEX_HOME/prompts` oder `~/.codex/prompts` erkennen. Diese Bereinigung ist auf die von OpenSpec zugelassenen alten Codex-Prompt-Dateinamen beschränkt, und der nicht-interaktive Befehl `openspec init` entfernt nur die Dateien, für die die entsprechenden Ersatz-Skills unter `.codex/skills/openspec-*` vorhanden sind. Der nicht-interaktive Befehl `openspec update` belässt alle Bereinigungen von alten Dateien unangetastet, es sei denn, Sie übergeben den Parameter `--force`.

### Befehle werden nach der Migration nicht angezeigt

Starten Sie Ihre IDE neu. Skills werden beim Start erkannt. Wenn sie immer noch nicht angezeigt werden, führen Sie `openspec update` aus und überprüfen Sie die Dateipfade unter [Unterstützte Tools](supported-tools.md).

### Meine alte `project.md` wurde nicht migriert

Das ist beabsichtigt. OpenSpec löscht `project.md` nie automatisch, da es von Ihnen geschriebenen Kontext enthalten kann. Verschieben Sie die nützlichen Teile in die Sektion `context:` von `config.yaml` und löschen Sie die Datei anschließend selbst. Der [Migrationsleitfaden](migration-guide.md#migrating-projectmd-to-configyaml) führt Sie durch diesen Prozess, einschließlich eines Prompts, den Sie an Ihre KI übergeben können, um die Zusammenfassung durchzuführen.

## Immer noch Probleme?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Über Ihr Terminal:** `openspec feedback "what went wrong"` erstellt für Sie ein Issue.

Wenn Sie ein Problem melden, geben Sie Ihre OpenSpec-Version (`openspec --version`), Ihre Node-Version (`node --version`), Ihr KI-Tool sowie den genauen Befehl und die Ausgabe an. Das macht die Hilfe deutlich schneller.