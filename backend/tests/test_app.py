"""Placeholder tests for the backend FastAPI application."""

from fastapi.testclient import TestClient

from app.main import app


def test_healthcheck_placeholder() -> None:
    """Ensure the API router is mounted and returns a 200 for the RSI endpoint."""
    client = TestClient(app)
    response = client.get("/api/rsi")
    assert response.status_code == 200
    body = response.json()
    assert body["symbol"] == "BTC-USD"
