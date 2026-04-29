# Conceitos

Este guia explica as ideias centrais por trás do OpenSpec e como elas se conectam. Para uso prático, consulte [Primeiros Passos](getting-started.md) e [Fluxos de Trabalho](workflows.md).

## Filosofia

O OpenSpec é construído em torno de quatro princípios:

```
fluido, não rígido         — sem portões de fase, trabalhe no que faz sentido
iterativo, não cascata     — aprenda enquanto constrói, refine ao longo do caminho
fácil, não complexo        — configuração leve, cerimônia mínima
primeiro para terreno existente — funciona com bases de código existentes, não apenas com projetos novos
```

### Por Que Esses Princípios São Importantes

**Fluido, não rígido.** Sistemas de especificação tradicionais o prendem em fases: primeiro você planeja, depois implementa, e pronto. O OpenSpec é mais flexível — você pode criar artefatos em qualquer ordem que faça sentido para o seu trabalho.

**Iterativo, não cascata.** Requisitos mudam. O entendimento se aprofunda. O que parecia uma boa abordagem no início pode não se sustentar depois que você vê a base de código. O OpenSpec abraça essa realidade.

**Fácil, não complexo.** Alguns frameworks de especificação exigem configuração extensa, formatos rígidos ou processos pesados. O OpenSpec não atrapalha seu trabalho. Inicialize em segundos, comece a trabalhar imediatamente, personalize apenas se precisar.

**Primeiro para terreno existente.** A maior parte do trabalho de software não é construir do zero — é modificar sistemas existentes. A abordagem baseada em deltas do OpenSpec facilita a especificação de mudanças em comportamentos existentes, não apenas a descrição de sistemas novos.

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
│   │  Como seu sistema   │ merge│  Cada change = uma pasta      │   │
│   │  funciona atualmente│      │  Contém artefatos + deltas    │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** são a fonte da verdade — descrevem como seu sistema se comporta atualmente.

**Changes** são modificações propostas — elas ficam em pastas separadas até que você esteja pronto para mesclá-las.

Essa separação é fundamental. Você pode trabalhar em várias mudanças em paralelo sem conflitos. Você pode revisar uma mudança antes que ela afete as specs principais. E quando você arquiva uma mudança, seus deltas são mesclados de forma limpa na fonte da verdade.

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
    └── spec.md           # Comportamento e temas da UI
```

Organize as specs por domínio — agrupamentos lógicos que façam sentido para o seu sistema. Padrões comuns:

- **Por área de funcionalidade**: `auth/`, `payments/`, `search/`
- **Por componente**: `api/`, `frontend/`, `workers/`
- **Por contexto limitado**: `ordering/`, `fulfillment/`, `inventory/`

### Formato da Spec

Uma spec contém requisitos, e cada requisito tem cenários:

```markdown
# Especificação de Autenticação

## Propósito
Autenticação e gerenciamento de sessões para a aplicação.

## Requisitos

### Requisito: Autenticação de Usuário
O sistema DEVERÁ emitir um token JWT após login bem-sucedido.

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

### Requisito: Expiração de Sessão
O sistema DEVE expirar sessões após 30 minutos de inatividade.

#### Cenário: Tempo limite por inatividade
- DADO uma sessão autenticada
- QUANDO 30 minutos passam sem atividade
- ENTÃO a sessão é invalidada
- E o usuário deve se re-autenticar
```

**Elementos-chave:**

| Elemento | Propósito |
|---------|---------|
| `## Propósito` | Descrição de alto nível do domínio desta spec |
| `### Requisito:` | Um comportamento específico que o sistema deve ter |
| `#### Cenário:` | Um exemplo concreto do requisito em ação |
| SHALL/MUST/SHOULD | Palavras-chave da RFC 2119 que indicam a força do requisito |

### Por Que Estruturar as Specs Dessa Forma

**Requisitos são o "o quê"** — eles afirmam o que o sistema deve fazer sem especificar a implementação.

