"""Service layer for retrieving RSI metrics."""

from datetime import datetime, timezone

from ..schemas.rsi import RSIMetrics


class RSIService:
    """Placeholder RSI service that will later integrate with data providers."""

    def get_latest_metrics(self) -> RSIMetrics:
        """Return placeholder RSI metrics until the data pipeline is implemented."""
        return RSIMetrics(
            symbol="BTC-USD",
            timeframe="1h",
            value=50.0,
            timestamp=datetime.now(tz=timezone.utc),
        )
