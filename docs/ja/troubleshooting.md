# トラブルシューティング

具体的な問題に対する具体的な修正策です。各エントリは症状を記載し、考えられる原因を1文で説明し、修正方法を提示します。ここに記載されていない問題については、[FAQ](faq.md) が役立つ場合があり、[Discord](https://discord.gg/YctCnvvshC) は確実に役立ちます。

## インストールとセットアップ

### `openspec: command not found`

CLIがインストールされていないか、シェルが認識できていません。グローバルにインストールして確認してください：

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

インストールされているのに見つからない場合、グローバルnpmのbinディレクトリが`PATH`に含まれていない可能性があります。`npm bin -g`を実行してグローバルバイナリの場所を確認し、そのパスがシェルプロファイルに含まれていることを確認してください。

### "Requires Node.js 20.19.0 or higher"

OpenSpecはNode 20.19.0以上で動作します。バージョンを確認し、必要に応じてアップグレードしてください：

```bash
node --version
```

bunを使用してOpenSpecをインストールする場合、OpenSpecは依然としてNode上で実行されるため、`PATH`にNode 20.19.0以上が設定されている必要があります。詳細は[インストール](installation.md)を参照してください。

### `openspec init`がAIツールを設定しなかった

Initはセットアップするツールを尋ねます。ツールをスキップした場合や別のツールを追加したい場合は、再度実行するか、非対話形式を使用してください：

```bash
openspec init --tools claude,cursor
```

ツールIDの完全なリストは[サポートツール](supported-tools.md)に記載されています。すべてのツールには`--tools all`、ツールセットアップをスキップするには`--tools none`を使用してください。

## コマンドが表示されない

`/opsx:propose`（またはツールの同等コマンド）が表示されない、または動作しない場合は、以下のリストを順番に確認してください。最も速く確認できる順に並んでいます。

1. **場所が間違っている可能性があります。** スラッシュコマンドはAIアシスタントのチャットで使用し、ターミナルでは使用しません。シェルに`/opsx:propose`と入力した場合は、それが原因です。[コマンドの仕組み](how-commands-work.md)を参照してください。

2. **ファイルを再生成してください。** プロジェクトルートから：

   ```bash
   openspec update
   ```

   これにより、設定したすべてのツールのスキルファイルとコマンドファイルが再書き込みされます。

3. **アシスタントを再起動してください。** ほとんどのツールは起動時にスキルとコマンドをスキャンします。新しいウィンドウで開くと解決することがよくあります。

4. **ファイルが存在することを確認してください。** Claude Codeの場合、`.claude/skills/`に`openspec-*`フォルダが含まれていることを確認してください。その他のツールは独自のディレクトリを使用し、すべて[サポートツール](supported-tools.md)に記載されています。

5. **このプロジェクトを初期化したことを確認してください。** スキルはプロジェクトごとに書き込まれます。リポジトリをクローンした場合やフォルダを切り替えた場合は、その場所で`openspec init`（または`openspec update`）を実行してください。

6. **ツールがコマンドファイルをサポートしていることを確認してください。** Codexといくつかのツール（CodeArts、Kimi CLI、ForgeCode、Mistral Vibe）は`opsx-*`コマンドファイルが生成されず、スキルベースの呼び出しを使用します。Codexの場合は`.codex/skills/openspec-*`を確認してください。形式はツールごとに異なります。[サポートツール](supported-tools.md)と[コマンドの仕組み](how-commands-work.md#slash-command-syntax-by-tool)を参照してください。

## 変更の操作

### "Change not found"

コマンドがどの変更を指しているか識別できませんでした。明示的に名前を指定するか、存在する変更を確認してください：

```bash
openspec list                    # アクティブな変更を表示
/opsx:apply add-dark-mode        # チャットで変更名を指定
```

また、正しいプロジェクトディレクトリにいることを確認してください。

### "No artifacts ready"

すべてのアーティファクトは、すでに作成されているか、依存関係の待機中でブロックされています。何がブロックしているか確認してください：

```bash
openspec status --change <name>
```

次に、不足している依存関係を先に作成してください。順序を覚えておいてください：提案書が仕様と設計を有効にし、仕様と設計がタスクを有効にします。

### `openspec validate`が警告またはエラーを報告する

検証は、仕様と変更の構造的問題をチェックします。メッセージを読んでください。ファイル名と問題が記載されています。

```bash
openspec validate <name>           # 1つの項目を検証
openspec validate --all            # すべてを検証
openspec validate --all --strict   # より厳格なチェック、CIに適している
```

一般的な原因は、必須セクションの欠落（シナリオのない仕様など）または不正なデルタヘッダーです。ファイルを修正して再実行してください。[CLIリファレンス](cli.md#openspec-validate)に出力形式が記載されています。

### AIが不完全または不正なアーティファクトを作成した

AIに十分なコンテキストがありませんでした。いくつかの調整方法があります：

- `openspec/config.yaml`にプロジェクトコンテキストを追加すると、スタックと規約がすべてのリクエストに挿入されます。[カスタマイズ](customization.md#project-configuration)を参照してください。
- 仕様など特定のアーティファクトにのみ適用されるガイダンスとして、アーティファクトごとに`rules:`を追加してください。
- 提案時により詳細な説明を記載してください。
- 拡張版`/opsx:continue`を使用して1つのアーティファクトずつ作成し、各アーティファクトを確認してください。`/opsx:ff`ですべて一度に作成する代わりに。

### アーカイブが完了しない、または未完了タスクについて警告する

アーカイブは未完了タスクでブロックされませんが、警告を表示します。なぜならアーカイブは通常、作業が完了したことを意味するからです。意図的にタスクが残っている場合（部分的な変更を提出している場合）は、そのまま進めてください。それ以外の場合は、まずタスクを完了させてください。アーカイブは、デルタ仕様をメインの仕様に同期していない場合、同期を提案します。理由がない限り、はいと答えてください。

## 設定

### `config.yaml`が適用されない

3つの一般的な原因：

1. **ファイル名が間違っています。** `openspec/config.yaml`である必要があり、`.yml`ではありません。
2. **YAMLが不正です。** 任意のYAMLバリデーターで確認してください。CLIも行番号付きで構文エラーを報告します。
3. **再起動が必要だと思い込んでいます。** 必要ありません。設定変更は即座に反映されます。

### "Unknown artifact ID in rules: X"

`rules:`の下のキーがスキーマ内のアーティファクトと一致しません。デフォルトの`spec-driven`スキーマの場合、有効なIDは`proposal`、`specs`、`design`、`tasks`です。任意のスキーマのIDを表示するには：

```bash
openspec schemas --json
```

### "Context too large"

`context:`フィールドは意図的に50KBに制限されています。すべてのリクエストに挿入されるためです。要約するか、長いドキュメントを貼り付けるのではなく、リンクを記載してください。コンテキストが少ないほど、より良い、より高速な結果が得られます。

### "Schema not found"

参照したスキーマ名が存在しません。利用可能なスキーマを一覧表示し、スペルを確認してください：

```bash
openspec schemas                    # 利用可能なスキーマを一覧表示
openspec schema which <name>        # スキーマがどこから解決されるか確認
openspec schema init <name>         # カスタムスキーマを作成
```

[カスタマイズ](customization.md#custom-schemas)を参照してください。

## レガシーワークフローからの移行

### "Legacy files detected in non-interactive mode"

CIまたは非対話シェルを使用しており、OpenSpecがクリーンアップする古いファイルを検出しましたが、プロンプトを表示できません。自動的に承認してください：

```bash
openspec init --force
```

Codexの場合、OpenSpecは`$CODEX_HOME/prompts`または`~/.codex/prompts`の古い管理プロンプトファイルを検出する場合があります。このクリーンアップはOpenSpecの許可リストに登録されたレガシーCodexプロンプトファイル名に限定され、非対話`openspec init`は置換先の`.codex/skills/openspec-*`スキルが存在するファイルのみを削除します。非対話`openspec update`は、`--force`を渡さない限り、レガシークリーンアップをすべてそのままにします。

### 移行後にコマンドが表示されない

IDEを再起動してください。スキルは起動時に検出されます。それでも表示されない場合は、`openspec update`を実行し、[サポートツール](supported-tools.md)のファイル場所を確認してください。

### 古い`project.md`が移行されなかった

意図的な動作です。OpenSpecは`project.md`を自動的に削除しません。なぜなら、そこに記載したコンテキストが含まれている可能性があるからです。有用な部分を`config.yaml`の`context:`セクションに移動し、自分で削除してください。[移行ガイド](migration-guide.md#migrating-projectmd-to-configyaml)に、この処理の手順と、AIにこの蒸留作業を依頼できるプロンプトが記載されています。

## まだ解決しない場合？

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **ターミナルから:** `openspec feedback "what went wrong"`でissueを自動的に作成できます。

問題を報告する際は、OpenSpecのバージョン（`openspec --version`）、Nodeのバージョン（`node --version`）、使用中のAIツール、および実行したコマンドと出力結果を含めてください。これにより、サポートが迅速化されます。