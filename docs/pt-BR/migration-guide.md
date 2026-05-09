# Migrando para o OPSX

Este guia ajuda você a fazer a transição do fluxo de trabalho legado do OpenSpec para o OPSX. A migração foi projetada para ser suave—seu trabalho existente é preservado, e o novo sistema oferece mais flexibilidade.

## O que está mudando?

O OPSX substitui o antigo fluxo de trabalho com fases fixas por uma abordagem fluida, baseada em ações. Aqui está a mudança principal:

| Aspecto | Legado | OPSX |
|---------|--------|------|
| **Comandos** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Padrão: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (comandos de fluxo de trabalho expandidos opcionais) |
| **Fluxo de trabalho** | Criar todos os artefatos de uma vez | Criar incrementalmente ou todos de uma vez—você escolhe |
| **Voltar atrás** | Portões de fase rígidos | Natural—atualize qualquer artefato a qualquer momento |
| **Personalização** | Estrutura fixa | Orientado por esquema, totalmente hackeável |
| **Configuração** | `CLAUDE.md` com marcadores + `project.md` | Configuração limpa em `openspec/config.yaml` |

**A mudança de filosofia:** O trabalho não é linear. O OPSX para de fingir que é.

---

## Antes de Começar

### Seu Trabalho Existente Está Seguro

O processo de migração foi projetado com a preservação em mente:

- **Alterações ativas em `openspec/changes/`** — Completamente preservadas. Você pode continuar com comandos OPSX.
- **Alterações arquivadas** — Intactas. Seu histórico permanece inalterado.
- **Especificações principais em `openspec/specs/`** — Intactas. Estas são sua fonte de verdade.
- **Seu conteúdo em CLAUDE.md, AGENTS.md, etc.** — Preservado. Apenas os blocos de marcadores do OpenSpec são removidos; tudo o que você escreveu permanece.

### O Que É Removido

Apenas arquivos gerenciados pelo OpenSpec que estão sendo substituídos:

| O quê | Por quê |
|-------|---------|
| Diretórios/arquivos de comandos legados com barra | Substituídos pelo novo sistema de habilidades |
| `openspec/AGENTS.md` | Gatilho de fluxo de trabalho obsoleto |
| Marcadores do OpenSpec em `CLAUDE.md`, `AGENTS.md`, etc. | Não são mais necessários |

**Localizações de comandos legados por ferramenta** (exemplos — sua ferramenta pode variar):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (apenas extensões de IDE; não suportado no Copilot CLI)
- E outros (Augment, Continue, Amazon Q, etc.)

A migração detecta quaisquer ferramentas que você configurou e limpa seus arquivos legados.

A lista de remoção pode parecer longa, mas são todos arquivos que o OpenSpec originalmente criou. Seu próprio conteúdo nunca é excluído.

### O Que Requer Sua Atenção

Um arquivo requer migração manual:

**`openspec/project.md`** — Este arquivo não é excluído automaticamente porque pode conter contexto do projeto que você escreveu. Você precisará:

1. Revisar seu conteúdo
2. Mover o contexto útil para `openspec/config.yaml` (veja orientação abaixo)
3. Excluir o arquivo quando estiver pronto

**Por que fizemos esta alteração:**

O antigo `project.md` era passivo — os agentes poderiam ler, poderiam não ler, poderiam esquecer o que leram. Achamos que a confiabilidade era inconsistente.

O novo contexto em `config.yaml` é **ativamente injetado em cada solicitação de planejamento do OpenSpec**. Isso significa que suas convenções do projeto, pilha de tecnologia e regras estão sempre presentes quando a IA está criando artefatos. Maior confiabilidade.

**A troca:**

Como o contexto é injetado em cada solicitação, você vai querer ser conciso. Foque no que realmente importa:
- Pilha de tecnologia e convenções-chave
- Restrições não óbvias que a IA precisa saber
- Regras que frequentemente eram ignoradas antes

Não se preocupe em deixar perfeito. Ainda estamos aprendendo o que funciona melhor aqui, e vamos melhorar como a injeção de contexto funciona conforme experimentamos.

---

## Executando a Migração

Tanto `openspec init` quanto `openspec update` detectam arquivos legados e guiam você pelo mesmo processo de limpeza. Use o que se adequar à sua situação:

- Novas instalações usam o perfil `core` (`propose`, `explore`, `apply`, `sync`, `archive`) por padrão.
- Instalações migradas preservam seus fluxos de trabalho instalados anteriormente, gravando um perfil `custom` quando necessário.

