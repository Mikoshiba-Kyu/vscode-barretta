# Barretta for Visual Studio Code

<img src="https://github.com/Mikoshiba-Kyu/vscode-barretta/blob/main/docs/image/largeicon_750x256.png?raw=true" width="450px">

## What is Barretta

Barretta is an extension for Excel VBA developers.

<img src="https://github.com/Mikoshiba-Kyu/vscode-barretta/blob/main/docs/image/commands.gif?raw=true">

<img src="https://github.com/Mikoshiba-Kyu/vscode-barretta/blob/main/docs/image/launcher.gif?raw=true">

As a code editing supporter in Visual Studio Code, you can collaborate with Excel files through various commands. 
It corresponds to **clasp** (clasp) in Google Apps Script and **barretta** (hair clip) in Excel VBA.

## Quick Start

1. Open an empty folder in Visual Studio Code and execute the `Barretta: Init` command.

1. Place the macro-enabled Excel file to be edited in the **excel_file** folder.

    > For the first time, it is recommended to use an Excel file that already contains one or more standard modules.

1. Execute the `Barretta: Pull` command.

1. Edit the exported files in the **code_modules** folder with Visual Studio Code.

1. Import the updated modules into the Excel file with the `Barretta: Push` command.

## Commands

The commands that can be executed from the Visual Studio Code command palette (`Ctrl + Shift P`) are as follows.

* **Barretta: Init** (Alt + Ctrl + N)

    Initialize the target folder as a Barretta project and perform the following configuration. 
  
  * `/barretta-core`

  * `/code-modules`

  * `/excel_file`

  * `.gitignore`

  * `barretta.code-workspace`

  * `barretta-launcher.json`

* **Barretta: Push** (Alt + Ctrl + I)

    Import VBA module files in `code_modules` into the Excel file in `excel_file`.

* **Barretta: Pull** (Alt + Ctrl + E)

    Export VBA module files from the Excel file in `excel_file` to `code_modules`.

* **Barretta: Open** (Alt + Ctrl + O)

    Open the Excel file in `excel_file`.

## Barretta Launcher

**BARRETTA-LAUNCHER** is displayed in the side panel of Visual Studio Code. 
From here, you can execute various commands or use `Macro Runner`.

You can execute macros in the Excel file defined in `barretta-launcher.json` from Macro Runner.

### Usage Example

1. Confirm that 3 samples are defined in `barretta-launcher.json` created when executing Barretta: Init.
1. Place any xlsm file in `excel_file`, paste the following code into the Workbook module, and save it.

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

1. Execute the macro from the Run button in Macro-Runner.

### About VBA LSP Development

If you can develop an LSP for VBA that can be used with VSCode, we would appreciate your help.