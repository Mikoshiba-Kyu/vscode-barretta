import * as fs from "node:fs";
import * as path from "node:path";
import * as encoding from "encoding-japanese";
import * as iconv from "iconv-lite";
import * as vscode from "vscode";
import { getEncodingConfig, l } from "./i18n";
import { log } from "./logger";
import { preCheckCallMacro, preCheckInit, preCheckOpen, preCheckPull, preCheckPush } from "./api_precheck";
import * as gen from "./generator";
import { setRootPath } from "./lib_vscode_api";

const { spawn } = require("node:child_process");

type Initialize = () => void;

type OpenBook = () => void;

type CallMacro = (callMethod: string, methodParams?: (string | number | boolean)[] | undefined) => void;

type PushExcel = () => void;

type PullExcel = () => void;

type ShowSettings = () => void;

type RunPS1 = (ps1Params: Ps1Params) => Promise<boolean>;

type Ps1Params = {
  execType: string;
  ps1FilePath: string;
};

export const initialize: Initialize = async () => {
  // console.log(`Barretta: Start initialize.`);
  log(`Barretta: Start initialize.`);

  const rootPath: string | undefined = await setRootPath();

  if (rootPath === undefined) {
    // console.log(`Barretta: Exit initialize.`);
    log(`Barretta: Exit initialize.`);
    return;
  }

  if (!preCheckInit(rootPath)) {
    // console.log(`Barretta: Failed preCheckInit.`);
    log(`Barretta: Failed preCheckInit.`);
    return;
  }

  try {
    fs.appendFileSync(path.join(rootPath, ".gitignore"), gen.generateGitignore());
    // console.log("Barretta: CreateFile : .gitignore");
    log(`Barretta: CreateFile : .gitignore`);

    fs.appendFileSync(path.join(rootPath, "barretta.code-workspace"), gen.generateWorkspace());
    // console.log("Barretta: CreateFile : barretta.code-workspace");
    log(`Barretta: CreateFile : barretta.code-workspace`);

    fs.mkdirSync(path.join(rootPath, "excel_file"));
    // console.log("Barretta: CreateFolder : excel_file");
    log(`Barretta: CreateFolder : excel_file`);

    fs.mkdirSync(path.join(rootPath, "code_modules"));
    // console.log("Barretta: CreateFolder : code_modules");
    log(`Barretta: CreateFolder : code_modules`);

    fs.mkdirSync(path.join(rootPath, "barretta-core"));
    // console.log("Barretta: CreateFolder : barretta-core");
    log(`Barretta: CreateFolder : barretta-core`);

    fs.mkdirSync(path.join(rootPath, "barretta-core/scripts"));
    // console.log("Barretta: CreateFolder : scripts");
    log(`Barretta: CreateFolder : scripts`);

    fs.mkdirSync(path.join(rootPath, "barretta-core/dist"));
    // console.log("Barretta: CreateFolder : dist");
    log(`Barretta: CreateFolder : dist`);

    fs.mkdirSync(path.join(rootPath, "barretta-core/types"));
    // console.log("Barretta: CreateFolder : types");
    log(`Barretta: CreateFolder : types`);

    fs.appendFileSync(path.join(rootPath, "barretta-launcher.json"), gen.generateBarrettaLauncher());
    // console.log("Barretta: CreateFile : barretta-launcher.json");
    log(`Barretta: CreateFile : barretta-launcher.json`);

    vscode.window.showInformationMessage(`Barretta: ${l("init.complete")}`);
    // console.log(`Barretta: Complete initialize.`);
    log(`Barretta: Complete initialize.`);
  } catch {
    vscode.window.showErrorMessage(`Barretta: ${l("init.failed")}`);
    // console.log(`Barretta: Failed initialize.`);
    log(`Barretta: Failed initialize.`);
  }
};


