# Comandos

Esta é a referência para os comandos de barra do OpenSpec. Esses comandos são invocados na interface de chat do seu assistente de codificação com IA (por exemplo, Claude Code, Cursor, Windsurf).

Para padrões de fluxo de trabalho e quando usar cada comando, consulte [Fluxos de Trabalho](workflows.md). Para comandos de CLI, consulte [CLI](cli.md).

## Referência Rápida

### Caminho Rápido Padrão (perfil `core`)

| Comando | Propósito |
|---------|-----------|
| `/opsx:propose` | Criar uma alteração e gerar artefatos de planejamento em uma única etapa |
| `/opsx:explore` | Refletir sobre ideias antes de confirmar uma alteração |
| `/opsx:apply` | Implementar tarefas da alteração |
| `/opsx:update` | Revisar os artefatos de planejamento de uma alteração e mantê-los coerentes |
| `/opsx:sync` | Mesclar especificações delta nas especificações principais |
| `/opsx:archive` | Arquivar uma alteração concluída |

### Comandos de Fluxo de Trabalho Expandidos (seleção de fluxo de trabalho personalizado)

| Comando | Propósito |
|---------|-----------|
| `/opsx:new` | Iniciar um esqueleto de nova alteração |
| `/opsx:continue` | Criar o próximo artefato com base nas dependências |
| `/opsx:ff` | Avanço rápido: criar todos os artefatos de planejamento de uma vez |
| `/opsx:verify` | Validar se a implementação corresponde aos artefatos |
| `/opsx:bulk-archive` | Arquivar várias alterações de uma vez |
| `/opsx:onboard` | Tutorial guiado pelo fluxo de trabalho completo |

O perfil global padrão é `core`. Para habilitar os comandos de fluxo de trabalho expandidos, execute `openspec config profile`, selecione os fluxos de trabalho e, em seguida, execute `openspec update` no seu projeto.

## Referência de Comandos

### `/opsx:propose`

Cria uma nova mudança e gera artefatos de planejamento em uma única etapa. Este é o comando de início padrão no perfil `core`.

**Sintaxe:**
```text
/opsx:propose [change-name-or-description]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|------------|
| `change-name-or-description` | Não | Nome em kebab-case ou descrição da mudança em linguagem natural |

**O que faz:**
- Cria `openspec/changes/<change-name>/`
- Gera artefatos necessários antes da implementação (para `spec-driven`: proposta, especificações, design, tarefas)
- Para quando a mudança estiver pronta para `/opsx:apply`

**Exemplo:**
```text
Você: /opsx:propose add-dark-mode

IA:  Criado openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Pronto para implementação. Execute /opsx:apply.
```

**Dicas:**
- Use este para o caminho de ponta a ponta mais rápido
- Se você quiser controle passo a passo dos artefatos, habilite fluxos de trabalho expandidos e use `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **Comece aqui quando você não tiver certeza.** Explore é um parceiro de reflexão sem riscos: ele lê sua base de código, compara opções e transforma uma ideia vaga em um plano concreto antes que qualquer mudança exista. Ele vem no perfil padrão. Para o caso completo e mais exemplos, consulte o guia [Explore Primeiro](explore.md).

Pense em ideias, investigue problemas e esclareça requisitos antes de se comprometer com uma mudança.

**Sintaxe:**
```
/opsx:explore [topic]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|------------|
| `topic` | Não | O que você quer explorar ou investigar |

**O que faz:**
- Abre uma conversa exploratória sem estrutura obrigatória
- Investiga a base de código para responder perguntas
- Compara opções e abordagens
- Cria diagramas visuais para esclarecer o pensamento
- Pode transicionar para `/opsx:propose` (padrão) ou `/opsx:new` (fluxo de trabalho expandido) quando os insights se cristalizarem

**Exemplo:**
```text
Você: /opsx:explore

IA:  O que você gostaria de explorar?

Você: Como devemos lidar com a autenticação para o aplicativo móvel?

IA:  Deixe-me investigar sua configuração de autenticação atual...
     [Analisa base de código]

     Vejo que você está usando autenticação baseada em sessão para o aplicativo web.
     Para o mobile, temos três opções principais:

     1. Tokens JWT (sem estado, funciona offline)
     2. OAuth2 (se você precisar de login de terceiros)
     3. Estender sessões atuais (mais simples, mas requer conectividade)

     Sua API já tem CORS configurado. Qual direção te interessa?

Você: Vamos de JWT. Podemos iniciar uma mudança para isso?

