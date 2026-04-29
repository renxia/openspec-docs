# Installation

## Prérequis

- **Node.js version 20.19.0 ou supérieure** — Vérifiez votre version : `node --version`

## Gestionnaires de paquets

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

Exécutez OpenSpec directement sans installation :

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Ou installez-le dans votre profil :

```bash
nix profile install github:Fission-AI/OpenSpec
```

Ou ajoutez-le à votre environnement de développement dans `flake.nix` :

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

## Vérification de l'installation

```bash
openspec --version
```

## Étapes suivantes

Après l'installation, initialisez OpenSpec dans votre projet :

```bash
cd your-project
openspec init
```

Consultez la section [Démarrage](getting-started.md) pour un guide complet.