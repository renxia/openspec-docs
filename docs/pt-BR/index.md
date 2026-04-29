---
layout: home

hero:
  name: "OpenSpec"
  text: "Desenvolvimento Orientado a Especificações para Assistentes de IA"
  tagline: Uma especificação leve para construir e gerenciar projetos de assistentes de IA.
  actions:
    - theme: brand
      text: Começar
      link: ./getting-started
    - theme: alt
      text: Início
      link: /

features:
  - title: Fluxo de Trabalho com Especificação em Primeiro Lugar
    details: Defina requisitos antes de escrever código.
  - title: Design Nativo para IA
    details: Construído para Claude Code, Cursor, Windsurf e mais.
  - title: Multi-Idioma
    details: Documentação disponível em vários idiomas.
---


<details>
<summary><strong>O framework de especificação mais amado.</strong></summary>

[![Stars](https://img.shields.io/github/stars/Fission-AI/OpenSpec?style=flat-square&label=Stars)](https://github.com/Fission-AI/OpenSpec/stargazers)
[![Downloads](https://img.shields.io/npm/dm/@fission-ai/openspec?style=flat-square&label=Downloads/mo)](https://www.npmjs.com/package/@fission-ai/openspec)
[![Contributors](https://img.shields.io/github/contributors/Fission-AI/OpenSpec?style=flat-square&label=Contributors)](https://github.com/Fission-AI/OpenSpec/graphs/contributors)

</details>
<p></p>
Nossa filosofia:

```text
→ fluido, não rígido
→ iterativo, não em cascata
→ fácil, não complexo
→ construído para terrenos já desenvolvidos, não apenas para novos projetos
→ escalável de projetos pessoais a empresas
```

> [!TIP]
> **Novo fluxo de trabalho disponível!** Reconstruímos o OpenSpec com um novo fluxo de trabalho orientado por artefatos.
>
> Execute `/opsx:propose "sua ideia"` para começar. → [Saiba mais aqui](opsx.md)

<p align="center">
  Siga <a href="https://x.com/0xTab">@0xTab no X</a> para atualizações · Junte-se ao <a href="https://discord.gg/YctCnvvshC">Discord do OpenSpec</a> para ajuda e perguntas.
</p>

<!-- TODO: Adicionar demonstração em GIF do fluxo /opsx:propose → /opsx:archive -->

## Veja em ação

```text
Você: /opsx:propose add-dark-mode
IA:   Criado openspec/changes/add-dark-mode/
      ✓ proposal.md — por que estamos fazendo isso, o que está mudando
      ✓ specs/       — requisitos e cenários
      ✓ design.md    — abordagem técnica
      ✓ tasks.md     — checklist de implementação
      Pronto para implementação!

Você: /opsx:apply
IA:   Implementando tarefas...
      ✓ 1.1 Adicionar provedor de contexto de tema
      ✓ 1.2 Criar componente de alternância
      ✓ 2.1 Adicionar variáveis CSS
      ✓ 2.2 Integrar com localStorage
      Todas as tarefas concluídas!

Você: /opsx:archive
IA:   Arquivado em openspec/changes/archive/2025-01-23-add-dark-mode/
      Especificações atualizadas. Próxima funcionalidade.
```

<details>
<summary><strong>Painel do OpenSpec</strong></summary>

</details>

## Início Rápido

**Requer Node.js 20.19.0 ou superior.**

Instale o OpenSpec globalmente:

```bash
npm install -g @fission-ai/openspec@latest
```

Em seguida, navegue até o diretório do seu projeto e inicialize:

```bash
cd seu-projeto
openspec init
```

Agora digite para sua IA: `/opsx:propose <o-que-você-quer-construir>`

Se você deseja o fluxo de trabalho expandido (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), selecione-o com `openspec config profile` e aplique com `openspec update`.

> [!NOTE]
> Não tem certeza se sua ferramenta é suportada? [Veja a lista completa](supported-tools.md) – suportamos mais de 25 ferramentas e estamos crescendo.
>
> Também funciona com pnpm, yarn, bun e nix. [Veja as opções de instalação](installation.md).

## Documentação

→ **[Primeiros Passos](getting-started.md)**: primeiros passos<br>
→ **[Fluxos de Trabalho](workflows.md)**: combinações e padrões<br>
→ **[Comandos](commands.md)**: comandos de barra e habilidades<br>
→ **[CLI](cli.md)**: referência do terminal<br>
→ **[Ferramentas Suportadas](supported-tools.md)**: integrações e caminhos de instalação<br>
→ **[Conceitos](concepts.md)**: como tudo se encaixa<br>
→ **[Multi-Idioma](multi-language.md)**: suporte a múltiplos idiomas<br>
→ **[Personalização](customization.md)**: faça do seu jeito


## Por que OpenSpec?

Assistentes de codificação com IA são poderosos, mas imprevisíveis quando os requisitos vivem apenas no histórico de chat. O OpenSpec adiciona uma camada leve de especificação para que você concorde sobre o que construir antes que qualquer código seja escrito.

- **Concorda antes de construir** — humano e IA alinham-se nas especificações antes que o código seja escrito
- **Mantenha-se organizado** — cada alteração recebe sua própria pasta com proposta, especificações, design e tarefas
- **Trabalhe de forma fluida** — atualize qualquer artefato a qualquer momento, sem bloqueios de fase rígidos
- **Use suas ferramentas** — funciona com mais de 20 assistentes de IA via comandos de barra

### Como nos comparamos

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Completo, mas pesado. Bloqueios de fase rígidos, muita Markdown, configuração em Python. O OpenSpec é mais leve e permite que você itere livremente.

**vs. [Kiro](https://kiro.dev)** (AWS) — Poderoso, mas você fica preso ao IDE deles e limitado aos modelos Claude. O OpenSpec funciona com as ferramentas que você já usa.

**vs. nada** — Codificação com IA sem especificações significa prompts vagos e resultados imprevisíveis. O OpenSpec traz previsibilidade sem a formalidade.

## Atualizando o OpenSpec

**Atualize o pacote**

```bash
npm install -g @fission-ai/openspec@latest
```

**Atualize as instruções do agente**

Execute isso dentro de cada projeto para regenerar as orientações da IA e garantir que os últimos comandos de barra estejam ativos:

```bash
openspec update
```

## Notas de Uso

**Seleção de modelo**: O OpenSpec funciona melhor com modelos de alto raciocínio. Recomendamos Opus 4.5 e GPT 5.2 tanto para planejamento quanto para implementação.

**Higiene de contexto**: O OpenSpec se beneficia de uma janela de contexto limpa. Limpe seu contexto antes de iniciar a implementação e mantenha boa higiene de contexto durante toda a sessão.

## Contribuindo

**Pequenas correções** — Correções de bugs, correções de erros de digitação e melhorias menores podem ser enviadas diretamente como PRs.

**Alterações maiores** — Para novas funcionalidades, refatorações significativas ou alterações arquiteturais, por favor, envie primeiro uma proposta de alteração do OpenSpec para que possamos alinhar intenção e objetivos antes que a implementação comece.

Ao escrever propostas, lembre-se da filosofia do OpenSpec: servimos uma ampla variedade de usuários em diferentes agentes de codificação, modelos e casos de uso. As alterações devem funcionar bem para todos.

**Código gerado por IA é bem-vindo** — desde que tenha sido testado e verificado. PRs contendo código gerado por IA devem mencionar o agente de codificação e o modelo utilizado (ex., "Gerado com Claude Code usando claude-opus-4-5-20251101").

### Desenvolvimento

- Instale dependências: `pnpm install`
- Compile: `pnpm run build`
- Teste: `pnpm test`
- Desenvolva a CLI localmente: `pnpm run dev` ou `pnpm run dev:cli`
- Commits convencionais (uma linha): `type(scope): subject`

## Outros

<details>
<summary><strong>Telemetria</strong></summary>

O OpenSpec coleta estatísticas de uso anônimas.

Coletamos apenas nomes de comandos e versão para entender padrões de uso. Nenhum argumento, caminho, conteúdo ou dados pessoais. Desativado automaticamente em CI.

**Desativar:** `export OPENSPEC_TELEMETRY=0` ou `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>Mantenedores & Consultores</strong></summary>

Veja [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) para a lista de mantenedores principais e consultores que ajudam a guiar o projeto.

</details>



## Licença

MIT