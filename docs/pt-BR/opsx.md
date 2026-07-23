# Fluxo de Trabalho OPSX
> Feedback é bem-vindo no [Discord](https://discord.gg/YctCnvvshC).
## O que é?
O OPSX é agora o fluxo de trabalho padrão para o OpenSpec.
É um **fluxo de trabalho fluido e iterativo** para alterações no OpenSpec. Não há mais fases rígidas — apenas ações que você pode realizar a qualquer momento.

## Por Que Isso Existe

O fluxo de trabalho legado do OpenSpec funciona, mas está **bloqueado**:

- **Instruções são codificadas** — enterradas no TypeScript, você não pode alterá-las
- **Tudo ou nada** — um comando grande cria tudo, não é possível testar peças individuais
- **Estrutura fixa** — mesmo fluxo de trabalho para todos, sem personalização
- **Caixa preta** — quando a saída da IA é ruim, você não pode ajustar os prompts

**O OPSX abre isso.** Agora qualquer pessoa pode:

1. **Experimentar com instruções** — edite um modelo, veja se a IA faz melhor
2. **Testar de forma granular** — valide as instruções de cada artefato independentemente
3. **Personalizar fluxos de trabalho** — defina seus próprios artefatos e dependências
4. **Iterar rapidamente** — altere um modelo, teste imediatamente, sem reconstrução

```
Fluxo de trabalho legado:                      OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Hardcoded in package  │           │  schema.yaml           │◄── Você edita isso
│  (can't change)        │           │  templates/*.md        │◄── Ou isso
│        ↓               │           │        ↓               │
│  Wait for new release  │           │  Instant effect        │
│        ↓               │           │        ↓               │
│  Hope it's better      │           │  Test it yourself      │
└────────────────────────┘           └────────────────────────┘
```

**Isto é para todos:**
- **Equipes** — criem fluxos de trabalho que correspondam à forma como vocês realmente trabalham
- **Usuários avançados** — ajustem prompts para obter melhores saídas de IA para sua base de código
- **Contribuidores do OpenSpec** — experimentem novas abordagens sem lançamentos

Todos nós ainda estamos aprendendo o que funciona melhor. O OPSX nos permite aprender juntos.

## A Experiência do Usuário

**O problema com fluxos de trabalho lineares:**
Você está "na fase de planejamento", depois "na fase de implementação", depois "pronto". Mas o trabalho real não funciona assim. Você implementa algo, percebe que seu design estava errado, precisa atualizar especificações, continuar implementando. Fases lineares lutam contra a forma como o trabalho realmente acontece.

**Abordagem do OPSX:**
- **Ações, não fases** — criar, implementar, atualizar, arquivar — faça qualquer uma delas a qualquer momento
- **Dependências são habilitadoras** — elas mostram o que é possível, não o que é necessário a seguir

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
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

A configuração de projeto permite que você defina padrões e injete contexto específico do projeto em todos os artefatos.

### Criando a Configuração

A configuração é criada durante o `openspec init`, ou manualmente:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Stack de tecnologia: TypeScript, React, Node.js
  Convenções de API: RESTful, respostas JSON
  Testes: Vitest para testes unitários, Playwright para e2e
  Estilo: ESLint com Prettier, TypeScript estrito

rules:
  proposal:
    - Incluir plano de reversão
    - Identificar equipes afetadas
  specs:
    - Usar formato Dado/Quando/Então para cenários
  design:
    - Incluir diagramas de sequência para fluxos complexos
```

### Campos de Configuração

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `schema` | string | Esquema padrão para novas alterações (ex: `spec-driven`) |
| `context` | string | Contexto do projeto injetado em todas as instruções de artefatos |
| `rules` | object | Regras por artefato, identificadas pelo ID do artefato |

### Como Funciona

**Precedência de esquema** (do maior para o menor):
1. Sinalizador CLI (`--schema <name>`)
2. Metadados de alteração (`.openspec.yaml` no diretório de alteração)
3. Configuração de projeto (`openspec/config.yaml`)
4. Padrão (`spec-driven`)

**Injeção de contexto:**
- O contexto é prefixado em todas as instruções de cada artefato
- Envolto em tags `<context>...</context>`
- Ajuda a IA a entender as convenções do seu projeto

**Injeção de regras:**
- As regras são injetadas apenas para artefatos correspondentes
- Envoltas em tags `<rules>...</rules>`
- Aparecem após o contexto, antes do modelo

### IDs de Artefatos por Esquema

**spec-driven** (padrão):
- `proposal` — Proposta de alteração
- `specs` — Especificações
- `design` — Design técnico
- `tasks` — Tarefas de implementação

### Validação de Configuração

- IDs de artefatos desconhecidos em `rules` geram avisos
- Nomes de esquemas são validados contra esquemas disponíveis
- O contexto tem um limite de tamanho de 50KB
- YAML inválido é relatado com números de linha

### Solução de Problemas

**"ID de artefato desconhecido em regras: X"**
- Verifique se os IDs de artefatos correspondem ao seu esquema (veja a lista acima)
- Execute `openspec schemas --json` para ver os IDs de artefatos para cada esquema

**Configuração não está sendo aplicada:**
- Certifique-se de que o arquivo está em `openspec/config.yaml` (não `.yml`)
- Verifique a sintaxe YAML com um validador
- As alterações de configuração entram em vigor imediatamente (não é necessário reiniciar)

**Contexto muito grande:**
- O contexto é limitado a 50KB
- Resuma ou faça link para documentação externa

## Comandos

| Comando | O que faz |
|---------|-----------|
| `/opsx:propose` | Cria uma alteração e gera artefatos de planejamento em uma etapa (caminho rápido padrão) |
| `/opsx:explore` | Pensa através de ideias, investiga problemas, esclarece requisitos |
| `/opsx:new` | Inicia um novo esqueleto de alteração (fluxo de trabalho expandido) |
| `/opsx:continue` | Cria o próximo artefato (fluxo de trabalho expandido) |
| `/opsx:ff` | Avança rapidamente os artefatos de planejamento (fluxo de trabalho expandido) |
| `/opsx:apply` | Implementa tarefas, atualizando artefatos conforme necessário |
| `/opsx:update` | Revisa os artefatos de planejamento de uma alteração e mantém a coerência |
| `/opsx:verify` | Valida a implementação contra os artefatos (fluxo de trabalho expandido) |
| `/opsx:sync` | Sincroniza especificações delta para o principal (fluxo de trabalho padrão, opcional) |
| `/opsx:archive` | Arquiva quando pronto |
| `/opsx:bulk-archive` | Arquiva múltiplas alterações concluídas (fluxo de trabalho expandido) |
| `/opsx:onboard` | Passo a passo guiado de uma alteração ponta a ponta (fluxo de trabalho expandido) |

## Uso

### Explore uma ideia

```
/opsx:explore
```

Pense através de ideias, investigue problemas, compare opções. Nenhuma estrutura necessária - apenas um parceiro de reflexão. Quando os insights se cristalizarem, transicione para `/opsx:propose` (padrão) ou `/opsx:new`/`/opsx:ff` (expandido).

### Inicie uma nova alteração

```
/opsx:propose
```

Cria a alteração e gera os artefatos de planejamento necessários antes da implementação.

Se você habilitou fluxos de trabalho expandidos, você pode usar alternativamente:

```text
/opsx:new        # apenas esqueleto
/opsx:continue   # cria um artefato por vez
/opsx:ff         # cria todos os artefatos de planejamento de uma vez
```

### Criar artefatos

```
/opsx:continue
```

Mostra o que está pronto para criar com base nas dependências, depois cria um artefato. Use repetidamente para construir sua alteração incrementalmente.

```
/opsx:ff add-dark-mode
```

Cria todos os artefatos de planejamento de uma vez. Use quando você tiver uma imagem clara do que está construindo.

### Implementar (a parte fluida)

```
/opsx:apply
```

Trabalha através das tarefas, marcando-as como concluídas conforme você avança. Se você estiver lidando com múltiplas alterações, você pode executar `/opsx:apply <name>`; caso contrário, ele deve inferir da conversa e solicitar que você escolha se não conseguir determinar.

### Atualizando uma alteração

```
/opsx:update add-dark-mode - we're storing the theme in a cookie now
```

Revisa os artefatos de planejamento existentes da alteração e mantém a coerência - em qualquer direção (uma edição de design pode se propagar de volta para a proposta). Apenas artefatos de planejamento: ele nunca edita código, e nunca cria artefatos ausentes (isso é `/opsx:continue`). Cada edição é confirmada com você primeiro. Se a alteração já foi implementada, ele recomenda `/opsx:apply` para que o código alcance o plano revisado. Se sua revisão alterar a *intenção* da alteração, comece do zero em vez disso - veja [Quando Atualizar vs. Começar do Zero](#when-to-update-vs-start-fresh).

### Finalizar

```
/opsx:archive   # Mover para o arquivo quando pronto (solicita a sincronização de especificações se necessário)
```

## Quando Atualizar vs. Começar do Zero

Você sempre pode editar sua proposta ou especificações antes da implementação. Mas quando o refinamento se torna "este é um trabalho diferente"?

### O Que Uma Proposta Captura

Uma proposta define três coisas:
1. **Intenção** — Que problema você está resolvendo?
2. **Escopo** — O que está dentro/fora dos limites?
3. **Abordagem** — Como você vai resolver?

A questão é: o que mudou, e quanto?

### Atualize a Alteração Existente Quando:

**Mesma intenção, execução refinada**
- Você descobre casos de borda que não considerou
- A abordagem precisa de ajustes, mas o objetivo permanece inalterado
- A implementação revela que o design estava um pouco errado

**O escopo diminui**
- Você percebe que o escopo completo é muito grande, quer enviar o MVP primeiro
- "Adicionar modo escuro" → "Adicionar alternância de modo escuro (preferência do sistema na v2)"

**Correções orientadas por aprendizado**
- A base de código não está estruturada como você pensava
- Uma dependência não funciona como esperado
- "Usar variáveis CSS" → "Usar o prefixo dark: do Tailwind em vez disso"

### Inicie uma Nova Alteração Quando:

**Intenção fundamentalmente alterada**
- O problema em si é diferente agora
- "Adicionar modo escuro" → "Adicionar sistema de tema abrangente com cores, fontes e espaçamento personalizados"

**O escopo explodiu**
- A alteração cresceu tanto que é essencialmente um trabalho diferente
- A proposta original seria irreconhecível após atualizações
- "Corrigir bug de login" → "Reescrever sistema de autenticação"

**O original é completável**
- A alteração original pode ser marcada como "concluída"
- O novo trabalho se sustenta sozinho, não é um refinamento
- Conclua "Adicionar MVP do modo escuro" → Arquivar → Nova alteração "Melhorar modo escuro"

### As Heurísticas

```
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

| Teste | Atualizar | Nova Alteração |
|-------|-----------|----------------|
| **Identidade** | "Mesma coisa, refinada" | "Trabalho diferente" |
| **Sobreposição de escopo** | >50% de sobreposição | <50% de sobreposição |
| **Conclusão** | Não pode ser "concluída" sem alterações | Pode terminar o original, o novo trabalho se sustenta sozinho |
| **História** | A cadeia de atualizações conta uma história coerente | Os patches confundiriam mais do que esclareceriam |

### O Princípio

> **Atualizar preserva o contexto. Nova alteração fornece clareza.**
>
> Escolha atualizar quando a história do seu pensamento for valiosa.
> Escolha novo quando começar do zero seria mais claro do que aplicar patches.

Pense nisso como branches do git:
- Continue commitando enquanto trabalha na mesma funcionalidade
- Inicie um novo branch quando for um trabalho genuinamente novo
- Às vezes mescle uma funcionalidade parcial e comece do zero para a fase 2

## O Que é Diferente?

| | Legado (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Estrutura** | Um grande documento de proposta | Artefatos discretos com dependências |
| **Fluxo de trabalho** | Fases lineares: planejar → implementar → arquivar | Ações fluidas — faça qualquer coisa a qualquer momento |
| **Iteração** | Desajeitado para voltar | Atualize artefatos conforme você aprende |
| **Personalização** | Estrutura fixa | Orientado por esquema (defina seus próprios artefatos) |

**O insight principal:** o trabalho não é linear. O OPSX para de fingir que é.

## Mergulho Profundo na Arquitetura

Esta seção explica como o OPSX funciona internamente e como ele se compara ao fluxo de trabalho legado.
Os exemplos nesta seção usam o conjunto de comandos expandido (`new`, `continue`, etc.); usuários padrão de `core` podem mapear o mesmo fluxo para `propose → apply → sync → archive`.

### Filosofia: Fases vs Ações

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUXO DE TRABALHO LEGADO                             │
│                    (Travado em Fases, Tudo ou Nada)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │  PLANEJAMENTO│ ───► │IMPLEMENTAÇÃO │ ───► │ARQUIVAMENTO │             │
│   │    FASE      │      │    FASE      │      │    FASE      │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Cria TODOS os artefatos de uma vez                                      │
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

O **fluxo de trabalho legado** usa templates hardcoded em TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      COMPONENTES DO FLUXO DE TRABALHO LEGADO                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Templates Hardcoded (strings TypeScript)                                  │
│                    │                                                        │
│                    ▼                                                        │
│   Configuradores/adaptadores específicos da ferramenta                      │
│                    │                                                        │
│                    ▼                                                        │
│   Arquivos de Comando Gerados (.claude/commands/openspec/*.md)              │
│                                                                             │
│   • Estrutura fixa, sem conscientização de artefatos                        │
│   • Alteração requer modificação de código + reconstrução                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

O **OPSX** usa esquemas externos e um motor de grafo de dependências:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPONENTES DO OPSX                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Definições de Esquema (YAML)                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Dependências                     │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Padrões glob                     │   │
│   │      requires: [proposal]      ◄── Habilitado após proposta         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Motor de Grafo de Artefatos                                               │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Ordenação topológica (ordenamento por dependência)               │   │
│   │  • Detecção de estado (existência no sistema de arquivos)           │   │
│   │  • Geração de instruções ricas (templates + contexto)               │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Arquivos de Habilidade (.claude/skills/openspec-*/SKILL.md)               │
│                                                                             │
│   • Compatível entre editores (Claude Code, Cursor, Windsurf)               │
│   • CLI de consulta de habilidades para dados estruturados                  │
│   • Totalmente personalizável via arquivos de esquema                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Modelo de Grafo de Dependência

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
                          │ FASE DE      │
                          │ APLICAÇÃO    │
                          │ (requires:   │
                          │  tasks)      │
                          └──────────────┘
```

**Transições de estado:**

```
   BLOQUEADO ────────────────► PRONTO ────────────────► CONCLUÍDO
      │                        │                       │
   Dependências            Todas as deps           Arquivo existe
   faltando                estão CONCLUÍDAS        no sistema de arquivos
```

### Fluxo de Informação

**Fluxo de trabalho legado** — o agente recebe instruções estáticas:

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
  │  Sem conhecimento do que existe ou      │
  │  dependências entre artefatos           │
  └─────────────────────────────────────────┘
           │
           ▼
  O agente cria TODOS os artefatos de uma vez
```

**OPSX** — o agente consulta para obter contexto rico:

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
  │  │      {"id": "specs", "status": "ready"},      ◄── Primeiro pronto  │  │
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
  │           desbloqueado                                                    │
  └──────────────────────────────────────────────────────────────────────────┘
```

### Modelo de Iteração

**Fluxo de trabalho legado** — difícil de iterar:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Espere, o design está errado"
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
      │                │            Basta editar o design.md
      │                │            e continuar!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply retoma
      │                │         de onde você parou
      │                │
      │                └── Cria UM artefato, mostra o que foi desbloqueado
      │
      └── Cria o esqueleto da alteração, aguarda sua direção
```

### Esquemas personalizados

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

Os esquemas são armazenados em `openspec/schemas/` (local do projeto, com controle de versão) ou `~/.local/share/openspec/schemas/` (global do usuário).

**Estrutura de esquema:**
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
  - id: research        # Adicionado antes do proposal
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Agora depende de research

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**Grafo de Dependências:**
```
   research ──► proposal ──► tasks
```

### Resumo

| Aspecto | Legado | OPSX |
|--------|----------|------|
| **Modelos** | TypeScript embutido | YAML + Markdown externos |
| **Dependências** | Nenhuma (tudo de uma vez) | DAG com ordenação topológica |
| **Estado** | Modelo mental baseado em fases | Existência no sistema de arquivos |
| **Personalização** | Editar o código-fonte, reconstruir | Criar schema.yaml |
| **Iteração** | Travado por fases | Fluido, edite qualquer coisa |
| **Suporte a Editores** | Configurador/adaptadores específicos da ferramenta | Diretório único de skills |

## Esquemas

Esquemas definem quais artefatos existem e suas dependências. Disponíveis atualmente:

- **spec-driven** (padrão): proposal → specs → design → tasks

```bash
# Liste os esquemas disponíveis
openspec schemas

# Veja todos os esquemas com suas fontes de resolução
openspec schema which --all

# Crie um novo esquema de forma interativa
openspec schema init my-workflow

# Faça um fork de um esquema existente para personalização
openspec schema fork spec-driven my-workflow

# Valide a estrutura do esquema antes de usar
openspec schema validate my-workflow
```

## Dicas

- Use `/opsx:explore` para pensar em uma ideia antes de se comprometer com uma alteração
- Use `/opsx:ff` quando você sabe o que quer, `/opsx:continue` quando estiver explorando
- Durante o `/opsx:apply`, se algo estiver errado — corrija o artefato e depois continue
- As tarefas acompanham o progresso por meio de caixas de seleção no `tasks.md`
- Verifique o status a qualquer momento: `openspec status --change "name"`

## Feedback

Isso é uma versão preliminar. Isso é intencional — estamos aprendendo o que funciona.

Encontrou um bug? Tem ideias? Junte-se a nós no [Discord](https://discord.gg/YctCnvvshC) ou abra uma issue no [GitHub](https://github.com/Fission-AI/openspec/issues).