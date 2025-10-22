"""Pydantic schemas for RSI metrics returned by the API."""

from datetime import datetime
from pydantic import BaseModel, Field


class RSIMetrics(BaseModel):
    """Container for the latest Relative Strength Index metrics."""

    symbol: str = Field(..., description="Ticker symbol for the asset")
    timeframe: str = Field(..., description="Interval of the RSI calculation")
    value: float = Field(..., ge=0, le=100, description="Current RSI value")
    timestamp: datetime = Field(..., description="Timestamp of the latest datapoint")
