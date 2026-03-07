import * as vscode from "vscode";
import { init, openbook, pull, push } from "./commands";
import { onSavedCodeFile } from "./events";
import { BarrettaViewProvider } from "./provider";
import { log } from "./logger";


export function activate(context: vscode.ExtensionContext) {
  // Commands
  context.subscriptions.push(vscode.commands.registerCommand("vscode-barretta.init", () => init()));
  context.subscriptions.push(vscode.commands.registerCommand("vscode-barretta.push", () => push()));
  context.subscriptions.push(vscode.commands.registerCommand("vscode-barretta.pull", () => pull()));
  context.subscriptions.push(vscode.commands.registerCommand("vscode-barretta.open", () => openbook()));

  // WebView
  const provider = new BarrettaViewProvider(context.extensionUri);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider(BarrettaViewProvider.viewType, provider));

  // Events
  vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => onSavedCodeFile(document));

  log("Barretta activated");
}

export function deactivate() {
  // No cleanup required
}

