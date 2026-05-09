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

Bun kann OpenSpec global installieren, aber OpenSpec wird derzeit auf Node.js ausgeführt.
Sie benötigen weiterhin Node.js 20.19.0 oder höher, das im `PATH` verfügbar ist.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Führen Sie OpenSpec direkt ohne Installation aus:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Oder installieren Sie es in Ihr Profil:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Oder fügen Sie es Ihrer Entwicklungsumgebung in `flake.nix` hinzu:

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

## Installation überprüfen

```bash
openspec --version
```

## Nächste Schritte

Nach der Installation initialisieren Sie OpenSpec in Ihrem Projekt:

```bash
cd your-project
openspec init
```

Eine vollständige Anleitung finden Sie unter [Erste Schritte](getting-started.md).