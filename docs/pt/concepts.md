# Conceitos

Este guia explica os conceitos centrais por trás do OpenSpec e como eles se interagem. Para uso prático, consulte [Getting Started](getting-started.md) e [Workflows](workflows.md).

## Filosofia

O OpenSpec é construído em torno de quatro princípios:

```
fluid not rigid         — no phase gates, work on what makes sense
iterative not waterfall — learn as you build, refine as you go
easy not complex        — lightweight setup, minimal ceremony
brownfield-first        — works with existing codebases, not just greenfield
```

### Por Que Estes Princípios São Importantes

**Fluido, não rígido.** Sistemas de especificação tradicionais prendem você em fases: primeiro você planeja, depois implementa, e então termina. O OpenSpec é mais flexível — você pode criar artefatos em qualquer ordem que faça sentido para o seu trabalho.

**Iterativo, não cascata.** Os requisitos mudam. O entendimento se aprofunda. O que parecia uma boa abordagem no início pode não se sustentar depois que você analisa o código existente. O OpenSpec abraça esta realidade.

**Fácil, não complexo.** Alguns frameworks de especificação requerem configuração extensiva, formatos rígidos ou processos pesados. O OpenSpec fica fora do seu caminho. Inicialize em segundos, comece a trabalhar imediatamente e personalize apenas se necessário.

**Prioridade para sistemas existentes (brownfield).** A maioria do trabalho com software não é construir do zero — é modificar sistemas existentes. A abordagem baseada em deltas do OpenSpec facilita especificar mudanças no comportamento existente, não apenas descrever novos sistemas.

## O Panorama Geral

O OpenSpec organiza seu trabalho em duas áreas principais:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Fonte da verdade   │◄─────│  Modificações propostas       │   │
│   │  Como seu sistema   │ mescl│  Cada mudança = uma pasta     │   │
│   │  funciona atualmente│  a   │  Contém artefatos + deltas    │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** são a fonte da verdade — elas descrevem como seu sistema se comporta atualmente.

**Changes** são modificações propostas — elas residem em pastas separadas até que você esteja pronto para mesclá-las.

Essa separação é fundamental. Você pode trabalhar em múltiplas mudanças em paralelo sem conflitos. Você pode revisar uma mudança antes que ela afete as specs principais. E quando você arquiva uma mudança, seus deltas mesclam limparmente na fonte da verdade.

## Workspaces de Coordenação

O suporte a workspaces está em beta. O modelo de visão local abaixo é a direção atual, mas automação externa, integrações e fluxos de trabalho de longa duração ainda devem tratar o comportamento dos comandos, arquivos de estado e saída JSON como algo em evolução.

Os comandos abaixo fornecem o primeiro fluxo de configuração para abrir visões locais sobre repositórios ou pastas vinculados.

Projetos OpenSpec locais do repositório são o padrão correto quando um único repositório é dono do fluxo de planejamento, implementação e arquivamento. Alguns trabalhos abrangem vários repositórios ou pastas. Para esse caso, um workspace de coordenação do OpenSpec é uma visão local da máquina que mantém caminhos vinculados, estado do opener e configuração de agentes juntos.

O modelo mental do workspace é:

```text
workspace     = visão local privada sobre lojas de contexto, iniciativas, repositórios e pastas
loja de contexto = contêiner de contexto compartilhado durável
iniciativa    = contexto de coordenação durável dentro de uma loja de contexto
link          = um nome estável para um repositório ou pasta que o workspace pode resolver localmente
mudança       = uma peça planejada de trabalho; a implementação pertence ao repositório dono
```

Um workspace tem um formato diferente de um projeto local do repositório:

```text
getGlobalDataDir()/workspaces/<nome-do-workspace>/
├── workspace.yaml                 # Registro de visão local privada
├── AGENTS.md                      # Orientação de tempo de execução gerada
└── <nome-do-workspace>.code-workspace # Arquivo de workspace do editor gerado
```

O estado OpenSpec local do repositório mantém o formato existente:

