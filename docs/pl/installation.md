# Instalacja

## Wymagania wstępne

- **Node.js w wersji 20.19.0 lub nowszej** — Sprawdź swoją wersję: `node --version`

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

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Uruchom OpenSpec bezpośrednio bez instalacji:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Lub zainstaluj w swoim profilu:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Lub dodaj do swojego środowiska deweloperskiego w pliku `flake.nix`:

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

## Kolejne kroki

Po instalacji zainicjalizuj OpenSpec w swoim projekcie:

```bash
cd your-project
openspec init
```

Zobacz [Pierwsze kroki](getting-started.md), aby uzyskać pełny opis procesu.