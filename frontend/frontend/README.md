# Frontend

React + Vite + TypeScript + TailwindCSS UI for GitLens AI.

## Setup

```bash
npm install
cp .env.example .env
```

## Run

```bash
npm run dev
```

App: http://localhost:5173  
Backend API URL: `VITE_API_URL` in `.env` (default `http://localhost:8000`)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — username search |
| `/dashboard/:username` | Analysis dashboard + history |
