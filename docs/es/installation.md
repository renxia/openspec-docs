# Instalación

## Prerrequisitos

- **Node.js 20.19.0 o superior** — Verifica tu versión: `node --version`

## Gestores de Paquetes

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

Ejecuta OpenSpec directamente sin instalar:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

O instálalo en tu perfil:

```bash
nix profile install github:Fission-AI/OpenSpec
```

O agrégalo a tu entorno de desarrollo en `flake.nix`:

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

## Verificar la Instalación

```bash
openspec --version
```

## Siguientes Pasos

Después de instalar, inicializa OpenSpec en tu proyecto:

```bash
cd your-project
openspec init
```

Consulta [Primeros Pasos](getting-started.md) para una guía completa.