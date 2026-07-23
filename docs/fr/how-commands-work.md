# Fonctionnement des commandes

**La seule chose à savoir : OpenSpec dispose de deux types de commandes, qui s'exécutent dans deux environnements différents.**

- Les commandes `openspec ...` s'exécutent dans votre **terminal**. (Exemple : `openspec init`.)
- Les commandes `/opsx:...` s'exécutent dans le **chat de votre assistant IA**. (Exemple : `/opsx:propose`.)

Si vous tapez jamais `/opsx:propose` dans votre terminal et que rien ne se passe, cette page explique pourquoi. Vous vous adressez à la mauvaise partie d'OpenSpec. Les commandes slash ne sont pas des commandes terminal. Ce sont des instructions que vous donnez à votre assistant de codage IA, dans la même zone de chat où vous taperiez normalement « ajouter un formulaire de connexion ».

Cette distinction unique est l'obstacle le plus fréquent pour les nouveaux utilisateurs, alors clarifions-la parfaitement.

## Les deux parties

OpenSpec est un seul projet qui porte deux casquettes.

**L'interface en ligne de commande (partie terminal).** Un programme nommé `openspec` que vous installez et exécutez depuis votre shell. Il configure votre projet, liste et valide les modifications, affiche un tableau de bord et archive les travaux terminés. Vous tapez ces commandes dans iTerm, le terminal de VS Code, PowerShell, ou tout autre endroit où vous exécuteriez `git` ou `npm`.

```bash
openspec init        # configurer OpenSpec dans ce projet
openspec list        # voir les modifications actives
openspec view        # ouvrir le tableau de bord interactif
```

**Les commandes slash (partie chat).** Des commandes courtes comme `/opsx:propose` et `/opsx:apply` que vous tapez dans votre assistant IA. Celles-ci indiquent à l'IA de suivre le flux de travail OpenSpec : rédiger une proposition, écrire les spécifications, construire à partir de la liste des tâches, archiver une fois terminé. Vous tapez ces commandes dans Claude Code, Cursor, Windsurf, Copilot, ou quel que soit l'assistant que vous utilisez.

```text
/opsx:propose add-dark-mode    (tapé dans le chat de votre IA)
/opsx:apply                    (tapé dans le chat de votre IA)
/opsx:archive                  (tapé dans le chat de votre IA)
```

Voici le modèle mental en une seule image :

```text
        VOTRE TERMINAL                         CHAT DE VOTRE ASSISTANT IA
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   installe    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   commandes   │  /opsx:archive                │
   └──────────────────────┘    & compétences └──────────────────────────────┘
        exécutez openspec ici                       exécutez /opsx:* ici
```

Remarquez la flèche. Exécuter `openspec init` dans votre terminal est ce qui *installe* les commandes slash dans votre outil IA. La partie terminal configure la partie chat. Par la suite, l'utilisation au quotidien se fait principalement dans le chat.

## « Comment lancer le mode interactif ? »

**Il n'existe pas de mode interactif séparé à lancer.** Cette question revient très souvent, elle mérite donc une réponse claire.

Vous n'avez pas à activer un mode OpenSpec spécial. Vous ouvrez simplement votre assistant de codage IA comme vous le faites habituellement, et vous tapez une commande slash dans le chat. La commande slash *est* la façon d'« entrer » dans OpenSpec. Votre assistant la reconnaît, charge la compétence OpenSpec correspondante et commence à suivre le flux de travail.

Les instructions réelles sont donc les suivantes :

1. Ouvrez votre assistant de codage IA (Claude Code, Cursor, Windsurf, etc.) dans votre projet.
2. Tapez `/opsx:propose` dans son chat, à l'endroit même où vous tapez toute autre demande.
3. Observez l'autocomplétion : si OpenSpec est installé, vous verrez `/opsx:propose`, `/opsx:apply` et d'autres commandes apparaître pendant que vous tapez le slash.

C'est tout. Pas de mode à activer, pas de démon à lancer, pas de fenêtre séparée.

Une fonctionnalité qui est réellement interactive se trouve dans le terminal : `openspec view`. Elle ouvre un tableau de bord pour parcourir vos spécifications et vos modifications. Mais c'est un outil de visualisation, pas l'outil avec lequel vous proposez et construisez. La construction se fait via des commandes slash dans le chat.

## Pourquoi cette séparation existe

Il est utile de comprendre ceci, car cela explique pourquoi OpenSpec fonctionne avec plus de 25 outils IA différents.

L'interface en ligne de commande est le **moteur**. Elle connaît les règles : à quoi ressemble un dossier de modification, quels artefacts dépendent de quels autres, comment fusionner une spécification delta dans votre source de vérité. Elle est identique partout.

Les commandes slash sont le **volant**, et chaque outil IA a le sien, légèrement différent. Claude Code les appelle des commandes. Cursor et Windsurf ont leurs propres formats. Certains outils les appellent des compétences. Lorsque vous exécutez `openspec init`, OpenSpec génère le type de fichier adapté à chaque outil que vous avez sélectionné, de sorte que la même intention `/opsx:propose` fonctionne quel que soit l'assistant que vous préférez.

Le point fort de cette conception : vous n'apprenez le flux de travail qu'une seule fois et vous l'utilisez sur tous les outils. Le compromis : la syntaxe exacte d'une commande peut légèrement différer d'un outil à l'autre, ce qui est abordé dans la section suivante.

## Syntaxe des commandes slash par outil

L'intention est identique partout. Seule la ponctuation diffère. Utilisez la forme correspondant à votre assistant.

| Outil | Comment le saisir |
|------|-----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | style compétence, ex. `/openspec-propose` |
| Codex | style compétence via `.codex/skills/openspec-*` |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | style compétence, ex. `/skill:openspec-propose` |
| Trae | `/opsx-propose`, `/opsx:apply` |

