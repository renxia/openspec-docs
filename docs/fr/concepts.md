# Concepts

Ce guide explique les concepts fondamentaux d'OpenSpec et la manière dont ils s'articulent. Pour une utilisation pratique, consultez [Prise en main](getting-started.md) et [Flux de travail](workflows.md).

## Philosophie

OpenSpec repose sur quatre principes :

```
fluide, pas rigide         — pas de portes de phase, travaillez sur ce qui a du sens
itératif, pas en cascade   — apprenez au fur et à mesure que vous construisez, affinez au fil du processus
simple, pas complexe       — configuration légère, cérémonie minimale
priorité aux environnements existants        — fonctionne avec les bases de code existantes, pas seulement les projets greenfield
```

### Pourquoi ces principes sont-ils importants ?

**Fluide, pas rigide.** Les systèmes de spécification traditionnels vous enferment dans des phases : d'abord vous planifiez, puis vous implémentez, puis c'est terminé. OpenSpec est plus flexible — vous pouvez créer des artefacts dans n'importe quel ordre qui a du sens pour votre travail.

**Itératif, pas en cascade.** Les exigences évoluent. La compréhension s'approfondit. Ce qui semblait être une bonne approche au départ peut ne pas tenir la route une fois que vous avez pris connaissance de la base de code. OpenSpec embrasse cette réalité.

**Simple, pas complexe.** Certains frameworks de spécification nécessitent une configuration poussée, des formats rigides ou des processus lourds. OpenSpec ne se met pas en travers de votre chemin. Initialisez-le en quelques secondes, commencez à travailler immédiatement, et ne le personnalisez que si vous en avez besoin.

**Priorité aux environnements existants.** La plupart des travaux de développement logiciel ne consistent pas à construire à partir de zéro, mais à modifier des systèmes existants. L'approche basée sur les deltas d'OpenSpec permet de spécifier facilement des modifications de comportement existant, et pas seulement de décrire de nouveaux systèmes.

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
│   │  Fonctionnement     │ merge│  Chaque modification = un      │   │
│   │  actuel du système  │      │  dossier                      │   │
│   │                     │      │  Contient des artefacts +      │   │
│   │                     │      │  deltas                       │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Les specs** sont la source de vérité : elles décrivent le comportement actuel de votre système.

**Les modifications** sont des changements proposés : ils sont stockés dans des dossiers séparés jusqu'à ce que vous soyez prêt à les fusionner.

Cette séparation est essentielle. Vous pouvez travailler sur plusieurs modifications en parallèle sans conflits. Vous pouvez examiner une modification avant qu'elle n'affecte les specs principales. Et lorsque vous archivez une modification, ses deltas fusionnent proprement dans la source de vérité.

## Spécifications

Les spécifications décrivent le comportement de votre système à l'aide d'exigences structurées et de scénarios.

### Structure

```
openspec/specs/
├── auth/
│   └── spec.md           # Comportement de l'authentification
├── payments/
│   └── spec.md           # Traitement des paiements
├── notifications/
│   └── spec.md           # Système de notifications
└── ui/
    └── spec.md           # Comportement de l'interface utilisateur et thèmes
```

Organisez les spécifications par domaine : des regroupements logiques adaptés à votre système. Motifs courants :

- **Par zone fonctionnelle** : `auth/`, `payments/`, `search/`
- **Par composant** : `api/`, `frontend/`, `workers/`
- **Par contexte délimité** : `ordering/`, `fulfillment/`, `inventory/`

### Format des spécifications

Une spécification contient des exigences, et chaque exigence comporte des scénarios :

```markdown
# Spécification de l'authentification

## Objectif
Authentification et gestion des sessions pour l'application.

## Exigences

### Exigence : Authentification des utilisateurs
Le système SHALL délivre un jeton JWT lors d'une connexion réussie.

#### Scénario : Identifiants valides
- GIVEN un utilisateur avec des identifiants valides
- WHEN l'utilisateur soumet le formulaire de connexion
- THEN un jeton JWT est retourné
- AND l'utilisateur est redirigé vers le tableau de bord

#### Scénario : Identifiants invalides
- GIVEN des identifiants invalides
- WHEN l'utilisateur soumet le formulaire de connexion
- THEN un message d'erreur est affiché
- AND aucun jeton n'est délivré

### Exigence : Expiration de la session
Le système MUST expirer les sessions après 30 minutes d'inactivité.

#### Scénario : Délai d'inactivité
- GIVEN une session authentifiée
- WHEN 30 minutes s'écoulent sans activité
- THEN la session est invalidée
- AND l'utilisateur doit se réauthentifier
```

