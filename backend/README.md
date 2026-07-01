# Backend

FastAPI REST API for GitLens AI.

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
cp .env.example .env            # adjust if needed
```

## Run MongoDB

```bash
docker run -d --name gitlens-mongo -p 27017:27017 mongo:7
```

## Start API

```bash
uvicorn main:app --reload
```

- API: http://localhost:8000
- Docs: http://localhost:8000/docs

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health message |
| GET | `/health` | `{ "status": "healthy" }` |
| POST | `/analyze` | Analyze GitHub user |
| GET | `/history` | Previous analyses |
