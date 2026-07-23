# Migration vers OPSX

Ce guide vous aide à passer de l'ancien workflow OpenSpec à OPSX. La migration est conçue pour être fluide : votre travail existant est préservé, et le nouveau système offre plus de flexibilité.

## Qu'est-ce qui change ?

OPSX remplace l'ancien workflow verrouillé par phases par une approche fluide basée sur les actions. Voici le changement clé :

| Critère | Ancien système | OPSX |
|--------|--------|------|
| **Commandes** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Par défaut : `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (commandes de workflow étendu facultatives) |
| **Workflow** | Créer tous les artefacts en une seule fois | Créer de manière incrémentale ou en une seule fois : vous choisissez |
| **Retour en arrière** | Portes de phase contraignantes | Naturel : mettez à jour n'importe quel artefact à tout moment |
| **Personnalisation** | Structure fixe | Pilotée par schéma, entièrement hackable |
| **Configuration** | `CLAUDE.md` avec marqueurs + `project.md` | Configuration propre dans `openspec/config.yaml` |

**Le changement de philosophie :** Le travail n'est pas linéaire. OPSX arrête de prétendre le contraire.

---

## Avant de commencer

### Votre travail existant est préservé

Le processus de migration est conçu pour préserver vos données :

- **Modifications actives dans `openspec/changes/`** — Entièrement préservées. Vous pouvez les poursuivre avec les commandes OPSX.
- **Modifications archivées** — Intactes. Votre historique reste préservé.
- **Spécifications principales dans `openspec/specs/`** — Intactes. Ce sont vos sources de vérité.
- **Votre contenu dans CLAUDE.md, AGENTS.md, etc.** — Préservé. Seuls les blocs de marqueurs OpenSpec sont supprimés ; tout ce que vous avez écrit reste.

### Ce qui est supprimé

Seuls les fichiers gérés par OpenSpec en cours de remplacement sont supprimés :

| Ce qui est supprimé | Pourquoi |
|---------------------|----------|
| Répertoires/fichiers de commandes slash hérités | Remplacés par le nouveau système de compétences |
| `openspec/AGENTS.md` | Déclencheur de workflow obsolète |
| Marqueurs OpenSpec dans `CLAUDE.md`, `AGENTS.md`, etc. | Ne sont plus nécessaires |

**Emplacements des commandes héritées par outil** (exemples — votre outil peut varier) :

- Claude Code : `.claude/commands/openspec/`
- Cursor : `.cursor/commands/openspec-*.md`
- Windsurf : `.windsurf/workflows/openspec-*.md`
- Cline : `.cinerules/workflows/openspec-*.md`
- Roo : `.roo/commands/openspec-*.md`
- GitHub Copilot : `.github/prompts/openspec-*.prompt.md` (extensions IDE uniquement ; non pris en charge dans l'interface CLI de Copilot)
- Codex : OpenSpec utilise désormais `.codex/skills/openspec-*` ; le nettoyage des fichiers hérités ne cible que les noms de fichiers de prompts autorisés par OpenSpec dans `$CODEX_HOME/prompts` ou `~/.codex/prompts`, et ne les supprime que lorsque les compétences de remplacement existent.
- Et d'autres (Augment, Continue, Amazon Q, etc.)

La migration détecte les outils que vous avez configurés et nettoie leurs fichiers hérités.

La liste des suppressions peut sembler longue, mais il s'agit de fichiers qui ont tous été créés à l'origine par OpenSpec. Votre propre contenu n'est jamais supprimé.

### Ce qui nécessite votre attention

Un fichier nécessite une migration manuelle :

**`openspec/project.md`** — Ce fichier n'est pas supprimé automatiquement car il peut contenir du contexte de projet que vous avez rédigé. Vous devrez :

1. Examiner son contenu
2. Déplacer le contexte utile vers `openspec/config.yaml` (voir les conseils ci-dessous)
3. Supprimer le fichier une fois que c'est fait

**Pourquoi nous avons fait ce changement :**

L'ancien `project.md` était passif : les agents pouvaient le lire, ne pas le lire, ou oublier ce qu'ils avaient lu. Nous avons constaté que la fiabilité était inconstante.

Le contexte du nouveau `config.yaml` est **activement injecté dans chaque demande de planification OpenSpec**. Cela signifie que vos conventions de projet, votre stack technique et vos règles sont toujours présentes lorsque l'IA crée des artefacts. Fiabilité accrue.

**Le compromis :**

Comme le contexte est injecté dans chaque demande, vous devrez être concis. Concentrez-vous sur ce qui compte vraiment :
- Stack technique et conventions clés
- Contraintes non évidentes que l'IA doit connaître
- Règles qui étaient souvent ignorées auparavant

Ne vous inquiétez pas de faire quelque chose de parfait. Nous apprenons encore ce qui fonctionne le mieux ici, et nous améliorerons le fonctionnement de l'injection de contexte au fil de nos expérimentations.

---

## Exécuter la migration

Les commandes `openspec init` et `openspec update` détectent toutes deux les fichiers hérités et vous guident dans le même processus de nettoyage. Utilisez celle qui correspond à votre situation :

- Les nouvelles installations utilisent par défaut le profil `core` (`propose`, `explore`, `apply`, `sync`, `archive`).
- Les installations migrées préservent vos workflows précédemment installés en écrivant un profil `custom` si nécessaire.

### Utiliser `openspec init`

Exécutez cette commande si vous souhaitez ajouter de nouveaux outils ou reconfigurer les outils déjà configurés :

```bash
openspec init
```

La commande init détecte les fichiers hérités et vous guide dans le nettoyage :

```
Mise à niveau vers le nouveau OpenSpec

