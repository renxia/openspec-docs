# Concepts

Ce guide explique les idées fondamentales derrière OpenSpec et comment elles s'articulent entre elles. Pour une utilisation pratique, consultez [Démarrage](getting-started.md) et [Flux de travail](workflows.md).

## Philosophie

OpenSpec repose sur quatre principes :

```
fluide et non rigide         — pas de portes de phase, travaillez sur ce qui a du sens
itératif et non en cascade   — apprenez en construisant, affinez au fur et à mesure
simple et non complexe       — configuration légère, minimalisme
brownfield d'abord           — fonctionne avec les bases de code existantes, pas seulement les projets neufs
```

### Pourquoi ces principes sont importants

**Fluide et non rigide.** Les systèmes de spécification traditionnels vous enferment dans des phases : d'abord vous planifiez, puis vous implémentez, et c'est terminé. OpenSpec est plus flexible — vous pouvez créer des artefacts dans l'ordre qui a le plus de sens pour votre travail.

**Itératif et non en cascade.** Les exigences changent. La compréhension s'approfondit. Ce qui semblait être une bonne approche au début ne tiendra peut-être pas après avoir examiné la base de code. OpenSpec embrasse cette réalité.

**Simple et non complexe.** Certains cadres de spécification nécessitent une configuration étendue, des formats rigides ou des processus lourds. OpenSpec ne vous encombre pas. Initialisez en quelques secondes, commencez à travailler immédiatement, personnalisez uniquement si nécessaire.

**Brownfield d'abord.** La plupart des travaux logiciels ne consistent pas à tout construire de zéro — il s'agit de modifier des systèmes existants. L'approche basée sur les deltas d'OpenSpec facilite la spécification des modifications du comportement existant, et pas seulement la description de nouveaux systèmes.

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
│   │  Comment votre      │merge │  Chaque modification = 1 dossier│  │
│   │  système fonctionne │      │  Contient artefacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Les Spécifications** sont la source de vérité — elles décrivent le comportement actuel de votre système.

**Les Modifications** sont des changements proposés — elles vivent dans des dossiers séparés jusqu'à ce que vous soyez prêt à les fusionner.

Cette séparation est essentielle. Vous pouvez travailler sur plusieurs modifications en parallèle sans conflits. Vous pouvez examiner une modification avant qu'elle n'affecte les spécifications principales. Et lorsque vous archivez une modification, ses deltas fusionnent proprement dans la source de vérité.

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
    └── spec.md           # Comportement et thèmes de l'interface
```

Organisez les spécifications par domaine — des regroupements logiques qui ont du sens pour votre système. Modèles courants :

- **Par zone de fonctionnalité** : `auth/`, `payments/`, `search/`
- **Par composant** : `api/`, `frontend/`, `workers/`
- **Par contexte délimité** : `ordering/`, `fulfillment/`, `inventory/`

### Format des Spécifications

Une spécification contient des exigences, et chaque exigence possède des scénarios :

```markdown
# Spécification Authentification

## Objectif
Authentification et gestion des sessions pour l'application.

## Exigences

### Exigence : Authentification Utilisateur
Le système DOIT émettre un token JWT lors d'une connexion réussie.

#### Scénario : Identifiants valides
- ÉTANT DONNÉ un utilisateur avec des identifiants valides
- QUAND l'utilisateur soumet le formulaire de connexion
- ALORS un token JWT est retourné
- ET l'utilisateur est redirigé vers le tableau de bord

#### Scénario : Identifiants invalides
- ÉTANT DONNÉ des identifiants invalides
- QUAND l'utilisateur soumet le formulaire de connexion
- ALORS un message d'erreur est affiché
- ET aucun token n'est émis

### Exigence : Expiration de Session
Le système DOIT faire expirer les sessions après 30 minutes d'inactivité.

#### Scénario : Délai d'inactivité
- ÉTANT DONNÉ une session authentifiée
- QUAND 30 minutes passent sans activité
- ALORS la session est invalidée
- ET l'utilisateur doit se ré-authentifier
```

**Éléments clés :**

| Élément | Objectif |
|---------|----------|
| `## Objectif` | Description de haut niveau du domaine de cette spécification |
| `### Exigence :` | Un comportement spécifique que le système doit avoir |
| `#### Scénario :` | Un exemple concret de l'exigence en action |
| DOIT/DEVRAIT/PEUT | Mots-clés RFC 2119 indiquant la force de l'exigence |

### Pourquoi Structurer les Spécifications Ainsi

**Les exigences sont le « quoi »** — elles énoncent ce que le système doit faire sans spécifier l'implémentation.

