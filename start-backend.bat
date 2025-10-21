@echo off
setlocal ENABLEDELAYEDEXPANSION
set PORT=8080

echo [Backend] Ensuring port %PORT% is free...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr LISTENING ^| findstr :%PORT%') do (
	echo [Backend] Killing PID %%a on port %PORT%...
	taskkill /F /PID %%a >nul 2>&1
)

pushd "%~dp0backend"
echo [Backend] Starting Spring Boot on port %PORT%...
call mvnw.cmd -DskipTests spring-boot:run
popd
endlocal