**Cenários são o "quando"** — eles fornecem exemplos concretos que podem ser verificados. Bons cenários:
- São testáveis (você poderia escrever um teste automatizado para eles)
- Cobrem tanto o caminho feliz quanto os casos extremos
- Usam o formato Dado/Quando/Então ou um formato estruturado semelhante

**Palavras-chave da RFC 2119** (SHALL, MUST, SHOULD, MAY) comunicam a intenção:
- **MUST/SHALL** — requisito absoluto
- **SHOULD** — recomendado, mas existem exceções
- **MAY** — opcional

### O Que Uma Spec É (e Não É)

Uma spec é um **contrato de comportamento**, não um plano de implementação.

Bom conteúdo de spec:
- Comportamento observável que usuários ou sistemas dependentes confiam
- Entradas, saídas e condições de erro
- Restrições externas (segurança, privacidade, confiabilidade, compatibilidade)
- Cenários que podem ser testados ou validados explicitamente

Evite nas specs:
- Nomes internos de classes/funções
- Escolhas de bibliotecas ou frameworks
- Detalhes de implementação passo a passo
- Planos de execução detalhados (esses pertencem a `design.md` ou `tasks.md`)

Teste rápido:
- Se a implementação pode mudar sem alterar o comportamento visível externamente, provavelmente não pertence à spec.

### Mantenha Leve: Rigor Progressivo

O OpenSpec visa evitar a burocracia. Use o nível mais leve que ainda torne a mudança verificável.

**Spec leve (padrão):**
- Requisitos curtos focados no comportamento
- Escopo e não-objetivos claros
- Alguns verificações de aceitação concretas

**Spec completa (para maior risco):**
- Mudanças entre equipes ou repositórios
- Mudanças em API/contrato, migrações, preocupações de segurança/privacidade
- Mudanças onde a ambiguidade provavelmente causará retrabalho caro

A maioria das mudanças deve permanecer no modo Leve.

### Colaboração Humano + Agente

Em muitas equipes, humanos exploram e agentes elaboram artefatos. O ciclo pretendido é:

1. O humano fornece intenção, contexto e restrições.
2. O agente converte isso em requisitos focados no comportamento e cenários.
3. O agente mantém detalhes de implementação em `design.md` e `tasks.md`, não em `spec.md`.
4. A validação confirma a estrutura e clareza antes da implementação.

Isso mantém as specs legíveis para humanos e consistentes para agentes.

## Changes

Uma change é uma modificação proposta para o seu sistema, empacotada como uma pasta com tudo o que é necessário para entendê-la e implementá-la.

### Estrutura da Change

```
openspec/changes/add-dark-mode/
├── proposal.md           # Por quê e o quê
├── design.md             # Como (abordagem técnica)
├── tasks.md              # Lista de verificação da implementação
├── .openspec.yaml        # Metadados da change (opcional)
└── specs/                # Specs delta
    └── ui/
        └── spec.md       # O que está mudando em ui/spec.md
```

Cada change é autocontida. Ela tem:
- **Artefatos** — documentos que capturam intenção, design e tarefas
- **Specs delta** — especificações do que está sendo adicionado, modificado ou removido
- **Metadados** — configuração opcional para esta change específica

### Por Que Changes São Pastas

Empacotar uma change como uma pasta tem vários benefícios:

1. **Tudo junto.** Proposta, design, tarefas e specs ficam em um só lugar. Sem precisar procurar em locais diferentes.

2. **Trabalho paralelo.** Múltiplas changes podem existir simultaneamente sem conflitos. Trabalhe em `add-dark-mode` enquanto `fix-auth-bug` também está em andamento.

3. **Histórico limpo.** Quando arquivadas, as changes são movidas para `changes/archive/` com seu contexto completo preservado. Você pode olhar para trás e entender não apenas o que mudou, mas por quê.

4. **Amigável para revisão.** Uma pasta de change é fácil de revisar — abra-a, leia a proposta, verifique o design, veja os deltas das specs.

