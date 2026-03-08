---
name: review-response
description: PRのレビューコメントに対して、説明・コード修正・返信・リゾルブを行います
---

# PR レビュー対応

このスキルにより、GitHub PR のレビューコメントへの対応を順番に行うことができます。

## いつこのスキルを使用すべきか

- ユーザーからレビュー対応を依頼されたとき

## 前提条件

- GitHub CLI (`gh`) または `curl` によるGitHub API へのアクセスが可能であること
- ローカルの作業ブランチが対象のPRのブランチであること

---

## GitHub CLI の認証方法

### 重要: XDG_CONFIG_HOME の影響

このプロジェクトでは `XDG_CONFIG_HOME=/workspaces/fit-beat` が設定されているため、
`gh` コマンドはデフォルトで `/workspaces/fit-beat/gh` を設定ディレクトリとして参照し、
`~/.config/gh` にマウントされた認証情報を読み込めません。

**必ず以下のいずれかの方法で gh を使用してください。**

### 方法1: GH_CONFIG_DIR を指定して gh を使用（推奨）

```bash
# 認証確認
GH_CONFIG_DIR=~/.config/gh gh auth status

# コマンド実行例
GH_CONFIG_DIR=~/.config/gh gh pr view <PR番号>
GH_CONFIG_DIR=~/.config/gh gh pr comment <PR番号> --body "コメント"
```

### 方法2: トークンを取得して curl で直接 API を叩く

`gh` が使えない場合は `git credential fill` でトークンを取得して `curl` で操作します。

```bash
# トークン取得
TOKEN=$(echo "protocol=https
host=github.com" | git credential fill 2>/dev/null | grep password | cut -d= -f2)

# レビューコメントへの返信（REST API）
curl -s -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -X POST "https://api.github.com/repos/<owner>/<repo>/pulls/<PR番号>/comments/<comment_id>/replies" \
  -d '{"body":"返信内容"}'

# スレッドのリゾルブ（GraphQL API）
curl -s -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -X POST https://api.github.com/graphql \
  -d '{"query":"mutation { resolveReviewThread(input: { threadId: \"<thread_id>\" }) { thread { isResolved } } }"}'
```

### スレッドID の取得方法

リゾルブには GraphQL の `threadId` (例: `PRRT_kwDO...`) が必要です。
`databaseId` (数値) とは異なるので注意してください。

```bash
TOKEN=$(echo "protocol=https
host=github.com" | git credential fill 2>/dev/null | grep password | cut -d= -f2)

# 未リゾルブのスレッド一覧（threadId と commentのdatabaseId を対応表示）
curl -s -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -X POST https://api.github.com/graphql \
  -d '{"query":"{ repository(owner: \"<owner>\", name: \"<repo>\") { pullRequest(number: <PR番号>) { reviewThreads(first: 30) { nodes { id isResolved comments(first: 1) { nodes { databaseId } } } } } } }"}' \
  | python3 -c "
import json,sys
data=json.load(sys.stdin)
for n in data['data']['repository']['pullRequest']['reviewThreads']['nodes']:
  if not n['isResolved']:
    print(n['id'], n['comments']['nodes'][0]['databaseId'])
"
```

---

## 対応フロー

### ステップ0: 対象PRの確認

ユーザーから対象PRが明示されていない場合は、必ずPR番号を確認してから開始します。

```
「対応するPRの番号を教えてください。」
```

### ステップ1: レビューコメントの一覧提示

PRの全レビューコメントを取得し、ユーザーに一覧で提示します。
`github-mcp-server-pull_request_read` ツール（method: `get_review_comments`）を使用します。

提示フォーマット（未リゾルブのみ）：
```
## レビューコメント一覧

1. **[ファイル名:行番号]** - コメントの概要
2. **[ファイル名:行番号]** - コメントの概要
...
```

### ステップ2〜5: コメント対応サイクル（全て対応完了まで繰り返す）

#### 2-1. 先頭の未対応コメントを説明

未リゾルブのコメントのうち最も先頭にあるものを取り上げ、以下を説明します：

- **何を指摘しているか**（具体的な問題点）
- **妥当性の判断**（指摘は正しいか・誤検知の可能性はあるか）
- **対応方針の提案**（修正すべきか・現状維持で返信すべきか）

#### 2-2. ユーザーの指示に従い対応

ユーザーの判断に基づいて以下のいずれかを実行します：

- **修正する場合**: コードを修正し、`bun check:write` → `bun typecheck` → テスト実行
- **修正しない場合**: 現状維持の理由を整理して返信文を準備

#### 2-3. 修正内容の確認（修正した場合のみ）

修正した場合は変更内容をユーザーに説明し、確認を求めます。

#### 2-4. コミット・プッシュ・返信・リゾルブ

```bash
# コミット（修正した場合）
git add <変更ファイル>
git commit -m "fix: 修正内容の説明

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
git push

# コメントへの返信
TOKEN=$(echo "protocol=https
host=github.com" | git credential fill 2>/dev/null | grep password | cut -d= -f2)

curl -s -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -X POST "https://api.github.com/repos/<owner>/<repo>/pulls/<PR番号>/comments/<comment_id>/replies" \
  -d '{"body":"返信内容"}'

# スレッドのリゾルブ
curl -s -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -X POST https://api.github.com/graphql \
  -d '{"query":"mutation { resolveReviewThread(input: { threadId: \"<thread_id>\" }) { thread { isResolved } } }"}'
```

返信文のガイドライン：
- 日本語で記述
- 修正した場合は「ご指摘ありがとうございます。〇〇を修正しました。」
- 現状維持の場合は「ご指摘ありがとうございます。〇〇のため、現状維持とします。」
- 誤検知の場合は「ご確認ありがとうございます。コードを確認しましたが、〇〇のため修正は不要と判断しました。」

#### 2-5. 次のコメントへ

全ての未リゾルブコメントに対応完了したら、ユーザーに完了を報告します。

---

## コメント対応の判断基準

| 種別 | 対応方針 |
|------|---------|
| バグ・ロジックエラー | 必ず修正する |
| アクセシビリティの問題 | 修正する |
| 提案コードがある場合 | 内容を確認の上、適用するか判断をユーザーに仰ぐ |
| コードスタイル・可読性の改善 | ユーザーに判断を仰ぐ |
| 誤検知（コードはすでに正しい） | 現状維持で返信・リゾルブ |
| 設計上の懸念（変更不要な指摘） | 意図を説明して返信・リゾルブ |

## ガイドライン

1. **1コメントずつ処理する** - 複数を同時に対応せず、1つ対応完了してから次へ
2. **ユーザーへの確認を省略しない** - 修正内容は必ずユーザーに確認を取る
3. **誤検知は丁寧に説明する** - なぜ問題ないかを根拠とともに返信する
4. **他ファイルへの波及を確認する** - 修正が他のコンポーネントにも影響する場合は一括修正する
5. **コミットメッセージは日本語** - プロジェクトの規約に従い日本語で記述
6. **レビュー対象外ファイルは無視** - `src/components/shadcn` 配下はレビュー対象外