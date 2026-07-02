# Comandos

Esta é a referência para os comandos de barra (slash) do OpenSpec. Estes comandos são invocados na interface de chat do seu assistente de codificação IA (por exemplo, Claude Code, Cursor, Windsurf).

Para padrões de fluxo de trabalho e quando usar cada comando, consulte [Workflows](workflows.md). Para comandos CLI, consulte [CLI](cli.md).

## Referência Rápida

### Caminho Rápido Padrão (`core` profile)

| Comando | Propósito |
|---------|---------|
| `/opsx:propose` | Cria uma alteração e gera artefatos de planejamento em uma etapa. |
| `/opsx:explore` | Reflete sobre ideias antes de se comprometer com uma alteração. |
| `/opsx:apply` | Implementa tarefas da alteração. |
| `/opsx:sync` | Mescla especificações delta nas especificações principais. |
| `/opsx:archive` | Arquiva uma alteração concluída. |

### Comandos de Fluxo de Trabalho Expandidos (seleção customizada de fluxo de trabalho)

| Comando | Propósito |
|---------|---------|
| `/opsx:new` | Inicia um novo esqueleto de alteração. |
| `/opsx:continue` | Cria o próximo artefato com base nas dependências. |
| `/opsx:ff` | Avançar rapidamente (fast-forward): cria todos os artefatos de planejamento de uma vez. |
| `/opsx:verify` | Valida se a implementação corresponde aos artefatos. |
| `/opsx:bulk-archive` | Arquiva múltiplas alterações de uma só vez. |
| `/opsx:onboard` | Tutorial guiado através do fluxo de trabalho completo. |

O perfil global padrão é `core`. Para habilitar os comandos de fluxo de trabalho expandidos, execute `openspec config profile`, selecione os fluxos de trabalho e, em seguida, execute `openspec update` no seu projeto.

## Referência de Comandos

### `/opsx:propose`

Cria uma nova mudança e gera artefatos de planejamento em um único passo. Este é o comando inicial padrão no perfil `core`.

**Sintaxe:**
```text
/opsx:propose [change-name-or-description]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name-or-description` | Não | Nome em kebab-case ou descrição da mudança em linguagem simples |

**O que faz:**
- Cria `openspec/changes/<change-name>/`
- Gera os artefatos necessários antes da implementação (para `spec-driven`: proposta, especificações, design, tarefas)
- Para quando a mudança estiver pronta para `/opsx:apply`

**Exemplo:**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**Dicas:**
- Use isto para o caminho mais rápido de ponta a ponta
- Se você quiser controle granular dos artefatos, habilite fluxos de trabalho expandidos e use `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **Comece aqui quando não tiver certeza.** Explore é um parceiro de pensamento sem riscos: ele lê sua codebase, compara opções e transforma uma ideia vaga em um plano concreto antes que qualquer mudança exista. Ele vem no perfil padrão. Para o caso completo e mais exemplos, consulte o guia [Explore First](explore.md).

Pense sobre ideias, investigue problemas e esclareça requisitos antes de se comprometer com uma mudança.

**Sintaxe:**
```
/opsx:explore [topic]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `topic` | Não | O que você quer explorar ou investigar |

**O que faz:**
- Abre uma conversa exploratória sem exigir estrutura
- Investiga a codebase para responder perguntas
- Compara opções e abordagens
- Cria diagramas visuais para esclarecer o pensamento
- Pode transicionar para `/opsx:propose` (padrão) ou `/opsx:new` (fluxo de trabalho expandido) quando os insights se cristalizam

**Exemplo:**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT. Can we start a change for that?

