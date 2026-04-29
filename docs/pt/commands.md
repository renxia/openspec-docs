# Comandos

Esta é a referência para os comandos de barra do OpenSpec. Esses comandos são invocados na interface de chat do seu assistente de codificação por IA (por exemplo, Claude Code, Cursor, Windsurf).

Para padrões de fluxo de trabalho e quando usar cada comando, consulte [Fluxos de Trabalho](workflows.md). Para comandos de CLI, consulte [CLI](cli.md).

## Referência Rápida

### Caminho Rápido Padrão (perfil `core`)

| Comando | Finalidade |
|---------|------------|
| `/opsx:propose` | Criar uma alteração e gerar artefatos de planejamento em uma etapa |
| `/opsx:explore` | Analisar ideias antes de se comprometer com uma alteração |
| `/opsx:apply` | Implementar tarefas a partir da alteração |
| `/opsx:archive` | Arquivar uma alteração concluída |

### Comandos de Fluxo de Trabalho Expandido (seleção de fluxo de trabalho personalizado)

| Comando | Finalidade |
|---------|------------|
| `/opsx:new` | Iniciar uma nova estrutura de alteração |
| `/opsx:continue` | Criar o próximo artefato com base nas dependências |
| `/opsx:ff` | Avanço rápido: criar todos os artefatos de planejamento de uma vez |
| `/opsx:verify` | Validar se a implementação corresponde aos artefatos |
| `/opsx:sync` | Mesclar especificações delta nas especificações principais |
| `/opsx:bulk-archive` | Arquivar várias alterações de uma vez |
| `/opsx:onboard` | Tutorial guiado pelo fluxo de trabalho completo |

O perfil global padrão é `core`. Para habilitar os comandos de fluxo de trabalho expandido, execute `openspec config profile`, selecione workflows e, em seguida, execute `openspec update` no seu projeto.

## Referência de Comandos

### `/opsx:propose`

Cria uma nova mudança e gera artefatos de planejamento em uma etapa. Este é o comando padrão de início no perfil `core`.

**Sintaxe:**
```text
/opsx:propose [nome-ou-descrição-da-mudança]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `nome-ou-descrição-da-mudança` | Não | Nome em kebab-case ou descrição da mudança em linguagem natural |

**O que faz:**
- Cria `openspec/changes/<nome-da-mudança>/`
- Gera os artefatos necessários antes da implementação (para `spec-driven`: proposta, especificações, design, tarefas)
- Para quando a mudança estiver pronta para `/opsx:apply`

**Exemplo:**
```text
Você: /opsx:propose add-dark-mode

IA:   Criado openspec/changes/add-dark-mode/
      ✓ proposal.md
      ✓ specs/ui/spec.md
      ✓ design.md
      ✓ tasks.md
      Pronto para implementação. Execute /opsx:apply.
```

**Dicas:**
- Use este comando para o caminho mais rápido de ponta a ponta
- Se você deseja controle passo a passo dos artefatos, ative os fluxos de trabalho expandidos e use `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

Pense em ideias, investigue problemas e esclareça requisitos antes de se comprometer com uma mudança.

**Sintaxe:**
```
/opsx:explore [tópico]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `tópico` | Não | O que você quer explorar ou investigar |

**O que faz:**
- Abre uma conversa exploratória sem estrutura necessária
- Investiga o codebase para responder perguntas
- Compara opções e abordagens
- Cria diagramas visuais para esclarecer o pensamento
- Pode transitar para `/opsx:propose` (padrão) ou `/opsx:new` (fluxo de trabalho expandido) quando os insights se cristalizarem

**Exemplo:**
```text
Você: /opsx:explore

IA:   O que você gostaria de explorar?

Você: Como devemos lidar com a autenticação para o aplicativo móvel?

IA:   Deixe-me investigar sua configuração atual de autenticação...
      [Analisa o codebase]

      Vejo que você usa autenticação baseada em sessão para o aplicativo web.
      Para o mobile, temos três opções principais:

      1. Tokens JWT (sem estado, funciona offline)
      2. OAuth2 (se você precisar de login de terceiros)
      3. Estender as sessões atuais (mais simples, mas requer conectividade)

      Sua API já tem CORS configurado. Qual direção te interessa?

Você: Vamos com JWT. Podemos iniciar uma mudança para isso?

