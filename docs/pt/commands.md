# Comandos

Esta é a referência para os comandos de barra do OpenSpec. Esses comandos são invocados na interface de chat do seu assistente de codificação com IA (por exemplo, Claude Code, Cursor, Windsurf).

Para padrões de fluxo de trabalho e quando usar cada comando, consulte [Fluxos de Trabalho](workflows.md). Para comandos de CLI, consulte [CLI](cli.md).

## Referência Rápida

### Caminho Rápido Padrão (perfil `core`)

| Comando | Propósito |
|---------|---------|
| `/opsx:propose` | Criar uma alteração e gerar artefatos de planejamento em uma única etapa |
| `/opsx:explore` | Refletir sobre ideias antes de confirmar uma alteração |
| `/opsx:apply` | Implementar tarefas da alteração |
| `/opsx:update` | Revisar os artefatos de planejamento de uma alteração e mantê-los coerentes |
| `/opsx:sync` | Mesclar especificações delta nas especificações principais |
| `/opsx:archive` | Arquivar uma alteração concluída |

### Comandos de Fluxo de Trabalho Expandidos (seleção de fluxo de trabalho personalizado)

| Comando | Propósito |
|---------|---------|
| `/opsx:new` | Iniciar uma estrutura de alteração nova |
| `/opsx:continue` | Criar o próximo artefato com base nas dependências |
| `/opsx:ff` | Avanço rápido: criar todos os artefatos de planejamento de uma vez |
| `/opsx:verify` | Validar se a implementação corresponde aos artefatos |
| `/opsx:bulk-archive` | Arquivar várias alterações de uma vez |
| `/opsx:onboard` | Tutorial guiado pelo fluxo de trabalho completo |

O perfil global padrão é `core`. Para habilitar os comandos de fluxo de trabalho expandidos, execute `openspec config profile`, selecione os fluxos de trabalho e, em seguida, execute `openspec update` no seu projeto.

## Referência de Comandos

### `/opsx:propose`

Cria uma nova alteração e gera artefatos de planejamento em uma única etapa. Este é o comando de início padrão no perfil `core`.

**Sintaxe:**
```text
/opsx:propose [change-name-or-description]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `change-name-or-description` | Não | Nome em kebab-case ou descrição da alteração em linguagem natural |

**O que faz:**
- Cria `openspec/changes/<change-name>/`
- Gera artefatos necessários antes da implementação (para `spec-driven`: proposta, especificações, design, tarefas)
- Para quando a alteração estiver pronta para `/opsx:apply`

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
- Use este comando para o caminho ponta-a-ponta mais rápido
- Se desejar controle de artefatos passo a passo, habilite fluxos de trabalho expandidos e use `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **Comece aqui quando não tiver certeza.** Explore é um parceiro de reflexão sem riscos: ele lê sua base de código, compara opções e transforma uma ideia vaga em um plano concreto antes que qualquer alteração exista. Ele vem no perfil padrão. Para o caso completo e mais exemplos, consulte o guia [Explore First](explore.md).

Pense em ideias, investigue problemas e esclareça requisitos antes de se comprometer com uma alteração.

