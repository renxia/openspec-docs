# Fluxos de Trabalho

Este guia cobre padrões comuns de fluxo de trabalho para OpenSpec e quando usar cada um. Para configuração básica, consulte [Getting Started](getting-started.md). Para referência de comandos, consulte [Commands](commands.md).

## Filosofia: Ações, Não Fases

Fluxos de trabalho tradicionais forçam você através de fases: planejamento, depois implementação, e então concluído. Mas o trabalho real não se encaixa perfeitamente em caixas.

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

**Princípios chave:**

- **Ações, não fases** - Os comandos são coisas que você pode fazer, não estágios nos quais você fica preso
- **Dependências são habilitadores** - Elas mostram o que é possível, e não o que é necessário em seguida

> **Personalização:** Os fluxos de trabalho do OPSX são impulsionados por esquemas que definem sequências de artefatos. Consulte [Customization](customization.md) para detalhes sobre a criação de esquemas personalizados.

## Dois Modos

### Caminho Rápido Padrão (`core` profile)

Novas instalações são configuradas para `core`, que fornece:
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

#### Comece explorando (o hábito a ser formado)

`/opsx:explore` faz parte do perfil padrão, não é um complemento avançado. É o movimento a ser feito sempre que você tem um problema, mas ainda não um plano, o que acontece na maioria das vezes.

```text
Você: /opsx:explore

AI:  O que você gostaria de explorar?

Você: Nossos resultados de pesquisa parecem estagnados. Não tenho certeza se é cache,
     indexação ou a própria consulta.

AI:  Deixe-me verificar... [lê o serviço de busca e a camada de cache]
     É o índice: ele só é reconstruído diariamente, então as edições não aparecem
     até o dia seguinte. Duas opções: reconstruir na escrita (simples, mais carga) ou uma invalidação de cache de curta TTL (mais partes móveis, menos carga). Dado que seu volume de escrita é baixo, a reconstrução na escrita é a correção mais limpa. Quer delimitar?

Você: Sim.

Você: /opsx:propose rebuild-search-index-on-write
```

Explorar não cria artefatos e não escreve código. É uma conversa gratuita e sem riscos que transforma uma preocupação vaga em uma mudança precisa, para que a proposta seguinte seja afiada. Já sabe exatamente o que quer? Pule esta etapa e vá direto para `/opsx:propose`. Guia completo: [Explore First](explore.md).

### Fluxo de Trabalho Expandido/Completo (seleção personalizada)

Se você deseja comandos explícitos de *scaffolding* e construção (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), habilite-os com:

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
     Pronto para criar: proposta

Você: /opsx:ff

AI:  Criando todos os artefatos de planejamento...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Pronto para implementação!

Você: /opsx:apply

AI:  Trabalhando nas tarefas...
     ✓ Adicionado botão de logout no cabeçalho
     ✓ Implementada limpeza da sessão
     ✓ Adiado diálogo de confirmação
     Todas as tarefas concluídas!

Você: /opsx:archive

AI:  ✓ Especificações mescladas
     ✓ Mudança arquivada
```

**Melhor para:** Funcionalidades pequenas a médias, correções de bugs, mudanças diretas.

### Exploratório

Quando os requisitos não estão claros ou você precisa investigar primeiro:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Exemplo de conversa:**

```text
Você: /opsx:explore

AI:  O que você gostaria de explorar?

Você: Quero melhorar o desempenho do carregamento da página, mas não tenho certeza
     onde estão os gargalos.

AI:  Deixe-me ajudar a investigar...
     [Analisa tamanhos dos pacotes, identifica consultas lentas, revisa padrões de renderização de componentes]

     Encontrei três gargalos principais:
     1. Imagens grandes e não otimizadas
     2. Busca síncrona de dados em ProductList
     3. Re-renderizações devido a mudanças de contexto

     Qual você gostaria de abordar primeiro?

Você: Vamos lidar com o problema da busca de dados.

Você: /opsx:new optimize-product-list-fetching

AI:  Criada mudança. Pronto para criar: proposta

Você: /opsx:continue

AI:  Criando a proposta com base em nossa exploração...
     [Escreve a proposta incorporando os insights da investigação]

     Pronto para criar: especificações, design
     Qual você gostaria de fazer em seguida?

Você: /opsx:continue

AI:  Criando as especificações...
```

**Melhor para:** Otimização de desempenho, depuração, decisões arquitetônicas, requisitos não claros.

### Mudanças Paralelas

Trabalhe em múltiplas mudanças ao mesmo tempo:

```text
Mudança A: /opsx:new ──► /opsx:ff ──► /opsx:apply (em andamento)
                                         │
                                    troca de contexto
                                         │
Mudança B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Exemplo de conversa:**

