# Conceitos

Este guia explica as ideias centrais por trás do OpenSpec e como elas se encaixam. Para uso prático, consulte [Primeiros Passos](getting-started.md) e [Fluxos de Trabalho](workflows.md).

## Filosofia

O OpenSpec é construído em torno de quatro princípios:

```
fluido, não rígido         — sem portões de fase, trabalhe no que fizer sentido
iterativo, não em cascata — aprenda enquanto constrói, refine ao longo do caminho
simples, não complexo        — configuração leve, cerimônia mínima
prioriza brownfield        — funciona com bases de código existentes, não apenas para greenfield
```

### Por Que Esses Princípios São Importantes

**Fluido, não rígido.** Sistemas de especificação tradicionais te prendem em fases: primeiro você planeja, depois implementa, e depois está pronto. O OpenSpec é mais flexível — você pode criar artefatos em qualquer ordem que fizer sentido para o seu trabalho.

**Iterativo, não em cascata.** Requisitos mudam. O entendimento se aprofunda. O que parecia uma boa abordagem no início pode não se sustentar depois que você vê a base de código. O OpenSpec abraça essa realidade.

**Simples, não complexo.** Alguns frameworks de especificação exigem configuração extensa, formatos rígidos ou processos pesados. O OpenSpec não atrapalha o seu trabalho. Inicialize em segundos, comece a trabalhar imediatamente, personalize apenas se precisar.

**Prioriza brownfield.** A maior parte do trabalho com software não é construir do zero — é modificar sistemas existentes. A abordagem baseada em delta do OpenSpec facilita a especificação de alterações em comportamentos existentes, não apenas a descrição de novos sistemas.

## O Quadro Geral

OpenSpec organiza seu trabalho em duas áreas principais:

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

**Specs** são a fonte da verdade — eles descrevem como seu sistema funciona atualmente.

**Changes** são modificações propostas — elas residem em pastas separadas até que você esteja pronto para mesclá-las.

Essa separação é fundamental. Você pode trabalhar em várias changes em paralelo sem conflitos. Você pode revisar uma change antes que ela afete os specs principais. E quando arquiva uma change, seus deltas são mesclados de forma limpa na fonte da verdade.

## Specs

Specs descrevem o comportamento do seu sistema usando requisitos estruturados e cenários.

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
    └── spec.md           # Comportamento da interface e temas
```

Organize os specs por domínio — agrupamentos lógicos que fazem sentido para o seu sistema. Padrões comuns:

- **Por área de funcionalidade**: `auth/`, `payments/`, `search/`
- **Por componente**: `api/`, `frontend/`, `workers/`
- **Por contexto delimitado**: `ordering/`, `fulfillment/`, `inventory/`

### Formato do Spec

Um spec contém requisitos, e cada requisito tem cenários:

```markdown
# Especificação de Autenticação

## Propósito
Autenticação e gerenciamento de sessão para a aplicação.

## Requisitos

### Requisito: Autenticação de Usuário
O sistema DEVE emitir um token JWT após login bem-sucedido.

#### Cenário: Credenciais válidas
- GIVEN a user with valid credentials
- WHEN the user submits login form
- THEN a JWT token is returned
- AND the user is redirected to dashboard

#### Cenário: Credenciais inválidas
- GIVEN invalid credentials
- WHEN the user submits login form
- THEN an error message is displayed
- AND no token is issued

### Requisito: Expiração de Sessão
O sistema DEVE expirar sessões após 30 minutos de inatividade.

#### Cenário: Tempo limite de inatividade
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated
- AND the user must re-authenticate
```

**Elementos-chave:**

| Elemento | Propósito |
|---------|---------|
| `## Propósito` | Descrição de alto nível do domínio deste spec |
| `### Requisito:` | Um comportamento específico que o sistema deve ter |
| `#### Cenário:` | Um exemplo concreto do requisito em ação |
| SHALL/MUST/SHOULD | Palavras-chave da RFC 2119 que indicam a força do requisito |

### Por que Estruturar os Specs Dessa Forma

**Requisitos são o "o quê"** — eles declaram o que o sistema deve fazer sem especificar a implementação.

**Cenários são o "quando"** — eles fornecem exemplos concretos que podem ser verificados. Cenários bons:
- São testáveis (você pode escrever um teste automatizado para eles)
- Cobrem tanto o caminho feliz quanto casos de borda
- Usam Given/When/Then ou formato estruturado similar

**Palavras-chave da RFC 2119** (SHALL, MUST, SHOULD, MAY) comunicam a intenção:
- **MUST/SHALL** — requisito absoluto
- **SHOULD** — recomendado, mas exceções existem
- **MAY** — opcional

