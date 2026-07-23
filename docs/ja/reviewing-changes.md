# 変更のレビュー

OpenSpecの最大の約束は、コードを書く前にあなたとAIが**何を構築するかについて合意する**ことです。この合意は、AIが作成した内容を実際に読んだ場合にのみ意味を持ちます。このページは、その2分間について説明します — 何を開き、どの順序で読み、何に注目すべきか。

賭けは単純です：1段落の計画で誤った方向性を捉えることはほぼ無料です。300行のコードで同じ誤りを捉えることはそうではありません。レビューは、その賭けで利益を得る場所です。

## レビューの2つのタイミング

正確に2つあります：

```
/opsx:propose ──► REVIEW THE PLAN ──► /opsx:apply ──► REVIEW THE CODE ──► /opsx:archive
                  (before any code)                    (/opsx:verify)
```

1. **`/opsx:apply`の前**（または`/opsx:ff`の後）— 計画がまだ単なる言葉の段階で読みます。
2. **構築後**、`/opsx:verify`で — コードが計画通りに実際に動作したか確認します。

最初のレビューが最も時間を節約し、また多くの人が省略するものです。このページは主にその部分について説明します。

## この順序で読みましょう

変更は`openspec/changes/<name>/`にあるプレーンなMarkdownのフォルダです。何か問題がある場合に最も早く中断できる順序でファイルを読みましょう：

```
openspec/changes/add-dark-mode/
├── proposal.md      1. the intent and scope   ← if this is wrong, stop here
├── specs/…/spec.md  2. the requirements       ← the heart of the review
├── design.md        (only for bigger changes) — the technical approach
└── tasks.md         3. the plan of work
```

すべての行を読む必要はありません。ファイルごとに3つの質問に答える必要があります。

## 提案：これは正しい問題か？

まず`proposal.md`を開きます。そこには「なぜ」と「何を」が記録されています — 意図、スコープ、1〜2段落のアプローチ。

**良い状態とは：** 明確な意図が1つ、認識できるスコープ、そして今これを行う価値がある理由。

**警告サイン：**

- あなたが依頼した問題とは少し*異なる*問題を解決している。
- スコープが拡大している — あなたがテーマトグルを依頼したのに、提案では「ついでに」認証にも触れている。
- 曖昧である。「設定ページを改善する」はスコープではない。「OS設定に従うダークモードトグルを追加する」がスコープである。

**答えるべき質問：***これは私が実際に依頼した内容と一致しているか、何かがこっそり追加されていないか？* 答えがノーの場合、停止 — これ以上読み進めず、提案を修正してください（[押し戻すことは安い](#pushing-back-is-cheap)を参照）。

## 仕様差分：「完了」の定義は正しいか？

これがレビューの核心です。`specs/`配下の差分仕様は、変更がリリースされたときに*真*であるべきことを示しています — 要件とそれを証明するシナリオとして：

```markdown
## ADDED Requirements

### Requirement: Dark Mode Toggle
The system SHALL let a user switch between light and dark themes.

#### Scenario: Respects the OS preference on first load
- GIVEN a user who has never set a theme
- WHEN they open the app on a device set to dark mode
- THEN the app renders in dark mode
```

**良い要件の例：** テスターに渡せる明確な`SHALL`/`MUST`文が1つ、およびその文を実際に検証するGIVEN/WHEN/THENのシナリオが少なくとも1つ。

**警告サイン：**

- **曖昧な要件。**「システムは高速でなければならない」は構築もテストもできない。何が高速なのか？
- **シナリオのない要件**、またはその要件をテストしないシナリオ。
- **最も価値のある指摘：欠落しているもの。** AIはあなたが*言った*ことを忠実に書き留めます。あなたの仕事は、あなたが*言い忘れた*ことに気づくことです。最も重要だと考えていたOS設定のケースについてシナリオが言及されていない場合、それがレビューの価値です。

差分を読みながら*システムがこれExactly — そしてこれだけ — を行った場合、私は満足するだろうか？* と自問してください。ここではまだコードの話ではないので、変更は安価です。

## タスク：作業計画は妥当か？

最後に`tasks.md`を開きます。AIが実行する実装チェックリストです。

**良い状態とは：** 順序付けられたステップ、それぞれが要件に追跡可能、謎めいたものはない。

**警告サイン：**

- 対応する要件のないタスク（それはどこから来たのか？）。
- すべての重要な決定を隠す巨大な「機能を実装する」タスク。
- あなたが承認したばかりのスコープ外のものに触れるタスク。

ここでは見積もりや micromanagement（微細な管理）をしているのではありません — 計画があなたが既に承認した要件と一致しているか確認しているのです。

## 押し戻すことは安い

3つの質問のいずれかが間違っていた場合、そう言ってください。フェーズはなく、何もロックされていません — 修正して次に進みます。2つの方法、ちょうど[変更の編集](editing-changes.md)と同じように：

- **ファイルを自分で編集する。** プレーンなMarkdownなので、スコープ行を変更し、要件を厳しくし、タスクを削除できます。
- **AIに何が問題かを伝え**、修正させます：*「認証の変更を削除 — スコープ外」*、*「ユーザーが既にテーマを選択している場合のシナリオを追加」*、*「タスク3をスキーマとUIに分割」*。

次に変更した部分を再読みしてください。あなたが署名できる計画になるまで再草案を作成してください。その行き来こそが製品が機能している証です。

## コード作成後：検証

作業が構築されたら、`/opsx:verify`が2回目のレビューです。成果物とコードを再読みし、3つの次元で不一致を報告します：

| 次元 | 確認内容 |
|-----------|----------------|
| **完全性** | すべてのタスクが完了、すべての要件が実装、シナリオが網羅されているか |
| **正確性** | 実装が仕様の意図と一致し、エッジケースが処理されているか |
| **整合性** | 設計判断が実際にコードに反映されているか |

```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Respects the OS preference on first load" has no test coverage
```

問題をCRITICAL、WARNING、またはSUGGESTIONとしてフラグを立てますが、アーカイブを**ブロックしません** — ギャップを表面化させ、判断をあなたに委ねます。これが「AIがコードを書いたか」と「私たちが合意したものを構築したか」の違いです。

`/opsx:verify`は拡張プロファイルに含まれています。お持ちでない場合は、`openspec config profile`（その後`openspec update`）で有効にするか、変更内容と差分を自分で再読みしてください。

## レビューの適切な規模

すべての変更が完全なレビューに値するわけではありません。1ファイルのタイポ修正なら20秒の流し読みで十分です。認証、決済、回復不能なデータに触れる変更は、上記のすべての質問に答える価値があります。要点は決して儀式ではなかった — それは、ミスが高価な場所に注意を払い、そうでない場所は流し読みすることです。

## 2分間チェックリスト

- [ ] The proposal's intent matches what I asked for.
- [ ] Nothing extra has crept into the scope.
- [ ] Every requirement is specific enough to test.
- [ ] Every requirement has a scenario that actually exercises it.
- [ ] The case I care about most is covered.
- [ ] Tasks map to requirements; nothing is mysterious or out of scope.
- [ ] I'd be comfortable if the AI built exactly this and nothing more.

7つすべてが合格したら、自信を持って`/opsx:apply`を実行してください。どれかが不合格でも、それは挫折ではありません — 2分間がその役割を果たしているのです。

## 次のステップ

- [良い仕様の書き方](writing-specs.md) — 反対側：承認する価値のある要件とシナリオを起草する方法。
- [変更の編集と反復](editing-changes.md) — 開始後の計画変更のメカニズム。
- [ワークフロー](workflows.md) — レビューが大きなループにどのように適合するか。