**Les scénarios sont le « quand »** — ils fournissent des exemples concrets qui peuvent être vérifiés. De bons scénarios :
- Sont testables (vous pourriez écrire un test automatisé pour eux)
- Couvrent à la fois le cas nominal et les cas limites
- Utilisent un format structuré du type ÉTANT DONNÉ/QUAND/ALORS ou similaire

**Les mots-clés RFC 2119** (DOIT, DEVRAIT, PEUT) communiquent l'intention :
- **DOIT** — exigence absolue
- **DEVRAIT** — recommandé, mais des exceptions existent
- **PEUT** — optionnel

### Ce qu'est une Spécification (et ce qu'elle n'est pas)

Une spécification est un **contrat de comportement**, pas un plan d'implémentation.

Bon contenu de spécification :
- Comportement observable sur lequel les utilisateurs ou les systèmes en aval s'appuient
- Entrées, sorties et conditions d'erreur
- Contraintes externes (sécurité, confidentialité, fiabilité, compatibilité)
- Scénarios qui peuvent être testés ou explicitement validés

À éviter dans les spécifications :
- Noms de classes/fonctions internes
- Choix de bibliothèques ou frameworks
- Détails d'implémentation étape par étape
- Plans d'exécution détaillés (ceux-ci appartiennent à `design.md` ou `tasks.md`)

Test rapide :
- Si l'implémentation peut changer sans modifier le comportement visible de l'extérieur, elle n'appartient probablement pas à la spécification.

### Restez Léger : Rigueur Progressive

OpenSpec vise à éviter la bureaucracie. Utilisez le niveau le plus léger qui rend tout de même la modification vérifiable.

**Spécification légère (par défaut) :**
- Exigences courtes centrées sur le comportement
- Portée et non-objectifs clairs
- Quelques vérifications d'acceptation concrètes

**Spécification complète (pour les risques plus élevés) :**
- Modifications inter-équipes ou inter-dépôts
- Changements d'API/contrat, migrations, préoccupations sécurité/confidentialité
- Modifications où l'ambiguïté est susceptible d'entraîner des retouches coûteuses

La plupart des modifications devraient rester en mode léger.

### Collaboration Humain + Agent

Dans de nombreuses équipes, les humains explorent et les agents rédigent des artefacts. La boucle prévue est :

1. L'humain fournit l'intention, le contexte et les contraintes.
2. L'agent convertit cela en exigences centrées sur le comportement et des scénarios.
3. L'agent conserve les détails d'implémentation dans `design.md` et `tasks.md`, pas dans `spec.md`.
4. La validation confirme la structure et la clarté avant l'implémentation.

Cela rend les spécifications lisibles pour les humains et cohérentes pour les agents.

## Modifications

Une modification est une modification proposée à votre système, empaquetée sous la forme d'un dossier contenant tout ce qui est nécessaire pour la comprendre et l'implémenter.

### Structure d'une Modification

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

### Pourquoi les Modifications sont des Dossiers

Empaqueter une modification sous la forme d'un dossier présente plusieurs avantages :

1. **Tout est regroupé.** Proposition, conception, tâches et spécifications vivent au même endroit. Pas besoin de chercher dans différents emplacements.

2. **Travail en parallèle.** Plusieurs modifications peuvent exister simultanément sans conflit. Travaillez sur `add-dark-mode` pendant que `fix-auth-bug` est également en cours.

3. **Historique propre.** Lorsqu'elles sont archivées, les modifications passent dans `changes/archive/` avec leur contexte complet préservé. Vous pouvez revenir en arrière et comprendre non seulement ce qui a changé, mais pourquoi.

4. **Facile à examiner.** Un dossier de modification est facile à examiner — ouvrez-le, lisez la proposition, vérifiez la conception, regardez les deltas de spécifications.

## Artefacts

Les artefacts sont les documents au sein d'une modification qui guident le travail.

### Le Flux des Artefacts

```
proposition ──────► spécifications ──────► conception ──────► tâches ──────► implémentation
    │               │             │              │
   pourquoi        quoi          comment       étapes
 + portée        changements   approche      à suivre
```

Les artefacts se construisent les uns sur les autres. Chaque artefact fournit le contexte pour le suivant.

### Types d'Artefacts

#### Proposition (`proposal.md`)

La proposition capture l'**intention**, la **portée** et l'**approche** à un niveau élevé.

```markdown
# Proposition : Ajouter le Mode Sombre

## Intention
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
Utiliser les propriétés CSS personnalisées pour le thématisation avec un contexte React
pour la gestion de l'état. Détecter les préférences système au premier chargement,
permettre une surcharge manuelle.
```

**Quand mettre à jour la proposition :**
- La portée change (réduction ou expansion)
- L'intention s'éclaircit (meilleure compréhension du problème)
- L'approche change fondamentalement

#### Spécifications (spécifications delta dans `specs/`)

