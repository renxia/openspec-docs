# Editando e Iterando sobre uma Mudança

**Cada artefato em uma mudança é apenas um arquivo Markdown que você pode editar a qualquer momento.** Não existe uma "fase de planejamento" bloqueada, nenhum portão de aprovação, nem um modo de edição especial para entrar. Quer mudar a proposta depois de ter começado a construir? Abra `proposal.md` e mude-o. Percebeu que o design está errado no meio da implementação? Corrija `design.md` e continue. Essa é a resposta completa, e é intencional.

Esta página é para o momento em que você pensa: "espere, posso voltar e mudar isso?". Sim. Veja como fazer, para cada caso comum.

## Duas maneiras de editar qualquer coisa

Você sempre tem as duas opções:

1. **Editar o arquivo diretamente.** Os artefatos são Markdown simples localizados em `openspec/changes/<name>/`. Abra `proposal.md`, `design.md`, `tasks.md` ou uma especificação delta sob `specs/` no seu editor e faça a alteração. Nada mais é necessário.

2. **Pedir ao seu AI para revisar.** No chat, basta dizer o que você quer: "Atualize a proposta para remover a ideia de cache e adicionar uma seção de limite de taxa," ou "o design deve usar uma fila, não polling." O AI edita o artefato por você, usando o restante da mudança como contexto.

Use o que melhor se encaixa no momento. Um pequeno ajuste na redação? Edite o arquivo. Uma reformulação substancial? Deixe o AI revisar com o contexto completo.

## "Como eu atualizo a proposta (ou as especificações) depois de ter começado?"

Basta atualizar. A mesma mudança, refinada.

Se você estiver usando os comandos expandidos, o fluxo natural é: editar o artefato e, em seguida, executar `/opsx:continue` para continuar a partir do novo estado, ou `/opsx:apply` para continuar implementando com base no plano atualizado. Se você estiver nos comandos padrão `core`, edite o artefato e execute `/opsx:apply`; ele lê os arquivos atuais, então constrói em relação ao que os artefatos dizem agora.

O modelo mental é este: os artefatos são o plano vivo, não um contrato assinado. O AI sempre trabalha com base no conteúdo atual deles, portanto, editá-los direciona o trabalho.

```text
Você: Eu quero mudar a abordagem nesta mudança.

Você: [editar design.md, ou dizer ao AI:]
     Atualize design.md para usar uma job em background em vez de uma chamada síncrona.

AI:  design.md atualizado. A lista de tarefas ainda se encaixa; quer que eu continue aplicando?

Você: /opsx:apply
```

Isso responde a uma pergunta muito comum: não há um comando separado de "atualizar proposta" porque você não precisa dele. O arquivo é a fonte da verdade, e editá-lo (manualmente ou via AI) é a atualização.

## "Como eu volto para revisar depois de implementar?"

Você não precisa "voltar", porque nunca saiu. O fluxo de trabalho é fluido: revisão, edição e implementação não são fases sequenciais nas quais você está preso.

Concretamente, após algum trabalho com `/opsx:apply`:

- Quer reexaminar o plano? Abra os artefatos e leia-os, ou execute `openspec show <change>` no seu terminal para uma visão consolidada.
- Encontrou algo a mudar? Edite o artefato (ou peça ao AI para fazer isso), e continue.
- Quer uma verificação estruturada de que o código corresponde ao plano? Execute `/opsx:verify` (comando expandido). Ele relata completude, correção e coerência sem bloquear nada. Veja [Workflows: Verify](workflows.md#verify-check-your-work).

Não há uma "fase de revisão" para retornar, porque a revisão é algo que você pode fazer em qualquer momento, incluindo após a implementação.

## "Eu editei o código manualmente. Como reconcilio isso com o OpenSpec?"

Isso acontece constantemente e está tudo bem. Você ajustou algo no seu editor, e agora o código e os artefatos estão em desacordo. Traga-os de volta à sincronia na direção que for verdadeira:

- **O código está correto, a especificação está obsoleta.** Atualize a especificação delta (e as tarefas, se relevante) para descrever o comportamento que você realmente entregou. A especificação deve corresponder à realidade antes de arquivar, porque o arquivamento mescla a especificação na sua fonte da verdade.
- **A especificação está correta, o código desviou.** Continue construindo ou corrigindo até que o código corresponda à especificação.

Uma maneira rápida de expor as inconsistências é `/opsx:verify`: ele lê seus artefatos e seu código e diz onde eles divergem. Trate sua saída como uma lista de tarefas para reconciliação, e então arquive quando eles concordarem.

O princípio é: no momento do arquivamento, suas especificações se tornam a verdade do registro. Portanto, antes de arquivar, torne as especificações honestas sobre o que o código faz. Edições manuais são bem-vindas; apenas não permita que elas desincronizem silenciosamente a especificação.

## Refinando uma proposta com a qual você não está satisfeito

Se uma proposta gerada falhar em atender às expectativas, você tem três boas opções:

- **Iterar no local.** Diga ao AI o que está errado ("o escopo é muito amplo, remova os recursos de administrador") e deixe-o revisar. É a opção mais barata e geralmente a correta.
- **Explorar primeiro, depois reapresentar.** Se o problema for que a ideia em si não está clara, recue para `/opsx:explore`, pense sobre isso e deixe uma proposta mais nítida surgir disso. Veja [Explore First](explore.md).
- **Começar do zero.** Se a intenção mudou fundamentalmente, uma nova mudança pode ser mais clara do que remendar a antiga.

Essa última opção tem seu próprio guia de decisão, em seguida.

## Quando atualizar versus começar uma nova mudança

Versão curta: **atualize quando for o mesmo trabalho refinado; comece um novo quando a intenção mudar fundamentalmente ou o escopo explodir em trabalho diferente.**

- Mesmo objetivo, abordagem melhor? Atualize.
- Redução de escopo (entregar o MVP agora, mais tarde)? Atualize, depois arquive, e então uma nova mudança para a fase dois.
- O problema em si mudou ("adicionar dark mode" virou "construir um sistema completo de temas")? Nova mudança.

Há um fluxograma completo e exemplos práticos em [Workflows: When to Update vs Start Fresh](workflows.md#when-to-update-vs-start-fresh) e um tratamento mais aprofundado em [OPSX: When to Update vs. Start Fresh](opsx.md#when-to-update-vs-start-fresh).

## Uma nota sobre tarefas

`tasks.md` é uma checklist viva, não um plano congelado. À medida que você implementa, você pode adicionar tarefas que descobreu, remover as que se mostraram desnecessárias ou reordená-las. O AI marca os itens como concluídos enquanto ele os completa durante `/opsx:apply`, e ele retoma do primeiro item não verificado se você voltar mais tarde. Editar a lista no meio do caminho é esperado.

## Para onde ir em seguida

- [Workflows](workflows.md) - padrões, além do guia de decisão atualizar vs novo
- [Explore First](explore.md) - o lugar para recuar quando uma ideia precisa ser repensada
- [Commands](commands.md) - `/opsx:continue`, `/opsx:apply` e `/opsx:verify` em detalhes
- [Concepts: Artifacts](concepts.md#artifacts) - para que serve cada artefato