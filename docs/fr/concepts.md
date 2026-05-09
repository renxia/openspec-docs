# Concepts

Ce guide explique les idées fondamentales derrière OpenSpec et comment elles s'articulent. Pour une utilisation pratique, consultez [Pour commencer](getting-started.md) et [Flux de travail](workflows.md).

## Philosophie

OpenSpec est construit autour de quatre principes :

```
fluide, non rigide         — pas de phases imposées, travaillez sur ce qui a du sens
itératif, non en cascade   — apprenez en construisant, affinez au fur et à mesure
simple, non complexe       — mise en place légère, formalités minimales
approche brownfield d'abord — fonctionne avec les bases de code existantes, pas seulement les projets neufs
```

### Pourquoi ces principes sont importants

**Fluide, non rigide.** Les systèmes de spécification traditionnels vous enferment dans des phases : d'abord vous planifiez, puis vous implémentez, puis c'est terminé. OpenSpec est plus flexible — vous pouvez créer les artefacts dans l'ordre qui a le plus de sens pour votre travail.

**Itératif, non en cascade.** Les exigences changent. La compréhension s'approfondit. Ce qui semblait être une bonne approche au départ pourrait ne pas tenir après avoir examiné la base de code. OpenSpec embrette cette réalité.

**Simple, non complexe.** Certains cadres de spécification nécessitent une mise en place extensive, des formats rigides ou des processus lourds. OpenSpec ne vous encombre pas. Initialisez en quelques secondes, commencez à travailler immédiatement, personnalisez uniquement si vous en avez besoin.

**Approche brownfield d'abord.** La plupart des travaux logiciels ne consistent pas à construire à partir de zéro — il s'agit de modifier des systèmes existants. L'approche basée sur les deltas d'OpenSpec facilite la spécification des changements apportés aux comportements existants, et pas seulement la description de nouveaux systèmes.

## Vue d'ensemble

OpenSpec organise votre travail en deux domaines principaux :

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source de vérité   │◄─────│  Modifications proposées      │   │
│   │  Comment votre      │ fusion│  Chaque modification = un    │   │
│   │  système fonctionne │      │  dossier                      │   │
│   │  actuellement       │      │  Contient des artefacts +     │   │
│   │                     │      │  des deltas                   │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

Les **spécifications** sont la source de vérité — elles décrivent le comportement actuel de votre système.

Les **modifications** sont des propositions de changement — elles résident dans des dossiers séparés jusqu'à ce que vous soyez prêt à les fusionner.

Cette séparation est essentielle. Vous pouvez travailler sur plusieurs modifications en parallèle sans conflits. Vous pouvez examiner une modification avant qu'elle n'affecte les spécifications principales. Et lorsque vous archivez une modification, ses deltas fusionnent proprement dans la source de vérité.

## Espaces de travail de coordination

Le support des espaces de travail est en développement actif et n'est pas encore prêt à être utilisé. Ne construisez pas d'automatisation, d'intégrations ou de workflows de longue durée sur le comportement des espaces de travail ; les commandes, fichiers d'état et sorties JSON peuvent changer à tout moment.

Les commandes ci-dessous fournissent le premier flux de configuration pour la planification entre dépôts ou dossiers liés.

Les projets OpenSpec locaux au dépôt sont le choix par défaut approprié lorsqu'un seul dépôt gère le flux de planification, d'implémentation et d'archivage. Certains travaux s'étendent sur plusieurs dépôts ou dossiers. Pour ce cas, un espace de travail de coordination OpenSpec est le foyer durable de planification.

Le modèle mental de l'espace de travail est :

```text
espace de travail = où vivent les modifications inter-dépôts liées
lien              = un nom stable pour un dépôt ou un dossier sur lequel l'espace de travail peut planifier
modification      = une fonctionnalité, correction, projet ou autre morceau de travail planifié
```

Un espace de travail a une forme différente d'un projet local au dépôt :

```text
dossier-espace-de-travail/
├── changes/                       # Planification au niveau de l'espace de travail
└── .openspec-workspace/
    ├── workspace.yaml             # Identité partagée de l'espace de travail et noms des liens
    └── local.yaml                 # Chemins locaux de cette machine
```

L'état OpenSpec local au dépôt conserve la forme existante :

```text
racine-depot/
└── openspec/
    ├── specs/
    └── changes/
```

