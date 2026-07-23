# Primeiros Passos

Este guia explica como o OpenSpec funciona depois que você o instalou e inicializou. Para instruções de instalação, consulte o [README principal](../index.md#quick-start) ou o [Guia de Instalação](installation.md). Novo em toda a documentação? A [página inicial da documentação](index.md) mapeia tudo.

> **Onde devo digitar esses comandos?** Dois lugares, e misturá-los é o tropeço inicial mais comum.
>
> - Comandos `openspec ...` (como `openspec init`) são executados no seu **terminal**.
> - Comandos `/opsx:...` (como `/opsx:propose`) são executados no **chat do seu assistente de IA**, a mesma caixa onde você pediria para ele escrever código.
>
> Não há um "modo interativo" separado para iniciar. Você apenas digita o comando de barra no chat e seu assistente continua a partir daí. Explicação completa: [Como os Comandos Funcionam](how-commands-work.md).

## Seus Primeiros Cinco Minutos

Todo o fluxo, com cada etapa rotulada por onde ela acontece:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (opcional: pense nisso primeiro)
AI CHAT      /opsx:propose add-dark-mode      (IA rascunha o plano; você o revisa)
AI CHAT      /opsx:apply                      (IA constrói)
AI CHAT      /opsx:archive                    (especificações atualizadas, alteração arquivada)
```

Dois passos no terminal para configurar, depois você vive no chat. O restante deste guia explica o que cada etapa faz e o que você verá.

> **Ainda não tem certeza do que construir? Comece com `/opsx:explore`.** É um parceiro de reflexão sem riscos que lê sua base de código, pesa opções e transforma uma ideia vaga em um plano concreto, tudo antes que qualquer artefato ou código exista. Quando a imagem estiver clara, ele passa para `/opsx:propose`. Este é o melhor hábito para trabalhar com uma IA que, de outra forma, construiria com confiança a coisa errada. Consulte o [Guia de Exploração](explore.md).

## Como Funciona

O OpenSpec ajuda você e seu assistente de codificação de IA a concordar sobre o que construir antes que qualquer código seja escrito.

**Caminho rápido padrão (perfil core):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (opcional)
```

Comece com `/opsx:explore` quando você estiver descobrindo o que fazer, ou pule diretamente para `/opsx:propose` quando já souber. O Explore está no perfil padrão, então sempre estará lá quando você quiser.

**Caminho expandido (seleção de fluxo de trabalho personalizado):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

O perfil global padrão é `core`, que inclui `propose`, `explore`, `apply`, `sync` e `archive`. Você pode habilitar os comandos de fluxo de trabalho expandido com `openspec config profile` e depois `openspec update`.

## O Que o OpenSpec Cria

Depois de executar `openspec init`, seu projeto tem esta estrutura:

```
openspec/
├── specs/              # Fonte da verdade (comportamento do seu sistema)
│   └── <domain>/
│       └── spec.md
├── changes/            # Atualizações propostas (uma pasta por alteração)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Especificações delta (o que está mudando)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Configuração do projeto (opcional)
```

**Dois diretórios principais:**

- **`specs/`** - A fonte da verdade. Essas especificações descrevem como seu sistema se comporta atualmente. Organizadas por domínio (ex: `specs/auth/`, `specs/payments/`).

- **`changes/`** - Modificações propostas. Cada alteração recebe sua própria pasta com todos os artefatos relacionados. Quando uma alteração é concluída, suas especificações são mescladas no diretório principal `specs/`.

## Entendendo os Artefatos

Cada pasta de alteração contém artefatos que orientam o trabalho:

| Artefato | Propósito |
|----------|-----------|
| `proposal.md` | O "porquê" e o "o quê" - captura a intenção, o escopo e a abordagem |
| `specs/` | Especificações delta mostrando requisitos ADICIONADOS/MODIFICADOS/REMOVIDOS |
| `design.md` | O "como" - abordagem técnica e decisões de arquitetura |
| `tasks.md` | Lista de verificação de implementação com caixas de seleção |

**Os artefatos se constroem uns sobre os outros:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            atualize à medida que aprende
```

Você sempre pode voltar e refinar artefatos anteriores à medida que aprende mais durante a implementação.

## Como as Especificações Delta Funcionam

As especificações delta são o conceito chave no OpenSpec. Elas mostram o que está mudando em relação às suas especificações atuais.

### O Formato

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

### O Que Acontece no Arquivamento

Quando você arquiva uma alteração:

1. Os requisitos **ADICIONADOS** são anexados à especificação principal
2. Os requisitos **MODIFICADOS** substituem a versão existente
3. Os requisitos **REMOVIDOS** são excluídos da especificação principal

A pasta da alteração é movida para `openspec/changes/archive/` para histórico de auditoria.

## Exemplo: Sua Primeira Alteração

Vamos percorrer a adição de modo escuro a uma aplicação.

### 1. Iniciar a Alteração (Padrão)

```text
Você: /opsx:propose add-dark-mode

IA:  Criado openspec/changes/add-dark-mode/
     ✓ proposal.md — por que estamos fazendo isso, o que está mudando
     ✓ specs/       — requisitos e cenários
     ✓ design.md    — abordagem técnica
     ✓ tasks.md     — lista de verificação de implementação
     Pronto para implementação!
```

Se você habilitou o perfil de fluxo de trabalho expandido, também pode fazer isso em duas etapas: `/opsx:new` depois `/opsx:ff` (ou `/opsx:continue` incrementalmente).

### 2. O Que É Criado

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
Você: /opsx:apply

IA:  Trabalhando nas tarefas...
     ✓ 1.1 Criado ThemeContext com estado claro/escuro
     ✓ 1.2 Adicionadas propriedades CSS personalizadas ao globals.css
     ✓ 1.3 Implementada persistência no localStorage
     ✓ 2.1 Criado componente ThemeToggle
     ...
     Todas as tarefas concluídas!
```

Durante a implementação, se você descobrir que o design precisa de ajustes, basta atualizar o artefato e continuar.

### 4. Arquivar

```
Você: /opsx:archive

IA:  Arquivando add-dark-mode...
     ✓ Especificações mescladas em openspec/specs/ui/spec.md
     ✓ Movido para openspec/changes/archive/2025-01-24-add-dark-mode/
     Concluído! Pronto para o próximo recurso.
```

Suas especificações delta agora fazem parte das especificações principais, documentando como seu sistema funciona.

## Verificando e Revisando

Use a CLI para verificar suas alterações:

```bash
# Listar alterações ativas
openspec list

# Ver detalhes da alteração
openspec show add-dark-mode

# Validar formatação da especificação
openspec validate add-dark-mode

# Painel interativo
openspec view
```

## Próximos Passos

- [Explore Primeiro](explore.md) - Use `/opsx:explore` para refletir sobre uma ideia antes de se comprometer
- [Revisando uma Alteração](reviewing-changes.md) - O que verificar no plano que a IA rascunha, antes de qualquer código
- [Escrevendo Boas Especificações](writing-specs.md) - Como é um requisito forte e um cenário
- [Usando o OpenSpec em um Projeto Existente](existing-projects.md) - Comece em uma base de código legada grande
- [Editando e Iterando em uma Alteração](editing-changes.md) - Atualize artefatos, volte, reconcilie edições manuais
- [Conceitos Básicos de Relance](overview.md) - Todo o modelo mental em uma página
- [Exemplos e Receitas](examples.md) - Alterações reais, do início ao fim
- [Fluxos de Trabalho](workflows.md) - Padrões comuns e quando usar cada comando
- [Comandos](commands.md) - Referência completa para todos os comandos de barra
- [Conceitos](concepts.md) - Compreensão mais profunda de especificações, alterações e esquemas
- [Personalização](customization.md) - Faça o OpenSpec funcionar do seu jeito
- [Armazenamentos](stores-beta/user-guide.md) - Planejamento que abrange repositórios ou equipes? Mantenha-o em seu próprio repositório (beta)
- [FAQ](faq.md) e [Solução de Problemas](troubleshooting.md) - Quando você ficar preso