# Backend Service Architecture

## Tech Stack
- **Framework**: FastAPI
- **Language**: Python 3.11
- **Data Access**: HTTP clients for third-party APIs, with an abstraction layer in `app/clients`.
- **Async Execution**: AsyncIO-first implementation to support concurrent I/O.

## Directory Layout
- `app/main.py`: FastAPI application factory and entrypoint.
- `app/api/`: Route registration and versioning.
- `app/services/`: Business logic for RSI calculations and aggregation.
- `app/clients/`: External API adapters (e.g., CoinGecko, Coinbase).
- `app/schemas/`: Pydantic models shared between routes and services.
- `tests/`: Automated tests, initially focusing on API contracts.

## Next Steps
1. Implement real data fetching within `CoinGeckoClient` and handle rate limiting.
2. Build RSI calculation utilities and integrate them into `RSIService`.
3. Add persistence (e.g., Redis or PostgreSQL) for caching historical RSI values.
