@echo off
setlocal

set BASE=http://127.0.0.1:8080

rem Check backend health using PowerShell only (avoid batch parsing pitfalls)
powershell -NoProfile -Command "try { $h=Invoke-RestMethod -UseBasicParsing '%BASE%/actuator/health'; if($h.status -ne 'UP'){ throw 'DOWN' }; Write-Host '[CORS] Backend is UP.' } catch { Write-Host '[CORS] Backend health check FAILED or backend is down.'; Write-Host '       Visit %BASE%/actuator/health and ensure it returns {"status":"UP"}.'; exit 1 }"
if errorlevel 1 goto :eof

rem Send a preflight (OPTIONS) request to a typical endpoint
powershell -NoProfile -Command "try { $r=Invoke-WebRequest -UseBasicParsing -Method Options -Headers @{Origin='http://127.0.0.1:5500';'Access-Control-Request-Method'='POST'} '%BASE%/api/auth/signin'; if($r.StatusCode -eq 200){ Write-Host '[CORS] Preflight OK (200). CORS headers should be present.' } else { throw 'BadStatus' } } catch { Write-Host '[CORS] Preflight check FAILED (expected 200).'; Write-Host '       Ensure Spring Security has http.cors() enabled and OPTIONS /** permitted.'; Write-Host '       Verify allowed origins include http://127.0.0.1:5500.'; exit 1 }"
if errorlevel 1 goto :eof

echo [Hint] Now use a normal browser at http://127.0.0.1:5500/frontend/index.html

endlocal
