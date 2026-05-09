# Fluxos de Trabalho

Este guia aborda padrões comuns de fluxos de trabalho para o OpenSpec e quando usar cada um deles. Para a configuração básica, consulte [Primeiros Passos](getting-started.md). Para referência de comandos, consulte [Comandos](commands.md).

## Filosofia: Ações, Não Fases

Fluxos de trabalho tradicionais forçam você a passar por fases: planejamento, depois implementação, depois concluído. Mas o trabalho real não se encaixa perfeitamente em caixas.

O OPSX adota uma abordagem diferente:

```text
Tradicional (travado em fases):

  PLANEJAMENTO ────────► IMPLEMENTANDO ────────► CONCLUÍDO
      │                    │
      │   "Não pode voltar" │
      └────────────────────┘

OPSX (ações fluidas):

  proposta ──► especificações ──► design ──► tarefas ──► implementar
```

**Princípios-chave:**

- **Ações, não fases** - Comandos são coisas que você pode fazer, não estágios nos quais você fica preso
- **Dependências são facilitadoras** - Elas mostram o que é possível, não o que é necessário a seguir

> **Personalização:** Os fluxos de trabalho do OPSX são conduzidos por esquemas que definem sequências de artefatos. Consulte [Personalização](customization.md) para detalhes sobre como criar esquemas personalizados.

## Dois Modos

### Caminho Rápido Padrão (perfil `core`)

Novas instalações usam `core` por padrão, que fornece:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Fluxo típico:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

### Fluxo de Trabalho Expandido/Completo (seleção personalizada)

Se você deseja comandos explícitos de scaffold e build (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), habilite-os com:

```bash
openspec config profile
openspec update
```

## Padrões de Fluxo de Trabalho (Modo Expandido)

### Funcionalidade Rápida

Quando você sabe o que quer construir e só precisa executar:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Exemplo de conversa:**

```text
You: /opsx:new add-logout-button

AI:  Created openspec/changes/add-logout-button/
     Ready to create: proposal

You: /opsx:ff

AI:  Creating all planning artifacts...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Ready for implementation!

You: /opsx:apply

AI:  Working through tasks...
     ✓ Added logout button to header
     ✓ Implemented session clearing
     ✓ Added confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  ✓ Merged specs
     ✓ Archived change
```

**Ideal para:** Funcionalidades pequenas a médias, correções de bugs, alterações simples.

### Exploratório

Quando os requisitos não estão claros ou você precisa investigar primeiro:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Exemplo de conversa:**

```text
You: /opsx:explore

AI:  What would you like to explore?

You: I want to improve page load performance but I'm not sure
     where the bottlenecks are.

AI:  Let me help investigate...
     [Analyzes bundle sizes, identifies slow queries, reviews
     component render patterns]

     I found three main bottlenecks:
     1. Large unoptimized images
     2. Synchronous data fetching in ProductList
     3. Re-renders from context changes

     Which would you like to address first?

You: Let's tackle the data fetching issue.

You: /opsx:new optimize-product-list-fetching

AI:  Created change. Ready to create: proposal

You: /opsx:continue

AI:  Creating proposal based on our exploration...
     [Writes proposal incorporating investigation insights]

     Ready to create: specs, design
     Which would you like next?

You: /opsx:continue

AI:  Creating specs...
```

**Ideal para:** Otimização de performance, depuração, decisões arquiteturais, requisitos pouco claros.

### Alterações Paralelas

Trabalhe em múltiplas alterações simultaneamente:

```text
Alteração A: /opsx:new ──► /opsx:ff ──► /opsx:apply (em andamento)
                                              │
                                        troca de contexto
                                              │
Alteração B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Exemplo de conversa:**

```text
You: I'm working on add-dark-mode but got pulled into a bug fix

You: /opsx:new fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/

You: /opsx:ff

AI:  ✓ Created planning artifacts

You: /opsx:apply

AI:  Working on fix-login-redirect...
     [Implements the fix]
     All tasks complete!

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect

You: Let's get back to dark mode

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode...
     Picking up at task 2.3: Update Header...
```

**Ideal para:** Fluxos de trabalho paralelos, interrupções urgentes, colaboração em equipe.

Quando você tiver múltiplas alterações concluídas, use `/opsx:bulk-archive`:

```text
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (all tasks done)
     - fix-login-redirect (all tasks done)
     - update-footer (all tasks done)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will apply in chronological order.

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-redirect
     ✓ Archived update-footer
     Specs merged in order: add-dark-mode → update-footer
```

O arquivamento em lote detecta quando múltiplas alterações afetam as mesmas especificações e resolve conflitos verificando o que foi realmente implementado.

### Concluindo uma Alteração

O fluxo de conclusão recomendado:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              valida            solicita sincronização
              implementação     se necessário
```

#### Verificar: Confira Seu Trabalho

`/opsx:verify` valida a implementação em relação aos seus artefatos em três dimensões:

```text
You: /opsx:verify

AI:  Verifying add-auth...

     COMPLETENESS
     ✓ All 12 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Session timeout after inactivity" not tested

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "event-driven" but implementation uses polling

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for session timeout scenario
     2. Consider refactoring to event-driven as designed, or update design.md
```

**O que a verificação confere:**

| Dimensão | O que valida |
|-----------|------------------|
| Completude | Todas as tarefas concluídas, todos os requisitos implementados, cenários cobertos |
| Correção | A implementação corresponde à intenção da especificação, casos extremos tratados |
| Coerência | Decisões de design refletidas no código, padrões consistentes |

