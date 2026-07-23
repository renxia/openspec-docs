# Conceitos

Este guia explica as ideias centrais por trás do OpenSpec e como elas se conectam. Para uso prático, consulte [Primeiros Passos](getting-started.md) e [Fluxos de Trabalho](workflows.md).

## Filosofia

O OpenSpec é construído em torno de quatro princípios:

```
fluido, não rígido         — sem portões de fase, trabalhe no que fizer sentido
iterativo, não em cascata — aprenda enquanto constrói, refine ao longo do caminho
simples, não complexo        — configuração leve, cerimônia mínima
primeiro para brownfield — funciona com bases de código existentes, não apenas para greenfield
```

### Por Que Esses Princípios São Importantes

**Fluido, não rígido.** Sistemas de especificação tradicionais o prendem em fases: primeiro você planeja, depois implementa, e depois está concluído. O OpenSpec é mais flexível — você pode criar artefatos em qualquer ordem que fizer sentido para o seu trabalho.

**Iterativo, não em cascata.** Os requisitos mudam. O entendimento se aprofunda. O que parecia uma boa abordagem no início pode não se sustentar depois que você vê a base de código. O OpenSpec aceita essa realidade.

**Simples, não complexo.** Alguns frameworks de especificação exigem configuração extensa, formatos rígidos ou processos pesados. O OpenSpec não atrapalha o seu trabalho. Inicialize em segundos, comece a trabalhar imediatamente, personalize apenas se precisar.

**Primeiro para brownfield.** A maior parte do trabalho de software não é construir do zero — é modificar sistemas existentes. A abordagem baseada em deltas do OpenSpec facilita a especificação de alterações em comportamentos existentes, não apenas a descrição de novos sistemas.

## A Visão Geral

O OpenSpec organiza seu trabalho em duas áreas principais:

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

**Especificações** são a fonte da verdade — elas descrevem como seu sistema se comporta atualmente.

**Alterações** são modificações propostas — elas ficam em pastas separadas até que você esteja pronto para mesclá-las.

Essa separação é fundamental. Você pode trabalhar em várias alterações em paralelo sem conflitos. Você pode revisar uma alteração antes que ela afete as especificações principais. E quando você arquiva uma alteração, seus deltas são mesclados de forma limpa na fonte da verdade.

## Especificações

As especificações descrevem o comportamento do seu sistema usando requisitos estruturados e cenários.

### Estrutura

```
openspec/specs/
├── auth/
│   └── spec.md           # Authentication behavior
├── payments/
│   └── spec.md           # Payment processing
├── notifications/
│   └── spec.md           # Notification system
└── ui/
    └── spec.md           # UI behavior and themes
```

Organize as especificações por domínio — agrupamentos lógicos que fazem sentido para seu sistema. Padrões comuns:

- **Por área de funcionalidade**: `auth/`, `payments/`, `search/`
- **Por componente**: `api/`, `frontend/`, `workers/`
- **Por contexto delimitado**: `ordering/`, `fulfillment/`, `inventory/`

### Formato de Especificação

Uma especificação contém requisitos, e cada requisito tem cenários:

```markdown
# Auth Specification

## Purpose
Authentication and session management for the application.

## Requirements

### Requirement: User Authentication
The system SHALL issue a JWT token upon successful login.

#### Scenario: Valid credentials
- GIVEN a user with valid credentials
- WHEN the user submits login form
- THEN a JWT token is returned
- AND the user is redirected to dashboard

#### Scenario: Invalid credentials
- GIVEN invalid credentials
- WHEN the user submits login form
- THEN an error message is displayed
- AND no token is issued

### Requirement: Session Expiration
The system MUST expire sessions after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated
- AND the user must re-authenticate
```

**Elementos-chave:**

| Elemento | Propósito |
|---------|---------|
| `## Purpose` | Descrição de alto nível do domínio desta especificação |
| `### Requirement:` | Um comportamento específico que o sistema deve ter |
| `#### Scenario:` | Um exemplo concreto do requisito em ação |
| SHALL/MUST/SHOULD | Palavras-chave RFC 2119 indicando a força do requisito |

