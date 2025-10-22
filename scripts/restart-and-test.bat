@echo off
setlocal ENABLEDELAYEDEXPANSION

set FRONTEND_PORT=5500
set BACKEND_PORT=8080

echo [Test] Freeing ports %BACKEND_PORT% and %FRONTEND_PORT%...
for %%P in (%FRONTEND_PORT% %BACKEND_PORT%) do (
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr LISTENING ^| findstr :%%P') do (
    echo [Test] Killing PID %%a on port %%P...
    taskkill /F /PID %%a >nul 2>&1
  )
)

rem Start backend in a separate window
set BACKEND_DIR=%~dp0..\backend
pushd "%BACKEND_DIR%" >nul
  echo [Test] Starting backend on port %BACKEND_PORT%...
  start "backend" cmd /c "mvnw.cmd -DskipTests spring-boot:run"
popd >nul

rem Wait for backend health to report UP
powershell -NoProfile -Command "Write-Host '[Test] Waiting for backend health...'; $deadline=(Get-Date).AddSeconds(40); while((Get-Date) -lt $deadline){ try { $r=Invoke-RestMethod -UseBasicParsing 'http://127.0.0.1:8080/actuator/health' -TimeoutSec 2; if($r.status -eq 'UP'){ Write-Host '[Test] Backend HEALTH UP'; exit 0 } } catch {}; Start-Sleep -Milliseconds 500 }; Write-Host '[Test] Backend health TIMEOUT'; exit 1"
if errorlevel 1 (
  echo [Test] Backend failed to start in time.
  exit /b 1
)

rem Start frontend in a separate window
set ROOT_DIR=%~dp0..
pushd "%ROOT_DIR%" >nul
  echo [Test] Starting frontend static server on http://127.0.0.1:%FRONTEND_PORT% ...
  start "frontend" cmd /c "npx http-server -a 127.0.0.1 -p %FRONTEND_PORT% ."
popd >nul

rem Wait for frontend index to be reachable
powershell -NoProfile -Command "Write-Host '[Test] Waiting for frontend...'; $deadline=(Get-Date).AddSeconds(15); while((Get-Date) -lt $deadline){ try { $r=Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:5500/frontend/index.html' -TimeoutSec 2; if($r.StatusCode -eq 200){ Write-Host '[Test] Frontend UP'; exit 0 } } catch {}; Start-Sleep -Milliseconds 500 }; Write-Host '[Test] Frontend TIMEOUT'; exit 1"
if errorlevel 1 (
  echo [Test] Frontend failed to start in time.
  exit /b 1
)

rem Run a quick CORS preflight check
call "%~dp0cors-check.bat"
if errorlevel 1 (
  echo [Test] CORS check failed. See output above.
  exit /b 1
)

echo.
echo [Ready] Backend:  http://127.0.0.1:%BACKEND_PORT%
echo [Ready] Frontend: http://127.0.0.1:%FRONTEND_PORT%/frontend/index.html

echo [Done] Two windows were opened for backend and frontend. You can close this window.
endlocal
