import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

type PreCheckInit = {
  (rootPath: string): boolean
}

type PreCheckPush = {
  (rootPath: string): boolean
}

type PreCheckPull = {
  (rootPath: string): boolean
}

type PreCheckOpen = {
  (rootPath: string): boolean
}

type PreCheckCallMacro = {
  (rootPath: string): boolean
}

export const preCheckInit: PreCheckInit = (rootPath) => {

  // [barretta-core] フォルダ存在確認
  const barretta_core = path.join(rootPath, 'barretta-core')
  if (fs.existsSync(barretta_core)) {
    vscode.window.showErrorMessage(`Barretta: 対象のフォルダは既に初期化されています。\n${rootPath}`)
    console.log(`Barretta: The target folder has already been initialized.`)
    return false
  }

  return true
}

export const preCheckPush: PreCheckPush = (rootPath) => {
  console.log(`Barretta: Start preCheckPush.`)

  // [barretta-core] フォルダ存在確認
  const barretta_core = path.join(rootPath, 'barretta-core')
  if (!fs.existsSync(barretta_core)) {
    vscode.window.showErrorMessage(`Barretta: 対象のフォルダに [barretta-core] フォルダが存在していません。\nまず、[Barretta: Init] コマンドでBarrettaプロジェクトを作成する必要があります。\n${barretta_core}`)
    console.log(`Barretta: [barretta-core] folder does not exist.`)
    return false
  }

  // [excel_file] フォルダ存在確認
  const excelFolderPath: string = path.join(rootPath, 'excel_file')
  if (!fs.existsSync(excelFolderPath)) {
    vscode.window.showErrorMessage(`Barretta: [excel_file] フォルダが存在していません。\n${excelFolderPath}`)
    console.log(`Barretta: [excel_file] folder does not exist.`)
    return false
  }

  // 単一Excelファイル存在確認
  const fileList = fs.readdirSync(excelFolderPath)
  const excelFileList = fileList.filter(fileName => fileName.match(/^(?!~\$).*\.(xls$|xlsx$|xlsm$|xlsb$|xlam$)/g))

  if (excelFileList.length === 0) {
    vscode.window.showErrorMessage(`Barretta: Excelファイルが格納されていません。`)
    console.log(`Barretta: Excel file does not exist.`)
    return false

  } else if (excelFileList.length > 1) {
    vscode.window.showErrorMessage(`Barretta: 複数のExcelファイルが格納されています。`)
    console.log(`Barretta: Multiple Excel files exist.`)
    return false
  }

  // [code_modules] フォルダ存在確認
  const codeModulesPath = path.join(rootPath, 'code_modules')
  if (!fs.existsSync(codeModulesPath)) {
    vscode.window.showErrorMessage(`Barretta: [code_modules] フォルダが存在していません。\n${codeModulesPath}`)
    console.log(`Barretta: [code_modules] folder does not exist.`)
    return false
  }

  // [scripts] フォルダ存在確認
  const scriptsPath = path.join(rootPath, 'barretta-core/scripts')
  if (!fs.existsSync(scriptsPath)) {
    vscode.window.showErrorMessage(`Barretta: [scripts] フォルダが存在していません。\n${scriptsPath}`)
    console.log(`Barretta: [scripts] folder does not exist.`)
    return false
  }

  console.log(`Barretta: Complete preCheckPush.`)
  return true
}

export const preCheckPull: PreCheckPull = (rootPath) => {
  console.log(`Barretta: Start preCheckPull.`)

  // [barretta-core] フォルダ存在確認
  const barretta_core = path.join(rootPath, 'barretta-core')
  if (!fs.existsSync(barretta_core)) {
    vscode.window.showErrorMessage(`Barretta: 対象のフォルダに [barretta-core] フォルダが存在していません。\nまず、[Barretta: Init] コマンドでBarrettaプロジェクトを作成する必要があります。\n${barretta_core}`)
    console.log(`Barretta: [barretta-core] folder does not exist.`)
    return false
  }

  // [excel_file] フォルダ存在確認
  const excelFolderPath: string = path.join(rootPath, 'excel_file')
  if (!fs.existsSync(excelFolderPath)) {
    vscode.window.showErrorMessage(`Barretta: [excel_file] フォルダが存在していません。\n${excelFolderPath}`)
    console.log(`Barretta: [excel_file] folder does not exist.`)
    return false
  }

  // 単一Excelファイル存在確認
  const fileList = fs.readdirSync(excelFolderPath)
  const excelFileList = fileList.filter(fileName => fileName.match(/^(?!~\$).*\.(xls$|xlsx$|xlsm$|xlsb$|xlam$)/g))

  if (excelFileList.length === 0) {
    vscode.window.showErrorMessage(`Barretta: Excelファイルが格納されていません。`)
    console.log(`Barretta: Excel file does not exist.`)
    return false

  } else if (excelFileList.length > 1) {
    vscode.window.showErrorMessage(`Barretta: 複数のExcelファイルが格納されています。`)
    console.log(`Barretta: Multiple Excel files exist.`)
    return false
  }

  // [code_modules] フォルダ存在確認
  const codeModulesPath = path.join(rootPath, 'code_modules')
  if (!fs.existsSync(codeModulesPath)) {
    vscode.window.showErrorMessage(`Barretta: [code_modules] フォルダが存在していません。\n${codeModulesPath}`)
    console.log(`Barretta: [code_modules] folder does not exist.`)
    return false
  }

  // [scripts] フォルダ存在確認
  const scriptsPath = path.join(rootPath, 'barretta-core/scripts')
  if (!fs.existsSync(scriptsPath)) {
    vscode.window.showErrorMessage(`Barretta: [scripts] フォルダが存在していません。\n${scriptsPath}`)
    console.log(`Barretta: [scripts] folder does not exist.`)
    return false
  }

  console.log(`Barretta: Complete preCheckPull.`)
  return true
}

