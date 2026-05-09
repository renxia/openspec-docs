# Встановлення

## Попередні вимоги

- **Node.js 20.19.0 або вище** — Перевірте вашу версію: `node --version`

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

Bun може встановити OpenSpec глобально, але OpenSpec наразі працює на Node.js.
Вам все ще потрібен Node.js 20.19.0 або вище, доступний у `PATH`.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Запустіть OpenSpec безпосередньо без встановлення:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Або встановіть у ваш профіль:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Або додайте до вашого середовища розробки у `flake.nix`:

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

Дивіться [Початок роботи](getting-started.md) для повного посібника.