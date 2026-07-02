# FAQ

Réponses rapides aux questions les plus fréquentes. Si votre question est vraiment de type « quelque chose est cassé », la page [Dépannage](troubleshooting.md) est plus appropriée. Si vous souhaitez une définition d'un terme, consultez le [Glossaire](glossary.md).

## Les bases

### Qu'est-ce qu'OpenSpec en une phrase ?

Une couche légère qui permet à vous et à votre assistant de codage IA de convenir par écrit de ce qui doit être construit avant que du code ne soit écrit.

### Pourquoi voudrais-je cela ?

Parce que les assistants IA sont confiants même lorsqu'ils ont tort. Lorsque les exigences existent uniquement dans un fil de discussion, l'IA comble les lacunes avec des suppositions, et vous le découvrez une fois que le code est existant. OpenSpec anticipe cet accord plus tôt, là où les erreurs sont faciles à corriger. Consultez [Les concepts fondamentaux en bref](overview.md) pour le cas complet.

### Dois-je l'utiliser pour tout ?

Non. Utilisez-le là où l'accord est important, c'est-à-dire sur la majorité du travail non trivial. Pour une simple correction de faute de frappe d'un seul caractère, la cérémonie n'en vaut probablement pas la peine, et ce n'est pas grave.

### Puis-je l'utiliser sur une grande base de code existante, ou seulement sur de nouveaux projets ?

Les bases de code existantes sont le principal intérêt. OpenSpec est conçu pour les systèmes existants (brownfield) : vous ne documentez pas toute votre application d'un coup. Vous écrivez des spécifications uniquement pour ce que chaque changement touche, et vos spécifications se complètent au fil du travail que vous effectuez réellement. Il existe un guide dédié : [Utiliser OpenSpec dans un projet existant](existing-projects.md).

### Est-ce lié à un seul outil IA ?

Non. OpenSpec fonctionne avec plus de 25 assistants, y compris Claude Code, Cursor, Windsurf, GitHub Copilot, Gemini CLI, Codex et d'autres. La liste complète et les détails par outil se trouvent dans [Outils pris en charge](supported-tools.md).

## Exécution des commandes

### Où dois-je taper `/opsx:propose` ?

Dans le chat de votre assistant IA, pas dans votre terminal. C'est le point de confusion le plus courant, il y a donc une page dédiée : [Comment fonctionnent les commandes](how-commands-work.md). Version courte : `openspec ...` s'exécute dans le terminal, `/opsx:...` s'exécute dans le chat.

### Comment puis-je « démarrer le mode interactif » ?

Il n'y a pas de mode séparé à démarrer. Vous ouvrez votre assistant IA normalement et tapez une commande slash dans son chat. La commande slash est la manière d'« entrer » dans OpenSpec. (La seule fonctionnalité terminale véritablement interactive est `openspec view`, un tableau de bord pour parcourir les spécifications et les changements.) Explication complète dans [Comment fonctionnent les commandes](how-commands-work.md).

### J'ai tapé une commande slash et rien ne s'est passé. Pourquoi ?

Très probablement, vous l'avez tapée dans le terminal au lieu de votre chat IA, ou les commandes ne sont pas encore installées. Exécutez `openspec update` dans votre projet, redémarrez votre assistant, puis essayez de taper `/opsx` dans le chat et regardez s'il y a une complétion automatique. [Dépannage](troubleshooting.md#commands-dont-show-up) contient la liste de contrôle complète.

### Pourquoi la syntaxe est-elle `/opsx:propose` dans un outil et `/opsx-propose` dans un autre ?

Chaque outil IA présente les commandes personnalisées différemment. L'intention est identique ; seule la ponctuation change. Tapez une barre oblique (slash) dans votre chat et l'autocomplétion vous montrera le format que votre outil attend. Le tableau par outil se trouve dans [Comment fonctionnent les commandes](how-commands-work.md#slash-command-syntax-by-tool).

### Quelle est la différence entre une skill et une commande ?

Les deux sont des fichiers écrits par OpenSpec pour que votre assistant puisse exécuter le flux de travail. Les Skills (`.../skills/openspec-*/SKILL.md`) sont la norme plus récente inter-outils ; les commandes (`.../commands/opsx-*`) sont les anciens fichiers slash spécifiques à chaque outil. Vous n'avez pas besoin d'en choisir un. Vous tapez simplement la commande slash, et OpenSpec installe celle que votre outil utilise.

## Le flux de travail

### Par où dois-je commencer si je ne suis pas sûr de ce qu'il faut construire ?

Avec `/opsx:explore`. C'est un partenaire de réflexion sans enjeu qui lit votre base de code, élabore des options et transforme un problème vague en un plan concret, le tout avant que tout changement ou code n'existe. Il est dans le profil par défaut, il est donc toujours disponible. Lorsque le plan est clair, il passe à `/opsx:propose`. C'est la meilleure habitude à prendre, car cela empêche une IA enthousiaste de construire avec confiance la mauvaise chose. Consultez [Explorer d'abord](explore.md).

### Quel est le flux le plus simple possible ?

```text
/opsx:explore (optionnel)   puis   /opsx:propose <ce que vous voulez>   puis   /opsx:apply   puis   /opsx:archive
```

Explorer pour réfléchir, proposer pour rédiger le plan, appliquer pour construire, archiver pour classer. Sautez l'étape d'exploration si vous savez déjà exactement ce que vous voulez.

### Quelle est la différence entre `/opsx:propose` et `/opsx:new` ?

`/opsx:propose` est la commande par défaut en une étape : elle crée le changement et rédige tous les artefacts de planification en une seule fois. `/opsx:new` fait partie de l'ensemble étendu des commandes et ne fait que créer un changement vide, vous laissant créer les artefacts un par un avec `/opsx:continue` (ou tout d'un coup avec `/opsx:ff`). Utilisez propose à moins que vous ne vouliez un contrôle étape par étape. Consultez [Commandes](commands.md).

