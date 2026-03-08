---
name: pr-creator
description: PR(プルリクエスト)の作成指示があった場合に、ブランチのコミット履歴から、日本語による最適なプルリクエストを発行します
---

# GitHub のプルリクエスト作成

このスキルにより、GitHub CLI を使用したプルリクエストの作成が可能になります。

## いつこのスキルを使用すべきか

以下の場合にこのスキルを活用してください：

- ユーザーからプルリクエストの作成を依頼されたとき

## 前提条件

- すべてのローカルコミットがリモートにプッシュされている
- GitHub CLI が認証済みで使用可能である

## GitHub CLI の認証方法

GitHub CLI を使用するには認証が必要です。以下のいずれかの方法で認証してください：

### 方法1: 環境変数を使用（推奨）
```bash
# ~/.config/gh/hosts.yml からトークンを取得
export GH_TOKEN=$(grep oauth_token ~/.config/gh/hosts.yml | head -1 | awk '{print $2}')

# または直接トークンを指定
export GH_TOKEN="your_github_token_here"

# PRを作成
gh pr create --base main --title "タイトル" --body "本文"
```

### 方法2: 対話的な認証
```bash
# 対話的に認証を行う
gh auth login

# 認証状態の確認
gh auth status
```

### 認証トラブルシューティング
```bash
# 認証状態を確認
gh auth status

# 設定ファイルの確認
cat ~/.config/gh/hosts.yml

# 環境変数でトークンを設定してコマンド実行
export GH_TOKEN=$(grep oauth_token ~/.config/gh/hosts.yml | head -1 | awk '{print $2}')
```

# 中核となる能力

### 1. コミット履歴の分析
- 現在のブランチのコミット履歴を取得
- ベースブランチとの差分を確認
- 変更内容の要約を生成

### 2. プルリクエストの作成
- 日本語による適切なタイトルの生成
- 詳細な本文の作成
- コミットメッセージからの変更内容の抽出
- レビュアーへの明確な情報提供

### 3. GitHub連携
- GitHub CLIを使用したPR作成
- リモートブランチの同期確認
- プルリクエストのURL取得

## 使用例

### 例1: 基本的なプルリクエスト作成
```bash
# 現在のブランチからプルリクエストを作成
gh pr create --title "機能追加: ユーザー認証機能" \
  --body "ユーザーログイン・ログアウト機能を実装しました。" \
  --base main
```

### 例2: コミット履歴からの自動生成
```bash
# コミット履歴を確認
git log main..HEAD --oneline

# コミット内容を元に適切なPRタイトルと本文を生成
gh pr create --fill
```

### 例3: ドラフトプルリクエストの作成
```bash
# レビュー準備中のドラフトPRを作成
gh pr create --draft --title "WIP: 新機能開発中" \
  --body "現在開発中の機能です。"
```

## ガイドライン

1. **PRテンプレートの使用** - `.github/pull_request_template.md` のテンプレートに従ってPRを作成
2. **変更内容の明確化** - PRタイトルと本文で何が変更されたかを明確に記述
3. **変更理由の確認** - 変更理由が不明確な場合は開発者に質問する
4. **日本語での記述** - タイトル、本文、コメントはすべて日本語で記述
5. **コミットの整理** - PRを作成する前にコミット履歴を整理
6. **リモートとの同期** - 必ずローカルの変更をリモートにプッシュしてから作成
7. **レビュー対象外の明示** - `src/components/shadcn` 配下のファイルはレビュー対象外と記載
8. **段階的なレビュー** - 大きな変更の場合はドラフトPRから開始
9. **関連Issueの紐付け** - 関連するIssueがあれば必ず紐付ける

## 一般的なパターン

### パターン: コミット履歴の確認
```bash
# ベースブランチとの差分を確認
git log --oneline main..HEAD
git diff main...HEAD --stat
```

### パターン: リモートブランチの確認
```bash
# リモートとローカルの同期状態を確認
git status
git push origin HEAD
```

### パターン: PRテンプレートの使用
```markdown
<!-- レビューは日本語で行ってください -->

## 概要
ユーザー認証機能を追加しました。

## 変更内容と理由
- ログイン・ログアウト機能を実装（ユーザーからの要望により）
- セッション管理を追加（セキュリティ強化のため）

## 関連Issue
- close #123

## 動作確認
- [x] ローカルで動作確認済み
- [x] テストが通ることを確認済み
```

PRテンプレートは `.github/pull_request_template.md` に定義されています。
PR作成時にこのテンプレートが自動的に適用されます。

### パターン: エラー処理と認証
```bash
# プッシュされていない場合の対処
if ! git diff origin/$(git branch --show-current) --quiet; then
  git push origin HEAD
fi

# GitHub CLI認証の確認と環境変数設定
if ! gh auth status &>/dev/null; then
  export GH_TOKEN=$(grep oauth_token ~/.config/gh/hosts.yml | head -1 | awk '{print $2}')
fi

# 認証が必要な場合
gh auth status || gh auth login
```

## 制限事項

- GitHub CLIの認証が必要
- すべてのコミットがリモートにプッシュされている必要がある
- インターネット接続が必要
- プライベートリポジトリの場合は適切な権限が必要
- 大規模な変更の場合は複数のPRに分割することを推奨