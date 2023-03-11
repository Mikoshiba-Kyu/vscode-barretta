# This is a PowerShell script template.
# It contains two placeholders for runtime arguments.
# {{argument1}}
# {{argument2}}
# {{argument3}}
param(
  [string] $rootPath = "{{argument1}}",
  [string] $fileName = "{{argument2}}",
  [boolean] $pullIgnoreDocument = [boolean]"{{argument3}}"
)
Write-Output "[barretta] Start processing : pull_modules.ps1"

[String]$excelPath = "$rootPath/excel_file/$fileName"
Write-Output "[barretta] Excel FilePath : $excelPath"

try {
  $excel = [System.Runtime.InteropServices.Marshal]::GetActiveObject("Excel.Application")
}
catch {
  Write-Output "[barretta] Excel application is not running."
}

try {
  [System.Boolean]$endClose = $False
  
  if ($null -eq $excel) {
    $endClose = $True
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $False
    $book = $excel.Workbooks.Open($excelPath)
    Write-Output "[barretta] Launch a new Excel application. : Invisible Mode"

  }
  else {
    Write-Output "[barretta] Use the activated Excel application. : Visible Mode"

    foreach ($bookItem in $excel.Workbooks) {
      if ($bookItem.Name -eq "$fileName") {
        $book = $bookItem
        Write-Output "[barretta] '$fileName' detected in launched Excel application."
      }
    }
    
    if ($null -eq $book) {
      $excel = New-Object -ComObject Excel.Application
      $excel.Visible = $True
      $book = $excel.Workbooks.Open($excelPath)
      Write-Output "[barretta] New '$fileName' book opened in actevated Excel application."
    }
  }
  
  foreach ($module in $book.VBProject.VBComponents) {

    $moduleName = $module.Name
    switch ($module.Type) {
      1 {
        $fileExtension = ".bas"
        $outPath = "$rootPath/code_modules/" + $moduleName + $fileExtension
        $module.Export($outPath)
        Write-Output "[barretta] Output : $outPath"
      }
      2 {
        $fileExtension = ".cls"
        $outPath = "$rootPath/code_modules/" + $moduleName + $fileExtension
        $module.Export($outPath)
        Write-Output "[barretta] Output : $outPath"
      }
      3 {
        $fileExtension = ".frm"
        $outPath = "$rootPath/code_modules/" + $moduleName + $fileExtension
        $module.Export($outPath)
        Write-Output "[barretta] Output : $outPath"
      }
      11 {
        $fileExtension = ".unknown"
        $outPath = "$rootPath/code_modules/" + $moduleName + $fileExtension
        $module.Export($outPath)
        Write-Output "[barretta] Output : $outPath"
      }
      100 {
        if (!$pullIgnoreDocument) {
          $fileExtension = ".cls"
          $outPath = "$rootPath/code_modules/" + $moduleName + $fileExtension
          $module.Export($outPath)
          Write-Output "[barretta] Output : $outPath"
        }
      }
    }
  }

}
catch {
  Write-Error "[barretta] An error has occurred. : $err"

}
finally {
  if ($endClose) {
    $excel.Quit()
    Write-Output "[barretta] Quit Excel"
  }

  [System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($excel)>$null #

  $module = $null
  $book = $null
  $excel = $null
  [System.GC]::Collect()
  Write-Output "[barretta] Garbage collection was executed."

  Write-Output "[barretta] Finish processing : pull_modules.ps1"
}
