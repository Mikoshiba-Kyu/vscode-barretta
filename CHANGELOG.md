# Change Log

## 2026/03/28

**ver 1.0.3**

- [Add] Added multi-language support (Japanese, Simplified Chinese, English) for settings, commands, and input popups. The language switches automatically based on the user's VSCode interface language. (PR #10)
- [Add] Added encoding specification feature. The conversion encoding can now be configured in the extension settings. Supported encodings: SHIFT-JIS, GB2312, ANSI. (PR #10)
- [Add] Added `logger` module to output extension log information to the VSCode message window. (PR #10)
- [Add] Added a "Settings" button to the sidebar that opens the extension settings in VSCode. (PR #11)
- [Change] Improved sidebar CSS styles: buttons now adapt width/height to font length and have rounded corners. (PR #11)
- [Docs] Added CONTRIBUTING.md in Japanese, English, and Chinese (Simplified). (PR #12, #13)

## 2023/02/02

**ver 1.0.2**

- [Fix] Fixed a garbled problem when pushing Shift-JIS files. (issue #2)
- [Fix] Fixed a problem with Excel files that did not work if their names contained Japanese characters. (issue #3)

## 2022/09/18

**ver 1.0.1**

- [Change] Extension option "hotReload" now works.
- [Fix] Fixed problem with Barretta not working correctly depending on PowerShell execution permissions.


## 2022/08/04

**ver 1.0.0**

- Initial release