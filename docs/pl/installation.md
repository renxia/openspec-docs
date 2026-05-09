# Instalacja

## Wymagania wstępne

- **Node.js 20.19.0 lub nowszy** — Sprawdź swoją wersję: `node --version`

## Menedżery pakietów

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

Bun może zainstalować OpenSpec globalnie, ale OpenSpec aktualnie działa na Node.js.
Nadal potrzebujesz Node.js 20.19.0 lub nowszego dostępnego w `PATH`.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Uruchom OpenSpec bezpośrednio bez instalacji:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Lub zainstaluj do swojego profilu:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Lub dodaj do swojego środowiska deweloperskiego w `flake.nix`:

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

## Weryfikacja instalacji

```bash
openspec --version
```

## Następne kroki

Po instalacji zainicjalizuj OpenSpec w swoim projekcie:

```bash
cd your-project
openspec init
```

Zobacz [Pierwsze kroki](getting-started.md), aby zapoznać się z pełnym przewodnikiem.