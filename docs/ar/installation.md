# التثبيت

## المتطلبات الأساسية

- **Node.js 20.19.0 أو أحدث** — تحقق من إصدارك: `node --version`

## مديرو الحزم

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

قم بتشغيل OpenSpec مباشرة دون تثبيت:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

أو قم بتثبيته في ملفك الشخصي:

```bash
nix profile install github:Fission-AI/OpenSpec
```

أو أضفه إلى بيئة التطوير الخاصة بك في ملف `flake.nix`:

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

## التحقق من التثبيت

```bash
openspec --version
```

## الخطوات التالية

بعد التثبيت، قم بتهيئة OpenSpec في مشروعك:

```bash
cd your-project
openspec init
```

اطلع على [البدء](getting-started.md) للحصول على دليل شامل.