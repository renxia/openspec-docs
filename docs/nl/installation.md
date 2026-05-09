# Installatie

## Vereisten

- **Node.js 20.19.0 of hoger** — Controleer uw versie: `node --version`

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

Bun kan OpenSpec globaal installeren, maar OpenSpec draait momenteel op Node.js.
U heeft nog steeds Node.js 20.19.0 of hoger nodig dat beschikbaar is op `PATH`.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Voer OpenSpec direct uit zonder installatie:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Of installeer het in uw profiel:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Of voeg het toe aan uw ontwikkelomgeving in `flake.nix`:

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

## Installatie Verifiëren

```bash
openspec --version
```

## Volgende Stappen

Na installatie, initialiseer OpenSpec in uw project:

```bash
cd your-project
openspec init
```

Zie [Aan de slag](getting-started.md) voor een volledige handleiding.