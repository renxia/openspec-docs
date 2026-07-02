# Comandos

Esta é a referência para os comandos de barra (slash) do OpenSpec. Esses comandos são invocados na interface de chat do seu assistente de codificação IA (por exemplo, Claude Code, Cursor, Windsurf).

Para padrões de fluxo de trabalho e quando usar cada comando, consulte [Workflows](workflows.md). Para comandos CLI, consulte [CLI](cli.md).

## Referência Rápida

### Caminho Rápido Padrão (`core` profile)

| Comando | Propósito |
|---------|---------|
| `/opsx:propose` | Criar uma mudança e gerar artefatos de planejamento em uma etapa |
| `/opsx:explore` | Pensar sobre ideias antes de se comprometer com uma mudança |
| `/opsx:apply` | Implementar tarefas da mudança |
| `/opsx:sync` | Mesclar especificações delta nas especificações principais |
| `/opsx:archive` | Arquivar uma mudança concluída |

### Comandos de Fluxo de Trabalho Expandidos (seleção personalizada de fluxo de trabalho)

| Comando | Propósito |
|---------|---------|
| `/opsx:new` | Iniciar um novo scaffold de mudança |
| `/opsx:continue` | Criar o próximo artefato com base nas dependências |
| `/opsx:ff` | Avançar rapidamente (fast-forward): criar todos os artefatos de planejamento de uma vez |
| `/opsx:verify` | Validar se a implementação corresponde aos artefatos |
| `/opsx:bulk-archive` | Arquivar várias mudanças de uma só vez |
| `/opsx:onboard` | Tutorial guiado pelo fluxo de trabalho completo |

O perfil global padrão é `core`. Para habilitar os comandos de fluxo de trabalho expandidos, execute `openspec config profile`, selecione os fluxos de trabalho e, em seguida, execute `openspec update` no seu projeto.

## Referência de Comandos

### `/opsx:propose`

Cria uma nova alteração e gera artefatos de planejamento em um único passo. Este é o comando inicial padrão no perfil `core`.

**Sintaxe:**
```text
/opsx:propose [change-name-or-description]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name-or-description` | Não | Nome em kebab-case ou descrição da alteração em linguagem simples |

**O que faz:**
- Cria `openspec/changes/<change-name>/`
- Gera os artefatos necessários antes da implementação (para `spec-driven`: proposal, specs, design, tasks)
- Para quando a alteração estiver pronta para `/opsx:apply`

**Exemplo:**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Pronto para implementação. Execute /opsx:apply.
```

**Dicas:**
- Use isto para o caminho mais rápido de ponta a ponta
- Se você quiser controle granular dos artefatos, ative os fluxos de trabalho expandidos e use `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **Comece aqui quando estiver em dúvida.** Explore é um parceiro de pensamento sem riscos: ele lê sua codebase, compara opções e transforma uma ideia vaga em um plano concreto antes que qualquer alteração exista. Ele vem no perfil padrão. Para o caso completo e mais exemplos, consulte o guia [Explore First](explore.md).

Pense sobre ideias, investigue problemas e esclareça requisitos antes de se comprometer com uma alteração.

**Sintaxe:**
```
/opsx:explore [topic]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `topic` | Não | O que você deseja explorar ou investigar |

**O que faz:**
- Abre uma conversa exploratória sem exigir estrutura
- Investiga a codebase para responder perguntas
- Compara opções e abordagens
- Cria diagramas visuais para esclarecer o pensamento
- Pode transicionar para `/opsx:propose` (padrão) ou `/opsx:new` (fluxo de trabalho expandido) quando os insights se cristalizam

**Exemplo:**
```text
You: /opsx:explore

AI:  O que você gostaria de explorar?

You: Como devemos lidar com a autenticação para o aplicativo móvel?

AI:  Deixe-me investigar sua configuração atual de autenticação...
     [Analisa codebase]

     Vejo que você está usando autenticação baseada em sessão para o aplicativo web.
     Para o celular, temos três opções principais:

     1. Tokens JWT (stateless, funciona offline)
     2. OAuth2 (se precisar de login de terceiros)
     3. Estender sessões atuais (mais simples, mas requer conectividade)

     Sua API já tem CORS configurado. Qual direção lhe interessa?

