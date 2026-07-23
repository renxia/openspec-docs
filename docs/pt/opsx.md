# Fluxo de Trabalho OPSX
> Feedback é bem-vindo no [Discord](https://discord.gg/YctCnvvshC).
## O Que É?
O OPSX é agora o fluxo de trabalho padrão para o OpenSpec.
É um **fluxo de trabalho fluido e iterativo** para alterações no OpenSpec. Não há mais fases rígidas — apenas ações que você pode realizar a qualquer momento.

## Por Que Isso Existe

O fluxo de trabalho legado do OpenSpec funciona, mas está **bloqueado**:

- **As instruções são codificadas** — enterradas no TypeScript, você não pode alterá-las
- **Tudo ou nada** — um comando grande cria tudo, não é possível testar peças individuais
- **Estrutura fixa** — mesmo fluxo de trabalho para todos, sem personalização
- **Caixa preta** — quando a saída da IA é ruim, você não pode ajustar os prompts

**O OPSX abre isso.** Agora qualquer pessoa pode:

1. **Experimentar com instruções** — edite um modelo, veja se a IA funciona melhor
2. **Testar de forma granular** — valide as instruções de cada artefato independentemente
3. **Personalizar fluxos de trabalho** — defina seus próprios artefatos e dependências
4. **Iterar rapidamente** — altere um modelo, teste imediatamente, sem reconstrução

```
Fluxo legado:                           OPSX:
┌─────────────────────────┐           ┌────────────────────────┐
│  Codificado no pacote   │           │  schema.yaml           │◄── Você edita isso
│  (não pode alterar)     │           │  templates/*.md        │◄── Ou isso
│        ↓                │           │        ↓               │
│  Aguarda nova versão    │           │  Efeito instantâneo    │
│        ↓                │           │        ↓               │
│  Espera que melhore     │           │  Teste você mesmo      │
└─────────────────────────┘           └────────────────────────┘
```

**Isto é para todos:**
- **Equipes** — criem fluxos de trabalho que correspondam à forma como vocês realmente trabalham
- **Usuários avançados** — ajustem prompts para obter melhores saídas de IA para sua base de código
- **Contribuidores do OpenSpec** — experimentem novas abordagens sem lançamentos

Todos nós ainda estamos aprendendo o que funciona melhor. O OPSX nos permite aprender juntos.

## A Experiência do Usuário

**O problema com fluxos de trabalho lineares:**
Você está na "fase de planejamento", depois na "fase de implementação", depois "pronto". Mas o trabalho real não funciona assim. Você implementa algo, percebe que seu design estava errado, precisa atualizar as especificações, continua implementando. Fases lineares lutam contra a forma como o trabalho realmente acontece.

**Abordagem OPSX:**
- **Ações, não fases** — criar, implementar, atualizar, arquivar — faça qualquer uma delas a qualquer momento
- **Dependências são habilitadores** — elas mostram o que é possível, não o que é necessário a seguir

```
  proposta ──→ especificações ──→ design ──→ tarefas ──→ implementação
```

## Configuração

```bash
# Certifique-se de ter o openspec instalado — as habilidades são geradas automaticamente
openspec init
```

Isso cria habilidades em `.claude/skills/` (ou equivalente) que assistentes de codificação de IA detectam automaticamente.

Por padrão, o OpenSpec usa o perfil de fluxo de trabalho `core` (`propose`, `explore`, `apply`, `sync`, `archive`). Se você quiser os comandos de fluxo de trabalho expandido (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`), configure-os com `openspec config profile` e aplique com `openspec update`.

Durante a configuração, você será solicitado a criar uma **configuração de projeto** (`openspec/config.yaml`). Isso é opcional, mas recomendado.

## Configuração do Projeto

A configuração do projeto permite que você defina padrões e injete contexto específico do projeto em todos os artefatos.

### Criando Configuração

A configuração é criada durante o `openspec init`, ou manualmente:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  API conventions: RESTful, JSON responses
  Testing: Vitest for unit tests, Playwright for e2e
  Style: ESLint with Prettier, strict TypeScript

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format for scenarios
  design:
    - Include sequence diagrams for complex flows
```

### Campos de Configuração

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `schema` | string | Esquema padrão para novas mudanças (ex: `spec-driven`) |
| `context` | string | Contexto do projeto injetado em todas as instruções de artefatos |
| `rules` | object | Regras por artefato, indexadas por ID de artefato |

### Como Funciona

**Precedência de esquema** (do maior para o menor):
1. Flag CLI (`--schema <name>`)
2. Metadados da mudança (`.openspec.yaml` no diretório da mudança)
3. Configuração do projeto (`openspec/config.yaml`)
4. Padrão (`spec-driven`)

**Injeção de contexto:**
- O contexto é prefixado em todas as instruções de artefatos
- Envolto em tags `<context>...</context>`
- Ajuda a IA a entender as convenções do seu projeto

**Injeção de regras:**
- Regras são injetadas apenas para artefatos correspondentes
- Envolto em tags `<rules>...</rules>`
- Aparecem após o contexto, antes do modelo

### IDs de Artefatos por Esquema

**spec-driven** (padrão):
- `proposal` — Proposta de mudança
- `specs` — Especificações
- `design` — Design técnico
- `tasks` — Tarefas de implementação

### Validação de Configuração

- IDs de artefatos desconhecidos em `rules` geram avisos
- Nomes de esquemas são validados contra esquemas disponíveis
- O contexto tem um limite de tamanho de 50KB
- YAML inválido é reportado com números de linha

### Solução de Problemas

**"ID de artefato desconhecido em regras: X"**
- Verifique se os IDs de artefatos correspondem ao seu esquema (veja a lista acima)
- Execute `openspec schemas --json` para ver os IDs de artefatos para cada esquema

**Configuração não está sendo aplicada:**
- Certifique-se de que o arquivo está em `openspec/config.yaml` (não `.yml`)
- Verifique a sintaxe YAML com um validador
- Alterações na configuração entram em vigor imediatamente (não é necessário reiniciar)

**Contexto muito grande:**
- O contexto é limitado a 50KB
- Resuma ou faça link para documentação externa

## Comandos

| Comando | O que faz |
|---------|-----------|
| `/opsx:propose` | Cria uma mudança e gera artefatos de planejamento em uma etapa (caminho rápido padrão) |
| `/opsx:explore` | Pensa nas ideias, investiga problemas, esclarece requisitos |
| `/opsx:new` | Inicia um esqueleto de nova mudança (fluxo de trabalho expandido) |
| `/opsx:continue` | Cria o próximo artefato (fluxo de trabalho expandido) |
| `/opsx:ff` | Avança rapidamente os artefatos de planejamento (fluxo de trabalho expandido) |
| `/opsx:apply` | Implementa tarefas, atualizando artefatos conforme necessário |
| `/opsx:update` | Revisa os artefatos de planejamento de uma mudança e mantém eles coerentes |
| `/opsx:verify` | Valida a implementação contra os artefatos (fluxo de trabalho expandido) |
| `/opsx:sync` | Sincroniza especificações delta para o main (fluxo de trabalho padrão, opcional) |
| `/opsx:archive` | Arquiva quando pronto |
| `/opsx:bulk-archive` | Arquiva múltiplas mudanças concluídas (fluxo de trabalho expandido) |
| `/opsx:onboard` | Passo a passo guiado de uma mudança ponta a ponta (fluxo de trabalho expandido) |

## Uso

### Explore uma ideia

```text
/opsx:explore
```

Pense nas ideias, investigue problemas, compare opções. Nenhuma estrutura necessária - apenas um parceiro de pensamento. Quando os insights se cristalizarem, transicione para `/opsx:propose` (padrão) ou `/opsx:new`/`/opsx:ff` (expandido).

### Inicie uma nova mudança

```text
/opsx:propose
```

Cria a mudança e gera os artefatos de planejamento necessários antes da implementação.

Se você habilitou fluxos de trabalho expandidos, você pode usar alternativamente:

```text
/opsx:new        # apenas esqueleto
/opsx:continue   # cria um artefato por vez
/opsx:ff         # cria todos os artefatos de planejamento de uma vez
```

### Criar artefatos

```text
/opsx:continue
```

Mostra o que está pronto para criar com base nas dependências, depois cria um artefato. Use repetidamente para construir sua mudança incrementalmente.

```text
/opsx:ff add-dark-mode
```

Cria todos os artefatos de planejamento de uma vez. Use quando você tiver uma imagem clara do que está construindo.

### Implementar (a parte fluida)

```text
/opsx:apply
```

Trabalha nas tarefas, marcando-as como concluídas conforme você avança. Se você estiver lidando com múltiplas mudanças, você pode executar `/opsx:apply <name>`; caso contrário, ele deve inferir a partir da conversa e solicitar que você escolha se não conseguir identificar.

### Atualizando uma mudança

```text
/opsx:update add-dark-mode - we're storing the theme in a cookie now
```

Revisa os artefatos de planejamento existentes da mudança e mantém eles coerentes - em qualquer direção (uma edição de design pode se propagar de volta para a proposta). Apenas artefatos de planejamento: ele nunca edita código, e nunca cria artefatos faltantes (isso é o `/opsx:continue`). Cada edição é confirmada com você primeiro. Se a mudança já foi implementada, ele recomenda `/opsx:apply` para que o código alcance o plano revisado. Se sua revisão mudar a *intenção* da mudança, comece do zero ao invés disso - veja [Quando Atualizar vs. Começar do Zero](#when-to-update-vs-start-fresh).

### Finalizando

```text
/opsx:archive   # Move para o arquivo quando pronto (solicita sincronização de especificações se necessário)
```

## Quando Atualizar vs. Começar do Zero

Você sempre pode editar sua proposta ou especificações antes da implementação. Mas quando o refinamento se torna 'este é um trabalho diferente'?

### O que uma Proposta Captura

Uma proposta define três coisas:
1. **Intenção** — Que problema você está resolvendo?
2. **Escopo** — O que está dentro/fora dos limites?
3. **Abordagem** — Como você vai resolvê-lo?

A questão é: o que mudou, e quanto?

### Atualize a Mudança Existente Quando:

**Mesma intenção, execução refinada**
- Você descobre casos de borda que não considerou
- A abordagem precisa de ajustes, mas o objetivo permanece inalterado
- A implementação revela que o design estava um pouco errado

**Escopo diminui**
- Você percebe que o escopo completo é muito grande, quer lançar o MVP primeiro
- "Adicionar modo escuro" → "Adicionar alternância de modo escuro (preferência do sistema na v2)"

**Correções baseadas em aprendizado**
- A base de código não está estruturada como você pensava
- Uma dependência não funciona como esperado
- "Usar variáveis CSS" → "Usar o prefixo `dark:` do Tailwind ao invés"

### Inicie uma Nova Mudança Quando:

**Intenção fundamentalmente alterada**
- O problema em si é diferente agora
- "Adicionar modo escuro" → "Adicionar sistema de tema abrangente com cores, fontes e espaçamento personalizados"

**Escopo explodiu**
- A mudança cresceu tanto que é essencialmente um trabalho diferente
- A proposta original seria irreconhecível após atualizações
- "Corrigir bug de login" → "Reescrever sistema de autenticação"

**Original é completável**
- A mudança original pode ser marcada como 'concluída'
- O novo trabalho é independente, não um refinamento
- Concluir "Adicionar MVP do modo escuro" → Arquivar → Nova mudança "Melhorar modo escuro"

### As Heurísticas

```
                        ┌─────────────────────────────────────┐
                        │     É o mesmo trabalho?             │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Mesma intenção?   >50% de sobrepos.?  O original pode
             Mesmo problema?   Mesmo escopo?       ser "concluído"
                    │                  │          sem essas mudanças?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         SIM               NÃO SIM          NÃO  NÃO             SIM
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       ATUALIZAR          NOVO ATUALIZAR    NOVO ATUALIZAR       NOVO
```

| Teste | Atualizar | Nova Mudança |
|-------|-----------|--------------|
| **Identidade** | "Mesma coisa, refinada" | "Trabalho diferente" |
| **Sobreposição de escopo** | >50% de sobreposição | <50% de sobreposição |
| **Conclusão** | Não pode ser "concluída" sem mudanças | Pode terminar o original, novo trabalho é independente |
| **Histórico** | Cadeia de atualizações conta história coerente | Correções confundiriam mais do que clarificariam |

### O Princípio

> **Atualizar preserva o contexto. Nova mudança fornece clareza.**
>
> Escolha atualizar quando o histórico do seu pensamento for valioso.
> Escolha novo quando começar do zero for mais claro do que corrigir.

Pense nisso como branches do git:
- Continue commitando enquanto trabalha na mesma funcionalidade
- Crie uma nova branch quando for um trabalho genuinamente novo
- Às vezes faça merge de uma funcionalidade parcial e comece do zero para a fase 2

## O que é Diferente?

| | Legado (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Estrutura** | Um grande documento de proposta | Artefatos discretos com dependências |
| **Fluxo de trabalho** | Fases lineares: planejar → implementar → arquivar | Ações fluidas — faça qualquer coisa a qualquer momento |
| **Iteração** | Desajeitado para voltar | Atualiza artefatos conforme você aprende |
| **Personalização** | Estrutura fixa | Orientado a esquemas (defina seus próprios artefatos) |

**O insight chave:** o trabalho não é linear. O OPSX para de fingir que é.

## Análise Profunda da Arquitetura

Esta seção explica como o OPSX funciona internamente e como ele se compara ao fluxo de trabalho legado.
Os exemplos nesta seção usam o conjunto de comandos expandido (`new`, `continue`, etc.); usuários padrão `core` podem mapear o mesmo fluxo para `propose → apply → sync → archive`.

### Filosofia: Fases vs Ações

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUXO DE TRABALHO LEGADO                             │
│                    (Travado em Fase, Tudo ou Nada)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │  PLANEJAMENTO│ ───► │ IMPLEMENTAÇÃO│ ───► │  ARQUIVAMENTO│             │
│   │    FASE      │      │    FASE      │      │    FASE      │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Cria TODOS os artefatos de uma vez                                     │
│   • Não é possível voltar para atualizar especificações durante a           │
│     implementação                                                           │
│   • Portões de fase impõem progressão linear                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            FLUXO DE TRABALHO OPSX                            │
│                      (Ações Fluídas, Iterativo)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           AÇÕES (não fases)               │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive│                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              qualquer ordem                │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Crie artefatos um de cada vez OU avance rapidamente                    │
│   • Atualize especificações/design/tarefas durante a implementação          │
│   • Dependências habilitam o progresso, fases não existem                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Arquitetura de Componentes

**Fluxo de trabalho legado** usa modelos codificados em TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  COMPONENTES DO FLUXO DE TRABALHO LEGADO                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Modelos Codificados (strings TypeScript)                                  │
│                    │                                                        │
│                    ▼                                                        │
│   Configuradores/adaptadores específicos da ferramenta                      │
│                    │                                                        │
│                    ▼                                                        │
│   Arquivos de Comando Gerados (.claude/commands/openspec/*.md)              │
│                                                                             │
│   • Estrutura fixa, sem consciência de artefatos                           │
│   • Alteração requer modificação de código + reconstrução                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** usa esquemas externos e um mecanismo de grafo de dependências:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPONENTES OPSX                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Definições de Esquema (YAML)                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Dependências                    │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Padrões glob                    │   │
│   │      requires: [proposal]      ◄── Habilitado após proposta         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Mecanismo de Grafo de Artefatos                                           │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Ordenação topológica (ordenamento por dependências)              │   │
│   │  • Detecção de estado (existência no sistema de arquivos)           │   │
│   │  • Geração de instruções ricas (modelos + contexto)                 │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Arquivos de Habilidade (.claude/skills/openspec-*/SKILL.md)               │
│                                                                             │
│   • Compatível com múltiplos editores (Claude Code, Cursor, Windsurf)       │
│   • Habilidades consultam CLI para dados estruturados                       │
│   • Totalmente personalizável via arquivos de esquema                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Modelo de Grafo de Dependências

Os artefatos formam um grafo acíclico direcionado (DAG). Dependências são **habilitadores**, não portões:

```
                              proposal
                             (nó raiz)
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
                 specs                       design
              (requires:                  (requires:
               proposal)                   proposal)
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                               tasks
                           (requires:
                           specs, design)
                                  │
                                  ▼
                          ┌──────────────┐
                          │ FASE DE APLICAÇÃO │
                          │ (requires:   │
                          │  tasks)      │
                          └──────────────┘
```

**Transições de estado:**

```
   BLOQUEADO ────────────────► PRONTO ────────────────► CONCLUÍDO
      │                        │                       │
   Dependências              Todas as deps           Arquivo existe
   faltando                  estão CONCLUÍDAS         no sistema de arquivos
```

### Fluxo de Informação

**Fluxo de trabalho legado** — agente recebe instruções estáticas:

```
  User: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Instruções estáticas:                  │
  │  • Criar proposal.md                    │
  │  • Criar tasks.md                       │
  │  • Criar design.md                      │
  │  • Criar specs/<capability>/spec.md     │
  │                                         │
  │  Sem consciência do que existe ou       │
  │  das dependências entre artefatos       │
  └─────────────────────────────────────────┘
           │
           ▼
  Agente cria TODOS os artefatos de uma vez
```

**OPSX** — agente consulta para obter contexto rico:

```
  User: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Passo 1: Consultar estado atual                                         │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec status --change "add-auth" --json                      │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "artifacts": [                                                  │  │
  │  │      {"id": "proposal", "status": "done"},                         │  │
  │  │      {"id": "specs", "status": "ready"},      ◄── Primeiro pronto   │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked", "missingDeps": ["specs"]}│  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Passo 2: Obter instruções ricas para o artefato pronto                  │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec instructions specs --change "add-auth" --json          │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "template": "# Specification\n\n## ADDED Requirements...",      │  │
  │  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
  │  │    "unlocks": ["tasks"]                                            │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Passo 3: Ler dependências → Criar UM artefato → Mostrar o que foi       │
  │           desbloqueado                                                   │
  └──────────────────────────────────────────────────────────────────────────┘
```

### Modelo de Iteração

**Fluxo de trabalho legado** — complicado de iterar:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Espera, o design está errado"
       │               │
       │               ├── Opções:
       │               │   • Editar arquivos manualmente (quebra o contexto)
       │               │   • Abandonar e começar do zero
       │               │   • Seguir em frente e corrigir depois
       │               │
       │               └── Nenhum mecanismo oficial de "voltar"
       │
       └── Cria TODOS os artefatos de uma vez
```

**OPSX** — iteração natural:

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── "O design está errado"
      │                │                  │
      │                │                  ▼
      │                │            Apenas edite design.md
      │                │            e continue!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply retoma
      │                │         de onde você parou
      │                │
      │                └── Cria UM artefato, mostra o que foi desbloqueado
      │
      └── Cria a estrutura da alteração, aguarda direcionamento
```

### Esquemas Personalizados

Crie fluxos de trabalho personalizados usando os comandos de gerenciamento de esquemas:

```bash
# Crie um novo esquema do zero (interativo)
openspec schema init my-workflow

# Ou faça um fork de um esquema existente como ponto de partida
openspec schema fork spec-driven my-workflow

# Valide a estrutura do seu esquema
openspec schema validate my-workflow

# Veja de onde um esquema é resolvido (útil para depuração)
openspec schema which my-workflow
```

Os esquemas são armazenados em `openspec/schemas/` (local do projeto, controlado por versão) ou `~/.local/share/openspec/schemas/` (global do usuário).

**Estrutura do esquema:**
```
openspec/schemas/research-first/
├── schema.yaml
└── templates/
    ├── research.md
    ├── proposal.md
    └── tasks.md
```

**Exemplo de schema.yaml:**
```yaml
name: research-first
artifacts:
  - id: research        # Adicionado antes de proposal
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Agora depende de research

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**Grafo de dependências:**
```
   research ──► proposal ──► tasks
```

### Resumo

| Aspecto | Legado | OPSX |
|--------|----------|------|
| **Modelos** | TypeScript embutido | YAML + Markdown externos |
| **Dependências** | Nenhuma (tudo de uma vez) | DAG com ordenação topológica |
| **Estado** | Modelo mental baseado em fases | Existência no sistema de arquivos |
| **Personalização** | Editar fonte, reconstruir | Criar schema.yaml |
| **Iteração** | Travada por fases | Fluida, edite qualquer coisa |
| **Suporte a editores** | Configurador/adaptadores específicos da ferramenta | Diretório único de skills |
## Esquemas

Esquemas definem quais artefatos existem e suas dependências. Atualmente disponíveis:

- **spec-driven** (padrão): proposal → specs → design → tasks

```bash
# Listar esquemas disponíveis
openspec schemas

# Ver todos os esquemas com suas fontes de resolução
openspec schema which --all

# Criar um novo esquema de forma interativa
openspec schema init my-workflow

# Fazer fork de um esquema existente para personalização
openspec schema fork spec-driven my-workflow

# Validar a estrutura do esquema antes de usar
openspec schema validate my-workflow
```

## Dicas

- Use `/opsx:explore` para refletir sobre uma ideia antes de confirmar uma alteração
- `/opsx:ff` quando você sabe o que quer, `/opsx:continue` quando estiver explorando
- Durante o `/opsx:apply`, se algo estiver errado — corrija o artefato e depois continue
- Tasks rastreiam o progresso por meio de checkboxes em `tasks.md`
- Verifique o status a qualquer momento: `openspec status --change "name"`

## Feedback

Isso está em estágio inicial. Isso é intencional — estamos aprendendo o que funciona.

Encontrou um bug? Tem ideias? Junte-se a nós no [Discord](https://discord.gg/YctCnvvshC) ou abra uma issue no [GitHub](https://github.com/Fission-AI/openspec/issues).