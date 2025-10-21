# NextSkill – Intelligent Career Development Platform

NextSkill is a full-stack web app that guides users from goal selection to a personalized, weekly learning roadmap. It includes JWT auth, global CORS, 72 curated learning-path JSONs, and a deterministic AI fallback/signals generator.

## Stack
- Backend: Spring Boot (Java 17), Spring Security (JWT), H2, JPA, Flyway, Actuator, Apache Tika (resume parsing)
- Frontend: Static HTML + Tailwind + Three.js landing page, minimal auth and questionnaire pages
- Tests: Playwright E2E (baseURL → frontend origin)

## Quick start (Windows PowerShell)

1) Build backend
- From `nextskill-project/backend`:
	- `./mvnw.cmd -q -DskipTests package`

2) Run backend (port 8080)
- From `nextskill-project/backend`:
	- `./mvnw.cmd spring-boot:run`
- Health: http://localhost:8080/actuator/health → {"status":"UP"}

3) Serve frontend (port 5500)
- From `nextskill-project` (repo root):
	- `npm install --no-audit --no-fund`
	- `npm run serve:frontend`
- Open: http://127.0.0.1:5500/frontend/index.html

4) Flow
- `frontend/auth.html?form=signup` (or `?form=signin`) → token stored as `ns_token`
- Redirect to `frontend/questions.html`
- Answer questions, optionally upload resume → Generate roadmap → View saved roadmaps

## Endpoints

Public
- POST `/api/auth/signup` → { email, password } → { token }
- POST `/api/auth/signin` → { email, password } → { token }
- GET `/actuator/health` → { status: "UP" }

Authenticated (Authorization: Bearer <JWT>)
- POST `/api/questions/submit`
	- { role, experience, priority, timeCommitment, answers?: {k:v}, resumeText?: string } → returns questionnaireId (Long)
- POST `/api/resumes/upload` (multipart/form-data, field: `file`)
- POST `/api/roadmaps/generate`
	- { role, experience, priority, timeCommitment, answers?, resumeText?, questionnaireId? }
	- Behavior:
		- If answers/resumeText present → AI signals mode (deterministic plan)
		- Else → file-first (72 JSONs) with AI fallback if missing
	- Persists roadmap with `source` = json | ai | ai-signals
- GET `/api/roadmaps/mine` → list saved roadmaps

## Learning paths (72 JSONs)

- `backend/src/main/resources/learning-paths/{role}/`
- Naming: `{role}_{experience}_{priority}_{timeCommitment}.json`
- Roles: software-engineer, data-scientist, data-engineer, devops-engineer, product-manager, ux-designer
- Experience: junior | mid | senior; Priority: skills | projects; Time: part-time | full-time

## AI fallback and signals

- File-first: serve curated JSON when available.
- AI fallback: deterministic weekly plan when JSON is missing/blank.
- AI signals: when answers or resumeText present, bypass JSON and tailor sequence; saved with `source=ai-signals`.

## CORS and security

- Global CORS: allows `http://127.0.0.1:5500` and `http://localhost:5500` on `/api/**`.
- Stateless JWT security via `JwtAuthenticationFilter`.

## Database and migrations

- H2 (dev). Flyway migrations:
	- V1: users
	- V2: resume_uploads
	- V3: questionnaire_responses (+ adds `extracted_text` to resume_uploads)
	- V4: roadmaps

### Switch to PostgreSQL

Option 1 – Docker Postgres (recommended for local dev persistence):
- From repo root: `docker compose up -d`
- DB: postgres:16 on 5432 with DB/USER/PASS = nextskill/nextskill/nextskill
- Run backend with Postgres profile:
  - `./mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=postgres`

Option 2 – External Postgres:
- Set connection in `backend/src/main/resources/application-postgres.properties`
- Run with profile: `-Dspring-boot.run.profiles=postgres`

Back to H2:
- Run backend without the `postgres` profile; H2 dev config is in `application.properties`.

## Testing

- Playwright E2E
	- Install browsers: `npx playwright install`
	- Start backend: `./mvnw.cmd spring-boot:run`
	- Start frontend: `npm run serve:frontend`
	- Run tests: `npm run test:e2e`
- Specs:
	- `landing.spec.ts` – landing hero & CTA present
	- `auth.spec.ts` – auth page renders and inputs work
	- `auth-ui-flow.spec.ts` – CTA to signup, header Sign In navigation, signup redirect
	- `auth-duplicate.spec.ts` – duplicate signup UX, auto-switch to sign-in
	- `links.spec.ts` – link integrity and direct page loads
	- `questions.spec.ts` – signup → questionnaire → generate roadmap → output shown

## Repository structure

```
backend/           # Spring Boot service (API, JWT, resume parsing, roadmaps)
frontend/          # Static site (landing, auth, questions, roadmap)
scripts/           # Smoke tests and perf check (Node)
tests/             # Playwright end-to-end tests
archive/ref-frontend/  # Old reference UI kept for history
```

## CI

This repo includes a GitHub Actions workflow to:
- Build the backend (Maven)
- Start the Spring Boot server
- Install Node dependencies and Playwright browsers
- Run the E2E test suite

Badge will appear after the first workflow run on GitHub.

## Troubleshooting

- Prefer `http://127.0.0.1:5500` origin to avoid CORS or cookie issues.
- If PowerShell JSON quoting fails, use Postman or frontend pages.
- H2 is in-memory (dev); data resets on restart. Use a persistent DB for production.

## Why commit times show "x minutes ago"

GitHub displays the timestamp from when each commit was created (author/commit date). If you committed locally and pushed later, earlier commits will show an older timestamp (e.g., "35 minutes ago"). This is normal and doesn’t indicate a problem.

## Production guidance (summary)

- Externalize `security.jwt.secret` (env var), disable H2 console, restrict Actuator to health.
- Add file size/type limits for resumes and standardized error responses.