# Conceitos

Este guia explica as ideias centrais de OpenSpec e como elas se encaixam. Para uso prático, consulte [Getting Started](getting-started.md) e [Workflows](workflows.md).

## Filosofia

OpenSpec é construído em torno de quatro princípios:

```
fluido não rígido         — sem portões de fase (phase gates), trabalhe no que faz sentido
iterativo não cascata — aprenda enquanto constrói, refine à medida que avança
fácil não complexo        — configuração leve, cerimônia mínima
brownfield-first        — funciona com bases de código existentes, e não apenas com projetos novos (greenfield)
```

### Por Que Esses Princípios São Importantes

**Fluido não rígido.** Os sistemas tradicionais de especificação o prendem em fases: primeiro você planeja, depois implementa, e então termina. OpenSpec é mais flexível — você pode criar artefatos em qualquer ordem que faça sentido para o seu trabalho.

**Iterativo não cascata (waterfall).** Requisitos mudam. A compreensão se aprofunda. O que parecia ser uma boa abordagem no início pode não se sustentar depois de ver a base de código. OpenSpec abraça essa realidade.

**Fácil não complexo.** Alguns frameworks de especificação exigem configuração extensa, formatos rígidos ou processos pesados. OpenSpec fica fora do caminho. Inicialize em segundos, comece a trabalhar imediatamente e personalize apenas se precisar.

**Brownfield-first.** A maior parte do trabalho de software não é construir do zero — é modificar sistemas existentes. A abordagem baseada em delta (delta-based) do OpenSpec facilita a especificação de mudanças no comportamento existente, e não apenas a descrição de novos sistemas.

## A Visão Geral

OpenSpec organiza seu trabalho em duas áreas principais:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Fonte da verdade   │◄─────│  Modificações propostas       │   │
│   │  Como seu sistema   │ merge│  Cada mudança = uma pasta     │   │
│   │  funciona          │      │  Contém artefatos + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** (Especificações) são a fonte da verdade — elas descrevem como seu sistema funciona atualmente.

**Changes** (Mudanças) são modificações propostas — elas residem em pastas separadas até que você esteja pronto para mesclá-las.

Essa separação é fundamental. Você pode trabalhar em múltiplas mudanças em paralelo sem conflitos. Você pode revisar uma mudança antes que ela afete as specs principais. E quando você arquiva uma mudança, seus deltas são mesclados de forma limpa na fonte da verdade.

## Specs (Especificações)

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

Organize as specs por domínio — agrupamentos lógicos que fazem sentido para o seu sistema. Padrões comuns:

- **Por área de funcionalidade**: `auth/`, `payments/`, `search/`
- **Por componente**: `api/`, `frontend/`, `workers/`
- **Por contexto delimitado**: `ordering/`, `fulfillment/`, `inventory/`

### Formato da Spec

Uma spec contém requisitos, e cada requisito tem cenários:

```markdown
# Especificação de Autenticação

## Propósito
Gerenciamento de autenticação e sessão para a aplicação.

## Requisitos

### Requisito: Autenticação do Usuário
O sistema DEVE emitir um token JWT após o login bem-sucedido.

#### Cenário: Credenciais válidas
- DADO um usuário com credenciais válidas
- QUANDO o usuário envia o formulário de login
- ENTÃO um token JWT é retornado
- E o usuário é redirecionado para o painel

#### Cenário: Credenciais inválidas
- DADO credenciais inválidas
- QUANDO o usuário envia o formulário de login
- ENTÃO uma mensagem de erro é exibida
- E nenhum token é emitido

### Requisito: Expiração da Sessão
O sistema DEVE expirar sessões após 30 minutos de inatividade.

#### Cenário: Tempo limite de inatividade
- DADO uma sessão autenticada
- QUANDO passam 30 minutos sem atividade
- ENTÃO a sessão é invalidada
- E o usuário deve se reautenticar
```

**Elementos chave:**

