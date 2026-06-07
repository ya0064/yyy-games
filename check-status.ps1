$ErrorActionPreference = "SilentlyContinue"
$log1 = "F:\u-claw\u-claw\u-claw\portable\data\.openclaw\workspace\games-site\worker1.log"
$log2 = "F:\u-claw\u-claw\u-claw\portable\data\.openclaw\workspace\games-site\worker2.log"
$log3 = "F:\u-claw\u-claw\u-claw\portable\data\.openclaw\workspace\games-site\worker3.log"
$log4 = "F:\u-claw\u-claw\u-claw\portable\data\.openclaw\workspace\games-site\worker4.log"
$pg = "F:\u-claw\u-claw\u-claw\portable\data\.openclaw\workspace\games-site\_posts\progress.json"
$posts = "F:\u-claw\u-claw\u-claw\portable\data\.openclaw\workspace\games-site\_posts"

Write-Host "=== WORKER 1 LOG ==="
if (Test-Path $log1) { Get-Content $log1 | Select-Object -Last 5 }
Write-Host "=== WORKER 2 LOG ==="
if (Test-Path $log2) { Get-Content $log2 | Select-Object -Last 5 }
Write-Host "=== WORKER 3 LOG ==="
if (Test-Path $log3) { Get-Content $log3 | Select-Object -Last 5 }
Write-Host "=== WORKER 4 LOG ==="
if (Test-Path $log4) { Get-Content $log4 | Select-Object -Last 5 }
Write-Host "=== PROGRESS ==="
if (Test-Path $pg) { Get-Content $pg }
Write-Host "=== FILES COUNT ==="
$count = (Get-ChildItem $posts -Filter "*.md" | Measure-Object).Count
Write-Host "Markdown files: $count"
Write-Host "=== PROCESSES ==="
Get-Process node -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, StartTime | Format-Table