# Exemplos e Receitas

Mudanças reais, do início ao fim. Cada receita mostra os comandos que você digitaria e o que veria em retorno, para que possa mapear sua situação a um padrão e copiá-lo. Estes utilizam os comandos **core** padrão (`propose`, `explore`, `apply`, `sync`, `archive`); quando o conjunto expandido ajuda, isso é notado.

Um lembrete antes de começar: comandos slash como `/opsx:propose` vão no **chat do assistente AI**, e comandos `openspec` vão no seu **terminal**. Se isso for novo, leia [Como os Comandos Funcionam](how-commands-work.md) primeiro. Nas transcrições abaixo, `You:` e `AI:` são o chat, e as linhas que começam com `$` são o terminal.

> **Não tem certeza do que está construindo ainda?** A maioria destas receitas é mais clara se você começar com `/opsx:explore` para pensar sobre isso primeiro. [Recipe 3](#recipe-3-exploring-before-you-commit) mostra isso em ação, e o guia [Explore First](explore.md) apresenta o caso completo.

## Recipe 1: Um pequeno recurso, o caminho rápido

**Quando usar:** você sabe o que quer e é um trabalho contido. Esta é a receita mais comum.

O processo inteiro consiste em três comandos. Propor, construir, arquivar.

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

Agora, leia o plano. Abra a proposta e o delta spec. Este é o momento para o OpenSpec: pegar uma suposição errada enquanto ela ainda é um parágrafo, não 400 linhas de código. Edite qualquer artefato diretamente se algo estiver errado, e então continue.

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Add logout button to header
     ✓ 1.2 Clear session on click
     ✓ 1.3 Add confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  Archiving add-logout-button...
     ✓ Merged specs into openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2026-06-22-add-logout-button/
     Done. Ready for the next change.
```

É isso. O comportamento de logout agora faz parte dos seus specs, e a mudança está arquivada com seu contexto completo.

## Recipe 2: Um bug fix

**Quando usar:** algo está quebrado e você quer que o conserto seja registrado como uma mudança deliberada no comportamento, não um commit misterioso.

Os bug fixes funcionam exatamente como recursos (features). A diferença está em como você enquadra a proposta: descreva o comportamento *correto*, não apenas "consertar o bug".

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

Como o conserto é registrado como um requisito `MODIFIED` com um cenário fresco, a próxima pessoa (ou a próxima sessão do AI) verá não apenas que você corrigiu, mas o que significa "correto". Em seguida, `/opsx:apply` e `/opsx:archive` como de costume.

Dica: para um conserto, um bom cenário é o teste de regressão em prosa. "GIVEN um usuário deslogado, WHEN ele envia credenciais válidas, THEN ele cai no painel e não é redirecionado novamente." Escreva isso, e a implementação terá um alvo claro.

## Recipe 3: Explorando antes de comitar

**Quando usar:** você tem um problema, mas ainda não um plano. Você não sabe o que construir ou qual abordagem é a correta.

Comece com `/opsx:explore`. É um parceiro de pensamento sem estrutura e sem criação de artefatos. Ele lê sua codebase e ajuda você a decidir.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Page loads feel slow but I don't know where the time goes.

AI:  Let me look... I found three likely culprits:
     1. Large unoptimized images on the product list
     2. Synchronous data fetching that blocks render
     3. Re-renders triggered by context changes
     Which should we tackle first?

You: The data fetching one.

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation.
```

A exploração esclarece seu pensamento *antes* de você gastar uma mudança nisso. Quando o insight se cristaliza, proponha, e o AI carrega o contexto adiante.

## Recipe 4: Gerenciando duas mudanças ao mesmo tempo

**Quando usar:** você está no meio de um recurso (feature) e um conserto urgente pula a fila.

As mudanças são pastas independentes, então o trabalho paralelo não entra em conflito. Inicie o conserto, envie-o (ship it), e depois retorne ao recurso onde parou.

```text
You: I'm partway through add-dark-mode, but I need to fix a login bug now.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Ready for implementation.

You: /opsx:apply

AI:  Implemented the fix. All tasks complete.

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect.

You: Back to dark mode.

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode. Picking up at task 2.3: Update Header...
```

Nomear a mudança em `/opsx:apply add-dark-mode` é como você aponta o AI para uma mudança específica quando mais de uma está ativa. Como as tarefas rastreiam a conclusão em `tasks.md`, o AI sabe exatamente onde você parou.

Quando várias mudanças são feitas ao mesmo tempo, o expandido `/opsx:bulk-archive` arquiva tudo junto e resolve conflitos de especificação verificando o que foi realmente implementado. Veja [Workflows](workflows.md#parallel-changes).

## Recipe 5: Um refator sem mudança de comportamento

**Quando usar:** você está reestruturando código, e o comportamento externamente visível deve permanecer idêntico.

Este é o caso interessante, porque um refator puro não tem *nada para adicionar aos seus specs*. O contrato de comportamento não muda; apenas a implementação muda. Portanto, o trabalho reside no design e nas tarefas, e o delta do spec está vazio ou ausente.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

Quando você arquiva uma mudança que não toca nos specs, você pode dizer ao comando do terminal para pular a etapa de especificação:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

A mesma flag é útil para ferramentas (tooling), CI e mudanças apenas de documentação. O princípio é: os specs descrevem o comportamento, então se o comportamento não mudou, o spec também não deveria mudar. Veja [Concepts](concepts.md#what-a-spec-is-and-is-not).

## Recipe 6: Controle passo a passo (comandos expandidos)

**Quando usar:** uma mudança complexa ou arriscada na qual você deseja revisar cada artefato antes de prosseguir.

O `/opsx:propose` core rascunha tudo de uma vez. Quando você prefere ir um passo de cada vez, ative os comandos expandidos:

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

Agora você pode criar e construir incrementalmente:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

Revise cada artefato à medida que ele é gerado, edite livremente e continue quando estiver satisfeito. Quando você quiser o restante rascunhado de uma vez, `/opsx:ff` avança (fast-forwards) através dos artefatos de planejamento restantes. Antes de arquivar, `/opsx:verify` verifica se a implementação realmente corresponde aos specs. Veja [Workflows](workflows.md#opsxff-vs-opsxcontinue).

## Recipe 7: Aprendendo o ciclo completo na prática

**Quando usar:** você instalou o OpenSpec e quer *sentir* o fluxo de trabalho no seu próprio código, não em um exemplo de brinquedo.

Ative os comandos expandidos (veja Recipe 6), e então:

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` encontra uma melhoria real (pequena), cria uma mudança para ela, implementa e arquiva, narrando cada passo. Leva de 15 a 30 minutos e deixa você com uma mudança real que pode manter ou descartar. É a maneira mais suave de aprender. Veja [Commands](commands.md#opsxonboard).

## Verificando seu trabalho pelo terminal

A qualquer momento, a partir do seu terminal, você pode inspecionar o estado das coisas:

```bash
$ openspec list                      # mudanças ativas
$ openspec show add-dark-mode        # uma mudança em detalhes
$ openspec validate add-dark-mode    # verificar estrutura
$ openspec view                      # painel interativo
```

Estes são ferramentas de leitura e inspeção. A proposição e a construção ainda acontecem através dos comandos slash no chat. Detalhes completos na [CLI reference](cli.md).

## Para onde ir em seguida

- [Explore First](explore.md): a maneira recomendada de começar quando você não tem certeza
- [Workflows](workflows.md): os padrões acima, com orientação de decisão sobre quando usar cada um
- [Commands](commands.md): todos os comandos slash em detalhes
- [Getting Started](getting-started.md): o walkthrough canônico da primeira mudança
- [Concepts](concepts.md): por que as peças se encaixam da maneira que se encaixam