# Exemplos e Receitas

Mudanças reais, do início ao fim. Cada receita mostra os comandos que você digitaria e o que veria em retorno, para que você possa mapear sua situação a um padrão e copiá-lo. Estes usam os comandos **core** padrão (`propose`, `explore`, `apply`, `sync`, `archive`); quando o conjunto expandido ajuda, isso é anotado.

Um lembrete antes de começar: comandos de barra como `/opsx:propose` vão no **chat do assistente AI**, e comandos `openspec` vão no seu **terminal**. Se isso for novo, leia [Como os Comandos Funcionam](how-commands-work.md) primeiro. Nas transcrições abaixo, `You:` e `AI:` são o chat, e as linhas que começam com `$` são o terminal.

> **Não tem certeza do que está construindo ainda?** A maioria dessas receitas é mais clara se você começar com `/opsx:explore` para pensar antes de comprometer. [Receita 3](#recipe-3-exploring-before-you-commit) mostra isso em ação, e o guia [Explore First](explore.md) apresenta o caso completo.

## Receita 1: Um pequeno recurso, o caminho rápido

**Quando usar:** você sabe o que quer e é uma peça de trabalho contida. Esta é a receita mais comum.

A coisa toda tem três comandos. Propor, construir, arquivar.

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — por quê e o quê
     ✓ specs/      — o novo requisito e seus cenários
     ✓ design.md   — abordagem técnica
     ✓ tasks.md    — checklist de implementação
     Pronto para implementação. Execute /opsx:apply.
```

Agora leia o plano. Abra a proposta e o delta spec. Este é o momento para o OpenSpec: pegar uma suposição errada enquanto ela ainda é um parágrafo, não 400 linhas de código. Edite qualquer artefato diretamente se algo estiver errado, e então continue.

```text
You: /opsx:apply

AI:  Trabalhando nas tarefas...
     ✓ 1.1 Adicionar botão de logout no cabeçalho
     ✓ 1.2 Limpar sessão ao clicar
     ✓ 1.3 Adicionar diálogo de confirmação
     Todas as tarefas concluídas!

You: /opsx:archive

AI:  Arquivando add-logout-button...
     ✓ Especificações mescladas em openspec/specs/auth/spec.md
     ✓ Movido para openspec/changes/archive/2026-06-22-add-logout-button/
     Concluído. Pronto para a próxima mudança.
```

É isso. O comportamento de logout agora faz parte das suas especificações, e a mudança está arquivada com seu contexto completo.

## Receita 2: Um bug fix (Correção de erro)

**Quando usar:** algo está quebrado e você quer que o conserto seja registrado como uma mudança deliberada no comportamento, não um commit misterioso.

As correções de bugs funcionam exatamente como recursos. A diferença está em como você enquadra a proposta: descreva o comportamento *correto*, e não apenas "consertar o bug".

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     A proposta captura o comportamento quebrado atual e o
     comportamento pretendido. O delta spec MODIFICA o requisito de redirecionamento
     para que ele seja preciso e testável.
     Pronto para implementação.
```

Como a correção é registrada como um requisito `MODIFIED` com um cenário fresco, a próxima pessoa (ou a próxima sessão do AI) vê não apenas que você corrigiu, mas o que significa "correto". Então `/opsx:apply` e `/opsx:archive` normalmente.

Dica: para uma correção, um bom cenário é o teste de regressão em prosa. "GIVEN um usuário deslogado, WHEN ele envia credenciais válidas, THEN ele cai no painel e não é redirecionado novamente." Escreva isso, e a implementação terá um alvo claro.

## Receita 3: Explorando antes de comprometer

**Quando usar:** você tem um problema, mas ainda não um plano. Você não sabe o que construir ou qual abordagem é a certa.

Comece com `/opsx:explore`. É um parceiro de pensamento sem estrutura e sem artefatos criados. Ele lê sua codebase e ajuda você a decidir.

```text
You: /opsx:explore

AI:  O que você gostaria de explorar?

You: As páginas parecem lentas, mas não sei para onde o tempo está indo.

AI:  Deixe-me dar uma olhada... Encontrei três culpados prováveis:
     1. Imagens grandes e não otimizadas na lista de produtos
     2. Busca síncrona de dados que bloqueia a renderização
     3. Re-renders acionados por mudanças de contexto
     Qual devemos abordar primeiro?

You: A da busca de dados.

You: /opsx:propose optimize-product-list-fetching

AI:  Criou a mudança, com uma proposta informada pelo que acabamos de encontrar. Pronto para implementação.
```

A exploração esclarece seu pensamento *antes* de você gastar uma mudança nisso. Quando o insight se cristaliza, proponha, e o AI carrega o contexto adiante.

## Receita 4: Gerenciando duas mudanças ao mesmo tempo

**Quando usar:** você está no meio de um recurso e uma correção urgente pula a fila.

As mudanças são pastas independentes, então o trabalho paralelo não entra em conflito. Comece a correção, envie-a (ship it), depois volte para o recurso onde parou.

```text
You: Estou no meio do add-dark-mode, mas preciso corrigir um bug de login agora.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Pronto para implementação.

You: /opsx:apply

AI:  Implementou a correção. Todas as tarefas concluídas.

You: /opsx:archive

AI:  ✓ Arquivando fix-login-redirect.

You: Voltando ao dark mode.

You: /opsx:apply add-dark-mode

AI:  Retomando add-dark-mode. Retomando na tarefa 2.3: Atualizar Cabeçalho...
```

Nomear a mudança em `/opsx:apply add-dark-mode` é como você aponta o AI para uma mudança específica quando mais de uma está ativa. Como as tarefas rastreiam a conclusão em `tasks.md`, o AI sabe exatamente onde você parou.

Quando várias mudanças são feitas ao mesmo tempo, o expansivo `/opsx:bulk-archive` arquiva-as juntas e resolve conflitos de especificação verificando o que foi realmente implementado. Veja [Workflows](workflows.md#parallel-changes).

## Receita 5: Um refactor sem mudança de comportamento

**Quando usar:** você está reestruturando código, e o comportamento visível externamente deve permanecer idêntico.

Este é o caso interessante, porque um refactor puro *não tem nada a adicionar às suas especificações*. O contrato de comportamento não muda; apenas a implementação muda. Portanto, o trabalho reside no design e nas tarefas, e o delta da especificação está vazio ou ausente.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. A proposta declara o objetivo (dividir o módulo de pagamento, sem mudança de comportamento) e o design captura a nova estrutura. Sem mudanças na especificação, pois o comportamento é idêntico. Pronto para implementação.
```

Quando você arquiva uma mudança que não toca nas especificações, você pode dizer ao comando do terminal para pular a etapa da especificação:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

A mesma flag é útil para ferramentas, CI e mudanças apenas de documentação. O princípio: as especificações descrevem o comportamento, então se o comportamento não mudou, a especificação também não deveria mudar. Veja [Conceitos](concepts.md#what-a-spec-is-and-is-not).

## Receita 6: Controle passo a passo (comandos expandidos)

**Quando usar:** uma mudança complexa ou arriscada onde você quer revisar cada artefato antes de prosseguir.

O `/opsx:propose` core rascunha tudo de uma vez. Quando você prefere ir um passo de cada vez, ative os comandos expandidos:

```bash
$ openspec config profile      # selecione os workflows expandidos
$ openspec update              # aplique-os a este projeto
```

Agora você pode criar e construir incrementalmente:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Pronto para criar: proposal.

You: /opsx:continue

AI:  Criou proposal.md. Agora disponíveis: specs, design.

You: /opsx:continue

AI:  Criou specs/auth/spec.md. Agora disponível: design.
```

Revise cada artefato à medida que ele é criado, edite livremente e continue quando estiver satisfeito. Quando você quiser o restante rascunhado de uma vez, `/opsx:ff` avança rapidamente pelos artefatos de planejamento restantes. Antes de arquivar, `/opsx:verify` verifica se a implementação realmente corresponde às especificações. Veja [Workflows](workflows.md#opsxff-vs-opsxcontinue).

## Receita 7: Aprendendo o ciclo completo na prática

**Quando usar:** você instalou o OpenSpec e quer *sentir* o fluxo de trabalho no seu próprio código, não em um exemplo de brinquedo.

Ative os comandos expandidos (veja a Receita 6), e então:

```text
You: /opsx:onboard

AI:  Bem-vindo ao OpenSpec! Vou guiá-lo por uma mudança completa usando sua codebase real. Deixe-me procurar por uma pequena melhoria segura que possamos fazer juntos...
```

`/opsx:onboard` encontra uma melhoria real (pequena), cria uma mudança para ela, implementa e arquiva, narrando cada passo. Leva de 15 a 30 minutos e deixa você com uma mudança real que pode manter ou descartar. É a maneira mais gentil de aprender. Veja [Comandos](commands.md#opsxonboard).

## Verificando seu trabalho pelo terminal

A qualquer momento, do seu terminal, você pode inspecionar o estado das coisas:

```bash
$ openspec list                      # mudanças ativas
$ openspec show add-dark-mode        # uma mudança em detalhes
$ openspec validate add-dark-mode    # verificar estrutura
$ openspec view                      # painel interativo
```

Estes são ferramentas de leitura e inspeção. A proposição e a construção ainda acontecem através de comandos de barra no chat. Detalhes completos na [Referência CLI](cli.md).

## Para onde ir em seguida

- [Explore First](explore.md): a maneira recomendada de começar quando você não tem certeza
- [Workflows](workflows.md): os padrões acima, com orientação de decisão sobre quando usar cada um
- [Commands](commands.md): todos os comandos de barra em detalhes
- [Getting Started](getting-started.md): o walkthrough canônico da primeira mudança
- [Concepts](concepts.md): por que as peças se encaixam da maneira que se encaixam