### O Que É (e Não É) um Spec

Um spec é um **contrato de comportamento**, não um plano de implementação.

Bom conteúdo para spec:
- Comportamento observável no qual usuários ou sistemas downstream confiam
- Entradas, saídas e condições de erro
- Restrições externas (segurança, privacidade, confiabilidade, compatibilidade)
- Cenários que podem ser testados ou validados explicitamente

Evite em specs:
- Nomes de classes/funções internas
- Escolhas de bibliotecas ou frameworks
- Detalhes de implementação passo a passo
- Planos de execução detalhados (esses pertencem a `design.md` ou `tasks.md`)

Teste rápido:
- Se a implementação pode mudar sem alterar o comportamento visível externamente, provavelmente não pertence ao spec.

### Mantenha Leve: Rigor Progressivo

O OpenSpec visa evitar a burocracia. Use o nível mais leve que ainda torne a alteração verificável.

**Spec leve (padrão):**
- Requisitos curtos, focados primeiro no comportamento
- Escopo e não-objetivos claros
- Algumas verificações de aceitação concretas

**Spec completo (para riscos maiores):**
- Alterações entre equipes ou entre repositórios
- Alterações de API/contrato, migrações, preocupações com segurança/privacidade
- Alterações onde a ambiguidade pode causar retrabalho caro

A maioria das alterações deve permanecer no modo Lite.

### Colaboração Humana + Agente

Em muitas equipes, humanos exploram e agentes redigem artefatos. O ciclo pretendido é:

1. O humano fornece a intenção, o contexto e as restrições.
2. O agente converte isso em requisitos e cenários focados primeiro no comportamento.
3. O agente mantém os detalhes de implementação em `design.md` e `tasks.md`, não em `spec.md`.
4. A validação confirma a estrutura e a clareza antes da implementação.

Isso mantém os specs legíveis para humanos e consistentes para agentes.

## Changes

Uma change é uma modificação proposta para o seu sistema, empacotada como uma pasta com tudo o que é necessário para entendê-la e implementá-la.

### Estrutura de Change

```
openspec/changes/add-dark-mode/
├── proposal.md           # Por quê e o quê
├── design.md             # Como (abordagem técnica)
├── tasks.md              # Lista de verificação de implementação
├── .openspec.yaml        # Metadados da change (opcional): schema, criado, skip_specs
└── specs/                # Delta specs
    └── ui/
        └── spec.md       # O que está mudando em ui/spec.md
```

Cada change é autossuficiente. Ela tem:
- **Artefatos** — documentos que capturam a intenção, o design e as tarefas
- **Delta specs** — especificações do que está sendo adicionado, modificado ou removido
- **Metadados** — configuração opcional para essa change específica

### Por Que as Changes São Pastas

Empacotar uma change como uma pasta tem vários benefícios:

1. **Tudo junto.** Proposta, design, tarefas e specs ficam em um só lugar. Sem necessidade de procurar em locais diferentes.

2. **Trabalho paralelo.** Várias changes podem existir simultaneamente sem conflitos. Trabalhe em `add-dark-mode` enquanto `fix-auth-bug` também está em andamento.

3. **Histórico limpo.** Quando arquivadas, as changes são movidas para `changes/archive/` com todo o seu contexto preservado. Você pode olhar para trás e entender não apenas o que mudou, mas o porquê.

4. **Fácil de revisar.** Uma pasta de change é fácil de revisar — abra-a, leia a proposta, verifique o design, veja os deltas dos specs.

## Artefatos

Artefatos são os documentos dentro de uma change que orientam o trabalho.

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

A proposta captura a **intenção**, o **escopo** e a **abordagem** em um nível alto.

```markdown
# Proposta: Adicionar Modo Escuro

## Intenção
Os usuários solicitaram uma opção de modo escuro para reduzir o cansaço visual durante o uso noturno e corresponder às preferências do sistema.

## Escopo
Dentro do escopo:
- Alternância de tema nas configurações
- Detecção de preferência do sistema
- Persistir preferência no localStorage

Fora do escopo:
- Temas de cores personalizados (trabalho futuro)
- Sobrescritas de tema por página

## Abordagem
Use propriedades personalizadas CSS para temática com um contexto React para gerenciamento de estado. Detecte a preferência do sistema no primeiro carregamento, permita substituição manual.
```

**Quando atualizar a proposta:**
- Alterações de escopo (redução ou expansão)
- A intenção se esclarece (melhor compreensão do problema)
- A abordagem muda fundamentalmente

