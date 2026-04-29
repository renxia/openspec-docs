# Migrando para o OPSX

Este guia ajuda você a fazer a transição do fluxo de trabalho legado do OpenSpec para o OPSX. A migração foi projetada para ser tranquila — seu trabalho existente é preservado, e o novo sistema oferece mais flexibilidade.

## O que está mudando?

O OPSX substitui o antigo fluxo de trabalho bloqueado por fases por uma abordagem fluida e baseada em ações. Aqui está a mudança principal:

| Aspecto | Legado | OPSX |
|--------|--------|------|
| **Comandos** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Padrão: `/opsx:propose`, `/opsx:apply`, `/opsx:archive` (comandos de fluxo de trabalho expandidos opcionais) |
| **Fluxo de trabalho** | Criar todos os artefatos de uma vez | Criar incrementalmente ou todos de uma vez — sua escolha |
| **Voltar atrás** | Portões de fase constrangedores | Natural — atualize qualquer artefato a qualquer momento |
| **Personalização** | Estrutura fixa | Guiado por esquema, totalmente personalizável |
| **Configuração** | `CLAUDE.md` com marcadores + `project.md` | Configuração limpa em `openspec/config.yaml` |

**A mudança de filosofia:** O trabalho não é linear. O OPSX para de fingir que é.

---

## Antes de Começar

### Seu Trabalho Existente Está Seguro

O processo de migração foi projetado com preservação em mente:

- **Alterações ativas em `openspec/changes/`** — Completamente preservadas. Você pode continuá-las com comandos OPSX.
- **Alterações arquivadas** — Intocadas. Seu histórico permanece intacto.
- **Especificações principais em `openspec/specs/`** — Intocadas. Estas são sua fonte de verdade.
- **Seu conteúdo em CLAUDE.md, AGENTS.md, etc.** — Preservado. Apenas os blocos de marcadores OpenSpec são removidos; tudo o que você escreveu permanece.

### O Que É Removido

Apenas os arquivos gerenciados pelo OpenSpec que estão sendo substituídos:

| O Que | Por Que |
|-------|---------|
| Diretórios/arquivos de comandos legados com barra | Substituídos pelo novo sistema de habilidades |
| `openspec/AGENTS.md` | Gatilho de fluxo de trabalho obsoleto |
| Marcadores OpenSpec em `CLAUDE.md`, `AGENTS.md`, etc. | Não são mais necessários |

**Locais de comandos legados por ferramenta** (exemplos—sua ferramenta pode variar):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (apenas extensões de IDE; não suportado no Copilot CLI)
- E outros (Augment, Continue, Amazon Q, etc.)

A migração detecta quaisquer ferramentas que você tenha configurado e limpa seus arquivos legados.

A lista de remoção pode parecer longa, mas estes são todos arquivos que o OpenSpec criou originalmente. Seu próprio conteúdo nunca é deletado.

### O Que Requer Sua Atenção

Um arquivo requer migração manual:

**`openspec/project.md`** — Este arquivo não é deletado automaticamente porque pode conter contexto do projeto que você escreveu. Você precisará:

1. Revisar seu conteúdo
2. Mover o contexto útil para `openspec/config.yaml` (veja orientação abaixo)
3. Deletar o arquivo quando estiver pronto

**Por que fizemos esta mudança:**

O antigo `project.md` era passivo—agentes poderiam ler, poderiam não ler, poderiam esquecer o que leram. Descobrimos que a confiabilidade era inconsistente.

O novo contexto em `config.yaml` é **injetado ativamente em cada solicitação de planejamento do OpenSpec**. Isso significa que suas convenções de projeto, stack tecnológica e regras estão sempre presentes quando a IA está criando artefatos. Maior confiabilidade.

**A compensação:**

Como o contexto é injetado em cada solicitação, você vai querer ser conciso. Foque no que realmente importa:
- Stack tecnológica e convenções principais
- Restrições não óbvias que a IA precisa saber
- Regras que frequentemente eram ignoradas antes

