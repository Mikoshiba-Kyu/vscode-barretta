import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'
import * as iconv from 'iconv-lite'
import * as encoding from 'encoding-japanese'
import * as gen from './generator'
import { setRootPath } from './lib_vscode_api'
import { preCheckCallMacro, preCheckInit, preCheckOpen, preCheckPull, preCheckPush } from './api_precheck'

const { spawn } = require('child_process')

type Initialize = {
  (): void
}

type OpenBook = {
  (): void
}

type CallMacro = {
  (callMethod: string, methodParams?: (string | number | boolean)[] | undefined): void
}

type PushExcel = {
  (): void
}

type PullExcel = {
  (): void
}

type RunPS1 = {
  (ps1Params: Ps1Params): Promise<boolean>
}

type Ps1Params = {
  execType: string,
  ps1FilePath: string
}

export const initialize: Initialize = async () => {
  console.log(`Barretta: Start initialize.`)

  const rootPath: string | undefined = await setRootPath()

  if (rootPath === undefined) {
    console.log(`Barretta: Exit initialize.`)
    return
  }

  if (!preCheckInit(rootPath)) {
    console.log(`Barretta: Failed preCheckInit.`)
    return
  }

  try {
    fs.appendFileSync(path.join(rootPath, '.gitignore'), gen.generateGitignore())
    console.log('Barretta: CreateFile : .gitignore')

    fs.appendFileSync(path.join(rootPath, 'barretta.code-workspace'), gen.generateWorkspace())
    console.log('Barretta: CreateFile : barretta.code-workspace')

    fs.mkdirSync(path.join(rootPath, 'excel_file'))
    console.log('Barretta: CreateFolder : excel_file')

    fs.mkdirSync(path.join(rootPath, 'code_modules'))
    console.log('Barretta: CreateFolder : code_modules')

    fs.mkdirSync(path.join(rootPath, 'barretta-core'))
    console.log('Barretta: CreateFolder : barretta-core')

    fs.mkdirSync(path.join(rootPath, 'barretta-core/scripts'))
    console.log('Barretta: CreateFolder : scripts')

    fs.mkdirSync(path.join(rootPath, 'barretta-core/dist'))
    console.log('Barretta: CreateFolder : dist')

    fs.mkdirSync(path.join(rootPath, 'barretta-core/types'))
    console.log('Barretta: CreateFolder : types')

    fs.appendFileSync(path.join(rootPath, 'barretta-launcher.json'), gen.generateBarrettaLauncher())
    console.log('Barretta: CreateFile : barretta-launcher.json')

    vscode.window.showInformationMessage('Barretta: フォルダの初期化が完了しました。')
    console.log(`Barretta: Complete initialize.`)

  } catch {
    vscode.window.showErrorMessage('Barretta: フォルダの初期化が失敗しました。')
    console.log(`Barretta: Failed initialize.`)
  }
}

export const pushExcel: PushExcel = async () => {
  console.log(`Barretta: Start pushExcel.`)

  const rootPath: string | undefined = await setRootPath()

  if (rootPath === undefined) {
    console.log(`Barretta: Exit pushExcel.`)
    return
  }

  if (!preCheckPush(rootPath)) {
    console.log(`Barretta: Failed preCheckPush.`)
    return
  }

  const fileList: string[] = fs.readdirSync(path.join(rootPath, 'excel_file'))
  const excelFileList: string[] = fileList.filter(fileName => fileName.match(/^(?!~\$).*\.(xls$|xlsx$|xlsm$|xlsb$|xlam$)/g))
  const fileName: string = excelFileList[0]

  vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: 'Barretta: Push' }, async progress => {
    progress.report({ message: 'Working....' })

    const ps1FilePath = path.join(rootPath, 'barretta-core/scripts/push_modules.ps1')

    try {
      // dist フォルダがなければ再作成する。ある場合は中身を空にする
      const distPath: string = path.join(rootPath, 'barretta-core/dist')
      if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath)
        console.log(`Barretta: Recreate [dist] folder.`)
      } else {
        fs.readdirSync(distPath).map(file => {
          fs.unlinkSync(path.join(distPath, file))
          console.log(`Barretta: Delete ${file}.`)
        })
      }

      // code_modules 内のファイルを dist にコピーする
      const codeModulesPath: string = path.join(rootPath, 'code_modules')
      fs.readdirSync(codeModulesPath).map(file => {
        fs.copyFileSync(path.join(codeModulesPath, file), path.join(distPath, file))
        console.log(`Barretta: File Copied to dist. : ${file}`)
      })

      // dist のファイルで UTF-8 のものを SJIS に変換する (frxファイルを除く)
      fs.readdirSync(distPath).map(file => {
        if (path.extname(file) !== '.frx') {
          const txtData: Buffer = fs.readFileSync(path.join(distPath, file))
          if (encoding.detect(txtData) === 'UTF8') {
            const buf: Buffer = iconv.encode(String(txtData), 'CP932')
            fs.writeFileSync(path.join(distPath, file), buf)
            console.log(`Barretta: ${file} encoding to Shift-JIS.`)
          }
        }
      })

      // Generate push_modules.ps1
      const genParams = {
        rootPath,
        fileName
      }
      fs.appendFileSync(ps1FilePath, gen.generatePushPs1(genParams))
      console.log('Barretta: push_modules.ps1 Created.')

      // ps1ファイルをShift-JISに変換
      const txtData: Buffer = fs.readFileSync(ps1FilePath)
      const buf: Buffer = iconv.encode(String(txtData), 'CP932')
      fs.writeFileSync(ps1FilePath, buf)
      console.log(`Barretta: push_modules.ps1 encoding to Shift-JIS.`)

      // push_modules.ps1 を実行する
      const ps1Params: Ps1Params = {
        execType: "-File",
        ps1FilePath
      }

      if (await runPs1(ps1Params)) {
        vscode.window.showInformationMessage(`Barretta: ExcelファイルにImportしました。`)
        console.log(`Barretta: Complete pushExcel.`)
      } else {
        vscode.window.showErrorMessage(`Barretta: コードモジュールのImportが失敗しました。`)
        console.log(`Barretta: Failed pushExcel.`)
      }
    }
    catch (e) {
      console.error(`Barretta: unknown error has occured.`)
      console.error(e)
    }
    finally {
      fs.unlinkSync(ps1FilePath)
      console.log(`Barretta: push_modules.ps1 deleted.`)
    }
  })
}

