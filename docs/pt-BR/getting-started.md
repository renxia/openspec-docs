# Começando

Este guia explica como o OpenSpec funciona depois que você o instalou e inicializou. Para instruções de instalação, consulte o [README principal](../index.md#quick-start) ou o [guia de instalação](installation.md). Novo em todo o conjunto de documentação? O [página inicial da documentação](index.md) mapeia tudo.

> **Onde eu digito esses comandos?** Em dois lugares, e misturá-los é o erro mais comum no início.
>
> - Comandos `openspec ...` (como `openspec init`) são executados no seu **terminal**.
> - Comandos `/opsx:...` (como `/opsx:propose`) são executados no **chat do seu assistente de IA**, a mesma caixa onde você pediria para ele escrever código.
>
> Não há um "modo interativo" separado para começar. Você simplesmente digita o comando com barra no chat e seu assistente assume a partir daí. Explicação completa: [Como os Comandos Funcionam](how-commands-work.md).

## Seus Primeiros Cinco Minutos

O ciclo completo, com cada etapa rotulada pelo local onde ocorre:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (opcional: pense antes)
AI CHAT      /opsx:propose add-dark-mode      (a IA rascunha o plano; você revisa)
AI CHAT      /opsx:apply                      (a IA constrói)
AI CHAT      /opsx:archive                    (specs atualizados, mudança arquivada)
```

Duas etapas no terminal para configurar, e depois você trabalha no chat. O restante deste guia desempacota o que cada etapa faz e o que você verá.

> **Não tem certeza do que construir ainda? Comece com `/opsx:explore`.** É um parceiro de pensamento sem riscos que lê sua base de código (codebase), avalia opções e transforma uma ideia vaga em um plano concreto, tudo antes que qualquer artefato ou código exista. Quando o quadro estiver claro, ele passa para `/opsx:propose`. Este é o melhor hábito para trabalhar com uma IA que, caso contrário, construiria confiante a coisa errada. Veja o [guia Explore](explore.md).

## Como Funciona

O OpenSpec ajuda você e seu assistente de codificação de IA a concordar sobre o que construir antes que qualquer código seja escrito.

**Caminho rápido padrão (perfil core):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (opcional)
```

Comece com `/opsx:explore` quando estiver descobrindo o que fazer, ou pule diretamente para `/opsx:propose` quando já souber. O Explore está no perfil padrão, então ele está sempre lá quando você precisar.

**Caminho expandido (seleção de fluxo de trabalho personalizado):**

```text
/opsx:new ──► /opsx:ff ou /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

O perfil global padrão é `core`, que inclui `propose`, `explore`, `apply`, `sync` e `archive`. Você pode habilitar os comandos de fluxo de trabalho expandido com `openspec config profile` e depois `openspec update`.

## O Que o OpenSpec Cria

Após executar `openspec init`, seu projeto tem esta estrutura:

```
openspec/
├── specs/              # Fonte da verdade (comportamento do seu sistema)
│   └── <domínio>/
│       └── spec.md
├── changes/            # Atualizações propostas (uma pasta por mudança)
│   └── <nome-da-mudanca>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Specs delta (o que está mudando)
│           └── <domínio>/
│               └── spec.md
└── config.yaml         # Configuração do projeto (opcional)
```

**Dois diretórios chave:**

- **`specs/`** - A fonte da verdade. Esses specs descrevem como seu sistema se comporta atualmente. Organizados por domínio (por exemplo, `specs/auth/`, `specs/payments/`).

- **`changes/`** - Modificações propostas. Cada mudança recebe sua própria pasta com todos os artefatos relacionados. Quando uma mudança está completa, seus specs são mesclados no diretório principal `specs/`.

## Entendendo Artefatos

Cada pasta de mudança contém artefatos que guiam o trabalho:

| Artefato | Propósito |
|----------|---------|
| `proposal.md` | O "porquê" e o "o quê" - captura a intenção, escopo e abordagem |
| `specs/` | Specs delta mostrando requisitos ADICIONADOS/MODIFICADOS/REMOVIDOS |
| `design.md` | O "como" - abordagem técnica e decisões de arquitetura |
| `tasks.md` | Checklist de implementação com caixas de seleção |

**Artefatos se constroem uns sobre os outros:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            atualize à medida que aprende
```

Você sempre pode voltar e refinar artefatos anteriores à medida que aprende mais durante a implementação.

## Como Funcionam os Specs Delta

Specs delta são o conceito chave no OpenSpec. Eles mostram o que está mudando em relação aos seus specs atuais.

### O Formato

Specs delta usam seções para indicar o tipo de mudança:

```markdown
# Delta para Auth

## Requisitos ADICIONADOS

### Requisito: Autenticação de Dois Fatores
O sistema DEVE exigir um segundo fator durante o login.

#### Cenário: OTP necessário
- DADO um usuário com 2FA ativado
- QUANDO o usuário envia credenciais válidas
- ENTÃO um desafio OTP é apresentado

## Requisitos MODIFICADOS

### Requisito: Tempo Limite de Sessão
O sistema DEVE expirar sessões após 30 minutos de inatividade.
(Anteriormente: 60 minutos)

#### Cenário: Timeout ocioso
- DADO uma sessão autenticada
- QUANDO passam 30 minutos sem atividade
- ENTÃO a sessão é invalidada

## Requisitos REMOVIDOS

### Requisito: Lembre-me
(Obsoleto em favor de 2FA)
```

### O Que Acontece no Arquivamento

Quando você arquiva uma mudança:

1. Os requisitos **ADICIONADOS** são anexados ao spec principal
2. Os requisitos **MODIFICADOS** substituem a versão existente
3. Os requisitos **REMOVIDOS** são excluídos do spec principal

A pasta de mudança é movida para `openspec/changes/archive/` para histórico de auditoria.

## Exemplo: Sua Primeira Mudança

Vamos ver como adicionar o modo escuro (dark mode) a um aplicativo.

### 1. Iniciar a Mudança (Padrão)

```text
Você: /opsx:propose add-dark-mode

IA:  Criou openspec/changes/add-dark-mode/
     ✓ proposal.md — por que estamos fazendo isso, o que está mudando
     ✓ specs/       — requisitos e cenários
     ✓ design.md    — abordagem técnica
     ✓ tasks.md     — checklist de implementação
     Pronto para a implementação!
```

Se você ativou o perfil de fluxo de trabalho expandido, você também pode fazer isso em duas etapas: `/opsx:new` e depois `/opsx:ff` (ou `/opsx:continue` incrementalmente).

### 2. O Que É Criado

**proposal.md** - Captura a intenção:

```markdown
# Proposta: Adicionar Modo Escuro

## Intenção
Os usuários solicitaram uma opção de modo escuro para reduzir o cansaço visual
durante o uso noturno.

## Escopo
- Adicionar alternância de tema nas configurações
- Suportar detecção de preferência do sistema
- Persistir a preferência em localStorage

## Abordagem
Usar propriedades customizadas CSS para temas com um contexto React
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
- E a preferência persiste em todas as sessões

#### Cenário: Preferência do sistema
- DADO um usuário sem preferência salva
- QUANDO o aplicativo carrega
- ENTÃO o esquema de cores preferido pelo sistema é usado
```

**tasks.md** - Checklist de implementação:

```markdown
# Tarefas

## 1. Infraestrutura de Tema
- [ ] 1.1 Criar ThemeContext com estado claro/escuro
- [ ] 1.2 Adicionar propriedades customizadas CSS para cores
- [ ] 1.3 Implementar persistência de localStorage

## 2. Componentes da UI
- [ ] 2.1 Criar componente ThemeToggle
- [ ] 2.2 Adicionar alternância à página de configurações
- [ ] 2.3 Atualizar o Cabeçalho para incluir a alternância rápida

## 3. Estilização
- [ ] 3.1 Definir paleta de cores do tema escuro
- [ ] 3.2 Atualizar componentes para usar variáveis CSS
```

### 3. Implementar

```
Você: /opsx:apply

IA:  Trabalhando nas tarefas...
     ✓ 1.1 Criado ThemeContext com estado claro/escuro
     ✓ 1.2 Adicionadas propriedades customizadas CSS ao globals.css
     ✓ 1.3 Implementada persistência de localStorage
     ✓ 2.1 Criado componente ThemeToggle
     ...
     Todas as tarefas concluídas!
```

Durante a implementação, se você descobrir que o design precisa de ajuste, basta atualizar o artefato e continuar.

### 4. Arquivar

```
Você: /opsx:archive

IA:  Arquivando add-dark-mode...
     ✓ Mesclados specs em openspec/specs/ui/spec.md
     ✓ Movido para openspec/changes/archive/2025-01-24-add-dark-mode/
     Concluído! Pronto para o próximo recurso.
```

Seus specs delta agora fazem parte dos specs principais, documentando como seu sistema funciona.

## Verificando e Revisando

Use a CLI para verificar suas mudanças:

```bash
# Listar mudanças ativas
openspec list

# Visualizar detalhes da mudança
openspec show add-dark-mode

# Validar formatação do spec
openspec validate add-dark-mode

# Painel interativo
openspec view
```

## Próximos Passos

- [Explore Primeiro](explore.md) - Use `/opsx:explore` para pensar em uma ideia antes de se comprometer
- [Usando OpenSpec em um Projeto Existente](existing-projects.md) - Comece em uma base de código brownfield grande
- [Editando e Iterando em uma Mudança](editing-changes.md) - Atualize artefatos, volte, reconcilie edições manuais
- [Conceitos Principais à Vista](overview.md) - Todo o modelo mental em uma página
- [Exemplos e Receitas](examples.md) - Mudanças reais, do início ao fim
- [Fluxos de Trabalho](workflows.md) - Padrões comuns e quando usar cada comando
- [Comandos](commands.md) - Referência completa para todos os comandos com barra
- [Conceitos](concepts.md) - Compreensão mais profunda de specs, mudanças e esquemas
- [Customização](customization.md) - Faça o OpenSpec funcionar do seu jeito
- [Stores](stores-beta/user-guide.md) - Planejamento que abrange repositórios ou equipes? Mantenha em seu próprio repo (beta)
- [FAQ](faq.md) e [Solução de Problemas](troubleshooting.md) - Quando você ficar preso