```text
raiz-do-repositorio/
└── openspec/
    ├── specs/
    └── changes/
```

Essa distinção importa. A pasta do workspace é uma superfície de coordenação local para abrir e inspecionar repositórios ou pastas vinculados. O diretório `openspec/` de cada repositório continua sendo o lar das specs de propriedade do repositório, das mudanças locais do repositório e do planejamento de implementação. Os usuários não precisam executar `openspec init` local do repositório dentro de uma pasta de workspace.

Nomes de links estáveis são a forma como um workspace se refere a repositórios e pastas. O registro privado do workspace mantém nomes como `api`, `web` ou `checkout` e os mapeia para os caminhos locais deste tempo de execução.

```yaml
# workspace.yaml
version: 1
name: platform
context: null
links:
  api: /repos/api
  web: /repos/web
```

Quando um workspace abre uma iniciativa, `context` registra a ligação da loja de contexto selecionada e o id da iniciativa. Lojas selecionadas por registro permanecem portáveis por id; lojas selecionadas por caminho intencionalmente preservam o caminho local do tempo de execução porque `workspace.yaml` é um estado local privado.

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

Os caminhos vinculados podem ser repositórios completos, pastas dentro de um monorepo grande ou outras pastas existentes. Eles não precisam de estado `openspec/` local do repositório antes de poderem participar do planejamento do workspace. Fluxos de trabalho de implementação, verificação ou arquivamento posteriores podem exigir mais preparo do repositório, mas a visibilidade do planejamento começa com o link.

```text
multi-repo:
  api      -> /repos/api
  web      -> /repos/web

monorepo grande:
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

Workspaces gerenciados residem sob o diretório padrão de dados do OpenSpec:

```text
getGlobalDataDir()/workspaces
```

Isso significa `$XDG_DATA_HOME/openspec/workspaces` quando `XDG_DATA_HOME` está definido, `~/.local/share/openspec/workspaces` no fallback estilo Unix, e `%LOCALAPPDATA%\openspec\workspaces` no fallback nativo do Windows. Shells nativos do Windows, PowerShell e WSL2 mantêm cada um as strings de caminho para o tempo de execução executando o OpenSpec. Essa base não traduz entre `D:\repo`, `/mnt/d/repo` e caminhos UNC do WSL.

O OpenSpec ainda pode ler raízes de workspace beta mais antigas como entradas de compatibilidade, mas workspaces gerenciados agora usam o registro raiz `workspace.yaml` acima. A pasta do workspace permanece autoritativa para sua própria visão local privada.

A visibilidade do workspace não é um compromisso com a mudança. Configure um workspace quando o OpenSpec deve saber quais repositórios ou pastas são relevantes; crie uma mudança mais tarde quando você estiver pronto para planejar uma funcionalidade, correção, projeto ou outra peça de trabalho.

Comandos úteis:

```bash
# Configuração guiada
openspec workspace setup

# Configuração amigável para automação
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli

# Ver workspaces conhecidos a partir do registro local
openspec workspace list
openspec workspace ls

# Adicionar ou corrigir links para o workspace selecionado
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Verificar o que esta máquina pode resolver
openspec workspace doctor
openspec workspace doctor --workspace platform

# Atualizar orientação local do workspace e habilidades dos agentes
openspec workspace update
openspec workspace update --workspace platform --tools codex,claude

# Abrir o conjunto de trabalho vinculado
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor

# Abrir uma iniciativa como uma visão de workspace local
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative billing-launch --store-path /repos/platform-context
```

`workspace setup` sempre cria o workspace no local padrão do workspace, o registra no registro local, mostra a localização do workspace e exige pelo menos um repositório ou pasta vinculado. A configuração interativa pergunta por um opener preferido e pode instalar habilidades do OpenSpec para agentes selecionados. A configuração não-interativa armazena um apenas quando `--opener codex-cli`, `--opener claude`, `--opener github-copilot` ou `--opener editor` é fornecido.

As habilidades do workspace são instaladas apenas na raiz do workspace. O perfil global ativo seleciona quais habilidades de fluxo de trabalho são geradas; `--tools` seleciona quais agentes as recebem. A configuração e atualização do workspace não criam arquivos de comando slash mesmo quando a entrega global inclui comandos. Execute `openspec workspace update` para atualizar a orientação local do workspace e adicionar, atualizar ou remover diretórios de habilidades locais gerenciadas do workspace sem editar repositórios ou pastas vinculados.

O OpenSpec também mantém arquivos abertos de workspace raiz: um bloco de orientação gerenciado pelo OpenSpec em `AGENTS.md` e um arquivo `<nome-do-workspace>.code-workspace` local da máquina para VS Code e GitHub Copilot no VS Code. Um workspace gerenciado não é um repositório, então o OpenSpec não cria um `.gitignore` padrão do workspace nem um diretório `changes/` padrão no nível do workspace.

O workspace VS Code mantido lista primeiro repositórios ou pastas vinculados válidos, depois o contexto da iniciativa quando anexado, depois os arquivos do workspace OpenSpec. O VS Code exibe essas entradas como um workspace multi-raiz.

`workspace open` abre o conjunto de trabalho vinculado com o opener preferido armazenado, a menos que `--agent <tool>` ou `--editor` seja passado para essa sessão específica. Passar ambas as sobrescritas do opener é um erro. A abertura do workspace raiz torna os repositórios e pastas vinculados visíveis para exploração e contexto; a implementação começa após o usuário explicitamente solicitar trabalho de implementação.

`workspace link` e `workspace relink` registram apenas pastas existentes; eles não criam, copiam, movem, inicializam nem editam o repositório ou pasta vinculado. Após um link ou relink bem-sucedido, o OpenSpec atualiza a orientação gerenciada e o arquivo do workspace do VS Code.

Comandos de workspace que precisam de um workspace podem ser executados de qualquer lugar com `--workspace <nome>`. Se você os executar dentro de uma pasta ou subdiretório do workspace, o OpenSpec usa esse workspace atual. Se vários workspaces conhecidos estiverem disponíveis e você não passar `--workspace <nome>`, comandos humanos exibem um seletor; `--json` e `--no-interactive` falham com um erro de status estruturado em vez de solicitar.

Comandos diretos de workspace suportam saída JSON para scripts. Respostas JSON mantêm dados primários em objetos `workspace`, `workspaces` ou `link` e reportam avisos ou erros em matrizes `status`. Objetos saudáveis usam `status: []`.

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

Organize as specs por domínio — agrupamentos lógicos que fazem sentido para seu sistema. Padrões comuns:

- **Por área de funcionalidade**: `auth/`, `payments/`, `search/`
- **Por componente**: `api/`, `frontend/`, `workers/`
- **Por contexto delimitado**: `ordering/`, `fulfillment/`, `inventory/`

### Formato da Spec

Uma spec contém requisitos, e cada requisito tem cenários:

```markdown
# Especificação de Autenticação

## Propósito
Autenticação e gerenciamento de sessões para a aplicação.

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

#### Cenário: Tempo ocioso
- DADO uma sessão autenticada
- QUANDO 30 minutos se passam sem atividade
- ENTÃO a sessão é invalidada
- E o usuário deve re-autenticar
```

**Elementos-chave:**

| Elemento | Propósito |
|----------|-----------|
| `## Propósito` | Descrição de alto nível do domínio desta spec |
| `### Requisito:` | Um comportamento específico que o sistema deve ter |
| `#### Cenário:` | Um exemplo concreto do requisito em ação |
| DEVE/DEVERIA/PODE | Palavras-chave RFC 2119 indicando a força do requisito |

### Por Que Estruturar as Specs Dessa Forma

**Requisitos são o "o quê"** — eles declaram o que o sistema deve fazer sem especificar a implementação.