export const pullExcel: PullExcel = async () => {
  console.log(`Barretta: Start pullExcel.`)

  const rootPath: string | undefined = await setRootPath()

  if (rootPath === undefined) {
    console.log(`Barretta: Exit pullExcel.`)
    return
  }

  if (!preCheckPull(rootPath)) {
    console.log(`Barretta: Failed preCheckPull.`)
    return
  }

  const fileList: string[] = fs.readdirSync(path.join(rootPath, 'excel_file'))
  const excelFileList: string[] = fileList.filter(fileName => fileName.match(/^(?!~\$).*\.(xls$|xlsx$|xlsm$|xlsb$|xlam$)/g))
  const fileName: string = excelFileList[0]

  vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: 'Barretta: Pull' }, async progress => {
    progress.report({ message: 'Working....' })

    const ps1FilePath = path.join(rootPath, 'barretta-core/scripts/pull_modules.ps1')

    try {
      // Generate push_modules.ps1
      const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('pull')
      const pullIgnoreDocument: boolean = config.get('ignoreDocuments') ?? false

      const genParams = {
        rootPath,
        fileName,
        pullIgnoreDocument
      }
      fs.appendFileSync(ps1FilePath, gen.generatePullPs1(genParams))
      console.log('Barretta: pull_modules.ps1 Created.')

      // ps1ファイルをShift-JISに変換
      const txtData: Buffer = fs.readFileSync(ps1FilePath)
      const buf: Buffer = iconv.encode(String(txtData), 'CP932')
      fs.writeFileSync(ps1FilePath, buf)
      console.log(`Barretta: pull_modules.ps1 encoding to Shift-JIS.`)

      // pull_modules.ps1 を実行する
      const ps1Params: Ps1Params = {
        execType: "-File",
        ps1FilePath
      }

      if (await runPs1(ps1Params)) {
        const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('pull')

        if (config.get('encodingToUtf8')) {
          const modulePath = path.join(rootPath, 'code_modules')
          fs.readdirSync(modulePath).map(file => {
            if (path.extname(file) !== '.frx') {
              const txtData: Buffer = fs.readFileSync(path.join(modulePath, file))
              const buf: string = iconv.decode(txtData, 'Shift-JIS')
              fs.writeFileSync(path.join(modulePath, file), buf)
              console.log(`Barretta: ${file} encoding to UTF-8.`)
            }
          })
        }

        vscode.window.showInformationMessage('Barretta: code_modulesフォルダにExportしました。')
        console.log(`Barretta: Complete pullExcel.`)

      } else {
        vscode.window.showErrorMessage('Barretta: コードモジュールのExportが失敗しました。')
        console.log(`Barretta: Failed  pullExcel.`)
      }

    }
    catch (e) {
      console.error(`Barretta: unknown error has occured.`)
      console.error(e)
    }
    finally {
      fs.unlinkSync(ps1FilePath)
      console.log(`Barretta: pull_modules.ps1 deleted.`)
    }
  })
}

