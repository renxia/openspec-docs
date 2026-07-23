---
layout: home

hero:
  name: "OpenSpec"
  text: "Desenvolvimento Orientado por Especificações para Assistentes de IA"
  tagline: Uma especificação leve para construir e gerenciar projetos de assistentes de IA.
  actions:
    - theme: brand
      text: Começar
      link: ./getting-started
    - theme: alt
      text: Início
      link: /

features:
  - title: Fluxo de Trabalho Primeiro a Especificação
    details: Defina os requisitos antes de escrever código.
  - title: Design Nativo para IA
    details: Desenvolvido para Claude Code, Cursor, Windsurf e outros.
  - title: Multi-idioma
    details: Documentação disponível em múltiplos idiomas.
---

# Documentação do OpenSpec

Bem-vindo. Este é o ponto de partida para tudo relacionado ao OpenSpec.

O OpenSpec ajuda você e seu assistente de codificação com IA a **entrarem em acordo sobre o que construir antes que qualquer código seja escrito.** Você descreve a alteração, a IA cria um rascunho de uma especificação curta e uma lista de tarefas, vocês dois analisam o mesmo plano e, então, o trabalho começa. Não há mais descobertas no meio do caminho de que a IA construiu a coisa errada.

Se você não ler mais nada, leia estas duas páginas:

1. [Começando](getting-started.md): instale, inicialize e envie sua primeira alteração.
2. [Como os Comandos Funcionam](how-commands-work.md): onde você realmente digita `/opsx:propose` (dica: no chat da sua IA, não no terminal). Isso pega quase todo mundo de surpresa na primeira vez.

Esse segundo ponto é mais importante do que parece. O OpenSpec tem duas partes: uma ferramenta de linha de comando que você executa no seu terminal, e comandos de barra que você envia para o seu assistente de IA. Saber qual é qual evita o momento de confusão mais comum.

> **O melhor hábito a desenvolver primeiro: quando você não tiver certeza do que construir, comece com `/opsx:explore`.** É um parceiro de reflexão sem riscos que lê seu código, avalia opções e transforma uma ideia vaga em um plano concreto antes que qualquer artefato ou código exista. O guia [Explore Primeiro](explore.md) explica o porquê.

## Escolha seu caminho

**Sou novo no assunto.** Comece por [Começando](getting-started.md), depois dê uma olhada rápida em [Conceitos Básicos de Relance](overview.md). Quando algo parecer misterioso, o [FAQ](faq.md) e o [Glossário](glossary.md) estão por perto.

**Tenho um problema, mas não tenho um plano.** Esse é o caso mais comum, e ele tem uma resposta dedicada: [Explore Primeiro](explore.md). Use `/opsx:explore` para pensar sobre ele com a IA antes de se comprometer com qualquer coisa.

**Tenho uma base de código existente grande.** Você não precisa documentar toda ela. [Usando o OpenSpec em um Projeto Existente](existing-projects.md) mostra como começar em código legado real sem tentar fazer tudo de uma vez.

**Só quero fazer funcionar.** [Instale](installation.md), execute `openspec init`, depois leia [Como os Comandos Funcionam](how-commands-work.md) para que seu primeiro comando de barra seja enviado no lugar certo.

**Eu aprendo por exemplo.** A página [Exemplos e Receitas](examples.md) percorre alterações reais do início ao fim: um pequeno recurso, uma correção de bug, uma refatoração, uma exploração.

**A IA acabou de criar um rascunho de plano — e agora?** Leia-o. [Revisando uma Alteração](reviewing-changes.md) mostra a verificação de dois minutos que pega um caminho errado enquanto ainda é barato corrigir, e [Escrevendo Boas Especificações](writing-specs.md) aborda do que é feito um plano que vale a pena aprovar.

**Trabalho em equipe.** [OpenSpec em Equipe](team-workflow.md) mostra como uma alteração se mapeia para uma branch e uma pull request, e como os membros da equipe revisam um plano antes do código.

**Venho do fluxo de trabalho antigo.** O [Guia de Migração](migration-guide.md) explica o que mudou e por quê, e garante que seu trabalho existente está seguro.

**Quero adaptá-lo ao processo da minha equipe.** [Personalização](customization.md) aborda configuração de projeto, esquemas personalizados e contexto compartilhado.

**Algo está quebrado.** [Solução de Problemas](troubleshooting.md) reúne as falhas que as pessoas realmente encontram, com correções.

## Mapa completo

### Comece por aqui

