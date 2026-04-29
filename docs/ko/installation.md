# 설치

## 사전 요구사항

- **Node.js 20.19.0 이상** — 버전 확인: `node --version`

## 패키지 관리자

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

설치하지 않고 OpenSpec을 직접 실행합니다:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

또는 프로필에 설치합니다:

```bash
nix profile install github:Fission-AI/OpenSpec
```

또는 `flake.nix`에 개발 환경을 추가합니다:

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

## 설치 확인

```bash
openspec --version
```

## 다음 단계

설치 후, 프로젝트에서 OpenSpec을 초기화합니다:

```bash
cd your-project
openspec init
```

전체 안내는 [시작하기](getting-started.md)를 참조하세요.