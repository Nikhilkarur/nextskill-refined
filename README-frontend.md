# Frontend Integration Notes (NextSkill)

This document maps the frontend pages to backend endpoints and captures key UX/a11y/performance/testing guidelines. Landing page remains unchanged.

## Pages
- `frontend/index.html`: Landing (untouched)
- `frontend/auth.html`: Sign In/Up → POST `/api/auth/signin|signup` → `{ token }` stored as `ns_token`
- `frontend/questions.html`: Questionnaire + optional resume →
  - POST `/api/questions/submit` → `questionnaireId: number`
  - POST `/api/resumes/upload` (multipart; optional)
  - POST `/api/roadmaps/generate` with `{ role, experience, priority, timeCommitment, answers?, resumeText?, questionnaireId? }` → JSON string
  - Redirects to `roadmap.html?roadmapId=<id>` when possible, or relies on `lastRoadmap` in localStorage fallback
- `frontend/roadmap.html`: Loads the latest roadmap (by `?roadmapId`, by state, or history)
  - GET `/api/roadmaps/mine` → history list
  - GET `/api/roadmaps/{id}` → full JSON content (`contentJson`)
  - Views: Galaxy (Cytoscape), Timeline (pure CSS/JS), Kanban (client-side drag & drop with local persistence).

## Data shapes (from backend DTOs)
- AuthRequest: `{ email, password }` → AuthResponse: `{ token }`
- QuestionnaireRequest:
  ```json
  {
    "role": "software-engineer|data-scientist|data-engineer|devops-engineer|product-manager|ux-designer",
    "experience": "junior|mid|senior",
    "priority": "skills|projects",
    "timeCommitment": "part-time|full-time",
    "answers": { "string": "string" },
    "resumeText": "optional"
  }
  ```
- RoadmapRequestExtended: same base fields + `answers?`, `resumeText?`, `questionnaireId?`
- Roadmap content JSON structure varies; UI expects a common shape:
  ```json
  {
    "phases": [
      {
        "title": "Phase title",
        "weeks": 2,
        "modules": [
          {
            "title": "Module title",
            "tasks": [ { "title": "Task", "prerequisiteIds": [/* optional */] } ]
          }
        ]
      }
    ]
  }
  ```
  The UI degrades gracefully if fields are missing.

## Theming and components
- Tokens: `assets/css/tokens.css` (colors, gradients, shadows)
- Components: `assets/css/components.css` (buttons, inputs, glass cards, chips)
- Do not modify landing styles; apply classes selectively on other pages.

## State, auth, and routing
- JWT stored in `localStorage` as `ns_token` (auth.html); `assets/js/http.js` attaches Authorization automatically
- Lightweight state store in `assets/js/state.js` tracks `lastRoadmap` and `uiPrefs.roadmapView`
- MPA routing; redirects via query params like `?roadmapId`

## Accessibility and performance
- Color contrast target AA+ on interactive elements; verify with browser devtools
- Visible focus: buttons, links, and controls use clear focus rings; avoid removing outline
- Use semantic containers: headings link regions (aria-labelledby), fieldset/legend for grouped controls
- Reduced motion: Galaxy view respects `prefers-reduced-motion` and disables animation
- Performance: lazy-load Cytoscape only on `roadmap.html`; avoid loading heavy libs on other pages
- Defer non-critical work; cache/persist user prefs (view mode) and Kanban board in localStorage

## Testing suggestions
- E2E (Playwright):
  - Auth → Questions → Generate Roadmap → confirm JSON appears and history is populated; redirect occurs
  - Roadmap toggles: click Galaxy/Timeline/Kanban and assert sections visibility via `data-testid`
  - Galaxy smoke: assert canvas exists and tooltip appears on node hover (no strict positioning)
  - Kanban: drag card across columns; counts update; refresh persists placement
- Visual regression (optional): screenshots for auth, questions, and roadmap views
- Unit tests (optional): pure functions (formatJson, state helpers) using a lightweight test runner

## Analytics (optional and consent-gated)
- Track view toggles (Galaxy/Timeline/Kanban) and completion milestones with anonymized events
- Respect DNT and provide a toggle to disable analytics; store consent locally and gate all sends

## Future work
- Galaxy: node grouping, color by category/priority, and per-node progress
- Timeline: horizontal mode and phase/week scale
- Kanban: optional backend sync endpoint for persisted progress
- Export: PNG/PDF
