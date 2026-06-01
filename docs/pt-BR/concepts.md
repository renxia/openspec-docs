# Conceitos

Este guia explica as ideias centrais por trás do OpenSpec e como elas se relacionam. Para uso prático, consulte [Primeiros Passos](getting-started.md) e [Fluxos de Trabalho](workflows.md).

## Filosofia

O OpenSpec é construído em torno de quatro princípios:

```
fluid not rigid         — no phase gates, work on what makes sense
iterative not waterfall — learn as you build, refine as you go
easy not complex        — lightweight setup, minimal ceremony
brownfield-first        — works with existing codebases, not just greenfield
```

### Por Que Esses Princípios São Importantes

**Fluid not rigid.** Sistemas de especificação tradicionais o prendem em fases: primeiro você planeja, depois implementa, e então termina. O OpenSpec é mais flexível — você pode criar artefatos em qualquer ordem que faça sentido para o seu trabalho.

**Iterative not waterfall.** Os requisitos mudam. O entendimento se aprofunda. O que parecia uma boa abordagem no início pode não se sustentar depois que você conhece a base de código. O OpenSpec abraça essa realidade.

**Easy not complex.** Alguns frameworks de especificação exigem configuração extensiva, formatos rígidos ou processos pesados. O OpenSpec não interfere no seu trabalho. Inicialize em segundos, comece a trabalhar imediatamente e personalize apenas se necessário.

**Brownfield-first.** A maioria do trabalho com software não consiste em construir do zero — é modificar sistemas existentes. A abordagem baseada em deltas do OpenSpec facilita especificar mudanças no comportamento existente, não apenas descrever novos sistemas.

## Visão Geral

O OpenSpec organiza seu trabalho em duas áreas principais:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Fonte de verdade   │◄─────│  Modificações propostas       │   │
│   │  Como seu sistema   │ merge│  Cada mudança = uma pasta     │   │
│   │  funciona atualmente│      │  Contém artefatos + deltas    │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** são a fonte de verdade — elas descrevem como seu sistema se comporta atualmente.

**Changes** são modificações propostas — elas residem em pastas separadas até que você esteja pronto para mesclá-las.

Essa separação é fundamental. Você pode trabalhar em múltiplas mudanças em paralelo sem conflitos. Você pode revisar uma mudança antes que ela afete as specs principais. E quando você arquiva uma mudança, seus deltas se mesclam de forma limpa na fonte de verdade.

## Workspaces de Coordenação

O suporte a workspaces está em beta. O modelo de visualização local abaixo é a direção atual, mas automação externa, integrações e fluxos de trabalho de longa duração ainda devem tratar o comportamento dos comandos, arquivos de estado e saída JSON como em evolução.

Os comandos abaixo fornecem o fluxo inicial de configuração para abrir visualizações locais sobre repositórios ou pastas vinculados.

Projetos OpenSpec locais ao repositório são a escolha padrão correta quando um único repositório é dono do fluxo de planejamento, implementação e arquivo. Alguns trabalhos abrangem vários repositórios ou pastas. Para esse caso, um workspace de coordenação OpenSpec é uma visualização local da máquina que mantém caminhos vinculados, estado do opener e configuração de agentes juntos.

O modelo mental do workspace é:

```text
workspace     = visualização local privada sobre armazenadores de contexto, iniciativas, repositórios e pastas
armazenador de contexto = contêiner de contexto compartilhado durável
iniciativa     = contexto de coordenação durável dentro de um armazenador de contexto
vínculo        = um nome estável para um repositório ou pasta que o workspace pode resolver localmente
mudança        = uma peça de trabalho planejada; a implementação pertence ao repositório dono
```

Um workspace tem um formato diferente de um projeto local ao repositório:

```text
getGlobalDataDir()/workspaces/<nome-do-workspace>/
├── workspace.yaml                 # Registro da visualização local privada
├── AGENTS.md                      # Guia de tempo de execução gerado
└── <nome-do-workspace>.code-workspace # Arquivo de workspace do editor gerado
```

O estado OpenSpec local ao repositório mantém o formato existente:

```text
raiz-do-repositório/
└── openspec/
    ├── specs/
    └── changes/
```