```text
Você: Estou trabalhando em add-dark-mode, mas fui puxado para uma correção de bug

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

Você: Vamos voltar ao dark mode

Você: /opsx:apply add-dark-mode

AI:  Retomando add-dark-mode...
     Retomando na tarefa 2.3: Atualizar Cabeçalho...
```

**Melhor para:** Fluxos de trabalho paralelos, interrupções urgentes, colaboração em equipe.

Quando você tiver múltiplas mudanças concluídas, use `/opsx:bulk-archive`:

```text
Você: /opsx:bulk-archive

AI:  Encontradas 3 mudanças concluídas:
     - add-dark-mode (todas as tarefas feitas)
     - fix-login-redirect (todas as tarefas feitas)
     - update-footer (todas as tarefas feitas)

     Verificando conflitos de especificação...
     ⚠ add-dark-mode e update-footer tocam em specs/ui/

     Inspecionando a base de código para resolver...
     Ambas as mudanças estão implementadas. Será aplicado na ordem cronológica.

     Arquivar todas as 3 mudanças?

Você: Sim

AI:  ✓ add-dark-mode arquivado
     ✓ fix-login-redirect arquivado
     ✓ update-footer arquivado
     Especificações mescladas na ordem: add-dark-mode → update-footer
```

O *bulk archive* detecta quando múltiplas mudanças tocam nas mesmas especificações e resolve conflitos verificando o que está realmente implementado.

### Concluindo uma Mudança

O fluxo de conclusão recomendado:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              valida implementação     solicita sincronização
              implementação      se necessário
```

#### Verificar: Verifique Seu Trabalho

`/opsx:verify` valida a implementação em relação aos seus artefatos em três dimensões:

```text
Você: /opsx:verify

AI:  Verificando add-auth...

     COMPLETUDE
     ✓ Todas as 12 tarefas em tasks.md foram verificadas
     ✓ Todos os requisitos nas especificações têm código correspondente
     ⚠ Cenário "Tempo limite de sessão após inatividade" não testado

     CORREÇÃO
     ✓ A implementação corresponde à intenção da especificação
     ✓ Casos de borda dos cenários são tratados
     ✓ Estados de erro correspondem às definições da especificação

     COERÊNCIA
     ✓ Decisões de design refletidas na estrutura do código
     ✓ Convenções de nomenclatura consistentes com design.md
     ⚠ O Design menciona "orientado a eventos", mas a implementação usa polling

     RESUMO
     ─────────────────────────────
     Problemas críticos: 0
     Avisos: 2
     Pronto para arquivar: Sim (com avisos)

     Recomendações:
     1. Adicionar teste para cenário de tempo limite de sessão
     2. Considerar refatoração para orientado a eventos, conforme projetado, ou atualizar design.md
```

**O que o *verify* verifica:**

| Dimensão | O que ele valida |
|-----------|------------------|
| Completude | Todas as tarefas concluídas, todos os requisitos implementados, cenários cobertos |
| Correção | A implementação corresponde à intenção da especificação, casos de borda tratados |
| Coerência | Decisões de design refletidas no código, padrões consistentes |

O *verify* não bloqueará o arquivamento, mas ele expõe problemas que você pode querer resolver primeiro.

#### Arquivar: Finalizar a Mudança

`/opsx:archive` conclui a mudança e a move para o arquivo:

```text
Você: /opsx:archive

AI:  Arquivando add-auth...

     Status dos artefatos:
     ✓ proposal.md existe
     ✓ specs/ existe
     ✓ design.md existe
     ✓ tasks.md existe (12/12 tarefas concluídas)

     Delta das especificações: Ainda não sincronizado com o principal
     → Gostaria de sincronizar agora?

Você: Sim

AI:  ✓ Especificações sincronizadas para openspec/specs/auth/spec.md
     ✓ Movido para openspec/changes/archive/2025-01-24-add-auth/

     Mudança arquivada com sucesso.
