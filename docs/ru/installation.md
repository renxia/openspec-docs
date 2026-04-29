# Установка

## Предварительные требования

- **Node.js версии 20.19.0 или выше** — Проверьте вашу версию: `node --version`

## Менеджеры пакетов

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

Запустите OpenSpec напрямую без установки:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Или установите в ваш профиль:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Или добавьте в ваше среду разработки в файле `flake.nix`:

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

## Проверка установки

```bash
openspec --version
```

## Следующие шаги

После установки инициализируйте OpenSpec в вашем проекте:

```bash
cd your-project
openspec init
```

Смотрите [Начало работы](getting-started.md) для полного руководства.