| Elemento | Propósito |
|---------|---------|
| `## Propósito` | Descrição de alto nível do domínio desta spec |
| `### Requisito:` | Um comportamento específico que o sistema deve ter |
| `#### Cenário:` | Um exemplo concreto do requisito em ação |
| SHALL/MUST/SHOULD | Palavras-chave RFC 2119 indicando a força do requisito |

### Por Que Estruturar as Specs Desta Forma

**Requisitos são o "o quê"** — eles declaram o que o sistema deve fazer sem especificar a implementação.

**Cenários são o "quando"** — eles fornecem exemplos concretos que podem ser verificados. Bons cenários:
- São testáveis (você poderia escrever um teste automatizado para eles)
- Cobrem tanto o caminho feliz quanto os casos de borda
- Usam Given/When/Then ou formato estruturado similar

**Palavras-chave RFC 2119** (SHALL, MUST, SHOULD, MAY) comunicam a intenção:
- **MUST/SHALL** — requisito absoluto
- **SHOULD** — recomendado, mas exceções existem
- **MAY** — opcional

### O Que É Uma Spec (e O Que Não É)

Uma spec é um **contrato de comportamento**, não um plano de implementação.

Conteúdo bom para a spec:
- Comportamento observável no qual usuários ou sistemas downstream dependem
- Entradas, saídas e condições de erro
- Restrições externas (segurança, privacidade, confiabilidade, compatibilidade)
- Cenários que podem ser testados ou explicitamente validados

Evite nas specs:
- Nomes internos de classes/funções
- Escolhas de biblioteca ou framework
- Detalhes de implementação passo a passo
- Planos de execução detalhados (estes pertencem a `design.md` ou `tasks.md`)

Teste rápido:
- Se a implementação pode mudar sem alterar o comportamento visível externamente, ela provavelmente não pertence à spec.

### Mantenha Leve: Rigor Progressivo

OpenSpec visa evitar burocracia. Use o nível mais leve que ainda torne a mudança verificável.

**Lite spec (padrão):**
- Requisitos curtos e focados no comportamento
- Escopo claro e não-metas
- Alguns cheques de aceitação concretos

**Full spec (para maior risco):**
- Mudanças entre equipes ou repositórios
- Alterações de API/contrato, migrações, preocupações de segurança/privacidade
- Mudanças onde a ambiguidade é provável causar retrabalho caro

A maioria das mudanças deve permanecer no modo Lite.

### Colaboração Humano + Agente

Em muitas equipes, humanos exploram e agentes redigem artefatos. O loop pretendido é:

1. O humano fornece intenção, contexto e restrições.
2. O agente converte isso em requisitos e cenários focados no comportamento.
3. O agente mantém os detalhes de implementação em `design.md` e `tasks.md`, não em `spec.md`.
4. A validação confirma a estrutura e clareza antes da implementação.

Isso mantém as specs legíveis para humanos e consistentes para agentes.

## Changes (Mudanças)

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
- **Delta specs** — especificações do que está sendo adicionado, modificado ou removido
- **Metadata** — configuração opcional para esta mudança específica

### Por Que As Mudanças São Pastas

Empacotar uma mudança como uma pasta tem vários benefícios:

1. **Tudo junto.** Proposta, design, tarefas e specs residem em um só lugar. Sem ter que procurar em locais diferentes.

2. **Trabalho paralelo.** Múltiplas mudanças podem existir simultaneamente sem conflitar. Trabalhe em `add-dark-mode` enquanto `fix-auth-bug` também está em andamento.

3. **Histórico limpo.** Quando arquivadas, as mudanças movem para `changes/archive/` com seu contexto completo preservado. Você pode olhar para trás e entender não apenas o que mudou, mas por quê.

4. **Fácil de revisar.** Uma pasta de mudança é fácil de revisar — abra-a, leia a proposta, verifique o design, veja os deltas da spec.

## Artifacts (Artefatos)

Artifacts são os documentos dentro de uma mudança que guiam o trabalho.