### Usando `openspec init`

Execute isto se quiser adicionar novas ferramentas ou reconfigurar quais ferramentas estão configuradas:

```bash
openspec init
```

O comando init detecta arquivos legados e guia você pela limpeza:

```
Upgrading to the new OpenSpec

OpenSpec now uses agent skills, the emerging standard across coding
agents. This simplifies your setup while keeping everything working
as before.

Files to remove
No user content to preserve:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Files to update
OpenSpec markers will be removed, your content preserved:
  • CLAUDE.md
  • AGENTS.md

Needs your attention
  • openspec/project.md
    We won't delete this file. It may contain useful project context.

    The new openspec/config.yaml has a "context:" section for planning
    context. This is included in every OpenSpec request and works more
    reliably than the old project.md approach.

    Review project.md, move any useful content to config.yaml's context
    section, then delete the file when ready.

? Upgrade and clean up legacy files? (Y/n)
```

**O que acontece quando você diz sim:**

1. Diretórios de comandos legados com barra são removidos
2. Marcadores do OpenSpec são removidos de `CLAUDE.md`, `AGENTS.md`, etc. (seu conteúdo permanece)
3. `openspec/AGENTS.md` é excluído
4. Novas habilidades são instaladas em `.claude/skills/`
5. `openspec/config.yaml` é criado com um esquema padrão

### Usando `openspec update`

Execute isto se você apenas quiser migrar e atualizar suas ferramentas existentes para a versão mais recente:

```bash
openspec update
```

O comando update também detecta e limpa artefatos legados, depois atualiza as habilidades/comandos gerados para corresponderem ao seu perfil e configurações de entrega atuais.

### Ambientes Não Interativos / CI

Para migrações em script:

```bash
openspec init --force --tools claude
```

A flag `--force` pula os prompts e aceita automaticamente a limpeza.

---

## Migrando project.md para config.yaml

O antigo `openspec/project.md` era um arquivo markdown livre para contexto do projeto. O novo `openspec/config.yaml` é estruturado e — criticamente — **injetado em cada solicitação de planejamento** para que suas convenções estejam sempre presentes quando a IA trabalha.

### Antes (project.md)

```markdown
# Project Context

This is a TypeScript monorepo using React and Node.js.
We use Jest for testing and follow strict ESLint rules.
Our API is RESTful and documented in docs/api.md.

## Conventions

- All public APIs must maintain backwards compatibility
- New features should include tests
- Use Given/When/Then format for specifications
```

### Depois (config.yaml)

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  Testing: Jest with React Testing Library
  API: RESTful, documented in docs/api.md
  We maintain backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan for risky changes
  specs:
    - Use Given/When/Then format for scenarios
    - Reference existing patterns before inventing new ones
  design:
    - Include sequence diagrams for complex flows
```

### Principais Diferenças

| project.md | config.yaml |
|------------|-------------|
| Markdown livre | YAML estruturado |
| Um bloco de texto | Contexto separado e regras por artefato |
| Incerto quando é usado | Contexto aparece em TODOS os artefatos; regras aparecem apenas nos artefatos correspondentes |
| Sem seleção de esquema | Campo `schema:` explícito define o fluxo de trabalho padrão |

### O Que Manter, O Que Descartar

Ao migrar, seja seletivo. Pergunte-se: "A IA precisa disso para *cada* solicitação de planejamento?"

**Boas candidatas para `context:`**
- Pilha de tecnologia (linguagens, frameworks, bancos de dados)
- Padrões arquitetônicos-chave (monorepo, microsserviços, etc.)
- Restrições não óbvias ("não podemos usar a biblioteca X porque...")
- Convenções críticas que frequentemente são ignoradas

**Mova para `rules:` em vez disso**
- Formatação específica de artefato ("use Dado/Quando/Então nas especificações")
- Critérios de revisão ("propostas devem incluir planos de rollback")
- Estas aparecem apenas para o artefato correspondente, mantendo outras solicitações mais leves

**Deixe de fora completamente**
- Melhores práticas gerais que a IA já conhece
- Explicações verbosas que poderiam ser resumidas
- Contexto histórico que não afeta o trabalho atual

### Etapas da Migração

1. **Crie config.yaml** (se ainda não foi criado pelo init):
   ```yaml
   schema: spec-driven
   ```

2. **Adicione seu contexto** (seja conciso — isso vai em cada solicitação):
   ```yaml
   context: |
     O histórico do seu projeto vai aqui.
     Foque no que a IA genuinamente precisa saber.
   ```

3. **Adicione regras por artefato** (opcional):
   ```yaml
   rules:
     proposal:
       - Sua orientação específica para propostas
     specs:
       - Suas regras para escrever especificações
   ```

4. **Exclua project.md** assim que tiver movido tudo o que for útil.

**Não complique demais.** Comece com o essencial e itere. Se notar que a IA está perdendo algo importante, adicione. Se o contexto parecer inchado, aparre. Este é um documento vivo.

### Precisa de Ajuda? Use Este Prompt

Se não tiver certeza de como destilar seu project.md, peça ajuda ao seu assistente de IA:

```
Estou migrando do antigo project.md do OpenSpec para o novo formato config.yaml.

