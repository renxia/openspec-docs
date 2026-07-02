# FAQ

Respostas rápidas às perguntas mais frequentes. Se sua pergunta é realmente sobre "algo está quebrado", [Troubleshooting] é a página mais adequada. Se você quer uma definição de algum termo, consulte o [Glossary].

## O Básico

### O que é OpenSpec, em uma frase?

Uma camada leve que faz você e seu assistente de codificação IA concordarem sobre o que construir, por escrito, antes que qualquer código seja escrito.

### Por que eu gostaria disso?

Porque os assistentes de IA são confiantes mesmo quando estão errados. Quando os requisitos existem apenas em uma thread de chat, a IA preenche as lacunas com suposições, e você descobre isso depois que o código existe. OpenSpec move o acordo para mais cedo, onde os erros são baratos de corrigir. Consulte [Core Concepts at a Glance] para o caso completo.

### Eu tenho que usá-lo em tudo?

Não. Use-o onde o acordo é importante, ou seja na maior parte do trabalho não trivial. Para consertar um erro de digitação de um caractere, a cerimônia provavelmente não vale a pena, e isso está certo.

### Posso usá-lo em uma grande base de código existente, ou apenas em novos projetos?

Bases de código existentes são o evento principal. OpenSpec é focado em sistemas existentes (brownfield-first): você não documenta sua aplicação inteira antecipadamente. Você escreve especificações apenas para aquilo que cada mudança toca, e suas especificações se preenchem ao longo do tempo em torno do trabalho que você realmente faz. Há um guia dedicado: [Using OpenSpec in an Existing Project].

### Ele está ligado a uma ferramenta de IA específica?

Não. OpenSpec funciona com mais de 25 assistentes, incluindo Claude Code, Cursor, Windsurf, GitHub Copilot, Gemini CLI, Codex e outros. A lista completa e os detalhes por ferramenta estão em [Supported Tools].

## Executando Comandos

### Onde eu digito `/opsx:propose`?

No chat do seu assistente de IA, não no seu terminal. Este é o ponto de confusão mais comum, por isso tem sua própria página: [How Commands Work]. Versão curta: `openspec ...` roda no terminal, `/opsx:...` roda no chat.

### Como eu "início o modo interativo"?

Não há um modo separado para iniciar. Você abre seu assistente de IA normalmente e digita um comando slash no chat dele. O comando slash é como você "entra" no OpenSpec. (O único recurso genuinamente interativo do terminal é `openspec view`, um painel para navegar por especificações e mudanças.) Explicação completa em [How Commands Work].

### Eu digitei um comando slash e nada aconteceu. Por quê?

Provavelmente você digitou no terminal em vez de no chat da sua IA, ou os comandos ainda não estão instalados. Execute `openspec update` no seu projeto, reinicie seu assistente e tente digitar `/opsx` no chat e observe o autocomplete. [Troubleshooting] tem a checklist completa.

### Por que a sintaxe é `/opsx:propose` em uma ferramenta e `/opsx-propose` em outra?

Cada ferramenta de IA exibe comandos personalizados um pouco diferente. A intenção é idêntica; apenas a pontuação muda. Digite um slash no seu chat e o autocomplete mostrará o formato que sua ferramenta espera. A tabela por ferramenta está em [How Commands Work].

### Qual é a diferença entre uma skill e um comando?

Ambos são arquivos que o OpenSpec escreve para que seu assistente possa executar o fluxo de trabalho. Skills (`.../skills/openspec-*/SKILL.md`) são o padrão mais novo para todas as ferramentas; comandos (`.../commands/opsx-*`) são os arquivos slash mais antigos por ferramenta. Você não precisa escolher. Você apenas digita o comando slash, e o OpenSpec instala o que sua ferramenta usa.

## O Fluxo de Trabalho (Workflow)

### Por onde devo começar se eu não tenho certeza do que construir?

