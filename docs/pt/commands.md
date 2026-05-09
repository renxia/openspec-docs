# Comandos

Esta é a referência para os comandos de barra do OpenSpec. Esses comandos são invocados na interface de chat do seu assistente de codificação com IA (por exemplo, Claude Code, Cursor, Windsurf).

Para padrões de fluxo de trabalho e quando usar cada comando, consulte [Fluxos de Trabalho](workflows.md). Para comandos de CLI, consulte [CLI](cli.md).

## Referência Rápida

### Caminho Rápido Padrão (perfil `core`)

| Comando | Finalidade |
|---------|------------|
| `/opsx:propose` | Criar uma alteração e gerar artefatos de planejamento em uma etapa |
| `/opsx:explore` | Analisar ideias antes de se comprometer com uma alteração |
| `/opsx:apply` | Implementar tarefas a partir da alteração |
| `/opsx:sync` | Mesclar especificações delta nas especificações principais |
| `/opsx:archive` | Arquivar uma alteração concluída |

### Comandos de Fluxo de Trabalho Expandidos (seleção de fluxo de trabalho personalizado)

| Comando | Finalidade |
|---------|------------|
| `/opsx:new` | Iniciar uma nova estrutura de alteração |
| `/opsx:continue` | Criar o próximo artefato com base nas dependências |
| `/opsx:ff` | Avanço rápido: criar todos os artefatos de planejamento de uma vez |
| `/opsx:verify` | Validar se a implementação corresponde aos artefatos |
| `/opsx:bulk-archive` | Arquivar múltiplas alterações de uma vez |
| `/opsx:onboard` | Tutorial guiado pelo fluxo de trabalho completo |

O perfil global padrão é `core`. Para habilitar os comandos de fluxo de trabalho expandidos, execute `openspec config profile`, selecione os fluxos de trabalho e, em seguida, execute `openspec update` em seu projeto.

---

## Referência de Comandos

### `/opsx:propose`

Cria uma nova mudança e gera artefatos de planejamento em uma única etapa. Este é o comando inicial padrão no perfil `core`.

**Sintaxe:**
```text
/opsx:propose [nome-ou-descrição-da-mudança]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `change-name-or-description` | Não | Nome em kebab-case ou descrição da mudança em linguagem natural |

**O que ele faz:**
- Cria `openspec/changes/<nome-da-mudança>/`
- Gera os artefatos necessários antes da implementação (para `spec-driven`: proposta, especificações, design, tarefas)
- Para quando a mudança está pronta para `/opsx:apply`

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
- Use este para o caminho mais rápido de ponta a ponta
- Se quiser controle passo a passo dos artefatos, ative fluxos de trabalho expandidos e use `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

Pense sobre ideias, investigue problemas e esclareça requisitos antes de se comprometer com uma mudança.

**Sintaxe:**
```
/opsx:explore [tópico]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `topic` | Não | O que você deseja explorar ou investigar |

**O que ele faz:**
- Abre uma conversa exploratória sem estrutura obrigatória
- Investiga a base de código para responder perguntas
- Compara opções e abordagens
- Cria diagramas visuais para esclarecer o raciocínio
- Pode transicionar para `/opsx:propose` (padrão) ou `/opsx:new` (fluxo de trabalho expandido) quando os insights se consolidam

**Exemplo:**
```text
Você: /opsx:explore

IA:  O que você gostaria de explorar?

Você: Como devemos lidar com a autenticação para o aplicativo móvel?

IA:  Deixe-me investigar sua configuração atual de autenticação...
     [Analisa a base de código]

     Vejo que você está usando autenticação baseada em sessão para o aplicativo web.
     Para o móvel, temos três opções principais:

     1. Tokens JWT (sem estado, funciona offline)
     2. OAuth2 (se precisar de login de terceiros)
     3. Estender as sessões atuais (mais simples, mas requer conectividade)

     Sua API já tem CORS configurado. Qual direção te interessa?

Você: Vamos com JWT. Podemos começar uma mudança para isso?

