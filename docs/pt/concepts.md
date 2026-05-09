# Conceitos

Este guia explica as ideias centrais por trás do OpenSpec e como elas se encaixam. Para uso prático, consulte [Introdução](getting-started.md) e [Fluxos de Trabalho](workflows.md).

## Filosofia

O OpenSpec é construído em torno de quatro princípios:

```
fluid not rigid         — no phase gates, work on what makes sense
iterative not waterfall — learn as you build, refine as you go
easy not complex        — lightweight setup, minimal ceremony
brownfield-first        — works with existing codebases, not just greenfield
```

### Por Que Esses Princípios São Importantes

**Fluido, não rígido.** Sistemas de especificação tradicionais o prendem em fases: primeiro você planeja, depois implementa, e então termina. O OpenSpec é mais flexível — você pode criar artefatos em qualquer ordem que faça sentido para o seu trabalho.

**Iterativo, não cascata.** Os requisitos mudam. O entendimento se aprofunda. O que parecia uma boa abordagem no início pode não se sustentar depois que você vê a base de código. O OpenSpec abraça essa realidade.

**Fácil, não complexo.** Alguns frameworks de especificação exigem configuração extensa, formatos rígidos ou processos pesados. O OpenSpec não fica no seu caminho. Inicialize em segundos, comece a trabalhar imediatamente, personalize apenas se precisar.

**Brownfield-first.** A maioria do trabalho de software não é construir do zero — é modificar sistemas existentes. A abordagem baseada em deltas do OpenSpec facilita a especificação de mudanças no comportamento existente, não apenas a descrição de novos sistemas.

## Visão Geral

O OpenSpec organiza seu trabalho em duas áreas principais:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Fonte da verdade   │◄─────│  Modificações propostas       │   │
│   │  Como seu sistema   │ merge│  Cada mudança = uma pasta     │   │
│   │  funciona atualmente│      │  Contém artefatos + deltas    │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** são a fonte da verdade — elas descrevem como seu sistema se comporta atualmente.

**Changes** são modificações propostas — elas ficam em pastas separadas até você estar pronto para mesclá-las.

Essa separação é fundamental. Você pode trabalhar em múltiplas mudanças em paralelo sem conflitos. Você pode revisar uma mudança antes que ela afete as specs principais. E quando você arquiva uma mudança, seus deltas são mesclados de forma limpa na fonte da verdade.

## Workspaces de Coordenação

O suporte a workspaces está em desenvolvimento ativo e ainda não está pronto para uso. Não construa automações externas, integrações ou fluxos de trabalho de longa duração sobre o comportamento do workspace; os comandos, arquivos de estado e saída JSON podem mudar a qualquer momento.

Os comandos abaixo fornecem o fluxo inicial de configuração para planejamento entre repositórios ou pastas vinculados.

Projetos OpenSpec locais do repositório são o padrão correto quando um único repositório é dono do fluxo de planejamento, implementação e arquivo. Alguns trabalhos abrangem vários repositórios ou pastas. Para esse caso, um workspace de coordenação OpenSpec é o lar duradouro de planejamento.

O modelo mental do workspace é:

```text
workspace = onde mudanças cross-repo relacionadas vivem
link      = um nome estável para um repositório ou pasta que o workspace pode planejar
change    = uma feature, correção, projeto ou outra peça de trabalho planejada
```

Um workspace tem um formato diferente de um projeto local do repositório:

```text
workspace-folder/
├── changes/                       # Planejamento no nível do workspace
└── .openspec-workspace/
    ├── workspace.yaml             # Identidade compartilhada do workspace e nomes de links
    └── local.yaml                 # Caminhos locais desta máquina
```

O estado local do repositório OpenSpec mantém o formato existente:

```text
repo-root/
└── openspec/
    ├── specs/
    └── changes/
```

Essa distinção importa. A pasta do workspace é uma superfície de coordenação para planejamento entre repositórios ou pastas vinculados. O diretório `openspec/` de cada repositório continua sendo o lar das specs de propriedade do repositório, mudanças locais do repositório e planejamento de implementação. Os usuários não precisam executar `openspec init` local do repositório dentro de uma pasta de workspace.

Nomes de links estáveis são como o planejamento do workspace se refere a repositórios e pastas. O estado compartilhado do workspace mantém nomes como `api`, `web` ou `checkout`; cada máquina mapeia esses nomes para seus próprios caminhos locais em `.openspec-workspace/local.yaml`.