Cette distinction est importante. Le dossier de l'espace de travail est une surface de coordination pour la planification entre dépôts ou dossiers liés. Le répertoire `openspec/` de chaque dépôt reste le foyer pour les spécifications appartenant au dépôt, les modifications locales au dépôt et la planification de l'implémentation. Les utilisateurs n'ont pas besoin d'exécuter `openspec init` local au dépôt à l'intérieur d'un dossier d'espace de travail.

Les noms de liens stables sont la manière dont la planification de l'espace de travail fait référence aux dépôts et dossiers. L'état partagé de l'espace de travail conserve des noms tels que `api`, `web` ou `checkout` ; chaque machine mappe ces noms vers ses propres chemins locaux dans `.openspec-workspace/local.yaml`.

```yaml
# .openspec-workspace/workspace.yaml
version: 1
name: platform
links:
  api: {}
  web: {}
```

```yaml
# .openspec-workspace/local.yaml
version: 1
paths:
  api: /repos/api
  web: /repos/web
```

Les espaces de travail créés par OpenSpec excluent `.openspec-workspace/local.yaml` de l'état de collaboration portable par défaut. `.openspec-workspace/workspace.yaml` reste portable car il stocke le nom de l'espace de travail et les noms de liens stables, pas les chemins absolus de checkout d'un utilisateur.

Les chemins liés peuvent être des dépôts complets, des dossiers à l'intérieur d'un grand monorepo, ou d'autres dossiers existants. Ils n'ont pas besoin d'état `openspec/` local au dépôt avant de pouvoir participer à la planification de l'espace de travail. Les workflows d'implémentation, de vérification ou d'archivage ultérieurs peuvent nécessiter plus de préparation du dépôt, mais la visibilité de la planification commence avec le lien.

```text
multi-depot:
  api      -> /repos/api
  web      -> /repos/web

grand monorepo:
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

Les espaces de travail gérés vivent sous le répertoire de données standard d'OpenSpec :

```text
getGlobalDataDir()/workspaces
```

Cela signifie `$XDG_DATA_HOME/openspec/workspaces` lorsque `XDG_DATA_HOME` est défini, `~/.local/share/openspec/workspaces` sur le repli de style Unix, et `%LOCALAPPDATA%\openspec\workspaces` sur le repli natif Windows. Les shells natifs Windows, PowerShell et WSL2 conservent chacun les chaînes de chemin pour l'exécution en cours d'OpenSpec. Cette fondation ne traduit pas entre `D:\repo`, `/mnt/d/repo` et les chemins UNC WSL.

OpenSpec conserve également un registre local à la machine à :

```text
getGlobalDataDir()/workspaces/registry.yaml
```

Le registre mappe les noms d'espaces de travail vers leurs emplacements afin que les commandes globales ultérieures puissent lister ou sélectionner les espaces de travail connus depuis n'importe où. Ce n'est qu'un index. Chaque dossier d'espace de travail reste l'autorité pour son propre `.openspec-workspace/workspace.yaml` et `.openspec-workspace/local.yaml`, de sorte que les enregistrements périmés du registre peuvent être signalés et réparés sans redéfinir l'espace de travail lui-même.

La visibilité de l'espace de travail n'est pas un engagement de modification. Configurez un espace de travail lorsque OpenSpec doit savoir quels dépôts ou dossiers sont pertinents ; créez une modification plus tard lorsque vous êtes prêt à planifier une fonctionnalité, une correction, un projet ou un autre morceau de travail.

Commandes utiles :

```bash
# Configuration guidée
openspec workspace setup

# Configuration adaptée à l'automatisation
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex

# Voir les espaces de travail connus depuis le registre local
openspec workspace list
openspec workspace ls

# Ajouter ou réparer des liens pour l'espace de travail sélectionné
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Vérifier ce que cette machine peut résoudre
openspec workspace doctor
openspec workspace doctor --workspace platform

