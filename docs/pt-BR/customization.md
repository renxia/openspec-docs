# Personalização

O OpenSpec oferece três níveis de personalização:

| Nível | O que faz | Ideal para |
|-------|-----------|------------|
| **Configuração do Projeto** | Define padrões, injeta contexto/regras | A maioria das equipes |
| **Schemas Personalizados** | Define seus próprios artefatos de fluxo de trabalho | Equipes com processos únicos |
| **Substituições Globais** | Compartilha schemas entre todos os projetos | Usuários avançados |

---

## Configuração do Projeto

O arquivo `openspec/config.yaml` é a maneira mais fácil de personalizar o OpenSpec para sua equipe. Ele permite:

- **Definir um schema padrão** - Pule `--schema` em cada comando
- **Injetar contexto do projeto** - A IA vê sua stack tecnológica, convenções, etc.
- **Adicionar regras por artefato** - Regras personalizadas para artefatos específicos

### Configuração Rápida

```bash
openspec init
```

Isso o guia na criação de uma configuração interativamente. Ou crie uma manualmente:

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

**Schema padrão:**

```bash
# Sem configuração
openspec new change my-feature --schema spec-driven

# Com configuração - o schema é automático
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
- **Regras** APENAS aparecem para o artefato correspondente

### Ordem de Resolução do Schema

Quando o OpenSpec precisa de um schema, ele verifica nesta ordem:

1. Flag da CLI: `--schema <nome>`
2. Metadados da mudança (`.openspec.yaml` na pasta da mudança)
3. Configuração do projeto (`openspec/config.yaml`)
4. Padrão (`spec-driven`)

---

## Schemas Personalizados

Quando a configuração do projeto não é suficiente, crie seu próprio schema com um fluxo de trabalho completamente personalizado. Schemas personalizados ficam no diretório `openspec/schemas/` do seu projeto e são versionados com seu código.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Configuração do projeto
│   ├── schemas/           # Schemas personalizados ficam aqui
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Suas mudanças
└── src/
```

### Fazer Fork de um Schema Existente

A maneira mais rápida de personalizar é fazer fork de um schema integrado:

```bash
openspec schema fork spec-driven my-workflow
```

Isso copia todo o schema `spec-driven` para `openspec/schemas/my-workflow/` onde você pode editá-lo livremente.

**O que você obtém:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Definição do fluxo de trabalho
└── templates/
    ├── proposal.md       # Template para o artefato de proposta
    ├── spec.md           # Template para especificações
    ├── design.md         # Template para design
    └── tasks.md          # Template para tarefas
```

Agora edite `schema.yaml` para alterar o fluxo de trabalho, ou edite os templates para alterar o que a IA gera.

### Criar um Schema do Zero

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

### Estrutura do Schema

Um schema define os artefatos do seu fluxo de trabalho e como eles dependem uns dos outros:

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
      - proposal    # Can't create design until proposal exists

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

**Campos-chave:**

| Campo | Finalidade |
|-------|------------|
| `id` | Identificador único, usado em comandos e regras |
| `generates` | Nome do arquivo de suporte (suporta globs como `specs/**/*.md`) |
| `template` | Arquivo de template no diretório `templates/` |
| `instruction` | Instruções da IA para criar este artefato |
| `requires` | Dependências - quais artefatos devem existir primeiro |

### Templates

Templates são arquivos markdown que guiam a IA. Eles são injetados no prompt ao criar aquele artefato.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

Os templates podem incluir:
- Cabeçalhos de seção que a IA deve preencher
- Comentários HTML com orientação para a IA
- Formatos de exemplo mostrando a estrutura esperada

### Validar Seu Schema

Antes de usar um schema personalizado, valide-o:

```bash
openspec schema validate my-workflow
```

Isso verifica:
- A sintaxe de `schema.yaml` está correta
- Todos os templates referenciados existem
- Não há dependências circulares
- Os IDs dos artefatos são válidos

### Usar Seu Schema Personalizado

Uma vez criado, use seu schema com:

```bash
# Especifique no comando
openspec new change feature --schema my-workflow

# Ou defina como padrão no config.yaml
schema: my-workflow
```

### Depurar a Resolução do Schema

Não tem certeza de qual schema está sendo usado? Verifique com:

```bash
# Veja de onde um schema específico é resolvido
openspec schema which my-workflow

# Liste todos os schemas disponíveis
openspec schema which --all
```

A saída mostra se é do seu projeto, diretório de usuário ou do pacote:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Nota:** O OpenSpec também suporta schemas no nível do usuário em `~/.local/share/openspec/schemas/` para compartilhamento entre projetos, mas schemas no nível do projeto em `openspec/schemas/` são recomendados pois são versionados com seu código.

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

Faça fork do padrão e adicione uma etapa de revisão:

```bash
openspec schema fork spec-driven with-review
```

Então edite `schema.yaml` para adicionar:

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
    # ... existing tasks config ...
    requires:
      - specs
      - design
      - review    # Now tasks require review too
```

---

## Schemas da Comunidade

O OpenSpec também suporta schemas mantidos pela comunidade distribuídos via repositórios independentes. Eles fornecem fluxos de trabalho opinativos que integram o OpenSpec com outras ferramentas ou sistemas, de forma semelhante ao [catálogo de extensões da comunidade do github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) para o spec-kit.

Schemas da comunidade não são incorporados ao núcleo do OpenSpec — eles vivem em seus próprios repositórios com seu próprio ciclo de lançamento. Para usar um, copie o pacote do schema para o diretório `openspec/schemas/<nome-do-schema>/` do seu projeto (o README de cada repositório tem instruções de instalação).

| Schema | Mantenedor | Repositório | Descrição |
|--------|-----------|-------------|-----------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Integra a governança de artefatos do OpenSpec com as habilidades de execução do [obra/superpowers](https://github.com/obra/superpowers) (brainstorming, writing-plans, TDD via subagents, code review, finishing). Adiciona um artefato `retrospective` com foco em evidências, preenchendo uma lacuna que o Superpowers não cobre nativamente. |

> Quer contribuir com um schema da comunidade? Abra uma issue com um link para seu repositório, ou envie um PR adicionando uma linha a esta tabela.

---

## Veja Também

- [Referência da CLI: Comandos de Schema](cli.md#schema-commands) - Documentação completa dos comandos