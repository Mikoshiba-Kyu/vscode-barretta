# This is a PowerShell script template.
# It contains two placeholders for runtime arguments.
# {{argument1}}
# {{argument2}}
param(
  [string] $rootPath = "{{argument1}}",
  [string] $fileName = "{{argument2}}"
)
Write-Output "[barretta] Start processing : open_excelbook.ps1"

[String]$excelPath = "$rootPath/excel_file/$fileName"
Write-Output "[barretta] Excel FilePath : $excelPath"

try
{
  $excel = [System.Runtime.InteropServices.Marshal]::GetActiveObject("Excel.Application")
} catch
{
  Write-Output "[barretta] Excel application is not running."
}

try
{
  if ($null -eq $excel)
  {
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $True
    $book = $excel.Workbooks.Open($excelPath)
    Write-Output "[barretta] Launch a new Excel application. : Visible Mode"

  } else
  {
    Write-Output "[barretta] Use the activated Excel application. : Visible Mode"

    foreach ($bookItem in $excel.Workbooks)
    {
      if ($bookItem.Name -eq "$fileName")
      {
        $book = $bookItem
        Write-Output "[barretta] '$fileName' detected in launched Excel application."
      }
    }
    
    if ($null -eq $book)
    {
      $excel = New-Object -ComObject Excel.Application
      $excel.Visible = $True
      $book = $excel.Workbooks.Open($excelPath)
      Write-Output "[barretta] New '$fileName' book opened in actevated Excel application."
    }
  }
} catch
{
  Write-Error "[barretta] An error has occurred. : $err"

} finally
{
  [System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($excel)>$null #

  $book = $null
  $excel = $null
  [System.GC]::Collect()
  Write-Output "[barretta] Garbage collection was executed."

  Write-Output "[barretta] Finish processing : open_excelbook.ps1"
}
