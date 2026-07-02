# Installation

## Voraussetzungen

- **Node.js 20.19.0 oder höher** — Überprüfen Sie Ihre Version: `node --version`

## Paketmanager

### npm

```bash
npm install -g @fission-ai/openspec@latest
```

### pnpm

```bash
pnpm add -g @fission-ai/openspec@latest
```

### yarn

```bash
yarn global add @fission-ai/openspec@latest
```

### bun

Bun kann OpenSpec global installieren, aber OpenSpec läuft derzeit auf Node.js. Sie benötigen weiterhin Node.js 20.19.0 oder höher, das im `PATH` verfügbar ist.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Führen Sie OpenSpec direkt ohne Installation aus:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

O installieren Sie es in Ihr Profil:

```bash
nix profile install github:Fission-AI/OpenSpec
```

O fügen Sie es Ihrer Entwicklungsumgebung in `flake.nix` hinzu:

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    openspec.url = "github:Fission-AI/OpenSpec";
  };

  outputs = { nixpkgs, openspec, ... }: {
    devShells.x86_64-linux.default = nixpkgs.legacyPackages.x86_64-linux.mkShell {
      buildInputs = [ openspec.packages.x86_64-linux.default ];
    };
  };
}
```

## Überprüfung der Installation

```bash
openspec --version
```

## Aktualisieren

Aktualisieren Sie das Paket und aktualisieren Sie anschließend die generierten Dateien jedes Projekts:

```bash
npm install -g @fission-ai/openspec@latest   # oder pnpm/yarn/bun Äquivalent
openspec update                              # ausführen innerhalb jedes Projekts
```

`openspec update` regeneriert die Skill- und Befehlsdateien für die von Ihnen konfigurierten Tools, sodass Ihre Slash-Befehle mit der installierten Version aktuell bleiben.

## Deinstallation

Es gibt keinen `openspec uninstall`-Befehl, da OpenSpec lediglich ein globales Paket plus einige Dateien in Ihrem Projekt ist. Die Entfernung erfordert einige manuelle Schritte, und nichts davon berührt Ihren Quellcode.

**1. Globales Paket entfernen:**

```bash
npm uninstall -g @fission-ai/openspec   # oder: pnpm rm -g / yarn global remove / bun rm -g
```

**2. OpenSpec aus einem Projekt entfernen (optional).** Löschen Sie das `openspec/`-Verzeichnis, wenn Sie seine Spezifikationen und Änderungen nicht mehr benötigen:

```bash
rm -rf openspec/
```

Denken Sie darüber nach, bevor Sie dies tun: `openspec/specs/` und `openspec/changes/archive/` sind Ihre Aufzeichnung darüber, wie das System funktioniert und warum es sich geändert hat. Wenn Sie diese Historie benötigen könnten, behalten Sie den Ordner (oder speichern ihn in Git), selbst nachdem Sie deinstalliert haben.

**3. Generierte KI-Tool-Dateien entfernen (optional).** OpenSpec schreibt Skill- und Befehlsdateien in pro Tool Verzeichnisse wie `.claude/skills/openspec-*`, `.cursor/commands/opsx-*` usw. Löschen Sie die `openspec-*`-Skills und `opsx-*`-Befehle für alle von Ihnen konfigurierten Tools. Die genauen Pfade pro Tool sind in [Supported Tools](supported-tools.md) aufgeführt.

Falls Sie auch OpenSpec-Markerblöcke in Dateien wie `CLAUDE.md` oder `AGENTS.md` haben, entfernen Sie diese Blöcke manuell; Ihr eigener Inhalt in diesen Dateien bleibt bei Ihnen.

## Nächste Schritte

Nach der Installation initialisieren Sie OpenSpec in Ihrem Projekt:

```bash
cd your-project
openspec init
```

Siehe [Getting Started](getting-started.md) für eine vollständige Anleitung.