IA:  Pronto quando você estiver. Execute /opsx:propose add-jwt-auth para começar.
```

**Dicas:**
- Use quando os requisitos não estão claros ou você precisa investigar
- Nenhum artefato é criado durante a exploração
- Bom para comparar múltiplas abordagens antes de decidir
- Pode ler arquivos e pesquisar na base de código

---

### `/opsx:new`

Inicia um novo esqueleto de mudança. Cria a pasta da mudança e espera que você gere artefatos com `/opsx:continue` ou `/opsx:ff`.

Este comando faz parte do conjunto de fluxos de trabalho expandidos (não incluído no perfil padrão `core`).

**Sintaxe:**
```
/opsx:new [nome-da-mudança] [--schema <nome-do-schema>]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `change-name` | Não | Nome para a pasta da mudança (solicitado se não fornecido) |
| `--schema` | Não | Schema do fluxo de trabalho a usar (padrão: da configuração ou `spec-driven`) |

**O que ele faz:**
- Cria o diretório `openspec/changes/<nome-da-mudança>/`
- Cria o arquivo de metadados `.openspec.yaml` na pasta da mudança
- Mostra o primeiro template de artefato pronto para criação
- Solicita o nome da mudança e o schema se não forem fornecidos

**O que ele cria:**
```
openspec/changes/<nome-da-mudança>/
└── .openspec.yaml    # Metadados da mudança (schema, data de criação)
```

**Exemplo:**
```
Você: /opsx:new add-dark-mode

IA:  Criado openspec/changes/add-dark-mode/
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

Cria o próximo artefato na cadeia de dependências. Cria um artefato por vez para progresso incremental.

**Sintaxe:**
```
/opsx:continue [nome-da-mudança]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `change-name` | Não | Qual mudança continuar (inferido do contexto se não fornecido) |

**O que ele faz:**
- Consulta o grafo de dependências dos artefatos
- Mostra quais artefatos estão prontos vs bloqueados
- Cria o primeiro artefato pronto
- Lê arquivos de dependência para contexto
- Mostra o que se torna disponível após a criação

**Exemplo:**
```
Você: /opsx:continue

IA:  Mudança: add-dark-mode

     Status dos artefatos:
     ✓ proposal    (concluído)
     ◆ specs       (pronto)
     ◆ design      (pronto)
     ○ tasks       (bloqueado - necessita: specs)

     Criando specs...

     [Lê proposal.md, cria specs baseado nos requisitos]

     ✓ Criado openspec/changes/add-dark-mode/specs/ui/spec.md

     Agora disponível: tasks
     Execute /opsx:continue para criar o próximo artefato.
```

**Dicas:**
- Use quando quiser revisar cada artefato antes de prosseguir
- Bom para mudanças complexas onde você quer controle
- Múltiplos artefatos podem ficar prontos simultaneamente
- Você pode editar artefatos criados antes de continuar

---

### `/opsx:ff`

Avanço rápido na criação de artefatos. Cria todos os artefatos de planejamento de uma vez.

**Sintaxe:**
```
/opsx:ff [nome-da-mudança]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `change-name` | Não | Qual mudança acelerar (inferido do contexto se não fornecido) |

**O que ele faz:**
- Cria todos os artefatos em ordem de dependência
- Acompanha o progresso via lista de tarefas
- Para quando todos os artefatos com `apply-required` estiverem concluídos
- Lê cada dependência antes de criar o próximo artefato

**Exemplo:**
```
Você: /opsx:ff add-dark-mode

IA:  Acelerando add-dark-mode...

     ✓ Criando proposal.md
     ✓ Criando specs/ui/spec.md
     ✓ Criando design.md
     ✓ Criando tasks.md

     Todos os artefatos de planejamento concluídos!
     Pronto para implementação. Execute /opsx:apply para começar.