```yaml
# .openspec-workspace/workspace.yaml
version: 1
name: platform
links:
  api: {}
  web: {}
```

```yaml
# .openspec-workspace/local.yaml
version: 1
paths:
  api: /repos/api
  web: /repos/web
```

Workspaces criados pelo OpenSpec excluem `.openspec-workspace/local.yaml` do estado de colaboração portátil por padrão. `.openspec-workspace/workspace.yaml` permanece portátil porque armazena o nome do workspace e nomes de links estáveis, não os caminhos absolutos de checkout de um usuário.

Os caminhos vinculados podem ser repositórios completos, pastas dentro de um monorepo grande ou outras pastas existentes. Eles não precisam do estado local do repositório `openspec/` antes de poderem participar do planejamento do workspace. Fluxos de trabalho de implementação, verificação ou arquivo posteriores podem exigir mais preparação do repositório, mas a visibilidade do planejamento começa com o link.

```text
multi-repo:
  api      -> /repos/api
  web      -> /repos/web

large monorepo:
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

Workspaces gerenciados ficam sob o diretório padrão de dados do OpenSpec:

```text
getGlobalDataDir()/workspaces
```

Isso significa `$XDG_DATA_HOME/openspec/workspaces` quando `XDG_DATA_HOME` está definido, `~/.local/share/openspec/workspaces` no fallback estilo Unix e `%LOCALAPPDATA%\openspec\workspaces` no fallback nativo do Windows. Shells nativos do Windows, PowerShell e WSL2 mantêm cada um as strings de caminho para o runtime executando o OpenSpec. Essa base não traduz entre `D:\repo`, `/mnt/d/repo` e caminhos UNC WSL.

O OpenSpec também mantém um registro local da máquina em:

```text
getGlobalDataDir()/workspaces/registry.yaml
```

O registro mapeia nomes de workspaces para localizações de workspaces para que comandos globais posteriores possam listar ou selecionar workspaces conhecidos de qualquer lugar. É apenas um índice. Cada pasta de workspace permanece autoritativa para seu próprio `.openspec-workspace/workspace.yaml` e `.openspec-workspace/local.yaml`, então registros desatualizados no registro podem ser relatados e reparados sem redefinir o workspace em si.

A visibilidade do workspace não é um compromisso de mudança. Configure um workspace quando o OpenSpec deve saber quais repositórios ou pastas são relevantes; crie uma mudança mais tarde quando você estiver pronto para planejar uma feature, correção, projeto ou outra peça de trabalho.

Comandos úteis:

```bash
# Configuração guiada
openspec workspace setup

# Configuração amigável para automação
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex

# Ver workspaces conhecidos do registro local
openspec workspace list
openspec workspace ls

# Adicionar ou reparar links para o workspace selecionado
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Verificar o que esta máquina pode resolver
openspec workspace doctor
openspec workspace doctor --workspace platform

