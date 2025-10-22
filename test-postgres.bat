@echo off
setlocal

set POSTGRES_PASSWORD=%1
if "%POSTGRES_PASSWORD%"=="" (
    echo Usage: test-postgres.bat your-postgres-password
    echo Example: test-postgres.bat MyPassword123
    exit /b 1
)

echo [Test] Testing PostgreSQL connection with password...
set SPRING_PROFILES_ACTIVE=postgres

echo [Test] Building backend...
pushd backend
call mvnw.cmd -q -DskipTests package
if errorlevel 1 (
    echo [Test] Build failed!
    popd
    exit /b 1
)

echo [Test] Starting backend with PostgreSQL...
start "Backend-PostgreSQL" cmd /c "set POSTGRES_PASSWORD=%POSTGRES_PASSWORD% && set SPRING_PROFILES_ACTIVE=postgres && java -jar target/backend-0.0.1-SNAPSHOT.jar"
popd

echo [Test] Waiting for backend health...
powershell -NoProfile -Command "$deadline=(Get-Date).AddSeconds(30); while((Get-Date) -lt $deadline){ try { $r=Invoke-RestMethod -UseBasicParsing 'http://127.0.0.1:8080/actuator/health' -TimeoutSec 2; if($r.status -eq 'UP'){ Write-Host '[Test] Backend UP with PostgreSQL!'; exit 0 } } catch {}; Start-Sleep -Milliseconds 500 }; Write-Host '[Test] Backend health TIMEOUT'; exit 1"

if errorlevel 1 (
    echo [Test] Failed to start with PostgreSQL
    exit /b 1
)

echo [Test] SUCCESS! Backend is running with PostgreSQL
echo [Test] You can now test at http://127.0.0.1:8080
echo [Test] To stop, close the Backend-PostgreSQL window

endlocal