A verificação não bloqueará o arquivamento, mas identifica problemas que você pode querer resolver primeiro.

#### Arquivar: Finalizar a Alteração

`/opsx:archive` conclui a alteração e a move para o arquivo:

```text
You: /opsx:archive

AI:  Archiving add-auth...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (12/12 tasks complete)

     Delta specs: Not yet synced to main
     → Would you like to sync now?

You: Yes

AI:  ✓ Synced specs to openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-auth/

     Change archived successfully.
```

O arquivamento solicitará confirmação se as especificações não estiverem sincronizadas. Não bloqueará por tarefas incompletas, mas emitirá um aviso.

## Quando Usar Cada Um

### `/opsx:ff` vs `/opsx:continue`

| Situação | Usar |
|-----------|-----|
| Requisitos claros, pronto para construir | `/opsx:ff` |
| Explorando, deseja revisar cada etapa | `/opsx:continue` |
| Deseja iterar na proposta antes das especificações | `/opsx:continue` |
| Pressão de tempo, precisa agilizar | `/opsx:ff` |
| Alteração complexa, deseja controle | `/opsx:continue` |

**Regra geral:** Se você consegue descrever o escopo completo de antemão, use `/opsx:ff`. Se está descobrindo ao longo do caminho, use `/opsx:continue`.

### Quando Atualizar vs Começar do Zero

Uma pergunta comum: quando é aceitável atualizar uma alteração existente e quando você deve começar uma nova?

**Atualize a alteração existente quando:**

- Mesma intenção, execução refinada
- Escopo reduzido (MVP primeiro, resto depois)
- Correções baseadas em aprendizado (a base de código não era o que você esperava)
- Ajustes de design com base em descobertas durante a implementação

**Comece uma nova alteração quando:**

- A intenção mudou fundamentalmente
- O escopo explodiu para um trabalho completamente diferente
- A alteração original pode ser marcada como "concluída" de forma independente
- Correções confundiriam mais do que esclareceriam

```text
                     ┌─────────────────────────────────────┐
                     │     Is this the same work?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Same intent?      >50% overlap?      Can original
          Same problem?     Same scope?        be "done" without
                 │                  │          these changes?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      YES               NO YES           NO  NO              YES
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    UPDATE            NEW  UPDATE       NEW  UPDATE          NEW
```

**Exemplo: "Adicionar modo escuro"**

- "Precisamos também suportar temas personalizados" → Nova alteração (escopo explodiu)
- "A detecção de preferências do sistema é mais difícil do que esperávamos" → Atualizar (mesma intenção)
- "Vamos lançar o toggle primeiro, adicionar preferências depois" → Atualizar, depois arquivar, depois nova alteração

## Boas Práticas

### Mantenha Alterações Focadas

Uma unidade lógica de trabalho por alteração. Se você está fazendo "adicionar funcionalidade X e também refatorar Y", considere duas alterações separadas.

**Por que isso importa:**
- Mais fácil de revisar e entender
- Histórico de arquivamento mais limpo
- Pode ser entregue independentemente
- Rollback mais simples, se necessário

### Use `/opsx:explore` para Requisitos Pouco Claros

Antes de se comprometer com uma alteração, explore o espaço do problema:

```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle rate limiting for our API?

AI:  Let me investigate your current setup and options...
     [Researches codebase, considers patterns]

     I see three approaches we could take:
     1. Middleware-based (simple, per-endpoint)
     2. Redis-backed (scalable, shared state)
     3. Token bucket per user (fair, complex)

     Your current stack suggests #1 or #2. What's your scale?
```

A exploração esclarece o pensamento antes de você criar os artefatos.

### Verifique Antes de Arquivar

Use `/opsx:verify` para conferir se a implementação corresponde aos artefatos:

```text
You: /opsx:verify

AI:  Verifying add-dark-mode...

     ✓ All tasks in tasks.md are checked
     ✓ Requirements in specs have corresponding code
     ✓ Design decisions are reflected in implementation

     Ready to archive!
```

Captura inconsistências antes de você encerrar a alteração.

### Nomeie Alterações de Forma Clara

Nomes bons tornam o `openspec list` útil:

```text
Bom:                           Evite:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Referência Rápida de Comandos

Para detalhes completos dos comandos e opções, consulte [Comandos](commands.md).

| Comando | Finalidade | Quando Usar |
|---------|------------|-------------|
| `/opsx:propose` | Criar mudança + artefatos de planejamento | Caminho padrão rápido (perfil `core`) |
| `/opsx:explore` | Analisar ideias | Requisitos pouco claros, investigação |
| `/opsx:new` | Iniciar um esqueleto de mudança | Modo expandido, controle explícito de artefatos |
| `/opsx:continue` | Criar o próximo artefato | Modo expandido, criação de artefatos passo a passo |
| `/opsx:ff` | Criar todos os artefatos de planejamento | Modo expandido, escopo claro |
| `/opsx:apply` | Implementar tarefas | Pronto para escrever código |
| `/opsx:verify` | Validar implementação | Modo expandido, antes de arquivar |
| `/opsx:sync` | Mesclar especificações delta | Modo expandido, opcional |
| `/opsx:archive` | Concluir a mudança | Todo o trabalho finalizado |
| `/opsx:bulk-archive` | Arquivar múltiplas mudanças | Modo expandido, trabalho paralelo |

## Próximos Passos

- [Comandos](commands.md) - Referência completa de comandos com opções
- [Conceitos](concepts.md) - Mergulho profundo em especificações, artefatos e esquemas
- [Personalização](customization.md) - Criar fluxos de trabalho personalizados