// push code_modules (in code_modules folder, each module/class is a standalone file) to excel (in excel_file folder)
export const pushExcel: PushExcel = async () => {
  // console.log(`Barretta: Start pushExcel.`);
  log(`Barretta: Start pushExcel.`);

  const rootPath: string | undefined = await setRootPath();
  if (rootPath === undefined) {
    // console.log(`Barretta: Exit pushExcel.`);
    log(`Barretta: Exit pushExcel.`);
    return;
  }
  if (!preCheckPush(rootPath)) {
    // console.log(`Barretta: Failed preCheckPush.`);
    log(`Barretta: Failed preCheckPush.`);
    return;
  }

  // Read encoding setting
  const { vbaEncoding, targetEncoding } = getEncodingConfig();

  const fileList: string[] = fs.readdirSync(path.join(rootPath, "excel_file"));
  const excelFileList: string[] = fileList.filter((fileName) =>
    fileName.match(/^(?!~\$).*\.(xls$|xlsx$|xlsm$|xlsb$|xlam$)/g),
  );
  const fileName: string = excelFileList[0];

  vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: l("progress.push") },
    async (progress) => {
      progress.report({ message: "Working...." });

      const ps1FilePath = path.join(rootPath, "barretta-core/scripts/push_modules.ps1");

      try {
        // dist フォルダがなければ再作成する。ある場合は中身を空にす�?
        const distPath: string = path.join(rootPath, "barretta-core/dist");
        if (!fs.existsSync(distPath)) {
          fs.mkdirSync(distPath);
          // console.log(`Barretta: Recreate [dist] folder.`);
          log(`Barretta: Recreate [dist] folder.`);
        } else {
          fs.readdirSync(distPath).map((file) => {
            fs.unlinkSync(path.join(distPath, file));
            // console.log(`Barretta: Delete ${file}.`);
            log(`Barretta: Delete ${file}.`);
          });
        }

        // Copy files in code_modules to dist on file saved
        const codeModulesPath: string = path.join(rootPath, "code_modules");
        fs.readdirSync(codeModulesPath).map((file) => {
          fs.copyFileSync(path.join(codeModulesPath, file), path.join(distPath, file));
          // console.log(`Barretta: File Copied to dist. : ${file}`);
          log(`Barretta: File Copied to dist. : ${file}`);
        });

        // dist file encoding conversion (except for frx files) (using custom encoding setting)
        fs.readdirSync(distPath).map((file) => {
          if (path.extname(file) !== ".frx") {
            const txtData: Buffer = fs.readFileSync(path.join(distPath, file));
            if (encoding.detect(txtData) === "UTF8") {
              const buf: Buffer = iconv.encode(String(txtData), targetEncoding);
              fs.writeFileSync(path.join(distPath, file), buf);
              // console.log(`Barretta: ${file} encoding to ${vbaEncoding}.`);
              log(`Barretta: ${file} encoding to ${vbaEncoding}.`);
            }
          }
        });

        // Generate push_modules.ps1
        const genParams = {
          rootPath,
          fileName,
        };
        fs.appendFileSync(ps1FilePath, gen.generatePushPs1(genParams));
        // console.log("Barretta: push_modules.ps1 Created.");
        log(`Barretta: push_modules.ps1 Created.`);

        // ps1 file encoding conversion (using custom encoding setting)
        const txtData: Buffer = fs.readFileSync(ps1FilePath);
        const buf: Buffer = iconv.encode(String(txtData), targetEncoding);
        fs.writeFileSync(ps1FilePath, buf);
        // console.log(`Barretta: push_modules.ps1 encoding to ${vbaEncoding}.`);
        log(`Barretta: push_modules.ps1 encoding to ${vbaEncoding}.`);

        // push_modules.ps1
        const ps1Params: Ps1Params = {
          execType: "-File",
          ps1FilePath,
        };

        if (await runPs1(ps1Params)) {
          vscode.window.showInformationMessage(`Barretta: ${l("push.complete")}`);
          // console.log(`Barretta: Complete pushExcel.`);
          log(`Barretta: Complete pushExcel.`);
        } else {
          vscode.window.showErrorMessage(`Barretta: ${l("push.failed")}`);
          // console.log(`Barretta: Failed pushExcel.`);
          log(`Barretta: Failed pushExcel.`);
        }
      } catch (e) {
        // console.error(`Barretta: unknown error has occured.`);
        // console.error(e);
        log(`Barretta: unknown error has occured.`);
        log(String(e));
      } finally {
        fs.unlinkSync(ps1FilePath);
        // console.log(`Barretta: push_modules.ps1 deleted.`);
        log(`Barretta: push_modules.ps1 deleted.`);
      }
    },
  );
};

