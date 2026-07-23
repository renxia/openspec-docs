# Stores : le plan dans son propre dépôt

> **Bêta.** Les stores, références, contexte de travail et ensembles de travaux sont nouveaux. Les noms de commandes, les drapeaux, les formats de fichiers et la sortie JSON peuvent encore évoluer entre les versions. Toutes les procédures pas à pas ci-dessous ont été exécutées sur la build actuelle, mais relisez ce guide après une mise à jour.

## Le problème que cela résout

OpenSpec réside normalement dans un seul dépôt de code : un dossier `openspec/` à côté de votre code, contenant les spécifications et les modifications de ce dépôt.

Cela ne fonctionne plus dès que votre planification dépasse le cadre d'un seul dépôt :
- Votre travail s'étend sur plusieurs dépôts : une fonctionnalité touche le serveur API, l'application web et une bibliothèque partagée. Dans quel dossier `openspec/` le plan doit-il résider ?
- Votre équipe planifie avant même que le code n'existe, ou planifie des éléments qui ne deviendront jamais du code dans *ce* dépôt.
- Les exigences sont détenues par une équipe et consommées par d'autres. La version du wiki dérive, et votre agent de codage ne peut de toute façon pas la lire.

Un **store** est la solution : un dépôt autonome dont l'unique rôle est la planification. Il présente la même structure `openspec/` que vous connaissez déjà — spécifications et modifications — ainsi qu'un petit fichier d'identité. Vous l'enregistrez une seule fois sur votre machine, par son nom, et ensuite toutes les commandes OpenSpec classiques peuvent fonctionner dessus depuis n'importe où.

## La structure

```
            team-plans  (un magasin : la planification dans son propre dépôt)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      ce qui est vrai
                └── changes/    ce qui est en mouvement
                      ▲
                      │ enregistré sur chaque machine par nom ;
                      │ partagé en pushant/clonant comme n'importe quel dépôt
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

Deux règles gardent ceci simple :

1. **Un magasin n'est qu'un dépôt Git.** Vous le commitez, le poussez, le tirez et le révisez vous-même. OpenSpec ne clone, ne synchronise ni ne pousse jamais quoi que ce soit de sa propre initiative.
2. **Des déclarations, pas de mécanique.** Les dépôts peuvent *déclarer* comment ils se rapportent aux magasins (voir ci-dessous). Les déclarations modifient ce qu'OpenSpec peut vous dire — jamais l'emplacement sur lequel agissent vos commandes.

## Cinq minutes pour créer votre premier magasin

Deux commandes vous font passer de rien à un changement fonctionnel, lié à un magasin :

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

C'est tout le modèle. À partir de là, le cycle de vie est exactement ce que vous connaissez — `status`, `instructions`, `validate`, `archive` — avec `--store team-plans` sur chaque commande, et chaque indication affichée inclut le drapeau pour vous. La ligne `Using OpenSpec root:` indique toujours sur quel emplacement une commande agit.

## Histoire : une équipe, un dépôt de planification

Une équipe conserve ses spécifications et ses changements dans `team-plans` au lieu de les disperser dans les dépôts de code.

**Jour un (la personne qui le configure) :**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Passer `--remote` enregistre l'URL de clonage dans le fichier d'identité propre au magasin (`.openspec-store/store.yaml`), lors du commit initial. Chaque futur clone sait d'où il vient dès sa création, donc les vérifications d'état et les messages d'erreur peuvent afficher une correction complète, prête à être collée, pour les membres de l'équipe qui ne l'ont pas encore.

**Chaque membre de l'équipe (une fois par machine) :**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

Par la suite, tout le monde travaille dans le même dépôt de planification par nom :

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**Le partage de travail passe par Git, exprès.** Un changement que vous créez n'existe que dans votre copie de travail jusqu'à ce que vous le commitiez et le poussiez — tout comme le code. Les plans obtiennent des branches, des pull requests et des revues gratuitement, car un magasin est un dépôt ordinaire.

**Connexion des dépôts de code de l'équipe.** Un dépôt de code dont la planification est entièrement externalisée n'a besoin que d'une seule ligne, dans `openspec/config.yaml` :

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Désormais, toute commande OpenSpec exécutée dans `web-app` agit sur `team-plans` sans aucun drapeau :

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

Le pointeur est une solution de repli, jamais une priorité : un `--store` explicite l'emporte toujours, et si le dépôt développe ses propres dossiers de planification réels, ceux-ci l'emportent (avec un avertissement vous invitant à supprimer le pointeur obsolète).

**Une valeur par défaut pour chaque dépôt sur votre machine.** Si vous travaillez sur de nombreux dépôts de code qui planifient tous dans le même magasin, définissez-la une fois, globalement, au lieu d'ajouter la ligne `store:` à chaque dépôt :

```bash
openspec config set defaultStore team-plans
```

Désormais, toute commande exécutée en dehors d'une racine de planification — et sans `--store` ni pointeur de projet — se résout vers `team-plans`. Elle se situe au bas de la liste de priorité, donc `--store`, une racine locale et un pointeur `store:` de projet l'emportent toujours. La bannière de racine et le bloc JSON `root` indiquent `source: "global_default"` avec l'identifiant du magasin, donc vous pouvez toujours distinguer une valeur par défaut propre à la machine du pointeur d'un dépôt. Supprimez-la avec `openspec config unset defaultStore`. Si l'identifiant n'est pas enregistré, les commandes renvoient une erreur et vous invitent à l'enregistrer ou à supprimer la valeur par défaut obsolète.

## Histoire : des exigences qui traversent les limites des équipes

Une équipe plateforme possède les exigences. Les équipes produit développent en s'appuyant sur celles-ci, dans leurs propres dépôts, avec leurs propres conceptions. Une référence décrit cette relation sans déplacer le travail de personne.

```
   platform-reqs (magasin)                 api-server (dépôt de code)
   appartenant à l'équipe plateforme            appartenant à une équipe produit
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ lit      │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (leurs propres conceptions)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (leur propre travail)       │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**L'équipe produit déclare ce sur quoi elle s'appuie dans le fichier `openspec/config.yaml` de son dépôt :**

