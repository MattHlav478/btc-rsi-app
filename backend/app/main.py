"""Application entrypoint for the BTC RSI backend service."""

from fastapi import FastAPI

from .api.routes import register_routes


def create_app() -> FastAPI:
    """Create and configure the FastAPI application instance."""
    app = FastAPI(title="BTC RSI Service", version="0.1.0")
    register_routes(app)
    return app


app = create_app()