**Sintaxe:**
```
/opsx:explore [topic]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `topic` | Não | O que você deseja explorar ou investigar |

**O que faz:**
- Abre uma conversa exploratória sem necessidade de estrutura
- Investiga a base de código para responder perguntas
- Compara opções e abordagens
- Cria diagramas visuais para esclarecer o raciocínio
- Pode transicionar para `/opsx:propose` (padrão) ou `/opsx:new` (fluxo de trabalho expandido) quando os insights se cristalizarem

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
- Use quando os requisitos não estiverem claros ou você precisar investigar
- Nenhum artefato é criado durante a exploração
- Bom para comparar várias abordagens antes de decidir
- Pode ler arquivos e pesquisar na base de código

---

### `/opsx:new`

Inicia um esqueleto de nova alteração. Cria a pasta da alteração e aguarda você gerar artefatos com `/opsx:continue` ou `/opsx:ff`.

Este comando faz parte do conjunto de fluxos de trabalho expandidos (não incluído no perfil `core` padrão).

**Sintaxe:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `change-name` | Não | Nome para a pasta da alteração (solicitado se não fornecido) |
| `--schema` | Não | Esquema de fluxo de trabalho a ser usado (padrão: da configuração ou `spec-driven`) |

**O que faz:**
- Cria o diretório `openspec/changes/<change-name>/`
- Cria o arquivo de metadados `.openspec.yaml` na pasta da alteração
- Mostra o primeiro modelo de artefato pronto para criação
- Solicita o nome da alteração e o esquema se não fornecidos

**O que cria:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Metadados da alteração (esquema, data de criação)
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
- O esquema também pode ser definido na configuração do projeto (`openspec/config.yaml`)

---

### `/opsx:continue`

Cria o próximo artefato na cadeia de dependência. Cria um artefato por vez para progresso incremental.

**Sintaxe:**
```
/opsx:continue [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `change-name` | Não | Qual alteração continuar (inferida do contexto se não fornecida) |

**O que faz:**
- Consulta o grafo de dependência de artefatos
- Mostra quais artefatos estão prontos vs bloqueados
- Cria o primeiro artefato pronto
- Lê arquivos de dependência para contexto
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
- Bom para alterações complexas onde você quer controle
- Vários artefatos podem ficar prontos simultaneamente
- Você pode editar artefatos criados antes de continuar

---

### `/opsx:ff`

Avanço rápido na criação de artefatos. Cria todos os artefatos de planejamento de uma vez.

**Sintaxe:**
```
/opsx:ff [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `change-name` | Não | Qual alteração avançar rapidamente (inferida do contexto se não fornecida) |

**O que faz:**
- Cria todos os artefatos em ordem de dependência
- Acompanha o progresso via lista de tarefas
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
- Use quando você tiver uma ideia clara do que está construindo
- Mais rápido que `/opsx:continue` para alterações diretas
- Você ainda pode editar artefatos depois
- Bom para funcionalidades pequenas a médias

---

### `/opsx:apply`

Implementa tarefas da alteração. Trabalha na lista de tarefas, escrevendo código e marcando itens como concluídos.

**Sintaxe:**
```
/opsx:apply [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `change-name` | Não | Qual alteração implementar (inferida do contexto se não fornecida) |

**O que faz:**
- Lê `tasks.md` e identifica tarefas incompletas
- Trabalha nas tarefas uma por uma
- Escreve código, cria arquivos, executa testes conforme necessário
- Marca tarefas como concluídas com checkboxes `[x]`

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
- Use para alterações paralelas especificando o nome da alteração
- O estado de conclusão é rastreado nos checkboxes de `tasks.md`

---

### `/opsx:update`

Revisa os artefatos de planejamento existentes de uma alteração e mantém eles coerentes entre si. Apenas artefatos de planejamento - ele nunca edita código.

**Sintaxe:**

```text
/opsx:update [change-name]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `change-name` | Não | Qual alteração atualizar (inferida do contexto se não fornecida) |

**O que faz:**

- Lê os artefatos da alteração via `openspec status --change <name> --json`
- Aplica a revisão solicitada, ou revisa os artefatos em busca de contradições se você não nomeou uma
- Reconcilia os outros artefatos existentes em qualquer direção (uma edição de design pode se propagar de volta para a proposta)
- Confirma cada edição com você antes de escrever, um artefato por vez
- Termina recomendando o próximo passo: `/opsx:continue` (artefatos faltando), `/opsx:apply` (levar um plano revisado para o código), ou `/opsx:archive` (tudo pronto)

**Exemplo:**

```text
You: /opsx:update add-dark-mode - we're storing the theme in a cookie now, not localStorage

AI:  Reading add-dark-mode artifacts...

     The design references localStorage in two places; tasks 1.3 covers
     localStorage persistence; the proposal doesn't mention storage.

     Proposed revisions:
     1. design.md - swap localStorage decision for cookie storage
     2. tasks.md - reword task 1.3 to cookie persistence

     Apply revision 1? (design.md)
```

**Dicas:**

- Ele não criará artefatos faltando - isso é `/opsx:continue`
- Se a alteração já foi implementada, siga com `/opsx:apply` para que o código corresponda ao plano revisado
- Se sua revisão mudar a *intenção* da alteração, comece de novo com uma nova alteração (consulte [When to Update vs. Start Fresh](opsx.md#when-to-update-vs-start-fresh))

---

### `/opsx:verify`

Valida se a implementação corresponde aos seus artefatos de alteração. Verifica completude, correção e coerência.

**Sintaxe:**
```
/opsx:verify [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `change-name` | Não | Qual alteração verificar (inferida do contexto se não fornecida) |

**O que faz:**
- Verifica três dimensões da qualidade da implementação
- Pesquisa na base de código por evidências de implementação
- Relata problemas categorizados como CRÍTICO, AVISO ou SUGESTÃO
- Não bloqueia o arquivamento, mas superfície os problemas

**Dimensões de verificação:**

| Dimensão | O que valida |
|-----------|---------------|
| **Completude** | Todas as tarefas concluídas, todos os requisitos implementados, cenários cobertos |
| **Correção** | Implementação corresponde à intenção da especificação, casos extremos tratados |
| **Coerência** | Decisões de design refletidas no código, padrões consistentes |

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
- Execute antes de arquivar para detectar incompatibilidades cedo
- Avisos não bloqueiam o arquivamento mas indicam problemas potenciais
- Bom para revisar o trabalho da IA antes de confirmar
- Pode revelar desvio entre artefatos e implementação

---

### `/opsx:sync`

**Comando opcional.** Mescla especificações delta de uma alteração nas especificações principais. O arquivamento solicitará a sincronização se necessário, então você normalmente não precisa executar isso manualmente.

**Sintaxe:**
```
/opsx:sync [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `change-name` | Não | Qual alteração sincronizar (inferida do contexto se não fornecida) |

**O que faz:**
- Lê especificações delta da pasta da alteração
- Analisa seções ADICIONADO/MODIFICADO/REMOVIDO/RENOMEADO
- Mescla alterações no diretório principal `openspec/specs/`
- Preserva conteúdo existente não mencionado no delta
- Não arquiva a alteração (permanece ativa)

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

| Cenário | Usar sincronização? |
|-----------|-------------------|
| Alteração de longa duração, quer especificações no principal antes de arquivar | Sim |
| Múltiplas alterações paralelas precisam das especificações base atualizadas | Sim |
| Quer visualizar/revisar a mesclagem separadamente | Sim |
| Alteração rápida, indo direto para o arquivamento | Não (o arquivamento cuida disso) |

**Dicas:**
- A sincronização é inteligente, não é copiar-colar
- Pode adicionar cenários a requisitos existentes sem duplicar
- A alteração permanece ativa após a sincronização (não arquivada)
- A maioria dos usuários nunca precisará chamar isso diretamente—o arquivamento solicita se necessário

---

### `/opsx:archive`

Arquiva uma alteração concluída. Finaliza a alteração e a move para a pasta de arquivamento.

**Sintaxe:**
```
/opsx:archive [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `change-name` | Não | Qual alteração arquivar (inferida do contexto se não fornecida) |

**O que faz:**
- Verifica o status de conclusão dos artefatos
- Verifica a conclusão das tarefas (avisa se incompleto)
- Oferece sincronizar especificações delta se ainda não sincronizadas
- Move a pasta da alteração para `openspec/changes/archive/YYYY-MM-DD-<name>/`
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
- O arquivamento não bloqueará por tarefas incompletas, mas avisará
- Especificações delta podem ser sincronizadas durante o arquivamento ou antes
- Alterações arquivadas são preservadas para histórico
- Use `/opsx:verify` primeiro para detectar problemas

---

### `/opsx:bulk-archive`

Arquiva múltiplas alterações concluídas de uma vez. Lida com conflitos de especificações entre alterações.

**Sintaxe:**
```
/opsx:bulk-archive [change-names...]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `change-names` | Não | Alterações específicas para arquivar (solicita seleção se não fornecidas) |

**O que faz:**
- Lista todas as alterações concluídas
- Valida cada alteração antes de arquivar
- Detecta conflitos de especificações entre alterações
- Resolve conflitos verificando o que está realmente implementado
- Arquiva em ordem cronológica

**Exemplo:**
```
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
- A resolução de conflitos é autônoma (verifica a base de código)
- Alterações são arquivadas em ordem de criação
- Solicita antes de sobrescrever conteúdo de especificações

---

### `/opsx:onboard`

Integração guiada através do fluxo de trabalho completo do OpenSpec. Um tutorial interativo usando sua base de código real.

**Sintaxe:**
```
/opsx:onboard
```

**O que faz:**
- Percorre um ciclo completo de fluxo de trabalho com narração
- Examina sua base de código por oportunidades reais de melhoria
- Cria uma alteração real com artefatos reais
- Implementa trabalho real (alterações pequenas e seguras)
- Arquiva a alteração concluída
- Explica cada passo conforme acontece

**Fases:**
1. Boas-vindas e análise da base de código
2. Encontrando uma oportunidade de melhoria
3. Criando uma alteração (`/opsx:new`)
4. Escrevendo a proposta
5. Criando especificações
6. Escrevendo o design
7. Criando tarefas
8. Implementando tarefas (`/opsx:apply`)
9. Verificando a implementação
10. Arquivando a alteração
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
- Melhor para novos usuários aprendendo o fluxo de trabalho
- Usa código real, não exemplos de brinquedo
- Cria uma alteração real que você pode manter ou descartar
- Leva de 15 a 30 minutos para concluir

## Sintaxe de Comandos por Ferramenta de IA

Diferentes ferramentas de IA usam sintaxes de comando ligeiramente diferentes. Use o formato que corresponde à sua ferramenta:

| Ferramenta | Exemplo de Sintaxe |
|----------------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | Invocações baseadas em habilidades, como `/openspec-propose`, `/openspec-apply-change` (sem arquivos de comando `opsx-*` gerados) |
| Codex | Invocações baseadas em habilidades de `.codex/skills/openspec-*` (sem arquivos de prompt `opsx-*` gerados) |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi Code | Invocações baseadas em habilidades, como `/skill:openspec-propose`, `/skill:openspec-apply-change` (sem arquivos de comando `opsx-*` gerados) |
| Trae | `/opsx-propose`, `/opsx-apply` |

A intenção é a mesma em todas as ferramentas, mas a forma como os comandos são apresentados pode variar conforme a integração.

> **Nota:** Os comandos do GitHub Copilot (`.github/prompts/*.prompt.md`) estão disponíveis apenas nas extensões de IDE (VS Code, JetBrains, Visual Studio). O GitHub Copilot CLI atualmente não suporta arquivos de prompt personalizados — consulte [Ferramentas Suportadas](supported-tools.md) para detalhes e soluções alternativas.

---

## Comandos Legados

Estes comandos usam o fluxo de trabalho "tudo de uma vez" mais antigo. Eles ainda funcionam, mas os comandos OPSX são recomendados.

| Comando | O que faz |
|---------|--------------|
| `/openspec:proposal` | Cria todos os artefatos de uma vez (proposta, especificações, design, tarefas) |
| `/openspec:apply` | Implementa a alteração |
| `/openspec:archive` | Arquiva a alteração |

**Quando usar comandos legados:**
- Projetos existentes que usam o fluxo de trabalho antigo
- Alterações simples onde você não precisa de criação incremental de artefatos
- Preferência pela abordagem tudo ou nada

**Migrando para o OPSX:**
Alterações legadas podem ser continuadas com comandos OPSX. A estrutura de artefatos é compatível.

---

## Solução de Problemas

### "Alteração não encontrada"

O comando não conseguiu identificar qual alteração deve ser trabalhada.

**Soluções:**
- Especifique o nome da alteração explicitamente: `/opsx:apply add-dark-mode`
- Verifique se a pasta da alteração existe: `openspec list`
- Verifique se você está no diretório do projeto correto

### "Nenhum artefato pronto"

Todos os artefatos estão completos ou bloqueados por dependências ausentes.

**Soluções:**
- Execute `openspec status --change <name>` para ver o que está bloqueando
- Verifique se os artefatos necessários existem
- Crie primeiro os artefatos de dependência ausentes

### "Esquema não encontrado"

O esquema especificado não existe.

**Soluções:**
- Liste os esquemas disponíveis: `openspec schemas`
- Verifique a ortografia do nome do esquema
- Crie o esquema se for personalizado: `openspec schema init <name>`

### Comandos não reconhecidos

A ferramenta de IA não reconhece os comandos OpenSpec.

**Soluções:**
- Certifique-se de que o OpenSpec está inicializado: `openspec init`
- Regenerar as habilidades: `openspec update`
- Verifique se o diretório `.claude/skills/` existe (para o Claude Code)
- Reinicie sua ferramenta de IA para carregar as novas habilidades

### Artefatos não estão sendo gerados corretamente

A IA cria artefatos incompletos ou incorretos.

**Soluções:**
- Adicione contexto do projeto em `openspec/config.yaml`
- Adicione regras por artefato para orientação específica
- Forneça mais detalhes na descrição da sua alteração
- Use `/opsx:continue` em vez de `/opsx:ff` para mais controle

---

## Próximos Passos

- [Fluxos de Trabalho](workflows.md) - Padrões comuns e quando usar cada comando
- [CLI](cli.md) - Comandos de terminal para gerenciamento e validação
- [Personalização](customization.md) - Crie esquemas e fluxos de trabalho personalizados