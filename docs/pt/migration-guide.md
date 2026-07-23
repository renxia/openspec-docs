# Migrando para o OPSX

Este guia ajuda você a fazer a transição do fluxo de trabalho legado do OpenSpec para o OPSX. A migração foi projetada para ser tranquila — seu trabalho existente é preservado, e o novo sistema oferece mais flexibilidade.

## O que está mudando?

O OPSX substitui o antigo fluxo de trabalho bloqueado por fases por uma abordagem fluida baseada em ações. Aqui está a mudança principal:

| Aspecto | Legado | OPSX |
|--------|--------|------|
| **Comandos** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Padrão: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (comandos de fluxo de trabalho expandidos são opcionais) |
| **Fluxo de trabalho** | Criar todos os artefatos de uma vez | Criar de forma incremental ou todos de uma vez — você escolhe |
| **Voltar atrás** | Portões de fase complicados | Natural — atualize qualquer artefato a qualquer momento |
| **Personalização** | Estrutura fixa | Baseado em esquema, totalmente hackeável |
| **Configuração** | `CLAUDE.md` com marcadores + `project.md` | Configuração limpa em `openspec/config.yaml` |

**A mudança de filosofia:** O trabalho não é linear. O OPSX para de fingir que é.

---

## Antes de Começar

### Seu Trabalho Existente Está Seguro

O processo de migração foi projetado com foco na preservação:

- **Alterações ativas em `openspec/changes/`** — Completamente preservadas. Você pode continuá-las com comandos OPSX.
- **Alterações arquivadas** — Intocadas. Seu histórico permanece intacto.
- **Especificações principais em `openspec/specs/`** — Intocadas. Estas são sua fonte de verdade.
- **Seu conteúdo em CLAUDE.md, AGENTS.md, etc.** — Preservado. Apenas os blocos de marcadores do OpenSpec são removidos; tudo o que você escreveu permanece.

### O Que É Removido

Apenas arquivos gerenciados pelo OpenSpec que estão sendo substituídos:

| O que | Por quê |
|-------|---------|
| Diretórios/arquivos de comandos slash legados | Substituídos pelo novo sistema de habilidades |
| `openspec/AGENTS.md` | Gatilho de fluxo de trabalho obsoleto |
| Marcadores OpenSpec em `CLAUDE.md`, `AGENTS.md`, etc. | Não são mais necessários |

**Localizações de comandos legadas por ferramenta** (exemplos—sua ferramenta pode variar):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.cinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (apenas extensões de IDE; não suportado no Copilot CLI)
- Codex: OpenSpec agora usa `.codex/skills/openspec-*`; a limpeza legada visa apenas os nomes de arquivos de prompt da lista de permissões do OpenSpec em `$CODEX_HOME/prompts` ou `~/.codex/prompts`, e só os remove após as habilidades de substituição existirem.
- E outros (Augment, Continue, Amazon Q, etc.)

A migração detecta quaisquer ferramentas que você tenha configurado e limpa seus arquivos legados.

A lista de remoção pode parecer longa, mas todos esses são arquivos que o OpenSpec criou originalmente. Seu próprio conteúdo nunca é excluído.

### O Que Requer Sua Atenção

Um arquivo requer migração manual:

**`openspec/project.md`** — Este arquivo não é excluído automaticamente porque pode conter contexto do projeto que você escreveu. Você precisará:

1. Revisar seu conteúdo
2. Mover o contexto útil para `openspec/config.yaml` (veja as orientações abaixo)
3. Excluir o arquivo quando estiver pronto

**Por que fizemos essa alteração:**

O antigo `project.md` era passivo—os agentes podiam lê-lo, podiam não ler, podiam esquecer o que leram. Descobrimos que a confiabilidade era inconsistente.

O contexto do novo `config.yaml` é **injetado ativamente em cada solicitação de planejamento do OpenSpec**. Isso significa que suas convenções de projeto, pilha de tecnologia e regras estão sempre presentes quando a IA está criando artefatos. Maior confiabilidade.

**A troca:**

Como o contexto é injetado em cada solicitação, você vai querer ser conciso. Concentre-se no que realmente importa:
- Pilha de tecnologia e convenções principais
- Restrições não óbvias que a IA precisa saber
- Regras que frequentemente eram ignoradas antes

Não se preocupe em acertar perfeitamente. Ainda estamos aprendendo o que funciona melhor aqui, e estaremos melhorando como a injeção de contexto funciona à medida que experimentamos.

---

## Executando a Migração