export const preCheckOpen: PreCheckOpen = (rootPath) => {
  console.log(`Barretta: Start preCheckOpen.`)

  // [barretta-core] フォルダ存在確認
  const barretta_core = path.join(rootPath, 'barretta-core')
  if (!fs.existsSync(barretta_core)) {
    vscode.window.showErrorMessage(`Barretta: 対象のフォルダに [barretta-core] フォルダが存在していません。\nまず、[Barretta: Init] コマンドでBarrettaプロジェクトを作成する必要があります。\n${barretta_core}`)
    console.log(`Barretta: [barretta-core] folder does not exist.`)
    return false
  }

  // [excel_file] フォルダ存在確認
  const excelFolderPath: string = path.join(rootPath, 'excel_file')
  if (!fs.existsSync(excelFolderPath)) {
    vscode.window.showErrorMessage(`Barretta: [excel_file] フォルダが存在していません。\n${excelFolderPath}`)
    console.log(`Barretta: [excel_file] folder does not exist.`)
    return false
  }

  // 単一Excelファイル存在確認
  const fileList = fs.readdirSync(excelFolderPath)
  const excelFileList = fileList.filter(fileName => fileName.match(/^(?!~\$).*\.(xls$|xlsx$|xlsm$|xlsb$|xlam$)/g))

  if (excelFileList.length === 0) {
    vscode.window.showErrorMessage(`Barretta: Excelファイルが格納されていません。`)
    console.log(`Barretta: Excel file does not exist.`)
    return false

  } else if (excelFileList.length > 1) {
    vscode.window.showErrorMessage(`Barretta: 複数のExcelファイルが格納されています。`)
    console.log(`Barretta: Multiple Excel files exist.`)
    return false
  }

  // [scripts] フォルダ存在確認
  const scriptsPath = path.join(rootPath, 'barretta-core/scripts')
  if (!fs.existsSync(scriptsPath)) {
    vscode.window.showErrorMessage(`Barretta: [scripts] フォルダが存在していません。\n${scriptsPath}`)
    console.log(`Barretta: [scripts] folder does not exist.`)
    return false
  }

  console.log(`Barretta: Complete preCheckOpen.`)
  return true
}

export const preCheckCallMacro: PreCheckCallMacro = (rootPath) => {
  console.log(`Barretta: Start preCheckCallMacro.`)

  // [barretta-core] フォルダ存在確認
  const barretta_core = path.join(rootPath, 'barretta-core')
  if (!fs.existsSync(barretta_core)) {
    vscode.window.showErrorMessage(`Barretta: 対象のフォルダに [barretta-core] フォルダが存在していません。\nまず、[Barretta: Init] コマンドでBarrettaプロジェクトを作成する必要があります。\n${barretta_core}`)
    console.log(`Barretta: [barretta-core] folder does not exist.`)
    return false
  }

  // [excel_file] フォルダ存在確認
  const excelFolderPath: string = path.join(rootPath, 'excel_file')
  if (!fs.existsSync(excelFolderPath)) {
    vscode.window.showErrorMessage(`Barretta: [excel_file] フォルダが存在していません。\n${excelFolderPath}`)
    console.log(`Barretta: [excel_file] folder does not exist.`)
    return false
  }

  // 単一Excelファイル存在確認
  const fileList = fs.readdirSync(excelFolderPath)
  const excelFileList = fileList.filter(fileName => fileName.match(/^(?!~\$).*\.(xls$|xlsx$|xlsm$|xlsb$|xlam$)/g))

  if (excelFileList.length === 0) {
    vscode.window.showErrorMessage(`Barretta: Excelファイルが格納されていません。`)
    console.log(`Barretta: Excel file does not exist.`)
    return false

  } else if (excelFileList.length > 1) {
    vscode.window.showErrorMessage(`Barretta: 複数のExcelファイルが格納されています。`)
    console.log(`Barretta: Multiple Excel files exist.`)
    return false
  }

  // [code_modules] フォルダ存在確認
  const codeModulesPath = path.join(rootPath, 'code_modules')
  if (!fs.existsSync(codeModulesPath)) {
    vscode.window.showErrorMessage(`Barretta: [code_modules] フォルダが存在していません。\n${codeModulesPath}`)
    console.log(`Barretta: [code_modules] folder does not exist.`)
    return false
  }

  // [scripts] フォルダ存在確認
  const scriptsPath = path.join(rootPath, 'barretta-core/scripts')
  if (!fs.existsSync(scriptsPath)) {
    vscode.window.showErrorMessage(`Barretta: [scripts] フォルダが存在していません。\n${scriptsPath}`)
    console.log(`Barretta: [scripts] folder does not exist.`)
    return false
  }

  console.log(`Barretta: Complete preCheckCallMacro.`)
  return true
}
