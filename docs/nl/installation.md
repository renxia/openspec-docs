# Installatie

## Vereisten

- **Node.js 20.19.0 of hoger** — Controleer je versie: `node --version`

## Pakketbeheerders

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

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Voer OpenSpec direct uit zonder installatie:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Of installeer naar je profiel:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Of voeg toe aan je ontwikkelomgeving in `flake.nix`:

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

## Installatie verifiëren

```bash
openspec --version
```

## Volgende stappen

Na de installatie initialiseer je OpenSpec in je project:

```bash
cd je-project
openspec init
```

Zie [Aan de slag](getting-started.md) voor een volledige handleiding.