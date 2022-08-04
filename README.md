# Barretta for Visual Studio Code

<img src="docs/image/largeicon_750x256r.png" width="450px">

## Barretta とは

Barretta は ExcelVBA 開発者のための拡張機能です。

`image`

Visual Stadio Code でのコード編集サポーターとして、  
Excel との連携を各コマンドより行うことができます。

## クイックスタート

1. Visual Stadio Code で空のフォルダを開き、 `Barretta: Init` コマンドを実行します。

1. **excel_file** フォルダに編集対象のマクロ有効 Excel ファイルを設置します。

    > 初回は既に1つ以上の標準モジュールが含まれている Excel ファイルを使用することをオススメします。

1. `Barretta: Pull` コマンドを実行します。

1. **code_modules** フォルダにエクスポートされたファイルを Visual Stadio Code で編集します。

1. `Barretta: Push` コマンドで更新後のモジュールを Excel ファイルにインポートします。

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `Barretta.HotReload`: **code_module** のファイルが更新された場合に自動的に `barretta: Push` を行います
* `myExtension.thing`: set to `blah` to do something

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

-----------------------------------------------------------------------------------------------------------
## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

**Note:** You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