**Cenários são o "quando"** — eles fornecem exemplos concretos que podem ser verificados. Bons cenários:
- São testáveis (você poderia escrever um teste automatizado para eles)
- Cobrem tanto o caminho feliz quanto os casos extremos
- Usam Dado/Quando/Então ou um formato estruturado similar

**Palavras-chave RFC 2119** (DEVE, DEVERIA, PODE) comunicam a intenção:
- **DEVE** — requisito absoluto
- **DEVERIA** — recomendado, mas existem exceções
- **PODE** — opcional

### O Que uma Spec É (e Não É)

Uma spec é um **contrato de comportamento**, não um plano de implementação.

Bom conteúdo de spec:
- Comportamento observável que usuários ou sistemas downstream dependem
- Entradas, saídas e condições de erro
- Restrições externas (segurança, privacidade, confiabilidade, compatibilidade)
- Cenários que podem ser testados ou validados explicitamente

O que evitar nas specs:
- Nomes internos de classes/funções
- Escolhas de biblioteca ou framework
- Detalhes de implementação passo a passo
- Planos de execução detalhados (esses pertencem a `design.md` ou `tasks.md`)

Teste rápido:
- Se a implementação pode mudar sem alterar o comportamento visível externamente, provavelmente não pertence à spec.

### Mantenha-o Leve: Rigor Progressivo

O OpenSpec visa evitar burocracia. Use o nível mais leve que ainda torne a mudança verificável.

**Spec lite (padrão):**
- Requisitos curtos e focados no comportamento
- Escopo claro e não-objetivos
- Algumas verificações de aceitação concretas

**Spec completa (para maior risco):**
- Mudanças entre equipes ou repositórios
- Alterações de API/contrato, migrações, preocupações de segurança/privacidade
- Mudanças onde a ambiguidade provavelmente causaria retrabalho caro

A maioria das mudanças deve permanecer no modo Lite.

### Colaboração Humano + Agente

Em muitas equipes, humanos exploram e agentes rascunham artefatos. O loop pretendido é:

1. O humano fornece a intenção, contexto e restrições.
2. O agente converte isso em requisitos e cenários focados no comportamento.
3. O agente mantém os detalhes da implementação em `design.md` e `tasks.md`, não em `spec.md`.
4. A validação confirma a estrutura e clareza antes da implementação.

Isso mantém as specs legíveis para humanos e consistentes para agentes.

## Alterações

Uma alteração é uma modificação proposta para o seu sistema, empacotada como uma pasta com tudo o que é necessário para entendê-la e implementá-la.

### Estrutura de uma Alteração

```
openspec/changes/add-dark-mode/
├── proposal.md           # Por quê e o quê
├── design.md             # Como (abordagem técnica)
├── tasks.md              # Checklist de implementação
├── .openspec.yaml        # Metadados da alteração (opcional)
└── specs/                # Especificações delta
    └── ui/
        └── spec.md       # O que está mudando em ui/spec.md
```

Cada alteração é autocontida. Ela contém:
- **Artefatos** — documentos que capturam a intenção, o design e as tarefas
- **Especificações delta** — especificações para o que está sendo adicionado, modificado ou removido
- **Metadados** — configuração opcional para esta alteração específica

### Por Que Alterações São Pastas

Empacotar uma alteração como uma pasta tem vários benefícios:

1. **Tudo junto.** Proposta, design, tarefas e especificações ficam em um só lugar. Sem precisar procurar em locais diferentes.

2. **Trabalho paralelo.** Múltiplas alterações podem existir simultaneamente sem conflito. Trabalhe em `add-dark-mode` enquanto `fix-auth-bug` também está em andamento.

3. **Histórico limpo.** Ao serem arquivadas, as alterações movem-se para `changes/archive/` com o contexto completo preservado. Você pode olhar para trás e entender não apenas o que mudou, mas por quê.

4. **Amigável para revisão.** Uma pasta de alteração é fácil de revisar — abra-a, leia a proposta, verifique o design, veja as deltas das especificações.

## Artefatos

Artefatos são os documentos dentro de uma alteração que guiam o trabalho.

