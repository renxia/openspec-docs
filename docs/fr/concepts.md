# Concepts

Ce guide explique les idées fondamentales qui sous-tendent OpenSpec et comment elles s'articulent. Pour une utilisation pratique, voir [Pour commencer](getting-started.md) et [Flux de travail](workflows.md).

## Philosophie

OpenRep est construit autour de quatre principes :

```
fluide et non rigide         — pas de phases verrouillées, travaillez sur ce qui a du sens
itératif et non cascade — apprenez en construisant, affinez en cours de route
simple et non complexe — mise en place légère, cérémonial minimal
brownfield-first        — fonctionne avec les bases de code existantes, pas seulement greenfield
```

### Pourquoi ces principes comptent

**Fluide et non rigide.** Les systèmes de spécification traditionnels vous enferment dans des phases : d'abord vous planifiez, puis vous implémentez, puis c'est terminé. OpenSpec est plus flexible — vous pouvez créer des artefacts dans n'importe quel ordre qui a du sens pour votre travail.

**Itératif et non cascade.** Les besoins évoluent. La compréhension s'approfondit. Ce qui semblait une bonne approche au début pourrait ne pas tenir après avoir vu la base de code. OpenSpec embrette cette réalité.

**Simple et non complexe.** Certains cadres de spécification nécessitent une configuration étendue, des formats rigides ou des processus lourds. OpenSpec ne vous encombre pas. Initialisez en quelques secondes, commencez à travailler immédiatement, personnalisez uniquement si vous en avez besoin.

**Brownfield-first.** La plupart des travaux logiciels ne consistent pas à construire à partir de zéro — mais à modifier des systèmes existants. L'approche delta d'OpenSpec facilite la spécification des changements par rapport aux comportements existants, et pas seulement la description de nouveaux systèmes.

## Vue d'ensemble

OpenSpec organise votre travail en deux zones principales :

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source de vérité   │◄─────│  Modifications proposées      │   │
│   │  Fonctionnement     │ fusion│  Chaque changement = un      │   │
│   │  actuel du système  │      │  dossier                      │   │
│   │                     │      │  Contient artefacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

Les **specs** sont la source de vérité — elles décrivent le comportement actuel de votre système.

Les **changes** sont des modifications proposées — elles résident dans des dossiers séparés jusqu'à ce que vous soyez prêt à les fusionner.

Cette séparation est essentielle. Vous pouvez travailler sur plusieurs changements en parallèle sans conflits. Vous pouvez examiner un changement avant qu'il n'affecte les specs principales. Et lorsque vous archivez un changement, ses deltas se fusionnent proprement dans la source de vérité.

## Espaces de travail de coordination

Le support des espaces de travail est en version bêta. Le modèle de vue locale ci-dessous est l'orientation actuelle, mais les automatisations externes, les intégrations et les flux de travail de longue durée doivent toujours considérer le comportement des commandes, les fichiers d'état et la sortie JSON comme évolutifs.

Les commandes ci-dessous fournissent le premier flux de configuration pour ouvrir des vues locales sur des dépôts ou dossiers liés.

Les projets OpenSpec locaux au dépôt sont le bon choix par défaut lorsqu'un seul dépôt gère le flux de planification, d'implémentation et d'archivage. Certains travaux s'étendent sur plusieurs dépôts ou dossiers. Pour ce cas, un espace de travail de coordination OpenSpec est une vue locale à la machine qui conserve ensemble les chemins liés, l'état d'ouverture et la configuration des agents.

Le modèle mental de l'espace de travail est :

```text
workspace     = vue locale privée sur les magasins de contexte, initiatives, dépôts et dossiers
context store = conteneur de contexte partagé durable
initiative    = contexte de coordination durable dans un context store
link          = un nom stable pour un dépôt ou dossier que l'espace de travail peut résoudre localement
change        = une pièce de travail planifiée ; l'implémentation appartient au dépôt propriétaire
```

