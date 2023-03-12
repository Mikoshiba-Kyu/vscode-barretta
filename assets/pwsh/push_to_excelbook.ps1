# This is a PowerShell script template.
# It contains two placeholders for runtime arguments.
# {{argument1}}
# {{argument2}}
# {{argument3}}
param(
  [string] $rootPath = "{{argument1}}",
  [string] $fileName = "{{argument2}}",
  [boolean] $pushIgnoreDocument = [boolean]"{{argument3}}"
)
Write-Output "[barretta] Start processing : push_modules.ps1"

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

  $distPath = "$rootPath/barretta-core/dist"
  Write-Output "[barretta] The target 'dist' path was set like this. : $distPath"

  $moduleFiles = Get-ChildItem $distPath -File | Where-Object { $_.Name -match '.bas$|.cls$|.frm$' }

  Foreach ($moduleFile in $moduleFiles) {
    Write-Output "[barretta] Start file processing. : $moduleFile"
    $moduleName = $moduleFile.BaseName

    # 同名のモジュールが存在するか判定する
    $existModule = $False
    Foreach ($module in $book.VBProject.VBComponents) {
      if ($module.Name -eq $moduleName) {
        $existModule = $True
      }
    }

    # 標準モジュール = 1, クラスモジュール = 2, ユーザーフォームモジュール = 3, シートブックモジュール = 100 
    if ($existModule) {
      Write-Output "[barretta] '$moduleFile' exists in the Excel file and should be replaced."

      $module = $book.VBProject.VBComponents.Item($moduleName)
      switch ($module.Type) {
        1 {
          # 同名のモジュールを削除する
          $trgModule = $book.VBProject.VBComponents.Item($moduleName)
          $book.VBProject.VBComponents.Remove($trgModule)
          Write-Output "[barretta] Module Remove : $moduleName"

          # モジュールをインポートする
          Start-Sleep -s 1
          $book.VBProject.VBComponents.Import($moduleFile.FullName)
          Write-Output "[barretta] Module Import : $moduleName"
        }

        2 {
          # 同名のモジュールを削除する
          $trgModule = $book.VBProject.VBComponents.Item($moduleName)
          $book.VBProject.VBComponents.Remove($trgModule)
          Write-Output "[barretta] Module Remove : $moduleName"

          # モジュールをインポートする
          Start-Sleep -s 1
          $book.VBProject.VBComponents.Import($moduleFile.FullName)
          Write-Output "[barretta] Module Import : $moduleName"
        }

        3 {
          # 同名のモジュールを削除する
          $trgModule = $book.VBProject.VBComponents.Item($moduleName)
          $book.VBProject.VBComponents.Remove($trgModule)
          Write-Output "[barretta] Module Remove : $moduleName"

          # モジュールをインポートする
          Start-Sleep -s 1
          $book.VBProject.VBComponents.Import($moduleFile.FullName)
          Write-Output "[barretta] Module Import : $moduleName"
        }

        11 {
          Write-Output "[barretta] FileType : ActiveX" 
        }

        100 { 
          if (!$pushIgnoreDocument) {
            Write-Output "[barretta] FileType : Document"
          }
        }
      }

    }
    else {
      Write-Output "[barretta] '$moduleFile' does not exist in the Excel file, so it is newly added."
      $book.VBProject.VBComponents.Import($moduleFile.FullName)

    }
    $existModule = $False
  }
  
}
catch {
  Write-Error "[barretta] An error has occurred. : $err"

}
finally {
  if ($endClose) {
    $book.Save()
    Write-Output "[barretta] Book overwrote. : $fileName"
    $book.Close()
    Write-Output "[barretta] Book closed. : $fileName"
    $excel.Quit()
    Write-Output "[barretta] Excel application terminated."
  }
  else {
    $book.Save()
    Write-Output "[barretta] Book overwrote. : $fileName"
  }

  [System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($excel)>$null #

  $module = $null
  $book = $null
  $excel = $null
  [System.GC]::Collect()
  Write-Output "[barretta] Garbage collection was executed."

  Write-Output "[barretta] Finish processing : push_modules.ps1"
}

