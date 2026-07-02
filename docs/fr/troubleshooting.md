# Dépannage

Des solutions concrètes pour des problèmes concrets. Chaque entrée nomme un symptôme, explique la cause probable en une phrase et vous donne la solution. Si vous ne trouvez pas votre problème ici, l'[FAQ](faq.md) peut aider, et [Discord](https://discord.gg/YctCnvvshC) le fera certainement.

## Installation et configuration

### `openspec: command not found`

Le CLI n'est pas installé ou votre shell ne parvient pas à le trouver. Installez-le globalement et vérifiez :

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

S'il a été installé mais qu'il n'est toujours pas trouvé, il est probable que votre répertoire binaire npm global ne soit pas dans votre `PATH`. Exécutez `npm bin -g` pour voir où se trouvent les binaires globaux et assurez-vous que ce chemin est présent dans le profil de votre shell.

### "Requires Node.js 20.19.0 or higher"

OpenSpec fonctionne avec Node 20.19.0+. Vérifiez votre version et mettez à niveau si nécessaire :

```bash
node --version
```

Si vous utilisez bun pour installer OpenSpec, sachez que OpenSpec *s'exécute* toujours sur Node, vous avez donc besoin de Node 20.19.0+ disponible dans votre `PATH` en tout état de cause. Voir [Installation](installation.md).

### `openspec init` n'a pas configuré mon outil IA

Init demande quels outils configurer. Si vous avez sauté l'étape de votre outil ou si vous souhaitez en ajouter un autre, exécutez-le à nouveau ou utilisez la forme non interactive :

```bash
openspec init --tools claude,cursor
```

La liste complète des IDs d'outils se trouve dans [Supported Tools](supported-tools.md). Utilisez `--tools all` pour tout, et `--tools none` pour ignorer la configuration de l'outil.

## Les commandes n'apparaissent pas

