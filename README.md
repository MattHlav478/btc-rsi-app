# BTC RSI Application

This repository contains the initial scaffolding for a Bitcoin Relative Strength Index (RSI) dashboard. The project is organised into backend, frontend, infrastructure, and documentation domains following the previously defined plan.

## Project Structure

```
.
├── backend/              # FastAPI service delivering RSI metrics
├── frontend/             # React + Vite single-page dashboard
├── docs/                 # Architecture overviews and decision records
├── infrastructure/       # Containerisation and deployment assets
├── scripts/              # Developer tooling and setup scripts
└── docker-compose.yml    # Local multi-service orchestration
```

## Getting Started

1. **Backend**
   ```bash
   cd backend
   poetry install
   poetry run uvicorn app.main:app --reload
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Visit `http://localhost:5173` to view the dashboard. The frontend fetches RSI data from the backend at `http://localhost:8000/api/rsi`.

Additional architecture notes can be found in `docs/architecture/overview.md`.