#### Specs (delta specs na pasta `specs/`)

Delta specs descrevem **o que está mudando** em relação aos specs atuais. Veja [Delta Specs](#delta-specs) abaixo.

#### Design (`design.md`)

O design captura a **abordagem técnica** e as **decisões de arquitetura**.

````markdown
# Design: Adicionar Modo Escuro

## Abordagem Técnica
O estado do tema é gerenciado via Context do React para evitar prop drilling.
Propriedades personalizadas CSS permitem a troca em tempo de execução sem alternância de classes.

## Decisões de Arquitetura

### Decisão: Context ao invés de Redux
Usando o Context do React para o estado do tema porque:
- Estado binário simples (claro/escuro)
- Sem transições de estado complexas
- Evita adicionar a dependência do Redux

### Decisão: Propriedades Personalizadas CSS
Usando variáveis CSS ao invés de CSS-in-JS porque:
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
CSS Variables (applied to :root)
```

## Alterações de Arquivos
- `src/contexts/ThemeContext.tsx` (novo)
- `src/components/ThemeToggle.tsx` (novo)
- `src/styles/globals.css` (modificado)
````

**Quando atualizar o design:**
- A implementação revela que a abordagem não funcionará
- Solução melhor descoberta
- Dependências ou restrições mudam

#### Tarefas (`tasks.md`)

Tarefas são a **lista de verificação de implementação** — passos concretos com caixas de seleção.

```markdown
# Tarefas

## 1. Infraestrutura do Tema
- [ ] 1.1 Criar ThemeContext com estado claro/escuro
- [ ] 1.2 Adicionar propriedades personalizadas CSS para cores
- [ ] 1.3 Implementar persistência no localStorage
- [ ] 1.4 Adicionar detecção de preferência do sistema

## 2. Componentes de Interface
- [ ] 2.1 Criar componente ThemeToggle
- [ ] 2.2 Adicionar alternância à página de configurações
- [ ] 2.3 Atualizar o Header para incluir alternância rápida

## 3. Estilização
- [ ] 3.1 Definir paleta de cores do tema escuro
- [ ] 3.2 Atualizar componentes para usar variáveis CSS
- [ ] 3.3 Testar taxas de contraste para acessibilidade
```

**Melhores práticas para tarefas:**
- Agrupe tarefas relacionadas sob títulos
- Use numeração hierárquica (1.1, 1.2, etc.)
- Mantenha as tarefas pequenas o suficiente para serem concluídas em uma sessão
- Marque as tarefas como concluídas à medida que você as completa

## Delta Specs

Delta specs são o conceito-chave que faz o OpenSpec funcionar para desenvolvimento brownfield (desenvolvimento em sistemas legados). Eles descrevem **o que está mudando** ao invés de reescrever o spec inteiro.

### O Formato

```markdown
# Delta para Autenticação

## REQUISITOS ADICIONADOS

### Requisito: Autenticação de Dois Fatores
O sistema DEVE suportar autenticação de dois fatores baseada em TOTP.

#### Cenário: Inscrição em 2FA
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup
- AND the user must verify with a code before activation

#### Cenário: Login com 2FA
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented
- AND login completes only after valid OTP

## REQUISITOS MODIFICADOS

### Requisito: Expiração de Sessão
O sistema DEVE expirar sessões após 15 minutos de inatividade.
(Anteriormente: 30 minutos)

#### Cenário: Tempo limite de inatividade
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REQUISITOS REMOVIDOS

### Requisito: Lembrar de Mim
(Descontinuado em favor da 2FA. Os usuários devem se reautenticar a cada sessão.)
```

### Seções de Delta

| Seção | Significado | O que Acontece ao Arquivar |
|---------|---------|------------------------|
| `## ADDED Requirements` | Novo comportamento | Adicionado ao spec principal |
| `## MODIFIED Requirements` | Comportamento alterado | Substitui o requisito existente |
| `## REMOVED Requirements` | Comportamento descontinuado | Excluído do spec principal |

### Por Que Deltas ao Invés de Specs Completos

**Clareza.** Um delta mostra exatamente o que está mudando. Ao ler um spec completo, você teria que fazer o diff mentalmente contra a versão atual.

**Evitação de conflitos.** Duas changes podem modificar o mesmo arquivo de spec sem conflitos, desde que elas modifiquem requisitos diferentes.

**Eficiência de revisão.** Os revisores veem a alteração, não o contexto inalterado. Foco no que importa.

**Adequação para brownfield.** A maioria dos trabalhos modifica comportamento existente. Deltas tornam as modificações de primeira classe, não um pensamento posterior.

## Esquemas

Os esquemas definem os tipos de artefatos e suas dependências para um fluxo de trabalho.

### Como os Esquemas Funcionam

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Sem dependências, pode ser criado primeiro

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Precisa de proposal antes de criar

  - id: design
    generates: design.md
    requires: [proposal]      # Pode ser criado em paralelo com specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Precisa de specs e design primeiro
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

**As dependências são habilitadores, não barreiras.** Elas mostram o que é possível criar, não o que você deve criar em seguida. Você pode pular o design se não precisar dele. Você pode criar specs antes ou depois do design — ambos dependem apenas de proposal.

### Esquemas Integrados

**spec-driven** (padrão)

O fluxo de trabalho padrão para desenvolvimento orientado a especificações:

```
proposal → specs → design → tasks → implementação
```

Melhor para: Maioria dos trabalhos de funcionalidade onde você deseja concordar com as specs antes da implementação.

### Esquemas Personalizados

Crie esquemas personalizados para o fluxo de trabalho da sua equipe:

```bash
# Criar do zero
openspec schema init research-first

# Ou fazer fork de um existente
openspec schema fork spec-driven research-first
```

**Exemplo de esquema personalizado:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Faça o research primeiro

  - id: proposal
    generates: proposal.md
    requires: [research]   # proposal informado por research

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Pular specs/design, ir direto para tasks
```

Consulte [Personalização](customization.md) para obter detalhes completos sobre como criar e usar esquemas personalizados.

## Arquivar

O arquivamento completa uma alteração mesclando suas specs delta nas specs principais e preservando a alteração para o histórico.

### O que Acontece Quando Você Arquiva

```
Antes do arquivamento:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │ mesclar
        ├── design.md                │
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

1. **Mesclar deltas.** Cada seção de spec delta (ADDED/MODIFIED/REMOVED) é aplicada à spec principal correspondente.

2. **Mover para o arquivamento.** A pasta da alteração é movida para `changes/archive/` com um prefixo de data para ordenação cronológica.

3. **Preservar contexto.** Todos os artefatos permanecem intactos no arquivamento. Você pode sempre consultar o histórico para entender por que uma alteração foi feita.

### Por que o Arquivamento é Importante

**Estado limpo.** Alterações ativas (`changes/`) mostram apenas trabalho em andamento. O trabalho concluído é movido para fora do caminho.

**Trilha de auditoria.** O arquivamento preserva o contexto completo de cada alteração — não apenas o que mudou, mas o proposal explicando o porquê, o design explicando como e as tasks mostrando o trabalho realizado.

**Evolução das specs.** As specs crescem organicamente à medida que as alterações são arquivadas. Cada arquivamento mescla seus deltas, construindo uma especificação abrangente ao longo do tempo.

## Como Tudo se Conecta

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FLUXO DO OPENSPEC                               │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. INICIAR    │  /opsx:propose (núcleo) ou /opsx:new (expandido)       │
│   │     ALTERAÇÃO  │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CRIAR      │  /opsx:ff ou /opsx:continue (fluxo expandido)          │
│   │     ARTEFATOS  │  Cria proposal → specs → design → tasks                 │
│   │                │  (baseado nas dependências do schema)                   │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENTAR│  /opsx:apply                                            │
│   │     TASKS      │  Trabalhar nas tasks, marcando-as como concluídas       │
│   │                │◄──── Atualizar artefatos conforme você aprende          │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFICAR  │  /opsx:verify (opcional)                                │
│   │     TRABALHO   │  Verificar se a implementação corresponde às specs       │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARQUIVAR   │────►│  Specs delta são mescladas nas specs principais │    │
│   │     ALTERAÇÃO  │     │  Pasta de alteração é movida para archive/      │    │
│   └────────────────┘     │  Specs agora são a fonte de verdade atualizada  │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**O ciclo virtuoso:**

1. As specs descrevem o comportamento atual
2. As alterações propõem modificações (como deltas)
3. A implementação torna as alterações reais
4. O arquivamento mescla os deltas nas specs
5. As specs agora descrevem o novo comportamento
6. A próxima alteração se baseia nas specs atualizadas

## Glossário

| Termo | Definição |
|-------|-----------|
| **Artifact** | Um documento dentro de uma alteração (proposal, design, tasks ou specs delta) |
| **Archive** | O processo de concluir uma alteração e mesclar seus deltas nas specs principais |
| **Change** | Uma modificação proposta para o sistema, empacotada como uma pasta com artefatos |
| **Delta spec** | Uma spec que descreve alterações (ADDED/MODIFIED/REMOVED) em relação às specs atuais |
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