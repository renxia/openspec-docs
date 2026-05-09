# Instalación

## Requisitos previos

- **Node.js 20.19.0 o superior** — Comprueba tu versión: `node --version`

## Gestores de paquetes

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

Bun puede instalar OpenSpec globalmente, pero OpenSpec actualmente se ejecuta sobre Node.js.
Aún necesitas tener Node.js 20.19.0 o superior disponible en `PATH`.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Ejecuta OpenSpec directamente sin instalación:

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

## Verificar la instalación

```bash
openspec --version
```

## Siguientes pasos

Después de instalar, inicializa OpenSpec en tu proyecto:

```bash
cd your-project
openspec init
```

Consulta [Primeros pasos](getting-started.md) para una guía completa.