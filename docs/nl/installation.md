# Installatie

## Vereisten

- **Node.js 20.19.0 of hoger** — Controleer uw versie: `node --version`

## Package Managers

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

Bun kan OpenSpec globaal installeren, maar OpenSpec draait momenteel op Node.js.
U heeft nog steeds Node.js 20.19.0 of hoger nodig dat beschikbaar is in de `PATH`.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Voer OpenSpec direct uit zonder installatie:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Of installeer naar uw profiel:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Of voeg toe aan uw ontwikkelomgeving in `flake.nix`:

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

## Controleer de Installatie

```bash
openspec --version
```

## Bijwerken

Upgrade het pakket en vernieuw vervolgens de gegenereerde bestanden van elk project:

```bash
npm install -g @fission-ai/openspec@latest   # of pnpm/yarn/bun equivalent
openspec update                              # voer uit binnen elk project
```

`openspec update` genereert opnieuw de skill- en commando-bestanden voor de door u geconfigureerde tools, zodat uw slash-commando's up-to-date zijn met de geïnstalleerde versie.

## Deinstalleren

Er bestaat geen `openspec uninstall` commando, omdat OpenSpec slechts een globaal pakket is plus enkele bestanden in uw project. Het verwijderen ervan vereist enkele handmatige stappen, en niets hier raakt uw broncode aan.

**1. Verwijder het globale pakket:**

```bash
npm uninstall -g @fission-ai/openspec   # of: pnpm rm -g / yarn global remove / bun rm -g
```

**2. Verwijder OpenSpec uit een project (optioneel).** Verwijder de `openspec/` map als u zijn specificaties en wijzigingen niet langer wilt:

```bash
rm -rf openspec/
```

Denk na voordat u dit doet: `openspec/specs/` en `openspec/changes/archive/` zijn uw verslag van hoe het systeem zich gedraagt en waarom het is veranderd. Als u die geschiedenis mogelijk wilt behouden, bewaar de map (of bewaar deze in git) zelfs na deinstallatie.

**3. Verwijder de gegenereerde AI toolbestanden (optioneel).** OpenSpec schrijft skill- en commando-bestanden naar per-tool mappen zoals `.claude/skills/openspec-*`, `.cursor/commands/opsx-*`, enzovoort. Verwijder de `openspec-*` skills en `opsx-*` commando's voor de door u geconfigureerde tools. De exacte paden per tool staan vermeld in [Supported Tools](supported-tools.md).

Als u ook OpenSpec markerblokken heeft in bestanden zoals `CLAUDE.md` of `AGENTS.md`, verwijder die blokken handmatig; uw eigen inhoud in deze bestanden blijft van u.

## Volgende Stappen

Na de installatie, initialiseer OpenSpec in uw project:

```bash
cd your-project
openspec init
```

Zie [Getting Started](getting-started.md) voor een volledige handleiding.