### Que sont les profils `core` et étendus ?

Un profil décide quelles commandes slash seront installées. **Core** (le défaut) vous donne `propose`, `explore`, `apply`, `sync`, `archive`. L'ensemble **étendu** ajoute `new`, `continue`, `ff`, `verify`, `bulk-archive` et `onboard` pour un contrôle plus fin. Basculez avec `openspec config profile`, puis appliquez avec `openspec update`.

### Dois-je exécuter `/opsx:sync` ?

Généralement pas. Sync fusionne les spécifications delta d'un changement dans vos spécifications principales, et `/opsx:archive` proposera de le faire pour vous. Exécutez sync manuellement uniquement lorsque vous voulez que les spécifications soient fusionnées avant l'archivage, par exemple sur un changement de longue durée. Consultez [Commandes](commands.md#opsxsync).

### Comment modifier une proposition, une spécification ou une tâche après avoir commencé ?

Modifiez simplement le fichier. Chaque artefact est un Markdown simple dans `openspec/changes/<name>/`, et il n'y a pas d'état verrouillé ni de mode d'édition spécial. Changez-le à la main, ou demandez à votre IA de le réviser (« mettez à jour la conception pour utiliser une file d'attente »), puis continuez. L'IA travaille toujours à partir du contenu de fichier actuel. Guide complet : [Modifier et itérer sur un changement](editing-changes.md).

### Puis-je revenir en arrière et modifier le plan après en avoir implémenté une partie ?