# Ouvrir l'ensemble de travail lié
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor
```

`workspace setup` crée toujours l'espace de travail dans l'emplacement standard, l'enregistre dans le registre local, affiche l'emplacement de l'espace de travail et nécessite au moins un dépôt ou dossier lié. La configuration interactive demande un ouvreur préféré. La configuration non interactive n'en stocke un que lorsque `--opener codex`, `--opener claude`, `--opener github-copilot`, ou `--opener editor` est fourni.

OpenSpec maintient également des fichiers d'ouverture d'espace de travail à la racine : un bloc de guidage géré par OpenSpec dans `AGENTS.md`, un fichier `<nom-espace-de-travail>.code-workspace` local à la machine pour les ouvertures VS Code et GitHub Copilot-in-VS-Code, et une entrée d'ignorance spécifique pour ce fichier `.code-workspace` maintenu. Les fichiers `*.code-workspace` créés par l'utilisateur restent traçables car la règle d'ignorance cible uniquement le fichier maintenu.

L'espace de travail VS Code maintenu inclut la racine de coordination comme `.` plus les dépôts ou dossiers liés valides comme racines supplémentaires. VS Code affiche ces entrées comme un espace de travail multi-racines.

`workspace open` ouvre l'ensemble de travail lié avec l'ouvreur préféré stocké, sauf si `--agent <outil>` ou `--editor` est passé pour cette session. Passer les deux remplacements d'ouvreur est une erreur. L'ouverture de l'espace de travail racine rend les dépôts et dossiers liés visibles pour l'exploration et la planification ; l'implémentation commence après que l'utilisateur a explicitement demandé un travail d'implémentation.

`workspace link` et `workspace relink` n'enregistrent que des dossiers existants ; ils ne créent, copient, déplacent, n'initialisent ni n'éditent le dépôt ou dossier lié. Après un lien ou un re-lien réussi, OpenSpec rafraîchit le guidage géré, le fichier d'espace de travail VS Code et la règle d'ignorance.

Les commandes d'espace de travail qui nécessitent un espace de travail peuvent être exécutées depuis n'importe où avec `--workspace <nom>`. Si vous les exécutez à l'intérieur d'un dossier ou sous-répertoire d'espace de travail, OpenSpec utilise cet espace de travail courant. Si plusieurs espaces de travail connus sont disponibles et que vous ne passez pas `--workspace <nom>`, les commandes humaines affichent un sélecteur ; `--json` et `--no-interactive` échouent avec une erreur de statut structurée au lieu de demander.

Les commandes directes d'espace de travail supportent la sortie JSON pour les scripts. Les réponses JSON conservent les données principales dans les objets `workspace`, `workspaces` ou `link` et signalent les avertissements ou erreurs dans les tableaux `status`. Les objets sains utilisent `status: []`.

## Spécifications

Les spécifications décrivent le comportement de votre système en utilisant des exigences et des scénarios structurés.

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
    └── spec.md           # Comportement de l'interface utilisateur et thèmes
```

Organisez les spécifications par domaine — des regroupements logiques qui ont du sens pour votre système. Modèles courants :

- **Par zone fonctionnelle** : `auth/`, `payments/`, `search/`
- **Par composant** : `api/`, `frontend/`, `workers/`
- **Par contexte délimité** : `ordering/`, `fulfillment/`, `inventory/`

### Format de spécification

Une spécification contient des exigences, et chaque exigence a des scénarios :

```markdown
# Spécification d'authentification
```

## But
Authentification et gestion des sessions pour l'application.

## Exigences

### Exigence : Authentification de l'utilisateur
Le système DOIT émettre un jeton JWT lors d'une connexion réussie.

#### Scénario : Identifiants valides
- ÉTANT DONNÉ un utilisateur avec des identifiants valides
- QUAND l'utilisateur soumet le formulaire de connexion
- ALORS un jeton JWT est retourné
- ET l'utilisateur est redirigé vers le tableau de bord

#### Scénario : Identifiants invalides
- ÉTANT DONNÉ des identifiants invalides
- QUAND l'utilisateur soumet le formulaire de connexion
- ALORS un message d'erreur est affiché
- ET aucun jeton n'est émis

### Exigence : Expiration de session
Le système DOIT expirer les sessions après 30 minutes d'inactivité.

#### Scénario : Délai d'expiration par inactivité
- ÉTANT DONNÉ une session authentifiée
- QUAND 30 minutes s'écoulent sans activité
- ALORS la session est invalidée
- ET l'utilisateur doit se ré-authentifier
```

**Éléments clés :**

| Élément | But |
|---------|---------|
| `## But` | Description de haut niveau du domaine de cette spécification |
| `### Exigence :` | Un comportement spécifique que le système doit avoir |
| `#### Scénario :` | Un exemple concret de l'exigence en action |
| SHALL/MUST/SHOULD | Mots-clés de la RFC 2119 indiquant la force de l'exigence |

