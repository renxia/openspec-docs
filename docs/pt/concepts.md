# Conceitos

Este guia explica as ideias centrais de OpenSpec e como elas se encaixam. Para uso prático, consulte [Getting Started](getting-started.md) e [Workflows](workflows.md).

## Filosofia

OpenSpec é construído em torno de quatro princípios:

```
fluido e não rígido         — sem portões de fase (phase gates), trabalhe no que faz sentido
iterativo e não cascata — aprenda enquanto constrói, refine conforme avança
fácil e não complexo        — configuração leve, cerimônia mínima
primeiro em brownfield        — funciona com bases de código existentes, não apenas em projetos novos (greenfield)
```

### Por Que Esses Princípios São Importantes

**Fluido e não rígido.** Sistemas de especificação tradicionais prendem você a fases: primeiro planeja, depois implementa, e aí termina. OpenSpec é mais flexível — você pode criar artefatos em qualquer ordem que faça sentido para o seu trabalho.

**Iterativo e não cascata.** Requisitos mudam. A compreensão se aprofunda. O que parecia uma boa abordagem no início pode não ser sustentável depois de ver a base de código (codebase). OpenSpec abraça essa realidade.

**Fácil e não complexo.** Alguns frameworks de especificação exigem configuração extensa, formatos rígidos ou processos pesados (heavyweight). OpenSpec não atrapalha. Inicialize em segundos, comece a trabalhar imediatamente, personalize apenas se for necessário.

**Primeiro em brownfield.** A maior parte do trabalho de software não é construir do zero — é modificar sistemas existentes. A abordagem baseada em delta (delta-based) do OpenSpec facilita a especificação de mudanças no comportamento existente, e não apenas a descrição de novos sistemas.

## A Visão Geral

OpenSpec organiza o seu trabalho em duas áreas principais:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source of truth    │◄─────│  Proposed modifications       │   │
│   │  How your system    │ merge│  Each change = one folder     │   │
│   │  currently works    │      │  Contains artifacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** são a fonte da verdade — elas descrevem como o seu sistema se comporta atualmente.

**Changes** são modificações propostas — elas residem em pastas separadas até que você esteja pronto para mesclá-las (merge).

Essa separação é fundamental. Você pode trabalhar em múltiplas mudanças em paralelo sem conflitos. Você pode revisar uma mudança antes que ela afete as specs principais. E quando você arquiva uma mudança, seus deltas são mesclados de forma limpa na fonte da verdade.

## Specs

Specs descrevem o comportamento do seu sistema usando requisitos e cenários estruturados.

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

Organize as specs por domínio — agrupamentos lógicos que façam sentido para o seu sistema. Padrões comuns:

- **Por área de funcionalidade**: `auth/`, `payments/`, `search/`
- **Por componente**: `api/`, `frontend/`, `workers/`
- **Por contexto delimitado (bounded context)**: `ordering/`, `fulfillment/`, `inventory/`

### Formato da Spec

Uma spec contém requisitos, e cada requisito tem cenários:

```markdown
# Auth Specification

## Purpose
Autenticação e gerenciamento de sessão para a aplicação.

## Requirements

### Requirement: User Authentication
O sistema SHALL emitir um token JWT após o login bem-sucedido.

#### Scenario: Valid credentials
- GIVEN um usuário com credenciais válidas
- WHEN o usuário envia o formulário de login
- THEN um token JWT é retornado
- AND o usuário é redirecionado para o dashboard

#### Scenario: Invalid credentials
- GIVEN credenciais inválidas
- WHEN o usuário envia o formulário de login
- THEN uma mensagem de erro é exibida
- AND nenhum token é emitido

### Requirement: Session Expiration
O sistema MUST expirar sessões após 30 minutos de inatividade.

#### Scenario: Idle timeout
- GIVEN uma sessão autenticada
- WHEN passam 30 minutos sem atividade
- THEN a sessão é invalidada
- AND o usuário deve se reautenticar
```

**Elementos chave:**