**Éléments clés :**

| Élément | Objectif |
|---------|---------|
| `## Purpose` | Description de haut niveau du domaine couvert par cette spécification |
| `### Requirement:` | Un comportement spécifique que le système doit avoir |
| `#### Scenario:` | Un exemple concret de l'exigence en action |
| SHALL/MUST/SHOULD | Mots-clés RFC 2119 indiquant la force de l'exigence |

### Pourquoi structurer les spécifications de cette manière

**Les exigences sont le « quoi »** : elles indiquent ce que le système doit faire sans préciser l'implémentation.

**Les scénarios sont le « quand »** : ils fournissent des exemples concrets vérifiables. Les bons scénarios :
- Sont testables (vous pourriez écrire un test automatisé pour ceux-ci)
- Couvrent à la fois le cas nominal et les cas limites
- Utilisent le format structuré Given/When/Then ou similaire

**Les mots-clés RFC 2119** (SHALL, MUST, SHOULD, MAY) communiquent l'intention :
- **MUST/SHALL** : exigence absolue
- **SHOULD** : recommandé, mais des exceptions existent
- **MAY** : optionnel

### Ce qu'est (et n'est pas) une spécification

Une spécification est un **contrat de comportement**, pas un plan d'implémentation.

Contenu adapté à une spécification :
- Comportement observable sur lequel les utilisateurs ou les systèmes en aval s'appuient
- Entrées, sorties et conditions d'erreur
- Contraintes externes (sécurité, confidentialité, fiabilité, compatibilité)
- Scénarios pouvant être testés ou validés explicitement

À éviter dans les spécifications :
- Noms de classes ou de fonctions internes
- Choix de bibliothèques ou de frameworks
- Détails de l'implémentation étape par étape
- Plans d'exécution détaillés (ceux-ci appartiennent aux fichiers `design.md` ou `tasks.md`)

Test rapide :
- Si l'implémentation peut être modifiée sans changer le comportement visible de l'extérieur, elle n'a probablement pas sa place dans la spécification.

### Restez léger : rigueur progressive

OpenSpec vise à éviter la bureaucratie. Utilisez le niveau de rigueur le plus faible qui permette tout de même de vérifier la modification.

**Spécification allégée (par défaut) :**
- Exigences courtes centrées sur le comportement
- Périmètre et hors périmètre clairs
- Quelques critères d'acceptation concrets

**Spécification complète (pour les risques plus élevés) :**
- Modifications inter-équipes ou inter-dépôts
- Modifications d'API/contrat, migrations, préoccupations liées à la sécurité/confidentialité
- Modifications pour lesquelles l'ambiguïté est susceptible d'entraîner des retouches coûteuses

La plupart des modifications doivent rester en mode allégé.

### Collaboration entre humains et agents

Dans de nombreuses équipes, les humains explorent et les agents rédigent les artefacts. Le cycle prévu est le suivant :

1. L'humain fournit l'intention, le contexte et les contraintes.
2. L'agent convertit cela en exigences et scénarios centrés sur le comportement.
3. L'agent conserve les détails d'implémentation dans les fichiers `design.md` et `tasks.md`, et non dans `spec.md`.
4. La validation confirme la structure et la clarté avant l'implémentation.

Cela permet de garder les spécifications lisibles pour les humains et cohérentes pour les agents.

## Modifications

Une modification est un changement proposé pour votre système, conditionné sous la forme d'un dossier contenant tout ce qui est nécessaire pour le comprendre et l'implémenter.

### Structure d'une modification

```
openspec/changes/add-dark-mode/
├── proposal.md           # Pourquoi et quoi
├── design.md             # Comment (approche technique)
├── tasks.md              # Liste de tâches d'implémentation
├── .openspec.yaml        # Métadonnées de la modification (optionnel) : schéma, date de création, skip_specs
└── specs/                # Spécifications delta
    └── ui/
        └── spec.md       # Ce qui change dans ui/spec.md
```

Chaque modification est autonome. Elle contient :
- **Artefacts** : documents qui capturent l'intention, la conception et les tâches
- **Spécifications delta** : spécifications de ce qui est ajouté, modifié ou supprimé
- **Métadonnées** : configuration optionnelle pour cette modification spécifique

