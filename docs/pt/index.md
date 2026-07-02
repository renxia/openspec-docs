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
  - title: Multi-Idioma
    details: Documentação disponível em vários idiomas.
---

# Documentação do OpenSpec

Bem-vindo. Este é o lar de tudo sobre OpenSpec.

OpenSpec ajuda você e seu assistente de codificação de IA a **concordar no que construir antes que qualquer código seja escrito.** Você descreve a mudança, a IA rascunha uma especificação curta e uma lista de tarefas, ambos olham para o mesmo plano e então o trabalho acontece. Chega de descobrir no meio do caminho que a IA construiu a coisa errada.

Se você não ler mais nada, leia estas duas páginas:

1. [Getting Started](getting-started.md): como instalar, inicializar e enviar sua primeira mudança.
2. [How Commands Work](how-commands-work.md): onde você realmente digita `/opsx:propose` (dica: no seu chat de IA, não no terminal). Isso confunde quase todo mundo uma vez.

A segunda é mais importante do que parece. OpenSpec tem duas metades: uma ferramenta de linha de comando que você executa no seu terminal e comandos slash que você dá ao seu assistente de IA. Saber qual é qual economiza o momento de confusão mais comum.

> **O melhor hábito para construir primeiro: quando você não tem certeza do que construir, comece com `/opsx:explore`.** É um parceiro de pensamento sem riscos que lê seu código, avalia opções e transforma uma ideia vaga em um plano concreto antes que qualquer artefato ou código exista. O guia [Explore First](explore.md) apresenta este caso.

## Escolha o seu caminho

**Sou totalmente novo.** Comece com [Getting Started](getting-started.md), depois folheie os [Core Concepts at a Glance](overview.md). Quando algo parecer misterioso, o [FAQ](faq.md) e o [Glossary](glossary.md) estão por perto.

**Tenho um problema, mas não tenho um plano.** Este é o caso comum, e ele tem uma resposta dedicada: [Explore First](explore.md). Use `/opsx:explore` para pensar sobre isso com a IA antes de se comprometer com qualquer coisa.

**Eu tenho uma base de código grande existente.** Você não documenta tudo. [Using OpenSpec in an Existing Project](existing-projects.md) mostra como começar em um código real (brownfield) sem tentar resolver o oceano inteiro.

**Eu só quero fazer funcionar.** [Install](installation.md), execute `openspec init`, e depois leia [How Commands Work](how-commands-work.md) para que seu primeiro comando slash caia no lugar certo.

**Aprendo por exemplo.** A página [Examples & Recipes](examples.md) percorre mudanças reais do início ao fim: um pequeno recurso, uma correção de bug, um refactoring, uma exploração.

**Estou vindo do fluxo de trabalho antigo.** O [Migration Guide](migration-guide.md) explica o que mudou e por quê, e promete que seu trabalho existente está seguro.

**Quero adaptar ao processo da minha equipe.** [Customization](customization.md) aborda a configuração do projeto, esquemas personalizados e contexto compartilhado.

**Algo está quebrado.** [Troubleshooting](troubleshooting.md) coleta as falhas reais que as pessoas encontram, com correções.

## O mapa completo

### Comece aqui

| Doc | O que ele oferece |
|-----|-------------------|
| [Getting Started](getting-started.md) | Instalação, inicialização e execução da sua primeira mudança de ponta a ponta |
| [Explore First](explore.md) | Use `/opsx:explore` para pensar em uma ideia antes de se comprometer |
| [How Commands Work](how-commands-work.md) | Onde os comandos slash são executados, o que significa "modo interativo", terminal vs chat |
| [Core Concepts at a Glance](overview.md) | Todo o modelo mental em uma página: especificações, mudanças, deltas, arquivo |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix e como verificar se funcionou |

### Use dia após dia

| Doc | O que ele oferece |
|-----|-------------------|
| [Workflows](workflows.md) | Padrões comuns e quando usar cada comando |
| [Examples & Recipes](examples.md) | Guias completos de mudanças reais, prontos para copiar e colar |
| [Using OpenSpec in an Existing Project](existing-projects.md) | Adotando o OpenSpec em uma base de código brownfield grande |
| [Editing & Iterating on a Change](editing-changes.md) | Atualizar artefatos, voltar atrás, reconciliar edições manuais |
| [Commands](commands.md) | Referência para todos os comandos slash `/opsx:*` |
| [CLI](cli.md) | Referência para todos os comandos de terminal `openspec` |

### Entenda profundamente

| Doc | O que ele oferece |
|-----|-------------------|
| [Concepts](concepts.md) | A explicação detalhada de especificações, mudanças, artefatos, esquemas e arquivo |
| [OPSX Workflow](opsx.md) | Por que o fluxo de trabalho é fluido em vez de bloqueado por fase, além de um mergulho profundo na arquitetura |
| [Glossary](glossary.md) | Todo termo definido em um só lugar |

### Torne-o seu

| Doc | O que ele oferece |
|-----|-------------------|
| [Customization](customization.md) | Configuração do projeto, esquemas personalizados e contexto compartilhado |
| [Multi-Language](multi-language.md) | Gerar artefatos em idiomas diferentes de inglês |
| [Supported Tools](supported-tools.md) | As 25+ ferramentas de IA com as quais o OpenSpec se integra e onde os arquivos são armazenados |

### Quando você precisar de ajuda

| Doc | O que ele oferece |
|-----|-------------------|
| [FAQ](faq.md) | Respostas rápidas às perguntas mais frequentes |
| [Troubleshooting](troubleshooting.md) | Correções concretas para falhas concretas |
| [Migration Guide](migration-guide.md) | Migrando do fluxo de trabalho legado para OPSX |

### Coordenar em repositórios (beta)

| Doc | O que ele oferece |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | Planejar em seu próprio repo quando seu trabalho abrange vários repositórios ou equipes |
| [Agent Contract](agent-contract.md) | As interfaces CLI legíveis por máquina que os agentes operam |

## A versão de trinta segundos

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in your AI chat)  /opsx:explore           ← opcional, mas um ótimo hábito
4. Propose        (in your AI chat)  /opsx:propose add-dark-mode
5. Build          (in your AI chat)  /opsx:apply
6. Archive        (in your AI chat)  /opsx:archive
```

Os passos 1 e 2 acontecem no seu terminal. O restante acontece no chat do seu assistente de IA. Essa divisão é a única coisa que vale a pena memorizar, e [How Commands Work](how-commands-work.md) explica exatamente o porquê. O Passo 3 é opcional, mas começar com `/opsx:explore` quando você não tem certeza é o hábito mais valioso para formar.

## Onde mais obter ajuda

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) para perguntas, ideias e ajuda.
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) para bugs e solicitações de recursos.
- **`openspec feedback "sua mensagem"`** envia feedback diretamente do seu terminal (ele abre uma issue no GitHub).

Encontrou algo nessas documentações que está errado, desatualizado ou confuso? Isso é um bug. Abra uma issue ou um PR. Melhorias na documentação são algumas das contribuições mais valiosas que você pode fazer.