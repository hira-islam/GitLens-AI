# GitLens AI — System Architecture

## 1. Overview

GitLens AI is a **single-feature** full-stack application. A user submits a GitHub username; the backend aggregates public GitHub API data, computes statistics, persists the result in MongoDB, and returns a JSON payload the frontend renders as a dashboard.

### Design Principles

| Principle | Decision |
|-----------|----------|
| Simplicity | One main user flow, no auth, no background jobs |
| Modularity | Clear separation: API routes → services → DB |
| Learnability | Industry-standard layout, Docker, CI/CD |
| Production-style | Health checks, env config, structured logging (later phases) |

### High-Level Diagram

```mermaid
flowchart TB
    subgraph Client
        UI[React SPA]
    end

    subgraph Backend
        API[FastAPI Routers]
        SVC[Services Layer]
        GH[GitHub API Client]
        ROAST[Roast Engine]
        DBL[MongoDB Repository]
    end

    subgraph External
        GITHUB[GitHub REST API v3]
    end

    subgraph Data
        MONGO[(MongoDB)]
    end

    UI -->|POST /api/v1/analyze| API
    UI -->|GET /api/v1/analyses/{username}| API
    API --> SVC
    SVC --> GH
    GH --> GITHUB
    SVC --> ROAST
    SVC --> DBL
    DBL --> MONGO
    API -->|JSON| UI
```

---

## 2. Request Flow

### Analyze Flow (primary)

```
1. User types username → clicks "Analyze"
2. Frontend: POST /api/v1/analyze { "username": "octocat" }
3. Backend validates input (Pydantic)
4. GitHubService fetches:
   - GET /users/{username}
   - GET /users/{username}/repos?per_page=100&sort=updated
5. AnalysisService computes:
   - Top 5 repos (by stars)
   - Language aggregation
   - Total stars / forks
6. RoastService applies rule-based templates
7. AnalysisRepository upserts document in MongoDB
8. Backend returns AnalysisResponse JSON
9. Frontend navigates to /dashboard/:username and renders
```

### Optional: Cached Read

```
GET /api/v1/analyses/{username}
→ Return latest stored analysis from MongoDB (no GitHub call)
```

Useful for refresh-free navigation and demonstrating read vs write paths.

---

## 3. API Design

