# Concepts

Ce guide explique les idées fondamentales d'OpenSpec et comment elles s'articulent. Pour une utilisation pratique, consultez [Getting Started](getting-started.md) et [Workflows](workflows.md).

## Philosophie

OpenSpec est construit autour de quatre principes :

```
fluid not rigid         — no phase gates, work on what makes sense
iterative not waterfall — learn as you build, refine as you go
easy not complex        — lightweight setup, minimal ceremony
brownfield-first        — works with existing codebases, not just greenfield
```

### Pourquoi ces principes sont importants

**Fluid not rigid.** Les systèmes de spécification traditionnels vous enferment dans des phases : d'abord vous planifiez, puis vous implémentez, et ensuite c'est fini. OpenSpec est plus flexible — vous pouvez créer des artefacts dans l'ordre qui a du sens pour votre travail.

**Iterative not waterfall.** Les exigences changent. La compréhension s'approfondit. Ce qui semblait être une bonne approche au début pourrait ne pas tenir après avoir vu la codebase. OpenSpec embrasse cette réalité.

**Easy not complex.** Certains frameworks de spécification exigent une configuration étendue, des formats rigides ou des processus lourds (heavyweight). OpenSpec ne vous encombre pas. Initialisez en quelques secondes, commencez à travailler immédiatement, personnalisez seulement si nécessaire.

**Brownfield-first.** La plupart du travail logiciel n'est pas de construire à partir de zéro — c'est de modifier des systèmes existants. L'approche basée sur les deltas (delta-based) d'OpenSpec rend facile la spécification des changements apportés au comportement existant, et non seulement la description de nouveaux systèmes.

## Le Panorama Général

OpenSpec organise votre travail en deux domaines principaux :

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Vérité terrain    │◄─────│  Modifications proposées       │   │
│   │  Comment fonctionne votre système actuellement│  Chaque changement = un dossier     │   │
│   │                     │      │  Contient les artefacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** (Spécifications) est la vérité terrain — elles décrivent le comportement actuel de votre système.

**Changes** (Modifications) sont des modifications proposées — elles résident dans des dossiers séparés jusqu'à ce que vous soyez prêt à les fusionner.

Cette séparation est essentielle. Vous pouvez travailler sur plusieurs changements en parallèle sans conflit. Vous pouvez examiner une modification avant qu'elle n'affecte les specs principales. Et lorsque vous archivez un changement, ses deltas sont intégrés proprement dans la vérité terrain.

## Specs (Spécifications)

Les Specs décrivent le comportement de votre système à l'aide d'exigences et de scénarios structurés.

### Structure

```
openspec/specs/
├── auth/
│   └── spec.md           # Comportement d'authentification
├── payments/
│   └── spec.md           # Traitement des paiements
├── notifications/
│   └── spec.md           # Système de notification
└── ui/
    └── spec.md           # Comportement UI et thèmes
```

Organisez les specs par domaine — des regroupements logiques qui ont du sens pour votre système. Schémas courants :

- **Par zone de fonctionnalité** : `auth/`, `payments/`, `search/`
- **Par composant** : `api/`, `frontend/`, `workers/`
- **Par contexte délimité** : `ordering/`, `fulfillment/`, `inventory/`

### Format des Specs

Une spec contient des exigences, et chaque exigence possède des scénarios :

```markdown
# Spécification d'Auth

## Objectif
Gestion de l'authentification et de la session pour l'application.

## Exigences

### Exigence : Authentification utilisateur
Le système DOIT émettre un jeton JWT après une connexion réussie.

#### Scénario : Identifiants valides
- ÉTANT QU'un utilisateur avec des identifiants valides
- QUAND l'utilisateur soumet le formulaire de connexion
- ALORS un jeton JWT est retourné
- ET l'utilisateur est redirigé vers le tableau de bord

#### Scénario : Identifiants invalides
- ÉTANT QU'un utilisateur avec des identifiants invalides
- QUAND l'utilisateur soumet le formulaire de connexion
- ALORS un message d'erreur est affiché
- ET aucun jeton n'est émis

### Exigence : Expiration de session
Le système DOIT expirer les sessions après 30 minutes d'inactivité.

#### Scénario : Délai d'inactivité
- ÉTANT QU'une session authentifiée
- QUAND 30 minutes passent sans activité
- ALORS la session est invalidée
- ET l'utilisateur doit se réauthentifier
```

