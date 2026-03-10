# Barretta へのコントリビューション

このプロジェクトへの貢献に興味を持っていただき、ありがとうございます。  
このドキュメントでは、開発環境のセットアップからプルリクエストの提出まで、コントリビューターが必要とする情報をまとめています。

> **他の言語で読む:**
> - [English](docs/CONTRIBUTING_en.md)
> - [中文 (简体)](docs/CONTRIBUTING_zh.md)

---

## 目次

- [前提条件](#前提条件)
- [開発環境のセットアップ](#開発環境のセットアップ)
  - [Option A: DevContainer（推奨）](#option-a-devcontainer推奨)
  - [Option B: 手動セットアップ](#option-b-手動セットアップ)
- [ビルド](#ビルド)
- [デバッグ](#デバッグ)
- [テスト](#テスト)
- [コード品質（Lint / Format）](#コード品質lint--format)
- [変更の提出（Pull Request）](#変更の提出pull-request)
- [ローカライズへの貢献](#ローカライズへの貢献)

---

## 前提条件

| ツール | バージョン | 用途 |
|---|---|---|
| [Node.js](https://nodejs.org/) | 22.x | ランタイム |
| [yarn](https://yarnpkg.com/) | 最新版 | パッケージマネージャー |
| [VS Code](https://code.visualstudio.com/) | 最新版 | 開発エディター |
| [Docker](https://www.docker.com/)（任意） | 最新版 | DevContainer 利用時のみ |

> **注意:** Barretta の実行（Push / Pull / Macro Runner）には **Windows + Microsoft Excel** が必要です。  
> ただし、コードの編集・ビルド・Lint はどの OS でも可能です。

---

## 開発環境のセットアップ

### Option A: DevContainer（推奨）

DevContainer を使うと、必要なツールが自動でインストールされた一貫した環境を素早く構築できます。

#### 必要なもの
- Docker
- VS Code + [Dev Containers 拡張機能](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

#### 手順

1. このリポジトリをクローンする
   ```bash
   git clone https://github.com/Mikoshiba-Kyu/vscode-barretta.git
   cd vscode-barretta
   ```

2. VS Code でフォルダを開く
   ```bash
   code .
   ```

3. 通知が表示されたら「**Reopen in Container**」をクリックする（または `F1` → "Dev Containers: Reopen in Container"）

4. コンテナのビルドと `postCreateCommand.sh` による自動セットアップが完了するまで待つ  
   以下が自動で行われます：
   - `yarn install` による依存パッケージのインストール
   - `lefthook` による Git フックのセットアップ

---

### Option B: 手動セットアップ

DevContainer を使わずにローカル環境で開発する場合の手順です。

1. [Node.js 22.x](https://nodejs.org/) をインストールする

2. yarn をインストールする
   ```bash
   npm install -g yarn
   ```

3. リポジトリをクローンする
   ```bash
   git clone https://github.com/Mikoshiba-Kyu/vscode-barretta.git
   cd vscode-barretta
   ```

4. 依存パッケージをインストールする
   ```bash
   yarn install
   ```

---

## ビルド

```bash
# 一度だけビルド
yarn compile

# ウォッチモード（ファイル変更時に自動ビルド）
yarn watch
```

---

## デバッグ

VS Code の拡張機能ホストを使って、実際の VS Code 上で動作確認できます。

1. VS Code でリポジトリを開く
2. `F5` キーを押す（または「実行とデバッグ」→「Run Extension」を選択）
3. `yarn watch`（`tasks.json` のデフォルトビルドタスク）が自動で起動し、ビルドされた拡張機能を読み込んだ **拡張機能開発ホスト** ウィンドウが開く
4. 開発ホスト ウィンドウで `Ctrl+Shift+P` を開き、`Barretta:` コマンドをテストする

> **テスト実行のデバッグ:** 「Extension Tests」launch 設定を使用してください。

---

## テスト

```bash
# テストをコンパイルして実行
yarn test
```

または、VS Code の「実行とデバッグ」→「**Extension Tests**」を選択して実行することもできます。

---

## コード品質（Lint / Format）

このプロジェクトは [Biome](https://biomejs.dev/) を使ってコードの品質を管理しています。

```bash
# Lint チェック
yarn lint

# Lint の自動修正
yarn lint:fix

# コードフォーマット
yarn format

# フォーマットのチェックのみ
yarn format:check
```

Pull Request を提出すると、GitHub Actions の CI が自動でフォーマット・Lint・ビルドを検証します。  
CI が通過していることを確認してからレビューをリクエストしてください。

---

## 変更の提出（Pull Request）

1. `main` ブランチから作業用ブランチを作成する
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. 変更を加えてコミットする

3. PR を提出する前に以下を確認する
   - `yarn lint` でエラーがないこと
   - `yarn format:check` でフォーマットが整っていること
   - `yarn compile` でビルドが成功すること

4. GitHub 上で `main` ブランチに対して Pull Request を作成する

---

## ローカライズへの貢献

現在、Barretta の UI やドキュメントは日本語を中心に提供されています。  
多言語対応（プラグイン UI のローカライズ）は今後の課題です。

### ドキュメントのローカライズ

- 日本語のドキュメント（`README.md`, `CONTRIBUTING.md` など）を他の言語に翻訳する場合は、`docs/` フォルダ内に `CONTRIBUTING_en.md` のようにロケールを付けたファイル名で追加してください。
- ルートのドキュメントに翻訳版へのリンクを追加する PR を作成してください。

### プラグイン UI のローカライズ

VS Code 拡張機能の UI 文字列ローカライズは、[VS Code L10n API](https://code.visualstudio.com/api/references/vscode-api#l10n) を使用する予定です。  
対応が始まったら、`package.nls.json`（デフォルト英語）と `package.nls.<locale>.json` ファイルを追加する形で貢献できます。

---

ご不明な点があれば、Issue でお気軽にご質問ください。
