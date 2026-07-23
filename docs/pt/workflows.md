# Fluxos de Trabalho

Este guia aborda os padrões de fluxo de trabalho comuns para o OpenSpec e quando utilizar cada um deles. Para configuração básica, consulte [Primeiros Passos](getting-started.md). Para referência de comandos, consulte [Comandos](commands.md).

## Filosofia: Ações, Não Fases

Fluxos de trabalho tradicionais forçam você a passar por fases: planejamento, depois implementação, depois conclusão. Mas o trabalho real não se encaixa perfeitamente em caixas.

O OPSX adota uma abordagem diferente:

```text
Traditional (phase-locked):

  PLANNING ────────► IMPLEMENTING ────────► DONE
      │                    │
      │   "Can't go back"  │
      └────────────────────┘

OPSX (fluid actions):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Princípios-chave:**

- **Ações, não fases** - Os comandos são coisas que você pode fazer, não estágios em que fica preso
- **Dependências são habilitadoras** - Elas mostram o que é possível, não o que é obrigatório na etapa seguinte

> **Personalização:** Os fluxos de trabalho do OPSX são orientados por esquemas que definem sequências de artefatos. Consulte [Personalização](customization.md) para obter detalhes sobre a criação de esquemas personalizados.

## Dois Modos

### Caminho Rápido Padrão (perfil `core`)

Novas instalações usam `core` por padrão, que fornece:
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Fluxo típico:

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (opcional)
```

#### Comece explorando (o hábito que vale a pena formar)

`/opsx:explore` faz parte do perfil padrão, não é um complemento avançado. É a ação a tomar sempre que você tem um problema mas ainda não tem um plano, o que, com um assistente de IA, é na maioria das vezes.

```text
Você: /opsx:explore

IA:  O que você gostaria de explorar?

Você: Nossos resultados de busca parecem desatualizados. Não tenho certeza se é cache,
     indexação ou a própria consulta.

IA:  Deixe-me verificar... [lê o serviço de busca e camada de cache]
     É o índice: ele só é reconstruído à noite, então as edições não aparecem
     até o dia seguinte. Duas opções: reconstruir na escrita (simples,
     mais carga) ou uma invalidação de cache com TTL curto (mais partes móveis,
     menos carga). Dado que seu volume de escritas é baixo, reconstruir-na-escrita é
     a correção mais limpa. Quer definir o escopo?

Você: Sim.

Você: /opsx:propose rebuild-search-index-on-write
```

Explorar não cria artefatos e não escreve código. É uma conversa gratuita e sem riscos que transforma uma preocupação vaga em uma alteração precisa, para que a proposta que segue seja bem definida. Já sabe exatamente o que quer? Pule e vá direto para `/opsx:propose`. Guia completo: [Explore Primeiro](explore.md).

### Fluxo de Trabalho Expandido/Completo (seleção personalizada)

Se você deseja comandos explícitos de estrutura e construção (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), habilite-os com:

```bash
openspec config profile
openspec update
```

## Padrões de Fluxo de Trabalho (Modo Expandido)

### Recurso Rápido

Quando você sabe o que quer construir e só precisa executar:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Exemplo de conversa:**

```text
Você: /opsx:new add-logout-button

IA:  Criado openspec/changes/add-logout-button/
     Pronto para criar: proposta

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

**Melhor para:** Recursos pequenos a médios, correções de bugs, alterações diretas.

### Exploratório

Quando os requisitos não estão claros ou você precisa investigar primeiro:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Exemplo de conversa:**

```text
Você: /opsx:explore

IA:  O que você gostaria de explorar?

Você: Quero melhorar o desempenho de carregamento da página mas não tenho certeza
     onde estão os gargalos.

IA:  Deixe-me ajudar a investigar...
     [Analisa tamanhos de bundles, identifica consultas lentas, revisa
     padrões de renderização de componentes]

     Encontrei três gargalos principais:
     1. Imagens grandes não otimizadas
     2. Busca de dados síncrona em ProductList
     3. Re-renderizações de mudanças de contexto

     Qual você gostaria de abordar primeiro?

Você: Vamos resolver o problema de busca de dados.

Você: /opsx:new optimize-product-list-fetching

IA:  Alteração criada. Pronto para criar: proposta

Você: /opsx:continue

IA:  Criando proposta baseada em nossa exploração...
     [Escreve proposta incorporando insights da investigação]

     Pronto para criar: especificações, design
     Qual você gostaria a seguir?

Você: /opsx:continue

IA:  Criando especificações...
```

**Melhor para:** Otimização de desempenho, depuração, decisões arquiteturais, requisitos pouco claros.

### Alterações Paralelas

Trabalhe em várias alterações ao mesmo tempo:

```text
Alteração A: /opsx:new ──► /opsx:ff ──► /opsx:apply (em andamento)
                                         │
                                    mudança de contexto
                                         │
Alteração B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Exemplo de conversa:**

