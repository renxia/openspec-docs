# Установка

## Предварительные требования

- **Node.js 20.19.0 или выше** — Проверьте вашу версию: `node --version`

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

Bun может установить OpenSpec глобально, но в настоящее время OpenSpec работает на Node.js.
Вам по-прежнему необходимо иметь доступ к Node.js 20.19.0 или выше через `PATH`.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Запустите OpenSpec напрямую без установки:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Или установите в свой профиль:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Или добавьте в свою среду разработки в `flake.nix`:

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

## Обновление

Обновите пакет, а затем обновите сгенерированные файлы каждого проекта:

```bash
npm install -g @fission-ai/openspec@latest   # или эквивалент pnpm/yarn/bun
openspec update                              # запустить внутри каждого проекта
```

`openspec update` перегенерирует файлы навыков (skill) и команд для настроенных вами инструментов, чтобы ваши команды слэш (slash commands) соответствовали установленной версии.

## Удаление

Команды `openspec uninstall` нет, поскольку OpenSpec — это просто глобальный пакет плюс некоторые файлы в вашем проекте. Его удаление требует нескольких ручных шагов, и ничто из этого не затрагивает ваш исходный код.

**1. Удалите глобальный пакет:**

```bash
npm uninstall -g @fission-ai/openspec   # или: pnpm rm -g / yarn global remove / bun rm -g
```

**2. Удалите OpenSpec из проекта (необязательно).** Удалите директорию `openspec/`, если вам больше не нужны его спецификации и изменения:

```bash
rm -rf openspec/
```

Подумайте, прежде чем это сделать: `openspec/specs/` и `openspec/changes/archive/` — это ваша запись о том, как работает система и почему она изменилась. Если вы можете захотеть эту историю, сохраните папку (или сохраните ее в git) даже после удаления.

**3. Удалите сгенерированные файлы AI-инструментов (необязательно).** OpenSpec записывает файлы навыков и команд в директории для каждого инструмента, такие как `.claude/skills/openspec-*/`, `.cursor/commands/opsx-*` и т.д. Удалите навыки `openspec-*` и команды `opsx-*` для тех инструментов, которые вы настроили. Точные пути для каждого инструмента перечислены в [Supported Tools](supported-tools.md).

Если у вас также есть маркеры OpenSpec в файлах, таких как `CLAUDE.md` или `AGENTS.md`, удалите эти блоки вручную; ваш собственный контент в этих файлах остается за вами.

## Следующие шаги

После установки инициализируйте OpenSpec в своем проекте:

```bash
cd your-project
openspec init
```

См. [Getting Started](getting-started.md) для полного руководства.