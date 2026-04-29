# การติดตั้ง

## ข้อกำหนดเบื้องต้น

- **Node.js เวอร์ชัน 20.19.0 ขึ้นไป** — ตรวจสอบเวอร์ชันของคุณ: `node --version`

## ตัวจัดการแพ็กเกจ

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

เรียกใช้ OpenSpec โดยตรงโดยไม่ต้องติดตั้ง:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

หรือติดตั้งลงในโปรไฟล์ของคุณ:

```bash
nix profile install github:Fission-AI/OpenSpec
```

หรือเพิ่มลงในสภาพแวดล้อมการพัฒนาของคุณในไฟล์ `flake.nix`:

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

## ตรวจสอบการติดตั้ง

```bash
openspec --version
```

## ขั้นตอนถัดไป

หลังจากติดตั้งแล้ว ให้เริ่มต้นใช้งาน OpenSpec ในโปรเจกต์ของคุณ:

```bash
cd your-project
openspec init
```

ดู [เริ่มต้นใช้งาน](getting-started.md) สำหรับคำแนะนำโดยละเอียด