# Abrir o conjunto de trabalho vinculado
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor
```

`workspace setup` sempre cria o workspace no local padrão do workspace, registra-o no registro local, mostra a localização do workspace e requer pelo menos um repositório ou pasta vinculado. A configuração interativa pergunta por um abridor preferido. A configuração não interativa armazena um apenas quando `--opener codex`, `--opener claude`, `--opener github-copilot` ou `--opener editor` é fornecido.

O OpenSpec também mantém arquivos de abertura de workspace raiz: um bloco de orientação gerenciado pelo OpenSpec em `AGENTS.md`, um arquivo `<workspace-name>.code-workspace` local da máquina para VS Code e GitHub Copilot-in-VS-Code, e uma entrada de ignorar específica para esse arquivo `.code-workspace` mantido. Os arquivos `*.code-workspace` criados pelo usuário permanecem rastreáveis porque a regra de ignorar visa apenas o arquivo mantido.

O workspace VS Code mantido inclui a raiz de coordenação como `.` mais repositórios ou pastas vinculados válidos como raízes adicionais. O VS Code exibe essas entradas como um workspace multi-raiz.

`workspace open` abre o conjunto de trabalho vinculado com o abridor preferido armazenado, a menos que `--agent <tool>` ou `--editor` seja passado para essa sessão. Passar ambas as substituições de abridor é um erro. A abertura do workspace raiz torna os repositórios e pastas vinculados visíveis para exploração e planejamento; a implementação começa após o usuário solicitar explicitamente o trabalho de implementação.

`workspace link` e `workspace relink` registram apenas pastas existentes; eles não criam, copiam, movem, inicializam ou editam o repositório ou pasta vinculado. Após um link ou religação bem-sucedido, o OpenSpec atualiza a orientação gerenciada, o arquivo de workspace do VS Code e a regra de ignorar.

Comandos de workspace que precisam de um workspace podem ser executados de qualquer lugar com `--workspace <name>`. Se você os executar dentro de uma pasta ou subdiretório do workspace, o OpenSpec usa esse workspace atual. Se vários workspaces conhecidos estiverem disponíveis e você não passar `--workspace <name>`, comandos humanos mostram um seletor; `--json` e `--no-interactive` falham com um erro de status estruturado em vez de solicitar.

Comandos diretos de workspace suportam saída JSON para scripts. Respostas JSON mantêm dados primários nos objetos `workspace`, `workspaces` ou `link` e relatam avisos ou erros em arrays `status`. Objetos saudáveis usam `status: []`.

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

- **Por área de feature**: `auth/`, `payments/`, `search/`
- **Por componente**: `api/`, `frontend/`, `workers/`
- **Por contexto delimitado**: `ordering/`, `fulfillment/`, `inventory/`

### Formato da Spec

Uma spec contém requisitos, e cada requisito tem cenários:

```markdown
# Especificação de Autenticação
```

## Propósito
Autenticação e gestão de sessões para a aplicação.

## Requisitos

### Requisito: Autenticação de Utilizador
O sistema DEVE emitir um token JWT após um login bem-sucedido.

#### Cenário: Credenciais válidas
- DADO um utilizador com credenciais válidas
- QUANDO o utilizador submete o formulário de login
- ENTÃO um token JWT é retornado
- E o utilizador é redirecionado para o painel de controlo

#### Cenário: Credenciais inválidas
- DADO credenciais inválidas
- QUANDO o utilizador submete o formulário de login
- ENTÃO uma mensagem de erro é exibida
- E nenhum token é emitido

### Requisito: Expiração da Sessão
O sistema DEVE expirar as sessões após 30 minutos de inatividade.

#### Cenário: Tempo limite de inatividade
- DADO uma sessão autenticada
- QUANDO passam 30 minutos sem atividade
- ENTÃO a sessão é invalidada
- E o utilizador deve reautenticar-se
```

**Elementos-chave:**

| Elemento | Propósito |
|---------|---------|
| `## Purpose` | Descrição de alto nível do domínio desta especificação |
| `### Requirement:` | Um comportamento específico que o sistema deve ter |
| `#### Scenario:` | Um exemplo concreto do requisito em ação |
| SHALL/MUST/SHOULD | Palavras-chave RFC 2119 indicando a força do requisito |

### Por Que Estruturar Especificações Desta Forma

**Os requisitos são o "o quê"** — eles declaram o que o sistema deve fazer sem especificar a implementação.

**Os cenários são o "quando"** — eles fornecem exemplos concretos que podem ser verificados. Bons cenários:
- São testáveis (poderia escrever um teste automatizado para eles)
- Cobrem tanto o caminho feliz como os casos extremos
- Usam o formato Dado/Quando/Então ou um formato estruturado semelhante

**Palavras-chave RFC 2119** (SHALL, MUST, SHOULD, MAY) comunicam a intenção:
- **MUST/SHALL** — requisito absoluto
- **SHOULD** — recomendado, mas existem exceções
- **MAY** — opcional

### O Que Uma Especificação É (e Não É)

Uma especificação é um **contrato de comportamento**, não um plano de implementação.

Bom conteúdo de especificação:
- Comportamento observável que os utilizadores ou sistemas downstream dependem
- Entradas, saídas e condições de erro
- Restrições externas (segurança, privacidade, fiabilidade, compatibilidade)
- Cenários que podem ser testados ou explicitamente validados

Evitar nas especificações:
- Nomes internos de classes/funções
- Escolhas de bibliotecas ou frameworks
- Detalhes de implementação passo a passo
- Planos de execução detalhados (esses pertencem a `design.md` ou `tasks.md`)

Teste rápido:
- Se a implementação pode mudar sem alterar o comportamento visível externamente, provavelmente não pertence à especificação.

### Mantenha-o Leve: Rigor Progressivo

O OpenSpec visa evitar a burocracia. Use o nível mais leve que ainda torne a alteração verificável.

**Especificação leve (padrão):**
- Requisitos curtos focados no comportamento
- Escopo e não-objetivos claros
- Algumas verificações de aceitação concretas

**Especificação completa (para maior risco):**
- Alterações entre equipas ou repositórios
- Alterações de API/contrato, migrações, preocupações de segurança/privacidade
- Alterações onde a ambiguidade provavelmente causaria retrabalho caro