**Éléments clés :**

| Élément | Objectif |
|---------|---------|
| `## Objectif` | Description de haut niveau du domaine de cette spec |
| `### Exigence:` | Un comportement spécifique que le système doit avoir |
| `#### Scénario:` | Un exemple concret de l'exigence en action |
| SHALL/MUST/SHOULD | Mots-clés RFC 2119 indiquant la force de l'exigence |

### Pourquoi structurer les Specs de cette manière

**Les Exigences sont le "quoi"** — elles énoncent ce que le système doit faire sans spécifier l'implémentation.

**Les Scénarios sont le "quand"** — ils fournissent des exemples concrets qui peuvent être vérifiés. Bons scénarios :
- Sont testables (vous pourriez écrire un test automatisé pour eux)
- Couvrent le chemin heureux et les cas limites
- Utilisent le format structuré Given/When/Then ou similaire

**Les mots-clés RFC 2119** (SHALL, MUST, SHOULD, MAY) communiquent l'intention :
- **MUST/SHALL** — exigence absolue
- **SHOULD** — recommandé, mais des exceptions existent
- **MAY** — optionnel

### Ce qu'est une Spec (et ce qui ne l'est pas)

Une spec est un **contrat de comportement**, pas un plan d'implémentation.

Bon contenu de la spec :
- Comportement observable sur lequel les utilisateurs ou les systèmes en aval comptent
- Entrées, sorties et conditions d'erreur
- Contraintes externes (sécurité, confidentialité, fiabilité, compatibilité)
- Scénarios qui peuvent être testés ou explicitement validés

À éviter dans les specs :
- Noms de classes/fonctions internes
- Choix de librairie ou de framework
- Détails d'implémentation étape par étape
- Plans d'exécution détaillés (ceux-ci appartiennent à `design.md` ou `tasks.md`)

Test rapide :
- Si l'implémentation peut changer sans modifier le comportement visible extérieurement, elle n'appartient probablement pas à la spec.

### Garder les choses légères : Rigueur progressive

OpenSpec vise à éviter la bureaucratie. Utilisez le niveau le plus léger qui rend toujours le changement vérifiable.

**Lite spec (par défaut) :**
- Exigences courtes axées sur le comportement
- Périmètre clair et non-objectifs
- Quelques contrôles d'acceptation concrets

**Full spec (pour les risques élevés) :**
- Changements interéquipes ou inter-dépôts
- Changements API/contrat, migrations, préoccupations de sécurité/confidentialité
- Changements où l'ambiguïté est susceptible de causer un travail coûteux

La plupart des changements devraient rester en mode Lite.

### Collaboration Humain + Agent

Dans de nombreuses équipes, les humains explorent et les agents rédigent les artefacts. La boucle prévue est la suivante :

1. L'Humain fournit l'intention, le contexte et les contraintes.
2. L'Agent convertit cela en exigences et scénarios axés sur le comportement.
3. L'Agent garde les détails d'implémentation dans `design.md` et `tasks.md`, pas dans `spec.md`.
4. La Validation confirme la structure et la clarté avant l'implémentation.

Ceci maintient les specs lisibles pour les humains et cohérentes pour les agents.

## Changes (Modifications)

Une modification est une altération proposée de votre système, empaquetée sous forme de dossier contenant tout ce qui est nécessaire pour la comprendre et l'implémenter.

### Structure du Changement

```
openspec/changes/add-dark-mode/
├── proposal.md           # Pourquoi et quoi
├── design.md             # Comment (approche technique)
├── tasks.md              # Liste de contrôle d'implémentation
├── .openspec.yaml        # Métadonnées du changement (optionnel)
└── specs/                # Specs delta
    └── ui/
        └── spec.md       # Ce qui change dans ui/spec.md
```

Chaque modification est autonome. Elle contient :
- **Artefacts** — les documents qui capturent l'intention, la conception et les tâches
- **Delta specs** — les spécifications de ce qui est ajouté, modifié ou supprimé
- **Métadonnées** — configuration optionnelle pour ce changement spécifique

### Pourquoi les Changements sont des Dossiers

Emballer un changement sous forme de dossier présente plusieurs avantages :

1. **Tout au même endroit.** La proposition, la conception, les tâches et les specs résident au même endroit. Plus besoin de chercher dans différentes localisations.

