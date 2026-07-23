# Como os Comandos Funcionam

**A única coisa que você precisa saber: o OpenSpec tem dois tipos de comandos, e eles são executados em dois locais diferentes.**

- Os comandos `openspec ...` são executados no seu **terminal**. (Exemplo: `openspec init`.)
- Os comandos `/opsx:...` são executados no **chat do seu assistente de IA**. (Exemplo: `/opsx:propose`.)

Se você já digitou `/opsx:propose` no seu terminal e nada aconteceu, esta página explica o porquê. Você está falando com a metade errada do OpenSpec. Os comandos slash não são comandos de terminal. Eles são instruções que você dá ao seu assistente de codificação com IA, na mesma caixa de chat onde você normalmente digitaria "adicionar um formulário de login".

Essa única distinção é o obstáculo mais comum para novos usuários, então vamos deixá-la completamente clara.

## As duas metades

O OpenSpec é um projeto com duas funções.

**A CLI (metade do terminal).** Um programa chamado `openspec` que você instala e executa a partir do seu shell. Ele configura seu projeto, lista e valida alterações, mostra um painel e arquiva trabalhos concluídos. Você digita esses comandos no iTerm, no terminal do VS Code, no PowerShell, em qualquer lugar onde você executaria `git` ou `npm`.

```bash
openspec init        # configura o OpenSpec neste projeto
openspec list        # ver alterações ativas
openspec view        # abrir o painel interativo
```

**Os comandos slash (metade do chat).** Comandos curtos como `/opsx:propose` e `/opsx:apply` que você digita no seu assistente de IA. Eles instruem a IA a seguir o fluxo de trabalho do OpenSpec: rascunhar uma proposta, escrever especificações, construir a partir da lista de tarefas, arquivar quando concluído. Você digita esses comandos no Claude Code, Cursor, Windsurf, Copilot, ou no assistente que você usar.

```text
/opsx:propose add-dark-mode    (digitado no chat da sua IA)
/opsx:apply                    (digitado no chat da sua IA)
/opsx:archive                  (digitado no chat da sua IA)
```

Aqui está o modelo mental em uma imagem:

```text
        SEU TERMINAL                         CHAT DO SEU ASSISTENTE DE IA
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   instala     │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   comandos    │  /opsx:archive                │
   └──────────────────────┘    & skills   └──────────────────────────────┘
        execute openspec aqui                       execute /opsx:* aqui
```

Observe a seta. Executar `openspec init` no seu terminal é o que *instala* os comandos slash na sua ferramenta de IA. A metade do terminal configura a metade do chat. Depois disso, o uso do dia a dia acontece principalmente no chat.

## "Como eu inicio o modo interativo?"

**Não há um modo interativo separado para iniciar.** Essa questão surge muito, então merece uma resposta direta.

Você não entra em um modo OpenSpec especial. Você apenas abre seu assistente de codificação com IA como sempre faz e digita um comando slash no chat. O comando slash *é* a forma de "entrar" no OpenSpec. Seu assistente o reconhece, carrega a habilidade (skill) correspondente do OpenSpec e começa a seguir o fluxo de trabalho.

Então as instruções reais são:

1. Abra seu assistente de codificação com IA (Claude Code, Cursor, Windsurf, etc.) no seu projeto.
2. Digite `/opsx:propose` no chat dele, no mesmo lugar onde você digita qualquer outra solicitação.
3. Observe o preenchimento automático: se o OpenSpec estiver instalado, você verá `/opsx:propose`, `/opsx:apply` e outros aparecerem enquanto você digita a barra.

É isso. Nenhum modo para alternar, nenhum daemon para iniciar, nenhuma janela separada.

Uma coisa que é verdadeiramente interativa está no terminal: `openspec view`. Ele abre um painel para navegar por suas especificações e alterações. Mas isso é um visualizador, não a ferramenta com a qual você propõe e constrói. A construção acontece por meio de comandos slash no chat.

## Por que essa divisão existe

Vale a pena entender, pois explica por que o OpenSpec funciona com mais de 25 ferramentas de IA diferentes.

A CLI é o **motor**. Ela conhece as regras: como é uma pasta de alteração, quais artefatos dependem de quais, como mesclar uma especificação delta na sua fonte de verdade. É a mesma em todos os lugares.

Os comandos slash são o **volante**, e cada ferramenta de IA tem um ligeiramente diferente. O Claude Code os chama de comandos. O Cursor e o Windsurf têm seus próprios formatos. Algumas ferramentas os chamam de habilidades (skills). Quando você executa `openspec init`, o OpenSpec gera o tipo certo de arquivo para cada ferramenta que você selecionou, para que a mesma intenção `/opsx:propose` funcione independentemente de qual assistente você preferir.

A força desse design: você aprende o fluxo de trabalho uma vez e o aplica em diferentes ferramentas. A troca: a sintaxe exata de um comando pode diferir ligeiramente entre as ferramentas, o que é abordado na próxima seção.

## Sintaxe de comandos slash por ferramenta

A intenção é idêntica em todos os lugares. A pontuação difere. Use a forma que corresponda ao seu assistente.

| Ferramenta | Como você digita |
|------|-----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | estilo skill, ex. `/openspec-propose` |
| Codex | estilo skill via `.codex/skills/openspec-*` |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | estilo skill, ex. `/skill:openspec-propose` |
| Trae | `/opsx-propose`, `/opsx-apply` |