Un espace de travail a une structure différente d'un projet local au dépôt :

```text
getGlobalDataDir()/workspaces/<workspace-name>/
├── workspace.yaml                 # Enregistrement de la vue locale privée
├── AGENTS.md                      # Guide d'exécution généré
└── <workspace-name>.code-workspace # Fichier d'espace de travail éditeur généré
```

L'état OpenSpec local au dépôt conserve la structure existante :

```text
repo-root/
└── openspec/
    ├── specs/
    └── changes/
```

Cette distinction est importante. Le dossier de l'espace de travail est une surface de coordination locale pour ouvrir et inspecter les dépôts ou dossiers liés. Le répertoire `openspec/` de chaque dépôt reste le foyer des specs appartenant au dépôt, des changements locaux au dépôt et de la planification de l'implémentation. Les utilisateurs n'ont pas besoin d'exécuter `openspec init` local au dépôt dans un dossier d'espace de travail.

Les noms de liens stables sont la manière dont un espace de travail fait référence aux dépôts et dossiers. L'enregistrement privé de l'espace de travail conserve des noms tels que `api`, `web` ou `checkout` et les mappe aux chemins locaux de cette exécution.

```yaml
# workspace.yaml
version: 1
name: platform
context: null
links:
  api: /repos/api
  web: /repos/web
```

Lorsqu'un espace de travail ouvre une initiative, `context` enregistre la liaison du context store sélectionné et l'identifiant de l'initiative. Les magasins sélectionnés par registre restent portables par identifiant ; les magasins sélectionnés par chemin conservent intentionnellement le chemin local de l'exécution car `workspace.yaml` est un état local privé.

```yaml
context:
  kind: initiative
  store:
    id: platform
    selector:
      kind: registry
      id: platform
  initiative:
    id: billing-launch
```

Les chemins liés peuvent être des dépôts complets, des dossiers dans un grand monorepo, ou d'autres dossiers existants. Ils n'ont pas besoin d'état `openspec/` local au dépôt avant de pouvoir participer à la planification de l'espace de travail. Les flux de travail d'implémentation, de vérification ou d'archivage ultérieurs peuvent nécessiter une meilleure préparation du dépôt, mais la visibilité de la planification commence avec le lien.

```text
multi-repo :
  api      -> /repos/api
  web      -> /repos/web

grand monorepo :
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

Les espaces de travail gérés se trouvent sous le répertoire de données OpenSpec standard :

```text
getGlobalDataDir()/workspaces
```

Cela signifie `$XDG_DATA_HOME/openspec/workspaces` lorsque `XDG_DATA_HOME` est défini, `~/.local/share/openspec/workspaces` en fallback de style Unix, et `%LOCALAPPDATA%\openspec\workspaces` en fallback Windows natif. Les shells Windows natifs, PowerShell et WSL2 conservent chacun les chaînes de chemins pour l'exécution exécutant OpenSpec. Cette fondation ne fait pas de traduction entre `D:\repo`, `/mnt/d/repo` et les chemins UNC WSL.

OpenSpec peut toujours lire les anciens racines d'espaces de travail bêta comme entrées de compatibilité, mais les espaces de travail gérés utilisent désormais l'enregistrement racine `workspace.yaml` ci-dessus. Le dossier de l'espace de travail reste l'autorité pour sa propre vue locale privée.

La visibilité d'un espace de travail n'est pas un engagement de changement. Configurez un espace de travail lorsque OpenSpec doit savoir quels dépôts ou dossiers sont pertinents ; créez un changement plus tard lorsque vous êtes prêt à planifier une fonctionnalité, une correction, un projet ou une autre pièce de travail.

Commandes utiles :

```bash
# Configuration guidée
openspec workspace setup

# Configuration adaptée à l'automatisation
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli

# Voir les espaces de travail connus depuis le registre local
openspec workspace list
openspec workspace ls

