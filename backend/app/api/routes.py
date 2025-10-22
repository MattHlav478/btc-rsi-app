"""API route registration for the BTC RSI backend service."""

from fastapi import APIRouter, FastAPI

from ..schemas.rsi import RSIMetrics
from ..services.rsi_service import RSIService


api_router = APIRouter(prefix="/api", tags=["metrics"])


@api_router.get("/rsi", response_model=RSIMetrics)
def get_rsi() -> RSIMetrics:
    """Placeholder RSI endpoint that will surface computed RSI metrics."""
    service = RSIService()
    return service.get_latest_metrics()


def register_routes(app: FastAPI) -> None:
    """Attach API routes to the provided FastAPI app."""
    app.include_router(api_router)
