# Fluxos de Trabalho

Este guia aborda padrões comuns de fluxos de trabalho para o OpenSpec e quando usar cada um. Para a configuração básica, consulte [Primeiros Passos](getting-started.md). Para referência de comandos, consulte [Comandos](commands.md).

## Filosofia: Ações, Não Fases

Fluxos de trabalho tradicionais forçam você a passar por fases: planejamento, depois implementação, depois concluído. Mas o trabalho real não se encaixa perfeitamente em caixas.

O OPSX adota uma abordagem diferente:

```text
Tradicional (bloqueado por fases):

  PLANEJAMENTO ────────► IMPLEMENTANDO ────────► CONCLUÍDO
      │                    │
      │   "Não pode voltar" │
      └────────────────────┘

OPSX (ações fluidas):

  proposta ──► especificações ──► design ──► tarefas ──► implementar
```

**Princípios-chave:**

- **Ações, não fases** - Comandos são coisas que você pode fazer, não estágios nos quais você está preso
- **Dependências são facilitadoras** - Elas mostram o que é possível, não o que é obrigatório a seguir

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

Se você deseja comandos explícitos de scaffold e build (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), ative-os com:

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

IA:  Criado openspec/changes/add-logout-button/
     Pronto para criar: proposal

Você: /opsx:ff

IA:  Criando todos os artefatos de planejamento...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Pronto para implementação!

Você: /opsx:apply

IA:  Trabalhando nas tarefas...
     ✓ Adicionado botão de logout ao cabeçalho
     ✓ Implementada limpeza de sessão
     ✓ Adicionado diálogo de confirmação
     Todas as tarefas concluídas!

Você: /opsx:archive

IA:  ✓ Especificações mescladas
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

IA:  O que você gostaria de explorar?

Você: Quero melhorar o desempenho de carregamento da página, mas não tenho certeza
     onde estão os gargalos.

IA:  Deixe-me ajudar a investigar...
     [Analisa tamanhos de pacotes, identifica consultas lentas, revisa
     padrões de renderização de componentes]

     Encontrei três gargalos principais:
     1. Imagens grandes não otimizadas
     2. Busca síncrona de dados em ProductList
     3. Re-renderizações devido a mudanças de contexto

     Qual você gostaria de abordar primeiro?

Você: Vamos resolver o problema da busca de dados.

Você: /opsx:new optimize-product-list-fetching

IA:  Alteração criada. Pronto para criar: proposal

Você: /opsx:continue

IA:  Criando proposta com base em nossa exploração...
     [Escreve proposta incorporando insights da investigação]

     Pronto para criar: specs, design
     Qual você gostaria a seguir?

Você: /opsx:continue

IA:  Criando especificações...
```

**Ideal para:** Otimização de desempenho, depuração, decisões arquitetônicas, requisitos pouco claros.

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
Você: Estou trabalhando em add-dark-mode, mas fui interrompido para uma correção de bug

Você: /opsx:new fix-login-redirect

IA:  Criado openspec/changes/fix-login-redirect/

Você: /opsx:ff

IA:  ✓ Artefatos de planejamento criados

Você: /opsx:apply

IA:  Trabalhando em fix-login-redirect...
     [Implementa a correção]
     Todas as tarefas concluídas!

Você: /opsx:archive

IA:  ✓ fix-login-redirect arquivado

Você: Vamos voltar ao modo escuro

Você: /opsx:apply add-dark-mode

IA:  Retomando add-dark-mode...
     Continuando na tarefa 2.3: Atualizar Header...
```

**Ideal para:** Fluxos de trabalho paralelos, interrupções urgentes, colaboração em equipe.

Quando você tem múltiplas alterações concluídas, use `/opsx:bulk-archive`:

```text
Você: /opsx:bulk-archive

IA:  Encontradas 3 alterações concluídas:
     - add-dark-mode (todas as tarefas concluídas)
     - fix-login-redirect (todas as tarefas concluídas)
     - update-footer (todas as tarefas concluídas)

     Verificando conflitos de especificações...
     ⚠ add-dark-mode e update-footer afetam specs/ui/

     Inspecionando base de código para resolver...
     Ambas as alterações estão implementadas. Serão aplicadas em ordem cronológica.

     Arquivar todas as 3 alterações?

Você: Sim

IA:  ✓ add-dark-mode arquivado
     ✓ fix-login-redirect arquivado
     ✓ update-footer arquivado
     Especificações mescladas em ordem: add-dark-mode → update-footer
```

O arquivamento em lote detecta quando múltiplas alterações afetam as mesmas especificações e resolve conflitos verificando o que está realmente implementado.

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
Você: /opsx:verify

