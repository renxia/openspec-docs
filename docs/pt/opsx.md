# Fluxo de Trabalho OPSX

> Feedback bem-vindo no [Discord](https://discord.gg/YctCnvvshC).

## O Que É?

O OPSX é agora o fluxo de trabalho padrão para o OpenSpec.

É um **fluxo de trabalho fluido e iterativo** para alterações no OpenSpec. Chega de fases rígidas — apenas ações que você pode tomar a qualquer momento.

## Por que isso existe

O fluxo de trabalho legado do OpenSpec funciona, mas está **bloqueado**:

- **As instruções são codificadas** — enterradas no TypeScript, você não pode alterá-las
- **Tudo ou nada** — um único comando grande cria tudo, não é possível testar peças individuais
- **Estrutura fixa** — mesmo fluxo de trabalho para todos, sem personalização
- **Caixa preta** — quando a saída da IA é ruim, você não pode ajustar os prompts

**OPSX abre isso.** Agora qualquer pessoa pode:

1. **Experimentar com instruções** — edite um template, veja se a IA faz melhor
2. **Testar granularmente** — valide as instruções de cada artefato independentemente
3. **Personalizar fluxos de trabalho** — defina seus próprios artefatos e dependências
4. **Iterar rapidamente** — altere um template, teste imediatamente, sem reconstrução

```
Fluxo de trabalho legado:              OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Codificado no pacote  │           │  schema.yaml           │◄── Você edita isso
│  (não pode alterar)    │           │  templates/*.md        │◄── Ou isso
│        ↓               │           │        ↓               │
│  Aguardar nova versão  │           │  Efeito instantâneo    │
│        ↓               │           │        ↓               │
│  Esperar que melhore   │           │  Teste você mesmo      │
└────────────────────────┘           └────────────────────────┘
```

**Isso é para todos:**
- **Equipes** — crie fluxos de trabalho que correspondam a como você realmente trabalha
- **Usuários avançados** — ajuste prompts para obter melhores saídas de IA para sua base de código
- **Contribuidores do OpenSpec** — experimente novas abordagens sem versões

Todos nós ainda estamos aprendendo o que funciona melhor. OPSX nos permite aprender juntos.

## A Experiência do Usuário

**O problema com fluxos de trabalho lineares:**
Você está "na fase de planejamento", depois "na fase de implementação", depois "concluído". Mas o trabalho real não funciona assim. Você implementa algo, percebe que seu design estava errado, precisa atualizar as especificações, continua implementando. Fases lineares lutam contra como o trabalho realmente acontece.

**Abordagem OPSX:**
- **Ações, não fases** — criar, implementar, atualizar, arquive — faça qualquer uma a qualquer momento
- **Dependências são facilitadoras** — elas mostram o que é possível, não o que é necessário em seguida

```
  proposta ──→ specs ──→ design ──→ tarefas ──→ implementar
```

## Configuração

```bash
# Certifique-se de ter o openspec instalado — as habilidades são geradas automaticamente
openspec init
```

Isso cria habilidades em `.claude/skills/` (ou equivalente) que os assistentes de codificação com IA detectam automaticamente.

Por padrão, o OpenSpec usa o perfil de fluxo de trabalho `core` (`propose`, `explore`, `apply`, `sync`, `archive`). Se você quiser os comandos de fluxo de trabalho expandidos (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`), configure-os com `openspec config profile` e aplique com `openspec update`.

Durante a configuração, você será solicitado a criar uma **configuração do projeto** (`openspec/config.yaml`). Isso é opcional, mas recomendado.

## Configuração do Projeto

A configuração do projeto permite definir padrões e injetar contexto específico do projeto em todos os artefatos.

### Criando Configuração

A configuração é criada durante `openspec init`, ou manualmente:

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
| `schema` | string | Esquema padrão para novas alterações (ex.: `spec-driven`) |
| `context` | string | Contexto do projeto injetado em todas as instruções de artefatos |
| `rules` | object | Reglas por artefato, chaveadas pelo ID do artefato |

### Como Funciona

**Precedência do esquema** (do mais alto para o mais baixo):
1. Flag da CLI (`--schema <nome>`)
2. Metadados da alteração (`.openspec.yaml` no diretório da alteração)
3. Configuração do projeto (`openspec/config.yaml`)
4. Padrão (`spec-driven`)

**Injeção de contexto:**
- O contexto é prefixado nas instruções de cada artefato
- Envolvido em tags `<context>...</context>`
- Ajuda a IA a entender as convenções do seu projeto

**Injeção de regras:**
- As regras são injetadas apenas para artefatos correspondentes
- Envolvidas em tags `<rules>...</rules>`
- Aparecem após o contexto, antes do template

### IDs de Artefatos por Esquema

**spec-driven** (padrão):
- `proposal` — Proposta de alteração
- `specs` — Especificações
- `design` — Design técnico
- `tasks` — Tarefas de implementação

### Validação da Configuração

- IDs de artefatos desconhecidos em `rules` geram avisos
- Nomes de esquemas são validados em relação aos esquemas disponíveis
- O contexto tem um limite de tamanho de 50KB
- YAML inválido é reportado com números de linha

### Solução de Problemas

**"ID de artefato desconhecido nas regras: X"**
- Verifique se os IDs dos artefatos correspondem ao seu esquema (veja a lista acima)
- Execute `openspec schemas --json` para ver os IDs dos artefatos para cada esquema

**Configuração não sendo aplicada:**
- Certifique-se de que o arquivo está em `openspec/config.yaml` (não `.yml`)
- Verifique a sintaxe YAML com um validador
- Alterações na configuração entram em vigor imediatamente (não é necessário reiniciar)

**Contexto muito grande:**
- O contexto é limitado a 50KB
- Resuma ou vincule a documentos externos em vez disso

## Comandos

| Comando | O que faz |
|---------|-----------|
| `/opsx:propose` | Cria uma alteração e gera artefatos de planejamento em uma etapa (caminho rápido padrão) |
| `/opsx:explore` | Pense nas ideias, investigue problemas, esclareça requisitos |
| `/opsx:new` | Inicia um novo esqueleto de alteração (fluxo de trabalho expandido) |
| `/opsx:continue` | Cria o próximo artefato (fluxo de trabalho expandido) |
| `/opsx:ff` | Avança rápido os artefatos de planejamento (fluxo de trabalho expandido) |
| `/opsx:apply` | Implementa tarefas, atualizando artefatos conforme necessário |
| `/opsx:verify` | Valida a implementação em relação aos artefatos (fluxo de trabalho expandido) |
| `/opsx:sync` | Sincroniza especificações delta com a principal (fluxo de trabalho padrão, opcional) |
| `/opsx:archive` | Arquiva quando concluído |
| `/opsx:bulk-archive` | Arquiva múltiplas alterações concluídas (fluxo de trabalho expandido) |
| `/opsx:onboard` | Passo a passo guiado de uma alteração ponta a ponta (fluxo de trabalho expandido) |

## Uso

### Explorar uma ideia
```
/opsx:explore
```
Pense nas ideias, investigue problemas, compare opções. Nenhuma estrutura necessária - apenas um parceiro de pensamento. Quando os insights cristalizarem, faça a transição para `/opsx:propose` (padrão) ou `/opsx:new`/`/opsx:ff` (expandido).

### Iniciar uma nova alteração
```
/opsx:propose
```
Cria a alteração e gera os artefatos de planejamento necessários antes da implementação.

Se você habilitou fluxos de trabalho expandidos, pode usar alternativamente:

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
Cria todos os artefatos de planejamento de uma vez. Use quando você tem uma imagem clara do que está construindo.

### Implementar (a parte fluida)
```
/opsx:apply
```
Trabalha nas tarefas, marcando-as como concluídas ao longo do caminho. Se você estiver lidando com múltiplas alterações, pode executar `/opsx:apply <nome>`; caso contrário, deve inferir da conversa e solicitar que você escolha se não puder determinar.

### Finalizar
```
/opsx:archive   # Mova para o arquivo quando concluído (solicita sincronização de especificações se necessário)
```

## Quando Atualizar vs. Começar do Zero

Você sempre pode editar sua proposta ou especificações antes da implementação. Mas quando o refinamento se torna "isso é um trabalho diferente"?

### O que uma Proposta Captura

Uma proposta define três coisas:
1. **Intenção** — Qual problema você está resolvendo?
2. **Escopo** — O que está dentro/fora dos limites?
3. **Abordagem** — Como você resolverá isso?

A questão é: o que mudou, e em que medida?

### Atualize a Alteração Existente Quando:

**Mesma intenção, execução refinada**
- Você descobre casos extremos que não considerou
- A abordagem precisa de ajustes, mas o objetivo permanece inalterado
- A implementação revela que o design estava ligeiramente errado

**Escopo se estreita**
- Você percebe que o escopo total é muito grande, quer lançar o MVP primeiro
- "Adicionar modo escuro" → "Adicionar alternância de modo escuro (preferência do sistema na v2)"

**Correções orientadas por aprendizado**
- A base de código não está estruturada como você pensava
- Uma dependência não funciona como esperado
- "Usar variáveis CSS" → "Usar o prefixo dark: do Tailwind em vez disso"

### Comece uma Nova Alteração Quando:

**A intenção mudou fundamentalmente**
- O problema em si é diferente agora
- "Adicionar modo escuro" → "Adicionar sistema de temas abrangente com cores, fontes, espaçamento personalizados"

**O escopo explodiu**
- A alteração cresceu tanto que é essencialmente um trabalho diferente
- A proposta original seria irreconhecível após as atualizações
- "Corrigir bug de login" → "Reescrever sistema de autenticação"

**O original é completável**
- A alteração original pode ser marcada como "concluída"
- O novo trabalho é independente, não um refinamento
- Complete "Adicionar modo escuro MVP" → Arquive → Nova alteração "Aprimorar modo escuro"

### As Heurísticas

```
                        ┌─────────────────────────────────────┐
                        │     Isso é o mesmo trabalho?        │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Mesma intenção?    Sobreposição >50%?   O original pode
             Mesmo problema?    Mesmo escopo?        ser "concluído" sem
                    │                  │          essas alterações?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         SIM               NÃO SIM          NÃO NÃO             SIM
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       ATUALIZAR        NOVA ATUALIZAR    NOVA ATUALIZAR       NOVA
```

| Teste | Atualizar | Nova Alteração |
|-------|-----------|----------------|
| **Identidade** | "Mesma coisa, refinada" | "Trabalho diferente" |
| **Sobreposição de escopo** | >50% de sobreposição | <50% de sobreposição |
| **Conclusão** | Não pode ser "concluído" sem alterações | Pode finalizar o original, o novo trabalho é independente |
| **Narrativa** | A cadeia de atualização conta uma história coerente | Os patches confundiriam mais do que esclareceriam |

### O Princípio

> **A atualização preserva o contexto. A nova alteração fornece clareza.**
>
> Escolha atualizar quando o histórico do seu pensamento for valioso.
>
> Escolha nova quando começar do zero seria mais claro do que corrigir.

Pense como em branches do git:
- Continue fazendo commits enquanto trabalha no mesmo recurso
- Comece uma nova branch quando for genuinamente um novo trabalho
- Às vezes, faça merge de um recurso parcial e comece do zero para a fase 2

## O que é diferente?

| | Legado (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Estrutura** | Um único documento de proposta grande | Artefatos discretos com dependências |
| **Fluxo de trabalho** | Fases lineares: planejar → implementar → arquivar | Ações fluidas — faça qualquer coisa a qualquer momento |
| **Iteração** | Difícil voltar atrás | Atualize artefatos conforme você aprende |
| **Personalização** | Estrutura fixa | Orientada por esquema (defina seus próprios artefatos) |

**A ideia principal:** o trabalho não é linear. O OPSX para de fingir que é.

## Aprofundamento na Arquitetura

Esta seção explica como o OPSX funciona por baixo do capô e como ele se compara ao fluxo de trabalho legado.
Os exemplos nesta seção utilizam o conjunto de comandos expandido (`new`, `continue`, etc.); os usuários padrão do `core` podem mapear o mesmo fluxo para `propose → apply → sync → archive`.

### Filosofia: Fases vs Ações

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LEGADO WORKFLOW                                      │
│                    (Fase-Bloqueado, Tudo-ou-Nada)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │             │
│   │    PHASE     │      │    PHASE     │      │    PHASE     │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Cria TODOS os artefatos de uma vez                                    │
│   • Não pode voltar para atualizar especificações durante a implementação │
│   • Portões de fase forçam progressão linear                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                            OPSX WORKFLOW                                     │
│                      (Ações Fluidas, Iterativo)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           AÇÕES (não fases)               │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              qualquer ordem                │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Cria artefatos um por vez OU avança rapidamente                        │
│   • Atualiza especificações/design/tarefas durante a implementação         │
│   • Dependências habilitam progresso, fases não existem                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Arquitetura de Componentes

**Fluxo de trabalho legado** utiliza templates codificados em TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      COMPONENTES DO WORKFLOW LEGADO                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Templates Codificados (strings TypeScript)                                │
│                    │                                                        │
│                    ▼                                                        │
│   Configuradores/adaptadores específicos de ferramenta                      │
│                    │                                                        │
│                    ▼                                                        │
│   Arquivos de Comando Gerados (.claude/commands/openspec/*.md)              │
│                                                                             │
│   • Estrutura fixa, sem consciência de artefatos                           │
│   • Mudança requer modificação de código + reconstrução                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** utiliza esquemas externos e um motor de grafo de dependências:

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
│   │      generates: specs/**/*.md  ◄── Padrões Glob                    │   │
│   │      requires: [proposal]      ◄── Habilita após proposal           │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Motor de Grafo de Artefatos                                               │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Ordenação topológica (ordenação por dependência)                 │   │
│   │  • Detecção de estado (existência no sistema de arquivos)           │   │
│   │  • Geração de instruções ricas (templates + contexto)               │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Arquivos de Habilidade (.claude/skills/openspec-*/SKILL.md)               │
│                                                                             │
│   • Compatível entre editores (Claude Code, Cursor, Windsurf)              │
│   • Habilidades consultam a CLI para dados estruturados                    │
│   • Totalmente personalizável via arquivos de esquema                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Modelo de Grafo de Dependências

Os artefatos formam um grafo acíclico direcionado (DAG). As dependências são **habilitadoras**, não portões:

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
                          │ APPLY PHASE  │
                          │ (requires:   │
                          │  tasks)      │
                          └──────────────┘
```

**Transições de estado:**

```
   BLOCKED ────────────────► READY ────────────────► DONE
      │                        │                       │
   Dependências             Todas as               Arquivo existe
   faltando                 dependências           no sistema de
                            estão DONE             arquivos
```

### Fluxo de Informação

**Fluxo de trabalho legado** — agente recebe instruções estáticas:

```
  Usuário: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
│  Instruções estáticas:                  │
│  • Crie proposal.md                     │
│  • Crie tasks.md                        │
│  • Crie design.md                       │
│  • Crie specs/<capability>/spec.md      │
│                                         │
│  Sem consciência do que existe ou       │
│  dependências entre artefatos           │
└─────────────────────────────────────────┘
           │
           ▼
  Agente cria TODOS os artefatos de uma vez
```

**OPSX** — agente consulta por contexto rico:

```
  Usuário: "/opsx:continue"
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
│  Passo 2: Obter instruções ricas para artefato pronto                   │
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
│  Passo 3: Ler dependências → Criar UM artefato → Mostrar o que é desbloqueado │
└──────────────────────────────────────────────────────────────────────────┘
```

### Modelo de Iteração

**Fluxo de trabalho legado** — iteração desajeitada:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Espere, o design está errado"
       │               │
       │               ├── Opções:
       │               │   • Editar arquivos manualmente (quebra contexto)
       │               │   • Abandonar e começar de novo
       │               │   • Empurrar e corrigir depois
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
      │                └── Cria UM artefato, mostra o que é desbloqueado
      │
      └── Estrutura a mudança, aguarda direção
```

### Esquemas Personalizados

Crie fluxos de trabalho personalizados usando os comandos de gerenciamento de esquema:

```bash
# Crie um novo esquema do zero (interativo)
openspec schema init my-workflow

# Ou bifurque um esquema existente como ponto de partida
openspec schema fork spec-driven my-workflow

# Valide a estrutura do seu esquema
openspec schema validate my-workflow

# Veja de onde um esquema é resolvido (útil para depuração)
openspec schema which my-workflow
```

Os esquemas são armazenados em `openspec/schemas/` (local do projeto, controle de versão) ou `~/.local/share/openspec/schemas/` (global do usuário).

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

**Grafo de Dependências:**
```
   research ──► proposal ──► tasks
```

### Resumo

| Aspecto | Legado | OPSX |
|---------|----------|------|
| **Templates** | TypeScript codificado | YAML + Markdown externo |
| **Dependências** | Nenhuma (tudo de uma vez) | DAG com ordenação topológica |
| **Estado** | Modelo mental baseado em fase | Existência no sistema de arquivos |
| **Personalização** | Editar fonte, reconstruir | Criar schema.yaml |
| **Iteração** | Bloqueado por fase | Fluido, edite qualquer coisa |
| **Suporte a Editor** | Configurador/adaptador específico de ferramenta | Único diretório de habilidades |

## Esquemas

Os esquemas definem quais artefatos existem e suas dependências. Atualmente disponíveis:

- **spec-driven** (padrão): proposta → especificações → design → tarefas

```bash
# Listar esquemas disponíveis
openspec schemas

# Ver todos os esquemas com suas fontes de resolução
openspec schema which --all

# Criar um novo esquema interativamente
openspec schema init my-workflow

# Bifurcar um esquema existente para personalização
openspec schema fork spec-driven my-workflow

# Validar a estrutura do esquema antes de usar
openspec schema validate my-workflow
```

## Dicas

- Use `/opsx:explore` para pensar uma ideia antes de se comprometer com uma mudança
- `/opsx:ff` quando você sabe o que quer, `/opsx:continue` quando estiver explorando
- Durante `/opsx:apply`, se algo estiver errado — corrija o artefato, depois continue
- As tarefas acompanham o progresso através de caixas de seleção em `tasks.md`
- Verifique o status a qualquer momento: `openspec status --change "nome"`

## Feedback

Isso é básico. Isso é intencional — estamos aprendendo o que funciona.

Encontrou um bug? Tem ideias? Junte-se a nós no [Discord](https://discord.gg/YctCnvvshC) ou abra uma issue no [GitHub](https://github.com/Fission-AI/openspec/issues).