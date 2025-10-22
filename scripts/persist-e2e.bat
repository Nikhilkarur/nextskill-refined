@echo off
setlocal ENABLEDELAYEDEXPANSION

REM Change to repo root (scripts directory is one level below)
cd /d "%~dp0.."

echo [Persist] Step 1/3: Sign up a new test user...
node .\scripts\persist-check.mjs signup || goto :fail

echo [Persist] Step 2/3: Restart backend and wait for health...
powershell -NoProfile -Command "Set-Location '%CD%'; Start-Process -FilePath cmd.exe -ArgumentList '/c start-backend.bat' -WindowStyle Minimized; $deadline=(Get-Date).AddSeconds(45); $ok=$false; while((Get-Date) -lt $deadline){ try { $r=Invoke-RestMethod -Uri 'http://127.0.0.1:8080/actuator/health' -TimeoutSec 2; if($r.status -eq 'UP'){ $ok=$true; break } } catch {}; Start-Sleep -Milliseconds 700 }; if($ok){ Write-Output 'HEALTH_UP' } else { Write-Output 'HEALTH_TIMEOUT'; exit 1 }" || goto :fail

echo [Persist] Step 3/3: Sign in with saved creds after restart...
node .\scripts\persist-check.mjs signin || goto :fail

echo [Persist] PASS - DB remembered the account across restart
exit /b 0

:fail
echo [Persist] FAIL - See messages above
exit /b 1

endlocal