export const openBook: OpenBook = async () => {
  console.log(`Barretta: Start openBook.`)

  const rootPath: string | undefined = await setRootPath()

  if (rootPath === undefined) {
    console.log(`Barretta: Exit openBook.`)
    return
  }

  if (!preCheckOpen(rootPath)) {
    console.log(`Barretta: Failed preCheckOpen.`)
    return
  }

  const fileList: string[] = fs.readdirSync(path.join(rootPath, 'excel_file'))
  const excelFileList: string[] = fileList.filter(fileName => fileName.match(/^(?!~\$).*\.(xls$|xlsx$|xlsm$|xlsb$|xlam$)/g))
  const fileName: string = excelFileList[0]

  vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: 'Barretta: Open' }, async progress => {
    progress.report({ message: 'Working....' })

    const ps1FilePath = path.join(rootPath, 'barretta-core/scripts/open_excelbook.ps1')

    try {
      // Generate open_excelbook.ps1
      const genParams = {
        rootPath,
        fileName
      }
      fs.appendFileSync(ps1FilePath, gen.generateOpenBookPs1(genParams))
      console.log('Barretta: open_excelbook.ps1 Created.')

      // ps1ファイルをShift-JISに変換
      const txtData: Buffer = fs.readFileSync(ps1FilePath)

      const buf: Buffer = iconv.encode(String(txtData), 'CP932')
      fs.writeFileSync(ps1FilePath, buf)
      console.log(`Barretta: open_excelbook.ps1 encoding to Shift-JIS.`)

      // open_excelbook.ps1 を実行する
      const ps1Params: Ps1Params = {
        execType: "-File",
        ps1FilePath
      }

      if (await runPs1(ps1Params)) {
        vscode.window.showInformationMessage('Barretta: Excelブックを開きました。')
        console.log(`Barretta: Complete openBook.`)
      } else {
        vscode.window.showErrorMessage('Barretta: Excelブックを開けませんでした。')
        console.log(`Barretta: Failed openBook.`)
      }
    }
    catch (e) {
      console.error(`Barretta: unknown error has occured.`)
      console.error(e)
    }
    finally {
      fs.unlinkSync(ps1FilePath)
      console.log(`Barretta: open_excelbook.ps1 deleted.`)
    }
  })
}

export const callMacro: CallMacro = async (callMethod, methodParams?) => {
  console.log(`Barretta: Start callMacro.`)

  const rootPath: string | undefined = await setRootPath()

  if (rootPath === undefined) {
    console.log(`Barretta: Exit callMacro.`)
    return
  }

  if (!preCheckCallMacro(rootPath)) {
    console.log(`Barretta: Failed callMacro.`)
    return
  }

  const fileList: string[] = fs.readdirSync(path.join(rootPath, 'excel_file'))
  const excelFileList: string[] = fileList.filter(fileName => fileName.match(/^(?!~\$).*\.(xls$|xlsx$|xlsm$|xlsb$|xlam$)/g))
  const fileName: string = excelFileList[0]

  // Generate run_macro.ps1
  const genParams = {
    rootPath,
    fileName,
    callMethod,
    methodParams
  }
  fs.appendFileSync(path.join(rootPath, 'barretta-core/scripts/run_macro.ps1'), gen.generateRunMacroPs1(genParams))
  console.log('Barretta: run_macro.ps1 Created.')

  vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: 'Barretta: LaunchMacro' }, async progress => {
    progress.report({ message: 'Working....' })
    try {
      const ps1FilePath = path.join(rootPath, 'barretta-core/scripts/run_macro.ps1')

      // ps1ファイルをShift-JISに変換
      const txtData: Buffer = fs.readFileSync(ps1FilePath)
      const buf: Buffer = iconv.encode(String(txtData), 'CP932')
      fs.writeFileSync(ps1FilePath, buf)
      console.log(`Barretta: run_macro.ps1 encoding to Shift-JIS.`)

      // pull_modules.ps1 を実行する
      const ps1Params: Ps1Params = {
        execType: "-File",
        ps1FilePath
      }

      if (await runPs1(ps1Params)) {
        vscode.window.showInformationMessage('Barretta: マクロの実行が完了しました。')
        console.log(`Barretta: run_macro.ps1 completed.`)
      } else {
        vscode.window.showErrorMessage('Barretta: マクロの実行が失敗しました。')
        console.log(`Barretta: run_macro.ps1 failed.`)
      }

    }
    catch (e) {
      console.error(`Barretta: unknown error has occured.`)
      console.error(e)
    }
    finally {
      fs.unlinkSync(path.join(rootPath, 'barretta-core/scripts/run_macro.ps1'))
      console.log(`Barretta: run_macro.ps1 deleted.`)
    }
  })
}

const runPs1: RunPS1 = async (ps1Params): Promise<boolean> => {
  console.log(`runPs1 : start`)

  const child = spawn("powershell.exe", ["-ExecutionPolicy", "Bypass", ps1Params.execType, ps1Params.ps1FilePath])

  let info = ''
  for await (const chunk of child.stdout) {
    console.log(`Powershell Info: ${chunk}`)
    info += chunk
  }

  let error = ''
  for await (const chunk of child.stderr) {
    console.log(`Powershell Errors: ${chunk}`)
    error += chunk
  }

  const exitCode = await new Promise((resolve) => {
    child.on('close', resolve)
  })

  if (exitCode) {
    const result = `SubProcess Error Exit ${exitCode}, ${error}`
    console.log(`runPs1 : error-end ${result}`)
    throw new Error(result)
  }

  return error === '' ? true : false
}
