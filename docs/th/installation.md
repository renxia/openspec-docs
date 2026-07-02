# การติดตั้ง

## ข้อกำหนดเบื้องต้น

- **Node.js 20.19.0 หรือสูงกว่า** — ตรวจสอบเวอร์ชันของคุณ: `node --version`

## ตัวจัดการแพ็กเกจ (Package Managers)

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

Bun สามารถติดตั้ง OpenSpec แบบ Global ได้ แต่ปัจจุบัน OpenSpec ทำงานบน Node.js คุณยังคงต้องมี Node.js 20.19.0 หรือสูงกว่าที่พร้อมใช้งานใน `PATH`

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

เรียกใช้ OpenSpec โดยตรงโดยไม่ต้องติดตั้ง:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

หรือติดตั้งเข้าสู่โปรไฟล์ของคุณ:

```bash
nix profile install github:Fission-AI/OpenSpec
```

หรือเพิ่มในสภาพแวดล้อมการพัฒนาด้วย `flake.nix`:

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

## การตรวจสอบการติดตั้ง

```bash
openspec --version
```

## การอัปเดต (Updating)

อัปเกรดแพ็กเกจ จากนั้นให้รีเฟรชไฟล์ที่สร้างขึ้นสำหรับแต่ละโปรเจกต์:

```bash
npm install -g @fission-ai/openspec@latest   # หรือเทียบเท่าด้วย pnpm/yarn/bun
openspec update                              # รันภายในแต่ละโปรเจกต์
```

`openspec update` จะทำการสร้างไฟล์ skill และ command ใหม่สำหรับเครื่องมือที่คุณกำหนดค่าไว้ ทำให้คำสั่ง slash ของคุณเป็นปัจจุบันตามเวอร์ชันที่ติดตั้ง

## การถอนการติดตั้ง (Uninstalling)

ไม่มีคำสั่ง `openspec uninstall` เนื่องจาก OpenSpec เป็นเพียงแพ็กเกจแบบ Global บวกกับไฟล์บางส่วนในโปรเจกต์ของคุณ การลบจึงต้องทำหลายขั้นตอนด้วยตนเอง และไม่มีสิ่งใดในนี้ที่จะไปยุ่งกับซอร์สโค้ดของคุณ

**1. ลบแพ็กเกจแบบ Global:**

```bash
npm uninstall -g @fission-ai/openspec   # หรือ: pnpm rm -g / yarn global remove / bun rm -g
```

**2. ลบ OpenSpec ออกจากโปรเจกต์ (ไม่บังคับ).** ลบไดเร็กทอรี `openspec/` หากคุณไม่ต้องการ specs และการเปลี่ยนแปลงใดๆ ของมันอีกต่อไป:

```bash
rm -rf openspec/
```

โปรดคิดให้ดีก่อนดำเนินการ: `openspec/specs/` และ `openspec/changes/archive/` คือบันทึกว่าระบบทำงานอย่างไรและทำไม่มันถึงเปลี่ยนไป หากคุณอาจต้องการประวัติเหล่านั้น ให้เก็บโฟลเดอร์ไว้ (หรือเก็บไว้ใน git) แม้หลังจากถอนการติดตั้งแล้ว

**3. ลบไฟล์เครื่องมือ AI ที่สร้างขึ้น (ไม่บังคับ).** OpenSpec จะเขียนไฟล์ skill และ command ลงในไดเร็กทอรีต่อเครื่องมือ เช่น `.claude/skills/openspec-*/`, `.cursor/commands/opsx-*` เป็นต้น ให้ลบ skills `openspec-*` และ commands `opsx-*` สำหรับเครื่องมือที่คุณกำหนดค่าไว้ เส้นทางที่แน่นอนสำหรับแต่ละเครื่องมือระบุอยู่ใน [Supported Tools](supported-tools.md)

หากคุณมีบล็อก marker ของ OpenSpec ในไฟล์เช่น `CLAUDE.md` หรือ `AGENTS.md` ให้ลบบล็อกเหล่านั้นด้วยตนเอง เนื้อหาของคุณในไฟล์เหล่านั้นเป็นสิ่งที่คุณต้องเก็บรักษาไว้

## ขั้นตอนต่อไป (Next Steps)

หลังจากการติดตั้ง ให้ทำการ initialize OpenSpec ในโปรเจกต์ของคุณ:

```bash
cd your-project
openspec init
```

ดู [Getting Started](getting-started.md) สำหรับคำแนะนำแบบเต็มรูปแบบ