## Artefatos

Artefatos são os documentos dentro de uma change que orientam o trabalho.

### O Fluxo dos Artefatos

```
proposta ──────► specs ──────► design ──────► tarefas ──────► implementar
    │               │             │              │
   por quê        o quê          como         passos
 + escopo        muda         abordagem     a tomar
```

Os artefatos se constroem uns sobre os outros. Cada artefato fornece contexto para o próximo.

### Tipos de Artefatos

#### Proposta (`proposal.md`)

A proposta captura **intenção**, **escopo** e **abordagem** em alto nível.

```markdown
# Proposta: Adicionar Modo Escuro

## Intenção
Usuários solicitaram uma opção de modo escuro para reduzir a fadiga ocular
durante o uso noturno e corresponder às preferências do sistema.

## Escopo
No escopo:
- Alternância de tema nas configurações
- Detecção de preferência do sistema
- Persistir preferência no localStorage

Fora do escopo:
- Temas de cores personalizados (trabalho futuro)
- Substituições de tema por página

## Abordagem
Usar propriedades CSS personalizadas para theming com um contexto React
para gerenciamento de estado. Detectar a preferência do sistema no primeiro carregamento,
permitir substituição manual.
```

**Quando atualizar a proposta:**
- O escopo muda (reduzindo ou expandindo)
- A intenção se esclarece (melhor compreensão do problema)
- A abordagem muda fundamentalmente

#### Specs (specs delta em `specs/`)

