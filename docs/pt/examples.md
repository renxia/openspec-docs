# Exemplos & Receitas

Mudanças reais, do início ao fim. Cada receita mostra os comandos que você digitaria e o que veria de volta, para que você possa comparar sua situação com um padrão e copiá-lo. Estas usam os comandos **principais** padrão (`propose`, `explore`, `apply`, `sync`, `archive`); onde o conjunto expandido ajuda, isso é observado.

Um lembrete antes de começar: comandos de barra como `/opsx:propose` vão no **chat do seu assistente de IA**, e comandos `openspec` vão no seu **terminal**. Se isso é novo, leia [How Commands Work](how-commands-work.md) primeiro. Nas transcrições abaixo, `You:` e `AI:` são o chat, e linhas começando com `$` são o terminal.

> **Ainda não tem certeza do que está construindo?** A maioria dessas receitas é mais eficaz se você começar com `/opsx:explore` para pensar sobre isso primeiro. A [Receita 3](#recipe-3-exploring-before-you-commit) mostra isso em ação, e o guia [Explore First](explore.md) apresenta o caso completo.

## Receita 1: Uma pequena funcionalidade, o caminho rápido

**Quando usar:** você sabe o que quer, e é um trabalho contido. Esta é a receita mais comum.

Tudo isso são três comandos. Propose, build, archive.

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — porquê e o quê
     ✓ specs/      — o novo requisito e seus cenários
     ✓ design.md   — abordagem técnica
     ✓ tasks.md    — lista de verificação de implementação
     Ready for implementation. Run /opsx:apply.
```

Agora leia o plano. Abra a proposta e a especificação delta. Este é o momento para o qual o OpenSpec foi construído: capturar uma suposição errada enquanto ainda é um parágrafo, não 400 linhas de código. Edite qualquer artefato diretamente se algo estiver errado, e depois continue.

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

É isso. O comportamento de logout agora faz parte de suas especificações, e a alteração foi arquivada com seu contexto completo.

## Receita 2: Uma correção de bug

**Quando usar:** algo está quebrado e você quer que a correção seja registrada como uma alteração deliberada de comportamento, não um commit misterioso.

Correções de bug funcionam exatamente como funcionalidades. A diferença está em como você enquadra a proposta: descreva o comportamento *correto*, não apenas "corrija o bug".

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

Como a correção resulta em um requisito `MODIFIED` com um cenário novo, a próxima pessoa (ou a próxima sessão de IA) vê não apenas que você corrigiu, mas o que "correto" significa. Depois `/opsx:apply` e `/opsx:archive` como de costume.

Dica: para uma correção, um bom cenário é o teste de regressão em prosa. "GIVEN a logged-out user, WHEN they submit valid credentials, THEN they land on the dashboard and are not redirected again." Escreva isso, e a implementação terá um alvo claro.

## Receita 3: Explorando antes de confirmar

**Quando usar:** você tem um problema mas ainda não um plano. Você não tem certeza do que construir, ou qual abordagem é a correta.

Comece com `/opsx:explore`. É um parceiro de pensamento sem estrutura e sem artefatos criados. Ele lê seu codebase e ajuda você a decidir.

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

A exploração clarifica seu pensamento *antes* de você gastar uma alteração nisso. Quando o insight cristalizar, proponha, e a IA carrega o contexto adiante.

## Receita 4: Lidando com duas alterações ao mesmo tempo

**Quando usar:** você está no meio de uma funcionalidade e uma correção urgente pula a fila.

As alterações são pastas independentes, então o trabalho paralelo não conflita. Inicie a correção, envie-a, e depois retorne à funcionalidade exatamente onde você parou.

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

Nomear a alteração em `/opsx:apply add-dark-mode` é como você aponta a IA para uma alteração específica quando mais de uma está ativa. Como as tarefas rastreiam a conclusão em `tasks.md`, a IA sabe exatamente onde você parou.

Quando várias alterações são feitas de uma vez, o `/opsx:bulk-archive` expandido arquiva-as juntas e resolve conflitos de especificação verificando o que está realmente implementado. Veja [Workflows](workflows.md#parallel-changes).

## Receita 5: Uma refatoração sem mudança de comportamento

**Quando usar:** você está reestruturando código, e o comportamento visível externamente deve permanecer idêntico.

Este é o caso interessante, porque uma refatoração pura não tem *nada a adicionar às suas especificações*. O contrato de comportamento não muda; apenas a implementação muda. Então o trabalho reside no design e nas tarefas, e o delta de especificação está vazio ou ausente.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

Declare o delta vazio explicitamente definindo `skip_specs: true` no `.openspec.yaml` da alteração:

```yaml
schema: spec-driven
skip_specs: true
```

Sem o marcador, `openspec validate` rejeita uma alteração com zero deltas (para que uma fase de especificações esquecida ainda seja detectada); com ele, a validação passa e `openspec status` mostra o estágio de especificações como explicitamente pulado em vez de pendente. Se a refatoração acabar mudando o comportamento afinal, remova `skip_specs` de `.openspec.yaml` e escreva as especificações delta — o validate trata o marcador mais os arquivos de especificação como um conflito, para que o marcador obsoleto não permaneça silenciosamente.

Arquivar uma alteração marcada não precisa de flags extras (não há deltas para mesclar). Independentemente, a flag `--skip-specs` diz ao comando do terminal para pular a etapa de especificação explicitamente:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

A mesma flag é útil para ferramentas, CI e alterações apenas de documentação. O princípio: especificações descrevem comportamento, então se o comportamento não mudou, a especificação também não deveria. Veja [Concepts](concepts.md#what-a-spec-is-and-is-not).

## Receita 6: Controle passo a passo (comandos expandidos)

**Quando usar:** uma alteração complexa ou arriscada onde você quer revisar cada artefato antes de prosseguir.

O `/opsx:propose` core rascunha tudo de uma vez. Quando você prefere ir passo a passo, ative os comandos expandidos:

```bash
$ openspec config profile      # selecione os fluxos de trabalho expandidos
$ openspec update              # aplique-os a este projeto
```

Agora você pode criar a estrutura e construir incrementalmente:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

Revise cada artefato conforme ele é criado, edite livremente e continue quando estiver satisfeito. Quando quiser que o restante seja rascunhado de uma vez, `/opsx:ff` avança rapidamente pelos artefatos de planejamento restantes. Antes de arquivar, `/opsx:verify` verifica se a implementação realmente corresponde às especificações. Veja [Workflows](workflows.md#opsxff-vs-opsxcontinue).

## Receita 7: Aprendendo todo o ciclo na prática

**Quando usar:** você instalou o OpenSpec e quer *sentir* o fluxo de trabalho no seu próprio código, não em um exemplo de brinquedo.

Ative os comandos expandidos (veja Receita 6), então:

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` encontra uma melhoria real (pequena), cria uma alteração para ela, implementa-a e arquiva-a, narrando cada passo. Leva de 15 a 30 minutos e deixa você com uma alteração real que você pode manter ou descartar. É a maneira mais suave de aprender. Veja [Commands](commands.md#opsxonboard).

## Verificando seu trabalho no terminal

A qualquer momento, do seu terminal, você pode inspecionar o estado das coisas:

```bash
$ openspec list                      # alterações ativas
$ openspec show add-dark-mode        # uma alteração em detalhe
$ openspec validate add-dark-mode    # verificar estrutura
$ openspec view                      # painel interativo
```

Estas são ferramentas de leitura e inspeção. A proposta e a construção ainda acontecem através de comandos de barra no chat. Detalhes completos na [referência CLI](cli.md).

## Para onde ir a seguir

- [Explore First](explore.md): a maneira recomendada de começar quando você não tem certeza
- [Workflows](workflows.md): os padrões acima, com orientação de decisão sobre quando usar cada um
- [Commands](commands.md): todos os comandos de barra em detalhe
- [Getting Started](getting-started.md): o passeio canônico da primeira alteração
- [Concepts](concepts.md): por que as peças se encaixam da maneira que o fazem