## Deployment guide (stable, smooth, parallel dev)

This project is split into a static frontend (`frontend/`) and a Spring Boot backend (`backend/`). Below are two production-grade setups that let you keep coding locally while friends use a stable public link.

Recommended combo: Netlify (frontend) + Render (backend) + Neon Postgres.

Why:
- Stable URLs and hassle-free hosting
- Preview deploys for every PR on Netlify
- Auto-deploy on push to main for both
- Managed Postgres; keep H2 for local dev

---

## 1) Backend on Render + Neon (Postgres)

### Option A: One-click with render.yaml (recommended)
1. Create a Neon Postgres database and copy the connection string.
2. Fork this repo to your GitHub account.
3. Visit [Render Dashboard](https://dashboard.render.com) → "New" → "Blueprint".
4. Connect your GitHub repo; Render reads `render.yaml` automatically.
5. Set the missing env vars in Render dashboard:
   - `SPRING_DATASOURCE_URL=<your Neon JDBC URL>`
   - `SPRING_DATASOURCE_USERNAME=<neon user>`
   - `SPRING_DATASOURCE_PASSWORD=<neon password>`
6. Deploy! Render auto-generates `JWT_SECRET` and sets other defaults.

### Option B: Manual setup
1. Create a Neon Postgres database and copy the connection string (JDBC form):
   - Example: `jdbc:postgresql://ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`

2. On Render, create a new Web Service from this repo, root at `backend/`.
   - Build Command: `./mvnw -DskipTests package`
   - Start Command: `java -jar target/backend-0.0.1-SNAPSHOT.jar`

3. In Render → Environment → Add these variables:
   - `SPRING_PROFILES_ACTIVE=prod`
   - `SPRING_DATASOURCE_URL=<your Neon JDBC URL>`
   - `SPRING_DATASOURCE_USERNAME=<neon user>`
   - `SPRING_DATASOURCE_PASSWORD=<neon password>`
   - `JWT_SECRET=<long-random-secret>`
   - `CORS_ALLOWED_ORIGINS=https://your-site.netlify.app,https://*.netlify.app,https://your-site.vercel.app,https://*.vercel.app`

Notes:
- Flyway runs automatically (migrations in `backend/src/main/resources/db/migration`).
- We already switched CORS to `allowedOriginPatterns` to support wildcards (e.g., `*.netlify.app`).

---

## 2) Frontend on Netlify (proxy to backend, no CORS in prod)

Use the provided `netlify.toml` to publish the `frontend/` directory and proxy `/api/*` to your backend.

### Quick setup steps:
1. In Netlify, "New site from Git" → pick your GitHub repo
2. Build command: (leave empty)  
3. Publish directory: `frontend`
4. Deploy site to get initial URL (e.g., `amazing-name-123.netlify.app`)

### Configure backend proxy:
1. Edit `netlify.toml` and replace `your-backend-name` with your actual Render service name.
2. Add production config to your frontend pages (auth.html, questions.html, roadmap.html):
   ```html
   <script src="./assets/js/config.prod.js"></script>
   <script src="./assets/js/http.js"></script>
   ```
3. Push changes to trigger redeploy.

### Result:
- Production frontend calls `/api/...` → Netlify proxies to your backend
- No CORS issues; same-origin requests  
- Automatic preview URLs for each PR

---

## 3) Frontend on Vercel (alternative)

Vercel supports rewrites via `vercel.json`. Because the repository root includes both frontend and backend, set the project’s Root Directory to `frontend` in Vercel UI. Then add the rewrite (see `vercel.json` in the repo) and redeploy. For PRs, Vercel creates preview URLs automatically.

Two options:
1) Use rewrites to proxy `/api/*` to backend (preferred: no CORS):
   - Ensure `vercel.json` contains the rewrite to your backend URL
   - Add `<script>window.NS_CONFIG = { API_BASE: '' };</script>` before `assets/js/http.js`

2) Call backend directly (CORS enabled):
   - Add `<script>window.NS_CONFIG = { API_BASE: 'https://your-backend.onrender.com' };</script>`
   - Ensure `CORS_ALLOWED_ORIGINS` includes `https://your-site.vercel.app` and `https://*.vercel.app`

---

## 4) Parallel development workflow

- Keep coding locally on feature branches. Use H2 DB locally; production uses Postgres.
- Netlify/Vercel produce preview links on each PR. Share those with friends for testing.
- Merge to `main` → production frontend deploy. Render can also auto-deploy backend on push to `main`.
- If you need a staging backend, create a second Render service and point preview rewrites to it.

---

## 5) Quick checklist

- [ ] Backend up on Render with env vars and Neon Postgres URL
- [ ] Netlify site publishing `frontend/` with `netlify.toml` proxy pointing to backend
- [ ] Frontend pages include `<script>window.NS_CONFIG = { API_BASE: '' };</script>` before `assets/js/http.js`
- [ ] Test in browser: load site → sign up → sign in → use app
- [ ] (Optional) Vercel alternative configured with rewrites and Root Directory set to `frontend`

---

## 6) Troubleshooting

- If prod frontend calls fail: confirm proxy rewrites (Netlify/Vercel) and that `NS_CONFIG.API_BASE` is `''` (for proxy) or an absolute backend URL.
- If direct calls with CORS: ensure backend env `CORS_ALLOWED_ORIGINS` includes your final frontend domain and wildcard previews.
- If backend fails to start: check Render logs, Postgres credentials, and `SPRING_PROFILES_ACTIVE=prod`.
