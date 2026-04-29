# Fluxo de Trabalho OPSX

> Opiniões são bem-vindas no [Discord](https://discord.gg/YctCnvvshC).

## O Que É?

O OPSX é agora o fluxo de trabalho padrão para o OpenSpec.

É um **fluxo de trabalho fluido e iterativo** para mudanças no OpenSpec. Sem mais fases rígidas — apenas ações que você pode realizar a qualquer momento.

## Por Que Isso Existe

O fluxo de trabalho legado do OpenSpec funciona, mas está **travado**:

- **Instruções são codificadas** — enterradas em TypeScript, você não pode alterá-las
- **Tudo ou nada** — um único comando grande cria tudo, não é possível testar partes individuais
- **Estrutura fixa** — mesmo fluxo de trabalho para todos, sem personalização
- **Caixa preta** — quando a saída da IA é ruim, você não pode ajustar os prompts

**OPSX abre isso.** Agora qualquer pessoa pode:

1. **Experimentar com instruções** — editar um modelo, ver se a IA faz melhor
2. **Testar granularmente** — validar as instruções de cada artefato independentemente
3. **Personalizar fluxos de trabalho** — definir seus próprios artefatos e dependências
4. **Iterar rapidamente** — mudar um modelo, testar imediatamente, sem reconstruir

```
Fluxo de trabalho legado:              OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Codificado no pacote  │           │  schema.yaml           │◄── Você edita isso
│  (não pode mudar)      │           │  templates/*.md        │◄── Ou isso
│        ↓               │           │        ↓               │
│  Esperar nova versão   │           │  Efeito instantâneo    │
│        ↓               │           │        ↓               │
│  Esperar que melhore   │           │  Teste você mesmo      │
└────────────────────────┘           └────────────────────────┘
```

**Isso é para todos:**
- **Equipes** — criar fluxos de trabalho que correspondam à forma como você realmente trabalha
- **Usuários avançados** — ajustar prompts para obter melhores saídas de IA para seu codebase
- **Contribuidores do OpenSpec** — experimentar novas abordagens sem lançamentos

Ainda estamos todos aprendendo o que funciona melhor. OPSX nos permite aprender juntos.

## A Experiência do Usuário

**O problema com fluxos de trabalho lineares:**
Você está "na fase de planejamento", depois "na fase de implementação", depois "concluído". Mas o trabalho real não funciona assim. Você implementa algo, percebe que seu design estava errado, precisa atualizar as especificações, continua implementando. Fases lineares lutam contra a forma como o trabalho realmente acontece.

**Abordagem do OPSX:**
- **Ações, não fases** — criar, implementar, atualizar, arquivar — faça qualquer uma delas a qualquer momento
- **Dependências são habilitadoras** — elas mostram o que é possível, não o que é obrigatório a seguir

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Configuração

```bash
# Certifique-se de ter o openspec instalado — as habilidades são geradas automaticamente
openspec init
```

Isso cria habilidades em `.claude/skills/` (ou equivalente) que assistentes de codificação com IA detectam automaticamente.

Por padrão, o OpenSpec usa o perfil de fluxo de trabalho `core` (`propose`, `explore`, `apply`, `archive`). Se você quiser os comandos de fluxo de trabalho expandido (`new`, `continue`, `ff`, `verify`, `sync`, `bulk-archive`, `onboard`), configure-os com `openspec config profile` e aplique com `openspec update`.

Durante a configuração, você será solicitado a criar uma **configuração do projeto** (`openspec/config.yaml`). Isso é opcional, mas recomendado.

## Configuração do Projeto

A configuração do projeto permite definir padrões e injetar contexto específico do projeto em todos os artefatos.

### Criando a Configuração

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

### Campos da Configuração

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `schema` | string | Schema padrão para novas mudanças (ex.: `spec-driven`) |
| `context` | string | Contexto do projeto injetado nas instruções de todos os artefatos |
| `rules` | object | Regras por artefato, indexadas pelo ID do artefato |

### Como Funciona

**Precedência do schema** (maior para menor):
1. Flag da CLI (`--schema <nome>`)
2. Metadados da mudança (`.openspec.yaml` no diretório da mudança)
3. Configuração do projeto (`openspec/config.yaml`)
4. Padrão (`spec-driven`)

**Injeção de contexto:**
- O contexto é anteposto a cada instrução de artefato
- Envolto em tags `<context>...</context>`
- Ajuda a IA a entender as convenções do seu projeto

**Injeção de regras:**
- As regras são injetadas apenas para artefatos correspondentes
- Envolvidas em tags `<rules>...</rules>`
- Aparecem após o contexto, antes do modelo

### IDs de Artefatos por Schema

**spec-driven** (padrão):
- `proposal` — Proposta de mudança
- `specs` — Especificações
- `design` — Design técnico
- `tasks` — Tarefas de implementação

### Validação da Configuração

- IDs de artefatos desconhecidos em `rules` geram avisos
- Nomes de schema são validados em relação aos schemas disponíveis
- O contexto tem um limite de tamanho de 50KB
- YAML inválido é reportado com números de linha

### Solução de Problemas

**"ID de artefato desconhecido nas regras: X"**
- Verifique se os IDs dos artefatos correspondem ao seu schema (veja a lista acima)
- Execute `openspec schemas --json` para ver os IDs dos artefatos para cada schema

**Configuração não está sendo aplicada:**
- Certifique-se de que o arquivo está em `openspec/config.yaml` (não `.yml`)
- Verifique a sintaxe YAML com um validador
- Alterações na configuração têm efeito imediato (não é necessário reiniciar)

**Contexto muito grande:**
- O contexto é limitado a 50KB
- Resuma ou vincule a documentação externa em vez disso

## Comandos

| Comando | O que faz |
|---------|-----------|
| `/opsx:propose` | Criar uma mudança e gerar artefatos de planejamento em uma etapa (caminho rápido padrão) |
| `/opsx:explore` | Pensar em ideias, investigar problemas, esclarecer requisitos |
| `/opsx:new` | Iniciar uma nova estrutura de mudança (fluxo de trabalho expandido) |
| `/opsx:continue` | Criar o próximo artefato (fluxo de trabalho expandido) |
| `/opsx:ff` | Avançar rapidamente os artefatos de planejamento (fluxo de trabalho expandido) |
| `/opsx:apply` | Implementar tarefas, atualizando artefatos conforme necessário |
| `/opsx:verify` | Validar a implementação em relação aos artefatos (fluxo de trabalho expandido) |
| `/opsx:sync` | Sincronizar especificações delta com o principal (fluxo de trabalho expandido, opcional) |
| `/opsx:archive` | Arquivar quando concluído |
| `/opsx:bulk-archive` | Arquivar múltiplas mudanças concluídas (fluxo de trabalho expandido) |
| `/opsx:onboard` | Visita guiada de uma mudança ponta a ponta (fluxo de trabalho expandido) |

## Uso

### Explorar uma ideia
```
/opsx:explore
```
Pense em ideias, investigue problemas, compare opções. Nenhuma estrutura necessária - apenas um parceiro de pensamento. Quando os insights se cristalizarem, transicione para `/opsx:propose` (padrão) ou `/opsx:new`/`/opsx:ff` (expandido).

### Iniciar uma nova mudança
```
/opsx:propose
```
Cria a mudança e gera os artefatos de planejamento necessários antes da implementação.

Se você habilitou fluxos de trabalho expandidos, pode usar em vez disso:

```text
/opsx:new        # apenas estrutura
/opsx:continue   # criar um artefato por vez
/opsx:ff         # criar todos os artefatos de planejamento de uma vez
```

### Criar artefatos
```
/opsx:continue
```
Mostra o que está pronto para ser criado com base nas dependências, e então cria um artefato. Use repetidamente para construir sua mudança incrementalmente.

```
/opsx:ff add-dark-mode
```
Cria todos os artefatos de planejamento de uma vez. Use quando você tem uma visão clara do que está construindo.

### Implementar (a parte fluida)
```
/opsx:apply
```
Trabalha através das tarefas, marcando-as conforme você avança. Se você estiver gerenciando múltiplas mudanças, pode executar `/opsx:apply <nome>`; caso contrário, deve inferir da conversa e solicitar que você escolha se não conseguir determinar.

### Concluir
```
/opsx:archive   # Mover para arquivo quando concluído (solicita sincronizar especificações se necessário)
```

## Quando Atualizar vs. Começar do Zero

Você sempre pode editar sua proposta ou especificações antes da implementação. Mas quando o refinamento se torna "isso é um trabalho diferente"?

### O que uma Proposta Captura

Uma proposta define três coisas:
1. **Intenção** — Que problema você está resolvendo?
2. **Escopo** — O que está dentro/fora dos limites?
3. **Abordagem** — Como você vai resolver?

A questão é: o que mudou, e em quanto?

### Atualize a Mudança Existente Quando:

**Mesma intenção, execução refinada**
- Você descobre casos extremos que não considerou
- A abordagem precisa de ajustes, mas o objetivo permanece inalterado
- A implementação revela que o design estava ligeiramente errado

**Escopo diminui**
- Você percebe que o escopo total é grande demais, quer lançar o MVP primeiro
- "Adicionar modo escuro" → "Adicionar alternância de modo escuro (preferência do sistema na v2)"

**Correções baseadas em aprendizado**
- O codebase não está estruturado como você pensava
- Uma dependência não funciona como esperado
- "Usar variáveis CSS" → "Usar o prefixo dark: do Tailwind em vez disso"

### Comece uma Nova Mudança Quando:

**Intenção fundamentalmente mudada**
- O problema em si é diferente agora
- "Adicionar modo escuro" → "Adicionar um sistema de temas abrangente com cores, fontes e espaçamento personalizados"

**Escopo explodiu**
- A mudança cresceu tanto que é essencialmente um trabalho diferente
- A proposta original seria irreconhecível após as atualizações
- "Corrigir bug de login" → "Reescrever sistema de autenticação"

**Original é finalizável**
- A mudança original pode ser marcada como "concluída"
- O novo trabalho é independente, não é um refinamento
- Concluir "Adicionar modo escuro MVP" → Arquivar → Nova mudança "Aprimorar modo escuro"

### As Heurísticas

```
                        ┌─────────────────────────────────────┐
                        │     É o mesmo trabalho?             │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Mesma intenção?    >50% sobreposição?   O original pode
             Mesmo problema?    Mesmo escopo?        ser "concluído" sem
                    │                  │              essas mudanças?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         SIM               NÃO SIM           NÃO NÃO              SIM
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       ATUALIZAR         NOVA ATUALIZAR    NOVA ATUALIZAR       NOVA
```

| Teste | Atualizar | Nova Mudança |
|-------|-----------|--------------|
| **Identidade** | "Mesma coisa, refinada" | "Trabalho diferente" |
| **Sobreposição de escopo** | >50% sobreposto | <50% sobreposto |
| **Conclusão** | Não pode ser "concluído" sem mudanças | Pode finalizar o original, novo trabalho é independente |
| **Narrativa** | A cadeia de atualizações conta uma história coerente | Patches confundiriam mais do que esclareceriam |

### O Princípio

> **Atualizar preserva contexto. Nova mudança fornece clareza.**
>
> Escolha atualizar quando o histórico do seu pensamento é valioso.
> Escolha nova quando começar do zero seria mais claro do que corrigir.

Pense nisso como branches no git:
- Continue commitando enquanto trabalha na mesma funcionalidade
- Inicie um novo branch quando for genuinamente um trabalho novo
- Às vezes faça merge de uma funcionalidade parcial e comece do zero para a fase 2

## O que é diferente?

| | Legado (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Estrutura** | Um único documento de proposta | Artefatos discretos com dependências |
| **Fluxo de trabalho** | Fases lineares: planejar → implementar → arquivar | Ações fluidas — faça qualquer coisa a qualquer momento |
| **Iteração** | Difícil voltar atrás | Atualize os artefatos à medida que você aprende |
| **Personalização** | Estrutura fixa | Guiada por esquema (defina seus próprios artefatos) |

**A principal constatação:** o trabalho não é linear. O OPSX para de fingir que é.

## Aprofundamento na Arquitetura

Esta seção explica como o OPSX funciona internamente e como se compara ao fluxo de trabalho legado.
Os exemplos nesta seção usam o conjunto de comandos expandido (`new`, `continue`, etc.); os usuários padrão do `core` podem mapear o mesmo fluxo para `propose → apply → archive`.

### Filosofia: Fases vs Ações

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUXO DE TRABALHO LEGADO                            │
│                    (Bloqueado por Fase, Tudo ou Nada)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │    FASE DE   │ ───► │    FASE DE   │ ───► │    FASE DE   │             │
│   │   PLANEJAMENTO│      │ IMPLEMENTAÇÃO│      │  ARQUIVAMENTO│             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Cria TODOS os artefatos de uma vez                                    │
│   • Não pode voltar para atualizar especificações durante a implementação  │
│   • Portões de fase impõem progressão linear                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUXO DE TRABALHO OPSX                               │
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
│   • Atualiza especificações/design/tarefas durante a implementação         │
│   • Dependências habilitam progressão, fases não existem                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Arquitetura de Componentes

O **fluxo de trabalho legado** usa templates codificados em TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  COMPONENTES DO FLUXO DE TRABALHO LEGADO                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Templates Codificados (strings TypeScript)                                │
│                    │                                                        │
│                    ▼                                                        │
│   Configuradores/adaptadores específicos da ferramenta                     │
│                    │                                                        │
│                    ▼                                                        │
│   Arquivos de Comando Gerados (.claude/commands/openspec/*.md)              │
│                                                                             │
│   • Estrutura fixa, sem consciência de artefatos                           │
│   • Alterações requerem modificação de código + reconstrução                │
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
│   │      requires: [proposal]      ◄── Habilita após proposal          │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Motor de Grafo de Artefatos                                               │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Ordenação topológica (ordenação por dependência)                 │   │
│   │  • Detecção de estado (existência no sistema de arquivos)           │   │
│   │  • Geração de instruções ricas (templates + contexto)              │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Arquivos de Habilidade (.claude/skills/openspec-*/SKILL.md)               │
│                                                                             │
│   • Compatível entre editores (Claude Code, Cursor, Windsurf)              │
│   • Habilidades consultam CLI para dados estruturados                      │
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
              (requer:                    (requer:
               proposal)                   proposal)
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                               tasks
                           (requer:
                           specs, design)
                                  │
                                  ▼
                          ┌──────────────┐
                          │  FASE APPLY  │
                          │  (requer:    │
                          │   tasks)     │
                          └──────────────┘
```

**Transições de estado:**

```
   BLOQUEADO ────────────────► PRONTO ────────────────► CONCLUÍDO
      │                        │                       │
   Dependências              Todas as deps           Arquivo existe
   faltantes                 estão CONCLUÍDAS        no sistema de arquivos
```

### Fluxo de Informação

**Fluxo de trabalho legado** — agente recebe instruções estáticas:

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

**OPSX** — agente consulta para contexto rico:

```
  Usuário: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Passo 1: Consultar estado atual                                        │
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
  │  Passo 3: Ler dependências → Criar UM artefato → Mostrar o que foi       │
  │           desbloqueado                                                   │
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
       │               │   • Abandonar e recomeçar
       │               │   • Seguir em frente e corrigir depois
       │               │
       │               └── Nenhum mecanismo oficial "voltar"
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
      │                └── Cria UM artefato, mostra o que foi desbloqueado
      │
      └── Prepara a mudança, aguarda direção
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

Os esquemas são armazenados em `openspec/schemas/` (local do projeto, controlado por versão) ou `~/.local/share/openspec/schemas/` (global para o usuário).

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
|--------|----------|------|
| **Templates** | TypeScript codificado | YAML + Markdown externos |
| **Dependências** | Nenhuma (tudo de uma vez) | DAG com ordenação topológica |
| **Estado** | Modelo mental baseado em fases | Existência no sistema de arquivos |
| **Personalização** | Editar código-fonte, reconstruir | Criar schema.yaml |
| **Iteração** | Bloqueado por fase | Fluida, editar qualquer coisa |
| **Suporte a Editor** | Configuradores/adaptadores específicos da ferramenta | Diretório único de habilidades |

## Esquemas

Os esquemas definem quais artefatos existem e suas dependências. Atualmente disponíveis:

- **spec-driven** (padrão): proposal → specs → design → tasks

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

- Use `/opsx:explore` para pensar em uma ideia antes de se comprometer com uma alteração
- Use `/opsx:ff` quando você sabe o que quer, e `/opsx:continue` quando estiver explorando
- Durante `/opsx:apply`, se algo estiver errado — corrija o artefato e então continue
- As tarefas acompanham o progresso via caixas de seleção em `tasks.md`
- Verifique o status a qualquer momento: `openspec status --change "name"`

## Feedback

Isto é rudimentary. Isso é intencional — estamos aprendendo o que funciona.

Encontrou um bug? Tem ideias? Junte-se a nós no [Discord](https://discord.gg/YctCnvvshC) ou abra uma issue no [GitHub](https://github.com/Fission-AI/openspec/issues).