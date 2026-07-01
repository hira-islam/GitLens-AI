# GitLens AI — Folder Structure

Complete monorepo layout with purpose of every directory and planned file.

```
gitlens-ai/
├── frontend/
├── backend/
├── docker/
├── docs/
├── .github/
├── README.md
└── .gitignore
```

---

## Root

| Item | Purpose |
|------|---------|
| `README.md` | Project overview, links to docs, quick-start commands |
| `.gitignore` | Ignore node_modules, venv, .env, build artifacts |

---

## `frontend/`

React single-page application built with Vite.

```
frontend/
├── public/                 # Static files copied as-is (favicon, etc.)
├── src/
│   ├── components/         # Reusable UI building blocks
│   ├── pages/              # One component per route
│   ├── services/           # HTTP client (Axios) and API functions
│   ├── hooks/              # Custom React hooks (data fetching, form state)
│   ├── types/              # TypeScript interfaces for API models
│   ├── layouts/            # Page wrappers (header, footer, main)
│   ├── assets/             # Images, fonts, local static imports
│   ├── App.tsx             # Root component: router setup
│   └── main.tsx            # Vite entry: mounts React to DOM
├── index.html              # HTML shell
├── package.json            # NPM dependencies and scripts
├── tsconfig.json           # TypeScript compiler options
├── tsconfig.node.json      # TS config for Vite config file
├── vite.config.ts          # Vite dev server and build settings
├── tailwind.config.js      # Tailwind theme and content paths
├── postcss.config.js       # PostCSS pipeline for Tailwind
├── .env.example            # VITE_API_URL template
└── README.md               # Frontend-specific dev instructions
```

### `frontend/src/components/`

Small, focused, reusable UI pieces.

| Planned file | Role |
|--------------|------|
| `UsernameForm.tsx` | Input + Analyze button + validation message |
| `LoadingSpinner.tsx` | Loading indicator during API call |
| `ProfileHeader.tsx` | Avatar, name, bio, follower counts |
| `StatCard.tsx` | Single metric display (stars, forks, etc.) |
| `RepoList.tsx` | Top 5 repositories list |
| `LanguageChart.tsx` | Language breakdown (bars or simple list) |
| `RoastBanner.tsx` | Styled "AI Roast" quote section |
| `ErrorAlert.tsx` | User-friendly error display |

### `frontend/src/pages/`

Route-level containers that compose components and hooks.

| Planned file | Route | Role |
|--------------|-------|------|
| `HomePage.tsx` | `/` | Username input, triggers analyze |
| `DashboardPage.tsx` | `/dashboard/:username` | Full analysis dashboard |
| `NotFoundPage.tsx` | `*` | 404 fallback |

### `frontend/src/services/`

| Planned file | Role |
|--------------|------|
| `api.ts` | Axios instance (base URL, interceptors) |
| `analysisService.ts` | `analyzeUser()`, `getAnalysis()` API calls |

### `frontend/src/hooks/`

| Planned file | Role |
|--------------|------|
| `useAnalyze.ts` | POST analyze: loading, error, redirect on success |
| `useAnalysis.ts` | GET cached analysis for dashboard |

### `frontend/src/types/`

| Planned file | Role |
|--------------|------|
| `analysis.ts` | `Analysis`, `Profile`, `Repository`, `LanguageStat` interfaces |

### `frontend/src/layouts/`

| Planned file | Role |
|--------------|------|
| `MainLayout.tsx` | App header, outlet for pages, consistent padding |

### `frontend/src/assets/`

Static imports (logos, empty-state illustrations). Keep minimal for MVP.

---

## `backend/`

FastAPI application with async MongoDB access.

