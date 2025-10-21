@echo off
setlocal ENABLEDELAYEDEXPANSION

set FRONTEND_PORT=5500
set BACKEND_PORT=8080

echo [Setup] Freeing common ports...
for %%P in (%FRONTEND_PORT% %BACKEND_PORT%) do (
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr LISTENING ^| findstr :%%P') do (
    echo [Setup] Killing PID %%a on port %%P...
    taskkill /F /PID %%a >nul 2>&1
  )
)

echo [Start] Launching backend...
start "backend" cmd /c "cd /d "%~dp0backend" && mvnw.cmd -DskipTests spring-boot:run"

echo [Start] Launching frontend...
start "frontend" cmd /c "cd /d "%~dp0" && npx http-server -a 127.0.0.1 -p %FRONTEND_PORT% ."

echo.
echo [Info] Backend:  http://127.0.0.1:%BACKEND_PORT%
echo [Info] Frontend: http://127.0.0.1:%FRONTEND_PORT%/frontend/index.html

echo [Done] Two new windows were opened. Press any key to exit this launcher.
pause >nul
endlocal