```

**Dicas:**
- Use quando você tem uma visão clara do que está construindo
- Mais rápido que `/opsx:continue` para mudanças diretas
- Você ainda pode editar os artefatos depois
- Bom para funcionalidades pequenas a médias

---

### `/opsx:apply`

Implementa as tarefas da mudança. Trabalha na lista de tarefas, escrevendo código e marcando itens como concluídos.

**Sintaxe:**
```
/opsx:apply [nome-da-mudança]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `change-name` | Não | Qual mudança implementar (inferido do contexto se não fornecido) |

**O que ele faz:**
- Lê `tasks.md` e identifica tarefas incompletas
- Trabalha nas tarefas uma por uma
- Escreve código, cria arquivos, executa testes conforme necessário
- Marca tarefas como concluídas com caixas de seleção `[x]`

**Exemplo:**
```
Você: /opsx:apply

IA:  Implementando add-dark-mode...

     Lendo tasks.md:
     - [ ] 1.1 Criar ThemeContext
     - [ ] 1.2 Adicionar propriedades CSS customizadas
     - [ ] 1.3 Implementar persistência localStorage

     Trabalhando em 1.1: Criar ThemeContext...
     [Cria src/context/ThemeContext.tsx]

     ✓ 1.1 Concluído

     Trabalhando em 1.2: Adicionar propriedades CSS customizadas...
     [Atualiza src/styles/globals.css]

     ✓ 1.2 Concluído
     ...
```

**Dicas:**
- Pode retomar de onde parou se interrompido
- Use para mudanças paralelas especificando o nome da mudança
- O estado de conclusão é rastreado nas caixas de seleção de `tasks.md`

---

### `/opsx:verify`

Valida se a implementação corresponde aos seus artefatos de mudança. Verifica completude, correção e coerência.

**Sintaxe:**
```
/opsx:verify [nome-da-mudança]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `change-name` | Não | Qual mudança verificar (inferido do contexto se não fornecido) |

**O que ele faz:**
- Verifica três dimensões da qualidade da implementação
- Pesquisa a base de código por evidências de implementação
- Relata problemas categorizados como CRÍTICO, AVISO ou SUGESTÃO
- Não bloqueia o arquivamento, mas destaca problemas

**Dimensões de verificação:**

| Dimensão | O que valida |
|----------|--------------|
| **Completude** | Todas as tarefas concluídas, todos os requisitos implementados, cenários cobertos |
| **Correção** | A implementação corresponde à intenção da especificação, casos extremos tratados |
| **Coerência** | Decisões de design refletidas no código, padrões consistentes |

**Exemplo:**
```
Você: /opsx:verify

IA:  Verificando add-dark-mode...

     COMPLETUDE
     ✓ Todas as 8 tarefas em tasks.md estão marcadas
     ✓ Todos os requisitos nas specs têm código correspondente
     ⚠ Cenário "Detecção de preferência do sistema" não tem cobertura de teste

     CORREÇÃO
     ✓ A implementação corresponde à intenção da especificação
     ✓ Casos extremos dos cenários são tratados
     ✓ Estados de erro correspondem às definições da especificação

     COERÊNCIA
     ✓ Decisões de design refletidas na estrutura do código
     ✓ Convenções de nomenclatura consistentes com design.md
     ⚠ O design menciona "variáveis CSS" mas a implementação usa classes Tailwind

     RESUMO
     ─────────────────────────────
     Problemas críticos: 0
     Avisos: 2
     Pronto para arquivamento: Sim (com avisos)

     Recomendações:
     1. Adicionar teste para detecção de preferência do sistema
     2. Atualizar design.md para refletir o uso de Tailwind, ou refatorar para usar variáveis CSS
```

**Dicas:**
- Execute antes de arquivar para detectar incompatibilidades cedo
- Avisos não bloqueiam o arquivamento, mas indicam problemas potenciais
- Bom para revisar o trabalho da IA antes de confirmar
- Pode revelar divergências entre artefatos e implementação

---

### `/opsx:sync`

**Comando opcional.** Mescla especificações delta de uma mudança nas especificações principais. O arquivamento solicitará sincronização se necessário, então você normalmente não precisa executar isso manualmente.

**Sintaxe:**
```
/opsx:sync [nome-da-mudança]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `change-name` | Não | Qual mudança sincronizar (inferido do contexto se não fornecido) |

