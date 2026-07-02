# Stores : Le plan dans son propre dépôt

> **Bêta.** Les stores, les références, le contexte de travail et les ensembles de travail sont nouveaux. Les noms de commandes, les drapeaux (flags), les formats de fichiers et la sortie JSON peuvent encore changer d'apparence entre les versions. Chaque guide pratique ci-dessous a été exécuté contre la version actuelle, mais veuillez relire ce guide après une mise à niveau.

## Le problème que cela résout

OpenSpec est normalement contenu dans un seul dépôt de code : un dossier `openspec/` à côté votre code, contenant les spécifications et les changements pour ce dépôt.

Ceci ne suffit plus lorsque votre planification dépasse le cadre d'un seul dépôt :

- Votre travail s'étend sur plusieurs dépôts — une fonctionnalité touche le serveur API, l'application web et une bibliothèque partagée. Dans quel dossier `openspec/` se trouve le plan ?
- Votre équipe planifie avant que le code n'existe, ou planifie des choses qui ne deviendront jamais du code dans *ce* dépôt.
- Les exigences sont détenues par une équipe et consommées par d'autres équipes. La version wiki dérive, et votre agent de codage ne peut pas la lire de toute façon.

Un **store** est la réponse : un dépôt autonome dont le seul travail est la planification. Il a la même forme `openspec/` que vous connaissez — spécifications et changements — plus un petit fichier d'identité. Vous l'enregistrez sur votre machine une fois, par nom, et ensuite chaque commande OpenSpec normale peut fonctionner dedans depuis n'importe où.

## La forme

```
            team-plans  (un store : la planification est dans son propre repo)
            ├── .openspec-store/store.yaml     identity: "Je suis team-plans"
            └── openspec/
                ├── specs/      ce qui est vrai
                └── changes/    ce qui est en mouvement
                      ▲
                      │ enregistré sur chaque machine par nom ;
                      │ partagé en poussant/clonant comme n'importe quel repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

Deux règles simplifient les choses :

1. **Un store est simplement un dépôt Git.** Vous le commitez, vous le poussez (push), vous le tirez (pull) et vous le revoyez vous-même. OpenSpec ne clone, ne synchronise ni ne pousse quoi que ce soit par lui-même.
2. **Déclarations, pas de machinerie.** Les dépôts peuvent *déclarer* comment ils se rapportent aux stores (montré ci-dessous). Ces déclarations changent ce qu'OpenSpec peut vous dire — jamais l'endroit où vos commandes agissent.

## Cinq minutes pour votre premier store

Deux commandes vous mènent de rien à un changement fonctionnel, limité au store :

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Next: run normal OpenSpec commands against this store, for example:
  openspec new change <change-id> --store team-plans
Share this store by committing and pushing it like any Git repo.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Next: openspec status --change add-login --store team-plans
```

C'est le modèle complet. À partir de là, le cycle de vie est exactement celui que vous connaissez — `status`, `instructions`, `validate`, `archive` — avec `--store team-plans` sur chaque commande, et chaque indice affiché porte le drapeau pour vous. La ligne `Using OpenSpec root:` indique toujours où une commande agit.

## Histoire : une équipe, un seul dépôt de planification

Une équipe conserve ses specs et ses changements dans `team-plans` au lieu de les disperser à travers plusieurs dépôts de code.

