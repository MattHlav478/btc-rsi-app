# BTC RSI Application Architecture Overview

The BTC RSI application consists of the following high-level components:

- **Backend (FastAPI)**: Exposes REST endpoints for RSI data, orchestrates ingestion from third-party APIs, and will host the RSI calculation engine.
- **Frontend (React + Vite)**: Provides a browser-based dashboard for visualising current and historical RSI metrics.
- **Data Providers**: External cryptocurrency APIs (e.g., CoinGecko) that supply OHLC price data for RSI calculations.
- **Infrastructure**: Containerisation, orchestration, and CI/CD resources to deploy the system.

This document will evolve as the implementation matures. Refer to component-specific documents in this folder for deeper dives.
