# Instalação

## Pré-requisitos

- **Node.js 20.19.0 ou superior** — Verifique sua versão: `node --version`

## Gerenciadores de Pacote

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

O Bun pode instalar o OpenSpec globalmente, mas o OpenSpec atualmente roda no Node.js. Você ainda precisa ter o Node.js 20.19.0 ou superior disponível no `PATH`.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Execute o OpenSpec diretamente sem instalação:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Ou instale no seu perfil:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Ou adicione ao seu ambiente de desenvolvimento em `flake.nix`:

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

## Verificar Instalação

```bash
openspec --version
```

## Atualização

Atualize o pacote e, em seguida, atualize os arquivos gerados de cada projeto:

```bash
npm install -g @fission-ai/openspec@latest   # ou equivalente pnpm/yarn/bun
openspec update                              # execute dentro de cada projeto
```

`openspec update` regenera os arquivos de skill e comando para as ferramentas que você configurou, garantindo que seus comandos slash permaneçam atualizados com a versão instalada.

## Desinstalação

Não existe um comando `openspec uninstall`, porque o OpenSpec é apenas um pacote global mais alguns arquivos no seu projeto. A remoção envolve algumas etapas manuais, e nada aqui toca no seu código-fonte.

**1. Remova o pacote global:**

```bash
npm uninstall -g @fission-ai/openspec   # ou: pnpm rm -g / yarn global remove / bun rm -g
```

**2. Remova o OpenSpec de um projeto (opcional).** Exclua o diretório `openspec/` se você não quiser mais seus specs e mudanças:

```bash
rm -rf openspec/
```

Pense bem antes de fazer isso: `openspec/specs/` e `openspec/changes/archive/` são seu registro de como o sistema se comporta e por que ele mudou. Se você puder querer esse histórico, mantenha a pasta (ou mantenha no git) mesmo após a desinstalação.

**3. Remova os arquivos de ferramenta de IA gerados (opcional).** O OpenSpec escreve arquivos de skill e comando em diretórios por ferramenta, como `.claude/skills/openspec-*`, `.cursor/commands/opsx-*`, e assim por diante. Exclua os skills `openspec-*` e os comandos `opsx-*` para as ferramentas que você configurou. Os caminhos exatos por ferramenta estão listados em [Ferramentas Suportadas](supported-tools.md).

Se você também tiver blocos de marcação do OpenSpec em arquivos como `CLAUDE.md` ou `AGENTS.md`, remova esses blocos manualmente; o conteúdo próprio nos seus arquivos é seu para manter.

## Próximos Passos

Após a instalação, inicialize o OpenSpec no seu projeto:

```bash
cd your-project
openspec init
```

Consulte [Primeiros Passos](getting-started.md) para um guia completo.