```
backend/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── analyze.py      # POST /analyze
│   │   │   │   ├── analyses.py     # GET /analyses/{username}
│   │   │   │   └── health.py       # GET /health, /health/ready
│   │   │   └── router.py           # Aggregates v1 routes
│   │   └── deps.py                 # FastAPI dependencies (DB, services)
│   ├── core/
│   │   ├── config.py               # Settings via pydantic-settings
│   │   ├── exceptions.py           # AppException hierarchy
│   │   └── constants.py            # GitHub API URLs, limits
│   ├── models/
│   │   └── analysis.py             # MongoDB document model (dataclass or TypedDict)
│   ├── schemas/
│   │   ├── analyze.py              # AnalyzeRequest
│   │   └── analysis.py             # AnalysisResponse, nested schemas
│   ├── services/
│   │   ├── github_service.py       # GitHub API HTTP client
│   │   ├── analysis_service.py     # Stats computation
│   │   └── roast_service.py        # Rule-based roast generation
│   ├── db/
│   │   ├── mongodb.py              # Motor client connect/disconnect
│   │   └── analysis_repository.py  # CRUD for analyses collection
│   └── utils/
│       └── github.py               # Username validation, normalization
├── tests/
│   ├── conftest.py                 # Pytest fixtures (TestClient, mock DB)
│   ├── test_health.py
│   ├── test_analyze.py
│   └── test_roast_service.py
├── main.py                         # FastAPI app factory, lifespan, CORS
├── requirements.txt                # Python dependencies
├── .env.example                    # Environment variable template
└── README.md                       # Backend dev instructions
```

### `backend/app/api/`

HTTP layer only. Parses requests, calls services, returns responses. No business logic.

### `backend/app/core/`

Application-wide configuration and shared primitives.

### `backend/app/models/`

Internal representation of persisted data. Mirrors MongoDB documents.

### `backend/app/schemas/`

Pydantic models for API input/output. Single source of truth for OpenAPI docs.

### `backend/app/services/`

All business logic. Testable without HTTP layer.

### `backend/app/db/`

Database connection management and repository pattern for MongoDB.

### `backend/app/utils/`

Pure helper functions with no side effects.

### `backend/tests/`

Unit and integration tests. Mock GitHub API in tests (no live calls in CI).

---

## `docker/`

Container definitions and orchestration.

```
docker/
├── Dockerfile.backend          # Multi-stage: install deps, run uvicorn
├── Dockerfile.frontend         # Build React, serve with nginx
├── docker-compose.yml          # Dev: hot-reload mounts (optional override)
├── docker-compose.prod.yml     # Prod: optimized images, no volume mounts
├── nginx/
│   └── default.conf            # SPA fallback routing for React
└── README.md                   # Docker usage and commands
```

| File | Purpose |
|------|---------|
| `Dockerfile.backend` | Python 3.12 slim, non-root user, healthcheck |
| `Dockerfile.frontend` | Node build stage → nginx alpine runtime |
| `docker-compose.yml` | Local dev: backend + frontend + mongodb |
| `docker-compose.prod.yml` | Production-like stack without dev mounts |

---

## `docs/`

Project documentation (you are here).

```
docs/
├── ARCHITECTURE.md             # System design, API, data model
├── FOLDER_STRUCTURE.md         # This file
├── DEPENDENCIES.md             # Package lists and rationale
└── DEVELOPMENT_PLAN.md         # Phased implementation roadmap
```

---

## `.github/`

GitHub Actions CI/CD workflows.

```
.github/
└── workflows/
    ├── ci.yml                  # Lint, test, build on PR/push
    └── cd.yml                  # Optional: deploy on release tag
```

| Workflow | Triggers | Jobs |
|----------|----------|------|
| `ci.yml` | `push`, `pull_request` → `main` | backend test, frontend build, docker build |
| `cd.yml` | `workflow_dispatch`, tags `v*` | Build/push images (Phase 4) |

---

## File Count Summary (MVP)

| Area | Approx. files |
|------|---------------|
| Frontend | ~20 source files |
| Backend | ~18 source files |
| Docker | 5 files |
| CI | 1–2 workflows |
| Docs | 4 files |

Small enough to understand end-to-end in a weekend; structured enough to mirror real teams.