Com `/opsx:explore`. É um parceiro de pensamento sem riscos que lê sua base de código, apresenta opções e transforma um problema vago em um plano concreto, tudo antes que qualquer mudança ou código exista. Ele está no perfil padrão, então está sempre disponível. Quando o plano estiver claro, ele passa para `/opsx:propose`. Este é o melhor hábito a ser formado, pois impede uma IA ansiosa de construir confiante a coisa errada. Consulte [Explore First].

### Qual é o fluxo mais simples possível?

```text
/opsx:explore (opcional)   depois   /opsx:propose <o que você quer>   depois   /opsx:apply   depois   /opsx:archive
```

Use Explore para pensar, Propose para rascunhar o plano, Apply para construir, Archive para arquivar. Pule o explore se você já sabe exatamente o que quer.

### Qual é a diferença entre `/opsx:propose` e `/opsx:new`?

`/opsx:propose` é o comando padrão de uma etapa: ele cria a mudança e rascunha todos os artefatos de planejamento de uma vez. `/opsx:new` faz parte do conjunto expandido de comandos e apenas eskeleta uma mudança vazia, deixando você para criar os artefatos um por um com `/opsx:continue` (ou tudo de uma vez com `/opsx:ff`). Use propose a menos que você queira controle passo a passo. Consulte [Commands].

### O que são perfis `core` e expandidos?

Um perfil decide quais comandos slash serão instalados. **Core** (o padrão) fornece `propose`, `explore`, `apply`, `sync`, `archive`. O conjunto **expandido** adiciona `new`, `continue`, `ff`, `verify`, `bulk-archive` e `onboard` para um controle mais fino. Mude com `openspec config profile`, depois aplique com `openspec update`.

### Eu preciso executar `/opsx:sync`?

Geralmente não. O Sync mescla os delta specs de uma mudança em suas especificações principais, e `/opsx:archive` oferecerá para fazer isso por você. Execute o sync manualmente apenas quando quiser que as especificações sejam mescladas antes do arquivamento, por exemplo em uma mudança de longa duração. Consulte [Commands].

### Como eu edito uma proposta, especificação ou tarefa depois de ter começado?

Basta editar o arquivo. Cada artefato é Markdown simples em `openspec/changes/<name>/`, e não há fase bloqueada ou modo de edição especial. Mude manualmente, ou peça à sua IA para revisá-lo ("atualize o design para usar uma fila"), e continue. A IA sempre trabalha a partir do conteúdo atual do arquivo. Guia completo: [Editing & Iterating on a Change].

### Posso voltar e mudar o plano depois de implementar parte dele?

Sim, a qualquer momento. O fluxo de trabalho é fluido, então revisar e editar não são fases das quais você fica bloqueado. Edite o artefato e continue. Se você quiser uma verificação estruturada de que o código ainda corresponde ao plano, execute `/opsx:verify`. Consulte [Editing & Iterating on a Change].

### Eu editei o código manualmente. Como eu reconcilio isso com a especificação?

Traga-os de volta para sincronia antes de arquivar, pois o arquivamento torna suas especificações o registro da verdade. Se o código estiver correto agora, atualize o delta spec para corresponder ao que você enviou; se a especificação estiver correta, continue construindo até que o código concorde. `/opsx:verify` expõe as incompatibilidades. Consulte [Editing & Iterating on a Change].

### Quando devo atualizar uma mudança existente versus começar uma nova?

Atualize quando for o mesmo trabalho, refinado. Comece do zero quando a intenção mudou fundamentalmente ou o escopo explodiu em trabalho diferente. Há um fluxograma de decisão e exemplos em [Workflows].

### E se minha sessão esgotar o contexto, ou os requisitos mudarem durante a implementação?

É aqui que as especificações cumprem seu papel. Como o plano vive em arquivos (e não apenas no histórico de chat), você pode limpar seu contexto, iniciar uma nova sessão de IA e continuar com `/opsx:apply`; ele lê os artefatos e retoma da primeira tarefa não verificada. Se os requisitos mudarem, edite os artefatos para corresponder à nova realidade e continue. Manter uma janela de contexto limpa também produz melhores resultados; limpe-a antes da implementação.

