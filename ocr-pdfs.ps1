Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Storage.StorageFile,Windows.Storage,ContentType=WindowsRuntime]
$null = [Windows.Graphics.Imaging.BitmapDecoder,Windows.Graphics.Imaging,ContentType=WindowsRuntime]
$null = [Windows.Media.Ocr.OcrEngine,Windows.Foundation,ContentType=WindowsRuntime]
$asyncMethod = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.IsGenericMethod } | Select-Object -First 1
function Await-Result($operation, $type) { $task = $asyncMethod.MakeGenericMethod($type).Invoke($null,@($operation)); $task.Wait(); return $task.Result }
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
$root = 'D:\web_skina\content\pdf'
foreach ($n in 1..9) {
  $key = '{0:00}' -f $n
  $prefix = Join-Path $root "$key-page"
  & 'C:\Users\Admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe' -scale-to 1800 -png "C:\Users\Admin\Downloads\$key.pdf" $prefix
  $allText = @()
  foreach ($png in (Get-ChildItem "$prefix-*.png" | Sort-Object Name)) {
    $file = Await-Result ([Windows.Storage.StorageFile]::GetFileFromPathAsync($png.FullName)) ([Windows.Storage.StorageFile])
    $stream = Await-Result ($file.OpenReadAsync()) ([Windows.Storage.Streams.IRandomAccessStreamWithContentType])
    $decoder = Await-Result ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
    $bitmap = Await-Result ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
    $result = Await-Result ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
    $allText += "`n--- $($png.Name) ---`n" + (($result.Lines | ForEach-Object {$_.Text}) -join "`n")
    $bitmap.Dispose(); $stream.Dispose()
  }
  $allText -join "`n" | Set-Content -Encoding UTF8 (Join-Path $root "$key-ocr.txt")
  Write-Output "OCR complete: $key"
}