| Element | Purpose |
|---------|---------|
| `## Purpose` | Descrição de alto nível do domínio desta spec |
| `### Requirement:` | Um comportamento específico que o sistema deve ter |
| `#### Scenario:` | Um exemplo concreto do requisito em ação |
| SHALL/MUST/SHOULD | Palavras-chave RFC 2119 indicando a força do requisito |

### Por Que Estruturar as Specs Desta Forma

**Requisitos são o "o quê"** — eles declaram o que o sistema deve fazer sem especificar a implementação.

**Cenários são o "quando"** — eles fornecem exemplos concretos que podem ser verificados. Bons cenários:
- São testáveis (você poderia escrever um teste automatizado para eles)
- Cobrem tanto o caminho feliz quanto os casos extremos (edge cases)
- Usam Given/When/Then ou um formato estruturado similar

**Palavras-chave RFC 2119** (SHALL, MUST, SHOULD, MAY) comunicam a intenção:
- **MUST/SHALL** — requisito absoluto
- **SHOULD** — recomendado, mas exceções existem
- **MAY** — opcional

### O Que é uma Spec (e O Que Não É)

Uma spec é um **contrato de comportamento**, não um plano de implementação.

Conteúdo bom para a spec:
- Comportamento observável que usuários ou sistemas downstream dependem
- Entradas, saídas e condições de erro
- Restrições externas (segurança, privacidade, confiabilidade, compatibilidade)
- Cenários que podem ser testados ou explicitamente validados

Evitar nas specs:
- Nomes internos de classes/funções
- Escolhas de bibliotecas ou frameworks
- Detalhes da implementação passo a passo
- Planos de execução detalhados (estes pertencem ao `design.md` ou `tasks.md`)

Teste rápido:
- Se a implementação pode mudar sem alterar o comportamento visível externamente, ela provavelmente não pertence à spec.

### Mantenha Leve: Rigor Progressivo

OpenSpec visa evitar burocracia. Use o nível mais leve que ainda torne a mudança verificável.

**Lite spec (padrão):**
- Requisitos curtos e focados no comportamento
- Escopo claro e não-metas (non-goals)
- Alguns checagens de aceitação concretas

**Full spec (para risco maior):**
- Mudanças entre equipes ou repositórios
- Mudanças de API/contrato, migrações, preocupações de segurança/privacidade
- Mudanças onde a ambiguidade é provável causar retrabalho caro

A maioria das mudanças deve permanecer no modo Lite.

### Colaboração Humana + Agente

Em muitas equipes, humanos exploram e agentes redigem os artefatos. O loop pretendido é:

1. O humano fornece intenção, contexto e restrições.
2. O agente converte isso em requisitos e cenários focados no comportamento.
3. O agente mantém o detalhe da implementação em `design.md` e `tasks.md`, não em `spec.md`.
4. A validação confirma a estrutura e clareza antes da implementação.

Isso mantém as specs legíveis para humanos e consistentes para agentes.

## Mudanças

Uma mudança é uma modificação proposta para o seu sistema, empacotada como uma pasta com tudo o que é necessário para entender e implementá-la.

### Estrutura da Mudança

```
openspec/changes/add-dark-mode/
├── proposal.md           # Por quê e o quê
├── design.md             # Como (abordagem técnica)
├── tasks.md              # Checklist de implementação
├── .openspec.yaml        # Metadados da mudança (opcional)
└── specs/                # Specs delta
    └── ui/
        └── spec.md       # O que está mudando em ui/spec.md
```

Cada mudança é autocontida. Ela possui:
- **Artifacts** — documentos que capturam a intenção, o design e as tarefas
- **Delta specs** — especificações sobre o que está sendo adicionado, modificado ou removido
- **Metadata** — configuração opcional para esta mudança específica

### Por Que As Mudanças São Pastas

Empacotar uma mudança como uma pasta traz vários benefícios:

1. **Tudo junto.** A proposta, o design, as tarefas e as specs residem em um só lugar. Sem ter que procurar em diferentes locais.

