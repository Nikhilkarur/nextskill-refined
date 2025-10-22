@echo off
setlocal
set PORT=8080

echo [Reset] Ensuring backend on port %PORT% is stopped...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr LISTENING ^| findstr :%PORT%') do (
  echo [Reset] Killing PID %%a on port %PORT%...
  taskkill /F /PID %%a >nul 2>&1
)

set DB_DIR=%~dp0backend\data
echo [Reset] Deleting H2 database files at "%DB_DIR%" ...
if exist "%DB_DIR%" (
  rmdir /S /Q "%DB_DIR%"
  echo [Reset] Removed "%DB_DIR%".
) else (
  echo [Reset] No database directory found; nothing to remove.
)

echo [Reset] Done.
endlocal
