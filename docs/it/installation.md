# Installazione

## Prerequisiti

- **Node.js 20.19.0 o superiore** — Controlla la tua versione: `node --version`

## Gestori di pacchetti

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

Bun può installare OpenSpec globalmente, ma OpenSpec attualmente funziona su Node.js.
Hai comunque bisogno di Node.js 20.19.0 o superiore disponibile nel `PATH`.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Esegui OpenSpec direttamente senza installazione:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Oppure installa nel tuo profilo:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Oppure aggiungi al tuo ambiente di sviluppo in `flake.nix`:

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

## Verifica dell'installazione

```bash
openspec --version
```

## Prossimi passi

Dopo l'installazione, inizializza OpenSpec nel tuo progetto:

```bash
cd your-project
openspec init
```

Consulta [Getting Started](getting-started.md) per una guida completa.