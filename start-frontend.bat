@echo off
setlocal
set PORT=5500

echo [Frontend] Ensuring port %PORT% is free...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr LISTENING ^| findstr :%PORT%') do (
  echo [Frontend] Killing PID %%a on port %PORT%...
  taskkill /F /PID %%a >nul 2>&1
)

pushd "%~dp0"
echo [Frontend] Starting static server on http://127.0.0.1:%PORT% ...
npx http-server -a 127.0.0.1 -p %PORT% .
echo.
echo [Hint] Open: http://127.0.0.1:%PORT%/frontend/index.html
popd
endlocal
