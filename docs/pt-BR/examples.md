# Exemplos & Receitas

Mudanças reais, do início ao fim. Cada receita mostra os comandos que você digitaria e o que veria de volta, para que você possa comparar sua situação a um padrão e copiá-lo. Estas usam os comandos **core** padrão (`propose`, `explore`, `apply`, `sync`, `archive`); onde o conjunto expandido ajuda, isso é observado.

Um lembrete antes de começar: comandos de barra como `/opsx:propose` vão no **chat do seu assistente de IA**, e comandos `openspec` vão no seu **terminal**. Se isso for novo, leia [Como os Comandos Funcionam](how-commands-work.md) primeiro. Nas transcrições abaixo, `You:` e `AI:` são o chat, e linhas começando com `$` são o terminal.

> **Ainda não tem certeza do que está construindo?** A maioria dessas receitas fica mais precisa se você começar com `/opsx:explore` para pensar sobre isso primeiro. A [Receita 3](#recipe-3-exploring-before-you-commit) mostra isso em ação, e o guia [Explore Primeiro](explore.md) apresenta o caso completo.

## Receita 1: Uma funcionalidade pequena, o caminho rápido

**Quando usá-la:** você sabe o que quer, e é um trabalho contido. Esta é a receita mais comum.

A coisa toda são três comandos. Propor, construir, arquivar.

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

Agora leia o plano. Abra a proposta e a spec delta. Este é o momento para o qual o OpenSpec foi construído: pegar uma suposição errada enquanto ainda é um parágrafo, não 400 linhas de código. Edite qualquer artefato diretamente se algo estiver errado, e continue.

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

É isso. O comportamento de logout agora faz parte das suas specs, e a mudança foi arquivada com seu contexto completo.

## Receita 2: Uma correção de bug

**Quando usá-la:** algo está quebrado e você quer que a correção seja registrada como uma mudança deliberada no comportamento, não um commit misterioso.

Correções de bug funcionam exatamente como funcionalidades. A diferença está em como você estrutura a proposta: descreva o comportamento *correto*, não apenas "corrigir o bug."

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

Como a correção chega como um requisito `MODIFIED` com um novo cenário, a próxima pessoa (ou a próxima sessão de IA) vê não apenas que você corrigiu, mas o que "correto" significa. Então `/opsx:apply` e `/opsx:archive` como de costume.

Dica: para uma correção, um bom cenário é o teste de regressão em prosa. "DADO um usuário deslogado, QUANDO ele envia credenciais válidas, ENTÃO ele cai no painel e não é redirecionado novamente." Escreva isso, e a implementação tem um alvo claro.

## Receita 3: Explorando antes de se comprometer

**Quando usá-la:** você tem um problema mas ainda não um plano. Você não tem certeza do que construir, ou qual abordagem é a correta.

Comece com `/opsx:explore`. É um parceiro de pensamento sem estrutura e sem artefatos criados. Ele lê sua base de código e ajuda você a decidir.

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

A exploração esclarece seu pensamento *antes* de gastar uma mudança nisso. Quando a percepção se cristaliza, proponha, e a IA leva o contexto adiante.

## Receita 4: Lidando com duas mudanças ao mesmo tempo

**Quando usá-la:** você está no meio de uma funcionalidade e uma correção urgente pula a fila.

Mudanças são pastas independentes, então trabalho paralelo não conflita. Comece a correção, envie-a, então retorne à funcionalidade exatamente de onde você parou.

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

Nomear a mudança em `/opsx:apply add-dark-mode` é como você aponta a IA para uma mudança específica quando mais de uma está ativa. Como as tarefas rastreiam a conclusão em `tasks.md`, a IA sabe exatamente onde você parou.

Quando várias mudanças são feitas ao mesmo tempo, o `/opsx:bulk-archive` expandido as arquiva juntas e resolve conflitos de spec verificando o que está realmente implementado. Veja [Workflows](workflows.md#parallel-changes).

## Receita 5: Uma refatoração sem mudança de comportamento

**Quando usá-la:** você está reestruturando código, e o comportamento visível externamente deve permanecer idêntico.

Este é o caso interessante, porque uma refatoração pura não tem *nada para adicionar às suas specs*. O contrato de comportamento não muda; apenas a implementação muda. Então o trabalho vive no design e nas tarefas, e o delta da spec está vazio ou ausente.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

Declare o delta vazio explicitamente definindo `skip_specs: true` no `.openspec.yaml` da mudança:

```yaml
schema: spec-driven
skip_specs: true
```

Sem o marcador, `openspec validate` rejeita uma mudança com zero deltas (então uma fase de specs esquecida ainda é pega); com ele, a validação passa e `openspec status` mostra o estágio de specs como explicitamente pulado em vez de pendente. Se a refatoração acabar mudando o comportamento afinal, remova `skip_specs` do `.openspec.yaml` e escreva as specs delta — validate trata o marcador mais os arquivos de spec como um conflito, então o marcador obsoleto não pode permanecer silenciosamente.

Arquivar uma mudança marcada não precisa de flags extras (não há deltas para mesclar). Independentemente, a flag `--skip-specs` diz ao comando de terminal para pular a etapa de spec explicitamente:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

A mesma flag é útil para ferramentas, CI e mudanças apenas de documentação. O princípio: specs descrevem comportamento, então se o comportamento não mudou, a spec também não deveria. Veja [Conceitos](concepts.md#what-a-spec-is-and-is-not).

## Receita 6: Controle passo a passo (comandos expandidos)

**Quando usá-la:** uma mudança complexa ou arriscada onde você quer revisar cada artefato antes de avançar.

O `/opsx:propose` core rascunha tudo de uma vez. Quando você preferir ir passo a passo, ative os comandos expandidos:

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

Agora você pode scaffoldar e construir incrementalmente:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

Revise cada artefato conforme ele chega, edite livremente, e continue quando estiver satisfeito. Quando você quiser o resto rascunhado de uma vez, `/opsx:ff` avança rapidamente pelos artefatos de planejamento restantes. Antes de arquivar, `/opsx:verify` verifica se a implementação realmente corresponde às specs. Veja [Workflows](workflows.md#opsxff-vs-opsxcontinue).

## Receita 7: Aprendendo o loop completo na prática

**Quando usá-la:** você instalou o OpenSpec e quer *sentir* o fluxo de trabalho no seu próprio código, não em um exemplo de brinquedo.

Ative os comandos expandidos (veja Receita 6), então:

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` encontra uma melhoria real (pequena), cria uma mudança para ela, implementa-a, e a arquiva, narrando cada passo. Leva de 15 a 30 minutos e te deixa com uma mudança real que você pode manter ou descartar. É a maneira mais gentil de aprender. Veja [Comandos](commands.md#opsxonboard).

## Verificando seu trabalho pelo terminal

A qualquer momento, do seu terminal, você pode inspecionar o estado das coisas:

```bash
$ openspec list                      # active changes
$ openspec show add-dark-mode        # one change in detail
$ openspec validate add-dark-mode    # check structure
$ openspec view                      # interactive dashboard
```

Estas são ferramentas de leitura e inspeção. A proposição e construção ainda acontecem através de comandos de barra no chat. Detalhes completos na [referência da CLI](cli.md).

## Para onde ir a seguir

- [Explore Primeiro](explore.md): a maneira recomendada de começar quando você não tem certeza
- [Workflows](workflows.md): os padrões acima, com orientação de decisão sobre quando usar cada um
- [Comandos](commands.md): cada comando de barra em detalhes
- [Primeiros Passos](getting-started.md): o passo a passo canônico da primeira mudança
- [Conceitos](concepts.md): por que as peças se encaixam da maneira que se encaixam