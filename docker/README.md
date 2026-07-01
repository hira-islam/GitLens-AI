# Docker

Container definitions and Docker Compose orchestration.

## Planned files

| File | Purpose |
|------|---------|
| `Dockerfile.backend` | Python 3.12 image running Uvicorn |
| `Dockerfile.frontend` | Node build → nginx static serve |
| `docker-compose.yml` | Local dev: frontend + backend + MongoDB |
| `docker-compose.prod.yml` | Production-like stack |
| `nginx/default.conf` | SPA routing (fallback to index.html) |

## Usage (after implementation)

```bash
# From repo root
docker compose -f docker/docker-compose.yml up --build
```

See [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) §8 for networking and env vars.