IA:   Pronto quando você estiver. Execute /opsx:propose add-jwt-auth para começar.
```

**Dicas:**
- Use quando os requisitos não estiverem claros ou você precisar investigar
- Nenhum artefato é criado durante a exploração
- Útil para comparar múltiplas abordagens antes de decidir
- Pode ler arquivos e pesquisar no codebase

---

### `/opsx:new`

Inicia um novo esqueleto de mudança. Cria a pasta da mudança e aguarda que você gere os artefatos com `/opsx:continue` ou `/opsx:ff`.

Este comando faz parte do conjunto de fluxos de trabalho expandidos (não incluído no perfil padrão `core`).

**Sintaxe:**
```
/opsx:new [nome-da-mudança] [--schema <nome-do-schema>]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `nome-da-mudança` | Não | Nome para a pasta da mudança (solicitado se não fornecido) |
| `--schema` | Não | Schema do fluxo de trabalho a ser usado (padrão: da configuração ou `spec-driven`) |

**O que faz:**
- Cria o diretório `openspec/changes/<nome-da-mudança>/`
- Cria o arquivo de metadados `.openspec.yaml` na pasta da mudança
- Mostra o primeiro template de artefato pronto para criação
- Solicita o nome da mudança e o schema se não fornecidos

**O que cria:**
```
openspec/changes/<nome-da-mudança>/
└── .openspec.yaml    # Metadados da mudança (schema, data de criação)
```

**Exemplo:**
```
Você: /opsx:new add-dark-mode

IA:   Criado openspec/changes/add-dark-mode/
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
| `nome-da-mudança` | Não | Qual mudança continuar (inferido do contexto se não fornecido) |

**O que faz:**
- Consulta o grafo de dependências dos artefatos
- Mostra quais artefatos estão prontos vs. bloqueados
- Cria o primeiro artefato pronto
- Lê arquivos de dependência para contexto
- Mostra o que se torna disponível após a criação

**Exemplo:**
```
Você: /opsx:continue

IA:   Mudança: add-dark-mode

      Status dos artefatos:
      ✓ proposal    (feito)
      ◆ specs       (pronto)
      ◆ design      (pronto)
      ○ tasks       (bloqueado - precisa: specs)

      Criando specs...

      [Lê proposal.md, cria specs baseado nos requisitos]

      ✓ Criado openspec/changes/add-dark-mode/specs/ui/spec.md

      Agora disponível: tasks
      Execute /opsx:continue para criar o próximo artefato.
```

**Dicas:**
- Use quando quiser revisar cada artefato antes de prosseguir
- Útil para mudanças complexas onde você quer controle
- Múltiplos artefatos podem se tornar prontos simultaneamente
- Você pode editar os artefatos criados antes de continuar

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
| `nome-da-mudança` | Não | Qual mudança avançar rapidamente (inferido do contexto se não fornecido) |

**O que faz:**
- Cria todos os artefatos na ordem de dependência
- Acompanha o progresso via lista de tarefas
- Para quando todos os artefatos `apply-required` estiverem completos
- Lê cada dependência antes de criar o próximo artefato

**Exemplo:**
```
Você: /opsx:ff add-dark-mode

IA:   Avançando rapidamente add-dark-mode...

      ✓ Criando proposal.md
      ✓ Criando specs/ui/spec.md
      ✓ Criando design.md
      ✓ Criando tasks.md

      Todos os artefatos de planejamento completos!
      Pronto para implementação. Execute /opsx:apply para começar.
```

**Dicas:**
- Use quando você tem uma visão clara do que está construindo
- Mais rápido que `/opsx:continue` para mudanças diretas
- Você ainda pode editar os artefatos depois
- Útil para funcionalidades pequenas a médias

---

### `/opsx:apply`

Implementa tarefas da mudança. Trabalha na lista de tarefas, escrevendo código e marcando itens.

**Sintaxe:**
```
/opsx:apply [nome-da-mudança]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `nome-da-mudança` | Não | Qual mudança implementar (inferido do contexto se não fornecido) |

**O que faz:**
- Lê `tasks.md` e identifica tarefas incompletas
- Trabalha nas tarefas uma por uma
- Escreve código, cria arquivos, executa testes conforme necessário
- Marca tarefas como completas com checkboxes `[x]`