```text
Você: Estou trabalhando em add-dark-mode mas fui chamado para uma correção de bug

Você: /opsx:new fix-login-redirect

IA:  Criado openspec/changes/fix-login-redirect/

Você: /opsx:ff

IA:  ✓ Artefatos de planejamento criados

Você: /opsx:apply

IA:  Trabalhando em fix-login-redirect...
     [Implementa a correção]
     Todas as tarefas concluídas!

Você: /opsx:archive

IA:  ✓ fix-login-redirect arquivada

Você: Vamos voltar para o modo escuro

Você: /opsx:apply add-dark-mode

IA:  Retomando add-dark-mode...
     Continuando na tarefa 2.3: Atualizar Cabeçalho...
```

**Melhor para:** Fluxos de trabalho paralelos, interrupções urgentes, colaboração em equipe.

Quando você tiver várias alterações concluídas, use `/opsx:bulk-archive`:

```text
Você: /opsx:bulk-archive

IA:  Encontradas 3 alterações concluídas:
     - add-dark-mode (todas as tarefas feitas)
     - fix-login-redirect (todas as tarefas feitas)
     - update-footer (todas as tarefas feitas)

     Verificando conflitos de especificações...
     ⚡ add-dark-mode e update-footer ambas alteram specs/ui/

     Inspecionando a base de código para resolver...
     Ambas as alterações estão implementadas. Aplicará em ordem cronológica.

     Arquivar todas as 3 alterações?

Você: Sim

IA:  ✓ add-dark-mode arquivada
     ✓ fix-login-redirect arquivada
     ✓ update-footer arquivada
     Especificações mescladas em ordem: add-dark-mode → update-footer
```

O arquivamento em massa detecta quando várias alterações tocam nas mesmas especificações e resolve conflitos verificando o que foi realmente implementado.

### Concluindo uma Alteração

O fluxo de conclusão recomendado:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              valida          solicita para sincronizar
              implementação     se necessário
```

#### Verificar: Verifique Seu Trabalho

`/opsx:verify` valida a implementação em relação aos seus artefatos em três dimensões:

```text
Você: /opsx:verify

IA:  Verificando add-auth...

     COMPLETUDE
     ✓ Todas as 12 tarefas em tasks.md estão verificadas
     ✓ Todos os requisitos nas especificações têm código correspondente
     ⚠ Cenário "Tempo limite de sessão após inatividade" não testado

     CORREÇÃO
     ✓ A implementação corresponde à intenção da especificação
     ✓ Casos extremos dos cenários são tratados
     ✓ Estados de erro correspondem às definições da especificação

     COERÊNCIA
     ✓ Decisões de design refletidas na estrutura do código
     ✓ Convenções de nomenclatura consistentes com design.md
     ⚠ O design menciona "orientado a eventos" mas a implementação usa polling

     RESUMO
     ─────────────────────────────
     Problemas críticos: 0
     Avisos: 2
     Pronto para arquivar: Sim (com avisos)

     Recomendações:
     1. Adicione teste para o cenário de tempo limite de sessão
     2. Considere refatorar para orientado a eventos como projetado, ou atualize design.md
```

**O que a verificação verifica:**

| Dimensão | O que valida |
|----------|--------------|
| Completude | Todas as tarefas feitas, todos os requisitos implementados, cenários cobertos |
| Correção | A implementação corresponde à intenção da especificação, casos extremos tratados |
| Coerência | Decisões de design refletidas no código, padrões consistentes |

Verificar não bloqueará o arquivamento, mas mostra problemas que você pode querer resolver primeiro.

#### Arquivar: Finalizar a Alteração

`/opsx:archive` conclui a alteração e a move para o arquivo morto:

```text
Você: /opsx:archive

IA:  Arquivando add-auth...

     Status dos artefatos:
     ✓ proposal.md existe
     ✓ specs/ existe
     ✓ design.md existe
     ✓ tasks.md existe (12/12 tarefas concluídas)

     Especificações delta: Ainda não sincronizadas com a main
     → Gostaria de sincronizar agora?

Você: Sim

IA:  ✓ Especificações sincronizadas para openspec/specs/auth/spec.md
     ✓ Movidas para openspec/changes/archive/2025-01-24-add-auth/

     Alteração arquivada com sucesso.
