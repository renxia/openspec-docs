# トラブルシューティング

確実な問題に対する具体的な解決策。各項目は症状を提示し、考えられる原因を1文で説明し、修正方法を提供します。ここで問題が見つからない場合は、[FAQ](faq.md)が役立つ可能性があり、[Discord](https://discord.gg/YctCnvvshC)が間違いなくお役に立ちます。

## インストールとセットアップ

### `openspec: command not found`

CLIがインストールされていないか、シェルが見つけられていません。グローバルにインストールし、確認してください。

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

インストールされたにもかかわらず見つからない場合は、グローバルの npm bin ディレクトリが `PATH` に含まれていない可能性があります。`npm bin -g` を実行してグローバルバイナリの場所を確認し、そのパスがシェルのプロファイルに含まれていることを確認してください。

### "Requires Node.js 20.19.0 or higher"

OpenSpec は Node 20.19.0 以降で動作します。バージョンを確認し、必要に応じてアップグレードしてください。

```bash
node --version
```

bun を使用して OpenSpec をインストールする場合、OpenSpec は引き続き Node で*実行される*ため、いずれにせよ `PATH` に Node 20.19.0+ が利用可能である必要があります。[Installation](installation.md)を参照してください。

### `openspec init` で AI ツールが設定されませんでした

Init はどのツールを設定するかを尋ねます。ツールをスキップしたか、別のツールを追加したい場合は、再度実行するか、非対話形式を使用してください。

```bash
openspec init --tools claude,cursor
```

すべてのツール ID の完全なリストは [Supported Tools](supported-tools.md) にあります。すべてに `--tools all` を使用し、ツール設定をスキップするには `--tools none` を使用します。

## コマンドが表示されない

`/opsx:propose` (またはツールの同等機能) が表示されないか、何も実行しない場合は、このリストを順にご確認ください。チェックすべき順番は早いものからとなっています。

1. **間違った場所にいます。** スラッシュコマンドはターミナルではなく AI アシスタントのチャットに入力します。シェルに `/opsx:propose` と入力したのが問題です。[How Commands Work](how-commands-work.md) を参照してください。

2. **ファイルを再生成してください。** プロジェクトルートから実行します。

   ```bash
   openspec update
   ```

   これにより、設定したすべてのツールに対するスキルおよびコマンドファイルが書き換えられます。

3. **アシスタントを再起動してください。** ほとんどのツールは起動時にスキルとコマンドをスキャンします。新しいウィンドウを開くことで解決することが多いです。

4. **ファイルが存在することを確認してください。** Claude Code の場合、`.claude/skills/` に `openspec-*` フォルダが含まれているか確認してください。他のツールは独自のディレクトリを使用しており、すべて [Supported Tools](supported-tools.md) にリストされています。

5. **このプロジェクトを初期化したことを確認してください。** スキルはプロジェクトごとに記述されます。リポジトリをクローンしたか、フォルダを切り替えた場合は、そこで `openspec init` (または `openspec update`) を実行してください。

6. **ツールがコマンドファイルをサポートしていることを確認してください。** いくつかのツール（Kimi CLI, Trae, ForgeCode, Mistral Vibe）は `opsx-*` コマンドファイルの生成を受けず、スキルベースの呼び出しを使用します。形式はツールごとに異なります。詳細は [Supported Tools](supported-tools.md) および [How Commands Work](how-commands-work.md#slash-command-syntax-by-tool) を参照してください。

## 変更による作業

### "Change not found" (変更が見つかりません)

コマンドがどの変更を意図しているのか伝えられませんでした。明示的に名前を付けるか、存在するものを確認してください。

```bash
openspec list                    # アクティブな変更を表示
/opsx:apply add-dark-mode        # チャットで変更名を指定する
```

また、正しいプロジェクトディレクトリにいることを確認してください。

### "No artifacts ready" (アーティファクトが準備できていません)

すべてのアーティファクトはすでに作成されているか、依存関係を待機してブロックされています。何がブロックしているかを確認してください。

```bash
openspec status --change <name>
```

その後、不足している依存関係を先に作成してください。順序を覚えておいてください：提案（proposal）がspecとdesignを可能にし、specとdesignが一緒にタスク（tasks）を可能にします。

### `openspec validate` が警告またはエラーを報告します

Validation は構造的な問題について spec と変更を確認します。メッセージを読んでください。ファイル名と問題点が記載されています。

```bash
openspec validate <name>           # 1つの項目を検証
openspec validate --all            # すべてを検証
openspec validate --all --strict   # より厳格なチェック（CIに適しています）
```

一般的な原因は、必要なセクションの欠落（シナリオのない spec など）または不正なデルタヘッダーです。ファイルを修正し、再実行してください。[CLI reference](cli.md#openspec-validate) で出力形式が文書化されています。

### AI が不完全または間違ったアーティファクトを作成しました

AI に十分なコンテキストがありませんでした。いくつかの対策があります。

*   `openspec/config.yaml` にプロジェクトコンテキストを追加し、スタックと規約をすべてのリクエストに注入します。[Customization](customization.md#project-configuration) を参照してください。
*   特定の spec などにのみ適用されるガイダンスとして、アーティファクトごとの `rules:` を追加します。
*   提案を行う際に、より詳細な説明を提供します。
*   すべてを一度に行う `/opsx:ff` の代わりに、`/opsx:continue` の拡張機能を使用して一つずつアーティファクトを作成し、それぞれを確認します。

### Archive が完了しません、または不完全なタスクについて警告します

Archive は不完全なタスクで*ブロック*することはありませんが、通常アーカイブは作業が完了したことを意味するため、警告を出します。タスクが意図的に残っている場合（部分的な変更を提出している場合）は続行してください。そうでない場合は、まずタスクを完了させてください。Archive は、まだ同期していない場合、デルタ spec をメインの spec に同期することを提案することもあります。理由がない限り「はい」と答えてください。

## 設定

### `config.yaml` が適用されていません

一般的な3つの容疑者です。

1. **ファイル名が間違っています。** `.yml` ではなく `openspec/config.yaml` でなければなりません。
2. **YAML が無効です。** 任意の YAML バリデーターで実行してください。CLI は行番号とともに構文エラーも報告します。
3. **再起動が必要だと期待していました。** 必要ありません。設定の変更は即座に効果があります。

### "Unknown artifact ID in rules: X" (rules 内の不明なアーティファクトID: X)

`rules:` の下のキーが、スキーマ内のどのアーティファクトとも一致していません。デフォルトの `spec-driven` スキーマにおける有効な ID は `proposal`, `specs`, `design`, `tasks` です。任意のスキーマの ID を表示するには、以下を実行します。

```bash
openspec schemas --json
```

### "Context too large" (コンテキストが大きすぎます)

`context:` フィールドは意図的に 50KB に制限されています。これはすべてのリクエストに注入されるためです。要約するか、貼り付ける代わりにより長いドキュメントへのリンクを付けてください。簡潔なコンテキストの方が、より速く良い結果をもたらします。

### "Schema not found" (スキーマが見つかりません)

参照したスキーマ名が存在しません。利用可能なものをリスト表示し、スペルを確認してください。

```bash
openspec schemas                    # 利用可能なスキーマを一覧表示
openspec schema which <name>        # スキーマがどこから解決されるかを表示
openspec schema init <name>         # カスタムスキーマを作成する
```

[Customization](customization.md#custom-schemas) を参照してください。

## レガシーワークフローからの移行

### "Legacy files detected in non-interactive mode" (非対話モードでレガシーファイルが検出されました)

CI または非対話シェルのため、OpenSpec は古いファイルをクリーンアップできるものの、プロンプトを表示できません。自動承認を実行します。

```bash
openspec init --force
```

### 移行後にコマンドが表示されませんでした

IDE を再起動してください。スキルは起動時に検出されます。それでも表示されない場合は、`openspec update` を実行し、[Supported Tools](supported-tools.md) でファイルの位置を確認してください。

### 古い `project.md` が移行されませんでした

これは意図的なものです。OpenSpec は、あなたが記述したコンテキストを含んでいる可能性があるため、`project.md` を自動的に削除しません。有用な部分を `config.yaml` の `context:` セクションに移動し、その後自分で削除してください。[Migration Guide](migration-guide.md#migrating-projectmd-to-configyaml) がこれを案内します。AI に依頼できる蒸留作業のプロンプトも含まれています。

## まだ行き詰まっていますか？

*   **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
*   **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
*   **ターミナルから:** `openspec feedback "what went wrong"` を実行すると、問題に関する Issue が作成されます。

問題を報告する際は、OpenSpec のバージョン（`openspec --version`）、Node のバージョン（`node --version`）、使用した AI ツール、正確なコマンドと出力を含めてください。これにより、サポートがはるかに迅速になります。