# ARQIA Revit Add-in Auto-Installer
# Run as Administrator or standard user (installs to user profile)

param(
    [string]$RevitVersion = "2026",
    [switch]$Uninstall,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

# Configuration
$AddinName = "ARQIARevitAddin"
$AddinFiles = @(
    "ARQIARevitAddin.dll",
    "ARQIARevitAddin.addin",
    "Newtonsoft.Json.dll"
)

# Paths
$SourceDir = $PSScriptRoot
$AppDataPath = $env:LOCALAPPDATA
if (-not $AppDataPath) {
    $AppDataPath = $env:APPDATA
}

$RevitAddinsPath = Join-Path $AppDataPath "Autodesk\Revit\Addins\$RevitVersion"
$AddinFile = Join-Path $RevitAddinsPath "ARQIARevitAddin.addin"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "ARQIA Revit Add-in Installer" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

function Test-Admin {
    $currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    return $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Install-Addin {
    Write-Host "Installing ARQIA Revit Add-in for Revit $RevitVersion..." -ForegroundColor Yellow
    Write-Host ""
    
    # Check if Revit version is installed
    $RevitExePath = "C:\Program Files\Autodesk\Revit $RevitVersion\Revit.exe"
    if (-not (Test-Path $RevitExePath)) {
        Write-Warning "Revit $RevitVersion not found at expected location: $RevitExePath"
        Write-Host "Continuing anyway (you may need to specify correct version)..." -ForegroundColor Yellow
        Write-Host ""
    }
    
    # Verify source files exist
    $missingFiles = @()
    foreach ($file in $AddinFiles) {
        $sourceFile = Join-Path $SourceDir $file
        if (-not (Test-Path $sourceFile)) {
            $missingFiles += $file
        }
    }
    
    if ($missingFiles.Count -gt 0) {
        Write-Error "Missing required files: $($missingFiles -join ', ')"
        Write-Host "Make sure all files are in the same directory as this script." -ForegroundColor Red
        exit 1
    }
    
    # Check if already installed
    if (Test-Path $AddinFile) {
        if (-not $Force) {
            Write-Host "Add-in already installed." -ForegroundColor Yellow
            Write-Host "Use -Force to overwrite, or -Uninstall to remove first." -ForegroundColor Yellow
            Write-Host ""
            
            $response = Read-Host "Overwrite existing installation? (y/N)"
            if ($response -ne 'y' -and $response -ne 'Y') {
                Write-Host "Installation cancelled." -ForegroundColor Red
                exit 0
            }
        }
        
        # Backup existing
        $backupDir = Join-Path $RevitAddinsPath "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        Write-Host "Backing up existing installation to: $backupDir" -ForegroundColor Cyan
        New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
        
        foreach ($file in $AddinFiles) {
            $existingFile = Join-Path $RevitAddinsPath $file
            if (Test-Path $existingFile) {
                Copy-Item $existingFile $backupDir -Force
            }
        }
    }
    
    # Create destination directory
    Write-Host "Creating directory: $RevitAddinsPath" -ForegroundColor Gray
    New-Item -ItemType Directory -Force -Path $RevitAddinsPath | Out-Null
    
    # Copy files
    Write-Host "Copying files..." -ForegroundColor Gray
    foreach ($file in $AddinFiles) {
        $sourceFile = Join-Path $SourceDir $file
        $destFile = Join-Path $RevitAddinsPath $file
        
        Write-Host "  Copying $file" -ForegroundColor Gray
        Copy-Item $sourceFile $destFile -Force
    }
    
    # Verify installation
    Write-Host ""
    Write-Host "Verifying installation..." -ForegroundColor Yellow
    $installedFiles = @()
    foreach ($file in $AddinFiles) {
        $installedFile = Join-Path $RevitAddinsPath $file
        if (Test-Path $installedFile) {
            $installedFiles += $file
            Write-Host "  ✓ $file" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $file (MISSING)" -ForegroundColor Red
        }
    }
    
    if ($installedFiles.Count -eq $AddinFiles.Count) {
        Write-Host ""
        Write-Host "==========================================" -ForegroundColor Green
        Write-Host "Installation successful!" -ForegroundColor Green
        Write-Host "==========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "  1. Close all running Revit instances"
        Write-Host "  2. Start Revit $RevitVersion"
        Write-Host "  3. Look for 'ARQIA' tab in the ribbon"
        Write-Host ""
        Write-Host "Installed to: $RevitAddinsPath" -ForegroundColor Gray
        Write-Host ""
        
        # Show backend status reminder
        Write-Host "IMPORTANT: Ensure backend is running:" -ForegroundColor Yellow
        Write-Host "  http://localhost:3000 (or your server)" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Error "Installation verification failed. Some files are missing."
        exit 1
    }
}

function Uninstall-Addin {
    Write-Host "Uninstalling ARQIA Revit Add-in from Revit $RevitVersion..." -ForegroundColor Yellow
    Write-Host ""
    
    if (-not (Test-Path $RevitAddinsPath)) {
        Write-Host "Add-in directory not found. Nothing to uninstall." -ForegroundColor Yellow
        exit 0
    }
    
    $removedFiles = @()
    foreach ($file in $AddinFiles) {
        $installedFile = Join-Path $RevitAddinsPath $file
        if (Test-Path $installedFile) {
            Remove-Item $installedFile -Force
            $removedFiles += $file
            Write-Host "  ✓ Removed $file" -ForegroundColor Green
        }
    }
    
    if ($removedFiles.Count -gt 0) {
        Write-Host ""
        Write-Host "==========================================" -ForegroundColor Green
        Write-Host "Uninstallation successful!" -ForegroundColor Green
        Write-Host "==========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Restart Revit for changes to take effect." -ForegroundColor Yellow
    } else {
        Write-Host "No ARQIA files found to uninstall." -ForegroundColor Yellow
    }
}

# Main execution
if ($Uninstall) {
    Uninstall-Addin
} else {
    Install-Addin
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