IA:  Verificando add-auth...

     COMPLETUDE
     ✓ Todas as 12 tarefas em tasks.md estão marcadas
     ✓ Todos os requisitos nas especificações têm código correspondente
     ⚠ Cenário "Tempo limite de sessão após inatividade" não testado

     CORREÇÃO
     ✓ Implementação corresponde à intenção da especificação
     ✓ Casos de borda dos cenários são tratados
     ✓ Estados de erro correspondem às definições da especificação

     COERÊNCIA
     ✓ Decisões de design refletidas na estrutura do código
     ✓ Convenções de nomenclatura consistentes com design.md
     ⚠ Design menciona "orientado a eventos", mas implementação usa polling

     RESUMO
     ─────────────────────────────
     Problemas críticos: 0
     Avisos: 2
     Pronto para arquivar: Sim (com avisos)

     Recomendações:
     1. Adicionar teste para o cenário de tempo limite de sessão
     2. Considerar refatorar para orientado a eventos conforme projetado, ou atualizar design.md
```

**O que a verificação confere:**

| Dimensão | O que valida |
|-----------|------------------|
| Completude | Todas as tarefas concluídas, todos os requisitos implementados, cenários cobertos |
| Correção | Implementação corresponde à intenção da especificação, casos de borda tratados |
| Coerência | Decisões de design refletidas no código, padrões consistentes |

A verificação não bloqueará o arquivamento, mas destaca problemas que você pode querer resolver primeiro.

#### Arquivar: Finalizar a Alteração

`/opsx:archive` conclui a alteração e a move para o arquivo:

```text
Você: /opsx:archive

IA:  Arquivando add-auth...

     Status dos artefatos:
     ✓ proposal.md existe
     ✓ specs/ existe
     ✓ design.md existe
     ✓ tasks.md existe (12/12 tarefas concluídas)

     Especificações delta: Ainda não sincronizadas com a principal
     → Gostaria de sincronizar agora?

Você: Sim

IA:  ✓ Especificações sincronizadas para openspec/specs/auth/spec.md
     ✓ Movido para openspec/changes/archive/2025-01-24-add-auth/

     Alteração arquivada com sucesso.
```

O arquivamento solicitará se as especificações não estiverem sincronizadas. Não bloqueará por tarefas incompletas, mas emitirá um aviso.

## Quando Usar o Quê

### `/opsx:ff` vs `/opsx:continue`

| Situação | Use |
|-----------|-----|
| Requisitos claros, pronto para construir | `/opsx:ff` |
| Explorando, deseja revisar cada etapa | `/opsx:continue` |
| Deseja iterar na proposta antes das especificações | `/opsx:continue` |
| Pressão de tempo, precisa agilizar | `/opsx:ff` |
| Alteração complexa, deseja controle | `/opsx:continue` |

**Regra geral:** Se você consegue descrever todo o escopo antecipadamente, use `/opsx:ff`. Se está descobrindo durante o processo, use `/opsx:continue`.

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
- Patches confundiriam mais do que esclareceriam

```text
                     ┌─────────────────────────────────────┐
                     │     Isso é o mesmo trabalho?        │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Mesma intenção?   Sobreposição >50%?   A original pode
          Mesmo problema?   Mesmo escopo?        ser "concluída" sem
                 │                  │          essas alterações?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      SIM               NÃO SIM          NÃO NÃO             SIM
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    ATUALIZAR         NOVA ATUALIZAR    NOVA ATUALIZAR       NOVA
```

**Exemplo: "Adicionar modo escuro"**

- "Preciso também suportar temas personalizados" → Nova alteração (escopo explodiu)
- "A detecção de preferência do sistema é mais difícil do que o esperado" → Atualizar (mesma intenção)
- "Vamos lançar o interruptor primeiro, adicionar preferências depois" → Atualizar, depois arquivar, depois nova alteração

## Melhores Práticas

### Mantenha as Alterações Focadas

Uma unidade lógica de trabalho por alteração. Se você está fazendo "adicionar funcionalidade X e também refatorar Y", considere duas alterações separadas.

**Por que isso importa:**
- Mais fácil de revisar e entender
- Histórico de arquivo mais limpo
- Pode ser lançado de forma independente
- Rollback mais simples, se necessário

### Use `/opsx:explore` para Requisitos Pouco Claros

Antes de se comprometer com uma alteração, explore o espaço do problema:

```text
Você: /opsx:explore

IA:  O que você gostaria de explorar?

Você: Como devemos lidar com limitação de taxa para nossa API?

IA:  Deixe-me investigar sua configuração atual e opções...
     [Pesquisa a base de código, considera padrões]

     Vejo três abordagens que podemos tomar:
     1. Baseada em middleware (simples, por endpoint)
     2. Com suporte a Redis (escalável, estado compartilhado)
     3. Balde de token por usuário (justo, complexo)

     Sua pilha atual sugere #1 ou #2. Qual é a sua escala?
```

A exploração esclarece o pensamento antes de você criar artefatos.

### Verifique Antes de Arquivar

Use `/opsx:verify` para conferir se a implementação corresponde aos artefatos:

```text
Você: /opsx:verify

IA:  Verificando add-dark-mode...

     ✓ Todas as tarefas em tasks.md estão marcadas
     ✓ Requisitos nas especificações têm código correspondente
     ✓ Decisões de design são refletidas na implementação

     Pronto para arquivar!
```

Detecta incompatibilidades antes de você encerrar a alteração.

### Nomeie as Alterações de Forma Clara

Nomes bons tornam `openspec list` útil:

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
| `/opsx:explore` | Pensar em ideias | Requisitos pouco claros, investigação |
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