Essa distinção importa. A pasta do workspace é uma superfície de coordenação local para abrir e inspecionar repositórios ou pastas vinculados. O diretório `openspec/` de cada repositório continua sendo o lar para specs de propriedade do repositório, mudanças locais ao repositório e planejamento de implementação. Usuários não precisam executar o `openspec init` local ao repositório dentro de uma pasta de workspace.

Nomes de vínculos estáveis são como um workspace se refere a repositórios e pastas. O registro privado do workspace mantém nomes como `api`, `web` ou `checkout` e os mapeia para os caminhos locais em tempo de execução.

```yaml
# workspace.yaml
version: 1
name: platform
context: null
links:
  api: /repos/api
  web: /repos/web
```

Quando um workspace abre uma iniciativa, `context` registra a ligação do armazenador de contexto selecionado e o id da iniciativa. Armazenadores selecionados pelo registro permanecem portáveis por id; armazenadores selecionados por caminho intencionalmente preservam o caminho local em tempo de execução porque `workspace.yaml` é um estado local privado.

```yaml
context:
  kind: initiative
  store:
    id: platform
    selector:
      kind: registry
      id: platform
  initiative:
    id: billing-launch
```

Caminhos vinculados podem ser repositórios completos, pastas dentro de um monorepo grande ou outras pastas existentes. Eles não precisam de estado `openspec/` local ao repositório antes de poderem participar do planejamento do workspace. Fluxos de trabalho de implementação, verificação ou arquivo subsequentes podem exigir mais preparação do repositório, mas a visibilidade de planejamento começa com o vínculo.

```text
multi-repo:
  api      -> /repos/api
  web      -> /repos/web

monorepo grande:
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

Workspaces gerenciados residem sob o diretório de dados padrão do OpenSpec:

```text
getGlobalDataDir()/workspaces
```

Isso significa `$XDG_DATA_HOME/openspec/workspaces` quando `XDG_DATA_HOME` está definido, `~/.local/share/openspec/workspaces` no fallback estilo Unix e `%LOCALAPPDATA%\openspec\workspaces` no fallback nativo do Windows. Shells nativos do Windows, PowerShell e WSL2 mantêm cada um as strings de caminho para o tempo de execução que está executando o OpenSpec. Essa base não faz tradução entre `D:\repo`, `/mnt/d/repo` e caminhos UNC do WSL.

O OpenSpec ainda pode ler raízes de workspace beta mais antigas como entradas de compatibilidade, mas os workspaces gerenciados agora usam o registro raiz `workspace.yaml` acima. A pasta do workspace permanece autoritativa para sua própria visualização local privada.

A visibilidade do workspace não é compromisso com uma mudança. Configure um workspace quando o OpenSpec deveria saber quais repositórios ou pastas são relevantes; crie uma mudança mais tarde quando você estiver pronto para planejar uma funcionalidade, correção, projeto ou outra peça de trabalho.

Comandos úteis:

```bash
# Configuração guiada
openspec workspace setup

# Configuração amigável para automação
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli

# Ver workspaces conhecidos do registro local
openspec workspace list
openspec workspace ls

# Adicionar ou reparar vínculos para o workspace selecionado
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Verificar o que esta máquina pode resolver
openspec workspace doctor
openspec workspace doctor --workspace platform

# Atualizar o guia e habilidades de agentes do workspace local
openspec workspace update
openspec workspace update --workspace platform --tools codex,claude

# Abrir o conjunto de trabalho vinculado
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor

# Abrir uma iniciativa como uma visualização de workspace local
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative billing-launch --store-path /repos/platform-context
```

`workspace setup` sempre cria o workspace no local padrão do workspace, o registra no registro local, mostra a localização do workspace e requer pelo menos um repositório ou pasta vinculado. A configuração interativa pergunta por um opener preferido e pode instalar habilidades do OpenSpec para agentes selecionados. A configuração não interativa armazena um apenas quando `--opener codex-cli`, `--opener claude`, `--opener github-copilot` ou `--opener editor` é fornecido.

Habilidades do workspace são instaladas apenas na raiz do workspace. O perfil global ativo seleciona quais habilidades de fluxo de trabalho são geradas; `--tools` seleciona quais agentes as recebem. A configuração e atualização do workspace não criam arquivos de comando barra mesmo quando a entrega global inclui comandos. Execute `openspec workspace update` para atualizar o guia local do workspace e adicionar, atualizar ou remover diretórios de habilidades gerenciados localmente ao workspace sem editar repositórios ou pastas vinculados.

O OpenSpec também mantém arquivos abertos do workspace raiz: um bloco de guia gerenciado pelo OpenSpec em `AGENTS.md` e um arquivo `<nome-do-workspace>.code-workspace` local da máquina para aberturas do VS Code e GitHub Copilot-in-VS-Code. Um workspace gerenciado não é um repositório, então o OpenSpec não cria um `.gitignore` padrão do workspace nem um diretório `changes/` padrão no nível do workspace.

O workspace VS Code mantido lista primeiro os repositórios ou pastas vinculados válidos, depois o contexto da iniciativa quando anexado, e então os arquivos do workspace OpenSpec. O VS Code exibe essas entradas como um workspace multi-raiz.

`workspace open` abre o conjunto de trabalho vinculado com o opener preferido armazenado, a menos que `--agent <ferramenta>` ou `--editor` seja passado para aquela sessão. Passar ambas as substituições de opener é um erro. A abertura do workspace raiz torna os repositórios e pastas vinculados visíveis para exploração e contexto; a implementação começa após o usuário solicitar explicitamente o trabalho de implementação.

`workspace link` e `workspace relink` apenas registram pastas existentes; eles não criam, copiam, movem, inicializam nem editam o repositório ou pasta vinculado. Após um vínculo ou re-vínculo bem-sucedido, o OpenSpec atualiza o guia gerenciado e o arquivo de workspace do VS Code.

Comandos de workspace que precisam de um workspace podem ser executados de qualquer lugar com `--workspace <nome>`. Se você os executar dentro de uma pasta ou subdiretório do workspace, o OpenSpec usa esse workspace atual. Se vários workspaces conhecidos estiverem disponíveis e você não passar `--workspace <nome>`, comandos humanos mostram um seletor; `--json` e `--no-interactive` falham com um erro de status estruturado em vez de solicitar.

Comandos diretos do workspace suportam saída JSON para scripts. Respostas JSON mantêm dados primários em objetos `workspace`, `workspaces` ou `link` e reportam avisos ou erros em arrays `status`. Objetos saudáveis usam `status: []`.

## Specs

As specs descrevem o comportamento do seu sistema usando requisitos e cenários estruturados.

### Estrutura

```
openspec/specs/
├── auth/
│   └── spec.md           # Comportamento de autenticação
├── payments/
│   └── spec.md           # Processamento de pagamentos
├── notifications/
│   └── spec.md           # Sistema de notificações
└── ui/
    └── spec.md           # Comportamento da UI e temas
```

Organize as specs por domínio — agrupamentos lógicos que fazem sentido para o seu sistema. Padrões comuns:

- **Por área de funcionalidade**: `auth/`, `payments/`, `search/`
- **Por componente**: `api/`, `frontend/`, `workers/`
- **Por contexto delimitado**: `ordering/`, `fulfillment/`, `inventory/`

### Formato da Spec

Uma spec contém requisitos, e cada requisito tem cenários:

```markdown
# Especificação de Autenticação

## Propósito
Autenticação e gerenciamento de sessão para a aplicação.

## Requisitos

### Requisito: Autenticação de Usuário
O sistema DEVE emitir um token JWT após um login bem-sucedido.

#### Cenário: Credenciais válidas
- DADO um usuário com credenciais válidas
- QUANDO o usuário submete o formulário de login
- ENTÃO um token JWT é retornado
- E o usuário é redirecionado para o painel

#### Cenário: Credenciais inválidas
- DADO credenciais inválidas
- QUANDO o usuário submete o formulário de login
- ENTÃO uma mensagem de erro é exibida
- E nenhum token é emitido

### Requisito: Expiração de Sessão
O sistema DEVE expirar sessões após 30 minutos de inatividade.