# Ajouter ou réparer les liens pour l'espace de travail sélectionné
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Vérifier ce que cette machine peut résoudre
openspec workspace doctor
openspec workspace doctor --workspace platform

# Rafraîchir le guide local de l'espace de travail et les compétences des agents
openspec workspace update
openspec workspace update --workspace platform --tools codex,claude

# Ouvrir l'ensemble de travail lié
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor

# Ouvrir une initiative en tant que vue locale d'espace de travail
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative billing-launch --store-path /repos/platform-context
```

`workspace setup` crée toujours l'espace de travail dans l'emplacement standard des espaces de travail, l'enregistre dans le registre local, affiche l'emplacement de l'espace de travail et requiert au moins un dépôt ou dossier lié. La configuration interactive demande un ouvreur préféré et peut installer les compétences OpenSpec pour les agents sélectionnés. La configuration non interactive n'en stocke un que lorsque `--opener codex-cli`, `--opener claude`, `--opener github-copilot` ou `--opener editor` est fourni.

Les compétences d'espace de travail sont installées uniquement dans la racine de l'espace de travail. Le profil global actif sélectionne quelles compétences de flux de travail sont générées ; `--tools` sélectionne quels agents les reçoivent. La configuration et la mise à jour de l'espace de travail ne créent pas de fichiers de commandes slash même lorsque la livraison globale inclut des commandes. Exécutez `openspec workspace update` pour rafraîchir le guide local de l'espace de travail et ajouter, rafraîchir ou supprimer les répertoires de compétences gérés de l'espace de travail local sans modifier les dépôts ou dossiers liés.

OpenSpec maintient également les fichiers d'ouverture racine de l'espace de travail : un bloc de guidage géré par OpenSpec dans `AGENTS.md` et un fichier local à la machine `<workspace-name>.code-workspace` pour les ouvertures VS Code et GitHub Copilot-in-VS-Code. Un espace de travail géré n'est pas un dépôt, donc OpenSpec ne crée pas de `.gitignore` d'espace de travail par défaut ni de répertoire `changes/` au niveau de l'espace de travail par défaut.

L'espace de travail VS Code maintenu liste d'abord les dépôts ou dossiers liés valides, puis le contexte d'initiative lorsqu'il est attaché, puis les fichiers d'espace de travail OpenSpec. VS Code affiche ces entrées comme un espace de travail multi-racines.

`workspace open` ouvre l'ensemble de travail lié avec l'ouvreur préféré enregistré sauf si `--agent <tool>` ou `--editor` est passé pour cette session. Passer les deux surcharges d'ouvreur est une erreur. L'ouverture racine de l'espace de travail rend les dépôts et dossiers liés visibles pour l'exploration et le contexte ; l'implémentation commence après que l'utilisateur a explicitement demandé un travail d'implémentation.

`workspace link` et `workspace relink` n'enregistrent que les dossiers existants ; ils ne créent, copient, déplacent, initialisent ni n'éditent le dépôt ou dossier lié. Après un lien ou un re-lien réussi, OpenSpec rafraîchit le guide géré et le fichier d'espace de travail VS Code.

Les commandes d'espace de travail qui nécessitent un espace de travail peuvent être exécutées depuis n'importe où avec `--workspace <name>`. Si vous les exécutez dans un dossier ou sous-répertoire d'espace de travail, OpenSpec utilise cet espace de travail courant. Si plusieurs espaces de travail connus sont disponibles et que vous ne passez pas `--workspace <name>`, les commandes humaines affichent un sélecteur ; `--json` et `--no-interactive` échouent avec une erreur de statut structurée au lieu de demander.

Les commandes directes d'espace de travail supportent la sortie JSON pour les scripts. Les réponses JSON conservent les données principales dans les objets `workspace`, `workspaces` ou `link` et signalent les avertissements ou erreurs dans les tableaux `status`. Les objets sains utilisent `status: []`.

## Specs

Les specs décrivent le comportement de votre système à l'aide d'exigences et de scénarios structurés.

### Structure

```
openspec/specs/
├── auth/
│   └── spec.md           # Comportement d'authentification
├── payments/
│   └── spec.md           # Traitement des paiements
├── notifications/
│   └── spec.md           # Système de notifications
└── ui/
    └── spec.md           # Comportement de l'interface et thèmes