export const pullExcel: PullExcel = async () => {
  log(`Barretta: Start pullExcel.`);

  const rootPath: string | undefined = await setRootPath();
  if (rootPath === undefined) {
    // console.log(`Barretta: Exit pullExcel.`);
    log(`Barretta: Exit pullExcel.`);
    return;
  }
  if (!preCheckPull(rootPath)) {
    // console.log(`Barretta: Failed preCheckPull.`);
    log(`Barretta: Failed preCheckPull.`);
    return;
  }

  // read encoding setting
  const { vbaEncoding, targetEncoding } = getEncodingConfig();

  const fileList: string[] = fs.readdirSync(path.join(rootPath, "excel_file"));
  const excelFileList: string[] = fileList.filter((fileName) =>
    fileName.match(/^(?!~\$).*\.(xls$|xlsx$|xlsm$|xlsb$|xlam$)/g),
  );
  const fileName: string = excelFileList[0];

  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: l("progress.pull"),
    },
    async (progress) => {
      progress.report({ message: "Working...." });

      const ps1FilePath = path.join(
        rootPath,
        "barretta-core/scripts/pull_modules.ps1",
      );

      try {
        // Generate pull_modules.ps1
        const config: vscode.WorkspaceConfiguration =
          vscode.workspace.getConfiguration("barretta");
        const pullIgnoreDocument: boolean =
          config.get("barretta.pull.ignoreDocuments") ?? false;

        const genParams = {
          rootPath,
          fileName,
          pullIgnoreDocument,
        };
        fs.appendFileSync(ps1FilePath, gen.generatePullPs1(genParams));
        // console.log("Barretta: pull_modules.ps1 Created.");
        log(`Barretta: pull_modules.ps1 Created.`);

        // ps1 file encoding conversion (using custom encoding setting)
        const txtData: Buffer = fs.readFileSync(ps1FilePath);
        const buf: Buffer = iconv.encode(String(txtData), targetEncoding);
        fs.writeFileSync(ps1FilePath, buf);
        // console.log(`Barretta: pull_modules.ps1 encoding to ${vbaEncoding}.`);
        log(`Barretta: pull_modules.ps1 encoding to ${vbaEncoding}.`);

        // pull_modules.ps1
        const ps1Params: Ps1Params = {
          execType: "-File",
          ps1FilePath,
        };

        if (await runPs1(ps1Params)) {
          const config: vscode.WorkspaceConfiguration =
            vscode.workspace.getConfiguration("barretta");

          if (config.get("barretta.pull.encodingToUtf8")) {

            const modulePath = path.join(rootPath, "code_modules");
            fs.readdirSync(modulePath).map((file) => {
              if (path.extname(file) !== ".frx") {
                const txtData: Buffer = fs.readFileSync(
                  path.join(modulePath, file),
                );

                // decode the file: using custom encoding setting
                const buf: string = iconv.decode(txtData, targetEncoding);
                fs.writeFileSync(path.join(modulePath, file), buf);
                // console.log(`Barretta: ${file} encoding to UTF-8.`);
                log(`Barretta: ${file} encoding to UTF-8.`);
              }
            });
          }

          vscode.window.showInformationMessage(
            `Barretta: ${l("pull.complete")}`,
          );
          // console.log(`Barretta: Complete pullExcel.`);
          log(`Barretta: Complete pullExcel.`);
        } else {
          vscode.window.showErrorMessage(`Barretta: ${l("pull.failed")}`);
          // console.log(`Barretta: Failed  pullExcel.`);
          log(`Barretta: Failed  pullExcel.`);
        }
      } catch (e) {
        // console.error(`Barretta: unknown error has occured.`);
        // console.error(e);
        log(`Barretta: unknown error has occured.`);
        log(String(e));
      } finally {
        fs.unlinkSync(ps1FilePath);
        // console.log(`Barretta: pull_modules.ps1 deleted.`);
        log(`Barretta: pull_modules.ps1 deleted.`);
      }
    },
  );
};