#### Cenário: Timeout por inatividade
- DADO uma sessão autenticada
- QUANDO 30 minutos passam sem atividade
- ENTÃO a sessão é invalidada
- E o usuário deve se reautenticar
```

**Elementos-chave:**

| Elemento | Propósito |
|---------|---------|
| `## Propósito` | Descrição de alto nível do domínio desta spec |
| `### Requisito:` | Um comportamento específico que o sistema deve ter |
| `#### Cenário:` | Um exemplo concreto do requisito em ação |
| SHALL/MUST/SHOULD (DEVE/DEVE/DEVERIA) | Palavras-chave RFC 2119 indicando a força do requisito |

### Por que Estruturar Specs Dessa Forma

**Requisitos são o "o quê"** — eles declaram o que o sistema deve fazer sem especificar a implementação.

**Cenários são o "quando"** — eles fornecem exemplos concretos que podem ser verificados. Bons cenários:
- São testáveis (você poderia escrever um teste automatizado para eles)
- Cobrem tanto o caminho feliz quanto os casos de borda
- Usam Dado/Quando/Então ou formato estruturado similar

**Palavras-chave RFC 2119** (DEVE, DEVERIA, PODE) comunicam a intenção:
- **DEVE (MUST/SHALL)** — requisito absoluto
- **DEVERIA (SHOULD)** — recomendado, mas existem exceções
- **PODE (MAY)** — opcional

### O que uma Spec É (e o que Não É)

Uma spec é um **contrato de comportamento**, não um plano de implementação.

Bom conteúdo de spec:
- Comportamento observável em que usuários ou sistemas downstream dependem
- Entradas, saídas e condições de erro
- Restrições externas (segurança, privacidade, confiabilidade, compatibilidade)
- Cenários que podem ser testados ou explicitamente validados

Evite em specs:
- Nomes internos de classes/funções
- Escolhas de bibliotecas ou frameworks
- Detalhes de implementação passo a passo
- Planos de execução detalhados (esses pertencem a `design.md` ou `tasks.md`)

Teste rápido:
- Se a implementação pode mudar sem alterar o comportamento visível externamente, provavelmente não pertence à spec.

### Mantenha Leve: Rigor Progressivo

O OpenSpec visa evitar burocracia. Use o nível mais leve que ainda torne a mudança verificável.

**Spec lite (padrão):**
- Requisitos curtos focados no comportamento
- Escopo e não-objetivos claros
- Algumas verificações de aceitação concretas

**Spec completa (para maior risco):**
- Mudanças entre equipes ou entre repositórios
- Mudanças de API/contrato, migrações, preocupações de segurança/privacidade
- Mudanças onde a ambigüidade provavelmente causaria retrabalho caro

A maioria das mudanças deve permanecer no modo Lite.

### Colaboração Humano + Agente

Em muitas equipes, humanos exploram e agentes rascunham artefatos. O loop pretendido é:

1. O humano fornece intenção, contexto e restrições.
2. O agente converte isso em requisitos e cenários focados no comportamento.
3. O agente mantém detalhes de implementação em `design.md` e `tasks.md`, não em `spec.md`.
4. A validação confirma a estrutura e clareza antes da implementação.

Isso mantém as specs legíveis para humanos e consistentes para agentes.

## Alterações

Uma alteração é uma modificação proposta para o seu sistema, empacotada como uma pasta com tudo o que é necessário para compreendê-la e implementá-la.

### Estrutura da Alteração

```
openspec/changes/add-dark-mode/
├── proposal.md           # Por que e o quê
├── design.md             # Como (abordagem técnica)
├── tasks.md              # Lista de verificação de implementação
├── .openspec.yaml        # Metadados da alteração (opcional)
└── specs/                # Especificações delta
    └── ui/
        └── spec.md       # O que está mudando em ui/spec.md
```

Cada alteração é autocontida. Ela possui:
- **Artefatos** — documentos que capturam a intenção, o design e as tarefas
- **Especificações delta** — especificações para o que está sendo adicionado, modificado ou removido
- **Metadados** — configuração opcional para esta alteração específica

### Por que Alterações São Pastas

Empacotar uma alteração como uma pasta possui diversos benefícios:

1. **Tudo junto.** A proposta, o design, as tarefas e as especificações ficam em um único lugar. Sem precisar procurar em diferentes localizações.

