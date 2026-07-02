# Fonctionnement des commandes

**La seule chose à savoir : OpenSpec possède deux types de commandes, et elles s'exécutent dans deux endroits différents.**

- Les commandes `openspec ...` s'exécutent dans votre **terminal**. (Exemple : `openspec init`.)
- Les commandes `/opsx:...` s'exécutent dans le **chat de votre assistant IA**. (Exemple : `/opsx:propose`.)

Si vous tapez `/opsx:propose` dans votre terminal et que rien ne se passe, cette page explique pourquoi. Vous parlez à la mauvaise partie d'OpenSpec. Les commandes slash ne sont pas des commandes de terminal. Ce sont des instructions que vous donnez à votre assistant de codage IA, dans la même boîte de dialogue où vous taperiez normalement « ajouter un formulaire de connexion ».

Cette seule distinction est le plus grand obstacle pour les nouveaux utilisateurs, alors rendons-la parfaitement claire.

## Les deux parties

OpenSpec est un projet qui porte deux casquettes.

**Le CLI (la partie terminal).** Un programme nommé `openspec` que vous installez et exécutez depuis votre shell. Il configure votre projet, liste et valide les changements, affiche un tableau de bord et archive le travail terminé. Vous tapez ces commandes dans iTerm, le terminal VS Code, PowerShell, partout où vous exécuteriez `git` ou `npm`.

```bash
openspec init        # configurer OpenSpec dans ce projet
openspec list        # voir les changements actifs
openspec view        # ouvrir le tableau de bord interactif
```

**Les commandes slash (la partie chat).** De courtes commandes comme `/opsx:propose` et `/opsx:apply` que vous tapez dans votre assistant IA. Elles indiquent à l'IA de suivre le flux de travail OpenSpec : rédiger une proposition, écrire les spécifications, construire à partir de la liste des tâches, archiver lorsque c'est terminé. Vous les tapez dans Claude Code, Cursor, Windsurf, Copilot ou quel que soit l'assistant que vous utilisez.

```text
/opsx:propose add-dark-mode    (tapé dans votre chat IA)
/opsx:apply                    (tapé dans votre chat IA)
/opsx:archive                  (tapé dans votre chat IA)
```

Voici le modèle mental en une image :

```text
        VOTRE TERMINAL                         LE CHAT DE VOTRE ASSISTANT IA
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   installe    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   les commandes │  /opsx:archive                │
   └──────────────────────┘    & compétences   └──────────────────────────────┘
        exécutez openspec ici                       exécutez /opsx:* ici
```

Remarquez la flèche. L'exécution de `openspec init` dans votre terminal est ce qui *installe* les commandes slash dans votre outil IA. La partie terminal configure la partie chat. Après cela, le travail quotidien se déroule principalement dans le chat.

## « Comment je démarre le mode interactif ? »

**Il n'y a pas de mode interactif séparé à démarrer.** Cette question revient souvent, elle mérite donc une réponse simple.

Vous n'entrez pas dans un mode OpenSpec spécial. Vous ouvrez simplement votre assistant de codage IA comme d'habitude et tapez une commande slash dans le chat. La commande slash *est* la façon dont vous « entrez » dans OpenSpec. Votre assistant la reconnaît, charge la compétence (skill) OpenSpec correspondante et commence à suivre le flux de travail.

Les véritables instructions sont donc les suivantes :

1. Ouvrez votre assistant de codage IA (Claude Code, Cursor, Windsurf, etc.) dans votre projet.
2. Tapez `/opsx:propose` dans son chat, au même endroit où vous tapez toute autre requête.
3. Observez l'autocomplétion : si OpenSpec est installé, vous verrez `/opsx:propose`, `/opsx:apply` et d'autres apparaître lorsque vous tapez le slash.

C'est tout. Pas de mode à basculer, pas de démon à lancer, pas de fenêtre séparée.

Une chose qui est véritablement interactive réside dans le terminal : `openspec view`. Il ouvre un tableau de bord pour parcourir vos spécifications et changements. Mais il s'agit d'un visualiseur, pas de l'outil avec lequel vous proposez et construisez. La construction se fait via les commandes slash dans le chat.

## Pourquoi cette division existe

Il est utile de comprendre, car cela explique pourquoi OpenSpec fonctionne avec plus de 25 outils IA différents.

Le CLI est le **moteur**. Il connaît les règles : à quoi ressemble un dossier de changements, quels artefacts dépendent de quels autres, comment fusionner une spécification delta dans votre source de vérité. C'est la même chose partout.

Les commandes slash sont le **volant**, et chaque outil IA en a un légèrement différent. Claude Code les appelle des commandes. Cursor et Windsurf ont leurs propres formats. Certains outils les appellent des compétences (skills). Lorsque vous exécutez `openspec init`, OpenSpec génère le bon type de fichier pour chaque outil que vous avez sélectionné, afin que la même intention `/opsx:propose` fonctionne quel que soit l'assistant que vous préférez.

La force de cette conception : vous apprenez le flux de travail une seule fois et vous le transportez à travers les outils. Le compromis : la syntaxe exacte d'une commande peut différer légèrement entre les outils, ce qui est le sujet de la prochaine section.

## Syntaxe des commandes slash par outil

L'intention est identique partout. La ponctuation diffère. Utilisez le format qui correspond à votre assistant.

