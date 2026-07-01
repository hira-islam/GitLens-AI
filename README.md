# GitLens AI

A small, production-style full-stack learning project that analyzes a GitHub user's public profile and repositories, stores results in MongoDB, and displays a simple dashboard with rule-based "AI roast" commentary.

## Purpose

This project is designed to practice:

- React + Vite + TypeScript
- FastAPI + Motor (async MongoDB)
- Docker & Docker Compose
- GitHub Actions CI/CD
- Production-style deployment patterns

**Not a SaaS.** Keep it simple: one feature, no auth, no workers, no microservices.

## Architecture (3-Tier)

```
React Frontend  →  FastAPI REST API  →  MongoDB
                         ↓
                  GitHub Public API
```

## Repository Layout

| Path | Purpose |
|------|---------|
| [`frontend/`](frontend/) | React SPA (Vite, TypeScript, Tailwind) |
| [`backend/`](backend/) | FastAPI application |
| [`docker/`](docker/) | Dockerfiles and Compose configuration |
| [`docs/`](docs/) | Architecture, dependencies, and development plan |
| [`.github/`](.github/) | GitHub Actions workflows |

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — system design, API contracts, data models, deployment
- [Folder Structure](docs/FOLDER_STRUCTURE.md) — every directory explained
- [Dependencies](docs/DEPENDENCIES.md) — frontend, backend, and tooling packages
- [Development Plan](docs/DEVELOPMENT_PLAN.md) — phased implementation roadmap

## Quick Start (after implementation)

```bash
# Local development with Docker Compose
docker compose -f docker/docker-compose.yml up --build

# Frontend: http://localhost:5173
# Backend:  http://localhost:8000
# API docs: http://localhost:8000/docs
```

## MVP Feature

1. User enters a GitHub username on the Home page.
2. Backend fetches public GitHub data, computes stats, stores analysis in MongoDB.
3. Dashboard shows profile info, top repos, language breakdown, totals, and a rule-based roast.

## License

MIT (learning project)