Não se preocupe em ficar perfeito. Ainda estamos aprendendo o que funciona melhor aqui, e vamos melhorar como a injeção de contexto funciona à medida que experimentamos.

---

## Executando a Migração

Tanto `openspec init` quanto `openspec update` detectam arquivos legados e orientam você pelo mesmo processo de limpeza. Use o que se adequar à sua situação:

- Instalações novas usam o perfil padrão `core` (`propose`, `explore`, `apply`, `archive`).
- Instalações migradas preservam seus fluxos de trabalho previamente instalados escrevendo um perfil `custom` quando necessário.

### Usando `openspec init`

Execute isso se quiser adicionar novas ferramentas ou reconfigurar quais ferramentas estão configuradas:

```bash
openspec init
```

O comando init detecta arquivos legados e orienta você pela limpeza:

```
Atualizando para o novo OpenSpec

O OpenSpec agora usa habilidades de agente, o padrão emergente em agentes de
programação. Isso simplifica sua configuração enquanto mantém tudo funcionando
como antes.

Arquivos a remover
Nenhum conteúdo de usuário a preservar:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Arquivos a atualizar
Marcadores OpenSpec serão removidos, seu conteúdo preservado:
  • CLAUDE.md
  • AGENTS.md

Requer sua atenção
  • openspec/project.md
    Não deletaremos este arquivo. Ele pode conter contexto útil do projeto.

    O novo openspec/config.yaml tem uma seção "context:" para contexto de
    planejamento. Isso é incluído em cada solicitação do OpenSpec e funciona de
    forma mais confiável do que a abordagem antiga do project.md.

    Revise o project.md, mova qualquer conteúdo útil para a seção context do
    config.yaml, e então delete o arquivo quando estiver pronto.

? Atualizar e limpar arquivos legados? (Y/n)
```

**O que acontece quando você diz sim:**

1. Diretórios de comandos legados com barra são removidos
2. Marcadores OpenSpec são removidos de `CLAUDE.md`, `AGENTS.md`, etc. (seu conteúdo permanece)
3. `openspec/AGENTS.md` é deletado
4. Novas habilidades são instaladas em `.claude/skills/`
5. `openspec/config.yaml` é criado com um esquema padrão

### Usando `openspec update`

Execute isso se quiser apenas migrar e atualizar suas ferramentas existentes para a versão mais recente:

```bash
openspec update
```

O comando update também detecta e limpa artefatos legados, e então atualiza as habilidades/comandos gerados para corresponder ao seu perfil e configurações de entrega atuais.

### Ambientes Não-Interativos / CI

Para migrações em script:

```bash
openspec init --force --tools claude
```

A flag `--force` pula os prompts e aceita automaticamente a limpeza.

---

## Migrando project.md para config.yaml

O antigo `openspec/project.md` era um arquivo markdown livre para contexto do projeto. O novo `openspec/config.yaml` é estruturado e—criticamente—**injetado em cada solicitação de planejamento** para que suas convenções estejam sempre presentes quando a IA trabalha.

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
| Um bloco de texto | Contexto e regras por artefato separados |
| Uso pouco claro | Contexto aparece em TODOS os artefatos; regras aparecem apenas nos artefatos correspondentes |
| Sem seleção de esquema | Campo `schema:` explícito define o fluxo de trabalho padrão |

### O Que Manter, O Que Descartar

Ao migrar, seja seletivo. Pergunte a si mesmo: "A IA precisa disso para *cada* solicitação de planejamento?"

**Bons candidatos para `context:`**
- Stack tecnológica (linguagens, frameworks, bancos de dados)
- Padrões arquitetônicos chave (monorepo, microsserviços, etc.)
- Restrições não óbvias ("não podemos usar a biblioteca X porque...")
- Convenções críticas que frequentemente são ignoradas