### Pourquoi les modifications sont-elles conditionnées sous forme de dossiers ?

Conditionner une modification sous la forme d'un dossier présente plusieurs avantages :

1. **Tout au même endroit.** La proposition, la conception, les tâches et les spécifications sont regroupées au même endroit. Pas besoin de chercher dans différents emplacements.
2. **Travail en parallèle.** Plusieurs modifications peuvent coexister simultanément sans conflit. Vous pouvez travailler sur `add-dark-mode` pendant que `fix-auth-bug` est également en cours.
3. **Historique propre.** Lorsqu'elles sont archivées, les modifications sont déplacées vers `changes/archive/` avec l'ensemble de leur contexte préservé. Vous pouvez consulter l'historique et comprendre non seulement ce qui a changé, mais aussi pourquoi.
4. **Facile à examiner.** Un dossier de modification est simple à passer en revue : ouvrez-le, lisez la proposition, consultez la conception, visualisez les deltas des spécifications.

## Artefacts

Les artefacts sont les documents d'une modification qui guident le travail.

### Flux des artefacts

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   pourquoi        quoi          comment       étapes
 + périmètre     changements    approche      à suivre
```

Les artefacts s'appuient les uns sur les autres. Chaque artefact fournit le contexte pour le suivant.

### Types d'artefacts

#### Proposition (`proposal.md`)

La proposition capture l'**intention**, le **périmètre** et l'**approche** à un niveau élevé.

```markdown
# Proposition : Ajouter le mode sombre

## Intention
Les utilisateurs ont demandé une option de mode sombre pour réduire la fatigue oculaire lors d'une utilisation nocturne et correspondre aux préférences système.

## Périmètre
Dans le périmètre :
- Bascule de thème dans les paramètres
- Détection des préférences système
- Persistance de la préférence dans localStorage

Hors périmètre :
- Thèmes de couleurs personnalisés (travail futur)
- Remplacements de thème par page

## Approche
Utilisez des propriétés CSS personnalisées pour le theming avec un contexte React pour la gestion d'état. Détectez la préférence système au premier chargement, autorisez la substitution manuelle.
```

**Quand mettre à jour la proposition :**
- Changements de périmètre (réduction ou extension)
- Précision de l'intention (meilleure compréhension du problème)
- Changement fondamental de l'approche

#### Spécifications (spécifications delta dans `specs/`)

Les spécifications delta décrivent **ce qui change** par rapport aux spécifications actuelles. Voir [Spécifications delta](#delta-specs) ci-dessous.

#### Conception (`design.md`)

La conception capture l'**approche technique** et les **décisions d'architecture**.

````markdown
# Conception : Ajouter le mode sombre

## Approche technique
L'état du thème est géré via un contexte React pour éviter le prop drilling.
Les propriétés CSS personnalisées permettent un changement à l'exécution sans bascule de classes.

## Décisions d'architecture

### Décision : Contexte plutôt que Redux
Utilisation d'un contexte React pour l'état du thème car :
- État binaire simple (clair/sombre)
- Pas de transitions d'état complexes
- Évite d'ajouter une dépendance à Redux

### Décision : Propriétés CSS personnalisées
Utilisation de variables CSS au lieu de CSS-in-JS car :
- Compatible avec la feuille de style existante
- Pas de surcoût à l'exécution
- Solution native du navigateur

## Flux de données
```
ThemeProvider (contexte)
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
- L'implémentation révèle que l'approche ne fonctionne pas
- Une meilleure solution est découverte
- Les dépendances ou les contraintes changent

#### Tâches (`tasks.md`)

Les tâches constituent la **liste de vérification de l'implémentation** : des étapes concrètes avec des cases à cocher.

```markdown
# Tâches

## 1. Infrastructure du thème
- [ ] 1.1 Créer ThemeContext avec l'état clair/sombre
- [ ] 1.2 Ajouter des propriétés CSS personnalisées pour les couleurs
- [ ] 1.3 Implémenter la persistance dans localStorage
- [ ] 1.4 Ajouter la détection des préférences système

## 2. Composants de l'interface utilisateur
- [ ] 2.1 Créer le composant ThemeToggle
- [ ] 2.2 Ajouter la bascule sur la page des paramètres
- [ ] 2.3 Mettre à jour l'en-tête pour ajouter une bascule rapide

## 3. Style
- [ ] 3.1 Définir la palette de couleurs du thème sombre
- [ ] 3.2 Mettre à jour les composants pour utiliser les variables CSS
- [ ] 3.3 Tester les rapports de contraste pour l'accessibilité
```

