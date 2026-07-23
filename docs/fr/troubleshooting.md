# Dépannage

Des solutions concrètes pour des problèmes concrets. Chaque entrée décrit un symptôme, explique la cause probable en une phrase et vous donne la solution. Si vous ne trouvez pas votre problème ici, la [FAQ](faq.md) peut vous aider, et le [Discord](https://discord.gg/YctCnvvshC) vous aidera à coup sûr.

## Installation et configuration

### `openspec: command not found`

L'interface en ligne de commande (CLI) n'est pas installée, ou votre shell ne la trouve pas. Installez-la globalement et vérifiez :

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Si elle est installée mais toujours introuvable, c'est probablement que le répertoire `bin` global de npm n'est pas dans votre `PATH`. Exécutez `npm bin -g` pour voir où se trouvent les binaires globaux, et assurez-vous que ce chemin est présent dans le fichier de profil de votre shell.

### "Requires Node.js 20.19.0 or higher"

OpenSpec fonctionne sur Node 20.19.0 ou supérieur. Vérifiez votre version et mettez à jour si nécessaire :

```bash
node --version
```

Si vous utilisez `bun` pour installer OpenSpec, notez qu'OpenSpec s'exécute toujours sur Node, vous avez donc besoin de Node 20.19.0 ou supérieur disponible dans votre `PATH` dans tous les cas. Consultez la page [Installation](installation.md).

### `openspec init` didn't configure my AI tool

La commande `init` vous demande quels outils configurer. Si vous avez sauté votre outil ou si vous voulez en ajouter un autre, exécutez simplement la commande à nouveau, ou utilisez la version non interactive :

```bash
openspec init --tools claude,cursor
```

La liste complète des identifiants d'outils est disponible dans la page [Outils pris en charge](supported-tools.md). Utilisez `--tools all` pour tous les configurer, `--tools none` pour sauter la configuration des outils.

## Les commandes n'apparaissent pas

Si `/opsx:propose` (ou l'équivalent pour votre outil) n'apparaît pas ou ne fait rien, parcourez cette liste dans l'ordre. Les éléments sont classés du plus rapide au plus long à vérifier.

1. **Vous êtes peut-être au mauvais endroit.** Les commandes slash s'utilisent dans le chat de votre assistant IA, pas dans votre terminal. Si vous avez tapé `/opsx:propose` dans votre shell, c'est là le problème. Consultez la page [Fonctionnement des commandes](how-commands-work.md).

2. **Régénérez les fichiers.** Depuis la racine de votre projet :

   ```bash
   openspec update
   ```

   Cela réécrit les fichiers de compétences et de commandes pour tous les outils que vous avez configurés.

3. **Redémarrez votre assistant.** La plupart des outils analysent les compétences et les commandes au démarrage. Une nouvelle fenêtre résout souvent le problème.

4. **Vérifiez que les fichiers existent.** Pour Claude Code, vérifiez que le dossier `.claude/skills/` contient des dossiers `openspec-*`. Les autres outils utilisent leurs propres répertoires, tous listés dans la page [Outils pris en charge](supported-tools.md).

5. **Vérifiez que vous avez bien initialisé ce projet.** Les compétences sont écrites par projet. Si vous avez cloné un dépôt ou changé de dossier, exécutez `openspec init` (ou `openspec update`) à cet endroit.

6. **Vérifiez que votre outil prend en charge les fichiers de commande.** Codex et quelques autres outils (CodeArts, Kimi CLI, ForgeCode, Mistral Vibe) ne génèrent pas de fichiers de commande `opsx-*` ; ils utilisent des appels basés sur les compétences à la place. Pour Codex, vérifiez le dossier `.codex/skills/openspec-*`. Les formulaires diffèrent selon l'outil : consultez les pages [Outils pris en charge](supported-tools.md) et [Fonctionnement des commandes](how-commands-work.md#slash-command-syntax-by-tool).

## Travail avec les modifications

### "Change not found"

La commande n'a pas pu déterminer quelle modification vous vouliez utiliser. Nommez-la explicitement, ou vérifiez ce qui existe :

```bash
openspec list                    # voir les modifications actives
/opsx:apply add-dark-mode        # nommer la modification dans le chat
```

Vérifiez également que vous êtes dans le bon répertoire de projet.

### "No artifacts ready"

Chaque artefact est soit déjà créé, soit bloqué en attente d'une dépendance. Vérifiez ce qui bloque :

```bash
openspec status --change <name>
```

Créez ensuite d'abord la dépendance manquante. Rappelez-vous de l'ordre : la proposition active les spécifications et la conception ; les spécifications et la conception ensemble activent les tâches.

### `openspec validate` reports warnings or errors

La validation vérifie vos spécifications et vos modifications pour détecter des problèmes structurels. Lisez le message : il indique le fichier et le problème.

```bash
openspec validate <name>           # valider un seul élément
openspec validate --all            # valider l'ensemble
openspec validate --all --strict   # vérifications plus strictes, adaptées pour le CI
```

Les causes les plus courantes sont une section obligatoire manquante (comme une spécification sans scénarios) ou un en-tête delta malformé. Corrigez le fichier et réexécutez la commande. La [Référence de l'interface en ligne de commande](cli.md#openspec-validate) documente le format de sortie.

### The AI created incomplete or wrong artifacts

L'IA n'avait pas assez de contexte. Quelques leviers peuvent vous aider :

- Ajoutez du contexte de projet dans `openspec/config.yaml` pour que votre pile technique et vos conventions soient injectées dans chaque requête. Consultez la page [Personnalisation](customization.md#project-configuration).
- Ajoutez des `rules:` par artefact pour des consignes qui ne s'appliquent qu'à, par exemple, les spécifications.
- Donnez une description plus détaillée lors de la création d'une proposition.
- Utilisez la version étendue de `/opsx:continue` pour créer un artefact à la fois et les examiner chacun, au lieu de `/opsx:ff` qui les crée tous d'un coup.

### Archive won't finish, or warns about incomplete tasks

L'archivage ne *bloquera pas* sur des tâches incomplètes, mais il vous avertira, car l'archivage signifie généralement que le travail est terminé. Si des tâches restent intentionnellement (vous déposez une modification partielle), poursuivez. Sinon, terminez d'abord les tâches. L'archivage vous proposera également de synchroniser vos spécifications delta dans les spécifications principales si vous ne l'avez pas encore fait ; acceptez à moins que vous n'ayez une raison de refuser.

## Configuration

### My `config.yaml` isn't being applied

Trois causes les plus courantes :

1. **Nom de fichier incorrect.** Il doit s'agir de `openspec/config.yaml`, pas `.yml`.
2. **YAML invalide.** Exécutez-le dans n'importe quel validateur YAML ; l'interface en ligne de commande signale également les erreurs de syntaxe avec les numéros de ligne.
3. **Vous vous attendiez à un redémarrage.** Ce n'est pas nécessaire. Les modifications de configuration prennent effet immédiatement.

### "Unknown artifact ID in rules: X"

Une clé dans `rules:` ne correspond à aucun artefact dans votre schéma. Pour le schéma par défaut `spec-driven`, les identifiants valides sont `proposal`, `specs`, `design`, `tasks`. Pour voir les identifiants de n'importe quel schéma :

```bash
openspec schemas --json
```

### "Context too large"

Le champ `context:` est limité à 50 Ko volontairement, car il est injecté dans chaque requête. Résumez-le, ou ajoutez des liens vers des documents plus longs au lieu de les coller. Un contexte léger donne également des résultats meilleurs et plus rapides.

### "Schema not found"

Le nom de schéma que vous avez référencé n'existe pas. Listez ce qui est disponible et vérifiez l'orthographe :

```bash
openspec schemas                    # lister les schémas disponibles
openspec schema which <name>        # voir d'où un schéma est résolu
openspec schema init <name>         # créer un schéma personnalisé
```

Consultez la page [Personnalisation](customization.md#custom-schemas).

## Migration depuis l'ancien workflow

### "Legacy files detected in non-interactive mode"

Vous êtes dans un environnement CI ou un shell non interactif, et OpenSpec a trouvé d'anciens fichiers à nettoyer mais ne peut pas vous demander confirmation. Approuvez automatiquement :

```bash
openspec init --force
```

Pour Codex, OpenSpec peut détecter d'anciens fichiers de prompt gérés dans `$CODEX_HOME/prompts` ou `~/.codex/prompts`. Ce nettoyage est limité aux noms de fichiers de prompt Codex hérités autorisés par OpenSpec, et `openspec init` non interactif ne supprime que les fichiers dont les compétences de remplacement `.codex/skills/openspec-*` existent. `openspec update` non interactif laisse tout le nettoyage hérité intact sauf si vous passez l'option `--force`.

### Commands didn't appear after migrating

Redémarrez votre IDE. Les compétences sont détectées au démarrage. Si elles n'apparaissent toujours pas, exécutez `openspec update` et vérifiez les emplacements des fichiers dans la page [Outils pris en charge](supported-tools.md).

### My old `project.md` wasn't migrated

C'est intentionnel. OpenSpec ne supprime jamais `project.md` automatiquement car il peut contenir du contexte que vous avez écrit. Déplacez les parties utiles dans la section `context:` de `config.yaml`, puis supprimez-le vous-même. Le [Guide de migration](migration-guide.md#migrating-projectmd-to-configyaml) vous accompagne dans cette démarche, y compris un prompt que vous pouvez donner à votre IA pour effectuer la synthèse.

## Vous êtes toujours bloqué ?

- **Discord :** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **Problèmes GitHub :** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Depuis votre terminal :** `openspec feedback "ce qui a mal tourné"` ouvre un problème pour vous.

Lorsque vous signalez un problème, incluez votre version d'OpenSpec (`openspec --version`), votre version de Node (`node --version`), votre outil d'IA, ainsi que la commande et la sortie exactes. Cela permet d'obtenir de l'aide beaucoup plus rapidement.