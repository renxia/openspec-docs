# Primeiros Passos

Este guia explica como o OpenSpec funciona após você ter instalado e inicializado. Para instruções de instalação, consulte o [README principal](index.md#quick-start).

## Como Funciona

O OpenSpec ajuda você e seu assistente de programação com IA a concordarem sobre o que construir antes que qualquer código seja escrito.

**Caminho rápido padrão (perfil core):**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:archive
```

**Caminho expandido (seleção de fluxo de trabalho personalizado):**

```text
/opsx:new ──► /opsx:ff ou /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

O perfil global padrão é `core`, que inclui `propose`, `explore`, `apply` e `archive`. Você pode habilitar os comandos do fluxo de trabalho expandido com `openspec config profile` e depois `openspec update`.

## O que o OpenSpec Cria

Após executar `openspec init`, seu projeto terá esta estrutura:

```
openspec/
├── specs/              # Fonte da verdade (o comportamento do seu sistema)
│   └── <domínio>/
│       └── spec.md
├── changes/            # Atualizações propostas (uma pasta por alteração)
│   └── <nome-da-alteração>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Especificações delta (o que está mudando)
│           └── <domínio>/
│               └── spec.md
└── config.yaml         # Configuração do projeto (opcional)
```

**Dois diretórios principais:**

- **`specs/`** - A fonte da verdade. Estas especificações descrevem como seu sistema se comporta atualmente. Organizadas por domínio (por exemplo, `specs/auth/`, `specs/payments/`).

- **`changes/`** - Modificações propostas. Cada alteração recebe sua própria pasta com todos os artefatos relacionados. Quando uma alteração é concluída, suas especificações são mescladas no diretório principal `specs/`.

## Entendendo os Artefatos

Cada pasta de alteração contém artefatos que guiam o trabalho:

| Artefato | Finalidade |
|----------|------------|
| `proposal.md` | O "porquê" e o "o quê" - captura a intenção, escopo e abordagem |
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

As especificações delta usam seções para indicar o tipo de alteração:

```markdown
# Delta para Auth

## Requisitos ADICIONADOS

### Requisito: Autenticação de Dois Fatores
O sistema DEVE exigir um segundo fator durante o login.

#### Cenário: OTP obrigatório
- DADO um usuário com 2FA habilitado
- QUANDO o usuário envia credenciais válidas
- ENTÃO um desafio OTP é apresentado

## Requisitos MODIFICADOS

### Requisito: Tempo Limite da Sessão
O sistema DEVE expirar sessões após 30 minutos de inatividade.
(Previamente: 60 minutos)

#### Cenário: Tempo limite por inatividade
- DADO uma sessão autenticada
- QUANDO 30 minutos passam sem atividade
- ENTÃO a sessão é invalidada

## Requisitos REMOVIDOS

### Requisito: Lembrar-me
(Descontinuado em favor do 2FA)
```

### O Que Acontece no Arquivamento

Quando você arquiva uma alteração:

1. Requisitos **ADICIONADOS** são anexados à especificação principal
2. Requisitos **MODIFICADOS** substituem a versão existente
3. Requisitos **REMOVIDOS** são deletados da especificação principal

A pasta da alteração é movida para `openspec/changes/archive/` para histórico de auditoria.

## Exemplo: Sua Primeira Alteração

Vamos percorrer a adição de um modo escuro a uma aplicação.

### 1. Iniciar a Alteração (Padrão)

```text
Você: /opsx:propose add-dark-mode

IA:   Criou openspec/changes/add-dark-mode/
      ✓ proposal.md — por que estamos fazendo isso, o que está mudando
      ✓ specs/       — requisitos e cenários
      ✓ design.md    — abordagem técnica
      ✓ tasks.md     — lista de verificação de implementação
      Pronto para implementação!
```

Se você habilitou o perfil de fluxo de trabalho expandido, também pode fazer isso em duas etapas: `/opsx:new` e depois `/opsx:ff` (ou `/opsx:continue` incrementalmente).

### 2. O Que É Criado

**proposal.md** - Captura a intenção:

```markdown
# Proposta: Adicionar Modo Escuro

## Intenção
Usuários solicitaram uma opção de modo escuro para reduzir a fadiga ocular
durante o uso noturno.

## Escopo
- Adicionar alternância de tema nas configurações
- Suportar detecção de preferência do sistema
- Persistir preferência no localStorage

## Abordagem
Usar propriedades CSS personalizadas para temas com um contexto React
para gerenciamento de estado.
```

**specs/ui/spec.md** - Delta mostrando novos requisitos:

```markdown
# Delta para UI

## Requisitos ADICIONADOS

### Requisito: Seleção de Tema
O sistema DEVE permitir que os usuários escolham entre temas claro e escuro.

#### Cenário: Alternância manual
- DADO um usuário em qualquer página
- QUANDO o usuário clica na alternância de tema
- ENTÃO o tema muda imediatamente
- E a preferência persiste entre sessões

#### Cenário: Preferência do sistema
- DADO um usuário sem preferência salva
- QUANDO a aplicação carrega
- ENTÃO o esquema de cores preferido do sistema é usado
```

**tasks.md** - Lista de verificação de implementação:

```markdown
# Tarefas

## 1. Infraestrutura de Tema
- [ ] 1.1 Criar ThemeContext com estado claro/escuro
- [ ] 1.2 Adicionar propriedades CSS personalizadas para cores
- [ ] 1.3 Implementar persistência no localStorage

## 2. Componentes de UI
- [ ] 2.1 Criar componente ThemeToggle
- [ ] 2.2 Adicionar alternância na página de configurações
- [ ] 2.3 Atualizar Header para incluir alternância rápida

## 3. Estilização
- [ ] 3.1 Definir paleta de cores do tema escuro
- [ ] 3.2 Atualizar componentes para usar variáveis CSS
```

### 3. Implementar

```
Você: /opsx:apply

IA:   Processando tarefas...
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

IA:   Arquivando add-dark-mode...
      ✓ Especificações mescladas em openspec/specs/ui/spec.md
      ✓ Movido para openspec/changes/archive/2025-01-24-add-dark-mode/
      Concluído! Próxima funcionalidade.
```

Suas especificações delta agora fazem parte das especificações principais, documentando como seu sistema funciona.

## Verificação e Revisão

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

- [Fluxos de Trabalho](workflows.md) - Padrões comuns e quando usar cada comando
- [Comandos](commands.md) - Referência completa para todos os comandos de barra
- [Conceitos](concepts.md) - Compreensão mais profunda de especificações, alterações e esquemas
- [Personalização](customization.md) - Faça o OpenSpec funcionar do seu jeito