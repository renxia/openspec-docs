# Editando e Iterando em uma Mudança

**Todo artefato de uma mudança é apenas um arquivo Markdown que você pode editar a qualquer momento.** Não existe uma "fase de planejamento" travada, nem um portão de aprovação, nem um modo de edição especial para entrar. Quer mudar a proposta depois de ter começado a construir? Abra `proposal.md` e mude-o. Percebeu que o design está errado no meio da implementação? Corrija `design.md` e continue. Essa é a resposta completa, e isso é intencional (by design).

Esta página é para o momento em que você pensa: "espere, posso voltar e mudar aquilo?". Sim. Veja como fazer isso, para cada caso comum.

## Duas maneiras de editar qualquer coisa

Você sempre tem as duas opções:

1. **Editar o arquivo diretamente.** Os artefatos são Markdown simples localizados em `openspec/changes/<name>/`. Abra `proposal.md`, `design.md`, `tasks.md` ou uma delta spec sob `specs/` no seu editor e faça a alteração. Nada mais é necessário.

2. **Pedir à sua IA para revisar.** No chat, basta dizer o que você quer: "Atualize a proposta para remover a ideia de cache e adicionar uma seção de limite de taxa," ou "o design deve usar uma fila, não polling." A IA edita o artefato por você, usando o restante da mudança como contexto.

Use o que se encaixar no momento. Uma pequena alteração na redação? Edite o arquivo. Um repensar substantivo? Deixe a IA revisar com o contexto completo.

## "Como eu atualizo a proposta (ou as specs) depois de ter começado?"

Basta atualizar. A mesma mudança, refinada.

Se você estiver usando os comandos expandidos, o fluxo natural é: edite o artefato e, em seguida, execute `/opsx:continue` para continuar a partir do novo estado, ou `/opsx:apply` para continuar implementando contra o plano atualizado. Se você estiver nos comandos `core` padrão, edite o artefato e execute `/opsx:apply`; ele lê os arquivos atuais, então constrói com base no que os artefatos dizem agora.

O modelo mental é este: os artefatos são o plano vivo, não um contrato assinado. A IA sempre trabalha a partir de seu conteúdo atual, portanto, editá-los direciona o trabalho.

```text
Você: Eu quero mudar a abordagem nesta mudança.

Você: [editar design.md, ou dizer à IA:]
     Atualize design.md para usar uma job em background em vez de uma chamada síncrona.

IA:  design.md atualizado. A lista de tarefas ainda se encaixa; devo continuar aplicando?

Você: /opsx:apply
```

Isso responde a uma pergunta muito comum: não existe um comando separado de "atualizar proposta" porque você não precisa dele. O arquivo é a fonte da verdade, e editá-lo (manualmente ou via IA) é a atualização.

## "Como eu volto para revisar depois de implementar?"

Você não precisa "voltar", porque nunca saiu. O fluxo de trabalho é fluido: revisão, edição e implementação não são fases sequenciais nas quais você está preso.

Concretamente, após algum trabalho com `/opsx:apply`:

- Quer reexaminar o plano? Abra os artefatos e leia-os, ou execute `openspec show <change>` no seu terminal para uma visão consolidada.
- Encontrou algo para mudar? Edite o artefato (ou peça à IA para fazer isso), e continue.
- Quer uma verificação estruturada de que o código corresponde ao plano? Execute `/opsx:verify` (comando expandido). Ele relata completude, correção e coerência sem bloquear nada. Veja [Workflows: Verify](workflows.md#verify-check-your-work).

Não há uma "fase de revisão" para retornar, porque a revisão é algo que você pode fazer em qualquer momento, inclusive após a implementação.

## "Eu editei o código manualmente. Como eu reconcilio isso com o OpenSpec?"

Isso acontece constantemente e está tudo bem. Você ajustou algo no seu editor, e agora o código e os artefatos estão em desacordo. Traga-os de volta à sincronia na direção que for verdadeira:

- **O código está correto, a especificação está obsoleta.** Atualize a delta spec (e as tarefas, se relevante) para descrever o comportamento que você realmente entregou. A especificação deve corresponder à realidade antes de você arquivar, porque o arquivamento funde a especificação na sua fonte da verdade.
- **A especificação está correta, o código desviou.** Continue construindo ou corrigindo até que o código corresponda à especificação.

Uma maneira rápida de expor as inconsistências é `/opsx:verify`: ele lê seus artefatos e seu código e diz onde eles divergem. Trate a saída dele como uma lista de tarefas para reconciliação, e só então arquive quando eles concordarem.

O princípio é: no momento do arquivamento, suas especificações se tornam a verdade registrada. Portanto, antes de arquivar, torne as especificações honestas sobre o que o código faz. Edições manuais são bem-vindas; apenas não permita que elas desincronizem silenciosamente a especificação.

## Refinando uma proposta com a qual você não está satisfeito

Se uma proposta gerada falhar em atender às expectativas, você tem três boas opções:

- **Iterar no local.** Diga à IA o que está errado ("o escopo é muito amplo, remova os recursos de administração") e deixe-a revisar. É a opção mais barata e geralmente correta.
- **Explorar primeiro, depois repropor.** Se o problema for que a ideia em si não está clara, recue para `/opsx:explore`, pense sobre isso e deixe uma proposta mais nítida surgir disso. Veja [Explore First](explore.md).
- **Começar do zero.** Se a intenção mudou fundamentalmente, uma nova mudança pode ser mais clara do que remendar a antiga.

Essa última opção tem seu próprio guia de decisão, em seguida.

## Quando atualizar versus começar uma nova mudança

Versão curta: **atualize quando for o mesmo trabalho refinado; comece um novo quando a intenção mudar fundamentalmente ou o escopo explodir em trabalho diferente.**

- Mesmo objetivo, melhor abordagem? Atualize.
- Redução do escopo (entregar o MVP agora, mais tarde)? Atualize, depois arquive, e então uma nova mudança para a fase dois.
- O problema em si mudou ("adicionar modo escuro" virou "construir um sistema de temas completo")? Nova mudança.

Há um fluxograma completo e exemplos trabalhados em [Workflows: When to Update vs Start Fresh](workflows.md#when-to-update-vs-start-fresh) e um tratamento mais profundo em [OPSX: When to Update vs. Start Fresh](opsx.md#when-to-update-vs-start-fresh).

## Uma nota sobre tarefas

`tasks.md` é uma checklist viva, não um plano congelado. À medida que você implementa, pode adicionar tarefas que descobreu, remover aquelas que se mostraram desnecessárias ou reordená-las. A IA marca os itens como concluídos ao completá-los durante `/opsx:apply`, e ela retoma a partir da primeira tarefa não marcada se você voltar mais tarde. Editar a lista no meio do caminho é esperado.

## Para onde ir em seguida

- [Workflows](workflows.md) - padrões, além do guia de decisão atualizar vs novo
- [Explore First](explore.md) - o local para recuar quando uma ideia precisar ser repensada
- [Commands](commands.md) - `/opsx:continue`, `/opsx:apply` e `/opsx:verify` em detalhes
- [Concepts: Artifacts](concepts.md#artifacts) - para que serve cada artefato