**O que ele faz:**
- Lê especificações delta da pasta da mudança
- Analisa seções ADDED/MODIFIED/REMOVED/RENAMED
- Mescla as alterações no diretório principal `openspec/specs/`
- Preserva conteúdo existente não mencionado no delta
- Não arquiva a mudança (permanece ativa)

**Exemplo:**
```text
Você: /opsx:sync

IA:  Sincronizando especificações delta de add-dark-mode...

     Lendo: openspec/changes/add-dark-mode/specs/ui/spec.md
     Alvo:  openspec/specs/ui/spec.md

     Alterações a aplicar:
     ✓ ADDED: Requisito de Seleção de Tema (2 cenários)
     ✓ ADDED: Requisito de Acessibilidade (1 cenário)

     Mesclando...
     ✓ openspec/specs/ui/spec.md atualizado

     A mudança permanece ativa. Execute /opsx:archive quando estiver pronto para concluir.
```

**Quando usar manualmente:**

| Cenário | Usar sync? |
|---------|------------|
| Mudança de longa duração, quer as specs principais antes de arquivar | Sim |
| Múltiplas mudanças paralelas precisam das specs base atualizadas | Sim |
| Quer visualizar/revisar a mesclagem separadamente | Sim |
| Mudança rápida, indo direto para o arquivamento | Não (o arquivamento cuida disso) |

**Dicas:**
- A sincronização é inteligente, não é cópia e cola
- Pode adicionar cenários a requisitos existentes sem duplicar
- A mudança permanece ativa após a sincronização (não é arquivada)
- A maioria dos usuários nunca precisará chamar isso diretamente—o arquivamento solicita se necessário

---

### `/opsx:archive`

Arquiva uma mudança concluída. Finaliza a mudança e a move para a pasta de arquivo.

**Sintaxe:**
```
/opsx:archive [nome-da-mudança]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `change-name` | Não | Qual mudança arquivar (inferido do contexto se não fornecido) |

**O que ele faz:**
- Verifica o status de conclusão dos artefatos
- Verifica a conclusão das tarefas (avisa se incompleto)
- Oferece sincronizar especificações delta se ainda não sincronizadas
- Move a pasta da mudança para `openspec/changes/archive/YYYY-MM-DD-<nome>/`
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

IA:  ✓ Specs sincronizadas para openspec/specs/ui/spec.md
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
/opsx:bulk-archive [nomes-das-mudanças...]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `change-names` | Não | Mudanças específicas para arquivar (solicita seleção se não fornecido) |

**O que ele faz:**
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
     ⚠ add-dark-mode e update-footer ambas tocam specs/ui/

     Inspecionando a base de código para resolver...
     Ambas as mudanças estão implementadas. Mesclará em ordem cronológica:
     1. add-dark-mode (criada em 20 de jan)
     2. update-footer (criada em 22 de jan)

     Arquivar todas as 3 mudanças?

Você: Sim

IA:  ✓ Arquivada add-dark-mode
     ✓ Arquivada fix-login-bug
     ✓ Arquivada update-footer
     Specs mescladas: add-dark-mode → update-footer
```

**Dicas:**
- Bom para fluxos de trabalho paralelos
- A resolução de conflitos é agêntica (verifica a base de código)
- As mudanças são arquivadas em ordem de criação
- Solicita antes de sobrescrever conteúdo de especificações

---

### `/opsx:onboard`

Integração guiada pelo fluxo de trabalho completo do OpenSpec. Um tutorial interativo usando sua base de código real.

**Sintaxe:**
```
/opsx:onboard
```

