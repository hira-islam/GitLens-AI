# GitLens AI — Dependencies

Pinned versions can be adjusted during implementation. These are recommended starting points for a learning project in 2026.

---

## Frontend (`frontend/package.json`)

### Production dependencies

| Package | Version (approx.) | Purpose |
|---------|-------------------|---------|
| `react` | ^18.3.x | UI library |
| `react-dom` | ^18.3.x | React DOM renderer |
| `react-router-dom` | ^6.x | Client-side routing (`/`, `/dashboard/:username`) |
| `axios` | ^1.7.x | HTTP client for FastAPI calls |

### Dev dependencies

| Package | Version (approx.) | Purpose |
|---------|-------------------|---------|
| `vite` | ^5.x | Dev server and production bundler |
| `@vitejs/plugin-react` | ^4.x | React Fast Refresh for Vite |
| `typescript` | ^5.x | Static typing |
| `tailwindcss` | ^3.4.x | Utility-first CSS |
| `postcss` | ^8.x | CSS processing (required by Tailwind) |
| `autoprefixer` | ^10.x | Vendor prefixes for CSS |
| `@types/react` | ^18.x | React TypeScript types |
| `@types/react-dom` | ^18.x | ReactDOM TypeScript types |
| `eslint` | ^9.x | Linting |
| `@eslint/js` | ^9.x | ESLint flat config base |
| `typescript-eslint` | ^8.x | TypeScript ESLint rules |
| `eslint-plugin-react-hooks` | ^5.x | Hooks lint rules |
| `eslint-plugin-react-refresh` | ^0.4.x | Vite React refresh lint |

### NPM scripts (planned)

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "lint": "eslint ."
}
```

---

## Backend (`backend/requirements.txt`)

### Core

| Package | Version (approx.) | Purpose |
|---------|-------------------|---------|
| `fastapi` | >=0.115,<1.0 | Web framework |
| `uvicorn[standard]` | >=0.30,<1.0 | ASGI server |
| `pydantic` | >=2.0,<3.0 | Data validation (included with FastAPI) |
| `pydantic-settings` | >=2.0,<3.0 | Environment-based configuration |
| `motor` | >=3.5,<4.0 | Async MongoDB driver |
| `httpx` | >=0.27,<1.0 | Async HTTP client for GitHub API |

### Development & testing

| Package | Version (approx.) | Purpose |
|---------|-------------------|---------|
| `pytest` | >=8.0,<9.0 | Test runner |
| `pytest-asyncio` | >=0.24,<1.0 | Async test support |
| `httpx` | (shared) | FastAPI `TestClient` / async test client |
| `ruff` | >=0.6,<1.0 | Fast Python linter and formatter |
| `python-dotenv` | >=1.0,<2.0 | Load `.env` in local dev |

### Example `requirements.txt`

```
# Core
fastapi>=0.115.0,<1.0.0
uvicorn[standard]>=0.30.0,<1.0.0
pydantic-settings>=2.0.0,<3.0.0
motor>=3.5.0,<4.0.0
httpx>=0.27.0,<1.0.0

# Dev / test
pytest>=8.0.0,<9.0.0
pytest-asyncio>=0.24.0,<1.0.0
ruff>=0.6.0,<1.0.0
python-dotenv>=1.0.0,<2.0.0
```

---

## Docker Base Images

| Image | Tag | Used in |
|-------|-----|---------|
| `python` | `3.12-slim` | Backend Dockerfile |
| `node` | `20-alpine` | Frontend build stage |
| `nginx` | `alpine` | Frontend production serve |
| `mongo` | `7` | Database service |

---

## GitHub Actions (CI runners)

No extra packages in repo — workflows install from `requirements.txt` and `package.json`.

| Action | Purpose |
|--------|---------|
| `actions/checkout@v4` | Clone repository |
| `actions/setup-python@v5` | Python 3.12 for backend |
| `actions/setup-node@v4` | Node 20 for frontend |
| `docker/setup-buildx-action@v3` | Docker image builds |
| `docker/build-push-action@v6` | Build (and optionally push) images |

---

## Optional (later phases)

| Package | When to add |
|---------|-------------|
| `slowapi` | If you add rate limiting to `/analyze` |
| `@tanstack/react-query` | If dashboard caching/refetch gets complex |
| `pre-commit` | Local git hooks mirroring CI |
| `mypy` | Stricter Python type checking |

---

## Dependency Philosophy

1. **Fewer packages = easier learning.** Every dependency should earn its place.
2. **Pin major versions** in requirements; use lockfiles (`package-lock.json`) for frontend.
3. **No ORMs** — Motor + plain documents keeps MongoDB learning direct.
4. **httpx over requests** — native async fits FastAPI + Motor.