```yaml
references:
  - platform-reqs
```

Les références sont un contexte en lecture seule. Le dépôt conserve sa propre racine `openspec/` ; le travail reste là-bas. Ce qui change : `openspec instructions` dans ce dépôt inclut désormais un index des spécifications du magasin référencé — chacune avec un résumé d'une ligne et la commande de récupération exacte (`openspec show <spec-id> --type spec --store platform-reqs`). Un agent travaillant dans `api-server` peut trouver les exigences de paiement amont, les citer et écrire sa conception bas niveau dans la propre racine du dépôt — sans que personne n'ait à copier du contexte.

Une référence peut porter sa source de clonage, donc les membres de l'équipe qui n'ont pas encore le magasin obtiennent une correction complète au lieu d'une impasse :

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Lorsque vous voulez avoir le plan et le code ouverts en même temps, créez un workset (ensemble de travail).** Celui-ci est personnel et explicite : chaque personne choisit les dossiers avec lesquels elle travaille réellement sur sa machine. Rien concernant ces chemins de copie de travail locaux n'est commité dans le dépôt de planification partagé.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Deux questions que vous pouvez toujours poser

**« Ma configuration est-elle saine ? »** — `openspec doctor` vérifie la racine actuelle et ses magasins référencés, en lecture seule, avec une correction prête à être collée par résultat :

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Referenced store 'design-system' is not registered on this machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**« Sur quoi est-ce que je travaille ? »** — `openspec context` assemble l'ensemble de travail à partir des déclarations OpenSpec : la racine et les magasins qu'elle référence.

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

Les deux prennent en charge `--json` pour les agents. `openspec context --code-workspace <chemin>` écrit en plus un fichier d'espace de travail VS Code contenant l'ensemble complet — la seule écriture effectuée par cette commande.

## Worksets : rouvrez les dossiers sur lesquels vous travaillez ensemble

