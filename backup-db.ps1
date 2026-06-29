$date = Get-Date -Format "yyyy-MM-dd_HHmm"
$outDir = "C:\Users\User\OneDrive\KRS_Backups"
$outFile = "$outDir\KRS_$date.sql"

if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

# Wait for Docker + mariadb container to be ready (max 3 min)
$maxWait = 180
$waited = 0
while ($waited -lt $maxWait) {
    $status = docker inspect --format "{{.State.Health.Status}}" mariadb_local 2>$null
    if ($status -eq "healthy") { break }
    Start-Sleep -Seconds 10
    $waited += 10
}

if ($waited -ge $maxWait) {
    Write-Error "mariadb_local not healthy after $maxWait seconds. Aborting backup."
    exit 1
}

docker exec mariadb_local mariadb-dump -uroot -proot KRS | Out-File -FilePath $outFile -Encoding utf8 -Force

# Keep latest 3 dumps only
Get-ChildItem "$outDir\KRS_*.sql" | Sort-Object LastWriteTime -Descending | Select-Object -Skip 3 | Remove-Item -Force -ErrorAction SilentlyContinue
