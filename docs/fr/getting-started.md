# Prise en main

Ce guide explique comment OpenSpec fonctionne après son installation et son initialisation. Pour les instructions d'installation, consultez le [README principal](../index.md#quick-start) ou le [Guide d'installation](installation.md). Nouveau dans l'ensemble de la documentation ? La [page d'accueil de la documentation](index.md) présente tout le contenu.

> **Où taper ces commandes ?** Deux endroits, et les confondre est l'erreur la plus fréquente au début.
>
> - Les commandes `openspec ...` (comme `openspec init`) s'exécutent dans votre **terminal**.
> - Les commandes `/opsx:...` (comme `/opsx:propose`) s'exécutent dans le **chat de votre assistant IA**, la même interface où vous lui demanderiez d'écrire du code.
>
> Il n'y a pas de « mode interactif » séparé à lancer. Vous tapez simplement la commande slash dans le chat et votre assistant s'occupe du reste. Explication complète : [Fonctionnement des commandes](how-commands-work.md).

## Vos cinq premières minutes

Le cycle complet, avec chaque étape indiquant où elle se déroule :

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (optional: think it through first)
AI CHAT      /opsx:propose add-dark-mode      (AI drafts the plan; you review it)
AI CHAT      /opsx:apply                      (AI builds it)
AI CHAT      /opsx:archive                    (specs updated, change filed away)
```

Deux étapes dans le terminal pour la configuration, puis vous travaillez dans le chat. Le reste de ce guide détaille ce que fait chaque étape et ce que vous verrez.

> **Vous ne savez pas encore quoi construire ? Commencez par `/opsx:explore`.** C'est un partenaire de réflexion sans risque qui lit votre base de code, évalue les options et affine une idée floue en un plan concret, le tout avant qu'un artefact ou du code n'existe. Lorsque le tableau est clair, il passe la main à `/opsx:propose`. C'est la meilleure habitude à prendre pour travailler avec une IA qui construirait autrement avec confiance la mauvaise chose. Consultez le [Guide d'exploration](explore.md).

## Fonctionnement

OpenSpec vous aide, vous et votre assistant de codage IA, à vous mettre d'accord sur ce qu'il faut construire avant d'écrire la moindre ligne de code.

**Chemin rapide par défaut (profil core) :**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (optional)
```

Commencez par `/opsx:explore` lorsque vous cherchez quoi faire, ou passez directement à `/opsx:propose` lorsque vous le savez déjà. Explore est inclus dans le profil par défaut, il est donc toujours disponible lorsque vous en avez besoin.

**Chemin étendu (sélection de workflow personnalisé) :**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Le profil global par défaut est `core`, qui inclut `propose`, `explore`, `apply`, `sync` et `archive`. Vous pouvez activer les commandes de workflow étendu avec `openspec config profile` puis `openspec update`.

## Ce que crée OpenSpec

Après avoir exécuté `openspec init`, votre projet a cette structure :

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

**Deux répertoires clés :**

- **`specs/`** - La source de vérité. Ces spécifications décrivent le comportement actuel de votre système. Organisées par domaine (par exemple, `specs/auth/`, `specs/payments/`).

- **`changes/`** - Modifications proposées. Chaque modification obtient son propre dossier avec tous les artefacts associés. Lorsqu'une modification est terminée, ses spécifications sont fusionnées dans le répertoire principal `specs/`.

## Comprendre les artefacts

Chaque dossier de modification contient des artefacts qui guident le travail :

| Artefact | Objectif |
|----------|---------|
| `proposal.md` | Le « pourquoi » et le « quoi » - capture l'intention, le périmètre et l'approche |
| `specs/` | Spécifications delta affichant les exigences AJOUTÉES/MODIFIÉES/SUPPRIMÉES |
| `design.md` | Le « comment » - approche technique et décisions d'architecture |
| `tasks.md` | Liste de contrôle d'implémentation avec cases à cocher |

**Les artefacts se construisent les uns sur les autres :**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            update as you learn
```

Vous pouvez toujours revenir en arrière et affiner les artefacts précédents au fur et à mesure que vous apprenez davantage pendant l'implémentation.

## Fonctionnement des spécifications delta

Les spécifications delta sont le concept clé d'OpenSpec. Elles montrent ce qui change par rapport à vos spécifications actuelles.

### Le format

Les spécifications delta utilisent des sections pour indiquer le type de changement :

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

### Ce qui se passe lors de l'archivage

Lorsque vous archivez une modification :

1. Les exigences **AJOUTÉES** sont ajoutées à la spécification principale
2. Les exigences **MODIFIÉES** remplacent la version existante
3. Les exigences **SUPPRIMÉES** sont supprimées de la spécification principale

Le dossier de modification est déplacé vers `openspec/changes/archive/` pour l'historique d'audit.

## Exemple : Votre première modification

Parcourons ensemble l'ajout du mode sombre à une application.

### 1. Démarrer la modification (Par défaut)

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

Si vous avez activé le profil de workflow étendu, vous pouvez également le faire en deux étapes : `/opsx:new` puis `/opsx:ff` (ou `/opsx:continue` de manière incrémentale).

### 2. Ce qui est créé

**proposal.md** - Capture l'intention :

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

**specs/ui/spec.md** - Delta affichant les nouvelles exigences :

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

**tasks.md** - Liste de contrôle d'implémentation :

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

### 3. Implémenter

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

Pendant l'implémentation, si vous découvrez que la conception nécessite des ajustements, mettez simplement à jour l'artefact et continuez.

### 4. Archiver

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

Vos spécifications delta font désormais partie des spécifications principales, documentant le fonctionnement de votre système.

## Vérification et révision

Utilisez le CLI pour vérifier l'état de vos modifications :

```bash
# Lister les modifications actives
openspec list

# Afficher les détails de la modification
openspec show add-dark-mode

# Valider le formatage des spécifications
openspec validate add-dark-mode

# Tableau de bord interactif
openspec view
```

## Prochaines étapes

- [Explorer d'abord](explore.md) - Utilisez `/opsx:explore` pour réfléchir à une idée avant de vous engager
- [Réviser une modification](reviewing-changes.md) - Ce qu'il faut vérifier dans le plan que l'IA rédige, avant tout code
- [Rédiger de bonnes spécifications](writing-specs.md) - À quoi ressemble une exigence et un scénario solides
- [Utiliser OpenSpec dans un projet existant](existing-projects.md) - Démarrer sur une grande base de code existante (brownfield)
- [Modifier et itérer sur une modification](editing-changes.md) - Mettre à jour les artefacts, revenir en arrière, réconcilier les modifications manuelles
- [Concepts de base en un coup d'œil](overview.md) - Tout le modèle mental sur une page
- [Exemples et recettes](examples.md) - Des modifications réelles, du début à la fin
- [Workflows](workflows.md) - Modèles courants et quand utiliser chaque commande
- [Commandes](commands.md) - Référence complète de toutes les commandes slash
- [Concepts](concepts.md) - Compréhension approfondie des spécifications, modifications et schémas
- [Personnalisation](customization.md) - Adapter OpenSpec à vos besoins
- [Stores](stores-beta/user-guide.md) - Une planification qui couvre plusieurs dépôts ou équipes ? Gardez-la dans son propre dépôt (bêta)
- [FAQ](faq.md) et [Dépannage](troubleshooting.md) - Lorsque vous êtes bloqué