| Outil | Comment vous le tapez |
|------|-----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | style skill, par exemple `/skill:openspec-propose` |
| Trae | style skill, par exemple `/openspec-propose` |

La plupart des outils utilisent soit le format avec deux points (`/opsx:propose`) soit le format avec tiret (`/opsx-propose`). Quelques outils présentent OpenSpec comme des compétences nommées au lieu de commandes slash ; pour ceux-ci, vous invoquez la compétence par son nom. La liste complète par outil, y compris exactement quels fichiers sont écrits où, se trouve dans [Supported Tools](supported-tools.md).

En cas de doute, tapez un slash dans votre chat IA et regardez l'autocomplétion. Votre outil vous montrera le format qu'il attend.

## Comment les commandes sont arrivées : compétences (skills) et commandes

Lorsque vous exécutez `openspec init` (ou `openspec update`), OpenSpec écrit de petits fichiers dans votre projet afin que votre outil IA puisse trouver le flux de travail. Selon votre outil et vos paramètres, ce sont des **compétences (skills)**, des **commandes**, ou les deux.

- Les **Compétences** résident dans des endroits comme `.claude/skills/openspec-*/SKILL.md`. Ce sont la norme émergente inter-outils : un dossier d'instructions que votre assistant détecte automatiquement.
- Les **Commandes** résident dans des endroits comme `.claude/commands/opsx/<id>.md`. Ce sont les anciens fichiers de commandes slash spécifiques à l'outil.

Vous n'avez pas besoin de vous soucier de celui que votre outil utilise. Vous tapez simplement la commande slash et cela fonctionne. Mais savoir que ces fichiers existent aide lorsque quelque chose va mal : si vos commandes disparaissent, cela signifie généralement que ces fichiers sont manquants ou périmés, et `openspec update` les régénère.

Consultez [Supported Tools](supported-tools.md) pour les chemins exacts par outil, et [Migration Guide](migration-guide.md) pour savoir comment les compétences ont remplacé l'approche plus ancienne axée uniquement sur les commandes.

## Confirmer qu'il est installé

Vérifications rapides, le plus rapidement possible :

1. **Tapez un slash dans votre chat IA.** Commencez à taper `/opsx` et regardez s'il y a des suggestions d'autocomplétion. Si elles apparaissent, vous êtes prêt.
2. **Recherchez les fichiers.** Pour Claude Code, vérifiez que `.claude/skills/` contient des dossiers `openspec-*`. Les autres outils utilisent leurs propres répertoires ([Supported Tools](supported-tools.md) les liste).
3. **Répétez la configuration.** Depuis la racine de votre projet, exécutez `openspec update`. Cela régénère les fichiers de compétences et de commandes pour tous les outils que vous avez configurés.
4. **Redémarrez votre assistant.** De nombreux outils recherchent les compétences et les commandes au démarrage, une fenêtre fraîche peut donc être l'étape manquante.

## Quelles commandes ai-je ?

Par défaut, OpenSpec installe l'ensemble de base des commandes slash :

- `/opsx:explore`: réfléchir à une idée avec l'IA avant de s'engager dans un changement (une excellente première étape lorsque vous n'êtes pas sûr)
- `/opsx:propose`: créer un changement et rédiger tous ses artefacts de planification en une seule étape
- `/opsx:apply`: construire le changement en parcourant sa liste de tâches
- `/opsx:sync`: fusionner les mises à jour des spécifications d'un changement dans vos spécifications principales (généralement automatique)
- `/opsx:archive`: terminer un changement et l'archiver

Un bon rythme par défaut : `explore` lorsque vous réfléchissez à ce que vous devez faire, puis `propose`, `apply`, `archive`. Le guide [Explore First](explore.md) explique pourquoi cette étape initiale est bénéfique.

Il existe également un ensemble **étendu** pour les personnes qui veulent un contrôle plus fin (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Vous l'activez avec `openspec config profile`, puis vous l'appliquez avec `openspec update`.

Nouveau dans tout cela ? `/opsx:onboard` (dans l'ensemble étendu) vous guide à travers un changement complet sur votre propre base de code, narrant chaque étape. C'est la présentation la plus conviviale possible.

Pour ce que fait chaque commande en détail, consultez [Commands](commands.md). Pour savoir quand utiliser laquelle, consultez [Workflows](workflows.md).

## Une première exécution propre

En résumé, voici toute la séquence avec chaque étape étiquetée par l'endroit où elle se produit.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (installe les commandes slash dans votre outil IA)

AI CHAT      /opsx:explore
              (optionnel : réfléchir à l'idée avec l'IA d'abord)

AI CHAT      /opsx:propose add-dark-mode
              (l'IA rédige la proposition, les spécifications, le design, les tâches)

AI CHAT      /opsx:apply
              (l'IA construit en cochant les tâches)

AI CHAT      /opsx:archive
              (le changement est fusionné dans vos spécifications et archivé)
```

Deux étapes de terminal pour la configuration. Ensuite, vous travaillez dans le chat. C'est le rythme à suivre.

## Liens connexes

- [Getting Started](getting-started.md): le guide complet du premier changement
- [Commands](commands.md): chaque commande slash en détail
- [CLI](cli.md): chaque commande de terminal en détail
- [Supported Tools](supported-tools.md): syntaxe et emplacements des fichiers par outil
- [FAQ](faq.md): réponses rapides supplémentaires
- [Troubleshooting](troubleshooting.md): corrections lorsque les commandes n'apparaissent pas