**Mova para `rules:` em vez disso**
- Formatação específica de artefato ("use Given/When/Then nas specs")
- Critérios de revisão ("propostas devem incluir planos de rollback")
- Estas aparecem apenas para o artefato correspondente, mantendo outras solicitações mais leves

**Deixe de fora completamente**
- Melhores práticas gerais que a IA já conhece
- Explicações verbosas que poderiam ser resumidas
- Contexto histórico que não afeta o trabalho atual

### Passos da Migração

1. **Crie o config.yaml** (se ainda não foi criado pelo init):
   ```yaml
   schema: spec-driven
   ```

2. **Adicione seu contexto** (seja conciso—isso vai em cada solicitação):
   ```yaml
   context: |
     O contexto do seu projeto vai aqui.
     Foque no que a IA realmente precisa saber.
   ```

3. **Adicione regras por artefato** (opcional):
   ```yaml
   rules:
     proposal:
       - Sua orientação específica para propostas
     specs:
       - Suas regras de escrita de specs
   ```

4. **Delete o project.md** depois de ter movido tudo o que é útil.

**Não pense demais.** Comece com o essencial e itere. Se notar que a IA está perdendo algo importante, adicione. Se o contexto parecer inchado, reduza. Este é um documento vivo.

### Precisa de Ajuda? Use Este Prompt

Se não tiver certeza de como destilar seu project.md, pergunte ao seu assistente de IA:

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

A IA ajudará você a identificar o que é essencial vs. o que pode ser reduzido.

---

## Os Novos Comandos

A disponibilidade de comandos depende do perfil:

**Padrão (perfil `core`):**

| Comando | Finalidade |
|---------|------------|
| `/opsx:propose` | Criar uma alteração e gerar artefatos de planejamento em um passo |
| `/opsx:explore` | Pensar em ideias sem estrutura |
| `/opsx:apply` | Implementar tarefas do tasks.md |
| `/opsx:archive` | Finalizar e arquivar a alteração |

**Fluxo de trabalho expandido (seleção personalizada):**

| Comando | Finalidade |
|---------|------------|
| `/opsx:new` | Iniciar um novo esqueleto de alteração |
| `/opsx:continue` | Criar o próximo artefato (um por vez) |
| `/opsx:ff` | Avanço rápido—criar artefatos de planejamento de uma vez |
| `/opsx:verify` | Validar se a implementação corresponde às specs |
| `/opsx:sync` | Pré-visualização/fusão de specs sem arquivar |
| `/opsx:bulk-archive` | Arquivar múltiplas alterações de uma vez |
| `/opsx:onboard` | Fluxo de trabalho guiado de integração ponta a ponta |

Ative os comandos expandidos com `openspec config profile`, e então execute `openspec update`.

### Mapeamento de Comandos do Legado

| Legado | Equivalente OPSX |
|--------|------------------|
| `/openspec:proposal` | `/opsx:propose` (padrão) ou `/opsx:new` seguido de `/opsx:ff` (expandido) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Novas Capacidades

Estas capacidades fazem parte do conjunto de comandos do fluxo de trabalho expandido.

**Criação granular de artefatos:**
```
/opsx:continue
```
Cria um artefato por vez baseado em dependências. Use isso quando quiser revisar cada etapa.

**Modo de exploração:**
```
/opsx:explore
```
Pense em ideias com um parceiro antes de se comprometer com uma alteração.

---

## Compreendendo a Nova Arquitetura

### De Fase-Trancada para Fluida

O fluxo de trabalho legado forçava uma progressão linear:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

Se você está na implementação e percebe que o design está errado?
Pena. Os gates de fase não permitem voltar facilmente.
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

Os artefatos formam um grafo direcionado. As dependências são habilitadores, não gates:

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

OPSX usa o padrão emergente de **skills**:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

As skills são reconhecidas por múltiplas ferramentas de codificação com IA e fornecem metadados mais ricos.

---