2. **Trabalho paralelo.** Múltiplas mudanças podem existir simultaneamente sem conflitar. Trabalhe em `add-dark-mode` enquanto `fix-auth-bug` também está em andamento.

3. **Histórico limpo.** Quando arquivadas, as mudanças movem para `changes/archive/` com seu contexto completo preservado. Você pode olhar para trás e entender não apenas o que mudou, mas por quê.

4. **Amigável à revisão.** Uma pasta de mudança é fácil de revisar — abra-a, leia a proposta, verifique o design, veja os deltas da spec.

## Artefatos

Artefatos são os documentos dentro de uma mudança que guiam o trabalho.

### O Fluxo dos Artefatos

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   por quê        o quê           como         passos a seguir
 + escopo      mudanças       abordagem     para fazer
```

Os artefatos se constroem uns sobre os outros. Cada artefato fornece contexto para o próximo.

### Tipos de Artefatos

#### Proposal (`proposal.md`)

A proposta captura **intenção**, **escopo** e **abordagem** em um nível alto.

```markdown
# Proposal: Add Dark Mode

## Intent
Os usuários solicitaram uma opção de modo escuro para reduzir a fadiga ocular
durante o uso noturno e para corresponder às preferências do sistema.

## Scope
Em escopo:
- Alternância de tema nas configurações
- Detecção da preferência do sistema
- Persistir a preferência no localStorage

Fora do escopo:
- Temas de cores personalizados (trabalho futuro)
- Sobrescritas de tema por página

## Approach
Usar propriedades CSS customizadas para tematização com um contexto React
para gerenciamento de estado. Detectar a preferência do sistema na primeira carga,
permitir substituição manual.
```

**Quando atualizar a proposta:**
- Mudanças no escopo (estreitamento ou expansão)
- A intenção é esclarecida (melhor compreensão do problema)
- A abordagem muda fundamentalmente

#### Specs (delta specs em `specs/`)

Delta specs descrevem **o que está mudando** em relação às specs atuais. Veja [Delta Specs](#delta-specs) abaixo.

#### Design (`design.md`)

O design captura a **abordagem técnica** e as **decisões de arquitetura**.

````markdown
# Design: Add Dark Mode

## Technical Approach
Estado do tema gerenciado via React Context para evitar prop drilling.
Propriedades CSS customizadas permitem a troca em tempo de execução sem alternância de classes.

## Architecture Decisions

### Decision: Context over Redux
Usar React Context para o estado do tema porque:
- Estado binário simples (claro/escuro)
- Sem transições de estado complexas
- Evita adicionar dependência do Redux

### Decision: CSS Custom Properties
Usar variáveis CSS em vez de CSS-in-JS porque:
- Funciona com o stylesheet existente
- Nenhum overhead em tempo de execução
- Solução nativa do navegador

## Data Flow
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (aplicadas a :root)
```

## File Changes
- `src/contexts/ThemeContext.tsx` (novo)
- `src/components/ThemeToggle.tsx` (novo)
- `src/styles/globals.css` (modificado)
````

**Quando atualizar o design:**
- A implementação revela que a abordagem não funcionará
- Uma solução melhor é descoberta
- Dependências ou restrições mudam

#### Tasks (`tasks.md`)

Tasks são o **checklist de implementação** — passos concretos com caixas de seleção.

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Criar ThemeContext com estado claro/escuro
- [ ] 1.2 Adicionar propriedades CSS customizadas para cores
- [ ] 1.3 Implementar persistência no localStorage
- [ ] 1.4 Adicionar detecção de preferência do sistema

## 2. UI Components
- [ ] 2.1 Criar componente ThemeToggle
- [ ] 2.2 Adicionar toggle na página de configurações
- [ ] 2.3 Atualizar o Header para incluir quick toggle

