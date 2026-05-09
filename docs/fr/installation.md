# Installation

## Prérequis

- **Node.js 20.19.0 ou supérieur** — Vérifiez votre version : `node --version`

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

Bun peut installer OpenSpec globalement, mais OpenSpec s'exécute actuellement sur Node.js.
Vous avez toujours besoin de Node.js 20.19.0 ou supérieur disponible dans le `PATH`.

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

## Vérifier l'installation

```bash
openspec --version
```

## Prochaines étapes

Après l'installation, initialisez OpenSpec dans votre projet :

```bash
cd your-project
openspec init
```

Consultez [Démarrage](getting-started.md) pour un guide complet.