```

Organisez les specs par domaine — des regroupements logiques qui ont du sens pour votre système. Modèles courants :

- **Par zone fonctionnelle** : `auth/`, `payments/`, `search/`
- **Par composant** : `api/`, `frontend/`, `workers/`
- **Par contexte délimité** : `ordering/`, `fulfillment/`, `inventory/`

### Format de spec

Une spec contient des exigences, et chaque exigence possède des scénarios :

```markdown
# Auth Specification

## Purpose
Authentication and session management for the application.

## Requirements

### Requirement: User Authentication
The system SHALL issue a JWT token upon successful login.

#### Scenario: Valid credentials
- GIVEN a user with valid credentials
- WHEN the user submits login form
- THEN a JWT token is returned
- AND the user is redirected to dashboard

#### Scenario: Invalid credentials
- GIVEN invalid credentials
- WHEN the user submits login form
- THEN an error message is displayed
- AND no token is issued

### Requirement: Session Expiration
The system MUST expire sessions after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated
- AND the user must re-authenticate
```

**Éléments clés :**

| Élément | Rôle |
|---------|------|
| `## Purpose` | Description de haut niveau du domaine de cette spec |
| `### Requirement:` | Un comportement spécifique que le système doit avoir |
| `#### Scenario:` | Un exemple concret de l'exigence en action |
| SHALL/MUST/SHOULD | Mots-clés RFC 2119 indiquant la force de l'exigence |

### Pourquoi structurer les specs ainsi

**Les exigences sont le « quoi »** — elles énoncent ce que le système doit faire sans spécifier l'implémentation.

**Les scénarios sont le « quand »** — ils fournissent des exemples concrets qui peuvent être vérifiés. De bons scénarios :
- Sont testables (vous pourriez écrire un test automatisé pour eux)
- Couvrent à la fois le chemin nominal et les cas limites
- Utilisent Given/When/Then ou un format structuré similaire

**Les mots-clés RFC 2119** (SHALL, MUST, SHOULD, MAY) communiquent l'intention :
- **MUST/SHALL** — exigence absolue
- **SHOULD** — recommandé, mais des exceptions existent
- **MAY** — optionnel

### Ce qu'est une spec (et ce qu'elle n'est pas)

Une spec est un **contrat de comportement**, pas un plan d'implémentation.

Bon contenu de spec :
- Comportement observable sur lequel les utilisateurs ou les systèmes en aval s'appuient
- Entrées, sorties et conditions d'erreur
- Contraintes externes (sécurité, confidentialité, fiabilité, compatibilité)
- Scénarios qui peuvent être testés ou explicitement validés

À éviter dans les specs :
- Noms internes de classes/fonctions
- Choix de bibliothèques ou frameworks
- Détails d'implémentation étape par étape
- Plans d'exécution détaillés (ils appartiennent à `design.md` ou `tasks.md`)

Test rapide :
- Si l'implémentation peut changer sans modifier le comportement visible de l'extérieur, elle n'appartient probablement pas à la spec.

### Rester léger : rigueur progressive

OpenSpec vise à éviter la bureaucratie. Utilisez le niveau le plus léger qui rend encore le changement vérifiable.

**Spec allégée (par défaut) :**
- Exigences courtes axées sur le comportement
- Périmètre clair et objectifs exclus
- Quelques vérifications d'acceptation concrètes

