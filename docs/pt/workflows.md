# Fluxos de Trabalho

Este guia aborda padrões comuns de fluxos de trabalho para o OpenSpec e quando usar cada um. Para a configuração básica, consulte [Primeiros Passos](getting-started.md). Para referência de comandos, consulte [Comandos](commands.md).

## Filosofia: Ações, Não Fases

Os fluxos de trabalho tradicionais forçam você a seguir fases: planejamento, depois implementação, e então conclusão. Mas o trabalho real não se encaixa perfeitamente em caixas.

O OPSX adota uma abordagem diferente:

```text
Tradicional (travado em fases):

  PLANEJAMENTO ────────► IMPLEMENTAÇÃO ────────► CONCLUSÃO
      │                         │
      │   "Não pode voltar"     │
      └─────────────────────────┘

OPSX (ações fluidas):

  proposta ──► especificações ──► design ──► tarefas ──► implementar
```

**Princípios-chave:**

- **Ações, não fases** - Comandos são coisas que você pode fazer, não estágios nos quais você fica preso
- **Dependências são habilitadoras** - Elas mostram o que é possível, não o que é obrigatório a seguir

> **Personalização:** Os fluxos de trabalho do OPSX são impulsionados por esquemas que definem sequências de artefatos. Consulte [Personalização](customization.md) para detalhes sobre como criar esquemas personalizados.

## Dois Modos

### Caminho Rápido Padrão (perfil `core`)

Novas instalações são configuradas por padrão com o perfil `core`, que fornece:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:archive`

Fluxo típico:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:archive
```

### Fluxo de Trabalho Expandido/Completo (seleção personalizada)

Se você deseja comandos explícitos de estruturação e construção (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), habilite-os com:

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
Você: /opsx:new add-logout-button

AI:  Criado openspec/changes/add-logout-button/
     Pronto para criar: proposal

Você: /opsx:ff

AI:  Criando todos os artefatos de planejamento...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Pronto para implementação!

Você: /opsx:apply

AI:  Processando tarefas...
     ✓ Botão de logout adicionado ao cabeçalho
     ✓ Limpeza de sessão implementada
     ✓ Diálogo de confirmação adicionado
     Todas as tarefas concluídas!

Você: /opsx:archive

AI:  ✓ Specs mescladas
     ✓ Alteração arquivada
```

**Ideal para:** Funcionalidades pequenas a médias, correções de bugs, alterações diretas.

### Exploratório

Quando os requisitos não estão claros ou você precisa investigar primeiro:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Exemplo de conversa:**

```text
Você: /opsx:explore

AI:  O que você gostaria de explorar?

Você: Quero melhorar o desempenho de carregamento da página, mas não tenho certeza
     onde estão os gargalos.

AI:  Vou ajudar a investigar...
     [Analisa tamanhos de pacotes, identifica consultas lentas, revisa
     padrões de renderização de componentes]

     Encontrei três principais gargalos:
     1. Imagens grandes não otimizadas
     2. Busca de dados síncrona em ProductList
     3. Re-renderizações devido a mudanças de contexto

     Qual você gostaria de resolver primeiro?

Você: Vamos resolver o problema da busca de dados.

Você: /opsx:new optimize-product-list-fetching

AI:  Alteração criada. Pronto para criar: proposal

Você: /opsx:continue

AI:  Criando proposta baseada em nossa exploração...
     [Escreve a proposta incorporando os insights da investigação]

     Pronto para criar: specs, design
     O que você gostaria de fazer a seguir?

Você: /opsx:continue

AI:  Criando specs...
```

**Ideal para:** Otimização de desempenho, depuração, decisões arquiteturais, requisitos não claros.

### Alterações Paralelas

Trabalhe em múltiplas alterações ao mesmo tempo:

```text
Alteração A: /opsx:new ──► /opsx:ff ──► /opsx:apply (em andamento)
                                         │
                                    troca de contexto
                                         │
Alteração B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Exemplo de conversa:**

```text
Você: Estou trabalhando em add-dark-mode, mas fui chamado para corrigir um bug

Você: /opsx:new fix-login-redirect

AI:  Criado openspec/changes/fix-login-redirect/

Você: /opsx:ff

AI:  ✓ Artefatos de planejamento criados

Você: /opsx:apply

AI:  Trabalhando em fix-login-redirect...
     [Implementa a correção]
     Todas as tarefas concluídas!

Você: /opsx:archive

AI:  ✓ fix-login-redirect arquivado

Você: Vamos voltar para o modo escuro

Você: /opsx:apply add-dark-mode

AI:  Retomando add-dark-mode...
     Continuando na tarefa 2.3: Atualizar Cabeçalho...
```

