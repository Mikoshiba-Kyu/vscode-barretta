type GenerateOpenBookPs1 = {
  (params: Ps1GenerateParams): string
}

type GeneratePushPs1 = {
  (params: Ps1GenerateParams): string
}

type GeneratePullPs1 = {
  (params: Ps1GenerateParams): string
}

type GenerateRunMacroPs1 = {
  (params: Ps1GenerateParams): string
}

type GenerateGitignore = {
  (): string
}

type GenerateWorkspace = {
  (): string
}

type GenerateBarrettaLauncher = {
  (): string
}

type Ps1GenerateParams = {
  rootPath: string,
  fileName: string,
  callMethod?: string,
  methodParams?: (string | number | boolean)[] | undefined,
  pullIgnoreDocument?: boolean,
  pushIgnoreDocument?: boolean
}

export const generateOpenBookPs1: GenerateOpenBookPs1 = (genParams) => {
  return `
Write-Output "[barretta] Start processing : open_excelbook.ps1"

[String]$excelPath = "${genParams.rootPath}/excel_file/${genParams.fileName}"
Write-Output "[barretta] Excel FilePath : $excelPath"

try {
  $excel = [System.Runtime.InteropServices.Marshal]::GetActiveObject("Excel.Application")
} catch {
  Write-Output "[barretta] Excel application is not running."
}

try {
  if ($null -eq $excel) {
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $True
    $book = $excel.Workbooks.Open($excelPath)
    Write-Output "[barretta] Launch a new Excel application. : Visible Mode"

  } else {
    Write-Output "[barretta] Use the activated Excel application. : Visible Mode"

    foreach ($bookItem in $excel.Workbooks) {
      if ($bookItem.Name -eq "${genParams.fileName}") {
        $book = $bookItem
        Write-Output "[barretta] '${genParams.fileName}' detected in launched Excel application."
      }
    }
    
    if ($null -eq $book) {
      $excel = New-Object -ComObject Excel.Application
      $excel.Visible = $True
      $book = $excel.Workbooks.Open($excelPath)
      Write-Output "[barretta] New '${genParams.fileName}' book opened in actevated Excel application."
    }
  }
} catch {
  Write-Error "[barretta] An error has occurred. : $err"

} finally {
  [System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($excel)>$null #

  $book = $null
  $excel = $null
  [System.GC]::Collect()
  Write-Output "[barretta] Garbage collection was executed."

  Write-Output "[barretta] Finish processing : open_excelbook.ps1"
}`
}


export const generatePushPs1: GeneratePushPs1 = (genParams) => {
  return `
Write-Output "[barretta] Start processing : push_modules.ps1"

[String]$excelPath = "${genParams.rootPath}/excel_file/${genParams.fileName}"
Write-Output "[barretta] Excel FilePath : $excelPath"

try {
  $excel = [System.Runtime.InteropServices.Marshal]::GetActiveObject("Excel.Application")
} catch {
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

  } else {
    Write-Output "[barretta] Use the activated Excel application. : Visible Mode"

    foreach ($bookItem in $excel.Workbooks) {
      if ($bookItem.Name -eq "${genParams.fileName}") {
        $book = $bookItem
        Write-Output "[barretta] '${genParams.fileName}' detected in launched Excel application."
      }
    }
    
    if ($null -eq $book) {
      $excel = New-Object -ComObject Excel.Application
      $excel.Visible = $True
      $book = $excel.Workbooks.Open($excelPath)
      Write-Output "[barretta] New '${genParams.fileName}' book opened in actevated Excel application."
    }
  }

  $distPath = "${genParams.rootPath}/barretta-core/dist"
  Write-Output "[barretta] The target 'dist' path was set like this. : $distPath"

  $moduleFiles = Get-ChildItem $distPath -File | Where-Object {$_.Name -match '.bas$|.cls$|.frm$'}

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

        11 {Write-Output "[barretta] FileType : ActiveX"}

        100 {
          if (!$${genParams.pushIgnoreDocument}) {
            Write-Output "[barretta] FileType : Document"
          }
        }
      }

    } else {
      Write-Output "[barretta] '$moduleFile' does not exist in the Excel file, so it is newly added."
      $book.VBProject.VBComponents.Import($moduleFile.FullName)

    }
    $existModule = $False
  }
  
} catch {
  Write-Error "[barretta] An error has occurred. : $err"

} finally {
  if ($endClose) {
    $book.Save()
    Write-Output "[barretta] Book overwrote. : ${genParams.fileName}"
    $book.Close()
    Write-Output "[barretta] Book closed. : ${genParams.fileName}"
    $excel.Quit()
    Write-Output "[barretta] Excel application terminated."
  } else {
    $book.Save()
    Write-Output "[barretta] Book overwrote. : ${genParams.fileName}"
  }

  [System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($excel)>$null #

  $module = $null
  $book = $null
  $excel = $null
  [System.GC]::Collect()
  Write-Output "[barretta] Garbage collection was executed."

  Write-Output "[barretta] Finish processing : push_modules.ps1"
}`
}