**Spec complète (pour un risque plus élevé) :**
- Changements inter-équipes ou inter-dépôts
- Changements d'API/contrat, migrations, préoccupations de sécurité/confidentialité
- Changements où l'ambiguïté est susceptible de causer un retravail coûteux

La plupart des changements doivent rester en mode allégé.

### Collaboration humain + agent

Dans de nombreuses équipes, les humains explorent et les agents rédigent les artefacts. La boucle prévue est :

1. L'humain fournit l'intention, le contexte et les contraintes.
2. L'agent convertit cela en exigences axées sur le comportement et en scénarios.
3. L'agent conserve les détails d'implémentation dans `design.md` et `tasks.md`, pas dans `spec.md`.
4. La validation confirme la structure et la clarté avant l'implémentation.

Cela maintient les specs lisibles pour les humains et cohérentes pour les agents.

## Changements

Un changement est une modification proposée à votre système, structurée sous forme de dossier contenant tout ce qui est nécessaire pour le comprendre et le mettre en œuvre.

### Structure d'un changement

```
openspec/changes/add-dark-mode/
├── proposal.md           # Pourquoi et quoi
├── design.md             # Comment (approche technique)
├── tasks.md              # Liste de tâches d'implémentation
├── .openspec.yaml        # Métadonnées du changement (optionnel)
└── specs/                # Spécifications delta
    └── ui/
        └── spec.md       # Ce qui change dans ui/spec.md
```

Chaque changement est autonome. Il contient :
- **Artéfacts** — des documents qui capturent l'intention, la conception et les tâches
- **Spécifications delta** — des spécifications pour ce qui est ajouté, modifié ou supprimé
- **Métadonnées** — une configuration optionnelle pour ce changement spécifique

### Pourquoi les changements sont des dossiers

Structurer un changement sous forme de dossier présente plusieurs avantages :

1. **Tout est regroupé.** Proposition, conception, tâches et spécifications se trouvent au même endroit. Pas besoin de chercher à différents emplacements.

2. **Travail en parallèle.** Plusieurs changements peuvent coexister sans conflit. Vous pouvez travailler sur `add-dark-mode` pendant que `fix-auth-bug` est également en cours.

3. **Historique propre.** Une fois archivés, les changements sont déplacés vers `changes/archive/` avec leur contexte complet préservé. Vous pouvez revenir en arrière et comprendre non seulement ce qui a changé, mais aussi pourquoi.

4. **Facilité de revue.** Un dossier de changement est facile à revoir — ouvrez-le, lisez la proposition, vérifiez la conception, consultez les deltas de spécifications.

## Artéfacts

Les artéfacts sont les documents à l'intérieur d'un changement qui guident le travail.

### Le flux des artéfacts

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   pourquoi        quoi         comment       étapes
 + périmètre     changements   approche      à suivre
```

Les artéfacts s'appuient les uns sur les autres. Chaque artéfact fournit le contexte pour le suivant.

### Types d'artéfacts

#### Proposition (`proposal.md`)

La proposition capture **l'intention**, **le périmètre** et **l'approche** à un niveau élevé.

```markdown
# Proposition : Ajouter le mode sombre
```

## Intent
Les utilisateurs ont demandé une option de mode sombre pour réduire la fatigue oculaire
pendant l'utilisation nocturne et correspondre aux préférences du système.

## Portée
Dans la portée :
- Basculement de thème dans les paramètres
- Détection des préférences système
- Persistance de la préférence dans localStorage

Hors de portée :
- Thèmes de couleurs personnalisés (travail futur)
- Remplacements de thème par page

## Approche
Utiliser des propriétés CSS personnalisées pour le thème avec un contexte React
pour la gestion d'état. Détecter les préférences système au premier chargement,
permettre la substitution manuelle.
```

**Quand mettre à jour la proposition :**
- La portée change (réduction ou élargissement)
- L'intention se clarifie (meilleure compréhension du problème)
- L'approche change fondamentalement