2. **Travail parallèle.** Plusieurs changements peuvent exister simultanément sans conflit. Travaillez sur `add-dark-mode` pendant que `fix-auth-bug` est également en cours.

3. **Historique propre.** Lorsqu'ils sont archivés, les changements passent dans `changes/archive/` avec leur contexte complet préservé. Vous pouvez revenir en arrière et comprendre non seulement ce qui a changé, mais pourquoi.

4. **Facile à réviser.** Un dossier de changement est facile à examiner — ouvrez-le, lisez la proposition, vérifiez la conception, regardez les deltas des specs.

## Artefacts

Les Artefacts sont les documents au sein d'un changement qui guident le travail.

### Le Flux des Artefacts

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   pourquoi            ce que           comment          étapes à suivre
 + périmètre        changements       approche      à prendre
```

Les artefacts se construisent les uns sur les autres. Chaque artefact fournit le contexte pour le suivant.

### Types d'Artefacts

#### Proposition (`proposal.md`)

La proposition capture l'**intention**, le **périmètre** et l'**approche** à un niveau élevé.

```markdown
# Proposition : Ajouter le mode sombre

## Intention
Les utilisateurs ont demandé une option de mode sombre pour réduire la fatigue oculaire
lors de l'utilisation nocturne et pour correspondre aux préférences du système.

## Périmètre
Inclus :
- Commutateur de thème dans les paramètres
- Détection des préférences du système
- Persistance de la préférence dans localStorage

Exclu :
- Thèmes de couleurs personnalisés (travail futur)
- Surcharges de thème par page

## Approche
Utiliser les propriétés CSS pour le thémage avec un contexte React
pour la gestion de l'état. Détecter la préférence du système au premier chargement,
permettre une surcharge manuelle.
```

**Quand mettre à jour la proposition :**
- Changements de périmètre (réduction ou expansion)
- Clarification de l'intention (meilleure compréhension du problème)
- Changement fondamental de l'approche

#### Specs (Delta specs dans `specs/`)

Les Delta specs décrivent **ce qui change** par rapport aux specs actuelles. Voir [Delta Specs](#delta-specs) ci-dessous.

#### Conception (`design.md`)

La conception capture l'**approche technique** et les **décisions d'architecture**.

````markdown
# Conception : Ajouter le mode sombre

## Approche Technique
L'état du thème est géré via React Context pour éviter le *prop drilling*.
Les propriétés CSS permettent une commutation à l'exécution sans basculement de classes.

## Décisions d'Architecture

### Décision : Contexte plutôt que Redux
Utiliser React Context pour l'état du thème car :
- État binaire simple (clair/sombre)
- Pas de transitions d'état complexes
- Évite d'ajouter une dépendance Redux

### Décision : Propriétés CSS
Utiliser des variables CSS au lieu de CSS-in-JS parce que :
- Fonctionne avec la feuille de style existante
- Aucun surcoût à l'exécution
- Solution native du navigateur

## Flux de Données
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
Variables CSS (appliquées à :root)
```

## Changements de Fichiers
- `src/contexts/ThemeContext.tsx` (nouveau)
- `src/components/ThemeToggle.tsx` (nouveau)
- `src/styles/globals.css` (modifié)
````

**Quand mettre à jour la conception :**
- L'implémentation révèle que l'approche ne fonctionnera pas
- Une meilleure solution est découverte
- Les dépendances ou les contraintes changent

#### Tâches (`tasks.md`)

Les tâches sont la **liste de contrôle d'implémentation** — des étapes concrètes avec des cases à cocher.

```markdown
# Tâches

## 1. Infrastructure du Thème
- [ ] 1.1 Créer ThemeContext avec l'état clair/sombre
- [ ] 1.2 Ajouter les propriétés CSS pour les couleurs
- [ ] 1.3 Implémenter la persistance localStorage
- [ ] 1.4 Ajouter la détection des préférences du système

## 2. Composants UI
- [ ] 2.1 Créer le composant ThemeToggle
- [ ] 2.2 Ajouter le commutateur à la page de paramètres
- [ ] 2.3 Mettre à jour l'en-tête pour inclure un commutateur rapide

## 3. Style
- [ ] 3.1 Définir la palette de couleurs du thème sombre
- [ ] 3.2 Mettre à jour les composants pour utiliser les variables CSS
- [ ] 3.3 Tester les ratios de contraste pour l'accessibilité
```