### Pourquoi structurer les spécifications ainsi

**Les exigences sont le "quoi"** — elles indiquent ce que le système doit faire sans spécifier l'implémentation.

**Les scénarios sont le "quand"** — ils fournissent des exemples concrets qui peuvent être vérifiés. De bons scénarios :
- Sont testables (vous pourriez écrire un test automatisé pour eux)
- Couvrent à la fois le chemin nominal et les cas limites
- Utilisent le format Étant donné/Quand/Alors ou un format structuré similaire

**Les mots-clés de la RFC 2119** (SHALL, MUST, SHOULD, MAY) communiquent l'intention :
- **MUST/SHALL** — exigence absolue
- **SHOULD** — recommandé, mais des exceptions existent
- **MAY** — optionnel

### Ce qu'est (et n'est pas) une spécification

Une spécification est un **contrat de comportement**, pas un plan d'implémentation.

Bon contenu de spécification :
- Comportement observable sur lequel les utilisateurs ou les systèmes en aval s'appuient
- Entrées, sorties et conditions d'erreur
- Contraintes externes (sécurité, confidentialité, fiabilité, compatibilité)
- Scénarios qui peuvent être testés ou explicitement validés

À éviter dans les spécifications :
- Noms internes de classes/fonctions
- Choix de bibliothèques ou de frameworks
- Détails d'implémentation étape par étape
- Plans d'exécution détaillés (ceux-ci appartiennent à `design.md` ou `tasks.md`)

Test rapide :
- Si l'implémentation peut changer sans modifier le comportement visible de l'extérieur, il n'appartient probablement pas à la spécification.

### Rester léger : Rigueur progressive

OpenSpec vise à éviter la bureaucratie. Utilisez le niveau le plus léger qui rend encore le changement vérifiable.

**Spécification légère (par défaut) :**
- Exigences courtes centrées sur le comportement
- Portée claire et objectifs non visés
- Quelques vérifications d'acceptation concrètes

**Spécification complète (pour un risque plus élevé) :**
- Changements inter-équipes ou inter-dépôts
- Changements d'API/contrat, migrations, préoccupations de sécurité/confidentialité
- Changements où l'ambiguïté est susceptible de causer un retravail coûteux

La plupart des changements devraient rester en mode léger.

### Collaboration Humain + Agent

Dans de nombreuses équipes, les humains explorent et les agents rédigent les artefacts. La boucle prévue est :

1. L'humain fournit l'intention, le contexte et les contraintes.
2. L'agent les convertit en exigences et scénarios centrés sur le comportement.
3. L'agent conserve les détails d'implémentation dans `design.md` et `tasks.md`, pas dans `spec.md`.
4. La validation confirme la structure et la clarté avant l'implémentation.

Cela garde les spécifications lisibles pour les humains et cohérentes pour les agents.

## Modifications

Une modification est une proposition de changement de votre système, regroupée dans un dossier contenant tout ce qui est nécessaire pour la comprendre et la mettre en œuvre.

### Structure d'une modification

```
openspec/changes/add-dark-mode/
├── proposal.md           # Pourquoi et quoi
├── design.md             # Comment (approche technique)
├── tasks.md              # Liste de contrôle d'implémentation
├── .openspec.yaml        # Métadonnées de la modification (optionnel)
└── specs/                # Spécifications delta
    └── ui/
        └── spec.md       # Ce qui change dans ui/spec.md
```

Chaque modification est autonome. Elle contient :
- **Artefacts** — documents qui capturent l'intention, la conception et les tâches
- **Spécifications delta** — spécifications de ce qui est ajouté, modifié ou supprimé
- **Métadonnées** — configuration optionnelle pour cette modification spécifique

### Pourquoi les modifications sont des dossiers

Regrouper une modification dans un dossier présente plusieurs avantages :

1. **Tout est ensemble.** Proposition, conception, tâches et spécifications se trouvent au même endroit. Pas besoin de chercher à différents endroits.

2. **Travail en parallèle.** Plusieurs modifications peuvent exister simultanément sans conflit. Travailler sur `add-dark-mode` pendant que `fix-auth-bug` est également en cours.