### O Fluxo dos Artefatos

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   por quê        o quê          como          etapas
 + escopo       mudanças       abordagem      a tomar
```

Os artefatos se constroem uns sobre os outros. Cada artefato fornece contexto para o próximo.

### Tipos de Artefato

#### Proposta (`proposal.md`)

A proposta captura a **intenção**, o **escopo** e a **abordagem** em alto nível.

```markdown
# Proposta: Adicionar Modo Escuro
```

## Intenção

Os utilizadores solicitaram uma opção de modo escuro para reduzir a fadiga visual durante a utilização noturna e alinhar com as preferências do sistema.

## Âmbito

Em âmbito:
- Alternância de tema nas definições
- Deteção de preferências do sistema
- Persistência de preferência no localStorage

Fora do âmbito:
- Temas de cores personalizados (trabalho futuro)
- Substituições de tema por página

## Abordagem

Utilizar propriedades personalizadas CSS para temas com um contexto React para gestão de estado. Detetar preferências do sistema na primeira carga, permitir substituição manual.
```

**Quando atualizar a proposta:**
- Alterações no âmbito (redução ou expansão)
- A intenção é esclarecida (melhor compreensão do problema)
- A abordagem muda fundamentalmente

#### Especificações (especificações delta em `specs/`)

As especificações delta descrevem **o que está a mudar** relativamente às especificações atuais. Consulte [Especificações Delta](#especificações-delta) abaixo.

#### Design (`design.md`)

O design captura a **abordagem técnica** e as **decisões de arquitetura**.

````markdown
# Design: Adicionar Modo Escuro

## Abordagem Técnica
Estado do tema gerido via React Context para evitar prop drilling.
Propriedades personalizadas CSS permitem a troca em tempo real sem alternância de classes.

## Decisões de Arquitetura

### Decisão: Context sobre Redux
Utilizar React Context para o estado do tema porque:
- Estado binário simples (claro/escuro)
- Sem transições de estado complexas
- Evita adicionar dependência do Redux

### Decisão: Propriedades Personalizadas CSS
Utilizar variáveis CSS em vez de CSS-in-JS porque:
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

## Alterações de Ficheiros
- `src/contexts/ThemeContext.tsx` (novo)
- `src/components/ThemeToggle.tsx` (novo)
- `src/styles/globals.css` (modificado)
````

**Quando atualizar o design:**
- A implementação revela que a abordagem não funciona
- Uma solução melhor é descoberta
- Dependências ou restrições mudam

#### Tarefas (`tasks.md`)

As tarefas são a **lista de verificação de implementação** — passos concretos com caixas de seleção.

```markdown
# Tarefas

## 1. Infraestrutura de Tema
- [ ] 1.1 Criar ThemeContext com estado claro/escuro
- [ ] 1.2 Adicionar propriedades personalizadas CSS para cores
- [ ] 1.3 Implementar persistência no localStorage
- [ ] 1.4 Adicionar deteção de preferências do sistema

## 2. Componentes de Interface
- [ ] 2.1 Criar componente ThemeToggle
- [ ] 2.2 Adicionar alternância à página de definições
- [ ] 2.3 Atualizar o Header para incluir alternância rápida

## 3. Estilização
- [ ] 3.1 Definir paleta de cores do tema escuro
- [ ] 3.2 Atualizar componentes para usar variáveis CSS
- [ ] 3.3 Testar rácios de contraste para acessibilidade
```

**Boas práticas para tarefas:**
- Agrupar tarefas relacionadas sob títulos
- Utilizar numeração hierárquica (1.1, 1.2, etc.)
- Manter tarefas pequenas o suficiente para completar numa sessão
- Marcar tarefas como concluídas à medida que avança

## Especificações Delta

As especificações delta são o conceito chave que faz o OpenSpec funcionar para desenvolvimento brownfield. Descrevem **o que está a mudar** em vez de repetir toda a especificação.

### O Formato

```markdown
# Delta para Auth

## Requisitos ADICIONADOS

### Requisito: Autenticação de Dois Fatores
O sistema DEVE suportar autenticação de dois fatores baseada em TOTP.

#### Cenário: Registo de 2FA
- DADO um utilizador sem 2FA ativado
- QUANDO o utilizador ativa 2FA nas definições
- ENTÃO um código QR é apresentado para configuração da aplicação autenticadora
- E o utilizador deve verificar com um código antes da ativação

#### Cenário: Login com 2FA
- DADO um utilizador com 2FA ativado
- QUANDO o utilizador submete credenciais válidas
- ENTÃO um desafio OTP é apresentado
- E o login só é concluído após OTP válido

## Requisitos MODIFICADOS

### Requisito: Expiração de Sessão
O sistema DEVE expirar sessões após 15 minutos de inatividade.
(Anteriormente: 30 minutos)

#### Cenário: Tempo limite de inatividade
- DADO uma sessão autenticada
- QUANDO passam 15 minutos sem atividade
- ENTÃO a sessão é invalidada

## Requisitos REMOVIDOS

### Requisito: Lembrar-me
(Descontinuado em favor de 2FA. Os utilizadores devem reautenticar-se em cada sessão.)
```

### Secções Delta

| Secção | Significado | O que acontece ao arquivar |
|--------|-------------|---------------------------|
| `## Requisitos ADICIONADOS` | Novo comportamento | Anexado à especificação principal |
| `## Requisitos MODIFICADOS` | Comportamento alterado | Substitui o requisito existente |
| `## Requisitos REMOVIDOS` | Comportamento descontinuado | Eliminado da especificação principal |

### Porquê Deltas em Vez de Especificações Completas

**Clareza.** Um delta mostra exatamente o que está a mudar. Ao ler uma especificação completa, teria de comparar mentalmente com a versão atual.

**Evita conflitos.** Duas alterações podem tocar no mesmo ficheiro de especificação sem conflitar, desde que modifiquem requisitos diferentes.

**Eficiência na revisão.** Os revisores veem a alteração, não o contexto inalterado. Foco no que importa.

**Adequação a brownfield.** A maioria do trabalho modifica comportamentos existentes. As deltas tornam as modificações cidadãos de primeira classe, não um pensamento posterior.

## Esquemas

Os esquemas definem os tipos de artefactos e as suas dependências para um fluxo de trabalho.

### Como os Esquemas Funcionam

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Sem dependências, pode criar primeiro

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Necessita da proposta antes de criar

  - id: design
    generates: design.md
    requires: [proposal]      # Pode criar em paralelo com as especificações

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Necessita de ambas as especificações e do design primeiro
```

**Os artefactos formam um grafo de dependências:**

```
                    proposal
                   (nó raiz)
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

**As dependências são facilitadores, não portões.** Mostram o que é possível criar, não o que deve criar a seguir. Pode ignorar o design se não precisar dele. Pode criar especificações antes ou depois do design — ambas dependem apenas da proposta.

### Esquemas Incorporados

**spec-driven** (predefinição)

O fluxo de trabalho padrão para desenvolvimento orientado por especificações:

```
proposal → specs → design → tasks → implement
```

Ideal para: A maioria do trabalho de funcionalidades onde pretende concordar nas especificações antes da implementação.

### Esquemas Personalizados

Crie esquemas personalizados para o fluxo de trabalho da sua equipa:

```bash
# Criar do zero
openspec schema init research-first

# Ou bifurcar um existente
openspec schema fork spec-driven research-first
```

**Exemplo de esquema personalizado:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Fazer investigação primeiro

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposta informada pela investigação

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Ignorar especificações/design, ir direto às tarefas
```

Consulte [Personalização](customization.md) para detalhes completos sobre como criar e utilizar esquemas personalizados.

## Arquivo

O arquivamento conclui uma alteração, fundindo as suas especificações delta nas especificações principais e preservando a alteração para histórico.

### O que Acontece ao Arquivar

```
Antes do arquivamento:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ fundir
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

1. **Fundir deltas.** Cada secção de especificação delta (ADICIONADOS/MODIFICADOS/REMOVIDOS) é aplicada à especificação principal correspondente.

2. **Mover para arquivo.** A pasta da alteração é movida para `changes/archive/` com um prefixo de data para ordenação cronológica.

3. **Preservar contexto.** Todos os artefactos permanecem intactos no arquivo. Pode sempre retroceder para compreender porque foi feita uma alteração.

### Porquê o Arquivo é Importante

**Estado limpo.** As alterações ativas (`changes/`) mostram apenas trabalho em progresso. O trabalho concluído sai do caminho.

**Registo de auditoria.** O arquivo preserva o contexto completo de cada alteração — não apenas o que mudou, mas a proposta a explicar porquê, o design a explicar como, e as tarefas a mostrar o trabalho realizado.

**Evolução das especificações.** As especificações crescem organicamente à medida que as alterações são arquivadas. Cada arquivo funde as suas deltas, construindo uma especificação abrangente ao longo do tempo.

## Como Tudo Se Encaixa

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FLUXO OPENSPEC                                  │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. INICIAR    │  /opsx:propose (core) ou /opsx:new (expandido)          │
│   │   ALTERAÇÃO    │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CRIAR      │  /opsx:ff ou /opsx:continue (fluxo de trabalho          │
│   │   ARTEFACTOS   │  expandido)                                             │
│   │                │  Cria proposta → especificações → design → tarefas      │
│   │                │  (com base nas dependências do esquema)                 │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENTAR│  /opsx:apply                                            │
│   │   TAREFAS      │  Trabalhar nas tarefas, marcando-as como concluídas     │
│   │                │◄──── Atualizar artefactos à medida que aprende          │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFICAR  │  /opsx:verify (opcional)                                │
│   │   TRABALHO     │  Verificar se a implementação corresponde às           │
│   │                │  especificações                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARQUIVAR   │────►│  Especificações delta fundem-se nas           │    │
│   │   ALTERAÇÃO    │     │  especificações principais                    │    │
│   └────────────────┘     │  Pasta da alteração move-se para archive/    │    │
│                          │  Especificações são agora a fonte de verdade  │    │
│                          │  atualizada                                   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**O ciclo virtuoso:**

1. As especificações descrevem o comportamento atual
2. As alterações propõem modificações (como deltas)
3. A implementação torna as alterações reais
4. O arquivo funde as deltas nas especificações
5. As especificações agora descrevem o novo comportamento
6. A próxima alteração constrói sobre as especificações atualizadas

## Glossário

| Termo | Definição |
|------|------------|
| **Artefato** | Um documento dentro de uma mudança (proposta, design, tarefas ou especificações delta) |
| **Arquivar** | O processo de concluir uma mudança e mesclar seus deltas nas especificações principais |
| **Mudança** | Uma modificação proposta ao sistema, empacotada como uma pasta com artefatos |
| **Especificação delta** | Uma especificação que descreve mudanças (ADDED/MODIFIED/REMOVED) em relação às especificações atuais |
| **Domínio** | Um agrupamento lógico para especificações (ex.: `auth/`, `payments/`) |
| **Requisito** | Um comportamento específico que o sistema deve ter |
| **Cenário** | Um exemplo concreto de um requisito, tipicamente no formato Dado/Quando/Então |
| **Esquema** | Uma definição de tipos de artefatos e suas dependências |
| **Especificação** | Uma especificação que descreve o comportamento do sistema, contendo requisitos e cenários |
| **Fonte da verdade** | O diretório `openspec/specs/`, contendo o comportamento atual acordado |

## Próximos Passos

- [Primeiros Passos](getting-started.md) - Passos práticos iniciais
- [Fluxos de Trabalho](workflows.md) - Padrões comuns e quando usar cada um
- [Comandos](commands.md) - Referência completa de comandos
- [Personalização](customization.md) - Crie esquemas personalizados e configure seu projeto