Base path: `/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Liveness probe (no DB required) |
| `GET` | `/health/ready` | Readiness (MongoDB ping) |
| `POST` | `/analyze` | Fetch GitHub data, analyze, persist, return |
| `GET` | `/analyses/{username}` | Return cached analysis by username |

### POST `/api/v1/analyze`

**Request body**

```json
{
  "username": "octocat"
}
```

**Response `200`**

```json
{
  "username": "octocat",
  "profile": {
    "avatar_url": "https://...",
    "name": "The Octocat",
    "bio": "...",
    "followers": 9000,
    "following": 9,
    "public_repos": 8
  },
  "top_repositories": [
    {
      "name": "Hello-World",
      "stars": 1500,
      "forks": 1200,
      "language": "Ruby",
      "html_url": "https://github.com/octocat/Hello-World"
    }
  ],
  "languages": [
    { "language": "Ruby", "count": 3, "percentage": 37.5 }
  ],
  "totals": {
    "stars": 5000,
    "forks": 2000
  },
  "roast": "You clearly love Ruby more than sleep.",
  "analyzed_at": "2026-06-27T12:00:00Z"
}
```

**Error responses**

| Status | When |
|--------|------|
| `400` | Invalid username format |
| `404` | GitHub user not found |
| `422` | Validation error (Pydantic) |
| `502` | GitHub API unreachable or rate-limited |
| `500` | Unexpected server error |

### GitHub API Notes

- Use **unauthenticated** public API (60 req/hr per IP) — sufficient for learning.
- Optional later: `GITHUB_TOKEN` env var for 5,000 req/hr.
- Respect `Link` header pagination if user has >100 repos (Phase 2 enhancement).

---

## 4. Backend Layer Responsibilities

```
api/          → HTTP: routing, status codes, dependency injection
schemas/      → Pydantic request/response models (API contract)
services/     → Business logic: GitHub fetch, stats, roast
models/       → Domain/document models (MongoDB shape)
db/           → Motor client, connection lifecycle, repository
core/         → Settings, constants, shared exceptions
utils/        → Small helpers (username normalize, date format)
```

**Dependency direction (strict):**

```
api → services → db
api → schemas
services → models, schemas, core, utils
db → models
```

Never import `api` from `services` or `db`.

---

## 5. Frontend Layer Responsibilities

```
pages/        → Route-level views (Home, Dashboard)
components/   → Reusable UI (Button, Card, StatGrid, RepoList)
layouts/      → App shell (header, main content area)
services/     → Axios API client
hooks/        → useAnalyze, useAnalysis (loading/error state)
types/        → TypeScript interfaces mirroring API responses
assets/       → Static images, icons
```

**Routing**

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Username input + Analyze button |
| `/dashboard/:username` | Dashboard | Full analysis view |

---

## 6. MongoDB Data Model

**Database:** `gitlens_ai`  
**Collection:** `analyses`

```json
{
  "_id": "ObjectId",
  "username": "octocat",
  "profile": { "...": "..." },
  "top_repositories": [ "..." ],
  "languages": [ "..." ],
  "totals": { "stars": 0, "forks": 0 },
  "roast": "string",
  "analyzed_at": "ISODate",
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```

**Indexes**

| Index | Type | Purpose |
|-------|------|---------|
| `{ username: 1 }` | unique | Fast lookup, one canonical doc per user |
| `{ analyzed_at: -1 }` | single | Sort recent analyses (future admin view) |

**Upsert strategy:** `replace_one({ username }, doc, upsert=True)` on each analyze.

---

## 7. Roast Engine (Rule-Based)

No LLM. `RoastService` inspects computed stats and picks the first matching rule.

Example rules (priority order):

| Condition | Roast template |
|-----------|----------------|
| Top language ≥ 60% of repos | `"You clearly love {language} more than sleep."` |
| Total stars > 10,000 | `"GitHub should pay you rent."` |
| public_repos > 50 | `"Do you even remember what sunlight looks like?"` |
| forks > stars | `"People fix your code more than they star it. Interesting."` |
| No language data | `"Mystery developer — all README, no commits?"` |
| Default | `"Solid GitHub presence. Nothing roast-worthy… yet."` |

Rules live in `backend/app/services/roast_service.py` as a declarative list for easy extension.

---

## 8. Docker & Deployment Architecture

### Services (docker-compose)

| Service | Image / Build | Port | Role |
|---------|---------------|------|------|
| `frontend` | `docker/Dockerfile.frontend` | 5173 (dev) / 80 (prod) | Nginx serves static build |
| `backend` | `docker/Dockerfile.backend` | 8000 | Uvicorn + FastAPI |
| `mongodb` | `mongo:7` | 27017 | Database |

### Networking

- All services on shared bridge network `gitlens-net`.
- Frontend calls backend via `VITE_API_URL` (browser → host port in dev).
- Backend connects to MongoDB via `MONGODB_URL=mongodb://mongodb:27017`.

### Environment Variables

| Variable | Service | Description |
|----------|---------|-------------|
| `MONGODB_URL` | backend | Mongo connection string |
| `MONGODB_DB_NAME` | backend | Database name |
| `GITHUB_TOKEN` | backend | Optional PAT for higher rate limits |
| `CORS_ORIGINS` | backend | Allowed frontend origins |
| `VITE_API_URL` | frontend (build) | Backend base URL |

---

## 9. CI/CD (GitHub Actions)

### Workflow: `ci.yml` (on PR + push to main)

```
jobs:
  backend-lint-test:
    - pip install -r requirements.txt
    - ruff check
    - pytest

  frontend-lint-build:
    - npm ci
    - npm run lint
    - npm run build

  docker-build:
    - docker build backend
    - docker build frontend
    (smoke test: compose up, hit /health)
```

### Workflow: `cd.yml` (on tag or manual dispatch — optional Phase 4)

- Build and push images to GitHub Container Registry (or Docker Hub).
- Deploy to a single VPS or cloud run service.

Keep CD minimal for learning; focus on CI first.

---

## 10. Cross-Cutting Concerns

| Concern | Approach |
|---------|----------|
| CORS | FastAPI `CORSMiddleware` — allow frontend origin |
| Logging | Python `logging` module; JSON in production later |
| Errors | Custom exceptions in `core/exceptions.py`; mapped in API layer |
| Config | `pydantic-settings` in `core/config.py` |
| API docs | Auto-generated OpenAPI at `/docs` |
| Health | `/health` for Docker `HEALTHCHECK` |

---

## 11. Security (Minimal, Learning Scope)

- No authentication (by design).
- Validate and sanitize GitHub usernames (alphanumeric + hyphen, max 39 chars).
- Never expose `GITHUB_TOKEN` to frontend.
- Use `.env.example` files; real secrets in `.env` (gitignored).
- Rate-limit analyze endpoint optionally (in-memory, Phase 3).

---

## 12. What We Are NOT Building

- User accounts / JWT / OAuth
- Redis, Celery, message queues
- Microservices or API gateway
- LLM integration
- Real-time WebSockets
- Admin panel (unless stretch goal)

This scope keeps the architecture teachable and completable.