### O Fluxo dos Artefatos

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   porquê        o quê           como         passos a seguir
 + escopo       mudanças        abordagem     para realizar
```

Os artefatos se constroem uns sobre os outros. Cada artefato fornece contexto para o próximo.

### Tipos de Artefatos

#### Proposal (`proposal.md`)

A proposta captura **intenção**, **escopo** e **abordagem** em um nível alto.

```markdown
# Proposta: Adicionar Modo Escuro

## Intenção
Os usuários solicitaram uma opção de modo escuro para reduzir a fadiga ocular
durante o uso noturno e para corresponder às preferências do sistema.

## Escopo
Em escopo:
- Alternância de tema nas configurações
- Detecção da preferência do sistema
- Persistência da preferência no localStorage

Fora do escopo:
- Temas de cores personalizados (trabalho futuro)
- Sobrescrições de tema por página

## Abordagem
Usar propriedades customizadas CSS para o teming com um contexto React
para gerenciamento de estado. Detectar a preferência do sistema no primeiro carregamento,
permitir substituição manual.
```

**Quando atualizar a proposta:**
- Mudanças no escopo (afunilamento ou expansão)
- A intenção é esclarecida (melhor compreensão do problema)
- A abordagem muda fundamentalmente

#### Specs (delta specs em `specs/`)

As delta specs descrevem **o que está mudando** em relação às specs atuais. Veja [Delta Specs](#delta-specs) abaixo.

#### Design (`design.md`)

O design captura a **abordagem técnica** e as **decisões de arquitetura**.

````markdown
# Design: Adicionar Modo Escuro

## Abordagem Técnica
Gerenciamento do estado do tema via React Context para evitar prop drilling.
Propriedades customizadas CSS permitem a troca em tempo de execução sem alternância de classes.

## Decisões de Arquitetura

### Decisão: Contexto em vez de Redux
Usar React Context para o estado do tema porque:
- Estado binário simples (claro/escuro)
- Sem transições de estado complexas
- Evita adicionar dependência do Redux

### Decisão: Propriedades Customizadas CSS
Usar variáveis CSS em vez de CSS-in-JS porque:
- Funciona com o stylesheet existente
- Nenhum overhead em tempo de execução
- Solução nativa do navegador

## Fluxo de Dados
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
Variáveis CSS (aplicadas ao :root)
```

## Alterações de Arquivos
- `src/contexts/ThemeContext.tsx` (novo)
- `src/components/ThemeToggle.tsx` (novo)
- `src/styles/globals.css` (modificado)
````

**Quando atualizar o design:**
- A implementação revela que a abordagem não funcionará
- Uma solução melhor é descoberta
- Dependências ou restrições mudam

#### Tasks (`tasks.md`)

As tarefas são o **checklist de implementação** — passos concretos com caixas de seleção.

```markdown
# Tarefas

## 1. Infraestrutura do Tema
- [ ] 1.1 Criar ThemeContext com estado claro/escuro
- [ ] 1.2 Adicionar propriedades customizadas CSS para cores
- [ ] 1.3 Implementar persistência no localStorage
- [ ] 1.4 Adicionar detecção de preferência do sistema

## 2. Componentes da UI
- [ ] 2.1 Criar componente ThemeToggle
- [ ] 2.2 Adicionar toggle na página de configurações
- [ ] 2.3 Atualizar o Header para incluir quick toggle

## 3. Estilização
- [ ] 3.1 Definir paleta de cores do tema escuro
- [ ] 3.2 Atualizar componentes para usar variáveis CSS
- [ ] 3.3 Testar razões de contraste para acessibilidade
```

**Melhores práticas de tarefas:**
- Agrupar tarefas relacionadas sob cabeçalhos
- Usar numeração hierárquica (1.1, 1.2, etc.)
- Manter as tarefas pequenas o suficiente para serem concluídas em uma sessão
- Marcar as tarefas como concluídas à medida que você avança

## Delta Specs (Especificações Delta)

