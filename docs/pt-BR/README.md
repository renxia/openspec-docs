# Documentação OpenSpec

Bem-vindo. Este é o ponto de partida para tudo sobre OpenSpec.

OpenSpec ajuda você e seu assistente de codificação IA a **concordar sobre o que construir antes que qualquer código seja escrito.** Você descreve a mudança, a IA elabora uma especificação curta e uma lista de tarefas; ambos olham para o mesmo plano, e então o trabalho acontece. Chega de descobrir no meio do caminho que a IA construiu a coisa errada.

Se você ler mais nada, leia estas duas páginas:

1. [Getting Started](getting-started.md): instalação, inicialização e envio da sua primeira mudança.
2. [How Commands Work](how-commands-work.md): onde você realmente digita `/opsx:propose` (dica: no seu chat de IA, não no terminal). Isso confunde quase todo mundo no início.

A segunda é mais importante do que parece. OpenSpec tem duas partes: uma ferramenta de linha de comando que você executa no terminal e comandos slash que você dá ao seu assistente de IA. Saber qual é qual economiza o momento de confusão mais comum.

> **O melhor hábito a desenvolver primeiro: quando você não tem certeza do que construir, comece com `/opsx:explore`.** É um parceiro de pensamento sem riscos que lê seu código, avalia opções e transforma uma ideia vaga em um plano concreto antes que qualquer artefato ou código exista. O guia [Explore First](explore.md) defende isso.

## Escolha seu caminho

**Sou novato.** Comece com [Getting Started](getting-started.md), depois dê uma olhada rápida em [Core Concepts at a Glance](overview.md). Quando algo parecer misterioso, o [FAQ](faq.md) e o [Glossary](glossary.md) estão por perto.

**Tenho um problema, mas não tenho um plano.** Este é o caso comum, e ele tem uma resposta dedicada: [Explore First](explore.md). Use `/opsx:explore` para pensar sobre isso com a IA antes de se comprometer com qualquer coisa.

**Eu tenho uma grande base de código existente.** Você não documenta tudo. [Using OpenSpec in an Existing Project](existing-projects.md) mostra como começar em um código real, "brownfield", sem tentar resolver o oceano inteiro.

**Eu só quero fazer funcionar.** [Install](installation.md), execute `openspec init`, depois leia [How Commands Work](how-commands-work.md) para que seu primeiro comando slash caia no lugar certo.

**Aprendo por exemplo.** A página [Examples & Recipes](examples.md) percorre mudanças reais do início ao fim: um pequeno recurso, uma correção de bug, um refatoramento, uma exploração.

**Estou vindo do fluxo de trabalho antigo.** O [Migration Guide](migration-guide.md) explica o que mudou e por quê, e promete que seu trabalho existente está seguro.

**Quero adaptar ao processo da minha equipe.** [Customization](customization.md) cobre configuração do projeto, esquemas personalizados e contexto compartilhado.

**Algo está quebrado.** [Troubleshooting](troubleshooting.md) coleta os erros que as pessoas realmente encontram, com correções.

## O mapa completo

### Comece aqui

| Doc | O que ele oferece |
|-----|-------------------|
| [Getting Started](getting-started.md) | Instalação, inicialização e execução da sua primeira mudança do início ao fim |
| [Explore First](explore.md) | Use `/opsx:explore` para pensar sobre uma ideia antes de se comprometer |
| [How Commands Work](how-commands-work.md) | Onde os comandos slash são executados, o que significa "modo interativo", terminal vs chat |
| [Core Concepts at a Glance](overview.md) | Todo o modelo mental em uma página: specs, mudanças, deltas, arquivo |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix e como verificar se funcionou |

### Use no dia a dia

| Doc | O que ele oferece |
|-----|-------------------|
| [Workflows](workflows.md) | Padrões comuns e quando usar cada comando |
| [Examples & Recipes](examples.md) | Guias completos de mudanças reais, prontos para copiar e colar |
| [Using OpenSpec in an Existing Project](existing-projects.md) | Adotando o OpenSpec em uma grande base de código "brownfield" |
| [Editing & Iterating on a Change](editing-changes.md) | Atualizar artefatos, voltar atrás, reconciliar edições manuais |
| [Commands](commands.md) | Referência para cada comando slash `/opsx:*` |
| [CLI](cli.md) | Referência para cada comando de terminal `openspec` |

### Entenda profundamente

| Doc | O que ele oferece |
|-----|-------------------|
| [Concepts](concepts.md) | A explicação detalhada de specs, mudanças, artefatos, esquemas e arquivo |
| [OPSX Workflow](opsx.md) | Por que o fluxo de trabalho é fluido em vez de travado por fase, mais um mergulho na arquitetura |
| [Glossary](glossary.md) | Todo termo definido em um só lugar |

### Torne seu próprio

| Doc | O que ele oferece |
|-----|-------------------|
| [Customization](customization.md) | Configuração do projeto, esquemas personalizados, contexto compartilhado |
| [Multi-Language](multi-language.md) | Gerar artefatos em idiomas além do inglês |
| [Supported Tools](supported-tools.md) | As 25+ ferramentas de IA com as quais o OpenSpec se integra e onde os arquivos são salvos |

### Quando precisar de ajuda

| Doc | O que ele oferece |
|-----|-------------------|
| [FAQ](faq.md) | Respostas rápidas para as perguntas mais frequentes |
| [Troubleshooting](troubleshooting.md) | Correções concretas para falhas concretas |
| [Migration Guide](migration-guide.md) | Migrando do fluxo de trabalho legado para OPSX |

### Coordene entre repositórios (beta)

| Doc | O que ele oferece |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | Planejar em seu próprio repo quando seu trabalho abrange vários repositórios ou equipes |
| [Agent Contract](agent-contract.md) | As superfícies de CLI legíveis por máquina que os agentes manipulam |

## A versão de trinta segundos

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (no seu chat de IA)  /opsx:explore           ← opcional, mas um ótimo hábito
4. Propose        (no seu chat de IA)  /opsx:propose add-dark-mode
5. Build          (no seu chat de IA)  /opsx:apply
6. Archive        (no seu chat de IA)  /opsx:archive
```

Os passos 1 e 2 acontecem no seu terminal. O restante acontece no chat do seu assistente de IA. Essa divisão é a única coisa que vale a pena memorizar, e [How Commands Work](how-commands-work.md) explica exatamente o porquê. O Passo 3 é opcional, mas começar com `/opsx:explore` quando você não tem certeza é o hábito mais valioso para formar.

## Onde mais obter ajuda

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) para perguntas, ideias e ajuda.
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) para bugs e solicitações de recursos.
- **`openspec feedback "sua mensagem"`** envia feedback diretamente do seu terminal (ele abre um issue no GitHub).

Encontrou algo nessas docs que está errado, obsoleto ou confuso? Isso é um bug. Abra um issue ou um PR. Melhorias na documentação são algumas das contribuições mais valiosas que você pode fazer.