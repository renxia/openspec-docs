# Personalização

O OpenSpec fornece três níveis de personalização:

| Nível | O que faz | Melhor para |
|-------|-----------|-------------|
| **Configuração do Projeto** | Definir padrões, injetar contexto/regras | Maioria das equipes |
| **Esquemas Personalizados** | Definir seus próprios artefatos de fluxo de trabalho | Equipes com processos exclusivos |
| **Substituições Globais** | Compartilhar esquemas em todos os projetos | Usuários avançados |

---

## Configuração do Projeto

O arquivo `openspec/config.yaml` é a maneira mais fácil de personalizar o OpenSpec para sua equipe. Ele permite que você:

- **Definir um esquema padrão** - Ignorar `--schema` em todos os comandos
- **Injetar contexto do projeto** - A IA vê sua pilha tecnológica, convenções, etc.
- **Adicionar regras por artefato** - Regras personalizadas para artefatos específicos

### Configuração Rápida

```bash
openspec init
```

Isso guia você na criação de uma configuração interativamente. Ou crie uma manualmente:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API style: RESTful, documented in docs/api.md
  Testing: Jest + React Testing Library
  We value backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones
```

### Como Funciona

**Esquema padrão:**

```bash
# Sem configuração
openspec new change my-feature --schema spec-driven

# Com configuração - o esquema é automático
openspec new change my-feature
```

**Injeção de contexto e regras:**

Ao gerar qualquer artefato, seu contexto e regras são injetados no prompt da IA:

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Include rollback plan
- Identify affected teams
</rules>

<template>
[Schema's built-in template]
</template>
```

- **Contexto** aparece em TODOS os artefatos
- **Regras** aparecem SOMENTE para o artefato correspondente

### Ordem de Resolução de Esquema

Quando o OpenSpec precisa de um esquema, ele verifica nesta ordem:

1. Sinalizador CLI: `--schema <name>`
2. Metadados da alteração (`.openspec.yaml` na pasta da alteração)
3. Configuração do projeto (`openspec/config.yaml`)
4. Padrão (`spec-driven`)

---

## Esquemas Personalizados

Quando a configuração do projeto não for suficiente, crie seu próprio esquema com um fluxo de trabalho completamente personalizado. Esquemas personalizados residem no diretório `openspec/schemas/` do seu projeto e são controlados por versão junto com seu código.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Configuração do projeto
│   ├── schemas/           # Esquemas personalizados residem aqui
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Suas alterações
└── src/
```

### Bifurcar um Esquema Existente

A maneira mais rápida de personalizar é bifurcar um esquema embutido:

```bash
openspec schema fork spec-driven my-workflow
```

Isso copia todo o esquema `spec-driven` para `openspec/schemas/my-workflow/` onde você pode editá-lo livremente.

**O que você obtém:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Definição do fluxo de trabalho
└── templates/
    ├── proposal.md       # Modelo para artefato de proposta
    ├── spec.md           # Modelo para especificações
    ├── design.md         # Modelo para design
    └── tasks.md          # Modelo para tarefas
```

Agora edite `schema.yaml` para alterar o fluxo de trabalho, ou edite os modelos para alterar o que a IA gera.

### Criar um Esquema do Zero

Para um fluxo de trabalho completamente novo:

```bash
# Interativo
openspec schema init research-first

# Não interativo
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Estrutura do Esquema

Um esquema define os artefatos no seu fluxo de trabalho e como eles dependem uns dos outros:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: My team's custom workflow

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initial proposal document
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Technical design
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal    # Não é possível criar o design até que a proposta exista

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Campos principais:**

| Campo | Propósito |
|-------|-----------|
| `id` | Identificador exclusivo, usado em comandos e regras |
| `generates` | Nome do arquivo de saída (suporta globs como `specs/**/*.md`) |
| `template` | Arquivo de modelo no diretório `templates/` |
| `instruction` | Instruções de IA para criar este artefato |
| `requires` | Dependências - quais artefatos devem existir primeiro |

### Modelos

Modelos são arquivos markdown que guiam a IA. Eles são injetados no prompt ao criar esse artefato.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explique a motivação para esta alteração. Que problema ela resolve? -->

## What Changes

<!-- Descreva o que mudará. Seja específico sobre novas capacidades ou modificações. -->

## Impact

<!-- Código afetado, APIs, dependências, sistemas -->
```