La plupart des outils utilisent soit la forme avec deux points (`/opsx:propose`), soit la forme avec tiret (`/opsx-propose`). Quelques outils affichent OpenSpec sous forme de compétences nommées au lieu de commandes slash ; pour ceux-ci, vous invoquez la compétence par son nom. La liste complète par outil, y compris l'emplacement exact des fichiers écrits, se trouve dans [Outils pris en charge](supported-tools.md).

En cas de doute, tapez un slash dans le chat de votre IA et regardez l'autocomplétion. Votre outil vous affichera la forme qu'il attend.

## Comment les commandes sont arrivées là : compétences et commandes

Lorsque vous exécutez `openspec init` (ou `openspec update`), OpenSpec écrit de petits fichiers dans votre projet pour que votre outil IA puisse trouver le flux de travail. En fonction de votre outil et de vos paramètres, il s'agit de **compétences**, de **commandes**, ou des deux.

- Les **compétences** se trouvent dans des emplacements comme `.claude/skills/openspec-*/SKILL.md`. Il s'agit de la norme émergente inter-outils : un dossier d'instructions que votre assistant détecte automatiquement.
- Les **commandes** se trouvent dans des emplacements comme `.claude/commands/opsx/<id>.md`. Il s'agit des anciens fichiers de commandes slash spécifiques à chaque outil. Codex ne reçoit pas de fichiers de commandes générés ; utilisez `.codex/skills/openspec-*`.

Vous n'avez pas à vous soucier de ce que votre outil utilise. Vous tapez simplement la commande slash et cela fonctionne. Mais savoir que ces fichiers existent est utile quand quelque chose ne va pas : si vos commandes disparaissent, cela signifie généralement que ces fichiers sont manquants ou obsolètes, et `openspec update` les régénère.

Consultez [Outils pris en charge](supported-tools.md) pour les emplacements exacts par outil, et [Guide de migration](migration-guide.md) pour comprendre comment les compétences ont remplacé l'ancienne approche basée uniquement sur les commandes.

## Vérifier l'installation

Vérifications rapides, de la plus rapide à la plus lente :

1. **Tapez un slash dans le chat de votre IA.** Commencez à taper `/opsx` et observez les suggestions d'autocomplétion. Si elles apparaissent, vous êtes prêt.
2. **Cherchez les fichiers.** Pour Claude Code, vérifiez que le dossier `.claude/skills/` contient des dossiers `openspec-*`. Les autres outils utilisent leurs propres répertoires (la page [Outils pris en charge](supported-tools.md) les liste).
3. **Relancez la configuration.** Depuis la racine de votre projet, exécutez `openspec update`. Cela régénère les fichiers de compétences et de commandes pour tous les outils que vous avez configurés.
4. **Redémarrez votre assistant.** De nombreux outils analysent les compétences et les commandes au démarrage, donc une nouvelle fenêtre peut être l'étape qui manquait.

## Quelles commandes sont disponibles par défaut ?

Par défaut, OpenSpec installe le jeu de commandes slash **core** :

- `/opsx:explore` : réfléchir à une idée avec l'IA avant de s'engager sur une modification (excellente première étape quand vous n'êtes pas sûr)
- `/opsx:propose` : créer une modification et rédiger tous ses artefacts de planification en une seule étape
- `/opsx:apply` : construire la modification en travaillant à travers sa liste de tâches
- `/opsx:sync` : fusionner les mises à jour de spécifications d'une modification dans vos spécifications principales (généralement automatique)
- `/opsx:archive` : terminer une modification et la classer

Un bon rythme par défaut : `explore` quand vous cherchez ce que vous voulez faire, puis `propose`, `apply`, `archive`. Le guide [Explorer d'abord](explore.md) explique pourquoi cette première étape est rentable.

Il existe également un jeu **étendu** pour les personnes qui souhaitent un contrôle plus fin (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Vous l'activez avec `openspec config profile`, puis l'appliquez avec `openspec update`.

Vous débutez avec tout ça ? `/opsx:onboard` (dans le jeu étendu) vous guide à travers une modification complète sur votre propre base de code, en commentant chaque étape. C'est l'introduction la plus conviviale possible.

Pour savoir ce que fait chaque commande en détail, consultez [Commandes](commands.md). Pour savoir quand utiliser laquelle, consultez [Flux de travail](workflows.md).

## Une première exécution propre

Voici l'ensemble de la séquence, avec chaque étape indiquée par son lieu d'exécution.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd votre-projet
TERMINAL   $ openspec init
              (installe les commandes slash dans votre outil IA)

CHAT IA      /opsx:explore
              (facultatif : réfléchissez à l'idée avec l'IA d'abord)

CHAT IA      /opsx:propose add-dark-mode
              (l'IA rédige la proposition, les spécifications, la conception, les tâches)

CHAT IA      /opsx:apply
              (l'IA construit la modification, en cochants les tâches)

CHAT IA      /opsx:archive
              (la modification est fusionnée dans vos spécifications et classée)
```

Deux étapes dans le terminal pour la configuration. Ensuite, vous utilisez principalement le chat. C'est le rythme.

## En relation

- [Prise en main](getting-started.md) : le guide complet pour votre première modification
- [Commandes](commands.md) : chaque commande slash en détail
- [Interface en ligne de commande](cli.md) : chaque commande terminal en détail
- [Outils pris en charge](supported-tools.md) : syntaxe et emplacements de fichiers par outil
- [FAQ](faq.md) : plus de réponses rapides
- [Dépannage](troubleshooting.md) : solutions quand les commandes n'apparaissent pas