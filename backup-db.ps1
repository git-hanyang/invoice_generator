
$ErrorActionPreference = "Stop"

# ============================================================
# KRS DATABASE BACKUP
# ============================================================

# Correct project directory
Set-Location "C:\Repository\KRS_Accounting"

# Backup destination
$outDir = "C:\Users\User\OneDrive\KRS_Backups"

# Log file
$logFile = "C:\Repository\KRS_Accounting\backup-db.log"

Start-Transcript -Path $logFile -Append

try {

    Write-Host ""
    Write-Host "============================================================"
    Write-Host "KRS DATABASE BACKUP START"
    Write-Host "============================================================"
    Write-Host "Date/Time : $(Get-Date)"
    Write-Host "User      : $env:USERNAME"
    Write-Host "Computer  : $env:COMPUTERNAME"
    Write-Host "Directory : $(Get-Location)"
    Write-Host ""

    # --------------------------------------------------------
    # Create backup directory
    # --------------------------------------------------------

    if (-not (Test-Path $outDir)) {
        Write-Host "Creating backup directory..."
        New-Item -ItemType Directory -Path $outDir -Force | Out-Null
    }

    # --------------------------------------------------------
    # Check Docker
    # --------------------------------------------------------

    Write-Host "Checking Docker..."

    $dockerCommand = Get-Command docker -ErrorAction SilentlyContinue

    if (-not $dockerCommand) {
        throw "Docker command was not found."
    }

    Write-Host "Docker found: $($dockerCommand.Source)"

    # --------------------------------------------------------
    # Wait for MariaDB
    # --------------------------------------------------------

    Write-Host ""
    Write-Host "Waiting for MariaDB container..."

    $maxWait = 180
    $waited = 0
    $healthy = $false

    while ($waited -lt $maxWait) {

        $status = docker inspect --format "{{.State.Health.Status}}" mariadb_local 2>$null

        Write-Host "MariaDB status: $status"

        if ($status -eq "healthy") {
            $healthy = $true
            break
        }

        Start-Sleep -Seconds 10
        $waited += 10
    }

    if (-not $healthy) {
        throw "mariadb_local was not healthy after $maxWait seconds."
    }

    Write-Host "MariaDB is healthy."

    # --------------------------------------------------------
    # Create backup filename
    # --------------------------------------------------------

    $date = Get-Date -Format "yyyy-MM-dd_HHmm"
    $outFile = Join-Path $outDir "KRS_$date.sql"

    Write-Host ""
    Write-Host "Creating database backup..."
    Write-Host "Output: $outFile"

    # --------------------------------------------------------
    # Dump MariaDB
    # --------------------------------------------------------

    docker exec mariadb_local mariadb-dump -uroot -proot KRS |
        Out-File -FilePath $outFile -Encoding utf8 -Force

    if ($LASTEXITCODE -ne 0) {
        throw "mariadb-dump failed. Exit code: $LASTEXITCODE"
    }

    # --------------------------------------------------------
    # Verify backup
    # --------------------------------------------------------

    if (-not (Test-Path $outFile)) {
        throw "Backup file was not created."
    }

    $backupFile = Get-Item $outFile

    if ($backupFile.Length -eq 0) {
        throw "Backup file was created but is empty."
    }

    Write-Host ""
    Write-Host "BACKUP SUCCESSFUL"
    Write-Host "File : $($backupFile.FullName)"
    Write-Host "Size : $($backupFile.Length) bytes"

    # --------------------------------------------------------
    # Keep latest 3 backups
    # --------------------------------------------------------

    Write-Host ""
    Write-Host "Cleaning old backups..."

    $backups = Get-ChildItem -Path $outDir -Filter "KRS_*.sql" |
        Sort-Object LastWriteTime -Descending

    if ($backups.Count -gt 3) {

        $oldBackups = $backups | Select-Object -Skip 3

        foreach ($oldBackup in $oldBackups) {
            Write-Host "Deleting old backup: $($oldBackup.Name)"
            Remove-Item -Path $oldBackup.FullName -Force
        }
    }

    Write-Host ""
    Write-Host "============================================================"
    Write-Host "KRS DATABASE BACKUP COMPLETED SUCCESSFULLY"
    Write-Host "Finished: $(Get-Date)"
    Write-Host "============================================================"
    Write-Host ""

    exit 0
}
catch {

    Write-Host ""
    Write-Host "============================================================"
    Write-Host "KRS DATABASE BACKUP FAILED"
    Write-Host "============================================================"
    Write-Host "Date/Time: $(Get-Date)"
    Write-Host "Error:"
    Write-Host $_
    Write-Host "============================================================"
    Write-Host ""

    exit 1
}
finally {

    Stop-Transcript
}
```
