# CORS Troubleshooting

Quick steps to diagnose and fix "Failed to fetch" / CORS issues when using the NextSkill frontend (127.0.0.1:5500) and backend (127.0.0.1:8080).

## Symptoms
- Browser console shows `TypeError: Failed to fetch` or `CORS policy: No 'Access-Control-Allow-Origin' header`
- Preflight (OPTIONS) requests return 403/404/500
- Things work in a normal browser but fail inside VS Code's Simple Browser/webview

## Immediate Checks
1. Backend is up:
   - Visit http://127.0.0.1:8080/actuator/health and expect `{ "status": "UP" }`.
2. Frontend origin matches allowed origins:
   - Use http://127.0.0.1:5500 (not localhost; both are allowed, but be consistent).
   - Avoid VS Code's Simple Browser/webview origin; use your system browser.
3. Preflight succeeds:
   - The OPTIONS request to `http://127.0.0.1:8080/api/...` should return 200 with `Access-Control-Allow-Origin` and `Access-Control-Allow-Methods` headers.

## One-click Windows check
Run: `scripts\\cors-check.bat`
- Verifies backend health
- Sends a preflight OPTIONS request to `/api/auth/signin`
- Explains next steps if anything fails

## Backend Configuration Notes
- Spring Security enables CORS (`http.cors()`) and allows preflight (`OPTIONS /**`).
- Global CORS config allows origins: `http://127.0.0.1:5500`, `http://localhost:5500`, methods `GET, POST, PUT, DELETE, OPTIONS`.
- If editing origins, update `WebConfig.java` and restart the backend.

## If it still fails
- Kill anything on 8080/5500 and restart with `start-all.bat`.
- Clear browser cache and storage (or open `frontend/clear-data.html`).
- Check the backend logs for CORS filter messages or errors.
- Ensure you're not mixing `http://localhost` and `http://127.0.0.1` in the same session.

## Support
If issues persist, capture:
- Network tab: failing request and response headers
- Backend console output
- Exact frontend URL and browser used
Then share the details to reproduce.