AI:  Ready when you are. Run /opsx:propose add-jwt-auth to begin.
```

**Dicas:**
- Use quando os requisitos não estão claros ou você precisa investigar
- Nenhum artefato é criado durante a exploração
- Bom para comparar múltiplas abordagens antes de decidir
- Pode ler arquivos e pesquisar na codebase

---

### `/opsx:new`

Inicie um novo scaffold de mudança. Cria a pasta da mudança e espera que você gere os artefatos com `/opsx:continue` ou `/opsx:ff`.

Este comando faz parte do conjunto de fluxo de trabalho expandido (não incluído no perfil `core` padrão).

**Sintaxe:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Nome para a pasta da mudança (solicitado se não for fornecido) |
| `--schema` | Não | Esquema de fluxo de trabalho a ser usado (padrão: do config ou `spec-driven`) |

**O que faz:**
- Cria o diretório `openspec/changes/<change-name>/`
- Cria o arquivo de metadados `.openspec.yaml` na pasta da mudança
- Mostra o primeiro template de artefato pronto para criação
- Solicita nome e esquema da mudança se não forem fornecidos

**O que cria:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Metadados da mudança (esquema, data de criação)
```

**Exemplo:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**Dicas:**
- Use nomes descritivos: `add-feature`, `fix-bug`, `refactor-module`
- Evite nomes genéricos como `update`, `changes`, `wip`
- O esquema também pode ser definido no config do projeto (`openspec/config.yaml`)

---

### `/opsx:continue`

Cria o próximo artefato na cadeia de dependências. Cria um artefato por vez para progresso incremental.

**Sintaxe:**
```
/opsx:continue [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Qual mudança continuar (inferido do contexto se não for fornecido) |

**O que faz:**
- Consulta o grafo de dependência dos artefatos
- Mostra quais artefatos estão prontos vs bloqueados
- Cria o primeiro artefato pronto
- Lê os arquivos de dependência para contexto
- Mostra o que fica disponível após a criação

**Exemplo:**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: tasks
     Run /opsx:continue to create the next artifact.
```

**Dicas:**
- Use quando quiser revisar cada artefato antes de prosseguir
- Bom para mudanças complexas onde você deseja controle
- Múltiplos artefatos podem ficar prontos simultaneamente
- Você pode editar os artefatos criados antes de continuar

---

### `/opsx:ff`

Avança rapidamente a criação dos artefatos. Cria todos os artefatos de planejamento de uma vez.

