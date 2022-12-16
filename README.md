# Barretta for Visual Studio Code

<img src="https://github.com/Mikoshiba-Kyu/vscode-barretta/blob/main/docs/image/largeicon_750x256.png?raw=true" width="450px">

## Barretta とは

Barretta は ExcelVBA 開発者のための拡張機能です。

<img src="https://github.com/Mikoshiba-Kyu/vscode-barretta/blob/main/docs/image/commands.gif?raw=true">

<img src="https://github.com/Mikoshiba-Kyu/vscode-barretta/blob/main/docs/image/launcher.gif?raw=true">

Visual Stadio Code でのコード編集サポーターとして、Excelファイルとの連携を各コマンドより行うことができます。 
GoogleAppsScriptにおける **clasp**(留め金) と ExcelVBAにおける **barretta**(髪留め) となります。

## クイックスタート

1. Visual Stadio Code で空のフォルダを開き、 `Barretta: Init` コマンドを実行します。

1. **excel_file** フォルダに編集対象のマクロ有効 Excel ファイルを設置します。

    > 初回は既に1つ以上の標準モジュールが含まれている Excel ファイルを使用することをオススメします。

1. `Barretta: Pull` コマンドを実行します。

1. **code_modules** フォルダにエクスポートされたファイルを Visual Stadio Code で編集します。

1. `Barretta: Push` コマンドで更新後のモジュールを Excel ファイルにインポートします。

## コマンド

Visual Stadio Code のコマンドパレット (`Ctrl + Shift P`) から実行できるコマンドは以下の通りです。

* **Barretta: Init** (Alt + Ctrl + N)

    対象のフォルダをBarrettaプロジェクトとして初期化し以下の構成を行います。 
  
  * `/barretta-core`

  * `/code-modules`

  * `/excel_file`

  * `.gitignore`

  * `barretta.code-workspace`

  * `barretta-launcher.json`

* **Barretta: Push** (Alt + Ctrl + I)

    `code_modules` 内のVBAモジュールファイルを `excel_file` 内のExcelファイルにインポートします。

* **Barretta: Pull** (Alt + Ctrl + E)

    `excel_file` 内のExcelファイルから、VBAモジュールファイルを `code_modules` にエクスポートします。

* **Barretta: Open** (Alt + Ctrl + O)

    `excel_file` 内のExcelファイルを開きます。

## Barretta Launcher

Visual Stadio Code のサイドパネルに **BARRETTA-LAUNCHER** が表示されます。 
ここからは各種コマンドの実行や、`Macro Runner`を利用できます。

Macro Runner からは`barretta-launcher.json`で定義した Excelファイル内のマクロを実行できます。

### 使用例

1. Barretta: Init 実行時に作成される`barretta-launcher.json`に、3つのサンプルが定義されていることを確認します。
1. `excel_file`に任意のxlsmファイルを配置し、Workbookモジュールに以下のコードを貼り付けて保存します。

    ``` vb
    Option Explicit

    Sub SampleMacro1()
        MsgBox "Your first macro will be conglutinated."
    End Sub

    Sub SampleMacro2(ByVal str1 As String, ByVal str2 As String, ByVal str3 As String)
        MsgBox str1 & str2 & str3
    End Sub

    Sub SampleMacro3(ByVal num1 As Long, ByVal num2 As Long)
        MsgBox num1 + num2
    End Sub
    ```

1. Macro-Runnnerの Run ボタンからマクロを実行します。

### VBA用LSPの開発について

VSCodeで使用できるVBA用LSPの開発が可能な方、ご協力いただけると有り難いです。

If you are able to develop an LSP for VBA that can be used with VSCode, we would appreciate your help.