### Por Que Estruturar as Especificações Desta Forma

**Requisitos são o "o quê"** — eles declaram o que o sistema deve fazer sem especificar a implementação.

**Cenários são o "quando"** — eles fornecem exemplos concretos que podem ser verificados. Bons cenários:
- São testáveis (você poderia escrever um teste automatizado para eles)
- Cobrem tanto o caminho feliz quanto casos de borda
- Usam Given/When/Then ou formato estruturado similar

**Palavras-chave RFC 2119** (SHALL, MUST, SHOULD, MAY) comunicam a intenção:
- **MUST/SHALL** — requisito absoluto
- **SHOULD** — recomendado, mas existem exceções
- **MAY** — opcional

### O Que É (e Não É) uma Especificação

Uma especificação é um **contrato de comportamento**, não um plano de implementação.

Bom conteúdo de especificação:
- Comportamento observável no qual usuários ou sistemas downstream confiam
- Entradas, saídas e condições de erro
- Restrições externas (segurança, privacidade, confiabilidade, compatibilidade)
- Cenários que podem ser testados ou validados explicitamente

Evite nas especificações:
- Nomes de classes/funções internas
- Escolhas de biblioteca ou framework
- Detalhes de implementação passo a passo
- Planos de execução detalhados (esses pertencem ao `design.md` ou `tasks.md`)

Teste rápido:
- Se a implementação pode mudar sem alterar o comportamento visível externamente, provavelmente não pertence à especificação.

### Mantenha Leve: Rigor Progressivo

O OpenSpec visa evitar a burocracia. Use o nível mais leve que ainda torne a alteração verificável.

**Especificação leve (padrão):**
- Requisitos curtos e focados no comportamento
- Escopo claro e não-objetivos
- Algumas verificações de aceitação concretas

**Especificação completa (para maior risco):**
- Alterações entre equipes ou entre repositórios
- Alterações de API/contrato, migrações, preocupações de segurança/privacidade
- Alterações onde a ambiguidade pode causar retrabalho caro

A maioria das alterações deve permanecer no modo Leve.

### Colaboração Humana + Agente

Em muitas equipes, humanos exploram e agentes rascunham artefatos. O loop pretendido é:

1. Humano fornece intenção, contexto e restrições.
2. Agente converte isso em requisitos focados no comportamento e cenários.
3. Agente mantém detalhes de implementação no `design.md` e `tasks.md`, não no `spec.md`.
4. Validação confirma estrutura e clareza antes da implementação.

Isso mantém as especificações legíveis para humanos e consistentes para agentes.

## Alterações

Uma alteração é uma modificação proposta para seu sistema, empacotada como uma pasta com tudo o que é necessário para entendê-la e implementá-la.

### Estrutura de Alteração

```
openspec/changes/add-dark-mode/
├── proposal.md           # Why and what
├── design.md             # How (technical approach)
├── tasks.md              # Implementation checklist
├── .openspec.yaml        # Change metadata (optional): schema, created, skip_specs
└── specs/                # Delta specs
    └── ui/
        └── spec.md       # What's changing in ui/spec.md
```

Cada alteração é autossuficiente. Ela tem:
- **Artefatos** — documentos que capturam intenção, design e tarefas
- **Especificações delta** — especificações para o que está sendo adicionado, modificado ou removido
- **Metadados** — configuração opcional para esta alteração específica

### Por Que as Alterações São Pastas

Empacotar uma alteração como uma pasta tem vários benefícios:

1. **Tudo junto.** Proposta, design, tarefas e especificações ficam em um só lugar. Sem necessidade de procurar em locais diferentes.

2. **Trabalho paralelo.** Várias alterações podem existir simultaneamente sem conflitos. Trabalhe no `add-dark-mode` enquanto o `fix-auth-bug` também está em andamento.