**Ideal para:** Fluxos de trabalho paralelos, interrupções urgentes, colaboração em equipe.

Quando você tiver múltiplas alterações concluídas, use `/opsx:bulk-archive`:

```text
Você: /opsx:bulk-archive

AI:  Encontradas 3 alterações concluídas:
     - add-dark-mode (todas as tarefas feitas)
     - fix-login-redirect (todas as tarefas feitas)
     - update-footer (todas as tarefas feitas)

     Verificando conflitos de specs...
     ⚠ add-dark-mode e update-footer ambas modificam specs/ui/

     Inspecionando o codebase para resolver...
     Ambas as alterações estão implementadas. Serão aplicadas em ordem cronológica.

     Arquivar todas as 3 alterações?

Você: Sim

AI:  ✓ add-dark-mode arquivado
     ✓ fix-login-redirect arquivado
     ✓ update-footer arquivado
     Specs mescladas na ordem: add-dark-mode → update-footer
```

O arquivamento em lote detecta quando múltiplas alterações modificam as mesmas specs e resolve conflitos verificando o que realmente está implementado.

### Concluindo uma Alteração

O fluxo de conclusão recomendado:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              valida              solicita sincronização
              implementação       se necessário
```

#### Verificar: Cheque Seu Trabalho

`/opsx:verify` valida a implementação em relação aos seus artefatos em três dimensões:

```text
Você: /opsx:verify

AI:  Verificando add-auth...

     COMPLETUDE
     ✓ Todas as 12 tarefas em tasks.md estão marcadas
     ✓ Todos os requisitos em specs possuem código correspondente
     ⚠ Cenário "Tempo limite da sessão após inatividade" não testado

     CORRETUDE
     ✓ Implementação corresponde à intenção da spec
     ✓ Casos extremos dos cenários são tratados
     ✓ Estados de erro correspondem às definições da spec

     COERÊNCIA
     ✓ Decisões de design refletidas na estrutura do código
     ✓ Convenções de nomenclatura consistentes com design.md
     ⚠ Design menciona "event-driven" mas a implementação usa polling

     RESUMO
     ─────────────────────────────
     Problemas críticos: 0
     Avisos: 2
     Pronto para arquivar: Sim (com avisos)

     Recomendações:
     1. Adicionar teste para o cenário de tempo limite da sessão
     2. Considerar refatoração para event-driven conforme o design, ou atualizar design.md
```

**O que o verify verifica:**

| Dimensão | O que valida |
|-----------|------------------|
| Completude | Todas as tarefas feitas, todos os requisitos implementados, cenários cobertos |
| Corretude | Implementação corresponde à intenção da spec, casos extremos tratados |
| Coerência | Decisões de design refletidas no código, padrões consistentes |

O verify não bloqueará o arquivamento, mas apresentará problemas que você pode querer resolver primeiro.

#### Arquivar: Finalizar a Alteração

`/opsx:archive` conclui a alteração e a move para o arquivo:

```text
Você: /opsx:archive

AI:  Arquivando add-auth...

     Status dos artefatos:
     ✓ proposal.md existe
     ✓ specs/ existe
     ✓ design.md existe
     ✓ tasks.md existe (12/12 tarefas completas)

     Specs delta: Ainda não sincronizadas com o principal
     → Gostaria de sincronizar agora?

Você: Sim

AI:  ✓ Specs sincronizadas para openspec/specs/auth/spec.md
     ✓ Movido para openspec/changes/archive/2025-01-24-add-auth/

     Alteração arquivada com sucesso.
