# Retrieves the user's actual public portfolio photo and PrivacyGuard screenshot.
# Run in PowerShell in this folder; does not modify the old GitHub repository.
$ErrorActionPreference = 'Stop'
$folder = Join-Path $PSScriptRoot 'assets'
New-Item -ItemType Directory -Force -Path $folder | Out-Null
$root = 'https://raw.githubusercontent.com/ahmethaithem/Portfolio-main/master/src/assets'
Invoke-WebRequest -Uri "$root/me%20-%20Edited.png" -OutFile (Join-Path $folder 'portrait.png')
Invoke-WebRequest -Uri "$root/projects/privacyguard-dashboard.png" -OutFile (Join-Path $folder 'privacyguard-dashboard.png')
Write-Host 'Original images downloaded. Open index.html to preview.' -ForegroundColor Green