**Bonnes pratiques pour les tâches :**
- Grouper les tâches connexes sous des titres
- Utiliser un classement hiérarchique (1.1, 1.2, etc.)
- Garder les tâches assez petites pour être complétées en une seule session
- Cocher les tâches au fur et à mesure de leur achèvement

## Delta Specs (Spécifications Delta)

Les Delta specs sont le concept clé qui fait fonctionner OpenSpec pour le développement sur des systèmes existants (*brownfield*). Elles décrivent **ce qui change** plutôt que de répéter la spec entière.

### Le Format

```markdown
# Delta pour Auth

## Exigences AJOUTÉES

### Exigence : Authentification à deux facteurs (2FA)
Le système DOIT prendre en charge l'authentification à deux facteurs basée sur TOTP.

#### Scénario : Enrôlement 2FA
- ÉTANT QU'un utilisateur sans 2FA activé
- QUAND l'utilisateur active le 2FA dans les paramètres
- ALORS un code QR est affiché pour la configuration de l'application d'authentification
- ET l'utilisateur doit vérifier avec un code avant activation

#### Scénario : Connexion 2FA
- ÉTANT QU'un utilisateur avec 2FA activé
- QUAND l'utilisateur soumet des identifiants valides
- ALORS un défi OTP est présenté
- ET la connexion est complétée seulement après le OTP valide

## Exigences MODIFIÉES

### Exigence : Expiration de session
Le système DOIT expirer les sessions après 15 minutes d'inactivité.
(Précédemment : 30 minutes)

#### Scénario : Délai d'inactivité
- ÉTANT QU'une session authentifiée
- QUAND 15 minutes passent sans activité
- ALORS la session est invalidée

## Exigences SUPPRIMÉES

### Exigence : Se souvenir de moi (Remember Me)
(Déprécié au profit du 2FA. Les utilisateurs doivent se réauthentifier à chaque session.)
```

### Sections Delta

| Section | Signification | Ce qui se passe lors de l'archivage |
|---------|---------|------------------------|
| `## Exigences AJOUTÉES` | Nouveau comportement | Ajouté à la spec principale |
| `## Exigences MODIFIÉES` | Comportement changé | Remplace l'exigence existante |
| `## Exigences SUPPRIMÉES` | Comportement déprécié | Supprimé de la spec principale |

### Pourquoi des Deltas au lieu de Specs Complètes

**Clarté.** Un delta montre exactement ce qui change. En lisant une spec complète, vous devriez la comparer mentalement à la version actuelle.

**Évitement des conflits.** Deux changements peuvent toucher le même fichier de spécification sans conflit, pourvu qu'ils modifient différentes exigences.

**Efficacité de révision.** Les relecteurs voient le changement, pas le contexte inchangé. Concentrez-vous sur ce qui est important.

**Adaptation au *brownfield*.** La plupart du travail modifie un comportement existant. Les deltas font des modifications une priorité, et non une réflexion après coup.

## Schémas (Schemas)