| Documento | O que você obtém |
|----------|------------------|
| [Começando](getting-started.md) | Instale, inicialize e execute sua primeira alteração do início ao fim |
| [Explore Primeiro](explore.md) | Use `/opsx:explore` para pensar em uma ideia antes de se comprometer |
| [Como os Comandos Funcionam](how-commands-work.md) | Onde os comandos de barra são executados, o que significa "modo interativo", terminal vs chat |
| [Conceitos Básicos de Relance](overview.md) | Todo o modelo mental em uma página: especificações, alterações, deltas, arquivo morto |
| [Instalação](installation.md) | npm, pnpm, yarn, bun, Nix e como verificar se funcionou |

### Use no dia a dia

| Documento | O que você obtém |
|----------|------------------|
| [Fluxos de Trabalho](workflows.md) | Padrões comuns e quando usar cada comando |
| [Exemplos e Receitas](examples.md) | Tutoriais completos de alterações reais, prontos para copiar e colar |
| [Escrevendo Boas Especificações](writing-specs.md) | Como são um requisito forte e um cenário, e como dimensionar corretamente uma alteração |
| [Revisando uma Alteração](reviewing-changes.md) | A verificação de dois minutos em um plano rascunho antes que qualquer código seja escrito |
| [OpenSpec em Equipe](team-workflow.md) | Como as alterações se encaixam em branches, pull requests e revisões |
| [Usando o OpenSpec em um Projeto Existente](existing-projects.md) | Adotando o OpenSpec em uma base de código legado grande |
| [Editando e Iterando em uma Alteração](editing-changes.md) | Atualizar artefatos, voltar atrás, reconciliar edições manuais |
| [Comandos](commands.md) | Referência para todos os comandos de barra `/opsx:*` |
| [CLI](cli.md) | Referência para todos os comandos de terminal `openspec` |

### Entenda em profundidade

| Documento | O que você obtém |
|----------|------------------|
| [Conceitos](concepts.md) | Explicação detalhada de especificações, alterações, artefatos, esquemas e arquivo morto |
| [Fluxo de Trabalho OPSX](opsx.md) | Por que o fluxo de trabalho é fluido em vez de bloqueado por fases, além de uma análise profunda da arquitetura |
| [Glossário](glossary.md) | Todos os termos definidos em um só lugar |

### Personalize para você

| Documento | O que você obtém |
|----------|------------------|
| [Personalização](customization.md) | Configuração de projeto, esquemas personalizados e contexto compartilhado |
| [Multi-idioma](multi-language.md) | Gerar artefatos em idiomas diferentes do inglês |
| [Ferramentas Suportadas](supported-tools.md) | As mais de 25 ferramentas de IA com as quais o OpenSpec se integra, e onde os arquivos são armazenados |

### Quando precisar de ajuda

| Documento | O que você obtém |
|----------|------------------|
| [FAQ](faq.md) | Respostas rápidas para as perguntas mais feitas pelas pessoas |
| [Solução de Problemas](troubleshooting.md) | Correções concretas para falhas concretas |
| [Guia de Migração](migration-guide.md) | Migrando do fluxo de trabalho legado para o OPSX |

### Coordene entre repositórios (beta)

| Documento | O que você obtém |
|----------|------------------|
| [Stores: Guia do Usuário](stores-beta/user-guide.md) | Planeje em seu próprio repositório quando seu trabalho abranger repositórios ou equipes |
| [Contrato de Agente](agent-contract.md) | As superfícies de CLI legíveis por máquina que os agentes utilizam |

## A versão de trinta segundos

```text
1. Instalar        npm install -g @fission-ai/openspec@latest
2. Inicializar     cd your-project && openspec init
3. Explorar        (no chat da sua IA)  /opsx:explore           ← opcional, mas um ótimo hábito
4. Propor          (no chat da sua IA)  /opsx:propose add-dark-mode
5. Construir       (no chat da sua IA)  /opsx:apply
6. Arquivar        (no chat da sua IA)  /opsx:archive
```

As etapas 1 e 2 acontecem no seu terminal. O resto acontece no chat do seu assistente de IA. Essa divisão é a única coisa que vale a pena memorizar, e [Como os Comandos Funcionam](how-commands-work.md) explica exatamente o porquê. A etapa 3 é opcional, mas começar com `/opsx:explore` quando você não tiver certeza é o hábito que mais vale a pena desenvolver.

## Onde mais obter ajuda

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) para perguntas, ideias e ajuda.
- **Problemas no GitHub:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) para relatar bugs e solicitar recursos.
- **`openspec feedback "your message"`** envia feedback diretamente do seu terminal (ele abre uma issue no GitHub).

Encontrou algo nestes documentos que está errado, desatualizado ou confuso? Isso é um bug. Abra uma issue ou um pull request. Melhorias na documentação são algumas das contribuições mais valiosas que você pode fazer.