A maioria das alterações deve permanecer no modo leve.

### Colaboração Humano + Agente

Em muitas equipas, os humanos exploram e os agentes redigem artefatos. O ciclo pretendido é:

1. O humano fornece a intenção, o contexto e as restrições.
2. O agente converte isso em requisitos e cenários focados no comportamento.
3. O agente mantém os detalhes de implementação em `design.md` e `tasks.md`, não em `spec.md`.
4. A validação confirma a estrutura e a clareza antes da implementação.

Isto mantém as especificações legíveis para humanos e consistentes para agentes.

## Alterações

Uma alteração é uma modificação proposta para o seu sistema, empacotada como uma pasta com tudo o que é necessário para compreendê-la e implementá-la.

### Estrutura da Alteração

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

Cada alteração é autocontida. Ela possui:
- **Artefatos** — documentos que capturam a intenção, o design e as tarefas
- **Especificações delta** — especificações do que está sendo adicionado, modificado ou removido
- **Metadados** — configuração opcional para esta alteração específica

### Por que Alterações São Pastas

Empacotar uma alteração como uma pasta tem vários benefícios:

1. **Tudo junto.** Proposta, design, tarefas e especificações ficam em um só lugar. Sem precisar procurar em diferentes locais.

2. **Trabalho paralelo.** Múltiplas alterações podem existir simultaneamente sem conflitar. Trabalhe em `add-dark-mode` enquanto `fix-auth-bug` também está em andamento.

3. **Histórico limpo.** Quando arquivadas, as alterações movem-se para `changes/archive/` com todo o seu contexto preservado. Você pode olhar para trás e entender não apenas o que mudou, mas por quê.

4. **Fácil revisão.** Uma pasta de alteração é fácil de revisar — abra-a, leia a proposta, verifique o design, veja os deltas das especificações.

## Artefatos

Artefatos são os documentos dentro de uma alteração que orientam o trabalho.

### O Fluxo dos Artefatos

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   por quê        o quê         como         etapas
 + escopo       mudanças      abordagem      a tomar
```

Os artefatos se constroem uns sobre os outros. Cada artefato fornece contexto para o próximo.

### Tipos de Artefatos

#### Proposta (`proposal.md`)

A proposta captura a **intenção**, o **escopo** e a **abordagem** em alto nível.

```markdown
# Proposta: Adicionar Modo Escuro

## Intenção
Os usuários solicitaram uma opção de modo escuro para reduzir o cansaço visual
durante o uso noturno e corresponder às preferências do sistema.

## Escopo
Dentro do escopo:
- Alternador de tema nas configurações
- Detecção de preferência do sistema
- Persistir preferência no localStorage

Fora do escopo:
- Temas de cores personalizados (trabalho futuro)
- Substituições de tema por página

## Abordagem
Usar propriedades CSS customizáveis para theming com um contexto React
para gerenciamento de estado. Detectar a preferência do sistema na primeira carga,
permitir substituição manual.
```

**Quando atualizar a proposta:**
- O escopo muda (redução ou expansão)
- A intenção se esclarece (melhor entendimento do problema)
- A abordagem muda fundamentalmente

#### Especificações (especificações delta em `specs/`)

As especificações delta descrevem **o que está mudando** em relação às especificações atuais. Veja [Especificações Delta](#especificações-delta) abaixo.

#### Design (`design.md`)

O design captura a **abordagem técnica** e as **decisões de arquitetura**.

````markdown
# Design: Adicionar Modo Escuro

## Abordagem Técnica
Estado do tema gerenciado via React Context para evitar prop drilling.
Propriedades CSS customizáveis permitem a troca em tempo real sem alternância de classes.

## Decisões de Arquitetura

### Decisão: Contexto em vez de Redux
Usar React Context para o estado do tema porque:
- Estado binário simples (claro/escuro)
- Sem transições de estado complexas
- Evita adicionar dependência do Redux

### Decisão: Propriedades CSS Customizáveis
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
CSS Variables (aplicadas a :root)
```

## Alterações de Arquivo
- `src/contexts/ThemeContext.tsx` (novo)
- `src/components/ThemeToggle.tsx` (novo)
- `src/styles/globals.css` (modificado)
````

**Quando atualizar o design:**
- A implementação revela que a abordagem não funcionará
- Uma solução melhor é descoberta
- Dependências ou restrições mudam

#### Tarefas (`tasks.md`)