2. **Trabalho paralelo.** Várias alterações podem existir simultaneamente sem conflitar. Trabalhe em `add-dark-mode` enquanto `fix-auth-bug` também está em andamento.

3. **Histórico limpo.** Quando arquivadas, as alterações são movidas para `changes/archive/` com seu contexto completo preservado. Você pode olhar para trás e entender não apenas o que mudou, mas o porquê.

4. **Amigável para revisão.** Uma pasta de alteração é fácil de revisar — abra-a, leia a proposta, verifique o design, veja as deltas da especificação.

## Artefatos

Artefatos são os documentos dentro de uma alteração que orientam o trabalho.

### O Fluxo dos Artefatos

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   por que        o quê        como        etapas
 + escopo       mudanças    abordagem    a tomar
```

Os artefatos se constroem uns sobre os outros. Cada artefato fornece contexto para o próximo.

### Tipos de Artefatos

#### Proposta (`proposal.md`)

A proposta captura a **intenção**, o **escopo** e a **abordagem** em alto nível.

```markdown
# Proposta: Adicionar Modo Escuro
```

## Intenção
Os usuários solicitaram uma opção de modo escuro para reduzir o cansaço visual durante o uso noturno e corresponder às preferências do sistema.

## Escopo
Dentro do escopo:
- Alternância de tema nas configurações
- Detecção de preferência do sistema
- Persistência da preferência no localStorage

Fora do escopo:
- Temas de cores personalizados (trabalho futuro)
- Substituições de tema por página

## Abordagem
Usar propriedades CSS personalizadas para temas com um contexto React para gerenciamento de estado. Detectar a preferência do sistema na primeira carga, permitir substituição manual.
```

**Quando atualizar a proposta:**
- Mudanças no escopo (redução ou expansão)
- A intenção se esclarece (melhor entendimento do problema)
- A abordagem muda fundamentalmente

#### Especificações (especificações delta em `specs/`)

