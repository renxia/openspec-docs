# Editando e Iterando em uma Mudança

**Todo artefato em uma mudança é apenas um arquivo Markdown que você pode editar a qualquer momento.** Não há uma "fase de planejamento" bloqueada, nenhum portão de aprovação, nenhum modo de edição especial para entrar. Quer alterar a proposta depois de ter começado a construir? Abra `proposal.md` e altere-a. Percebeu que o design está errado no meio da implementação? Corrija `design.md` e continue. Essa é toda a resposta, e é proposital.

Esta página é para o momento em que você pensa "espera, posso voltar e alterar isso?" Sim. Aqui está como, para cada caso comum.

## Duas maneiras de editar qualquer coisa

Você sempre tem ambas:

1. **Edite o arquivo diretamente.** Os artefatos são Markdown simples em `openspec/changes/<name>/`. Abra `proposal.md`, `design.md`, `tasks.md` ou um delta spec em `specs/` no seu editor e altere-o. Nada mais é necessário.

2. **Peça ao seu AI para revisá-lo.** No chat, basta dizer o que você quer: "Atualize a proposta para remover a ideia de cache e adicionar uma seção de rate-limit", ou "o design deve usar uma fila, não polling". O AI edita o artefato para você, usando o resto da mudança como contexto.

Use o que melhor se adequar ao momento. Pequeno ajuste de redação? Edite o arquivo. Reformulação substantiva? Deixe o AI revisar com contexto completo.

## "Como atualizo a proposta (ou especificações) depois de ter começado?"

Apenas atualize. Mesma mudança, refinada.

Se você estiver usando os comandos expandidos, o fluxo natural é: edite o artefato, depois execute `/opsx:continue` para continuar a partir do novo estado, ou `/opsx:apply` para continuar implementando de acordo com o plano atualizado. Se você estiver nos comandos `core` padrão, edite o artefato e execute `/opsx:apply`; ele lê os arquivos atuais, então ele constrói com base no que os artefatos agora dizem.

O modelo mental: os artefatos são o plano vivo, não um contrato assinado. O AI sempre trabalha a partir de seu conteúdo atual, então editá-los direciona o trabalho.

```text
Você: Quero mudar a abordagem nesta mudança.

Você: [edite design.md, ou diga ao AI:]
     Atualize design.md para usar um job em background em vez de uma chamada síncrona.

AI:  design.md atualizado. A lista de tarefas ainda se encaixa; quer que eu continue aplicando?

Você: /opsx:apply
```

Isso responde a uma pergunta muito comum: não há um comando separado de "atualizar proposta" porque você não precisa de um. O arquivo é a fonte da verdade, e editá-lo (manualmente ou via AI) é a atualização.

## "Como volto para revisar depois de implementar?"

Você não precisa "voltar", porque nunca saiu. O fluxo de trabalho é fluido: revisão, edição e implementação não são fases sequenciais das quais você está preso.

Concretamente, depois de algum trabalho de `/opsx:apply`:

- Quer reexaminar o plano? Abra os artefatos e leia-os, ou execute `openspec show <change>` no seu terminal para uma visão consolidada.
- Encontrou algo para alterar? Edite o artefato (ou peça ao AI), depois continue.
- Quer uma verificação estruturada de que o código corresponde ao plano? Execute `/opsx:verify` (comando expandido). Ele relata completude, correção e coerência sem bloquear nada. Veja [Fluxos de Trabalho: Verificar](workflows.md#verify-check-your-work).

Não há "fase de revisão" para a qual retornar, porque a revisão é algo que você pode fazer a qualquer momento, incluindo após a implementação.

## "Editei o código manualmente. Como concilio isso com o OpenSpec?"

Isso acontece constantemente e está tudo bem. Você ajustou algo no seu editor, e agora o código e os artefatos discordam. Traga-os de volta à sincronia na direção que for verdadeira:

- **O código agora está correto, a especificação está obsoleta.** Atualize o delta spec (e as tarefas, se relevante) para descrever o comportamento que você realmente enviou. A especificação deve corresponder à realidade antes de você arquivar, pois arquivar mescla a especificação na sua fonte da verdade.
- **A especificação está correta, o código se desviou.** Continue construindo ou corrigindo até que o código corresponda à especificação.

Uma maneira rápida de identificar incompatibilidades é `/opsx:verify`: ele lê seus artefatos e seu código e diz onde eles divergem. Trate sua saída como uma lista de tarefas para reconciliação, depois arquive quando eles concordarem.

O princípio: no momento de arquivar, suas especificações se tornam a verdade registrada. Então, antes de arquivar, torne as especificações honestas sobre o que o código faz. Edições manuais são bem-vindas; apenas não deixe que elas dessincronizem a especificação silenciosamente.

## Refinando uma proposta com a qual você não está satisfeito

Se uma proposta gerada não atingir o alvo, você tem três bons movimentos:

- **Iterar no local.** Diga ao AI o que está errado ("o escopo é muito amplo, remova os recursos de administração") e deixe-o revisar. Mais barato e geralmente correto.
- **Explore primeiro, depois reproponha.** Se o problema é que a própria ideia não está clara, volte para `/opsx:explore`, pense bem sobre ela, e deixe uma proposta mais precisa sair disso. Veja [Explore Primeiro](explore.md).
- **Comece do zero.** Se a intenção mudou fundamentalmente, uma nova mudança pode ser mais clara do que remendar a antiga.

Esse último movimento tem seu próprio guia de decisão, a seguir.

## Quando atualizar vs. começar uma nova mudança

Versão curta: **atualize quando for o mesmo trabalho refinado; comece novo quando a intenção mudou fundamentalmente ou o escopo explodiu em um trabalho diferente.**

- Mesmo objetivo, abordagem melhor? Atualize.
- Redução de escopo (envie o MVP agora, mais depois)? Atualize, depois arquive, depois uma nova mudança para a fase dois.
- O próprio problema mudou ("adicionar modo escuro" se tornou "construir um sistema de temas completo")? Nova mudança.

Há um fluxograma completo e exemplos práticos em [Fluxos de Trabalho: Quando Atualizar vs Começar do Zero](workflows.md#when-to-update-vs-start-fresh) e um tratamento mais profundo em [OPSX: Quando Atualizar vs. Começar do Zero](opsx.md#when-to-update-vs-start-fresh).

## Uma nota sobre as tarefas

`tasks.md` é uma lista de verificação viva, não um plano congelado. Conforme você implementa, você pode adicionar tarefas que descobrir, remover as que se mostraram desnecessárias, ou reordená-las. O AI marca os itens como concluídos à medida que os completa durante `/opsx:apply`, e ele retoma a partir da primeira tarefa não marcada se você voltar mais tarde. Editar a lista durante o processo é esperado.

## Para onde ir a seguir

- [Fluxos de Trabalho](workflows.md) - padrões, além do guia de decisão atualizar-vs-novo
- [Revisando uma Mudança](reviewing-changes.md) - a passagem de dois minutos em um plano antes de construí-lo
- [Explore Primeiro](explore.md) - o lugar para voltar quando uma ideia precisar ser repensada
- [Comandos](commands.md) - `/opsx:continue`, `/opsx:apply` e `/opsx:verify` em detalhes
- [Conceitos: Artefatos](concepts.md#artifacts) - para que serve cada artefato