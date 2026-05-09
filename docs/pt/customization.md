# Personalização

O OpenSpec oferece três níveis de personalização:

| Nível | O que faz | Ideal para |
|-------|-----------|------------|
| **Configuração do Projeto** | Define padrões, injeta contexto/regras | A maioria das equipes |
| **Esquemas Personalizados** | Define seus próprios artefatos de fluxo de trabalho | Equipes com processos únicos |
| **Substituições Globais** | Compartilha esquemas entre todos os projetos | Usuários avançados |

---

## Configuração do Projeto

O arquivo `openspec/config.yaml` é a maneira mais fácil de personalizar o OpenSpec para sua equipe. Ele permite:

- **Definir um esquema padrão** - Pule `--schema` em cada comando
- **Injetar contexto do projeto** - A IA vê sua pilha tecnológica, convenções, etc.
- **Adicionar regras por artefato** - Regras personalizadas para artefatos específicos

### Configuração Rápida

```bash
openspec init
```

Isso o guia na criação interativa de uma configuração. Ou crie uma manualmente:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Pilha tecnológica: TypeScript, React, Node.js, PostgreSQL
  Estilo de API: RESTful, documentada em docs/api.md
  Testes: Jest + React Testing Library
  Valorizamos a compatibilidade retroativa para todas as APIs públicas

rules:
  proposal:
    - Incluir plano de rollback
    - Identificar equipes afetadas
  specs:
    - Usar formato Dado/Quando/Então
    - Referenciar padrões existentes antes de inventar novos
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
Pilha tecnológica: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Incluir plano de rollback
- Identificar equipes afetadas
</rules>

<template>
[Template interno do esquema]
</template>
```

- **Contexto** aparece em TODOS os artefatos
- **Regras** aparecem APENAS para o artefato correspondente

### Ordem de Resolução do Esquema

Quando o OpenSpec precisa de um esquema, ele verifica nesta ordem:

1. Flag da CLI: `--schema <nome>`
2. Metadados da mudança (`.openspec.yaml` na pasta da mudança)
3. Configuração do projeto (`openspec/config.yaml`)
4. Padrão (`spec-driven`)

---

## Esquemas Personalizados

Quando a configuração do projeto não é suficiente, crie seu próprio esquema com um fluxo de trabalho completamente personalizado. Esquemas personalizados ficam no diretório `openspec/schemas/` do seu projeto e são versionados com seu código.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Configuração do projeto
│   ├── schemas/           # Esquemas personalizados ficam aqui
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Suas mudanças
└── src/
```

### Fazer Fork de um Esquema Existente

A maneira mais rápida de personalizar é fazer fork de um esquema integrado:

```bash
openspec schema fork spec-driven my-workflow
```

Isso copia todo o esquema `spec-driven` para `openspec/schemas/my-workflow/` onde você pode editá-lo livremente.

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

### Criar um Esquema do Zero

Para um fluxo de trabalho completamente novo:

```bash
# Interativo
openspec schema init research-first

# Não interativo
openspec schema init rapid \
  --description "Fluxo de trabalho de iteração rápida" \
  --artifacts "proposal,tasks" \
  --default
```

### Estrutura do Esquema

Um esquema define os artefatos em seu fluxo de trabalho e como eles dependem uns dos outros:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: Fluxo de trabalho personalizado da minha equipe

artifacts:
  - id: proposal
    generates: proposal.md
    description: Documento de proposta inicial
    template: proposal.md
    instruction: |
      Crie uma proposta que explique POR QUE esta mudança é necessária.
      Foque no problema, não na solução.
    requires: []

  - id: design
    generates: design.md
    description: Design técnico
    template: design.md
    instruction: |
      Crie um documento de design explicando COMO implementar.
    requires:
      - proposal    # Não é possível criar o design até que a proposta exista

  - id: tasks
    generates: tasks.md
    description: Lista de verificação de implementação
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Campos-chave:**

