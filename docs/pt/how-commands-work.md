# Como os Comandos Funcionam

**A única coisa que você precisa saber é que o OpenSpec tem dois tipos de comandos, e eles são executados em dois locais diferentes.**

- Os comandos `openspec ...` são executados no seu **terminal**. (Exemplo: `openspec init`.)
- Os comandos `/opsx:...` são executados no **chat do assistente de IA**. (Exemplo: `/opsx:propose`.)

Se você digitar `/opsx:propose` no terminal e nada acontecer, esta página explica o porquê. Você está falando com a metade errada do OpenSpec. Os comandos slash não são comandos de terminal. Eles são instruções que você dá ao seu assistente de codificação de IA, na mesma caixa de chat onde você normalmente digitaria "adicionar um formulário de login".

Essa única distinção é o maior obstáculo para os novos usuários, então vamos deixar isso cristalino.

## As Duas Metades

O OpenSpec é um projeto que veste dois chapéus.

**O CLI (metade do terminal).** Um programa chamado `openspec` que você instala e executa a partir do seu shell. Ele configura o seu projeto, lista e valida mudanças, exibe um dashboard e arquiva o trabalho concluído. Você digita isso no iTerm, no terminal do VS Code, no PowerShell, em qualquer lugar onde executaria `git` ou `npm`.

```bash
openspec init        # configurar o OpenSpec neste projeto
openspec list        # ver as mudanças ativas
openspec view        # abrir o dashboard interativo
```

**Os comandos slash (metade do chat).** Comandos curtos como `/opsx:propose` e `/opsx:apply` que você digita no seu assistente de IA. Eles instruem a IA a seguir o fluxo de trabalho do OpenSpec: rascunhar uma proposta, escrever especificações, construir a partir da lista de tarefas, arquivar quando terminar. Você digita isso no Claude Code, Cursor, Windsurf, Copilot ou em qualquer assistente que usar.

```text
/opsx:propose add-dark-mode    (digitado no seu chat de IA)
/opsx:apply                    (digitado no seu chat de IA)
/opsx:archive                  (digitado no seu chat de IA)
```

Aqui está o modelo mental em uma imagem:

```text
        SEU TERMINAL                         CHAT DO ASSISTENTE DE IA
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   instala    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   comandos    │  /opsx:archive                │
   └──────────────────────┘    & habilidades   └──────────────────────────────┘
        execute openspec aqui                       execute /opsx:* aqui
```

Note a seta. Executar `openspec init` no seu terminal é o que *instala* os comandos slash na sua ferramenta de IA. A metade do terminal configura a metade do chat. Depois disso, a operação diária acontece principalmente no chat.

## "Como eu começo o modo interativo?"

**Não existe um modo interativo separado para iniciar.** Esta pergunta surge muito e merece uma resposta clara.

Você não entra em um modo especial do OpenSpec. Você simplesmente abre seu assistente de codificação de IA como sempre faz, e digita um comando slash no chat. O comando slash *é* a maneira de você "entrar" no OpenSpec. Seu assistente reconhece o comando, carrega a habilidade (skill) correspondente do OpenSpec e começa a seguir o fluxo de trabalho.

Portanto, as instruções reais são:

1. Abra seu assistente de codificação de IA (Claude Code, Cursor, Windsurf, etc.) no seu projeto.
2. Digite `/opsx:propose` no chat dele, no mesmo lugar onde você digitaria qualquer outra solicitação.
3. Observe o autocomplete: se o OpenSpec estiver instalado, você verá `/opsx:propose`, `/opsx:apply` e amigos aparecerem enquanto digitar o slash.

É isso. Nenhum modo para alternar, nenhum daemon para iniciar, nenhuma janela separada.

Uma coisa que *é* genuinamente interativa vive no terminal: `openspec view`. Ele abre um dashboard para navegar pelas suas especificações e mudanças. Mas esse é um visualizador, não a ferramenta com a qual você propõe e constrói. A construção acontece através de comandos slash no chat.

## Por que essa divisão existe

Vale a pena entender, pois isso explica por que o OpenSpec funciona com mais de 25 ferramentas de IA diferentes.

O CLI é o **motor**. Ele conhece as regras: como é uma pasta de mudanças, quais artefatos dependem de quais, como mesclar um delta spec na sua fonte da verdade. É o mesmo em todos os lugares.

Os comandos slash são o **volante**, e cada ferramenta de IA tem um ligeiramente diferente. O Claude Code os chama de comandos. Cursor e Windsurf têm seus próprios formatos. Algumas ferramentas os chamam de habilidades (skills). Quando você executa `openspec init`, o OpenSpec gera o tipo certo de arquivo para cada ferramenta que você selecionou, para que a mesma intenção `/opsx:propose` funcione independentemente do assistente que você preferir.

A força desse design é: você aprende o fluxo de trabalho uma vez e carrega isso através das ferramentas. A contrapartida: a sintaxe exata de um comando pode diferir ligeiramente entre as ferramentas, o que é o próximo tópico.

## Sintaxe dos comandos slash por ferramenta

A intenção é idêntica em todos os lugares. A pontuação difere. Use o formato que corresponde ao seu assistente.

