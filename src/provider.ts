// https://github.com/microsoft/vscode-extension-samples/blob/main/webview-view-sample/package.json

import * as fs from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";
import { callMacro, openBook, pullExcel, pushExcel, showSettings } from "./api";
import { l } from "./i18n";
import { log, show } from "./logger";
import { setRootPath } from "./lib_vscode_api";

/**
 * load sidebar menu locale data based on current vscode language setting,
 * using event send back to WebView page.
 * @param extensionUri extensionUri from VSCode
 * @param locale current vscode language setting, such as "zh-cn", "en", "ja"...
 * @returns langeuage data object for sidebar menu, if not found, return empty object.
 */
function loadSidebarLocale(extensionUri: vscode.Uri, locale: string): Record<string, string> {
  const localeMap: Record<string, string> = {
    "zh-cn": "zh-cn",
    "ja": "ja",
    "en": "en",
  };

  const normalizedLocale = locale.toLowerCase();
  const mappedLocale = localeMap[normalizedLocale] || "en";

  try {
    // sidebar locale file：
    // <extension-root>/l10n/sidebar-menu/<locale>.json
    const jsonPath = path.join(extensionUri.fsPath, "l10n", "sidebar-menu", `${mappedLocale}.json`);
    if (fs.existsSync(jsonPath)) {
      return JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    }
  } catch {}

  // if locale file not found, fallback to default en language file:
  // <extension-root>/l10n/sidebar-menu/en.json
  try {
    const defaultPath = path.join(extensionUri.fsPath, "l10n", "sidebar-menu", "en.json");
    return JSON.parse(fs.readFileSync(defaultPath, "utf8"));
  } catch {
    return {};
  }
}

type Macro = {
  title: string;
  call: string;
  args: (string | number | boolean)[];
  description: string;
};

type LaunchJson = {
  macros: Macro[];
};