OpenSpec utilise désormais les compétences d'agents, la norme émergente parmi les agents de codage. Cela simplifie votre configuration tout en conservant le fonctionnement de l'ensemble des fonctionnalités comme avant.

Fichiers à supprimer
Aucun contenu utilisateur à préserver :
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Fichiers à mettre à jour
Les marqueurs OpenSpec seront supprimés, votre contenu préservé :
  • CLAUDE.md
  • AGENTS.md

Nécessite votre attention
  • openspec/project.md
    Nous ne supprimerons pas ce fichier. Il peut contenir du contexte de projet utile.

    Le nouveau fichier openspec/config.yaml dispose d'une section « context: » pour le contexte de planification. Celle-ci est incluse dans chaque demande OpenSpec et fonctionne de manière plus fiable que l'ancienne approche avec project.md.

    Examinez project.md, déplacez tout contenu utile vers la section context de config.yaml, puis supprimez le fichier une fois que c'est fait.

? Mettre à niveau et nettoyer les fichiers hérités ? (Y/n)
```

**Ce qui se passe lorsque vous répondez oui :**

1. Les répertoires de commandes slash hérités sont supprimés
2. Les marqueurs OpenSpec sont retirés de `CLAUDE.md`, `AGENTS.md`, etc. (votre contenu reste)
3. `openspec/AGENTS.md` est supprimé
4. Les nouvelles compétences sont installées dans `.claude/skills/`
5. `openspec/config.yaml` est créé avec un schéma par défaut

### Utiliser `openspec update`

Exécutez cette commande si vous souhaitez simplement migrer et mettre à jour vos outils existants vers la dernière version :

```bash
openspec update
```

La commande de mise à jour détecte et nettoie également les artefacts hérités, puis actualise les compétences/commandes générées pour correspondre à votre profil actuel et à vos paramètres de livraison.

### Environnements non interactifs / CI

Pour les migrations scriptées :

```bash
openspec init --force --tools claude
```

L'option `--force` ignore les invites et accepte automatiquement le nettoyage.

Cela inclut le nettoyage des fichiers de prompts Codex gérés par OpenSpec dans le répertoire global de prompts Codex. Le nettoyage ne cible que les noms de fichiers de prompts Codex hérités autorisés par OpenSpec, ne les supprime que lorsque les compétences de remplacement `.codex/skills/openspec-*` existent, et préserve tous les autres fichiers.

---

## Migrer project.md vers config.yaml

L'ancien fichier `openspec/project.md` était un fichier markdown libre pour le contexte de projet. Le nouveau `openspec/config.yaml` est structuré et, surtout, **injecté dans chaque demande de planification** afin que vos conventions soient toujours présentes lorsque l'IA travaille.

### Avant (project.md)

```markdown
# Project Context