export const openBook: OpenBook = async () => {
  log(`Barretta: Start openBook.`);

  const rootPath: string | undefined = await setRootPath();
  if (rootPath === undefined) {
    // console.log(`Barretta: Exit openBook.`);
    log(`Barretta: Exit openBook.`);
    return;
  }
  if (!preCheckOpen(rootPath)) {
    // console.log(`Barretta: Failed preCheckOpen.`);
    log(`Barretta: Failed preCheckOpen.`);
    return;
  }

  // read encoding setting
  const { vbaEncoding, targetEncoding } = getEncodingConfig();

  const fileList: string[] = fs.readdirSync(path.join(rootPath, "excel_file"));
  const excelFileList: string[] = fileList.filter((fileName) =>
    fileName.match(/^(?!~\$).*\.(xls$|xlsx$|xlsm$|xlsb$|xlam$)/g),
  );
  const fileName: string = excelFileList[0];

  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: l("progress.open"),
    },
    async (progress) => {
      progress.report({ message: "Working...." });

      const ps1FilePath = path.join(
        rootPath,
        "barretta-core/scripts/open_excelbook.ps1",
      );

      try {
        // Generate open_excelbook.ps1
        const genParams = {
          rootPath,
          fileName,
        };
        fs.appendFileSync(ps1FilePath, gen.generateOpenBookPs1(genParams));
        // console.log("Barretta: open_excelbook.ps1 Created.");
        log(`Barretta: open_excelbook.ps1 Created.`);

        // ps1文件编码转换
        // PS1 file encoding conversion (using custom encoding setting)
        const txtData: Buffer = fs.readFileSync(ps1FilePath);
        const buf: Buffer = iconv.encode(String(txtData), targetEncoding);
        fs.writeFileSync(ps1FilePath, buf);
        // console.log(`Barretta: open_excelbook.ps1 encoding to ${vbaEncoding}.`);
        log(`Barretta: open_excelbook.ps1 encoding to ${vbaEncoding}.`);

        // open_excelbook.ps1
        const ps1Params: Ps1Params = {
          execType: "-File",
          ps1FilePath,
        };

        if (await runPs1(ps1Params)) {
          vscode.window.showInformationMessage(
            `Barretta: ${l("open.complete")}`,
          );
          console.log(`Barretta: Complete openBook.`);
        } else {
          vscode.window.showErrorMessage(`Barretta: ${l("open.failed")}`);
          // console.log(`Barretta: Failed openBook.`);
          log(`Barretta: Failed openBook.`);
        }
      } catch (e) {
        // console.error(`Barretta: unknown error has occured.`);
        // console.error(e);
        log(`Barretta: unknown error has occured.`);
        log(String(e));
      } finally {
        fs.unlinkSync(ps1FilePath);
        // console.log(`Barretta: open_excelbook.ps1 deleted.`);
        log(`Barretta: open_excelbook.ps1 deleted.`);
      }
    },
  );
};

