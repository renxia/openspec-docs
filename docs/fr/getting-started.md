# Démarrage

Ce guide explique le fonctionnement d'OpenSpec après son installation et son initialisation. Pour les instructions d'installation, consultez le [main README](../index.md#quick-start) ou le [Guide d'installation](installation.md). Vous êtes nouveau dans l'ensemble de la documentation ? Le [accueil de la documentation](index.md) tout récapitule.

> **Où dois-je taper ces commandes ?** Deux endroits, et les mélanger est le piège le plus courant au début.
>
> - Les commandes `openspec ...` (comme `openspec init`) s'exécutent dans votre **terminal**.
> - Les commandes `/opsx:...` (comme `/opsx:propose`) s'exécutent dans le **chat de votre assistant IA**, la même boîte où vous lui demanderiez d'écrire du code.
>
> Il n'y a pas de "mode interactif" séparé pour commencer. Vous tapez simplement la commande slash dans le chat et votre assistant prend le relais. Explication complète : [How Commands Work](how-commands-work.md).

## Vos cinq premières minutes

Le cycle complet, chaque étape étant étiquetée par l'endroit où elle se produit :

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (optionnel : réfléchir d'abord)
AI CHAT      /opsx:propose add-dark-mode      (l'IA prépare le plan ; vous le révisez)
AI CHAT      /opsx:apply                      (l'IA le construit)
AI CHAT      /opsx:archive                    (les spécifications sont mises à jour, le changement est archivé)
```

Deux étapes dans le terminal pour la configuration, puis vous travaillez dans le chat. Le reste de ce guide détaille ce que fait chaque étape et ce que vous verrez.

> **Vous ne savez pas quoi construire ? Commencez par `/opsx:explore`.** C'est un partenaire de réflexion sans risque qui lit votre base de code, évalue les options et affine une idée vague en un plan concret, avant même qu'un artefact ou du code n'existe. Lorsque le tableau est clair, il passe à `/opsx:propose`. C'est la meilleure habitude pour travailler avec une IA qui pourrait autrement construire faussement avec assurance. Consultez le [guide Explore](explore.md).

## Comment ça fonctionne

OpenSpec vous aide et votre assistant de codage IA à s'accorder sur ce qu'il faut construire avant que du code ne soit écrit.

**Chemin rapide par défaut (profil core) :**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (optionnel)
```

Commencez par `/opsx:explore` lorsque vous réfléchissez à ce que vous devez faire, ou passez directement à `/opsx:propose` lorsque vous savez déjà. Explore est dans le profil par défaut, il est donc toujours là quand vous en avez besoin.

**Chemin étendu (sélection du flux de travail personnalisé) :**

```text
/opsx:new ──► /opsx:ff ou /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Le profil global par défaut est `core`, qui inclut `propose`, `explore`, `apply`, `sync` et `archive`. Vous pouvez activer les commandes de flux de travail étendues avec `openspec config profile` puis `openspec update`.

## Ce qu'OpenSpec crée

Après avoir exécuté `openspec init`, votre projet a cette structure :

```
openspec/
├── specs/              # Source de vérité (le comportement de votre système)
│   └── <domain>/
│       └── spec.md
├── changes/            # Mises à jour proposées (un dossier par changement)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Spécifications Delta (ce qui change)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Configuration du projet (optionnel)
```

**Deux répertoires clés :**

- **`specs/`** - La source de vérité. Ces spécifications décrivent comment votre système se comporte actuellement. Organisées par domaine (par exemple, `specs/auth/`, `specs/payments/`).

- **`changes/`** - Modifications proposées. Chaque changement reçoit son propre dossier avec tous les artefacts associés. Lorsqu'un changement est terminé, ses spécifications sont fusionnées dans le répertoire principal `specs/`.

## Comprendre les Artefacts

Chaque dossier de changement contient des artefacts qui guident le travail :

| Artefact | Objectif |
|----------|---------|
| `proposal.md` | Le "pourquoi" et le "quoi" - capture l'intention, la portée et l'approche |
| `specs/` | Spécifications Delta montrant les exigences AJOUTÉES/MODIFIÉES/SUPPRIMÉES |
| `design.md` | Le "comment" - approche technique et décisions d'architecture |
| `tasks.md` | Liste de contrôle d'implémentation avec des cases à cocher |

**Les artefacts se construisent les uns sur les autres :**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            mise à jour au fur et à mesure que vous apprenez
```

Vous pouvez toujours revenir en arrière et affiner les artefacts précédents à mesure que vous en apprenez plus pendant l'implémentation.

## Comment fonctionnent les Delta Specs

Les spécifications Delta sont le concept clé d'OpenSpec. Elles montrent ce qui change par rapport à vos spécifications actuelles.

### Le format

Les spécifications Delta utilisent des sections pour indiquer le type de changement :

```markdown
# Delta pour Auth

## Exigences AJOUTÉES

### Exigence : Authentification à deux facteurs
Le système DOIT exiger un second facteur lors de la connexion.

#### Scénario : OTP requis
- ÉTANT DONNÉ un utilisateur avec 2FA activée
- QUAND l'utilisateur soumet des identifiants valides
- ALORS un défi OTP est présenté

## Exigences MODIFIÉES

### Exigence : Délai de session
Le système DOIT expirer les sessions après 30 minutes d'inactivité.
(Précédemment : 60 minutes)

#### Scénario : Délai d'inactivité
- ÉTANT DONNÉ une session authentifiée
- QUAND 30 minutes s'écoulent sans activité
- ALORS la session est invalidée

## Exigences SUPPRIMÉES

### Exigence : Mémoriser
(Déprécié au profit du 2FA)
```

### Ce qui se passe lors de l'archivage

Lorsque vous archivez un changement :

1. Les exigences **AJOUTÉES** sont ajoutées à la spécification principale
2. Les exigences **MODIFIÉES** remplacent la version existante
3. Les exigences **SUPPRIMÉES** sont supprimées de la spécification principale

Le dossier de changement est déplacé vers `openspec/changes/archive/` pour l'historique d'audit.

## Exemple : Votre premier changement

Voyons comment ajouter le mode sombre à une application.

### 1. Démarrer le changement (Par défaut)

```text
Vous: /opsx:propose add-dark-mode

IA:  A créé openspec/changes/add-dark-mode/
     ✓ proposal.md — pourquoi nous faisons cela, ce qui change
     ✓ specs/       — exigences et scénarios
     ✓ design.md    — approche technique
     ✓ tasks.md     — liste de contrôle d'implémentation
     Prêt pour l'implémentation !
```

Si vous avez activé le profil de flux de travail étendu, vous pouvez également faire cela en deux étapes : `/opsx:new` puis `/opsx:ff` (ou `/opsx:continue` incrémentalement).

### 2. Ce qui est créé

**proposal.md** - Capture l'intention :

```markdown
# Proposition : Ajouter le mode sombre

## Intention
Les utilisateurs ont demandé une option de mode sombre pour réduire la fatigue oculaire
pendant l'utilisation nocturne.

## Portée
- Ajouter un interrupteur de thème dans les paramètres
- Prendre en charge la détection des préférences système
- Persister la préférence dans localStorage

## Approche
Utiliser des propriétés CSS personnalisées pour le thème avec un contexte React
pour la gestion d'état.
```

**specs/ui/spec.md** - Delta montrant les nouvelles exigences :

```markdown
# Delta pour UI

## Exigences AJOUTÉES

### Exigence : Sélection de thème
Le système DOIT permettre aux utilisateurs de choisir entre les thèmes clair et sombre.

#### Scénario : Interrupteur manuel
- ÉTANT DONNÉ un utilisateur sur n'importe quelle page
- QUAND l'utilisateur clique sur le commutateur de thème
- ALORS le thème change immédiatement
- ET la préférence est persistée à travers les sessions

#### Scénario : Préférence système
- ÉTANT DONNÉ un utilisateur sans préférence enregistrée
- QUAND l'application se charge
- ALORS le schéma de couleur préféré du système est utilisé
```

**tasks.md** - Liste de contrôle d'implémentation :

```markdown
# Tâches

## 1. Infrastructure du thème
- [ ] 1.1 Créer ThemeContext avec l'état clair/sombre
- [ ] 1.2 Ajouter des propriétés CSS personnalisées pour les couleurs
- [ ] 1.3 Implémenter la persistance localStorage

## 2. Composants UI
- [ ] 2.1 Créer le composant ThemeToggle
- [ ] 2.2 Ajouter l'interrupteur à la page de paramètres
- [ ] 2.3 Mettre à jour l'en-tête pour inclure un commutateur rapide

## 3. Style
- [ ] 3.1 Définir la palette de couleurs du thème sombre
- [ ] 3.2 Mettre à jour les composants pour utiliser des variables CSS
```

### 3. Implémenter

```
Vous: /opsx:apply

IA:  Traitement des tâches...
     ✓ 1.1 Créé ThemeContext avec l'état clair/sombre
     ✓ 1.2 Ajouté les propriétés CSS personnalisées dans globals.css
     ✓ 1.3 Implémenté la persistance localStorage
     ✓ 2.1 Créé le composant ThemeToggle
     ...
     Toutes les tâches sont terminées !
```

Pendant l'implémentation, si vous découvrez que la conception nécessite un ajustement, il suffit de mettre à jour l'artefact et de continuer.

### 4. Archiver

```
Vous: /opsx:archive

IA:  Archivage d'add-dark-mode...
     ✓ Fusionné les spécifications dans openspec/specs/ui/spec.md
     ✓ Déplacé vers openspec/changes/archive/2025-01-24-add-dark-mode/
     Fait ! Prêt pour la prochaine fonctionnalité.
```

Vos delta specs font maintenant partie des spécifications principales, documentant le fonctionnement de votre système.

## Vérification et révision

Utilisez l'interface CLI pour vérifier vos changements :

```bash
# Lister les changements actifs
openspec list

# Afficher les détails du changement
openspec show add-dark-mode

# Valider le format des spécifications
openspec validate add-dark-mode

# Tableau de bord interactif
openspec view
```

## Prochaines étapes

- [Explorez d'abord](explore.md) - Utilisez `/opsx:explore` pour réfléchir à une idée avant de vous engager
- [Utiliser OpenSpec dans un projet existant](existing-projects.md) - Commencez sur une base de code brownfield importante
- [Modifier et itérer sur un changement](editing-changes.md) - Mettre à jour les artefacts, revenir en arrière, réconcilier les modifications manuelles
- [Concepts clés en un coup d'œil](overview.md) - Le modèle mental complet sur une page
- [Exemples et recettes](examples.md) - Changements réels, du début à la fin
- [Flux de travail](workflows.md) - Modèles courants et quand utiliser chaque commande
- [Commandes](commands.md) - Référence complète pour toutes les commandes slash
- [Concepts](concepts.md) - Compréhension plus approfondie des spécifications, des changements et des schémas
- [Personnalisation](customization.md) - Faites en sorte qu'OpenSpec corresponde à votre manière de travailler
- [Stores](stores-beta/user-guide.md) - Une planification qui s'étend sur plusieurs dépôts ou équipes ? Gardez-la dans son propre dépôt (bêta)
- [FAQ](faq.md) et [Dépannage](troubleshooting.md) - Lorsque vous êtes bloqué