Aqui está meu project.md atual:
[cole o conteúdo do seu project.md]

Por favor, me ajude a criar um config.yaml com:
1. Uma seção `context:` concisa (isso é injetado em cada solicitação de planejamento, então seja apertado — foque na pilha de tecnologia, restrições-chave e convenções que frequentemente são ignoradas)
2. `rules:` para artefatos específicos se algum conteúdo for específico do artefato (ex: "use Dado/Quando/Então" pertence às regras de specs, não ao contexto global)

Deixe de fora qualquer coisa genérica que os modelos de IA já sabem. Seja implacável com a brevidade.
```

A IA ajudará você a identificar o que é essencial vs. o que pode ser aparado.

---

## Os Novos Comandos

A disponibilidade dos comandos depende do perfil:

**Padrão (perfil `core`):**

| Comando | Propósito |
|---------|-----------|
| `/opsx:propose` | Cria uma alteração e gera artefatos de planejamento em uma etapa |
| `/opsx:explore` | Pense em ideias sem estrutura |
| `/opsx:apply` | Implementa tarefas do tasks.md |
| `/opsx:archive` | Finaliza e arquiva a alteração |

**Fluxo de trabalho expandido (seleção personalizada):**

| Comando | Propósito |
|---------|-----------|
| `/opsx:new` | Inicia um novo esqueleto de alteração |
| `/opsx:continue` | Cria o próximo artefato (um de cada vez) |
| `/opsx:ff` | Avanço rápido — cria artefatos de planejamento de uma vez |
| `/opsx:verify` | Valida se a implementação corresponde às especificações |
| `/opsx:sync` | Mescla especificações delta nas especificações principais |
| `/opsx:bulk-archive` | Arquiva múltiplas alterações de uma vez |
| `/opsx:onboard` | Fluxo de trabalho guiado de integração ponta a ponta |

Habilite comandos expandidos com `openspec config profile`, depois execute `openspec update`.

### Mapeamento de Comandos do Legado

| Legado | Equivalente OPSX |
|--------|------------------|
| `/openspec:proposal` | `/opsx:propose` (padrão) ou `/opsx:new` depois `/opsx:ff` (expandido) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Novas Capacidades

Estas capacidades fazem parte do conjunto de comandos do fluxo de trabalho expandido.

**Criação granular de artefatos:**
```
/opsx:continue
```
Cria um artefato de cada vez com base nas dependências. Use isto quando quiser revisar cada etapa.

**Modo de exploração:**
```
/opsx:explore
```
Pense em ideias com um parceiro antes de se comprometer com uma alteração.

---

## Entendendo a Nova Arquitetura

### De Travado em Fases para Fluído

O fluxo de trabalho legado forçava uma progressão linear:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

Se você está na implementação e percebe que o design está errado?
Azar. Os portões de fase não permitem voltar facilmente.
```

OPSX usa ações, não fases:

```
         ┌───────────────────────────────────────────────┐
         │           ACTIONS (not phases)                │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    any order                  │
         └───────────────────────────────────────────────┘
```

### Grafo de Dependências

Os artefatos formam um grafo direcionado. As dependências são habilitadoras, não portões:

```
                        proposal
                       (root node)
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
```

Quando você executa `/opsx:continue`, ele verifica o que está pronto e oferece o próximo artefato. Você também pode criar múltiplos artefatos prontos em qualquer ordem.

### Skills vs Comandos

O sistema legado usava arquivos de comando específicos para ferramentas:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX usa o padrão emergente **skills**:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

As skills são reconhecidas em múltiplas ferramentas de codificação com IA e fornecem metadados mais ricos.

---

## Continuando Alterações Existentes

Suas alterações em andamento funcionam perfeitamente com os comandos do OPSX.