As especificações delta descrevem **o que está mudando** em relação às especificações atuais. Veja [Especificações Delta](#especificações-delta) abaixo.

#### Design (`design.md`)

O design captura a **abordagem técnica** e as **decisões de arquitetura**.

````markdown
# Design: Adicionar Modo Escuro

## Abordagem Técnica
Estado do tema gerenciado via React Context para evitar prop drilling. Propriedades CSS personalizadas permitem a troca em tempo real sem alternância de classe.

## Decisões de Arquitetura

### Decisão: Contexto sobre Redux
Usar React Context para o estado do tema porque:
- Estado binário simples (claro/escuro)
- Sem transições de estado complexas
- Evita adicionar a dependência do Redux

### Decisão: Propriedades CSS Personalizadas
Usar variáveis CSS em vez de CSS-in-JS porque:
- Funciona com a folha de estilos existente
- Sem sobrecarga em tempo de execução
- Solução nativa do navegador

## Fluxo de Dados
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (aplicado ao :root)
```

## Mudanças de Arquivo
- `src/contexts/ThemeContext.tsx` (novo)
- `src/components/ThemeToggle.tsx` (novo)
- `src/styles/globals.css` (modificado)
````

**Quando atualizar o design:**
- A implementação revela que a abordagem não funcionará
- Uma solução melhor é descoberta
- Dependências ou restrições mudam

#### Tarefas (`tasks.md`)

As tarefas são a **lista de implementação** — etapas concretas com caixas de seleção.

```markdown
# Tarefas

## 1. Infraestrutura do Tema
- [ ] 1.1 Criar ThemeContext com estado claro/escuro
- [ ] 1.2 Adicionar propriedades CSS personalizadas para cores
- [ ] 1.3 Implementar persistência no localStorage
- [ ] 1.4 Adicionar detecção de preferência do sistema

## 2. Componentes de UI
- [ ] 2.1 Criar componente ThemeToggle
- [ ] 2.2 Adicionar alternância à página de configurações
- [ ] 2.3 Atualizar Header para incluir alternância rápida

## 3. Estilização
- [ ] 3.1 Definir paleta de cores do tema escuro
- [ ] 3.2 Atualizar componentes para usar variáveis CSS
- [ ] 3.3 Testar razões de contraste para acessibilidade
```

**Melhores práticas para tarefas:**
- Agrupar tarefas relacionadas sob títulos
- Usar numeração hierárquica (1.1, 1.2, etc.)
- Manter tarefas pequenas o suficiente para completar em uma sessão
- Marcar tarefas como concluídas à medida que as finaliza

## Especificações Delta

Especificações delta são o conceito chave que faz o OpenSpec funcionar para desenvolvimento em sistemas legados. Elas descrevem **o que está mudando** em vez de reafirmar toda a especificação.

### O Formato

```markdown
# Delta para Autenticação

## REQUISITOS ADICIONADOS

### Requisito: Autenticação de Dois Fatores
O sistema DEVE suportar autenticação de dois fatores baseada em TOTP.

#### Cenário: Ingresso no 2FA
- DADO um usuário sem 2FA habilitado
- QUANDO o usuário habilita 2FA nas configurações
- ENTÃO um código QR é exibido para configuração do aplicativo autenticador
- E o usuário deve verificar com um código antes da ativação

#### Cenário: Login com 2FA
- DADO um usuário com 2FA habilitado
- QUANDO o usuário submete credenciais válidas
- ENTÃO um desafio de OTP é apresentado
- E o login é concluído somente após OTP válido

## REQUISITOS MODIFICADOS

### Requisito: Expiração de Sessão
O sistema DEVE expirar sessões após 15 minutos de inatividade.
(Anteriormente: 30 minutos)

#### Cenário: Tempo limite por inatividade
- DADA uma sessão autenticada
- QUANDO 15 minutos se passam sem atividade
- ENTÃO a sessão é invalidada

## REQUISITOS REMOVIDOS

### Requisito: Lembrar-me
(Descontinuado em favor do 2FA. Os usuários devem reautenticar-se a cada sessão.)
```

### Seções Delta

| Seção | Significado | O que acontece no Arquivamento |
|-------|-------------|--------------------------------|
| `## REQUISITOS ADICIONADOS` | Novo comportamento | Anexado à especificação principal |
| `## REQUISITOS MODIFICADOS` | Comportamento alterado | Substitui o requisito existente |
| `## REQUISITOS REMOVIDOS` | Comportamento descontinuado | Excluído da especificação principal |

### Por que Deltas em vez de Especificações Completas

**Clareza.** Um delta mostra exatamente o que está mudando. Ao ler uma especificação completa, você teria que diferenciá-la mentalmente da versão atual.

**Evita conflitos.** Duas mudanças podem tocar no mesmo arquivo de especificação sem conflitar, desde que modifiquem requisitos diferentes.

**Eficiência na revisão.** Os revisores veem a mudança, não o contexto inalterado. Foco no que importa.

**Adequado para sistemas legados.** A maioria do trabalho modifica comportamentos existentes. Tornam as modificações cidadãos de primeira classe, não uma reflexão tardia.

## Schemas

Schemas definem os tipos de artefatos e suas dependências para um fluxo de trabalho.

### Como os Schemas Funcionam

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Sem dependências, pode criar primeiro

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Precisa da proposta antes de criar

  - id: design
    generates: design.md
    requires: [proposal]      # Pode criar em paralelo com specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Precisa de specs e design primeiro
```

**Artefatos formam um grafo de dependência:**

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

**Dependências são facilitadores, não bloqueios.** Elas mostram o que é possível criar, não o que você deve criar a seguir. Você pode pular o design se não precisar dele. Você pode criar especificações antes ou depois do design — ambas dependem apenas da proposta.

### Schemas Embutidos

**spec-driven** (padrão)

O fluxo de trabalho padrão para desenvolvimento orientado por especificações:

```
proposal → specs → design → tasks → implement
```

Ideal para: A maioria do trabalho de funcionalidades onde você deseja concordar nas especificações antes da implementação.

### Schemas Personalizados

Crie schemas personalizados para o fluxo de trabalho da sua equipe:

```bash
# Crie do zero
openspec schema init research-first

# Ou bifurque um existente
openspec schema fork spec-driven research-first
```

**Exemplo de schema personalizado:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Fazer pesquisa primeiro

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposta informada pela pesquisa

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Pular specs/design, ir direto para tarefas
```

Consulte [Personalização](customization.md) para detalhes completos sobre como criar e usar schemas personalizados.

## Arquivamento

O arquivamento conclui uma mudança, mesclando suas especificações delta nas especificações principais e preservando a mudança para o histórico.

### O que Acontece Quando Você Arquiva

```
Antes do arquivamento:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ mesclar
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Após o arquivamento:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Agora inclui requisitos de 2FA
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Preservado para histórico
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### O Processo de Arquivamento

1. **Mesclar deltas.** Cada seção de especificação delta (ADICIONADOS/MODIFICADOS/REMOVIDOS) é aplicada à especificação principal correspondente.

2. **Mover para o arquivo.** A pasta da mudança é movida para `changes/archive/` com um prefixo de data para ordenação cronológica.

3. **Preservar contexto.** Todos os artefatos permanecem intactos no arquivo. Você sempre pode olhar para trás para entender por que uma mudança foi feita.

### Por que o Arquivamento é Importante

**Estado limpo.** As mudanças ativas (`changes/`) mostram apenas o trabalho em andamento. O trabalho concluído sai do caminho.

**Trilha de auditoria.** O arquivo preserva o contexto completo de cada mudança — não apenas o que mudou, mas a proposta explicando por quê, o design explicando como e as tarefas mostrando o trabalho feito.

**Evolução das especificações.** As especificações crescem organicamente à medida que as mudanças são arquivadas. Cada arquivo mescla seus deltas, construindo ao longo do tempo uma especificação abrangente.

## Como Tudo se Encaixa

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FLUXO OPENSPEC                                  │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. INICIAR    │  /opsx:propose (core) ou /opsx:new (expandido)          │
│   │    MUDANÇA     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CRIAR      │  /opsx:ff ou /opsx:continue (fluxo de trabalho expandido)|
│   │   ARTEFATOS    │  Cria proposta → especificações → design → tarefas       │
│   │                │  (baseado nas dependências do schema)                    │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENTAR│  /opsx:apply                                            │
│   │    TAREFAS     │  Trabalhar nas tarefas, marcando-as como concluídas     │
│   │                │◄──── Atualizar artefatos conforme você aprende          │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFICAR  │  /opsx:verify (opcional)                                │
│   │    TRABALHO    │  Verificar se a implementação corresponde às specs      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARQUIVAR   │────►│  Especificações delta mesclam nas specs     │    │
│   │    MUDANÇA     │     │  Pasta da mudança movida para archive/      │    │
│   └────────────────┘     │  Specs agora são a fonte atualizada da verdade│    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**O ciclo virtuoso:**

1. Especificações descrevem o comportamento atual
2. Mudanças propõem modificações (como deltas)
3. Implementação torna as mudanças reais
4. Arquivamento mescla deltas nas especificações
5. Especificações agora descrevem o novo comportamento
6. A próxima mudança se baseia nas especificações atualizadas

## Glossário

| Termo | Definição |
|-------|-----------|
| **Artefato** | Um documento dentro de uma mudança (proposta, design, tarefas ou especificações delta) |
| **Arquivamento** | O processo de concluir uma mudança e mesclar suas deltas nas especificações principais |
| **Mudança** | Uma modificação proposta para o sistema, empacotada como uma pasta com artefatos |
| **Especificação delta** | Uma especificação que descreve alterações (ADICIONADAS/MODIFICADAS/REMOVIDAS) em relação às especificações atuais |
| **Domínio** | Um agrupamento lógico para especificações (ex.: `auth/`, `payments/`) |
| **Requisito** | Um comportamento específico que o sistema deve ter |
| **Cenário** | Um exemplo concreto de um requisito, tipicamente no formato Dado/Quando/Então |
| **Esquema** | Uma definição dos tipos de artefatos e suas dependências |
| **Especificação** | Uma especificação que descreve o comportamento do sistema, contendo requisitos e cenários |
| **Fonte da verdade** | O diretório `openspec/specs/`, contendo o comportamento atual acordado |

## Próximos Passos

- [Primeiros Passos](getting-started.md) - Passos práticos iniciais
- [Fluxos de Trabalho](workflows.md) - Padrões comuns e quando usar cada um
- [Comandos](commands.md) - Referência completa de comandos
- [Personalização](customization.md) - Crie esquemas personalizados e configure seu projeto