| Ferramenta | Como você digita |
|------|-----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | estilo skill, ex. `/skill:openspec-propose` |
| Trae | estilo skill, ex. `/openspec-propose` |

A maioria das ferramentas usa o formato de dois pontos (`/opsx:propose`) ou o formato de traço (`/opsx-propose`). Algumas ferramentas expõem o OpenSpec como habilidades nomeadas em vez de comandos slash; para essas, você invoca a habilidade pelo nome. A lista completa por ferramenta, incluindo exatamente quais arquivos são escritos onde, está em [Supported Tools](supported-tools.md).

Na dúvida, digite um slash no seu chat de IA e observe o autocomplete. Sua ferramenta mostrará o formato que ela espera.

## Como os comandos chegaram: skills e commands

Quando você executa `openspec init` (ou `openspec update`), o OpenSpec escreve pequenos arquivos no seu projeto para que a sua ferramenta de IA possa encontrar o fluxo de trabalho. Dependendo da sua ferramenta e configurações, estes são **skills**, **commands** ou ambos.

- Os **Skills** vivem em locais como `.claude/skills/openspec-*/SKILL.md`. Eles são o padrão emergente entre as ferramentas: uma pasta de instruções que seu assistente detecta automaticamente.
- Os **Commands** vivem em locais como `.claude/commands/opsx/<id>.md`. São os arquivos de comando slash mais antigos, específicos para cada ferramenta.

Você não precisa se preocupar com qual o seu assistente usa. Você apenas digita o comando slash e ele funciona. Mas saber que esses arquivos existem ajuda quando algo dá errado: se seus comandos desaparecerem, geralmente significa que esses arquivos estão faltando ou obsoletos, e `openspec update` os regenera.

Consulte [Supported Tools](supported-tools.md) para os caminhos exatos por ferramenta e [Migration Guide](migration-guide.md) para saber como as skills substituíram a abordagem anterior focada apenas em comandos.

## Confirmando que está instalado

Verificações rápidas, começando pelas mais fáceis:

1. **Digite um slash no seu chat de IA.** Comece digitando `/opsx` e procure sugestões de autocomplete. Se elas aparecerem, você está pronto.
2. **Procure os arquivos.** Para o Claude Code, verifique se `.claude/skills/` contém pastas `openspec-*`. Outras ferramentas usam seus próprios diretórios ([Supported Tools](supported-tools.md) lista eles).
3. **Execute a configuração novamente.** A partir da raiz do seu projeto, execute `openspec update`. Isso regenera os arquivos de skill e comando para as ferramentas que você configurou.
4. **Reinicie o assistente.** Muitas ferramentas procuram skills e comandos na inicialização, então uma janela nova pode ser o passo que falta.

## Quais comandos eu tenho?

Por padrão, o OpenSpec instala o conjunto **principal** de comandos slash:

- `/opsx:explore`: pense em uma ideia com a IA antes de se comprometer com uma mudança (ótimo primeiro passo quando você não tem certeza)
- `/opsx:propose`: criar uma mudança e rascunhar todos os seus artefatos de planejamento em um único passo
- `/opsx:apply`: construir a mudança trabalhando através da sua lista de tarefas
- `/opsx:sync`: mesclar as atualizações do spec de uma mudança nas suas specs principais (geralmente automático)
- `/opsx:archive`: finalizar uma mudança e arquivá-la

Um bom ritmo padrão é: `explore` quando você está descobrindo o que fazer, depois `propose`, `apply`, `archive`. O guia [Explore First](explore.md) explica por que esse passo inicial compensa.

Há também um conjunto **expandido** para quem deseja maior controle (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Você ativa isso com `openspec config profile` e depois aplica com `openspec update`.

Novo nisso tudo? `/opsx:onboard` (no conjunto expandido) o guia através de uma mudança completa em sua própria codebase, narrando cada passo. É a introdução mais amigável possível.

Para o que cada comando faz em detalhes, consulte [Commands](commands.md). Para quando usar qual, consulte [Workflows](workflows.md).

## Uma primeira execução limpa

Juntando tudo, aqui está a sequência completa com cada etapa rotulada pelo local onde ocorre.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (instala comandos slash na sua ferramenta de IA)

AI CHAT      /opsx:explore
              (opcional: pensar a ideia com a IA primeiro)

AI CHAT      /opsx:propose add-dark-mode
              (A IA rascunha proposta, specs, design e tarefas)

AI CHAT      /opsx:apply
              (A IA constrói, marcando as tarefas)

AI CHAT      /opsx:archive
              (a mudança é mesclada nas suas specs e arquivada)
```

Duas etapas de terminal para configurar. Depois você vive no chat. Esse é o ritmo.

## Relacionados

- [Getting Started](getting-started.md): o guia completo da primeira mudança
- [Commands](commands.md): todos os comandos slash em detalhes
- [CLI](cli.md): todos os comandos de terminal em detalhes
- [Supported Tools](supported-tools.md): sintaxe e locais de arquivos por ferramenta
- [FAQ](faq.md): mais respostas rápidas
- [Troubleshooting](troubleshooting.md): correções quando os comandos não aparecem