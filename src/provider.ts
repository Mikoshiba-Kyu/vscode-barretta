// https://github.com/microsoft/vscode-extension-samples/blob/main/webview-view-sample/package.json

import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'
import { pushExcel, callMacro, pullExcel, openBook } from './api'
import { setRootPath } from './lib_vscode_api'

type Macro = {
		title: string,
		call: string,
		args: (string | number | boolean)[],
		description: string
}

type LaunchJson = {
	macros: Macro[]
}

export class BarrettaViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'vscode-barretta.launcher'

	private _view?: vscode.WebviewView

	constructor(
		private readonly _extensionUri: vscode.Uri,
	) { }

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [
				this._extensionUri
			]
		}

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview)

		webviewView.webview.onDidReceiveMessage(data => {
			switch (data.type) {
				case 'reload':
					{
						(async () => {
							if (this._view) {
								this._view.show?.(true)
	
								const rootPath = await setRootPath()
								if (rootPath === undefined) {
									return
								}
	
								const jsonPath = path.join(String(rootPath), `barretta-launcher.json`)
								if (!fs.existsSync(jsonPath)) {
									return
								}

								try {
									const jsonText = fs.readFileSync(jsonPath).toString()
									this._view.webview.postMessage({ type :'reloadLauncher', jsonText: jsonText	})
									vscode.window.showInformationMessage('Barretta: MacroRunnerを更新しました。')
									console.log(`Barretta: Complete reload macro runner.`)
	
								} catch {
									this._view.webview.postMessage({ type :'reloadLauncher', jsonText: `Error : Check [barretta-launcher.json]`	})
									vscode.window.showInformationMessage('Barretta: barretta-launcher.json に問題があります。')
									console.log(`Barretta: Failed reload macro runner.`)
								}
							}
						})()
						break
					}

				case 'push':
					{
						pushExcel()
						break
					}
				
				case 'pull':
					{
						pullExcel()
						break
					}

				case 'open':
					{
						openBook()
						break
					}

				case 'runMacro':
					{
						let arrayArgs: (string | number | boolean)[] = []
						if (data.args !== '') {
							const tmp: string = data.args.replace(/"/g, '')
							arrayArgs = tmp.split(', ')
						}

						console.log(data.call)
						console.log(JSON.stringify(arrayArgs))
						callMacro(data.call, arrayArgs)
						break
					}
			}
		})
	}

	private _getHtmlForWebview(webview: vscode.Webview) {

		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'))

		// Do the same for the stylesheet.
		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'))
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'))
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'))

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce()

		// Import Launcher Data and Generate HTML.
		const rootPath: string | undefined = setRootPathAsWebView()

		let macroList = `<div class="macro-list">
											No Data.
										</div>`
		if (rootPath !== undefined) {
			const jsonPath = path.join(String(rootPath), `barretta-launcher.json`)

			if (fs.existsSync(jsonPath)) {
				try {
				const jsonData: LaunchJson = JSON.parse(fs.readFileSync(jsonPath).toString())

				let tmp = ''
				jsonData.macros.forEach((macro, index) => {

					let fixArgs = ''
					if (macro.args.length > 0) {
						const stringArgFix = macro.args.map((arg) => {
							if (typeof arg === 'string') {
								return `"${arg}"`
							} else {
								return arg
							}
						})
						fixArgs = stringArgFix.join(', ')
					}

					const macroCard = `
					<div id="macro-card${index}" class="macro-card">
						<hr>
						<div id="macro-header${index}" class="macro-header">
						<button id="${index}" class="run-button">Run</button>
							<h2>${macro.title}</h2>
						</div>
						<div id="macro-params${index}" class="macro-params">
							<div id="macro-method${index}" class="macro-method">
								<div class="label">Method : </div>
								<h3 id="method${index}">${macro.call}</h3>
							</div>
							<div id="macro-args${index}" class="macro-args">
								<div class="label">Args : </div>
								<h3 id="args${index}">${fixArgs}</h3>
							</div>
						</div>
						<div class="macro-desc">
						${macro.description}
						</div>
					</div>
					`
					tmp = tmp + macroCard
				})

				if (tmp !== '') macroList = tmp

				} catch {
					macroList = `Error : Check [barretta-launcher.json]`
				}
			}
		}

		return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<!--
				Use a content security policy to only allow loading images from https or from our extension directory,
				and only allow scripts that have a specific nonce.
			-->
			<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<link href="${styleResetUri}" rel="stylesheet">
			<link href="${styleVSCodeUri}" rel="stylesheet">
			<link href="${styleMainUri}" rel="stylesheet">
			
			<title>Barretta Launcher</title>
		</head>
		<body>
			<div class="short-cut">
				<h2>Commands</h2>
				<button class="push-button">Push</button>
				<button class="pull-button">Pull</button>
				<button class="open-button">Open</button>
			</div>
			<div class="macro-list">
				<div class="macrolist-header">
					<h2>Macro Runner</h2>
					<button class="reload-button">Reload</button>
				</div>
				<div class="macrolist-body">
					${macroList}
				</div">
			</div>
			<script nonce="${nonce}" src="${scriptUri}"></script>
		</body>
		</html>`;
	}
}

function getNonce() {
	let text = ''
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length))
	}
	return text
}

const setRootPathAsWebView = () => {
	let rootPath

  if (!vscode.window.activeTextEditor) {
    if (vscode.workspace.workspaceFolders === undefined) {
      console.log(`Barretta: The target could not be identified because the folder was not opened.`)
      return undefined
    }
    
    return rootPath

  } else {
    const activeEditorPath: vscode.Uri = vscode.window.activeTextEditor.document.uri
    if (vscode.workspace.getWorkspaceFolder(activeEditorPath) !== undefined) {
      const rootWsFolder: vscode.WorkspaceFolder | undefined  = vscode.workspace.getWorkspaceFolder(activeEditorPath)

      rootPath = rootWsFolder && rootWsFolder.uri.path.replace(/^\//, '')
      console.log(`Barretta: ${rootPath} was selected from the current active editors.`)
      return rootPath
    } else {
      console.log(`Barretta: Failed to locate root folder.`)
      return undefined
    }
  }
} 