export const callMacro: CallMacro = async (callMethod, methodParams?) => {
  log(`Barretta: Start callMacro.`);

  const rootPath: string | undefined = await setRootPath();
  if (rootPath === undefined) {
    // console.log(`Barretta: Exit callMacro.`);
    log(`Barretta: Exit callMacro.`);
    return;
  }
  if (!preCheckCallMacro(rootPath)) {
    // console.log(`Barretta: Failed callMacro.`);
    log(`Barretta: Failed callMacro.`);
    return;
  }

  // Read encoding settings
  const { vbaEncoding, targetEncoding } = getEncodingConfig();

  const fileList: string[] = fs.readdirSync(path.join(rootPath, "excel_file"));
  const excelFileList: string[] = fileList.filter((fileName) =>
    fileName.match(/^(?!~\$).*\.(xls$|xlsx$|xlsm$|xlsb$|xlam$)/g),
  );
  const fileName: string = excelFileList[0];

  // Generate run_macro.ps1
  const genParams = {
    rootPath,
    fileName,
    callMethod,
    methodParams,
  };
  fs.appendFileSync(path.join(rootPath, "barretta-core/scripts/run_macro.ps1"), gen.generateRunMacroPs1(genParams));
  // console.log("Barretta: run_macro.ps1 Created.");
  log(`Barretta: run_macro.ps1 Created.`);

  vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: l("progress.launchMacro") },
    async (progress) => {
      progress.report({ message: "Working...." });
      try {
        const ps1FilePath = path.join(rootPath, "barretta-core/scripts/run_macro.ps1");

        // ps1文件编码转换
        // ps1 file encoding conversion (using custom encoding setting)
        const txtData: Buffer = fs.readFileSync(ps1FilePath);
        const buf: Buffer = iconv.encode(String(txtData), targetEncoding);
        fs.writeFileSync(ps1FilePath, buf);
        // console.log(`Barretta: run_macro.ps1 encoding to ${vbaEncoding}.`);
        log(`Barretta: run_macro.ps1 encoding to ${vbaEncoding}.`);

        // pull_modules.ps1
        const ps1Params: Ps1Params = {
          execType: "-File",
          ps1FilePath,
        };

        if (await runPs1(ps1Params)) {
          vscode.window.showInformationMessage(`Barretta: ${l("macro.complete")}`);
          // console.log(`Barretta: run_macro.ps1 completed.`);
          log(`Barretta: run_macro.ps1 completed.`);
        } else {
          vscode.window.showErrorMessage(`Barretta: ${l("macro.failed")}`);
          // console.log(`Barretta: run_macro.ps1 failed.`);
          log(`Barretta: run_macro.ps1 failed.`);
        }
      } catch (e) {
        // console.error(`Barretta: unknown error has occured.`);
        // console.error(e);
        log(`Barretta: unknown error has occured.`);
        log(String(e));
      } finally {
        fs.unlinkSync(path.join(rootPath, "barretta-core/scripts/run_macro.ps1"));
        // console.log(`Barretta: run_macro.ps1 deleted.`);
        log(`Barretta: run_macro.ps1 deleted.`);
      }
    },
  );
};

const runPs1: RunPS1 = async (ps1Params): Promise<boolean> => {
  log(`runPs1 : start`);

  const child = spawn("powershell.exe", ["-ExecutionPolicy", "Bypass", ps1Params.execType, ps1Params.ps1FilePath]);

  let _info = "";
  for await (const chunk of child.stdout) {
    // console.log(`Powershell Info: ${chunk}`);
    log(`Powershell Info: ${chunk}`);
    _info += chunk;
  }

  let error = "";
  for await (const chunk of child.stderr) {
    // console.log(`Powershell Errors: ${chunk}`);
    log(`Powershell Errors: ${chunk}`);
    error += chunk;
  }

  const exitCode = await new Promise((resolve) => {
    child.on("close", resolve);
  });

  if (exitCode) {
    const result = `SubProcess Error Exit ${exitCode}, ${error}`;
    // console.log(`runPs1 : error-end ${result}`);
    log(`runPs1 : error-end ${result}`);
    throw new Error(result);
  }

  return error === "";
};

export const showSettings: ShowSettings = async () => {
  vscode.commands.executeCommand("workbench.action.openSettings", "@Mikoshiba-Kyu:vscode-barretta");
  log(`Barretta: Show settings.`);
};