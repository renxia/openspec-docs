# Instalacja

## Wymagania wstępne

- **Node.js 20.19.0 lub nowszy** — Sprawdź swoją wersję za pomocą: `node --version`

## Menedżerowie pakietów

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

Bun może zainstalować OpenSpec globalnie, ale OpenSpec działa obecnie na Node.js.
Wciąż potrzebujesz Node.js 20.19.0 lub nowszy dostępny w zmiennej `PATH`.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Uruchom OpenSpec bezpośrednio bez instalacji:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Lub zainstaluj do swojego profilu:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Lub dodaj do środowiska deweloperskiego w `flake.nix`:

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

## Weryfikacja instalacji

```bash
openspec --version
```

## Aktualizacja

Zaktualizuj pakiet, a następnie odśwież pliki wygenerowane dla każdego projektu:

```bash
npm install -g @fission-ai/openspec@latest   # lub odpowiednik pnpm/yarn/bun
openspec update                              # uruchom wewnątrz każdego projektu
```

`openspec update` regeneruje pliki umiejętności (skill) i komend dla skonfigurowanych narzędzi, dzięki czemu Twoje polecenia ukośne pozostają zgodne z zainstalowaną wersją.

## Odinstalowanie

Nie ma komendy `openspec uninstall`, ponieważ OpenSpec jest tylko pakietem globalnym wraz z kilkoma plikami w Twoim projekcie. Usunięcie go wymaga kilku ręcznych kroków, a nic z tego nie dotyka kodu źródłowego.

**1. Usuń pakiet globalny:**

```bash
npm uninstall -g @fission-ai/openspec   # lub: pnpm rm -g / yarn global remove / bun rm -g
```

**2. Usuń OpenSpec z projektu (opcjonalnie).** Usuń katalog `openspec/`, jeśli nie chcesz już jego specyfikacji i zmian:

```bash
rm -rf openspec/
```

Pomyśl, zanim to zrobisz: `openspec/specs/` i `openspec/changes/archive/` stanowią zapis zachowania systemu i powodów zmian. Jeśli możesz chcieć tę historię, zachowaj folder (lub przechowaj go w git), nawet po odinstalowaniu.

**3. Usuń wygenerowane pliki narzędzi AI (opcjonalnie).** OpenSpec zapisuje pliki umiejętności i komend w katalogach dla każdego narzędzia, takich jak `.claude/skills/openspec-*/`, `.cursor/commands/opsx-*`, itp. Usuń umiejętności `openspec-*` oraz komendy `opsx-*` dla skonfigurowanych narzędzi. Dokładne ścieżki dla każdego narzędzia są wymienione w [Supported Tools](supported-tools.md).

Jeśli masz również bloki znacznika OpenSpec w plikach takich jak `CLAUDE.md` lub `AGENTS.md`, usuń te bloki ręcznie; Twoja własna zawartość w tych plikach jest Twoja i możesz ją zachować.

## Następne kroki

Po instalacji zainicjuj OpenSpec w swoim projekcie:

```bash
cd your-project
openspec init
```

Zobacz [Getting Started](getting-started.md), aby przejrzeć całą procedurę.