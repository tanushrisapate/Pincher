from typing import Optional
from pydantic import BaseModel

class WeatherData(BaseModel):
    city: str
    temperature: float
    feels_like: float
    condition: str
    condition_code: int
    humidity: int
    wind_speed: float
    rain_probability: int
    icon: str
    recommendation_summary: str

class WeatherResponse(BaseModel):
    success: bool
    data: WeatherData
