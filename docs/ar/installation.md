# التثبيت

## المتطلبات المسبقة

- **Node.js 20.19.0 أو أعلى** — تحقق من الإصدار الخاص بك: `node --version`

## مديري الحزم

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

يمكن لـ Bun تثبيت OpenSpec عالميًا، لكن OpenSpec يعمل حاليًا على Node.js. ما زلت بحاجة إلى توفر Node.js 20.19.0 أو أعلى في المسار (`PATH`).

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

تشغيل OpenSpec مباشرة دون تثبيت:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

أو التثبيت في ملفك الشخصي:

```bash
nix profile install github:Fission-AI/OpenSpec
```

أو الإضافة إلى بيئة التطوير الخاصة بك في `flake.nix`:

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

## التحديث

ترقية الحزمة، ثم تحديث الملفات المُنشأة لكل مشروع:

```bash
npm install -g @fission-ai/openspec@latest   # أو ما يعادله باستخدام pnpm/yarn/bun
openspec update                              # قم بتشغيلها داخل كل مشروع
```

يقوم `openspec update` بإعادة إنشاء ملفات المهارة والأوامر للأدوات التي قمت بتكوينها، بحيث تظل أوامر الشرطة (slash commands) الخاصة بك متوافقة مع الإصدار المثبت.

## إلغاء التثبيت

لا يوجد أمر `openspec uninstall`، لأن OpenSpec هو مجرد حزمة عالمية بالإضافة إلى بعض الملفات في مشروعك. تتضمن إزالته عدة خطوات يدوية، ولا شيء مما يلي يمس شيفرة المصدر الخاصة بك.

**1. إزالة الحزمة العالمية:**

```bash
npm uninstall -g @fission-ai/openspec   # أو: pnpm rm -g / yarn global remove / bun rm -g
```

**2. إزالة OpenSpec من مشروع (اختياري).** احذف الدليل `openspec/` إذا لم تعد بحاجة إلى مواصفاته وتغييراته:

```bash
rm -rf openspec/
```

فكّر قبل القيام بذلك: `openspec/specs/` و `openspec/changes/archive/` هي سجل لكيفية تصرف النظام ولماذا تغير. إذا كنت قد ترغب في الاحتفاظ بهذا التاريخ، فاحتفظ بالدليل (أو احتفظ به في git) حتى بعد إلغاء التثبيت.

**3. إزالة ملفات أدوات الذكاء الاصطناعي المُنشأة (اختياري).** يكتب OpenSpec ملفات المهارة والأوامر في أدلة خاصة بكل أداة مثل `.claude/skills/openspec-*/` و `.cursor/commands/opsx-*`، وما إلى ذلك. احذف مهارات `openspec-*` وأوامر `opsx-*` للأدوات التي قمت بتكوينها. يتم سرد المسارات الدقيقة لكل أداة في [الأدوات المدعومة](supported-tools.md).

إذا كان لديك أيضًا كتل علامات (marker blocks) الخاصة بـ OpenSpec في ملفات مثل `CLAUDE.md` أو `AGENTS.md`، فقم بإزالة تلك الكتل يدويًا؛ المحتوى الخاص بك في تلك الملفات هو ملكك.

## الخطوات التالية

بعد التثبيت، قم بتهيئة (initialize) OpenSpec في مشروعك:

```bash
cd your-project
openspec init
```

راجع [البدء](getting-started.md) للحصول على شرح كامل.