**Exemplo:**
```
Você: /opsx:apply

IA:   Implementando add-dark-mode...

      Lendo tasks.md:
      - [ ] 1.1 Criar ThemeContext
      - [ ] 1.2 Adicionar propriedades CSS customizadas
      - [ ] 1.3 Implementar persistência no localStorage

      Trabalhando em 1.1: Criar ThemeContext...
      [Cria src/context/ThemeContext.tsx]

      ✓ 1.1 Completo

      Trabalhando em 1.2: Adicionar propriedades CSS customizadas...
      [Atualiza src/styles/globals.css]

      ✓ 1.2 Completo
      ...
```

**Dicas:**
- Pode retomar de onde parou se interrompido
- Use para mudanças paralelas especificando o nome da mudança
- O estado de conclusão é rastreado nos checkboxes do `tasks.md`

---

### `/opsx:verify`

Valida se a implementação corresponde aos artefatos da sua mudança. Verifica completude, correção e coerência.

**Sintaxe:**
```
/opsx:verify [nome-da-mudança]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `nome-da-mudança` | Não | Qual mudança verificar (inferido do contexto se não fornecido) |

**O que faz:**
- Verifica três dimensões da qualidade da implementação
- Pesquisa no codebase por evidências de implementação
- Relata problemas categorizados como CRÍTICO, AVISO ou SUGESTÃO
- Não bloqueia o arquivo, mas apresenta problemas

**Dimensões de verificação:**

| Dimensão | O que valida |
|----------|--------------|
| **Completude** | Todas as tarefas feitas, todos os requisitos implementados, cenários cobertos |
| **Correção** | Implementação corresponde à intenção da especificação, casos extremos tratados |
| **Coerência** | Decisões de design refletidas no código, padrões consistentes |

**Exemplo:**
```
Você: /opsx:verify

IA:   Verificando add-dark-mode...

      COMPLETENESS
      ✓ Todas as 8 tarefas em tasks.md estão marcadas
      ✓ Todos os requisitos em specs têm código correspondente
      ⚠ Cenário "Detecção de preferência do sistema" não tem cobertura de teste

      CORREÇÃO
      ✓ Implementação corresponde à intenção da especificação
      ✓ Casos extremos dos cenários são tratados
      ✓ Estados de erro correspondem às definições da especificação

      COERÊNCIA
      ✓ Decisões de design refletidas na estrutura do código
      ✓ Convenções de nomenclatura consistentes com design.md
      ⚠ Design menciona "variáveis CSS" mas implementação usa classes Tailwind

      RESUMO
      ─────────────────────────────
      Problemas críticos: 0
      Avisos: 2
      Pronto para arquivar: Sim (com avisos)

      Recomendações:
      1. Adicionar teste para detecção de preferência do sistema
      2. Atualizar design.md para refletir uso do Tailwind, ou refatorar para usar variáveis CSS
```

**Dicas:**
- Execute antes de arquivar para detectar incompatibilidades cedo
- Avisos não bloqueiam o arquivo, mas indicam problemas potenciais
- Útil para revisar o trabalho da IA antes de se comprometer
- Pode revelar divergência entre artefatos e implementação

---

### `/opsx:sync`

**Comando opcional.** Mescla especificações delta de uma mudança nas especificações principais. O arquivo irá solicitar a sincronização se necessário, então você normalmente não precisa executar isso manualmente.

**Sintaxe:**
```
/opsx:sync [nome-da-mudança]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `nome-da-mudança` | Não | Qual mudança sincronizar (inferido do contexto se não fornecido) |

**O que faz:**
- Lê as especificações delta da pasta da mudança
- Analisa as seções ADICIONADO/MODIFICADO/REMOVIDO/RENOMEADO
- Mescla as mudanças no diretório principal `openspec/specs/`
- Preserva o conteúdo existente não mencionado na delta
- Não arquiva a mudança (permanece ativa)

**Exemplo:**
```text
Você: /opsx:sync

IA:   Sincronizando especificações delta de add-dark-mode...

      Lendo: openspec/changes/add-dark-mode/specs/ui/spec.md
      Destino: openspec/specs/ui/spec.md

      Mudanças a aplicar:
      ✓ ADICIONADO: Requisito de Seleção de Tema (2 cenários)
      ✓ ADICIONADO: Requisito de Acessibilidade (1 cenário)

      Mesclando...
      ✓ openspec/specs/ui/spec.md atualizado

      Mudança permanece ativa. Execute /opsx:archive quando estiver pronto para concluir.
```