3. **Historique propre.** Une fois archivées, les modifications sont déplacées vers `changes/archive/` avec leur contexte complet préservé. Vous pouvez revenir en arrière et comprendre non seulement ce qui a changé, mais pourquoi.

4. **Facile à réviser.** Un dossier de modification est facile à réviser — ouvrez-le, lisez la proposition, vérifiez la conception, consultez les deltas de spécification.

## Artefacts

Les artefacts sont les documents au sein d'une modification qui guident le travail.

### Le flux des artefacts

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   pourquoi        quoi         comment        étapes
 + périmètre    changements    approche      à suivre
```

Les artefacts s'appuient les uns sur les autres. Chaque artefact fournit le contexte pour le suivant.

### Types d'artefacts

#### Proposition (`proposal.md`)

La proposition capture l'**intention**, le **périmètre** et l'**approche** à un niveau élevé.

```markdown
# Proposition : Ajouter le mode sombre

## Intention
Les utilisateurs ont demandé une option de mode sombre pour réduire la fatigue oculaire
pendant l'utilisation nocturne et correspondre aux préférences du système.

## Périmètre
Dans le périmètre :
- Bascule de thème dans les paramètres
- Détection des préférences système
- Persistance de la préférence dans localStorage

Hors périmètre :
- Thèmes de couleurs personnalisés (travail futur)
- Remplacements de thème par page

## Approach
Utiliser les propriétés CSS personnalisées pour le thème avec un contexte React
pour la gestion d'état. Détecter la préférence système au premier chargement,
permettre la substitution manuelle.
```

**Quand mettre à jour la proposition :**
- Le périmètre change (réduction ou expansion)
- L'intention se clarifie (meilleure compréhension du problème)
- L'approche change fondamentalement

#### Spécifications (spécifications delta dans `specs/`)

Les spécifications delta décrivent **ce qui change** par rapport aux spécifications actuelles. Voir [Spécifications delta](#spécifications-delta) ci-dessous.

#### Conception (`design.md`)

La conception capture l'**approche technique** et les **décisions d'architecture**.

````markdown
# Conception : Ajouter le mode sombre

## Approche technique
État du thème géré via React Context pour éviter le prop drilling.
Les propriétés CSS personnalisées permettent le changement à l'exécution sans basculer de classe.

## Décisions d'architecture

### Décision : Context plutôt que Redux
Utilisation de React Context pour l'état du thème car :
- État binaire simple (clair/sombre)
- Pas de transitions d'état complexes
- Évite d'ajouter la dépendance Redux

### Décision : Propriétés CSS personnalisées
Utilisation de variables CSS plutôt que CSS-in-JS car :
- Fonctionne avec la feuille de style existante
- Pas de surcharge à l'exécution
- Solution native du navigateur

## Flux de données
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (appliquées à :root)
```

## Changements de fichiers
- `src/contexts/ThemeContext.tsx` (nouveau)
- `src/components/ThemeToggle.tsx` (nouveau)
- `src/styles/globals.css` (modifié)
````

**Quand mettre à jour la conception :**
- L'implémentation révèle que l'approche ne fonctionnera pas
- Une meilleure solution est découverte
- Les dépendances ou contraintes changent

#### Tâches (`tasks.md`)

Les tâches sont la **liste de contrôle d'implémentation** — étapes concrètes avec des cases à cocher.

```markdown
# Tâches

## 1. Infrastructure du thème
- [ ] 1.1 Créer ThemeContext avec l'état clair/sombre
- [ ] 1.2 Ajouter des propriétés CSS personnalisées pour les couleurs
- [ ] 1.3 Implémenter la persistance dans localStorage
- [ ] 1.4 Ajouter la détection des préférences système

## 2. Composants d'interface
- [ ] 2.1 Créer le composant ThemeToggle
- [ ] 2.2 Ajouter la bascule à la page des paramètres
- [ ] 2.3 Mettre à jour l'en-tête pour inclure une bascule rapide

## 3. Style
- [ ] 3.1 Définir la palette de couleurs du thème sombre
- [ ] 3.2 Mettre à jour les composants pour utiliser les variables CSS
- [ ] 3.3 Tester les rapports de contraste pour l'accessibilité
```