### Devo commitar a pasta `openspec/` no git?

Sim. Suas especificações, mudanças ativas e o arquivo são parte do histórico do seu projeto. Commite-os como qualquer outro código fonte. O arquivo em particular torna-se um registro durável de por que seu sistema funciona da maneira que funciona.

## Especificações e Mudanças (Specs and Changes)

### O que vai em uma especificação versus um design?

Uma especificação descreve o comportamento observável: o que o sistema faz, suas entradas, saídas e condições de erro. Um design descreve como você irá construí-lo: a abordagem técnica, as decisões arquitetônicas, as mudanças nos arquivos. Se a implementação puder mudar sem alterar o comportamento externamente visível, ela pertence ao design, não à especificação. [Concepts] vai mais fundo.

### O que é uma delta spec?

Uma especificação que descreve apenas o que está mudando, usando seções `ADDED`, `MODIFIED` e `REMOVED`, em vez de recontar a especificação inteira. É assim que o OpenSpec lida com edições em sistemas existentes de forma limpa. Consulte [Concepts].

### Para onde vão as mudanças arquivadas?

Para `openspec/changes/archive/YYYY-MM-DD-<name>/`, com todos os artefatos preservados. Nada é excluído; a mudança apenas sai da sua lista ativa.

## Configuração e Personalização

### Como eu informo à IA sobre meu tech stack?

Coloque isso em `openspec/config.yaml` sob `context:`. Esse texto é injetado em cada solicitação de planejamento, para que a IA sempre saiba seu stack e suas convenções. Consulte [Customization].

### Posso gerar especificações em um idioma diferente do inglês?

Sim. Adicione uma instrução de idioma ao `context:` da sua configuração. [Multi-Language] tem trechos prontos para vários idiomas.

### Posso mudar o fluxo de trabalho em si?

Sim, com esquemas personalizados. Um esquema define quais artefatos existem e como eles dependem uns dos outros. Forkeie o padrão com `openspec schema fork spec-driven my-workflow`, e depois edite. Consulte [Customization].

## Modelos, Privacidade e Atualizações

### Qual modelo de IA devo usar?

OpenSpec funciona melhor com modelos de alta capacidade de raciocínio. O README recomenda modelos como Codex 5.5 e Opus 4.7 tanto para planejamento quanto para implementação. Mantenha também sua janela de contexto limpa: limpe-a antes da implementação para melhores resultados.

### O OpenSpec coleta dados?

Ele coleta estatísticas anônimas de uso: nome do comando e versão apenas. Nenhum argumento, caminho, conteúdo ou dado pessoal, e ele é desativado automaticamente no CI. Exclua com `export OPENSPEC_TELEMETRY=0` ou `export DO_NOT_TRACK=1`.

### Como eu atualizo?

Duas etapas. Atualize o pacote (`npm install -g @fission-ai/openspec@latest`), e depois execute `openspec update` dentro de cada projeto para atualizar os skills e comandos gerados.

### Como eu desinstalo o OpenSpec?

Não há um comando de desinstalação, pois é apenas um pacote global mais arquivos no seu projeto. Remova o pacote (`npm uninstall -g @fission-ai/openspec`), e opcionalmente exclua o diretório `openspec/` e os arquivos de ferramenta gerados. O guia passo a passo, incluindo o que é seguro manter, está em [Installation: Uninstalling].

## Obtendo Ajuda

### Onde eu faço perguntas ou reporto bugs?

- **Discord:** [discord.gg/YctCnvvshC]
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues]
- **A partir do seu terminal:** `openspec feedback "sua mensagem"` abre um GitHub issue para você.

### Estes docs estão errados ou confusos. O que eu faço?

Diga-nos, ou corrija. PRs de documentação são bem-vindos e valorizados. Abra um issue ou envie um pull request.