IA:  Estou pronta quando você estiver. Execute /opsx:propose add-jwt-auth para começar.
```

**Dicas:**
- Use quando os requisitos não estiverem claros ou você precisar investigar
- Nenhum artefato é criado durante a exploração
- Bom para comparar múltiplas abordagens antes de decidir
- Pode ler arquivos e pesquisar na base de código

---

### `/opsx:new`

Inicia um esqueleto de nova mudança. Cria a pasta da mudança e aguarda você gerar os artefatos com `/opsx:continue` ou `/opsx:ff`.

Este comando faz parte do conjunto de fluxos de trabalho expandidos (não incluído no perfil `core` padrão).

**Sintaxe:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|------------|
| `change-name` | Não | Nome para a pasta da mudança (solicitado se não fornecido) |
| `--schema` | Não | Esquema de fluxo de trabalho a usar (padrão: da configuração ou `spec-driven`) |

**O que faz:**
- Cria o diretório `openspec/changes/<change-name>/`
- Cria o arquivo de metadados `.openspec.yaml` na pasta da mudança
- Mostra o primeiro modelo de artefato pronto para criação
- Solicita o nome da mudança e o esquema se não forem fornecidos

**O que cria:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Metadados da mudança (esquema, data de criação)
```

**Exemplo:**
```
Você: /opsx:new add-dark-mode

IA:  Criado openspec/changes/add-dark-mode/
     Esquema: spec-driven

     Pronto para criar: proposta
     Use /opsx:continue para criá-la, ou /opsx:ff para criar todos os artefatos.
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
|-----------|-------------|------------|
| `change-name` | Não | Qual mudança continuar (inferido do contexto se não fornecido) |

**O que faz:**
- Consulta o grafo de dependência de artefatos
- Mostra quais artefatos estão prontos versus bloqueados
- Cria o primeiro artefato pronto
- Lê arquivos de dependência para contexto
- Mostra o que fica disponível após a criação

**Exemplo:**
```
Você: /opsx:continue

IA:  Mudança: add-dark-mode

     Status dos artefatos:
     ✓ proposta    (concluído)
     ◆ especificações       (pronto)
     ◆ design      (pronto)
     ○ tarefas       (bloqueado - precisa de: especificações)

     Criando especificações...

     [Lê proposal.md, cria especificações com base nos requisitos]

     ✓ Criado openspec/changes/add-dark-mode/specs/ui/spec.md

     Agora disponível: tarefas
     Execute /opsx:continue para criar o próximo artefato.
```

**Dicas:**
- Use quando você quiser revisar cada artefato antes de prosseguir
- Bom para mudanças complexas onde você quer controle
- Múltiplos artefatos podem ficar prontos simultaneamente
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
|-----------|-------------|------------|
| `change-name` | Não | Qual mudança avançar rapidamente (inferido do contexto se não fornecido) |

**O que faz:**
- Cria todos os artefatos na ordem de dependência
- Acompanha o progresso via lista de tarefas
- Para quando todos os artefatos `apply-required` estiverem concluídos
- Lê cada dependência antes de criar o próximo artefato

**Exemplo:**
```
Você: /opsx:ff add-dark-mode

IA:  Avançando rapidamente em add-dark-mode...

     ✓ Criando proposal.md
     ✓ Criando specs/ui/spec.md
     ✓ Criando design.md
     ✓ Criando tasks.md

     Todos os artefatos de planejamento concluídos!
     Pronto para implementação. Execute /opsx:apply para começar.
