---
layout: home

hero:
  name: "OpenSpec"
  text: "Spezifikationsgetriebene Entwicklung für KI-Assistenten"
  tagline: Eine leichte Spezifikation für den Aufbau und die Verwaltung von KI-Assistenten-Projekten.
  actions:
    - theme: brand
      text: Erste Schritte
      link: ./getting-started
    - theme: alt
      text: Startseite
      link: /

features:
  - title: Spezifikation-zuerst-Workflow
    details: Definieren Sie Anforderungen, bevor Sie Code schreiben.
  - title: KI-natives Design
    details: Entwickelt für Claude Code, Cursor, Windsurf und mehr.
  - title: Mehrsprachig
    details: Dokumentation in mehreren Sprachen verfügbar.
---


Unsere Philosophie:

```text
→ fließend, nicht starr
→ iterativ, nicht Wasserfall
→ einfach, nicht komplex
→ für Brownfield-Projekte, nicht nur Greenfield
→ skalierbar von persönlichen Projekten bis zu Unternehmen
```

> [!TIP]
> **Neuer Workflow jetzt verfügbar!** Wir haben OpenSpec mit einem neuen artefaktgestützten Workflow neu aufgebaut.
>
> Führen Sie `/opsx:propose "Ihre Idee"` aus, um zu beginnen. → [Hier mehr erfahren](opsx.md)

<p align="center">
  Folgen Sie <a href="https://x.com/0xTab">@0xTab auf X</a> für Updates · Treten Sie dem <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord</a> bei für Hilfe und Fragen.
</p>

## Sehen Sie es in Aktion

```text
Sie: /opsx:propose add-dark-mode
KI:  Erstellt openspec/changes/add-dark-mode/
     ✓ proposal.md — warum wir das tun, was sich ändert
     ✓ specs/       — Anforderungen und Szenarien
     ✓ design.md    — technischer Ansatz
     ✓ tasks.md     — Implementierungs-Checkliste
     Bereit zur Implementierung!

Sie: /opsx:apply
KI:  Implementiere Aufgaben...
     ✓ 1.1 Theme-Kontextanbieter hinzufügen
     ✓ 1.2 Umschaltkomponente erstellen
     ✓ 2.1 CSS-Variablen hinzufügen
     ✓ 2.2 localStorage verbinden
     Alle Aufgaben abgeschlossen!

Sie: /opsx:archive
KI:  Archiviert nach openspec/changes/archive/2025-01-23-add-dark-mode/
     Spezifikationen aktualisiert. Bereit für die nächste Funktion.
```

<details>
<summary><strong>OpenSpec Dashboard</strong></summary>
</details>

## Schnellstart

**Erfordert Node.js 20.19.0 oder höher.**

Installieren Sie OpenSpec global:

```bash
npm install -g @fission-ai/openspec@latest
```

Navigieren Sie dann zu Ihrem Projektverzeichnis und initialisieren Sie:

```bash
cd your-project
openspec init
```

Sagen Sie nun Ihrem KI-Assistenten: `/opsx:propose <was-sie-bauen-wollen>`

