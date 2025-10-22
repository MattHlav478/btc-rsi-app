"""HTTP client stub for interacting with the CoinGecko API."""

from typing import Any, Dict

import httpx


class CoinGeckoClient:
    """Thin wrapper around the CoinGecko REST API."""

    BASE_URL = "https://api.coingecko.com/api/v3"

    async def get_market_chart(self, symbol: str, vs_currency: str, days: int) -> Dict[str, Any]:
        """Placeholder coroutine for fetching market data."""
        async with httpx.AsyncClient(base_url=self.BASE_URL) as client:
            response = await client.get(
                "/coins/{symbol}/market_chart".format(symbol=symbol),
                params={"vs_currency": vs_currency, "days": days},
            )
            response.raise_for_status()
            return response.json()