```

**Dicas:**
- Use quando você tiver uma ideia clara do que está construindo
- Mais rápido que `/opsx:continue` para mudanças simples
- Você ainda pode editar os artefatos depois
- Bom para funcionalidades pequenas a médias

---

### `/opsx:apply`

Implementa tarefas da mudança. Trabalha pela lista de tarefas, escrevendo código e marcando itens como concluídos.

**Sintaxe:**
```
/opsx:apply [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|------------|
| `change-name` | Não | Qual mudança implementar (inferido do contexto se não fornecido) |

**O que faz:**
- Lê `tasks.md` e identifica tarefas incompletas
- Trabalha nas tarefas uma por uma
- Escreve código, cria arquivos, executa testes conforme necessário
- Marca tarefas como concluídas com checkboxes `[x]`

**Exemplo:**
```
Você: /opsx:apply

IA:  Implementando add-dark-mode...

     Lendo tasks.md:
     - [ ] 1.1 Criar ThemeContext
     - [ ] 1.2 Adicionar propriedades customizadas CSS
     - [ ] 1.3 Implementar persistência no localStorage

     Trabalhando em 1.1: Criar ThemeContext...
     [Cria src/context/ThemeContext.tsx]

     ✓ 1.1 Concluído

     Trabalhando em 1.2: Adicionar propriedades customizadas CSS...
     [Atualiza src/styles/globals.css]

     ✓ 1.2 Concluído
     ...
```

**Dicas:**
- Pode retomar de onde parou se for interrompido
- Use para mudanças paralelas especificando o nome da mudança
- O estado de conclusão é rastreado nos checkboxes de `tasks.md`

---

### `/opsx:update`

Revisa os artefatos de planejamento existentes de uma mudança e mantém eles coerentes entre si. Apenas artefatos de planejamento - ele nunca edita código.

**Sintaxe:**

```text
/opsx:update [change-name]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|-----------|-------------|------------|
| `change-name` | Não | Qual mudança atualizar (inferido do contexto se não fornecido) |

**O que faz:**

- Lê os artefatos da mudança via `openspec status --change <name> --json`
- Aplica a revisão solicitada, ou revisa os artefatos buscando contradições se você não nomear uma
- Reconcilia os outros artefatos existentes em qualquer direção (uma edição de design pode se propagar de volta para a proposta)
- Confirma cada edição com você antes de escrever, um artefato por vez
- Termina recomendando o próximo passo: `/opsx:continue` (artefatos faltando), `/opsx:apply` (levar um plano revisado para o código), ou `/opsx:archive` (tudo pronto)

**Exemplo:**

```text
Você: /opsx:update add-dark-mode - estamos armazenando o tema em um cookie agora, não no localStorage

IA:  Lendo artefatos de add-dark-mode...

     O design referencia localStorage em dois lugares; a tarefa 1.3 cobre a persistência no localStorage; a proposta não menciona armazenamento.

     Revisões propostas:
     1. design.md - trocar a decisão de localStorage por armazenamento em cookie
     2. tasks.md - reescrever a tarefa 1.3 para persistência em cookie

     Aplicar revisão 1? (design.md)
```

**Dicas:**

- Ele não criará artefatos faltando - isso é função do `/opsx:continue`
- Se a mudança já foi implementada, siga com `/opsx:apply` para que o código corresponda ao plano revisado
- Se sua revisão mudar a *intenção* da mudança, comece de novo com uma nova mudança (veja [Quando Atualizar vs. Começar do Zero](opsx.md#when-to-update-vs-start-fresh))

---

### `/opsx:verify`

Valida se a implementação corresponde aos seus artefatos de mudança. Verifica completude, correção e coerência.

**Sintaxe:**
```
/opsx:verify [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|------------|
| `change-name` | Não | Qual mudança verificar (inferido do contexto se não fornecido) |

**O que faz:**
- Verifica três dimensões da qualidade da implementação
- Pesquisa na base de código por evidências de implementação
- Relata problemas categorizados como CRÍTICO, AVISO ou SUGESTÃO
- Não bloqueia o arquivamento, mas identifica problemas

**Dimensões de verificação:**

| Dimensão | O que valida |
|----------|--------------|
| **Completude** | Todas as tarefas feitas, todos os requisitos implementados, cenários cobertos |
| **Correção** | Implementação corresponde à intenção da especificação, casos extremos tratados |
| **Coerência** | Decisões de design refletidas no código, padrões consistentes |

**Exemplo:**
```
Você: /opsx:verify

IA:  Verificando add-dark-mode...

     COMPLETUDE
     ✓ Todas as 8 tarefas em tasks.md estão marcadas
     ✓ Todos os requisitos nas especificações têm código correspondente
     ⚠ Cenário "Detecção de preferência do sistema" não tem cobertura de testes

     CORREÇÃO
     ✓ Implementação corresponde à intenção da especificação
     ✓ Casos extremos dos cenários são tratados
     ✓ Estados de erro correspondem às definições da especificação

     COERÊNCIA
     ✓ Decisões de design refletidas na estrutura do código
     ✓ Convenções de nomenclatura consistentes com design.md
     ⚠ Design menciona "variáveis CSS" mas a implementação usa classes Tailwind

     RESUMO
     ─────────────────────────────
     Problemas críticos: 0
     Avisos: 2
     Pronto para arquivar: Sim (com avisos)

     Recomendações:
     1. Adicionar teste para detecção de preferência do sistema
     2. Atualizar design.md para refletir o uso de Tailwind, ou refatorar para usar variáveis CSS
```

**Dicas:**
- Execute antes de arquivar para detectar incompatibilidades cedo
- Avisos não bloqueiam o arquivamento mas indicam problemas potenciais
- Bom para revisar o trabalho da IA antes de confirmar
- Pode revelar desvio entre artefatos e implementação

---

### `/opsx:sync`

**Comando opcional.** Mescla especificações delta de uma mudança nas especificações principais. O arquivamento solicitará para sincronizar se necessário, então você normalmente não precisa executar isso manualmente.

**Sintaxe:**
```
/opsx:sync [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|------------|
| `change-name` | Não | Qual mudança sincronizar (inferido do contexto se não fornecido) |

**O que faz:**
- Lê especificações delta da pasta da mudança
- Analisa seções ADICIONADO/MODIFICADO/REMOVIDO/RENOMEADO
- Mescla mudanças no diretório principal `openspec/specs/`
- Preserva conteúdo existente não mencionado no delta
- Não arquiva a mudança (permanece ativa)

**Exemplo:**
```text
Você: /opsx:sync

IA:  Sincronizando especificações delta de add-dark-mode...

     Lendo: openspec/changes/add-dark-mode/specs/ui/spec.md
     Alvo:  openspec/specs/ui/spec.md

     Mudanças a aplicar:
     ✓ ADICIONADO: Requisito de Seleção de Tema (2 cenários)
     ✓ ADICIONADO: Requisito de Acessibilidade (1 cenário)

     Mesclando...
     ✓ openspec/specs/ui/spec.md atualizado

     A mudança permanece ativa. Execute /opsx:archive quando estiver pronto para concluir.
```

**Quando usar manualmente:**

| Cenário | Usar sincronização? |
|----------|---------------------|
| Mudança de longa duração, quer especificações na principal antes de arquivar | Sim |
| Múltiplas mudanças paralelas precisam das especificações base atualizadas | Sim |
| Quer visualizar/revisar a mesclagem separadamente | Sim |
| Mudança rápida, indo direto para o arquivamento | Não (o arquivamento gerencia isso) |

**Dicas:**
- A sincronização é inteligente, não é copiar-colar
- Pode adicionar cenários a requisitos existentes sem duplicar
- A mudança permanece ativa após a sincronização (não arquivada)
- A maioria dos usuários nunca precisará chamar isso diretamente—o arquivamento solicita se necessário

---

### `/opsx:archive`

Arquiva uma mudança concluída. Finaliza a mudança e a move para a pasta de arquivo morto.

**Sintaxe:**
```
/opsx:archive [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|------------|
| `change-name` | Não | Qual mudança arquivar (inferido do contexto se não fornecido) |

**O que faz:**
- Verifica o status de conclusão dos artefatos
- Verifica a conclusão das tarefas (avisa se incompleto)
- Oferece para sincronizar especificações delta se ainda não sincronizadas
- Move a pasta da mudança para `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Preserva todos os artefatos para trilha de auditoria

**Exemplo:**
```text
Você: /opsx:archive

IA:  Arquivando add-dark-mode...

     Status dos artefatos:
     ✓ proposal.md existe
     ✓ specs/ existe
     ✓ design.md existe
     ✓ tasks.md existe (8/8 tarefas concluídas)

     Especificações delta: Ainda não sincronizadas
     → Sincronizar agora? (recomendado)

Você: Sim

IA:  ✓ Especificações sincronizadas para openspec/specs/ui/spec.md
     ✓ Movido para openspec/changes/archive/2025-01-24-add-dark-mode/

     Mudança arquivada com sucesso.
```

**Dicas:**
- O arquivamento não bloqueará por tarefas incompletas, mas avisará
- Especificações delta podem ser sincronizadas durante o arquivamento ou antes
- Mudanças arquivadas são preservadas para histórico
- Use `/opsx:verify` primeiro para detectar problemas

---

### `/opsx:bulk-archive`

Arquiva múltiplas mudanças concluídas de uma vez. Lida com conflitos de especificações entre mudanças.

**Sintaxe:**
```
/opsx:bulk-archive [change-names...]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|------------|
| `change-names` | Não | Mudanças específicas para arquivar (solicita seleção se não fornecido) |

**O que faz:**
- Lista todas as mudanças concluídas
- Valida cada mudança antes de arquivar
- Detecta conflitos de especificações entre mudanças
- Resolve conflitos verificando o que está realmente implementado
- Arquiva em ordem cronológica

**Exemplo:**
```
Você: /opsx:bulk-archive

IA:  Encontradas 3 mudanças concluídas:
     - add-dark-mode (8/8 tarefas concluídas)
     - fix-login-bug (3/3 tarefas concluídas)
     - update-footer (2/2 tarefas concluídas)

     Verificando conflitos de especificações...
     ⚠ add-dark-mode e update-footer ambas tocam em specs/ui/

     Inspecionando base de código para resolver...
     Ambas as mudanças estão implementadas. Irá mesclar em ordem cronológica:
     1. add-dark-mode (criada em 20 de jan)
     2. update-footer (criada em 22 de jan)

     Arquivar todas as 3 mudanças?

Você: Sim

IA:  ✓ Arquivado add-dark-mode
     ✓ Arquivado fix-login-bug
     ✓ Arquivado update-footer
     Especificações mescladas: add-dark-mode → update-footer
```

**Dicas:**
- Bom para fluxos de trabalho paralelos
- A resolução de conflitos é agênica (verifica a base de código)
- Mudanças são arquivadas em ordem de criação
- Solicita antes de sobrescrever conteúdo de especificações

---

### `/opsx:onboard`

Integração guiada pelo fluxo de trabalho completo do OpenSpec. Um tutorial interativo usando sua base de código real.

**Sintaxe:**
```
/opsx:onboard
```

**O que faz:**
- Percorre um ciclo completo de fluxo de trabalho com narração
- Examina sua base de código por oportunidades reais de melhoria
- Cria uma mudança real com artefatos reais
- Implementa trabalho real (mudanças pequenas e seguras)
- Arquiva a mudança concluída
- Explica cada passo conforme acontece

**Fases:**
1. Boas-vindas e análise da base de código
2. Encontrando uma oportunidade de melhoria
3. Criando uma mudança (`/opsx:new`)
4. Escrevendo a proposta
5. Criando especificações
6. Escrevendo o design
7. Criando tarefas
8. Implementando tarefas (`/opsx:apply`)
9. Verificando a implementação
10. Arquivando a mudança
11. Resumo e próximos passos

**Exemplo:**
```
Você: /opsx:onboard

IA:  Bem-vindo ao OpenSpec!

     Vou guiá-lo pelo fluxo de trabalho completo usando sua base de código real.
     Vamos encontrar algo pequeno para melhorar, criar uma mudança adequada para isso,
     implementá-la e arquivá-la.

     Deixe-me examinar sua base de código por oportunidades...

     [Analisa base de código]

     Encontrei algumas coisas nas quais poderíamos trabalhar:
     1. Adicionar validação de entrada ao formulário de contato
     2. Melhorar mensagens de erro no fluxo de autenticação
     3. Adicionar estados de carregamento aos botões assíncronos

     Qual te interessa? (ou sugira outra coisa)
```

**Dicas:**
- Melhor para novos usuários aprendendo o fluxo de trabalho
- Usa código real, não exemplos fictícios
- Cria uma mudança real que você pode manter ou descartar
- Leva de 15 a 30 minutos para concluir

## Sintaxe de Comandos por Ferramenta de IA

Diferentes ferramentas de IA usam sintaxes de comando ligeiramente diferentes. Use o formato que corresponde à sua ferramenta:

| Ferramenta | Exemplo de Sintaxe |
|------------|---------------------|
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

Esses comandos usam o fluxo de trabalho "tudo de uma vez" mais antigo. Eles ainda funcionam, mas os comandos OPSX são recomendados.

| Comando | O que faz |
|---------|-----------|
| `/openspec:proposal` | Criar todos os artefatos de uma vez (proposta, especificações, design, tarefas) |
| `/openspec:apply` | Implementar a alteração |
| `/openspec:archive` | Arquivar a alteração |

**Quando usar comandos legados:**
- Projetos existentes que usam o fluxo de trabalho antigo
- Alterações simples onde você não precisa de criação incremental de artefatos
- Preferência pela abordagem tudo ou nada

**Migrando para o OPSX:**
Alterações legadas podem ser continuadas com comandos OPSX. A estrutura de artefatos é compatível.

---

## Solução de Problemas

### "Alteração não encontrada"

O comando não conseguiu identificar qual alteração deve ser processada.

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
- Regenere as habilidades: `openspec update`
- Verifique se o diretório `.claude/skills/` existe (para Claude Code)
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