3. **Histórico limpo.** Quando arquivadas, as alterações se movem para `changes/archive/` com todo o seu contexto preservado. Você pode olhar para trás e entender não apenas o que mudou, mas o porquê.

4. **Fácil de revisar.** Uma pasta de alteração é fácil de revisar — abra-a, leia a proposta, verifique o design, veja os deltas das especificações.

## Artefatos

Artefatos são os documentos dentro de uma alteração que orientam o trabalho.

### O Fluxo de Artefatos

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Os artefatos se baseiam uns nos outros. Cada artefato fornece contexto para o próximo.

### Tipos de Artefatos

#### Proposta (`proposal.md`)

A proposta captura **intenção**, **escopo** e **abordagem** em um nível alto.

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage and match system preferences.

## Scope
In scope:
- Theme toggle in settings
- System preference detection
- Persist preference in localStorage

Out of scope:
- Custom color themes (future work)
- Per-page theme overrides

## Approach
Use CSS custom properties for theming with a React context
for state management. Detect system preference on first load,
allow manual override.
```

**Quando atualizar a proposta:**
- Alterações de escopo (redução ou expansão)
- Intenção se clarifica (melhor compreensão do problema)
- Abordagem muda fundamentalmente

#### Especificações (especificações delta em `specs/`)

Especificações delta descrevem **o que está mudando** em relação às especificações atuais. Veja [Especificações Delta](#delta_specs) abaixo.

#### Design (`design.md`)

O design captura **abordagem técnica** e **decisões de arquitetura**.

````markdown
# Design: Add Dark Mode

## Technical Approach
Theme state managed via React Context to avoid prop drilling.
CSS custom properties enable runtime switching without class toggling.

## Architecture Decisions

### Decision: Context over Redux
Using React Context for theme state because:
- Simple binary state (light/dark)
- No complex state transitions
- Avoids adding Redux dependency

### Decision: CSS Custom Properties
Using CSS variables instead of CSS-in-JS because:
- Works with existing stylesheet
- No runtime overhead
- Browser-native solution

## Data Flow
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes
- `src/contexts/ThemeContext.tsx` (new)
- `src/components/ThemeToggle.tsx` (new)
- `src/styles/globals.css` (modified)
````

**Quando atualizar o design:**
- A implementação revela que a abordagem não funcionará
- Solução melhor descoberta
- Dependências ou restrições mudam

#### Tarefas (`tasks.md`)

Tarefas são a **lista de verificação de implementação** — passos concretos com caixas de seleção.

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence
- [ ] 1.4 Add system preference detection

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
- [ ] 3.3 Test contrast ratios for accessibility
```

**Melhores práticas para tarefas:**
- Agrupe tarefas relacionadas sob títulos
- Use numeração hierárquica (1.1, 1.2, etc.)
- Mantenha as tarefas pequenas o suficiente para serem concluídas em uma sessão
- Marque as tarefas como concluídas à medida que você as completa

## Especificações Delta

Especificações delta são o conceito-chave que faz o OpenSpec funcionar para desenvolvimento brownfield. Elas descrevem **o que está mudando** em vez de reescrever toda a especificação.

### O Formato

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup
- AND the user must verify with a code before activation

#### Scenario: 2FA login
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented
- AND login completes only after valid OTP

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users should re-authenticate each session.)
```

### Seções Delta

| Seção | Significado | O que Acontece ao Arquivar |
|---------|---------|------------------------|
| `## ADDED Requirements` | Novo comportamento | Anexado à especificação principal |
| `## MODIFIED Requirements` | Comportamento alterado | Substitui o requisito existente |
| `## REMOVED Requirements` | Comportamento descontinuado | Excluído da especificação principal |

### Por Que Deltas em Vez de Especificações Completas

**Clareza.** Um delta mostra exatamente o que está mudando. Ao ler uma especificação completa, você teria que fazer o diff mentalmente contra a versão atual.