You: Vamos com JWT. Podemos começar uma alteração para isso?

AI:  Pronto quando você estiver. Execute /opsx:propose add-jwt-auth para começar.
```

**Dicas:**
- Use quando os requisitos não estão claros ou você precisa investigar
- Nenhum artefato é criado durante a exploração
- Bom para comparar múltiplas abordagens antes de decidir
- Pode ler arquivos e pesquisar na codebase

---

### `/opsx:new`

Inicia um novo scaffold de alteração. Cria a pasta da alteração e espera que você gere os artefatos com `/opsx:continue` ou `/opsx:ff`.

Este comando faz parte do conjunto de fluxo de trabalho expandido (não incluído no perfil `core` padrão).

**Sintaxe:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Nome para a pasta da alteração (é solicitado se não for fornecido) |
| `--schema` | Não | Schema de fluxo de trabalho a ser usado (padrão: do config ou `spec-driven`) |

**O que faz:**
- Cria o diretório `openspec/changes/<change-name>/`
- Cria o arquivo de metadados `.openspec.yaml` na pasta da alteração
- Mostra o primeiro template de artefato pronto para criação
- Solicita o nome e o schema da alteração se não forem fornecidos

**O que cria:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Metadados da alteração (schema, data de criação)
```

**Exemplo:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Pronto para criar: proposal
     Use /opsx:continue para criá-lo, ou /opsx:ff para criar todos os artefatos.