Tanto `openspec init` quanto `openspec update` detectam arquivos legados e guiam você pelo mesmo processo de limpeza. Use o que melhor se adapte à sua situação:

- Novas instalações usam o perfil `core` por padrão (`propose`, `explore`, `apply`, `sync`, `archive`).
- Instalações migradas preservam seus fluxos de trabalho previamente instalados escrevendo um perfil `custom` quando necessário.

### Usando `openspec init`

Execute isso se quiser adicionar novas ferramentas ou reconfigurar quais ferramentas estão configuradas:

```bash
openspec init
```

O comando init detecta arquivos legados e guia você pela limpeza:

```
Atualizando para o novo OpenSpec

O OpenSpec agora usa habilidades de agente, o padrão emergente entre agentes de codificação. Isso simplifica sua configuração enquanto mantém tudo funcionando como antes.

Arquivos para remover
Nenhum conteúdo de usuário para preservar:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Arquivos para atualizar
Os marcadores OpenSpec serão removidos, seu conteúdo preservado:
  • CLAUDE.md
  • AGENTS.md

Requer sua atenção
  • openspec/project.md
    Não excluiremos este arquivo. Ele pode conter contexto útil do projeto.

    O novo openspec/config.yaml tem uma seção "context:" para contexto de planejamento que é incluída em cada solicitação do OpenSpec e funciona mais confiavelmente do que a abordagem antiga do project.md.

    Revise o project.md, mova qualquer conteúdo útil para a seção context do config.yaml e, em seguida, exclua o arquivo quando estiver pronto.

? Atualizar e limpar arquivos legados? (S/n)
```

**O que acontece quando você diz sim:**

1. Diretórios de comandos slash legados são removidos
2. Marcadores OpenSpec são removidos de `CLAUDE.md`, `AGENTS.md`, etc. (seu conteúdo permanece)
3. `openspec/AGENTS.md` é excluído
4. Novas habilidades são instaladas em `.claude/skills/`
5. `openspec/config.yaml` é criado com um esquema padrão

### Usando `openspec update`

Execute isso se você apenas quiser migrar e atualizar suas ferramentas existentes para a versão mais recente:

```bash
openspec update
```

O comando update também detecta e limpa artefatos legados, depois atualiza as habilidades/comandos gerados para corresponder ao seu perfil e configurações de entrega atuais.

### Ambientes Não Interativos / CI

Para migrações via script:

```bash
openspec init --force --tools claude
```

O sinalizador `--force` pula os prompts e aceita automaticamente a limpeza.

Isso inclui a limpeza de arquivos de prompt do Codex gerenciados pelo OpenSpec no diretório global de prompts do Codex. A limpeza visa apenas os nomes de arquivos de prompt legados do Codex na lista de permissões do OpenSpec, remove-os apenas após as habilidades de substituição `.codex/skills/openspec-*` existirem e preserva todos os outros arquivos.

---

## Migrando project.md para config.yaml

O antigo `openspec/project.md` era um arquivo markdown de formato livre para contexto do projeto. O novo `openspec/config.yaml` é estruturado e—criticamente—**injetado em cada solicitação de planejamento** para que suas convenções estejam sempre presentes quando a IA trabalha.

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

### Diferenças Principais

| project.md | config.yaml |
|------------|-------------|
| Markdown de formato livre | YAML estruturado |
| Um bloco de texto | Contexto separado e regras por artefato |
| Não fica claro quando é usado | O contexto aparece em TODOS os artefatos; as regras aparecem apenas nos artefatos correspondentes |
| Sem seleção de esquema | O campo explícito `schema:` define o fluxo de trabalho padrão |

### O Que Manter, O Que Descartar

Durante a migração, seja seletivo. Pergunte a si mesmo: "A IA precisa disso para *cada* solicitação de planejamento?"

**Bons candidatos para `context:`**
- Pilha de tecnologia (linguagens, frameworks, bancos de dados)
- Padrões arquiteturais principais (monorepo, microsserviços, etc.)
- Restrições não óbvias ("não podemos usar a biblioteca X porque...")
- Convenções críticas que frequentemente são ignoradas

**Mover para `rules:` em vez disso**
- Formatação específica de artefato ("use Given/When/Then em especificações")
- Critérios de revisão ("propostas devem incluir planos de reversão")
- Estes aparecem apenas para o artefato correspondente, mantendo outras solicitações mais leves

**Deixe de fora completamente**
- Práticas gerais que a IA já conhece
- Explicações detalhadas que poderiam ser resumidas
- Contexto histórico que não afeta o trabalho atual