**Sintaxe:**
```
/opsx:ff [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Qual mudança avançar rapidamente (inferido do contexto se não for fornecido) |

**O que faz:**
- Cria todos os artefatos na ordem de dependência
- Rastreia o progresso através da lista de tarefas (todo list)
- Para quando todos os artefatos `apply-required` estiverem completos
- Lê cada dependência antes de criar o próximo artefato

**Exemplo:**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**Dicas:**
- Use quando tiver uma visão clara do que está construindo
- Mais rápido do que `/opsx:continue` para mudanças diretas
- Você ainda pode editar os artefatos depois
- Bom para funcionalidades pequenas a médias

---

### `/opsx:apply`

Implementa as tarefas da mudança. Percorre a lista de tarefas, escrevendo código e marcando itens como concluídos.

**Sintaxe:**
```
/opsx:apply [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Qual mudança implementar (inferido do contexto se não for fornecido) |

**O que faz:**
- Lê o `tasks.md` e identifica tarefas incompletas
- Percorre as tarefas uma por uma
- Escreve código, cria arquivos, executa testes conforme necessário
- Marca as tarefas como concluídas com checkboxes `[x]`

**Exemplo:**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**Dicas:**
- Pode retomar de onde parou se for interrompido
- Use para mudanças paralelas, especificando o nome da mudança
- O estado de conclusão é rastreado nos checkboxes do `tasks.md`

---

### `/opsx:verify`

Valida que a implementação corresponde aos artefatos da sua mudança. Verifica completude, correção e coerência.

**Sintaxe:**
```
/opsx:verify [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Qual mudança verificar (inferido do contexto se não for fornecido) |

**O que faz:**
- Verifica três dimensões de qualidade da implementação
- Pesquisa a codebase em busca de evidências de implementação
- Relata problemas categorizados como CRITICAL, WARNING ou SUGGESTION
- Não bloqueia o arquivamento, mas exibe os problemas

**Dimensões de Verificação:**

| Dimensão | O que valida |
|-----------|-------------------|
| **Completeness** | Todas as tarefas concluídas, todos os requisitos implementados, cenários cobertos |
| **Correctness** | A implementação corresponde à intenção da especificação, casos extremos tratados |
| **Coherence** | Decisões de design refletidas no código, padrões consistentes |

**Exemplo:**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**Dicas:**
- Execute antes de arquivar para pegar incompatibilidades cedo
- Avisos não bloqueiam o arquivamento, mas indicam potenciais problemas
- Bom para revisar o trabalho da IA antes de se comprometer
- Pode revelar desvios entre os artefatos e a implementação

---

### `/opsx:sync`

**Comando Opcional.** Mescla especificações delta de uma mudança nas especificações principais. O arquivamento solicitará a sincronização, se necessário, portanto, você geralmente não precisa executar isso manualmente.

**Sintaxe:**
```
/opsx:sync [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Qual mudança sincronizar (inferido do contexto se não for fornecido) |

**O que faz:**
- Lê as especificações delta da pasta da mudança
- Analisa as seções ADDED/MODIFIED/REMOVED/RENAMED
- Mescla as mudanças no diretório principal `openspec/specs/`
- Preserva o conteúdo existente não mencionado no delta
- Não arquiva a mudança (permanece ativa)

**Exemplo:**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**Quando usar manualmente:**

| Cenário | Usar sync? |
|----------|-----------|
| Mudança de longa duração, quer as especificações no principal antes de arquivar | Sim |
| Múltiplas mudanças paralelas precisam das especificações base atualizadas | Sim |
| Quer pré-visualizar/revisar a mesclagem separadamente | Sim |
| Mudança rápida, indo direto para o arquivo | Não (o arquivo lida com isso) |

**Dicas:**
- Sync é inteligente, não é copiar e colar
- Pode adicionar cenários aos requisitos existentes sem duplicar
- A mudança permanece ativa após a sincronização (não arquivada)
- A maioria dos usuários nunca precisará chamar isso diretamente — o arquivo solicita se necessário

---

### `/opsx:archive`

Arquiva uma mudança concluída. Finaliza a mudança e move-a para a pasta de arquivo.

**Sintaxe:**
```
/opsx:archive [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Qual mudança arquivar (inferido do contexto se não for fornecido) |

**O que faz:**
- Verifica o status de conclusão dos artefatos
- Verifica a conclusão das tarefas (avisa se estiverem incompletas)
- Oferece para sincronizar as especificações delta se ainda não tiver sido feito
- Move a pasta da mudança para `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Preserva todos os artefatos para trilha de auditoria

**Exemplo:**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**Dicas:**
- O arquivo não bloqueará por tarefas incompletas, mas avisará
- As especificações delta podem ser sincronizadas durante o arquivamento ou antes
- Mudanças arquivadas são preservadas para histórico
- Use `/opsx:verify` primeiro para pegar problemas

---

### `/opsx:bulk-archive`

Arquiva múltiplas mudanças concluídas de uma vez. Lida com conflitos de especificações entre as mudanças.

**Sintaxe:**
```
/opsx:bulk-archive [change-names...]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-names` | Não | Mudanças específicas a arquivar (solicita seleção se não forem fornecidas) |

**O que faz:**
- Lista todas as mudanças concluídas
- Valida cada mudança antes de arquivar
- Detecta conflitos de especificações entre as mudanças
- Resolve conflitos verificando o que foi realmente implementado
- Arquiva em ordem cronológica

**Exemplo:**
```text
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**Dicas:**
- Bom para fluxos de trabalho paralelos
- A resolução de conflitos é agente (verifica a codebase)
- As mudanças são arquivadas na ordem da criação
- Solicita antes de sobrescrever o conteúdo das especificações

---

### `/opsx:onboard`

Onboarding guiado através do fluxo de trabalho completo do OpenSpec. Um tutorial interativo usando sua própria codebase.

**Sintaxe:**
```
/opsx:onboard
```

**O que faz:**
- Percorre um ciclo de fluxo de trabalho completo com narração
- Escaneia sua codebase em busca de oportunidades reais de melhoria
- Cria uma mudança real com artefatos reais
- Implementa trabalho real (mudanças pequenas e seguras)
- Arquiva a mudança concluída
- Explica cada passo à medida que acontece

**Fases:**
1. Boas-vindas e análise da codebase
2. Encontrar uma oportunidade de melhoria
3. Criar uma mudança (`/opsx:new`)
4. Escrever a proposta
5. Criar especificações (specs)
6. Escrever o design
7. Criar tarefas
8. Implementar as tarefas (`/opsx:apply`)
9. Verificar a implementação
10. Arquivar a mudança
11. Resumo e próximos passos

**Exemplo:**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**Dicas:**
- Melhor para novos usuários que estão aprendendo o fluxo de trabalho
- Usa código real, não exemplos de brinquedo
- Cria uma mudança real que você pode manter ou descartar
- Leva de 15 a 30 minutos para ser concluído

## Sintaxe de Comando por Ferramenta de IA

Diferentes ferramentas de IA usam sintaxes de comando ligeiramente diferentes. Use o formato que corresponde à sua ferramenta:

| Tool | Syntax Example |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Skill-based invocations such as `/skill:openspec-propose`, `/skill:openspec-apply-change` (no generated `opsx-*` command files) |
| Trae | Skill-based invocations such as `/openspec-propose`, `/openspec-apply-change` (no generated `opsx-*` command files) |

A intenção é a mesma em todas as ferramentas, mas a forma como os comandos são apresentados pode diferir dependendo da integração.

> **Nota:** Os comandos do GitHub Copilot (`.github/prompts/*.prompt.md`) estão disponíveis apenas em extensões de IDE (VS Code, JetBrains, Visual Studio). O CLI do GitHub Copilot não suporta atualmente arquivos de prompt personalizados — consulte [Ferramentas Suportadas](supported-tools.md) para detalhes e soluções alternativas.

---

## Comandos Legados

Estes comandos utilizam o fluxo de trabalho mais antigo de "tudo de uma vez". Eles ainda funcionam, mas os comandos OPSX são recomendados.

| Command | What it does |
|---------|--------------|
| `/openspec:proposal` | Create all artifacts at once (proposal, specs, design, tasks) |
| `/openspec:apply` | Implement the change |
| `/openspec:archive` | Archive the change |

**Quando usar comandos legados:**
- Projetos existentes que utilizam o fluxo de trabalho antigo
- Alterações simples onde você não precisa da criação incremental de artefatos
- Preferência pelo método de tudo ou nada

**Migrando para OPSX:**
As alterações legadas podem ser continuadas com comandos OPSX. A estrutura de artefatos é compatível.

---

## Solução de Problemas

### "Change not found"

O comando não conseguiu identificar em qual alteração trabalhar.

**Soluções:**
- Especifique o nome da alteração explicitamente: `/opsx:apply add-dark-mode`
- Verifique se a pasta da alteração existe: `openspec list`
- Verifique se você está no diretório de projeto correto

### "No artifacts ready"

Todos os artefatos estão completos ou bloqueados por dependências ausentes.

**Soluções:**
- Execute `openspec status --change <name>` para ver o que está bloqueando
- Verifique se os artefatos necessários existem
- Crie primeiro os artefatos de dependência ausentes

### "Schema not found"

O esquema especificado não existe.

**Soluções:**
- Liste os esquemas disponíveis: `openspec schemas`
- Verifique a grafia do nome do esquema
- Crie o esquema se ele for customizado: `openspec schema init <name>`

### Commands not recognized

A ferramenta de IA não reconhece os comandos OpenSpec.

**Soluções:**
- Garanta que o OpenSpec foi inicializado: `openspec init`
- Gere novamente as skills: `openspec update`
- Verifique se o diretório `.claude/skills/` existe (para Claude Code)
- Reinicie sua ferramenta de IA para que ela carregue os novos skills

### Artifacts not generating properly

A IA cria artefatos incompletos ou incorretos.

**Soluções:**
- Adicione contexto do projeto em `openspec/config.yaml`
- Adicione regras por artefato para orientação específica
- Forneça mais detalhes na descrição da sua alteração
- Use `/opsx:continue` em vez de `/opsx:ff` para ter mais controle

---

## Próximos Passos

- [Workflows](workflows.md) - Padrões comuns e quando usar cada comando
- [CLI](cli.md) - Comandos de terminal para gerenciamento e validação
- [Customization](customization.md) - Crie esquemas e fluxos de trabalho personalizados