```

O *Archive* solicitará se as especificações não estiverem sincronizadas. Ele não bloqueará por tarefas incompletas, mas emitirá um aviso.

## Quando Usar O Quê

### `/opsx:ff` vs `/opsx:continue`

| Situação | Use |
|-----------|-----|
| Requisitos claros, pronto para construir | `/opsx:ff` |
| Explorando, quer revisar cada etapa | `/opsx:continue` |
| Quer iterar sobre a proposta antes das especificações | `/opsx:continue` |
| Pressa do tempo, precisa agir rápido | `/opsx:ff` |
| Mudança complexa, quer controle | `/opsx:continue` |

**Regra geral:** Se você pode descrever o escopo completo antecipadamente, use `/opsx:ff`. Se você está descobrindo enquanto avança, use `/opsx:continue`.

### Quando Atualizar vs Começar do Zero

Uma pergunta comum: quando é aceitável atualizar uma mudança existente e quando deve-se começar uma nova?

**Atualize a mudança existente quando:**

- Mesma intenção, execução refinada
- O escopo se estreita (MVP primeiro, o resto depois)
- Correções orientadas por aprendizado (a base de código não é o que você esperava)
- Ajustes no design com base em descobertas da implementação

**Comece uma nova mudança quando:**

- A intenção mudou fundamentalmente
- O escopo explodiu para um trabalho totalmente diferente
- A mudança original pode ser marcada como "concluída" de forma independente
- Os patches causariam mais confusão do que clareza

```text
                     ┌─────────────────────────────────────┐
                     │     Isto é o mesmo trabalho?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
      Mesma intenção?  >50% de sobreposição?  Pode a original
      Mesmo problema?   Mesmo escopo?        ser "concluída" sem
                     │                  │          estas mudanças?
                     │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      SIM               NÃO SIM           NÃO  NÃO              SIM
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    ATUALIZAR        NOVA  ATUALIZAR     NOVA  ATUALIZAR      NOVA
```

**Exemplo: "Adicionar modo escuro"**

- "Precisa também suportar temas personalizados" → Nova mudança (escopo explodiu)
- "A detecção de preferência do sistema é mais difícil do que o esperado" → Atualizar (mesma intenção)
- "Vamos lançar o toggle primeiro, adicionar as preferências depois" → Atualizar e arquivar, depois nova mudança

## Melhores Práticas

### Mantenha as Mudanças Focadas

Uma unidade lógica de trabalho por mudança. Se você está fazendo "adicionar funcionalidade X e também refatorar Y", considere duas mudanças separadas.

**Por que isso importa:**
- Mais fácil de revisar e entender
- Histórico de arquivo mais limpo
- Pode ser lançado independentemente
- Rollback mais simples, se necessário

### Use `/opsx:explore` para Requisitos Não Claros

Antes de se comprometer com uma mudança, explore o espaço do problema:

```text
Você: /opsx:explore

AI:  O que você gostaria de explorar?

Você: Como devemos lidar com limitação de taxa (rate limiting) para nossa API?

AI:  Deixe-me investigar sua configuração atual e as opções...
     [Pesquisa a base de código, considera padrões]

     Vejo três abordagens que poderíamos tomar:
     1. Baseado em middleware (simples, por endpoint)
     2. Com suporte Redis (escalável, estado compartilhado)
     3. Balde de tokens por usuário (justo, complexo)

     Sua pilha atual sugere #1 ou #2. Qual é a sua escala?
```

A exploração esclarece o pensamento antes que você crie artefatos.

### Verifique Antes de Arquivar

Use `/opsx:verify` para verificar se a implementação corresponde aos artefatos:

```text
Você: /opsx:verify

AI:  Verificando add-dark-mode...

     ✓ Todas as tarefas em tasks.md foram verificadas
     ✓ Os requisitos nas especificações têm código correspondente
     ✓ As decisões de design são refletidas na implementação

     Pronto para arquivar!
```

Captura incompatibilidades antes que você conclua a mudança.

### Nomeie as Mudanças Claramente

Bons nomes tornam o `openspec list` útil:

```text
Bom:                          Evite:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Referência Rápida de Comandos

Para detalhes completos dos comandos e opções, consulte [Commands](commands.md).

| Command | Propósito | Quando Usar |
|---------|---------|-------------|
| `/opsx:propose` | Criar artefatos de mudança e planejamento | Caminho padrão rápido (`core` profile) |
| `/opsx:explore` | Refletir sobre ideias com a IA | Comece aqui quando estiver em dúvida: requisitos não claros, investigação, comparando opções |
| `/opsx:new` | Iniciar um esqueleto (scaffold) de mudança | Modo expandido, controle explícito de artefatos |
| `/opsx:continue` | Criar o próximo artefato | Modo expandido, criação de artefatos passo a passo |
| `/opsx:ff` | Criar todos os artefatos de planejamento | Modo expandido, escopo claro |
| `/opsx:apply` | Implementar tarefas | Pronto para escrever código |
| `/opsx:verify` | Validar a implementação | Modo expandido, antes de arquivar |
| `/opsx:sync` | Mesclar especificações Delta | Modo expandido, opcional |
| `/opsx:archive` | Concluir a mudança | Todo o trabalho concluído |
| `/opsx:bulk-archive` | Arquivar múltiplas mudanças | Modo expandido, trabalho paralelo |

## Próximos Passos

- [Commands](commands.md) - Referência completa de comandos com opções
- [Concepts](concepts.md) - Análise aprofundada em especificações, artefatos e esquemas
- [Customization](customization.md) - Criar fluxos de trabalho personalizados