#### Spécifications (spécifications delta dans `specs/`)

Les spécifications delta décrivent **ce qui change** par rapport aux spécifications actuelles. Voir [Spécifications Delta](#delta-specs) ci-dessous.

#### Conception (`design.md`)

La conception capture l'**approche technique** et les **décisions architecturales**.

````markdown
# Conception : Ajouter le mode sombre

## Approche technique
État du thème géré via le contexte React pour éviter le "prop drilling".
Les propriétés CSS personnalisées permettent un changement à l'exécution sans basculement de classes.

## Décisions architecturales

### Décision : Contexte plutôt que Redux
Utilisation du contexte React pour l'état du thème car :
- État binaire simple (clair/sombre)
- Pas de transitions d'état complexes
- Évite d'ajouter une dépendance Redux

### Décision : Propriétés CSS personnalisées
Utilisation de variables CSS plutôt que CSS-in-JS car :
- Fonctionne avec la feuille de style existante
- Pas de surcharge à l'exécution
- Solution native du navigateur

## Flux de données
```
ThemeProvider (contexte)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
Variables CSS (appliquées à :root)
```

## Modifications de fichiers
- `src/contexts/ThemeContext.tsx` (nouveau)
- `src/components/ThemeToggle.tsx` (nouveau)
- `src/styles/globals.css` (modifié)
````

**Quand mettre à jour la conception :**
- L'implémentation révèle que l'approche ne fonctionnera pas
- Une meilleure solution est découverte
- Les dépendances ou contraintes changent

#### Tâches (`tasks.md`)

Les tâches sont la **liste de contrôle de l'implémentation** — étapes concrètes avec des cases à cocher.

```markdown
# Tâches

## 1. Infrastructure de thème
- [ ] 1.1 Créer ThemeContext avec état clair/sombre
- [ ] 1.2 Ajouter des propriétés CSS personnalisées pour les couleurs
- [ ] 1.3 Implémenter la persistance dans localStorage
- [ ] 1.4 Ajouter la détection des préférences système

## 2. Composants UI
- [ ] 2.1 Créer le composant ThemeToggle
- [ ] 2.2 Ajouter le basculement à la page des paramètres
- [ ] 2.3 Mettre à jour l'en-tête pour inclure un basculement rapide

## 3. Styles
- [ ] 3.1 Définir la palette de couleurs du thème sombre
- [ ] 3.2 Mettre à jour les composants pour utiliser les variables CSS
- [ ] 3.3 Tester les rapports de contraste pour l'accessibilité
```

**Bonnes pratiques pour les tâches :**
- Regrouper les tâches connexes sous des titres
- Utiliser une numérotation hiérarchique (1.1, 1.2, etc.)
- Garder les tâches suffisamment petites pour être complétées en une session
- Cocher les tâches au fur et à mesure de leur réalisation

## Spécifications Delta

Les spécifications delta sont le concept clé qui rend OpenSpec adapté au développement sur une base existante (brownfield). Elles décrivent **ce qui change** plutôt que de reformuler l'ensemble de la spécification.

### Le Format

```markdown
# Delta pour l'Authentification

## Exigences AJOUTÉES

### Exigence : Authentification à deux facteurs
Le système DOIT supporter l'authentification à deux facteurs basée sur TOTP.

#### Scénario : Inscription au 2FA
- ÉTANT DONNÉ un utilisateur sans 2FA activé
- QUAND l'utilisateur active le 2FA dans les paramètres
- ALORS un code QR est affiché pour la configuration de l'application d'authentification
- ET l'utilisateur doit vérifier avec un code avant l'activation

#### Scénario : Connexion avec 2FA
- ÉTANT DONNÉ un utilisateur avec 2FA activé
- QUAND l'utilisateur soumet des identifiants valides
- ALORS un défi OTP est présenté
- ET la connexion se termine uniquement après un OTP valide

## Exigences MODIFIÉES

### Exigence : Expiration de session
Le système DOIT expirer les sessions après 15 minutes d'inactivité.
(Précédemment : 30 minutes)

#### Scénario : Délai d'attente inactif
- ÉTANT DONNÉ une session authentifiée
- QUAND 15 minutes s'écoulent sans activité
- ALORS la session est invalidée

## Exigences SUPPRIMÉES

### Exigence : Se souvenir de moi
(Déprécié en faveur du 2FA. Les utilisateurs doivent se réauthentifier à chaque session.)
```

### Sections Delta

| Section | Signification | Ce qui se passe lors de l'archivage |
|---------|---------------|-------------------------------------|
| `## Exigences AJOUTÉES` | Nouveau comportement | Ajouté à la spécification principale |
| `## Exigences MODIFIÉES` | Comportement modifié | Remplace l'exigence existante |
| `## Exigences SUPPRIMÉES` | Comportement déprécié | Supprimé de la spécification principale |

### Pourquoi des deltas plutôt que des spécifications complètes

**Clarté.** Un delta montre exactement ce qui change. En lisant une spécification complète, vous devriez faire une comparaison mentale avec la version actuelle.

**Évitement des conflits.** Deux modifications peuvent toucher le même fichier de spécification sans entrer en conflit, à condition qu'elles modifient des exigences différentes.

**Efficacité de la revue.** Les relecteurs voient le changement, pas le contexte inchangé. Concentrez-vous sur ce qui compte.

**Adapté au brownfield.** La plupart des travaux modifient des comportements existants. Les deltas font des modifications une fonctionnalité de premier plan, pas une réflexion après coup.

## Schémas

Les schémas définissent les types d'artefacts et leurs dépendances pour un workflow.

### Comment fonctionnent les schémas

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Pas de dépendances, peut être créé en premier

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Nécessite la proposition avant création

  - id: design
    generates: design.md
    requires: [proposal]      # Peut être créé en parallèle avec les spécifications

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Nécessite à la fois les spécifications et la conception
```

**Les artefacts forment un graphe de dépendances :**

```
                    proposition
                   (nœud racine)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      spécifications               conception
   (nécessite :                  (nécessite :
    proposition)                   proposition)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tâches
                (nécessite :
                spéc., conception)
```

**Les dépendances sont des facilitateurs, pas des portes.** Elles montrent ce qui peut être créé, pas ce que vous devez créer ensuite. Vous pouvez sauter la conception si vous n'en avez pas besoin. Vous pouvez créer les spécifications avant ou après la conception — les deux ne dépendent que de la proposition.

### Schémas intégrés

**spec-driven** (par défaut)

Le workflow standard pour le développement piloté par les spécifications :

```
proposition → spécifications → conception → tâches → implémentation
```

Idéal pour : La plupart des travaux sur les fonctionnalités où vous souhaitez convenir des spécifications avant l'implémentation.

### Schémas personnalisés

Créez des schémas personnalisés pour le workflow de votre équipe :

```bash
# Créer de zéro
openspec schema init research-first

# Ou dupliquer un existant
openspec schema fork spec-driven research-first
```

**Exemple de schéma personnalisé :**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Faire la recherche d'abord

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposition informée par la recherche

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Sauter spéc./conception, passer directement aux tâches
```

Consultez [Personnalisation](customization.md) pour plus de détails sur la création et l'utilisation de schémas personnalisés.

## Archivage

L'archivage finalise une modification en fusionnant ses spécifications delta dans les spécifications principales et en préservant la modification pour l'historique.

### Ce qui se passe lorsque vous archivez

```
Avant l'archivage :

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ fusion
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Après l'archivage :

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Inclut maintenant les exigences 2FA
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Préservé pour l'historique
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Le processus d'archivage

1. **Fusionner les deltas.** Chaque section de spécification delta (AJOUTÉES/MODIFIÉES/SUPPRIMÉES) est appliquée à la spécification principale correspondante.

2. **Déplacer vers les archives.** Le dossier de modification est déplacé vers `changes/archive/` avec un préfixe de date pour un ordre chronologique.

3. **Préserver le contexte.** Tous les artefacts restent intacts dans les archives. Vous pouvez toujours revenir en arrière pour comprendre pourquoi une modification a été apportée.

### Pourquoi l'archivage est important

**État propre.** Les modifications actives (`changes/`) ne montrent que le travail en cours. Le travail terminé sort du chemin.

**Piste d'audit.** Les archives préservent le contexte complet de chaque modification — pas seulement ce qui a changé, mais la proposition expliquant pourquoi, la conception expliquant comment, et les tâches montrant le travail accompli.

**Évolution des spécifications.** Les spécifications croissent organiquement à mesure que les modifications sont archivées. Chaque archive fusionne ses deltas, construisant une spécification complète au fil du temps.

## Comment tout s'imbrique

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FLUX OPENSPEC                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. DÉMARRER   │  /opsx:propose (core) ou /opsx:new (workflow étendu)    │
│   │  LA MODIFICATION│                                                        │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CRÉER      │  /opsx:ff ou /opsx:continue (workflow étendu)           │
│   │  LES ARTEFACTS │  Crée proposition → spéc. → conception → tâches         │
│   │                │  (basé sur les dépendances du schéma)                   │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLÉMENTER│  /opsx:apply                                            │
│   │  LES TÂCHES    │  Travailler sur les tâches, les cocher                  │
│   │                │◄──── Mettre à jour les artefacts en apprenant           │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VÉRIFIER   │  /opsx:verify (optionnel)                               │
│   │  LE TRAVAIL    │  Vérifier que l'implémentation correspond aux spéc.     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVER   │────►│  Les spéc. delta fusionnent dans les spéc. principales │
│   │  LA MODIFICATION│    │  Le dossier de modification passe aux archives│     │
│   └────────────────┘     │  Les spéc. sont maintenant la source de vérité mise à jour│
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Le cycle vertueux :**

1. Les spécifications décrivent le comportement actuel
2. Les modifications proposent des changements (sous forme de deltas)
3. L'implémentation rend les changements réels
4. L'archivage fusionne les deltas dans les spécifications
5. Les spécifications décrivent maintenant le nouveau comportement
6. La prochaine modification s'appuie sur les spécifications mises à jour

## Glossaire

| Terme | Définition |
|-------|------------|
| **Artefact** | Un document au sein d'une modification (proposition, conception, tâches ou spécifications delta) |
| **Archiver** | Le processus de finalisation d'une modification et de fusion de ses spécifications delta dans les spécifications principales |
| **Modification** | Une modification proposée au système, regroupée dans un dossier contenant des artefacts |
| **Spécification delta** | Une spécification qui décrit les changements (AJOUTÉ/MODIFIÉ/SUPPRIMÉ) par rapport aux spécifications actuelles |
| **Domaine** | Un regroupement logique pour les spécifications (ex. `auth/`, `payments/`) |
| **Exigence** | Un comportement spécifique que le système doit avoir |
| **Scénario** | Un exemple concret d'une exigence, typiquement au format Étant donné/Quand/Alors |
| **Schéma** | Une définition des types d'artefacts et de leurs dépendances |
| **Spécification** | Une spécification décrivant le comportement du système, contenant des exigences et des scénarios |
| **Source de vérité** | Le répertoire `openspec/specs/`, contenant le comportement convenu actuel |

## Prochaines étapes

- [Démarrage](getting-started.md) - Premiers pas pratiques
- [Flux de travail](workflows.md) - Modèles courants et quand les utiliser
- [Commandes](commands.md) - Référence complète des commandes
- [Personnalisation](customization.md) - Créer des schémas personnalisés et configurer votre projet