A maioria das ferramentas usa ou a forma com dois pontos (`/opsx:propose`) ou a forma com traço (`/opsx-propose`). Algumas ferramentas apresentam o OpenSpec como habilidades (skills) nomeadas em vez de comandos slash; para essas, você invoca a habilidade pelo nome. A lista completa por ferramenta, incluindo exatamente quais arquivos são escritos onde, está em [Ferramentas Suportadas](supported-tools.md).

Em caso de dúvida, digite uma barra no chat da sua IA e observe o preenchimento automático. Sua ferramenta mostrará a forma que ela espera.

## Como os comandos chegaram lá: habilidades e comandos

Quando você executa `openspec init` (ou `openspec update`), o OpenSpec escreve pequenos arquivos no seu projeto para que sua ferramenta de IA possa encontrar o fluxo de trabalho. Dependendo da sua ferramenta e configurações, esses são **skills**, **comandos**, ou ambos.

- As **skills** residem em locais como `.claude/skills/openspec-*/SKILL.md`. Elas são o padrão emergente entre ferramentas: uma pasta de instruções que seu assistente detecta automaticamente.
- Os **comandos** residem em locais como `.claude/commands/opsx/<id>.md`. Eles são os arquivos de comando slash mais antigos, específicos de cada ferramenta. O Codex não recebe arquivos de comando gerados; use `.codex/skills/openspec-*`.

Você não precisa se preocupar com qual o seu instrumento usa. Você apenas digita o comando slash e ele funciona. Mas saber que esses arquivos existem ajuda quando algo dá errado: se seus comandos desaparecerem, geralmente significa que esses arquivos estão faltando ou desatualizados, e `openspec update` os regenera.

Consulte [Ferramentas Suportadas](supported-tools.md) para os caminhos exatos por ferramenta, e [Guia de Migração](migration-guide.md) para saber como as skills substituíram a abordagem mais antiga baseada apenas em comandos.

## Confirmando que está instalado

Verificações rápidas, da mais rápida para a mais lenta:

1. **Digite uma barra no chat da sua IA.** Comece a digitar `/opsx` e observe as sugestões de preenchimento automático. Se elas aparecerem, você está pronto.
2. **Procure os arquivos.** Para o Claude Code, verifique se `.claude/skills/` contém pastas `openspec-*`. Outras ferramentas usam seus próprios diretórios ([Ferramentas Suportadas](supported-tools.md) lista eles).
3. **Execute a configuração novamente.** A partir da raiz do seu projeto, execute `openspec update`. Isso regenera os arquivos de habilidade e comando para quaisquer ferramentas que você configurou.
4. **Reinicie seu assistente.** Muitas ferramentas verificam por habilidades e comandos na inicialização, então uma janela nova pode ser o passo que faltava.

## Quais comandos eu tenho?

Por padrão, o OpenSpec instala o conjunto **core** de comandos slash:

- `/opsx:explore`: pense em uma ideia com a IA antes de se comprometer com uma alteração (ótimo primeiro passo quando você não tem certeza)
- `/opsx:propose`: crie uma alteração e rascunhe todos os seus artefatos de planejamento em uma etapa
- `/opsx:apply`: construa a alteração trabalhando em sua lista de tarefas
- `/opsx:sync`: mescle as atualizações de especificação de uma alteração nas suas especificações principais (geralmente automático)
- `/opsx:archive`: conclua uma alteração e arquive-a

Um bom ritmo padrão: `explore` quando você está descobrindo o que fazer, depois `propose`, `apply`, `archive`. O guia [Explore Primeiro](explore.md) explica por que esse passo inicial vale a pena.

Há também um conjunto **expandido** para pessoas que querem um controle mais refinado (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Você o ativa com `openspec config profile` e depois o aplica com `openspec update`.

Novo em tudo isso? `/opsx:onboard` (no conjunto expandido) acompanha você em uma alteração completa no seu próprio código, narrando cada passo. É a introdução mais amigável possível.

Para saber o que cada comando faz em detalhes, consulte [Comandos](commands.md). Para saber quando usar qual, consulte [Fluxos de Trabalho](workflows.md).

## Uma primeira execução limpa

Juntando tudo, aqui está a sequência completa com cada passo rotulado pelo local onde acontece.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (instala comandos slash na sua ferramenta de IA)

CHAT DE IA      /opsx:explore
              (opcional: pense na ideia com a IA primeiro)

CHAT DE IA      /opsx:propose add-dark-mode
              (IA rascunha proposta, especificações, design, tarefas)

CHAT DE IA      /opsx:apply
              (IA constrói, marcando as tarefas como concluídas)

CHAT DE IA      /opsx:archive
              (alteração é mesclada nas suas especificações e arquivada)
```

Dois passos no terminal para configurar. Depois você vive no chat. Esse é o ritmo.

## Relacionado

- [Primeiros Passos](getting-started.md): o passeio completo pela primeira alteração
- [Comandos](commands.md): cada comando slash em detalhes
- [CLI](cli.md): cada comando de terminal em detalhes
- [Ferramentas Suportadas](supported-tools.md): sintaxe por ferramenta e localizações de arquivos
- [FAQ](faq.md): mais respostas rápidas
- [Solução de Problemas](troubleshooting.md): correções quando os comandos não aparecem