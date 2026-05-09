---
layout: home

hero:
  name: "OpenSpec"
  text: "Desenvolvimento Orientado por Especificação para Assistentes de IA"
  tagline: Uma especificação leve para construir e gerenciar projetos de assistentes de IA.
  actions:
    - theme: brand
      text: Começar
      link: ./getting-started
    - theme: alt
      text: Início
      link: /

features:
  - title: Fluxo de Trabalho Spec-First
    details: Defina os requisitos antes de escrever o código.
  - title: Design Nativo para IA
    details: Construído para Claude Code, Cursor, Windsurf e mais.
  - title: Multi-idioma
    details: Documentação disponível em vários idiomas.
---


Nossa filosofia:

```text
→ fluido não rígido
→ iterativo não cascata
→ fácil não complexo
→ construído para brownfield não apenas greenfield
→ escalável de projetos pessoais a empresas
```

> [!TIP]
> **Novo fluxo de trabalho agora disponível!** Reconstruímos o OpenSpec com um novo fluxo orientado por artefatos.
>
> Execute `/opsx:propose "sua ideia"` para começar. → [Saiba mais aqui](opsx.md)

<p align="center">
  Siga <a href="https://x.com/0xTab">@0xTab no X</a> para atualizações · Junte-se ao <a href="https://discord.gg/YctCnvvshC">Discord do OpenSpec</a> para ajuda e perguntas.
</p>

## Veja em ação

```text
Você: /opsx:propose add-dark-mode
IA:  Criado openspec/changes/add-dark-mode/
     ✓ proposal.md — por que estamos fazendo isso, o que está mudando
     ✓ specs/       — requisitos e cenários
     ✓ design.md    — abordagem técnica
     ✓ tasks.md     — lista de implementação
     Pronto para implementação!

Você: /opsx:apply
IA:  Implementando tarefas...
     ✓ 1.1 Adicionar provedor de contexto de tema
     ✓ 1.2 Criar componente de alternância
     ✓ 2.1 Adicionar variáveis CSS
     ✓ 2.2 Conectar localStorage
     Todas as tarefas concluídas!

Você: /opsx:archive
IA:  Arquivado em openspec/changes/archive/2025-01-23-add-dark-mode/
     Especificações atualizadas. Pronto para o próximo recurso.
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

Agora diga à sua IA: `/opsx:propose <o-que-você-quer-construir>`

Se você quiser o fluxo de trabalho expandido (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), selecione-o com `openspec config profile` e aplique com `openspec update`.

> [!NOTE]
> Não tem certeza se sua ferramenta é suportada? [Veja a lista completa](supported-tools.md) – suportamos mais de 25 ferramentas e estamos crescendo.
>
> Também funciona com pnpm, yarn, bun e nix. [Veja as opções de instalação](installation.md).

## Documentação

→ **[Primeiros Passos](getting-started.md)**: primeiros passos<br>
→ **[Fluxos de Trabalho](workflows.md)**: combinações e padrões<br>
→ **[Comandos](commands.md)**: comandos slash e habilidades<br>
→ **[CLI](cli.md)**: referência do terminal<br>
→ **[Ferramentas Suportadas](supported-tools.md)**: integrações de ferramentas e caminhos de instalação<br>
→ **[Conceitos](concepts.md)**: como tudo se encaixa<br>
→ **[Multi-idioma](multi-language.md)**: suporte multi-idioma<br>
→ **[Personalização](customization.md)**: personalize como quiser


## Por que OpenSpec?

Assistentes de codificação com IA são poderosos, mas imprevisíveis quando os requisitos vivem apenas no histórico do chat. O OpenSpec adiciona uma camada leve de especificação para que você concorde sobre o que construir antes que qualquer código seja escrito.

- **Concorde antes de construir** — humano e IA alinham-se nas especificações antes do código ser escrito
- **Mantenha-se organizado** — cada alteração recebe sua própria pasta com proposta, especificações, design e tarefas
- **Trabalhe de forma fluida** — atualize qualquer artefato a qualquer momento, sem portões de fase rígidos
- **Use suas ferramentas** — funciona com mais de 20 assistentes de IA via comandos slash

### Como nos comparamos

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Completo, mas pesado. Portões de fase rígidos, muito Markdown, configuração Python. O OpenSpec é mais leve e permite iteração livre.

**vs. [Kiro](https://kiro.dev)** (AWS) — Poderoso, mas você fica preso ao IDE deles e limitado aos modelos Claude. O OpenSpec funciona com as ferramentas que você já usa.

**vs. nada** — Codificação com IA sem especificações significa prompts vagos e resultados imprevisíveis. O OpenSpec traz previsibilidade sem a cerimônia.

## Atualizando o OpenSpec

**Atualize o pacote**

```bash
npm install -g @fission-ai/openspec@latest
```

**Atualize as instruções do agente**

Execute isso dentro de cada projeto para regerar a orientação da IA e garantir que os comandos slash mais recentes estejam ativos:

```bash
openspec update
```

## Notas de Uso

**Seleção de modelo**: O OpenSpec funciona melhor com modelos de alto raciocínio. Recomendamos Opus 4.5 e GPT 5.2 tanto para planejamento quanto para implementação.

**Higiene de contexto**: O OpenSpec se beneficia de uma janela de contexto limpa. Limpe seu contexto antes de iniciar a implementação e mantenha uma boa higiene de contexto durante toda a sua sessão.

## Contribuindo

**Correções pequenas** — Correções de bugs, correções de erros de digitação e melhorias menores podem ser enviadas diretamente como PRs.

**Alterações maiores** — Para novos recursos, refatorações significativas ou alterações arquitetônicas, envie primeiro uma proposta de alteração do OpenSpec para que possamos alinhar a intenção e os objetivos antes que a implementação comece.

Ao escrever propostas, tenha em mente a filosofia do OpenSpec: servimos uma ampla variedade de usuários em diferentes agentes de codificação, modelos e casos de uso. As alterações devem funcionar bem para todos.

**Código gerado por IA é bem-vindo** — desde que tenha sido testado e verificado. PRs contendo código gerado por IA devem mencionar o agente de codificação e o modelo usados (por exemplo, "Gerado com Claude Code usando claude-opus-4-5-20251101").

### Desenvolvimento

- Instale as dependências: `pnpm install`
- Construa: `pnpm run build`
- Teste: `pnpm test`
- Desenvolva o CLI localmente: `pnpm run dev` ou `pnpm run dev:cli`
- Commits convencionais (uma linha): `type(scope): subject`

## Outros

<details>
<summary><strong>Telemetria</strong></summary>

O OpenSpec coleta estatísticas de uso anônimas.

Coletamos apenas nomes de comandos e versão para entender padrões de uso. Nenhum argumento, caminho, conteúdo ou PII. Desativado automaticamente em CI.

**Desativar:** `export OPENSPEC_TELEMETRY=0` ou `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>Mantenedores e Consultores</strong></summary>

Veja [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) para a lista de mantenedores principais e consultores que ajudam a orientar o projeto.

</details>



## Licença

MIT