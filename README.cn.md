# Barretta for Visual Studio Code

<img src="https://github.com/Mikoshiba-Kyu/vscode-barretta/blob/main/docs/image/largeicon_750x256.png?raw=true" width="450px">

## Barretta 是什么

Barretta 是为 Excel VBA 开发者设计的扩展插件。

<img src="https://github.com/Mikoshiba-Kyu/vscode-barretta/blob/main/docs/image/commands.gif?raw=true">

<img src="https://github.com/Mikoshiba-Kyu/vscode-barretta/blob/main/docs/image/launcher.gif?raw=true">

作为 Visual Studio Code 中的代码编辑支持工具，您可以通过各种命令与 Excel 文件进行协作。
它对应于 Google Apps Script 中的 **clasp**（扣子）和 Excel VBA 中的 **barretta**（发夹）。

## 快速开始

1. 在 Visual Studio Code 中打开一个空文件夹，并执行 `Barretta: Init` 命令。
1. 将要编辑的启用宏的 Excel 文件放置在 **excel_file** 文件夹中。

   > 首次使用时，建议使用已包含一个或多个标准模块的 Excel 文件。
1. 执行 `Barretta: Pull` 命令。
1. 使用 Visual Studio Code 编辑 **code_modules** 文件夹中导出的文件。
1. 使用 `Barretta: Push` 命令将更新后的模块导入到 Excel 文件中。

## 命令

从 Visual Studio Code 的命令面板（`Ctrl + Shift P`）可以执行以下命令。

* **Barretta: Init** (Alt + Ctrl + N)

    将目标文件夹初始化为 Barretta 项目，并执行以下配置。
    - `/barretta-core`
    - `/code-modules`
    - `/excel_file`
    - `.gitignore`
    - `barretta.code-workspace`
    - `barretta-launcher.json`
* **Barretta: Push** (Alt + Ctrl + I)

    将 `code_modules` 中的 VBA 模块文件导入到 `excel_file` 中的 Excel 文件。
* **Barretta: Pull** (Alt + Ctrl + E)

    从 `excel_file` 中的 Excel 文件导出 VBA 模块文件到 `code_modules`。
* **Barretta: Open** (Alt + Ctrl + O)

    打开 `excel_file` 中的 Excel 文件。

## Barretta Launcher

**BARRETTA-LAUNCHER** 显示在 Visual Studio Code 的侧边面板中。
从这里，您可以执行各种命令或使用 `Macro Runner`。

您可以从 Macro Runner 执行 `barretta-launcher.json` 中定义的 Excel 文件中的宏。

### 使用示例

1. 确认在执行 Barretta: Init 时创建的 `barretta-launcher.json` 中定义了 3 个示例。
1. 在 `excel_file` 中放置任意 xlsm 文件，将以下代码粘贴到 Workbook 模块中并保存。

   ```vb
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
1. 从 Macro-Runner 的 Run 按钮执行宏。

### 关于 VBA LSP 开发

如果您能够开发可与 VSCode 一起使用的 VBA LSP，我们将不胜感激。