Oui, à tout moment. Le flux de travail est fluide, donc la révision et l'édition ne sont pas des phases dont vous êtes exclu. Modifiez l'artefact, puis continuez. Si vous voulez une vérification structurée que le code correspond toujours au plan, exécutez `/opsx:verify`. Consultez [Modifier et itérer sur un changement](editing-changes.md#how-do-i-go-back-to-review-after-implementing).

### J'ai modifié le code à la main. Comment le concilier avec la spécification ?

Rendez-les synchronisés avant d'archiver, car l'archivage fait de vos spécifications l'enregistrement de vérité. Si le code est maintenant correct, mettez à jour la delta spec pour qu'elle corresponde à ce que vous avez livré ; si la spécification est correcte, continuez à construire jusqu'à ce que le code soit d'accord. `/opsx:verify` révèle les incohérences. Consultez [Modifier et itérer sur un changement](editing-changes.md#i-edited-the-code-by-hand-how-do-i-reconcile-that-with-openspec).

### Quand dois-je mettre à jour un changement existant par rapport à en commencer un nouveau ?

Mettez à jour lorsque c'est le même travail, affiné. Commencez de zéro lorsque l'intention a fondamentalement changé ou que la portée est explosée dans un travail différent. Il y a un organigramme de décision et des exemples dans [Flux de travail](workflows.md#when-to-update-vs-start-fresh).

### Que se passe-t-il si ma session manque de contexte, ou si les exigences changent en cours d'implémentation ?

C'est là que les spécifications justifient leur existence. Parce que le plan vit dans des fichiers (et pas seulement dans l'historique de chat), vous pouvez effacer votre contexte, démarrer une nouvelle session IA et reprendre avec `/opsx:apply` ; il lit les artefacts et reprend à partir de la première tâche non vérifiée. Si les exigences changent, modifiez les artefacts pour qu'ils correspondent à la nouvelle réalité et continuez. Maintenir une fenêtre de contexte propre produit également de meilleurs résultats ; effacez-la avant l'implémentation.

### Dois-je committer le dossier `openspec/` dans git ?

Oui. Vos spécifications, vos changements actifs et votre archive font partie de l'historique de votre projet. Commentez-les comme n'importe quelle autre source. L'archive en particulier devient un enregistrement durable de la raison pour laquelle votre système fonctionne de cette manière.

## Spécifications et changements

### Qu'est-ce qui va dans une spécification par rapport à une conception ?

Une spécification décrit le comportement observable : ce que fait le système, ses entrées, ses sorties et les conditions d'erreur. Une conception décrit comment vous allez le construire : l'approche technique, les décisions architecturales, les changements de fichiers. Si l'implémentation pouvait changer sans modifier le comportement visible extérieurement, cela appartient à la conception, pas à la spécification. [Concepts](concepts.md#what-a-spec-is-and-is-not) approfondit le sujet.

### Qu'est-ce qu'une delta spec ?

Une spécification qui décrit uniquement ce qui change, en utilisant les sections `ADDED`, `MODIFIED` et `REMOVED`, plutôt que de répéter la spécification entière. C'est ainsi qu'OpenSpec gère proprement les modifications des systèmes existants. Consultez [Concepts](concepts.md#delta-specs).

### Où vont les changements archivés ?

Dans `openspec/changes/archive/YYYY-MM-DD-<name>/`, avec tous les artefacts préservés. Rien n'est supprimé ; le changement quitte simplement de votre liste active.

## Configuration et personnalisation

### Comment dire à l'IA quel est mon stack technique ?

Mettez-le dans `openspec/config.yaml` sous `context:`. Ce texte est injecté dans chaque demande de planification, donc l'IA connaît toujours votre stack et vos conventions. Consultez [Personnalisation](customization.md#project-configuration).

### Puis-je générer des spécifications dans une langue autre que l'anglais ?

Oui. Ajoutez une instruction linguistique au `context:` de votre configuration. [Multilingue](multi-language.md) contient des extraits à copier-coller pour plusieurs langues.

### Puis-je changer le flux de travail lui-même ?

Oui, avec des schémas personnalisés. Un schéma définit quels artefacts existent et comment ils dépendent les uns des autres. Forkez le par défaut avec `openspec schema fork spec-driven my-workflow`, puis modifiez-le. Consultez [Personnalisation](customization.md#custom-schemas).

## Modèles, confidentialité et mises à jour

### Quel modèle IA dois-je utiliser ?

OpenSpec fonctionne le mieux avec les modèles à raisonnement avancé. Le README recommande des modèles tels que Codex 5.5 et Opus 4.7 pour la planification et l'implémentation. Gardez également votre fenêtre de contexte propre : effacez-la avant l'implémentation pour de meilleurs résultats.

### OpenSpec collecte-t-il des données ?

Il collecte des statistiques d'utilisation anonymes : nom de commande et version seulement. Aucune argument, chemin, contenu ou donnée personnelle, et il est désactivé automatiquement dans CI. Opt-out avec `export OPENSPEC_TELEMETRY=0` ou `export DO_NOT_TRACK=1`.

### Comment puis-je mettre à jour ?

Deux étapes. Mettez à niveau le package (`npm install -g @fission-ai/openspec@latest`), puis exécutez `openspec update` dans chaque projet pour rafraîchir les skills et commandes générés.

### Comment désinstaller OpenSpec ?

Il n'y a pas de commande de désinstallation, car c'est un package global plus des fichiers dans votre projet. Supprimez le package (`npm uninstall -g @fission-ai/openspec`), et supprimez optionnellement le répertoire `openspec/` et les fichiers d'outils générés. Le processus étape par étape, y compris ce qui est sûr de conserver, se trouve dans [Installation : Désinstallation](installation.md#uninstalling).

## Obtenir de l'aide

### Où dois-je poser des questions ou signaler des bugs ?

- **Discord :** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues :** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Depuis votre terminal :** `openspec feedback "votre message"` ouvre un problème GitHub pour vous.

### Ces docs sont faux ou confus. Que dois-je faire ?

Dites-le nous, ou corrigez-les. Les PR de documentation sont les bienvenus et appréciés. Ouvrez un problème ou envoyez une pull request.