**O que ele faz:**
- Percorre um ciclo completo de fluxo de trabalho com narração
- Sua base de código é analisada para oportunidades reais de melhoria
- Cria uma mudança real com artefatos reais
- Implementa trabalho real (alterações pequenas e seguras)
- Arquiva a mudança concluída
- Explica cada etapa conforme acontece

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

     Deixe-me escanear sua base de código em busca de oportunidades...

     [Analisa a base de código]

     Encontrei algumas coisas com as quais poderíamos trabalhar:
     1. Adicionar validação de entrada ao formulário de contato
     2. Melhorar mensagens de erro no fluxo de autenticação
     3. Adicionar estados de carregamento a botões assíncronos

     Qual te interessa? (ou sugira outra coisa)
```

**Dicas:**
- Melhor para novos usuários aprendendo o fluxo de trabalho
- Usa código real, não exemplos artificiais
- Cria uma mudança real que você pode manter ou descartar
- Leva de 15 a 30 minutos para ser concluído

---

## Sintaxe de Comando por Ferramenta de IA

Diferentes ferramentas de IA usam sintaxes de comando ligeiramente diferentes. Use o formato que corresponde à sua ferramenta:

| Ferramenta | Exemplo de Sintaxe |
|------------|-------------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Invocações baseadas em habilidades, como `/skill:openspec-propose`, `/skill:openspec-apply-change` (sem arquivos de comando `opsx-*` gerados) |
| Trae | Invocações baseadas em habilidades, como `/openspec-propose`, `/openspec-apply-change` (sem arquivos de comando `opsx-*` gerados) |

A intenção é a mesma em todas as ferramentas, mas a forma como os comandos são apresentados pode diferir dependendo da integração.

> **Nota:** Os comandos do GitHub Copilot (`.github/prompts/*.prompt.md`) estão disponíveis apenas em extensões de IDE (VS Code, JetBrains, Visual Studio). O GitHub Copilot CLI atualmente não suporta arquivos de prompt personalizados — consulte [Ferramentas Suportadas](supported-tools.md) para detalhes e soluções alternativas.

---

## Comandos Legados

Esses comandos usam o fluxo de trabalho mais antigo "tudo de uma vez". Eles ainda funcionam, mas os comandos OPSX são recomendados.

| Comando | O que faz |
|---------|-----------|
| `/openspec:proposal` | Cria todos os artefatos de uma vez (proposta, especificações, design, tarefas) |
| `/openspec:apply` | Implementa a alteração |
| `/openspec:archive` | Arquiva a alteração |

**Quando usar comandos legados:**
- Projetos existentes que usam o fluxo de trabalho antigo
- Alterações simples onde não é necessário criação incremental de artefatos
- Preferência pela abordagem "tudo ou nada"

**Migrando para OPSX:**
Alterações legadas podem ser continuadas com comandos OPSX. A estrutura dos artefatos é compatível.

---

## Solução de Problemas

### "Alteração não encontrada"

O comando não conseguiu identificar em qual alteração trabalhar.

**Soluções:**
- Especifique o nome da alteração explicitamente: `/opsx:apply add-dark-mode`
- Verifique se a pasta da alteração existe: `openspec list`
- Confirme que está no diretório correto do projeto

### "Nenhum artefato pronto"

Todos os artefatos estão concluídos ou bloqueados por dependências ausentes.

**Soluções:**
- Execute `openspec status --change <nome>` para ver o que está bloqueando
- Verifique se os artefatos necessários existem
- Crie primeiro os artefatos de dependência ausentes

### "Esquema não encontrado"

O esquema especificado não existe.

**Soluções:**
- Liste os esquemas disponíveis: `openspec schemas`
- Verifique a ortografia do nome do esquema
- Crie o esquema se for personalizado: `openspec schema init <nome>`

### Comandos não reconhecidos

A ferramenta de IA não reconhece os comandos do OpenSpec.

**Soluções:**
- Certifique-se de que o OpenSpec está inicializado: `openspec init`
- Regenere as habilidades: `openspec update`
- Verifique se o diretório `.claude/skills/` existe (para Claude Code)
- Reinicie sua ferramenta de IA para carregar as novas habilidades

### Artefatos não gerados corretamente

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