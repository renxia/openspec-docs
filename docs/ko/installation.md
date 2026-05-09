# 설치

## 사전 요구 사항

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

Bun은 OpenSpec을 전역적으로 설치할 수 있지만, OpenSpec은 현재 Node.js에서 실행됩니다.
`PATH`에 Node.js 20.19.0 이상이 여전히 필요합니다.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

설치 없이 OpenSpec을 직접 실행:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

또는 프로필에 설치:

```bash
nix profile install github:Fission-AI/OpenSpec
```

또는 `flake.nix`의 개발 환경에 추가:

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

전체 단계는 [시작하기](getting-started.md)를 참조하세요.