export const generatePullPs1: GeneratePullPs1 = (genParams) => {
  return `
Write-Output "[barretta] Start processing : pull_modules.ps1"

[String]$excelPath = "${genParams.rootPath}/excel_file/${genParams.fileName}"
Write-Output "[barretta] Excel FilePath : $excelPath"

try {
  $excel = [System.Runtime.InteropServices.Marshal]::GetActiveObject("Excel.Application")
} catch {
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

  } else {
    Write-Output "[barretta] Use the activated Excel application. : Visible Mode"

    foreach ($bookItem in $excel.Workbooks) {
      if ($bookItem.Name -eq "${genParams.fileName}") {
        $book = $bookItem
        Write-Output "[barretta] '${genParams.fileName}' detected in launched Excel application."
      }
    }
    
    if ($null -eq $book) {
      $excel = New-Object -ComObject Excel.Application
      $excel.Visible = $True
      $book = $excel.Workbooks.Open($excelPath)
      Write-Output "[barretta] New '${genParams.fileName}' book opened in actevated Excel application."
    }
  }
  
  foreach ($module in $book.VBProject.VBComponents) {

    $moduleName = $module.Name
    switch ($module.Type) {
      1 {
        $fileExtension = ".bas"
        $outPath = "${genParams.rootPath}/code_modules/" + $moduleName + $fileExtension
        $module.Export($outPath)
        Write-Output "[barretta] Output : $outPath"
      }
      2 {
        $fileExtension = ".cls"
        $outPath = "${genParams.rootPath}/code_modules/" + $moduleName + $fileExtension
        $module.Export($outPath)
        Write-Output "[barretta] Output : $outPath"
      }
      3 {
        $fileExtension = ".frm"
        $outPath = "${genParams.rootPath}/code_modules/" + $moduleName + $fileExtension
        $module.Export($outPath)
        Write-Output "[barretta] Output : $outPath"
      }
      11 {
        $fileExtension = ".unknown"
        $outPath = "${genParams.rootPath}/code_modules/" + $moduleName + $fileExtension
        $module.Export($outPath)
        Write-Output "[barretta] Output : $outPath"
      }
      100 {
        if (!$${genParams.pullIgnoreDocument}) {
          $fileExtension = ".cls"
          $outPath = "${genParams.rootPath}/code_modules/" + $moduleName + $fileExtension
          $module.Export($outPath)
          Write-Output "[barretta] Output : $outPath"
        }
      }
    }
  }

} catch {
  Write-Error "[barretta] An error has occurred. : $err"

} finally {
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
}`
}

export const generateRunMacroPs1: GenerateRunMacroPs1 = (params) => {

  let paramsText = ''
  if (params.methodParams !== undefined) {
    params.methodParams.forEach(param => {
      if (typeof param === 'string') {
        paramsText = `${paramsText}, "${param}"`
      } else {
        paramsText = `${paramsText}, ${param}`
      }
    })
  }

  return`
Write-Output "[barretta] Start processing : run_macro.ps1"

[String]$excelPath = "${params.rootPath}/excel_file/${params.fileName}"
Write-Output "[barretta] Excel FilePath : $excelPath"
  
try {
  $excel = [System.Runtime.InteropServices.Marshal]::GetActiveObject("Excel.Application")
} catch {
  Write-Output "[barretta] Excel application is not running."
}

try {
  if ($null -eq $excel) {
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $True
    $book = $excel.Workbooks.Open($excelPath)
    Write-Output "[barretta] Launch a new Excel application. : Visible Mode"

  } else {
    Write-Output "[barretta] Use the activated Excel application. : Visible Mode"

    foreach ($bookItem in $excel.Workbooks) {
      if ($bookItem.Name -eq "${params.fileName}") {
        $book = $bookItem
        Write-Output "[barretta] '${params.fileName}' detected in launched Excel application."
      }
    }
    
    if ($null -eq $book) {
      $excel = New-Object -ComObject Excel.Application
      $excel.Visible = $True
      $book = $excel.Workbooks.Open($excelPath)
      Write-Output "[barretta] New '${params.fileName}' book opened in actevated Excel application."
    }
  }
  
  $excel.Run("${params.callMethod}"${paramsText})

} catch {
  Write-Error "[barretta] An error has occurred. : $err"

} finally {
  [System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($excel)>$null #

  $book = $null
  $excel = $null
  [System.GC]::Collect()
  Write-Output "[barretta] Garbage collection was executed."

  Write-Output "[barretta] Finish processing : run_macro.ps1"
}`
}

export const generateGitignore: GenerateGitignore = () => {
  return `excel_file`
}

export const generateWorkspace: GenerateWorkspace = (): string => {
  const jsonData = {
    folders: [
      {
        "path": "."
      }
    ],
    settings: {
      "files.associations": {
        "*.cls": "vb",
        "*.bas": "vb",
        "*.frm": "vb"
      }
    }
  }
  return JSON.stringify(jsonData, null, 2)
}

export const generateBarrettaLauncher: GenerateBarrettaLauncher = (): string => {
  const jsonData = {
    macros: [
        {
          "title": "My 1st Macro.",
          "call": "ThisWorkbook.SampleMacro1",
          "args": [],
          "description": "When calling a function with no arguments, it is important not to specify values in the 'args' array."
        },
        {
          "title": "My 2nd Macro.",
          "call": "ThisWorkbook.SampleMacro2",
          "args": [
                    "Hello",
                    "Barretta",
                    "!!!!!"
                  ],
          "description": "The three strings specified in the argument will be combined and displayed in an Excel message box."
        },
        {
          "title": "My 3rd Macro.",
          "call": "ThisWorkbook.SampleMacro3",
          "args": [
                    2000,
                    222
                  ],
          "description": "The two numbers specified in the argument will be combined and displayed in an Excel message box."
        }
    ]
  }
  return JSON.stringify(jsonData, null, 2)
}