**Jour un (celui qui l'installe) :**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Le passage de `--remote` enregistre l'URL de clonage dans le fichier d'identité du store (`.openspec-store/store.yaml`), lors du commit initial. Chaque clonage futur est né en sachant d'où il venait, ce qui permet aux vérifications de santé et aux messages d'erreur d'afficher une correction complète et copiable pour les coéquipiers qui ne l'ont pas encore.

**Chaque coéquipier (une fois par machine) :**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

À partir de là, tout le monde travaille dans le même dépôt de planification par nom :

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**Le partage du travail est Git, et c'est intentionnel.** Une modification que vous créez n'existe que dans votre checkout jusqu'à ce que vous la commitiez et la poussiez — tout comme le code. Les plans bénéficient de branches, de pull requests et d'une revue gratuitement, car un store est un dépôt ordinaire.

**Connexion des dépôts de code de l'équipe.** Un dépôt de code dont la planification est entièrement externalisée a besoin d'une seule ligne, dans `openspec/config.yaml` :

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Désormais, chaque commande OpenSpec exécutée à l'intérieur de `web-app` agit sur `team-plans` sans aucun drapeau :

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

Le pointeur est une solution de repli, jamais un remplacement : un `--store` explicite l'emporte toujours, et si le dépôt grandit pour avoir ses propres dossiers de planification, ceux-ci priment (avec un avertissement pour supprimer le pointeur obsolète).

## Histoire : des exigences qui traversent les limites d'équipe

Une équipe plateforme possède les exigences. Les équipes produit construisent par rapport à ces exigences, dans leurs propres dépôts, avec leurs propres designs. Une référence décrit cette relation sans déplacer le travail de quiconque.

```
   platform-reqs (store)                 api-server (code repo)
   possédé par l'équipe plateforme            possédé par une équipe produit
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ lit      │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (leurs propres designs)    │
   │   travail plateforme      │          │ openspec/changes/        │
   │                          │          │   (leur propre travail)       │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**L'équipe produit déclare ce sur quoi elle se base** dans le `openspec/config.yaml` de son dépôt :

```yaml
references:
  - platform-reqs
```

Les références sont un contexte en lecture seule. Le dépôt conserve sa propre racine `openspec` ; le travail y reste. Ce qui change : `openspec instructions` dans ce dépôt inclut maintenant un index des spécifications du store référencé — chacune avec un résumé d'une ligne et la commande de récupération exacte (`openspec show <spec-id> --type spec --store platform-reqs`). Un agent travaillant dans `api-server` peut trouver les exigences de paiement en amont, les citer et écrire sa conception de bas niveau dans la racine du dépôt — sans que personne n'ait à copier le contexte.

Une référence peut contenir sa source de clonage, de sorte que les coéquipiers qui n'ont pas encore le store reçoivent une correction complète au lieu d'une impasse :

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Lorsque vous voulez le plan et le code ouverts ensemble, créez un workset.** C'est personnel et explicite : chaque personne choisit les dossiers sur lesquels elle travaille réellement sur sa machine. Rien concernant ces chemins de checkout locaux n'est commité dans le dépôt de planification partagé.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Deux questions que vous pouvez toujours poser

**"Mon installation est-elle saine ?"** — `openspec doctor` vérifie la racine actuelle et les stores référencés, en lecture seule, avec une correction copiable pour chaque constatation :

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Le store référencé 'design-system' n'est pas enregistré sur cette machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"Avec quoi suis-je en train de travailler ?"** — `openspec context` assemble le set de travail à partir des déclarations OpenSpec : la racine et les stores qu'il référence.

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

Les deux prennent en charge `--json` pour les agents. `openspec context --code-workspace <path>` écrit également un fichier d'espace de travail VS Code contenant l'ensemble — c'est la seule écriture que cette commande effectue.

## Worksets : rouvrir les dossiers sur lesquels vous travaillez ensemble

Séparément de tout ce qui précède : la plupart des gens ouvrent les mêmes quelques dossiers ensemble à chaque session — le dépôt de planification plus deux ou trois dépôts de code. Un **workset** est une vue personnelle et nommée de cela, rouverte avec une commande dans votre outil de choix.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       les trois ouverts dans votre outil
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (ouvert dans VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` lance ensuite l'outil enregistré : les éditeurs (VS Code, Cursor) ouvrent une fenêtre avec chaque membre et reviennent. Le premier membre est le primaire. Remplacez l'outil à tout moment avec `--tool <id>`.

Les Worksets ne sont *délibérément pas* un état partagé. Ils vivent sur votre machine, ne sont jamais commités et ne font aucune allégation sur le travail — ils enregistrent seulement ce que vous aimez avoir ouvert ensemble. La suppression de l'un n'affecte jamais les dossiers des membres. Les nouveaux outils sont une configuration, pas du code : tout ce qui est lancé via un fichier d'espace de travail ou des drapeaux d'attachement par dossier peut être ajouté sous la clé `openers` dans la configuration globale (`openspec config edit`).

## Comment les commandes décident où agir

Chaque commande normale résout sa racine de la même manière, dans cet ordre :

```
1. --store <id>          vous l'avez dit explicitement        → ce store
2. nearest openspec/     une vraie racine de planification ici   → ce dépôt
   (en remontant depuis le cwd)
3. store: pointeur        config.yaml déclare un store  → ce store
4. aucun des précédents    stores enregistrés sur cette machine? → erreur avec un
                         indication de sélection
                         aucun stores enregistrés?         → le répertoire actuel
                                                          (comportement classique)
```

La ligne `Using OpenSpec root:` (et le bloc `root` dans la sortie `--json`) vous indique quel cas est concerné.

## Limitations connues

- **Forme bêta.** Tout sur cette page peut changer entre les versions — noms, drapeaux, formats de fichiers, clés JSON.
- **Un seul checkout par ID de store par machine.** Tenter d'enregistrer un deuxième checkout sous le même ID échoue avec un indice pour `store unregister` en premier.
- **Aucune synchronisation, jamais — par conception.** OpenSpec ne clone, ne tire pas et ne pousse jamais. Un checkout obsolète montre des spécifications obsolètes jusqu'à ce que *vous* tiriez ; les références sont indexées en direct à partir de ce qui est sur le disque.
- **Certaines commandes restent telles quelles.** `view`, `templates`, `schemas` et les formes nominales dépréciées (`openspec change show`, ...) agissent uniquement sur le répertoire actuel — pas `--store`.
- **L'état par machine est propre à chaque machine.** Le registre des stores et les worksets sont des paramètres locaux. Rien de l'agencement de votre machine n'est jamais commité dans la planification partagée.
- **Deux styles de lancement pour les worksets.** Un outil qui ne peut pas être lancé avec un fichier d'espace de travail ou des drapeaux d'attachement par dossier ne peut pas être ajouté comme opener.
- **Le JSON de l'agent présente une division connue du casse** (les clés de la famille store sont en `snake_case`, les clés de la famille workflow sont en `camelCase`). Documenté dans le [contrat d'agent](../agent-contract.md) ; son unification est reportée à une version.

## Où les choses vivent

| Quoi | Où | Partagé? |
|---|---|---|
| La planification d'un store | `<store>/openspec/` (specs, changes) | Oui — commitez et poussez-le |
| L'identité d'un store | `<store>/.openspec-store/store.yaml` | Oui — commité avec le store |
| Le registre des stores | `<data dir>/openspec/stores/registry.yaml` | Non — ceci est propre à cette machine |
| Les Worksets | `<data dir>/openspec/worksets/` | Non — ceci est propre à cette machine |

`<data dir>` est `~/.local/share/openspec` sur macOS et Linux (ou `$XDG_DATA_HOME/openspec` si défini), et `%LOCALAPPDATA%\openspec` sur Windows.
## Référence

Drapeaux exacts et formes JSON pour chaque commande de cette page :
[CLI reference](../cli.md) (Stores, Doctor, Working context, Personal worksets) et le [contrat d'agent](../agent-contract.md).