Indépendamment de tout ce qui précède : la plupart des gens ouvrent les mêmes quelques dossiers ensemble à chaque session — le dépôt de planification plus deux ou trois dépôts de code. Un **workset** est une vue personnelle et nommée de exactement cela, rouverte avec une seule commande dans l'outil de votre choix.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       les trois s'ouvrent dans votre outil
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (s'ouvre dans VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` lance ensuite l'outil enregistré : les éditeurs (VS Code, Cursor) ouvrent une seule fenêtre avec tous les membres et reviennent. Le premier membre est le principal. Remplacez l'outil à tout moment avec `--tool <id>`.

Les worksets ne sont volontairement pas un état partagé. Ils résident sur votre machine, ne sont jamais commités et ne font aucune affirmation sur le travail — ils enregistrent seulement ce que vous aimez ouvrir ensemble. En supprimer un ne touche jamais les dossiers membres. Les nouveaux outils sont de la configuration, pas du code : tout ce qui est lancé via un fichier d'espace de travail ou des drapeaux de rattachement par dossier peut être ajouté sous la clé `openers` dans la configuration globale (`openspec config edit`).

## Comment les commandes décident de l'emplacement sur lequel elles agissent

Toute commande normale résout sa racine de la même manière, dans cet ordre :

```
1. --store <id>          vous l'avez spécifié explicitement        → ce magasin
2. nearest openspec/     une vraie racine de planification ici     → ce dépôt
   (en remontant depuis cwd)
3. store: pointer        config.yaml déclare un magasin  → ce magasin
4. defaultStore          la configuration globale définit une valeur par défaut pour la machine  → ce magasin
5. none of the above     des magasins enregistrés sur cette machine ?                        → erreur avec un indicateur de sélection
                         aucun magasin enregistré ?         → le répertoire courant
                                                          (comportement classique)
```

La ligne `Using OpenSpec root:` (et le bloc `root` dans la sortie `--json`) vous indique dans quel cas vous vous trouvez.

## Limitations connues

- **Forme bêta.** Tout ce qui se trouve sur cette page peut changer entre les versions — noms, drapeaux, formats de fichiers, clés JSON.
- **Une seule copie de travail par identifiant de magasin et par machine.** L'enregistrement d'une deuxième copie de travail sous le même identifiant échoue avec un indicateur vous invitant à exécuter `store unregister` d'abord.
- **Aucune synchronisation, jamais — par conception.** OpenSpec ne clone, ne tire ni ne pousse jamais. Une copie de travail obsolète affiche des spécifications obsolètes jusqu'à ce que vous la tiriez ; les références sont indexées en direct à partir de ce qui se trouve sur le disque.
- **Les dossiers de planification vides peuvent être absents.** Un nouveau magasin peut ne pas encore avoir `openspec/changes/`, `openspec/specs/` ou `openspec/changes/archive/` dans Git. Cela est accepté pendant la bêta ; ces dossiers apparaissent une fois que les commandes normales créent des fichiers pour eux.
- **Les dépôts pointeurs restent des pointeurs.** Un dépôt contenant uniquement de la configuration dont le fichier `openspec/config.yaml` déclare `store: <id>` est traité comme une planification externalisée, et non comme une copie de travail de magasin à enregistrer. Supprimez d'abord la ligne `store:` si vous voulez intentionnellement convertir ce dépôt en racine de magasin local.
- **Certaines commandes restent à leur emplacement.** `view`, `templates`, `schemas` et les formes nominales dépréciées (`openspec change show`, ...) agissent uniquement sur le répertoire courant — pas de `--store`.
- **L'état par machine est propre à chaque machine.** Le registre des magasins et les worksets sont des paramètres locaux. Rien concernant la configuration de votre machine n'est jamais commité dans la planification partagée.
- **Deux styles de lancement pour les worksets.** Un outil qui ne peut pas être lancé avec un fichier d'espace de travail ou des drapeaux de rattachement par dossier ne peut pas être ajouté en tant qu'ouvreur.
- **Le JSON des agents présente une division de casse connue** (les clés de la famille `store` sont en `snake_case`, celles de la famille `workflow` en `camelCase`). Cela est documenté dans le [contrat des agents](../agent-contract.md) ; son unification est reportée à une release versionnée.

## Où sont stockés les éléments

| Élément | Emplacement | Partagé ? |
|---|---|---|
| La planification d'un magasin | `<store>/openspec/` (spécifications, changements) | Oui — effectuez un commit et un push |
| L'identité d'un magasin | `<store>/.openspec-store/store.yaml` | Oui — commité avec le magasin |
| Le registre des magasins | `<data dir>/openspec/stores/registry.yaml` | Non — uniquement sur cette machine |
| Worksets | `<data dir>/openspec/worksets/` | Non — uniquement sur cette machine |

`<data dir>` correspond à `~/.local/share/openspec` sur macOS et Linux (ou `$XDG_DATA_HOME/openspec` lorsqu'elle est définie), et `%LOCALAPPDATA%\openspec` sur Windows.

## Référence

Les flags exacts et les schémas JSON de toutes les commandes de cette page :
[CLI reference](../cli.md) (Magasins, Doctor, Contexte de travail, Worksets
personnels) et le [agent contract](../agent-contract.md).