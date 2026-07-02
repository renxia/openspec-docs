# FAQ

Respostas rápidas às perguntas mais frequentes. Se a sua pergunta for realmente sobre algo "quebrou", [Troubleshooting](troubleshooting.md) é a página mais adequada. Se você quiser definir um termo, consulte o [Glossary](glossary.md).

## O Básico

### O que é OpenSpec, em uma frase?

Uma camada leve que faz com que você e seu assistente de codificação IA concordem sobre o que construir, por escrito, antes que qualquer código seja escrito.

### Por que eu gostaria disso?

Porque os assistentes de IA são confiantes mesmo quando estão errados. Quando os requisitos existem apenas em um tópico de chat, a IA preenche as lacunas com suposições, e você descobre isso depois que o código existe. O OpenSpec antecipa esse acordo para uma fase anterior, onde os erros são baratos de corrigir. Consulte [Core Concepts at a Glance](overview.md) para o caso completo.

### Eu tenho que usá-lo em tudo?

Não. Use-o onde o acordo é importante, ou seja, na maior parte do trabalho não trivial. Para consertar um erro de digitação de um único caractere, a cerimônia provavelmente não vale a pena, e isso é normal.

### Posso usá-lo em uma grande base de código existente, ou apenas em novos projetos?

Bases de código existentes são o evento principal. O OpenSpec é pensado para *brownfield* (sistemas legados): você não precisa documentar todo o seu aplicativo antecipadamente. Você escreve especificações apenas para aquilo que cada mudança toca, e suas especificações se preenchem ao longo do tempo em torno do trabalho que você realmente faz. Há um guia dedicado: [Using OpenSpec in an Existing Project](existing-projects.md).

### Ele está ligado a uma ferramenta de IA específica?

Não. O OpenSpec funciona com mais de 25 assistentes, incluindo Claude Code, Cursor, Windsurf, GitHub Copilot, Gemini CLI, Codex e outros. A lista completa e os detalhes por ferramenta estão em [Supported Tools](supported-tools.md).

## Executando Comandos

### Onde eu digito `/opsx:propose`?

No chat do seu assistente de IA, não no terminal. Este é o ponto de confusão mais comum, então ele tem sua própria página: [How Commands Work](how-commands-work.md). Versão curta: `openspec ...` roda no terminal, `/opsx:...` roda no chat.

### Como eu "início o modo interativo"?

Não há um modo separado para iniciar. Você abre seu assistente de IA normalmente e digita um comando slash no chat dele. O comando slash é como você "entra" no OpenSpec. (O recurso genuinamente interativo do terminal é `openspec view`, um painel para navegar por especificações e mudanças.) Explicação completa em [How Commands Work](how-commands-work.md).

### Eu digitei um comando slash e nada aconteceu. Por quê?