This is a TypeScript monorepo using React and Node.js.
We use Jest for testing and follow strict ESLint rules.
Our API is RESTful and documented in docs/api.md.

## Conventions

- All public APIs must maintain backwards compatibility
- New features should include tests
- Use Given/When/Then format for specifications
```

### Après (config.yaml)

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  Testing: Jest with React Testing Library
  API: RESTful, documented in docs/api.md
  We maintain backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan for risky changes
  specs:
    - Use Given/When/Then format for scenarios
    - Reference existing patterns before inventing new ones
  design:
    - Include sequence diagrams for complex flows
```

### Différences clés

| project.md | config.yaml |
|------------|-------------|
| Markdown libre | YAML structuré |
| Un seul bloc de texte | Contexte séparé et règles par artefact |
| Utilisation peu claire | Le contexte apparaît dans TOUS les artefacts ; les règles n'apparaissent que pour les artefacts correspondants |
| Pas de sélection de schéma | Le champ explicite `schema:` définit le workflow par défaut |

### Ce qu'il faut conserver, ce qu'il faut supprimer

Lors de la migration, soyez sélectif. Posez-vous la question : « L'IA a-t-elle besoin de cela pour *chaque* demande de planification ? »

**Bons candidats pour `context:`**
- Stack technique (langages, frameworks, bases de données)
- Modèles architecturaux clés (monorepo, microservices, etc.)
- Contraintes non évidentes (« nous ne pouvons pas utiliser la bibliothèque X parce que... »)
- Conventions critiques qui sont souvent ignorées

**À déplacer plutôt dans `rules:`**
- Formatage spécifique à un artefact (« utiliser le format Given/When/Then dans les spécifications »)
- Critères de revue (« les propositions doivent inclure des plans de retour en arrière »)
- Celles-ci n'apparaissent que pour l'artefact correspondant, ce qui allège les autres demandes

**À exclure complètement**
- Bonnes pratiques générales que l'IA connaît déjà
- Explications verbeuses qui pourraient être résumées
- Contexte historique qui n'affecte pas le travail actuel

### Étapes de migration

1. **Créez config.yaml** (s'il n'a pas déjà été créé par init) :
   ```yaml
   schema: spec-driven
   ```

2. **Ajoutez votre contexte** (soyez concis — cela est injecté dans chaque demande) :
   ```yaml
   context: |
     Votre contexte de projet ici.
     Concentrez-vous sur ce que l'IA a vraiment besoin de savoir.
   ```

3. **Ajoutez des règles par artefact** (facultatif) :
   ```yaml
   rules:
     proposal:
       - Vos conseils spécifiques aux propositions
     specs:
       - Vos règles de rédaction de spécifications
   ```

4. **Supprimez project.md** une fois que vous avez déplacé tout ce qui est utile.

**Ne vous creusez pas la tête.** Commencez par l'essentiel et améliorez au fur et à mesure. Si vous remarquez que l'IA oublie quelque chose d'important, ajoutez-le. Si le contexte semble trop volumineux, réduisez-le. C'est un document vivant.

### Besoin d'aide ? Utilisez ce prompt

Si vous ne savez pas comment résumer votre project.md, demandez à votre assistant IA :

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

L'IA vous aidera à identifier ce qui est essentiel par rapport à ce qui peut être supprimé.

---

## Les nouvelles commandes

La disponibilité des commandes dépend du profil :

**Profil par défaut (`core`) :**

| Commande | Objectif |
|----------|----------|
| `/opsx:propose` | Créer une modification et générer des artefacts de planification en une seule étape |
| `/opsx:explore` | Réfléchir à des idées sans structure |
| `/opsx:apply` | Mettre en œuvre les tâches de tasks.md |
| `/opsx:archive` | Finaliser et archiver la modification |

**Workflow étendu (sélection personnalisée) :**

