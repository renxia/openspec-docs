# Primeiros Passos

Este guia explica como o OpenSpec funciona depois que você o instalou e inicializou. Para instruções de instalação, consulte o [README principal](../index.md#quick-start) ou o [Guia de Instalação](installation.md). Novo em todo o conjunto de documentação? A [página inicial da documentação](index.md) mapeia tudo.

> **Onde digito esses comandos?** Dois lugares, e confundi-los é o tropeço inicial mais comum.
>
> - Comandos `openspec ...` (como `openspec init`) são executados no seu **terminal**.
> - Comandos `/opsx:...` (como `/opsx:propose`) são executados no **chat do seu assistente de IA**, a mesma caixa onde você pediria para ele escrever código.
>
> Não há um "modo interativo" separado para iniciar. Você apenas digita o comando de barra no chat e seu assistente continua a partir daí. Explicação completa: [Como os Comandos Funcionam](how-commands-work.md).

## Seus Primeiros Cinco Minutos

O loop completo, com cada passo rotulado pelo local onde acontece:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (optional: think it through first)
AI CHAT      /opsx:propose add-dark-mode      (AI drafts the plan; you review it)
AI CHAT      /opsx:apply                      (AI builds it)
AI CHAT      /opsx:archive                    (specs updated, change filed away)
```

Dois passos no terminal para configurar, depois você vive no chat. O resto deste guia descreve o que cada passo faz e o que você verá.

> **Não tem certeza do que construir ainda? Comece com `/opsx:explore`.** É um parceiro de reflexão sem riscos que lê sua base de código, pesa opções e transforma uma ideia vaga em um plano concreto, tudo antes que qualquer artefato ou código exista. Quando a imagem estiver clara, ele passa para `/opsx:propose`. Este é o melhor hábito único para trabalhar com uma IA que, de outra forma, construiria a coisa errada com confiança. Consulte o [Guia Explore](explore.md).

## Como Funciona

O OpenSpec ajuda você e seu assistente de codificação de IA a concordar sobre o que construir antes que qualquer código seja escrito.

**Caminho rápido padrão (perfil core):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (optional)
```

Comece com `/opsx:explore` quando estiver descobrindo o que fazer, ou pule diretamente para `/opsx:propose` quando já souber. O Explore está no perfil padrão, então sempre estará lá quando você quiser.

**Caminho expandido (seleção de fluxo de trabalho personalizado):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

O perfil global padrão é `core`, que inclui `propose`, `explore`, `apply`, `sync` e `archive`. Você pode habilitar os comandos de fluxo de trabalho expandido com `openspec config profile` e depois `openspec update`.

## O que o OpenSpec Cria

Depois de executar `openspec init`, seu projeto tem esta estrutura:

```
openspec/
├── specs/              # Source of truth (your system's behavior)
│   └── <domain>/
│       └── spec.md
├── changes/            # Proposed updates (one folder per change)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta specs (what's changing)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Project configuration (optional)
```

**Dois diretórios principais:**

- **`specs/`** - A fonte da verdade. Esses specs descrevem como seu sistema se comporta atualmente. Organizados por domínio (ex: `specs/auth/`, `specs/payments/`).

- **`changes/`** - Modificações propostas. Cada alteração recebe sua própria pasta com todos os artefatos relacionados. Quando uma alteração é concluída, seus specs são mesclados no diretório `specs/` principal.

## Entendendo os Artefatos

Cada pasta de alteração contém artefatos que orientam o trabalho:

| Artefato | Propósito |
|----------|-----------|
| `proposal.md` | O "porquê" e o "o quê" - captura a intenção, o escopo e a abordagem |
| `specs/` | Delta specs mostrando requisitos ADICIONADOS/MODIFICADOS/REMOVIDOS |
| `design.md` | O "como" - abordagem técnica e decisões de arquitetura |
| `tasks.md` | Lista de verificação de implementação com caixas de seleção |

**Os artefatos se baseiam uns nos outros:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            update as you learn
```

Você sempre pode voltar e refinar artefatos anteriores à medida que aprende mais durante a implementação.

## Como os Delta Specs Funcionam

Delta specs são o conceito chave no OpenSpec. Eles mostram o que está mudando em relação aos seus specs atuais.

### O Formato

Delta specs usam seções para indicar o tipo de alteração:

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST require a second factor during login.

#### Scenario: OTP required
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented

## MODIFIED Requirements

### Requirement: Session Timeout
The system SHALL expire sessions after 30 minutes of inactivity.
(Previously: 60 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA)
```

### O que Acontece no Archive

Quando você arquiva uma alteração:

1. Requisitos **ADICIONADOS** são anexados ao spec principal
2. Requisitos **MODIFICADOS** substituem a versão existente
3. Requisitos **REMOVIDOS** são excluídos do spec principal

A pasta da alteração é movida para `openspec/changes/archive/` para histórico de auditoria.

## Exemplo: Sua Primeira Alteração

Vamos percorrer a adição de modo escuro a um aplicativo.

### 1. Inicie a Alteração (Padrão)

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

Se você habilitou o perfil de fluxo de trabalho expandido, também pode fazer isso em duas etapas: `/opsx:new` depois `/opsx:ff` (ou `/opsx:continue` incrementalmente).

### 2. O que é Criado

**proposal.md** - Captura a intenção:

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage.

## Scope
- Add theme toggle in settings
- Support system preference detection
- Persist preference in localStorage

## Approach
Use CSS custom properties for theming with a React context
for state management.
```

**specs/ui/spec.md** - Delta mostrando novos requisitos:

```markdown
# Delta for UI

## ADDED Requirements

### Requirement: Theme Selection
The system SHALL allow users to choose between light and dark themes.

#### Scenario: Manual toggle
- GIVEN a user on any page
- WHEN the user clicks the theme toggle
- THEN the theme switches immediately
- AND the preference persists across sessions

#### Scenario: System preference
- GIVEN a user with no saved preference
- WHEN the application loads
- THEN the system's preferred color scheme is used
```

**tasks.md** - Lista de verificação de implementação:

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
```

### 3. Implementar

```
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Created ThemeContext with light/dark state
     ✓ 1.2 Added CSS custom properties to globals.css
     ✓ 1.3 Implemented localStorage persistence
     ✓ 2.1 Created ThemeToggle component
     ...
     All tasks complete!
```

Durante a implementação, se você descobrir que o design precisa de ajustes, basta atualizar o artefato e continuar.

### 4. Arquivar

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

Seus delta specs agora fazem parte dos specs principais, documentando como seu sistema funciona.

## Verificando e Revisando

Use a CLI para verificar suas alterações:

```bash
# List active changes
openspec list

# View change details
openspec show add-dark-mode

# Validate spec formatting
openspec validate add-dark-mode

# Interactive dashboard
openspec view
```

## Próximos Passos

- [Explore Primeiro](explore.md) - Use `/opsx:explore` para pensar em uma ideia antes de se comprometer
- [Revisando uma Alteração](reviewing-changes.md) - O que verificar no plano que a IA rascunha, antes de qualquer código
- [Escrevendo Bons Specs](writing-specs.md) - Como é um requisito forte e um cenário
- [Usando o OpenSpec em um Projeto Existente](existing-projects.md) - Comece em uma base de código legada grande
- [Editando e Iterando em uma Alteração](editing-changes.md) - Atualize artefatos, volte, reconcilie edições manuais
- [Conceitos Básicos de Relance](overview.md) - Todo o modelo mental em uma página
- [Exemplos e Receitas](examples.md) - Alterações reais, do início ao fim
- [Fluxos de Trabalho](workflows.md) - Padrões comuns e quando usar cada comando
- [Comandos](commands.md) - Referência completa para todos os comandos de barra
- [Conceitos](concepts.md) - Compreensão mais profunda de specs, alterações e esquemas
- [Personalização](customization.md) - Faça o OpenSpec funcionar do seu jeito
- [Stores](stores-beta/user-guide.md) - Planejamento que abrange repositórios ou equipes? Mantenha-o em seu próprio repositório (beta)
- [FAQ](faq.md) e [Solução de Problemas](troubleshooting.md) - Quando você ficar preso