import * as vscode from 'vscode'
import * as path from 'path'
import { pushExcel } from './api'

type OnSavedCodeFile = {
  (document: vscode.TextDocument): void
}

export const onSavedCodeFile: OnSavedCodeFile = (document) => {

  // Configuration [barretta.hotReload] が false の場合、処理を終了する
  const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('barretta')
  const optHotReload: boolean = config.get('hotReload') ?? false
  if (!optHotReload) return

  // 保存されたファイルが 'file' 以外の場合処理を終了する。fileではない可能性も存在する。
  if (document.uri.scheme !== 'file') return

  // 保存されたファイルが 'code_modules' 内のファイルだった場合に、Barretta: Push を実行する。
  if (vscode.workspace.getWorkspaceFolder(document.uri) !== undefined) {
    const filePath = document.uri.fsPath

    if (path.basename(path.dirname(filePath)) === 'code_modules') {
      pushExcel()
    }
  }
}