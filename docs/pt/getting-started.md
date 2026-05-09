# Primeiros Passos

Este guia explica como o OpenSpec funciona após você tê-lo instalado e inicializado. Para instruções de instalação, consulte o [README principal](index.md#quick-start).

## Como Funciona

O OpenSpec ajuda você e seu assistente de codificação com IA a chegar a um acordo sobre o que construir antes que qualquer código seja escrito.

**Caminho rápido padrão (perfil core):**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

**Caminho expandido (seleção de fluxo de trabalho personalizado):**

```text
/opsx:new ──► /opsx:ff ou /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

O perfil global padrão é `core`, que inclui `propose`, `explore`, `apply`, `sync` e `archive`. Você pode habilitar os comandos do fluxo de trabalho expandido com `openspec config profile` e depois `openspec update`.

## O Que o OpenSpec Cria

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
│       └── specs/      # Specs delta (o que está mudando)
│           └── <domínio>/
│               └── spec.md
└── config.yaml         # Configuração do projeto (opcional)
```

**Dois diretórios-chave:**

- **`specs/`** - A fonte da verdade. Estas specs descrevem como seu sistema se comporta atualmente. Organizadas por domínio (ex.: `specs/auth/`, `specs/payments/`).

- **`changes/`** - Modificações propostas. Cada alteração recebe sua própria pasta com todos os artefatos relacionados. Quando uma alteração é concluída, suas specs são mescladas no diretório principal `specs/`.

## Entendendo os Artefatos

Cada pasta de alteração contém artefatos que orientam o trabalho:

| Artefato | Propósito |
|----------|-----------|
| `proposal.md` | O "porquê" e o "o quê" - captura a intenção, o escopo e a abordagem |
| `specs/` | Specs delta mostrando requisitos ADICIONADOS/MODIFICADOS/REMOVIDOS |
| `design.md` | O "como" - abordagem técnica e decisões de arquitetura |
| `tasks.md` | Lista de verificação de implementação com caixas de seleção |

**Os artefatos se constroem mutuamente:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            atualize conforme aprende
```

Você sempre pode voltar e refinar artefatos anteriores à medida que aprende mais durante a implementação.

## Como as Specs Delta Funcionam

As specs delta são o conceito-chave no OpenSpec. Elas mostram o que está mudando em relação às suas specs atuais.

### O Formato

As specs delta usam seções para indicar o tipo de alteração:

```markdown
# Delta para Auth

## Requisitos ADICIONADOS

### Requisito: Autenticação de Dois Fatores
O sistema DEVE exigir um segundo fator durante o login.

#### Cenário: OTP obrigatório
- DADO um usuário com 2FA habilitado
- QUANDO o usuário submete credenciais válidas
- ENTÃO um desafio OTP é apresentado

## Requisitos MODIFICADOS

### Requisito: Tempo Limite da Sessão
O sistema DEVE expirar sessões após 30 minutos de inatividade.
(Anteriormente: 60 minutos)

#### Cenário: Tempo limite por inatividade
- DADO uma sessão autenticada
- QUANDO 30 minutos se passam sem atividade
- ENTÃO a sessão é invalidada

## Requisitos REMOVIDOS

### Requisito: Lembrar-me
(Descontinuado em favor do 2FA)
```

### O Que Acontece no Arquivamento

Quando você arquiva uma alteração:

1. Os requisitos **ADICIONADOS** são anexados à spec principal
2. Os requisitos **MODIFICADOS** substituem a versão existente
3. Os requisitos **REMOVIDOS** são excluídos da spec principal

A pasta da alteração é movida para `openspec/changes/archive/` para histórico de auditoria.

## Exemplo: Sua Primeira Alteração

Vamos percorrer a adição do modo escuro a uma aplicação.

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

Se você habilitou o perfil de fluxo de trabalho expandido, também pode fazer isso em duas etapas: `/opsx:new` e depois `/opsx:ff` (ou `/opsx:continue` incrementalmente).

### 2. O Que É Criado

**proposal.md** - Captura a intenção:

```markdown
# Proposta: Adicionar Modo Escuro

## Intenção
Os usuários solicitaram uma opção de modo escuro para reduzir o cansaço visual durante o uso noturno.

## Escopo
- Adicionar alternância de tema nas configurações
- Suportar detecção de preferência do sistema
- Persistir preferência no localStorage

## Abordagem
Usar propriedades CSS customizáveis para theming com um React context para gerenciamento de estado.
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

## 1. Infraestrutura do Tema
- [ ] 1.1 Criar ThemeContext com estado claro/escuro
- [ ] 1.2 Adicionar propriedades CSS customizáveis para cores
- [ ] 1.3 Implementar persistência no localStorage

## 2. Componentes de UI
- [ ] 2.1 Criar componente ThemeToggle
- [ ] 2.2 Adicionar alternância à página de configurações
- [ ] 2.3 Atualizar Header para incluir alternância rápida

## 3. Estilização
- [ ] 3.1 Definir paleta de cores do tema escuro
- [ ] 3.2 Atualizar componentes para usar variáveis CSS
```

### 3. Implementar

```
Você: /opsx:apply

IA:  Trabalhando nas tarefas...
     ✓ 1.1 Criado ThemeContext com estado claro/escuro
     ✓ 1.2 Adicionadas propriedades CSS customizáveis ao globals.css
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
     ✓ Specs mescladas em openspec/specs/ui/spec.md
     ✓ Movido para openspec/changes/archive/2025-01-24-add-dark-mode/
     Concluído! Pronto para o próximo recurso.
```

Suas specs delta agora fazem parte das specs principais, documentando como seu sistema funciona.

## Verificando e Revisando

Use a CLI para verificar suas alterações:

```bash
# Listar alterações ativas
openspec list

# Ver detalhes da alteração
openspec show add-dark-mode

# Validar formatação da spec
openspec validate add-dark-mode

# Painel interativo
openspec view
```

## Próximos Passos

- [Fluxos de Trabalho](workflows.md) - Padrões comuns e quando usar cada comando
- [Comandos](commands.md) - Referência completa para todos os comandos slash
- [Conceitos](concepts.md) - Compreensão mais profunda de specs, alterações e esquemas
- [Personalização](customization.md) - Faça o OpenSpec funcionar do seu jeito