As tarefas são o **checklist de implementação** — etapas concretas com caixas de seleção.

```markdown
# Tarefas

## 1. Infraestrutura do Tema
- [ ] 1.1 Criar ThemeContext com estado claro/escuro
- [ ] 1.2 Adicionar propriedades CSS customizáveis para cores
- [ ] 1.3 Implementar persistência no localStorage
- [ ] 1.4 Adicionar detecção de preferência do sistema

## 2. Componentes de UI
- [ ] 2.1 Criar componente ThemeToggle
- [ ] 2.2 Adicionar alternador à página de configurações
- [ ] 2.3 Atualizar Header para incluir alternador rápido

## 3. Estilização
- [ ] 3.1 Definir paleta de cores do tema escuro
- [ ] 3.2 Atualizar componentes para usar variáveis CSS
- [ ] 3.3 Testar razões de contraste para acessibilidade
```

**Melhores práticas para tarefas:**
- Agrupar tarefas relacionadas sob cabeçalhos
- Usar numeração hierárquica (1.1, 1.2, etc.)
- Manter tarefas pequenas o suficiente para serem concluídas em uma sessão
- Marcar tarefas como concluídas à medida que as finaliza

## Especificações Delta

As especificações delta são o conceito-chave que faz o OpenSpec funcionar para desenvolvimento brownfield. Elas descrevem **o que está mudando** em vez de reafirmar toda a especificação.

### O Formato

```markdown
# Delta para Autenticação

## Requisitos ADICIONADOS

### Requisito: Autenticação de Dois Fatores
O sistema DEVE suportar autenticação de dois fatores baseada em TOTP.

#### Cenário: Ativação do 2FA
- DADO um usuário sem 2FA ativado
- QUANDO o usuário ativa o 2FA nas configurações
- ENTÃO um código QR é exibido para configuração do aplicativo autenticador
- E o usuário deve verificar com um código antes da ativação

#### Cenário: Login com 2FA
- DADO um usuário com 2FA ativado
- QUANDO o usuário submete credenciais válidas
- ENTÃO um desafio OTP é apresentado
- E o login é concluído somente após OTP válido

## Requisitos MODIFICADOS

### Requisito: Expiração de Sessão
O sistema DEVE expirar sessões após 15 minutos de inatividade.
(Anteriormente: 30 minutos)

#### Cenário: Timeout por inatividade
- DADO uma sessão autenticada
- QUANDO 15 minutos se passam sem atividade
- ENTÃO a sessão é invalidada

## Requisitos REMOVIDOS

### Requisito: Lembrar de Mim
(Descontinuado em favor do 2FA. Os usuários devem reautenticar a cada sessão.)
```

### Seções Delta

| Seção | Significado | O que acontece no Arquivamento |
|---------|---------|------------------------|
| `## Requisitos ADICIONADOS` | Novo comportamento | Anexado à especificação principal |
| `## Requisitos MODIFICADOS` | Comportamento alterado | Substitui o requisito existente |
| `## Requisitos REMOVIDOS` | Comportamento descontinuado | Excluído da especificação principal |

### Por que Deltas em vez de Especificações Completas

**Clareza.** Um delta mostra exatamente o que está mudando. Ao ler uma especificação completa, você teria que compará-la mentalmente com a versão atual.

**Evita conflitos.** Duas alterações podem tocar no mesmo arquivo de especificação sem conflitar, desde que modifiquem requisitos diferentes.

**Eficiência na revisão.** Os revisores veem a mudança, não o contexto inalterado. Foco no que importa.

**Adequado para brownfield.** A maioria do trabalho modifica comportamentos existentes. As deltas tornam as modificações cidadãs de primeira classe, não uma reflexão tardia.

## Schemas

Schemas definem os tipos de artefatos e suas dependências para um workflow.

### Como os Schemas Funcionam

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Sem dependências, pode ser criado primeiro

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Necessita da proposta antes de criar

  - id: design
    generates: design.md
    requires: [proposal]      # Pode ser criado em paralelo com os specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Necessita tanto dos specs quanto do design primeiro