Les spécifications delta décrivent **ce qui change** par rapport aux spécifications actuelles. Voir [Spécifications Delta](#spécifications-delta) ci-dessous.

#### Conception (`design.md`)

La conception capture l'**approche technique** et les **décisions d'architecture**.

````markdown
# Conception : Ajouter le Mode Sombre

## Approche Technique
L'état du thème géré via React Context pour éviter le prop drilling.
Les propriétés CSS personnalisées permettent le basculement à l'exécution sans modification de classes.
````

## Décisions d'architecture

### Décision : Context plutôt que Redux
Utilisation de React Context pour l'état du thème car :
- État binaire simple (clair/sombre)
- Pas de transitions d'état complexes
- Évite d'ajouter une dépendance à Redux

### Décision : Propriétés CSS personnalisées
Utilisation de variables CSS plutôt que CSS-in-JS car :
- Fonctionne avec la feuille de style existante
- Pas de surcharge à l'exécution
- Solution native aux navigateurs

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

Les tâches constituent la **liste de contrôle d'implémentation** — des étapes concrètes avec des cases à cocher.

```markdown
# Tâches

## 1. Infrastructure du thème
- [ ] 1.1 Créer ThemeContext avec l'état clair/sombre
- [ ] 1.2 Ajouter les propriétés CSS personnalisées pour les couleurs
- [ ] 1.3 Implémenter la persistance dans localStorage
- [ ] 1.4 Ajouter la détection des préférences système

## 2. Composants de l'interface
- [ ] 2.1 Créer le composant ThemeToggle
- [ ] 2.2 Ajouter le bouton de basculement à la page des paramètres
- [ ] 2.3 Mettre à jour l'en-tête pour inclure le basculement rapide

## 3. Style
- [ ] 3.1 Définir la palette de couleurs du thème sombre
- [ ] 3.2 Mettre à jour les composants pour utiliser les variables CSS
- [ ] 3.3 Tester les ratios de contraste pour l'accessibilité
```

**Bonnes pratiques pour les tâches :**
- Regroupez les tâches connexes sous des titres
- Utilisez une numérotation hiérarchique (1.1, 1.2, etc.)
- Gardez les tâches suffisamment petites pour être terminées en une session
- Cochez les tâches au fur et à mesure de leur réalisation

## Spécifications Delta

Les spécifications delta sont le concept clé qui permet à OpenSpec de fonctionner pour le développement sur code existant. Elles décrivent **ce qui change** plutôt que de répéter l'ensemble de la spécification.

### Le format

```markdown
# Delta pour Auth

## Exigences AJOUTÉES

### Exigence : Authentification à deux facteurs
Le système DOIT supporter l'authentification à deux facteurs basée sur TOTP.

#### Scénario : Inscription à l'A2F
- ÉTANT DONNÉ un utilisateur sans A2F activée
- QUAND l'utilisateur active l'A2F dans les paramètres
- ALORS un code QR est affiché pour la configuration de l'application d'authentification
- ET l'utilisateur doit vérifier avec un code avant l'activation

#### Scénario : Connexion avec A2F
- ÉTANT DONNÉ un utilisateur avec l'A2F activée
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
(Déprécié en faveur de l'A2F. Les utilisateurs doivent se ré-authentifier à chaque session.)
```

### Sections des deltas

| Section | Signification | Quand on archive |
|---------|---------------|------------------|
| `## Exigences AJOUTÉES` | Nouveau comportement | Ajouté à la spécification principale |
| `## Exigences MODIFIÉES` | Comportement modifié | Remplace l'exigence existante |
| `## Exigences SUPPRIMÉES` | Comportement déprécié | Supprimé de la spécification principale |

### Pourquoi des deltas plutôt que des spécifications complètes

**Clarté.** Un delta montre exactement ce qui change. En lisant une spécification complète, vous devriez la comparer mentalement avec la version actuelle.

**Évitement des conflits.** Deux modifications peuvent toucher le même fichier de spécification sans conflit, tant qu'elles modifient des exigences différentes.

**Efficacité de la revue.** Les réviseurs voient le changement, pas le contexte inchangé. Concentrez-vous sur l'essentiel.

**Adéquation au code existant.** La plupart des travaux modifient un comportement existant. Les deltas font des modifications une préoccupation première, pas une réflexion après coup.

## Schémas

Les schémas définissent les types d'artefacts et leurs dépendances pour un flux de travail.

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
    requires: [proposal]      # Nécessite proposal avant création

  - id: design
    generates: design.md
    requires: [proposal]      # Peut être créé en parallèle avec specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Nécessite specs et design en premier
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
   (nécessite:                  (nécessite:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (nécessite:
                specs, design)
```

**Les dépendances sont des facilitateurs, pas des portes.** Elles montrent ce qu'il est possible de créer, pas ce que vous devez créer ensuite. Vous pouvez ignorer design si vous n'en avez pas besoin. Vous pouvez créer specs avant ou après design — les deux ne dépendent que de proposal.

### Schémas intégrés

**spec-driven** (par défaut)

Le flux de travail standard pour le développement piloté par spécifications :

```
proposal → specs → design → tasks → implement
```

Idéal pour : La plupart des travaux de fonctionnalité où vous souhaitez vous mettre d'accord sur les spécifications avant l'implémentation.

### Schémas personnalisés

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
    requires: [research]   # Proposal informé par la recherche

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Ignorer specs/design, aller directement aux tâches
```

Consultez [Personnalisation](customization.md) pour les détails complets sur la création et l'utilisation de schémas personnalisés.

## Archivage

L'archivage termine une modification en fusionnant ses spécifications delta dans les spécifications principales et en préservant la modification pour l'historique.

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
│       └── spec.md        # Inclut maintenant les exigences A2F
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

1. **Fusionner les deltas.** Chaque section de spécification delta (AJOUTÉE/MODIFIÉE/SUPPRIMÉE) est appliquée à la spécification principale correspondante.

2. **Déplacer vers l'archive.** Le dossier de modification est déplacé dans `changes/archive/` avec un préfixe de date pour un ordre chronologique.

3. **Préserver le contexte.** Tous les artefacts restent intacts dans l'archive. Vous pouvez toujours revenir en arrière pour comprendre pourquoi une modification a été faite.

### Pourquoi l'archivage est important

**État propre.** Les modifications actives (`changes/`) ne montrent que le travail en cours. Le travail terminé est déplacé de côté.

**Piste d'audit.** L'archive préserve le contexte complet de chaque modification — pas seulement ce qui a changé, mais la proposition expliquant pourquoi, la conception expliquant comment, et les tâches montrant le travail effectué.

**Évolution des spécifications.** Les spécifications évoluent organiquement au fur et à mesure que les modifications sont archivées. Chaque archive fusionne ses deltas, construisant une spécification complète au fil du temps.

## Comment tout s'assemble

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           FLUX OPENSPEC                                      │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. DÉMARRER   │  /opsx:propose (de base) ou /opsx:new (étendu)         │
│   │     UNE        │                                                         │
│   │  MODIFICATION  │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CRÉER      │  /opsx:ff ou /opsx:continue (flux étendu)              │
│   │     LES        │  Crée proposal → specs → design → tasks                │
│   │  ARTEFACTS     │  (basé sur les dépendances du schéma)                  │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLÉMENTER│  /opsx:apply                                            │
│   │     LES        │  Traiter les tâches, les cocher au fur et à mesure     │
│   │  TÂCHES        │◄──── Mettre à jour les artefacts au fur et à mesure    │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VÉRIFIER   │  /opsx:verify (optionnel)                              │
│   │     LE         │  Vérifier que l'implémentation correspond aux specs    │
│   │  TRAVAIL       │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVER   │────►│  Les spécifications delta fusionnent dans   │    │
│   │     LA         │     │  les spécifications principales             │    │
│   │  MODIFICATION  │     │  Le dossier de modification est déplacé     │    │
│   └────────────────┘     │  dans archive/                             │    │
│                          │  Les specs sont maintenant la source de     │    │
│                          │  vérité mise à jour                         │    │
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
6. La prochaine modification se base sur les spécifications mises à jour

## Glossaire

| Terme | Définition |
|-------|------------|
| **Artefact** | Un document au sein d'un changement (proposition, conception, tâches ou spécifications delta) |
| **Archivage** | Le processus de finalisation d'un changement et de fusion de ses deltas dans les spécifications principales |
| **Changement** | Une modification proposée au système, regroupée sous forme de dossier contenant des artefacts |
| **Spécification delta** | Une spécification décrivant les modifications (AJOUTÉ/MODIFIÉ/SUPPRIMÉ) par rapport aux spécifications actuelles |
| **Domaine** | Un regroupement logique pour les spécifications (par ex., `auth/`, `payments/`) |
| **Exigence** | Un comportement spécifique que le système doit avoir |
| **Scénario** | Un exemple concret d'une exigence, généralement au format Étant donné/Quand/Alors |
| **Schéma** | Une définition des types d'artefacts et de leurs dépendances |
| **Spécification** | Une spécification décrivant le comportement du système, contenant des exigences et des scénarios |
| **Source de vérité** | Le répertoire `openspec/specs/`, contenant le comportement actuellement convenu |

## Prochaines étapes

- [Pour commencer](getting-started.md) - Premiers pas pratiques
- [Flux de travail](workflows.md) - Modèles courants et quand utiliser chacun
- [Commandes](commands.md) - Référence complète des commandes
- [Personnalisation](customization.md) - Créer des schémas personnalisés et configurer votre projet