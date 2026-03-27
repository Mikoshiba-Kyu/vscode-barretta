#!/bin/bash

# =============================================================================
# 1. シェル環境のセットアップ
# =============================================================================
echo "=== シェル環境のセットアップを開始します ==="

# zsh-in-dockerのダウンロードと整合性検証
SCRIPT_URL="https://github.com/deluan/zsh-in-docker/releases/download/v1.2.0/zsh-in-docker.sh"
EXPECTED_SHA256="f74e5b08c295b6c3886654bb63c688e5ea16c58a4209435c4ddbab2c42fe9b41"

curl -fsSL "$SCRIPT_URL" -o /tmp/zsh-in-docker.sh
echo "$EXPECTED_SHA256 /tmp/zsh-in-docker.sh" | sha256sum -c -

if [ $? -ne 0 ]; then
    echo "❌ エラー: スクリプトの整合性検証に失敗しました"
    exit 1
fi

# zshのインストールと設定
echo "zsh-in-dockerをインストールしています..."
sh /tmp/zsh-in-docker.sh -- \
  -p git \
  -a "HISTFILE=/commandhistory/.zsh_history && setopt SHARE_HISTORY INC_APPEND_HISTORY" \
  -x

rm -f /tmp/zsh-in-docker.sh
echo "✅ シェル環境のセットアップが完了しました"

# =============================================================================
# 2. プロジェクト依存関係のインストール
# =============================================================================
echo ""
echo "=== プロジェクト依存関係をインストールします ==="

yarn install
echo "✅ プロジェクト依存関係のインストールが完了しました"

# =============================================================================
# 3. Gitフックのセットアップ
# =============================================================================
echo ""
echo "=== Gitフックをセットアップします ==="

yarn lefthook install
echo "✅ lefthookのインストールが完了しました"

# =============================================================================
# 4. GitHub Copilot CLIのセットアップ
# =============================================================================
echo ""
echo "=== GitHub Copilot CLIをセットアップします ==="

# 4-1. Copilot CLIのインストール
echo "GitHub Copilot CLIをインストールしています..."
yarn install --global @github/copilot

# PATHの設定
if ! grep -q 'export PATH="$HOME/.yarn/bin:$PATH"' ~/.zshrc; then
    echo 'export PATH="$HOME/.yarn/bin:$PATH"' >> ~/.zshrc
fi
if ! grep -q 'export PATH="./node_modules/.bin:$PATH"' ~/.zshrc; then
    echo 'export PATH="./node_modules/.bin:$PATH"' >> ~/.zshrc
fi
echo "✅ GitHub Copilot CLIのインストールが完了しました"

# 4-2. Copilot CLI認証情報の復元
echo "GitHub Copilot CLI認証情報を復元しています..."
HOST_COPILOT_CONFIG="/home/node/.copilot-host/config.json"
REPO_COPILOT_CONFIG="/workspaces/fit-beat/.copilot/config.json"

if [ -f "$HOST_COPILOT_CONFIG" ]; then
    if [ -f "$REPO_COPILOT_CONFIG" ]; then
        # 既存の設定ファイルに認証情報をマージ
        if command -v jq &> /dev/null; then
            jq -s '.[0] * (.[1] | {copilot_tokens, last_logged_in_user, logged_in_users})' \
                "$REPO_COPILOT_CONFIG" "$HOST_COPILOT_CONFIG" > /tmp/merged_config.json
            mv /tmp/merged_config.json "$REPO_COPILOT_CONFIG"
            chmod 600 "$REPO_COPILOT_CONFIG"
            echo "✅ Copilot CLI認証情報をマージしました"
        else
            cp "$HOST_COPILOT_CONFIG" "$REPO_COPILOT_CONFIG"
            chmod 600 "$REPO_COPILOT_CONFIG"
            echo "✅ Copilot CLI認証情報を復元しました（jqなし）"
        fi
    else
        # 設定ファイルがない場合は新規作成
        mkdir -p "$(dirname "$REPO_COPILOT_CONFIG")"
        cp "$HOST_COPILOT_CONFIG" "$REPO_COPILOT_CONFIG"
        chmod 600 "$REPO_COPILOT_CONFIG"
        echo "✅ Copilot CLI認証情報を復元しました"
    fi
else
    echo "⚠️  ホスト側にCopilot CLI認証情報が見つかりません"
    echo "   初回ログイン後に ~/.copilot/config.json を作成してください"
fi

# 4-3. Copilot CLIエイリアスの設定
echo "GitHub Copilot CLI用のエイリアスを設定しています..."
COPILOT_ALIAS='alias copilot="XDG_CONFIG_HOME=/workspaces/fit-beat copilot --allow-all-tools"'
if ! grep -q 'alias copilot=' ~/.zshrc; then
    echo "$COPILOT_ALIAS" >> ~/.zshrc
fi
echo "✅ Copilot CLIエイリアスの設定が完了しました"
echo "   エイリアスによりリポジトリの.copilot/config.json（MCP設定含む）を使用します"

# =============================================================================
# 5. GitHub CLIの認証確認
# =============================================================================
echo ""
echo "=== GitHub CLI認証を確認します ==="

if [ -d "/home/node/.config/gh" ]; then
    echo "✅ GitHub CLI認証情報が利用可能です"
else
    echo "⚠️  GitHub CLI認証情報が見つかりません"
    echo "   'gh auth login' でログインしてください"
fi

# =============================================================================
# 6. リポジトリ固有のセットアップ
# =============================================================================
echo ""
echo "=== リポジトリ固有のセットアップをおこないます ==="
sudo apt-get update && sudo apt-get install -y libnss3 libatk-bridge2.0-0 libdrm2 libgtk-3-0 libgbm1 libasound2


# =============================================================================
# セットアップ完了
# =============================================================================
echo ""
echo "=== 🎉 すべてのセットアップが完了しました ==="