**Quando usar manualmente:**

| Cenário | Usar sync? |
|---------|------------|
| Mudança de longa duração, quer as specs na principal antes de arquivar | Sim |
| Múltiplas mudanças paralelas precisam das specs base atualizadas | Sim |
| Quer visualizar/revisar a mesclagem separadamente | Sim |
| Mudança rápida, indo direto para o arquivo | Não (o arquivo cuida disso) |

**Dicas:**
- A sincronização é inteligente, não é copiar e colar
- Pode adicionar cenários a requisitos existentes sem duplicar
- A mudança permanece ativa após a sincronização (não arquivada)
- A maioria dos usuários nunca precisará chamar isso diretamente—o arquivo solicita se necessário

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
| `nome-da-mudança` | Não | Qual mudança arquivar (inferido do contexto se não fornecido) |

**O que faz:**
- Verifica o status de conclusão dos artefatos
- Verifica a conclusão das tarefas (avisa se incompleto)
- Oferece para sincronizar especificações delta se ainda não sincronizadas
- Move a pasta da mudança para `openspec/changes/archive/AAAA-MM-DD-<nome>/`
- Preserva todos os artefatos para rastreamento de auditoria

**Exemplo:**
```text
Você: /opsx:archive

IA:   Arquivando add-dark-mode...

      Status dos artefatos:
      ✓ proposal.md existe
      ✓ specs/ existe
      ✓ design.md existe
      ✓ tasks.md existe (8/8 tarefas completas)

      Especificações delta: Ainda não sincronizadas
      → Sincronizar agora? (recomendado)

Você: Sim

IA:   ✓ Especificações sincronizadas para openspec/specs/ui/spec.md
      ✓ Movido para openspec/changes/archive/2025-01-24-add-dark-mode/

      Mudança arquivada com sucesso.
```

**Dicas:**
- O arquivo não bloqueará por tarefas incompletas, mas avisará
- As especificações delta podem ser sincronizadas durante o arquivo ou antes
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
| `nomes-das-mudanças` | Não | Mudanças específicas para arquivar (solicita seleção se não fornecido) |

**O que faz:**
- Lista todas as mudanças concluídas
- Valida cada mudança antes de arquivar
- Detecta conflitos de especificações entre mudanças
- Resolve conflitos verificando o que realmente está implementado
- Arquiva em ordem cronológica

**Exemplo:**
```
Você: /opsx:bulk-archive

IA:   Encontradas 3 mudanças concluídas:
      - add-dark-mode (8/8 tarefas completas)
      - fix-login-bug (3/3 tarefas completas)
      - update-footer (2/2 tarefas completas)

      Verificando conflitos de especificações...
      ⚠ add-dark-mode e update-footer ambos tocam specs/ui/

      Inspecionando codebase para resolver...
      Ambas as mudanças estão implementadas. Serão mescladas em ordem cronológica:
      1. add-dark-mode (criada em 20 de jan)
      2. update-footer (criada em 22 de jan)

      Arquivar todas as 3 mudanças?

Você: Sim

IA:   ✓ add-dark-mode arquivada
      ✓ fix-login-bug arquivada
      ✓ update-footer arquivada
      Especificações mescladas: add-dark-mode → update-footer
```

**Dicas:**
- Útil para fluxos de trabalho paralelos
- A resolução de conflitos é agêntica (verifica o codebase)
- Mudanças são arquivadas na ordem de criação
- Solicita antes de sobrescrever conteúdo de especificações

---

### `/opsx:onboard`

Onboarding guiado pelo fluxo de trabalho completo do OpenSpec. Um tutorial interativo usando seu codebase real.

**Sintaxe:**
```
/opsx:onboard
```

**O que faz:**
- Conduz por um ciclo completo de fluxo de trabalho com narração
- Escaneia seu codebase para oportunidades reais de melhoria
- Cria uma mudança real com artefatos reais
- Implementa trabalho real (mudanças pequenas e seguras)
- Arquiva a mudança concluída
- Explica cada etapa conforme acontece

**Fases:**
1. Boas-vindas e análise do codebase
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