| Campo | Propósito |
|-------|-----------|
| `id` | Identificador único, usado em comandos e regras |
| `generates` | Nome do arquivo de suporte (suporta globs como `specs/**/*.md`) |
| `template` | Arquivo de template no diretório `templates/` |
| `instruction` | Instruções da IA para criar este artefato |
| `requires` | Dependências - quais artefatos devem existir primeiro |

### Templates

Templates são arquivos markdown que guiam a IA. Eles são injetados no prompt ao criar aquele artefato.

```markdown
<!-- templates/proposal.md -->
## Por quê

<!-- Explique a motivação para esta mudança. Que problema isso resolve? -->

## O que muda

<!-- Descreva o que vai mudar. Seja específico sobre novas capacidades ou modificações. -->

## Impacto

<!-- Código afetado, APIs, dependências, sistemas -->
```

Os templates podem incluir:
- Cabeçalhos de seção que a IA deve preencher
- Comentários HTML com orientação para a IA
- Formatos de exemplo mostrando a estrutura esperada

### Valide Seu Esquema

Antes de usar um esquema personalizado, valide-o:

```bash
openspec schema validate my-workflow
```

Isso verifica:
- A sintaxe de `schema.yaml` está correta
- Todos os templates referenciados existem
- Não há dependências circulares
- Os IDs dos artefatos são válidos

### Use Seu Esquema Personalizado

Uma vez criado, use seu esquema com:

```bash
# Especifique no comando
openspec new change feature --schema my-workflow

# Ou defina como padrão no config.yaml
schema: my-workflow
```

### Depurar a Resolução do Esquema

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

> **Nota:** O OpenSpec também suporta esquemas no nível do usuário em `~/.local/share/openspec/schemas/` para compartilhamento entre projetos, mas esquemas no nível do projeto em `openspec/schemas/` são recomendados, pois são versionados com seu código.

---

## Exemplos

### Fluxo de Trabalho de Iteração Rápida

Um fluxo de trabalho mínimo para iterações rápidas:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Iteração rápida com sobrecarga mínima

artifacts:
  - id: proposal
    generates: proposal.md
    description: Proposta rápida
    template: proposal.md
    instruction: |
      Crie uma proposta breve para esta mudança.
      Foque no quê e por quê, pule especificações detalhadas.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Lista de verificação de implementação
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
    description: Lista de verificação de revisão pré-implementação
    template: review.md
    instruction: |
      Crie uma lista de verificação de revisão baseada no design.
      Inclua considerações de segurança, desempenho e testes.
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

O OpenSpec também suporta esquemas mantidos pela comunidade distribuídos via repositórios independentes. Eles fornecem fluxos de trabalho opinativos que integram o OpenSpec com outras ferramentas ou sistemas, de forma semelhante ao [catálogo de extensões da comunidade do github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) para o spec-kit.

Os esquemas da comunidade não são incorporados ao núcleo do OpenSpec — eles vivem em seus próprios repositórios com seu próprio ciclo de lançamento. Para usar um, copie o pacote do esquema para o diretório `openspec/schemas/<nome-do-esquema>/` do seu projeto (o README de cada repositório tem instruções de instalação).

| Esquema | Mantenedor | Repositório | Descrição |
|---------|-----------|-------------|-----------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Integra a governança de artefatos do OpenSpec com as habilidades de execução do [obra/superpowers](https://github.com/obra/superpowers) (brainstorming, planos de escrita, TDD via subagentes, revisão de código, finalização). Adiciona um artefato `retrospective` baseado em evidências preenchendo uma lacuna que o Superpowers não cobre nativamente. |

> Quer contribuir com um esquema da comunidade? Abra uma issue com um link para seu repositório, ou envie um PR adicionando uma linha a esta tabela.

---

## Veja Também

- [Referência da CLI: Comandos de Esquema](cli.md#schema-commands) - Documentação completa dos comandos