```

O arquivamento solicitará sincronização se as specs não estiverem sincronizadas. Ele não bloqueará por tarefas incompletas, mas emitirá um aviso.

## Quando Usar Cada Comando

### `/opsx:ff` vs `/opsx:continue`

| Situação | Use |
|-----------|-----|
| Requisitos claros, pronto para construir | `/opsx:ff` |
| Explorando, quer revisar cada etapa | `/opsx:continue` |
| Quer iterar na proposta antes das specs | `/opsx:continue` |
| Pressão de tempo, precisa se mover rápido | `/opsx:ff` |
| Alteração complexa, quer controle | `/opsx:continue` |

**Regra geral:** Se você pode descrever o escopo completo de antemão, use `/opsx:ff`. Se está descobrindo à medida que avança, use `/opsx:continue`.

### Quando Atualizar vs Começar do Zero

Uma pergunta comum: quando é aceitável atualizar uma alteração existente e quando você deve iniciar uma nova?

**Atualize a alteração existente quando:**

- Mesma intenção, execução refinada
- Escopo se estreita (MVP primeiro, o resto depois)
- Correções baseadas em aprendizado (codebase não é o que você esperava)
- Ajustes de design baseados em descobertas da implementação

**Inicie uma nova alteração quando:**

- A intenção mudou fundamentalmente
- O escopo explodiu para um trabalho completamente diferente
- A alteração original pode ser marcada como "concluída" de forma independente
- Patches causariam mais confusão do que clareza

```text
                     ┌─────────────────────────────────────┐
                     │     É o mesmo trabalho?             │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Mesma intenção?    >50% de sobreposição?  A original pode
          Mesmo problema?    Mesmo escopo?          ser "concluída" sem
                 │                  │                essas alterações?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      SIM               NÃO SIM           NÃO NÃO              SIM
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    ATUALIZAR        NOVA ATUALIZAR    NOVA ATUALIZAR        NOVA
```

**Exemplo: "Adicionar modo escuro"**

- "Preciso também suportar temas personalizados" → Nova alteração (escopo explodiu)
- "A detecção de preferência do sistema é mais difícil do que esperado" → Atualizar (mesma intenção)
- "Vamos lançar o toggle primeiro, adicionar preferências depois" → Atualizar e arquivar, depois nova alteração

## Melhores Práticas

### Mantenha as Alterações Focadas

Uma unidade lógica de trabalho por alteração. Se você está fazendo "adicionar funcionalidade X e também refatorar Y", considere duas alterações separadas.

**Por que isso importa:**
- Mais fácil de revisar e entender
- Histórico de arquivo mais limpo
- Pode ser lançado independentemente
- Rollback mais simples se necessário

### Use `/opsx:explore` para Requisitos Não Claros

Antes de se comprometer com uma alteração, explore o espaço do problema:

```text
Você: /opsx:explore

AI:  O que você gostaria de explorar?

Você: Como devemos tratar o rate limiting para nossa API?

AI:  Vou investigar sua configuração atual e as opções...
     [Pesquisa o codebase, considera padrões]

     Vejo três abordagens que poderíamos tomar:
     1. Baseada em middleware (simples, por endpoint)
     2. Suportada por Redis (escalável, estado compartilhado)
     3. Balde de tokens por usuário (justa, complexa)

     Seu stack atual sugere #1 ou #2. Qual é a sua escala?
```

A exploração esclarece o pensamento antes de você criar artefatos.

### Verifique Antes de Arquivar

Use `/opsx:verify` para checar se a implementação corresponde aos artefatos:

```text
Você: /opsx:verify

AI:  Verificando add-dark-mode...

     ✓ Todas as tarefas em tasks.md estão marcadas
     ✓ Requisitos em specs possuem código correspondente
     ✓ Decisões de design são refletidas na implementação

     Pronto para arquivar!
```

Captura inconsistências antes de você fechar a alteração.

### Nomeie as Alterações Claramente

Bons nomes tornam `openspec list` útil:

```text
Bom:                          Evite:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Referência Rápida de Comandos

Para detalhes completos dos comandos e opções, consulte [Comandos](commands.md).

| Comando | Propósito | Quando Usar |
|---------|-----------|-------------|
| `/opsx:propose` | Criar mudança + artefatos de planejamento | Caminho padrão rápido (perfil `core`) |
| `/opsx:explore` | Analisar ideias | Requisitos não claros, investigação |
| `/opsx:new` | Iniciar um esqueleto de mudança | Modo expandido, controle explícito de artefatos |
| `/opsx:continue` | Criar próximo artefato | Modo expandido, criação de artefatos passo a passo |
| `/opsx:ff` | Criar todos os artefatos de planejamento | Modo expandido, escopo claro |
| `/opsx:apply` | Implementar tarefas | Pronto para escrever código |
| `/opsx:verify` | Validar implementação | Modo expandido, antes de arquivar |
| `/opsx:sync` | Mesclar especificações delta | Modo expandido, opcional |
| `/opsx:archive` | Concluir a mudança | Todo o trabalho finalizado |
| `/opsx:bulk-archive` | Arquivar múltiplas mudanças | Modo expandido, trabalho paralelo |

## Próximos Passos

- [Comandos](commands.md) - Referência completa de comandos com opções
- [Conceitos](concepts.md) - Aprofundamento em especificações, artefatos e esquemas
- [Personalização](customization.md) - Criar fluxos de trabalho personalizados