Delta specs é o conceito chave que faz o OpenSpec funcionar para desenvolvimento brownfield. Elas descrevem **o que está mudando** em vez de recontar a especificação inteira.

### O Formato

```markdown
# Delta para Auth

## Requisitos ADICIONADOS

### Requisito: Autenticação de Dois Fatores (2FA)
O sistema DEVE suportar autenticação de dois fatores baseada em TOTP.

#### Cenário: Inscrição 2FA
- DADO um usuário sem 2FA habilitado
- QUANDO o usuário habilita o 2FA nas configurações
- ENTÃO um código QR é exibido para configuração do aplicativo autenticador
- E o usuário deve verificar com um código antes da ativação

#### Cenário: Login com 2FA
- DADO um usuário com 2FA habilitado
- QUANDO o usuário envia credenciais válidas
- ENTÃO um desafio OTP é apresentado
- E o login só é concluído após a OTP válida

## Requisitos MODIFICADOS

### Requisito: Expiração da Sessão
O sistema DEVE expirar sessões após 15 minutos de inatividade.
(Anteriormente: 30 minutos)

#### Cenário: Tempo limite de inatividade
- DADO uma sessão autenticada
- QUANDO passam 15 minutos sem atividade
- ENTÃO a sessão é invalidada

## Requisitos REMOVIDOS

### Requisito: Lembre-me (Remember Me)
(Obsoleto em favor do 2FA. Os usuários devem se reautenticar em cada sessão.)
```

### Seções Delta

| Seção | Significado | O Que Acontece ao Arquivar |
|---------|---------|------------------------|
| `## Requisitos ADICIONADOS` | Novo comportamento | Anexado à spec principal |
| `## Requisitos MODIFICADOS` | Comportamento alterado | Substitui o requisito existente |
| `## Requisitos REMOVIDOS` | Comportamento obsoleto | Excluído da spec principal |

### Por Que Deltas Em Vez de Specs Completas

**Clareza.** Um delta mostra exatamente o que está mudando. Lendo uma especificação completa, você teria que diferenciá-la mentalmente em relação à versão atual.

**Prevenção de Conflitos.** Duas mudanças podem tocar no mesmo arquivo de spec sem conflitar, desde que elas modifiquem requisitos diferentes.

**Eficiência na Revisão.** Os revisores veem a mudança, não o contexto inalterado. Concentrem-se no que é importante.

**Adequação Brownfield.** A maior parte do trabalho modifica comportamentos existentes. Deltas tornam as modificações uma classe de primeira, e não um pensamento posterior.

## Schemas

Schemas definem os tipos de artefatos e suas dependências para um fluxo de trabalho.

### Como Funcionam os Schemas

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
    requires: [specs, design] # Precisa tanto de specs quanto de design primeiro
