---
layout: home

hero:
  name: "OpenSpec"
  text: "Spezifikationsgetriebene Entwicklung für KI-Assistenten"
  tagline: Eine leichte Spezifikation für den Aufbau und die Verwaltung von KI-Assistenten-Projekten.
  actions:
    - theme: brand
      text: Loslegen
      link: ./getting-started
    - theme: alt
      text: Startseite
      link: /

features:
  - title: Spezifikations-zuerst-Arbeitsablauf
    details: Definiere Anforderungen, bevor du Code schreibst.
  - title: KI-Natives Design
    details: Gebaut für Claude Code, Cursor, Windsurf und mehr.
  - title: Mehrsprachig
    details: Dokumentation in mehreren Sprachen verfügbar.
---


<details>
<summary><strong>Das beliebteste Spezifikations-Framework.</strong></summary>

[![Stars](https://img.shields.io/github/stars/Fission-AI/OpenSpec?style=flat-square&label=Stars)](https://github.com/Fission-AI/OpenSpec/stargazers)
[![Downloads](https://img.shields.io/npm/dm/@fission-ai/openspec?style=flat-square&label=Downloads/mo)](https://www.npmjs.com/package/@fission-ai/openspec)
[![Contributors](https://img.shields.io/github/contributors/Fission-AI/OpenSpec?style=flat-square&label=Contributors)](https://github.com/Fission-AI/OpenSpec/graphs/contributors)

</details>
<p></p>
Unsere Philosophie:

```text
→ flüssig, nicht starr
→ iterativ, nicht wasserfallartig
→ einfach, nicht komplex
→ gebaut für Bestandsprojekte, nicht nur für Neuanfänge
→ skalierbar von persönlichen Projekten bis hin zu Unternehmen
```

> [!TIP]
> **Neuer Arbeitsablauf jetzt verfügbar!** Wir haben OpenSpec mit einem neuen artefaktgeführten Arbeitsablauf neu gebaut.
>
> Starte mit `/opsx:propose "deine Idee"`. → [Mehr erfahren](opsx.md)

<p align="center">
  Folge <a href="https://x.com/0xTab">@0xTab auf X</a> für Updates · Tritt dem <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord</a> bei für Hilfe und Fragen.
</p>

<!-- TODO: GIF-Demo von /opsx:propose → /opsx:archive-Arbeitsablauf hinzufügen -->

## Es in Aktion sehen

```text
Du: /opsx:propose add-dark-mode
KI:  Erstellt openspec/changes/add-dark-mode/
     ✓ proposal.md — warum wir das tun, was sich ändert
     ✓ specs/       — Anforderungen und Szenarien
     ✓ design.md    — technischer Ansatz
     ✓ tasks.md     — Implementierungs-Checkliste
     Bereit zur Implementierung!

Du: /opsx:apply
KI:  Implementiere Aufgaben...
     ✓ 1.1 Theme-Kontext-Provider hinzufügen
     ✓ 1.2 Toggle-Komponente erstellen
     ✓ 2.1 CSS-Variablen hinzufügen
     ✓ 2.2 localStorage anbinden
     Alle Aufgaben abgeschlossen!

Du: /opsx:archive
KI:  Archiviert nach openspec/changes/archive/2025-01-23-add-dark-mode/
     Spezifikationen aktualisiert. Bereit für das nächste Feature.
```

<details>
<summary><strong>OpenSpec Dashboard</strong></summary>

</details>

## Schnellstart

**Erfordert Node.js 20.19.0 oder höher.**

Installiere OpenSpec global:

```bash
npm install -g @fission-ai/openspec@latest
```

Navigiere dann zu deinem Projektverzeichnis und initialisiere:

```bash
cd dein-projekt
openspec init
```

Sag jetzt deiner KI: `/opsx:propose <was-du-bauen-willst>`

Wenn du den erweiterten Arbeitsablauf (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`) möchtest, wähle ihn mit `openspec config profile` aus und wende ihn mit `openspec update` an.

> [!NOTE]
> Nicht sicher, ob dein Tool unterstützt wird? [Siehe die vollständige Liste](supported-tools.md) – wir unterstützen über 25 Tools und wachsen.
>
> Funktioniert auch mit pnpm, yarn, bun und nix. [Siehe Installationsoptionen](installation.md).

## Dokumentation

→ **[Loslegen](getting-started.md)**: Erste Schritte<br>
→ **[Arbeitsabläufe](workflows.md)**: Kombinationen und Muster<br>
→ **[Befehle](commands.md)**: Slash-Befehle & Skills<br>
→ **[CLI](cli.md)**: Terminal-Referenz<br>
→ **[Unterstützte Tools](supported-tools.md)**: Tool-Integrationen & Installationspfade<br>
→ **[Konzepte](concepts.md)**: Wie alles zusammenpasst<br>
→ **[Mehrsprachig](multi-language.md)**: Mehrsprachige Unterstützung<br>
→ **[Anpassung](customization.md)**: Mache es dir zu eigen


## Warum OpenSpec?

KI-Coding-Assistenten sind mächtig, aber unvorhersehbar, wenn Anforderungen nur in der Chat-Historie leben. OpenSpec fügt eine leichte Spezifikationsschicht hinzu, damit ihr euch einigt, was gebaut werden soll, bevor auch nur eine Zeile Code geschrieben wird.

- **Einigen, bevor du baust** — Mensch und KI stimmen sich über Spezifikationen ab, bevor Code geschrieben wird
- **Organisiert bleiben** — Jede Änderung bekommt ihren eigenen Ordner mit Vorschlag, Spezifikationen, Design und Aufgaben
- **Flüssig arbeiten** — Aktualisiere jederzeit jedes Artefakt, keine starren Phasentore
- **Nutze deine Tools** — Funktioniert mit über 20 KI-Assistenten über Slash-Befehle

### Wie wir im Vergleich abschneiden

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Gründlich, aber schwerfällig. Starre Phasentore, viel Markdown, Python-Setup. OpenSpec ist leichter und lässt dich frei iterieren.

**vs. [Kiro](https://kiro.dev)** (AWS) — Mächtig, aber du bist an deren IDE gebunden und auf Claude-Modelle beschränkt. OpenSpec funktioniert mit den Tools, die du bereits nutzt.

**vs. nichts** — KI-Coding ohne Spezifikationen bedeutet vage Prompts und unvorhersehbare Ergebnisse. OpenSpec bringt Vorhersehbarkeit ohne den Aufwand.

## OpenSpec aktualisieren

**Paket aktualisieren**

```bash
npm install -g @fission-ai/openspec@latest
```

**Agenten-Anweisungen auffrischen**

Führe dies in jedem Projekt aus, um die KI-Anleitung neu zu generieren und sicherzustellen, dass die neuesten Slash-Befehle aktiv sind:

```bash
openspec update
```

## Hinweise zur Nutzung

**Modellauswahl**: OpenSpec funktioniert am besten mit Modellen mit hoher Reasoning-Fähigkeit. Wir empfehlen Opus 4.5 und GPT 5.2 sowohl für die Planung als auch für die Implementierung.

**Kontext-Hygiene**: OpenSpec profitiert von einem sauberen Kontextfenster. Leere deinen Kontext, bevor du mit der Implementierung beginnst, und pflege eine gute Kontext-Hygiene während deiner gesamten Sitzung.

## Beiträge leisten

**Kleine Korrekturen** — Fehlerbehebungen, Tippfehlerkorrekturen und kleinere Verbesserungen können direkt als PRs eingereicht werden.

**Größere Änderungen** — Für neue Funktionen, signifikante Refactorings oder architektonische Änderungen reiche bitte zuerst einen OpenSpec-Änderungsvorschlag ein, damit wir uns über Absicht und Ziele einigen können, bevor mit der Implementierung begonnen wird.

Beim Schreiben von Vorschlägen behalte die OpenSpec-Philosophie im Hinterkopf: Wir dienen einer Vielzahl von Nutzern über verschiedene Coding-Agenten, Modelle und Anwendungsfälle hinweg. Änderungen sollten für alle gut funktionieren.

**KI-generierter Code ist willkommen** — solange er getestet und verifiziert wurde. PRs mit KI-generiertem Code sollten den verwendeten Coding-Agenten und das Modell erwähnen (z.B. "Generiert mit Claude Code unter Verwendung von claude-opus-4-5-20251101").

### Entwicklung

- Abhängigkeiten installieren: `pnpm install`
- Bauen: `pnpm run build`
- Testen: `pnpm test`
- CLI lokal entwickeln: `pnpm run dev` oder `pnpm run dev:cli`
- Konventionelle Commits (einzeilig): `type(scope): subject`

## Sonstiges

<details>
<summary><strong>Telemetrie</strong></summary>

OpenSpec sammelt anonyme Nutzungsstatistiken.

Wir erfassen nur Befehlsnamen und Version, um Nutzungsmuster zu verstehen. Keine Argumente, Pfade, Inhalte oder personenbezogenen Daten. Automatisch deaktiviert in CI.

**Abmelden:** `export OPENSPEC_TELEMETRY=0` oder `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>Betreuer & Berater</strong></summary>

Siehe [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) für die Liste der Kernbetreuer und Berater, die bei der Projektleitung helfen.

</details>



## Lizenz

MIT