## 3. Styling
- [ ] 3.1 Definir paleta de cores do tema escuro
- [ ] 3.2 Atualizar componentes para usar variáveis CSS
- [ ] 3.3 Testar razões de contraste para acessibilidade
```

**Melhores práticas de tarefas:**
- Agrupar tarefas relacionadas sob cabeçalhos
- Usar numeração hierárquica (1.1, 1.2, etc.)
- Manter as tarefas pequenas o suficiente para serem concluídas em uma sessão
- Marcar as tarefas como concluídas à medida que são finalizadas

## Delta Specs

Delta specs é o conceito chave que faz o OpenSpec funcionar para desenvolvimento brownfield. Elas descrevem **o que está mudando** em vez de recontar a spec inteira.

### O Formato

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
O sistema MUST suportar autenticação de dois fatores baseada em TOTP.

#### Scenario: 2FA enrollment
- GIVEN um usuário sem 2FA ativado
- WHEN o usuário ativa o 2FA nas configurações
- THEN um QR code é exibido para configuração do aplicativo autenticador
- AND o usuário deve verificar com um código antes da ativação

#### Scenario: 2FA login
- GIVEN um usuário com 2FA ativado
- WHEN o usuário envia credenciais válidas
- THEN um desafio OTP é apresentado
- AND o login só é concluído após OTP válido

## MODIFIED Requirements

### Requirement: Session Expiration
O sistema MUST expirar sessões após 15 minutos de inatividade.
(Anteriormente: 30 minutos)

#### Scenario: Idle timeout
- GIVEN uma sessão autenticada
- WHEN passam 15 minutos sem atividade
- THEN a sessão é invalidada

## REMOVED Requirements

### Requirement: Remember Me
(Obsoleto em favor de 2FA. Os usuários devem se reautenticar a cada sessão.)
```

### Seções Delta

| Section | Meaning | What Happens on Archive |
|---------|---------|------------------------|
| `## ADDED Requirements` | Novo comportamento | Anexado à spec principal |
| `## MODIFIED Requirements` | Comportamento alterado | Substitui o requisito existente |
| `## REMOVED Requirements` | Comportamento obsoleto | Deletado da spec principal |

### Por Que Deltas em Vez de Specs Completas

**Clareza.** Um delta mostra exatamente o que está mudando. Lendo uma spec completa, você teria que fazer um diff mental contra a versão atual.

**Prevenção de conflitos.** Duas mudanças podem tocar no mesmo arquivo de spec sem conflitar, desde que modifiquem requisitos diferentes.

**Eficiência na revisão.** Os revisores veem a mudança, não o contexto inalterado. Concentram-se no que é importante.

**Aptidão para Brownfield.** A maior parte do trabalho modifica comportamentos existentes. Deltas tornam as modificações uma classe de primeira ordem, e não um pensamento posterior.

## Esquemas

Os esquemas definem os tipos de artefatos e suas dependências para um fluxo de trabalho.

### Como Funcionam os Esquemas

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # No dependencies, can create first

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Needs proposal before creating

  - id: design
    generates: design.md
    requires: [proposal]      # Can create in parallel with specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Needs both specs and design first
```

**Artefatos formam um grafo de dependência:**

```
                    proposal
                   (root node)
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

**As dependências são habilitadores, não portões.** Elas mostram o que é possível criar, e não o que você deve criar em seguida. Você pode pular o design se não precisar dele. Você pode criar as specs antes ou depois do design — ambos dependem apenas da proposta.

### Esquemas Embutidos (Built-in Schemas)

**spec-driven** (padrão)

O fluxo de trabalho padrão para o desenvolvimento orientado por especificações:

```
proposal → specs → design → tasks → implement
```

Melhor para: A maioria dos trabalhos de funcionalidade em que você deseja concordar com as specs antes da implementação.

### Esquemas Personalizados (Custom Schemas)

Crie esquemas personalizados para o fluxo de trabalho da sua equipe:

```bash
# Create from scratch
openspec schema init research-first

# Or fork an existing one
openspec schema fork spec-driven research-first
```