```

**Os Artefatos formam um grafo de dependência:**

```
                    proposal
                   (nó raiz)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (requer:                  (requer:)
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (requer:
                specs, design)
```

**As dependências são habilitadoras, não portões.** Elas mostram o que é possível criar, e não o que você deve criar em seguida. Você pode pular o design se não precisar dele. É possível criar specs antes ou depois do design — ambos dependem apenas de proposal.

### Schemas Integrados (Built-in)

**spec-driven** (padrão)

O fluxo de trabalho padrão para desenvolvimento orientado por especificação:

```
proposal → specs → design → tasks → implement
```

Melhor para: A maioria dos trabalhos de funcionalidade onde você deseja concordar com as especificações antes da implementação.

### Schemas Personalizados (Custom)

Crie schemas personalizados para o fluxo de trabalho da sua equipe:

```bash
# Criar do zero
openspec schema init research-first

# Ou forcar um existente
openspec schema fork spec-driven research-first
```

**Exemplo de schema personalizado:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Faça a pesquisa primeiro

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal informado pela pesquisa

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Pula specs/design, vai direto para tarefas
```

Consulte [Customization](customization.md) para obter detalhes completos sobre como criar e usar schemas personalizados.

## Arquivamento (Archive)

O arquivamento completa uma mudança ao mesclar seus deltas de especificação nas especificações principais e preservar a mudança para o histórico.

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

1. **Mesclar deltas.** Cada seção delta de especificação (ADICIONADO/MODIFICADO/REMOVIDO) é aplicada à especificação principal correspondente.

2. **Mover para arquivo.** A pasta da mudança move-se para `changes/archive/` com um prefixo de data para ordenação cronológica.

3. **Preservar o contexto.** Todos os artefatos permanecem intactos no arquivo. Você sempre pode olhar para trás para entender por que uma mudança foi feita.

### Por Que o Arquivamento é Importante

**Estado limpo.** As mudanças ativas (`changes/`) mostram apenas o trabalho em andamento. O trabalho concluído sai do caminho.

**Rastro de auditoria (Audit trail).** O arquivo preserva o contexto completo de cada mudança — não apenas o que mudou, mas a proposta explicando o porquê, o design explicando o como e as tarefas mostrando o trabalho realizado.

**Evolução da especificação.** As especificações crescem organicamente à medida que as mudanças são arquivadas. Cada arquivo mescla seus deltas, construindo uma especificação abrangente ao longo do tempo.

## Como Tudo se Encaixa

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FLUXO OPENSPEC                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. INICIAR      │  /opsx:propose (core) ou /opsx:new (expandido)           │
│   │     MUDANÇA     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CRIAR       │  /opsx:ff ou /opsx:continue (fluxo de trabalho expandido)     │
│   │     ARTEFATOS  │  Cria proposal → specs → design → tasks              │
│   │                │  (baseado nas dependências do schema)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENTAR │  /opsx:apply                                            │
│   │     TAREFAS     │  Trabalha nas tarefas, marcando-as como concluídas      │
│   │                │◄──── Atualiza os artefatos conforme você aprende                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFICAR   │  /opsx:verify (opcional)                                │
│   │     TRABALHO    │  Verifica se a implementação corresponde às especificações │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARQUIVAR    │────►│  Os deltas de especificação são mesclados nas specs principais │    │
│   │     MUDANÇA     │     │  A pasta da mudança move-se para archive/             │    │
│   └────────────────┘     │  As Specs agora são a fonte de verdade atualizada   │    │
│                                                                              └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**O ciclo virtuoso:**

1. As Especificações descrevem o comportamento atual
2. As Mudanças propõem modificações (como deltas)
3. A Implementação torna as mudanças reais
4. O Arquivamento mescla os deltas nas especificações
5. As Especificações agora descrevem o novo comportamento
6. A Próxima mudança se baseia nas especificações atualizadas

## Glossário

| Termo | Definição |
|------|------------|
| **Artifact** | Um documento dentro de uma mudança (proposal, design, tasks ou delta specs) |
| **Archive** | O processo de concluir uma mudança e mesclar seus deltas nas especificações principais |
| **Change** | Uma modificação proposta no sistema, empacotada como uma pasta com artefatos |
| **Delta spec** | Uma especificação que descreve mudanças (ADICIONADO/MODIFICADO/REMOVIDO) em relação às especificações atuais |
| **Domain** | Um agrupamento lógico para as especificações (ex: `auth/`, `payments/`) |
| **Requirement** | Um comportamento específico que o sistema deve ter |
| **Scenario** | Um exemplo concreto de um requisito, tipicamente no formato Given/When/Then |
| **Schema** | Uma definição dos tipos de artefatos e suas dependências |
| **Spec** | Uma especificação descrevendo o comportamento do sistema, contendo requisitos e cenários |
| **Source of truth** | O diretório `openspec/specs/`, que contém o comportamento atualmente acordado |

## Próximos Passos (Next Steps)

- [Getting Started](getting-started.md) - Primeiros passos práticos
- [Workflows](workflows.md) - Padrões comuns e quando usar cada um
- [Commands](commands.md) - Referência completa de comandos
- [Customization](customization.md) - Crie schemas personalizados e configure seu projeto