| Commande | Objectif |
|----------|----------|
| `/opsx:new` | Démarrer un nouveau squelette de modification |
| `/opsx:continue` | Créer l'artefact suivant (un par un) |
| `/opsx:ff` | Avance rapide — créer tous les artefacts de planification d'un coup |
| `/opsx:verify` | Valider que l'implémentation correspond aux spécifications |
| `/opsx:sync` | Fusionner les spécifications delta dans les spécifications principales |
| `/opsx:bulk-archive` | Archiver plusieurs modifications à la fois |
| `/opsx:onboard` | Workflow d'onboarding guidé de bout en bout |

Activez les commandes étendues avec `openspec config profile`, puis exécutez `openspec update`.

### Correspondance des commandes héritées

| Hérité | Équivalent OPSX |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (par défaut) ou `/opsx:new` puis `/opsx:ff` (étendu) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Nouvelles fonctionnalités

Ces fonctionnalités font partie de l'ensemble de commandes du workflow étendu.

**Création d'artefacts granulaire :**
```
/opsx:continue
```
Crée un artefact à la fois en fonction des dépendances. Utilisez cette commande lorsque vous souhaitez examiner chaque étape.

**Mode exploration :**
```
/opsx:explore
```
Réfléchissez à des idées avec un partenaire avant de vous engager dans une modification.

---

## Comprendre la nouvelle architecture

### D'un workflow verrouillé par phases à un workflow fluide

L'ancien workflow imposait une progression linéaire :

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  PLANIFICATION│ ───► │ IMPLÉMENTATION│ ───► │  ARCHIVAGE   │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

Si vous êtes en phase d'implémentation et vous rendez compte que la conception est erronée ?
Dommage. Les portes de phase ne vous permettent pas de revenir en arrière facilement.
```

OPSX utilise des actions, pas des phases :

```
         ┌───────────────────────────────────────────────┐
         │           ACTIONS (pas des phases)            │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │               dans n'importe quel ordre       │
         └───────────────────────────────────────────────┘
