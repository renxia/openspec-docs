# Встановлення

## Передумови

- **Node.js 20.19.0 або вище** — Перевірте вашу версію за допомогою: `node --version`

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

Bun може встановити OpenSpec глобально, але наразі OpenSpec працює на Node.js.
Вам все ще потрібен Node.js 20.19.0 або вище, доступний у `PATH`.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Запустіть OpenSpec без встановлення:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Або встановіть його у свій профіль:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Або додайте до свого середовища розробки у `flake.nix`:

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

## Оновлення

Оновіть пакет, а потім оновіть згенеровані файли кожного проєкту:

```bash
npm install -g @fission-ai/openspec@latest   # або pnpm/yarn/bun еквівалент
openspec update                              # виконати всередині кожного проєкту
```

`openspec update` генерує файли навичок (skill) та команд для конфігурованих вами інструментів, щоб ваші слеш-команди залишалися актуальними з встановленою версією.

## Видалення

Немає команди `openspec uninstall`, оскільки OpenSpec — це просто глобальний пакет плюс деякі файли у вашому проєкті. Видалення вимагає кількох ручних кроків, і жодна з цих дій не торкається вашого вихідного коду.

**1. Видаліть глобальний пакет:**

```bash
npm uninstall -g @fission-ai/openspec   # або: pnpm rm -g / yarn global remove / bun rm -g
```

**2. Видаліть OpenSpec з проєкту (необов'язково).** Видаліть директорію `openspec/`, якщо ви більше не хочете його специфікацій та змін:

```bash
rm -rf openspec/
```

Подумайте перед цим: `openspec/specs/` та `openspec/changes/archive/` є вашим записом того, як поводиться система і чому вона змінилася. Якщо ви можете захотіти цю історію, збережіть папку (або зберігайте її в git) навіть після видалення.

**3. Видаліть згенеровані файли AI-інструментів (необов'язково).** OpenSpec записує файли навичок та команд у директорії для кожного інструменту, такі як `.claude/skills/openspec-*/`, `.cursor/commands/opsx-*`, і так далі. Видаліть навички `openspec-*` та команди `opsx-*` для тих інструментів, які ви конфігурували. Точні шляхи для кожного інструменту перераховані у [Supported Tools](supported-tools.md).

Якщо у вас також є маркери OpenSpec у файлах, таких як `CLAUDE.md` або `AGENTS.md`, видаліть ці блоки вручну; ваш власний контент у цих файлах належить вам.

## Наступні кроки

Після встановлення ініціалізуйте OpenSpec у своєму проєкті:

```bash
cd your-project
openspec init
```

Дивіться [Getting Started](getting-started.md) для повного посібника.