```

**Dicas:**
- Use nomes descritivos: `add-feature`, `fix-bug`, `refactor-module`
- Evite nomes genéricos como `update`, `changes`, `wip`
- O schema também pode ser definido na configuração do projeto (`openspec/config.yaml`)

---

### `/opsx:continue`

Cria o próximo artefato na cadeia de dependência. Cria um artefato por vez para progresso incremental.

**Sintaxe:**
```
/opsx:continue [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Qual alteração continuar (inferido do contexto se não for fornecido) |

**O que faz:**
- Consulta o grafo de dependência dos artefatos
- Mostra quais artefatos estão prontos versus bloqueados
- Cria o primeiro artefato pronto
- Lê os arquivos de dependência para contexto
- Mostra o que fica disponível após a criação

**Exemplo:**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Status dos artefatos:
     ✓ proposal    (feito)
     ◆ specs       (pronto)
     ◆ design      (pronto)
     ○ tasks       (bloqueado - precisa de: specs)

     Criando specs...

     [Lê proposal.md, cria specs com base nos requisitos]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Agora disponível: tasks
     Execute /opsx:continue para criar o próximo artefato.
```

**Dicas:**
- Use quando quiser revisar cada artefato antes de prosseguir
- Bom para alterações complexas onde você deseja controle
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
| `change-name` | Não | Qual alteração avançar rapidamente (inferido do contexto se não for fornecido) |

**O que faz:**
- Cria todos os artefatos em ordem de dependência
- Rastreia o progresso através da lista de tarefas
- Para quando todos os artefatos `apply-required` estiverem completos
- Lê cada dependência antes de criar o próximo artefato

**Exemplo:**
```
You: /opsx:ff add-dark-mode

AI:  Avançando rapidamente add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     Todos os artefatos de planejamento estão completos!
     Pronto para implementação. Execute /opsx:apply para começar.
```

**Dicas:**
- Use quando tiver uma visão clara do que está construindo
- Mais rápido do que `/opsx:continue` para alterações diretas
- Você ainda pode editar os artefatos depois
- Bom para recursos pequenos a médios

---

### `/opsx:apply`

Implementa as tarefas da alteração. Percorre a lista de tarefas, escrevendo código e marcando itens como concluídos.

**Sintaxe:**
```
/opsx:apply [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Qual alteração implementar (inferido do contexto se não for fornecido) |

**O que faz:**
- Lê o `tasks.md` e identifica tarefas incompletas
- Trabalha nas tarefas uma por uma
- Escreve código, cria arquivos, executa testes conforme necessário
- Marca as tarefas como concluídas com checkboxes `[x]`

**Exemplo:**
```
You: /opsx:apply

AI:  Implementando add-dark-mode...

     Lendo tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Trabalhando em 1.1: Create ThemeContext...
     [Cria src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Trabalhando em 1.2: Add CSS custom properties...
     [Atualiza src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**Dicas:**
- Pode retomar de onde parou se for interrompido
- Use para alterações paralelas, especificando o nome da alteração
- O estado de conclusão é rastreado nos checkboxes do `tasks.md`

---

### `/opsx:verify`

Valida se a implementação corresponde aos artefatos da alteração. Verifica completude, correção e coerência.

**Sintaxe:**
```
/opsx:verify [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Qual alteração verificar (inferido do contexto se não for fornecido) |

**O que faz:**
- Verifica três dimensões de qualidade da implementação
- Pesquisa a codebase em busca de evidências de implementação
- Relata problemas categorizados como CRITICAL, WARNING ou SUGGESTION
- Não bloqueia o arquivo, mas expõe os problemas

**Dimensões de Verificação:**

| Dimensão | O que valida |
|-----------|-------------------|
| **Completeness** | Todas as tarefas feitas, todos os requisitos implementados, cenários cobertos |
| **Correctness** | Implementação corresponde à intenção do spec, casos extremos tratados |
| **Coherence** | Decisões de design refletidas no código, padrões consistentes |

**Exemplo:**
```
You: /opsx:verify

AI:  Verificando add-dark-mode...

     COMPLETENESS
     ✓ Todas as 8 tarefas em tasks.md estão verificadas
     ✓ Todos os requisitos nos specs têm código correspondente
     ⚠ O cenário "Detecção de preferência do sistema" não tem cobertura de teste

     CORRECTNESS
     ✓ A implementação corresponde à intenção do spec
     ✓ Casos extremos dos cenários são tratados
     ✓ Estados de erro correspondem às definições do spec

     COHERENCE
     ✓ Decisões de design refletidas na estrutura do código
     ✓ Convenções de nomenclatura consistentes com design.md
     ⚠ O Design menciona "variáveis CSS" mas a implementação usa classes Tailwind

     RESUMO
     ─────────────────────────────
     Problemas Críticos: 0
     Avisos: 2
     Pronto para arquivar: Sim (com avisos)

     Recomendações:
     1. Adicionar teste para detecção de preferência do sistema
     2. Atualizar design.md para refletir o uso do Tailwind, ou refatorar para usar variáveis CSS
```

**Dicas:**
- Execute antes de arquivar para pegar desalinhamentos precocemente
- Avisos não bloqueiam o arquivo, mas indicam potenciais problemas
- Bom para revisar o trabalho da IA antes de se comprometer
- Pode revelar desvios entre os artefatos e a implementação

---

### `/opsx:sync`

**Comando opcional.** Mescla specs delta de uma alteração nos specs principais. O arquivo solicitará sincronização se necessário, então você geralmente não precisa executar isso manualmente.

**Sintaxe:**
```
/opsx:sync [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Qual alteração sincronizar (inferido do contexto se não for fornecido) |

**O que faz:**
- Lê os specs delta da pasta da alteração
- Analisa as seções ADDED/MODIFIED/REMOVED/RENAMED
- Mescla as mudanças no diretório principal `openspec/specs/`
- Preserva o conteúdo existente não mencionado no delta
- Não arquiva a alteração (permanece ativa)

**Exemplo:**
```text
You: /opsx:sync

AI:  Sincronizando specs delta de add-dark-mode...

     Lendo: openspec/changes/add-dark-mode/specs/ui/spec.md
     Alvo:  openspec/specs/ui/spec.md

     Mudanças a aplicar:
     ✓ ADDED: Requisito de Seleção de Tema (2 cenários)
     ✓ ADDED: Requisito de Acessibilidade (1 cenário)

     Mesclando...
     ✓ openspec/specs/ui/spec.md atualizado

     A alteração permanece ativa. Execute /opsx:archive quando estiver pronto para concluir.
```

**Quando usar manualmente:**

| Cenário | Usar sync? |
|----------|-----------|
| Alteração de longa duração, quer specs no principal antes de arquivar | Sim |
| Múltiplas alterações paralelas precisam dos specs base atualizados | Sim |
| Quer pré-visualizar/revisar a mesclagem separadamente | Sim |
| Mudança rápida, indo direto para o arquivo | Não (o archive cuida disso) |

**Dicas:**
- Sync é inteligente, não é copiar e colar
- Pode adicionar cenários aos requisitos existentes sem duplicar
- A alteração permanece ativa após a sincronização (não arquivada)
- A maioria dos usuários nunca precisará chamar isso diretamente — o archive solicita se necessário

---

### `/opsx:archive`

Arquiva uma alteração concluída. Finaliza a alteração e move-a para a pasta de arquivo.

**Sintaxe:**
```
/opsx:archive [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Qual alteração arquivar (inferido do contexto se não for fornecido) |

**O que faz:**
- Verifica o status de conclusão dos artefatos
- Verifica a conclusão das tarefas (avisa se estiver incompleto)
- Oferece para sincronizar os specs delta se ainda não tiver sido feito
- Move a pasta da alteração para `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Preserva todos os artefatos para trilha de auditoria

**Exemplo:**
```
You: /opsx:archive

AI:  Arquivando add-dark-mode...

     Status dos artefatos:
     ✓ proposal.md existe
     ✓ specs/ existe
     ✓ design.md existe
     ✓ tasks.md existe (8/8 tarefas concluídas)

     Delta specs: Ainda não sincronizado
     → Sincronizar agora? (recomendado)

You: Yes

AI:  ✓ Specs sincronizados para openspec/specs/ui/spec.md
     ✓ Movido para openspec/changes/archive/2025-01-24-add-dark-mode/

     Alteração arquivada com sucesso.
```

**Dicas:**
- O arquivo não bloqueará por tarefas incompletas, mas avisará
- Os specs delta podem ser sincronizados durante o arquivo ou antes
- As alterações arquivadas são preservadas para histórico
- Use `/opsx:verify` primeiro para pegar problemas

---

### `/opsx:bulk-archive`

Arquiva múltiplas alterações concluídas de uma só vez. Lida com conflitos de specs entre as alterações.

**Sintaxe:**
```
/opsx:bulk-archive [change-names...]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-names` | Não | Alterações específicas a serem arquivadas (solicita seleção se não forem fornecidas) |

**O que faz:**
- Lista todas as alterações concluídas
- Valida cada alteração antes de arquivar
- Detecta conflitos de specs entre as alterações
- Resolve conflitos verificando o que foi realmente implementado
- Arquiva em ordem cronológica

**Exemplo:**
```
You: /opsx:bulk-archive

AI:  Encontrados 3 alterações concluídas:
     - add-dark-mode (8/8 tarefas concluídas)
     - fix-login-bug (3/3 tarefas concluídas)
     - update-footer (2/2 tarefas concluídas)

     Verificando conflitos de specs...
     ⚠ add-dark-mode e update-footer ambos tocam em specs/ui/

     Inspecionando a codebase para resolver...
     Ambas as alterações estão implementadas. Será mesclado na ordem cronológica:
     1. add-dark-mode (criada em Jan 20)
     2. update-footer (criada em Jan 22)

     Arquivar todas as 3 alterações?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs mesclados: add-dark-mode → update-footer
```

**Dicas:**
- Bom para fluxos de trabalho paralelos
- A resolução de conflitos é agentic (verifica a codebase)
- As alterações são arquivadas na ordem da criação
- Solicita antes de sobrescrever o conteúdo do spec

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
- Cria uma alteração real com artefatos reais
- Implementa trabalho real (mudanças pequenas e seguras)
- Arquiva a alteração concluída
- Explica cada passo conforme ele acontece

**Fases:**
1. Boas-vindas e análise da codebase
2. Encontrar uma oportunidade de melhoria
3. Criar uma alteração (`/opsx:new`)
4. Escrever a proposta
5. Criar specs
6. Escrever o design
7. Criar tarefas
8. Implementar tarefas (`/opsx:apply`)
9. Verificar implementação
10. Arquivar a alteração
11. Resumo e próximos passos

**Exemplo:**
```
You: /opsx:onboard

AI:  Bem-vindo ao OpenSpec!

     Vou guiá-lo através do fluxo de trabalho completo usando sua própria codebase.
     Encontraremos algo pequeno para melhorar, criaremos uma alteração adequada para isso,
     implementaremos e arquivaremos.

     Deixe-me escanear sua codebase em busca de oportunidades...

     [Analisa codebase]

     Encontrei algumas coisas em que poderíamos trabalhar:
     1. Adicionar validação de entrada ao formulário de contato
     2. Melhorar as mensagens de erro no fluxo de autenticação
     3. Adicionar estados de carregamento a botões assíncronos

     Qual lhe interessa? (ou sugira outra coisa)
```

**Dicas:**
- Melhor para novos usuários que estão aprendendo o fluxo de trabalho
- Usa código real, não exemplos de brinquedo
- Cria uma alteração real que você pode manter ou descartar
- Leva de 15 a 30 minutos para concluir

## Sintaxe de Comandos por Ferramenta de IA

Diferentes ferramentas de IA usam sintaxes de comando ligeiramente diferentes. Use o formato que corresponde à sua ferramenta:

| Tool | Syntax Example |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Skill-based invocations such as `/skill:openspec-propose`, `/skill:openspec-apply-change` (no generated `opsx-*` command files) |
| Trae | Skill-based invocations such as `/openspec-propose`, `/openspec-apply-change` (no generated `opsx-*` command files) |

A intenção é a mesma em todas as ferramentas, mas a forma como os comandos são expostos pode diferir dependendo da integração.

> **Nota:** Os comandos do GitHub Copilot (`.github/prompts/*.prompt.md`) estão disponíveis apenas em extensões de IDE (VS Code, JetBrains, Visual Studio). O GitHub Copilot CLI não suporta atualmente arquivos de prompt personalizados — consulte [Supported Tools](supported-tools.md) para detalhes e soluções alternativas.

---

## Comandos Legados

Estes comandos usam o fluxo de trabalho mais antigo de "tudo de uma vez". Eles ainda funcionam, mas os comandos OPSX são recomendados.

| Command | What it does |
|---------|--------------|
| `/openspec:proposal` | Cria todos os artefatos de uma só vez (proposta, especificações, design, tarefas) |
| `/openspec:apply` | Implementa a mudança |
| `/openspec:archive` | Arquiva a mudança |

**Quando usar comandos legados:**
- Projetos existentes que utilizam o fluxo de trabalho antigo
- Mudanças simples onde você não precisa da criação incremental de artefatos
- Preferência pela abordagem "tudo ou nada"

**Migrando para OPSX:**
Mudanças legadas podem ser continuadas com os comandos OPSX. A estrutura dos artefatos é compatível.

---

## Solução de Problemas (Troubleshooting)

### "Change not found" (Mudança não encontrada)

O comando não conseguiu identificar em qual mudança trabalhar.

**Soluções:**
- Especifique o nome da mudança explicitamente: `/opsx:apply add-dark-mode`
- Verifique se a pasta da mudança existe: `openspec list`
- Confirme se você está no diretório do projeto correto

### "No artifacts ready" (Nenhum artefato pronto)

Todos os artefatos estão completos ou bloqueados por dependências ausentes.

**Soluções:**
- Execute `openspec status --change <name>` para ver o que está bloqueando
- Verifique se os artefatos necessários existem
- Crie primeiro os artefatos de dependência ausentes

### "Schema not found" (Schema não encontrado)

O schema especificado não existe.

**Soluções:**
- Liste os schemas disponíveis: `openspec schemas`
- Verifique a grafia do nome do schema
- Crie o schema se ele for personalizado: `openspec schema init <name>`

### Commands not recognized (Comandos não reconhecidos)

A ferramenta de IA não reconhece os comandos OpenSpec.

**Soluções:**
- Garanta que o OpenSpec foi inicializado: `openspec init`
- Regenerar skills: `openspec update`
- Verifique se o diretório `.claude/skills/` existe (para Claude Code)
- Reinicie sua ferramenta de IA para carregar os novos skills

### Artifacts not generating properly (Artefatos não sendo gerados corretamente)

A IA cria artefatos incompletos ou incorretos.

**Soluções:**
- Adicione contexto do projeto em `openspec/config.yaml`
- Adicione regras por artefato para orientação específica
- Forneça mais detalhes na sua descrição de mudança
- Use `/opsx:continue` em vez de `/opsx:ff` para maior controle

---

## Próximos Passos

- [Workflows](workflows.md) - Padrões comuns e quando usar cada comando
- [CLI](cli.md) - Comandos de terminal para gerenciamento e validação
- [Customization](customization.md) - Crie schemas e fluxos de trabalho personalizados