Les schémas définissent les types d'artefacts et leurs dépendances pour un flux de travail.

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
    requires: [proposal]      # Nécessite la proposition avant de créer

  - id: design
    generates: design.md
    requires: [proposal]      # Peut être créé en parallèle avec specs

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
   (nécessite :                  (nécessite :
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (nécessite :
                specs, design)
```

**Les dépendances sont des facilitateurs, pas des portes.** Elles indiquent ce qui est possible à créer, non ce que vous devez créer ensuite. Vous pouvez ignorer le design si vous n'en avez pas besoin. Vous pouvez créer les specs avant ou après le design — les deux ne dépendent que de la proposition.

### Schémas intégrés (Built-in Schemas)

**spec-driven** (par défaut)

Le flux de travail standard pour le développement basé sur les spécifications :

```
proposal → specs → design → tasks → implement
```

Idéal pour : La plupart des travaux de fonctionnalités où vous souhaitez valider les spécifications avant l'implémentation.

### Schémas personnalisés (Custom Schemas)

Créez des schémas personnalisés pour le flux de travail de votre équipe :

```bash
# Créer à partir de zéro
openspec schema init research-first

# Ou forker un schéma existant
openspec schema fork spec-driven research-first
```

**Exemple de schéma personnalisé :**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Faire la recherche en premier

  - id: proposal
    generates: proposal.md
    requires: [research]   # La proposition est informée par la recherche

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Ignorer specs/design, passer directement aux tâches
```

Consultez [Customization](customization.md) pour tous les détails sur la création et l'utilisation des schémas personnalisés.

## Archive

L'archivage complète un changement en fusionnant ses delta-specs dans les spécifications principales et en préservant le changement pour l'historique.

### Ce qui se passe lors de l'Archivage

```
Avant archivage :

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


Après archivage :

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Inclut maintenant les exigences de 2FA
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

1. **Fusionner les deltas.** Chaque section de delta-spec (AJOUTÉ/MODIFIÉ/SUPPRIMÉ) est appliquée à la spécification principale correspondante.

2. **Déplacer vers l'archive.** Le dossier du changement est déplacé vers `changes/archive/` avec un préfixe de date pour un tri chronologique.

3. **Préserver le contexte.** Tous les artefacts restent intacts dans l'archive. Vous pouvez toujours revenir en arrière pour comprendre pourquoi un changement a été effectué.

### Pourquoi l'Archivage est Important

**État propre.** Les changements actifs (`changes/`) montrent uniquement le travail en cours. Le travail terminé est mis de côté.

**Piste d'audit.** L'archive préserve le contexte complet de chaque changement — pas seulement ce qui a changé, mais la proposition expliquant pourquoi, le design expliquant comment et les tâches montrant le travail effectué.

**Évolution des spécifications.** Les specs grandissent organiquement à mesure que les changements sont archivés. Chaque archive fusionne ses deltas, construisant une spécification complète au fil du temps.

## Comment Tout Cela Fonctionne Ensemble

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FLUX OPENSPEC                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. DÉMARRER   │  /opsx:propose (core) ou /opsx:new (expanded)           │
│   │     LE CHANGEMENT │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CRÉER      │  /opsx:ff ou /opsx:continue (workflow étendu)         │
│   │     LES ARTEFACTS │  Crée proposal → specs → design → tasks              │
│   │                │  (basé sur les dépendances du schéma)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLÉMENTER │  /opsx:apply                                            │
│   │     LES TÂCHES │  Travail sur les tâches, en les cochant                  │
│   │                │◄──── Mettre à jour les artefacts au fur et à mesure que vous apprenez │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VÉRIFIER   │  /opsx:verify (optionnel)                                │
│   │     LE TRAVAIL │  Vérifier que l'implémentation correspond aux specs         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVER   │────►│  Les deltas de specs sont fusionnés dans les specs principales │    │
│   │     LE CHANGEMENT │     │  Le dossier du changement est déplacé vers archive/             │    │
│   └────────────────┘     │  Les Specs sont maintenant la source de vérité mise à jour   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Le cycle vertueux :**

1. Les specs décrivent le comportement actuel
2. Les changements proposent des modifications (sous forme de deltas)
3. L'implémentation rend les changements réels
4. L'archivage fusionne les deltas dans les specs
5. Les Specs décrivent maintenant le nouveau comportement
6. Le prochain changement est basé sur les specs mises à jour

## Glossaire

| Terme | Définition |
|------|------------|
| **Artifact** | Un document au sein d'un changement (proposition, design, tâches ou delta-specs) |
| **Archive** | Le processus de finalisation d'un changement et de fusion de ses deltas dans les specs principales |
| **Change** | Une modification proposée du système, empaquetée sous forme de dossier avec des artefacts |
| **Delta spec** | Un spec qui décrit des changements (AJOUTÉ/MODIFIÉ/SUPPRIMÉ) par rapport aux specs actuelles |
| **Domain** | Un regroupement logique pour les specs (par exemple, `auth/`, `payments/`) |
| **Requirement** | Un comportement spécifique que le système doit posséder |
| **Scenario** | Un exemple concret d'une exigence, généralement au format Given/When/Then |
| **Schema** | Une définition des types d'artefacts et de leurs dépendances |
| **Spec** | Une spécification décrivant le comportement du système, contenant des exigences et des scénarios |
| **Source of truth** | Le répertoire `openspec/specs/`, contenant le comportement actuellement accepté |

## Prochaines Étapes (Next Steps)

- [Getting Started](getting-started.md) - Premières étapes pratiques
- [Workflows](workflows.md) - Modèles courants et quand utiliser chacun d'eux
- [Commands](commands.md) - Référence complète des commandes
- [Customization](customization.md) - Créer des schémas personnalisés et configurer votre projet