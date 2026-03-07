import * as fs from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";
import { l } from "./i18n";

type PreCheckInit = (rootPath: string) => boolean;

type PreCheckPush = (rootPath: string) => boolean;

type PreCheckPull = (rootPath: string) => boolean;

type PreCheckOpen = (rootPath: string) => boolean;

type PreCheckCallMacro = (rootPath: string) => boolean;

export const preCheckInit: PreCheckInit = (rootPath) => {
  // [barretta-core] フォルダ存在確認
  // Check if [barretta-core] folder exists
  const barretta_core = path.join(rootPath, "barretta-core");
  if (fs.existsSync(barretta_core)) {
    vscode.window.showErrorMessage(`Barretta: ${l("init.alreadyInitialized", rootPath)}`);
    console.log(`Barretta: The target folder has already been initialized.`);
    return false;
  }

  return true;
};

export const preCheckPush: PreCheckPush = (rootPath) => {
  console.log(`Barretta: Start preCheckPush.`);

  // [barretta-core] フォルダ存在確認
  // Check if [barretta-core] folder exists
  const barretta_core = path.join(rootPath, "barretta-core");
  if (!fs.existsSync(barretta_core)) {
    vscode.window.showErrorMessage(
      `Barretta: ${l("init.coreFolderMissing", barretta_core)}`,
    );
    console.log(`Barretta: [barretta-core] folder does not exist.`);
    return false;
  }

  // [excel_file] フォルダ存在確認
  // Check if [excel_file] folder exists
  const excelFolderPath: string = path.join(rootPath, "excel_file");
  if (!fs.existsSync(excelFolderPath)) {
    vscode.window.showErrorMessage(`Barretta: ${l("init.excelFolderMissing", excelFolderPath)}`);
    console.log(`Barretta: [excel_file] folder does not exist.`);
    return false;
  }

  // 単一Excelファイル存在確認
  // Check for single Excel file existence
  const fileList = fs.readdirSync(excelFolderPath);
  const excelFileList = fileList.filter((fileName) => fileName.match(/^(?!~\$).*\.(xls$|xlsx$|xlsm$|xlsb$|xlam$)/g));

  if (excelFileList.length === 0) {
    vscode.window.showErrorMessage(`Barretta: ${l("init.noExcelFile")}`);
    console.log(`Barretta: Excel file does not exist.`);
    return false;
  } else if (excelFileList.length > 1) {
    vscode.window.showErrorMessage(`Barretta: ${l("init.multipleExcelFiles")}`);
    console.log(`Barretta: Multiple Excel files exist.`);
    return false;
  }

  // [code_modules] フォルダ存在確認
  // Check if code_modules folder exists
  const codeModulesPath = path.join(rootPath, "code_modules");
  if (!fs.existsSync(codeModulesPath)) {
    vscode.window.showErrorMessage(`Barretta: ${l("init.codeModulesMissing", codeModulesPath)}`);
    console.log(`Barretta: [code_modules] folder does not exist.`);
    return false;
  }

  // [scripts] フォルダ存在確認
  // Check if scripts folder exists
  const scriptsPath = path.join(rootPath, "barretta-core/scripts");
  if (!fs.existsSync(scriptsPath)) {
    vscode.window.showErrorMessage(`Barretta: ${l("init.scriptsFolderMissing", scriptsPath)}`);
    console.log(`Barretta: [scripts] folder does not exist.`);
    return false;
  }

  console.log(`Barretta: Complete preCheckPush.`);
  return true;
};

export const preCheckPull: PreCheckPull = (rootPath) => {
  console.log(`Barretta: Start preCheckPull.`);

  // [barretta-core] フォルダ存在確認
  // Check if [barretta-core] folder exists
  const barretta_core = path.join(rootPath, "barretta-core");
  if (!fs.existsSync(barretta_core)) {
    vscode.window.showErrorMessage(
      `Barretta: ${l("init.coreFolderMissing", barretta_core)}`,
    );
    console.log(`Barretta: [barretta-core] folder does not exist.`);
    return false;
  }

  // [excel_file] フォルダ存在確認
  // Check if [excel_file] folder exists
  const excelFolderPath: string = path.join(rootPath, "excel_file");
  if (!fs.existsSync(excelFolderPath)) {
    vscode.window.showErrorMessage(`Barretta: ${l("init.excelFolderMissing", excelFolderPath)}`);
    console.log(`Barretta: [excel_file] folder does not exist.`);
    return false;
  }

  // 単一Excelファイル存在確認
  // Check for single Excel file existence
  const fileList = fs.readdirSync(excelFolderPath);
  const excelFileList = fileList.filter((fileName) => fileName.match(/^(?!~\$).*\.(xls$|xlsx$|xlsm$|xlsb$|xlam$)/g));

  if (excelFileList.length === 0) {
    vscode.window.showErrorMessage(`Barretta: ${l("init.noExcelFile")}`);
    console.log(`Barretta: Excel file does not exist.`);
    return false;
  } else if (excelFileList.length > 1) {
    vscode.window.showErrorMessage(`Barretta: ${l("init.multipleExcelFiles")}`);
    console.log(`Barretta: Multiple Excel files exist.`);
    return false;
  }

  // [code_modules] フォルダ存在確認
  // Check if [code_modules] folder exists
  const codeModulesPath = path.join(rootPath, "code_modules");
  if (!fs.existsSync(codeModulesPath)) {
    vscode.window.showErrorMessage(`Barretta: ${l("init.codeModulesMissing", codeModulesPath)}`);
    console.log(`Barretta: [code_modules] folder does not exist.`);
    return false;
  }

  // [scripts] フォルダ存在確認
  // Check if [scripts] folder exists
  const scriptsPath = path.join(rootPath, "barretta-core/scripts");
  if (!fs.existsSync(scriptsPath)) {
    vscode.window.showErrorMessage(`Barretta: ${l("init.scriptsFolderMissing", scriptsPath)}`);
    console.log(`Barretta: [scripts] folder does not exist.`);
    return false;
  }

  console.log(`Barretta: Complete preCheckPull.`);
  return true;
};