**Tem uma alteração ativa do fluxo de trabalho legado?**

```
/opsx:apply add-my-feature
```

O OPSX lê os artefatos existentes e continua de onde você parou.

**Quer adicionar mais artefatos a uma alteração existente?**

```
/opsx:continue add-my-feature
```

Mostra o que está pronto para ser criado com base no que já existe.

**Precisa ver o status?**

```bash
openspec status --change add-my-feature
```

---

## O Novo Sistema de Configuração

### Estrutura do config.yaml

```yaml
# Required: Default schema for new changes
schema: spec-driven

# Optional: Project context (max 50KB)
# Injected into ALL artifact instructions
context: |
  Your project background, tech stack,
  conventions, and constraints.

# Optional: Per-artifact rules
# Only injected into matching artifacts
rules:
  proposal:
    - Include rollback plan
  specs:
    - Use Given/When/Then format
  design:
    - Document fallback strategies
  tasks:
    - Break into 2-hour maximum chunks
```

### Resolução de Schema

Ao determinar qual schema usar, o OPSX verifica na ordem:

1. **Flag da CLI**: `--schema <name>` (maior prioridade)
2. **Metadados da alteração**: `.openspec.yaml` no diretório da alteração
3. **Configuração do projeto**: `openspec/config.yaml`
4. **Padrão**: `spec-driven`

### Schemas Disponíveis

| Schema | Artefatos | Melhor Para |
|--------|-----------|-------------|
| `spec-driven` | proposal → specs → design → tasks | A maioria dos projetos |

Listar todos os schemas disponíveis:

```bash
openspec schemas
```

### Schemas Personalizados

Crie seu próprio fluxo de trabalho:

```bash
openspec schema init my-workflow
```

Ou bifurque um existente:

```bash
openspec schema fork spec-driven my-workflow
```

Consulte [Customização](customization.md) para detalhes.

---

## Solução de Problemas

### "Legacy files detected in non-interactive mode"

Você está executando em um ambiente CI ou não interativo. Use:

```bash
openspec init --force
```

### Comandos não aparecem após a migração

Reinicie seu IDE. As skills são detectadas na inicialização.

### "Unknown artifact ID in rules"

Verifique se as chaves do seu `rules:` correspondem aos IDs de artefatos do seu schema:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Execute isto para ver os IDs de artefatos válidos:

```bash
openspec schemas --json
```

### Configuração não está sendo aplicada

1. Certifique-se de que o arquivo está em `openspec/config.yaml` (não `.yml`)
2. Valide a sintaxe YAML
3. As alterações de configuração entram em vigor imediatamente—não é necessário reiniciar

### project.md não migrado

O sistema preserva intencionalmente o `project.md` porque ele pode conter seu conteúdo personalizado. Revise-o manualmente, mova as partes úteis para `config.yaml` e depois o exclua.

### Quer ver o que seria limpo?

Execute o init e recuse o prompt de limpeza—você verá o resumo completo da detecção sem que nenhuma alteração seja feita.

---

## Referência Rápida

### Arquivos Após a Migração

```
project/
├── openspec/
│   ├── specs/                    # Unchanged
│   ├── changes/                  # Unchanged
│   │   └── archive/              # Unchanged
│   └── config.yaml               # NEW: Project configuration
├── .claude/
│   └── skills/                   # NEW: OPSX skills
│       ├── openspec-propose/     # default core profile
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # expanded profile adds new/continue/ff/etc.
├── CLAUDE.md                     # OpenSpec markers removed, your content preserved
└── AGENTS.md                     # OpenSpec markers removed, your content preserved
```

### O Que Foi Removido

- `.claude/commands/openspec/` — substituído por `.claude/skills/`
- `openspec/AGENTS.md` — obsoleto
- `openspec/project.md` — migre para `config.yaml`, depois exclua
- Blocos de marcadores do OpenSpec em `CLAUDE.md`, `AGENTS.md`, etc.

### Folha de Dicas de Comandos

```text
/opsx:propose      Comece rapidamente (perfil core padrão)
/opsx:apply        Implemente tarefas
/opsx:archive      Finalize e arquive

# Fluxo de trabalho expandido (se habilitado):
/opsx:new          Crie a estrutura de uma alteração
/opsx:continue     Crie o próximo artefato
/opsx:ff           Crie artefatos de planejamento
```

---

## Obtendo Ajuda

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Documentação**: [docs/opsx.md](opsx.md) para a referência completa do OPSX