```

### Graphe des dépendances

Les artefacts forment un graphe orienté. Les dépendances sont des activateurs, pas des portes :

```
                        proposal
                       (nœud racine)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (nécessite :                (nécessite :
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (nécessite :
                     specs, design)
```

Lorsque vous exécutez `/opsx:continue`, la commande vérifie ce qui est prêt et vous propose l'artefact suivant. Vous pouvez également créer plusieurs artefacts prêts dans n'importe quel ordre.

### Compétences vs Commandes

L'ancien système utilisait des fichiers de commandes spécifiques à chaque outil :

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX utilise la norme émergente des **compétences** :

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Les compétences sont reconnues par de nombreux outils de codage IA et fournissent des métadonnées plus riches.

Codex est exclusivement basé sur les compétences dans OPSX. OpenSpec ne génère plus de fichiers de prompts personnalisés pour Codex ; utilisez plutôt les répertoires `.codex/skills/openspec-*` générés.

## Poursuivre des modifications existantes

Vos modifications en cours fonctionnent parfaitement avec les commandes OPSX.

**Vous avez une modification active issue de l'ancien workflow ?**

```
/opsx:apply add-my-feature
```

OPSX lit les artefacts existants et reprend là où vous vous étiez arrêté.

**Vous voulez ajouter d'autres artefacts à une modification existante ?**

```
/opsx:continue add-my-feature
```

Affiche ce qui est prêt à être créé en fonction de ce qui existe déjà.

**Vous avez besoin de consulter l'état ?**

```bash
openspec status --change add-my-feature
```

---

## Le nouveau système de configuration

### Structure de `config.yaml`

```yaml
# Obligatoire : Schéma par défaut pour les nouvelles modifications
schema: spec-driven

# Facultatif : Contexte du projet (50 Ko maximum)
# Injecté dans TOUTES les instructions des artefacts
context: |
  Contexte de votre projet, pile technologique,
  conventions et contraintes.

# Facultatif : Règles par artefact
# Injectées uniquement dans les artefacts correspondants
rules:
  proposal:
    - Inclure un plan de retour en arrière
  specs:
    - Utiliser le format Given/When/Then
  design:
    - Documenter les stratégies de secours
  tasks:
    - Découper en blocs d'une durée maximale de 2 heures
```

### Résolution du schéma

Pour déterminer quel schéma utiliser, OPSX vérifie dans l'ordre suivant :

1. **Indicateur CLI** : `--schema <nom>` (priorité la plus élevée)
2. **Métadonnées de la modification** : `.openspec.yaml` dans le répertoire de la modification
3. **Configuration du projet** : `openspec/config.yaml`
4. **Par défaut** : `spec-driven`

### Schémas disponibles

| Schéma | Artefacts | Idéal pour |
|--------|-----------|------------|
| `spec-driven` | proposal → specs → design → tasks | La plupart des projets |

Lister tous les schémas disponibles :

```bash
openspec schemas
```

### Schémas personnalisés

Créez votre propre workflow :

```bash
openspec schema init my-workflow
```

Ou dupliquez un schéma existant :

```bash
openspec schema fork spec-driven my-workflow
```

Consultez [Personnalisation](customization.md) pour plus de détails.

---

## Dépannage

### « Fichiers hérités détectés en mode non interactif »

Vous exécutez l'outil dans un environnement CI ou non interactif. Utilisez :

```bash
openspec init --force
```

### Les commandes n'apparaissent pas après la migration

Redémarrez votre IDE. Les compétences sont détectées au démarrage.

### « ID d'artefact inconnu dans les règles »

Vérifiez que les clés de votre `rules:` correspondent aux ID d'artefacts de votre schéma :
- **spec-driven** : `proposal`, `specs`, `design`, `tasks`

Exécutez cette commande pour afficher les ID d'artefacts valides :

```bash
openspec schemas --json
```

### La configuration n'est pas appliquée

1. Vérifiez que le fichier se trouve bien à l'emplacement `openspec/config.yaml` (et non `.yml`)
2. Validez la syntaxe YAML
3. Les modifications de configuration prennent effet immédiatement, aucun redémarrage n'est nécessaire

### Le fichier `project.md` n'a pas été migré

Le système préserve intentionnellement `project.md` car il peut contenir votre contenu personnalisé. Vérifiez-le manuellement, déplacez les parties utiles vers `config.yaml`, puis supprimez-le.

### Vous voulez voir ce qui serait nettoyé ?

Exécutez la commande `init` et refusez l'invite de nettoyage : vous verrez le résumé complet de la détection sans qu'aucune modification ne soit apportée.

---

## Référence rapide

### Fichiers après migration

```
project/
├── openspec/
│   ├── specs/                    # Inchangé
│   ├── changes/                  # Inchangé
│   │   └── archive/              # Inchangé
│   └── config.yaml               # NOUVEAU : Configuration du projet
├── .claude/
│   └── skills/                   # NOUVEAU : Compétences OPSX
│       ├── openspec-propose/     # profil core par défaut
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # le profil étendu ajoute new/continue/ff/etc.
├── CLAUDE.md                     # Marqueurs OpenSpec supprimés, votre contenu préservé
└── AGENTS.md                     # Marqueurs OpenSpec supprimés, votre contenu préservé
```

### Ce qui a été supprimé

- `.claude/commands/openspec/` — remplacé par `.claude/skills/`
- `openspec/AGENTS.md` — obsolète
- `openspec/project.md` — migrer vers `config.yaml`, puis supprimer
- Blocs de marqueurs OpenSpec dans `CLAUDE.md`, `AGENTS.md`, etc.

### Aide-mémoire des commandes

```text
/opsx:propose      Démarrer rapidement (profil core par défaut)
/opsx:apply        Implémenter les tâches
/opsx:archive      Terminer et archiver

# Workflow étendu (si activé) :
/opsx:new          Générer le squelette d'une modification
/opsx:continue     Créer l'artefact suivant
/opsx:ff           Créer les artefacts de planification
```

---

## Obtenir de l'aide

- **Discord** : [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues** : [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Documentation** : [docs/opsx.md](opsx.md) pour la référence complète d'OPSX