export const preCheckOpen: PreCheckOpen = (rootPath) => {
  console.log(`Barretta: Start preCheckOpen.`);

  // [barretta-core] フォルダ存在確認
  // Check if [barretta-core] folder exists
  const barretta_core = path.join(rootPath, "barretta-core");
  if (!fs.existsSync(barretta_core)) {
    vscode.window.showErrorMessage(
      `Barretta: ${l("init.coreFolderMissing", barretta_core)}`,
    );
    console.log(`Barretta: [barretta-core] folder does not exist.`);
    return false;
  }

  // [excel_file] フォルダ存在確認
  // Check if [excel_file] folder exists
  const excelFolderPath: string = path.join(rootPath, "excel_file");
  if (!fs.existsSync(excelFolderPath)) {
    vscode.window.showErrorMessage(`Barretta: ${l("init.excelFolderMissing", excelFolderPath)}`);
    console.log(`Barretta: [excel_file] folder does not exist.`);
    return false;
  }

  // 単一Excelファイル存在確認
  // Check for single Excel file existence
  const fileList = fs.readdirSync(excelFolderPath);
  const excelFileList = fileList.filter((fileName) => fileName.match(/^(?!~\$).*\.(xls$|xlsx$|xlsm$|xlsb$|xlam$)/g));

  if (excelFileList.length === 0) {
    vscode.window.showErrorMessage(`Barretta: ${l("init.noExcelFile")}`);
    console.log(`Barretta: Excel file does not exist.`);
    return false;
  } else if (excelFileList.length > 1) {
    vscode.window.showErrorMessage(`Barretta: ${l("init.multipleExcelFiles")}`);
    console.log(`Barretta: Multiple Excel files exist.`);
    return false;
  }

  // [scripts] フォルダ存在確認
  // Check if [scripts] folder exists
  const scriptsPath = path.join(rootPath, "barretta-core/scripts");
  if (!fs.existsSync(scriptsPath)) {
    vscode.window.showErrorMessage(`Barretta: ${l("init.scriptsFolderMissing", scriptsPath)}`);
    console.log(`Barretta: [scripts] folder does not exist.`);
    return false;
  }

  console.log(`Barretta: Complete preCheckOpen.`);
  return true;
};

export const preCheckCallMacro: PreCheckCallMacro = (rootPath) => {
  console.log(`Barretta: Start preCheckCallMacro.`);

  // [barretta-core] フォルダ存在確認
  // Check if [barretta-core] folder exists
  const barretta_core = path.join(rootPath, "barretta-core");
  if (!fs.existsSync(barretta_core)) {
    vscode.window.showErrorMessage(
      `Barretta: ${l("init.coreFolderMissing", barretta_core)}`,
    );
    console.log(`Barretta: [barretta-core] folder does not exist.`);
    return false;
  }

  // [excel_file] フォルダ存在確認
  // Check if [excel_file] folder exists
  const excelFolderPath: string = path.join(rootPath, "excel_file");
  if (!fs.existsSync(excelFolderPath)) {
    vscode.window.showErrorMessage(`Barretta: ${l("init.excelFolderMissing", excelFolderPath)}`);
    console.log(`Barretta: [excel_file] folder does not exist.`);
    return false;
  }

  // 単一Excelファイル存在確認
  // Check for single Excel file existence
  const fileList = fs.readdirSync(excelFolderPath);
  const excelFileList = fileList.filter((fileName) => fileName.match(/^(?!~\$).*\.(xls$|xlsx$|xlsm$|xlsb$|xlam$)/g));

  if (excelFileList.length === 0) {
    vscode.window.showErrorMessage(`Barretta: ${l("init.noExcelFile")}`);
    console.log(`Barretta: Excel file does not exist.`);
    return false;
  } else if (excelFileList.length > 1) {
    vscode.window.showErrorMessage(`Barretta: ${l("init.multipleExcelFiles")}`);
    console.log(`Barretta: Multiple Excel files exist.`);
    return false;
  }

  // [code_modules] フォルダ存在確認
  // Check if [code_modules] folder exists
  const codeModulesPath = path.join(rootPath, "code_modules");
  if (!fs.existsSync(codeModulesPath)) {
    vscode.window.showErrorMessage(`Barretta: ${l("init.codeModulesMissing", codeModulesPath)}`);
    console.log(`Barretta: [code_modules] folder does not exist.`);
    return false;
  }

  // [scripts] フォルダ存在確認
  // Check if [scripts] folder exists
  const scriptsPath = path.join(rootPath, "barretta-core/scripts");
  if (!fs.existsSync(scriptsPath)) {
    vscode.window.showErrorMessage(`Barretta: ${l("init.scriptsFolderMissing", scriptsPath)}`);
    console.log(`Barretta: [scripts] folder does not exist.`);
    return false;
  }

  console.log(`Barretta: Complete preCheckCallMacro.`);
  return true;
};