Muito provavelmente você digitou no terminal em vez de no chat da sua IA, ou os comandos ainda não estão instalados. Execute `openspec update` no seu projeto, reinicie o assistente e tente digitar `/opsx` no chat e procure por preenchimento automático (autocomplete). [Troubleshooting](troubleshooting.md#commands-dont-show-up) tem a lista de verificação completa.

### Por que a sintaxe é `/opsx:propose` em uma ferramenta e `/opsx-propose` em outra?

Cada ferramenta de IA exibe comandos personalizados de maneira um pouco diferente. A intenção é idêntica; apenas a pontuação muda. Digite um slash no seu chat e o preenchimento automático mostra o formato que sua ferramenta espera. A tabela por ferramenta está em [How Commands Work](how-commands-work.md#slash-command-syntax-by-tool).

### Qual é a diferença entre uma skill e um comando?

Ambos são arquivos que o OpenSpec escreve para que seu assistente possa executar o fluxo de trabalho. Skills (`.../skills/openspec-*/SKILL.md`) são o padrão mais recente entre ferramentas; comandos (`.../commands/opsx-*`) são os antigos arquivos slash específicos da ferramenta. Você não precisa escolher. Você apenas digita o comando slash, e o OpenSpec instala aquele que sua ferramenta usa.

## O Fluxo de Trabalho (Workflow)

### Por onde devo começar se eu não tenho certeza do que construir?

Com `/opsx:explore`. É um parceiro de pensamento sem riscos que lê sua base de código, apresenta opções e transforma um problema vago em um plano concreto, tudo antes que qualquer mudança ou código exista. Ele está no perfil padrão, então está sempre disponível. Quando o plano estiver claro, ele passa para `/opsx:propose`. Este é o melhor hábito a ser formado, pois impede uma IA ansiosa de construir confiantemente a coisa errada. Consulte [Explore First](explore.md).

### Qual é o fluxo mais simples possível?

```text
/opsx:explore (opcional)   depois   /opsx:propose <o que você quer>   depois   /opsx:apply   depois   /opsx:archive
```

Explore para pensar, proponha para rascunhar o plano, aplique para construir, arquive para guardar. Pule o explore se você já sabe exatamente o que quer.

### Qual é a diferença entre `/opsx:propose` e `/opsx:new`?

`/opsx:propose` é o comando padrão de uma etapa: ele cria a mudança e rascunha todos os artefatos de planejamento de uma vez. `/opsx:new` faz parte do conjunto de comandos expandidos e apenas gera um arquivo de mudança vazio, deixando você para criar os artefatos um por um com `/opsx:continue` (ou todos de uma vez com `/opsx:ff`). Use propose a menos que você queira controle passo a passo. Consulte [Commands](commands.md).

### O que são perfis `core` e expandidos?

Um perfil decide quais comandos slash serão instalados. **Core** (o padrão) fornece `propose`, `explore`, `apply`, `sync`, `archive`. O conjunto **expandido** adiciona `new`, `continue`, `ff`, `verify`, `bulk-archive` e `onboard` para um controle mais fino. Alterne com `openspec config profile`, depois aplique com `openspec update`.

### Eu preciso rodar `/opsx:sync`?

Geralmente não. O Sync mescla os delta specs de uma mudança nas suas especificações principais, e `/opsx:archive` oferecerá fazer isso por você. Execute o sync manualmente apenas quando quiser que as especificações sejam mescladas antes do arquivamento, por exemplo em uma mudança de longa duração. Consulte [Commands](commands.md#opsxsync).

### Como eu edito uma proposta, especificação ou tarefa depois de ter começado?

Basta editar o arquivo. Cada artefato é Markdown simples em `openspec/changes/<name>/`, e não há fase bloqueada ou modo de edição especial. Mude-o manualmente ou peça à sua IA para revisá-lo ("atualize o design para usar uma fila"), e continue. A IA sempre trabalha a partir do conteúdo atual do arquivo. Guia completo: [Editing & Iterating on a Change](editing-changes.md).

### Posso voltar e mudar o plano depois de implementar parte dele?

Sim, a qualquer momento. O fluxo de trabalho é fluido, então a revisão e a edição não são fases das quais você fica impedido. Edite o artefato e continue. Se você quiser uma verificação estruturada de que o código ainda corresponde ao plano, execute `/opsx:verify`. Consulte [Editing & Iterating on a Change](editing-changes.md#how-do-i-go-back-to-review-after-implementing).

### Eu editei o código manualmente. Como eu reconcilio isso com a especificação?

Traga-os de volta ao alinhamento antes de arquivar, pois o arquivamento torna suas especificações o registro da verdade. Se o código estiver correto agora, atualize o delta spec para corresponder ao que você enviou; se a especificação estiver correta, continue construindo até que o código concorde. `/opsx:verify` expõe as incompatibilidades. Consulte [Editing & Iterating on a Change](editing-changes.md#i-edited-the-code-by-hand-how-do-i-reconcile-that-with-openspec).

### Quando devo atualizar uma mudança existente versus começar uma nova?

Atualize quando for o mesmo trabalho, refinado. Comece do zero quando a intenção mudou fundamentalmente ou o escopo explodiu em trabalho diferente. Há um fluxograma de decisão e exemplos em [Workflows](workflows.md#when-to-update-vs-start-fresh).

### E se minha sessão ficar sem contexto, ou os requisitos mudarem durante a implementação?

É aqui que as especificações cumprem seu papel. Como o plano vive em arquivos (e não apenas no histórico de chat), você pode limpar seu contexto, iniciar uma nova sessão de IA e continuar com `/opsx:apply`; ele lê os artefatos e retoma da primeira tarefa não verificada. Se os requisitos mudarem, edite os artefatos para corresponder à nova realidade e continue. Manter uma janela de contexto limpa também produz melhores resultados; limpe-a antes da implementação.

### Devo commitar a pasta `openspec/` para o git?

Sim. Suas especificações, mudanças ativas e arquivo fazem parte do histórico do seu projeto. Commite-os como qualquer outro código fonte. O arquivo em particular torna-se um registro durável de por que seu sistema funciona da maneira que funciona.

## Especificações e Mudanças

### O que vai em uma especificação versus um design?

Uma especificação descreve o comportamento observável: o que o sistema faz, suas entradas, saídas e condições de erro. Um design descreve como você irá construí-lo: a abordagem técnica, as decisões de arquitetura, as mudanças nos arquivos. Se a implementação puder mudar sem alterar o comportamento externamente visível, ela pertence ao design, não à especificação. [Concepts](concepts.md#what-a-spec-is-and-is-not) vai mais fundo.

### O que é uma delta spec?

Uma especificação que descreve apenas o que está mudando, usando as seções `ADDED`, `MODIFIED` e `REMOVED`, em vez de recontar a especificação inteira. É assim que o OpenSpec lida com edições em sistemas existentes de forma limpa. Consulte [Concepts](concepts.md#delta-specs).

### Para onde vão as mudanças arquivadas?

Para `openspec/changes/archive/YYYY-MM-DD-<name>/`, com todos os artefatos preservados. Nada é excluído; a mudança apenas sai da sua lista ativa.

## Configuração e Personalização

### Como eu informo à IA sobre minha pilha tecnológica (tech stack)?

Coloque isso em `openspec/config.yaml` sob `context:`. Esse texto é injetado em cada solicitação de planejamento, para que a IA sempre saiba sua pilha e suas convenções. Consulte [Customization](customization.md#project-configuration).

### Posso gerar especificações em um idioma diferente do inglês?

Sim. Adicione uma instrução de idioma ao `context:` da sua configuração. [Multi-Language](multi-language.md) tem trechos para copiar e colar para vários idiomas.

### Posso mudar o fluxo de trabalho em si?

Sim, com esquemas personalizados (custom schemas). Um esquema define quais artefatos existem e como eles dependem uns dos outros. Forkeie o padrão com `openspec schema fork spec-driven my-workflow`, depois edite-o. Consulte [Customization](customization.md#custom-schemas).

## Modelos, Privacidade e Atualizações

### Qual modelo de IA devo usar?

O OpenSpec funciona melhor com modelos de alta capacidade de raciocínio. O README recomenda modelos como Codex 5.5 e Opus 4.7 tanto para planejamento quanto para implementação. Mantenha também sua janela de contexto limpa: limpe-a antes da implementação para obter os melhores resultados.

### O OpenSpec coleta dados?

Ele coleta estatísticas anônimas de uso: nome do comando e versão apenas. Nenhum argumento, caminho, conteúdo ou dado pessoal, e ele é desativado automaticamente no CI. Exclua optando com `export OPENSPEC_TELEMETRY=0` ou `export DO_NOT_TRACK=1`.

### Como eu faço a atualização (upgrade)?

Duas etapas. Atualize o pacote (`npm install -g @fission-ai/openspec@latest`), e então execute `openspec update` dentro de cada projeto para atualizar as skills e comandos gerados.

### Como eu desinstalo o OpenSpec?

Não há um comando de desinstalação, porque é apenas um pacote global mais arquivos no seu projeto. Remova o pacote (`npm uninstall -g @fission-ai/openspec`), e opcionalmente exclua o diretório `openspec/` e os arquivos de ferramentas gerados. O passo a passo, incluindo o que é seguro manter, está em [Installation: Uninstalling](installation.md#uninstalling).

## Obtendo Ajuda

### Onde eu faço perguntas ou reporto bugs?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **A partir do seu terminal:** `openspec feedback "sua mensagem"` abre um GitHub issue para você.

### Estes docs estão errados ou confusos. O que eu faço?

Diga-nos, ou corrija. PRs de documentação são bem-vindos e valorizados. Abra uma issue ou envie um pull request.