export class BarrettaViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "vscode-barretta.launcher";

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case "reload": {
          (async () => {
            if (this._view) {
              this._view.show?.(true);

              const rootPath = await setRootPath();
              if (rootPath === undefined) {
                return;
              }

              const jsonPath = path.join(String(rootPath), `barretta-launcher.json`);
              if (!fs.existsSync(jsonPath)) {
                return;
              }

              try {
                const jsonText = fs.readFileSync(jsonPath).toString();
                this._view.webview.postMessage({ type: "reloadLauncher", jsonText: jsonText });
                vscode.window.showInformationMessage(`Barretta: ${l("macroRunner.updated")}`);
                // console.log(`Barretta: Complete reload macro runner.`);
                log(`Barretta: Complete reload macro runner.`);
              } catch {
                this._view.webview.postMessage({
                  type: "reloadLauncher",
                  jsonText: `Error : Check [barretta-launcher.json]`,
                });
                vscode.window.showInformationMessage(`Barretta: ${l("macroRunner.jsonError")}`);
                // console.log(`Barretta: Failed reload macro runner.`);
                log(`Barretta: Failed reload macro runner.`);
              }
            }
          })();
          break;
        }

        case "push": {
          pushExcel();
          break;
        }

        case "pull": {
          pullExcel();
          break;
        }

        case "open": {
          openBook();
          break;
        }

        case "runMacro": {
          let arrayArgs: (string | number | boolean)[] = [];
          if (data.args !== "") {
            const tmp: string = data.args.replace(/"/g, "");
            arrayArgs = tmp.split(", ");
          }

          // console.log(data.call);
          // console.log(JSON.stringify(arrayArgs));
          log(`Run Macro: ${data.call} with args: ${JSON.stringify(arrayArgs)}`);
          callMacro(data.call, arrayArgs);
          break;
        }

        case "show-Settings": {
          // Open VSCode settings, navigate to Barretta extension settings
          // log(`Barretta: Open VSCode settings.`);
          showSettings();
          break;
        }
      }
    });
  }



  private _getHtmlForWebview(webview: vscode.Webview) {
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    // const i18nScriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "i18n.js"));
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "main.js"));

    // Do the same for the stylesheet.
    const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "reset.css"));
    const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css"));
    const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "main.css"));

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    // Import Launcher Data and Generate HTML.
    const rootPath: string | undefined = setRootPathAsWebView();

    // load sidebar menu locale data, based on current vscode language setting
    const localeData = loadSidebarLocale(this._extensionUri, vscode.env.language || "en");

    let macroList = `<div class="macro-list">
											${localeData.noMacro || "No macros."}
										</div>`;
    if (rootPath !== undefined) {
      const jsonPath = path.join(String(rootPath), `barretta-launcher.json`);

      if (fs.existsSync(jsonPath)) {
        try {
          const jsonData: LaunchJson = JSON.parse(fs.readFileSync(jsonPath).toString());

          let tmp = "";
          jsonData.macros.forEach((macro, index) => {
            let fixArgs = "";
            if (macro.args.length > 0) {
              const stringArgFix = macro.args.map((arg) => {
                if (typeof arg === "string") {
                  return `"${arg}"`;
                } else {
                  return arg;
                }
              });
              fixArgs = stringArgFix.join(", ");
            }

            const macroCard = `
					<div id="macro-card${index}" class="macro-card">
						<hr>
						<div id="macro-header${index}" class="macro-header">
						<button id="${index}" class="run-button">${localeData.run}</button>
							<h2>${macro.title}</h2>
						</div>
						<div id="macro-params${index}" class="macro-params">
							<div id="macro-method${index}" class="macro-method">
								<div class="label">${localeData.method}</div>
								<h3 id="method${index}">${macro.call}</h3>
							</div>
							<div id="macro-args${index}" class="macro-args">
								<div class="label">${localeData.args}</div>
								<h3 id="args${index}">${fixArgs}</h3>
							</div>
						</div>
						<div class="macro-desc">
						${macro.description}
						</div>
					</div>
					`;
            tmp = tmp + macroCard;
          });

          if (tmp !== "") macroList = tmp;
        } catch {
          macroList = `Error : Check [barretta-launcher.json]`;
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
				<h2>${localeData.commands || "Commands"}</h2>
        <div class="short-cut-buttons">
          <button class="push-button">${localeData.push || "Push"}</button>
          <button class="pull-button">${localeData.pull || "Pull"}</button>
          <button class="open-button">${localeData.open || "Open"}</button>
          <button class="settings-button">${localeData.pluginSettings || "Settings"}</button>
        </div>
			</div>
			<div class="macro-list">
				<div class="macrolist-header">
					<h2>${localeData.macroRunner || "Macro Runner"}</h2>
					<button class="reload-button">${localeData.reload || "Reload"}</button>
				</div>
				<div class="macrolist-body">
					${macroList}
				</div>
			</div>
			<script nonce="${nonce}" src="${scriptUri}"></script>
      <script nonce="${nonce}" id="webview-locale">${JSON.stringify(localeData)}</script>
		</body>
		</html>`;
  }
}

function getNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const setRootPathAsWebView = () => {
  let rootPath: string | undefined;

  if (!vscode.window.activeTextEditor) {
    if (vscode.workspace.workspaceFolders === undefined) {
      // console.log(`Barretta: The target could not be identified because the folder was not opened.`);
      log(`Barretta: The target could not be identified because the folder was not opened.`);
      return undefined;
    }

    return rootPath;
  } else {
    const activeEditorPath: vscode.Uri = vscode.window.activeTextEditor.document.uri;
    if (vscode.workspace.getWorkspaceFolder(activeEditorPath) !== undefined) {
      const rootWsFolder: vscode.WorkspaceFolder | undefined = vscode.workspace.getWorkspaceFolder(activeEditorPath);

      rootPath = rootWsFolder?.uri.path.replace(/^\//, "");
      // console.log(`Barretta: ${rootPath} was selected from the current active editors.`);
      log(`Barretta: ${rootPath} was selected from the current active editors.`);
      return rootPath;
    } else {
      // console.log(`Barretta: Failed to locate root folder.`);
      log(`Barretta: Failed to locate root folder.`);
      return undefined;
    }
  }
};