**Exemplo de esquema personalizado:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Do research first

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal informed by research

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Skip specs/design, go straight to tasks
```

Consulte [Customização](customization.md) para obter detalhes completos sobre como criar e usar esquemas personalizados.

## Arquivamento (Archive)

Arquivar completa uma mudança ao mesclar suas delta specs nas specs principais e preservar a mudança para o histórico.

### O que Acontece Ao Arquivar

```
Antes do arquivamento:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ merge
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Após o arquivamento:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Now includes 2FA requirements
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Preserved for history
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### O Processo de Arquivamento

1. **Mesclar deltas.** Cada seção de especificação delta (ADDED/MODIFIED/REMOVED) é aplicada à especificação principal correspondente.

2. **Mover para o arquivo.** A pasta da mudança move-se para `changes/archive/` com um prefixo de data para ordenação cronológica.

3. **Preservar o contexto.** Todos os artefatos permanecem intactos no arquivo. Você sempre pode olhar para trás para entender por que uma mudança foi feita.

### Por Que Arquivar é Importante

**Estado limpo.** As mudanças ativas (`changes/`) mostram apenas o trabalho em andamento. O trabalho concluído é movido para fora do caminho.

**Rastro de auditoria.** O arquivo preserva o contexto completo de cada mudança — não apenas o que mudou, mas a proposta explicando por quê, o design explicando como e as tarefas mostrando o trabalho realizado.

**Evolução das specs.** As specs crescem organicamente à medida que as mudanças são arquivadas. Cada arquivo mescla seus deltas, construindo uma especificação abrangente ao longo do tempo.

## Como Tudo se Encaixa

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FLUXO OPENSPEC                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (core) or /opsx:new (expanded)           │
│   │     CHANGE     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREATE     │  /opsx:ff or /opsx:continue (expanded workflow)         │
│   │     ARTIFACTS  │  Creates proposal → specs → design → tasks              │
│   │                │  (based on schema dependencies)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENT  │  /opsx:apply                                            │
│   │     TASKS      │  Work through tasks, checking them off                  │
│   │                │◄──── Update artifacts as you learn                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFY     │  /opsx:verify (optional)                                │
│   │     WORK       │  Check implementation matches specs                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVE    │────►│  Delta specs merge into main specs           │    │
│   │     CHANGE     │     │  Change folder moves to archive/             │    │
│   └────────────────┘     │  Specs are now the updated source of truth   │    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**O ciclo virtuoso:**

1. As specs descrevem o comportamento atual
2. As mudanças propõem modificações (como deltas)
3. A implementação torna as mudanças reais
4. O arquivo mescla os deltas nas specs
5. As specs agora descrevem o novo comportamento
6. A próxima mudança se baseia nas specs atualizadas

## Glossário

| Termo | Definição |
|------|------------|
| **Artifact** | Um documento dentro de uma mudança (proposta, design, tarefas ou especificações delta) |
| **Archive** | O processo de concluir uma mudança e mesclar seus deltas nas especificações principais |
| **Change** | Uma modificação proposta para o sistema, empacotada como uma pasta com artefatos |
| **Delta spec** | Uma especificação que descreve mudanças (ADDED/MODIFIED/REMOVED) em relação às especificações atuais |
| **Domain** | Um agrupamento lógico para as specs (por exemplo, `auth/`, `payments/`) |
| **Requirement** | Um comportamento específico que o sistema deve ter |
| **Scenario** | Um exemplo concreto de um requisito, tipicamente no formato Dado/Quando/Então |
| **Schema** | Uma definição dos tipos de artefatos e suas dependências |
| **Spec** | Uma especificação descrevendo o comportamento do sistema, contendo requisitos e cenários |
| **Source of truth** | O diretório `openspec/specs/`, contendo o comportamento atual acordado |

## Próximos Passos

- [Primeiros Passos](getting-started.md) - Primeiros passos práticos
- [Fluxos de Trabalho](workflows.md) - Padrões comuns e quando usar cada um
- [Comandos](commands.md) - Referência completa de comandos
- [Customização](customization.md) - Crie esquemas personalizados e configure seu projeto