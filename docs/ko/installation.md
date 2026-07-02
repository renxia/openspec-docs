# 설치

## 필수 조건

- **Node.js 20.19.0 이상** — 버전을 확인하려면: `node --version`

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

Bun은 OpenSpec을 전역으로 설치할 수 있지만, 현재 OpenSpec은 Node.js에서 실행됩니다. 여전히 `PATH`에 Node.js 20.19.0 이상이 필요합니다.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

설치 없이 OpenSpec을 직접 실행:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

또는 프로필드에 설치:

```bash
nix profile install github:Fission-AI/OpenSpec
```

또는 flake.nix에 개발 환경으로 추가:

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

## 업데이트

패키지를 업그레이드한 다음, 각 프로젝트의 생성된 파일을 새로 고칩니다:

```bash
npm install -g @fission-ai/openspec@latest   # or pnpm/yarn/bun equivalent
openspec update                              # run inside each project
```

`openspec update`는 구성한 도구에 대한 스킬 및 명령 파일을 재생성하므로, 슬래시 명령어(slash commands)가 설치된 버전과 일치하게 유지됩니다.

## 제거

`openspec uninstall` 명령은 없습니다. 왜냐하면 OpenSpec은 전역 패키지와 프로젝트 내의 일부 파일로만 구성되어 있기 때문입니다. 제거는 몇 가지 수동 단계를 거쳐야 하며, 여기서 수행하는 어떤 작업도 소스 코드를 건드리지 않습니다.

**1. 전역 패키지 제거:**

```bash
npm uninstall -g @fission-ai/openspec   # or: pnpm rm -g / yarn global remove / bun rm -g
```

**2. 프로젝트에서 OpenSpec 제거 (선택 사항).** 더 이상 해당 스펙과 변경 사항이 필요하지 않다면 `openspec/` 디렉터리를 삭제합니다:

```bash
rm -rf openspec/
```

신중하게 결정하십시오: `openspec/specs/`와 `openspec/changes/archive/`는 시스템이 어떻게 작동했고 왜 변경되었는지에 대한 기록입니다. 해당 기록을 보관하고 싶다면, 제거 후에도 폴더를 유지하거나 (git에 보관) 유지하십시오.

**3. 생성된 AI 도구 파일 제거 (선택 사항).** OpenSpec은 `.claude/skills/openspec-*/`, `.cursor/commands/opsx-*`와 같은 도구별 디렉터리에 스킬 및 명령 파일을 작성합니다. 구성한 도구에 대해 `openspec-*` 스킬과 `opsx-*` 명령을 삭제하십시오. 도구별 정확한 경로는 [Supported Tools](supported-tools.md)에 나와 있습니다.

만약 `CLAUDE.md` 또는 `AGENTS.md`와 같은 파일에 OpenSpec 마커 블록이 있다면, 수동으로 해당 블록을 제거하십시오. 해당 파일 내의 본인 콘텐츠는 보존하시면 됩니다.

## 다음 단계

설치 후 프로젝트에서 OpenSpec을 초기화합니다:

```bash
cd your-project
openspec init
```

전체 워크스루는 [Getting Started](getting-started.md)를 참조하십시오.