### Passos da Migração

1. **Crie o config.yaml** (se não tiver sido criado pelo init):
   ```yaml
   schema: spec-driven
   ```

2. **Adicione seu contexto** (seja conciso—isso vai em cada solicitação):
   ```yaml
   context: |
     O contexto do seu projeto vai aqui.
     Concentre-se no que a IA genuinamente precisa saber.
   ```

3. **Adicione regras por artefato** (opcional):
   ```yaml
   rules:
     proposal:
       - Suas orientações específicas para propostas
     specs:
       - Suas regras para escrita de especificações
   ```

4. **Exclua o project.md** depois de mover tudo o que for útil.

**Não complique demais.** Comece com o essencial e itere. Se perceber que a IA está perdendo algo importante, adicione. Se o contexto parecer inchado, corte. Este é um documento vivo.

### Precisa de Ajuda? Use Este Prompt

Se você não tiver certeza de como resumir seu project.md, peça ajuda ao seu assistente de IA:

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

A IA ajudará você a identificar o que é essencial versus o que pode ser cortado.

---

## Os Novos Comandos

A disponibilidade de comandos depende do perfil:

**Perfil padrão (`core`):**

| Comando | Propósito |
|---------|-----------|
| `/opsx:propose` | Criar uma alteração e gerar artefatos de planejamento em uma etapa |
| `/opsx:explore` | Refletir sobre ideias sem estrutura |
| `/opsx:apply` | Implementar tarefas do tasks.md |
| `/opsx:archive` | Finalizar e arquivar a alteração |

**Fluxo de trabalho expandido (seleção personalizada):**

| Comando | Propósito |
|---------|-----------|
| `/opsx:new` | Iniciar um novo esqueleto de alteração |
| `/opsx:continue` | Criar o próximo artefato (um de cada vez) |
| `/opsx:ff` | Fast-forward—criar artefatos de planejamento de uma vez |
| `/opsx:verify` | Validar se a implementação corresponde às especificações |
| `/opsx:sync` | Mesclar especificações delta nas especificações principais |
| `/opsx:bulk-archive` | Arquivar várias alterações de uma vez |
| `/opsx:onboard` | Fluxo de trabalho de integração guiado de ponta a ponta |

Habilite comandos expandidos com `openspec config profile` e depois execute `openspec update`.

### Mapeamento de Comandos do Legado

| Legado | Equivalente OPSX |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (padrão) ou `/opsx:new` depois `/opsx:ff` (expandido) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Novas Capacidades

Essas capacidades fazem parte do conjunto de comandos de fluxo de trabalho expandido.

**Criação granular de artefatos:**
```
/opsx:continue
```
Cria um artefato de cada vez com base nas dependências. Use isso quando quiser revisar cada etapa.

**Modo de exploração:**
```
/opsx:explore
```
Reflita sobre ideias com um parceiro antes de se comprometer com uma alteração.

---

## Entendendo a Nova Arquitetura

### De Travado em Fases para Fluido

O fluxo de trabalho legado forçava uma progressão linear:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANEJAMENTO   │ ───► │ IMPLEMENTAÇÃO │ ───► │   ARQUIVAMENTO  │
│     FASE     │      │     FASE     │      │     FASE     │
└──────────────┘      └──────────────┘      └──────────────┘

Se você estiver na implementação e perceber que o design está errado?
Que pena. Os portões de fase não permitem que você volte facilmente.
```

OPSX usa ações, não fases:

```
         ┌───────────────────────────────────────────────┐
         │           AÇÕES (não fases)                    │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    qualquer ordem              │
         └───────────────────────────────────────────────┘