```

**Os artefatos formam um grafo de dependências:**

```
                    proposal
                   (nó raiz)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (requer:                    (requer:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (requer:
                specs, design)
```

**As dependências são facilitadores, não bloqueios.** Elas mostram o que é possível criar, não o que você deve criar em seguida. Você pode pular o design se não precisar dele. Você pode criar os specs antes ou depois do design — ambos dependem apenas da proposta.

### Schemas Integrados

**spec-driven** (padrão)

O workflow padrão para desenvolvimento orientado a specs:

```
proposal → specs → design → tasks → implement
```

Ideal para: A maioria do trabalho de funcionalidades onde você deseja concordar nos specs antes da implementação.

### Schemas Personalizados

Crie schemas personalizados para o workflow da sua equipe:

```bash
# Criar do zero
openspec schema init research-first

# Ou bifurcar um existente
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
    requires: [proposal]   # Pular specs/design, ir direto para as tarefas
```

Consulte [Customização](customization.md) para detalhes completos sobre como criar e usar schemas personalizados.

## Arquivamento

O arquivamento conclui uma alteração mesclando seus specs delta nos specs principais e preservando a alteração para o histórico.

### O Que Acontece Quando Você Arquiva

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
│       └── spec.md        # Agora inclui os requisitos de 2FA
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Preservado para o histórico
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### O Processo de Arquivamento

1. **Mesclar deltas.** Cada seção de spec delta (ADDED/MODIFIED/REMOVED) é aplicada ao spec principal correspondente.

2. **Mover para o arquivo.** A pasta da alteração é movida para `changes/archive/` com um prefixo de data para ordenação cronológica.

3. **Preservar contexto.** Todos os artefatos permanecem intactos no arquivo. Você sempre pode voltar para entender por que uma alteração foi feita.

### Por Que o Arquivamento é Importante

**Estado limpo.** Alterações ativas (`changes/`) mostram apenas trabalho em andamento. Trabalho concluído sai do caminho.

**Trilha de auditoria.** O arquivo preserva o contexto completo de cada alteração — não apenas o que mudou, mas a proposta explicando o porquê, o design explicando como e as tarefas mostrando o trabalho realizado.

**Evolução dos specs.** Os specs crescem organicamente à medida que as alterações são arquivadas. Cada arquivo mescla seus deltas, construindo uma especificação abrangente ao longo do tempo.

### Como Tudo se Encaixa

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
│   │  2. CRIAR      │  /opsx:ff ou /opsx:continue (workflow expandido)        │
│   │   ARTEFATOS    │  Cria proposta → specs → design → tarefas               │
│   │                │  (baseado nas dependências do schema)                   │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENTAR│  /opsx:apply                                            │
│   │   TAREFAS      │  Trabalhar nas tarefas, marcando-as como concluídas     │
│   │                │◄──── Atualizar artefatos conforme você aprende          │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFICAR  │  /opsx:verify (opcional)                                │
│   │   TRABALHO     │  Verificar se a implementação corresponde aos specs     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARQUIVAR   │────►│  Specs delta mesclados nos specs principais  │    │
│   │   ALTERAÇÃO    │     │  Pasta da alteração movida para archive/     │    │
│   └────────────────┘     │  Specs agora são a fonte de verdade atual    │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**O ciclo virtuoso:**

1. Os specs descrevem o comportamento atual
2. As alterações propõem modificações (como deltas)
3. A implementação torna as alterações reais
4. O arquivamento mescla os deltas nos specs
5. Os specs agora descrevem o novo comportamento
6. A próxima alteração se baseia nos specs atualizados

## Glossário

| Termo | Definição |
|-------|-----------|
| **Artefato** | Um documento dentro de uma alteração (proposta, design, tarefas ou specs delta) |
| **Arquivamento** | O processo de concluir uma alteração e mesclar seus deltas nos specs principais |
| **Alteração** | Uma modificação proposta para o sistema, empacotada como uma pasta com artefatos |
| **Spec delta** | Um spec que descreve alterações (ADDED/MODIFIED/REMOVED) em relação aos specs atuais |
| **Domínio** | Um agrupamento lógico para specs (ex.: `auth/`, `payments/`) |
| **Requisito** | Um comportamento específico que o sistema deve ter |
| **Cenário** | Um exemplo concreto de um requisito, tipicamente no formato Given/When/Then |
| **Schema** | Uma definição dos tipos de artefatos e suas dependências |
| **Spec** | Uma especificação descrevendo o comportamento do sistema, contendo requisitos e cenários |
| **Fonte de verdade** | O diretório `openspec/specs/`, contendo o comportamento atual acordado |

## Próximos Passos

- [Primeiros Passos](getting-started.md) - Passos práticos iniciais
- [Workflows](workflows.md) - Padrões comuns e quando usar cada um
- [Comandos](commands.md) - Referência completa de comandos
- [Customização](customization.md) - Criar schemas personalizados e configurar seu projeto