Si `/opsx:propose` (ou l'équivalent de votre outil) n'apparaît pas ou ne fait rien, suivez cette liste. Elles sont ordonnées du plus rapide à vérifier au moins rapide.

1. **Vous êtes peut-être au mauvais endroit.** Les commandes slash doivent être utilisées dans le chat de votre assistant IA, et non dans votre terminal. Si vous avez tapé `/opsx:propose` dans votre shell, c'est là que se trouve le problème. Voir [How Commands Work](how-commands-work.md).

2. **Regénérez les fichiers.** À partir de la racine de votre projet :

   ```bash
   openspec update
   ```

   Ceci réécrit les fichiers de compétences (skill) et de commandes pour chaque outil que vous avez configuré.

3. **Redémarrez votre assistant.** La plupart des outils recherchent les compétences et les commandes au démarrage. Une nouvelle fenêtre le fait souvent.

4. **Confirmez l'existence des fichiers.** Pour Claude Code, vérifiez que `.claude/skills/` contient des dossiers `openspec-*`. Les autres outils utilisent leurs propres répertoires, tous listés dans [Supported Tools](supported-tools.md).

5. **Vérifiez avoir initialisé ce projet.** Les compétences sont écrites par projet. Si vous avez cloné un dépôt ou changé de dossier, exécutez `openspec init` (ou `openspec update`) à cet endroit.

6. **Confirmez que votre outil prend en charge les fichiers de commandes.** Quelques outils (Kimi CLI, Trae, ForgeCode, Mistral Vibe) ne génèrent pas de fichiers de commandes `opsx-*`; ils utilisent plutôt des invocations basées sur les compétences. Les formes diffèrent par outil : voir [Supported Tools](supported-tools.md) et [How Commands Work](how-commands-work.md#slash-command-syntax-by-tool).

## Travailler avec les changements

### "Change not found" (Changement non trouvé)

La commande n'a pas pu indiquer quel changement vous vouliez. Nommez-le explicitement ou vérifiez ce qui existe :

```bash
openspec list                    # voir les changements actifs
/opsx:apply add-dark-mode        # nommer le changement dans le chat
```

Confirmez également que vous êtes dans le bon répertoire de projet.

### "No artifacts ready" (Aucun artefact prêt)

Chaque artefact est soit déjà créé, soit bloqué en attendant une dépendance. Voir ce qui bloque :

```bash
openspec status --change <name>
```

Ensuite, créez d'abord la dépendance manquante. Rappelez-vous l'ordre : proposition active les spécifications et le design ; les spécifications et le design ensemble activent les tâches.

### `openspec validate` signale des avertissements ou des erreurs

La validation vérifie vos spécifications et changements pour des problèmes structurels. Lisez le message : il nomme le fichier et le problème.

```bash
openspec validate <name>           # valider un élément
openspec validate --all            # valider tout
openspec validate --all --strict   # vérifications plus strictes, bon pour CI
```

Les causes courantes sont une section requise manquante (comme une spécification sans scénarios) ou un en-tête delta mal formé. Corrigez le fichier et réexécutez. La [CLI reference](cli.md#openspec-validate) documente le format de sortie.

### L'IA a créé des artefacts incomplets ou incorrects

L'IA n'avait pas assez de contexte. Quelques leviers peuvent aider :

- Ajoutez du contexte de projet dans `openspec/config.yaml` afin que votre pile technologique et vos conventions soient injectées dans chaque requête. Voir [Customization](customization.md#project-configuration).
- Ajoutez des règles (`rules:`) par artefact pour un guide qui ne s'applique qu'à, par exemple, les spécifications.
- Donnez une description plus détaillée lorsque vous proposez.
- Utilisez le `/opsx:continue` étendu pour créer un artefact à la fois et en revoir chacun, au lieu de laisser `/opsx:ff` tout faire d'un coup.

### L'archivage ne se termine pas ou avertit sur des tâches incomplètes

Archive ne va pas *bloquer* sur des tâches incomplètes, mais il vous avertit, car l'archivage signifie généralement que le travail est terminé. Si les tâches restent intentionnellement (vous soumettez un changement partiel), continuez. Sinon, terminez d'abord les tâches. Archive proposera également de synchroniser vos spécifications delta dans les spécifications principales si vous ne l'avez pas encore fait ; dites oui à moins que vous n'ayez une raison contraire.

## Configuration

### Mon `config.yaml` n'est pas appliqué

Trois suspects habituels :

1. **Nom de fichier incorrect.** Il doit être `openspec/config.yaml`, et non `.yml`.
2. **YAML invalide.** Exécutez-le à travers n'importe quel validateur YAML ; le CLI signale également les erreurs de syntaxe avec des numéros de ligne.
3. **Vous attendiez un redémarrage.** Ce n'est pas nécessaire. Les changements de configuration prennent effet immédiatement.

### "Unknown artifact ID in rules: X" (ID d'artefact inconnu dans les règles : X)

Une clé sous `rules:` ne correspond à aucun artefact de votre schéma. Pour le schéma par défaut `spec-driven`, les IDs valides sont `proposal`, `specs`, `design` et `tasks`. Pour voir les IDs pour n'importe quel schéma :

```bash
openspec schemas --json
```

### "Context too large" (Contexte trop volumineux)

Le champ `context:` est limité à 50KB, intentionnellement, car il est injecté dans chaque requête. Résumez-le ou fournissez un lien vers une documentation plus longue au lieu d'en coller. Un contexte concis produit également de meilleurs résultats, plus rapides.

### "Schema not found" (Schéma non trouvé)

Le nom de schéma que vous avez référencé n'existe pas. Listez ce qui est disponible et vérifiez l'orthographe :

```bash
openspec schemas                    # lister les schémas disponibles
openspec schema which <name>        # voir d'où un schéma est résolu
openspec schema init <name>         # créer un schéma personnalisé
```

Voir [Customization](customization.md#custom-schemas).

## Migration du flux de travail hérité (legacy)

### "Legacy files detected in non-interactive mode" (Fichiers hérités détectés en mode non interactif)

Vous êtes dans une CI ou un shell non interactif, et OpenSpec a trouvé d'anciens fichiers à nettoyer mais ne peut pas vous demander confirmation. Approuvez automatiquement :

```bash
openspec init --force
```

### Les commandes n'apparaissaient pas après la migration

Redémarrez votre IDE. Les compétences sont détectées au démarrage. Si elles n'apparaissent toujours pas, exécutez `openspec update` et vérifiez les emplacements des fichiers dans [Supported Tools](supported-tools.md).

### Mon ancien `project.md` n'a pas été migré

C'est intentionnel. OpenSpec ne supprime jamais automatiquement `project.md` car il pourrait contenir du contexte que vous avez écrit. Déplacez les parties utiles dans la section `context:` de `config.yaml`, puis supprimez-le vous-même. Le [Migration Guide](migration-guide.md#migrating-projectmd-to-configyaml) explique cela, y compris une invite que vous pouvez donner à votre IA pour faire le distillat.

## Toujours bloqué ?

- **Discord :** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues :** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Depuis votre terminal :** `openspec feedback "what went wrong"` ouvre un ticket pour vous.

Lorsque vous signalez un problème, incluez votre version d'OpenSpec (`openspec --version`), votre version de Node (`node --version`), votre outil IA et la commande exacte ainsi que le résultat. Cela rend l'aide beaucoup plus rapide.