Wenn Sie den erweiterten Workflow (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`) möchten, wählen Sie ihn mit `openspec config profile` aus und wenden Sie ihn mit `openspec update` an.

> [!NOTE]
> Nicht sicher, ob Ihr Tool unterstützt wird? [Vollständige Liste anzeigen](supported-tools.md) – wir unterstützen 25+ Tools und es werden mehr.
>
> Funktioniert auch mit pnpm, yarn, bun und nix. [Installationsoptionen anzeigen](installation.md).

## Dokumentation

→ **[Erste Schritte](getting-started.md)**: erste Schritte<br>
→ **[Workflows](workflows.md)**: Kombinationen und Muster<br>
→ **[Befehle](commands.md)**: Slash-Befehle & Skills<br>
→ **[CLI](cli.md)**: Terminal-Referenz<br>
→ **[Unterstützte Tools](supported-tools.md)**: Tool-Integrationen & Installationspfade<br>
→ **[Konzepte](concepts.md)**: wie alles zusammenpasst<br>
→ **[Mehrsprachig](multi-language.md)**: Mehrsprachige Unterstützung<br>
→ **[Anpassung](customization.md)**: Machen Sie es zu Ihrem


## Warum OpenSpec?

KI-Coding-Assistenten sind leistungsstark, aber unvorhersehbar, wenn Anforderungen nur im Chatverlauf existieren. OpenSpec fügt eine leichte Spezifikationsebene hinzu, damit Sie sich darauf einigen, was gebaut werden soll, bevor Code geschrieben wird.

- **Einigen Sie sich vor dem Bauen** — Mensch und KI stimmen Spezifikationen ab, bevor Code geschrieben wird
- **Bleiben Sie organisiert** — jede Änderung erhält eigenen Ordner mit Vorschlag, Spezifikationen, Design und Aufgaben
- **Arbeiten Sie fließend** — aktualisieren Sie jedes Artefakt jederzeit, keine starren Phasen-Tore
- **Nutzen Sie Ihre Tools** — funktioniert mit 20+ KI-Assistenten über Slash-Befehle

### Wie wir uns vergleichen

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Gründlich, aber schwerfällig. Starre Phasen-Tore, viel Markdown, Python-Setup. OpenSpec ist leichter und lässt Sie frei iterieren.

**vs. [Kiro](https://kiro.dev)** (AWS) — Leistungsstark, aber Sie sind an deren IDE gebunden und auf Claude-Modelle beschränkt. OpenSpec funktioniert mit den Tools, die Sie bereits verwenden.

**vs. nichts** — KI-Coding ohne Spezifikationen bedeutet vage Prompts und unvorhersehbare Ergebnisse. OpenSpec bringt Vorhersagbarkeit ohne den Aufwand.

## OpenSpec aktualisieren

**Paket aktualisieren**

```bash
npm install -g @fission-ai/openspec@latest
```

**Agenten-Anweisungen aktualisieren**

Führen Sie dies in jedem Projekt aus, um die KI-Anleitung neu zu generieren und sicherzustellen, dass die neuesten Slash-Befehle aktiv sind:

```bash
openspec update
```

## Verwendungshinweise

**Modellauswahl**: OpenSpec funktioniert am besten mit Modellen hoher Reasoning-Fähigkeit. Wir empfehlen Opus 4.5 und GPT 5.2 sowohl für Planung als auch Implementierung.

**Kontexthygiene**: OpenSpec profitiert von einem sauberen Kontextfenster. Leeren Sie Ihren Kontext vor Beginn der Implementierung und pflegen Sie eine gute Kontexthygiene während Ihrer gesamten Sitzung.

## Mitwirken

**Kleine Korrekturen** — Bugfixes, Tippfehlerkorrekturen und kleinere Verbesserungen können direkt als PRs eingereicht werden.

**Größere Änderungen** — Für neue Funktionen, signifikante Refactorings oder architektonische Änderungen reichen Sie bitte zuerst einen OpenSpec-Änderungsvorschlag ein, damit wir uns über Absicht und Ziele einigen können, bevor die Implementierung beginnt.

Beim Schreiben von Vorschlägen beachten Sie bitte die OpenSpec-Philosophie: Wir dienen einer Vielzahl von Nutzern über verschiedene Coding-Agenten, Modelle und Anwendungsfälle hinweg. Änderungen sollten für alle gut funktionieren.

**KI-generierter Code ist willkommen** — solange er getestet und verifiziert wurde. PRs mit KI-generiertem Code sollten den verwendeten Coding-Agenten und das Modell erwähnen (z.B. „Generiert mit Claude Code unter Verwendung von claude-opus-4-5-20251101").

### Entwicklung

- Abhängigkeiten installieren: `pnpm install`
- Bauen: `pnpm run build`
- Testen: `pnpm test`
- Lokal entwickeln: `pnpm run dev` oder `pnpm run dev:cli`
- Konventionelle Commits (einzeilig): `type(scope): subject`

## Sonstiges

<details>
<summary><strong>Telemetrie</strong></summary>

OpenSpec sammelt anonyme Nutzungsstatistiken.

Wir sammeln nur Befehlsnamen und Version, um Nutzungsmuster zu verstehen. Keine Argumente, Pfade, Inhalte oder personenbezogene Daten. Automatisch deaktiviert in CI.

**Opt-out:** `export OPENSPEC_TELEMETRY=0` oder `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>Betreuer & Berater</strong></summary>

Siehe [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) für die Liste der Kernbetreuer und Berater, die das Projekt leiten.

</details>



## Lizenz

MIT