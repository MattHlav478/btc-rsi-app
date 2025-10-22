"""Configuration settings for the BTC RSI backend service."""

from functools import lru_cache

from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    rsi_timeframe: str = Field("1h", env="RSI_TIMEFRAME")
    coin_symbol: str = Field("bitcoin", env="COIN_SYMBOL")
    vs_currency: str = Field("usd", env="VS_CURRENCY")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    """Return a cached instance of application settings."""
    return Settings()