IA:   Bem-vindo ao OpenSpec!

      Vou conduzi-lo pelo fluxo de trabalho completo usando seu codebase real.
      Vamos encontrar algo pequeno para melhorar, criar uma mudança adequada para isso,
      implementá-la e arquivá-la.

      Deixe-me escanear seu codebase para oportunidades...

      [Analisa o codebase]

      Encontrei algumas coisas em que poderíamos trabalhar:
      1. Adicionar validação de entrada ao formulário de contato
      2. Melhorar mensagens de erro no fluxo de autenticação
      3. Adicionar estados de carregamento a botões assíncronos

      O que te interessa? (ou sugira algo mais)
```

**Dicas:**
- Melhor para novos usuários aprendendo o fluxo de trabalho
- Usa código real, não exemplos fictícios
- Cria uma mudança real que você pode manter ou descartar
- Leva 15-30 minutos para completar

---

## Sintaxe de Comandos por Ferramenta de IA

Diferentes ferramentas de IA usam uma sintaxe de comandos ligeiramente diferente. Use o formato que corresponde à sua ferramenta:

| Ferramenta | Exemplo de Sintaxe |
|------------|---------------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Trae | Invocações baseadas em habilidades como `/openspec-propose`, `/openspec-apply-change` (sem arquivos de comando `opsx-*` gerados) |

A intenção é a mesma em todas as ferramentas, mas a maneira como os comandos são apresentados pode diferir por integração.

> **Nota:** Os comandos do GitHub Copilot (`.github/prompts/*.prompt.md`) estão disponíveis apenas em extensões de IDE (VS Code, JetBrains, Visual Studio). O GitHub Copilot CLI atualmente não suporta arquivos de prompt personalizados — veja [Ferramentas Suportadas](supported-tools.md) para detalhes e soluções alternativas.

---

## Comandos Legados

Estes comandos usam o fluxo de trabalho mais antigo "tudo de uma vez". Eles ainda funcionam, mas os comandos OPSX são recomendados.

| Comando | O que faz |
|---------|-----------|
| `/openspec:proposal` | Criar todos os artefatos de uma vez (proposta, especificações, design, tarefas) |
| `/openspec:apply` | Implementar a mudança |
| `/openspec:archive` | Arquivar a mudança |

**Quando usar comandos legados:**
- Projetos existentes que usam o fluxo de trabalho antigo
- Mudanças simples onde não é necessária a criação incremental de artefatos
- Preferência pela abordagem "tudo ou nada"

**Migrando para OPSX:**
Mudanças legadas podem ser continuadas com comandos OPSX. A estrutura dos artefatos é compatível.

---

## Solução de Problemas

### "Mudança não encontrada"

O comando não conseguiu identificar em qual mudança trabalhar.

**Soluções:**
- Especificar o nome da mudança explicitamente: `/opsx:apply add-dark-mode`
- Verificar se a pasta da mudança existe: `openspec list`
- Confirmar que está no diretório correto do projeto

### "Nenhum artefato pronto"

Todos os artefatos estão completos ou bloqueados por dependências ausentes.

**Soluções:**
- Executar `openspec status --change <nome>` para ver o que está bloqueando
- Verificar se os artefatos necessários existem
- Criar primeiro os artefatos de dependência ausentes

### "Esquema não encontrado"

O esquema especificado não existe.

**Soluções:**
- Listar esquemas disponíveis: `openspec schemas`
- Verificar a grafia do nome do esquema
- Criar o esquema se for personalizado: `openspec schema init <nome>`

### Comandos não reconhecidos

A ferramenta de IA não reconhece os comandos OpenSpec.

**Soluções:**
- Garantir que o OpenSpec está inicializado: `openspec init`
- Regenerar habilidades: `openspec update`
- Verificar se o diretório `.claude/skills/` existe (para Claude Code)
- Reiniciar sua ferramenta de IA para carregar as novas habilidades

### Artefatos não sendo gerados corretamente

A IA cria artefatos incompletos ou incorretos.

**Soluções:**
- Adicionar contexto do projeto em `openspec/config.yaml`
- Adicionar regras por artefato para orientação específica
- Fornecer mais detalhes na descrição da sua mudança
- Usar `/opsx:continue` em vez de `/opsx:ff` para mais controle

---

## Próximos Passos

- [Fluxos de Trabalho](workflows.md) - Padrões comuns e quando usar cada comando
- [CLI](cli.md) - Comandos de terminal para gerenciamento e validação
- [Personalização](customization.md) - Criar esquemas e fluxos de trabalho personalizados