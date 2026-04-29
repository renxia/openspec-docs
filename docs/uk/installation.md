# Встановлення

## Передумови

- **Node.js версії 20.19.0 або вище** — Перевірте свою версію: `node --version`

## Менеджери пакетів

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

Запустіть OpenSpec безпосередньо без встановлення:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Або встановіть у свій профіль:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Або додайте до вашого середовища розробки у файлі `flake.nix`:

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

## Перевірка встановлення

```bash
openspec --version
```

## Наступні кроки

Після встановлення ініціалізуйте OpenSpec у вашому проєкті:

```bash
cd your-project
openspec init
```

Перегляньте [Початок роботи](getting-started.md) для повного посібника.