As specs delta descrevem **o que está mudando** em relação às specs atuais. Veja [Specs Delta](#specs-delta) abaixo.

#### Design (`design.md`)

O design captura a **abordagem técnica** e **decisões de arquitetura**.

````markdown
# Design: Adicionar Modo Escuro

## Abordagem Técnica
Estado do tema gerenciado via React Context para evitar prop drilling.
Propriedades CSS personalizadas permitem alternância em tempo de execução sem alternância de classes.

## Decisões de Arquitetura

### Decisão: Context sobre Redux
Usando React Context para o estado do tema porque:
- Estado binário simples (claro/escuro)
- Sem transições complexas de estado
- Evita adicionar dependência do Redux

### Decisão: Propriedades Personalizadas CSS
Usando variáveis CSS em vez de CSS-in-JS porque:
- Funciona com a folha de estilo existente
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

## Alterações nos Arquivos
- `src/contexts/ThemeContext.tsx` (novo)
- `src/components/ThemeToggle.tsx` (novo)
- `src/styles/globals.css` (modificado)
````

**Quando atualizar o design:**
- A implementação revela que a abordagem não funcionará
- Uma solução melhor for descoberta
- Dependências ou restrições mudam

#### Tarefas (`tasks.md`)

Tarefas são o **checklist de implementação** — passos concretos com caixas de seleção.

```markdown
# Tarefas

## 1. Infraestrutura do Tema
- [ ] 1.1 Criar ThemeContext com estado claro/escuro
- [ ] 1.2 Adicionar propriedades CSS personalizadas para cores
- [ ] 1.3 Implementar persistência no localStorage
- [ ] 1.4 Adicionar detecção de preferência do sistema

## 2. Componentes da Interface
- [ ] 2.1 Criar componente ThemeToggle
- [ ] 2.2 Adicionar alternador na página de configurações
- [ ] 2.3 Atualizar Header para incluir alternador rápido

## 3. Estilização
- [ ] 3.1 Definir paleta de cores do tema escuro
- [ ] 3.2 Atualizar componentes para usar variáveis CSS
- [ ] 3.3 Testar proporções de contraste para acessibilidade
```

**Melhores práticas para tarefas:**
- Agrupe tarefas relacionadas sob títulos
- Use numeração hierárquica (1.1, 1.2, etc.)
- Mantenha tarefas pequenas o suficiente para serem concluídas em uma sessão
- Marque as tarefas à medida que as conclui

## Especificações Delta

As especificações delta são o conceito-chave que faz o OpenSpec funcionar para desenvolvimento em terreno existente. Elas descrevem **o que está mudando** em vez de reescrever toda a especificação.

### O Formato

```markdown
# Delta para Autenticação

## Requisitos ADICIONADOS

### Requisito: Autenticação de Dois Fatores
O sistema DEVE suportar autenticação de dois fatores baseada em TOTP.

#### Cenário: Inscrição em 2FA
- DADO um usuário sem 2FA habilitado
- QUANDO o usuário habilita 2FA nas configurações
- ENTÃO um código QR é exibido para configuração do aplicativo autenticador
- E o usuário deve verificar com um código antes da ativação

#### Cenário: Login com 2FA
- DADO um usuário com 2FA habilitado
- QUANDO o usuário submete credenciais válidas
- ENTÃO um desafio OTP é apresentado
- E o login é concluído apenas após OTP válido

## Requisitos MODIFICADOS

### Requisito: Expiração de Sessão
O sistema DEVE expirar sessões após 15 minutos de inatividade.
(Previamente: 30 minutos)

#### Cenário: Tempo limite por inatividade
- DADO uma sessão autenticada
- QUANDO 15 minutos passam sem atividade
- ENTÃO a sessão é invalidada

## Requisitos REMOVIDOS

### Requisito: Lembrar-me
(Descontinuado em favor de 2FA. Os usuários devem se reautenticar a cada sessão.)
```

### Seções Delta

| Seção | Significado | O que Acontece no Arquivamento |
|---------|---------|------------------------|
| `## Requisitos ADICIONADOS` | Novo comportamento | Anexado à especificação principal |
| `## Requisitos MODIFICADOS` | Comportamento alterado | Substitui o requisito existente |
| `## Requisitos REMOVIDOS` | Comportamento descontinuado | Excluído da especificação principal |

### Por que Deltas em vez de Especificações Completas

**Clareza.** Um delta mostra exatamente o que está mudando. Ao ler uma especificação completa, você teria que fazer um diff mental contra a versão atual.

**Evita conflitos.** Duas alterações podem tocar o mesmo arquivo de especificação sem conflito, desde que modifiquem requisitos diferentes.

**Eficiência na revisão.** Os revisores veem a alteração, não o contexto inalterado. Foque no que importa.

**Adequação a terreno existente.** A maioria do trabalho modifica comportamento existente. Deltas tornam as modificações um elemento de primeira classe, não um pensamento posterior.

## Schemas

Schemas definem os tipos de artefatos e suas dependências para um fluxo de trabalho.

### Como Schemas Funcionam

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Sem dependências, pode ser criado primeiro

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Precisa da proposta antes de criar

  - id: design
    generates: design.md
    requires: [proposal]      # Pode ser criado em paralelo com as specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Precisa tanto das specs quanto do design primeiro
```

**Artefatos formam um grafo de dependências:**

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

**Dependências são habilitadores, não portões.** Elas mostram o que é possível criar, não o que você deve criar a seguir. Você pode pular o design se não precisar dele. Você pode criar specs antes ou depois do design — ambos dependem apenas da proposta.

### Schemas Embutidos

**spec-driven** (padrão)

O fluxo de trabalho padrão para desenvolvimento orientado a especificações:

```
proposal → specs → design → tasks → implement
```

Melhor para: A maioria dos trabalhos de funcionalidade onde você quer concordar com as especificações antes da implementação.

### Schemas Personalizados

Crie schemas personalizados para o fluxo de trabalho da sua equipe:

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
    requires: []           # Faça a pesquisa primeiro

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposta informada pela pesquisa

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Pule specs/design, vá direto para tarefas
```

Veja [Personalização](customization.md) para detalhes completos sobre como criar e usar schemas personalizados.

## Arquivamento

O arquivamento completa uma alteração mesclando suas especificações delta nas especificações principais e preservando a alteração para o histórico.

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
        ├── design.md                │ merge
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
        └── 2025-01-24-add-2fa/    # Preservado para o histórico
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### O Processo de Arquivamento

1. **Mesclar deltas.** Cada seção de especificação delta (ADICIONADO/MODIFICADO/REMOVIDO) é aplicada à especificação principal correspondente.

2. **Mover para arquivo.** A pasta da alteração é movida para `changes/archive/` com um prefixo de data para ordenação cronológica.

3. **Preservar contexto.** Todos os artefatos permanecem intactos no arquivo. Você sempre pode olhar para traz para entender por que uma alteração foi feita.

### Por que o Arquivamento Importa

**Estado limpo.** Alterações ativas (`changes/`) mostram apenas trabalho em andamento. Trabalho concluído sai do caminho.

**Rastro de auditoria.** O arquivo preserva o contexto completo de cada alteração — não apenas o que mudou, mas a proposta explicando por quê, o design explicando como e as tarefas mostrando o trabalho feito.

**Evolução das especificações.** As especificações crescem organicamente à medida que as alterações são arquivadas. Cada arquivo mescla seus deltas, construindo uma especificação abrangente ao longo do tempo.

## Como Tudo se Encaixa

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FLUXO OPENSPEC                                  │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. INICIAR    │  /opsx:propose (núcleo) ou /opsx:new (expandido)        │
│   │     ALTERAÇÃO  │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CRIAR      │  /opsx:ff ou /opsx:continue (fluxo expandido)           │
│   │     ARTEFATOS  │  Cria proposal → specs → design → tasks                 │
│   │                │  (baseado nas dependências do schema)                   │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENTAR│  /opsx:apply                                            │
│   │     TAREFAS    │  Trabalhe nas tarefas, marcando-as                      │
│   │                │◄──── Atualize os artefatos à medida que aprende         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFICAR  │  /opsx:verify (opcional)                                │
│   │     TRABALHO   │  Verifique se a implementação corresponde às specs      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARQUIVAR   │────►│  Especificações delta são mescladas nas      │    │
│   │     ALTERAÇÃO  │     │  especificações principais                   │    │
│   └────────────────┘     │  Pasta da alteração é movida para archive/   │    │
│                          │  Specs agora são a fonte atualizada da verdade│    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**O ciclo virtuoso:**

1. Especificações descrevem o comportamento atual
2. Alterações propõem modificações (como deltas)
3. Implementação torna as alterações reais
4. Arquivamento mescla deltas nas especificações
5. Especificações agora descrevem o novo comportamento
6. Próxima alteração se baseia nas especificações atualizadas

## Glossário

| Termo | Definição |
|------|------------|
| **Artefato** | Um documento dentro de uma mudança (proposta, design, tarefas ou especificações delta) |
| **Arquivamento** | O processo de concluir uma mudança e mesclar suas deltas nas especificações principais |
| **Mudança** | Uma modificação proposta para o sistema, empacotada como uma pasta com artefatos |
| **Especificação delta** | Uma especificação que descreve mudanças (ADICIONADO/MODIFICADO/REMOVIDO) em relação às especificações atuais |
| **Domínio** | Um agrupamento lógico para especificações (ex.: `auth/`, `payments/`) |
| **Requisito** | Um comportamento específico que o sistema deve ter |
| **Cenário** | Um exemplo concreto de um requisito, tipicamente no formato Dado/Quando/Então |
| **Esquema** | Uma definição dos tipos de artefatos e suas dependências |
| **Especificação** | Uma especificação que descreve o comportamento do sistema, contendo requisitos e cenários |
| **Fonte da verdade** | O diretório `openspec/specs/`, contendo o comportamento atualmente acordado |

## Próximos Passos

- [Primeiros Passos](getting-started.md) - Passos práticos iniciais
- [Fluxos de Trabalho](workflows.md) - Padrões comuns e quando usar cada um
- [Comandos](commands.md) - Referência completa de comandos
- [Personalização](customization.md) - Crie esquemas personalizados e configure seu projeto