```

### Grafo de Dependência

Os artefatos formam um grafo direcionado. Dependências são habilitadores, não portões:

```
                        proposal
                       (nó raiz)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (requer:                  (requer:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (requer:
                     specs, design)
```

Quando você executa `/opsx:continue`, ele verifica o que está pronto e oferece o próximo artefato. Você também pode criar vários artefatos prontos em qualquer ordem.

### Habilidades vs Comandos

O sistema legado usava arquivos de comando específicos da ferramenta:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX usa o padrão emergente de **habilidades**:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

As habilidades são reconhecidas em várias ferramentas de codificação de IA e fornecem metadados mais ricos.

O Codex usa apenas habilidades no OPSX. O OpenSpec não gera mais arquivos de prompt personalizados do Codex; use os diretórios `.codex/skills/openspec-*` gerados em vez disso.

## Continuando Alterações Existentes

Suas alterações em andamento funcionam perfeitamente com os comandos OPSX.

**Tem uma alteração ativa do fluxo de trabalho legado?**

```
/opsx:apply add-my-feature
```

O OPSX lê os artefatos existentes e continua de onde você parou.

**Deseja adicionar mais artefatos a uma alteração existente?**

```
/opsx:continue add-my-feature
```

Mostra o que está pronto para criar com base no que já existe.

**Precisa ver o status?**

```bash
openspec status --change add-my-feature
```

---

## O Novo Sistema de Configuração

### Estrutura do config.yaml

```yaml
# Obrigatório: Esquema padrão para novas alterações
schema: spec-driven

# Opcional: Contexto do projeto (máx. 50KB)
# Injetado em TODAS as instruções de artefatos
context: |
  Histórico do projeto, stack tecnológica,
  convenções e restrições.

# Opcional: Regras por artefato
# Injetado apenas nos artefatos correspondentes
rules:
  proposal:
    - Incluir plano de reversão
  specs:
    - Usar formato Dado/Quando/Então
  design:
    - Documentar estratégias de fallback
  tasks:
    - Dividir em tarefas de no máximo 2 horas
```

### Resolução de Esquema

Ao determinar qual esquema usar, o OPSX verifica na seguinte ordem:

1. **Sinalizador CLI**: `--schema <nome>` (maior prioridade)
2. **Metadados da alteração**: `.openspec.yaml` no diretório da alteração
3. **Configuração do projeto**: `openspec/config.yaml`
4. **Padrão**: `spec-driven`

### Esquemas Disponíveis

| Esquema | Artefatos | Melhor Para |
|---------|-----------|-------------|
| `spec-driven` | proposal → specs → design → tasks | Maioria dos projetos |

Listar todos os esquemas disponíveis:

```bash
openspec schemas
```

### Esquemas Personalizados

Crie seu próprio fluxo de trabalho:

```bash
openspec schema init my-workflow
```

Ou faça fork de um existente:

```bash
openspec schema fork spec-driven my-workflow
```

Consulte [Personalização](customization.md) para obter detalhes.

---

## Solução de Problemas

### "Arquivos legados detectados em modo não interativo"

Você está executando em um ambiente de CI ou não interativo. Use:

```bash
openspec init --force
```

### Comandos não aparecem após a migração

Reinicie seu IDE. As habilidades são detectadas na inicialização.

### "ID de artefato desconhecido nas regras"

Verifique se as chaves `rules:` correspondem aos IDs de artefato do seu esquema:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Execute isso para ver os IDs de artefato válidos:

```bash
openspec schemas --json
```

### Configuração não está sendo aplicada

1. Certifique-se de que o arquivo está em `openspec/config.yaml` (não `.yml`)
2. Valide a sintaxe YAML
3. As alterações na configuração entram em vigor imediatamente — nenhuma reinicialização necessária

### project.md não migrado

O sistema preserva intencionalmente o `project.md` porque ele pode conter seu conteúdo personalizado. Revise-o manualmente, mova as partes úteis para o `config.yaml` e depois exclua-o.

### Deseja ver o que seria limpo?

Execute init e recuse o prompt de limpeza — você verá o resumo completo de detecção sem que nenhuma alteração seja feita.

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
│   └── skills/                   # NOVO: Habilidades OPSX
│       ├── openspec-propose/     # perfil principal padrão
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # perfil expandido adiciona new/continue/ff/etc.
├── CLAUDE.md                     # Marcadores OpenSpec removidos, seu conteúdo preservado
└── AGENTS.md                     # Marcadores OpenSpec removidos, seu conteúdo preservado
```

### O Que Foi Removido

- `.claude/commands/openspec/` — substituído por `.claude/skills/`
- `openspec/AGENTS.md` — obsoleto
- `openspec/project.md` — migrar para `config.yaml`, depois excluir
- Blocos de marcadores OpenSpec em `CLAUDE.md`, `AGENTS.md`, etc.

### Lista de Comandos

```text
/opsx:propose      Iniciar rapidamente (perfil principal padrão)
/opsx:apply        Implementar tarefas
/opsx:archive      Finalizar e arquivar

# Fluxo de trabalho expandido (se habilitado):
/opsx:new          Estruturar uma alteração
/opsx:continue     Criar próximo artefato
/opsx:ff           Criar artefatos de planejamento
```

---

## Obtendo Ajuda

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Documentação**: [docs/opsx.md](opsx.md) para a referência completa do OPSX