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
  - title: Fluxo de Trabalho com Especificação Primeiro
    details: Defina os requisitos antes de escrever código.
  - title: Design Nativo para IA
    details: Desenvolvido para Claude Code, Cursor, Windsurf e outros.
  - title: Multilíngue
    details: Documentação disponível em vários idiomas.
---

# Documentação do OpenSpec

Bem-vindo. Esta é a página inicial com toda a documentação do OpenSpec.

O OpenSpec ajuda você e seu assistente de codificação com IA a **entrarem em acordo sobre o que construir antes que qualquer código seja escrito.** Você descreve a alteração, a IA cria um rascunho de uma especificação curta e uma lista de tarefas, vocês dois analisam o mesmo plano e, então, o trabalho é realizado. Não há mais risco de descobrir no meio do caminho que a IA construiu a coisa errada.

Se você não ler mais nada, leia estas duas páginas:

1. [Começar](getting-started.md): instale, inicialize e envie sua primeira alteração.
2. [Como os Comandos Funcionam](how-commands-work.md): onde você realmente digita `/opsx:propose` (dica: no chat da sua IA, não no terminal). Isso causa confusão em quase todo mundo na primeira vez.

Essa segunda página é mais importante do que parece. O OpenSpec tem duas partes: uma ferramenta de linha de comando que você executa no seu terminal, e comandos de barra que você envia para o seu assistente de IA. Saber qual é qual evita o momento de confusão mais comum.

> **O melhor hábito para desenvolver primeiro: quando você não tiver certeza do que construir, comece com `/opsx:explore`.** É um parceiro de reflexão sem riscos que lê seu código, avalia opções e transforma uma ideia vaga em um plano concreto antes que qualquer artefato ou código exista. O guia [Explore Primeiro](explore.md) explica o porquê.

## Escolha seu caminho

**Eu sou novo no assunto.** Comece por [Começar](getting-started.md), depois dê uma olhada rápida em [Conceitos Básicos de Relance](overview.md). Quando algo parecer misterioso, o [Perguntas Frequentes (FAQ)](faq.md) e o [Glossário](glossary.md) estão por perto.

**Eu tenho um problema, mas não tenho um plano.** Esse é o caso mais comum, e tem uma resposta dedicada: [Explore Primeiro](explore.md). Use `/opsx:explore` para pensar sobre ele com a IA antes de se comprometer com qualquer coisa.

**Eu tenho uma base de código existente grande.** Você não precisa documentar tudo ela. [Usando o OpenSpec em um Projeto Existente](existing-projects.md) mostra como começar a trabalhar em código de legado real sem tentar fazer tudo de uma vez.

**Eu só quero fazer funcionar.** [Instale](installation.md), execute `openspec init`, depois leia [Como os Comandos Funcionam](how-commands-work.md) para que seu primeiro comando de barra seja enviado para o lugar certo.

**Eu aprendo por exemplo.** A página [Exemplos e Receitas](examples.md) percorre alterações reais do início ao fim: um pequeno recurso, uma correção de bug, uma refatoração, uma exploração.

**A IA acabou de criar um rascunho de um plano — e agora?** Leia-o. [Revisando uma Alteração](reviewing-changes.md) mostra a verificação de dois minutos que captura um erro de rumo enquanto ainda é barato corrigir, e [Escrevendo Boas Especificações](writing-specs.md) aborda do que é feito um plano que vale a pena aprovar.

**Eu trabalho em equipe.** [OpenSpec em Equipe](team-workflow.md) mostra como uma alteração se relaciona com um ramo e um pull request, e como os membros da equipe revisam um plano antes do código.

**Eu venho do fluxo de trabalho antigo.** O [Guia de Migração](migration-guide.md) explica o que mudou e por quê, e garante que seu trabalho existente está seguro.

**Eu quero adaptá-lo ao processo da minha equipe.** [Personalização](customization.md) aborda a configuração do projeto, esquemas personalizados e contexto compartilhado.

**Algo está quebrado.** [Solução de Problemas](troubleshooting.md) reúne as falhas que as pessoas realmente encontram, com correções.

## Mapa completo

### Comece por aqui

| Documento | O que você obtém |
|----------|------------------|
| [Começar](getting-started.md) | Instale, inicialize e execute sua primeira alteração do início ao fim |
| [Explore Primeiro](explore.md) | Use `/opsx:explore` para refletir sobre uma ideia antes de se comprometer com ela |
| [Como os Comandos Funcionam](how-commands-work.md) | Onde os comandos de barra são executados, o que significa o "modo interativo", terminal vs chat |
| [Conceitos Básicos de Relance](overview.md) | Todo o modelo mental em uma página: especificações, alterações, deltas, arquivamento |
| [Instalação](installation.md) | npm, pnpm, yarn, bun, Nix e como verificar se funcionou |

