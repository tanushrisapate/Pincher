from typing import Optional

from pydantic import BaseModel, Field


class WeatherData(BaseModel):
    city: Optional[str] = None
    locality: Optional[str] = None
    region: Optional[str] = None
    country: Optional[str] = None
    latitude: float
    longitude: float
    temperature: float
    temperature_unit: str = "°C"
    feels_like: float
    condition: str
    condition_code: int
    humidity: int = Field(ge=0, le=100)
    wind_speed: float = Field(ge=0)
    wind_speed_unit: str = "km/h"
    precipitation_mm: float = Field(ge=0)
    # Kept nullable for compatibility; Open-Meteo's current response provides
    # precipitation amount, not a current precipitation probability.
    rain_probability: Optional[int] = None
    icon: str
    observed_at: Optional[str] = None
    recommendation_summary: str
    location_attribution: str = "© OpenStreetMap contributors"


class WeatherResponse(BaseModel):
    success: bool
    data: WeatherData