**Bonnes pratiques pour les tâches :**
- Grouper les tâches associées sous des titres
- Utiliser une numérotation hiérarchique (1.1, 1.2, etc.)
- Garder les tâches suffisamment petites pour être terminées en une seule session
- Cocher les tâches au fur et à mesure de leur réalisation

## Spécifications delta

Les spécifications delta sont le concept clé qui permet à OpenSpec de fonctionner pour le développement de projets existants (brownfield). Elles décrivent **ce qui change** plutôt que de reformuler l'ensemble de la spécification.

### Le format

```markdown
# Delta pour l'authentification

## Exigences AJOUTÉES

### Exigence : Authentification à deux facteurs
Le système DOIT prendre en charge l'authentification à deux facteurs basée sur TOTP.

#### Scénario : Inscription à l'A2F
- GIVEN un utilisateur sans A2F activée
- WHEN l'utilisateur active l'A2F dans les paramètres
- THEN un code QR est affiché pour la configuration de l'application d'authentification
- AND l'utilisateur doit vérifier avec un code avant l'activation

#### Scénario : Connexion avec A2F
- GIVEN un utilisateur avec A2F activée
- WHEN l'utilisateur soumet des identifiants valides
- THEN un défi OTP est présenté
- AND la connexion ne s'effectue qu'après un OTP valide

## Exigences MODIFIÉES

### Exigence : Expiration de la session
Le système DOIT expirer les sessions après 15 minutes d'inactivité.
(Précédemment : 30 minutes)

#### Scénario : Délai d'inactivité
- GIVEN une session authentifiée
- WHEN 15 minutes s'écoulent sans activité
- THEN la session est invalidée

## Exigences SUPPRIMÉES

### Exigence : Rester connecté
(Déprécié au profit de l'A2F. Les utilisateurs doivent se réauthentifier à chaque session.)
```

### Sections des deltas

| Section | Signification | Ce qui se passe lors de l'archivage |
|---------|---------------|-------------------------------------|
| `## ADDED Requirements` | Nouveau comportement | Ajouté à la spécification principale |
| `## MODIFIED Requirements` | Comportement modifié | Remplace l'exigence existante |
| `## REMOVED Requirements` | Comportement déprécié | Supprimé de la spécification principale |

### Pourquoi des deltas plutôt que des spécifications complètes

**Clarté.** Un delta montre exactement ce qui change. Lors de la lecture d'une spécification complète, vous devriez faire la différence mentalement avec la version actuelle.

**Évitement des conflits.** Deux modifications peuvent toucher le même fichier de spécification sans conflit, tant qu'elles modifient des exigences différentes.

**Efficacité de la revue.** Les relecteurs voient le changement, pas le contexte inchangé. Ils se concentrent sur ce qui est important.

**Adaptation aux projets existants (brownfield).** La plupart des travaux modifient un comportement existant. Les deltas font des modifications un élément de premier plan, pas une réflexion après coup.

## Schémas

Les schémas définissent les types d'artefacts et leurs dépendances pour un flux de travail.

### Fonctionnement des schémas

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Aucune dépendance, peut être créé en premier

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Nécessite le proposal avant d'être créé

  - id: design
    generates: design.md
    requires: [proposal]      # Peut être créé en parallèle des specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Nécessite à la fois les specs et le design en premier
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

**Les dépendances sont des activateurs, pas des verrous.** Elles indiquent ce qu'il est possible de créer, et non ce que vous devez créer ensuite. Vous pouvez ignorer le design si vous n'en avez pas besoin. Vous pouvez créer les specs avant ou après le design — les deux ne dépendent que du proposal.

### Schémas intégrés

**spec-driven** (par défaut)

Le flux de travail standard pour le développement piloté par les spécifications :

```
proposal → specs → design → tasks → implement
```

Idéal pour : La plupart des travaux sur des fonctionnalités pour lesquels vous souhaitez vous accorder sur les specs avant la mise en œuvre.

### Schémas personnalisés

Créez des schémas personnalisés adaptés au flux de travail de votre équipe :

```bash
# Créer depuis zéro
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
    requires: []           # Effectuez la recherche en premier

  - id: proposal
    generates: proposal.md
    requires: [research]   # Le proposal est informé par la recherche

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Ignorez les specs et le design, passez directement aux tâches
```

