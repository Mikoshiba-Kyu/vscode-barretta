// https://webpack.js.org/guides/asset-modules/#source-assets
import open_excelbook from "../assets/pwsh/open_excelbook.ps1";
import push_to_excelbook from "../assets/pwsh/push_to_excelbook.ps1";
import pull_from_excelbook from "../assets/pwsh/pull_from_excelbook.ps1";
import run_macro from "../assets/pwsh/run_macro.ps1";

export default {
  openExcelbook: `${open_excelbook}`,
  pushToExcelbook: `${push_to_excelbook}`,
  pullFromExcelbook: `${pull_from_excelbook}`,
  runMacro: `${run_macro}`,
};
