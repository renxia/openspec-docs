# Fluxo de Trabalho OPSX

> Feedback é bem-vindo no [Discord](https://discord.gg/YctCnvvshC).

## O Que É?

O OPSX é agora o fluxo de trabalho padrão para o OpenSpec.

É um **fluxo de trabalho fluido e iterativo** para alterações no OpenSpec. Chega de fases rígidas — apenas ações que você pode realizar a qualquer momento.

## Por que isso existe

O fluxo de trabalho legado do OpenSpec funciona, mas está **trancado**:

- **Instruções são hardcoded** — enterradas no TypeScript, você não pode alterá-las
- **Tudo ou nada** — um comando grande cria tudo, não é possível testar peças individuais
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
│  Hardcoded no pacote   │           │  schema.yaml           │◄── Você edita isto
│  (não pode alterar)    │           │  templates/*.md        │◄── Ou isto
│        ↓               │           │        ↓               │
│  Esperar nova versão   │           │  Efeito instantâneo    │
│        ↓               │           │        ↓               │
│  Esperar que melhore   │           │  Teste você mesmo      │└────────────────────────┘           └────────────────────────┘
```

**Isto é para todos:**
- **Equipes** — crie fluxos de trabalho que correspondam a como você realmente trabalha
- **Usuários avançados** — ajuste prompts para obter melhores saídas da IA para sua base de código
- **Contribuidores do OpenSpec** — experimente novas abordagens sem lançamentos

Todos nós ainda estamos aprendendo o que funciona melhor. OPSX nos permite aprender juntos.

## A Experiência do Usuário

**O problema com fluxos de trabalho lineares:**
Você está "na fase de planejamento", depois "na fase de implementação", depois "concluído". Mas o trabalho real não funciona assim. Você implementa algo, percebe que seu design estava errado, precisa atualizar as especificações, continua implementando. Fases lineares lutam contra como o trabalho realmente acontece.

**Abordagem OPSX:**
- **Ações, não fases** — criar, implementar, atualizar, arquivar — faça qualquer uma a qualquer momento
- **Dependências são facilitadoras** — elas mostram o que é possível, não o que é necessário em seguida

```
  proposta ──→ specs ──→ design ──→ tarefas ──→ implementar
```

## Configuração

```bash
# Certifique-se de ter o openspec instalado — as habilidades são geradas automaticamente
openspec init
```

Isso cria habilidades em `.claude/skills/` (ou equivalente) que os assistentes de código IA detectam automaticamente.

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
| `schema` | string | Schema padrão para novas mudanças (ex., `spec-driven`) |
| `context` | string | Contexto do projeto injetado em todas as instruções de artefatos |
| `rules` | object | Reglas por artefato, chaveadas pelo ID do artefato |

### Como Funciona

**Precedência do Schema** (maior para menor):
1. Flag da CLI (`--schema <nome>`)
2. Metadados da mudança (`.openspec.yaml` no diretório da mudança)
3. Configuração do projeto (`openspec/config.yaml`)
4. Padrão (`spec-driven`)

**Injeção de contexto:**
- O contexto é adicionado no início das instruções de cada artefato
- Envolvido em tags `<context>...</context>`
- Ajuda a IA a entender as convenções do seu projeto

**Injeção de regras:**
- As regras são injetadas apenas para artefatos correspondentes
- Envolvidas em tags `<rules>...</rules>`
- Aparecem após o contexto, antes do template

### IDs de Artefatos por Schema

**spec-driven** (padrão):
- `proposal` — Proposta de mudança
- `specs` — Especificações
- `design` — Design técnico
- `tasks` — Tarefas de implementação

### Validação da Configuração

- IDs de artefatos desconhecidos em `rules` geram avisos
- Nomes de schema são validados contra schemas disponíveis
- O contexto tem um limite de tamanho de 50KB
- YAML inválido é reportado com números de linha

### Solução de Problemas

**"ID de artefato desconhecido nas regras: X"**
- Verifique se os IDs de artefatos correspondem ao seu schema (veja a lista acima)
- Execute `openspec schemas --json` para ver os IDs de artefatos para cada schema

**Configuração não sendo aplicada:**
- Certifique-se de que o arquivo está em `openspec/config.yaml` (não `.yml`)
- Verifique a sintaxe YAML com um validador
- As alterações de configuração entram em vigor imediatamente (não é necessário reiniciar)

**Contexto muito grande:**
- O contexto é limitado a 50KB
- Resuma ou vincule a documentos externos em vez disso

## Comandos

| Comando | O que faz |
|---------|-----------|
| `/opsx:propose` | Cria uma mudança e gera artefatos de planejamento em uma etapa (caminho rápido padrão) |
| `/opsx:explore` | Pense em ideias, investigue problemas, esclareça requisitos |
| `/opsx:new` | Inicia um novo esqueleto de mudança (fluxo de trabalho expandido) |
| `/opsx:continue` | Cria o próximo artefato (fluxo de trabalho expandido) |
| `/opsx:ff` | Avança rápido os artefatos de planejamento (fluxo de trabalho expandido) |
| `/opsx:apply` | Implementa tarefas, atualizando artefatos conforme necessário |
| `/opsx:verify` | Valida a implementação em relação aos artefatos (fluxo de trabalho expandido) |
| `/opsx:sync` | Sincroniza specs delta para a principal (fluxo de trabalho padrão, opcional) |
| `/opsx:archive` | Arquiva quando concluído |
| `/opsx:bulk-archive` | Arquiva múltiplas mudanças concluídas (fluxo de trabalho expandido) |
| `/opsx:onboard` | Passo a passo guiado de uma mudança ponta a ponta (fluxo de trabalho expandido) |

## Uso

### Explorar uma ideia
```
/opsx:explore
```
Pense em ideias, investigue problemas, compare opções. Nenhuma estrutura necessária - apenas um parceiro de pensamento. Quando os insights cristalizarem, transicione para `/opsx:propose` (padrão) ou `/opsx:new`/`/opsx:ff` (expandido).

### Iniciar uma nova mudança
```
/opsx:propose
```
Cria a mudança e gera os artefatos de planejamento necessários antes da implementação.

Se você habilitou fluxos de trabalho expandidos, pode usar em vez disso:

```text
/opsx:new        # apenas esqueleto
/opsx:continue   # cria um artefato por vez
/opsx:ff         # cria todos os artefatos de planejamento de uma vez
```

### Criar artefatos
```
/opsx:continue
```
Mostra o que está pronto para criar com base nas dependências, depois cria um artefato. Use repetidamente para construir sua mudança incrementalmente.

```
/opsx:ff add-dark-mode
```
Cria todos os artefatos de planejamento de uma vez. Use quando você tem uma imagem clara do que está construindo.

### Implementar (a parte fluida)
```
/opsx:apply
```
Trabalha nas tarefas, marcando-as como concluídas conforme avança. Se você estiver lidando com múltiplas mudanças, pode executar `/opsx:apply <nome>`; caso contrário, deve inferir da conversa e solicitar que você escolha se não puder determinar.

### Finalizar
```
/opsx:archive   # Mova para o arquivo quando concluído (solicita sincronização de specs se necessário)
```

## Quando Atualizar vs. Começar do Zero

Você sempre pode editar sua proposta ou especificações antes da implementação. Mas quando o refinamento se torna "isso é trabalho diferente"?

### O que uma Proposta Captura

Uma proposta define três coisas:
1. **Intenção** — Qual problema você está resolvendo?
2. **Escopo** — O que está dentro/fora dos limites?
3. **Abordagem** — Como você vai resolver?

A questão é: o que mudou, e em que medida?

### Atualize a Mudança Existente Quando:

**Mesma intenção, execução refinada**
- Você descobre casos extremos que não considerou
- A abordagem precisa de ajustes, mas o objetivo permanece inalterado
- A implementação revela que o design estava ligeiramente errado

**Escopo se estreita**
- Você percebe que o escopo completo é muito grande, quer lançar o MVP primeiro
- "Adicionar modo escuro" → "Adicionar alternância de modo escuro (preferência do sistema na v2)"

**Correções orientadas por aprendizado**
- A base de código não está estruturada como você pensava
- Uma dependência não funciona como esperado
- "Usar variáveis CSS" → "Usar o prefixo dark: do Tailwind em vez disso"

### Comece uma Nova Mudança Quando:

**A intenção mudou fundamentalmente**
- O problema em si é diferente agora
- "Adicionar modo escuro" → "Adicionar sistema de temas abrangente com cores, fontes, espaçamento personalizados"

**O escopo explodiu**
- A mudança cresceu tanto que é essencialmente trabalho diferente
- A proposta original seria irreconhecível após atualizações
- "Corrigir bug de login" → "Reescrever sistema de autenticação"

**O original é completável**
- A mudança original pode ser marcada como "concluída"
- O novo trabalho é independente, não um refinamento
- Concluir "Adicionar modo escuro MVP" → Arquivar → Nova mudança "Melhorar modo escuro"

### As Heurísticas

```
                        ┌─────────────────────────────────────┐
                        │     Isso é o mesmo trabalho?        │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Mesma intenção?    >50% sobreposição?  O original pode
             Mesmo problema?    Mesmo escopo?      ser "concluído" sem
                    │                  │          essas mudanças?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         SIM               NÃO SIM          NÃO NÃO             SIM
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       ATUALIZAR         NOVO ATUALIZAR    NOVO ATUALIZAR       NOVO
```

| Teste | Atualizar | Nova Mudança |
|-------|-----------|--------------|
| **Identidade** | "Mesma coisa, refinada" | "Trabalho diferente" |
| **Sobreposição de escopo** | >50% de sobreposição | <50% de sobreposição |
| **Conclusão** | Não pode ser "concluído" sem mudanças | Pode finalizar o original, novo trabalho é independente |
| **História** | A cadeia de atualizações conta uma história coerente | Os patches confundiriam mais do que esclareceriam |

### O Princípio

> **Atualizar preserva contexto. Nova mudança fornece clareza.**
>
> Escolha atualizar quando o histórico do seu pensamento é valioso.
>
> Escolha novo quando começar do zero seria mais claro do que corrigir.

Pense como branches do git:
- Continue fazendo commits enquanto trabalha no mesmo recurso
- Comece uma nova branch quando for genuinamente trabalho novo
- Às vezes, mescle um recurso parcial e comece do zero para a fase 2

## O que é diferente?

| | Legado (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Estrutura** | Um único documento de proposta grande | Artefatos discretos com dependências |
| **Fluxo de trabalho** | Fases lineares: planejar → implementar → arquivar | Ações fluidas — faça qualquer coisa a qualquer momento |
| **Iteração** | Difícil voltar atrás | Atualize artefatos conforme você aprende |
| **Personalização** | Estrutura fixa | Orientada por esquema (defina seus próprios artefatos) |

**A principal percepção:** o trabalho não é linear. O OPSX para de fingir que é.

## Aprofundamento na Arquitetura

Esta seção explica como o OPSX funciona internamente e como ele se compara ao fluxo de trabalho legado.
Os exemplos nesta seção usam o conjunto de comandos expandido (`new`, `continue`, etc.); os usuários padrão do `core` podem mapear o mesmo fluxo para `propose → apply → sync → archive`.

### Filosofia: Fases vs Ações

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUXO DE TRABALHO LEGADO                            │
│                    (Fase Travada, Tudo ou Nada)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │    FASE DE   │ ───► │    FASE DE   │ ───► │    FASE DE   │             │
│   │  PLANEJAMENTO│      │ IMPLEMENTAÇÃO│      │  ARQUIVAMENTO│             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Cria TODOS os artefatos de uma vez                                     │
│   • Não é possível voltar para atualizar especificações durante a          │
│     implementação                                                          │
│   • Portões de fase forçam progressão linear                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                            FLUXO DE TRABALHO OPSX                           │
│                      (Ações Fluidas, Iterativo)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           AÇÕES (não fases)                │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              qualquer ordem                │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Cria artefatos um de cada vez OU avança rapidamente                    │
│   • Atualiza especificações/design/tarefas durante a implementação          │
│   • Dependências habilitam progresso, fases não existem                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Arquitetura dos Componentes

**O fluxo de trabalho legado** usa templates codificados diretamente em TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      COMPONENTES DO FLUXO LEGADO                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Templates Codificados (strings TypeScript)                                │
│                    │                                                        │
│                    ▼                                                        │
│   Configuradores/adaptadores específicos da ferramenta                      │
│                    │                                                        │
│                    ▼                                                        │
│   Arquivos de Comando Gerados (.claude/commands/openspec/*.md)              │
│                                                                             │
│   • Estrutura fixa, sem consciência de artefatos                           │
│   • Alteração requer modificação de código + rebuild                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** usa esquemas externos e um motor de grafo de dependências:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPONENTES DO OPSX                                 │
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
│   • Compatível entre editores (Claude Code, Cursor, Windsurf)               │
│   • Habilidades consultam CLI para dados estruturados                       │
│   • Totalmente personalizável via arquivos de esquema                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Modelo de Grafo de Dependências

Os artefatos formam um grafo acíclico dirigido (DAG). As dependências são **habilitadoras**, não portões:

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
   Dependências              Todas as deps           Arquivo existe
   faltando                  estão CONCLUÍDAS         no sistema de arquivos
```

### Fluxo de Informação

**Fluxo de trabalho legado** — o agente recebe instruções estáticas:

```
  Usuário: "/openspec:proposal"
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
  │  dependências entre artefatos           │
  └─────────────────────────────────────────┘
           │
           ▼
  Agente cria TODOS os artefatos de uma vez
```

**OPSX** — o agente consulta por contexto rico:

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
  │  Passo 2: Obter instruções ricas para artefato pronto                    │
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

**Fluxo de trabalho legado** — iteração desconfortável:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Espere, o design está errado"
       │               │
       │               ├── Opções:
       │               │   • Editar arquivos manualmente (quebra o contexto)
       │               │   • Abandonar e começar de novo
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
      │                │            Basta editar design.md
      │                │            e continuar!
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
# Criar um novo esquema do zero (interativo)
openspec schema init my-workflow

# Ou bifurcar um esquema existente como ponto de partida
openspec schema fork spec-driven my-workflow

# Validar a estrutura do seu esquema
openspec schema validate my-workflow

# Ver de onde um esquema é resolvido (útil para depuração)
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
|---------|----------|------|
| **Templates** | TypeScript codificado diretamente | YAML + Markdown externo |
| **Dependências** | Nenhuma (tudo de uma vez) | DAG com ordenação topológica |
| **Estado** | Modelo mental baseado em fases | Existência no sistema de arquivos |
| **Personalização** | Editar código-fonte, rebuild | Criar schema.yaml |
| **Iteração** | Fase travada | Fluido, editar qualquer coisa |
| **Suporte a Editores** | Configurador/adaptador específico da ferramenta | Diretório único de habilidades |

## Esquemas

Esquemas definem quais artefatos existem e suas dependências. Atualmente disponíveis:

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

- Use `/opsx:explore` para pensar em uma ideia antes de se comprometer com uma mudança
- `/opsx:ff` quando você sabe o que quer, `/opsx:continue` quando estiver explorando
- Durante `/opsx:apply`, se algo estiver errado — conserte o artefato, depois continue
- As tarefas acompanham o progresso por meio de caixas de seleção em `tasks.md`
- Verifique o status a qualquer momento: `openspec status --change "nome"`

## Feedback

Isto é uma versão inicial. Isso é intencional — estamos aprendendo o que funciona.

Encontrou um bug? Tem ideias? Junte-se a nós no [Discord](https://discord.gg/YctCnvvshC) ou abra uma issue no [GitHub](https://github.com/Fission-AI/openspec/issues).