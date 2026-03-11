import * as path from "node:path";
import * as vscode from "vscode";
import { pushExcel } from "./api";

type OnSavedCodeFile = (document: vscode.TextDocument) => void;

export const onSavedCodeFile: OnSavedCodeFile = (document) => {
  // Configuration [barretta.hotReload] が false の場合、処理を終了する
  // If the configuration [barretta.hotReload] is false, terminate the process
  const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("barretta");
  const optHotReload: boolean = config.get("hotReload") ?? false;
  if (!optHotReload) return;

  // 保存されたファイルが 'file' 以外の場合処理を終了する。fileではない可能性も存在するが
  // If the saved file is not 'file', terminate the process. There is also a possibility that it is not a file.
  if (document.uri.scheme !== "file") return;

  // 保存されたファイルが 'code_modules' 内のファイルだった場合に、Barretta: Push を実行するが
  // If the saved file is a file inside 'code_modules', execute Barretta: Push.
  if (vscode.workspace.getWorkspaceFolder(document.uri) !== undefined) {
    const filePath = document.uri.fsPath;

    if (path.basename(path.dirname(filePath)) === "code_modules") {
      pushExcel();
    }
  }
};