Os modelos podem incluir:
- Cabeçalhos de seção que a IA deve preencher
- Comentários HTML com orientações para a IA
- Formatos de exemplo mostrando a estrutura esperada

### Validar Seu Esquema

Antes de usar um esquema personalizado, valide-o:

```bash
openspec schema validate my-workflow
```

Isso verifica:
- A sintaxe de `schema.yaml` está correta
- Todos os modelos referenciados existem
- Nenhuma dependência circular
- Os IDs de artefato são válidos

### Usar Seu Esquema Personalizado

Uma vez criado, use seu esquema com:

```bash
# Especifique no comando
openspec new change feature --schema my-workflow

# Ou defina como padrão no config.yaml
schema: my-workflow
```

### Depurar a Resolução de Esquema

Não tem certeza de qual esquema está sendo usado? Verifique com:

```bash
# Veja de onde um esquema específico é resolvido
openspec schema which my-workflow

# Liste todos os esquemas disponíveis
openspec schema which --all
```

A saída mostra se é do seu projeto, diretório do usuário ou do pacote:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Nota:** O OpenSpec também suporta esquemas em nível de usuário em `~/.local/share/openspec/schemas/` para compartilhar entre projetos, mas esquemas em nível de projeto em `openspec/schemas/` são recomendados pois são controlados por versão junto com seu código.

---

## Exemplos

### Fluxo de Trabalho de Iteração Rápida

Um fluxo de trabalho mínimo para iterações rápidas:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Quick proposal
    template: proposal.md
    instruction: |
      Create a brief proposal for this change.
      Focus on what and why, skip detailed specs.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Adicionando um Artefato de Revisão

Bifurque o padrão e adicione uma etapa de revisão:

```bash
openspec schema fork spec-driven with-review
```

Depois edite `schema.yaml` para adicionar:

```yaml
  - id: review
    generates: review.md
    description: Pre-implementation review checklist
    template: review.md
    instruction: |
      Create a review checklist based on the design.
      Include security, performance, and testing considerations.
    requires:
      - design

  - id: tasks
    # ... configuração existente de tarefas ...
    requires:
      - specs
      - design
      - review    # Agora as tarefas também requerem revisão
```

---

## Esquemas da Comunidade

O OpenSpec também suporta esquemas mantidos pela comunidade distribuídos via repositórios independentes. Estes fornecem fluxos de trabalho opinativos que integram o OpenSpec com outras ferramentas ou sistemas, semelhante a como o [catálogo de extensões comunitárias do github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) funciona para o spec-kit.

Esquemas da comunidade não são incluídos no núcleo do OpenSpec — eles residem em seus próprios repositórios com sua própria cadência de lançamento. Para usar um, copie o pacote de esquema para o diretório `openspec/schemas/<schema-name>/` do seu projeto (o README de cada repositório tem instruções de instalação).

| Esquema | Mantenedor | Repositório | Descrição |
|--------|-----------|-------------|-----------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Integra a governança de artefatos do OpenSpec com as habilidades de execução do [obra/superpowers](https://github.com/obra/superpowers) (brainstorming, writing-plans, TDD via subagentes, revisão de código, finalização). Adiciona um artefato `retrospective` baseado em evidências que preenche uma lacuna que o Superpowers não cobre nativamente. |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | Fluxo de trabalho primeiro para PM. Executa o pipeline de planejamento do [nanopm](https://github.com/nmrtn/nanopm) (auditoria → estratégia → roadmap → PRD) a montante da implementação. Conecta o planejamento de produto ao fluxo de trabalho de engenharia orientado a especificações do OpenSpec. Os artefatos são lidos de `.nanopm/` se presentes — a proposta usa a auditoria como fonte, o design usa a estratégia como fonte, e as tarefas usam a divisão do PRD como fonte. |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | Runbooks de teste end-to-end em nível de capacidade. Cada capacidade obtém uma especificação imutável, um modelo de tarefas imutável e um registro de execução com data e hora por execução. As asserções são apenas comportamentos observáveis (status HTTP, corpo da resposta, estado persistido — nunca substrings de log); cada execução registra início/fim UTC, duração e consumo estimado de tokens de LLM. |

> Quer contribuir com um esquema da comunidade? Abra uma issue com um link para seu repositório, ou envie um PR adicionando uma linha a esta tabela.

---

## Veja Também

- [Referência da CLI: Comandos de Esquema](cli.md#schema-commands) - Documentação completa dos comandos