### Use no dia a dia

| Documento | O que você obtém |
|----------|------------------|
| [Fluxos de Trabalho](workflows.md) | Padrões comuns e quando usar cada comando |
| [Exemplos e Receitas](examples.md) | Passo a passo completo de alterações reais, prontos para copiar e colar |
| [Escrevendo Boas Especificações](writing-specs.md) | Como são um requisito e um cenário bem estruturados, e como definir o tamanho ideal de uma alteração |
| [Revisando uma Alteração](reviewing-changes.md) | A verificação de dois minutos em um plano rascunhado antes que qualquer código seja escrito |
| [OpenSpec em Equipe](team-workflow.md) | Como as alterações se encaixam em ramos, pull requests e revisões |
| [Usando o OpenSpec em um Projeto Existente](existing-projects.md) | Como adotar o OpenSpec em uma base de código de legado grande |
| [Editando e Iterando em uma Alteração](editing-changes.md) | Atualize artefatos, volte atrás, reconcilie edições manuais |
| [Comandos](commands.md) | Referência para todos os comandos de barra `/opsx:*` |
| [CLI](cli.md) | Referência para todos os comandos de terminal `openspec` |

### Entenda em profundidade

| Documento | O que você obtém |
|----------|------------------|
| [Conceitos](concepts.md) | A explicação longa de especificações, alterações, artefatos, esquemas e arquivamento |
| [Fluxo de Trabalho OPSX](opsx.md) | Por que o fluxo de trabalho é fluido em vez de bloqueado por fases, além de um mergulho profundo na arquitetura |
| [Glossário](glossary.md) | Todos os termos definidos em um só lugar |

### Personalize para sua equipe

| Documento | O que você obtém |
|----------|------------------|
| [Personalização](customization.md) | Configuração do projeto, esquemas personalizados e contexto compartilhado |
| [Multilíngue](multi-language.md) | Gere artefatos em idiomas diferentes do inglês |
| [Ferramentas Suportadas](supported-tools.md) | Os mais de 25 ferramentas de IA com as quais o OpenSpec se integra, e onde os arquivos são armazenados |

### Quando precisar de ajuda

| Documento | O que você obtém |
|----------|------------------|
| [Perguntas Frequentes (FAQ)](faq.md) | Respostas rápidas para as perguntas mais feitas pelas pessoas |
| [Solução de Problemas](troubleshooting.md) | Correções concretas para falhas concretas |
| [Guia de Migração](migration-guide.md) | Migrando do fluxo de trabalho legado para o OPSX |

### Coordenação entre repositórios (beta)

| Documento | O que você obtém |
|----------|------------------|
| [Stores: Guia do Usuário](stores-beta/user-guide.md) | Planeje em seu próprio repositório quando seu trabalho abranger vários repositórios ou equipes |
| [Contrato de Agente](agent-contract.md) | As superfícies de CLI legíveis por máquina que os agentes utilizam |

## A versão de trinta segundos

```text
1. Instale        npm install -g @fission-ai/openspec@latest
2. Inicialize     cd your-project && openspec init
3. Explore        (no chat da sua IA)  /opsx:explore           ← opcional, mas um hábito muito útil
4. Propose        (no chat da sua IA)  /opsx:propose add-dark-mode
5. Build          (no chat da sua IA)  /opsx:apply
6. Archive        (no chat da sua IA)  /opsx:archive
```

As etapas 1 e 2 acontecem no seu terminal. O resto acontece no chat do seu assistente de IA. Essa divisão é a única coisa que vale a pena memorizar, e [Como os Comandos Funcionam](how-commands-work.md) explica exatamente o porquê. A etapa 3 é opcional, mas começar com `/opsx:explore` quando você não tiver certeza é o hábito que mais vale a pena desenvolver.

## Onde mais obter ajuda

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) para perguntas, ideias e ajuda.
- **Issues do GitHub:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) para relatar bugs e solicitar recursos.
- **`openspec feedback "sua mensagem"`** envia feedback diretamente do seu terminal (ele abre uma issue no GitHub).

Encontrou algo nestes documentos que está errado, desatualizado ou confuso? Isso é um bug. Abra uma issue ou um PR. Melhorias na documentação são algumas das contribuições mais valiosas que você pode fazer.