**Bonnes pratiques pour les tâches :**
- Regrouper les tâches connexes sous des titres
- Utiliser une numérotation hiérarchique (1.1, 1.2, etc.)
- Garder les tâches suffisamment petites pour être complétées en une session
- Cocher les tâches au fur et à mesure de leur achèvement

## Spécifications delta

Les spécifications delta sont le concept clé qui fait fonctionner OpenSpec pour le développement sur système existant. Elles décrivent **ce qui change** plutôt que de reformuler l'intégralité de la spécification.

### Le format

```markdown
# Delta pour Auth

## Exigences AJOUTÉES

### Exigence : Authentification à deux facteurs
Le système DOIT supporter l'authentification à deux facteurs basée sur TOTP.

#### Scénario : Inscription 2FA
- ÉTANT DONNÉ un utilisateur sans 2FA activé
- QUAND l'utilisateur active la 2FA dans les paramètres
- ALORS un code QR est affiché pour la configuration de l'application d'authentification
- ET l'utilisateur doit vérifier avec un code avant l'activation

#### Scénario : Connexion 2FA
- ÉTANT DONNÉ un utilisateur avec 2FA activé
- QUAND l'utilisateur soumet des identifiants valides
- ALORS un défi OTP est présenté
- ET la connexion ne se termine qu'après un OTP valide

## Exigences MODIFIÉES

### Exigence : Expiration de session
Le système DOIT faire expirer les sessions après 15 minutes d'inactivité.
(Précédemment : 30 minutes)

#### Scénario : Délai d'inactivité
- ÉTANT DONNÉ une session authentifiée
- QUAND 15 minutes passent sans activité
- ALORS la session est invalidée

## Exigences SUPPRIMÉES

### Exigence : Se souvenir de moi
(Déprécié en faveur de la 2FA. Les utilisateurs doivent se réauthentifier à chaque session.)
```

### Sections delta

| Section | Signification | Ce qui se passe lors de l'archivage |
|---------|---------------|-------------------------------------|
| `## Exigences AJOUTÉES` | Nouveau comportement | Ajouté à la spécification principale |
| `## Exigences MODIFIÉES` | Comportement modifié | Remplace l'exigence existante |
| `## Exigences SUPPRIMÉES` | Comportement déprécié | Supprimé de la spécification principale |

### Pourquoi des deltas plutôt que des spécifications complètes

**Clarté.** Un delta montre exactement ce qui change. En lisant une spécification complète, vous devriez faire une comparaison mentale avec la version actuelle.

**Évitement des conflits.** Deux modifications peuvent toucher le même fichier de spécification sans conflit, tant qu'elles modifient des exigences différentes.

**Efficacité de la révision.** Les réviseurs voient le changement, pas le contexte inchangé. Concentrez-vous sur ce qui compte.

**Adapté au système existant.** La plupart du travail modifie un comportement existant. Les deltas font des modifications une priorité, pas une réflexion après coup.

## Schémas

Les schémas définissent les types d'artefacts et leurs dépendances pour un workflow.

### Fonctionnement des Schémas

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Aucune dépendance, peut être créé en premier

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Nécessite la proposition avant création

  - id: design
    generates: design.md
    requires: [proposal]      # Peut être créé en parallèle avec les specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Nécessite à la fois les specs et le design
```

**Les artefacts forment un graphe de dépendances :**

```
                    proposal
                   (nœud racine)
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

**Les dépendances sont des facilitateurs, pas des barrières.** Elles indiquent ce qu'il est possible de créer, pas ce que vous devez créer ensuite. Vous pouvez ignorer le design si vous n'en avez pas besoin. Vous pouvez créer les specs avant ou après le design — les deux ne dépendent que de la proposition.

### Schémas Intégrés

**spec-driven** (par défaut)

Le workflow standard pour le développement piloté par les spécifications :

```
proposal → specs → design → tasks → implement
```

Idéal pour : La plupart des travaux sur les fonctionnalités où vous souhaitez convenir des spécifications avant l'implémentation.

### Schémas Personnalisés

Créez des schémas personnalisés pour le workflow de votre équipe :

```bash
# Créer à partir de zéro
openspec schema init research-first

# Ou en forker un existant
openspec schema fork spec-driven research-first
```

