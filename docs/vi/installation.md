# Cài đặt

## Yêu cầu tiên quyết

- **Node.js 20.19.0 hoặc cao hơn** — Kiểm tra phiên bản của bạn: `node --version`

## Trình quản lý gói

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

Bun có thể cài đặt OpenSpec toàn cục, nhưng OpenSpec hiện tại chạy trên Node.js.
Bạn vẫn cần Node.js 20.19.0 hoặc cao hơn có sẵn trên `PATH`.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Chạy OpenSpec trực tiếp mà không cần cài đặt:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Hoặc cài đặt vào hồ sơ của bạn:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Hoặc thêm vào môi trường phát triển của bạn trong `flake.nix`:

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

## Xác minh cài đặt

```bash
openspec --version
```

## Các bước tiếp theo

Sau khi cài đặt, khởi tạo OpenSpec trong dự án của bạn:

```bash
cd your-project
openspec init
```

Xem [Bắt đầu](getting-started.md) để có hướng dẫn đầy đủ.