Consultez la page [Personnalisation](customization.md) pour plus de détails sur la création et l'utilisation de schémas personnalisés.

## Archivage

L'archivage permet de finaliser une modification en fusionnant ses specs delta dans les specs principales et en conservant la modification pour l'historique.

### Ce qui se passe lors de l'archivage

```
Before archive :

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


After archive :

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Inclut désormais les exigences 2FA
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Conservé pour l'historique
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Le processus d'archivage

1. **Fusion des deltas.** Chaque section de spec delta (AJOUTÉ/MODIFIÉ/SUPPRIMÉ) est appliquée à la spec principale correspondante.
2. **Déplacement vers l'archive.** Le dossier de modification est déplacé vers `changes/archive/` avec un préfixe de date pour un classement chronologique.
3. **Conservation du contexte.** Tous les artefacts restent intacts dans l'archive. Vous pouvez toujours consulter l'historique pour comprendre pourquoi une modification a été effectuée.

### Pourquoi l'archivage est important

**État propre.** Les modifications actives (`changes/`) n'affichent que le travail en cours. Le travail terminé est déplacé hors du chemin.

**Piste d'audit.** L'archive conserve le contexte complet de chaque modification — pas seulement ce qui a changé, mais aussi le proposal expliquant pourquoi, le design expliquant comment et les tâches montrant le travail effectué.

**Évolution des specs.** Les specs se développent de manière organique au fur et à mesure que les modifications sont archivées. Chaque archivage fusionne ses deltas, constituant progressivement une spécification complète au fil du temps.

## Comment tout s'articule

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FLUX OPENSPEC                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. DÉBUT DE   │  /opsx:propose (core) ou /opsx:new (expanded)           │
│   │     LA MODIF.  │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CRÉATION   │  /opsx:ff ou /opsx:continue (expanded workflow)         │
│   │  DES ARTEFACTS │  Crée le proposal → les specs → le design → les tâches  │
│   │                │  (en fonction des dépendances des schémas)              │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. MISE EN    │  /opsx:apply                                            │
│   │  ŒUVRE DES     │  Traitez les tâches une par une en les cochant          │
│   │     TÂCHES     │◄──── Mettez à jour les artefacts au fur et à mesure      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VÉRIF. DU  │  /opsx:verify (facultatif)                              │
│   │     TRAVAIL    │  Vérifiez que la mise en œuvre correspond aux specs     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVAGE  │────►│  Les specs delta sont fusionnées dans les specs │    │
│   │  DE LA MODIF.  │     │  principales                                  │    │
│   └────────────────┘     │  Le dossier de modification est déplacé vers    │    │
│                          │  archive/                                      │    │
│                          │  Les specs constituent désormais la source de    │    │
│                          │  vérité mise à jour                             │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Le cycle vertueux :**

1. Les specs décrivent le comportement actuel
2. Les modifications proposent des changements (sous forme de deltas)
3. La mise en œuvre concrétise les changements
4. L'archivage fusionne les deltas dans les specs
5. Les specs décrivent désormais le nouveau comportement
6. La modification suivante s'appuie sur les specs mises à jour

## Glossaire

| Terme | Définition |
|-------|------------|
| **Artefact** | Un document au sein d'une modification (proposal, design, tâches ou specs delta) |
| **Archive** | Le processus de finalisation d'une modification et de fusion de ses deltas dans les specs principales |
| **Modification** | Une modification proposée du système, conditionnée sous forme de dossier contenant des artefacts |
| **Spec delta** | Une spec qui décrit les changements (AJOUTÉ/MODIFIÉ/SUPPRIMÉ) par rapport aux specs actuelles |
| **Domaine** | Un regroupement logique pour les specs (ex. : `auth/`, `payments/`) |
| **Exigence** | Un comportement spécifique que le système doit avoir |
| **Scénario** | Un exemple concret d'une exigence, généralement au format Given/When/Then |
| **Schéma** | Une définition des types d'artefacts et de leurs dépendances |
| **Spec** | Une spécification décrivant le comportement du système, contenant des exigences et des scénarios |
| **Source de vérité** | Le répertoire `openspec/specs/`, contenant le comportement actuel convenu |

## Prochaines étapes

- [Prise en main](getting-started.md) - Premières étapes pratiques
- [Flux de travail](workflows.md) - Schémas courants et cas d'usage de chacun
- [Commandes](commands.md) - Référence complète des commandes
- [Personnalisation](customization.md) - Créez des schémas personnalisés et configurez votre projet