**Exemple de schéma personnalisé :**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Rechercher d'abord

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposition éclairée par la recherche

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Ignorer specs/design, passer directement aux tâches
```

Consultez [Personnalisation](customization.md) pour tous les détails sur la création et l'utilisation de schémas personnalisés.

## Archivage

L'archivage finalise un changement en fusionnant ses spécifications delta dans les spécifications principales et en préservant le changement pour l'historique.

### Ce qui se passe lors de l'archivage

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

### Le Processus d'Archivage

1. **Fusionner les deltas.** Chaque section de spécification delta (AJOUTÉ/MODIFIÉ/SUPPRIMÉ) est appliquée à la spécification principale correspondante.

2. **Déplacer vers l'archive.** Le dossier du changement est déplacé vers `changes/archive/` avec un préfixe de date pour un ordre chronologique.

3. **Préserver le contexte.** Tous les artefacts restent intacts dans l'archive. Vous pouvez toujours revenir en arrière pour comprendre pourquoi un changement a été effectué.

### Pourquoi l'Archivage est Important

**État propre.** Les changements actifs (`changes/`) ne montrent que le travail en cours. Le travail terminé est déplacé pour ne pas encombrer.

**Piste d'audit.** L'archive préserve le contexte complet de chaque changement — pas seulement ce qui a changé, mais la proposition expliquant pourquoi, le design expliquant comment, et les tâches montrant le travail effectué.

**Évolution des spécifications.** Les spécifications grandissent organiquement à mesure que les changements sont archivés. Chaque archive fusionne ses deltas, construisant une spécification complète au fil du temps.

## Comment Tout S'Assemble

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FLUX OPENSPEC                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. DÉMARRER   │  /opsx:propose (core) ou /opsx:new (workflow étendu)    │
│   │   UN CHANGEMENT│                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CRÉER LES  │  /opsx:ff ou /opsx:continue (workflow étendu)           │
│   │    ARTEFACTS   │  Crée proposal → specs → design → tasks                 │
│   │                │  (basé sur les dépendances du schéma)                   │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLÉMENTER│  /opsx:apply                                            │
│   │    LES TÂCHES  │  Traiter les tâches, les cocher au fur et à mesure      │
│   │                │◄──── Mettre à jour les artefacts en cours de route       │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VÉRIFIER   │  /opsx:verify (optionnel)                               │
│   │    LE TRAVAIL  │  Vérifier que l'implémentation correspond aux specs     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVER   │────►│  Les specs delta fusionnent dans les specs   │    │
│   │   LE CHANGEMENT│     │  principales                                 │    │
│   └────────────────┘     │  Le dossier du changement est déplacé vers   │    │
│                          │  archive/                                    │    │
│                          │  Les specs sont maintenant la source de      │    │
│                          │  vérité mise à jour                          │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Le cycle vertueux :**

1. Les spécifications décrivent le comportement actuel
2. Les changements proposent des modifications (sous forme de deltas)
3. L'implémentation rend les changements réels
4. L'archivage fusionne les deltas dans les spécifications
5. Les spécifications décrivent maintenant le nouveau comportement
6. Le prochain changement s'appuie sur les spécifications mises à jour

## Glossaire

| Terme | Définition |
|------|------------|
| **Artifact** | Un document au sein d'un changement (proposition, design, tâches ou spécifications delta) |
| **Archive** | Le processus de finalisation d'un changement et de fusion de ses deltas dans les spécifications principales |
| **Change** | Une modification proposée au système, regroupée dans un dossier contenant des artefacts |
| **Delta spec** | Une spécification qui décrit les changements (AJOUTÉ/MODIFIÉ/SUPPRIMÉ) par rapport aux spécifications actuelles |
| **Domain** | Un regroupement logique pour les spécifications (ex. `auth/`, `payments/`) |
| **Requirement** | Un comportement spécifique que le système doit avoir |
| **Scenario** | Un exemple concret d'une exigence, typiquement au format Given/When/Then |
| **Schema** | Une définition des types d'artefacts et de leurs dépendances |
| **Spec** | Une spécification décrivant le comportement du système, contenant des exigences et des scénarios |
| **Source of truth** | Le répertoire `openspec/specs/`, contenant le comportement actuel convenu |

## Prochaines Étapes

- [Démarrage](getting-started.md) - Premiers pas pratiques
- [Workflows](workflows.md) - Modèles courants et quand les utiliser
- [Commandes](commands.md) - Référence complète des commandes
- [Personnalisation](customization.md) - Créer des schémas personnalisés et configurer votre projet