## Continuando Mudanças Existente

Suas mudanças em andamento funcionam perfeitamente com os comandos do OPSX.

**Tem uma mudança ativa do fluxo de trabalho legado?**

```
/opsx:apply add-my-feature
```

OPSX lê os artefatos existentes e continua de onde você parou.

**Quer adicionar mais artefatos a uma mudança existente?**

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

Ao determinar qual schema usar, o OPSX verifica na seguinte ordem:

1. **Flag CLI**: `--schema <name>` (maior prioridade)
2. **Metadados da mudança**: `.openspec.yaml` no diretório da mudança
3. **Configuração do projeto**: `openspec/config.yaml`
4. **Padrão**: `spec-driven`

### Schemas Disponíveis

| Schema | Artefatos | Melhor Para |
|--------|-----------|-------------|
| `spec-driven` | proposal → specs → design → tasks | Maioria dos projetos |

Liste todos os schemas disponíveis:

```bash
openspec schemas
```

### Schemas Personalizados

Crie seu próprio fluxo de trabalho:

```bash
openspec schema init my-workflow
``

Ou faça um fork de um existente:

```bash
openspec schema fork spec-driven my-workflow
```

Veja [Personalização](customization.md) para detalhes.

---

## Solução de Problemas

### "Arquivos legados detectados no modo não interativo"

Você está executando em um CI ou ambiente não interativo. Use:

```bash
openspec init --force
```

### Comandos não aparecem após a migração

Reinicie sua IDE. As skills são detectadas na inicialização.

### "ID de artefato desconhecido nas regras"

Verifique se suas chaves `rules:` correspondem aos IDs dos artefatos do seu schema:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Execute isto para ver os IDs de artefatos válidos:

```bash
openspec schemas --json
```

### Configuração não está sendo aplicada

1. Certifique-se de que o arquivo está em `openspec/config.yaml` (não `.yml`)
2. Valide a sintaxe YAML
3. As alterações de configuração entram em vigor imediatamente — não é necessário reiniciar

### project.md não foi migrado

O sistema preserva intencionalmente `project.md` porque ele pode conter seu conteúdo personalizado. Revise-o manualmente, mova partes úteis para `config.yaml`, e então delete-o.

### Quer ver o que seria limpo?

Execute o init e recuse o prompt de limpa — você verá o resumo completo da detecção sem que nenhuma alteração seja feita.

---

## Referência Rápida

### Arquivos Após a Migração

```
project/
├── openspec/
│   ├── specs/                    # Inalterado
│   ├── changes/                  # Inalterado
│   │   └── archive/              # Inalterado
│   └── config.yaml               # NOVO: Configuração do projeto
├── .claude/
│   └── skills/                   # NOVO: Skills do OPSX
│       ├── openspec-propose/     # perfil core padrão
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       └── ...                   # perfil expandido adiciona new/continue/ff/etc.
├── CLAUDE.md                     # Marcadores OpenSpec removidos, seu conteúdo preservado
└── AGENTS.md                     # Marcadores OpenSpec removidos, seu conteúdo preservado
```

### O Que Foi Removido

- `.claude/commands/openspec/` — substituído por `.claude/skills/`
- `openspec/AGENTS.md` — obsoleto
- `openspec/project.md` — migrar para `config.yaml`, e então deletar
- Blocos de marcadores OpenSpec em `CLAUDE.md`, `AGENTS.md`, etc.

### Folha de Referência de Comandos

```text
/opsx:propose      Inicie rapidamente (perfil core padrão)
/opsx:apply        Implemente tarefas
/opsx:archive      Finalize e arquive

# Fluxo de trabalho expandido (se habilitado):
/opsx:new          Monte uma mudança
/opsx:continue     Crie o próximo artefato
/opsx:ff           Crie artefatos de planejamento
```

---

## Obtendo Ajuda

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Documentação**: [docs/opsx.md](opsx.md) para a referência completa do OPSX