```

O arquivamento solicitará confirmação se as especificações não estiverem sincronizadas. Ele não bloqueará tarefas incompletas, mas avisará você.

## Quando Usar O Quê

### `/opsx:ff` vs `/opsx:continue`

| Situação | Usar |
|----------|------|
| Requisitos claros, pronto para construir | `/opsx:ff` |
| Explorando, quer revisar cada passo | `/opsx:continue` |
| Quer iterar na proposta antes das especificações | `/opsx:continue` |
| Pressão de tempo, precisa avançar rápido | `/opsx:ff` |
| Alteração complexa, quer controle | `/opsx:continue` |

**Regra geral:** Se você pode descrever todo o escopo antecipadamente, use `/opsx:ff`. Se você está descobrindo isso ao longo do caminho, use `/opsx:continue`.

### Quando Atualizar vs Começar do Zero

Uma pergunta comum: quando é aceitável atualizar uma alteração existente e quando você deve começar uma nova?

**Atualize a alteração existente quando:**

- Mesma intenção, execução refinada
- Escopo diminui (MVP primeiro, o resto depois)
- Correções orientadas por aprendizado (a base de código não é o que você esperava)
- Ajustes de design baseados em descobertas da implementação

**Comece uma nova alteração quando:**

- Intenção fundamentalmente alterada
- Escopo expandiu para um trabalho completamente diferente
- A alteração original pode ser marcada como "concluída" sozinha
- Patches confundiriam mais do que esclareceriam

```text
                     ┌─────────────────────────────────────┐
                     │     Este é o mesmo trabalho?         │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Mesma intenção?      >50% de sobreposição?      A original pode ser
          Mesmo problema?     Mesmo escopo?        "concluída" sem
                 │                  │          essas alterações?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      SIM               NÃO SIM          NÃO  NÃO            SIM
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    ATUALIZAR         NOVO  ATUALIZAR    NOVO  ATUALIZAR     NOVO
```

**Exemplo: "Adicionar modo escuro"**

- "Precisa também suportar temas personalizados" → Nova alteração (escopo expandiu)
- "A detecção de preferência do sistema é mais difícil do que o esperado" → Atualizar (mesma intenção)
- "Vamos lançar a alternância primeiro, adicionar preferências depois" → Atualizar depois arquivar, depois nova alteração

## Melhores Práticas

### Mantenha as Alterações Focadas

Uma unidade lógica de trabalho por alteração. Se você está fazendo "adicionar recurso X e também refatorar Y", considere duas alterações separadas.

**Por que isso importa:**
- Mais fácil de revisar e entender
- Histórico de arquivo morto mais limpo
- Pode ser lançado independentemente
- Reversão mais simples se necessário

### Use `/opsx:explore` para Requisitos Pouco Claros

Antes de se comprometer com uma alteração, explore o espaço do problema:

```text
Você: /opsx:explore

IA:  O que você gostaria de explorar?

Você: Como devemos lidar com a limitação de taxa para nossa API?

IA:  Deixe-me investigar sua configuração atual e opções...
     [Pesquisa a base de código, considera padrões]

     Vejo três abordagens que podemos tomar:
     1. Baseada em middleware (simples, por endpoint)
     2. Com suporte Redis (escalável, estado compartilhado)
     3. Balde de fichas por usuário (justo, complexo)

     Sua stack atual sugere #1 ou #2. Qual é a sua escala?
```

A exploração esclarece o pensamento antes de você criar artefatos.

### Verifique Antes de Arquivar

Use `/opsx:verify` para verificar se a implementação corresponde aos artefatos:

```text
Você: /opsx:verify

IA:  Verificando add-dark-mode...

     ✓ Todas as tarefas em tasks.md estão verificadas
     ✓ Os requisitos nas especificações têm código correspondente
     ✓ As decisões de design são refletidas na implementação

     Pronto para arquivar!
```

Detecta incompatibilidades antes de você concluir a alteração.

### Nomeie as Alterações Claramente

Nomes bons tornam o `openspec list` útil:

```text
Bom:                          Evite:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Referência Rápida de Comandos

Para detalhes completos dos comandos e opções, consulte [Comandos](commands.md).

| Comando | Finalidade | Quando Usar |
|---------|------------|-------------|
| `/opsx:propose` | Criar alteração + artefatos de planejamento | Caminho padrão rápido (perfil `core`) |
| `/opsx:explore` | Refletir sobre ideias com a IA | Comece por aqui quando tiver dúvidas: requisitos pouco claros, investigação, comparação de opções |
| `/opsx:new` | Iniciar um esqueleto de alteração | Modo expandido, controle explícito de artefatos |
| `/opsx:continue` | Criar o próximo artefato | Modo expandido, criação de artefatos passo a passo |
| `/opsx:ff` | Criar todos os artefatos de planejamento | Modo expandido, escopo definido |
| `/opsx:apply` | Implementar tarefas | Pronto para escrever código |
| `/opsx:verify` | Validar a implementação | Modo expandido, antes de arquivar |
| `/opsx:sync` | Mesclar especificações delta | Modo expandido, opcional |
| `/opsx:archive` | Concluir a alteração | Todo o trabalho finalizado |
| `/opsx:bulk-archive` | Arquivar múltiplas alterações | Modo expandido, trabalho paralelo |

## Próximos Passos

- [Escrevendo Boas Especificações](writing-specs.md) - Como são um requisito e um cenário bem estruturados, e como dimensionar corretamente uma alteração
- [Revisando uma Alteração](reviewing-changes.md) - A revisão rápida de dois minutos em um plano rascunhado antes de escrever qualquer código
- [OpenSpec em Equipe](team-workflow.md) - Como as alterações se encaixam em branches e pull requests
- [Comandos](commands.md) - Referência completa de comandos com opções
- [Conceitos](concepts.md) - Aprofundamento em especificações, artefatos e esquemas
- [Personalização](customization.md) - Criar fluxos de trabalho personalizados