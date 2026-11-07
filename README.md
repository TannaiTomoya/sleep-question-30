# AIに質問されて、眠りの習慣を1つ見直す30分

地域の大人がスマホで参加し、AIに一つずつ質問してもらって、来週試す行動を一つ決める教材アプリです。

**現在：設計書と実装Issueを登録済み。アプリの実装・公開・QR発行は未着手です。**

- [設計書・進行台本・コピー用プロンプト](docs/design.md)
- [優先度順のIssue一覧](https://github.com/TannaiTomoya/sleep-question-30/issues?q=is%3Aissue%20is%3Aopen%20sort%3Acreated-asc)

## 優先度と着手順

P0は実装前に確定する仕様、P1は初回公開に必要な作業です。P0は障害の重大度を表すものではありません。同じ優先度では順番と依存先を確認してください。

| 順 | 優先度 | Issue | 依存先 |
| --- | --- | --- | --- |
| 1 | P0 | [#1 教材の表現・根拠・参加ルールを確定する](https://github.com/TannaiTomoya/sleep-question-30/issues/1) | なし |
| 2 | P0 | [#2 一時保存・送信・消去のルールを認可文書に定める](https://github.com/TannaiTomoya/sleep-question-30/issues/2) | なし |
| 3 | P1 | [#3 スマホで進める5画面と共通ナビゲーションを作る](https://github.com/TannaiTomoya/sleep-question-30/issues/3) | [#1](https://github.com/TannaiTomoya/sleep-question-30/issues/1)、[#2](https://github.com/TannaiTomoya/sleep-question-30/issues/2) |
| 4 | P1 | [#4 昨日のメモと一時保存・復元・終了時消去を実装する](https://github.com/TannaiTomoya/sleep-question-30/issues/4) | [#2](https://github.com/TannaiTomoya/sleep-question-30/issues/2)、[#3](https://github.com/TannaiTomoya/sleep-question-30/issues/3) |
| 5 | P1 | [#5 AIへの3問プロンプトと質問カードを実装する](https://github.com/TannaiTomoya/sleep-question-30/issues/5) | [#1](https://github.com/TannaiTomoya/sleep-question-30/issues/1)、[#3](https://github.com/TannaiTomoya/sleep-question-30/issues/3) |
| 6 | P1 | [#6 一つの行動を決めてコピー・印刷できるようにする](https://github.com/TannaiTomoya/sleep-question-30/issues/6) | [#3](https://github.com/TannaiTomoya/sleep-question-30/issues/3)、[#4](https://github.com/TannaiTomoya/sleep-question-30/issues/4) |
| 7 | P1 | [#7 進行台本・困ったとき・参考資料を整える](https://github.com/TannaiTomoya/sleep-question-30/issues/7) | [#1](https://github.com/TannaiTomoya/sleep-question-30/issues/1)、[#3](https://github.com/TannaiTomoya/sleep-question-30/issues/3)、[#5](https://github.com/TannaiTomoya/sleep-question-30/issues/5)、[#6](https://github.com/TannaiTomoya/sleep-question-30/issues/6) |
| 8 | P1 | [#8 公開前に全行程・保存と消去・スマホ操作を検証する](https://github.com/TannaiTomoya/sleep-question-30/issues/8) | [#4](https://github.com/TannaiTomoya/sleep-question-30/issues/4)、[#5](https://github.com/TannaiTomoya/sleep-question-30/issues/5)、[#6](https://github.com/TannaiTomoya/sleep-question-30/issues/6)、[#7](https://github.com/TannaiTomoya/sleep-question-30/issues/7) |
| 9 | P1 | [#9 Cloudflare Workersに独立公開しURLを検証する](https://github.com/TannaiTomoya/sleep-question-30/issues/9) | [#8](https://github.com/TannaiTomoya/sleep-question-30/issues/8) |
| 10 | P1 | [#10 検証済みURLのQRとA4掲示物を作る](https://github.com/TannaiTomoya/sleep-question-30/issues/10) | [#9](https://github.com/TannaiTomoya/sleep-question-30/issues/9) |

## 初版の範囲

- 参加者用の5画面、質問カード、進行台本、ヘルプ、参考資料。
- 外部AIへの手動コピー方式。記録をAIや主催者へ自動送信しない。
- アプリ内AI・参加者アカウント・会話DB・自動通知は含めない。
- 発表・入力・行動の決定は任意。診断や睡眠改善の保証は行わない。
- 公開先は新しいCloudflare Workerとし、実際に検証したURLからQRを作る。

## 実装前の注意

記録の保存・閲覧・編集・消去・持ち帰りを実装する前に、authorization-guard-jaと対象のAGENTS.mdを確認し、未決定の認可ルールを推測しないこと。認可ルールはdocs/authorization.mdに整理する（#2）。