**Evitação de conflitos.** Duas alterações podem tocar no mesmo arquivo de especificação sem conflitar, desde que modifiquem requisitos diferentes.

**Eficiência de revisão.** Os revisores veem a alteração, não o contexto inalterado. Foco no que importa.

**Adequação para Brownfield.** A maioria dos trabalhos modifica comportamento existente. Deltas tornam as modificações de primeira classe, não um pensamento posterior.

## Esquemas

Os esquemas definem os tipos de artefatos e suas dependências para um fluxo de trabalho.

### Como os Esquemas Funcionam

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

**Os artefatos formam um grafo de dependência:**

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

**As dependências são habilitadores, não barreiras.** Elas mostram o que é possível criar, não o que você deve criar em seguida. Você pode pular o design se não precisar dele. Você pode criar os specs antes ou depois do design — ambos dependem apenas da proposal.

### Esquemas Integrados

**spec-driven** (padrão)

O fluxo de trabalho padrão para desenvolvimento orientado a especificações:

```
proposal → specs → design → tasks → implement
```

Melhor para: Maioria dos trabalhos de funcionalidade onde você deseja concordar com os specs antes da implementação.

### Esquemas Personalizados

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

Consulte [Personalização](customization.md) para obter detalhes completos sobre como criar e usar esquemas personalizados.

## Arquivar

Arquivar completa uma alteração mesclando seus specs delta nos specs principais e preservando a alteração para o histórico.

### O que Acontece Quando Você Arquivar

```
Antes de arquivar:

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


Depois de arquivar:

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

1. **Mesclar deltas.** Cada seção de spec delta (ADDED/MODIFIED/REMOVED) é aplicada ao spec principal correspondente.

2. **Mover para o arquivo.** A pasta de alteração é movida para `changes/archive/` com um prefixo de data para ordenação cronológica.

3. **Preservar contexto.** Todos os artefatos permanecem intactos no arquivo. Você pode sempre olhar para trás para entender por que uma alteração foi feita.

### Por Que Arquivar é Importante

**Estado limpo.** Alterações ativas (`changes/`) mostram apenas trabalho em andamento. O trabalho concluído é movido para fora do caminho.

**Rastro de auditoria.** O arquivo preserva o contexto completo de cada alteração — não apenas o que mudou, mas a proposta explicando o porquê, o design explicando o como e as tarefas mostrando o trabalho realizado.

**Evolução de specs.** Os specs crescem organicamente à medida que as alterações são arquivadas. Cada arquivamento mescla seus deltas, construindo uma especificação abrangente ao longo do tempo.

## Como Tudo se Encadeia

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
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
| **Artifact** | Um documento dentro de uma alteração (proposal, design, tasks ou delta specs) |
| **Archive** | O processo de concluir uma alteração e mesclar seus deltas nos specs principais |
| **Change** | Uma modificação proposta para o sistema, empacotada como uma pasta com artefatos |
| **Delta spec** | Um spec que descreve alterações (ADDED/MODIFIED/REMOVED) em relação aos specs atuais |
| **Domain** | Um agrupamento lógico para specs (ex: `auth/`, `payments/`) |
| **Requirement** | Um comportamento específico que o sistema deve ter |
| **Scenario** | Um exemplo concreto de um requisito, tipicamente no formato Given/When/Then |
| **Schema** | Uma definição de tipos de artefatos e suas dependências |
| **Spec** | Uma especificação descrevendo o comportamento do sistema, contendo requisitos e cenários |
| **Source of truth** | O diretório `openspec/specs/`, contendo o comportamento acordado atual |

## Próximos Passos

- [Primeiros Passos](getting-started.md) - Primeiros passos práticos
- [Fluxos de Trabalho](workflows.md) - Padrões comuns e quando usar cada um
- [Comandos](commands.md) - Referência completa de comandos
- [Personalização](customization.md) - Crie esquemas personalizados e configure seu projeto